'use strict';
// Folha E aprovada (05/11/2026): saia ou bermuda, ombro ligado à roupa e luz contínua só no tecido.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const R=require('../tw-avatar-roupa.js');
const root=path.join(__dirname,'..');
const ler=f=>fs.readFileSync(path.join(root,f),'utf8');

assert.deepEqual(Object.keys(R.BAIXO),['','y2k','seifuku','citypop'],'só Trainee, Cheeky, Seifuku e City Pop ganham a parte de baixo nova');
assert(!R.tem('estrelado')&&!R.tem('zipper')&&!R.tem('sweet')&&!R.tem('-'),'Estrelado, Zipper, Sweet e looks de rank ficam como estavam');
assert.equal(R.qual({},''),'saia');assert.equal(R.qual({},'citypop'),'bermuda');
assert.equal(R.qual({baixo:'bermuda'},'seifuku'),'bermuda');assert.equal(R.qual({baixo:'xx'},'y2k'),'saia','valor inválido volta ao padrão');

// Canvas falso: registra o que é desenhado.
function fake(){const log=[],shapes=[];const grad=()=>({addColorStop(){}});return {log,shapes,fillStyle:'',
  save(){log.push('save')},restore(){log.push('restore')},beginPath(){},closePath(){},moveTo(){},lineTo(){},rect(x,y,w,h){shapes.push([x,y,w,h])},roundRect(){},
  clip(){log.push('clip')},fill(){log.push('fill:'+this.fillStyle)},fillRect(){log.push('rect:'+(typeof this.fillStyle==='string'?this.fillStyle:'grad'))},
  createLinearGradient:grad,createRadialGradient:grad};}
let g=fake();assert.equal(R.baixo(g,{},0,0,'zipper'),false,'roupa sem parte de baixo nova devolve false');
g=fake();assert.equal(R.baixo(g,{baixo:'bermuda'},0,0,'citypop'),true);
assert(g.log.includes('rect:#f1e7d0')&&g.log.includes('clip'),'bermuda creme da City Pop, com luz recortada no tecido');
g=fake();R.baixo(g,{},0,0,'seifuku');assert(g.log.includes('fill:#1b2a5e')&&g.log.includes('fill:#2e4183'),'saia pregueada azul-marinho com pregas');
g=fake();R.ombro(g,{outcol:'#ff8fc8'},0,0,'y2k');assert(g.log.includes('fill:#ff8fc8'),'ombro na cor do blazer');
g=fake();R.ombro(g,{outcol:'#ffb3d6'},0,0,'');assert(g.log.includes('fill:#ffb3d6'),'Trainee: manga na cor da camisa');
g=fake();R.tronco(g,0,0,'',{outcol:'#ffb3d6'});assert(g.log.includes('rect:#ffb3d6')&&!g.log.includes('rect:#4a5170'),'Trainee: laterais no tecido da camisa, sem o cinza');
g=fake();R.ombro(g,{},0,0,'-');assert.equal(g.log.length,0,'look de rank não ganha ombro');

