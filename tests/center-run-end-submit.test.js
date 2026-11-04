'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function extract(file,first,last){
  const text=fs.readFileSync(path.join(root,file),'utf8');
  const a=text.indexOf(first),marker=text.indexOf(last,a+first.length);
  const b=marker>=0?marker:text.length;
  assert(a>=0&&b>a,'missing expected code in '+file);
  return text.slice(a,b);
}
const source=[
  extract('conta.js','function contaInicioCorrida(){','function contaGasto('),
  extract('centerrun.js','function end(){','function hit('),
  extract('index.html','var _origEnd = end;','var _origUpdate = update;')
].join('\n');
const flush=()=>new Promise(r=>setImmediate(r));

function scenario(failAt){
  const calls=[],storage=new Map(),elements=new Map();
  const el=id=>{if(!elements.has(id))elements.set(id,{id,hidden:true,style:{},innerHTML:'',textContent:'',isConnected:true});return elements.get(id);};
  const ctx={
    window:{addEventListener(){},__TW_TEST_STORAGE:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)}},
    document:{hidden:false,addEventListener(){},body:{classList:{remove(){}}}},
    $:el, localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},
    state:'play',sfx:{over(){}},sync(){},shake:0,score:2300,stars:20,isTestGame:false,best:900,
    lastS:0,dpw:null,pw:null,_supabase:{},contaJ:{id:'A',nick:'Fã A'},contaSessaoToken:1,
    nick:'Fã A',starT:100,sel:0,CH:[{n:'Tsu'}],RANKS:[[0,'A']],tr:s=>s,
    rankOf:()=>0,setBest(){},newItems(){if(failAt==='newItems')throw Error('failure in optional UI');return '';},exprFinal:()=>2,
    bestcSalvar(){},refreshAcc(){if(failAt==='refreshAcc')throw Error('failure in optional UI');},
    local:[],lw:{w:'week',rows:[]},ld:{d:'day',rows:[]},
    wk:()=> 'week',dk:()=> 'day',upd:(rows,r)=>[...rows,r],showLb(){},
    overTimer:null,setTimeout(){return 1;},clearTimeout(){},celeb(){},
    s2DailyMode:false,s2DailyRunDate:'',S2_DAILY_LB_KEY:'daily',s2DailyBestRows:(a)=>a,
    did:'device-fake',gachaBonus(){},hubAposCorrida(){},quartetoTalvez(){},
    contaAplicar(){},toast:'',toastT:0,
    contaRpc(name,args){calls.push({name,args});
      if(name==='iniciar_corrida')return Promise.resolve('run-uuid');
      if(name==='terminar_corrida')return Promise.resolve({ok:true,stars:120,best:2300,creditadas:20});
      if(name==='jogador')return Promise.resolve({stars:120,best:2300});
      throw Error('unexpected RPC '+name);
    }
  };
  el('tstw').hidden=true; el('lbmw').hidden=true;
  vm.createContext(ctx);vm.runInContext(source,ctx);
  return {ctx,calls,elements};
}

(async()=>{
  const ok=scenario();ok.ctx.contaInicioCorrida();await flush();
  ok.ctx.end();await flush();
  assert.equal(ok.calls.filter(x=>x.name==='iniciar_corrida').length,1);
  assert.equal(ok.calls.filter(x=>x.name==='terminar_corrida').length,1);
  assert(ok.elements.get('res').innerHTML.includes('2300 pontos'));
  ok.ctx.end();await flush();
  assert.equal(ok.calls.filter(x=>x.name==='terminar_corrida').length,1,'duplicate end never sends twice');

  // O início autorizado deve concluir mesmo se jogador() vier sem id,
  // desde que a sessão Google forneça o dono da corrida.
  const authOnly=scenario();
  authOnly.ctx.contaJ={nick:'Fã A',stars:100,best:900};
  authOnly.ctx.contaAuthUserId='A';
  authOnly.ctx.contaInicioCorrida();await flush();
  authOnly.ctx.end();await flush();
  assert.equal(authOnly.calls.filter(x=>x.name==='iniciar_corrida').length,1);
  assert.equal(authOnly.calls.filter(x=>x.name==='terminar_corrida').length,1,
    'o envio da corrida não deve depender de jogador.id quando a sessão está autenticada');

  const switched=scenario();
  switched.ctx.contaJ={nick:'Fã A'};
  switched.ctx.contaAuthUserId='A';
  switched.ctx.contaInicioCorrida();await flush();
  switched.ctx.end();
  switched.ctx.contaAuthUserId='B';
  switched.ctx.contaSessaoToken++;
  await flush();
  assert.equal(switched.calls.filter(x=>x.name==='terminar_corrida').length,0,
    'não enviar autorização após troca de sessão');

  const guest=scenario();guest.ctx.contaJ=null;
  guest.ctx.contaInicioCorrida();guest.ctx.end();await flush();
  assert.equal(guest.calls.length,0,'guest game never submits an online score');

  const training=scenario();training.ctx.isTestGame=true;
  training.ctx.contaInicioCorrida();training.ctx.end();await flush();
  assert.equal(training.calls.length,0,'test mode never submits an online score');

  const stuck=scenario('refreshAcc');stuck.ctx.contaInicioCorrida();await flush();
  assert.throws(()=>stuck.ctx.end(),/optional UI/);
  await flush();
  const finished=stuck.calls.filter(x=>x.name==='terminar_corrida');
  assert.equal(finished.length,1,'server finalization must survive a later UI failure');
  assert.equal(finished[0].args.p_run,'run-uuid');
  const early=scenario('newItems');early.ctx.contaInicioCorrida();await flush();
  assert.doesNotThrow(()=>early.ctx.end(), 'optional item drawing must not interrupt the run result');
  await flush();
  assert.equal(early.calls.filter(x=>x.name==='terminar_corrida').length,1,
    'item drawing failure must not prevent online finalization');
  assert(early.elements.get('res').innerHTML.includes('2300 pontos'));
  console.log('✓ Center Run: finalization precedes optional UI and is sent only once');
})().catch(e=>{console.error(e);process.exitCode=1;});
