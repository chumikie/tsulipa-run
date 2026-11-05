'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const pet = fs.readFileSync(path.join(__dirname, '..', 'pet.js'), 'utf8');
const reacao = pet.slice(pet.indexOf('function petLifeCompanhiaVisual('), pet.indexOf('function petLifePoseEscolher('));
const personalidade = pet.slice(pet.indexOf('function petRecepcaoJeito('), pet.indexOf('function petRecepcaoPulo('));

function companhia(){
  const ctx = {Math};
  vm.runInNewContext(personalidade + '\n' + reacao, ctx);
  return ctx.petLifeCompanhiaVisual;
}

test('ML1.3-B: Chu se aproxima e salta uma vez; Koali repousa; Pucchi observa', () => {
  const gesto = companhia();
  assert.ok(Math.abs(gesto('tsu', null, 500, 'sentar', 500, true, false).x) === 0, 'pausa antes de agir');
  const chu = gesto('tsu', null, 545, 'sentar', 500, true, false);
  const koali = gesto('lirika', null, 565, 'descansar', 500, true, false);
  const pucchi = gesto('pati', null, 565, 'sentar', 500, true, false);
  assert.ok(chu.x < 0 && chu.x >= -12 && chu.pulo > 0);
  assert.ok(Math.abs(koali.x) === 0, 'Koali não interrompe a tranquilidade do descanso');
  assert.equal(koali.pulo, 0);
  assert.equal(koali.ex, 'sono');
  assert.ok(pucchi.inclina < 0 && pucchi.sinal === '✧');
  for(const k of ['tsu','lirika','pati']){
    for(let t = 500; t < 625; t++){
      const r = gesto(k, null, t, 'sentar', 500, true, false);
      assert.ok(Math.abs(r.x) <= 12 && r.pulo <= 4, 'amplitude limitada em ' + t);
    }
    assert.equal(gesto(k, null, 625, 'sentar', 500, true, false), null, 'retorno natural sem fila');
  }
  assert.ok(gesto('tsu', null, 600, 'sentar', 500, true, false).x > -12, 'o Pet já retorna ao lugar');
});

test('ML1.3-B: Meu Pet reutiliza a personalidade dos olhos, sem trocar a aparência', () => {
  const gesto = companhia();
  for(const [olhos, base] of [['feliz','tsu'],['sono','lirika'],['curioso','pati']]){
    const cfg = {olhos, pelos:'#b876e7', orelhas:'compridas', acessorio:'laco'};
    const original = JSON.stringify(cfg);
    const custom = gesto('meu', cfg, 65, 'sentar', 0, true, false);
    const especie = gesto(base, null, 65, 'sentar', 0, true, false);
    for(const campo of ['x','pulo','inclina','ex','sinal','alfa']) assert.equal(custom[campo], especie[campo]);
    assert.equal(JSON.stringify(cfg), original, 'não altera cor, orelhas ou acessório');
  }
});

test('ML1.3-B: cuidados, sono, minijogos e toques têm prioridade; não empilha deslocamentos', () => {
  const gesto = companhia();
  for(const livre of [false, 0, null]){
    assert.equal(gesto('tsu', null, 55, 'sentar', 0, livre, false), null);
    assert.equal(gesto('pati', null, 55, 'descansar', 0, livre, true), null);
  }
  assert.equal(gesto('tsu', null, 55, 'conviver', 0, true, false), null, 'a pose já possui aproximação própria');
  assert.equal(gesto('tsu', null, 55, '', 0, true, false), null, 'sem ação não cria gesto');
  assert.equal(gesto('tsu', null, 55, 'sentar', 100, true, false), null, 'não retém gesto de ação futura');
  assert.match(pet,/if\(petGame\)\{ petGameDraw\(x, p\); return; \}/, 'minijogo não desenha reação');
  assert.match(pet,/var podeReagir = !sleepy && !petAnim && petHop <= 0 && p\.fome >= 25 && p\.humor >= 25/);
  assert.match(pet,/!recebendo && petCharT <= 0 && petLove <= 0 && !petEmote/);
  assert.match(pet,/petLifePose === 'conviver' && podeReagir && !petLifePhoneOlhar/);
  assert.doesNotMatch(reacao,/petSave\(|contaRpc\(|setTimeout\(|setInterval\(|requestAnimationFrame\(|localStorage/);
});

test('ML1.3-B: TsuPhone usa um quadro único antes de pausar, com backend simulado', () => {
  const phoneSource = pet.slice(pet.indexOf('function petPhoneAbrir('), pet.indexOf('function petPhoneFechar('));
  const calls = [], nodes = {};
  const el = id => nodes[id] || (nodes[id] = {hidden:false,textContent:'',style:{setProperty(){}},focus(){calls.push('focus');}});
  const ctx = {
    petOpen:true,petView:'room',petGame:null,contaJ:{nick:'Teste'},petAtivo:()=>({nome:'Chu'}),
    petPhoneFotoDono:'',petPhoneFotoChave:()=>'',petPhoneMomentosConferir(){},
    petPhoneJornalLimpar(){},petPhoneJornalFotos:[],petPhoneAgendaDados:null,petPhoneAgendaDono:'',
    LANG:'pt',OSHI:'tsu',$:el,petT:420,
    petDrawRoom(){calls.push('quadro:' + ctx.petLifePhoneOlhar);},
    petAnimParar(){calls.push('pausa');},petPhoneRender(){calls.push('papel');},
    petPhoneAgendaCarregar(){calls.push('agenda');},
    contaRpc(){throw Error('não deve chamar backend');},petSave(){throw Error('não deve salvar');}
  };
  vm.runInNewContext('var petLifePhoneOlhar = false;\n' + phoneSource, ctx);
  assert.equal(ctx.petPhoneAbrir('home'),true);
  assert.equal(ctx.petLifePhoneOlhar,false, 'flag temporária limpa imediatamente');
  assert.deepEqual(calls,['quadro:true','pausa','papel','focus']);
  assert.equal(ctx.petT,420, 'não avança relógio, energia ou necessidades');
  calls.length = 0;ctx.petGame={k:'corrida'};
  assert.equal(ctx.petPhoneAbrir('home'),false);
  assert.deepEqual(calls,[], 'minijogo bloqueia entrada e quadro novo');
});
