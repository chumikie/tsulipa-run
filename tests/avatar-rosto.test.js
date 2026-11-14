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
assert.deepEqual(Array.from(R.formas), ['', 'brilhante', 'gatinho', 'sereno', 'classico']);
assert.equal(R.forma({olho:'xyz'}), '', 'forma desconhecida vira o padrão');
// Clássico devolve false: o drawChar desenha os olhos de pixel de antes.
assert.equal(R.rosto({}, {olho:'classico'}, 0, 0, 0), false);
// Expressões fora de 0/2/3 continuam no desenho antigo.
const g = new Proxy({}, {get:(t, k) => k === 'createLinearGradient' ? () => ({addColorStop(){}}) : () => {}, set:() => true});
assert.equal(R.rosto(g, {eye:'#123456'}, 0, 0, 0), true);
assert.equal(R.rosto(g, {}, 0, 0, 1), false);
assert.equal(R.rosto(g, {}, 0, 0, 5), false);
// Sem escolha de saia/bermuda, Zipper, Sweet e Estrelado continuam como eram.
for (const o of ['zipper', 'sweet', 'estrelado']) assert.equal(R.baixoEspecial(g, {}, 0, 0, o, '#fff', () => {}), false, o);
assert.equal(R.baixoEspecial(g, {baixo:'bermuda'}, 0, 0, 'zipper', '#fff', () => {}), true);
assert.equal(R.baixoEspecial(g, {baixo:'saia'}, 0, 0, 'estrelado', '#fff', () => {}), true);
for (const f of ['centerrun.js', 'karaoke-time.html', 'sora-jump.html']) {
  const s = ler(f);
  assert.match(s, /TWAvatarRosto\.rosto\(g,c,x,y,expr\)\)\{/, f + ': rosto');
  assert.match(s, /TWAvatarRosto\.pes\(g,c,x,y\);/, f + ': sapatos');
  assert.match(s, /TWAvatarRosto\.arcoiris\(g,x,y\)/, f + ': franja arco-íris');
  assert.match(s, /TWAvatarRosto\.elfo\(g,c,x,y\)/, f + ': orelha de elfo');
}
for (const f of ['index.html', 'karaoke-time.html', 'sora-jump.html']) assert.ok(ler(f).includes('tw-avatar-rosto.js?v='), f + ' carrega o módulo');
assert.match(ler('index.html'), /<select id="colho">/);
console.log('avatar-rosto ok');
