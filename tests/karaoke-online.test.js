'use strict';
// Sala online de produção: usa a conta do site, nunca cria contas nem dá prêmios.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const js=fs.readFileSync(path.join(__dirname,'..','karaoke-online.js'),'utf8');
const game=fs.readFileSync(path.join(__dirname,'..','karaoke-day.html'),'utf8');
const sql=fs.readFileSync(path.join(__dirname,'..','supabase/sql/karaoke_sala_online_producao.sql'),'utf8');
assert(!js.includes('signInAnonymously'),'nunca cria conta anônima');
assert(!js.includes('turnstile'),'sem captcha: só contas do site');
assert(js.includes("rpc('karaoke_sala',")||js.includes("rpc('karaoke_sala'"),'usa a RPC de produção');
assert(js.includes("get('homol')==='1')return"),'não roda junto da homologação');
assert(js.includes("p_action:'leave'"),'libera a vaga ao fechar');
['pt','en','es','th','ja'].forEach(l=>assert(js.includes(l+':{tit:'),'textos em '+l));
assert(game.includes("'./karaoke-online.js?v=2'"),'jogo carrega o cliente online');
assert(sql.includes("revoke all on function public.karaoke_sala(text,uuid) from public, anon"),'anon sem acesso');
assert(sql.includes("if not public.eh_admin() then raise exception 'admin_only'"),'moderação só admin');
assert(!/stars|estrelas\s*=|ganhar_minijogo/.test(sql.replace(/--.*$/gm,'')),'sem prêmios');
console.log('✓ Karaoke online: conta do site, sem cadastro novo, sem prêmios');
