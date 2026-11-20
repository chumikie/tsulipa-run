/* TsuLiPa⭐World — vista de lado (perfil) do Tsu, da Lirika e do Pati. Protótipo de 16/11/2026, revisão 2.
   Copia as medidas do drawChar (já com o translate de -4 da cabeça): crânio centro (15,13) raio 11, topo do cabelo
   centro (15,8) raio 12, franja reta até y 10, olhos de pixel em y 13–18, boca y 20, pescoço 18–24, tronco 22–34,
   pernas 36–44. O olho e a boca são as MESMAS peças do rosto de frente (bloquinhos de pixel, tinta #223).
   Passa pelo perfCharContorno (contorno branco de sempre). Desenha virado para a DIREITA; espelhado olha para a esquerda.
   Só os três visuais fixos do trio: não substitui o boneco dos jogadores. */
(function(){
  'use strict';
  var TINTA = '#223', PUPILA = '#112';
  function escuro(hex, d){ return '#' + String(hex || '#333333').replace(/^#/, '').replace(/../g, function(cc){ return ('0' + Math.max(0, parseInt(cc, 16) - d).toString(16)).substr(-2); }); }
  function claro(hex, d){ return '#' + String(hex || '#333333').replace(/^#/, '').replace(/../g, function(cc){ return ('0' + Math.min(255, parseInt(cc, 16) + d).toString(16)).substr(-2); }); }
  function lado(g, c, x, y, expr, t, run, A){
    var corre = typeof run === 'number', passo = corre ? run : 0;   // 17/11: correndo no Center⭐Run (passada e braço)
    var H = c.hair || '#333', HD = escuro(H, 60), HL = claro(H, 70), S = c.skin || '#f1c9a5', SD = escuro(S, 26);
    var perna = typeof c.legcol === 'string' && /^#[0-9a-f]{6}$/i.test(c.legcol) ? c.legcol : '#1c1c30';
    var sl = c.back === 'chanel' || c.back === 'longo' || c.back === 'onduladof' ? 16.6 : c.back === 'onduladom' || c.back === 'onduladom2' ? 13 : c.back === 'pixie' ? 5 : 10;   // chanel: lateral até a altura do corte da frente   // costeleta: a mesma régua do drawChar
    function E(cx, cy, rx, ry, r){ g.beginPath(); g.ellipse(cx, cy, rx, ry, r || 0, 0, 7); g.fill(); }
    function T(p){ g.beginPath(); g.moveTo(p[0], p[1]); for(var i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); g.fill(); }
    var vt = corre ? -1.6 - Math.sin((t || 0) * .5) * .7 : 0;   // vento da corrida: as pontas vão para trás
    var hg = g.createLinearGradient(0, y + 1, 0, y + 20); hg.addColorStop(0, H); hg.addColorStop(1, HD);
    // ---------- do lado de lá (mais escuro): coque e orelha de gato de trás ----------
    if(c.det === 'coques'){ g.fillStyle = HD; E(x + 20, y - 2, 5.4, 5.4); g.fillStyle = '#1f47b0'; g.save(); g.translate(x + 19.6, y + 2.8); g.rotate(.15); g.fillRect(-3, -1.2, 6, 2.4); g.restore(); }
    if(c.det === 'gato'){ g.fillStyle = HD; T([x + 16, y + 3, x + 21, y - 8, x + 25, y + 3]); }
    // ---------- cabelo de trás (atrás da cabeça, do lado da nuca) ----------
    g.fillStyle = hg;
    if(c.back === 'chanel'){ g.beginPath(); g.moveTo(x + 8, y - 2); g.quadraticCurveTo(x - .8, y + 4, x + 1.2, y + 18); g.lineTo(x + 1.6, y + 24.4); g.lineTo(x + 13, y + 24.4); g.lineTo(x + 13, y + 8); g.closePath(); g.fill(); }   // chanel curto, reto
    else if(c.back === 'pixie'){ T([x + 5, y + 2, x + 1, y + 12, x + 3.6, y + 13, x + 2.4, y + 19, x + 7.5, y + 15.5, x + 9, y + 18.5, x + 11, y + 10]); }
    else if(c.back === 'longo'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1, y + 18); g.quadraticCurveTo(x + .4 + vt * .5, y + 30, x + 2.4 + vt, y + 37); g.quadraticCurveTo(x + 6.4 + vt, y + 39.2, x + 10.5, y + 37); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); }
    else if(c.back === 'onduladof'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1.4, y + 14); g.quadraticCurveTo(x - 1.2 + vt * .3, y + 19, x + 1.2 + vt * .5, y + 23); g.quadraticCurveTo(x - 1 + vt * .7, y + 28, x + 2 + vt, y + 33);
      g.quadraticCurveTo(x + 6 + vt, y + 35.6, x + 10, y + 32); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); }
    else if(c.back === 'onduladom' || c.back === 'onduladom2'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1.4, y + 13); g.quadraticCurveTo(x - .8 + vt * .3, y + 18, x + 1.6 + vt * .5, y + 22.5); g.quadraticCurveTo(x + 5, y + 26, x + 9.5, y + 22); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); }
    else if(c.back === 'cacheado'){ g.fillStyle = HD; E(x + 3 + vt * .4, y + 24, 4.6, 4.6); g.fillStyle = hg; [[6, 2, 7], [2.4, 9.5, 6.4], [2 + vt * .3, 17, 6], [6.5, 21, 5]].forEach(function(p){ E(x + p[0], y + p[1], p[2], p[2]); }); }
    else { g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + 1.5, y + 4, x + 2.6, y + 13.5); g.quadraticCurveTo(x + 4, y + 18.4, x + 8.5, y + 18); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); E(x + 4.5, y + 15.8, 2.2, 2.2); }
    if(c.back === 'rabo'){ var rs = corre ? Math.sin((t || 0) * .5) * 1.2 : 0; g.fillStyle = hg; g.beginPath(); g.moveTo(x + 5, y + .5); g.quadraticCurveTo(x - 5 + vt, y + 2 + rs, x - 5 + vt, y + 14 + rs);
      g.quadraticCurveTo(x - 4.4 + vt, y + 21 + rs, x - 1 + vt, y + 25 + rs); g.quadraticCurveTo(x - .6, y + 14, x + 5.4, y + 7); g.closePath(); g.fill(); g.fillStyle = '#e0457b'; E(x + 4.6, y + 3.4, 1.9, 2.8, -.4); }
    if(c.back === 'marias'){ g.fillStyle = HD; E(x + 1.6 + vt * .4, y + 16, 3.6, 8.6, .32); g.fillStyle = hg; E(x + 3.4 + vt * .5, y + 17, 4.4, 9.8, .24); E(x + 3 + vt * .7, y + 25.4, 3, 6.4, .3); g.fillStyle = '#e0457b'; E(x + 6, y + 8.4, 2.2, 1.7, .5); }
    // ---------- pernas curtas e tênis branco com listra rosa (iguais aos da frente) ----------
    var pe = Math.sin((t || 0) * .25) * .4;
    function tenis(px, py, longe){   // o mesmo tênis da frente visto de lado: cano baixo arredondado e bico redondo
      g.fillStyle = longe ? '#d9d3ea' : '#ffffff'; g.beginPath(); g.moveTo(px + .6, py + 3.1); g.lineTo(px + .4, py + 1.2); g.quadraticCurveTo(px + .6, py, px + 2.2, py);
      g.lineTo(px + 4.4, py); g.quadraticCurveTo(px + 7.6, py + .4, px + 7.8, py + 2.2); g.quadraticCurveTo(px + 7.8, py + 3.1, px + 6.8, py + 3.1); g.closePath(); g.fill();
      g.fillStyle = longe ? '#cfc6e4' : '#ece7f6'; g.fillRect(px + .6, py + 2.6, 7, .55);   // solado
      g.fillStyle = longe ? '#d77aa8' : '#ff6fb5'; g.beginPath(); g.ellipse(px + 3.9, py + 1.35, 2.4, .42, 0, 0, 7); g.fill(); }
    if(corre){   // perna de lá vai para trás quando a de cá vai para a frente
      var pl = -passo * 2.6, sobe = Math.max(0, passo) * 1.4;
      g.fillStyle = escuro(perna, 16); g.fillRect(x + 15.4 + pl, y + 38 - Math.max(0, -passo) * 1.4, 4.6, 4.6); tenis(x + 14.6 + pl, y + 41.4 - Math.max(0, -passo) * 1.4, true);
    } else { g.fillStyle = escuro(perna, 16); g.fillRect(x + 15.4, y + 38 + pe, 4.6, 4.6 - pe); tenis(x + 14.6, y + 41.4, true); }
    // saia ou bermuda: o mesmo cinza-azulado com degradê e pregas da frente
    var sg = g.createLinearGradient(0, y + 33, 0, y + 40); sg.addColorStop(0, '#7d86aa'); sg.addColorStop(1, '#464d70'); g.fillStyle = sg;
    if(c.baixo === 'saia'){ T([x + 7.6, y + 33, x + 22.6, y + 33, x + 25, y + 40, x + 5.4, y + 40]); g.fillStyle = 'rgba(255,255,255,.18)'; [10.4, 14.2, 18].forEach(function(px){ g.fillRect(x + px, y + 34, .8, 5.6); }); }
    else { T([x + 7.6, y + 33, x + 22.6, y + 33, x + 23.4, y + 39, x + 7.2, y + 39]); g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(x + 15, y + 34.5, .8, 4.2); }
    if(corre){ var pf = passo * 2.6, pfy = Math.max(0, passo) * 1.4; g.fillStyle = perna; g.fillRect(x + 10.6 + pf, y + (c.baixo === 'saia' ? 39.6 : 38.6) - pfy, 4.8, 4); tenis(x + 9.8 + pf, y + 41.8 - pfy, false); }
    else { g.fillStyle = perna; g.fillRect(x + 10.6, y + (c.baixo === 'saia' ? 39.6 : 38.6) - pe, 4.8, 4 + pe); tenis(x + 9.8, y + 41.8, false); }
    // camisa: larga como a da frente, branca com sombra embaixo e nas costas; gola e gravata na beirada da frente
    // 17/11: o "Você" no Center⭐Run usa a cor da roupa do avatar (sem gravata quando não é o uniforme)
    var corCam = (c.out && /^#[0-9a-f]{6}$/i.test(c.outcol || '')) ? c.outcol : '#ffffff';
    var cam = g.createLinearGradient(0, y + 21, 0, y + 34); cam.addColorStop(0, corCam); cam.addColorStop(1, corCam === '#ffffff' ? '#e3e7f3' : escuro(corCam, 34));
    g.fillStyle = cam; g.beginPath(); g.moveTo(x + 9.4, y + 23); g.quadraticCurveTo(x + 9.4, y + 21, x + 11.6, y + 21); g.lineTo(x + 19.8, y + 21); g.quadraticCurveTo(x + 22.2, y + 21, x + 22.4, y + 24);
    g.lineTo(x + 23.2, y + 34); g.lineTo(x + 7.6, y + 34); g.closePath(); g.fill();
    g.fillStyle = 'rgba(120,130,170,.18)'; g.beginPath(); g.moveTo(x + 9.4, y + 23); g.lineTo(x + 11.6, y + 23); g.lineTo(x + 10.2, y + 34); g.lineTo(x + 7.6, y + 34); g.closePath(); g.fill();   // costas na sombra
    if(!c.out){ g.fillStyle = '#1b2a5e'; T([x + 20.8, y + 24, x + 22.4, y + 24, x + 22.9, y + 30.4, x + 21.7, y + 31.8, x + 20.6, y + 30.4]);
    g.fillStyle = '#14204a'; T([x + 20.2, y + 21.6, x + 22.6, y + 21.6, x + 22.5, y + 24.2, x + 20.5, y + 24.2]); }
    // ombro arredondado (a mesma faixa de manga da frente, vista de lado) e o braço descendo
    var mg = g.createLinearGradient(0, y + 21, 0, y + 27); mg.addColorStop(0, '#ffffff'); mg.addColorStop(1, '#e8ebf5'); g.fillStyle = mg;
    g.beginPath(); g.ellipse(x + 15.2, y + 24.2, 4.1, 3.3, 0, 0, 7); g.fill();
    var bg = g.createLinearGradient(0, y + 26, 0, y + 34); bg.addColorStop(0, S); bg.addColorStop(1, SD); g.fillStyle = bg;
    if(corre){ g.save(); g.translate(x + 15.2, y + 26); g.rotate(-passo * .55); g.translate(-(x + 15.2), -(y + 26)); }
    g.beginPath(); g.moveTo(x + 13.4, y + 26.4); g.lineTo(x + 17, y + 26.4); g.lineTo(x + 16.9, y + 32.6); g.quadraticCurveTo(x + 15.2, y + 34.4, x + 13.5, y + 32.6); g.closePath(); g.fill();
    if(corre) g.restore();
    // ---------- cabeça: crânio (o mesmo círculo da frente) + bochecha e queixo para a frente + narizinho ----------
    g.fillStyle = S; E(x + 14.6, y + 13, 11, 11); E(x + 18.6, y + 17.2, 7.4, 6.6);   // crânio da frente + bochecha cheia (perfil chibi, sem nariz)
        g.fillStyle = 'rgba(255,120,150,.32)'; E(x + 20.6, y + 18.6, 2.4, 1.3);                   // bochecha
    // olho: a mesma peça de pixel da frente (sobrancelha, íris, pupila, dois brilhos)
    var e = +expr || 0, x0 = x + 19.6;
    if(e === 2 || e === 5 || e === 1){ g.strokeStyle = TINTA; g.lineWidth = 1.5; g.beginPath();
      if(e === 1){ g.moveTo(x0, y + 13.4); g.lineTo(x0 + 2.6, y + 15.4); g.lineTo(x0, y + 17.4); }
      else { g.moveTo(x0 - .4, y + 16.6); g.quadraticCurveTo(x0 + 1.6, y + (e === 5 ? 18.2 : 13.6), x0 + 3.6, y + 16.6); }
      g.stroke(); if(e === 5){ g.fillStyle = 'rgba(120,190,255,.85)'; E(x0 + 2.6, y + 18.6, .8, 1.2); } }
    else if(e === 6){ g.fillStyle = '#ff4f9a'; g.beginPath(); g.moveTo(x0 + 1.5, y + 18); g.bezierCurveTo(x0 - 1.6, y + 15.6, x0 - .4, y + 12.6, x0 + 1.5, y + 14.4); g.bezierCurveTo(x0 + 3.4, y + 12.6, x0 + 4.6, y + 15.6, x0 + 1.5, y + 18); g.fill(); }
    else { g.fillStyle = TINTA; g.fillRect(x0, y + 13, 3, 1); g.fillStyle = c.eye || '#5a3b2e'; g.fillRect(x0, y + 14, 3, 4); g.fillStyle = PUPILA; g.fillRect(x0 + 1, y + 15, 2, 2);
      g.fillStyle = '#fff'; g.fillRect(x0, y + 14, 1, 2); g.fillRect(x0 + 2, y + 17, 1, 1); }
    // boca: o tracinho de sempre (ou o sorrisinho cheio), na beirada do rosto
    g.fillStyle = TINTA;
    if(e === 2 || e === 3 || e === 1 || e === 6){ g.beginPath(); g.moveTo(x + 21, y + 19.6); g.arc(x + 22.2, y + 19.6, 1.8, 0, Math.PI * .85); g.closePath(); g.fill(); }
    else if(e === 4){ E(x + 22.6, y + 20.4, .9, 1.1); }
    else g.fillRect(x + 21.4, y + 20.2, 2.4, 1);
    // ---------- cabelo de cima: a mesma calota (centro 15,8 raio 12) recortada pela franja ----------
    g.fillStyle = hg; g.beginPath(); g.moveTo(x + 26.4, y + 10);
    g.arc(x + 14.6, y + 8, 12, -.17, Math.PI, true);   // da testa, por cima, até a nuca
    var nuca = Math.max(7.5 + sl, c.back === 'chanel' ? 24.4 : 20.5);
    g.lineTo(x + 2.6, y + nuca - 2); g.quadraticCurveTo(x + 3, y + nuca, x + 6, y + nuca); g.lineTo(x + 10.4, y + nuca); g.lineTo(x + 13.4, y + 7.5 + sl); g.quadraticCurveTo(x + 12.4, y + 11.5, x + 13.6, y + 9.6);
    if(c.front === 'bagunca'){   // mechas da Tsu caindo na testa
      g.quadraticCurveTo(x + 13.4, y + 13.8, x + 15.6, y + 15.4); g.quadraticCurveTo(x + 16.4, y + 11, x + 18.8, y + 8.6); g.quadraticCurveTo(x + 20.4, y + 12.6, x + 23.6, y + 13.4); g.quadraticCurveTo(x + 23.8, y + 10.2, x + 26.4, y + 10);
    } else g.lineTo(x + 26.4, y + 10);   // franja reta, na mesma altura da frente
    g.closePath(); g.fill();
    // costeleta de cá: na frente da orelha, na mesma altura das laterais da frente
    if(c.back !== 'chanel'){ g.fillStyle = hg; E(x + 11, y + 7.5 + sl, 2.4, 1.8); }   // ponta arredondada da lateral (como E(x+5,y+12+sl) da frente)
    // sombra da franja na pele e brilho do cabelo
    g.fillStyle = 'rgba(40,10,70,.18)'; g.fillRect(x + 14, y + 10, 12, 1);
    g.strokeStyle = HL; g.globalAlpha = .5; g.lineWidth = 1.3; g.beginPath(); g.arc(x + 14, y + 6, 8.5, -2.5, -1.3); g.stroke(); g.globalAlpha = 1;
    // ---------- do lado de cá, por cima: coque e orelha de gato ----------
    if(c.det === 'coques'){ g.fillStyle = H; E(x + 6.4, y - 1.8, 6, 6); g.fillStyle = HL; g.globalAlpha = .45; E(x + 4.6, y - 4, 2, 1.2, -.5); g.globalAlpha = 1; g.fillStyle = '#2a5bd7'; g.save(); g.translate(x + 7.6, y + 3.6); g.rotate(-.18); g.fillRect(-3.6, -1.4, 7.2, 2.8); g.restore(); }
    if(c.det === 'gato'){ g.fillStyle = H; T([x + 3, y + 5, x + 6, y - 8, x + 13, y]); g.fillStyle = 'rgba(255,150,190,.8)'; T([x + 6, y + 2, x + 7, y - 4, x + 10, y]); }
    if(c.det==='tulipa') CHAPEU.tulipa(g,x,y,E);
    else if(c.hat && CHAPEU[c.hat]) CHAPEU[c.hat](g, x, y, E);
    if(A && ACESSORIO[A]) ACESSORIO[A](g, x, y, E);
  }
  // ---------- chapéus vistos de lado (17/11): cabeça centrada em (14.6, 8), raio 12, olhando para a direita ----------
  function flor(g, E, cx, cy, r, pc, cc){ g.fillStyle = pc; for(var k = 0; k < 5; k++){ var a = k * 1.2566 - 1.57; E(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * .8, r * .8); } g.fillStyle = cc; E(cx, cy, r * .55, r * .55); }
  var CHAPEU = {
    tiara:function(g,x,y,E){
      g.strokeStyle='#b96bf0';g.lineWidth=1.7;g.beginPath();g.arc(x+14,y+7,11,3.55,5.9);g.stroke();
      g.fillStyle='#ffd865';E(x+10,y-4,3.2,2.4);g.fillStyle='#fff3b5';E(x+10,y-5,1.3,3.6);
    },
    tulipa:function(g,x,y,E){
      g.strokeStyle='#57934d';g.lineWidth=1.6;g.beginPath();g.arc(x+14,y+7,11,3.45,5.85);g.stroke();
      [[7,0],[13,-3],[19,-2]].forEach(function(p,i){
        g.fillStyle=i===1?'#ee416e':'#ff80ac';E(x+p[0],y+p[1],2.4,3);
        g.fillStyle='#ffc0d8';E(x+p[0]-.7,y+p[1]-.8,.9,1.6);
      });
    },
    boina:function(g, x, y, E){ g.fillStyle = '#b81f3a'; E(x + 13.6, y + 1, 12.4, 2.8, -.2); g.fillStyle = '#e02a4a'; E(x + 12.6, y - 1, 12.2, 4.8, -.24);
      g.fillStyle = 'rgba(255,255,255,.26)'; E(x + 9, y - 3.4, 4, 1.1, -.3); g.fillStyle = '#2a1a1a'; E(x + 13.4, y - 6, 1, 1.6, -.1); },
    palha:function(g, x, y, E){ g.fillStyle = '#e7bf74'; E(x + 14.6, y + 2.6, 17.4, 2.8, -.08);
      g.fillStyle = '#f7dc9b'; g.beginPath(); g.moveTo(x + 4, y + 2.4); g.quadraticCurveTo(x + 4, y - 7.6, x + 14.6, y - 8); g.quadraticCurveTo(x + 25.2, y - 7.6, x + 25.2, y + 2.4); g.closePath(); g.fill();
      g.fillStyle = '#9b30d9'; g.fillRect(x + 4.2, y - .6, 20.8, 2); g.fillStyle = '#b6ff3b'; g.fillRect(x + 12, y - .6, 3, 2); g.fillStyle = '#4169e1'; g.fillRect(x + 16, y - .6, 3, 2);
      g.fillStyle = '#f9df9d'; E(x + 15.4, y + 2.8, 17, 1.7, -.08); g.fillStyle = 'rgba(255,255,255,.3)'; E(x + 10, y - 5, 3.4, 1, -.3);
      g.fillStyle = '#9b30d9'; E(x + 6.4, y + .4, 1.9, 1.5); g.fillStyle = '#fff3b2'; E(x + 6.4, y + .4, .7, .7); },
    capitao:function(g, x, y, E){ g.fillStyle = '#0b0d15'; g.beginPath(); g.moveTo(x + 3.6, y + 3.4); g.lineTo(x + 1.4, y - 4); g.quadraticCurveTo(x + 14, y - 9.4, x + 26.8, y - 4.6); g.lineTo(x + 25.4, y + 3.4); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.1)'; E(x + 13.6, y - 5.6, 11, 1.8); g.fillStyle = '#e7b94e'; g.fillRect(x + 3.8, y + .6, 21.4, 2.6);
      g.fillStyle = '#16181f'; g.beginPath(); g.moveTo(x + 23, y + 2.6); g.quadraticCurveTo(x + 30, y + 3, x + 31.4, y + 5.6); g.quadraticCurveTo(x + 27, y + 6, x + 22.6, y + 4.6); g.closePath(); g.fill();
      g.fillStyle = '#ffe27a'; E(x + 22.8, y - .6, 1.4, 1.4); },
    fones:function(g, x, y, E){ g.strokeStyle = '#111'; g.lineWidth = 1.6; g.beginPath(); g.arc(x + 13.6, y + 8.6, 13, Math.PI * 1.2, Math.PI * 1.92); g.stroke(); g.fillStyle = '#e02a4a'; E(x + 11.4, y + 12.6, 3.4, 4.6); g.fillStyle = '#ff6f8a'; E(x + 11, y + 11.4, 1.4, 1.8); },
    coala:function(g, x, y, E){ g.fillStyle = '#5b6474'; E(x + 18, y - 4, 4.6, 4.6); g.strokeStyle = '#1e293b'; g.lineWidth = 1.5; g.beginPath(); g.arc(x + 14.6, y + 8, 12.2, Math.PI * 1.15, Math.PI * 1.9); g.stroke();
      g.fillStyle = '#8b95a7'; E(x + 8.6, y - 3.4, 5.6, 5.6); g.fillStyle = '#fbcfe8'; E(x + 8.6, y - 3.4, 2.8, 2.8); g.fillStyle = 'rgba(255,255,255,.5)'; E(x + 7.6, y - 4.8, 1.4, 1.4); g.fillStyle = '#38bdf8'; E(x + 13.6, y - 4.4, 2.2, 1.6); },
    presilhas:function(g, x, y){ g.lineWidth = 1.5; g.strokeStyle = '#ff3d5e'; g.beginPath(); g.moveTo(x + 6, y + 5); g.lineTo(x + 10, y + 9); g.moveTo(x + 10, y + 5); g.lineTo(x + 6, y + 9); g.stroke();
      g.strokeStyle = '#4dd8ff'; g.beginPath(); g.moveTo(x + 8, y + 1.6); g.lineTo(x + 12, y + 5.6); g.moveTo(x + 12, y + 1.6); g.lineTo(x + 8, y + 5.6); g.stroke(); },
    bandaid:function(g, x, y){ g.fillStyle = '#d97706'; g.fillRect(x + 18.6, y + 19.4, 6, 3.4); g.fillStyle = '#fcd34d'; g.fillRect(x + 19, y + 19.8, 5.2, 2.6); g.fillStyle = '#fff'; g.fillRect(x + 20.4, y + 20.3, 2.4, 1.6); }
  };
  // ---------- acessórios de cabelo do lado de cá (os mesmos da frente) ----------
  var ACESSORIO = {
    torrada:function(g,x,y,E){
      g.fillStyle='#b7723d';E(x+23,y+21,4.4,3.3,-.25);
      g.fillStyle='#ffe3a3';E(x+23,y+20.5,3.6,2.5,-.25);
      g.fillStyle='#e9ac58';E(x+22.2,y+20.7,.7,.8);
    },
    laco:function(g, x, y, E){ g.fillStyle = '#2a5bd7'; g.beginPath(); g.moveTo(x + 7, y + 3); g.lineTo(x + 2.6, y - 1); g.lineTo(x + 3, y + 7); g.closePath(); g.fill(); g.beginPath(); g.moveTo(x + 7, y + 3); g.lineTo(x + 11.6, y - 1); g.lineTo(x + 11.2, y + 7); g.closePath(); g.fill(); g.fillStyle = '#173a9a'; E(x + 7, y + 3, 2, 2); },
    estrela:function(g, x, y){ g.fillStyle = '#ffd23f'; g.beginPath(); for(var k = 0; k < 10; k++){ var a = k * Math.PI / 5 - Math.PI / 2, r = k % 2 ? 1.6 : 3.8; g.lineTo(x + 8 + Math.cos(a) * r, y + 4 + Math.sin(a) * r); } g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(x + 7, y + 2.6, 1.2, 1.2); },
    hibisco:function(g, x, y, E){ flor(g, E, x + 8, y + 3, 3.2, '#ff3d5e', '#ffd23f'); },
    sakura:function(g, x, y, E){ flor(g, E, x + 8, y + 3, 3, '#ffc4d8', '#e85a8a'); },
    mic:function(g, x, y, E){ g.fillStyle = '#222'; E(x + 11.4, y + 12.6, 2.6, 3); g.strokeStyle = '#222'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(x + 12.4, y + 14.6); g.quadraticCurveTo(x + 15, y + 21.4, x + 22.4, y + 21.6); g.stroke(); g.fillStyle = '#ff4f9a'; E(x + 23.2, y + 21.4, 1.9, 1.9); }
  };
  // Desenha no canvas x (contexto 2D): cx = meio do boneco, chao = linha dos pés, ES = escala; com o contorno branco do jogo.
  function desenhar(x, cx, chao, ES, av, t, olhaEsquerda){
    var c = av && av.c ? av.c : av; if(!c) return;
    var tx = cx - 15 * ES, ty = chao - 44 * ES;
    x.save();
    if(olhaEsquerda){ x.translate(cx, 0); x.scale(-1, 1); x.translate(-cx, 0); }
    x.fillStyle = 'rgba(30,10,60,.25)'; x.beginPath(); x.ellipse(cx, chao + 2 * ES, 13 * ES, 2.4 * ES, 0, 0, 7); x.fill();
    if(typeof perfCharContorno === 'function') perfCharContorno(x, tx, ty, ES, function(){ lado(g, c, 0, 0, av.expr, t); });
    x.restore();
  }
  // Correndo no Center⭐Run! (17/11): desenha no contexto do jogo, na grade 30×44 em (x, y) como o drawChar,
  // com o contorno de 1 px nas cores do boneco de frente (OUT: branco, ou rosa no Fever / lilás no Ímã).
  var corOff = null, silOff = null;
  function corre(g2, c, x, y, expr, t, run, OUT, A){
    var Q = 3, w = 44 * Q, h = 58 * Q;
    if(!corOff){ corOff = document.createElement('canvas'); corOff.width = w; corOff.height = h; silOff = document.createElement('canvas'); silOff.width = w; silOff.height = h; }
    var o = corOff.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, w, h); o.setTransform(Q, 0, 0, Q, 11 * Q, 10 * Q);
    lado(o, c, 0, 0, expr, t, run, A);
    var s2 = silOff.getContext('2d'); s2.setTransform(1, 0, 0, 1, 0, 0); s2.clearRect(0, 0, w, h); s2.globalCompositeOperation = 'source-over'; s2.drawImage(corOff, 0, 0);
    s2.globalCompositeOperation = 'source-in'; s2.fillStyle = (OUT && OUT[0]) || '#fff'; s2.fillRect(0, 0, w, h); s2.globalCompositeOperation = 'source-over';
    var X = x - 11, Y = y - 10, k;
    for(k = 0; k < 8; k++){ var a = k * Math.PI / 4; g2.drawImage(silOff, X + Math.cos(a) * 1.1, Y + Math.sin(a) * 1.1, 44, 58); }
    g2.drawImage(corOff, X, Y, 44, 58);
  }
  // o Center⭐Run pergunta antes: chapéu ou acessório sem versão de lado continua de frente
  function sabe(c, A){ return (!c || !c.hat || !!CHAPEU[c.hat]) && (!A || !!ACESSORIO[A]); }
  window.TW_LADO = {desenhar:desenhar, partes:lado, corre:corre, sabe:sabe};
})();
