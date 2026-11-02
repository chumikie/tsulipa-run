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
 var nodes=[canvas,sound,pause,timing,photo];
 var anchors=nodes.map(function(node){
  var anchor=document.createComment('Karaoke room original position');
  node.parentNode.insertBefore(anchor,node);return anchor;
 });
 var viewport=document.createElement('div'),tools=document.createElement('div');
 viewport.className='kt-room-viewport';tools.className='kt-room-tools';
 tools.setAttribute('role','group');
 var tr=window.ktTr||function(text){return text;};
 tools.setAttribute('aria-label',tr('Som')+' · '+tr('Pausar')+' · '+tr('Ajustar timing')+' · '+tr('Tirar foto da cena'));
 function sync(){
  if(mobile.matches){
   if(viewport.parentNode)return;
   room.insertBefore(viewport,anchors[0]);room.insertBefore(tools,viewport);
   viewport.appendChild(canvas);tools.appendChild(sound);tools.appendChild(pause);tools.appendChild(timing);tools.appendChild(photo);
   room.classList.add('kt-room-mobile');
  }else{
   if(!viewport.parentNode)return;
   nodes.forEach(function(node,i){anchors[i].parentNode.insertBefore(node,anchors[i]);});
   viewport.remove();tools.remove();room.classList.remove('kt-room-mobile');
  }
 }
 mobile.addEventListener('change',sync);sync();
 window.addEventListener('pagehide',function(event){
  if(!event.persisted)mobile.removeEventListener('change',sync);
 });
})();
