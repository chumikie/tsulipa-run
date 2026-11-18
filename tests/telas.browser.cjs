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
const root=path.join(__dirname,'..'),out=process.argv[2]||'/tmp/telas-qa';
fs.mkdirSync(out,{recursive:true});

// servidor falso: dados inventados, só o necessário para as telas abrirem cheias
const FALSO=`window.__instalarFalso=function(){
  var av={v:1,expr:2,pose:'v',fundo:'basico',visual:'',c:{hair:'#7b3ff0',skin:'#f1c9a5',eye:'#5a3b2e',back:'chanel',front:'reta',out:'',outcol:'#ffffff',legcol:'#444466'}};
  var hoje=new Date().toISOString();
  var R={
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

const TELAS=[['v','jogos'],['v','trio'],['a','news'],['a','nov'],['a','album'],['a','mapa'],['ir','perfil'],['ir','gacha'],['ir','loja']];

async function rodar(browser,base,nome,opcoes){
  const ctx=await browser.newContext(opcoes);
  await ctx.route(/supabase\.co|jsdelivr|googleapis|gstatic|youtube/,r=>r.abort());
  const p=await ctx.newPage(),erros=[];
  p.on('pageerror',e=>erros.push(String(e.message||e).slice(0,200)));
  await p.addInitScript(()=>{try{localStorage.setItem('tw_cel_tut_v1','1');localStorage.setItem('tw_index2_tut_v2','1');}catch(e){}});
  await p.goto(base+'/index.html');await p.waitForTimeout(1500);
  await p.addScriptTag({content:FALSO});
  const abrirInicio=()=>p.evaluate(()=>{__instalarFalso();TW_CELULAR.desligar();TW_CELULAR.ligar();var c=document.querySelector('[data-a="comecar"]');if(c)c.click();});
  await abrirInicio();await p.waitForTimeout(1000);
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
  for(const [t,v] of TELAS){
    await abrirInicio();await p.waitForTimeout(400);
    const abriu=await p.evaluate(([t,v])=>{const sel='[data-'+t+'="'+v+'"]';let e=document.querySelector(sel);
      if(!e){const m=document.querySelector('[data-n="menu"]');if(m)m.click();e=document.querySelector(sel);}
      if(!e){const j=document.querySelector('[data-v="jogos"]');if(j)j.click();e=document.querySelector(sel);}
      if(e){e.click();return true;}return false;},[t,v]);
    if(!abriu){falhas.push(nome+' · '+v+': botão não encontrado');continue;}
    await p.waitForTimeout(1600);
    await conferir(v);await p.screenshot({path:path.join(out,nome+'-'+v+'.png')});
  }
  if(erros.length)falhas.push(nome+': erro de JavaScript → '+[...new Set(erros)].slice(0,4).join(' | '));
  await ctx.close();
  return falhas;
}

async function conferirCafe(browser,base){
  const ctx=await browser.newContext({viewport:{width:320,height:640},isMobile:true,hasTouch:true});
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
        if(nome==='cafe_run_pedidos')return Promise.resolve({ok:true,criados:2,pedidos:pedidosTeste.map((pedido,i)=>({sessao:String(i),pedido,limite_segundos:120})).filter(p=>!entregasTeste.some(e=>e.args.p_sessao===p.sessao))});
        if(nome==='cafe_run_etapa2')return new Promise(resolve=>window.entregasTeste.push({resolve,args}));
        if(nome==='missoes')return Promise.resolve([{k:'cafe',meta:2,prog:entregasTeste.length}]);
        return Promise.resolve([]);
      };
      cfAbrir();
    });
    await page.locator('#cfJogar').click();
    const comanda=page.locator('#cfOv .cf-comanda');
    const servir=page.locator('#cfOv [data-cfd-servir]');
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
      assert.ok(visivel && visivel.y>=0 && visivel.y+visivel.height<=640);
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
      assert.ok(depois.x>=0 && depois.x+depois.width<=320,'Servir cabe na tela de 320 px');
    }
    await page.screenshot({path:path.join(out,'cafe-320.png')});
    console.log('✓ Café em 320 px: duas comandas, dois pedidos e progresso da missão sem salto.');
  }finally{await ctx.close();}
}

(async()=>{
  await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
  const base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch();
  let falhas=[];
  try{
    await conferirCafe(browser,base);
    falhas=falhas.concat(await rodar(browser,base,'celular',{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}));
    falhas=falhas.concat(await rodar(browser,base,'computador',{viewport:{width:1280,height:800},deviceScaleFactor:1.25}));
    // tablets Android (Galaxy Tab, Xiaomi Pad e parecidos): em pé e deitado, com toque
    const ua='Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
    falhas=falhas.concat(await rodar(browser,base,'tablet-em-pe',{viewport:{width:800,height:1280},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:ua}));
    falhas=falhas.concat(await rodar(browser,base,'tablet-deitado',{viewport:{width:1280,height:800},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:ua}));
  }finally{await browser.close();server.close();}
  fs.writeFileSync(path.join(out,'resultado.txt'),falhas.length?falhas.join('\n'):'ok');
  assert.equal(falhas.length,0,'Telas com problema:\n'+falhas.join('\n'));
  console.log('✓ telas principais: sem erro, sem tela vazia, sem desenho borrado (celular, computador e tablet em pé/deitado)');
})().catch(e=>{console.error(e.message||e);process.exit(1);});
