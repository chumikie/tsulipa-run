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
