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

test('ML1.5: sentar de verdade — quadril sobre o assento, coxas, joelhos e pernas penduradas', () => {
  assert.match(pet, /if\(pose\)\{ g\.beginPath\(\); g\.rect\(0, 0, 360, Math\.min\(PET_LIFE_ASSENTO, quadril\.y \+ 3\)\); g\.clip\(\); \}/);
  const sofa = pet.slice(pet.indexOf('function petLifeSofa('), pet.indexOf('function petLifeSofaBracos('));
  assert.match(sofa, /x\.fillStyle=petLifeCorColo;/, 'coxas na cor da roupa lida do próprio avatar');
  assert.match(sofa, /x\.fillRect\(px-6,q\.y\+6,12,15\+bal\)/, 'canela igual à perna do avatar: retângulo 12 px (5u), sem pé redondo');
  assert.doesNotMatch(sofa, /roundRect\(px/, 'pernas e coxas retas como no drawChar');
  assert.doesNotMatch(sofa, /roundRect\(84,190,17,5,2\)/, 'sem os sapatos soltos antigos');
  assert.match(pet, /if\(!petLifePose\) petLifeSofa\(x, true\);/, 'em pé: Idol na frente do sofá');
  assert.match(pet, /if\(petLifePose\) petLifeSofa\(x, true\);/);
  // As três poses têm lugar e postura diferentes.
  const ctx = {Math};
  vm.runInNewContext(pet.slice(pet.indexOf('var PET_LIFE_POSES'), pet.indexOf('function petLifeLerCorColo(')) + '\nvar petLifePose = "";', ctx);
  const q = {};
  for(const k of ['sentar','descansar','conviver']){ ctx.petLifePose = k; q[k] = ctx.petLifeQuadril(); }
  assert.ok(Math.abs(q.conviver.x - q.sentar.x) > 15, 'Conviver vai para a ponta do sofá');
  assert.ok(ctx.PET_LIFE_POSES.descansar.rot < -.1 && ctx.PET_LIFE_POSES.conviver.rot > .1, 'inclinações visíveis e opostas');
  for(const k in q) assert.ok(q[k].y > 160 && q[k].y < 172, k + ': quadril na altura do assento');
  assert.match(sofa, /petLifePose === 'descansar'\)\{   \/\/ mantinha/);
  assert.match(pet, /jeito\.x -= 52 \* aproxima/, 'Pet chega perto quando convive');
});

test('ML1.5: mesinha e estante têm pés até o chão, sombra e o piso vem antes', () => {
  assert.ok(fundo.indexOf('// Piso de madeira rosada') < fundo.indexOf('// Meu Camarim⭐Life! ML1'), 'piso desenhado antes dos móveis');
  assert.match(fundo, /x\.fillRect\(154, 158, 3, 19\); x\.fillRect\(175, 158, 3, 19\)/, 'pés da mesinha até y 177');
  assert.match(fundo, /x\.fillRect\(184, 147, 3, 30\); x\.fillRect\(213, 147, 3, 30\)/, 'pés da estante até y 177');
  assert.equal((fundo.match(/ellipse\((166|200), 177/g) || []).length, 2, 'sombra de contato nos dois móveis');
});
