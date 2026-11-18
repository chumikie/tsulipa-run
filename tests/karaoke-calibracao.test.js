'use strict';
// Karaoke⭐Time! — calibração automática do atraso (18/11/2026) e zona de acerto maior.
// Roda o karaoke-show.js num navegador falso, com relógio e áudio controlados, para conferir a CONTA do atraso:
// a medição tem de dar o mesmo número que o hit() daria durante a música.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm'), assert = require('node:assert/strict');
const root = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(root, 'karaoke-show.js'), 'utf8');

function montar(opts){
  opts = opts || {};
  const lat = opts.latencia == null ? 0.04 : opts.latencia;   // segundos (o que o navegador informa)
  let agora = 0;                                              // performance.now() em ms
  const agendados = [];
  const ac = { currentTime:0, state:'running', outputLatency:lat, baseLatency:lat,
    createOscillator:() => ({ type:'', frequency:{ setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){} }, connect(){}, start(t){ agendados.push(t); }, stop(){} }),
    createGain:() => ({ gain:{ setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){}, value:0 }, connect(){} }),
    createStereoPanner:() => ({ pan:{ value:0 }, connect(){} }), createBiquadFilter:() => ({ type:'', frequency:{ value:0 }, Q:{ value:0 }, connect(){} }),
    createBufferSource:() => ({ buffer:null, connect(){}, start(){}, stop(){} }), createBuffer:() => ({ getChannelData:() => new Float32Array(8) }),
    createDynamicsCompressor:() => ({ threshold:{ value:0 }, knee:{ value:0 }, ratio:{ value:0 }, attack:{ value:0 }, release:{ value:0 }, connect(){} }),
    createDelay:() => ({ delayTime:{ value:0 }, connect(){} }), destination:{} };
  const el = () => new Proxy({}, { get:(t, k) => k === 'style' ? {} : k === 'classList' ? { add(){}, remove(){}, toggle(){} } : k === 'textContent' ? '' : typeof k === 'string' ? (() => el()) : undefined, set:() => true });
  const sb = { document:{ createElement:el, getElementById:() => el(), addEventListener(){}, querySelectorAll:() => [], querySelector:() => null, body:el(), hidden:false },
    performance:{ now:() => agora }, setTimeout:() => 0, clearTimeout(){}, setInterval:() => 0, clearInterval(){},
    Math, JSON, Date, Number, String, Object, Array, isFinite, parseInt, console, addEventListener(){}, removeEventListener(){} };
  sb.KaraokeMusicPreview = { create:() => ({ play(){}, pause(){}, resume(){}, stop(){}, isPlaying:() => false }) };
  sb.KaraokeShowRules = { create:() => ({}) };
  sb.window = sb; vm.createContext(sb); vm.runInContext(SRC, sb);
  const D = new Proxy({}, { get:(t, k) => {
    if(k === 'AC') return () => ac;
    if(k === 'ac') return () => () => ac;
    if(k === 'muted') return () => !!opts.mudo;
    if(k === '$') return () => () => el();
    return () => (() => undefined);
  } });
  const kt = sb.window.KaraokeShow.criar(D);
  return { kt, ac, passo:ms => { agora += ms; ac.currentTime += ms / 1000; }, agora:() => agora, lat:lat * 1000 };
}

// Uma pessoa que toca "atraso" ms depois de OUVIR cada batida deve receber esse mesmo número como ajuste.
function medir(atraso, opts){
  const m = montar(opts);
  const info = m.kt.calibrarComecar();
  assert(info && info.batidas >= 6 && info.passo > 0, 'a calibração começa e devolve as batidas');
  const toques = [];
  for(let i = 1; i < info.batidas; i++){
    // a batida i soa quando o relógio do áudio chega ao horário agendado; o ouvido recebe "lat" ms depois
    const alvo = 1200 + i * info.passo + m.lat + atraso;
    m.passo(alvo - m.agora());
    toques.push(m.kt.calibrarToque({ timeStamp:m.agora() }));
  }
  return { fim:m.kt.calibrarFim(), toques };
}

