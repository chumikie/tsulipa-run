'use strict';
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
// Estratégia (14/11/2026, escolhida com o dono): a página inicial muda de propósito a cada PR
// (HUD, cards e jogos novos), então exigir texto e layout IDÊNTICOS à referência dava vermelho
// permanente. A referência continua sendo usada, com regras que valem mesmo quando a página muda:
//   FALHA  1) idioma aplicado; 2) erro de JavaScript que a referência não tinha;
//          3) rolagem lateral nova; 4) blocos principais mudando de aberto/fechado ou sumindo;
//          5) texto que a referência mostrava traduzido voltando a aparecer em português.
//   AVISO  texto novo que aparece igual em português e em outro idioma (possível tradução faltando).
// Tudo o que mudou (linhas a mais/a menos, blocos reposicionados) vai para report.json e capturas:
// mudança de posição ou de texto NÃO reprova sozinha — precisa ser olhada no relatório.
// Avançar o marco só após aprovar as novas capturas de referência.
const baseSha = process.env.VISUAL_BASE_SHA || 'e95e7775849c49fc452c1f107778d5b11a926bc0';
const output = path.resolve(process.argv[2] || '/tmp/i18n-visual-captures');
fs.mkdirSync(output, { recursive: true });
const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'tsulipa-i18n-visual-'));
const beforeRoot = path.join(tempRoot, 'before');
const mime = {
  '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.woff2':'font/woff2',
  '.mp3':'audio/mpeg', '.wav':'audio/wav', '.ico':'image/x-icon'
};
let beforeServer, afterServer, browser;

