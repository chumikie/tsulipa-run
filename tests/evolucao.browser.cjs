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
    try{
      let body = await readFile(arq);
      if(url.pathname === '/sora-jump.html') body = body.toString().replace('function soraStartGame(){', 'window.qaRotaSora='+testarRotaSora.toString()+';\n$&');
      return await r.fulfill({body,contentType:tipos[path.extname(arq)]});
    }
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
    assert.equal(await botao('rua').count(),0);
    await abrir(page,query,'2026-11-22T03:00:00Z');
    await botao('rua').click();
    await botao('studio').click();
    await page.locator('#studioOv [data-st="fundo"][data-v="rosa"][aria-pressed="true"]').waitFor();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').waitFor();
    await page.locator('#studioOv [data-piloto-bairro="rua"]').click();
    await page.locator('.tw-piloto-vitrine').waitFor();
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
    await page.locator('.tw-piloto-vitrine').getByText('☕',{exact:false}).waitFor();

    await abrir(page,'&piloto_bairro=1','2026-11-29T03:00:00Z');
    await botao('jornal').click();
    await page.locator('#jornalRuaFofa summary').click();
    await page.locator('#jornalRuaFofa').getByText('A vitrine abriu e a sua foto faz parte da exposição.').waitFor();
    await page.waitForFunction(() => TW_PILOTO_BAIRRO.medidas()[0].etapas.leu);
    await page.keyboard.press('Escape');
    await botao('rua').click();
    assert.equal(await botao('cafe').count(),0);
    await botao('studio').click();
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"][aria-pressed="true"]').waitFor();
    await page.locator('#studioOv [data-st="fundo"][data-v="rosa"]').click();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').click();
    assert.equal(await page.evaluate(() => TW_PILOTO_BAIRRO.medidas()[1].etapas.concluiu),undefined);
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"]').click();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').waitFor();
    await abrir(page,'&piloto_bairro=1','2026-12-06T03:00:00Z');
    await botao('jornal').click();
    await page.locator('#jornalRuaFofa [data-piloto-desfecho="1"] summary').click();
    await page.locator('#jornalRuaFofa').getByText('O mural de nuvens foi inaugurado com a sua contribuição.').waitFor();
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
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
    await fotos.nth(1).getByRole('button',{name:'Remover foto'}).click();
    await page.waitForFunction(() => document.querySelectorAll('.album-fotos-grade figure').length === 2);
    await abrir(page,'',null,'B');
    await verAlbum();
    await page.getByText('Sua série ainda está vazia.').waitFor();
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
function testarRotaSora(){
  soraCamY=-900;soraHighestY=-995;soraP.y=-993;soraHazards=[];
  soraUpdate(1);
  const plats=soraPlats.filter(p=>p.rota);
  soraDraw();
  function testar(pl){
    soraP.x=pl.x+pl.w/2-soraP.w/2;soraP.y=pl.y-soraP.h-2;soraP.vx=0;soraP.vy=3;
    soraUpdate(1);
    return soraP.vy;
  }
  const entrada=testar(plats.find(p=>p.rota==='entrada'));
  const aviso=soraToast;
  const subida=testar(plats.find(p=>p.k==='trampolim'));
  return {suaves:plats.filter(p=>p.rota==='suave').length,altas:plats.filter(p=>p.rota==='alta').length,entrada,aviso,subida};
}
async function sora(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await page.goto(origin+'/sora-jump.html?lang=pt&embed=index2');
    await page.locator('#soraPlayBtn').click();
    const rota = await page.evaluate(() => window.qaRotaSora());
    assert.equal(rota.suaves,7);
    assert.equal(rota.altas,4);
    assert.match(rota.aviso,/Bifurcação/);
    assert(rota.entrada<0 && rota.subida<rota.entrada);
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
    const anterior = await frame.evaluate(() => Object.keys(localStorage).filter(k=>k==='kt_showcase_week_v1'||/^kt_.*(attempt|ticket|score|round)/.test(k)).map(k=>[k,localStorage.getItem(k)]));
    await iframe.locator('#ktEnsaioComecar').click();
    await frame.waitForFunction(() => document.body.classList.contains('kt-playing') && ktEnsaioMedidas().iniciados === 1);
    assert.equal(await iframe.locator('#ktStartConfirm').evaluate(el=>el.open),false);
    await iframe.locator('#ktResult[open]').waitFor({timeout:33000});
    await iframe.locator('#ktResultTiming').waitFor();
    assert.equal(await frame.evaluate(() => ktEnsaioMedidas().concluidos),1);
    await iframe.locator('#ktTrechoBt').click();
    await iframe.locator('#ktResult[open]').waitFor({timeout:19000});
    assert.match(await iframe.locator('#ktTrechoResultado').textContent(),/Antes: \d+\/\d+ · Agora: \d+\/\d+/);
    assert.deepEqual(await frame.evaluate(() => ktEnsaioMedidas()),{iniciados:1,concluidos:1,repeticoes:0});
    await iframe.locator('#ktTrechoBt').click();
    await frame.waitForFunction(() => document.body.classList.contains('kt-playing'));
    const depois = await frame.evaluate(() => Object.keys(localStorage).filter(k=>k==='kt_showcase_week_v1'||/^kt_.*(attempt|ticket|score|round)/.test(k)).map(k=>[k,localStorage.getItem(k)]));
    assert.deepEqual(depois,anterior);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
(async()=>{
  const browser = await chromium.launch();
  try{
    await bairro(browser); console.log('✓ Rua Fofa em dois ciclos e bico isolado.');
    await album(browser); console.log('✓ Série persistente com Studio, Duo, Camarim, remoção e isolamento por conta.');
    await sora(browser); console.log('✓ Sora gera as duas rotas entre 100 e 250 m.');
    await karaoke(browser); console.log('✓ Karaoke repete o trecho e compara acertos sem gastar tentativa.');
  }finally{ await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
