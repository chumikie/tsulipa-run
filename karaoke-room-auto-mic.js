(function(w){'use strict';w.krLoungeAutoMicTick=function(){
 if(!krLoungeSoloPermitido()||!krSt.aberta||!krAutoMicNextAt||krT<krAutoMicNextAt)return;
 // Protect the player's required return/turn window: the room only lends the mic
 // while the player is calmly back at the fixed microphone and no show is active.
 if(krDemoCantor||krRhythmRun||krEu.no_mic||krMeuRetornoAt>0||krMeuVoltandoAoMic||krMoveQueue.length||!krEuNoMicrofone()||krLoungeActors.length||krDemoFila.length){
  if(!krDemoCantor)krAutoMicNextAt=krT+90;
  return;
 }
 if(kt&&kt.active()){krAutoMicNextAt=krT+90;return;}
 var eligible=[];
 for(var i=0;i<krBots.length;i++)if(krLoungePodePassear(krBots[i])&&!krBots[i]._ktLoungeWalking)eligible.push(krBots[i]);
 if(!eligible.length){krAutoMicNextAt=krT+180;return;}
 var bot=eligible[Math.floor(Math.random()*eligible.length)],index=krBots.indexOf(bot);
 bot.no_mic=true;bot.danca='';bot._ktLoungeWalking=false;
 krDemoCantor={bot:bot,x:KR_SOFA_SLOTS[index]?KR_SOFA_SLOTS[index][0]:bot.x,y:KR_SOFA_SLOTS[index]?KR_SOFA_SLOTS[index][1]:bot.y,endsAt:performance.now()+65000,automatic:true};
 bot.x=480;bot.y=286;
 krAutoMicNextAt=krT+900+Math.random()*1200;
 kt.start(true); // NPC presentation is local practice: no ticket, attempt, currency or ranking write.
 krMusicaMudarModo();krUI();
};})(window);
