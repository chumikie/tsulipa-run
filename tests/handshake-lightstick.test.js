// Handshake: 2º detalhe (lightstick) e jeito que muda o tempo da apresentação.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const src=fs.readFileSync(path.join(__dirname,'../handshake.js'),'utf8');
const pedaco=src.slice(src.indexOf('var HS_CORES'),src.indexOf('function hsSorteio'));
const ctx={LANG:'pt'};vm.createContext(ctx);vm.runInContext(pedaco,ctx);
assert.equal(ctx.HS_CORES.length,6);
for(const l of ['pt','en','es','id','th','ja']){const t=ctx.HS_COR_TR[l];assert.ok(t,l);assert.equal(t.n.length,6,l);for(const k of ['l','q','ok'])assert.ok(t[k],l+k);}
assert.equal(ctx.hsTempoFila({jeito:'fofo'}),160);
assert.equal(ctx.hsTempoFila({jeito:'timido'}),130,'tímido se apresenta mais rápido');
assert.equal(ctx.hsTempoFila({jeito:'animado',cor:2}),220,'animado fica mais e o lightstick dá tempo extra');
assert.match(src,/hs\.rodada >= 2 && \(!hs\.servidor \|\| Array\.isArray\(coresServidor\)\)/,'servidor antigo (sem cores) não pergunta cor');
assert.match(src,/hs\.corEntrada\.cor = c/,'a cor vai junto da resposta para o servidor conferir');
console.log('OK: lightstick do Handshake (6 cores, 6 idiomas, jeito no tempo, compatível com servidor antigo)');
