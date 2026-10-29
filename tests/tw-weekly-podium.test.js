'use strict';
// This inspects the real INDEX2, not a mock page; never connects to Supabase.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index2.html'),'utf8');
const sora=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
const official=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/tw_weekly_podium_proposal.sql'),'utf8');
function get(a,b){
 const start=html.indexOf(a),end=html.indexOf(b,start+a.length);
 assert.ok(start>=0&&end>start,'Missing function: '+a);return html.slice(start,end);
}
const ctx={Intl,Date,Number,Object,String,Array,Math};
vm.createContext(ctx);
vm.runInContext(get('function twRankSundayKey(','function twRankStatus('),ctx);
const week=ctx.twRankSundayKey;
assert.equal(week(Date.parse('2026-10-29T16:00:00Z')),'2026-10-25');
assert.equal(week(Date.parse('2026-11-01T02:59:59Z')),'2026-10-25');
assert.equal(week(Date.parse('2026-11-01T03:00:01Z')),'2026-11-01');
assert.equal(week(Date.parse('2026-11-08T03:01:00Z')),'2026-11-08');
const podium=ctx.twRankClean([
 {name:'Tsu',score:200},{name:'Tsu',score:190},{name:'Lirika',score:160},
 {name:'Pati',score:180},{name:'Mimi',score:90},{name:'Tsu',score:201},
 {name:'Hack',score:-25},{name:'NaN',score:'broken'}
]);
assert.equal(podium.length,3);
assert.equal(JSON.stringify(podium.map(x=>x.nick)),JSON.stringify(['Tsu','Pati','Lirika']));
assert.equal(podium[0].score,201);
assert.equal(ctx.twRankClean([]).length,0);
assert.equal(ctx.twRankClean(null).length,0);
assert.ok(html.includes('id="twRankTv"'));
assert.ok(html.includes('id="twRankHall"'));
assert.ok(html.includes('id="twSoraWeekScore"'));
assert.ok(html.includes('hubCv')&&html.includes('HUB_TRIO')&&html.includes('hubCardsUI'));
assert.ok(!official.includes('twRankSundayKey'));
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
