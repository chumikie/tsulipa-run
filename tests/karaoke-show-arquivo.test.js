'use strict';
// Passo 4 do plano da #109 (17/11/2026): o show de ritmo mora em karaoke-show.js.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8'),show=fs.readFileSync(path.join(root,'karaoke-show.js'),'utf8');
const tag=html.search(/<script src="\.\/karaoke-show\.js\?v=\d+"><\/script>/),cria=html.indexOf('var kt=window.KaraokeShow.criar({');
assert(tag>0&&cria>tag,'karaoke-show.js carregado antes da sala criar o show');
assert(!html.includes('var kt=(function(){')&&!html.includes('function inputClock(')&&show.includes('window.KaraokeShow={criar:criar};'),'código do show num lugar só');
// Tudo que o show lê da sala é lido na hora (krUI, por exemplo, é trocado depois que o show é criado).
assert(/krUI:function\(\)\{return krUI;\}/.test(html)&&/muted:function\(\)\{return muted;\}/.test(html)&&/AC:function\(\)\{return AC;\}/.test(html),'dependências passadas como leitura na hora');
// O ajudante dos testes remonta o HTML antigo e falha se o show usar algo que a sala não passa.
assert(require('./karaoke-fonte.js')().includes('var kt=(function(){'),'remontagem do HTML antigo funciona');
console.log('✓ Karaoke: show de ritmo em karaoke-show.js, criado pela sala com dependências lidas na hora');
