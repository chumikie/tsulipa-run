/* TsuLiPa⭐World · Idols online agora + frases prontas (15/11/2026, visual de celular).
   Ideia do BarbieGirls com regra nossa: nada de chat livre. A frase é uma chave de uma lista fixa (o servidor só aceita
   essas chaves) e o texto é traduzido aqui. Só contas logadas aparecem para os outros; visitante vê o próprio balão.
   RPCs: presenca_ping(p_rua, p_frase) [logado] e presenca_agora(p_rua) [todos]. Nada aqui mexe em save. */
(function(){
  'use strict';
  var FRASES = {
    oi:{pt:'Oi! 💜',en:'Hi! 💜',es:'¡Hola! 💜',id:'Hai! 💜',th:'สวัสดี! 💜',ja:'やっほー！💜'},
    lindo:{pt:'Que lindo! ✨',en:'So cute! ✨',es:'¡Qué lindo! ✨',id:'Lucu banget! ✨',th:'น่ารักจัง! ✨',ja:'かわいい！✨'},
    jogar:{pt:'Vamos jogar? 🎮',en:"Let's play? 🎮",es:'¿Jugamos? 🎮',id:'Main yuk? 🎮',th:'เล่นกันไหม? 🎮',ja:'あそぼう？🎮'},
    dancar:{pt:'Bora dançar! 💃',en:"Let's dance! 💃",es:'¡A bailar! 💃',id:'Ayo dansa! 💃',th:'มาเต้นกัน! 💃',ja:'おどろう！💃'},
    amei:{pt:'Amei seu visual! 💖',en:'Love your look! 💖',es:'¡Me encanta tu look! 💖',id:'Suka gayamu! 💖',th:'ชอบลุคนี้มาก! 💖',ja:'そのコーデすき！💖'},
    parabens:{pt:'Parabéns! 🎉',en:'Congrats! 🎉',es:'¡Felicidades! 🎉',id:'Selamat! 🎉',th:'ยินดีด้วย! 🎉',ja:'おめでとう！🎉'},
    valeu:{pt:'Valeu! 🌷',en:'Thanks! 🌷',es:'¡Gracias! 🌷',id:'Makasih! 🌷',th:'ขอบคุณ! 🌷',ja:'ありがとう！🌷'},
    tchau:{pt:'Tchau! 👋',en:'Bye! 👋',es:'¡Chao! 👋',id:'Dadah! 👋',th:'บ๊ายบาย! 👋',ja:'またね！👋'}
  };
  var UI = {
    online:{pt:'Idols online agora',en:'Idols online now',es:'Idols en línea ahora',id:'Idol online sekarang',th:'ไอดอลออนไลน์ตอนนี้',ja:'人のアイドルがオンライン'},
    falar:{pt:'Diga algo para quem está aqui',en:'Say something to everyone here',es:'Di algo a quien está aquí',id:'Sapa yang ada di sini',th:'พูดกับทุกคนที่นี่',ja:'ここにいるみんなにひとこと'},
    so:{pt:'Entre para os outros verem seus balões.',en:'Sign in so others can see your bubbles.',es:'Entra para que otros vean tus globos.',id:'Masuk agar yang lain melihat balonmu.',th:'เข้าสู่ระบบเพื่อให้คนอื่นเห็นบอลลูนของคุณ',ja:'ログインするとみんなにも見えます。'}
  };
  function lang(){ var l = typeof LANG === 'string' ? LANG : 'pt'; return l; }
  function txt(d, k){ var o = d[k]; return o ? (o[lang()] || o.pt) : ''; }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(nome, args){ return typeof contaRpc === 'function' ? contaRpc(nome, args) : Promise.reject(new Error('sem_rpc')); }
  function ruaAgora(){ try{ return typeof window.twMapaCena === 'function' ? window.twMapaCena() || '' : ''; }catch(e){ return ''; } }
  function eu(){ try{ return logado() ? String(contaJ.nick || '').trim().toLowerCase() : ''; }catch(e){ return ''; } }

  var P = window.TW_PRESENCA = {online:-1, rua:'', lista:[], minha:null, frases:Object.keys(FRASES),
    texto:function(k){ return txt(FRASES, k); }, ui:function(k){ return txt(UI, k); }};

  function contadorUI(){
    [].forEach.call(document.querySelectorAll('[data-twc-online]'), function(el){
      if(P.online < 0){ el.hidden = true; return; }
      el.hidden = false; el.innerHTML = '<i aria-hidden="true"></i><b>' + P.online + '</b> ' + txt(UI, 'online');
    });
  }
  var buscando = false, ultimoPing = 0;
  function atualizar(){
    if(buscando || document.hidden) return;
    buscando = true;
    var r = ruaAgora();
    rpc('presenca_agora', {p_rua:r || null}).then(function(d){
      P.online = d && typeof d.online === 'number' ? d.online : P.online;
      var me = eu();
      P.rua = r; P.lista = (d && Array.isArray(d.rua) ? d.rua : []).filter(function(p){ return p && p.nick && String(p.nick).toLowerCase() !== me; });
      contadorUI();
    }).catch(function(){}).then(function(){ buscando = false; });
  }
  function ping(frase){
    if(!logado()) return Promise.resolve(null);
    ultimoPing = Date.now();
    return rpc('presenca_ping', {p_rua:ruaAgora() || 'mundo', p_frase:frase || null}).catch(function(){ return null; });
  }
  P.falar = function(k){
    if(!FRASES[k]) return;
    P.minha = {frase:k, em:Date.now()};
    ping(k).then(function(){ setTimeout(atualizar, 400); });
  };
  P.atualizar = atualizar; P.contadorUI = contadorUI;

  // ritmo: conta e lista a cada 30 s (8 s dentro de uma rua do mapa); "estou aqui" a cada 60 s ou ao trocar de rua
  var ruaPing = '';
  setInterval(function(){
    if(document.hidden) return;
    var r = ruaAgora();
    if(logado() && (Date.now() - ultimoPing > 60e3 || r !== ruaPing)){ ruaPing = r; ping(null); }
  }, 5000);
  var passo = 0;
  setInterval(function(){ passo++; if(ruaAgora() ? true : passo % 4 === 0) atualizar(); }, 8000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) atualizar(); });
  setTimeout(atualizar, 1500);
})();
