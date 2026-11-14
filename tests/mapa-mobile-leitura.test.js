'use strict';
// Regressão leve, sem Chromium: tamanho de alvos + tradução na primeira abertura.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const map=fs.readFileSync(path.join(root,'tw-mapa.js'),'utf8');
const css=fs.readFileSync(path.join(root,'hub-polish.css'),'utf8');
const fragment=map.slice(map.indexOf("atalhos.innerHTML=Object.keys(BAIRROS)"),
 map.indexOf("var marcar=function(e)"));
assert.match(fragment,/data-tw-rotulo/,'atalhos possuem marcador para re-tradução');
assert.match(fragment,/rotulo\(id\)/,'rótulos traduzidos na primeira montagem');
assert.match(map,/el\.textContent=rotulo\(el\.getAttribute\('data-tw-rotulo'\)\)/,
  'atualização do idioma preservada ao retornar ao mapa');
const marker=css.indexOf('Mapa Vivo⭐ — lote pequeno de legibilidade e toque móvel');
assert.ok(marker>0);
const styles=css.slice(marker);
assert.match(styles,/@media\(max-width:760px\)/);
assert.match(styles,/tw-mapa-bairros button\s*\{[^}]*min-height:52px/s);
assert.match(styles,/tw-mapa-zoom\s*\{[^}]*min-height:48px/s);
assert.match(styles,/tw-mapa-botao:focus-visible/);
assert.match(styles,/@media\(max-width:360px\)/);
assert.doesNotMatch(styles,/display:none|transform:scale|touch-action|animation:|transition:/,
 'preserva mapa, toque nativo e animações existentes');
console.log('OK mapa móvel: atalhos traduzidos, foco visível e alvos 48–52px');
