/* Karaoke de homologação: apenas apresentação. Nunca acessa banco nem save. */
(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.TsuKaraokeHomolView=api;
})(typeof window==='object'?window:null,function(){
 'use strict';
 function valid(p){return p&&Number.isInteger(p.slot)&&p.slot>=1&&p.slot<=9?p.slot:null;}
 function label(n){return 'Idol '+String(n).padStart(2,'0');}
 function stageLayout(raw){
  var out=[],seen={},data=Array.isArray(raw)?raw:[];
  data.slice(0,32).forEach(function(p){
   var n=valid(p);if(n===null||seen[n])return;
   seen[n]=true;out.push({slot:n,label:label(n),self:p.self===true,singing:p.singing===true});
  });
  out.sort(function(a,b){return a.slot-b.slot;});
  var singer=out.find(function(p){return p.singing;}),i=0;
  out.forEach(function(p){p.singing=!!singer&&p.slot===singer.slot;p.seatIndex=p.singing?null:i++;});
  return out.slice(0,9);
 }
 function queueSlots(raw){
  var out=[],seen={},data=Array.isArray(raw)?raw:[];
  data.slice(0,3).forEach(function(p){var n=valid(p);if(n===null||seen[n])return;seen[n]=true;out.push({slot:n,label:label(n)});});
  while(out.length<3)out.push(null);
  return out;
 }
 function turnPhase(start,end,now){
  if(!Number.isFinite(start)||!Number.isFinite(end)||end<=start||!Number.isFinite(now))return {phase:'idle',remaining:0};
  var seconds=Math.max(0,Math.ceil((end-now)/1000));
  if(!seconds)return {phase:'finished',remaining:0};
  var dt=Math.max(0,now-start);
  return {phase:dt<5000?'intro':dt<50000?'rhythm':'outro',remaining:seconds};
 }
 return Object.freeze({stageLayout:stageLayout,queueSlots:queueSlots,turnPhase:turnPhase});
});