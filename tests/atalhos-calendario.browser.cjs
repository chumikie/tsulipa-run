/* NODE_PATH=/caminho/node_modules node tests/atalhos-calendario.browser.cjs */
'use strict';
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { readFile } = require('node:fs/promises');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const base = 'https://tsu.test';
const types = {'.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg'};
const fixed = new Date('2026-11-19T12:00:00Z');

async function main(){
  const browser = await chromium.launch();
  try{
    const ctx = await browser.newContext({
      viewport:{width:390,height:844}, hasTouch:true, timezoneId:'Asia/Tokyo'
    });
    let bloquearQuadrinhos = true, pedidosQuadrinhos = 0;
    await ctx.route('**/*', async route => {
      const url = new URL(route.request().url());
      if(url.origin !== base) return route.abort();
      const file = path.resolve(root, '.' + (url.pathname === '/' ? '/index.html' : url.pathname));
      if(!file.startsWith(root + path.sep)) return route.fulfill({status:403});
      if(path.basename(file) === 'jornal-capitulos.js'){
        pedidosQuadrinhos++;
        if(bloquearQuadrinhos) return route.abort();
      }
      try{
        const body = await readFile(file);
        await route.fulfill({body, contentType:types[path.extname(file)] || 'application/octet-stream'});
      }catch{
        await route.fulfill({status:404});
      }
    });

    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.clock.setFixedTime(fixed);
    await page.goto(base + '/?lang=pt');
    await page.evaluate(() => {
      contaRpc = () => Promise.resolve([]);
      Object.defineProperty(navigator, 'clipboard', {value:null, configurable:true});
    });
    await page.locator('[data-a="comecar"]').click();
    await page.locator('[data-f="tutPular"]').click();
    for(const width of [320,390]){
      await page.setViewportSize({width,height:844});
      const inicio = await page.evaluate(() => {
        const rect = sel => document.querySelector(sel).getBoundingClientRect();
        return {palco:rect('.twc-palco').bottom, corrida:rect('[data-estreia="run"]').top,
          foto:rect('[data-estreia="studio"]').top, altura:rect('.twc-estreia').height};
      });
      assert.equal(await page.locator('#twcPinEditar, .twc-ini-portas .twc-rapidos').count(),0);
      assert.ok(inicio.palco <= inicio.corrida, 'o palco aparece antes dos atalhos');
      assert.equal(inicio.corrida,inicio.foto,'os dois botões de estreia ficam na mesma linha');
      assert.ok(inicio.altura >= 44 && inicio.altura <= 50);
    }
    await page.locator('#twcNav [data-n="menu"]').click();
    await page.locator('#twcTela [data-v="ajustes"]').click();
    const edit = page.locator('#twcPinEditar');
    await edit.focus();
    await page.keyboard.press('Enter');
    assert.equal(await edit.getAttribute('aria-expanded'),'true');
    const cafe = page.locator('[data-pin="cafe"]');
    await cafe.focus();
    await page.keyboard.press('Space');
    await page.waitForFunction(() => document.activeElement?.dataset.pin === 'cafe');
    assert.equal(await cafe.getAttribute('aria-pressed'),'true');
    await page.locator('[data-pin="cal"]').click();
    const third = page.locator('[data-pin="studio"]');
    assert.equal(await third.getAttribute('aria-disabled'),'true');
    await third.focus();
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-pin][aria-pressed="true"]').count(),2);

    await page.reload();
    await page.evaluate(() => {
      contaRpc = () => Promise.resolve([]);
      Object.defineProperty(navigator, 'clipboard', {value:null, configurable:true});
    });
    await page.locator('[data-a="comecar"]').click();
    assert.deepEqual(await page.locator('.twc-ini-portas [data-pin-ir]').evaluateAll(items => items.map(b=>b.dataset.pinIr)),['cafe','cal']);
    const linhaFixada = await page.locator('.twc-ini-portas .twc-rapidos').boundingBox();
    assert.ok(linhaFixada && linhaFixada.height >= 44 && linhaFixada.height <= 50);
    await page.locator('[data-pin-ir="cafe"]').click();
    await page.locator('#cfJogar').waitFor();
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.activeElement?.dataset.pinIr === 'cafe');
    await page.locator('[data-pin-ir="cal"]').click();
    await page.locator('#twcCalSemana').click();
    assert.equal(await page.locator('#twcCalDia time').getAttribute('datetime'),'2026-11-22T02:59:00.000Z');
    assert.match(await page.locator('#twcCalDia time').innerText(),/11:59/);
    assert.equal(await page.locator('#twcCalFestival').evaluate(b => document.activeElement === b),true);
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button',{name:'Adicionar ao meu calendário'}).click()
    ]);
    assert.equal(download.suggestedFilename(),'tsulipa-festival-2026-11-21.ics');
    const ics = await readFile(await download.path(), 'utf8');
    assert.match(ics,/DTSTART:20261122T025900Z\r\nDTEND:20261122T030000Z/);
    assert.match(ics,/UID:festival-2026-11-21@/);
    assert.match(ics,/DESCRIPTION:Love × Debut/);

    await page.locator('#twcCalFestival').click();
    await page.locator('#jornalFestTitulo').waitFor();
    assert.equal(await page.locator('#jnAbaBtnComunidade').getAttribute('aria-selected'),'true');
    assert.equal(pedidosQuadrinhos,2);
    await page.locator('#jornalOv [data-tw-link="festival"]').click();
    assert.equal(await page.getByRole('textbox',{name:'Link para copiar'}).inputValue(),base + '/festival.html');
    await page.keyboard.press('Escape');

    bloquearQuadrinhos = false;
    const dia = page.locator('[data-cald="2026-11-15"]');
    await dia.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.activeElement?.dataset.cald === '2026-11-15');
    const cap = page.locator('[data-cal-cap="cap"]');
    await cap.click();
    await page.locator('#jornalCaps [data-jncap="0"][aria-pressed="true"]').waitFor();
    await page.waitForFunction(() => document.activeElement?.dataset.jncap === '0');
    await page.keyboard.press('Escape');
    await page.locator('[data-cald="2026-11-22"]').click();
    assert.equal(await page.locator('[data-cal-cap="cap"]').count(),0);

    for(const rota of ['cafe','studio','festival']){
      const html = await readFile(path.join(root, rota + '.html'),'utf8');
      assert.match(html,new RegExp('og:url" content="https://tsulipa-world.vercel.app/' + rota + '\\.html'));
      assert.match(html,new RegExp('og:image" content="https://tsulipa-world.vercel.app/img/og-' + rota + '\\.jpg'));
      const imagem = await page.evaluate(async rota => {
        const img = new Image();
        img.src = '/img/og-' + rota + '.jpg';
        await img.decode();
        return [img.naturalWidth,img.naturalHeight];
      }, rota);
      assert.deepEqual(imagem,[1200,630]);
      await page.goto(base + '/' + rota + '.html?lang=pt');
      await page.waitForURL(base + '/index.html?lang=pt#' + rota);
      await page.evaluate(() => { contaRpc = () => Promise.resolve([]); });
      await page.locator('[data-a="comecar"]').click();
      await page.locator({cafe:'#cfJogar',studio:'#studioOv',festival:'#jornalFestTitulo'}[rota]).waitFor();
    }
    const audio = await page.evaluate(() => {
      const el = new Audio();
      Object.defineProperty(el, 'volume', {get:() => 1, set:() => {}}); // simula volume numérico ignorado
      TW_AUDIO.definir({mudo:true});
      TW_AUDIO.midia(el,.5);
      const silenciado = el.muted;
      el.dispatchEvent(new Event('play'));
      TW_AUDIO.definir({mudo:false});
      const restaurado = !el.muted;
      TW_AUDIO.definir({volume:0});
      return [silenciado,restaurado,el.muted];
    });
    assert.deepEqual(audio,[true,true,true]);
    assert.deepEqual(errors,[]);
    console.log('Atalhos, Calendário, retomada do Jornal e três links públicos verificados.');
  }finally{
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
