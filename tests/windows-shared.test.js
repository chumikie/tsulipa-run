'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8'),source=read('tw-windows.js');
for(const file of ['index.html','sora-jump.html','karaoke-time.html']){
 const s=read(file);
 assert(s.includes('./tw-windows.css?v=1'),file+' must load shared chrome');
 assert(s.includes('./tw-windows.js?v=1'),file+' must load shared focus/viewport adapter');
}
assert(!read('karaoke-time.html').includes('ktLaunchLayout'),'Obsolete Karaoke header patch must stay removed');
assert(!read('sora-embed.css').includes('html.tw-sora-embed #soraOv .bp-title{'),'Embedded Sora must use shared type');
assert(read('tw-windows.css').includes('var(--card)'),'Shared surface must use active palette');
let update,cleanup,value;
const media={matches:false,addEventListener:(e,f)=>{update=f;},removeEventListener:(e,f)=>assert.equal(f,update)};
const parent={matchMedia:()=>media},frame={parent,addEventListener:(e,f)=>{cleanup=f;}};
vm.runInNewContext(source,{window:frame,document:{addEventListener:()=>{},documentElement:{style:{setProperty:(k,v)=>{value=v;}}}}});
assert.equal(value,'35px');media.matches=true;update();assert.equal(value,'24px');cleanup();
console.log('Shared windows: loading, legacy cleanup, palette, host/iframe type and resize cleanup passed');

const karaoke=read('karaoke-time.html'),karaokePopup=read('karaoke-popup.css');
assert(karaokePopup.includes('.tw-preview-game[data-karaoke-tela]{background:transparent!important;background-image:none!important}'),'Karaoke screen inherits the external page background');
assert(karaoke.includes('html.tw-karaoke-embed.kt-no-site body.tw-game-karaoke{background:transparent!important}'),'Embedded body must not paint a second background');
assert(karaoke.includes('for(var i=0;i<3;i++){var row=rows[i]||null')&&karaoke.includes("tr('Em breve')"),'Weekly scoreboard must keep three numbered positions and coming-soon placeholders');
assert(karaoke.includes('function ktMonitorSomViva')&&karaoke.includes("caixaToque('left')")&&karaoke.includes("caixaToque('right')"),'Both small monitors have their own speaker interaction');
assert(karaoke.includes("ktCaixaPulso.alvo=alvo||'grande'")&&karaoke.includes('py>=350&&py<=464'),'Large speaker hit-zone excludes the plant above it');
assert(!karaoke.slice(karaoke.indexOf('function ktCaixaSomViva'),karaoke.indexOf('function ktEstrelinha')).includes('x.scale(sc,sc)'),'Large speaker cabinet is not scaled away from the plant');
console.log('Karaoke background, scoreboard, speaker interactions and plant hit-zone checks passed');
