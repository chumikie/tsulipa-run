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
console.log('OK: Photo⭐Studio! v1 (listas = servidor, 6 idiomas, sem upload)');
