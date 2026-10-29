// Static pre-merge checks for the TsuLiPa World special games.
// Run: node tests/validate-games.js
// No packages, database credentials or network access required.
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const games=[
  {file:"sora-jump-karaoke.html",max:40000},
  {file:"index2.html",max:1050000},
  {file:"sora-jump.html",max:400000},
  {file:"karaoke-day.html",max:150000}
];
let errors=[];
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const assert=(ok,message)=>{if(!ok)errors.push(message);};

for(const game of games){
  let content;
  try{content=read(game.file);}catch(e){errors.push("Missing "+game.file);continue;}
  const bytes=Buffer.byteLength(content,"utf8");
  assert(bytes<game.max,game.file+": over HTML size budget ("+bytes+" bytes)");
  assert(content.includes("</body>")&&content.includes("</html>"),game.file+": missing closing HTML tags");
  let count=0;
  for(const match of content.replace(/<!--[\s\S]*?-->/g,"").matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(/\bsrc\s*=/i.test(match[1]))continue;
    count++;
    try{new vm.Script(match[2],{filename:game.file+":inline-"+count});}
    catch(e){errors.push(game.file+": invalid JavaScript (script "+count+"): "+e.message);}
  }
  assert(count>0,game.file+": no inline game JavaScript found");
  console.log("✓",game.file,bytes+" bytes",count+" inline scripts");
}

let hub="",karaoke="",sora="",preview="";
try{
  hub=read("sora-jump-karaoke.html");
  preview=read("index2.html");
  karaoke=read("karaoke-day.html");
  sora=read("sora-jump.html");
}catch(_){/* Already reported above */}

for(const ref of ["sora-jump.html","karaoke-day.html"]){
  assert(hub.includes('data-open="'+ref+'"'),"Hub missing launcher for "+ref);
}
assert(hub.includes("games-theme.css"),"Hub missing shared theme");
assert(preview.includes('class="hubcard tw-hubgame')&&preview.includes("twPreviewAbrirJogo"),
  "index2 missing integrated game cards or launchers");
assert(preview.includes('name="robots" content="noindex,nofollow,noarchive"'),"index2 must be noindex");
assert(!read("index.html").includes("twPreviewAbrirJogo"),"Production index.html must not contain preview-specific code");
assert(sora.includes("games-theme.css"),"Sora missing shared theme");
assert(karaoke.includes("games-theme.css"),"Karaoke missing shared theme");
assert(sora.includes("soraSetupUI")&&sora.includes("soraOpenUI"),"Sora core integration missing");
assert(karaoke.includes("rpc/karaoke_posteres_semana"),"Karaoke missing shared weekly avatar RPC");
assert(karaoke.includes("krAgendarLoop")&&karaoke.includes("logicalW=960,logicalH=540"),
  "Karaoke mobile draw/click coordination changed");
assert(karaoke.includes('id="krDev" hidden'),"Karaoke simulator must start collapsed");
assert(karaoke.includes("krHandBusy")&&karaoke.includes("krClearHandheld"),
  "Karaoke handheld exclusivity missing");
assert(fs.existsSync(path.join(root,"games-theme.css")),"Missing games-theme.css");
assert(fs.existsSync(path.join(root,"index.html")),"Missing canonical index.html");

if(errors.length){
  errors.forEach(err=>console.error("✗",err));
  process.exitCode=1;
}else{
  console.log("✓ All static validation checks passed. Browser and gameplay QA still required.");
}
