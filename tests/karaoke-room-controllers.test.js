'use strict';
const assert=require('node:assert/strict');
const AutoMic=require('../karaoke-room-auto-mic.js');
const Polaroid=require('../karaoke-room-polaroid.js');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const autoSource=fs.readFileSync(path.join(__dirname,'..','karaoke-room-auto-mic.js'),'utf8');
const polaroidSource=fs.readFileSync(path.join(__dirname,'..','karaoke-room-polaroid.js'),'utf8');

assert(!/\bkrLoungeSoloPermitido\b|\bkrSt\b|\bkrT\b|\bkrEu\b|\bkrDemoCantor\b|\bkrBots\b|\bkrLoungeActors\b|\bkrDemoFila\b/.test(autoSource),'autonomous mic module must not reach into the page IIFE');
assert(!/\bCH\b|\bdesenharIdol\b|\bkrT\b/.test(polaroidSource),'Polaroid module must not reach into the page IIFE');
assert(html.includes('window.krLoungeAutoMicTick=window.KaraokeRoomAutoMic.create({'),'page injects room state into the autonomous mic factory');
assert(html.includes('window.KaraokeRoomPolaroid=window.KaraokeRoomPolaroid.create({'),'page injects avatar renderer dependencies into the Polaroid factory');
assert(html.includes('karaoke-room-auto-mic.js?v=2')&&html.includes('karaoke-room-polaroid.js?v=2'),'both separated controllers use fresh cache versions');

function autoHarness(overrides){
 const state=Object.assign({soloAllowed:true,roomOpen:true,nextAt:100,time:100,singer:null,rhythmRun:null,playerNoMic:false,returnAt:0,returning:false,moveQueueLength:0,playerAtMic:true,walkerCount:0,queueLength:0,gameActive:false},overrides||{});
 const bots=[{nick:'A',x:200,y:400,no_mic:false,_ktLoungeWalking:false},{nick:'B',x:700,y:400,no_mic:false,_ktLoungeWalking:false}];
 const calls=[],deps={
  getState:()=>state,getBots:()=>bots,canWalk:bot=>!bot.no_mic,getSeat:i=>i===0?[160,400]:[800,400],
  random:()=>0,nowMs:()=>5000,setSinger:v=>{state.singer=v;calls.push(['singer',v]);},
  setNextAt:v=>{state.nextAt=v;calls.push(['next',v]);},startPractice:()=>calls.push(['start']),switchMusicMode:()=>calls.push(['music']),updateUI:()=>calls.push(['ui'])
 };
 return {state,bots,calls,tick:AutoMic.create(deps)};
}
const blocked=[
 ['homologation',{soloAllowed:false}],['closed room',{roomOpen:false}],['player show',{playerNoMic:true}],
 ['required return delay',{returnAt:1}],['return route',{returning:true}],['queued movement',{moveQueueLength:1}],
 ['player away from mic',{playerAtMic:false}],['another walker',{walkerCount:1}],['queued turn',{queueLength:1}],
 ['player rhythm run',{rhythmRun:{}}],['NPC already singing',{singer:{bot:{}}}],['rhythm engine active',{gameActive:true}]
];
for(const [label,state] of blocked){
 const h=autoHarness(state);h.tick();
 assert.equal(h.calls.some(c=>c[0]==='start'),false,label+' blocks autonomous mic');
}
{
 const h=autoHarness();h.tick();
 assert.equal(h.state.singer.bot,h.bots[0],'first eligible NPC receives the mic deterministically');
 assert.deepEqual([h.bots[0].x,h.bots[0].y,h.bots[0].no_mic],[480,286,true],'NPC moves to the fixed mic and enters singing state');
 assert.equal(h.state.singer.automatic,true,'the turn is marked autonomous');
 assert.equal(h.state.singer.endsAt,70000,'NPC show keeps the original 65-second local duration');
 assert.equal(h.state.nextAt,1000,'next random mic window is scheduled');
 assert.deepEqual(h.calls.map(c=>c[0]),['singer','next','start','music','ui'],'start, music and room refresh happen in the original order');
}
{
 const h=autoHarness();h.bots.forEach(b=>b.no_mic=true);h.tick();
 assert.equal(h.calls.some(c=>c[0]==='start'),false,'no eligible NPC means no show starts');
 assert.equal(h.state.nextAt,280,'empty cast retries after the original 180-frame delay');
}

function fakeContext(){
 const calls=[];
 const ctx={calls,clearRect(){calls.push('clear');},createLinearGradient(){return {addColorStop(){}};},fillRect(){calls.push('rect');},
  save(){},restore(){},beginPath(){},arc(){},ellipse(){},fill(){},fillText(text){calls.push(text);}};
 return ctx;
}
function fakeNode(){
 const listeners={},elements={};let markup='';
 return {id:'',className:'',open:false,isConnected:true,style:{},listeners,elements,
  set innerHTML(value){markup=value;elements.ktPosterClose={onclick:null};elements.ktPosterTitle={textContent:''};elements.ktPosterPortrait={attrs:{},ctx:fakeContext(),getContext(){return this.ctx;},setAttribute(k,v){this.attrs[k]=v;}};},
  get innerHTML(){return markup;},setAttribute(){},addEventListener(type,fn){listeners[type]=fn;},
  appendChild(node){},querySelector(sel){return elements[sel.slice(1)]||null;},
  showModal(){this.open=true;},close(){this.open=false;if(listeners.close)listeners.close();},focus(){}};
}
{
 const dialog=fakeNode(),opener={isConnected:true,focus(){this.focused=true;}},doc={activeElement:opener,body:{appendChild(node){assert.equal(node,dialog);}},createElement:()=>dialog};
 const drawCalls=[],char={n:'Idol'},person={nick:'Idol',avatar:{c:{hair:'#ff7eb6'},pose:'v',expr:2}};
 const viewer=Polaroid.create({document:doc,makeCharacter:(p,index)=>{assert.equal(p,person);assert.equal(index,2);return char;},
  drawIdol:(...args)=>drawCalls.push(args),getTime:()=>1234});
 assert.equal(viewer.open({nick:'invalid'},0),false,'a member without an avatar cannot open a portrait');
 assert.equal(viewer.open(person,2,opener),true,'a valid member opens the enlarged Polaroid');
 assert.equal(dialog.open,true,'portrait dialog is modal');
 assert.equal(dialog.elements.ktPosterTitle.textContent,'Idol','member nickname is shown');
 assert.equal(dialog.elements.ktPosterPortrait.attrs['aria-label'],'Retrato ampliado de Idol','portrait canvas has an accessible description');
 assert.equal(drawCalls.length,1,'the injected existing avatar renderer is called exactly once');
 assert.equal(drawCalls[0][1],char,'the renderer receives the character built by the page');
 assert.equal(drawCalls[0][7],1234,'the renderer receives the injected room clock');
 assert.equal(drawCalls[0][2],260);assert.equal(drawCalls[0][3],405);assert.equal(drawCalls[0][4],5.8);
 dialog.close();assert.equal(opener.focused,true,'focus returns to the opener when the portrait closes');
}
console.log('✓ Karaoke room controllers use explicit dependencies and preserve NPC mic + Polaroid behavior');
