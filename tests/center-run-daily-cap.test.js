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
assert(sql.includes('ganho_hoje + credito >= 100'),'partial credit reaching the cap must return the cap flag');
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

// Isolated serialized ledger model. It verifies intended concurrency/idempotency
// behavior; it is NOT a live PostgreSQL execution of the proposed function.
function makeLedger(){
  const accounts=new Map(),runs=new Set(),credits=[],locks=new Map();
  const get=id=>{if(!accounts.has(id))accounts.set(id,{stars:300});return accounts.get(id);};
  const finish=async (owner,run,day,requested,seconds)=>{
    const previous=locks.get(owner)||Promise.resolve();
    let release;
    const next=new Promise(resolve=>{release=resolve;});
    locks.set(owner,previous.then(()=>next));
    await previous;
    try{
      const key=owner+'|'+run;
      if(runs.has(key))return {ok:false,erro:'corrida_invalida',creditadas:0};
      runs.add(key);
      const earned=credits.filter(c=>c.owner===owner&&c.day===day&&c.reason==='corrida')
        .reduce((total,c)=>total+c.amount,0);
      const amount=capped(earned,requested,seconds);
      get(owner).stars+=amount;
      if(amount>0)credits.push({owner,day,reason:'corrida',amount});
      return {ok:true,creditadas:amount,stars:get(owner).stars,limite_diario:earned+amount>=100&&requested>0};
    }finally{release();}
  };
  return {finish,get,credits};
}
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
  const ledger=makeLedger();
  const today='2026-11-01',tomorrow='2026-11-02';
  const same=await Promise.all([
    ledger.finish('A','run-1',today,75,120),
    ledger.finish('A','run-2',today,75,120),
    ledger.finish('A','run-3',today,75,120)
  ]);
  assert.deepEqual(same.map(r=>r.creditadas),[75,25,0],
    'three concurrent submissions on the same account serialize at the 100-star cap');
  assert.equal(ledger.get('A').stars,400,'concurrent credits never exceed the account cap');
  assert.equal(same[1].limite_diario,true,'partial second run signals the reached cap');
  const duplicate=await Promise.all([
    ledger.finish('A','run-2',today,75,120),
    ledger.finish('A','run-2',today,75,120)
  ]);
  assert(duplicate.every(r=>r.ok===false),'repeated run UUID is never credited twice');
  assert.equal(ledger.credits.filter(c=>c.owner==='A').length,2,'only two actual credits were logged');
  const other=await ledger.finish('B','run-1',today,60,120);
  assert.equal(other.creditadas,60,'different accounts have independent limits');
  const rollover=await ledger.finish('A','run-4',tomorrow,100,120);
  assert.equal(rollover.creditadas,100,'new Sao Paulo day has a fresh allowance');
  assert.equal(ledger.get('A').stars,500,'old balance and newly earned credits are additive');
  assert.equal(ledger.credits.every(c=>c.reason==='corrida'),true,'other earning reasons are untouched by the cap');

  ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  assert(res.innerHTML.includes('Corrida sem autorização do servidor'),'missing run is no longer silent');
  assert.equal(ends,0,'missing token cannot start a finish RPC');

  res.innerHTML='Aguardando validação do servidor';
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  await flush();
  assert.equal(ends,1);assert(res.innerHTML.includes('20 estrelas'));
  assert.equal(ctx.starT,120,'confirmed server balance replaces local balance');

  res.innerHTML='Aguardando validação do servidor';
  finishResult=()=>Promise.resolve({ok:true,creditadas:10,limite_diario:true,stars:130,best:500});
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  await flush();
  assert(res.innerHTML.includes('10 estrelas')&&res.innerHTML.includes('Limite diário'),'partial credit and reached cap both appear');
  assert.equal(ctx.starT,130,'partial server credit changes the local balance exactly');

  res.innerHTML='Aguardando validação do servidor';
  finishResult=()=>Promise.resolve({ok:true,creditadas:0,limite_diario:true,stars:130,best:500});
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  await flush();
  assert(res.innerHTML.includes('Limite diário'),'valid cap reached receives clear feedback');
  assert.equal(ctx.starT,130,'no stars are added after daily cap');

  let release;
  startResult=()=>new Promise(resolve=>{release=resolve;});
  res.innerHTML='Aguardando validação do servidor';
  ctx.contaInicioCorrida();ctx.contaFimCorrida(500,30,'Tsu',()=>refreshes++);
  ctx.contaJ={id:'B',nick:'Pati'};ctx.contaSessaoToken++;
  release('run-1');await flush();
  assert.equal(ends,3,'delayed start from old account must not finish under new account');
  assert.equal(ctx.starT,130,'old run must not replace the new account balance');
  assert(starts>=3&&refreshes>=3);
  console.log('✓ Center Run: daily cap model, midnight, missing token, cap message and account switch');
})().catch(err=>{console.error(err);process.exitCode=1;});
