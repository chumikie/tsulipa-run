/* TsuLiPa⭐World · bichinhos da Bagunça da semana (17/11/2026)
   Desenhados no mesmo jeito dos personagens: blocos arredondados com degradê de cima para baixo, olho de pixel
   (pálpebra, íris, pupila e dois brilhos), bochecha rosa e o mesmo contorno branco com sombra (perfCharContorno).
   Grade de 30 × 44 como o boneco: os pés no y = 44. Cada bicho tem dois humores: 'travesso' (antes) e 'feliz' (depois).
   TW_BICHOS.desenhar(x, tipo, cx, chao, ES, humor, t) e TW_BICHOS.cena(x, rua, W, H, ok, t) para o cenário. Arte original. */
(function(){
  'use strict';
  var TINTA = '#2b1d3d', PUPILA = '#140d1f';
  function E(g, cx, cy, rx, ry, r){ g.beginPath(); g.ellipse(cx, cy, Math.max(.01, rx), Math.max(.01, ry), r || 0, 0, 7); g.fill(); }
  function RR(g, x, y, w, h, r){ g.beginPath(); if(g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); g.fill(); }
  function V(g, y0, y1, a, b){ var gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, a); gr.addColorStop(1, b); return gr; }
  function T(g, p){ g.beginPath(); g.moveTo(p[0], p[1]); for(var i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); g.fill(); }
  // o olho de pixel dos personagens (3 × 5), com a cor da íris do bicho
  function olho(g, x, y, cor){ g.fillStyle = TINTA; g.fillRect(x, y, 3, 1); g.fillStyle = cor; g.fillRect(x, y + 1, 3, 4);
    g.fillStyle = PUPILA; g.fillRect(x + 1, y + 2, 2, 2); g.fillStyle = '#fff'; g.fillRect(x, y + 1, 1, 2); g.fillRect(x + 2, y + 4, 1, 1); }
  function olhoFeliz(g, x, y){ g.fillStyle = TINTA; g.fillRect(x, y + 3, 1, 1); g.fillRect(x + 1, y + 2, 1, 1); g.fillRect(x + 2, y + 3, 1, 1); }
  function olhoTravesso(g, x, y, cor, esq){ olho(g, x, y + 1, cor); g.fillStyle = TINTA; g.fillRect(esq ? x : x + 1, y, 2, 1); g.fillRect(esq ? x + 2 : x, y - 1, 1, 1); }   // sobrancelha arteira
  function rosto(g, x1, x2, y, cor, humor){   // dois olhos + bochechas (x1/x2 = canto esquerdo de cada olho)
    if(humor === 'feliz'){ olhoFeliz(g, x1, y); olhoFeliz(g, x2, y); }
    else { olhoTravesso(g, x1, y, cor, true); olhoTravesso(g, x2, y, cor, false); }
    g.fillStyle = 'rgba(255,111,181,.55)'; E(g, x1 - .6, y + 6.4, 1.9, 1.1); E(g, x2 + 3.6, y + 6.4, 1.9, 1.1);
  }
  function boca(g, cx, y, humor){ g.fillStyle = TINTA;
    if(humor === 'feliz'){ g.fillRect(cx - 1.5, y, 1, 1); g.fillRect(cx - .5, y + 1, 1, 1); g.fillRect(cx + .5, y, 1, 1); }
    else { g.fillRect(cx - 1, y + .5, 1, 1); g.fillRect(cx, y, 2, 1); }   // sorrisinho de lado
  }
  function pezinhos(g, xs, y, cor){ g.fillStyle = cor || '#ff8fb8'; xs.forEach(function(x){ RR(g, x, y, 3.4, 1.8, .9); }); }

  var B = {
    // Pombinho do palco: cinza-lilás, pescoço furta-cor, peito claro, bico laranja
    pombo:function(g, h, t){
      var b = Math.sin(t * .2) * .6;
      g.fillStyle = V(g, 22, 44, '#c9c3e6', '#9a92c8'); RR(g, 5, 26 + b, 21, 16, 7);                       // corpo
      g.fillStyle = V(g, 13, 30, '#d8d3f0', '#b2abd9'); RR(g, 8, 13 + b, 15, 15, 6);                         // cabeça
      g.fillStyle = V(g, 26, 31, '#7a5fd6', '#2fb38a'); RR(g, 8, 25 + b, 15, 4, 2);                          // pescoço furta-cor
      g.fillStyle = '#f2efff'; RR(g, 10, 30 + b, 11, 9, 4.5);                                               // peito
      g.fillStyle = V(g, 28, 40, '#aaa2d6', '#8178b6'); RR(g, 3, 29 + b, 6, 9, 3); RR(g, 22, 29 + b, 6, 9, 3);   // asinhas
      g.fillStyle = '#ffa23f'; T(g, [21.5, 20 + b, 26, 21.6 + b, 21.5, 23 + b]);                               // bico
      rosto(g, 10.5, 17, 16 + b, '#5a3b8a', h);
      pezinhos(g, [9.5, 17], 42.2);
      if(h !== 'feliz'){ g.save(); g.translate(25, 22 + b); g.rotate(.25); g.fillStyle = '#fff'; RR(g, 0, -3, 7, 8, 1); g.fillStyle = '#9b30d9'; g.fillRect(1.4, -1, 4, .6); g.fillRect(1.4, 1, 4, .6); g.fillRect(1.4, 3, 4, .6); E(g, 2, .6, .9, .7); g.restore(); }   // partitura no bico
    },
    // Coelhinha gulosa: branca, orelhas compridas com rosa por dentro, bochechas cheias de docinho
    coelho:function(g, h, t){
      var b = Math.abs(Math.sin(t * .18)) * -1.2, ore = Math.sin(t * .12) * .08;
      g.save(); g.translate(11, 15 + b); g.rotate(-.12 + ore); g.fillStyle = V(g, -14, 2, '#ffffff', '#f1e6f6'); RR(g, -2.6, -14, 5.2, 16, 2.6); g.fillStyle = '#ffb7d2'; RR(g, -1.2, -12, 2.4, 11, 1.2); g.restore();
      g.save(); g.translate(19, 15 + b); g.rotate(.16 - ore); g.fillStyle = V(g, -14, 2, '#ffffff', '#f1e6f6'); RR(g, -2.6, -14, 5.2, 16, 2.6); g.fillStyle = '#ffb7d2'; RR(g, -1.2, -12, 2.4, 11, 1.2); g.restore();
      g.fillStyle = V(g, 27, 44, '#ffffff', '#ead9f2'); RR(g, 6, 29 + b, 18, 14, 7);                           // corpo
      g.fillStyle = V(g, 13, 31, '#ffffff', '#efe2f5'); RR(g, 6, 13 + b, 18, 17, 7);                           // cabeça
      g.fillStyle = 'rgba(255,183,210,.85)';
      if(h !== 'feliz'){ E(g, 8.6, 25 + b, 3.2, 2.6); E(g, 21.4, 25 + b, 3.2, 2.6); }                         // bochechas cheias
      rosto(g, 9.5, 17.5, 17 + b, '#d0457b', h);
      g.fillStyle = '#ff7fae'; E(g, 15, 23.4 + b, 1.2, .9); boca(g, 15, 24.6 + b, h);
      pezinhos(g, [9, 17.6], 42.2, '#ffc4dc');
      if(h !== 'feliz'){ g.fillStyle = '#c98a4b'; [[4, 40], [26, 41], [24, 38.4]].forEach(function(p){ g.fillRect(p[0], p[1], 1.2, 1.2); }); }   // migalhas
      else { g.fillStyle = '#ff9ec7'; RR(g, 20, 31 + b, 7, 4, 2); g.fillStyle = '#b6ff3b'; RR(g, 20, 34.2 + b, 7, 1.4, .7); g.fillStyle = '#ffd6e8'; RR(g, 20, 35.6 + b, 7, 3.2, 1.6); }   // macaron na mão
    },
    // Borboleta sapeca: corpinho lilás, 4 asas em degradê com bolinhas, antenas com bolinha; voa batendo as asas
    borboleta:function(g, h, t){
      var f = .55 + Math.abs(Math.sin(t * .35)) * .45, y = 22 + Math.sin(t * .15) * 2;
      function asa(sx, cy, rx, ry, a, c1, c2){ g.save(); g.translate(15, y); g.scale(sx * f, 1); g.fillStyle = V(g, cy - ry, cy + ry, c1, c2); E(g, rx * .9, cy, rx, ry, a); g.fillStyle = 'rgba(255,255,255,.75)'; E(g, rx * 1.1, cy - ry * .2, 1.4, 1.4); g.restore(); }
      asa(-1, -5, 8, 7, -.4, '#ff8fd0', '#c45bff'); asa(1, -5, 8, 7, .4, '#ff8fd0', '#c45bff');
      asa(-1, 6, 6, 5, .4, '#d4ff7a', '#5fd38a'); asa(1, 6, 6, 5, -.4, '#d4ff7a', '#5fd38a');
      g.fillStyle = V(g, y - 9, y + 12, '#b99cff', '#7b3ff0'); RR(g, 11, y - 9, 8, 21, 4);                    // corpinho
      g.strokeStyle = TINTA; g.lineWidth = .9; g.lineCap = 'round'; g.beginPath(); g.moveTo(13, y - 8); g.quadraticCurveTo(11, y - 13, 9, y - 14); g.moveTo(17, y - 8); g.quadraticCurveTo(19, y - 13, 21, y - 14); g.stroke();
      g.fillStyle = '#ffd23f'; E(g, 9, y - 14.2, 1.3, 1.3); E(g, 21, y - 14.2, 1.3, 1.3);
      g.fillStyle = '#e4d8ff'; RR(g, 11.6, y - 6, 6.8, 7, 3);
      if(h === 'feliz'){ olhoFeliz(g, 11.8, y - 7.4); olhoFeliz(g, 15.4, y - 7.4); } else { g.fillStyle = TINTA; g.fillRect(12.2, y - 4.6, 1.6, 2.2); g.fillRect(16.2, y - 4.6, 1.6, 2.2); g.fillStyle = '#fff'; g.fillRect(12.2, y - 4.6, .7, .7); g.fillRect(16.2, y - 4.6, .7, .7); }
      g.fillStyle = 'rgba(255,111,181,.6)'; E(g, 12, y - 1.6, 1, .6); E(g, 18, y - 1.6, 1, .6);
    },
    // Passarinho distraído: redondinho rosa, topete, asinha, bico laranja; antes, uma pétala no bico e o olhar perdido
    passaro:function(g, h, t){
      var b = Math.sin(t * .22) * .7;
      g.fillStyle = V(g, 18, 44, '#ffc2dc', '#ff8fbd'); RR(g, 5, 19 + b, 21, 23, 10);                        // corpo-cabeça
      g.fillStyle = '#ffeaf3'; RR(g, 9, 30 + b, 13, 10, 5);                                                   // barriguinha
      g.fillStyle = '#ff7fae'; T(g, [12, 20 + b, 13.5, 14 + b, 15.5, 19.6 + b]); T(g, [15, 20 + b, 17.8, 15.4 + b, 18, 20.6 + b]);   // topete
      g.fillStyle = V(g, 27, 37, '#ff9fc6', '#f06aa4'); RR(g, 3, 28 + b, 8, 7, 3.5);                          // asinha
      g.fillStyle = '#ffa23f'; T(g, [25, 26 + b, 29.4, 27.6 + b, 25, 29.2 + b]);
      if(h === 'feliz') rosto(g, 13, 19.4, 21 + b, '#5a3b2e', h);
      else { olho(g, 13, 22 + b, '#5a3b2e'); olho(g, 19.4, 22 + b, '#5a3b2e'); g.fillStyle = TINTA; g.fillRect(13, 22 + b, 3, 1); g.fillRect(19.4, 22 + b, 3, 1);   // olhar distraído (pupila em cima)
        g.fillStyle = 'rgba(255,111,181,.55)'; E(g, 12.4, 28.4 + b, 1.9, 1.1); E(g, 23, 28.4 + b, 1.9, 1.1);
        g.fillStyle = '#ffd6ea'; g.save(); g.translate(29, 27.6 + b); g.rotate(.5); E(g, 0, 0, 2.6, 1.5); g.restore();   // pétala no bico
        g.fillStyle = '#9a8fd6'; g.font = '700 5px sans-serif'; g.fillText('♪', 24, 15 + b); }
      pezinhos(g, [10, 17], 42.2, '#ffa23f');
    },
    // Gatinho paparazzi: laranja com listras, orelhas, rabo; antes abraça os lightsticks, depois segura a câmera
    gato:function(g, h, t){
      var r = Math.sin(t * .14) * .25;
      g.save(); g.translate(24, 38); g.rotate(-.5 + r); g.fillStyle = V(g, -12, 0, '#ffb15c', '#f08a2c'); RR(g, -1.6, -12, 3.6, 13, 1.8); g.restore();   // rabo
      g.fillStyle = V(g, 28, 44, '#ffb867', '#f2913a'); RR(g, 6, 29, 18, 14, 7);
      g.fillStyle = '#fff3e3'; RR(g, 10, 32, 10, 9, 4);
      g.fillStyle = '#f08a2c'; T(g, [6.4, 18, 8, 9.6, 13, 15]); T(g, [23.6, 18, 22, 9.6, 17, 15]);               // orelhas
      g.fillStyle = '#ffc2dc'; T(g, [8, 16, 8.8, 12, 11.4, 15]); T(g, [22, 16, 21.2, 12, 18.6, 15]);
      g.fillStyle = V(g, 13, 31, '#ffbe72', '#f39740'); RR(g, 5, 13, 20, 17, 7.5);                             // cabeça
      g.fillStyle = '#e2741c'; g.fillRect(14, 13.4, 2, 3.2); g.fillRect(10.6, 14.2, 1.6, 2.4); g.fillRect(17.8, 14.2, 1.6, 2.4);   // listras
      rosto(g, 9.4, 17.6, 18, '#3aa86b', h);
      g.fillStyle = '#ff7fae'; T(g, [14, 24.2, 16, 24.2, 15, 25.2]); boca(g, 15, 25.6, h);
      g.strokeStyle = 'rgba(43,29,61,.55)'; g.lineWidth = .5; g.beginPath(); g.moveTo(4, 23.5); g.lineTo(8, 24); g.moveTo(4, 25.4); g.lineTo(8, 25.2); g.moveTo(26, 23.5); g.lineTo(22, 24); g.moveTo(26, 25.4); g.lineTo(22, 25.2); g.stroke();
      pezinhos(g, [9, 17.6], 42.2, '#ffd2a8');
      if(h !== 'feliz'){ [['#9b30d9', -.35, 6], ['#b6ff3b', 0, 15], ['#4169e1', .35, 24]].forEach(function(l){ g.save(); g.translate(l[2], 34); g.rotate(l[1] + Math.sin(t * .3 + l[2]) * .08); g.fillStyle = '#2b2b3a'; RR(g, -.9, 0, 1.8, 5, .6); g.fillStyle = l[0]; RR(g, -1.4, -9, 2.8, 9, 1.4); g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(-.7, -8, .8, 6); g.restore(); }); }
      else { g.fillStyle = '#3a3550'; RR(g, 8, 30.6, 14, 9, 2); g.fillStyle = '#5c5577'; RR(g, 10.6, 29, 4.6, 2.4, 1); g.fillStyle = '#cfe6ff'; E(g, 15, 35, 3.2, 3.2); g.fillStyle = '#4169e1'; E(g, 15, 35, 2, 2); g.fillStyle = '#fff'; E(g, 14.2, 34.2, .7, .7); g.fillStyle = '#ffd23f'; g.fillRect(19, 31.6, 2, 1.2); }   // câmera
    },
    // Nuvem resmungona: bloquinhos brancos arredondados, carinha de pixel; antes chove de birra, depois sorri
    nuvem:function(g, h, t){
      var b = Math.sin(t * .12) * 1.2, y = 16 + b;
      g.fillStyle = V(g, y - 2, y + 18, h === 'feliz' ? '#ffffff' : '#eef0f7', h === 'feliz' ? '#e9e4ff' : '#c8cbe0');
      RR(g, -2, y + 4, 34, 14, 7); RR(g, 3, y - 3, 14, 14, 7); RR(g, 13, y - 6, 15, 16, 7.5);
      rosto(g, 8.5, 18.5, y + 5, '#6d6ae8', h); boca(g, 13.5, y + 12, h === 'feliz' ? 'feliz' : 'x');
      if(h !== 'feliz'){ g.fillStyle = TINTA; g.fillRect(12.5, y + 12.6, 2.4, .8);
        g.fillStyle = '#8fb7ff'; [[3, 0], [11, 1.4], [19, .4], [27, 1.8]].forEach(function(p){ var q = (t * .9 + p[1] * 9) % 18; RR(g, p[0], y + 19 + q, 1.3, 3, .6); }); }
      else { g.fillStyle = '#ffe14d'; [[-3, y - 2], [31, y], [26, y - 9]].forEach(function(p){ var s = 1.6 + Math.sin(t * .3 + p[0]) * .5; T(g, [p[0], p[1] - s * 2, p[0] + s * .5, p[1] - s * .5, p[0] + s * 2, p[1], p[0] + s * .5, p[1] + s * .5, p[0], p[1] + s * 2, p[0] - s * .5, p[1] + s * .5, p[0] - s * 2, p[1], p[0] - s * .5, p[1] - s * .5]); }); }
    }
  };

  // Desenha o bicho com o contorno branco e a sombra dos personagens. cx = meio, chao = linha dos pés, ES = escala.
  function desenhar(x, tipo, cx, chao, ES, humor, t){
    var f = B[tipo]; if(!f) return false;
    var tx = cx - 15 * ES, ty = chao - 44 * ES;
    if(typeof perfCharContorno === 'function'){ perfCharContorno(x, tx, ty, ES, function(){ f(window.g, humor, t || 0); }); return true; }
    x.save(); x.translate(tx, ty); x.scale(ES, ES); f(x, humor, t || 0); x.restore(); return true;
  }

  // ---------- cenários: a rua por trás e a bagunça (antes) ou tudo arrumado (depois) ----------
  function folha(x, cx, cy, a, cor){ x.save(); x.translate(cx, cy); x.rotate(a); x.fillStyle = '#fff'; x.strokeStyle = 'rgba(80,50,140,.25)'; x.lineWidth = 1.2; x.beginPath(); x.rect(-9, -11, 18, 22); x.fill(); x.stroke();
    x.fillStyle = cor; for(var i = 0; i < 4; i++) x.fillRect(-6, -7 + i * 4.4, 12, 1); x.beginPath(); x.ellipse(-3, -4, 2, 1.5, 0, 0, 7); x.ellipse(3, 4.6, 2, 1.5, 0, 0, 7); x.fill(); x.restore(); }
  function petala(x, cx, cy, a){ x.save(); x.translate(cx, cy); x.rotate(a); x.fillStyle = '#ffc4dc'; x.beginPath(); x.ellipse(0, 0, 6, 3.4, 0, 0, 7); x.fill(); x.fillStyle = 'rgba(255,111,181,.5)'; x.beginPath(); x.ellipse(-2, 0, 2.4, 1.2, 0, 0, 7); x.fill(); x.restore(); }
  function doce(x, cx, cy, c){ x.fillStyle = c; RR(x, cx - 7, cy - 6, 14, 5, 2.5); x.fillStyle = '#fff6e0'; RR(x, cx - 7, cy - 1.4, 14, 2, 1); x.fillStyle = c; RR(x, cx - 7, cy + .6, 14, 5, 2.5); }
  var CENA = {
    palco:function(x, W, H, ok, t){
      x.fillStyle = V(x, 0, H, '#3b1a6b', '#7b3ff0'); x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(255,255,255,.08)'; for(var i = 0; i < 5; i++){ x.beginPath(); x.moveTo(60 + i * 100, 0); x.lineTo(30 + i * 100, H); x.lineTo(90 + i * 100, H); x.closePath(); x.fill(); }
      x.fillStyle = '#c8326b'; x.fillRect(0, 0, W, 14); x.fillStyle = '#e0457b'; for(i = 0; i < W; i += 32){ x.beginPath(); x.arc(i + 16, 14, 16, 0, Math.PI); x.fill(); }
      x.fillStyle = V(x, H - 40, H, '#5a2fa8', '#2e1660'); x.fillRect(0, H - 40, W, 40); x.fillStyle = '#b6ff3b'; x.fillRect(0, H - 40, W, 2);
      if(!ok) [[270, H - 22, -.5, '#9b30d9'], [312, H - 14, .4, '#4169e1'], [420, H - 26, .9, '#ff6fb5'], [450, H - 12, -.2, '#9b30d9'], [372, H - 30, 1.3, '#4169e1'], [230, H - 12, .2, '#ff6fb5']].forEach(function(f){ folha(x, f[0], f[1], f[2], f[3]); });
      else [['#9b30d9', 410], ['#4169e1', 436], ['#ff6fb5', 462]].forEach(function(p){ for(var k = 0; k < 3; k++) folha(x, p[1], H - 18 - k * 4, 0, p[0]); });
    },
    harajuku:function(x, W, H, ok, t){
      x.fillStyle = V(x, 0, H, '#ffe6f3', '#ffc2e0'); x.fillRect(0, 0, W, H);
      x.fillStyle = '#ff6fb5'; for(var i = 0; i < W; i += 24){ x.fillStyle = (i / 24) % 2 ? '#ff6fb5' : '#fff'; x.fillRect(i, 0, 24, 18); } x.fillStyle = 'rgba(0,0,0,.06)'; x.fillRect(0, 18, W, 3);
      x.fillStyle = '#fff'; RR(x, 250, 40, 210, 100, 14); x.fillStyle = 'rgba(160,220,255,.35)'; RR(x, 256, 46, 198, 88, 10);
      x.fillStyle = '#f5b8d6'; x.fillRect(256, 96, 198, 5); x.fillRect(256, 128, 198, 5);
      var pos = [[290, 90], [340, 90], [390, 90], [430, 90], [300, 122], [370, 122], [425, 122]], cores = ['#ff9ec7', '#b6ff3b', '#9ec5ff', '#ffd23f', '#c9a2ff', '#ff9ec7', '#9ef0c9'];
      pos.forEach(function(p, i){ x.fillStyle = '#fff'; x.beginPath(); x.ellipse(p[0], p[1] + 5, 14, 3, 0, 0, 7); x.fill(); if(ok || i % 3 === 2) doce(x, p[0], p[1] - 2, cores[i]); else { x.fillStyle = '#c98a4b'; x.fillRect(p[0] - 5, p[1] + 2, 1.6, 1.6); x.fillRect(p[0] + 3, p[1] + 3, 1.6, 1.6); } });
      x.fillStyle = V(x, H - 34, H, '#ffd6ea', '#ffb1d4'); x.fillRect(0, H - 34, W, 34);
    },
    fofo:function(x, W, H, ok, t){
      x.fillStyle = V(x, 0, H, '#eaffe0', '#bff0c9'); x.fillRect(0, 0, W, H);
      x.fillStyle = V(x, H - 40, H, '#8fd96a', '#5cb84a'); x.fillRect(0, H - 40, W, 40);
      x.fillStyle = '#4fae5a'; RR(x, 404, 70, 8, H - 100, 4); x.save(); x.translate(392, 110); x.rotate(-.5); x.fillStyle = '#5fc46a'; x.beginPath(); x.ellipse(0, 0, 18, 7, 0, 0, 7); x.fill(); x.restore();
      x.fillStyle = V(x, 30, 80, '#ff6f9e', '#d6336c'); x.beginPath(); x.moveTo(380, 50); x.lineTo(392, 26); x.lineTo(408, 44); x.lineTo(424, 26); x.lineTo(436, 50); x.quadraticCurveTo(436, 82, 408, 82); x.quadraticCurveTo(380, 82, 380, 50); x.fill();   // tulipa gigante
      function regador(cx, cy, s){ x.save(); x.translate(cx, cy); x.scale(s, s); x.fillStyle = '#4fb3ff'; RR(x, -9, -8, 18, 14, 3); x.fillRect(8, -6, 10, 3); x.fillStyle = '#2b8ad6'; x.fillRect(16, -8, 4, 7); x.strokeStyle = '#2b8ad6'; x.lineWidth = 2.4; x.beginPath(); x.arc(-11, -2, 5, Math.PI * .5, Math.PI * 1.5); x.stroke(); x.restore(); }
      if(ok){ regador(300, H - 26, 1); regador(450, H - 22, 1); x.fillStyle = '#8fd0ff'; [[468, H - 34], [474, H - 28], [470, H - 22]].forEach(function(p){ RR(x, p[0], p[1] + (t * .8) % 6, 1.6, 3.4, .8); }); }
      else { x.save(); x.beginPath(); x.rect(380, 30, 60, 46); x.clip(); regador(410, 74, .8); x.restore(); }   // o regador espiando de dentro da tulipa
      [[250, H - 40], [290, H - 44], [330, H - 40], [470, H - 42]].forEach(function(p, i){ x.fillStyle = '#4fae5a'; x.fillRect(p[0], p[1], 2, 14); x.fillStyle = ['#ffd23f', '#ff9ec7', '#c9a2ff', '#ff9ec7'][i]; x.save(); x.translate(p[0] + 1, p[1]); x.rotate(ok ? 0 : .9); x.beginPath(); x.ellipse(0, -3, 5, 4, 0, 0, 7); x.fill(); x.restore(); });
    },
    praca:function(x, W, H, ok, t){
      x.fillStyle = V(x, 0, H, '#e3f2ff', '#bcdcff'); x.fillRect(0, 0, W, H);
      x.fillStyle = V(x, H - 40, H, '#e8e2f7', '#cfc6ec'); x.fillRect(0, H - 40, W, 40);
      x.fillStyle = 'rgba(255,255,255,.5)'; for(var i = 0; i < W; i += 40) x.fillRect(i, H - 40, 2, 40);
      x.fillStyle = '#b9b1dc'; RR(x, 300, H - 70, 150, 36, 18); x.fillStyle = V(x, H - 66, H - 40, '#7fd0ff', '#3aa0f0'); RR(x, 308, H - 66, 134, 24, 12);   // bacia da fonte
      x.fillStyle = '#b9b1dc'; RR(x, 368, H - 120, 14, 54, 5); x.fillStyle = '#d6cff0'; RR(x, 352, H - 126, 46, 10, 5);
      x.fillStyle = 'rgba(160,220,255,.9)'; for(i = 0; i < 6; i++){ var q = (t * .7 + i * 4) % 22; x.beginPath(); x.ellipse(362 + i * 5, H - 126 + q * 2.2, 1.6, 2.6, 0, 0, 7); x.fill(); }
      if(ok){ [[340, H - 56], [356, H - 50], [372, H - 58], [390, H - 52], [406, H - 57]].forEach(function(p, i){ petala(x, p[0], p[1] + Math.sin(t * .1 + i) * 1.2, i); }); }
      else [[250, H - 12], [276, H - 26], [470, H - 18], [446, H - 8], [214, H - 30], [300, H - 8], [420, H - 30]].forEach(function(p, i){ petala(x, p[0], p[1], i * 1.3); });
    },
    arena:function(x, W, H, ok, t){
      x.fillStyle = V(x, 0, H, '#2a1446', '#5a2c8a'); x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(255,255,255,.12)'; for(var r = 0; r < 3; r++) for(var i = 0; i < 18; i++){ x.beginPath(); x.arc(14 + i * 28 + r * 9, 40 + r * 22, 7, Math.PI, 0); x.fill(); }   // torcida
      if(ok) for(r = 0; r < 3; r++) for(i = 0; i < 18; i += 2){ var c = ['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5'][(i + r) % 4]; x.save(); x.translate(14 + i * 28 + r * 9, 30 + r * 22); x.rotate(Math.sin(t * .2 + i) * .3); x.fillStyle = c; x.shadowColor = c; x.shadowBlur = 8; RR(x, -1.5, -12, 3, 12, 1.5); x.restore(); }
      x.fillStyle = V(x, H - 40, H, '#e0742a', '#a84e14'); x.fillRect(0, H - 40, W, 40); x.fillStyle = '#ffd23f'; x.fillRect(0, H - 40, W, 2);
    },
    ceu:function(x, W, H, ok, t){
      x.fillStyle = V(x, 0, H, ok ? '#cfe6ff' : '#c9cbe0', ok ? '#f2e9ff' : '#e3e2ee'); x.fillRect(0, 0, W, H);
      var cores = ['#ff6f9e', '#ffa23f', '#ffe14d', '#8fe36a', '#4fb3ff', '#9b6dff'];
      x.save(); x.globalAlpha = ok ? 1 : .35; cores.forEach(function(c, i){ x.strokeStyle = c; x.lineWidth = 7; x.beginPath(); x.arc(360, H + 10, 150 - i * 7, Math.PI, 0); x.stroke(); }); x.restore();
      x.fillStyle = V(x, H - 40, H, '#ffffff', '#e4defa'); x.fillRect(0, H - 40, W, 40);
      x.fillStyle = 'rgba(255,255,255,.85)'; [[60, 40], [180, 26], [440, 50]].forEach(function(p){ RR(x, p[0], p[1], 46, 14, 7); RR(x, p[0] + 10, p[1] - 8, 22, 14, 7); });
    }
  };
  function cena(x, rua, W, H, ok, t){ var f = CENA[rua]; if(!f) return false; x.save(); f(x, W, H, ok, t || 0); x.restore(); return true; }

  window.TW_BICHOS = {desenhar:desenhar, cena:cena, tipos:Object.keys(B)};
})();
