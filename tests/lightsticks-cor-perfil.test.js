const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = require('./site-source.js')();
const karaoke = fs.readFileSync(path.join(__dirname, '..', 'karaoke-time.html'), 'utf8');

test('cor oficial do perfil segue sendo lida e salva sem criar chave nova', () => {
  assert.match(html, /localStorage\.getItem\('brs48cr_cor'\)/);
  assert.match(html, /function perfGuardarCor\(c\)/);
  assert.match(html, /contaRpc\('salvar_grupo_estilo'/);
  assert.match(html, /perfGuardarCor\(re\.cor\)/);
  assert.match(html, /perfGuardarCor\(d\.cor\)/);
  assert.match(html, /\^#\[0-9a-f\]\{6\}\$/i);
});

test('lightsticks pessoais e palco seguem a cor do avatar de cada conta', () => {
  assert.match(html, /c\.luz = av\.cor/);
  assert.match(html, /var cor = c\.luz \|\| c\.hair \|\| '#ff6fb5'/);
  assert.match(karaoke, /c\.luz=cor/);
  assert.match(karaoke, /var cor = c\.luz \|\| c\.hair \|\| '#ff6fb5'/);
});

test('Center Run conserva cores tradicionais da torcida, multidão e obstáculos', () => {
  assert.match(html, /var lsColors = \['#9b30d9', '#b6ff3b', '#4169e1'\]/);
  assert.match(html, /g\.fillStyle = f\.color;\s*g\.shadowColor = f\.color;/);
  assert.match(html, /var cores = \['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5', '#ffe14d'\]/);
  assert.match(html, /var c = o\.pal;/);
  assert.doesNotMatch(html, /var corFan = typeof perfMinhaCor/);
  assert.doesNotMatch(html.slice(html.indexOf('function perfGuardarCor'), html.indexOf('var CONTA_DICT')), /brs48cr_\w+\s*=/);
});

test('orelhas de coelho ficam abaixo da linha superior e atrás do cabelo', () => {
  const coelho = html.indexOf("if(d==='coelho'){[[9.5,-.2]");
  const cabelo = html.indexOf('var hg=g.createLinearGradient', coelho);
  assert.ok(coelho > 0 && cabelo > coelho, 'orelhas são desenhadas antes do cabelo');
  assert.match(html.slice(coelho, cabelo), /translate\(x\+p\[0\],y\+1\)/);
  assert.match(html.slice(coelho, cabelo), /g\.ellipse\(0,-5,3\.4,9/);
});
