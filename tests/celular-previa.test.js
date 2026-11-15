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
  assert.match(bloco, /if\(on\)\{document\.write\('<link rel="stylesheet" href="\.\/tw-celular\.css\?v=\d+"><script src="\.\/tw-humor\.js\?v=\d+"><'\+'\/script><script src="\.\/tw-calendario\.js\?v=\d+"><'\+'\/script><script src="\.\/tw-celular\.js\?v=\d+">/);
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
  // + Bloom (o próprio módulo abre o login) e Álbum (lê os cards da conta): no celular eles mostram o cadeado e a folha de login
  assert.deepEqual([...new Set(pedem.concat(['bloom', 'album']))].sort(), Object.keys(c.pedeLogin).sort());
  assert.match(js, /var TREINO = \{battle:1, cafe:1, handshake:1, studio:1\};/, 'jogos que abrem em treino ganham o selo, não o cadeado');
  assert.match(mapa, /function cadeadosPortas\(\)/, 'cadeado nas portas do mapa para visitante');
  assert.match(js, /c\.click\(\);\s+\/\/ o mesmo caminho do hub/, 'abre pelo próprio card (sem regra nova)');
});

test('visita do mapa: a tela de celular usa o mesmo sorteio do mapa e nunca mostra a própria conta', () => {
  assert.match(mapa, /window\.twMapaVisitaAgora=function\(\)/);
  assert.match(mapa, /function visitaOshi\(rua\)\{[\s\S]{0,260}var k=visitaQuem\(rua\);if\(k<0\)return null;/);
  assert.match(mapa, /var euK=visitaContaTrio\(eu\);[\s\S]{0,140}if\(k===euK\)k=\(k\+1\)%3;/, 'quem entra como Tsu, Lirika ou Patiliri nunca encontra a si mesmo');
  assert.match(html, /tw-mapa\.js\?v=59/);
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
  assert.match(js, /if\(v === 'abre'\)\{ vitrineTrazer\(\); flutuantes\(\);/);
  assert.match(js, /devolver\(\); vitrineDevolver\(\);/, 'desligar o celular devolve tudo ao hub clássico');
  assert.match(hub, /hubIV\.L = trio\.concat\(/);
  assert.match(hub, /trio = !L\.length && typeof window\.twcTrioVitrine/, 'os bonecos do trio só entram sem lista (sem duplicar as contas deles)');
  assert.match(hub, /\['tsu', 'lirika', 'patiliri'\]\.indexOf\(/, 'as contas oficiais do trio desfilam juntas na frente');
  assert.match(hub, /if\(!p\.trio && !window\.TW_CELULAR_LIGADO\)\{[^}]*'★ ' \+ p\.best/, 'sem pontuação no visual de celular');
  assert.match(js, /Date\.now\(\) - idolsPedido > 60e3/, 'não entra em laço pedindo a vitrine');
  assert.match(js, /'\.tw-window-overlay,#twRankTvModal'/, 'a TsuLiPa⭐TV! ganha a moldura');
  assert.match(css, /\.twc-idols-fila\{[^}]*padding:7px 14px 8px/, 'o anel da bolinha não corta');
});

test('rodada 7: mapa sem trio duplicado, membros em atividade nos lugares, rolagem preservada e rua menos ampliada', () => {
  assert.match(mapa, /var VISITA_CONTAS=\['tsu','lirika','patiliri'\]/);
  assert.match(mapa, /hubIdolsDados\.idols\.forEach\(function\(p\)\{if\(p&&p\.nick&&visitaContaTrio\(p\.nick\)<0&&/, 'as contas do trio não passeiam junto com a visita');
  assert.match(mapa, /if\(p\.oshi\)\{var pd=visitaPorta\(p\.oshiK\);[\s\S]{0,260}ativo:visitaAtividade\(p\.oshiK\)\};\}/, 'quem visita fica ativo na frente de um lugar');
  assert.match(mapa, /POSES_ATIVAS=\{mic:\['mic'/);
  assert.match(mapa, /,S=1\.05;/, 'gatinho menor');
  const gato = mapa.slice(mapa.indexOf('function gatoDesenhar('), mapa.indexOf('// Peixinhos koi'));
  assert.ok(!/bigode|createLinearGradient/.test(gato), 'gatinho redesenhado: chapado, sem bigodes nem degradê');
  assert.match(gato, /rr\(-17,-46,34,28,11\)/, 'cabeção quadradinho no jeito dos Idols');
  assert.match(mapa, /if\(sec\.closest&&sec\.closest\('#twCel'\)\)return;/, 'o hub não puxa o mapa de volta enquanto ele está no celular');
  const d = js.slice(js.indexOf('function desenhar(){'), js.indexOf('function ir(v)'));
  assert.ok(d.indexOf('tela.scrollTop = rolagem') > d.indexOf('embutir(v.slice(4))'), 'a rolagem volta depois de trazer o mapa');
  assert.match(css, /\.twc-emb-mapa \.tw-mapa:not\(\[data-cena="mundo"\]\) canvas\{width:max\(100%,720px\)/);
});

test('rodada 8 (BarbieGirls/Zwinky): frases prontas iguais às do servidor, online agora, lugares por dentro, pais, manutenção e Montar Idol em vitrine', () => {
  const pres = ler('tw-presenca.js'), sql = ler('supabase/migrations/20261115200000_presenca_online.sql'), cm = ler('charmaker.js'), mapaJs = ler('tw-mapa.js');
  const chaves = (pres.match(/^\s{4}(\w+):\{pt:/gm) || []).map(l => l.trim().split(':')[0]).filter(k => !['online', 'falar', 'so'].includes(k));
  const servidor = sql.match(/p_frase in \(([^)]+)\)/)[1].replace(/'/g, '').split(',').map(x => x.trim());
  assert.deepEqual(chaves.sort(), servidor.sort(), 'a lista do aparelho é a mesma que o servidor aceita (sem chat livre)');
  for (const k of chaves) for (const l of ['pt', 'en', 'es', 'id', 'th', 'ja']) assert.match(pres, new RegExp(k + ':\\{[^}]*' + l + ":['\"]"), k + ' em ' + l);
  assert.match(sql, /grant execute on function public\.presenca_ping\(text, text\) to authenticated;/, 'só conta logada diz que está online');
  assert.match(sql, /revoke all on public\.presenca from anon, authenticated;/, 'tabela fechada: só pelas funções');
  assert.match(html, /tw-presenca\.js\?v=1/);
  assert.match(js, /window\.twMapaEntrar = function\(id\)/);
  assert.match(mapaJs, /if\(typeof window\.twMapaEntrar==='function'&&window\.twMapaEntrar\(l\.id\)\)return;/, 'o mapa abre o lado de dentro antes do lugar');
  assert.match(mapaJs, /window\.twMapaCena=function\(\)/);
  assert.match(mapaJs, /function mundoGente\(tm\)/, 'mapa geral com Idols nas calçadas');
  assert.ok(!/function telaPais\(\)/.test(js), 'Cantinho dos pais saiu (o público é adulto)');
  assert.match(js, /if\(falhaDeRede\(err\)\)\{ falhas\+\+; if\(falhas >= 3\) manutMostrar\(\); \}/, 'manutenção só depois de 3 falhas de rede seguidas');
  assert.match(cm, /var PASSOS = \[\[0, '💇', 'Visual'/, 'Montar Idol em 3 passos');
  assert.match(cm, /if\(celLigado\(\)\)\{ redoma\(cv, c\); return; \}/, 'redoma só no visual de celular');
  assert.match(cm, /if\(podeProvar\)\{ st\.prova = /, 'provar peça trancada só na prévia (não salva nem compra)');
});

test('rodada 11 (refino): mapa de amizades e fichas com os bonecos e pets de verdade, sem emojis nos ícones novos', () => {
  const trio = js.slice(js.indexOf('  function telaTrio(){'), js.indexOf('  /* ---------- Cantinho dos pais'));
  assert.match(trio, /drawPet\(x, MEMBROS\[k\]\[0\]/, 'pets do jogo (Chu, Koali, Pucchi) desenhados com drawPet no mapa de amizades');
  assert.match(trio, /AMIGOS_POS = \[\{k:0, x:150, y:350.*\{k:1, x:340, y:350.*\{k:2, x:530, y:350/, 'os três na mesma altura, a Lirika no meio');
  assert.ok(!/gekoku/.test(js), 'Gekokujou saiu do mapa; entra a mesma geração');
  assert.match(trio, /hubVozTocar\(f\[0\]\)/, 'tocar num membro toca a voz de verdade');
  assert.match(trio, /petVoice\(null, MEMBROS\[k\]\[0\]\)/, 'tocar num pet faz o som dele');
  assert.match(trio, /perfDesenharIdol\(x, 104, 112, a2/, 'o trio de corpo inteiro no mapa');
  assert.match(trio, /canvas class="twc-ficha-pet" data-pet=/, 'pet desenhado também na ficha');
  assert.ok(!/['"](🐈|🐨|👑)['"]/.test(trio), 'sem emoji de pet');
  const humor = js.slice(js.indexOf('  function humorHtml(){'), js.indexOf('  function desejoIco('));
  assert.ok(!/[👑🔥]/u.test(humor), 'humor e VIP com ícones desenhados');
  assert.ok(!/🚧/u.test(js), 'cones de manutenção desenhados em SVG');
  assert.match(js, /cor:\['#fff3e6', '#f2c49c', '#c98a5a', '#ffe1c7', '#dca47a'\]/, 'salas por dentro com parede e piso em degradê');
});
