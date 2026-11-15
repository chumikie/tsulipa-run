// Photo⭐Studio! v1: listas iguais às do servidor, seis idiomas, só RPCs do estúdio/jardim, sem upload.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const raiz=path.join(__dirname,'..'),js=fs.readFileSync(path.join(raiz,'studio.js'),'utf8');
const sqlF=['aplicado','proposta'].map(d=>path.join(raiz,'supabase/sql',d,'20261114_photo_studio.sql')).find(f=>fs.existsSync(f));
const sql=fs.readFileSync(sqlF,'utf8');
const lista=(nome)=>JSON.parse(js.match(new RegExp(nome+" = (\\[[^\\]]*\\])"))[1].replace(/'/g,'"'));
assert.deepEqual(lista('FUNDOS'),['rosa','cortina','nuvens','neon']);
for(const [n,arr] of [['FUNDOS',lista('FUNDOS')],['POSES',lista('POSES')],['LUZES',lista('LUZES')],['QUADROS',lista('QUADROS')]])
  assert.ok(sql.includes("array['"+arr.join("','")+"']")||sql.includes("in ('"+arr.join("','")+"')"),n+' igual no servidor');
const ctx={window:{},document:{addEventListener(){},createElement:()=>({})}};ctx.window=ctx;vm.createContext(ctx);vm.runInContext(js,ctx);
const T=ctx.STUDIO_TR;assert.deepEqual(Object.keys(T).sort(),['en','es','id','ja','pt','th']);
for(const l in T)for(const k in T.pt)assert.ok(T[l][k]&&String(T[l][k]).trim(),l+'.'+k);
const rpcs=[...new Set([...js.matchAll(/contaRpc\('([a-z_]+)'/g)].map(m=>m[1]))].sort();
assert.deepEqual(rpcs,['jardim_estado','studio_capa','studio_clique','studio_curtir','studio_mural','studio_pauta','studio_publicar']);
assert.ok(!/fetch\(|XMLHttpRequest|upload/i.test(js),'nenhuma imagem sai do aparelho');
assert.ok(!/stars\s*=\s*stars\s*\+\s*(?!5)/.test(sql)&&/stars=stars\+5/.test(sql),'prêmio de ★5 no servidor');
{ const fs2=require('fs'),path2=require('path');
  const tsql=fs2.readFileSync(path2.join(__dirname,'..','supabase','sql','aplicado','20261115_studio_tema_semana.sql'),'utf8');
  const blocoTemas=js.slice(js.indexOf('var TEMAS'), js.indexOf('];', js.indexOf('var TEMAS')));
  assert.deepEqual([...blocoTemas.matchAll(/\[\s*'([a-z]+)'/g)].map(m=>m[1]),['neon','ceu','sol','flores','palco','close','fofura'],'mesma ordem no site');
  assert.ok(/floor\(/.test(tsql)&&/2026-11-01 03:00:00\+00/.test(tsql),'semana arredondada para baixo, domingo 0h Brasília');
  assert.ok(/stars=stars\+3/.test(tsql)&&/'foto_tema'/.test(tsql)&&/on conflict do nothing/.test(tsql),'★3 uma vez por semana');
  assert.ok(/security definer/.test(tsql)&&/set search_path to ''/.test(tsql),'função segura');
  assert.ok(/premio_tema/.test(js),'site mostra o prêmio do tema'); }
console.log('OK: Photo⭐Studio! v1 (listas = servidor, 6 idiomas, sem upload)');