for(const f of ['centerrun.js','karaoke-time.html','sora-jump.html']){
  const s=ler(f);
  assert(s.includes("twRoupa=(OF>0||(PX&&PX.k==='alien'))?'-':(c.out||'')")&&s.includes('TWR.baixo(g,c,x,y,twRoupa)'),f+': parte de baixo nova no lugar do retângulo comum');
  assert.equal((s.match(/if\(TWR\)TWR\.tronco\(g,x,y,twRoupa(,c)?\)/g)||[]).length,4,f+': luz do tronco antes dos detalhes nas quatro roupas');
  assert(s.includes('if(!(TWR&&TWR.luzPropria(twRoupa))) roupaSombra(x, y);'),f+': a sombra antiga não soma por cima nas roupas com luz própria');
  assert(['zipper-saia','zipper-tronco','zipper-mangas','sweet-saia','sweet-tronco'].every(k=>s.includes("TWAvatarRoupa.parte(g,x,y,'"+k+"')")),f+': Zipper e Sweet com luz só no tecido (folha F)');
  assert(s.includes('petPoseArms(c, x, y); } if(TWR)TWR.ombro(g,c,x,y,twRoupa,charPose);'),f+': ombro por cima do começo do braço');
  assert(s.includes('g.fillRect(x+7,y+22,3,10);g.fillRect(x+20,y+22,3,10)')&&!s.includes('g.fillRect(x+3,y+22,6,5)'),f+': Cheeky só desenha abas do tronco, sem segunda manga');
  assert(s.includes('g.fillRect(x+7, y+22, 4, 11); g.fillRect(x+19, y+22, 4, 11)')&&!s.includes('g.fillRect(x+2, y+22, 6, 5)'),f+': City Pop só desenha abas do paletó, sem segunda manga');
  assert(/\{n:'Tsu',[^}]*baixo:'bermuda'\}/.test(s)&&/\{n:'Lirika',[^}]*baixo:'saia'\}/.test(s)&&/\{n:'Pati',[^}]*baixo:'bermuda'\}/.test(s),f+': Tsu bermuda, Lirika saia, Pati bermuda');
}
for(const f of ['index.html','karaoke-time.html','sora-jump.html'])assert(ler(f).includes('<script src="./tw-avatar-roupa.js?v=8"></script>'),f+' carrega tw-avatar-roupa.js');
const perfil=ler('perfil.js'),index=ler('index.html');
assert(perfil.includes('data-m="baixo"')&&perfil.includes("if(v === 'saia' || v === 'bermuda') c.baixo = v;"),'Montar Idol tem Saia/Bermuda e o perfil só aceita esses valores');
assert(index.includes("'outcol', 'legcol', 'baixo', 'hat'")&&index.includes("item.baixo === 'saia' || item.baixo === 'bermuda'"),'campo salvo no avatar e no save dos personagens');
assert(ler('centerrun.js').includes("baixo: c.baixo||''"),'saveCu guarda a parte de baixo de cada personagem');
// Braço levantado: a manga gira com o braço (não fica um bloco parado no ombro).
{ const pts=[];const gg=Object.assign(fake(),{moveTo:(a,b)=>pts.push([a,b]),lineTo:(a,b)=>pts.push([a,b]),arc(){}});
  R.ombro(gg,{outcol:'#ffb3d6'},0,0,'','banzai');
  assert(pts.some(p=>p[1]<21.5&&p[0]>24),'manga direita sobe junto com o braço no banzai');
  assert(pts.some(p=>p[1]<21.5&&p[0]<6),'manga esquerda sobe junto com o braço no banzai'); }
