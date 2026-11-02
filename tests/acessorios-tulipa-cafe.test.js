const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase/migrations/20261102023122_acessorios_tulipa_laco_fundo_cafe.sql'), 'utf8');

test('dois acessórios custam 50 estrelas e usam o desenho do cabelo', () => {
  assert.match(html, /\['det_tulipa', '🌷', 'Presilha de Tulipa', 50, 'acc'\]/);
  assert.match(html, /\['det_laco', '🎀', 'Laço de Estreia', 50, 'acc'\]/);
  assert.match(html, /if\(d==='tulipa'\)/);
  assert.match(html, /if\(d==='laco'\)/);
  assert.match(html, /\/\^det_\(coelho\|tulipa\|laco\)\$\//);
  assert.match(html, /function acessoriosSync\(\)/);
  assert.match(sql, /\(''det_tulipa'', 50, 0\)/);
  assert.match(sql, /\(''det_laco'', 50, 0\)/);
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
  assert.match(sql, /IF NOT livre/);
  assert.doesNotMatch(sql, /drop table|delete from public\.players|update public\.players|brs48cr_|stars\s*=/i);
});
