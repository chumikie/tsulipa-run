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
test('Signature Idols: official eyes differ, player-selected shape is not overridden',()=>{
  const shapes=['Tsu','Lirika','Pati'].map(n=>{const {g,pts}=recorder();F.rosto(g,{n,eye:'#123456'},0,0,0);return JSON.stringify(pts);});
  assert.equal(new Set(shapes).size,3);
  const a=recorder(),b=recorder();
  F.rosto(a.g,{n:'Tsu',eye:'#123456',olho:'pontinho'},0,0,0);
  F.rosto(b.g,{n:'Idol',eye:'#123456',olho:'pontinho'},0,0,0);
  assert.deepEqual(a.pts,b.pts);
});
test('Signature World: shared geometry and separate photo prop/hand mirror',()=>{
  for(const p of ['centerrun.js','karaoke-time.html','sora-jump.html'])assert.ok(read(p).includes('TWAvatarRoupa.pernas(g,x,y,up,c)'));
  const s=read('studio.js');assert.match(s,/x.restore\(\); \/\/ o arranjo permanece na ordem escolhida/);
  assert.match(s,/if\(espelhoMao\)x.scale\(-1,1\);\n    \/\/ Dedos/);
  assert.match(read('.github/workflows/validate-games.yml'),/ref: 2ed2825bc758db6d28dd4365a737c0ce8467de11/);
});
