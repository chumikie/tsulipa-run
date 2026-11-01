'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const autoMic=fs.readFileSync(path.join(__dirname,'..','karaoke-room-auto-mic.js'),'utf8');
const polaroid=fs.readFileSync(path.join(__dirname,'..','karaoke-room-polaroid.js'),'utf8');
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
  krAutoMicNextAt:0,
  krEu:{no_mic:false},krEuNoMicrofone:()=>true,krRhythmRun:null,krMeuRetornoAt:0,krMeuVoltandoAoMic:false,krMoveQueue:[],
  kt:{active:()=>false},
  KR_SOFA_SLOTS:[[160,400],[232,470],[332,470],[432,470],[532,470],[632,470],[732,470],[800,400]],
  KR_LOUNGE_AISLE_Y:520,
  KR_LOUNGE_STOPS:[230,300,370,590,660,730],
  KR_LOUNGE_MAX_WALKERS:1,
  KR_LOUNGE_LANES:[520],
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
assert.equal(env.krLoungeActors.length,1,'only one Idol walks at a time, preventing paths from crossing');
assert.equal(new Set(env.krLoungeActors).size,1,'the active walker is a single cast member');
const walker=env.krLoungeActors[0],startX=walker.x,startY=walker.y;
assert.equal(walker._ktLounge.route[0][0],startX,'the walker first leaves its own seat vertically');
assert.equal(walker._ktLounge.route[0][1],520,'the walker enters the clear front aisle');
assert.equal(walker._ktLounge.laneY,520,'the path uses the clear, object-free aisle only');
env.krT+=1;env.krLoungeUpdate(8);
assert(Math.hypot(walker.x-startX,walker.y-startY)>0,'the single route advances by delta time');
env.krT+=500;env.krLoungeUpdate(1);
assert(env.krLoungeActors.length<=1,'the lounge never overlaps autonomous walkers');
env.krEuNoMicrofone=()=>false;env.krT+=1;env.krLoungeUpdate(1);
assert.equal(env.krLoungeActors.length,0,'autonomous walking pauses while the player is away from the microphone');
assert(env.krBots.every((b,i)=>b.x===env.KR_SOFA_SLOTS[i][0]&&b.y===env.KR_SOFA_SLOTS[i][1]),'the audience remains seated while the player moves through the room');
env.krEuNoMicrofone=()=>true;env.krLoungeReset();
for(const time of [env.krT+300,env.krT+345,env.krT+390]){env.krT=time;env.krLoungeUpdate(1);}
assert.equal(env.krLoungeActors.length,1,'the lounge resumes one safe walker after the player returns to the microphone');
// A character taking the microphone is immediately removed from the walking set.
const singer=env.krLoungeActors[0];singer.no_mic=true;
env.krT+=1;env.krLoungeUpdate(1);
assert.equal(env.krLoungeActors.indexOf(singer),-1,'a singer takes priority over autonomous walking');

// Homologation remains isolated: autonomous movement is cleared and cannot restart.
env.krHomolAtivo=true;
env.krT+=1000;env.krLoungeUpdate(1);
assert.equal(env.krLoungeActors.length,0,'homologation clears autonomous walkers');
assert(env.krBots.every(b=>!b._ktLoungeWalking),'homologation releases every walker state');
env.krHomolAtivo=false;env.krEu.no_mic=true;env.kt.active=()=>true;env.krDemoCantor=null;env.krLoungeActors.length=0;
env.krLoungeUpdate(1);
assert(env.krBots.every((b,i)=>b.no_mic||(b.x===env.KR_SOFA_SLOTS[i][0]&&b.y===env.KR_SOFA_SLOTS[i][1]),'every non-singer returns to their sofa during a presentation');
env.krEu.no_mic=false;env.kt.active=()=>false;

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
assert(autoMic.includes('w.krLoungeAutoMicTick=function()'),'the room has an autonomous NPC mic turn');
assert(html.includes('krMeuRetornoAt>0||krMeuVoltandoAoMic||krMoveQueue.length||!krEuNoMicrofone()'),'NPC mic waits outside the player mandatory return/turn window');
assert(autoMic.includes('kt.start(true); // NPC presentation is local practice'),'NPC mic uses local practice and cannot consume the player attempt');
assert(polaroid.includes('function open(person,index,opener){'),'wall Polaroids open a member portrait');
assert(polaroid.includes('desenharIdol(ctx,char,260,405,5.8'),'the enlarged portrait uses the member avatar renderer');
assert(polaroid.includes('posterDialog.showModal()'),'the enlarged portrait is presented in an accessible dialog');
assert(html.includes('window.KaraokeRoomPolaroid.open(KR_ROOM_POSTER_DRAW[photo],photo,document.activeElement)'),'wall Polaroids have a pointer hit target');
console.log('✓ Karaoke lounge: single clear-aisle walker, sofa occupancy, random NPC mic guard, interactive Polaroids, homologation and player turn protections');
