/* TsuLiPa⭐World · Karaoke⭐Day! room rules prototype (stage 3A.1).
   Pure, dependency-free room state machine for local testing.
   THIS IS NOT AN ONLINE SERVER. A future authenticated service must own the
   authoritative state, timestamp, lock/transaction and permissions.
   Do not use this module to authorize browser clients or write production data. */
(function(root,factory){
  "use strict";
  var api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.TsuKaraokeRoomModel=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  var CAPACITY=9,QUEUE_CAPACITY=3,SEAT_TTL_MS=45000,TURN_MS=60000;
  var INTRO_MS=5000,RHYTHM_MS=45000,OUTRO_MS=10000;
  var MAX_RESULT_SCORE=1000000,MAX_NOTES=200;
  function validTime(t){return Number.isSafeInteger(t)&&t>=0;}
  function validId(id){return typeof id==="string"&&/^[a-zA-Z0-9_-]{1,96}$/.test(id);}
  function clone(r){
    return {sessionId:r.sessionId,createdAt:r.createdAt,revision:r.revision,
      capacity:CAPACITY,queueCapacity:QUEUE_CAPACITY,nextTurn:r.nextTurn,
      seats:r.seats.map(function(s){return {userId:s.userId,leaseUntil:s.leaseUntil};}),
      queue:r.queue.slice(),
      current:r.current?Object.assign({},r.current,{provisional:r.current.provisional?
        Object.assign({},r.current.provisional):null}):null,
      results:r.results.map(function(s){return Object.assign({},s);})};
  }
  function createRoom(sessionId,now){
    if(!validId(sessionId)||!validTime(now))throw new Error("invalid_room");
    return {sessionId:sessionId,createdAt:now,revision:0,capacity:CAPACITY,queueCapacity:QUEUE_CAPACITY,nextTurn:1,
      seats:[],queue:[],current:null,results:[]};
  }
  function hasSeat(r,id){return r.seats.some(function(s){return s.userId===id;});}
  function stage(current,now){
    if(!current)return "idle";
    if(now<current.startsAt+INTRO_MS)return "intro";
    if(now<current.startsAt+INTRO_MS+RHYTHM_MS)return "rhythm";
    if(now<current.endsAt)return "encore";
    return "ended";
  }
  function startNext(r,now){
    if(r.current)return;
    while(r.queue.length){
      var id=r.queue.shift();
      if(!hasSeat(r,id))continue;
      var start=now,number=r.nextTurn++;
      r.current={id:r.sessionId+"-"+number,userId:id,startsAt:start,
        rhythmStartsAt:start+INTRO_MS,rhythmEndsAt:start+INTRO_MS+RHYTHM_MS,
        endsAt:start+TURN_MS,provisional:null};
      return;
    }
  }
  function update(r,now){
    if(!validTime(now))throw new Error("invalid_clock");
    var n=clone(r),expired=[];
    n.seats=n.seats.filter(function(s){
      if(s.leaseUntil>now)return true;
      expired.push(s.userId);return false;
    });
    if(expired.length){
      n.queue=n.queue.filter(function(id){return expired.indexOf(id)<0;});
      // If a singer disconnects, the turn is not scored or awarded.
      if(n.current&&expired.indexOf(n.current.userId)>=0)n.current=null;
    }
    if(n.current&&now>=n.current.endsAt){
      var t=n.current;
      if(t.provisional&&!n.results.some(function(v){return v.turnId===t.id;})){
        n.results.push({turnId:t.id,userId:t.userId,score:t.provisional.score,
          perfectCount:t.provisional.perfectCount,
          chartId:t.provisional.chartId,endedAt:t.endsAt,
          verification:"demo_unverified"});
      }
      n.current=null;
    }
    startNext(n,now);
    if(expired.length||JSON.stringify(n.current)!==JSON.stringify(r.current)||
        n.results.length!==r.results.length||n.queue.length!==r.queue.length)n.revision++;
    return n;
  }
  function join(r,id,now){
    if(!validId(id))return {room:r,status:"invalid_user"};
    var n=update(r,now),present=n.seats.find(function(s){return s.userId===id;});
    if(present){present.leaseUntil=now+SEAT_TTL_MS;n.revision++;return {room:n,status:"already_inside"};}
    if(n.seats.length>=CAPACITY)return {room:n,status:"full"};
    n.seats.push({userId:id,leaseUntil:now+SEAT_TTL_MS});n.revision++;
    return {room:n,status:"joined"};
  }
  function heartbeat(r,id,now){
    var n=update(r,now),seat=n.seats.find(function(s){return s.userId===id;});
    if(!seat)return {room:n,status:"not_inside"};
    seat.leaseUntil=now+SEAT_TTL_MS;n.revision++;
    return {room:n,status:"refreshed"};
  }
  function leave(r,id,now){
    var n=update(r,now),before=n.seats.length;
    n.seats=n.seats.filter(function(s){return s.userId!==id;});
    n.queue=n.queue.filter(function(v){return v!==id;});
    if(n.current&&n.current.userId===id)n.current=null;
    startNext(n,now);
    if(n.seats.length!==before)n.revision++;
    return {room:n,status:before===n.seats.length?"not_inside":"left"};
  }
  function enqueue(r,id,now){
    var n=update(r,now);
    if(!hasSeat(n,id))return {room:n,status:"not_inside"};
    if(n.current&&n.current.userId===id)return {room:n,status:"already_singing"};
    if(n.queue.indexOf(id)>=0)return {room:n,status:"already_queued"};
    if(n.current&&n.queue.length>=QUEUE_CAPACITY)return {room:n,status:"queue_full"};
    n.queue.push(id);startNext(n,now);n.revision++;
    return {room:n,status:n.current&&n.current.userId===id?"microphone":"queued"};
  }
  function dequeue(r,id,now){
    var n=update(r,now),old=n.queue.length;
    n.queue=n.queue.filter(function(v){return v!==id;});
    if(old!==n.queue.length)n.revision++;
    return {room:n,status:old!==n.queue.length?"removed":"not_queued"};
  }
  function submitDemoResult(r,id,turnId,payload,now){
    var n=update(r,now),t=n.current;
    if(!t||t.userId!==id||t.id!==turnId)return {room:n,status:"not_owner"};
    if(now<t.rhythmEndsAt||now>=t.endsAt)return {room:n,status:"wrong_time"};
    if(t.provisional)return {room:n,status:"duplicate"};
    var score=payload&&payload.score,perfect=payload&&payload.perfectCount,
        chartId=payload&&payload.chartId,notes=payload&&payload.notes;
    if(!Number.isSafeInteger(score)||score<0||score>MAX_RESULT_SCORE||
       !Number.isSafeInteger(perfect)||perfect<0||
       !Number.isSafeInteger(notes)||notes<1||notes>MAX_NOTES||
       perfect>notes||!validId(chartId))
      return {room:n,status:"invalid_result"};
    // Score remains UNVERIFIED. A server must validate chart, timestamps,
    // input replay and token before real badges/rewards can be persisted.
    t.provisional={score:score,perfectCount:perfect,chartId:chartId};n.revision++;
    return {room:n,status:"accepted_demo"};
  }
  function view(r,now){
    var n=update(r,now);
    return {capacity:CAPACITY,queueCapacity:QUEUE_CAPACITY,occupied:n.seats.length,available:CAPACITY-n.seats.length,
      queue:n.queue.slice(),current:n.current?{
        id:n.current.id,userId:n.current.userId,stage:stage(n.current,now),
        secondsLeft:Math.max(0,Math.ceil((n.current.endsAt-now)/1000))
      }:null,recentResults:n.results.slice(-9),revision:n.revision};
  }
  return Object.freeze({CAPACITY:CAPACITY,QUEUE_CAPACITY:QUEUE_CAPACITY,SEAT_TTL_MS:SEAT_TTL_MS,TURN_MS:TURN_MS,
    INTRO_MS:INTRO_MS,RHYTHM_MS:RHYTHM_MS,OUTRO_MS:OUTRO_MS,
    createRoom:createRoom,update:update,join:join,heartbeat:heartbeat,leave:leave,
    enqueue:enqueue,dequeue:dequeue,submitDemoResult:submitDemoResult,view:view});
});
