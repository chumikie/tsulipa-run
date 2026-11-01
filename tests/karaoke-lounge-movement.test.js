'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const loungeStart=html.indexOf('function krLoungeSoloPermitido(){');
const loungeEnd=html.indexOf('var krLoungeSocialA=null',loungeStart);
assert(loungeStart>=0&&loungeEnd>loungeStart,'Karaoke solo lounge state machine exists');
const loungeSource=html.slice(loungeStart,loungeEnd);

const math=Object.create(Math);
math.random=()=>0;
const bots=Array.from({length:8},(_,i)=>({
  nick:'Idol '+i,x:[160,232,332,432,532,632,732,800][i],y:470,
  no_mic:false,itemSala:'',snackSala:'',danca:'',_ktSocialUntil:0
}));
const env={
  Math:math,
  krT:0,
  krBots:bots,
  krHomolAtivo:false,
  krHomolConectado:false,
  krDemoCantor:null,
  krDemoFila:[],
  krLoungeCastRef:null,
  krLoungeActors:[],
  krLoungeNextAt:0,
  KR_LOUNGE_AISLE_Y:508,
  KR_LOUNGE_STOPS:[230,300,370,590,660,730],
  KR_LOUNGE_MAX_WALKERS:3,
  KR_LOUNGE_LANES:[492,506,520],
  krLoungeSocialA:null,
  krLoungeSocialB:null,
  krLoungeSocialReset(){},
  krLoungeSocialClear(){}
};
vm.createContext(env);
vm.runInContext(loungeSource,env,{timeout:1000});

env.krLoungeReset();
assert.equal(env.krLoungeActors.length,0);
for(const time of [300,345,390]){env.krT=time;env.krLoungeUpdate(1);}
assert.equal(env.krLoungeActors.length,3,'three independent Idols can walk at the same time');
assert.equal(new Set(env.krLoungeActors).size,3,'concurrent walkers must be different cast members');
const lanes=env.krLoungeActors.map(b=>b._ktLounge.laneY);
assert.equal(new Set(lanes).size,3,'simultaneous walkers use separate floor lanes');
const stops=env.krLoungeActors.map(b=>b._ktLounge.targetX);
assert.equal(new Set(stops).size,3,'simultaneous walkers use separate destination points');
const before=env.krLoungeActors.map(b=>[b.x,b.y]);
env.krT+=1;
env.krLoungeUpdate(8);
assert(env.krLoungeActors.every((b,i)=>Math.hypot(b.x-before[i][0],b.y-before[i][1])>0),'all three routes advance independently');
env.krT+=500;
env.krLoungeUpdate(1);
assert.equal(env.krLoungeActors.length,3,'the lounge never exceeds three simultaneous walkers');

// A character taking the microphone is immediately removed from the walking set.
const singer=env.krLoungeActors[0];singer.no_mic=true;
env.krT+=1;env.krLoungeUpdate(1);
assert.equal(env.krLoungeActors.indexOf(singer),-1,'a singer takes priority over autonomous walking');

// Homologation remains isolated: autonomous movement is cleared and cannot restart.
env.krHomolAtivo=true;
env.krT+=1000;env.krLoungeUpdate(1);
assert.equal(env.krLoungeActors.length,0,'homologation clears autonomous walkers');
assert(env.krBots.every(b=>!b._ktLoungeWalking),'homologation releases every walker state');

const moveStart=html.indexOf('var krMoveQueue=[],krMeuRetornoAt=0');
const moveEnd=html.indexOf('function krEstaNoSofa',moveStart);
assert(moveStart>=0&&moveEnd>moveStart,'player floor movement helpers exist');
const moveSource=html.slice(moveStart,moveEnd);
const player={
  x:480,y:286,tx:480,ty:286,no_mic:false,
  drink:'',snackSala:'',itemSala:'',danca:''
};
const moveEnv={
  Math,krEu:player,krT:1000,krMoveQueue:[],
  krLoungeSoloPermitido:()=>true,
  krHandBusy:()=>false,
  kt:{active:()=>false},
  KR_LOUNGE_AISLE_Y:508
};
vm.createContext(moveEnv);
vm.runInContext(moveSource,moveEnv,{timeout:1000});
assert.equal(moveEnv.krEuNoMicrofone(),true,'the idle player starts at the fixed microphone');
assert.equal(moveEnv.krPlanearDestino(730,430),true,'a floor tap is accepted while the solo room is active');
assert.equal(moveEnv.krEuNoMicrofone(),false,'a player moving away is not eligible to start a show');
assert.equal(moveEnv.krMeuRetornoAt,1300,'the five-second return uses the logical 60 Hz room clock');
assert(moveEnv.krMoveQueue.length>0||Math.hypot(player.tx-480,player.ty-286)>12,'the tap creates a floor route');
assert.equal(moveEnv.krPlanearRetornoMicrofone(),true,'the player can be routed back to the microphone');
assert.equal(moveEnv.krMeuVoltandoAoMic,true,'the return route is marked as pending');
assert.equal(moveEnv.krMeuRetornoAt,0,'the original away timer is cleared once the return starts');
const finalWaypoint=moveEnv.krMoveQueue[moveEnv.krMoveQueue.length-1]||{x:player.tx,y:player.ty};
assert.equal(finalWaypoint.x,480,'the return route ends at the microphone x position');
assert.equal(finalWaypoint.y,286,'the return route ends at the microphone y position');

const requestStart=html.indexOf(' function request(){',html.indexOf('var ktFlow=(function(){'));
const requestEnd=html.indexOf('\n }',requestStart);
assert(requestStart>=0&&requestEnd>requestStart,'Karaoke show request function exists');
const request=html.slice(requestStart,requestEnd);
assert(request.indexOf('if(!krEuNoMicrofone())')<request.indexOf('ktMeta.controls()'),'mic position is checked before querying attempts or tickets');
assert(request.includes('krPlanearRetornoMicrofone()'),'a start request away from the mic schedules a safe return');
assert(html.includes('if(py>=315&&py<=500&&krPlanearDestino(px,py))e.preventDefault();'),'floor pointer events call the player movement planner');
assert(html.includes('if(krMeuRetornoAt>0&&krT>=krMeuRetornoAt&&!krEu.no_mic)krPlanearRetornoMicrofone();'),'the room clock triggers the five-second return');
assert(html.includes('if(krMeuVoltandoAoMic&&!krMoveQueue.length&&Math.hypot(krEu.x-KR_MIC_HOME_X,krEu.y-KR_MIC_HOME_Y)<=3'),'return state clears only after arrival at the microphone');
assert(html.includes('if(!krEu.plateia&&krEuNoMicrofone())ktPedestal(x,KR_MIC_HOME_X,KR_MIC_HOME_Y);'),'microphone pedestal stays fixed at the stage while the Idol walks away');
assert(html.includes('function krLoungeSoloPermitido(){return !krHomolAtivo&&!krHomolConectado;}'),'autonomous lounge remains gated out of homologation');
console.log('✓ Karaoke lounge: three concurrent walkers, distinct lanes/stops, singer and homologation gates, player floor taps, five-second return and mic-only start');