function serve(directory) {
  const base = path.resolve(directory);
  return http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    const file = path.resolve(base, relative);
    if (file !== base && !file.startsWith(base + path.sep)) {
      res.writeHead(403).end('forbidden');
      return;
    }
    fs.readFile(file, (error, data) => {
      if (error) { res.writeHead(404).end('not found'); return; }
      res.setHeader('Content-Type', mime[path.extname(file).toLowerCase()] || 'application/octet-stream');
      res.setHeader('Cache-Control', 'no-store');
      res.end(data);
    });
  });
}
async function listen(server) {
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return server.address().port;
}
async function capture(port, version, language, width, height) {
  const context = await browser.newContext({ viewport:{ width, height }, deviceScaleFactor:1 });
  await context.addInitScript(({ language, fixedNow }) => {
    localStorage.setItem('brs48cr_lang', language);
    let seed = 0x51f15e;
    Math.random = function() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const NativeDate = Date;
    class FixedDate extends NativeDate {
      constructor(...args) { super(...(args.length ? args : [fixedNow])); }
      static now() { return fixedNow; }
    }
    window.Date = FixedDate;
  }, { language, fixedNow:Date.parse('2026-11-02T15:00:00Z') });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.route('**/*', route => {
    const url = new URL(route.request().url());
    if (url.hostname !== '127.0.0.1') return route.abort();
    return route.continue();
  });
  await page.goto('http://127.0.0.1:' + port + '/index.html', { waitUntil:'domcontentloaded' });
  await page.waitForTimeout(1100);
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.addStyleTag({ content:
    '*{transition:none!important;scroll-behavior:auto!important;caret-color:transparent!important}' +
    '*::before,*::after{animation-play-state:paused!important;transition:none!important}'
  });
  const snapshot = await page.evaluate(() => {
    const selectors = ['#hub','#hubCards','#menu','#over','#lbm','#petov','#gachaOv','#duoOv','#encOv'];
    const nodes = selectors.map(selector => {
      const element = document.querySelector(selector);
      if (!element) return [selector, null];
      const rect = element.getBoundingClientRect();
      const round = value => Math.round(value * 100) / 100;
      return [selector, {
        hidden:element.hidden,
        display:getComputedStyle(element).display,
        rect:[round(rect.x),round(rect.y),round(rect.width),round(rect.height)]
      }];
    });
    return {
      language:document.documentElement.lang,
      viewport:[innerWidth,innerHeight],
      documentSize:[document.documentElement.scrollWidth,document.documentElement.scrollHeight],
      bodySize:[document.body.scrollWidth,document.body.scrollHeight],
      visibleText:document.body.innerText,
      nodes
    };
  });
  const screenshot = path.join(output, version + '-' + language + '-' + width + 'x' + height + '.png');
  await page.screenshot({ path:screenshot, fullPage:false, animations:'disabled', caret:'hide' });
  await context.close();
  return { snapshot, errors, screenshot:path.basename(screenshot) };
}
function linhas(texto) {
  return new Set(String(texto || '').split('\n').map(linha => linha.trim()).filter(Boolean));
}
function menos(a, b) { return [...a].filter(item => !b.has(item)); }
// Linhas sem palavras (números, ★, emojis) não contam como "português".
function temPalavra(linha) { return /\p{L}{3,}/u.test(linha); }
function fechado(node) { return !!node.hidden || node.display === 'none'; }
function conferir(viewport, capturas) {
  const [width, height] = viewport, falhas = [], avisos = [], resumo = {};
  const antesPt = linhas(capturas.pt.before.snapshot.visibleText);
  const depoisPt = linhas(capturas.pt.after.snapshot.visibleText);
  for (const language of Object.keys(capturas)) {
    const { before, after } = capturas[language], onde = language + ' ' + width + 'x' + height;
    const a = after.snapshot, b = before.snapshot;
    // 1) idioma aplicado
    if (a.language !== b.language) falhas.push(onde + ': <html lang> é "' + a.language + '", esperado "' + b.language + '"');
    // 2) erros de JavaScript novos
    const errosNovos = after.errors.filter(erro => !before.errors.includes(erro));
    if (errosNovos.length) falhas.push(onde + ': erros de JavaScript novos: ' + errosNovos.join(' | '));
    // 3) rolagem lateral nova
    const larguraAntes = Math.max(b.documentSize[0], b.bodySize[0]), larguraDepois = Math.max(a.documentSize[0], a.bodySize[0]);
    if (larguraDepois > width && larguraDepois > larguraAntes)
      falhas.push(onde + ': rolagem lateral nova (' + larguraDepois + 'px numa tela de ' + width + 'px)');
    // 4) blocos principais: continuar existindo e manter aberto/fechado
    const depoisNodes = new Map(a.nodes), mudouPosicao = [];
    for (const [selector, antes] of b.nodes) {
      const depois = depoisNodes.get(selector);
      if (!antes) continue;
      if (!depois) { falhas.push(onde + ': ' + selector + ' sumiu da página'); continue; }
      if (fechado(depois) !== fechado(antes))
        falhas.push(onde + ': ' + selector + ' mudou de ' + (fechado(antes) ? 'fechado' : 'aberto') + ' para ' + (fechado(depois) ? 'fechado' : 'aberto'));
      if (JSON.stringify(depois.rect) !== JSON.stringify(antes.rect)) mudouPosicao.push({ selector, antes:antes.rect, depois:depois.rect });
    }
    // 5) tradução que regrediu: a linha só existia no português da referência e agora aparece neste idioma
    const antesL = linhas(b.visibleText), depoisL = linhas(a.visibleText);
    let regrediu = [], semTraducao = [];
    if (language !== 'pt') {
      regrediu = [...depoisL].filter(linha => antesPt.has(linha) && !antesL.has(linha) && temPalavra(linha));
      if (regrediu.length) falhas.push(onde + ': texto que já era traduzido voltou em português: ' + regrediu.join(' | '));
      // aviso: texto NOVO igual ao português (pode ser nome próprio; por isso não reprova)
      semTraducao = [...depoisL].filter(linha => depoisPt.has(linha) && !antesPt.has(linha) && !antesL.has(linha) && temPalavra(linha));
      if (semTraducao.length) avisos.push(onde + ': texto novo igual ao português (conferir tradução): ' + semTraducao.join(' | '));
    }
    resumo[language] = { linhasNovas:menos(depoisL, antesL), linhasRemovidas:menos(antesL, depoisL), mudouPosicao, regrediu, semTraducao };
  }
  return { falhas, avisos, resumo };
}
async function main() {
  try {
    execFileSync('git',['fetch','--no-tags','--depth=1','origin',baseSha],{cwd:root,stdio:'inherit'});
    execFileSync('git',['worktree','add','--detach',beforeRoot,baseSha],{cwd:root,stdio:'inherit'});
    beforeServer = serve(beforeRoot);
    afterServer = serve(root);
    const beforePort = await listen(beforeServer);
    const afterPort = await listen(afterServer);
    browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
    const report = { baseSha, languages:['pt','en','es','th','ja'], viewports:[[1280,900],[390,844]], captures:[], checks:[] };
    const falhas = [], avisos = [];
    for (const [width,height] of report.viewports) {
      const capturas = {};
      for (const language of report.languages) {
        const before = await capture(beforePort,'before',language,width,height);
        const after = await capture(afterPort,'after',language,width,height);
        capturas[language] = { before, after };
        report.captures.push({ language, viewport:[width,height], before, after });
      }
      const resultado = conferir([width,height], capturas);
      report.checks.push({ viewport:[width,height], ...resultado });
      falhas.push(...resultado.falhas); avisos.push(...resultado.avisos);
      for (const language of report.languages) {
        const r = resultado.resumo[language], onde = language+' '+width+'x'+height;
        console.log((resultado.falhas.some(f => f.startsWith(onde+':')) ? '✗ ' : '✓ ')+onde+
          ' — +'+r.linhasNovas.length+' / -'+r.linhasRemovidas.length+' linhas de texto, '+r.mudouPosicao.length+' blocos reposicionados');
      }
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    console.log('Saved '+report.captures.length+' screenshot pairs to '+output);
    // No GitHub Actions os avisos viram anotações amarelas na PR; não bloqueiam.
    for (const aviso of avisos) console.log((process.env.GITHUB_ACTIONS ? '::warning title=Tradução a conferir::' : 'AVISO: ')+aviso);
    assert.deepEqual(falhas, [], 'regressões na página inicial em relação à referência '+baseSha.slice(0,7));
  } finally {
    if (browser) await browser.close();
    if (beforeServer) await new Promise(resolve=>beforeServer.close(resolve));
    if (afterServer) await new Promise(resolve=>afterServer.close(resolve));
    try { execFileSync('git',['worktree','remove','--force',beforeRoot],{cwd:root,stdio:'ignore'}); } catch (_) {}
    fs.rmSync(tempRoot,{recursive:true,force:true});
  }
}
main().catch(error=>{ console.error(error); process.exitCode=1; });
