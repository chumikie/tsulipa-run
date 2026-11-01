'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'..','karaoke-tickets.js'),'utf8');
const karaoke=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
function createStore(){const data=new Map();return {data,getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};}
function boot(store,account,rpc,uuid){const win={LANG:'pt',contaJ:{id:account},localStorage:store,crypto:{randomUUID:uuid},contaRpc:rpc};new Function('window','document','_supabase',source)(win,{getElementById:()=>null},{});return win;}
async function main(){
 // Server debits, response is lost, page reloads: same UUID must not debit twice.
 {
  const store=createStore(),charged=new Set();let balance=2,n=0,lost=true;
  const rpc=async(name,p)=>{if(name==='kt_ticket_wallet')return {ok:true,tickets:balance};
   if(name==='kt_ticket_run_start'){if(!charged.has(p.p_request)){charged.add(p.p_request);balance--;}if(lost){lost=false;throw Error('network lost');}return {ok:true,run:'run-A',tickets:balance};}};
  let w=boot(store,'A',rpc,()=>String(++n));await w.ktTickets.refresh();
  await assert.rejects(w.ktTickets.startExtra(),/network lost/);assert.equal(balance,1);
  w=boot(store,'A',rpc,()=>String(++n));await w.ktTickets.refresh();
  const resumed=await w.ktTickets.startExtra();assert.equal(resumed.run,'run-A');assert.equal(balance,1);assert.equal(charged.size,1);assert.equal(n,1);
  assert.equal(w.ktTickets.completeRun('run-A'),true);assert.equal(store.data.size,0);
  await w.ktTickets.startExtra();assert.equal(balance,0);assert.equal(charged.size,2);
 }
 // Two simultaneous calls share one idempotency key.
 {
  const store=createStore(),seen=new Set();let balance=2,n=0;
  const rpc=async(name,p)=>{if(name==='kt_ticket_wallet')return {ok:true,tickets:balance};
   if(name==='kt_ticket_run_start'){if(!seen.has(p.p_request)){seen.add(p.p_request);balance--;}return {ok:true,run:'run-A',tickets:balance};}};
  const w=boot(store,'A',rpc,()=>String(++n));await w.ktTickets.refresh();
  await Promise.all([w.ktTickets.startExtra(),w.ktTickets.startExtra()]);
  assert.equal(balance,1);assert.equal(seen.size,1);assert.equal(n,1);
 }
 // A delayed response from account A must not mutate account B; keys remain scoped per account.
 {
  const store=createStore();let resolveRun,n=0;
  const rpc=(name)=>name==='kt_ticket_wallet'?Promise.resolve({ok:true,tickets:2}):new Promise(r=>{resolveRun=r;});
  const w=boot(store,'A',rpc,()=>String(++n));await w.ktTickets.refresh();
  const pending=w.ktTickets.startExtra();w.contaJ={id:'B'};
  resolveRun({ok:true,tickets:1,run:'run-A'});
  const result=await pending;assert.equal(result.reason,'account_changed');
  assert(store.data.has('kt_ticket_request_v1:A'));assert(!store.data.has('kt_ticket_request_v1:B'));
  w.ktTickets.reset();await w.ktTickets.refresh();assert.equal(w.ktTickets.get(),2);
 }
 assert(karaoke.includes('function ticketConcluir(id)'),'iframe acknowledges a finalized ticket run');
 assert(karaoke.includes('if(wantsTicket&&resume&&r&&r.reason===\'limit\'&&sameSession(a,owner))'),'stale resumed runs are reconciled without crossing accounts');
 assert(karaoke.includes("if(!sameSession(a,owner))return"),'all delayed responses retain session ownership checks');
 assert(karaoke.includes('if(x&&(x.ranked||x.reason===\'invalid\'))ticketConcluir(id)'),'terminal finish clears the saved request');
 console.log('✓ Ticket recovery: lost response, reload, idempotency, concurrency, account switch and guarded completion');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
