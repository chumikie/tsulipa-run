// 19/11/2026: a dica de timing do resultado (#118) leva direto ao "Medir sozinho" (#117).
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const html = fs.readFileSync('karaoke-time.html', 'utf8');
const show = fs.readFileSync('karaoke-show.js', 'utf8');

test('o botão aparece junto com a dica e some sem ela', () => {
  assert.match(show, /var medir=D\.\$\(\)\('ktResultMedir'\); if\(medir\)medir\.hidden=!resumo\.sugerir;/);
});

test('o botão fecha o resultado, abre o Ajustar timing e chama o Medir sozinho sem começar a medida', () => {
  const i = html.indexOf("var dica=$('ktResultTimingTip')");
  assert(i > 0, 'bloco do botão existe');
  const bloco = html.slice(i, html.indexOf('})();', i));
  assert.match(bloco, /bt\.id='ktResultMedir'/);
  assert.match(bloco, /bt\.textContent=cal\.medir/, 'mesmo texto do botão do painel, nos 6 idiomas');
  assert.match(bloco, /res\.close\(\)/);
  assert.match(bloco, /adjust\.open=true/);
  assert.match(bloco, /medirBt\.focus/);
  assert(!/calibrarComecar/.test(bloco), 'a medida só começa no toque da pessoa');
  // o bloco vem depois de medirBt/cal/msg/adjust existirem
  assert(html.indexOf('medirBt=$(\'ktCalMedir\')') < i);
});

test('o destaque respeita quem pediu menos movimento', () => {
  assert.match(html, /@media \(prefers-reduced-motion:reduce\)\{\.kt-cal-chamar\{animation:none/);
});
