'use strict';
// Cenas naturais só aproveitam avatares, lembranças e o ciclo Canvas existentes.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.join(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const src=read('vida-cidade.js');
const mapa=read('tw-mapa.js');
const pet=read('pet.js');
const ctx={console,Date,Intl,LANG:'pt',contaJ:{id:'idol-a',nick:'A'},document:{
  readyState:'loading',hidden:false,addEventListener(){},getElementById(){return null;}
}};
ctx.window=ctx;
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'vida-cidade.js'});
const vida=ctx.TWVidaCidade;
assert.equal(vida.sinalCena('fofo'),null,'sem atividades confirmadas não inventa lembranças');
assert.equal(vida.objetoCamarim(),null,'quarto começa sem novos objetos');
assert.equal(vida.registrar('bloom_colher',{flor:'sakura',id:'canteiro-1'}),true);
assert.equal(vida.sinalCena('fofo').tipo,'bloom_colher');
assert.equal(vida.sinalCena('harajuku'),null);
assert.equal(vida.objetoCamarim().tipo,'flor');
assert.equal(vida.objetoCamarim().flor,'sakura');
assert.equal(vida.registrar('studio_clique',{id:'dia-1'}),true);
assert.equal(vida.sinalCena('ceu').tipo,'studio_clique');
assert.equal(vida.objetoCamarim().tipo,'foto');
assert.deepEqual(Array.from(vida.objetosCamarim()).map(x=>x.tipo),['flor','foto'],
 'flor e foto devem coexistir na estante');
assert.match(vida.historiaHtml(),/dois pequenos momentos/);
assert.equal(vida.registrar('cafe',{id:'run-1'}),true);
assert.equal(vida.sinalCena('harajuku').tipo,'cafe');
assert.equal(vida.registrar('handshake',{id:'ses-1'}),true);
assert.equal(vida.sinalCena('palco').tipo,'handshake');
assert.match(vida.historiaHtml(),/pequena história/);
assert.equal(vida.registrar('battle',{id:'dia-1/1'}),true);
assert.equal(vida.sinalCena('arena').tipo,'battle');
assert.equal(vida.sinalCena('praca'),null,'nenhum evento falso na praça');
assert.equal(vida.sinalCena('inválido'),null);
assert.equal(vida.registrar('reencontro',{id:'fake',nome:'Nana',pres:0,conta:'A'}),false,
 'sem memória do Handshake, sem reencontro');
