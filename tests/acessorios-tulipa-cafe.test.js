const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = require('./site-source.js')();
const sql = fs.readFileSync(path.join(root, 'supabase/migrations/20261102023122_acessorios_tulipa_laco_fundo_cafe.sql'), 'utf8');

test('coroa, torrada e chapéu têm itens e preços oficiais sem duplicar acessórios legados', () => {
  assert.match(html, /\['det_tulipa', '🌷', 'Coroa de Tulipas', 50, 'acc'\]/);
  assert.match(html, /\['det_torrada', '🍞', 'Torrada', 50, 'item'\]/);
  assert.match(html, /\['hat_palha', '👒', 'Chapéu de Palha', 70, 'acc'\]/);
  assert.match(html, /if\(d==='tulipa'\)/);
  assert.match(html, /if\(d==='torrada'\)/);
  assert.match(html, /if\(hacc==='palha'\)/);
  assert.match(html, /\/\^det_\(coelho\|tulipa\|torrada\)\$\//);
  assert.match(html, /function acessoriosSync\(\)/);
  assert.match(sql, /\(''det_tulipa'', 50, 0\)/);
  assert.match(sql, /\(''det_torrada'', 50, 0\)/);
  assert.match(sql, /\(''hat_palha'', 70, 0\)/);
  assert.doesNotMatch(html.slice(html.indexOf('var LOJA_EXTRA ='),html.indexOf('var DUO_TEMA_PRECO')), /det_laco/);
});

test('desenhos Canvas 2D respeitam camada do cabelo e paleta TsuLiPa + perfil', () => {
  assert.match(html, /var tc=\['#9b30d9','#b6ff3b','#4169e1',/);
  assert.match(html, /test\(c\.luz\|\|''\)\?c\.luz/);
  assert.match(html, /g\.bezierCurveTo\(x\+7,y-2,x\+23,y-2,x\+28,y\+8\)/);
  assert.match(html, /E\(fx-3\.5,fy\+2\.8,2\.6,1\.25,-\.55\)/);
  assert.match(html, /g\.translate\(x\+15\.5,y\+24\);g\.rotate\(-\.24\)/);
  assert.match(html, /boca segura a ponta do pão/);
  assert.match(html, /g\.ellipse\(x\+15,y\+4\.4,15\.2,2\.25/);
  assert.ok(html.indexOf("if(d==='torrada')") > html.indexOf("if(expr===1)"), 'torrada fica sobre a boca');
  assert.ok(html.indexOf("if(hacc==='palha')") > html.indexOf('TWAvatarHair.bicolor'), 'chapéu sobre o cabelo');
  assert.match(html, /id="perfLojaAcessorios"/);
  assert.match(html, /boxAcc\.innerHTML=cards\(L\.filter\(function\(it\)\{return it\[4\]==='acc';\}\)\)/);
});

test('café reaproveita desenho e compra duo_cafe, sem fundo_cafe pago em duplicidade', () => {
  assert.match(html, /if\(f==='cafe'\)\{ duoFundoDesenhar/);
  assert.match(html, /perfDono\.indexOf\(k === 'cafe' \? 'duo_cafe' : 'fundo_' \+ k\)/);
  assert.match(html, /f\[0\]==='cafe'\?'duo_cafe':'fundo_' \+ f\[0\]/);
  assert.match(html, /\['cafe','☕','Café kawaii',90\]/);
  assert.match(sql, /f = ''cafe'' AND ''duo_cafe'' = ANY\(p\.visuais\)/);
  assert.doesNotMatch(sql, /'fundo_cafe',\s*90/);
});

test('RPC mantém proteção dos demais fundos e novos acessórios', () => {
  assert.match(sql, /visual_preco\(text\)/);
  assert.match(sql, /salvar_avatar\(jsonb\)/);
  assert.match(sql, /AND NOT \(\(''fundo_'' \|\| f\) = ANY\(p\.visuais\)\)/);
  assert.match(sql, /acessorio_nao_comprado/);
  assert.match(sql, /''hat_palha'' = ANY\(p\.visuais\)/);
  assert.match(sql, /IF NOT livre/);
  assert.doesNotMatch(sql, /drop table|delete from public\.players|update public\.players|brs48cr_|stars\s*=/i);
});

test('acessórios comprados aparecem no vestuário do menu e no Montar Idol sem segunda compra', () => {
  assert.match(html, /function perfMontUI\(\)\{\s*if\(typeof acessoriosSync==='function'\) acessoriosSync\(\)/);
  assert.match(html, /perfLojaOpcoes\(\);\s*if\(typeof acessoriosSync==='function'\) acessoriosSync\(\)/);
  assert.match(html, /lojaTem\('det_'\+it\[0\]\)\|\|CU\.det===it\[0\]/);
  assert.match(html, /lojaTem\('det_tulipa'\)\|\|CU\.det==='tulipa'/);
  assert.match(html, /lojaTem\('det_torrada'\)\|\|CU\.det==='torrada'/);
  assert.match(html, /lojaTem\('hat_palha'\)\|\|CU\.hat==='palha'/);
  assert.match(html, /if\(temPalha&&!palha\)/);
  assert.match(html, /if\(tem&&!o\)/);
});

test('Coroa no campo Acessório e Torrada no campo Item preservam as chaves legadas', () => {
  assert.match(html, /h\.querySelector\('option\[value="tulipa"\]'\)/);
  assert.match(html, /itens\.querySelector\('option\[value="torrada"\]'\)/);
  assert.match(html, /CU\.det==='tulipa'\?'tulipa'/);
  assert.match(html, /CU\.det==='torrada'\?'torrada'/);
  assert.match(html, /boxItens\.innerHTML=cards/);
  assert.match(html, /id="perfLojaItens"/);
  assert.doesNotMatch(html.slice(html.indexOf('var LOJA_EXTRA ='),html.indexOf('var DUO_TEMA_PRECO')), /Torrada de Anime/);
});
