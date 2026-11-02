(function(root,factory){
 'use strict';
 var api=factory(root);
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeRoomPolaroid=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
 'use strict';
 var PALETTES=[
  {colors:['#ff4fb8','#9137ee','#385fe9','#20cfe0'],beams:['#ffe17a','#ff8bd5','#8df6ff'],sparkles:['💖','✨','🎵','🌟','💫','🎀']},
  {colors:['#ff9b75','#ff5eaa','#9b52e8','#ffe28a'],beams:['#fff0a8','#ff8db9','#bca2ff'],sparkles:['🌸','💗','🎤','✨','⭐','🫧']},
  {colors:['#35d6c4','#3287ec','#7453dc','#d8ff9e'],beams:['#d8ff9e','#8df7ff','#b7a5ff'],sparkles:['🩵','🌈','🎶','💎','✨','⭐']},
  {colors:['#ffc857','#ff7eb6','#a855f7','#5fd8e8'],beams:['#fff0a8','#ff9ed2','#8ff7ff'],sparkles:['🌟','💛','🎀','✨','💖','🎵']},
  {colors:['#8f7aff','#44b6ff','#35dfc3','#ffb9e7'],beams:['#e7d9ff','#9ceaff','#9fffe1'],sparkles:['🦋','💜','🎤','🌟','✨','💫']},
  {colors:['#ff78d2','#8f4bff','#5f6eff','#ffd36b'],beams:['#ffc4ec','#c4a1ff','#9feaff'],sparkles:['🎧','💞','⭐','✨','🌙','🎵']}
 ];
 var POSES=['coracao','banzai','neon','luz','coracao','banzai'];
 var EXPRESSIONS=[3,0,3,0,3,0];
 function create(deps){
  if(!deps||!deps.document||typeof deps.makeCharacter!=='function'||typeof deps.drawIdol!=='function'||typeof deps.getTime!=='function')throw new TypeError('KaraokeRoomPolaroid needs explicit avatar and renderer dependencies');
  var d=deps.document,host=deps.window||root,URLApi=deps.URL||host.URL||root.URL;
  var posterDialog=null,activeOpener=null,saveLink=null,saveUrl=null,saveGeneration=0;
  function releaseSave(){
   saveGeneration++;
   if(saveUrl&&URLApi&&typeof URLApi.revokeObjectURL==='function'){URLApi.revokeObjectURL(saveUrl);saveUrl=null;}
   if(saveLink){saveLink.removeAttribute('href');saveLink.hidden=true;}
  }
  function position(){
   if(!posterDialog)return;
   var top=0,bottom=Number(host.innerHeight)||Number(d.documentElement&&d.documentElement.clientHeight)||620;
   try{
    if(host.parent&&host.parent!==host&&host.frameElement){
     var rect=host.frameElement.getBoundingClientRect();
     top=Math.max(0,-rect.top);
     bottom=Math.min(bottom,host.parent.innerHeight-rect.top);
    }
   }catch(e){}
   posterDialog.style.setProperty('--kt-poster-top',(top+12)+'px');
   posterDialog.style.setProperty('--kt-poster-max-height',Math.max(120,bottom-top-24)+'px');
  }
  function follow(){if(posterDialog&&posterDialog.open)position();}
  function open(person,index,opener){
   if(!person||!person.avatar)return false;
   var posterIndex=((Math.floor(Number(index)||0)%6)+6)%6,palette=PALETTES[posterIndex];
   var avatar=person.avatar,char=deps.makeCharacter(person,posterIndex);
   if(!char)return false;
   activeOpener=opener||d.activeElement;
   if(!posterDialog){
    posterDialog=d.createElement('dialog');posterDialog.id='ktPosterDialog';posterDialog.className='kt-poster-dialog tw-window tw-window-surface';
    posterDialog.setAttribute('aria-labelledby','ktPosterTitle');
    posterDialog.innerHTML='<button type="button" class="tw-window-control tw-window-close" id="ktPosterClose" aria-label="Fechar retrato">×</button><div class="kt-poster-heading"><h2 id="ktPosterTitle"></h2><small lang="ja">メンバー・ポラロイド</small></div><canvas id="ktPosterPortrait" width="520" height="620" role="img"></canvas><div class="kt-poster-actions"><a class="btn" id="ktPosterSave" hidden download>⬇️ Salvar retrato</a></div><p class="kt-poster-caption">Karaoke⭐Time! · TsuLiPa⭐World</p>';
    d.body.appendChild(posterDialog);
    posterDialog.querySelector('#ktPosterClose').onclick=function(){posterDialog.close();};
    posterDialog.addEventListener('close',function(){releaseSave();if(activeOpener&&activeOpener.isConnected)activeOpener.focus({preventScroll:true});});
    host.addEventListener('resize',follow,{passive:true});
    host.addEventListener('scroll',follow,{passive:true,capture:true});
   }
   var title=posterDialog.querySelector('#ktPosterTitle'),canvas=posterDialog.querySelector('#ktPosterPortrait'),ctx=canvas.getContext('2d');
   saveLink=posterDialog.querySelector('#ktPosterSave');releaseSave();
   if(!ctx)return false;
   title.textContent=String(person.nick||'Idol');canvas.setAttribute('aria-label','Retrato ampliado de '+String(person.nick||'Idol'));
   ctx.clearRect(0,0,520,620);
   var bg=ctx.createLinearGradient(0,35,520,520);
   bg.addColorStop(0,palette.colors[0]);bg.addColorStop(.34,palette.colors[1]);bg.addColorStop(.68,palette.colors[2]);bg.addColorStop(1,palette.colors[3]);
   ctx.fillStyle='#fffafc';ctx.fillRect(12,12,496,596);ctx.fillStyle=bg;ctx.fillRect(38,38,444,470);
   // Discoteca Idol: feixes diagonais, halos coloridos e pontos de luz próprios de cada uma das seis fotos.
   ctx.save();ctx.globalAlpha=.32;
   var beams=[[-20,35,185,508],[160,30,355,508],[345,25,535,508]];
   for(var beam=0;beam<beams.length;beam++){
    var ray=beams[beam],light=ctx.createLinearGradient(ray[0],ray[1],ray[2],ray[3]);
    light.addColorStop(0,palette.beams[beam]);light.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=light;ctx.beginPath();ctx.moveTo(ray[0],ray[1]);ctx.lineTo(ray[0]+90,ray[1]);
    ctx.lineTo(ray[2]+42,ray[3]);ctx.lineTo(ray[2]-42,ray[3]);ctx.closePath();ctx.fill();
   }
   ctx.restore();
   for(var dot=0;dot<22;dot++){
    var dx=55+(dot*67)%410,dy=58+(dot*89)%420,glow=ctx.createRadialGradient(dx,dy,0,dx,dy,18);
    glow.addColorStop(0,palette.beams[dot%3]);glow.addColorStop(.24,palette.beams[dot%3]);glow.addColorStop(1,'rgba(255,255,255,0)');
    ctx.fillStyle=glow;ctx.fillRect(dx-18,dy-18,36,36);
   }
   ctx.save();ctx.globalAlpha=.75;ctx.strokeStyle='rgba(255,255,255,.64)';ctx.lineWidth=2;
   for(var ring=0;ring<3;ring++){ctx.beginPath();ctx.arc(425,100,27+ring*10,0,Math.PI*2);ctx.stroke();}
   ctx.restore();
   ctx.save();ctx.globalAlpha=.72;ctx.fillStyle='#fff';
   for(var star=0;star<26;star++){var sx=48+(star*83)%425,sy=48+(star*97)%440;ctx.beginPath();ctx.arc(sx,sy,1.8+(star%3),0,Math.PI*2);ctx.fill();}
   ctx.restore();
   // A sombra encosta nos pés: o personagem fica apoiado no chão, não suspenso no meio da foto.
   ctx.save();ctx.fillStyle='rgba(0,0,0,.20)';ctx.beginPath();ctx.ellipse(260,476,132,12,0,0,Math.PI*2);ctx.fill();ctx.restore();
   deps.drawIdol(ctx,char,260,470,7.8,POSES[posterIndex],EXPRESSIONS[posterIndex],Number(deps.getTime())||0,false,{andando:false});
   // Emojis e brilhos em volta do corpo, sem cobrir o rosto ou o figurino.
   var stickers=[[76,112],[444,132],[72,352],[448,374],[122,448],[398,450]];
   ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='24px "Apple Color Emoji","Segoe UI Emoji",sans-serif';
   for(var sticker=0;sticker<stickers.length;sticker++){
    var point=stickers[sticker];ctx.globalAlpha=sticker%2?.9:.98;ctx.shadowColor=palette.beams[sticker%3];ctx.shadowBlur=10;
    ctx.fillText(palette.sparkles[sticker],point[0],point[1]);
   }
   ctx.restore();
   ctx.fillStyle='#593b79';ctx.textAlign='center';ctx.font='800 28px "M PLUS Rounded 1c",sans-serif';ctx.fillText(String(person.nick||'Idol').slice(0,24),260,560,430);
   ctx.fillStyle='#d88ab7';ctx.font='22px sans-serif';ctx.fillText('✦  ♡  ✧  ♡  ✦',260,592);
   if(!posterDialog.open)posterDialog.showModal();
   position();
   var stamp=new Date().toISOString().replace(/[:.]/g,'-'),filename='TsuLiPa_Karaoke_Polaroid_'+stamp+'.png',generation=++saveGeneration;
   function showDataUrl(){
    if(generation!==saveGeneration||!posterDialog||!posterDialog.open||!saveLink)return false;
    try{
     if(typeof canvas.toDataURL!=='function')throw new Error('PNG export is unavailable');
     var dataUrl=canvas.toDataURL('image/png');
     if(!/^data:image\/png(?:;|,)/i.test(dataUrl))throw new Error('Canvas did not return a PNG data URL');
     saveLink.href=dataUrl;saveLink.download=filename;saveLink.hidden=false;return true;
    }catch(error){saveLink.hidden=true;return false;}
   }
   function showBlob(blob){
    if(generation!==saveGeneration||!posterDialog||!posterDialog.open||!saveLink)return;
    if(blob&&URLApi&&typeof URLApi.createObjectURL==='function'){
     try{saveUrl=URLApi.createObjectURL(blob);saveLink.href=saveUrl;saveLink.download=filename;saveLink.hidden=false;return;}catch(error){}
    }
    showDataUrl();
   }
   try{if(typeof canvas.toBlob==='function')canvas.toBlob(showBlob,'image/png');else showDataUrl();}
   catch(error){showDataUrl();}
   return true;
  }
  return Object.freeze({open:open});
 }
 return Object.freeze({create:create});
});
