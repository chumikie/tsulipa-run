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
