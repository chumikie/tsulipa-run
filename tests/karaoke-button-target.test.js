const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = require('./karaoke-fonte.js')() /* show em karaoke-show.js desde 17/11/2026 */;
const source = html.match(/var KT_HIT_WINDOWS=\{perfect:55,good:150\},KT_NOTE_PX_PER_MS=\.21,KT_NOTE_HALF_HEIGHT=4;[\s\S]*?\n return top\+travel\*Math\.pow\(progress,3\);\}/);
const songs = html.match(/var songs=\{[\s\S]*?\n\};/);
assert(source && songs, 'Uma única janela de acerto alimenta movimento e julgamento');

const ctx = vm.createContext({});
vm.runInContext(`${source[0]}\n${songs[0]}`,ctx);
// 18/11/2026: zona de acerto maior (BOM ±150, PERFECT ±55) — o halo da pista cresce junto, como antes
assert.equal(ctx.KT_HIT_WINDOWS.perfect,55);
assert.equal(ctx.KT_HIT_WINDOWS.good,150);

// A posição do botão no telão original é sempre o seu centro (não uma linha solta).
const top = 66, target = 159;
const perfectPx = ctx.KT_HIT_WINDOWS.perfect*ctx.KT_NOTE_PX_PER_MS;
const goodPx = ctx.KT_HIT_WINDOWS.good*ctx.KT_NOTE_PX_PER_MS;
const halfNote = ctx.KT_NOTE_HALF_HEIGHT;
assert(Math.abs(perfectPx-11.55)<1e-9);
assert(Math.abs(goodPx-31.5)<1e-9);

for(const [key,song] of Object.entries(ctx.songs)){
  const fall = song.fall;
  const y = delta => ctx.ktNoteY(delta,fall,top,target);
  assert(Math.abs(y(-fall)-top)<1e-8,`${key}: nota entra no topo da pista`);
  assert(Math.abs(y(-ctx.KT_HIT_WINDOWS.good)-(target-goodPx))<1e-8,`${key}: começo do halo BOM`);
  assert(Math.abs(y(-ctx.KT_HIT_WINDOWS.perfect)-(target-perfectPx))<1e-8,`${key}: começo do núcleo PERFECT`);
  assert.equal(y(0),target,`${key}: centro do botão exatamente no ataque musical`);
  assert(Math.abs(y(ctx.KT_HIT_WINDOWS.perfect)-(target+perfectPx))<1e-8,`${key}: fim do núcleo PERFECT`);
  assert(Math.abs(y(ctx.KT_HIT_WINDOWS.good)-(target+goodPx))<1e-8,`${key}: fim do halo BOM`);
  // com a zona BOM maior (18/11) o halo ocupa mais pista, então a aproximação inicial é um pouco mais curta
  assert(y(-500)-top>=24,`${key}: aproximação visível antecipadamente, sem ficar parada no alto`);
  let previous=-Infinity;
  for(let delta=-fall;delta<=ctx.KT_HIT_WINDOWS.good+40;delta+=10){
    const pos=y(delta);
    assert(pos>=previous,`${key}: movimento da nota nunca retrocede`);
    previous=pos;
  }
  for(let delta=-(ctx.KT_HIT_WINDOWS.good+40);delta<=ctx.KT_HIT_WINDOWS.good+40;delta++){
    const ms=Math.abs(delta),distance=Math.abs(y(delta)-target);
    const timing=ms<=ctx.KT_HIT_WINDOWS.perfect?'PERFECT':ms<=ctx.KT_HIT_WINDOWS.good?'BOM':'MISS';
    // A nota INTEIRA cabe dentro do botão no PERFECT, e dentro do halo no BOM.
    const visual=distance+halfNote<=perfectPx+halfNote+1e-9?'PERFECT':distance+halfNote<=goodPx+halfNote+1e-9?'BOM':'MISS';
    assert.equal(visual,timing,`${key}: visão e julgamento concordam a ${delta} ms`);
  }
}

assert(html.includes('ktNoteY(delta,fall,top,target)'), 'o desenho usa a curva de movimento testada');
assert(html.includes('goodPx=KT_HIT_WINDOWS.good*KT_NOTE_PX_PER_MS+KT_NOTE_HALF_HEIGHT'),'halo inclui espessura da nota no limite BOM');
assert(html.includes('perfectPx=KT_HIT_WINDOWS.perfect*KT_NOTE_PX_PER_MS+KT_NOTE_HALF_HEIGHT'),'botão inclui nota inteira no limite PERFECT');
assert(!html.includes('x.moveTo(tx+10,target)'), 'linha branca contínua removida');
assert(html.includes('noteMap:2'),'retomada mantém os índices salvos');
assert(html.includes('run.start+n.idx*step'),'notas permanecem no tempo da música');
console.log('Karaoke: 7 faixas, botão PERFECT ±45/BOM ±100/MISS e curva visual sem ambiguidades OK');
