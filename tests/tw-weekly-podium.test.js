'use strict';
// This inspects the real INDEX2, not a mock page; never connects to Supabase.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sora=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
const style=fs.readFileSync(path.join(root,'tw-weekly-podium.css'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/tw_weekly_podium_proposal.sql'),'utf8');
const podiumModel=require('../tw-weekly-podium-model.js');
const week=podiumModel.sundayKey;
assert.equal(week(Date.parse('2026-10-29T16:00:00Z')),'2026-10-25');
assert.equal(week(Date.parse('2026-11-01T02:59:59Z')),'2026-10-25');
assert.equal(week(Date.parse('2026-11-01T03:00:01Z')),'2026-11-01');
assert.equal(week(Date.parse('2026-11-08T03:01:00Z')),'2026-11-08');
const podium=podiumModel.clean([
 {name:'Tsu',score:200},{name:'Tsu',score:190},{name:'Lirika',score:160},
 {name:'Pati',score:180},{name:'Mimi',score:90},{name:'Tsu',score:201},
 {name:'Hack',score:-25},{name:'NaN',score:'broken'}
]);
assert.equal(podium.length,3);
assert.equal(JSON.stringify(podium.map(x=>x.nick)),JSON.stringify(['Tsu','Pati','Lirika']));
assert.equal(podium[0].score,201);
assert.equal(podiumModel.clean([]).length,0);
assert.equal(podiumModel.clean(null).length,0);
assert.deepEqual(podiumModel.clean([
 {nick:'  TSU  ',score:100},{nick:'tsu',score:120},
 {nick:'',score:500},{nick:'Low',score:0},{nick:'A'.repeat(30),pts:15}
]),[
 {nick:'tsu',score:120},{nick:'AAAAAAAAAAAAAAAAAAAAAAAA',score:15}
]);
assert.deepEqual(podiumModel.clean([
 {nick:'Beta',score:4},{nick:'Alpha',score:4},{nick:'beta',score:3}
]),[{nick:'Alpha',score:4},{nick:'Beta',score:4}]);
const capped=Array.from({length:31},(_,index)=>({
 nick:'Idol '+index,score:100-index
}));
capped[30].score=10000;
const original=JSON.stringify(capped);
assert.deepEqual(podiumModel.clean(capped).map(row=>row.nick),
 ['Idol 0','Idol 1','Idol 2']);
assert.equal(JSON.stringify(capped),original,'cleaning does not modify input data');
assert.equal(Object.isFrozen(podiumModel),true,'pure model API stays immutable');
const normalizedHtml=html.replace(/\r\n/g,'\n');
assert.ok(normalizedHtml.indexOf('tw-weekly-podium-model.js?v=1')<normalizedHtml.indexOf('<script>\n'),
  'weekly podium model loads before inline site code');
assert.ok(!html.includes('function twRankSundayKey(')&&!html.includes('function twRankClean('),
  'pure weekly helpers stay extracted from the page');
assert.ok(html.includes('TsuWeeklyPodiumModel.sundayKey()')&&
  html.includes('TsuWeeklyPodiumModel.clean(data.center)'),
  'weekly podium UI delegates pure ranking work to the extracted module');
assert.ok(html.includes('id="twRankTv"'));
const hubMenuAt=html.indexOf('<div id="hubMenu" hidden>');
const tvIconAt=html.indexOf('id="twRankTvAbrir"');
assert.ok(hubMenuAt>=0&&tvIconAt>hubMenuAt,'TV icon stays inside the hidden game hub until "Start" is tapped');
assert.ok(html.includes('role="dialog" aria-modal="true" aria-labelledby="twRankTvModalTitle"'));
assert.ok(!html.includes('class="tw-rank-tv-dialog"'),'TV illustration is the popup; no extra modal window around it');
assert.ok(html.includes('class="tw-rank-tv-launch-row"'),'TV launch icon is separated from the clean welcome screen');
assert.ok(html.includes('id="hubToque"')&&html.includes('id="hubCards"'));
assert.ok(html.includes('function hubMostrar()')&&html.includes("$('hubMenu').hidden = !hubComecou"));
assert.ok(html.includes('id="twRankHall"'));
assert.ok(html.includes('href="./tw-weekly-podium.css?v=3"'));
assert.ok(Buffer.byteLength(style,'utf8')<10000,'Weekly CSS under 10KB budget');
assert.ok(style.includes('@media(min-width:900px)'),'Top Idols docks beside the hub cards on desktop');
assert.ok(style.includes('tw-rank-avatar-wrap'),'podium supports existing Idol avatars with a fallback');
assert.ok(html.includes('function twRankDrawAvatars()'),'weekly podium reuses only actual profile avatars');
assert.ok(html.includes('twRankRow(r,i,k[3],k[0])'),'rank rows keep the right game icon as fallback');
assert.ok(html.includes('TW_RANK_ONLINE_READY=false'),'unreviewed weekly online podium remains disabled');
assert.ok(html.includes('id="twSoraWeekScore"'));
assert.ok(html.includes('hubCv')&&html.includes('HUB_TRIO')&&html.includes('hubCardsUI'));
assert.ok(html.includes("if(twPreviewJogoAnterior==='sora')twRankRecordLocal(e.data.score)"));
assert.ok(html.includes('e.source!==frame.contentWindow'));
assert.ok(html.includes('e.origin!==location.origin'));
assert.ok(sora.includes('if(!isTestScene){'));
assert.ok(sora.includes("parent.postMessage({type:'TW_SORA_WEEKLY_SCORE',score:h},location.origin)"));
assert.ok(sql.includes('row_number() over')&&sql.includes('where pos>3'));
assert.ok(sql.includes('primary key (game,week_start,player_id)'));
assert.ok(sql.includes('week_start < v_week'));
assert.ok(sql.includes('security definer set search_path to'));
assert.ok(!html.includes('TW_RANK_ONLINE_READY=true'));
console.log('✓ INDEX2 original: TV, weekly profile, Sunday BR, top3 unique, safe score bridge');
