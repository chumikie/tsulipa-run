const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const sql = fs.readFileSync(path.join(root, 'supabase/migrations/20261102014635_grupos_nacionais.sql'), 'utf8');
const catalog = html.match(/var PERF_GRUPOS = (\[[\s\S]*?\]);/);
assert.ok(catalog, 'catálogo local disponível mesmo antes da migração');
const groups = vm.runInNewContext(catalog[1]);
const byCode = Object.fromEntries(groups.map(g => [g.codigo, g]));

test('BRS48 e SKU48 têm times independentes, inclusive KKS compartilhado', () => {
  assert.deepEqual(Array.from(byCode.BRS48.times, t => t.codigo), ['B', 'R', 'S', 'KKS']);
  assert.deepEqual(Array.from(byCode.SKU48.times, t => t.codigo), ['S', 'K', 'U', 'KKS']);
  assert.equal(byCode.BRS48.pais, 'BR');
  assert.equal(byCode.SKU48.pais, 'TH');
  assert.notEqual(byCode.BRS48.times, byCode.SKU48.times);
});

test('interface preserva escolha legada e limpa divisão na troca de grupo', () => {
  assert.match(html, /function perfGrupoCodigo\(d\)\{ return d && d\.grupo \|\| 'BRS48'; \}/);
  assert.match(html, /if\(e\.target\.id!=='perfBioGrupo'\)return/);
  assert.match(html, /sel\.innerHTML='<option value="">'/);
  assert.match(html, /perfGrupoCodigo\(p\)===gp\[0\]/);
});

test('chamada antiga e novas RPCs são preservadas com checagem de erro', () => {
  assert.match(html, /contaRpc\('salvar_grupo_estilo'/);
  assert.match(html, /contaRpc\('salvar_bio'/);
  assert.match(html, /if\(!re\|\|!re\.ok\)throw/);
  assert.match(sql, /auth\.uid\(\) is null/);
  assert.match(sql, /where id=auth\.uid\(\)/);
  assert.match(sql, /revoke all on function public\.salvar_grupo\(text,text\) from public, anon/);
  assert.match(sql, /grant execute on function public\.salvar_grupo\(text,text\) to authenticated/);
  assert.match(sql, /grant execute on function public\.salvar_grupo_estilo\(text,text,text,text\) to authenticated/);
  assert.match(sql, /create or replace function public\.salvar_estilo\(p_emoji text, p_cor text, p_time text\)/);
});

test('migração aditiva não mexe em saves, economia ou rankings', () => {
  assert.match(sql, /add column grupo text references/);
  assert.match(sql, /create policy grupos_publicos_ler/);
  assert.doesNotMatch(sql, /drop table|truncate|delete from public\.players/i);
  assert.match(sql, /update public\.players set grupo=g, time=t, updated_at=now\(\) where id=auth\.uid\(\)/);
  assert.doesNotMatch(sql, /brs48cr_/i);
});
