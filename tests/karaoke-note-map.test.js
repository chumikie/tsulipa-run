const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const songsSource = html.match(/var songs=\{[\s\S]*?\n\};/);
const lanesSource = html.match(/Object\.keys\(songs\)\.forEach\(function\(k\)\{[^\n]+/);
const mapSource = html.match(/function makeNoteMap\(song,total,step,start\)\{[\s\S]*?\n \}return notes;\}/);
const clockSource = html.match(/function kNow\(\)\{[^\n]+/);
const scheduleSource = html.match(/function schedule\(\)\{[^\n]+/);
const laneSource = html.match(/function laneAt\(px,py\)\{[^\n]+/);
assert(songsSource && lanesSource && mapSource && clockSource && scheduleSource && laneSource, 'Mapa, relógios e controles presentes no Karaoke');
const context = vm.createContext({});
vm.runInContext(`${songsSource[0]}\n${lanesSource[0]}\n${mapSource[0]}\n${clockSource[0]}\n${scheduleSource[0]}\n${laneSource[0]}`, context);

for (const [key, song] of Object.entries(context.songs)) {
  const step = 60000 / song.bpm / 2;
  const total = Math.floor(59000 / step);
  const notes = context.makeNoteMap(song, total, step, 1234);
  assert(notes.length > 0, `${key}: mapa não vazio`);
  assert.deepEqual(
    JSON.parse(JSON.stringify(notes)),
    JSON.parse(JSON.stringify(context.makeNoteMap(song, total, step, 1234))),
    `${key}: mapa reproduzível para retomada`
  );
  let lane = -1, repeats = 0;
  const seenSteps = new Set();
  for (const note of notes) {
    assert(song.mel[note.idx % song.mel.length] >= 0, `${key}: nenhuma nota durante pausas`);
    assert.equal(note.at, 1234 + note.idx * step, `${key}: tempo ancorado no idx sem latência duplicada`);
    assert(note.lane >= 0 && note.lane <= 3, `${key}: raia válida`);
    assert(note.idx >= 0 && note.idx < total, `${key}: partida de 60s`);
    if (!seenSteps.has(note.idx)) {
      seenSteps.add(note.idx);
      repeats = note.lane === lane ? repeats + 1 : 1;
      lane = note.lane;
      assert(repeats <= 3, `${key}: sem quatro notas principais na mesma raia`);
    }
  }
  const byStep = new Map();
  for (const note of notes) byStep.set(note.idx, (byStep.get(note.idx) || 0) + 1);
  for (const [idx, count] of byStep) {
    assert(count <= 2, `${key}: no máximo duas notas por passo`);
    if (count === 2) assert(idx % 8 === 0, `${key}: dupla apenas no tempo forte`);
  }
  assert([...byStep.values()].some(count => count === 2), `${key}: ao menos uma nota dupla`);
  const early = notes.filter(n => n.idx < total * .35).length / (total * .35);
  const late = notes.filter(n => n.idx >= total * .65).length / (total * .35);
  assert(late >= early, `${key}: densidade cresce na parte final`);
}

// Quando a nota é ouvida, o relógio compensado deve coincidir com a linha de acerto.
// A antiga soma extra de latência no mapa fazia este teste falhar.
const song = context.songs.normal, step = 60000 / song.bpm / 2;
const note = context.makeNoteMap(song, 100, step, 4000)[4];
context.run = {start:4000, audioOrigin:20, paused:false, step, audioStep:0, total:100};
context.performance = {now: () => 4000};
for (const latency of [0, 0.03, 0.08, 0.12]) {
  context.AC = {state:'running', currentTime:20 + note.idx * step / 1000 + latency, outputLatency:latency, baseLatency:latency};
  assert(Math.abs(context.kNow() - note.at) < .001, `nota sincronizada com áudio a ${latency * 1000} ms de latência`);
}
const scheduled = [];
context.beat = i => scheduled.push(i);
context.run.audioStep = 0;
context.AC = {state:'running', currentTime:19.8, outputLatency:.12, baseLatency:.12};
context.schedule();
assert.deepEqual(scheduled, [0], 'primeira nota agendada 200 ms antes no relógio do áudio');
const taps = [];
context.hit = lane => taps.push(lane);
for (let lane = 0; lane < 4; lane++) {
  const centerX = 286 + 12 + (lane + .5) * ((388 - 24) / 4);
  assert(context.laneAt(centerX, 180), `toque na raia ${lane} reconhecido`);
}
assert.deepEqual(taps, [0, 1, 2, 3], 'toques seguem os centros desenhados D/F/J/K');
console.log('Karaoke: 7 mapas, áudio de 0–120 ms e quatro controles alinhados OK');
