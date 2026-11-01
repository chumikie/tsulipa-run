/* Local visual regression: no real account, external requests or online attempts.
   NODE_PATH=/path/to/node_modules node tests/karaoke-mobile.browser.cjs /tmp/karaoke-qa
   QA_BASELINE=1 captures HEAD before the working-tree changes, without assertions. */
'use strict';
const {chromium,webkit}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
const photoQA=process.env.QA_PHOTO||process.env.QA_PHOTO_STANDALONE?require('./karaoke-photo-flow.cjs'):null;
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
  if(name==='karaoke-time.html')data=data.toString().replace('function ktNoSite(){',`window.qaRoomState=function(){return {
   members:krBots.map(function(b){return {x:b.x,y:b.y};}),attempts:krRhythmRun?krRhythmRun.attempts:0,flash:krRhythmRun?krRhythmRun.flash:[],active:kt.active(),paused:kt.paused(),session:krRhythmRun&&krRhythmRun.session&&krRhythmRun.session.token,
   pets:ktPets.map(function(p){return {k:p.k,x:p.x,y:p.y,hitY:p.hitY,ex:p.ex,taps:p.toques||0,visit:p.visita?{phase:p.visita.phase,nome:p.visita.nome}:null};}),
   pandeiro:{x:ktPandeiro.x,y:ktPandeiro.y,t0:ktPandeiro.t0},extra:typeof ktPandeiroExtra==='undefined'?null:{x:ktPandeiroExtra.x,y:ktPandeiroExtra.y,t0:ktPandeiroExtra.t0}
  };};
  window.qaRoomControllers={
   openPoster:function(index){var pos=KR_ROOM_POSTER_POS[index],bob=Math.sin(index*1.4)*2,canvas=document.getElementById('krCv'),rect=canvas.getBoundingClientRect(),clientX=rect.left+pos[0]*rect.width/960,clientY=rect.top+(pos[1]+bob+10)*rect.height/540,event=new PointerEvent('pointerdown',{bubbles:true,cancelable:true,clientX:clientX,clientY:clientY,pointerId:1,pointerType:'mouse',isPrimary:true});canvas.dispatchEvent(event);return {opened:!!document.getElementById('ktPosterDialog')&&document.getElementById('ktPosterDialog').open,defaultPrevented:event.defaultPrevented,posterCount:KR_ROOM_POSTER_DRAW.length,frame:pos,canvas:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},client:{x:clientX,y:clientY},hasDecorator:!!(ktDecor&&ktDecor.hit)};},
   startAutomaticMic:function(){
    if(krRhythmRun)kt.end(false);if(krDemoCantor)krDemoBotEnd();
    krSt.aberta=true;krEu.no_mic=false;krEu.x=krEu.tx=480;krEu.y=krEu.ty=286;
    krMeuRetornoAt=0;krMeuVoltandoAoMic=false;krMoveQueue.length=0;krDemoFila.length=0;
    krLoungeActors.forEach(function(actor){actor._ktLoungeWalking=false;});krLoungeActors.length=0;
    krAutoMicNextAt=krT-1;var before=ktMeta.controls().used;
    if(typeof window.krLoungeAutoMicTick!=='function')return {available:false};
    window.krLoungeAutoMicTick();
    return {available:true,active:kt.active(),bot:krDemoCantor&&krDemoCantor.bot.nick,automatic:!!(krDemoCantor&&krDemoCantor.automatic),singing:!!(krDemoCantor&&krDemoCantor.bot.no_mic),practice:!!(krRhythmRun&&krRhythmRun.practice),usedBefore:before,usedAfter:ktMeta.controls().used};
   },
   inspectAdmission:function(){var dialog=document.getElementById('ktStartConfirm'),accept=document.getElementById('ktConfirmAccept');return {roomOpen:krSt.aberta,playerAtMic:krEuNoMicrofone(),playerNoMic:krEu.no_mic,active:kt.active(),paused:kt.paused(),confirmOpen:!!(dialog&&dialog.open),acceptDisabled:!!(accept&&accept.disabled),startDisabled:$('ktStart').disabled,meta:ktMeta.controls(),online:window.ktOnline.online(),queueLength:krDemoFila.length,singer:!!krDemoCantor};},
   stopAutomaticMic:function(){if(krRhythmRun)kt.end(false);if(krDemoCantor)krDemoBotEnd();}
  };
\nfunction ktNoSite(){`);
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
  for(const width of (process.env.QA_PHOTO_STANDALONE?[]:(process.env.QA_WIDTHS||'320,390,430,844,1440').split(',').map(Number))){
   const context=await browser.newContext({viewport:{width,height:width===844?390:900},colorScheme:photoQA&&width===320?'light':'dark'});
   if(photoQA)await photoQA.install(context);
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
     const soundTool=idle.tools[0],cameraTool=idle.tools[1];assert(soundTool.right<=cameraTool.x||cameraTool.right<=soundTool.x||soundTool.bottom<=cameraTool.y||cameraTool.bottom<=soundTool.y,'Sound and camera controls never overlap, even when the tools wrap');
     assert.equal(idle.bannerOpacity,'1','Mobile attempts remain visible after fade timer');
     assert(idle.weekly.y-idle.banner.bottom<=12,'No blank block before ranking');
     assert(idle.banner.y-idle.scene.bottom<=10,'Compact spacing below scene');
    }
   }
   await p.screenshot({path:path.join(out,engine+'-'+width+'-idle.png'),fullPage:true});
   if(!baseline){
    const posterClick=await frame.locator('body').evaluate(()=>window.qaRoomControllers.openPoster(0));assert.equal(posterClick.opened,true,'wall Polaroid opens through the real canvas pointer event: '+JSON.stringify(posterClick));
    const poster=frame.locator('#ktPosterDialog');await poster.waitFor({state:'visible'});
    const portrait=frame.locator('#ktPosterPortrait');
    const portraitInfo=await portrait.evaluate(canvas=>{const ctx=canvas.getContext('2d'),pixels=ctx.getImageData(40,40,440,460).data;let ink=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]&&((pixels[i]>90&&pixels[i]<245)||(pixels[i+1]>70&&pixels[i+1]<225)||(pixels[i+2]>70&&pixels[i+2]<245)))ink++;return {width:canvas.width,height:canvas.height,ink};});
    assert.equal(portraitInfo.width,520);assert.equal(portraitInfo.height,620);assert(portraitInfo.ink>1000,'enlarged portrait canvas contains rendered artwork, not just an empty dialog');
    await poster.screenshot({path:path.join(out,engine+'-'+width+'-polaroid.png')});
    await poster.evaluate(dialog=>dialog.close());await poster.waitFor({state:'hidden'});
    const autoMic=await frame.locator('body').evaluate(()=>window.qaRoomControllers.startAutomaticMic());
    assert.equal(autoMic.available,true,'automatic mic factory is bound to page-private room state');
    assert.equal(autoMic.active,true,'autonomous NPC starts the local practice engine');
    assert(autoMic.bot&&autoMic.automatic&&autoMic.singing&&autoMic.practice,'eligible NPC is singing in an automatic, non-ranked practice turn');
    assert.equal(autoMic.usedAfter,autoMic.usedBefore,'autonomous NPC show does not spend the player attempt');
    await frame.locator('body').evaluate(()=>window.qaRoomControllers.stopAutomaticMic());
    assert.equal(await frame.locator('body').evaluate(()=>window.qaRoomState().active),false,'autonomous mic test cleans up without leaving the game active');
   }
   let reactions=null;
   if(!baseline&&process.env.QA_REACTIONS){
    const getState=()=>frame.locator('body').evaluate(()=>window.qaRoomState());
    const touch=async(px,py)=>{const r=await frame.locator('#krCv').boundingBox();await frame.locator('#krCv').click({position:{x:px*r.width/960,y:py*r.height/540}});};
    let state=await getState();
    await touch(state.pandeiro.x,state.pandeiro.y);const table=await getState();assert(table.pandeiro.t0>=0,'Original pandeiro still reacts');
    await touch(state.extra.x,state.extra.y);state=await getState();assert(state.extra.t0>=table.pandeiro.t0,'New pandeiro reacts at its rendered position');
    assert.equal(state.pandeiro.t0,table.pandeiro.t0,'New instrument has independent shake state');
    const visits=[];
    for(const i of [2,1,0]){
     let before;
     for(let tries=0;tries<25;tries++){
      const pets=(await getState()).pets;before=pets[i];
      if(pets.every((other,j)=>j===i||Math.hypot(other.x-before.x,other.hitY-before.hitY)>54))break;
      await p.waitForTimeout(100);
     }
     await touch(before.x,before.hitY);
     const after=(await getState()).pets[i];assert(after.taps>before.taps&&after.visit,'Pet '+before.k+' reacts at its current drawn location: '+JSON.stringify({before,after}));
     assert(['feliz','amor'].includes(after.ex),'Pet uses a visible facial expression');
     await p.waitForTimeout(400);const moved=(await getState()).pets[i];
     assert(Math.hypot(moved.x-before.x,moved.y-before.y)>12,'Pet leaves its orbit to visit a nearby Idol');
     visits.push({k:before.k,expression:after.ex,idol:after.visit.nome});
    }
    await frame.locator('#krPalco').screenshot({path:path.join(out,engine+'-'+width+'-visits.png')});
    let settled=false;
    for(let tries=0;tries<60;tries++){
     if((await getState()).pets.every(p=>!p.visit)){settled=true;break;}
     await p.waitForTimeout(250);
    }
    assert(settled,'All three pets return to their idle orbit');
    reactions={pandeiros:true,visits,returned:true};
    console.log(engine,width,'both pandeiros + three pet visits/return passed');
   }
   await frame.locator('#ktStart').click(); // Local offline storage only; all external requests are blocked.
   await frame.locator('#ktStartConfirm').waitFor({state:'visible'});
   await frame.locator('#ktConfirmAccept').evaluate(button=>{if(button.disabled)throw new Error('Show confirmation is unexpectedly disabled');button.click();}); // Preserve the game's explicit admission confirmation.
   await p.waitForTimeout(500);
   const admission=await frame.locator('body').evaluate(()=>window.qaRoomControllers.inspectAdmission());console.log('Karaoke browser admission:',JSON.stringify(admission));
   await frame.locator('body.kt-playing').waitFor();
   const photo=photoQA&&!baseline?await photoQA.verify(p,frame,width,out):null;
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
     await frame.locator('#ktPhotoImage').waitFor({state:'visible'});
     await frame.locator('#ktPhotoDownload').click();
     assert((await photoDownload).suggestedFilename().endsWith('.png'),'Moved camera still exports the photo');
     await frame.locator('#ktPhotoBack').click();
     await frame.locator('#ktPhotoDialog').waitFor({state:'hidden'});
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
   results.push({engine,width,idle,playing,reactions,photo});
   console.log(engine,width,'idle + play + return passed');
   await context.close();
  }
  if(process.env.QA_PHOTO_STANDALONE){results.push(await photoQA.standalone(browser,origin,fonts,out));console.log(engine,'standalone photo download + return passed');}
  await browser.close();browser=null;
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
