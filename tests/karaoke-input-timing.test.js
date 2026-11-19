const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = require('./karaoke-fonte.js')() /* show em karaoke-show.js desde 17/11/2026 */;
const inputClock = html.match(/function ktInputTime\(now,event,perfNow\)\{[^\n]+/);
const probe = html.match(/function ktTimingProbe\(notes,lane,now,offset\)\{[\s\S]*?closestDelta:closestDelta\};\}/);
assert(inputClock && probe, 'Funções de timestamp de entrada e diagnóstico presentes');

const ctx = vm.createContext({performance:{timeOrigin:1700000000000}});
vm.runInContext(inputClock[0] + '\n' + probe[0], ctx);

assert.equal(ctx.ktInputTime(1090, {timeStamp:995}, 1050), 1035, 'desconta fila real de evento (55 ms)');
assert.equal(ctx.ktInputTime(1090, {timeStamp:1700000000995}, 1050), 1035, 'aceita timestamp com origem Unix');
assert.equal(ctx.ktInputTime(1090, {timeStamp:1}, 1050), 1090, 'timestamp antigo é ignorado');
assert.equal(ctx.ktInputTime(1090, {timeStamp:1100}, 1050), 1090, 'timestamp futuro é ignorado');
assert.equal(ctx.ktInputTime(1090, {timeStamp:800}, 1050), 1090, 'não compensa fila excessiva');
assert.equal(ctx.ktInputTime(1090, null, 1050), 1090, 'entrada sem evento continua válida');

const notes = [{lane:0,at:1000,done:false},{lane:1,at:1000,done:false},{lane:0,at:1250,done:false}];
let hit = ctx.ktTimingProbe(notes, 0, 1060, 0);
assert.equal(hit.own.at, 1000, 'a nota correta pertence à raia pressionada');
assert.equal(hit.delta, 60, '60 ms depois significa tarde');
hit = ctx.ktTimingProbe(notes, 0, 960, 0);
assert.equal(hit.delta, -40, '40 ms antes significa cedo');
hit = ctx.ktTimingProbe(notes, 0, 1060, 60);
assert.equal(hit.delta, 0, 'offset positivo ajusta somente a leitura do toque');
assert.equal(notes[0].at, 1000, 'offset não desloca a posição da nota na tela');
hit = ctx.ktTimingProbe(notes, 2, 1005, 0);
assert.equal(hit.own, null, 'raia sem nota não produz acerto');
assert.equal(hit.otherDelta, 5, 'reconhece nota em outra raia para explicar MISS');
notes[0].done = true;
hit = ctx.ktTimingProbe(notes, 0, 1050, 0);
assert.equal(hit.own.at, 1250, 'nota já acertada não pontua de novo');
assert.equal(hit.closest.at, 1000, 'nota já resolvida ainda explica um toque tardio');

assert(html.includes('Math.abs(delta)<=KT_HIT_WINDOWS.perfect'), 'PERFECT usa janela compartilhada de ±45 ms');
assert(html.includes('Math.abs(p.delta)>KT_HIT_WINDOWS.good'), 'BOM usa janela compartilhada de ±100 ms');
assert(html.includes('if(delta>KT_HIT_WINDOWS.good+120)'), 'MISS automático aguarda event loop sem ampliar ±100 ms');
assert(html.includes('target=padsY+13'), 'linha alvo passa pelo centro dos botões visuais');
assert(html.includes('function adjustOffset(ms){if(run)run.offsetMs=ms;}'), 'calibração não mexe no mapa da música');
assert(!html.includes('n.at+=run.offsetMs'), 'notas não são deslocadas pela calibração');
assert(html.includes('hit(i,e);'), 'teclas usam timestamp original');
assert(html.includes('kt.laneAt(px,py,e)'), 'toque no telão usa timestamp original');

for(const lang of ['pt','en','es','th','ja']){
  assert(html.includes(`${lang}:{early:`), `diagnóstico completo em ${lang}`);
}
console.log('Karaoke: timestamps de entrada, diagnóstico cedo/tarde/raia, botão central e janelas ±45/100 OK');

const resumo = html.slice(html.indexOf('function timingRestaurar('), html.indexOf('function timingResultado('));
vm.runInContext(resumo, ctx);
const r = ctx.timingResumo({timing:{early:8,late:1},hits:11,notes:Array(15)});
assert.deepEqual(Array.from(r.contagens), [8,1,4]);
assert.equal(r.sugerir, true, 'recomenda calibrar somente com desvio consistente');
assert.equal(ctx.timingResumo({timing:{early:8,late:8},hits:16,notes:Array(16)}).sugerir, false);
assert.equal(ctx.timingResumo({timing:{early:0,late:3},hits:3,notes:Array(6)}).sugerir, false);
assert.equal(ctx.timingRestaurar({timing:{early:4,late:2}},7).early, 4);
assert.equal(ctx.timingRestaurar({timing:{early:4,late:2}},5).early, 0);
