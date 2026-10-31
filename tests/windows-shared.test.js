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
