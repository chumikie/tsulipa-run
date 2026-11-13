/* TsuLiPa⭐World — mapa da cidade (Canvas 2D sobre a arte mapa-cidade.svg).
   TW_LUGARES = registro único dos lugares: cada um aponta para o card do hub que já existe,
   então login, cadeado, alertas e abertura continuam com a lógica original (nada duplicado). */
(function(){
  'use strict';
  var W=1600,H=1000,OX=150,OY=70,MW=1390,MH=900; // recorte: só a ilha, sem céu vazio
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
  var TXT=[[312, 460, "Moon★Duo!", 18.0, "#fff", "#3b2d9c", "m"], [532, 512, "Handshake★Event!", 18.0, "#fff", "#ff5a85", "m"], [330, 561, "CAFE", 14.0, "#fff", null, "m"], [342, 712, "Happy★Cafe!", 18.0, "#fff", "#f08a52", "m"], [512, 842, "Backstage★Pet!", 18.0, "#fff", "#1e8f9a", "m"], [812, 872, "Meu Perfil", 18.0, "#fff", "#ff5aa5", "m"], [1122, 842, "Star★Gacha!", 18.0, "#fff", "#f39a34", "m"], [1300, 572, "ZIPPER★SHOP!", 15.0, "#fff", null, "m"], [1312, 742, "Zipper★Shop!", 18.0, "#fff", "#7b3ff0", "m"], [1150, 294, "KARAOKE", 15.0, "#ff9bd0", null, "m"], [1054, 340, "♪", 20.0, "#ff62ab", null, "s"], [1062, 318, "♪", 20.0, "#ff62ab", null, "s"], [1070, 296, "♪", 20.0, "#ff62ab", null, "s"], [1162, 512, "Karaoke★Time!", 18.0, "#fff", "#b83a9e", "m"], [1002, 628, "Idol★News!", 18.0, "#fff", "#6a4ff0", "m"], [652, 676, "Pedido de fã", 18.0, "#fff", "#9b4bf0", "m"], [812, 458, "Center★Run!", 18.0, "#fff", "#6630dc", "m"], [1412, 124, "Sora★Jump!", 18.0, "#fff", "#4a78ef", "m"], [812, 518, "Encontro do dia", 18.0, "#fff", "#ff5aa5", "m"]];
  var NOMES={'Meu Perfil':{en:'My Profile',es:'Mi perfil',id:'Profilku',th:'โปรไฟล์ของฉัน',ja:'マイプロフィール'},
    'Pedido de fã':{en:'Fan request',es:'Pedido de fan',id:'Permintaan fan',th:'คำขอแฟน',ja:'ファンのお願い'},
    'Encontro do dia':{en:'Daily meetup',es:'Encuentro del día',id:'Temu hari ini',th:'นัดพบวันนี้',ja:'今日のミーティング'}};
  var TIT={pt:'Mapa da cidade',en:'City map',es:'Mapa de la ciudad',id:'Peta kota',th:'แผนที่เมือง',ja:'まちのマップ'};
  var centrado=false,arte=null,cv=null,ctx=null,hover=null,anim=0,visivel=false;
  function lang(){return (typeof LANG==='string'&&LANG)||'pt';}
  function nome(t){var n=NOMES[t];return n&&n[lang()]?n[lang()]:t;}
  function card(l){return document.querySelector(l.card);}
  function estado(l){var c=card(l);if(!c)return null;
    return {alerta:c.classList.contains('tw-alert-pink'),off:c.disabled||c.getAttribute('aria-disabled')==='true'||c.hidden||c.classList.contains('tw-karaoke-locked')||!!c.querySelector('.tw-profile-lock')};}

  function montar(){
    var menu=document.getElementById('hubMenu');if(!menu||document.getElementById('twMapa'))return;
    var sec=document.createElement('section');sec.id='twMapa';sec.className='tw-mapa';
    sec.innerHTML='<h2 class="hubblocot hubbt-mapa"></h2><div class="tw-mapa-rolo"><canvas width="'+MW+'" height="'+MH+'" role="img"></canvas></div>';
    var ref=document.getElementById('hubHoje');menu.insertBefore(sec,ref||menu.firstChild);
    cv=sec.querySelector('canvas');ctx=cv.getContext('2d');
    arte=new Image();arte.onload=function(){desenhar();centralizar();};arte.src='./mapa-cidade.svg?v=2';
    cv.addEventListener('mousemove',function(e){var l=achar(e);if(l!==hover){hover=l;cv.style.cursor=l?'pointer':'';desenhar();}});
    cv.addEventListener('mouseleave',function(){hover=null;desenhar();});
    cv.addEventListener('click',function(e){var l=achar(e);if(!l)return;var c=card(l);if(c&&!c.disabled)c.click();});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){visivel=es[0].isIntersecting;if(visivel){centralizar();laco();}}).observe(cv);
    else visivel=true;
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(desenhar);
    textos();
  }
  function textos(){var h=document.querySelector('#twMapa h2');if(h)h.textContent='🗺️ '+(TIT[lang()]||TIT.pt);
    if(cv)cv.setAttribute('aria-label',TIT[lang()]||TIT.pt);}
  function centralizar(){var r=document.querySelector('#twMapa .tw-mapa-rolo');if(centrado||!r||r.scrollWidth<=r.clientWidth)return;r.scrollLeft=(r.scrollWidth-r.clientWidth)/2;centrado=true;}
  function achar(e){var r=cv.getBoundingClientRect(),x=(e.clientX-r.left)*MW/r.width+OX,y=(e.clientY-r.top)*MH/r.height+OY,m=null,ma=1e9;
    TW_LUGARES.forEach(function(l){var b=l.box;if(x>=b[0]&&x<=b[2]&&y>=b[1]&&y<=b[3]&&card(l)){var a=(b[2]-b[0])*(b[3]-b[1]);if(a<ma){ma=a;m=l;}}});return m;}

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
    if(!ctx||!arte||!arte.complete)return;var tm=performance.now()/1000;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,MW,MH);ctx.setTransform(1,0,0,1,-OX,-OY);ctx.drawImage(arte,0,0,W,H);
    if(hover){var b=hover.box;ctx.save();ctx.fillStyle='rgba(255,255,255,.22)';ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=4;ctx.setLineDash([10,8]);
      rr(b[0],b[1],b[2]-b[0],b[3]-b[1],26);ctx.fill();ctx.stroke();ctx.restore();}
    idols(tm);
    TXT.forEach(texto);
    TW_LUGARES.forEach(function(l){if(l.card.indexOf('#hubCards')!==0)return;var e=estado(l);if(!e)return;var b=l.box,x=b[2]-18,y=b[1]+16+Math.sin(tm*3+b[0])*4;
      if(e.alerta){ctx.save();ctx.fillStyle='#ff4f9a';ctx.strokeStyle='#fff';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,17,0,7);ctx.fill();ctx.stroke();
        ctx.fillStyle='#fff';ctx.font='22px "Mochiy Pop One",sans-serif';ctx.textAlign='center';ctx.fillText('!',x,y+8);ctx.restore();}
      if(e.off&&!e.alerta){ctx.save();ctx.fillStyle='#fff';ctx.strokeStyle='#8d6ad8';ctx.lineWidth=3;ctx.beginPath();ctx.arc(x,y,17,0,7);ctx.fill();ctx.stroke();ctx.lineWidth=3.5;ctx.beginPath();ctx.arc(x,y-3,6,Math.PI,0);ctx.stroke();ctx.fillStyle='#8d6ad8';rr(x-9,y-3,18,13,4);ctx.fill();ctx.restore();}
    });
  }

  // o TsuLiPa (trio) com os pets na praça, desenhado com as mesmas funções do palco (drawChar + contorno de adesivo)
  var IDOL_X=[724,800,876],IDOL_CHAO=680,IDOL_SC=1.65;
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
  function laco(){if(anim)return;(function f(){anim=0;if(!visivel||document.hidden)return;
    var tem=TW_LUGARES.some(function(l){var e=estado(l);return e&&e.alerta;});desenhar();
    if(!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))anim=setTimeout(function(){requestAnimationFrame(f);},50);})();}
  document.addEventListener('visibilitychange',function(){if(!document.hidden)laco();});
  function tudo(){montar();textos();desenhar();setTimeout(centralizar,60);}
  ['hubMontar','hubCardsUI'].forEach(function(n){var o=window[n];if(typeof o==='function')window[n]=function(){var r=o.apply(this,arguments);try{tudo();}catch(e){}return r;};});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',tudo);else tudo();
})();
