'use strict';
// Karaoke 3A.11: simulate concurrent status, lease renewal and bfcache without Supabase.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const js=fs.readFileSync(path.join(__dirname,'../karaoke-homol-client.js'),'utf8');
function between(a,b){
 const i=js.indexOf(a),j=js.indexOf(b,i+a.length);
 assert.ok(i>=0&&j>i,'Missing source boundaries '+a+' / '+b);
 return js.slice(i,j);
}
async function main(){
 const script=between('async function refresh(doHeartbeat){','async function refreshData(doHeartbeat){');
 let resolveStatus,shouldPause=true;
 const ctx=vm.createContext({
   client:{},token:'TEST_SEAT',labOpen:true,currentRefresh:null,
   pendingHeartbeat:false,calls:[],say(){},
   refreshData:async function(beat){
     ctx.calls.push(beat);
     if(shouldPause){shouldPause=false;return new Promise(resolve=>{resolveStatus=resolve;});}
     return {status:'ok'};
   }
 });
 vm.runInContext(script,ctx);
 const status=ctx.refresh(false);
 assert.deepEqual(ctx.calls,[false]);
 const heartbeat=ctx.refresh(true);
 assert.deepEqual(ctx.calls,[false],'heartbeat is queued, not silently dropped');
 resolveStatus({status:'ok'});
 await Promise.all([status,heartbeat]);
 assert.deepEqual(ctx.calls,[false,true],'heartbeat executes after in-flight status');
 ctx.calls.length=0;
 await Promise.all([ctx.refresh(true),ctx.refresh(false)]);
 assert.deepEqual(ctx.calls,[true],'duplicate refresh shares one renewal');

 // Closed gate must never send a pending heartbeat.
 ctx.calls.length=0;
 ctx.refreshData=async function(beat){
  ctx.calls.push(beat);
  if(ctx.calls.length===1)return new Promise(resolve=>{resolveStatus=resolve;});
  return {status:'ok'};
 };
 const closing=ctx.refresh(false);
 const queued=ctx.refresh(true);
 ctx.token=null;ctx.labOpen=false;
 resolveStatus({status:'lab_closed'});
 await Promise.all([closing,queued]);
 assert.deepEqual(ctx.calls,[false]);

 // Restoration from bfcache recreates both intervals exactly once.
 const timers=between('function startHomolTimers(){','async function rpc(action){');
 const a=js.lastIndexOf("window.addEventListener('pagehide',");
 const b=js.lastIndexOf('})();');
 assert.ok(a>=0&&b>a);
 const lifecycle=js.slice(a,b);
 const handlers={};
 let started=0,cleared=0;
 const env=vm.createContext({
   ready:true,token:'TEST_SEAT',labOpen:true,busy:false,
   timer:null,turnClockTimer:null,sync:{stop(){}},
   document:{hidden:false},window:{addEventListener:(event,fn)=>{handlers[event]=fn;}},
   setInterval:()=>++started,clearInterval:()=>{cleared++;},
   refresh:async()=>{},say(){},showTurnClock(){}
 });
 vm.runInContext(timers+'\n'+lifecycle,env);
 env.startHomolTimers();env.startHomolTimers();
 assert.equal(started,2);
 handlers.pagehide();
 assert.equal(cleared,2);
 assert.equal(env.timer,null);assert.equal(env.turnClockTimer,null);
 handlers.pageshow();handlers.pageshow();
 assert.equal(started,4,'one replacement per timer');
 assert.ok(js.includes('var SIGNUP_ENABLED=false;'),'homologation signup must remain disabled');
 console.log('✓ Karaoke 3A.11: lease priority and bfcache cleanup/recovery');
}
main().catch(err=>{console.error(err);process.exitCode=1;});
