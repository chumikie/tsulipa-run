/* Freeze once, then let the player choose how to keep the photo. No uploads. */
(function(){
 'use strict';
 var labels={
  pt:['Sua foto','Um instante da sala, guardado com carinho. ✨','💗 Compartilhar / salvar','⬇️ Baixar PNG','← Voltar à sala','Fechar foto','Foto da sala capturada neste instante','Preparando sua foto…','No celular, toque e segure a foto; no computador, clique com o botão direito para salvar.','Não consegui preparar a foto. Volte à sala e tente novamente.','Compartilhamento concluído. ✨','Tudo bem! Sua foto continua aqui. 💜','Não consegui abrir as opções do aparelho. Use Baixar PNG ou toque e segure a foto.','Download solicitado. Confira os downloads do navegador.','Sua foto está pronta! ✨', '⬇️ Baixar com moldura'],
  en:['Your photo','A moment in the room, kept with love. ✨','💗 Share / save','⬇️ Download PNG','← Back to the room','Close photo','Room photo captured at this moment','Preparing your photo…','On mobile, touch and hold the photo; on a computer, right-click to save it.','Could not prepare the photo. Return to the room and try again.','Sharing complete. ✨','That’s okay! Your photo is still here. 💜','Could not open sharing options. Download the PNG or touch and hold the photo.','Download requested. Check your browser’s downloads.','Your photo is ready! ✨', '⬇️ Download with frame'],
  es:['Tu foto','Un instante de la sala, guardado con cariño. ✨','💗 Compartir / guardar','⬇️ Descargar PNG','← Volver a la sala','Cerrar foto','Foto de la sala capturada en este instante','Preparando tu foto…','En el móvil, mantén pulsada la foto; en el ordenador, haz clic derecho para guardarla.','No se pudo preparar la foto. Vuelve a la sala e inténtalo otra vez.','Se completó el envío. ✨','¡No pasa nada! Tu foto sigue aquí. 💜','No se pudieron abrir las opciones. Descarga el PNG o mantén pulsada la foto.','Descarga solicitada. Revisa las descargas del navegador.','¡Tu foto está lista! ✨', '⬇️ Descargar con marco'],
  th:['รูปของคุณ','เก็บช่วงเวลาในห้องนี้ด้วยความรัก ✨','💗 แชร์ / บันทึก','⬇️ ดาวน์โหลด PNG','← กลับเข้าห้อง','ปิดรูป','รูปห้องที่ถ่ายในขณะนี้','กำลังเตรียมรูป…','บนมือถือให้แตะรูปค้างไว้ บนคอมพิวเตอร์ให้คลิกขวาเพื่อบันทึก','เตรียมรูปไม่ได้ กลับเข้าห้องแล้วลองอีกครั้ง','แชร์เรียบร้อยแล้ว ✨','ไม่เป็นไร รูปของคุณยังอยู่ที่นี่ 💜','เปิดตัวเลือกแชร์ไม่ได้ ดาวน์โหลด PNG หรือแตะรูปค้างไว้','ขอดาวน์โหลดแล้ว ตรวจสอบรายการดาวน์โหลดในเบราว์เซอร์','รูปของคุณพร้อมแล้ว ✨', '⬇️ ดาวน์โหลดพร้อมกรอบ'],
  ja:['あなたの写真','この部屋の一瞬を、大切な思い出に。✨','💗 共有・保存','⬇️ PNGをダウンロード','← 部屋に戻る','写真を閉じる','この瞬間を写した部屋の写真','写真を準備しています…','スマートフォンでは写真を長押し、パソコンでは右クリックして保存できます。','写真を準備できませんでした。部屋に戻って、もう一度お試しください。','共有しました。✨','大丈夫！写真はここに残っています。💜','共有メニューを開けませんでした。PNGをダウンロードするか、写真を長押ししてください。','ダウンロードを開始しました。ブラウザーのダウンロード一覧をご確認ください。','写真の準備ができました！✨', '⬇️ フレーム付きで保存']
 };
 var dialog,image,print,share,download,frameDownload,back,close,status,active=null,host=null;
 function text(i){var lang=window.KT_LANG?window.KT_LANG():document.documentElement.lang.split('-')[0];return (labels[lang]||labels.pt)[i];}
 function position(){
  if(!dialog)return;
  var top=0,bottom=window.innerHeight;
  try{if(window.parent!==window&&window.frameElement){
   var rect=window.frameElement.getBoundingClientRect();
   top=Math.max(0,-rect.top);bottom=Math.min(bottom,window.parent.innerHeight-rect.top);
  }}catch(e){/* Standalone/cross-origin hosts use this document's viewport. */}
  dialog.style.setProperty('--kt-photo-top',(top+12)+'px');
  dialog.style.setProperty('--kt-photo-max-height',Math.max(120,bottom-top-24)+'px');
 }
 function follow(){if(dialog&&dialog.open)position();}
 function release(leaving){
  var shot=active;if(!shot)return;active=null;
  image.removeAttribute('src');download.removeAttribute('href');frameDownload.removeAttribute('href');
  if(shot.url)URL.revokeObjectURL(shot.url);
  if(shot.frameUrl)URL.revokeObjectURL(shot.frameUrl);
  if(!leaving&&shot.options.onClose)shot.options.onClose();
  if(!leaving&&shot.opener&&shot.opener.isConnected)shot.opener.focus({preventScroll:true});
 }
 function ensure(){
  if(dialog)return;
  dialog=document.createElement('dialog');dialog.id='ktPhotoDialog';dialog.className='kt-photo-dialog tw-window tw-window-surface';
  dialog.setAttribute('aria-labelledby','ktPhotoTitle');dialog.setAttribute('aria-describedby','ktPhotoLede');
  dialog.innerHTML='<button type="button" class="tw-window-control tw-window-close" id="ktPhotoClose">×</button><div class="kt-photo-heading"><h2 class="tw-modal-title" id="ktPhotoTitle"><span id="ktPhotoTitleText"></span><span class="tw-modal-star">⭐</span></h2><small class="tw-modal-jp" lang="ja">カラオケ・タイム</small></div><p class="tw-modal-lede" id="ktPhotoLede"></p><figure class="kt-photo-print" id="ktPhotoPrint" hidden><img id="ktPhotoImage"><figcaption>Karaoke⭐Time! · PNG · 1920 × 1080</figcaption></figure><div class="kt-photo-actions"><button type="button" class="btn" id="ktPhotoShare" hidden></button><a class="btn" id="ktPhotoDownload" target="_blank" rel="noopener" hidden></a><a class="btn alt" id="ktPhotoFrameDownload" target="_blank" rel="noopener" hidden></a><button type="button" class="btn alt" id="ktPhotoBack"></button></div><p class="kt-photo-hint" id="ktPhotoHint"></p><p class="kt-photo-status" id="ktPhotoStatus" role="status" aria-live="polite"></p>';
  document.body.appendChild(dialog);
  image=dialog.querySelector('#ktPhotoImage');print=dialog.querySelector('#ktPhotoPrint');
  image.tabIndex=0;
  share=dialog.querySelector('#ktPhotoShare');download=dialog.querySelector('#ktPhotoDownload');frameDownload=dialog.querySelector('#ktPhotoFrameDownload');
  back=dialog.querySelector('#ktPhotoBack');close=dialog.querySelector('#ktPhotoClose');status=dialog.querySelector('#ktPhotoStatus');
  close.onclick=back.onclick=function(){dialog.close();};
  dialog.addEventListener('cancel',function(e){e.preventDefault();dialog.close();});
  dialog.addEventListener('close',function(){release(false);});
  // Keep keyboard input here. Explicit Tab cycling also covers iframe edges.
  dialog.addEventListener('keydown',function(e){
   if(e.key==='Tab'){
    var items=Array.from(dialog.querySelectorAll('button,a[href],img[tabindex="0"]')).filter(function(el){return !el.disabled&&el.getClientRects().length;});
    var first=items[0],last=items[items.length-1],focus=document.activeElement;
    if(items.length&&e.shiftKey&&(focus===first||!dialog.contains(focus))){e.preventDefault();last.focus();}
    else if(items.length&&!e.shiftKey&&(focus===last||!dialog.contains(focus))){e.preventDefault();first.focus();}
   }
   e.stopPropagation();
  });
  download.addEventListener('click',function(){if(active)status.textContent=text(13);});
  share.onclick=function(){
   var shot=active;if(!shot||!shot.file||shot.busy)return;
   shot.busy=true;share.disabled=true;
   function done(error){
    if(active!==shot)return;
    shot.busy=false;share.disabled=false;
    status.textContent=error?text(error.name==='AbortError'?11:12):text(10);
   }
   // The file is already encoded: call share directly in this user gesture.
   try{Promise.resolve(navigator.share({files:[shot.file],title:'Karaoke⭐Time!'})).then(function(){done();},done);}catch(error){done(error);}
  };
  window.addEventListener('resize',follow);
  try{if(window.parent!==window){host=window.parent;host.addEventListener('resize',follow);host.addEventListener('scroll',follow,{passive:true});}}catch(e){host=null;}
  window.addEventListener('pagehide',function(e){if(!e.persisted){
   if(host){host.removeEventListener('resize',follow);host.removeEventListener('scroll',follow);}
   if(active){release(true);if(dialog.open)dialog.close();}
  }});
 }
 function rounded(ctx,x,y,w,h,r){ctx.beginPath();if(ctx.roundRect)ctx.roundRect(x,y,w,h,r);else ctx.rect(x,y,w,h);}
 function withPolaroid(source){
  var framed=document.createElement('canvas');framed.width=1920;framed.height=1260;
  var ctx=framed.getContext('2d');if(!ctx)throw new Error('frame_context_unavailable');
  var bg=ctx.createLinearGradient(0,0,1920,1260);bg.addColorStop(0,'#fff9fd');bg.addColorStop(.52,'#f5efff');bg.addColorStop(1,'#fff4ed');ctx.fillStyle=bg;ctx.fillRect(0,0,1920,1260);
  ctx.save();ctx.shadowColor='rgba(49,25,78,.22)';ctx.shadowBlur=26;ctx.shadowOffsetY=12;rounded(ctx,34,24,1852,1212,24);ctx.fillStyle='#fffdfb';ctx.fill();ctx.restore();
  ctx.save();rounded(ctx,76,64,1768,992,14);ctx.clip();ctx.drawImage(source,76,64,1768,992);ctx.restore();
  ctx.strokeStyle='rgba(123,63,155,.18)';ctx.lineWidth=3;rounded(ctx,76,64,1768,992,14);ctx.stroke();
  ctx.save();ctx.translate(130,53);ctx.rotate(-.075);ctx.fillStyle='rgba(255,159,210,.64)';rounded(ctx,-48,-11,96,22,4);ctx.fill();ctx.restore();
  ctx.save();ctx.translate(1790,53);ctx.rotate(.075);ctx.fillStyle='rgba(180,210,255,.68)';rounded(ctx,-48,-11,96,22,4);ctx.fill();ctx.restore();
  ctx.textAlign='center';ctx.fillStyle='#593b79';ctx.font='800 44px "M PLUS Rounded 1c",sans-serif';ctx.fillText('Karaoke⭐Time!',960,1132);
  ctx.fillStyle='#9276a8';ctx.font='600 23px "M PLUS Rounded 1c",sans-serif';ctx.fillText('TsuLiPa⭐World  ·  um instante da nossa sala',960,1178);
  ctx.fillStyle='#e58cba';ctx.font='30px sans-serif';ctx.fillText('✦   ♡   ✧   ♡   ✦',960,1222);
  return framed;
 }
 function capture(source,options){
  options=options||{};if(active)return false;
  try{
   // Copy synchronously before opening or pausing anything. toBlob works on
   // this private canvas, never on the room which continues to animate.
   var frozen=document.createElement('canvas');frozen.width=1920;frozen.height=1080;
   var ctx=frozen.getContext('2d');if(!ctx)throw new Error('photo_context_unavailable');
   ctx.drawImage(source,0,0,1920,1080);ensure();
   var shot={options:options,opener:options.opener||document.activeElement,url:null,file:null,busy:false};active=shot;
   dialog.querySelector('#ktPhotoTitleText').textContent=text(0);dialog.querySelector('#ktPhotoLede').textContent=text(1);
   share.textContent=text(2);download.textContent=text(3);back.textContent=text(4);close.setAttribute('aria-label',text(5));image.alt=text(6);
   dialog.querySelector('#ktPhotoHint').textContent=text(8);status.textContent=text(7);
   print.hidden=true;share.hidden=true;download.hidden=true;frameDownload.hidden=true;share.disabled=false;
   position();dialog.showModal();if(options.onOpen)options.onOpen();close.focus({preventScroll:true});
   frozen.toBlob(function(blob){
    if(active!==shot)return;
    if(!blob){status.textContent=text(9);return;}
    try{
    shot.url=URL.createObjectURL(blob);image.src=shot.url;print.hidden=false;
    var stamp=new Date().toISOString().replace(/[:.]/g,'-'),name='TsuLiPa_Karaoke_1920x1080_'+stamp+'.png';
    download.href=shot.url;download.download=name;download.hidden=false;
    var canShare=false;
    try{shot.file=new File([blob],name,{type:'image/png'});canShare=typeof navigator.share==='function'&&typeof navigator.canShare==='function'&&navigator.canShare({files:[shot.file]});}catch(e){}
    share.hidden=!canShare;download.classList.toggle('alt',canShare);
    frameDownload.textContent=text(15);
    try{var framed=withPolaroid(frozen);framed.toBlob(function(frameBlob){if(active!==shot||!frameBlob)return;shot.frameUrl=URL.createObjectURL(frameBlob);frameDownload.href=shot.frameUrl;frameDownload.download=name.replace('.png','_polaroid.png');frameDownload.hidden=false;},'image/png');}catch(frameError){frameDownload.hidden=true;}
    status.textContent=text(14);position();
    }catch(error){
     if(shot.url)URL.revokeObjectURL(shot.url);shot.url=null;
     image.removeAttribute('src');download.removeAttribute('href');frameDownload.removeAttribute('href');
     print.hidden=true;share.hidden=true;download.hidden=true;frameDownload.hidden=true;status.textContent=text(9);
    }
   },'image/png');
   return true;
  }catch(error){
   if(dialog&&dialog.open)dialog.close();release();
   if(options.onError)options.onError(error);return false;
  }
 }
 window.KaraokeRoomPhoto={capture:capture};
})();
