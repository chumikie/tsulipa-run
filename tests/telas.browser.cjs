/* Telas principais do TsuLiPa⭐World num navegador de verdade (17/11/2026).
   Abre o visual novo no celular (390 px, 3×), no computador (1280 px, 1,25×) e num tablet Android em pé e deitado, visita Início, Jogos, Fichinhas,
   Idol⭐News, Novidades, Álbum, Mapa, Perfil, Gacha e Loja, e falha se aparecer:
   - erro de JavaScript na página;
   - tela vazia (o caso da tela Novidades que ficou em branco);
   - desenho em canvas com menos de 0,9 pixel real por pixel de tela (borrado), fora os que já estão no teto de 2×
     de propósito (jogos grandes que redesenham a cada quadro, como o Center⭐Run).
   Sem conta e sem servidor: as chamadas ao Supabase respondem com dados inventados (nenhum dado real de jogador).
   Uso: NODE_PATH=/caminho/node_modules node tests/telas.browser.cjs /tmp/telas */
'use strict';
const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(process.env.TW_VISUAL_ROOT||path.join(__dirname,'..')),out=process.argv[2]||'/tmp/telas-qa';
const visualOnly=process.env.TW_VISUAL_ONLY==='1';
fs.mkdirSync(out,{recursive:true});

// servidor falso: dados inventados, só o necessário para as telas abrirem cheias
const FALSO=`window.__instalarFalso=function(){
  var av={v:1,expr:2,pose:'v',fundo:'basico',visual:'',c:{hair:'#7b3ff0',skin:'#f1c9a5',eye:'#5a3b2e',back:'chanel',front:'reta',out:'',outcol:'#ffffff',legcol:'#444466'}};
  var hoje=new Date().toISOString();
  var R={
    meu_perfil:{nick:'Idol QA',best:900,avatar:av,visuais:[],oshi:'tsu',coracoes:12},
    news_posts:[{titulo:'Ensaio aberto no palco',legenda:'Teste automático: post inventado.',criado:hoje,imagem:''}],
    duo_sugestoes:[{nick:'Teste A',best:120},{nick:'Teste B',best:80}],
    ranking:[{nick:'Teste A',score:900,avatar:av}],
    missoes:[{k:'run',feita:false,meta:1,prog:0,premio:5}]
  };
  window.contaRpc=function(n){return Promise.resolve(Object.prototype.hasOwnProperty.call(R,n)?JSON.parse(JSON.stringify(R[n])):[]);};
};`;
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://local').pathname.slice(1))||'index.html';
  const file=path.resolve(root,name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  fs.readFile(file,(err,data)=>{
    if(err){res.writeHead(404).end();return;}
    const ext=path.extname(file),tipo={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json'}[ext]||'application/octet-stream';
    res.writeHead(200,{'content-type':tipo});res.end(data);
  });
});

const TELAS=[['v','jogos','.twc-jogos'],['v','trio','#twcTela [data-trioaba]'],['a','news','#jornalOv'],['a','nov','#twcEmbSlot .twc-nov-tem'],['a','album','.twc-album'],['a','mapa','#twcEmbSlot #twMapa canvas'],['ir','perfil','#perfOv #perfFoto'],['ir','gacha','#gachaOv'],['ir','loja','#shopOv']];
const CONTA=new Set(['album','perfil','gacha','loja']);

