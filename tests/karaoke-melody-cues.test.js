const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const songSource = html.match(/var songs=\{[\s\S]*?\n\};/);
const beatStart = html.indexOf('function beat(i,target){');
const beatEnd = html.indexOf('/* Relógio único do ritmo:', beatStart);
assert(songSource && beatStart >= 0 && beatEnd > beatStart, 'música e agendador de beats presentes');

const calls = [];
const ctx = vm.createContext({
  AC:{currentTime:9.8,state:'running'},
  performance:{now:()=>1234},
  muted:false,
  hz:m=>440*Math.pow(2,(m-69)/12),
  voice:(frequency,duration,time,volume,type)=>calls.push({frequency,duration,time,volume,type}),
});
vm.runInContext(songSource[0]+'\n'+html.slice(beatStart,beatEnd),ctx);

const song = ctx.songs.normal;
const step = 60000/song.bpm/2;
ctx.run = {song,audioOrigin:10,audioReady:true,audioClock:true,step,auto:false,cuesByStep:{0:[{idx:0,lane:1}]}};
ctx.beat(0);
const t = 10;
assert(calls.length > 0, 'primeiro beat emite música');
assert(calls.every(call=>call.time===t), 'lead, bateria e destaque usam o mesmo instante do AudioContext');
assert(calls.some(call=>call.volume===.025 && call.type==='triangle'), 'nota visível recebe ataque audível próprio');
const countWithNote = calls.length;

calls.length=0;
ctx.run.cuesByStep={};
ctx.beat(0);
assert.equal(calls.length,countWithNote-1, 'sem nota visual, não existe ataque extra');

calls.length=0;
ctx.run.cuesByStep={0:[{idx:0,lane:1},{idx:0,lane:3}]};
ctx.beat(0);
assert.equal(calls.length,countWithNote+1, 'dupla ganha voz harmônica, nenhuma tecla fica muda');
assert(calls.some(call=>call.volume===.022 && call.type==='triangle'), 'segunda raia recebe sinal de áudio');

calls.length=0;
ctx.run.cuesByStep={7:[{idx:7,lane:2}]};
ctx.beat(7);
assert(calls.every(call=>Math.abs(call.time-(t+7*step/1000))<.00001),'ataques agendados no passo musical exato');

assert(html.includes('run.cuesByStep[n.idx]'),'cada ataque usa o idx do mapa de notas');
assert(html.includes('noteMap:2'),'formato de salvamento de partidas mantido');
assert(html.includes("($('krPalco')||shortcuts.parentNode).appendChild(adjust)"),'ajustar timing fica no palco, com realocação mobile');
assert(html.includes('#krPalco #krMute{right:64px'),'controle de som fica junto à câmera');
console.log('Karaoke: lead, notas visíveis e duplas no mesmo beat, configurações na cena e salvamento preservado OK');
