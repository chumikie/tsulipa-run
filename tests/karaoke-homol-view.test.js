'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const view=require('../karaoke-homol-view.js');
const data=Array.from({length:9},(_,i)=>({slot:i+1,singing:i===0,self:i===2,label:'nome PRIVADO'}));
const all=view.stageLayout(data);
assert.equal(all.length,9);
assert.equal(all.filter(x=>x.singing).length,1);
assert.deepEqual(all.filter(x=>!x.singing).map(x=>x.seatIndex),[0,1,2,3,4,5,6,7]);
assert.equal(all[2].label,'Idol 03');
assert.equal(all[2].seatIndex,1);
assert.equal(view.stageLayout(data.map(x=>({...x,singing:false}))).length,9);
assert.equal(view.stageLayout(data.map(x=>({...x,singing:false})))[8].seatIndex,8);
assert.equal(view.stageLayout([{slot:1,label:'<script>',self:1},{slot:1},{slot:-2}]).length,1);
assert.equal(view.stageLayout([{slot:1,label:'<script>'}])[0].label,'Idol 01');
assert.deepEqual(view.queueSlots([{slot:3,label:'<img>'},{slot:5}]).map(x=>x&&x.label),['Idol 03','Idol 05',null]);
assert.deepEqual(view.queueSlots([]),[null,null,null]);
assert.equal(view.turnPhase(100000,160000,100000).phase,'intro');
assert.equal(view.turnPhase(100000,160000,105000).phase,'rhythm');
assert.equal(view.turnPhase(100000,160000,150000).phase,'outro');
assert.equal(view.turnPhase(100000,160000,160000).phase,'finished');
const game=fs.readFileSync(path.join(__dirname,'../karaoke-day.html'),'utf8');
const client=fs.readFileSync(path.join(__dirname,'../karaoke-homol-client.js'),'utf8');
assert(game.includes("window.TsuKaraokeHomolView.stageLayout(brutos)"));
// A sala online mostra o nick e o visual reais de quem esta dentro (nada de "Idol 01" nem boneco sorteado).
assert(game.includes('var nome=s.label||s.nick;if(nome)m.label=nome;'),'nick real na sala');
assert(game.includes("var visual=s.c||(s.avatar&&s.avatar.c);if(visual)m.c=visual;"),'visual real na sala');
assert(game.includes("char:Object.assign({},p.c||template.char,{n:p.label})"),'sem restos do boneco de demonstracao');
assert(game.includes("if(krSoHomol)return; // no production player data in staging"));
assert(game.includes('krHomolMeuChar')&&game.includes('krHomolMeuNick'));
assert(/var TURNSTILE_SITE_KEY='0x[A-Za-z0-9_-]+';/.test(client));
assert(client.includes("signInAnonymously({options:{captchaToken:captchaToken}})"));
assert(!client.includes('https://fsggtvgbyhchblyazgmt.supabase.co'));
// Protege contra a regressão que esvaziava a sala de demonstração.
assert(game.includes('var krHomolConectado=false;'));
assert(game.includes('if(!me){'));
assert(!game.includes('krBots=[];krSt.ocupadas=0;krEu.plateia=true;'));
assert(game.includes("if(krHomolConectado){e.preventDefault();return;}"));
assert(client.includes('a sala cheia é uma demonstração local'));
assert(!client.includes("localQueue.hidden=true;localQueue.style.display='none';"));

const vm=require('node:vm');
const anchorA=game.indexOf('function krPontoMaoSala('),anchorB=game.indexOf('function krDesenharAcessorioSala(',anchorA);
assert(anchorA>=0&&anchorB>anchorA,'hand anchor function must exist');
const context={krHandBusy:j=>!!(j.drink||j.snackSala||j.itemSala),krEstaNoSofa:j=>j.seated===true,Math:Math};
vm.runInNewContext(game.slice(anchorA,anchorB),context,{timeout:1000});
const hand=context.krPontoMaoSala;
const left=hand({x:200,pose:'v'},400,0,1);
const right=hand({x:760,pose:'v'},400,0,-1);
assert(Math.abs(left.x-241.4)<.001&&Math.abs(left.y-335.6)<.001,'standing hand at scaled actual arm tip');
assert(Math.abs(right.x-718.6)<.001&&Math.abs(right.y-335.6)<.001,'mirrored hand at actual arm tip');
const seated=hand({x:165,pose:'v',seated:true},365,0,1);
assert(Math.abs(seated.x-202.08)<.001&&Math.abs(seated.y-307.32)<.001,'seated scale hand endpoint');
assert(left.x>226&&left.y<359,'regression: old item hovered by underarm');
assert(game.includes('drinkHand.x+drinkSide*5,drinkHand.y+7'),'drink grip must align with hand');
assert(game.includes('var hand=krPontoMaoSala(j,y,t,side),hx=hand.x+side*.5,hy=hand.y-2;'));
assert(game.includes("if(c.gl){"),'preserve profile glasses');
assert(game.includes("if(c.hat==='coala')"),'preserve Lirika headband');
assert(game.includes("if(c.streak&&"),'preserve avatar hair streak');
assert(game.includes("else if(rp==='citypop')"),'preserve Pati citypop outfit');
assert(game.includes('function krDesenharWhimsical('),'whimsical layer');
assert(game.includes("prefers-reduced-motion: reduce"),'whimsical motion reduction');
assert(game.indexOf('krDesenharWhimsical(x,t)')<game.indexOf('desenharIdol(x,j.char,j.x,baseY,'),'whimsical behind characters');
assert(game.includes("get('homol')==='1'?null:JSON.parse(localStorage.getItem('brs48cr_cu2')"),'lab must not reuse saved real avatar');

