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
  if(name==='karaoke-time.html')data=data.toString().replace('function ktNoSite(){',`window.__qaIncomingMessages=[];window.__qaLoungeErrors=[];window.__qaPracticeErrors=[];window.__qaRuntimeErrors=[];window.__qaLoopEvents=[];\n  window.__qaLoopDiag={calls:0,lastEntry:null,lastExit:null,errors:[]};var __qaLoop=krLoop;krLoop=function(){var diag=window.__qaLoopDiag,before={at:performance.now(),pageHidden:document.hidden,host:krRoomHostVisible,canvas:krRoomCanvasVisible,canAnimate:krRoomPodeAnimar(),stage:krRoomPalcoVisivel(),panel:krRoomPainelRitmoVisivel(),pageActive:!window.TWMotionLifecycle||TWMotionLifecycle.isPageActive(),tick:krT,raf:!!krLoopFrame};diag.calls++;diag.lastEntry=before;try{var result=__qaLoop.apply(this,arguments);diag.lastExit={at:performance.now(),tick:krT,raf:!!krLoopFrame,pageHidden:document.hidden,host:krRoomHostVisible,canvas:krRoomCanvasVisible,canAnimate:krRoomPodeAnimar(),stage:krRoomPalcoVisivel(),panel:krRoomPainelRitmoVisivel(),pageActive:!window.TWMotionLifecycle||TWMotionLifecycle.isPageActive()};return result;}catch(error){diag.errors.push({at:performance.now(),message:String(error&&error.message||error),stack:String(error&&error.stack||'')});if(diag.errors.length>8)diag.errors.shift();throw error;}};\n  var __qaRoomUpdate=krRoomAtualizar;krRoomAtualizar=function(){window.__qaLoopEvents.push({type:'room-update',at:performance.now(),canAnimate:krRoomPodeAnimar(),host:krRoomHostVisible,canvas:krRoomCanvasVisible});if(window.__qaLoopEvents.length>80)window.__qaLoopEvents.shift();return __qaRoomUpdate.apply(this,arguments);};\n  var __qaSchedule=krAgendarLoop;krAgendarLoop=function(){var before=!!krLoopFrame;__qaSchedule.apply(this,arguments);window.__qaLoopEvents.push({type:'schedule',at:performance.now(),before:before,after:!!krLoopFrame,canAnimate:krRoomPodeAnimar(),host:krRoomHostVisible,canvas:krRoomCanvasVisible});if(window.__qaLoopEvents.length>80)window.__qaLoopEvents.shift();};\n  window.addEventListener('pagehide',function(){window.__qaLoopEvents.push({type:'pagehide',at:performance.now()});});window.addEventListener('pageshow',function(){window.__qaLoopEvents.push({type:'pageshow',at:performance.now()});});window.addEventListener('error',function(event){window.__qaRuntimeErrors.push({message:event.message,source:event.filename,line:event.lineno,column:event.colno});if(window.__qaRuntimeErrors.length>20)window.__qaRuntimeErrors.shift();});window.addEventListener('unhandledrejection',function(event){window.__qaRuntimeErrors.push({rejection:String(event.reason&&event.reason.stack||event.reason)});if(window.__qaRuntimeErrors.length>20)window.__qaRuntimeErrors.shift();});var __qaOriginalConsoleError=console.error;console.error=function(){var args=Array.prototype.slice.call(arguments);if(args.length){var message=String(args[0]);if(message.indexOf('[Karaoke] circulação autônoma pausada após erro')===0)window.__qaLoungeErrors.push(args.map(String).join(' '));if(message.indexOf('[Karaoke] show NPC não iniciou')===0)window.__qaPracticeErrors.push(args.map(function(value){return value&&value.stack?value.stack:String(value);}).join(' '));}return __qaOriginalConsoleError.apply(console,args);};window.addEventListener('message',function(event){var entry={type:event.data&&event.data.type,active:event.data&&event.data.active,visible:event.data&&event.data.visible,sourceParent:event.source===window.parent,origin:event.origin,roomOrigin:location.origin};window.__qaIncomingMessages.push(entry);if(window.__qaIncomingMessages.length>30)window.__qaIncomingMessages.shift();},true);\n  window.qaRoomState=function(){
   var canvas=document.getElementById('krCv'),ctx=canvas&&canvas.getContext('2d');
   var probe=window.__qaPaintProbe||{calls:0,methods:[]},pixels={opaque:0,unique:0,hash:0,error:null};
   try{
    var scale=canvas.width/960,off=window.__qaPixelCanvas||(window.__qaPixelCanvas=document.createElement('canvas'));
    off.width=48;off.height=48;var ox=off.getContext('2d');
    ox.clearRect(0,0,48,48);ox.drawImage(canvas,Math.round(220*scale),0,Math.round(520*scale),canvas.height,0,0,48,48);
    var data=ox.getImageData(0,0,48,48).data,colors=new Set(),hash=2166136261;
    for(var p=0;p<data.length;p+=4){
     var rgba=(data[p]<<24)|(data[p+1]<<16)|(data[p+2]<<8)|data[p+3];
     if(data[p+3]>8)pixels.opaque++;
     colors.add(rgba);hash=Math.imul(hash^rgba,16777619)>>>0;
    }
    pixels.unique=colors.size;pixels.hash=hash;
   }catch(error){pixels.error=String(error&&error.message||error);}
   var vis={pageHidden:document.hidden,host:krRoomHostVisible,canvasObserver:krRoomCanvasVisible,rhythmObserver:krRhythmPanelVisible,
    canvasInViewport:krRoomElementoVisivel(krCanvasHD),pageActive:!window.TWMotionLifecycle||TWMotionLifecycle.isPageActive(),
    roomCanAnimate:krRoomPodeAnimar(),stageVisible:krRoomPalcoVisivel(),rhythmPanelVisible:krRoomPainelRitmoVisivel(),rafScheduled:!!krLoopFrame};
   var history=window.qaRoomVisibilityHistory||(window.qaRoomVisibilityHistory=[]);
   history.push({at:performance.now(),host:vis.host,canvasObserver:vis.canvasObserver,canvasInViewport:vis.canvasInViewport,
    pageHidden:vis.pageHidden,pageActive:vis.pageActive,roomCanAnimate:vis.roomCanAnimate,paintCalls:probe.calls});
   if(history.length>80)history.splice(0,history.length-80);
   return {
    members:krBots.map(function(b,i){var seat=KR_SOFA_SLOTS[i]||null;return {nick:b.nick,x:b.x,y:b.y,noMic:!!b.no_mic,walking:!!b._ktLoungeWalking,seat:seat};}),
    loungeWalkers:krLoungeActors.map(function(b){var st=b._ktLounge||{};return {nick:b.nick,x:b.x,y:b.y,walking:!!b._ktLoungeWalking,phase:st.phase,routeIndex:st.routeIndex,route:st.route,targetX:st.targetX,returnX:st.returnX,returnY:st.returnY,laneY:st.laneY};}),
    player:{x:krEu.x,y:krEu.y,tx:krEu.tx,ty:krEu.ty,noMic:!!krEu.no_mic,drink:krEu.drink||'',snack:krEu.snackSala||'',item:krEu.itemSala||'',handBusy:krHandBusy(krEu),atMic:krEuNoMicrofone(),returnAt:krMeuRetornoAt,returning:krMeuVoltandoAoMic,reserved:krAutoMicPlayerReserved,moveQueue:krMoveQueue.map(function(point){return {x:point.x,y:point.y};})},walkers:krLoungeActors.length,
    attempts:ktMeta.controls().used,flash:krRhythmRun?krRhythmRun.flash:[],active:kt.active(),paused:kt.paused(),
    session:krRhythmRun&&krRhythmRun.session&&krRhythmRun.session.token,practice:!!(krRhythmRun&&krRhythmRun.practice),rhythmRun:krRhythmRun?{auto:!!krRhythmRun.auto,practice:!!krRhythmRun.practice,paused:!!krRhythmRun.paused,audioReady:!!krRhythmRun.audioReady,audioClock:!!krRhythmRun.audioClock,start:krRhythmRun.start,now:performance.now(),audioState:window.__qaAudioState||''}:null,practiceErrors:(window.__qaPracticeErrors||[]).slice(-8),
    pending:!!window.ktShowAdmissionPending,singer:krDemoCantor?{nick:krDemoCantor.bot.nick,phase:krDemoCantor.phase,automatic:!!krDemoCantor.automatic,
     x:krDemoCantor.bot.x,y:krDemoCantor.bot.y,noMic:!!krDemoCantor.bot.no_mic,routeIndex:krDemoCantor.routeIndex,homeX:krDemoCantor.homeX,homeY:krDemoCantor.homeY}:null,
    visibility:vis,visibilityHistory:history.slice(),incomingMessages:(window.__qaIncomingMessages||[]).slice(-12),loopEvents:(window.__qaLoopEvents||[]).slice(-40),loopDiag:window.__qaLoopDiag||null,loungeErrors:(window.__qaLoungeErrors||[]).slice(-8),runtimeErrors:(window.__qaRuntimeErrors||[]).slice(-12),paint:{calls:probe.calls,methods:probe.methods.slice(),pixels:pixels},roomTick:krT,
    pets:ktPets.map(function(p){return {k:p.k,x:p.x,y:p.y,hitY:p.hitY,ex:p.ex,taps:p.toques||0,visit:p.visita?{phase:p.visita.phase,nome:p.visita.nome}:null};}),
    pandeiro:{x:ktPandeiro.x,y:ktPandeiro.y,t0:ktPandeiro.t0},extra:typeof ktPandeiroExtra==='undefined'?null:{x:ktPandeiroExtra.x,y:ktPandeiroExtra.y,t0:ktPandeiroExtra.t0}
   };
  };
  window.qaRoomControllers={
   openPoster:function(index){var pos=KR_ROOM_POSTER_POS[index],bob=Math.sin(index*1.4)*2,canvas=document.getElementById('krCv'),rect=canvas.getBoundingClientRect(),clientX=rect.left+pos[0]*rect.width/960,clientY=rect.top+(pos[1]+bob+10)*rect.height/540,event=new PointerEvent('pointerdown',{bubbles:true,cancelable:true,clientX:clientX,clientY:clientY,pointerId:1,pointerType:'mouse',isPrimary:true});canvas.dispatchEvent(event);return {opened:!!document.getElementById('ktPosterDialog')&&document.getElementById('ktPosterDialog').open,defaultPrevented:event.defaultPrevented,posterCount:KR_ROOM_POSTER_DRAW.length,frame:pos,canvas:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},client:{x:clientX,y:clientY}};},
   probePendingAutoMic:function(){var before=krDemoCantor;krAutoMicNextAt=krT-1;window.krLoungeAutoMicTick();return {pending:window.ktShowAdmissionPending,started:krDemoCantor!==before,singer:krDemoCantor&&krDemoCantor.phase,nextAt:krAutoMicNextAt};},
   prepareAutoMic:function(){krLoungeNextAt=krT+36000;krLoungeActors.forEach(function(actor){if(actor._ktLounge&&actor._ktLounge.phase!=='home')krLoungeCriarRetorno(actor);});var before={x:krEu.x,y:krEu.y},atMic=krEuNoMicrofone(),planned=atMic?true:krPlanearRetornoMicrofone();return {walkers:krLoungeActors.length,atMic:atMic,planned:planned,before:before,returning:krMeuVoltandoAoMic,time:krT,rafScheduled:!!krLoopFrame};},
   startAutomaticMic:function(){krSt.aberta=true;krDemoFila.length=0;krAutoMicNextAt=krT-1;var before=ktMeta.controls().used;if(!krEuNoMicrofone()||window.ktShowAdmissionPending)return {available:false,atMic:krEuNoMicrofone(),pending:window.ktShowAdmissionPending};window.krLoungeAutoMicTick();return {available:!!krDemoCantor,phase:krDemoCantor&&krDemoCantor.phase,bot:krDemoCantor&&krDemoCantor.bot.nick,automatic:!!(krDemoCantor&&krDemoCantor.automatic),wait:krDemoCantor?{x:krDemoCantor.playerWaitX,y:krDemoCantor.playerWaitY}:null,route:krDemoCantor&&krDemoCantor.route.map(function(p){return p.slice();}),from:{x:krDemoCantor&&krDemoCantor.bot.x,y:krDemoCantor&&krDemoCantor.bot.y},usedBefore:before,usedAfter:ktMeta.controls().used};},
   singerState:function(){var b=krDemoCantor&&krDemoCantor.bot;return krDemoCantor?{phase:krDemoCantor.phase,nick:b.nick,x:b.x,y:b.y,noMic:!!b.no_mic,walking:!!b._ktLoungeWalking,playerX:krEu.x,playerY:krEu.y,playerTx:krEu.tx,playerTy:krEu.ty,playerAtMic:krEuNoMicrofone(),playerNoMic:!!krEu.no_mic,playerHandBusy:krHandBusy(krEu),playerReserved:krAutoMicPlayerReserved,playerReturning:krMeuVoltandoAoMic,playerReturnAt:krMeuRetornoAt,moveQueue:krMoveQueue.map(function(point){return {x:point.x,y:point.y};}),route:krDemoCantor.route.map(function(point){return point.slice();}),routeIndex:krDemoCantor.routeIndex,homeX:krDemoCantor.homeX,homeY:krDemoCantor.homeY,side:krDemoCantor.side,waitX:krDemoCantor.playerWaitX,waitY:krDemoCantor.playerWaitY,active:kt.active(),practice:!!(krRhythmRun&&krRhythmRun.practice),audioReady:!!(krRhythmRun&&krRhythmRun.audioReady),audioClock:!!(krRhythmRun&&krRhythmRun.audioClock),used:ktMeta.controls().used,othersAtSofa:krBots.every(function(other,i){return other===b||!KR_SOFA_SLOTS[i]||Math.hypot(other.x-KR_SOFA_SLOTS[i][0],other.y-KR_SOFA_SLOTS[i][1])<2;})}:null;},
   finishAutomaticMic:function(){if(kt.active())kt.end(false);if(krDemoCantor)krDemoBotEnd();return krDemoCantor&&krDemoCantor.phase;},
   inspectAdmission:function(){var dialog=document.getElementById('ktStartConfirm'),accept=document.getElementById('ktConfirmAccept');return {roomOpen:krSt.aberta,playerAtMic:krEuNoMicrofone(),playerNoMic:krEu.no_mic,active:kt.active(),paused:kt.paused(),pending:!!window.ktShowAdmissionPending,confirmOpen:!!(dialog&&dialog.open),acceptDisabled:!!(accept&&accept.disabled),startDisabled:$('ktStart').disabled,meta:ktMeta.controls(),online:window.ktOnline.online(),queueLength:krDemoFila.length,singer:!!krDemoCantor};}
  };
  function ktNoSite(){`);
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
   await context.addInitScript(()=>{
    localStorage.setItem('brs48cr_tut','1');localStorage.setItem('brs48cr_nick','QA Idol');
    var probe=window.__qaPaintProbe={calls:0,methods:[]};
    try{
     var proto=CanvasRenderingContext2D.prototype;
     if(!proto.__qaPaintInstrumented){
      Object.defineProperty(proto,'__qaPaintInstrumented',{value:true});
      ['clearRect','fillRect','drawImage','fill','stroke','fillText','strokeText'].forEach(function(name){
       var original=proto[name];if(typeof original!=='function')return;
       Object.defineProperty(proto,name,{configurable:true,writable:true,value:function(){
        if(this.canvas&&this.canvas.id==='krCv'){
         probe.calls++;if(probe.methods.indexOf(name)<0)probe.methods.push(name);
        }
        return original.apply(this,arguments);
       }});
      });
     }
    }catch(error){window.__qaPaintInstrumentError=String(error&&error.message||error);}
   });
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
   let visibilityEvidence=null;
   if(!baseline){
    await p.waitForTimeout(220);
    const painted=await frame.locator('body').evaluate(()=>window.qaRoomState());
    assert(painted.visibility.host&&painted.visibility.canvasObserver&&painted.visibility.canvasInViewport,'host, canvas and observer report a visible stage');
    assert(painted.visibility.pageActive&&painted.visibility.roomCanAnimate,'visible stage owns an active animation lifecycle');
    assert(painted.paint.calls>0,'Chromium observed actual canvas paint operations');
    assert(painted.paint.pixels.opaque>100&&painted.paint.pixels.unique>80&&painted.paint.pixels.hash!==0,'stage canvas contains opaque, varied and identifiable scene pixels');
    await p.evaluate(()=>{const iframe=document.querySelector('#twPreviewIframe');iframe.hidden=true;window.TWMotionLifecycle.refresh();iframe.contentWindow.postMessage({type:'tsulipa-motion-state',active:false},location.origin);});
    const hidden=await frame.locator('body').evaluate(()=>new Promise(resolve=>{const started=performance.now();function poll(){const state=window.qaRoomState();if(state.visibility.host===false||performance.now()-started>1200){resolve(state);return;}requestAnimationFrame(poll);}poll();}));
    assert.equal(hidden.visibility.host,false,'host hide message reaches the room: '+JSON.stringify(hidden));
    assert.equal(hidden.visibility.roomCanAnimate,false,'hidden host suspends room animation');
    await p.evaluate(()=>{const iframe=document.querySelector('#twPreviewIframe');iframe.hidden=false;window.TWMotionLifecycle.refresh();iframe.contentWindow.postMessage({type:'tsulipa-motion-state',active:true},location.origin);});
    await p.waitForTimeout(320);
    const reopened=await frame.locator('body').evaluate(()=>window.qaRoomState());
    assert(reopened.visibility.host&&reopened.visibility.roomCanAnimate,'reopened host restores room ownership');
    assert(reopened.paint.calls>hidden.paint.calls&&reopened.paint.pixels.opaque>100&&reopened.paint.pixels.unique>80,'reopened stage paints identifiable pixels again');
    assert(reopened.visibilityHistory.some(v=>v.host===false)&&reopened.visibilityHistory.some(v=>v.host===true),'visibility history records hide and recovery');
    visibilityEvidence={visible:painted.visibility,hidden:hidden.visibility,reopened:reopened.visibility,painted:painted.paint,recovered:reopened.paint};
   }
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
    const poster=frame.locator('#ktPosterDialog'),portrait=frame.locator('#ktPosterPortrait'),posterColors=[];
    for(let posterIndex=0;posterIndex<6;posterIndex++){
     const posterClick=await frame.locator('body').evaluate(()=>{var index=window.__qaPosterIndex||0;window.__qaPosterIndex=index+1;return window.qaRoomControllers.openPoster(index);});
     assert.equal(posterClick.opened,true,'wall Polaroid '+(posterIndex+1)+' opens through the real canvas pointer event: '+JSON.stringify(posterClick));
     assert.equal(posterClick.posterCount,6,'the room exposes all six wall Polaroids');
     await poster.waitFor({state:'visible'});await frame.locator('#ktPosterSave').waitFor({state:'visible'});
     const visual=await poster.evaluate(dialog=>{
      const backdrop=getComputedStyle(dialog,'::backdrop'),canvas=dialog.querySelector('#ktPosterPortrait'),ctx=canvas.getContext('2d');
      const data=ctx.getImageData(44,300,1,1).data;
      return {backdrop:backdrop.backgroundColor,filter:backdrop.backdropFilter,width:canvas.width,height:canvas.height,sample:Array.from(data).join(',')};
     });
     assert.equal(visual.backdrop,'rgba(0, 0, 0, 0)','Polaroid leaves the colorful room visible without a dark backdrop');
     assert.equal(visual.filter,'none','Polaroid does not blur or dim the room');
     const portraitInfo=await portrait.evaluate(canvas=>{const ctx=canvas.getContext('2d'),pixels=ctx.getImageData(40,40,440,460).data;let ink=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]&&((pixels[i]>90&&pixels[i]<245)||(pixels[i+1]>70&&pixels[i+1]<225)||(pixels[i+2]>70&&pixels[i+2]<245)))ink++;return {width:canvas.width,height:canvas.height,ink};});
     assert.equal(portraitInfo.width,520);assert.equal(portraitInfo.height,620);assert(portraitInfo.ink>1000,'enlarged portrait canvas contains rendered artwork, not just an empty dialog');
     posterColors.push(visual.sample);
     await poster.screenshot({path:path.join(out,engine+'-'+width+'-polaroid-'+posterIndex+'.png')});
     if(posterIndex===0){
      const pngDownload=p.waitForEvent('download');await frame.locator('#ktPosterSave').click();
      assert((await pngDownload).suggestedFilename().endsWith('.png'),'Polaroid download produces a PNG');
     }
     await frame.locator('#ktPosterClose').click();await poster.waitFor({state:'hidden'});
    }
    assert.equal(new Set(posterColors).size,6,'each of the six Polaroids paints its own color palette');
    const prep=await frame.locator('body').evaluate(()=>window.qaRoomControllers.prepareAutoMic());
    let atMic=false,lastRoomState=null;
    for(let tries=0;tries<180;tries++){
     const state=await frame.locator('body').evaluate(()=>window.qaRoomState());
     lastRoomState=state;
     if(state.player.atMic&&state.walkers===0){atMic=true;break;}
     await p.waitForTimeout(100);
    }
    assert(atMic,'player reaches the mic and every lounge walker completes its return route before the NPC turn: '+JSON.stringify({prep,player:lastRoomState&&lastRoomState.player,walkers:lastRoomState&&lastRoomState.loungeWalkers,visibility:lastRoomState&&lastRoomState.visibility,loungeErrors:lastRoomState&&lastRoomState.loungeErrors,runtimeErrors:lastRoomState&&lastRoomState.runtimeErrors,pageErrors:errors.slice(-12),roomTick:lastRoomState&&lastRoomState.roomTick,visibilityHistory:lastRoomState&&lastRoomState.visibilityHistory.slice(-20),incoming:lastRoomState&&lastRoomState.incomingMessages,loopEvents:lastRoomState&&lastRoomState.loopEvents,loopDiag:lastRoomState&&lastRoomState.loopDiag}));
    const autoMic=await frame.locator('body').evaluate(()=>window.qaRoomControllers.startAutomaticMic());
    assert.equal(autoMic.available,true,'automatic mic factory is bound to page-private room state: '+JSON.stringify(autoMic));
    assert.equal(autoMic.phase,'player_departure','the player leaves the microphone before the NPC approaches');
    assert(autoMic.bot&&autoMic.automatic&&autoMic.wait,'eligible NPC receives a separate route and player waiting point');
    const micCanvas=frame.locator('#krCv'),micBounds=await micCanvas.boundingBox();
    await micCanvas.click({position:{x:autoMic.wait.x*micBounds.width/960,y:autoMic.wait.y*micBounds.height/540}});
    let singerState=null;
    for(let tries=0;tries<180;tries++){
     singerState=await frame.locator('body').evaluate(()=>window.qaRoomControllers.singerState());
     if(singerState){
      assert(Math.hypot(singerState.x-singerState.playerX,singerState.y-singerState.playerY)>80,'player and NPC keep separate sprite envelopes throughout departure and approach');
      if(singerState.phase==='singing')break;
     }
     await p.waitForTimeout(100);
    }
    if(!(singerState&&singerState.phase==='singing'&&singerState.active&&singerState.practice)){const micFailure=await frame.locator('body').evaluate(()=>({singer:window.qaRoomControllers.singerState(),room:window.qaRoomState(),admission:window.qaRoomControllers.inspectAdmission(),practiceErrors:(window.__qaPracticeErrors||[]).slice(-8)}));assert.fail('NPC reaches the mic and starts a local, non-ranked practice show. Actual state: '+JSON.stringify({lastSingerState:singerState,micFailure,pageErrors:errors.slice(-12)}));}
    assert.equal(singerState.used,autoMic.usedBefore,'autonomous NPC show does not spend the player attempt');
    await frame.locator('body').evaluate(()=>window.qaRoomControllers.finishAutomaticMic());
    let returnState=null;
    for(let tries=0;tries<180;tries++){
     returnState=await frame.locator('body').evaluate(()=>window.qaRoomControllers.singerState());
     if(!returnState)break;
     assert(Math.hypot(returnState.x-returnState.playerX,returnState.y-returnState.playerY)>80,'NPC and player remain separated during NPC return and player recovery');
     await p.waitForTimeout(100);
    }
    assert.equal(returnState,null,'NPC returns to its original seat before the player recovers the microphone');
    const recovered=await frame.locator('body').evaluate(()=>window.qaRoomState());
    assert(recovered.player.atMic,'player finishes the return route at the microphone');
    assert.equal(recovered.active,false,'automatic mic test cleans up without leaving the game active');
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
   const confirmDialog=frame.locator('#ktStartConfirm');
   await confirmDialog.waitFor({state:'visible'});
   const confirmViewport=p.viewportSize(),confirmBox=await confirmDialog.boundingBox(),cancelBox=await frame.locator('#ktConfirmCancel').boundingBox();
   for(const box of [confirmBox,cancelBox])assert(box&&box.x>=0&&box.y>=0&&box.x+box.width<=confirmViewport.width+1&&box.y+box.height<=confirmViewport.height+1,'Confirm show and Cancel are inside the visible host viewport');
   await frame.locator('#ktConfirmCancel').click();
   await confirmDialog.waitFor({state:'hidden'});
   await frame.locator('#ktStart').click();
   await confirmDialog.waitFor({state:'visible'});
   const acceptBox=await frame.locator('#ktConfirmAccept').boundingBox();
   assert(acceptBox&&acceptBox.x>=0&&acceptBox.y>=0&&acceptBox.x+acceptBox.width<=confirmViewport.width+1&&acceptBox.y+acceptBox.height<=confirmViewport.height+1,'Confirm button is visible and reachable without impossible scrolling');
   await frame.locator('#ktConfirmAccept').click();
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
     await p.waitForTimeout(4200); // The game intentionally keeps a 4s count-in before the first accepted note.
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
   results.push({engine,width,idle,playing,reactions,photo,visibility:visibilityEvidence});
   console.log(engine,width,'idle + play + return passed');
   await context.close();
  }
  if(process.env.QA_PHOTO_STANDALONE){results.push(await photoQA.standalone(browser,origin,fonts,out));console.log(engine,'standalone photo download + return passed');}
  await browser.close();browser=null;
 }
 fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{if(browser)await browser.close();server.close();});
