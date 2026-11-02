'use strict';
// Regressão: o cache de curPal() calculava só 4 das 8 cores de cada paleta e o cenário da corrida ficava em branco.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const pick=re=>{const m=html.match(re);assert(m,'trecho não encontrado: '+re);return m[0];};
const src=[pick(/var PAL=\[[\s\S]*?\]\];/),pick(/function hx\([^)]*\)\{[^\n]*\}/),pick(/var PALR=[^\n]*/),pick(/var CURPAL_CACHE=[^\n]*/),pick(/function curPal\(\)\{[^\n]*\}/)].join('\n');
const ctx={frame:0};vm.createContext(ctx);vm.runInContext(src,ctx);
const size=vm.runInContext('PAL[0].length',ctx);
for(const frame of [0,1000,3000,3500,7199,14399]){
 ctx.frame=frame;const p=vm.runInContext('curPal().slice()',ctx);
 assert.equal(p.length,size,'curPal devolve todas as cores da paleta (frame '+frame+')');
 p.forEach((c,k)=>assert.match(c,/^rgb\(\d+,\d+,\d+\)$/,'cor '+k+' válida no frame '+frame));
}
assert(html.includes("P2[4].replace('rgb(','rgba(')"),'cidade distante continua usando a 5ª cor da paleta');
console.log('✓ Center Run: curPal entrega as',size,'cores da paleta do cenário');
