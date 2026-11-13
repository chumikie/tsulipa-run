// Empacota apenas os rascunhos públicos; não modifica os arquivos do jogo.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const base = __dirname;
const read = (name) => JSON.parse(fs.readFileSync(path.join(base, name), 'utf8'));
const names = fs.readdirSync(base).filter((name) => name.endsWith('.json') && name !== 'preview-catalog.json');
const central = {dict: read('TW_DICT.json'), tables: {}, rows: {}, locale: read('locale.json')};
const karaoke = {dict: {}, rows: [], patterns: read('karaoke-patterns.json').translations, queue: read('karaoke-demo-queue.json'), rhythm: read('karaoke-rhythm-labels.json'), rhythmHelp: read('karaoke-rhythm-hit-help.json').KR_RHYTHM_HIT_HELP};
for (const name of names) {
  if (/^rows-/.test(name)) Object.assign(central.rows, read(name));
  else if (name !== 'TW_DICT.json' && (/^[A-Z].*_DICT\d*\.json$/.test(name) || name === 'PET_FALAS_TR.json' || name === 'S2_DICT.json' || name === 'EXTRA_DICT_GACHA.json' || name === 'EXTRA_DICT_AVATAR.json')) central.tables[name.replace(/\.json$/, '')] = read(name);
  else if (/^karaoke-dict-/.test(name) || name === 'karaoke-inline-visible.json') Object.assign(karaoke.dict, read(name));
  else if (/^karaoke-rows-/.test(name)) {
    const entry = read(name);
    entry.translations.forEach((translation, offset) => {
      const index = entry.startIndex + offset;
      if (karaoke.rows[index] !== undefined) throw Error('Índice de Karaoke duplicado: ' + index);
      karaoke.rows[index] = translation;
    });
  }
}
if (karaoke.rows.length !== 202 || karaoke.rows.some((value) => typeof value !== 'string')) throw Error('Cobertura incompleta do Karaoke');
const sora = [...read('sora-dict-core.json').translations, ...read('sora-dict-world-and-ui.json').translations];
if (sora.length !== 147) throw Error('Cobertura incompleta do Sora');
const karaokeHtml = fs.readFileSync(path.join(base, '..', '..', 'kt-traducoes.js'), 'utf8');
const rowStart = karaokeHtml.indexOf('var ROWS=[');
const rowEnd = karaokeHtml.indexOf('],PAT=', rowStart);
const sourceRows = vm.runInNewContext(karaokeHtml.slice(rowStart + 9, rowEnd + 1));
if (sourceRows.length !== karaoke.rows.length) throw Error('Fontes do Karaoke mudaram');
const karaokeDict = {...karaoke.dict};
sourceRows.forEach((row, i) => { karaokeDict[row[0]] = karaoke.rows[i]; });
karaoke.dict = karaokeDict;
const soraHtml = fs.readFileSync(path.join(base, '..', '..', 'sora-jump.html'), 'utf8');
const baseStart = soraHtml.indexOf('var DICT={');
const baseEnd = soraHtml.indexOf('};\nfunction tr', baseStart);
const extraStart = soraHtml.indexOf('var SORA_DICT = {');
const extraEnd = soraHtml.indexOf('};', extraStart);
const soraBase = vm.runInNewContext('(' + soraHtml.slice(baseStart + 9, baseEnd + 1) + ')');
const soraExtra = vm.runInNewContext('(' + soraHtml.slice(extraStart + 16, extraEnd + 1) + ')');
const soraKeys = new Set([...Object.keys(soraBase.en), ...Object.keys(soraExtra.en)]);
for (const match of soraHtml.matchAll(/Object.assign\(SORA_DICT.en,(\{[^\n]+\})\);/g)) {
  for (const key of Object.keys(vm.runInNewContext('(' + match[1] + ')'))) soraKeys.add(key);
}
if (soraKeys.size !== sora.length) throw Error('Fontes do Sora mudaram');
const soraDict = {};
[...soraKeys].forEach((key, i) => { soraDict[key] = sora[i]; });
const output = {central, karaoke, sora: soraDict};
fs.writeFileSync(path.join(base, 'preview-catalog.json'), JSON.stringify(output));
const runtime = `/* Prévia ID opt-in; não adiciona botão público. Gerado de translations/id/. */\n` +
  `window.TW_ID_PREVIEW_DATA=${JSON.stringify(output)};\n` +
  `(function(){var p=window.TW_ID_PREVIEW_DATA;if(!window.TW_I18N||!window.TW_DICT)return;window.TW_DICT.id=p.central.dict;` +
  `Object.keys(p.central.tables).forEach(function(k){if(window.TW_I18N.tables[k])window.TW_I18N.tables[k].id=p.central.tables[k];});` +
  `Object.keys(p.central.rows).forEach(function(k){var rows=window.TW_I18N.rows[k],v=p.central.rows[k];if(!rows||rows.length!==v.length)throw Error('TW ID rows: '+k);rows.forEach(function(row,i){row[5]=v[i];});});` +
  `Object.keys(p.central.locale).forEach(function(k){if(window.TW_I18N.locale[k])window.TW_I18N.locale[k].id=p.central.locale[k];});})();\n`;
fs.writeFileSync(path.join(base, 'preview-data.js'), runtime);
console.log('Catálogo de prévia ID gerado:', Buffer.byteLength(JSON.stringify(output)), 'bytes');
