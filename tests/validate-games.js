// Static pre-merge checks for the TsuLiPa World special games.
// Run: node tests/validate-games.js
// No packages, database credentials or network access required.
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const games=[
  {file:"index2.html",max:1050000},
  {file:"sora-jump-karaoke.html",max:40000},
  {file:"sora-jump.html",max:400000},
  {file:"karaoke-day.html",max:150000},
  {file:"karaoke-online-lab.html",max:30000}
];
let errors=[];
const read=name=>fs.readFileSync(path.join(root,name),"utf8");
const assert=(ok,message)=>{if(!ok)errors.push(message);};

for(const game of games){
  let content;
  try{content=read(game.file);}catch(e){errors.push("Missing "+game.file);continue;}
  const bytes=Buffer.byteLength(content,"utf8");
  assert(bytes<game.max,game.file+": over HTML size budget ("+bytes+" bytes)");
  assert(content.includes("</body>")&&content.includes("</html>"),game.file+": missing closing HTML tags");
  let count=0;
  for(const match of content.replace(/<!--[\s\S]*?-->/g,"").matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)){
    if(/\bsrc\s*=/i.test(match[1]))continue;
    count++;
    try{new vm.Script(match[2],{filename:game.file+":inline-"+count});}
    catch(e){errors.push(game.file+": invalid JavaScript (script "+count+"): "+e.message);}
  }
  assert(count>0,game.file+": no inline game JavaScript found");
  console.log("✓",game.file,bytes+" bytes",count+" inline scripts");
}

let hub="",karaoke="",sora="",preview="";
try{
  hub=read("sora-jump-karaoke.html");
  preview=read("index2.html");
  karaoke=read("karaoke-day.html");
  sora=read("sora-jump.html");
}catch(_){/* Already reported above */}

for(const ref of ["sora-jump.html","karaoke-day.html"]){
  assert(hub.includes('data-open="'+ref+'"'),"Hub missing launcher for "+ref);
}
assert(hub.includes("games-theme.css"),"Hub missing shared theme");
assert(preview.includes('class="hubcard tw-hubgame')&&preview.includes("twPreviewAbrirJogo"),
  "index2 missing integrated game cards or launchers");
assert(preview.includes('name="robots" content="noindex,nofollow,noarchive"'),"index2 must be noindex");
assert(!read("index.html").includes("twPreviewAbrirJogo"),"Production index.html must not contain preview-specific code");
assert(sora.includes("games-theme.css"),"Sora missing shared theme");
assert(karaoke.includes("games-theme.css"),"Karaoke missing shared theme");
const rehearsal=read("karaoke-online-lab.html"),model=read("karaoke-room-model.js");
assert(rehearsal.includes('name="robots" content="noindex,nofollow,noarchive"')&&
       rehearsal.includes("SIMULAÇÃO LOCAL")&&
       rehearsal.includes('src="./karaoke-room-model.js"')&&
       rehearsal.includes("9 vagas")&&
       rehearsal.includes("Não conta para o ranking"),
  "Offline rehearsal must be transparent about fake users and scores");
assert(model.includes("CAPACITY=9")&&model.includes("TURN_MS=60000")&&
       model.includes("RHYTHM_MS=45000")&&model.includes('verification:"demo_unverified"')&&
       !model.includes("_supabase")&&!model.includes(".rpc("),
  "Offline room model must never connect to the live database");

assert(sora.includes("soraSetupUI")&&sora.includes("soraOpenUI"),"Sora core integration missing");
assert(karaoke.includes("rpc/karaoke_posteres_semana"),"Karaoke missing shared weekly avatar RPC");
assert(karaoke.includes("krAgendarLoop")&&karaoke.includes("logicalW=960,logicalH=540"),
  "Karaoke mobile draw/click coordination changed");
assert(karaoke.includes('id="krDev" hidden'),"Karaoke simulator must start collapsed");
assert(karaoke.includes("krHandBusy")&&karaoke.includes("krClearHandheld"),
  "Karaoke handheld exclusivity missing");
