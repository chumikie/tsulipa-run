// "Esta semana", selo do site nas imagens, nomes acessíveis e carregamento (20/11/2026).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const raiz = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(raiz, f), 'utf8');

test('tw-semana: todos os textos nos 6 idiomas e nada de estrela calculada no navegador', () => {
  const src = ler('tw-semana.js');
  const ctx = {window:{}, document:{readyState:'complete', addEventListener(){}, getElementById(){ return null; }, body:{setAttribute(){}, removeAttribute(){}}}, setTimeout(){}, Promise, Event:function(){}, LANG:'pt'};
  ctx.window.dispatchEvent = () => {};
  vm.runInNewContext(src.replace("document.addEventListener('click'", "(function(){})('click'"), ctx);
  const m = src.match(/var TX = (\{[\s\S]*?\n  \});/);
  assert.ok(m, 'dicionário TX');
  const TX = vm.runInNewContext('(' + m[1] + ')');
  for(const [k, v] of Object.entries(TX)) for(const l of ['pt', 'en', 'es', 'id', 'th', 'ja']) assert.ok(v[l], k + ' sem ' + l);
  assert.ok(!/starT\s*\+=/.test(src), 'o saldo só muda pelo que o servidor devolve');
  assert.match(src, /rpc\('show_sabado_marcar'\)/);
  assert.match(src, /rpc\('festa_resgatar'\)/);
});

test('migração da semana: RPCs que dão prêmio exigem login e as de leitura aceitam visitante', () => {
  const sql = ler('supabase/migrations/20261120160000_semana_show_festa_jogos.sql');
  for(const f of ['show_sabado_marcar()', 'festa_resgatar()', 'admin_uso_jogos(integer)']) {
    assert.ok(sql.includes('revoke all on function public.' + f + ' from public, anon;'), f + ' fechada para visitante');
    assert.ok(sql.includes('grant execute on function public.' + f + ' to authenticated;'), f + ' aberta para quem entrou');
  }
  for(const f of ['show_sabado_estado()', 'festa_estado()', 'jogo_da_semana()'])
    assert.ok(sql.includes('grant execute on function public.' + f + ' to anon, authenticated;'), f + ' pública');
  assert.match(sql, /private\.kt_runs r where r\.player_id = v_uid and r\.dia = v_dia and r\.finished_at is not null/, 'o show exige música terminada no servidor');
  assert.match(sql, /if not public\.eh_admin\(\)/, 'uso dos jogos só para a moderação');
  assert.match(sql, /order by \(k = \(select k from js\)\) desc, h limit 1/, 'missão nível 1 prefere o Jogo da semana');
});

test('selo do site nos PNGs baixados e nomes acessíveis carregados no index', () => {
  const html = ler('index.html');
  assert.match(html, /<script src="\.\/tw-marca\.js\?v=\d+"><\/script>/);
  assert.match(html, /<script defer src="\.\/tw-acessibilidade\.js\?v=\d+"><\/script>/);
  assert.match(html, /<script defer src="\.\/tw-semana\.js\?v=\d+"><\/script>/);
  for(const f of ['gacha.js', 'battle.js', 'shop.js', 'duo-tela.js', 'studio.js', 'album-fotos.js', 'jornal.js', 'centerrun-corrida.js', 'pet-sala.js', 'tw-celular.js'])
    assert.match(ler(f), /twMarcaPng/, f + ' usa o selo ao salvar');
  const marca = ler('tw-marca.js');
  assert.match(marca, /tsulipa-world\.vercel\.app/);
});

test('fontes próprias: o Google Fonts só entra em japonês', () => {
  const html = ler('index.html');
  assert.match(html, /<link rel="stylesheet" href="\.\/kt-fonts\.css\?v=\d+">/);
  assert.ok(!/<link href="https:\/\/fonts\.googleapis\.com/.test(html), 'sem a folha de 146 KB no carregamento comum');
  assert.match(html, /if\(l==='ja'\)twFontesJa\(\)/);
});