// 3A.6: só Idols anônimos podem receber um assento; portão do banco manda na interface.
const gateSql=fs.readFileSync(path.join(__dirname,'../supabase/sql/karaoke_lab_3a6_entry_gate.sql'),'utf8');
const gateTest=fs.readFileSync(path.join(__dirname,'../supabase/tests/karaoke_lab_3a6_entry_gate_rollback.sql'),'utf8');
assert(gateSql.includes('joins_enabled boolean not null default false'));
assert(gateSql.includes("coalesce(auth.jwt()->>'is_anonymous','false') <> 'true'"));
assert(gateSql.includes("and p_action in ('enter','queue','heartbeat')"));
assert(gateSql.includes("'labOpen'"));
assert(gateSql.includes('revoke all on function public.karaoke_ensaio(text,uuid) from public, anon, authenticated;'));
assert(gateSql.includes('revoke all on function public.karaoke_ensaio_elenco() from public, anon, authenticated;'));
assert(gateTest.trimEnd().endsWith('rollback;'));
assert(/var TURNSTILE_SITE_KEY='0x[A-Za-z0-9_-]+';/.test(client));
assert(client.includes('labOpen=data.labOpen===true&&data.scheduleOpen===true;'));
assert(client.includes('buttons.Enter.disabled=!auth||seat||!labOpen||moderationLocked;'));
assert(client.includes('buttons.Queue.disabled=!auth||!seat||queued||isSinging||!labOpen||moderationLocked;'));
assert(client.includes('r.data.session.user.is_anonymous!==true'));
// Temporary supervised test: default remains OFF; auth_test mode is Auth-only.
assert(client.includes("var REUSE_SESSION_ONLY=new URLSearchParams(location.search).get('reuse_session')==='1';"));
assert(client.includes("var AUTH_TEST_ONLY=!REUSE_SESSION_ONLY&&new URLSearchParams(location.search).get('auth_test')==='1';"));
assert(client.includes('var SIGNUP_ENABLED=false;'));
assert(client.includes('if(AUTH_TEST_ONLY)SIGNUP_ENABLED=true;'));
assert(client.includes('if(AUTH_TEST_ONLY){buttons.Enter.disabled=true;buttons.Queue.disabled=true;buttons.Unqueue.disabled=true;buttons.Leave.disabled=true;buttons.Refresh.disabled=true;return;}'));
const authOnlyStart=client.indexOf("if(AUTH_TEST_ONLY){\n     // Reuse prevention");
const authOnlyEnd=client.indexOf("\n   if(r.data.session&&r.data.session.user&&r.data.session.user.is_anonymous!==true)",authOnlyStart);
assert(authOnlyStart>=0&&authOnlyEnd>authOnlyStart,'temporary auth-only branch must be isolated');
const authOnlyBranch=client.slice(authOnlyStart,authOnlyEnd);
assert(authOnlyBranch.includes('client.auth.signInAnonymously')&&authOnlyBranch.includes('client.auth.getUser()'));
assert(!authOnlyBranch.includes('client.rpc(')&&!authOnlyBranch.includes('refresh('),'auth-only test must not call room RPCs or refresh room state');
 
// Reuse-session mode reconnects only an existing anonymous identity; it cannot create one.
const reuseStart=client.lastIndexOf('if(REUSE_SESSION_ONLY){');
const reuseEnd=client.indexOf('\n})();',reuseStart);
assert(reuseStart>=0&&reuseEnd>reuseStart,'reuse-session boot exists');
const reuseBoot=client.slice(reuseStart,reuseEnd);
assert(reuseBoot.includes('client.auth.getSession()'));
assert(reuseBoot.includes('client.auth.getUser()'));
assert(reuseBoot.includes('session.user.is_anonymous!==true'));
assert(reuseBoot.includes('await refresh(false)'));
assert(!reuseBoot.includes('signInAnonymously'),'reuse mode never creates an identity');
assert(reuseBoot.includes('Nenhuma conta nova foi criada'));
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-day.html'),'utf8');
assert(html.includes('karaoke-homol-client.js?v=7'),'homologation client cache version bumped');


