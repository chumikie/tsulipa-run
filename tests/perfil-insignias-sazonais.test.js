'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const perfil = fs.readFileSync(path.join(__dirname, '..', 'perfil.js'), 'utf8');
function recorte(inicio, fim) {
  const a = perfil.indexOf(inicio), b = perfil.indexOf(fim, a + inicio.length);
  assert.ok(a >= 0 && b > a, 'trecho do perfil encontrado: ' + inicio);
  return perfil.slice(a, b);
}
const ctx = {
  perfInsSel: '',
  tr: s => s,
  escHtml: s => String(s),
  temaAtual: () => 'natal',
  conqLista: () => ['jogo_memoria']
};
vm.createContext(ctx);
vm.runInContext(recorte('var PERF_INS = [', '// Oshi:'), ctx);
vm.runInContext(recorte('var perfInsTem = []', 'function perfDarCoracao()'), ctx);
function ids(html) {
  return [...html.matchAll(/data-ins="([^"]+)"/g)].map(m => m[1]);
}
function sazonaisNoFim(lista) {
  const primeiro = lista.findIndex(k => k.startsWith('tema_'));
  assert.ok(primeiro >= 0, 'ao menos uma insígnia sazonal presente');
  assert.ok(lista.slice(primeiro).every(k => k.startsWith('tema_')),
    'nenhuma insígnia comum, especial ou de jogo aparece após a primeira sazonal');
}
const publicas = ids(ctx.perfInsHtml(['tema_natal','tema_halloween','estreia','esp_evento','jogo_caderno'], false));
assert.deepEqual(publicas, ['estreia','esp_evento','jogo_caderno','tema_halloween','tema_natal']);
sazonaisNoFim(publicas);
const pessoais = ids(ctx.perfInsHtml(['estreia','tema_halloween'], true));
assert.ok(pessoais.includes('jogo_memoria'), 'conquistas locais continuam na estante pessoal');
assert.ok(pessoais.includes('tema_natal'), 'tema atual permanece visível, mesmo bloqueado');
sazonaisNoFim(pessoais);
console.log('✓ insígnias sazonais sempre no fim, sem ocultar as especiais ou conquistas dos jogos.');
