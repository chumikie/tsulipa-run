/* Local visual regression: no real account, external requests or online attempts.
   NODE_PATH=/path/to/node_modules node tests/karaoke-mobile.browser.cjs /tmp/karaoke-qa
   QA_BASELINE=1 captures HEAD before the working-tree changes, without assertions. */
'use strict';
const {chromium,webkit}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),out=process.argv[2]||'/tmp/karaoke-mobile-qa';
const baseline=process.env.QA_BASELINE==='1',baseRef=process.env.QA_BASE_REF||'HEAD';
fs.mkdirSync(out,{recursive:true});
const fixture=`window.qaKaraoke=function(){hubComecou=true;muted=true;hubMostrar();hubMusicaParar();twPreviewAbrirJogo('karaoke');};\nhubMostrar();\n// Só`;
const fonts=fs.readFileSync(path.join(root,'kt-fonts.css'),'utf8');
const server=http.createServer((req,res)=>{
 const name=new URL(req.url,'http://local').pathname.slice(1)||'index.html';
 const file=path.resolve(root,name);
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try{
  let data=baseline?execFileSync('git',['show',baseRef+':'+name],{cwd:root,maxBuffer:8e6}):fs.readFileSync(file);
  if(name==='index.html'){
   data=data.toString().replace('\nhubMostrar();\n// Só','\n'+fixture);
   assert(data.includes('window.qaKaraoke='),'Local fixture injection point changed');
  }
  if(name==='karaoke-time.html')data=data.toString().replace('function ktNoSite(){',`window.qaRoomState=function(){return {members:krBots.map(function(b){return {x:b.x,y:b.y};}),attempts:krRhythmRun?krRhythmRun.attempts:0,flash:krRhythmRun?krRhythmRun.flash:[]};};\nfunction ktNoSite(){`);
  res.setHeader('Content-Type',name.endsWith('.css')?'text/css':name.endsWith('.js')?'application/javascript':name.endsWith('.html')?'text/html':'application/octet-stream');
  res.end(data);
 }catch(e){res.writeHead(404).end();}
});
let browser;
const results=[];
async function metrics(frame){
 return frame.locator('body').evaluate(body=>{
  const rect=id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom};};
  const banner=document.getElementById('ktAvailability'),view=document.querySelector('.kt-room-viewport');
  const c=document.getElementById('krCv').getBoundingClientRect(),v=(view||document.getElementById('krPalco')).getBoundingClientRect();
  const read=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom,right:r.right};};
  return {viewport:innerWidth,scroll:document.documentElement.scrollWidth,scene:rect('krPalco'),canvas:rect('krCv'),toolbar:rect('ktStart'),weekly:rect('ktWeeklyRanks'),banner:rect('ktAvailability'),bannerOpacity:getComputedStyle(banner).opacity,
   roomView:read(view||document.getElementById('krPalco')),crop:{left:(v.left-c.left)*960/c.width,right:(v.right-c.left)*960/c.width},
   tools:[rect('krMute'),rect('ktFoto')],toolsParent:document.getElementById('krMute').parentElement.className,
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
    assert(Math.abs(idle.canvas.w/idle.canvas.h-16/9)<.01,'Canvas retains original proportions');
    if(width>620)assert(Math.abs(idle.canvas.w-idle.scene.w)<1&&Math.abs(idle.canvas.h-idle.scene.h)<1,'Desktop canvas fits the room');
    for(const r of idle.controls)assert(r.x>=0&&r.right<=width+1,r.id+' fits the viewport');
    if(width<=620){
     assert(Math.abs(idle.crop.left-48)<.1&&Math.abs(idle.crop.right-912)<.1,'Only the decorative side margins are cropped');
     const bounds=await frame.locator('body').evaluate(()=>window.qaRoomState());
     // The complete cached sprite covers every pose. Use the largest standing
     // scale (2.3) for a conservative bound; seated members are only 2.06.
     for(const b of bounds.members){
      const left=b.x-(b.x>480?45:31)*2.3,right=b.x+(b.x>480?31:45)*2.3;
      assert(left>=idle.crop.left&&right<=idle.crop.right,'Entire member sprite, including animation envelope, remains visible');
     }
     assert(120-31*2.3>=idle.crop.left&&840+31*2.3<=idle.crop.right,'Walking limits retain the complete player sprite');
     for(const r of idle.tools)assert(r.bottom<=idle.roomView.y+.1&&r.x>=idle.scene.x&&r.right<=idle.scene.right,'Tools occupy their own band above the picture');
     assert(idle.tools[1].right>idle.scene.right-12,'Tools stay in upper right');
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
     assert(Math.abs(playing.crop.left-48)<.1,'Mild crop also preserves the audience during play');
     assert(playing.weekly.y>=playing.scene.bottom,'Ranking stays below the game while playing');
     // Test the real pointer-to-logical-canvas conversion after cropping.
     await p.waitForTimeout(1200);
     const canvas=frame.locator('#krCv');
     for(let lane=0;lane<4;lane++){
      await canvas.click({position:{x:(286+(lane+.5)*97)*playing.canvas.w/960,y:160*playing.canvas.h/540}});
      const flash=await frame.locator('body').evaluate(()=>window.qaRoomState().flash);
      assert(flash[lane]>0,'Touch reaches rhythm lane '+lane+' after cropping');
     }
     await frame.locator('#ktViewMobile').click();
     const overview=await metrics(frame);
     assert(Math.abs(overview.crop.left)<.1&&Math.abs(overview.crop.right-960)<.1,'Full room toggle restores the entire canvas');
     await frame.locator('#ktViewMobile').click();
     const cropped=await metrics(frame);
     assert(Math.abs(cropped.crop.left-48)<.1,'Second toggle restores gentle crop');
     const soundBefore=await frame.locator('#krMute').innerText();
     await frame.locator('#krMute').click();
     assert.notEqual(await frame.locator('#krMute').innerText(),soundBefore,'Moved sound button still toggles');
     await frame.locator('#krMute').click();
     assert.equal(await frame.locator('#krMute').innerText(),soundBefore,'Sound toggles back');
     const photoDownload=p.waitForEvent('download');
     await frame.locator('#ktFoto').click();
     assert((await photoDownload).suggestedFilename().endsWith('.png'),'Moved camera still exports the photo');
    }
   }
   await p.screenshot({path:path.join(out,engine+'-'+width+'-playing.png'),fullPage:true});
   if(!baseline&&width<=620){
    await frame.locator('#ktEnd').click();
    await p.setViewportSize({width:1000,height:900});
    const restored=await metrics(frame);
    assert.equal(restored.toolsParent,'krpalco','Desktop restores original sound parent');
    assert(Math.abs(restored.scene.w-restored.canvas.w)<1,'Resize to desktop removes crop');
    await p.setViewportSize({width,height:900});
    const mobileAgain=await metrics(frame);
    assert(Math.abs(mobileAgain.crop.left-48)<.1,'Resize back restores mobile crop');
    assert.equal(await frame.locator('.kt-room-tools #krMute').count(),1,'No duplicate sound button after resize');
   }
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
