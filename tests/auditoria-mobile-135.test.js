'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
test('Sora: liberar um dedo conserva o outro e reset limpa todos',()=>{
  const s=read('sora-jump.html'), a=s.indexOf('var soraKeyL = false'), b=s.indexOf('function soraTouchReset(){',a);
  assert.ok(a>=0&&b>a);
  const end=s.indexOf('}',b)+1, ctx={};vm.runInNewContext(s.slice(a,end),ctx);
  ctx.soraPointers.set(1,-1);ctx.soraTouchUpdate();assert.equal(ctx.soraTouchDir,-1);
  ctx.soraPointers.set(2,1);ctx.soraTouchUpdate();assert.equal(ctx.soraTouchDir,1);
  ctx.soraTouchRelease(2);assert.equal(ctx.soraTouchDir,-1);
  ctx.soraTouchRelease(99);assert.equal(ctx.soraTouchDir,-1);
  ctx.soraTouchReset();assert.equal(ctx.soraTouchDir,0);assert.equal(ctx.soraPointers.size,0);
});
test('Handshake: resposta do treino manual espera confirmação',()=>{
  const s=read('handshake.js');
  assert.match(s,/!hs\.leituraManual && hs\.fase === 'resposta' && dt > 80/);
  assert.match(s,/hs\.leituraManual && hs\.fase === 'resposta'.*data-hs-avancar/);
  assert.match(s,/else if\(hs\.fase==='resposta'\)\{if\(hs\.hype<=0\)hsFim\(\);else hsProxima\(\);\}/);
});
test('Studio: as três fases preservam a proporção do canvas 480 × 680',()=>{
  const css=read('hub-polish.css');
  assert.match(css,/#studioVisor\[data-fase="monta"\] #studioCv[^{}]*\{width:min\(100%,[^}]*height:auto;aspect-ratio:12\/17/);
  assert.match(css,/#studioVisor\[data-fase="foto"\] #studioCv\{width:min\(100%,[^}]*height:auto;aspect-ratio:12\/17/);
});

test('Bloom: caminho e intervalos decorativos não acionam canteiros',()=>{
  const s=read('bloom.js'), a=s.indexOf('function canteiroNoToque('), b=s.indexOf('function montarOv()',a);
  const ctx={canteiro:()=>null};vm.runInNewContext(s.slice(a,b),ctx);
  assert.equal(ctx.canteiroNoToque(100,328,400),0);
  assert.equal(ctx.canteiroNoToque(273,266,400),1);
  assert.equal(ctx.canteiroNoToque(359,328,400),-1);
  assert.equal(ctx.canteiroNoToque(100,180,400),-1);
  assert.equal(ctx.canteiroNoToque(100,390,400),-1);
});
test('Café: cobertura opcional pode ser retirada e os ingredientes indicam seleção',()=>{
  const s=read('cafe.js'), a=s.indexOf('function cfEscolher('),b=s.indexOf('// O reencontro',a);
  const ctx={cf:{fase:'pedido',monta:{base:0,cob:1,enf:2,doce:-1}},cfUI(){},cfSom(){},$:()=>({querySelector:()=>null})};
  vm.runInNewContext(s.slice(a,b),ctx);ctx.cfEscolher('cob',1);assert.equal(ctx.cf.monta.cob,-1);
  ctx.cfEscolher('cob',1);assert.equal(ctx.cf.monta.cob,1);assert.match(s,/aria-pressed="' \+ \(m\[tipo\] === i\)/);
});
test('Battle: teclado ignora repetição automática e show reposiciona o palco',()=>{
  const s=read('battle.js');assert.match(s,/if\(!e.repeat\)agitar\(\)/);assert.match(s,/render\(\);mostrarPalco\(\);/);
});

test('Camarim: cancelar arrasto restaura a posição e não grava',()=>{
 const s=read('pet-sala.js'),a=s.indexOf('function petArrumoSoltar('),b=s.indexOf('//←petArrumoModo',a);
 const A={chao:{abajur:90}},ctx={petArrumoLer:()=>A,petArrastando:{tipo:'chao',k:'abajur',antes:70,dono:'a'},petArrumoDono:'a',petBg:{},petArrumoSalvar(){throw Error('cancelamento não grava');}};
 vm.runInNewContext(s.slice(a,b),ctx);ctx.petArrumoSoltar({type:'pointercancel'});assert.equal(A.chao.abajur,70);assert.equal(ctx.petArrastando,null);
});
test('Mapa e Center preservam o dono do gesto',()=>{
 const m=read('tw-mapa.js'),h=read('index.html');
 assert.match(m,/e.pointerId===toque.id/);assert.match(h,/e.pointerId===crPointerPulo/);
 assert.match(h,/e.pointerId!==petArrumoPointer/);
});
test('Karaoke preserva rolagem ao reconstruir catálogo',()=>{
 const s=read('karaoke-lista.js');assert.match(s,/gradeAnterior\?gradeAnterior.scrollTop:0/);assert.match(s,/gradeNova.scrollTop=rolagem/);
});
