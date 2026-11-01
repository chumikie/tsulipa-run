/* Browser-only photo checks. Native sharing is mocked; no files are sent anywhere. */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
exports.install=async function(context){
 await context.addInitScript(()=>{
  window.__qaPhotoShares=[];window.__qaPhotoCreated=[];window.__qaPhotoRevoked=[];
  const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);
  URL.createObjectURL=function(blob){const u=create(blob);window.__qaPhotoCreated.push(u);return u;};
  URL.revokeObjectURL=function(u){window.__qaPhotoRevoked.push(u);revoke(u);};
  Object.defineProperty(navigator,'canShare',{configurable:true,value:data=>{
   if(window.__qaPhotoCanShareThrows)throw new Error('Unsupported files');
   return window.__qaPhotoCanShare!==false&&data.files&&data.files.length===1;
  }});
  Object.defineProperty(navigator,'share',{configurable:true,value:data=>{
   window.__qaPhotoShares.push({files:data.files,activated:!!navigator.userActivation?.isActive});
   if(window.__qaPhotoShareMode==='cancel')return Promise.reject(new DOMException('Cancelled','AbortError'));
   if(window.__qaPhotoShareMode==='error')return Promise.reject(new DOMException('Blocked','NotAllowedError'));
   return Promise.resolve();
  }});
 });
};
exports.verify=async function(p,frame,width,out){
 const state=()=>frame.locator('body').evaluate(()=>window.qaRoomState());
 const camera=frame.locator('#ktFoto'),dialog=frame.locator('#ktPhotoDialog'),img=frame.locator('#ktPhotoImage');
 await camera.evaluate(button=>{
  button.addEventListener('click',()=>{
   const c=document.createElement('canvas');c.width=1920;c.height=1080;
   c.getContext('2d').drawImage(document.getElementById('krCv'),0,0,1920,1080);
   window.__qaExpectedPhoto=c.toDataURL('image/png');
  },true);
 });
 async function open(){await camera.click();await img.waitFor({state:'visible'});await img.evaluate(i=>i.decode());}
 async function close(){await frame.locator('#ktPhotoBack').click();await dialog.waitFor({state:'hidden'});await p.waitForTimeout(60);}
 let downloads=0;p.on('download',()=>downloads++);
 const session=(await state()).session;
 await open();assert((await state()).paused,'Photo pauses an active show');
 assert.equal((await state()).session,session,'Photo does not start another attempt');
 const frameDownload=frame.locator('#ktPhotoFrameDownload');
 await frameDownload.waitFor({state:'visible'});
 const frameEvent=p.waitForEvent('download');await frameDownload.click();const framedFile=await frameEvent;
 const framedBytes=fs.readFileSync(await framedFile.path());
 assert.equal(framedBytes.readUInt32BE(16),1920,'Polaroid export keeps the room width');
 assert.equal(framedBytes.readUInt32BE(20),1260,'Polaroid export includes the print border and caption area');
 assert(framedFile.suggestedFilename().includes('_polaroid.png'),'Framed image has a distinct filename');
 const capture=await img.evaluate(i=>{
  const c=document.createElement('canvas');c.width=1920;c.height=1080;c.getContext('2d').drawImage(i,0,0);
  return {w:i.naturalWidth,h:i.naturalHeight,url:i.src,same:c.toDataURL('image/png')===window.__qaExpectedPhoto};
 });
 assert.equal(capture.w,1920);assert.equal(capture.h,1080);assert(capture.same,'Preview matches the exact pixels at the camera click');
 await p.waitForTimeout(450);
 assert(await img.evaluate(i=>{
  const c=document.createElement('canvas');c.width=1920;c.height=1080;c.getContext('2d').drawImage(i,0,0);
  const same=c.toDataURL('image/png')===window.__qaExpectedPhoto;
  c.getContext('2d').drawImage(document.getElementById('krCv'),0,0,1920,1080);
  return same&&c.toDataURL('image/png')!==window.__qaExpectedPhoto;
 }),'Photo stays frozen while the room keeps animating behind it');
 assert.equal(await frame.locator('body').evaluate(()=>KaraokeRoomPhoto.capture(document.getElementById('krCv'))),false,'Repeated capture cannot replace an open photo');
 const r=await dialog.boundingBox(),viewport=p.viewportSize();
 assert(r.y>=0&&r.y+r.height<=viewport.height+1&&r.x>=0&&r.x+r.width<=width+1,'Dialog fits the visible host viewport, not the tall iframe');
 await p.screenshot({path:path.join(out,'photo-'+width+'.png')});
 await frame.locator('#ktPhotoImage').click();
 for(let i=0;i<10;i++){
  await p.keyboard.press('Tab');
  assert(await frame.locator('body').evaluate(()=>document.getElementById('ktPhotoDialog').contains(document.activeElement)),'Tab stays inside the photo dialog');
 }
 await frame.locator('body').evaluate(()=>{window.__qaPhotoShareMode='cancel';});
 await frame.locator('#ktPhotoShare').click();
 assert((await frame.locator('#ktPhotoStatus').innerText()).includes('continua aqui'),'Cancelling sharing keeps the photo');
 assert.equal(downloads,0,'Cancelling does not trigger a download');
 assert.equal(await img.getAttribute('src'),capture.url);
 assert(await frame.locator('#ktPhotoFrameDownload').isVisible(),'Framed export is offered alongside the clean photo');
 await frame.locator('body').evaluate(()=>{window.__qaPhotoShareMode='error';});
 await frame.locator('#ktPhotoShare').click();
 assert((await frame.locator('#ktPhotoStatus').innerText()).includes('Baixar PNG'),'Denied sharing offers a usable fallback');
 await frame.locator('body').evaluate(()=>{window.__qaPhotoShareMode='success';});
 await frame.locator('#ktPhotoShare').click();
 const shared=await frame.locator('body').evaluate(async()=>{
  const call=window.__qaPhotoShares.at(-1),f=call.files[0],bytes=await f.arrayBuffer(),view=new DataView(bytes);
  const digest=await crypto.subtle.digest('SHA-256',bytes);
  return {name:f.name,type:f.type,w:view.getUint32(16),h:view.getUint32(20),activated:call.activated,hash:Array.from(new Uint8Array(digest),v=>v.toString(16).padStart(2,'0')).join('')};
 });
 assert.equal(shared.type,'image/png');assert(shared.name.endsWith('.png'));assert.equal(shared.w,1920);assert.equal(shared.h,1080);assert(shared.activated,'Share runs in the button activation');
 const event=p.waitForEvent('download');await frame.locator('#ktPhotoDownload').click();const file=await event;
 const bytes=fs.readFileSync(await file.path());assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),shared.hash,'Download and native sharing use the same frozen PNG');
 assert((await frame.locator('#ktPhotoStatus').innerText()).includes('solicitado'),'Download status does not falsely claim a saved photo');
 await close();assert.equal((await state()).paused,false,'Returning resumes a show that was playing');
 assert.equal((await state()).session,session);
 assert(await camera.evaluate(b=>document.activeElement===b),'Closing restores focus to the camera');
 assert(await frame.locator('body').evaluate((body,u)=>window.__qaPhotoRevoked.includes(u),capture.url),'Closing releases the photo object URL');
 // Unsupported file sharing keeps the image, explicit download and long-press hint.
 await frame.locator('body').evaluate(()=>{window.__qaPhotoCanShare=false;});
 await open();assert.equal(await frame.locator('#ktPhotoShare').isVisible(),false);assert(await frame.locator('#ktPhotoDownload').isVisible());
 assert(await frame.locator('#ktPhotoHint').isVisible());
 await p.keyboard.press('Escape');await dialog.waitFor({state:'hidden'});await p.waitForTimeout(60);
 assert.equal(await p.locator('#twPreviewJogo').evaluate(el=>el.hidden),false,'Escape closes only the photo, not Karaoke');
 assert.equal((await state()).paused,false);
 // A player who had manually paused remains paused after returning from a photo.
 await frame.locator('#ktPause').click();assert((await state()).paused);
 await open();await close();assert((await state()).paused,'A pre-paused show is not resumed');
 await frame.locator('#ktPause').click();
 // A late encoder callback must not reopen the image or leak a URL after Back.
 await frame.locator('body').evaluate(()=>{
  window.__qaPhotoToBlob=HTMLCanvasElement.prototype.toBlob;
  HTMLCanvasElement.prototype.toBlob=function(cb,type){window.__qaPhotoToBlob.call(this,b=>setTimeout(()=>cb(b),800),type);};
 });
 const created=await frame.locator('body').evaluate(()=>window.__qaPhotoCreated.length);
 await camera.click();await dialog.waitFor({state:'visible'});await close();await p.waitForTimeout(1000);
 assert.equal(await frame.locator('body').evaluate(()=>window.__qaPhotoCreated.length),created,'Late encoding is discarded after close');
 await frame.locator('body').evaluate(()=>{
  HTMLCanvasElement.prototype.toBlob=function(cb){cb(null);};
 });
 await camera.click();await dialog.waitFor({state:'visible'});
 assert((await frame.locator('#ktPhotoStatus').innerText()).includes('Não consegui preparar'),'Encoding failure is visible');
 assert.equal(await frame.locator('#ktPhotoDownload').isVisible(),false);
 await close();await frame.locator('body').evaluate(()=>{HTMLCanvasElement.prototype.toBlob=window.__qaPhotoToBlob;});
 assert.equal((await state()).paused,false);assert.equal((await state()).session,session);
 return {exactPixels:true,frozen:true,width:1920,height:1080,downloadMatchesShare:true,cancelAndErrorFallback:true,focusAndEscape:true,pauseRestored:true,lateEncodingDiscarded:true};
};
exports.standalone=async function(browser,origin,fonts,out){
 const context=await browser.newContext({viewport:{width:390,height:844},colorScheme:'dark'});
 await exports.install(context);const p=await context.newPage(),errors=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.route('**/*',r=>r.request().url().startsWith(origin)?r.continue():r.request().url().includes('fonts.googleapis.com')?r.fulfill({contentType:'text/css',body:fonts}):r.abort());
 await p.goto(origin+'/karaoke-time.html?theme=dark');
 await p.locator('#ktFoto').click();await p.locator('#ktPhotoImage').waitFor({state:'visible'});
 await p.locator('#ktPhotoImage').evaluate(i=>i.decode());
 const r=await p.locator('#ktPhotoDialog').boundingBox();assert(r.y>=0&&r.y+r.height<=844,'Standalone photo fits the viewport');
 const download=p.waitForEvent('download');await p.locator('#ktPhotoDownload').click();assert((await download).suggestedFilename().endsWith('.png'));
 await p.screenshot({path:path.join(out,'photo-standalone.png')});
 await p.keyboard.press('Escape');await p.locator('#ktPhotoDialog').waitFor({state:'hidden'});
 assert(await p.locator('#ktPopup').isVisible(),'Closing the photo preserves the original standalone room dialog');
 assert.deepEqual(errors,[]);await context.close();
 return {kind:'standalone',width:390,download:true,photoClosedOnly:true};
};
