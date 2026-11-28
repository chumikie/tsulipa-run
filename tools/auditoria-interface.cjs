'use strict';
// Auditoria de interface (Clean UI, 28/11/2026): NODE_PATH=…/node_modules node tools/auditoria-interface.cjs RAIZ SAIDA [rapido|i18n]  (SO=tela1,tela2 limita as telas)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);fs.mkdirSync(out,{recursive:true});
const FALSO=fs.readFileSync(path.join(root,'tests/telas.browser.cjs'),'utf8').match(/const FALSO=`([\s\S]*?)`;/)[1];
const server=http.createServer((req,res)=>{const n=decodeURIComponent(new URL(req.url,'http://l').pathname.slice(1))||'index.html';const f=path.resolve(root,n);if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(f,(e,d)=>{if(e){res.writeHead(404).end();return;}res.writeHead(200,{'content-type':{'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.mp3':'audio/mpeg'}[path.extname(f)]||'application/octet-stream'});res.end(d);});});
const TELAS_TODAS=[['inicio',[]],['jogos',[['v','jogos']]],['trio',[['v','trio']]],['ajustes',[['v','ajustes']]],['cal',[['v','cal']]],['news',[['a','news']]],['nov',[['n','menu'],['a','menuMais'],['a','nov']]],['album',[['n','menu'],['a','album']]],['mapa',[['a','mapa']]],['missoes',[['n','menu'],['a','menuMais'],['a','missoes']]],
 ['perfil',[['ir','perfil']]],['loja',[['ir','loja']]],['pet',[['ir','pet']]],
 ...['run','karaoke','sora','gacha','battle','duo','cafe','handshake','studio','bloom'].map(k=>['jogo-'+k,[['v','jogos'],['ir',k]]])];
