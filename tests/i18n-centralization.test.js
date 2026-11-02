'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const index = require('./site-source.js')();   // index.html + módulos extraídos (refatoração da PR #62)
const i18nSource = fs.readFileSync(path.join(root, 'tw-i18n.js'), 'utf8');
const sandbox = { window: {} };
vm.runInNewContext(i18nSource, sandbox, { filename: 'tw-i18n.js' });
const registry = sandbox.window.TW_I18N;
const languages = ['en', 'es', 'th', 'ja'];
const expectedTables = {
 PET_DICT:{en:17,es:17,th:17,ja:17}, PET_DICT2:{en:20,es:20,th:20,ja:24},
 PET_DICT3:{en:2,es:2,th:2,ja:2}, PET_DICT4:{en:36,es:36,th:36,ja:36},
 PET_DICT5:{en:6,es:6,th:6,ja:6}, PET_DICT6:{en:2,es:2,th:2,ja:2},
 PET_DICT7:{en:5,es:5,th:5,ja:5}, PET_DICT8:{en:31,es:31,th:31,ja:31},
 PET_DICT10:{en:8,es:8,th:8,ja:8}, PET_FALAS_TR:{en:82,es:82,th:82,ja:82},
 CONTA_DICT:{en:17,es:17,th:17,ja:17}, PERF_DICT:{en:60,es:60,th:60,ja:60},
 PERF_DICT2:{en:62,es:62,th:62,ja:62}, PERF_ADMIN_DICT:{en:18,es:15,th:14,ja:14},
 ADM_DICT:{en:27,es:27,th:27,ja:27}, HUB_DICT:{en:64,es:64,th:64,ja:64},
 EXTRA_DICT_GACHA:{en:20,es:15,th:15,ja:15},
 EXTRA_DICT_AVATAR:{en:23,es:23,th:23,ja:19},
 S2_DICT:{en:18,es:18,th:18,ja:18}
};
const expectedRows = {
 seasonalAchievements:76, profileEditorLabels:16, profileActivityLabels:32,
 birthdayLabels:22, homeIntroLabels:11, moonDuoLabels:74,
 gachaCardBirthdayLabels:14, moonDuoAccessoryLabels:6,
 moonDuoProfileLabels:44, miscStatusLabels:9, encounterLabels:7,
 pageHintLabels:8, adminActionLabels:5, groupEncounterLabels:2,
 seasonalThemeInfoLabels:7
};
const expectedLocale = [
 'TW_INDEX2_TUT_I18N','labels','twGamesTxt','TW_MIC_WORDS','TW_RANK_WORDS',
 'tvOpenLabels','tvCloseLabels','twPreviewTextos','TW_SORA_SOM_TEXTOS','S2_BONUS_LABELS'
];
test('all dictionaries remain centralized with complete language maps and alphabetic Portuguese keys', () => {
 assert.ok(registry && registry.tables);
 assert.deepEqual(Object.keys(registry.tables).sort(), Object.keys(expectedTables).sort());
 for (const [name,counts] of Object.entries(expectedTables)) {
  const table=registry.tables[name]; assert.ok(table,name+' exists');
  for (const lang of languages) {
   assert.ok(table[lang],name+'.'+lang+' exists');
   const keys=Object.keys(table[lang]);
   assert.equal(keys.length,counts[lang],name+'.'+lang+' count');
   assert.deepEqual(keys,[...keys].sort((a,b)=>a.localeCompare(b,'pt-BR')),name+'.'+lang+' sorted');
  }
 }
});
test('translated five-column row catalogues are complete and alphabetic', () => {
 assert.deepEqual(Object.keys(registry.rows).sort(),Object.keys(expectedRows).sort());
 for (const [name,count] of Object.entries(expectedRows)) {
  const rows=registry.rows[name]; assert.ok(rows,name+' exists');
  assert.equal(rows.length,count,name+' row count');
  assert.ok(rows.every(row=>Array.isArray(row)&&row.length===5),name+' PT/EN/ES/TH/JA columns');
  const keys=Array.from(rows,row=>row[0]);
  assert.deepEqual(keys,[...keys].sort((a,b)=>a.localeCompare(b,'pt-BR')),name+' sorted');
 }
});
test('remaining localized UI label sets are centralized', () => {
 for (const name of expectedLocale) {
  assert.ok(registry.locale[name],name+' exists');
  assert.ok(Object.keys(registry.locale[name]).length>=2,name+' populated');
 }
});
test('legacy aliases and original merge sites are preserved', () => {
 for (const name of Object.keys(expectedTables).filter(n=>!n.startsWith('EXTRA_DICT'))) {
  assert.ok(index.includes('var '+name+' = window.TW_I18N.tables.'+name+';'),name+' alias');
  assert.doesNotMatch(index,new RegExp('var '+name+'\\s*=\\s*\\{'),name+' inline map removed');
 }
 assert.ok(index.includes('var EXTRA_DICT = window.TW_I18N.tables.EXTRA_DICT_GACHA;'));
 assert.ok(index.includes('var EXTRA_DICT = window.TW_I18N.tables.EXTRA_DICT_AVATAR;'));
 for (const name of Object.keys(expectedRows)) assert.ok(index.includes('window.TW_I18N.rows.'+name),name+' row moved');
 for (const name of expectedLocale) assert.ok(index.includes('var '+name+' = window.TW_I18N.locale.'+name+';'),name+' locale alias');
 assert.ok(index.indexOf('src="./tw-i18n.js') < index.indexOf('var DICT=window.TW_DICT'),'i18n loads before DICT use');
 for (const name of ['PET_DICT','PET_DICT2','PET_DICT3','PET_DICT4','PET_DICT5','PET_DICT6','PET_DICT7','PET_DICT8','PET_DICT10','PET_FALAS_TR','CONTA_DICT','ADM_DICT','HUB_DICT','S2_DICT']) {
  assert.ok(index.includes(name+').forEach'),name+' legacy merge still present');
 }
 assert.ok(index.includes('[PERF_DICT, PERF_DICT2, PERF_ADMIN_DICT].forEach'));
 assert.ok(index.includes('Object.keys(EXTRA_DICT).forEach'));
 assert.ok(index.includes('Object.keys(S2_DICT).forEach'));
 assert.ok(!index.includes("['Dueto', 'Duet', 'Dueto', 'ดูเอ็ต', 'デュエット']"),'Moon Duo translation rows are not inline');
});
test('representative original translations are unchanged', () => {
 assert.equal(registry.tables.PET_DICT.en.Camarim,'Dressing room');
 assert.equal(registry.tables.CONTA_DICT.en['Entrar com Google'],'Sign in with Google');
 assert.equal(registry.tables.PERF_DICT.en.Perfil,'Profile');
 assert.equal(registry.tables.PET_DICT6.ja.Cantar,'うたう');
 assert.equal(registry.tables.PET_FALAS_TR.en['Nyaa! Hoje eu brilho mais que estrela! ☆(ゝω・)v'],"Nyaa! Today I'm shining brighter than a star! ☆(ゝω・)v");
});
