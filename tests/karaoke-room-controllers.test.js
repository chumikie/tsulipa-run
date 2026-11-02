'use strict';
const assert=require('node:assert/strict');
const AutoMic=require('../karaoke-room-auto-mic.js');
const Polaroid=require('../karaoke-room-polaroid.js');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const autoSource=fs.readFileSync(path.join(__dirname,'..','karaoke-room-auto-mic.js'),'utf8');
const polaroidSource=fs.readFileSync(path.join(__dirname,'..','karaoke-room-polaroid.js'),'utf8');
const polaroidCss=fs.readFileSync(path.join(__dirname,'..','karaoke-photo.css'),'utf8');

assert(!/\bkrLoungeSoloPermitido\b|\bkrSt\b|\bkrT\b|\bkrEu\b|\bkrDemoCantor\b|\bkrBots\b|\bkrLoungeActors\b|\bkrDemoFila\b/.test(autoSource),'autonomous mic module must not reach into the page IIFE');
assert(!/\bCH\b|\bdesenharIdol\b|\bkrT\b/.test(polaroidSource),'Polaroid module must not reach into the page IIFE');
assert(html.includes('window.krLoungeAutoMicController=window.KaraokeRoomAutoMic.create({')&&html.includes('window.krLoungeAutoMicTick=window.krLoungeAutoMicController.tick'),'page injects room state into the autonomous mic factory');
assert(html.includes('window.ktShowAdmissionPending=true')&&html.includes("dialog.addEventListener('cancel'")&&html.includes('window.ktShowAdmissionPending=false;dialog.close();'),'player admission locks NPC turns until confirmed or cancelled');
assert(html.includes("window.ktShowAdmissionPending=false;kt.start('confirmed',info)")&&html.includes('window.ktShowAdmissionPending=false;aviso('),'admission lock clears on confirmed start and gate failure');
assert(html.includes('Silenciar / restaurar som')&&html.includes("if(key==='m'&&$('ktClosed').hidden)")&&html.includes('krAlternarSom();return;')&&!html.includes('muteButton.focus({preventScroll:true})')&&!html.includes('muteButton.click()'),'M calls the shared mute state directly without synthetic focus or click');
assert(html.includes('window.KaraokeRoomPolaroid=window.KaraokeRoomPolaroid.create({'),'page injects avatar renderer dependencies into the Polaroid factory');
assert(html.includes('karaoke-room-auto-mic.js?v=3')&&html.includes('karaoke-room-polaroid.js?v=3')&&html.includes('karaoke-photo.css?v=3'),'both separated controllers use fresh cache versions');

