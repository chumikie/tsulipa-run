/* Karaoke⭐Time! — inventário visual, saldo sempre autoritativo no servidor. */
(function(){
 'use strict';
 var W={
  pt:['🎟️ Tickets de Karaoke','Saldo','Presentear 1 ticket','Nick do Idol','Enviar presente','Sem tickets disponíveis.','Presente enviado! 💖','Não foi possível enviar. Confira o nick e o saldo.','🎟️ Conceder tickets (moderação)','Quantidade (1–20)','Motivo','Conceder','Tickets concedidos! ✨','Não foi possível conceder os tickets.','Saldo temporariamente indisponível.','Carregando...','ITEM DO INVENTÁRIO','Cada ticket garante mais uma apresentação depois das cinco gratuitas do dia.','🎰 Prêmio do Gacha','🎁 Pode presentear','Ticket de Karaoke','Entre com Google para ver seus tickets','Tickets de Karaoke'],
  en:['🎟️ Karaoke tickets','Balance','Gift 1 ticket','Idol nickname','Send gift','No tickets available.','Gift sent! 💖','Could not send. Check nickname and balance.','🎟️ Grant tickets (moderation)','Amount (1–20)','Reason','Grant','Tickets granted! ✨','Could not grant tickets.','Balance temporarily unavailable.','Loading...','INVENTORY ITEM','Each ticket gives one extra show after your five free daily shows.','🎰 Gacha prize','🎁 Giftable','Karaoke ticket','Sign in with Google to see tickets','Karaoke tickets'],
  es:['🎟️ Tickets de Karaoke','Saldo','Regalar 1 ticket','Nick del Idol','Enviar regalo','No tienes tickets.','¡Regalo enviado! 💖','No se pudo enviar. Revisa el nick y el saldo.','🎟️ Conceder tickets (moderación)','Cantidad (1–20)','Motivo','Conceder','¡Tickets concedidos! ✨','No se pudieron conceder los tickets.','Saldo no disponible temporalmente.','Cargando...','OBJETO DEL INVENTARIO','Cada ticket permite un show extra después de los cinco gratis del día.','🎰 Premio del Gacha','🎁 Se puede regalar','Ticket de Karaoke','Inicia sesión con Google para ver los tickets','Tickets de Karaoke'],
  th:['🎟️ ตั๋วคาราโอเกะ','ยอดคงเหลือ','ส่งตั๋ว 1 ใบเป็นของขวัญ','ชื่อไอดอล','ส่งของขวัญ','ไม่มีตั๋วเหลือ','ส่งของขวัญแล้ว! 💖','ส่งไม่สำเร็จ ตรวจชื่อและยอดตั๋ว','🎟️ มอบตั๋ว (ผู้ดูแล)','จำนวน (1–20)','เหตุผล','มอบตั๋ว','มอบตั๋วแล้ว! ✨','มอบตั๋วไม่สำเร็จ','ไม่สามารถแสดงยอดชั่วคราว','กำลังโหลด...','ไอเทมในกระเป๋า','ตั๋วแต่ละใบใช้เล่นเพิ่มได้ 1 ครั้ง หลังใช้สิทธิ์ฟรี 5 ครั้งของวัน','🎰 รางวัลกาชา','🎁 มอบเป็นของขวัญได้','ตั๋วคาราโอเกะ','เข้าสู่ระบบ Google เพื่อดูตั๋ว','ตั๋วคาราโอเกะ'],
  ja:['🎟️ カラオケチケット','所持数','チケットを1枚贈る','アイドル名','プレゼントを送る','チケットがありません。','贈りました！ 💖','送信できません。名前と残高を確認してね。','🎟️ チケット付与（運営）','枚数（1–20）','理由','付与する','付与しました！ ✨','付与できませんでした。','残高を一時的に取得できません。','読み込み中...','所持アイテム','毎日の無料5回を使ったあと、チケット1枚で追加のショーを1回楽しめます。','🎰 ガチャ景品','🎁 プレゼント可能','カラオケチケット','Googleでログインすると枚数を確認できます','カラオケチケット']
 };
 function t(n){return (W[window.LANG]||W.pt)[n];}
 var balance=0,ready=false,loading=false,pendingRequest=null,revision=0,profileMessage='',owner=null;
 function enabled(){return !!(window.contaJ&&typeof _supabase!=='undefined'&&_supabase&&typeof window.contaRpc==='function');}
 function currentId(){return window.contaJ&&window.contaJ.id||null;}
 function renderBadge(){var box=document.getElementById('ktHeaderTickets'),count=document.getElementById('ktHeaderTicketNumber');if(!box||!count)return;
  var available=enabled(),shown=available?(ready?String(balance):loading?'…':'—'):'—';count.textContent=shown;
  var label=t(22)+': '+(available?(ready?shown:loading?t(15):t(14)):t(21));box.setAttribute('aria-label',label);box.title=label;box.classList.toggle('tw-has-ticket',available&&ready&&balance>0);
 }
 function updateCards(){if(typeof window.twRankData!=='undefined')window.twRankData.ktTickets=ready?balance:0;renderBadge();if(typeof window.twKaraokeAtualizarCard==='function')window.twKaraokeAtualizarCard();}
 function reset(){revision++;ready=false;loading=false;balance=0;pendingRequest=null;profileMessage='';owner=null;updateCards();renderProfile();}
 function acceptBalance(r){if(!enabled()||!r||!Number.isInteger(r.tickets)||r.tickets<0||r.tickets>99)return refresh();
  revision++;owner=currentId();ready=true;loading=false;balance=r.tickets;updateCards();renderProfile();return Promise.resolve(balance);
 }
 function refresh(){if(!enabled()){reset();return Promise.resolve(0);}var id=currentId();if(owner!==id){owner=id;ready=false;balance=0;pendingRequest=null;profileMessage='';updateCards();}
  var request=++revision;loading=true;renderBadge();renderProfile();
  return window.contaRpc('kt_ticket_wallet').then(function(r){if(request!==revision||id!==currentId()||!enabled())return balance;
   loading=false;ready=!!(r&&r.ok);balance=ready?Math.max(0,Number(r.tickets)||0):0;updateCards();renderProfile();return balance;
  }).catch(function(){if(request!==revision||id!==currentId()||!enabled())return balance;loading=false;ready=false;balance=0;updateCards();renderProfile();return 0;});}
 function requestKey(id){return 'kt_ticket_request_v1:'+String(id||'');}
 function readPending(id){
  try{
   var raw=window.localStorage.getItem(requestKey(id));if(!raw)return null;
   var value=JSON.parse(raw);
   if(typeof value==='string')return {request:value,run:null};
   return value&&typeof value.request==='string'?value:null;
  }catch(e){return null;}
 }
 function savePending(id,request,runId){
  try{window.localStorage.setItem(requestKey(id),JSON.stringify({request:request,run:runId||null}));}catch(e){}
 }
 function clearPending(id,request){
  try{
   var saved=readPending(id);
   if(!request||!saved||saved.request===request)window.localStorage.removeItem(requestKey(id));
  }catch(e){}
  if(owner===id&&(!request||pendingRequest===request))pendingRequest=null;
 }
 function completeRun(runId){
  var id=currentId();if(!id||!runId)return false;
  var saved=readPending(id);
  if(saved&&saved.run===runId){clearPending(id,saved.request);return true;}
  return false;
 }
 function get(){return ready?balance:0;}
 function startExtra(){
  if(!enabled()||!ready)return Promise.resolve({ok:false,reason:'no_ticket'});
  var id=currentId();
  if(owner!==id){owner=id;pendingRequest=null;}
  var saved=readPending(id);
  if(!pendingRequest&&saved)pendingRequest=saved.request;
  if(!pendingRequest&&balance<1)return Promise.resolve({ok:false,reason:'no_ticket'});
  if(!pendingRequest){
   if(!window.crypto||!window.crypto.randomUUID)return Promise.resolve({ok:false,reason:'uuid'});
   pendingRequest=window.crypto.randomUUID();
  }
  var req=pendingRequest;
  savePending(id,req,saved&&saved.request===req?saved.run:null);
  return window.contaRpc('kt_ticket_run_start',{p_request:req}).then(function(r){
   if(id!==currentId()||!enabled())return {ok:false,reason:'account_changed'};
   if(r&&r.ok){
    if(typeof r.run==='string')savePending(id,req,r.run);
    acceptBalance(r);
   }else if(r&&r.reason!=='connection'){
    clearPending(id,req);
    refresh();
   }
   return r;
  });
 }
 function showMsg(id,msg){var box=document.getElementById(id);if(box)box.textContent=msg;}
 function renderProfile(){var box=document.getElementById('ktTicketInventory');if(!box)return;
  var prev=box.querySelector&&box.querySelector('#ktGiftNick'),nickBefore=prev?prev.value:'',status=ready?String(balance):loading?'…':'—';
  box.innerHTML='<div class="tw-ticket-inventory-top"><div class="tw-ticket-inventory-art" aria-hidden="true"><span>🎟️</span><i>✦</i></div>'+
   '<div class="tw-ticket-inventory-title"><small>'+t(16)+'</small><h3>'+t(20)+'</h3><span>Karaoke⭐Time! · カラオケ・タイム</span></div>'+
   '<div class="tw-ticket-inventory-balance" aria-label="'+t(1)+': '+status+'"><b>'+status+'</b><small>/ 99</small></div></div>'+
   '<p class="tw-ticket-inventory-description">'+t(17)+'</p><div class="tw-ticket-inventory-tags"><span>'+t(18)+'</span><span>'+t(19)+'</span></div>'+
   (!ready?'<p class="tw-ticket-inventory-state" role="status">'+(loading?t(15):t(14))+'</p>':'<div class="tw-ticket-gift-form"><label>'+t(2)+'<input id="ktGiftNick" maxlength="24" placeholder="'+t(3)+'" autocomplete="off"></label><button type="button" class="btn alt" id="ktGiftSend"'+(balance<1?' disabled':'')+'>'+t(4)+' 💖</button></div><p class="tw-ticket-inventory-state" id="ktGiftMsg" role="status">'+profileMessage+'</p>');
  var nick=document.getElementById('ktGiftNick');if(nick&&nickBefore)nick.value=nickBefore;
  var btn=document.getElementById('ktGiftSend');if(btn)btn.addEventListener('click',function(){var nick=document.getElementById('ktGiftNick').value.trim();if(!nick||balance<1)return;
   var id=currentId(),startedRevision=revision;btn.disabled=true;window.contaRpc('kt_ticket_gift',{p_nick:nick}).then(function(r){if(id!==currentId()||!enabled())return;
    profileMessage=r&&r.ok?t(6):t(7);if(r&&r.ok){if(startedRevision===revision)acceptBalance(r);else refresh();}else{showMsg('ktGiftMsg',profileMessage);btn.disabled=false;}
   }).catch(function(){if(id!==currentId())return;profileMessage=t(7);showMsg('ktGiftMsg',profileMessage);btn.disabled=false;});
  });
 }
 function renderAdmin(){var box=document.getElementById('ktTicketAdminSlot');if(!box)return;
  box.innerHTML='<h3>'+t(8)+'</h3><div class="admform"><input id="ktGrantNick" maxlength="24" placeholder="'+t(3)+'"><label>'+t(9)+' <input id="ktGrantAmount" type="number" min="1" max="20" value="1"></label><input id="ktGrantReason" maxlength="80" placeholder="'+t(10)+'"><button type="button" class="btn" id="ktGrantSend">'+t(11)+'</button></div><p class="perfdica" id="ktGrantMsg" role="status"></p>';
  document.getElementById('ktGrantSend').addEventListener('click',function(){var btn=this,nick=document.getElementById('ktGrantNick').value.trim(),n=Number(document.getElementById('ktGrantAmount').value);
   if(!nick||!Number.isInteger(n)||n<1||n>20){showMsg('ktGrantMsg',t(13));return;}
   var id=currentId(),request=++revision;btn.disabled=true;window.contaRpc('kt_ticket_admin_grant',{p_nick:nick,p_count:n,p_reason:document.getElementById('ktGrantReason').value.trim()}).then(function(r){if(request!==revision||id!==currentId()||!enabled())return;showMsg('ktGrantMsg',r&&r.ok?t(12):t(13));if(r&&r.ok)refresh();btn.disabled=false;}).catch(function(){if(request!==revision||id!==currentId())return;showMsg('ktGrantMsg',t(13));btn.disabled=false;});
  });
 }
 window.ktTickets={refresh:refresh,reset:reset,acceptBalance:acceptBalance,renderBadge:renderBadge,get:get,ready:function(){return ready;},startExtra:startExtra,completeRun:completeRun,renderProfile:renderProfile,renderAdmin:renderAdmin};
 renderBadge();
})();
