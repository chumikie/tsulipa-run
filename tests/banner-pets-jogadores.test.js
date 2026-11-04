'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');

test('banner sorteado desenha somente os Pets públicos associados aos avatares', () => {
  const calls = [];
  const scope = {
    PET_SP:{tsu:{},lirika:{},pati:{},meu:{}}, PET_MK_DEF:{default:true},
    hubIdolsDados:{idols:[
      {nick:'Alice',avatar:{c:{},pet:{k:'tsu',acc:'laco'}}},
      {nick:'Bia',avatar:{c:{},pet:{k:'meu',acc:'coracao',cfg:{olhos:'fofo'}}}},
      {nick:'Ceci',avatar:{c:{}}}
    ]},
    HUB_TRIO:[[0,'v',.2],[1,'v',.5],[2,'v',.78]],
    HUB_REAGE:{i:-1,t0:0,dur:200}, hubT:100,
    perfChar:av=>({...(av.c||{})}), perfPoseInfo:()=>true,
    perfCharContorno:(_x,_tx,_ty,_sc,desenhar)=>desenhar(), drawChar:()=>{},
    drawPet:(_x,tipo,px,py,escala,_t,_expressao,pet)=>calls.push({tipo,px,py,escala,pet})
  };
  const perfil = read('perfil.js'), start = perfil.indexOf('function perfPetDoAvatar(');
  const end = perfil.indexOf('function perfHaloTextura(', start);
  assert.ok(start >= 0 && end > start);
  vm.runInNewContext(perfil.slice(start, end), scope);
  vm.runInNewContext(read('banner.js'), scope);
  scope.bannerDia = () => 1; // Dia de jogadores, nunca dia do trio oficial.

  const elenco = scope.bannerElenco();
  assert.equal(elenco.length, 3);
  assert.equal(scope.bannerElenco(), elenco, 'sorteio e cache existentes mantidos');
  const canvas = {beginPath(){},ellipse(){},fill(){}};
  scope.bannerVisitaDesenhar(canvas,640,340,elenco,100,'',340/96,340*.9);
  assert.equal(calls.length, 2, 'Alice e Bia têm Pet; Ceci não tem');
  assert.deepEqual(calls.map(x=>x.pet.k).sort(), ['meu','tsu']);
  assert.equal(calls.find(x=>x.pet.k==='tsu').pet.acc,'laco');
  assert.equal(calls.find(x=>x.pet.k==='meu').pet.cfg.olhos,'fofo');
  assert.ok(calls.every(x=>x.escala>0 && x.px>0 && x.py>0));

  calls.length=0;
  scope.bannerVisitaDesenhar(canvas,320,170,elenco,100,'',170/96,170*.9);
  assert.equal(calls.length,2,'a escala móvel também desenha os dois Pets válidos');
  assert.ok(calls.every(x=>x.px<320 && x.py<170 && x.escala<2));

  calls.length=0;
  scope.bannerVisitaDesenhar(canvas,320,170,[{av:{c:{},pet:{k:'invalido'}}}],100,'',170/96,170*.9);
  assert.equal(calls.length,0,'Pet inválido não é inventado nem desenhado');
});
