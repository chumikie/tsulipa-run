(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeRoomPolaroid=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(deps){
  if(!deps||!deps.document||typeof deps.makeCharacter!=='function'||typeof deps.drawIdol!=='function'||typeof deps.getTime!=='function')throw new TypeError('KaraokeRoomPolaroid needs explicit avatar and renderer dependencies');
  var d=deps.document,posterDialog=null,activeOpener=null,saveLink=null,saveUrl=null;
  function releaseSave(){if(saveUrl){URL.revokeObjectURL(saveUrl);saveUrl=null;}if(saveLink){saveLink.removeAttribute('href');saveLink.hidden=true;}}
  function position(){
   if(!posterDialog)return;
   var top=0,bottom=Number(root.innerHeight)||Number(d.documentElement&&d.documentElement.clientHeight)||620;
   try{if(root.parent&&root.parent!==root&&root.frameElement){var rect=root.frameElement.getBoundingClientRect();top=Math.max(0,-rect.top);bottom=Math.min(bottom,root.parent.innerHeight-rect.top);}}catch(e){}
   posterDialog.style.setProperty('--kt-poster-top',(top+12)+'px');
   posterDialog.style.setProperty('--kt-poster-max-height',Math.max(120,bottom-top-24)+'px');
  }
  function follow(){if(posterDialog&&posterDialog.open)position();}
  function open(person,index,opener){
   if(!person||!person.avatar)return false;
   var avatar=person.avatar,char=deps.makeCharacter(person,index);
   if(!char)return false;
   activeOpener=opener||d.activeElement;
   if(!posterDialog){
    posterDialog=d.createElement('dialog');posterDialog.id='ktPosterDialog';posterDialog.className='kt-poster-dialog tw-window tw-window-surface';
    posterDialog.setAttribute('aria-labelledby','ktPosterTitle');
    posterDialog.innerHTML='<button type="button" class="tw-window-control tw-window-close" id="ktPosterClose" aria-label="Fechar retrato">×</button><div class="kt-poster-heading"><h2 id="ktPosterTitle"></h2><small lang="ja">メンバー・ポラロイド</small></div><canvas id="ktPosterPortrait" width="520" height="620" role="img"></canvas><div class="kt-poster-actions"><a class="btn" id="ktPosterSave" hidden download>⬇️ Salvar retrato</a></div><p class="kt-poster-caption">Karaoke⭐Time! · TsuLiPa⭐World</p>';
    d.body.appendChild(posterDialog);
    posterDialog.querySelector('#ktPosterClose').onclick=function(){posterDialog.close();};
    posterDialog.addEventListener('close',function(){releaseSave();if(activeOpener&&activeOpener.isConnected)activeOpener.focus({preventScroll:true});});
   }
   var title=posterDialog.querySelector('#ktPosterTitle'),canvas=posterDialog.querySelector('#ktPosterPortrait'),ctx=canvas.getContext('2d');
   saveLink=posterDialog.querySelector('#ktPosterSave');releaseSave();
   if(!ctx)return false;
   title.textContent=String(person.nick||'Idol');canvas.setAttribute('aria-label','Retrato ampliado de '+String(person.nick||'Idol'));
   ctx.clearRect(0,0,520,620);var bg=ctx.createLinearGradient(0,35,520,520);bg.addColorStop(0,'#ff4fb8');bg.addColorStop(.34,'#9137ee');bg.addColorStop(.68,'#385fe9');bg.addColorStop(1,'#20cfe0');
   ctx.fillStyle='#fffafc';ctx.fillRect(12,12,496,596);ctx.fillStyle=bg;ctx.fillRect(38,38,444,470);
   // Discoteca Idol: fachos diagonais, halos coloridos e pontos de luz preservam o retrato no centro.
   ctx.save();ctx.globalAlpha=.32;var beams=[[-20,35,185,508,'#ffe17a'],[160,30,355,508,'#ff8bd5'],[345,25,535,508,'#8df6ff']];
   for(var beam=0;beam<beams.length;beam++){var ray=beams[beam],light=ctx.createLinearGradient(ray[0],ray[1],ray[2],ray[3]);light.addColorStop(0,ray[4]);light.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(ray[0],ray[1]);ctx.lineTo(ray[0]+90,ray[1]);ctx.lineTo(ray[2]+42,ray[3]);ctx.lineTo(ray[2]-42,ray[3]);ctx.closePath();ctx.fill();}ctx.restore();
   var discoColors=['#fff08a','#ff9de0','#8ff7ff','#c9a4ff'];for(var dot=0;dot<22;dot++){var dx=55+(dot*67)%410,dy=58+(dot*89)%420,glow=ctx.createRadialGradient(dx,dy,0,dx,dy,18);glow.addColorStop(0,discoColors[dot%4]);glow.addColorStop(.24,discoColors[dot%4]);glow.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=glow;ctx.fillRect(dx-18,dy-18,36,36);}
   ctx.save();ctx.globalAlpha=.75;ctx.strokeStyle='rgba(255,255,255,.58)';ctx.lineWidth=2;for(var ring=0;ring<3;ring++){ctx.beginPath();ctx.arc(425,100,27+ring*10,0,Math.PI*2);ctx.stroke();}ctx.restore();
   ctx.save();ctx.globalAlpha=.62;ctx.fillStyle='#fff';for(var star=0;star<26;star++){var sx=48+(star*83)%425,sy=48+(star*97)%440;ctx.beginPath();ctx.arc(sx,sy,1.8+(star%3),0,Math.PI*2);ctx.fill();}ctx.restore();
   ctx.save();ctx.fillStyle='rgba(0,0,0,.18)';ctx.beginPath();ctx.ellipse(260,476,112,15,0,0,Math.PI*2);ctx.fill();ctx.restore();
   deps.drawIdol(ctx,char,260,405,5.8,avatar.pose||'v',Number.isFinite(+avatar.expr)?+avatar.expr:2,deps.getTime(),false,{andando:false});
   ctx.fillStyle='#593b79';ctx.textAlign='center';ctx.font='800 28px "M PLUS Rounded 1c",sans-serif';ctx.fillText(String(person.nick||'Idol').slice(0,24),260,560,430);
   ctx.fillStyle='#d88ab7';ctx.font='22px sans-serif';ctx.fillText('✦  ♡  ✧  ♡  ✦',260,592);
   if(!posterDialog.open)posterDialog.showModal();position();
   var stamp=new Date().toISOString().replace(/[:.]/g,'-');
   try{canvas.toBlob(function(blob){if(!blob||!posterDialog||!posterDialog.open||!saveLink)return;releaseSave();saveUrl=URL.createObjectURL(blob);saveLink.href=saveUrl;saveLink.download='TsuLiPa_Karaoke_Polaroid_'+stamp+'.png';saveLink.hidden=false;},'image/png');}catch(error){saveLink.hidden=true;}
   return true;
  }
  return Object.freeze({open:open});
 }
 return Object.freeze({create:create});
});
