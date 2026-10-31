'use strict';
// Offline Sora regression checks; never touch accounts, network or production saves.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../sora-jump.html'),'utf8');
const embedCss=fs.readFileSync(path.join(__dirname,'../sora-embed.css'),'utf8');
function between(a,b){
  const i=html.indexOf(a),j=html.indexOf(b,i+a.length);
  assert.ok(i>=0&&j>i,'Missing source boundaries: '+a+' -> '+b);
  return html.slice(i,j);
}
function evaluate(script,context){
  const env=vm.createContext(context);
  vm.runInContext(script,env);
  return env;
}
// Avoid allocating arrays per frame while keeping each original exclusion rule.
{
  const script=between('function soraCompactAlive(','function soraUpdate(');
  const env=evaluate(script,{});
  for(const mode of [0,1,2,3]){
    const list=mode===0?
      [{id:1,t:3,life:30},{id:2,t:31,life:30},{id:3,t:0,life:20}]:
      [{id:1,y:100},{id:2,y:900},{id:3,y:100,used:true,got:true,done:true},{id:4,y:100,done:true,k:'vento'}];
    const expected=list.filter(v=>mode===0?v.t<(v.life||30):
      mode===1?v.y<600&&!v.used:mode===2?v.y<600&&!v.got:
      v.y<600&&(!v.done||v.k==='vento')).map(v=>v.id);
    const original=list;
    assert.equal(env.soraCompactAlive(list,600,mode),original,'preserve array identity');
    assert.deepEqual(list.map(v=>v.id),expected,'preserve object filter semantics '+mode);
  }
  assert.ok(!html.includes('soraPlats = soraPlats.filter('));
  assert.ok(!html.includes('soraItems = soraItems.filter('));
  assert.ok(!html.includes('soraHazards = soraHazards.filter('));
}
// Pets and accessories must be hydrated after declaration from isolated storage.
{
  const script=between('function soraRestoreSavedLook(){','function petFace(');
  const store={
    brs48cr_acc:'tiaraO',
    brs48cr_pet:JSON.stringify({ativo:'meu',pets:{meu:{nome:'Mimi',cor:'#ff9900'}}})
  };
  const env=evaluate("var accSel='',petData=null,petMk=null;\n"+script,{
    window:{__TW_TEST_STORAGE:{getItem:k=>store[k]??null}}
  });
  assert.equal(env.accSel,'tiaraO');
  assert.equal(env.petData.ativo,'meu');
  assert.equal(env.petMk.nome,'Mimi');
  store.brs48cr_pet='{invalid';
  env.soraRestoreSavedLook();
  assert.equal(env.petData.ativo,'meu','invalid JSON must not discard existing pet');
  assert.ok(html.indexOf('var petData = null')<html.indexOf('soraRestoreSavedLook();'));
  assert.equal((html.match(/var petData = null/g)||[]).length,1);
}
// Audio graph should be disconnected after each note.
{
  let disconnects=0;
  const oscillator={
    frequency:{setValueAtTime(){}},connect(){},disconnect(){disconnects++;},
    start(){},stop(){if(this.onended)this.onended();}
  };
  const gain={gain:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){disconnects++;}};
  const env=evaluate(between('function beep(','var sfx={'),{
    muted:false,ac:()=>({currentTime:0,destination:{},createOscillator:()=>oscillator,createGain:()=>gain})
  });
  env.beep(440,.1);
  assert.equal(disconnects,2);
}
// Both kinds of particles must use world coordinates after camera translation.
{
  const script=between('// Partículas de coleta e pulo:','// 3. Desenha os 4 Itens');
  assert.ok(html.includes('x.translate(0, -soraCamY);'));
  assert.ok(script.includes('py = pt.y;'));
  assert.ok(script.includes('x.arc(pt.x, pt.y,'));
  assert.ok(!script.includes('pt.y - soraCamY'));
  assert.ok(html.includes('if(soraParticles.length>120)'));
}
// Leaving and restoring a mobile iframe must not strand or duplicate RAF.
{
  const script=between('function soraSuspendForNavigation(){','function soraCloseUI(){');
  const handlers={};
  let stops=0,resumes=0,requested=0;
  const env=evaluate(script,{
    soraRaf:5,soraOpen:true,soraState:'play',soraTouchDir:1,
    soraKeyL:true,soraKeyR:true,soraLastT:0,soraSoundOn:true,muted:false,
    soraMusicStop:()=>{stops++;},soraMusicStart:()=>{resumes++;},
    cancelAnimationFrame(){},
    requestAnimationFrame:()=>{requested++;return 8;},soraLoop:()=>{},
    performance:{now:()=>12345},document:{hidden:false},
    window:{addEventListener:(event,cb)=>{handlers[event]=cb;}}
  });
  handlers.pagehide();
  assert.equal(env.soraRaf,0);
  assert.equal(stops,1);
  handlers.pageshow();
  handlers.pageshow();
  assert.equal(env.soraRaf,8);
  assert.equal(requested,1,'pageshow never doubles RAF');
  assert.equal(resumes,1,'audio resumed once');
  assert.ok(html.includes("if(typeof b.onclick==='function')b.onclick.call(b,e);"));
  assert.ok(html.includes("parent.postMessage({type:'tsulipa-games-hub'},location.origin)"));
}
// Embedded stage geometry follows the iframe's available height on short and narrow screens.
// This is CSS-only: the 360x520 game world and gameplay loop remain untouched.
assert.ok(html.includes("style.href='./sora-embed.css?v=8'"),'embedded sizing CSS cache version');
// No pop-up o Sora nao desenha um cartao proprio: so o palco fica emoldurado.
assert.ok(embedCss.includes('background:transparent!important;\n  box-shadow:none!important;'),'painel do Sora sem cartao branco');
// Menu em cartao pastel do site, sem vidro escuro.
assert.ok(embedCss.includes('backdrop-filter:none!important'),'menu do Sora sem aero glass');
assert.ok(/#soraMenuBox\{[^}]*var\(--bg1/.test(embedCss),'menu do Sora usa as cores da pagina');
assert.ok(embedCss.includes('width:min(100%,420px,calc((100dvh - 210px)*360/520))!important;'),'desktop iframe height allowance');
assert.ok(embedCss.includes('width:min(100%,350px,calc((100dvh - 170px)*360/520))!important;'),'mobile portrait height allowance');
assert.ok(embedCss.includes('#soraStage{width:min(100%,360px,calc((100dvh - 175px)*360/520))!important}'),'short landscape height allowance');
// A janela do Sora usa o tema (claro/escuro) da pagina inicial.
assert.ok(html.includes("getAttribute('theme')")||html.includes(".get('theme')"),'Sora lê o tema da página');
assert.ok(embedCss.includes('aspect-ratio:360/520!important;'),'keep original game stage aspect ratio');
assert.ok(html.includes('var SW = 360, SH = 520;'),'original Sora logical resolution is unchanged');
// Gameplay physics/economy unchanged: tested by the existing validate-games suite.
console.log('✓ Sora stability: save, mobile audio, compaction, camera, iframe and bfcache');

/* Embedded Sora opens directly without creating the obsolete blue launcher. */
assert.ok(html.includes("if(!soraHubEmbed){"),'legacy launcher is standalone-only');
assert.ok(html.includes("if(embedded)soraOpenUI();else if(launcher)launcher.click();"),'embedded Sora opens directly');
assert.ok(html.includes("soraPanel.appendChild(histBox);"),'history is relocated into a dedicated full-size screen');
assert.ok(html.includes("soraHistCloseBtn"),'history screen has an explicit close control');
assert.ok(embedCss.includes('.sora-history-screen{'),'history uses a dedicated readable surface');
assert.ok(embedCss.includes('inset:102px 12px 58px!important;'),'history screen uses the full available modal area');
console.log('✓ Sora embedded launcher flash removed; history has dedicated readable screen');
