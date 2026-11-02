'use strict';
// Moderação: a admin monta o Idol de um membro (visual completo). Sem a função nova no banco, cai no ajuste só de roupa.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/admin_montar_idol.sql'),'utf8');
assert(html.includes("contaRpc('admin_idol_info', { p_nick: alvoVisual })")&&html.includes("admVisualRoupa(f, alvoVisual)"),'tenta o editor completo e tem reserva só de roupa');
assert(html.includes("contaRpc('admin_montar_idol',{p_nick:inick,p_c:admIdol.c,"),'salva pelo RPC novo');
for(const k of ['hair','hair2','eye','skin','outcol','back','front','mecha','det','gl','hat','out'])assert(new RegExp('\\b'+k+':').test(html.slice(html.indexOf('admIdol={nick'),html.indexOf('admIdol={nick')+600)),'campo '+k+' no editor');
assert(html.includes("return (+o.getAttribute('data-r')||0)<=best;")&&html.includes("owned.indexOf('det_coelho')>=0"),'acessórios pelo recorde e coelho só comprado');
assert(/eh_admin\(\)/.test(sql)&&/REVOKE ALL ON FUNCTION public\.admin_montar_idol\(text, jsonb, text\) FROM PUBLIC, anon;/.test(sql),'SQL restrito à admin');
assert(/NÃO APLICAR SEM AUTORIZAÇÃO/.test(sql),'SQL marcado como proposta');
assert(html.includes('id="admIdolPng"')&&html.includes("a.download='tsulipa-idol-'")&&html.includes("if(e.target.closest&&e.target.closest('#admIdolPng')){admIdolPng();return;}"),'câmera baixa o PNG do Idol montado');
assert(html.includes('id="admRoupaPng"')&&html.includes("if(e.target.closest&&e.target.closest('#admRoupaPng')){admRoupaPng();return;}"),'câmera também no ajuste só de roupa');
console.log('✓ Moderação: montar o Idol de um membro (editor, regras e SQL proposto)');
