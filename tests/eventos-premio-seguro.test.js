'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = (name) => fs.readFileSync(path.join(root, name), 'utf8');
const hs = read('handshake.js');
const cafe = read('cafe.js');
const prize = read('supabase/sql/proposta/20261103200000_handshake_premio.sql');
const missions = read('supabase/sql/proposta/20261103210000_missoes_handshake_cafe.sql');

test('Handshake registra respostas validadas pelo desafio do servidor, não pontuação livre', () => {
  assert.match(hs, /contaRpc\('handshake_iniciar'\)/);
  assert.match(hs, /p_sessao:atual\.servidor\.sessao,p_respostas:atual\.respostas/);
  assert.doesNotMatch(hs, /handshake_premio'\s*,\s*\{\s*p_pontos/);
  assert.match(prize, /DROP FUNCTION IF EXISTS public\.handshake_premio\(integer\)/);
  assert.match(prize, /v_verd:=\(v_s\.desafios/);
  assert.match(prize, /v_pontos<600/);
});
test('Prêmio é uma concessão única por conta/dia, sem criar estrelas', () => {
  assert.match(prize, /PRIMARY KEY\(user_id,dia\)/);
  assert.match(prize, /FOR UPDATE/);
  assert.match(prize, /private\.kt_ticket_wallet\.balance<99/);
  assert.match(prize, /reason IN .*'handshake'/s);
  assert.doesNotMatch(prize, /UPDATE public\.players SET stars/i);
});
test('Pet aplica o mesmo prêmio uma vez ao aparelho, inclusive se RPC repetir', () => {
  const start = hs.indexOf('function hsAplicarPet(r){');
  const end = hs.indexOf('function hsReceberPremio(', start);
  assert.ok(start >= 0 && end > start);
  let petData = { inv: {}, hsPremios: {} }, saves = 0;
  const make = new Function('petData','contaJ','petLoad','petSave', hs.slice(start, end) + '\nreturn hsAplicarPet;');
  const apply = make(petData, { id:'pessoa-1' }, () => {}, () => { saves++; });
  assert.equal(apply({tipo:'pet',item:'dango',dia:'2026-11-03'}), true);
  assert.equal(apply({tipo:'pet',item:'dango',dia:'2026-11-03'}), true);
  assert.equal(petData.inv.dango, 1);
  assert.equal(saves, 1);
});
test('Café valida pedido com sessão e ingredientes antes da missão', () => {
  assert.match(cafe,/contaRpc\('cafe_iniciar'\)/);
  assert.match(cafe,/contaRpc\('cafe_concluir',args\)/);
  assert.match(missions,/v_correto:=\(p_monta->>'base'\)/);
  assert.match(missions,/INSERT INTO private\.cafe_resultados/);
});
test('Missões de ★10 dependem de resultados privados e não de marcar_visita', () => {
  assert.match(missions,/\('handshake',1,1,10,'evento'\)/);
  assert.match(missions,/\('cafe',1,1,10,'evento'\)/);
  assert.match(missions,/private\.handshake_resultados/);
  assert.match(missions,/private\.cafe_resultados/);
  assert.doesNotMatch(hs,/contaRpc\('marcar_visita'/);
  assert.doesNotMatch(cafe,/contaRpc\('marcar_visita'/);
  assert.match(missions,/CREATE OR REPLACE FUNCTION public\.marcar_visita/);
  assert.match(missions,/AND acertos>=1/);
  assert.match(missions,/erro','prova/);
});

test('Café sinaliza também a falha definitiva de comprovação, além da pendência', () => {
  assert.match(cafe, /atual\.provaEstado='sem_comprovacao'/);
  assert.match(cafe, /cf\.provaEstado==='confirmado'/);
  assert.match(cafe, /cf\.provaEstado==='pendente'/);
  assert.match(cafe, /else if\(cf\.provaEstado==='sem_comprovacao'\).*⚠️/);
});