assert(fs.existsSync(path.join(root,"games-theme.css")),"Missing games-theme.css");
assert(fs.existsSync(path.join(root,"index.html")),"Missing canonical index.html");
const lab=read("index2.html");
assert(lab.includes('data-ir="sora"')&&lab.includes('data-ir="karaoke"'),
  "Index 2 missing new game cards");
assert(lab.includes("function twPreviewAbrirJogo(")&&lab.includes("function twPreviewFecharJogo("),
  "Index V2 missing in-page game overlay");
assert(lab.includes("TW_INDEX2_READ_RPC")&&lab.includes("index2_somente_leitura"),
  "Index 2 missing read-only database guards");
// Preview safety: direct RPC calls must remain limited to the reviewed ranking query.
// Dynamic account calls are separately restricted by the TW_INDEX2_READ_RPC allowlist.
const directRpcCalls=[...lab.matchAll(/_supabase\.rpc\(\s*(['"])([^'"]+)\1/g)].map(m=>m[2]);
assert(directRpcCalls.every(name=>name==="top_scores"),
  "Index 2 contains a direct Supabase RPC beyond top_scores: "+directRpcCalls.join(", "));
assert(lab.includes("e.source!==frame.contentWindow")&&lab.includes("e.origin!==location.origin"),
  "Index 2 must validate iframe message sender and origin");
assert(lab.includes("frame.src='about:blank'")&&lab.includes("if(!wrap||!frame||!wrap.hidden)return"),
  "Index 2 lost iframe teardown or duplicate-launch guard");
assert(lab.includes('twPreviewVoltarTxt')&&lab.includes('twPreviewAtualizarIdioma')&&
       lab.includes('tw-hubgame-jp')&&lab.includes('ソラ・ジャンプ')&&lab.includes('カラオケ・デー'),
  "Index 2 lost translated preview UX or Japanese game subtitles");
assert(lab.includes("card.focus({preventScroll:true})"),
  "Index 2 must restore focus to the game launcher on return");
// INDEX2-only welcome: ordered slides and isolated completion flag, preserving original saves.
const tutorialStart=lab.indexOf("var HUB_TUT = [");
const tutorialEnd=lab.indexOf("var TW_INDEX2_TUT_KEY",tutorialStart);
const tutorialText=lab.slice(tutorialStart,tutorialEnd);
const welcomeOrder=["Meu Perfil","Center⭐Run!","Backstage⭐Pet!","Sora⭐Jump!"];
let lastAt=-1;
for(const label of welcomeOrder){
  const at=tutorialText.indexOf(label);
  assert(at>lastAt,"Index 2 welcome missing or out of order: "+label);
  lastAt=at;
}
assert(lab.includes("var TW_INDEX2_TUT_KEY='tw_index2_tut_v2'")&&
       lab.includes("localStorage.getItem(TW_INDEX2_TUT_KEY)")&&
       lab.includes("localStorage.setItem(TW_INDEX2_TUT_KEY,'1')"),
  "Index 2 welcome should not overwrite brs48cr_tut");
assert(lab.includes("TW_INDEX2_TUT_I18N")&&
       lab.includes("hubTutI===3")&&lab.includes("tw-hubtut-soon")&&
       lab.includes("Karaoke⭐Day! · Em breve"),
  "Index 2 missing Sora intro or Karaoke coming-soon teaser");
const previewSkin=read("index2-skin.css"),soraEmbedSkin=read("sora-embed.css"),karaokeEmbedSkin=read("karaoke-embed.css");
assert(lab.includes('href="./index2-skin.css?v=1"')&&
       previewSkin.includes(".tw-modal.tw-modal-gacha")&&previewSkin.includes(".tw-modal.tw-modal-duo")&&
       lab.includes("tw-modal-star")&&lab.includes("スター・ガチャ")&&lab.includes("ムーン・デュオ"),
  "Index 2 lost unified Gacha / Moon Duo modal design");
assert(lab.includes("./sora-jump.html'+context")&&
       !lab.includes("twPreviewEstiloSora"),
  "Index 2 should launch Sora in native embed mode, without parent CSS injection");
assert(sora.includes("twSoraEmbedBoot")&&
       sora.includes("get('embed')!=='index2'")&&sora.includes("tw-sora-embed")&&
       sora.includes("./sora-embed.css?v=1")&&
       soraEmbedSkin.includes("html.tw-sora-embed #soraOv>.panel.sora-panel")&&
       soraEmbedSkin.includes("aspect-ratio:360/520"),
  "Sora should have an opt-in, independently scoped embed shell");
assert(Buffer.byteLength(previewSkin,"utf8")<10000&&Buffer.byteLength(soraEmbedSkin,"utf8")<10000&&Buffer.byteLength(karaokeEmbedSkin,"utf8")<10000,
  "New preview stylesheets exceed 10 KB budget");
assert(previewSkin.includes(".tw-preview-stage .hubpart")&&
       previewSkin.includes("prefers-reduced-motion:reduce")&&
       previewSkin.includes('data-jogo="sora"')&&
       lab.includes('id="twPreviewHeaderSlot"')&&lab.includes('class="hubpart" id="twPreviewPart"')&&
       !lab.includes('tw-preview-brand')&&!lab.includes('twPreviewSaldo'),
  "INDEX2 must use the official Center Run header and hub seasonal particle classes");
assert(lab.includes("function twPreviewCabecalhoOficial(abrir)")&&
       lab.includes("slot.appendChild(cab)")&&
       lab.includes("twPreviewCabecalhoOficial(false)")&&
       lab.includes("function twPreviewMontarFundo()")&&
       lab.includes("origem.innerHTML")&&
       lab.includes("wrap.removeAttribute('data-jogo')"),
  "INDEX2 must reuse the single existing header and seasonal particle markup");
assert(previewSkin.includes('grid-template-areas:"run run run" "pet profile gacha" "sora duo karaoke"')&&
       previewSkin.includes("@media(min-width:700px)"),
  "INDEX2 desktop must have Moon Duo between Sora and Karaoke without changing mobile grid");
assert(lab.includes("function twKaraokeHorario()")&&
       lab.includes("timeZone:'America/Sao_Paulo'")&&
       lab.includes("function twKaraokeAtualizarCard()")&&
       lab.includes("if(tipo==='karaoke'&&!twKaraokeHorario().aberto&&")&&
       lab.includes('class="tw-karaoke-timer"')&&
       previewSkin.includes(".tw-hubgame-karaoke.tw-karaoke-locked"),
  "INDEX2 should display Sunday countdown and guard preview card outside the time window");

assert(lab.includes("var tema=['tsu','lirika','pati'].indexOf(OSHI)")&&
       lab.includes("encodeURIComponent(tema)")&&lab.includes("encodeURIComponent(LANG)")&&
       soraEmbedSkin.includes('[data-oshi="lirika"]')&&karaokeEmbedSkin.includes('[data-oshi="pati"]')&&
       karaoke.includes("twKaraokeEmbedBoot")&&karaoke.includes("./karaoke-embed.css?v=1")&&
       soraEmbedSkin.includes("#soraImportProfileBtn"),
  "Index 2 embed games must inherit selected Oshi and hide Sora test import");
assert(lab.includes("typeof contaAdmin==='function'&&contaAdmin()")&&
       lab.includes("twKaraokeMostrarFechado")&&
       lab.includes("Nenhuma mensagem foi enviada nesta prévia"),
  "Admin preview needs permission and invitations must be clearly not sent");
assert(sora.includes("type:'tsulipa-games-hub'")&&karaoke.includes("type:'tsulipa-games-hub'"),
  "Integrated games must request return to the parent hub");
assert(karaoke.includes("'Melon Juice!'")&&!karaoke.includes("'Melon Soda'"),
  "Karaoke drink must be called Melon Juice! without changing its internal Lirika key");

for(const fn of ["top_scores","comprar_visual","admin_acao","hubCardsUI","contaRpc","gachaAbrir","perfAbrir"]){
  assert(lab.includes(fn),"Index V2 lost existing game system: "+fn);
}



// Behavioral smoke test: execute ONLY the isolated INDEX2 preview controller
// against a fake DOM. Never load the live site or call Supabase.
try{
  const from=lab.indexOf("var twPreviewJogoAnterior = null;");
  const to=lab.indexOf("(function twPreviewPrepararJanelas(){",from);
  if(from<0||to<=from)throw Error("Preview controller not found");
  const iframe={src:"",title:""},attrs={};
  const overlay={
    hidden:true,setAttribute:(name,value)=>{attrs[name]=String(value);},
    removeAttribute:name=>{delete attrs[name];}
  };
  const gameTitle={textContent:""},backText={textContent:""};
  const noticeParts={strong:{textContent:""},span:{textContent:""}};
  const notice={querySelector:s=>noticeParts[s]};
  const previewPart={innerHTML:"",textContent:"not cleared yet"};
  const sourcePart={innerHTML:'<i style="left:5%">🎃</i>'};
  const marker={
    parentNode:{insertBefore:()=>{restored++;}},
    remove:()=>{}
  };
  let markerCreated=0,headersMoved=0,restored=0;
  const header={
    parentNode:{insertBefore:()=>{markerCreated++;}},
    nextSibling:null
  };
  const slot={appendChild:()=>{headersMoved++;}};
  let launchesFocused=0,backFocused=0,musicStops=0,hubReturns=0,blockedKaraoke=0;
  const card={focus:()=>{launchesFocused++;}};
  const nodes={
    twPreviewJogo:overlay,twPreviewIframe:iframe,twPreviewTitulo:gameTitle,
    twPreviewVoltar:{focus:()=>{backFocused++;}},
    twPreviewVoltarTxt:backText,twPreviewAviso:notice,
    twPreviewPart:previewPart,hubPart:sourcePart,
    twPreviewHeaderSlot:slot
  };
  const fakeHub={hidden:false,querySelector:sel=>sel.includes("data-ir=")?card:null};
  const sandbox={
    LANG:"pt",OSHI:"lirika",$:id=>nodes[id]||null,hubOv:fakeHub,
    contaAdmin:()=>false,
    tr:s=>s,
    twKaraokeHorario:()=>({aberto:true,faltam:0}),
    twKaraokeAtualizarCard:()=>{blockedKaraoke++;},
    temaAtual:()=>"halloween",TEMA_INFO:{halloween:["🎃","Halloween","#2b0f45","#ff8a3d"]},
    hubMusicaParar:()=>{musicStops++;},
    hubMostrar:()=>{hubReturns++;fakeHub.hidden=false;},
    document:{
      querySelector:s=>s==="body > header"?header:null,
      createComment:()=>marker,
      body:{classList:{remove:()=>{}}}
    }
  };
  vm.runInNewContext(lab.slice(from,to),sandbox,{filename:"index2-preview-controller.js"});
  sandbox.twPreviewAbrirJogo("sora");
  assert(iframe.src==="./sora-jump.html?embed=index2&oshi=lirika&lang=pt"&&!overlay.hidden&&fakeHub.hidden,
    "Sora launcher must show the iframe and hide the hub");
  assert(attrs["data-jogo"]==="sora"&&attrs["data-tema"]==="halloween"&&
         previewPart.innerHTML===sourcePart.innerHTML&&
         markerCreated===1&&headersMoved===1,
    "Preview should move the official header once and reuse the hub seasonal particles");
  assert(musicStops===1&&backFocused===1,"Opening Sora must pause hub audio and focus return control");
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(iframe.src==="./sora-jump.html?embed=index2&oshi=lirika&lang=pt"&&musicStops===1,
    "A duplicate launch must not replace an active game");
  sandbox.twPreviewFecharJogo();
  assert(iframe.src==="about:blank"&&overlay.hidden&&!fakeHub.hidden&&
         hubReturns===1&&launchesFocused===1&&
         !("data-jogo" in attrs)&&previewPart.textContent===""&&restored===1,
    "Sora return must unload iframe, restore official header, clear effects and focus");
  sandbox.twKaraokeHorario=()=>({aberto:false,faltam:86400});
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(overlay.hidden&&iframe.src==="about:blank"&&blockedKaraoke===1,
    "Karaoke preview should refuse to open outside Sunday window");
  sandbox.twKaraokeHorario=()=>({aberto:true,faltam:0});
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(iframe.src==="./karaoke-day.html?embed=index2&oshi=lirika&lang=pt"&&!overlay.hidden&&gameTitle.textContent.includes("Karaoke"),
    "Karaoke preview should open during scheduled window");
  sandbox.twPreviewFecharJogo();
  assert(iframe.src==="about:blank"&&hubReturns===2&&launchesFocused===2,
    "Karaoke return must unload iframe and restore hub focus");
  sandbox.LANG="ja";
  sandbox.twPreviewAtualizarIdioma();
  assert(backText.textContent==="ホーム"&&noticeParts.strong.textContent.includes("テスト版"),
    "Preview text should update when the hub language changes");
  sandbox.contaAdmin=()=>true;
  sandbox.twKaraokeHorario=()=>({aberto:false,faltam:86400});
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(!overlay.hidden&&iframe.src.includes("karaoke-day.html?embed=index2"),
    "Server-verified moderator should enter the TEST preview while closed");
  sandbox.twPreviewFecharJogo();
  console.log("✓ Preview controller smoke test: Sora, Karaoke, mod preview, focus, locale");
}catch(e){errors.push("Preview navigation smoke test failed: "+e.message);}


// Sunday 12:00–13:10 in Brasília must be consistent even on devices in other zones.
try{
  const a=lab.indexOf("function twKaraokeHorario(){"),b=lab.indexOf("function twKaraokeAtualizarCard(){",a);
  if(a<0||b<a)throw Error("Karaoke clock function not found");
  const fn=lab.slice(a,b);
  for(const [iso,open] of [
    ["2026-10-29T12:00:00Z",false],
    ["2026-11-01T14:59:00Z",false],
    ["2026-11-01T15:30:00Z",true],
    ["2026-11-01T16:11:00Z",false]
  ]){
    const ClockDate=class extends Date {
      constructor(...args){super(...(args.length?args:[iso]));}
    };
    const scope={Date:ClockDate,Intl};
    vm.runInNewContext(fn,scope);
    const result=scope.twKaraokeHorario();
    assert(result.aberto===open&&Number.isFinite(result.faltam),
      "Karaoke Brasília opening window wrong at "+iso);
  }
  console.log("✓ Karaoke preview timer: Brasília Sunday window");
}catch(e){errors.push("Karaoke timer smoke test failed: "+e.message);}

// Standalone mode must not load INDEX2 styles. Embed mode adds exactly one stylesheet.
try{
  const boot=sora.match(/<script id="twSoraEmbedBoot">([\s\S]*?)<\/script>/);
  if(!boot)throw Error("Sora embed boot script missing");
  for(const [query,expected] of [["",false],["?embed=index2",true]]){
    const installed=[],classes=[];
    const fake={
      location:{search:query}, URLSearchParams,
      document:{
        documentElement:{classList:{add:name=>classes.push(name)},setAttribute:()=>{},removeAttribute:()=>{}},
        head:{appendChild:node=>installed.push(node)},
        createElement:tag=>({tagName:tag})
      }
    };
    vm.runInNewContext(boot[1],fake,{filename:"sora-embed-boot.js"});
    assert((installed.length===1)===expected&&
           (classes.includes("tw-sora-embed"))===expected,
      "Sora embed flag must change presentation only for ?embed=index2");
  }
  console.log("✓ Sora opt-in embed flag: standalone / index2");
}catch(e){errors.push("Sora embed boot test failed: "+e.message);}

if(errors.length){
  errors.forEach(err=>console.error("✗",err));
  process.exitCode=1;
}else{
  console.log("✓ All static validation checks passed. Browser and gameplay QA still required.");
}
