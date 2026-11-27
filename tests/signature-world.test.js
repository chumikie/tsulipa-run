'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const R=require('../tw-avatar-roupa.js'),F=require('../tw-avatar-rosto.js').TWAvatarRosto;
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
function recorder(){
  const pts=[],g=new Proxy({createLinearGradient(){return {addColorStop(){}}},createRadialGradient(){return {addColorStop(){}}}},{
    get(o,k){return k in o?o[k]:(...a)=>{pts.push([k,...a]);};}
  });return {g,pts};
}
test('Signature Idols: distinct waist and knees, fixed ankle anchors, neutral customized avatar',()=>{
  const names=['Tsu','Lirika','Pati'],shapes=names.map(n=>{
    const c={n,outcol:'#fff'},before=JSON.stringify(c),{g,pts}=recorder();
    R.camisa(g,0,0,c);const shirt=JSON.stringify(pts);pts.length=0;
    R.pernas(g,0,0,false,c);
    for(const x of [9.5,13.5,17.5,21.5])assert.ok(pts.some(p=>p[0]==='lineTo'&&p[1]===x&&p[2]===44));
    assert.equal(JSON.stringify(c),before);return shirt+JSON.stringify(pts);
  });
  assert.equal(new Set(shapes).size,3);
  assert.equal(R.assinatura({n:'Idol'}),R.assinatura({n:'__proto__'}));
  assert.equal(R.assinatura({}),R.assinatura(null));
});
test('Restore the Soul: classic eyes retain the original pixel highlights for all Idols; explicit choices are preserved',()=>{
  const expected=[[0,17,3,1],[0,18,3,4],[1,19,2,2],[0,18,1,2],[2,21,1,1]];
  for(const n of ['Tsu','Lirika','Pati','Idol']){
    const {g,pts}=recorder();
    F.olho(g,{n,eye:'#123456'},0,0,-1);
    assert.deepEqual(pts.filter(p=>p[0]==='fillRect').map(p=>p.slice(1)),expected);
  }
  const a=recorder(),b=recorder();
  F.rosto(a.g,{n:'Tsu',eye:'#123456',olho:'pontinho'},0,0,0);
  F.rosto(b.g,{n:'Idol',eye:'#123456',olho:'pontinho'},0,0,0);
  assert.deepEqual(a.pts,b.pts);
});
test('Signature World: shared geometry and separate photo prop/hand mirror',()=>{
  for(const p of ['centerrun.js','karaoke-time.html','sora-jump.html'])assert.ok(read(p).includes('TWAvatarRoupa.pernas(g,x,y,up,c)'));
  const s=read('studio.js');assert.match(s,/x.restore\(\); \/\/ o arranjo permanece na ordem escolhida/);
  assert.match(s,/if\(espelhoMao\)x.scale\(-1,1\);\n    \/\/ Dedos/);
  assert.match(read('.github/workflows/validate-games.yml'),/ref: cc22799235fa65be5f71ef03d3ba952b3b65f505/);
});

