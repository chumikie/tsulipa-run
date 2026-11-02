'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const scene=html.slice(html.indexOf('function cenaCartazes(P2){'),html.indexOf('// ---------- Obstáculos da pista'));

test('outdoor SKU usa identidade laranja e construção Canvas 2D da placa BRS',()=>{
  assert.match(scene,/var sku = !jog && \(\(i % 15 \+ 15\) % 15 === 9\)/);
  assert.match(scene,/sku \? '#ffac71' : '#3c46ca'/);
  assert.match(scene,/sku \? '#ff9550' : '#262d8f'/);
  assert.match(scene,/sku \? 'SKU' : 'BRS'/);
  assert.match(scene,/g\.fillText\('48'/);
  assert.match(scene,/rr\(x - 3, y0 - 3, w \+ 6, h \+ 6, 7\)/);
});

test('BRS predomina 4:1 entre placas oficiais, sem substituir fotos de jogadores',()=>{
  const groups=Array.from({length:150},(_,i)=>{
    const jog= i%3!==0; // cenário com jogadores cadastrados
    return jog?'jogador':((i%15+15)%15===9?'SKU':'BRS');
  });
  assert.equal(groups.filter(x=>x==='SKU').length,10);
  assert.equal(groups.filter(x=>x==='BRS').length,40);
  assert.equal(groups.filter(x=>x==='jogador').length,100);
  assert.match(scene,/var jog = outdoorJog\.length && \(i % 3 !== 0\)/);
});

test('as placas não alteram recompensas, colisões, saves ou ranking',()=>{
  assert.doesNotMatch(scene,/localStorage|starT\s*[+\-]?=|rankI\s*=|update\(|contaRpc\(/);
  assert.match(scene,/var esp = 640, off = dist \* \.35/);
});
