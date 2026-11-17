/* Center⭐Run! — o jogo principal: personagens (drawChar), corrida, cenário vivo, ranking local, foto/photocard,
   temas da temporada, easter eggs, outdoors, obstáculos e a Temporada 2.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 8), sem mudar nada: mesmo nome, mesmo código.
   Desde 15/11/2026 a parte que só a corrida usa (laço, cenário, obstáculos, fim de jogo, polaroid) fica em
   centerrun-corrida.js e baixa quando a tela do Center Run aparece (twCorridaCarregar). Se mudar aquele arquivo,
   suba a versão em TW_CORRIDA_ARQ aqui embaixo.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (estado do jogo, laço, listeners, invólucros da Temporada 2 e inicialização continuam lá). */
var LANG='pt';
function tr(k){var d=DICT[LANG];return (d&&d[k])||k}
// Algum idioma carregado traduz este texto? (só o idioma escolhido é baixado)
function twTemTraducao(k){if(DICT.id&&DICT.id[k])return true;for(var l in DICT){if(DICT[l]&&DICT[l][k])return true;}return false;}
function applyLang(){
  document.documentElement.lang=LANG==='id'?'id':LANG==='ja'?'ja':LANG==='th'?'th':LANG==='es'?'es':LANG==='en'?'en':'pt-BR';
  var w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null),n,L=[];
  while(n=w.nextNode()){
    var pn=n.parentNode&&n.parentNode.nodeName;
    if(pn==='SCRIPT'||pn==='STYLE')continue;
    L.push(n);
  }
  L.forEach(function(node){
    var raw=node.__pt!==undefined?node.__pt:node.nodeValue, k=raw.trim();
    if(node.__pt===undefined){
      if(twTemTraducao(k))node.__pt=raw;
      else return;
    }
    var d=DICT[LANG], v=d&&d[k];
    node.nodeValue=v?raw.replace(k,function(){return v}):raw;
  });
  [].forEach.call(document.querySelectorAll('[placeholder],[aria-label],[title]'),function(e){
    ['placeholder','aria-label','title'].forEach(function(a){
      if(!e.hasAttribute(a))return;
      var key='data-pt-'+a;
      if(!e.hasAttribute(key)){
        if(twTemTraducao(e.getAttribute(a)))e.setAttribute(key,e.getAttribute(a));
        else return;
      }
      var o=e.getAttribute(key),d=DICT[LANG];
      e.setAttribute(a,(d&&d[o])||o);
    });
  });
  [].forEach.call(document.querySelectorAll('.lang button'),function(b){
    b.setAttribute('aria-pressed',b.dataset.l===LANG);
  });
}
var CH=[
  {n:'Tsu',img:'#9b30d9',hair:'#b04fe6',hair2:'#fff',streak:false,skin:'#b97a50',eye:'#a64bd9',back:'pixie',front:'bagunca',det:'gato',gl:'',out:'',outcol:'#ffffff',hat:'',baixo:'bermuda'},
  {n:'Lirika',img:'#b6ff3b',hair:'#1a1a22',hair2:'#fff',streak:false,skin:'#f1c9a5',eye:'#5a3b2e',back:'chanel',front:'reta',det:'coques',gl:'',out:'',outcol:'#ffffff',hat:'',baixo:'saia'},
  {n:'Pati',img:'#4169e1',hair:'#4a6fd8',hair2:'#fff',streak:false,skin:'#fbe5d8',eye:'#3a55b8',back:'',front:'reta',det:'',gl:'',out:'',outcol:'#ffffff',hat:'',baixo:'bermuda'},
  {n:'Idol',img:'#ff7eb6',hair:'#ff7eb6',hair2:'#4dd8ff',streak:false,skin:'#f1c9a5',eye:'#5a3b2e',back:'chanel',front:'lateral',det:'',gl:'',out:'',outcol:'#ffffff',hat:''}
];
var RANKS=[[0,'Audição'],[150,'Kenkyuusei'],[450,'Team'],[1000,'Senbatsu'],[1800,'Quad Center'],[2800,'tCenter'],[3900,'wCenter'],[5000,'Center'],[10000,'Solo Center'],[15000,'Capitão'],[30000,'Eternal Ace'],[50000,'Kami-Oshi']];
var sel=0,best=0,state='menu',muted=false,overTimer=null;
function setBest(){bestEl.textContent=tr('Recorde')+': '+best+' · ★ '+starT;if(window.ktTickets&&window.ktTickets.renderBadge)window.ktTickets.renderBadge();}
var CF={chair:'hair',cstr:'hair2',ceye:'eye',cout:'out',coutcol:'outcol',cleg:'legcol',cbaixo:'baixo',cback:'back',cfront:'front',cdet:'det',chat:'hat',cgl:'gl',colho:'olho',cboca:'boca',cbochecha:'bochecha',csobr:'sobrancelha'};
function dk(){
  return new Date().toLocaleDateString('en-CA',{timeZone:'America/Sao_Paulo'});
}
function wk(){
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  var p={};parts.forEach(function(x){p[x.type]=x.value;});
  var d=new Date(Date.UTC(+p.year,+p.month-1,+p.day));
  d.setUTCDate(d.getUTCDate()-d.getUTCDay());
  return d.toISOString().slice(0,10);
}
function escHtml(s){
  return String(s).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]});
}
function showLbLocal(el,rowsOverride){
  if(!el)return;
  var box=el.parentNode;
  if(box){
    [].forEach.call(box.querySelectorAll('.tabs button'),function(b){
      b.setAttribute('aria-pressed',b.dataset.t===tab);
    });
  }
 if(ld.d !== dk()) ld = {d: dk(), rows: []};
  var rows = rowsOverride || (tab === 'day' ? (ld.rows || []) : tab === 'week' ? (lw.rows || []) : (local || []));
  el.innerHTML='';
  if(!rows.length){
    var emptyLi=document.createElement('li');
    emptyLi.style.justifyContent='center';
    emptyLi.innerHTML='<em>'+tr('Ninguém no ranking ainda. Seja a primeira pessoa!')+'</em>';
    el.appendChild(emptyLi);
    return;
  }
  rows.forEach(function(r,idx){
    var li=document.createElement('li');
    var rId = typeof r.rankId==='number' ? r.rankId : rankOf(r.score||0);
    var rName = RANKS[rId] ? tr(RANKS[rId][1]) : '';
    var chName = r.char==='Você' ? tr('Você') : (r.char||'Tsu');
    var pName = (!r.name || r.name==='Anônimo') ? tr('Anônimo') : r.name;
    var medal = idx===0?'🥇 ':idx===1?'🥈 ':idx===2?'🥉 ':(idx+1)+'. ';
    var nmHtml=(r.on&&r.name&&r.name!=='Anônimo')?'<button type="button" class="lbn" data-nick="'+escHtml(r.name)+'">'+escHtml(pName)+'</button>':'<strong>'+escHtml(pName)+'</strong>';   // V2.1.3: perfil público
    li.innerHTML='<span>'+medal+nmHtml+' <em>('+escHtml(chName)+' · '+escHtml(rName)+')</em></span><strong>'+(r.score||0)+'</strong>';
    el.appendChild(li);
  });
}
var did='',tok=null,API='/api';
function getTok() { tok = null; }
function showLb(el){
  if(!el)return;
  var tb=tab;
    Promise.resolve(_supabase ? _supabase.rpc('top_scores',{periodo:tb}) : Promise.reject(new Error('sem supabase'))).then(function(resp){
    if(resp.error)throw resp.error;
    var rows=(resp.data||[]).map(function(r){
      return {name:r.name,score:r.score,rankId:rankOf(r.score),char:r.char||'',on:1};   // on: veio do ranking online (nome abre o perfil, V2.1.3)
    });
    if(tb!==tab)return;
    showLbLocal(el,rows);
  }).catch(function(err){
    console.error('Ranking:',err);
    showLbLocal(el);
    var n=document.createElement('li');
    n.style.cssText='font-size:11px;color:var(--sub);background:none;justify-content:center';
    n.textContent=tr('Ranking online indisponível. Mostrando só este aparelho.');
    el.appendChild(n);
  });
}
function saveCu(){
  try{
    localStorage.setItem('brs48cr_cu2', JSON.stringify(CU));
    localStorage.setItem('brs48cr_ch2', JSON.stringify(CH.map(function(c){
      return {out: c.out||'', outcol: c.outcol||'', legcol: c.legcol||'', baixo: c.baixo||'', hat: c.hat||'', gl: c.gl||''};
    })));
  }catch(e){}
}
function pick(i){
  sel=i;
  [].forEach.call(cw.children,function(x,j){x.setAttribute('aria-pressed',j===i)});
  $('cust').hidden = i!==3;
  
  var source = (i === 3) ? CU : CH[i];
  if ($('cout')) $('cout').value = source.out || '';
  if ($('coutcol')) $('coutcol').value = source.outcol || '#ffffff';
  if ($('chat')) $('chat').value = source.det==='tulipa' ? 'tulipa' : (source.hat || '');
  if ($('cgl')) $('cgl').value = source.gl || '';
  if ($('chair')) $('chair').value = source.hair || '#ff7eb6';
  if ($('cstr')) $('cstr').value = source.hair2 || '#4dd8ff';
  if ($('cstk')) $('cstk').value = source.mecha||(source.streak?'uma':'');
  if ($('ceye')) $('ceye').value = source.eye || '#5a3b2e';
  if ($('cleg')) $('cleg').value = source.legcol || '#1c1c30';
  if ($('cbaixo')) $('cbaixo').value = source.baixo || '';   // saia ou bermuda   // meia/bota: mesmo retângulo, só a cor
  if ($('cback')) $('cback').value = source.back || '';
  if ($('cfront')) $('cfront').value = source.front || 'bagunca';
  if ($('cdet')) $('cdet').value = source.det || '';
  if ($('colho')) $('colho').value = source.olho || '';
  if ($('cboca')) $('cboca').value = source.boca || '';
  if ($('cbochecha')) $('cbochecha').value = source.bochecha || '';
  if ($('csobr')) $('csobr').value = source.sobrancelha || '';
  
  try{localStorage.setItem('brs48cr_char',i)}catch(e){}
  refreshAcc();   // V2.1.3: itens por personagem
}
var seen=1;
function refreshAcc(){
  var e=$('acc'),ok=false,lim=(typeof bestDe==='function'?bestDe(sel):best);   // V2.1.3: recompensas por personagem
  e.innerHTML='';
  ACC.forEach(function(a){
    var o=document.createElement('option'),u=lim>=a[2];
    o.value=a[0];o.disabled=!u;
    o.textContent=(u?'':'🔒 ')+tr(a[1])+(u?'':' ('+tr(RANKS[a[3]][1])+')');
    e.appendChild(o);if(a[0]===accSel&&u)ok=true;
  });
  if(!ok)accSel='';e.value=accSel;
  if(typeof LOJA_EXTRA!=='undefined'&&typeof acessoriosSync==='function')acessoriosSync(); // recoloca a Torrada comprada após reconstruir os itens
  $('newb').hidden=ACC.filter(function(a){return best>=a[2]}).length<=seen;

  ['cout','chat','cgl'].forEach(function(id){
    var selE=$(id); if(!selE)return;
    [].forEach.call(selE.options,function(o){
      var r=+(o.getAttribute('data-r')||0);
      var u=lim>=r; o.disabled=!u;
      var rawKey=o.__rawLabel||o.textContent.replace(/^🔒\s*/,'');
      o.__rawLabel=rawKey;
      o.textContent=(u?'':'🔒 ')+tr(rawKey);
    });
  });
}
var nick='';
function rnd(a,b){return a+Math.random()*(b-a)}
function city(n,hmin,hmax){
  var a=[],x=0;
  while(x<W+300){
    var w=rnd(42,84);
    a.push({x:x,w:w,h:rnd(hmin,hmax),s:Math.random()});
    x+=w+rnd(0,7);
  }
  return a;
}
function mkProps(){
  var a=[],x=60;
  while(x<W+400){
    var type=Math.random();
    var w=type<0.45?32:(type<0.8?20:44);
    var h=type<0.45?rnd(46*K,68*K):(type<0.8?rnd(72*K,96*K):rnd(38*K,52*K));
    a.push({x:x,w:w,h:h,type:type,s:Math.random()});
    x+=w+rnd(90,220);
  }
  return a;
}
function mk(){
  far=city(0,65*K,150*K);
  near=city(0,42*K,105*K);
  props=mkProps();
  farW=far[far.length-1].x+80;
  nearW=near[near.length-1].x+80;
  propsW=props[props.length-1].x+120;
}
function layout(){
  var pt=window.matchMedia&&matchMedia('(max-width:700px) and (orientation:portrait)').matches;
  W=pt?380:720;H=pt?506:380;GY=H-80;SC=Math.max(.65,W/720);K=GY/300;cv.width=W;cv.height=H;g=cv.getContext('2d');   /* 17/11: pede o pincel de novo para a nitidez automática (tw-nitidez.js) valer no tamanho atual */
  var st=document.getElementById('stage');st.style.aspectRatio=W+'/'+H;st.style.maxWidth=pt?'calc((100vh - 120px) * '+(W/H)+')':'760px';
  mk();
}
var AC=null;
function ac(){
  if(!AC){try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  if(AC&&AC.state==='suspended')AC.resume();
  return AC;
}
function beep(f,d,t,v,when){
  var a=ac();if(!a||muted)return;
  var o=a.createOscillator(),gn=a.createGain(),s=a.currentTime+(when||0);
  o.type=t||'square';o.frequency.setValueAtTime(f,s);gn.gain.setValueAtTime(v||.05,s);gn.gain.exponentialRampToValueAtTime(.001,s+d);
  o.connect(gn);gn.connect(a.destination);o.start(s);o.stop(s+d);
}
var mel=[523,659,784,659,587,698,880,698,523,659,784,1046,988,784,659,784],bass=[131,131,175,175,196,196,131,131],men=[523,659,784,659,880,784,659,587,523,659,784,1046,880,784,659,587],bi=0,mt=null;
var BS={tense:[110,110,110,104,110,110,98,104],hard:[110,104,110,98,110,104,123,104]};
function twJogoEmPopup(){   // Sora/Karaoke abertos: so vale a musica do jogo de dentro
  var pv=document.getElementById('twPreviewJogo');if(pv&&!pv.hidden)return true;
  return typeof twJogoNovoAberto==='function'&&!!twJogoNovoAberto();   // Café, Battle, Jardim e Studio têm trilha própria (jogos-trilha.js)
}
function music(on){
  clearInterval(mt);if(!on)return;
  var k=curT||'menu',ms={menu:260,tense:150,hard:120,alien:130,kawaii:100,unit:130,pet:340,petSono:560}[k]||190;
  crPassoMs=ms;   // 17/11: as luzes de palco do Center⭐Run pulsam nesta batida (crBatidaT)
  mt=setInterval(function(){
    if(muted||paused||document.hidden||(typeof hubOv!=='undefined'&&typeof hubTelaAberta==='function'&&hubTelaAberta())){clearInterval(mt);mt=null;return;}
    if(twJogoEmPopup()){clearInterval(mt);mt=null;curT='';return;}   // o jogo do pop-up cuida do proprio som
    var N=TR[k]||mel;
    if(k==='menu'){var n=N[bi%16];if(n){beep(n,.3,'sine',.04);beep(n*1.5,.2,'triangle',.015)}if(bi%4===0)beep(bass[(bi/4)%8|0],.5,'sine',.03)}
    else if(k==='pet'||k==='petSono'){petMusicStep(k)}
    else if(k==='tense'||k==='hard'){var n2=N[bi%16];if(n2)beep(n2,.1,'square',.022);if(bi%2===0)beep(BS[k][(bi/2)%8|0],.2,'sawtooth',.03)}
    else{
  beep(N[bi%16],.14, k==='kawaii'?'triangle':'square',.018);
  if(bi%2===0 && k!=='kawaii') beep(bass[(bi/2)%8|0],.25,'triangle',.04);
}
    if(bi%2===0)crBatidaT=performance.now();
    bi++;
  },ms);
}
var crBatidaT=0,crPassoMs=190;
function sync(){var k=state!=='play'?(typeof petMusicK==='function'?petMusicK():'menu'):(pw&&pw.k==='gigante'?'kawaii':pw&&pw.k==='alien'?'alien':pw&&pw.k==='unit'?'unit':rankI>=9?'hard':rankI>=7?'tense':'s'+(Math.floor(frame/3600)%4));if(k!==curT)curT=k;if(muted||paused||document.hidden||twJogoEmPopup()||(typeof hubOv!=='undefined'&&typeof hubTelaAberta==='function'&&hubTelaAberta())){clearInterval(mt);mt=null;return;}if(!mt)music(true);}
var ct = 0; 
var paused=false,abducted=false,wasAbducted=false;
var isTestGame = false;
var CFG={STAR:15,STAR_FEVER:30,CARD:100,UFO_EVERY:2500,UFO_BONUS:100,UFO_FRAMES:480,UFO_STAR_MULT:.5,DIST_RATE:.015};
function reset(){
  P={x:80,y:GY-44,vy:0,w:30,h:44,air:false};
  obs=[]; items=[]; fans=[]; sp=5.5; if(typeof cenaReset==='function') cenaReset();
  var tstVal = (!$('tstw').hidden && $('tst')) ? (+$('tst').value||0) : 0;
  isTestGame = (tstVal > 0 || !$('tstw').hidden);
  score=tstVal; dist=0; frame=0; toast=''; toastT=0;
  rankI=rankOf(score); shake=0;
  nextX=W+160; pw=null; shield=rankI>=7?1:0; inv=0; held=false; sash=rankI>=7;
  lastCard=-600; dpw=null; pops=[]; stars=0;
  lastUfo = Math.floor(score / CFG.UFO_EVERY);
  window.lastMorango = Math.floor(score / 3500);
  window.lastMic = Math.floor(score / 3000);   // V2.1.3: igual ao intervalo do microfone
  window.lastPetMilestone = Math.floor(score / 1500);
  window.lastPaparazzi = Math.floor(score / 2500);
  finalExpr = 0;
  window.wasGiant = false;
  window.activePetFly = null;
  window.petBag = [];
  window.lastPetKey = '';
  window.flashAlpha = 0;
window.wasUnit = null;
window.collectedPartners = [];
window.partnerBag = [];
window.lastPartnerPicked = null;
}
function rankOf(s){var r=0;for(var i=0;i<RANKS.length;i++)if(s>=RANKS[i][0])r=i;return r}
function start(e){
  if(e && e.preventDefault) e.preventDefault();

// Validação: Exige o preenchimento do nome
  var inputNick = $('nick');
  var nomeLimpo = (inputNick ? inputNick.value : '').trim();

  if(!nomeLimpo){
    if(inputNick){
      inputNick.classList.remove('aviso-erro');
      void inputNick.offsetWidth; // Força o reflow para reiniciar a animação
      inputNick.classList.add('aviso-erro');
      inputNick.focus();
    }
    // Efeito sonoro de erro/aviso
    if(sfx && sfx.hit) sfx.hit();
    var nm = $('nickMsg'); if(nm){ nm.hidden = false; clearTimeout(nm._t); nm._t = setTimeout(function(){ nm.hidden = true; }, 3500); }   // aviso na tela (sem alert)
    return; // Interrompe o início do jogo
  }

  if(_supabase&&(!contaAuthPronta||(contaAuthUserId&&!contaJ))&&$('tstw').hidden){contaAviso(tr('Aguarde a conta carregar e tente de novo.'));return;}
  if(document.activeElement && document.activeElement.blur) document.activeElement.blur();
  clearTimeout(overTimer);
  ac();
  layout();
  reset();
  contaTesteParceiras(); contaInicioCorrida();   // V2.1.2: modo teste com parceiras + corrida conferida no servidor


var isTesting = (!$('tstw').hidden && $('tst') && +$('tst').value > 0);
  if (isTesting) {
    // Sorteia 50% de chance para vir um Morango ou uma Nave Espacial (UFO)
    var sorteioItem = Math.random() < 0.5 ? 'morango' : 'ufo';
    items.push({
      k: sorteioItem,
      x: 500, // Bem mais à frente, dando tempo de ver a pista!
      y: sorteioItem === 'morango' ? GY - 30 : GY - 100,
      w: sorteioItem === 'morango' ? 22 : 32,
      h: sorteioItem === 'morango' ? 22 : 20,
      got: false,
      ct: 'ima' // Força o efeito magnético para atrair obrigatoriamente até você!
    });
window.activePetFly = {
      type: petCorridaTipo(['tsu', 'lirika', 'pati'][Math.floor(Math.random() * 3)]),   // Backstage⭐Pet!: seu pet ativo
      x: W + 70,
      y: GY - 80, // Voando baixinho para entregar o presente
      dropped: false
    };
  }

nextX = W + 600;
	
  getTok();
  paused=false;
  $('pz').hidden=true;
  $('pause').style.display='block';
  $('pause').textContent='⏸';
  $('cam').style.display='block';
  if(window.matchMedia&&matchMedia('(pointer:coarse)').matches) $('jb').style.display='block';
  abducted=false;wasAbducted=false;
  window.wasGiant=false;
  state='play';
  document.body.classList.add('jogando');   // esconde a dica e o rodapé durante a corrida
  $('menu').hidden=true;
  $('over').hidden=true;
  curT='';
  bi=0;
  sync();
  last=performance.now();
}
var celebRaf = 0;
function setPause(v){if(state!=='play')return;paused=v;$('pz').hidden=!v;$('pause').textContent=v?'▶':'⏸';sync();}
var charPose = '';
function charDrawVerticalRamp(key,height,gradientHeight,top,bottom){
 var ramp=CHAR_DRAW_RAMP_CACHE.get(key);if(ramp)return ramp;
 var canvas=document.createElement('canvas');canvas.width=1;canvas.height=height;
 var ctx=canvas.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,gradientHeight);
 gradient.addColorStop(0,top);gradient.addColorStop(1,bottom);ctx.fillStyle=gradient;ctx.fillRect(0,0,1,height);
 ramp={canvas:canvas,top:top,bottom:bottom};
 if(CHAR_DRAW_RAMP_CACHE.size>=64)CHAR_DRAW_RAMP_CACHE.delete(CHAR_DRAW_RAMP_CACHE.keys().next().value);
 CHAR_DRAW_RAMP_CACHE.set(key,ramp);return ramp;
}
function charDrawStaticAssets(){
 if(CHAR_DRAW_STATIC_ASSETS)return CHAR_DRAW_STATIC_ASSETS;
 var horizontal=document.createElement('canvas');horizontal.width=20;horizontal.height=1;
 var hx=horizontal.getContext('2d'),hg=hx.createLinearGradient(0,0,20,0);
 hg.addColorStop(0,'rgba(255,255,255,.2)');hg.addColorStop(.32,'rgba(255,255,255,0)');hg.addColorStop(.6,'rgba(40,10,70,0)');hg.addColorStop(1,'rgba(40,10,70,.24)');
 hx.fillStyle=hg;hx.fillRect(0,0,20,1);
 var vertical=document.createElement('canvas');vertical.width=1;vertical.height=4;
 var vx=vertical.getContext('2d'),vg=vx.createLinearGradient(0,0,0,4);
 vg.addColorStop(0,'rgba(40,10,70,0)');vg.addColorStop(1,'rgba(40,10,70,.16)');vx.fillStyle=vg;vx.fillRect(0,0,1,4);
 CHAR_DRAW_STATIC_ASSETS={clothHorizontal:horizontal,clothVertical:vertical,
  koalaEar:charDrawVerticalRamp('accessory|koala-ear',12,12,'#94a3b8','#475569'),
  technopop:charDrawVerticalRamp('outfit|technopop',12,12,'#f1f5f9','#94a3b8')};
 return CHAR_DRAW_STATIC_ASSETS;
}
function drawChar(c,x,y,run,expr,isPartner){
  var corDaRoupa = c.outcol || '#ffffff';
  var PX=state==='play'?pw:state==='over'?dpw:null,OUT=(PX&&(PX.k==='fever'||PX.k==='ima'))?(PX.k==='fever'?['#ff6fa5','#ffc2dc']:['#b392f0','#dccdfa']):['#fff','#dfe6f5'],OF=state==='menu'?0:rankI>=11?5:rankI>=10?4:rankI>=9?3:rankI>=8?2:rankI>=7?1:0,up=run>0,sw=Math.sin(frame*.5)*2,b=c.back||'',f=c.front||'bagunca',d=c.det||'',hacc=c.hat||'',H=c.hair,A=accSel;
  if (PX && PX.k === 'alien') OF = 0;   // abdução tem prioridade sobre o visual de rank
    if (isPartner) { OF = 0; A = ''; }    // parceiros usam o próprio look, não o do jogador
  // 17/11: correndo, o trio aparece DE PERFIL (tw-lado.js). Só o visual fixo do Tsu, da Lirika e do Pati, sem roupa de rank
  // nem acessório na mão (esses continuam de frente). O "Você" também, com as cores de cabelo/pele/olhos/roupa, quando está sem chapéu.
  if (state === 'play' && window.TW_LADO && TW_LADO.corre && OF === 0 && !(PX && PX.k === 'alien') &&
      (isPartner || !A) && (c === CH[0] || c === CH[1] || c === CH[2] || (c === CH[3] && !c.hat))) {   // o Você também, sem chapéu (o perfil não desenha chapéu)
    try { TW_LADO.corre(g, c, x, y, expr, frame, run === 0 ? .8 : run, OUT); return; } catch (e) {}   // no ar (run 0): passada aberta
  }
  var sl=(b==='longo'||b==='chanel'||b==='onduladof'||((b===''||b==='pixie'||b==='onduladom'||b==='onduladom2')?false:(f==='reta'||f==='arcoiris')))?(b==='onduladof'?9:14):(b==='onduladom'||b==='onduladom2'?7:(b==='pixie'?5:((b===''&&(f==='reta'||f==='arcoiris'))?10:6)));
  function E(cx,cy,rx,ry,r){g.beginPath();g.ellipse(cx,cy,rx,ry,r||0,0,7);g.fill()}
  function T(a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();g.fill()}
  var HD='#'+H.replace(/^#/,'').replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-60).toString(16)).substr(-2)});
  g.fillStyle=HD;
  var hb=typeof TWAvatarRoupa!=='undefined'?TWAvatarRoupa.cabelo(g,H,HD,y,b,0):null;if(hb)g.fillStyle=hb;   // V3.1: costas do chanel/longo emendadas no topo
  if(hb)TWAvatarRoupa.costas(g,x,y,b);
  else if(b==='chanel'){g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-1,y+22,x+4,y+25);g.lineTo(x+26,y+25);g.quadraticCurveTo(x+31,y+22,x+28,y+13);g.fill()}
  else if(b==='longo'){g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-4,y+34,x+3,y+41);g.lineTo(x+27,y+41);g.quadraticCurveTo(x+34,y+34,x+28,y+13);g.fill()}
  else if(b==='marias'){E(x+1,y+8,4,4);E(x+29,y+8,4,4);E(x-2,y+18,4.6,10.5,.18+sw*.03);E(x-1.5,y+26,3.2,7,.25+sw*.03);E(x+32,y+18,4.6,10.5,-.18-sw*.03);E(x+31.5,y+26,3.2,7,-.25-sw*.03);g.fillStyle='#e0457b';E(x+.5,y+9.5,2.2,1.6,.5);E(x+29.5,y+9.5,2.2,1.6,-.5)}
  else if(b==='rabo'){var rs=sw*.5;g.beginPath();g.moveTo(x+24,y+4);g.quadraticCurveTo(x+37,y+7+rs,x+33.5,y+20+rs);g.quadraticCurveTo(x+31.5,y+28+rs,x+27,y+33+rs);g.quadraticCurveTo(x+29.5,y+21+rs,x+24.5,y+12);g.closePath();g.fill();g.fillStyle='#e0457b';E(x+27,y+6,2.4,1.8,.7)}
    else if(b===''){g.beginPath();g.arc(x+15,y+12,13.2,Math.PI,0);g.lineTo(x+28.2,y+20);g.lineTo(x+25,y+22);g.lineTo(x+5,y+22);g.lineTo(x+1.8,y+20);g.closePath();g.fill()}   // Curto: reforço ao redor do cabelo
  else if(b==='pixie'){T([x+4,y+10,x+0,y+17,x+3,y+19,x+2,y+24,x+8,y+21,x+9,y+14]);T([x+26,y+10,x+30,y+17,x+27,y+19,x+28,y+24,x+22,y+21,x+21,y+14]);T([x+9,y+22,x+15,y+28,x+21,y+22])}   // Pixie: pontas repicadas  
  else if(TWAvatarHair.back(g,c,x,y,b,E,T)){}
  else if(b==='cacheado'){[[15,3,8],[4,8,8],[26,8,8],[1.5,16,7.5],[28.5,16,7.5],[3.5,23,5.8],[26.5,23,5.8]].forEach(function(p){E(x+p[0],y+p[1]+6,p[2],p[2])})}   // cachos menores embaixo: não viram capa sobre os braços
  if(OF===3){g.fillStyle='#b01e3a';T([x+5,y+22,x-8+sw,y+42,x+9,y+40])}
  if(OF===5){g.fillStyle='rgba(255,252,235,.95)';E(x-4,y+27,5,13,-.5+sw*.04);E(x+34,y+27,5,13,.5-sw*.04);g.fillStyle='rgba(255,226,140,.8)';E(x-2,y+30,3,9,-.5+sw*.04);E(x+32,y+30,3,9,.5-sw*.04)}
  g.fillStyle=(typeof c.legcol==='string'&&/^#[0-9a-f]{6}$/i.test(c.legcol))?c.legcol:'#1c1c30';g.fillRect(x+9,y+36+(up?0:-2),5,8+(up?0:2));g.fillRect(x+17,y+36+(up?-2:0),5,8+(up?2:0));if(typeof TWAvatarRosto!=='undefined'&&TWAvatarRosto)TWAvatarRosto.pes(g,c,x,y);
  var TWR=typeof TWAvatarRoupa!=='undefined'?TWAvatarRoupa:null,twRoupa=(OF>0||(PX&&PX.k==='alien'))?'-':(c.out||'');   // folha E: saia ou bermuda, ombro e luz contínua
  if(!(TWR&&TWR.baixo(g,c,x,y,twRoupa))){g.fillStyle=OUT[1];g.fillRect(x+7,y+32,16,6);}
  
  var AL = (PX && PX.k === 'alien');
  var roupa = AL ? 'espacial' : (OF > 0 ? '' : (c.out || ''));

  if(roupa==='seifuku'){
    g.fillStyle=corDaRoupa;g.fillRect(x+4,y+22,22,12); if(TWR)TWR.tronco(g,x,y,twRoupa);
    g.fillStyle='#1b2a5e';T([x+4,y+22, x+26,y+22, x+15,y+29]); 
    g.fillStyle=corDaRoupa;T([x+10,y+22, x+20,y+22, x+15,y+27]); 
    g.fillStyle='#e02a4a';E(x+15,y+27,2,2); T([x+15,y+27, x+12,y+31, x+14,y+32]); T([x+15,y+27, x+18,y+31, x+16,y+32]); 
  }else if(roupa==='y2k'){
    g.fillStyle='#111';g.fillRect(x+7,y+22,16,6); 
    g.fillStyle=c.skin;g.fillRect(x+7,y+28,16,4); 
    g.fillStyle=corDaRoupa;g.fillRect(x+7,y+22,3,10);g.fillRect(x+20,y+22,3,10); // Abas do blazer; mangas somente em TWR.ombro
    if(TWR)TWR.tronco(g,x,y,twRoupa);
  }else if(roupa==='citypop'){
    g.fillStyle='#111827'; g.fillRect(x+7, y+22, 16, 12);
    g.fillStyle='#fff'; g.fillRect(x+7, y+32, 16, 2);
    g.fillStyle=corDaRoupa; g.fillRect(x+7, y+22, 4, 11); g.fillRect(x+19, y+22, 4, 11); // Abas do paletó; mangas somente em TWR.ombro
    if(TWR)TWR.tronco(g,x,y,twRoupa);
    g.fillStyle='#34d399'; g.fillRect(x+11, y+22, 8, 5);
    g.fillStyle='#fbbf24'; g.fillRect(x+17, y+28, 2, 2);

}else if(roupa==='zipper'){
    // Shortinhos brancos bufantes por baixo
    g.fillStyle='#fff'; g.fillRect(x+6, y+31, 18, 7);
    
    // Saia aberta na frente (duas abas laterais) — por baixo do top (V2.1.3)
    g.fillStyle=corDaRoupa;
    if(!(typeof TWAvatarRosto!=='undefined'&&TWAvatarRosto.baixoEspecial(g,c,x,y,'zipper',corDaRoupa,T))){   // bermuda escolhida troca as abas da saia
    T([x+4, y+30, x+12, y+30, x+2, y+42]); // Aba caindo para a esquerda
    T([x+26, y+30, x+18, y+30, x+28, y+42]); // Aba caindo para a direita
    if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'zipper-saia');
    }
    
    // Top branco
    g.fillStyle='#fff'; g.fillRect(x+5, y+22, 20, 10);
    
    // Mangas bufantes (com a cor escolhida pelo jogador)
    g.fillStyle=corDaRoupa; E(x+3, y+24, 3, 4); E(x+27, y+24, 3, 4);
    
    // Cadarço do corset (Laces) preto no peito
    g.strokeStyle='#222'; g.lineWidth=1;
    g.beginPath(); 
    g.moveTo(x+12, y+23); g.lineTo(x+18, y+26); g.moveTo(x+18, y+23); g.lineTo(x+12, y+26); // X de cima
    g.moveTo(x+12, y+27); g.lineTo(x+18, y+30); g.moveTo(x+18, y+27); g.lineTo(x+12, y+30); // X de baixo
    g.stroke();
    
    // Cintura alta / Cinto
    g.fillStyle=corDaRoupa;
    g.fillRect(x+5, y+29, 20, 3); if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'zipper-tronco');

} else if(roupa==='sweet'){
    // --- INÍCIO DO LOOK VALENTINE (SWEET) ---
    g.fillStyle = corDaRoupa;
    if(!(typeof TWAvatarRosto!=='undefined'&&TWAvatarRosto.baixoEspecial(g,c,x,y,'sweet',corDaRoupa,T))){   // bermuda escolhida troca a saia rodada
    T([x + 2, y + 33, x + 28, y + 33, x + 34, y + 43, x - 2, y + 43]); // Saia Rodada (por baixo do vestido, V2.1.3)
    if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'sweet-saia');
    g.fillStyle = '#ffffff';   // Babado de chantilly
    T([x - 1.2, y + 41, x + 31.2, y + 41, x + 34, y + 43, x - 2, y + 43]);
    for (var cq = 0; cq < 9; cq++) { g.beginPath(); g.arc(x - 0.4 + cq * 4, y + 43, 2, 0, Math.PI); g.fill(); }
    }

    g.fillStyle = corDaRoupa; 
    g.fillRect(x + 4, y + 22, 22, 12); // Base do vestido
    if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'sweet-tronco');

    g.fillStyle = '#ffffff'; 
    g.fillRect(x + 8, y + 23, 14, 11); // Avental Branco

    g.fillStyle = corDaRoupa;
    g.fillRect(x + 8, y + 23, 2, 5);
    g.fillRect(x + 20, y + 23, 2, 5); // Alças

    g.fillStyle = '#ff2a4d'; // Coração Vermelho
    g.fillRect(x + 13, y + 26, 2, 2);
    g.fillRect(x + 16, y + 26, 2, 2);
    g.fillRect(x + 12, y + 28, 7, 2);
    g.fillRect(x + 13, y + 30, 5, 2);
    g.fillRect(x + 14, y + 32, 3, 1);

    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x + 4, y + 33.4, 22, .8);   // cós da saia

    // --- FIM DO LOOK VALENTINE ---

     }else if(roupa==='estrelado' && typeof roupaEstrelado==='function'){ roupaEstrelado(c, x, y, corDaRoupa, E, T);   // V2.1.3
     }else if(roupa==='espacial'){
    var AC1=c.img||H;   // Tsu roxo, Lirika verde, Pati azul, Você = cor do cabelo
    var AC2='#'+AC1.replace(/^#/,'').replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-70).toString(16)).substr(-2)});
    g.fillStyle='#e8f0ff'; g.fillRect(x+4,y+22,22,12);                       // macacão
    g.fillStyle=AC2; g.fillRect(x+4,y+22,3,12); g.fillRect(x+23,y+22,3,12); // laterais (tom escuro)
    g.fillStyle=AC1; g.fillRect(x+9,y+21,12,2);                              // gola
    g.fillRect(x+7,y+30,16,2);                                               // cinto
    g.fillRect(x+12,y+24,6,4);                                               // painel
    g.fillStyle='#fff'; g.fillRect(x+14,y+25,2,2);
  }else if(perfRoupaLoja(roupa, c, x, y, corDaRoupa, E, T)){
    // V2.1.3: roupa da lojinha (desenhada no módulo do perfil)
  }else{

    // Roupa Básica
    g.fillStyle=corDaRoupa;g.fillRect(x+4,y+22,22,12);if(TWR)TWR.tronco(g,x,y,twRoupa,c);else{g.fillStyle='#4a5170';g.fillRect(x+4,y+22,3,12);g.fillRect(x+23,y+22,3,12);}   // V3.1: sem o cinza por baixo (vazava como listra)
    if(TWR)TWR.gravata(g,x,y);else{g.fillStyle='#1b2a5e';g.fillRect(x+14,y+22,3,10);}
  }

  // Efeitos de Fever/Ímã e Pele
  if(PX&&(PX.k==='fever'||PX.k==='ima')){g.fillStyle=PX.k==='fever'?'#ffe14d':'#fff';g.fillRect(x+9,y+27,3,3);g.fillRect(x+10,y+26,1,5);g.fillRect(x+8,y+28,5,1)}
  g.fillStyle=c.skin;
  if(!charPose){ g.fillRect(x+1,y+24,4,7);g.fillRect(x+25,y+24,4,7);E(x+3,y+31,2,2);E(x+27,y+31,2,2); }   // com pose, os braços vêm depois das roupas (V2.1.2)
  if(!charPose&&TWR){TWR.bracos(g,x,y);g.fillStyle=c.skin;}   // V3.1: luz contínua na pele

  // Mangas bufantes por cima dos braços
  if(roupa === 'sweet' || roupa === 'zipper'){
    g.fillStyle = (roupa === 'sweet') ? '#ffffff' : corDaRoupa; 
    E(x + 1.5, y + 24.5, 4, 4);  
    E(x + 28.5, y + 24.5, 4, 4); 
    if(roupa === 'zipper') if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'zipper-mangas');
  }

  if(OF===1){g.fillStyle=PX?OUT[1]:'#2a3f8a';T([x+6,y+31,x+24,y+31,x+27,y+39,x+3,y+39]);g.fillStyle=PX?OUT[0]:'#2a3f8a';g.fillRect(x+5,y+22,20,10);g.fillStyle='#fff';T([x+8,y+22,x+22,y+22,x+15,y+31]);g.fillStyle=PX?OUT[0]:'#2a3f8a';T([x+11,y+22,x+19,y+22,x+15,y+27]);g.fillStyle='#e02a4a';E(x+15,y+28,2.4,2.4);T([x+15,y+28,x+11,y+32,x+13,y+33]);T([x+15,y+28,x+19,y+32,x+17,y+33]);g.fillStyle='#fff';g.fillRect(x+3,y+38,24,1.2)}
  if(OF===2){g.fillStyle=PX?OUT[0]:'#fff0f7';T([x+5,y+22,x+25,y+22,x+29,y+40,x+1,y+40]);g.fillStyle='#ffd23f';g.fillRect(x+4,y+31,22,2);g.fillRect(x+5,y+22,20,1.5);g.fillStyle='#ff4f9a';T([x+15,y+26,x+9,y+22,x+9,y+30]);T([x+15,y+26,x+21,y+22,x+21,y+30]);E(x+15,y+26,2,2);g.fillStyle='rgba(255,230,120,'+(.4+.5*Math.sin(frame*.2))+')';g.fillRect(x+6,y+37,2,2);g.fillRect(x+22,y+35,2,2);g.fillRect(x+14,y+38,2,2)}
  if(OF===3){g.fillStyle=PX?OUT[0]:'#1b2a5e';g.fillRect(x+4,y+22,22,12);g.fillStyle='#fff';T([x+12,y+22,x+18,y+22,x+15,y+28]);g.fillStyle='#ffd23f';g.fillRect(x+2,y+22,7,3);g.fillRect(x+21,y+22,7,3);E(x+15,y+30,1,1);E(x+11,y+31,1,1);E(x+19,y+31,1,1);g.fillStyle=PX?OUT[1]:'#1b2a5e';g.fillRect(x+7,y+32,16,6);g.fillStyle='#ffd23f';g.fillRect(x+7,y+37,16,1.4)}
  if(OF===4){g.fillStyle=PX?OUT[1]:'#1a1426';T([x+6,y+31,x+24,y+31,x+28,y+39,x+2,y+39]);g.fillStyle=PX?OUT[0]:'#1a1426';g.fillRect(x+5,y+22,20,10);g.fillStyle='#ffd23f';g.fillRect(x+2,y+38,26,1.6);g.fillRect(x+13,y+22,4,10);g.fillStyle='#fff';T([x+12,y+22,x+18,y+22,x+15,y+27]);g.fillStyle='#ff3d5e';E(x+15,y+29,1.8,1.8);g.fillStyle='#ffd23f';g.fillRect(x+4,y+22,5,2);g.fillRect(x+21,y+22,5,2)}
  if(OF===5){g.fillStyle=PX?OUT[0]:'#fffdf2';T([x+4,y+22,x+26,y+22,x+30,y+42,x,y+42]);g.fillStyle='#ffd23f';g.fillRect(x+13,y+22,4,20);g.fillRect(x,y+40,30,2);g.fillStyle='rgba(255,226,140,'+(.5+.4*Math.sin(frame*.2))+')';g.fillRect(x+7,y+29,2,2);g.fillRect(x+22,y+34,2,2);g.fillRect(x+10,y+38,2,2)}
  
  if(!(TWR&&TWR.luzPropria(twRoupa))) roupaSombra(x, y);   // V2.1.3: luz e sombra nas roupas (igual ao degradê do cabelo)
  if(sash&&state!=='menu'&&!isPartner&&!(PX&&PX.k==='alien')){g.strokeStyle='#ff4f9a';g.lineWidth=4;g.beginPath();g.moveTo(x+5,y+22);g.lineTo(x+24,y+34);g.stroke()}
  if(charPose){ g.fillStyle=c.skin; petPoseArms(c, x, y); } if(TWR)TWR.ombro(g,c,x,y,twRoupa,charPose);   // pose da Foto 2.0 por cima da roupa e da faixa
  g.fillStyle=c.skin;g.fillRect(x+12,y+18,6,6);g.save();g.translate(0,-4);
  
  // As orelhas ficam por trás do cabelo; a base é mais baixa para não cobrir a franja.
  if(d==='coelho'){[[9.5,-.2],[20.5,.2]].forEach(function(p){g.save();g.translate(x+p[0],y+1);g.rotate(p[1]);g.fillStyle='#fff';g.beginPath();g.ellipse(0,-5,3.4,9,0,0,7);g.fill();g.fillStyle='rgba(255,150,190,.9)';g.beginPath();g.ellipse(0,-4,1.6,6.5,0,0,7);g.fill();g.restore();});}
  if(d==='gato'){g.fillStyle=H;T([x+3,y+9,x+6,y-4,x+13,y+4]);T([x+27,y+9,x+24,y-4,x+17,y+4]);g.fillStyle='rgba(255,150,190,.8)';T([x+6,y+6,x+7,y,x+10,y+4]);T([x+24,y+6,x+23,y,x+20,y+4])}
  if(d==='chifres'){g.fillStyle='#7a1f2b';T([x+4,y+8,x+1,y-6,x+10,y+3]);T([x+26,y+8,x+29,y-6,x+20,y+3])}
  if(d==='coques'){g.fillStyle=H;E(x+4,y+3,6,6);E(x+26,y+3,6,6);g.fillStyle='#2a5bd7';g.fillRect(x+1,y+6,7,3);g.fillRect(x+22,y+6,7,3)}
  g.fillStyle=c.skin;E(x+15,y+17,11,11);
  if(TWR){TWR.rosto(g,x,y);g.fillStyle=c.skin;}
  if(d==='elfo'){if(typeof TWAvatarRosto!=='undefined')TWAvatarRosto.elfo(g,c,x,y);else{T([x+4,y+17,x-3,y+10,x+5,y+21]);T([x+26,y+17,x+33,y+10,x+25,y+21])}}
  if(d==='olheiras'){g.fillStyle='rgba(130,70,90,0.3)'; g.beginPath(); g.ellipse(x+11.5, y+22.5, 3, 1.2, 0, 0, 7); g.ellipse(x+19.5, y+22.5, 3, 1.2, 0, 0, 7); g.fill();}
  
  if(hacc==='bandaid'){g.fillStyle='#d97706'; g.fillRect(x+6, y+21, 7, 4); g.fillStyle='#fcd34d'; g.fillRect(x+6.5, y+21.5, 6, 3); g.fillStyle='#fff'; g.fillRect(x+8, y+22, 3, 2);}

  var hg=g.createLinearGradient(0,y+5,0,y+24);hg.addColorStop(0,H);hg.addColorStop(1,HD);g.fillStyle=hg;
  if(hb){hg=TWR.cabelo(g,H,HD,y,b,1);g.fillStyle=hg;}
  if(TWAvatarHair.isWavy(b))TWAvatarHair.top(g,x,y,b);else{g.beginPath();g.arc(x+15,y+12,12,Math.PI,0);g.fill();}
  g.fillRect(x+3,y+11.5,4,sl+0.5);g.fillRect(x+23,y+11.5,4,sl+0.5); // +0.5 elimina qualquer fresta entre o topo e as costeletas
  
  if(b===''||b==='pixie'){   // pontas arredondadas nas laterais
    g.fillStyle=hg; E(x+5,y+12+sl,2,2.2); E(x+25,y+12+sl,2,2.2);
  }

  g.save();   // franjas ficam dentro do contorno redondo da cabeça (sem cantos quadrados); a espetada pode passar para fora
  if(f!=='espetada'){ g.beginPath(); g.arc(x+15,y+12,12,Math.PI,0); g.lineTo(x+27,y+30); g.lineTo(x+3,y+30); g.closePath(); g.clip(); }

  for(var fp=TWR&&TWR.sombraFranja(g,x,y,f,sl,TWAvatarHair.isWavy(b))?0:1;fp<2;fp++){   // V3.1: 1ª passada só gera a sombra na pele; a 2ª desenha a franja inteira, sem recorte
  g.fillStyle=hg;
  if(TWAvatarHair.fringe(g,x,y,b,f,T)){}
  else if(f==='bagunca'){if(TWR)TWR.bagunca(g,x,y);else T([x+3,y+11,x+8,y+19,x+11,y+10,x+16,y+17,x+20,y+9,x+24,y+16,x+27,y+10,x+27,y+9,x+3,y+9]);}
  else if(f==='reta')g.fillRect(x+3,y+8,24,6);
  else if(f==='lateral')T([x+3,y+12,x+7,y+8,x+27,y+8,x+27,y+19,x+17,y+11]);
  else if(f==='espetada')T([x+3,y+10,x+3,y+5,x+7,y-5,x+11,y+3,x+15,y-8,x+19,y+3,x+24,y-5,x+27,y+5,x+27,y+10]);
  else if(f==='arcoiris'&&typeof TWAvatarRosto!=='undefined')TWAvatarRosto.arcoiris(g,x,y);
  else if(f==='arcoiris'){
    g.fillRect(x+3,y+6,24,8);
    var cols = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
    for(var idx=0; idx<6; idx++){
      g.fillStyle=cols[idx];
      g.fillRect(x+4 + (idx*3.6), y+6, 3.8, 9 + (idx%3===1?1:0));
    }
  }
  if(fp===0)g.restore();
  }

  g.restore();
  TWAvatarHair.bicolor(g,c,x,y,b);
  
  if(c.streak)TWAvatarHair.mecha(g,c,x,y,f);

  if(d==='tulipa'){ // guirlanda mística: ramos, folhas ovais e tulipas de pétalas arredondadas
    var tc=['#9b30d9','#b6ff3b','#4169e1',/^#[0-9a-f]{6}$/i.test(c.luz||'')?c.luz:'#ff6fb5'];
    g.strokeStyle='#3b9d70';g.lineWidth=1.25;g.beginPath();g.moveTo(x+2,y+8);g.bezierCurveTo(x+7,y-2,x+23,y-2,x+28,y+8);g.stroke();
    for(var tf=0;tf<4;tf++){
      var fx=x+5.5+tf*6.3,fy=y+2.8-Math.sin(tf*Math.PI/3)*2;
      g.fillStyle='#52b978';E(fx-3.5,fy+2.8,2.6,1.25,-.55);E(fx+3.5,fy+2.8,2.6,1.25,.55);
      g.strokeStyle='#32875c';g.lineWidth=.7;g.beginPath();g.moveTo(fx,fy+5);g.lineTo(fx,fy);g.stroke();
      g.fillStyle=tc[tf];g.beginPath();g.moveTo(fx-3,fy+1.5);g.bezierCurveTo(fx-4.3,fy-3.5,fx-1.8,fy-4.3,fx,fy-1.8);g.bezierCurveTo(fx+1.8,fy-4.3,fx+4.3,fy-3.5,fx+3,fy+1.5);g.quadraticCurveTo(fx,fy+4.6,fx-3,fy+1.5);g.fill();
      g.fillStyle='rgba(255,255,255,.65)';E(fx-.9,fy-.7,.75,1.05,-.4);
    }
    g.fillStyle='#fff4b1';E(x+15,y-5.5,.9,.9);E(x+2,y+3,.65,.65);E(x+28,y+3,.65,.65);
  }

 // Brilho (iluminação) do cabelo em TODOS os personagens e cortes de cabelo!
  g.fillStyle='rgba(255,255,255,.22)'; g.beginPath(); g.ellipse(x+10,y+4.2,4.2,1.3,-0.35,0,7); g.fill();
  
  if(hacc==='boina'){   // boina assentada e inclinada, com sombra embaixo, brilho e o cabinho
    g.fillStyle='#b81f3a';g.beginPath();g.ellipse(x+15.6,y+5,12,2.6,-.12,0,7);g.fill();
    g.fillStyle='#e02a4a';g.beginPath();g.ellipse(x+16.2,y+3.2,12.8,4.9,-.16,0,7);g.fill();
    g.fillStyle='rgba(255,255,255,.26)';g.beginPath();g.ellipse(x+11.8,y+1.4,4.2,1.2,-.22,0,7);g.fill();
    g.fillStyle='#2a1a1a';g.beginPath();g.ellipse(x+16.2,y-1.9,1.1,1.7,.15,0,7);g.fill();}
  if(hacc==='palha'){ // chapéu de palha que veste a cabeça: copa cobrindo o topo, aba na altura da testa e fita TsuLiPa
    g.fillStyle='#e7bf74';g.beginPath();g.ellipse(x+15,y+7.4,16.6,3.2,-.05,0,7);g.fill();                      // aba (parte de trás)
    g.fillStyle='#f7dc9b';g.beginPath();g.moveTo(x+4.6,y+7);g.quadraticCurveTo(x+4.2,y-3.6,x+15,y-4);g.quadraticCurveTo(x+25.8,y-3.6,x+25.4,y+7);g.closePath();g.fill();   // copa
    g.strokeStyle='rgba(177,130,59,.4)';g.lineWidth=.5;g.beginPath();g.moveTo(x+7,y-.4);g.quadraticCurveTo(x+15,y-2.6,x+23,y-.4);g.moveTo(x+5.6,y+2.2);g.quadraticCurveTo(x+15,y+.4,x+24.4,y+2.2);g.stroke();   // trama
    g.fillStyle='#9b30d9';g.fillRect(x+4.9,y+4,20.2,2);g.fillStyle='#b6ff3b';g.fillRect(x+12,y+4,3,2);g.fillStyle='#4169e1';g.fillRect(x+16,y+4,3,2);   // fita
    g.fillStyle='#f9df9d';g.beginPath();g.ellipse(x+15,y+7.6,16,2.3,-.05,0,7);g.fill();                         // aba (frente)
    g.strokeStyle='rgba(172,121,55,.5)';g.lineWidth=.6;g.beginPath();g.ellipse(x+15,y+7.6,16,2.3,-.05,0,7);g.stroke();
    g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(x+10,y-.6,3.6,1.1,-.3,0,7);g.fill();             // brilho da copa
    g.fillStyle='#9b30d9';g.beginPath();g.ellipse(x+22.6,y+5,1.9,1.5,0,0,7);g.fill();g.fillStyle='#fff3b2';g.beginPath();g.ellipse(x+22.6,y+5,.7,.7,0,0,7);g.fill();   // florzinha
  }
  if(hacc==='presilhas'){g.strokeStyle='#ff3d5e';g.lineWidth=1.5;g.beginPath();g.moveTo(x+7,y+7);g.lineTo(x+11,y+11);g.moveTo(x+11,y+7);g.lineTo(x+7,y+11);g.stroke();g.strokeStyle='#4dd8ff';g.beginPath();g.moveTo(x+9,y+5);g.lineTo(x+13,y+9);g.moveTo(x+13,y+5);g.lineTo(x+9,y+9);g.stroke();}
  if(hacc==='fones'){g.strokeStyle='#111';g.lineWidth=1.5;g.beginPath();g.arc(x+15,y+12,14,Math.PI,0);g.stroke();g.fillStyle='#e02a4a';E(x+1,y+15,3,5);E(x+29,y+15,3,5);}

if(hacc==='coala'){
    // 1. Arco da Tiara contornando o topo da cabeça
    g.strokeStyle='#1e293b'; g.lineWidth=1.5; 
    g.beginPath(); g.arc(x+15, y+10, 11, Math.PI, 0); g.stroke();

    // 2. Degradê de sombreamento das orelhas (claro em cima, escuro embaixo)
    var earRamp=charDrawStaticAssets().koalaEar;

    // 3. Orelhas: o degradê comum é desenhado uma vez em uma faixa reutilizável.
    g.save();g.beginPath();g.arc(x+5,y+2,6,0,7);g.arc(x+25,y+2,6,0,7);g.clip();g.drawImage(earRamp.canvas,x-1,y-4,32,12);g.restore();
    g.fillStyle = '#fbcfe8'; g.beginPath(); g.arc(x+5, y+2, 3, 0, 7); g.fill(); // Interior rosa
    g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.arc(x+4, y+0.5, 1.5, 0, 7); g.fill(); // Brilho

    // 4. Interior rosa da orelha direita.
    g.fillStyle = '#fbcfe8'; g.beginPath(); g.arc(x+25, y+2, 3, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.arc(x+24, y+0.5, 1.5, 0, 7); g.fill();

    // 5. Laço centralizado no topo da tiara (exatamente entre as orelhas)
    g.fillStyle='#38bdf8';
    g.beginPath();
    g.moveTo(x+15, y-1); g.lineTo(x+11, y-4); g.lineTo(x+11, y+2); // Aba esquerda do laço
    g.moveTo(x+15, y-1); g.lineTo(x+19, y-4); g.lineTo(x+19, y+2); // Aba direita do laço
    g.fill();
    g.fillStyle='#0284c7'; g.beginPath(); g.arc(x+15, y-1, 1.8, 0, 7); g.fill(); // Nó central
  }
	
  if(hacc==='capitao') TWAvatarItems.capitao(g,x,y);
  if(typeof TWAvatarRosto!=='undefined'&&TWAvatarRosto.enfeite)TWAvatarRosto.enfeite(g,c,x,y,hacc);   // Arco estelar
  if(typeof TWAvatarRosto!=='undefined'&&TWAvatarRosto.rosto(g,c,x,y,expr)){   // olhos, boca e piscadinha novos (tw-avatar-rosto.js)
  } else if(expr===1){
    g.strokeStyle='#223'; g.lineWidth=1.5; g.beginPath();
    g.moveTo(x+9,y+18); g.lineTo(x+12,y+20); g.lineTo(x+9,y+22);
    g.moveTo(x+22,y+18); g.lineTo(x+19,y+20); g.lineTo(x+22,y+22);
    g.stroke();
    g.fillStyle='#223'; g.beginPath(); g.ellipse(x+15,y+24,1.5,2.5,0,0,7); g.fill();
  } else if(expr===2){
    g.strokeStyle='#223'; g.lineWidth=1.5; g.beginPath();
    g.moveTo(x+9,y+20); g.quadraticCurveTo(x+11,y+17, x+13,y+20);
    g.moveTo(x+18,y+20); g.quadraticCurveTo(x+20,y+17, x+22,y+20);
    g.stroke();
    g.fillStyle='#223'; g.beginPath(); g.arc(x+15, y+23, 2.5, 0, Math.PI); g.fill();
  } else if(expr>=4 && typeof exprNova==='function' && exprNova(c, x, y, expr)){   // V2.1.3: surpresa, chorinho, apaixonado
  } else if(expr===3){   // piscadinha (Foto 2.0): olho esquerdo aberto, direito fechado, sorriso
    g.fillStyle='#223';g.fillRect(x+10,y+17,3,1);
    g.fillStyle=c.eye;g.fillRect(x+10,y+18,3,4);
    g.fillStyle='#112';g.fillRect(x+11,y+19,2,2);
    g.fillStyle='#fff';g.fillRect(x+10,y+18,1,2);g.fillRect(x+12,y+21,1,1);
    g.strokeStyle='#223'; g.lineWidth=1.5; g.beginPath(); g.moveTo(x+18,y+20); g.quadraticCurveTo(x+20,y+17, x+22,y+20); g.stroke();
    g.fillStyle='#223'; g.beginPath(); g.arc(x+15, y+23, 2.5, 0, Math.PI); g.fill();
  } else {
    g.fillStyle='#223';g.fillRect(x+10,y+17,3,1);g.fillRect(x+18,y+17,3,1);
    g.fillStyle=c.eye;g.fillRect(x+10,y+18,3,4);g.fillRect(x+18,y+18,3,4);
    g.fillStyle='#112';g.fillRect(x+11,y+19,2,2);g.fillRect(x+19,y+19,2,2);
    g.fillStyle='#fff';g.fillRect(x+10,y+18,1,2);g.fillRect(x+18,y+18,1,2);
    g.fillRect(x+12,y+21,1,1);g.fillRect(x+20,y+21,1,1);
    g.fillStyle='#223'; g.fillRect(x+14,y+24,3,1);
  }

  function bochechaPadrao(){g.fillStyle='rgba(255,111,181,.32)';E(x+9,y+23,2.6,1.5);E(x+23,y+23,2.6,1.5);g.fillStyle='rgba(255,180,205,.22)';E(x+8.5,y+22.6,1.4,.6);E(x+22.5,y+22.6,1.4,.6);}
  if(typeof TWAvatarRosto!=='undefined'){TWAvatarRosto.sobrancelha(g,c,x,y,expr);TWAvatarRosto.bochecha(g,c,x,y,bochechaPadrao);}else bochechaPadrao();   // bochecha à escolha (tw-avatar-rosto.js)

  if(d==='torrada'){ // a ponta fica entre os lábios, com o pão pendendo para fora
    g.save();g.translate(x+15.5,y+24);g.rotate(-.24);
    g.fillStyle='#bc7a40';g.beginPath();g.moveTo(-1,-1);g.lineTo(1,-2.4);g.lineTo(3,-1.5);g.quadraticCurveTo(9,-4,11,-1);g.lineTo(11,9);g.quadraticCurveTo(6,11,1,9);g.closePath();g.fill();
    g.fillStyle='#f6ce86';g.beginPath();g.moveTo(1,.2);g.lineTo(3,-.2);g.quadraticCurveTo(8,-2,9,-.2);g.lineTo(9,7.6);g.quadraticCurveTo(5,9,2,7.4);g.closePath();g.fill();
    g.fillStyle='#ffe9b1';g.fillRect(4,2,3.8,3.5);g.fillStyle='rgba(176,109,53,.28)';g.fillRect(3,6.7,5,1);g.restore();
    g.strokeStyle='#643725';g.lineWidth=1.4;g.beginPath();g.moveTo(x+13.1,y+24);g.quadraticCurveTo(x+15.2,y+25.3,x+17,y+24);g.stroke(); // boca segura a ponta do pão
  }

	if(c.gl){
  g.strokeStyle='#222'; g.lineWidth=1.2; g.beginPath();
  if(c.gl==='redonda'){
    g.arc(x+10.5,y+19.5,3.6,0,7); g.moveTo(x+24.1,y+19.5); g.arc(x+20.5,y+19.5,3.6,0,7);
  } else {
    g.rect(x+7,y+16.5,7,6); g.rect(x+17,y+16.5,7,6);
  }
  g.moveTo(x+14,y+19); g.lineTo(x+17,y+19); g.stroke();
}
	
  if(A==='laco'){g.fillStyle='#2a5bd7';T([x+5,y+3,x+1,y-1,x+1,y+7]);T([x+5,y+3,x+11,y-1,x+11,y+7]);g.fillStyle='#173a9a';E(x+5,y+3,2,2)}
  if(A==='estrela') TWAvatarItems.estrela(g,x,y);
  function FL(cx,cy,r,pc,cc){g.fillStyle=pc;for(var k=0;k<5;k++){var a=k*1.2566-1.57;E(cx+Math.cos(a)*r,cy+Math.sin(a)*r,r*.8,r*.8)}g.fillStyle=cc;E(cx,cy,r*.55,r*.55)}
  if(A==='mic'){g.strokeStyle='#222';g.lineWidth=1.2;g.beginPath();g.moveTo(x+4,y+11);g.quadraticCurveTo(x+1,y+16,x+4,y+20);g.lineTo(x+6,y+25);g.lineTo(x+12,y+26);g.stroke();g.fillStyle='#ff4f9a';E(x+13,y+26,2.2,2.2)}
  if(A==='hibisco')FL(x+6,y+3,3.2,'#ff3d5e','#ffd23f');
  if(A==='sakura')FL(x+6,y+3,3,'#ffc4d8','#e85a8a');
  if(A==='tiaraS'||A==='tiaraO'){
    var isGold = (A === 'tiaraO');
    var cBase = isGold ? '#ffd23f' : '#e2e8f0';
    var cDark = isGold ? '#b45309' : '#94a3b8';
    
    // Base da coroa mais delicada e fina
    g.fillStyle = cBase;
    g.fillRect(x+7, y+4, 16, 2);
    g.strokeStyle = cDark;
    g.lineWidth = 0.6; // Traço bem fininho e delicado
    g.strokeRect(x+7, y+4, 16, 2);

    // Três pontas da coroa com proporções mais fofas e suaves
    T([x+7,y+4, x+7,y-1, x+10.5,y+4]);   // Ponta esquerda
    T([x+10.5,y+4, x+15,y-5, x+19.5,y+4]); // Ponta central mais arredondada
    T([x+19.5,y+4, x+23,y-1, x+23,y+4]); // Ponta direita

    // Contorno leve nas pontas
    g.beginPath();
    g.moveTo(x+7, y+4); g.lineTo(x+7, y-1); g.lineTo(x+10.5, y+4);
    g.lineTo(x+15, y-5); g.lineTo(x+19.5, y+4);
    g.lineTo(x+23, y-1); g.lineTo(x+23, y+4);
    g.stroke();

    // Joias BRS48 - Base metálica (cBase) seguida pelo centro colorido
    g.fillStyle = cBase; E(x+7, y-0.5, 1.4, 1.4); 
    g.fillStyle = '#3b82f6'; E(x+7, y-0.5, 0.9, 0.9);   // Joia Azul (Esquerda)

    g.fillStyle = cBase; E(x+15, y-4.5, 1.6, 1.6); 
    g.fillStyle = '#fde047'; E(x+15, y-4.5, 1.1, 1.1); // Joia Amarela (Centro)

    g.fillStyle = cBase; E(x+23, y-0.5, 1.4, 1.4); 
    g.fillStyle = '#22c55e'; E(x+23, y-0.5, 0.9, 0.9); // Joia Verde (Direita)
  }

  if (AL) {
    var ab = Math.sin(frame*.15)*2;
    g.strokeStyle = '#e8ffd0'; g.lineWidth = 1.4; g.beginPath();
    g.moveTo(x+10, y+5); g.lineTo(x+6, y-4+ab);
    g.moveTo(x+20, y+5); g.lineTo(x+24, y-4-ab);
    g.stroke();
    g.fillStyle = '#b6ff3b'; g.shadowColor = '#b6ff3b'; g.shadowBlur = 8;
    E(x+6, y-5+ab, 2.2, 2.2); E(x+24, y-5-ab, 2.2, 2.2); g.shadowBlur = 0;
  }

  if(OF===5){g.strokeStyle='#ffe98a';g.lineWidth=2;g.shadowColor='#ffe98a';g.shadowBlur=8;g.beginPath();g.ellipse(x+15,y-11,10,3.2,0,0,7);g.stroke();g.shadowBlur=0}
  if(sash&&state!=='menu'&&!isPartner){
    g.fillStyle='#ffe14d';
    for(var i=0;i<3;i++){
      var t=frame*.1+i*2.1;
      g.globalAlpha=.5+.5*Math.sin(t*2);
      g.fillRect(x+[-9,35,-5][i],y+4+Math.sin(t)*12+i*10,3,3);   // V2.1.3: nos lados do rosto
    }
    g.globalAlpha=1;
  }
  if(charPose || perfAntena) perfPoseFrente(c, x, y);   // V2.1.3: mãos, microfone e anteninhas por cima do rosto
  g.restore();
}
var PET_DRAW_RAMP_STOPS={
 tsuEar:[[0,'#7e22ce'],[1,'#581c87']],
 tsuBody:[[0,'#c084fc'],[.6,'#9333ea'],[1,'#581c87']],
 patiBody:[[0,'#60a5fa'],[.6,'#2563eb'],[1,'#1e3a8a']],
 lirikaBody:[[0,'#4ade80'],[.6,'#16a34a'],[1,'#052e16']],
 crown:[[0,'#fde047'],[1,'#d97706']]
};
function petDrawRampCreate(key,stops){
  var cached=PET_DRAW_RAMP_CACHE.get(key);if(cached)return cached;
  var canvas,paint;
  try{canvas=document.createElement('canvas');canvas.width=2;canvas.height=128;paint=canvas.getContext('2d');if(!paint)return null;
    var grad=paint.createLinearGradient(0,0,0,128);
    stops.forEach(function(stop){grad.addColorStop(stop[0],stop[1]);});
    paint.fillStyle=grad;paint.fillRect(0,0,2,128);
  }catch(e){return null;}
  if(PET_DRAW_RAMP_CACHE.size>=64){var first=PET_DRAW_RAMP_CACHE.keys().next();if(!first.done)PET_DRAW_RAMP_CACHE.delete(first.value);}
  PET_DRAW_RAMP_CACHE.set(key,canvas);return canvas;
}
function petDrawRampEllipse(ctx,key,rx,ry,stops){
  var asset=PET_DRAW_RAMP_CACHE.get(key)||petDrawRampCreate(key,stops);if(!asset)return false;
  ctx.save();ctx.beginPath();ctx.ellipse(0,0,rx,ry,0,0,7);ctx.clip();ctx.drawImage(asset,-rx,-ry,rx*2,ry*2);ctx.restore();return true;
}
function petDrawRampTsuEars(ctx){
  var asset=PET_DRAW_RAMP_CACHE.get('tsu-ears')||petDrawRampCreate('tsu-ears',PET_DRAW_RAMP_STOPS.tsuEar);if(!asset)return false;
  ctx.save();ctx.beginPath();ctx.moveTo(-11,-4);ctx.lineTo(-10,-16);ctx.lineTo(-2,-9);ctx.closePath();ctx.moveTo(11,-4);ctx.lineTo(10,-16);ctx.lineTo(2,-9);ctx.closePath();ctx.clip();ctx.drawImage(asset,-12,-16,24,12);ctx.restore();return true;
}
function petDrawRampCrown(ctx){
  var asset=PET_DRAW_RAMP_CACHE.get('crown')||petDrawRampCreate('crown',PET_DRAW_RAMP_STOPS.crown);if(!asset)return false;
  ctx.save();ctx.beginPath();ctx.moveTo(-6,2);ctx.lineTo(-6,-5);ctx.lineTo(-2,-1);ctx.lineTo(0,-6);ctx.lineTo(2,-1);ctx.lineTo(6,-5);ctx.lineTo(6,2);ctx.closePath();ctx.clip();ctx.drawImage(asset,-6,-6,12,8);ctx.restore();return true;
}
function petDrawRampCustomBody(ctx,cor,lt,dk){
  var key='custom-body:'+cor,asset=PET_DRAW_RAMP_CACHE.get(key);
  if(!asset)asset=petDrawRampCreate(key,[[0,lt],[.6,cor],[1,dk]]);
  if(!asset)return false;
  ctx.save();ctx.beginPath();ctx.ellipse(0,0,12,11,0,0,7);ctx.clip();ctx.drawImage(asset,-12,-11,24,22);ctx.restore();return true;
}
function petDrawEllipse(ctx,cx,cy,rx,ry,r){
 ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,r||0,0,7);ctx.fill();
}
function petDrawPolygon(ctx,points){
 ctx.beginPath();ctx.moveTo(points[0],points[1]);
 for(var i=2;i<points.length;i+=2)ctx.lineTo(points[i],points[i+1]);
 ctx.closePath();ctx.fill();
}
function drawPet(ctx, type, x, y, sc, tFrame, ex, appearanceOverride){   // ex (opcional): expressão do Backstage⭐Pet!
  ctx.save();
  ctx.translate(x, y + Math.sin(tFrame * 0.08) * 3.5);
  ctx.scale(sc, sc);
  

  if(typeof petAnelAtras === 'function') petAnelAtras(ctx, type, appearanceOverride);   // V2.1.3: metade de trás do anel
  if(type && typeof type === 'object'){ petDrawCustom(ctx, type, tFrame, ex, appearanceOverride); ctx.restore(); return; }   // Meu Pet (montável)

  if(type === 'tsu'){
    ctx.shadowColor = '#d8b4fe'; ctx.shadowBlur = 12;
    ctx.fillStyle = '#7e22ce'; petDrawEllipse(ctx,-6, 10, 3, 2.5); petDrawEllipse(ctx,6, 10, 3, 2.5);
    
    // Rabinho
    ctx.strokeStyle = '#7e22ce'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(10, 4); ctx.quadraticCurveTo(22, -4, 18, -12); ctx.stroke();

    // Orelhas de gato: textura fixa reaproveitada, com o mesmo recorte triangular
    if(!petDrawRampTsuEars(ctx)){
      var earG = ctx.createLinearGradient(0, -16, 0, -4);
      earG.addColorStop(0, '#7e22ce'); earG.addColorStop(1, '#581c87');
      ctx.fillStyle = earG; petDrawPolygon(ctx,[-11,-4, -10,-16, -2,-9]); petDrawPolygon(ctx,[11,-4, 10,-16, 2,-9]);
    }
    ctx.fillStyle = '#f472b6';
    petDrawPolygon(ctx,[-9,-5, -8.5,-13, -4,-8.5]); petDrawPolygon(ctx,[9,-5, 8.5,-13, 4,-8.5]);
    
    // Corpo redondinho com degradê de iluminação (topo mais claro, base com sombra escura)
    if(!petDrawRampEllipse(ctx,'tsu-body',12,11,PET_DRAW_RAMP_STOPS.tsuBody)){
      var bgTsu = ctx.createLinearGradient(0, -11, 0, 11);
      bgTsu.addColorStop(0, '#c084fc'); bgTsu.addColorStop(0.6, '#9333ea'); bgTsu.addColorStop(1, '#581c87');
      ctx.fillStyle = bgTsu; petDrawEllipse(ctx,0, 0, 12, 11);
    }
    ctx.shadowBlur = 0;
    
    // Brilho
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; petDrawEllipse(ctx,-4, -6, 3.5, 1.8, -0.3);
    
    if(ex){ petFace(ctx, ex, { x:4.5, y:-1, m:2.4, c:'#2e1065' }, tFrame); } else {
    // Olhos
    ctx.fillStyle = '#2e1065'; petDrawEllipse(ctx,-4.5, -1, 2.2, 2.8); petDrawEllipse(ctx,4.5, -1, 2.2, 2.8);
    ctx.fillStyle = '#fff'; petDrawEllipse(ctx,-5, -2, 0.9, 1.1); petDrawEllipse(ctx,4, -2, 0.9, 1.1);
    
    // Boquinha feliz
    ctx.fillStyle = '#be185d';
    ctx.beginPath(); ctx.arc(0, 2, 3, 0, Math.PI); ctx.fill();
    ctx.fillStyle = '#f472b6'; petDrawEllipse(ctx,0, 3.5, 1.8, 1);
    }

  } else if(type === 'pati'){
    ctx.shadowColor = '#93c5fd'; ctx.shadowBlur = 12;
    // Pezinhos
    ctx.fillStyle = '#1d4ed8'; petDrawEllipse(ctx,-6, 10, 3, 2.5); petDrawEllipse(ctx,6, 10, 3, 2.5);
    
    // Corpo com degradê
    if(!petDrawRampEllipse(ctx,'pati-body',12,11.5,PET_DRAW_RAMP_STOPS.patiBody)){
      var bgPati = ctx.createLinearGradient(0, -11.5, 0, 11.5);
      bgPati.addColorStop(0, '#60a5fa'); bgPati.addColorStop(0.6, '#2563eb'); bgPati.addColorStop(1, '#1e3a8a');
      ctx.fillStyle = bgPati; petDrawEllipse(ctx,0, 0, 12, 11.5);
    }
    ctx.shadowBlur = 0;
    
    // Brilho
    ctx.fillStyle = 'rgba(255,255,255,0.45)'; petDrawEllipse(ctx,-5, -6, 2.5, 1.5, -0.5);
    
    // Coroa Dourada
    ctx.save(); ctx.translate(4, -11); ctx.rotate(0.22);
    if(!petDrawRampCrown(ctx)){
      var crnG = ctx.createLinearGradient(0, -6, 0, 2);
      crnG.addColorStop(0, '#fde047'); crnG.addColorStop(1, '#d97706');
      ctx.fillStyle = crnG; petDrawPolygon(ctx,[-6,2, -6,-5, -2,-1, 0,-6, 2,-1, 6,-5, 6,2]);
    }
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = 0.8;
    ctx.beginPath();ctx.moveTo(-6,2);ctx.lineTo(-6,-5);ctx.lineTo(-2,-1);ctx.lineTo(0,-6);ctx.lineTo(2,-1);ctx.lineTo(6,-5);ctx.lineTo(6,2);ctx.closePath();ctx.stroke();
    ctx.restore();
    
    if(ex){   // expressão + as sobrancelhas marrentas que são a cara do Pucchi
      petFace(ctx, ex, { x:4.5, y:0.5, m:4.6, c:'#0f172a' }, tFrame);
      if(ex !== 'sono'){ ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(-7.5, -3.5); ctx.lineTo(-2.5, -2); ctx.moveTo(7.5, -3.5); ctx.lineTo(2.5, -2); ctx.stroke(); }
    } else {
    // Olhos e Sobrancelhas Zangadas
    ctx.fillStyle = '#0f172a'; petDrawEllipse(ctx,-4.5, 0, 2.2, 2.2); petDrawEllipse(ctx,4.5, 0, 2.2, 2.2);
    ctx.fillStyle = '#fff'; petDrawEllipse(ctx,-4.5, 0.5, 0.8, 0.8); petDrawEllipse(ctx,4.5, 0.5, 0.8, 0.8);
    ctx.fillStyle = '#2563eb'; ctx.fillRect(-7, -2.5, 5, 2.2); ctx.fillRect(2, -2.5, 5, 2.2);
    ctx.strokeStyle = '#0f172a'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-7, -2.5); ctx.lineTo(-2, -0.5); ctx.moveTo(7, -2.5); ctx.lineTo(2, -0.5); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 5.5, 2.8, Math.PI*1.15, Math.PI*1.85); ctx.stroke();
    }

  } else if(type === 'lirika'){
    ctx.shadowColor = '#86efac'; ctx.shadowBlur = 12;
    // Orelhas com degradê
    ctx.fillStyle = '#15803d'; petDrawEllipse(ctx,-10, -7, 5, 5); petDrawEllipse(ctx,10, -7, 5, 5);
    ctx.fillStyle = '#86efac'; petDrawEllipse(ctx,-10, -7, 2.8, 2.8); petDrawEllipse(ctx,10, -7, 2.8, 2.8);
    // Pezinhos
    ctx.fillStyle = '#15803d'; petDrawEllipse(ctx,-6, 10, 2.8, 2); petDrawEllipse(ctx,6, 10, 2.8, 2);
    
    ctx.save(); ctx.rotate(-0.22);
    ctx.strokeStyle = 'rgba(134, 239, 172, 0.45)'; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.ellipse(0, 2, 20, 4.5, 0, Math.PI, Math.PI*2); ctx.stroke();
    ctx.restore();

    // Corpo com degradê (cobre o meio do anel de trás naturalmente!)
    if(!petDrawRampEllipse(ctx,'lirika-body',12,11,PET_DRAW_RAMP_STOPS.lirikaBody)){
      var bgLir = ctx.createLinearGradient(0, -11, 0, 11);
      bgLir.addColorStop(0, '#4ade80'); bgLir.addColorStop(0.6, '#16a34a'); bgLir.addColorStop(1, '#052e16');
      ctx.fillStyle = bgLir; petDrawEllipse(ctx,0, 0, 12, 11);
    }
    ctx.shadowBlur = 0;
    
    // Anel Planetário (Metade da FRENTE — passa brilhando pela frente da barriga!)
    ctx.save(); ctx.rotate(-0.22);
    ctx.strokeStyle = 'rgba(187, 247, 208, 0.92)'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.ellipse(0, 2, 20, 4.5, 0, -0.15, Math.PI + 0.15); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.9;
    ctx.beginPath(); ctx.ellipse(0, 2, 18.5, 3.5, 0, 0.05, Math.PI - 0.05); ctx.stroke();
    ctx.restore();
    
    if(ex){ petFace(ctx, ex, { x:5, y:-0.5, m:6, c:'#052e16' }, tFrame); } else {
    // Olhos
    ctx.fillStyle = '#052e16'; petDrawEllipse(ctx,-5, -0.5, 2.3, 2.6); petDrawEllipse(ctx,5, -0.5, 2.3, 2.6);
    ctx.fillStyle = '#fff'; petDrawEllipse(ctx,-5.5, -1.5, 1.1, 1.1); petDrawEllipse(ctx,4.5, -1.5, 1.1, 1.1);
    }
    // Nariz
    ctx.fillStyle = '#052e16'; petDrawEllipse(ctx,0, 0.5, 2.2, 3.2);
    // Sobrancelhas e boquinha
    ctx.strokeStyle = '#052e16'; ctx.lineWidth = 1.1;
    ctx.beginPath(); ctx.moveTo(-7, -4); ctx.lineTo(-3, -5.5); ctx.moveTo(7, -4); ctx.lineTo(3, -5.5); ctx.stroke();
    if(!ex){ ctx.beginPath(); ctx.arc(0, 6.5, 1.8, Math.PI*1.1, Math.PI*1.9); ctx.stroke(); }
  }
  // Se este pet tiver acessórios ou bochechas vestidos no camarim, desenha por cima!
  var pObj = appearanceOverride && typeof appearanceOverride === 'object' ? appearanceOverride :
    (typeof petData !== 'undefined' && petData && petData.pets ? petData.pets[type] : null);
  if(pObj){
    if(pObj.bochecha){ ctx.fillStyle = 'rgba(255,111,181,.55)'; petDrawEllipse(ctx,-7.6, 2.9, 2.2, 1.2); petDrawEllipse(ctx,7.6, 2.9, 2.2, 1.2); }
    var a = pObj.acc || '';
    if(a === 'laco'){ ctx.fillStyle = '#ff4f9a'; petDrawPolygon(ctx,[-7, -10, -12, -13, -12, -7]); petDrawPolygon(ctx,[-7, -10, -2, -13, -2, -7]); ctx.fillStyle = '#be185d'; petDrawEllipse(ctx,-7, -10, 1.4, 1.4); }
    else if(a === 'estrela'){ ctx.fillStyle = '#ffe14d'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = .6; ctx.beginPath();
      var ex8 = type === 'pati' ? -8 : 8;   // Pucchi: estrela do lado esquerdo, longe da coroa (V3.1)
      for(var q = 0; q < 10; q++){ var rr = q % 2 ? 1.8 : 4.2, an = q * Math.PI / 5 - Math.PI / 2; ctx[q ? 'lineTo' : 'moveTo'](ex8 + Math.cos(an) * rr, -10 + Math.sin(an) * rr); }
      ctx.closePath(); ctx.fill(); ctx.stroke(); }
    else if(a === 'anel'){ ctx.save(); ctx.rotate(-.22); ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,.88)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(0, 2, 20, 4.5, 0, -0.35, Math.PI + 0.35); ctx.stroke();
      ctx.strokeStyle = '#fde047'; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, 2, 18.5, 3.5, 0, 0.05, Math.PI - 0.05); ctx.stroke(); ctx.restore(); }
    else if(a === 'oculos'){ ctx.strokeStyle = '#1f2937'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(-4.5, -1, 3.4, 0, 7); ctx.moveTo(7.9, -1); ctx.arc(4.5, -1, 3.4, 0, 7); ctx.moveTo(-1.1, -1.5); ctx.lineTo(1.1, -1.5); ctx.stroke(); }
    else if(a === 'flor'){ ctx.fillStyle = '#ffc4d8'; for(var k = 0; k < 5; k++){ var an2 = k * 1.2566 - 1.57; petDrawEllipse(ctx,-8 + Math.cos(an2) * 2.4, -9 + Math.sin(an2) * 2.4, 2, 2); } ctx.fillStyle = '#e85a8a'; petDrawEllipse(ctx,-8, -9, 1.3, 1.3); }
    else if(a) petDrawRankAcc(ctx, a, type);   // acessórios de estágio (V2.1)
  }
  ctx.restore();
}
var PAL=[['#071327','#2a3f78','#0f2347','#0a1830','#9ec8ff','#ff96d2','#1a2a55','#ff6fb5'],['#2b1b4a','#ff8a5c','#4a2a5c','#2a1a3e','#ffd27a','#ffd27a','#3a2450','#ffd23f'],['#12315e','#7fc4ee','#3a6a9c','#244a78','#ffffff','#e6f6ff','#2a4f80','#00c6ff'],['#1a0933','#8a2f9a','#3a1a5e','#240f45','#ff9ccd','#ffb3e0','#2c1650','#4dd8ff']];
function hx(h){return [parseInt(h.substr(1,2),16),parseInt(h.substr(3,2),16),parseInt(h.substr(5,2),16)]}
var CURPAL_CACHE=['','','','','','','',''];
function prevLoop(t) {
  twIndex2AvatarRaf = 0;
  if (twIndex2BaseFramesPaused()||state!=='menu'||!twIndex2AvatarVisible) return;
  if (state === 'menu') {
    pt+=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta(pc.canvas,t):1;
    if(!window.TWMotionLifecycle||TWMotionLifecycle.render30Due(pc.canvas,t)){
    var og = g;
    try {
    g = pc;
    g.clearRect(0, 0, 140, 120);
    
    var rg = g.createRadialGradient(70, 62, 4, 70, 62, 52);
    rg.addColorStop(0, 'rgba(255,200,235,.7)');
    rg.addColorStop(1, 'rgba(255,200,235,0)');
    g.fillStyle = rg;
    g.fillRect(0, 0, 140, 120);

    // Chãozinho iluminado
    g.fillStyle = 'rgba(255,255,255,0.15)'; 
    g.fillRect(0, 95, 140, 25);
    g.fillStyle = 'rgba(255,255,255,0.4)'; 
    g.fillRect(0, 95, 140, 2);

    // Estrelas piscando
    g.fillStyle = '#ffe14d';
    g.globalAlpha = 0.4 + 0.4 * Math.sin(pt * 0.1); g.fillRect(30, 35, 2, 2);
    g.globalAlpha = 0.4 + 0.4 * Math.sin(pt * 0.15 + 2); g.fillRect(110, 50, 2, 2);
    g.globalAlpha = 1; 

    // Desenho seguro do personagem na prévia
    g.save(); 
    g.scale(2, 2); 
    drawChar(CH[sel], 20, 15 + Math.sin(pt * .06) * 1.5, 1, 0); 
    g.restore();

    // Desenho do pet
    var petKey = petCorridaTipo(sel === 0 ? 'tsu' : sel === 1 ? 'lirika' : sel === 2 ? 'pati' : ['tsu', 'lirika', 'pati'][Math.floor(pt / 180) % 3]);   // seu pet adotado (sem pet: igual a antes)
    drawPet(pc, petKey, 112, 38, 1.15, pt);
    
    } finally { g = og; }
    }
  }
  if(state==='menu'&&!twIndex2BaseFramesPaused()&&twIndex2AvatarVisible)twIndex2AvatarRaf = requestAnimationFrame(prevLoop); // Tracks this RAF so hidden screens can pause it.
}
function safeCall(fn){
  var og = g;
  try { return fn(); }
  finally { g = og; }
}
function twElementoVisivelNaJanela(el){
  if(!el||!el.isConnected||!el.getClientRects().length)return false;
  var r=el.getBoundingClientRect();
  return r.width>0&&r.height>0&&r.bottom>0&&r.right>0&&r.top<window.innerHeight&&r.left<window.innerWidth;
}
function twOverlayTopo(){
  if(!twOverlayTopDirty)return twOverlayTopCache;
  twOverlayTopDirty=false;
  var nodes=document.querySelectorAll('.ov:not([hidden]),.hub:not([hidden]),.tw-preview-game:not([hidden]),.tw-karaoke-closed-ov:not([hidden])'),top=null,topZ=-Infinity;
  for(var i=0;i<nodes.length;i++){
    var el=nodes[i];
    if(!el.isConnected||!el.getClientRects().length)continue;
    var cs=getComputedStyle(el);
    if(cs.display==='none'||cs.visibility==='hidden'||cs.contentVisibility==='hidden')continue;
    var z=(parseInt(cs.zIndex,10)||0)+(/^(menu|over|pz)$/.test(el.id)?-1e4:0);
    // Um painel em transição ainda é dono da cena; opacity 0 pode ser o início de um fade-in.
    if(z>=topZ){top=el;topZ=z;}
  }
  twOverlayTopCache=top;
  return top;
}
function twOverlayInvalidar(){twOverlayTopDirty=true;}
function twAnimacaoVisivel(el){
 if(window.TWMotionLifecycle&&!TWMotionLifecycle.isPageActive())return false;
  if(document.hidden||!twElementoVisivelNaJanela(el))return false;
  var owner=el.closest?el.closest('.ov,.hub,.tw-preview-game,.tw-karaoke-closed-ov'):null,top=twOverlayTopo();
  return owner?owner===top:(!top&&twIndex2StageVisible);
}
function twIndex2BaseFramesPaused(){
  if(typeof window!=='undefined'&&window.TWMotionLifecycle&&!TWMotionLifecycle.isPageActive())return true;
  if(document.hidden||(typeof twIndex2StageVisible!=='undefined'&&!twIndex2StageVisible))return true;
  if(typeof twOverlayTopo==='function'){var topo=twOverlayTopo();return !!topo&&!/^(menu|over|pz)$/.test(topo.id||'');}
  var hub=typeof hubOv!=='undefined'&&hubOv,preview=document.getElementById('twPreviewJogo');
  return !!(hub&&!hub.hidden||preview&&!preview.hidden);
}
function twIndex2PauseBaseFrames(){
  if(twIndex2BaseRaf){cancelAnimationFrame(twIndex2BaseRaf);twIndex2BaseRaf=0;}
  if(twIndex2AvatarRaf){cancelAnimationFrame(twIndex2AvatarRaf);twIndex2AvatarRaf=0;}
  if(celebRaf){cancelAnimationFrame(celebRaf);celebRaf=0;}
  last=0;
}
function twIndex2StartBaseLoop(naMontagem){
  if(twIndex2BaseRaf||twIndex2BaseFramesPaused())return;
  // A corrida chega sob demanda (centerrun-corrida.js). Sair do Hub para o palco (hubFechar marca twCorridaQuer)
  // baixa na hora. Qualquer outro pedido (montagem da página, troca de aba) espera um instante e só baixa se o
  // palco continuar à vista, como num link direto para o Center Run.
  if(typeof loop!=='function'){
    if(window.twCorridaQuer&&!naMontagem)twCorridaCarregar().catch(function(){});
    else setTimeout(function(){if(typeof loop!=='function'&&!twIndex2BaseFramesPaused())twCorridaCarregar().catch(function(){});},1500);
    return;
  }
  last=0;twIndex2BaseRaf=requestAnimationFrame(loop);
}
function twIndex2StartAvatarLoop(){
  if(!twIndex2AvatarRaf&&!twIndex2BaseFramesPaused()&&state==='menu'&&twIndex2AvatarVisible)twIndex2AvatarRaf=requestAnimationFrame(prevLoop);
}
function twIndex2ResumeBaseFrames(){
  if(twIndex2BaseFramesPaused())return;
  twIndex2StartBaseLoop();twIndex2StartAvatarLoop();
  if(state==='over'&&!celebRaf&&typeof celeb==='function')celebRaf=requestAnimationFrame(celeb);
}
var titleClicks = 0;
var OSHI = '';
function applyOshi(o){
  OSHI = o;
  if(o) document.documentElement.setAttribute('data-oshi', o);
  else document.documentElement.removeAttribute('data-oshi');
  try{localStorage.setItem('brs48cr_oshi', o)}catch(e){}
  [].forEach.call(document.querySelectorAll('.oshi-sel button'), function(b){
    b.setAttribute('aria-pressed', b.dataset.oshi === o);
  });
}
var kaomojisDecorativos = [
  "(๑>◡<๑)", "(✧ω✧)", "(｡♥‿♥｡)", "(*^▽^*)", 
  "(≧◡≦)", "(o˘◡˘o)", "(=^･ω･^=)", "(っ˘ω˘ς)", "( ´ ▽ ` )ﾉ", "(◍•ω•◍)"
];
function visualKaoAtualizar(){
  if(!visualKaoEl)return;
  var randomKao=kaomojisDecorativos[Math.floor(Math.random()*kaomojisDecorativos.length)];
  visualKaoEl.textContent=randomKao;
}
function visualKaoIniciar(){if(!visualKaoTimer&&visualKaoEl)visualKaoTimer=setInterval(visualKaoAtualizar,4000);}
function visualKaoParar(){if(visualKaoTimer){clearInterval(visualKaoTimer);visualKaoTimer=0;}}
function cenaHash(n){ var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var cenaAves = null, cenaProxAves = 900;
var cenaGrl = null, cenaProxGrilo = 600;
function cenaReset(){ cenaAves = null; cenaGrl = null; cenaProxAves = 900; cenaProxGrilo = 600; }
// Pet com auréola/tiara: o balão de humor sobe um pouco para não esconder o acessório
function petMoodLift(p){
  var a = petData && petData.ativo === 'meu' ? (p.cfg && p.cfg.acc) : p.acc;
  return (a === 'aureola' || a === 'tiara') ? 12 : 0;
}
var TEMAS = [   // [chave, início MM-DD, fim MM-DD] — horário de Brasília
  ['natal', '12-01', '12-26'], ['anonovo', '12-27', '01-02'], ['verao', '01-03', '01-16'], ['valentine', '02-01', '02-15'],
  ['outono', '03-20', '03-31'], ['sakura', '04-01', '04-14'], ['valentine', '06-05', '06-13'], ['inverno', '06-21', '07-05'],
  ['tanabata', '07-06', '07-08'], ['primavera', '09-22', '10-06'], ['criancas', '10-08', '10-14'], ['halloween', '10-24', '11-02'],
  ['aniversario', '11-10', '11-16']   // o BRS48 nasceu em 13/11/2015
];
var TEMA_INFO = {   // [emoji, nome, céu de cima, céu de baixo, chão, partícula, cores das bandeirinhas, item do camarim]
  natal:     ['🎄', 'Natal',     '#0f3b2e', '#2e7d5b', '#f4f8ff', 'neve',    ['#e0303a', '#ffffff', '#16a34a'], '🎄'],
  anonovo:   ['🥂', 'Ano Novo',  '#0b1030', '#3a2a7a', '#1a1640', 'fogos',   ['#ffe14d', '#ffffff', '#c4a5ff'], '🥂'],
  verao:     ['🌞', 'Verão',     '#3cc8f5', '#c8f6ff', '#ffe2a8', 'sol',     ['#ff6fb5', '#ffe14d', '#4dd8ff'], '🍉'],
  valentine: ['💝', 'Valentine', '#ffb3d6', '#fff0f7', '#ffc4dd', 'coracao', ['#ff4f9a', '#ffffff', '#ff9ccd'], '💝'],
  outono:    ['🍁', 'Outono',    '#ffbf7a', '#fff1dc', '#c98b55', 'folha',   ['#e8650c', '#f5b400', '#a0522d'], '🍁'],
  sakura:    ['🌸', 'Sakura',    '#ffcfe6', '#fff7fb', '#c9e8b5', 'petala',  ['#ff9ccd', '#ffffff', '#ffc4dd'], '🌸'],
  inverno:   ['❄️', 'Inverno',   '#7fb1f0', '#e8f2ff', '#ffffff', 'neve',    ['#4169e1', '#ffffff', '#a8d8ff'], '☃️'],
  tanabata:  ['🎋', 'Tanabata',  '#10194a', '#3b2f8a', '#244f34', 'estrela', ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b'], '🎋'],
  primavera: ['🌼', 'Primavera', '#b8ecff', '#f2ffe8', '#a8e07a', 'flor',    ['#ffe14d', '#ff9ccd', '#b6ff3b'], '🌼'],
  halloween: ['🎃', 'Halloween', '#2b0f45', '#ff8a3d', '#2a1238', 'morcego', ['#ff8a1f', '#9b30d9', '#2a1640'], '🎃'],
  criancas:  ['🎈', 'Dia das Crianças', '#7fd0ff', '#fff6c7', '#b6ff3b', 'balao', ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b'], '🎈'],
  aniversario: ['🎂', 'Aniversário do BRS48', '#7b3ff0', '#ffb3d6', '#ffd1e8', 'confete', ['#9b30d9', '#5cc72c', '#4169e1', '#ff6fb5'], '🎂']
};
// Música de cada tema (das Units Especiais do BRS48) — aparece no chip do tema na tela de início
// Música de cada tema: só covers do TsuLiPa (playlist de participações). Os NOMES dos temas não mudam.
var TEMA_MUSICA = { halloween:'Love Pulsar', natal:"Pittari Shitai X'mas!", anonovo:'Wish You Happiness!!', valentine:'Valentine Kiss', verao:'Splash Dream', outono:'Samishii Nettaigyo', inverno:'Monster', primavera:'Cheeky Cheeky', sakura:'ZIPPER', tanabata:'Wagamama na Nagareboshi', criancas:'Amor Grilado', aniversario:'Aitakatta' };
var TEMA_TESTE = 'tsl_tema_teste';   // sessionStorage: tema forçado pela moderação (só nesta aba, não é save)
function temaForcado(){ try{ var f = sessionStorage.getItem(TEMA_TESTE); if(f === 'nenhum' || TEMA_INFO[f]) return f; }catch(e){} return ''; }
function temaLinha(){   // linha do calendário de hoje (ou null)
  var md = dk().slice(5);
  for(var i = 0; i < TEMAS.length; i++){ var a = TEMAS[i][1], b = TEMAS[i][2]; if(a <= b ? (md >= a && md <= b) : (md >= a || md <= b)) return TEMAS[i]; }
  return null;
}
function temaAtual(){
  var f = temaForcado(); if(f) return f === 'nenhum' ? '' : f;
  var l = temaLinha(); return l ? l[0] : '';
}
function temaAteTxt(){   // "02/11"
  var f = temaForcado(), l = temaLinha();
  if(f && (!l || l[0] !== f)){ for(var i = 0; i < TEMAS.length; i++) if(TEMAS[i][0] === f){ l = TEMAS[i]; break; } }
  if(!l) return ''; var b = l[2]; return b.slice(3) + '/' + b.slice(0, 2);
}
function temaAdminHtml(){   // "Forçar tema" na aba de Moderação (só para testar)
  var f = temaForcado();
  return '<label class="admtema">🗓️ ' + escHtml(tr('Forçar tema')) + ' <select id="admTema"><option value="">' + escHtml(tr('Tema da data')) + '</option><option value="nenhum"' + (f === 'nenhum' ? ' selected' : '') + '>🚫 ' + escHtml(tr('Sem tema')) + '</option>' +
    Object.keys(TEMA_INFO).map(function(k){ return '<option value="' + k + '"' + (f === k ? ' selected' : '') + '>' + TEMA_INFO[k][0] + ' ' + escHtml(tr(TEMA_INFO[k][1])) + '</option>'; }).join('') + '</select></label>';
}
function temaAvisoAdmin(){   // Moderação: o tema que está acabando (até 3 dias) e o próximo que começa (até 7 dias)
  var hoje = Date.parse(dk() + 'T12:00:00Z'), ano = +dk().slice(0, 4), L = [], i, a, b, ini, fim;
  function dt(md, y){ return Date.parse(y + '-' + md + 'T12:00:00Z'); }
  for(i = 0; i < TEMAS.length; i++){
    for(var y = ano - 1; y <= ano + 1; y++){
      ini = dt(TEMAS[i][1], y); fim = dt(TEMAS[i][2], TEMAS[i][1] <= TEMAS[i][2] ? y : y + 1);
      a = Math.round((ini - hoje) / 864e5); b = Math.round((fim - hoje) / 864e5);
      var inf = TEMA_INFO[TEMAS[i][0]];
      if(a <= 0 && b >= 0 && b <= 3) L.push(inf[0] + ' ' + tr(inf[1]) + ': ' + (b === 0 ? 'acaba hoje' : 'acaba em ' + b + (b === 1 ? ' dia' : ' dias')) + ' (' + TEMAS[i][2].slice(3) + '/' + TEMAS[i][2].slice(0, 2) + ')');
      if(a > 0 && a <= 7) L.push(inf[0] + ' ' + tr(inf[1]) + ': começa em ' + a + (a === 1 ? ' dia' : ' dias') + ' (' + TEMAS[i][1].slice(3) + '/' + TEMAS[i][1].slice(0, 2) + ') — roupa e insígnia novas');
    }
  }
  return L.length ? '<div class="admaviso admtemas">🗓️ ' + L.map(escHtml).join('<br>🗓️ ') + '</div>' : '';
}
function temaHash(i){ var s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function temaCoracao(x, cx, cy, s){ x.beginPath(); x.moveTo(cx, cy + s * .9); x.bezierCurveTo(cx - s * 1.6, cy - s * .2, cx - s * .7, cy - s * 1.3, cx, cy - s * .45); x.bezierCurveTo(cx + s * .7, cy - s * 1.3, cx + s * 1.6, cy - s * .2, cx, cy + s * .9); x.fill(); }
function temaFlor(x, cx, cy, r, cor, miolo){ x.fillStyle = cor; for(var i = 0; i < 5; i++){ x.beginPath(); x.arc(cx + Math.cos(i * 1.2566) * r, cy + Math.sin(i * 1.2566) * r, r * .8, 0, 7); x.fill(); } x.fillStyle = miolo || '#ffe14d'; x.beginPath(); x.arc(cx, cy, r * .6, 0, 7); x.fill(); }
function temaParticulas(x, W2, H2, k, n, t, u){   // caem (ou sobem) devagar; t = quadro da animação
  var tipo = TEMA_INFO[k] ? TEMA_INFO[k][5] : '', i;
  x.save();
  for(i = 0; i < n; i++){
    var px = temaHash(i * 3 + 1) * W2, vel = (.25 + temaHash(i * 7) * .45) * u, s = (2 + temaHash(i * 11) * 2.6) * u, py;
    if(tipo === 'balao'){   // balões sobem
      py = H2 - ((temaHash(i * 5) * H2 + t * vel) % (H2 + 30 * u)) + 20 * u;
      var bx2 = px + Math.sin(t * .02 + i) * 6 * u, bc = ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#c4a5ff'][i % 5];
      x.globalAlpha = .85; x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = .8 * u; x.beginPath(); x.moveTo(bx2, py + s * 1.6); x.quadraticCurveTo(bx2 + 3 * u, py + s * 3, bx2, py + s * 4.4); x.stroke();
      x.fillStyle = bc; x.beginPath(); x.ellipse(bx2, py, s * 1.2, s * 1.55, 0, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.ellipse(bx2 - s * .4, py - s * .5, s * .3, s * .45, -.4, 0, 7); x.fill();
      continue;
    }
    if(tipo === 'coracao'){   // corações sobem
      py = H2 - ((temaHash(i * 5) * H2 + t * vel) % (H2 + 20 * u)) + 10 * u;
      x.globalAlpha = .55 + .35 * temaHash(i); x.fillStyle = ['#ff4f9a', '#ff9ccd', '#ffffff'][i % 3]; temaCoracao(x, px + Math.sin(t * .03 + i) * 6 * u, py, s * 1.3);
      continue;
    }
    py = ((temaHash(i * 5) * H2) + t * vel) % (H2 + 20 * u) - 10 * u;
    var dx = Math.sin(t * .02 + i * 1.7) * 8 * u;
    x.globalAlpha = .7 + .3 * temaHash(i * 13);
    if(tipo === 'neve'){ x.fillStyle = '#ffffff'; x.beginPath(); x.arc(px + dx, py, s * .8, 0, 7); x.fill(); }
    else if(tipo === 'petala'){ x.save(); x.translate(px + dx, py); x.rotate(t * .02 + i); x.fillStyle = i % 2 ? '#ffb7d5' : '#ffd6e8'; x.beginPath(); x.ellipse(0, 0, s * 1.2, s * .7, 0, 0, 7); x.fill(); x.restore(); }
    else if(tipo === 'folha'){ x.save(); x.translate(px + dx, py); x.rotate(t * .025 + i); x.fillStyle = ['#e8650c', '#f5b400', '#c2410c', '#a0522d'][i % 4]; x.beginPath(); x.moveTo(0, -s * 1.4); x.quadraticCurveTo(s * 1.2, 0, 0, s * 1.4); x.quadraticCurveTo(-s * 1.2, 0, 0, -s * 1.4); x.fill(); x.restore(); }
    else if(tipo === 'confete'){ x.save(); x.translate(px + dx, py); x.rotate(t * .05 + i); x.fillStyle = ['#9b30d9', '#5cc72c', '#4169e1', '#ff6fb5', '#ffe14d'][i % 5]; x.fillRect(-s, -s * .45, s * 2, s * .9); x.restore(); }
    else if(tipo === 'flor'){ x.globalAlpha = .8; temaFlor(x, px + dx, py, s * .55, ['#ff9ccd', '#ffffff', '#c4a5ff', '#ffe14d'][i % 4], i % 4 === 3 ? '#ff6fb5' : '#ffe14d'); }
    else if(tipo === 'sol' || tipo === 'estrela' || tipo === 'fogos' || tipo === 'morcego'){   // brilhinhos piscando (não caem)
      var bx = temaHash(i * 17 + 3) * W2, by = temaHash(i * 19 + 5) * H2 * .7;
      x.globalAlpha = Math.max(0, .3 + .7 * Math.sin(t * .05 + i * 2.3));
      x.fillStyle = tipo === 'sol' ? '#ffffff' : tipo === 'morcego' ? '#ffd27a' : ['#ffe14d', '#ffffff', '#c4a5ff', '#4dd8ff'][i % 4];
      x.font = '900 ' + Math.round(s * 3.2) + 'px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('✦', bx, by);
    }
  }
  x.restore();
}
function temaBandeirinhas(x, W2, cores, y0, u, t){   // varal de bandeirinhas no alto
  var n = Math.max(6, Math.round(W2 / (28 * u))), i;
  x.save(); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 1 * u;
  x.beginPath(); x.moveTo(0, y0); x.quadraticCurveTo(W2 / 2, y0 + 16 * u, W2, y0); x.stroke();
  for(i = 0; i < n; i++){
    var fx = (i + .5) * W2 / n, uu = fx / W2, fy = y0 + 2 * uu * (1 - uu) * 16 * u + 1, sw = Math.sin((t || 0) * .04 + i) * 1.2 * u;
    x.fillStyle = cores[i % cores.length]; x.beginPath(); x.moveTo(fx - 7 * u, fy); x.lineTo(fx + 7 * u, fy); x.lineTo(fx + sw, fy + 13 * u); x.closePath(); x.fill();
  }
  x.restore();
}
function temaFundo(x, W2, H2, k, t){   // fundo do Estúdio / da tela de início para o tema do momento
  var inf = TEMA_INFO[k]; if(!inf){ perfFundo(x, W2, H2, 'basico', '', t); return; }
  if(k === 'halloween'){ perfFundo(x, W2, H2, 'halloween', '', t); return; }
  var u = W2 / 320, i; t = t || 0;
  perfFundoGradiente(x, W2, H2, 'tema:' + k + ':' + inf[2] + ':' + inf[3], true, [[0, inf[2]], [1, inf[3]]]);
  if(k === 'verao'){   // sol, mar e areia
    var sg = x.createRadialGradient(W2 * .8, H2 * .2, 4 * u, W2 * .8, H2 * .2, 60 * u); sg.addColorStop(0, 'rgba(255,240,150,.9)'); sg.addColorStop(1, 'rgba(255,240,150,0)');
    x.fillStyle = sg; x.fillRect(0, 0, W2, H2); x.fillStyle = '#ffe14d'; x.beginPath(); x.arc(W2 * .8, H2 * .2, 18 * u, 0, 7); x.fill();
    x.fillStyle = '#29b6e8'; x.fillRect(0, H2 * .62, W2, H2 * .2);
    x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = 1.5 * u; for(i = 0; i < 6; i++){ var wx = ((i * W2 / 5) + t * .4 * u) % (W2 + 30 * u) - 15 * u; x.beginPath(); x.arc(wx, H2 * .7, 6 * u, Math.PI, 0); x.stroke(); }
  } else if(k === 'natal' || k === 'inverno'){   // montanhas de neve (e pinheirinhos no Natal)
    x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.moveTo(0, H2 * .75); x.quadraticCurveTo(W2 * .25, H2 * .5, W2 * .5, H2 * .72); x.quadraticCurveTo(W2 * .75, H2 * .52, W2, H2 * .74); x.lineTo(W2, H2); x.lineTo(0, H2); x.fill();
    if(k === 'natal') [.12, .3, .72, .9].forEach(function(px, j){ var s = (j % 2 ? 16 : 22) * u, bx = W2 * px, by = H2 * .9; x.fillStyle = '#15803d'; for(var q = 0; q < 3; q++){ x.beginPath(); x.moveTo(bx, by - s * 2 + q * s * .5); x.lineTo(bx + s * (.5 + q * .2), by - s * .9 + q * s * .4); x.lineTo(bx - s * (.5 + q * .2), by - s * .9 + q * s * .4); x.fill(); } x.fillStyle = ['#ffe14d', '#ff6fb5', '#4dd8ff'][j % 3]; x.beginPath(); x.arc(bx, by - s * 2, 2 * u, 0, 7); x.fill(); });
    else { x.fillStyle = '#fff'; x.beginPath(); x.arc(W2 * .14, H2 * .82, 11 * u, 0, 7); x.arc(W2 * .14, H2 * .82 - 16 * u, 7.5 * u, 0, 7); x.fill(); var bnY = H2 * .82 - 16 * u; x.fillStyle = '#ff8a1f'; x.beginPath(); x.moveTo(W2 * .14, bnY); x.lineTo(W2 * .14 + 7 * u, bnY + 1 * u); x.lineTo(W2 * .14, bnY + 2 * u); x.fill(); x.fillStyle = '#2c1a5e'; x.fillRect(W2 * .14 - 3 * u, bnY - 2.5 * u, 1.6 * u, 1.6 * u); x.fillRect(W2 * .14 + 1.5 * u, bnY - 2.5 * u, 1.6 * u, 1.6 * u); }
  } else if(k === 'anonovo' || k === 'tanabata'){   // céu de noite com estrelas (fogos no Ano Novo, via láctea no Tanabata)
    perfBrilhos(x, W2, H2 * .75, '#fff', 30, 7, t);
    if(k === 'tanabata'){ x.save(); x.globalAlpha = .35; var vl = x.createLinearGradient(0, H2 * .55, W2, 0); vl.addColorStop(0, 'rgba(196,165,255,0)'); vl.addColorStop(.5, 'rgba(225,215,255,.9)'); vl.addColorStop(1, 'rgba(196,165,255,0)'); x.strokeStyle = vl; x.lineWidth = 40 * u; x.beginPath(); x.moveTo(-10, H2 * .6); x.lineTo(W2 + 10, H2 * .05); x.stroke(); x.restore();
      x.strokeStyle = '#4d9a3a'; x.lineWidth = 3 * u; x.beginPath(); x.moveTo(W2 * .1, H2); x.quadraticCurveTo(W2 * .12, H2 * .5, W2 * .2, H2 * .2); x.stroke();
      ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#c4a5ff'].forEach(function(cc, j){ var tx = W2 * (.13 + j * .02), ty = H2 * (.35 + j * .08); x.fillStyle = cc; x.save(); x.translate(tx, ty); x.rotate(Math.sin(t * .03 + j) * .15); x.fillRect(-2.5 * u, 0, 5 * u, 13 * u); x.restore(); }); }
    else for(i = 0; i < 3; i++){ var ft = (t * 1.2 + i * 70) % 210, fr = Math.min(ft, 60) * .55 * u, fx = W2 * (.2 + i * .3), fy = H2 * (.22 + (i % 2) * .12);
      if(ft < 110){ x.save(); x.globalAlpha = Math.max(0, 1 - ft / 110); x.strokeStyle = ['#ffe14d', '#ff6fb5', '#4dd8ff'][i]; x.lineWidth = 1.6 * u; for(var q2 = 0; q2 < 12; q2++){ var an = q2 * Math.PI / 6; x.beginPath(); x.moveTo(fx + Math.cos(an) * fr * .5, fy + Math.sin(an) * fr * .5); x.lineTo(fx + Math.cos(an) * fr, fy + Math.sin(an) * fr); x.stroke(); } x.restore(); } }
  } else if(k === 'sakura'){   // galho florido no canto
    x.strokeStyle = '#7a4a2a'; x.lineWidth = 4 * u; x.lineCap = 'round'; x.beginPath(); x.moveTo(-5, H2 * .1); x.quadraticCurveTo(W2 * .2, H2 * .12, W2 * .38, H2 * .04); x.stroke();
    for(i = 0; i < 9; i++) temaFlor(x, W2 * (.04 + i * .04), H2 * (.1 + Math.sin(i) * .04), 3.2 * u, i % 2 ? '#ffc4dd' : '#ffffff', '#ff6fb5');
  } else if(k === 'outono'){   // arvorezinhas laranja
    [.12, .86].forEach(function(px){ x.fillStyle = '#8b5a2b'; x.fillRect(W2 * px - 3 * u, H2 * .62, 6 * u, H2 * .28); ['#e8650c', '#f5b400', '#c2410c'].forEach(function(cc, j){ x.fillStyle = cc; x.beginPath(); x.arc(W2 * px + (j - 1) * 12 * u, H2 * .58 - (j % 2) * 8 * u, 16 * u, 0, 7); x.fill(); }); });
  } else if(k === 'primavera' || k === 'valentine'){ perfEnfeites(x, W2, H2, inf[6], 8, 4, t, .55); }
  temaBandeirinhas(x, W2, inf[6], 4 * u, u, t);
  temaParticulas(x, W2, H2 * .9, k, 22, t, u);
  x.fillStyle = inf[4]; x.fillRect(0, H2 * .9, W2, H2 * .1);
  if(k === 'primavera' || k === 'verao' || k === 'sakura') for(i = 0; i < 9; i++) temaFlor(x, (i + .5) * W2 / 9, H2 * .93, 2.6 * u, ['#ff9ccd', '#ffe14d', '#ffffff'][i % 3]);
}
function temaCamarim(x, foto, t){   // decoração do camarim (360 x 220) para os temas sem desenho próprio
  var k = petTemaOn, inf = TEMA_INFO[k]; if(!inf) return;
  t = foto ? 0 : t;
  x.save(); x.globalAlpha = .16; perfFundoGradiente(x, 360, 220, 'camarim:' + k + ':' + inf[2] + ':' + inf[3], true, [[0, inf[2]], [1, inf[3]]]); x.restore();
  temaBandeirinhas(x, 360, inf[6], 2, 1, t);
  temaParticulas(x, 360, PET_FLOOR + 4, k, 16, t, 1);
}
function temaItemChao(x, cx, by, k, t){   // item da temporada no chão (tocar liga e desliga o tema)
  var inf = TEMA_INFO[k]; if(!inf) return;
  x.save(); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.font = '26px sans-serif';
  x.translate(cx, by + Math.sin((t || 0) * .06) * 1.5); x.fillText(inf[7], 0, 0); x.restore();
}
function temaRoupa(roupa, c, x, y, cor, E, T, branco){
  var i;
  function calca(cc){ g.fillStyle = cc; g.fillRect(x + 7, y + 32, 7.5, 9.5); g.fillRect(x + 15.5, y + 32, 7.5, 9.5); g.fillRect(x + 7, y + 32, 16, 3); }
  if(roupa === 'vampiro'){   // Halloween Night: capa de vampiro (forro na cor escolhida), camisa com babado e colete
    var fr = branco ? '#c81d3a' : cor;
    g.fillStyle = '#16121f'; T([x + 4, y + 22, x - 4, y + 43, x + 7, y + 40]); T([x + 26, y + 22, x + 34, y + 43, x + 23, y + 40]);
    g.fillStyle = fr; T([x + 4.5, y + 24, x - 1.5, y + 41, x + 5.5, y + 39]); T([x + 25.5, y + 24, x + 31.5, y + 41, x + 24.5, y + 39]);
    calca('#1b1a24');
    g.fillStyle = '#16121f'; g.fillRect(x + 4, y + 22, 22, 11);
    g.fillStyle = '#f8f4ff'; g.fillRect(x + 10, y + 22, 10, 11);
    g.fillStyle = '#7a1230'; g.fillRect(x + 8, y + 24, 3, 9); g.fillRect(x + 19, y + 24, 3, 9);
    g.fillStyle = '#fff'; for(i = 0; i < 4; i++) E(x + 15, y + 23.5 + i * 2.2, 2.4 - i * .3, 1.1);
    g.fillStyle = '#ffe14d'; E(x + 15, y + 30.5, .9, .9);
    g.fillStyle = fr; T([x + 4, y + 23, x + 1, y + 16, x + 9, y + 22]); T([x + 26, y + 23, x + 29, y + 16, x + 21, y + 22]);   // gola alta
  } else if(roupa === 'rena'){   // Natal: suéter (na cor escolhida) com faixa de zigue-zague e rena no peito
    var sw = branco ? '#c81d25' : cor;
    calca('#2a3f8a');
    g.fillStyle = sw; g.fillRect(x + 4, y + 22, 22, 12);
    g.fillStyle = '#fff'; g.fillRect(x + 4, y + 23.5, 22, 2.2); g.fillRect(x + 4, y + 31.5, 22, 1.4);
    g.fillStyle = '#16a34a'; for(i = 0; i < 6; i++) T([x + 4 + i * 3.7, y + 25.7, x + 5.8 + i * 3.7, y + 23.5, x + 7.6 + i * 3.7, y + 25.7]);
    g.fillStyle = '#8b5a2b'; E(x + 15, y + 29, 3, 2.4); g.fillRect(x + 11, y + 26.5, 1, 2); g.fillRect(x + 18, y + 26.5, 1, 2); g.fillRect(x + 10, y + 26.5, 2.5, .8); g.fillRect(x + 17.5, y + 26.5, 2.5, .8);
    g.fillStyle = '#ff2a4d'; E(x + 15, y + 30.4, 1.1, 1); g.fillStyle = '#1b1a24'; g.fillRect(x + 13.6, y + 28.2, .8, .8); g.fillRect(x + 15.6, y + 28.2, .8, .8);
    perfAntena = 'rena';
  } else if(roupa === 'reveillon'){   // Ano Novo: tudo branco com brilho dourado (a tradição da virada no Brasil)
    calca('#f8fafc'); g.fillStyle = '#e2e8f0'; g.fillRect(x + 14.6, y + 34, .8, 7.5);
    g.fillStyle = '#ffffff'; g.fillRect(x + 4, y + 22, 22, 11);
    g.fillStyle = '#e8eef7'; T([x + 10, y + 22, x + 20, y + 22, x + 15, y + 27]);
    g.fillStyle = branco ? '#f5b400' : cor; g.fillRect(x + 4, y + 31, 22, 1.8);
    g.fillStyle = '#ffd84d'; [[7, 24], [22, 25], [9, 29], [20, 29.5], [12, 26], [17, 23.5], [24, 28]].forEach(function(p, j){ g.globalAlpha = .6 + .4 * Math.sin((frame || 0) * .15 + j); g.fillRect(x + p[0], y + p[1], 1, 1); });
    g.globalAlpha = 1;
    perfAntena = 'estrelas';
  } else if(roupa === 'floral'){   // Verão: camisa floral aberta (na cor escolhida), regata branca e bermuda
    var fl = branco ? '#29b6e8' : cor;
    g.fillStyle = '#d9b77e'; g.fillRect(x + 6, y + 32, 18, 6); g.fillStyle = '#c4a067'; g.fillRect(x + 14.6, y + 33.5, .8, 4.5);
    g.fillStyle = '#ffffff'; g.fillRect(x + 9, y + 22, 12, 11);
    g.fillStyle = fl; g.fillRect(x + 4, y + 22, 7, 11); g.fillRect(x + 19, y + 22, 7, 11);
    T([x + 9, y + 22, x + 12, y + 22, x + 10, y + 26]); T([x + 21, y + 22, x + 18, y + 22, x + 20, y + 26]);
    temaFlorG(x + 6.5, y + 25, 1.1, '#ff6fb5'); temaFlorG(x + 23, y + 29, 1.1, '#ffe14d'); temaFlorG(x + 7, y + 30.5, .9, '#fff'); temaFlorG(x + 22.5, y + 24, .9, '#ff6fb5');
    g.fillStyle = '#16a34a'; E(x + 9, y + 27.5, 1.6, .7, .6); E(x + 21, y + 26.6, 1.6, .7, -.6);
    perfAntena = 'flor';
  } else if(roupa === 'coracao'){   // Valentine: suéter (na cor escolhida) com coraçõezinhos e um coração grande
    var sc = branco ? '#ff9ccd' : cor;
    calca('#2a3f8a');
    g.fillStyle = sc; g.fillRect(x + 4, y + 22, 22, 12);
    g.fillStyle = '#fff'; g.fillRect(x + 9, y + 22, 12, 1.6); g.fillRect(x + 4, y + 32.4, 22, 1.6);
    g.fillStyle = 'rgba(255,255,255,.7)'; [[7, 25], [23, 26], [8, 30], [22, 30.5]].forEach(function(p){ temaCoracaoG(x + p[0], y + p[1], .9); });
    g.fillStyle = '#ff2a4d'; temaCoracaoG(x + 15, y + 27.6, 2.8);
    g.fillStyle = 'rgba(255,255,255,.6)'; E(x + 13.6, y + 26.4, .7, .5);
  } else if(roupa === 'outono'){   // sobretudo caramelo com cinto e cachecol (na cor escolhida)
    var ca = branco ? '#e8650c' : cor;
    calca('#5a3a24');
    g.fillStyle = '#c08a52'; g.fillRect(x + 4, y + 22, 22, 15);
    g.fillStyle = '#a8743f'; T([x + 9, y + 22, x + 15, y + 30, x + 12, y + 22]); T([x + 21, y + 22, x + 15, y + 30, x + 18, y + 22]); g.fillRect(x + 14.6, y + 30, .8, 7);
    g.fillStyle = '#7a4f28'; g.fillRect(x + 4, y + 30, 22, 2); g.fillStyle = '#ffd27a'; g.fillRect(x + 13.5, y + 29.8, 3, 2.4); g.fillStyle = '#7a4f28'; g.fillRect(x + 14.4, y + 30.6, 1.2, .8);
    g.fillStyle = ca; g.fillRect(x + 7, y + 21.5, 16, 3.4); g.fillRect(x + 17, y + 23, 3.4, 9);
    g.fillStyle = 'rgba(255,255,255,.35)'; for(i = 0; i < 3; i++) g.fillRect(x + 17, y + 25 + i * 2.4, 3.4, .7);
    g.fillStyle = ca; for(i = 0; i < 3; i++) g.fillRect(x + 17.2 + i * 1.1, y + 32, .6, 1.6);
  } else if(roupa === 'sakura'){   // haori com pétalas (na cor escolhida) e calça larga azul-marinho
    var hk = branco ? '#ffb7d5' : cor;
    g.fillStyle = '#1e2a5a'; T([x + 6, y + 32, x + 24, y + 32, x + 26, y + 42, x + 4, y + 42]); g.fillStyle = '#2c3d7a'; g.fillRect(x + 14.6, y + 33, .8, 9);
    g.fillStyle = '#fff'; g.fillRect(x + 8, y + 22, 14, 11);
    g.fillStyle = '#1e2a5a'; g.fillRect(x + 8, y + 30, 14, 2.6);
    g.fillStyle = hk; g.fillRect(x + 3, y + 22, 8, 13); g.fillRect(x + 19, y + 22, 8, 13);
    g.fillStyle = 'rgba(255,255,255,.85)'; T([x + 10, y + 22, x + 12, y + 22, x + 11, y + 35]); T([x + 20, y + 22, x + 18, y + 22, x + 19, y + 35]);
    [[5, 25], [7, 30], [23, 27], [24.5, 32], [5.5, 33]].forEach(function(p){ temaFlorG(x + p[0], y + p[1], .75, '#fff', '#ff6fb5'); });
    perfAntena = 'sakura';
  } else if(roupa === 'puffer'){   // jaqueta puffer (na cor escolhida), cachecol e gorro
    var pf = branco ? '#4169e1' : cor;
    calca('#1b2a5e');
    g.fillStyle = pf; g.beginPath(); g.moveTo(x + 3, y + 23); g.quadraticCurveTo(x + 15, y + 19.5, x + 27, y + 23); g.lineTo(x + 27.5, y + 35); g.quadraticCurveTo(x + 15, y + 37, x + 2.5, y + 35); g.closePath(); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = .8; for(i = 0; i < 3; i++){ g.beginPath(); g.moveTo(x + 3, y + 26.5 + i * 3.2); g.quadraticCurveTo(x + 15, y + 28 + i * 3.2, x + 27, y + 26.5 + i * 3.2); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.3)'; for(i = 0; i < 3; i++) E(x + 9, y + 25 + i * 3.2, 3.2, .8);
    g.fillStyle = '#e2e8f0'; g.fillRect(x + 14.5, y + 23, 1, 13);
    g.fillStyle = '#fff'; g.fillRect(x + 7, y + 21.5, 16, 3.2); g.fillStyle = '#ff6fb5'; g.fillRect(x + 8, y + 22.3, 14, .8); g.fillRect(x + 8.5, y + 23, 3.2, 7); g.fillStyle = '#fff'; g.fillRect(x + 8.5, y + 25, 3.2, .8); g.fillRect(x + 8.5, y + 27.5, 3.2, .8);
    perfAntena = 'gorro';
  } else if(roupa === 'yukata'){   // yukata de Tanabata (na cor escolhida) com estrelinhas e obi amarelo
    var yk = branco ? '#1e3a8a' : cor;
    g.fillStyle = yk; T([x + 4, y + 22, x + 26, y + 22, x + 25, y + 42, x + 5, y + 42]);
    g.fillStyle = '#fff'; T([x + 10, y + 22, x + 13, y + 22, x + 18, y + 30, x + 15.5, y + 30]); T([x + 20, y + 22, x + 17, y + 22, x + 15, y + 26]);
    g.fillStyle = 'rgba(0,0,0,.15)'; T([x + 15, y + 30, x + 25.5, y + 33, x + 25, y + 42, x + 15, y + 42]);
    g.fillStyle = '#ffe14d'; g.fillRect(x + 4, y + 29.5, 22, 3.6); g.fillStyle = '#ff6fb5'; g.fillRect(x + 4, y + 30.9, 22, .8);
    g.fillStyle = '#ffe14d'; [[7, 25], [22, 26], [8, 36], [20, 38], [12, 39]].forEach(function(p){ g.font = '900 3px sans-serif'; g.textAlign = 'center'; g.fillText('★', x + p[0], y + p[1]); });
    perfAntena = 'estrelas';
  } else if(roupa === 'cardiga'){   // cardigã florido (na cor escolhida), blusa de golinha e calça azul-clara
    var cd = branco ? '#b6ff3b' : cor;
    calca('#86a6dd');
    g.fillStyle = '#fff'; g.fillRect(x + 9, y + 22, 12, 11);
    g.fillStyle = '#fff'; T([x + 10, y + 22, x + 15, y + 22, x + 12, y + 25]); T([x + 20, y + 22, x + 15, y + 22, x + 18, y + 25]);
    g.fillStyle = cd; g.fillRect(x + 4, y + 22, 7, 12); g.fillRect(x + 19, y + 22, 7, 12);
    g.fillStyle = 'rgba(255,255,255,.4)'; for(i = 0; i < 5; i++){ g.fillRect(x + 4, y + 23 + i * 2.2, 7, .5); g.fillRect(x + 19, y + 23 + i * 2.2, 7, .5); }
    [[25, '#ff9ccd'], [28.4, '#ffe14d'], [31.6, '#c4a5ff']].forEach(function(b){ temaFlorG(x + 10.6, y + b[0], .65, b[1]); });
    temaFlorG(x + 22.5, y + 27, .9, '#ff9ccd'); temaFlorG(x + 7, y + 31, .8, '#fff');
    perfAntena = 'flor';
  } else if(roupa === 'jardineira'){   // Dia das Crianças: jardineira (na cor escolhida), camiseta listrada arco-íris e boné de hélice
    var jd = branco ? '#4169e1' : cor;
    ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b'].forEach(function(cc, j){ g.fillStyle = cc; g.fillRect(x + 4, y + 22 + j * 2.6, 22, 2.6); });
    g.fillStyle = jd; g.fillRect(x + 8, y + 25, 14, 8); g.fillRect(x + 8, y + 22, 2.4, 4); g.fillRect(x + 19.6, y + 22, 2.4, 4);
    calca(jd); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 11, y + 27, 8, 4);
    g.fillStyle = '#ffe14d'; E(x + 9.2, y + 25.4, 1.3, 1.3); E(x + 20.8, y + 25.4, 1.3, 1.3);
    g.fillStyle = '#ff6fb5'; temaCoracaoG(x + 15, y + 29, 1.4);
    perfAntena = 'helice';
  } else if(roupa === 'festa48'){   // Aniversário do BRS48: jaqueta de festa com brilho, faixa nas cores do TsuLiPa e o 48 dourado
    var fj = branco ? '#7b3ff0' : cor;
    calca('#2c1a5e');
    g.fillStyle = fj; g.fillRect(x + 4, y + 22, 22, 12);
    ['#9b30d9', '#5cc72c', '#4169e1'].forEach(function(cc, j){ g.fillStyle = cc; T([x + 4, y + 23 + j * 1.6, x + 26, y + 30 + j * 1.6, x + 26, y + 31.6 + j * 1.6, x + 4, y + 24.6 + j * 1.6]); });
    g.fillStyle = '#ffe14d'; g.font = '900 6px sans-serif'; g.textAlign = 'center'; g.fillText('48', x + 20, y + 27);
    g.fillStyle = '#fff'; [[7, 31], [12, 23.5], [23, 32], [9, 27]].forEach(function(p2){ g.fillRect(x + p2[0], y + p2[1], 1, 1); });
    perfAntena = 'chapeu';
  } else return false;
  return true;
}
function temaFlorG(cx, cy, r, cor, miolo){ g.fillStyle = cor; for(var i = 0; i < 5; i++){ g.beginPath(); g.arc(cx + Math.cos(i * 1.2566) * r, cy + Math.sin(i * 1.2566) * r, r * .85, 0, 7); g.fill(); } g.fillStyle = miolo || '#ffe14d'; g.beginPath(); g.arc(cx, cy, r * .6, 0, 7); g.fill(); }
function temaCoracaoG(cx, cy, s){ g.beginPath(); g.moveTo(cx, cy + s * .9); g.bezierCurveTo(cx - s * 1.6, cy - s * .2, cx - s * .7, cy - s * 1.3, cx, cy - s * .45); g.bezierCurveTo(cx + s * .7, cy - s * 1.3, cx + s * 1.6, cy - s * .2, cx, cy + s * .9); g.fill(); }
// Acessórios de cabeça (chamados pelo perfPoseFrente, depois do rosto)
function temaAntena(ant, c, x, y){
  if(ant === 'rena'){   // tiara de chifres de rena
    g.strokeStyle = '#8b5a2b'; g.lineWidth = 1.4; g.lineCap = 'round';
    [[9, -1], [21, 1]].forEach(function(p){ var d = p[1] || -1; g.beginPath(); g.moveTo(x + p[0], y); g.lineTo(x + p[0] + d * 2, y - 9); g.moveTo(x + p[0] + d * 1, y - 4); g.lineTo(x + p[0] + d * 4.5, y - 6); g.moveTo(x + p[0] + d * 1.7, y - 7); g.lineTo(x + p[0] - d * 1, y - 10); g.stroke(); });
    g.fillStyle = '#c81d25'; g.fillRect(x + 4, y + 1, 22, 1.6);
  } else if(ant === 'gorro'){   // gorro de inverno com pompom
    g.fillStyle = '#ff6fb5'; g.beginPath(); g.arc(x + 15, y + 4, 12.5, Math.PI, 0); g.fill();
    g.fillStyle = 'rgba(255,255,255,.35)'; for(var i = 0; i < 4; i++) g.fillRect(x + 7 + i * 4.5, y - 6, 1, 9);
    g.fillStyle = '#fff'; g.fillRect(x + 2, y + 2, 26, 3.6); g.beginPath(); g.arc(x + 15, y - 9, 3.2, 0, 7); g.fill();
  } else if(ant === 'flor'){   // hibisco atrás da orelha
    temaFlorG(x + 25.5, y + 4, 1.8, '#ff6fb5', '#ffe14d'); g.fillStyle = '#16a34a'; g.beginPath(); g.ellipse(x + 28.5, y + 6.5, 2, .9, .6, 0, 7); g.fill();
  } else if(ant === 'sakura'){   // grampo de sakura
    temaFlorG(x + 6.5, y + 3.5, 1.5, '#ffc4dd', '#ff6fb5'); temaFlorG(x + 9.5, y + 1.5, 1.1, '#fff', '#ff9ccd');
  } else if(ant === 'helice'){   // boné de hélice
    g.fillStyle = '#4169e1'; g.beginPath(); g.arc(x + 15, y + 4, 12, Math.PI, 0); g.fill(); g.fillRect(x + 15, y + 2.5, 15, 2.2);
    g.fillStyle = '#ffe14d'; g.fillRect(x + 14.3, y - 11, 1.4, 4);
    g.fillStyle = '#ff6fb5'; g.beginPath(); g.ellipse(x + 11.5, y - 11, 3.6, 1.1, 0, 0, 7); g.fill(); g.fillStyle = '#4dd8ff'; g.beginPath(); g.ellipse(x + 18.5, y - 11, 3.6, 1.1, 0, 0, 7); g.fill();
  } else if(ant === 'chapeu'){   // chapéu de festa
    g.fillStyle = '#ff6fb5'; g.beginPath(); g.moveTo(x + 9, y + 1); g.lineTo(x + 21, y + 1); g.lineTo(x + 16, y - 15); g.closePath(); g.fill();
    g.fillStyle = '#ffe14d'; g.fillRect(x + 11, y - 4, 8, 1.5); g.fillRect(x + 13, y - 9, 5, 1.3); g.beginPath(); g.arc(x + 16, y - 15, 2.2, 0, 7); g.fill();
  } else if(ant === 'estrelinha'){   // presilha de estrela com fitinhas (Céu Estrelado)
    g.fillStyle = '#ff6fb5'; g.fillRect(x + 5, y + 1.6, 20, 1.3);
    g.font = '900 7px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#ffe14d'; g.fillText('★', x + 23, y + 3.5);
    g.fillStyle = '#4dd8ff'; g.fillRect(x + 23.5, y + 3.6, .9, 5); g.fillStyle = '#ff6fb5'; g.fillRect(x + 22, y + 3.6, .9, 4);
  } else if(ant === 'estrelas'){   // tiara de estrelinhas douradas
    g.fillStyle = '#f5b400'; g.fillRect(x + 4, y + 1.5, 22, 1.2);
    g.font = '900 5px sans-serif'; g.textAlign = 'center'; g.fillStyle = '#ffe14d';
    [[8, 1.5], [15, -.5], [22, 1.5]].forEach(function(p){ g.fillText('★', x + p[0], y + p[1]); });
  }
}
// Chave NOVA brs48cr_bestc (nunca renomear): {"0": Tsu, "1": Lirika, "2": Pati, "3": Idol}
function bestcLer(){ try{ var o = JSON.parse(localStorage.getItem('brs48cr_bestc') || 'null'); if(o && typeof o === 'object') return o; }catch(e){} return null; }
function bestcGravar(o){ try{ localStorage.setItem('brs48cr_bestc', JSON.stringify(o)); }catch(e){} }
function bestcIdx(nome){ nome = nome === 'Você' ? 'Idol' : nome; for(var i = 0; i < CH.length; i++) if(CH[i].n === nome) return i; return -1; }
function bestcIniciar(){   // primeira vez: monta pelo histórico real do aparelho (rankings local, da semana e do dia)
  var o = { 0:0, 1:0, 2:0, 3:0 };
  ['brs48cr_lb', 'brs48cr_lw', 'brs48cr_ld'].forEach(function(k){
    var v = null; try{ v = JSON.parse(localStorage.getItem(k) || 'null'); }catch(e){}
    var L = Array.isArray(v) ? v : (v && Array.isArray(v.rows) ? v.rows : []);
    L.forEach(function(r){ var i = bestcIdx(r && r.char); if(i >= 0) o[i] = Math.max(o[i], +r.score || 0); });
  });
  bestcGravar(o); return o;
}
function bestDe(i){ var o = bestcLer() || bestcIniciar(); return +o[i] || 0; }
function bestcNuvem(pp){   // por_personagem do servidor ({"Idol": 12000, "Tsu": 6400}): fica o maior
  if(!pp || typeof pp !== 'object') return;
  var o = bestcLer() || bestcIniciar(), mudou = false;
  Object.keys(pp).forEach(function(n){ var i = bestcIdx(n); if(i >= 0 && (+pp[n] || 0) > (+o[i] || 0)){ o[i] = +pp[n]; mudou = true; } });
  if(mudou){ bestcGravar(o); if(typeof refreshAcc === 'function') refreshAcc(); }
}
function petAnelAtras(ctx, type, appearanceOverride){
  var acc = appearanceOverride && typeof appearanceOverride.acc === 'string' ? appearanceOverride.acc : (type && typeof type === 'object' ? type.acc : (typeof petData !== 'undefined' && petData && petData.pets && petData.pets[type] ? petData.pets[type].acc : ''));
  if(acc !== 'anel' || type === 'lirika') return;
  ctx.save(); ctx.rotate(-.22); ctx.lineCap = 'round';
  ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(0, 2, 20, 4.5, 0, Math.PI + .35, Math.PI * 2 - .35); ctx.stroke();
  ctx.strokeStyle = 'rgba(253,224,71,.7)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, 2, 18.5, 3.5, 0, Math.PI + .2, Math.PI * 2 - .2); ctx.stroke();
  ctx.restore();
}
function roupaEstrelado(c, x, y, cor, E, T){
  var az = (!cor || /^#?f{6}$/i.test(cor)) ? '#3b5bdb' : cor, i;
  g.fillStyle = '#ff9ccd'; g.fillRect(x + 9, y + 38, 5, 5.5); g.fillRect(x + 17, y + 38, 5, 5.5);   // polainas listradas
  g.fillStyle = '#ffe14d'; g.fillRect(x + 9, y + 39.6, 5, 1); g.fillRect(x + 17, y + 39.6, 5, 1);
  g.fillStyle = '#4dd8ff'; g.fillRect(x + 9, y + 41.4, 5, .9); g.fillRect(x + 17, y + 41.4, 5, .9);
  if(!(typeof TWAvatarRosto!=='undefined'&&TWAvatarRosto.baixoEspecial(g,c,x,y,'estrelado',cor,T))){   // saia escolhida troca a bermuda balonê
  g.fillStyle = az; T([x + 5, y + 31, x + 25, y + 31, x + 27, y + 38, x + 3, y + 38]); if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'estrelado-baixo');                  // bermuda balonê
  g.fillStyle = '#a5d8ff'; g.fillRect(x + 3, y + 37.4, 24, 1.2);
  g.fillStyle = '#fff'; for(i = 0; i < 5; i++){ E(x + 6 + i * 4.6, y + 35.4, 1.7, 1.1); E(x + 7.3 + i * 4.6, y + 34.9, 1.3, 1); }   // nuvenzinhas na barra
  }
  g.fillStyle = az; g.fillRect(x + 4, y + 22, 22, 10); if(typeof TWAvatarRoupa!=='undefined')TWAvatarRoupa.parte(g,x,y,'estrelado-tronco');                                                      // jaqueta
  ['#ff6fb5', '#ffe14d', '#4dd8ff'].forEach(function(cc, j){ g.fillStyle = cc; T([x + 4, y + 27.4 + j * 1.5, x + 26, y + 24.4 + j * 1.5, x + 26, y + 25.8 + j * 1.5, x + 4, y + 28.8 + j * 1.5]); });   // faixa arco-íris
  g.fillStyle = '#fff'; T([x + 10, y + 22, x + 15, y + 22, x + 12.5, y + 24.6]); T([x + 20, y + 22, x + 15, y + 22, x + 17.5, y + 24.6]);   // gola
  g.fillStyle = '#ff4f9a'; T([x + 15, y + 23.4, x + 10.5, y + 21.2, x + 10.5, y + 25.6]); T([x + 15, y + 23.4, x + 19.5, y + 21.2, x + 19.5, y + 25.6]); g.fillStyle = '#ffd0e6'; E(x + 15, y + 23.4, 1.3, 1.3);   // laço
  g.fillStyle = '#ffe14d'; g.beginPath(); for(i = 0; i < 10; i++){ var rr = i % 2 ? 1 : 2.4, an = i * Math.PI / 5 - Math.PI / 2; g[i ? 'lineTo' : 'moveTo'](x + 21 + Math.cos(an) * rr, y + 29.6 + Math.sin(an) * rr); } g.closePath(); g.fill();   // estrela no peito
  perfAntena = 'estrelinha';
}
var cenaPg = null, cenaPgFeito = false;
function exprNova(c, x, y, expr){
  if(expr === 4){   // surpresa: olhos redondos e boquinha "o"
    g.fillStyle = '#fff'; g.beginPath(); g.arc(x + 11.5, y + 19.5, 2.6, 0, 7); g.arc(x + 19.5, y + 19.5, 2.6, 0, 7); g.fill();
    g.fillStyle = c.eye; g.beginPath(); g.arc(x + 11.5, y + 19.5, 1.6, 0, 7); g.arc(x + 19.5, y + 19.5, 1.6, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.fillRect(x + 11, y + 18.4, .9, .9); g.fillRect(x + 19, y + 18.4, .9, .9);
    g.fillStyle = '#223'; g.beginPath(); g.ellipse(x + 15.5, y + 24.5, 1.4, 1.8, 0, 0, 7); g.fill();
    return true;
  }
  if(expr === 5){   // chorinho: olhos fechados para baixo e lagriminhas
    g.strokeStyle = '#223'; g.lineWidth = 1.4; g.beginPath();
    g.moveTo(x + 9.5, y + 19); g.quadraticCurveTo(x + 11.5, y + 21.5, x + 13.5, y + 19); g.moveTo(x + 17.5, y + 19); g.quadraticCurveTo(x + 19.5, y + 21.5, x + 21.5, y + 19); g.stroke();
    g.fillStyle = '#7dd3fc'; g.beginPath(); g.ellipse(x + 10, y + 23, .9, 1.6, 0, 0, 7); g.ellipse(x + 21, y + 23, .9, 1.6, 0, 0, 7); g.fill();
    g.strokeStyle = '#223'; g.lineWidth = 1.1; g.beginPath(); g.arc(x + 15.5, y + 26, 1.8, Math.PI * 1.15, Math.PI * 1.85); g.stroke();
    return true;
  }
  if(expr === 6){   // apaixonado: olhos de coração e sorrisão
    g.fillStyle = '#ff4f9a'; [11.5, 19.5].forEach(function(cx){ g.beginPath(); g.moveTo(x + cx, y + 21.6); g.bezierCurveTo(x + cx - 3.4, y + 19.4, x + cx - 1.6, y + 16.6, x + cx, y + 18.6); g.bezierCurveTo(x + cx + 1.6, y + 16.6, x + cx + 3.4, y + 19.4, x + cx, y + 21.6); g.fill(); });
    g.fillStyle = '#223'; g.beginPath(); g.arc(x + 15.5, y + 23, 2.5, 0, Math.PI); g.fill();
    return true;
  }
  return false;
}
function insNivelTxt(k){ var p = String(k).split(':'); return +p[1] > 1 ? ' · ' + tr('Nível') + ' ' + p[1] : ''; }
var LOGO_TSL = './img/logo-tsl.webp';
var phAutoT = 0, phAutoV = 2;
var outdoorJog = [], outdoorFoto = {}, outdoorPedido = false;
function outdoorCarregar(){
  if(outdoorPedido || typeof contaRpc !== 'function') return; outdoorPedido = true;
  contaRpc('outdoor_jogadores').then(function(L){ outdoorJog = Array.isArray(L) ? L.filter(function(p){ return p && p.nick && p.avatar && typeof p.avatar === 'object'; }) : []; }).catch(function(){ outdoorPedido = false; });
}

// Insígnias da Temporada 2 (guardadas no aparelho; só o aviso usa os nomes)
var S2_INS = [
  ['s2_ensaio','🩰','Primeiro ensaio'],['s2_backstage','💄','Dona/Dono do backstage'],['s2_estudio','🎬','Estúdio no ar'],
  ['s2_festival','🏮','Noite de festival'],['s2_aeroporto','✈️','Embarque VIP'],['s2_geral','🏟️','Ensaio geral'],['s2_dome','🌈','Noite no Dome']
];
var S2_KEY = 'brs48cr_s2';
var S2_DAILY_LB_KEY = 'brs48cr_ldaily';
var S2_MIN_FRAMES = 3600; // 60 segundos a 60fps em cada cenário
// Tabela oficial dos 8 cenários da Temporada 2 (sem subtítulos de músicas)
var S2_STAGES = [
  { id:'rua',       min:0,     nome:'Rua da cidade',       badge:'',             onda:1, sky:['#071327','#2a3f78'], floor:'#1a2a55', line:'#ff6fb5' },
  { id:'ensaio',    min:1000,  nome:'Sala de ensaio',      badge:'s2_ensaio',    onda:1, sky:['#f8e8f2','#e2d4f0'], floor:'#c89d7c', line:'#b04fe6' },
  { id:'backstage', min:2800,  nome:'Backstage do teatro', badge:'s2_backstage', onda:1, sky:['#1f1235','#3b1d5e'], floor:'#2a1842', line:'#ff6fb5' },
  { id:'estudio',   min:5000,  nome:'Estúdio de TV',       badge:'s2_estudio',   onda:2, sky:['#0f172a','#1e293b'], floor:'#334155', line:'#ef4444' },
  { id:'festival',  min:10000, nome:'Festival de verão',   badge:'s2_festival',  onda:2, sky:['#1a103c','#4c1d95'], floor:'#27173a', line:'#fbbf24' },
  { id:'aeroporto', min:15000, nome:'Aeroporto da turnê',  badge:'s2_aeroporto', onda:3, sky:['#0c4a6e','#38bdf8'], floor:'#cbd5e1', line:'#0284c7' },
  { id:'geral',     min:30000, nome:'Ensaio geral',        badge:'s2_geral',     onda:1, sky:['#111827','#1f2937'], floor:'#1e293b', line:'#fde047' },
  { id:'dome',      min:50000, nome:'Dome do grande show', badge:'s2_dome',      onda:1, sky:['#090418','#2e1065'], floor:'#1e1b4b', line:'#b6ff3b' }
];
// Estado persistente da Temporada 2 (insígnias e fundo Dome)
var s2Save = { badges:{}, domeBg:false, stagesSeen:{} };
function s2Load(){
  try{
    var d = JSON.parse(window.__TW_TEST_STORAGE.getItem(S2_KEY) || 'null');
    if(d && typeof d === 'object'){
      s2Save.badges = d.badges || {};
      s2Save.domeBg = !!d.domeBg;
      s2Save.stagesSeen = d.stagesSeen || {};
    }
  }catch(e){}
}
function s2SyncProfile(){
  if(!contaJ || typeof contaRpc !== 'function') return;
  var earned = S2_INS.filter(function(x){ return !!s2Save.badges[x[0]]; }).map(function(x){ return x[0]; });
  if(!earned.length) return;
  contaRpc('sincronizar_insignias_jogos', { p_insignias: earned }).catch(function(){});
}
function s2Persist(){
  try{ window.__TW_TEST_STORAGE.setItem(S2_KEY, JSON.stringify(s2Save)); }catch(e){}
  s2SyncProfile();
}
// Estado de corrida da Temporada 2
var s2StageIdx = 0;          // índice em S2_STAGES
var s2StageFrames = 0;       // quadros passados no cenário atual (mínimo 3600 = 60s)
var s2Curtain = null;        // { phase:'close'|'open', p:0..1, nextIdx:number }
var s2Sliding = false;       // abaixado / deslizando
var s2SlideTimer = 0;        // duração restante do slide por toque rápido
var s2Combo = 0;             // estrelas seguidas sem perder nenhuma e sem dano
var s2MaxCombo = 0;          // maior combo da partida
var s2Platforms = [];        // plataformas de 2º andar no Dome
var s2FanRows = [];          // corredores de fãs para high-five
var s2NextFanRow = 900;      // próximo ponto para corredor de fãs
var s2Challenge = null;      // bônus opcional de 5 notas; não bloqueia a próxima fase
var s2HitEmotion = 0;        // emoção breve somente na corrida
var s2DrawingRunChar = false;
var S2_BONUS_BEAT_FRAMES = 60; // 5 notas com 1 segundo cada, sem bloquear passagem
var s2Coro = null;           // { t:480, partners:[...] }
var s2DailyMode = false;     // se a partida atual é a Corrida do Dia
var s2DailySeed = 1;         // semente determinística da Corrida do Dia
var s2DailyCosmeticSeed = 1; // separado: animações/fãs não afetam obstáculos
var s2DailyRunDate = '';      // data congelada ao começar a corrida
var s2ForcedStage = '';      // cenário fixado no Modo Teste
var s2Confetti = [];         // chuva de confete no Dome
// PRNG determinístico para a Corrida do Dia (Mulberry32)
function s2HashDate(str){
  var h = 2166136261 >>> 0;
  for(var i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h || 123456789;
}
// Ranking LOCAL: um melhor recorde por nickname normalizado neste aparelho.
function s2DailyBestRows(rows,newRow){
  var byNick=Object.create(null);
  (Array.isArray(rows)?rows:[]).concat(newRow?[newRow]:[]).forEach(function(r){
    if(!r||!Number.isFinite(+r.score))return;
    var key=String(r.name||'Anônimo').trim().toLocaleLowerCase('pt-BR');
    if(!key)return;
    var old=byNick[key];
    if(!old||+r.score>+old.score||(+r.score===+old.score&&(+r.t||0)<(+old.t||0)))byNick[key]=r;
  });
  return Object.keys(byNick).map(function(k){return byNick[k];})
    .sort(function(a,b){return (+b.score||0)-(+a.score||0)||(+a.t||0)-(+b.t||0);}).slice(0,15);
}
// Desbloqueia insígnia de cenário e recompensa do Dome
function s2UnlockStage(idx){
  var st = S2_STAGES[idx];
  if(!st) return;
  s2Save.stagesSeen[st.id] = true;
  if(st.badge && !s2Save.badges[st.badge] && !isTestGame){
    s2Save.badges[st.badge] = Date.now();
    var insItem = S2_INS.find(function(x){ return x[0] === st.badge; });
    var insNome = insItem ? insItem[2] : st.nome;
    toast = '🏅 ' + tr('Nova insígnia: ') + tr(insNome);
    toastT = 130;
  }
  if(st.id === 'dome' && !s2Save.domeBg && !isTestGame){
    s2Save.domeBg = true;
    toast = '🏟️ ' + tr('Fundo Dome desbloqueado!');
    toastT = 140;
  }
  s2Persist();
}
// Índice de cenário alvo pela pontuação atual
function s2TargetStageByScore(sc){
  var idx = 0;
  for(var i = 0; i < S2_STAGES.length; i++){
    if(sc >= S2_STAGES[i].min) idx = i;
  }
  return idx;
}
// Inicia ou reseta os estados da Temporada 2 a cada partida
function s2ResetHook(){
  var targetIdx = s2TargetStageByScore(score);
  if(s2ForcedStage){
    var fIdx = S2_STAGES.findIndex(function(x){ return x.id === s2ForcedStage; });
    if(fIdx >= 0) targetIdx = fIdx;
  }
  s2StageIdx = targetIdx;
  s2StageFrames = 0;
  s2Curtain = null;
  s2Sliding = false;
  s2SlideTimer = 0;
  s2Combo = 0;
  s2MaxCombo = 0;
  s2Platforms = [];
  s2FanRows = [];
  s2NextFanRow = score + 350;
  s2Challenge = null;
  s2HitEmotion = 0;
  s2DrawingRunChar = false;
  s2Coro = null;
  s2Confetti = [];
  for(var c = 0; c < 36; c++){
    s2Confetti.push({
      x: Math.random() * W,
      y: Math.random() * GY,
      c: ['#ff6fb5','#b6ff3b','#4169e1','#ffe14d','#a678ff'][c % 5],
      v: 1 + Math.random() * 1.5,
      s: Math.random() * 6
    });
  }
  s2DailyRunDate=s2DailyMode?dk():'';
  if(s2DailyMode){
    s2DailySeed=s2HashDate(s2DailyRunDate+'-tsulipa-s2');
    s2DailyCosmeticSeed=s2HashDate(s2DailyRunDate+'-tsulipa-s2-fans');
  }
  s2UnlockStage(s2StageIdx);
}
// Cinco oportunidades de ganhar ★; sem penalidade por errar ou não apertar.
function s2BonusAction(action){
  if(!s2Challenge || !s2Challenge.active || state !== 'play' || paused || s2Challenge.pressed) return;
  var expected = s2Challenge.beat % 2 === 0 ? 'jump' : 'slide';
  if(action !== expected) return;
  s2Challenge.pressed = true;
  s2Challenge.hits++;
  s2Challenge.hitsMask[s2Challenge.beat] = true;
  s2Challenge.flash = 18; // pulso visual no acerto, sem alterar pontuações
  stars++;
  score += CFG.STAR;
  pops.push({x:P.x+15,y:P.y-18,t:0,s:'★ +1'});
  sfx.star();
}
// Controles de Abaixar e Deslizar (PC + Celular)
function s2StartSlide(fromTap){
  if(state !== 'play' || paused) return;
  // A ação correta rende ★, mas a animação de deslizar continua normalmente.
  if(s2Challenge && s2Challenge.active) s2BonusAction('slide');
  if(pw && pw.k === 'alien') return;
  s2Sliding = true;
  if(fromTap) s2SlideTimer = Math.max(s2SlideTimer, 34); // ~0.55s por toque rápido
  if(P.air && P.vy < 6) P.vy = 7.5; // desce rápido se estava no ar
}
function s2StopSlide(){
  if(s2SlideTimer <= 0) s2Sliding = false;
}
function s2SetupUI(){
  // 1. Botão de deslizar (▼) no palco para celulares/tablets
  var stg = $('stage');
  if(stg && !$('sb')){
    var sb = document.createElement('button');
    sb.className = 'jb';
    sb.id = 'sb';
    sb.setAttribute('aria-label', tr('Abaixar'));
    sb.style.cssText = 'display:none;left:14px;right:auto;bottom:14px';
    sb.textContent = '▼';
    sb.style.touchAction = 'none';
    stg.appendChild(sb);
    sb.addEventListener('pointerdown', function(e){
      e.stopPropagation(); e.preventDefault();
      s2SlideTimer = 42;
      s2StartSlide(true);
      if(sb.setPointerCapture){try{sb.setPointerCapture(e.pointerId);}catch(_){}}
    });
    sb.addEventListener('pointerup', function(e){
      e.stopPropagation();
      s2SlideTimer = 0;
      s2StopSlide();
    });
    sb.addEventListener('pointercancel', function(e){
      e.stopPropagation();
      s2SlideTimer = 0;
      s2StopSlide();
    });
  }

  // 2. Seletor de Cenário no Modo Teste (#tstw) para testar qualquer cenário direto
  var tstw = $('tstw');
  if(tstw && !$('tstStage')){
    var lbl = document.createElement('label');
    lbl.innerHTML = 'Cenário S2 <select id="tstStage">' +
      '<option value="">Automático (60s)</option>' +
      S2_STAGES.map(function(s){
        return '<option value="' + s.id + '">' + s.nome + ' (' + s.min + ')</option>';
      }).join('') +
      '</select>';
    tstw.appendChild(lbl);
    $('tstStage').addEventListener('change', function(){
      s2ForcedStage = this.value || '';
      if(this.value){
        var stObj = S2_STAGES.find(function(x){ return x.id === s2ForcedStage; });
        if(stObj && $('tst')) $('tst').value = String(stObj.min);
      }
    });
  }

  // 3. Botão "📅 Corrida do dia" ao lado/abaixo de JOGAR no menu
  var playBtn = $('play');
  if(playBtn && !$('playDaily')){
    var dWrap = document.createElement('div');
    dWrap.style.cssText = 'margin-top:8px';
    var dBtn = document.createElement('button');
    dBtn.type = 'button';
    dBtn.id = 'playDaily';
    dBtn.className = 'btn alt';
    dBtn.style.cssText = 'font-size:13px;padding:7px 20px;background:linear-gradient(90deg,#ec4899,#8b5cf6);color:#fff';
    dBtn.textContent = tr('📅 Corrida do dia');
    dWrap.appendChild(dBtn);
    playBtn.parentNode.insertBefore(dWrap, playBtn.nextSibling);

    dBtn.addEventListener('click', function(e){
      s2DailyMode = true;
      start(e);
    });
    playBtn.addEventListener('click', function(){
      s2DailyMode = false;
    }, true);
  }

  // 4. Aba "Dia Fixo" nos rankings (#lbmw e #over)
  [].forEach.call(document.querySelectorAll('.tabs'), function(tb){
    if(!tb.querySelector('[data-t="daily_run"]')){
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.t = 'daily_run';
      b.textContent = tr('Corrida do Dia');
      tb.appendChild(b);
    }
  });
}
function s2ShowSlideButton(){
  var sb = $('sb'); if(!sb) return;
  var touch = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  sb.style.display = state === 'play' && touch ? 'block' : 'none';
}

// ---------- Corrida sob demanda (centerrun-corrida.js) ----------
// O resto do site nunca chama a corrida; ela baixa quando o palco do Center Run aparece ou ao tocar em JOGAR.
// twCorridaAoCarregar guarda o que precisa da corrida (os invólucros da Temporada 2 no index.html) e roda na ordem.
var TW_CORRIDA_ARQ='./centerrun-corrida.js?v=8',TW_CORRIDA_PRONTA=false,twCorridaFila=[],twCorridaP=null;
function twCorridaAoCarregar(f){if(TW_CORRIDA_PRONTA)f();else twCorridaFila.push(f);}
function twCorridaCarregar(){
  if(TW_CORRIDA_PRONTA)return Promise.resolve();
  if(!twCorridaP)twCorridaP=new Promise(function(ok,er){var e=document.createElement('script');e.src=TW_CORRIDA_ARQ;e.async=false;
    e.onload=ok;e.onerror=function(){twCorridaP=null;er(new Error('corrida'));};document.head.appendChild(e);})
    .then(function(){TW_CORRIDA_PRONTA=true;var f;while((f=twCorridaFila.shift()))try{f();}catch(e){if(window.console)console.error(e);}
      twIndex2StartBaseLoop();});
  return twCorridaP;
}
