'use strict';
// Visual novo no computador (17/11/2026): nitidez dos palcos, nome do celular ("SamiPhone") e altura do Karaoke.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ler = f => fs.readFileSync(f, 'utf8');

// Recorta uma função de nível superior pelo nome (até a próxima linha que começa com "}").
function funcao(src, nome){
  const i = src.indexOf('function ' + nome + '(');
  assert.ok(i >= 0, nome + ' existe');
  const fim = src.indexOf('\n}', i);
  return src.slice(i, fim + 2);
}

// Canvas falso com width/height no protótipo, como no navegador.
function canvasFalso(w, h, cssW){
  class Cv {}
  const real = new WeakMap();
  Object.defineProperty(Cv.prototype, 'width', { configurable:true, get(){ return real.get(this).w; }, set(v){ real.get(this).w = v; this.transf = null; } });
  Object.defineProperty(Cv.prototype, 'height', { configurable:true, get(){ return real.get(this).h; }, set(v){ real.get(this).h = v; this.transf = null; } });
  const cv = new Cv(); real.set(cv, { w, h });
  cv.clientWidth = cssW; cv.transf = null;
  cv.getContext = () => ({ setTransform: (a, b, c, d) => { cv.transf = [a, d]; } });
  return { cv, Cv, real: () => real.get(cv) };
}

test('twNitido: mais pixels reais, mesmo tamanho lógico para o jogo', () => {
  const src = funcao(ler('perfil.js'), 'twNitido');
  for(const [dpr, css, kEsperado] of [[1, 708, 1.25], [1.5, 708, 1.75], [1, 400, 1], [2, 2000, 2]]){
    const { cv, Cv, real } = canvasFalso(640, 420, css);
    const sb = { window:{ devicePixelRatio:dpr }, HTMLCanvasElement:Cv, Math, Object };
    sb.window.HTMLCanvasElement = Cv;
    vm.runInNewContext(src + '\ntwNitido(cv);', Object.assign(sb, { cv }));
    assert.equal(cv.width, 640, 'o jogo continua vendo 640');
    assert.equal(cv.height, 420);
    assert.equal(real().w, Math.round(640 * kEsperado), 'pixels reais com dpr ' + dpr + ' e ' + css + ' px na tela');
    assert.deepEqual(cv.transf, kEsperado === 1 ? null : [kEsperado, kEsperado]);
    // O jogo redefinindo o tamanho continua funcionando (limpa e volta a escalar).
    vm.runInNewContext('cv.width = 320; twNitido(cv);', Object.assign(sb, { cv }));
    assert.equal(cv.width, 320);
  }
});

test('twNitido é usado nos palcos de tamanho fixo (Loja, Gacha, Café, Handshake, prévia do Montar Idol)', () => {
  assert.match(ler('shop.js'), /\$\('shopCv'\); if\(!cv\) return; if\(typeof twNitido === 'function'\) twNitido\(cv\);/);
  assert.match(ler('gacha.js'), /\$\('gachaCv'\); if\(typeof twNitido === 'function'\) twNitido\(cv\);/);
  assert.match(ler('cafe.js'), /\$\('cfCv'\); if\(!cv\) return; if\(typeof twNitido === 'function'\) twNitido\(cv\);/);
  assert.match(ler('handshake.js'), /\$\('hsCv'\); if\(!cv\) return; if\(typeof twNitido === 'function'\) twNitido\(cv\);/);
  assert.match(ler('charmaker.js'), /if\(typeof twNitido === 'function'\) twNitido\(cv\);/);
  // Contorno dos Idols desenhado na resolução do destino, sombra compensada.
  const cont = funcao(ler('perfil.js'), 'perfCharContorno');
  assert.match(cont, /g\.scale\(sc \* k, sc \* k\)/);
  assert.match(cont, /shadowBlur = 9 \* sc \/ 3\.5 \* k/);
});

test('quarto do Pet usa o tamanho na tela, não só o zoom', () => {
  const src = ler('pet-sala.js');
  const fit = funcao(src, 'petFitCanvas');
  assert.match(fit, /z \* vis \/ 360/);
  assert.match(funcao(src, 'petDrawRoom'), /petFitCanvas\(\);/);
  for(const [dpr, css, w] of [[1, 708, 720], [1.5, 708, 1080], [1, 360, 360], [2, 360, 720]]){
    const sb = { window:{ devicePixelRatio:dpr }, Math, petDpr:1, petBg:{}, petCv:{ clientWidth:css, width:360, height:220 } };
    vm.runInNewContext(fit + '\npetFitCanvas();', sb);
    assert.equal(sb.petCv.width, w, 'dpr ' + dpr + ', ' + css + ' px');
  }
});

test('o celular leva o nome do Idol de quem joga (SamiPhone)', () => {
  const pet = ler('pet.js');
  const nome = funcao(pet, 'petPhoneNome');
  const sb = { contaJ:{ nick:'Sami' }, Array, String };
  assert.equal(vm.runInNewContext(nome + '\npetPhoneNome();', sb), 'SamiPhone');
  assert.equal(vm.runInNewContext(nome + '\ncontaJ = null; petPhoneNome();', sb), 'TsuPhone');
  assert.match(ler('tw-humor.js'), /s = s\.split\('TsuPhone'\)\.join\(petPhoneNome\(\)\)/, 'aviso de recado no Humor');
  assert.match(ler('karaoke-photo.js'), /split\('TsuPhone'\)\.join\(nm\(\)\)/, 'guardar foto do Karaoke');
  assert.match(ler('pet-sala.js'), /até fechar o TsuPhone\.'\)\.split\('TsuPhone'\)\.join\(petPhoneNome\(\)\)/, 'dica da câmera do Camarim');
});

test('Karaoke no site: a altura avisada é a do conteúdo e pode diminuir', () => {
  const html = ler('karaoke-time.html');
  const i = html.indexOf('var ktAvisaAltura=function(){');
  assert.ok(i > 0);
  const bloco = html.slice(i, html.indexOf('};', i)).replace(/\/\/[^\n]*/g, '');
  assert.doesNotMatch(bloco, /documentElement\.scrollHeight/, 'documentElement nunca fica menor que o iframe');
  assert.match(bloco, /b\.scrollHeight/);
});


test('Gacha e Loja: tablet vertical recebe pixels físicos suficientes sem aumentar o teto dos jogos',()=>{
 const src=funcao(ler('perfil.js'),'twNitido');
 for(const id of ['gachaCv','shopCv','cfCv']){
  const {cv,Cv,real}=canvasFalso(640,420,711);cv.id=id;cv.getBoundingClientRect=()=>({width:713});
  const sb={window:{devicePixelRatio:2,HTMLCanvasElement:Cv},HTMLCanvasElement:Cv,Math,Object,cv};
  vm.runInNewContext(src+'\\n'.replace('\\n','\n')+'twNitido(cv);',sb);
  assert.equal(cv.width,640);assert.equal(cv.height,420);
  assert.equal(real().w,id==='cfCv'?1280:1440);
  if(id!=='cfCv')assert.ok(real().w/(713*2)>=1);
 }
});
