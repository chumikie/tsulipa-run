'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const pet = read('pet.js'), html = read('index.html'), css = read('pet.css');
const logic = pet.slice(pet.indexOf('function petLifeHit('), pet.indexOf('function petIdleJeito('));
const shopClose = read('shop.js').match(/function shopFechar\(\)\{[^\n]+\}/)[0];
const albumClose = read('album.js').match(/function albumFechar\(\)\{[^\n]+\}/)[0];
const perfilClose = read('perfil.js').slice(read('perfil.js').indexOf('function perfFechar(){'), read('perfil.js').indexOf('function perfMontar(){'));

function fakeRoom(signedIn = true){
  const calls = [], attr = {}, labels = {};
  const nodes = {};
  const element = (id) => ({
    id, hidden: id === 'petLifeEstante',
    textContent: '',
    scrollIntoView(){ calls.push('agenda-focus'); },
    setAttribute(k,v){ attr[id + ':' + k] = v; },
    querySelector(){ return labels[id] || (labels[id] = {textContent:''}); },
    insertBefore(node){ nodes[node.id] = node; },
    after(node){ nodes[node.id] = node; },
    remove(){ delete nodes[this.id]; }
  });
  Object.assign(nodes,Object.fromEntries(['petLifeEstante','albumTit','hubHojeLinha','hubToque','shopCorpo','perfTopoMsg'].map(k => [k, element(k)])));
  const shelfBtn = element('shelfBtn');
  const roomBtns = Object.fromEntries(['espelho','celular','estante','trofeus','album'].map(k => [k, element(k)]));
  const ctx = {
    petOpen:true, petView:'room', petGame:null, contaJ:signedIn ? {nick:'IdolTeste'} : null,
    LANG:'pt', hubComecou:true, petVeioHub:false, state:'menu', petAtivo:() => ({}), $:k => nodes[k], tr:s=>s,
    document:{querySelector(q){
      if(q.includes('#petLifeNav') && q.includes('estante')) return shelfBtn;
      const m=q.match(/data-life="([^"]+)"/);
      return m ? roomBtns[m[1]] : null;
    }, createElement:tag => element(tag)},
    contaEntrar(){ calls.push('login'); },
    petClose(){ calls.push('petClose'); ctx.petOpen=false; if(ctx.petVeioHub){ctx.petVeioHub=false;ctx.hubMostrar();} },
    petOpenUI(){ calls.push('petOpenUI');ctx.petOpen=true; },
    hubOv:{hidden:true}, hubMostrar(){ calls.push('hubMostrar');ctx.hubOv.hidden=false; },
    hubFechar(){ calls.push('hubFechar');ctx.petLifeCancelar('celular');ctx.hubOv.hidden=true; },
    hubMusicaParar(){ calls.push('hubMusicaParar'); },
    shopAbrir(){ calls.push('shopAbrir'); },
    perfAbrir(){ calls.push('perfAbrir'); },
    albumAbrir(){ calls.push('albumAbrir'); }
  };
  vm.runInNewContext(logic, ctx, {filename:'petLifeML1'});
  ctx.shopOv = {hidden:false}; ctx.albumOv = {hidden:false};
  ctx.perfOv = {hidden:false}; ctx.perfPedido=0; ctx.perfMontou=false;
  ctx.perfIconeConta = () => {};
  vm.runInNewContext([shopClose, albumClose, perfilClose].join('\n'), ctx, {filename:'petLifeML1-closures'});
  return {ctx,calls,nodes,shelfBtn,roomBtns,attr};
}

test('ML1: hotspots no Canvas preservam o toque do Idol/Pet e o item de temporada', () => {
  const {ctx} = fakeRoom();
  assert.equal(ctx.petLifeHit(80, 65), 'espelho');
  assert.equal(ctx.petLifeHit(165, 132), 'celular');
  assert.equal(ctx.petLifeHit(195, 135), 'estante');
  assert.equal(ctx.petLifeHit(110, 148), '', 'toque no Idol continua livre');
  assert.equal(ctx.petLifeHit(250, 167), '', 'carinho do Pet continua livre');
  assert.equal(ctx.petLifeHit(180, 190), '', 'tema de temporada continua livre');
  assert.match(html, /petGameTap\(lx, ly\) \|\| petRoomTap\(lx, ly\) \|\| petLifeTap\(lx, ly\)/);
  assert.match(html, /\(e\.clientX - r\.left\) \* 360 \/ r\.width/);
  assert.match(css, /\.petlife button,\.petlife-estante button\{[^}]*min-height:44px/);
});

test('ML1: ações no camarim só navegam para telas existentes com backend simulado', () => {
  const espelho = fakeRoom();
  assert.equal(espelho.ctx.petLifeTap(82, 67), true);
  assert.deepEqual(espelho.calls, ['petClose','hubMostrar','shopAbrir']);

  const phone = fakeRoom();
  assert.equal(phone.ctx.petLifeAbrir('celular'), true);
  assert.deepEqual(phone.calls, ['petClose','hubMostrar','agenda-focus']);

  const shelf = fakeRoom();
  assert.equal(shelf.ctx.petLifeAbrir('estante'), true);
  assert.equal(shelf.nodes.petLifeEstante.hidden, false);
  assert.equal(shelf.attr['shelfBtn:aria-expanded'], 'true');
  assert.deepEqual(shelf.calls, [], 'abrir a estante não encerra o Pet nem chama backend');
  assert.equal(shelf.ctx.petLifeAbrir('trofeus'), true);
  assert.deepEqual(shelf.calls, ['petClose','hubMostrar','perfAbrir']);

  const album = fakeRoom();
  assert.equal(album.ctx.petLifeAbrir('album'), true);
  assert.deepEqual(album.calls, ['petClose','hubMostrar','albumAbrir']);
  assert.match(album.nodes.albumTit.textContent, /Álbum de cards/);
});

