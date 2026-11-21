'use strict';
// PR das melhorias (21/11/2026): compartilhar fotos, convite, concurso de visual, app instalável, Hoje com 3 itens,
// jogo da semana em destaque e convite de conta depois da foto.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const ler = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const index = ler('index.html');

test('compartilhar: imagem de data URL vira arquivo e só liga no celular com Web Share', () => {
  const src = ler('tw-marca.js');
  const proto = {click(){}};
  const win = {};
  const ctx = {window:win, document:{addEventListener(){}, createElement(){ return {}; }}, HTMLAnchorElement:{prototype:proto},
    navigator:{}, matchMedia:() => ({matches:false}), File, Uint8Array, atob, decodeURIComponent, CustomEvent:class{}, setTimeout};
  vm.runInNewContext(src, ctx);
  const C = win.TW_COMPARTILHAR;
  assert.ok(C, 'exporta TW_COMPARTILHAR');
  assert.equal(C.ligado(), false, 'sem toque e sem navigator.share: continua baixando');
  const png = 'data:image/png;base64,' + Buffer.from([137, 80, 78, 71]).toString('base64');
  const arq = C.arquivoDe(png, 'foto.png');
  assert.equal(arq.name, 'foto.png'); assert.equal(arq.type, 'image/png'); assert.equal(arq.size, 4);
  assert.equal(C.arquivoDe('https://x/y.png', 'y.png'), null, 'só data: e blob:');
  assert.match(src, /IMG = \/\\\.\(png\|jpe\?g\|webp\)\$\/i/, 'JSON e ICS seguem baixando');
  assert.match(src, /err\.name === 'AbortError'/, 'fechar o compartilhar não baixa à força');
});

test('comunidade: módulo carregado, ligado à conta e com atalhos no Menu', () => {
  assert.match(index, /<script defer src="\.\/tw-comunidade\.js\?v=\d+"><\/script>/);
  assert.match(ler('conta.js'), /window\.TW_COMUNIDADE\.contaMudou\(\)/);
  const cel = ler('tw-celular.js');
  for (const k of ['concurso', 'convite', 'lembrete', 'instalar']) assert.ok(cel.includes(`data-twk="${k}"`), 'Menu: ' + k);
  const src = ler('tw-comunidade.js');
  for (const r of ['convite_meu', 'convite_aceitar', 'convite_conferir', 'concurso_estado', 'concurso_inscrever', 'concurso_votar', 'concurso_resgatar'])
    assert.ok(src.includes(`'${r}'`), 'usa ' + r);
  assert.match(src, /RRULE:FREQ=WEEKLY;BYDAY=SA/, 'lembrete semanal do Show de sábado');
  assert.match(src, /tw-foto-salva/, 'convite de conta depois da foto do visitante');
});

