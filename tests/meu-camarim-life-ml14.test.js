'use strict';
// ML1.4 — balão de vontade do Pet (The Sims) e Cartas de fã no celular (Neopets).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = p => fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
const pet = read('pet.js'), html = read('index.html'), css = read('pet.css');
const fatia = (a, b) => pet.slice(pet.indexOf(a), pet.indexOf(b));
const vontade = fatia('// Balão de vontade (inspirado no The Sims)', '// Afinidade visual por atividade');
const cartas = fatia('// O celular leva o nome do jogador', 'function petPhoneAgendaHtml(');

function salaVontade(p){
  const fx = [], ditos = [];
  const ctx = {
    petData:{ativo:'chu', inv:{}}, petAnim:null, petGame:null, petView:'room', petOpen:true, petT:0,
    petFx:fx, petSmile:0, petHop:0, PET_X:250, PET_FLOOR:196, PET_PLAY_CD:5, PET_SING_CD:10,
    PET_FOOD:[['onigiri','Onigiri',0,60,20,2,0],['dango','Dango',8,0,35,10,0]], PET_SPECIAL:{sorvete:1},
    petAtivo:() => p, petRecLeft:() => 0, petClamp:v => Math.max(0, Math.min(100, v)),
    petFind:(l, k) => l.find(x => x[0] === k) || null, tr:s => s, beep(){},
    petSay:s => ditos.push(s), petSave(){ ctx.salvou = (ctx.salvou || 0) + 1; }, petUI(){},
    Date, Math
  };
  vm.runInNewContext(vontade, ctx);
  return {ctx, fx, ditos};
}

test('ML1.4: vontade só pede cuidados existentes e nunca mexe em estrelas, XP ou servidor', () => {
  assert.doesNotMatch(vontade, /petPay\(|starT|petXP\(|contaRpc\(|localStorage|setTimeout\(|setInterval\(|requestAnimationFrame\(/);
  const p = {fome:30, higiene:90, energia:90, humor:90};
  const {ctx} = salaVontade(p);
  for(let i = 0; i < 30; i++){
    const v = ctx.petVontadeEscolher(p);
    assert.equal(v.k, 'comer', 'fome baixa pede comida');
    assert.equal(v.item, 'onigiri', 'só comida grátis ou guardada, sem obrigar gasto de estrelas');
  }
  const limpo = {fome:90, higiene:30, energia:90, humor:90};
  assert.equal(salaVontade(limpo).ctx.petVontadeEscolher(limpo).k, 'banho');
});

test('ML1.4: atender a vontade certa dá humor e corações; outra ação não conta', () => {
  const p = {fome:60, higiene:90, energia:90, humor:50};
  const {ctx, fx, ditos} = salaVontade(p);
  ctx.petVontade = {k:'comer', item:'onigiri', ini:Date.now(), fim:Date.now() + 7e4, pet:'chu'};
  assert.equal(ctx.petVontadeAtender('banho'), false);
  assert.equal(ctx.petVontadeAtender('comer', 'dango'), false, 'comida diferente não realiza o pedido');
  assert.equal(p.humor, 50);
  assert.equal(ctx.petVontadeAtender('comer', 'onigiri'), true);
  assert.equal(p.humor, 58);
  assert.equal(ctx.petVontade, null);
  assert.equal(ctx.petVontadeFeitas, 1);
  assert.ok(fx.some(f => f.s === '💖'));
  assert.match(ditos.at(-1), /Vontade realizada/);
});

test('ML1.4: vontade expira, some ao dormir e respeita minijogos', () => {
  const p = {fome:90, higiene:90, energia:90, humor:90};
  const {ctx} = salaVontade(p);
  ctx.petVontade = {k:'carinho', ini:0, fim:1, pet:'chu'};
  ctx.petVontadeTick(p);
  assert.equal(ctx.petVontade, null, 'pedido antigo expira sozinho');
  ctx.petVontadeProx = 1; ctx.petGame = {k:'corda'};
  ctx.petVontadeTick(p);
  assert.equal(ctx.petVontade, null, 'não aparece durante minijogo');
  ctx.petGame = null; ctx.petVontadeTick(p);
  assert.ok(ctx.petVontade);
  p.dorme = true; ctx.petVontadeTick(p);
  assert.equal(ctx.petVontade, null);
});

test('ML1.4: ações existentes avisam a vontade no fim do cuidado', () => {
  for(const k of ['comer', 'banho', 'brincar', 'cantar', 'dormir', 'falar'])
    assert.match(pet, new RegExp("petVontadeAtender\\('" + k + "'"), k);
  assert.match(html, /petCuidadoReagir\('carinho'\);\n  petVontadeAtender\('carinho'\);/);
  assert.match(pet, /if\(!petVontadeDesenhar\(x, p\)\)\{/, 'balão ocupa o lugar do humor, sem segundo emoji');
});

function celular(nick){
  const ctx = {contaJ:nick ? {nick} : null, petAtivo:() => ({nome:'Pipoca'}), best:12345, LANG:'pt', tr:s => s,
    escHtml:s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;'), petPhoneOpen:true, petPhoneTela:'cartas',
    petPhoneRender(){ ctx.render = (ctx.render || 0) + 1; }, petLifeUI(){}, petPhoneSom(){}, $:() => null, Date, Math,
    hsNomesLivres:() => ['Nana', 'Kiko', 'Lulu']};
  vm.runInNewContext(cartas, ctx);
  return ctx;
}

test('ML1.4: celular leva o nome do jogador e continua TsuPhone sem conta', () => {
  assert.equal(celular('Maimai').petPhoneNome(), 'MaimaiPhone');
  assert.equal(celular('').petPhoneNome(), 'TsuPhone');
  assert.equal(celular('NomeMuitoGrandeDemais').petPhoneNome(), 'NomeMuitoGraPhone');
  assert.match(html, /<span id="petPhoneMarca">/);
});

test('ML1.4: cartas são estáveis no dia, com fãs inventados e sem save ou servidor', () => {
  assert.doesNotMatch(cartas, /localStorage|contaRpc\(|petSave\(|setTimeout\(|setInterval\(/);
  const a = celular('Maimai').petCartasLista(), b = celular('Maimai').petCartasLista();
  assert.equal(a.length, 4);
  assert.equal(JSON.stringify(a.map(c => c.texto)), JSON.stringify(b.map(c => c.texto)), 'mesma carta no mesmo dia');
  for(const c of a) assert.ok(['Nana', 'Kiko', 'Lulu'].includes(c.fa), 'só nomes livres de jogadores reais');
  assert.equal(a.filter(c => c.nova).length, 1, 'só a carta de hoje chega como nova');
});

test('ML1.4: abrir carta marca como lida na sessão e o Perfil segue acessível', () => {
  const ctx = celular('Maimai');
  assert.equal(ctx.petCartasNovas(), 1);
  const hoje = ctx.petCartasLista()[0].id;
  assert.equal(ctx.petCartaAbrir(hoje), true);
  assert.equal(ctx.petCartasNovas(), 0);
  assert.match(ctx.petCartasHtml(), /petphone-carta-oi/);
  ctx.petPhoneCartaAberta = '';
  assert.match(ctx.petCartasHtml(), /data-phone="abrir-perfil"/);
  assert.match(ctx.petCartasHtml(), /data-phone="carta-abrir"/);
  assert.match(html, /k === 'carta-abrir'\) petCartaAbrir\(b\.dataset\.carta\)/);
  assert.match(css, /\.petphone-carta\{[^}]*var\(--card\)/, 'carta usa as cores do tema');
});