test('Signature 5.10: official identity survives local normalization and clone, never serialized names',()=>{
  const vm=require('node:vm'),s=read('perfil.js'),html=read('index.html');
  const scope={CH:[{n:'Tsu',hair:'#aa55ee'},{n:'Lirika',hair:'#222222'},{n:'Pati',hair:'#4477dd'},{n:'Tsu',hair:'#aa55ee'}]};
  scope.HUB_TRIO=[[0],[1],[2]];
  scope.HUB_TRIO_DRAW_CHARS=scope.CH.slice(0,3).map(c=>({...c}));
  vm.runInNewContext(html.match(/var PERF_BASE = .*?;/)[0]+'\n'+html.match(/var PERF_CAMPOS = .*?;/)[0]+'\n'+s.slice(s.indexOf('var PERF_IDENTIDADE_LOCAL'),s.indexOf('function perfAvAtual(')),scope);
  assert.equal(scope.PERF_IDENTIDADE_LOCAL,null,'no WeakMap on load');
  assert.equal(scope.perfChar({c:{n:'Tsu'}}).n,'Idol');
  assert.equal(scope.PERF_IDENTIDADE_LOCAL,null,'custom avatar does not allocate official registry');
  for(let i=0;i<3;i++){
    const c=scope.HUB_TRIO_DRAW_CHARS[i],copy=scope.perfCopiarCharOficial(c),before=JSON.stringify(c);
    assert.equal(scope.perfChar({c}).n,scope.CH[i].n);
    assert.equal(scope.perfChar({c:scope.CH[i]}).n,scope.CH[i].n);
    assert.equal(scope.perfChar({c:copy}).n,scope.CH[i].n);
    assert.equal(scope.perfChar({c:JSON.parse(JSON.stringify(copy))}).n,'Idol');
    assert.equal(JSON.stringify(c),before);
    assert.equal(copy.hair,c.hair);
  }
  assert.equal(scope.perfChar({c:scope.CH[3]}).n,'Idol');
  assert.equal(scope.perfChar({c:{n:'Lirika',hair:'#222222'}}).n,'Idol');
  assert.match(read('tw-celular.js'),/perfCopiarCharOficial\(HUB_TRIO_DRAW_CHARS\[k\]\)/);
});
test('Signature 5.11–12: side silhouette follows front choice and uses shared eye shapes',()=>{
  const vm=require('node:vm'),s=read('tw-lado.js'),scope={window:{},TWAvatarRoupa:R,TWAvatarRosto:F};
  vm.runInNewContext(s,scope);
  const base={n:'Tsu',skin:'#b97a50',hair:'#b04fe6',eye:'#a64bd9',outcol:'#ffffff',legcol:'#1c1c30'};
  for(const out of ['','y2k','citypop','seifuku','zipper','sweet','estrelado']){
    const shapes=[];
    for(const baixo of ['saia','bermuda'])for(const step of [-1,0,1]){
      const {g,pts}=recorder();
      scope.window.TW_LADO.partes(g,{...base,out,baixo},0,0,0,10,step,'',{});
      assert.ok(pts.filter(p=>p[0]==='quadraticCurveTo').length>5);
      assert.ok(pts.every(p=>p.slice(1).every(v=>typeof v!=='number'||Number.isFinite(v))));
      if(step===0)shapes.push(JSON.stringify(pts));
    }
    assert.notEqual(shapes[0],shapes[1],out+' respects bottom choice in profile');
  }
  for(const p of ['pet.js','karaoke-time.html']) assert.ok(read(p).includes("TWAvatarRoupa.membro(g,c,x,y,charPose,'R')"));
  for(const pose of ['v','tchau','coracao','banzai','mic','luz']){
    const limbs=['Tsu','Lirika','Pati','Idol'].map(n=>R.articulacao({n},pose,'R'));
    assert.equal(new Set(limbs.map(a=>a[2])).size,4);
    for(const [sx,sy,ex,ey,wx,wy] of limbs){
      assert.deepEqual([sx,sy,wx,wy],R.BRACOS[pose].R);
      assert.ok(Math.abs((ex-sx)*(wy-sy)-(ey-sy)*(wx-sx))>1,'cotovelo fora da reta ombro–punho');
    }
  }
});
test('Signature 5.13: all four architectural SVGs are derived from generator, with one static group each',()=>{
  const py=read('tools/mapa/rua.py'),map=read('tw-mapa.js');
  for(const id of ['praca','palco','arena','ceu']){
    const s=read('mapa-rua-'+id+'.svg'),marker='id="signature-'+id+'"';
    assert.equal(s.split(marker).length,2);
    const group=s.slice(s.indexOf('<g '+marker),s.indexOf('<g transform="translate(30,26)">',s.indexOf(marker)));assert.ok(group.startsWith('<g '+marker));assert.ok(py.includes(group.replace(/ \/>/g,'/>')),'generator preserves exact integrated group '+id);
    assert.equal((s.match(/<g(?:\s|>)/g)||[]).length,(s.match(/<\/g>/g)||[]).length);
  }
  assert.ok(map.includes("img.src='./'+arquivo+'?v=7';"),'versioned SVG URL');
  assert.doesNotMatch(map,/Pavilhão lunar, reconstruído/);
});
