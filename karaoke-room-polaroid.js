(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeRoomPolaroid=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(deps){
  if(!deps||!deps.document||typeof deps.makeCharacter!=='function'||typeof deps.drawIdol!=='function'||typeof deps.getTime!=='function')throw new TypeError('KaraokeRoomPolaroid needs explicit avatar and renderer dependencies');
  var d=deps.document,posterDialog=null,activeOpener=null;
  function open(person,index,opener){
   if(!person||!person.avatar)return false;
   var avatar=person.avatar,char=deps.makeCharacter(person,index);
   if(!char)return false;
   activeOpener=opener||d.activeElement;
   if(!posterDialog){
    posterDialog=d.createElement('dialog');posterDialog.id='ktPosterDialog';posterDialog.className='kt-poster-dialog tw-window tw-window-surface';
    posterDialog.setAttribute('aria-labelledby','ktPosterTitle');
    posterDialog.innerHTML='<button type="button" class="tw-window-control tw-window-close" id="ktPosterClose" aria-label="Fechar retrato">×</button><div class="kt-poster-heading"><h2 id="ktPosterTitle"></h2><small lang="ja">メンバー・ポラロイド</small></div><canvas id="ktPosterPortrait" width="520" height="620" role="img"></canvas><p class="kt-poster-caption">Karaoke⭐Time! · TsuLiPa⭐World</p>';
    d.body.appendChild(posterDialog);
    posterDialog.querySelector('#ktPosterClose').onclick=function(){posterDialog.close();};
    posterDialog.addEventListener('close',function(){if(activeOpener&&activeOpener.isConnected)activeOpener.focus({preventScroll:true});});
   }
   var title=posterDialog.querySelector('#ktPosterTitle'),canvas=posterDialog.querySelector('#ktPosterPortrait'),ctx=canvas.getContext('2d');
   if(!ctx)return false;
   title.textContent=String(person.nick||'Idol');canvas.setAttribute('aria-label','Retrato ampliado de '+String(person.nick||'Idol'));
   ctx.clearRect(0,0,520,620);var bg=ctx.createLinearGradient(0,35,520,520);bg.addColorStop(0,'#302047');bg.addColorStop(.55,'#62427f');bg.addColorStop(1,'#2e355e');
   ctx.fillStyle='#fffafc';ctx.fillRect(12,12,496,596);ctx.fillStyle=bg;ctx.fillRect(38,38,444,470);
   ctx.save();ctx.globalAlpha=.24;ctx.fillStyle='#fff';for(var star=0;star<18;star++){var sx=58+(star*83)%405,sy=58+(star*97)%420;ctx.beginPath();ctx.arc(sx,sy,1.8+(star%3),0,Math.PI*2);ctx.fill();}ctx.restore();
   ctx.save();ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(260,476,112,15,0,0,Math.PI*2);ctx.fill();ctx.restore();
   deps.drawIdol(ctx,char,260,405,5.8,avatar.pose||'v',Number.isFinite(+avatar.expr)?+avatar.expr:2,deps.getTime(),false,{andando:false});
   ctx.fillStyle='#593b79';ctx.textAlign='center';ctx.font='800 28px "M PLUS Rounded 1c",sans-serif';ctx.fillText(String(person.nick||'Idol').slice(0,24),260,560,430);
   ctx.fillStyle='#d88ab7';ctx.font='22px sans-serif';ctx.fillText('✦  ♡  ✧  ♡  ✦',260,592);
   if(!posterDialog.open)posterDialog.showModal();return true;
  }
  return Object.freeze({open:open});
 }
 return Object.freeze({create:create});
});
