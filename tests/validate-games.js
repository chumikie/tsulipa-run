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
  {file:"karaoke-time.html",max:450000},
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
    if(/type\s*=\s*["']application\/json["']/i.test(match[1])){
      try{JSON.parse(match[2]);}catch(e){errors.push(game.file+": invalid JSON block: "+e.message);}
      continue;
    }
    count++;
    try{new vm.Script(match[2],{filename:game.file+":inline-"+count});}
    catch(e){errors.push(game.file+": invalid JavaScript (script "+count+"): "+e.message+"\\n"+(e.stack||""));}
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

// Nenhuma pagina pode apontar para um arquivo do projeto que nao existe mais,
// e nenhuma pode navegar o proprio iframe para outra pagina do site.
for(const nome of ["index.html","index2.html","sora-jump.html","karaoke-day.html","karaoke-time.html","privacidade.html","karaoke-online-lab.html"]){
  const txt=read(nome);
  const alvos=new Set();
  for(const m of txt.matchAll(/(?:href|src)=["']\.?\/?([A-Za-z0-9_.-]+\.(?:html|css|js|json|png|jpg|svg|mp3))(?:\?[^"']*)?["']/g)) alvos.add(m[1]);
  for(const m of txt.matchAll(/location\.href\s*=\s*['"]\.\/([A-Za-z0-9_.-]+\.html)['"]/g)) alvos.add(m[1]);
  for(const alvo of alvos){
    assert(fs.existsSync(path.join(root,alvo))||fs.existsSync(path.join(root,"audio",alvo)),
      nome+" aponta para um arquivo que nao existe: "+alvo);
  }
}
for(const jogo of ["sora-jump.html","karaoke-day.html","karaoke-time.html"]){
  const txt=read(jogo);
  assert(!/catch[^]{0,80}location\.href\s*=\s*['"]\.\/[A-Za-z0-9_.-]+\.html/.test(txt),
    jogo+": dentro do pop-up o voltar nunca pode navegar o iframe");
}
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
       preview.includes("TW_KARAOKE_PRIMEIRA_DATA='2026-11-08'")&&
       preview.includes("Date.UTC(2026,10,8,15,0,0)"),
  "9-person Karaoke must have FIFO 3-person waitlist and planned Nov 8 premiere schedule");
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
       lab.includes("Karaoke⭐Time! · 5 shows por dia!"),
  "Index 2 missing Sora intro or Karaoke Time teaser");
const previewSkin=read("index2-skin.css"),soraEmbedSkin=read("sora-embed.css"),karaokeEmbedSkin=read("karaoke-embed.css"),tvSkin=read("tw-weekly-podium.css"),launchSkin=read("index2-launch-ui.css"),micCdSkin=read("tw-mic-cd-popup.css"),karaokePopupSkin=read("karaoke-popup.css"),adminToolsSql=read("supabase/sql/admin_pet_visual_tools.sql");
assert(lab.includes('href="./index2-skin.css?v=1"')&&
       previewSkin.includes(".tw-modal.tw-modal-gacha")&&previewSkin.includes(".tw-modal.tw-modal-duo")&&
       lab.includes("tw-modal-star")&&lab.includes("スター・ガチャ")&&lab.includes("ムーン・デュオ"),
  "Index 2 lost unified Gacha / Moon Duo modal design");
assert(lab.includes('href="./tw-mic-cd-popup.css?v=3"'),
  "Mic CD popup stylesheet must be loaded separately from the weekly podium stylesheet");
assert(micCdSkin.includes("#hub #twMicModal .tw-mic-tv")&&
       micCdSkin.includes(".tw-mic-radio-deck")&&micCdSkin.includes(".tw-mic-speaker")&&
       micCdSkin.includes(".tw-mic-tuner")&&micCdSkin.includes("margin:0;padding:10px 9px")&&
       !micCdSkin.includes("twMicCdSpin")&&
       micCdSkin.includes(".encp.enc-grupo #encRk")&&
       micCdSkin.includes(".encp.enc-grupo #encSelo")&&
       lab.includes("encPainel.classList.toggle('enc-grupo', ex.length > 0)")&&
       lab.includes("$('encNick').textContent = encNomes(d)")&&
       !lab.includes('id="encPessoas"')&&
       !micCdSkin.includes('#twPreviewJogo[data-jogo="karaoke"]')&&
       lab.includes('id="twMicTela"')&&lab.includes('class="tw-mic-radio-deck"'),
  "Aligned radio deck belongs only to the banner mic modal; ranking content and duo/trio grouping remain intact");
const encStart=lab.indexOf("function encMostrar(d)"),encEnd=lab.indexOf("function encLoop(",encStart);
const encUi=lab.slice(encStart,encEnd);
const encPrepStart=lab.indexOf("function encPrepararRender(d)"),encPrepEnd=lab.indexOf("function encHoje()",encPrepStart);
const encPrep=lab.slice(encPrepStart,encPrepEnd);
const encDrawStart=encEnd,encDrawEnd=lab.indexOf("var encToque =",encDrawStart);
const encDraw=lab.slice(encDrawStart,encDrawEnd);
assert(encUi.includes("encPrepararRender(d)")&&
       encUi.includes("encPainel.classList.toggle('enc-grupo', ex.length > 0)")&&
       encUi.includes("oe.hidden = ex.length > 0 || !os")&&
       encUi.includes("encNomes(d)")&&encUi.includes("tr(d.fala)")&&
       encPrep.includes("Array.isArray(d.extras)")&&encPrep.includes("encRenderGrupo.push(a)")&&
       encDraw.includes("perfDesenharIdol")&&encDraw.includes("encRenderGrupo")&&encDraw.includes("encRenderOrdem")&&
       micCdSkin.includes(".encp.enc-grupo #encRk,.encp.enc-grupo #encSelo,.encp.enc-grupo #encOshi"),
  "Duo/trio stays on one stage with its characters and line, while individual Oshi is hidden for collective encounters");
assert(lab.includes("contaRpc('encontro_hoje'")&&
       lab.includes("localStorage.setItem(ENC_KEY")&&
       lab.includes("j.dia === encHoje()"),
  "Logged-in daily encounter is server-selected and locally cached by Brazil date");
const accStart=lab.indexOf("function refreshAcc(){"),accEnd=lab.indexOf("function newItems(",accStart);
const accGuard=lab.slice(accStart,accEnd);
assert(accStart>=0&&accEnd>accStart&&accGuard.includes("o.disabled=!u")&&
       !accGuard.includes("selE.selectedIndex=0")&&!accGuard.includes("CH[sel][CF[id]]=selE.value")&&
       !accGuard.includes("saveCu();"),
  "A saved outfit/accessory must not be erased when rank data is still loading or temporarily lower");
assert(lab.includes("brs48cr_visual_rev")&&lab.includes("admin_visual_rev")&&
       lab.includes("admin_visual_info")&&lab.includes("admin_vestir")&&
       lab.includes("admin_cuidar_pets"),
  "Admin visual/pet corrections must sync with a server revision so stale saves cannot undo them");
const privacyPage=read("privacidade.html");
assert(!privacyPage.includes("Karaoke⭐Day!")&&
       (privacyPage.match(/Karaoke⭐Time!/g)||[]).length>=10,
  "Privacy page must describe only Karaoke Time, not the retired Sunday virtual room, in all five locales");
assert(lab.includes("Ranking temporariamente indisponível")&&
       lab.includes("Ranking temporarily unavailable")&&
       lab.includes("Ranking temporalmente no disponible")&&
       lab.includes("ランキングは一時的に利用できません")&&
       lab.includes("อันดับไม่พร้อมใช้งานชั่วคราว")&&
       !lab.includes("Karaoke: em preparação")&&!lab.includes("Karaoke: in preparation"),
  "Weekly TV ranking status must reflect the active Karaoke Time backend in all five locales");
const seasonalDraw=lab.slice(lab.indexOf("function hubDesenhar(){"),lab.indexOf("function hubLoop()",lab.indexOf("function hubDesenhar(){")));
const voiceSource=lab.slice(lab.indexOf("function hubTrioReage("),lab.indexOf("function hubDesenhar(){"));
const sfxSource=lab.slice(lab.indexOf("var sfx="),lab.indexOf("var mel=",lab.indexOf("var sfx=")));
assert(seasonalDraw.includes("HUB_ROUPA_TEMA[temaAtual()]")&&
       lab.includes("var HUB_TRIO_DRAW_CHARS=HUB_TRIO.map(function(m){return JSON.parse(JSON.stringify(CH[m[0]]));});")&&
       seasonalDraw.includes("var c=HUB_TRIO_DRAW_CHARS[i],base=CH[m[0]];")&&!seasonalDraw.includes("saveCu(")&&
       lab.includes("hubOv.setAttribute('data-tema', k || '')")&&
       voiceSource.includes("hubVozTocar(f[0])")&&
       sfxSource.includes("OSHI === 'tsu'")&&sfxSource.includes("OSHI === 'lirika'")&&sfxSource.includes("OSHI === 'pati'"),
  "Seasonal presentation must not replace the trio's touch voices, Oshi sound effects or saved outfits");
assert(lab.includes('href="./tw-mic-cd-popup.css?v=3"')&&
       lab.includes("antiga sala simultânea de domingo")&&
       lab.includes("O ranking semanal é online"),
  "Karaoke Time is the only current karaoke experience; old Sunday room is documented as retired");
const syncStart=lab.indexOf("function perfEnviar(){"),syncEnd=lab.indexOf("function perfConferir(",syncStart);
const syncSource=lab.slice(syncStart,syncEnd);
assert(syncSource.includes("r.pet_rebased || r.visual_rebased")&&
       syncSource.includes("contaRpc('carregar_nuvem')")&&
       syncSource.includes("perfAplicarNuvem(n, contaJ.nick)"),
  "When an old local save is rebased by an admin correction, refresh local pet and outfit data from the server");
assert(lab.includes('data-adm2="pets"')&&lab.includes('data-adm2="visual"')&&
       !lab.includes("data-admkar")&&!lab.includes("karaoke_sala_admin"),
  "Member profile gets pet/visual moderation; obsolete Karaoke Day online controls are removed");
const adminSqlLower=adminToolsSql.toLowerCase();
assert(adminSqlLower.includes("create or replace function public.admin_cuidar_pets")&&
       adminSqlLower.includes("create or replace function public.admin_visual_info")&&
       adminSqlLower.includes("create or replace function public.admin_vestir")&&
       adminSqlLower.includes("public.eh_admin()")&&
       adminSqlLower.includes("set search_path = ''")&&
       adminSqlLower.includes("revoke all")&&adminSqlLower.includes("to authenticated"),
  "Admin pet/visual RPCs must be admin-guarded, search_path-safe and not callable by anon/PUBLIC");
assert(micCdSkin.includes("width:min(100%,360px)")&&micCdSkin.includes(".tw-mic-tuner strong")&&
       !micCdSkin.includes("twMicCdSpin")&&!micCdSkin.includes("width:min(100%,550px)"),
  "Karaoke weekly mic popup should look like a compact radio, not a large CD hi-fi shell");
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
assert(Buffer.byteLength(previewSkin,"utf8")<10000&&Buffer.byteLength(soraEmbedSkin,"utf8")<11500&&Buffer.byteLength(karaokeEmbedSkin,"utf8")<10000&&Buffer.byteLength(launchSkin,"utf8")<11500&&Buffer.byteLength(micCdSkin,"utf8")<8000,
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
       lab.includes("if(tipo==='karaoke'&&!kTime&&!ensaio&&!horarioKaraoke.aberto&&")&&
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
assert(karaokePopupSkin.includes('body:has(#twPreviewJogo[data-karaoke-tela]) > .stage')&&
       karaokePopupSkin.includes('> .hint')&&karaokePopupSkin.includes('> .links')&&
       karaokePopupSkin.includes('> .oshi-sel'),
  "Karaoke page mode must hide the underlying Center Run UI while preserving the shared page background");
const kTime=read("karaoke-time.html");
assert(!lab.includes('href="./karaoke-player-popup.css?v=1"')&&
       previewSkin.includes(".tw-preview-game{background:var(--bg1,#c9ecfc)}")&&
       previewSkin.includes(".tw-preview-stage #twPreviewIframe")&&
       kTime.includes("html.kt-no-site,html.kt-no-site body{background:transparent!important}")&&
       kTime.includes("html.kt-no-site #ktPopup{position:static!important;overflow:visible!important;background:transparent!important;border:0!important;box-shadow:none!important")&&
       kTime.includes("type:'tw-kt-altura'")&&lab.includes("history.pushState({tw:'karaoke'},'','#karaoke')"),
  "Karaoke Time inside INDEX2 must inherit the homepage CSS with a transparent embedded game, not a separate CD layout");

assert(preview.includes("var TW_KARAOKE_TIME=true;")&&preview.includes("'./karaoke-time.html'+context"),
  "O card do Karaoke abre o Karaoke⭐Time! (o Day fica guardado, desligado)");
assert(kTime.includes("type:'tsulipa-games-hub'")&&kTime.includes("kt-no-site")&&
       kTime.includes("read('brs48cr_nick')")&&kTime.includes('id="ktTraducoes"')&&kTime.includes("get('lang')")&&
       !preview.includes("data-admkar")&&!preview.includes("karaoke_sala_admin")&&kTime.includes("read('brs48cr_char')")&&kTime.includes("read('brs48cr_cu2')"),
  "Karaoke Time: voltar avisa a pagina de fora e quem joga e a conta do site");
// Ranking online do Karaoke⭐Time!: o servidor conta as 5 tentativas e confere o resultado.
assert(preview.includes("contaRpc('kt_run_start'")&&preview.includes("contaRpc('kt_run_finish'")&&preview.includes("contaRpc('kt_ranking')")&&
       preview.includes('id="twMicAbrir"')&&preview.includes("function twMicAcerto()")&&!preview.includes('id="twRankKt"')&&preview.includes("data.karaoke_combo")&&preview.includes("data.karaoke_acertos")&&preview.includes("data.meu_kt_usados")&&
       preview.includes("card.classList.toggle('tw-alert-pink',pendente)")&&preview.includes("sub.textContent = w[5]"),
  "Karaoke Time: ponte do ranking online e barra própria no Top Idols");
assert(kTime.includes("window.ktOnline.gate(function(info){window.ktShowAdmissionPending=false;kt.start('confirmed',info);},useTicket)")&&kTime.includes("window.ktOnline.finish(result)")&&
       kTime.includes("window.ktOnline.boards()||rules.boards(c.day)"),
  "Karaoke Time: shows passam pelo servidor quando há conta");
assert(kTime.includes("init:apply,live:live,")&&preview.includes("plateia:function(){return contaRpc('vitrine_idols')"),
  "Karaoke Time: dentro do site a plateia vem das contas do site, não da foto de 30/10");
assert(preview.includes("var cor = c.luz || c.hair || '#ff6fb5';")&&kTime.includes("var cor = c.luz || c.hair || '#ff6fb5';")&&
       kTime.includes("read('brs48cr_cor')"),
  "Lightstick: cor do perfil, senão a do cabelo");
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
  const iframe={src:"",title:"",style:{}},attrs={};
  const overlay={
    hidden:true,setAttribute:(name,value)=>{attrs[name]=String(value);},
    toggleAttribute:(name,on)=>{if(on)attrs[name]="";else delete attrs[name];},
    hasAttribute:name=>name in attrs,
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
    twKaraokePopupFechar:{focus:()=>{backFocused++;},setAttribute:()=>{}},
    twPreviewVoltarTxt:backText,twPreviewAviso:notice,
    twPreviewPart:previewPart,hubPart:sourcePart,
    twPreviewHeaderSlot:slot
  };
  const fakeHub={hidden:false,querySelector:sel=>sel.includes("data-ir=")?card:null};
  const sandbox={location:{hash:"",pathname:"/",search:""},history:{pushState(a,b,h){sandbox.location.hash=h;},replaceState(){sandbox.location.hash="";}},window:{scrollTo(){}},
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
  // Karaoke⭐Time! (solo, offline): sem portão de domingo e sem ensaio.
  sandbox.contaAdmin=()=>false;sandbox.LANG="pt";sandbox.TW_KARAOKE_TIME=true;
  sandbox.twKaraokeHorario=()=>{throw Error("Karaoke Time nao consulta o horario de domingo");};
  sandbox.twPreviewAbrirJogo("karaoke",true);
  assert(!overlay.hidden&&iframe.src==="./karaoke-time.html?embed=index2&oshi=lirika&lang=pt&theme=light"&&
         gameTitle.textContent==="🎤 Karaoke⭐Time!",
    "Karaoke Time must open any day, in the new file, without rehearsal flag");
  assert(fakeHub.hidden&&("data-karaoke-tela" in attrs)&&!("data-karaoke-popup" in attrs)&&sandbox.location.hash==="#karaoke",
    "Karaoke Time opens as a screen of the page (like Center Run), with #karaoke for the back button");
  const returnsBeforeClose=hubReturns;
  sandbox.twPreviewFecharJogo();
  assert(iframe.src==="about:blank"&&overlay.hidden&&!fakeHub.hidden&&!("data-karaoke-tela" in attrs)&&
         hubReturns===returnsBeforeClose+1&&sandbox.location.hash==="",
    "Karaoke Time close unloads the game and returns to the hub");
  console.log("✓ Preview controller smoke test: Sora, Karaoke Day, Karaoke Time, mod preview, focus, locale");
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
    ["2026-11-01T15:00:00Z",false,true],
    ["2026-11-01T16:09:00Z",false,true],
    ["2026-11-01T16:11:00Z",false,true],
    ["2026-11-08T14:59:00Z",false,true],
    ["2026-11-08T15:00:00Z",true,false],
    ["2026-11-08T16:09:00Z",true,false],
    ["2026-11-08T16:10:00Z",false,false],
    ["2026-11-15T15:00:00Z",true,false]
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
  const productionIso="2026-11-08T15:30:00Z";
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

// Profile badge collection and weekly reset policy.
try{
  const gameBadgesSql=read("supabase/sql/profile_game_badges_sunday_week.sql");
  const main=read("index.html"), karaokeTime=read("karaoke-time.html");
  const localBadges=["s2_ensaio","s2_backstage","s2_estudio","s2_festival","s2_aeroporto","s2_geral","s2_dome"];
  const soraBadges=["sora_500","sora_1500","sora_3000"];
  assert(main.includes("function s2SyncProfile()")&&main.includes("sincronizar_insignias_jogos"),
    "Center Run local badges must sync to the signed-in profile");
  localBadges.concat(soraBadges).forEach(id=>assert(main.includes("['"+id+"'")||main.includes("['"+id+"',"),
    "Profile catalog missing game badge "+id));
  assert(main.includes("timeZone:'America/Sao_Paulo'")&&main.includes("getUTCDay()")&&
    sora.includes("timeZone:'America/Sao_Paulo'")&&sora.includes("getUTCDay()"),
    "Center Run and Sora local weekly rankings must use the Sunday boundary in Brasília time");
  assert(gameBadgesSql.includes("insignias_jogos")&&gameBadgesSql.includes("sincronizar_insignias_jogos")&&
    gameBadgesSql.includes("extract(dow")&&!gameBadgesSql.includes("date_trunc('week'"),
    "Server badge migration must sync allowlisted game badges and calculate completed weeks from Sunday");
  assert(karaokeTime.includes("週間ランキング")&&karaokeTime.includes("今日の観客")&&
    karaokeTime.includes("wrap.insertBefore(weekly,audience)")&&
    karaokeTime.includes(".kt-no-site .krtop")&&karaokeTime.includes(".kt-no-site .kt-foot"),
    "Karaoke must move the weekly board before the audience in the DOM and hide local-only title/footer in embed mode");
  const bootStart=karaokeTime.indexOf('<script id="ktDentroDoSite">');
  const bootEnd=karaokeTime.indexOf('</script>',bootStart);
  const embedBoot=bootStart>=0&&bootEnd>bootStart?karaokeTime.slice(bootStart+'<script id="ktDentroDoSite">'.length,bootEnd):'';
  assert(!!embedBoot,"Karaoke embed bootstrap must exist");
  if(embedBoot){
    const classes=[],root={classList:{add:name=>classes.push(name)}},win={};
    win.parent=win;
    vm.runInNewContext(embedBoot,{location:{search:"?embed=index2"},document:{documentElement:root},window:win,URLSearchParams});
    assert(classes.includes("kt-no-site"),"Karaoke embed mode must not depend on window.parent identity");
  }
  const layoutStart=karaokeTime.indexOf("function ktOrganizarLayoutIntegrado(){");
  const layoutCall=karaokeTime.indexOf("ktOrganizarLayoutIntegrado();",layoutStart);
  const layoutEnd=layoutCall>layoutStart?karaokeTime.lastIndexOf("}",layoutCall):-1;
  const layoutScript=layoutStart>=0&&layoutEnd>layoutStart?karaokeTime.slice(layoutStart,layoutEnd+2):'';
  assert(!!layoutScript,"Karaoke embedded layout organizer must exist");
  if(layoutScript){
    const children=["scene","audience","clip","cast","weekly"].map(name=>({name,parentNode:null}));
    const wrap={children,insertBefore(node,reference){
      const from=children.indexOf(node),to=children.indexOf(reference);
      if(from<0||to<0)return;
      children.splice(from,1);children.splice(children.indexOf(reference),0,node);
    }};
    children.forEach(node=>node.parentNode=wrap);
    const doc={querySelector:()=>wrap,getElementById:id=>id==="ktWeeklyRanks"?children.find(x=>x.name==="weekly"):id==="ktAudience"?children.find(x=>x.name==="audience"):null};
    vm.runInNewContext(layoutScript+";ktOrganizarLayoutIntegrado();",{ktNoSite:()=>true,document:doc});
    assert(children.findIndex(x=>x.name==="weekly")<children.findIndex(x=>x.name==="audience"),
      "Weekly board must be physically moved before audience on desktop and mobile");
  }
  const flowStart=previewSkin.indexOf("#twPreviewJogo[data-karaoke-tela]{");
  const flowEnd=previewSkin.indexOf("/* Source is #hubPart",flowStart);
  const flowBlock=flowStart>=0&&flowEnd>flowStart?previewSkin.slice(flowStart,flowEnd):"";
  assert(flowBlock.includes("position:relative!important")&&
    flowBlock.includes("overflow:visible!important")&&
    flowBlock.includes("min-height:0")&&flowBlock.includes("height:auto")&&
    !flowBlock.includes("100dvh"),
    "Karaoke Time must size to its real iframe content without a viewport-height blank area");
  assert(karaokeTime.includes("width:min(100%,970px)!important")&&
    karaokeTime.includes("max-width:920px!important"),
    "Embedded Karaoke content must retain the original compact 970/920px bounds");
  const previewBlock=lab.indexOf("var html='<section class=\"tw-preview-game\" id=\"twPreviewJogo\"");
  const previewInsert=previewBlock>=0?lab.indexOf("document.body.insertAdjacentHTML('beforeend',html);",previewBlock):-1;
  const siteFooter=lab.indexOf("var f = document.createElement('footer'); f.className = 'siterodape sitefoot';");
  assert(previewInsert>=0&&siteFooter>previewInsert,
    "The official copyright/logo/privacy footer must remain after the Karaoke page in document flow");
  console.log("✓ Game badges in profile + Sunday weekly boundaries + Karaoke hierarchy");
}catch(e){errors.push("Profile badges / Sunday / Karaoke polish: "+e.message);}

// Saved avatar colors are read by the game Canvas and by the Profile preview.
try{
  const html=read("index.html");
  const start=html.indexOf("// --- CARREGAMENTO AUTOMÁTICO DO VISUAL E ROUPAS SALVAS ---");
  const end=html.indexOf("function saveCu(){",start);
  assert(start>=0&&end>start,"Avatar save loader must remain available");
  if(start>=0&&end>start){
    const loader=html.slice(start,end);
    const defaults={n:"Idol",hair:"#ff7eb6",hair2:"#4dd8ff",skin:"#f1c9a5",eye:"#5a3b2e",outcol:"#ffffff",front:"lateral",back:"chanel"};
    for(const saved of [
      {hair:null,hair2:42,skin:"",eye:"not-a-color",outcol:null,front:"reta"},
      {hair:"#123456",hair2:"#abcdef",skin:"#aabbcc",eye:"#112233",outcol:"#445566",front:"espetada"}
    ]){
      const sandbox={CH:[{},{},{},{...defaults}],sel:3,localStorage:{getItem:k=>k==="brs48cr_cu2"?JSON.stringify(saved):null}};
      vm.runInNewContext("var CU=CH[3];"+loader,sandbox,{timeout:1000});
      const cu=sandbox.CU;
      for(const key of ["hair","hair2","skin","eye","outcol"]){
        const expected=typeof saved[key]==="string"&&/^#[0-9a-f]{6}$/i.test(saved[key])?saved[key]:defaults[key];
        assert(cu[key]===expected,"Avatar save must validate "+key+" before game/preview drawing");
      }
      assert(cu.front===saved.front,"Avatar save must preserve existing haircut selections");
      assert(cu.img===cu.hair,"Avatar game and previews must use the same valid hair color");
    }
    console.log("✓ Saved avatar colors, game and Profile preview fallback");
  }
}catch(e){errors.push("Avatar save / rendering: "+e.message);}

if(errors.length){
  errors.forEach(err=>console.error("✗",err));
  process.exitCode=1;
}else{
  console.log("✓ All static validation checks passed. Browser and gameplay QA still required.");
}
