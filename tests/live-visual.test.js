'use strict';
// Formato de Live (inspirado no Link! Like!): só desenho. O Battle continua encenando o resultado do servidor
// e o Karaoke continua julgando as notas no karaoke-time.html.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const battle = fs.readFileSync(path.join(root, 'battle.js'), 'utf8');
const arena = fs.readFileSync(path.join(root, 'karaoke-arena.js'), 'utf8');

test('Idol⭐Battle!: palco de Live com arco, placar, medidores, mão de cards e card entrando', () => {
  ['function arcoProgresso(', 'function placarBrilho(', 'function maoDeCards(', 'function cartaMini(', 'function medidor(', 'function coracoes('].forEach(f => assert.ok(battle.includes(f), f));
  assert.match(battle, /var SW=560,SH=520,DUR=2;/);
  assert.ok(!/Math\.random/.test(battle), 'nada sorteado no cliente');
  assert.match(battle, /function brilhoAte\(tt\)\{[^}]*Number\(rodadas\[k\]\.eu\|\|0\)/, 'o Brilho vem dos pontos do servidor');
  const m = battle.match(/var T_LIVE=(\{[^;]*\});/); assert.ok(m);
  const t = vm.runInNewContext('(' + m[1] + ')');
  ['pt', 'en', 'es', 'id', 'th', 'ja'].forEach(l => assert.equal(t[l].length, 2, l));
});

test('Karaoke⭐Time!: HUD de Live só lê o estado do show', () => {
  const sb = {}; sb.window = sb; vm.runInNewContext(arena, sb);
  const A = sb.KaraokeArena; assert.ok(A && A.draw && A.geometry);
  const g = A.geometry(390, 844); assert.ok(g.top >= 200 && g.target < 844 - 120, JSON.stringify(g));
  ['pt', 'en', 'es', 'id', 'th', 'ja'].forEach(l => assert.match(arena, new RegExp('\\b' + l + ":\\['")));
  const hud = arena.slice(arena.indexOf('function hud('), arena.indexOf('function desenhar('));
  assert.ok(!/kt\.hit|\.score\s*=|\.combo\s*=|localStorage/.test(hud), 'não muda ponto, combo nem save');
  // desenhar com um estado de teste não quebra
  const ops = new Proxy({}, { get: (o, k) => k === 'createLinearGradient' ? () => ({ addColorStop(){} }) : k === 'measureText' ? () => ({ width: 10 }) : (typeof k === 'string' ? (o[k] !== undefined ? o[k] : () => {}) : undefined), set: (o, k, v) => { o[k] = v; return true; } });
  A.draw(ops, 390, 844, { now: 1e4, notes: [{ lane: 1, at: 10200, done: false }], fall: 1700, title: 'X', flash: [0, 0, 0, 0], feedback: 'PERFECT', feedbackUntil: 10300, combo: 12, score: 999, acc: 90, start: 0, durationMs: 60000, paused: false, resumeUntil: 0, perfect: 45, good: 100, prep: '' });
});
