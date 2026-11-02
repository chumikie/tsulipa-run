'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const catalog=JSON.parse(read('translations/id/preview-catalog.json'));
test('ID disponível sob demanda nos três jogos, com os outros idiomas',()=>{
  for(const page of ['index.html','karaoke-time.html','sora-jump.html']){
    const src=read(page);
    assert.match(src,/translations\/id\/preview-data\.js/);
    assert.ok(src.indexOf("get('lang')==='id'")>=0);
  }
  assert.match(read('index.html'),/<button data-l="id">🇮🇩 ID<\/button>/);
  assert.match(read('hub.js'),/\['id', '🇮🇩 ID'\]/);
  for(const lang of ['pt','es','en','th','ja'])assert.match(read('index.html'),new RegExp('data-l="'+lang+'"'));
  assert.equal(catalog.karaoke.rows.length,202);
  assert.equal(catalog.karaoke.patterns.length,6);
  assert.equal(Object.keys(catalog.sora).length,147);
});
test('arquivo sob demanda preserva catálogos originais e aplica sexta coluna',()=>{
  const context={window:{}};
  vm.runInNewContext(read('tw-i18n.js'),context);
  const original=JSON.stringify(context.window.TW_I18N.rows);
  const en=JSON.stringify(context.window.TW_DICT.en);
  vm.runInNewContext(read('translations/id/preview-data.js'),context);
  assert.equal(JSON.stringify(context.window.TW_DICT.en),en);
  const rows=context.window.TW_I18N.rows;
  assert.ok(Object.values(rows).every(r=>r.every(row=>row.length===6)));
  assert.equal(JSON.stringify(Object.fromEntries(Object.entries(rows).map(([k,v])=>[k,v.map(row=>row.slice(0,5))]))),original);
  assert.ok(Object.keys(context.window.TW_DICT.id).length>0);
});
test('índices e placeholders das linhas do Karaoke',()=>{
  const html=read('karaoke-time.html');
  const start=html.indexOf('var ROWS=[',html.indexOf('id="ktTraducoes"'));
  const end=html.indexOf('],PAT=',start);
  const source=vm.runInNewContext(html.slice(start+9,end+1));
  assert.equal(source.length,catalog.karaoke.rows.length);
  source.forEach((row,i)=>{
    assert.equal(row.length,5,'cinco colunas originais: '+i);
    assert.equal(typeof catalog.karaoke.rows[i],'string');
    assert.ok(catalog.karaoke.rows[i].trim(),'índice vazio '+i);
  });
  const ids=new Set(source.map(row=>row[0]));
  assert.equal(ids.size,source.length);
});
test('falha de carregamento do catálogo não ativa ID nem afeta outros idiomas',()=>{
  const karaoke=read('karaoke-time.html');
  const lang=karaoke.match(/var LANG=\(function\(\)\{.*?\}\)\(\),OSHI=/s);
  assert.ok(lang,'inicialização do idioma Karaoke');
  function choose(search,stored,loaded){
    const sandbox={URLSearchParams,location:{search},localStorage:{getItem:()=>stored},window:{TW_ID_PREVIEW_DATA:loaded}};
    vm.runInNewContext(lang[0].replace(/,OSHI=$/,''),sandbox);
    return sandbox.LANG;
  }
  assert.equal(choose('?lang=id','en',undefined),'pt');
  assert.equal(choose('?lang=id','en',{karaoke:{}}),'id');
  assert.equal(choose('','id',{karaoke:{}}),'id');
  for(const l of ['pt','en','es','th','ja'])assert.equal(choose('?lang='+l,'pt',undefined),l);
  assert.match(read('sora-jump.html'),/if\(window\.TW_ID_PREVIEW_DATA&&.*LANG='id'/);
  assert.match(read('index.html'),/if\(LANG==='id'&&!window\.TW_ID_PREVIEW_DATA\)LANG='pt'/);
});
