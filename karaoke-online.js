/* TsuLiPa⭐World — Karaoke⭐Day! sala online (produção).
 * Usa a MESMA conta do site (login Google), sem cadastro novo nem captcha.
 * O servidor decide tudo: horário (domingo 12h–13h10 ou teste da moderação),
 * 9 vagas, fila de 3, 1 microfone, turno de 60 s. Realtime só avisa "mudou";
 * o estado vem sempre das RPCs. Pontos do palco não viram estrelas nem ranking.
 */
(function(){
'use strict';
var q=new URLSearchParams(location.search);
if(q.get('homol')==='1')return;            // a homologação tem seu próprio cliente
var URL='https://fsggtvgbyhchblyazgmt.supabase.co';
var KEY='sb_publishable_2Fh68LqCpGannoF--zq1Ng_13dF9YMT';
var TOKEN_KEY='tsulipa_karaoke_seat_v1';
var L=q.get('lang');if(!/^(pt|en|es|th|ja)$/.test(L||'')){try{L=localStorage.getItem('brs48cr_lang')||'pt';}catch(e){L='pt';}}if(!/^(pt|en|es|th|ja)$/.test(L))L='pt';
var T={
 pt:{tit:'🎤 Sala online · 9 Idols',hor:'🕛 Todo domingo, 12h–13h10 (Brasília)',
  entrar:'Entrar na sala',fila:'🎤 Pedir o microfone',sairFila:'Sair da fila',sair:'Sair da sala',
  vagas:'👥 {o}/9 · 🎤 fila {q}/3',semLogin:'💗 Entre com Google em Meu Perfil, na tela inicial, para cantar com a galera!',
  semPerfil:'💗 Crie seu perfil em Meu Perfil para entrar na sala.',fechada:'🔒 A sala abre todo domingo, das 12h às 13h10 (Brasília). Enquanto isso, ensaie aqui à vontade!',
  aberta:'🟢 Sala aberta! Toque em Entrar na sala.',dentro:'💜 Você está na sala · {o}/9',cheia:'💖 Palco lotado! Tente de novo em instantes.',
  suaVez:'🌟 Sua vez! Você tem 60 segundos no microfone.',fila3:'🎤 A fila está cheia (3 pessoas).',naFila:'💌 Você é a {n}ª da fila',
  outraAba:'Você já está na sala em outra aba.',bloq:'🛡️ A moderação pausou sua participação hoje.',devagar:'🌸 Calma! Espere alguns segundos.',
  erro:'Conexão instável. Tentando de novo…',aguardando:'🎤 Microfone livre · peça sua vez!',preparando:'Preparando o palco',cantando:'Cantando!',
  aplausos:'Aplausos!',troca:'Trocando de Idol',voce:'você',livre:'Livre',toque:'🎶 Toque no ritmo!',
  ritmoInfo:'Pontos do palco, contados no servidor. Não valem estrelas nem ranking.',perfect:'💖 PERFECT!',good:'✨ GOOD!',
  espere:'💌 Espere a estrela passar pela linha!',pontos:'pontos',proximos:'💌 Próximos 3'},
 en:{tit:'🎤 Online room · 9 Idols',hor:'🕛 Every Sunday, 12:00–13:10 (Brasília)',
  entrar:'Join the room',fila:'🎤 Ask for the mic',sairFila:'Leave the queue',sair:'Leave the room',
  vagas:'👥 {o}/9 · 🎤 queue {q}/3',semLogin:'💗 Sign in with Google in My Profile, on the home screen, to sing with everyone!',
  semPerfil:'💗 Create your profile in My Profile to join the room.',fechada:'🔒 The room opens every Sunday, 12:00–13:10 (Brasília). Meanwhile, rehearse here as much as you like!',
  aberta:'🟢 The room is open! Tap Join the room.',dentro:'💜 You are in the room · {o}/9',cheia:'💖 The stage is full! Try again in a moment.',
  suaVez:'🌟 Your turn! You have 60 seconds on the mic.',fila3:'🎤 The queue is full (3 people).',naFila:'💌 You are #{n} in the queue',
  outraAba:'You are already in the room in another tab.',bloq:'🛡️ Moderation paused your participation today.',devagar:'🌸 Easy! Wait a few seconds.',
  erro:'Unstable connection. Trying again…',aguardando:'🎤 The mic is free · ask for your turn!',preparando:'Getting the stage ready',cantando:'Singing!',
  aplausos:'Applause!',troca:'Switching Idols',voce:'you',livre:'Free',toque:'🎶 Tap on the beat!',
  ritmoInfo:'Stage points, counted on the server. They are not stars or ranking.',perfect:'💖 PERFECT!',good:'✨ GOOD!',
  espere:'💌 Wait for the star to reach the line!',pontos:'points',proximos:'💌 Next 3'},
 es:{tit:'🎤 Sala en línea · 9 Idols',hor:'🕛 Todos los domingos, 12:00–13:10 (Brasilia)',
  entrar:'Entrar a la sala',fila:'🎤 Pedir el micrófono',sairFila:'Salir de la fila',sair:'Salir de la sala',
  vagas:'👥 {o}/9 · 🎤 fila {q}/3',semLogin:'💗 Entra con Google en Mi Perfil, en la pantalla de inicio, ¡para cantar con todos!',
  semPerfil:'💗 Crea tu perfil en Mi Perfil para entrar a la sala.',fechada:'🔒 La sala abre los domingos de 12:00 a 13:10 (Brasilia). Mientras tanto, ¡ensaya aquí cuanto quieras!',
  aberta:'🟢 ¡La sala está abierta! Toca Entrar a la sala.',dentro:'💜 Estás en la sala · {o}/9',cheia:'💖 ¡Escenario lleno! Inténtalo en un momento.',
  suaVez:'🌟 ¡Tu turno! Tienes 60 segundos con el micrófono.',fila3:'🎤 La fila está llena (3 personas).',naFila:'💌 Eres la n.º {n} de la fila',
  outraAba:'Ya estás en la sala en otra pestaña.',bloq:'🛡️ La moderación pausó tu participación hoy.',devagar:'🌸 ¡Calma! Espera unos segundos.',
  erro:'Conexión inestable. Intentando de nuevo…',aguardando:'🎤 Micrófono libre · ¡pide tu turno!',preparando:'Preparando el escenario',cantando:'¡Cantando!',
  aplausos:'¡Aplausos!',troca:'Cambiando de Idol',voce:'tú',livre:'Libre',toque:'🎶 ¡Toca al ritmo!',
  ritmoInfo:'Puntos del escenario, contados en el servidor. No valen estrellas ni ranking.',perfect:'💖 PERFECT!',good:'✨ GOOD!',
  espere:'💌 ¡Espera a que la estrella llegue a la línea!',pontos:'puntos',proximos:'💌 Próximos 3'},
 th:{tit:'🎤 ห้องออนไลน์ · 9 ไอดอล',hor:'🕛 ทุกวันอาทิตย์ 12:00–13:10 (เวลาบราซิเลีย)',
  entrar:'เข้าห้อง',fila:'🎤 ขอไมค์',sairFila:'ออกจากคิว',sair:'ออกจากห้อง',
  vagas:'👥 {o}/9 · 🎤 คิว {q}/3',semLogin:'💗 เข้าสู่ระบบด้วย Google ที่ "โปรไฟล์ของฉัน" ในหน้าแรก เพื่อร้องเพลงกับทุกคน!',
  semPerfil:'💗 สร้างโปรไฟล์ที่ "โปรไฟล์ของฉัน" ก่อนเข้าห้อง',fechada:'🔒 ห้องเปิดทุกวันอาทิตย์ 12:00–13:10 (เวลาบราซิเลีย) ระหว่างนี้ซ้อมที่นี่ได้เลย!',
  aberta:'🟢 ห้องเปิดแล้ว! แตะ "เข้าห้อง"',dentro:'💜 คุณอยู่ในห้อง · {o}/9',cheia:'💖 เวทีเต็มแล้ว! ลองใหม่อีกสักครู่',
  suaVez:'🌟 ถึงตาคุณแล้ว! มีเวลา 60 วินาที',fila3:'🎤 คิวเต็มแล้ว (3 คน)',naFila:'💌 คุณอยู่คิวที่ {n}',
  outraAba:'คุณอยู่ในห้องจากแท็บอื่นแล้ว',bloq:'🛡️ ผู้ดูแลพักการเข้าร่วมของคุณวันนี้',devagar:'🌸 ใจเย็นๆ รอสักครู่นะ',
  erro:'การเชื่อมต่อไม่เสถียร กำลังลองใหม่…',aguardando:'🎤 ไมค์ว่าง · ขอคิวได้เลย!',preparando:'กำลังเตรียมเวที',cantando:'กำลังร้อง!',
  aplausos:'ปรบมือ!',troca:'กำลังเปลี่ยนไอดอล',voce:'คุณ',livre:'ว่าง',toque:'🎶 แตะตามจังหวะ!',
  ritmoInfo:'คะแนนบนเวที นับโดยเซิร์ฟเวอร์ ไม่นับเป็นดาวหรืออันดับ',perfect:'💖 PERFECT!',good:'✨ GOOD!',
  espere:'💌 รอให้ดาวมาถึงเส้นก่อน!',pontos:'คะแนน',proximos:'💌 3 คิวถัดไป'},
 ja:{tit:'🎤 オンラインルーム · 9人',hor:'🕛 毎週日曜 12:00〜13:10（ブラジリア時間）',
  entrar:'ルームに入る',fila:'🎤 マイクを予約',sairFila:'順番待ちをやめる',sair:'ルームを出る',
  vagas:'👥 {o}/9 · 🎤 順番 {q}/3',semLogin:'💗 ホームの「マイプロフィール」でGoogleログインして、みんなと歌おう！',
  semPerfil:'💗 「マイプロフィール」でプロフィールを作るとルームに入れます。',fechada:'🔒 ルームは毎週日曜 12:00〜13:10（ブラジリア時間）にオープン。それまでここで練習しよう！',
  aberta:'🟢 ルームオープン中！「ルームに入る」をタップ。',dentro:'💜 ルームに参加中 · {o}/9',cheia:'💖 ステージが満員です。少し待ってね。',
  suaVez:'🌟 あなたの番！マイクは60秒です。',fila3:'🎤 順番待ちがいっぱいです（3人）。',naFila:'💌 順番待ち {n}番目',
  outraAba:'別のタブですでに参加しています。',bloq:'🛡️ 今日は運営により参加が一時停止されています。',devagar:'🌸 少し待ってね。',
  erro:'接続が不安定です。再試行中…',aguardando:'🎤 マイクが空いています · 予約しよう！',preparando:'ステージ準備中',cantando:'歌唱中！',
  aplausos:'拍手！',troca:'交代中',voce:'あなた',livre:'空き',toque:'🎶 リズムに合わせてタップ！',
  ritmoInfo:'ステージのポイントはサーバーで計算。スターやランキングにはなりません。',perfect:'💖 PERFECT!',good:'✨ GOOD!',
  espere:'💌 星がラインに来るまで待ってね！',pontos:'ポイント',proximos:'💌 次の3人'}
};
function t(k,v){var s=(T[L]||T.pt)[k]||T.pt[k]||k;if(v)Object.keys(v).forEach(function(x){s=s.split('{'+x+'}').join(v[x]);});return s;}

var client=null,token=null,busy=false,timer=null,clockTimer=null,ready=false,sync=null;
var lastSeat=false,lastQueued=false,isSinging=false,labOpen=false,turnClock=null,practice=null,tapPending=false,locked=false,currentRefresh=null,pendingBeat=false;
try{token=sessionStorage.getItem(TOKEN_KEY)||null;}catch(e){}

var host=document.querySelector('.krwrap')||document.body;
var panel=document.createElement('section');
panel.className='kr-mic-queue kr-online';panel.id='krOnline';panel.setAttribute('aria-label',t('tit'));
panel.innerHTML='<h3>'+t('tit')+'</h3><p class="kr-on-hor">'+t('hor')+'</p>'
 +'<p id="krOnMsg" role="status" aria-live="polite"></p>'
 +'<div class="kr-on-btns"><button type="button" class="krb" id="krOnEnter" disabled></button>'
 +'<button type="button" class="krb" id="krOnQueue" disabled></button>'
 +'<button type="button" class="krb" id="krOnUnqueue" disabled hidden></button>'
 +'<button type="button" class="krb" id="krOnLeave" disabled hidden></button></div>'
 +'<p id="krOnCount" class="kr-on-count"></p><p id="krOnTurn" class="kr-on-turn" role="status" aria-live="polite"></p>'
 +'<ol id="krOnPeople" class="kr-on-people"></ol>'
 +'<div id="krOnQueueBox" hidden><strong>'+t('proximos')+'</strong><ol id="krOnQueueList" class="kr-on-queue"></ol></div>'
 +'<section id="krOnPractice" class="kr-on-practice" hidden><p id="krOnStats"></p>'
 +'<div class="kr-on-rail" aria-hidden="true"><span id="krOnBeat" hidden>⭐</span></div>'
 +'<button type="button" class="krb" id="krOnTap" disabled>'+t('toque')+'</button>'
 +'<p id="krOnTapMsg" role="status" aria-live="polite"></p><small>'+t('ritmoInfo')+'</small></section>';
host.appendChild(panel);
var css=document.createElement('style');
css.textContent='#krOnline{margin:10px 0}#krOnline h3{font-family:"Mochiy Pop One",sans-serif;font-size:17px;margin:0 0 4px}'
 +'#krOnline .kr-on-hor{font-size:12px;opacity:.85;margin:0 0 6px}#krOnMsg{font-weight:800;margin:6px 0}'
 +'.kr-on-btns{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}#krOnline button:disabled{opacity:.45;cursor:not-allowed}'
 +'.kr-on-count{font-size:12px;margin:4px 0}.kr-on-turn{font-weight:800;color:var(--pink,#ff6fb5);margin:4px 0}'
 +'.kr-on-people{display:flex;flex-wrap:wrap;gap:6px;padding:0;margin:6px 0;list-style:none}'
 +'.kr-on-people li,.kr-on-queue li{padding:5px 10px;border-radius:999px;background:rgba(210,178,255,.2);font-size:12px;font-weight:700}'
 +'.kr-on-queue{display:grid;gap:5px;padding-left:22px;margin:6px 0}'
 +'.kr-on-practice{margin:10px 0;padding:12px;border-radius:16px;border:1px solid rgba(230,168,251,.55);background:linear-gradient(115deg,rgba(250,221,255,.2),rgba(191,255,246,.14))}'
 +'#krOnStats{font-weight:800;font-size:12px}#krOnTap{font-family:"Mochiy Pop One",sans-serif}'
 +'.kr-on-rail{height:22px;border-radius:14px;background:linear-gradient(90deg,rgba(241,180,255,.45),rgba(181,245,222,.55));margin:8px 0;position:relative;overflow:hidden}'
 +'.kr-on-rail:before{content:"";position:absolute;left:20%;top:0;bottom:0;width:2px;background:#fff;box-shadow:0 0 5px #fff}'
 +'#krOnBeat{position:absolute;top:-2px;font-size:18px;transition:left .12s linear}';
document.head.appendChild(css);
var $o=function(id){return document.getElementById(id);};
var B={Enter:$o('krOnEnter'),Queue:$o('krOnQueue'),Unqueue:$o('krOnUnqueue'),Leave:$o('krOnLeave')};
B.Enter.textContent=t('entrar');B.Queue.textContent=t('fila');B.Unqueue.textContent=t('sairFila');B.Leave.textContent=t('sair');
function say(s){$o('krOnMsg').textContent=String(s||'');}
function enable(){
 var on=ready&&!locked;
 B.Enter.disabled=!on||lastSeat||!labOpen||busy;B.Enter.hidden=lastSeat;
 B.Queue.disabled=!on||!lastSeat||lastQueued||isSinging||!labOpen||busy;B.Queue.hidden=!lastSeat||lastQueued;
 B.Unqueue.hidden=!lastQueued;B.Unqueue.disabled=!lastQueued||busy;
 B.Leave.hidden=!lastSeat;B.Leave.disabled=!lastSeat||busy;
}
function sdk(){return new Promise(function(res,rej){
 if(window.supabase&&typeof window.supabase.createClient==='function'){res();return;}
 var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/dist/umd/supabase.js';
 s.onload=function(){window.supabase?res():rej(new Error('sdk'));};s.onerror=function(){rej(new Error('sdk'));};document.head.appendChild(s);
});}
async function init(){
 if(client)return client;
 await sdk();
 // Mesma origem e mesma chave de sessão do site: reaproveita o login Google.
 client=window.supabase.createClient(URL,KEY);
 if(!sync&&window.TsuKaraokeHomolSync){
  sync=window.TsuKaraokeHomolSync.create({client:client,
   canListen:function(){return ready&&labOpen&&lastSeat&&!!token;},
   hidden:function(){return document.hidden;},busy:function(){return busy||!!currentRefresh;},
   refresh:function(){return refresh(false);},onStatus:function(){}});
 }
 return client;
}
async function rpc(name,args){var r=await client.rpc(name,args||{});if(r.error)throw r.error;return r.data;}
function cleanAvatar(a){
 var c=a&&a.c,out={};if(!c||typeof c!=='object')return null;
 ['hair','hair2','skin','eye','back','front','det','out','outcol','hat','gl'].forEach(function(k){if(typeof c[k]==='string'&&c[k].length<=32)out[k]=c[k];});
 if(typeof c.streak==='boolean')out.streak=c.streak;return out;
}
function cleanNick(n){return typeof n==='string'?n.replace(/[<>]/g,'').slice(0,16):'';}
function phaseText(p){return p.phase==='intro'?t('preparando'):p.phase==='rhythm'?t('cantando'):p.phase==='outro'?t('aplausos'):t('troca');}
function drawRhythm(){
 var box=$o('krOnPractice'),tap=$o('krOnTap'),note=$o('krOnBeat');
 box.hidden=!lastSeat||!isSinging;if(box.hidden)return;
 var p=practice||{};
 $o('krOnStats').textContent='⭐ '+(+p.score||0).toLocaleString()+' '+t('pontos')+' · 💖 '+(+p.perfect||0)+' · ✨ '+(+p.good||0);
 var now=turnClock?turnClock.serverNow+performance.now()-turnClock.clientNow:0,start=turnClock?turnClock.starts:0;
 var on=isSinging&&labOpen&&start&&now>=start+5000&&now<start+50000;
 tap.disabled=!on||busy||tapPending;note.hidden=!on||!window.TsuKaraokeRhythm;
 if(!note.hidden){var chart=window.TsuKaraokeRhythm.makeChart(),rel=now-start-5000,up=null;
  for(var i=0;i<chart.length;i++){if(chart[i]>=rel-200){up=chart[i];break;}}
  if(up===null)note.hidden=true;else note.style.left=Math.max(4,Math.min(95,20+(up-rel)/1200*75))+'%';}
}
function showClock(){
 var out=$o('krOnTurn');drawRhythm();
 if(!lastSeat){out.textContent='';return;}
 if(!turnClock){out.textContent=t('aguardando');return;}
 var now=turnClock.serverNow+(performance.now()-turnClock.clientNow);
 var ph=window.TsuKaraokeHomolView.turnPhase(turnClock.starts,turnClock.ends,now);
 out.textContent=(isSinging?'🌟 ':'🎤 '+turnClock.label+' · ')+phaseText(ph)+' · '+ph.remaining+'s';
}
function startTimers(){
 if(!ready)return;
 if(!clockTimer)clockTimer=setInterval(showClock,125);
 if(!timer)timer=setInterval(function(){
  if(document.hidden||!ready||busy)return;
  refresh(!!token&&labOpen).catch(function(){say(t('erro'));});
 },lastSeat?30000:60000);
}
async function refresh(beat){
 if(!client||!ready)return;
 if(beat&&token&&labOpen)pendingBeat=true;
 if(currentRefresh)return currentRefresh;
 var run=(async function(){var r;do{var b=pendingBeat;pendingBeat=false;r=await refreshData(b);}while(pendingBeat&&token&&labOpen);return r;})();
 currentRefresh=run;
 try{return await run;}finally{currentRefresh=null;}
}
async function refreshData(beat){
 var d=await rpc('karaoke_sala',{p_action:beat&&token&&labOpen?'heartbeat':'status',p_token:token||null});
 labOpen=d.labOpen===true&&d.scheduleOpen===true;
 locked=d.status==='moderated'||d.status==='no_profile';
 if(d.status==='not_owner'||d.status==='moderated'||(token&&d.mySeat!==true)){token=null;try{sessionStorage.removeItem(TOKEN_KEY);}catch(e){}}
 lastSeat=!!token&&!!d.mySeat;lastQueued=!!d.queuePosition;
 var list={slots:[],queue:[]};
 if(lastSeat){var e=await rpc('karaoke_sala_elenco');if(e&&e.status==='ok')list=e;}
 $o('krOnCount').textContent=labOpen?t('vagas',{o:d.occupied,q:d.queueCount}):'';
 var view=window.TsuKaraokeHomolView,people=view.stageLayout(list.slots),queue=view.queueSlots(list.queue);
 // Nomes e visuais reais (os mesmos da vitrine pública).
 var bySlot={};(list.slots||[]).forEach(function(s){bySlot[s.slot]=s;});
 people.forEach(function(p){var s=bySlot[p.slot];if(s){p.label=cleanNick(s.nick)||p.label;p.c=cleanAvatar(s.avatar);}});
 (list.queue||[]).forEach(function(s,i){if(queue[i])queue[i].label=cleanNick(s.nick)||queue[i].label;});
 var ul=$o('krOnPeople');ul.replaceChildren();
 people.forEach(function(p){var li=document.createElement('li');li.textContent=p.label+(p.self?' ('+t('voce')+')':'')+(p.singing?' 🎤':'');ul.appendChild(li);});
 $o('krOnQueueBox').hidden=!lastSeat;
 var ol=$o('krOnQueueList');ol.replaceChildren();
 queue.forEach(function(p){var li=document.createElement('li');li.textContent=p?p.label:t('livre');ol.appendChild(li);});
 var mic=people.find(function(p){return p.singing;}),before=isSinging;
 isSinging=!!(lastSeat&&d.amISinging&&mic&&mic.self);
 practice=lastSeat&&d.practice&&typeof d.practice==='object'?d.practice:null;
 turnClock=(lastSeat&&mic&&d.turnStarts&&d.turnEnds&&d.serverNow)?{starts:Date.parse(d.turnStarts),ends:Date.parse(d.turnEnds),
  serverNow:Date.parse(d.serverNow),clientNow:performance.now(),label:mic.label}:null;
 if(window.twKaraokeHomolBridge)window.twKaraokeHomolBridge.show({slots:people,queue:queue.filter(Boolean)});
 if(sync){sync.mark(Number(d.revision));if(lastSeat&&labOpen)sync.start();else sync.stop();}
 showClock();enable();
 if(d.status==='no_profile')say(t('semPerfil'));
 else if(d.status==='moderated')say(t('bloq'));
 else if(!labOpen)say(t('fechada'));
 else if(d.status==='full')say(t('cheia'));
 else if(d.status==='already_inside'&&!token)say(t('outraAba'));
 else if(isSinging){if(!before)say(t('suaVez'));}
 else if(lastQueued)say(t('naFila',{n:d.queuePosition}));
 else if(lastSeat)say(t('dentro',{o:d.occupied}));
 else say(t('aberta'));
 return d;
}
async function act(action){
 if(!ready||busy)return;busy=true;enable();
 try{
  var d=await rpc('karaoke_sala',{p_action:action,p_token:token||null});
  if(action==='enter'&&(d.status==='joined'||d.status==='resumed')&&d.seatToken){token=d.seatToken;try{sessionStorage.setItem(TOKEN_KEY,token);}catch(e){}}
  if(action==='leave'&&d.status==='left'){token=null;try{sessionStorage.removeItem(TOKEN_KEY);}catch(e){}}
  busy=false;await refresh(false);
  if(d.status==='rate_limited')say(t('devagar'));
  if(d.status==='queue_full')say(t('fila3'));
  if(d.status==='lab_closed')say(t('fechada'));
  if(action==='enter'&&lastSeat){clearInterval(timer);timer=null;startTimers();}
 }catch(e){say(t('erro'));}
 finally{busy=false;enable();}
}
B.Enter.onclick=function(){act('enter');};
B.Queue.onclick=function(){act('queue');};
B.Unqueue.onclick=function(){act('unqueue');};
B.Leave.onclick=function(){act('leave');};
$o('krOnTap').onclick=async function(){
 if(!client||!token||!isSinging||!labOpen||tapPending)return;
 tapPending=true;this.disabled=true;var out=$o('krOnTapMsg');
 try{var d=await rpc('karaoke_sala_toque',{p_token:token});
  if(d.status==='PERFECT'||d.status==='GOOD'){practice={score:d.score,perfect:d.perfect,good:d.good};
   out.textContent=(d.status==='PERFECT'?t('perfect'):t('good'))+' · combo '+d.combo+' · '+Number(d.score).toLocaleString()+' '+t('pontos');}
  else if(d.status==='not_singer'||d.status==='not_owner'||d.status==='lab_closed'){refresh(false).catch(function(){});}
  else out.textContent=t('espere');
 }catch(e){out.textContent=t('erro');}
 finally{tapPending=false;drawRhythm();}
};
document.addEventListener('visibilitychange',function(){
 if(document.hidden&&sync)sync.stop();
 if(!document.hidden&&ready&&!busy)refresh(false).catch(function(){});
});
window.addEventListener('pagehide',function(){
 if(sync)sync.stop();
 if(timer){clearInterval(timer);timer=null;}if(clockTimer){clearInterval(clockTimer);clockTimer=null;}
 // Ao fechar o jogo, libera a vaga na hora (o servidor também expira em 45 s).
 if(client&&token&&lastSeat){try{client.rpc('karaoke_sala',{p_action:'leave',p_token:token});}catch(e){}}
});
window.addEventListener('pageshow',function(e){if(e.persisted&&ready){startTimers();refresh(false).catch(function(){});}});

enable();
(async function(){
 try{
  await init();
  var s=await client.auth.getSession();
  if(!s.data||!s.data.session){say(t('semLogin'));return;}
  ready=true;await refresh(false);startTimers();
 }catch(e){say(t('erro'));}
})();
})();
