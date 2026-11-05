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
function fake(){const log=[];const grad=()=>({addColorStop(){}});return {log,fillStyle:'',
  save(){log.push('save')},restore(){log.push('restore')},beginPath(){},closePath(){},moveTo(){},lineTo(){},rect(){},roundRect(){},
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
  assert(s.includes('if(!(TWR&&TWR.tem(twRoupa))) roupaSombra(x, y);'),f+': a sombra antiga não soma por cima nas quatro roupas');
  assert(s.includes('petPoseArms(c, x, y); } if(TWR)TWR.ombro(g,c,x,y,twRoupa,charPose);'),f+': ombro por cima do começo do braço');
  assert(/\{n:'Tsu',[^}]*baixo:'bermuda'\}/.test(s)&&/\{n:'Lirika',[^}]*baixo:'saia'\}/.test(s)&&/\{n:'Pati',[^}]*baixo:'bermuda'\}/.test(s),f+': Tsu bermuda, Lirika saia, Pati bermuda');
}
for(const f of ['index.html','karaoke-time.html','sora-jump.html'])assert(ler(f).includes('<script src="./tw-avatar-roupa.js?v=3"></script>'),f+' carrega tw-avatar-roupa.js');
const perfil=ler('perfil.js'),index=ler('index.html');
assert(perfil.includes('data-m="baixo"')&&perfil.includes("if(v === 'saia' || v === 'bermuda') c.baixo = v;"),'Montar Idol tem Saia/Bermuda e o perfil só aceita esses valores');
assert(index.includes("'outcol', 'legcol', 'baixo', 'hat'")&&index.includes("item.baixo === 'saia' || item.baixo === 'bermuda'"),'campo salvo no avatar e no save dos personagens');
assert(ler('centerrun.js').includes("baixo: c.baixo||''"),'saveCu guarda a parte de baixo de cada personagem');
// Braço levantado: a manga gira com o braço (não fica um bloco parado no ombro).
{ const pts=[];const gg=Object.assign(fake(),{moveTo:(a,b)=>pts.push([a,b]),lineTo:(a,b)=>pts.push([a,b]),arc(){}});
  R.ombro(gg,{outcol:'#ffb3d6'},0,0,'','banzai');
  assert(pts.some(p=>p[1]<21.5&&p[0]>24),'manga direita sobe junto com o braço no banzai');
  assert(pts.some(p=>p[1]<21.5&&p[0]<6),'manga esquerda sobe junto com o braço no banzai'); }
console.log('avatar-roupa: ok');
