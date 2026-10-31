'use strict';

const assert = require('node:assert/strict');
const TWPetSync = require('../pet-sync.js');

function makeHarness(rpc, overrides = {}) {
  let clock = 100000;
  let version = 0;
  let nick = 'tester';
  let payload = { pet: { v: 1, ativo: 'tsu', pets: { tsu: { fome: 80 } } }, visual: { acc: 'laco' } };
  let savedState = null;
  let nextTimer = 1;
  const timers = new Map();
  const calls = [];
  const events = [];

  const sync = TWPetSync.create({
    rpc: (name, args) => {
      calls.push({ name, args });
      return rpc(name, args, { payload, version, clock, calls });
    },
    isEnabled: () => true,
    getNick: () => nick,
    getPayload: () => JSON.parse(JSON.stringify(payload)),
    getVersion: () => version,
    setVersion: (ms) => { version = ms; },
    readState: () => savedState,
    writeState: (state) => { savedState = state; },
    onState: (status, state) => events.push({ status, state }),
    now: () => clock,
    setTimeout: (fn, delay) => {
      const id = nextTimer++;
      timers.set(id, { fn, at: clock + delay });
      return id;
    },
    clearTimeout: (id) => timers.delete(id),
    debounceMs: 8000,
    retryBaseMs: 2500,
    retryMaxMs: 10000,
    ...overrides
  });

  async function drain() {
    for (let i = 0; i < 12; i++) await Promise.resolve();
  }
  async function advance(ms) {
    clock += ms;
    for (;;) {
      let chosen = null;
      for (const [id, item] of timers) {
        if (item.at <= clock && (!chosen || item.at < chosen.item.at)) chosen = { id, item };
      }
      if (!chosen) break;
      timers.delete(chosen.id);
      chosen.item.fn();
      await drain();
    }
    await drain();
  }

  return {
    sync, calls, events, timers, advance, drain,
    get state() { return savedState; },
    get version() { return version; },
    get payload() { return payload; },
    setPayload(value) { payload = value; },
    setNick(value) { nick = value; }
  };
}

async function testFalhaERepeticao() {
  let saves = 0;
  const h = makeHarness((name) => {
    if (name === 'salvar_nuvem') {
      saves++;
      if (saves === 1) return Promise.reject(new Error('offline'));
      return Promise.resolve({ ok: true });
    }
    throw new Error('RPC inesperada: ' + name);
  });

  h.sync.markDirty();
  const first = await h.sync.flush();
  assert.equal(first.retry, true, 'a falha de rede precisa deixar o save pendente');
  assert.equal(h.sync.getState().pending, true);
  assert.equal(h.sync.getState().status, 'error');
  assert.equal(saves, 1);

  await h.advance(2499);
  assert.equal(saves, 1, 'não deve repetir antes do intervalo de backoff');
  await h.advance(1);
  assert.equal(saves, 2, 'deve repetir automaticamente');
  assert.equal(h.sync.getState().pending, false, 'a repetição confirmada limpa a pendência');
  assert.equal(h.sync.getState().status, 'confirmed');
  assert.equal(h.sync.getState().confirmedMs, h.version);
}

async function testConfirmacaoSoAposResposta() {
  let resolveSave;
  const h = makeHarness((name) => {
    if (name === 'salvar_nuvem') return new Promise((resolve) => { resolveSave = resolve; });
    throw new Error('RPC inesperada: ' + name);
  });

  h.sync.markDirty();
  const request = h.sync.flush();
  await h.drain();
  assert.equal(h.sync.getState().pending, true, 'enviar não é confirmar');
  assert.equal(h.sync.getState().status, 'syncing');
  assert.equal(typeof resolveSave, 'function');

  resolveSave({ ok: true });
  const result = await request;
  assert.equal(result.confirmed, true);
  assert.equal(h.sync.getState().pending, false);
  assert.equal(h.sync.getState().status, 'confirmed');
}

async function testMudancaDuranteEnvioNaoSePerde() {
  let resolveFirst;
  let saves = 0;
  const h = makeHarness((name) => {
    if (name !== 'salvar_nuvem') throw new Error('RPC inesperada: ' + name);
    saves++;
    if (saves === 1) return new Promise((resolve) => { resolveFirst = resolve; });
    return Promise.resolve({ ok: true });
  });

  h.sync.markDirty();
  const request = h.sync.flush();
  await h.drain();
  h.setPayload({ pet: { v: 1, ativo: 'tsu', pets: { tsu: { fome: 42 } } }, visual: { acc: 'laco' } });
  h.sync.markDirty();
  resolveFirst({ ok: true });
  const firstResult = await request;
  assert.equal(firstResult.confirmed, false, 'a resposta antiga não confirma a alteração posterior');
  assert.equal(h.sync.getState().pending, true);
  await h.sync.flush();
  assert.equal(saves, 2);
  assert.equal(h.sync.getState().pending, false);
}

