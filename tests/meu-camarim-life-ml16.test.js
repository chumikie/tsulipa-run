'use strict';
// ML1.6 — Arrumar o quarto, luz pelo horário, carta com foto, Look do dia e cor das meias.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const pet = read('pet.js'), shop = read('shop.js'), html = read('index.html'), perfil = read('perfil.js'), cr = read('centerrun.js');
const fatia = (s, a, b) => s.slice(s.indexOf(a), s.indexOf(b));

test('ML1.6: luz do horário de Brasília em quatro fases, só no desenho', () => {
  const luz = fatia(pet, 'function petLuzFase(', 'var PET_LUZ_CEU');
  const ctx = {Date}; vm.runInNewContext(luz, ctx);
  const utc = h => Date.UTC(2026, 10, 5, h, 0);
  assert.equal(ctx.petLuzFase(utc(10)), 'manha');   // 07h em Brasília
  assert.equal(ctx.petLuzFase(utc(15)), 'dia');     // 12h
  assert.equal(ctx.petLuzFase(utc(20)), 'tarde');   // 17h
  assert.equal(ctx.petLuzFase(utc(1)), 'noite');    // 22h
  const desenho = fatia(pet, 'function petLuzFase(', '// Arrumar o quarto') + fatia(pet, '// Abajur de chão', 'function petLoad(');
  assert.doesNotMatch(desenho, /petSave\(|contaRpc\(|localStorage|starT/);
  assert.match(pet, /petBgFase !== petLuzFase\(\)\) petMakeBg\(\)/, 'fundo refeito só quando a fase muda');
});

function arrumo(store){
  const ctx = {localStorage:{getItem:k => store[k] || null, setItem:(k, v) => { store[k] = v; }}, petData:null, PET_DECOR:[], Math, JSON};
  vm.runInNewContext(fatia(pet, 'var PET_ARRUMO_KEY', 'function petArrumoAbaixo('), ctx);
  return ctx;
}

test('ML1.6: móveis só deslizam no chão, sem sobrepor, e ficam só no aparelho', () => {
  const store = {}, ctx = arrumo(store);
  assert.equal(ctx.petArrumoX('mesa'), 166);
  ctx.petArrastando = {tipo:'chao', k:'estante', dx:0};
  ctx.petArrumoMover(240, 20);                         // o y do dedo é ignorado: base sempre no chão
  assert.equal(ctx.petArrumoX('estante'), 240);
  ctx.petArrumoMover(262, 20);                         // encostaria no abajur → fica onde estava
  assert.equal(ctx.petArrumoX('estante'), 240);
  ctx.petArrastando = {tipo:'chao', k:'mesa', dx:0};
  ctx.petArrumoMover(240, 140);                        // ocupado pela estante → não sobrepõe
  assert.equal(ctx.petArrumoX('mesa'), 166);
  ctx.petArrumoMover(999, 140);                        // limite entre o sofá e a arara
  assert.ok(ctx.petArrumoX('mesa') <= ctx.PET_MOVEIS.mesa.max);
  ctx.petArrumoSalvar();
  assert.ok(store.tw_camarim_arrumacao, 'chave própria');
  assert.doesNotMatch(fatia(pet, 'var PET_ARRUMO_KEY', 'function petArrumoDesenhar('), /petSave\(|contaRpc\(|brs48cr_pet/, 'fora do save sincronizado do Pet');
  assert.match(pet, /x\.translate\(petArrumoDx\('mesa'\), 0\)/);
  assert.match(pet, /x\.translate\(petArrumoDx\('estante'\), 0\)/);
  assert.match(pet, /lx >= 156 \+ dm && lx <= 180 \+ dm/, 'toque no celular acompanha a mesinha');
  assert.match(html, /if\(petArrumoAbaixo\(lx, ly\)\)/);
  assert.match(html, /pointermove/);
});

test('ML1.6: quadros ficam na parede, acima do chão', () => {
  const ctx = arrumo({});
  const it = ['zipper', 'Pôster', 0, 148, 36, 48, 39.5, 'poster', 0];
  ctx.petArrastando = {tipo:'parede', k:'zipper', dx:0, dy:0, it};
  ctx.petArrumoMover(100, 400);
  const p = ctx.petArrumoQuadro(it);
  assert.ok(p[1] + it[6] <= 150, 'não desce até o chão');
  ctx.petArrumoMover(-50, -50);
  const q = ctx.petArrumoQuadro(it);
  assert.ok(q[0] >= 4 && q[1] >= 28);
});

test('ML1.6: carta com a polaroid do último Momento guardado', () => {
  assert.match(pet, /function petCartaComFoto\(lista\)/);
  assert.match(pet, /petCartaComFoto\(lista\);\n  return lista;/);
  assert.match(pet, /data-carta-foto="/);
  assert.match(pet, /look:'Amei o seu Look do dia!/);
  assert.doesNotMatch(fatia(pet, '// Carta com foto', 'function petCartasNovas('), /localStorage|contaRpc\(|petSave\(/);
});

test('ML1.6: Look do dia muda por dia, usa a cor da roupa e guarda a polaroid nos Momentos', () => {
  const ctx = {Date, Math, parseInt, String, isNaN};
  vm.runInNewContext(fatia(shop, 'var SHOP_LOOKS', 'function shopLookEstado('), ctx);
  assert.equal(ctx.SHOP_LOOKS.length, 7);
  const rosa = ctx.SHOP_LOOKS[0][4], noite = ctx.SHOP_LOOKS[6][4];
  assert.ok(rosa(ctx.shopHsl('#ff8fc8')) && !rosa(ctx.shopHsl('#8fd3ff')));
  assert.ok(noite(ctx.shopHsl('#1d2450')));
  assert.match(shop, /petPhoneMomentoGuardar\('look', url\)/);
  assert.match(pet, /\['pet','center','duo','look'\]\.indexOf\(tipo\)/);
  assert.doesNotMatch(fatia(shop, 'var SHOP_LOOKS', 'function shopProvador('), /contaRpc\(|localStorage|starT/);
});

test('ML1.6: cor das meias mantém os quadradinhos e o padrão escuro', () => {
  assert.match(cr, /g\.fillStyle=\(typeof c\.legcol==='string'&&\/\^#\[0-9a-f\]\{6\}\$\/i\.test\(c\.legcol\)\)\?c\.legcol:'#1c1c30';g\.fillRect\(x\+9,y\+36/);
  assert.match(html, /'outcol', 'legcol', 'hat'\]/);
  assert.match(perfil, /\(hair\|hair2\|skin\|eye\|outcol\|legcol\)/);
  assert.match(perfil, /data-m="legcol"/);
  assert.doesNotMatch(html, /id="cleg"/, 'a página inicial não muda (teste visual de idiomas)');
});

test('Perfil aberto pela vitrine/busca volta para a página principal, não para o Center⭐Run!', () => {
  assert.match(html, /if\(b\)\{ perfVoltaHub = true; hubFechar\(\); \}/);
  assert.match(perfil, /if\(!petLifeRetornar\('trofeus'\) && voltaHub && typeof hubMostrar === 'function'\) hubMostrar\(\);/);
});

test('ML1.7: celular tem som ao abrir, fechar, trocar de app, voltar, tocar e abrir carta', () => {
  for(const k of ['abrir', 'fechar', 'app', 'voltar', 'toque', 'carta']) assert.match(pet, new RegExp("petPhoneSom\\('" + k + "'\\)"), k);
  assert.match(pet, /if\(typeof beep !== 'function' \|\| !PET_PHONE_SONS\[k\]\) return;/, 'usa o beep do jogo (que respeita o mudo)');
});