ctx.hsMemChave=()=> 'tw_hs_memorias_v1:idol-a';
ctx.hsMemLer=()=>[{nome:'Nana',pres:0,jeito:'timido',c:{hair:'#ff7eb6',skin:'#f1c9a5',out:'casual'}}];
assert.equal(vida.registrar('reencontro',{id:'s1/Nana',nome:'Nana',pres:1,conta:'tw_hs_memorias_v1:idol-a'}),false);
assert.equal(vida.registrar('reencontro',{id:'s1/Nana',nome:'Nana',pres:0,conta:'outra-conta'}),false);
assert.equal(vida.registrar('reencontro',{id:'s1/Nana',nome:'Nana',pres:0,conta:'tw_hs_memorias_v1:idol-a'}),true);
assert.equal(vida.registrar('reencontro',{id:'s1/Nana',nome:'Nana',pres:0,conta:'tw_hs_memorias_v1:idol-a'}),false);
assert.equal(vida.sinalCena('praca').nome,'Nana');
assert.equal(vida.sinalCena('praca').visual.hair,'#ff7eb6');
assert.equal(vida.sinalCena('praca').jeito,'timido','a personalidade vem da memória');
assert.equal(vida.estado().some(x=>x.nome),false,'estado público sem nome de fã');
ctx.hsMemLer=()=>[{nome:'Nana',pres:0,jeito:'animado',c:{hair:'#ff7eb6'}}];
assert.equal(vida.registrar('reencontro',{id:'s2/Nana',nome:'Nana',pres:0,conta:'tw_hs_memorias_v1:idol-a'}),true);
assert.equal(vida.sinalCena('praca').jeito,'animado');
ctx.hsMemLer=()=>[{nome:'Nana',pres:0,jeito:'fofo',c:{hair:'#ff7eb6'}}];
assert.equal(vida.registrar('reencontro',{id:'s3/Nana',nome:'Nana',pres:0,conta:'tw_hs_memorias_v1:idol-a'}),true);
assert.equal(vida.sinalCena('praca').jeito,'fofo');
ctx.hsMemLer=()=>[{nome:'Nana',pres:0,jeito:'inventado',c:{hair:'#ff7eb6'}}];
assert.equal(vida.registrar('reencontro',{id:'s4/Nana',nome:'Nana',pres:0,conta:'tw_hs_memorias_v1:idol-a'}),true);
assert.equal(vida.sinalCena('praca').jeito,'fofo','jeito desconhecido tem fallback seguro');
assert.match(vida.diarioHtml(),/Nana/);
ctx.contaJ={id:'idol-b',nick:'B'};
assert.equal(vida.sinalCena('fofo'),null,'sem vazamento entre contas');
assert.equal(vida.sinalCena('praca'),null,'a praça não revela memória de outra conta');
assert.equal(vida.objetoCamarim(),null);
assert.equal(vida.objetosCamarim().length,0);
assert.equal(vida.historiaHtml(),'');
ctx.contaJ=null;
assert.equal(vida.sinalCena('arena'),null,'visitantes sem memória de outro usuário');
assert.equal(vida.registrar('bloom_colher',{id:'fake'}),false);
assert.match(mapa,/function objetoRua\(/);
assert.match(mapa,/nomeFa:fa.nome/,'a Praça reutiliza NPC já conhecido');
assert.match(mapa,/poseFa=jeitoFa==='timido'/);
assert.match(mapa,/exprFa=jeitoFa==='timido'\?0/);
assert.match(mapa,/gesto=p.jeitoFa==='timido'/);
assert.match(mapa,/if\(!q.mov&&!p.nomeFa&&!reduzMov/,'sem balão duplicado de fã');
assert.match(mapa,/var alfa=reduzMov\?1:/,'movimento reduzido sem transição');
assert.match(mapa,/ctx.fillText\(etiqueta/);
const cafe=read('cafe.js');
assert.match(cafe,/r.certo===true&&certo\)cfCidadeReencontro/);
assert.match(cafe,/f.hsLembranca/);
assert.match(mapa,/var registro=window\.TWVidaCidade/);
assert.match(mapa,/p\.dono&&registro/,'o objeto do jogador depende do servidor');
assert.match(mapa,/!q\.mov&&objeto/,'objetos só em pausa, sem deslocamentos extras');
assert.match(mapa,/if\(!reduzMov&&parados\.length>1/,'cumprimentos respeitam reduzir movimento');
assert.match(mapa,/Math\.abs\(q\.x-meu\.x\)<105/,'cumprimentos só quando realmente próximos');
assert.match(mapa,/q\.p\.dono/,'não inventa personagens, usa passeantes existentes');
// Executa o desenho com relógio e Canvas simulados para observar poses e pontos de apoio.
const exibidos=[], traducoes=[], textos=[];
const canvas=new Proxy({
 translate(x,y){traducoes.push([x,y]);},
 fillText(t){textos.push(t);},
 measureText(t){return {width:t.length*8};}
},{get(obj,chave){return chave in obj?obj[chave]:()=>{};}});
const cenaCtx={
 console, TW_MAPA_DEBUG:true, document:{readyState:'loading',addEventListener(){}},
 state:'menu',pw:null,dpw:null,rankI:0,sash:false,accSel:'',frame:0,charPose:'v',
 hubAv:()=>({pose:'v',expr:2,c:{skin:'#ffd1b0'}}),
 perfChar:av=>av.c, perfCharContorno:(x,tx,ty,sc,draw)=>draw(),
 drawChar(c,x,y,mov,expr){exibidos.push({pose:cenaCtx.charPose,expr,mov});}
};
cenaCtx.window=cenaCtx;
vm.runInNewContext(mapa.replace(/\}\)\(\);\s*$/, `
  window.simular=function(bairro,tempo,registro,reduzido){
    cena=bairro;ctx=window.canvas;reduzMov=reduzido;
    window.TWVidaCidade={sinalCena:function(){return registro;}};
    andar(tempo);
  };
})();`),cenaCtx);
cenaCtx.canvas=canvas;
const memoria={tipo:'reencontro',nome:'Nana',jeito:'animado',visual:{skin:'#edb390'}};
cenaCtx.simular('praca',4,memoria,false);
assert.equal(exibidos.length,2);
assert.ok(textos.includes('💌 Nana'));
assert.ok(!textos.includes('♪'),'fã aguarda enquanto o Idol anda');
assert.equal(exibidos[1].pose,'');
exibidos.length=textos.length=0;
cenaCtx.simular('praca',6,memoria,false);
assert.deepEqual(exibidos.map(p=>p.pose),['tchau','tchau']);
assert.ok(textos.includes('♪'),'o gesto do fã acompanha a pausa do Idol');
exibidos.length=textos.length=0;
cenaCtx.simular('praca',0,memoria,true);
assert.deepEqual(exibidos.map(p=>p.pose),['tchau','tchau']);
assert.ok(textos.includes('♪'),'reencontro estático é visível com movimento reduzido');
exibidos.length=textos.length=traducoes.length=0;
cenaCtx.simular('harajuku',0,{tipo:'cafe'},false);
assert.equal(exibidos[0].pose,'','a mão baixa substitui a pose de foto durante o uso do objeto');
assert.deepEqual(traducoes[0],[334+12*1.45,738-13*1.45],'bandeja encaixada na mão do Idol');
exibidos.length=textos.length=traducoes.length=0;
cenaCtx.simular('fofo',12,{tipo:'bloom_regar'},false);
assert.equal(exibidos[0].pose,'');
assert.deepEqual(traducoes[2],[1334-12*1.45,738-13*1.45],'o regador acompanha a mão quando o Idol vira');
exibidos.length=textos.length=traducoes.length=0;
cenaCtx.simular('harajuku',0,null,false);
assert.equal(exibidos[0].pose,'v');
assert.equal(traducoes.length,0,'o Idol aguarda uma atividade confirmada para usar o objeto');
assert.equal(cenaCtx.charPose,'v','a pose de perfil fica preservada fora do desenho');
assert.match(pet,/function petVidaLembrancaCenario\(x\)/);
assert.match(pet,/petVidaLembrancaCenario\(x\);/);
assert.match(pet,/TWVidaCidade\.objetosCamarim/);
assert.match(src,/twVidaAssinatura/,'preservar foco sem reconstruir o painel');
const trecho=pet.slice(pet.indexOf('function petVidaLembrancaCenario('),pet.indexOf('function petDrawRoom(){'));
assert.ok(trecho.length>100);
assert.equal(/requestAnimationFrame|setTimeout|setInterval|contaRpc|petSave\(/.test(trecho),false);
assert.equal(/requestAnimationFrame|setTimeout|setInterval|localStorage|contaRpc/.test(src),false);
console.log('OK Vida de Idol⭐: objetos no Canvas, encontros por proximidade e sem eventos falsos/novos loops');

// A foto só é decodificada quando muda e sai do quadro ao perder o dono ou a origem.
let momentoFoto={url:'data:image/png;base64,AAAA'}, contaFoto='idol-a', criadas=0;
const fotoCtx={
  Image:class {constructor(){criadas++;this.complete=true;this.naturalWidth=100;this.naturalHeight=60;}},
  petPhoneMomentosConferir(){},
  petPhoneContaChave:()=>contaFoto,
  petCartaFotoMomento:()=>momentoFoto
};
vm.runInNewContext(pet.slice(pet.indexOf('var petVidaFotoCache'),pet.indexOf('function petVidaOlharLembranca(')),fotoCtx);
const imagemInicial=fotoCtx.petVidaFotoAtual();
assert.ok(imagemInicial);
assert.equal(fotoCtx.petVidaFotoAtual(),imagemInicial);
assert.equal(criadas,1);
momentoFoto=null;
assert.equal(fotoCtx.petVidaFotoAtual(),null);
momentoFoto={url:'https://example.com/foto.png'};
assert.equal(fotoCtx.petVidaFotoAtual(),null);
momentoFoto={url:'blob:foto-local'};
assert.ok(fotoCtx.petVidaFotoAtual());
contaFoto='';
assert.equal(fotoCtx.petVidaFotoAtual(),null);
