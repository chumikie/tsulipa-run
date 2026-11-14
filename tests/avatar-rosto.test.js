'use strict';
// Rosto novo do avatar: mesmo módulo nas três cópias do drawChar, sem mudar a grade 30×44.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const raiz = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(raiz, f), 'utf8');
const ctx = {}; vm.runInNewContext(ler('tw-avatar-rosto.js'), ctx);
const R = ctx.TWAvatarRosto;
assert.deepEqual(Array.from(R.olhos), ['', 'redondo', 'brilhante', 'pontinho', 'gatinho', 'sereno', 'estrela', 'cilios', 'gotinha']);
assert.deepEqual(Array.from(R.bocas), ['', 'sorriso', 'gato', 'aberta', 'dentinho', 'lingua', 'triangulo', 'biquinho']);
assert.deepEqual(Array.from(R.enfeites), ['tiara']);   // laço e flor já existiam como Item
assert.deepEqual(Array.from(R.bochechas), ['', 'sem', 'forte', 'sardas', 'estrelinha']);
assert.deepEqual(Array.from(R.sobrancelhas), ['', 'fina', 'cheia', 'arqueada', 'preocupada', 'decidida']);
assert.equal(R.forma({olho:'xyz'}), '', 'forma desconhecida vira o padrão (o rosto de antes)');
// O padrão repete o rosto de antes pixel por pixel: mesmos retângulos do drawChar antigo.
const feitos = [];
const g = new Proxy({}, {get:(t, k) => k === 'createLinearGradient' ? () => ({addColorStop(){}}) : (k === 'fillRect' ? (...a) => feitos.push(a.join(',')) : () => {}), set:() => true});
assert.equal(R.rosto(g, {eye:'#123456'}, 0, 0, 0), true);
for (const r of ['10,17,3,1', '18,17,3,1', '10,18,3,4', '18,18,3,4', '11,19,2,2', '19,19,2,2', '14,24,3,1']) assert.ok(feitos.includes(r), 'retângulo do rosto clássico ' + r);
assert.equal(R.rosto(g, {}, 0, 0, 1), false);
assert.equal(R.rosto(g, {}, 0, 0, 5), false);
// Bochecha vazia chama o desenho próprio de cada página.
let chamou = false; R.bochecha(g, {}, 0, 0, () => { chamou = true; }); assert.ok(chamou);
chamou = false; R.bochecha(g, {bochecha:'sem'}, 0, 0, () => { chamou = true; }); assert.ok(!chamou);
// Sem escolha de saia/bermuda, Zipper, Sweet e Estrelado continuam como eram.
for (const o of ['zipper', 'sweet', 'estrelado']) assert.equal(R.baixoEspecial(g, {}, 0, 0, o, '#fff', () => {}), false, o);
assert.equal(R.baixoEspecial(g, {baixo:'bermuda'}, 0, 0, 'zipper', '#fff', () => {}), true);
assert.equal(R.baixoEspecial(g, {baixo:'saia'}, 0, 0, 'estrelado', '#fff', () => {}), true);
for (const f of ['centerrun.js', 'karaoke-time.html', 'sora-jump.html']) {
  const s = ler(f);
  assert.match(s, /TWAvatarRosto\.rosto\(g,c,x,y,expr\)\)\{/, f + ': rosto');
  assert.match(s, /TWAvatarRosto\.pes\(g,c,x,y\);/, f + ': sapatos');
  assert.match(s, /TWAvatarRosto\.enfeite\(g,c,x,y,hacc\);/, f + ': Arco estelar');
  assert.match(s, /TWAvatarRosto\.arcoiris\(g,x,y\)/, f + ': franja arco-íris');
  assert.match(s, /TWAvatarRosto\.elfo\(g,c,x,y\)/, f + ': orelha de elfo');
}
for (const f of ['index.html', 'karaoke-time.html', 'sora-jump.html']) assert.ok(ler(f).includes('tw-avatar-rosto.js?v='), f + ' carrega o módulo');
for (const id of ['colho', 'cboca', 'cbochecha']) assert.ok(ler('index.html').includes('<select id="' + id + '">'), id);
for (const f of ['centerrun.js', 'karaoke-time.html', 'sora-jump.html']) assert.match(ler(f), /TWAvatarRosto\.sobrancelha\(g,c,x,y,expr\);TWAvatarRosto\.bochecha\(g,c,x,y,bochechaPadrao\)/, f + ': bochecha');
console.log('avatar-rosto ok');
