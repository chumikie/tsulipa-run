'use strict';
// Regression: the three Photo Studio choices must not show three full-body Idols.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

test('Photo Studio: rosto, meio and inteiro have genuinely different crops', () => {
  const source = fs.readFileSync(path.join(root, 'perfil.js'), 'utf8');
  const start = source.indexOf('function perfDesenharIdol(');
  const end = source.indexOf('\nfunction perfFoto', start);
  assert.ok(start >= 0 && end > start, 'avatar painter function is present');
  const scope = {
    PERF_RANKVIS: {}, state: 'play', pw: null, dpw: null, rankI: 0,
    sash: false, accSel: '', frame: 0, charPose: '', perfAntena: '',
    perfChar: () => ({skin: '#ffd5bd', hair: '#623455'}),
    perfPetDoAvatar: () => ({}),
    perfPoseInfo: () => false,
    perfCharContorno: () => {},
    perfDesenharPetEm: () => {}
  };
  vm.runInNewContext(source.slice(start, end) + '\nthis.paintIdol = perfDesenharIdol;', scope);
  const canvas = {beginPath(){}, ellipse(){}, fill(){}};
  const frames = ['rosto', 'meio', 'inteiro'].map(mode =>
    scope.paintIdol(canvas, 432, 540, {}, false, false, 0, mode));
  assert.ok(frames[0].scale > frames[1].scale && frames[1].scale > frames[2].scale,
    'close-up > half-body > full-body');
  const cut = frames.map(frame => (540 - frame.y) / frame.scale);
  // Medidas do desenho na tela: boca ≈17, ombros ≈22, bermuda ≈33, pés ≈42, sombra ≈46.
  assert.ok(cut[0] > 20 && cut[0] < 31, 'portrait ends around the shoulders');
  assert.ok(cut[1] > 34 && cut[1] < 44, 'half-body ends around the shorts');
  assert.ok(cut[2] > 46, 'full-body fits through the shoes and shadow');
});

test('Studio photo and mural reuse the same camera and props renderer', () => {
  const source = fs.readFileSync(path.join(root, 'studio.js'), 'utf8');
  assert.match(source, /perfDesenharIdol\(x, W, H, av, false, false, tm \* 60, e\.quadro/);
  assert.match(source, /function polaroid\(/);
  assert.match(source, /cena\(x, fw, fh, e, 1, av\)/);
  assert.match(source, /quadro === 'meio'/);
});
