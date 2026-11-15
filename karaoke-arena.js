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
    // Celular: faixa de até 480 px. Computador (tela larga e deitada): pistas largas, ocupando quase metade da tela.
    var largo = W >= 900 && W > H * 1.2;
    var lw = largo ? Math.min(170, Math.floor(W * .46 / 4)) : Math.min(118, Math.floor(Math.min(W - 20, 480) / 4));
    // Em cima fica o arco de progresso (como o da Live do Link! Like!); embaixo, os medidores redondos.
    return { lw:lw, left:Math.round((W - lw * 4) / 2), top:Math.round(Math.max(200, H * .24)), target:Math.round(H - Math.max(130, Math.min(190, H * .21))), W:W, H:H };
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
  /* HUD no formato de Live (inspirado no Link! Like!): arco de progresso com estrelas, placar,
     e medidores redondos de Precisão, Combo e Progresso. Só lê o estado do show. */
  var TX = {pt:['PRECISÃO','COMBO','MÚSICA','Pausado'], en:['ACCURACY','COMBO','SONG','Paused'], es:['PRECISIÓN','COMBO','CANCIÓN','En pausa'],
            id:['AKURASI','KOMBO','LAGU','Jeda'], th:['ความแม่น','คอมโบ','เพลง','หยุดชั่วคราว'], ja:['せいかく','コンボ','きょく','一時停止']};
  function idioma(){ var l = ''; try{ l = new URLSearchParams(location.search).get('lang') || localStorage.getItem('brs48cr_lang') || ''; }catch(e){} return l; }   // igual ao Karaoke (LANG fica dentro do script dele)
  function tx(i){ var l = TX[idioma()] ? idioma() : 'pt'; return TX[l][i]; }
  function estrela(x, cx, cy, r, cor){ x.beginPath(); for(var i = 0; i < 10; i++){ var a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? r * .45 : r; x.lineTo(cx + Math.cos(a) * q, cy + Math.sin(a) * q); } x.closePath(); x.fillStyle = cor; x.fill(); }
  function coracao(x, cx, cy, r, cor, a){
    if(a <= 0) return; x.save(); x.globalAlpha = a; x.fillStyle = cor; x.translate(cx, cy); x.beginPath(); x.moveTo(0, r * .9);
    x.bezierCurveTo(-r * 1.4, -r * .1, -r * .7, -r * 1.1, 0, -r * .35); x.bezierCurveTo(r * .7, -r * 1.1, r * 1.4, -r * .1, 0, r * .9); x.fill(); x.restore();
  }
  function medidor(x, cx, cy, r, frac, cor, txt, rot){
    x.save(); x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); x.arc(cx, cy, r + 6, 0, Math.PI * 2); x.fill();
    x.lineWidth = r * .42; x.strokeStyle = '#2b1d4a'; x.beginPath(); x.arc(cx, cy, r * .72, 0, Math.PI * 2); x.stroke();
    x.strokeStyle = cor; x.beginPath(); x.arc(cx, cy, r * .72, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, frac))); x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 ' + Math.round(r * .6) + 'px "M PLUS Rounded 1c",sans-serif';
    x.lineJoin = 'round'; x.lineWidth = 4; x.strokeStyle = '#2b1d4a'; x.strokeText(txt, cx, cy + 1); x.fillStyle = '#fff'; x.fillText(txt, cx, cy + 1);
    x.textBaseline = 'alphabetic'; x.font = '900 10px "M PLUS Rounded 1c",sans-serif'; x.lineWidth = 4; x.strokeStyle = 'rgba(30,12,70,.8)';
    x.strokeText(rot, cx, cy - r - 10); x.fillStyle = '#fff'; x.fillText(rot, cx, cy - r - 10); x.restore();
  }
  function hud(x, W, H, g, s, prog, now){
    // arco: corda sobre as pistas, com 4 trechos coloridos e uma estrela no fim de cada um
    var a0 = g.left + 14, a1 = g.left + g.lw * 4 - 14, meio = (a0 + a1) / 2, c = (a1 - a0) / 2, sag = 34, topoY = g.top - 92;
    var r = (c * c + sag * sag) / (2 * sag), cy = topoY + r;
    var ini = Math.atan2(g.top - 92 + sag - cy, a0 - meio), fim = Math.atan2(g.top - 92 + sag - cy, a1 - meio);
    x.save(); x.lineCap = 'round'; x.lineWidth = 20; x.strokeStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.arc(meio, cy, r, ini, fim); x.stroke();
    x.lineCap = 'butt'; x.lineWidth = 11;
    for(var i = 0; i < 4; i++){
      var aa = ini + (fim - ini) * i / 4 + .003, bb = ini + (fim - ini) * (i + 1) / 4 - .003, cheio = Math.max(0, Math.min(1, prog * 4 - i));
      x.strokeStyle = 'rgba(90,60,150,.25)'; x.beginPath(); x.arc(meio, cy, r, aa, bb); x.stroke();
      if(cheio > 0){ x.strokeStyle = CORES[i]; x.beginPath(); x.arc(meio, cy, r, aa, aa + (bb - aa) * cheio); x.stroke(); }
    }
    for(var k = 1; k <= 4; k++){
      var an = ini + (fim - ini) * k / 4, ex = meio + Math.cos(an) * r, ey = cy + Math.sin(an) * r, aceso = prog >= k / 4 - .001;
      x.fillStyle = '#fff'; x.strokeStyle = aceso ? '#ffb347' : 'rgba(150,120,210,.6)'; x.lineWidth = 3; x.beginPath(); x.arc(ex, ey, 13, 0, Math.PI * 2); x.fill(); x.stroke();
      estrela(x, ex, ey + 1, 8, aceso ? '#ffcf1f' : '#e6dcff');
    }
    // placar logo abaixo do arco
    var pts = String(Math.max(0, Math.round(s.score || 0))).padStart(6, '0'), bw = 150, by = topoY + 14;
    rr(x, meio - bw / 2, by, bw, 38, 11); x.fillStyle = 'rgba(43,29,74,.92)'; x.fill(); x.lineWidth = 3; x.strokeStyle = '#ffb347'; x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '900 21px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#fff'; x.fillText('★ ' + pts, meio, by + 20);
    x.textBaseline = 'alphabetic'; x.font = '800 11px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = 'rgba(255,255,255,.92)';
    x.fillText('♪ ' + s.title, meio, by + 54, Math.min(W - 24, g.lw * 4));
    x.restore();
    // medidores embaixo: Precisão · Combo (enche a cada 10 e muda de cor) · Música (quanto já tocou)
    var my = H - Math.max(40, Math.min(58, H * .065)), rad = Math.max(22, Math.min(30, H * .034)), dx = Math.min(g.lw * 1.4, 140);
    var nivel = Math.floor((s.combo || 0) / 10), cores = ['#ff9bd0', '#8cc8ff', '#8fe3b4', '#ffd36e'];
    medidor(x, W / 2 - dx, my, rad * .85, (s.acc || 0) / 100, '#8cc8ff', (s.acc || 0) + '%', tx(0));
    medidor(x, W / 2, my, rad, ((s.combo || 0) % 10) / 10 || (s.combo ? 1 : 0), cores[nivel % 4], String(s.combo || 0), tx(1));
    medidor(x, W / 2 + dx, my, rad * .85, prog, '#ffd36e', Math.round(prog * 100) + '%', tx(2));
  }
  function desenhar(x, W, H, s){
    x.clearRect(0, 0, W, H);
    if(!s) return;
    var g = geometria(W, H); geo = g;
    var now = s.now, speed = (g.target - g.top) / s.fall, perfectPx = s.perfect * speed, goodPx = s.good * speed, pad = Math.min(g.lw * .4, 40);
    // Véu suave: a sala continua visível atrás das pistas.
    var veu = x.createLinearGradient(0, 0, 0, H);
    veu.addColorStop(0, 'rgba(18,8,44,.26)'); veu.addColorStop(.55, 'rgba(18,8,44,.1)'); veu.addColorStop(1, 'rgba(18,8,44,.5)');
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
    var prog = Math.max(0, Math.min(1, (now - s.start) / s.durationMs));
    hud(x, W, H, g, s, prog, now);
    // Retorno do acerto acima dos botões e combo grande no meio da pista.
    if(s.feedbackUntil > now && now >= s.start && s.feedback){
      var k = 1 - (s.feedbackUntil - now) / 520, esc = 1 + Math.max(0, .25 - k) * 1.2, perf = /^PERFECT/.test(s.feedback), miss = /^MISS/.test(s.feedback);
      var txt = s.feedback.split(' ').slice(0, perf || miss ? 1 : 2).join(' ');
      x.save(); x.translate(W / 2, g.target - pad - 46); x.scale(esc, esc);
      x.font = '900 ' + (perf ? 30 : 24) + 'px "M PLUS Rounded 1c",sans-serif'; x.lineWidth = 6; x.strokeStyle = 'rgba(30,12,70,.55)';
      x.strokeText(txt, 0, 0); x.fillStyle = perf ? '#fff3a6' : miss ? '#ffb3c8' : '#c8f5ff'; x.fillText(txt, 0, 0); x.restore();
    }
    if(s.feedbackUntil > now && now >= s.start && s.feedback && !/^MISS/.test(s.feedback)){
      var uu = 1 - (s.feedbackUntil - now) / 520;
      for(var c = 0; c < 5; c++) coracao(x, g.left + g.lw * (.5 + (c * 0.83) % 4), g.target - pad - uu * (90 + c * 18), 8 + c % 3 * 2, ['#ff9bd0', '#ffd36e', '#8cc8ff'][c % 3], 1 - uu);
    }
    // O combo mora no medidor redondo de baixo (não repete no meio da pista).
    // Contagem, pausa e retomada no centro.
    if(now < s.start || s.paused){
      x.fillStyle = 'rgba(18,8,44,.45)'; x.fillRect(0, 0, W, H); x.fillStyle = '#fff';
      if(s.paused && s.resumeUntil){ x.font = '900 64px "M PLUS Rounded 1c",sans-serif'; x.fillText(String(Math.max(1, Math.ceil((s.resumeUntil - performance.now()) / 1000))), W / 2, H * .45); }
      else if(s.paused){ x.font = '900 34px "M PLUS Rounded 1c",sans-serif'; x.fillText('☾ ' + tx(3), W / 2, H * .45); }
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
