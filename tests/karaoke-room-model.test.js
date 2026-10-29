// Pure model regression suite; offline only, no Supabase or real accounts.
"use strict";
const assert=require("node:assert/strict");
const room=require("../karaoke-room-model.js");
let checks=0;
function ok(test,description){assert.equal(test,true,description);checks++;}
function joinAll(state,count=9,now=0){
  for(let i=1;i<=count;i++){
    let next=room.join(state,"idol"+i,now);
    ok(next.status==="joined","Idol "+i+" enters once");
    state=next.room;
  }
  return state;
}

// Capacity 9, duplicate tabs do not cost a tenth slot.
{
  let s=joinAll(room.createRoom("sunday-room",0));
  ok(room.view(s,0).available===0,"exactly nine seats");
  ok(room.join(s,"idol10",0).status==="full","tenth person gets full");
  let again=room.join(s,"idol1",0);
  ok(again.status==="already_inside"&&again.room.seats.length===9,"same user second tab");
  ok(room.join(s,"bad id",0).status==="invalid_user","reject bad user identifier");
  let left=room.leave(s,"idol7",1000);
  ok(left.status==="left"&&room.join(left.room,"idol10",1000).status==="joined",
    "vacated place is reusable");
}

// The singer is also counted in the 9 and queue is FIFO.
{
  let s=joinAll(room.createRoom("concert-1",0));
  s=room.enqueue(s,"idol1",0).room;
  ok(s.current.userId==="idol1"&&s.queue.length===0,"first Idol takes microphone");
  for(let i=2;i<=9;i++)s=room.enqueue(s,"idol"+i,0).room;
  ok(s.queue.join(",")==="idol2,idol3,idol4,idol5,idol6,idol7,idol8,idol9","FIFO queue");
  ok(room.enqueue(s,"idol2",1).status==="already_queued","duplicate queue blocked");
  ok(room.enqueue(s,"idol1",1).status==="already_singing","one microphone per user");
  ok(room.enqueue(s,"outsider",1).status==="not_inside","outsider cannot queue");
  ok(room.view(s,4999).current.stage==="intro","five second intro");
  ok(room.view(s,5000).current.stage==="rhythm","rhythm starts at second five");
  for(let i=1;i<=9;i++)s=room.heartbeat(s,"idol"+i,30000).room;
  ok(room.view(s,49999).current.stage==="rhythm","rhythm ends at second fifty");
  ok(room.view(s,50000).current.stage==="encore","ten second encore");
  let id=s.current.id;
  ok(room.submitDemoResult(s,"idol2",id,{score:200,perfectCount:2,notes:20,chartId:"chart1"},52000).status==="not_owner",
    "someone else cannot submit score");
  ok(room.submitDemoResult(s,"idol1",id,{score:200,perfectCount:2,notes:20,chartId:"chart1"},40000).status==="wrong_time",
    "cannot submit while rhythm still playing");
  ok(room.submitDemoResult(s,"idol1",id,{score:200,perfectCount:40,notes:20,chartId:"chart1"},53000).status==="invalid_result",
    "perfect count cannot exceed chart note count");
  let result=room.submitDemoResult(s,"idol1",id,
    {score:24000,perfectCount:12,notes:60,chartId:"original1"},55000);
  ok(result.status==="accepted_demo","demo score accepted");
  s=result.room;
  ok(room.submitDemoResult(s,"idol1",id,
    {score:99999,perfectCount:60,notes:60,chartId:"original1"},56000).status==="duplicate",
    "duplicate result cannot overwrite the first");
  s=room.update(s,60000);
  ok(s.results.length===1&&s.results[0].verification==="demo_unverified",
    "one unverified result only; cannot issue official badges yet");
  ok(s.current.userId==="idol2","next queued singer at second sixty");
  ok(s.current.rhythmEndsAt-s.current.rhythmStartsAt===45000,"45-second rhythm duration");
  ok(s.current.endsAt-s.current.startsAt===60000,"60-second microphone duration");
  s=room.update(s,60000);
  ok(s.results.length===1,"idempotent finalization");
  ok(s.queue[0]==="idol3","queue continues in proper order");
}

// Removing someone from the queue doesn't remove their spectator place.
{
  let s=joinAll(room.createRoom("concert-2",0),3);
  s=room.enqueue(s,"idol1",0).room;
  s=room.enqueue(s,"idol2",0).room;
  s=room.enqueue(s,"idol3",0).room;
  s=room.dequeue(s,"idol2",100).room;
  ok(s.queue.join(",")==="idol3","cancel queue only");
  ok(s.seats.length===3,"spectator remains seated");
  s=room.leave(s,"idol1",100).room;
  ok(s.current.userId==="idol3","departing singer releases microphone");
  ok(s.seats.length===2,"departing singer loses one seat");
}

// No heartbeat -> release the singer's lease, don't give rewards.
{
  let s=joinAll(room.createRoom("concert-3",0),2);
  s=room.enqueue(s,"idol1",0).room;
  s=room.enqueue(s,"idol2",0).room;
  s=room.update(s,room.SEAT_TTL_MS);
  ok(s.seats.length===0&&s.current===null,"stale seat and microphone released");
  ok(s.results.length===0,"disconnected singer doesn't receive a score");
  ok(s.queue.length===0,"stale queued Idols cleaned up");
  ok(room.view(s,room.SEAT_TTL_MS).available===9,"room recovers all seats");
}
console.log("✓ Karaoke online room model:",checks,"offline assertions passed");
