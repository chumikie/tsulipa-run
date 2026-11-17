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
    console.log('OK: contas distintas, visitante, recarga, foto VIP, recuperação do Mapa e do Jornal.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
