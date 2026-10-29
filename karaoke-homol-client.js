/* TsuLiPa⭐World — 3A.8, optional rehearsal client.
 * Only loads with karaoke-day.html?homol=1. Never references production Supabase,
 * original accounts, scores or rewards. Anonymous sign-in is by explicit click.
 * Realtime only signals new revision; authoritative state comes from RPC. 30s lease fallback.
 */
(function(){
'use strict';
if(new URLSearchParams(location.search).get('homol')!=='1')return;
var URL='https://hfzjoefnousiouiuchys.supabase.co';
var KEY='sb_publishable_eWhnlZJSyDsJ3N8poUStGw_3XsEFO_T';
var TOKEN_KEY='tsulipa_homol_seat_token_v1';
// PUBLIC site key only; the Turnstile SECRET must remain in Supabase Auth settings.
// Leave empty until the homologation widget and server-side CAPTCHA are configured.
// Site Key é pública; segredo fica somente no Supabase Auth.
// A integração abaixo ainda NÃO autoriza a criação de contas de ensaio.
var TURNSTILE_SITE_KEY='0x4AAAAAAFrWDInD-RA_Mm02';
var SIGNUP_ENABLED=false;
var client=null,token=null,busy=false,timer=null,ready=false,lastSeat=false,lastQueued=false,isSinging=false,labOpen=false;
var turnClock=null,turnClockTimer=null,sync=null;
var practice=null,tapPending=false;
var currentRefresh=null;
try{token=sessionStorage.getItem(TOKEN_KEY)||null;}catch(e){}
var host=document.querySelector('.krwrap')||document.body;
var panel=document.createElement('section');
panel.className='kr-mic-queue';
panel.id='krHomolPanel';
panel.setAttribute('aria-label','Homologação do Karaoke');
panel.innerHTML='<h3>🎤 Ensaio online · 9 Idols</h3>'
  +'<p id="krHomolMsg" role="status" aria-live="polite">Conecte um Idol fictício para testar a sala. Nenhuma conta ou estrela do jogo oficial será usada.</p>'
  +'<p id="krHomolGate" role="status" aria-live="polite">🔒 Entrada online em preparação. A sala cheia acima é uma demonstração.</p>'
  +'<div id="krHomolCaptcha" aria-label="Verificação antirobô do ensaio" style="margin:8px 0"></div>'
  +'<div class="btns" style="display:flex;gap:8px;flex-wrap:wrap;margin:9px 0">'
  +'<button type="button" class="krb" id="krHomolCheck">🛡️ Testar Turnstile (sem cadastro)</button>'
  +'<button type="button" class="krb" id="krHomolAuth">Criar/continuar Idol de teste</button>'
  +'<button type="button" class="krb" id="krHomolEnter" disabled>Entrar na sala</button>'
  +'<button type="button" class="krb" id="krHomolQueue" disabled>🎤 Entrar na fila</button>'
  +'<button type="button" class="krb" id="krHomolUnqueue" disabled>Sair da fila</button>'
  +'<button type="button" class="krb" id="krHomolLeave" disabled>Sair da sala</button>'
  +'<button type="button" class="krb" id="krHomolRefresh" disabled>Atualizar</button></div>'
  +'<p id="krHomolSync" role="status" style="font-size:12px">🌸 Sincronização aguardando entrada</p>'
  +'<p id="krHomolCount">👥 —/9 · 🎤 —/3</p>'
  +'<p id="krHomolTurn" role="status" aria-live="polite">🎤 Microfone aguardando a primeira cantora</p>'
  +'<ol id="krHomolPeople" aria-label="Idols presentes no palco"></ol>'
  +'<strong>💌 Próximos 3 Idols</strong>'
  +'<ol id="krHomolQueueSlots" aria-label="Fila de três lugares"></ol>'
  +'<p id="krHomolQueueText" style="font-size:12px">Fila: —</p>'
  +'<section id="krHomolPractice" class="kr-homol-practice" hidden aria-label="Ritmo online de ensaio">'
  +'<strong>🎶 Palco compartilhado · 40 notas</strong>'
  +'<p id="krHomolPracticeStats">⭐ Ensaio: 0 · 💖 PERFECT: 0 · ✨ GOOD: 0</p>'
  +'<div class="kr-homol-rail" aria-hidden="true"><span id="krHomolBeat" hidden>⭐</span></div>'
  +'<button type="button" class="krb" id="krHomolTap" disabled>🎶 Tocar no ritmo!</button>'
  +'<p id="krHomolTapMsg" role="status" aria-live="polite">Aguarde a sua vez no palco.</p>'
  +'<small>Placar do ensaio, calculado no servidor. Sem estrelas, moedas ou ranking oficial. A latência pode afetar os acertos.</small>'
  +'</section>'
  +'<small>Sem entrar: a sala cheia é uma demonstração local. Ao ocupar vaga, a fila e os participantes vêm do servidor. Sem estrelas e ranking; atualização leve a cada 30 segundos.</small>';
host.appendChild(panel);
var style=document.createElement('style');
style.textContent='#krHomolPanel{margin-top:12px}#krHomolPanel h3{font-family:"Mochiy Pop One",sans-serif;font-size:17px}#krHomolPanel button:disabled{opacity:.48;cursor:not-allowed}#krHomolPeople{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}#krHomolPeople li,#krHomolQueueSlots li{padding:5px 9px;border-radius:12px;background:rgba(210,178,255,.16);font-size:12px}#krHomolQueueSlots{display:grid;gap:5px;padding-left:23px}#krHomolTurn{font-weight:800;color:var(--pink,#ff6fb5)}#krHomolPractice{margin:12px 0;padding:13px;border:1px solid rgba(230,168,251,.55);border-radius:17px;background:linear-gradient(115deg,rgba(250,221,255,.18),rgba(191,255,246,.12))}#krHomolPractice p{font-size:12px}#krHomolPracticeStats{font-weight:800}#krHomolTap{font-family:"Mochiy Pop One",sans-serif}#krHomolTap:disabled{opacity:.5}.kr-homol-rail{height:22px;border-radius:14px;background:linear-gradient(90deg,rgba(241,180,255,.4),rgba(181,245,222,.5));margin:10px 0;position:relative;overflow:hidden}.kr-homol-rail:before{content:"";position:absolute;left:20%;top:0;bottom:0;width:2px;background:#fff;box-shadow:0 0 5px #fff}#krHomolBeat{position:absolute;top:-3px;font-size:18px;transition:left .12s linear}'
document.head.appendChild(style);
// A fila de demonstração continua até um participante ocupar vaga online.
var ids=['Check','Auth','Enter','Queue','Unqueue','Leave','Refresh'];
var buttons={};ids.forEach(function(k){buttons[k]=document.getElementById('krHomol'+k);});
var msg=document.getElementById('krHomolMsg');
function say(text){msg.textContent=String(text);}
say('🛡️ Teste o Turnstile sem cadastro. A entrada online continua fechada.');
function enable(auth,seat,queued){
 buttons.Check.disabled=!TURNSTILE_SITE_KEY;
 buttons.Auth.disabled=auth||!TURNSTILE_SITE_KEY||!SIGNUP_ENABLED;
 buttons.Enter.disabled=!auth||seat||!labOpen;
 buttons.Queue.disabled=!auth||!seat||queued||isSinging||!labOpen;
 buttons.Unqueue.disabled=!auth||!seat||!queued;
 buttons.Leave.disabled=!auth||!seat;
 buttons.Refresh.disabled=!auth;
}
enable(false,false,false);
function sdk(){
 return new Promise(function(resolve,reject){
   if(window.supabase&&typeof window.supabase.createClient==='function'){resolve();return;}
   var s=document.createElement('script');
   // Matches the existing site's pinned supabase-js version, loaded only for lab.
   s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.js';
   s.onload=function(){window.supabase?resolve():reject(new Error('SDK indisponível'));};
   s.onerror=function(){reject(new Error('Não foi possível carregar a autenticação'));};
   document.head.appendChild(s);
 });
}
async function init(){
 if(client)return client;
 await sdk();
 client=window.supabase.createClient(URL,KEY,{auth:{storageKey:'tsulipa-homol-auth-only-v1',
   persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});
 if(!sync&&window.TsuKaraokeHomolSync){
   sync=window.TsuKaraokeHomolSync.create({
     client:client,
     canListen:function(){return ready&&labOpen&&lastSeat&&!!token;},
     hidden:function(){return document.hidden;},
     busy:function(){return busy||!!currentRefresh;},
     refresh:function(){return refresh(false);},
     onStatus:function(label){document.getElementById('krHomolSync').textContent=label;}
   });
 }
 return client;
}
// Captcha is a prerequisite for new identities. The client gate is NOT a
// security boundary: server-side CAPTCHA must be enabled in this staging project.
var turnstileScriptPromise=null,turnstileWidget=null;
function turnstileReady(){
 if(window.turnstile&&typeof window.turnstile.render==='function')return Promise.resolve(window.turnstile);
 if(turnstileScriptPromise)return turnstileScriptPromise;
 turnstileScriptPromise=new Promise(function(resolve,reject){
   var s=document.createElement('script');
   s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
   s.async=true;
   s.onload=function(){
     if(window.turnstile&&typeof window.turnstile.render==='function')resolve(window.turnstile);
     else reject(new Error('Verificação antirobô indisponível'));
   };
   s.onerror=function(){turnstileScriptPromise=null;reject(new Error('Falha ao carregar a verificação antirobô'));};
   document.head.appendChild(s);
 });
 return turnstileScriptPromise;
}
async function captchaForSignup(){
 if(!TURNSTILE_SITE_KEY)throw new Error('A proteção antirobô da homologação ainda não está configurada.');
 var api=await turnstileReady(),area=document.getElementById('krHomolCaptcha');
 if(turnstileWidget!==null){try{api.remove(turnstileWidget);}catch(e){}turnstileWidget=null;}
 area.replaceChildren();
 say('Confirme a verificação antirobô. Este teste não cria contas.');
 return new Promise(function(resolve,reject){
   var finished=false,timeout=null;
   function complete(err,result){
     if(finished)return;
     finished=true;
     if(timeout!==null)clearTimeout(timeout);
     if(err)reject(err);else resolve(result);
   }
   // Evita deixar todos os botões bloqueados se o widget não responder.
   timeout=setTimeout(function(){complete(new Error('Tempo de verificação esgotado. Tente de novo.'));},90000);
   try{
     turnstileWidget=api.render(area,{
       sitekey:TURNSTILE_SITE_KEY,
       callback:function(result){complete(null,result);},
       'error-callback':function(){complete(new Error('Falha na verificação antirobô'));},
       'expired-callback':function(){complete(new Error('Verificação expirada. Tente novamente.'));}
     });
   }catch(e){complete(e);}
 });
}
function lock(){if(busy)return false;busy=true;ids.forEach(function(k){buttons[k].disabled=true;});return true;}
function unlock(){busy=false;enable(ready,lastSeat,lastQueued);}
function drawSharedRhythm(){
 var panel=document.getElementById('krHomolPractice'),
   tap=document.getElementById('krHomolTap'),
   note=document.getElementById('krHomolBeat');
 if(!lastSeat){panel.hidden=true;tap.disabled=true;note.hidden=true;return;}
 panel.hidden=false;
 var score=practice&&Number.isSafeInteger(practice.score)?practice.score:0;
 var perfect=practice&&Number.isSafeInteger(practice.perfect)?practice.perfect:0;
 var good=practice&&Number.isSafeInteger(practice.good)?practice.good:0;
 document.getElementById('krHomolPracticeStats').textContent=
  '⭐ Ensaio: '+score.toLocaleString()+' · 💖 PERFECT: '+perfect+' · ✨ GOOD: '+good;
 var now=turnClock?turnClock.serverNow+performance.now()-turnClock.clientNow:0;
 var start=turnClock?turnClock.starts:0;
 var rhythm=isSinging&&labOpen&&start&&now>=start+5000&&now<start+50000;
 tap.disabled=!rhythm||busy||tapPending;
 note.hidden=!rhythm||!window.TsuKaraokeRhythm;
 if(!note.hidden){
   var chart=window.TsuKaraokeRhythm.makeChart(),relative=now-start-5000,upcoming=null;
   for(var i=0;i<chart.length;i++){
     if(chart[i]>=relative-200){upcoming=chart[i];break;}
   }
   if(upcoming===null)note.hidden=true;
   else note.style.left=Math.max(4,Math.min(95,20+(upcoming-relative)/1200*75))+'%';
 }
}
function showTurnClock(){
 var out=document.getElementById('krHomolTurn'),badge=document.getElementById('krRelogio');
 drawSharedRhythm();
 if(!lastSeat){out.textContent=labOpen?'🎤 Ensaio aberto para Idols autorizados':'🔒 Ensaio online fechado · sala de demonstração ativa';badge.textContent='🎤 Homologação · sem pontos';return;}
 if(!turnClock||!Number.isFinite(turnClock.ends)){
   out.textContent='🎤 Microfone aguardando a próxima cantora';
   badge.textContent='🎤 Homologação · sem pontos';
   return;
 }
 var now=turnClock.serverNow+(performance.now()-turnClock.clientNow);
 var phase=window.TsuKaraokeHomolView.turnPhase(turnClock.starts,turnClock.ends,now);
 var texto=phase.phase==='intro'?'Preparando o palco':phase.phase==='rhythm'?'Cantando!':
   phase.phase==='outro'?'Aplausos!':'Aguardando a troca';
 out.textContent=(isSinging?'🌟 Sua vez! ':'🎤 '+turnClock.label+' · ')+texto+' · '+phase.remaining+'s';
 badge.textContent='🎤 '+turnClock.label+' · '+phase.remaining+'s (estimativa)';
}
async function rpc(action){
 var result=await client.rpc('karaoke_ensaio',{p_action:action,p_token:token||null});
 if(result.error)throw result.error;
 return result.data;
}
async function refresh(doHeartbeat){
 if(!client)return;
 if(currentRefresh)return currentRefresh;
 currentRefresh=refreshData(doHeartbeat);
 try{return await currentRefresh;}finally{currentRefresh=null;}
}
async function refreshData(doHeartbeat){
 var data=await rpc(doHeartbeat&&token&&labOpen?'heartbeat':'status');
 labOpen=data.labOpen===true;
 document.getElementById('krHomolGate').textContent=labOpen?
  '🟢 Ensaio online liberado somente para Idols fictícios autorizados.':'🔒 Entrada online fechada no servidor. A demonstração continua disponível.';
 if(data.status==='not_owner'||data.status==='not_inside'||(token&&data.mySeat!==true)){
   token=null;try{sessionStorage.removeItem(TOKEN_KEY);}catch(e){}
 }
 var seat=!!token&&!!data.mySeat;
 var queued=!!data.queuePosition;
 lastSeat=seat;lastQueued=queued;
 var list={slots:[],queue:[]};
 if(seat){
   var result=await client.rpc('karaoke_ensaio_elenco',{});
   if(result.error)throw result.error;
   if(result.data.status==='ok')list=result.data;
 }
 var count=document.getElementById('krHomolCount');
 count.textContent='👥 '+data.occupied+'/9 · 🎤 '+data.queueCount+'/3';
 var view=window.TsuKaraokeHomolView;
 var people=view.stageLayout(list.slots),queue=view.queueSlots(list.queue);
 var names=document.getElementById('krHomolPeople');names.replaceChildren();
 people.forEach(function(p){
   var li=document.createElement('li');li.textContent=p.label+(p.self?' (você)':'')+(p.singing?' 🎤':'');names.appendChild(li);
 });
 var ol=document.getElementById('krHomolQueueSlots');ol.replaceChildren();
 queue.forEach(function(p,i){
   var li=document.createElement('li'),my=people.some(function(a){return a.self&&p&&a.slot===p.slot;});
   li.textContent=p?p.label+(my?' · sua posição 💜':''):'Livre';
   li.setAttribute('aria-label','Fila '+(i+1)+': '+li.textContent);ol.appendChild(li);
 });
 document.getElementById('krHomolQueueText').textContent=queued?
  '💌 Você está na posição '+data.queuePosition+' de 3':'Fila por ordem de chegada.';
 var mic=people.find(function(p){return p.singing;}),previous=isSinging;
 isSinging=!!(seat&&data.amISinging&&mic&&mic.self);
 practice=seat&&data.practice&&typeof data.practice==='object'?data.practice:null;
 turnClock=(seat&&mic&&data.turnStarts&&data.turnEnds&&data.serverNow)?{
   starts:Date.parse(data.turnStarts),ends:Date.parse(data.turnEnds),
   serverNow:Date.parse(data.serverNow),clientNow:performance.now(),label:mic.label}:null;
 if(window.twKaraokeHomolBridge)window.twKaraokeHomolBridge.show({slots:people,queue:queue.filter(Boolean)});
 if(sync){sync.mark(Number(data.revision));if(seat&&labOpen)sync.start();else sync.stop();}
 showTurnClock();enable(true,seat,queued);
 if(isSinging&&!previous)say('🎤 Sua vez! No microfone por até 60 segundos, sem estrelas ou prêmios.');
 if(!labOpen||data.status==='lab_closed')say('🔒 A sala online ainda está fechada. Você pode explorar a demonstração completa.');
 else if(data.status==='full')say('💖 Palco lotado por enquanto. Tente novamente depois.');
 else if(data.status==='already_inside'&&!token)say('Outra aba já ocupa sua vaga. Não há duplicação de assentos.');
 else if(seat&&!isSinging)say('Conectado ao ensaio · '+data.occupied+'/9 · sem pontos ou prêmios.');
 else say('Identidade de ensaio pronta. Toque em Entrar na sala.');
 return data;
}
async function run(action){
 if(!ready||!lock())return;
 try{
  var data=await rpc(action);
  if(action==='enter'&&(data.status==='joined'||data.status==='resumed')&&data.seatToken){
    token=data.seatToken;
    try{sessionStorage.setItem(TOKEN_KEY,token);}catch(e){}
  }
  if(action==='leave'&&data.status==='left'){
    token=null;try{sessionStorage.removeItem(TOKEN_KEY);}catch(e){}
  }
  await refresh(false);
  if(data.status==='queue_full')say('🎤 Fila cheia! Somente três pessoas aguardam.');
  if(data.status==='already_queued')say('Você já está na fila.');
  if(data.status==='not_owner')say('Este assento pertence a outra aba.');
  if(data.status==='lab_closed')say('🔒 Entrada fechada pelo servidor. Nenhuma vaga foi ocupada.');
 }catch(e){say('Não foi possível atualizar o ensaio: '+String(e.message||e));}
 finally{unlock();}
}
buttons.Check.addEventListener('click',async function(){
 if(!lock())return;
 try{
   await captchaForSignup();
   say('✅ Desafio do navegador concluído. Nenhuma conta criada; a validação no servidor continua pendente.');
 }catch(e){say('Turnstile não foi concluído: '+String(e.message||e));}
 finally{unlock();}
});
buttons.Auth.addEventListener('click',async function(){
 if(!SIGNUP_ENABLED)return;
 if(!lock())return;
 try{
   await init();
   var r=await client.auth.getSession();
   if(r.data.session&&r.data.session.user&&r.data.session.user.is_anonymous!==true)
     throw new Error('Use somente um Idol anônimo de homologação; não uma conta permanente.');
   if(!r.data.session){
     var captchaToken=await captchaForSignup();
     r=await client.auth.signInAnonymously({options:{captchaToken:captchaToken}});
     if(r.error)throw r.error;
   }
   ready=true;await refresh(false);
   if(!turnClockTimer)turnClockTimer=setInterval(showTurnClock,125); // only visual, zero RPC
   if(!timer)timer=setInterval(function(){
     if(document.hidden||!ready||!token||!labOpen||busy)return;
     refresh(true).catch(function(e){say('Conexão de ensaio: '+String(e.message||e));});
   },30000);
 }catch(e){
   say('Login de teste não concluído. Confirme Turnstile e Anonymous Sign-ins somente no Supabase de homologação. '+String(e.message||e));
 }finally{unlock();}
});
document.getElementById('krHomolTap').addEventListener('click',async function(){
 if(!client||!token||!ready||!isSinging||!labOpen||busy||tapPending)return;
 var btn=this;tapPending=true;btn.disabled=true;
 var output=document.getElementById('krHomolTapMsg');
 try{
   var result=await client.rpc('karaoke_ensaio_toque',{p_token:token});
   if(result.error)throw result.error;
   var data=result.data||{};
   if(data.status==='PERFECT'||data.status==='GOOD'){
     practice={score:data.score,perfect:data.perfect,good:data.good,bestCombo:data.bestCombo};
     output.textContent=(data.status==='PERFECT'?'💖 PERFECT!':'✨ GOOD!')+
       ' · combo '+data.combo+' · '+Number(data.score).toLocaleString()+' pontos de ensaio';
   }else if(data.status==='not_owner'||data.status==='not_singer'||data.status==='lab_closed'){
     output.textContent='🌸 O microfone mudou de Idol. Atualizando o ensaio…';
     refresh(false).catch(function(){});
   }else output.textContent='💌 Espere a estrela passar pela linha! ('+String(data.status||'sem nota')+')';
 }catch(e){output.textContent='Conexão do ritmo: '+String(e.message||e);}
 finally{tapPending=false;drawSharedRhythm();}
});
buttons.Enter.addEventListener('click',function(){run('enter');});
buttons.Queue.addEventListener('click',function(){run('queue');});
buttons.Unqueue.addEventListener('click',function(){run('unqueue');});
buttons.Leave.addEventListener('click',function(){run('leave');});
buttons.Refresh.addEventListener('click',function(){if(ready&&!busy)refresh(false).catch(function(e){say(String(e.message||e));});});
document.addEventListener('visibilitychange',function(){
 if(document.hidden&&sync)sync.stop();
 if(!document.hidden&&ready&&!busy)refresh(false).catch(function(){});
});
window.addEventListener('pagehide',function(){if(sync)sync.stop();if(timer)clearInterval(timer);if(turnClockTimer)clearInterval(turnClockTimer);});
})();