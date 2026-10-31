/* Karaoke⭐Time! — interface das carteiras (servidor sempre autoritativo).
   A RPC só existe depois da aprovação e aplicação da proposta SQL. */
(function(){
 'use strict';
 var W={
  pt:['🎟️ Tickets de Karaoke','Saldo','Presentear 1 ticket','Nick do Idol','Enviar presente','Sem tickets disponíveis.','Presente enviado! 💖','Não foi possível enviar. Confira o nick e o saldo.','🎟️ Conceder tickets (moderação)','Quantidade (1–20)','Motivo','Conceder','Tickets concedidos! ✨','Não foi possível conceder os tickets.','Aguardando ativação dos tickets no servidor.','Preparando...'],
  en:['🎟️ Karaoke tickets','Balance','Gift 1 ticket','Idol nickname','Send gift','No tickets available.','Gift sent! 💖','Could not send. Check nickname and balance.','🎟️ Grant tickets (moderation)','Amount (1–20)','Reason','Grant','Tickets granted! ✨','Could not grant tickets.','Waiting for tickets to be enabled on the server.','Loading...'],
  es:['🎟️ Tickets de Karaoke','Saldo','Regalar 1 ticket','Nick del Idol','Enviar regalo','No tienes tickets.','¡Regalo enviado! 💖','No se pudo enviar. Revisa el nick y el saldo.','🎟️ Conceder tickets (moderación)','Cantidad (1–20)','Motivo','Conceder','¡Tickets concedidos! ✨','No se pudieron conceder los tickets.','Esperando la activación en el servidor.','Cargando...'],
  th:['🎟️ ตั๋วคาราโอเกะ','ยอดคงเหลือ','ส่งตั๋ว 1 ใบเป็นของขวัญ','ชื่อไอดอล','ส่งของขวัญ','ไม่มีตั๋วเหลือ','ส่งของขวัญแล้ว! 💖','ส่งไม่สำเร็จ ตรวจชื่อและยอดตั๋ว','🎟️ มอบตั๋ว (ผู้ดูแล)','จำนวน (1–20)','เหตุผล','มอบตั๋ว','มอบตั๋วแล้ว! ✨','มอบตั๋วไม่สำเร็จ','รอเปิดใช้งานตั๋วบนเซิร์ฟเวอร์','กำลังโหลด...'],
  ja:['🎟️ カラオケチケット','所持数','チケットを1枚贈る','アイドル名','プレゼントを送る','チケットがありません。','贈りました！ 💖','送信できません。名前と残高を確認してね。','🎟️ チケット付与（運営）','枚数（1–20）','理由','付与する','付与しました！ ✨','付与できませんでした。','サーバーでのチケット有効化待ちです。','読み込み中...']
 };
 function t(n){return (W[window.LANG]||W.pt)[n];}
 var balance=0,ready=false,pendingRequest=null;
 function enabled(){return !!(window.contaJ&&typeof _supabase!=='undefined'&&_supabase&&typeof window.contaRpc==='function');}
 function updateCards(){if(typeof window.twRankData!=='undefined')window.twRankData.ktTickets=ready?balance:0;if(typeof window.twKaraokeAtualizarCard==='function')window.twKaraokeAtualizarCard();}
 function refresh(){if(!enabled()){ready=false;balance=0;updateCards();return Promise.resolve(0);}
  return window.contaRpc('kt_ticket_wallet').then(function(r){ready=!!(r&&r.ok);balance=ready?Math.max(0,Number(r.tickets)||0):0;updateCards();renderProfile();return balance;}).catch(function(){ready=false;balance=0;updateCards();renderProfile();return 0;});}
 function get(){return ready?balance:0;}
 function startExtra(){
  if(!enabled()||!ready||balance<1)return Promise.resolve({ok:false,reason:'no_ticket'});
  if(!pendingRequest){if(!window.crypto||!window.crypto.randomUUID)return Promise.resolve({ok:false,reason:'uuid'});pendingRequest=window.crypto.randomUUID();}
  return window.contaRpc('kt_ticket_run_start',{p_request:pendingRequest}).then(function(r){
   if(r&&r.ok){pendingRequest=null;if(Number.isFinite(+r.tickets)){balance=+r.tickets;updateCards();}else refresh();}
   else if(r&&r.reason!=='connection')pendingRequest=null;
   return r;
  });
 }
 function showMsg(id,msg){var box=document.getElementById(id);if(box)box.textContent=msg;}
 function renderProfile(){var box=document.getElementById('ktTicketInventory');if(!box)return;
  box.innerHTML='<h3>'+t(0)+'</h3><p class="perfdica">'+(ready?t(1)+': <strong>'+balance+'/99</strong>':t(14))+'</p>'+
   (ready?'<div class="admform"><label>'+t(2)+' <input id="ktGiftNick" maxlength="24" placeholder="'+t(3)+'" autocomplete="off"></label><button type="button" class="btn alt" id="ktGiftSend"'+(balance<1?' disabled':'')+'>'+t(4)+'</button></div><p class="perfdica" id="ktGiftMsg" role="status"></p>':'');
  var btn=document.getElementById('ktGiftSend');if(btn)btn.addEventListener('click',function(){var nick=document.getElementById('ktGiftNick').value.trim();if(!nick||balance<1)return;
   btn.disabled=true;window.contaRpc('kt_ticket_gift',{p_nick:nick}).then(function(r){showMsg('ktGiftMsg',r&&r.ok?t(6):t(7));if(r&&r.ok)refresh();else btn.disabled=false;}).catch(function(){showMsg('ktGiftMsg',t(7));btn.disabled=false;});
  });
 }
 function renderAdmin(){var box=document.getElementById('ktTicketAdminSlot');if(!box)return;
  box.innerHTML='<h3>'+t(8)+'</h3><div class="admform"><input id="ktGrantNick" maxlength="24" placeholder="'+t(3)+'"><label>'+t(9)+' <input id="ktGrantAmount" type="number" min="1" max="20" value="1"></label><input id="ktGrantReason" maxlength="80" placeholder="'+t(10)+'"><button type="button" class="btn" id="ktGrantSend">'+t(11)+'</button></div><p class="perfdica" id="ktGrantMsg" role="status"></p>';
  document.getElementById('ktGrantSend').addEventListener('click',function(){var btn=this,nick=document.getElementById('ktGrantNick').value.trim(),n=Number(document.getElementById('ktGrantAmount').value);
   if(!nick||!Number.isInteger(n)||n<1||n>20){showMsg('ktGrantMsg',t(13));return;}
   btn.disabled=true;window.contaRpc('kt_ticket_admin_grant',{p_nick:nick,p_count:n,p_reason:document.getElementById('ktGrantReason').value.trim()}).then(function(r){showMsg('ktGrantMsg',r&&r.ok?t(12):t(13));btn.disabled=false;}).catch(function(){showMsg('ktGrantMsg',t(14));btn.disabled=false;});
  });
 }
 window.ktTickets={refresh:refresh,get:get,ready:function(){return ready;},startExtra:startExtra,renderProfile:renderProfile,renderAdmin:renderAdmin};
})();
