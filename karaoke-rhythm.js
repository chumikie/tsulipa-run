/* Karaoke⭐Day! — original local rhythm prototype, isolated from economy.
   No database requests, no rewards, no copyrighted music or audio loops.
   The server must validate any future online achievements independently. */
(function(root,factory){
  "use strict";
  var api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.TsuKaraokeRhythm=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  var INTRO_MS=5000,RHYTHM_MS=45000,OUTRO_MS=10000;
  var TOTAL_MS=INTRO_MS+RHYTHM_MS+OUTRO_MS;
  function checkTime(now){if(!Number.isFinite(now)||now<0)throw Error("invalid_time");}
  // An original, gently syncopated chart; 40 notes over ~43 seconds.
  // No existing song, melody, or copyrighted beat is reproduced.
  function makeChart(){
    var notes=[],t=1350;
    for(var i=0;i<40;i++){
      notes.push(Math.round(t));
      t+=([1000,1125,875,1125,1000,875,1250,1000][i%8]);
    }
    return notes;
  }
  function start(now){
    checkTime(now);
    return {startedAt:now,chart:makeChart(),judged:{},score:0,
      combo:0,bestCombo:0,perfectCount:0,goodCount:0,missCount:0};
  }
  function stage(run,now){
    checkTime(now);
    var elapsed=now-run.startedAt;
    return elapsed<INTRO_MS?"intro":
      elapsed<INTRO_MS+RHYTHM_MS?"rhythm":
      elapsed<TOTAL_MS?"outro":"finished";
  }
  function markMissed(run,now){
    var relative=now-run.startedAt-INTRO_MS;
    for(var i=0;i<run.chart.length;i++){
      if(run.judged[i])continue;
      if(relative>run.chart[i]+200){
        run.judged[i]="MISS";run.missCount++;run.combo=0;
      }
    }
  }
  function tick(run,now){
    checkTime(now);
    markMissed(run,now);
    return {phase:stage(run,now),secondsLeft:Math.max(0,Math.ceil((run.startedAt+TOTAL_MS-now)/1000)),
      score:run.score,combo:run.combo,perfectCount:run.perfectCount,
      goodCount:run.goodCount,missCount:run.missCount,nextNoteMs:nextNote(run,now),
      totalNotes:run.chart.length};
  }
  function nextNote(run,now){
    var rel=now-run.startedAt-INTRO_MS;
    for(var i=0;i<run.chart.length;i++){
      if(!run.judged[i]&&run.chart[i]>=rel-200)return run.chart[i]-rel;
    }
    return null;
  }
  function hit(run,now){
    if(stage(run,now)!=="rhythm")return {judgement:"outside"};
    markMissed(run,now);
    var relative=now-run.startedAt-INTRO_MS,best=-1,delta=201;
    for(var i=0;i<run.chart.length;i++){
      if(run.judged[i])continue;
      var dt=Math.abs(relative-run.chart[i]);
      if(dt<delta){delta=dt;best=i;}
    }
    if(best<0||delta>200)return {judgement:"early"};
    var judgement=delta<=95?"PERFECT":"GOOD";
    run.judged[best]=judgement;
    run.combo++;run.bestCombo=Math.max(run.bestCombo,run.combo);
    if(judgement==="PERFECT"){run.perfectCount++;run.score+=1000+Math.min(200,run.combo*10);}
    else{run.goodCount++;run.score+=500;}
    return {judgement:judgement,score:run.score,combo:run.combo};
  }
  function result(run,now){
    tick(run,now);
    return {score:run.score,perfectCount:run.perfectCount,
      goodCount:run.goodCount,missCount:run.missCount,
      bestCombo:run.bestCombo,totalNotes:run.chart.length,
      verified:false,persisted:false};
  }
  return Object.freeze({INTRO_MS:INTRO_MS,RHYTHM_MS:RHYTHM_MS,
    OUTRO_MS:OUTRO_MS,TOTAL_MS:TOTAL_MS,makeChart:makeChart,
    start:start,stage:stage,tick:tick,hit:hit,result:result});
});