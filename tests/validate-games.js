// Static pre-merge checks for the TsuLiPa World special games.
// Run: node tests/validate-games.js
// No packages, database credentials or network access required.
"use strict";
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const root=path.resolve(__dirname,"..");
const games=[
  {file:"index.html",max:1150000},
  {file:"index2.html",max:1000},
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

let karaoke="",sora="",preview="";
try{
  preview=read("index.html");
  karaoke=read("karaoke-day.html");
  sora=read("sora-jump.html");
}catch(_){/* Already reported above */}

// A pagina principal e a unica porta de entrada dos jogos: nao existe mais um
// seletor separado (sora-jump-karaoke.html), que era por onde o voltar se perdia.
assert(!fs.existsSync(path.join(root,"sora-jump-karaoke.html")),"O seletor avulso nao deve voltar ao projeto");
for(const jogo of ["sora","karaoke"]){
  assert(preview.includes('data-ir="'+jogo+'"'),"Falta o card do "+jogo+" na pagina principal");
}
assert(preview.includes('class="hubcard tw-hubgame')&&preview.includes("twPreviewAbrirJogo"),
  "index2 missing integrated game cards or launchers");
assert(!preview.includes('name="robots" content="noindex'),"Canonical home must be indexable");
const redirect=read("index2.html");
assert(redirect.includes("location.replace('/')")&&redirect.includes('content="0; url=/"')&&!redirect.includes('contaRpc'),"index2 must redirect to canonical home, including without JS");
assert(sora.includes("games-theme.css"),"Sora missing shared theme");
assert(karaoke.includes("games-theme.css"),"Karaoke missing shared theme");
const rhythm=read("karaoke-rhythm.js"),rhythmStyle=read("karaoke-rhythm.css");
assert(karaoke.includes('src="./karaoke-rhythm.js?v=1"')&&
       karaoke.includes('href="./karaoke-rhythm.css?v=1"')&&
       karaoke.includes('id="krRhythmHit"')&&
       karaoke.includes('id="krRhythmScore"')&&
       karaoke.includes('id="krRhythmNote"')&&
       karaoke.includes("krRhythmStart()")&&
       karaoke.includes("krRhythmTick()")&&
       karaoke.includes("krRhythmStop('abandoned')"),
  "Karaoke must expose a playable 60-second mic with 45-second rhythm locally");
// 8 lugares no sofa + o palco = 9 pessoas, sem ninguem empilhado (x diferente em cada lugar).
const sofa=JSON.parse((karaoke.match(/KR_SOFA_SLOTS=(\[\[[0-9,\[\]]*\]\])/)||[])[1]||'[]');
assert(sofa.length===8,'Karaoke: 8 lugares no sofa');
assert(new Set(sofa.map(s=>s[0])).size===8,'Karaoke: cada lugar num x proprio (ninguem empilhado)');
assert(sofa.every(s=>s[0]>=120&&s[0]<=840&&s[1]>=330&&s[1]<=500),'Karaoke: lugares dentro da sala');
assert(karaoke.includes("'🧪 '+tr('Sala de ensaio')+' · 👥 '+krSt.ocupadas+'/9'")&&
       !karaoke.includes("Aberta · {n}/12")&&
       !karaoke.includes("micT=30*60")&&
       !karaoke.includes("uma das 12 vagas"),
  "Karaoke must show truthful nine-seat demo and remove legacy frame-based mic");
assert(rhythm.includes("RHYTHM_MS=45000")&&
       rhythm.includes("TOTAL_MS=INTRO_MS+RHYTHM_MS+OUTRO_MS")&&
       !rhythm.includes(".rpc(")&&!rhythm.includes("supabase")&&
       rhythmStyle.length<5500,
  "Rhythm engine must have exact duration, no database calls and lightweight CSS");

const rehearsal=read("karaoke-online-lab.html"),model=read("karaoke-room-model.js");
assert(rehearsal.includes('name="robots" content="noindex,nofollow,noarchive"')&&
       rehearsal.includes("SIMULAÇÃO LOCAL")&&
       rehearsal.includes('src="./karaoke-room-model.js"')&&
       rehearsal.includes("9 vagas")&&
       rehearsal.includes("Não conta para o ranking"),
  "Offline rehearsal must be transparent about fake users and scores");
assert(model.includes("QUEUE_CAPACITY=3")&&
       rehearsal.includes('id="queue4"')&&
       karaoke.includes('id="krMicQueueList"')&&
       karaoke.includes('id="krMicQueueBot"')&&
       karaoke.includes('var KR_DEMO_QUEUE_LIMIT=3')&&
       karaoke.includes("krDemoStartNext()")&&
       preview.includes("TW_KARAOKE_PRIMEIRA_DATA='2026-11-01'")&&
       preview.includes("Date.UTC(2026,10,1,15,0,0)"),
  "9-person Karaoke must have FIFO 3-person waitlist and planned Nov 1 preview schedule");
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
const lab=read("index.html");
assert(lab.includes('data-ir="sora"')&&lab.includes('data-ir="karaoke"'),
  "Index 2 missing new game cards");
assert(lab.includes("function twPreviewAbrirJogo(")&&lab.includes("function twPreviewFecharJogo("),
  "Index V2 missing in-page game overlay");
assert(!lab.includes("TW_INDEX2_READ_RPC")&&!lab.includes("INDEX2_PREVIEW_GUARD")&&!lab.includes("index2_somente_leitura"),
  "Release must not block account/economy RPCs with the preview guard");
assert(!lab.includes("twPreviewAviso")&&!lab.includes("INDEX 2 —"),"Release must not show test-preview notice");
// Direct ranking calls remain reviewed; account RPCs use the existing server authorization.
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
const previewSkin=read("index2-skin.css"),soraEmbedSkin=read("sora-embed.css"),karaokeEmbedSkin=read("karaoke-embed.css"),tvSkin=read("tw-weekly-podium.css"),launchSkin=read("index2-launch-ui.css");
assert(lab.includes('href="./index2-skin.css?v=1"')&&
       previewSkin.includes(".tw-modal.tw-modal-gacha")&&previewSkin.includes(".tw-modal.tw-modal-duo")&&
       lab.includes("tw-modal-star")&&lab.includes("スター・ガチャ")&&lab.includes("ムーン・デュオ"),
  "Index 2 lost unified Gacha / Moon Duo modal design");
const tvMenuAt=lab.indexOf('<div id="hubMenu" hidden>');
const tvTriggerAt=lab.indexOf('id="twRankTvAbrir"');
assert(lab.includes('id="twRankTvAbrir"')&&lab.includes('id="twRankTvModal"')&&
       lab.includes('id="twRankTvFechar"')&&lab.includes("function twRankTvModalFechar")&&
       launchSkin.includes(".tw-rank-tv-launch")&&launchSkin.includes(".tw-rank-tv-modal[hidden]")&&
       tvMenuAt>=0&&tvTriggerAt>tvMenuAt&&
       lab.includes('class="tw-rank-tv" id="twRankTv" role="dialog" aria-modal="true"')&&
       !lab.includes('class="tw-rank-tv-dialog"'),
  "TV icon must appear only after the start screen and the TV itself must be the popup");
assert(lab.includes('id="twPreviewSom"')&&lab.includes("TW_SORA_SOUND_STATE")&&
       sora.includes("TW_SORA_TOGGLE_SOUND")&&soraEmbedSkin.includes("html.tw-sora-embed #soraSoundBtn{display:none!important}")&&
       launchSkin.includes(".tw-preview-som"),
  "Sora should expose sound in the official header and keep standalone UI intact");
assert(lab.includes('class="tw-profile-lock"')&&!lab.includes('class="tw-profile-hint"')&&
       lab.includes('data-ir="run"'),
  "Profile-dependent actions should signal sign-in without blocking anonymous Center Run");
assert(lab.includes("./sora-jump.html'+context")&&
       !lab.includes("twPreviewEstiloSora"),
  "Index 2 should launch Sora in native embed mode, without parent CSS injection");
assert(sora.includes("twSoraEmbedBoot")&&
       sora.includes("get('embed')!=='index2'")&&sora.includes("tw-sora-embed")&&
       /\.\/sora-embed\.css\?v=\d+/.test(sora)&&
       soraEmbedSkin.includes("html.tw-sora-embed #soraOv>.panel.sora-panel")&&
       soraEmbedSkin.includes("aspect-ratio:360/520"),
  "Sora should have an opt-in, independently scoped embed shell");
assert(Buffer.byteLength(previewSkin,"utf8")<10000&&Buffer.byteLength(soraEmbedSkin,"utf8")<11500&&Buffer.byteLength(karaokeEmbedSkin,"utf8")<10000&&Buffer.byteLength(launchSkin,"utf8")<11500,
  "New preview stylesheets exceed 10 KB budget");
assert(previewSkin.includes(".tw-preview-stage .hubpart")&&
       previewSkin.includes("prefers-reduced-motion:reduce")&&
       previewSkin.includes('data-jogo="sora"')&&
       lab.includes('id="twPreviewHeaderSlot"')&&lab.includes('class="hubpart" id="twPreviewPart"')&&
       !lab.includes('tw-preview-brand')&&!lab.includes('twPreviewSaldo'),
  "INDEX2 must use the official Center Run header and hub seasonal particle classes");
// Hidden overlays should stop background canvas RAFs; this never mutates saves or game state.
assert(lab.includes("function twIndex2BaseFramesPaused()")&&
       lab.includes("twIndex2BaseRaf=requestAnimationFrame(loop)")&&
       lab.includes("twIndex2AvatarRaf = requestAnimationFrame(prevLoop)")&&
       lab.includes("twIndex2PauseBaseFrames();")&&
       lab.includes("twIndex2ResumeBaseFrames();"),
  "INDEX2 should track and pause covered canvas animation frames");
try{
  const guardStart=lab.indexOf("function twIndex2BaseFramesPaused()");
  const guardEnd=lab.indexOf("function twIndex2PauseBaseFrames()",guardStart);
  if(guardStart<0||guardEnd<=guardStart)throw Error("Base-frame pause guard missing");
  const guardSource=lab.slice(guardStart,guardEnd);
  function pausedFor({hidden=false,hubHidden=true,previewHidden=true}){
    const env={
      document:{hidden,getElementById:id=>id==="twPreviewJogo"?{hidden:previewHidden}:null},
      hubOv:{hidden:hubHidden}
    };
    vm.runInNewContext(guardSource,env);
    return env.twIndex2BaseFramesPaused();
  }
  assert(!pausedFor({}),"Visible base game should keep its canvas loop");
  assert(pausedFor({hidden:true}),"Background tab should pause its canvas loops");
  assert(pausedFor({hubHidden:false}),"Hub overlay should pause its covered canvas loops");
  assert(pausedFor({previewHidden:false}),"Sora/Karaoke iframe should pause base canvas loops");
  console.log("✓ INDEX2 pauses covered background canvas loops without changing gameplay state");
}catch(e){errors.push("INDEX2 canvas lifecycle check failed: "+e.message);}
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
       lab.includes("if(tipo==='karaoke'&&!ensaio&&!horarioKaraoke.aberto&&")&&
       lab.includes("horarioKaraoke.foraHomologacao")&&
       lab.includes('class="tw-karaoke-timer"')&&
       previewSkin.includes(".tw-hubgame-karaoke.tw-karaoke-locked"),
  "INDEX2 should display Sunday countdown and guard preview card outside the time window");

