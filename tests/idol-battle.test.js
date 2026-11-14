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
// Show no palco: só encena o resultado pronto; respeita "reduzir movimento" e permite pular.
assert.match(src,/data-battle="pular"/);
assert.match(src,/prefers-reduced-motion/);
assert.match(src,/function fimDoShow\(/);
assert.ok(!/Math\.random/.test(src),'o cliente não sorteia nada');
// Top da Arena: leitura opcional; proposta de SQL só lê, sem prêmio e sem expor ids.
const rankSql=fs.readFileSync(path.join(root,'supabase/sql/aplicado/20261114_idol_battle_ranking.sql'),'utf8');
assert.match(src,/contaRpc\('battle_ranking'\)/);
assert.match(rankSql,/create or replace function public\.battle_ranking\(\) returns jsonb/i);
assert.match(rankSql,/language sql stable security definer set search_path to ''/i);
assert.match(rankSql,/revoke all on function public\.battle_ranking\(\) from public,anon/i);
assert.ok(!/insert into|update public|delete from|stars/i.test(rankSql),'ranking é só leitura');
assert.match(fs.readFileSync(path.join(root,'jornal.js'),'utf8'),/Array\.isArray\(d\.arena\)/);
// Arena dos Idols (v2): proposta sem ★; o cliente só envia nick do alvo, a própria unit e o UUID.
const arenaSql=fs.readFileSync(path.join(root,'supabase/sql/aplicado/20261114_idol_battle_v2_arena.sql'),'utf8');
assert.match(src,/contaRpc\('battle_arena'\)/);
assert.match(src,/contaRpc\('battle_desafiar',\{p_alvo:desafiado\.nick,p_unit:unit\.slice\(\),p_requisicao:requisicao\}\)/);
assert.match(src,/contaRpc\('battle_unit_salvar',\{p_unit:unit\.slice\(\)\}\)/);
assert.ok(!/stars|star_log/i.test(arenaSql),'a arena nunca mexe em estrelas');
assert.match(arenaSql,/unique \(desafiante,alvo,dia\)/i);
assert.match(arenaSql,/v_feitos>=3/);
assert.match(arenaSql,/enable row level security/i);
for(const f of ['battle_unit_salvar\\(jsonb\\)','battle_arena\\(\\)','battle_desafiar\\(text,jsonb,uuid\\)'])
  assert.match(arenaSql,new RegExp('revoke all on function public\\.'+f+' from public,anon','i'));
assert.match(arenaSql,/revoke all on function private\.battle_unit_resolver\(uuid,jsonb\) from public,anon,authenticated/i);
// Torcida de flores (v3): proposta; substitui battle_jogar/battle_desafiar por cópias inteiras + bônus.
const torSql=fs.readFileSync(path.join(root,'supabase/sql/proposta/20261114_idol_battle_v3_torcida_REVIEW_ONLY.sql'),'utf8');
assert.match(src,/contaRpc\('battle_torcida'\)/);assert.match(src,/contaRpc\('battle_torcida_levar',\{p_flor:k\}\)/);
assert.ok(!/stars\s*=\s*stars\s*\+\s*(?!5\b)/.test(torSql),'a torcida não cria prêmio novo');
assert.equal((torSql.match(/stars=stars\+5/g)||[]).length,1,'só o prêmio já existente do rival do dia');
assert.match(torSql,/primary key \(player_id,dia\)/i);
// as cópias das funções aplicadas só podem diferir nas linhas da torcida
const semTorcida=t=>t.split('\n').filter(l=>!/v_tor|v_bonus|-- v3:/.test(l)).join('\n');
const corpo=(t,n)=>{const i=t.indexOf('create or replace function public.'+n);return t.slice(i,t.indexOf('end $fn$;',i));};
const v2Sql=fs.readFileSync(path.join(root,'supabase/sql/aplicado/20261114_idol_battle_v2_arena.sql'),'utf8');
for(const [orig,n] of [[sql,'battle_jogar('],[v2Sql,'battle_desafiar(']]){
  const a=semTorcida(corpo(orig,n)).split('\n'),b=semTorcida(corpo(torSql,n)).split('\n');
  assert.equal(b.length,a.length-3,n+' mantém as mesmas linhas fora as 3 reescritas');
  assert.ok(b.every(l=>a.includes(l)),n+' não muda nenhuma outra linha');
}
console.log('OK: Battle v1 — treino seguro, 6 idiomas, contrato RPC, limites e acesso pelo mapa');
