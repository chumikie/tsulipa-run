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

// Os nove jogos ficam em ordem alfabética na grade e no HTML (Center⭐Run! antes, em linha inteira).
{const novos=fs.readFileSync(path.join(__dirname,'..','hub-novos.js'),'utf8');
 assert.ok(novos.includes("var ORDEM = ['bloom','handshake','cafe','battle','karaoke','duo','studio','sora','gacha'];"),'ordem alfabética dos jogos');
 assert.ok(novos.includes('cards(); ordenar();'),'reordena depois de criar os cards novos');}

// Battle e Studio têm treino sem conta: no clássico também abrem sem cadeado (igual ao visual do celular).
{const idx=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
 assert.equal((idx.match(/card\.dataset\.twnovo === 'battle' \|\| card\.dataset\.twnovo === 'studio'/g)||[]).length,2,'cadeado e clique liberam Battle e Studio para visitante');}

// O destaque encaminha o toque ao cartão atual, inclusive depois de o Hub ser remontado.
{
  const elements = new Map(), opened = [];
  let highlighted, daily;
  const cards = {
    querySelector(selector) {
      if (selector === '.hubcard.tw-alert-pink') return highlighted;
      if (!highlighted) return null;
      const {ir, twnovo} = highlighted.dataset;
      return (ir && selector === '[data-ir="'+ir+'"]') ||
        (twnovo && selector === '[data-twnovo="'+twnovo+'"]') ? highlighted : null;
    }
  };
  const document = {
    readyState:'loading', addEventListener(){},
    querySelector:s => s === '#hubHoje .hubenc' ? daily : null,
    getElementById:id => elements.get(id),
    createElement:() => ({dataset:{},addEventListener(type, fn){ this[type] = fn; }})
  };
  elements.set('hubCards',cards);
  elements.set('hubHoje',{parentNode:{insertBefore(el){ elements.set(el.id,el); }}});
  const world = {document, hubCardsUI(){}, setInterval(){}, LANG:'pt'};
  world.window = world;
  vm.runInNewContext(fs.readFileSync(path.join(raiz,'hub-layout.js'),'utf8'),world);
  function target(dataset,name){
    return {dataset,textContent:name,querySelector:()=>null,querySelectorAll:()=>[],click:()=>opened.push(name)};
  }
  daily = target({},'encontro');
  for(const entry of [target({ir:'cafe'},'café'),target({twnovo:'bloom'},'jardim'),null]){
    highlighted = entry;
    world.hubCardsUI();
    elements.get('twDestaque').click();
  }
  assert.deepEqual(opened,['café','jardim','encontro']);
}
