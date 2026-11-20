/* NODE_PATH=/caminho/node_modules node tests/evolucao.browser.cjs */
'use strict';
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const {readFile} = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname,'..'), origin = 'https://evolucao.test';
const tipos = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.woff2':'font/woff2'};
async function preparar(browser){
  const context = await browser.newContext({viewport:{width:390,height:844},hasTouch:true});
  await context.route('**/*', async r => {
    const url = new URL(r.request().url());
    if(url.origin !== origin) return r.abort();
    const arq = path.resolve(root,'.'+url.pathname);
    if(!arq.startsWith(root+path.sep)) return r.abort();
    try{
      let body=await readFile(arq);
      if(url.pathname==='/sora-jump.html')body=body.toString().replace('function soraStartGame(){','window.qaQuedaSora='+simularQueda.toString()+';\n$&');
      if(url.pathname==='/sora-jump.html')body=body.toString().replace('function soraStartGame(){','window.qaIdolSora=soraGetActiveCharacter;\n$&');
      if(url.pathname === '/sora-jump.html') body = body.toString().replace('function soraStartGame(){', 'window.qaRotaSora='+testarRotaSora.toString()+';\n$&');
      if(url.pathname==='/karaoke-time.html')body=body.toString().replace('function owner(){','window.qaIdolKaraoke=siteChar;\n$&');
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
async function isolarContaPessoal(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'A');
    await page.evaluate(()=>{
      window.qaRPC=[];
      contaRpc=(nome,args)=>new Promise(resolve=>qaRPC.push({nome,args,resolve}));
      window.qaTrocar=(id)=>{
        contaJ={id,nick:'Mesmo apelido'};contaAuthUserId=id;contaSessaoToken++;
        TW_PESSOAL.contaMudou();TW_SEMANA.contaMudou();
      };
      window.qaResposta=(nome,valor,indice=0)=>qaRPC.filter(p=>p.nome===nome)[indice].resolve(valor);
      window.qaPerfil=()=>{
        perfOv.hidden=false;
        $('perfCorpo').innerHTML='<div class="perfhero">Perfil em teste</div>';
        TW_PESSOAL.vitrineMontar({},true);
      };
      qaTrocar('A');qaPerfil();TW_PESSOAL.abrirRetro('2026-10-01');TW_SEMANA.carregar(true);
      window.qaShowEncerrado=twKaraokeOnline.terminar('show-A',{score:2,song:'normal'});
      const show=document.createElement('button');show.dataset.semana='show';document.body.append(show);show.click();
      const festa=document.createElement('button');festa.dataset.semana='festa';document.body.append(festa);festa.click();
      qaTrocar('B');qaPerfil();starT=41;perfDono=[];
      qaResposta('minha_vitrine',{vitrine:{musica:'Música da conta B'},insignias:[]},1);
      qaResposta('minha_vitrine',{vitrine:{musica:'Música da conta A'},insignias:[]});
      qaResposta('retro_mes',{ok:true,nick:'Conta A',mes:'2026-10-01'});
      qaResposta('show_sabado_marcar',{ok:true,stars:999,premio:20});
      qaResposta('kt_run_finish',{ok:true,ranked:true});
      qaResposta('festa_resgatar',{ok:true,visuais:['fundo_cafe']});
      qaResposta('show_sabado_estado',{eu:true,premio:20});
      qaResposta('festa_estado',{ativa:true,tema:'cafe',guardou:true});
      qaResposta('jogo_da_semana',null);
    });
    await page.locator('.twp-vit-mus').getByText('Música da conta B').waitFor();
    assert.equal(await page.getByText('Música da conta A').count(),0);
    assert.equal(await page.locator('.twp-ov:visible').count(),0);
    assert.deepEqual(await page.evaluate(()=>[starT,perfDono,document.body.hasAttribute('data-tw-festa')]),[41,[],false]);
    assert.deepEqual(await page.evaluate(()=>qaShowEncerrado),{ok:true,ranked:true});

    await page.getByRole('button',{name:'Editar vitrine'}).click();
    await page.evaluate(()=>qaResposta('album_cards',[]));
    assert.equal(await page.locator('#twpVMus').inputValue(),'Música da conta B');
    await page.locator('#twpVOk').click();
    await page.evaluate(()=>{
      qaTrocar('C');
      TW_PESSOAL.recadoAbrir();
      qaResposta('salvar_vitrine',{ok:true});
    });
    const recado=page.locator('#twpRecado');
    await recado.fill('Recado em teste');
    await page.locator('#twpEnviar').click();
    await page.evaluate(()=>{
      qaTrocar('D');TW_PESSOAL.abrirRetro('2026-11-01');
      qaResposta('recado_tsulipa_enviar',{ok:true});
      qaResposta('retro_mes',{ok:true,nick:'Conta D',mes:'2026-11-01'},1);
    });
    const email=page.locator('#twpEmail');
    await email.waitFor();
    assert.equal(await email.isDisabled(),true);
    await page.evaluate(()=>qaResposta('email_mensal',{ok:true,ligado:true}));
    await email.uncheck();
    await page.evaluate(()=>{
      qaTrocar('E');TW_PESSOAL.recadoAbrir();
      qaResposta('email_mensal',{ok:true,ligado:false},1);
    });
    await recado.waitFor();
    assert.equal(await email.count(),0);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
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
    await page.locator('#studioOv').getByText(/O desfecho sai.*29 de novembro/).waitFor();
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
    await page.locator('.tw-piloto-rosa').getByText(/foto e a plaquinha/).waitFor();
    await page.keyboard.press('Escape');
    await page.evaluate(()=>TW_BAIRRO.pularGuia());
    await page.locator('.twc-palco [data-a="mapa"]').click();
    await page.locator('#twMapa [data-tw-bairro="fofo"]').click();
    await page.locator('.tw-mapa-recado-rosa').getByText(/na semana passada/).waitFor();
    await page.locator('#twcNav [data-n="voltar"]').click();
    await page.locator('#twcNav [data-n="voltar"]').click();
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
      await page.locator(escolha==='studio'?'#studioOv [data-st="clique"]':'#cfPraticaTitulo').waitFor();
      await abrir(page,'&piloto_bairro=1','2026-12-06T12:00:00Z');
      assert.equal(await page.evaluate(()=>TW_PILOTO_BAIRRO.continuacao().acao),escolha);
      await page.locator('[data-piloto-bairro="continuar"]:visible').click();
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
    await page.waitForFunction(()=>TW_HUMOR.vipHoje());
    await page.waitForTimeout(350);
    const vip=page.locator('.twc-hj [data-a="vip"]');
    if(!await vip.isVisible())await page.locator('.twc-hj [data-hjver]').first().click();
    await vip.click();
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
    await exportar.evaluate(el=>el.scrollIntoView({block:'center'}));
    const [download] = await Promise.all([page.waitForEvent('download'),exportar.click()]);
    assert.equal(download.suggestedFilename(),'tsulipa-pagina-de-fotos.png');
    const png = await readFile(await download.path());
    assert.equal(png.subarray(1,4).toString(),'PNG');
    assert.equal(png.readUInt32BE(16),1440);
    assert.equal(png.readUInt32BE(20),980);
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
async function gachaBattle(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'battle-qa');
    await page.evaluate(()=>{
      const cards=[
        {nick:'Tsu',canto:7,danca:3,carisma:2},
        {nick:'Lirika',canto:4,danca:8,carisma:4},
        {nick:'Pati',canto:2,danca:2,carisma:7},
        {nick:'Mika',canto:9,danca:6,carisma:6}
      ];
      window.battleAcoes=[];
      contaRpc=n=>{
        battleAcoes.push(n);
        if(n==='gacha_hoje')return Promise.resolve({tipo:'card',card:{nick:'Mika',best:0}});
        if(n==='battle_arena')return Promise.resolve({ok:true,minha:{unit:cards.slice(0,3)},lista:[]});
        if(n==='battle_status')return Promise.resolve({ok:true,starter:!!window.qaStarter,cards,rival:cards.slice(0,3)});
        return Promise.resolve([]);
      };
    });
    await page.locator('#twcNav [data-n="menu"]').click();
    const origem=page.locator('#twcTela [data-ir="gacha"]');
    await origem.focus();
    await page.keyboard.press('Enter');
    const abrirPrevia=()=>page.getByRole('button',{name:'Testar no meu trio'}).click();
    const batalha=page.locator('#battleOv');
    await abrirPrevia();
    const canto=batalha.getByRole('button',{name:'Canto 9'});
    await canto.waitFor();
    assert.equal(await batalha.locator('#battleCartaDiferenca').innerText(),'Canto · Tsu 7 → Mika 9');
    await batalha.getByRole('button',{name:'Dança 6'}).click();
    assert.equal(await batalha.locator('#battleCartaDiferenca').innerText(),'Dança · Lirika 8 → Mika 6');
    await batalha.getByRole('button',{name:'Cancelar prévia'}).click();
    await batalha.locator('[data-battle="abrir-slot"][data-slot="1"]').getByText('Lirika',{exact:true}).waitFor();
    await batalha.locator('.tw-window-close').click();
    await page.waitForFunction(()=>document.activeElement?.dataset.ir==='gacha');
    await page.evaluate(()=>gachaAbrir());
    await abrirPrevia();
    await batalha.getByRole('button',{name:'Dança 6'}).click();
    await batalha.getByRole('button',{name:'Confirmar no trio'}).click();
    await batalha.locator('[data-battle="abrir-slot"][data-slot="1"]').getByText('Mika',{exact:true}).waitFor();
    await batalha.locator('.tw-window-close').click();
    await page.evaluate(()=>{window.qaStarter=true;gachaAbrir();});
    await abrirPrevia();
    await batalha.getByText(/Junte três Idols diferentes/).waitFor();
    assert.equal(await batalha.getByRole('button',{name:'Confirmar no trio'}).count(),0);
    assert.deepEqual(await page.evaluate(()=>battleAcoes.filter(n=>n==='battle_jogar'||n==='battle_unit_salvar')),[]);
    await batalha.locator('.tw-window-close').click();
    await page.evaluate(()=>{
      window.qaEnviosGacha=0;
      contaRpc=n=>{
        if(n==='gacha_girar'){
          qaEnviosGacha++;
          return new Promise(resolve=>{window.qaRespostaGacha=resolve;});
        }
        return Promise.resolve(null);
      };
      gachaFeito=false;gachaRes=null;gachaAbrir();
    });
    await page.locator('#gachaGirar').click();
    await page.locator('#gachaX').click();
    await page.evaluate(()=>gachaAbrir());
    assert.equal(await page.locator('#gachaGirar').isDisabled(),true);
    assert.equal(await page.evaluate(()=>qaEnviosGacha),1);
    await page.evaluate(()=>{
      contaAuthUserId='battle-qa-outra';
      contaJ={id:contaAuthUserId,nick:'Outra conta'};
      gachaAbrir();
      qaRespostaGacha({ok:true,tipo:'card',card:{nick:'Card da sessão anterior'}});
    });
    await page.waitForTimeout(1700);
    assert.equal(await page.locator('#gachaBattle').isVisible(),false);
    assert.equal(await page.evaluate(()=>gachaRes),null);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function cafeFoco(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'cafe-qa');
    await page.evaluate(async()=>{
      await twJogosCarregar();
      window.cafeRPC=[];
      contaRpc=n=>{cafeRPC.push(n);return Promise.resolve([]);};
      cfAbrir();
    });
    const cafe=page.locator('#cfOv');
    await cafe.locator('[data-cfd-turno]').click();
    await cafe.locator('[data-cfd-cliente]:enabled').first().click();
    const escolher=async(m)=>{
      for(const [tipo,i] of Object.entries(m))if(i>=0)await cafe.locator('[data-cf="'+tipo+':'+i+'"]').click();
    };
    await page.evaluate(()=>{cf.alvoBalcao.cli.pedido={base:0,cob:0,enf:0,doce:-1};});
    await escolher({base:0,cob:1,enf:0});
    await cafe.locator('[data-cfd-servir]').click();
    await page.evaluate(()=>cfFim());
    const antes=await page.evaluate(()=>({pontos:cf.pontos,atendidos:cf.atendidos,vidas:cf.vidas,caderno:cfLer(CF_RECEITAS_KEY,{})}));
    await cafe.getByRole('button',{name:'Praticar Cobertura'}).click();
    assert.deepEqual(await page.evaluate(()=>cf.pratica.pedidos.map(p=>p.cob)),[0,-1,1]);
    for(let i=0;i<3;i++){
      const pedido=await page.evaluate(i=>cf.pratica.pedidos[i],i);
      await escolher(pedido);
      await cafe.locator('[data-cf-pratica="conferir"]').click();
      await cafe.locator('[data-cf-pratica="proximo"]').click();
    }
    await cafe.getByText('Três pedidos praticados.').waitFor();
    await cafe.locator('[data-cf-pratica="voltar"]').click();
    assert.equal(await cafe.getByRole('button',{name:'Praticar Cobertura'}).evaluate(b=>b===document.activeElement),true);
    assert.deepEqual(await page.evaluate(()=>({pontos:cf.pontos,atendidos:cf.atendidos,vidas:cf.vidas,caderno:cfLer(CF_RECEITAS_KEY,{})})),antes);
    assert.deepEqual(await page.evaluate(()=>cafeRPC.filter(n=>n.startsWith('cafe_run'))),[]);
    await page.evaluate(()=>cfAbrir());
    await cafe.getByText(/No próximo turno, sirva um pedido com Cobertura/).waitFor();
    await cafe.locator('#cfJogar').click();
    await page.waitForFunction(()=>cf.fase==='pedido');
    await page.evaluate(()=>{
      cf.cli.pedido={base:0,cob:0,enf:0,doce:-1};cf.monta={...cf.cli.pedido};cfServir(false);
    });
    await cafe.getByText(/Cobertura: pedido correto e dentro do prazo/).waitFor();
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function copiaAlbum(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'backup-origem');
    await page.evaluate(()=>{
      localStorage.setItem('tw_studio_composicao_v1:conta:backup-origem',JSON.stringify({fundo:'rosa',pose:'v',luz:'suave',quadro:'inteiro'}));
      const c=document.createElement('canvas');c.width=c.height=24;
      const btn=document.createElement('button');
      return TW_ALBUM_FOTOS.salvar('studio',c,btn,{fundo:'nuvens',pose:'tchau',luz:'por',quadro:'meio',objeto:'balao'});
    });
    const ver=async()=>{
      await page.locator('#twcNav [data-n="menu"]').click();
      await page.locator('[data-a="album"]:visible').first().click();
      await page.locator('details.album-fotos:visible summary').click();
      return page.locator('details.album-fotos:visible');
    };
    let caixa=await ver();
    const evento=page.waitForEvent('download');
    await caixa.getByRole('button',{name:'Baixar cópia da série'}).click();
    const stream=await (await evento).createReadStream(),dados=[];
    for await(const chunk of stream)dados.push(chunk);
    const arquivo=Buffer.concat(dados), copia=JSON.parse(arquivo);
    assert.equal(copia.fotos[0].composicao.fundo,'nuvens');
    assert.equal(copia.favorita.fundo,'rosa');
    await abrir(page,'',null,'backup-destino');
    await page.evaluate(()=>{
      localStorage.setItem('tw_studio_composicao_v1:conta:backup-destino',JSON.stringify({fundo:'neon',pose:'v',luz:'suave',quadro:'inteiro'}));
      const c=document.createElement('canvas');c.width=c.height=22;
      return TW_ALBUM_FOTOS.salvar('duo',c,document.createElement('button'));
    });
    caixa=await ver();
    async function enviar(buffer){ await caixa.locator('input[type=file]').setInputFiles({name:'copia.json',mimeType:'application/json',buffer}); }
    await enviar(arquivo);
    await caixa.getByText(/Fotos adicionadas: 1.*favorita atual foi mantida/).waitFor();
    assert.equal(await caixa.locator('figure').count(),2);
    await enviar(arquivo);
    await caixa.getByText(/Fotos adicionadas: 0/).waitFor();
    const excesso={...copia,fotos:Array.from({length:24},(_,i)=>({...copia.fotos[0],quando:copia.fotos[0].quando+i+1}))};
    await enviar(Buffer.from(JSON.stringify(excesso)));
    await caixa.getByText(/espaço para apenas 22/).waitFor();
    const corrompida={...copia,fotos:[{...copia.fotos[0],imagem:'data:image/jpeg;base64,QQ=='}]};
    await enviar(Buffer.from(JSON.stringify(corrompida)));
    await caixa.getByText('Cópia inválida ou indisponível.').waitFor();
    assert.equal(await caixa.locator('figure').count(),2);
    await caixa.getByRole('button',{name:'Usar como referência'}).click();
    await page.locator('#studioOv .st-referencia img').waitFor();
    await page.locator('#studioOv [data-st="fundo"][data-v="nuvens"][aria-pressed="true"]').waitFor();
    assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('tw_studio_composicao_v1:conta:backup-destino')).fundo),'neon');
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
function simularQueda(tipo){
  window.qaMetaSora=()=>({rota:soraLerMetaTreino(null),objetivo:soraMetaTreino,feita:soraMetaTreinoFeita});
  window.qaEstadoSora=()=>({soraBest,starT,storage:Object.fromEntries(Object.entries(localStorage).filter(([k])=>!k.includes('brs48cr_sora_meta_treino_v1:')))});
  window.qaCompletarMetaSora=()=>{
    const alvo={k:'nuvem',rota:'saida',x:100,y:-1508,w:72,h:14,vx:0};
    soraRotaDaSubida='alta';soraPlats=[alvo];soraHazards=[];
    soraP.x=alvo.x+8;soraP.y=alvo.y-soraP.h-2;soraP.vy=3;
    soraUpdate(1);
  };
  window.qaAcertarSora=()=>{
    const alvo=soraPlats[1];soraP.x=alvo.x+8;soraP.y=alvo.y-soraP.h-2;soraP.vy=3;
    soraUpdate(1);
  };
  const altura=tipo==='trampolim'?-1560:-1150;
  soraState='play';soraUltimoSalto={tipo,rota:tipo==='trampolim'?'alta':'entrada',y:altura+110};
  soraPousoPerdido=null;
  soraP.x=tipo==='trampolim'?239:130;soraP.y=altura-soraP.h-2;soraP.vx=0;soraP.vy=3;
  soraCamY=altura+50;soraHighestY=altura-50;
  soraPlats=[{k:'nuvem',rota:tipo==='trampolim'?'':'alta',x:tipo==='trampolim'?170:215,y:altura,w:50,h:14,vx:0}];
  soraUltimoSalto.p={...soraP,x:tipo==='trampolim'?239:130,y:altura+110-soraP.h,vy:-11.8};
  soraUltimoSalto.origem={k:'nuvem',x:100,y:altura+110,w:72,h:14};
  soraHazards=[];soraUpdate(1);soraEndGame();
}
async function quedasSora(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await page.goto(origin+'/sora-jump.html?lang=pt&embed=index2');
    await page.locator('#soraPlayBtn').click();
    await page.evaluate(()=>window.qaQuedaSora('nuvem'));
    await page.locator('#soraDicaQueda').getByText(/Atalho alto \(115 m\).*direita/).waitFor();
    const antes=await page.evaluate(()=>window.qaEstadoSora());
    await page.locator('#soraTreinoPouso').click();
    await page.evaluate(()=>window.qaAcertarSora());
    await page.locator('#soraTreinoResultado').getByText('Pouso certo!').waitFor();
    assert.deepEqual(await page.evaluate(()=>window.qaEstadoSora()),antes);
    assert.equal(await page.evaluate(()=>qaMetaSora().rota),'alta');
    await page.locator('#soraAgainBtn').click();
    assert.equal(await page.evaluate(()=>qaMetaSora().objetivo),'alta');
    await page.evaluate(()=>qaCompletarMetaSora());
    assert.equal(await page.evaluate(()=>qaMetaSora().feita),true);
    assert.equal(await page.evaluate(()=>qaMetaSora().rota),null);
    await page.evaluate(()=>window.qaQuedaSora('trampolim'));
    await page.locator('#soraDicaQueda').getByText(/Depois do trampolim.*156 m.*esquerda/).waitFor();
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
function testarRotaSora(){
  soraHeight=74;const semAviso=soraPreviaRotaAtiva();
  soraHeight=75;const antesDaBifurcacao=soraPreviaRotaAtiva();
  soraHeight=104;const naEntrada=soraPreviaRotaAtiva();
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
  soraHeight=270;soraEndGame();
  const rapido=document.getElementById('soraResTxt').textContent;
  soraReset();soraRotaDaSubida='suave';soraHeight=180;soraEndGame();
  const ambos=document.getElementById('soraResTxt').textContent;
  return {rapido,ambos,semAviso,antesDaBifurcacao,naEntrada,suaves:plats.filter(p=>p.rota==='suave').length,altas:plats.filter(p=>p.rota==='alta').length,entrada,aviso,subida};
}
async function sora(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await page.goto(origin+'/sora-jump.html?lang=pt&embed=index2');
    await page.locator('#soraPlayBtn').click();
    const rota = await page.evaluate(() => window.qaRotaSora());
    assert.deepEqual([rota.semAviso,rota.antesDaBifurcacao,rota.naEntrada],[false,true,false]);
    assert.equal(rota.suaves,7);
    assert.equal(rota.altas,4);
    assert.match(rota.aviso,/Bifurcação/);
    assert(rota.entrada<0 && rota.subida<rota.entrada);
    assert.match(rota.rapido,/Caminho nesta subida · Atalho alto.*Ainda sem marca.*Atalho alto270 m.*375 m/);
    assert.match(rota.ambos,/Caminho nesta subida · Nuvens próximas.*Nuvens próximas180 m.*Atalho alto270 m.*375 m/);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function cafeAlternado(browser){
  const {page,erros,context} = await preparar(browser);
  try{
    await abrir(page,'',null,'cafe-teste');
    await page.evaluate(async()=>{ await twJogosCarregar(); cfAbrir(); });
    const cafe=page.locator('#cfOv');
    await cafe.locator('[data-cfd-turno]').click();
    if(await cafe.locator('[data-cfd-aceitar]').isVisible()) await cafe.locator('[data-cfd-aceitar]').click();
    const clientes=cafe.locator('[data-cfd-cliente]:enabled');
    assert.equal(await clientes.count(),1);
    const inicial=await page.evaluate(()=>({tempo:cf.fila[0].t0,modo:cf.modoServidor,caderno:cfLer(CF_RECEITAS_KEY,{})}));
    assert.equal(inicial.modo,'treino');
    await clientes.nth(1).waitFor();
    assert(await page.evaluate(t=>cf.fila[1].t0-t>=180,inicial.tempo));
    for(const lado of [0,1]){
      await cafe.locator('[data-cfd-cliente="'+lado+'"]').click();
      const p=await page.evaluate(()=>cf.alvoBalcao.cli.pedido);
      if(lado===1) p.base=(p.base+1) % await page.evaluate(()=>CF_BASES.length);
      for(const [tipo,valor] of Object.entries(p)){
        if(valor>=0) await cafe.locator('[data-cf="'+tipo+':'+valor+'"]').click();
      }
      await cafe.locator('[data-cfd-servir]').click();
    }
    await page.waitForFunction(()=>cf.fila.some(e=>e.estado==='espera'));
    await page.evaluate(()=>{
      const cliente=cf.fila.find(e=>e.estado==='espera');
      cliente.monta={...cliente.cli.pedido};
      if(cf.alvoBalcao===cliente)cf.monta=cliente.monta;
      cfT=cliente.t0+cliente.limite+1;
    });
    await page.waitForFunction(()=>cf.causas[1]===1);
    await page.evaluate(()=>cfFim());
    const resumo=cafe.locator('#cfTurnoResumo');
    await resumo.getByText('Pedidos certos no prazo · 1/3').waitFor();
    await resumo.getByText(/Receitas incorretas · 1/).waitFor();
    await resumo.getByText(/Receitas certas fora do prazo · 1/).waitFor();
    assert.match(await resumo.textContent(),/Ingrediente com mais erros · .+ \(1\)/);
    assert.deepEqual(await page.evaluate(()=>cfLer(CF_RECEITAS_KEY,{})),inicial.caderno);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
async function leituraHandshake(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'treino-leitura');
    await page.evaluate(async()=>{
      await twJogosCarregar();
      window.hsChamadas=[];
      contaRpc=n=>{hsChamadas.push(n);return Promise.resolve([]);};
      hsAbrir();
    });
    const h=page.locator('#hsOv');
    await h.getByRole('button',{name:'Treinar no meu ritmo'}).click();
    const fila=await page.evaluate(()=>hs.fila.map(f=>[f.nome,f.pres]));
    await page.evaluate(()=>{hsT+=900;});
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(()=>hs.vi),0);
    for(let i=0;i<fila.length;i++)await h.getByRole('button',{name:'Próximo fã'}).click();
    await h.getByRole('button',{name:'Começar a lembrar'}).click();
    await page.evaluate(()=>{hsT+=900;});
    await page.waitForTimeout(100);
    assert.equal(await page.evaluate(()=>hs.fase),'quiz');
    for(let i=0;i<fila.length;i++){
      await page.waitForFunction(()=>hs.fase==='quiz');
      const resposta=await page.evaluate(()=>hs.ops.indexOf(hs.quiz[hs.qi].pres));
      await h.locator('[data-hs="'+resposta+'"]').click();
      await page.evaluate(()=>{hsT+=90;});
    }
    await h.getByRole('button',{name:'Repetir com o tempo padrão'}).click();
    assert.deepEqual(await page.evaluate(()=>hs.fila.map(f=>[f.nome,f.pres])),fila);
    assert.equal(await page.evaluate(()=>hs.leituraManual),false);
    await page.evaluate(()=>{hsT+=900;});
    await page.waitForFunction(()=>hs.vi===1);
    assert.deepEqual(await page.evaluate(()=>hsChamadas.filter(n=>/handshake_iniciar|finish|premio/.test(n))),[]);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function provarNaLoja(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'prova-qa');
    const antes=await page.evaluate(()=>{
      CU.hair='#8866aa';CU.outcol='#c48998';accSel='mic';perfDono=[];
      window.shopChamadas=[];contaRpc=n=>{shopChamadas.push(n);return Promise.resolve(null);};
      shopAbrir();
      return shopAvAtual(false);
    });
    const l=page.locator('#shopOv');
    const provar=l.locator('button[data-provar]').first();
    const codigo=await provar.getAttribute('data-provar');
    await provar.focus();
    await page.keyboard.press('Enter');
    await l.locator('#shopAntes').waitFor();
    const depois=await page.evaluate(()=>shopAvAtual());
    assert.deepEqual(depois.c,{...antes.c,out:codigo});
    assert.equal(depois.a,antes.a);
    assert.equal(await page.evaluate(()=>CU.out),antes.c.out);
    await l.locator('#shopSalvar').click();
    await l.getByText('Compre a roupa para salvar com ela.').waitFor();
    await l.locator('#shopLimparProva').click();
    await l.locator('#shopAntes').waitFor({state:'hidden'});
    assert.deepEqual(await page.evaluate(()=>shopChamadas.filter(n=>n==='comprar_visual'||n==='salvar_avatar')),[]);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function dirigirDuo(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'duo-direcao');
    await page.evaluate(()=>{
      contaRpc=n=>Promise.resolve(n==='duo_convidado'?{nick:'Convidada QA'}:[]);
      duoAbrir('Convidada QA');
    });
    const d=page.locator('#duoPedido'), variante=d.getByRole('button',{name:'Outra interpretação'});
    await variante.waitFor();
    const montar=d.locator('.duo-pedido-bt');
    if(await montar.isVisible())await montar.click();
    assert.equal(await d.locator('li').count(),4);
    const antes=await page.evaluate(()=>[duoGu.nick,duoCena,duoFundo,duoQuadro,duoInvertido]);
    await variante.click();
    const agora=await page.evaluate(()=>[duoGu.nick,duoCena,duoFundo,duoQuadro,duoInvertido]);
    assert.deepEqual(agora.slice(0,3),antes.slice(0,3));
    assert.notEqual(agora[3],antes[3]);
    assert.notEqual(agora[4],antes[4]);
    await page.locator('#duoSerie').click();
    await page.getByRole('button',{name:'Guardada na série.'}).waitFor();
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function reencontroDeUmaPista(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'rever-outra-sessao');
    await page.evaluate(async()=>{
      await twJogosCarregar();hsAbrir();const r=hsSorteio(44),fa=hsFa(r,hsNomesLivres()[0]);
      hsAnotarPista(fa,false,-1);
    });
    const pista=await page.evaluate(()=>hsPistaPendente().nome);
    await page.reload();
    await page.evaluate(async()=>{
      contaJ={id:'rever-outra-sessao',nick:'Idol da série'};await twJogosCarregar();hsAbrir();
    });
    const painel=page.locator('#hsOv');
    await painel.getByRole('button',{name:'Treinar no meu ritmo'}).click();
    assert.equal(await page.evaluate(()=>hs.fila[0].nome),pista);
    await painel.getByRole('button',{name:'Próximo fã'}).click();
    await painel.getByRole('button',{name:'Começar a lembrar'}).click();
    const pos=await page.evaluate(()=>hs.ops.indexOf(hs.quiz[0].pres));
    await painel.locator('[data-hs="'+pos+'"]').click();
    await page.evaluate(()=>{hsT+=90;});
    await painel.getByText(/Agora você lembrou/).waitFor();
    assert.equal(await page.evaluate(()=>hsPistaPendente()),null);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function favoritoNoStudio(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'qa-look');
    const antes=await page.evaluate(()=>{
      localStorage.setItem('brs48cr_favs',JSON.stringify([{hair:'#ff6fb5',outcol:'#445522'}]));
      if(TW_CHARMAKER.favoritos().length || !TW_CHARMAKER.importarFavoritos())throw Error('herança de favoritos');
      bestcGravar({0:0,1:0,2:0,3:ACC.find(a=>a[0]==='mic')[2]});
      pick(3);
      accSel='mic';refreshAcc();
      window.qaStudio=[];window.qaItens=[];
      const desenho=perfDesenharIdol;
      perfDesenharIdol=function(x,w,h,av){qaItens.push(av.a);return desenho.apply(this,arguments);};
      contaRpc=n=>{qaStudio.push(n);return Promise.resolve([]);};
      shopAbrir();return CU.outcol;
    });
    await page.locator('#shopOv [data-shop-aba="vestindo"]').click();
    assert.equal(await page.evaluate(()=>TW_CHARMAKER.favoritoVisual(0).a),'mic');
    await page.getByRole('button',{name:'Guardar visual atual no espaço 2'}).click();
    await page.evaluate(()=>{accSel='laco';refreshAcc();});
    const provar=page.getByRole('button',{name:/Provar.*2/,exact:false}).filter({visible:true});
    await provar.click();
    assert.equal(await page.evaluate(()=>accSel),'laco');
    await page.getByRole('button',{name:/Vestir.*2/}).click();
    assert.equal(await page.evaluate(()=>accSel),'mic');
    await page.locator('#shopOv [data-cm="desfazer"]:visible').click();
    assert.equal(await page.evaluate(()=>accSel),'laco');
    await page.getByRole('button',{name:/Fotografar favorito.*2/}).click();
    await page.locator('#studioOv [data-st="clique"]').click();
    await page.locator('#studioOv [data-st="outra"]').waitFor();
    assert.ok(await page.evaluate(()=>qaItens.includes('mic')));
    assert.equal(await page.evaluate(()=>accSel),'laco');
    assert.equal(await page.evaluate(()=>CU.outcol),antes);
    assert.equal(await page.evaluate(()=>qaStudio.includes('studio_clique')),false);
    await page.evaluate(()=>{
      studioFechar();
      bestcGravar({0:0,1:0,2:0,3:ACC.find(a=>a[0]==='laco')[2]});
      refreshAcc();shopAbrir();
    });
    if(!await page.getByRole('button',{name:/Fotografar favorito.*2/}).isVisible()){
      await page.locator('#shopOv [data-shop-aba="vestindo"]').click();
    }
    await page.getByRole('button',{name:/Fotografar favorito.*2/}).click();
    await page.locator('#studioOv [role="status"]').getByText(/item de mão/).waitFor();
    assert.equal(await page.evaluate(()=>TW_CHARMAKER.favoritoVisual(1).a),'laco');
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function compararBattleNoTreino(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,null);
    await page.evaluate(()=>battleAbrir());
    const batalha=page.locator('#battleOv');
    await batalha.locator('[data-battle="jogar"]').click();
    await batalha.locator('[data-battle="pular"]').click();
    await batalha.getByText('Testar um card na rodada perdida').click();
    const previa=batalha.locator('[data-battle-comparar]').first();
    assert.equal(await previa.locator('option').first().textContent(),'Momorin');
    await batalha.getByText(/Antes .*Com a troca/).first().waitFor();
    await batalha.getByText('Testar outra ordem').click();
    const ordens=batalha.locator('[data-battle-ordem]');
    assert.equal(await ordens.locator('option').count(),6);
    const antes=await ordens.locator('..').locator('..').getByRole('status').textContent();
    await ordens.selectOption('5');
    assert.notEqual(await ordens.locator('..').locator('..').getByRole('status').textContent(),antes);
    await abrir(page,'',null,'battle-oficial');
    await page.evaluate(()=>{
      const cards=[
        {nick:'Tsu',canto:7,danca:3,carisma:2},
        {nick:'Lirika',canto:4,danca:8,carisma:4},
        {nick:'Pati',canto:2,danca:2,carisma:7}
      ];
      window.battleAcoes=[];
      contaRpc=(n,args)=>{
        battleAcoes.push(n);
        if(n==='battle_status')return Promise.resolve({ok:true,cards,rival:cards,tentativas:0});
        if(n==='battle_jogar')return Promise.resolve({ok:true,tentativas:1,rodadas:args.p_unit.map((meu,i)=>({meu,rival:'Rival '+i,eu:6,eles:8,ganhou:false}))});
        return Promise.resolve([]);
      };
      battleAbrir();
    });
    await batalha.locator('.battle-status.real').waitFor();
    await batalha.locator('[data-battle="jogar"]').click();
    await batalha.locator('[data-battle="pular"]').click();
    await batalha.getByText('Testar outra ordem').click();
    await ordens.selectOption('1');
    assert.match(await ordens.locator('..').locator('..').getByRole('status').textContent(),/Rival 0.*Rival 1.*Rival 2/);
    assert.equal(await page.evaluate(()=>battleAcoes.filter(n=>n==='battle_jogar').length),1);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function referenciasDoIdol(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,null);
    const looks=[
      {hair:'#d34aa1',skin:'#886249',hair2:'#ed87ac',back:'longo',hat:'palha',out:'trainee',outcol:'#337799',a:'mic'},
      {hair:'#554c99',skin:'#f3c5a5',hair2:'#408ad0',back:'chanel',hat:'tiara',out:'seifuku',outcol:'#a183bb',a:'torrada'},
      {hair:'#361b47',skin:'#b57862',hair2:'#80c7a2',back:'marias',hat:'',out:'citypop',outcol:'#9f4343',a:'laco'}
    ];
    const foto=await page.evaluate(looks=>looks.map(o=>{
      const av={c:o,a:o.a},c=perfChar(av);
      const cv=document.createElement('canvas');cv.width=cv.height=160;
      perfDesenharIdol(cv.getContext('2d'),160,160,av,true,false,0);
      return {url:cv.toDataURL(),lateral:TW_LADO.sabe(c,o.a)};
    }),looks);
    assert.equal(new Set(foto.map(f=>f.url)).size,3);
    assert(foto.every(f=>f.lateral));
    for(const look of looks){
      const carta=Object.fromEntries(Object.entries(look).filter(([campo])=>campo!=='a'));
      await page.evaluate(({carta,a})=>{
        localStorage.setItem('brs48cr_char','3');
        localStorage.setItem('brs48cr_cu2',JSON.stringify(carta));
        localStorage.setItem('brs48cr_acc',a);
        localStorage.setItem('brs48cr_nick','Auditoria');
      },{carta,a:look.a});
      await page.goto(origin+'/sora-jump.html?lang=pt');
      await page.waitForFunction(()=>typeof window.qaIdolSora==='function');
      const visual=await page.evaluate(()=>window.qaIdolSora());
      for(const campo of ['hair','skin','hat','out','outcol'])assert.equal(visual[campo],look[campo],campo+' no Sora');
      await page.goto(origin+'/karaoke-time.html?lang=pt&embed=index2');
      await page.waitForFunction(()=>typeof window.qaIdolKaraoke==='function');
      const karaoke=await page.evaluate(()=>window.qaIdolKaraoke());
      for(const campo of ['hair','skin','hat','out','outcol'])assert.equal(karaoke[campo],look[campo],campo+' no Karaoke');
    }
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function mapaSobDemanda(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,null);
    assert.equal(await page.evaluate(()=>!!document.querySelector('script[src*="tw-mapa.js"]')),false);
    await page.locator('#twcTela [data-a="mapa"]').first().click();
    await page.locator('#twMapa .tw-mapa-rolo').waitFor();
    await page.goto(origin+'/index.html?celular=0&lang=pt');
    await page.locator('#hubToque').press('Enter');
    const tutorialClassico=page.locator('#hubTutPular');
    if(await tutorialClassico.isVisible())await tutorialClassico.click();
    await page.locator('#hubMapaCarregar').click();
    await page.locator('#twMapa .tw-mapa-rolo').waitFor();
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function auditarStudio320(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await page.setViewportSize({width:320,height:640});
    await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
    await abrir(page,'',null,'visual-320');
    await page.evaluate(()=>{
      localStorage.setItem('brs48cr_favs',JSON.stringify([{nome:'Céu',outcol:'#445522',hat:'tiara'}]));
      if(TW_CHARMAKER.favoritos().length||!TW_CHARMAKER.importarFavoritos())throw Error('importação');
    });
    assert.equal(await page.evaluate(()=>TW_CHARMAKER.favoritos()[0]?.nome),'Céu');
    await page.evaluate(()=>{contaJ={id:'segunda-conta',nick:'Idol B'};contaAuthUserId='segunda-conta';});
    assert.equal(await page.evaluate(()=>TW_CHARMAKER.favoritos().length),0);
    await page.evaluate(()=>{
      perfDono=['roupa_brasil'];perfLojaSincronizar();
      contaRpc=()=>Promise.resolve(null);shopAbrir();
    });
    await page.locator('#shopOv [data-shop-aba="minhas"]').click();
    await page.locator('#shopOv [data-vestir="brasil"]').click();
    assert.equal(await page.evaluate(()=>CU.out),'brasil');
    await page.locator('#shopOv [data-shop-aba="vestindo"]').click();
    await page.locator('#shopLookStudio').click();
    const studio=page.locator('#studioOv');
    const obturador=studio.locator('[data-st="clique"]');
    await obturador.waitFor();
    const pos=await obturador.boundingBox();
    assert(pos && pos.y>=0 && pos.y+pos.height<=566,JSON.stringify(pos));
    await studio.locator('[data-v="pose"][data-st="categoria"]').click();
    await studio.locator('[data-st="pose"][data-v="coracao"]').click();
    assert.equal(await studio.locator('.stgrupo').count(),1);
    await obturador.click();
    await studio.locator('[data-st="serie"]').click();
    await studio.getByRole('button',{name:'Guardada na série.'}).waitFor();
    assert.equal(await page.evaluate(()=>TW_LADO.sabe({hat:'tiara'},'torrada')),true);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function duoNaRuaFofa(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'&piloto_bairro=1','2026-11-30T03:00:00Z','duo-na-rua');
    await page.evaluate(()=>{
      TW_BAIRRO.abrir();
      perfDono=['fundo_ceu'];
      contaRpc=n=>Promise.resolve(n==='duo_convidado'?{nick:'Tsu'}:[]);
    });
    await page.getByRole('button',{name:'Montar o look'}).click();
    await page.locator('#shopVestindo [data-piloto-bairro="rua"]').click();
    await page.getByRole('button',{name:'Fotografar no Moon⭐Duo!'}).click();
    await page.locator('#duoOv [data-dnick]').first().click();
    await page.locator('#duoTabs [data-dtab="fundo"]').click();
    await page.locator('#duoTabC [data-dfundo="ceu"]').click();
    await page.locator('#duoTabs [data-dtab="expr"]').click();
    await page.locator('#duoTabC [data-dexeu="2"]').click();
    await page.locator('#duoTabC [data-dexgu="0"]').click();
    await page.locator('#duoPedido [data-duo-direcao="interpretar"]').click();
    const cena=await page.evaluate(()=>duoCenaAtual());
    assert.equal(cena.invertido,true);
    assert.equal(cena.fundo,'ceu');
    assert.equal(cena.exprEu,'2');assert.equal(cena.exprGu,'0');
    await abrir(page,'&piloto_bairro=1','2026-11-30T03:00:00Z','duo-na-rua');
    await page.evaluate(()=>{perfDono=['fundo_ceu'];contaRpc=n=>Promise.resolve(n==='duo_convidado'?{nick:'Tsu'}:[]);});
    assert.equal(await page.evaluate(()=>TW_PILOTO_BAIRRO.continuacao().acao),'duo');
    await page.locator('[data-piloto-bairro="continuar"]:visible').click();
    await page.locator('#duoRuaFofa').waitFor();
    assert.deepEqual(await page.evaluate(()=>duoCenaAtual()),cena);
    await page.locator('#duoRuaFofa').click();
    await page.locator('#duoRuaStatus').getByText(/Sua foto em dupla/).waitFor();
    assert.ok(await page.evaluate(()=>TW_PILOTO_BAIRRO.medidas()[1].etapas.concluiu));
    await page.locator('#duoRuaGuardar').click();
    await page.locator('#duoRuaGuardar').getByText('Guardada na série.').waitFor();
    await page.locator('#duoVoltarRua').click();
    await page.locator('#twBairroOv').getByAltText('Sua foto em exposição na Rua Fofa').waitFor();
    await page.evaluate(()=>TW_BAIRRO.fechar());
    assert.equal(await page.evaluate(()=>TW_PILOTO_BAIRRO.continuacao().acao),'jornal');
    await page.evaluate(()=>{
      const cv=document.createElement('canvas');cv.width=cv.height=20;
      return TW_ALBUM_FOTOS.salvar('studio',cv,document.createElement('button'));
    });
    await page.locator('#twcNav [data-n="menu"]').click();
    await page.locator('[data-a="album"]:visible').first().click();
    await page.locator('details.album-fotos:visible summary').click();
    const foto=page.locator('details.album-fotos:visible figure').filter({hasText:'Um céu na Rua Fofa'});
    const caixa=page.locator('details.album-fotos:visible');
    await caixa.getByLabel('Origem',{exact:true}).selectOption('studio');
    await foto.waitFor({state:'hidden'});
    await caixa.getByLabel('Edição',{exact:true}).selectOption({label:'Um céu na Rua Fofa'});
    await caixa.getByText('Nenhuma foto com estes filtros.').waitFor();
    await caixa.getByLabel('Origem',{exact:true}).selectOption('duo');
    await foto.waitFor();
    await foto.getByRole('button',{name:'Fixar foto',exact:true}).click();
    await foto.getByRole('button',{name:'Desafixar foto'}).waitFor();
    const download=page.waitForEvent('download');
    await page.getByRole('button',{name:'Baixar cópia da série'}).click();
    const arquivo=await readFile(await (await download).path());
    const copia=JSON.parse(arquivo);
    const salva=copia.fotos.find(f=>f.tipo==='duo');
    assert.deepEqual(salva.cena,cena);
    assert.equal(salva.edicao,'Um céu na Rua Fofa');
    assert.equal(salva.fixada,true);
    await abrir(page,'',null,'duo-restaurado');
    await page.evaluate(()=>{perfDono=['fundo_ceu'];contaRpc=n=>Promise.resolve(n==='duo_convidado'?{nick:'Tsu'}:[]);});
    await page.locator('#twcNav [data-n="menu"]').click();
    await page.locator('[data-a="album"]:visible').first().click();
    await page.locator('details.album-fotos:visible summary').click();
    await page.locator('details.album-fotos:visible input[type=file]').setInputFiles({name:'duo.json',mimeType:'application/json',buffer:arquivo});
    await foto.getByRole('button',{name:'Desafixar foto'}).waitFor();
    assert.match(await caixa.locator('figure:visible').first().locator('figcaption').textContent(),/Um céu na Rua Fofa/);
    await foto.getByRole('button',{name:'Recriar esta cena'}).click();
    await page.locator('#duoPalco').waitFor();
    assert.deepEqual(await page.evaluate(()=>duoCenaAtual()),cena);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function albumCheio(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,'cheio-qa');
    await page.evaluate(async()=>{
      const canvas=document.createElement('canvas'),btn=document.createElement('button');
      canvas.width=100;canvas.height=100;document.body.append(btn);
      const ctx=canvas.getContext('2d');
      window.qaSalvarCheio=()=>TW_ALBUM_FOTOS.salvar('duo',canvas,btn);
      for(let i=0;i<24;i++){
        ctx.fillStyle='rgb('+i*8+',60,180)';ctx.fillRect(0,0,100,100);
        if(!await TW_ALBUM_FOTOS.salvar('studio',canvas,btn))throw Error('preencher álbum');
      }
      window.qaFotosDB=()=>new Promise((ok,falha)=>{
        const pedido=indexedDB.open('tsulipa-album-fotos');
        pedido.onerror=falha;
        pedido.onsuccess=()=>{
          const db=pedido.result,q=db.transaction('fotos').objectStore('fotos').getAll();
          q.onsuccess=()=>{db.close();ok(q.result.map(f=>[f.id,f.tipo]));};q.onerror=falha;
        };
      });
    });
    const anterior=await page.evaluate(()=>qaFotosDB());
    await page.evaluate(()=>{window.qaPendente=qaSalvarCheio();});
    const dlg=page.getByRole('dialog',{name:'A série está cheia'});
    await dlg.getByRole('button',{name:'Cancelar'}).click();
    assert.equal(await page.evaluate(()=>qaPendente),false);
    assert.deepEqual(await page.evaluate(()=>qaFotosDB()),anterior);
    await page.evaluate(()=>{window.qaPendente=qaSalvarCheio();});
    await dlg.getByRole('radio').nth(1).check();
    await dlg.getByRole('button',{name:'Substituir a foto selecionada'}).click();
    assert.equal(await page.evaluate(()=>qaPendente),true);
    const depois=await page.evaluate(()=>qaFotosDB());
    assert.deepEqual(depois.slice(0,23),anterior.filter((_,i)=>i!==1));
    assert.equal(depois[23][1],'duo');
    await page.evaluate(()=>{petData={v:1,ativo:'tsu',pets:{tsu:{}}};});
    await page.locator('#twcNav [data-n="menu"]').click();
    await page.locator('[data-a="album"]:visible').first().click();
    await page.locator('details.album-fotos:visible summary').click();
    const foto=page.locator('details.album-fotos:visible figure').first();
    const quadro=foto.getByRole('button',{name:'Usar no porta-retrato'});
    await quadro.evaluate(el=>el.scrollIntoView({block:'center'}));
    await quadro.click();
    await foto.getByRole('button',{name:'Foto colocada no porta-retrato.'}).waitFor();
    assert.match(await page.evaluate(()=>petVidaQuadroLer()?.id),/^album_/);
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
}
async function estreiaCorrida(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await abrir(page,'',null,null);
    await page.locator('[data-estreia="run"]').click();
    await page.locator('#nick').fill('');
    await page.locator('#play').click();
    await page.waitForFunction(()=>TW_CELULAR.estreiaMedidas().inicioMs!==null);
    await page.waitForFunction(()=>TW_CELULAR.estreiaMedidas().conclusaoMs!==null,null,{timeout:18000});
    assert.equal(await page.locator('#nick').inputValue(),'');
    assert.deepEqual(erros,[]);
  }finally{await context.close();}
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
    await iframe.locator('#ktTrechoLentoBt').click();
    await iframe.locator('#ktResult[open]').waitFor({timeout:22000});
    assert.match(await iframe.locator('#ktTrechoResultado').textContent(),/Treino a 75%: \d+\/\d+/);
    assert.equal(await iframe.locator('#ktTrechoBt').textContent(),'Repetir trecho a 100%');
    await iframe.locator('#ktTrechoBt').click();
    await iframe.locator('#ktPause:not([disabled])').waitFor({state:'attached'});
    const simularAba = ocultar => frame.evaluate(hidden => {
      Object.defineProperty(document,'hidden',{configurable:true,get:()=>hidden});
      document.dispatchEvent(new Event('visibilitychange'));
    },ocultar);
    const segundosIniciais = Number((await iframe.locator('#ktClock').textContent()).split(':')[1]);
    await frame.waitForFunction(limite => Number(document.getElementById('ktClock').textContent.split(':')[1]) <= limite, segundosIniciais - 5);
    await simularAba(true);
    await frame.waitForFunction(() => /retomar/i.test(document.getElementById('ktPause').textContent));
    const pausado = await iframe.locator('#ktClock').textContent();
    await page.waitForTimeout(1200);
    assert.equal(await iframe.locator('#ktClock').textContent(),pausado);
    await simularAba(false);
    await iframe.locator('#ktPause').click();
    await iframe.locator('#ktResult[open]').waitFor({timeout:22000});
    assert.match(await iframe.locator('#ktTrechoResultado').textContent(),/Treino a 75%/);
    assert.match(await iframe.locator('#ktTrechoResultado').textContent(),/Antes: \d+\/\d+ · Agora: \d+\/\d+/);
    assert.deepEqual(await frame.evaluate(() => ktEnsaioMedidas()),{iniciados:1,concluidos:1,repeticoes:0});
    await iframe.locator('#ktResultAdjust').click();
    await iframe.locator('#ktAudioOutput').selectOption('bluetooth');
    await iframe.locator('#ktOffsetPlus').click();
    assert.equal(await iframe.locator('#ktOffsetValue').textContent(),'+10 ms');
    await iframe.locator('#ktRepeatAfterTiming').click();
    await frame.waitForFunction(() => document.body.classList.contains('kt-playing'));
    const depois = await frame.evaluate(() => Object.keys(localStorage).filter(k=>k==='kt_showcase_week_v1'||/^kt_.*(attempt|ticket|score|round)/.test(k)).map(k=>[k,localStorage.getItem(k)]));
    assert.deepEqual(depois,anterior);
    assert.deepEqual(erros,[]);
  }finally{ await context.close(); }
}
(async()=>{
  const browser = await chromium.launch();
  try{
    await isolarContaPessoal(browser);console.log('✓ Vitrine, retrospectiva, recados e prêmios semanais isolados após troca de conta.');
    await mapaSobDemanda(browser);console.log('✓ Mapa só carrega ao ser aberto.');
    await referenciasDoIdol(browser);console.log('✓ Três visuais de referência passaram pelo Perfil, Sora e Karaoke.');
    await auditarStudio320(browser);console.log('✓ Studio em 320 px: obturador visível, categoria e foto na série. Favoritos isolados por conta.');
    await duoNaRuaFofa(browser);console.log('✓ Look e foto em dupla chegam à vitrine da Rua Fofa.');
    await estreiaCorrida(browser);console.log('✓ Visitante joga uma corrida com o nome em branco.');
    await reencontroDeUmaPista(browser);console.log('✓ Handshake recupera uma pista após recarga e registra o acerto.');
    await favoritoNoStudio(browser);console.log('✓ Studio fotografa o favorito sem aplicar o visual ao Idol.');
    await compararBattleNoTreino(browser);console.log('✓ Battle compara um card na rodada perdida sem mudar o rival.');
    await albumCheio(browser);console.log('✓ Álbum cheio preserva as fotos ao cancelar e só substitui a foto escolhida.');
    await leituraHandshake(browser);console.log('✓ Handshake mantém a fila manual e repete com o cronômetro padrão.');
    await provarNaLoja(browser);console.log('✓ Provador compara a peça sem trocar o visual salvo.');
    await dirigirDuo(browser);console.log('✓ Duo varia o enquadramento e as posições mantendo a dupla.');
    await bairro(browser); console.log('✓ Rua Fofa em dois ciclos e bico isolado.');
    await escolherRua(browser); console.log('✓ Studio e Café geram vitrines e desfechos distintos.');
    await navegarRua(browser); console.log('✓ Esc, Voltar e Fechar restauram a origem no piloto.');
    await gachaBattle(browser);console.log('✓ Prévia do Gacha aplica a troca só após confirmação.');
    await cafeFoco(browser);console.log('✓ Café oferece três pedidos por categoria sem alterar o turno.');
    await copiaAlbum(browser);console.log('✓ Cópia do Álbum preserva fotos, composição e duplicatas.');
    await quedasSora(browser);console.log('✓ Sora explica a plataforma perdida e a correção lateral.');
    await memoria(browser); console.log('✓ Handshake revê a pista antiga e mantém as respostas da rodada.');
    await decoracao(browser); console.log('✓ Arranjo no Studio e cenas do pet guardadas no Álbum.');
    await cafe(browser); console.log('✓ Café guarda apenas o pedido confirmado e o cita no retorno.');
    await album(browser); console.log('✓ Série persistente com Studio, Duo, Camarim, remoção e isolamento por conta.');
    await sora(browser); console.log('✓ Sora gera as duas rotas entre 100 e 250 m.');
    await cafeAlternado(browser); console.log('✓ Turno escalonado valida prazo e resume os ingredientes.');
    await karaoke(browser); console.log('✓ Karaoke repete o trecho e compara acertos sem gastar tentativa.');
  }finally{ await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
