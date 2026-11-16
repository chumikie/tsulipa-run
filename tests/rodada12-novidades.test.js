// Rodada 12: show com cartas (habilidades no ritmo), quadrinhos em capítulos, tour de camarins e missões novas.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ler = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');

test('Battle: cada card tem uma habilidade que dispara no ritmo, sem mexer no placar do servidor', () => {
  const js = ler('battle.js');
  assert.match(js, /function habilidade\(c\)/);
  assert.match(js, /ritmo\.combo>=3&&!ritmo\.sk\[ri\]/, 'dispara com 3 batidas seguidas na rodada do card');
  assert.match(js, /ganho=5\+\(hb===ri\?3:0\)/, 'combina com a rodada: +3 corações');
  assert.ok(!/rodadas\[[^\]]+\]\.eu\s*[+*]?=/.test(js), 'as habilidades não alteram os pontos que vieram do servidor');
  const sk = js.slice(js.indexOf('var T_SKILL='), js.indexOf('Object.keys(T_SKILL)'));
  ['pt', 'en', 'es', 'id', 'th', 'ja'].forEach(l => assert.ok(sk.includes(l + ":['"), 'habilidades em ' + l));
});

test('Idol⭐News!: história em capítulos, um por terça desde o lançamento', () => {
  const ctx = { window:{}, LANG:'pt', Date, Math, JSON };
  vm.createContext(ctx);
  vm.runInContext(ler('jornal-capitulos.js'), ctx);
  const caps = vm.runInContext('JN_CAPS', ctx);
  assert.strictEqual(caps.length, 6);
  caps.forEach(c => { assert.strictEqual(c[2].length, 3, 'três quadros por capítulo'); c[2].forEach(q => q[3].forEach(f => ['pt', 'en', 'es', 'id', 'th', 'ja'].forEach(l => assert.ok(f[1][l], 'fala em ' + l)))); });
  assert.strictEqual(vm.runInContext('jnCapData(0)', ctx), '2026-10-27');
  assert.strictEqual(vm.runInContext('jnCapData(3)', ctx), '2026-11-17');
  assert.match(ler('jornal.js'), /vida \+= jornalCapsHtml\(\)/);
  assert.ok(!/<script src="\.\/jornal-capitulos\.js/.test(ler('index.html')), 'quadrinhos fora da abertura');
  assert.match(ler('jornal.js'), /JORNAL_CAPS_ARQ = '\.\/jornal-capitulos\.js\?v=\d+'/, 'baixam quando o Idol News abre');
});

test('Tour de camarins: RPCs do servidor e o seu camarim volta intacto depois de desenhar o dos outros', () => {
  const js = ler('tw-celular.js');
  assert.match(js, /contaRpc\('camarim_tour'\)/);
  assert.match(js, /contaRpc\('camarim_ver', \{p_nick:nick\}\)/);
  assert.match(js, /contaRpc\('camarim_coracao', \{p_nick:nick\}\)/);
  assert.match(js, /finally\{ petData = o\.data; petArrumo = o\.arr; petBg = o\.bg; OSHI = o\.oshi;/);
  const sql = ler('supabase/migrations/20261115233000_camarim_tour.sql');
  assert.match(sql, /primary key \(de, para, dia\)/, 'um coração por dia em cada camarim');
  assert.match(sql, /grant execute on function public\.camarim_coracao\(text\) to authenticated;/);
});

test('Missões do dia: Karaoke e Sora entram, com progresso vindo do servidor', () => {
  const sql = ler('supabase/migrations/20261115230000_missoes_karaoke_sora.sql');
  assert.match(sql, /\('karaoke',1,1,10,'karaoke'\),\('sora',1,1,10,'sora'\)/);
  assert.match(sql, /private\.kt_runs WHERE player_id=p_id AND dia=p_dia AND finished_at IS NOT NULL/);
  const hub = ler('hub.js');
  assert.match(hub, /karaoke:\['🎤', 'Cantar no Karaoke⭐Time!'\], sora:\['☁️', 'Pule de nuvem em nuvem no Sora⭐Jump!'\]/);
  assert.match(ler('tw-i18n.js'), /"Pule de nuvem em nuvem no Sora⭐Jump!":"Hop from cloud to cloud in Sora⭐Jump!"/);
});
