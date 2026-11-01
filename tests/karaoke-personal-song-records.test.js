'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const start=html.indexOf('var KaraokeShowRules=(function(){');
const end=html.indexOf('/* Um conceito por dia de Brasília',start);
assert(start>=0&&end>start,'KaraokeShowRules source exists');
const source=html.slice(start,end);

const KaraokeDaily={
  dayNumber(day){return Math.floor(Date.parse(day+'T00:00:00Z')/86400000);},
  nextDay(day,offset){return new Date((this.dayNumber(day)+offset)*86400000).toISOString().slice(0,10);}
};
function createStorage(initial){
  let value=initial===undefined?null:JSON.stringify(initial);
  return {
    getItem(key){assert.equal(key,'kt_showcase_week_v1');return value;},
    setItem(key,next){assert.equal(key,'kt_showcase_week_v1');value=String(next);},
    read(){return value===null?null:JSON.parse(value);}
  };
}
function loadRules(storage){
  const sandbox={KaraokeDaily,console};
  vm.createContext(sandbox);
  vm.runInContext(source+'\nthis.KaraokeShowRules=KaraokeShowRules;',sandbox,{timeout:1000});
  return sandbox.KaraokeShowRules.create(storage);
}
function complete(rules,player,day,song,score,hits,attempts,combo){
  const admission=rules.begin(player,day,song,false);
  assert.equal(admission.ok,true,'a valid local show should start');
  const result=rules.finish(player.id,admission.round.token,day,{
    score,hits,attempts,combo,totalNotes:attempts,completedAt:Date.parse(day+'T12:00:00Z')
  });
  assert.equal(result.ok,true,'a valid completed show should be saved');
  return result;
}

const DAY='2026-11-01';
const NEXT_WEEK='2026-11-08';
const storage=createStorage();
const rules=loadRules(storage);
const playerA={id:'account-A',nick:'Idol A',avatar:{c:{hair:'#ff7eb6'}}};
const playerB={id:'account-B',nick:'Idol B',avatar:{c:{hair:'#4169e1'}}};

// Personal bests are independent for each music key and improve only on score.
complete(rules,playerA,DAY,'normal',700,8,10,4);
complete(rules,playerA,DAY,'normal',980,9,10,6);
complete(rules,playerA,DAY,'fast',850,8,10,5);
complete(rules,playerB,DAY,'normal',500,7,10,3);
let bestA=rules.personalSongs(DAY,playerA.id);
assert.equal(bestA.normal.score,980,'normal best keeps the highest score');
assert.equal(bestA.fast.score,850,'fast track keeps its own personal best');
assert.equal(bestA.chill,undefined,'tracks without a completed record stay empty');
assert.equal(bestA.normal.nick,'Idol A','record keeps its owner display name');
assert.equal(rules.personalSongs(DAY,playerB.id).normal.score,500,'another account gets its own song record');
assert.equal(rules.personalSongs(DAY,'unknown').normal,undefined,'personal records never leak between accounts');

// A lower score on the same song must not replace its best result.
complete(rules,playerA,DAY,'normal',620,7,10,3);
bestA=rules.personalSongs(DAY,playerA.id);
assert.equal(bestA.normal.score,980,'a lower later score cannot overwrite the personal best');

// Personal song records survive the weekly rotation; shared weekly boards still reset.
const beforeWeek=rules.boards(DAY);
assert(beforeWeek.score.some(row=>row.id==='account-A'),'weekly board contains the completed player before rollover');
assert.deepEqual(Object.keys(rules.boards(NEXT_WEEK).score),[],'shared weekly board resets for the new week');
bestA=rules.personalSongs(NEXT_WEEK,playerA.id);
assert.equal(bestA.normal.score,980,'personal music best survives the weekly reset');
assert.equal(bestA.fast.score,850,'every personal track remains after the weekly reset');
assert.equal(rules.snapshot(NEXT_WEEK,playerA.id).used,0,'daily show quota starts fresh in the new week');

// Existing version-1 saves without personalSongs migrate in place, retaining quota and ranking.
const legacyRecord={id:'legacy-A',nick:'Legacy Idol',avatar:{c:{}},song:'normal',score:321,hits:7,attempts:10,accuracy:70,combo:4,completedAt:1,token:'legacy'};
const legacyState={
  v:1,
  week:'2026-10-25',
  quota:{day:'2026-11-01',owners:{'legacy-A':{used:2}}},
  records:{'legacy-A':{score:legacyRecord}},
  active:{}
};
const legacyStorage=createStorage(legacyState);
const legacyRules=loadRules(legacyStorage);
const legacySnapshot=legacyRules.snapshot(DAY,'legacy-A');
assert.equal(legacySnapshot.used,2,'old daily quota survives migration');
assert.equal(legacyRules.boards(DAY).score[0].score,321,'old weekly ranking record survives migration');
assert.deepEqual(Object.keys(legacyRules.personalSongs(DAY,'legacy-A')),[],'old saves start with an empty personal song collection');
const migrated=legacyStorage.read();
assert(migrated.personalSongs&&typeof migrated.personalSongs==='object','legacy v1 save receives personalSongs map');
assert.equal(migrated.records['legacy-A'].score.score,321,'migration does not clear existing records');
assert.equal(migrated.quota.owners['legacy-A'].used,2,'migration does not reset existing quota');

// Invalid/incomplete results cannot create a personal best.
const invalidPlayer={id:'invalid-A',nick:'Invalid',avatar:{c:{}}};
const started=rules.begin(invalidPlayer,DAY,'chill',false);
assert.equal(started.ok,true);
const invalid=rules.finish(invalidPlayer.id,started.round.token,DAY,{
  score:50000,hits:10,attempts:10,combo:10,totalNotes:10,completedAt:2
});
assert.equal(invalid.reason,'invalid','impossible score is rejected');
assert.equal(rules.personalSongs(DAY,invalidPlayer.id).chill,undefined,'rejected result creates no personal record');

assert(html.includes('function personalSongs(day,id)'), 'KaraokeShowRules exposes the personal per-song accessor');
assert(html.includes('personalSongs:function(){var c=context();return rules.personalSongs(c.day,c.id);}'),'ktMeta exposes only the current player personal records');
assert(html.includes('data-kt-song-best="normal"')&&html.includes('data-kt-song-best="duo"'),'music library includes personal best placeholders for all song keys');
console.log('✓ Karaoke personal music records: per-account isolation, per-song best, weekly persistence, legacy migration and invalid-result rejection');
