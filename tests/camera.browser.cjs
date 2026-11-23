/* NODE_PATH=…/node_modules node tests/camera.browser.cjs [light|dark] [pasta para capturas] */
'use strict';
const {chromium}=require('playwright');const http=require('http'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),assert=require('node:assert/strict');
const server=http.createServer((q,r)=>{let f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);return r.end();}r.writeHead(200,{'content-type':{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.webp':'image/webp'}[path.extname(f)]||'application/octet-stream'});r.end(d);});});
(async()=>{await new Promise(o=>server.listen(0,'127.0.0.1',o));const base='http://127.0.0.1:'+server.address().port;
const b=await chromium.launch(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{});const tema=process.argv[2]||'light';const out=process.argv[3]||'';
const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true,colorScheme:tema});
await ctx.route(/supabase\.co|jsdelivr|googleapis|gstatic|youtube|google\.com/,r=>r.abort());
const p=await ctx.newPage();const er=[];p.on('pageerror',e=>er.push(e.message.slice(0,200)));
await p.addInitScript(()=>{try{localStorage.setItem('tw_cel_tut_v1','1');localStorage.setItem('tw_index2_tut_v2','1');}catch(e){}});
await p.goto(base+'/index.html?lang=pt');await p.waitForTimeout(1500);
await p.evaluate(()=>{contaRpc=n=>Promise.resolve(n==='duo_convidado'?{nick:'Convidada QA'}:[]);contaAuthUserId='A';contaJ={id:'A',nick:'Tsu'};});
await p.waitForTimeout(500);await p.evaluate(()=>{const f=document.getElementById('twcFolha');if(f)f.hidden=true;});await p.locator('[data-a="comecar"]').click({force:true});await p.waitForTimeout(400);await p.evaluate(()=>{const f=document.getElementById('twcFolha');if(f)f.hidden=true;});const tu=p.locator('[data-f="tutPular"]');await tu.waitFor({timeout:1600}).catch(()=>{});if(await tu.isVisible())await tu.click();
const info=async(n,W)=>{const d=await p.evaluate(()=>{const i=document.querySelector('.twcam-img');return i&&[i.naturalWidth,i.naturalHeight];});assert.ok(d&&d[0]>=W*2,n+': foto em 2× ou mais ('+d+')');assert.equal(await p.locator('.twcam-guardar').isVisible(),false,n+': sem botão de Álbum que não funciona');if(out)await p.screenshot({path:path.join(out,`${n}-${tema}.png`)});};
// Studio
await p.evaluate(()=>studioAbrir());await p.locator('#studioOv [data-st="clique"]').click();
await p.locator('#studioOv [data-st="salvar"]').waitFor({timeout:15000});await p.locator('#studioOv [data-st="salvar"]').click();
await p.locator('#twCamera:not([hidden])').waitFor();await p.waitForTimeout(500);await info('studio',432);
await p.locator('[data-cf="quadro"][data-cv="perto"]').click();await p.locator('[data-cf="moldura"][data-cv="oshi"]').click();await p.waitForTimeout(300);await info('studio-perto-oshi',432);
await p.keyboard.press('Escape');assert.equal(await p.locator('#twCamera').isHidden(),true);assert.equal(await p.locator('#studioX').isVisible(),true,'Esc fecha só a câmera, o Studio fica');await p.locator('#studioX').click();
// Duo
await p.evaluate(()=>duoAbrir('Convidada QA'));await p.waitForFunction(()=>typeof duoGu!=='undefined'&&duoGu,null,{timeout:15000});await p.waitForTimeout(800);
await p.evaluate(()=>{const d=document.getElementById('duoSalvar');if(d)d.open=true;});
await p.evaluate(()=>document.getElementById('duoPng').click());await p.locator('#twCamera:not([hidden])').waitFor();await p.waitForTimeout(500);await info('duo',960);
await p.keyboard.press('Escape');await p.keyboard.press('Escape');await p.waitForTimeout(400);
// VIP
await p.evaluate(()=>{TW_HUMOR.vipHoje=()=>true;const bt=document.createElement('button');bt.dataset.a='vip';bt.id='vipT';document.querySelector('#twcTela').appendChild(bt);});
await p.locator('#vipT').click({force:true});await p.locator('[data-a="vipFoto"]').click();
await p.locator('#twCamera:not([hidden])').waitFor();await p.waitForTimeout(500);await info('vip',640);
assert.equal(await p.locator('.twcam-p').evaluate(el=>el.scrollTop),0,'VIP abre no topo da prévia');
assert.equal(await p.locator('.twcam-x').evaluate(el=>el===document.activeElement),true);
await p.locator('[data-cf="pose"][data-cv="coracao"]').click();await p.locator('[data-cf="expr"][data-cv="3"]').click();await p.locator('[data-cf="quadro"][data-cv="perto"]').click();await p.locator('[data-cf="moldura"][data-cv="palco"]').click();await p.waitForTimeout(300);
await info('vip-pose',640);
assert.match(await p.locator('.twcam-salvar').getAttribute('href'),/^data:image\/png/);assert.equal(await p.locator('.twcam-salvar').getAttribute('download'),'tsulipa-camarim-vip.png');
await p.locator('[data-cf="pose"][data-trava]').first().click();assert.match(await p.locator('.twcam-msg').innerText(),/lojinha/);
assert.deepEqual(er,[]);console.log('✓ câmera nova: Studio, Moon⭐Duo! e Camarim VIP nítidos, com moldura, enquadramento e Esc só na câmera ('+tema+')');await b.close();server.close();})();
