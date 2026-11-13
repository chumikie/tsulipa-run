/* Layout do hub (13/11/2026): barra fixa com você, destaque do dia, menos texto nos cards e barra de navegação no celular.
   Só acrescenta elementos em volta do hub; não muda a lógica dos jogos. */
(function(){
  var T={pt:{vis:'Visitante',ini:'Início',jog:'Jogos',eu:'Eu',loja:'Loja',mis:'Missões',hoje:'Pra hoje',entrar:'Entrar'},
         en:{vis:'Visitor',ini:'Home',jog:'Games',eu:'Me',loja:'Shop',mis:'Missions',hoje:'For today',entrar:'Sign in'},
         es:{vis:'Visitante',ini:'Inicio',jog:'Juegos',eu:'Yo',loja:'Tienda',mis:'Misiones',hoje:'Para hoy',entrar:'Entrar'},
         id:{vis:'Pengunjung',ini:'Beranda',jog:'Game',eu:'Aku',loja:'Toko',mis:'Misi',hoje:'Untuk hari ini',entrar:'Masuk'},
         th:{vis:'ผู้เยี่ยมชม',ini:'หน้าแรก',jog:'เกม',eu:'ฉัน',loja:'ร้าน',mis:'ภารกิจ',hoje:'สำหรับวันนี้',entrar:'เข้าสู่ระบบ'},
         ja:{vis:'ゲスト',ini:'ホーム',jog:'ゲーム',eu:'わたし',loja:'ショップ',mis:'ミッション',hoje:'きょうのおすすめ',entrar:'ログイン'}};
  function t(k){var L=(typeof LANG==='string'&&T[LANG])?LANG:'pt';return T[L][k];}
  function esc(s){return typeof escHtml==='function'?escHtml(String(s)):String(s).replace(/[&<>"']/g,function(c){return '&#'+c.charCodeAt(0)+';';});}
  function hub(){return document.getElementById('hub');}
  function card(k){var c=document.getElementById('hubCards');return c&&c.querySelector('[data-ir="'+k+'"]');}
  function rankNome(){try{return (typeof RANKS!=='undefined'&&typeof rankOf==='function')?RANKS[rankOf(+best||0)][1]:'';}catch(e){return '';}}

  /* 1) barra fixa com você */
  function hudUI(){
    var h=hub(); if(!h) return; var inn=h.querySelector('.hubin')||h;
    var el=document.getElementById('twHud');
    if(!el){el=document.createElement('div');el.id='twHud';el.className='tw-hud';inn.insertBefore(el,inn.firstChild);
      el.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;
        if(b.dataset.hud==='perfil'){var c=card('perfil');if(c)c.click();}
        else if(b.dataset.hud==='entrar'&&typeof contaEntrar==='function')contaEntrar();});}
    var logado=typeof contaJ!=='undefined'&&contaJ, nick=logado?(contaJ.nick||contaJ.nome||''):'';
    var chave=[nick,stars,best,LANG,!!logado].join('|'); if(el.dataset.k===chave) return; el.dataset.k=chave;
    el.innerHTML='<button type="button" class="tw-hud-eu" data-hud="perfil"><canvas width="64" height="64" aria-hidden="true"></canvas>'+
      '<span class="tw-hud-txt"><b>'+esc(nick||t('vis'))+'</b><small>'+esc(rankNome())+'</small></span></button>'+
      '<span class="tw-hud-stats"><span class="tw-hud-st" title="★">★ '+esc((+stars||0).toLocaleString())+'</span>'+
      '<span class="tw-hud-st tw-hud-rec" title="🏆">🏆 '+esc((+best||0).toLocaleString())+'</span></span>'+
      (logado?'':'<button type="button" class="tw-hud-entrar" data-hud="entrar">'+esc(t('entrar'))+'</button>');
    try{if(typeof perfFotoRedonda==='function'&&typeof hubAv==='function')perfFotoRedonda(el.querySelector('canvas'),hubAv(),true);}catch(e){}
  }

  /* 2) destaque do dia: o primeiro jogo que pede atenção (!) ou o Encontro do dia */
  function destaqueUI(){
    var cards=document.getElementById('hubCards'); if(!cards) return;
    var alvo=cards.querySelector('.hubcard.tw-alert-pink'), hojeBtn=null;
    if(!alvo){hojeBtn=document.querySelector('#hubHoje .hubenc');}
    var fonte=alvo||hojeBtn; var el=document.getElementById('twDestaque');
    if(!fonte){if(el)el.remove();return;}
    var ir=alvo?alvo.dataset.ir:'enc';
    var emo=(fonte.querySelector('i')||{}).textContent||'⭐';
    var tit=(fonte.querySelector('b')||fonte).textContent.trim();
    var smalls=[].slice.call(fonte.querySelectorAll('small')).filter(function(s){return !s.classList.contains('tw-hubgame-jp')&&!s.hasAttribute('lang');});
    var desc=smalls.length?smalls[smalls.length-1].textContent.trim():'';
    if(!el){el=document.createElement('button');el.type='button';el.id='twDestaque';el.className='tw-destaque';
      var hoje=document.getElementById('hubHoje');hoje.parentNode.insertBefore(el,hoje);
      el.addEventListener('click',function(){var k=el.dataset.ir;var c=k==='enc'?document.querySelector('#hubHoje .hubenc'):card(k);if(c)c.click();});}
    el.dataset.ir=ir; el.className='tw-destaque tw-destaque-'+ir;
    el.innerHTML='<span class="tw-destaque-tag">✨ '+esc(t('hoje'))+'</span><span class="tw-destaque-emo" aria-hidden="true">'+esc(emo)+'</span>'+
      '<span class="tw-destaque-txt"><b>'+esc(tit)+'</b>'+(desc?'<small>'+esc(desc)+'</small>':'')+'</span><span class="tw-destaque-ir" aria-hidden="true">▶</span>';
  }

  /* 5) barra de navegação no celular */
  function navUI(){
    if(document.getElementById('twNav')) return;
    var nav=document.createElement('nav');nav.id='twNav';nav.className='tw-nav';nav.setAttribute('aria-label','TsuLiPa⭐World');
    document.body.appendChild(nav);
    nav.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var h=hub();var k=b.dataset.nav;
      var rolar=function(el){if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'start'});};
      if(k==='ini'){var sc=[h,document.scrollingElement].find(function(x){return x&&x.scrollHeight>x.clientHeight+20;});if(sc)sc.scrollTo({top:0,behavior:'smooth'});}
      else if(k==='jog')rolar(h.querySelector('.hubbt-jogos'));
      else if(k==='mis')rolar(document.getElementById('hubMisPainel'));
      else{var c=card(k==='eu'?'perfil':'loja');if(c)c.click();}});
    navTxt();
  }
  function navTxt(){var nav=document.getElementById('twNav');if(!nav)return;
    nav.innerHTML=[['ini','🏠'],['jog','🎮'],['eu','💖'],['loja','🛍️'],['mis','🎯']].map(function(n){return '<button type="button" data-nav="'+n[0]+'"><span aria-hidden="true">'+n[1]+'</span><small>'+esc(t(n[0]))+'</small></button>';}).join('');}

  function tudo(){try{hudUI();}catch(e){} try{destaqueUI();}catch(e){} try{navUI();navTxt();}catch(e){}}
  // atualiza depois de cada montagem do hub (idioma, login, estrelas, alertas)
  ['hubMontar','hubCardsUI'].forEach(function(nome){var f=window[nome];if(typeof f!=='function')return;
    window[nome]=function(){var r=f.apply(this,arguments);try{tudo();}catch(e){}return r;};});
  var agendado=0; setInterval(function(){var h=hub();if(h&&!h.hidden&&!agendado){agendado=1;requestAnimationFrame(function(){agendado=0;try{hudUI();}catch(e){}});}},4000);
  if(document.readyState!=='loading')tudo(); else document.addEventListener('DOMContentLoaded',tudo);
})();
