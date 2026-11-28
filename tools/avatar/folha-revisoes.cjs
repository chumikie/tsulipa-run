// Folha de personagens por revisão (Identity Restoration, 27/11/2026): NODE_PATH=…/node_modules node tools/avatar/folha-revisoes.cjs RAIZ_DO_CHECKOUT PASTA_SAIDA
'use strict';
const {chromium}=require('playwright');
const fs=require('fs'),path=require('path'),http=require('http');
const root=path.resolve(process.argv[2]),out=path.resolve(process.argv[3]);
const server=http.createServer((req,res)=>{const n=decodeURIComponent(new URL(req.url,'http://l').pathname.slice(1))||'index.html';const f=path.resolve(root,n);
 if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.readFile(f,(e,d)=>{if(e){res.writeHead(404).end();return;}const t={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png'}[path.extname(f)]||'application/octet-stream';res.writeHead(200,{'content-type':t});res.end(d);});});
(async()=>{
 await new Promise(o=>server.listen(0,'127.0.0.1',o));const base='http://127.0.0.1:'+server.address().port;
 const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
 await ctx.route('**/*',r=>new URL(r.request().url()).origin===base?r.continue():r.abort());
 const p=await ctx.newPage();p.on('pageerror',e=>console.error('pageerror',String(e.message).slice(0,160)));
 await p.addInitScript(()=>{try{localStorage.setItem('brs48cr_celular','1');localStorage.setItem('tw_cel_tut_v1','1');}catch(e){}});
 await p.goto(base+'/index.html?lang=pt',{waitUntil:'domcontentloaded'});
 await p.waitForFunction(()=>typeof drawChar==='function'&&window.CH&&CH.length>=3&&window.TWAvatarRoupa,null,{timeout:20000});
 await p.waitForTimeout(800);
 const pngs=await p.evaluate(()=>{
  const clone=c=>JSON.parse(JSON.stringify(c));const ant=g,est=state,acc=accSel,fr=frame;const res={};
  function tela(w,h,fn){const cv=document.createElement('canvas');cv.width=w;cv.height=h;const x=cv.getContext('2d');x.fillStyle='#f6f1fb';x.fillRect(0,0,w,h);fn(x);return cv.toDataURL();}
  function frente(x,c,cx,cy,s,ex){x.save();x.translate(cx,cy);x.scale(s,s);g=x;state='menu';accSel='';drawChar(c,0,0,0,ex||0);x.restore();}
  function lado(x,c,cx,cy,s){if(!window.TW_LADO)return;x.save();x.translate(cx,cy);x.scale(s,s);try{if(TW_LADO.partes)TW_LADO.partes(x,c,0,0,0,0,null,'',{});else TW_LADO.desenhar(x,c,0,0);}catch(e){}x.restore();}
  try{frame=0;const S=6;
   res.trio=tela(6*48*S,64*S,x=>{for(let i=0;i<3;i++){frente(x,clone(CH[i]),(i*2)*48*S+8*S,12*S,S);lado(x,clone(CH[i]),(i*2+1)*48*S+8*S,12*S,S);}});
   const looks=['zipper','sweet','estrelado'];
   res.figurinos=tela(6*48*S,64*S,x=>{for(let i=0;i<3;i++){const c=clone(CH[i]);c.out=looks[i];c.baixo=i===2?'bermuda':'saia';frente(x,c,(i*2)*48*S+8*S,12*S,S);lado(x,c,(i*2+1)*48*S+8*S,12*S,S);}});
   const R=14;res.rostos=tela(3*40*R,30*R,x=>{for(let i=0;i<3;i++){x.save();x.beginPath();x.rect(i*40*R,0,40*R,30*R);x.clip();frente(x,clone(CH[i]),i*40*R+5*R,8*R,R);x.restore();}});
   res.expressoes=tela(3*4*13*3+40,60*3,x=>{for(let i=0;i<3;i++)for(let e=0;e<4;e++)frente(x,clone(CH[i]),10+i*(4*13*3+14)+e*13*3,12,3,e);});
   res.real=tela(3*60,70,x=>{for(let i=0;i<3;i++)frente(x,clone(CH[i]),10+i*58,10,1.6,0);});
   if(CH[3])res.voce=tela(2*48*S,64*S,x=>{frente(x,clone(CH[3]),8*S,12*S,S);lado(x,clone(CH[3]),48*S+8*S,12*S,S);});
  }finally{g=ant;state=est;accSel=acc;frame=fr;}
  return res;
 });
 fs.mkdirSync(out,{recursive:true});for(const k in pngs)fs.writeFileSync(path.join(out,k+'.png'),Buffer.from(pngs[k].split(',')[1],'base64'));
 await b.close();server.close();console.log('ok',out);
})().catch(e=>{console.error(e);process.exit(1);});
