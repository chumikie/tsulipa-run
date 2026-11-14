// Gorjeta visível do Happy⭐Cafe!: só visual, calcula como o jogo (rapidez), não mexe em pontos.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../cafe-gorjeta.js'),'utf8');
let desenhou=0,textos=[];
const ctx2={save(){},restore(){},strokeText(){},fillText(s){textos.push(s);},beginPath(){},arc(){},fill(){},set font(v){},set fillStyle(v){},set strokeStyle(v){},set lineWidth(v){},set globalAlpha(v){},set textAlign(v){}};
const ctx={console,Math,LANG:'pt',cfT:100,cf:null,cfPaciencia:()=>200,beep(){},
  document:{getElementById:()=>({width:900,height:500,getContext:()=>ctx2})},matchMedia:()=>({matches:false})};
ctx.window=ctx;
ctx.cfServir=function(saiu){ctx.cf.pontos=(ctx.cf.pontos||0)+1;ctx.cf.fase='reacao';};
ctx.cfDesenhar=function(){desenhou++;};
vm.createContext(ctx);vm.runInContext(src,ctx);
ctx.cf={fase:'pedido',t0:50,cli:{pedido:{base:1,cob:-1,enf:2,doce:-1}},monta:{base:1,cob:-1,enf:2,doce:-1}};
ctx.cfServir(false);
assert.equal(ctx.cf.pontos,1,'o serviço original roda uma vez, pontos intocados');
ctx.cfT=110;ctx.cfDesenhar();
assert.equal(desenhou,1);
assert.ok(textos.some(s=>/Gorjeta \+75/.test(s)),'gorjeta = 100 × paciência que sobrou (75)');
textos=[];ctx.cf={fase:'pedido',t0:0,cli:{pedido:{base:1,cob:-1,enf:2,doce:-1}},monta:{base:0,cob:-1,enf:2,doce:-1}};
ctx.cfServir(false);ctx.cfT=300;ctx.cfDesenhar();
assert.ok(!textos.some(s=>/Gorjeta \+\d/.test(s)&&!/\+75/.test(s)),'pedido errado não dá gorjeta');
assert.ok(!/localStorage|contaRpc|stars/.test(src),'sem saves, servidor ou estrelas');
console.log('OK: gorjeta do Café só visual e no valor certo');
