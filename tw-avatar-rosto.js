/* TsuLiPa⭐World — rosto, sapatos e partes de baixo especiais do avatar 2D (14/11/2026).
   Usado pelas três cópias do drawChar (centerrun.js, karaoke-time.html e sora-jump.html),
   na MESMA grade de 30×44 de sempre: nenhum ponto de encaixe muda (chapéus, poses, objetos, fotos).
   - Rosto à escolha (o padrão '' é sempre o desenho de antes):
     c.olho = '' | 'redondo' | 'brilhante' | 'pontinho' | 'gatinho' | 'sereno'
     c.boca = '' | 'sorriso' | 'gato' | 'aberta' | 'dentinho'
     c.bochecha = '' | 'sem' | 'forte' | 'sardas' | 'estrelinha'
     Os olhos novos são só formas cheias (sem traços), para não aparecer linha solta em tamanho pequeno.
   - Sapatos por cima da ponta das pernas (tênis claro com perna escura; sapatilha escura com perna clara).
   - Saia/bermuda também para Zipper, Sweet e Estrelado.
   Coordenadas do rosto já com o translate(0,-4) do drawChar: olhos em x+10..13 / x+18..21, y+17..22; boca em y+24. */
(function(root){
  'use strict';
  // Peças do rosto à escolha. '' = o desenho de sempre (o mais simpático, padrão de todo mundo).
  var OLHOS = ['', 'redondo', 'brilhante', 'pontinho', 'gatinho', 'sereno'];
  var BOCAS = ['', 'sorriso', 'gato', 'aberta', 'dentinho'];
  var BOCHECHAS = ['', 'sem', 'forte', 'sardas', 'estrelinha'];
  var TINTA = '#223', PUPILA = '#112';

  function hex(c, padrao){ return typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? c : padrao; }
  function luma(c){ var v = parseInt(c.slice(1), 16); return ((v >> 16 & 255) * .299 + (v >> 8 & 255) * .587 + (v & 255) * .114) / 255; }
  function escolha(lista, v){ return lista.indexOf(v) >= 0 ? v : ''; }
  function forma(c){ return escolha(OLHOS, c && c.olho); }
  function E(g, cx, cy, rx, ry, r){ g.beginPath(); g.ellipse(cx, cy, rx, ry, r || 0, 0, Math.PI * 2); g.fill(); }
  function RR(g, X, Y, W, H, R){ g.beginPath(); if(g.roundRect) g.roundRect(X, Y, W, H, R); else g.rect(X, Y, W, H); g.fill(); }

  // Um olho aberto, sem traços (só formas cheias): x0 = x+10 (esquerdo) ou x+18 (direito).
  function olho(g, c, x0, y, lado){
    var f = forma(c), cor = hex(c && c.eye, '#5a3b2e');
    if(f === ''){   // o de sempre, pixel por pixel
      g.fillStyle = TINTA; g.fillRect(x0, y + 17, 3, 1);
      g.fillStyle = cor; g.fillRect(x0, y + 18, 3, 4);
      g.fillStyle = PUPILA; g.fillRect(x0 + 1, y + 19, 2, 2);
      g.fillStyle = '#fff'; g.fillRect(x0, y + 18, 1, 2); g.fillRect(x0 + 2, y + 21, 1, 1);
      return;
    }
    if(f === 'pontinho'){   // olhinho de ponto, bem chibi
      g.fillStyle = PUPILA; E(g, x0 + 1.5, y + 20, 1.35, 1.75);
      g.fillStyle = '#fff'; E(g, x0 + 1, y + 19.3, .45, .45);
      return;
    }
    var big = f === 'brilhante', w = big ? 3.4 : 3, h = big ? 4.6 : 4, X = x0 + 1.5 - w / 2, Y = y + 22 - h;
    if(f === 'sereno'){ Y = y + 19.4; h = 2.6; }
    g.fillStyle = cor; RR(g, X, Y, w, h, [1.1, 1.1, 1.5, 1.5]);
    g.fillStyle = PUPILA; E(g, x0 + 1.6, Y + h * .58, w * .32, h * .27);
    g.fillStyle = TINTA; RR(g, X - .25, Y - 1, w + .5, 1.25, .6);                     // pálpebra cheia, sem linha solta
    if(f === 'gatinho'){ g.beginPath(); var ox = lado < 0 ? X - .25 : X + w + .25; g.moveTo(ox, Y - 1); g.lineTo(ox + lado * 1.6, Y - 1.9); g.lineTo(ox, Y + .25); g.closePath(); g.fill(); }
    g.fillStyle = '#fff'; E(g, X + w * .3, Y + h * .3, w * .2, h * .14);                // brilho grande
    E(g, X + w * .72, Y + h * .78, w * .12, w * .12);                                   // brilho pequeno
    if(big){ E(g, X + w * .75, Y + h * .35, .3, .3); }
  }
  function olhoFechado(g, x, y, esq){   // o ^ de sempre
    var a = esq ? 9 : 18;
    g.strokeStyle = TINTA; g.lineWidth = 1.5; g.beginPath();
    g.moveTo(x + a, y + 20); g.quadraticCurveTo(x + a + 2, y + 17, x + a + 4, y + 20); g.stroke();
  }
  // Boca: 'feliz' = sorriso de olhos fechados ou piscadinha.
  function boca(g, c, x, y, feliz){
    var b = escolha(BOCAS, c && c.boca);
    g.fillStyle = TINTA; g.strokeStyle = TINTA; g.lineCap = 'round';
    if(b === 'gato'){   // ω
      g.lineWidth = .9; g.beginPath(); g.moveTo(x + 12.6, y + 23.6);
      g.quadraticCurveTo(x + 13.8, y + 25.4, x + 15, y + 23.8); g.quadraticCurveTo(x + 16.2, y + 25.4, x + 17.4, y + 23.6); g.stroke();
      if(feliz){ g.fillStyle = '#ff8fb0'; E(g, x + 15, y + 25.4, 1, .6); }
      return;
    }
    if(feliz || b === 'aberta'){
      var r = feliz ? 2.5 : 1.7;
      g.beginPath(); g.arc(x + 15, y + 23, r, 0, Math.PI); g.fill();
      if(b === 'aberta' || b === 'sorriso'){ g.fillStyle = '#ff8fb0'; E(g, x + 15, y + 23 + r * .62, r * .5, r * .28); }
    } else if(b === 'sorriso' || b === 'dentinho'){
      g.lineWidth = 1; g.beginPath(); g.moveTo(x + 13.4, y + 23.6); g.quadraticCurveTo(x + 15, y + 25.3, x + 16.6, y + 23.6); g.stroke();
    } else g.fillRect(x + 14, y + 24, 3, 1);                                             // o tracinho de sempre
    if(b === 'dentinho'){ g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x + 15.6, y + 23.9); g.lineTo(x + 16.6, y + 24); g.lineTo(x + 16.1, y + 25.2); g.closePath(); g.fill(); }
  }
  // Devolve true quando desenhou a expressão (0 neutra, 2 sorriso, 3 piscadinha). As outras ficam como estavam.
  function rosto(g, c, x, y, expr){
    expr = +expr || 0;
    if(expr === 0){ olho(g, c, x + 10, y, -1); olho(g, c, x + 18, y, 1); boca(g, c, x, y, false); return true; }
    if(expr === 2){ olhoFechado(g, x, y, true); olhoFechado(g, x, y, false); boca(g, c, x, y, true); return true; }
    if(expr === 3){ olho(g, c, x + 10, y, -1); olhoFechado(g, x, y, false); boca(g, c, x, y, true); return true; }
    return false;
  }
  // Bochecha: '' chama o desenho de cada página (padrao), as outras são iguais em todas.
  function bochecha(g, c, x, y, padrao){
    var b = escolha(BOCHECHAS, c && c.bochecha);
    if(b === ''){ if(typeof padrao === 'function') padrao(); return; }
    if(b === 'sem') return;
    if(b === 'forte'){ g.fillStyle = 'rgba(255,90,150,.5)'; E(g, x + 9, y + 23, 2.9, 1.7); E(g, x + 23, y + 23, 2.9, 1.7); return; }
    if(b === 'sardas'){
      g.fillStyle = 'rgba(255,111,181,.2)'; E(g, x + 9, y + 23, 2.6, 1.5); E(g, x + 23, y + 23, 2.6, 1.5);
      g.fillStyle = 'rgba(150,80,50,.55)'; [[8, 22.6], [9.6, 23.4], [7.4, 23.8], [22, 22.6], [23.6, 23.4], [21.4, 23.8]].forEach(function(p){ E(g, x + p[0], y + p[1], .4, .4); });
      return;
    }
    if(b === 'estrelinha'){
      g.fillStyle = 'rgba(255,111,181,.28)'; E(g, x + 9, y + 23, 2.6, 1.5); E(g, x + 23, y + 23, 2.6, 1.5);
      g.fillStyle = '#ffd23f'; g.beginPath();
      for(var i = 0; i < 10; i++){ var r = i % 2 ? .55 : 1.35, a = -Math.PI / 2 + i * Math.PI / 5; g.lineTo(x + 23.6 + Math.cos(a) * r, y + 22.4 + Math.sin(a) * r); }
      g.closePath(); g.fill();
    }
  }

  // Sapatos na ponta das pernas (o pé fica sempre em y+44, correndo ou parado).
  function pes(g, c, x, y){
    var perna = hex(c && c.legcol, '#1c1c30'), claro = luma(perna) < .5,
        cor = claro ? '#f6f1ff' : '#3a2a4a', sola = claro ? '#bfb1e3' : '#1f1528';
    [[8.4, 0], [16.4, 1]].forEach(function(p){
      var sx = x + p[0];
      g.fillStyle = cor; g.beginPath();
      if(g.roundRect) g.roundRect(sx, y + 41.3, 6.2, 3, [1.6, 1.6, .9, .9]); else g.rect(sx, y + 41.3, 6.2, 3);
      g.fill();
      g.fillStyle = sola; g.fillRect(sx + .3, y + 43.6, 5.6, .7);
      g.fillStyle = claro ? '#ff8fc8' : 'rgba(255,255,255,.35)'; g.fillRect(sx + 1.3, y + 42, 3.4, .55);   // cadarço / brilho
    });
  }

  // Parte de baixo trocada de Zipper, Sweet e Estrelado. Devolve true quando desenhou no lugar da peça original.
  // Sem escolha (c.baixo vazio) cada look continua exatamente como era.
  function baixoEspecial(g, c, x, y, roupa, cor, T){
    var b = c && c.baixo;
    if(roupa === 'zipper' && b === 'bermuda'){
      g.fillStyle = cor; g.fillRect(x + 6, y + 31, 18, 8);
      g.fillStyle = 'rgba(40,10,70,.22)'; g.fillRect(x + 14.6, y + 33, .8, 6);
      g.fillStyle = '#fff'; g.fillRect(x + 6, y + 38.2, 18, .9);
      return true;
    }
    if(roupa === 'sweet' && b === 'bermuda'){
      g.fillStyle = cor; g.fillRect(x + 5.5, y + 33, 19, 7.5);
      g.fillStyle = '#fff'; for(var k = 0; k < 5; k++){ g.beginPath(); g.arc(x + 7.4 + k * 3.8, y + 40.5, 1.9, 0, Math.PI); g.fill(); }
      g.fillStyle = 'rgba(40,10,70,.2)'; g.fillRect(x + 14.6, y + 35, .8, 5.5);
      return true;
    }
    if(roupa === 'estrelado' && b === 'saia'){
      var az = (!cor || /^#?f{6}$/i.test(cor)) ? '#3b5bdb' : cor;
      g.fillStyle = az; T([x + 5, y + 31, x + 25, y + 31, x + 28.5, y + 40, x + 1.5, y + 40]);
      g.fillStyle = '#a5d8ff'; g.fillRect(x + 1.8, y + 39, 26.4, 1.2);
      g.fillStyle = '#fff'; for(var i = 0; i < 6; i++){ E(g, x + 4 + i * 4.4, y + 37.2, 1.7, 1.1); E(g, x + 5.2 + i * 4.4, y + 36.7, 1.3, 1); }
      return true;
    }
    return false;
  }

  // Franja arco-íris: faixas dentro de uma franja de bico arredondado (antes era um bloco reto colado na testa).
  function arcoiris(g, x, y){
    var cols = ['#ff6b8b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#b197fc'];
    g.save(); g.beginPath(); g.moveTo(x + 3, y + 4); g.lineTo(x + 27, y + 4); g.lineTo(x + 27, y + 12);
    for(var i = 5; i >= 0; i--) g.quadraticCurveTo(x + 5 + i * 4, y + 16.4, x + 3 + i * 4, y + 12);
    g.closePath(); g.clip();
    cols.forEach(function(cc, k){ g.fillStyle = cc; g.fillRect(x + 3 + k * 4, y + 3, 4.05, 15); });
    g.fillStyle = 'rgba(255,255,255,.28)'; E(g, x + 11, y + 6.5, 6, 1.4, -.15);
    g.restore();
  }
  // Orelha de elfo na cor da pele, maior e com a parte de dentro rosada.
  function elfo(g, c, x, y){
    var pele = hex(c && c.skin, '#f1c9a5');
    [[1, 0], [-1, 30]].forEach(function(m){
      var s = m[0], o = m[1];
      function px(v){ return x + o + s * v; }
      g.fillStyle = pele; g.beginPath(); g.moveTo(px(4.6), y + 14.6); g.lineTo(px(-3.4), y + 9.4); g.lineTo(px(2.6), y + 20.4); g.lineTo(px(5), y + 21); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,120,160,.35)'; g.beginPath(); g.moveTo(px(3.6), y + 15.4); g.lineTo(px(-1.4), y + 11.6); g.lineTo(px(2.9), y + 18.4); g.closePath(); g.fill();
    });
    g.fillStyle = pele;
  }
  root.TWAvatarRosto = { olhos:OLHOS.slice(), bocas:BOCAS.slice(), bochechas:BOCHECHAS.slice(), forma:forma, rosto:rosto, olho:olho, bochecha:bochecha, pes:pes, baixoEspecial:baixoEspecial, arcoiris:arcoiris, elfo:elfo };
})(typeof window !== 'undefined' ? window : this);
