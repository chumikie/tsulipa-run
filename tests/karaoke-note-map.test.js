const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const songsSource = html.match(/var songs=\{[\s\S]*?\n\};/);
const lanesSource = html.match(/Object\.keys\(songs\)\.forEach\(function\(k\)\{[^\n]+/);
const mapSource = html.match(/function makeNoteMap\(song,total,step,start,lat\)\{[\s\S]*?\n \}return notes;\}/);
assert(songsSource && lanesSource && mapSource, 'Mapa e melodias presentes no Karaoke');
const context = vm.createContext({});
vm.runInContext(`${songsSource[0]}\n${lanesSource[0]}\n${mapSource[0]}`, context);

for (const [key, song] of Object.entries(context.songs)) {
  const step = 60000 / song.bpm / 2;
  const total = Math.floor(59000 / step);
  const notes = context.makeNoteMap(song, total, step, 1234, 37);
  assert(notes.length > 0, `${key}: mapa não vazio`);
  assert.deepEqual(
    JSON.parse(JSON.stringify(notes)),
    JSON.parse(JSON.stringify(context.makeNoteMap(song, total, step, 1234, 37))),
    `${key}: mapa reproduzível para retomada`
  );
  let lane = -1, repeats = 0;
  const seenSteps = new Set();
  for (const note of notes) {
    assert(song.mel[note.idx % song.mel.length] >= 0, `${key}: nenhuma nota durante pausas`);
    assert.equal(note.at, 1234 + 37 + note.idx * step, `${key}: tempo ancorado no idx`);
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
console.log('Karaoke: 7 mapas de melodia, pausas, raias, duplas, densidade e retomada OK');
