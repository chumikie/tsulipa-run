'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const start=html.indexOf('var songs={',html.indexOf('var kt=(function(){'));
const end=html.indexOf('\n};\n/* Cada musica',start);
assert(start>=0&&end>start,'all seven original procedural songs are defined');
const songs=new Function('return ('+html.slice(start+'var songs='.length,end+2)+');')();
const keys=['normal','fast','chill','tema','corrida','gacha','duo'];
assert.deepEqual(Object.keys(songs).sort(),keys.slice().sort(),'the preview uses exactly the seven existing rhythm tracks');

const beatStart=html.indexOf('function beat(i,target){');
const beatEnd=html.indexOf('/* Relógio único do ritmo',beatStart);
assert(beatStart>=0&&beatEnd>beatStart,'shared musical beat renderer accepts an independent playback target');
const calls=[];
const sandbox={
  AC:{state:'running',currentTime:0},
  run:null,
  performance:{now:()=>0},
  hz:m=>440*Math.pow(2,(m-69)/12),
  voice:(frequency,duration,time,volume,type)=>calls.push({frequency,duration,time,volume,type})
};
vm.createContext(sandbox);
vm.runInContext(html.slice(beatStart,beatEnd)+'\nthis.previewBeat=beat;',sandbox,{timeout:1000});
for(const key of keys){
  calls.length=0;
  const song=songs[key],step=60000/song.bpm/2;
  const preview={song,step,audioOrigin:0,audioReady:true,audioClock:true,cuesByStep:{}};
  for(let i=0;i<8;i++)sandbox.previewBeat(i,preview);
  const expected=440*Math.pow(2,(song.mel[0]-69)/12);
  assert(calls.some(v=>Math.abs(v.frequency-expected)<.01),key+' preview must synthesize the original lead melody');
  assert(calls.length>8,key+' preview must synthesize accompaniment, bass and percussion with the lead');
}

const libraryStart=html.indexOf('id="ktAudioLibrary"');
const playerStart=html.indexOf('id="ktPreviewPlayer"',libraryStart);
const libraryEnd=html.indexOf('</section>',playerStart);
assert(libraryStart>=0&&playerStart>libraryStart&&libraryEnd>playerStart,'music library includes the shared preview player');
const library=html.slice(libraryStart,libraryEnd);
for(const key of keys){
  assert(library.includes('data-kt-song-preview="'+key+'"'),key+' has an independent Listen action');
  assert(library.includes('data-kt-song-select="'+key+'"'),key+' keeps its independent Select action');
  assert(library.includes('data-kt-song-best="'+key+'"'),key+' retains its personal-record slot');
}
for(const id of ['ktPreviewToggle','ktPreviewStop','ktPreviewProgress','ktPreviewTime','ktPreviewTitle'])
  assert(library.includes('id="'+id+'"'),'shared player includes '+id);

const previewStart=html.indexOf('function previewSong(key){');
const previewEnd=html.indexOf('\nfunction previewPause()',previewStart);
assert(previewStart>=0&&previewEnd>previewStart,'a separate preview playback path exists');
const previewSource=html.slice(previewStart,previewEnd);
assert(!previewSource.includes('ktMeta.begin')&&!previewSource.includes('ticketAdmission')&&!previewSource.includes('ktOnline'),'listening cannot admit a show, spend a ticket or write a ranking');
assert(html.includes('previewStop(false);if(typeof ktAudioVitrine'), 'starting a real show stops the preview first');
assert(html.includes("document.addEventListener('visibilitychange',function(){if(document.hidden){previewStop(false);"),'hidden pages stop preview audio');
assert(html.includes("window.addEventListener('pagehide',function(){previewStop(false);"),'leaving the page stops preview audio');
assert(html.includes('kt.stopPreview(false);kt.allowExit();'),'closing the Karaoke page releases preview audio');
console.log('✓ Karaoke music preview: seven original compositions, independent listen/select controls, shared Web Audio beat renderer, progress/stop/pause lifecycle, and no admission or ranking writes');
