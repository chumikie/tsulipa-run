'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const R=require('../tw-avatar-roupa.js');
test('Identity & Soul: straight bangs use a continuous rounded mass and retain legacy two-tone fallback',()=>{
  const points=[];const g={beginPath(){},moveTo(...p){points.push(p)},lineTo(...p){points.push(p)},quadraticCurveTo(...p){points.push(p)},closePath(){},fill(){}};
  R.reta(g,0,0);
  assert.deepEqual(points,[[3,8],[15,7.5,27,8],[27,14],[15,14.35,3,14]]);
  assert.ok(points.every(p=>p.every(Number.isFinite)));
  for(const p of ['centerrun.js','karaoke-time.html','sora-jump.html']){
    assert.ok(read(p).includes("TWR.reta&&b!=='onduladom2'"));
  }
});
test('Moon Duo: prop and avatar anchors use the same vertical phase, including reduced motion',()=>{
  const s=read('duo.js'),start=s.indexOf('function duoGeo('),end=s.indexOf('function duoIdolEm(',start);
  const p=read('perfil.js'),a=p.indexOf('function perfDesenharIdol('),b=p.indexOf('var cx = tx +',a);
  const ctx={DUO_OH:560,DUO_OW:680,Math,matchMedia:()=>({matches:false})};
  vm.runInNewContext(s.slice(start,end),ctx);
  for(const t of [0,12,37,120]){
    const geo=ctx.duoGeo({},t);
    assert.equal(geo.bob,t?Math.sin(t*.06)*.85*geo.sc:0);
    ctx.matchMedia=()=>({matches:true});assert.equal(ctx.duoGeo({},t).bob,0);
    ctx.matchMedia=()=>({matches:false});
  }
  assert.match(p.slice(a,b),/camera \? \.32 : \.85/);
  assert.match(s,/duoPonto\(gu, sxG, chG, t \+ 37/);
});
test('Memórias: gallery never paints a photograph belonging to a different account',()=>{
  const s=read('pet-sala.js'),a=s.indexOf('function petPhoneMomentosRender('),b=s.indexOf('//←petPhoneMomentoAbrir',a);
  const img={src:''},queries=[];
  const ctx={petPhoneOpen:true,petPhoneTela:'fotos',petPhoneFotosAba:'momentos',petPhoneMomentoSelecionado:'',
    petPhoneMomentos:[{id:'a',dono:'A',url:'a.png',tipo:'studio'},{id:'b',dono:'B',url:'b.png',miniUrl:'b-mini.png',tipo:'studio'}],
    petPhoneFotoChave:()=> 'B',petVidaQuadroLer:()=>null,$:id=>id==='petPhoneCorpo'?{querySelectorAll(){return[]},querySelector(q){queries.push(q);return q.includes('data-momento-id')?img:null;}}:null};
  vm.runInNewContext(s.slice(a,b),ctx);ctx.petPhoneMomentosRender();
  assert.equal(img.src,'b-mini.png');assert.ok(queries.every(q=>!q.includes('"a"')));
});
test('Studio: preview and capture preserve the frozen reduced-motion phase',()=>{
  const s=read('studio.js');assert.match(s,/tempoDaPrevia = calmo\?0:tm/);
  assert.match(s,/cena\(x, W-48, \(W-48\)\*1\.25, esc_, tempoDaPrevia, null, lenteDaPrevia\)/);
  assert.ok(s.includes('f.t0 / 1000, f.avatar, lenteDaPrevia)'));
  assert.match(s,/tempo:tempoDaPrevia === null \? \(calmo\?0:foto\.t0 \/ 1000\) : tempoDaPrevia/);
});
