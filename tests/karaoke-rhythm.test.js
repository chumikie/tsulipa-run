// Offline tests for original 45-second karaoke rhythm. No credentials/network.
"use strict";
const assert=require("node:assert/strict"),game=require("../karaoke-rhythm.js");
let n=0;function ok(value,msg){assert.ok(value,msg);n++;}
const chart=game.makeChart();
ok(chart.length===40,"40 notes in the demo chart");
ok(chart.every((t,i)=>i===0||t>chart[i-1]),"notes strictly increasing");
ok(chart[chart.length-1]<45000-200,"last note inside play window");
ok(game.TOTAL_MS===60000&&game.INTRO_MS===5000&&game.RHYTHM_MS===45000,
  "5 + 45 + 10 seconds");
let run=game.start(100000),first=run.startedAt+game.INTRO_MS+chart[0];
ok(game.stage(run,104999)==="intro","intro until 5 seconds");
ok(game.hit(run,first-1500).judgement==="outside","early hit before rhythm blocked");
ok(game.stage(run,105000)==="rhythm","rhythm begins after intro");
ok(game.hit(run,first).judgement==="PERFECT","on-beat tap perfect");
ok(game.hit(run,first).judgement==="early","same note cannot be farmed twice");
ok(run.score===1010&&run.perfectCount===1,"perfect scored once");
ok(game.hit(run,run.startedAt+game.INTRO_MS+chart[1]+145).judgement==="GOOD",
  "140ms tap good");
ok(run.goodCount===1&&run.combo===2,"combo and good count");
ok(game.tick(run,160000).phase==="finished","turn expires after exactly 60s");
ok(game.hit(run,160001).judgement==="outside","no scoring after turn");
let a=game.result(run,160000);
ok(a.verified===false&&a.persisted===false,"results are demo only");
ok(a.totalNotes===a.perfectCount+a.goodCount+a.missCount,
  "unplayed notes count as misses at end");
ok(a.score===1510&&a.perfectCount===1,"final result remains deterministic");
let b=game.start(0);
ok(game.hit(b,5000+chart[0]+201).judgement==="early","late hit rejected");
ok(game.tick(b,60000).score===0,"no automatic score without input");
ok(game.result(b,60000).missCount===40,"all missed notes logged");
console.log("✓ Karaoke 45s rhythm:",n,"offline assertions passed");