async function rodar(browser,base,nome,opcoes){
  const ctx=await browser.newContext(opcoes);
  await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const p=await ctx.newPage(),erros=[];
  p.on('pageerror',e=>erros.push(String(e.message||e).slice(0,200)));
  await p.addInitScript(()=>{try{localStorage.setItem('brs48cr_celular','1');localStorage.setItem('tw_cel_tut_v1','1');localStorage.setItem('tw_index2_tut_v2','1');}catch(e){}});
  async function abrirInicio(conta){
    await p.goto(base+'/index.html?lang=pt',{waitUntil:'domcontentloaded'});
    await p.waitForFunction(()=>!!window.TW_CELULAR);
    await p.addScriptTag({content:FALSO});
    await p.evaluate(id=>{__instalarFalso();contaJ=id?{id:'qa-visual',nick:'Idol QA'}:null;contaAuthUserId=id?'qa-visual':'';},conta);
    for(const sel of ['[data-f="manutTentar"]','[data-a="comecar"]','[data-f="tutPular"]']){
      const b=p.locator(sel+':visible').first();if(await b.isVisible())await b.click();
    }
    await p.locator('#twcTela .twc-inicio').waitFor({state:'visible',timeout:10000});
  }
  await abrirInicio(false);await p.waitForTimeout(500);
  const falhas=[];
  const conferir=async tela=>{
    const r=await p.evaluate(()=>{
      const P=Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype,'width'),borrados=[];
      document.querySelectorAll('canvas').forEach(c=>{const R=c.getBoundingClientRect();if(R.width<60||R.height<40||R.bottom<0||R.top>innerHeight||getComputedStyle(c).visibility==='hidden')return;
        const q=P.get.call(c)/(R.width*devicePixelRatio),teto=window.TW_NITIDEZ&&(TW_NITIDEZ.escala(c)>=2||(TW_NITIDEZ.limitado&&TW_NITIDEZ.limitado(c)));if(q<0.9&&!teto)borrados.push((c.id||c.className||'canvas')+' '+q.toFixed(2));});
      const tela=document.getElementById('twcTela')||document.body,slot=document.getElementById('twcEmbSlot');
      const texto=(slot||tela).innerText.trim().length,graficos=(slot||tela).querySelectorAll('canvas,img,svg').length;
      return {borrados,texto,graficos};
    });
    if(r.borrados.length)falhas.push(nome+' · '+tela+': desenho borrado → '+r.borrados.join(', '));
    if(r.texto<20&&r.graficos===0)falhas.push(nome+' · '+tela+': tela vazia');
  };
  await conferir('inicio');await p.screenshot({path:path.join(out,nome+'-inicio.png')});
  for(const [t,v,alvo] of TELAS.concat(visualOnly?[['ir','studio','#studioOv #studioCv'],['ir','cafe','#cfOv #cfCv'],['ir','handshake','#hsOv #hsCv']]:[])){
    try{
      await abrirInicio(CONTA.has(v));
      const sel='[data-'+t+'="'+v+'"]:visible';
      const achar=()=>p.locator('#twcTela '+sel+',#twcNav '+sel+',#twcFolha '+sel).first();
      let e=achar();
      if(!await e.isVisible()&&!['perfil','loja'].includes(v)){await p.locator('#twcNav [data-n="menu"]:visible').click();e=achar();}
      if(!await e.isVisible()){const m=p.locator('[data-a="menuMais"]:visible').first();if(await m.isVisible())await m.click();e=achar();}
      if(!await e.isVisible()){const j=p.locator('[data-v="jogos"]:visible').first();if(await j.isVisible())await j.click();e=achar();}
      if(!await e.isVisible())e=p.locator(sel).first();
      await e.click({timeout:6000});
      await p.locator(alvo).first().waitFor({state:'visible',timeout:8000});
      await p.waitForTimeout(500);
      const identidade=await p.evaluate(sel=>{
        const esperado=document.querySelector(sel);if(!esperado)return false;
        const r=esperado.getBoundingClientRect(),top=document.elementFromPoint(Math.max(0,Math.min(innerWidth-1,r.x+r.width/2)),Math.max(0,Math.min(innerHeight-1,r.y+Math.min(r.height/2,80))));
        const ov=esperado.closest('.tw-window-overlay');
        return !!top&&(ov?ov.contains(top):esperado.contains(top)||!!top.closest('#twcTela')&&!top.closest('.tw-window-overlay'));
      },alvo);
      if(!identidade)throw Error('tela esperada encoberta ou ausente: '+alvo);
      await conferir(v);await p.screenshot({path:path.join(out,nome+'-'+v+'.png')});
    }catch(e){falhas.push(nome+' · '+v+': '+String(e.message||e).split('\n')[0]);}
  }
  if(erros.length)falhas.push(nome+': erro de JavaScript → '+[...new Set(erros)].slice(0,4).join(' | '));
  await ctx.close();
  return falhas;
}

