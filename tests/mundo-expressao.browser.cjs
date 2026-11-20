'use strict';
const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs/promises'),path=require('node:path');
const root=path.resolve(__dirname,'..'),origin='https://mundo.test';
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.TW_CHROME?{executablePath:process.env.TW_CHROME}:{})});
 try{
  for(const width of [320,390,1440]){
   const context=await browser.newContext({viewport:{width,height:844},reducedMotion:'reduce'});
   await context.route('**/*',async r=>{const u=new URL(r.request().url()),p=path.resolve(root,'.'+u.pathname);if(u.origin!==origin||!p.startsWith(root+path.sep))return r.abort();try{await r.fulfill({body:await fs.readFile(p),contentType:{'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'}[path.extname(p)]});}catch(e){await r.fulfill({status:404});}});
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/index.html?lang=pt');
   await page.evaluate(()=>{contaRpc=()=>Promise.resolve([]);});
   await page.locator('[data-a="comecar"]').click();
   const skip=page.locator('[data-f="tutPular"]');await skip.waitFor({timeout:1800}).catch(()=>{});if(await skip.isVisible())await skip.click();
   await page.locator('[data-n="menu"]').click();await page.locator('[data-v="ritmo"]').click();
   await page.locator('#twRitmoTitulo').waitFor();
   assert(await page.locator('[data-ritmo="tempo-2"]').getAttribute('aria-pressed')==='true');
   await page.locator('[data-ritmo="tempo-3"]').click();assert.equal(await page.locator('[data-ritmo="tempo-3"]').getAttribute('aria-pressed'),'true');
   await page.locator('[data-ritmo="pular"]').click();await page.locator('[data-ritmo="retomar"]').waitFor();
   await page.locator('[data-ritmo="retomar"]').click();
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'no horizontal page overflow '+width);
   await page.evaluate(()=>document.documentElement.dataset.theme='dark');
   await page.locator('[data-ritmo="tema"]').click();await page.locator('#studioOv').waitFor({state:'visible'});
   assert.equal(await page.locator('[data-st="luz"][data-v="por"]').count(),0,'other categories remain collapsed');
   await page.evaluate(()=>studioFechar());
   await page.evaluate(()=>{contaJ={id:'A',nick:'QA'};contaAuthUserId='A';const original=JSON.parse(JSON.stringify(CU));TW_CHARMAKER.sortear(true);TW_CHARMAKER.desfazer();if(JSON.stringify(CU)!==JSON.stringify(original))throw Error('Undo did not restore the original look');TW_CHARMAKER.sortear(true);contaJ={id:'B',nick:'QB'};contaAuthUserId='B';const current=JSON.stringify(CU);TW_CHARMAKER.desfazer();if(JSON.stringify(CU)!==current)throw Error('Undo crossed accounts');});
   await page.evaluate(()=>{pick(3);const anterior=CU.eye;const cor=document.getElementById('ceye');cor.value=anterior==='#123456'?'#654321':'#123456';cor.dispatchEvent(new Event('input',{bubbles:true}));cor.dispatchEvent(new Event('change',{bubbles:true}));if(CU.eye===anterior)throw Error('The eye color did not change');if(document.getElementById('custDesfazer').disabled)throw Error('Undo stayed disabled after a manual change');TW_CHARMAKER.desfazer();if(CU.eye!==anterior)throw Error('Undo did not restore a manual edit');});
   await page.evaluate(()=>{TW_CELULAR.visitar('mapa');if(window.TW_BAIRRO)TW_BAIRRO.guiaPergunta=()=>false;});
   if(width<760)await page.locator('[data-tw-rotulo="praca"]').click();
   else {const ponto=await page.locator('#twMapa canvas').evaluate(cv=>{const r=cv.getBoundingClientRect();return{x:r.x+r.width*.5,y:r.y+r.height*.65};});await page.mouse.click(ponto.x,ponto.y);}
   await page.locator('.tw-mapa-pausas').waitFor({state:'visible'});
   assert.equal(await page.locator('.tw-mapa-pausas button').count(),3);
   await page.locator('.tw-mapa-pausas button').nth(0).click();
   await page.locator('.tw-mapa-pausas button').nth(1).click();
   assert.deepEqual(errors,[]);console.log('Passed: optional paths, theme, undo, account boundary and Square interactions at '+width+'px');await context.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
