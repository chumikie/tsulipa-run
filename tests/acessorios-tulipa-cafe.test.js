const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase/migrations/20261102023122_acessorios_tulipa_laco_fundo_cafe.sql'), 'utf8');

test('coroa, torrada e chapéu têm itens e preços oficiais sem duplicar acessórios legados', () => {
  assert.match(html, /\['det_tulipa', '🌷', 'Coroa de Tulipas', 50, 'acc'\]/);
  assert.match(html, /\['det_torrada', '🍞', 'Torrada de Anime', 50, 'acc'\]/);
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
  assert.match(html, /g\.arc\(x\+15,y\+7,12/);
  assert.match(html, /g\.translate\(x\+17,y\+24\);g\.rotate\(-\.32\)/);
  assert.ok(html.indexOf("if(d==='torrada')") > html.indexOf("if(expr===1)"), 'torrada fica sobre a boca');
  assert.ok(html.indexOf("if(hacc==='palha')") > html.indexOf('TWAvatarHair.bicolor'), 'chapéu sobre o cabelo');
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
