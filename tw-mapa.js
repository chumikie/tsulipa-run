/* TsuLiPa⭐World — mapa da cidade (Canvas 2D sobre a arte mapa-cidade.svg).
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
  var cena='mundo',imagens={};
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
  var TXT=[[312, 460, "Moon★Duo!", 18.0, "#fff", "#3b2d9c", "m"], [528, 341, "握手会", 10.0, "#ff5a85", null, "m"], [520, 452, "Idol", 10.0, "#9b4bf0", null, "m"], [532, 512, "Handshake★Event!", 18.0, "#fff", "#ff5a85", "m"], [359, 587, "Happy★Cafe!", 9.0, "#fff", null, "m"], [342, 712, "Happy★Cafe!", 18.0, "#fff", "#f08a52", "m"], [512, 842, "Backstage★Pet!", 18.0, "#fff", "#1e8f9a", "m"], [812, 872, "Meu Perfil", 18.0, "#fff", "#ff5aa5", "m"], [1110, 668, "STAR★GACHA!", 10.0, "#d94d92", null, "m"], [1122, 842, "Star★Gacha!", 18.0, "#fff", "#f39a34", "m"], [1300, 568, "ZIPPER★SHOP!", 14.0, "#fff", null, "m"], [1312, 742, "Zipper★Shop!", 18.0, "#fff", "#7b3ff0", "m"], [1150, 285, "KARAOKE", 14.0, "#ffd6ec", null, "m"], [1052, 340, "♪", 20.0, "#ff62ab", null, "s"], [1060, 318, "♪", 20.0, "#ff62ab", null, "s"], [1068, 296, "♪", 20.0, "#ff62ab", null, "s"], [1162, 512, "Karaoke★Time!", 18.0, "#fff", "#b83a9e", "m"], [1002, 628, "Idol★News!", 18.0, "#fff", "#6a4ff0", "m"], [652, 676, "Pedido de fã", 18.0, "#fff", "#9b4bf0", "m"], [812, 458, "Center★Run!", 18.0, "#fff", "#6630dc", "m"], [1412, 124, "Sora★Jump!", 18.0, "#fff", "#4a78ef", "m"], [812, 518, "Encontro do dia", 18.0, "#fff", "#ff5aa5", "m"]];
  var NOMES={'Meu Perfil':{en:'My Profile',es:'Mi perfil',id:'Profilku',th:'โปรไฟล์ของฉัน',ja:'マイプロフィール'},
    'Pedido de fã':{en:'Fan request',es:'Pedido de fan',id:'Permintaan fan',th:'คำขอแฟน',ja:'ファンのお願い'},
    'Encontro do dia':{en:'Daily meetup',es:'Encuentro del día',id:'Temu hari ini',th:'นัดพบวันนี้',ja:'今日のミーティング'}};
  var DICA={pt:'👆 Arraste para passear',en:'👆 Drag to explore',es:'👆 Arrastra para pasear',id:'👆 Geser untuk jalan-jalan',th:'👆 ลากเพื่อเดินเล่น',ja:'👆 ドラッグでおさんぽ'};
  var PASSEIA={pt:'Passear pela cidade',en:'Stroll around town',es:'Pasear por la ciudad',id:'Jalan-jalan keliling kota',th:'เดินเล่นในเมือง',ja:'まちをおさんぽ'};
  var FECHA={pt:'Fechar o mapa',en:'Close the map',es:'Cerrar el mapa',id:'Tutup peta',th:'ปิดแผนที่',ja:'マップを閉じる'};
  var TIT={pt:'Mapa da cidade',en:'City map',es:'Mapa de la ciudad',id:'Peta kota',th:'แผนที่เมือง',ja:'まちのマップ'};
  var centrado=false,arte=null,cv=null,ctx=null,hover=null,anim=0,visivel=false;
  function lang(){return (typeof LANG==='string'&&LANG)||'pt';}
  function nome(t){var n=NOMES[t];return n&&n[lang()]?n[lang()]:t;}
  function card(l){return document.querySelector(l.card);}
  function estado(l){var c=card(l);if(!c)return null;
    return {alerta:c.classList.contains('tw-alert-pink'),off:c.disabled||c.getAttribute('aria-disabled')==='true'||c.hidden||c.classList.contains('tw-karaoke-locked')||!!c.querySelector('.tw-profile-lock')};}

  function montar(){
    var menu=document.getElementById('hubMenu');if(!menu)return;if(document.getElementById('twMapa')){posicionar();return;}
    var sec=document.createElement('section');sec.id='twMapa';sec.className='tw-mapa';
    sec.innerHTML='<button type="button" class="tw-mapa-botao" aria-expanded="false"><span class="tw-mapa-ico">🗺️</span><span class="tw-mapa-txt"><b></b><small></small></span><span class="tw-mapa-seta">▼</span></button><button type="button" class="tw-mapa-voltar" hidden>◀ Mapa</button><div class="tw-mapa-rolo" hidden><canvas width="'+MW+'" height="'+MH+'" role="img"></canvas></div><span class="tw-mapa-dica" aria-hidden="true"></span>';
    menu.appendChild(sec);posicionar();
    cv=sec.querySelector('canvas');ctx=cv.getContext('2d');
    mostrarCena('mundo');
    cv.addEventListener('mousemove',function(e){var l=achar(e);if(l!==hover){hover=l;cv.style.cursor=l?'pointer':'';desenhar();}});
    var rolo=sec.querySelector('.tw-mapa-rolo');['pointerdown','touchstart','wheel'].forEach(function(ev){rolo.addEventListener(ev,function(){sec.classList.add('mexeu');},{passive:true,once:true});});
    cv.addEventListener('mouseleave',function(){hover=null;desenhar();});
    cv.addEventListener('click',function(e){
      var l=achar(e);if(!l)return;
      if(cena==='mundo'){mostrarCena(l.id);return;}
      if(l.voltar){mostrarCena('mundo');return;}
      var c=card(l);if(c&&!c.disabled)c.click();
    });
    sec.querySelector('.tw-mapa-voltar').addEventListener('click',function(){mostrarCena('mundo');});
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
  function abrir(sim,inicio){aberto=!!sim;var sec=document.getElementById('twMapa');if(!sec)return;
    sec.classList.toggle('aberto',aberto);sec.querySelector('.tw-mapa-rolo').hidden=!aberto;sec.querySelector('.tw-mapa-botao').setAttribute('aria-expanded',aberto?'true':'false');
    if(!inicio){try{localStorage.setItem('tw_mapa_aberto',aberto?'1':'0');}catch(e){}}
    textos();if(aberto){centrado=false;setTimeout(function(){centralizar();desenhar();laco();},30);}}
  function textos(){var b=document.querySelector('#twMapa .tw-mapa-txt b'),m=document.querySelector('#twMapa .tw-mapa-txt small');
    if(b)b.textContent=TIT[lang()]||TIT.pt;var dc=document.querySelector('#twMapa .tw-mapa-dica');if(dc)dc.textContent=DICA[lang()]||DICA.pt;if(m)m.textContent=(aberto?FECHA:PASSEIA)[lang()]||(aberto?FECHA:PASSEIA).pt;
    if(cv)cv.setAttribute('aria-label',cena==='mundo'?(TIT[lang()]||TIT.pt):('Rua: '+cena));}
  function centralizar(){var r=document.querySelector('#twMapa .tw-mapa-rolo');
    if(centrado||!r||!cv)return;
    var k=cv.getBoundingClientRect().width/MW;
    var px=cena==='mundo'?800:800,py=cena==='mundo'?610:450;
    r.scrollLeft=Math.max(0,(px-OX)*k-r.clientWidth/2);
    r.scrollTop=Math.max(0,(py-OY)*k-r.clientHeight/2);centrado=true;
  }
  function mostrarCena(destino){
    if(destino!=='mundo'&&!CENAS_RUA[destino])return;
    cena=destino;hover=null;centrado=false;
    W=1600;H=destino==='mundo'?1000:760;OX=0;OY=0;MW=W;MH=H;
    if(cv){cv.width=MW;cv.height=MH;cv.style.cursor='';}
    var sec=document.getElementById('twMapa');
    if(sec){var voltar=sec.querySelector('.tw-mapa-voltar');
      if(voltar)voltar.hidden=destino==='mundo';
      sec.setAttribute('data-cena',destino);
      var rolo=sec.querySelector('.tw-mapa-rolo');
      if(rolo){rolo.scrollLeft=0;rolo.scrollTop=0;}
    }
    var arquivo=destino==='mundo'?'mapa-mundo.svg':CENAS_RUA[destino];
    if(!imagens[destino]){
      var img=new Image();imagens[destino]=img;
      img.onload=function(){if(cena===destino){arte=img;desenhar();centralizar();}};
      img.onerror=function(){if(window.TW_MAPA_DEBUG)console.warn('Arte do mapa indisponível:',arquivo);};
      img.src='./'+arquivo+'?v=1';
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
    // O botão desenhado no SVG também funciona; o botão HTML é acessível por teclado.
    if(x>=1380&&x<=1580&&y>=15&&y<=90)return {id:'voltar',voltar:true,box:[1380,15,1580,90]};
    var ids=BAIRROS[cena].lugares,centros=[300,800,1300],achado=null;
    ids.forEach(function(id,i){if(!id)return;var l=TW_LUGARES.find(function(v){return v.id===id;});
      if(!l)return;var b=[centros[i]-200,280,centros[i]+200,640];
      if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]&&card(l))achado={id:l.id,card:l.card,box:b};
    });return achado;
  }

  function texto(t){
    var s=nome(t[2]);ctx.font=t[3]+'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';ctx.textBaseline='alphabetic';
    var partes=s.split('★'),ws=partes.map(function(p){return ctx.measureText(p).width;}),st=ctx.measureText('★').width,
        tot=ws.reduce(function(a,b){return a+b;},0)+(partes.length-1)*st,x=t[6]==='m'?t[0]-tot/2:t[0];
    ctx.lineJoin='round';
    partes.forEach(function(p,i){
      if(t[5]){ctx.lineWidth=4;ctx.strokeStyle=t[5];ctx.strokeText(p,x,t[1]);}
      ctx.fillStyle=t[4];ctx.fillText(p,x,t[1]);x+=ws[i];
      if(i<partes.length-1){if(t[5]){ctx.strokeStyle=t[5];ctx.strokeText('★',x,t[1]);}ctx.fillStyle='#ffe14d';ctx.fillText('★',x,t[1]);x+=st;}
    });
  }
  function desenhar(){
    if(!ctx||!arte||!arte.complete||!arte.naturalWidth)return;
    var tm=performance.now()/1000;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,MW,MH);
    ctx.setTransform(1,0,0,1,-OX,-OY);ctx.drawImage(arte,0,0,W,H);
    ceu(tm); // mesmo horário de Brasília no mundo e nas ruas
    if(cena==='mundo'){idols(tm);alertasMundo(tm);}
    else{andar(tm);alertasRua(tm);}
    if(hover&&!hover.voltar){
      var b=hover.box;ctx.save();ctx.fillStyle='rgba(255,255,255,.12)';
      ctx.strokeStyle='rgba(255,255,255,.72)';ctx.lineWidth=2;
      rr(b[0],b[1],b[2]-b[0],b[3]-b[1],18);ctx.fill();ctx.stroke();ctx.restore();
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
    });
  }
  function alertasRua(tm){
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
  function passeantes(){
    var l=[];
    try{if(typeof hubAv==='function'&&typeof perfChar==='function'){
      var av=hubAv();if(av)l.push({av:av,rua:trajetoRua(0),u0:.06,u1:.94,fase:0});
    }}catch(e){}
    try{if(typeof hubIdolsDados!=='undefined'&&hubIdolsDados&&Array.isArray(hubIdolsDados.idols))
      hubIdolsDados.idols.slice(0,3).forEach(function(p,i){if(p&&p.av)l.push({
        av:p.av,rua:trajetoRua(i+1),u0:.06,u1:.94,fase:(i+1)*.27
      });});}catch(e){}
    return l;
  }
  function andar(tm){
    if(typeof perfChar!=='function'||typeof drawChar!=='function'||typeof perfCharContorno!=='function')return;
    var sc=1.2,oS=state,oPw=pw,oDpw=dpw,oR=rankI,oSa=sash,oA=accSel,oF=frame,oP=charPose;
    try{
      state='play';pw=null;dpw=null;rankI=0;sash=false;accSel='';frame=tm*60;
      passeantes().forEach(function(p){
        var ciclo=((tm/22+p.fase)%1+1)%1,u,dir,mov;   // 22 s: ida, pausa, volta, pausa
        if(ciclo<.42){u=ciclo/.42;dir=1;mov=1;}else if(ciclo<.5){u=1;dir=1;mov=0;}else if(ciclo<.92){u=1-(ciclo-.5)/.42;dir=-1;mov=1;}else{u=0;dir=-1;mov=0;}
        u=p.u0+(p.u1-p.u0)*(u*u*(3-2*u));
        var pt=noPonto(p.rua,u),pt2=noPonto(p.rua,Math.min(1,u+.01)),vx=(pt2[0]-pt[0])*dir,c=perfChar(p.av);
        var bob=mov?-Math.abs(Math.sin(tm*9))*2.2*sc:0;
        ctx.fillStyle='rgba(30,10,60,.2)';ctx.beginPath();ctx.ellipse(pt[0],pt[1],8*sc,1.7*sc,0,0,7);ctx.fill();
        ctx.save();if(vx<0){ctx.translate(pt[0],0);ctx.scale(-1,1);ctx.translate(-pt[0],0);}
        perfCharContorno(ctx,pt[0]-15*sc,pt[1]-44*sc+bob,sc,function(){charPose=mov?'':(p.av.pose||'');drawChar(c,0,0,mov?1:0,+p.av.expr||2,false);});
        ctx.restore();
        // o pet (do seu Idol ou do Idol da vitrine) vem atrás, pulando de leve
        var pet=typeof perfPetDoAvatar==='function'?perfPetDoAvatar(p.av):null;
        if(pet&&typeof perfDesenharPetEm==='function'){
          var atras=vx<0?1:-1,pu=Math.max(0,Math.min(1,u-.035*dir)),pp=noPonto(p.rua,pu),hop=mov?-Math.abs(Math.sin(tm*9+1.3))*5:0;
          ctx.fillStyle='rgba(30,10,60,.16)';ctx.beginPath();ctx.ellipse(pp[0]+atras*14,pp[1],7,1.6,0,0,7);ctx.fill();
          perfDesenharPetEm(ctx,pet,pp[0]+atras*14,pp[1]-10+hop,sc*.5,tm*60);
        }
      });
    }catch(e){if(window.TW_MAPA_DEBUG)console.warn('mapa andar',e);}finally{state=oS;pw=oPw;dpw=oDpw;rankI=oR;sash=oSa;accSel=oA;frame=oF;charPose=oP;}
  }
  // hora do dia em Brasília: dia, entardecer e noite (janelas acesas)
  var LUZES_MUNDO=[[575,425],[800,390],[1035,425],[1238,655],[360,665],[800,640],[1330,220]];
  var LUZES_RUA=[[300,440],[800,440],[1300,440],[550,570],[1050,570]];
  function horaBR(){if(typeof window.TW_MAPA_HORA==='number')return window.TW_MAPA_HORA;
    try{return +new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',hour:'numeric',hourCycle:'h23'}).format(new Date());}catch(e){return new Date().getHours();}}
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
