'use strict';
// 22/11/2026: os looks do Center⭐Run! viram roupas de vestir (c.out = 'cr_…'), liberadas pelo recorde do Idol,
// com desenho de frente (nas três cópias do drawChar) e de lado (tw-lado.js). O banco do admin confere o mesmo recorde.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const R = require('../tw-avatar-roupa.js');
const root = path.join(__dirname, '..');
const ler = f => fs.readFileSync(path.join(root, f), 'utf8');

const RECORDE = { cr_fever:450, cr_ima:1000, cr_mega:1800, cr_alien:2800, cr_center:5000, cr_solo:10000, cr_capitao:15000, cr_ace:30000, cr_kami:50000 };
const html = ler('index.html'), adm = ler('admin.js'), sql = ler('supabase/migrations/20261122120000_roupas_center_run.sql');

// lista "Roupa" do menu: cada look com o recorde que libera; o mesmo número no admin e no banco
for (const [k, r] of Object.entries(RECORDE)) {
  assert.match(html, new RegExp('<option value="' + k + '" data-r="' + r + '" data-crn="'), 'opção no menu com o recorde: ' + k);
  assert.match(adm, new RegExp("\\['" + k + "','[^']+'," + r + '\\]'), 'admin com o mesmo recorde: ' + k);
  assert.equal((sql.match(new RegExp("WHEN '" + k + "' THEN " + r + '\\b', 'g')) || []).length, 2, 'admin_vestir e admin_montar_idol com o mesmo recorde: ' + k);
  assert(R.cr(k), 'tw-avatar-roupa reconhece ' + k);
}
assert.equal(R.cr('rock'), null, 'roupa da lojinha não é look do Center⭐Run!');
assert.equal(R.cr(''), null);
assert.deepEqual([1, 2, 3, 4, 5].map(n => Object.keys(RECORDE).find(k => R.cr(k).of === n)), ['cr_center', 'cr_solo', 'cr_capitao', 'cr_ace', 'cr_kami'], 'uniformes na ordem dos ranks');
assert(R.cr('cr_alien').alien, 'Abdução = macacão espacial');
assert.doesNotMatch(sql, /stars|star_log|preco/i, 'a migração não mexe em estrelas nem em preço');
assert.match(sql, /Aplicada em produção/, 'migração marcada como aplicada');

// de frente: Fever, Ímã e Mega têm look próprio; nas cores que o Fever e o Ímã dão ao uniforme na corrida
function fake(){ const log = []; const grad = () => ({ addColorStop(){} }); return { log, fillStyle:'',
  save(){}, restore(){}, beginPath(){}, closePath(){}, moveTo(){}, lineTo(){}, rect(){}, roundRect(){}, ellipse(){}, bezierCurveTo(){}, clip(){},
  fill(){ log.push('fill:' + this.fillStyle); }, fillRect(){ log.push('rect:' + (typeof this.fillStyle === 'string' ? this.fillStyle : 'grad')); },
  createLinearGradient:grad, createRadialGradient:grad }; }
for (const fx of ['fever', 'ima', 'mega']) {
  const g = fake(); assert.equal(R.crLook(g, {}, 0, 0, fx), true, 'look desenhado: ' + fx);
  assert(g.log.includes('rect:' + R.CR_COR[fx][0]) && g.log.includes('fill:' + R.CR_COR[fx][1]), 'blusa e saia nas cores do ' + fx);
}
assert.equal(R.crLook(fake(), {}, 0, 0, 'xx'), false);
assert.deepEqual(R.CR_COR.fever.slice(0, 2), ['#ff6fa5', '#ffc2dc'], 'Fever: o rosa do drawChar');
assert.deepEqual(R.CR_COR.ima.slice(0, 2), ['#b392f0', '#dccdfa'], 'Ímã: o lilás do drawChar');

// as três cópias do drawChar: look vestido vira uniforme (sem passar por cima do rank alcançado nem da abdução)
for (const f of ['centerrun.js', 'karaoke-time.html', 'sora-jump.html']) {
  const s = ler(f);
  assert(s.includes("if (CRX && !OF && !ALV) { if (CRX.of) OF = CRX.of; else if (CRX.alien) ALV = true; }"), f + ': look vestido vira uniforme ou macacão');
  assert(s.includes('}else if(CRX&&CRX.fx&&TWR&&TWR.crLook(g,c,x,y,CRX.fx,E,T)){'), f + ': Fever, Ímã e Mega de frente');
  assert(s.indexOf('if (CRX && !OF && !ALV)') > s.indexOf("if (PX && PX.k === 'alien') OF = 0;"), f + ': a abdução continua vencendo');
}

// de lado: correndo com rank, abdução e Fever/Ímã (antes voltava a ficar de frente)
const cr = ler('centerrun.js'), lado = ler('tw-lado.js');
assert.doesNotMatch(cr, /TW_LADO\.corre && OF === 0/, 'a vista de lado não exige mais OF 0');
assert.match(cr, /TW_LADO\.corre\(g, c, x, y, expr, frame, run === 0 \? \.8 : run, OUT, A, \{of:OF, alien:ALV, px:/, 'a corrida passa o uniforme para a vista de lado');
for (const k of ['of1', 'of2', 'of3', 'of4', 'of5', 'espacial']) assert.match(lado, new RegExp("RP === '" + k + "'"), 'uniforme de lado: ' + k);
for (const k of ['fever', 'ima', 'mega']) assert.match(lado, new RegExp("FXL === '" + k + "'"), 'look de lado: ' + k);
assert.match(lado, /if\(OFL === 3\)\{   \/\/ capa vermelha/, 'capa do Capitão de lado');
assert.match(lado, /if\(OFL === 5\)\{   \/\/ asas da Kami-Oshi/, 'asas da Kami-Oshi de lado');
assert.match(lado, /\/\/ auréola/, 'auréola de lado');
assert.match(lado, /if\(ALV\)\{   \/\/ anteninhas de alien/, 'anteninhas da abdução de lado');
assert.match(lado, /var Q = 3, w = 44 \* Q, h = 67 \* Q;/, 'quadro de lado com espaço para a auréola');
assert.match(html, /tw-lado\.js\?v=7/); assert.match(html, /centerrun\.js\?v=47/); assert.match(html, /tw-avatar-roupa\.js\?v=\d+/);
console.log('✓ roupas do Center⭐Run!: menu, admin, banco, frente e lado');
