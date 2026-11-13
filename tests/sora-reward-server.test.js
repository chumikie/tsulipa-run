'use strict';
// Testes curtos e offline do prêmio Sora: nenhum SQL ou chamada de produção.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/proposta/sora_500_daily_reward_REVIEW_ONLY.sql'),'utf8');
function between(a,b){
  const start=html.indexOf(a),end=html.indexOf(b,start+a.length);
  assert.ok(start>=0&&end>start,'Trecho Sora não encontrado: '+a);
  return html.slice(start,end);
}
async function flush(){await new Promise(resolve=>setImmediate(resolve));}
function environment(response,owner){
  const events=[],statuses=[],rpcCalls=[];
  const ctx={
    SORA_ONLINE_RANKING_ENABLED:true,soraTestSceneId:'',
    soraOnlineRunFinishSent:false,soraOnlineRunOwnerId:owner===false?null:'user-1',
    soraOnlineUserId:owner===false?null:'user-1',soraOnlineRunGeneration:1,
    soraOnlineRunStartPromise:owner===false?null:Promise.resolve('run-1'),
    soraOnlineRunId:'run-1',soraState:'over',soraRankRowsCache:{week:null,all:null},
    soraRankCacheAt:{week:0,all:0},soraDailyRewardShow:x=>statuses.push(x),
    soraRenderLb(){},URLSearchParams,location:{search:'?embed=index2',origin:'https://example.test'},
    parent:{postMessage:x=>events.push(x.type)},window:{},
    console:{warn(){},info(){}},
    _supabase:{rpc:(name,args)=>{rpcCalls.push({name,args});return Promise.resolve({data:response});}}
  };
  vm.runInNewContext(between('function soraOnlineFinishRun(score){','function soraOnlineAbortRun(){'),ctx);
  return {ctx,events,statuses,rpcCalls};
}
(async function(){
  // O navegador não atribui as ★25 localmente; só anuncia após RPC confirmada.
  assert.doesNotMatch(between('function soraEndGame(){','function soraRenderLbRows('),/starT\s*\+=\s*25/);
  assert.doesNotMatch(html,/brs48cr_mis_sora|MIS_DIA_KEY/);
  assert.match(html,/id="soraDailyRewardStatus"/);
  assert.match(html,/aria-live="polite"/);

  // Independência dos tetos de outros jogos; trava por conta/dia e origem de saldo.
  assert.match(sql,/primary key \(player_id, reward_day\)/i);
  assert.match(sql,/run_id uuid not null unique/i);
  assert.match(sql,/on conflict do nothing/i);
  assert.match(sql,/reason\)\s*values \(v_uid, 25, 'sora_500'\)/i);
  assert.match(sql,/stars = stars \+ 25/);
  assert.match(sql,/p_score >= 500 and v_elapsed >= 10/);
  assert.match(sql,/revoke all on function public\.sora_run_finish\(uuid, integer\) from public, anon/i);
  assert.match(sql,/grant execute on function public\.sora_run_finish\(uuid, integer\) to authenticated/i);
  assert.doesNotMatch(sql,/'minijogo'|'corrida'|miss[oõ]es_feitas\s*\(/i);
  assert.match(index,/TW_SORA_STARS_CREDITED/);
  assert.match(index,/contaRpc\('jogador'\)/);

  let r=environment({ok:true,ranked:true,stars_credited:25,reward_claimed_today:false});
  r.ctx.soraOnlineFinishRun(550);
  await flush();
  assert.deepEqual(r.statuses,['credited']);
  assert.equal(r.rpcCalls.length,1);
  assert.equal(r.rpcCalls[0].name,'sora_run_finish');
  assert.equal(r.rpcCalls[0].args.p_run_id,'run-1');
  assert.equal(r.rpcCalls[0].args.p_score,550);
  assert.ok(r.events.includes('TW_SORA_STARS_CREDITED'));
  r.ctx.soraOnlineFinishRun(550);await flush();
  assert.equal(r.rpcCalls.length,1,'mesma finalização não repete a chamada');

  r=environment({ok:true,ranked:true,stars_credited:0,reward_claimed_today:true});
  r.ctx.soraOnlineFinishRun(550);await flush();
  assert.deepEqual(r.statuses,['already']);
  assert.ok(!r.events.includes('TW_SORA_STARS_CREDITED'));

  r=environment({ok:true,ranked:true}); // RPC antiga, SQL ainda não aplicado
  r.ctx.soraOnlineFinishRun(550);await flush();
  assert.deepEqual(r.statuses,['unverified']);
  assert.ok(!r.events.includes('TW_SORA_STARS_CREDITED'));

  r=environment({ok:false,reason:'run_or_score_invalid'});
  r.ctx.soraOnlineFinishRun(550);await flush();
  assert.deepEqual(r.statuses,['rejected']);

  r=environment(null,false);
  r.ctx.soraOnlineFinishRun(550);await flush();
  assert.deepEqual(r.statuses,['login']);
  assert.equal(r.rpcCalls.length,0);

  console.log('✓ Sora ★25: confirmação online, 1/dia, offline, rejeição e sem duplicação local');
})().catch(error=>{console.error(error);process.exitCode=1;});
