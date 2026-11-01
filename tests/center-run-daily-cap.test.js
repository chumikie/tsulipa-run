'use strict';
// Offline contract checks. No live RPCs, player writes or production SQL.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const page=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/center_run_daily_100_REVIEW_ONLY.sql'),'utf8');
const start=page.indexOf('function contaInicioCorrida(){');
const end=page.indexOf('function contaGasto(',start);
assert(start>=0&&end>start,'Center Run start and finish functions are available');
assert(sql.includes("reason = 'corrida'"),'only Center Run credits enter the daily sum');
assert(sql.includes("America/Sao_Paulo"),'Brazilian civil day is used');
assert(sql.includes('400, 100 - ganho_hoje'),'daily cap changes while the existing per-run cap remains');
assert(sql.includes('for update')&&sql.includes('finished_at is null'),'player/run locks and repeat-run protection remain');
assert(sql.indexOf('where id = auth.uid() for update')<sql.indexOf('from public.star_log'),'daily credits are counted under the player lock');
assert(sql.includes("'limite_diario', limite_diario"),'valid zero-credit cap has a dedicated response');
assert(!sql.includes('ganhar_minijogo('),'Pet RPC remains untouched');

const capped=(earned,requested,seconds,valid=true)=>valid?
  Math.max(0,Math.min(requested,Math.floor(seconds*3)+5,400,100-earned)):0;
assert.equal(capped(0,80,120),80,'first run may earn up to the daily cap');
assert.equal(capped(80,50,120),20,'next run receives only the remaining daily allowance');
assert.equal(capped(100,30,120),0,'later runs receive no additional Center stars');
assert.equal(capped(100,30,120,false),0,'invalid run does not earn any stars');
assert.equal(capped(0,400,10),35,'time validation allowance remains active');
const brDay=iso=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso));
assert.notEqual(brDay('2026-11-02T02:59:59Z'),brDay('2026-11-02T03:00:00Z'),'daily ledger rolls at Sao Paulo midnight');

const res={innerHTML:'Aguardando validação do servidor'};
let starts=0,ends=0,refreshes=0;
let startResult=()=>Promise.resolve('run-1');
let finishResult=()=>Promise.resolve({ok:true,creditadas:20,stars:120,best:500});
const ctx={
  contaJ:{id:'A',nick:'Tsu'},contaRun:null,contaUltimaRun:null,contaSessaoToken:1,
  isTestGame:false,starT:100,did:'device-test',gachaBonus:()=>{},
  contaRpc:(name,args)=>{
    if(name==='iniciar_corrida'){starts++;return startResult();}
    if(name==='terminar_corrida'){ends++;assert.equal(args.p_run,'run-1');return finishResult();}
    throw Error('unexpected RPC: '+name);
  },
  $:id=>id==='res'?res:null,tr:s=>s,localStorage:{setItem:()=>{}},
  setBest:()=>{},quartetoTalvez:()=>{},hubAposCorrida:()=>{},
  Promise,Error,String
};
vm.runInNewContext(page.slice(start,end),ctx);
const flush=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
  ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  assert(res.innerHTML.includes('Corrida sem autorização do servidor'),'missing run is no longer silent');
  assert.equal(ends,0,'missing token cannot start a finish RPC');

  res.innerHTML='Aguardando validação do servidor';
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  await flush();
  assert.equal(ends,1);assert(res.innerHTML.includes('20 estrelas'));
  assert.equal(ctx.starT,120,'confirmed server balance replaces local balance');

  res.innerHTML='Aguardando validação do servidor';
  finishResult=()=>Promise.resolve({ok:true,creditadas:0,limite_diario:true,stars:120,best:500});
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  await flush();
  assert(res.innerHTML.includes('Limite diário'),'valid cap reached receives clear feedback');
  assert.equal(ctx.starT,120,'no stars are added after daily cap');

  let release;
  startResult=()=>new Promise(resolve=>{release=resolve;});
  res.innerHTML='Aguardando validação do servidor';
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  ctx.contaJ={id:'B',nick:'Pati'};ctx.contaSessaoToken++;
  release('run-1');await flush();
  assert.equal(ends,2,'delayed start from old account must not finish under new account');
  assert.equal(ctx.starT,120,'old run must not replace the new account balance');
  assert(starts>=3&&refreshes>=3);
  console.log('✓ Center Run: daily cap model, midnight, missing token, cap message and account switch');
})().catch(err=>{console.error(err);process.exitCode=1;});
