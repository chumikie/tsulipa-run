/* Conferência #130, sem servidor real: node tests/passatempos-refino.browser.cjs [pasta-de-imagens].
   Usa Playwright. Em ambiente com Remotion instalado, TW_BROWSER_RUNTIME aponta para @remotion/renderer;
   CHROME_BIN permite escolher o executável. A rede externa é bloqueada e as recompensas são simuladas. */
'use strict';
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=process.argv[2]||path.join(os.tmpdir(),'tsulipa-passatempos-qa');fs.mkdirSync(out,{recursive:true});
const server=http.createServer((req,res)=>{const f=path.resolve(root,decodeURIComponent(new URL(req.url,'http://local').pathname.slice(1)||'index.html'));if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(f,(err,b)=>{if(err){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json'})[path.extname(f)]||'application/octet-stream');res.end(b);});});
let browser,context;
async function setup(){
 if(process.env.TW_BROWSER_RUNTIME){
   browser=await require(process.env.TW_BROWSER_RUNTIME).openBrowser('chrome',{browserExecutable:process.env.CHROME_BIN});
   const page=await browser.newPage({context:null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:()=>{},onLog:()=>{}});
   return {page,cdp:async(m,a)=>(await page._client().send(m,a)).value,go:url=>page.goto({url,timeout:20000}),init:f=>page.evaluateOnNewDocument(f),close:()=>browser.close({silent:true})};
 }
 browser=await require('playwright').chromium.launch({headless:true,...(process.env.CHROME_BIN?{executablePath:process.env.CHROME_BIN}:{})});
 context=await browser.newContext();const page=await context.newPage(),session=await context.newCDPSession(page);
 return {page,cdp:(m,a)=>session.send(m,a),go:url=>page.goto(url,{waitUntil:'load'}),init:f=>page.addInitScript(f),close:()=>browser.close()};
}
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const qa=await setup(),p=qa.page;
 try{
  await qa.cdp('Network.enable',{});await qa.cdp('Network.setBlockedURLs',{urls:['*supabase.co*','*cdn.jsdelivr.net*','*googleapis.com*','*gstatic.com*','*youtube.com*','*vercel-insights*']});
  await qa.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await qa.init(()=>{window.__errors=[];window.addEventListener('error',e=>__errors.push(e.message));window.alert=()=>{};window.confirm=()=>true;localStorage.setItem('brs48cr_tut','1');});
  await qa.go('http://127.0.0.1:'+server.address().port+'/?celular=1');
  await p.evaluate(()=>{
    window.__rpc=[];window.contaJ={nick:'QA',id:'qa-local'};
    window.contaRpc=(n,a)=>{__rpc.push([n,a]);return Promise.resolve(n==='passatempo_feito'?{ok:true,pago:true,stars:5,premio:5}:[]);};
    window.__abrir=k=>{const b=document.createElement('button');b.dataset.twpa=k;document.body.appendChild(b);b.click();b.remove();};
    window.__assert=(v,m)=>{if(!v)throw Error(m);};
  });
  const foto=async nome=>{const s=await qa.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(path.join(out,nome+'.png'),Buffer.from(s.data,'base64'));};
  for(const width of [320,390,1440,1906]){
    await p.setViewportSize?.({width,height:920});if(!p.setViewportSize)await p.setViewport({width,height:920,deviceScaleFactor:1});
    await p.evaluate(()=>{document.querySelector('[data-twpa-x]')?.click();hubComecou=true;TW_CELULAR.ligar();document.querySelector('#hub').hidden=false;const b=document.createElement('button');b.dataset.v='trio';document.querySelector('#twCel').appendChild(b);b.click();b.remove();});
    await p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
    for(let tab=0;tab<3;tab++){
      await p.evaluate(tab=>document.querySelector('[data-trioaba="'+tab+'"]').click(),tab);
      const boxes=await p.evaluate(()=>{const a=document.querySelector('.twc-f2').getBoundingClientRect(),h=document.querySelector('.twc-f2-palco').getBoundingClientRect(),n=document.querySelector('.twc-f2-nome').getBoundingClientRect(),i=document.querySelector('.twc-ficha-idol').getBoundingClientRect();return {a:a.toJSON(),h:h.toJSON(),n:n.toJSON(),i:i.toJSON(),overflow:document.documentElement.scrollWidth>innerWidth};});
      assert.ok(Math.abs(boxes.h.width-(boxes.a.width-6))<2,'fundo da ficha cobre a largura inteira');
      assert.ok(boxes.n.right<=boxes.a.right+1 && boxes.i.left>=boxes.a.left,'nome e Idol cabem na ficha');assert.equal(boxes.overflow,false);
    }
    await foto('fichas-'+width);
    await p.evaluate(()=>__abrir('colorir'));
    const pintura=await p.evaluate(()=>{
      const cv=document.querySelector('.twpa-colorir'),antes=cv.toDataURL(),av=JSON.stringify(hubAv()),g0=g,s0=state,frame0=frame,rect=cv.getBoundingClientRect();
      function toque(){const e={bubbles:true,clientX:rect.left+rect.width*.5,clientY:rect.top+rect.height*.45};cv.dispatchEvent(new PointerEvent('pointerdown',e));cv.dispatchEvent(new PointerEvent('pointerup',e));}
      const white=cv.getContext('2d').getImageData(0,0,1,1).data.join(',');toque();const pintou=cv.toDataURL()!==antes;const bg=cv.getContext('2d').getImageData(0,0,1,1).data.join(',');document.querySelector('[data-twpa-desfazer]').click();const undo=cv.toDataURL()===antes;
      toque();document.querySelector('[data-twpa-limpar]').click();const clean=cv.toDataURL()===antes;document.querySelector('[data-twpa-desfazer]').click();const undoClear=cv.toDataURL()!==antes;
      const oldClick=HTMLAnchorElement.prototype.click;let exportada='';HTMLAnchorElement.prototype.click=function(){exportada=this.href;};try{document.querySelector('[data-twpa-salvar]').click();}finally{HTMLAnchorElement.prototype.click=oldClick;}
      return {pintou,undo,clean,undoClear,bg: bg===white,immutable:av===JSON.stringify(hubAv())&&g===g0&&state===s0&&frame===frame0,png:exportada.startsWith('data:image/png'),calls:__rpc.filter(x=>x[0]==='passatempo_feito').length};
    });
    for(const k of ['pintou','undo','clean','undoClear','bg','immutable','png'])assert.equal(pintura[k],true,k+' em '+width);assert.equal(pintura.calls,0,'pintura não envia recompensa');
    await foto('colorir-'+width);
    await p.evaluate(()=>document.querySelector('[data-twpa-x]').click());
  }
  // As três partidas completas: sorteio e UI reais, somente RPC simulado.
  console.log(await p.evaluate(async()=>{
    __abrir('caca');const C=TW_PASSA._montarCaca();for(const w of C.palavras){document.querySelector('[data-pc="'+w.cel[0]+'"]').click();document.querySelector('[data-pc="'+w.cel[w.cel.length-1]+'"]').click();}await Promise.resolve();__assert(document.querySelector('.twpa-status').textContent.includes('Conseguiu'),'caça não concluiu');
    __abrir('dif');const D=TW_PASSA._montarDif(),B=document.querySelector('[data-difb]'),r=B.getBoundingClientRect();
    for(const d of D.dif)B.dispatchEvent(new PointerEvent('pointerup',{clientX:r.left+d.x/D.W*r.width,clientY:r.top+d.y/D.H*r.height}));await Promise.resolve();__assert(document.querySelector('.twpa-status').textContent.includes('Conseguiu'),'diferenças não concluiu');
    __abrir('lab');const M=TW_PASSA._montarLab(),fila=[0],anterior={0:null},dirs=[[-9,0,'ArrowUp'],[1,1,'ArrowRight'],[9,2,'ArrowDown'],[-1,3,'ArrowLeft']];
    for(let j=0;j<fila.length;j++){const a=fila[j];for(const [delta,parede,key]of dirs)if(!M.P[a][parede]&&!Object.hasOwn(anterior,a+delta)){anterior[a+delta]=[a,key];fila.push(a+delta);}}
    let atual=M.fim,caminho=[];while(atual){const [p,k]=anterior[atual];caminho.unshift(k);atual=p;}
    for(const k of caminho)document.querySelector('[data-twpa-seta="'+k+'"]').click();await Promise.resolve();__assert(document.querySelector('.twpa-status').textContent.includes('Conseguiu'),'labirinto não concluiu');
    const calls=__rpc.filter(x=>x[0]==='passatempo_feito').map(x=>x[1].p_tipo);__assert(calls.length===3&&new Set(calls).size===3,'recompensa repetida');
    return {palavras:C.palavras.length,diferencas:D.dif.length,passos:caminho.length,recompensas:calls};
  }));
  for(const k of ['caca','dif','lab']){await p.evaluate(k=>__abrir(k),k);await foto(k);}
  for(const theme of ['light','dark']){
    await p.evaluate(theme=>{document.documentElement.dataset.theme=theme;__abrir('caca');},theme);
    await foto('caca-'+theme);
  }
  for(const lang of ['pt','en','es','id','th','ja']){
    const rotulo=await p.evaluate(lang=>{LANG=lang;__abrir('colorir');const cv=document.querySelector('.twpa-colorir');cv.focus();cv.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));const parte=document.querySelector('.twpa-status').textContent;cv.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true}));return {title:document.querySelector('#twpaTit').textContent,parte,undo:!document.querySelector('[data-twpa-desfazer]').disabled};},lang);
    assert.ok(rotulo.title.length>3&&rotulo.parte.length>5);assert.equal(rotulo.undo,true,'teclado em '+lang);
  }
  await p.evaluate(()=>{LANG='pt';});
  // Um avatar com figurino, coroa e cabelo arco-íris também precisa abrir e aceitar cores.
  await p.evaluate(()=>{const orig=hubAv;window.__hubAvOriginal=orig;hubAv=()=>({c:{...perfChar(orig()),hair:'#7b3ff0',skin:'#a76c40',front:'arcoiris',back:'longo',hat:'coroa',out:'zipper'},expr:2});__abrir('colorir');__assert(document.querySelector('.twpa-colorir'),'avatar personalizado sem desenho');});
  await foto('colorir-figurino');
  await p.evaluate(()=>{hubAv=__hubAvOriginal;TW_PASSA.contaMudou();__assert(document.querySelector('.twpa-ov').hidden,'troca de conta manteve atividade aberta');});
  // Perfil: emoji livre salvo, vitrine em escala correta e seções sob demanda.
  console.log(await p.evaluate(async()=>{
    await perfTelaCarregar();
    const rpc=contaRpc;
    contaRpc=(n,a)=>n==='minha_vitrine'?Promise.resolve({vitrine:{card:'QA',insignia:'halloween',musica:'Zipper'},vitrine_card:{nick:'QA',best:9000,avatar:hubAv()}}):rpc(n,a);
    perfAtual={nick:'QA',emoji:'🎙️',cor:'#9b30d9',best:0,insignias:[],cards:[],visuais:[],time:'S',grupo:'BRS48',frase:'Teste'};perfMeu=true;perfAba='perfil';perfOv.hidden=false;perfMontar();
    await new Promise(r=>setTimeout(r,100));
    __assert(document.querySelector('#perfAbaCorpo .twp-vitrine'),'vitrine fora da aba');
    __assert(document.querySelector('#twpVitCard').width>=360,'card ainda em resolução recortada');
    const e=document.querySelector('[data-pemo="🎙️"]');__assert(e&&e.getAttribute('aria-pressed')==='true','emoji livre não selecionado');
    const completo=TW_CONQ.completo({completo:{foto:true,emoji:false,cor:true,frase:true,oshi:true,aniver:true,destaque:true}});__assert(completo.pct===100,'perfil salvo perdeu o emoji livre');
    const input=document.querySelector('#perfBioEmoji');input.value='🪷';input.dispatchEvent(new Event('input',{bubbles:true}));__assert(document.querySelector('[data-pemo="🪷"][aria-pressed="true"]'),'digitação livre não refletida');
    return {emoji:true,vitrine:true,secoes:document.querySelectorAll('.perf-secao').length};
  }));
  await foto('perfil-refinado');
  for(const width of [320,390]){
    if(p.setViewportSize)await p.setViewportSize({width,height:920});else await p.setViewport({width,height:920,deviceScaleFactor:1});
    const overflow=await p.evaluate(()=>{const box=document.querySelector('#perfCorpo'),v=box.querySelector('.twp-vitrine');return v.getBoundingClientRect().right>box.getBoundingClientRect().right+1;});assert.equal(overflow,false,'vitrine mobile');await foto('perfil-'+width);
  }
  if(p.setViewportSize)await p.setViewportSize({width:1440,height:1000});else await p.setViewport({width:1440,height:1000,deviceScaleFactor:1});
  await p.evaluate(()=>{perfAba='montar';perfAbaMostrar();});
  assert.equal(await p.evaluate(()=>!!document.querySelector('.twp-vitrine')),false,'vitrine sai da aba de edição');
  // Missões: título único no novo layout, sem remover o título do hub clássico.
  await p.evaluate(()=>{perfOv.hidden=true;const b=document.createElement('button');b.dataset.a='missoes';document.querySelector('#twCel').appendChild(b);b.click();b.remove();});
  assert.equal(await p.evaluate(()=>getComputedStyle(document.querySelector('#hubMisT')).display),'none');
  await p.evaluate(()=>{const rpc=contaRpc;contaRpc=(n,a)=>n==='jardim_estado'?Promise.resolve({ok:true,canteiros:[],sementes:[],flores:[],stars:5}):rpc(n,a);bloomAbrir();});
  await p.evaluate(()=>new Promise(r=>setTimeout(r,150)));
  await foto('bloom-cerca');
  const studioSource=fs.readFileSync(path.join(root,'studio.js'),'utf8');
  const grip=studioSource.slice(studioSource.indexOf('  function objetoNaMao('),studioSource.indexOf('  function cena(',studioSource.indexOf('  function objetoNaMao(')));
  await p.evaluate(code=>{
    document.querySelector('#bloomX').click();const grip=Function('arranjoFlores','return '+code)(()=>[]);
    const cv=document.createElement('canvas');cv.width=720;cv.height=900;cv.style.cssText='position:fixed;z-index:1000;top:0;left:0;width:720px;background:white';document.body.appendChild(cv);
    const x=cv.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,720,900);
    ['v','tchau','coracao'].forEach((pose,j)=>['microfone','lightstick','flor_sakura'].forEach((item,i)=>{x.save();x.translate(i*240,j*300);const av=JSON.parse(JSON.stringify(hubAv()));av.pose=pose;const corpo=perfDesenharIdol(x,240,270,av,false,false,0,'inteiro');grip(x,item,pose,corpo,'#9b30d9','inteiro');x.fillStyle='#38265e';x.font='14px sans-serif';x.textAlign='center';x.fillText(pose+' · '+item,120,288);x.restore();}));window.__gripCanvas=cv;
  },grip);
  await foto('studio-maos');await p.evaluate(()=>__gripCanvas.remove());
  assert.deepEqual(await p.evaluate(()=>__errors),[],'JavaScript sem erros');
  console.log('OK: pintura/desfazer/limpar/PNG, fundo e avatar preservados; fichas em 4 larguras; 3 partidas completas; nenhum servidor real.');
 }finally{await qa.close();server.close();}
})().then(()=>process.exit(0)).catch(e=>{console.error(e);server.close();process.exit(1);});
