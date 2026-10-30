'use strict';
// Exercise the isolated reconnect boot with mocked Auth; never accesses Supabase.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const client=fs.readFileSync(path.join(__dirname,'..','karaoke-homol-client.js'),'utf8');
const start=client.lastIndexOf('if(REUSE_SESSION_ONLY){');
const end=client.indexOf('\n})();',start);
assert.ok(start>=0&&end>start,'reuse-session boot exists');
const boot=client.slice(start,end);

async function run(session,user){
  const calls={signIn:0,verify:0,refresh:0,timers:0};
  const context=vm.createContext({
    REUSE_SESSION_ONLY:true,
    client:{auth:{
      getSession:async()=>({data:{session}}),
      getUser:async()=>{calls.verify++;return {data:{user}};},
      signInAnonymously:async()=>{calls.signIn++;}
    }},
    lock:()=>true,unlock(){},init:async()=>{},
    refresh:async()=>{calls.refresh++;},startHomolTimers:()=>{calls.timers++;},
    say:message=>{calls.message=message;},
    ready:false,labOpen:false
  });
  vm.runInContext(boot,context);
  await new Promise(resolve=>setImmediate(resolve));
  return {calls,context};
}

async function main(){
  const missing=await run(null,null);
  assert.equal(missing.calls.signIn,0);
  assert.equal(missing.calls.verify,0);
  assert.equal(missing.calls.refresh,0);
  assert.match(missing.calls.message,/Nenhuma conta foi criada/);
  assert.equal(missing.context.ready,false);

  const permanent={id:'permanent',is_anonymous:false};
  const rejected=await run({user:permanent},permanent);
  assert.equal(rejected.calls.signIn,0);
  assert.equal(rejected.calls.verify,0);
  assert.equal(rejected.calls.refresh,0);
  assert.match(rejected.calls.message,/Nenhuma conta foi criada/);

  const anonymous={id:'anonymous-test',is_anonymous:true};
  const reused=await run({user:anonymous},anonymous);
  assert.equal(reused.calls.signIn,0);
  assert.equal(reused.calls.verify,1);
  assert.equal(reused.calls.refresh,1);
  assert.equal(reused.calls.timers,1);
  assert.equal(reused.context.ready,true);
  assert.match(reused.calls.message,/sessão anônima existente reutilizada/i);
}

main().then(()=>console.log('✓ Karaoke auth reuse: absent, permanent and anonymous sessions'))
  .catch(error=>{console.error(error);process.exitCode=1;});
