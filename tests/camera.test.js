// Câmera no jeito do Center⭐Run! (23/11/2026): tw-camera.js e as três câmeras ligadas nela
'use strict';
const assert = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path');
const ler = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const cam = ler('tw-camera.js'), html = ler('index.html');
assert.match(html, /<script defer src="\.\/tw-camera\.js\?v=\d+"><\/script>/, 'index carrega tw-camera.js');
for (const l of ['pt', 'en', 'es', 'id', 'th', 'ja']) for (const k of ['moldura', 'quadro', 'salvar', 'fechar', 'perto']) assert.match(cam.split(k + ':{')[1] || '', new RegExp('^[^}]*' + l + ':'), k + ' em ' + l);
assert.match(cam, /window\.addEventListener\('keydown'[\s\S]*?stopImmediatePropagation[\s\S]*?\}, true\)/, 'Esc fecha só a câmera');
assert.match(cam, /Math\.max\(2, Math\.min\(3/, 'foto em 2× ou 3×');
assert.match(cam, /twMarcaPng/, 'Salvar leva o selo do site (e abre o compartilhar no celular)');
assert.match(cam, /lojaTem/, 'poses e expressões respeitam os cadeados da lojinha');
assert.match(ler('studio.js'), /TW_CAMERA\.abrir\(\{titulo:'Photo⭐Studio!'/);
assert.match(ler('duo-tela.js'), /t\.id === 'duoPng' && duoGu && window\.TW_CAMERA/);
assert.match(ler('duo.js'), /duoOff\.width = DUO_OW \* S/, 'o rascunho de cada Idol do Duo acompanha a escala');
assert.match(ler('tw-celular.js'), /TW_CAMERA\.abrir\(\{titulo:t2\('vip'\)/);
console.log('✓ câmera nova ligada no Studio, no Duo e no Camarim VIP');

// Preview and download must use the same signed PNG, even after changing frames.
const vm = require('node:vm');
const img = {}, link = {}, state = {};
const canvas = {toDataURL:()=> 'plain-png'};
let encodes = 0;
const scope = {st:state, montar:()=>canvas, ov:{querySelector:key=>key === '.twcam-img' ? img : link},
  window:{twMarcaPng:()=> 'signed-' + ++encodes}};
vm.runInNewContext(cam.slice(cam.indexOf('  function render()'),cam.indexOf('  function grupo(')),scope);
for(let n=1;n<=2;n++){
  assert.equal(scope.render(),true);
  assert.equal(img.src,'signed-'+n);
  assert.equal(img.src,link.href);
}
scope.montar=()=>{throw Error('canvas unavailable');};
assert.equal(scope.render(),false);
assert.equal(link.href,'signed-2');
