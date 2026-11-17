/* Only adapt the embedded room's viewport. Existing canvas drawing, input
   coordinates, sound and photo handlers remain attached to the same nodes. */
(function(){
 'use strict';
 if(!document.documentElement.classList.contains('kt-no-site'))return;
 var room=document.getElementById('krPalco'),canvas=document.getElementById('krCv');
 var sound=document.getElementById('krMute'),photo=document.getElementById('ktFoto');
 var pause=document.getElementById('ktPause'),timing=document.getElementById('ktCalibration');
 if(!room||!canvas||!sound||!photo||!pause||!timing)return;
 var mobile=window.matchMedia('(max-width:620px)');
 var ritmo=document.querySelector('.kt-rhythm-controls');   // 17/11: Trilha e Jogar flutuam sobre a sala em tela cheia
 var nodes=[canvas,sound,pause,timing,photo].concat(ritmo?[ritmo]:[]);
 var anchors=nodes.map(function(node){
  var anchor=document.createComment('Karaoke room original position');
  node.parentNode.insertBefore(anchor,node);return anchor;
 });
 var viewport=document.createElement('div'),tools=document.createElement('div');
 // 17/11: o placar saiu da parede da sala; o ranking da semana fica a um toque, logo abaixo da sala
 var ranks=document.createElement('button');ranks.type='button';ranks.className='krb kt-room-ranks';ranks.textContent='🏆';
 ranks.setAttribute('aria-label',(window.ktTr||function(t){return t;})('As estrelas da semana'));
 ranks.addEventListener('click',function(){var r=document.getElementById('ktWeeklyRanks');if(r)r.scrollIntoView({behavior:'smooth',block:'start'});});
 viewport.className='kt-room-viewport';tools.className='kt-room-tools';
 tools.setAttribute('role','group');
 var tr=window.ktTr||function(text){return text;};
 tools.setAttribute('aria-label',tr('Som')+' · '+tr('Pausar')+' · '+tr('Ajustar timing')+' · '+tr('Tirar foto da cena'));
 function sync(){
  if(mobile.matches){
   if(viewport.parentNode)return;
   room.insertBefore(viewport,anchors[0]);room.insertBefore(tools,viewport);
   viewport.appendChild(canvas);tools.appendChild(sound);tools.appendChild(pause);tools.appendChild(timing);tools.appendChild(photo);tools.appendChild(ranks);
   if(ritmo)room.insertBefore(ritmo,tools);
   room.classList.add('kt-room-mobile');
  }else{
   if(!viewport.parentNode)return;
   nodes.forEach(function(node,i){anchors[i].parentNode.insertBefore(node,anchors[i]);});
   viewport.remove();tools.remove();room.classList.remove('kt-room-mobile');
  }
 }
 // 17/11: no celular a sala fica em tela cheia com corte centrado; arrastar para o lado mostra o resto (janela, cardápio).
 // Um toque sem arrasto continua sendo um toque na sala (repassado ao canvas no soltar). No show e em "Ver sala inteira" não mexe.
 var pan=0,drag=null,repassando=false;
 function panLivre(){return mobile.matches&&!document.body.classList.contains('kt-mobile-overview')&&!document.body.classList.contains('kt-playing');}
 function panAplicar(){var L=Math.max(0,(canvas.getBoundingClientRect().width-viewport.getBoundingClientRect().width)/2);pan=Math.max(-L,Math.min(L,pan));canvas.style.setProperty('--kt-pan',pan+'px');}
 viewport.addEventListener('pointerdown',function(e){
  if(repassando||e.target!==canvas||!panLivre())return;
  e.stopPropagation();drag={x:e.clientX,y:e.clientY,p:pan,id:e.pointerId,tipo:e.pointerType,moveu:false};
 },true);
 viewport.addEventListener('pointermove',function(e){
  if(!drag||e.pointerId!==drag.id)return;var dx=e.clientX-drag.x;
  if(!drag.moveu&&Math.abs(dx)>8&&Math.abs(dx)>Math.abs(e.clientY-drag.y)){drag.moveu=true;try{viewport.setPointerCapture(e.pointerId);}catch(_){}}
  if(drag.moveu){pan=drag.p+dx;panAplicar();}
 });
 function soltar(e){
  if(!drag||e.pointerId!==drag.id)return;var d=drag;drag=null;
  if(!d.moveu&&e.type==='pointerup'){repassando=true;try{canvas.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true,cancelable:true,clientX:d.x,clientY:d.y,pointerId:d.id,pointerType:d.tipo,isPrimary:true,button:0,buttons:1}));}catch(_){}finally{repassando=false;}}
 }
 viewport.addEventListener('pointerup',soltar);viewport.addEventListener('pointercancel',soltar);
 window.addEventListener('resize',function(){if(panLivre())panAplicar();});
 mobile.addEventListener('change',sync);sync();
 window.addEventListener('pagehide',function(event){
  if(!event.persisted)mobile.removeEventListener('change',sync);
 });
})();