async function testConflitoNaoSobrescreveNuvem() {
  const cloud = { pet: { v: 1, ativo: 'lirika' }, visual: { acc: 'estrela' }, ms: 200000 };
  const h = makeHarness((name) => {
    if (name === 'salvar_nuvem') return Promise.resolve({ ok: false });
    if (name === 'carregar_nuvem') return Promise.resolve(cloud);
    throw new Error('RPC inesperada: ' + name);
  });

  h.sync.markDirty();
  const result = await h.sync.flush();
  assert.equal(result.conflict, true);
  assert.equal(h.sync.getState().pending, true);
  assert.equal(h.sync.getState().lastError, 'conflito_versao');
  assert.equal(h.calls.filter((call) => call.name === 'salvar_nuvem').length, 1,
    'não deve ficar repetindo um save que o servidor recusou por versão');
  assert.equal(h.sync.getState().confirmedMs, 0);
}

async function testPendentePersistidoEntreReaberturas() {
  let saved = null;
  const first = makeHarness((name) => name === 'salvar_nuvem'
    ? Promise.reject(new Error('offline'))
    : Promise.reject(new Error('RPC inesperada')));
  first.sync.markDirty();
  await first.sync.flush();
  saved = first.state;
  assert.equal(saved.pending, true);

  let version = first.version;
  const second = TWPetSync.create({
    rpc: () => Promise.resolve({ ok: true }),
    isEnabled: () => true,
    getNick: () => 'tester',
    getPayload: () => first.payload,
    getVersion: () => version,
    setVersion: (ms) => { version = ms; },
    readState: () => saved,
    writeState: (value) => { saved = value; },
    now: () => 200000,
    setTimeout: (fn) => { fn(); return 1; },
    clearTimeout: () => {}
  });
  assert.equal(second.hasPending('tester'), true);
  await second.flush();
  assert.equal(second.getState().pending, false);
  assert.equal(second.getState().status, 'confirmed');
}

async function testFilaEnquantoContaReconecta() {
  let enabled = false;
  let saved = null;
  let version = 0;
  const calls = [];
  const sync = TWPetSync.create({
    rpc: (name) => { calls.push(name); return Promise.resolve({ ok: true }); },
    isEnabled: () => enabled,
    getNick: () => 'tester',
    getPayload: () => ({ pet: { pets: { tsu: { fome: 100 } } }, visual: {} }),
    getVersion: () => version,
    setVersion: (ms) => { version = ms; },
    readState: () => null,
    writeState: (value) => { saved = value; },
    now: () => 200000,
    debounceMs: 4000
  });
  assert.ok(sync.markDirty(), 'alimentar durante reconexão ainda deve registrar pendência');
  assert.equal(sync.hasPending('tester'), true);
  assert.equal(saved.pending, true, 'a fila offline precisa persistir');
  assert.equal(calls.length, 0, 'nenhuma requisição enquanto desativado');
  enabled = true;
  const result = await sync.flush();
  assert.equal(result.confirmed, true);
  assert.deepEqual(calls, ['salvar_nuvem']);
}

async function testIgnoraMudancaPassivaSemNovaAcao() {
  let resolver;
  const h = makeHarness((name) => {
    if(name !== 'salvar_nuvem') throw new Error('RPC inesperada');
    return new Promise((resolve) => { resolver = resolve; });
  }, { ignoreUnmarkedChanges: true });
  h.sync.markDirty();
  const request = h.sync.flush();
  await h.drain();
  h.setPayload({ pet: { v:1, pets: { tsu: { fome:79.99, t:12345 } } }, visual: { acc:'laco' } });
  resolver({ ok:true });
  const result = await request;
  assert.equal(result.confirmed, true, 'queda natural das barras não cria novo envio');
  assert.equal(h.sync.hasPending('tester'), false);
}

async function testCoalescenciaComLimiteDeEspera() {
  const h = makeHarness((name) => {
    if(name === 'salvar_nuvem') return Promise.resolve({ ok:true });
    throw new Error('RPC inesperada: ' + name);
  }, { debounceMs: 3000, maxWaitMs: 5000 });
  h.sync.markDirty();
  await h.advance(2000);
  h.sync.markDirty();   // segunda ação reagenda, mas sem adiar além de 5 s
  await h.advance(2999);
  assert.equal(h.calls.length, 0);
  await h.advance(1);
  assert.equal(h.calls.length, 1, 'ações agrupadas em um único RPC mesmo durante atividade');
  assert.equal(h.sync.hasPending('tester'), false);
}

