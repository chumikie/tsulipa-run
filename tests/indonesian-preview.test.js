'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const catalog=JSON.parse(read('translations/id/preview-catalog.json'));
test('rótulos dinâmicos do hub acompanham PT → ID → EN → ID',()=>{
  const src=read('hub.js');
  const start=src.indexOf('function hubGameAbrir(nome){');
  const end=src.indexOf('\nfunction hubCardsUI(){',start);
  assert.ok(start>=0&&end>start);
  const context={LANG:'pt'};
  vm.runInNewContext(src.slice(start,end),context);
  for(const [lang,expected] of [['pt','Abrir Sora Jump'],['id','Buka Sora Jump'],['en','Open Sora Jump'],['id','Buka Karaoke Time']]){
    context.LANG=lang;
    assert.equal(vm.runInNewContext('hubGameAbrir('+JSON.stringify(expected.includes('Karaoke')?'Karaoke Time':'Sora Jump')+')',context),expected);
  }
  assert.match(src,/if\(runBack\)runBack\.textContent='← '\+tr\('Início'\)/);
  assert.match(src,/if\(dailyRun\)dailyRun\.textContent=tr\('📅 Corrida do dia'\)/);
});
test('ID disponível sob demanda nos três jogos, com os outros idiomas',()=>{
  for(const page of ['index.html','karaoke-time.html','sora-jump.html']){
    const src=read(page);
    assert.match(src,/translations\/id\/preview-data\.js/);
    assert.ok(src.indexOf("get('lang')==='id'")>=0);
  }
  assert.match(read('index.html'),/<button data-l="id">ID<\/button>/);
  assert.match(read('hub.js'),/\['id', 'ID'\]/);
  const menu=read('index.html').match(/<div class="lang"[\s\S]*?<\/div>/)[0];
  assert.ok(menu.indexOf('data-l="en"')<menu.indexOf('data-l="id"'));
  assert.ok(menu.indexOf('data-l="id"')<menu.indexOf('data-l="th"'));
  const hub=read('hub.js');
  assert.ok(hub.indexOf("['id', 'ID']")<hub.indexOf("['th', 'TH']"));
  assert.match(read('index.html'),/twCarregarIdiomaId\(\)\.then/);
  assert.match(read('index.html'),/if\(window\.TW_ID_PREVIEW_DATA\)\{\s*twIntegrarDicionariosId\(\);/);
  assert.doesNotMatch(read('index.html'),/location\.reload\(\)/);
  assert.match(hub,/twGamesTxt = twGamesTxt\[LANG\]\|\|twGamesTxt\.pt/);
  assert.match(hub,/hubIdolsTituloUI\(\);/);
  assert.match(read('centerrun.js'),/DICT\.id&&DICT\.id\[k\]/);
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
test('carregamento dinâmico incorpora as traduções dos módulos e das linhas',()=>{
  const context={window:{},refreshAcc:()=>{}};
  vm.runInNewContext(read('tw-i18n.js'),context);
  vm.runInNewContext(read('translations/id/preview-data.js'),context);
  const html=read('index.html');
  const start=html.indexOf('function twIntegrarDicionariosId(){');
  const end=html.indexOf('\nfunction twCarregarIdiomaId(){',start);
  assert.ok(start>=0&&end>start);
  assert.equal(context.window.TW_DICT.id['Adote um pet!'],undefined);
  vm.runInNewContext(html.slice(start,end),context);
  assert.equal(vm.runInNewContext('twIntegrarDicionariosId()',context),true);
  assert.equal(context.window.TW_DICT.id['Adote um pet!'],catalog.central.tables.HUB_DICT['Adote um pet!']);
  assert.equal(context.window.TW_DICT.id['✨ Idols que você pode conhecer! ⭐'],catalog.central.rows.seasonalThemeInfoLabels[1]);
  assert.match(context.window.TW_DICT.id['Duas amizades, mil cenas! Monte poses, danças e lanchinhos com outro Idol.'],/^Dua sahabat,/);
  assert.equal(context.window.TW_DICT.id['Abrir Sora Jump'],'Buka Sora Jump');
  assert.equal(context.window.TW_DICT.id['Abrir Karaoke Time'],'Buka Karaoke Time');
});
test('índices e placeholders das linhas do Karaoke',()=>{
  const html=read('kt-traducoes.js');
  const start=html.indexOf('var ROWS=[');
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

test('ID assíncrono só atualiza home e menu após carregar; PT → ID → EN → ID',async()=>{
  const html=read('index.html');
  const begin=html.indexOf('var twIdCarregamento=null, twIdiomaEscolhaToken=0;');
  const end=html.indexOf('// --- SISTEMA DE PHOTOCARD POLAROID ---',begin);
  assert.ok(begin>0&&end>begin,'ciclo de troca de idioma disponível');
  const actions=[], scripts=[], state={};
  const buttons=['pt','es','en','id','th','ja'].map(l=>({
    dataset:{l},disabled:false,click(){this.onclick();}
  }));
  const context={
    window:{TW_DICT:{id:{}},TW_I18N:{rows:{}}},
    document:{
      querySelectorAll:()=>buttons,
      querySelector:()=>buttons.find(b=>b.dataset.l==='id'),
      createElement:()=>({}),
      head:{appendChild:s=>scripts.push(s)}
    },
    LANG:'pt',
    localStorage:{setItem:(k,v)=>{state[k]=v;}},
    $:()=>({hidden:true}),
    hubMontar:()=>actions.push('hub:'+context.LANG),
    applyLang:()=>actions.push('apply:'+context.LANG),
    setBest:()=>{},refreshAcc:()=>{},showLb:()=>{},
    console:{warn:()=>{}}
  };
  vm.createContext(context);
  vm.runInContext(html.slice(begin,end),context,{timeout:1000});
  const choose=l=>buttons.find(b=>b.dataset.l===l).click();
  choose('id');
  assert.equal(buttons[3].disabled,true,'primeiro clique aguarda o catálogo');
  assert.deepEqual(actions,[],'não redesenha a home ainda em português');
  context.window.TW_ID_PREVIEW_DATA={central:{tables:{},rows:{}}};
  scripts[0].onload();
  await new Promise(setImmediate);
  assert.equal(context.LANG,'id');
  assert.equal(state.brs48cr_lang,'id');
  assert.equal(buttons[3].disabled,false);
  assert.deepEqual(actions.slice(0,2),['hub:id','apply:id']);
  choose('en'); choose('id');
  assert.equal(context.LANG,'id');
  assert.deepEqual(actions.slice(-4),['hub:en','apply:en','hub:id','apply:id']);
  const hubClick=html.slice(html.indexOf('if(t.dataset && t.dataset.hl){'),html.indexOf('if(t.dataset && t.dataset.ho !== undefined)'));
  assert.doesNotMatch(hubClick,/hubMontar\(\)/,'hub não antecipa a tradução');
});

test('uma troca posterior prevalece sobre o carregamento lento do ID',async()=>{
  const html=read('index.html');
  const begin=html.indexOf('var twIdCarregamento=null, twIdiomaEscolhaToken=0;'),end=html.indexOf('// --- SISTEMA DE PHOTOCARD POLAROID ---',begin);
  const scripts=[],buttons=['id','en'].map(l=>({dataset:{l},disabled:false,click(){this.onclick();}}));
  const context={
    window:{TW_DICT:{id:{}},TW_I18N:{rows:{}}},
    document:{querySelectorAll:()=>buttons,querySelector:()=>buttons[0],createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}},
    LANG:'pt',localStorage:{setItem:()=>{}},$:()=>({hidden:true}),
    hubMontar:()=>{},applyLang:()=>{},setBest:()=>{},refreshAcc:()=>{},showLb:()=>{},console:{warn:()=>{}}
  };
  vm.createContext(context);vm.runInContext(html.slice(begin,end),context);
  buttons[0].click();buttons[1].click();
  context.window.TW_ID_PREVIEW_DATA={central:{tables:{},rows:{}}};
  scripts[0].onload();await new Promise(setImmediate);
  assert.equal(context.LANG,'en','carga atrasada não muda a escolha mais recente');
});

test('o jornal localiza nomes de paisagens e conjunções; itens ID são atualizados na inicialização',()=>{
  const jornal=read('jornal.js'),html=read('index.html');
  assert.match(jornal,/tr\(KaraokeRoomViews\.NAMES\[f\.local\] \|\| f\.local\)/);
  assert.match(jornal,/var elencoBanner = noBanner\.length > 1 \? tr\('\{a\} e \{b\}'\)/);
  assert.match(html,/if\(window\.TW_ID_PREVIEW_DATA\)\{\s*twIntegrarDicionariosId\(\);[\s\S]*?refreshAcc\(\);\s*\}/);
  const id=JSON.parse(read('translations/id/preview-catalog.json'));
  assert.equal(id.central.dict['Tailândia'],'Thailand');
  assert.equal(id.central.tables.PET_DICT4['Estrela'],'Bintang');
});

test('painel de login redesenha rótulos de privacidade após mudar idioma',()=>{
  const s=read('index.html');
  assert.match(s,/applyLang\(\);[\s\S]*?if\(typeof contaUI==='function'\)contaUI\(\);/);
});
