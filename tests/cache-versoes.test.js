// Todo arquivo .js/.css carregado pelo index.html precisa trocar a ?v= quando muda,
// senão o celular junta arquivo velho do cache com arquivo novo (e só melhora com F5).
const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');
test('arquivos alterados em relação à main trocam a versão de cache no index.html', (t) => {
  let base;
  try { base = execSync('git merge-base HEAD origin/main', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); } catch (e) { t.skip('sem origin/main neste checkout'); return; }
  const mudou = execSync('git diff --name-only ' + base + ' HEAD').toString().split('\n').filter(f => /^[^/]+\.(js|css)$/.test(f));
  const agora = fs.readFileSync('index.html', 'utf8');
  const antes = execSync('git show ' + base + ':index.html').toString();
  const v = (txt, f) => (txt.match(new RegExp(f.replace('.', '\\.') + '\\?v=(\\d+)')) || [])[1];
  for (const f of mudou) {
    const va = v(antes, f), vn = v(agora, f);
    if (va && vn) assert.notStrictEqual(vn, va, f + ' mudou mas continua com ?v=' + vn);
  }
});