test('comunidade: textos nos 6 idiomas e 8 temas', () => {
  const src = ler('tw-comunidade.js');
  const win = {addEventListener(){}};
  vm.runInNewContext(src, {window:win, addEventListener(){}, document:{readyState:'complete', addEventListener(){}, querySelectorAll(){ return []; }, getElementById(){ return null; }},
    location:{href:'https://tsulipa-world.vercel.app/', origin:'https://tsulipa-world.vercel.app'}, history:{replaceState(){}}, URL, localStorage:{getItem(){ return null; }, setItem(){}, removeItem(){}},
    sessionStorage:{getItem(){ return null; }, setItem(){}}, navigator:{userAgent:''}, matchMedia:() => ({matches:false}), setTimeout, LANG:'ja'});
  assert.ok(win.TW_COMUNIDADE);
  assert.equal(win.TW_COMUNIDADE.t('concurso'), 'コーデコンテスト');
  const TXT = src.slice(src.indexOf('var TXT = {'), src.indexOf('var TEMAS'));
  const linhas = TXT.split('\n').filter((l) => /^\s{4}\w+:\{/.test(l));
  assert.ok(linhas.length >= 30);
  for (const l of linhas) for (const lg of ['pt', 'en', 'es', 'id', 'th', 'ja']) assert.ok(new RegExp(`\\b${lg}:'`).test(l), lg + ' em ' + l.trim().slice(0, 20));
  assert.equal((src.slice(src.indexOf('var TEMAS'), src.indexOf('function L()')).match(/\{pt:/g) || []).length, 8);
});

test('banco: migração do convite e do concurso com regras contra abuso', () => {
  const sql = ler('supabase/migrations/20261121120000_convite_e_concurso_visual.sql');
  assert.match(sql, /interval '7 days'/, 'só conta nova aceita convite');
  assert.match(sql, /< 10/, 'no máximo 10 prêmios de convite por mês');
  assert.match(sql, />= 3 then\s+return json_build_object\('ok', false, 'erro', 'limite'\)/, 'até 3 votos');
  assert.match(sql, /concurso_visual_limpo/, 'visual da inscrição limpo no servidor');
  assert.match(sql, /grant execute on function public\.concurso_estado\(\) to anon, authenticated/);
  assert.match(sql, /grant execute on function public\.concurso_inscrever\(\), public\.concurso_votar\(text\), public\.concurso_resgatar\(\) to authenticated;/);
  assert.match(ler('supabase/tests/auditoria_20261120_pg_integration.sh'), /20261121120000_convite_e_concurso_visual\.sql/);
});

test('app instalável: service worker só guarda o que tem versão e nunca o Supabase', () => {
  const sw = ler('sw.js');
  assert.match(sw, /u\.origin !== self\.location\.origin\) return;/);
  assert.match(sw, /u\.searchParams\.has\('v'\)/);
  assert.match(sw, /req\.mode === 'navigate'/);
  assert.match(sw, /var ATIVO = true;/, 'chave de emergência');
  assert.match(index, /navigator\.serviceWorker\.register\('\/sw\.js'\)/);
  assert.match(index, /location\.protocol === 'https:'/, 'não registra em http (testes locais)');
});

test('Início e Jogos: Hoje com até 3 itens variados; jogo da semana primeiro', () => {
  const cel = ler('tw-celular.js');
  assert.match(cel, /escolha\.length < 3/);
  assert.match(cel, /giro = \['jogo', 'gente', 'mapa', 'leitura'\]/);
  assert.match(cel, /if\(sem && ks\.indexOf\(sem\) > 0\) ks = \[sem\]\.concat/);
  assert.match(ler('tw-semana.js'), /jogoDaSemana:function\(\)/);
});

test('insígnias novas no perfil e traduzidas', () => {
  const perfil = ler('perfil.js');
  assert.match(perfil, /\['convite', +'🎉', 'Abre-alas'/);
  assert.match(perfil, /\['look_semana', '📸', 'Look da semana'/);
  const i18n = ler('tw-i18n.js');
  for (const k of ['Abre-alas', 'Look da semana']) assert.ok(i18n.includes(`['${k}', `), k);
});

test('parte 2: duetos, metas do álbum e recorde da semana no banco', () => {
  const sql = ler('supabase/migrations/20261121150000_duetos_metas_recorde_semana.sql');
  assert.match(sql, /when 3 then 10 when 6 then 20 when 10 then 30 when 15 then 50/);
  assert.match(sql, /when 5 then 10 when 15 then 25 when 30 then 40 when 50 then 60/);
  assert.match(sql, /l\.para <> p_uid/, 'cena consigo mesmo não conta');
  assert.match(sql, /json_array_elements\(coalesce\(public\.album_cards\(\)/, 'mesma contagem do álbum');
  assert.match(sql, /grant execute on function public\.duo_album\(\), public\.duo_album_resgatar\(int\), public\.album_metas\(\), public\.album_meta_resgatar\(int\), public\.meu_recorde_semana\(\) to authenticated;/);
  assert.match(ler('supabase/tests/auditoria_20261120_pg_integration.sh'), /20261121150000_duetos_metas_recorde_semana\.sql/);
});

test('parte 2: site — Duo, álbum, corrida, perfil e retrospectiva', () => {
  const com = ler('tw-comunidade.js');
  for (const r of ['duo_album', 'duo_album_resgatar', 'meu_recorde_semana']) assert.ok(com.includes(`'${r}'`), r);
  assert.match(com, /searchParams\.get\('perfil'\)/, 'abre perfil pelo link');
  assert.match(com, /tw_retro_auto_/, 'retrospectiva automática uma vez por mês e por conta');
  assert.match(ler('centerrun-corrida.js'), /new CustomEvent\('tw-corrida-fim'/);
  assert.match(ler('centerrun.js'), /TW_CORRIDA_ARQ='\.\/centerrun-corrida\.js\?v=18'/);
  const album = ler('album.js');
  assert.match(album, /contaRpc\('album_metas'\)/);
  assert.match(album, /contaRpc\('album_meta_resgatar'/);
  const i18n = ler('tw-i18n.js');
  assert.equal((i18n.match(/"Faltam \{n\} Idols para a próxima meta":/g) || []).length, 4, 'EN/ES/TH/JA');
});

test('parte 3: economia e começo do jogo no banco', () => {
  const sql = ler('supabase/migrations/20261121180000_economia_e_estreia.sql');
  assert.match(sql, /'kit_estreia'\)/);
  assert.match(sql, /interval '14 days'/, 'trilha só para conta nova');
  assert.match(sql, /15 \* cardinality\(v_pagos\)/, '★15 por jogo no primeiro resultado do dia');
  assert.match(sql, /round\(b\.preco \* 0\.7\)/, 'promoção de 30%');
  assert.match(sql, /if v_giros<3 or v_seca then r:=0; end if;/, 'começo garantido e garantia');
  assert.match(sql, /if v_faltam>=3 then/, 'card novo primeiro');
  assert.match(sql, /saldo>=3 returning saldo/, 'pó: 3 repetidos');
  assert.match(sql, /'custo_troca',3/);
  assert.match(ler('supabase/tests/auditoria_20261120_pg_integration.sh'), /20261121180000_economia_e_estreia\.sql/);
});

test('parte 3: site — kit, trilha, bônus, promoção, loja e pó', () => {
  const src = ler('tw-estreia.js');
  for (const r of ['kit_estreia_estado', 'kit_estreia_resgatar', 'trilha_estado', 'trilha_resgatar', 'bonus_jogos_dia', 'promo_semana'])
    assert.ok(src.includes(`'${r}'`), r);
  assert.match(index, /<script defer src="\.\/tw-estreia\.js\?v=\d+"><\/script>/);
  assert.match(ler('conta.js'), /window\.TW_ESTREIA\.contaMudou\(\)/);
  assert.match(ler('perfil.js'), /twPrecoLoja\(it\[0\], it\[3\]\)/);
  assert.match(ler('perfil.js'), /\['trilha', +'🌱', 'Primeira semana'/);
  const po = ler('gacha-po.js');
  assert.doesNotMatch(po, /5 pós|5 dust|5 polvos|5 debu|ผง 5|5ダスト/);
  assert.match(po, /custo_troca \|\| 3/);
});

test('parte 4: Encontro e Rival no Hoje, sequência das Missões, Sora e selo Novo', () => {
  const cel = ler('tw-celular.js');
  assert.match(cel, /data-a="encontro"/, 'Encontro do dia no Hoje e no Menu');
  assert.match(cel, /if\(a === 'encontro'\)\{ if\(typeof encBtn !== 'undefined' && encBtn\.onclick\) encBtn\.onclick\(\); return; \}/);
  assert.match(cel, /data-a="battle-rival"/);
  assert.match(cel, /data-a="encontro"\/\.test\(h\) \? 'gente'/, 'Encontro conta como tarefa de gente');
  assert.match(cel, /twc-novo/);
  const est = ler('tw-estreia.js');
  for (const r of ['battle_status', 'missoes_sequencia']) assert.ok(est.includes(`'${r}'`), r);
  assert.match(est, /if\(v === null\)\{ gravarLS\('tw_loja_vista', a\); return false; \}/, 'sem selo falso na primeira visita');
  const sora = ler('sora-jump.html');
  assert.match(sora, /_supabase\.rpc\('meu_recorde_semana'\)/);
  assert.match(sora, /if\(typeof soraSemanaCarregar === 'function'\) soraSemanaCarregar\(\);[^\n]*\n  if\(soraOnlineUserId\) soraOnlineLoadProfile\(\);\n  else \{/, 'não separa o if do else');
  const sql = ler('supabase/migrations/20261121200000_sequencia_missoes.sql');
  assert.match(sql, /count\(distinct k\) >= 3/);
  assert.match(sql, /case m when 3 then 15 else 40 end/);
});

test('parte 5: conquistas à vista, destaques, pet com rotina e passatempos do dia', () => {
  const idx = ler('index.html');
  for (const f of ['tw-conquistas.js', 'tw-passatempos.js']) assert.ok(idx.includes(`src="./${f}?v=`), f);
  const cq = ler('tw-conquistas.js');
  for (const r of ['meu_progresso_conquistas', 'salvar_destaques', 'destaques_de']) assert.ok(cq.includes(`'${r}'`), r);
  assert.match(cq, /if\(!lerLS\(chaveVisto\(\)\)\) marcarVisto\(\);/, 'sem pontinho falso na primeira vez');
  const tela = ler('perfil-tela.js');
  assert.match(tela, /TW_CONQ\.perfilMontar\(d, meu\)/); assert.match(tela, /TW_CONQ\.abaPerfil\(d, meu\)/);
  const cel = ler('tw-celular.js');
  assert.match(cel, /TW_CONQ\.cartaoHtml\(\)/); assert.match(cel, /twc-eu-ponto/); assert.match(cel, /data-twpa="abrir"/);
  assert.match(cel, /var escolha = continuar \? \[continuar\] : \[\];/, 'o Continuar fica sempre à vista');
  // pet: noite em Brasília conta pela metade
  const pet = ler('pet.js'), i = pet.indexOf('function petDiaBR'), j = pet.indexOf('\n}\n', pet.indexOf('function petHorasNoite')) + 3;
  const ctx = {}; require('vm').runInNewContext(pet.slice(i, j) + ';this.H=petHorasNoite;', ctx);
  const t0 = Date.parse('2026-11-21T03:00:00Z');
  assert.equal(ctx.H(t0, t0 + 24 * 36e5), 8); assert.equal(ctx.H(Date.parse('2026-11-21T13:00:00Z'), Date.parse('2026-11-21T19:00:00Z')), 0);
  assert.match(ler('pet-sala.js'), /function petXP\(p, n, tipo\)/);
  // passatempos: sorteio igual para todo mundo no mesmo dia
  const pa = ler('tw-passatempos.js');
  assert.match(pa, /sorteio\(hoje\(\) \+ ':caca'\)/); assert.match(pa, /rpc\('passatempo_feito', \{p_tipo:tipo\}\)/);
  assert.ok(ler('perfil.js').includes("['jogo_passatempo', '🧩', 'Passatempo em dia'"));
  const sql = ler('supabase/migrations/20261121220000_conquistas_perfil.sql');
  assert.match(sql, /coalesce\(array_length\(p_ins, 1\), 0\) > 5/); assert.match(sql, /check \(tipo in \('caca', 'dif', 'lab'\)\)/);
});

test('parte 6: bicolor no admin, Responder recado, vitórias do Battle na semana e canvas dos passatempos', () => {
  assert.match(ler('admin.js'), /lado2:\/\^#\[0-9a-f\]\{6\}\$\/i\.test\(c\.lado2\|\|''\)/, 'admin envia o lado2');
  const sql = ler('supabase/migrations/20261121220000_conquistas_perfil.sql');
  assert.match(sql, /ELSIF lower\(coalesce\(v_atual->>'lado2', ''\)\) ~ '\^#\[0-9a-f\]\{6\}\$' THEN/, 'servidor mantém o lado2');
  assert.match(sql, /'battle', \(select count\(\*\) from private\.battle_partidas/);
  assert.match(ler('perfil-tela.js'), /data-perfresp="/); assert.match(ler('tw-conquistas.js'), /function responder\(nick\)/);
  assert.match(ler('tw-celular.js'), /thj\('vitSemana', \{n:\+sm\.battle\}\)/);
  const pa = ler('tw-passatempos.js');
  assert.doesNotMatch(pa, /jogarColorir/, 'Colorir foi removido'); assert.equal((pa.match(/<canvas data-nitido="0"/g) || []).length, 3, 'canvas dos passatempos cuidam da própria nitidez');
});
