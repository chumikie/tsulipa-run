/* TsuLiPa⭐World — Arena do Karaoke⭐Time!
   Durante o SEU show (não no show automático dos NPCs), a sala inteira vira a tela do jogo:
   a sala fica atrás cobrindo a tela (karaoke-arena.css) e este canvas desenha as pistas por cima,
   com fundo transparente. As notas descem em velocidade constante até o centro dos botões, e o
   tamanho do botão e do halo segue as mesmas janelas do julgamento (PERFECT ±45 ms, BOM ±100 ms).
   Só desenho e toque: pontos, notas, áudio e saves continuam no motor do karaoke-time.html. */
(function(root){
  'use strict';
  var CORES = ['#ff9bd0', '#8cc8ff', '#8fe3b4', '#ffd36e'], TECLAS = ['D', 'F', 'J', 'K'], EMO = ['💖', '💎', '🍀', '⭐'];
  var geo = null, ligada = false;
  function rr(x, X, Y, W, H, R){ x.beginPath(); if(x.roundRect) x.roundRect(X, Y, W, H, R); else x.rect(X, Y, W, H); }
  function geometria(W, H){
    var lw = Math.min(118, Math.floor(Math.min(W - 20, 480) / 4));
    return { lw:lw, left:Math.round((W - lw * 4) / 2), top:Math.max(150, H * .17), target:Math.round(H - Math.max(86, Math.min(150, H * .15))), W:W, H:H };
  }
  function pista(px){
    if(!geo || !ligada) return -1;
    if(px < geo.left - 12 || px > geo.left + geo.lw * 4 + 12) return -1;
    return Math.max(0, Math.min(3, Math.floor((px - geo.left) / geo.lw)));
  }
  function canvas(kt){
    var a = document.getElementById('ktArena'); if(a) return a;
    var sala = document.getElementById('krCv'); if(!sala) return null;
    a = document.createElement('canvas');
    a.id = 'ktArena'; a.hidden = true;
    a.setAttribute('role', 'application'); a.setAttribute('aria-label', 'Pistas do show: D, F, J e K');
    (sala.closest('dialog') || document.body).appendChild(a);   // no diálogo da sala, fica na mesma camada
    a.addEventListener('pointerdown', function(e){
      var r = a.getBoundingClientRect(), lane = pista(e.clientX - r.left);
      if(lane >= 0){ e.preventDefault(); kt.hit(lane, e); }
    });
    a.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    return a;
  }
  // Dentro do site (iframe que cresce com o conteúdo), o site precisa abrir o iframe em tela cheia.
  function avisarSite(on){
    if(!document.documentElement.classList.contains('kt-no-site') || root.parent === root) return;
    try{ root.parent.postMessage({type:'tw-kt-arena', on:on}, root.location.origin); }catch(e){}
    if(!on && typeof root.ktAvisaAltura === 'function'){ root.ktAlturaUlt = 0; try{ root.ktAvisaAltura(); }catch(e){} }
  }
  function sync(kt){
    // Pausado (sem contagem de retomada), a sala volta ao normal: menus, Voltar do site e sair ficam à mão.
    var st = kt && kt.own && kt.own() && kt.arena ? kt.arena() : null;
    var on = !!st && !(st.paused && !st.resumeUntil) && !document.body.classList.contains('kt-mobile-overview');
    if(on !== ligada){
      ligada = on;
      document.body.classList.toggle('kt-arena', on);
      var a = canvas(kt); if(a) a.hidden = !on;
      avisarSite(on);
    }
    return on;
  }
  function desenhar(x, W, H, s){
    x.clearRect(0, 0, W, H);
    if(!s) return;
    var g = geometria(W, H); geo = g;
    var now = s.now, speed = (g.target - g.top) / s.fall, perfectPx = s.perfect * speed, goodPx = s.good * speed, pad = Math.min(g.lw * .4, 40);
    // Véu suave: a sala continua visível atrás das pistas.
    var veu = x.createLinearGradient(0, 0, 0, H);
    veu.addColorStop(0, 'rgba(18,8,44,.38)'); veu.addColorStop(.55, 'rgba(18,8,44,.2)'); veu.addColorStop(1, 'rgba(18,8,44,.55)');
    x.fillStyle = veu; x.fillRect(0, 0, W, H);
    for(var i = 0; i < 4; i++){
      var lx = g.left + i * g.lw, cx = lx + g.lw / 2, aceso = s.flash[i] > now;
      x.fillStyle = aceso ? 'rgba(255,255,255,.16)' : 'rgba(255,255,255,.07)';
      rr(x, lx + 4, g.top - 20, g.lw - 8, g.target - g.top + pad + 40, 22); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.22)'; x.lineWidth = 1.5; x.stroke();
      x.save(); x.globalAlpha = aceso ? .5 : .22; x.fillStyle = CORES[i];
      rr(x, lx + 8, g.target - goodPx, g.lw - 16, goodPx * 2, 14); x.fill(); x.restore();   // halo BOM
      x.save(); x.shadowColor = CORES[i]; x.shadowBlur = aceso ? 24 : 10; x.lineWidth = aceso ? 7 : 5; x.strokeStyle = CORES[i];
      x.fillStyle = aceso ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.28)';
      x.beginPath(); x.arc(cx, g.target, pad, 0, Math.PI * 2); x.fill(); x.stroke(); x.restore();             // botão PERFECT
      x.fillStyle = aceso ? CORES[i] : '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = '900 ' + Math.round(pad * .72) + 'px "M PLUS Rounded 1c",sans-serif'; x.fillText(TECLAS[i], cx, g.target + 1);
      x.font = Math.round(pad * .42) + 'px sans-serif'; x.fillText(EMO[i], cx, g.target + pad + 16);
    }
    x.textBaseline = 'alphabetic';
    // Notas em velocidade constante: chegam ao centro do botão no tempo da música.
    var nh = Math.max(14, Math.min(22, perfectPx * 1.6));
    s.notes.forEach(function(n){
      if(n.done) return;
      var delta = now - n.at; if(delta < -s.fall || delta > 170) return;
      var y = g.target + delta * speed, cx = g.left + n.lane * g.lw + g.lw / 2, nw = g.lw * .74;
      x.save(); x.globalAlpha = y < g.top + 30 ? Math.max(0, (y - g.top + 10) / 40) : 1;
      x.shadowColor = CORES[n.lane]; x.shadowBlur = 14; x.fillStyle = CORES[n.lane];
      rr(x, cx - nw / 2, y - nh / 2, nw, nh, nh / 2); x.fill();
      x.lineWidth = 3; x.strokeStyle = '#ffffff'; x.stroke(); x.shadowBlur = 0;
      x.fillStyle = 'rgba(255,255,255,.85)'; rr(x, cx - nw / 2 + 6, y - nh / 2 + 3, nw * .4, 3, 2); x.fill();
      x.restore();
    });
    // Nome da música e barra de progresso.
    x.textAlign = 'center'; x.font = '800 13px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = 'rgba(255,255,255,.92)';
    x.fillText('♪ ' + s.title + '  ·  ★ ' + (s.score || 0).toLocaleString('pt-BR') + '  ·  ' + (s.acc || 0) + '%', W / 2, g.top - 30, W - 24);
    var prog = Math.max(0, Math.min(1, (now - s.start) / s.durationMs));
    x.fillStyle = 'rgba(255,255,255,.25)'; rr(x, g.left, g.top - 22, g.lw * 4, 5, 3); x.fill();
    x.fillStyle = '#ff9bd0'; rr(x, g.left, g.top - 22, g.lw * 4 * prog, 5, 3); x.fill();
    // Retorno do acerto acima dos botões e combo grande no meio da pista.
    if(s.feedbackUntil > now && now >= s.start && s.feedback){
      var k = 1 - (s.feedbackUntil - now) / 520, esc = 1 + Math.max(0, .25 - k) * 1.2, perf = /^PERFECT/.test(s.feedback), miss = /^MISS/.test(s.feedback);
      var txt = s.feedback.split(' ').slice(0, perf || miss ? 1 : 2).join(' ');
      x.save(); x.translate(W / 2, g.target - pad - 46); x.scale(esc, esc);
      x.font = '900 ' + (perf ? 30 : 24) + 'px "M PLUS Rounded 1c",sans-serif'; x.lineWidth = 6; x.strokeStyle = 'rgba(30,12,70,.55)';
      x.strokeText(txt, 0, 0); x.fillStyle = perf ? '#fff3a6' : miss ? '#ffb3c8' : '#c8f5ff'; x.fillText(txt, 0, 0); x.restore();
    }
    if(s.combo >= 3){
      var cy = g.top + (g.target - g.top) * .34;
      x.save(); x.globalAlpha = .85; x.font = '900 ' + (s.combo >= 20 ? 44 : 36) + 'px "M PLUS Rounded 1c",sans-serif';
      x.fillStyle = 'rgba(255,255,255,.9)'; x.strokeStyle = 'rgba(123,63,240,.5)'; x.lineWidth = 5;
      x.strokeText(String(s.combo), W / 2, cy); x.fillText(String(s.combo), W / 2, cy);
      x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.fillText('COMBO', W / 2, cy + 18); x.restore();
    }
    // Contagem, pausa e retomada no centro.
    if(now < s.start || s.paused){
      x.fillStyle = 'rgba(18,8,44,.45)'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff';
      if(s.paused && s.resumeUntil){ x.font = '900 64px "M PLUS Rounded 1c",sans-serif'; x.fillText(String(Math.max(1, Math.ceil((s.resumeUntil - performance.now()) / 1000))), W / 2, H * .45); }
      else if(s.paused){ x.font = '900 34px "M PLUS Rounded 1c",sans-serif'; x.fillText('☾ Pausado', W / 2, H * .45); }
      else {
        x.font = '900 64px "M PLUS Rounded 1c",sans-serif'; x.fillText(String(Math.max(1, Math.ceil((s.start - now) / 1000))), W / 2, H * .42);
        x.font = '800 15px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#ffd1ea'; x.fillText(s.prep || '', W / 2, H * .42 + 34, W - 30);
      }
    }
  }
  function frame(kt){
    if(!sync(kt)) return;
    var a = canvas(kt); if(!a) return;
    var W = a.clientWidth || innerWidth, H = a.clientHeight || innerHeight, d = Math.min(2, root.devicePixelRatio || 1);
    if(a.width !== Math.round(W * d) || a.height !== Math.round(H * d)){ a.width = Math.round(W * d); a.height = Math.round(H * d); }
    var x = a.getContext('2d'); if(!x) return;
    x.setTransform(d, 0, 0, d, 0, 0);
    desenhar(x, W, H, kt.arena());
  }
  root.KaraokeArena = { sync:sync, frame:frame, lane:pista, geometry:geometria, draw:desenhar };
})(typeof window !== 'undefined' ? window : globalThis);
