// Bloom⭐Garden!: seis idiomas completos, só fala com as RPCs do jardim, fica "Em breve" sem servidor.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const raiz=path.join(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'bloom.js'),'utf8');
const chamadas=[];let resposta=null;
const ctx={console,Math,window:null,LANG:'pt',performance:{now:()=>0},
  document:{addEventListener(){},createElement:()=>({}),body:{appendChild(){}}},
  contaJ:null,contaRpc:(n,a)=>{chamadas.push(n);return resposta instanceof Error?Promise.reject(resposta):Promise.resolve(resposta);},
  hubCardsUI(){},contaUI(){}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'bloom.js'});
const T=ctx.BLOOM_TR;
assert.deepEqual(Object.keys(T).sort(),['en','es','id','ja','pt','th']);
for(const l in T)for(const k in T.pt){assert.ok(T[l][k]&&T[l][k].trim(),l+'.'+k);for(const ph of ['{n}','{m}','{f}'])if(T.pt[k].includes(ph))assert.ok(T[l][k].includes(ph),l+'.'+k+' '+ph);}
(async()=>{
  ctx.hubCardsUI();await new Promise(r=>setTimeout(r,5));
  assert.equal(chamadas.length,0,'sem conta não consulta o servidor');
  ctx.contaJ={nick:'Ana'};resposta=new Error('Could not find the function public.jardim_estado');
  ctx.hubCardsUI();await new Promise(r=>setTimeout(r,5));
  assert.equal(ctx.TW_BLOOM_ON,false,'sem a função no banco o jardim fica desligado (Em breve)');
  const rpcs=[...src.matchAll(/rpc\('([a-z_]+)'/g)].map(m=>m[1]),acoes=[...src.matchAll(/acao\('([a-z_]+)'/g)].map(m=>m[1]);
  assert.deepEqual([...new Set([...rpcs,...acoes])].sort(),['jardim_colher','jardim_estado','jardim_plantar','jardim_regar']);
  assert.ok(!/brs48cr_(?!st)/.test(src),'não cria chaves brs48cr_ novas');
  const sql=fs.readFileSync(path.join(raiz,'supabase/sql/aplicado/20261113_bloom_garden.sql'),'utf8');
  assert.ok(!/stars\s*=\s*stars\s*\+/.test(sql),'o jardim nunca dá ★ no servidor');
  console.log('OK: Bloom⭐Garden! — seis idiomas, só RPCs do jardim, desligado sem servidor');
})().catch(e=>{console.error(e);process.exit(1);});
