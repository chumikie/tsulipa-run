'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const karaoke=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const sora=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
const day=fs.readFileSync(path.join(root,'karaoke-day.html'),'utf8');
const source=fs.readFileSync(path.join(root,'tw-avatar-hair.js'),'utf8');
const cuts=['onduladom','onduladom2','onduladof'];
for(const [name,html] of [['Center Run / Perfil',index],['Karaoke',karaoke]]){
 assert(html.includes('<script src="./tw-avatar-hair.js?v=5"></script>'),name+' loads original 2D hair');
 for(const hook of ['back','top','fringe','bicolor'])assert(html.includes('TWAvatarHair.'+hook+'('),name+' retains '+hook+' render layer');
 assert(html.includes("b==='onduladof'?9:14"),name+' keeps female waves above Pixie length');
 assert(html.includes("b==='onduladom'||b==='onduladom2'?7"),name+' keeps male waves short');
}
for(const cut of cuts)assert(index.includes('value="'+cut+'"'),'hair menu retains '+cut);
assert(index.includes("['cback', 'back'], ['cfront', 'front'], ['cdet', 'det']]"),'Profile editor reuses haircut selector');
assert(index.includes("PERF_CAMPOS = ['hair', 'hair2', 'streak', 'skin', 'eye', 'back'"),'Profile saves back haircut');
assert(karaoke.includes("JSON.parse(read('brs48cr_cu2')"),'Karaoke imports saved Idol look');
assert(source.includes("var PRETO_TOPO='#3a3644',PRETO_BASE='#121018'"),'curto bicolor: metade fixa em preto');
assert(!/onduladom2[\s\S]*hair2/.test(source.split('bicolor:function')[1]||''),'curto bicolor não depende da cor da mecha');
assert(!source.includes('strokeStyle'),'repicado sem riscos brancos sobre o rosto');
assert(source.includes('g.arc(x+15,y+12,14,Math.PI,0)')&&source.includes('// laterais curvas'),'ondulado curto arredondado em volta da cabeça');
for(const label of ['data-twh="Ondulado">Ondulado<','data-twh="Bicolor">Bicolor<','data-twh="Repicado">Repicado<'])assert(index.includes(label),'menu de corte mostra '+label);
for(const v of ['ondulada','risca','repicada'])assert(index.includes('<option value="'+v+'" data-twh='),'menu de franja oferece '+v);
for(const [name,html] of [['Center Run / Perfil',index],['Karaoke',karaoke]])assert(html.includes('if(TWAvatarHair.fringe(g,x,y,b,f,T)){}'),name+': franja depende da escolha de franja, não do corte');
assert(source.includes("Risca:'Side part'")&&source.includes("option[data-twh]"),'nomes curtos traduzidos pelo módulo');
for(const [name,html] of [['Center Run / Perfil',index],['Karaoke',karaoke]]){
 assert(html.includes('if(c.streak)TWAvatarHair.mecha(g,c,x,y,f);')&&!html.includes('g.fillRect(x+10,y+5,3,10)'),name+': mecha acompanha a franja (sem o ladrilho fixo)');
 assert(html.includes("else if(b==='rabo'){var rs=sw*.5;g.beginPath()"),name+': rabo de cavalo em uma peça, preso no alto');
 assert(html.includes("else if(b==='marias'){E(x+1,y+8,4,4);E(x+29,y+8,4,4)"),name+': marias presas no alto da cabeça');
}
assert(index.includes('data-twh="Rebelde">Rebelde<'),'franja ondulada aparece como Rebelde');
assert(source.includes("if(f==='arcoiris'){arcoiris(g,x,y,T);return true;}")&&source.includes('function arcoiris(g,x,y,T)'),'arco-íris desenhado como mechas com degradê, não blocos');
for(const f of ['bagunca','reta','lateral','espetada','arcoiris','ondulada','risca','repicada'])assert(new RegExp('\\b'+f+':\\[').test(source),'mecha definida para a franja '+f);
const sandbox={window:{}};vm.runInNewContext(source,sandbox,{timeout:1000});
const hair=sandbox.window.TWAvatarHair;
let ops=[];const grad={addColorStop(){}};
const g=new Proxy({}, {get(obj,key){if(key==='createLinearGradient')return ()=>grad;if(key in obj)return obj[key];return (...args)=>ops.push([key,...args]);},set(obj,key,value){obj[key]=value;return true;}});
const E=(...args)=>ops.push(['E',...args]);
const T=(...args)=>ops.push(['T',...args]);
for(const cut of cuts){
 ops=[];const c={hair:'#335577',hair2:'#aabbcc'};
 assert.equal(hair.isWavy(cut),true);
 assert.equal(hair.back(g,c,0,0,cut,E,T),true);
 hair.top(g,0,0,cut);{const n=ops.length;hair.mecha(g,{hair2:'#ffffff'},0,0,'risca');assert(ops.length>n,'mecha desenha um fio');}assert.equal(hair.fringe(g,0,0,cut,'bagunca',T),false,cut+' mantém a franja original escolhida');hair.bicolor(g,{hair:'#335577',hair2:'#aabbcc',front:'reta'},0,0,cut);
 assert(ops.length>5,cut+' draws wave details');
 if(cut==='onduladom2'){assert(ops.some(op=>op[0]==='rect'),cut+' recorta a metade preta');assert.equal(ops.filter(op=>op[0]==='clip').length>=2,true,cut+' mantém a metade preta dentro da cabeça');}
 for(const fr of ['ondulada','risca','repicada']){ops=[];assert.equal(hair.fringe(g,0,0,cut,fr,T),true,fr+' é desenhada pelo módulo');assert(ops.length>0);}
}
assert.equal(hair.isWavy('chanel'),false);
assert.equal(hair.back(g,{hair:'#fff'},0,0,'chanel',E,T),false);
{let o=[];const gg=new Proxy({}, {get(obj,k){if(k==='createLinearGradient')return ()=>({addColorStop(){}});if(k in obj)return obj[k];return (...a)=>o.push(k);},set(obj,k,v){obj[k]=v;return true;}});assert.equal(hair.fringe(gg,0,0,'',"arcoiris",(...a)=>o.push('T')),true);assert(o.filter(k=>k==='T').length>=12,'arco-íris tem 6 mechas e brilhos');}

 // Sora Jump has an independent drawChar renderer. Its player character and
 // partner sprites must use the same shared base/top/fringe layers as Profile
 // and Karaoke, rather than silently falling back to the old duplicated hair.
 assert(sora.includes('<script src="./tw-avatar-hair.js?v=5"></script>'),'Sora Jump loads the shared hair renderer');
 const soraDrawStart=sora.indexOf('function drawChar(c,x,y,run,expr,isPartner){');
 const soraDrawEnd=sora.indexOf('\nfunction ',soraDrawStart+20);
 assert(soraDrawStart>=0&&soraDrawEnd>soraDrawStart,'Sora Jump drawChar renderer exists');
 const soraDraw=sora.slice(soraDrawStart,soraDrawEnd);
 assert(soraDraw.includes("if (isPartner) { OF = 0; A = ''; }"),'Sora partner branch keeps its own character identity');
 for(const hook of [
  'TWAvatarHair.back(g,c,x,y,b,E,T)',
  'TWAvatarHair.isWavy(b)',
  'TWAvatarHair.top(g,x,y,b)',
  'TWAvatarHair.fringe(g,x,y,b,f,T)',
  'TWAvatarHair.bicolor(g,c,x,y,b)',
  'TWAvatarHair.mecha(g,c,x,y,f)'
 ])assert(soraDraw.includes(hook),'Sora Jump shares hair layer '+hook);
 assert(sora.includes('drawChar(soraGetActiveCharacter(),'),'Sora Jump uses the active saved player character');
 assert(sora.includes('drawChar(CH[u.charIndex] || CH[0],-15,-10,0,0,true)'),'Sora Jump partners use the same shared drawChar path');


 // Karaoke Day is still a reachable preview/controller renderer. Preserve its
 // legacy hair fallback while routing the new base/top/fringe layers through
 // the shared module, just like the main profile, Karaoke Time and Sora.
 assert(day.includes('<script src="./tw-avatar-hair.js?v=5"></script>'),'Karaoke Day loads the shared hair module');
 const dayDrawStart=day.indexOf('function desenharIdol(x,c,px,py,sc,pose,expr,t,espelho,opcoes){');
 const dayDrawEnd=day.indexOf('\nfunction ',dayDrawStart+20);
 assert(dayDrawStart>=0&&dayDrawEnd>dayDrawStart,'Karaoke Day has an independent Idol renderer');
 const dayDraw=day.slice(dayDrawStart,dayDrawEnd);
 for(const hook of [
  'TWAvatarHair.back(x,c,0,0,b,E,T)',
  'TWAvatarHair.isWavy(b)',
  'TWAvatarHair.top(x,0,0,b)',
  'TWAvatarHair.fringe(x,0,0,b,f,T)',
  'TWAvatarHair.bicolor(x,c,0,0,b)',
  'TWAvatarHair.mecha(x,c,0,0,f)'
 ])assert(dayDraw.includes(hook),'Karaoke Day shares hair layer '+hook);
 for(const oldCut of ["b==='chanel'","b==='longo'","b==='marias'","b==='rabo'","b==='pixie'","b==='cacheado'"])
  assert(dayDraw.includes(oldCut),'Karaoke Day preserves legacy hair fallback '+oldCut);
 assert(day.includes("localStorage.getItem('brs48cr_cu2')")&&day.includes('function meuChar()'),'Karaoke Day retains the saved custom Idol look path');

console.log('✓ Cortes extras (ondulado curto, curto bicolor, repicado): camadas 2D, valores salvos e paridade com o Karaoke');
