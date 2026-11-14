// Cliente VIP do Café: 6ª e 11ª clientes; treino dobra localmente; modo verificado deixa o servidor dobrar.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const raiz=path.join(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'cafe-vip.js'),'utf8');
const ctx={console,Math,Date,LANG:'pt',cf:null,cfT:0,document:{getElementById:()=>null}};ctx.window=ctx;
ctx.cfNovoClienteLocal=function(){ctx.cf.cli={nome:'Mimi',pedido:{}};ctx.cf.fase='pedido';};
ctx.cfServir=function(){ctx.cf.ok=true;ctx.cf.pontos+=150;ctx.cf.atendidos++;};
ctx.cfDesenhar=function(){};ctx.cfUI=function(){};
vm.createContext(ctx);vm.runInContext(src,ctx);
const vips=[];for(let n=0;n<12;n++){ctx.cf={atendidos:n,pontos:0};ctx.cfNovoClienteLocal();if(ctx.cf.cli.vip)vips.push(n+1);}
assert.deepEqual(vips,[6,11],'VIP só na 6ª e na 11ª');
ctx.cf={atendidos:5,pontos:1000};ctx.cfNovoClienteLocal();assert.ok(['Tsu','Lirika','Pati'].includes(ctx.cf.cli.nome));
ctx.cfServir(false);assert.equal(ctx.cf.pontos,1300,'treino: o pedido VIP vale o dobro (150 → 300)');
ctx.cf={atendidos:5,pontos:1000,servidor:{rodada:6},modoServidor:'novo'};ctx.cfNovoClienteLocal();ctx.cfServir(false);
assert.equal(ctx.cf.pontos,1150,'verificado: o cliente não dobra (quem dobra é o servidor)');
const sql=fs.readFileSync(path.join(raiz,fs.existsSync(path.join(raiz,'supabase/sql/aplicado/20261113_cafe_vip.sql'))?'supabase/sql/aplicado/20261113_cafe_vip.sql':'supabase/sql/proposta/20261113_cafe_vip.sql'),'utf8');
assert.match(sql,/etapa IN \(6,11\)/,'mesmas rodadas no servidor');
console.log('OK: cliente VIP do Café (rodadas 6 e 11, dobro no treino, servidor no verificado)');
