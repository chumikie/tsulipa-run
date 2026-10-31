const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const flow = html.match(/var ktFlow=\(function\(\)\{[\s\S]*?\n\}\)\(\);/);
const diagnostic = html.match(/var KR_RHYTHM_TOUCH_DIAGNOSTIC=\{[\s\S]*?\n\};/);
assert(flow && diagnostic, 'Fluxo da confirmação, ensaio e diagnóstico presente');
const elements = new Map();
class Element {
  constructor(id=''){this.id=id;this.open=false;this.disabled=false;this.textContent='';}
  set innerHTML(value){this.html=value;for(const match of value.matchAll(/\bid="([^"]+)"/g))get(match[1]);}
  get innerHTML(){return this.html||'';}
  after(other){if(other.id)elements.set(other.id,other);}
  appendChild(child){if(child.id)elements.set(child.id,child);}
  querySelector(selector){return get(selector);}
  showModal(){this.open=true;}
  close(){this.open=false;}
}
function get(id){if(!elements.has(id))elements.set(id,new Element(id));return elements.get(id);}
const values = new Map();
const calls=[];
const context = vm.createContext({
  LANG:'pt',
  krSt:{aberta:true},
  $:get,
  document:{createElement:() => new Element(),addEventListener:()=>{},body:{appendChild:child => elements.set(child.id,child)}},
  localStorage:{getItem:key => values.get(key)||null,setItem:(key,value)=>values.set(key,value)},
  kt:{active:()=>false,start:mode=>calls.push(['start',mode]),adjustOffset:ms=>calls.push(['offset',ms])},
  ktMeta:{controls:()=>({used:2,remaining:3,pending:null})},
  window:{ktOnline:{quota:()=>Promise.resolve({used:2}),gate:fn=>{calls.push(['gate']);fn();}}}
});
vm.runInContext(diagnostic[0]+'\n'+flow[0],context);
const ui=context.ktFlow;
assert.equal(ui.offset(),0,'offset inicial zero');

async function waitForQuota(){await new Promise(resolve=>setImmediate(resolve));}
(async()=>{
  ui.request();
  assert.equal(get('ktStartConfirm').open,true,'modal abre antes da RPC');
  assert.equal(calls.length,0,'a abertura não gasta tentativa');
  get('ktConfirmCancel').onclick();
  await waitForQuota();
  assert.equal(calls.length,0,'cancelar não chama admissão');

  ui.request();await waitForQuota();
  assert.equal(get('ktConfirmCount').textContent.includes('2/5'),true,'contagem visível');
  get('ktConfirmAccept').onclick();
  assert.deepEqual(calls.slice(0,2),[['gate'],['start','confirmed']],'confirmação antecede admissão');

  const charged=calls.length;
  context.krSt.aberta=false;
  ui.request();
  assert.equal(get('ktStartConfirm').open,false,'sala fechada não abre confirmação oficial');
  assert.equal(calls.length,charged,'sala fechada não chama admissão');
  context.krSt.aberta=true;

  const before=calls.length;
  get('ktPractice').onclick();
  assert.deepEqual(calls.slice(before),[['start','practice']],'treino não chama a RPC');
  assert(html.includes("$('krPalco').appendChild(adjust)"),'configurações ficam no palco, não na barra de música');
  assert(!flow[0].includes('practice.after(adjust)'),'calibração não ocupa a barra principal');
  assert.equal(get('ktCalibration').html.includes('kt-calibration-panel'),true,'controle de ajustes vira painel compacto');
  get('ktOffsetPlus').onclick();
  assert.equal(ui.offset(),10,'ajuste local de 10 ms');
  assert.equal(values.get('kt_rhythm_offset_ms_v1'),'10','offset persistido apenas no navegador');
  assert.deepEqual(calls.at(-1),['offset',10]);

  assert(html.includes("var admission=!practice&&typeof ktMeta"),'ensaio não consome quota local');
  assert(html.includes("if(!r.practice&&typeof ktMeta"),'ensaio não publica resultado');
  assert(html.includes("if(q.used>=LIMIT)return"),'limite de cinco tentativas preservado');
  assert(!flow[0].includes('contaRpc('),'nenhuma escrita de banco pelo fluxo da UI');
  console.log('Karaoke: cancelamento sem débito, confirmação, ensaio e calibração local OK');
})().catch(error=>{console.error(error);process.exitCode=1;});
