'use strict';
const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const http = require('node:http');
const { execFileSync } = require('node:child_process');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const baseSha = process.env.BASE_SHA;
if (!baseSha) throw new Error('BASE_SHA is required for before/after screenshots');
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
async function main() {
  try {
    execFileSync('git',['fetch','--no-tags','--depth=1','origin',baseSha],{cwd:root,stdio:'inherit'});
    execFileSync('git',['worktree','add','--detach',beforeRoot,baseSha],{cwd:root,stdio:'inherit'});
    beforeServer = serve(beforeRoot);
    afterServer = serve(root);
    const beforePort = await listen(beforeServer);
    const afterPort = await listen(afterServer);
    browser = await chromium.launch({ headless:true, args:['--no-sandbox'] });
    const report = { baseSha, languages:['pt','en','es','th','ja'], viewports:[[1280,900],[390,844]], captures:[] };
    for (const [width,height] of report.viewports) {
      for (const language of report.languages) {
        const before = await capture(beforePort,'before',language,width,height);
        const after = await capture(afterPort,'after',language,width,height);
        assert.deepEqual(after.snapshot,before.snapshot,
          'homepage text/layout changed after dictionary extraction: '+language+' '+width+'x'+height);
        assert.deepEqual(after.errors,before.errors,
          'browser errors changed after dictionary extraction: '+language+' '+width+'x'+height);
        report.captures.push({ language, viewport:[width,height], before, after });
        console.log('✓ '+language+' '+width+'x'+height+' — text and layout unchanged; before/after captures saved');
      }
    }
    fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));
    console.log('Saved '+report.captures.length+' screenshot pairs to '+output);
  } finally {
    if (browser) await browser.close();
    if (beforeServer) await new Promise(resolve=>beforeServer.close(resolve));
    if (afterServer) await new Promise(resolve=>afterServer.close(resolve));
    try { execFileSync('git',['worktree','remove','--force',beforeRoot],{cwd:root,stdio:'ignore'}); } catch (_) {}
    fs.rmSync(tempRoot,{recursive:true,force:true});
  }
}
main().catch(error=>{ console.error(error); process.exitCode=1; });