const TELAS=process.env.SO?TELAS_TODAS.filter(t=>process.env.SO.split(',').includes(t[0])):TELAS_TODAS;
const CONTA=new Set(['album','perfil','loja','pet','jogo-gacha','jogo-battle','jogo-duo','jogo-studio','jogo-bloom','jogo-cafe','jogo-handshake']);
const MEDIR=()=>{
  const W=innerWidth,H=innerHeight,vis=e=>{const r=e.getBoundingClientRect();if(r.width<1||r.height<1)return null;const s=getComputedStyle(e);if(s.visibility==='hidden'||s.display==='none')return null;if(r.bottom<0||r.top>H||r.right<0||r.left>W)return null;return r;};
  const ov=document.documentElement.scrollWidth>W+1||document.body.scrollWidth>W+1;
  const largos=[];document.querySelectorAll('body *').forEach(e=>{const r=vis(e);if(!r)return;if(r.right>W+2){let p=e.parentElement,rola=false;while(p){const s=getComputedStyle(p);if(/(auto|scroll|hidden)/.test(s.overflowX)){rola=true;break;}p=p.parentElement;}if(!rola)largos.push((e.id?'#'+e.id:e.className&&typeof e.className==='string'?'.'+e.className.split(' ')[0]:e.tagName)+' →'+Math.round(r.right-W)+'px');}});
  const pequenos=[];document.querySelectorAll('button,a[href],summary,[role=button],[data-a],[data-v],[data-ir],select,input:not([type=hidden]),[onclick]').forEach(e=>{const r=vis(e);if(!r)return;const t=e.elementFromPoint?null:null;const topo=document.elementFromPoint(Math.min(W-1,Math.max(0,r.x+r.width/2)),Math.min(H-1,Math.max(0,r.y+r.height/2)));if(!topo||!(e.contains(topo)||topo.contains(e)))return;if(r.width<32||r.height<32)pequenos.push(((e.getAttribute('aria-label')||e.innerText||e.title||e.className||e.tagName)+'').trim().slice(0,28)+' '+Math.round(r.width)+'×'+Math.round(r.height));});
  const apagados=[];const vistos=new Set();document.querySelectorAll('body *').forEach(e=>{if(!e.childNodes.length)return;let t='';e.childNodes.forEach(n=>{if(n.nodeType===3)t+=n.textContent;});t=t.trim();if(t.length<3)return;const r=vis(e);if(!r)return;let op=1,p=e;while(p&&p!==document.documentElement){op*=+getComputedStyle(p).opacity;p=p.parentElement;}const c=getComputedStyle(e).color.match(/[\d.]+/g)||[];const a=c.length>3?+c[3]:1;if(op*a<0.55&&!vistos.has(t)){vistos.add(t);apagados.push(t.slice(0,32)+' ('+(op*a).toFixed(2)+')');}});
  const titulos={};document.querySelectorAll('h1,h2,h3,h4,[class*=titulo],[class*=title]').forEach(e=>{if(!vis(e))return;const t=e.innerText.trim().toLowerCase();if(t&&t.length<40)titulos[t]=(titulos[t]||0)+1;});
  const repetidos=Object.entries(titulos).filter(([t,n])=>n>1).map(([t,n])=>t+' ×'+n);
  const cartoes=[...document.querySelectorAll('body *')].filter(e=>{const r=vis(e);if(!r||r.width<60||r.height<30)return false;const s=getComputedStyle(e);return parseFloat(s.borderTopWidth)>0&&parseFloat(s.borderRadius)>4&&s.boxShadow!=='none';}).length;
  const textos=[];const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=tw.nextNode()){const t=n.textContent.trim();if(t.length<3)continue;const e=n.parentElement;if(!e||!vis(e))continue;textos.push(t);}
  return {ov,largos:largos.slice(0,6),pequenos:[...new Set(pequenos)].slice(0,12),apagados:apagados.slice(0,10),repetidos,cartoes,textos:[...new Set(textos)]};
};
(async()=>{await new Promise(o=>server.listen(0,'127.0.0.1',o));const base='http://127.0.0.1:'+server.address().port;
const b=await chromium.launch();const rel={};
const VIEWS=[['iphone390',{viewport:{width:390,height:844},deviceScaleFactor:3,isMobile:true,hasTouch:true}],['iphone320',{viewport:{width:320,height:640},deviceScaleFactor:2,isMobile:true,hasTouch:true}],['desktop',{viewport:{width:1440,height:900}}]];
const LANGS=process.argv[4]==='rapido'?['pt']:['pt','en','es','id','ja','th'];const SAIDA=process.argv[4]==='i18n'?'i18n.json':'relatorio.json';
async function sessao(nome,opc,lang,tema,shots){
  const ctx=await b.newContext({...opc,colorScheme:tema});await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
  const p=await ctx.newPage();const erros=[];p.on('pageerror',e=>erros.push(String(e.message).slice(0,140)));p.on('console',m=>{if(m.type()==='error'&&!/net::ERR|Failed to load resource/.test(m.text()))erros.push('console: '+m.text().slice(0,140));});
  await p.addInitScript(l=>{try{localStorage.setItem('brs48cr_lang',l);localStorage.setItem('brs48cr_celular','1');localStorage.setItem('tw_cel_tut_v1','1');localStorage.setItem('tw_index2_tut_v2','1');}catch(e){}
    window.__longas=0;try{new PerformanceObserver(o=>{o.getEntries().forEach(e=>{if(e.duration>50)window.__longas++;});}).observe({type:'longtask',buffered:true});}catch(e){}},lang);
  const res={};
  for(const [tela,passos] of TELAS){
    try{
      const t0=Date.now();await p.goto(base+'/index.html?lang='+lang,{waitUntil:'load'});await p.waitForFunction(()=>!!window.TW_CELULAR,null,{timeout:15000});
      const carga=Date.now()-t0;
      await p.addScriptTag({content:FALSO});await p.evaluate(id=>{__instalarFalso();contaJ=id?{id:'qa',nick:'Idol QA'}:null;contaAuthUserId=id?'qa':'';},CONTA.has(tela));
      for(const sel of ['[data-f="manutTentar"]','[data-a="comecar"]','[data-f="tutPular"]']){const x=p.locator(sel+':visible').first();if(await x.isVisible().catch(()=>false))await x.click().catch(()=>{});}
      await p.locator('#twcTela .twc-inicio').waitFor({state:'visible',timeout:10000});
      for(const [t,v] of passos){const ok=await p.evaluate(([t,v])=>{const e=[...document.querySelectorAll('[data-'+t+'="'+v+'"]')].find(x=>x.offsetParent)||document.querySelector('[data-'+t+'="'+v+'"]');if(!e)return false;e.click();return true;},[t,v]);if(!ok)throw Error('sem botão '+t+'='+v);await p.waitForTimeout(700);}
      await p.waitForTimeout(600);
      const m=await p.evaluate(MEDIR);m.carga=carga;m.longas=await p.evaluate(()=>window.__longas);
      if(shots)await p.screenshot({path:path.join(out,nome+'-'+tema+'-'+lang+'-'+tela+'.png')});
      res[tela]=m;
    }catch(e){res[tela]={falhou:String(e.message).slice(0,160)};}
  }
  res.__erros=[...new Set(erros)];await ctx.close();return res;
}
if(process.argv[4]!=='i18n')for(const [nome,opc] of VIEWS)for(const tema of ['light','dark']){rel[nome+'-'+tema]=await sessao(nome,opc,'pt',tema,true);console.log('feito',nome,tema);}
for(const l of LANGS.filter(x=>x!=='pt')){rel['i18n-'+l]=await sessao('iphone390',VIEWS[0][1],l,'light',false);console.log('feito idioma',l);}
fs.writeFileSync(path.join(out,SAIDA),JSON.stringify(rel,null,1));await b.close();server.close();})().catch(e=>{console.error(e);process.exit(1);});
