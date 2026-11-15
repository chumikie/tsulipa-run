'use strict';
// Bichinhos do mapa: gato (malhado/smoking) com coleira, pisca e dorme; passarinhos e borboletas com contorno; koi na fonte.
const assert=require('assert'),fs=require('fs'),path=require('path');
const js=fs.readFileSync(path.join(__dirname,'..','tw-mapa.js'),'utf8');
assert.ok(/var GATOS=\{harajuku:\{/.test(js)&&/palco:\{pelo:'#3b3346'/.test(js),'dois gatos diferentes');
assert.ok(/function gatoDesenhar\(tm,gx,gy,pt,noite,perto\)/.test(js),'gato em função própria');
assert.ok(/pisca=!reduzMov&&!dormindo/.test(js)&&/orelha=!reduzMov&&!dormindo/.test(js),'pisca e mexe a orelha, respeitando reduzir movimento');
assert.ok(/function peixesFonte\(tm\)/.test(js)&&/if\(cena==='praca'\)peixesFonte\(tm\)/.test(js),'koi só na Praça');
assert.ok(/pulos\['gato'\]=tm;somMapa\('toque'\);if\(!reduzMov\)toques\.push/.test(js),'toque no gato solta corações');
assert.ok(!/drawImage\(|\.src\s*=\s*['"]http/.test(js.slice(js.indexOf('var GATOS'),js.indexOf('function desenharToques'))),'arte desenhada no canvas, sem imagem de fora');
assert.ok(/var CHAO=\{arena:'cachorro',fofo:'coelho',praca:'pombo',ceu:'ovelha'\}/.test(js)&&/function cachorroDesenhar\(/.test(js)&&/function coelhoDesenhar\(/.test(js),'cachorrinho na Arena e coelhinho na Vila');
assert.ok(/desenharChao\(tm\);andar\(tm\)/.test(js),'bichinhos de chão ficam atrás dos Idols');
assert.ok(/function meuIdolPerto\(x,raio\)/.test(js)&&/meuIdolPerto\(gx0,130\)/.test(js),'reagem ao seu Idol chegando perto');
assert.ok(/pulos\[ch\]=tm/.test(js),'toque nos bichinhos de chão');
assert.ok(/function pomboDesenhar\(/.test(js)&&/function ovelhaDesenhar\(/.test(js)&&/function andarilho\(/.test(js),'pombinho na Praça e ovelhinha no Céu');
console.log('OK: bichinhos do mapa refinados');
