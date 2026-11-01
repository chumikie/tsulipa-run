'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const Preview=require('../karaoke-music-preview.js');
const moduleCode=fs.readFileSync(path.join(__dirname,'..','karaoke-music-preview.js'),'utf8');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const start=html.indexOf('var songs={',html.indexOf('var kt=(function(){'));
const end=html.indexOf('\n};\n/* Cada musica',start);
assert(start>=0&&end>start,'all seven original procedural songs are defined');
const songs=new Function('return ('+html.slice(start+'var songs='.length,end+2)+');')();
const keys=['normal','fast','chill','tema','corrida','gacha','duo'];
assert.deepEqual(Object.keys(songs).sort(),keys.slice().sort(),'preview uses seven existing tracks');
const beatStart=html.indexOf('function beat(i,target){'),beatEnd=html.indexOf('/* Relógio único do ritmo',beatStart);
assert(beatStart>=0&&beatEnd>beatStart,'shared beat renderer accepts independent playback target');
const calls=[],sandbox={AC:{state:'running',currentTime:0},run:null,performance:{now:()=>0},hz:m=>440*Math.pow(2,(m-69)/12),voice:(frequency,duration,time,volume,type)=>calls.push({frequency,duration,time,volume,type})};
vm.createContext(sandbox);vm.runInContext(html.slice(beatStart,beatEnd)+'\nthis.previewBeat=beat;',sandbox,{timeout:1000});
for(const key of keys){
 calls.length=0;const song=songs[key],step=60000/song.bpm/2,preview={song,step,audioOrigin:0,audioReady:true,audioClock:true,cuesByStep:{}};
 for(let i=0;i<8;i++)sandbox.previewBeat(i,preview);
 const expected=440*Math.pow(2,(song.mel[0]-69)/12);
 assert(calls.some(v=>Math.abs(v.frequency-expected)<.01),key+' synthesizes original lead melody');
 assert(calls.length>8,key+' synthesizes harmony, bass and percussion');
}
function harness(extra){
 const elements=new Map(),events=[],context={state:'running',currentTime:0,destination:{},createGain(){return {gain:{value:1,setTargetAtTime(value){this.value=value;}},connect(destination){this.destination=destination;}};}};
 const get=id=>{if(!elements.has(id))elements.set(id,{textContent:'',value:id==='ktPreviewVolume'?70:0,disabled:false,dataset:{},handlers:{},setAttribute(){},addEventListener(type,fn){this.handlers[type]=fn;},querySelectorAll:()=>[]});return elements.get(id);};
 const player=Preview.create(Object.assign({getSong:key=>songs[key],getContext:()=>context,getResumePromise:()=>null,isMuted:()=>false,isBusy:()=>false,beat:(i,target)=>{assert.equal(target.audioReady,true,'preview target is marked ready for the shared synthesizer');events.push([target.songKey,i]);},silence:()=>events.push(['silence']),stopAmbient:()=>events.push(['ambient-stop']),restoreAmbient:()=>events.push(['ambient-resume']),stopVoicePreview:()=>events.push(['voice-stop']),getSelectedSong:()=>'normal',getElement:get,translate:s=>s},extra||{}));
 return {player,context,events,get};
}
const player=harness();
const gain=player.player.output(player.context);assert.equal(gain.gain.value,.7,'preview output starts at 70 percent');
player.get('ktPreviewVolume').value=35;player.get('ktPreviewVolume').handlers.input();
assert.equal(gain.gain.value,.35,'volume slider changes only the preview output gain');
assert.equal(player.player.play('normal'),true,'preview starts');
assert(player.events.some(e=>e[0]==='normal'&&e[1]===0),'preview schedules original melody');
assert.equal(player.player.state().songKey,'normal');
player.context.currentTime=.4;assert.equal(player.player.pause(),true,'preview pauses');
assert.equal(player.player.state().paused,true);
assert.equal(player.player.resume(),true,'preview resumes');
assert.equal(player.player.stop(true,'Stopped'),true,'preview stops');
assert.equal(player.player.state(),null);
assert(player.events.some(e=>e[0]==='ambient-resume'),'ambient sound can resume after preview');

