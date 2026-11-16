// O ano do TsuLiPa (tw-calendario.js): datas fixas, temas e falas do dia que mudam com a data.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function carregar(lang){
  const ctx = { window:{}, LANG:lang || 'pt', Date, Math, Intl,
    TEMAS:[['halloween', '10-24', '11-02'], ['aniversario', '11-10', '11-16'], ['natal', '12-01', '12-26']],
    TEMA_INFO:{ halloween:['', 'Halloween', '', '', '', '', ['#ff8a1f']], aniversario:['', 'Aniversário do BRS48', '', '', '', '', ['#9b30d9']], natal:['', 'Natal', '', '', '', '', ['#e0303a']] },
    EVENTOS:[['morango', '', 'Semana do Morango', 0, 0, '', '#ff6fb5']] };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'tw-calendario.js'), 'utf8'), ctx);
  return ctx.window.TW_CAL;
}

test('o calendário começa no lançamento (27/10/2026) e marca aniversários e datas do grupo', () => {
  const C = carregar();
  assert.strictEqual(C.inicio, '2026-10-27');
  assert.strictEqual(C.diaN('2026-10-27'), 1);
  assert.strictEqual(C.diaN('2026-11-15'), 20);
  assert.strictEqual(C.marcas('2026-10-27').map(m => m.k).join(), 'lanc', 'nada de quadrinho antes de a seção existir');
  ['2026-11-03', '2026-11-10'].forEach(d => assert.ok(!C.marcas(d).some(m => m.k === 'cap'), 'sem capítulo em ' + d));
  assert.match(C.marcas('2026-11-15').filter(m => m.k === 'cap')[0].nome, /Capítulo 1 /, 'capítulo 1 na estreia');
  assert.match(C.marcas('2026-11-22').filter(m => m.k === 'cap')[0].nome, /Capítulo 2 /, 'capítulo 2 no domingo seguinte');
  assert.match(C.marcas('2026-12-20').filter(m => m.k === 'cap')[0].nome, /Capítulo 6 /, 'capítulo 6');
  assert.ok(!C.marcas('2026-11-17').some(m => m.k === 'cap') && !C.marcas('2026-12-27').some(m => m.k === 'cap'));
  assert.strictEqual(C.marcas('2026-12-08').map(m => m.k).join(), '', 'só 6 capítulos');
  assert.strictEqual(C.marcas('2027-10-27').map(m => m.k).join(), 'anivJogo');
  assert.strictEqual(C.marcas('2027-09-05').map(m => m.k).join(), 'anivTsu');
  assert.strictEqual(C.marcas('2027-09-23').map(m => m.k).join(), 'anivPati');
  assert.strictEqual(C.marcas('2026-11-13').map(m => m.k).join(), 'brs48');
  assert.strictEqual(C.doMes(5).k, 'mesLirika', 'a Lirika faz aniversário em maio (sem dia público)');
  assert.strictEqual(C.doMes(8).k, 'geracao', 'agosto: Draft 1st Generation (2021)');
  assert.strictEqual(C.tema('2026-10-31').k, 'halloween');
  assert.strictEqual(C.tema('2026-11-20'), null);
});

test('as falas do dia mudam com a data, com o gênero certo de cada um', () => {
  const C = carregar();
  assert.match(C.fala('2026-10-27').txt, /abriu as portas/);
  assert.strictEqual(C.fala('2026-10-27').quem, 2);
  assert.match(C.fala('2026-10-27').txt, /Obrigado/, 'o Pati fala no masculino');
  assert.match(C.fala('2027-09-05').txt, /Tsu/);
  assert.match(C.fala('2026-12-25').txt, /Feliz Natal/);
  assert.match(C.fala('2026-11-20').txt, /\d+/);
  const en = carregar('en');
  assert.match(en.fala('2026-12-25').txt, /Merry Christmas/);
});

test('o celular mostra o calendário e o card do dia', () => {
  const js = fs.readFileSync(path.join(__dirname, '..', 'tw-celular.js'), 'utf8');
  assert.match(js, /function telaCal\(\)/);
  assert.match(js, /function calHojeHtml\(\)/);
  assert.match(js, /v === 'cal' \? telaCal\(\)/);
  assert.match(js, /porta\('cal', 'cal', tc\('cal'\)/, 'calendário tem porta no Início (o Menu não repete)');
  assert.ok(!/telaPais|data-v="pais"/.test(js), 'sem Cantinho dos pais');
});

test('aniversários dos jogadores no calendário (sem o trio, que já tem os oficiais)', () => {
  const C = carregar();
  C.jogadores([{nick:'Caio', aniver:'11-20'}, {nick:'Duda', aniver:'11-20'}, {nick:'Tsu', aniver:'09-05'}, {nick:'X', aniver:'2026-11-20'}]);
  const m = C.marcas('2026-11-20');
  assert.strictEqual(m.map(x => x.k).join(), 'anivJog');
  assert.match(m[0].nome, /Caio, Duda/);
  assert.strictEqual(C.marcas('2027-09-05').map(x => x.k).join(), 'anivTsu', 'a conta do Tsu não duplica o aniversário oficial');
  assert.match(C.fala('2026-11-20').txt, /Caio, Duda/, 'fala do dia parabeniza');
  const priv = fs.readFileSync(path.join(__dirname, '..', 'privacidade.html'), 'utf8');
  assert.match(priv, /aparece no Calendário do jogo para todo mundo/);
  assert.ok(!/nunca a data/.test(priv), 'privacidade não promete mais esconder a data');
});
