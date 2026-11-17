// Nitidez automática dos canvas (17/11/2026): carregada antes de tudo, sem mudar o que os jogos enxergam.
const fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),js=fs.readFileSync(path.join(root,'tw-nitidez.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8'),sora=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
for(const [nome,html] of [['index',index],['sora',sora]]){
  const i=html.indexOf('<script src="./tw-nitidez.js?v='),j=html.search(/^<script[ >]/m);
  assert.ok(i>=0&&i===j,nome+': tw-nitidez.js é o primeiro script da página');
}
for(const k of ["P.getContext = function","C.setTransform = function","C.resetTransform = function","C.drawImage = function","P.toDataURL = function","C.getImageData = function","'shadowBlur', 'shadowOffsetX', 'shadowOffsetY'"])
  assert.ok(js.includes(k),'tw-nitidez cobre '+k);
assert.match(js,/this\.isConnected/,'só canvas que estão na página');
assert.match(js,/dataset\.nitido === '0'/,'dá para deixar um canvas de fora');
assert.match(js,/st\.w \* st\.h > 150000 \? 2 : 3/,'teto de escala para canvas grandes');
assert.match(js,/k:0\}/,'escala começa em zero (calcula na primeira vez)');
assert.match(fs.readFileSync(path.join(root,'perfil.js'),'utf8'),/var ks = x\.canvas && x\.canvas\.__twA \? 1 : k;/,'contorno do boneco não dobra a sombra');
assert.match(fs.readFileSync(path.join(root,'centerrun.js'),'utf8'),/cv\.width=W;cv\.height=H;g=cv\.getContext\('2d'\);/,'Center⭐Run pede o pincel no tamanho atual');
assert.match(sora,/soraCtx = soraCv\.getContext\('2d', \{ alpha: false \}\);/,'Sora⭐Jump pede o pincel ao começar');

assert.match(js,/localStorage\.getItem\('tw_nitidez'\) === '0'/,'freio: ?nitidez=0 desliga e fica guardado');
assert.match(fs.readFileSync(path.join(root,'perfil.js'),'utf8'),/TW_NITIDEZ\.desligada\)\) return cv;/,'o freio desliga também o twNitido');
console.log('✓ nitidez automática');
