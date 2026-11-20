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
async function memoria(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'',null,'memoria');
    const serve=await page.evaluate(async()=>{
      await twJogosCarregar();
      const nome=hsNomesLivres()[0];
      hsMemGuardar({nome,pres:4,c:{hair:'#116677'},jeito:'timido'});
      contaRpc=n=>Promise.resolve(n==='handshake_iniciar' ? {ok:true,sessao:'teste',desafios:[[0,1,2]]} : []);
      eventoPresente=()=>4;
      hsAbrir();
      return nome;
    });
    await page.locator('#hsJogar').click();
    await page.waitForFunction(()=>hs.fila.some(f=>f.presAnterior===4));
    await page.getByText(/Meu favorito agora/).waitFor();
    const info=await page.evaluate(nome=>{
      const f=hs.fila.find(f=>f.nome===nome);
      hs.qi=hs.quiz.indexOf(f)-1;hsProxima();
      return {opcao:hs.ops.indexOf(4),presentes:hs.fila.map(f=>f.pres),cabelo:f.c.hair,certo:f.pres};
    },serve);
    assert.deepEqual(info.presentes,[0,1,2]);
    assert.equal(info.cabelo,'#116677');
    assert(info.opcao>=0);
    await page.locator('#hsOv [data-hs="'+info.opcao+'"]').click();
    await page.evaluate(()=>hsFim());
    await page.getByText(/Pistas para rever · 1/).click();
    await page.getByText(/Você respondeu/).waitFor();
    assert.equal(await page.evaluate(()=>hs.respostas[0].resposta),4);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function decoracao(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'',null,'decoracao');
    await page.evaluate(async()=>{
      contaRpc=n=>Promise.resolve(n==='jardim_estado' ? {ok:true,canteiros:[],flores:{sakura:1,tulipa:2,girassol:1,lunar:1}} : []);
      bloomAbrir();
    });
    const flores=page.locator('[data-bloom="arranjo-flor"]');
    await flores.nth(3).waitFor();
    await flores.nth(0).click();await flores.nth(1).click();await flores.nth(2).click();
    assert.equal(await flores.nth(3).isDisabled(),true);
    await page.locator('[data-bloom="arranjo-studio"]').click();
    await page.locator('#studioOv [data-v="arranjo_sakura+tulipa+girassol"][aria-pressed="true"]').waitFor();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.getByText('Arranjo guardado na foto local.').waitFor();
    await page.locator('#studioX').click();
    await page.evaluate(async()=>{await petSalaCarregar();$('nick').value='Idol QA';petOpenUI();});
    await page.locator('#petov').waitFor();
    if(await page.locator('#petPick').isVisible()){
      await page.locator('#petPick [data-k="tsu"]').click();
      await page.locator('#petName').fill('Teste');
      await page.locator('#petGo').click();
    }
    await page.locator('#petActs [data-a="decorar"]').click();
    await page.locator('[data-k="cena-cochilo"]').click();
    await page.locator('[data-k="cena-cochilo"][aria-pressed="true"]').waitFor();
    await page.locator('[data-k="cena-estrela"]').click();
    await page.locator('[data-k="cena-estrela"][aria-pressed="true"]').waitFor();
    await page.locator('[data-k="cena-foto"]').click();
    await page.getByRole('button',{name:'Guardada na série.'}).waitFor();
    await page.locator('#petWindowClose').click();
    await page.locator('#twcNav [data-n="menu"]').click();
    await page.locator('[data-a="album"]:visible').first().click();
    await page.locator('details.album-fotos:visible summary').click();
    await page.locator('.album-fotos:visible figure').getByText(/Backstage⭐Pet!/).waitFor();
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function album(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'',null,'A');
    await page.evaluate(() => studioAbrir());
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"]').click();
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
    await fotos.nth(2).getByRole('button',{name:'Usar como referência'}).click();
    await page.locator('#studioOv .st-referencia img').waitFor();
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"][aria-pressed="true"]').waitFor();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="serie"]').click();
    await page.getByRole('button',{name:'Guardada na série.'}).waitFor();
    await page.locator('#studioX').click();
    const grade=page.locator('details.album-fotos:visible');
    if(!await grade.locator('summary').evaluate(n=>n.parentNode.open))await grade.locator('summary').click();
    else{
      await grade.locator('summary').click();
      await grade.locator('summary').click();
    }
    await fotos.nth(3).getByRole('button',{name:'Selecionar para comparação'}).click();
    await fotos.nth(0).getByRole('button',{name:'Selecionar para comparação'}).click();
    const baixar=page.waitForEvent('download');
    await grade.getByRole('button',{name:'Baixar antes e depois'}).click();
    assert.equal((await baixar).suggestedFilename(),'tsulipa-antes-e-depois.png');
    await fotos.nth(2).getByRole('button',{name:'Remover foto'}).click();
    await page.waitForFunction(() => document.querySelectorAll('.album-fotos-grade figure').length === 3);
    await abrir(page,'',null,'B');
    await verAlbum();
    await page.getByText('Sua série ainda está vazia.').waitFor();
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
    await memoria(browser); console.log('✓ Handshake revê a pista antiga e mantém as respostas da rodada.');
    await decoracao(browser); console.log('✓ Arranjo no Studio e cenas do pet guardadas no Álbum.');
    await album(browser); console.log('✓ Série persistente com Studio, Duo, Camarim, remoção e isolamento por conta.');
    await karaoke(browser); console.log('✓ Ensaio termina e repete sem gastar tentativa.');
  }finally{ await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