/* Simula o relógio de áudio durante os 59 segundos completos de cada faixa.
   Isso protege contra prévias que começam corretamente, mas param antes do fim. */
const originalSetInterval=global.setInterval,originalClearInterval=global.clearInterval;
let scheduledPreviewTick=null,previewTimerId=0;
try{
 global.setInterval=fn=>{scheduledPreviewTick=fn;return ++previewTimerId;};
 global.clearInterval=()=>{scheduledPreviewTick=null;};
 for(const key of keys){
  const full=harness(),step=60000/songs[key].bpm/2,total=Math.floor(59000/step);
  assert.equal(full.player.play(key),true,key+' full preview starts');
  for(let ms=25;ms<=59000;ms+=25){
   full.context.currentTime=.06+ms/1000;
   if(scheduledPreviewTick)scheduledPreviewTick();
  }
  assert.equal(full.player.state(),null,key+' preview finishes after the full 59-second arrangement');
  const heard=full.events.filter(event=>event[0]===key).map(event=>event[1]);
  assert.equal(heard.length,total,key+' schedules every musical step through the end');
  assert.equal(heard[0],0,key+' begins at the first musical step');
  assert.equal(heard[heard.length-1],total-1,key+' reaches the final musical step');
 }
}finally{
 global.setInterval=originalSetInterval;
 global.clearInterval=originalClearInterval;
}

const blocked=harness({isBusy:()=>true});
assert.equal(blocked.player.play('fast'),false,'preview cannot run during a game');

const libraryStart=html.indexOf('id="ktAudioLibrary"'),playerStart=html.indexOf('id="ktPreviewPlayer"',libraryStart),libraryEnd=html.indexOf('</section>',playerStart);
assert(libraryStart>=0&&playerStart>libraryStart&&libraryEnd>playerStart,'library contains player');
const library=html.slice(libraryStart,libraryEnd);
for(const key of keys){
 assert(library.includes('data-kt-song-preview="'+key+'"'),key+' has Listen');
 assert(library.includes('data-kt-song-select="'+key+'"'),key+' keeps Select');
 assert(library.includes('data-kt-song-best="'+key+'"'),key+' keeps personal best');
}
for(const id of ['ktPreviewToggle','ktPreviewStop','ktPreviewProgress','ktPreviewTime','ktPreviewTitle','ktPreviewVolume'])assert(library.includes('id="'+id+'"')||(id==='ktPreviewVolume'&&library.includes('id=ktPreviewVolume')),'player includes '+id);
assert(html.includes('<script src="./karaoke-music-preview.js?v=1"></script>'),'external controller loads');
assert(html.includes('window.KaraokeMusicPreview.create('),'game injects existing synthesizer');
assert(moduleCode.includes('audioReady:true'),'independent preview marks its target ready for the shared beat renderer');
assert(html.includes('KaraokeAvatar.draw(ctx,CH[index],44,82,1,'),'voice library renders full-body miniatures using the shared avatar renderer');
assert(html.includes('<canvas class="kt-library-face" width="88" height="96"'),'voice miniatures have a full-body canvas');
assert(!html.includes('data-kt-audio="encontro"'),'Encounter special audio button is absent from this library');
assert(!html.includes("'encontro':1"),'Encounter audio is not exposed as a voice-library clip');
assert((html.includes('id="ktPreviewVolume"')||html.includes('id=ktPreviewVolume'))&&moduleCode.includes('addEventListener("input"'),'player includes a working volume slider');
assert(html.includes("window.addEventListener('pagehide',function(){previewPlayer.stop(false);"),'pagehide stops preview');
assert(html.includes("document.addEventListener('visibilitychange',function(){if(document.hidden){previewPlayer.stop(false);"),'hidden page stops preview');
console.log('✓ Music preview: seven tracks, separate listen/select, independent player, no game/ticket/ranking admission');
