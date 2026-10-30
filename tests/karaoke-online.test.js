'use strict';
// Sala online de produção: usa a conta do site, nunca cria contas nem dá prêmios.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'..','karaoke-online.js'),'utf8');
const game=fs.readFileSync(path.join(__dirname,'..','karaoke-day.html'),'utf8');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase/sql/karaoke_sala_online_producao.sql'),'utf8');
assert(!js.includes('signInAnonymously'),'nunca cria conta anônima');
assert(!js.includes('turnstile'),'sem captcha: só contas do site');
assert(js.includes("rpc('karaoke_sala',")||js.includes("rpc('karaoke_sala'"),'usa a RPC de produção');
assert(js.includes("q.get('homol')==='1'||location.hostname!=='tsulipa-world.vercel.app'"),
 'cliente de produção só roda no domínio publicado');
assert(js.includes("p_action:'leave'"),'libera a vaga ao fechar');
['pt','en','es','th','ja'].forEach(l=>assert(js.includes(l+':{tit:'),'textos em '+l));
assert(game.includes("client.src=KR_HOMOLOGATION?'./karaoke-homol-client.js?v=8':'./karaoke-online.js?v=3'"),
 'prévia seleciona homologação automaticamente');
assert(game.includes("location.hostname!=='tsulipa-world.vercel.app'"),
 'páginas fora do domínio publicado nunca carregam o backend de produção');
assert(game.includes("'./karaoke-homol-view.js?v=2'"),'jogo carrega o modelo atualizado de palco');
assert(sql.includes("revoke all on function public.karaoke_sala(text,uuid) from public, anon"),'anon sem acesso');
assert(sql.includes('stage_x integer')&&sql.includes('stage_y integer')&&sql.includes('dance text not null'),
 'a sala guarda estado visual dos assentos');
assert(sql.includes("coalesce(p.look->'c',p.avatar->'c')"),'o elenco usa o look atual e recorre ao avatar salvo');
assert(sql.includes('create or replace function public.karaoke_sala_mover('),'movimento validado no servidor');
assert(sql.includes("coalesce(p_dance,'') not in ('','banzai','seis','neon','nyan','giro','pulo')"),
 'danças são allowlist no servidor');
assert(sql.includes('grant execute on function public.karaoke_sala_mover(uuid,integer,integer,text) to authenticated'),
 'RPC de movimento apenas para contas autenticadas');
assert(js.includes("rpc('karaoke_sala_mover'"),'cliente publica movimento ao servidor');
assert(game.includes('var syncedDance=p.dance||\'\';'),'homologation and production use server dance state');
assert(sql.includes("if not public.eh_admin() then raise exception 'admin_only'"),'moderação só admin');
assert(!/stars|estrelas\s*=|ganhar_minijogo/.test(sql.replace(/--.*$/gm,'')),'sem prêmios');
console.log('✓ Karaoke online: conta do site, sem cadastro novo, sem prêmios');