async function conferirEstreia(browser, base){
  for(const jogo of ['run', 'studio']){
    const ctx = await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    try{
      await ctx.route(/supabase\.co|jsdelivr|googleapis|gstatic|youtube/, r => r.abort());
      const page = await ctx.newPage();
      await page.addInitScript(() => localStorage.setItem('tw_cel_tut_v1', '1'));
      await page.goto(base + '/index.html');
      await page.addScriptTag({content:FALSO});
      await page.evaluate(() => __instalarFalso());
      if(await page.locator('[data-f="manutTentar"]').isVisible()) await page.locator('[data-f="manutTentar"]').click();
      await page.locator('[data-a="comecar"]').click();
      const botao = page.locator('[data-estreia="' + jogo + '"]');
      const pos = await botao.boundingBox();
      assert.ok(pos && pos.y >= 0 && pos.y + pos.height <= 844);
      await botao.click();
      if(jogo === 'run'){
        await page.locator('#nick').fill('Estreia');
        await page.locator('#play').click();
      }else{
        await page.locator('#studioOv [data-st="clique"]').click();
      }
      await page.waitForFunction(() => TW_CELULAR.estreiaMedidas().conclusaoMs !== null, null, {timeout:25000});
      const medidas = await page.evaluate(() => TW_CELULAR.estreiaMedidas());
      assert.equal(medidas.atividade, jogo);
      assert.ok(medidas.escolhaMs >= 0 && medidas.inicioMs >= medidas.escolhaMs && medidas.conclusaoMs >= medidas.inicioMs);
      if(jogo === 'studio') await page.locator('#studioOv [data-st="salvar"]').waitFor();
    }finally{ await ctx.close(); }
  }
  console.log('✓ estreia: visitante conclui corrida e foto, com tempos de escolha, início e conclusão');
}

