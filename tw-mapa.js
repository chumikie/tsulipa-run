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
  var cena='mundo',imagens={},pausaEscolhida=null;
  function donoPausa(){return typeof contaJ!=='undefined'&&contaJ?String(window.contaAuthUserId||contaJ.id||contaJ.nick||''):'visitante';}
  function pausasUI(sec){
    var barra=sec.querySelector('.tw-mapa-pausas');
    if(cena!=='praca'){if(barra)barra.remove();pausaEscolhida=null;return;}
    if(barra&&barra.dataset.idioma===lang())return;
    if(!barra){barra=document.createElement('div');barra.className='tw-mapa-pausas';sec.appendChild(barra);}
    barra.dataset.idioma=lang();
    var textos={pt:['Posar na praça','Observar a fonte','Rever a vida no bairro'],en:['Pose in the square','Watch the fountain','Revisit neighborhood life'],es:['Posar en la plaza','Observar la fuente','Volver a la vida del barrio'],id:['Berpose di alun-alun','Lihat air mancur','Lihat kehidupan lingkungan'],th:['โพสท่าที่จัตุรัส','ชมน้ำพุ','ดูชีวิตในย่าน'],ja:['広場でポーズ','噴水を眺める','街の暮らしを見る']}[lang()];
    barra.innerHTML='';textos.forEach(function(txt,i){var b=document.createElement('button');b.type='button';b.textContent=txt;b.onclick=function(){
      if(i===2){if(window.TW_BAIRRO)TW_BAIRRO.abrir();return;}
      if(i===1){observarFonte(performance.now()/1000);return;}
      var meu=ultimos.find(function(q){return q.dono;});if(!meu)return;
      pausaEscolhida={dono:donoPausa(),ate:performance.now()/1000+8,x:meu.x};meuPasseio=null;desenhar();
    };barra.appendChild(b);});
  }
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
  // a tela de celular (tw-celular.js) conta no início quem está passeando agora
  window.twMapaVisitaAgora=function(){var ruas=Object.keys(CENAS_RUA);
    for(var i=0;i<ruas.length;i++){var k=visitaQuem(ruas[i]);if(k>=0)return {quem:VISITA_NOMES[k],k:k,rua:ruas[i],nome:rotulo(ruas[i])};}
    return null;};
  // rua aberta agora (para "Idols online" e frases prontas); '' com o mapa fechado ou no meio da transição
  window.twMapaCena=function(){return aberto&&!mergulho?cena:'';};
  // Desenha um bichinho do mapa (mesma arte) em outro canvas: a bagunça da semana (tw-bairro.js) usa.
  window.twMapaBicho=function(tipo,c2,x,y,esc,tm){
    if(!c2)return false;var o=ctx;ctx=c2;tm=tm||0;
    try{ctx.save();ctx.translate(x,y);ctx.scale(esc||1,esc||1);ctx.lineJoin='round';ctx.lineCap='round';
      if(tipo==='gato')gatoDesenhar(tm,0,0,null,false,true);
      else if(tipo==='pombo')pomboDesenhar(tm,{x:0,y:0,dir:-1,andando:false,perto:true},null);
      else if(tipo==='coelho')coelhoDesenhar(tm,{x:0,y:0,dir:-1,hop:0,perto:true},null);
      else if(tipo==='passaro'){ctx.scale(-1.6,1.6);voadorDesenhar(tipo,1,tm);}
      else if(tipo==='borboleta'){ctx.scale(2.6,2.6);voadorDesenhar(tipo,0,tm||Math.PI/18);}   // tm=π/18: asas abertas no desenho parado
      else return false;
      return true;}catch(e){return false;}finally{try{ctx.restore();}catch(e){}ctx=o;}};
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
    sec.innerHTML='<button type="button" class="tw-mapa-botao" aria-expanded="false"><span class="tw-mapa-ico">🗺️</span><span class="tw-mapa-txt"><b></b><small></small></span><span class="tw-mapa-seta">▼</span></button><button type="button" class="tw-mapa-voltar" hidden>◀ Mapa</button><div class="tw-mapa-visao" hidden><button type="button" class="tw-mapa-zoom" aria-pressed="false">🔎 Aproximar</button></div><div class="tw-mapa-rolo" hidden><button class="tw-mapa-recarregar" type="button" hidden></button><canvas width="'+MW+'" height="'+MH+'" role="img"></canvas></div><p class="tw-mapa-recado-rosa" hidden></p><nav class="tw-mapa-bairros" aria-label="Explorar bairros" hidden></nav><section class="tw-mapa-vitrine" hidden></section><span class="tw-mapa-dica" aria-hidden="true"></span>';
    menu.appendChild(sec);posicionar();
    cv=sec.querySelector('canvas');ctx=cv.getContext('2d');
    sec.querySelector('.tw-mapa-recarregar').addEventListener('click',function(){mostrarCena(cena);});
    mostrarCena('mundo');
    cv.addEventListener('mousemove',function(e){if(toque&&arrastou)return;var l=achar(e);if(l!==hover){hover=l;cv.style.cursor=l?'pointer':'';desenhar();}});
    var rolo=sec.querySelector('.tw-mapa-rolo');['pointerdown','touchstart','wheel'].forEach(function(ev){rolo.addEventListener(ev,function(){sec.classList.add('mexeu');},{passive:true,once:true});});
    cv.addEventListener('mouseleave',function(){hover=null;desenhar();});
    var toque=null,arrastou=false;
    cv.addEventListener('pointerdown',function(e){if(toque||e.isPrimary===false){arrastou=true;hover=null;desenhar();return;}toque={id:e.pointerId,x:e.clientX,y:e.clientY};arrastou=false;hover=achar(e);desenhar();},{passive:true});
    cv.addEventListener('pointermove',function(e){
      if(toque&&e.pointerId===toque.id&&!arrastou&&Math.hypot(e.clientX-toque.x,e.clientY-toque.y)>10){arrastou=true;hover=null;desenhar();}
    },{passive:true});
    function soltarMapa(e){if(toque&&e.pointerId===toque.id)toque=null;}
    function cancelarMapa(e){if(!toque||e.pointerId!==toque.id)return;soltarMapa(e);arrastou=true;hover=null;desenhar();}
    cv.addEventListener('pointercancel',cancelarMapa);
    cv.addEventListener('pointerup',soltarMapa);
    window.addEventListener('pointerup',soltarMapa);
    window.addEventListener('pointercancel',cancelarMapa);
    cv.addEventListener('click',function(e){
      if(arrastou){arrastou=false;return;}
      if(!mapaAtivo()||mergulho)return;
      var l=achar(e);
      if(!l){if(cena!=='mundo'){var pm=pontoMapa(e);tocarRua(pm.x,pm.y);}return;}
      if(cena==='mundo'){entrarRua(l.id);return;}
      if(l.voltar){voltarAoMundo();return;}
      if(l.bloom){window.bloomAbrir();return;}
      if(l.studio){window.studioAbrir();return;}
      if(l.battle){window.battleAbrir();return;}
      // visual de celular: Café, Zipper⭐Shop! e Star⭐Gacha! mostram primeiro o lado de dentro (tw-celular.js)
      if(typeof window.twMapaEntrar==='function'&&window.twMapaEntrar(l.id))return;
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
      if(window.TW_BAIRRO&&typeof window.TW_BAIRRO.guiaMarcar==='function')window.TW_BAIRRO.guiaMarcar(atalhos);
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
      if([].some.call(document.querySelectorAll('[aria-modal="true"],dialog[open]'),function(el){return el.getClientRects().length;}))return;
      e.preventDefault();voltarAoMundo();
    });
    window.addEventListener('tw-piloto-bairro',recadoRosa);
    window.addEventListener('popstate',function(e){
      if(!mapaAtivo())return;
      // Nunca disputar o botão Voltar com as rotas do Center ou Karaoke.
      var hash=window.location&&window.location.hash;
      if(hash==='#center-run'||hash==='#karaoke')return;
      var rua=e&&e.state&&e.state[CHAVE_RUA_HIST];
      if(rua&&CENAS_RUA[rua]){if(cena!==rua)mostrarCena(rua);}
      else if(cena!=='mundo'||mergulho)voltarAoMundo(true);
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
    if(sec.closest&&sec.closest('#twCel'))return;   // aberto dentro do visual de celular: fica lá (puxar de volta fazia a tela pular para o topo)
    var jg=cards.querySelector('.hubbt-jogos');if(jg){if(sec.nextElementSibling!==jg)cards.insertBefore(sec,jg);}
    else if(sec.parentNode!==cards)cards.appendChild(sec);}
  function abrir(sim,inicio){
    // Fechar o acordeão nunca deixa uma rua oculta presa no histórico.
    if(!sim&&aberto&&(cena!=='mundo'||mergulho))voltarAoMundo();
    aberto=!!sim;var sec=document.getElementById('twMapa');if(!sec)return;
    sec.classList.toggle('aberto',aberto);sec.querySelector('.tw-mapa-rolo').hidden=!aberto;sec.querySelector('.tw-mapa-botao').setAttribute('aria-expanded',aberto?'true':'false');
    if(!inicio){try{localStorage.setItem('tw_mapa_aberto',aberto?'1':'0');}catch(e){}}
    textos();atualizarVitrine();recadoRosa();if(aberto){centrado=false;setTimeout(function(){centralizar();desenhar();laco();},30);}}

  function textos(){var b=document.querySelector('#twMapa .tw-mapa-txt b'),m=document.querySelector('#twMapa .tw-mapa-txt small');
    if(b)b.textContent=TIT[lang()]||TIT.pt;var dc=document.querySelector('#twMapa .tw-mapa-dica');if(dc)dc.textContent=DICA[lang()]||DICA.pt;if(m)m.textContent=(aberto?FECHA:PASSEIA)[lang()]||(aberto?FECHA:PASSEIA).pt;
    if(cv)cv.setAttribute('aria-label',cena==='mundo'?(TIT[lang()]||TIT.pt):(ui('rua')+rotulo(cena)));
    var sec=document.getElementById('twMapa');if(!sec)return;pausasUI(sec);
    var v=sec.querySelector('.tw-mapa-voltar');if(v)v.textContent=ui('voltar');
    var z=sec.querySelector('.tw-mapa-zoom');if(z)z.textContent=sec.classList.contains('tw-mapa-zoomed')?ui('geral'):ui('zoom');
    var nv=sec.querySelector('.tw-mapa-bairros');if(nv)nv.setAttribute('aria-label',ui('bairros'));
    if(sec.querySelectorAll)[].forEach.call(sec.querySelectorAll('[data-tw-rotulo]'),function(el){el.textContent=rotulo(el.getAttribute('data-tw-rotulo'));});}
  // Na chegada à Praça, preserve o Idol e prefira placas inteiras ou fora da janela.
  function enquadrarPraca(px, largura) {
    var limite=Math.max(0,1600-largura);
    var margem=Math.min(85,largura/4);
    var min=Math.max(0,Math.min(limite,px-largura+margem));
    var max=Math.max(min,Math.min(limite,px-margem));
    function ajustar(v){return Math.max(min,Math.min(max,v));}
    var base=ajustar(px-largura/2),melhor=base,menor=Infinity;
    // Limites das placas desenhadas em mapa-rua-praca.svg, com respiro para a borda.
    var placas=[[52,505],[1100,1500]],opcoes=[base,min,max];
    placas.forEach(function(p){opcoes.push(p[0]-largura,p[1],p[0],p[1]-largura);});
    opcoes.forEach(function(v){
      var inicio=ajustar(v),fim=inicio+largura,cortes=0;
      placas.forEach(function(p){if(inicio>p[0]&&inicio<p[1])cortes++;if(fim>p[0]&&fim<p[1])cortes++;});
      var custo=cortes*1600+Math.abs(inicio-base);
      if(custo<menor){menor=custo;melhor=inicio;}
    });
    return melhor;
  }
  function centralizar(){var r=document.querySelector('#twMapa .tw-mapa-rolo');
    if(centrado||!r||!cv)return;
    var sec=document.getElementById('twMapa');
    // Mundo: no celular começa inteiro na janela, sem deslocamento automático.
    if(cena==='mundo'&&window.matchMedia&&window.matchMedia('(max-width:760px)').matches&&
        sec&&!sec.classList.contains('tw-mapa-zoomed')){
      r.scrollLeft=0;r.scrollTop=0;centrado=true;return;
    }
    var k=cv.getBoundingClientRect().width/MW;
    var px=800,py=cena==='mundo'?610:450;
    if(cena==='praca' && window.matchMedia && window.matchMedia('(max-width:760px)').matches){
      var dono=ultimos.find(function(p){return p.dono;});
      if(dono&&k>0&&r.clientWidth>0){
        var largura=r.clientWidth/k;
        px=enquadrarPraca(dono.x,largura)+largura/2;py=dono.y-50;
      }
    }
    r.scrollLeft=Math.max(0,(px-OX)*k-r.clientWidth/2);
    r.scrollTop=Math.max(0,(py-OY)*k-r.clientHeight/2);centrado=true;
  }
  function mapaAtivo(){
    var menu=document.getElementById('hubMenu'),hub=document.getElementById('hub');
    // O menu permanece montado enquanto um minijogo esconde o Hub.
    return aberto&&(!menu||!menu.hidden)&&(!hub||!hub.hidden)&&!!document.getElementById('twMapa');
  }
  function entrarRua(destino,forcar){
    if(!mapaAtivo()||mergulho||cena!=='mundo'||!CENAS_RUA[destino])return;
    // Primeiros dias guiados (tw-bairro.js): rua que ainda não acendeu pergunta antes; nunca tranca.
    if(!forcar&&window.TW_BAIRRO&&typeof window.TW_BAIRRO.guiaPergunta==='function'&&
      window.TW_BAIRRO.guiaPergunta(destino,function(){entrarRua(destino,true);}))return;
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
  window.twMapaVoltarRua=function(){
    if(!mapaAtivo()||(cena==='mundo'&&!mergulho))return false;
    voltarAoMundo();return true;
  };
  function voltarAoMundo(porHistorico){
    if(cena==='mundo'&&!mergulho)return;
    var rua=mergulho?mergulho.id:cena,sec=document.getElementById('twMapa');
    mostrarCena('mundo');
    var bairro=sec&&sec.querySelector('[data-tw-bairro="'+rua+'"]');
    var abrirBtn=bairro||sec&&sec.querySelector('.tw-mapa-botao');
    if(abrirBtn&&abrirBtn.focus)abrirBtn.focus({preventScroll:true});
    // Consome somente a entrada criada pelo próprio mapa.
    try{
      var h=window.history;
      if(porHistorico!==true&&h&&h.state&&h.state[CHAVE_RUA_HIST]===rua&&typeof h.back==='function')h.back();
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn('Voltar do mapa indisponível',e);}
  }
  function recadoRosa(){
    var p=document.querySelector('#twMapa .tw-mapa-recado-rosa');
    if(!p)return;
    var piloto=window.TW_PILOTO_BAIRRO;
    var fala=cena==='fofo' && aberto && piloto && piloto.falaRosa ? piloto.falaRosa() : '';
    p.hidden=!fala;
    p.textContent=fala?'Rosa · '+fala:'';
  }
  function atualizarVitrine(){
    var sec=document.getElementById('twMapa'), box=sec&&sec.querySelector('.tw-mapa-vitrine');
    if(!box)return;
    var html=aberto&&cena==='fofo'&&window.TW_PILOTO_BAIRRO ? TW_PILOTO_BAIRRO.vitrineMapa() : '';
    if(box._vitrine!==html){box._vitrine=html;box.innerHTML=html;}
    box.hidden=!html;
  }
  window.twMapaVitrineAtualizar=atualizarVitrine;
  window.twMapaRuaFofa=function(){
    if(!mapaAtivo())return false;
    if(!mergulho&&cena==='mundo'){entrarRua('fofo',true);return true;}
    if(!mergulho&&cena==='fofo')return true;
    try{
      var estado=Object.assign({},window.history.state);
      estado[CHAVE_RUA_HIST]='fofo';
      window.history.replaceState(estado,'',window.location.href);
    }catch(e){}
    mostrarCena('fofo');return true;
  };
  if(typeof window.addEventListener==='function')window.addEventListener('tw-piloto-bairro',atualizarVitrine);
  function mostrarCena(destino){
    if(destino!=='mundo'&&!CENAS_RUA[destino])return;
    mergulho=null;cena=destino;hover=null;centrado=false;meuPasseio=null;pausaEscolhida=null;
    W=1600;H=destino==='mundo'?1000:760;OX=0;OY=0;MW=W;MH=H;
    if(cv){cv.width=MW;cv.height=MH;cv.style.cursor='';try{if(window.TW_NITIDEZ&&TW_NITIDEZ.adotar)TW_NITIDEZ.adotar(cv);}catch(e){}}   // 17/11: nítido em tablet (nasce escondido; entra na nitidez quando aparece)
    var sec=document.getElementById('twMapa');
    if(sec){var voltar=sec.querySelector('.tw-mapa-voltar');
      if(voltar)voltar.hidden=destino==='mundo';
      sec.setAttribute('data-cena',destino);pausasUI(sec);
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
    atualizarVitrine();
    var tentar=sec&&sec.querySelector('.tw-mapa-recarregar');
    if(tentar)tentar.hidden=true;
    var arquivo=destino==='mundo'?'mapa-mundo.svg':CENAS_RUA[destino];
    if(!imagens[destino]){
      var img=new Image();imagens[destino]=img;
      img.onload=function(){if(cena===destino){arte=img;desenhar();centralizar();}};
      img.onerror=function(){
        if(imagens[destino]!==img)return;
        delete imagens[destino];
        if(cena===destino&&tentar){
          var rotulos={pt:'Recarregar imagem do mapa',en:'Reload map image',es:'Volver a cargar la imagen del mapa',id:'Muat ulang gambar peta',th:'โหลดภาพแผนที่อีกครั้ง',ja:'地図の画像を再読み込み'};
          tentar.textContent=rotulos[lang()]||rotulos.pt;
          tentar.hidden=false;
        }
        if(window.TW_MAPA_DEBUG)console.warn('Arte do mapa indisponível:',arquivo);};
      img.src='./'+arquivo+'?v=6';
    }
    arte=imagens[destino];if(arte.complete&&arte.naturalWidth){desenhar();centralizar();}
    textos();atualizarVitrine();recadoRosa();
  }
  function achar(e){var r=cv.getBoundingClientRect();if(!r.width||!r.height)return null;var x=(e.clientX-r.left)*MW/r.width+OX,y=(e.clientY-r.top)*MH/r.height+OY;
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
  // Com os Idols maiores, a cabeça pode passar na frente da plaquinha da porta:
  // o nome do jogo é redesenhado por cima para continuar legível.
  function nomesDasPortas(){var T=window.TW_MAPA_TEXTOS&&window.TW_MAPA_TEXTOS[cena];if(!T)return;
    T.forEach(function(t){if(t.y>600)texto(t);});
    cadeadosPortas();
  }
  // Visitante: cadeadinho nas portas dos lugares que pedem conta (mesma regra do hub e do visual de celular)
  var PEDE_CONTA={pet:1,gacha:1,loja:1,duo:1,sora:1,karaoke:1,bloom:1};
  function cadeadosPortas(){
    if(typeof contaJ!=='undefined'&&contaJ)return;
    var ids=(BAIRROS[cena]&&BAIRROS[cena].lugares)||[];
    ids.forEach(function(id,i){if(!id||!PEDE_CONTA[id]||(window.TW_JOGOS_SEM_LOGIN&&(id==='sora'||id==='karaoke')))return;
      var x=PORTAS[i]+92,y=300;ctx.save();
      ctx.fillStyle='#fff';ctx.strokeStyle='#7b3ff0';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,20,0,7);ctx.fill();ctx.stroke();
      ctx.strokeStyle='#7b3ff0';ctx.lineWidth=3.2;ctx.beginPath();ctx.arc(x,y-3,6,Math.PI,0);ctx.stroke();
      ctx.fillStyle='#7b3ff0';rr(x-9,y-3,18,13,3);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y+3,2.2,0,7);ctx.fill();
      ctx.restore();});
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
    if(cv&&!cv.__twA&&cv.__twTent!==cv.clientWidth&&window.TW_NITIDEZ&&TW_NITIDEZ.adotar){cv.__twTent=cv.clientWidth;try{TW_NITIDEZ.adotar(cv);}catch(e){}}   // tablet: entra na nitidez quando o tamanho na tela muda
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,MW,MH);
    ctx.setTransform(1,0,0,1,-OX,-OY);ctx.drawImage(arte,0,0,W,H);
    ceu(reduzMov?0:tm); atmosfera(reduzMov?0:tm); // mesmo horário de Brasília no mundo e nas ruas
    if(cena==='mundo')marcosDoMundo();else marcosDaRua(reduzMov ? 0 : tm,cena);
    textosCena(); // depois do céu: à noite as placas ficam acesas, como letreiros
    if(cena==='mundo'){mundoVivo(tm);mundoGente(tm);idols(tm);alertasMundo(tm);guiaVeus();}
    else{detalhes(tm);if(BICHOS[cena]==='gato')desenharBichos(tm);desenharChao(tm);desenharBichoSemana(tm);andar(tm);nomesDasPortas();desenharEtiquetasVisita(tm);desenharDiamantes(tm);desenharFalas();if(BICHOS[cena]!=='gato')desenharBichos(tm);desenharToques(tm);alertasRua(tm);}
    if(mergulho&&cena==='mundo'){
      var bm=BAIRROS[mergulho.id].box,cx=(bm[0]+bm[2])/2,cy=(bm[1]+bm[3])/2,
          u=Math.min(1,(performance.now()-mergulho.t0)/420),e=u*u*(3-2*u),z=1+e*1.6;
      var fx=cx+(MW/2-cx)*e,fy=cy+(MH/2-cy)*e;   // o bairro desliza para o centro enquanto aproxima
      ctx.setTransform(z,0,0,z,fx-cx*z-OX,fy-cy*z-OY);ctx.drawImage(arte,0,0,W,H);marcosDoMundo();textosCena();
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
  // Primeiros dias guiados (tw-bairro.js): rua que ainda não acendeu ganha um véu claro e o selo "em breve".
  // Só aparência: tocar continua entrando (o tw-bairro pergunta antes, sem trancar).
  function guiaVeus(){
    var B=window.TW_BAIRRO;if(!B||typeof B.guia!=='function')return;var g;try{g=B.guia();}catch(e){return;}if(!g||!g.ativo)return;
    var txt='✨ '+(B.t?B.t('emBreve'):'em breve');
    Object.keys(BAIRROS).forEach(function(id){if(g.abertas.indexOf(id)>=0)return;var b=BAIRROS[id].box,w=b[2]-b[0],h=b[3]-b[1];
      ctx.save();ctx.fillStyle='rgba(255,255,255,.55)';rr(b[0]+4,b[1]+4,w-8,h-8,26);ctx.fill();
      ctx.font='26px "Mochiy Pop One",sans-serif';var tw=ctx.measureText?ctx.measureText(txt).width:120,cx=b[0]+w/2,cy=b[1]+h/2;
      ctx.fillStyle='#fff';ctx.strokeStyle='#b98bff';ctx.lineWidth=3;rr(cx-tw/2-16,cy-24,tw+32,48,24);ctx.fill();ctx.stroke();
      ctx.fillStyle='#6e44c9';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(txt,cx,cy+1);ctx.restore();});
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
  // ---------- Visita surpresa dos membros (15/11/2026) ----------
  // A cada 8 minutos, cada rua sorteia (pelo relógio, igual para todo mundo) se um membro do TsuLiPa passeia por lá.
  // Quem está logado como Tsu, Lirika ou Pati nunca encontra a si mesmo: o sorteio passa para outro membro.
  var visitaEtiquetas=[],falas=[],diamantes=[];
  // Diamantinho do humor (ideia do The Sims) girando em cima do SEU Idol: verde = feliz, amarelo = ok, rosa = precisa de carinho
  function desenharDiamantes(tm){
    diamantes.forEach(function(d){
      var gi=reduzMov?1:Math.cos(tm*2.4),w=11*Math.max(.25,Math.abs(gi)),y=d.y-(reduzMov?0:Math.sin(tm*2)*3);
      ctx.save();ctx.translate(d.x,y);
      // Cristal Oshi: facetas e estrela central, preservando âncora e cor do humor.
      ctx.fillStyle=d.cor;ctx.strokeStyle='rgba(30,10,60,.55)';ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(w,0);ctx.lineTo(0,9);ctx.lineTo(-w,0);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.30)';ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(-w,0);ctx.lineTo(0,9);ctx.closePath();ctx.fill();
      ctx.fillStyle='rgba(255,255,255,.42)';ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(w,0);ctx.lineTo(0,-2);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.48)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,-20);ctx.lineTo(0,9);ctx.moveTo(-w,0);ctx.lineTo(w,0);ctx.stroke();
      ctx.fillStyle='rgba(255,255,255,.86)';ctx.beginPath();ctx.moveTo(0,-9);ctx.lineTo(1.4,-5);ctx.lineTo(4,-4);ctx.lineTo(1.4,-3);ctx.lineTo(0,1);ctx.lineTo(-1.4,-3);ctx.lineTo(-4,-4);ctx.lineTo(-1.4,-5);ctx.closePath();ctx.fill();
      ctx.restore();
    });
  }
  // balões das frases prontas (e o nome de quem está online), por cima de tudo
  function desenharFalas(){
    falas.forEach(function(f){
      ctx.save();
      if(f.nome){ctx.font='bold 13px "M PLUS Rounded 1c",sans-serif';var ln=Math.min(150,ctx.measureText(f.t).width+16);
        ctx.fillStyle='rgba(123,63,240,.9)';rr(f.x-ln/2,f.y,ln,20,10);ctx.fill();ctx.fillStyle='#fff';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.t,f.x,f.y+10,ln-10);ctx.restore();return;}
      ctx.font='bold 17px "M PLUS Rounded 1c",sans-serif';var lg=Math.min(260,ctx.measureText(f.t).width+26),by=f.y-34;
      ctx.fillStyle='#fff';ctx.strokeStyle='#c9b3ff';ctx.lineWidth=2.5;rr(f.x-lg/2,by,lg,32,15);ctx.fill();ctx.stroke();
      ctx.beginPath();ctx.moveTo(f.x-7,by+31);ctx.lineTo(f.x,by+42);ctx.lineTo(f.x+7,by+31);ctx.closePath();ctx.fill();
      ctx.fillStyle='#5b2bb5';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(f.t,f.x,by+16.5,lg-14);ctx.restore();
    });
  }
  function desenharEtiquetasVisita(tm){
    if(window.TW_MAPA_DEBUG)window.TW_MAPA_VISITAS=visitaEtiquetas.slice();   // só para testes
    visitaEtiquetas.forEach(function(v){
      var et='⭐ '+v.nome,corM=['#9b30d9','#7cc400','#4169e1'][v.k]||'#7b3ff0',ey=v.y+(reduzMov?0:Math.sin(tm*2.4)*1.5);
      ctx.save();ctx.font='bold 17px "M PLUS Rounded 1c",sans-serif';var lg=ctx.measureText(et).width+24;
      ctx.fillStyle='rgba(255,250,255,.97)';ctx.strokeStyle=corM;ctx.lineWidth=2.4;rr(v.x-lg/2,ey,lg,30,14);ctx.fill();ctx.stroke();
      ctx.fillStyle=corM;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(et,v.x,ey+15);ctx.restore();
    });
  }
  var VISITA_MIN=8,VISITA_CHANCE=.45,VISITA_NOMES=['Tsu','Lirika','Pati'];
  var VISITA_FALAS={
    pt:['Oi! Que bom te ver por aqui! 💜','Hehe, achei você! 💚','Bora brilhar hoje! 💙'],
    en:['Hi! So good to see you here! 💜','Hehe, found you! 💚',"Let's shine today! 💙"],
    es:['¡Hola! ¡Qué bueno verte por aquí! 💜','¡Jeje, te encontré! 💚','¡A brillar hoy! 💙'],
    id:['Hai! Senang ketemu kamu di sini! 💜','Hehe, ketemu kamu! 💚','Ayo bersinar hari ini! 💙'],
    th:['สวัสดี! ดีใจที่เจอที่นี่นะ! 💜','อิอิ เจอตัวแล้ว! 💚','วันนี้มาเปล่งประกายกัน! 💙'],
    ja:['やっほー！ここで会えてうれしい！💜','えへへ、みーつけた！💚','今日も一緒に輝こう！💙']};
  var VISITA_CONTAS=['tsu','lirika','patiliri'];   // contas oficiais do trio (0 Tsu, 1 Lirika, 2 Pati)
  function visitaContaTrio(n){return VISITA_CONTAS.indexOf(String(n||'').trim().toLowerCase());}
  // Quem está em visita fica "trabalhando" na frente de um lugar da rua: canta no palco, faz coraçãozinho nas lojas...
  var POSES_ATIVAS={mic:['mic','luz','mic','banzai'],loja:['coracao','v','tchau','coracao'],oi:['tchau','coracao','v','tchau']};
  var LUGAR_ATIVO={run:'mic',karaoke:'mic',duo:'mic',sora:'mic',battle:'mic',loja:'loja',gacha:'loja',cafe:'loja',shop:'loja'};
  function visitaPorta(k){var ids=(BAIRROS[cena]&&BAIRROS[cena].lugares)||[];if(ids[k])return k;for(var i=0;i<3;i++)if(ids[(k+i)%3])return (k+i)%3;return 1;}
  function visitaAtividade(k){var ids=(BAIRROS[cena]&&BAIRROS[cena].lugares)||[];return LUGAR_ATIVO[ids[visitaPorta(k)]]||(cena==='arena'?'mic':'oi');}
  function visitaEu(){try{var n=(typeof contaJ!=='undefined'&&contaJ&&contaJ.nick)||'';return String(n).trim().toLowerCase();}catch(e){return '';}}
  function visitaSorteio(rua,fatia){var h=2166136261,t=rua+'|'+fatia;for(var i=0;i<t.length;i++){h^=t.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0)/4294967296;}
  // quem visita a rua agora (0 Tsu, 1 Lirika, 2 Pati) ou -1; nunca a própria conta
  function visitaQuem(rua){
    if(rua==='mundo')return -1;
    var fatia=Math.floor(Date.now()/(VISITA_MIN*60000)),r=visitaSorteio(rua,fatia);
    if(r>=VISITA_CHANCE)return -1;
    var eu=visitaEu(),k=Math.floor(visitaSorteio(rua+'#quem',fatia)*3);
    var euK=visitaContaTrio(eu);if(euK<0)euK=VISITA_NOMES.map(function(n){return n.toLowerCase();}).indexOf(eu);
    if(k===euK)k=(k+1)%3;
    return k;
  }
  function visitaOshi(rua){
    if(rua==='mundo'||typeof HUB_TRIO==='undefined'||typeof HUB_TRIO_DRAW_CHARS==='undefined'||typeof CH==='undefined')return null;
    var k=visitaQuem(rua);if(k<0)return null;
    var m=HUB_TRIO[k],c=HUB_TRIO_DRAW_CHARS[k],base=CH[m[0]];if(!c||!base)return null;
    c.out=base.out;c.outcol=base.outcol;
    return {av:{c:c,pose:'',expr:m[4]},oshi:VISITA_NOMES[k],oshiK:k,oshiPose:m[1],oshiChar:c,rua:trajetoRua(4),u0:.06,u1:.94,fase:.62};
  }
  function passeantes(registro){
    var l=[];
    try{if(typeof hubAv==='function'&&typeof perfChar==='function'){
      var av=hubAv();if(av)l.push({av:av,rua:trajetoRua(0),u0:.06,u1:.94,fase:0,dono:true});
    }}catch(e){}
    // Quem está online NESTA rua passeia primeiro (com o balão da frase pronta); depois a vitrine completa até 3.
    // As contas do Tsu, da Lirika e do Pati não passeiam como jogadores: eles aparecem pela visita (sem duplicar).
    try{var vistos={},outros=[];
      var on=window.TW_PRESENCA&&window.TW_PRESENCA.rua===cena?window.TW_PRESENCA.lista||[]:[];
      on.forEach(function(p){if(p&&p.nick&&visitaContaTrio(p.nick)<0){vistos[String(p.nick).toLowerCase()]=1;outros.push({p:p,online:true});}});
      if(typeof hubIdolsDados!=='undefined'&&hubIdolsDados&&Array.isArray(hubIdolsDados.idols))
        hubIdolsDados.idols.forEach(function(p){if(p&&p.nick&&visitaContaTrio(p.nick)<0&&!vistos[String(p.nick).toLowerCase()])outros.push({p:p});});
      // a vitrine (vitrine_idols) entrega o visual em `avatar`; `av` fica aceito por compatibilidade
      outros.slice(0,3).forEach(function(o,i){var p=o.p,av=p.av||p.avatar;if(av&&typeof av==='object')l.push({
        av:av,rua:trajetoRua(i+1),u0:.06,u1:.94,fase:(i+1)*.27,nick:p.nick,online:!!o.online,fala:p.frase?{frase:p.frase,em:(+p.frase_em||0)*1000}:null
      });});}catch(e){}
    // Visita surpresa: de vez em quando o Tsu, a Lirika ou o Pati passeiam pela rua (com o visual do palco).
    var vis=visitaOshi(cena);if(vis)l.push(vis);
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
      if(t<g[2]){var u=t/g[2],passo=Math.min(1,u*8,(1-u)*8);u=u*u*(3-2*u);return {x:xa+(xb-xa)*u,dir:xb>=xa?1:-1,mov:1,passo:passo,volta:k};}
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
  /* ---------- Vida e toques nas ruas (só enfeite: nada é salvo nem enviado) ----------
     Tocar no chão leva o seu Idol até lá; tocar num passeante faz ele pular e responder;
     a fonte da Praça espirra água; bichinhos (borboletas, gatinho, passarinhos) reagem.
     Com "reduzir movimento" fica só o balãozinho de resposta, sem animação. */
  var toques=[],meuPasseio=null,pulos={},ultimos=[],bichoAssustado={},MEU_PARA=3.2;
  var BICHOS={fofo:'borboleta',praca:'borboleta',harajuku:'gato',ceu:'passaro',palco:'gato',arena:'passaro'};
  var TEMA_TOQUE={palco:['♪','♫','★'],harajuku:['✦','💗','✧'],fofo:['🌷','✿','❀'],praca:['♡','❤','✦'],arena:['★','✦','♪'],ceu:['☁','★','✧']};
  function somMapa(k){try{if(typeof twJogoSom==='function')twJogoSom(k);}catch(e){}}
  function pontoMapa(e){var r=cv.getBoundingClientRect();return {x:(e.clientX-r.left)*MW/r.width+OX,y:(e.clientY-r.top)*MH/r.height+OY};}
  // Borboletas e passarinhos: voo em curvas suaves, cada um com seu ritmo.
  function posBicho(k,tm){
    var fuga=bichoAssustado[cena+k],extra=fuga?Math.max(0,1-(tm-fuga)/1.6):0;
    if(BICHOS[cena]==='passaro'){var vx=60+k*14,x=((tm*vx+k*530)%1900)-150+extra*extra*260;
      return {x:x,y:150+k*48+Math.sin(tm*1.3+k)*18-extra*120,dir:1};}
    var cx=[420,900,1260][k%3],t=tm*(0.5+k*.07);
    return {x:cx+Math.sin(t)*150+Math.sin(t*2.3)*40+extra*180,y:600+Math.cos(t*1.7)*60-extra*140,dir:Math.cos(t)>=0?1:-1};
  }
  // Gatinho da rua (arte original): malhado laranja na Galeria do Brilho, smoking preto na Star Stage.
  // Pisca, mexe a orelha e o rabo; tocado, pula e solta corações; à noite dorme.
  var GATOS={harajuku:{pelo:'#ffb35c',escuro:'#e8863a',contorno:'#a85a24',claro:'#fff3e0',listra:'#e8863a',olho:'#3a2a2a',coleira:'#ff6fb5',pingente:'sino',bigode:'rgba(90,58,42,.55)'},
    palco:{pelo:'#3b3346',escuro:'#2a2433',contorno:'#17121f',claro:'#f4f0fa',listra:'',olho:'#ffd23f',coleira:'#ffd23f',pingente:'estrela',bigode:'rgba(244,240,250,.75)'}};
  // Redesenhado (15/11): no mesmo jeitinho dos Idols — cabeção quadradinho, corpo de "pãozinho", cores chapadas,
  // contorno único e rostinho simples (olhos de bolinha, ω e bochechas). Sem bigodes e sem degradês.
  function gatoDesenhar(tm,gx,gy,pt,noite,perto){
    var G=GATOS[cena]||GATOS.harajuku,up=pt!=null?Math.max(0,Math.sin(Math.min(1,(tm-pt)/.45)*Math.PI))*18:0,
        dormindo=noite&&pt==null&&!perto,cauda=reduzMov?0:Math.sin(tm*2.2)*(dormindo?.15:.5),
        pisca=!reduzMov&&!dormindo&&(tm%4.2)<.13,orelha=!reduzMov&&!dormindo&&(tm%6.5)<.28?-.25:0,
        cab=dormindo?2:(reduzMov?0:Math.sin(tm*1.1)*.8),S=1.05;   // tamanho de bichinho (antes 1.7 parecia gigante)
    ctx.save();ctx.translate(gx,gy-up);ctx.scale(S,S);
    ctx.fillStyle='rgba(30,10,60,.16)';ctx.beginPath();ctx.ellipse(2,1+up/S,21,4.2,0,0,7);ctx.fill();
    ctx.lineJoin='round';ctx.lineCap='round';
    var L=2.6;   // espessura do contorno (igual para tudo)
    function forma(f,cor){f();ctx.fillStyle=cor;ctx.fill();ctx.strokeStyle=G.contorno;ctx.lineWidth=L;ctx.stroke();}
    // rabo: traço grosso com contorno, ponta clara
    var rx=24+cauda*9,ry=-30;
    ctx.strokeStyle=G.contorno;ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(11,-6);ctx.quadraticCurveTo(26,-6,rx,ry);ctx.stroke();
    ctx.strokeStyle=G.pelo;ctx.lineWidth=4.6;ctx.beginPath();ctx.moveTo(11,-6);ctx.quadraticCurveTo(26,-6,rx,ry);ctx.stroke();
    ctx.fillStyle=G.claro;ctx.beginPath();ctx.arc(rx,ry,2.3,0,7);ctx.fill();
    // corpo (pãozinho sentado) e patinhas
    forma(function(){rr(-14,-21,28,21,9);},G.pelo);
    ctx.fillStyle=G.claro;ctx.beginPath();ctx.ellipse(0,-9,7,7.5,0,0,7);ctx.fill();
    [-7,7].forEach(function(px){forma(function(){rr(px-4.5,-5,9,6,3);},G.claro);});
    // cabeção
    ctx.save();ctx.translate(0,cab);
    function orelhas(dx){return function(){ctx.beginPath();
      ctx.moveTo(-15,-40);ctx.lineTo(-14,-55);ctx.lineTo(-3,-45);ctx.closePath();
      ctx.save();ctx.translate(9,-45);ctx.rotate(-orelha);ctx.moveTo(-6,0);ctx.lineTo(5,-10);ctx.lineTo(6,5);ctx.closePath();ctx.restore();};}
    forma(orelhas(),G.pelo);
    ctx.fillStyle='#ffb3cf';ctx.beginPath();ctx.moveTo(-12.5,-42);ctx.lineTo(-12,-50);ctx.lineTo(-6.5,-45);ctx.closePath();ctx.fill();
    ctx.save();ctx.translate(9,-45);ctx.rotate(-orelha);ctx.beginPath();ctx.moveTo(-3,0);ctx.lineTo(3.5,-6);ctx.lineTo(4,2.5);ctx.closePath();ctx.fill();ctx.restore();
    forma(function(){rr(-17,-46,34,28,11);},G.pelo);
    if(G.listra){ctx.strokeStyle=G.listra;ctx.lineWidth=2.4;ctx.beginPath();
      ctx.moveTo(-4,-45);ctx.lineTo(-4,-40);ctx.moveTo(0,-45.5);ctx.lineTo(0,-39);ctx.moveTo(4,-45);ctx.lineTo(4,-40);ctx.stroke();}
    ctx.fillStyle=G.claro;ctx.beginPath();ctx.ellipse(0,-24.5,8.5,5.2,0,0,7);ctx.fill();   // focinho claro
    // olhos de bolinha (piscam; fechadinhos quando dorme)
    if(dormindo||pisca){ctx.strokeStyle=G.olho==='#ffd23f'?'#ffe9a3':'#2a1a2a';ctx.lineWidth=2;ctx.beginPath();
      ctx.arc(-7,-32,2.8,.15*Math.PI,.85*Math.PI);ctx.moveTo(9.8,-32);ctx.arc(7,-32,2.8,.15*Math.PI,.85*Math.PI);ctx.stroke();}
    else [-7,7].forEach(function(ex){
      if(G.olho!=='#3a2a2a'){ctx.fillStyle=G.olho;ctx.beginPath();ctx.ellipse(ex,-32,3.3,3.8,0,0,7);ctx.fill();}
      ctx.fillStyle='#22142c';ctx.beginPath();ctx.ellipse(ex,-31.8,G.olho!=='#3a2a2a'?1.7:2.7,G.olho!=='#3a2a2a'?3:3.3,0,0,7);ctx.fill();
      ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex-1,-33.4,1.1,0,7);ctx.fill();});
    ctx.fillStyle='rgba(255,111,181,.5)';ctx.beginPath();ctx.ellipse(-11,-26.5,3,1.8,0,0,7);ctx.ellipse(11,-26.5,3,1.8,0,0,7);ctx.fill();
    ctx.fillStyle='#ff7aa8';ctx.beginPath();ctx.moveTo(-1.6,-27);ctx.lineTo(1.6,-27);ctx.lineTo(0,-25.4);ctx.closePath();ctx.fill();
    ctx.strokeStyle='#5a3a4a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(-1.5,-24.6,1.5,.15,Math.PI-.15);ctx.moveTo(3,-24.6);ctx.arc(1.5,-24.6,1.5,.15,Math.PI-.15);ctx.stroke();
    ctx.restore();
    // coleira com pingente (sininho ou estrela)
    ctx.fillStyle=G.coleira;rr(-9,-20+cab*.5,18,3.6,1.8);ctx.fill();
    ctx.save();ctx.translate(0,-15.5+cab*.5);ctx.rotate(reduzMov?0:Math.sin(tm*3)*.15);
    ctx.fillStyle='#ffd23f';ctx.strokeStyle='#b8860b';ctx.lineWidth=1;ctx.beginPath();
    if(G.pingente==='estrela')for(var q=0;q<10;q++){var an=-Math.PI/2+q*Math.PI/5,r2=q%2?1.7:3.9;ctx.lineTo(Math.cos(an)*r2,Math.sin(an)*r2);}
    else ctx.arc(0,0,3,0,7);
    ctx.closePath();ctx.fill();ctx.stroke();ctx.restore();
    if(dormindo&&!reduzMov){ctx.fillStyle='#7b3ff0';ctx.font='15px "Mochiy Pop One",sans-serif';
      for(var z=0;z<2;z++){var fz=((tm*.7+z*.5)%1);ctx.globalAlpha=Math.sin(fz*Math.PI)*.8;ctx.fillText('z',14+z*6+fz*6,-50-fz*16);}ctx.globalAlpha=1;}
    ctx.restore();
    if(pt!=null&&tm-pt<1.8)balao(gx-4,gy-92,'♡',Math.min(1,(1.8-(tm-pt))*2));
    else if(perto&&(tm%3.2)<1.4)balao(gx-4,gy-92,'♡',Math.min(1,Math.sin((tm%3.2)/1.4*Math.PI)*2));   // seu Idol chegou perto
  }
  // Peixinhos koi na fonte da Praça: nadam em volta do repuxo, meio submersos.
  function peixesFonte(tm){
    var cores=[['#ff8a3d','#fff6ec'],['#fff6ec','#ff6fb5']];
    for(var k=0;k<2;k++){var t=(reduzMov?k*3:tm*.55)+k*Math.PI,x=800+Math.cos(t)*104,y=566+Math.sin(t)*17,dir=-Math.sin(t)>=0?1:-1,
        ab=reduzMov?0:Math.sin(tm*8+k)*.35,fundo=Math.sin(t)<0;
      ctx.save();ctx.translate(x,y);ctx.scale(dir*1.6,1.6);ctx.globalAlpha=fundo?.55:.85;
      ctx.fillStyle=cores[k][0];ctx.beginPath();ctx.moveTo(-8,0);ctx.lineTo(-15,-5+ab*6);ctx.lineTo(-14,5+ab*6);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.ellipse(0,0,9,4.6,0,0,7);ctx.fill();
      ctx.fillStyle=cores[k][1];ctx.beginPath();ctx.ellipse(2,-1.4,3.4,2,0,0,7);ctx.ellipse(-4,1,2.4,1.6,0,0,7);ctx.fill();
      ctx.fillStyle='#2a1a2a';ctx.beginPath();ctx.arc(6,-1,1,0,7);ctx.fill();
      if(!reduzMov&&(tm*.8+k)%3<.6){ctx.globalAlpha=.6*(1-((tm*.8+k)%3)/.6);ctx.strokeStyle='#ffffff';ctx.lineWidth=1;ctx.beginPath();
        ctx.ellipse(8,-6,3+((tm*.8+k)%3)*14,1.2+((tm*.8+k)%3)*4,0,0,7);ctx.stroke();}
      ctx.restore();}
  }
  // Seu Idol passeando perto de um ponto (usa as posições do quadro anterior; nada é salvo).
  function meuIdolPerto(x,raio){for(var i=0;i<ultimos.length;i++){var o=ultimos[i];if((o.dono||o.oshi)&&Math.abs(o.x-x)<raio)return o;}return null;}   // seu Idol ou um membro em visita
  // Bichinhos de chão (arte original): cachorrinho na Star Arena e coelhinho na Vila das Tulipas.
  // Ficam atrás dos Idols, respondem ao toque e ao seu Idol chegando perto. "Reduzir movimento" deixa tudo parado.
  var CHAO={arena:'cachorro',fofo:'coelho',praca:'pombo',ceu:'ovelha'},chaoPos={};
  function desenharChao(tm){
    var tipo=CHAO[cena];if(!tipo)return;
    var h=new Date().getHours(),noite=h>=21||h<6;
    if(tipo==='cachorro'){var perto=meuIdolPerto(330,150);chaoPos[cena]={x:330,y:705};cachorroDesenhar(tm,330,705,pulos['cachorro'],noite,perto);}
    else if(tipo==='coelho'){var c=coelhoPos(tm);chaoPos[cena]={x:c.x,y:c.y};coelhoDesenhar(tm,c,pulos['coelho']);}
    else if(tipo==='pombo'){var pb=andarilho(pomboEstado,tm,600,1020,712,38,1.6);chaoPos[cena]={x:pb.x,y:pb.y};pomboDesenhar(tm,pb,pulos['pombo']);}
    else{var ov=meuIdolPerto(300,150);chaoPos[cena]={x:300,y:706};ovelhaDesenhar(tm,300,706,pulos['ovelha'],noite,ov);}
  }
  // Quem passeia sozinho (pombinho): anda até um ponto, para um pouco, escolhe outro; vira para o seu Idol quando ele chega.
  var pomboEstado={x:820,alvo:820,dir:1,t:0,parado:0,pausa:0};
  function andarilho(e,tm,xmin,xmax,y,vel,espera){
    var dt=Math.min(.1,Math.max(0,tm-(e.t||tm)));e.t=tm;
    var perto=meuIdolPerto(e.x,160),andando=false;
    if(perto){e.dir=perto.x<e.x?-1:1;e.parado=tm;}
    else if(!reduzMov&&tm-e.parado>espera){
      if(Math.abs(e.alvo-e.x)<4){e.alvo=xmin+Math.random()*(xmax-xmin);e.parado=tm;}
      else{e.dir=e.alvo>e.x?1:-1;e.x+=e.dir*Math.min(Math.abs(e.alvo-e.x),vel*dt);andando=true;}
    }
    return {x:e.x,y:y,dir:e.dir,andando:andando,perto:perto};
  }
  // Bagunça da semana (tw-bairro.js + tw-bichos.js, 17/11): o bicho da semana passeia na rua dele, com "!" enquanto
  // a bagunça não foi resolvida e coração depois; olha para o seu Idol quando ele chega perto; tocado, abre a Vida no bairro.
  var semanaEstado={x:820,alvo:820,dir:-1,parado:0,t:0},semanaPos=null,semanaCache={t:-9,b:null};
  function bagSemana(tm){if(tm-semanaCache.t>2){semanaCache.t=tm;try{semanaCache.b=window.TW_BAIRRO&&TW_BAIRRO.bagunca?TW_BAIRRO.bagunca():null;}catch(e){semanaCache.b=null;}}return semanaCache.b;}
  function desenharBichoSemana(tm){
    semanaPos=null;var Bi=window.TW_BICHOS,b=bagSemana(tm);if(!Bi||!b||b.rua!==cena)return;
    var voa=b.bicho==='borboleta'||b.bicho==='nuvem',ES=ESCALA_RUA*.95,yb=b.bicho==='nuvem'?470:b.bicho==='borboleta'?640:728;
    var p=andarilho(semanaEstado,tm,380,1220,yb,voa?44:30,2.2),pulo=p.andando&&!voa?Math.abs(Math.sin(tm*7))*5:0;
    ctx.save();if(p.dir<0){ctx.translate(p.x,0);ctx.scale(-1,1);ctx.translate(-p.x,0);}
    Bi.desenhar(ctx,b.bicho,p.x,p.y-pulo,ES,b.ok?'feliz':'travesso',reduzMov?0:tm*20);ctx.restore();
    var topo=p.y-44*ES+(b.bicho==='nuvem'?30:b.bicho==='borboleta'?18:36)*ES/2.5-pulo,bx=p.x+26*ES/2.5,cor=b.ok?'#ff4fa3':'#9b30d9';
    ctx.save();ctx.translate(bx,topo-10+(reduzMov?0:Math.sin(tm*2.4)*3));ctx.fillStyle='#fff';ctx.strokeStyle=cor;ctx.lineWidth=3;
    ctx.beginPath();if(ctx.roundRect)ctx.roundRect(-15,-28,30,26,12);else ctx.rect(-15,-28,30,26);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.moveTo(-5,-3);ctx.lineTo(-10,7);ctx.lineTo(4,-3);ctx.fill();
    ctx.fillStyle=cor;ctx.font='900 20px system-ui,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(b.ok?'♥':'!',0,-14.5);ctx.restore();
    semanaPos={x:p.x,y:p.y,h:44*ES};
  }
  // Pombinho da Praça: gordinho, anda balançando a cabeça e cisca quando para; tocado, bate as asas.
  function pomboDesenhar(tm,c,pt){
    var voo=pt!=null&&tm-pt<1.2?Math.sin(Math.min(1,(tm-pt)/1.2)*Math.PI)*34:0,
        passo=c.andando&&!reduzMov?Math.sin(tm*10):0,cisca=!c.andando&&!c.perto&&!reduzMov&&(tm%2.6)<.5?Math.sin((tm%2.6)/.5*Math.PI):0,
        asa=voo>0&&!reduzMov?Math.sin(tm*24)*.9:0,pisca=!reduzMov&&(tm%3.9)<.12,CONT='#6f6a8e';
    ctx.save();ctx.translate(c.x,c.y);ctx.fillStyle='rgba(30,10,60,.16)';ctx.beginPath();ctx.ellipse(0,11,16-voo*.2,3.5,0,0,7);ctx.fill();
    ctx.translate(0,-voo-Math.abs(passo)*1.5);ctx.scale(c.dir*1.6,1.6);ctx.lineJoin='round';ctx.lineCap='round';
    ctx.strokeStyle='#ff9f6b';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(-2,6);ctx.lineTo(-2-passo*2,11);ctx.moveTo(3,6);ctx.lineTo(3+passo*2,11);ctx.stroke();
    function corpo(){ctx.beginPath();ctx.ellipse(0,0,11,8.5,0,0,7);ctx.moveTo(-9,-1);ctx.lineTo(-17,-5);ctx.lineTo(-15,3);ctx.closePath();}
    ctx.save();ctx.translate(7,-7+cisca*7);ctx.rotate(cisca*.6);
    ctx.strokeStyle=CONT;ctx.lineWidth=2.4;ctx.beginPath();ctx.arc(0,0,6.2,0,7);ctx.stroke();
    ctx.restore();
    ctx.strokeStyle=CONT;ctx.lineWidth=2.4;corpo();ctx.stroke();ctx.fillStyle='#c9c4e6';corpo();ctx.fill();
    ctx.fillStyle='#e9e6fa';ctx.beginPath();ctx.ellipse(2,3,6.5,4.2,0,0,7);ctx.fill();
    ctx.save();ctx.translate(-2,-2);ctx.rotate(-.2-asa);ctx.fillStyle='#a9a2d4';ctx.beginPath();ctx.ellipse(-4,0,8,4.4,0,0,7);ctx.fill();
    ctx.fillStyle='#8f88c4';ctx.fillRect(-9,-1,3,1.2);ctx.fillRect(-6,-1.4,3,1.2);ctx.restore();
    ctx.save();ctx.translate(7,-7+cisca*7);ctx.rotate(cisca*.6);
    ctx.fillStyle='#c9c4e6';ctx.beginPath();ctx.arc(0,0,6.2,0,7);ctx.fill();
    ctx.fillStyle='#9fe0c8';ctx.beginPath();ctx.ellipse(-2,4.5,4.5,2,0,0,7);ctx.fill();   // pescoço furta-cor
    ctx.fillStyle='#ffb36b';ctx.beginPath();ctx.moveTo(5.5,-1.2);ctx.lineTo(9.5,.4);ctx.lineTo(5.5,1.6);ctx.closePath();ctx.fill();
    if(pisca){ctx.strokeStyle='#2a1a2a';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(2,-1.5,1.6,.15*Math.PI,.85*Math.PI);ctx.stroke();}
    else{ctx.fillStyle='#2a1a2a';ctx.beginPath();ctx.arc(2,-1.5,1.6,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(1.5,-2,.6,0,7);ctx.fill();}
    ctx.fillStyle='rgba(255,111,181,.5)';ctx.beginPath();ctx.ellipse(1,2,1.8,1.1,0,0,7);ctx.fill();
    ctx.restore();ctx.restore();
    if(pt!=null&&tm-pt<1.8)balao(c.x-14,c.y-80-voo,'♡',Math.min(1,(1.8-(tm-pt))*2));
    else if(c.perto&&(tm%3.4)<1.4)balao(c.x-14,c.y-80,'♪',Math.min(1,Math.sin((tm%3.4)/1.4*Math.PI)*2));
  }
  // Ovelhinha de nuvem do Jardim das Nuvens: fofa, balança; tocada, quica soltando nuvenzinhas; à noite dorme.
  function ovelhaDesenhar(tm,gx,gy,pt,noite,perto){
    var up=pt!=null?Math.max(0,Math.sin(Math.min(1,(tm-pt)/.5)*Math.PI))*22:0,feliz=pt!=null&&tm-pt<1.8||!!perto,dormindo=noite&&!feliz,
        bal=reduzMov?0:Math.sin(tm*(feliz?4:1.6))*(dormindo?.02:.06),pisca=!reduzMov&&!dormindo&&(tm%4.1)<.12,CONT='#b9b3dd';
    ctx.save();ctx.translate(gx,gy);ctx.fillStyle='rgba(30,10,60,.16)';ctx.beginPath();ctx.ellipse(0,15,26-up*.3,5,0,0,7);ctx.fill();
    ctx.translate(0,-up);ctx.rotate(bal);ctx.scale(1.6,1.6);ctx.lineJoin='round';ctx.lineCap='round';
    ctx.fillStyle='#8c84b8';[-9,-3,5,11].forEach(function(px){ctx.beginPath();ctx.ellipse(px,10,2.4,3.2,0,0,7);ctx.fill();});
    var bolas=[[-12,-2,8],[-4,-8,9],[6,-7,9],[13,0,8],[6,5,9],[-6,5,9]];
    ctx.strokeStyle=CONT;ctx.lineWidth=2.6;bolas.forEach(function(b){ctx.beginPath();ctx.arc(b[0],b[1],b[2],0,7);ctx.stroke();});
    ctx.fillStyle='#ffffff';bolas.forEach(function(b){ctx.beginPath();ctx.arc(b[0],b[1],b[2],0,7);ctx.fill();});
    ctx.fillStyle='rgba(185,179,221,.35)';ctx.beginPath();ctx.arc(-2,4,8,0,Math.PI);ctx.fill();
    // carinha lilás com orelhinhas
    ctx.fillStyle='#d7cff5';ctx.strokeStyle=CONT;ctx.lineWidth=1.6;
    ctx.beginPath();ctx.ellipse(-17,-6,5,2.6,-.5,0,7);ctx.fill();ctx.stroke();ctx.beginPath();ctx.ellipse(-3,-9,5,2.6,.5,0,7);ctx.fill();ctx.stroke();
    ctx.beginPath();ctx.ellipse(-10,-3,8,7,0,0,7);ctx.fill();ctx.stroke();
    ctx.fillStyle='#ffffff';[[-14,-11,3],[-10,-12.5,3.4],[-6,-11,3]].forEach(function(b){ctx.beginPath();ctx.arc(b[0],b[1],b[2],0,7);ctx.fill();});   // franjinha de nuvem
    ctx.fillStyle='rgba(255,111,181,.5)';ctx.beginPath();ctx.ellipse(-15,0,1.8,1.1,0,0,7);ctx.ellipse(-5,0,1.8,1.1,0,0,7);ctx.fill();
    ctx.strokeStyle='#3a2a4a';ctx.lineWidth=1.4;
    if(dormindo||pisca){ctx.beginPath();ctx.arc(-13,-4,1.8,.15*Math.PI,.85*Math.PI);ctx.moveTo(-5.2,-4);ctx.arc(-7,-4,1.8,.15*Math.PI,.85*Math.PI);ctx.stroke();}
    else{[-13,-7].forEach(function(ex){ctx.fillStyle='#2a1a3a';ctx.beginPath();ctx.arc(ex,-4,1.7,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex-.5,-4.6,.6,0,7);ctx.fill();});}
    ctx.strokeStyle='#5a4a6a';ctx.lineWidth=1;ctx.beginPath();ctx.arc(-11,0,1.3,.1,Math.PI-.1);ctx.moveTo(-7.4,0);ctx.arc(-8.7,0,1.3,.1,Math.PI-.1);ctx.stroke();
    if(dormindo&&!reduzMov){ctx.fillStyle='#7b3ff0';ctx.font='12px "Mochiy Pop One",sans-serif';
      for(var z=0;z<2;z++){var fz=((tm*.7+z*.5)%1);ctx.globalAlpha=Math.sin(fz*Math.PI)*.8;ctx.fillText('z',4+z*5+fz*5,-18-fz*12);}ctx.globalAlpha=1;}
    ctx.restore();
    if(pt!=null&&tm-pt<1.4&&!reduzMov){var u=(tm-pt)/1.4;ctx.save();ctx.globalAlpha=1-u;ctx.fillStyle='#ffffff';
      [[-1,1],[1,1],[0,1.3]].forEach(function(d,i){var nx=gx+d[0]*(20+u*50)+(i===2?0:0),ny=gy-20-u*40*d[1];ctx.beginPath();ctx.arc(nx,ny,8,0,7);ctx.arc(nx+8,ny+2,6,0,7);ctx.arc(nx-8,ny+2,6,0,7);ctx.fill();});ctx.restore();}
    if(pt!=null&&tm-pt<1.8)balao(gx-14,gy-92,'♡',Math.min(1,(1.8-(tm-pt))*2));
    else if(perto&&(tm%3.2)<1.4)balao(gx-14,gy-92,'♪',Math.min(1,Math.sin((tm%3.2)/1.4*Math.PI)*2));
  }
  function cachorroDesenhar(tm,gx,gy,pt,noite,perto){
    var up=pt!=null?Math.max(0,Math.sin(Math.min(1,(tm-pt)/.45)*Math.PI))*20:(perto&&!reduzMov?Math.abs(Math.sin(tm*5))*5:0),
        feliz=pt!=null&&tm-pt<1.8||!!perto,dormindo=noite&&!feliz,
        rabo=reduzMov?0:Math.sin(tm*(feliz?16:5))*(dormindo?.05:.35),pisca=!reduzMov&&!dormindo&&(tm%3.7)<.12;
    ctx.save();ctx.translate(gx,gy-up);ctx.scale(1.15,1.15);   // menor (era 1.7): na tela do celular parecia gigantectx.lineJoin='round';ctx.lineCap='round';
    ctx.fillStyle='rgba(30,10,60,.18)';ctx.beginPath();ctx.ellipse(0,15+up/1.7,25,5,0,0,7);ctx.fill();
    var PELO='#f2a65a',CLARO='#fff4e2',CONT='#a65a22';
    function silhueta(){ctx.beginPath();ctx.ellipse(4,2,19,13,0,0,7);ctx.moveTo(12,-16);ctx.arc(-4,-16,14,0,7);}
    function orelhas(){ctx.beginPath();ctx.moveTo(-16,-24);ctx.lineTo(-15,-38);ctx.lineTo(-6,-28);ctx.closePath();ctx.moveTo(2,-28);ctx.lineTo(9,-38);ctx.lineTo(10,-24);ctx.closePath();}
    // rabo enrolado (shiba) que abana
    ctx.save();ctx.translate(20,-4);ctx.rotate(rabo);ctx.strokeStyle=CONT;ctx.lineWidth=9;ctx.beginPath();ctx.arc(5,-5,7,Math.PI*.9,Math.PI*2.4);ctx.stroke();
    ctx.strokeStyle=PELO;ctx.lineWidth=6;ctx.stroke();ctx.strokeStyle=CLARO;ctx.lineWidth=3;ctx.beginPath();ctx.arc(5,-5,7,Math.PI*1.9,Math.PI*2.3);ctx.stroke();ctx.restore();
    ctx.strokeStyle=CONT;ctx.lineWidth=3.2;silhueta();ctx.stroke();orelhas();ctx.stroke();
    ctx.fillStyle=PELO;silhueta();ctx.fill();orelhas();ctx.fill();
    ctx.fillStyle='#ffc9a3';ctx.beginPath();ctx.moveTo(-14,-27);ctx.lineTo(-13.5,-34);ctx.lineTo(-8.5,-29);ctx.closePath();ctx.moveTo(3.5,-29);ctx.lineTo(8,-34);ctx.lineTo(8.5,-27);ctx.closePath();ctx.fill();
    ctx.fillStyle=CLARO;ctx.beginPath();ctx.ellipse(-4,-10,10,7,0,0,7);ctx.fill();ctx.beginPath();ctx.ellipse(-2,4,9,9,0,0,7);ctx.fill();
    ctx.beginPath();ctx.ellipse(-11,-20,2.6,1.6,0,0,7);ctx.ellipse(3,-20,2.6,1.6,0,0,7);ctx.fill();   // pintinhas de sobrancelha
    ctx.strokeStyle=CONT;ctx.lineWidth=1.6;[-9,4].forEach(function(px){ctx.fillStyle=CLARO;ctx.beginPath();ctx.ellipse(px,13,5.5,3.6,0,0,7);ctx.fill();ctx.stroke();});
    // coleira azul com plaquinha de estrela (troféus da Arena)
    ctx.strokeStyle='#4169e1';ctx.lineWidth=3.2;ctx.beginPath();ctx.arc(-4,-16,13.5,Math.PI*.28,Math.PI*.72);ctx.stroke();
    ctx.fillStyle='#ffd23f';ctx.strokeStyle='#b8860b';ctx.lineWidth=1;ctx.beginPath();
    for(var q=0;q<10;q++){var an=-Math.PI/2+q*Math.PI/5,rr=q%2?1.8:4;ctx.lineTo(-4+Math.cos(an)*rr,-.5+Math.sin(an)*rr);}ctx.closePath();ctx.fill();ctx.stroke();
    // rosto
    ctx.fillStyle='rgba(255,111,181,.45)';ctx.beginPath();ctx.ellipse(-14,-12,3.2,2,0,0,7);ctx.ellipse(6,-12,3.2,2,0,0,7);ctx.fill();
    ctx.strokeStyle='#3a2a2a';ctx.lineWidth=1.8;
    if(dormindo||pisca){ctx.beginPath();ctx.arc(-10,-17,3,.15*Math.PI,.85*Math.PI);ctx.moveTo(5,-17);ctx.arc(2,-17,3,.15*Math.PI,.85*Math.PI);ctx.stroke();}
    else{[-10,2].forEach(function(ex){ctx.fillStyle='#2a1a2a';ctx.beginPath();ctx.arc(ex,-17,2.6,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex-.9,-18,.9,0,7);ctx.fill();});}
    ctx.fillStyle='#2a1a2a';ctx.beginPath();ctx.ellipse(-4,-12.5,2.4,1.7,0,0,7);ctx.fill();
    ctx.strokeStyle='#5a3a2a';ctx.lineWidth=1.1;ctx.beginPath();ctx.moveTo(-4,-11);ctx.lineTo(-4,-9.5);ctx.arc(-5.5,-9.5,1.5,0,Math.PI);ctx.moveTo(-1,-9.5);ctx.arc(-2.5,-9.5,1.5,0,Math.PI);ctx.stroke();
    if(feliz&&!dormindo){ctx.fillStyle='#ff7aa8';ctx.beginPath();ctx.ellipse(-4,-6.8,2,2.6,0,0,7);ctx.fill();}   // linguinha de alegria
    if(dormindo&&!reduzMov){ctx.fillStyle='#7b3ff0';ctx.font='16px "Mochiy Pop One",sans-serif';
      for(var z=0;z<2;z++){var fz=((tm*.7+z*.5)%1);ctx.globalAlpha=Math.sin(fz*Math.PI)*.8;ctx.fillText('z',8+z*6+fz*6,-36-fz*18);}ctx.globalAlpha=1;}
    ctx.restore();
    if(pt!=null&&tm-pt<1.8)balao(gx-16,gy-104,'♡!',Math.min(1,(1.8-(tm-pt))*2));
    else if(perto&&(tm%3.2)<1.4)balao(gx-16,gy-104,'♪',Math.min(1,Math.sin((tm%3.2)/1.4*Math.PI)*2));
  }
  // Coelhinho: pula entre as floreiras da direita, para e olha para o seu Idol quando ele chega perto.
  var coelhoEstado={x:1240,alvo:1240,dir:1,pulo:0,t:0,parado:0};
  function coelhoPos(tm){
    var e=coelhoEstado,dt=Math.min(.1,Math.max(0,tm-(e.t||tm)));e.t=tm;
    var perto=meuIdolPerto(e.x,170);
    if(perto){e.dir=perto.x<e.x?-1:1;e.parado=tm;}
    else if(!reduzMov&&tm-e.parado>1.2){
      if(Math.abs(e.alvo-e.x)<4)e.alvo=1090+Math.random()*400;
      e.dir=e.alvo>e.x?1:-1;e.x+=e.dir*Math.min(Math.abs(e.alvo-e.x),55*dt);
    }
    var andando=!perto&&!reduzMov&&Math.abs(e.alvo-e.x)>=4&&tm-e.parado>1.2;
    return {x:e.x,y:718,dir:e.dir,hop:andando?Math.abs(Math.sin(tm*7))*14:0,perto:perto};
  }
  function coelhoDesenhar(tm,c,pt){
    // A8.2: somente desenho. Posição, hitbox, movimento e reações seguem inalterados.
    var toque=!reduzMov&&pt!=null?Math.max(0,Math.sin(Math.min(1,Math.max(0,(tm-pt)/.5))*Math.PI))*30:0,
        up=c.hop+toque, ar=Math.min(1,up/44),
        orelha=c.perto&&!reduzMov?Math.sin(tm*8)*.18:0,
        pisca=!reduzMov&&(tm%4.4)<.12,
        BRANCO='#fffafc',CONT='#b98aa6';
    ctx.save();ctx.translate(c.x,c.y);
    // A sombra permanece no solo e encolhe discretamente durante o salto.
    ctx.fillStyle='rgba(30,10,60,'+(.16-ar*.07)+')';
    ctx.beginPath();ctx.ellipse(0,12,Math.max(12,21-up*.17),4-ar,0,0,Math.PI*2);ctx.fill();
    ctx.translate(0,-up);ctx.scale(c.dir*1.6,1.6);
    ctx.lineJoin='round';ctx.lineCap='round';
    function elipse(x,y,rx,ry){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();ctx.stroke();}
    // Orelhas: cada elipse é um caminho independente, sem linhas entre elas.
    [[-4,-.25+orelha],[3,.2-orelha]].forEach(function(o){
      ctx.save();ctx.translate(o[0],-17);ctx.rotate(o[1]);
      ctx.fillStyle=BRANCO;ctx.strokeStyle=CONT;ctx.lineWidth=2;
      elipse(0,-10,4.2,10.5);
      ctx.fillStyle='#ffb3cf';ctx.beginPath();ctx.ellipse(0,-10,2,7,0,0,Math.PI*2);ctx.fill();
      ctx.restore();
    });
    // Silhueta: corpo, cauda e cabeça com contornos limpos.
    ctx.fillStyle=BRANCO;ctx.strokeStyle=CONT;ctx.lineWidth=2.2;
    elipse(-3,2,13.5,9.5);
    elipse(-15,0,4.5,4.8);
    elipse(5,-9,10,10);
    // Patas apoiadas na base do corpo, sem modificar o ponto de contato.
    ctx.lineWidth=1.3;
    elipse(-7,9,5,2.8);elipse(5,9,4.8,2.8);
    ctx.fillStyle='rgba(255,111,181,.45)';ctx.beginPath();ctx.ellipse(10,-6,2.6,1.6,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#3a2a3a';ctx.lineWidth=1.6;
    if(pisca){ctx.beginPath();ctx.arc(8,-10,2.4,.15*Math.PI,.85*Math.PI);ctx.stroke();}
    else{ctx.fillStyle='#2a1a2a';ctx.beginPath();ctx.arc(8,-10,2.3,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(7.3,-10.8,.8,0,Math.PI*2);ctx.fill();}
    ctx.fillStyle='#ff8fbf';ctx.beginPath();ctx.ellipse(14.6,-7.6,1.6,1.2,0,0,Math.PI*2);ctx.fill();
    ctx.restore();
    if(pt!=null&&tm-pt<1.8)balao(c.x-14,c.y-90,'♡',Math.min(1,(1.8-(tm-pt))*2));
    else if(c.perto&&(tm%3.4)<1.4)balao(c.x-14,c.y-90,'✿',Math.min(1,Math.sin((tm%3.4)/1.4*Math.PI)*2));
  }
  function desenharBichos(tm){
    var tipo=BICHOS[cena];if(!tipo)return;
    if(tipo==='gato'){
      var h=new Date().getHours(),gx0=cena==='palco'?560:550;gatoDesenhar(tm,gx0,700,pulos['gato'],h>=21||h<6,meuIdolPerto(gx0,130));return;
    }
    if(cena==='praca')peixesFonte(tm);
    var n=tipo==='passaro'?3:4;
    var Bi=window.TW_BICHOS;
    for(var k=0;k<n;k++){var b=posBicho(k,reduzMov?k*2.1:tm),tam=tipo==='passaro'?1.6:2;ctx.save();
      if(tipo==='borboleta'&&Bi&&Bi.simples){ctx.translate(b.x,b.y);ctx.scale(b.dir,1);Bi.simples(ctx,'borboleta',0,22*1.4,1.4,'feliz',(reduzMov?k*9:tm*20)+k*7);ctx.restore();continue;}   // 17/11: a borboleta nova, no traço dos Idols
      ctx.translate(b.x,b.y);ctx.scale(b.dir*tam,tam);
      voadorDesenhar(tipo,k,tm);
      ctx.restore();}
  }
  // borboleta ou passarinho na origem (o chamador já fez translate/scale); desenho igual ao de sempre
  function voadorDesenhar(tipo,k,tm){
      ctx.lineJoin='round';ctx.lineCap='round';
      if(tipo==='borboleta'){
        var C=[['#ff8fc8','#ffd1ea','#c9478d'],['#ffd36b','#fff1b8','#c9921a'],['#b98bff','#e6dbff','#6e44c9'],['#7fd3ff','#dcf4ff','#2f8fca']][k],
            asa=reduzMov?1:.22+.78*Math.abs(Math.sin(tm*9+k));
        ctx.save();ctx.scale(asa,1);ctx.strokeStyle=C[2];ctx.lineWidth=1.1;
        [-1,1].forEach(function(l){
          ctx.fillStyle=C[0];ctx.beginPath();ctx.ellipse(l*7,-5,8,7,l*.45,0,7);ctx.fill();ctx.stroke();
          ctx.beginPath();ctx.ellipse(l*5.5,5,5.2,4.6,-l*.35,0,7);ctx.fill();ctx.stroke();
          ctx.fillStyle=C[1];ctx.beginPath();ctx.ellipse(l*8,-6,3.6,3,l*.45,0,7);ctx.fill();
          ctx.fillStyle='#ffffff';ctx.beginPath();ctx.arc(l*11,-9,1.3,0,7);ctx.arc(l*6,5.5,1.1,0,7);ctx.fill();});
        ctx.restore();
        ctx.fillStyle='#4a2f66';ctx.beginPath();ctx.ellipse(0,0,1.6,8,0,0,7);ctx.fill();
        ctx.strokeStyle='#4a2f66';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(-.5,-7.5);ctx.quadraticCurveTo(-3,-13,-5,-14);ctx.moveTo(.5,-7.5);ctx.quadraticCurveTo(3,-13,5,-14);ctx.stroke();
        ctx.fillStyle='#4a2f66';ctx.beginPath();ctx.arc(-5,-14,1.1,0,7);ctx.arc(5,-14,1.1,0,7);ctx.fill();}
      else{
        var P=[['#7fd3ff','#3d9fd8'],['#ffb3d6','#e07aa8'],['#fff3a8','#d9b43a']][k],bat=reduzMov?0:Math.sin(tm*10+k),
            corpo=function(){ctx.beginPath();ctx.ellipse(0,0,12,9.5,0,0,7);ctx.moveTo(16,-6);ctx.arc(10,-6,6.5,0,7);
              ctx.moveTo(-10,-2);ctx.lineTo(-19,-7);ctx.lineTo(-17,2);ctx.closePath();};
        ctx.strokeStyle=P[1];ctx.lineWidth=2.4;corpo();ctx.stroke();ctx.fillStyle=P[0];corpo();ctx.fill();
        ctx.fillStyle='rgba(255,255,255,.85)';ctx.beginPath();ctx.ellipse(3,3.5,7,4.5,.15,0,7);ctx.fill();
        ctx.save();ctx.translate(-1,-3);ctx.rotate(-.35-bat*.75);ctx.fillStyle=P[1];ctx.beginPath();ctx.ellipse(-6,0,8,4.4,0,0,7);ctx.fill();
        ctx.fillStyle=P[0];ctx.beginPath();ctx.ellipse(-5,-.6,5.4,2.6,0,0,7);ctx.fill();ctx.restore();
        ctx.fillStyle='#ffa94d';ctx.strokeStyle='#d9772a';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(15.5,-7.5);ctx.lineTo(21.5,-5.5);ctx.lineTo(15.5,-3.5);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle='#2a1a3a';ctx.beginPath();ctx.arc(12,-8,1.9,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(11.4,-8.7,.7,0,7);ctx.fill();
        ctx.fillStyle='rgba(255,111,181,.55)';ctx.beginPath();ctx.ellipse(10.5,-3.6,2.2,1.3,0,0,7);ctx.fill();}
  }
  function desenharToques(tm){
    toques=toques.filter(function(t){var u=(tm-t.t0)/(t.dur||1);if(u>1||u<0)return false;ctx.save();
      if(t.tipo==='alvo'){ctx.globalAlpha=1-u;ctx.strokeStyle='#b6ff3b';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(t.x,t.y,14+u*30,4+u*8,0,0,7);ctx.stroke();}
      else if(t.tipo==='fala'){   // balão de fala de quem está em visita
        ctx.globalAlpha=Math.min(1,u*8,(1-u)*5);ctx.font='bold 17px "M PLUS Rounded 1c",sans-serif';
        var quem=ultimos.find(function(o){return o.i===t.i&&o.oshi;});if(quem)t.x=quem.x;   // o balão acompanha quem fala
        var lw=Math.min(380,ctx.measureText(t.txt).width+28),yy=t.y-(reduzMov?0:u*8);
        ctx.fillStyle='#fff';ctx.strokeStyle=t.cor||'#7b3ff0';ctx.lineWidth=3;rr(t.x-lw/2,yy-20,lw,38,16);ctx.fill();ctx.stroke();
        ctx.beginPath();ctx.moveTo(t.x-7,yy+17);ctx.lineTo(t.x,yy+28);ctx.lineTo(t.x+7,yy+17);ctx.closePath();ctx.fill();
        ctx.fillStyle='#4b2a9e';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(t.txt,t.x,yy,lw-18);}
      else if(t.tipo==='agua'){for(var g=0;g<16;g++){var a=g/16*Math.PI*2,r=u*150,h=Math.sin(u*Math.PI)*120;ctx.globalAlpha=1-u;ctx.fillStyle=g%2?'#a9eaff':'#ffffff';
          ctx.beginPath();ctx.ellipse(t.x+Math.cos(a)*r,t.y-h*(.6+.4*Math.abs(Math.sin(a*3)))+Math.sin(a)*r*.25,4,6,0,0,7);ctx.fill();}
        ctx.globalAlpha=1-u;ctx.strokeStyle='#ffffff';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(t.x,t.y+40,40+u*170,8+u*24,0,0,7);ctx.stroke();
        if(u<.85){ctx.globalAlpha=Math.min(1,(.85-u)*4);ctx.fillStyle='#7b3ff0';ctx.font='26px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.fillText(t.txt,t.x,t.y-150-u*30);}}
      else{ctx.font='24px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';
        for(var p=0;p<7;p++){var a2=-Math.PI/2+(p-3)*.42,r2=18+u*80;ctx.globalAlpha=1-u*u;
          ctx.fillStyle=['#ff6fb5','#7b3ff0','#ffb300','#4169e1'][p%4];ctx.fillText(t.sim[p%t.sim.length],t.x+Math.cos(a2)*r2,t.y+Math.sin(a2)*r2-u*20);}}
      ctx.restore();return true;});
  }
  var FALA_TOQUE={pt:'✨ Desejo feito!',en:'✨ Wish made!',es:'✨ ¡Deseo pedido!',id:'✨ Harapan dibuat!',th:'✨ ขอพรแล้ว!',ja:'✨ ねがいごと!'};
  function observarFonte(tm){
    somMapa('regar');
    toques.push({tipo:'agua',x:800,y:560,t0:tm,dur:reduzMov?1.2:1.4,txt:FALA_TOQUE[lang()]||FALA_TOQUE.pt});
    desenhar();
  }
  function tocarRua(x,y){
    var tm=performance.now()/1000;
    if(semanaPos&&Math.abs(x-semanaPos.x)<30*ESCALA_RUA&&y<=semanaPos.y+10&&y>=semanaPos.y-semanaPos.h-30){   // o bicho da Bagunça da semana: abre a Vida no bairro
      somMapa('toque');try{if(window.TW_BAIRRO&&TW_BAIRRO.abrir)TW_BAIRRO.abrir();}catch(e){}return;}
    // 1) passeante tocado: pula e responde (o seu Idol responde com coração)
    var q=null;ultimos.forEach(function(o){if(Math.abs(o.x-x)<22*ESCALA_RUA&&y<=o.y+8&&y>=o.y-52*ESCALA_RUA)q=o;});
    if(q&&q.oshi){pulos[q.i]=tm;somMapa('ponto');var fl=(VISITA_FALAS[lang()]||VISITA_FALAS.pt)[q.oshiK]||'💜';
      toques.push({tipo:'fala',x:q.x,y:q.y-44*ESCALA_RUA-82,i:q.i,t0:tm,dur:2.6,txt:fl,cor:['#9b30d9','#7cc400','#4169e1'][q.oshiK]});if(!reduzMov)toques.push({x:q.x,y:q.y-50*ESCALA_RUA,t0:tm,dur:.9,sim:['💜','💚','💙']});desenhar();return;}
    if(q){pulos[q.i]=tm;somMapa('ponto');if(!reduzMov)toques.push({x:q.x,y:q.y-50*ESCALA_RUA,t0:tm,dur:.9,sim:q.dono?['❤','♡']:['♪','✦','❤']});desenhar();return;}
    // 2) bichinhos
    var tipo=BICHOS[cena];
    if(tipo==='gato'){var gx=cena==='palco'?560:550;if(Math.abs(x-gx)<70&&Math.abs(y-680)<60){pulos['gato']=tm;somMapa('toque');if(!reduzMov)toques.push({x:gx-10,y:640,t0:tm,dur:.9,sim:['♡','❤','✦']});desenhar();return;}}
    else if(tipo){var n=tipo==='passaro'?3:4;for(var k=0;k<n;k++){var b=posBicho(k,reduzMov?k*2.1:tm);
      if(Math.hypot(b.x-x,b.y-y)<60){bichoAssustado[cena+k]=tm;somMapa('toque');if(!reduzMov)toques.push({x:b.x,y:b.y,t0:tm,dur:.8,sim:['♡','✦']});desenhar();return;}}}
    var ch=CHAO[cena],cp=chaoPos[cena];
    if(ch&&cp&&Math.abs(x-cp.x)<60&&y>cp.y-70&&y<cp.y+30){pulos[ch]=tm;somMapa('toque');if(!reduzMov)toques.push({x:cp.x,y:cp.y-60,t0:tm,dur:.9,sim:['♡','❤','✦']});desenhar();return;}
    // 3) fonte da Praça: espirra água e faz um desejo
    if(cena==='praca'&&Math.hypot((x-800)/260,(y-570)/120)<1){observarFonte(tm);return;}
    // 4) chão: o seu Idol caminha até lá, para um pouco e volta ao passeio
    if(y>=650&&ultimos.some(function(o){return o.dono;})){
      var meu=ultimos.find(function(o){return o.dono;}),alvo=Math.max(60,Math.min(1540,x));
      meuPasseio={x0:meu.x,x1:alvo,t0:tm,ida:reduzMov?.01:Math.max(.35,Math.abs(alvo-meu.x)/(ANDA*1.3))};
      toques.push({tipo:'alvo',x:alvo,y:Math.min(756,Math.max(744,y)),t0:tm,dur:.8});somMapa('toque');desenhar();return;
    }
    // 5) qualquer outro lugar: um punhado de símbolos do bairro
    if(!reduzMov){toques.push({x:x,y:y,t0:tm,dur:1,sim:TEMA_TOQUE[cena]||['✦']});somMapa('toque');desenhar();}
  }
  // Posição do seu Idol enquanto atende ao toque: ida → pausa → volta suave ao passeio.
  function passeioDoToque(q,tm){
    var m=meuPasseio;if(!m)return q;var t=tm-m.t0;
    if(t<0||t>m.ida+MEU_PARA+1.2){meuPasseio=null;return q;}
    if(t<m.ida){var u=t/m.ida,passo=Math.max(0,Math.min(1,u*8,(1-u)*8));u=u*u*(3-2*u);return {x:m.x0+(m.x1-m.x0)*u,dir:m.x1>=m.x0?1:-1,mov:1,passo:passo,volta:0};}
    if(t<m.ida+MEU_PARA){
      if(!m.humor && Math.abs(m.x1-m.x0)>=40){m.humor=true;if(window.TW_HUMOR)window.TW_HUMOR.evento('mapa');}
      // Parou perto da fonte da Praça: joga uma moedinha e faz um desejo.
      if(cena==='praca'&&!m.desejo&&Math.abs(m.x1-800)<190){m.desejo=1;somMapa('regar');
        toques.push({tipo:'agua',x:800,y:560,t0:tm,dur:reduzMov?1.2:1.4,txt:FALA_TOQUE[lang()]||FALA_TOQUE.pt});}
      return {x:m.x1,dir:m.x1>=m.x0?1:-1,mov:0,porta:-1,volta:0,pausa:t-m.ida,toque:true};
    }
    var v=Math.max(0,Math.min(1,(t-m.ida-MEU_PARA)/1.2)),passo=Math.min(1,v*8,(1-v)*8);v=v*v*(3-2*v);return {x:m.x1+(q.x-m.x1)*v,dir:q.x>=m.x1?1:-1,mov:1,passo:passo,volta:0};
  }
  var ESCALA_RUA=1.75;   // Idols maiores só nas ruas; o mapa geral continua de longe.
  function acessorioPasseante(av){
    var a=av&&av.a;
    return typeof a==='string'&&typeof ACC!=='undefined'&&Array.isArray(ACC)&&ACC.some(function(item){return item[0]===a;})?a:'';
  }
  // Contato no mesmo plano dos pés; ao saltar, a sombra fica no piso e se suaviza.
  function sombraPasseante(x,y,sc,bob){
    var altura=Math.max(0,-bob),proximidade=1-Math.min(1,altura/(18*sc));
    ctx.save();ctx.fillStyle='rgba(43,27,70,'+(.06+.06*proximidade)+')';ctx.beginPath();ctx.ellipse(x+2*sc,y,12*sc,3.2*sc,0,0,7);ctx.fill();ctx.fillStyle='rgba(43,27,70,'+(.07+.07*proximidade)+')';
    ctx.beginPath();ctx.ellipse(x+1.2*sc,y, (9.2+2*(1-proximidade))*sc,2.25*sc,0,0,7);ctx.fill();
    ctx.fillStyle='rgba(43,27,70,'+(.14*proximidade)+')';
    ctx.beginPath();ctx.ellipse(x,y,6.2*sc,1.35*sc,0,0,7);ctx.fill();ctx.restore();
  }
  function andar(tm){
    if(typeof perfChar!=='function'||typeof drawChar!=='function'||typeof perfCharContorno!=='function')return;
    // Escala dos Idols nas ruas (era 1.45). Os enfeites em volta acompanham por k.
    var sc=ESCALA_RUA,k=sc/1.45,oS=state,oPw=pw,oDpw=dpw,oR=rankI,oSa=sash,oA=accSel,oF=frame,oP=charPose;
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
        if(p.dono&&meuPasseio)q=passeioDoToque(q,tm);
        if(p.dono&&pausaEscolhida&&pausaEscolhida.dono===donoPausa()&&tm<pausaEscolhida.ate)q={x:pausaEscolhida.x,dir:1,mov:0,porta:-1,volta:0,posando:true};
        var noPalco=false;
        if(p.oshi){var pd=visitaPorta(p.oshiK);noPalco=cena==='palco'&&pd===1;   // no Star Stage, quem visita a porta do meio canta em cima do palco, no microfone
          q={x:noPalco?800:PORTAS[pd]+(pd===2?-95:95),dir:pd===2?-1:1,mov:0,porta:pd,volta:0,pausa:1,ativo:visitaAtividade(p.oshiK)};}
        q.p=p;q.i=i;q.y=noPalco?474:730+(i%3)*8;return q;/* abaixo das placas; o chão acaba em 760 */
      });
      var fa=rua.find(function(q){return q.p.nomeFa;});
      var meuIdol=rua.find(function(q){return q.p.dono;});
      var reencontro=fa&&meuIdol&&!meuIdol.mov&&meuIdol.porta===1;
      var reconhecendo=reencontro&&!reduzMov&&meuIdol.pausa<.35;
      var despedindo=reencontro&&!reduzMov&&meuIdol.pausa>PARA-.65;
      if(fa){
        // O fã espera na Praça. O gesto acontece quando o Idol para por perto.
        fa.x=900;fa.y=746;fa.mov=0;fa.dir=-1;
        if(reencontro)meuIdol.dir=1;
      }
      ultimos=[];visitaEtiquetas=[];falas=[];diamantes=[];
      rua.sort(function(a,b){return a.y-b.y;})   // quem está mais embaixo fica na frente
        .forEach(function(q){
        var p=q.p,c=p.oshiChar||perfChar(p.av),bob=q.mov&&!reduzMov?-Math.abs(Math.sin(tm*8+q.i))*1.8*sc*(q.passo==null?1:q.passo):0;
        // Fase individual: os passeantes não repetem a mesma passada ao mesmo tempo.
        frame=reduzMov?0:tm*60+q.i*13;accSel=acessorioPasseante(p.av);
        var pulo=pulos[q.i];if(pulo!=null){var up=(tm-pulo)/.5;if(up>=0&&up<1&&!reduzMov)bob-=Math.sin(up*Math.PI)*16*k;if(tm-pulo>1.6)delete pulos[q.i];}
        ultimos.push({x:q.x,y:q.y,i:q.i,dono:!!p.dono,oshi:p.oshi||'',oshiK:p.oshiK});
        var segurando=!q.mov&&objeto&&q.porta===objeto.porta&&
          ((p.dono&&registro)||(q.i===1&&!p.dono));
        var pose=q.mov||segurando?'':(p.oshi?p.oshiPose:(p.av.pose||''));
        if(q.posando)pose='v';
        if(q.ativo){var lp=POSES_ATIVAS[q.ativo];pose=lp[reduzMov?0:Math.floor(tm/2.6+(p.oshiK||0))%lp.length];}
        if(reencontro&&q===meuIdol)pose=reconhecendo?'':'tchau';
        if(p.nomeFa){
          if(!reencontro||reconhecendo)pose='';
          else if(despedindo)pose=p.jeitoFa==='timido'?'':'tchau';
        }
        var expr=Number(p.av.expr),expressao=p.nomeFa?(reencontro&&!reconhecendo?p.av.expr:2):(p.av.expr!=null&&Number.isInteger(expr)&&expr>=0&&expr<=6?expr:2);
        if(cena==='praca' && p.dono){
          // Marca de piso sob o próprio Idol, visível mesmo com o cristal ativo.
          ctx.save();ctx.beginPath();ctx.ellipse(q.x,q.y,15*sc,3.8*sc,0,0,Math.PI*2);
          ctx.strokeStyle='#543277';ctx.lineWidth=3.4*sc;ctx.stroke();
          ctx.strokeStyle='#f8efbb';ctx.lineWidth=1.5*sc;ctx.stroke();ctx.restore();
        }
        sombraPasseante(q.x,q.y,sc,bob);
        ctx.save();if(q.dir<0){ctx.translate(q.x,0);ctx.scale(-1,1);ctx.translate(-q.x,0);}
        perfCharContorno(ctx,q.x-15*sc,q.y-44*sc+bob,sc,function(){charPose=pose;drawChar(c,0,0,q.mov&&!reduzMov?1:0,expressao,false);});
        ctx.restore();
        // O seu Idol ganha uma estrelinha por cima, para achar você entre os passeantes.
        if(p.dono&&!(reencontro&&q===meuIdol&&!reconhecendo)){
          var my=q.y-44*sc-16+bob+(reduzMov?0:Math.sin(tm*3)*2.5);
          ctx.save();ctx.fillStyle='#b6ff3b';ctx.strokeStyle='#5a2fb0';ctx.lineWidth=2.2;ctx.beginPath();
          for(var pk=0;pk<10;pk++){var ang=-Math.PI/2+pk*Math.PI/5,raio=pk%2?4.2:10;ctx.lineTo(q.x+Math.cos(ang)*raio,my+Math.sin(ang)*raio);}
          ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();
        }
        if(segurando){
          ctx.save();
          ctx.globalAlpha=reduzMov?1:Math.min(1,q.pausa*5,(PARA-q.pausa)*5);
          var tipoSegurado=tipoObjetoRua(objeto.k,registro,p.dono);
          objetoRua(q.x,q.y,q.dir,tipoSegurado,sc,c.skin,!!p.dono&&!!registro,tm);
          ctx.restore();
        }
        if(!q.mov)parados.push(q);
        if(q.ativo&&!reduzMov){   // notinhas (cantando) ou coraçõezinhos subindo
          ctx.save();ctx.font='22px "Mochiy Pop One",sans-serif';ctx.textAlign='center';
          for(var nn=0;nn<2;nn++){var fn=(tm*.6+nn*.5)%1;ctx.globalAlpha=Math.sin(fn*Math.PI)*.9;
            ctx.fillStyle=q.ativo==='mic'?(nn?'#ffd23f':'#ff6fb5'):'#ff6fb5';
            ctx.fillText(q.ativo==='mic'?(nn?'♫':'♪'):'♥',q.x+(nn?28:-28)*q.dir+Math.sin(fn*6)*5,q.y-44*sc-6-fn*40+bob);}
          ctx.restore();}
        if(p.dono&&window.TW_HUMOR)diamantes.push({x:q.x,y:q.y-44*sc-14+bob,cor:window.TW_HUMOR.cor()});
        var fl=p.dono?(window.TW_PRESENCA&&window.TW_PRESENCA.minha):p.fala;
        if(fl&&fl.frase&&Date.now()-fl.em<(p.dono?8000:12000)&&window.TW_PRESENCA)falas.push({x:q.x,y:q.y-44*sc-38+bob,t:window.TW_PRESENCA.texto(fl.frase)});
        if(p.online&&!p.dono)falas.push({x:q.x,y:q.y-44*sc-26+bob,t:p.nick,nome:true});   // nome de quem está online, logo acima da cabeça
        if(p.oshi)visitaEtiquetas.push({x:q.x,y:q.y-44*sc-42+bob,nome:p.oshi,k:p.oshiK});   // desenhada por cima das placas
        if(p.nomeFa&&!q.mov){
          // Identificação simples, sem links, sem DOM novo e sem alterar hitboxes.
          var etiqueta=('💌 '+p.nomeFa).slice(0,28);
          ctx.save();ctx.font='13px "M PLUS Rounded 1c",sans-serif';
          var largura=Math.min(150,ctx.measureText(etiqueta).width+22);
          ctx.fillStyle='rgba(255,247,255,.96)';ctx.strokeStyle='#bfa4ed';ctx.lineWidth=2;
          rr(q.x-largura/2,q.y-44*sc-37,largura,26,11);ctx.fill();ctx.stroke();
          ctx.fillStyle='#674190';ctx.textAlign='center';ctx.textBaseline='middle';
          ctx.fillText(etiqueta,q.x,q.y-44*sc-24,largura-16);ctx.restore();
          if(reencontro&&!reconhecendo){
            var gesto=p.jeitoFa==='timido'?'…':p.jeitoFa==='animado'?'♪':'♥';
            var cor=p.jeitoFa==='timido'?'#9e83bc':p.jeitoFa==='animado'?'#d88731':'#ec6fa8';
            if(despedindo)gesto=p.jeitoFa==='timido'?'♡':'✦';
            var pausa=meuIdol.pausa;
            var alfa=reduzMov?1:Math.min(1,pausa*3,(PARA-pausa)*3);
            ctx.save();ctx.globalAlpha=alfa;ctx.fillStyle=cor;
            ctx.font='18px "Mochiy Pop One",sans-serif';ctx.textAlign='center';
            ctx.fillText(gesto,q.x+largura/2+15,q.y-44*sc-23);ctx.restore();
          }
        }
        // parado numa porta: de vez em quando um balãozinho (♪ ❤ ★), que aparece e some suave
        if(pulo!=null&&tm-pulo<1.6){
          balao(q.x+(q.dir<0?-40:40)*k,q.y-44*sc+4,p.dono?'❤':BALOES[(q.i*3+1)%BALOES.length],Math.min(1,(1.6-(tm-pulo))*3));
        }else if(q.toque){
          balao(q.x+(q.dir<0?-40:40)*k,q.y-44*sc+4,'✨',Math.min(1,q.pausa*3,(MEU_PARA-q.pausa)*3));
        }else
        if(!q.mov&&!p.nomeFa&&!reduzMov&&!(reencontro&&p.dono)&&(q.volta+q.i)%2===0){
          var fase=q.pausa,a=Math.min(1,fase*3,(PARA-fase)*3);
          balao(q.x+(q.dir<0?-40:40)*k,q.y-44*sc+4,BALOES[(q.volta+q.i)%BALOES.length],Math.max(0,a));
        }
        // o pet vem atrás andando; quando o dono para, ele senta do lado
        var pet=typeof perfPetDoAvatar==='function'?perfPetDoAvatar(p.av):null;
        if(pet&&typeof perfDesenharPetEm==='function'){
          var px=q.x-q.dir*(q.mov?40:30)*k,hop=q.mov?-Math.abs(Math.sin(tm*8+q.i+1.3))*6*k:0;
          ctx.fillStyle='rgba(30,10,60,.16)';ctx.beginPath();ctx.ellipse(px,q.y+2,8*k,1.8*k,0,0,7);ctx.fill();
          perfDesenharPetEm(ctx,pet,px,q.y-14*k+hop,sc*.5,frame);
          // O Pet também reconhece a pausa do Idol diante do fã conhecido.
          // Não sugere amizade nova nem altera estado: só aparece durante o reencontro.
          if(reencontro&&q===meuIdol&&!reconhecendo&&!despedindo){
            ctx.save();
            ctx.globalAlpha=reduzMov?1:Math.max(0,Math.min(1,meuIdol.pausa*2,(PARA-meuIdol.pausa)*2));
            ctx.font='17px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.fillStyle='#ed78ad';
            ctx.fillText('♡',px+(q.dir<0?-12:12)*k,q.y-31*sc);
            ctx.restore();
          }
        }
      });
      // Um encontro é só um aceno entre avatares que já estão no passeio:
      // sem afirmar amizade, encontro real ou recorde. Nunca acima de 1/rua.
      if(!reduzMov&&parados.length>1&&!reencontro&&tm%12<3){
        var meu=parados.find(function(q){return q.p.dono;});
        var vizinho=meu&&parados.find(function(q){
          return !q.p.dono&&!q.p.nomeFa&&Math.abs(q.x-meu.x)<105*k&&Math.abs(q.y-meu.y)<23;
        });
        if(vizinho){
          ctx.save();ctx.font='23px sans-serif';ctx.textAlign='center';
          ctx.globalAlpha=Math.min(1,tm%12,3-tm%12);
          ctx.fillText('♡',(meu.x+vizinho.x)/2,Math.min(meu.y,vizinho.y)-44*sc-35);
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
  // As mesmas referências das ruas, em miniatura e sem movimento na visão da cidade.
  function marcosDoMundo(){
    [
      ['fofo',560,821,1300,493,.48],
      ['harajuku',1119,650,360,404,.35],
      ['arena',1039,809,800,500,.39]
    ].forEach(function(m){
      ctx.save();ctx.translate(m[1],m[2]);ctx.scale(m[5],m[5]);ctx.translate(-m[3],-m[4]);
      marcosDaRua(0,m[0]);ctx.restore();
    });
  }
  // Sinais das três entradas, ancorados na arte e desenhados também em movimento reduzido.
  function marcosDaRua(tm,bairro){
    if(!CORES_BAIRROS[bairro])return;
    ctx.save();
    // Rodapé da calçada (rua.py: base y=560); juntas em perspectiva abaixo das fachadas.
    ctx.fillStyle='rgba(83,55,105,.09)';ctx.fillRect(0,567,1600,5);
    ctx.strokeStyle='rgba(123,88,123,.12)';ctx.lineWidth=1.3;
    [588,625].forEach(function(py){ctx.beginPath();ctx.moveTo(0,py);ctx.lineTo(1600,py);ctx.stroke();});
    [300,800,1300].forEach(function(px){
      ctx.fillStyle='rgba(73,43,97,.11)';ctx.beginPath();ctx.ellipse(px,576,91,6,0,0,7);ctx.fill();
    });
    if(cena !== 'mundo'){
      // Juntas convergem para o fundo da rua; ficam abaixo das entradas.
      ctx.beginPath();
      for(var junta=0;junta<=1600;junta+=160){
        ctx.moveTo(junta,572);ctx.lineTo(junta+(junta-800)*.08,625);
      }
      ctx.stroke();
    }
    if(bairro==='praca'){
      // Bancos de praça, com encosto e assento em dois planos.
      [540,1020].forEach(function(bx){
        ctx.fillStyle='#91716d';ctx.fillRect(bx+3,554,4,23);ctx.fillRect(bx+32,554,4,23);
        ctx.fillStyle='#bf876c';rr(bx,550,40,9,2);ctx.fill();
        ctx.fillStyle='#e7b494';ctx.fillRect(bx+1,551,38,2);
        ctx.fillStyle='#dba183';ctx.beginPath();ctx.moveTo(bx,562);ctx.lineTo(bx+40,562);ctx.lineTo(bx+43,568);ctx.lineTo(bx-3,568);ctx.closePath();ctx.fill();
        ctx.fillStyle='#ad785e';ctx.fillRect(bx-3,568,46,3);
      });
      // Volume da cuba da fonte: mantém água e jatos livres.
      var pedra=ctx.createLinearGradient(0,565,0,608);pedra.addColorStop(0,'rgba(159,124,217,0)');pedra.addColorStop(.6,'rgba(119,91,180,.22)');pedra.addColorStop(1,'rgba(112,76,174,.32)');
      ctx.fillStyle=pedra;ctx.beginPath();ctx.moveTo(626,565);ctx.bezierCurveTo(650,618,950,618,974,565);ctx.quadraticCurveTo(800,640,626,565);ctx.closePath();ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,.55)';ctx.lineWidth=2.5;
      ctx.beginPath();ctx.ellipse(800,565,172,39,0,.18,Math.PI-.18);ctx.stroke();
    }else if(bairro==='ceu'){
      ctx.fillStyle='rgba(103,115,175,.11)';ctx.beginPath();ctx.ellipse(300,571,116,7,0,0,7);ctx.fill();
      // Jardineiras com espessura: o bordo recebe as folhas, em vez de deixá-las flutuar na entrada.
      [196,363].forEach(function(px){
        ctx.fillStyle='#9f9cc4';rr(px-16,554,61,17,5);ctx.fill();
        ctx.fillStyle='#e5deee';rr(px-18,551,65,7,3);ctx.fill();
        ctx.fillStyle='#766f91';rr(px-13,553,55,3,2);ctx.fill();
      });
      // Folhagens baixas em torno do acesso ao jardim.
      [196,216,363,385].forEach(function(px,i){
        ctx.fillStyle=i%2?'#97bbab':'#b2c8ae';
        ctx.beginPath();ctx.ellipse(px,562,15,8,-.15,0,7);ctx.fill();
        ctx.fillStyle='#ffe4ee';ctx.beginPath();ctx.arc(px-5,558,2.4,0,7);ctx.arc(px+4,560,2,0,7);ctx.fill();
      });
      // Studio: pilastra da fachada no sistema de coordenadas de rua.py.
      ctx.save();ctx.translate(1300,558);ctx.scale(1.28,1.28);ctx.translate(-1300,-558);
      var pilastra=ctx.createLinearGradient(1440,0,1458,0);pilastra.addColorStop(0,'#f4eaff');pilastra.addColorStop(1,'#bca8dc');
      ctx.fillStyle=pilastra;rr(1440,455,18,94,5);ctx.fill();ctx.fillStyle='rgba(255,255,255,.56)';ctx.fillRect(1442,459,4,86);ctx.fillStyle='#bba2d3';rr(1436,543,25,6,2);ctx.fill();ctx.restore();
    }else if(bairro==='palco'){
      [300,800,1300].forEach(function(px){ctx.fillStyle='rgba(244,197,255,.20)';ctx.beginPath();ctx.ellipse(px,597,75,8,0,0,7);ctx.fill();});
      // As cortinas assentam no tablado; pregas verticais fazem a moldura parecer tecido.
      [1,-1].forEach(function(lado){var a=lado===1?470:1130;
        ctx.fillStyle='rgba(112,38,92,.24)';ctx.beginPath();ctx.moveTo(a,295);
        ctx.quadraticCurveTo(a+lado*26,418,a+lado*8,539);ctx.lineTo(a+lado*19,539);
        ctx.quadraticCurveTo(a+lado*39,418,a+lado*12,295);ctx.closePath();ctx.fill();
      });
      // Luzes de ribalta embutidas na borda do palco.
      for(var lamp=468;lamp<=1132;lamp+=48){
        ctx.fillStyle='#9e718a';rr(lamp,553,12,6,2);ctx.fill();
        ctx.fillStyle='#fff0ba';ctx.fillRect(lamp+2,554,8,2);
      }
      // Rebordo do tablado central, ancorado na base 566 da rua.
      var palco=ctx.createLinearGradient(0,545,0,565);palco.addColorStop(0,'rgba(255,219,188,.20)');palco.addColorStop(1,'rgba(103,43,96,.27)');
      ctx.fillStyle=palco;rr(420,545,760,20,5);ctx.fill();ctx.fillStyle='rgba(255,235,190,.5)';ctx.fillRect(432,546,736,2);
    }else if(bairro==='fofo'){
      [1208,1300,1392].forEach(function(px){
        ctx.fillStyle='rgba(113,73,48,.23)';ctx.beginPath();ctx.ellipse(px,516,35,9,0,0,7);ctx.fill();
        ctx.strokeStyle='#e1b489';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(px,510,37,16,0,.1,Math.PI-.1);ctx.stroke();
      });
      [1208,1300,1392].forEach(function(x,i){
        ctx.save();ctx.translate(x,491);
        ctx.fillStyle='rgba(48,72,64,.16)';ctx.beginPath();ctx.ellipse(1,1,14,3.2,0,0,7);ctx.fill();
        ctx.rotate(Math.sin(tm*1.8+i)*.055);
        ctx.fillStyle='#3e805d';ctx.fillRect(-2,-19,4,20);
        ctx.fillStyle='#6cae79';ctx.beginPath();ctx.moveTo(0,-3);ctx.quadraticCurveTo(-12,-3,-11,-15);ctx.quadraticCurveTo(-2,-13,0,-3);ctx.fill();
        ctx.beginPath();ctx.moveTo(1,-7);ctx.quadraticCurveTo(12,-9,11,-19);ctx.quadraticCurveTo(3,-17,1,-7);ctx.fill();
        ctx.fillStyle=['#f176a8','#c48cf1','#f2bc53'][i];
        ctx.beginPath();ctx.moveTo(-13,-35);ctx.quadraticCurveTo(-4,-35,0,-27);
        ctx.quadraticCurveTo(4,-35,13,-35);ctx.quadraticCurveTo(12,-15,0,-16);
        ctx.quadraticCurveTo(-12,-15,-13,-35);ctx.fill();
        ctx.strokeStyle='rgba(255,255,255,.32)';ctx.lineWidth=1.6;ctx.lineCap='round';ctx.beginPath();
        ctx.moveTo(-8,-31);ctx.quadraticCurveTo(-8,-22,-2,-20);ctx.stroke();
        ctx.restore();
      });
    }else if(bairro==='harajuku'){
      var vitrine=ctx.createLinearGradient(0,362,0,448);
      vitrine.addColorStop(0,'#86526f');vitrine.addColorStop(1,'#f5bc86');
      ctx.fillStyle=vitrine;rr(287,362,147,85,9);ctx.fill();
      ctx.fillStyle='#ffdca2';ctx.fillRect(292,371,137,6);
      ctx.fillStyle='#91566f';ctx.fillRect(291,426,139,6);
      [309,352,395].forEach(function(x,i){
        ctx.fillStyle=['#ffd3e1','#f4faf4','#dfcaff'][i];
        rr(x,401,21,24,5);ctx.fill();
        ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=3;ctx.strokeRect(x+18,406,9,10);
        ctx.fillStyle='#fff3d6';ctx.fillRect(x-3,424,27,3);
      });
      // Montantes da vitrine e peitoril.
      ctx.fillStyle='#c38b80';[334,379].forEach(function(px){ctx.fillRect(px,377,3,48);});
      ctx.fillStyle='#ffe5c2';rr(289,431,143,5,2);ctx.fill();
      // Vidro com dois planos de reflexo e caixilho; o interior permanece legível.
      ctx.strokeStyle='rgba(255,227,201,.72)';ctx.lineWidth=2;rr(291,367,139,76,6);ctx.stroke();
      ctx.globalAlpha=.20+.04*Math.sin(tm*1.4);
      ctx.fillStyle='#fffaf0';ctx.beginPath();ctx.moveTo(296,376);ctx.lineTo(319,376);ctx.lineTo(293,422);ctx.closePath();ctx.fill();
      ctx.globalAlpha=.12;ctx.beginPath();ctx.moveTo(374,376);ctx.lineTo(383,376);ctx.lineTo(354,425);ctx.lineTo(346,425);ctx.closePath();ctx.fill();
    }else if(bairro==='arena'){
      ctx.fillStyle='#662f9c';ctx.beginPath();ctx.moveTo(681,410);ctx.quadraticCurveTo(800,338,919,410);
      ctx.lineTo(949,536);ctx.quadraticCurveTo(800,509,651,536);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#fff1b9';ctx.lineWidth=5;ctx.stroke();
      // A cobertura tem uma face inferior e duas longarinas, que explicam o balanço da marquise.
      ctx.fillStyle='#4c286f';ctx.beginPath();ctx.moveTo(681,410);ctx.quadraticCurveTo(800,360,919,410);
      ctx.lineTo(924,426);ctx.quadraticCurveTo(800,383,676,426);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#eac6f3';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(679,413);ctx.quadraticCurveTo(800,364,921,413);ctx.stroke();
      // Vidraças inclinadas acompanham a cobertura da arena.
      ctx.fillStyle='#41326f';ctx.beginPath();ctx.moveTo(704,423);ctx.quadraticCurveTo(800,374,896,423);
      ctx.lineTo(904,461);ctx.quadraticCurveTo(800,432,696,461);ctx.closePath();ctx.fill();
      ctx.strokeStyle='#acbadf';ctx.lineWidth=3;
      [720,760,800,840,880].forEach(function(px){
        var dist=Math.abs(px-800);ctx.beginPath();ctx.moveTo(px,401+dist*.21);
        ctx.lineTo(px+(px-800)*.08,446+dist*.12);ctx.stroke();
      });
      for(var i=0;i<3;i++){
        var degrau=122+i*37,dy=489+i*17;
        var piso=ctx.createLinearGradient(0,dy,0,dy+11);piso.addColorStop(0,'#b989e3');piso.addColorStop(.45,'#a067d5');piso.addColorStop(1,'#7846b1');
        ctx.fillStyle=piso;rr(800-degrau/2,dy,degrau,11,3);ctx.fill();
      }
      var coluna=ctx.createLinearGradient(0,420,0,534);coluna.addColorStop(0,'#d5b8f5');coluna.addColorStop(1,'#8756c2');
      [674,908].forEach(function(px){ctx.fillStyle=coluna;rr(px,420,16,105,6);ctx.fill();ctx.fillStyle='#f5dfae';rr(px-3,418,22,7,3);ctx.fill();rr(px-3,521,22,6,3);ctx.fill();});
      [705,752,800,848,895].forEach(function(x,j){
        ctx.globalAlpha=.65+.25*Math.sin(tm*2+j*.66);
        ctx.fillStyle='#ffefa4';ctx.beginPath();ctx.arc(x,385+Math.abs(x-800)*.23,7,0,7);ctx.fill();
      });
    }
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
        var r=105+(reduzMov?0:Math.sin(tm*.65+i)*3);
        var luz=ctx.createRadialGradient(0,0,3,0,0,r);
        luz.addColorStop(0,cor);luz.addColorStop(.42,cor+'99');luz.addColorStop(1,cor+'00');
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
  // Mapa geral vivo (ideia do BarbieGirls): Idols da vitrine (e quem está online) andando pelas calçadas, de longe.
  // Vão e voltam pelos caminhos de pedrinha; "reduzir movimento" deixa cada um parado no seu ponto.
  var CALCADAS=[[[300,712],[520,690],[660,652],[750,660]],[[850,660],[960,662],[1100,690],[1300,712]],[[800,600],[800,560],[800,476]],[[850,700],[920,760],[1000,812]],[[660,652],[560,640],[470,560]]];
  function calcadaPos(r,u){var c=CALCADAS[r],tot=0,seg=[];for(var i=1;i<c.length;i++){var d=Math.hypot(c[i][0]-c[i-1][0],c[i][1]-c[i-1][1]);seg.push(d);tot+=d;}
    var alvo=u*tot;for(var j=0;j<seg.length;j++){if(alvo<=seg[j]||j===seg.length-1){var k=seg[j]?Math.min(1,alvo/seg[j]):0;return {x:c[j][0]+(c[j+1][0]-c[j][0])*k,y:c[j][1]+(c[j+1][1]-c[j][1])*k,dx:c[j+1][0]-c[j][0]};}alvo-=seg[j];}
    return {x:c[0][0],y:c[0][1],dx:1};}
  function mundoGente(tm){
    if(typeof perfChar!=='function'||typeof drawChar!=='function'||typeof perfCharContorno!=='function')return;
    var L=[],vistos={};
    try{(window.TW_PRESENCA&&window.TW_PRESENCA.rua==='mundo'?window.TW_PRESENCA.lista||[]:[]).concat(typeof hubIdolsDados!=='undefined'&&hubIdolsDados&&Array.isArray(hubIdolsDados.idols)?hubIdolsDados.idols:[])
      .forEach(function(p){var n=p&&String(p.nick||'').toLowerCase(),av=p&&(p.av||p.avatar);if(!n||vistos[n]||visitaContaTrio(n)>=0||!av||typeof av!=='object')return;vistos[n]=1;L.push(av);});}catch(e){}
    L=L.slice(0,6);if(!L.length)return;
    var sc=.62,oS=state,oPw=pw,oDpw=dpw,oR=rankI,oSa=sash,oA=accSel,oF=frame,oP=charPose,gente=[];
    L.forEach(function(av,i){var r=i%CALCADAS.length,per=26+i*5,f=reduzMov?.35+i*.1:((tm+i*9.7)/per)%2,u=f<1?f:2-f,ps=calcadaPos(r,Math.max(0,Math.min(1,u)));
      gente.push({av:av,x:ps.x,y:ps.y,dir:(f<1?1:-1)*(ps.dx>=0?1:-1),i:i});});
    gente.sort(function(a,b){return a.y-b.y;});
    try{state='play';pw=null;dpw=null;rankI=0;sash=false;accSel='';
      gente.forEach(function(g){var c=perfChar(g.av),bob=reduzMov?0:-Math.abs(Math.sin(tm*7+g.i))*1.6;frame=reduzMov?0:tm*60+g.i*13;accSel=acessorioPasseante(g.av);
        ctx.fillStyle='rgba(30,10,60,.2)';ctx.beginPath();ctx.ellipse(g.x,g.y,7,1.6,0,0,7);ctx.fill();
        ctx.save();if(g.dir<0){ctx.translate(g.x,0);ctx.scale(-1,1);ctx.translate(-g.x,0);}
        perfCharContorno(ctx,g.x-15*sc,g.y-44*sc+bob,sc,function(){charPose='';drawChar(c,0,0,reduzMov?0:1,g.av.expr!=null&&Number.isInteger(+g.av.expr)&&+g.av.expr>=0&&+g.av.expr<=6?+g.av.expr:2,false);});ctx.restore();});
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn('mapa gente',e);}finally{state=oS;pw=oPw;dpw=oDpw;rankI=oR;sash=oSa;accSel=oA;frame=oF;charPose=oP;}
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
  function tudo(){montar();textos();atualizarVitrine();recadoRosa();desenhar();setTimeout(centralizar,60);}
  ['hubMontar','hubCardsUI'].forEach(function(n){var o=window[n];if(typeof o==='function')window[n]=function(){var r=o.apply(this,arguments);try{tudo();}catch(e){}return r;};});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tudo);else tudo();
})();

