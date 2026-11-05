'use strict';
// Karaoke: balões de fala dos NPCs vizinhos não se sobrepõem.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const fonte = html.slice(html.indexOf('var krBalaoFila=[];'), html.indexOf('function krDesenharBaloes('));

test('Karaoke: balões de vizinhos sobem em degraus em vez de se cobrirem', () => {
  const ctx = {Math}; vm.runInNewContext(fonte, ctx);
  const medir = t => t.length * 7;
  const fila = [
    {x:300, y:300, txt:'Que voz linda! 💖', t0:1},
    {x:330, y:302, txt:'Vamos dançar! 🎶', t0:2},
    {x:360, y:298, txt:'Bis! Bis! ✨', t0:3},
    {x:700, y:300, txt:'Oi!', t0:4}
  ];
  const r = ctx.krBaloesLayout(fila, medir, 960);
  assert.equal(r.length, 4);
  for(let i = 0; i < r.length; i++) for(let j = i + 1; j < r.length; j++){
    const a = r[i], b = r[j];
    const cobre = a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    assert.equal(cobre, false, a.txt + ' × ' + b.txt);
  }
  assert.equal(r.find(b => b.txt === 'Oi!').y, 300 - 16, 'balão sozinho fica no lugar de sempre');
  for(const b of r) assert.ok(b.x >= 4 && b.x + b.w <= 956, 'dentro da tela');
});

test('Karaoke: balões desenhados depois de todos os Idols, numa passada só', () => {
  assert.match(html, /krBalaoFila\.push\(\{x:j\.x,y:j\.y-100\+dy,txt:bl\.txt,t0:bl\.t0,eu:j\.nick===nick\}\);\}\);krDesenharBaloes\(x,krBalaoFila\);/);
});
