(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeRoomAutoMic=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(deps){
  if(!deps||typeof deps.getState!=='function'||typeof deps.getBots!=='function'||typeof deps.canWalk!=='function')throw new TypeError('KaraokeRoomAutoMic needs explicit room dependencies');
  return function tick(){
   var s=deps.getState();
   if(!s.soloAllowed||!s.roomOpen||!s.nextAt||s.time<s.nextAt)return;
   // Protect the player's required return/turn window: lend the mic only while
   // the player is back at the fixed microphone and no presentation is active.
   if(s.singer||s.rhythmRun||s.playerNoMic||s.returnAt>0||s.returning||s.moveQueueLength||!s.playerAtMic||s.walkerCount||s.queueLength){
    if(!s.singer)deps.setNextAt(s.time+90);
    return;
   }
   if(s.gameActive){deps.setNextAt(s.time+90);return;}
   var bots=deps.getBots(),eligible=[];
   for(var i=0;i<bots.length;i++)if(deps.canWalk(bots[i])&&!bots[i]._ktLoungeWalking)eligible.push(bots[i]);
   if(!eligible.length){deps.setNextAt(s.time+180);return;}
   var bot=eligible[Math.floor(deps.random()*eligible.length)],index=bots.indexOf(bot),seat=deps.getSeat(index);
   bot.no_mic=true;bot.danca='';bot._ktLoungeWalking=false;
   deps.setSinger({bot:bot,x:seat?seat[0]:bot.x,y:seat?seat[1]:bot.y,endsAt:deps.nowMs()+65000,automatic:true});
   bot.x=480;bot.y=286;
   deps.setNextAt(s.time+900+deps.random()*1200);
   deps.startPractice(); // Local NPC practice: no ticket, attempt, currency or ranking write.
   deps.switchMusicMode();deps.updateUI();
  };
 }
 return Object.freeze({create:create});
});
