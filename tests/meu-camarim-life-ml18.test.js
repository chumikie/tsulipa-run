'use strict';
// ML1.8-A — geometria e movimentos locais do Camarim; backend sempre simulado.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const pet = fs.readFileSync(path.join(__dirname, '..', 'pet.js'), 'utf8');
const roupa = require('../tw-avatar-roupa.js');
const logic = pet.slice(pet.indexOf('var petLifePose ='), pet.indexOf('var petData ='));

function quarto(){
  const calls=[];
  const ctx={Math,PET_FLOOR:196,CH:[{out:'seifuku',baixo:'saia'}],sel:0,TWAvatarRoupa:roupa,
    petOpen:true,petView:'room',petGame:null,petAnim:null,petPhoneOpen:false,petT:100,
    petAtivo:()=>({nome:'Pet'}),$:()=>({querySelectorAll:()=>[]}),
    petSave(){calls.push('save');},contaRpc(){calls.push('rpc');},
    localStorage:{setItem(){calls.push('storage');}}};
  vm.runInNewContext(logic,ctx);
  return {ctx,calls};
}

test('ML1.8-A: sentar, descansar e levantar interpolam sem salto, inclusive em troca rápida',()=>{
  const {ctx,calls}=quarto();
  const emPe=ctx.petLifePoseDesenho(ctx.petT);
  assert.equal(ctx.petLifePoseEscolher('sentar'),true);
  const inicio=ctx.petLifePoseDesenho(100);
  assert.equal(inicio.x,emPe.x);
  assert.equal(inicio.sit,0);
  const meio=ctx.petLifePoseDesenho(112);
  assert.ok(meio.x<emPe.x && meio.x>ctx.PET_LIFE_POSES.sentar.x);
  assert.ok(meio.sit>0 && meio.sit<1);
  ctx.petT=112;
  assert.equal(ctx.petLifePoseEscolher('descansar'),true);
  const troca=ctx.petLifePoseDesenho(112);
  assert.ok(Math.abs(troca.x-meio.x)<.001,'recomeça da posição visível');
  ctx.petT=136;
  assert.equal(ctx.petLifePoseDesenho(136).sit,1);
  assert.equal(ctx.petLifePoseEscolher('descansar'),true,'mesma ação levanta');
  assert.equal(ctx.petLifePoseDesenho(136).sit,1,'não levanta instantaneamente');
  assert.equal(ctx.petLifePoseDesenho(160).sit,0);
  ctx.petGame={k:'brincar'};
  assert.equal(ctx.petLifePoseEscolher('sentar'),false,'minijogo tem prioridade');
  assert.deepEqual(calls,[],'nenhum save, compra ou RPC');
  assert.doesNotMatch(logic,/petSave\(|contaRpc\(|setTimeout\(|setInterval\(|requestAnimationFrame\(/);
});

test('ML1.8-A: o Pet aproxima e volta por deslocamento único, limitado, em 30/60 fps',()=>{
  for(const delta of [1,2]){
    const {ctx}=quarto(), pontos=[];
    for(let i=0;i<35;i++) pontos.push(ctx.petLifePetAproximar(true,delta));
    assert.ok(pontos.every((n,i)=>n>=0&&n<=52&&(i===0||n>=pontos[i-1])));
    assert.equal(ctx.petLifePetPerto,52);
    const volta=[];
    for(let i=0;i<35;i++) volta.push(ctx.petLifePetAproximar(false,delta));
    assert.ok(volta.every((n,i)=>n>=0&&n<=52&&(i===0||n<=volta[i-1])));
    assert.equal(ctx.petLifePetPerto,0);
    assert.ok(52-volta[0]<=delta*2.2+.01,'sem teleporte ao sair de Conviver');
  }
});

test('ML1.8-A: movimento reduzido chega à postura final sem interpolação',()=>{
  const {ctx}=quarto();
  ctx.window={matchMedia:()=>({matches:true})};
  ctx.petLifePoseEscolher('sentar');
  assert.equal(ctx.petLifePoseDesenho(100).sit,1);
  assert.equal(ctx.petLifePetAproximar(true,1),52);
  assert.equal(ctx.petLifePetAproximar(false,1),0);
});

test('ML1.8-A: joelho de Conviver não cruza o braço; saia mantém volume, bermuda mantém pernas',()=>{
  const {ctx}=quarto();
  ctx.petLifePose='conviver';
  const q=ctx.petLifeQuadril();
  assert.ok(q.x+10.8+7<136,'coxa direita termina antes do braço direito');
  for(const [out,baixo,esperado] of [
    ['seifuku','saia','saia'],['seifuku','bermuda',''],['citypop','bermuda',''],
    ['','saia','saia'],['sweet',undefined,'sweet'],['zipper',undefined,'zipper']
  ]){
    ctx.CH[0]={out,baixo};
    assert.equal(ctx.petLifeRoupaSaia(),esperado,out+'/'+baixo);
  }
  assert.match(pet,/petLifeSofaBracos\(x\); \/\/ o braço cobre a lateral da roupa\/joelho/);
  assert.match(pet,/var barra = petLifeRoupaSaia\(\) \? 12 : 3/);
  assert.match(pet,/x\.fillStyle=petLifeCorSaia/);
  assert.doesNotMatch(pet.slice(pet.indexOf('function petLifeSofa('),pet.indexOf('function petLifeSofaBracos(')),/roundRect\(px/);
});

test('ML1.8-A: 320×640 e 390×844 preservam Canvas 360:220 e botões acessíveis',()=>{
  const {ctx}=quarto();
  for(const [w,h] of [[320,640],[390,844]]){
    const sala=Math.min(.94*w,440), escala=sala/360, altura=sala*220/360;
    assert.ok(altura<h/2 && (sala-12)/3>80);
    ctx.petLifePose='conviver';
    const q=ctx.petLifeQuadril();
    assert.ok((q.x+17.8)*escala<136*escala,w+'px: joelho não ultrapassa o braço');
    assert.ok(escala>0 && Number.isFinite(altura));
  }
  assert.match(pet,/if\(petGame\)\{ petGameDraw\(x, p\); return; \}/);
  assert.match(pet,/idadeOlhar >= 30 && idadeOlhar < 100/,'atenção curta, não contínua');
  assert.match(pet,/tipoOlhar === 'pati'.*tipoOlhar === 'lirika'/,'preserva os temperamentos');
});

test('ML1.8-A: sofá desenha saia, vestido e bermuda sem erro nos dois visores simulados',()=>{
  for(const [largura,altura] of [[320,640],[390,844]]){
    const {ctx}=quarto(), op=[];
    const x={globalAlpha:1,save(){},restore(){},beginPath(){},ellipse(){},roundRect(){},
      fillRect(a,b,w,h){op.push(['ret',a,b,w,h]);},moveTo(){},lineTo(){},closePath(){},
      fill(){op.push(['preenche']);},stroke(){},strokeRect(){},fillText(){}};
    for(const out of ['seifuku','sweet','zipper']){
      ctx.CH[0]={out,baixo:'saia',legcol:'#345678'};
      ctx.petLifePose='conviver';ctx.petT=120;
      ctx.petLifeSofa(x,true,{...ctx.PET_LIFE_POSES.conviver,sit:1});
    }
    ctx.CH[0]={out:'citypop',baixo:'bermuda'};
    ctx.petLifeSofa(x,true,{...ctx.PET_LIFE_POSES.sentar,sit:1});
    assert.ok(op.some(p=>p[0]==='preenche'));
    assert.ok(op.some(p=>p[0]==='ret'&&p[3]===12),'pernas originais continuam retangulares');
    assert.ok(largura<=390 && altura>=640);
  }
});