function autoHarness(overrides){
 const state=Object.assign({soloAllowed:true,roomOpen:true,nextAt:100,time:100,singer:null,rhythmRun:null,playerNoMic:false,admissionPending:false,returnAt:0,returning:false,moveQueueLength:0,playerAtMic:true,playerX:480,playerY:286,playerWaited:false,playerReturning:false,playerTarget:null,walkerCount:0,queueLength:0,gameActive:false},overrides||{});
 const bots=[{nick:'A',x:200,y:400,no_mic:false,_ktLoungeWalking:false,_ktLounge:{returnX:160,returnY:400}},{nick:'B',x:700,y:400,no_mic:false,_ktLoungeWalking:false,_ktLounge:{returnX:800,returnY:400}}];
 const calls=[],deps={
  getState:()=>state,getBots:()=>bots,canWalk:bot=>!bot.no_mic,getSeat:i=>i===0?[160,400]:[800,400],
  removeWalker:bot=>{bot._ktLoungeWalking=false;calls.push(['remove',bot.nick]);},
  preparePlayerForSinger:(x,y)=>{state.playerTarget=[x,y];state.playerAtMic=false;calls.push(['player-departure',x,y]);return true;},
  isPlayerAtSingerWait:()=>state.playerWaited,
  restorePlayerAfterSinger:()=>{state.playerReturning=true;calls.push(['player-return']);return true;},
  isPlayerAtMic:()=>state.playerAtMic,
  random:()=>0,nowMs:()=>5000,getTime:()=>state.time,setSinger:v=>{state.singer=v;calls.push(['singer',v&&v.phase]);},
  setNextAt:v=>{state.nextAt=v;calls.push(['next',v]);},startPractice:()=>calls.push(['start']),switchMusicMode:()=>calls.push(['music']),updateUI:()=>calls.push(['ui']),onReturnComplete:()=>calls.push(['returned'])
 };
 const controller=AutoMic.create(deps);
 return {state,bots,calls,controller,tick:controller.tick,
  movePlayerToWait:function(){assert(state.playerTarget,'player has a planned waiting destination');state.playerX=state.playerTarget[0];state.playerY=state.playerTarget[1];state.playerWaited=true;},
  movePlayerToMic:function(){state.playerX=480;state.playerY=286;state.playerAtMic=true;state.playerWaited=false;},
  assertSeparate:function(label){const bot=state.singer&&state.singer.bot;if(!bot)return;const distance=Math.hypot(bot.x-state.playerX,bot.y-state.playerY);assert(distance>80,label+' keeps player and NPC sprite envelopes separate (distance '+distance.toFixed(1)+')');}
 };
}
const blocked=[
 ['homologation',{soloAllowed:false}],['closed room',{roomOpen:false}],['player show',{playerNoMic:true}],
 ['pending presentation confirmation',{admissionPending:true}],
 ['required return delay',{returnAt:1}],['return route',{returning:true}],['queued movement',{moveQueueLength:1}],
 ['player away from mic',{playerAtMic:false}],['another walker',{walkerCount:1}],['queued turn',{queueLength:1}],
 ['player rhythm run',{rhythmRun:{}}],['NPC already singing',{singer:{bot:{}}}],['rhythm engine active',{gameActive:true}]
];
for(const [label,state] of blocked){
 const h=autoHarness(state);h.tick();
 assert.equal(h.calls.some(c=>c[0]==='singer'),false,label+' blocks autonomous mic');
 assert.equal(h.calls.some(c=>c[0]==='start'),false,label+' must not start the music engine');
}
{
 const h=autoHarness();h.tick();
 assert.equal(h.state.singer.bot,h.bots[0],'first eligible NPC receives the mic route deterministically');
 assert.equal(h.state.singer.phase,'player_departure','player is routed away before the NPC approaches');
 assert.deepEqual([h.bots[0].x,h.bots[0].y,h.bots[0].no_mic,h.bots[0]._ktLoungeWalking],[200,400,false,false],'NPC waits at its seat while the player departs');
 assert.deepEqual(h.state.playerTarget,[620,320],'player receives the opposite waiting point');
 assert.equal(h.calls.some(c=>c[0]==='start'),false,'practice does not start during player departure');
 h.controller.updateMovement(500);
 assert.equal(h.state.singer.phase,'player_departure','NPC remains seated until player reaches the waiting point');
 h.assertSeparate('during player departure');
 h.movePlayerToWait();h.controller.updateMovement(500);
 assert.equal(h.state.singer.phase,'approach','NPC starts only after player reaches the safe waiting point');
 assert.deepEqual(h.state.singer.route,[[200,520],[340,520],[340,286],[480,286]],'approach route follows the clear aisle and side passage');
 for(let i=0;i<4;i++){h.controller.updateMovement(500);h.assertSeparate('during NPC approach');}
 assert.equal(h.state.singer.phase,'singing','practice begins only after the NPC reaches the microphone');
 assert.deepEqual([h.bots[0].x,h.bots[0].y,h.bots[0].no_mic],[480,286,true],'NPC reaches the mic before singing');
 assert.equal(h.state.singer.endsAt,70000,'NPC show keeps the original 65-second local duration');
 assert(h.calls.some(c=>c[0]==='start'),'practice engine starts after the route ends');
 assert.equal(h.controller.finishSinger(),true,'ending the show starts the return route');
 assert.equal(h.state.singer.phase,'return','singer keeps a return state instead of teleporting');
 assert.equal(h.bots[0]._ktLoungeWalking,true,'singer walks back after ending the show');
 for(let i=0;i<4;i++){h.controller.updateMovement(500);h.assertSeparate('during NPC return');}
 assert.equal(h.state.singer.phase,'player_return','player recovery waits until NPC reaches its seat');
 assert.deepEqual([h.bots[0].x,h.bots[0].y,h.bots[0].no_mic],[160,400,false],'NPC returns to its original sofa before player recovery');
 assert(h.state.playerReturning,'player return route is explicitly started after NPC return');
 h.assertSeparate('during player recovery');
 h.movePlayerToMic();h.controller.updateMovement(500);
 assert.equal(h.state.singer,null,'singer state clears only after player regains the microphone');
 assert(h.calls.some(c=>c[0]==='returned'),'queue can advance after the NPC and player finish their routes');
}
{
 const h=autoHarness();h.tick();h.controller.finishSinger();
 assert.equal(h.state.singer.phase,'player_return','cancelling before NPC approach restores the player');
 assert(h.state.playerReturning,'early cancellation starts the player return route');
 h.movePlayerToMic();h.controller.updateMovement(500);
 assert.equal(h.state.singer,null,'early cancellation releases the automatic mic lock after recovery');
}
{
 const h=autoHarness();h.bots.forEach(b=>b.no_mic=true);h.tick();
 assert.equal(h.state.singer,null,'no eligible NPC means no singer is reserved');
 assert.equal(h.calls.some(c=>c[0]==='start'),false,'no eligible NPC means no show starts');
 assert.equal(h.state.nextAt,280,'empty cast retries after the original 180-frame delay');
}

