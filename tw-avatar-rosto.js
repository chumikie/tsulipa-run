/* TsuLiPa⭐World — rosto, sapatos e partes de baixo especiais do avatar 2D (14/11/2026).
   Usado pelas três cópias do drawChar (centerrun.js, karaoke-time.html e sora-jump.html),
   na MESMA grade de 30×44 de sempre: nenhum ponto de encaixe muda (chapéus, poses, objetos, fotos).
   - Olhos: c.olho = '' (redondo, padrão novo) | 'brilhante' | 'gatinho' | 'sereno' | 'classico' (o de pixel de antes).
   - Boca desenhada no rosto neutro, no sorriso de olhos fechados e na piscadinha.
   - Sapatos por cima da ponta das pernas (tênis claro com perna escura; sapatilha escura com perna clara).
   - Saia/bermuda também para Zipper, Sweet e Estrelado.
   Coordenadas do rosto já com o translate(0,-4) do drawChar: olhos em x+10..13 / x+18..21, y+17..22; boca em y+24. */
(function(root){
  'use strict';
  var FORMAS = ['', 'brilhante', 'gatinho', 'sereno', 'classico'];
  var TINTA = '#2a1f3d';

  function hex(c, padrao){ return typeof c === 'string' && /^#[0-9a-f]{6}$/i.test(c) ? c : padrao; }
  function mudar(c, n){ return '#' + c.replace(/^#/, '').replace(/../g, function(p){ return ('0' + Math.max(0, Math.min(255, parseInt(p, 16) + n)).toString(16)).substr(-2); }); }
  function luma(c){ var v = parseInt(c.slice(1), 16); return ((v >> 16 & 255) * .299 + (v >> 8 & 255) * .587 + (v & 255) * .114) / 255; }
  function forma(c){ var f = c && c.olho; return FORMAS.indexOf(f) >= 0 ? f : ''; }
  function E(g, cx, cy, rx, ry, r){ g.beginPath(); g.ellipse(cx, cy, rx, ry, r || 0, 0, Math.PI * 2); g.fill(); }

  // Um olho aberto. lado: -1 esquerdo (cx≈11.5), 1 direito (cx≈19.5).
  function olho(g, c, x, y, lado){
    var f = forma(c), cx = x + (lado < 0 ? 11.5 : 19.5), cy = y + 19.9, cor = hex(c.eye, '#5a3b2e');
    var rx = f === 'brilhante' ? 2.15 : 1.85, ry = f === 'brilhante' ? 2.85 : f === 'sereno' ? 2.2 : 2.5;
    g.save();
    if(f === 'gatinho'){   // amêndoa com o canto de fora levantado
      g.beginPath(); g.moveTo(cx - lado * 2.1, cy + .6);
      g.quadraticCurveTo(cx - lado * .4, cy - 3, cx + lado * 2.4, cy - 1.6);
      g.quadraticCurveTo(cx + lado * 1.4, cy + 2.8, cx - lado * 2.1, cy + .6); g.closePath(); g.clip();
    } else if(f === 'sereno'){ g.beginPath(); g.rect(cx - 3, cy - .6, 6, 4); g.clip(); }
    var gr = g.createLinearGradient(0, cy - ry, 0, cy + ry);
    gr.addColorStop(0, mudar(cor, -55)); gr.addColorStop(.55, cor); gr.addColorStop(1, mudar(cor, 45));
    g.fillStyle = gr; E(g, cx, cy, rx, ry);
    g.fillStyle = mudar(cor, -95); E(g, cx, cy + .35, rx * .55, ry * .58);            // pupila
    g.fillStyle = '#fff'; E(g, cx - lado * .1 - .55, cy - ry * .42, rx * .38, ry * .3);   // brilho grande
    E(g, cx + .6, cy + ry * .45, rx * .18, rx * .18);                                   // brilho pequeno
    if(f === 'brilhante'){ g.fillStyle = 'rgba(255,255,255,.9)'; E(g, cx + .75, cy - ry * .35, .38, .38); }
    g.restore();
    // pálpebra / cílios: traço por cima, com pontinha para fora
    g.strokeStyle = TINTA; g.lineCap = 'round'; g.lineWidth = f === 'sereno' ? 1.05 : .95;
    g.beginPath();
    if(f === 'sereno'){ g.moveTo(cx - 2.3, cy - .5); g.quadraticCurveTo(cx, cy - 1.3, cx + 2.3, cy - .5); }
    else if(f === 'gatinho'){ g.moveTo(cx - lado * 2.1, cy + .5); g.quadraticCurveTo(cx - lado * .4, cy - 3.1, cx + lado * 2.5, cy - 1.7); g.lineTo(cx + lado * 3.4, cy - 2.6); }
    else { g.moveTo(cx - lado * (rx + .1), cy - .2); g.quadraticCurveTo(cx, cy - ry - 1.2, cx + lado * (rx + .1), cy - .2); g.lineTo(cx + lado * (rx + .65), cy - .7); }   // de dentro para fora; a pontinha fica no canto de fora
    g.stroke();
  }
  function bocaFechada(g, x, y){
    g.strokeStyle = '#8a3b55'; g.lineWidth = .9; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x + 13.7, y + 24.1); g.quadraticCurveTo(x + 15, y + 25.3, x + 16.3, y + 24.1); g.stroke();
  }
  function bocaAberta(g, x, y){
    g.fillStyle = '#6a2340'; g.beginPath(); g.moveTo(x + 12.6, y + 23); g.quadraticCurveTo(x + 15, y + 23.5, x + 17.4, y + 23);
    g.quadraticCurveTo(x + 17, y + 26.6, x + 15, y + 26.6); g.quadraticCurveTo(x + 13, y + 26.6, x + 12.6, y + 23); g.closePath(); g.fill();
    g.fillStyle = '#ff8fb0'; E(g, x + 15, y + 25.6, 1.5, .85);                          // linguinha
  }
  function olhoFechado(g, x, y, cx){
    g.strokeStyle = TINTA; g.lineWidth = 1.3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(cx - 2, y + 20); g.quadraticCurveTo(cx, y + 17.4, cx + 2, y + 20); g.stroke();
  }
  // Devolve true quando desenhou a expressão (0 neutra, 2 sorriso, 3 piscadinha). As outras ficam como estavam.
  function rosto(g, c, x, y, expr){
    if(forma(c) === 'classico') return false;
    expr = +expr || 0;
    if(expr === 0){ olho(g, c, x, y, -1); olho(g, c, x, y, 1); bocaFechada(g, x, y); return true; }
    if(expr === 2){ olhoFechado(g, x, y, x + 11); olhoFechado(g, x, y, x + 20); bocaAberta(g, x, y); return true; }
    if(expr === 3){ olho(g, c, x, y, -1); olhoFechado(g, x, y, x + 20); bocaAberta(g, x, y); return true; }
    return false;
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
  root.TWAvatarRosto = { formas:FORMAS.slice(), forma:forma, rosto:rosto, olho:olho, pes:pes, baixoEspecial:baixoEspecial, arcoiris:arcoiris, elfo:elfo };
})(typeof window !== 'undefined' ? window : this);
