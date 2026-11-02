/* Isolated moderator/avatar lifecycle in real Chromium. No live RPC, account or save. */
'use strict';
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const root=path.resolve(__dirname,'..');
const out=process.argv[2]||'/tmp/admin-idol-browser';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).slice(1)||'index.html';
  const file=path.resolve(root,name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    if(name==='index.html'){
      const marker='var admIdol=null;';
      const hook="window.__qaAdminIdol={setRpc:function(fn){contaRpc=fn;perfAbrir=function(){};},mount:function(raw){perfAtual={nick:raw.nick};perfOv.hidden=false;var f=document.getElementById('admForm');if(!f){f=document.createElement('div');f.id='admForm';perfOv.appendChild(f);}f.hidden=false;f.innerHTML=admIdolFormHtml(raw);admIdolPrev();}};\n";
      const html=data.toString();
      assert(html.includes(marker),'Admin Idol injection point moved');
      data=Buffer.from(html.replace(marker,hook+marker));
    }
    res.setHeader('Content-Type',name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.js')?'text/javascript; charset=utf-8':name.endsWith('.css')?'text/css; charset=utf-8':'application/octet-stream');
    res.end(data);
  });
});
const setup=()=>{
  // Session storage is a disposable stand-in for a persisted database response across reloads.
  const key='qa-admin-idol-fictional-backend';
  const initial={nick:'IdolFicticio',auto:true,c:{},visuais:['roupa_tailandia'],stars:137,hand:'mic',admin_visual_rev:0};
  const read=()=>JSON.parse(sessionStorage.getItem(key)||'null')||initial;
  const write=d=>sessionStorage.setItem(key,JSON.stringify(d));
  window.confirm=()=>true;
  window.__qaIsAdmin=true;
  window.__qaRpc=function(name,args){
    const d=read();
    if(name==='admin_idol_info')return Promise.resolve({ok:true,nick:d.nick,c:d.c,auto:d.auto,best_idol:15000,visuais:d.visuais});
    if(name==='admin_montar_idol'){
      if(!window.__qaIsAdmin)return Promise.resolve({ok:false,erro:'admin'});
      if(args.p_nick!==d.nick)return Promise.resolve({ok:false,erro:'perfil'});
      if(args.p_c.out==='tailandia'&&!d.visuais.includes('roupa_tailandia'))return Promise.resolve({ok:false,erro:'nao_comprada'});
      const next={...d,c:{...args.p_c},admin_visual_rev:d.admin_visual_rev+1};
      write(next);
      return Promise.resolve({ok:true,nick:d.nick,c:next.c,admin_visual_rev:next.admin_visual_rev});
    }
    return Promise.reject(new Error('Unexpected RPC '+name));
  };
  window.__qaAdminIdol.setRpc(window.__qaRpc);
  window.__qaOpenIdol=async()=>{
    const data=await window.__qaRpc('admin_idol_info',{p_nick:'IdolFicticio'});
    window.__qaAdminIdol.mount(data);
  };
  window.__qaGetState=()=>read();
};
async function main(){
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{
    const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});
    await page.route(new RegExp('^https?://(?!127[.]0[.]0[.]1)'),route=>route.abort());
    await page.goto('http://127.0.0.1:'+server.address().port+'/index.html',{waitUntil:'domcontentloaded'});
    await page.evaluate(setup);
    await page.evaluate(()=>window.__qaOpenIdol());
    const form=page.locator('#admForm');
    await form.locator('select[data-ai="back"]').selectOption('onduladof');
    await form.locator('select[data-ai="mecha"]').selectOption('antena');
    await form.locator('select[data-ai="out"]').selectOption('tailandia');
    await form.locator('input[data-ai="hair"]').fill('#6a3fb5');
    await form.locator('input[data-ai="eye"]').fill('#29a1d9');
    const before=await page.locator('#admIdolCv').evaluate(cv=>cv.toDataURL());
    await form.locator('#admIdolSalvar').click();
    await page.waitForFunction(()=>window.__qaGetState().admin_visual_rev===1);
    const saved=await page.evaluate(()=>window.__qaGetState());
    assert.equal(saved.c.back,'onduladof');
    assert.equal(saved.c.mecha,'antena');
    assert.equal(saved.c.out,'tailandia');
    assert.equal(saved.stars,137);
    assert.deepEqual(saved.visuais,['roupa_tailandia']);
    assert.equal(saved.hand,'mic');
    assert.equal(saved.auto,true);
    // A fresh document re-reads the mock backend; no stale JS state survives.
    await page.reload({waitUntil:'domcontentloaded'});
    await page.evaluate(setup);
    await page.evaluate(()=>window.__qaOpenIdol());
    const after=await page.locator('#admIdolCv').evaluate(cv=>cv.toDataURL());
    assert.equal(after,before,'Preview pixels must persist across a full reload');
    assert.equal(await form.locator('select[data-ai="out"]').inputValue(),'tailandia');
    assert.equal(await form.locator('select[data-ai="mecha"]').inputValue(),'antena');
    const last=await page.evaluate(()=>window.__qaGetState());
    assert.equal(last.admin_visual_rev,1);
    // Permission rejection cannot change the fictitious backend.
    await page.evaluate(()=>{window.__qaIsAdmin=false;});
    await form.locator('#admIdolSalvar').click();
    await page.waitForFunction(()=>{const m=document.getElementById('admMsg');return m&&!m.hidden&&/não pode receber/.test(m.textContent);});
    assert.deepEqual(await page.evaluate(()=>window.__qaGetState()),last);
    await page.screenshot({path:path.join(out,'auto-idol-after-reload-390.png')});
    console.log('✓ automatic Idol: personalized, saved, reloaded pixels, inventory, stars, hand and admin restriction');
    await page.close();
  }finally{await browser.close();}
}
main().catch(err=>{console.error(err);process.exitCode=1;}).finally(()=>server.close());