assert(lab.includes("var tema=['tsu','lirika','pati'].indexOf(OSHI)")&&
       lab.includes("encodeURIComponent(tema)")&&lab.includes("encodeURIComponent(LANG)")&&
       soraEmbedSkin.includes('[data-oshi="lirika"]')&&karaokeEmbedSkin.includes('[data-oshi="pati"]')&&
       karaoke.includes("twKaraokeEmbedBoot")&&karaoke.includes("./karaoke-embed.css?v=2")&&
       soraEmbedSkin.includes("#soraImportProfileBtn"),
  "Index 2 embed games must inherit selected Oshi and hide Sora test import");
assert(lab.includes("typeof contaAdmin==='function'&&contaAdmin()")&&
       lab.includes("twKaraokeMostrarFechado")&&
       lab.includes('id="twKaraokeEnsaiar"')&&
       lab.includes("twPreviewAbrirJogo('karaoke',true)")&&
       !lab.includes("twKaraokeConviteRascunho"),
  "Admin preview needs permission and unfinished invitations must be absent");
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
  let launchesFocused=0,backFocused=0,musicStops=0,hubReturns=0,blockedKaraoke=0,baseCanvasPauses=0;
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
    twIndex2PauseBaseFrames:()=>{baseCanvasPauses++;},
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
  // O Sora agora abre como pop-up SOBRE o hub (igual ao Star Gacha): o hub fica atras, visivel.
  assert(iframe.src==="./sora-jump.html?embed=index2&oshi=lirika&lang=pt&theme=light"&&!overlay.hidden&&!fakeHub.hidden,
    "Sora launcher must show the iframe as a pop-up over the hub");
  assert(attrs["data-jogo"]==="sora"&&attrs["data-tema"]==="halloween"&&
         previewPart.innerHTML===sourcePart.innerHTML&&
         markerCreated===0&&headersMoved===0,
    "Sora keeps the official header on the page behind the pop-up");
  assert(musicStops===1&&backFocused===1,"Opening Sora must pause hub audio and focus return control");
  assert(baseCanvasPauses===1,"Opening Sora must pause covered Center Run canvas loops");
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(iframe.src==="./sora-jump.html?embed=index2&oshi=lirika&lang=pt&theme=light"&&musicStops===1,
    "A duplicate launch must not replace an active game");
  sandbox.twPreviewFecharJogo();
  assert(iframe.src==="about:blank"&&overlay.hidden&&!fakeHub.hidden&&
         hubReturns===1&&launchesFocused===1&&
         !("data-jogo" in attrs)&&previewPart.textContent===""&&restored===0,
    "Sora return must unload iframe, clear effects and focus");
  sandbox.twKaraokeHorario=()=>({aberto:false,faltam:86400});
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(overlay.hidden&&iframe.src==="about:blank"&&blockedKaraoke===1,
    "Karaoke preview should refuse to open outside Sunday window");
  // A conscious rehearsal click can open the disconnected demo even on a weekday.
  // This is NOT the same as granting online seats or privileges.
  sandbox.twPreviewAbrirJogo("karaoke",true);
  assert(!overlay.hidden&&iframe.src==="./karaoke-day.html?embed=index2&oshi=lirika&lang=pt&theme=light&rehearsal=1"&&
         gameTitle.textContent.includes("Ensaio"),
    "INDEX2 rehearsal must work outside Sunday and be clearly identified as local only");
  sandbox.twPreviewFecharJogo();
  sandbox.twKaraokeHorario=()=>({aberto:true,faltam:0});
  sandbox.twPreviewAbrirJogo("karaoke");
  assert(iframe.src==="./karaoke-day.html?embed=index2&oshi=lirika&lang=pt&theme=light"&&!overlay.hidden&&gameTitle.textContent.includes("Karaoke"),
    "Karaoke preview should open during scheduled window");
  sandbox.twPreviewFecharJogo();
  assert(iframe.src==="about:blank"&&hubReturns===3&&launchesFocused===3,
    "Karaoke return must unload iframe and restore hub focus");
  sandbox.LANG="ja";
  sandbox.twPreviewAtualizarIdioma();
  assert(backText.textContent==="ホーム",
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
  const a=lab.indexOf("var TW_KARAOKE_PRIMEIRA_DATA="),
        fnStart=lab.indexOf("function twKaraokeHorario(){",a),
        end=lab.indexOf("function twKaraokeAtualizarCard(){",fnStart);
  if(a<0||fnStart<a||end<fnStart)throw Error("Karaoke premiere/clock function not found");
  const fn=lab.slice(a,end);
  for(const [iso,open,premiere] of [
    ["2026-10-29T12:00:00Z",false,true],
    ["2026-11-01T14:59:00Z",false,true],
    ["2026-11-01T15:00:00Z",true,false],
    ["2026-11-01T16:09:00Z",true,false],
    ["2026-11-01T16:11:00Z",false,false],
    ["2026-11-08T15:00:00Z",true,false]
  ]){
    const ClockDate=class extends Date {
      constructor(...args){super(...(args.length?args:[iso]));}
      static now(){return Date.parse(iso);}
    };
    const scope={Date:ClockDate,Intl,location:{protocol:"https:",hostname:"deploy-preview-34--tsulipa-run.netlify.app"}};
    vm.runInNewContext(fn,scope);
    const result=scope.twKaraokeHorario();
    assert(result.aberto===open&&!!result.estreia===premiere&&Number.isFinite(result.faltam)&&!result.foraHomologacao,
      "Karaoke preview schedule incorrect at "+iso);
  }
  const productionIso="2026-11-01T15:30:00Z";
  const ProductionDate=class extends Date {
    constructor(...args){super(...(args.length?args:[productionIso]));}
    static now(){return Date.parse(productionIso);}
  };
  const productionScope={Date:ProductionDate,Intl,location:{protocol:"https:",hostname:"tsulipa-world.vercel.app"}};
  vm.runInNewContext(fn,productionScope);
  const productionState=productionScope.twKaraokeHorario();
  // Lançamento: a sala online é real; o site oficial abre no mesmo horário que a prévia.
  assert(productionState.aberto&&!productionState.foraHomologacao,
    "Karaoke must open on Sunday 12:00–13:10 BRT on the public host");
  console.log("✓ Karaoke timer: Sundays 12:00–13:10 BRT on preview and public host");
}catch(e){errors.push("Karaoke timer smoke test failed: "+e.message);}

