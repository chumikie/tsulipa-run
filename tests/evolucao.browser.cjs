/* NODE_PATH=/caminho/node_modules node tests/evolucao.browser.cjs */
'use strict';
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const {readFile} = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname,'..'), origin = 'https://evolucao.test';
const tipos = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
async function preparar(browser){
  const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  await context.route('**/*', async r => {
    const url = new URL(r.request().url());
    if(url.origin !== origin) return r.abort();
    const arq = path.resolve(root,'.'+url.pathname);
    if(!arq.startsWith(root+path.sep)) return r.abort();
    try{ return await r.fulfill({body:await readFile(arq),contentType:tipos[path.extname(arq)]}); }
    catch{ return await r.fulfill({status:404}); }
  });
  const page = await context.newPage(), erros = [];
  page.on('pageerror',e => erros.push(e.message));
  return {page, erros, context};
}
async function abrir(page, query, data, conta){
  if(data) await page.clock.setFixedTime(new Date(data));
  await page.goto(origin+'/index.html?lang=pt'+query);
  await page.evaluate(id => {
    contaRpc = () => Promise.resolve([]);
    contaAuthUserId = id || '';
    contaJ = id ? {id,nick:'Idol da série'} : null;
  },conta);
  await page.locator('[data-a="comecar"]').click();
  const tutorial = page.locator('[data-f="tutPular"]');
  await tutorial.waitFor({timeout:1600}).catch(error => { if(error.name !== 'TimeoutError') throw error; });
  if(await tutorial.isVisible()) await tutorial.click();
}
async function bairro(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    const query = '&piloto_bairro=1&piloto_bico=1';
    const botao = acao => page.locator('[data-piloto-bairro="'+acao+'"]:visible').first();
    await abrir(page,query,'2026-11-22T02:59:55Z');
    assert.equal(await botao('continuar').count(),0);
    await abrir(page,query,'2026-11-22T03:00:00Z');
    assert.equal(await page.locator('.twc-hj [data-piloto-bairro="continuar"]').count(),1);
    await botao('continuar').click();
    await botao('mapa').click();
    const vitrine = page.locator('#twMapa[data-cena="fofo"] .tw-mapa-vitrine');
    await vitrine.getByText('Vitrine em preparação',{exact:false}).waitFor();
    await vitrine.locator('[data-piloto-bairro="rua"]').click();
    await botao('studio').click();
    await page.locator('#studioOv [data-st="fundo"][data-v="rosa"][aria-pressed="true"]').waitFor();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').waitFor();
    await page.locator('#studioOv [data-piloto-bairro="rua"]').click();
    await page.locator('#twBairroOv .tw-piloto-vitrine').waitFor();
    await botao('cafe').click();
    await page.locator('#cfPraticaTitulo').waitFor();
    await page.locator('[data-cf="base:1"]').click();
    await page.locator('[data-cf="enf:0"]').click();
    await page.locator('[data-cf-pratica="conferir"]').click();
    assert.equal(await page.evaluate(() => TW_PILOTO_BAIRRO.medidas()[0].etapas.bicoConcluiu),undefined);
    await page.locator('[data-cf="base:0"]').click();
    await page.locator('[data-cf-pratica="conferir"]').click();
    assert(await page.evaluate(() => TW_PILOTO_BAIRRO.medidas()[0].etapas.bicoConcluiu));
    assert.equal(await page.evaluate(() => cf.pontos),0);
    await page.locator('[data-cf-pratica="voltar"]').click();
    await page.locator('#twBairroOv .tw-piloto-vitrine').getByText('☕',{exact:false}).waitFor();
    await botao('mapa').click();
    await vitrine.getByAltText('Sua foto em exposição na Rua Fofa').waitFor();
    await vitrine.getByText('Guardei um lugar para a sua foto',{exact:false}).waitFor();

    await abrir(page,'&piloto_bairro=1','2026-11-29T03:00:00Z');
    assert.equal(await botao('continuar').count(),1);
    await botao('continuar').click();
    await page.locator('#jornalRuaFofa').getByText('A vitrine abriu e a sua foto faz parte da exposição.').waitFor();
    await page.waitForFunction(() => TW_PILOTO_BAIRRO.medidas()[0].etapas.leu);
    await page.keyboard.press('Escape');
    await botao('continuar').click();
    assert.equal(await botao('cafe').count(),0);
    await page.locator('#twBairroOv [data-twb="fechar"]').click();
    await botao('continuar').click();
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"][aria-pressed="true"]').waitFor();
    await page.locator('#studioOv [data-st="fundo"][data-v="rosa"]').click();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').click();
    assert.equal(await page.evaluate(() => TW_PILOTO_BAIRRO.medidas()[1].etapas.concluiu),undefined);
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"]').click();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').waitFor();
    await abrir(page,'&piloto_bairro=1','2026-12-06T03:00:00Z');
    await botao('continuar').click();
    await page.locator('#jornalRuaFofa [data-piloto-desfecho="1"][open]').waitFor();
    await page.locator('#jornalRuaFofa').getByText('O mural de nuvens foi inaugurado com a sua contribuição.').waitFor();
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function navegarRua(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'&piloto_bairro=1','2026-11-22T12:00:00Z');
    const continuar = page.locator('.twc-hj [data-piloto-bairro="continuar"]');
    const voltaFocus = el => el.evaluate(n => n === document.activeElement);
    const bairro = page.locator('#twBairroOv'), studio = page.locator('#studioOv');
    await continuar.click();
    await bairro.waitFor();
    await page.keyboard.press('Escape');
    await bairro.waitFor({state:'hidden'});
    await page.waitForFunction(() => document.activeElement?.dataset.pilotoBairro === 'continuar');

    await continuar.click();
    await studio.waitFor();
    await page.locator('#twcMoldura [data-m="voltar"]').click();
    await studio.waitFor({state:'hidden'});
    await page.waitForFunction(() => document.activeElement?.dataset.pilotoBairro === 'continuar');

    await continuar.click();
    await studio.locator('.tw-window-close').click();
    await page.waitForFunction(() => document.activeElement?.dataset.pilotoBairro === 'continuar');
    await page.evaluate(()=>TW_BAIRRO.pularGuia());
    const mapa = page.locator('.twc-palco [data-a="mapa"]');
    await mapa.click();
    const rua = page.locator('#twMapa [data-tw-bairro="fofo"]');
    await rua.click();
    await page.locator('#twMapa[data-cena="fofo"]').waitFor();
    await page.keyboard.press('Escape');
    await rua.waitFor();
    assert.equal(await voltaFocus(rua),true);
    await rua.click();
    await page.locator('#twMapa[data-cena="fofo"]').waitFor();
    await page.locator('#twMapa .tw-mapa-voltar').click();
    await rua.waitFor();
    assert.equal(await voltaFocus(rua),true);
    await page.locator('#twcNav [data-n="voltar"]').click();
    await mapa.waitFor();
    assert.equal(await voltaFocus(mapa),true);

    await abrir(page,'&piloto_bairro=1','2026-11-29T12:00:00Z');
    await continuar.click();
    await page.locator('#jornalRuaFofa details[open]').waitFor();
    await page.locator('#jornalOv .tw-window-close').click();
    await page.waitForFunction(() => document.activeElement?.dataset.pilotoBairro === 'continuar');
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function escolherRua(browser){
  for(const escolha of ['studio','cafe']){
    const {page,erros,context} = await preparar(browser);
    try{
      await abrir(page,'&piloto_bairro=1','2026-12-06T12:00:00Z');
      await page.evaluate(()=>TW_BAIRRO.abrir());
      const painel=page.locator('#twBairroOv');
      await painel.locator('[data-piloto-bairro="studio"]').waitFor();
      await painel.locator('[data-piloto-bairro="cafe"]').waitFor();
      await painel.locator('[data-piloto-bairro="'+escolha+'"]').click();
      if(escolha==='studio'){
        await page.locator('#studioOv [data-st="clique"]').click();
        await page.locator('#studioOv [data-piloto-bairro="rua"]').click();
        await painel.getByAltText('Sua foto em exposição na Rua Fofa').waitFor();
      }else{
        await page.locator('#cfPraticaTitulo').waitFor();
        await page.locator('#cfOv [data-cf="base:0"]').click();
        await page.locator('#cfOv [data-cf="enf:0"]').click();
        await page.locator('#cfOv [data-cf-pratica="conferir"]').click();
        await page.locator('#cfOv [data-cf-pratica="voltar"]').click();
        await painel.getByText('☕ Plaquinha da casa').waitFor();
      }
      assert.equal(await painel.locator('[data-piloto-bairro="studio"],[data-piloto-bairro="cafe"]').count(),0);
      const medidas=await page.evaluate(()=>TW_PILOTO_BAIRRO.medidas()[2].etapas);
      assert.equal(Boolean(medidas.concluiu),escolha==='studio');
      assert.equal(Boolean(medidas.bicoConcluiu),escolha==='cafe');
      await abrir(page,'&piloto_bairro=1','2026-12-13T12:00:00Z');
      await page.evaluate(()=>jornalAbrir('ruaFofa',2));
      const artigo=page.locator('#jornalRuaFofa [data-piloto-desfecho="2"][open]');
      await artigo.getByText(escolha==='studio' ? /com a sua foto/ : /pelo pedido que você preparou/).waitFor();
      assert.deepEqual(erros,[]);
    }finally{ await context.close(); }
  }
}
async function album(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'',null,'A');
    await page.evaluate(() => studioAbrir());
    await page.locator('#studioOv [data-st="guardar-composicao"]').click();
    await page.locator('#studioOv [data-st="usar-composicao"]').click();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('[data-st="serie"]').click();
    await page.getByRole('button',{name:'Guardada na série.'}).waitFor();
    await page.locator('#studioX').click();
    await page.evaluate(() => {
      contaRpc = nome => Promise.resolve(nome === 'duo_convidado' ? {nick:'Convidada QA'} : []);
      duoAbrir('Convidada QA');
    });
    await page.locator('#duoSerie').click();
    await page.getByRole('button',{name:'Guardada na série.'}).waitFor();
    await page.keyboard.press('Escape');
    await page.evaluate(() => TW_HUMOR.evento(TW_HUMOR.desejo().ev));
    await page.locator('[data-a="vip"]:visible').first().click();
    await page.locator('[data-a="vipSerie"]').click();
    await page.getByRole('button',{name:'Guardada na série.'}).waitFor();

    async function verAlbum(){
      await page.locator('#twcNav [data-n="menu"]').click();
      await page.locator('[data-a="album"]:visible').first().click();
      await page.locator('details.album-fotos:visible summary').click();
      return page.locator('details.album-fotos:visible figure');
    }
    await abrir(page,'',null,'A');
    const fotos = await verAlbum();
    await fotos.nth(2).waitFor();
    assert.match(await fotos.nth(0).innerText(),/Camarim VIP/);
    assert.match(await fotos.nth(1).innerText(),/Moon⭐Duo!/);
    assert.match(await fotos.nth(2).innerText(),/Photo⭐Studio!/);
    const exportar = page.getByRole('button',{name:'Baixar página em PNG'});
    assert.equal(await exportar.isDisabled(),true);
    for(const i of [2,0,1]) await fotos.nth(i).getByRole('button',{name:/Selecionar foto/}).click();
    await page.getByLabel('Título da página').fill('Looks da semana');
    await page.getByLabel('Data',{exact:true}).fill('2026-11-22');
    const [download] = await Promise.all([page.waitForEvent('download'),exportar.click()]);
    assert.equal(download.suggestedFilename(),'tsulipa-pagina-de-fotos.png');
    const png = await readFile(await download.path());
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1440);
    assert.equal(png.readUInt32BE(20),980);
    await fotos.nth(1).getByRole('button',{name:'Remover foto'}).click();
    await page.waitForFunction(() => document.querySelectorAll('.album-fotos-grade figure').length === 2);
    await abrir(page,'',null,'B');
    await verAlbum();
    await page.getByText('Sua série ainda está vazia.').waitFor();
    assert.equal(await exportar.count(),0);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function cafe(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'',null,'A');
    await page.evaluate(async () => {
      await twJogosCarregar();
      hsMemGuardar({nome:hsNomesLivres()[0],pres:0,jeito:'fofo',c:{}});
      window.qaPedido = {base:1,cob:-1,enf:2,doce:-1};
      window.qaConfirmado = true;
      contaRpc = nome => Promise.resolve({
        cafe_run_iniciar:{ok:true,run_id:'qa-run'},
        cafe_run_pedidos:{ok:true,criados:1,pedidos:[{sessao:'qa-pedido',pedido:window.qaPedido}]},
        cafe_run_etapa2:{ok:true,confirmado:true,certo:window.qaConfirmado,pontos:200,vidas:3,perfeitos:1,combo:1}
      }[nome] || []);
      cfAbrir();
    });
    await page.locator('#cfJogar').click();
    await page.locator('.cfreencontro').waitFor();
    assert.doesNotMatch(await page.locator('.cfreencontro').innerText(),/lembro do meu pedido/);
    await page.locator('[data-cfd-aceitar]').click();
    await page.locator('[data-cfd-cliente="0"]').click();
    await page.evaluate(() => { cf.monta = {...qaPedido}; cfUI(); });
    await page.locator('[data-cfd-servir="0"]').click();
    await page.waitForFunction(() => hsMemLer()[0]?.ultimoPedido?.base === 1);
    await page.evaluate(() => {
      var m = hsMemLer()[0]; hsMemGuardar({nome:m.nome,pres:m.pres,jeito:'fofo',c:{}});
      cfFechar(); window.qaPedido = {base:2,cob:-1,enf:0,doce:-1}; window.qaConfirmado = false; cfAbrir();
    });
    await page.locator('#cfJogar').click();
    await page.getByText(/lembro do meu pedido.*Matcha latte.*Cereja/).waitFor();
    await page.locator('[data-cfd-aceitar]').click();
    await page.locator('[data-cfd-cliente="0"]').click();
    await page.evaluate(() => { cf.monta = {...qaPedido}; cfUI(); });
    await page.locator('[data-cfd-servir="0"]').click();
    await page.waitForFunction(() => cf.verificando === 0 && cf.ultimoAtendimento?.confirmacao === 2);
    assert.equal(await page.evaluate(() => hsMemLer()[0].ultimoPedido.base),1);
    await page.evaluate(() => { contaAuthUserId = 'B'; contaJ = {id:'B',nick:'Outro Idol'}; });
    assert.deepEqual(await page.evaluate(() => hsMemLer()),[]);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function karaoke(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'&piloto_karaoke=1');
    await page.locator('[data-a="karaokeEnsaio"]').click();
    const iframe = page.frameLocator('#twPreviewIframe');
    await iframe.locator('#ktEnsaioComecar').waitFor();
    const frame = await page.locator('#twPreviewIframe').elementHandle().then(h => h.contentFrame());
    const anterior = await frame.evaluate(() => Object.keys(localStorage).filter(k=>/^kt_.*(attempt|ticket|score|round)/.test(k)).map(k=>[k,localStorage.getItem(k)]));
    await iframe.locator('#ktEnsaioComecar').click();
    await frame.waitForFunction(() => document.body.classList.contains('kt-playing') && ktEnsaioMedidas().iniciados === 1);
    assert.equal(await iframe.locator('#ktStartConfirm').evaluate(el=>el.open),false);
    await iframe.locator('#ktResult[open]').waitFor({timeout:33000});
    await iframe.locator('#ktResultTiming').waitFor();
    assert.equal(await frame.evaluate(() => ktEnsaioMedidas().concluidos),1);
    await iframe.locator('#ktResultAgain').click();
    assert.deepEqual(await frame.evaluate(() => ktEnsaioMedidas()),{iniciados:2,concluidos:1,repeticoes:1});
    const depois = await frame.evaluate(() => Object.keys(localStorage).filter(k=>/^kt_.*(attempt|ticket|score|round)/.test(k)).map(k=>[k,localStorage.getItem(k)]));
    assert.deepEqual(depois,anterior);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
(async()=>{
  const browser = await chromium.launch();
  try{
    await bairro(browser); console.log('✓ Rua Fofa em dois ciclos e bico isolado.');
    await escolherRua(browser); console.log('✓ Studio e Café geram vitrines e desfechos distintos.');
    await navegarRua(browser); console.log('✓ Esc, Voltar e Fechar restauram a origem no piloto.');
    await album(browser); console.log('✓ Série persistente com Studio, Duo, Camarim, remoção e isolamento por conta.');
    await cafe(browser); console.log('✓ Café guarda apenas o pedido confirmado e o cita no retorno.');
    await karaoke(browser); console.log('✓ Ensaio termina e repete sem gastar tentativa.');
  }finally{ await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