test('ML1: bloqueia minijogo, ausência de Pet e acesso sem login sem criar saves', () => {
  const game = fakeRoom();game.ctx.petGame={k:'corda'};
  assert.equal(game.ctx.petLifeTap(80, 65), false);
  assert.deepEqual(game.calls, []);

  const noPet = fakeRoom();noPet.ctx.petAtivo=() => null;
  assert.equal(noPet.ctx.petLifeAbrir('espelho'), false);
  assert.deepEqual(noPet.calls, []);

  const guest = fakeRoom(false);
  assert.equal(guest.ctx.petLifeAbrir('espelho'), true);
  assert.deepEqual(guest.calls, ['login']);
  assert.equal(guest.ctx.petOpen, true);
  for(const k of ['brs48cr_st','terminar_corrida','iniciar_corrida','petSave(']){
    assert.equal(logic.includes(k), false, 'navegação ML1 não altera '+k);
  }
  assert.match(pet, /if\(!petBg \|\| petBgOshi !== OSHI\) petMakeBg\(\)/, 'usa o mesmo fundo em cache');
});

test('ML1.1: espelho e estante fecham a tela e voltam direto ao Camarim, não ao Hub', () => {
  for(const [k, fechar] of [['espelho','shopFechar'],['trofeus','perfFechar'],['album','albumFechar']]){
    const {ctx,calls} = fakeRoom();
    assert.equal(ctx.petLifeAbrir(k), true);
    assert.equal(ctx.petLifeOrigem, k);
    calls.length=0;
    ctx[fechar]();
    assert.deepEqual(calls, ['hubFechar','petOpenUI'], 'volta direto da tela: '+k);
    assert.equal(ctx.petLifeOrigem, '');
    assert.equal(ctx.hubOv.hidden, true, 'não deixa Hub aberto ao fundo se veio da página principal');
    assert.equal(ctx.petOpen, true);
    calls.length=0;
    ctx[fechar]();
    assert.equal(calls.includes('petOpenUI'), false, 'fechamento normal não reabre Camarim');
  }
});

test('ML1.1: celular mostra volta explícita junto à Agenda, sem criar missão ou save', () => {
  const {ctx,calls,nodes} = fakeRoom();
  ctx.petLifeAbrir('celular');
  assert.equal(nodes.petLifeVoltar.textContent, '↩ Meu Camarim⭐Life!');
  assert.equal(ctx.petLifeOrigem, 'celular');
  calls.length=0;
  nodes.petLifeVoltar.onclick();
  assert.deepEqual(calls, ['hubFechar','petOpenUI']);
  assert.equal(nodes.petLifeVoltar, undefined, 'o botão temporário some ao retornar');
  assert.equal(ctx.petLifeOrigem, '');
  assert.equal(ctx.petLifeCancelar('celular'), false);
});

test('ML1.1: mesmo antes de começar o Hub, o retorno ao Camarim fica acessível', () => {
  const {ctx,nodes,calls} = fakeRoom();
  ctx.hubComecou = false;
  ctx.petLifeAbrir('celular');
  assert.ok(nodes.petLifeVoltar, 'aparece ao lado do toque para começar');
  calls.length = 0;
  nodes.petLifeVoltar.onclick();
  assert.deepEqual(calls, ['hubFechar','petOpenUI']);
  assert.match(read('hub.js'), /hubComecou = true;[^\n]+\n  petLifeVoltaUI\(\);/);
});

test('ML1.1: origem Hub fica preservada e navegação comum não é sequestrada', () => {
  const fromHub = fakeRoom();
  fromHub.ctx.hubOv.hidden=false; fromHub.ctx.petVeioHub=true;
  fromHub.ctx.petLifeAbrir('album');
  fromHub.calls.length=0;
  fromHub.ctx.albumFechar();
  assert.deepEqual(fromHub.calls, ['hubMusicaParar','petOpenUI']);
  assert.equal(fromHub.ctx.petVeioHub, true, 'VOLTAR do Pet continua indo ao Hub original');

  const normalShop = fakeRoom();
  normalShop.ctx.shopFechar();
  assert.deepEqual(normalShop.calls, ['hubMostrar']);
  const normalAlbum = fakeRoom();
  normalAlbum.ctx.albumFechar();
  assert.deepEqual(normalAlbum.calls, []);
  const normalProfile = fakeRoom();
  normalProfile.ctx.perfFechar();
  assert.deepEqual(normalProfile.calls, []);

  const out = fakeRoom();
  out.ctx.petLifeAbrir('espelho');
  assert.equal(out.ctx.petLifeCancelar('espelho'), true);
  out.calls.length=0; out.ctx.shopFechar();
  assert.deepEqual(out.calls, ['hubMostrar'], 'ir do Provador para outro lugar cancela a volta pendente');
  assert.equal(logic.includes('localStorage'), false);
  assert.equal(logic.includes('contaRpc'), false);
  assert.match(html, /petLifeCancelar\('celular'\)/);
});
