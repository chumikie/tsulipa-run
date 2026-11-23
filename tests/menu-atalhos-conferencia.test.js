'use strict';
// Conferência #130 (22/11/2026): defeitos dos atalhos do Menu confirmados na conta real.
// Só correções: os 14 atalhos continuam os mesmos; nada de prêmio, saldo ou save muda aqui.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const ler = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const cel = ler('tw-celular.js'), css = ler('tw-celular.css');

function trechoMenu(){
  const i = cel.indexOf("    var at = [['loja', 'Zipper Shop'"), j = cel.indexOf("    var colPc = ");
  assert.ok(i > 0 && j > i, 'montagem dos atalhos encontrada');
  return cel.slice(i, j);
}

test('Menu: cada atalho tem um ícone próprio e o ícone existe na tabela', () => {
  const m = trechoMenu();
  const icones = [...m.matchAll(/\['([a-z]+)', [^\]]*?'data-[a-z]+="[^"]+"/g)].map(x => x[1]);
  assert.ok(icones.length >= 14, 'os 14 atalhos (mais trilha e instalar) continuam: ' + icones.length);
  assert.equal(new Set(icones).size, icones.length, 'ícones repetidos: ' + icones.join(','));
  for (const k of icones) assert.ok(new RegExp('\\n\\s+' + k + ":'<").test(cel) || new RegExp('[ ,]' + k + ":'<").test(cel), 'ícone sem desenho: ' + k);
});

test('Menu: nomes curtos nos 6 idiomas onde o nome quebrava, e o nome inteiro no leitor de tela', () => {
  for (const k of ['data-twk="lembrete"', 'data-twp="recado"']) {
    const linha = cel.split('\n').find(l => l.includes("'" + k + "':{"));
    assert.ok(linha, 'nome curto para ' + k);
    for (const l of ['pt', 'en', 'es', 'id', 'th', 'ja']) assert.match(linha, new RegExp('\\b' + l + ":'"), k + ' em ' + l);
    assert.ok(!/TsuLiPa⭐World/.test(linha), 'nome curto sem a marca longa');
  }
  assert.match(cel, /aria-label="' \+ esc\(a\[1\]\) \+ '" title="' \+ esc\(a\[1\]\)/, 'nome inteiro em aria-label e title');
  assert.match(css, /\.twc-menu \.twc-at-nome\{[^}]*-webkit-line-clamp:2[^}]*overflow-wrap:break-word/, 'até 2 linhas, sem quebrar palavra que cabe');
  assert.ok(!/\.twc-menu \.twc-at-nome\{[^}]*anywhere/.test(css), 'sem overflow-wrap:anywhere na grade do Menu');
});

test('Poda (22/11): Menu sem banners de jogos, 7 atalhos à vista + pasta Mais com o resto', () => {
  const ini = cel.indexOf('  function telaMenu(){'), fim = cel.indexOf('  /* ---------- Álbum:', ini);
  const menu = cel.slice(ini, fim);
  assert.ok(!/banner\('(run|karaoke|gacha)'/.test(menu) && !menu.includes('twc-banners'), 'banners fora do Menu (estão na porta Jogos)');
  const vista = menu.match(/var VISTA = \[([^\]]+)\]/);
  assert.ok(vista, 'lista dos atalhos à vista');
  assert.equal(vista[1].split(',').length, 7, '7 à vista + a pasta = 8');
  assert.match(menu, /\['todos', tm\('mais'\), 'data-a="menuMais"'\]/);
  assert.match(cel, /if\(a === 'menuMais'\)\{ folhaMais\(\); return; \}/);
  assert.match(cel, /var JOGOS = \[[^\]]*'gacha'/, 'sem o banner, o Star⭐Gacha! precisa estar na lista de Jogos');
  assert.ok(!menu.includes('data-twp="retro"'), '"Meu mês" saiu do Menu: a retrospectiva está no Esta semana do Calendário');
  assert.ok(!css.includes('.twc-ini-hoje .tws{display:none'), 'regra morta do Esta semana no Início removida');
  assert.match(cel, /mais:\{pt:'Mais',en:'More',es:'Más',id:'Lainnya',th:'[^']+',ja:'[^']+'\}/);
  assert.match(css, /\.twc-menu \.twc-atalhos\{[^}]*display:flex;flex-wrap:wrap;justify-content:center/);
});

test('Poda (22/11): "Esta semana" saiu do Início e mora no Calendário', () => {
  const ini = cel.slice(cel.indexOf('  function telaInicio(){'), cel.indexOf('  /* ---------- Menu:'));
  assert.ok(!ini.includes('TW_SEMANA'), 'Início sem o bloco Esta semana');
  const cal = cel.slice(cel.indexOf('  function telaCal(){'), cel.indexOf('  /* ---------- Tour de camarins'));
  assert.match(cal, /twc-cal-semana[^\n]*TW_SEMANA\.html\(\)/);
});

test('Tema escuro: Tour de camarins e Vida no bairro legíveis; Álbum com a Série de fotos na linha inteira', () => {
  assert.match(css, /prefers-color-scheme:dark\)\{:root:not\(\[data-theme="light"\]\) \.twc-tour-item b\{color:#f3e8ff\}/);
  assert.match(css, /:root\[data-theme="dark"\] \.twc-tour-item b\{color:#f3e8ff\}/);
  const bt = ler('tw-bairro-tela.js');
  assert.match(bt, /prefers-color-scheme:dark\)\{:root:not\(\[data-theme="light"\]\) \.twb-box\{background:rgba\(42,29,74,\.82\)/);
  assert.match(bt, /:root\[data-theme="dark"\] \.twb-box\{/);
  assert.match(ler('tw-bairro.js'), /tw-bairro-tela\.js\?v=4/);
  assert.match(css, /\.twc-album-corpo>\.album-fotos\{grid-column:1 \/ -1/);
});

test('Concurso, Convite e Meu mês: carregando e erro dentro da janela, com Tentar de novo', () => {
  const com = ler('tw-comunidade.js');
  for (const k of ['carregando', 'falhou', 'tentar']) assert.match(com, new RegExp('\\n    ' + k + ":\\{pt:'[^']+',en:'[^']+',es:'[^']+',id:'[^']+',th:'[^']+',ja:'"), k);
  assert.ok(!com.includes(`<p class="twk-txt">…</p>`), 'sem janela presa em "…"');
  assert.match(com, /falhou\(tit, 'convite'\)[\s\S]*falhou\(tit, 'convite'\)/, 'convite: resposta ruim e rede caída');
  assert.match(com, /falhou\(tit, 'concurso'\)[\s\S]*falhou\(tit, 'concurso'\)/, 'concurso: resposta ruim e rede caída');
  assert.match(com, /'#twkTit'\);   \/\/ o 1º botão grava/, 'concurso abre com foco no título, não no botão que grava');
  assert.match(com, /abrirConcurso\(b\.dataset\.nick\)/, 'depois do voto o foco volta ao coração tocado');
  assert.match(com, /RRULE:FREQ=WEEKLY;BYDAY=SA/, 'lembrete continua igual');
  const pes = ler('tw-pessoal.js');
  assert.match(pes, /function retroFalhou\(pedido, mes\)/);
  assert.match(pes, /\.catch\(function\(\)\{retroFalhou\(pedido, mes\);\}\)/);
  assert.match(pes, /bt\.setAttribute\('aria-disabled', ok \? 'false' : 'true'\)/, 'Enviar só acende com 2 letras');
});

test('Camarim VIP sem o diamantinho do humor; o Mapa continua com ele', () => {
  assert.match(cel, /if\(g\.eu && window\.TW_HUMOR && id !== 'vip'\)\{/);
  assert.match(ler('tw-mapa.js'), /diamantes\.push\(/);
});

test('versões de cache subiram junto', () => {
  const index = ler('index.html');
  for (const v of ['tw-celular.css?v=61', 'tw-celular.js?v=75', 'tw-bairro.js?v=9', 'tw-comunidade.js?v=6', 'tw-pessoal.js?v=8']) assert.ok(index.includes(v), v);
});
