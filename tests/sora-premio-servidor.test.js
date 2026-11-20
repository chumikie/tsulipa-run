// Sora⭐Jump!: o prêmio dos 500 m (★25 por dia) é do servidor quando a pessoa está logada (17/11/2026).
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8'),index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/migrations/20261117200000_sora_premio_500_registro.sql'),'utf8');
assert.match(html,/var misServidor = !isTestScene && h >= 500 && soraOnlinePremioPendente\(\)/);
assert.match(html,/if\(!isTestScene && h >= 500 && !misServidor && !soraDonoDaSubida\)\{/);
assert.match(html,/d\.ok === true && d\.stars_credited > 0/);
assert.match(html,/reward_claimed_today/);
for(const k of ['Conferindo o prêmio dos 500 m…','Prêmio dos 500 m de hoje já recebido. Volte amanhã!','Essa subida foi rápida demais para o prêmio. Tente de novo com calma!','Não deu para conferir o prêmio agora.'])
  assert.equal((html.match(new RegExp('"'+k.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'":','g'))||[]).length,4,'traduções (en, es, th, ja): '+k);
assert.match(index,/e\.data\.type==='TW_SORA_STARS'/,'o site atualiza o saldo do topo');
assert.match(index,/dd>0&&dd<=100/,'o site só aceita um delta pequeno e positivo');
assert.match(sql,/v_elapsed >= 20 and p_score <= floor\(v_elapsed \* 25\)/,'anti-trapaça do prêmio: 20 s e até 25 m/s');
assert.match(sql,/primary key \(player_id, reward_day\)/,'uma vez por dia por conta');
console.log('✓ Sora⭐Jump!: prêmio dos 500 m confirmado pelo servidor');


// Keep the actual finish RPC pending while a newer result is on screen.
const vm=require('node:vm');
(async function(){
  const dados=new Map(), elementos={soraMisBonus:{textContent:''},soraMenuPremio:{}}, calls=[];
  let responder;
  const ctx=vm.createContext({
    soraOnlineUserId:'A',soraOnlineSessionGeneration:0,soraDonoDaSubida:'A',soraOnlineRunGeneration:1,
    SORA_ONLINE_RANKING_ENABLED:true,soraTestSceneId:null,soraOnlineRunFinishSent:false,soraOnlineRunStartPromise:Promise.resolve('run-A'),
    _supabase:{rpc(name,args){calls.push([name,args.p_run_id,args.p_score]);return new Promise(resolve=>{responder=resolve;});}},
    $:id=>elementos[id],dk:()=> '2026-11-20',tr:t=>t,LANG:'pt',starT:100,
    window:{__TW_TEST_STORAGE:{getItem:k=>dados.get(k)??null,setItem:(k,v)=>dados.set(k,v)}},
    parent:null,location:{origin:'https://example.test'},soraRankRowsCache:{},soraRankCacheAt:{},soraState:'menu',console
  });
  ctx.parent=ctx.window;
  vm.runInContext(html.slice(html.indexOf('var soraPremioAtual='),html.indexOf('function soraOnlineAbortRun')),ctx);
  const recibo={id:'A:1',owner:'A',dia:'2026-11-20',status:'aguardando'};
  ctx.soraPremioAtual=recibo;
  ctx.soraPremioSalvar(recibo,true);
  ctx.soraOnlineFinishRun(501,recibo);
  await new Promise(setImmediate);
  ctx.soraPremioMostrar(recibo,'pendente');
  assert.match(elementos.soraMisBonus.textContent,/pendente/);
  const proximo={id:'A:2',owner:'A',dia:recibo.dia,status:'aguardando'};
  ctx.soraPremioSalvar(proximo,true);
  ctx.soraPremioAtual=proximo;ctx.soraOnlineRunGeneration++;
  elementos.soraMisBonus.textContent='Nova subida';
  responder({data:{ok:true,stars_credited:25,ranked:true}});
  await new Promise(setImmediate);
  assert.equal(recibo.status,'creditado');
  assert.equal(ctx.starT,125);
  assert.equal(elementos.soraMisBonus.textContent,'Nova subida');
  assert.equal(ctx.soraRecibo('A').id,proximo.id);
  assert.deepEqual(calls,[['sora_run_finish','run-A',501]]);
  // A new request can confirm after its timeout and restore the status after reloading.
  ctx.soraOnlineRunFinishSent=false;
  ctx.soraOnlineRunStartPromise=Promise.resolve('run-B');
  ctx.soraOnlineFinishRun(503,proximo);
  await new Promise(setImmediate);
  ctx.soraPremioMostrar(proximo,'pendente');
  responder({data:{ok:true,reward_claimed_today:true}});
  await new Promise(setImmediate);
  assert.match(elementos.soraMisBonus.textContent,/já recebido/);
  ctx.soraPremioAtual=null;ctx.soraPremioMenu();
  assert.match(elementos.soraMenuPremio.textContent,/já recebido/);
  ctx.soraOnlineUserId='B';ctx.soraPremioMenu();
  assert.equal(elementos.soraMenuPremio.hidden,true);
})().catch(error=>{ console.error(error);process.exitCode=1; });