async function testLigacaoDoPetNaPagina() {
  const fs = require('node:fs');
  const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /function petSave\(changed\)/);
  assert.match(html, /if\(changed && typeof perfPetMudou === 'function'\) perfPetMudou\(\)/);
  assert.match(html, /function petClose\(\)[\s\S]{0,500}perfEnviar\(\)/);
  assert.match(html, /if\(petData && petT % 300 === 0\)\{ petTick\(\); petSave\(\);/);
  assert.match(html, /ignoreUnmarkedChanges: true/);
  assert.match(html, /function petPay\(price\)[\s\S]{0,1400}contaRpc\('gastar_estrelas'/);
  assert.match(html, /return petPay\(guardado \? 0 : it\[2\]\)\.then\(function\(ok\)/);
  assert.match(html, /return petPay\(comprar \? it\[3\] : 0\)\.then\(function\(ok\)/);
  assert.match(html, /brs48cr_pet_guest_dirty/, 'edicao sem login deve ficar marcada');
  assert.match(html, /id="perfConfLocal"/, 'login precisa oferecer conservar o save local');
  assert.match(html, /perfNuvemLidaMs/, 'save deve checar versao remota antes de enviar');
}

async function testConflitoRemotoAntesDeSalvar() {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
  const signature = /function perfSalvarRpc\(nome,\s*args\)/.exec(html);
  const start = signature ? signature.index : -1;
  const end = html.indexOf('function perfConferir()', start);
  assert.ok(start >= 0 && end > start, 'localizar preflight de salvamento');
  let cloudMs = 140;
  const calls = [];
  const ctx = vm.createContext({
    contaJ: { nick:'tester' },
    perfSync: { getState: () => ({pending:false}) },
    perfAplicarNuvem: () => { throw new Error('nao deve aplicar nuvem'); },
    contaRpc: (name, args) => {
      calls.push(name);
      if(name === 'carregar_nuvem') return Promise.resolve({ms:cloudMs, pet:{}, visual:{}});
      if(name === 'salvar_nuvem') return Promise.resolve({ok:true});
      throw new Error('RPC inesperada: ' + name);
    }
  });
  vm.runInContext('var perfNuvemLidaMs = 100;\n' + html.slice(start, end), ctx);
  const conflict = await ctx.perfSalvarRpc('salvar_nuvem', {p_ms:150});
  assert.equal(conflict.ok, false, 'nuvem alterada precisa bloquear escrita');
  assert.equal(conflict.erro, 'conflito_versao');
  assert.deepEqual(calls, ['carregar_nuvem'], 'conflito nao pode chamar salvar_nuvem');
  cloudMs = 100;
  calls.length = 0;
  const saved = await ctx.perfSalvarRpc('salvar_nuvem', {p_ms:150});
  assert.equal(saved.ok, true);
  assert.deepEqual(calls, ['carregar_nuvem','salvar_nuvem']);
  cloudMs = 145;
  calls.length = 0;
  const second = await ctx.perfSalvarRpc('salvar_nuvem', {p_ms:160});
  assert.equal(second.ok, true, 'versao confirmada deve permitir o proximo lote');
  assert.deepEqual(calls, ['carregar_nuvem','salvar_nuvem']);
}

async function testPetPagoSoDepoisDoDebito() {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'index.html'), 'utf8');
  const start = html.indexOf('var petComprando = false;');
  const end = html.indexOf('function petFind(list, k)', start);
  assert.ok(start >= 0 && end > start, 'localizar função de pagamento do pet');
  let resolveRequest;
  const requests = [];
  const ctx = vm.createContext({
    starT: 90,
    contaJ: { nick:'tester' },
    localStorage: { setItem() {} },
    setBest() {},
    petOpen: false,
    petUI() {},
    petSay() {},
    tr: (s) => s,
    beep() {},
    contaRpc: (name, args) => {
      requests.push({ name, args });
      return new Promise((resolve) => { resolveRequest = resolve; });
    }
  });
  vm.runInContext(html.slice(start, end), ctx);
  const rejected = ctx.petPay(40);
  assert.equal(ctx.starT, 90, 'não desconta nem libera antes da resposta do servidor');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].name, 'gastar_estrelas');
  resolveRequest({ok:false, stars:90, erro:'saldo'});
  assert.equal(await rejected, false, 'compra negada não pode liberar item');
  assert.equal(ctx.starT, 90);

  const accepted = ctx.petPay(40);
  resolveRequest({ok:true, stars:50});
  assert.equal(await accepted, true, 'compra confirmada concede item');
  assert.equal(ctx.starT, 50, 'mostra exatamente o saldo do servidor');
  ctx.contaJ = null;
  assert.equal(await ctx.petPay(15), true, 'jogo sem login debita saldo local');
  assert.equal(ctx.starT, 35);
  assert.equal(requests.length, 2, 'compra local não usa RPC');
}

(async function run() {
  await testFalhaERepeticao();
  await testConfirmacaoSoAposResposta();
  await testMudancaDuranteEnvioNaoSePerde();
  await testConflitoNaoSobrescreveNuvem();
  await testPendentePersistidoEntreReaberturas();
  await testFilaEnquantoContaReconecta();
  await testIgnoraMudancaPassivaSemNovaAcao();
  await testCoalescenciaComLimiteDeEspera();
  await testLigacaoDoPetNaPagina();
  await testPetPagoSoDepoisDoDebito();
  await testConflitoRemotoAntesDeSalvar();
  console.log('✓ Backstage Pet sync: falha, repetição, confirmação, alteração durante envio, conflito e retomada');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});