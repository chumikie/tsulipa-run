'use strict';
const { chromium, webkit } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const motor = process.env.TW_BROWSER === 'webkit' ? webkit : chromium;
  const browser = await motor.launch({executablePath:process.env.TW_BROWSER_PATH || undefined});
  try {
    const page = await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
    const root = path.resolve(__dirname, '..');
    let mapaFalha = true, tentativas = 0;
    await page.route('**/*', async route => {
      const url = new URL(route.request().url());
      if(url.origin !== 'http://tsulipa.test') return route.abort();
      if(url.pathname === '/tw-mapa.js'){
        tentativas++;
        if(mapaFalha) return route.abort();
      }
      const file = path.resolve(root, '.' + url.pathname);
      if(!file.startsWith(root + path.sep)) return route.abort();
      try {
        const body = await fs.readFile(file);
        const contentType = {'.html':'text/html','.js':'application/javascript','.css':'text/css'}[path.extname(file)];
        return route.fulfill({body,contentType});
      } catch { return route.fulfill({status:404}); }
    });
    await page.goto('http://tsulipa.test/index.html?celular=1');
    const conta = uid => page.evaluate(id => {
      contaAuthUserId = id;
      contaJ = id ? {nick:'Idol de teste',id} : null;
    },uid);
    const estado = () => page.evaluate(() => [TW_HUMOR.desejo().feito,TW_HUMOR.vipHoje(),TW_HUMOR.premios().tapete]);
    await conta('A');
    await page.evaluate(async () => {
      await petSalaCarregar();
      petArrumoLer().parede.zipper = [95,48];
      petArrumoSalvar();
      TW_HUMOR.evento(TW_HUMOR.desejo().ev);
      TW_HUMOR.guardarFotoVip('data:image/png;base64,AA==');
    });
    assert.deepEqual(await estado(),[true,true,true]);
    for(const id of ['', 'B']){
      await conta(id);
      assert.deepEqual(await estado(),[false,false,false]);
      assert.equal(await page.evaluate(() => Boolean(petArrumoLer().parede.zipper)),false);
    }
    await page.reload();
    await conta('A');
    assert.deepEqual(await estado(),[true,true,true]);
    assert.deepEqual(await page.evaluate(async () => { await petSalaCarregar(); return petArrumoLer().parede.zipper; }),[95,48]);
    assert.equal(await page.evaluate(() => twMapaCarregar().then(()=>true,()=>false)),false);
    const antes = tentativas;
    mapaFalha = false;
    await page.evaluate(() => Promise.all([twMapaCarregar(),twMapaCarregar()]));
    assert.equal(tentativas,antes+1);
    assert.equal(await page.locator('#twMapa').count(),1);
    await page.evaluate(async () => {
      const box = document.createElement('div');
      box.id = 'jornalPosts';
      document.body.prepend(box);
      window.contaRpc = () => Promise.reject(new Error('offline'));
      await jornalPostsCarregar();
    });
    assert.equal(await page.locator('#jornalPosts button').first().textContent(),'Tentar novamente');
    await page.evaluate(() => { window.contaRpc = () => Promise.resolve([]); document.querySelector('#jornalPosts button').click(); });
    assert.match(await page.locator('#jornalPosts').first().textContent(),/Nenhuma publicação/);
    await conta('A');
    await page.evaluate(() => {
      window.jardimA = [];
      window.contaRpc = nome => {
        if(nome === 'jardim_estado'){
          if(contaJ.id === 'A') return new Promise(resolve => window.jardimA.push(resolve));
          return Promise.resolve({ok:true,flores:{girassol:1},canteiros:[]});
        }
        if(nome === 'studio_mural'){
          if(window.muralOffline) return Promise.reject(new Error('offline'));
          return Promise.resolve([{id:1,nick:'Idol do Mural',escolhas:{},estrelas:1}]);
        }
        return Promise.resolve(null);
      };
      studioAbrir();
    });
    await page.waitForFunction(() => window.jardimA.length === 1);
    await conta('B');
    await page.evaluate(() => studioAbrir());
    await page.locator('#studioOv [data-v="flor_girassol"]').waitFor();
    await page.evaluate(() => window.jardimA[0]({ok:true,flores:{tulipa:2}}));
    assert.equal(await page.locator('#studioOv [data-v="flor_tulipa"]').count(),0);

    const mural = page.locator('#studioMural');
    const aba = valor => page.locator('#studioOv [data-st="aba"][data-v="' + valor + '"]');
    await aba('mural').click();
    await mural.getByText('Idol do Mural').waitFor();
    await aba('estudio').click();
    await page.evaluate(() => { window.muralOffline = true; });
    await aba('mural').click();
    const retry = mural.getByRole('button',{name:'Tentar novamente'});
    await retry.waitFor();
    assert.equal(await mural.getByText('Idol do Mural').count(),1);
    await page.evaluate(() => { window.muralOffline = false; });
    await retry.click();
    await mural.getByRole('status').waitFor({state:'hidden'});
    assert.equal(await mural.getByText('Idol do Mural').count(),1);

    await page.locator('#studioX').click();
    await page.evaluate(() => bloomAbrir());
    await page.locator('[data-bloom="studio"][data-s="girassol"]').click();
    const flor = page.locator('#studioOv [data-v="flor_girassol"][aria-pressed="true"]');
    await flor.waitFor();
    for(const quadro of ['inteiro','meio','rosto']){
      await page.locator('#studioOv [data-st="quadro"][data-v="' + quadro + '"]').click();
      assert.equal(await flor.count(),1);
    }
    await page.locator('#studioX').click();

    // A dica de ingrediente pertence ao modo de um cliente. A conta simulada
    // recebe a resposta sem cafe_run_iniciar e exercita esse fallback.
    await conta('B');
    await page.evaluate(() => cfAbrir());
    await page.locator('#cfJogar').waitFor();
    await page.locator('#cfJogar').click();
    await page.locator('#cfServir').waitFor();
    await page.evaluate(() => {
      const pedido = cf.cli.pedido = {base:0,cob:-1,enf:0,doce:-1};
      cf.monta = {...pedido,cob:0};
      cfServir(false);
    });
    await page.getByText('Era sem cobertura! O resto ficou lindo.').waitFor();

    await page.evaluate(() => cfFechar());
    await conta('');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.evaluate(() => battleAbrir());
    await page.locator('[data-battle="jogar"]').click();
    const batalha = page.locator('#battleCorpo');
    for(const rodada of [1,2,3]){
      const placar = batalha.getByRole('status');
      await placar.waitFor();
      assert.match(await placar.textContent(),new RegExp(rodada + '/3'));
      await batalha.getByRole('button',{name:rodada < 3 ? 'Próxima rodada' : 'Ver resultado'}).click();
    }
    assert.equal(await batalha.locator('.battle-result-grid .battle-round').count(),3);
    console.log('OK: Studio, atalho do Bloom, Café e três rodadas da Battle com movimento reduzido.');
    console.log('OK: contas distintas, visitante, recarga, foto VIP, recuperação do Mapa e do Jornal.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