// Closed-room copy is refreshed at every opening in each supported language.
try{
  const dictionary=lab.slice(lab.indexOf('var TW_KARAOKE_FECHADO_TEXTOS ='),lab.indexOf('// Original header node'));
  const noticeFn=lab.slice(lab.indexOf('function twKaraokeMostrarFechado(){'),lab.indexOf('// Visual mode now belongs'));
  for(const lang of ['pt','en','es','th','ja']){
    const nodes={};
    for(const id of ['twKaraokeFechado','twKaraokeFechadoTxt','twKaraokeDescanso','twKaraokeFecharAviso','twKaraokeEnsaiar'])nodes[id]={hidden:true,textContent:'',focus(){}};
    const env={LANG:lang,$:id=>nodes[id]||null,twKaraokeAtualizarCard(){},twKaraokeHorario:()=>({estreia:true,faltam:90000})};
    vm.runInNewContext(dictionary+noticeFn,env);
    for(const premiere of [true,false]){
      env.twKaraokeHorario=()=>({estreia:premiere,faltam:90000});
      env.twKaraokeMostrarFechado();
      const copy=env.TW_KARAOKE_FECHADO_TEXTOS[lang];
      assert(nodes.twKaraokeFechado.hidden===false&&nodes.twKaraokeFechadoTxt.textContent.startsWith(copy[premiere?1:2])&&nodes.twKaraokeFechadoTxt.textContent.endsWith(copy[3]),'Closed schedule/status in '+lang);
      assert(nodes.twKaraokeDescanso.textContent===copy[0]&&nodes.twKaraokeFecharAviso.textContent===copy[4]&&nodes.twKaraokeEnsaiar.textContent===copy[5],'Closed actions in '+lang);
    }
  }
  console.log('✓ Closed Karaoke notice: premiere and weekly copy in PT/EN/ES/TH/JA');
}catch(e){errors.push('Closed Karaoke locale test: '+e.message);}

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
