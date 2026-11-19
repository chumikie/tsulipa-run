/* Center⭐Run jogado de verdade num navegador (17/11/2026): 10 s de corrida com o "Você" de chapéu de palha,
   cabelo longo e microfone, pulando sozinho. Falha se aparecer erro de JavaScript, se o Você não for desenhado
   de perfil ou se o freio de desempenho (celular lento → menos pixels no canvas do jogo) não funcionar.
   Sem conta e sem servidor: as chamadas de rede são bloqueadas.
   Uso: NODE_PATH=/caminho/node_modules node tests/corrida.browser.cjs /tmp/corrida */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),out=process.argv[2]||'/tmp/corrida-qa';
fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://local').pathname.slice(1))||'index.html',file=path.resolve(root,name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{if(err){res.writeHead(404).end();return;}
    const tipo={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'}[path.extname(file)]||'application/octet-stream';
    res.writeHead(200,{'content-type':tipo});res.end(data);});
});
(async()=>{
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch(),falhas=[];
  try{
    const ctx=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true});
    await ctx.route(/supabase\.co|jsdelivr|googleapis|gstatic|youtube/,r=>r.abort());
    const p=await ctx.newPage(),erros=[];p.on('pageerror',e=>erros.push(String(e.message||e).slice(0,200)));
    await p.addInitScript(()=>{try{localStorage.setItem('tw_cel_tut_v1','1');localStorage.setItem('tw_index2_tut_v2','1');localStorage.removeItem('tw_cr_nitidez');}catch(e){}});
    await p.goto(base+'/index.html');await p.waitForTimeout(1500);
    // o Você com chapéu, cabelo longo e microfone; contador de quadros desenhados de perfil
    await p.evaluate(()=>{
      if(window.TW_CELULAR)try{TW_CELULAR.desligar();}catch(e){}
      CH[3].hat='palha';CH[3].back='longo';accSel='mic';sel=3;
      const N=document.getElementById('nick');if(N)N.value='Teste';
      window.__perfil=0;const orig=TW_LADO.corre;TW_LADO.corre=function(g,c){if(c===CH[3])window.__perfil++;return orig.apply(this,arguments);};
      if(typeof hubFechar==='function')hubFechar();   // sai do Hub para o palco, como o jogador (a corrida baixa aqui)
      if(typeof twCorridaCarregar==='function')twCorridaCarregar();
    });
    await p.waitForFunction(()=>typeof jump==='function'&&typeof crDesempenho==='function',null,{timeout:15000});
    await p.evaluate(()=>start());
    await p.waitForTimeout(500);
    const t0=Date.now();
    let foto=false;
    while(Date.now()-t0<10000){
      await p.evaluate(()=>{if(state==='play')jump();else if(state==='over')start();});   // perdeu: corre de novo, até dar 10 s
      await p.waitForTimeout(550);
      if(!foto&&await p.evaluate(()=>state==='play')){foto=true;await p.screenshot({path:path.join(out,'corrida.png')});}
    }
    const r=await p.evaluate(()=>({estado:state,perfil:window.__perfil,k:TW_NITIDEZ.escala(cv)}));
    if(!['play','over'].includes(r.estado))falhas.push('a corrida não começou (estado '+r.estado+')');
    if(r.perfil<10)falhas.push('o Você de chapéu não foi desenhado de perfil ('+r.perfil+' quadros)');
    // freio de desempenho: 3 s de quadros lentos (40 ms) fazem o canvas baixar de 2× para 1,5× e guardar no aparelho
    const f=await p.evaluate(()=>{state='play';paused=false;crDes.n=0;crDes.ms=[];crDes.teto=9;const antes=TW_NITIDEZ.escala(cv);for(let i=0;i<260;i++)crDesempenho(40);
      return {antes,depois:TW_NITIDEZ.escala(cv),salvo:localStorage.getItem('tw_cr_nitidez'),largura:Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width').get.call(cv),w:cv.width};});
    if(!(f.antes>1.5&&f.depois===1.5&&f.salvo==='1.5'))falhas.push('freio de desempenho não baixou a nitidez: '+JSON.stringify(f));
    if(f.largura!==Math.round(f.w*1.5))falhas.push('canvas com tamanho errado depois do freio: '+JSON.stringify(f));
    // Colisão real no loop, recibo do resultado e tentativa seguinte no mesmo botão.
    await p.evaluate(()=>{
      start();
      LANG='pt';
      shield=0;inv=0;pw=null;P.air=false;P.y=GY-P.h;P.vy=0;
      obs=[{k:'speaker',x:P.x+5,y:GY-48,w:36,h:48}];
      update(1);
    });
    const motivo=p.locator('#crFimColisao'), tentar=p.locator('#again');
    await motivo.waitFor();
    assert.equal(await motivo.textContent(),'Colisão com a caixa de som · No chão');
    assert.equal(await tentar.getAttribute('aria-describedby'),'crFimColisao');
    assert.equal(await tentar.textContent(),'Tentar de novo');
    assert.equal(await tentar.evaluate(el=>document.activeElement===el),true);
    const salvo = await p.evaluate(()=>[score,best,starT,localStorage.getItem('brs48cr_lb')]);
    await p.locator('#crPraticaBt').click();
    await p.locator('#crPraticaPainel').waitFor();
    assert.equal(await p.evaluate(()=>obs.length===3&&obs.every(o=>o.k==='speaker')),true);
    await p.evaluate(()=>{
      for(let i=0;crPratica&&i<560;i++){
        const alvo=obs.find(o=>!o.testado&&o.x-P.x<88);
        if(alvo&&!P.air)jump();
        update(1);
      }
    });
    assert.match(await p.locator('#crPraticaStatus').textContent(),/Passou por [1-3] de 3/);
    assert.deepEqual(await p.evaluate(()=>[score,best,starT,localStorage.getItem('brs48cr_lb')]),salvo);
    await p.locator('#crPraticaBt').click();
    await p.locator('#crPraticaSair').click();
    await tentar.click();
    assert.equal(await p.evaluate(()=>state),'play');
    await p.locator('#over').waitFor({state:'hidden'});
    await p.evaluate(()=>{
      shield=0;inv=0;pw=null;P.air=false;P.y=GY-P.h;P.vy=0;
      obs=[{k:'cable',x:P.x+10,y:GY-12,w:56,h:12}];
      update(1);
    });
    await p.locator('#crPraticaBt').click();
    assert.equal(await p.evaluate(()=>obs.length===3&&obs.every(o=>o.k==='cable')),true);
    await p.locator('#crPraticaSair').click();
    if(erros.length)falhas.push('erro de JavaScript → '+[...new Set(erros)].slice(0,4).join(' | '));
    await ctx.close();
  }finally{await browser.close();server.close();}
  fs.writeFileSync(path.join(out,'resultado.txt'),falhas.length?falhas.join('\n'):'ok');
  assert.equal(falhas.length,0,'Corrida com problema:\n'+falhas.join('\n'));
  console.log('✓ Center⭐Run: 10 s jogando com o Você de chapéu, de perfil, sem erro; freio de desempenho ok');
})().catch(e=>{console.error(e.message||e);process.exit(1);});
