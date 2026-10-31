/* Local visual regression: no real account, external requests or online attempts.
   NODE_PATH=/path/to/node_modules node tests/karaoke-mobile.browser.cjs /tmp/karaoke-qa
   QA_BASELINE=1 captures HEAD before the working-tree changes, without assertions. */
'use strict';
const {chromium,webkit}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),out=process.argv[2]||'/tmp/karaoke-mobile-qa';
const baseline=process.env.QA_BASELINE==='1';
fs.mkdirSync(out,{recursive:true});
const fixture=`window.qaKaraoke=function(){hubComecou=true;muted=true;hubMostrar();hubMusicaParar();twPreviewAbrirJogo('karaoke');};\nhubMostrar();\n// Só`;
const fonts=fs.readFileSync(path.join(root,'kt-fonts.css'),'utf8');
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://local').pathname.slice(1)||'index.html';
 const file=path.resolve(root,name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{
  let data=baseline?execFileSync('git',['show','HEAD:'+name],{cwd:root,maxBuffer:8e6}):fs.readFileSync(file);
  if(name==='index.html'){
   data=data.toString().replace('\nhubMostrar();\n// Só','\n'+fixture);
   assert(data.includes('window.qaKaraoke='),'Local fixture injection point changed');
  }
  res.setHeader('Content-Type',name.endsWith('.css')?'text/css':name.endsWith('.js')?'application/javascript':name.endsWith('.html')?'text/html':'application/octet-stream');
  res.end(data);
 }catch(e){res.writeHead(404).end();}
});
let browser;
const results=[];
async function metrics(frame){
 return frame.locator('body').evaluate(body=>{
  const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
  const banner=document.getElementById('ktAvailability');
  return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,scene:rect('krPalco'),canvas:rect('krCv'),toolbar:rect('ktStart'),weekly:rect('ktWeeklyRanks'),banner:rect('ktAvailability'),bannerOpacity:getComputedStyle(banner).opacity,
   controls:['ktSong','ktStart','ktSession','ktPause','ktEnd','ktScore'].map(id=>({id,...rect(id)})),playing:body.classList.contains('kt-playing')};
 });
}
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const origin='http://127.0.0.1:'+server.address().port;
 for(const engine of (process.env.QA_WEBKIT?['chromium','webkit']:['chromium'])){
  browser=await ({chromium,webkit}[engine]).launch({headless:true,args:engine==='chromium'?['--no-sandbox','--disable-dev-shm-usage']:[]});
  for(const width of (process.env.QA_WIDTHS||'320,390,430,844,1440').split(',').map(Number)){
   const context=await browser.newContext({viewport:{width,height:width===844?390:900},colorScheme:'dark'});
   await context.addInitScript(()=>{localStorage.setItem('brs48cr_tut','1');localStorage.setItem('brs48cr_nick','QA Idol');});
   const p=await context.newPage(),errors=[];
   p.on('pageerror',e=>errors.push(e.message));
   await p.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.request().url().includes('fonts.googleapis.com')?r.fulfill({contentType:'text/css',body:fonts}):r.abort());
   await p.goto(origin);
   await p.evaluate(()=>window.qaKaraoke());
   const frame=p.frameLocator('#twPreviewIframe');
   await frame.locator('#krCv').waitFor({state:'visible'});
   await frame.locator('#ktAvailability').evaluate(()=>document.fonts.ready);
   await p.waitForTimeout(6200); // Includes the existing 4.5s banner timer + opacity transition.
   const idle=await metrics(frame);
   if(!baseline){
    assert.equal(await p.locator('#best').isVisible(),false,'Center score is absent only while Karaoke is open');
    assert(idle.scroll<=idle.viewport+1,'No horizontal overflow');
    assert(Math.abs(idle.scene.w/idle.scene.h-16/9)<.01,'Idle room keeps original proportions');
    assert(Math.abs(idle.canvas.w-idle.scene.w)<1&&Math.abs(idle.canvas.h-idle.scene.h)<1,'Entire canvas fits the room');
    for(const r of idle.controls)assert(r.x>=0&&r.right<=width+1,r.id+' fits the viewport');
    if(width<=620){
     assert.equal(idle.bannerOpacity,'1','Mobile attempts remain visible after fade timer');
     assert(idle.weekly.y-idle.banner.bottom<=12,'No blank block before ranking');
     assert(idle.banner.y-idle.scene.bottom<=10,'Compact spacing below scene');
    }
   }
   await p.screenshot({path:path.join(out,engine+'-'+width+'-idle.png'),fullPage:true});
   await frame.locator('#ktStart').click(); // Local offline storage only; all external requests are blocked.
   await frame.locator('body.kt-playing').waitFor();
   const playing=await metrics(frame);
   if(!baseline){
    assert(playing.scroll<=playing.viewport+1,'Playing does not widen the document');
    if(width<=620){
     assert(playing.weekly.y>=playing.scene.bottom,'Ranking stays below the game while playing');
     await frame.locator('#ktViewMobile').click();
     const overview=await metrics(frame);
     assert(Math.abs(overview.scene.w/overview.scene.h-16/9)<.01,'Full room toggle restores original ratio');
    }
   }
   await p.screenshot({path:path.join(out,engine+'-'+width+'-playing.png'),fullPage:true});
   await p.locator('#twPreviewVoltar').click();
   if(!baseline)assert.equal(await p.locator('#best').isVisible(),true,'Returning to Center restores its score');
   assert.deepEqual(errors,[]);
   results.push({engine,width,idle,playing});
   console.log(engine,width,'idle + play + return passed');
   await context.close();
  }
  await browser.close();browser=null;
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