function fakeContext(){
 const calls=[],gradients=[];
 function gradient(){const value={stops:[],addColorStop(offset,color){this.stops.push([offset,color]);}};gradients.push(value);return value;}
 const ctx={calls,gradients,globalAlpha:1,
  clearRect(){calls.push('clear');},createLinearGradient:gradient,createRadialGradient:gradient,fillRect(){calls.push('rect');},
  save(){},restore(){},beginPath(){},moveTo(){},lineTo(){},closePath(){},arc(){},ellipse(){},stroke(){},fill(){},fillText(text){calls.push(text);}};
 return ctx;
}
function fakeNode(){
 const listeners={},elements={};let markup='';
 return {id:'',className:'',open:false,isConnected:true,style:{values:{},setProperty(k,v){this.values[k]=v;}},listeners,elements,
  set innerHTML(value){
   markup=value;elements.ktPosterClose={onclick:null};elements.ktPosterTitle={textContent:''};
   elements.ktPosterSave={hidden:true,href:'',download:'',removeAttribute(name){if(name==='href')this.href='';}};
   elements.ktPosterPortrait={attrs:{},ctx:fakeContext(),getContext(){return this.ctx;},setAttribute(k,v){this.attrs[k]=v;},
    toBlob(callback,type){this.lastBlobType=type;callback({type:type});},toDataURL(){return 'data:image/png;base64,UE5H';}};
  },
  get innerHTML(){return markup;},setAttribute(){},addEventListener(type,fn){listeners[type]=fn;},
  appendChild(){},querySelector(sel){return elements[sel.slice(1)]||null;},
  showModal(){this.open=true;},close(){this.open=false;if(listeners.close)listeners.close();},focus(){}
};
}
{
 const dialog=fakeNode(),opener={isConnected:true,focus(){this.focused=true;}},revoked=[];
 let serial=0;
 const urlApi={createObjectURL(blob){assert.equal(blob.type,'image/png');return 'blob:polaroid-'+(++serial);},revokeObjectURL(url){revoked.push(url);}};
 const host={innerHeight:900,URL:urlApi,addEventListener(){}};host.parent=host;
 const doc={activeElement:opener,documentElement:{clientHeight:780},body:{appendChild(node){assert.equal(node,dialog);}},createElement:()=>dialog};
 const drawCalls=[],viewer=Polaroid.create({document:doc,window:host,URL:urlApi,
  makeCharacter:(person,index)=>({person:person,index:index}),
  drawIdol:(...args)=>drawCalls.push(args),getTime:()=>1234});
 const cssBackdrop='#ktPosterDialog::backdrop{background:transparent!important;backdrop-filter:none!important}';
 assert(polaroidCss.includes(cssBackdrop),'Polaroid never dims or blurs the colorful room behind it');
 assert.equal(viewer.open({nick:'invalid'},0),false,'a member without an avatar cannot open a portrait');
 const palettes=new Set(),poses=['coracao','banzai','neon','luz','coracao','banzai'],expressions=[3,0,3,0,3,0];
 for(let i=0;i<6;i++){
  const person={nick:'Idol '+i,avatar:{c:{hair:'#ff7eb6'},pose:'v',expr:2}};
  dialog.elements.ktPosterPortrait&&dialog.elements.ktPosterPortrait.ctx.gradients.splice(0);
  assert.equal(viewer.open(person,i,opener),true,'a valid member opens Polaroid '+(i+1));
  assert.equal(dialog.open,true,'portrait dialog is modal');
  assert.equal(dialog.elements.ktPosterTitle.textContent,'Idol '+i,'member nickname is shown');
  assert.equal(dialog.elements.ktPosterPortrait.attrs['aria-label'],'Retrato ampliado de Idol '+i,'portrait canvas has an accessible description');
  assert.equal(drawCalls.length,i+1,'the injected renderer is called once for each Polaroid');
  const call=drawCalls[i];
  assert.equal(call[1].person,person,'the renderer receives the character built by the page');
  assert.equal(call[2],260);assert.equal(call[3],470);assert.equal(call[4],7.8,'character is enlarged and grounded at the bottom of the portrait');
  assert.equal(call[5],poses[i],'each portrait receives a cheerful presentation pose');
  assert.equal(call[6],expressions[i],'each portrait receives an excited expression');
  assert.equal(call[7],1234,'the renderer receives the injected room clock');
  palettes.add(JSON.stringify(dialog.elements.ktPosterPortrait.ctx.gradients[0].stops));
  assert.equal(dialog.elements.ktPosterPortrait.lastBlobType,'image/png','Polaroid exports a PNG canvas');
  assert.equal(dialog.elements.ktPosterSave.hidden,false,'PNG save link appears after encoding');
  assert.match(dialog.elements.ktPosterSave.download,/\.png$/,'PNG filename has the correct extension');
  assert.match(dialog.elements.ktPosterSave.href,/^blob:polaroid-/,'PNG link points to the generated blob');
  assert.equal(dialog.style.values['--kt-poster-top'],'12px','dialog is positioned in the visible host viewport');
  if(i<5)dialog.close();
 }
 assert.equal(palettes.size,6,'the six wall Polaroids have six distinct color gradients');
 dialog.close();assert.equal(opener.focused,true,'focus returns to the opener when the portrait closes');
 assert.equal(revoked.length,6,'each generated PNG object URL is released on close or replacement');
}

