// Cards dos jogos novos no Hub: seis idiomas completos, só chama o que cada jogo já expõe e não cria RPC nem save.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const raiz=path.join(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'hub-novos.js'),'utf8');
let html='',abriu=[];const ouvintes={};
const box={querySelector:s=>html.includes(s.replace(/[\[\]"]/g,'').replace('data-twnovo=','data-twnovo="'))?{}:null,insertAdjacentHTML:(_,h)=>{html+=h;}};
const ctx={console,LANG:'pt',window:null,escHtml:s=>String(s),hubGameAbrir:n=>'Abrir '+n,
  document:{getElementById:id=>id==='hubCards'?box:null,addEventListener:(t,f)=>{ouvintes[t]=f;}},
  hubCardsUI(){html='';},bloomAbrir(){abriu.push('bloom');},studioAbrir(){abriu.push('studio');},battleAbrir(){abriu.push('battle');},
  bloomResumo:()=>({regar:2,colher:0})};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'hub-novos.js'});
const T=ctx.TW_HUB_NOVOS.txt;
assert.deepEqual(Object.keys(T).sort(),['en','es','id','ja','pt','th']);
for(const l in T)for(const k in T.pt)assert.ok(T[l][k]&&T[l][k].trim(),l+'.'+k);
ctx.hubCardsUI();
for(const k of ['bloom','studio','battle'])assert.ok(html.includes('data-twnovo="'+k+'"'),'card '+k);
assert.ok(/tw-hubnovo-bloom tw-alert-pink/.test(html)&&html.includes(T.pt.regar),'o card do jardim avisa a rega pendente');
assert.ok(!/tw-hubnovo-battle tw-alert-pink/.test(html));
ctx.hubCardsUI();assert.equal((html.match(/data-twnovo=/g)||[]).length,3,'não duplica ao redesenhar');
ouvintes.click({target:{closest:()=>({getAttribute:()=>'battle'})}});
assert.deepEqual(abriu,['battle']);
assert.ok(!/contaRpc|localStorage|_supabase/.test(src),'sem RPC, save ou acesso direto ao banco');
const idx=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
assert.ok(idx.indexOf('hub-novos.js')>idx.indexOf('battle.js?v=')&&idx.indexOf('hub-novos.js')>idx.indexOf('hub.js?v='),'carrega depois do hub e dos jogos');
console.log('OK: jogos novos no Hub — seis idiomas, três cards, aviso do jardim, sem RPC');
