// Offline lifecycle tests — no browser, Supabase account or network connection.
'use strict';
const assert = require('node:assert/strict');
const {create} = require('../karaoke-homol-sync.js');

async function main() {
  let clock=10000, currentHandler, subscriptions=0, removals=0, reads=0;
  let subscribed=true, member=true, busy=false;
  const timers=[],delays=[];
  const messages=[];
  const client={
    auth:{getSession:async()=>({data:{session:{access_token:'TEST_ONLY'}}})},
    realtime:{setAuth:async()=>{}},
    channel:()=>({
      on(type,filter,handler){
        assert.equal(type,'postgres_changes');
        assert.equal(filter.table,'tsulipa_karaoke_lab_signal');
        currentHandler=handler;
        return this;
      },
      subscribe(callback){
        subscriptions++;
        if(!subscribed)throw Error('WebSocket subscribe failed');
        callback('SUBSCRIBED');
        return this;
      }
    }),
    async removeChannel(){removals++;}
  };
  const watcher=create({client,now:()=>clock,
    canListen:()=>member,hidden:()=>false,busy:()=>busy,
    setTimeout:(fn,ms)=>{timers.push(fn);delays.push(ms);return timers.length;},
    clearTimeout:()=>{timers.length=0;delays.length=0;},
    refresh:async()=>{reads++;watcher.mark(7);},
    onStatus:(message)=>messages.push(message),minInterval:500
  });

  // Failure during subscribe must not strand channel and block future starts.
  subscribed=false;
  await watcher.start();
  assert.equal(subscriptions,1);
  assert.equal(removals,1,'release channel on synchronous subscribe failure');
  subscribed=true;
  clock+=60000;
  await watcher.start();
  assert.equal(subscriptions,2,'retry subscribes after fallback interval');

  watcher.mark(5);
  currentHandler({new:{revision:7,seat_token:'NOT_USED'}});
  currentHandler({new:{revision:7}});
  assert.equal(timers.length,1,'revision signals coalesce');
  assert.equal(delays.shift(),300,'first room notification uses the minimum debounce');
  await timers.shift()();
  assert.equal(reads,1,'one protected RPC refresh per burst');
  clock+=100;
  currentHandler({new:{revision:8}});
  assert.equal(delays.shift(),400,'live stage updates use the configured refresh interval');
  await timers.shift()();
  assert.equal(reads,2);
  currentHandler({new:{revision:7}});
  assert.equal(timers.length,0,'already-seen revisions ignored');

  // Leaving the room disconnects, preventing further refreshes.
  member=false;
  watcher.stop();
  assert.equal(removals,2);
  currentHandler({new:{revision:8}});
  assert.equal(timers.length,0,'a former member cannot schedule refreshes');
  await watcher.start();
  assert.equal(subscriptions,2,'nonmember cannot resubscribe');

  // Stop during asynchronous Auth must not attach a late channel.
  let finishAuth;
  const pendingAuthClient={...client,
    auth:{getSession:()=>new Promise(resolve=>{finishAuth=resolve;})}
  };
  const watcher2=create({client:pendingAuthClient,
    now:()=>clock,canListen:()=>true,hidden:()=>false,busy:()=>false});
  const starting=watcher2.start();
  watcher2.stop();
  finishAuth({data:{session:{access_token:'TEST_ONLY'}}});
  await starting;
  assert.equal(subscriptions,2,'stop invalidates pending Auth handshake');
  console.log('✓ Karaoke sync lifecycle: recover failures, coalesce, disconnect and cancel Auth');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
