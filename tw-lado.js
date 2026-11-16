/* TsuLiPa⭐World — vista de lado (perfil) do Tsu, da Lirika e do Pati. Protótipo de 16/11/2026.
   Usa a mesma grade do drawChar (cabeça ~0..30 × -6..22, corpo até 44), as mesmas cores do personagem
   (pele, cabelo, olho, tom escuro do cabelo) e passa pelo perfCharContorno, que dá o contorno branco de sempre.
   Desenha virado para a DIREITA; para olhar para a esquerda, espelhe o canvas antes (scale(-1, 1)).
   Só os três visuais fixos do trio: não substitui o boneco dos jogadores. */
(function(){
  'use strict';
  function escuro(hex, d){ return '#' + String(hex || '#333333').replace(/^#/, '').replace(/../g, function(cc){ return ('0' + Math.max(0, parseInt(cc, 16) - d).toString(16)).substr(-2); }); }
  function claro(hex, d){ return '#' + String(hex || '#333333').replace(/^#/, '').replace(/../g, function(cc){ return ('0' + Math.min(255, parseInt(cc, 16) + d).toString(16)).substr(-2); }); }
  function lado(g, c, x, y, expr, t){
    var H = c.hair || '#333', HD = escuro(H, 60), HL = claro(H, 70), S = c.skin || '#f1c9a5', SD = escuro(S, 28), olho = c.eye || '#5a3b2e';
    var pe = Math.sin((t || 0) * .25) * .6;
    function E(cx, cy, rx, ry, r){ g.beginPath(); g.ellipse(cx, cy, rx, ry, r || 0, 0, 7); g.fill(); }
    function R(a, b, w, h, r){ g.beginPath(); g.moveTo(a + r, b); g.arcTo(a + w, b, a + w, b + h, r); g.arcTo(a + w, b + h, a, b + h, r); g.arcTo(a, b + h, a, b, r); g.arcTo(a, b, a + w, b, r); g.closePath(); g.fill(); }
    function P(pts){ g.beginPath(); g.moveTo(pts[0], pts[1]); for(var i = 2; i < pts.length; i += 2) g.lineTo(pts[i], pts[i + 1]); g.closePath(); g.fill(); }
    // --- atrás de tudo: o que fica do lado de lá (coque, orelha de gato e perna mais longe, em tom mais escuro) ---
    if(c.det === 'coques'){ g.fillStyle = HD; E(x + 19, y - 1.5, 4.4, 4.2); g.fillStyle = '#2f6fe0'; E(x + 17.5, y + 2.2, 1.8, 1.1, -.4); }
    if(c.det === 'gato'){ g.fillStyle = HD; P([x + 16, y + .5, x + 21.5, y - 7.5, x + 23.5, y + 2.5]); }
    g.fillStyle = escuro(typeof c.legcol === 'string' && /^#[0-9a-f]{6}$/i.test(c.legcol) ? c.legcol : '#1c1c30', 10);
    g.fillRect(x + 16, y + 36 + pe, 5, 7.6);   // perna de lá
    g.fillStyle = '#e8e2f5'; g.beginPath(); g.ellipse(x + 20.2, y + 44 + pe, 3.6, 1.7, 0, 0, 7); g.fill();
    // cabelo de trás (a massa atrás da cabeça, do lado da nuca)
    g.fillStyle = H;
    if(c.back === 'chanel'){ R(x + 1.4, y + 1, 15, 22.6, 5); }
    else if(c.back === 'pixie'){ P([x + 4, y + 10, x + .5, y + 18, x + 3.5, y + 19, x + 2.5, y + 24, x + 8, y + 20.5, x + 9, y + 13]); }
    else { g.beginPath(); g.moveTo(x + 7, y + 4); g.quadraticCurveTo(x + 1, y + 10, x + 3, y + 19); g.quadraticCurveTo(x + 6, y + 23, x + 11, y + 21); g.lineTo(x + 13, y + 10); g.closePath(); g.fill(); }
    // --- corpo ---
    g.fillStyle = '#2e3566';
    if(c.baixo === 'saia'){ P([x + 7.8, y + 31, x + 22.8, y + 31, x + 25.4, y + 38.5, x + 5.6, y + 38.5]); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(x + 12, y + 32, 1.2, 6); g.fillRect(x + 17, y + 32, 1.2, 6); }
    else { P([x + 7.8, y + 31, x + 22.8, y + 31, x + 23.6, y + 37.5, x + 7.4, y + 37.5]); }
    g.fillStyle = typeof c.legcol === 'string' && /^#[0-9a-f]{6}$/i.test(c.legcol) ? c.legcol : '#1c1c30';
    g.fillRect(x + 10.5, y + (c.baixo === 'saia' ? 38 : 37) - pe, 5.2, 7 + pe);   // perna de cá
    g.fillStyle = '#fff'; g.beginPath(); g.ellipse(x + 14.6, y + 44 - pe, 4, 1.9, 0, 0, 7); g.fill();
    // camisa: frente mais clara, costas na sombra, gravata na beirada da frente
    var cam = g.createLinearGradient(x + 9, 0, x + 22, 0); cam.addColorStop(0, '#dfe6f5'); cam.addColorStop(1, '#ffffff');
    g.fillStyle = cam; g.beginPath(); g.moveTo(x + 8.6, y + 21.5); g.lineTo(x + 21.4, y + 21.5); g.quadraticCurveTo(x + 23.8, y + 26, x + 23, y + 32); g.lineTo(x + 7.6, y + 32); g.quadraticCurveTo(x + 6.8, y + 26, x + 8.6, y + 21.5); g.fill();
    g.fillStyle = '#1b2a5e'; P([x + 21.4, y + 22.5, x + 22.8, y + 22.5, x + 23.1, y + 29.5, x + 21.8, y + 30.8, x + 20.8, y + 29.5]);
    // braço de cá: manga branca + mão
    g.fillStyle = '#f3f0fb'; g.beginPath(); g.ellipse(x + 14.5, y + 24.6, 3.8, 3.8, 0, 0, 7); g.fill();
    g.fillStyle = S; g.beginPath(); g.moveTo(x + 13.2, y + 26.5); g.lineTo(x + 16.3, y + 26.5); g.lineTo(x + 16.8, y + 31.5); g.lineTo(x + 13.6, y + 31.5); g.closePath(); g.fill(); E(x + 15.3, y + 32, 2.1, 1.9);
    // pescoço
    g.fillStyle = SD; g.fillRect(x + 13.6, y + 18.5, 4.4, 4);
    // --- cabeça de perfil: crânio redondo + bochecha/queixo puxados para a frente + narizinho ---
    g.fillStyle = S; R(x + 3.4, y - .6, 22.4, 21.4, 8.6); R(x + 13.5, y + 7.6, 12.8, 13.6, 6.2);
    g.beginPath(); g.moveTo(x + 25.3, y + 11); g.quadraticCurveTo(x + 27.4, y + 13.2, x + 25.4, y + 14.4); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,120,150,.35)'; E(x + 20.5, y + 16.4, 2.6, 1.5);   // bochecha
    // olho (um só, grande, no estilo chibi do jogo)
    var e = +expr || 0;
    if(e === 2 || e === 5 || e === 1){ g.strokeStyle = '#2a1d4a'; g.lineWidth = 1.1; g.beginPath();
      if(e === 1){ g.moveTo(x + 19.4, y + 11.4); g.lineTo(x + 21.6, y + 12.9); g.lineTo(x + 19.4, y + 14.4); }
      else { g.moveTo(x + 18.6, y + 13.2); g.quadraticCurveTo(x + 20.4, y + (e === 5 ? 14.6 : 11.4), x + 22.2, y + 13.2); }
      g.stroke(); if(e === 5){ g.fillStyle = 'rgba(120,190,255,.85)'; E(x + 21.4, y + 15.6, .8, 1.3); } }
    else if(e === 6){ g.fillStyle = '#ff4f9a'; g.beginPath(); g.moveTo(x + 20.4, y + 15.2); g.bezierCurveTo(x + 17.8, y + 13.2, x + 18.4, y + 10.6, x + 20.4, y + 12); g.bezierCurveTo(x + 22.4, y + 10.6, x + 23, y + 13.2, x + 20.4, y + 15.2); g.fill(); }
    else { g.fillStyle = olho; E(x + 20.5, y + 13, 1.85, 2.7); g.fillStyle = '#2a1d4a'; E(x + 20.8, y + 13.4, 1.05, 1.6); g.fillStyle = '#fff'; E(x + 20.1, y + 12, .75, .9); E(x + 21.2, y + 14.4, .35, .4);
      g.strokeStyle = '#2a1d4a'; g.lineWidth = .9; g.beginPath(); g.moveTo(x + 18.6, y + 10.6); g.quadraticCurveTo(x + 20.6, y + 9.8, x + 22.6, y + 10.8); g.stroke(); }
    // boca
    g.strokeStyle = '#7a3b3b'; g.lineWidth = .9; g.beginPath();
    if(e === 4){ g.fillStyle = '#7a3b3b'; E(x + 23.2, y + 18.1, .8, 1); } else { g.moveTo(x + 22.2, y + 17.6); g.quadraticCurveTo(x + 23.3, y + 18.8, x + 24.2, y + 17.6); g.stroke(); }
    // --- cabelo da frente: a capa que cobre o alto da cabeça + a franja na testa ---
    g.fillStyle = H; g.beginPath(); g.moveTo(x + 25.6, y + 9.2);
    g.arcTo(x + 25.6, y - 2.4, x + 14, y - 2.4, 8); g.arcTo(x + 2.4, y - 2.4, x + 2.4, y + 10, 8.6); g.lineTo(x + 2.4, y + 15); g.quadraticCurveTo(x + 3.4, y + 18.6, x + 8, y + 19);
    g.quadraticCurveTo(x + 9.5, y + 13.5, x + 13, y + 11.5);   // costeleta atrás da orelha
    g.quadraticCurveTo(x + 17, y + 9.4, x + 18.5, y + 7.6);
    if(c.front === 'bagunca'){ g.lineTo(x + 20, y + 10.2); g.lineTo(x + 21.4, y + 7.4); g.lineTo(x + 23.2, y + 10.4); g.lineTo(x + 24.2, y + 7.8); }
    else { g.quadraticCurveTo(x + 21.5, y + 10, x + 25.4, y + 9.8); }
    g.closePath(); g.fill();
    // mecha que cai na frente da orelha (dá a sensação de volume)
    g.fillStyle = HD; g.globalAlpha = .7; g.beginPath(); g.moveTo(x + 8.5, y + 9); g.quadraticCurveTo(x + 6.8, y + 14, x + 8, y + 18.5); g.quadraticCurveTo(x + 10, y + 14, x + 11, y + 10); g.closePath(); g.fill(); g.globalAlpha = 1;
    g.fillStyle = SD; g.globalAlpha = .55; E(x + 12.4, y + 14.6, 1.6, 2.2); g.globalAlpha = 1;   // orelha aparecendo embaixo do cabelo
    // brilho do cabelo
    g.strokeStyle = HL; g.globalAlpha = .55; g.lineWidth = 1.3; g.beginPath(); g.arc(x + 13.5, y + 8.5, 8, -2.6, -1.4); g.stroke(); g.globalAlpha = 1;
    // --- o que fica do lado de cá, por cima ---
    if(c.det === 'coques'){ g.fillStyle = H; E(x + 9.4, y - 2.2, 5.2, 5); g.fillStyle = HL; g.globalAlpha = .5; E(x + 8, y - 4, 1.8, 1.1, -.5); g.globalAlpha = 1; g.fillStyle = '#2f6fe0'; E(x + 12.6, y + 1.6, 2, 1.3, -.5); }
    if(c.det === 'gato'){ g.fillStyle = H; P([x + 6, y + 2, x + 8.5, y - 9, x + 14, y - .5]); g.fillStyle = '#ffb3d9'; P([x + 8, y + .6, x + 9.2, y - 5.4, x + 11.8, y - .2]); }
  }
  // Quadro: desenha no canvas x (contexto 2D) em escala ES, com o contorno branco do jogo quando ele existe.
  function desenhar(x, cx, chao, ES, av, t, olhaEsquerda){
    var c = av && av.c ? av.c : av; if(!c) return;
    var tx = cx - 15 * ES, ty = chao - 44 * ES;
    x.save();
    if(olhaEsquerda){ x.translate(cx, 0); x.scale(-1, 1); x.translate(-cx, 0); }
    x.fillStyle = 'rgba(30,10,60,.22)'; x.beginPath(); x.ellipse(cx, chao + 1 * ES, 12 * ES, 2.2 * ES, 0, 0, 7); x.fill();
    if(typeof perfCharContorno === 'function') perfCharContorno(x, tx, ty, ES, function(){ lado(g, c, 0, 0, av.expr, t); });
    else { var og = typeof g !== 'undefined' ? g : null; x.save(); x.translate(tx, ty); x.scale(ES, ES); try{ window.g = x; lado(x, c, 0, 0, av.expr, t); }finally{ if(og) window.g = og; } x.restore(); }
    x.restore();
  }
  window.TW_LADO = {desenhar:desenhar, partes:lado};
})();
