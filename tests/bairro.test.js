'use strict';
// Vida no bairro (tw-bairro.js, 17/11/2026): bico de 3 níveis por rua, bagunça da semana, guia dos primeiros dias
// e falas do trio no Chat. Roda o módulo num navegador falso (sem DOM de verdade).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const SRC = fs.readFileSync('tw-bairro.js', 'utf8');

function carregar(opts){
  opts = opts || {};
  const store = Object.assign({}, opts.store || {});
  const agora = opts.agora || Date.UTC(2026, 10, 17, 15);   // terça 17/11/2026, 12h em Brasília
  class FD extends Date { constructor(...a){ if(a.length) super(...a); else super(agora); } static now(){ return agora; } }
  const ouvintesHumor = [];
  const el = () => ({ appendChild(){}, addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; }, setAttribute(){}, classList:{ toggle(){} }, remove(){}, style:{} });
  const sb = {
    Date:FD, Math, JSON, String, Object, Array, Number, parseInt, setInterval(){ return 0; }, clearInterval(){}, setTimeout(){ return 0; },
    localStorage:{ getItem:k => (k in store ? store[k] : null), setItem:(k, v) => { store[k] = String(v); } },
    document:{ head:el(), body:el(), getElementById(){ return null; }, createElement:el, addEventListener(){}, querySelectorAll(){ return []; } },
    LANG:opts.lang || 'pt',
    TW_HUMOR:{ ouvir:f => ouvintesHumor.push(f) }
  };
  if(opts.conta) sb.contaJ = { nick:opts.conta };
  if(opts.best != null) sb.best = opts.best;
  sb.window = sb;
  vm.runInNewContext(SRC, sb);
  return { B:sb.TW_BAIRRO, store, humor:(ev, fraco) => ouvintesHumor.forEach(f => f('humor', ev, fraco)), sb };
}

test('liga no Humor e conta só jogos (não "fraco")', () => {
  const { B, humor } = carregar({ conta:'Sami', best:500 });
  humor('cafe'); humor('cafe', true); humor('abriu');
  assert.equal(B.bico('harajuku').pts, 1, 'só o evento forte do Café conta');
  humor('run'); humor('karaoke');
  assert.equal(B.bico('palco').pts, 2);
  assert.equal(B.bico('palco').nivel, 1, '2 pontos = nível 1');
});

test('no máximo 4 pontos por rua por dia; níveis em 2, 6 e 15', () => {
  const { B } = carregar({ conta:'Sami', best:500 });
  for(let i = 0; i < 10; i++) B.contar('sora');
  const k = B.bico('ceu');
  assert.equal(k.pts, 4); assert.equal(k.hoje, 4); assert.equal(k.nivel, 1); assert.equal(k.falta, 2);
  assert.deepEqual(Array.from(B.NIVEIS), [2, 6, 15]);
  assert.equal(B.POR_DIA, 4);
});

test('nada do bairro mexe em estrelas: só a chave brs48cr_bairro_v1 muda', () => {
  const { B, store } = carregar({ conta:'Sami', best:500, store:{ brs48cr_stars:'60' } });
  for(let i = 0; i < 4; i++) B.contar('battle');
  assert.deepEqual(Object.keys(store).sort(), ['brs48cr_bairro_v1', 'brs48cr_stars']);
  assert.equal(store.brs48cr_stars, '60');
  assert.doesNotMatch(SRC, /contaRpc|supabase|stars\s*[+-]=/, 'sem servidor e sem moeda');
});

test('estado separado por conta (e visitante)', () => {
  const store = {};
  const a = carregar({ conta:'Sami', best:1, store }); a.B.contar('cafe');
  const b = carregar({ conta:'Lu', best:1, store:a.store });
  assert.equal(b.B.bico('harajuku').pts, 0, 'a outra conta começa do zero');
  const salvo = JSON.parse(a.store.brs48cr_bairro_v1);
  assert.ok(salvo['c:sami']);
});

test('bagunça da semana: roda as 6 ruas aos domingos e pede o gesto de outra rua', () => {
  const vistas = new Set();
  for(let w = 0; w < 6; w++){
    const { B } = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 18 + 7 * w, 15) });
    const b = B.bagunca();
    vistas.add(b.rua);
    assert.notEqual(b.rua, b.gesto, 'o gesto vem do bico de outra rua');
    assert.ok(b.quem && b.fez && b.fim);
  }
  assert.equal(vistas.size, 6);
  // troca no domingo 0h de Brasília (sábado 23h59 ainda é a semana anterior)
  const sab = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 22, 2, 59) }).B.bagunca();
  const dom = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 22, 3, 1) }).B.bagunca();
  assert.equal(sab.semana, '2026-11-15'); assert.equal(dom.semana, '2026-11-22');
});

