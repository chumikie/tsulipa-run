'use strict';
// Toques nas ruas: só enfeite local (sem RPC, sem localStorage) e portas continuam com prioridade.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const src = fs.readFileSync(path.join(__dirname, '..', 'tw-mapa.js'), 'utf8');
const ini = src.indexOf('/* ---------- Vida e toques nas ruas'), fim = src.indexOf('var ESCALA_RUA=');
assert.ok(ini > 0 && fim > ini, 'bloco de vida das ruas existe');
const bloco = src.slice(ini, fim);
assert.doesNotMatch(bloco, /contaRpc|localStorage|fetch\(/, 'toques não salvam nem enviam nada');
assert.match(src, /var l=achar\(e\);\n\s*if\(!l\)\{if\(cena!=='mundo'\)\{var pm=pontoMapa\(e\);tocarRua\(pm\.x,pm\.y\);\}return;\}/, 'porta tocada abre o lugar; só o resto vira brincadeira');
for (const b of ['borboleta', 'gato', 'passaro']) assert.ok(bloco.includes("'" + b + "'"), b);
assert.match(bloco, /ida:reduzMov\?\.01:/, 'movimento reduzido: o Idol não atravessa a rua animado');
assert.match(bloco, /if\(p\.dono&&meuPasseio\)|passeioDoToque/, 'o seu Idol atende ao toque');
assert.match(src, /if\(p\.dono&&meuPasseio\)q=passeioDoToque\(q,tm\);/);
console.log('mapa-toques ok');

const vm=require('node:vm');
const tentar={hidden:true};
const env={sec:{querySelector:()=>tentar},destino:'praca',cena:'praca',
  imagens:{},CENAS_RUA:{praca:'praca.svg',arena:'arena.svg'},window:{},lang:()=>'pt',
  Image:class {},desenhar(){},centralizar(){}};
const carregar=src.slice(src.indexOf('    var tentar=sec&&'),src.indexOf('    textos();atualizarVitrine();recadoRosa();',src.indexOf('    var tentar=sec&&')));
vm.runInNewContext('(function(destino){'+carregar+'})(destino)',env);
const primeira=env.arte;
primeira.onerror();
assert.equal(tentar.hidden,false);
vm.runInNewContext('(function(destino){'+carregar+'})(destino)',env);
assert.notEqual(env.arte,primeira);
assert.equal(tentar.hidden,true);
env.cena=env.destino='arena';
const anterior=env.arte;
vm.runInNewContext('(function(destino){'+carregar+'})(destino)',env);
anterior.onerror();
assert.equal(tentar.hidden,true,'falha de outra rua não interrompe a rua atual');
