/* Local-only browser QA. Requires Playwright and Chromium.
   Run from the repository root. All external requests are blocked.
   The local HTTP response exposes existing UI controllers for fixtures only;
   no authentication bypass or test hook is written to the application files. */
const {chromium}=require('playwright'),fs=require('fs'),path=require('path');
let browser;
const server=require('http').createServer((req,res)=>{let f=decodeURIComponent(req.url.split('?')[0]);if(f.endsWith('/'))f+='index.html';let target=path.join(process.cwd(),f);res.setHeader('Content-Type',target.endsWith('.css')?'text/css':target.endsWith('.js')?'application/javascript':target.endsWith('.html')?'text/html':'application/octet-stream');fs.readFile(target,(e,d)=>{res.statusCode=e?404:200;if(!e&&target.endsWith('/index.html'))d=d.toString().replace('\nhubMostrar();\n// Só',`\nwindow.qa={open:function(g){hubComecou=true;muted=true;hubMostrar();hubMusicaParar();var launch=$('hub').querySelector('[data-ir="'+g+'"]');if(launch)launch.focus();if(g==='gacha')gachaAbrir();if(g==='pet'){$('nick').value='QA Idol';localStorage.setItem(PET_KEY,JSON.stringify({v:1,ativo:'pati',pets:{pati:{nome:'Pucchi',fome:75,energia:90,humor:90,higiene:90,t:Date.now(),xp:210}}}));petOpenUI();}if(g==='duo'){duoOv.hidden=false;duoGu={nick:'Idol de teste',avatar:{}};duoTexto();duoPalcoUI();}if(g==='profile'){perfAtual={nick:'Idol de teste',best:900,oshi:'tsu',frase:'Prévia local',avatar:{},pets:[],insignias:[],recados:[]};perfMeu=false;perfOv.hidden=false;perfMontar();}if(g==='encounter')encMostrar({nick:'Idol de teste',best:900,oshi:'tsu',fala:'Um encontro de teste local!',avatar:{},extras:[]});if(g==='sora'||g==='karaoke')twPreviewAbrirJogo(g);}};\nhubMostrar();\n// Só`);res.end(e?'missing':d);});});
(async()=>{await new Promise(r=>server.listen(8000,'127.0.0.1',r));const root=process.argv[2]||'.',out=process.argv[3]||'/tmp/tsulipa-windows-qa';fs.mkdirSync(out,{recursive:true});const src=fs.readFileSync(root+'/kt-fonts.css','utf8');const fonts=[...src.matchAll(/@font-face\s*\{[^}]*\}/g)].map(x=>x[0]).join('\n');browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'],headless:true});const results=[];const assert=require('node:assert/strict');
for(const oshi of (process.env.WINDOWS_OSHI_MATRIX?['tsu','lirika','pati']:['']))for(const width of (process.env.WINDOWS_OSHI_MATRIX?[1440]:[1440,390]))for(const theme of (process.env.WINDOWS_DETAIL?['dark']:['light','dark']))for(const game of (process.env.WINDOWS_EXTRA?['profile','encounter']:process.env.WINDOWS_DETAIL?['karaoke']:['gacha','pet','duo','sora','karaoke'])){
 const context=await browser.newContext({viewport:{width,height:width===390?844:1000},colorScheme:theme});await context.addInitScript(o=>{localStorage.setItem('brs48cr_oshi',o);localStorage.setItem('brs48cr_tut','1');},oshi);const p=await context.newPage(),errors=[];p.on('pageerror',e=>(errors.push(e.message),console.log('PAGE',e.message)));await p.route('**/*',r=>{const url=r.request().url();if(url.startsWith('http://127.0.0.1:8000/'))return r.continue();if(url.includes('fonts.googleapis.com'))return r.fulfill({contentType:'text/css',body:fonts});return r.abort();});await p.goto('http://127.0.0.1:8000/'+root+'/');await p.evaluate(({theme,game})=>{document.documentElement.setAttribute('data-theme',theme);window.qa.open(game);},{theme,game});
 const scope=(game==='sora'||game==='karaoke')?p.frameLocator('#twPreviewIframe'):p;const titleSelector={gacha:'#gachaTit',pet:'#petov h1',duo:'#duoTit',sora:'#soraOv h1',karaoke:'.krtit',profile:'.perfnm',encounter:'#encTopo'}[game];await scope.locator(titleSelector).waitFor({state:'visible',timeout:15000});await p.waitForTimeout(600);if(!process.env.WINDOWS_OSHI_MATRIX)await p.screenshot({path:out+'/'+game+'-'+width+'-'+theme+'.png'});const metrics=await scope.locator(titleSelector).evaluate(el=>{const s=getComputedStyle(el),r=el.getBoundingClientRect();return{font:s.fontFamily,size:s.fontSize,align:s.textAlign,color:s.color,rect:{x:r.x,y:r.y,w:r.width,h:r.height}}});let interaction=null;
if(!process.env.WINDOWS_BASELINE){
 if(!process.env.WINDOWS_EXTRA){assert.equal(metrics.align,'center');assert.equal(metrics.size,width===390?'24px':'35px');const jp=await scope.locator(({gacha:'#gachaOv .tw-modal-jp',duo:'#duoOv .tw-modal-jp',pet:'#petov .tw-window-jp',sora:'.tw-window-jp',karaoke:'.tw-window-jp'}[game])).evaluate(el=>({size:getComputedStyle(el).fontSize,weight:getComputedStyle(el).fontWeight}));assert.equal(jp.size,'12px');assert.equal(jp.weight,'800');}assert.deepEqual(errors,[]);
 const parentPalette=await p.evaluate(()=>{const s=getComputedStyle(document.documentElement);return{card:s.getPropertyValue('--card').trim(),ink:s.getPropertyValue('--ink').trim()};});
 const windowSelector={gacha:'.gachap',pet:'.petp',duo:'.duop',sora:'#twPreviewPainel',karaoke:'#twPreviewPainel',profile:'#perfOv>.perfp',encounter:'.encp'}[game];
 const surface=await p.locator(windowSelector).evaluate(el=>{let s=getComputedStyle(el),r=el.getBoundingClientRect();return{border:s.borderTopWidth,radius:s.borderRadius,x:r.x,right:r.right,y:r.y,bottom:r.bottom,background:s.backgroundImage,shadow:s.boxShadow};});
 if(game==='karaoke'){assert.equal(surface.border,'0px');assert.equal(surface.radius,'0px');assert.equal(surface.background,'none');assert.equal(surface.shadow,'none');}
 else{assert.equal(surface.border,'2px');assert.equal(surface.radius,'24px');}
 assert(surface.x>=0&&surface.right<=width+1);assert(surface.y>=0&&surface.bottom<=(width===390?844:1000)+1);
 if(game==='sora'||game==='karaoke'){
  const card=await scope.locator('html').evaluate(el=>getComputedStyle(el).getPropertyValue('--card').trim());assert.equal(card,parentPalette.card);
  assert.equal(await p.locator('#hub').evaluate(el=>el.hidden),false);
 }
 if(game==='sora')assert.equal(await p.locator('#twPreviewJogo').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(6, 16, 38, 0.55)');
 if(game==='karaoke'){
  const host=await p.locator('#twPreviewJogo').evaluate(el=>{const read=n=>{const s=getComputedStyle(n);return{color:s.backgroundColor,image:s.backgroundImage,shadow:s.boxShadow};};return{root:read(el),panel:read(el.querySelector('.tw-preview-panel')),slot:read(el.querySelector('.tw-preview-header-slot')),header:read(el.querySelector('.tw-preview-header-slot>header')),stage:read(el.querySelector('.tw-preview-stage')),iframe:read(el.querySelector('#twPreviewIframe'))};});
  Object.keys(host).forEach(k=>{assert.equal(host[k].color,'rgba(0, 0, 0, 0)',k+' background');assert.equal(host[k].image,'none',k+' background image');});
  assert.equal(host.panel.shadow,'none');
  const inner=await scope.locator('body').evaluate(el=>{const read=n=>{const s=getComputedStyle(n);return{color:s.backgroundColor,image:s.backgroundImage};};return{body:read(el),dialog:read(document.querySelector('#ktPopup')),room:read(document.querySelector('.krwrap'))};});
  Object.keys(inner).forEach(k=>{assert.equal(inner[k].color,'rgba(0, 0, 0, 0)',k+' embedded background');assert.equal(inner[k].image,'none',k+' embedded image');});
  assert(game==='karaoke');
 }
 if(game==='karaoke'){
  const row=await scope.locator('#ktStart').evaluate(el=>{let row=el.closest('.kt-toolbar');return{wrap:getComputedStyle(row).flexWrap,scroll:row.scrollWidth,client:row.clientWidth};});assert.equal(row.wrap,'nowrap');
  const placement=await scope.locator('#ktAvailability').evaluate(el=>({inside:el.parentElement.id==='krPalco'}));assert.equal(placement.inside,width!==390);assert(await scope.locator('#ktFoto').evaluate(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return r.top>p.top+p.height*.65&&r.bottom<=p.bottom;}));assert(await scope.locator('#krMute').evaluate(el=>{const r=el.getBoundingClientRect(),p=el.parentElement.getBoundingClientRect();return r.top>p.top+p.height*.65&&r.bottom<=p.bottom;}));
 }
 if(process.env.WINDOWS_DETAIL&&game==='karaoke'){
  const banner=scope.locator('#ktAvailability');
  if(width===1440){
   await p.waitForTimeout(6000);assert(Number(await banner.evaluate(el=>getComputedStyle(el).opacity))<.3);
   await banner.hover();await p.waitForTimeout(1300);assert(Number(await banner.evaluate(el=>getComputedStyle(el).opacity))>.95);
   assert(await banner.evaluate(el=>{const r=el.getBoundingClientRect(),c=document.querySelector('#krCv').getBoundingClientRect();return r.top>c.top+c.height*.65;}));
  }else{await banner.focus();assert.equal(await banner.evaluate(el=>getComputedStyle(el).opacity),'1');}
  const scroll=await scope.locator('#ktPopup').evaluate(el=>{el.scrollTop=el.scrollHeight;const value=el.scrollTop;el.scrollTop=0;return value;});assert(scroll>0);
  assert.equal(await scope.locator('#krMute').evaluate(el=>el.parentElement.id),'krPalco');
  assert.equal(await scope.locator('#ktFoto').evaluate(el=>el.parentElement.id),'krPalco');
 }
 if(game==='sora'){
  for(let i=0;i<16;i++){await p.keyboard.press('Tab');assert(await p.evaluate(()=>document.querySelector('#twPreviewPainel').contains(document.activeElement)));}
 }
 const closeSelector={gacha:'#gachaX',pet:'#petWindowClose',duo:'#duoX',sora:'#twKaraokePopupFechar',karaoke:'#twKaraokePopupFechar',profile:'#perfX',encounter:'#encX'}[game];
 await p.locator(closeSelector).click();await p.waitForTimeout(80);assert.equal(await p.locator(windowSelector).isVisible(),false);
 const restored=await p.evaluate(()=>document.activeElement.getAttribute('data-ir'));if(!process.env.WINDOWS_EXTRA)assert.equal(restored,game);
 await p.evaluate(g=>window.qa.open(g),game);await scope.locator(titleSelector).waitFor({state:'visible'});
 await scope.locator('body').press('Escape');await p.waitForTimeout(80);assert.equal(await p.locator(windowSelector).isVisible(),false);
 interaction={surface,close:true,escape:true,focusRestored:restored,palette:parentPalette};
}
results.push({game,width,theme,oshi,metrics,interaction,errors});await context.close();}
fs.writeFileSync(out+'/results.json',JSON.stringify(results,null,2));await browser.close();server.close();console.log('Validated/captured '+results.length+' views');})().catch(async error=>{console.error(error);if(browser)await browser.close();server.close();process.exitCode=1;});
