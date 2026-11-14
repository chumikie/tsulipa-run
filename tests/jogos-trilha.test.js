'use strict';
// Trilhas dos jogos novos: uma por jogo, respeitam o mudo e calam a música da cidade.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const raiz = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(raiz, f), 'utf8');

test('jogos-trilha: quatro trilhas sintetizadas, sem arquivos de áudio', () => {
  const src = ler('jogos-trilha.js');
  for (const k of ['cafe', 'battle', 'jardim', 'studio']) assert.match(src, new RegExp('\\n    ' + k + ': \\{ bpm:'));
  for (const ov of ['cfOv', 'battleOv', 'bloomOv', 'studioOv']) assert.ok(src.includes("'" + ov + "'"), ov);
  assert.doesNotMatch(src, /\.(mp3|ogg|wav|m4a)\b|new Audio\(/);
  assert.match(src, /function mudo\(\)\{ return typeof muted !== 'undefined' && muted; \}/);
  assert.match(src, /if\(document\.hidden \|\| mudo\(\) \|\| jogoAberto\(\) !== k\)\{ parar\(\); return; \}/);
  assert.match(src, /twMusicaPaginaVisibilidade\(\)/);
});

test('jogos-trilha: a música da cidade cede a vez e os jogos usam os efeitos novos', () => {
  assert.match(ler('centerrun.js'), /twJogoNovoAberto==='function'&&!!twJogoNovoAberto\(\)/);
  const html = ler('index.html');
  assert.ok(html.indexOf('battle.js?v=') < html.indexOf('jogos-trilha.js?v='), 'carrega depois dos jogos');
  assert.match(ler('studio.js'), /twJogoSom\('flash'\)/);
  assert.match(ler('bloom.js'), /twJogoSom\(k\)/);
  assert.match(ler('battle.js'), /SOM_NOVO=\{star:'ponto'/);
  assert.match(ler('cafe.js'), /cfSom\('servir','star'\)/);
});