// Backend simulado, apenas Canvas 2D: cada ombro tem uma única manga, ligada à parte frontal do casaco.
for(const [vw,vh] of [[320,640],[390,844]]){
  const escala=Math.min(vw/390,vh/844);
  for(const [look,esq,dir,larg,altura] of [['y2k',7,20,3,10],['citypop',7,19,4,11]]){
    const gg=fake();R.tronco(gg,0,0,look,{});
    for(const px of [esq,dir]){
      assert(gg.shapes.some(r=>r[0]===px&&r[1]===22&&r[2]===larg&&r[3]===altura),look+': abas do casaco preservadas em '+vw+'×'+vh);
    }
    assert(!gg.shapes.some(r=>r[2]===6),'não existe manga externa fixa sob a manga móvel');
    assert(altura*escala<vh,'geometria permanece proporcional no visor móvel');
    const pts=[],ombros=[];const raised=Object.assign(fake(),{moveTo:(x,y)=>pts.push([x,y]),lineTo:(x,y)=>pts.push([x,y]),arc:(x,y,r,inicio,fim,anti)=>ombros.push([x,y,r,anti])});
    R.ombro(raised,{outcol:'#b3d6ff'},0,0,look,'v');
    assert(pts.some(p=>p[0]>26)&&pts.some(p=>p[1]<22),'manga direita acompanha o braço em V em '+vw+'×'+vh);
    assert.equal(ombros.length,2,'a mesma manga participa das passagens de cor e sombra');
    assert.deepEqual(ombros[0],[26.5,25.5,3.4,true],'manga direita parte da mesma linha do braço levantado');
    assert(Math.abs(ombros[0][0]-R.BRACOS.v.R[0])<=.5,'Cheeky/City Pop: manga não parte três pixels para dentro do braço');
    for(const pose of ['tchau','luz','banzai']){
      const circulos=[];const ggPose=Object.assign(fake(),{arc:(x,y,r,a,b,anti)=>circulos.push([x,y,r,anti])});
      R.ombro(ggPose,{outcol:'#b3d6ff'},0,0,look,pose);
      assert.equal(circulos.length,pose==='banzai'?4:2,pose+': somente as mangas dos braços levantados giram');
      assert(circulos.every(p=>p[3]===true),pose+': sem recorte transparente no encontro do braço com a manga');
      if(pose==='banzai')assert.equal(circulos[0][0],3.5,'manga esquerda mantém-se a meio pixel do braço levantado');
    }
  }
}
assert(R.luzPropria('estrelado')&&R.luzPropria('zipper')&&R.luzPropria('sweet')&&!R.luzPropria('espacial'),'folha F: Estrelado, Zipper e Sweet sem a sombra antiga');
{ const gg=fake();R.parte(gg,0,0,'sweet-tronco');assert(gg.log.includes('clip'),'luz da Sweet recortada no vestido'); }
// Sentado no sofá do Camarim, a canela repete as polainas da Nagareboshi (Estrelado) em vez de virar meia preta.
const pet=ler('pet.js');
assert(pet.includes('petLifeCanelaRoupa(x, px, q.y + 6 + 15 + bal);')&&/function petLifeCanelaRoupa[\s\S]{0,200}c\.out !== 'estrelado'[\s\S]{0,300}#ff9ccd[\s\S]{0,120}#ffe14d[\s\S]{0,120}#4dd8ff/.test(pet),'polainas listradas também sentado');
console.log('avatar-roupa: ok');

// V3.1 (06/11/2026): pele com a luz contínua, costas do chanel/longo emendadas, sombra da franja, franja da Tsu e gravata.
for(const fn of ['bracos','rosto','cabelo','costas','sombraFranja','bagunca','gravata'])assert.equal(typeof R[fn],'function','tw-avatar-roupa exporta '+fn);
g=fake();assert.equal(R.cabelo(g,'#b04fe6','#7016a9',0,'pixie',0),null,'só chanel e longo ganham as costas novas');
assert.notEqual(R.cabelo(fake(),'#b04fe6','#7016a9',0,'chanel',0),null);assert.notEqual(R.cabelo(fake(),'#b04fe6','#7016a9',0,'longo',1),null);
g=fake();R.bracos(g,0,0);assert(g.log.includes('clip')&&g.log[0]==='save'&&g.log[g.log.length-1]==='restore','luz dos braços recortada e isolada');
g=fake();g.ellipse=()=>{};R.rosto(g,0,0);assert(g.log.includes('clip')&&g.log[g.log.length-1]==='restore','luz do rosto recortada e isolada');
g=fake();g.arc=()=>{};R.sombraFranja(g,0,0,'espetada',5,false);assert.equal(g.log.length,0,'franja espetada não ganha sombra');
for(const f of ['centerrun.js','karaoke-time.html','sora-jump.html']){
  const s=ler(f);
  for(const k of ['TWR.bracos(g,x,y)','TWR.rosto(g,x,y)','TWAvatarRoupa.cabelo(g,H,HD,y,b,0)','TWAvatarRoupa.costas(g,x,y,b)','TWR.sombraFranja(','TWR.bagunca(g,x,y)','TWR.gravata(g,x,y)'])assert(s.includes(k),f+' usa '+k);
}
