'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const hs = read('handshake.js'), cafe = read('cafe.js');
const fragment = hs.slice(hs.indexOf('// Visita⭐Surpresa!:'), hs.indexOf('function hsFa(r, nome){'));

function scopeFor(nick, suggestions, chance = .01) {
  let calls = 0;
  const math = Object.create(Math);
  math.random = () => chance;
  const scope = {
    contaJ: nick ? {id:'conta-atual', nick} : null,
    hubIdolsDados: {idols:[
      {nick:'Eu',avatar:{skin:'#ffffff'}},
      {nick:'Outra',avatar:{skin:'#f1c9a5'}},
      {nick:'Bloqueada',avatar:{skin:'#e0ac69'}}
    ]},
    contaRpc: (rpc) => {
      assert.equal(rpc, 'duo_sugestoes', 'somente RPC existente de elegibilidade');
      calls++;
      return Promise.resolve(suggestions);
    },
    Math: math
  };
  vm.runInNewContext(fragment, scope, {filename:'handshake-visit-helper.js'});
  return {scope, getCalls: () => calls};
}

test('Visita apenas usa dados públicos, elegíveis e nunca a própria conta', async () => {
  const {scope,getCalls} = scopeFor('EU', [{nick:'Eu'},{nick:'Outra'}]);
  const run = {};
  scope.hsVisitaPreparar(run);
  await Promise.resolve(); await Promise.resolve();
  assert.equal(getCalls(), 1);
  assert.equal(run.visitaComunidade.nick, 'Outra');
  assert.deepEqual(Object.keys(run.visitaComunidade).sort(), ['avatar','dono','nick']);
});

test('duo_on=false ou resultado ausente não criam aparição', async () => {
  for(const list of [[{nick:'Eu'}], [], null]) {
    const {scope} = scopeFor('Eu', list);
    const run = {};
    scope.hsVisitaPreparar(run);
    await Promise.resolve(); await Promise.resolve();
    assert.equal(run.visitaComunidade, undefined);
  }
});

test('sem login, com chance negada ou troca de conta o sorteio falha fechado', async () => {
  let caso = scopeFor(null,[{nick:'Outra'}]);
  caso.scope.hsVisitaPreparar({});
  assert.equal(caso.getCalls(), 0);
  caso = scopeFor('Eu',[{nick:'Outra'}], .8);
  caso.scope.hsVisitaPreparar({});
  assert.equal(caso.getCalls(), 0);
  caso = scopeFor('Eu',[{nick:'Outra'}]);
  const run = {};
  caso.scope.hsVisitaPreparar(run);
  caso.scope.contaJ = {id:'outra-conta',nick:'Pessoa'};
  await Promise.resolve(); await Promise.resolve();
  assert.equal(run.visitaComunidade, undefined);
});

test('Café e Handshake só trocam apresentação, mantendo lógica de jogos e memórias', () => {
  assert.match(cafe, /cf\.atendidos > 0 && cf\.visitaComunidade/);
  assert.match(cafe, /if\(cf\.servidor && cf\.servidor\.pedido\) f\.pedido = cf\.servidor\.pedido/);
  assert.match(hs, /hsCafeAplicarReencontro\(fila, presentesServidor\)/);
  assert.match(hs, /if\(hs\.visitaAlvo !== f\) hsMemGuardar\(f\)/);
  assert.match(hs, /f !== hs\.visitaAlvo/);
  assert.match(hs, /hs\.respostas\.push\(\{ rodada:hs\.rodada, origem:f\.hsOrigem, indice:f\.hsIndice/);
  assert.match(hs, /contaRpc\('handshake_iniciar'\)/);
  assert.match(cafe, /contaRpc\('cafe_run_etapa',args\)/);
  new vm.Script(hs);
  new vm.Script(cafe);
});

test('Transparência em seis idiomas e avaliação registradas na PR', () => {
  const privacy = read('privacidade.html');
  assert.equal((privacy.match(/<h2>✨ Visita⭐Surpresa!/g)||[]).length, 6);
  assert.match(read('docs/qa/visita-surpresa-legitimo-interesse.md'), /Menores/);
  assert.match(privacy, /duo_on|Moon⭐Duo!/);
});
