'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const pet = fs.readFileSync(path.join(root, 'pet.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'pet.css'), 'utf8');
const logic = pet.slice(pet.indexOf('var petLifePose ='), pet.indexOf('var petData ='));

test('ML1.3-A: as três poses são locais, reversíveis e não alteram economia', () => {
  const writes = [], buttons = ['sentar', 'descansar', 'conviver'].map(pose => ({
    dataset:{pose}, disabled:false, attrs:{}, setAttribute(k,v){this.attrs[k]=v;}
  }));
  const ctx = {petOpen:true,petView:'room',petGame:null,petAnim:null,petPhoneOpen:false,
    petT:20,petAtivo:()=>({nome:'Pet'}),$:()=>({querySelectorAll:()=>buttons}),
    localStorage:{setItem(){writes.push('save');}},contaRpc(){writes.push('rpc');}};
  vm.runInNewContext(logic,ctx);
  assert.equal(ctx.petLifePoseEscolher('sentar'),true);
  assert.equal(ctx.petLifePose,'sentar');
  assert.equal(buttons[0].attrs['aria-pressed'],'true');
  assert.equal(ctx.petLifePoseEscolher('descansar'),true);
  assert.equal(ctx.petLifePose,'descansar');
  assert.equal(ctx.petLifePoseEscolher('conviver'),true);
  assert.equal(ctx.petLifePoseEscolher('conviver'),true);
  assert.equal(ctx.petLifePose,'');
  assert.equal(ctx.petLifePoseEscolher('invalida'),false);
  ctx.petGame={k:'corda'};
  assert.equal(ctx.petLifePoseEscolher('sentar'),false);
  ctx.petLifePoseUI();
  assert.ok(buttons.every(b=>b.disabled));
  assert.deepEqual(writes,[]);
  assert.doesNotMatch(logic,/petSave\(|starT|gastar_estrelas|setInterval|requestAnimationFrame/);
});

test('ML1.3-A: assento e poses reutilizam avatar e loop sem novos assets', () => {
  assert.match(pet,/petLifeSofa\(x, false\)/);
  assert.match(pet,/petLifeSofa\(x, true\)/);
  assert.match(pet,/drawChar\(CH\[sel\], 0, 0, 0, expr\)/);
  assert.match(pet,/petLifePose === 'conviver'/);
  assert.match(html,/id="petLifePoses"/);
  assert.match(html,/petLifePoseEscolher\(b\.dataset\.pose\)/);
  assert.match(css,/\.petlife-poses button\{[^}]*min-height:44px/);
  assert.match(css,/#petc\{[^}]*aspect-ratio:360\/220/);
  for(const viewport of [[320,640],[390,844]]){
    const roomWidth = Math.min(viewport[0]*.94,440);
    const canvasHeight = roomWidth*220/360;
    const buttonWidth = (roomWidth-12)/3;
    assert.ok(canvasHeight<viewport[1]/2);
    assert.ok(buttonWidth>80 && 44<=viewport[1]);
  }
});
