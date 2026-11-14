// Idol⭐Battle! v1: frontend em treino e contrato seguro de RPC, sem conta nem banco.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'battle.js'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/aplicado/20261114_idol_battle_v1.sql'),'utf8');
const mapa=fs.readFileSync(path.join(root,'tw-mapa.js'),'utf8');
const ctx={window:{},document:{},LANG:'pt'};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx);
const tr=ctx.TW_BATTLE_TR;
assert.equal(ctx.TW_BATTLE_ON,true);
assert.equal(typeof ctx.battleAbrir,'function');
assert.deepEqual(Object.keys(tr).sort(),['en','es','id','ja','pt','th']);
for(const locale in tr)for(const key in tr.pt){
  assert.ok(typeof tr[locale][key]==='string'&&tr[locale][key].trim(),locale+'.'+key);
}
assert.match(src,/contaRpc\('battle_status'\)/);
assert.match(src,/contaRpc\('battle_jogar'/);
assert.match(src,/p_requisicao:requisicao/);
assert.match(src,/crypto.randomUUID/);
assert.match(src,/Treino sem prêmio/);
assert.ok(!/fetch\(|XMLHttpRequest|localStorage\.setItem\('[^']*battle/.test(src));
assert.match(sql,/create or replace function public\.battle_status\(\)/i);
assert.match(sql,/create or replace function public\.battle_jogar\(p_unit jsonb, p_requisicao uuid\)/i);
assert.match(sql,/unique \(player_id,requisicao\)/i);
assert.match(sql,/for update/i);
assert.match(sql,/coalesce\(bool_or|v_tentativas>=5/);
assert.match(sql,/premio=5/);
assert.match(sql,/star_log\(user_id,delta,reason\)/);
assert.match(sql,/enable row level security/i);
assert.match(sql,/revoke all on function public\.battle_jogar\(jsonb,uuid\) from public,anon/i);
assert.match(mapa,/if\(l\.battle\)\{window\.battleAbrir\(\);return;\}/);
assert.match(mapa,/function battleLigado\(/);
console.log('OK: Battle v1 — treino seguro, 6 idiomas, contrato RPC, limites e acesso pelo mapa');
