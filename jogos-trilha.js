// Trilhas e efeitos sonoros dos jogos novos (Café, Idol⭐Battle!, Bloom⭐Garden!, Photo⭐Studio!).
// Tudo é sintetizado na hora pela Web Audio API: nenhum arquivo de música é baixado.
// Usa o mesmo AudioContext (ac()) e o mesmo botão de mudo (muted) do Center⭐Run!.
// Enquanto um desses jogos está aberto, a música da cidade e a do Center⭐Run! ficam em silêncio
// (twJogoEmPopup); ao fechar, twMusicaPaginaVisibilidade() devolve a música da tela que ficou.
(function(){
  'use strict';
  var JOGOS = [['cafe', 'cfOv'], ['battle', 'battleOv'], ['jardim', 'bloomOv'], ['studio', 'studioOv']];
  var tocando = '', relogio = null, vigia = null, n = 0, prox = 0, ruidoBuf = null, saida = null;

  function ctx(){ try{ return typeof ac === 'function' ? ac() : null; }catch(e){ return null; } }
  function mudo(){ return typeof muted !== 'undefined' && muted; }
  function hz(m){ return 440 * Math.pow(2, (m - 69) / 12); }

  // Qual jogo novo está aberto (o de cima vence, na ordem da lista).
  function jogoAberto(){
    for(var i = 0; i < JOGOS.length; i++){
      var el = document.getElementById(JOGOS[i][1]);
      if(el && !el.hidden) return JOGOS[i][0];
    }
    return '';
  }

  function bus(a){
    if(saida && saida.context === a) return saida;
    saida = a.createGain(); saida.gain.value = 1; saida.connect(a.destination); return saida;
  }
  function nota(a, f, ini, dur, tipo, vol, ataque){
    var o = a.createOscillator(), g = a.createGain(); o.type = tipo || 'sine'; o.frequency.setValueAtTime(f, ini);
    g.gain.setValueAtTime(.0001, ini); g.gain.linearRampToValueAtTime(vol, ini + (ataque || .01));
    g.gain.exponentialRampToValueAtTime(.0003, ini + dur);
    o.connect(g); g.connect(bus(a)); o.start(ini); o.stop(ini + dur + .05);
  }
  function ruido(a, ini, dur, vol, corte, tipoF){
    if(!ruidoBuf || ruidoBuf.sampleRate !== a.sampleRate){
      ruidoBuf = a.createBuffer(1, Math.floor(a.sampleRate * .3), a.sampleRate);
      var d = ruidoBuf.getChannelData(0); for(var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    var s = a.createBufferSource(), g = a.createGain(), fl = a.createBiquadFilter();
    fl.type = tipoF || 'highpass'; fl.frequency.value = corte; s.buffer = ruidoBuf;
    g.gain.setValueAtTime(vol, ini); g.gain.exponentialRampToValueAtTime(.0003, ini + dur);
    s.connect(fl); fl.connect(g); g.connect(bus(a)); s.start(ini); s.stop(ini + dur + .02);
  }
  function bumbo(a, ini, vol){
    var o = a.createOscillator(), g = a.createGain(); o.type = 'sine';
    o.frequency.setValueAtTime(150, ini); o.frequency.exponentialRampToValueAtTime(45, ini + .16);
    g.gain.setValueAtTime(vol, ini); g.gain.exponentialRampToValueAtTime(.0003, ini + .22);
    o.connect(g); g.connect(bus(a)); o.start(ini); o.stop(ini + .25);
  }

  // Cada trilha: andamento, oito passos por compasso e uma função que toca um passo.
  // Acordes em notas MIDI; melodias em 32 passos (-1 = pausa).
  var TRILHAS = {
    // Café: bossa lo-fi, Cmaj7–Am7–Dm7–G7, escovinha na caixa e tilintar de xícara.
    cafe: { bpm: 92, passo: function(a, t, st, bar, p){
      var AC = [[48, 52, 55, 59], [45, 48, 52, 55], [50, 53, 57, 60], [43, 47, 50, 53]];
      var ML = [76, -1, 74, 72, -1, 69, -1, -1, 72, -1, 69, 67, -1, 64, -1, -1, 69, -1, 72, 74, -1, 77, 76, -1, 74, -1, 71, -1, 67, -1, -1, -1];
      var ch = AC[bar % 4], m = ML[(bar % 4) * 8 + st], sw = st % 2 ? p * .16 : 0;
      if(st === 0 || st === 3 || st === 6) ch.forEach(function(x, j){ nota(a, hz(x + 12), t + sw + j * .012, p * 1.6, 'triangle', .007, .02); });
      if(st === 0) nota(a, hz(ch[0] - 12), t, p * 2.6, 'sine', .04, .02);
      if(st === 3) nota(a, hz(ch[2] - 12), t + sw, p * 1.6, 'sine', .03, .02);
      if(st === 4) nota(a, hz(ch[0] - 12), t, p * 2.6, 'sine', .035, .02);
      ruido(a, t + sw, .06, st % 2 ? .004 : .007, 5000, 'bandpass');            // escovinha
      if(st === 0 || st === 5) bumbo(a, t, .03);
      if(m >= 0) nota(a, hz(m), t + sw, p * 1.8, 'sine', .016, .02);
      if(st === 7 && bar % 4 === 3) nota(a, hz(100), t + p * .4, .35, 'sine', .006, .003);   // xícara
    }},
    // Idol⭐Battle!: Am–F–G–E em 140 bpm, bumbo reto, caixa e arpejo que sobe para o refrão.
    battle: { bpm: 140, passo: function(a, t, st, bar, p){
      var AC = [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 56, 59]];
      var ML = [81, -1, 79, 81, -1, 84, -1, 83, 81, -1, 77, -1, 76, -1, 77, 79, 79, -1, 83, -1, 86, -1, 84, 83, 80, -1, 83, -1, 88, -1, 86, -1];
      var sec = Math.floor(bar / 4) % 2, ch = AC[bar % 4], m = ML[(bar % 4) * 8 + st];
      nota(a, hz(ch[st % 3] + (sec ? 24 : 12)), t, p * .8, 'square', .007);       // arpejo
      if(st % 2 === 0) nota(a, hz(ch[0] - 12), t, p * 1.6, 'sawtooth', .014, .005);   // baixo pulsante
      if(st % 2 === 0) bumbo(a, t, .07);
      if(st === 2 || st === 6) ruido(a, t, .11, .028, 1800, 'bandpass');            // caixa
      ruido(a, t, .025, st % 2 ? .008 : .005, 8000);                                 // chimbal
      if(sec && m >= 0){ nota(a, hz(m), t, p * 1.4, 'square', .012); nota(a, hz(m - 12), t, p * 1.4, 'triangle', .01); }
      if(!sec && bar % 4 === 3 && st >= 4) ruido(a, t, .05, .006 + (st - 4) * .004, 2500, 'bandpass');   // rufar
    }},
    // Bloom⭐Garden!: pentatônica calma, caixinha de música e passarinhos de vez em quando.
    jardim: { bpm: 78, passo: function(a, t, st, bar, p){
      var AC = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]];
      var ML = [84, -1, 81, -1, 79, -1, 76, -1, 79, -1, 81, -1, 84, -1, -1, -1, 81, -1, 79, -1, 76, -1, 74, -1, 76, -1, 79, -1, 74, -1, -1, -1];
      var ch = AC[bar % 4], m = ML[(bar % 4) * 8 + st];
      nota(a, hz(ch[st % 3]), t, p * 2.2, 'sine', .009, .03);                        // arpejo de harpa
      if(st === 0) nota(a, hz(ch[0] - 12), t, p * 7, 'triangle', .022, .08);
      if(m >= 0){ nota(a, hz(m), t, p * 2.4, 'sine', .015, .01); nota(a, hz(m + 12), t + p * .5, p * 1.4, 'sine', .004, .01); }
      if(Math.random() < .05){                                                        // passarinho
        var b0 = t + Math.random() * p, f0 = 2400 + Math.random() * 900;
        for(var k = 0; k < 3; k++) nota(a, f0 + k * 260, b0 + k * .06, .05, 'sine', .004, .003);
      }
    }},
    // Photo⭐Studio!: city pop em 108 bpm, Fmaj7–Em7–Am7–Dm7, baixo marcado e "clique" no contratempo.
    studio: { bpm: 108, passo: function(a, t, st, bar, p){
      var AC = [[53, 57, 60, 64], [52, 55, 59, 62], [57, 60, 64, 67], [50, 53, 57, 60]];
      var ML = [77, -1, 76, 77, 79, -1, 76, -1, 74, -1, 72, 74, 76, -1, -1, -1, 79, -1, 81, 79, 76, -1, 72, -1, 74, 76, 77, -1, 76, -1, 74, -1];
      var BX = [0, -1, 12, 0, -1, 0, 7, -1];
      var ch = AC[bar % 4], m = ML[(bar % 4) * 8 + st];
      if(st === 0 || st === 3) ch.forEach(function(x){ nota(a, hz(x + 12), t, p * (st ? 1.2 : 2.6), 'square', .0045, .01); });
      if(BX[st] >= 0) nota(a, hz(ch[0] - 24 + BX[st]), t, p * .9, 'triangle', .04, .004);
      if(st === 0 || st === 4) bumbo(a, t, .06);
      if(st === 4) ruido(a, t, .1, .02, 2000, 'bandpass');
      if(st % 2 === 1) ruido(a, t, .02, .007, 9000);                                 // "clique" de câmera
      if(m >= 0) nota(a, hz(m), t, p * 1.6, 'sine', .016, .01);
    }}
  };

  function parar(){ if(relogio){ clearInterval(relogio); relogio = null; } tocando = ''; }

  function tocar(k){
    if(tocando === k && relogio) return;
    parar();
    var a = ctx(), tr = TRILHAS[k]; if(!a || !tr) return;
    tocando = k; n = 0; prox = a.currentTime + .1;
    var p = 60 / tr.bpm / 2;
    relogio = setInterval(function(){
      if(document.hidden || mudo() || jogoAberto() !== k){ parar(); return; }
      while(prox < a.currentTime + .3){
        try{ tr.passo(a, prox, n % 8, Math.floor(n / 8), p); }catch(e){}
        n++; prox += p;
      }
    }, 60);
  }

  // Silencia as outras músicas e decide a trilha a cada 300 ms (só leitura de .hidden; barato).
  function vigiar(){
    var k = jogoAberto();
    if(k && !document.hidden && !mudo()){
      if(typeof hubMusicaParar === 'function') try{ hubMusicaParar(); }catch(e){}
      if(typeof ovMusicaParar === 'function') try{ ovMusicaParar(); }catch(e){}
      if(typeof music === 'function') try{ music(false); }catch(e){}
      tocar(k);
    } else if(tocando){
      var era = tocando; parar();
      if(!k && era && typeof twMusicaPaginaVisibilidade === 'function') try{ twMusicaPaginaVisibilidade(); }catch(e){}
    }
  }

  // Efeitos curtos dos jogos novos. Respeitam o mudo; sem AudioContext, nada acontece.
  var EFEITOS = {
    flash:   function(a, t){ ruido(a, t, .05, .05, 6000); nota(a, 1800, t + .02, .08, 'square', .02); nota(a, 2700, t + .08, .12, 'sine', .015); },
    regar:   function(a, t){ for(var i = 0; i < 4; i++) nota(a, 900 + i * 140 + Math.random() * 80, t + i * .05, .07, 'sine', .02, .003); },
    plantar: function(a, t){ nota(a, 330, t, .12, 'triangle', .04); nota(a, 494, t + .08, .16, 'triangle', .035); },
    colher:  function(a, t){ [72, 76, 79, 84, 88].forEach(function(m, i){ nota(a, hz(m), t + i * .07, .25, 'sine', .03, .005); }); },
    servir:  function(a, t){ nota(a, hz(88), t, .3, 'sine', .025, .002); nota(a, hz(95), t + .09, .35, 'sine', .018, .002); },
    ponto:   function(a, t){ nota(a, hz(79), t, .1, 'square', .03); nota(a, hz(84), t + .07, .18, 'square', .03); },
    perdeu:  function(a, t){ nota(a, hz(67), t, .16, 'triangle', .035); nota(a, hz(63), t + .13, .28, 'triangle', .03); },
    vitoria: function(a, t){ [72, 76, 79, 84].forEach(function(m, i){ nota(a, hz(m), t + i * .1, .3, 'square', .022); nota(a, hz(m - 12), t + i * .1, .3, 'triangle', .02); }); ruido(a, t + .4, .8, .025, 6000); },
    toque:   function(a, t){ nota(a, 988, t, .05, 'triangle', .03); }
  };
  function efeito(nome){
    if(mudo()) return;
    var a = ctx(), f = EFEITOS[nome]; if(!a || !f) return;
    try{ f(a, a.currentTime + .01); }catch(e){}
  }

  window.twJogoSom = efeito;
  window.twJogoTrilhaAtual = function(){ return tocando; };
  window.TW_JOGOS_TRILHAS = Object.keys(TRILHAS);
  window.twJogoNovoAberto = jogoAberto;
  if(!vigia) vigia = setInterval(vigiar, 300);
  document.addEventListener('visibilitychange', function(){ if(document.hidden) parar(); });
})();
