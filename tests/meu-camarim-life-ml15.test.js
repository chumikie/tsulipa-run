'use strict';
// ML1.5 — acabamento visual do Camarim: papel de parede na proporção certa,
// sentar de verdade no sofá e móveis apoiados no chão.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const pet = read('pet.js'), css = read('pet.css');
const capa = pet.slice(pet.indexOf('var PET_CAPA_W'), pet.indexOf('// Quatro ícones originais do Idol⭐Touch'));
const fundo = pet.slice(pet.indexOf('function petMakeBg('), pet.indexOf('// Áreas pequenas e explícitas'));

test('ML1.5: papel de parede próprio, com a mesma proporção no canvas e no CSS', () => {
  assert.match(pet, /<canvas id="petPhoneCapa" width="520" height="280"/);
  assert.match(css, /\.petphone-capa canvas\{[^}]*aspect-ratio:260\/140/);
  assert.doesNotMatch(css, /\.petphone-capa canvas\{[^}]*object-fit:cover/, 'sem esticar nem cortar o Idol');
  assert.match(capa, /drawChar\(CH\[sel\], 0, 0, 0, 2\)/, 'Idol sorrindo com o visual salvo');
  assert.match(capa, /drawPet\(x, petType\(petData\.ativo\)/, 'Pet ativo no palquinho');
  assert.doesNotMatch(capa, /localStorage|contaRpc\(|petSave\(|requestAnimationFrame|setInterval/);
  // Sem os desenhos, recorta o quarto 360×220 mantendo 260:140 (nunca estica).
  const draws = [];
  const c = {width:520, height:280, getContext:() => ({clearRect(){}, drawImage(...a){ draws.push(a); }})};
  const ctx = {$:() => c, petAtivo:() => null, petData:null, petCv:{width:720, height:440}, window:{}, Math};
  vm.runInNewContext(capa, ctx);
  ctx.petPhoneCapaDesenhar();
  const [, , , sw, sh, , , dw, dh] = draws[0];
  assert.ok(Math.abs(sw / sh - dw / dh) < .01, 'mesma proporção na origem e no destino');
  assert.match(css, /\.petphone-capa strong\{bottom:5px/, 'etiquetas embaixo, sem cobrir rostos');
});

test('ML1.5: sentado, as pernas retas são recortadas e as canelas descem até o chão', () => {
  assert.match(pet, /var PET_LIFE_ASSENTO = 180;/);
  assert.match(pet, /if\(petLifePose\)\{ g\.beginPath\(\); g\.rect\(0, 0, 360, PET_LIFE_ASSENTO\); g\.clip\(\); \}/);
  const sofa = pet.slice(pet.indexOf('function petLifeSofa('), pet.indexOf('function petLifeSofaBracos('));
  assert.match(sofa, /x\.fillRect\(px\+dx,182,12,12\)/, 'canelas a partir do assento');
  assert.match(sofa, /x\.roundRect\(px\+dx-1\.5,192,15,5\.5,2\.8\)/, 'pés terminam no chão (y≈197)');
  assert.doesNotMatch(sofa, /roundRect\(84,190,17,5,2\)/, 'sem os sapatos soltos antigos');
  assert.match(pet, /if\(!petLifePose\) petLifeSofa\(x, true\);/, 'em pé: Idol na frente do sofá');
  assert.match(pet, /if\(petLifePose\) petLifeSofa\(x, true\);/);
});

test('ML1.5: mesinha e estante têm pés até o chão, sombra e o piso vem antes', () => {
  assert.ok(fundo.indexOf('// Piso de madeira rosada') < fundo.indexOf('// Meu Camarim⭐Life! ML1'), 'piso desenhado antes dos móveis');
  assert.match(fundo, /x\.fillRect\(154, 158, 3, 19\); x\.fillRect\(175, 158, 3, 19\)/, 'pés da mesinha até y 177');
  assert.match(fundo, /x\.fillRect\(184, 147, 3, 30\); x\.fillRect\(213, 147, 3, 30\)/, 'pés da estante até y 177');
  assert.equal((fundo.match(/ellipse\((166|200), 177/g) || []).length, 2, 'sombra de contato nos dois móveis');
});
