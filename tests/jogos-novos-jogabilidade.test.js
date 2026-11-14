'use strict';
// Jogabilidade dos jogos novos: tudo local e visual; nada de RPC novo nem mudança de prêmio.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ler = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const bloom = ler('bloom.js'), cafe = ler('cafe.js'), duplo = ler('cafe-duplo.js'), battle = ler('battle.js'), studio = ler('studio.js');
// Jardim: a planta cresce da altura de antes até a nova depois da rega (sem animação com movimento reduzido).
assert.match(bloom, /function crescer\(i\)\{ if\(window\.matchMedia && matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches\) return;/);
assert.match(bloom, /planta\(x, cx, by - 16, regasNaTela\(i, c\), tm, 1\.22\)/);
// Café: a mesma barra de paciência (mesmo tempo), agora com cor, rostinho e rótulo acessível — nos dois modos.
assert.match(cafe, /function cfPacienciaUI\(bar, pc, emo\)/);
assert.match(cafe, /role="progressbar" aria-label="' \+ escHtml\(tr\('Paciência do cliente'\)\)/);
assert.match(duplo, /cfPacienciaUI\(bar, pc, \$\('cfPacEmo' \+ e\.lado\)\)/);
// Battle: lightsticks no ritmo só no show e só como contador local.
const ini = battle.indexOf('function agitar(){'), fim = battle.indexOf('function ritmoDesenhar(');
assert.ok(ini > 0 && fim > ini);
assert.doesNotMatch(battle.slice(ini, fim), /contaRpc|localStorage|rodadas\[/, 'agitar não mexe no placar nem salva');
assert.match(battle, /texto\+=ritmoResultado\(\);/);
for (const l of ['pt', 'en', 'es', 'id', 'th', 'ja']) assert.match(battle, new RegExp('\\n? ?' + l + ":\\['📣"));
// Studio: tema da semana muda aos domingos e só marca selo no mural.
assert.match(studio, /function temaSemana\(\)\{ var sem = Math\.floor\(\(Date\.now\(\) - Date\.UTC\(2026, 10, 1, 3\)\) \/ 6048e5\);/);
assert.match(studio, /noTema\(m\.escolhas\) \? '<em class="stselo">/);
for (const f of [bloom, battle, studio]) assert.doesNotMatch(f, /contaRpc\('(jardim_crescer|battle_ritmo|studio_tema)/);
console.log('jogos novos: jogabilidade ok');
