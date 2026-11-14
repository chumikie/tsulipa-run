'use strict';
// Charmaker: editor do "Você" em blocos (Penteado / Rosto / Roupa), paleta, sortear e desfazer.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const raiz = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(raiz, 'charmaker.js'), 'utf8');
const i = html.indexOf('<div class="cust" id="cust" hidden>'), f = html.indexOf('<div class="cust" id="cust_roupa">');
assert.ok(i > 0 && f > i, 'editor do Você antes do bloco de roupa');
const bloco = html.slice(i, f);
// Todos os campos de antes continuam com o mesmo id (a lógica de save é por id).
for (const id of ['chair', 'cback', 'cfront', 'cstk', 'cstr', 'cdet', 'skins', 'colho', 'csobr', 'ceye', 'cboca', 'cbochecha']) assert.ok(bloco.includes('id="' + id + '"'), id);
// Estilo Charat: prévia, expressões, abas e grade de miniaturas; os <select> ficam escondidos, mas existem.
for (const id of ['cmCv', 'cmExpr', 'cmAbas', 'cmGrade']) assert.ok(bloco.includes('id="' + id + '"'), id);
assert.equal((bloco.match(/<div class="cmlista" hidden>/g) || []).length, 2);
assert.match(js, /var PARTES = \[/);
for (const c of ['back', 'front', 'mecha', 'det', 'olho', 'sobrancelha', 'boca', 'bochecha']) assert.ok(js.includes("campo:'" + c + "'"), c);
assert.match(js, /b\.disabled = o\.disabled/, 'miniatura trancada fica desabilitada');
assert.ok(html.includes('<span>Roupa</span>'), 'título do bloco de roupa');
assert.ok(bloco.includes('id="custSortear"') && bloco.includes('id="custDesfazer" disabled'));
assert.ok(html.indexOf('charmaker.js?v=') > html.indexOf('hub-novos.js?v='), 'carrega depois do editor existir');
// Sortear nunca mexe na pele e respeita as trancas (só opções sem disabled).
assert.doesNotMatch(js, /skin/, 'pele não é sorteada');
assert.match(js, /!o\.disabled/);
assert.match(js, /anterior = JSON\.parse\(JSON\.stringify\(c\)\)/, 'desfazer guarda o visual anterior');
console.log('charmaker ok');