async function conferirCafe(browser,base,width=320,height=640){
  const ctx=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true});
  try{
    await ctx.route(/supabase\.co|jsdelivr|googleapis|gstatic|youtube/,r=>r.abort());
    const page=await ctx.newPage();
    await page.goto(base+'/index.html');
    await page.evaluate(async()=>{
      await twJogosCarregar();
      LANG='pt'; contaJ={id:'cafe-teste',nick:'Café Teste'};
      window.pedidosTeste=[{base:0,cob:-1,enf:0,doce:-1},{base:1,cob:0,enf:1,doce:0}];
      window.entregasTeste=[];
      window.contaRpc=(nome,args)=>{
        if(nome==='cafe_run_iniciar')return Promise.resolve({ok:true,run_id:'turno'});
        if(nome==='cafe_run_pedidos')return Promise.resolve({ok:true,criados:2,pedidos:pedidosTeste.map((pedido,i)=>({sessao:String(i),pedido,limite_segundos:i?105:120})).filter(p=>!entregasTeste.some(e=>e.args.p_sessao===p.sessao))});
        if(nome==='cafe_run_etapa2')return new Promise(resolve=>window.entregasTeste.push({resolve,args}));
        if(nome==='missoes')return Promise.resolve([{k:'cafe',meta:2,prog:entregasTeste.length}]);
        return Promise.resolve([]);
      };
      cfAbrir();
    });
    await page.locator('#cfJogar').click();
    const comanda=page.locator('#cfOv .cf-comanda');
    const servir=page.locator('#cfOv [data-cfd-servir]');
    const cliente = lado => page.locator('#cfOv [data-cfd-cliente="'+lado+'"]');
    await cliente(1).waitFor();
    assert.match(await cliente(1).locator('..').innerText(),/Atenda primeiro/);
    await cliente(0).click();
    await page.locator('#cfOv [data-cf="base:0"]').click();
    await cliente(1).click();
    await page.locator('#cfOv [data-cf="base:1"]').click();
    await cliente(0).click();
    assert.match(await cliente(0).locator('..').innerText(),/Copo ativo/);
    assert.equal(await cliente(0).locator('..').getByRole('listitem').count(),1);
    assert.equal(await cliente(1).locator('..').getByRole('listitem').count(),1);
    assert.notEqual(await cliente(0).locator('..').getByRole('listitem').textContent(),await cliente(1).locator('..').getByRole('listitem').textContent());
    assert.equal(await page.evaluate(()=>cf.monta.base),0);
    await cliente(1).click();
    assert.equal(await page.evaluate(()=>cf.monta.base),1);
    for(const lado of [0,1]){
      const cliente=page.locator('#cfOv [data-cfd-cliente="'+lado+'"]');
      await cliente.click();
      assert.equal(await cliente.getAttribute('aria-pressed'),'true');
      assert.equal(await comanda.getByRole('progressbar').count(),2);
      const pedido=await page.evaluate(i=>pedidosTeste[i],lado);
      const nome=await cliente.textContent();
      assert.ok((await comanda.locator('.cfpedidotxt').textContent()).includes(nome));
      for(const [tipo,indice] of Object.entries(pedido)){
        if(indice>=0)await page.locator('#cfOv [data-cf="'+tipo+':'+indice+'"]').click();
      }
      const visivel=await comanda.boundingBox();
      assert.ok(visivel && visivel.y>=0 && visivel.y+visivel.height<=height);
      await servir.click();
      await page.getByText(/Confirmando com o servidor/).waitFor();
      const antes=await servir.boundingBox();
      const rpc=await page.evaluate(i=>entregasTeste[i].args,lado);
      assert.equal(rpc.p_sessao,String(lado));
      assert.deepEqual(rpc.p_monta,pedido);
      await page.evaluate(i=>entregasTeste[i].resolve({ok:true,confirmado:true,certo:true,pontos:100*(i+1),vidas:3,perfeitos:i+1,combo:i+1}),lado);
      await page.getByText(lado===0?'1 de 2 pedidos confirmados':'Missão do Café concluída').waitFor();
      const depois=await servir.boundingBox();
      assert.ok(antes && depois && Math.abs(antes.y-depois.y)<=1,'a resposta online não desloca o botão Servir');
      assert.ok(depois.x>=0 && depois.x+depois.width<=width,'Servir cabe na tela móvel');
    }
    await page.screenshot({path:path.join(out,'cafe-'+width+'.png')});
    console.log('✓ Café em '+width+'×'+height+': dois copos independentes, prioridade e progresso da missão sem salto.');
  }finally{await ctx.close();}
}

(async()=>{
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch();
  let falhas=[];
  try{
    if(visualOnly){
      for(const [nome,width,height,colorScheme] of [['compacto',320,640,'light'],['iphone',390,844,'light'],['iphone-escuro',390,844,'dark'],['desktop',1280,800,'light']]){
        falhas=falhas.concat(await rodar(browser,base,nome,{viewport:{width,height},deviceScaleFactor:width<500?2:1,isMobile:width<500,hasTouch:width<500,colorScheme}));
      }
    }else{
    await conferirEstreia(browser,base);
    await conferirCafe(browser,base);
    await conferirCafe(browser,base,390,844);
    falhas=falhas.concat(await rodar(browser,base,'celular',{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}));
    falhas=falhas.concat(await rodar(browser,base,'computador',{viewport:{width:1280,height:800},deviceScaleFactor:1.25}));
    // tablets Android (Galaxy Tab, Xiaomi Pad e parecidos): em pé e deitado, com toque
    const ua='Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
    falhas=falhas.concat(await rodar(browser,base,'tablet-em-pe',{viewport:{width:800,height:1280},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:ua}));
    falhas=falhas.concat(await rodar(browser,base,'tablet-deitado',{viewport:{width:1280,height:800},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:ua}));
    }
  }finally{await browser.close();server.close();}
  fs.writeFileSync(path.join(out,'resultado.txt'),falhas.length?falhas.join('\n'):'ok');
  assert.equal(falhas.length,0,'Telas com problema:\n'+falhas.join('\n'));
  console.log('✓ telas principais: sem erro, sem tela vazia, sem desenho borrado (celular, computador e tablet em pé/deitado)');
})().catch(e=>{console.error(e.message||e);process.exit(1);});
