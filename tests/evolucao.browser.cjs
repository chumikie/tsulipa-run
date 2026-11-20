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
      let body=await readFile(arq);
      if(url.pathname==='/sora-jump.html')body=body.toString().replace('function soraStartGame(){','window.qaQuedaSora='+simularQueda.toString()+';\n$&');
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
    await page.locator('.tw-piloto-rosa').getByText(/foto e a plaquinha/).waitFor();
    await page.keyboard.press('Escape');
    await page.evaluate(()=>TW_BAIRRO.pularGuia());
    await page.locator('.twc-palco [data-a="mapa"]').click();
    await page.locator('#twMapa [data-tw-bairro="fofo"]').click();
    await page.locator('.tw-mapa-recado-rosa').getByText(/na semana passada/).waitFor();
    await page.locator('#twcNav [data-n="voltar"]').click();
    await botao('rua').click();
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
      gachaAbrir();
    });
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
  const altura=tipo==='trampolim'?-1560:-1150;
  soraState='play';soraUltimoSalto={tipo,rota:tipo==='trampolim'?'alta':'entrada',y:altura+110};
  soraPousoPerdido=null;
  soraP.x=tipo==='trampolim'?239:130;soraP.y=altura-soraP.h-2;soraP.vx=0;soraP.vy=3;
  soraCamY=altura+50;soraHighestY=altura-50;
  soraPlats=[{k:'nuvem',rota:tipo==='trampolim'?'':'alta',x:tipo==='trampolim'?170:215,y:altura,w:50,h:14,vx:0}];
  soraHazards=[];soraUpdate(1);soraEndGame();
}
async function quedasSora(browser){
  const {page,erros,context}=await preparar(browser);
  try{
    await page.goto(origin+'/sora-jump.html?lang=pt&embed=index2');
    await page.locator('#soraPlayBtn').click();
    await page.evaluate(()=>window.qaQuedaSora('nuvem'));
    await page.locator('#soraDicaQueda').getByText(/Atalho alto \(115 m\).*direita/).waitFor();
    await page.evaluate(()=>window.qaQuedaSora('trampolim'));
    await page.locator('#soraDicaQueda').getByText(/Depois do trampolim.*156 m.*esquerda/).waitFor();
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
    await gachaBattle(browser);console.log('✓ Prévia do Gacha aplica a troca só após confirmação.');
    await cafeFoco(browser);console.log('✓ Café oferece três pedidos por categoria sem alterar o turno.');
    await copiaAlbum(browser);console.log('✓ Cópia do Álbum preserva fotos, composição e duplicatas.');
    await quedasSora(browser);console.log('✓ Sora explica a plataforma perdida e a correção lateral.');
    await memoria(browser); console.log('✓ Handshake revê a pista antiga e mantém as respostas da rodada.');
    await decoracao(browser); console.log('✓ Arranjo no Studio e cenas do pet guardadas no Álbum.');
    await album(browser); console.log('✓ Série persistente com Studio, Duo, Camarim, remoção e isolamento por conta.');
    await karaoke(browser); console.log('✓ Ensaio termina e repete sem gastar tentativa.');
  }finally{ await browser.close(); }
})().catch(e=>{console.error(e);process.exitCode=1;});