for(const atraso of [0, 60, -40, 120]){
  const r = medir(atraso);
  assert(r.toques.every(t => t && !t.fora), 'todos os toques entram na janela');
  assert(Math.abs(r.fim.media - atraso) <= 2, 'atraso de ' + atraso + ' ms medido como ' + r.fim.media);
  assert(r.fim.offset % 10 === 0, 'o ajuste sai em degraus de 10 ms, como os botões');
  assert(Math.abs(r.fim.offset - atraso) <= 7, 'ajuste ' + r.fim.offset + ' para atraso ' + atraso);
}
// a latência que o navegador informa já é descontada: dois aparelhos, mesma pessoa, mesmo ajuste
assert.equal(medir(60, { latencia:0 }).fim.offset, medir(60, { latencia:0.2 }).fim.offset, 'a latência do aparelho não entra duas vezes');
// sem som não dá para medir
assert.equal(montar({ mudo:true }).kt.calibrarComecar(), null, 'com o som desligado, não mede');
// poucos toques: avisa em vez de gravar um número ruim
{
  const m = montar(); m.kt.calibrarComecar(); m.passo(1900); m.kt.calibrarToque({ timeStamp:m.agora() });
  const r = m.kt.calibrarFim();
  assert(r && r.poucos && r.offset === undefined, 'com 1 toque não grava ajuste');
}
// toque muito fora do ritmo não conta
{
  const m = montar(); const info = m.kt.calibrarComecar(); m.passo(1200 + (info.batidas - 1) * info.passo + 1000);
  assert.equal(m.kt.calibrarToque({ timeStamp:m.agora() }).fora, true, 'toque longe de qualquer batida é ignorado');
}
// durante a música não se mede (a calibração pausa o show antes)
assert.equal(typeof montar().kt.calibrarAtiva, 'function');

// Zona de acerto maior, a pedido do dono (mais acessível): BOM ±150 ms, PERFECT ±55 ms.
const show = SRC.match(/var KT_HIT_WINDOWS=\{perfect:(\d+),good:(\d+)\}/);
assert(show && +show[1] === 55 && +show[2] === 150, 'janelas ±55 / ±150');
assert(+show[2] > +show[1] * 2, 'a faixa BOM é bem maior que a PERFECT: erra por pouco e ainda vale');

// O painel de ajuste ganhou o botão e os textos nos 6 idiomas (o indonésio caía no português até 18/11).
const html = fs.readFileSync(path.join(root, 'karaoke-time.html'), 'utf8');
assert(html.includes('id="ktCalMedir"') && html.includes("kt.calibrarComecar()") && html.includes('kt.calibrarToque(e)') && html.includes('kt.calibrarFim()'), 'botão ligado à calibração');
assert(html.includes('setOffset(r.offset)'), 'a medida preenche o mesmo ajuste dos botões −10/+10');
const dic = {}; vm.runInNewContext(html.slice(html.indexOf('var KR_RHYTHM_TOUCH_DIAGNOSTIC={'), html.indexOf('\n};', html.indexOf('var KR_RHYTHM_TOUCH_DIAGNOSTIC={')) + 3), dic);
const idiomas = Object.keys(dic.KR_RHYTHM_TOUCH_DIAGNOSTIC);
assert.equal(idiomas.sort().join(','), 'en,es,id,ja,pt,th', 'os 6 idiomas, indonésio incluído');
for(const l of idiomas) for(const k of Object.keys(dic.KR_RHYTHM_TOUCH_DIAGNOSTIC.pt))
  assert(dic.KR_RHYTHM_TOUCH_DIAGNOSTIC[l][k], k + ' falta em ' + l);
console.log('✓ Karaoke: calibração automática do atraso (conta conferida), zona de acerto maior e painel nos 6 idiomas');
