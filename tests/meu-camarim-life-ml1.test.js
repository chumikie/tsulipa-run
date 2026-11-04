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

function fakeRoom(signedIn = true){
  const calls = [], attr = {}, labels = {};
  const element = (id) => ({
    hidden: id === 'petLifeEstante',
    textContent: '',
    scrollIntoView(){ calls.push('agenda-focus'); },
    setAttribute(k,v){ attr[id + ':' + k] = v; },
    querySelector(){ return labels[id] || (labels[id] = {textContent:''}); }
  });
  const nodes = Object.fromEntries(['petLifeEstante','albumTit','hubHojeLinha'].map(k => [k, element(k)]));
  const shelfBtn = element('shelfBtn');
  const roomBtns = Object.fromEntries(['espelho','celular','estante','trofeus','album'].map(k => [k, element(k)]));
  const ctx = {
    petOpen:true, petView:'room', petGame:null, contaJ:signedIn ? {nick:'IdolTeste'} : null,
    LANG:'pt', petAtivo:() => ({}), $:k => nodes[k], tr:s=>s,
    document:{querySelector(q){
      if(q.includes('#petLifeNav') && q.includes('estante')) return shelfBtn;
      const m=q.match(/data-life="([^"]+)"/);
      return m ? roomBtns[m[1]] : null;
    }},
    contaEntrar(){ calls.push('login'); },
    petClose(){ calls.push('petClose'); ctx.petOpen=false; },
    hubOv:{hidden:true}, hubMostrar(){ calls.push('hubMostrar');ctx.hubOv.hidden=false; },
    shopAbrir(){ calls.push('shopAbrir'); },
    perfAbrir(){ calls.push('perfAbrir'); },
    albumAbrir(){ calls.push('albumAbrir'); }
  };
  vm.runInNewContext(logic, ctx, {filename:'petLifeML1'});
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