test('resolver só com o gesto aprendido (nível 2 na rua do gesto)', () => {
  const { B, store } = carregar({ conta:'Sami', best:1 });
  const b = B.bagunca();
  assert.equal(B.resolver(), false, 'sem o gesto, não resolve');
  const s = JSON.parse(store.brs48cr_bairro_v1); s['c:sami'].pts[b.gesto] = 6; store.brs48cr_bairro_v1 = JSON.stringify(s);
  const c = carregar({ conta:'Sami', best:1, store });
  assert.equal(c.B.bagunca().sabe, true);
  assert.equal(c.B.resolver(), true);
  assert.equal(c.B.bagunca().ok, true);
  assert.equal(c.B.resolver(), false, 'uma vez por semana');
});

test('primeiros dias guiados: só conta nova; uma rua por dia; Pular mostra tudo', () => {
  const novo = carregar({ conta:'Nova' });
  const g1 = novo.B.guia();
  assert.equal(g1.ativo, true); assert.deepEqual(Array.from(g1.abertas), ['palco', 'praca']);
  assert.equal(novo.B.ruaAberta('arena'), false);
  // dia 3
  const d3 = carregar({ conta:'Nova', store:novo.store, agora:Date.UTC(2026, 10, 19, 15) }).B.guia();
  assert.deepEqual(Array.from(d3.abertas), ['palco', 'praca', 'harajuku', 'fofo']);
  // dia 6: acabou
  assert.equal(carregar({ conta:'Nova', store:novo.store, agora:Date.UTC(2026, 10, 22, 15) }).B.guia().ativo, false);
  // quem já tem recorde nunca vê o guia
  assert.equal(carregar({ conta:'Veterana', best:1200 }).B.guia().ativo, false);
  novo.B.pularGuia();
  assert.equal(novo.B.guia().ativo, false);
  assert.equal(novo.B.ruaAberta('arena'), true);
});

test('o Mapa pergunta antes (nunca tranca) e o celular recebe as falas do trio', () => {
  const mapa = fs.readFileSync('tw-mapa.js', 'utf8');
  assert.match(mapa, /function entrarRua\(destino,forcar\)/);
  assert.match(mapa, /window\.TW_BAIRRO\.guiaPergunta\(destino,function\(\)\{entrarRua\(destino,true\);\}\)/);
  assert.match(mapa, /window\.twMapaBicho=function/);
  const pet = fs.readFileSync('pet-sala.js', 'utf8');
  assert.match(pet, /window\.TW_BAIRRO\.falas\(c\.id\)/);
  assert.match(pet, /window\.TW_BAIRRO\.lida\(id\)/);
  const { B } = carregar({ conta:'Sami', best:1 });
  ['idol:tsu', 'idol:lirika', 'idol:pati'].forEach(id => assert.equal(B.falas(id).length, 1));
  assert.equal(B.novas(), 3);
  B.lida('idol:tsu');
  assert.equal(B.novas(), 2);
  assert.equal(B.falas('fan:Mimi').length, 0, 'fãs não recebem fala do bairro');
});

test('textos nos 6 idiomas e concordância em português', () => {
  const STR = "(?:'(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\")";
  const blocos = SRC.match(new RegExp('\\{pt:' + STR + '(?:,\\s*[a-z]{2}:' + STR + ')*\\s*\\}', 'g')) || [];
  assert.ok(blocos.length > 60);
  blocos.forEach(b => {
    if(/^\{pt:'Star (Stage|Arena)'\}$/.test(b)) return;   // nome próprio igual em todos
    ['en:', 'es:', 'id:', 'th:', 'ja:'].forEach(l => assert.ok(b.indexOf(l) >= 0, 'falta ' + l + ' em ' + b.slice(0, 60)));
  });
  const { B } = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 18, 15) });   // semana da Praça → gesto do Jardim das Nuvens
  assert.match(B.falas('idol:tsu')[0], /no bico do Jardim das Nuvens/);
  const en = carregar({ conta:'Sami', best:1, lang:'en', agora:Date.UTC(2026, 10, 18, 15) }).B;
  assert.match(en.falas('idol:tsu')[0], /Cloud Garden side job/);
});
