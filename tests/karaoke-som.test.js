'use strict';
// Som das músicas do Karaoke: a partitura e o relógio não mudam; só o timbre (mixer, eco, bateria com ruído, arpejo, acorde final).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = require('./karaoke-fonte.js')() /* show em karaoke-show.js desde 17/11/2026 */;

function trecho(ini, fim){ const a = html.indexOf(ini), b = html.indexOf(fim, a); assert.ok(a > 0 && b > a, ini); return html.slice(a, b); }
function audioFalso(){
  const criados = {};
  const param = () => ({ value: 0, setValueAtTime(){}, exponentialRampToValueAtTime(){}, linearRampToValueAtTime(){} });
  const no = tipo => { criados[tipo] = (criados[tipo] || 0) + 1; return { connect(){}, disconnect(){}, start(){}, stop(){}, gain: param(), frequency: param(), Q: param(), pan: param(), delayTime: param(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param() }; };
  const AC = { currentTime: 1, sampleRate: 8000, destination: no('destino'),
    createOscillator: () => no('osc'), createGain: () => no('gain'), createBiquadFilter: () => no('filtro'), createStereoPanner: () => no('pan'),
    createDynamicsCompressor: () => no('compressor'), createDelay: () => no('eco'), createBufferSource: () => no('ruido'),
    createBuffer: (c, n) => ({ sampleRate: 8000, getChannelData: () => new Float32Array(n) }) };
  return { AC, criados };
}

test('mixer, eco, ruído e bumbo tocam sem erro (show e prévia)', () => {
  const codigo = trecho('var ktMixer=null', 'function beat(');
  for(const previa of [false, true]){
    const { AC, criados } = audioFalso();
    const ctx = { AC, muted: false, voices: new Set(), ktPreviewRouting: previa, previewPlayer: { output: () => AC.destination }, Math };
    vm.runInNewContext(codigo + ';voice(440,.2,1,.04,"square",.3,true);ruido(1,.1,.03,6000,.2);ktBumbo(1,.1);this.mx=ktPreviewRouting?null:ktMix();', ctx);
    assert.ok(criados.osc >= 2 && criados.ruido === 1 && criados.filtro >= 2, JSON.stringify(criados));
    if(!previa) assert.ok(criados.compressor === 1 && criados.eco === 1, 'show passa pelo compressor e pelo eco');
    else assert.ok(!criados.compressor, 'a prévia continua saindo pela saída dela');
  }
});

test('a partitura não mudou: as notas da pista e o relógio continuam os mesmos', () => {
  const b = trecho('function beat(i,target)', '/* Relógio de áudio único');
  assert.match(b, /var m=c\.mel\[i%len\];if\(m>=0\)/, 'melodia lida igual');
  assert.ok(!/makeNoteMap|run\.notes|\.at=/.test(b), 'o som não mexe nas notas do jogo');
  assert.match(b, /indiceLocal===playback\.total-1&&!ktPreviewRouting/, 'acorde final só no fim do show');
  assert.ok(!/Math\.random/.test(trecho('var ktMixer=null', 'function beat(')), 'ruído fixo, nada sorteado');
});
