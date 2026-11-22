'use strict';
// 22/11/2026: o "Você" de lado (Center⭐Run) desenha todos os cortes, franjas, detalhes e roupas do editor.
// Antes, 5 cortes viravam o Curto, 6 roupas viravam a mesma camiseta lisa e Elfo/Olheiras/Chifres sumiam.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const lado = fs.readFileSync(path.join(root, 'tw-lado.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function opcoes(id){
  const i = html.indexOf('id="' + id + '"'), j = html.indexOf('</select>', i);
  return [...html.slice(i, j).matchAll(/value="([^"]*)"/g)].map(m => m[1]).filter(Boolean);
}
test('todo corte do editor tem desenho de lado', () => {
  const cortes = opcoes('cback');
  assert.ok(cortes.length >= 14);
  for (const k of cortes) assert.match(lado, new RegExp("c\\.back === '" + k + "'"), 'corte sem lado: ' + k);
});
test('toda franja do editor tem desenho de lado (a Reta é a linha de sempre)', () => {
  for (const k of opcoes('cfront').filter(k => k !== 'reta')) assert.match(lado, new RegExp("c\\.front === '" + k + "'"), 'franja sem lado: ' + k);
});
test('todo detalhe do editor aparece de lado', () => {
  for (const k of opcoes('cdet')) assert.match(lado, new RegExp("c\\.det === '" + k + "'"), 'detalhe sem lado: ' + k);
});
test('toda roupa do editor tem cores e peças próprias de lado', () => {
  const CR = require('../tw-avatar-roupa.js').cr;
  for (const k of opcoes('cout')) {
    if (/^cr_/.test(k)) {   // 22/11: looks do Center⭐Run! viram uniforme de rank (of1–of5), macacão espacial ou o look próprio
      const u = CR(k); assert(u, 'look do Center⭐Run! sem mapa: ' + k);
      assert.match(lado, new RegExp(u.of ? "RP === 'of" + u.of + "'" : u.alien ? "RP === 'espacial'" : "FXL === '" + u.fx + "'"), 'look do Center⭐Run! sem lado: ' + k);
    } else assert.match(lado, new RegExp("RP === '" + k + "'"), 'roupa sem lado: ' + k);
  }
  assert.match(lado, /var corCam = RP === 'zipper' \? '#ffffff' : RP === 'estrelado' \? az : CAM_U\[RP\] \? \(UC && RP !== 'espacial' \? UC\[0\] : CAM_U\[RP\]\) : KF \? KF\[0\] : corR;/, 'Trainee e as outras na cor escolhida, como de frente; uniformes nas cores da frente');
});
test('mechas, óculos, orelhas de coelho, torrada, tiaras e rosto do editor também de lado (22/11)', () => {
  for (const k of opcoes('cstk').filter(Boolean)) assert.match(lado, new RegExp("st === '" + k + "'|enf === '" + k + "'|'" + k + "' \\? c\\.mecha"), 'mecha sem lado: ' + k);
  for (const k of opcoes('cgl').filter(Boolean)) assert.match(lado, new RegExp("c\\.gl === '" + k + "'"), 'óculos sem lado: ' + k);
  assert.match(lado, /c\.det === 'coelho'/, 'orelhas de coelho (lojinha) de lado');
  assert.match(lado, /c\.det === 'torrada' && A !== 'torrada'/, 'torrada (lojinha) de lado');
  for (const k of ['tiaraS', 'tiaraO']) assert.match(lado, new RegExp('\\b' + k + ':function'), 'tiara de lado: ' + k);
  assert.match(lado, /TWAvatarRosto\.olho\(g, c, x0, y - 4, -1\)/, 'forma do olho do editor de lado');
  for (const k of opcoes('csobr').filter(Boolean)) assert.match(lado, new RegExp('\\b' + k + ':\\['), 'sobrancelha sem lado: ' + k);
  for (const k of opcoes('cboca').filter(Boolean)) assert.match(lado, new RegExp("bc === '" + k + "'"), 'boca sem lado: ' + k);
  for (const k of opcoes('cbochecha').filter(k => k && k !== 'sem')) assert.match(lado, new RegExp("bq === '" + k + "'"), 'bochecha sem lado: ' + k);
  assert.match(lado, /lado\(g, c, 0, 0, av\.expr, t, undefined, av\.a \|\| ''\)/, 'o Você andando no mapa leva o item de mão');
});
