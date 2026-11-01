'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const karaoke=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const source=fs.readFileSync(path.join(root,'tw-avatar-hair.js'),'utf8');
const cuts=['onduladom','onduladom2','onduladof'];
for(const [name,html] of [['Center Run / Perfil',index],['Karaoke',karaoke]]){
 assert(html.includes('<script src="./tw-avatar-hair.js?v=1"></script>'),name+' loads original 2D hair');
 for(const hook of ['back','top','fringe','bicolor'])assert(html.includes('TWAvatarHair.'+hook+'('),name+' retains '+hook+' render layer');
 assert(html.includes("b==='onduladof'?9:14"),name+' keeps female waves above Pixie length');
 assert(html.includes("b==='onduladom'||b==='onduladom2'?7"),name+' keeps male waves short');
}
for(const cut of cuts)assert(index.includes('value="'+cut+'"'),'hair menu retains '+cut);
assert(index.includes("['cback', 'back'], ['cfront', 'front'], ['cdet', 'det']]"),'Profile editor reuses haircut selector');
assert(index.includes("PERF_CAMPOS = ['hair', 'hair2', 'streak', 'skin', 'eye', 'back'"),'Profile saves back haircut');
assert(karaoke.includes("JSON.parse(read('brs48cr_cu2')"),'Karaoke imports saved Idol look');
assert(source.includes("g.rect(x-3,y-4,18,34)"),'original two-color hair half preserved');
assert(source.includes("E(x+2,y+20,3.5,6,-.12)"),'original female wave side volume preserved');
const sandbox={window:{}};vm.runInNewContext(source,sandbox,{timeout:1000});
const hair=sandbox.window.TWAvatarHair;
let ops=[];const grad={addColorStop(){}};
const g=new Proxy({}, {get(obj,key){if(key==='createLinearGradient')return ()=>grad;if(key in obj)return obj[key];return (...args)=>ops.push([key,...args]);},set(obj,key,value){obj[key]=value;return true;}});
const E=(...args)=>ops.push(['E',...args]);
const T=(...args)=>ops.push(['T',...args]);
for(const cut of cuts){
 ops=[];const c={hair:'#335577',hair2:'#aabbcc'};
 assert.equal(hair.isWavy(cut),true);
 assert.equal(hair.back(g,c,0,0,cut,E,T),true);
 hair.top(g,0,0,cut);hair.fringe(g,0,0,cut,T);hair.bicolor(g,c,0,0,cut);
 assert(ops.length>5,cut+' draws wave details');
 if(cut==='onduladom2')assert(ops.some(op=>op[0]==='rect'),cut+' clips the secondary hair color');
}
assert.equal(hair.isWavy('chanel'),false);
assert.equal(hair.back(g,{hair:'#fff'},0,0,'chanel',E,T),false);
console.log('✓ Original three wavy haircuts: 2D layering, saved values and Karaoke parity');