// 3A.6b — abrir o desafio antirobô NÃO deve criar conta nem usar RPC.
assert(client.includes('var SIGNUP_ENABLED=false;'),'cadastro permanece fechado');
assert(client.includes("buttons.Auth.disabled=auth||!TURNSTILE_SITE_KEY||!SIGNUP_ENABLED;"));
assert(client.includes('buttons.Check.addEventListener('));
const checkStart=client.indexOf('buttons.Check.addEventListener(');
const authStart=client.indexOf('buttons.Auth.addEventListener(');
assert(checkStart>=0&&authStart>checkStart,'botão de teste isolado do cadastro');
const checkHandler=client.slice(checkStart,authStart);
assert(!checkHandler.includes('signInAnonymously'),'teste não cadastra ninguém');
assert(!checkHandler.includes("client.rpc("),'teste não ocupa vagas');
assert(client.includes("if(!SIGNUP_ENABLED)return;"),'bloqueio explícito de cadastro');
assert(client.includes("Tempo de verificação esgotado"),'widget não pode travar botões indefinidamente');
console.log('✓ Karaoke homol: portão, Turnstile isolado e visual preservado');

// Etapa 3A.7: portão fechado precisa apagar assentos, cantor e fila sem dados reais.
const closeSql=fs.readFileSync(path.join(__dirname,'../supabase/sql/karaoke_lab_3a7_closed_room_reset.sql'),'utf8');
const closeTest=fs.readFileSync(path.join(__dirname,'../supabase/tests/karaoke_lab_3a7_close_reset_rollback.sql'),'utf8');
assert(closeSql.includes('old.joins_enabled and not new.joins_enabled'));
assert(closeSql.includes('delete from karaoke_lab.queue;'));
assert(closeSql.includes('delete from karaoke_lab.seats;'));
assert(closeSql.includes('new.singer_id:=null;'));
assert(closeSql.includes('new.ends_at:=null;'));
assert(closeSql.includes("return jsonb_build_object('status','lab_closed'"));
assert(closeSql.includes('if (select joins_enabled from karaoke_lab.room where id=1) then'));
assert(closeTest.trim().endsWith('rollback;'));
assert(client.includes("(token&&data.mySeat!==true)"),'remove stale lease token after close');
assert(client.includes("badge.textContent='🎤 Homologação · sem pontos';return;"));
assert(game.includes("karaoke-homol-client.js?v=7"),'updated script should bypass stale CDN');
console.log('✓ Karaoke 3A.7: fechamento atomico, reconexao limpa e legado visual intacto');

// 3A.8: Realtime only sends revision. Validate the client signal controller with mocks.
const signalSql=fs.readFileSync(path.join(__dirname,'../supabase/sql/karaoke_lab_3a8_revision_signal.sql'),'utf8');
const signalSQLTest=fs.readFileSync(path.join(__dirname,'../supabase/tests/karaoke_lab_3a8_signal_rollback.sql'),'utf8');
assert(signalSql.includes('public.tsulipa_karaoke_lab_signal'));
assert(signalSql.includes('revoke all on all functions in schema karaoke_lab'));
assert(!signalSql.includes('seat_token'));
assert(signalSQLTest.trimEnd().endsWith('rollback;'));
assert(game.includes('karaoke-homol-sync.js?v=1'));
assert(game.includes('karaoke-homol-client.js?v=7'));
assert(client.includes('if(currentRefresh)return currentRefresh;'));
assert(client.includes('var SIGNUP_ENABLED=false;'));
const syncAPI=require('../karaoke-homol-sync.js');
let pending=[],seenMessage=null,removed=0,reads=0,connected=false,inside=true,clock=10000;
const fakeClock={now:()=>clock,setTimeout:(fn)=>{pending.push(fn);return pending.length;},clearTimeout:()=>{pending=[];}};
const fakeClient={
 auth:{getSession:async()=>({data:{session:{access_token:'FAKE'}}})},
 realtime:{setAuth:async()=>{}},
 channel:()=>({on:function(type,filter,fn){
   assert.equal(type,'postgres_changes');assert.equal(filter.table,'tsulipa_karaoke_lab_signal');
   seenMessage=fn;return this;},
   subscribe:function(fn){connected=true;fn('SUBSCRIBED');return this;}}),
 removeChannel:async()=>{removed++;}
};
const watcher=syncAPI.create(Object.assign({},fakeClock,{
 client:fakeClient,canListen:()=>inside,hidden:()=>false,busy:()=>false,
 refresh:async()=>{reads++;watcher.mark(6);},
 onStatus:()=>{}
}));
(async()=>{
 await watcher.start();assert(connected&&typeof seenMessage==='function');
 watcher.mark(5);
 seenMessage({new:{revision:6,seat_token:'IGNORED'}});
 seenMessage({new:{revision:6}});
 assert.equal(pending.length,1,'notification burst must be debounced');
 await pending.shift()();
 assert.equal(reads,1,'one authenticated read only');
 seenMessage({new:{revision:6}});
 assert.equal(pending.length,0,'old revision ignored');
 inside=false;watcher.stop();assert.equal(removed,1);
 await watcher.start();assert.equal(removed,1,'nonmember cannot resubscribe');
})().catch(err=>process.nextTick(()=>{throw err;}));
console.log('✓ Karaoke 3A.8: sinal de revisão privado e atualização agrupada');

