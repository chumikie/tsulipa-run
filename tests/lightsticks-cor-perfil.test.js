const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
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

test('Center Run acompanha troca de cor inclusive em fãs já criados; sem perfil conserva paleta', () => {
  assert.match(html, /var lsColors = typeof perfMinhaCor/);
  assert.match(html, /\? \[perfMinhaCor\] : \['#9b30d9', '#b6ff3b', '#4169e1'\]/);
  assert.match(html, /var corFan = typeof perfMinhaCor/);
  assert.match(html, /g\.fillStyle = corFan;\s*g\.shadowColor = corFan;/);
  assert.match(html, /var cores = perfMinhaCor \? \[perfMinhaCor\]/);
  assert.match(html, /var c = perfMinhaCor \? \[perfMinhaCor, perfMinhaCor, perfMinhaCor\] : o\.pal/);
  assert.doesNotMatch(html.slice(html.indexOf('function perfGuardarCor'), html.indexOf('var CONTA_DICT')), /brs48cr_\w+\s*=/);
});
