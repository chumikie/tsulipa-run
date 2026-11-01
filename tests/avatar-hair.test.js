'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const karaoke=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const source=fs.readFileSync(path.join(root,'tw-avatar-hair.js'),'utf8');
const cuts=['onduladom','onduladom2','onduladof'];
for(const [name,html] of [['Center Run / Perfil',index],['Karaoke',karaoke]]){
 assert(html.includes('<script src="./tw-avatar-hair.js?v=4"></script>'),name+' loads original 2D hair');
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
console.log('✓ Cortes extras (ondulado curto, curto bicolor, repicado): camadas 2D, valores salvos e paridade com o Karaoke');
