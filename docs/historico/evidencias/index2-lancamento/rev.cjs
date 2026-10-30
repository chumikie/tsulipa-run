const {chromium}=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');
const fs=require('fs');const assert=require('assert');
(async()=>{
 const browser=await chromium.launch({executablePath:'/tmp/chromium',headless:true,args:['--no-sandbox']});const results=[];
 for(const [device,viewport] of [['mobile',{width:390,height:844}],['desktop',{width:1440,height:1000}]])for(const lang of ['pt','en','es','th','ja']){
  const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:device==='mobile',hasTouch:device==='mobile'});
  const fontMap=JSON.parse(fs.readFileSync('/tmp/font-map.json'));const blocked=[];await context.route('**/*',route=>{
   const u=new URL(route.request().url());
   if(u.hostname==='fonts.googleapis.com')return route.fulfill({contentType:'text/css',body:fs.readFileSync('/tmp/game-fonts.css','utf8')});
   if(fontMap[u.href])return route.fulfill({contentType:'font/ttf',path:fontMap[u.href]});
   if(u.hostname==='127.0.0.1')return route.continue();
   blocked.push(u.hostname);return route.abort();
  });
  await context.addInitScript(lang=>{localStorage.setItem('brs48cr_lang',lang);localStorage.setItem('tw_index2_tut_v2','1');},lang);
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  await page.evaluate(()=>document.fonts.ready);
  await page.locator('#hubToque').click({force:true});await page.waitForTimeout(400);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  assert(!overflow,device+'/'+lang+' horizontal overflow');
  await page.screenshot({path:`../evidence/${device}-${lang}-hub.png`,fullPage:true});
  await page.locator('[data-ir="karaoke"]').click({force:true});
  await page.locator('#twKaraokeFechado').waitFor({state:'visible'});
  const closed=await page.locator('#twKaraokeFechado').innerText();
  assert(await page.locator('#twKaraokeConviteRascunho').count()===0);
  await page.screenshot({path:`../evidence/${device}-${lang}-closed.png`,fullPage:true});
  await page.locator('#twKaraokeEnsaiar').click({force:true});
  const frame=page.frameLocator('#twPreviewIframe');await frame.locator('#krStatusTxt').waitFor({state:'visible'});
  await page.screenshot({path:`../evidence/${device}-${lang}-rehearsal.png`,fullPage:true});
  await page.locator('#twPreviewVoltar').click({force:true});
  await page.locator('[data-ir="sora"]').click({force:true});
  await frame.locator('#soraOv').waitFor({state:'visible'});
  await page.screenshot({path:`../evidence/${device}-${lang}-sora.png`,fullPage:true});
  await page.locator('#twPreviewVoltar').click({force:true});assert(await page.locator('#twPreviewIframe').getAttribute('src')==='about:blank');
  assert(errors.length===0,errors.join('\n'));
  results.push({device,viewport,lang,overflow,errors,closed,externalHostsBlocked:[...new Set(blocked)],flows:['hub','closed Karaoke','local rehearsal','return','Sora menu','return']});
  console.log('PASS',device,lang);await context.close();
 }
 const page=await browser.newPage();await page.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
 await page.goto('http://127.0.0.1:8765/index2.html');await page.waitForURL('http://127.0.0.1:8765/');
 fs.writeFileSync('../evidence/browser.json',JSON.stringify({browser:browser.version(),results,redirect:true,scope:'Local browser, isolated storage, all external requests blocked. No real devices or live account/economy/room tests.'},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
