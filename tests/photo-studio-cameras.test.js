'use strict';
// Regression: the three Photo Studio choices must not show three full-body Idols.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');

test('Photo Studio: rosto, meio and inteiro have genuinely different crops', () => {
  const source = fs.readFileSync(path.join(root, 'perfil.js'), 'utf8');
  const start = source.indexOf('function perfDesenharIdol(');
  const end = source.indexOf('\nfunction perfFoto', start);
  assert.ok(start >= 0 && end > start, 'avatar painter function is present');
  const scope = {
    PERF_RANKVIS: {}, state: 'play', pw: null, dpw: null, rankI: 0,
    sash: false, accSel: '', frame: 0, charPose: '', perfAntena: '',
    perfChar: () => ({skin: '#ffd5bd', hair: '#623455'}),
    perfPetDoAvatar: () => ({}),
    perfPoseInfo: () => false,
    perfCharContorno: () => {},
    perfDesenharPetEm: () => {}
  };
  vm.runInNewContext(source.slice(start, end) + '\nthis.paintIdol = perfDesenharIdol;', scope);
  const canvas = {beginPath(){}, ellipse(){}, fill(){}};
  const frames = ['rosto', 'meio', 'inteiro'].map(mode =>
    scope.paintIdol(canvas, 432, 540, {}, false, false, 0, mode));
  assert.ok(frames[0].scale > frames[1].scale && frames[1].scale > frames[2].scale,
    'close-up > half-body > full-body');
  const cut = frames.map(frame => (540 - frame.y) / frame.scale);
  // Medidas do desenho na tela: boca ≈17, ombros ≈22, bermuda ≈33, pés ≈42, sombra ≈46.
  assert.ok(cut[0] > 20 && cut[0] < 31, 'portrait ends around the shoulders');
  assert.ok(cut[1] > 34 && cut[1] < 44, 'half-body ends around the shorts');
  assert.ok(cut[2] > 46, 'full-body fits through the shoes and shadow');
});

test('Studio photo and mural reuse the same camera and props renderer', () => {
  const source = fs.readFileSync(path.join(root, 'studio.js'), 'utf8');
  assert.match(source, /perfDesenharIdol\(x, W, H, av, false, false, tm \* 60, (?:e\.)?quadro/);
  assert.match(source, /function polaroid\(/);
  assert.match(source, /cena\(x, fw, fh, e, typeof tempo === 'number' \? tempo : 1, av\)/);
  assert.match(source, /objetoNaMao\(x, e.objeto, av.pose, corpo/);
});

test('Studio saves and keeps a single clean PNG, independent of the animated visible canvas', () => {
  const s = fs.readFileSync(path.join(root,'studio.js'),'utf8');
  assert.match(s,/capturarCena\(capturada\)/);
  // 20/11/2026: o download leva o selo do site (tw-marca.js) numa cópia da polaroid limpa; sem o selo, a mesma fotoUrl
  assert.match(s,/a\.href = \(window\.twMarcaPng \? window\.twMarcaPng\(polaroidLimpa\(foto\)\) : fotoUrl\(foto\)\)/);
  assert.match(s,/petPhoneMomentoAbrir\(id\)/);
  assert.match(s,/petPhoneMomentoAdicionar\('studio', fotoUrl\(foto\), especie\)/);
  assert.doesNotMatch(s.slice(s.indexOf('function polaroidLimpa('),s.indexOf('function chips(')),/brilhos\(/);
  let conversions = 0;
  const ctx = {polaroidLimpa:() => ({toDataURL:() => {conversions++;return 'cleanPNG';}})};
  vm.runInNewContext(s.slice(s.indexOf('function fotoUrl('),s.indexOf('function salvar(')),ctx);
  const f = {};
  assert.equal(ctx.fotoUrl(f),'cleanPNG');assert.equal(ctx.fotoUrl(f),'cleanPNG');assert.equal(conversions,1);
});

test('Memórias Eternas: retrato conserva cabelo, roupa, expressão e fase do clique mesmo após editar o Idol', () => {
  const s=fs.readFileSync(path.join(root,'studio.js'),'utf8');
  const ctx={window:{},document:{}};ctx.window=ctx;vm.runInNewContext(s,ctx);
  const R=ctx.TW_STUDIO_RETRATO;
  const atual={c:{hair:'#ff7eb6',skin:'#f1c9a5',out:'sweet',legcol:'#1c1c30',streak:true},a:'laco',expr:4,visual:'',cor:'#ff6fb5',id:'privado',email:'private@example.invalid',pet:{k:'meu',nome:'privado',cfg:{cor:'#aabbcc',olhos:'brilho',nome:'privado'}}};
  const foto=R.limpar({v:1,avatar:atual,tempo:123.45});
  atual.c.hair='#00ff00';atual.c.out='rock';atual.expr=1;atual.pet.cfg.cor='#000000';
  for(const proprio of [true,false]){
    const r=R.ler({retrato:foto,avatar:atual},proprio);
    assert.equal(r.avatar.c.hair,'#ff7eb6');assert.equal(r.avatar.c.out,'sweet');assert.equal(r.avatar.expr,4);assert.equal(r.tempo,123.45);
    assert.equal(r.avatar.pet.cfg.cor,'#aabbcc');
    assert.doesNotMatch(JSON.stringify(r),/privado|private@example/);
  }
  assert.equal(R.ler({avatar:atual},true).avatar,null,'legado próprio mantém desenho atual');
  assert.equal(R.ler({avatar:atual},false).avatar,atual,'legado de outro jogador mantém retorno antigo');
  assert.equal(R.ler({avatar:atual,retrato:{v:8}},false).avatar,atual);
  assert.equal(R.limpar({v:1,avatar:atual,tempo:-1}),null);
  const mal=R.limpar({v:1,tempo:0,avatar:{c:{hair:'<script>',out:{x:1},det:'ok',streak:'false'},a:'https://x.invalid',expr:99,pet:{k:'meu',cfg:{cor:'bad',nome:'secret'}}}});
  assert.equal(JSON.stringify(mal.avatar),'{"c":{"det":"ok"},"pet":{"k":"meu","cfg":{}}}');
  assert.match(s,/p\.retrato = capturada\.retrato/);
  assert.match(s,/r\.retrato_guardado !== true/);
  assert.doesNotMatch(s,/foto\.avatar = foto\.retrato\.avatar/);
  assert.match(s,/retratoPost\(c, false\)/);
});

test('Studio controls keep the color sample, name and selected indicator together', () => {
  const s=fs.readFileSync(path.join(root,'studio.js'),'utf8');
  const ctx={esc:String,t:String,esc_:{luz:'neon'},ocupado:false,nomeOpc:(_,v)=>v,marca:()=>'<i class="stsw"></i>'};
  vm.runInNewContext(s.slice(s.indexOf('  function chips('),s.indexOf('  function ui(')),ctx);
  const html=ctx.chips('luz',['suave','neon']);
  assert.match(html,/aria-pressed="true"><i class="stsw"><\/i><span>neon<\/span><i class="stcheck" aria-hidden="true">✓/);
  assert.match(html,/aria-pressed="false"><i class="stsw"><\/i><span>suave/);
  const css=fs.readFileSync(path.join(root,'hub-polish.css'),'utf8');
  assert.match(css,/#studioVisor\[data-fase="monta"\][^\{]*\{position:sticky/);
});
