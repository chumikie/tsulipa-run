'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

test('Handshake e Café têm câmeras acessíveis, cenas clicáveis e instruções curtas', () => {
  const html = read('index.html');
  for (const game of ['hs', 'cf']) {
    assert.match(html, new RegExp('id="'+game+'Cv"[^>]*role="button"[^>]*tabindex="0"'));
    assert.match(html, new RegExp('id="'+game+'Foto"[^>]*aria-label="Tirar foto"'));
  }
  assert.match(read('handshake.css'), /\.hc-instrucoes/);
  assert.match(read('cafe.css'), /cfgrupo/);
  assert.match(read('handshake.js'), /tr\('Conheça os fãs e memorize seus presentes/);
  assert.match(read('cafe.js'), /tr\('Prepare cada pedido: base, cobertura/);
});

test('toques geram apenas partículas e câmera abre imagem sem pontuar', () => {
  const elementos = {shr:{hidden:true},shimg:{src:''},shdl:{href:'',download:''},hsCv:{width:640,height:360}};
  const pintura = {fillRect(){},fillText(){},drawImage(){}};
  const ctx = {
    Math, Date, tr:s=>s, sfx:{card(){}}, $:id=>elementos[id],
    document:{createElement:()=>({getContext:()=>pintura,toDataURL:()=> 'data:image/png;base64,aaa'})}
  };
  vm.createContext(ctx);
  vm.runInContext(read('handshake.js'),ctx);
  vm.runInContext(read('cafe.js'),ctx);
  ctx.hs={hearts:[],pontos:19,hype:60};ctx.cf={fase:'inicio',hearts:[],pontos:22,vidas:3};
  ctx.hsReagirIdol();ctx.cfReagirIdol();
  assert.equal(ctx.hs.hearts.length,7);assert.equal(ctx.cf.hearts.length,7);
  assert.equal(ctx.hs.pontos,19);assert.equal(ctx.cf.pontos,22);
  ctx.cf.fase='pedido';ctx.cfReagirIdol();
  assert.equal(ctx.cf.hearts.length,7,'o Café não interfere no atendimento');
  ctx.hsFotografar('hsCv','Handshake⭐Event!','handshake');
  assert.equal(elementos.shr.hidden,false);
  assert.match(elementos.shimg.src,/^data:image\/png/);
  assert.match(elementos.shdl.download,/^tsulipa-handshake-/);
  assert.equal(ctx.hs.pontos,19);
  assert.equal(ctx.cf.pontos,22);
});

test('fotografar congela o relógio dos minijogos sem mudar RPCs', () => {
  for(const game of ['handshake','cafe']){
    const js=read(game+'.js');
    assert.match(js,/!\$\('shr'\)\.hidden/);
    assert.match(js,/requestAnimationFrame\((?:hs|cf)Loop\); return;/);
  }
});
