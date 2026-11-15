'use strict';
// Visual de celular (prévia): só carrega com a chave ligada, fala os 6 idiomas e segue a mesma regra de login dos cards do hub.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(root, f), 'utf8');
const html = ler('index.html'), js = ler('tw-celular.js'), css = ler('tw-celular.css'), mapa = ler('tw-mapa.js');

function carregar(){
  const sandbox = { window: {}, document: { readyState: 'loading', addEventListener(){} }, setInterval(){}, requestAnimationFrame(){} };
  sandbox.window = sandbox;
  vm.runInNewContext(js, sandbox, { filename: 'tw-celular.js' });
  return sandbox.TW_CELULAR;
}

test('desligado por padrão: o index só baixa o tw-celular com brs48cr_celular ou ?celular=1', () => {
  const i = html.indexOf("var k='brs48cr_celular'");
  assert.ok(i > 0, 'loader da prévia no index');
  const bloco = html.slice(i, html.indexOf('</script>', i));
  assert.match(bloco, /get\('celular'\)/);
  assert.match(bloco, /q==='0'\)localStorage\.removeItem\(k\)/, '?celular=0 desliga');
  assert.match(bloco, /if\(on\)\{document\.write\('<link rel="stylesheet" href="\.\/tw-celular\.css\?v=\d+"><script src="\.\/tw-celular\.js\?v=\d+">/);
  assert.ok(!/^<script src="\.\/tw-celular\.js/m.test(html), 'nunca carrega direto no HTML');
  assert.ok(html.indexOf("var k='brs48cr_celular'") < html.indexOf('window.TW_JOGOS_SEM_LOGIN = false;'), 'carrega antes do script principal (embrulha o hub a tempo)');
  const tx = bloco.match(/var TX=\{([^}]*)\}/)[1];
  ['pt','en','es','id','th','ja'].forEach(l => assert.match(tx, new RegExp('\\b' + l + ":'"), 'botão do ⚙️ em ' + l));
});

test('todos os textos existem nos 6 idiomas', () => {
  const c = carregar(); assert.ok(c, 'expõe TW_CELULAR');
  const base = Object.keys(c.txt.pt).sort();
  ['en','es','id','th','ja'].forEach(l => {
    assert.deepEqual(Object.keys(c.txt[l]).sort(), base, l + ' com as mesmas chaves');
    base.forEach(k => assert.ok(String(c.txt[l][k]).trim(), l + '.' + k + ' preenchido'));
  });
  ['mapaAgora'].forEach(k => Object.keys(c.txt).forEach(l => assert.ok(c.txt[l][k].includes('{quem}') && c.txt[l][k].includes('{rua}'), l + '.' + k)));
  assert.ok(Object.keys(c.txt).every(l => c.txt[l].jogosSub.includes('{n}')));
  assert.match(js, /ARTIGO = \{Tsu:'o', Lirika:'a', Pati:'o'\}/, 'o Tsu, a Lirika, o Pati');
});

test('pede conta nos mesmos jogos que o clique do card no hub', () => {
  const c = carregar();
  const ini = html.indexOf("if((b = t.closest('.hubcard'))){");
  const corpo = html.slice(ini, html.indexOf('\n  }\n', ini));
  const depois = corpo.slice(corpo.indexOf('else if(!contaJ && !(window.TW_JOGOS_SEM_LOGIN'));
  const pedem = [...depois.matchAll(/ir === '([a-z]+)'/g)].map(m => m[1]);
  assert.deepEqual([...new Set(pedem)].sort(), Object.keys(c.pedeLogin).sort());
  assert.match(js, /c\.click\(\);\s+\/\/ o mesmo caminho do hub/, 'abre pelo próprio card (sem regra nova)');
});

test('visita do mapa: a tela de celular usa o mesmo sorteio do mapa e nunca mostra a própria conta', () => {
  assert.match(mapa, /window\.twMapaVisitaAgora=function\(\)/);
  assert.match(mapa, /function visitaOshi\(rua\)\{[\s\S]{0,260}var k=visitaQuem\(rua\);if\(k<0\)return null;/);
  assert.match(mapa, /return VISITA_NOMES\[k\]\.toLowerCase\(\)===eu\?-1:k;/);
  assert.match(html, /tw-mapa\.js\?v=54/);
});

test('acessível e leve: botões de verdade, alvo de toque, sem animação para quem pediu menos movimento', () => {
  assert.ok(!/role="button"|onclick=/.test(js), 'sem div clicável');
  assert.match(css, /prefers-reduced-motion:reduce\)\{\s*\.twc \*/);
  assert.match(css, /\.twc-nav-b\{[^}]*min-height:60px/);
  assert.match(css, /body\.tw-cel \.tw-nav,body\.tw-cel #twNav\{display:none!important\}/);
  assert.match(css, /@media \(min-width:900px\)/, 'tablet deitado em duas colunas');
});

test('rodada 2: Início enxuto, bolinhas do trio pelo próprio jogo e Álbum com filtro por Oshi', () => {
  const ini = js.slice(js.indexOf('function telaInicio(){'), js.indexOf('function banner('));
  assert.ok(!/twc-hoje|twc-rank|twc-idol/.test(ini), 'Pra hoje completo, ranking e pet saíram do Início (estão no Menu)');
  assert.match(ini, /palco\(\)/, 'o palco do trio continua no Início');
  assert.match(js, /perfFotoRedonda\(cv, av, true\)/, 'bolinhas desenhadas com o mesmo desenho do perfil');
  assert.match(js, /HUB_TRIO_DRAW_CHARS\[k\]/);
  assert.match(js, /contaRpc\('album_cards'\)/, 'o Álbum lê só a consulta que já existe');
  assert.match(js, /o === 'tsu' \|\| o === 'lirika' \|\| o === 'pati' \? o : 'outros'/);
  assert.match(js, /cardsMem\.twcAlbum = mostrar/, 'o toque abre o zoom de card do próprio jogo');
  assert.match(js, /if\(!logado\(\)\)\{ pedirLogin\(t\('album'\)\)/, 'sem conta, o Álbum avisa antes');
  assert.match(css, /\.twc-amarelo\{/);
});

test('rodada 3: moldura nas janelas, boas-vindas do celular e modo escuro', () => {
  assert.match(js, /querySelectorAll\('\.tw-window-overlay[,']/, 'a moldura vale para todas as janelas do jogo');
  assert.match(js, /querySelector\('\.tw-window-close,\.tw-rank-tv-close'\); if\(x\) x\.click\(\)/, 'Voltar fecha pelo ✕ da própria janela');
  assert.match(js, /var TUT_CHAVE = 'tw_cel_tut_v1'/);
  assert.ok(!/brs48cr_[a-z_]*tut/.test(js), 'marcador do tutorial não é chave de save');
  assert.match(css, /body\.tw-cel #hubTut\{display:none!important\}/);
  assert.match(css, /@media \(prefers-color-scheme:dark\)\{\s*:root:not\(\[data-theme="light"\]\) \.twc\{/);
});

test('rodada 4: moldura no menu do Center Run e no salão do Karaoke, sem atrapalhar a corrida nem o show', () => {
  assert.match(js, /document\.documentElement\.classList\.contains\('tw-kt-arena'\)\) return 'kt'/);
  assert.match(js, /!document\.body\.classList\.contains\('jogando'\)/);
  assert.match(js, /ctx === 'kt' \? \$id\('twPreviewVoltar'\) : ctx === 'cr' \? \$id\('hubVolta'\)/, 'sai pelo próprio Início de cada tela');
});

test('rodada 5 (prints do iPhone): moldura em janelas criadas na hora, telas embutidas, vitrine sem pontos e logo sem quebrar', () => {
  assert.match(js, /attributeFilter:\['class'\], childList:true/, 'janela criada por jogo que carrega depois também ganha a moldura');
  assert.match(js, /var EMB = \{mapa:\['#twMapa', 'mapa'\], missoes:\['#hubMisPainel', 'mis'\], busca:\['\.hubbusca', 'busca'\], nov:\['\.hubnov', 'nov'\]\}/);
  assert.match(js, /if\(a === 'mapa' \|\| a === 'missoes' \|\| a === 'busca' \|\| a === 'nov'\)\{ ir\('emb:' \+ a\); return; \}/, 'nada abre mais o site antigo');
  const vit = js.slice(js.indexOf('function idols(){'), js.indexOf('function idolsDesenhar('));
  assert.ok(!/best/.test(vit), 'a vitrine não mostra pontuação');
  assert.match(vit, /class="lbn twc-idol-b" data-nick=/, 'tocar abre o perfil pelo mesmo caminho do site');
  assert.match(css, /\.twc \.twc-hublogo\{white-space:nowrap/);
  assert.match(css, /body\.tw-cel \.tw-window-overlay>\.panel\.tw-window-surface\{width:100%!important;max-width:760px!important;max-height:none!important/);
});

test('rodada 6: vitrine com luzes na abertura (trio desfilando, sem pontos), TV na moldura e sem pedir a vitrine a cada redesenho', () => {
  const hub = ler('hub.js');
  assert.match(js, /'<div class="twc-abre-vitrine" id="twcAbreVitrine"><\/div>'/, 'a vitrine antiga entra na tela de abertura');
  assert.match(js, /if\(v === 'abre'\) vitrineTrazer\(\);/);
  assert.match(js, /devolver\(\); vitrineDevolver\(\);/, 'desligar o celular devolve tudo ao hub clássico');
  assert.match(hub, /hubIV\.L = trio\.concat\(/);
  assert.match(hub, /trio = !L\.length && typeof window\.twcTrioVitrine/, 'os bonecos do trio só entram sem lista (sem duplicar as contas deles)');
  assert.match(hub, /n\.indexOf\('tsu'\) === 0 \? 0 : n\.indexOf\('lirika'\) === 0 \? 1 : n\.indexOf\('pati'\) === 0 \? 2 : 9/, 'as contas do trio desfilam juntas na frente');
  assert.match(hub, /if\(!p\.trio && !window\.TW_CELULAR_LIGADO\)\{[^}]*'★ ' \+ p\.best/, 'sem pontuação no visual de celular');
  assert.match(js, /Date\.now\(\) - idolsPedido > 60e3/, 'não entra em laço pedindo a vitrine');
  assert.match(js, /'\.tw-window-overlay,#twRankTvModal'/, 'a TsuLiPa⭐TV! ganha a moldura');
  assert.match(css, /\.twc-idols-fila\{[^}]*padding:7px 14px 8px/, 'o anel da bolinha não corta');
});
