const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase/migrations/20261102020938_avisos_grupo_e_roupa_sku.sql'), 'utf8');

test('admin escolhe todos ou grupo nacional, nunca time interno', () => {
  assert.match(html, /<select id="avisoAlvo"><option value="">🌏 Todos os jogadores/);
  assert.match(html, /PERF_GRUPOS\.map\(function\(g\)/);
  assert.match(html, /grupoAviso\?'admin_aviso_grupo':'admin_aviso'/);
  assert.match(html, /p_grupo:grupoAviso,p_texto:textoAviso/);
  assert.match(html, /admin_avisos_grupo/);
  assert.doesNotMatch(html.slice(html.indexOf('function admExtra()'), html.indexOf("perfOv.addEventListener('keydown'", html.indexOf('function admExtra()'))), /PERF_TIMES|perfBioTime|avisoTime/);
});

test('RPC de aviso usa catálogo, valida admin e isola mensagens por grupo', () => {
  assert.match(sql, /if not public\.eh_admin\(\)/);
  assert.match(sql, /from public\.idol_grupos where codigo=g and ativo/);
  assert.match(sql, /'aviso_grupo_'\|\|g/);
  assert.match(sql, /p\.id=auth\.uid\(\) and p\.grupo is not null/);
  assert.match(sql, /where p\.id=auth\.uid\(\)/);
  assert.match(sql, /grant execute on function public\.admin_aviso_grupo\(text,text\) to authenticated/);
  assert.match(sql, /grant execute on function public\.aviso_inicio\(\) to anon,authenticated/);
  assert.doesNotMatch(sql, /brs48cr_|drop table|delete from public\.players|update public\.players/i);
});

test('camisa tailandesa mantém preço e fluxo de compra oficial da brasileira', () => {
  assert.match(html, /\['brasil',\s*'🇧🇷',\s*'Brasil',\s*150\]/);
  assert.match(html, /\['tailandia',\s*'🇹🇭',\s*'Tailândia',\s*150\]/);
  assert.match(html, /roupa\s*===\s*'tailandia'/);
  assert.match(html, /roupa\s*===\s*'brasil'/);
  assert.match(sql, /\(''roupa_tailandia'', 150, 0\)/);
  assert.match(sql, /visual_preco/);
  assert.doesNotMatch(sql, /comprar_visual|salvar_avatar|stars\s*=|ranking/i);
});
