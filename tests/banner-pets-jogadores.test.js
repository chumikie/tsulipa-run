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

test('banner consulta uma vez os Pets dos perfis públicos quando a vitrine traz só o avatar', async () => {
  const consultados = [], desenhos = [];
  const scope = {
    PET_SP:{tsu:{},lirika:{},pati:{},meu:{}}, PET_MK_DEF:{},
    hubIdolsDados:{idols:[
      {nick:'Alice',avatar:{c:{}}}, {nick:'Bia',avatar:{c:{}}}, {nick:'Ceci',avatar:{c:{}}}
    ]},
    contaRpc:(nome,params) => {
      consultados.push([nome,params.p_nick]);
      return Promise.resolve({
        Alice:{ativo:'pati',pets:[{k:'tsu',acc:'laço'},{k:'pati',acc:'coroa'}]},
        Bia:{ativo:'',pets:[{k:'meu',cfg:{olhos:'fofo'}}]},
        Ceci:{pets:[]}
      }[params.p_nick]);
    },
    HUB_TRIO:[[0,'v',.2],[1,'v',.5],[2,'v',.78]],
    HUB_REAGE:{i:-1,t0:0,dur:200},hubT:100,
    perfChar:av=>({...(av.c||{})}),perfPoseInfo:()=>true,
    perfCharContorno:(_x,_tx,_ty,_sc,desenhar)=>desenhar(),drawChar:()=>{},
    drawPet:(_x,tipo,px,py,escala,_t,_expressao,pet)=>desenhos.push({tipo,px,py,escala,pet})
  };
  const perfil = read('perfil.js'), start=perfil.indexOf('function perfPetDoAvatar('), end=perfil.indexOf('function perfHaloTextura(',start);
  vm.runInNewContext(perfil.slice(start,end),scope);
  vm.runInNewContext(read('banner.js'),scope);
  scope.bannerDia=()=>1;
  const elenco=scope.bannerElenco();
  scope.bannerElenco();scope.bannerElenco();
  await new Promise(resolve=>setImmediate(resolve));
  assert.equal(consultados.length,3,'uma leitura por jogador, sem repetição por quadro');
  assert.ok(consultados.every(c=>c[0]==='perfil_publico'),'reutiliza somente RPC pública existente');
  assert.equal(elenco.find(p=>p.nick==='Alice').pet.k,'pati','prioriza o Pet ativo do perfil');
  assert.equal(elenco.find(p=>p.nick==='Bia').pet.k,'meu','usa o Pet público disponível se não há ativo');
  assert.equal(elenco.find(p=>p.nick==='Ceci').pet,null,'não inventa Pet para quem não tem');
  const canvas={beginPath(){},ellipse(){},fill(){}};
  scope.bannerVisitaDesenhar(canvas,320,170,elenco,100,'',170/96,170*.9);
  assert.deepEqual(desenhos.map(x=>x.pet.k).sort(),['meu','pati']);
  assert.ok(desenhos.every(x=>x.px<320 && x.py<170),'mantém desenho dentro do banner móvel');
});
