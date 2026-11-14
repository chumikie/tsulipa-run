/* QA de navegador para a PR #88: usa apenas cartas e avatares simulados.
 * cd tools/mapa && node teste-browser.cjs
 * Não conecta Supabase, não autentica contas, não altera produção.
 */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const raiz=path.resolve(__dirname,'../..');
const docs=new Set(['tw-mapa.js','mapa-textos.js','hub-polish.css','battle.js','battle.css','kt-fonts.css',
  'mapa-mundo.svg','mapa-rua-palco.svg','mapa-rua-harajuku.svg',
  'mapa-rua-fofo.svg','mapa-rua-praca.svg','mapa-rua-arena.svg','mapa-rua-ceu.svg']);
const mime={'css':'text/css','js':'text/javascript','svg':'image/svg+xml'};
const jogoMock=Array.from(new Set(['run','karaoke','sora','loja','gacha',
  'perfil','pet','cafe','handshake','duo'])).map(id=>
  '<button type="button" data-ir="'+id+'" onclick="window.abridos.push(this.dataset.ir)">'+id+'</button>').join('');
const html=`<!doctype html><html lang="pt" data-theme="light"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="/kt-fonts.css"><link rel="stylesheet" href="/hub-polish.css"><link rel="stylesheet" href="/battle.css">
<style>body{margin:0;padding:16px;background:#f9efff;color:#452b73}
html[data-theme=dark] body{background:#18142d;color:white}
#hub{max-width:1280px;margin:auto}#hubCards{display:block!important}
#hubCards>button,#hubHoje{display:none}
#hub .tw-mapa{display:flex!important}
#hub .tw-mapa-rolo{max-width:100%}
#hub .tw-mapa canvas{border:0}
</style></head><body>
<div id="hub"><div id="hubMenu"></div><div id="hubHoje">
<button class="hubfa">Pedido</button><button class="hubenc">Encontro</button>
<button class="hubjornal">Notícias</button></div>
<div id="hubCards">${jogoMock}<div class="hubbt-jogos">Jogos</div></div></div>
<script>window.abridos=[];window.TW_MAPA_HORA=14;
 window.TW_BLOOM_ON=true;window.bloomAbrir=function(){window.abridos.push('bloom');};
 window.TW_STUDIO_ON=true;window.studioAbrir=function(){window.abridos.push('studio');};</script>
<script src="/mapa-textos.js"></script><script src="/tw-mapa.js"></script><script src="/battle.js"></script></body></html>`;
const server=http.createServer((req,res)=>{
  const filename=decodeURIComponent((req.url||'/').split('?')[0]).replace(/^\//,'');
  if(filename===''){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});res.end(html);return;}
  if(!docs.has(filename)){res.writeHead(404);res.end('not found');return;}
  try{
    const bytes=fs.readFileSync(path.join(raiz,filename));
    res.writeHead(200,{'Content-Type':(mime[filename.split('.').pop()]||'text/plain')+'; charset=utf-8'});
    res.end(bytes);
  }catch(e){res.writeHead(404);res.end('not found');}
});
async function dispararCliqueMapa(page,x,y){
  await page.evaluate(([cx,cy])=>{
    const c=document.querySelector('#twMapa canvas'),rect=c.getBoundingClientRect();
    const mouse=new MouseEvent('click',{bubbles:true,cancelable:true,clientX:rect.left+cx*rect.width/c.width,
      clientY:rect.top+cy*rect.height/c.height});
    c.dispatchEvent(mouse);
  },[x,y]);
}
async function teste(page,dir,label){
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(dir,{waitUntil:'domcontentloaded'});
  if(label.includes('escuro'))await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));
  await page.locator('.tw-mapa-botao').click();
  await page.locator('#twMapa canvas').waitFor({state:'visible'});
  await page.waitForFunction(()=>document.querySelector('#twMapa canvas').height===1000);
  // Contrato visual: três jogos já existem no front. A arte regenerada não
  // deve mostrar nenhuma reserva antiga "Em breve"/"?" em mundo ou rua.
  const rotulos=await page.evaluate(()=>window.TW_MAPA_TEXTOS);
  for(const bairro of ['mundo','fofo','arena','ceu']){
    assert.ok(Array.isArray(rotulos[bairro]),'textos do mapa disponíveis: '+bairro);
    assert.ok(rotulos[bairro].every(t=>!/^\\s*(em breve|\\?)\\s*$/i.test(t.t)),
      'sem Em breve nem ? no bairro '+bairro);
  }
  for(const bairro of ['fofo','arena','ceu'])
    assert.ok(rotulos[bairro].some(t=>t.t==='Entrar'),'entrada do jogo real na rua '+bairro);
  await page.screenshot({path:path.join(__dirname,'qa-mundo-'+label+'.png'),fullPage:false});
  if(label.includes('320')||label.includes('390')){
    const medida=await page.locator('.tw-mapa-rolo').evaluate(el=>{
      const c=el.querySelector('canvas'),box=c.getBoundingClientRect();
      return {canvasWidth:box.width,viewportWidth:el.clientWidth,
        canvasHeight:box.height,viewportHeight:el.clientHeight,
        scrollWidth:el.scrollWidth,scrollHeight:el.scrollHeight};
    });
    assert.ok(Math.abs(medida.canvasWidth-medida.viewportWidth)<=3,
      'o mundo deve caber inteiro na largura do celular: '+JSON.stringify(medida));
    assert.ok(medida.scrollWidth<=medida.viewportWidth+2,'mundo panorâmico não rola lateralmente');
    assert.ok(medida.scrollHeight<=medida.viewportHeight+2,'mundo panorâmico não corta a ilha embaixo');
    assert.equal(await page.locator('.tw-mapa-bairros button').count(),6,
      'seis bairros legíveis abaixo da visão geral');
    await page.locator('.tw-mapa-zoom').click();
    const zoom=await page.locator('.tw-mapa-rolo').evaluate(el=>({
      scrollWidth:el.scrollWidth,clientWidth:el.clientWidth
    }));
    assert.ok(zoom.scrollWidth>zoom.clientWidth,'zoom permite explorar o mapa com rolagem');
    await page.locator('.tw-mapa-zoom').click();
    const volta=await page.locator('.tw-mapa-rolo').evaluate(el=>({
      scrollWidth:el.scrollWidth,clientWidth:el.clientWidth
    }));
    assert.ok(volta.scrollWidth<=volta.clientWidth+2,'Visão geral restaura ilha completa');
    console.log('OK '+label+' visão geral: '+Math.round(medida.canvasWidth)+'×'+
      Math.round(medida.canvasHeight)+' px + seis atalhos e zoom');
  }
  // A rua deve ser navegável mesmo em viewport estreita.
  await dispararCliqueMapa(page,800,420);
  await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='palco');
  const labelRua=await page.locator('#twMapa canvas').getAttribute('aria-label');
  assert.equal(labelRua,'Rua: Star Stage');
  await page.screenshot({path:path.join(__dirname,'qa-rua-'+label+'.png'),fullPage:false});
  const scroll=await page.locator('.tw-mapa-rolo').evaluate(el=>({w:el.scrollWidth,c:el.clientWidth}));
  if(label.includes('320')||label.includes('390'))assert.ok(scroll.w>scroll.c,'rua precisa de rolagem no celular');
  await page.locator('.tw-mapa-rolo').evaluate(el=>el.scrollLeft=el.scrollWidth);
  const scrolled=await page.locator('.tw-mapa-rolo').evaluate(el=>el.scrollLeft);
  if(scroll.w>scroll.c)assert.ok(scrolled>0,'arrasto deve alcançar a lateral');
  await dispararCliqueMapa(page,300,440);
  assert.deepEqual(await page.evaluate(()=>window.abridos),['handshake'],'usa card original');
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='mundo');
  await dispararCliqueMapa(page,1300,690);
  await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='harajuku');
  await page.goBack({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='mundo');
  await page.goForward({waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='harajuku');
  await page.locator('.tw-mapa-voltar').click();
  await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='mundo');
  if(label.includes('320')||label.includes('390')){
    // A lista também é navegação real para quem não consegue ler a placa pequena.
    await page.locator('.tw-mapa-bairros [data-tw-bairro="ceu"]').click();
    await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='ceu');
    await page.locator('.tw-mapa-voltar').click();
    await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='mundo');
  }
  // A integração dos três jogos usa pontos reais do mapa, sem criar cards.
  for(const [bairro,x,y,areaX,areaY] of [
    ['fofo',360,690,1300,490],['arena',1035,870,800,490],
    ['ceu',1330,230,1300,490]
  ]){
    await dispararCliqueMapa(page,x,y);
    await page.waitForFunction(id=>document.querySelector('#twMapa').dataset.cena===id,bairro);
    await dispararCliqueMapa(page,areaX,areaY);
    if(bairro==='arena'){
      await page.waitForFunction(()=>{const b=document.getElementById('battleOv');return b&&!b.hidden;});
      assert.match(await page.locator('#battleCorpo').innerText(),/Treino sem prêmio/,
        'arena acessível mas sem premiação até ativar RPC');
      await page.locator('[data-battle="jogar"]').click();
      await page.waitForFunction(()=>!!document.querySelector('#battleCorpo .battle-resultado'));
      assert.equal(await page.locator('.battle-round').count(),3,'três rodadas jogáveis no treino');
      assert.match(await page.locator('.battle-resultado').innerText(),/Sem recompensa/,
        'o treino nunca promete estrelas');
      await page.screenshot({path:path.join(__dirname,'qa-battle-'+label+'.png'),fullPage:false});
      await page.locator('[data-battle="fechar"]').click();
    }else{
      const calls=await page.evaluate(()=>window.abridos.slice(-1));
      assert.equal(calls[0],bairro==='fofo'?'bloom':'studio','bairro abre o jogo correto');
    }
    await page.locator('.tw-mapa-voltar').click();
    await page.waitForFunction(()=>document.querySelector('#twMapa').dataset.cena==='mundo');
  }
  assert.deepEqual(errors,[],'sem erros de JavaScript no navegador');
  console.log('OK '+label+' mundo/rua, cards, rolagem, Esc, history, jogos integrados; scrollWidth='+scroll.w);
}
(async()=>{
  for(const [arquivo,marca] of [['mapa-rua-fofo.svg','bloom-garden'],
    ['mapa-rua-ceu.svg','photo-studio'],['mapa-rua-arena.svg','idol-battle']]){
    const dados=fs.readFileSync(path.join(raiz,arquivo),'utf8');
    assert.ok(new RegExp('data-reserva=["\']'+marca+'["\']').test(dados),'espaço reservado '+marca);
  }
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const url='http://127.0.0.1:'+server.address().port+'/';
  const browser=await chromium.launch({headless:true});
  try{
    for(const [width,height,mode,label] of [[1280,800,'light','desktop'],
      [320,640,'light','320x640'],[390,844,'dark','390x844-escuro']]){
      const page=await browser.newPage({viewport:{width,height},colorScheme:mode});
      try{await teste(page,url,label);}finally{await page.close();}
    }
  }finally{await browser.close();server.close();}
})().catch(err=>{console.error(err);server.close();process.exitCode=1;});
