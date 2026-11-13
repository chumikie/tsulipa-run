'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Café e Handshake usam acerto, erro e combo sem alterar o fluxo de recompensas', () => {
  const cafe = read('cafe.js'), handshake = read('handshake.js');
  assert.match(cafe, /eventoPetReagir\('cafe',cfT,false,certo\?\(cf\.combo>=3\?'combo':'acerto'\):'erro'\)/);
  assert.match(handshake, /eventoPetReagir\('handshake', hsT, false, ok \? \(hs\.combo >= 3 \? 'combo' : 'acerto'\) : 'erro'\)/);
  assert.match(cafe, /contaRpc\('cafe_run_finalizar'/);
  assert.match(handshake, /contaRpc\('handshake_run_finish'/);
});

test('Pet dos eventos cresce, expressa emoções e só usa voz ao toque, com intervalo', () => {
  const pet = { nome: 'Pipo', acc: '' }, paints = [];
  let voices = 0;
  const scope = {
    petData: { ativo: 'tsu', pets: { tsu: pet } },
    perfDesenharPetEm: (...args) => paints.push({ kind: 'normal', args }),
    drawPet: (...args) => paints.push({ kind: 'expressao', args }),
    petVoice: () => { voices++; },
    petAtivo: () => pet,
    PET_MK_DEF: {}
  };
  vm.runInNewContext(read('evento.js'), scope);
  const ctx = { save(){}, restore(){}, fillText(){} };
  scope.eventoPetDesenhar(ctx, 700, 280, 8, 1.7, 500, 'cafe');
  assert.equal(paints[0].args[4], 2.074);
  assert.equal(scope.eventoPetReagir('cafe', 10, false, 'erro'), true);
  scope.eventoPetDesenhar(ctx, 700, 280, 12, 1.7, 500, 'cafe');
  assert.equal(paints[paints.length - 1].args[6], 'choro');
  scope.eventoPetReagir('cafe', 30, false, 'combo');
  scope.eventoPetDesenhar(ctx, 700, 280, 34, 1.7, 500, 'cafe');
  assert.equal(paints[paints.length - 1].args[6], 'amor');
  assert.equal(voices, 0, 'reações automáticas permanecem silenciosas');
  assert.equal(scope.eventoPetToque('cafe', 500, 280, 60), true);
  assert.equal(voices, 1);
  scope.eventoPetToque('cafe', 500, 280, 61);
  assert.equal(voices, 1, 'toques seguidos não sobrepõem sons');
  scope.eventoPetDesenhar(ctx, 700, 280, 85, 1.85, 285, 'handshake');
  assert.equal(paints[paints.length - 1].args[4], 2.22);
  assert.equal(scope.eventoPetToque('handshake', 285, 280, 90), true);
  assert.equal(voices, 2, 'outro cenário ainda permite toque');
});
