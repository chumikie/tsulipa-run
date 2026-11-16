'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../hub.js'),'utf8');
function setup(){
  const els={};for(const id of ['hubIdols','hubIdolsStatus','hubIdolsCv','hubIdolsLista'])els[id]={hidden:true,setAttribute(k,v){this[k]=v;}};
  let resolve,reject,calls=0;
  const response=new Promise((ok,no)=>{resolve=ok;reject=no;});
  const c={Promise,Date,Error,hubIdolsDados:null,hubIdolsEm:0,hubIV:{L:[]},$:id=>els[id],tr:x=>x,escHtml:x=>x,
    hubIdolsTituloUI(){},hubIdolsParar(){},hubIdolsTam(){},hubIdolsLigar(){},
    window:{TW_CELULAR_LIGADO:true,twcTrioVitrine:()=>[{nick:'Tsu',trio:true}]},contaRpc(){calls++;return response;}};
  vm.createContext(c);
  vm.runInContext(source.slice(source.indexOf('var hubIdolsPedido ='),source.indexOf('function hubIdolsTituloUI()')),c);
  vm.runInContext(source.slice(source.indexOf('function hubIdolsUI()'),source.indexOf('function hubIdolsLugar()')),c);
  return {c,els,resolve,reject,calls:()=>calls};
}
test('rede lenta: não mostra trio temporário e compartilha consulta entre telas',async()=>{
  const s=setup(),p=s.c.hubIdolsCarregar();
  assert.equal(s.c.hubIdolsCarregar(),p);await Promise.resolve();assert.equal(s.calls(),1);
  assert.equal(s.els.hubIdolsStatus.hidden,false);assert.equal(s.els.hubIdolsCv.hidden,true);assert.equal(s.c.hubIV.L.length,0);
  s.resolve({idols:[{nick:'Visitante',avatar:{c:{},expr:2}}]});await p;
  assert.equal(s.els.hubIdolsStatus.hidden,true);assert.equal(s.els.hubIdolsCv.hidden,false);
  assert.equal(s.c.hubIV.L[0].nick,'Visitante');assert.equal(s.els.hubIdols['aria-busy'],'false');
  await s.c.hubIdolsCarregar();assert.equal(s.calls(),1);
});
test('falha libera carregamento e permite nova tentativa; trio só após conclusão',async()=>{
  const s=setup(),p=s.c.hubIdolsCarregar();s.reject(Error('offline'));await p;
  assert.equal(s.c.hubIdolsPedido,null);assert.equal(s.els.hubIdolsStatus.hidden,true);assert.equal(s.c.hubIV.L[0].nick,'Tsu');
  s.c.contaRpc=()=>Promise.resolve({idols:[]});await s.c.hubIdolsCarregar();assert.ok(s.c.hubIdolsEm>0);
});
test('atualização com falha preserva Idols já carregados',async()=>{
  const s=setup();s.c.hubIdolsDados={idols:[{nick:'Anterior',avatar:{c:{}}}]};
  const p=s.c.hubIdolsCarregar();s.reject(Error('offline'));await p;
  assert.equal(s.c.hubIV.L[0].nick,'Anterior');assert.equal(s.els.hubIdolsCv.hidden,false);
});