{
 const dialog=fakeNode(),opener={isConnected:true,focus(){}},host={innerHeight:700,URL:{},addEventListener(){}};
 host.parent=host;
 const doc={activeElement:opener,documentElement:{clientHeight:700},body:{appendChild(){}},createElement:()=>dialog};
 const viewer=Polaroid.create({document:doc,window:host,URL:host.URL,makeCharacter:()=>({n:'Fallback'}),drawIdol(){},getTime:()=>0});
 const fallbackPerson={nick:'Fallback',avatar:{c:{}}};
 assert(viewer.open(fallbackPerson,0,opener),'fallback portrait initializes');
 dialog.close();
 dialog.elements.ktPosterPortrait.toBlob=function(callback,type){this.lastBlobType=type;callback(null);};
 assert(viewer.open(fallbackPerson,0,opener),'fallback portrait reopens after toBlob returns null');
 assert.equal(dialog.elements.ktPosterSave.hidden,false,'PNG data URL fallback still exposes Save');
 assert.equal(dialog.elements.ktPosterSave.href,'data:image/png;base64,UE5H','fallback exports PNG data rather than leaving a dead link');
 assert.match(dialog.elements.ktPosterSave.download,/\.png$/,'fallback download filename remains PNG');
 dialog.close();
}

{
 const dialog=fakeNode(),opener={isConnected:true,focus(){}},revoked=[];
 let serial=0,lateClose=null;
 const pendingBlobs=[],urlApi={createObjectURL(blob){assert.equal(blob.type,'image/png');return 'blob:race-'+(++serial);},revokeObjectURL(url){revoked.push(url);}};
 const host={innerHeight:700,URL:urlApi,addEventListener(){}};host.parent=host;
 const doc={activeElement:opener,documentElement:{clientHeight:700},body:{appendChild(){}},createElement:()=>dialog};
 const viewer=Polaroid.create({document:doc,window:host,URL:urlApi,makeCharacter:()=>({n:'Reopen'}),drawIdol(){},getTime:()=>0});
 assert(viewer.open({nick:'Before close',avatar:{c:{}}},0,opener),'first portrait opens before delayed close event');
 const firstUrl=dialog.elements.ktPosterSave.href;
 // HTMLDialogElement queues its close event; the same dialog can be reopened before that task runs.
 dialog.close=function(){this.open=false;lateClose=()=>{if(this.listeners.close)this.listeners.close();};};
 dialog.close();
 dialog.elements.ktPosterPortrait.toBlob=function(callback,type){this.lastBlobType=type;pendingBlobs.push(()=>callback({type:type}));};
 assert(viewer.open({nick:'Reopened',avatar:{c:{}}},1,opener),'the same portrait dialog reopens before the old close event is delivered');
 assert.equal(dialog.elements.ktPosterSave.hidden,true,'new PNG remains pending while toBlob is asynchronous');
 lateClose();
 assert.equal(dialog.open,true,'the delayed close event belongs to the old closing cycle, not the reopened dialog');
 pendingBlobs.shift()();
 assert.equal(dialog.elements.ktPosterSave.hidden,false,'stale close event cannot hide the newly generated PNG link');
 assert.equal(dialog.elements.ktPosterSave.href,'blob:race-2','the reopened portrait retains its own blob URL');
 assert(revoked.includes(firstUrl),'the previous portrait URL is released when the next portrait opens');
 assert(!revoked.includes('blob:race-2'),'the newly generated URL is not revoked by a stale close event');
 dialog.close();
}
 
console.log('✓ Karaoke room controllers use explicit dependencies and preserve NPC mic + Polaroid behavior');