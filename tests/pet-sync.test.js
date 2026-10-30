'use strict';

const assert = require('node:assert/strict');
const TWPetSync = require('../pet-sync.js');

function makeHarness(rpc) {
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
    retryMaxMs: 10000
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

(async function run() {
  await testFalhaERepeticao();
  await testConfirmacaoSoAposResposta();
  await testMudancaDuranteEnvioNaoSePerde();
  await testConflitoNaoSobrescreveNuvem();
  await testPendentePersistidoEntreReaberturas();
  console.log('✓ Backstage Pet sync: falha, repetição, confirmação, alteração durante envio, conflito e retomada');
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});