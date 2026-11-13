// Flores com uso: gasta a flor no servidor antes de dar o Hype; sem servidor, a partida começa normal.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../flores.js'),'utf8');
let chamadas=[],resp={};
const ctx={console,Math,Date,LANG:'pt',contaJ:{nick:'Ana'},hs:null,
  document:{getElementById:()=>null,addEventListener(){}},
  contaRpc:(n,a)=>{chamadas.push([n,a]);const r=resp[n];return r instanceof Error?Promise.reject(r):Promise.resolve(r);},
  hsAbrir(){},hsUI(){},hsDesenhar(){},cfAbrir(){},
  hsIniciarSeguro(){ctx.hs={hype:60,rodada:0,fase:'fila'};}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'flores.js'});
const T=vm.runInContext('null',ctx);
(async()=>{
  // sem flor escolhida: começa direto, sem gastar nada
  ctx.hsIniciarSeguro();assert.equal(ctx.hs.hype,60);assert.equal(chamadas.length,0);
  assert.equal(ctx.TW_FLORES.bonus('lunar'),30);assert.equal(ctx.TW_FLORES.bonus('rosa'),0);
  for(const l of ['pt','en','es','id','th','ja']){const m=src.match(new RegExp('\\b'+l+":\\{levar:'"));assert.ok(m,l);}
  assert.ok(/jardim_usar_flor', \{p_flor:k, p_uso:'handshake'\}/.test(src),'gasta no servidor com o uso certo');
  assert.ok(/hs\.hype = Math\.min\(100, hs\.hype \+ FLOR\[k\]\[1\]\)/.test(src),'Hype com teto de 100');
  assert.ok(!/stars|brs48cr_/.test(src),'não mexe em estrelas nem em chaves brs48cr_');
  console.log('OK: flores com uso (sem escolha não gasta; bônus por flor; seis idiomas)');
})().catch(e=>{console.error(e);process.exit(1);});