// 3A.9: online rehearsal calls only the protected scoring RPC; rewards stay absent.
const practiceSql=fs.readFileSync(path.join(__dirname,'../supabase/sql/karaoke_lab_3a9_practice_score.sql'),'utf8');
const practiceTest=fs.readFileSync(path.join(__dirname,'../supabase/tests/karaoke_lab_3a9_practice_rollback.sql'),'utf8');
assert(practiceSql.includes('create or replace function public.karaoke_ensaio_toque(p_token uuid)'));
assert(practiceSql.includes("'is_anonymous'"));
assert(practiceSql.includes("not_singer"));
assert(practiceSql.includes("already_judged"));
assert(practiceSql.includes("interval '250 milliseconds'"));
assert(practiceSql.includes("hit_mask & (1::bigint << (idx-1))"));
assert(practiceSql.includes("r.started_at+interval '50 seconds'"));
assert(practiceSql.includes("delete from karaoke_lab.practice;"));
assert(practiceSql.includes("'verified',false,'persisted',false"));
assert(!practiceSql.includes('brs48cr_st'));
assert(!practiceSql.includes('stars_balance'));
assert(practiceTest.trimEnd().endsWith('rollback;'));
assert(client.includes("client.rpc('karaoke_ensaio_toque',{p_token:token})"));
assert(client.includes("function drawSharedRhythm(){"));
assert(client.includes("var SIGNUP_ENABLED=false;"));
assert(client.includes("setInterval(showTurnClock,125)"));
assert(game.includes("karaoke-homol-client.js?v=7"));
console.log('✓ Karaoke 3A.9: compartilhamento do placar de ensaio sem economia');

// Visual-only mode: neither an anonymous identity nor a score is created.
assert(client.includes("get('practice_preview')==='1'"));
assert(client.includes('panel.hidden=!PRACTICE_PREVIEW;'));
assert(client.includes('tap.disabled=true;note.hidden=true;'));
assert(client.includes('drawSharedRhythm();'));
assert(client.includes('var SIGNUP_ENABLED=false;'));
console.log('✓ Karaoke 3A.9: prévia visual isolada e toque online protegido');

// 3A.10: Sunday schedule, anti-spam limits and private moderation.
const rulesSQL=fs.readFileSync(path.join(__dirname,'../supabase/sql/karaoke_lab_3a10_sunday_rules.sql'),'utf8');
const rulesTest=fs.readFileSync(path.join(__dirname,'../supabase/tests/karaoke_lab_3a10_rules_rollback.sql'),'utf8');
assert(rulesSQL.includes("America/Sao_Paulo"));
assert(rulesSQL.includes("time '12:00'"));
assert(rulesSQL.includes("time '13:10'"));
assert(rulesSQL.includes("create table if not exists karaoke_lab.moderation_blocks"));
assert(rulesSQL.includes("create table if not exists karaoke_lab.action_limits"));
assert(rulesSQL.includes("karaoke_lab.enforce_schedule(v_now)"));
assert(rulesSQL.includes("karaoke_lab.enforce_schedule(now_at)"));
assert(rulesSQL.includes("delete from karaoke_lab.action_limits;"));
assert(rulesTest.trimEnd().endsWith('rollback;'));
assert(client.includes("data.scheduleOpen===true"));
assert(client.includes("var SIGNUP_ENABLED=false;"));
assert(client.includes("moderationLocked"));
assert(client.includes("Domingo, 12h–13h10 (Brasília)"));
console.log('✓ Karaoke 3A.10: Sunday schedule and private moderation');
