// Todo arquivo .js/.css carregado com ?v= precisa trocar a versão quando muda,
// senão o celular junta arquivo velho do cache com arquivo novo (e só melhora com F5).
// 19/11/2026: passou a olhar TODOS os lugares que carregam um arquivo com ?v= (não só o index.html):
// o karaoke-show.js é pedido pelo karaoke-time.html e o tw-bairro-tela.js pelo tw-bairro.js.
// Também compara com a main de verdade (origin/main), não com uma cópia velha: foi por isso que a #117
// passou com jornal.js, karaoke-show.js, pet.js e jornal.css alterados e a mesma versão.
const test = require('node:test');
const assert = require('node:assert');
const { execSync } = require('child_process');
const fs = require('fs');

function sh(c){ return execSync(c, { stdio: ['ignore', 'pipe', 'ignore'] }).toString(); }

test('arquivos alterados em relação à main trocam a versão de cache em todo lugar que os carrega', (t) => {
  let base;
  try { base = sh('git merge-base HEAD origin/main').trim(); } catch (e) { t.skip('sem origin/main neste checkout'); return; }
  const mudou = sh('git diff --name-only ' + base + ' HEAD').split('\n').filter(f => /^[^/]+\.(js|css)$/.test(f));
  const carregadores = sh('git ls-files').split('\n').filter(f => /^[^/]+\.(html|js)$/.test(f) && fs.existsSync(f));
  const erros = [];
  for (const f of mudou) {
    const re = new RegExp('(?:^|[^\\w.-])' + f.replace(/[.-]/g, '\\$&') + '\\?v=(\\d+)', 'g');
    for (const c of carregadores) {
      const agora = [...fs.readFileSync(c, 'utf8').matchAll(re)].map(m => m[1]);
      if (!agora.length) continue;
      let antes = [];
      try { antes = [...sh('git show ' + base + ':' + c).matchAll(re)].map(m => m[1]); } catch (e) { continue; }
      for (const v of agora) if (antes.includes(v)) erros.push(f + ' mudou mas ' + c + ' ainda pede ?v=' + v);
    }
  }
  assert.deepStrictEqual(erros, []);
});
