/* TsuLiPa⭐World — mapa em dois níveis (Canvas 2D sobre SVGs dos bairros).
   TW_LUGARES = registro único dos lugares: cada um aponta para o card do hub que já existe,
   então login, cadeado, alertas e abertura continuam com a lógica original (nada duplicado). */
(function(){
  'use strict';
  var W=1600,H=1000,OX=0,OY=0,MW=1600,MH=1000;
  // IDs internos estáveis; os nomes de exibição podem mudar sem afetar os cards.
  var BAIRROS={
    palco:{id:'palco',box:[535,295,1070,540],lugares:['handshake','run','karaoke']},
    harajuku:{id:'harajuku',box:[1070,550,1500,795],lugares:['cafe','gacha','loja']},
    fofo:{id:'fofo',box:[170,560,610,795],lugares:['pet','perfil',null]},
    praca:{id:'praca',box:[635,555,960,775],lugares:['fa','enc','jornal']},
    arena:{id:'arena',box:[935,805,1155,930],lugares:[null,null,null]},
    ceu:{id:'ceu',box:[1160,120,1530,340],lugares:['sora','duo',null]}
  };
  var CENAS_RUA={
    palco:'mapa-rua-palco.svg',harajuku:'mapa-rua-harajuku.svg',
    fofo:'mapa-rua-fofo.svg',praca:'mapa-rua-praca.svg',
    arena:'mapa-rua-arena.svg',ceu:'mapa-rua-ceu.svg'
  };
  var ROTULOS_BAIRROS={
    palco:'Star Stage',harajuku:'Galeria do Brilho',fofo:'Vila das Tulipas',
    praca:'Praça Central',arena:'Star Arena',ceu:'Jardim das Nuvens'
  };
  var BAIRROS_EMOJI={palco:'🎤',harajuku:'🛍️',fofo:'🌷',praca:'⛲',arena:'🏟️',ceu:'☁️'};
  var cena='mundo',imagens={};
  // Marca exclusiva do mapa: preserva history.state usado pelo Karaoke e Center.
  var CHAVE_RUA_HIST='twWorldRuaV1';
  var TW_LUGARES=window.TW_LUGARES=[
    {id:'run',      card:'#hubCards [data-ir="run"]',      box:[600,140,1000,475]},
    {id:'karaoke',  card:'#hubCards [data-ir="karaoke"]',  box:[1050,250,1270,525]},
    {id:'sora',     card:'#hubCards [data-ir="sora"]',     box:[1270,80,1530,430]},
    {id:'loja',     card:'#hubCards [data-ir="loja"]',     box:[1190,540,1410,755]},
    {id:'gacha',    card:'#hubCards [data-ir="gacha"]',    box:[1000,610,1215,860]},
    {id:'perfil',   card:'#hubCards [data-ir="perfil"]',   box:[700,670,900,890]},
    {id:'pet',      card:'#hubCards [data-ir="pet"]',      box:[400,695,610,860]},
    {id:'cafe',     card:'#hubCards [data-ir="cafe"]',     box:[220,520,450,725]},
    {id:'handshake',card:'#hubCards [data-ir="handshake"]',box:[385,300,660,525]},
    {id:'duo',      card:'#hubCards [data-ir="duo"]',      box:[175,230,420,475]},
    {id:'jornal',   card:'#hubHoje .hubjornal',            box:[890,500,1090,640]},
    {id:'fa',       card:'#hubHoje .hubfa',                box:[530,555,750,690]},
    {id:'enc',      card:'#hubHoje .hubenc',               box:[670,490,930,670]}
  ];
  var NOMES={'Meu Perfil':{en:'My Profile',es:'Mi perfil',id:'Profilku',th:'โปรไฟล์ของฉัน',ja:'マイプロフィール'},
    'Pedido de fã':{en:'Fan request',es:'Pedido de fan',id:'Permintaan fan',th:'คำขอแฟน',ja:'ファンのお願い'},
    'Encontro do dia':{en:'Daily meetup',es:'Encuentro del día',id:'Temu hari ini',th:'นัดพบวันนี้',ja:'今日のミーティング'},
    'Galeria do Brilho':{en:'Sparkle Gallery',es:'Galería del Brillo',id:'Galeri Kilau',th:'แกลเลอรีประกายแสง',ja:'キラキラギャラリー'},
    'Vila das Tulipas':{en:'Tulip Village',es:'Villa de los Tulipanes',id:'Desa Tulip',th:'หมู่บ้านทิวลิป',ja:'チューリップ村'},
    'Praça Central':{en:'Central Square',es:'Plaza Central',id:'Alun-alun Pusat',th:'จัตุรัสกลาง',ja:'セントラル広場'},
    'Jardim das Nuvens':{en:'Cloud Garden',es:'Jardín de las Nubes',id:'Taman Awan',th:'สวนเมฆ',ja:'雲の庭'},
    'Entrar':{en:'Enter',es:'Entrar',id:'Masuk',th:'เข้าไป',ja:'入る'},
    'Jardim':{en:'Garden',es:'Jardín',id:'Taman',th:'สวน',ja:'ガーデン'}};
  // botões e rótulos em HTML do mapa, nos seis idiomas do site
  var UI={voltar:{pt:'◀ Mapa',en:'◀ Map',es:'◀ Mapa',id:'◀ Peta',th:'◀ แผนที่',ja:'◀ マップ'},
    zoom:{pt:'🔎 Aproximar',en:'🔎 Zoom in',es:'🔎 Acercar',id:'🔎 Perbesar',th:'🔎 ซูมเข้า',ja:'🔎 ズーム'},
    geral:{pt:'↖ Visão geral',en:'↖ Overview',es:'↖ Vista general',id:'↖ Lihat semua',th:'↖ ภาพรวม',ja:'↖ 全体を見る'},
    bairros:{pt:'Explorar bairros',en:'Explore districts',es:'Explorar barrios',id:'Jelajahi distrik',th:'สำรวจย่าน',ja:'街を探検'},
    rua:{pt:'Rua: ',en:'Street: ',es:'Calle: ',id:'Jalan: ',th:'ถนน: ',ja:'通り: '}};
  function ui(k){return UI[k][lang()]||UI[k].pt;}
  function rotulo(id){return nome(ROTULOS_BAIRROS[id]);}
  var DICA={pt:'👆 Arraste para passear',en:'👆 Drag to explore',es:'👆 Arrastra para pasear',id:'👆 Geser untuk jalan-jalan',th:'👆 ลากเพื่อเดินเล่น',ja:'👆 ドラッグでおさんぽ'};
  var PASSEIA={pt:'Passear pela cidade',en:'Stroll around town',es:'Pasear por la ciudad',id:'Jalan-jalan keliling kota',th:'เดินเล่นในเมือง',ja:'まちをおさんぽ'};
  var FECHA={pt:'Fechar o mapa',en:'Close the map',es:'Cerrar el mapa',id:'Tutup peta',th:'ปิดแผนที่',ja:'マップを閉じる'};
  var TIT={pt:'Mapa da cidade',en:'City map',es:'Mapa de la ciudad',id:'Peta kota',th:'แผนที่เมือง',ja:'まちのマップ'};
  var centrado=false,arte=null,cv=null,ctx=null,hover=null,anim=0,visivel=false;
  function lang(){return (typeof LANG==='string'&&LANG)||'pt';}
  function nome(t){var n=NOMES[t];if(n)return n[lang()]||t;
    for(var k in NOMES)if(t.indexOf(k)>=0&&NOMES[k][lang()])return t.replace(k,NOMES[k][lang()]);return t;}
  function card(l){return document.querySelector(l.card);}
  function estado(l){var c=card(l);if(!c)return null;
    return {alerta:c.classList.contains('tw-alert-pink'),off:c.disabled||c.getAttribute('aria-disabled')==='true'||c.hidden||c.classList.contains('tw-karaoke-locked')||!!c.querySelector('.tw-profile-lock')};}

  function montar(){
    var menu=document.getElementById('hubMenu');if(!menu)return;if(document.getElementById('twMapa')){posicionar();return;}
    var sec=document.createElement('section');sec.id='twMapa';sec.className='tw-mapa';
    sec.innerHTML='<button type="button" class="tw-mapa-botao" aria-expanded="false"><span class="tw-mapa-ico">🗺️</span><span class="tw-mapa-txt"><b></b><small></small></span><span class="tw-mapa-seta">▼</span></button><button type="button" class="tw-mapa-voltar" hidden>◀ Mapa</button><div class="tw-mapa-visao" hidden><button type="button" class="tw-mapa-zoom" aria-pressed="false">🔎 Aproximar</button></div><div class="tw-mapa-rolo" hidden><canvas width="'+MW+'" height="'+MH+'" role="img"></canvas></div><nav class="tw-mapa-bairros" aria-label="Explorar bairros" hidden></nav><span class="tw-mapa-dica" aria-hidden="true"></span>';
    menu.appendChild(sec);posicionar();
    cv=sec.querySelector('canvas');ctx=cv.getContext('2d');
    mostrarCena('mundo');
    cv.addEventListener('mousemove',function(e){var l=achar(e);if(l!==hover){hover=l;cv.style.cursor=l?'pointer':'';desenhar();}});
    var rolo=sec.querySelector('.tw-mapa-rolo');['pointerdown','touchstart','wheel'].forEach(function(ev){rolo.addEventListener(ev,function(){sec.classList.add('mexeu');},{passive:true,once:true});});
    cv.addEventListener('mouseleave',function(){hover=null;desenhar();});
    var toque=null,arrastou=false;
    cv.addEventListener('pointerdown',function(e){toque={x:e.clientX,y:e.clientY};arrastou=false;hover=achar(e);desenhar();},{passive:true});
    cv.addEventListener('pointermove',function(e){
      if(toque&&Math.hypot(e.clientX-toque.x,e.clientY-toque.y)>10){arrastou=true;hover=null;desenhar();}
    },{passive:true});
    cv.addEventListener('pointercancel',function(){toque=null;arrastou=true;hover=null;desenhar();});
    cv.addEventListener('pointerup',function(){toque=null;});
    cv.addEventListener('click',function(e){
      if(arrastou){arrastou=false;return;}
      if(!mapaAtivo()||mergulho)return;
      var l=achar(e);if(!l)return;
      if(cena==='mundo'){entrarRua(l.id);return;}
      if(l.voltar){voltarAoMundo();return;}
      if(l.bloom){window.bloomAbrir();return;}
      if(l.studio){window.studioAbrir();return;}
      if(l.battle){window.battleAbrir();return;}
      var c=card(l);if(c&&!c.disabled)c.click();
    });
    sec.querySelector('.tw-mapa-voltar').addEventListener('click',voltarAoMundo);
    // A arte completa cabe no celular, mas os nomes ficam pequenos: atalhos
    // acessíveis preservam alvos de toque e a lógica original mundo → rua.
    var atalhos=sec.querySelector('.tw-mapa-bairros');
    if(atalhos){
      atalhos.innerHTML=Object.keys(BAIRROS).map(function(id){
        return '<button type="button" data-tw-bairro="'+id+'"><span aria-hidden="true">'+BAIRROS_EMOJI[id]+'</span><span data-tw-rotulo="'+id+'">'+rotulo(id)+'</span></button>';
      }).join('');
      var marcar=function(e){var b=e.target&&e.target.closest&&e.target.closest('[data-tw-bairro]');
        var alvo=b&&cena==='mundo'?BAIRROS[b.getAttribute('data-tw-bairro')]:null;if(alvo!==hover){hover=alvo;desenhar();}};
      ['pointerover','focusin'].forEach(function(ev){atalhos.addEventListener(ev,marcar);});
      ['pointerleave','focusout'].forEach(function(ev){atalhos.addEventListener(ev,function(){if(hover&&cena==='mundo'){hover=null;desenhar();}});});
      atalhos.addEventListener('click',function(e){
        var botao=e.target&&e.target.closest&&e.target.closest('[data-tw-bairro]');
        if(botao&&cena==='mundo')entrarRua(botao.getAttribute('data-tw-bairro'));
      });
    }
    var zoomBotao=sec.querySelector('.tw-mapa-zoom');
    if(zoomBotao)zoomBotao.addEventListener('click',function(){
      if(cena!=='mundo'||!aberto)return;
      var aproximado=sec.classList.toggle('tw-mapa-zoomed');
      zoomBotao.setAttribute('aria-pressed',aproximado?'true':'false');
      zoomBotao.textContent=aproximado?ui('geral'):ui('zoom');
      centrado=false;
      if(aproximado)centralizar();
      else{var roloMapa=sec.querySelector('.tw-mapa-rolo');
        if(roloMapa){roloMapa.scrollLeft=0;roloMapa.scrollTop=0;}}
    });
    // Só intercepta Esc enquanto a rua do mapa está efetivamente aberta.
    document.addEventListener('keydown',function(e){
      if(!e||e.key!=='Escape'||e.defaultPrevented||!mapaAtivo()||(cena==='mundo'&&!mergulho))return;
      var alvo=e.target;
      if(alvo&&(/^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName||'')||alvo.isContentEditable))return;
      var jogo=document.getElementById('twPreviewJogo');
      if(jogo&&!jogo.hidden)return;
      // Não roubar Esc de diálogos de outros jogos/telas.
      if(document.querySelector('[aria-modal="true"]:not([hidden]),dialog[open]'))return;
      e.preventDefault();voltarAoMundo();
    });
    window.addEventListener('popstate',function(e){
      if(!mapaAtivo())return;
      // Nunca disputar o botão Voltar com as rotas do Center ou Karaoke.
      var hash=window.location&&window.location.hash;
      if(hash==='#center-run'||hash==='#karaoke')return;
      var rua=e&&e.state&&e.state[CHAVE_RUA_HIST];
      if(rua&&CENAS_RUA[rua]){if(cena!==rua)mostrarCena(rua);}
      else if(cena!=='mundo'||mergulho)mostrarCena('mundo');
    });
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){visivel=es[0].isIntersecting;if(visivel){centralizar();laco();}}).observe(cv);
    else visivel=true;
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(desenhar);
    sec.querySelector('.tw-mapa-botao').addEventListener('click',function(){abrir(!aberto);});
    var salvo=false;try{salvo=localStorage.getItem('tw_mapa_aberto')==='1';}catch(e){}
    abrir(salvo,true);
    textos();
  }
  var aberto=false;
  // no fim do "Meu mundo": logo antes do título Jogos (o hub refaz os cards, então reposiciona sempre)
  function posicionar(){var sec=document.getElementById('twMapa'),cards=document.getElementById('hubCards');if(!sec||!cards)return;
    var jg=cards.querySelector('.hubbt-jogos');if(jg){if(sec.nextElementSibling!==jg)cards.insertBefore(sec,jg);}
    else if(sec.parentNode!==cards)cards.appendChild(sec);}
  function abrir(sim,inicio){
    // Fechar o acordeão nunca deixa uma rua oculta presa no histórico.
    if(!sim&&aberto&&(cena!=='mundo'||mergulho))voltarAoMundo();
    aberto=!!sim;var sec=document.getElementById('twMapa');if(!sec)return;
    sec.classList.toggle('aberto',aberto);sec.querySelector('.tw-mapa-rolo').hidden=!aberto;sec.querySelector('.tw-mapa-botao').setAttribute('aria-expanded',aberto?'true':'false');
    if(!inicio){try{localStorage.setItem('tw_mapa_aberto',aberto?'1':'0');}catch(e){}}
    textos();if(aberto){centrado=false;setTimeout(function(){centralizar();desenhar();laco();},30);}}
  function textos(){var b=document.querySelector('#twMapa .tw-mapa-txt b'),m=document.querySelector('#twMapa .tw-mapa-txt small');
    if(b)b.textContent=TIT[lang()]||TIT.pt;var dc=document.querySelector('#twMapa .tw-mapa-dica');if(dc)dc.textContent=DICA[lang()]||DICA.pt;if(m)m.textContent=(aberto?FECHA:PASSEIA)[lang()]||(aberto?FECHA:PASSEIA).pt;
    if(cv)cv.setAttribute('aria-label',cena==='mundo'?(TIT[lang()]||TIT.pt):(ui('rua')+rotulo(cena)));
    var sec=document.getElementById('twMapa');if(!sec)return;
    var v=sec.querySelector('.tw-mapa-voltar');if(v)v.textContent=ui('voltar');
    var z=sec.querySelector('.tw-mapa-zoom');if(z)z.textContent=sec.classList.contains('tw-mapa-zoomed')?ui('geral'):ui('zoom');
    var nv=sec.querySelector('.tw-mapa-bairros');if(nv)nv.setAttribute('aria-label',ui('bairros'));
    if(sec.querySelectorAll)[].forEach.call(sec.querySelectorAll('[data-tw-rotulo]'),function(el){el.textContent=rotulo(el.getAttribute('data-tw-rotulo'));});}
  function centralizar(){var r=document.querySelector('#twMapa .tw-mapa-rolo');
    if(centrado||!r||!cv)return;
    var sec=document.getElementById('twMapa');
    // Mundo: no celular começa inteiro na janela, sem deslocamento automático.
    if(cena==='mundo'&&window.matchMedia&&window.matchMedia('(max-width:760px)').matches&&
        sec&&!sec.classList.contains('tw-mapa-zoomed')){
      r.scrollLeft=0;r.scrollTop=0;centrado=true;return;
    }
    var k=cv.getBoundingClientRect().width/MW;
    var px=cena==='mundo'?800:800,py=cena==='mundo'?610:450;
    r.scrollLeft=Math.max(0,(px-OX)*k-r.clientWidth/2);
    r.scrollTop=Math.max(0,(py-OY)*k-r.clientHeight/2);centrado=true;
  }
  function mapaAtivo(){
    var menu=document.getElementById('hubMenu'),hub=document.getElementById('hub');
    // O menu permanece montado enquanto um minijogo esconde o Hub.
    return aberto&&(!menu||!menu.hidden)&&(!hub||!hub.hidden)&&!!document.getElementById('twMapa');
  }
  function entrarRua(destino){
    if(!mapaAtivo()||mergulho||cena!=='mundo'||!CENAS_RUA[destino])return;
    // Cada visita cria apenas uma entrada extra; Voltar retorna ao mundo.
    try{
      var h=window.history;
      if(h&&typeof h.pushState==='function'){
        var base=h.state;
        var proximo=base&&typeof base==='object'&&!Array.isArray(base)?Object.assign({},base):{};
        proximo[CHAVE_RUA_HIST]=destino;
        h.pushState(proximo,'',window.location.href);
      }
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn('Histórico do mapa indisponível',e);}
    mergulhar(destino);
  }
  // Transição curta: a câmera aproxima do bairro escolhido e um anel pulsa nele (sem com "reduzir movimento")
  var mergulho=null;
  function mergulhar(destino){
    if(reduzMov||!ctx||!BAIRROS[destino]){mostrarCena(destino);return;}
    var transicao={id:destino,t0:performance.now()};
    mergulho=transicao;desenhar();
    setTimeout(function(){if(mergulho===transicao){mostrarCena(destino);}},420);
  }
  function voltarAoMundo(){
    if(cena==='mundo'&&!mergulho)return;
    var rua=mergulho?mergulho.id:cena,sec=document.getElementById('twMapa');
    var voltar=sec&&sec.querySelector('.tw-mapa-voltar');
    mostrarCena('mundo');
    if(voltar&&document.activeElement===voltar){
      var abrirBtn=sec.querySelector('.tw-mapa-botao');
      if(abrirBtn&&abrirBtn.focus)abrirBtn.focus({preventScroll:true});
    }
    // Consome somente a entrada criada pelo próprio mapa.
    try{
      var h=window.history;
      if(h&&h.state&&h.state[CHAVE_RUA_HIST]===rua&&typeof h.back==='function')h.back();
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn('Voltar do mapa indisponível',e);}
  }
  function mostrarCena(destino){
    if(destino!=='mundo'&&!CENAS_RUA[destino])return;
    mergulho=null;cena=destino;hover=null;centrado=false;
    W=1600;H=destino==='mundo'?1000:760;OX=0;OY=0;MW=W;MH=H;
    if(cv){cv.width=MW;cv.height=MH;cv.style.cursor='';}
    var sec=document.getElementById('twMapa');
    if(sec){var voltar=sec.querySelector('.tw-mapa-voltar');
      if(voltar)voltar.hidden=destino==='mundo';
      sec.setAttribute('data-cena',destino);
      // Toda volta ao mundo oferece novamente a visão geral, não um zoom antigo.
      sec.classList.toggle('tw-mapa-zoomed',false);
      var visao=sec.querySelector('.tw-mapa-visao');
      if(visao)visao.hidden=destino!=='mundo';
      var atalhos=sec.querySelector('.tw-mapa-bairros');
      if(atalhos)atalhos.hidden=destino!=='mundo';
      var botaoZoom=sec.querySelector('.tw-mapa-zoom');
      if(botaoZoom){botaoZoom.textContent=ui('zoom');botaoZoom.setAttribute('aria-pressed','false');}
      var rolo=sec.querySelector('.tw-mapa-rolo');
      if(rolo){rolo.scrollLeft=0;rolo.scrollTop=0;}
    }
    var arquivo=destino==='mundo'?'mapa-mundo.svg':CENAS_RUA[destino];
    if(!imagens[destino]){
      var img=new Image();imagens[destino]=img;
      img.onload=function(){if(cena===destino){arte=img;desenhar();centralizar();}};
      img.onerror=function(){if(window.TW_MAPA_DEBUG)console.warn('Arte do mapa indisponível:',arquivo);};
      img.src='./'+arquivo+'?v=5';
    }
    arte=imagens[destino];if(arte.complete&&arte.naturalWidth){desenhar();centralizar();}
    textos();
  }
  function achar(e){var r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*MW/r.width+OX,y=(e.clientY-r.top)*MH/r.height+OY;
    if(cena==='mundo'){
      var achado=null,area=Infinity;
      Object.keys(BAIRROS).forEach(function(id){var b=BAIRROS[id].box;
        if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]){
          var a=(b[2]-b[0])*(b[3]-b[1]);if(a<area){achado=BAIRROS[id];area=a;}
        }
      });return achado;
    }
    var ids=BAIRROS[cena].lugares,centros=[300,800,1300],achado=null;
    // Bloom⭐Garden!: a horta da Vila das Tulipas abre o jardim quando o servidor já tem o jogo
    if(cena==='fofo'&&typeof window.bloomAbrir==='function'&&x>=1100&&x<=1500&&y>=280&&y<=640)
      return {id:'bloom',bloom:true,box:[1100,280,1500,640]};
    // Photo⭐Studio! e Idol⭐Battle!: com login usa RPCs, sem login só treino.
    if(cena==='ceu'&&studioLigado()&&x>=1100&&x<=1500&&y>=280&&y<=640)
      return {id:'studio',studio:true,box:[1100,280,1500,640]};
    if(cena==='arena'&&battleLigado()&&x>=600&&x<=1000&&y>=280&&y<=640)
      return {id:'battle',battle:true,box:[600,280,1000,640]};
    ids.forEach(function(id,i){if(!id)return;var l=TW_LUGARES.find(function(v){return v.id===id;});
      if(!l)return;var b=[centros[i]-200,280,centros[i]+200,640];
      if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]&&card(l))achado={id:l.id,card:l.card,box:b};
    });return achado;
  }

  // Textos das artes (tools/mapa/textos.py): no canvas a fonte Mochiy Pop One funciona e o texto é traduzido.
  function texto(t){
    var s=nome(t.t);ctx.save();ctx.translate(t.x,t.y);if(t.r)ctx.rotate(t.r*Math.PI/180);
    // Rótulos com a mesma família tipográfica do hub; cabem na placa também
    // quando a tradução é maior (sem cortar o texto ou mudar o hitbox).
    var maxW=cena==='mundo'?310:(t.y<85?480:405);
    var tamanho=t.s;
    ctx.font=tamanho+'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';
    var largura=ctx.measureText(s).width;
    if(largura>maxW){tamanho=Math.max(8,tamanho*maxW/largura);ctx.font=tamanho+'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';}
    ctx.textBaseline='alphabetic';ctx.textAlign='left';
    ctx.shadowColor='rgba(35,20,87,.28)';ctx.shadowBlur=t.k?2:0;ctx.shadowOffsetY=t.k?1:0;
    var partes=s.split('★'),ws=partes.map(function(p){return ctx.measureText(p).width;}),st=ctx.measureText('★').width,
        tot=ws.reduce(function(a,b){return a+b;},0)+(partes.length-1)*st,x=t.a==='m'?-tot/2:t.a==='e'?-tot:0;
    ctx.lineJoin='round';ctx.lineWidth=t.w||4;
    partes.forEach(function(p,i){
      if(t.k){ctx.strokeStyle=t.k;ctx.strokeText(p,x,0);}
      ctx.fillStyle=t.f;ctx.fillText(p,x,0);x+=ws[i];
      if(i<partes.length-1){if(t.k){ctx.strokeStyle=t.k;ctx.strokeText('★',x,0);}ctx.fillStyle='#ffe14d';ctx.fillText('★',x,0);x+=st;}
    });
    ctx.restore();
  }
  function studioLigado(){return !!(window.TW_STUDIO_ON&&typeof window.studioAbrir==='function');}
  function battleLigado(){return !!(window.TW_BATTLE_ON&&typeof window.battleAbrir==='function');}
  function textosCena(){var T=window.TW_MAPA_TEXTOS&&window.TW_MAPA_TEXTOS[cena];if(!T)return;
    // O SVG gerado já usa as entradas reais. Não depender de login nem de
    // respostas RPC para substituir "Em breve": visitante vê "Entrar",
    // e Bloom abre o fluxo de login quando a conta for necessária.
    T.forEach(texto);
  }
  function desenhar(){
    if(!ctx||!arte||!arte.complete||!arte.naturalWidth)return;
    var tm=performance.now()/1000;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,MW,MH);
    ctx.setTransform(1,0,0,1,-OX,-OY);ctx.drawImage(arte,0,0,W,H);
    ceu(reduzMov?0:tm); atmosfera(reduzMov?0:tm); // mesmo horário de Brasília no mundo e nas ruas
    textosCena(); // depois do céu: à noite as placas ficam acesas, como letreiros
    if(cena==='mundo'){mundoVivo(tm);idols(tm);alertasMundo(tm);}
    else{detalhes(tm);andar(tm);alertasRua(tm);}
    if(mergulho&&cena==='mundo'){
      var bm=BAIRROS[mergulho.id].box,cx=(bm[0]+bm[2])/2,cy=(bm[1]+bm[3])/2,
          u=Math.min(1,(performance.now()-mergulho.t0)/420),e=u*u*(3-2*u),z=1+e*1.6;
      var fx=cx+(MW/2-cx)*e,fy=cy+(MH/2-cy)*e;   // o bairro desliza para o centro enquanto aproxima
      ctx.setTransform(z,0,0,z,fx-cx*z-OX,fy-cy*z-OY);ctx.drawImage(arte,0,0,W,H);textosCena();
      ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='rgba(255,255,255,'+(e*.55).toFixed(2)+')';ctx.fillRect(0,0,MW,MH);
      ctx.setTransform(1,0,0,1,-OX,-OY);
      if(!anim)requestAnimationFrame(desenhar);return;
    }
    if(hover&&!hover.voltar){
      var b=hover.box,cor=CORES_BAIRROS[cena==='mundo'?hover.id:cena]||'#a88bea';
      ctx.save();ctx.fillStyle='rgba(255,255,255,.12)';
      ctx.strokeStyle=cor;ctx.lineWidth=6;
      rr(b[0]+3,b[1]+3,b[2]-b[0]-6,b[3]-b[1]-6,24);ctx.fill();ctx.stroke();
      ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=2;
      rr(b[0]+9,b[1]+9,b[2]-b[0]-18,b[3]-b[1]-18,19);ctx.stroke();ctx.restore();
    }
  }
  // Indicadores consultam o DOM; abrir o jogo continua sendo click() no card original.
  function indicador(x,y,tipo,tm,numero){
    ctx.save();ctx.translate(x,y+Math.sin(tm*2.4+x*.01)*2.2);
    ctx.lineWidth=3;ctx.strokeStyle='#fff';
    ctx.fillStyle=tipo==='alerta'?'#ff4f9a':'#fff';
    ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill();ctx.stroke();
    ctx.textAlign='center';ctx.textBaseline='middle';
    if(tipo==='alerta'){
      ctx.fillStyle='#fff';ctx.font='19px "Mochiy Pop One",sans-serif';
      ctx.fillText(numero>1?String(numero):'!',0,1);
    }else{
      ctx.strokeStyle='#8d6ad8';ctx.lineWidth=3;
      ctx.beginPath();ctx.arc(0,-3,6,Math.PI,0);ctx.stroke();
      ctx.fillStyle='#8d6ad8';rr(-9,-3,18,13,4);ctx.fill();
    }
    ctx.restore();
  }
  function alertasMundo(tm){
    var pos={palco:[964,483],harajuku:[1390,743],fofo:[495,738],
      praca:[933,712],arena:[1112,870],ceu:[1477,285]};
    Object.keys(BAIRROS).forEach(function(id){
      var qtd=0;
      BAIRROS[id].lugares.forEach(function(lid){
        if(!lid)return;
        var l=TW_LUGARES.find(function(v){return v.id===lid;});
        if(l){var e=estado(l);if(e&&e.alerta)qtd++;}
      });
      if(qtd)indicador(pos[id][0],pos[id][1],'alerta',tm,qtd);
      var nm=0;BAIRROS[id].lugares.forEach(function(lid){if(lid)nm+=missoesDe(lid).length;});
      if(nm){var mx=pos[id][0],my=pos[id][1]-(qtd?42:0);   // em cima do alerta (!) do bairro
        ctx.save();ctx.translate(mx,my+Math.sin(tm*2.4+mx*.01)*2.2);ctx.fillStyle='#fff';ctx.strokeStyle='#7b3ff0';ctx.lineWidth=3;
        rr(-26,-17,52,34,17);ctx.fill();ctx.stroke();ctx.font='17px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        ctx.fillStyle='#4b2a9e';ctx.fillText('🎯'+nm,0,1);ctx.restore();}
    });
  }
  // Missões do dia (as mesmas da Agenda do Idol, vindas do servidor em hubMisDados) penduradas no lugar certo.
  var MIS_LUGAR={corra2:'run',corra3:'run',corra5:'run',estrelas50:'run',estrelas100:'run',estrelas150:'run',estrelas300:'run',
    pontos2000:'run',pontos5000:'run',tsulipa:'run',handshake:'handshake',cafe:'cafe',duo:'duo',pet:'pet',mini:'pet',coracao:'perfil',recado:'perfil'};
  function missoesDe(lugar){
    var L=(typeof hubMisDados!=='undefined'&&Array.isArray(hubMisDados))?hubMisDados:[];
    return L.filter(function(m){return m&&MIS_LUGAR[m.k]===lugar&&+m.meta>0&&!m.feito;});
  }
  function balaoMissao(x,y,m,tm){
    var ic=(typeof HUB_MIS!=='undefined'&&HUB_MIS[m.k]&&HUB_MIS[m.k][0])||'🎯',meta=Math.max(1,+m.meta||1),prog=Math.min(meta,Math.max(0,+m.prog||0));
    var txt=ic+' '+(prog>=meta?'✓':prog+'/'+meta);
    ctx.save();ctx.translate(x,y+Math.sin(tm*2+x*.01)*2);
    ctx.font='24px "Mochiy Pop One",sans-serif';var w=ctx.measureText(txt).width+30;
    ctx.fillStyle=prog>=meta?'#b6ff3b':'#fff';ctx.strokeStyle='#7b3ff0';ctx.lineWidth=3;rr(-w/2,-20,w,40,20);ctx.fill();ctx.stroke();
    ctx.fillStyle='#4b2a9e';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,0,1);ctx.restore();
  }
  function alertasRua(tm){
    BAIRROS[cena].lugares.forEach(function(id,i){if(!id)return;var ms=missoesDe(id);if(ms.length)balaoMissao([300,800,1300][i]-150,360,ms[0],tm);});
    var centros=[300,800,1300];
    BAIRROS[cena].lugares.forEach(function(id,i){
      if(!id)return;
      var l=TW_LUGARES.find(function(v){return v.id===id;});
      if(!l)return;
      var e=estado(l);if(!e)return;
      var tipo=e.alerta?'alerta':e.off?'cadeado':null;
      if(tipo)indicador(centros[i]+155,360,tipo,tm,1);
    });
  }

  // ruas (mesma geometria da arte): curva quadrática da praça até a porta de cada lugar
  var PRACA=[800,610];
  function rua(dest,curva){var x1=PRACA[0],y1=PRACA[1],x2=dest[0],y2=dest[1],mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1;
    return [x1,y1,mx-dy*curva,my+dx*curva,x2,y2];}
  function noPonto(r,u){var a=1-u;return [a*a*r[0]+2*a*u*r[2]+u*u*r[4],a*a*r[1]+2*a*u*r[3]+u*u*r[5]];}
  var RUAS=[rua([1150,470],-.12),rua([330,670],-.1),rua([1110,800],-.12),rua([500,800],.1)];
  var RUA_CASA=rua([800,830],0);
  // quem passeia: o seu Idol (casa ↔ praça) e Idols reais da vitrine do site (nada inventado)
  // Ruas de pedrinhas, abaixo das portas, com personagens existentes do site.
  function trajetoRua(i){
    var y=692+(i%3)*15;
    return [150,y,800,y-12,1450,y];
  }
  function passeantes(registro){
    var l=[];
    try{if(typeof hubAv==='function'&&typeof perfChar==='function'){
      var av=hubAv();if(av)l.push({av:av,rua:trajetoRua(0),u0:.06,u1:.94,fase:0,dono:true});
    }}catch(e){}
    try{if(typeof hubIdolsDados!=='undefined'&&hubIdolsDados&&Array.isArray(hubIdolsDados.idols))
      // a vitrine (vitrine_idols) entrega o visual em `avatar`; `av` fica aceito por compatibilidade
      hubIdolsDados.idols.slice(0,3).forEach(function(p,i){var av=p&&(p.av||p.avatar);if(av&&typeof av==='object')l.push({
        av:av,rua:trajetoRua(i+1),u0:.06,u1:.94,fase:(i+1)*.27
      });});}catch(e){}
    // No máximo um fã NPC conhecido na Praça Central, somente após
    // atendimento confirmado pelo Café nesta sessão e mesma conta.
    if(cena==='praca'){
      var fa=registro;
      if(fa&&fa.tipo==='reencontro'&&fa.visual&&fa.nome){
        var jeitoFa=/^(timido|animado|fofo)$/.test(fa.jeito)?fa.jeito:'fofo';
        var poseFa=jeitoFa==='timido'?'':jeitoFa==='animado'?'tchau':'coracao';
        var exprFa=jeitoFa==='timido'?0:jeitoFa==='animado'?3:6;
        l.push({av:{c:fa.visual,pose:poseFa,expr:exprFa},dono:false,
          nomeFa:fa.nome,jeitoFa:jeitoFa,rua:trajetoRua(1),u0:.06,u1:.94,fase:.38});
      }
    }
    return l;
  }
  // Na rua, cada Idol passeia de porta em porta (Café → Gacha → Shop…), para um pouco na frente de cada
  // lugar e às vezes solta um balãozinho. Ritmos diferentes para não andarem em fila. O pet segue o dono.
  var PORTAS=[300,800,1300],ROTA=[0,1,2,1],ANDA=150,PARA=2.4,BALOES=['♪','❤','★','♪','✨'];
  var reduzMov=false;try{reduzMov=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){}
  function posRua(i,tm){
    var vel=ANDA*(1+((i*37)%5)*.08),seg=[],tot=0;
    ROTA.forEach(function(a,k){var b=ROTA[(k+1)%ROTA.length],d=Math.abs(PORTAS[b]-PORTAS[a])/vel;seg.push([a,b,d]);tot+=d+PARA;});
    var t=((tm+i*7.3)%tot+tot)%tot;
    for(var k=0;k<seg.length;k++){var g=seg[k],xa=PORTAS[g[0]]+(i%2?-34:34)*(i>1?.5:1),xb=PORTAS[g[1]]+(i%2?-34:34)*(i>1?.5:1);
      if(t<PARA)return {x:xa,dir:xb>=xa?1:-1,mov:0,porta:g[0],volta:k,pausa:t};
      t-=PARA;
      if(t<g[2]){var u=t/g[2];u=u*u*(3-2*u);return {x:xa+(xb-xa)*u,dir:xb>=xa?1:-1,mov:1,volta:k};}
      t-=g[2];}
    return {x:PORTAS[0],dir:1,mov:0,porta:0,volta:0,pausa:0};
  }
  function balao(x,y,txt,a){
    ctx.save();ctx.globalAlpha=a;ctx.fillStyle='#fff';ctx.strokeStyle='#e2d4ff';ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(x,y,21,17,0,0,7);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(x-6,y+14);ctx.lineTo(x-2,y+25);ctx.lineTo(x+5,y+14);ctx.closePath();ctx.fill();
    ctx.font='18px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillStyle=txt==='❤'?'#ff6fb5':txt==='★'?'#f3b416':'#7b3ff0';ctx.fillText(txt,x,y+1);ctx.restore();
  }
  // Pequenos objetos de cena: são desenhados junto do Idol que já passeia.
  // Nenhum objeto altera inventário, coloca NPC novo ou cobre as entradas dos prédios.
  var PORTA_OBJETO={
    harajuku:{porta:0,k:'cafe'},palco:{porta:0,k:'handshake'},
    fofo:{porta:2,k:'bloom'},ceu:{porta:2,k:'studio'},arena:{porta:1,k:'battle'}
  };
  // O objeto acompanha a etapa realmente confirmada do Bloom⭐Garden!.
  // Os demais passeantes mantêm apenas o adereço estático de cenário.
  function tipoObjetoRua(k,registro,dono){
    if(k!=='bloom'||!dono||!registro)return k;
    if(registro.tipo==='bloom_plantar')return 'semente';
    if(registro.tipo==='bloom_colher')return 'flor';
    return k;
  }
  function objetoRua(x,y,dir,k,sc,pele,temLembranca,tm){
    // drawChar desenha a mão em (27, 31), para um avatar de largura 30.
    ctx.save();ctx.translate(x+dir*12*sc,y-13*sc);ctx.scale(dir*.82,.82);
    ctx.save();
    ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.strokeStyle='#654195';
    if(k==='cafe'){ // bandejinha com xícara
      ctx.translate(9,-9);
      ctx.fillStyle='#f0b7e6';rr(-15,7,31,4,2);ctx.fill();ctx.stroke();
      ctx.fillStyle='#fff9ef';rr(-6,-8,15,16,4);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(12,-1,5,-Math.PI/2,Math.PI/2);ctx.stroke();
      ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.moveTo(-3,-12);ctx.quadraticCurveTo(-8,-17,-3,-20);ctx.stroke();
    }else if(k==='bloom'){ // pequeno regador junto à mão
      ctx.translate(15,1);
      ctx.fillStyle='#8bd1bd';rr(-9,-7,21,16,5);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(10,-3);ctx.lineTo(20,-10);ctx.lineTo(22,-6);ctx.stroke();
      ctx.beginPath();ctx.arc(-10,-1,6,Math.PI/2,Math.PI*1.5);ctx.stroke();
      ctx.fillStyle='#fff5b7';ctx.fillRect(-1,-10,3,4);
    }else if(k==='semente'){ // pacotinho para a etapa de plantio
      ctx.translate(13,-4);
      ctx.fillStyle='#ffedcc';rr(-10,-10,19,21,4);ctx.fill();ctx.stroke();
      ctx.fillStyle='#db9a67';rr(-10,-10,19,5,3);ctx.fill();
      ctx.strokeStyle='#3a9f76';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(-1,4);ctx.lineTo(-1,-3);ctx.lineTo(-5,-6);ctx.moveTo(-1,-3);ctx.lineTo(4,-7);ctx.stroke();
    }else if(k==='flor'){ // flor recém-colhida, sem alterar o inventário
      ctx.translate(12,-7);
      ctx.strokeStyle='#379774';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,10);ctx.lineTo(0,-10);ctx.stroke();
      ctx.fillStyle='#ffc4de';
      for(var petala=0;petala<5;petala++){
        var ang=petala*Math.PI*2/5;
        ctx.beginPath();ctx.arc(Math.cos(ang)*6,-10+Math.sin(ang)*6,4.5,0,7);ctx.fill();
      }
      ctx.fillStyle='#ffe891';ctx.beginPath();ctx.arc(0,-10,3.6,0,7);ctx.fill();
    }else if(k==='studio'){ // câmera
      ctx.translate(11,-3);
      ctx.fillStyle='#d9b9fc';rr(-13,-8,27,20,4);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.arc(0,2,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();
      ctx.fillStyle='#8660b8';ctx.beginPath();ctx.arc(0,2,3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.fillRect(-9,-11,9,4);
    }else if(k==='handshake'){ // lightstick
      ctx.translate(0,-5);
      ctx.strokeStyle='#6f55b7';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(0,12);ctx.lineTo(0,-4);ctx.stroke();
      ctx.fillStyle='#ff82bf';ctx.strokeStyle='#fff';ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(0,-11,8,0,Math.PI*2);ctx.fill();ctx.stroke();
    }else if(k==='battle'){ // microfone
      ctx.translate(0,-5);
      ctx.strokeStyle='#8164a8';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-2,10);ctx.lineTo(5,-7);ctx.stroke();
      ctx.fillStyle='#f8dcff';ctx.strokeStyle='#6f55b7';ctx.lineWidth=2;
      ctx.beginPath();ctx.ellipse(7,-11,7,9,.3,0,Math.PI*2);ctx.fill();ctx.stroke();
    }
    ctx.restore();
    // Pequenos sinais visuais apenas no objeto do jogador e após atividade
    // confirmada. Aproveitam o relógio do mapa: sem timer, áudio ou save.
    if(temLembranca&&!reduzMov){
      ctx.save();ctx.globalAlpha=.35+.5*Math.max(0,Math.sin(tm*3));
      if(k==='cafe'){
        ctx.strokeStyle='#fff7ed';ctx.lineWidth=1.8;
        for(var vapor=0;vapor<2;vapor++){
          ctx.beginPath();ctx.moveTo(6+vapor*7,-25);
          ctx.quadraticCurveTo(2+vapor*7,-31,8+vapor*7,-38);ctx.stroke();
        }
      }else if(k==='bloom'){
        ctx.fillStyle='#a9eaff';
        for(var gota=0;gota<2;gota++){
          ctx.beginPath();ctx.ellipse(29+gota*5,-14+gota*8,2,3,-.2,0,7);ctx.fill();
        }
      }else if(k==='flor'||k==='semente'){
        ctx.fillStyle='#fff0a3';ctx.beginPath();ctx.arc(17,-25,2.7,0,7);ctx.fill();
      }
      ctx.restore();
    }
    // Os dedos ficam à frente da alça, da base ou do cabo.
    ctx.fillStyle=pele;ctx.beginPath();ctx.ellipse(0,0,3,2.5,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function andar(tm){
    if(typeof perfChar!=='function'||typeof drawChar!=='function'||typeof perfCharContorno!=='function')return;
    var sc=1.45,oS=state,oPw=pw,oDpw=dpw,oR=rankI,oSa=sash,oA=accSel,oF=frame,oP=charPose;
    try{
      state='play';pw=null;dpw=null;rankI=0;sash=false;accSel='';frame=reduzMov?0:tm*60;
      // A recordação vem de uma atividade confirmada; sem isso, apenas o
      // segundo passeante pode usar um pequeno adereço decorativo do bairro.
      var registro=window.TWVidaCidade&&typeof window.TWVidaCidade.sinalCena==='function'
        ?window.TWVidaCidade.sinalCena(cena):null;
      var objeto=PORTA_OBJETO[cena],parados=[];
      var rua=passeantes(registro).map(function(p,i){
        var fixo=p.dono&&registro&&objeto?objeto.porta:i%3;
        if(p.dono&&registro&&cena==='praca')fixo=1;
        var q=reduzMov?{x:PORTAS[fixo]+(i>2?60:0),dir:1,mov:0,porta:fixo,volta:0}:posRua(i,tm);
        q.p=p;q.i=i;q.y=738+(i%3)*8;return q;/* abaixo das placas */
      });
      var fa=rua.find(function(q){return q.p.nomeFa;});
      var meuIdol=rua.find(function(q){return q.p.dono;});
      var reencontro=fa&&meuIdol&&!meuIdol.mov&&meuIdol.porta===1;
      var reconhecendo=reencontro&&!reduzMov&&meuIdol.pausa<.35;
      var despedindo=reencontro&&!reduzMov&&meuIdol.pausa>PARA-.65;
      if(fa){
        // O fã espera na Praça. O gesto acontece quando o Idol para por perto.
        fa.x=900;fa.y=754;fa.mov=0;fa.dir=-1;
        if(reencontro)meuIdol.dir=1;
      }
      rua.sort(function(a,b){return a.y-b.y;})   // quem está mais embaixo fica na frente
        .forEach(function(q){
        var p=q.p,c=perfChar(p.av),bob=q.mov?-Math.abs(Math.sin(tm*8+q.i))*2.4*sc:0;
        var segurando=!q.mov&&objeto&&q.porta===objeto.porta&&
          ((p.dono&&registro)||(q.i===1&&!p.dono));
        var pose=q.mov||segurando?'':(p.av.pose||'');
        if(reencontro&&q===meuIdol)pose=reconhecendo?'':'tchau';
        if(p.nomeFa){
          if(!reencontro||reconhecendo)pose='';
          else if(despedindo)pose=p.jeitoFa==='timido'?'':'tchau';
        }
        var expressao=p.nomeFa?(reencontro&&!reconhecendo?p.av.expr:2):(+p.av.expr||2);
        ctx.fillStyle='rgba(30,10,60,.2)';ctx.beginPath();ctx.ellipse(q.x,q.y,8*sc,1.8*sc,0,0,7);ctx.fill();
        ctx.save();if(q.dir<0){ctx.translate(q.x,0);ctx.scale(-1,1);ctx.translate(-q.x,0);}
        perfCharContorno(ctx,q.x-15*sc,q.y-44*sc+bob,sc,function(){charPose=pose;drawChar(c,0,0,q.mov?1:0,expressao,false);});
        ctx.restore();
        if(segurando){
          ctx.save();
          ctx.globalAlpha=reduzMov?1:Math.min(1,q.pausa*5,(PARA-q.pausa)*5);
          var tipoSegurado=tipoObjetoRua(objeto.k,registro,p.dono);
          objetoRua(q.x,q.y,q.dir,tipoSegurado,sc,c.skin,!!p.dono&&!!registro,tm);
          ctx.restore();
        }
        if(!q.mov)parados.push(q);
        if(p.nomeFa&&!q.mov){
          // Identificação simples, sem links, sem DOM novo e sem alterar hitboxes.
          var etiqueta=('💌 '+p.nomeFa).slice(0,28);
          ctx.save();ctx.font='13px "M PLUS Rounded 1c",sans-serif';
          var largura=Math.min(150,ctx.measureText(etiqueta).width+22);
          ctx.fillStyle='rgba(255,247,255,.96)';ctx.strokeStyle='#bfa4ed';ctx.lineWidth=2;
          rr(q.x-largura/2,q.y-101,largura,26,11);ctx.fill();ctx.stroke();
          ctx.fillStyle='#674190';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.fillText(etiqueta,q.x,q.y-88,largura-16);ctx.restore();
          if(reencontro&&!reconhecendo){
            var gesto=p.jeitoFa==='timido'?'…':p.jeitoFa==='animado'?'♪':'♥';
            var cor=p.jeitoFa==='timido'?'#9e83bc':p.jeitoFa==='animado'?'#d88731':'#ec6fa8';
            if(despedindo)gesto=p.jeitoFa==='timido'?'♡':'✦';
            var pausa=meuIdol.pausa;
            var alfa=reduzMov?1:Math.min(1,pausa*3,(PARA-pausa)*3);
            ctx.save();ctx.globalAlpha=alfa;ctx.fillStyle=cor;
            ctx.font='18px "Mochiy Pop One",sans-serif';ctx.textAlign='center';
            ctx.fillText(gesto,q.x+largura/2+15,q.y-87);ctx.restore();
          }
        }
        // parado numa porta: de vez em quando um balãozinho (♪ ❤ ★), que aparece e some suave
        if(!q.mov&&!p.nomeFa&&!reduzMov&&!(reencontro&&p.dono)&&(q.volta+q.i)%2===0){
          var fase=q.pausa,a=Math.min(1,fase*3,(PARA-fase)*3);
          balao(q.x+(q.dir<0?-40:40),q.y-44*sc+4,BALOES[(q.volta+q.i)%BALOES.length],Math.max(0,a));
        }
        // o pet vem atrás andando; quando o dono para, ele senta do lado
        var pet=typeof perfPetDoAvatar==='function'?perfPetDoAvatar(p.av):null;
        if(pet&&typeof perfDesenharPetEm==='function'){
          var px=q.x-q.dir*(q.mov?40:30),hop=q.mov?-Math.abs(Math.sin(tm*8+q.i+1.3))*6:0;
          ctx.fillStyle='rgba(30,10,60,.16)';ctx.beginPath();ctx.ellipse(px,q.y+2,8,1.8,0,0,7);ctx.fill();
          perfDesenharPetEm(ctx,pet,px,q.y-14+hop,sc*.5,frame);
          // O Pet também reconhece a pausa do Idol diante do fã conhecido.
          // Não sugere amizade nova nem altera estado: só aparece durante o reencontro.
          if(reencontro&&q===meuIdol&&!reconhecendo&&!despedindo){
            ctx.save();
            ctx.globalAlpha=reduzMov?1:Math.max(0,Math.min(1,meuIdol.pausa*2,(PARA-meuIdol.pausa)*2));
            ctx.font='17px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.fillStyle='#ed78ad';
            ctx.fillText('♡',px+(q.dir<0?-12:12),q.y-45);
            ctx.restore();
          }
        }
      });
      // Um encontro é só um aceno entre avatares que já estão no passeio:
      // sem afirmar amizade, encontro real ou recorde. Nunca acima de 1/rua.
      if(!reduzMov&&parados.length>1&&!reencontro&&tm%12<3){
        var meu=parados.find(function(q){return q.p.dono;});
        var vizinho=meu&&parados.find(function(q){
          return !q.p.dono&&!q.p.nomeFa&&Math.abs(q.x-meu.x)<105&&Math.abs(q.y-meu.y)<23;
        });
        if(vizinho){
          ctx.save();ctx.font='23px sans-serif';ctx.textAlign='center';
          ctx.globalAlpha=Math.min(1,tm%12,3-tm%12);
          ctx.fillText('♡',(meu.x+vizinho.x)/2,Math.min(meu.y,vizinho.y)-99);
          ctx.restore();
        }
      }
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn('mapa andar',e);}finally{state=oS;pw=oPw;dpw=oDpw;rankI=oR;sash=oSa;accSel=oA;frame=oF;charPose=oP;}
  }
  // Mundo vivo, discreto: gotinhas na fonte da Praça Central, nuvenzinhas passando e brilhos nos bairros
  var BRILHOS_MUNDO=[[640,330,7],[960,330,6],[1150,560,6],[1440,620,5],[300,560,6],[520,780,5],[1180,860,5],[1450,200,7],[1210,190,5],[700,560,5]];
  function mundoVivo(tm){
    if(reduzMov)return;
    ctx.save();
    for(var g=0;g<10;g++){var f=((tm*.9+g/10)%1),lado=g%2?1:-1,dx=lado*(10+(g%5)*6)*f,y=596-38*f*(1-f)*4+f*34;
      ctx.globalAlpha=.85*(1-f*.6);ctx.fillStyle=g%3?'#c8f1ff':'#ffffff';ctx.beginPath();ctx.arc(800+dx,y,2.6,0,7);ctx.fill();}
    // cachoeira do laguinho (mundo2.py: lx=300, ly=856): faixas brancas descendo e espuma na base
    for(var c=0;c<6;c++){var fc=((tm*.9+c/6)%1),cx0=272+(c%3)*7,cy0=872+fc*84;ctx.globalAlpha=.75*Math.sin(fc*Math.PI);
      ctx.strokeStyle='#ffffff';ctx.lineWidth=2.5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx0-fc*3,cy0);ctx.lineTo(cx0-fc*3-1,cy0+14);ctx.stroke();}
    for(var e=0;e<5;e++){var fe=((tm*.5+e/5)%1),mx=282+(e%2?1:-1)*(4+fe*16),my=958+fe*14;   // névoa onde a água se desfaz no ar
      ctx.globalAlpha=.55*(1-fe);ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(mx,my,6+fe*12,0,7);ctx.fill();}
    for(var n=0;n<3;n++){var x=((tm*(9+n*4)+n*620)%1900)-150,y2=60+n*70;ctx.globalAlpha=.55;ctx.fillStyle='#ffffff';
      ctx.beginPath();ctx.ellipse(x,y2,46,15,0,0,7);ctx.ellipse(x-22,y2+4,26,12,0,0,7);ctx.ellipse(x+24,y2-6,28,14,0,0,7);ctx.fill();}
    BRILHOS_MUNDO.forEach(function(b,i){var a=Math.max(0,Math.sin(tm*1.6+i*1.4));if(a<.05)return;var r=b[2]*(.6+a*.6);
      ctx.globalAlpha=a*.9;ctx.fillStyle=i%3?'#ffffff':'#fff3a8';ctx.beginPath();
      ctx.moveTo(b[0],b[1]-r);ctx.quadraticCurveTo(b[0]+r*.18,b[1]-r*.18,b[0]+r,b[1]);ctx.quadraticCurveTo(b[0]+r*.18,b[1]+r*.18,b[0],b[1]+r);
      ctx.quadraticCurveTo(b[0]-r*.18,b[1]+r*.18,b[0]-r,b[1]);ctx.quadraticCurveTo(b[0]-r*.18,b[1]-r*.18,b[0],b[1]-r);ctx.fill();});
    ctx.restore();
  }
  // Detalhes vivos de cada rua, discretos (desligados com "reduzir movimento" do sistema)
  function detalhes(tm){
    if(reduzMov)return;
    ctx.save();
    if(cena==='fofo'||cena==='ceu'){   // pétalas (Vila das Tulipas) / floquinhos de nuvem (Jardim das Nuvens)
      for(var i=0;i<16;i++){var sp=18+(i*7)%14,x=((i*233+tm*sp)%1700)-50,y=((i*97+tm*(22+(i*5)%11))%700)+20,r=tm*(1+(i%3)*.4)+i;
        ctx.save();ctx.translate(x+Math.sin(tm+i)*14,y);ctx.rotate(r);ctx.globalAlpha=.75;
        ctx.fillStyle=cena==='fofo'?(i%2?'#ffb3d6':'#ffd6ea'):'#ffffff';ctx.beginPath();ctx.ellipse(0,0,cena==='fofo'?7:6,cena==='fofo'?4:6,0,0,7);ctx.fill();ctx.restore();}
    }
    if(cena==='palco'||cena==='praca'){   // notinhas subindo do Karaoke / coraçõezinhos do Pedido de fã
      var ox=cena==='palco'?1300:300,sim=cena==='palco'?['♪','♫']:['❤','♡'];
      ctx.font='26px "Mochiy Pop One",sans-serif';ctx.textAlign='center';
      for(var k=0;k<4;k++){var f=((tm*.32+k*.25)%1);ctx.globalAlpha=Math.sin(f*Math.PI)*.85;
        ctx.fillStyle=cena==='palco'?(k%2?'#ff62ab':'#9b6bff'):'#ff6fb5';
        ctx.fillText(sim[k%2],ox-70+k*48+Math.sin(tm*2+k)*10,300-f*170);}
    }
    if(cena==='harajuku'){   // vaporzinho do Café
      for(var v=0;v<3;v++){var g=((tm*.4+v/3)%1);ctx.globalAlpha=Math.sin(g*Math.PI)*.55;ctx.fillStyle='#ffffff';
        ctx.beginPath();ctx.arc(300+Math.sin(tm*1.6+v*2)*12,250-g*110,10+g*14,0,7);ctx.fill();}
    }
    if(cena==='arena'){   // torcida com lightsticks balançando e torres de luz pulsando
      var CORES_LS=['#ff6fb5','#ffd36b','#7fd3ff','#b6ff3b','#b98bff'];ctx.lineCap='round';ctx.lineWidth=4;
      for(var b=0;b<34;b++){var t3=(b+.5)/34,lx2=t3*1600,fila=b%4,ly2=350+fila*40-70*4*t3*(1-t3)*.5-26,ang=Math.sin(tm*3+b*.9)*.5;
        if(lx2>560&&lx2<1040&&fila<3)continue;   // atrás da entrada da Arena não aparece
        ctx.globalAlpha=.9;ctx.strokeStyle=CORES_LS[b%5];ctx.beginPath();ctx.moveTo(lx2,ly2);ctx.lineTo(lx2+Math.sin(ang)*16,ly2-Math.cos(ang)*16);ctx.stroke();}
      [[90,147],[1510,147]].forEach(function(l,i){var a3=.25+.2*Math.sin(tm*2.2+i*2),g3=ctx.createRadialGradient(l[0],l[1],0,l[0],l[1],80);
        g3.addColorStop(0,'rgba(255,247,200,'+a3.toFixed(2)+')');g3.addColorStop(1,'rgba(255,247,200,0)');ctx.globalAlpha=1;ctx.fillStyle=g3;ctx.fillRect(l[0]-80,l[1]-80,160,160);});
    }
    if(cena==='palco'||cena==='arena'||cena==='ceu'){   // estrelas piscando no céu
      for(var z=0;z<22;z++){var zx=(z*389+71)%1600,zy=24+(z*137)%(cena==='ceu'?380:250),za=Math.max(0,Math.sin(tm*1.7+z*1.3));if(za<.08)continue;
        var zr=(z%3?4:7)*(.5+za*.6);ctx.globalAlpha=za*.95;ctx.fillStyle=z%4?'#ffffff':'#fff3a8';ctx.beginPath();
        ctx.moveTo(zx,zy-zr);ctx.quadraticCurveTo(zx+zr*.18,zy-zr*.18,zx+zr,zy);ctx.quadraticCurveTo(zx+zr*.18,zy+zr*.18,zx,zy+zr);
        ctx.quadraticCurveTo(zx-zr*.18,zy+zr*.18,zx-zr,zy);ctx.quadraticCurveTo(zx-zr*.18,zy-zr*.18,zx,zy-zr);ctx.fill();}
    }
    if(cena==='palco'){   // dois holofotes varrendo o palco devagar
      ctx.globalCompositeOperation='lighter';
      [[300,-10,1],[1300,-10,-1]].forEach(function(h,i){var ang2=Math.sin(tm*.6+i*1.7)*.45*h[2];ctx.save();ctx.translate(h[0],h[1]);ctx.rotate(ang2);
        var g4=ctx.createLinearGradient(0,0,0,560);g4.addColorStop(0,'rgba(255,247,200,.22)');g4.addColorStop(1,'rgba(255,247,200,0)');
        ctx.fillStyle=g4;ctx.globalAlpha=1;ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-110,560);ctx.lineTo(110,560);ctx.lineTo(8,0);ctx.fill();ctx.restore();});
      ctx.globalCompositeOperation='source-over';
    }
    if(cena==='harajuku'){   // Galeria do Brilho: letreiros neon pulsando e varal de luzinhas piscando
      [[62,330,'255,111,181'],[562,300,'127,211,255'],[1046,285,'185,139,255'],[1538,320,'255,111,181']].forEach(function(n2,i){
        var a4=.25+.35*(.5+.5*Math.sin(tm*2.4+i*1.1));ctx.globalAlpha=1;ctx.strokeStyle='rgba('+n2[2]+','+a4.toFixed(2)+')';ctx.lineWidth=10;
        ctx.beginPath();if(ctx.roundRect)ctx.roundRect(n2[0]-50,n2[1]-19,100,38,19);else ctx.rect(n2[0]-50,n2[1]-19,100,38);ctx.stroke();});
      for(var q2=0;q2<3;q2++)for(var k2=0;k2<9;k2++){var x0=q2*520,x1=x0+560,tq=(k2+.5)/9,lqx=x0+(x1-x0)*tq,lqy=150+46*4*tq*(1-tq)*.5+7,aq=Math.max(0,Math.sin(tm*3+k2*.8+q2*2));
        if(aq<.3)continue;ctx.globalAlpha=aq*.7;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(lqx,lqy,11,0,7);ctx.fill();}
    }
    if(cena==='praca'){   // fonte viva: gotas descendo pelos jatos e ondinhas onde a água cai (rua.py, escala 1,6 em 800,565)
      var J=[[800,433.8,704,350.6,694.4,537.8],[800,433.8,896,350.6,905.6,537.8]];
      J.forEach(function(j){for(var d=0;d<7;d++){var fd=((tm*.8+d/7)%1),u=1-fd,dx2=u*u*j[0]+2*u*fd*j[2]+fd*fd*j[4],dy2=u*u*j[1]+2*u*fd*j[3]+fd*fd*j[5];
        ctx.globalAlpha=.9;ctx.fillStyle=d%2?'#ffffff':'#d6f5ff';ctx.beginPath();ctx.arc(dx2,dy2,4.2,0,7);ctx.fill();}
        for(var o=0;o<2;o++){var fo=((tm*.6+o/2)%1);ctx.globalAlpha=.7*(1-fo);ctx.strokeStyle='#ffffff';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(j[4],j[5]+4,8+fo*30,2+fo*7,0,0,7);ctx.stroke();}});
      var fb=(tm*.25)%1;ctx.globalAlpha=.35*(1-fb);ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(800,556,20+fb*120,5+fb*26,0,0,7);ctx.stroke();
    }
    ctx.restore();
  }
  // Luz suave nas bordas e reflexos no chão, antes dos nomes e personagens.
  var CORES_BAIRROS={palco:'#b58aff',harajuku:'#ff9bc5',fofo:'#8ad5b0',praca:'#89c9ed',arena:'#ffc18b',ceu:'#b8b8ff'};
  function atmosfera(tm){
    ctx.save();
    var noite=horaBR()<6||horaBR()>=19;
    var borda=ctx.createRadialGradient(W*.5,H*.45,W*.22,W*.5,H*.45,W*.68);
    borda.addColorStop(0,'rgba(49,30,90,0)');
    borda.addColorStop(1,noite?'rgba(27,22,71,.22)':'rgba(66,42,109,.10)');
    ctx.fillStyle=borda;ctx.fillRect(0,0,W,H);
    if(cena!=='mundo'){
      var cor=CORES_BAIRROS[cena]||'#b58aff';
      [300,800,1300].forEach(function(px,i){
        // Reflexo baixo: mantém as fachadas, placas e passantes legíveis.
        ctx.save();ctx.translate(px,590);ctx.scale(1,.22);
        var r=105+(reduzMov?0:Math.sin(tm*.65+i)*5);
        var luz=ctx.createRadialGradient(0,0,3,0,0,r);
        luz.addColorStop(0,cor);luz.addColorStop(1,'rgba(255,255,255,0)');
        ctx.globalAlpha=noite?.30:.12;ctx.fillStyle=luz;ctx.fillRect(-r,-r,r*2,r*2);
        ctx.restore();
      });
    }
    ctx.restore();
  }
  // hora do dia em Brasília: dia, entardecer e noite (janelas acesas)
  var LUZES_MUNDO=[[575,425],[800,390],[1035,425],[1238,655],[360,665],[800,640],[1330,220]];
  var LUZES_RUA=[[300,440],[800,440],[1300,440],[550,570],[1050,570]];
  var horaCache=-1,horaCacheEm=0;
  function horaBR(){if(typeof window.TW_MAPA_HORA==='number')return window.TW_MAPA_HORA;
    var agora=Date.now();if(horaCache>=0&&agora-horaCacheEm<60000)return horaCache;
    try{horaCache=+new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',hour:'numeric',hourCycle:'h23'}).format(new Date());}catch(e){horaCache=new Date().getHours();}
    horaCacheEm=agora;return horaCache;}
  function ceu(tm){
    var h=horaBR();if(h>=6&&h<17)return;
    ctx.save();
    if(h>=17&&h<19){ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(255,186,150,.75)';ctx.fillRect(OX,OY,MW,MH);}
    else{
      ctx.globalCompositeOperation='multiply';ctx.fillStyle='rgba(70,60,170,.55)';ctx.fillRect(OX,OY,MW,MH);
      ctx.globalCompositeOperation='lighter';
      (cena==='mundo'?LUZES_MUNDO:LUZES_RUA).forEach(function(l,i){var r=52+Math.sin(tm*2+i)*3,g=ctx.createRadialGradient(l[0],l[1],0,l[0],l[1],r);
        g.addColorStop(0,'rgba(255,190,90,.32)');g.addColorStop(1,'rgba(255,190,90,0)');ctx.fillStyle=g;ctx.fillRect(l[0]-r,l[1]-r,r*2,r*2);});
      ctx.globalCompositeOperation='source-over';
      for(var i=0;i<26;i++){var sx=OX+((i*397)%MW),sy=OY+((i*211)%230),a=.4+.6*Math.abs(Math.sin(tm*1.5+i));ctx.fillStyle='rgba(255,247,190,'+a.toFixed(2)+')';ctx.fillRect(sx,sy,3,3);}
    }
    ctx.restore();
  }

  // lotes vagos para os jogos novos (Fase 4): cerquinha, terra e placa "Em breve"
  var LOTES=[[963,880]];   // ao lado da sua casa: o lugar do Bloom⭐Garden!
  var BREVE={pt:'Em breve',en:'Coming soon',es:'Próximamente',id:'Segera hadir',th:'เร็ว ๆ นี้',ja:'近日公開'};
  function lotes(tm){
    LOTES.forEach(function(l,i){var x=l[0],y=l[1],w=94,h=46;
      ctx.save();
      ctx.fillStyle='rgba(60,143,99,.22)';ctx.beginPath();ctx.ellipse(x,y+h/2+4,w*.58,10,0,0,7);ctx.fill();
      ctx.fillStyle='#d9a873';rr(x-w/2,y-h/2,w,h,14);ctx.fill();
      ctx.strokeStyle='rgba(150,95,50,.35)';ctx.lineWidth=3;for(var k=-1;k<=1;k++){ctx.beginPath();ctx.moveTo(x-w/2+12,y+k*14);ctx.lineTo(x+w/2-12,y+k*14);ctx.stroke();}
      ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.setLineDash([9,7]);rr(x-w/2,y-h/2,w,h,14);ctx.stroke();ctx.setLineDash([]);
      var py=y-h/2-18+Math.sin(tm*2+i)*2;
      ctx.fillStyle='#b47b4b';ctx.fillRect(x-3,py,6,26);
      ctx.font='13px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';var tx=(BREVE[lang()]||BREVE.pt)+' ✨',tw=ctx.measureText(tx).width+22;
      ctx.fillStyle='#fff';ctx.strokeStyle='#ff9bd0';ctx.lineWidth=3;rr(x-tw/2,py-24,tw,26,13);ctx.fill();ctx.stroke();
      ctx.fillStyle='#d94d92';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(tx,x,py-11);
      ctx.restore();});
  }

  // brilho: estrelinhas que piscam perto dos lugares e a estrela do palco pulsando (leve, só com o mapa aberto)
  var BRILHOS=[[700,215,9],[905,190,8],[1220,300,7],[1085,270,6],[380,520,6],[275,470,5],[575,700,6],[870,700,6],[1370,560,7],[1160,640,6],[345,330,6],[1450,150,7],[960,520,5],[640,560,5]];
  function brilho(tm){
    ctx.save();
    var p=.5+.5*Math.sin(tm*2.2),g=ctx.createRadialGradient(800,186,0,800,186,52+p*10);
    g.addColorStop(0,'rgba(255,225,120,'+(.16+p*.12).toFixed(2)+')');g.addColorStop(1,'rgba(255,225,120,0)');
    ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.fillRect(700,90,200,200);
    ctx.globalCompositeOperation='source-over';
    BRILHOS.forEach(function(b,i){var a=Math.max(0,Math.sin(tm*1.7+i*1.3));if(a<.05)return;var s2=b[2]*(.6+a*.6);
      ctx.globalAlpha=a*.9;ctx.fillStyle=i%3?'#ffffff':'#fff3a8';ctx.beginPath();
      ctx.moveTo(b[0],b[1]-s2);ctx.quadraticCurveTo(b[0]+s2*.18,b[1]-s2*.18,b[0]+s2,b[1]);ctx.quadraticCurveTo(b[0]+s2*.18,b[1]+s2*.18,b[0],b[1]+s2);
      ctx.quadraticCurveTo(b[0]-s2*.18,b[1]+s2*.18,b[0]-s2,b[1]);ctx.quadraticCurveTo(b[0]-s2*.18,b[1]-s2*.18,b[0],b[1]-s2);ctx.fill();});
    ctx.restore();
  }
  // o TsuLiPa (trio) com os pets na praça, desenhado com as mesmas funções do palco (drawChar + contorno de adesivo)
  var IDOL_X=[758,800,842],IDOL_CHAO=422,IDOL_SC=1.05;
  function idols(tm){
    if(typeof drawChar!=='function'||typeof perfCharContorno!=='function'||typeof HUB_TRIO==='undefined'||typeof HUB_TRIO_DRAW_CHARS==='undefined'||typeof CH==='undefined')return;
    var sc=IDOL_SC,t=tm*60,roupa='';
    try{roupa=(typeof HUB_ROUPA_TEMA!=='undefined'&&typeof temaAtual==='function'&&HUB_ROUPA_TEMA[temaAtual()])||'';}catch(e){}
    var oS=state,oPw=pw,oDpw=dpw,oR=rankI,oSa=sash,oA=accSel,oF=frame,oP=charPose;
    try{
      state='play';pw=null;dpw=null;rankI=0;sash=false;accSel='';frame=t;
      HUB_TRIO.forEach(function(m,i){
        var c=HUB_TRIO_DRAW_CHARS[i],base=CH[m[0]];if(!c||!base)return;
        c.out=base.out;c.outcol=base.outcol;if(roupa){c.out=roupa;c.outcol=c.img;}
        var cx=IDOL_X[i],bob=Math.sin(t*.06+i*2.1)*1.1*sc;
        ctx.fillStyle='rgba(30,10,60,.22)';ctx.beginPath();ctx.ellipse(cx,IDOL_CHAO,9*sc,1.8*sc,0,0,7);ctx.fill();
        perfCharContorno(ctx,cx-15*sc,IDOL_CHAO-44*sc+bob,sc,function(){charPose=m[1];drawChar(c,0,0,0,m[4],false);});
        if(typeof PET_SP!=='undefined'&&PET_SP[m[3]]&&typeof perfDesenharPetEm==='function')
          perfDesenharPetEm(ctx,{k:m[3],acc:''},cx+(i===2?20:-20)*sc,IDOL_CHAO-6*sc+Math.sin(t*.08+i)*1.5*sc,sc*.42,t+i*40);
      });
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn("mapa idols",e);}finally{state=oS;pw=oPw;dpw=oDpw;rankI=oR;sash=oSa;accSel=oA;frame=oF;charPose=oP;}
  }
  function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();}
  // animação leve: só os balões de alerta balançam, e só com o mapa visível e a aba ativa
  function laco(){if(anim)return;(function f(){anim=0;if(!aberto||!visivel||document.hidden)return;
    desenhar();
    if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))anim=setTimeout(function(){requestAnimationFrame(f);},50);})();}
  document.addEventListener('visibilitychange',function(){if(!document.hidden)laco();});
  function tudo(){montar();textos();desenhar();setTimeout(centralizar,60);}
  ['hubMontar','hubCardsUI'].forEach(function(n){var o=window[n];if(typeof o==='function')window[n]=function(){var r=o.apply(this,arguments);try{tudo();}catch(e){}return r;};});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tudo);else tudo();
})();
