/* Center⭐Run! — o jogo principal: personagens (drawChar), corrida, cenário vivo, ranking local, foto/photocard,
   temas da temporada, easter eggs, outdoors, obstáculos e a Temporada 2.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 8), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (estado do jogo, laço, listeners, invólucros da Temporada 2 e inicialização continuam lá). */
var LANG='pt';
function tr(k){var d=DICT[LANG];return (d&&d[k])||k}
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
      if(DICT.en[k]||DICT.es[k]||DICT.th[k]||DICT.ja[k]||(DICT.id&&DICT.id[k]))node.__pt=raw;
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
        if(DICT.en[e.getAttribute(a)]||DICT.es[e.getAttribute(a)]||DICT.ja[e.getAttribute(a)]||DICT.th[e.getAttribute(a)]||(DICT.id&&DICT.id[e.getAttribute(a)]))e.setAttribute(key,e.getAttribute(a));
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
  {n:'Tsu',img:'#9b30d9',hair:'#b04fe6',hair2:'#fff',streak:false,skin:'#b97a50',eye:'#a64bd9',back:'pixie',front:'bagunca',det:'gato',gl:'',out:'',outcol:'#ffffff',hat:''},
  {n:'Lirika',img:'#b6ff3b',hair:'#1a1a22',hair2:'#fff',streak:false,skin:'#f1c9a5',eye:'#5a3b2e',back:'chanel',front:'reta',det:'coques',gl:'',out:'',outcol:'#ffffff',hat:''},
  {n:'Pati',img:'#4169e1',hair:'#4a6fd8',hair2:'#fff',streak:false,skin:'#fbe5d8',eye:'#3a55b8',back:'',front:'reta',det:'',gl:'',out:'',outcol:'#ffffff',hat:''},
  {n:'Idol',img:'#ff7eb6',hair:'#ff7eb6',hair2:'#4dd8ff',streak:false,skin:'#f1c9a5',eye:'#5a3b2e',back:'chanel',front:'lateral',det:'',gl:'',out:'',outcol:'#ffffff',hat:''}
];
var RANKS=[[0,'Audição'],[150,'Kenkyuusei'],[450,'Team'],[1000,'Senbatsu'],[1800,'Quad Center'],[2800,'tCenter'],[3900,'wCenter'],[5000,'Center'],[10000,'Solo Center'],[15000,'Capitão'],[30000,'Eternal Ace'],[50000,'Kami-Oshi']];
var sel=0,best=0,state='menu',muted=false,overTimer=null;
function setBest(){bestEl.textContent=tr('Recorde')+': '+best+' · ★ '+starT;if(window.ktTickets&&window.ktTickets.renderBadge)window.ktTickets.renderBadge();}
var CF={chair:'hair',cstr:'hair2',ceye:'eye',cout:'out',coutcol:'outcol',cback:'back',cfront:'front',cdet:'det',chat:'hat',cgl:'gl'};
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
function upd(arr,row){
  var a=(arr||[]).slice();
  a.push(row);
  a.sort(function(x,y){return (y.score||0)-(x.score||0) || (x.t||0)-(y.t||0)});
  return a.slice(0,15);
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
      return {out: c.out||'', outcol: c.outcol||'', hat: c.hat||'', gl: c.gl||''};
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
  if ($('cback')) $('cback').value = source.back || '';
  if ($('cfront')) $('cfront').value = source.front || 'bagunca';
  if ($('cdet')) $('cdet').value = source.det || '';
  
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
function newItems(ob,sc){var a=ACC.filter(function(x){return x[2]>0&&x[2]>ob&&sc>=x[2]});refreshAcc();return a.length?'<br>✨ '+tr('Item novo')+': '+a.map(function(x){return tr(x[1])}).join(', '):''}
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
  W=pt?380:720;H=pt?506:380;GY=H-80;SC=Math.max(.65,W/720);K=GY/300;cv.width=W;cv.height=H;
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
  var pv=document.getElementById('twPreviewJogo');return !!(pv&&!pv.hidden);
}
function music(on){
  clearInterval(mt);if(!on)return;
  var k=curT||'menu',ms={menu:260,tense:150,hard:120,alien:130,kawaii:100,unit:130,pet:340,petSono:560}[k]||190;
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
    bi++;
  },ms);
}
function sync(){var k=state!=='play'?(typeof petMusicK==='function'?petMusicK():'menu'):(pw&&pw.k==='gigante'?'kawaii':pw&&pw.k==='alien'?'alien':pw&&pw.k==='unit'?'unit':rankI>=9?'hard':rankI>=7?'tense':'s'+(Math.floor(frame/3600)%4));if(k!==curT)curT=k;if(muted||paused||document.hidden||twJogoEmPopup()||(typeof hubOv!=='undefined'&&typeof hubTelaAberta==='function'&&hubTelaAberta())){clearInterval(mt);mt=null;return;}if(!mt)music(true);}
var ct = 0; 
var paused=false,abducted=false,wasAbducted=false;
var isTestGame = false;
var CFG={STAR:15,STAR_FEVER:30,CARD:100,UFO_EVERY:2500,UFO_BONUS:100,UFO_FRAMES:480,UFO_STAR_MULT:.5,DIST_RATE:.015};
function getPartner(currentSel) {
  var options = (currentSel === 0) ? [1, 2] : (currentSel === 1) ? [0, 2] : (currentSel === 2) ? [0, 1] : [0, 1, 2];
  
  if (window.partnerBag && window.partnerBag.length > 0) {
    window.partnerBag = window.partnerBag.filter(function(id) { return id !== currentSel; });
  }

  if (!window.partnerBag || window.partnerBag.length === 0) {
    var pool = options.slice();
    // Embaralha a ordem do trio/dupla
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = pool[i]; pool[i] = pool[j]; pool[j] = temp;
    }
    // Evita que o primeiro da nova rodada seja igual ao último da rodada anterior
    if (pool.length > 1 && pool[0] === window.lastPartnerPicked) {
      var first = pool.shift();
      pool.push(first);
    }
    window.partnerBag = pool;
  }
  
  var chosen = window.partnerBag.shift();
  window.lastPartnerPicked = chosen;
  return chosen;
}
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
function spawn(){
  var t=s2Rand(),o;
  if(t<.4) o={k:'cable',w:56,h:12};
  else if(t<.75) o={k:'speaker',w:36,h:48};
  else {
    var q2=s2Rand();
    o={k:'stick',w:24,h:42,pal:q2<.65?['#9b30d9','#b6ff3b','#4169e1']:q2<.85?['#4169e1','#ffe14d','#34d399']:['#ff6fb5','#4dd8ff','#ffe14d']};
  }
  o.x=nextX; o.y=GY-o.h; obs.push(o);

  if(s2Rand()<(frame>5400?Math.min(.3,(frame-5400)/12000):0)){
    var o2={k:'speaker',w:36,h:48,x:o.x+o.w+s2Rnd(55,95)};
    o2.y=GY-48; obs.push(o2);
    nextX+=o2.w+s2Rnd(80,140);
  }

  var r=s2Rand();
  if(r<.7){
    var n=3,cx=o.x+o.w/2,cd=s2Rand()<.4&&frame-lastCard>1500,q=s2Rand(),cty=q<.4?'plain':q<.7?'fever':'ima';
    if(cd)lastCard=frame;
    for(var i=0;i<n;i++){
      var u=(i-1)/1;
      items.push({k:(cd&&i===1)?'card':'star',x:cx+u*46-8,y:GY-o.h-34-(1-u*u)*32,w:18,h:18,got:false,ct:cty});
    }
  }

  var gap = sp * 40 + s2Rnd(110, 340);
  if(s2Rand()<0.25) gap += s2Rnd(200, 500); 
	
	// --- GERADOR DE PLATEIA DINÂMICO ---
    if (score >= 450) { 
    var fanChance = score < 5000 ? 0.30 + ((score - 450) / 4550) * 0.45 : 0.90;
    
    if (s2CosRand() < fanChance) {
      var lsColors = ['#9b30d9', '#b6ff3b', '#4169e1'];
      if (sel === 3) lsColors.push(CU.hair);
      
      // quantos grupinhos por intervalo, mínimo/máximo de fãs por grupo e distância entre eles
      var fanGroups = score >= 10000 ? 3 : score >= 5000 ? 2 : 1;
      var fanMin    = score >= 10000 ? 3 : 1;
      var fanMax    = score >= 10000 ? 8 : score >= 5000 ? 5 : score >= 2500 ? 3 : 2;
      var fanSpace  = score >= 10000 ? 20 : score >= 5000 ? 26 : 34;
      
      for (var fg = 0; fg < fanGroups; fg++) {
        var numFans = fanMin + Math.floor(s2CosRand() * (fanMax - fanMin + 1));
        var gx = nextX + s2CosRnd(10, Math.max(110, gap - 120));   // cada grupo começa num ponto do intervalo
        for (var fi = 0; fi < numFans; fi++) {
          fans.push({
            x: gx + (fi * fanSpace) + s2CosRnd(-4, 4),
            y: GY - 15 - s2CosRnd(0, 7),
            color: lsColors[Math.floor(s2CosRand() * lsColors.length)],
            offset: s2CosRand() * 10
          });
        }
      }
    }
  }
	
  nextX += gap;
}
function rankOf(s){var r=0;for(var i=0;i<RANKS.length;i++)if(s>=RANKS[i][0])r=i;return r}
function jump(){
  ac();
  if(state==='menu'||state==='over'||paused)return;
  if(pw && pw.k==='alien')return;
  held=true;
  if(!P.air){P.vy=-12.5;P.air=true;sfx.jump()}
}
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
function celebDraw(){
  if(state !== 'over') return;
  var og = g, ch = CH[sel], pu = .5 + .5 * Math.sin(ct * .05);
  g = cc;
  g.clearRect(0, 0, 200, 150);
  
  var Q = curPal(), sg = g.createLinearGradient(0, 0, 0, 140);
  sg.addColorStop(0, Q[0]);
  sg.addColorStop(1, Q[1]);
  g.fillStyle = sg;
  g.fillRect(0, 0, 200, 150);
  
  for(var b = 0; b < 9; b++){ 
    var bh = 30 + (b * 37 % 40), bx = b * 24 - 6; 
    g.fillStyle = b % 2 ? Q[2] : Q[3]; 
    g.fillRect(bx, 140 - bh, 20, bh); 
    g.fillStyle = 'rgba(255,235,150,0.3)'; 
    if(b % 3 !== 0){ 
      for(var wy = 140 - bh + 8; wy < 130; wy += 12){ 
        g.fillRect(bx + 4, wy, 4, 4); 
        g.fillRect(bx + 12, wy, 4, 4); 
      } 
    } 
  }
  
  g.fillStyle = Q[6];
  g.fillRect(0, 140, 200, 10);
  g.fillStyle = Q[7];
  g.fillRect(0, 140, 200, 2);
  
  if(wasAbducted) ufoDraw(165, 40, .85);
  
  if(window.wasGiant){
    g.save();
    g.translate(32, 42);
    g.scale(1.2, 1.2);
    g.rotate(-0.2);
    g.shadowColor = '#ff6fb5';
    g.shadowBlur = 8;
    g.fillStyle = '#d97706';
    g.beginPath();
    g.moveTo(-6, 2);
    g.lineTo(6, 2);
    g.lineTo(0, 14);
    g.fill();
    g.fillStyle = '#ff6fb5';
    g.beginPath();
    g.arc(0, -1, 7, 0, 7);
    g.fill();
    g.beginPath();
    g.arc(-4, 2, 4, 0, 7);
    g.fill();
    g.beginPath();
    g.arc(4, 2, 4, 0, 7);
    g.fill();
    g.fillStyle = '#fff';
    g.fillRect(-2, -3, 2, 2);
    g.fillRect(2, -1, 2, 2);
    g.fillStyle = '#4dd8ff';
    g.fillRect(-1, -6, 2, 2);
    g.restore();
  }

  var cn = g.createLinearGradient(0, 0, 0, 140);
  cn.addColorStop(0, 'rgba(255,255,255,.5)');
  cn.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = cn;
  g.beginPath();
  g.moveTo(88, 0);
  g.lineTo(112, 0);
  g.lineTo(165, 140);
  g.lineTo(35, 140);
  g.fill();

  var rg = g.createRadialGradient(100, 85, 4, 100, 85, 75);
  rg.addColorStop(0, 'rgba(' + GLc() + ',' + (.5 + .25 * pu) + ')');
  rg.addColorStop(1, 'rgba(255,160,220,0)');
  g.fillStyle = rg;
  g.fillRect(0, 0, 200, 150);

  g.fillStyle = 'rgba(255,255,255,.28)';
  g.beginPath();
  g.ellipse(100, 140, 48, 7, 0, 0, 7);
  g.fill();

  g.save();
  g.scale(2, 2);
  for(var i = 0; i < 9; i++){
    var a = ct * .02 + i * .7, px = 50 + Math.cos(a) * (28 + i % 3 * 5), py = 38 + Math.sin(a * 1.3) * (24 + i % 2 * 6), sz = 1 + 2 * Math.abs(Math.sin(ct * .07 + i * 1.9));
    g.fillStyle = i % 2 ? '#ffe14d' : '#ff9ccd';
    g.fillRect(px - sz, py - .5, sz * 2, 1);
    g.fillRect(px - .5, py - sz, 1, sz * 2);
  }
  
  var jumpY = 27 - (1 - Math.cos(ct * .05)) / 2 * 8;
  var pList = (window.collectedPartners || []).filter(function(id) { return id !== sel; });
  
  if (sel === 3 && pList.length >= 3) {
    // --- QUARTETO: Formação de Palco (Simetria Perfeita e Centralizada) ---
    
    // 1. Linha de Trás (Mais altos, nas bordas simétricas)
    drawChar(CH[pList[0]], 5,  jumpY - 5, 1, 2, true); // Fundo Esquerda (Tsu)
    drawChar(CH[pList[2]], 65, jumpY - 5, 1, 2, true); // Fundo Direita (Pati)
    
    // 2. Linha da Frente (Mais baixos, centralizados juntos)
    drawChar(CH[pList[1]], 25, jumpY + 2, 1, 2, true); // Frente Esquerda (Lirika)
    drawChar(ch,           45, jumpY + 2, 1, finalExpr); // Frente Direita (Você)

    // Emojis recalculados milimetricamente para o topo de cada cabeça (X + 15)
    g.font = '7px sans-serif';
    g.textAlign = 'center';
    
    // Corações de trás (mais altos)
    g.fillText('💜', 20, jumpY - 12 + Math.sin(ct * 0.12) * 2.5);
    g.fillText('💙', 80, jumpY - 12 + Math.cos(ct * 0.15) * 2.5);
    
    // Corações da frente (mais baixos)
    g.fillText('💚', 40, jumpY - 5  + Math.cos(ct * 0.12) * 2.5);
    g.fillText('💖', 60, jumpY - 5  + Math.sin(ct * 0.15) * 2.5);

  } else if (pList.length >= 2) {
    // Trio na tela de Fim do Show (Oshi no centro exato)
    drawChar(CH[pList[0]], 11, jumpY + 2, 1, 2, true);
    drawChar(ch,           35, jumpY,     1, finalExpr);
    drawChar(CH[pList[1]], 59, jumpY + 2, 1, 2, true);
    
    // Corações animados e dinâmicos pulando individualmente para o Trio!
    g.font = '7px sans-serif';
    g.textAlign = 'center';
    var hMap = ['💜', '💚', '💙', '💖'];
    g.fillText(hMap[pList[0]], 26, jumpY - 6 + Math.sin(ct * 0.12) * 2.5);
    g.fillText(hMap[sel],      50, jumpY - 8 + Math.cos(ct * 0.12) * 2.5);
    g.fillText(hMap[pList[1]], 74, jumpY - 6 + Math.sin(ct * 0.15) * 2.5);
  } else if (pList.length === 1) {
    // Dupla na tela de Fim do Show
    drawChar(CH[pList[0]], 20, jumpY + 1, 1, 2, true);
    drawChar(ch,           50, jumpY,     1, finalExpr);
  } else {
    // Solo
    drawChar(ch, 35, jumpY, 1, finalExpr);
  }
  petPalco(g, 88, 72, .55, ct);   // seu pet comemorando no palco (Backstage⭐Pet!)
  g.restore();
  
  g = og;
}
var celebRaf = 0;
function celeb(t){
  cancelAnimationFrame(celebRaf);celebRaf=0;
  if(state !== 'over'||twIndex2BaseFramesPaused()) return;
  ct+=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta(cc.canvas,t):1;
  if(!window.TWMotionLifecycle||TWMotionLifecycle.render30Due(cc.canvas,t)){
  var og = g;
  try { celebDraw(); }
  catch(err){ console.error('celeb:', err); }
  finally { g = og; }
  }
  celebRaf = requestAnimationFrame(celeb);
}
function end(){
  if(state==='over')return;
  state='over';sfx.over();sync();shake=14;
  document.body.classList.remove('jogando');
  $('jb').style.display='none';
  $('pause').style.display='none';
  $('cam').style.display='none';
  var s=Math.floor(score),nb=!isTestGame&&s>best,ob=best;lastS=s;dpw=pw;
  var esperaEstrelas=!!(_supabase&&contaJ&&!isTestGame&&(nick||'').trim().toLowerCase()!=='tsuadmin');
  if(!isTestGame&&!esperaEstrelas)starT+=stars;
  try{localStorage.setItem('brs48cr_st',starT)}catch(e){}
  if(nb){best=s;try{localStorage.setItem('brs48cr_best',s)}catch(e){}}
  setBest();
  finalExpr = typeof exprFinal === 'function' ? exprFinal(s, nb) : (s < 450 ? 1 : (Math.random() < 0.5 ? 0 : 2));   // V2.1.3
  
  var rId = rankOf(s);
  // Este acabamento é opcional: se refreshAcc falhar, a confirmação online não pode parar.
  var novosItens='';
  try{novosItens=newItems(ob,s)}catch(err){if(typeof console!=='undefined'&&console.error)console.error('Center⭐Run!: acabamento dos itens indisponível',err);}
  $('res').innerHTML='<strong>'+s+' '+tr('pontos')+'</strong><br>★ '+(esperaEstrelas?'<span id="cr-recompensa">'+tr('Aguardando validação do servidor')+'</span>':stars+' '+tr('estrelas'))+'<br>'+tr('Posição')+': '+tr(RANKS[rId][1])+(nb?' · '+tr('novo recorde!'):'')+novosItens
    +((contaJ||isTestGame)?'':'<br><small style="color:var(--b1);font-weight:800">🔐 '+tr('Entre com Google para aparecer no ranking online')+'</small>');   // V2.1.2

  // Envia o resultado assim que a tela o apresenta. Falhas em acabamentos
  // opcionais abaixo não podem impedir a confirmação online da corrida.
  var enviarOnline=!!(_supabase&&contaJ&&!isTestGame&&(nick||'').trim().toLowerCase()!=='tsuadmin');
  var refresh=function(){showLb($('lbo'));if(!$('lbmw').hidden)showLb($('lbm'))};
  if(enviarOnline)contaFimCorrida(s,stars,CH[sel].n,refresh);
  
 var isTesting = isTestGame;
  var nomeDigitado = (nick || '').trim().toLowerCase();
  var isAdmin = (nomeDigitado === 'tsuadmin');
  var row={name:nick||'Anônimo',score:s,rankId:rId,char:CH[sel].n,t:Date.now()};
  if(!isTestGame && typeof bestcSalvar==='function'){ bestcSalvar(sel, s); refreshAcc(); }   // V2.1.3: recorde por personagem

 if(!isTesting && !isAdmin){
    local = upd(local, row);
    if(lw.w !== wk()) lw = {w: wk(), rows: []};
    lw.rows = upd(lw.rows, row);
    
    if(ld.d !== dk()) ld = {d: dk(), rows: []};
    ld.rows = upd(ld.rows, row);
    
    try{
      localStorage.setItem('brs48cr_lb', JSON.stringify(local));
      localStorage.setItem('brs48cr_lw', JSON.stringify(lw));
      localStorage.setItem('brs48cr_ld', JSON.stringify(ld));
    }catch(e){}
  }
  
  // V2.1.2: apenas o servidor confirma pontos e estrelas de partidas autenticadas.
  if(!enviarOnline)refresh();
  
clearTimeout(overTimer);
  overTimer = setTimeout(function(){
    $('over').hidden = false;
    celeb();
  }, 300); // 300ms para abrir rápido e responsivo
}
function hit(a,b){
  if(b.k==='cable'){
    var pMid = a.x + a.w * 0.5;
    if(pMid > b.x + b.w * 0.75) return false;
    var mx1 = 12, mx2 = 8, myTop = 5;
    return (a.x + a.w - mx1 > b.x) &&
           (a.x + mx2 < b.x + b.w) &&
           (a.y + a.h > b.y + myTop) &&
           (a.y < b.y + b.h);
  }
  var mx = 4, my = 4;
  return (a.x + a.w - mx > b.x) &&
         (a.x + mx < b.x + b.w) &&
         (a.y + a.h - my > b.y) &&
         (a.y + my < b.y + b.h);
}
function update(dt){
  frame+=dt;var s0=Math.min(5.5+frame*.0011,12)+Math.min(3,Math.max(0,score-5000)*.0003);sp=s0*SC;dist+=sp*dt;score+=s0*CFG.DIST_RATE*dt;

	// --- LÓGICA DO PAPARAZZI ---
  var curPapa = Math.floor(score / 2500); // Dispara a cada 2500 pontos exatos
  if(curPapa > window.lastPaparazzi && score > 0 && state === 'play') {
    window.lastPaparazzi = curPapa;
    window.flashAlpha = 1; // Ativa a cegueira branca no máximo (100%)
    if (sfx.photo) sfx.photo(); // Toca o sonzinho de foto!
  }

  // Faz a tela branca sumir gradativamente
  if (window.flashAlpha > 0) {
    window.flashAlpha -= dt * 0.035; // Velocidade em que o clarão apaga
    if (window.flashAlpha < 0) window.flashAlpha = 0;
  }

// Disparo a cada 1500 pontos
  var curPetMilestone = Math.floor(score / 1500);
  if(curPetMilestone > (window.lastPetMilestone || 0) && score > 0 && state === 'play'){
    window.lastPetMilestone = curPetMilestone;
    
    // Algoritmo sem repetição (Shuffle Bag)
    if(!window.petBag || window.petBag.length === 0){
      var candidatos = ['tsu', 'lirika', 'pati'].filter(function(k){ return k !== window.lastPetKey; });
      if(s2DailyMode){
         for(var si=candidatos.length-1;si>0;si--){
           var sj=Math.floor(s2Rand()*(si+1)),tmp=candidatos[si];candidatos[si]=candidatos[sj];candidatos[sj]=tmp;
         }
       }else candidatos.sort(function(){ return Math.random() - 0.5; });
      candidatos.push(window.lastPetKey ? window.lastPetKey : (s2Rand() < 0.5 ? 'tsu' : 'pati'));
      window.petBag = candidatos;
    }
    var chosenPet = window.petBag.shift();
    window.lastPetKey = chosenPet;

    // Configuração do pet em voo
    window.activePetFly = {
      type: petCorridaTipo(chosenPet),   // Backstage⭐Pet!: quem voa é o seu pet ativo (sem pet adotado: o sorteado, como antes)
      x: W + 70,
      y: GY - 80,
      dropped: false
    };
  }

  // Atualização do Pet em voo
  if(window.activePetFly){
    window.activePetFly.x -= (sp * 1.35) * dt; // Voa um pouco mais rápido que a pista
    
    // Ponto onde ele larga os presentes (um pouco antes do meio da tela)
    if(!window.activePetFly.dropped && window.activePetFly.x <= W * 0.65){
      window.activePetFly.dropped = true;
	  petPresenteVoz(); // vozinha do seu pet ("nya~", "kyu~", "hmph!"); sem pet adotado continua o "Mew!" de antes
      var dropX = window.activePetFly.x;
      var dropY = window.activePetFly.y;
      sfx.card();
      toast = petPresenteMsg();   // "🎁 Mochi trouxe um presente!" (sem pet adotado: "Presente do Pet! 🎁")
      toastT = 75;
      
      // 15% de chance de Item Especial (Card com efeito ou Sorvete)
      if(s2Rand() < petCorridaChance()){   // 15% normal · 25% com o pet feliz · +5% no estágio Center
        var isCard = s2Rand() < 0.5;
        items.push({
          k: isCard ? 'card' : 'morango',
          x: dropX,
          y: dropY,
          w: isCard ? 18 : 22,
          h: isCard ? 18 : 22,
          got: false,
          ct: isCard ? (s2Rand() < 0.5 ? 'fever' : 'ima') : 'plain',
          petDrop: true
        });
      } else {
        // 85% de chance: 5 estrelas saindo direto do pet em arco
        for(var si = 0; si < 5; si++){
          items.push({
            k: 'star',
            x: dropX + (si * 28),
            y: dropY - Math.sin((si / 4) * Math.PI) * 25,
            w: 18,
            h: 18,
            got: false,
            ct: 'plain',
            petDrop: true
          });
        }
      }
    }
	  
    
    // Saiu da tela pela esquerda
    if(window.activePetFly.x < -60){
      window.activePetFly = null;
    }
  }

  
  var curUfo = Math.floor(score/CFG.UFO_EVERY);
  if(curUfo > lastUfo && score > 0 && state === 'play') {
    lastUfo = curUfo;
    items.push({k:'ufo', x: nextX + 150, y: GY - 100, w: 32, h: 20, got: false});
  }

var curMorango = Math.floor(score/3500); // Surge a cada 3500 pontos
  if(curMorango > (window.lastMorango||0) && score > 0 && state === 'play') {
    window.lastMorango = curMorango;
    items.push({k:'morango', x: nextX + 250, y: GY - 30, w: 22, h: 22, got: false});
  }

	var curMic = Math.floor(score/3000); // Surge a cada 3000 pontos (V2.1.3; antes 4000)
if(curMic > (window.lastMic||0) && score > 0 && state === 'play') {
  window.lastMic = curMic;
  items.push({k:'mic_unit', x: nextX + 300, y: GY - 55, w: 20, h: 20, got: false});
}

  if (pw && pw.k === 'alien') {
    var targetY = (GY - 115) + Math.sin(frame * 0.12) * 14;
    P.y += (targetY - P.y) * 0.12 * dt;
    P.vy = 0; P.air = true;
  } else {
    if(!held && P.vy < -1.5) P.vy *= 0.82;
    P.vy += ((held && P.vy < 0) ? .5 : .85) * dt;
    P.y += P.vy * dt;
    if(P.y >= GY - P.h){
      P.y = GY - P.h;
      P.vy = 0;
      P.air = false;
    }
  }

  obs.forEach(function(o){o.x-=sp*dt});items.forEach(function(o){o.x-=sp*dt});nextX-=sp*dt;
	fans.forEach(function(f){ f.x -= sp*dt });
    fans = fans.filter(function(f){ return f.x > -40 });
	items.forEach(function(it){
    if(it.petDrop){
      var dx=(P.x+15)-it.x, dy=(P.y+22)-it.y, d=Math.hypot(dx,dy)||1;
      if(d<260){ it.x += (dx/d)*9*dt; it.y += (dy/d)*9*dt; }
    }
  });
  obs=obs.filter(function(o){return o.x>-90});items=items.filter(function(o){return o.x>-40&&!o.got});
  if(nextX<W+40)spawn();
  
  if(pw){
    if(pw.k==='ima')items.forEach(function(it){var dx=P.x+15-it.x,dy=P.y+22-it.y,d=Math.hypot(dx,dy)||1;if(d<170&&it.k==='star'){it.x+=dx/d*7*dt;it.y+=dy/d*7*dt}});
 if((pw.t-=dt)<=0){
  if(pw.k==='alien' || pw.k==='gigante'){
      inv=150; // Garante escudo temporário de 2,5s ao sair do disco ou desinchar
      if(pw.k==='alien'){ P.air=true; P.vy=0; abducted=false; }
  }
  pw=null;
}
  }
  
  var pb={x:P.x,y:P.y,w:P.w,h:P.h};
  if(inv>0) inv-=dt;
  if(inv<=0 && !(pw && (pw.k==='alien' || pw.k==='gigante'))) {
    for(var i=0;i<obs.length;i++){
      if(hit(pb,obs[i])){
        if(shield){shield--;inv=90;sfx.hit();shake=8;toast=tr('Escudo usado!');toastT=80;break}
        end();return;
      }
    }
  }


items.forEach(function(it){
    var margemItem = it.k === 'ufo' ? 0 : -4;
    // Removida a trava de Alien, agora coleta suavemente sem bugar o loop!
    if(!it.got && pb.x + margemItem < it.x + it.w && pb.x + pb.w - margemItem > it.x && pb.y + margemItem < it.y + it.h && pb.y + pb.h - margemItem > it.y){
      it.got=true;
      if(it.k==='ufo'){
        score+=CFG.UFO_BONUS; pops.push({x:it.x,y:it.y,t:0,s:'+'+CFG.UFO_BONUS});
        pw={k:'alien',t:CFG.UFO_FRAMES};abducted=true;wasAbducted=true; toast=tr('Kimi wa Alien!'); toastT=110; sfx.ufo();
      } else if(it.k==='card'){
        score+=100;pops.push({x:it.x,y:it.y,t:0,s:'+100'});sfx.card();
        if(!pw || (pw.k!=='alien' && pw.k!=='gigante')){
            if(it.ct==='plain'){toast=tr('Card! +100')}else{pw={k:it.ct,t:480};toast=pw.k==='fever'?tr('Fever! Estrelas em dobro'):tr('Ímã de estrelas!')}
            toastT=110;
        }
      } else if(it.k==='morango'){
        score+=200; pops.push({x:it.x,y:it.y,t:0,s:'+200'}); sfx.card();
        window.wasGiant=true;
        if(!pw || pw.k!=='alien'){
          pw={k:'gigante',t:400}; inv=400; toast=tr('Mega TsuLiPa!'); toastT=110;
        }
      } else if (it.k === 'mic_unit') {
        score += 300; pops.push({x:it.x, y:it.y, t:0, s:'+300'});
        if (!pw || (pw.k !== 'alien' && pw.k !== 'gigante')) {
          var novoParceiro = getPartner(sel);
          pw = {k: 'unit', partner: novoParceiro, t: 900}; 
          window.wasUnit = novoParceiro;
          
          if(!window.collectedPartners) window.collectedPartners = [];
          if(window.collectedPartners.indexOf(novoParceiro) === -1) {
            window.collectedPartners.push(novoParceiro);
          }

          toast = tr('Unit Mode! Sinergia ✨'); toastT = 110; sfx.card();
        } else {   // V2.1.3: abduzido ou gigante — o poder continua, mas a parceira entra no palco do fim do show
          var parcX = getPartner(sel);
          if(!window.collectedPartners) window.collectedPartners = [];
          if(window.collectedPartners.indexOf(parcX) === -1) window.collectedPartners.push(parcX);
          sfx.card();
        }
      } else {
        var v=pw&&pw.k==='fever'?CFG.STAR_FEVER:CFG.STAR;
        if (pw && pw.k === 'unit') v *= 2; 
        if(pw&&pw.k==='alien') v=Math.round(v*CFG.UFO_STAR_MULT);
        score+=v;pops.push({x:it.x,y:it.y,t:0,s:'+'+v});stars++;sfx.star();
      }
    }
  });
  
  var r=rankOf(score);if(r>rankI){rankI=r;toast=tr('Subiu para ')+tr(RANKS[r][1])+'!';toastT=110;sfx.rank();if(r>=7){sash=true;shield=Math.min(2,shield+1);toast+=tr(' Escudo e look!')}}
  pops.forEach(function(p){p.t+=dt});pops=pops.filter(function(p){return p.t<40});if(toastT>0)toastT-=dt;abducted=!!(pw&&pw.k==='alien');sync();
}
function drawCity(arr,w,off,base,col,win,widthLimit){
  widthLimit = widthLimit || W;
  var o=-(off%w);
  for(var k=0;k<Math.ceil(widthLimit/w)+1;k++){
    arr.forEach(function(b,bi){
      var x=b.x+o+k*w;
      if(x>widthLimit||x+b.w<0)return;
      g.fillStyle=col;
      g.fillRect(x,base-b.h,b.w,b.h);
      if(win){
        g.fillStyle=win;
        var seed=(bi*37+Math.floor(b.s*100))|0;
        for(var r=0,yy=base-b.h+10;yy<base-10;yy+=14,r++){
          for(var c=0,xx=x+7;xx<x+b.w-9;xx+=12,c++){
            if(((c*7+r*13+seed)%7)<2) g.fillRect(xx,yy,4,5);
          }
        }
      }
    });
  }
}
function ufoDraw(x,y,k){
  g.save();g.translate(x,y);g.scale(k,k);
  var u=g.createRadialGradient(0,0,2,0,0,26);
  u.addColorStop(0,'rgba(182,255,59,.85)');u.addColorStop(.5,'rgba(182,255,59,.3)');u.addColorStop(1,'rgba(182,255,59,0)');
  g.fillStyle=u;g.beginPath();g.arc(0,0,26,0,7);g.fill();
  g.fillStyle='#9b30d9';g.beginPath();g.ellipse(0,0,16,6,0,0,7);g.fill();
  g.fillStyle='#b6ff3b';g.beginPath();g.ellipse(0,-3,9,6,0,Math.PI,0);g.fill();
  g.fillStyle='#4169e1';[[-9,0,2.5],[0,1,3],[9,0,2.5]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],p[2],0,7);g.fill()});
  g.restore();
}
function setPause(v){if(state!=='play')return;paused=v;$('pz').hidden=!v;$('pause').textContent=v?'▶':'⏸';sync();}
function drawBushes(off, baseY, widthLimit){
  baseY = baseY || GY; widthLimit = widthLimit || W;
  var step=46,base=Math.floor(off/step),o=off%step;
  g.fillStyle='rgba(16,64,44,.96)';g.fillRect(0,baseY-7,widthLimit,7);
  for(var j=-1;j<widthLimit/step+2;j++){
    var idx=base+j,a=(((idx*53)%7)+7)%7/7,x=j*step-o;
    function bb(cx,cy,r){g.beginPath();g.arc(cx,cy,r,0,7);g.fill()}
    g.fillStyle='rgba(16,64,44,.96)';bb(x+12,baseY-6,9+a*4);bb(x+26,baseY-8,11+a*3);bb(x+39,baseY-5,8+a*3);
    g.fillStyle='rgba(74,222,128,.2)';bb(x+22,baseY-13,5+a*2);bb(x+34,baseY-11,4);
  }
}
function drawProps(arr,w,off,base,widthLimit){
  widthLimit = widthLimit || W;
  var o=-(off%w);
  var sak=(frame/3600)%4<1||(frame/3600)%4>=3?'#ffb3e0':'#4ade80';
  for(var k=0;k<Math.ceil(widthLimit/w)+1;k++){
    arr.forEach(function(b){
      var x=b.x+o+k*w;
      if(x>widthLimit||x+b.w<0)return;
      if(b.type<0.45){
        g.fillStyle='#2d3748';g.fillRect(x+b.w/2-2,base-20,4,20);
        g.fillStyle=sak;
        g.beginPath();g.arc(x+b.w/2,base-24,11,0,7);g.fill();
        g.beginPath();g.arc(x+b.w/2-7,base-19,8,0,7);g.fill();
        g.beginPath();g.arc(x+b.w/2+7,base-19,8,0,7);g.fill();
      }else if(b.type<0.8){
        g.fillStyle='#1f2937';g.fillRect(x+b.w/2-1,base-b.h,2.5,b.h);
        g.fillRect(x+b.w/2-7,base-b.h,9,2.5);
        g.fillStyle='#fef08a';g.beginPath();g.arc(x+b.w/2-5,base-b.h+3,3,0,7);g.fill();
        g.fillStyle='rgba(254,240,138,0.18)';g.beginPath();g.arc(x+b.w/2-5,base-b.h+3,12,0,7);g.fill();
      }else{
        g.fillStyle='#1f2937';g.fillRect(x+b.w/2-1.5,base-16,3,16);
        g.fillStyle='rgba(56,189,248,0.75)';g.fillRect(x+b.w/2-14,base-30,28,14);
        g.strokeStyle='rgba(255,255,255,0.4)';g.lineWidth=1;g.strokeRect(x+b.w/2-14,base-30,28,14);
      }
    });
  }
}
var charPose = '';   // Foto 2.0 do Backstage⭐Pet!: '' = braços normais (corrida, menu e cartões continuam iguais)
function charDrawDarkColor(hex,amount){
 var raw=String(hex||'').replace(/^#/,'');
 return '#'+raw.replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-amount).toString(16)).substr(-2)});
}
function charDrawVerticalRamp(key,height,gradientHeight,top,bottom){
 var ramp=CHAR_DRAW_RAMP_CACHE.get(key);if(ramp)return ramp;
 var canvas=document.createElement('canvas');canvas.width=1;canvas.height=height;
 var ctx=canvas.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,gradientHeight);
 gradient.addColorStop(0,top);gradient.addColorStop(1,bottom);ctx.fillStyle=gradient;ctx.fillRect(0,0,1,height);
 ramp={canvas:canvas,top:top,bottom:bottom};
 if(CHAR_DRAW_RAMP_CACHE.size>=64)CHAR_DRAW_RAMP_CACHE.delete(CHAR_DRAW_RAMP_CACHE.keys().next().value);
 CHAR_DRAW_RAMP_CACHE.set(key,ramp);return ramp;
}
function charDrawHairRamp(color){
 var key='hair|'+String(color||''),ramp=CHAR_DRAW_RAMP_CACHE.get(key);
 if(ramp)return ramp;
 var dark=charDrawDarkColor(color,60),made=charDrawVerticalRamp(key,25,19,color,dark);
 made.dark=dark;return made;
}
function charDrawStreakRamp(color){
 var key='streak|'+String(color||''),ramp=CHAR_DRAW_RAMP_CACHE.get(key);
 if(ramp)return ramp;
 return charDrawVerticalRamp(key,10,10,color,charDrawDarkColor(color,60));
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
  var sl=(b==='longo'||b==='chanel'||b==='onduladof'||((b===''||b==='pixie'||b==='onduladom'||b==='onduladom2')?false:(f==='reta'||f==='arcoiris')))?(b==='onduladof'?9:14):(b==='onduladom'||b==='onduladom2'?7:(b==='pixie'?5:((b===''&&(f==='reta'||f==='arcoiris'))?10:6)));
  function E(cx,cy,rx,ry,r){g.beginPath();g.ellipse(cx,cy,rx,ry,r||0,0,7);g.fill()}
  function T(a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();g.fill()}
  var HD='#'+H.replace(/^#/,'').replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-60).toString(16)).substr(-2)});
  g.fillStyle=HD;
  if(b==='chanel'){g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-2,y+30,x+5,y+31);g.lineTo(x+25,y+31);g.quadraticCurveTo(x+32,y+30,x+28,y+13);g.fill()}
  else if(b==='longo'){g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-4,y+34,x+3,y+41);g.lineTo(x+27,y+41);g.quadraticCurveTo(x+34,y+34,x+28,y+13);g.fill()}
  else if(b==='marias'){E(x+1,y+8,4,4);E(x+29,y+8,4,4);E(x-2,y+18,4.6,10.5,.18+sw*.03);E(x-1.5,y+26,3.2,7,.25+sw*.03);E(x+32,y+18,4.6,10.5,-.18-sw*.03);E(x+31.5,y+26,3.2,7,-.25-sw*.03);g.fillStyle='#e0457b';E(x+.5,y+9.5,2.2,1.6,.5);E(x+29.5,y+9.5,2.2,1.6,-.5)}
  else if(b==='rabo'){var rs=sw*.5;g.beginPath();g.moveTo(x+24,y+4);g.quadraticCurveTo(x+37,y+7+rs,x+33.5,y+20+rs);g.quadraticCurveTo(x+31.5,y+28+rs,x+27,y+33+rs);g.quadraticCurveTo(x+29.5,y+21+rs,x+24.5,y+12);g.closePath();g.fill();g.fillStyle='#e0457b';E(x+27,y+6,2.4,1.8,.7)}
    else if(b===''){g.beginPath();g.arc(x+15,y+12,13.2,Math.PI,0);g.lineTo(x+28.2,y+20);g.lineTo(x+25,y+22);g.lineTo(x+5,y+22);g.lineTo(x+1.8,y+20);g.closePath();g.fill()}   // Curto: reforço ao redor do cabelo
  else if(b==='pixie'){T([x+4,y+10,x+0,y+17,x+3,y+19,x+2,y+24,x+8,y+21,x+9,y+14]);T([x+26,y+10,x+30,y+17,x+27,y+19,x+28,y+24,x+22,y+21,x+21,y+14]);T([x+9,y+22,x+15,y+28,x+21,y+22])}   // Pixie: pontas repicadas  
  else if(TWAvatarHair.back(g,c,x,y,b,E,T)){}
  else if(b==='cacheado'){[[15,3],[4,8],[26,8],[1,17],[29,17],[3,26],[27,26]].forEach(function(p){E(x+p[0],y+p[1]+6,8,8)})}
  if(OF===3){g.fillStyle='#b01e3a';T([x+5,y+22,x-8+sw,y+42,x+9,y+40])}
  if(OF===5){g.fillStyle='rgba(255,252,235,.95)';E(x-4,y+27,5,13,-.5+sw*.04);E(x+34,y+27,5,13,.5-sw*.04);g.fillStyle='rgba(255,226,140,.8)';E(x-2,y+30,3,9,-.5+sw*.04);E(x+32,y+30,3,9,.5-sw*.04)}
  g.fillStyle='#1c1c30';g.fillRect(x+9,y+36+(up?0:-2),5,8+(up?0:2));g.fillRect(x+17,y+36+(up?-2:0),5,8+(up?2:0));
  g.fillStyle=OUT[1];g.fillRect(x+7,y+32,16,6);
  
  var AL = (PX && PX.k === 'alien');
  var roupa = AL ? 'espacial' : (OF > 0 ? '' : (c.out || ''));

  if(roupa==='seifuku'){
    g.fillStyle=corDaRoupa;g.fillRect(x+4,y+22,22,12); 
    g.fillStyle='#1b2a5e';T([x+4,y+22, x+26,y+22, x+15,y+29]); 
    g.fillStyle=corDaRoupa;T([x+10,y+22, x+20,y+22, x+15,y+27]); 
    g.fillStyle='#e02a4a';E(x+15,y+27,2,2); T([x+15,y+27, x+12,y+31, x+14,y+32]); T([x+15,y+27, x+18,y+31, x+16,y+32]); 
  }else if(roupa==='y2k'){
    g.fillStyle='#111';g.fillRect(x+7,y+22,16,6); 
    g.fillStyle=c.skin;g.fillRect(x+7,y+28,16,4); 
    g.fillStyle=corDaRoupa;g.fillRect(x+3,y+22,6,12);g.fillRect(x+21,y+22,6,12); // Pinta as mangas e o blazer da cor escolhida
    g.fillRect(x+7,y+22,3,10);g.fillRect(x+20,y+22,3,10); 
  }else if(roupa==='citypop'){
    g.fillStyle='#111827'; g.fillRect(x+7, y+22, 16, 12);
    g.fillStyle='#fff'; g.fillRect(x+7, y+32, 16, 2);
    g.fillStyle=corDaRoupa; g.fillRect(x+2, y+22, 6, 12); g.fillRect(x+22, y+22, 6, 12); g.fillRect(x+7, y+22, 4, 11); g.fillRect(x+19, y+22, 4, 11); // Pinta o paletó da cor escolhida
    g.fillStyle='#34d399'; g.fillRect(x+11, y+22, 8, 5);
    g.fillStyle='#fbbf24'; g.fillRect(x+17, y+28, 2, 2);

}else if(roupa==='zipper'){
    // Shortinhos brancos bufantes por baixo
    g.fillStyle='#fff'; g.fillRect(x+6, y+31, 18, 7);
    
    // Saia aberta na frente (duas abas laterais) — por baixo do top (V2.1.3)
    g.fillStyle=corDaRoupa;
    T([x+4, y+30, x+12, y+30, x+2, y+42]); // Aba caindo para a esquerda
    T([x+26, y+30, x+18, y+30, x+28, y+42]); // Aba caindo para a direita
    
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
    g.fillRect(x+5, y+29, 20, 3);

} else if(roupa==='sweet'){
    // --- INÍCIO DO LOOK VALENTINE (SWEET) ---
    g.fillStyle = corDaRoupa;
    T([x + 2, y + 33, x + 28, y + 33, x + 34, y + 43, x - 2, y + 43]); // Saia Rodada (por baixo do vestido, V2.1.3)
    g.fillStyle = '#ffffff';   // Babado de chantilly
    T([x - 1.2, y + 41, x + 31.2, y + 41, x + 34, y + 43, x - 2, y + 43]);
    for (var cq = 0; cq < 9; cq++) { g.beginPath(); g.arc(x - 0.4 + cq * 4, y + 43, 2, 0, Math.PI); g.fill(); }

    g.fillStyle = corDaRoupa; 
    g.fillRect(x + 4, y + 22, 22, 12); // Base do vestido

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
    g.fillStyle=corDaRoupa;g.fillRect(x+4,y+22,22,12);g.fillStyle='#4a5170';g.fillRect(x+4,y+22,3,12);g.fillRect(x+23,y+22,3,12);
    g.fillStyle='#1b2a5e';g.fillRect(x+14,y+22,3,10);
  }

  // Efeitos de Fever/Ímã e Pele
  if(PX&&(PX.k==='fever'||PX.k==='ima')){g.fillStyle=PX.k==='fever'?'#ffe14d':'#fff';g.fillRect(x+9,y+27,3,3);g.fillRect(x+10,y+26,1,5);g.fillRect(x+8,y+28,5,1)}
  g.fillStyle=c.skin;
  if(!charPose){ g.fillRect(x+1,y+24,4,9);g.fillRect(x+25,y+24,4,9); }   // com pose, os braços vêm depois das roupas (V2.1.2)

  // Mangas bufantes por cima dos braços
  if(roupa === 'sweet' || roupa === 'zipper'){
    g.fillStyle = (roupa === 'sweet') ? '#ffffff' : corDaRoupa; 
    E(x + 1.5, y + 24.5, 4, 4);  
    E(x + 28.5, y + 24.5, 4, 4); 
  }

  if(OF===1){g.fillStyle=PX?OUT[1]:'#2a3f8a';T([x+6,y+31,x+24,y+31,x+27,y+39,x+3,y+39]);g.fillStyle=PX?OUT[0]:'#2a3f8a';g.fillRect(x+5,y+22,20,10);g.fillStyle='#fff';T([x+8,y+22,x+22,y+22,x+15,y+31]);g.fillStyle=PX?OUT[0]:'#2a3f8a';T([x+11,y+22,x+19,y+22,x+15,y+27]);g.fillStyle='#e02a4a';E(x+15,y+28,2.4,2.4);T([x+15,y+28,x+11,y+32,x+13,y+33]);T([x+15,y+28,x+19,y+32,x+17,y+33]);g.fillStyle='#fff';g.fillRect(x+3,y+38,24,1.2)}
  if(OF===2){g.fillStyle=PX?OUT[0]:'#fff0f7';T([x+5,y+22,x+25,y+22,x+29,y+40,x+1,y+40]);g.fillStyle='#ffd23f';g.fillRect(x+4,y+31,22,2);g.fillRect(x+5,y+22,20,1.5);g.fillStyle='#ff4f9a';T([x+15,y+26,x+9,y+22,x+9,y+30]);T([x+15,y+26,x+21,y+22,x+21,y+30]);E(x+15,y+26,2,2);g.fillStyle='rgba(255,230,120,'+(.4+.5*Math.sin(frame*.2))+')';g.fillRect(x+6,y+37,2,2);g.fillRect(x+22,y+35,2,2);g.fillRect(x+14,y+38,2,2)}
  if(OF===3){g.fillStyle=PX?OUT[0]:'#1b2a5e';g.fillRect(x+4,y+22,22,12);g.fillStyle='#fff';T([x+12,y+22,x+18,y+22,x+15,y+28]);g.fillStyle='#ffd23f';g.fillRect(x+2,y+22,7,3);g.fillRect(x+21,y+22,7,3);E(x+15,y+30,1,1);E(x+11,y+31,1,1);E(x+19,y+31,1,1);g.fillStyle=PX?OUT[1]:'#1b2a5e';g.fillRect(x+7,y+32,16,6);g.fillStyle='#ffd23f';g.fillRect(x+7,y+37,16,1.4)}
  if(OF===4){g.fillStyle=PX?OUT[1]:'#1a1426';T([x+6,y+31,x+24,y+31,x+28,y+39,x+2,y+39]);g.fillStyle=PX?OUT[0]:'#1a1426';g.fillRect(x+5,y+22,20,10);g.fillStyle='#ffd23f';g.fillRect(x+2,y+38,26,1.6);g.fillRect(x+13,y+22,4,10);g.fillStyle='#fff';T([x+12,y+22,x+18,y+22,x+15,y+27]);g.fillStyle='#ff3d5e';E(x+15,y+29,1.8,1.8);g.fillStyle='#ffd23f';g.fillRect(x+4,y+22,5,2);g.fillRect(x+21,y+22,5,2)}
  if(OF===5){g.fillStyle=PX?OUT[0]:'#fffdf2';T([x+4,y+22,x+26,y+22,x+30,y+42,x,y+42]);g.fillStyle='#ffd23f';g.fillRect(x+13,y+22,4,20);g.fillRect(x,y+40,30,2);g.fillStyle='rgba(255,226,140,'+(.5+.4*Math.sin(frame*.2))+')';g.fillRect(x+7,y+29,2,2);g.fillRect(x+22,y+34,2,2);g.fillRect(x+10,y+38,2,2)}
  
  roupaSombra(x, y);   // V2.1.3: luz e sombra nas roupas (igual ao degradê do cabelo)
  if(sash&&state!=='menu'&&!isPartner&&!(PX&&PX.k==='alien')){g.strokeStyle='#ff4f9a';g.lineWidth=4;g.beginPath();g.moveTo(x+5,y+22);g.lineTo(x+24,y+34);g.stroke()}
  if(charPose){ g.fillStyle=c.skin; petPoseArms(c, x, y); }   // pose da Foto 2.0 por cima da roupa e da faixa
  g.fillStyle=c.skin;g.fillRect(x+12,y+18,6,6);g.save();g.translate(0,-4);
  
  // As orelhas ficam por trás do cabelo; a base é mais baixa para não cobrir a franja.
  if(d==='coelho'){[[9.5,-.2],[20.5,.2]].forEach(function(p){g.save();g.translate(x+p[0],y+1);g.rotate(p[1]);g.fillStyle='#fff';g.beginPath();g.ellipse(0,-5,3.4,9,0,0,7);g.fill();g.fillStyle='rgba(255,150,190,.9)';g.beginPath();g.ellipse(0,-4,1.6,6.5,0,0,7);g.fill();g.restore();});}
  if(d==='gato'){g.fillStyle=H;T([x+3,y+9,x+6,y-4,x+13,y+4]);T([x+27,y+9,x+24,y-4,x+17,y+4]);g.fillStyle='rgba(255,150,190,.8)';T([x+6,y+6,x+7,y,x+10,y+4]);T([x+24,y+6,x+23,y,x+20,y+4])}
  if(d==='chifres'){g.fillStyle='#7a1f2b';T([x+4,y+8,x+1,y-6,x+10,y+3]);T([x+26,y+8,x+29,y-6,x+20,y+3])}
  if(d==='coques'){g.fillStyle=H;E(x+4,y+3,6,6);E(x+26,y+3,6,6);g.fillStyle='#2a5bd7';g.fillRect(x+1,y+6,7,3);g.fillRect(x+22,y+6,7,3)}
  g.fillStyle=c.skin;E(x+15,y+17,11,11);
  if(d==='elfo'){T([x+4,y+17,x-3,y+10,x+5,y+21]);T([x+26,y+17,x+33,y+10,x+25,y+21])}
  if(d==='olheiras'){g.fillStyle='rgba(130,70,90,0.3)'; g.beginPath(); g.ellipse(x+11.5, y+22.5, 3, 1.2, 0, 0, 7); g.ellipse(x+19.5, y+22.5, 3, 1.2, 0, 0, 7); g.fill();}
  
  if(hacc==='bandaid'){g.fillStyle='#d97706'; g.fillRect(x+6, y+21, 7, 4); g.fillStyle='#fcd34d'; g.fillRect(x+6.5, y+21.5, 6, 3); g.fillStyle='#fff'; g.fillRect(x+8, y+22, 3, 2);}

  var hg=g.createLinearGradient(0,y+5,0,y+24);hg.addColorStop(0,H);hg.addColorStop(1,HD);g.fillStyle=hg;
  if(TWAvatarHair.isWavy(b))TWAvatarHair.top(g,x,y,b);else{g.beginPath();g.arc(x+15,y+12,12,Math.PI,0);g.fill();}
  g.fillRect(x+3,y+11.5,4,sl+0.5);g.fillRect(x+23,y+11.5,4,sl+0.5); // +0.5 elimina qualquer fresta entre o topo e as costeletas
  
  if(b===''||b==='pixie'){   // pontas arredondadas nas laterais
    g.fillStyle=hg; E(x+5,y+12+sl,2,2.2); E(x+25,y+12+sl,2,2.2);
  }

  g.save();   // franjas ficam dentro do contorno redondo da cabeça (sem cantos quadrados); a espetada pode passar para fora
  if(f!=='espetada'){ g.beginPath(); g.arc(x+15,y+12,12,Math.PI,0); g.lineTo(x+27,y+30); g.lineTo(x+3,y+30); g.closePath(); g.clip(); }

  g.fillStyle=hg;
  if(TWAvatarHair.fringe(g,x,y,b,f,T)){}
  else if(f==='bagunca')T([x+3,y+11,x+8,y+19,x+11,y+10,x+16,y+17,x+20,y+9,x+24,y+16,x+27,y+10,x+27,y+9,x+3,y+9]);
  else if(f==='reta')g.fillRect(x+3,y+8,24,6);
  else if(f==='lateral')T([x+3,y+12,x+7,y+8,x+27,y+8,x+27,y+19,x+17,y+11]);
  else if(f==='espetada')T([x+3,y+10,x+3,y+5,x+7,y-5,x+11,y+3,x+15,y-8,x+19,y+3,x+24,y-5,x+27,y+5,x+27,y+10]);
  else if(f==='arcoiris'){
    g.fillRect(x+3,y+6,24,8);
    var cols = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7'];
    for(var idx=0; idx<6; idx++){
      g.fillStyle=cols[idx];
      g.fillRect(x+4 + (idx*3.6), y+6, 3.8, 9 + (idx%3===1?1:0));
    }
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
  
  if(hacc==='boina'){g.fillStyle='#e02a4a';g.beginPath();g.ellipse(x+15,y+2,11,4,-0.15,0,7);g.fill();g.fillStyle='#111';g.fillRect(x+14,y-4,2,2);}
  if(hacc==='palha'){ // palha leve sobre o cabelo: aba fina, copa curva e fita floral TsuLiPa
    g.fillStyle='#e7bf74';g.beginPath();g.ellipse(x+15,y+4.5,14.6,2.75,-.06,0,7);g.fill();
    g.fillStyle='#f7dc9b';g.beginPath();g.moveTo(x+8,y+3);g.lineTo(x+9,y-5);g.quadraticCurveTo(x+10,y-8,x+15,y-8);g.quadraticCurveTo(x+20,y-8,x+21,y-5);g.lineTo(x+22,y+3);g.closePath();g.fill();
    g.strokeStyle='#e2b970';g.lineWidth=.55;g.beginPath();g.moveTo(x+9,y-5);g.quadraticCurveTo(x+15,y-7.5,x+21,y-5);g.stroke();
    g.fillStyle='#9b30d9';g.fillRect(x+8.4,y+.4,13.2,1.65);
    g.fillStyle='#b6ff3b';g.fillRect(x+13,y+.4,3,1.65);g.fillStyle='#4169e1';g.fillRect(x+17,y+.4,3,1.65);
    g.fillStyle='#f9df9d';g.beginPath();g.ellipse(x+15,y+4.4,15.2,2.25,-.06,0,7);g.fill();
    g.strokeStyle='rgba(172,121,55,.48)';g.lineWidth=.6;g.beginPath();g.ellipse(x+15,y+4.4,15.2,2.25,-.06,0,7);g.stroke();
    g.strokeStyle='rgba(177,130,59,.35)';g.lineWidth=.45;g.beginPath();g.moveTo(x+7,y-2);g.lineTo(x+20,y-2);g.moveTo(x+10,y-4);g.lineTo(x+19,y-4);g.stroke();
    g.fillStyle='#9b30d9';E(x+22,y+2.8,1.9,1.45);g.fillStyle='#fff3b2';E(x+22,y+2.8,.7,.7);
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
  if(expr===1){
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

  g.fillStyle='rgba(255,111,181,.5)';g.fillRect(x+7,y+22,4,2);g.fillRect(x+21,y+22,4,2);

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
      for(var q = 0; q < 10; q++){ var rr = q % 2 ? 1.8 : 4.2, an = q * Math.PI / 5 - Math.PI / 2; ctx[q ? 'lineTo' : 'moveTo'](8 + Math.cos(an) * rr, -10 + Math.sin(an) * rr); }
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
function curPal(){var t=frame/3600,i=Math.floor(t)%4,f=t-Math.floor(t),b=f>.75?(f-.75)/.25:0;b=b*b*(3-2*b);var a=PALR[i],c=PALR[(i+1)%4];for(var k=0;k<a.length;k++){var v=a[k],w=c[k];CURPAL_CACHE[k]='rgb('+Math.round(v[0]+(w[0]-v[0])*b)+','+Math.round(v[1]+(w[1]-v[1])*b)+','+Math.round(v[2]+(w[2]-v[2])*b)+')';}return CURPAL_CACHE;}
function GLc(){return lastS>=30000?'255,215,90':'255,225,245'}
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
function drawSafe(ctx, fn) {
  ctx.save();
  try {
    fn();
  } finally {
    ctx.restore();
  }
}
function makeShare(){
  var W2=600,H2=760,c2=document.createElement('canvas');c2.width=W2;c2.height=H2;var x2=c2.getContext('2d'),og=g,Q=curPal(),i;
  var sk=x2.createLinearGradient(0,0,0,H2);sk.addColorStop(0,Q[0]);sk.addColorStop(1,Q[1]);x2.fillStyle=sk;x2.fillRect(0,0,W2,H2);
  
g = x2;
for(var b = 0; b < 15; b++){
  var bh = 60 + (b * 87 % 140);
  var bx = b * 45 - 20;
  g.fillStyle = b % 2 ? Q[2] : Q[3];
  g.fillRect(bx, H2 - 60 - bh, 46, bh);
  g.fillStyle = 'rgba(255,235,150,0.3)';
  if(b % 3 !== 0){
    for(var wy = H2 - 60 - bh + 15; wy < H2 - 70; wy += 22){
      g.fillRect(bx + 8, wy, 8, 8);
      g.fillRect(bx + 26, wy, 8, 8);
    }
  }
}
g = og;

  
  x2.fillStyle=Q[6];x2.fillRect(0,H2-60,W2,60);x2.fillStyle=Q[7];x2.fillRect(0,H2-60,W2,4);
  
  if(wasAbducted){
     g=x2; g.save(); g.translate(520, 270); g.scale(2.6, 2.6);
     var ufoG = g.createRadialGradient(0, 0, 2, 0, 0, 26);
     ufoG.addColorStop(0, 'rgba(182, 255, 59, 0.85)'); ufoG.addColorStop(0.5, 'rgba(182, 255, 59, 0.3)'); ufoG.addColorStop(1, 'rgba(182, 255, 59, 0)');
     g.fillStyle = ufoG; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
     g.shadowColor = '#b6ff3b'; g.shadowBlur = 14;
     g.fillStyle='#9b30d9'; g.beginPath(); g.ellipse(0, 0, 16, 6, 0, 0, 7); g.fill(); 
     g.fillStyle='#b6ff3b'; g.beginPath(); g.ellipse(0, -3, 9, 6, 0, Math.PI, 0); g.fill(); g.shadowBlur = 0;
     g.fillStyle='#4169e1'; g.beginPath(); g.arc(-9,0,2.5,0,7); g.fill(); g.beginPath(); g.arc(0,1,3,0,7); g.fill(); g.beginPath(); g.arc(9,0,2.5,0,7); g.fill(); 
     g.restore(); g=og;
  }

if (window.wasGiant) {
    g = x2; g.save(); g.translate(80, 270); g.scale(3.2, 3.2); g.rotate(-0.2);
    g.shadowColor = '#ff6fb5'; g.shadowBlur = 15;
    g.fillStyle='#d97706'; g.beginPath(); g.moveTo(-6,2); g.lineTo(6,2); g.lineTo(0,14); g.fill(); 
    g.fillStyle='#ff6fb5'; g.beginPath(); g.arc(0,-1,7,0,7); g.fill(); 
    g.beginPath(); g.arc(-4,2,4,0,7); g.fill(); g.beginPath(); g.arc(4,2,4,0,7); g.fill(); 
    g.fillStyle='#fff'; g.fillRect(-2,-3,2,2); g.fillRect(2,-1,2,2); g.fillStyle='#4dd8ff'; g.fillRect(-1,-6,2,2);
    g.restore(); g = og;
}
  
  var cn=x2.createLinearGradient(0,0,0,H2-60);cn.addColorStop(0,'rgba(255,255,255,.4)');cn.addColorStop(1,'rgba(255,255,255,0)');x2.fillStyle=cn;x2.beginPath();x2.moveTo(255,0);x2.lineTo(345,0);x2.lineTo(500,H2-60);x2.lineTo(100,H2-60);x2.fill();
  var rg=x2.createRadialGradient(300,560,10,300,560,230);rg.addColorStop(0,'rgba('+GLc()+',.6)');rg.addColorStop(1,'rgba(255,160,220,0)');x2.fillStyle=rg;x2.fillRect(0,0,W2,H2);
  for(i=0;i<16;i++){var px=300+Math.cos(i*1.7)*(130+i%4*22),py=560+Math.sin(i*2.3)*(110+i%3*20),sz=4+i%3*3;x2.fillStyle=i%2?'#ffe14d':'#ff9ccd';x2.fillRect(px-sz,py-1,sz*2,2);x2.fillRect(px-1,py-sz,2,sz*2)}
  
g=x2;g.save();
    if (window.wasGiant) {
      g.translate(300, H2-240);
      g.scale(1.15, 1.15); 
      g.translate(-300, -(H2-240)); 
      
      var hg = g.createRadialGradient(300, H2-160, 20, 300, H2-160, 160);
      hg.addColorStop(0, 'rgba(255,111,181,0.6)'); 
      hg.addColorStop(1, 'rgba(255,111,181,0)');
      g.fillStyle = hg; 
      g.beginPath(); 
      g.arc(300, H2-160, 160, 0, 7); 
      g.fill();
    }
    
   // Fecha o save aberto antes do wasGiant para não acumular transformações
    g.restore();

    var chaoY = H2 - 60; // Linha exata do chão do palco (700)
    var centroPalcoX = 300;
    // Filtra para garantir que o Oshi principal nunca se repita na lista de parceiros
    var partners = (window.collectedPartners || []).filter(function(id) { return id !== sel; });

    // Helper para desenhar qualquer idol com os pés cravados no chão e centralizado no X desejado
    function drawOnStage(charObj, centerX, sc, yOffset, expr) {
      var drawX = centerX - (15 * sc);
      var drawY = chaoY - (44 * sc) + (yOffset || 0);
      var eu = charObj === CH[sel];
      petCharFoto(x2, drawX, drawY, sc, function(){   // contorno suave (V2.1.2); o seu personagem com pose e expressão escolhidas
        if(eu) charPose = petPhPose;
        drawChar(charObj, 0, 0, 1, eu ? petPhExprVal(expr) : expr, !eu);
      });
      g = og;
    }

    if (sel === 3 && partners.length >= 3) {
      // --- CASO 1: QUARTETO SHINY (Você + Tsu, Lirika e Pati grandes e alinhados!) ---
      var scQ = 3.5; // Bonecos grandes (154px de altura) e sem colidir!

      // Aura Shiny Mágica atrás do Quarteto no palco
      var shinyG = x2.createRadialGradient(centroPalcoX, chaoY - 90, 20, centroPalcoX, chaoY - 90, 220);
      shinyG.addColorStop(0, 'rgba(182, 255, 59, 0.55)');
      shinyG.addColorStop(0.5, 'rgba(155, 48, 217, 0.40)');
      shinyG.addColorStop(1, 'rgba(65, 105, 225, 0)');
      x2.fillStyle = shinyG;
      x2.fillRect(40, chaoY - 260, 520, 260);

      // Desenha os 4 membros bem distribuídos no palco (distância de 118px entre cada centro)
      drawOnStage(CH[partners[0]], centroPalcoX - 177, scQ, 0, 2);
      drawOnStage(CH[partners[1]], centroPalcoX - 59,  scQ, -4, 2);
      drawOnStage(CH[partners[2]], centroPalcoX + 177, scQ, 0, 2);
      // Você com destaque no centro-direita
      drawOnStage(CH[sel],         centroPalcoX + 59,  scQ, -6, finalExpr);

      x2.save();
      x2.textAlign = 'center';
      x2.shadowColor = 'rgba(255, 111, 181, 0.85)';
      x2.shadowBlur = 14;
      x2.font = '30px sans-serif';
      x2.fillText('✨', 120, 125); x2.fillText('💖', 145, 170); x2.fillText('🎶', 95, 215); x2.fillText('🎤', 155, 250);
      x2.fillText('✨', 480, 125); x2.fillText('⭐', 455, 170); x2.fillText('💖', 505, 215); x2.fillText('🎵', 445, 250);

      // Corações e brilhos levitando em arco bem ACIMA das coroas/cabeças de cada membro!
      var topY = chaoY - (44 * scQ) - 55;
      var heartMap = ['💜', '💚', '💙', '💖'];
      x2.font = '28px sans-serif';
      x2.fillText(heartMap[partners[0]], centroPalcoX - 177, topY + 6);
      x2.fillText(heartMap[partners[1]], centroPalcoX - 59,  topY - 8);
      x2.fillText('💖',                  centroPalcoX + 59,  topY - 12);
      x2.fillText(heartMap[partners[2]], centroPalcoX + 177, topY + 6);
      
      x2.font = '20px sans-serif';
      x2.fillText('✨', centroPalcoX - 118, topY - 22);
      x2.fillText('👑', centroPalcoX,       topY - 30);
      x2.fillText('✨', centroPalcoX + 118, topY - 22);
      x2.restore();

          } else if (partners.length >= 2) {
      // --- CASO 2: TRIO ---
      var scT = 4.2;
      var esp = 145;   // distância entre os centros
      drawOnStage(CH[partners[0]], centroPalcoX - esp, scT, 0, 2);
      drawOnStage(CH[sel],         centroPalcoX,       scT, -4, finalExpr);
      drawOnStage(CH[partners[1]], centroPalcoX + esp, scT, 0, 2);

      x2.save();
      x2.textAlign = 'center';
      x2.textBaseline = 'alphabetic';
      x2.shadowColor = 'rgba(255, 111, 181, 0.85)';
      x2.shadowBlur = 14;
      x2.font = '30px sans-serif';
      var topY = chaoY - (44 * scT) - 45;
      var heartMap = ['💜', '💚', '💙', '💖']; // Tsu, Lirika, Pati, Você

      x2.fillText(heartMap[partners[0]], centroPalcoX - esp, topY + 8);
      x2.fillText(heartMap[sel],         centroPalcoX,       topY - 6);
      x2.fillText(heartMap[partners[1]], centroPalcoX + esp, topY + 8);

      x2.font = '20px sans-serif';
      x2.fillText('✨', centroPalcoX - esp / 2, topY - 18);
      x2.fillText('✨', centroPalcoX + esp / 2, topY - 18);
      x2.restore();

    } else if (partners.length === 1) {
      // --- CASO 3: DUPLA (Oshi + 1 parceiro) ---
      var scD = 4.7;
      drawOnStage(CH[partners[0]], centroPalcoX - 85, scD, 0, 2);
      drawOnStage(CH[sel],         centroPalcoX + 85, scD, -4, finalExpr);

      x2.fillStyle = '#fff';
      x2.font = '22px sans-serif';
      x2.textAlign = 'center';
      x2.fillText('🎶 ✨ 🎶', centroPalcoX, chaoY - (44 * scD) - 25);

    } else {
      // --- CASO 4: SOLO ---
      drawOnStage(CH[sel], centroPalcoX, 5.2, 0, finalExpr);
    }
    g = og;
    petPalco(x2, 540, chaoY + 2, 2.6, frame);   // seu pet comemorando no palco (Backstage⭐Pet!)
  
    // Textos informativos do Pôster de Fim de Jogo
    var t = typeof tr === 'function' ? tr : function(w){return w;};
    x2.textAlign='center';x2.shadowColor='rgba(0,0,0,.5)';x2.shadowBlur=12;x2.fillStyle='#fff';
    var ttl='TsuLiPa⭐World · Center⭐Run!',tfs=36;do{x2.font='800 '+tfs+'px "M PLUS Rounded 1c",sans-serif';tfs--}while(x2.measureText(ttl).width>500&&tfs>20);x2.fillText(ttl,300,64);
    x2.font='400 16px "M PLUS Rounded 1c",sans-serif';x2.fillStyle='#ff9ccd';x2.fillText('センターラン',300,95);
    
    x2.fillStyle='#fff';x2.font='700 38px "M PLUS Rounded 1c",sans-serif';x2.fillText(nick||t('Anônimo'),300,130);
    x2.font='800 95px "M PLUS Rounded 1c",sans-serif';x2.fillText(String(lastS),300,225);
    x2.font='700 26px "M PLUS Rounded 1c",sans-serif';x2.fillText(t('pontos'),300,265);
    x2.fillStyle='#ffe14d';x2.fillText('★ '+stars+' '+t('estrelas'),300,300);
    
    x2.fillStyle='#ffe14d';x2.font='800 34px "M PLUS Rounded 1c",sans-serif';
    var currentRankId=rankOf(lastS);x2.fillText(t(RANKS[currentRankId][1]),300,345);
    
    // Texto de rodapé seguro dentro da margem inferior da imagem
    x2.shadowBlur=0;x2.fillStyle='rgba(255,255,255,.9)';x2.font='700 16px "M PLUS Rounded 1c",sans-serif';
    x2.fillText(t('Jogue também e entre no ranking!'),300,H2-44);
    petShareMoldura(x2, W2, H2);   // moldura na cor do Oshi + data (V2.1.2)
  
  return c2.toDataURL('image/png');
}
function draw(){
  var P2=curPal();
  if(s2ArtActive()){
    g.save();
    if(shake>0){g.translate(rnd(-shake,shake)/2,rnd(-shake,shake)/2);shake-=1;}
    s2DrawSceneryBg();
    s2DrawSceneryFloor();
  } else {
  var P2=curPal(),sk=g.createLinearGradient(0,0,0,GY);sk.addColorStop(0,P2[0]);sk.addColorStop(1,P2[1]);g.fillStyle=sk;g.fillRect(0,0,W,H);for(var si=0;si<36;si++){g.globalAlpha=.25+.25*Math.sin(frame*.04+si*1.7);g.fillStyle='#fff';g.fillRect((si*97)%W,(si*53)%Math.max(40,GY-170)+8,2,2)}g.globalAlpha=1;
  cenaNuvens(P2); cenaPassaros(P2);   // cenário vivo (V2.2)
  g.save();if(shake>0){g.translate(rnd(-shake,shake)/2,rnd(-shake,shake)/2);shake-=1}
  
  g.fillStyle=P2[2];g.fillRect(0,GY-16,W,16);
  drawCity(far,farW,dist*.15,GY-10,P2[2],P2[4].replace('rgb(','rgba(').replace(')',',.25)'));
  drawCity(near,nearW,dist*.35,GY,P2[3],P2[5].replace('rgb(','rgba(').replace(')',',.48)'));
  g.fillStyle=P2[3];g.fillRect(0,GY-8,W,8);
  if(typeof cenaCartazes === 'function') cenaCartazes(P2);   // V2.1.3: cartazes do BRS48 e do TsuLiPa
  cenaMultidao(P2);   // multidão que cresce com a pontuação (V2.2) — agora ATRÁS dos arbustos
  drawBushes(dist*.62);

  drawProps(props,propsW,dist*.5,GY);
	
	// --- DESENHANDO A PLATEIA ---
  fans.forEach(function(f){
    // O pulinho é feito com a função seno, baseado no tempo (frame)
    var jump = Math.abs(Math.sin(frame * 0.1 + f.offset)) * 6;
    var fy = f.y - jump;
    
    // Corpo do fã (Silhueta escura)
    g.fillStyle = '#1e293b'; 
    g.fillRect(f.x, fy, 12, 16); 
    g.beginPath(); g.arc(f.x + 6, fy - 5, 6, 0, 7); g.fill(); // Cabeça
    
    // Lightstick neon brilhando
    g.fillStyle = f.color;
    g.shadowColor = f.color;
    g.shadowBlur = 8;
    g.fillRect(f.x + 10, fy - 12, 3, 14); // O bastão de luz na mãozinha
    g.shadowBlur = 0;
  });

	
  cenaGrilo(P2);   // grilo "cri cri" de noite (V2.2)
  if(typeof cenaPinguim === 'function') cenaPinguim();   // V2.1.3: pinguim correndo
  g.fillStyle=P2[6];g.fillRect(0,GY,W,H-GY);
  g.fillStyle=P2[7];g.shadowColor=P2[7];g.shadowBlur=14;g.fillRect(0,GY,W,3);g.shadowBlur=0;
  g.fillStyle='rgba(255,255,255,.12)';for(var x=-(dist%60);x<W;x+=60)g.fillRect(x,GY+22,30,3);
  }
  obs.forEach(function(o){
    if(typeof obsDesenhar==='function'){obsDesenhar(o);return;}
    if(o.k==='cable'){g.fillStyle='#222';g.fillRect(o.x,o.y+4,o.w,6);g.fillStyle='#ffd23f';g.fillRect(o.x+6,o.y+2,10,10);g.fillRect(o.x+o.w-16,o.y+2,10,10)}
    else if(o.k==='speaker'){g.fillStyle='#111827';g.fillRect(o.x,o.y,o.w,o.h);g.strokeStyle='#5a6b9a';g.lineWidth=2;g.strokeRect(o.x+1,o.y+1,o.w-2,o.h-2);g.fillStyle='#3a4a7a';g.beginPath();g.arc(o.x+o.w/2,o.y+17,9,0,7);g.fill();g.beginPath();g.arc(o.x+o.w/2,o.y+36,5,0,7);g.fill()}
    else{var c=o.pal;for(var i=0;i<3;i++){var lx=o.x+i*9+2;g.fillStyle='#ddd';g.fillRect(lx,o.y+16,5,o.h-16);g.fillStyle=c[i];g.shadowColor=c[i];g.shadowBlur=10;g.fillRect(lx-1,o.y+(i%2)*4,7,18);g.shadowBlur=0}}
  });
  items.forEach(function(it){var bob=Math.sin(frame*.12+it.x*.05)*3,cx=it.x+9,cy=it.y+9+bob;
	
    // --- AURA DE DESTAQUE (morango e microfone): anel pulsante + brilho + estrelinhas girando ---
    if (it.k === 'morango' || it.k === 'mic_unit') {
      var auM = it.k === 'morango', auC = auM ? '255,111,181' : '155,48,217';
      g.save(); g.translate(auM ? cx + 7 : cx, auM ? cy + 7 : cy);
      var auG = g.createRadialGradient(0, 0, 3, 0, 0, 34);
      auG.addColorStop(0, 'rgba(' + auC + ',' + (0.35 + 0.15 * Math.sin(frame * 0.15)) + ')'); auG.addColorStop(1, 'rgba(' + auC + ',0)');
      g.fillStyle = auG; g.beginPath(); g.arc(0, 0, 34, 0, 7); g.fill();
      for (var ar = 0; ar < 2; ar++) {
        var auP = (frame * 0.025 + ar * 0.5) % 1;
        g.strokeStyle = 'rgba(' + auC + ',' + (0.85 * (1 - auP)) + ')'; g.lineWidth = 2;
        g.beginPath(); g.arc(0, 0, 10 + auP * 26, 0, 7); g.stroke();
      }
      g.fillStyle = '#fff';
      for (var as = 0; as < 4; as++) {
        var aa = frame * 0.05 + as * Math.PI / 2, ar2 = 22 + Math.sin(frame * 0.1 + as) * 3;
        g.fillRect(Math.cos(aa) * ar2 - 1, Math.sin(aa) * ar2 - 1, 3, 3);
      }
      g.restore();
    }

     if (it.petDrop) {
      g.save();
      g.translate(cx, cy);
      // Halo dourado suave no fundo
      var petHalo = g.createRadialGradient(0, 0, 2, 0, 0, 20);
      petHalo.addColorStop(0, 'rgba(255, 225, 77, 0.6)');
      petHalo.addColorStop(1, 'rgba(255, 225, 77, 0)');
      g.fillStyle = petHalo;
      g.beginPath(); g.arc(0, 0, 20, 0, 7); g.fill();
      // Brilhinhos flutuantes
      g.fillStyle = '#fff';
      g.fillRect(Math.sin(frame * 0.1 + it.x) * 12, -10 + Math.cos(frame * 0.15) * 5, 2, 2);
      g.fillRect(-10 + Math.cos(frame * 0.12) * 5, Math.sin(frame * 0.08) * 10, 2, 2);
      g.restore();
    }
							 
    if(it.k==='card'){g.save();g.translate(cx,cy);g.rotate(Math.sin(frame*.08)*.2);g.fillStyle='#fff';g.fillRect(-9,-13,18,26);g.fillStyle={fever:'#ff8466',ima:'#c8a2f5'}[it.ct]||'#0a84ff';g.fillRect(-7,-11,14,16);if(it.ct==='ima'){g.fillStyle='rgba(255,255,255,'+(.4+.4*Math.sin(frame*.3))+')';g.fillRect(-4,-8,3,3);g.fillRect(2,-3,2,2)}g.fillStyle='#ff6fb5';g.fillRect(-7,7,14,4);g.restore()}
  
  
else if(it.k==='morango'){
      g.save(); g.translate(cx+7, cy+7); g.rotate(Math.sin(frame*0.1)*0.2);
      // Cone
      g.fillStyle='#d97706'; g.beginPath(); g.moveTo(-6,2); g.lineTo(6,2); g.lineTo(0,14); g.fill(); 
      // Sorvete rosa em 3 bolas
      g.fillStyle='#ff6fb5'; g.beginPath(); g.arc(0,-1,7,0,7); g.fill(); 
      g.beginPath(); g.arc(-4,2,4,0,7); g.fill(); g.beginPath(); g.arc(4,2,4,0,7); g.fill(); 
      // Granulados branco e azul
      g.fillStyle='#fff'; g.fillRect(-2,-3,2,2); g.fillRect(2,-1,2,2); g.fillStyle='#4dd8ff'; g.fillRect(-1,-6,2,2);
      g.restore();
    }

	else if (it.k === 'mic_unit') {
  g.save(); g.translate(cx, cy); g.rotate(Math.sin(frame*0.1)*0.2);
  // Halo lilás/roxo cintilante
  var halo = g.createRadialGradient(0, 0, 2, 0, 0, 24);
  halo.addColorStop(0, 'rgba(155, 48, 217, ' + (0.6 + 0.4*Math.sin(frame*0.2)) + ')');
  halo.addColorStop(1, 'rgba(155, 48, 217, 0)');
  g.fillStyle = halo; g.beginPath(); g.arc(0, 0, 24, 0, 7); g.fill();
  
  // Corpo do microfone preto
  g.fillStyle = '#111'; g.beginPath(); g.arc(0, -6, 6, 0, 7); g.fill(); // Globo
  g.fillRect(-2, -3, 4, 14); // Cabo
  g.fillStyle = '#444'; g.beginPath(); g.arc(0, -6, 6, Math.PI, 0); g.fill(); // Detalhe prata
  g.restore();
}
		
    else if(it.k==='ufo'){
      g.save(); g.translate(cx+7, cy); g.rotate(Math.sin(frame*0.1)*0.2);
      var ufoG = g.createRadialGradient(0, 0, 2, 0, 0, 26);
      ufoG.addColorStop(0, 'rgba(182, 255, 59, 0.85)');
      ufoG.addColorStop(0.5, 'rgba(182, 255, 59, 0.3)');
      ufoG.addColorStop(1, 'rgba(182, 255, 59, 0)');
      g.fillStyle = ufoG;
      g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
      g.shadowColor = '#b6ff3b'; g.shadowBlur = 14;
      g.fillStyle='#9b30d9'; g.beginPath(); g.ellipse(0, 0, 16, 6, 0, 0, 7); g.fill(); 
      g.fillStyle='#b6ff3b'; g.beginPath(); g.ellipse(0, -3, 9, 6, 0, Math.PI, 0); g.fill(); 
      g.shadowBlur = 0;
      g.fillStyle='#4169e1'; g.beginPath(); g.arc(-9,0,2.5,0,7); g.fill(); g.beginPath(); g.arc(0,1,3,0,7); g.fill(); g.beginPath(); g.arc(9,0,2.5,0,7); g.fill(); 
      g.restore();
    }
    else{var fv=pw&&pw.k==='fever';if(fv){g.fillStyle='rgba(255,140,100,.3)';g.beginPath();g.arc(cx,cy,15,0,7);g.fill()}g.fillStyle='#ffe14d';g.shadowColor=fv?'#ff8466':'#ffe14d';g.shadowBlur=fv?18:8;g.beginPath();for(var i=0;i<10;i++){var r=i%2?4:10,a=-Math.PI/2+i*Math.PI/5;g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.fill();g.shadowBlur=0}});

if(window.activePetFly){
    drawPet(g, window.activePetFly.type, window.activePetFly.x, window.activePetFly.y, 1.2, frame);
  }

  if(rankI>=10&&state==='play'){var ag=g.createRadialGradient(P.x+15,P.y+22,4,P.x+15,P.y+22,52);var hc=rankI>=11?'hsla('+((frame*3)%360|0)+',90%,70%,':'rgba(255,225,120,';ag.addColorStop(0,hc+'.55)');ag.addColorStop(1,hc+'0)');g.fillStyle=ag;g.fillRect(P.x-40,P.y-30,110,110);g.fillStyle='#ffe14d';for(var ei=0;ei<4;ei++)g.fillRect(P.x-8-ei*14,P.y+10+Math.sin(frame*.2+ei)*14,3,3)}
  
  if(pw && pw.k==='alien'){
      var bgL = g.createLinearGradient(0, 0, 0, P.y + P.h + 25);
      bgL.addColorStop(0, 'rgba(182, 255, 59, 0.65)');
      bgL.addColorStop(1, 'rgba(182, 255, 59, 0)');
      g.fillStyle = bgL;
      g.beginPath();
      g.moveTo(P.x + P.w/2 - 35, 0);
      g.lineTo(P.x + P.w/2 + 35, 0);
      g.lineTo(P.x + P.w/2 + 18, P.y + P.h + 24);
      g.lineTo(P.x + P.w/2 - 18, P.y + P.h + 24);
      g.fill();
      g.fillStyle = '#b6ff3b';
      for(var pi=0; pi<5; pi++){
        var py = ((frame*3 + pi*30) % (P.y + 100));
        g.fillRect(P.x + P.w/2 - 10 + Math.sin(frame*0.1 + pi)*10, P.y + P.h - py, 3, 3);
      }
  }

  var playExpr = (shake > 0 || (inv > 0 && !abducted)) ? 1 : 0; 
  if(typeof exprCorrida === 'function') playExpr = exprCorrida(playExpr);   // V2.1.3
  var runAnim = state==='play' ? (!P.air ? Math.sin(frame*.5) : (pw && pw.k==='alien' ? Math.sin(frame*.25) : 0)) : 0;

g.save();
  var isGiant = (pw && pw.k === 'gigante');
  if (isGiant) {
    g.translate(P.x + P.w/2, P.y + P.h); g.scale(1.5, 1.5); g.translate(-(P.x + P.w/2), -(P.y + P.h));
    var hg = g.createRadialGradient(P.x+15, P.y+22, 10, P.x+15, P.y+22, 35);
    hg.addColorStop(0, 'rgba(255,111,181,0.6)'); hg.addColorStop(1, 'rgba(255,111,181,0)');
    g.fillStyle = hg; g.beginPath(); g.arc(P.x+15, P.y+22, 35, 0, 7); g.fill();
  }
  // Se for gigante, NÃO pisca. Fica invencível e destrói tudo no caminho!
  var blink = (inv > 0 && !abducted && !isGiant && ((frame/4|0)%2)); 
	
// Desenha APENAS o parceiro sorteado no microfone atual acompanhando você!
  if (pw && pw.k === 'unit' && pw.partner !== undefined) {
    drawChar(CH[pw.partner], P.x - 34, P.y, runAnim, 2, true);
        var heartColors = ['💜', '💚', '💙'];
    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    g.font = '9px sans-serif';
    g.fillText(heartColors[pw.partner] || '✨', P.x - 19, P.y - 10 + Math.sin(frame * 0.12) * 1.5);
    g.restore();
  }

	
  if(!blink || (s2HitEmotion>0 && state==='play')){
    g.save();
    var reaction=s2HitEmotion>0 && state==='play';
    if(reaction)g.translate(Math.sin(frame*.8)*(s2HitEmotion>36?2.2:.9),0);
    s2DrawingRunChar=true;
    try{drawChar(CH[sel],P.x,P.y,runAnim,reaction?(s2HitEmotion>36?4:5):playExpr);}
    finally{s2DrawingRunChar=false;g.restore();}
  }
  g.restore();
  
  if(shield&&state==='play'){g.strokeStyle='rgba(120,220,255,'+(.6+.3*Math.sin(frame*.2))+')';g.lineWidth=3;g.shadowColor='#4dd8ff';g.shadowBlur=14;g.beginPath();g.arc(P.x+15,P.y+22,32,0,7);g.stroke();if(shield>1){g.beginPath();g.arc(P.x+15,P.y+22,39,0,7);g.stroke()}g.shadowBlur=0}
  g.restore();
	
// --- EFEITO VISUAL DO FLASH E PAPARAZZI ---
  if (window.flashAlpha > 0.01) {
    // 1. O clarão pinta a tela de branco PRIMEIRO
    g.fillStyle = 'rgba(255, 255, 255, ' + (window.flashAlpha * 0.85) + ')';
    g.fillRect(0, 0, W, H);
    
    // 2. O paparazzi é desenhado POR CIMA, como uma silhueta escura contra a luz
    var papX = P.x + 180 + (1 - window.flashAlpha) * 40; 
    var papY = GY - 16;
    g.fillStyle = '#0f172a'; // Tom ultra escuro
    g.fillRect(papX, papY, 14, 16); 
    g.beginPath(); g.arc(papX + 7, papY - 4, 7, 0, 7); g.fill(); 
    
    // Câmera fotográfica
    g.fillStyle = '#000'; g.fillRect(papX - 6, papY - 2, 12, 8); 
    g.fillStyle = '#fff'; g.beginPath(); g.arc(papX - 6, papY + 2, 4, 0, 7); g.fill();
  }
  
	
  g.textAlign='center';g.font='800 15px "M PLUS Rounded 1c",sans-serif';pops.forEach(function(p){g.globalAlpha=Math.max(0,1-p.t/40);g.fillStyle='#ffe14d';g.fillText(p.s,p.x+9,p.y-p.t*.9)});g.globalAlpha=1;
  if(s2ArtActive())s2ArtHudBacking();
  g.fillStyle='rgba(255,255,255,.92)';g.font='800 18px "M PLUS Rounded 1c",sans-serif';g.textAlign='left';
  g.fillText(String(Math.floor(score)).padStart(5,'0'),14,28);
  g.font='700 12px "M PLUS Rounded 1c",sans-serif';g.fillStyle='#ff9ccd';g.fillText(tr(RANKS[rankI||rankOf(score)][1]),14,46);g.fillStyle='#ffe14d';g.fillText('★ '+stars,14,64);
  if(pw&&state==='play'){g.textAlign='right';g.fillStyle='#ffe14d';g.fillText((pw.k==='fever'?tr('Fever '):pw.k==='alien'?tr('Abdução '):pw.k==='gigante'?tr('Mega '):pw.k==='unit'?tr('Unit ✨ '):tr('Ímã '))+Math.ceil(pw.t/60)+'s',W-16,72)}
  if(toastT>0){g.globalAlpha=Math.min(1,toastT/30);g.textAlign='center';g.font='800 '+(W<500?16:26)+'px "M PLUS Rounded 1c",sans-serif';g.fillStyle='#fff';g.shadowColor='#ff6fb5';g.shadowBlur=16;g.fillText(toast,W/2,W<500?122:86,W-24);g.shadowBlur=0;g.globalAlpha=1}
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
function twIndex2StartBaseLoop(){
  if(twIndex2BaseRaf||twIndex2BaseFramesPaused())return;
  last=0;twIndex2BaseRaf=requestAnimationFrame(loop);
}
function twIndex2StartAvatarLoop(){
  if(!twIndex2AvatarRaf&&!twIndex2BaseFramesPaused()&&state==='menu'&&twIndex2AvatarVisible)twIndex2AvatarRaf=requestAnimationFrame(prevLoop);
}
function twIndex2ResumeBaseFrames(){
  if(twIndex2BaseFramesPaused())return;
  twIndex2StartBaseLoop();twIndex2StartAvatarLoop();
  if(state==='over'&&!celebRaf)celebRaf=requestAnimationFrame(celeb);
}
function loop(t){
  twIndex2BaseRaf=0;
  if(twIndex2BaseFramesPaused()){last=0;return;}
  var rawDt = last ? (t - last) / 16.667 : 1;
  var dt = Math.max(0.1, Math.min(rawDt, 2.5));
  last=t;
  if(state==='play'&&!paused)update(dt);
  else if(state==='over'&&shake>0)frame+=dt;
  if(!window.TWMotionLifecycle||TWMotionLifecycle.render30Due($('stage'),t))draw();
  twIndex2BaseRaf=requestAnimationFrame(loop);
}
var titleClicks = 0;
function makeCard(){
  var W2=400, H2=540, c2=document.createElement('canvas');
  c2.width=W2; c2.height=H2; var x2=c2.getContext('2d'), og=g, Q=curPal();
  var charCor = (sel === 3 ? CU.hair : CH[sel].img) || '#ff6fb5';
  
  // 1. O Papel da Polaroid com bolinhas suaves na cor da personagem
  x2.fillStyle='#fffafd'; x2.fillRect(0,0,W2,H2);
  x2.save();
  x2.fillStyle = charCor;
  x2.globalAlpha = 0.08;
  for(var dy = 12; dy < H2; dy += 18){
    for(var dx = (dy / 18 % 2) * 9 + 6; dx < W2; dx += 18){
      x2.beginPath(); x2.arc(dx, dy, 1.6, 0, 7); x2.fill();
    }
  }
  x2.restore();
  petPhFrameDraw(x2, W2, H2, 'papel');   // molduras Oshi e Rank (Foto 2.0)
  
  // 2. Fundo da Foto (Céu dinâmico da paleta atual)
  var sk=x2.createLinearGradient(0,20,0,380);
  sk.addColorStop(0,Q[0]); sk.addColorStop(1,Q[1]);
  x2.fillStyle=sk; x2.fillRect(20,20,360,360);
  
  // 2.5 Estrelas brilhantes nas cores do Trio (Roxo, Azul, Verde)
  var coresTrio = ['#b04fe6', '#4169e1', '#7ed321'];
  for(var st=0; st<25; st++) {
    x2.fillStyle = coresTrio[st % 3];
    x2.globalAlpha = 0.3 + Math.random()*0.7;
    x2.beginPath(); x2.arc(20 + Math.random()*360, 20 + Math.random()*250, Math.random()*2.5 + 1, 0, 7); x2.fill();
  }
  x2.globalAlpha = 1;

  // 2.6 A Cidade ao Fundo (Prédios e janelinhas)
  for(var b=0; b<8; b++){
    var bh = 40 + (b * 67 % 110);
    x2.fillStyle = b % 2 ? Q[2] : Q[3];
    x2.fillRect(20 + b * 45, 300 - bh, 46, bh);
    x2.fillStyle = 'rgba(255,235,150,0.3)';
    if(b % 3 !== 0){
      for(var wy = 300 - bh + 12; wy < 290; wy += 18){
        x2.fillRect(20 + b * 45 + 8, wy, 6, 6);
        x2.fillRect(20 + b * 45 + 26, wy, 6, 6);
      }
    }
  }
  
  // Chãozinho do palco
  x2.fillStyle=Q[2]; x2.fillRect(20,300,360,80);
  x2.fillStyle=Q[6]; x2.fillRect(20,345,360,35);
  x2.fillStyle=Q[7]; x2.fillRect(20,345,360,4);
  
  // Faixa Idol TsuLiPa decorando a base da foto
  var faixag = x2.createLinearGradient(20, 375, 380, 375);
  faixag.addColorStop(0, '#9b30d9'); // Tsu
  faixag.addColorStop(0.5, '#4169e1'); // Pati
  faixag.addColorStop(1, '#b6ff3b'); // Lirika
  x2.fillStyle = faixag;
  x2.fillRect(20, 375, 360, 5);

  // 3. Capturando o Personagem
  var isGiant = (pw && pw.k === 'gigante');
  var isAlien = (pw && pw.k === 'alien');
  var cT = isGiant ? [133, 102, 4.5] : isAlien ? [148, 80, 3.5] : [148, 146, 3.5];   // posição e escala de cada caso (iguais às de antes)
  g=x2; g.save(); 
  g.translate(cT[0], cT[1]); g.scale(cT[2], cT[2]);
  if(isGiant) {
    var hg = g.createRadialGradient(15, 22, 10, 15, 22, 35);
    hg.addColorStop(0, 'rgba(255,111,181,0.6)'); hg.addColorStop(1, 'rgba(255,111,181,0)');
    g.fillStyle = hg; g.beginPath(); g.arc(15, 22, 35, 0, 7); g.fill();
  }
  
  // O Pulo do Gato: Expressão e Animação
  // Expressão: Dano = 1 (susto). Se não for dano, Expressão = 2 (Sorrindo super fofa!) — a Foto 2.0 pode trocar
  var exprFoto = petPhExprVal((inv>0 && !isGiant && !isAlien) ? 1 : 2);
  
  // Captura o balanço da perna e pulo do exato milissegundo do jogo
  var runAnim = state==='play' ? (!P.air ? Math.sin(frame*.5) : (isAlien ? Math.sin(frame*.25) : 0)) : 0;

// Captura os halos na polaroid
  if (pw && pw.k === 'fever') {
    var fH = g.createRadialGradient(15, 22, 5, 15, 22, 55);
    fH.addColorStop(0, 'rgba(255, 132, 102, 0.4)'); fH.addColorStop(1, 'rgba(255, 132, 102, 0)');
    g.fillStyle = fH; g.beginPath(); g.arc(15, 22, 55, 0, 7); g.fill();
  } else if (pw && pw.k === 'ima') {
    var iH = g.createRadialGradient(15, 22, 5, 15, 22, 55);
    iH.addColorStop(0, 'rgba(200, 162, 245, 0.4)'); iH.addColorStop(1, 'rgba(200, 162, 245, 0)');
    g.fillStyle = iH; g.beginPath(); g.arc(15, 22, 55, 0, 7); g.fill();
  }
  g.restore(); g=og;

  // Dupla (Unit) e jogador principal, com contorno suave para não sumirem no fundo (Foto 2.0)
  var unitFoto = (pw && pw.k === 'unit' && pw.partner !== undefined);
  var xOffsetPrincipal = unitFoto ? 18 : 0;
  petCharFoto(x2, cT[0], cT[1], cT[2], function(){
    if (unitFoto) {
      drawChar(CH[pw.partner], -18, 0, runAnim, 2, true);
      var hCols = ['💜', '💚', '💙'];
      g.save(); g.textAlign = 'center'; g.font = '8px sans-serif'; g.fillStyle = '#000';
      g.fillText(hCols[pw.partner] || '✨', -3, -10);
      g.restore();
    }
    charPose = petPhPose;   // pose escolhida (Foto 2.0)
    drawChar(CH[sel], xOffsetPrincipal, 0, runAnim, exprFoto);
  });

// Sorteia ou define o pet principal e os coadjuvantes para enfeitar embaixo
  var listaPets = ['tsu', 'lirika', 'pati'];
  var mainPetKey = sel===0 ? 'tsu' : sel===1 ? 'lirika' : sel===2 ? 'pati' : (OSHI || listaPets[Math.floor(Math.random()*3)]);
  var cartaoPets = petCartaoPets(mainPetKey, listaPets);   // [seu pet ativo, outros da coleção] (sem pet adotado: igual a antes)
  
// Desenha o pet principal bem grande e imponente no céu da foto (escala 2.0)
  petBrilhoEstagio(x2, 325, 75, 44);
  drawPet(x2, cartaoPets[0], 325, 75, 2.0, frame);

  // Vinheta suave de flash e borda interna da foto
  var vg = x2.createRadialGradient(200, 200, 90, 200, 200, 260);
  vg.addColorStop(0, 'rgba(255,255,255,0)');
  vg.addColorStop(1, 'rgba(255,190,225,0.22)');
  x2.fillStyle = vg; x2.fillRect(20, 20, 360, 360);
  x2.strokeStyle = 'rgba(18,54,94,0.08)'; x2.lineWidth = 1; x2.strokeRect(20.5, 20.5, 359, 359);

  // Fita adesiva (washi tape) colada no topo da foto, na cor da personagem!
  x2.save();
  x2.translate(200, 18);
  x2.rotate(-0.05);
  x2.globalAlpha = 0.65;
  x2.fillStyle = charCor;
  x2.fillRect(-58, -11, 116, 22);
  x2.globalAlpha = 0.35;
  x2.fillStyle = '#ffffff';
  for(var tp = -50; tp < 58; tp += 14) x2.fillRect(tp, -11, 6, 22);
  x2.restore();
  x2.globalAlpha = 1;
  petPhFrameDraw(x2, W2, H2, 'topo', 380, ['🏆', RANKS[rankI][1]]);   // Foto 2.0: selo com o rank da corrida

  // Descobre quais são os outros 2 pets (coadjuvantes)
  var petsCoadjuvantes = cartaoPets.slice(1);

  // 4. Textos do Photocard
  var t = typeof tr === 'function' ? tr : function(w){return w;};
  x2.fillStyle='#12365e'; x2.textAlign='center';
  x2.font='800 28px "M PLUS Rounded 1c",sans-serif';
  x2.fillText(nick || t('Anônimo'), 200, 432, 290);
  
  x2.fillStyle='#ff6fb5'; var rkTxt = t(RANKS[rankI][1]) + ' ✧ ' + Math.floor(score) + ' pts', rkF = 20; x2.font='700 20px "M PLUS Rounded 1c",sans-serif';
  while(rkF > 13 && x2.measureText(rkTxt).width > 190){ rkF--; x2.font='700 ' + rkF + 'px "M PLUS Rounded 1c",sans-serif'; }
  var rkW = Math.min(190, x2.measureText(rkTxt).width);
  x2.fillText(rkTxt, 200, 464, 190);
  
  // Os dois outros pets nas laterais, sempre fora do texto (V2.1.3)
  drawPet(x2, petsCoadjuvantes[0], Math.max(42, Math.min(85, 200 - rkW / 2 - 34)), 452, 1.15, frame);
  drawPet(x2, petsCoadjuvantes[1], Math.min(358, Math.max(315, 200 + rkW / 2 + 34)), 452, 1.15, frame);

  // Adesivinhos de brilho e corações na Polaroid
  x2.fillStyle = '#ff6fb5';
  x2.font = '22px sans-serif';
  x2.textAlign = 'left';
  x2.fillText('✨', 35, 415);   // Brilho na margem inferior esquerda
  x2.fillText('💕', 35, 60);    // No topo esquerdo da moldura
  
  x2.textAlign = 'right';
  x2.fillText('💕', 370, 415);  // Corações na margem inferior direita
  x2.fillText('🫰', 365, 495);  // Mãozinha de coração no canto inferior direito

  // Data formatada conforme o idioma + Marca d'água oficial no rodapé
  var loc = { pt:'pt-BR', en:'en-US', es:'es-ES', th:'th-TH', ja:'ja-JP' }[LANG] || 'pt-BR';
  x2.textAlign = 'center';
  x2.fillStyle = '#94a3b8';
  x2.font = '600 12px "M PLUS Rounded 1c",sans-serif';
  x2.fillText(new Date().toLocaleDateString(loc, { day:'2-digit', month:'2-digit', year:'numeric' }), 200, 498);
  x2.font='500 11px "M PLUS Rounded 1c",sans-serif';
  x2.fillText('🌷 TsuLiPa⭐World · Center⭐Run! · BRS48 Official Photocard', 200, 524);
	
  return c2.toDataURL('image/png');
}
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
function cenaRGB(s){ var m = String(s).match(/\d+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; }
function cenaMix(a, b, t, al){ return 'rgba(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ',' + (al === undefined ? 1 : al) + ')'; }
function cenaHash(n){ var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function cenaNoite(P2){ var c = cenaRGB(P2[0]); return (c[0] * .3 + c[1] * .59 + c[2] * .11) < 80; }
function cenaNuvens(P2){
  var top = cenaRGB(P2[0]), bot = cenaRGB(P2[1]), cid = cenaRGB(P2[2]), wh = [255, 255, 255];
  var noite = cenaNoite(P2), yMax = Math.max(60, GY - 190);
  [[.03, .04, .62, .55, 300], [.07, .09, .95, .78, 240]].forEach(function(L, li){
    var off = dist * L[0] + frame * L[1], esp = L[4], i0 = Math.floor(off / esp);
    for(var i = i0; i < i0 + Math.ceil(W / esp) + 2; i++){
      var h = cenaHash(i * 3 + li * 101); if(h < .3) continue;   // alguns espaços ficam sem nuvem
      var cx = (i - i0) * esp - (off % esp) + h * 90 - 40, cy = 26 + cenaHash(i * 7 + li) * (yMax - 26), s = L[2] * (.75 + cenaHash(i * 11 + li) * .5);
      cenaNuvem(cx, cy, s, L[3] * (noite ? .7 : 1), top, bot, cid, wh, noite);
    }
  });
}
function cenaNuvem(cx, cy, s, al, top, bot, cid, wh, noite){
  var B = [[-22, 4, 12], [-7, -4, 16], [12, -2, 14], [27, 5, 10], [2, 7, 13]];
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = cenaMix(bot, cid, .45, al * .9);                       // sombra embaixo, na cor do cenário
  B.forEach(function(b){ g.beginPath(); g.arc(b[0], b[1] + 4, b[2], 0, 7); g.fill(); });
  g.fillStyle = cenaMix(cenaRGB(cenaMix(top, bot, .5)), wh, noite ? .25 : .55, al);   // corpo
  B.forEach(function(b){ g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); });
  g.fillStyle = cenaMix(top, wh, noite ? .45 : .82, al * .75);          // luz em cima
  [[-9, -8, 9], [10, -6, 8]].forEach(function(b){ g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); });
  g.restore();
}
var cenaAves = null, cenaProxAves = 900;
function cenaPassaros(P2){
  if(!cenaAves && frame > cenaProxAves && state === 'play'){
    var dir = Math.random() < .5 ? 1 : -1;
    cenaAves = { f0:frame, dir:dir, y:30 + Math.random() * Math.max(30, GY - 220), n:3 + Math.floor(Math.random() * 3) };
  }
  if(!cenaAves) return;
  var A = cenaAves, t = frame - A.f0, x0 = A.dir > 0 ? -40 + t * 1.7 : W + 40 - t * 1.7;
  if(x0 < -160 || x0 > W + 160){ cenaAves = null; cenaProxAves = frame + 1500 + Math.random() * 1500; return; }   // 25 a 50 s até o próximo
  g.save(); g.strokeStyle = cenaMix(cenaRGB(P2[1]), [20, 10, 40], .65, .85); g.lineWidth = 1.6; g.lineCap = 'round';
  for(var j = 0; j < A.n; j++){
    var bx = x0 - A.dir * j * 13, by = A.y + (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 7 + Math.sin(t * .05 + j) * 2, fl = Math.sin(t * .25 + j * 1.3) * 3;
    g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 1, bx, by); g.quadraticCurveTo(bx + 3, by - 1, bx + 6, by - fl); g.stroke();
  }
  g.restore();
}
function cenaMultidao(P2){
  var dens = score >= 10000 ? .95 : score >= 5000 ? .7 : score >= 2500 ? .32 : 0;
  if(!dens) return;
  var cores = ['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5', '#ffe14d'], esp = 11, off = dist * .45, i0 = Math.floor(off / esp);
  var silh = cenaMix(cenaRGB(P2[3]), [10, 8, 30], .45);
  for(var fila = 0; fila < (score >= 10000 ? 2 : 1); fila++){
    var base = GY - 14 - fila * 6;
    for(var i = i0; i < i0 + Math.ceil(W / esp) + 2; i++){
      var h = cenaHash(i * 13 + fila * 977); if(h > dens) continue;
      var x = (i - i0) * esp - (off % esp), pulo = Math.abs(Math.sin(frame * .1 + i * .7)) * (score >= 5000 ? 4 : 2.5), y = base - pulo - cenaHash(i * 5) * 3;
      g.fillStyle = silh; g.fillRect(x, y - 9, 8, 10); g.beginPath(); g.arc(x + 4, y - 12, 4, 0, 7); g.fill();
      var c = cores[Math.floor(cenaHash(i * 17 + fila) * cores.length)], bal = Math.sin(frame * .1 + i) * 2;
      g.fillStyle = c; g.globalAlpha = .9; g.fillRect(x + 6 + bal * .3, y - 21, 2, 9); g.globalAlpha = .28; g.fillRect(x + 4 + bal * .3, y - 23, 6, 13); g.globalAlpha = 1;
    }
  }
}
var cenaGrl = null, cenaProxGrilo = 600;
function cenaGrilo(P2){
  if(!cenaGrl && state === 'play' && frame > cenaProxGrilo){
    if(cenaNoite(P2) && Math.random() < .5) cenaGrl = { d0:dist, f0:frame, ult:0 };
    else cenaProxGrilo = frame + 600;
  }
  if(!cenaGrl) return;
  var G = cenaGrl, x = W + 20 - (dist - G.d0) * .62, t = frame - G.f0;
  if(x < -30){ cenaGrl = null; cenaProxGrilo = frame + 2400 + Math.random() * 1800; return; }
  var hop = (t % 160) < 14 ? Math.sin((t % 160) / 14 * Math.PI) * 6 : 0, y = GY - 4 - hop;
  if(typeof griloAmor === 'function') griloAmor(G, x);   // V2.1.3
  g.save(); g.translate(x, y);
  g.strokeStyle = '#3f6212'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(-3, 1); g.lineTo(-7, 4); g.moveTo(1, 1); g.lineTo(-1, 4); g.moveTo(3, 1); g.lineTo(6, 4); g.stroke();   // perninhas
  g.beginPath(); g.moveTo(5, -2); g.quadraticCurveTo(10, -10, 14, -9); g.moveTo(5, -2); g.quadraticCurveTo(9, -12, 11, -13); g.stroke();   // antenas
  g.fillStyle = '#65a30d'; g.beginPath(); g.ellipse(0, -1, 6, 2.8, -.1, 0, 7); g.fill();
  g.fillStyle = '#4d7c0f'; g.beginPath(); g.arc(5, -2, 2.4, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.fillRect(5.5, -3, 1, 1);
  g.restore();
  if(x > 20 && x < W - 20 && t - G.ult > 70){   // canta enquanto está na tela
    G.ult = t;
    for(var k = 0; k < 3; k++){ beep(4400, .035, 'sine', .018, k * .06); beep(4700, .03, 'sine', .01, k * .06 + .02); }
  }
  if(t - G.ult < 40){
    g.save(); g.globalAlpha = 1 - (t - G.ult) / 40; g.fillStyle = '#d9f99d'; g.font = '800 10px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
    g.fillText('cri cri ♪', x + 4, y - 16 - (t - G.ult) * .2); g.restore();
  }
}
function cenaReset(){ cenaAves = null; cenaGrl = null; cenaProxAves = 900; cenaProxGrilo = 600; }
// Pet com auréola/tiara: o balão de humor sobe um pouco para não esconder o acessório
function petMoodLift(p){
  var a = petData && petData.ativo === 'meu' ? (p.cfg && p.cfg.acc) : p.acc;
  return (a === 'aureola' || a === 'tiara') ? 12 : 0;
}
// Girar o celular no meio da corrida: refaz a tela no formato novo e move tudo junto com o chão
function cenaGirarTela(){
  var pt2 = matchMedia('(max-width:700px) and (orientation:portrait)').matches;
  if((pt2 ? 380 : 720) === W) return;
  var oG = GY; layout(); var dy = GY - oG;
  if(P) P.y += dy;
  [obs, items, fans].forEach(function(L){ (L || []).forEach(function(o){ if(typeof o.y === 'number') o.y += dy; }); });
  if(window.activePetFly) window.activePetFly.y += dy;
  if(!paused) setPause(true);
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
function bestcSalvar(i, s){ var o = bestcLer() || bestcIniciar(); if(s > (+o[i] || 0)){ o[i] = s; bestcGravar(o); } }
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
  g.fillStyle = az; T([x + 5, y + 31, x + 25, y + 31, x + 27, y + 38, x + 3, y + 38]);                  // bermuda balonê
  g.fillStyle = '#a5d8ff'; g.fillRect(x + 3, y + 37.4, 24, 1.2);
  g.fillStyle = '#fff'; for(i = 0; i < 5; i++){ E(x + 6 + i * 4.6, y + 35.4, 1.7, 1.1); E(x + 7.3 + i * 4.6, y + 34.9, 1.3, 1); }   // nuvenzinhas na barra
  g.fillStyle = az; g.fillRect(x + 4, y + 22, 22, 10);                                                      // jaqueta
  ['#ff6fb5', '#ffe14d', '#4dd8ff'].forEach(function(cc, j){ g.fillStyle = cc; T([x + 4, y + 27.4 + j * 1.5, x + 26, y + 24.4 + j * 1.5, x + 26, y + 25.8 + j * 1.5, x + 4, y + 28.8 + j * 1.5]); });   // faixa arco-íris
  g.fillStyle = '#fff'; T([x + 10, y + 22, x + 15, y + 22, x + 12.5, y + 24.6]); T([x + 20, y + 22, x + 15, y + 22, x + 17.5, y + 24.6]);   // gola
  g.fillStyle = '#ff4f9a'; T([x + 15, y + 23.4, x + 10.5, y + 21.2, x + 10.5, y + 25.6]); T([x + 15, y + 23.4, x + 19.5, y + 21.2, x + 19.5, y + 25.6]); g.fillStyle = '#ffd0e6'; E(x + 15, y + 23.4, 1.3, 1.3);   // laço
  g.fillStyle = '#ffe14d'; g.beginPath(); for(i = 0; i < 10; i++){ var rr = i % 2 ? 1 : 2.4, an = i * Math.PI / 5 - Math.PI / 2; g[i ? 'lineTo' : 'moveTo'](x + 21 + Math.cos(an) * rr, y + 29.6 + Math.sin(an) * rr); } g.closePath(); g.fill();   // estrela no peito
  perfAntena = 'estrelinha';
}
function griloAmor(G, x){   // encostar no grilo da noite: ★1 e "Amor Grilado" (uma vez por grilo)
  if(G.pego || state !== 'play' || !P || P.air) return;
  if(Math.abs(x - (P.x + 15)) < 14){ G.pego = true; stars += 1; toast = '🦗 ' + tr('Amor Grilado!') + ' +★1'; toastT = 110; beep(1568, .08, 'triangle', .04); beep(2093, .1, 'triangle', .04, .08); }
}
var cenaPg = null, cenaPgFeito = false;
function cenaPinguim(){   // de vez em quando, um pinguim passa correndo no fundo
  if(state !== 'play') return;
  if(frame < 5){ cenaPg = null; cenaPgFeito = false; }
  if(!cenaPg && !cenaPgFeito && score > 1500 && Math.random() < .002){ cenaPg = { x: W + 30, f: 0 }; cenaPgFeito = true; toast = '🐧 ' + tr('Hashire! Penguin!'); toastT = 100; }
  if(!cenaPg) return;
  var p = cenaPg; p.f++; p.x -= 5.5;
  if(p.x < -40){ cenaPg = null; return; }
  var y = GY - 6 - Math.abs(Math.sin(p.f * .4)) * 4, w = Math.sin(p.f * .5) * .25;
  g.save(); g.translate(p.x, y); g.rotate(w * .3);
  g.fillStyle = '#1f2937'; g.beginPath(); g.ellipse(0, -10, 7, 10, 0, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(1.5, -8, 4.5, 7, 0, 0, 7); g.fill();
  g.fillStyle = '#1f2937'; g.beginPath(); g.ellipse(-6, -9, 2, 5, w + .4, 0, 7); g.fill();
  g.fillStyle = '#f59e0b'; g.beginPath(); g.moveTo(-6, -15); g.lineTo(-11, -14); g.lineTo(-6, -13); g.fill(); g.fillRect(-4, 0, 3, 1.5); g.fillRect(1, 0, 3, 1.5);
  g.fillStyle = '#fff'; g.fillRect(-4, -17, 2, 2); g.fillStyle = '#111'; g.fillRect(-4, -16.5, 1, 1);
  g.fillStyle = '#ff6fb5'; g.fillRect(-2, -20, 6, 2);   // faixinha de idol
  g.restore();
}
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
function exprCorrida(base){   // reação do personagem durante a corrida
  if(base === 1) return 1;                                   // bateu: "ai!"
  if(pw && pw.k === 'alien') return 4;                        // abduzido: surpresa
  if(pw && pw.k === 'unit' && pw.t > 780) return 6;           // a parceira acabou de chegar: apaixonado
  if(pw && (pw.k === 'fever' || pw.k === 'gigante')) return 2; // Fever e Mega: sorrisão
  return base;
}
function exprFinal(s, recorde){   // expressão no fim do show
  if(recorde) return 6;
  if(s < 450) return 5;
  return Math.random() < .5 ? 2 : 3;
}
function insNivelTxt(k){ var p = String(k).split(':'); return +p[1] > 1 ? ' · ' + tr('Nível') + ' ' + p[1] : ''; }
var LOGO_TSL = './img/logo-tsl.webp';
var phAutoT = 0, phAutoV = 2;
var outdoorJog = [], outdoorFoto = {}, outdoorPedido = false;
function outdoorCarregar(){
  if(outdoorPedido || typeof contaRpc !== 'function') return; outdoorPedido = true;
  contaRpc('outdoor_jogadores').then(function(L){ outdoorJog = Array.isArray(L) ? L.filter(function(p){ return p && p.nick && p.avatar && typeof p.avatar === 'object'; }) : []; }).catch(function(){ outdoorPedido = false; });
}
function outdoorFotoDe(p){   // foto quadrada do perfil (feita uma vez e guardada)
  if(outdoorFoto[p.nick]) return outdoorFoto[p.nick];
  var c = document.createElement('canvas'); c.width = 112; c.height = 112;
  try{ perfDesenharIdol(c.getContext('2d'), 112, 112, p.avatar, true, true, 0); }catch(e){}
  return (outdoorFoto[p.nick] = c);
}
function cenaCartazes(P2){
  var esp = 640, off = dist * .35, i0 = Math.floor(off / esp), noite = typeof cenaNoite === 'function' && cenaNoite(P2);
  function rr(x0, y0, w, h, r){ g.beginPath(); g.moveTo(x0 + r, y0); g.arcTo(x0 + w, y0, x0 + w, y0 + h, r); g.arcTo(x0 + w, y0 + h, x0, y0 + h, r); g.arcTo(x0, y0 + h, x0, y0, r); g.arcTo(x0, y0, x0 + w, y0, r); g.closePath(); }
  for(var i = i0; i <= i0 + 2; i++){
    var jog = outdoorJog.length && (i % 3 !== 0) ? outdoorJog[((i % outdoorJog.length) + outdoorJog.length) % outdoorJog.length] : null;
    var sku = !jog && ((i % 15 + 15) % 15 === 9); // 1 SKU a cada 5 placas institucionais; BRS continua predominante
    var w = jog ? 58 : 54, h = jog ? 74 : 66, x = Math.round(i * esp - off + 260), y0 = GY - (jog ? 118 : 110), k;
    if(x < -80 || x > W + 20) continue;
    var neon = jog ? '#ff6fb5' : sku ? '#ffc18e' : '#4dd8ff';
    g.save(); g.globalAlpha = noite ? .95 : .88;
    // poste único, discreto
    g.fillStyle = noite ? '#231d38' : '#4a4266'; g.fillRect(x + w / 2 - 2, y0 + h, 4, GY - y0 - h);
    if(noite){ var lg = g.createRadialGradient(x + w / 2, y0 + h / 2, 6, x + w / 2, y0 + h / 2, 60); lg.addColorStop(0, jog ? 'rgba(255,111,181,.22)' : sku ? 'rgba(255,153,85,.22)' : 'rgba(77,216,255,.22)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lg; g.fillRect(x - 40, y0 - 40, w + 80, h + 80); }
    // moldura escura com contorno neon
    g.fillStyle = '#1d1730'; rr(x - 3, y0 - 3, w + 6, h + 6, 7); g.fill();
    g.strokeStyle = neon; g.lineWidth = 1.6; if(noite){ g.shadowColor = neon; g.shadowBlur = 8; } rr(x - 3, y0 - 3, w + 6, h + 6, 7); g.stroke(); g.shadowBlur = 0;
    g.save(); rr(x, y0, w, h, 5); g.clip();
    if(jog){
      g.drawImage(outdoorFotoDe(jog), x, y0, w, w);
      g.fillStyle = 'rgba(29,23,48,.92)'; g.fillRect(x, y0 + w, w, h - w);
      g.fillStyle = '#ffe9f5'; g.font = '800 8px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
      g.fillText('⭐ ' + String(jog.nick).slice(0, 10), x + w / 2, y0 + w + 11, w - 4);
    } else {
      var bg = g.createLinearGradient(x, y0, x + w, y0 + h); bg.addColorStop(0, sku ? '#ffac71' : '#3c46ca'); bg.addColorStop(1, sku ? '#ff9550' : '#262d8f');
      g.fillStyle = bg; g.fillRect(x, y0, w, h);
      g.fillStyle = '#fff'; g.textAlign = 'left'; g.font = '200 21px "Josefin Sans","Futura","Century Gothic","Avenir",sans-serif';
      g.fillText(sku ? 'SKU' : 'BRS', x + 7, y0 + 30); g.fillText('48', x + 7, y0 + 56);
    }
    g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(x, y0); g.lineTo(x + w * .6, y0); g.lineTo(x, y0 + h * .5); g.closePath(); g.fill();   // reflexo
    g.restore();
    // luzinhas no alto
    for(k = 0; k < 4; k++){ var on = Math.floor(frame / 14 + k) % 2 === 0; g.fillStyle = on ? neon : 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(x + 6 + k * (w - 12) / 3, y0 - 6, 1.6, 0, 7); g.fill(); }
    g.restore();
  }
}
function obsRR(x0, y0, w, h, r){ g.beginPath(); g.moveTo(x0 + r, y0); g.arcTo(x0 + w, y0, x0 + w, y0 + h, r); g.arcTo(x0 + w, y0 + h, x0, y0 + h, r); g.arcTo(x0, y0 + h, x0, y0, r); g.arcTo(x0, y0, x0 + w, y0, r); g.closePath(); }
function obsDesenhar(o){
  var x = o.x, y = o.y, w = o.w, h = o.h, i;
  g.save();
  g.fillStyle = 'rgba(10,5,30,.3)'; g.beginPath(); g.ellipse(x + w / 2, y + h + 1, w * .55, 3, 0, 0, 7); g.fill();
  if(o.k === 'cable'){   // cabo de palco preso com fita rosa e conectores
    g.lineCap = 'round'; g.strokeStyle = '#1c1830'; g.lineWidth = 7; g.beginPath(); g.moveTo(x + 5, y + 8); g.bezierCurveTo(x + w * .3, y + 2, x + w * .62, y + 13, x + w - 5, y + 7); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x + 7, y + 6.3); g.bezierCurveTo(x + w * .3, y + .4, x + w * .62, y + 11.4, x + w - 7, y + 5.4); g.stroke();
    g.save(); g.translate(x + w / 2, y + 7.5); g.rotate(-.12); g.fillStyle = '#ff6fb5'; g.fillRect(-7, -6, 14, 12); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-7, -6, 14, 2.5);
    g.fillStyle = '#fff'; g.font = '900 6px sans-serif'; g.textAlign = 'center'; g.fillText('48', 0, 3); g.restore();
    [[x + 1, y + 8, 1], [x + w - 1, y + 7, -1]].forEach(function(c){
      var cg = g.createLinearGradient(c[0], c[1] - 4, c[0], c[1] + 4); cg.addColorStop(0, '#f2f4ff'); cg.addColorStop(1, '#8a90b5');
      g.fillStyle = cg; obsRR(c[2] > 0 ? c[0] : c[0] - 10, c[1] - 4, 10, 8, 2.5); g.fill();
      g.fillStyle = '#ffd23f'; g.fillRect(c[2] > 0 ? c[0] + 7 : c[0] - 9.5, c[1] - 2.5, 2.5, 5);
    });
  } else if(o.k === 'speaker'){   // caixa de retorno do palco, pulsando na batida
    var cg2 = g.createLinearGradient(x, y, x + w, y + h); cg2.addColorStop(0, '#3a3156'); cg2.addColorStop(1, '#16122a');
    g.fillStyle = cg2; obsRR(x, y, w, h, 5); g.fill();
    g.strokeStyle = '#5c4f8a'; g.lineWidth = 1.5; obsRR(x + .75, y + .75, w - 1.5, h - 1.5, 4.5); g.stroke();
    g.fillStyle = '#b9b3d6'; [[x, y], [x + w - 5, y], [x, y + h - 5], [x + w - 5, y + h - 5]].forEach(function(c){ obsRR(c[0], c[1], 5, 5, 1.5); g.fill(); });
    var pul = 1 + (Math.floor(frame / 8) % 2 ? .07 : 0), cx = x + w / 2, cy = y + h * .62;
    var wg = g.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 11 * pul); wg.addColorStop(0, '#6b5fa0'); wg.addColorStop(.6, '#2a2340'); wg.addColorStop(1, '#120f20');
    g.fillStyle = wg; g.beginPath(); g.arc(cx, cy, 11 * pul, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,111,181,.6)'; g.lineWidth = 1.4; g.beginPath(); g.arc(cx, cy, 12.5 * pul, 0, 7); g.stroke();
    g.fillStyle = '#9a8fd0'; g.beginPath(); g.arc(cx, cy, 3, 0, 7); g.fill();
    g.fillStyle = '#211b36'; g.beginPath(); g.arc(cx, y + h * .22, 4.5, 0, 7); g.fill(); g.fillStyle = '#8d84c2'; g.beginPath(); g.arc(cx, y + h * .22, 1.8, 0, 7); g.fill();
    g.fillStyle = Math.floor(frame / 10) % 2 ? '#b6ff3b' : '#4dd8ff'; g.shadowColor = g.fillStyle; g.shadowBlur = 6; g.fillRect(x + 7, y + h - 6, w - 14, 1.8); g.shadowBlur = 0;
  } else {   // lightsticks de verdade: cabo, tubo de luz e estrelinha no topo
    var c = o.pal;
    for(i = 0; i < 3; i++){
      var lx = x + i * 8 + 1, top = y + (i % 2) * 4, sw = Math.sin(frame * .15 + i) * .04;
      g.save(); g.translate(lx + 3, y + h); g.rotate(sw); g.translate(-(lx + 3), -(y + h));
      var hg = g.createLinearGradient(lx, 0, lx + 6, 0); hg.addColorStop(0, '#f6f3ff'); hg.addColorStop(1, '#b8b0d8');
      g.fillStyle = hg; obsRR(lx + .5, top + 19, 5, y + h - top - 19, 2); g.fill();
      g.fillStyle = '#2a2440'; g.fillRect(lx + .5, top + 23, 5, 2);
      g.shadowColor = c[i]; g.shadowBlur = 12;
      var tg = g.createLinearGradient(lx, 0, lx + 7, 0); tg.addColorStop(0, c[i]); tg.addColorStop(.5, '#ffffff'); tg.addColorStop(1, c[i]);
      g.fillStyle = tg; obsRR(lx - .5, top, 7, 20, 3.5); g.fill(); g.shadowBlur = 0;
      g.fillStyle = '#fff'; g.beginPath(); for(var q = 0; q < 10; q++){ var r2 = q % 2 ? 1.2 : 2.8, an = q * Math.PI / 5 - Math.PI / 2; g[q ? 'lineTo' : 'moveTo'](lx + 3 + Math.cos(an) * r2, top - 1.5 + Math.sin(an) * r2); } g.closePath(); g.fill();
      g.restore();
    }
  }
  g.restore();
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
function s2Rand(){
  if(!s2DailyMode) return Math.random();
  var t = (s2DailySeed += 0x6D2B79F5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function s2Rnd(a, b){ return a + s2Rand() * (b - a); }
function s2CosRand(){
  if(!s2DailyMode) return Math.random();
  var t=(s2DailyCosmeticSeed+=0x6D2B79F5)>>>0;
  t=Math.imul(t^(t>>>15),t|1);
  t^=t+Math.imul(t^(t>>>7),t|61);
  return ((t^(t>>>14))>>>0)/4294967296;
}
function s2CosRnd(a,b){return a+s2CosRand()*(b-a);}
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
// Gerador de obstáculos específicos de cada cenário + cartas (incluindo "Coro") + plataformas no Dome
function s2SpawnStage(){
  var st = S2_STAGES[s2StageIdx] || S2_STAGES[0];
  var id = st.id;
  var t = s2Rand(), o;

  // Se estiver no Desafio de Fim de Cenário (5 obstáculos no ritmo da música)
  if(s2Challenge && s2Challenge.active && s2Challenge.left > 0){
    var isHigh = (s2Challenge.left % 2 === 0) && (id === 'estudio' || id === 'geral' || id === 'backstage' || id === 'dome');
    if(isHigh){
      o = { k: id === 'estudio' ? 'refletor' : 'fita', w: 42, h: 46, high: true, x: nextX, y: GY - 64, challenge: true };
    } else {
      o = { k: id === 'ensaio' ? 'cone' : id === 'backstage' ? 'case' : id === 'geral' ? 'caixaluz' : 'speaker', w: 32, h: 40, x: nextX, y: GY - 40, challenge: true };
    }
    obs.push(o);
    items.push({ k:'star', x: o.x + o.w/2 - 9, y: isHigh ? GY - 24 : GY - o.h - 42, w:18, h:18, got:false, ct:'plain' });
    s2Challenge.left--;
    nextX += Math.max(155, sp * 26);
    if(s2Challenge.left === 0){
      // Cortina fecha logo após o 5º obstáculo do desafio
      s2Challenge.finishX = o.x + o.w + 40;
    }
    return;
  }

  // Obstáculos por cenário conforme a tabela aprovada
  if(id === 'rua'){
    if(t < 0.4) o = { k:'cable', w:56, h:12 };
    else if(t < 0.75) o = { k:'speaker', w:36, h:48 };
    else {
      var q2 = s2Rand();
      o = { k:'stick', w:24, h:42, pal: q2<.65?['#9b30d9','#b6ff3b','#4169e1']:q2<.85?['#4169e1','#ffe14d','#34d399']:['#ff6fb5','#4dd8ff','#ffe14d'] };
    }
    o.x = nextX; o.y = GY - o.h;
  } else if(id === 'ensaio'){
    // Sala de ensaio: Colchonetes, cones, garrafinhas de água
    if(t < 0.38) o = { k:'colchonete', w:54, h:16, x:nextX, y:GY-16 };
    else if(t < 0.74) o = { k:'cone', w:28, h:38, x:nextX, y:GY-38 };
    else o = { k:'garrafinha', w:24, h:34, x:nextX, y:GY-34 };
  } else if(id === 'backstage'){
    // Backstage do teatro: Araras de figurino, cases de equipamento, carrinho de maquiagem (anda!)
    if(t < 0.36) o = { k:'arara', w:40, h:50, x:nextX, y:GY-50 };
    else if(t < 0.70) o = { k:'case', w:42, h:38, x:nextX, y:GY-38 };
    else o = { k:'carrinho', w:44, h:40, x:nextX, y:GY-40, mv:-1.15, warn:true };
  } else if(id === 'estudio'){
    // Estúdio de TV: Câmera em trilho (anda!), cabos no chão, refletor baixo (exige abaixar!)
    if(t < 0.34) o = { k:'cable', w:56, h:12, x:nextX, y:GY-12 };
    else if(t < 0.68) o = { k:'camtrilho', w:40, h:44, x:nextX, y:GY-44, mv:-1.35, warn:true };
    else o = { k:'refletor', w:46, h:46, x:nextX, y:GY-72, high:true };
  } else if(id === 'festival'){
    // Festival de verão: Lanternas caídas, baldes de peixinho, taiko
    if(t < 0.35) o = { k:'lanterna', w:34, h:34, x:nextX, y:GY-34 };
    else if(t < 0.68) o = { k:'balde', w:36, h:28, x:nextX, y:GY-28 };
    else o = { k:'taiko', w:44, h:46, x:nextX, y:GY-46 };
  } else if(id === 'aeroporto'){
    // Aeroporto da turnê: Malas, esteira (empurra!), fãs com placas
    if(t < 0.36) o = { k:'mala', w:34, h:42, x:nextX, y:GY-42 };
    else if(t < 0.68) o = { k:'esteira', w:64, h:14, x:nextX, y:GY-14, push:true };
    else o = { k:'faplaca', w:32, h:46, x:nextX, y:GY-46 };
  } else if(id === 'geral'){
    // Ensaio geral: Escadas de equipe, caixas de luz, fitas de marcação (no chão ou suspensas para abaixar)
    if(t < 0.35) o = { k:'escada', w:34, h:52, x:nextX, y:GY-52 };
    else if(t < 0.70) o = { k:'caixaluz', w:40, h:38, x:nextX, y:GY-38 };
    else {
      var highFita = s2Rand() < 0.55;
      o = { k:'fita', w:48, h: highFita ? 44 : 12, x:nextX, y: highFita ? GY-70 : GY-12, high: highFita };
    }
  } else {
    // Dome do grande show: Caixas de retorno, canhões de luz/laser, fitas suspensas + Plataformas de 2 alturas!
    if(t < 0.36) o = { k:'speaker', w:36, h:48, x:nextX, y:GY-48 };
    else if(t < 0.72){
      var q3 = s2Rand();
      o = { k:'stick', w:24, h:42, x:nextX, y:GY-42, pal: q3<.5?['#9b30d9','#b6ff3b','#4169e1']:['#ff6fb5','#4dd8ff','#ffe14d'] };
    } else {
      o = { k:'fita', w:48, h:44, x:nextX, y:GY-70, high:true };
    }
    // No Dome, gera plataforma superior (2ª altura) com estrelas que valem mais!
    if(s2Rand() < 0.55){
      var pw2 = 150 + Math.floor(s2Rand() * 90);
      var px2 = nextX + 40;
      var py2 = GY - 82;
      s2Platforms.push({ x:px2, y:py2, w:pw2, h:10 });
      for(var si2 = 0; si2 < 4; si2++){
        items.push({
          k:'star',
          x: px2 + 22 + si2 * 34,
          y: py2 - 26,
          w:18, h:18, got:false, ct:'plain',
          upper:true // estrela do 2º andar vale 2x!
        });
      }
    }
  }
  obs.push(o);

  // Estrelas e Cartas (incluindo a nova carta "Coro"!)
  var r = s2Rand();
  if(r < 0.75){
    var n = 3, cx = o.x + o.w / 2;
    var cd = s2Rand() < 0.42 && (frame - lastCard > 1350);
    var q = s2Rand();
    // Sorteia entre plain, fever, ima e a nova carta 'coro'!
    var cty = q < 0.28 ? 'plain' : q < 0.54 ? 'fever' : q < 0.78 ? 'ima' : 'coro';
    if(cd) lastCard = frame;
    for(var i = 0; i < n; i++){
      var u = (i - 1) / 1;
      var starY = o.high ? (GY - 24) : (GY - o.h - 34 - (1 - u * u) * 32);
      items.push({
        k: (cd && i === 1) ? 'card' : 'star',
        x: cx + u * 46 - 8,
        y: starY,
        w: 18, h: 18, got: false, ct: cty
      });
    }
  }

  // Corredor de fãs (fila de fãs na beira do palco para dar high-five!)
  if(score >= s2NextFanRow && s2Rand() < 0.45){
    s2NextFanRow = score + 550 + Math.floor(s2Rand() * 450);
    var fx0 = o.x + o.w + 95;
    for(var fk = 0; fk < 5; fk++){
      s2FanRows.push({
        x: fx0 + fk * 28,
        y: GY - 28,
        w: 20, h: 28,
        hi5: false,
        cor: ['#ff6fb5','#b6ff3b','#4169e1','#a678ff','#ffe14d'][fk % 5]
      });
    }
  }

  var gap = sp * 40 + s2Rnd(110, 330);
  if(s2Rand() < 0.25) gap += s2Rnd(180, 440);
  nextX += gap;
}
function s2Plateia(x0, gap){
  if(score < 450 || s2CosRand() >= (score < 5000 ? 0.30 + ((score - 450) / 4550) * 0.45 : 0.90)) return;
  var cores = ['#9b30d9', '#b6ff3b', '#4169e1']; if(typeof sel !== 'undefined' && sel === 3 && typeof CU !== 'undefined') cores.push(CU.hair);
  var grupos = score >= 10000 ? 3 : score >= 5000 ? 2 : 1, mn = score >= 10000 ? 3 : 1, mx = score >= 10000 ? 8 : score >= 5000 ? 5 : score >= 2500 ? 3 : 2, esp = score >= 10000 ? 20 : score >= 5000 ? 26 : 34;
  for(var fg = 0; fg < grupos; fg++){
    var n = mn + Math.floor(s2CosRand() * (mx - mn + 1)), gx = x0 + s2CosRnd(10, Math.max(110, gap - 120));
    for(var fi = 0; fi < n; fi++) fans.push({ x: gx + fi * esp + s2CosRnd(-4, 4), y: GY - 15 - s2CosRnd(0, 7), color: cores[Math.floor(s2CosRand() * cores.length)], offset: s2CosRand() * 10 });
  }
}
function s2ObsNovo(o){
  g.save();
  // Destaque musical se for obstáculo do Desafio de Fim de Cenário
  if(o.challenge){
    g.strokeStyle = '#ffe14d';
    g.lineWidth = 2;
    g.strokeRect(o.x - 2, o.y - 2, o.w + 4, o.h + 4);
    g.font = '10px sans-serif';
    g.fillStyle = '#ffe14d';
    g.fillText('♪', o.x + o.w/2 - 3, o.y - 6);
  }
  // Seta de aviso para obstáculos que andam (carrinho de maquiagem e câmera em trilho)
  if(o.warn && o.x > P.x){
    var pulse = 0.55 + 0.45 * Math.sin(frame * 0.25);
    g.fillStyle = 'rgba(239,68,68,' + pulse + ')';
    g.font = '800 12px "M PLUS Rounded 1c",sans-serif';
    g.textAlign = 'center';
    g.fillText('◀', o.x - 10, o.y + o.h / 2 + 4);
  }

  if(o.k === 'cable'){
    g.fillStyle = '#222'; g.fillRect(o.x, o.y + 4, o.w, 6);
    g.fillStyle = '#ffd23f'; g.fillRect(o.x + 6, o.y + 2, 10, 10); g.fillRect(o.x + o.w - 16, o.y + 2, 10, 10);
  } else if(o.k === 'speaker'){
    g.fillStyle = '#111827'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = '#5a6b9a'; g.lineWidth = 2; g.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
    g.fillStyle = '#3a4a7a'; g.beginPath(); g.arc(o.x + o.w/2, o.y + 17, 9, 0, 7); g.fill();
    g.beginPath(); g.arc(o.x + o.w/2, o.y + 36, 5, 0, 7); g.fill();
  } else if(o.k === 'stick'){
    var c = o.pal || ['#9b30d9','#b6ff3b','#4169e1'];
    for(var i = 0; i < 3; i++){
      var lx = o.x + i * 9 + 2;
      g.fillStyle = '#ddd'; g.fillRect(lx, o.y + 16, 5, o.h - 16);
      g.fillStyle = c[i]; g.shadowColor = c[i]; g.shadowBlur = 10;
      g.fillRect(lx - 1, o.y + (i % 2) * 4, 7, 18); g.shadowBlur = 0;
    }
  } else if(o.k === 'colchonete'){
    // Colchonete dobrado azul/rosa de sala de ensaio
    g.fillStyle = '#38bdf8'; g.fillRect(o.x, o.y + 4, o.w, o.h - 4);
    g.fillStyle = '#0284c7'; g.fillRect(o.x, o.y + 9, o.w, 3);
    g.fillStyle = '#f472b6'; g.fillRect(o.x + 6, o.y, o.w - 12, 6);
  } else if(o.k === 'cone'){
    // Cone de marcação de coreografia
    g.fillStyle = '#f97316';
    g.beginPath(); g.moveTo(o.x + o.w/2, o.y); g.lineTo(o.x + o.w - 2, o.y + o.h); g.lineTo(o.x + 2, o.y + o.h); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.fillRect(o.x + 7, o.y + 14, o.w - 14, 5);
    g.fillStyle = '#ea580c'; g.fillRect(o.x, o.y + o.h - 4, o.w, 4);
  } else if(o.k === 'garrafinha'){
    // Kit de garrafinhas de água das Idols
    for(var gi = 0; gi < 2; gi++){
      var gx = o.x + gi * 12;
      g.fillStyle = '#bae6fd'; g.fillRect(gx + 2, o.y + 8, 9, o.h - 8);
      g.fillStyle = '#38bdf8'; g.fillRect(gx + 2, o.y + 16, 9, 8);
      g.fillStyle = gi === 0 ? '#ff6fb5' : '#a678ff'; g.fillRect(gx + 4, o.y + 2, 5, 6);
    }
  } else if(o.k === 'arara'){
    // Arara de figurino cintilante
    g.strokeStyle = '#cbd5e1'; g.lineWidth = 2.5;
    g.strokeRect(o.x + 4, o.y + 4, o.w - 8, o.h - 4);
    var cols = ['#ff6fb5','#9b30d9','#4169e1'];
    for(var ai = 0; ai < 3; ai++){
      g.fillStyle = cols[ai];
      g.beginPath(); g.moveTo(o.x + 8 + ai * 10, o.y + 8); g.lineTo(o.x + 16 + ai * 10, o.y + 8); g.lineTo(o.x + 18 + ai * 10, o.y + 36); g.lineTo(o.x + 6 + ai * 10, o.y + 36); g.closePath(); g.fill();
    }
  } else if(o.k === 'case'){
    // Flight case de equipamento de palco
    g.fillStyle = '#1e293b'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = '#94a3b8'; g.lineWidth = 2; g.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
    g.fillStyle = '#eab308'; g.fillRect(o.x + 12, o.y + 14, o.w - 24, 8);
  } else if(o.k === 'carrinho'){
    // Carrinho de maquiagem com rodinhas
    g.fillStyle = '#f472b6'; g.fillRect(o.x + 2, o.y + 10, o.w - 4, o.h - 16);
    g.fillStyle = '#fbcfe8'; g.fillRect(o.x + 4, o.y + 14, o.w - 8, 7);
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 2, 6, 8);
    g.fillStyle = '#a855f7'; g.fillRect(o.x + 18, o.y + 4, 8, 6);
    g.fillStyle = '#111827';
    g.beginPath(); g.arc(o.x + 9, o.y + o.h - 3, 4, 0, 7); g.arc(o.x + o.w - 9, o.y + o.h - 3, 4, 0, 7); g.fill();
  } else if(o.k === 'camtrilho'){
    // Câmera de TV em trilho
    g.fillStyle = '#334155'; g.fillRect(o.x + 8, o.y + 16, o.w - 16, o.h - 20);
    g.fillStyle = '#0f172a'; g.fillRect(o.x + 4, o.y + 4, o.w - 8, 14);
    g.fillStyle = '#38bdf8'; g.beginPath(); g.arc(o.x + 6, o.y + 11, 5, 0, 7); g.fill();
    g.fillStyle = '#ef4444'; g.beginPath(); g.arc(o.x + o.w - 8, o.y + 7, 2.5, 0, 7); g.fill();
  } else if(o.k === 'refletor'){
    // Refletor suspenso baixo (passar por baixo deslizando ▼)
    g.strokeStyle = '#64748b'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(o.x + o.w/2, 0); g.lineTo(o.x + o.w/2, o.y + 6); g.stroke();
    g.fillStyle = '#1e293b'; g.fillRect(o.x + 4, o.y, o.w - 8, 22);
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 18, o.w - 16, 6);
    var lg = g.createLinearGradient(0, o.y + 22, 0, GY);
    lg.addColorStop(0, 'rgba(253,224,71,.45)'); lg.addColorStop(1, 'rgba(253,224,71,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(o.x + 8, o.y + 24); g.lineTo(o.x + o.w - 8, o.y + 24); g.lineTo(o.x + o.w + 8, GY); g.lineTo(o.x - 8, GY); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.font = '800 10px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
    g.fillText('▼', o.x + o.w/2, o.y + 14);
  } else if(o.k === 'lanterna'){
    // Lanterna japonesa chōchin
    g.fillStyle = '#ef4444'; g.beginPath(); g.ellipse(o.x + o.w/2, o.y + o.h/2, o.w/2, o.h/2 - 2, 0, 0, 7); g.fill();
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 2, o.w - 16, 4); g.fillRect(o.x + 8, o.y + o.h - 6, o.w - 16, 4);
  } else if(o.k === 'balde'){
    // Balde de festival (kingyo sukui)
    g.fillStyle = '#f97316'; g.fillRect(o.x + 2, o.y + 6, o.w - 4, o.h - 6);
    g.fillStyle = '#38bdf8'; g.fillRect(o.x + 5, o.y + 8, o.w - 10, 6);
  } else if(o.k === 'taiko'){
    // Tambor Taiko
    g.fillStyle = '#78350f'; g.fillRect(o.x + 6, o.y + 28, o.w - 12, o.h - 28);
    g.fillStyle = '#dc2626'; g.beginPath(); g.arc(o.x + o.w/2, o.y + 20, 18, 0, 7); g.fill();
    g.fillStyle = '#fef3c7'; g.beginPath(); g.arc(o.x + o.w/2, o.y + 20, 13, 0, 7); g.fill();
  } else if(o.k === 'mala'){
    // Mala de turnê
    g.fillStyle = '#ec4899'; g.fillRect(o.x + 4, o.y + 10, o.w - 8, o.h - 14);
    g.strokeStyle = '#94a3b8'; g.lineWidth = 2; g.strokeRect(o.x + 11, o.y + 2, o.w - 22, 8);
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 18, 8, 6);
  } else if(o.k === 'esteira'){
    // Esteira de bagagem que empurra
    g.fillStyle = '#334155'; g.fillRect(o.x, o.y + 2, o.w, o.h - 2);
    g.fillStyle = '#38bdf8';
    for(var ei = 0; ei < 3; ei++){
      var ex = o.x + 10 + ((ei * 20 - frame * 1.5) % (o.w - 16) + (o.w - 16)) % (o.w - 16);
      g.fillRect(ex, o.y + 5, 6, 4);
    }
  } else if(o.k === 'faplaca'){
    // Fã com cartaz de apoio
    g.fillStyle = '#ff6fb5'; g.fillRect(o.x + 2, o.y, o.w - 4, 18);
    g.fillStyle = '#fff'; g.font = '800 8px sans-serif'; g.textAlign = 'center'; g.fillText('OSHI💖', o.x + o.w/2, o.y + 12);
    g.fillStyle = '#334155'; g.fillRect(o.x + 10, o.y + 18, 12, o.h - 18);
  } else if(o.k === 'escada'){
    // Escada de equipe técnica (Ensaio Geral)
    g.strokeStyle = '#fbbf24'; g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(o.x + 4, o.y + o.h); g.lineTo(o.x + o.w/2 - 2, o.y);
    g.moveTo(o.x + o.w - 4, o.y + o.h); g.lineTo(o.x + o.w/2 + 2, o.y);
    for(var si = 10; si < o.h; si += 11){
      g.moveTo(o.x + 6, o.y + si); g.lineTo(o.x + o.w - 6, o.y + si);
    }
    g.stroke();
  } else if(o.k === 'caixaluz'){
    // Caixa de luz / equipamento de iluminação
    g.fillStyle = '#1f2937'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = '#fde047'; g.lineWidth = 2; g.strokeRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
    g.fillStyle = '#fde047'; g.beginPath(); g.arc(o.x + o.w/2, o.y + o.h/2, 8, 0, 7); g.fill();
  } else if(o.k === 'fita'){
    // Fita de marcação (suspensa para deslizar ▼ ou no chão para pular)
    if(o.high){
      g.fillStyle = '#fde047'; g.fillRect(o.x, o.y + 10, o.w, 14);
      g.fillStyle = '#111827';
      for(var fi = 0; fi < o.w; fi += 12) g.fillRect(o.x + fi, o.y + 10, 6, 14);
      g.fillStyle = '#fff'; g.font = '800 10px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
      g.fillText('▼', o.x + o.w/2, o.y + 8);
    } else {
      g.fillStyle = '#fde047'; g.fillRect(o.x, o.y + 4, o.w, 6);
      g.fillStyle = '#ef4444'; g.fillRect(o.x + 4, o.y + 2, 8, 8); g.fillRect(o.x + o.w - 12, o.y + 2, 8, 8);
    }
  }
  g.restore();
}
// Center Run T2: only visual layers. Coordinates and simulation stay in the game.
function s2ArtActive(){ return s2StageIdx > 0; }
function s2ArtRect(x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function s2ArtLine(x,y,xx,yy,c,w){g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke();}
function s2ArtOval(x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
function s2ArtPoly(points,c){g.fillStyle=c;g.beginPath();points.forEach(function(p,i){if(i)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1]);});g.closePath();g.fill();}
function s2ArtGradient(y,h,a,b){var v=g.createLinearGradient(0,y,0,y+h);v.addColorStop(0,a);v.addColorStop(1,b);g.fillStyle=v;g.fillRect(0,y,W,h);}
function s2ArtRepeat(step,speed,fn){var offset=dist*speed;var first=Math.floor(offset/step);for(var n=first;n*step-offset<W+step;n++)fn(n*step-offset,n);}
function s2ArtBeam(x,y,tx,ty,width,c){s2ArtPoly([[x-4,y],[x+4,y],[tx+width,ty],[tx-width,ty]],c);}
function s2ArtStar(x,y,r,c){var p=[];for(var i=0;i<10;i++){var a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;p.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}s2ArtPoly(p,c);}
function s2ArtTruss(y,c){s2ArtLine(0,y,W,y,c,2);s2ArtLine(0,y+12,W,y+12,c,2);for(var x=0;x<W;x+=32){s2ArtLine(x,y,x+32,y+12,c);s2ArtLine(x,y+12,x+32,y,c);}}
// Small material details belong to existing architecture, never the running lane.
function s2ArtRound(x,y,w,h,r,c){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();}
function s2ArtGlow(x,y,r,c){var v=g.createRadialGradient(x,y,0,x,y,r);v.addColorStop(0,c);v.addColorStop(1,'rgba(255,238,213,0)');g.fillStyle=v;g.fillRect(x-r,y-r,r*2,r*2);}
// Local light/material helpers, with bounded gradients and no canvas filters.
function s2ArtShade(x,y,w,h,a,b,horizontal,r){
  if(w<=0||h<=0)return;
  var v=g.createLinearGradient(x,y,horizontal?x+w:x,horizontal?y:y+h);
  v.addColorStop(0,a);v.addColorStop(1,b);
  s2ArtRound(x,y,w,h,r||0,v);
}
function s2ArtContact(x,y,rx,ry,alpha){
  g.save();g.translate(x,y);g.scale(rx,ry);
  var v=g.createRadialGradient(0,0,0,0,0,1);v.addColorStop(0,'rgba(20,14,36,'+alpha+')');v.addColorStop(1,'rgba(20,14,36,0)');
  g.fillStyle=v;g.fillRect(-1,-1,2,2);g.restore();
}
function s2ArtWallWash(x,y,w,h,c){
  // Elliptical radial falloff avoids rectangular edges on illuminated walls.
  g.save();g.translate(x,y+h*.38);g.scale(w*.65,h*.8);
  var v=g.createRadialGradient(0,0,0,0,0,1);v.addColorStop(0,c);v.addColorStop(1,'rgba(255,238,213,0)');
  g.fillStyle=v;g.fillRect(-1,-1,2,2);g.restore();
}
function s2ArtBow(x,y,r,c){
  s2ArtPoly([[x,y],[x-r,y-r*.7],[x-r*.9,y+r*.65]],c);
  s2ArtPoly([[x,y],[x+r,y-r*.7],[x+r*.9,y+r*.65]],c);
  s2ArtOval(x,y,r*.24,r*.28,'#f6dce7');
}
function s2ArtPetal(x,y,r,c){for(var j=0;j<5;j++){var a=j*Math.PI*.4-Math.PI/2;s2ArtOval(x+Math.cos(a)*r*.65,y+Math.sin(a)*r*.65,r*.45,r*.45,c);}s2ArtOval(x,y,r*.2,r*.2,'#f8e9bc');}
// Reconstructed from the owner's visual reference; all actors and gameplay remain original.
function s2RefPanel(x,y,w,h,a,b,r){s2ArtShade(x,y,w,h,a,b,false,r||0);}
function s2RefPlane(x,y,scale){
  g.save();g.translate(x,y);g.scale(scale,scale);
  s2ArtContact(0,14,91,6,.13);
  s2ArtPoly([[-9,-4],[-36,-30],[-23,-31],[23,-3]],'#e8edf5');
  s2ArtPoly([[-62,-3],[-76,-34],[-64,-34],[-43,-4]],'#e7e6ef');
  s2ArtPoly([[-70,-29],[-76,-34],[-64,-34],[-59,-28]],'#ed8bc3');
  s2ArtOval(0,0,88,11,'#f8fbff');
  s2ArtShade(-78,2,155,5,'rgba(145,161,185,0)','rgba(145,161,185,.28)',false,2);
  s2ArtLine(-65,2,76,2,'#dc80b4',2.5);
  for(var j=0;j<21;j++)s2ArtRound(-62+j*6,-5,3,3,1,'#8392ad');
  s2ArtPoly([[0,1],[-26,23],[-7,25],[35,5]],'#e7edf7');
  s2ArtOval(16,12,9,4,'#c0cbdc');s2ArtOval(20,12,5,3,'#8596b1');
  s2ArtPoly([[70,-6],[82,-3],[76,-1],[69,-2]],'#8096b4');
  g.restore();
}
function s2RefDisplay(x,y,w,h,dome){
  var r=dome?9:h*.5;
  s2ArtContact(x+w*.5,y+h+10,w*.57,14,.23);
  s2ArtRound(x-3,y-3,w+6,h+6,r+2,dome?'#9db640':'#c9c7f8');
  s2ArtRound(x-1,y-1,w+2,h+2,r+1,'#24213f');
  g.save();g.beginPath();g.roundRect(x,y,w,h,r);g.clip();
  var v=g.createLinearGradient(x,y,x+w,y+h);v.addColorStop(0,dome?'#8129a8':'#6b46c2');v.addColorStop(.48,dome?'#cc359b':'#b74ad9');v.addColorStop(1,'#2499d7');g.fillStyle=v;g.fillRect(x,y,w,h);
  if(dome){
    for(var i=0;i<24;i++){var a=i*Math.PI/12+frame*.0006;var rr=w;var da=Math.PI/30;s2ArtPoly([[x+w*.5,y+h*.5],[x+w*.5+Math.cos(a)*rr,y+h*.5+Math.sin(a)*rr],[x+w*.5+Math.cos(a+da)*rr,y+h*.5+Math.sin(a+da)*rr]],i%2?'rgba(255,155,174,.09)':'rgba(114,68,218,.08)');}
    for(var j=1;j<5;j++){g.strokeStyle='rgba(255,199,229,.13)';g.lineWidth=1;g.beginPath();g.ellipse(x+w*.5,y+h*.5,h*.15+j*h*.19,h*.15+j*h*.19,0,0,Math.PI*2);g.stroke();}
    s2ArtGlow(x+w*.5,y+h*.5,h*.49,'rgba(255,193,123,.2)');
    s2ArtStar(x+w*.5,y+h*.48,Math.min(25,h*.19),'#ffe566');
  }else{
    for(var k=-2;k<12;k++)s2ArtPoly([[x+k*w/8,y],[x+(k+1)*w/8,y],[x+(k-2)*w/8,y+h],[x+(k-3)*w/8,y+h]],k%2?'rgba(255,201,253,.13)':'rgba(69,48,144,.12)');
    s2ArtOval(x+w*.5,y+h*.5,h*.28,h*.28,'rgba(240,177,255,.16)');
  }
  s2ArtShade(x,y,w,h,'rgba(255,255,255,.13)','rgba(18,11,49,.1)',false);
  for(var sy=y+3;sy<y+h;sy+=5)s2ArtLine(x,sy,x+w,sy,'rgba(241,217,255,.035)');
  g.restore();
  s2ArtLine(x+r,y-1,x+w-r,y-1,dome?'#dcdf74':'#eee1ff');
}
function s2DrawSceneryBg(){
  var id=S2_STAGES[s2StageIdx].id;if(id==='rua')return;
  var rear=GY-12,i,x;
  g.save();g.lineCap='round';g.lineJoin='round';
  if(id==='ensaio'){
    s2ArtGradient(0,GY,'#f2e9fc','#d4eaf5');
    s2RefPanel(0,0,W,20,'#f5e7ff','#d4b3e3');
    s2ArtLine(0,23,W,23,'#aa7ac7',2);s2ArtLine(0,26,W,26,'#fff2ff',2);
    s2ArtRepeat(290,.22,function(x){
      s2ArtRound(x+1,30,286,rear-28,3,'#c4b3dc');
      s2RefPanel(x+4,33,280,rear-34,'#eefaff','#cce7f2',2);
      s2ArtLine(x+5,35,x+282,35,'#fff',1);
      s2ArtPoly([[x+212,33],[x+230,33],[x+172,rear-4],[x+152,rear-4]],'rgba(255,255,255,.35)');
      s2ArtPoly([[x+241,33],[x+247,33],[x+195,rear-4],[x+189,rear-4]],'rgba(255,255,255,.17)');
      s2ArtShade(x+4,33,280,10,'rgba(115,113,161,.12)','rgba(115,113,161,0)',false);
      s2ArtRound(x+62,5,155,4,2,'#fff9ef');
    });
    s2ArtLine(0,GY-53,W,GY-53,'rgba(87,61,112,.13)',4);
    s2ArtRepeat(150,.22,function(x){s2ArtLine(x+70,GY-56,x+70,GY-45,'#ba9d7e',3);s2ArtLine(x+72,GY-56,x+72,GY-47,'#f4d9b2');});
    s2ArtLine(0,GY-58,W,GY-58,'#b28a60',5);s2ArtLine(0,GY-60,W,GY-60,'#ebce9e',2);
    s2RefPanel(0,GY-12,W,9,'#675078','#372347');
  }else if(id==='backstage'){
    s2ArtGradient(0,GY,'#1a102b','#4d235b');
    s2ArtRepeat(310,.2,function(x,n){
      s2ArtRect(x+5,18,6,GY-27,'#251333');s2ArtLine(x+12,18,x+12,GY-17,'rgba(171,94,169,.18)');
      s2ArtWallWash(x+149,20,230,GY-40,'rgba(249,174,188,.105)');
      s2ArtGlow(x+149,18,24,'rgba(255,220,166,.2)');s2ArtOval(x+149,18,2.5,2.5,'#ffe7b2');
      var doorY=GY-124;
      s2ArtRect(x+28,doorY+3,61,119,'rgba(13,6,23,.4)');
      s2RefPanel(x+23,doorY,60,122,'#d8a0d6','#a86ba9');
      s2RefPanel(x+27,doorY+4,52,116,'#63346d','#452455');
      s2ArtLine(x+30,doorY+7,x+75,doorY+7,'rgba(244,180,229,.45)');
      s2ArtLine(x+30,doorY+59,x+75,doorY+59,'#875487');
      s2ArtStar(x+53,doorY+26,7,'#f7d668');s2ArtOval(x+71,doorY+83,2,2,'#eccc88');
      if(n%2===0){
        var vx=x+127,vy=GY-106;
        s2ArtRound(vx-3,vy-3,84,61,4,'rgba(24,11,30,.4)');s2RefPanel(vx,vy,78,55,'#f9dea7','#bb8f70',5);
        s2RefPanel(vx+6,vy+6,66,43,'#ddf4ff','#a7d6e9',2);
        s2ArtPoly([[vx+20,vy+6],[vx+32,vy+6],[vx+14,vy+48],[vx+8,vy+48]],'rgba(255,255,255,.5)');
        for(i=0;i<6;i++){s2ArtOval(vx+7+i*13,vy+3,1.6,1.6,'#fff9d5');s2ArtOval(vx+7+i*13,vy+52,1.6,1.6,'#fff9d5');}
        s2ArtShade(vx+2,vy+61,75,12,'rgba(10,4,22,.4)','rgba(10,4,22,0)',false);
        s2ArtRound(vx-3,vy+58,85,5,2,'#c495bd');s2ArtLine(vx+8,vy+64,vx+8,GY-13,'#62336e',3);s2ArtLine(vx+70,vy+64,vx+70,GY-13,'#62336e',3);
        s2ArtRound(vx+24,GY-24,29,12,5,'#ca73b4');
      }else{
        var rx=x+124,ry=GY-99;
        s2ArtLine(rx,ry,rx+103,ry,'#d7c9e8',3);s2ArtLine(rx+6,ry,rx,GY-12,'#bca8d4',2);s2ArtLine(rx+97,ry,rx+103,GY-12,'#bca8d4',2);
        ['#ec8fcb','#90caef','#c4aff4','#f7d78d','#acdfbb'].forEach(function(c,j){var cx=rx+14+j*17;s2ArtLine(cx,ry+1,cx,ry+8,'#d8d1e8');s2ArtPoly([[cx-4,ry+7],[cx+4,ry+7],[cx+7,ry+44],[cx-7,ry+44]],c);s2ArtLine(cx+3,ry+10,cx+5,ry+42,'rgba(69,33,88,.19)');});
      }
    });
    s2RefPanel(0,GY-10,W,8,'#572f63','#23142f');s2ArtLine(0,GY-9,W,GY-9,'#b17fbe');
  }else if(id==='estudio'){
    s2ArtGradient(0,GY,'#101029','#202d52');
    s2ArtLine(0,13,W,13,'#6c668d',2);s2ArtLine(0,17,W,17,'#272138');
    var sw=Math.min(340,W*.66),sh=Math.min(138,sw*.45),sx=(W-sw)*.5,sy=Math.max(W<500?116:77,(GY-70-sh)*.5);
    for(i=0;i<3;i++){var fx=W*(.13+i*.37);s2ArtLine(fx,17,fx,51,'#45415b');s2ArtRect(fx-7,49,14,8,'#2d2745');s2ArtBeam(fx,57,fx+Math.sin(frame*.005+i)*16,GY-22,44,['rgba(169,135,229,.07)','rgba(132,180,234,.06)','rgba(235,141,209,.06)'][i]);}
    s2ArtLine(sx+sw*.24,17,sx+sw*.24,sy,'#68607d',1.5);s2ArtLine(sx+sw*.76,17,sx+sw*.76,sy,'#68607d',1.5);
    s2ArtWallWash(W*.5,sy-5,sw+70,sh+80,'rgba(138,91,231,.12)');s2RefDisplay(sx,sy,sw,sh,false);
    s2RefPanel(0,GY-8,W,8,'#172440','#11132b');
  }else if(id==='festival'){
    s2ArtGradient(0,GY,'#150c2e','#4a1b5a');
    for(i=0;i<18;i++)s2ArtOval((i*79+31)%W,30+(i*41)%Math.max(40,GY-160),.65,.65,'rgba(255,223,226,.25)');
    // Far silhouettes and one occasional stall keep the night open and readable.
    s2ArtRepeat(550,.12,function(x,n){
      var fy=GY-94;
      s2ArtPoly([[x-20,fy+10],[x+52,fy-14],[x+131,fy+10]],'#22132f');s2RefPanel(x-3,fy+10,118,84,'#281531','#1e1129');
      s2ArtRect(x+14,fy+35,13,8,'#786052');s2ArtRect(x+70,fy+40,12,8,'#6c5254');
    });
    s2ArtRepeat(620,.22,function(x,n){
      var bx=x+365,by=GY-103;
      s2ArtContact(bx+69,GY-10,83,9,.24);
      s2RefPanel(bx+5,by+8,126,85,'#82414b','#4a273d');s2RefPanel(bx+14,by+27,108,37,'#d79a53','#82523c');
      s2ArtPoly([[bx-5,by+12],[bx+15,by-3],[bx+122,by-3],[bx+141,by+12]],'#925141');
      for(i=0;i<7;i++)s2ArtRect(bx+2+i*19,by+12,18,12,i%2?'#f5d78e':'#d8934a');
      s2ArtShade(bx+14,by+24,108,10,'rgba(50,16,34,.35)','rgba(50,16,34,0)',false);
      s2ArtLine(bx+15,by+67,bx+123,by+67,'#e6a15e',4);
      ['#94b8dd','#e38ba3','#c2d58c','#bb8bcf'].forEach(function(c,j){s2ArtOval(bx+29+j*23,by+58,5.5,5.5,c);});
    });
    s2ArtRepeat(410,.18,function(x){
      s2ArtLine(x+20,50,x+20,GY-12,'#4e3540',5);
      g.strokeStyle='#a37683';g.lineWidth=1;g.beginPath();g.moveTo(x+20,61);g.quadraticCurveTo(x+225,82,x+430,61);g.stroke();
      for(i=0;i<8;i++){var xx=x+40+i*48,yy=63+Math.sin((20+i*48)/410*Math.PI)*9;s2ArtPoly([[xx,yy],[xx+10,yy+1],[xx+5,yy+11]],['#d4c98c','#d28eaf','#8cb6ca'][i%3]);}
      g.strokeStyle='#644555';g.beginPath();g.moveTo(x+20,112);g.quadraticCurveTo(x+225,136,x+430,112);g.stroke();
      for(i=0;i<6;i++){var lx=x+51+i*65,ly=116+Math.sin((31+i*65)/410*Math.PI)*10;s2ArtLine(lx,ly-2,lx,ly+6,'#81616b');s2ArtGlow(lx,ly+15,24,'rgba(255,174,110,.16)');s2ArtOval(lx,ly+15,6,9,i%3===1?'#f8dba6':'#de5e80');s2ArtOval(lx-1,ly+14,3,7,i%3===1?'#fff1c6':'#f58e9e');s2ArtRect(lx-3,ly+6,6,2,'#79504f');s2ArtRect(lx-3,ly+23,6,2,'#79504f');s2ArtLine(lx-5,ly+12,lx+5,ly+12,'rgba(143,66,65,.19)');}
    });
    s2RefPanel(0,GY-12,W,12,'#382135','#221628');
  }else if(id==='aeroporto'){
    s2ArtGradient(0,GY,'#63c4ef','#c4e8f4');
    s2ArtRepeat(430,.035,function(x){s2ArtOval(x+76,93,37,8,'rgba(245,252,255,.85)');s2ArtOval(x+99,90,22,9,'rgba(245,252,255,.85)');});
    var horizon=GY-133;
    s2RefPanel(0,horizon,W,97,'#a6b2c3','#75859e');s2ArtLine(0,horizon,W,horizon,'#d5e6ed',2);
    s2ArtRepeat(180,.05,function(x){s2ArtRect(x+15,horizon+51,89,3,'#eff3f5');});
    var px=W*.46-(dist*.045)%(W+400);if(px < -130)px+=W+400;
    s2RefPlane(px,horizon+44,.9);
    s2RefPlane(W+80-(frame*.2)%(W+620),65,.42);
    s2ArtRepeat(350,.18,function(x){
      s2ArtLine(x+155,22,x+155,GY-37,'rgba(100,143,173,.42)',2);
      s2ArtRect(x+310,22,17,GY-59,'rgba(80,127,156,.14)');s2ArtShade(x+300,22,19,GY-59,'#c7dce8','#f7fbfd',true);s2ArtRect(x+319,22,3,GY-59,'#b0c6d6');
      s2ArtPoly([[x+198,24],[x+224,24],[x+137,GY-39],[x+112,GY-39]],'rgba(255,255,255,.13)');
    });
    s2RefPanel(0,0,W,21,'#f4f8ff','#d5e2ed');s2ArtLine(0,23,W,23,'#a8becf',2);
    s2RefPanel(0,GY-37,W,29,'#edf2f8','#c7d5e3');
    s2ArtRepeat(500,.24,function(x){
      var yy=GY-28;
      s2ArtContact(x+337,GY-8,49,6,.13);
      for(i=0;i<3;i++){s2ArtRound(x+301+i*24,yy-5,21,14,4,'#efa3ce');s2ArtLine(x+304+i*24,yy-3,x+318+i*24,yy-3,'#ffd7ed');s2ArtRect(x+302+i*24,yy+9,20,3,'#d88db8');s2ArtLine(x+304+i*24,yy+12,x+304+i*24,GY-8,'#a2b4cc',2);}
      s2ArtLine(x+298,yy+13,x+373,yy+13,'#a8b8cc',2);
    });
    s2RefPanel(0,GY-8,W,8,'#1b415a','#11263b');
  }else if(id==='geral'||id==='dome'){
    var live=id==='dome';s2ArtGradient(0,GY,live?'#120a28':'#0b1423',live?'#3d1552':'#26394b');
    s2ArtTruss(19,live?'#51405f':'#626d80');
    if(live){
      var dw=Math.min(390,W*.7),dh=Math.min(128,dw*.4),dx=(W-dw)*.5,dy=W<500?112:57;
      g.strokeStyle='rgba(148,99,188,.24)';g.lineWidth=3;g.beginPath();g.moveTo(-30,GY-20);g.quadraticCurveTo(W*.5,-55,W+30,GY-20);g.stroke();
      s2ArtWallWash(W*.5,dy,dw+100,dh+85,'rgba(199,50,164,.12)');s2RefDisplay(dx,dy,dw,dh,true);
      for(var row=0;row<3;row++)s2ArtRepeat(17,.12+row*.025,function(x,n){var yy=GY-64+row*16+Math.sin(frame*.05+n)*2;var pal=['#c76aff','#b9ea55','#7a9df5','#f1b264'];s2ArtOval(x+4,yy+13,4,5,'#251630');s2ArtRect(x+9,yy,2,13,pal[((n+row)%4+4)%4]);});
    }else{
      for(var r=0;r<3;r++){
        var yy=GY-197+r*53;
        s2RefPanel(0,yy-7,W,45,'#25394d','#18283c');s2ArtLine(0,yy-7,W,yy-7,'#34475a');
        s2ArtRepeat(20,.06,function(x){s2ArtRound(x+3,yy,9,26,1,'#374b60');s2ArtLine(x+5,yy+2,x+5,yy+23,'#41566a');});
      }
      s2RefPanel(W*.12,GY-107,W*.3,89,'#101d2d','#0a1625');
      s2ArtRepeat(89,.04,function(x){s2ArtRect(x,GY-105,4,82,'#26394d');});
      s2ArtLine(W*.47,31,W*.47,GY-145,'#354152',5);
      for(i=0;i<5;i++)s2ArtRound(W*.47-4,42+i*17,9,12,1,'#17212f');
    }
    for(i=0;i<3;i++){var xx=W*(.13+i*.37);s2ArtRect(xx-6,31,12,7,'#31213b');s2ArtBeam(xx,38,xx+25*Math.sin(frame*.004+i),GY-18,live?47:32,live?['rgba(219,116,201,.075)','rgba(190,186,85,.065)','rgba(138,149,235,.07)'][i]:'rgba(197,217,241,.055)');}
    s2RefPanel(0,GY-10,W,10,live?'#352345':'#1c3144',live?'#21112f':'#112335');
  }
  g.restore();
}
function s2DrawSceneryFloor(){
  var id=S2_STAGES[s2StageIdx].id;
  var pal={ensaio:['#e6c08b','#c7a06e','#cb91e9'],backstage:['#672c78','#442450','#ff92d2'],estudio:['#10223e','#0b152d','#f1689f'],festival:['#3e2446','#251830','#e2ad55'],aeroporto:['#e7eff7','#c4d6e5','#4fc4ee'],geral:['#152638','#0b1524','#e4ce68'],dome:['#29113e','#130b24','#bde849']}[id];if(!pal)return;
  g.save();s2ArtGradient(GY,H-GY,pal[0],pal[1]);s2ArtRect(0,GY,W,2,pal[2]);
  s2ArtShade(0,GY+2,W,7,'rgba(16,9,29,.25)','rgba(16,9,29,0)',false);
  if(id==='ensaio'){
    for(var y=GY+18;y<H;y+=18){s2ArtLine(0,y,W,y,'rgba(127,85,43,.2)');s2ArtRepeat(180,1,function(x){s2ArtLine(x+(Math.floor(y/18)%2)*85,y,x+(Math.floor(y/18)%2)*85,y+18,'rgba(127,85,43,.17)');});}
    s2ArtShade(0,GY+3,W,H-GY-3,'rgba(255,237,197,.12)','rgba(255,237,197,0)',false);
  }else if(id==='backstage'){
    s2ArtLine(0,H-23,W,H-23,'#b08b54');s2ArtShade(0,GY+3,W,19,'rgba(248,133,211,.1)','rgba(248,133,211,0)',false);
  }else if(id==='festival'){
    for(var row=0;row<2;row++)s2ArtRepeat(70,1,function(x){s2ArtRound(x+row*32,GY+12+row*23,57,12,5,row?'#5a3a5d':'#70516d');s2ArtLine(x+5+row*32,GY+13+row*23,x+48+row*32,GY+13+row*23,'rgba(185,146,167,.15)');});
  }else if(id==='aeroporto'){
    s2ArtLine(0,GY+36,W,GY+36,'#88b7d1');s2ArtRepeat(83,.8,function(x){s2ArtLine(x,GY+3,x,H,'#afc8d9');});
    s2ArtRepeat(350,.18,function(x){s2ArtPoly([[x+198,GY+4],[x+224,GY+4],[x+153,H],[x+125,H]],'rgba(255,255,255,.2)');});
  }else if(id==='dome'){
    for(var yy=GY+13;yy<H;yy+=14)s2ArtLine(0,yy,W,yy,'rgba(169,99,205,.25)');
    s2ArtRepeat(75,1,function(x){s2ArtLine(x,GY+3,x+(x-W*.5)*.1,H,'rgba(159,87,190,.22)');});
    s2ArtShade(0,GY+3,W,18,'rgba(182,236,71,.1)','rgba(182,236,71,0)',false);
  }else if(id==='estudio'){
    s2ArtRepeat(190,.4,function(x){s2ArtPoly([[x+25,GY+31],[x+49,GY+31],[x+42,GY+36],[x+18,GY+36]],'#28628d');});
  }
  if(id==='dome')s2Platforms.forEach(function(pl){s2RefPanel(pl.x,pl.y,pl.w,pl.h,'#c7ec65','#81b84c');s2ArtRect(pl.x,pl.y,pl.w,2,'#eff6a7');s2ArtRect(pl.x+6,pl.y+pl.h,pl.w-12,Math.max(0,GY-pl.y-pl.h),'rgba(168,213,78,.17)');});
  g.restore();
}
function s2ArtHudBacking(){g.save();s2ArtRound(6,6,188,88,12,'rgba(23,12,37,.73)');g.restore();}
function s2DrawSeasonOverlay(){
  // Tema sazonal (ex.: Halloween) aparece por cima de TODOS os cenários!
  if(typeof temaAtual === 'function' && temaAtual() === 'halloween'){
    g.save();
    for(var hi = 0; hi < 3; hi++){
      var hx = ((hi * 260 - dist * 0.45) % (W + 80) + (W + 80)) % (W + 80) - 40;
      // Abóbora iluminada na beira do palco
      g.fillStyle = '#f97316';
      g.beginPath(); g.ellipse(hx, GY - 8, 9, 7, 0, 0, 7); g.fill();
      g.fillStyle = '#fde047';
      g.fillRect(hx - 4, GY - 10, 2, 2); g.fillRect(hx + 2, GY - 10, 2, 2);
      // Morceguinho voando no alto
      var batX = ((W - (frame * 0.9 + hi * 190) % (W + 100)) + W + 100) % (W + 100) - 50;
      var batY = 44 + (hi % 2) * 22 + Math.sin(frame * 0.2 + hi) * 5;
      g.fillStyle = '#1e1b4b';
      g.beginPath(); g.arc(batX, batY, 3, 0, 7); g.fill();
      g.fillRect(batX - 7, batY - 1, 5, 2); g.fillRect(batX + 2, batY - 1, 5, 2);
    }
    g.restore();
  }
}
// Desenha Corredor de Fãs, Parceiras do Coro, HUD de Combo/Cenário e Cortina de Palco
function s2DrawForeground(){
  // 1. Corredor de fãs na beira do palco (high-five!)
  s2FanRows.forEach(function(fn){
    var bounce = fn.hi5 ? -8 : Math.abs(Math.sin(frame * 0.15 + fn.x * 0.05)) * 3;
    g.save();
    g.fillStyle = '#334155';
    g.fillRect(fn.x + 4, fn.y + 10 + bounce, 12, 18);
    g.beginPath(); g.arc(fn.x + 10, fn.y + 5 + bounce, 6, 0, 7); g.fill();
    // Mãozinha erguida para o high-five
    g.fillStyle = fn.hi5 ? '#ffe14d' : fn.cor;
    g.font = '12px sans-serif'; g.textAlign = 'center';
    g.fillText(fn.hi5 ? '✨' : '🤚', fn.x + 10, fn.y - 2 + bounce);
    g.restore();
  });

  // 2. Carta "Coro": parceiras correndo na frente da Idol pegando estrelas!
  if(s2Coro && s2Coro.t > 0 && state === 'play'){
    var cPartners = s2Coro.partners || [];
    cPartners.forEach(function(pid, idx){
      var px = P.x + 68 + idx * 38 + Math.sin(frame * 0.12 + idx) * 6;
      var py = GY - 44 - Math.abs(Math.sin(frame * 0.25 + idx)) * 6;
      g.save();
      drawChar(CH[pid], px, py, Math.sin(frame * 0.55 + idx), 2, true);
      g.font = '10px sans-serif'; g.textAlign = 'center';
      g.fillText('🎶', px + 15, py - 6);
      g.restore();
    });
  }

  // 3. Efeito visual de deslizar (poeira brilhante nos pés quando abaixada)
  if(s2Sliding && state === 'play'){
    g.save();
    g.fillStyle = '#ff9ccd';
    for(var si = 0; si < 3; si++){
      g.beginPath();
      g.arc(P.x - 4 - si * 7 + (frame % 5), P.y + P.h - 3 - (si % 2) * 3, 2.5, 0, 7);
      g.fill();
    }
    g.restore();
  }

  // 4. HUD da Temporada 2: Nome do cenário atual, Combo de estrelas (x2 / x3), Coro e Desafio
  if(state === 'play' || state === 'over'){
    var st = S2_STAGES[s2StageIdx] || S2_STAGES[0];
    g.save();
    g.textAlign = 'left';
    g.font = '700 11px "M PLUS Rounded 1c",sans-serif';
    g.fillStyle = '#ffd6f0';
    // Sem a data aqui (ela vazava do quadro do placar); na Corrida do dia só o selo 📅.
    g.fillText((s2DailyMode ? '📅 ' : '📍 ') + tr(st.nome), 14, 80, 174);

    // Multiplicador de Combo de Estrelas no canto superior
    var mult = s2Combo >= 25 ? 3 : s2Combo >= 10 ? 2 : 1;
    if(s2Combo >= 3){
      g.textAlign = 'right';
      g.font = '800 ' + (mult > 1 ? '16' : '13') + 'px "M PLUS Rounded 1c",sans-serif';
      g.fillStyle = mult === 3 ? '#b6ff3b' : mult === 2 ? '#ffe14d' : '#ff9ccd';
      g.fillText('★ Combo ' + s2Combo + (mult > 1 ? ' (x' + mult + '!)' : ''), W - 16, 28);
    }

    // Contador do Coro se ativo
    if(s2Coro && s2Coro.t > 0){
      g.textAlign = 'right';
      g.font = '800 13px "M PLUS Rounded 1c",sans-serif';
      g.fillStyle = '#ff9ccd';
      g.fillText('🎶 Coro ' + Math.ceil(s2Coro.t / 60) + 's', W - 16, 48);
    }

    // Bônus pastel mais legível: ação dominante, 5 notas individuais, pulso ao acertar.
    if(s2Challenge && s2Challenge.active){
      var bc=s2Challenge, words=S2_BONUS_LABELS[LANG]||S2_BONUS_LABELS.pt;
      var expected=bc.beat%2===0?words.jump:words.slide;
      var w=Math.min(W-24,490), x=(W-w)/2, y=36, h=149, r=22;
      var grad=g.createLinearGradient(x,y,x+w,y+h);
      grad.addColorStop(0,'rgba(123,63,240,.96)');
      grad.addColorStop(.52,'rgba(255,111,181,.97)');
      grad.addColorStop(1,'rgba(65,105,225,.96)');
      g.save();
      g.fillStyle=grad;g.shadowColor='#ffabeb';g.shadowBlur=bc.flash>0?22:11;
      g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);
      g.quadraticCurveTo(x+w,y,x+w,y+r);
      g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);
      g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();g.fill();
      g.shadowBlur=0;g.strokeStyle='rgba(255,255,255,.78)';g.lineWidth=2;g.stroke();
      g.textAlign='center';g.fillStyle='#fff';
      g.font='900 23px "M PLUS Rounded 1c",sans-serif';
      g.fillText('✦ '+words.title+' ✦',W/2,y+29,w-28);
      // Placa clara de alto contraste: prioridade ao comando no celular.
      g.fillStyle='rgba(255,255,255,.94)';
      g.beginPath();g.moveTo(x+24,y+42);g.lineTo(x+w-24,y+42);
      g.quadraticCurveTo(x+w-12,y+42,x+w-12,y+54);
      g.lineTo(x+w-12,y+94);g.quadraticCurveTo(x+w-12,y+106,x+w-24,y+106);
      g.lineTo(x+24,y+106);g.quadraticCurveTo(x+12,y+106,x+12,y+94);
      g.lineTo(x+12,y+54);g.quadraticCurveTo(x+12,y+42,x+24,y+42);g.closePath();g.fill();
      g.fillStyle='#532887';g.font='900 41px "M PLUS Rounded 1c",sans-serif';
      g.fillText(expected,W/2,y+88,w-48);
      // As cinco estrelas representam notas individuais acertadas, não notas geradas.
      var baseX=W/2-114;
      for(var bi=0;bi<5;bi++){
        var earned=!!bc.hitsMask[bi], current=bc.beat===bi;
        var py=y+129;
        if(earned && bc.flash>0 && bi===bc.beat)py-=Math.sin((18-bc.flash)/18*Math.PI)*7;
        g.save();g.textAlign='center';g.font='900 27px sans-serif';
        g.fillStyle=earned?'#fff176':current?'#ffffff':'rgba(255,255,255,.60)';
        if(earned){g.shadowColor='#ffe14d';g.shadowBlur=11;}
        g.fillText(earned?'★':'☆',baseX+bi*57,py);
        g.restore();
      }
      g.fillStyle='#fff';g.font='800 19px "M PLUS Rounded 1c",sans-serif';
      g.textAlign='right';g.fillText(bc.hits+'/5',x+w-22,y+134,58);
      g.restore();
    }
    g.restore();
  }

  // 5. Cortina de Palco na transição de cenário (fecha e abre sem pausar o jogo!)
  if(s2Curtain){
    var p = Math.max(0, Math.min(1, s2Curtain.p));
    var halfW = (W / 2 + 24) * p;
    g.save();
    // Cortina esquerda e direita de veludo vermelho/roxo Idol com franja dourada
    var cgL = g.createLinearGradient(0, 0, halfW, 0);
    cgL.addColorStop(0, '#4c1d95'); cgL.addColorStop(0.7, '#a855f7'); cgL.addColorStop(1, '#ff8ecb');
    g.fillStyle = cgL;
    g.fillRect(0, 0, halfW, H);

    var cgR = g.createLinearGradient(W - halfW, 0, W, 0);
    cgR.addColorStop(0, '#ff8ecb'); cgR.addColorStop(0.3, '#52cfba'); cgR.addColorStop(1, '#4169e1');
    g.fillStyle = cgR;
    g.fillRect(W - halfW, 0, halfW, H);

    // Estrelinhas flutuantes suaves enquanto a cortina passa.
    g.save();g.textAlign='center';g.font='bold 18px sans-serif';
    var sparkleColors=['#ffe14d','#ffffff','#b6ff3b','#ffb3dd','#a6f4ff'];
    for(var sc=0;sc<16;sc++){
      var sx=(sc*61+frame*1.6)%W,sy=32+(sc*47)%Math.max(60,GY-48);
      g.globalAlpha=.36+.38*Math.abs(Math.sin(frame*.08+sc));
      g.fillStyle=sparkleColors[sc%sparkleColors.length];
      g.fillText('✦',sx,sy);
    }
    g.restore();
    // Bordas douradas da cortina
    g.fillStyle = '#fde047';
    g.fillRect(halfW - 6, 0, 6, H);
    g.fillRect(W - halfW, 0, 6, H);

    if(p > 0.65 && s2Curtain.nextIdx !== undefined){
      var nxtSt = S2_STAGES[s2Curtain.nextIdx] || S2_STAGES[s2StageIdx];
      g.fillStyle = '#fff';
      g.font = '800 22px "M PLUS Rounded 1c",sans-serif';
      g.textAlign = 'center';
      g.fillText('✨ ' + tr(nxtSt.nome) + ' ✨', W / 2, H / 2);
    }
    g.restore();
  }
}
function s2ShowSlideButton(){
  var sb = $('sb'); if(!sb) return;
  var touch = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  sb.style.display = state === 'play' && touch ? 'block' : 'none';
}
