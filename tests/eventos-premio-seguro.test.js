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
test('Café confirma até 12 pedidos no servidor; preserva a missão da RPC antiga', () => {
  const novo = read('supabase/sql/proposta/PR71_RECORDES_ONLINE_E_INSIGNIAS_REVIEW_ONLY.sql');
  assert.match(cafe,/contaRpc\('cafe_run_iniciar'\)/);
  assert.match(cafe,/contaRpc\('cafe_run_pedido'/);
  assert.match(cafe,/contaRpc\('cafe_run_etapa',args\)/);
  assert.match(cafe,/contaRpc\('cafe_run_finalizar'/);
  assert.match(cafe,/contaRpc\('cafe_iniciar'\)/); // fallback antes da migração
  assert.match(cafe,/contaRpc\('cafe_concluir'/); // missão anterior preservada
  assert.match(novo,/private\.cafe_runs/);
  assert.match(novo,/v_r\.rodadas>=12/);
  assert.match(novo,/v_segundos:=extract\(epoch FROM clock_timestamp\(\)-v_s\.criado\)/);
  assert.match(novo,/combo_max=greatest\(combo_max,v_combo\)/);
  assert.match(novo,/INSERT INTO private\.cafe_resultados/);
  assert.doesNotMatch(novo,/private\.player_badges/);
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

test('Insígnias só entram em players.insignias_jogos depois de prova do servidor', () => {
  const sql = read('supabase/sql/proposta/PR71_RECORDES_ONLINE_E_INSIGNIAS_REVIEW_ONLY.sql');
  const badges = ['jogo_memoria','jogo_barista','jogo_caderno'];
  badges.forEach(k=>assert.match(sql,new RegExp(k)));
  assert.match(sql,/UPDATE public\.players SET insignias_jogos=array_append/);
  assert.match(sql,/combo_max>=10/);
  assert.match(sql,/finalizado IS NOT NULL AND perfeitos=12/);
  assert.match(sql,/count\(\*\)>=20/);
  assert.doesNotMatch(sql,/private\.player_badges/);
});
test('Handshake valida novas partidas depois do presente diário sem duplicar tickets', () => {
  const sql = read('supabase/sql/proposta/PR71_RECORDES_ONLINE_E_INSIGNIAS_REVIEW_ONLY.sql');
  assert.match(hs,/contaRpc\('handshake_run_finish',args\)/);
  assert.match(sql,/CREATE OR REPLACE FUNCTION public\.handshake_run_finish/);
  assert.ok(sql.indexOf("PERFORM private.jogo_registrar(v_id,'hand'") < sql.indexOf('IF v_pontos<600'));
  assert.match(sql,/SELECT \* INTO v_ant FROM public\.handshake_premios WHERE user_id=v_id AND dia=v_dia/);
  assert.match(sql,/sessao_origem/); // recupera prêmio de sessão repetida
  assert.doesNotMatch(sql,/UPDATE public\.players SET stars/);
});
