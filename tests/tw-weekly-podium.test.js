'use strict';
// This inspects the real INDEX2, not a mock page; never connects to Supabase.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sora=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
const style=fs.readFileSync(path.join(root,'tw-weekly-podium.css'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/tw_weekly_podium_proposal.sql'),'utf8');
const soraOnlineSql=fs.readFileSync(path.join(root,'supabase/sql/sora_jump_tv_profile_integration.sql'),'utf8');
const soraZeroSql=fs.readFileSync(path.join(root,'supabase/sql/sora_weekly_zero_default.sql'),'utf8');
const adminProfileSql=fs.readFileSync(path.join(root,'supabase/sql/admin_player_profile_proposal.sql'),'utf8');
const gameBadgesSql=fs.readFileSync(path.join(root,'supabase/sql/profile_game_badges_sunday_week.sql'),'utf8');
const privacy=fs.readFileSync(path.join(root,'privacidade.html'),'utf8');
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
const slotsCtx={Array};
vm.createContext(slotsCtx);
vm.runInContext(get('function twRankSlots(','function twRankDrawAvatars()'),slotsCtx);
const sample=[{nick:'Tsu',score:536}];
const fixedSlots=slotsCtx.twRankSlots(sample);
assert.equal(fixedSlots.length,3,'Top Idols always has three positions');
assert.equal(fixedSlots[0].nick,'Tsu');
assert.equal(fixedSlots[1],null);
assert.equal(fixedSlots[2],null);
assert.equal(slotsCtx.twRankSlots([]).length,3);
assert.ok(html.includes('twRankSlots(list).map(function(r,i){return r?twRankRow(r,i,k[3],k[0]):twRankEmptyRow(i,k[0]);})'));
assert.ok(html.includes("twRankWord(15)"),'vacant positions use a translated Em breve label');
assert.ok(style.includes('.tw-rank-empty-name'),'vacant positions keep the podium row layout');
assert.ok(sora.includes("client.rpc('sora_ranking',{p_period:soraRankPeriod})"),'Sora ranking calls use the selected period');
assert.ok(soraZeroSql.includes("'meu_sora', coalesce(("));
assert.ok(soraZeroSql.includes("s.period_type = 'week'") && soraZeroSql.includes("s.week_start = b.sunday"));
assert.ok(adminProfileSql.includes("s.period_type = 'all'") && adminProfileSql.includes("s.period_type = 'week'"));
assert.ok(adminProfileSql.includes("'geral', jsonb_build_object") && adminProfileSql.includes("'semana', jsonb_build_object"));
assert.ok(privacy.includes('Sora⭐Jump!') && privacy.includes('Karaoke⭐Time!'));
assert.ok(privacy.includes('31/10/2026') && privacy.includes('10/31/2026'));
assert.ok(!privacy.includes('Não há sala simultânea'));
assert.ok(!privacy.includes('There is no simultaneous room'));
assert.ok(!privacy.includes('No hay sala simultánea'));
assert.ok(!privacy.includes('ไม่มีห้องเล่นพร้อมกัน'));
assert.ok(!privacy.includes('同時参加のルーム'));

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
assert.ok(html.includes('href="./tw-weekly-podium.css?v=9"'));
assert.ok(Buffer.byteLength(style,'utf8')<11000,'Weekly CSS under 11KB including fixed empty podium slots');
assert.ok(style.includes('@media(min-width:900px)'),'Top Idols docks beside the hub cards on desktop');
assert.ok(style.includes('tw-rank-avatar-wrap'),'podium supports existing Idol avatars with a fallback');
assert.ok(html.includes('function twRankDrawAvatars()'),'weekly podium reuses only actual profile avatars');
assert.ok(html.includes('twRankRow(r,i,k[3],k[0])'),'rank rows keep the right game icon as fallback');
assert.ok(html.includes('TW_RANK_ONLINE_READY=true'),'weekly podium uses the verified online reader');
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
assert.ok(html.includes("contaRpc('tw_podio_semana')"));
assert.ok(html.includes("e.data.type==='TW_SORA_ONLINE_SCORE_SAVED'"));
assert.ok(html.includes('twRankLoad(true)'));
assert.ok(sora.includes("parent.postMessage({type:'TW_SORA_ONLINE_SCORE_SAVED'},location.origin)"));
assert.ok(soraOnlineSql.includes('create or replace function public.tw_podio_semana()'));
assert.ok(soraOnlineSql.includes('private.sora_scores'));
assert.ok(soraOnlineSql.includes('auth.uid()'));
assert.ok(/revoke all on function public\.tw_podio_semana\(\) from public,\s*anon,\s*authenticated/i.test(soraOnlineSql));

assert.ok(gameBadgesSql.includes("add column if not exists insignias_jogos"));
assert.ok(gameBadgesSql.includes("sincronizar_insignias_jogos(p_insignias text[])"));
assert.ok(gameBadgesSql.includes("from unnest(coalesce(p_insignias, '{}'::text[]))"));
assert.ok(gameBadgesSql.includes("coalesce(insignias_jogos, '{}'::text[]) || v_pedidas"),
  "Center Run badge import must append without replacing prior profile badges");
for(const key of ["s2_ensaio","s2_backstage","s2_estudio","s2_festival","s2_aeroporto","s2_geral","s2_dome"]){
  assert.ok(gameBadgesSql.includes("'"+key+"'"),"Missing allowlisted Center Run badge: "+key);
}
for(const [key,score] of [["sora_500",500],["sora_1500",1500],["sora_3000",3000]]){
  assert.ok(gameBadgesSql.includes("'"+key+"'")&&gameBadgesSql.includes(">= "+score),
    "Missing server-calculated Sora milestone: "+key);
}
assert.ok(gameBadgesSql.includes("extract(dow from (created_at at time zone 'America/Sao_Paulo'))"));
assert.ok(gameBadgesSql.includes("extract(dow from (now() at time zone 'America/Sao_Paulo')::date)"));
assert.ok(!/date_trunc\s*\(\s*'week'/i.test(gameBadgesSql),
  "Profile badge week must not retain PostgreSQL Monday-based date_trunc('week')");
assert.ok(/revoke all on function public\.sincronizar_insignias_jogos\(text\[\]\) from public/i.test(gameBadgesSql));
assert.ok(/grant execute on function public\.sincronizar_insignias_jogos\(text\[\]\) to authenticated/i.test(gameBadgesSql));

console.log('✓ INDEX2 original: TV, weekly profile, Sunday BR, top3 unique, safe score bridge');
console.log('✓ Top Idols fixed podium, Sora selected period/zero defaults and current privacy');
