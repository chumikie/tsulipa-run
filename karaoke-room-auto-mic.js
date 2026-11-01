(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeRoomAutoMic=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function create(deps){
  if(!deps||typeof deps.getState!=='function'||typeof deps.getBots!=='function'||typeof deps.canWalk!=='function'||
   typeof deps.preparePlayerForSinger!=='function'||typeof deps.isPlayerAtSingerWait!=='function'||
   typeof deps.restorePlayerAfterSinger!=='function'||typeof deps.isPlayerAtMic!=='function'){
   throw new TypeError('KaraokeRoomAutoMic needs explicit room and player-movement dependencies');
  }
  var singer=null;
  function beginPlayerReturn(){
   if(!singer)return;
   singer.phase='player_return';singer.route=[];singer.routeIndex=0;singer.playerReturnStarted=!!deps.restorePlayerAfterSinger();
   if(!singer.playerReturnStarted&&deps.onError)deps.onError(new Error('Could not route the player back to the microphone'));
   deps.switchMusicMode();deps.updateUI();
  }
  function completePlayerReturn(){
   if(!singer)return;
   singer=null;deps.setSinger(null);deps.setNextAt(deps.getTime()+900+deps.random()*1200);
   deps.switchMusicMode();deps.updateUI();if(deps.onReturnComplete)deps.onReturnComplete();
  }
  function beginSinger(bot,automatic){
   var s=deps.getState(),bots=deps.getBots();
   if(!bot||singer||s.singer||s.rhythmRun||s.playerNoMic||s.admissionPending||!s.soloAllowed||!s.roomOpen||
    s.returnAt>0||s.returning||s.moveQueueLength||s.playerAtMic===false||s.walkerCount||s.queueLength)return false;
   var index=bots.indexOf(bot),seat=deps.getSeat(index)||[bot.x,bot.y],lounge=bot._ktLounge;
   var homeX=lounge&&Number.isFinite(lounge.returnX)?lounge.returnX:seat[0];
   var homeY=lounge&&Number.isFinite(lounge.returnY)?lounge.returnY:seat[1];
   var side=bot.x<480?340:620,playerWaitX=side===340?620:340,playerWaitY=320;
   // The player leaves the fixed microphone first. The NPC remains at its seat
   // until the player has reached the opposite, non-intersecting waiting point.
   if(!deps.preparePlayerForSinger(playerWaitX,playerWaitY))return false;
   singer={bot:bot,phase:'player_departure',automatic:!!automatic,homeX:homeX,homeY:homeY,
    side:side,playerWaitX:playerWaitX,playerWaitY:playerWaitY,playerReturnStarted:false,
    route:[],routeIndex:0,endsAt:0};
   deps.removeWalker(bot);
   bot.no_mic=false;bot.danca='';bot._ktLoungeWalking=false;bot._ktLoungeFacing=bot.x>480?-1:1;
   deps.setSinger(singer);deps.updateUI();return true;
  }
  function finishSinger(){
   if(!singer||singer.phase==='return'||singer.phase==='player_return')return false;
   if(singer.phase==='player_departure'){beginPlayerReturn();return true;}
   var b=singer.bot;b.no_mic=false;b.danca='';b._ktLoungeWalking=true;
   singer.phase='return';singer.route=[[singer.side,286],[singer.side,520],[singer.homeX,520],[singer.homeX,singer.homeY]];singer.routeIndex=0;
   deps.switchMusicMode();return true;
  }
  function completeApproach(){
   if(!singer)return;
   singer.phase='singing';singer.endsAt=deps.nowMs()+65000;
   singer.bot.no_mic=true;singer.bot._ktLoungeWalking=false;
   try{deps.startPractice();}catch(error){finishSinger();if(deps.onError)deps.onError(error);return;}
   deps.switchMusicMode();deps.updateUI();
  }
  function completeReturn(){
   if(!singer)return;
   var done=singer,b=done.bot;
   // The route already placed the NPC at its seat; do not snap either actor.
   b.no_mic=false;b.danca='';b._ktLoungeWalking=false;
   if(b._ktLounge){b._ktLounge.phase='rest';b._ktLounge.route=null;b._ktLounge.routeIndex=0;b._ktLounge.returnX=done.homeX;b._ktLounge.returnY=done.homeY;b._ktLounge.targetX=null;b._ktLounge.waitUntil=deps.getTime()+180+deps.random()*240;}
   beginPlayerReturn();
  }
  function updateMovement(dt){
   if(!singer||singer.phase==='singing')return false;
   if(singer.phase==='player_departure'){
    if(!deps.isPlayerAtSingerWait(singer.playerWaitX,singer.playerWaitY))return true;
    singer.phase='approach';singer.route=[[singer.bot.x,520],[singer.side,520],[singer.side,286],[480,286]];singer.routeIndex=0;
    deps.updateUI();return true;
   }
   if(singer.phase==='player_return'){
    if(!singer.playerReturnStarted)singer.playerReturnStarted=!!deps.restorePlayerAfterSinger();
    if(deps.isPlayerAtMic())completePlayerReturn();
    return true;
   }
   var target=singer.route[singer.routeIndex];
   if(!target){if(singer.phase==='approach')completeApproach();else if(singer.phase==='return')completeReturn();return true;}
   var bot=singer.bot,dx=target[0]-bot.x,dy=target[1]-bot.y,d=Math.hypot(dx,dy),step=1.65*Math.max(0,Number(dt)||1);
   if(d<=Math.max(1.2,step)){bot.x=target[0];bot.y=target[1];singer.routeIndex++;}
   else{
    bot.x+=(dx/d)*step;bot.y+=(dy/d)*step;
    if(Math.abs(dx)>.01)bot._ktLoungeFacing=dx<0?-1:1;
   }
   bot._ktLoungeWalking=true;
   if(singer.routeIndex>=singer.route.length){if(singer.phase==='approach')completeApproach();else if(singer.phase==='return')completeReturn();}
   return true;
  }
  function tick(){
   var s=deps.getState();
   if(!s.soloAllowed||!s.roomOpen||!s.nextAt||s.time<s.nextAt)return;
   if(s.singer||s.rhythmRun||s.playerNoMic||s.admissionPending||s.returnAt>0||s.returning||s.moveQueueLength||!s.playerAtMic||s.walkerCount||s.queueLength){
    if(!s.singer)deps.setNextAt(s.time+90);
    return;
   }
   if(s.gameActive){deps.setNextAt(s.time+90);return;}
   var bots=deps.getBots(),eligible=[];
   for(var i=0;i<bots.length;i++)if(deps.canWalk(bots[i])&&!bots[i]._ktLoungeWalking)eligible.push(bots[i]);
   if(!eligible.length){deps.setNextAt(s.time+180);return;}
   var bot=eligible[Math.floor(deps.random()*eligible.length)];
   if(!beginSinger(bot,true)){deps.setNextAt(s.time+180);return;}
   deps.setNextAt(s.time+900+deps.random()*1200);deps.switchMusicMode();deps.updateUI();
  }
  return Object.freeze({tick:tick,beginSinger:beginSinger,finishSinger:finishSinger,updateMovement:updateMovement,getSinger:function(){return singer;}});
 }
 return Object.freeze({create:create});
});
