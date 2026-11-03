/* Karaoke⭐Time! — ponte online extraída do jogo; usa o contexto original da sala. */
window.KaraokeOnlineFactory=function($,krAviso,CH,KaraokeAvatar,ktDaily,LANG){return (function(){
 var lastPos=0,KEY='kt_online_run_v1',run=null,runOwner='',boards=null,readAt=0,busy=false,usados=null,tickets=0,admissionTicket=false,activeOwner='';
 function sessionKey(a){try{if(a&&typeof a.sessionKey==='function')return String(a.sessionKey()||'');return a&&a.ativo()?'legacy-session':'';}catch(e){return '';}}
 function api(){try{
  if(!document.documentElement.classList.contains('kt-no-site'))return null;
  var a=window.parent&&window.parent.twKaraokeOnline;
  if(a&&a.ativo()){
   var key=sessionKey(a);
   if(key!==activeOwner){activeOwner=key;readAt=0;usados=null;tickets=0;boards=null;}
   return a;
  }
  if(activeOwner){activeOwner='';readAt=0;usados=null;tickets=0;boards=null;}
  return null;
 }catch(e){return null;}}
 function sameSession(a,key){return !!key&&api()===a&&sessionKey(a)===key;}
 function aviso(m){try{krAviso(m);}catch(e){}var h=$('ktHint');if(h)h.textContent=m;}
 function runMap(){try{var v=JSON.parse(localStorage.getItem(KEY)||'null');if(v&&v.runs&&typeof v.runs==='object')return v.runs;if(v&&typeof v.run==='string'){var owner=v.owner||sessionKey(api()),legacy={};if(owner)legacy[owner]=v.run;return legacy;}}catch(e){}return {};}
 function guardado(owner){var key=owner||sessionKey(api());if(!key)return null;var map=runMap();return typeof map[key]==='string'?map[key]:null;}
 function guardar(id,owner){var key=owner||sessionKey(api());if(!key)return;var map=runMap();if(id)map[key]=id;else delete map[key];try{if(Object.keys(map).length)localStorage.setItem(KEY,JSON.stringify({runs:map}));else localStorage.removeItem(KEY);}catch(e){}}
 function avatar(a,cor){var c=a&&a.c&&typeof a.c==='object'?Object.assign({},a.c):Object.assign({},CH[0]);if(/^#[0-9a-f]{6}$/i.test(cor||''))c.luz=cor;return {c:c,a:a&&typeof a.a==='string'?a.a:'',visual:a&&typeof a.visual==='string'?a.visual:''};}
 function linhasExtra(list){return linhas(list).map(function(r,i){r.valor=+((list||[])[i]||{}).valor||0;return r;});}
 function linhas(list){return (Array.isArray(list)?list:[]).slice(0,5).map(function(r,i){return {id:'online-'+i+'-'+String(r.nick||''),nick:String(r.nick||'Idol').slice(0,24),avatar:avatar(r.avatar,r.cor),score:+r.score||0,combo:+r.combo||0,accuracy:+r.accuracy||0,hits:+r.hits||0};});}
 function load(force){recoverFinishes();var a=api(),owner=sessionKey(a);if(!a||!owner||(!force&&Date.now()-readAt<60000))return;readAt=Date.now();
  a.ranking().then(function(d){if(!sameSession(a,owner)||!d||!d.semana)return;boards={week:d.semana,ends:d.fim,score:linhas(d.score),accuracy:linhas(d.acertos),combo:linhas(d.combo),online:true};if(a.quadros)a.quadros().then(function(q){if(!sameSession(a,owner)||!q||!boards)return;boards.extra={shows:{top:linhasExtra(q.shows&&q.shows.top),me:q.shows&&q.shows.eu||null},evolucao:{top:linhasExtra(q.evolucao&&q.evolucao.top),me:q.evolucao&&q.evolucao.eu||null}};if(window.ktMetaRefresh)window.ktMetaRefresh();}).catch(function(){});if(a.musicaSemana)a.musicaSemana().then(function(m){if(!sameSession(a,owner)||!m||!boards||!m.musica)return;boards.song={song:m.musica,top:linhas(m.top),me:m.eu||null};if(window.ktMetaRefresh)window.ktMetaRefresh();}).catch(function(){});if(a.posicao)a.posicao().then(function(p){if(!sameSession(a,owner)||!p||!boards)return;boards.me={score:p.score,accuracy:p.acertos,combo:p.combo};lastPos=Date.now();if(window.ktMetaRefresh)window.ktMetaRefresh();}).catch(function(){});if(Number.isFinite(+d.usados))usados=+d.usados;if(Number.isFinite(+d.tickets))tickets=+d.tickets;if(window.ktMetaRefresh)window.ktMetaRefresh();}).catch(function(){});}
 function quota(){var a=api(),owner=sessionKey(a);if(!a||!owner)return Promise.resolve(null);return a.ranking().then(function(d){if(!sameSession(a,owner))return null;if(d&&Number.isFinite(+d.usados))usados=+d.usados;if(d&&Number.isFinite(+d.tickets))tickets=+d.tickets;if(window.ktMetaRefresh)window.ktMetaRefresh();return usados;});}
 function launch(fn,ticket){window.ktShowAdmissionPending=false;admissionTicket=!!ticket;try{fn({ticket:!!ticket});}finally{admissionTicket=false;}}
 function ticketConcluir(id){if(!id)return;try{var parent=window.parent;if(parent&&parent.ktTickets&&parent.ktTickets.completeRun)parent.ktTickets.completeRun(id);}catch(e){}}
 function gate(fn,wantsTicket){var a=api(),owner=sessionKey(a);if(!a){if(!wantsTicket)launch(fn,false);else window.ktShowAdmissionPending=false;return;}if(!owner||busy){window.ktShowAdmissionPending=false;return;}busy=true;
  var resume=guardado(owner);
  a.iniciar(resume,!!wantsTicket).then(function(r){
   if(wantsTicket&&resume&&r&&r.reason==='limit'&&sameSession(a,owner)){
    if(guardado(owner)===resume)guardar(null,owner);
    ticketConcluir(resume);
    return a.iniciar(null,true);
   }
   return r;
  }).then(function(r){busy=false;
   if(!sameSession(a,owner)){if(r&&r.ok&&r.run)guardar(r.run,owner);window.ktShowAdmissionPending=false;return;}
   if(r&&Number.isFinite(+r.used))usados=+r.used;
   if(r&&Number.isFinite(+r.tickets))tickets=+r.tickets;
   if(r&&r.ok){if(resume&&r.run!==resume)ticketConcluir(resume);run=r.run;runOwner=owner;guardar(run,owner);launch(fn,r.kind==='ticket');return;}
   if(wantsTicket){window.ktShowAdmissionPending=false;if(r&&r.reason==='used_request')aviso('🎟️ A tentativa anterior já foi encerrada. Saldo conferido; inicie uma nova apresentação.');else aviso('🎟️ Não foi possível usar o ticket. Seu saldo não foi liberado para esta apresentação.');if(window.ktMetaRefresh)window.ktMetaRefresh();return;}
   if(r&&r.reason==='limit'){aviso('Você usou seus cinco shows de hoje. A plateia espera você amanhã!');return;}
   run=null;guardar(null);aviso('Este show fica só neste aparelho (sem ranking online).');launch(fn,false);
  },function(){busy=false;if(!sameSession(a,owner)){window.ktShowAdmissionPending=false;return;}run=null;runOwner='';if(wantsTicket){window.ktShowAdmissionPending=false;aviso('🎟️ Sem conexão: nenhum ticket foi autorizado. Tente novamente.');return;}aviso('Sem conexão com o ranking: este show fica só neste aparelho.');launch(fn,false);});}
 
 var FINISH_KEY='kt_online_finish_v1:',finishQueue=Object.create(null),finishBusy=Object.create(null),finishAuto=Object.create(null),lastFinish=null;
 function finishEntries(owner){
  if(!owner)return [];
  if(finishQueue[owner])return finishQueue[owner];
  var list=[];try{var saved=JSON.parse(localStorage.getItem(FINISH_KEY+encodeURIComponent(owner))||'[]');if(Array.isArray(saved))list=saved.filter(function(e){return e&&typeof e.id==='string'&&e.result&&typeof e.result==='object'&&(e.state==='pending'||e.state==='uncertain');});}catch(e){}
  return finishQueue[owner]=list;
 }
 function saveFinishes(owner){
  try{var list=finishEntries(owner),key=FINISH_KEY+encodeURIComponent(owner);if(list.length)localStorage.setItem(key,JSON.stringify(list));else localStorage.removeItem(key);return true;}catch(e){return false;}
 }
 function finishText(state){
  var copy={
   pt:{pending:'⏳ Aguardando confirmação do ranking online. Seu resultado está guardado neste aparelho.',success:'✅ Pontuação confirmada pelo Supabase e registrada no ranking online!',invalid:'❌ O servidor rejeitou este resultado. Nenhum recorde foi registrado.',uncertain:'⚠️ O servidor já encerrou esta partida, mas não confirmou se a pontuação foi registrada. Não será reenviada automaticamente.',storage:'⚠️ Aguardando confirmação. O navegador não permitiu guardar uma cópia para recuperação.',retry:'↻ Tentar confirmar',recover:'resultado(s) sem confirmação'},
   en:{pending:'⏳ Waiting for online ranking confirmation. Your result is saved on this device.',success:'✅ Score confirmed by the server and recorded online!',invalid:'❌ The server rejected this score. No record was added.',uncertain:'⚠️ The server has already closed this show, but could not confirm the score. It will not retry automatically.',storage:'⚠️ Waiting for confirmation. This browser could not save a recovery copy.',retry:'↻ Retry confirmation',recover:'unconfirmed result(s)'},
   es:{pending:'⏳ Esperando confirmación del ranking. Tu resultado está guardado en este dispositivo.',success:'✅ ¡Puntuación confirmada en el ranking online!',invalid:'❌ El servidor rechazó este resultado.',uncertain:'⚠️ El servidor ya cerró este show, pero no pudo confirmar la puntuación. No se reenviará automáticamente.',storage:'⚠️ Esperando confirmación. No se pudo guardar una copia de recuperación.',retry:'↻ Reintentar confirmación',recover:'resultado(s) sin confirmar'},
   th:{pending:'⏳ รอยืนยันคะแนนออนไลน์ ผลถูกเก็บไว้ในอุปกรณ์นี้',success:'✅ ยืนยันคะแนนบนเซิร์ฟเวอร์แล้ว!',invalid:'❌ เซิร์ฟเวอร์ปฏิเสธคะแนนนี้',uncertain:'⚠️ เซิร์ฟเวอร์ปิดการแสดงแล้ว แต่ยืนยันคะแนนไม่ได้ จะไม่ส่งซ้ำอัตโนมัติ',storage:'⚠️ รอยืนยัน ไม่สามารถบันทึกข้อมูลเพื่อกู้คืนได้',retry:'↻ ลองยืนยันอีกครั้ง',recover:'รายการรอยืนยัน'},
   ja:{pending:'⏳ オンライン記録を確認中。結果は端末に保存されています。',success:'✅ サーバーでスコアを確認しました！',invalid:'❌ サーバーがこのスコアを拒否しました。',uncertain:'⚠️ ショーは終了済みですが、記録を確認できません。自動再送しません。',storage:'⚠️ 確認中。復旧用データを保存できませんでした。',retry:'↻ 再確認',recover:'未確認の結果'},
   id:{pending:'⏳ Menunggu konfirmasi peringkat online. Hasil tersimpan di perangkat ini.',success:'✅ Skor dikonfirmasi oleh server dan tercatat online!',invalid:'❌ Server menolak skor ini.',uncertain:'⚠️ Server sudah menutup pertunjukan, tetapi skor belum dapat dipastikan. Tidak akan dikirim ulang otomatis.',storage:'⚠️ Menunggu konfirmasi. Salinan pemulihan gagal disimpan.',retry:'↻ Coba konfirmasi lagi',recover:'hasil belum terkonfirmasi'}
  };return copy[LANG]&&copy[LANG][state]||copy.pt[state]||'';
 }
 function renderFinish(){
  var box=$('ktResultDelivery'),retry=$('ktResultRetry'),owner=sessionKey(api()),r=lastFinish&&lastFinish.owner===owner?lastFinish:null;
  if(box){box.hidden=!r;box.textContent=r?finishText(r.state):'';}
  if(retry){retry.hidden=!r||r.state!=='pending';retry.textContent=finishText('retry');}
  var notice=$('ktDeliveryRecovery'),again=$('ktDeliveryRetry'),items=finishEntries(owner),pending=items.filter(function(e){return e.state==='pending';});
  if(notice){notice.hidden=!items.length;notice.textContent=items.length?'🎤 '+items.length+' '+finishText('recover')+'. '+(pending.length?finishText('pending'):finishText('uncertain')):'';}
  if(again){again.hidden=!pending.length;again.textContent=finishText('retry');}
 }
 function setFinish(owner,id,state){
  if(lastFinish&&lastFinish.owner===owner&&lastFinish.id===id){lastFinish.state=state;renderFinish();}
  else renderFinish();
 }
 function sendFinish(owner,id,a){
  var item=finishEntries(owner).find(function(e){return e.id===id;}),key=owner+'|'+id;
  if(!item||item.state!=='pending'||finishBusy[key]||!sameSession(a,owner))return;
  finishBusy[key]=true;
  return Promise.resolve().then(function(){return a.terminar(id,item.result);}).then(function(x){
   delete finishBusy[key];
   var current=finishEntries(owner),at=current.findIndex(function(e){return e.id===id;});
   if(at<0)return;
   if(x&&x.ok===true&&x.ranked===true){
    current.splice(at,1);saveFinishes(owner);
    if(sameSession(a,owner)){ticketConcluir(id);setFinish(owner,id,'success');load(true);}
   }else if(x&&x.reason==='invalid'){
    current.splice(at,1);saveFinishes(owner);
    if(sameSession(a,owner)){ticketConcluir(id);setFinish(owner,id,'invalid');}
   }else if(x&&x.reason==='run'){
    // A função SQL devolve "run" tanto para uma partida já confirmada quanto para outra indisponível.
    // Sem recibo por UUID, nunca afirmar sucesso e nunca reenviar automaticamente.
    item.state='uncertain';saveFinishes(owner);if(sameSession(a,owner))setFinish(owner,id,'uncertain');
   }else{if(sameSession(a,owner))setFinish(owner,id,'pending');}
   renderFinish();
  },function(){delete finishBusy[key];if(sameSession(a,owner))setFinish(owner,id,'pending');renderFinish();});
 }
 function retryFinishes(){
  var a=api(),owner=sessionKey(a);if(!a||!owner)return;
  finishEntries(owner).forEach(function(e){if(e.state==='pending')sendFinish(owner,e.id,a);});
  renderFinish();
 }
 function recoverFinishes(){
  var a=api(),owner=sessionKey(a);if(!a||!owner)return;
  finishEntries(owner).forEach(function(e){var key=owner+'|'+e.id;if(e.state==='pending'&&!finishAuto[key]){finishAuto[key]=true;sendFinish(owner,e.id,a);}});
  renderFinish();
 }
 function showFinishResult(enabled){if(!enabled)lastFinish=null;renderFinish();}
 if($('ktResultRetry'))$('ktResultRetry').onclick=retryFinishes;
 if($('ktDeliveryRetry'))$('ktDeliveryRetry').onclick=retryFinishes;

 function finish(result){var a=api(),id=run,owner=runOwner;run=null;runOwner='';
  if(!id||!owner){lastFinish=null;renderFinish();return;}
  if(!sameSession(a,owner)){guardar(id,owner);lastFinish=null;renderFinish();return;}
  if(!result){guardar(null,owner);a.terminar(id,null).then(function(x){if(sameSession(a,owner)&&x&&x.reason==='invalid')aviso('O servidor não aceitou este encerramento.');}).catch(function(){});return;}
  var list=finishEntries(owner),item=list.find(function(e){return e.id===id;});
  if(!item){item={id:id,result:result,state:'pending'};list.push(item);}
  var saved=saveFinishes(owner);guardar(null,owner);
  lastFinish={id:id,owner:owner,state:saved?'pending':'storage'};
  renderFinish();
  // Se o armazenamento estiver bloqueado, ainda enviamos o resultado nesta sessão.
  if(!saved)lastFinish.state='storage';
  sendFinish(owner,id,a);
 }
 /* Com conta, o limite diário vem do servidor, não do aparelho. */
 function ajusta(a){if(!api()||usados===null||a.pending)return Object.assign({},a,{tickets:api()?tickets:0});var u=Math.min(5,Math.max(0,usados));return Object.assign({},a,{used:u,remaining:5-u,tickets:tickets});}
 return {gate:gate,finish:finish,load:load,quota:quota,ajusta:ajusta,showResult:showFinishResult,ticketAdmission:function(){return admissionTicket;},boards:function(){return api()&&boards?boards:null;},online:function(){return !!api();}};
})();};
