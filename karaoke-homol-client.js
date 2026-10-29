/* TsuLiPa⭐World — 3A.3, optional rehearsal client.
 * Only loads with karaoke-day.html?homol=1. Never references production Supabase,
 * original accounts, scores or rewards. Anonymous sign-in is by explicit click.
 * No Realtime, no frame-rate requests: seats refresh at most once per 30 seconds.
 */
(function(){
'use strict';
if(new URLSearchParams(location.search).get('homol')!=='1')return;
var URL='https://hfzjoefnousiouiuchys.supabase.co';
var KEY='sb_publishable_eWhnlZJSyDsJ3N8poUStGw_3XsEFO_T';
var TOKEN_KEY='tsulipa_homol_seat_token_v1';
var client=null,token=null,busy=false,timer=null,ready=false,lastSeat=false,lastQueued=false;
try{token=sessionStorage.getItem(TOKEN_KEY)||null;}catch(e){}
var host=document.querySelector('.krwrap')||document.body;
var panel=document.createElement('section');
panel.className='kr-mic-queue';
panel.id='krHomolPanel';
panel.setAttribute('aria-label','Homologação do Karaoke');
panel.innerHTML='<h3>🎤 Ensaio online · 9 Idols</h3>'
  +'<p id="krHomolMsg" role="status" aria-live="polite">Conecte um Idol fictício para testar a sala. Nenhuma conta ou estrela do jogo oficial será usada.</p>'
  +'<div class="btns" style="display:flex;gap:8px;flex-wrap:wrap;margin:9px 0">'
  +'<button type="button" class="krb" id="krHomolAuth">Criar/continuar Idol de teste</button>'
  +'<button type="button" class="krb" id="krHomolEnter" disabled>Entrar na sala</button>'
  +'<button type="button" class="krb" id="krHomolQueue" disabled>🎤 Entrar na fila</button>'
  +'<button type="button" class="krb" id="krHomolUnqueue" disabled>Sair da fila</button>'
  +'<button type="button" class="krb" id="krHomolLeave" disabled>Sair da sala</button>'
  +'<button type="button" class="krb" id="krHomolRefresh" disabled>Atualizar</button></div>'
  +'<p id="krHomolCount">👥 —/9 · 🎤 —/3</p>'
  +'<ol id="krHomolPeople" aria-label="Participantes do ensaio"></ol>'
  +'<p id="krHomolQueueText" style="font-size:12px">Fila: —</p>'
  +'<small>Somente homologação. Os avatares são modelos visuais; os lugares e a fila vêm do servidor. Atualização leve a cada 30 segundos enquanto você estiver na sala.</small>';
host.appendChild(panel);
var style=document.createElement('style');
style.textContent='#krHomolPanel{margin-top:12px}#krHomolPanel h3{font-family:"Mochiy Pop One",sans-serif;font-size:17px}#krHomolPanel button:disabled{opacity:.48;cursor:not-allowed}#krHomolPeople{display:flex;flex-wrap:wrap;gap:8px;padding:0;list-style:none}#krHomolPeople li{padding:5px 9px;border-radius:99px;background:var(--chip,#f7eafb);font-size:12px}';
document.head.appendChild(style);
var localQueue=document.getElementById('krMicQueue');
if(localQueue){localQueue.hidden=true;localQueue.style.display='none';}
var ids=['Auth','Enter','Queue','Unqueue','Leave','Refresh'];
var buttons={};ids.forEach(function(k){buttons[k]=document.getElementById('krHomol'+k);});
var msg=document.getElementById('krHomolMsg');
function say(text){msg.textContent=String(text);}
function enable(auth,seat,queued){
 buttons.Auth.disabled=auth;
 buttons.Enter.disabled=!auth||seat;
 buttons.Queue.disabled=!auth||!seat||queued;
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
 return client;
}
function lock(){if(busy)return false;busy=true;ids.forEach(function(k){buttons[k].disabled=true;});return true;}
function unlock(){busy=false;enable(ready,lastSeat,lastQueued);}
async function rpc(action){
 var result=await client.rpc('karaoke_ensaio',{p_action:action,p_token:token||null});
 if(result.error)throw result.error;
 return result.data;
}
async function refresh(doHeartbeat){
 if(!client)return;
 var data=await rpc(doHeartbeat&&token?'heartbeat':'status');
 if(data.status==='not_owner'||data.status==='not_inside'){
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
 var names=document.getElementById('krHomolPeople');names.replaceChildren();
 list.slots.forEach(function(p){
   var li=document.createElement('li');li.textContent=p.label+(p.self?' (você)':'')+(p.singing?' 🎤':'');names.appendChild(li);
 });
 document.getElementById('krHomolQueueText').textContent=
  'Fila: '+(list.queue.length?list.queue.map(function(p){return p.label;}).join(' → '):'vazia');
 if(window.twKaraokeHomolBridge)window.twKaraokeHomolBridge.show(list);
 enable(true,seat,queued);
 if(data.status==='full')say('💖 Palco lotado por enquanto. Tente novamente depois.');
 else if(data.status==='already_inside'&&!token)say('Outra aba já ocupa sua vaga. Não há duplicação de assentos.');
 else if(seat)say('Conectado ao ensaio · '+data.occupied+'/9 · sem pontos ou prêmios.');
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
 }catch(e){say('Não foi possível atualizar o ensaio: '+String(e.message||e));}
 finally{unlock();}
}
buttons.Auth.addEventListener('click',async function(){
 if(!lock())return;
 try{
   await init();
   var r=await client.auth.getSession();
   if(!r.data.session){
     r=await client.auth.signInAnonymously();
     if(r.error)throw r.error;
   }
   ready=true;await refresh(false);
   if(!timer)timer=setInterval(function(){
     if(document.hidden||!ready||!token||busy)return;
     refresh(true).catch(function(e){say('Conexão de ensaio: '+String(e.message||e));});
   },30000);
 }catch(e){
   say('Autenticação indisponível na homologação. Habilite Anonymous Sign-ins em Auth > Providers no projeto de testes. '+String(e.message||e));
 }finally{unlock();}
});
buttons.Enter.addEventListener('click',function(){run('enter');});
buttons.Queue.addEventListener('click',function(){run('queue');});
buttons.Unqueue.addEventListener('click',function(){run('unqueue');});
buttons.Leave.addEventListener('click',function(){run('leave');});
buttons.Refresh.addEventListener('click',function(){if(ready&&!busy)refresh(false).catch(function(e){say(String(e.message||e));});});
document.addEventListener('visibilitychange',function(){
 if(!document.hidden&&ready&&!busy)refresh(false).catch(function(){});
});
window.addEventListener('pagehide',function(){if(timer)clearInterval(timer);});
})();