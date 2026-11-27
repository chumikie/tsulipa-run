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
  // 22/11: looks do Center⭐Run! de lado. U (da corrida) = {of: uniforme de rank 1–5, alien: abdução, px: 'fever'|'ima', faixa};
  // sem U (perfil, folhas), vale a roupa vestida: c.out = 'cr_center' … 'cr_kami', 'cr_alien', 'cr_fever', 'cr_ima', 'cr_mega'.
  var CAM_U = {of1:'#2a3f8a', of2:'#fff0f7', of3:'#1b2a5e', of4:'#1a1426', of5:'#fffdf2', espacial:'#e8f0ff'};
  var COR_FX = {fever:['#ff6fa5', '#ffc2dc', '#ffe14d'], ima:['#b392f0', '#dccdfa', '#ffffff'], mega:['#ff4fa3', '#ffc2dc', '#ffffff']};
  function estrelaL(g, cx, cy, r){ g.beginPath(); for(var k = 0; k < 10; k++){ var rr = k % 2 ? r * .42 : r, a = k * Math.PI / 5 - Math.PI / 2; g[k ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); }
  function lado(g, c, x, y, expr, t, run, A, U){
    var corre = typeof run === 'number', passo = corre ? run : 0;   // 17/11: correndo no Center⭐Run (passada e braço)
    var H = c.hair || '#333', HD = escuro(H, 60), HL = claro(H, 70), S = c.skin || '#f1c9a5', SD = escuro(S, 26);
    var perna = typeof c.legcol === 'string' && /^#[0-9a-f]{6}$/i.test(c.legcol) ? c.legcol : '#1c1c30';
    var sl = c.back === 'chanel' || c.back === 'longo' || c.back === 'onduladof' ? 16.6 : c.back === 'onduladom' || c.back === 'onduladom2' ? 13 : c.back === 'pixie' ? 5 : c.back === 'princesa' ? 16.6 : c.back === 'hime' ? 19 : 10;   // chanel: lateral até a altura do corte da frente   // costeleta: a mesma régua do drawChar
    function E(cx, cy, rx, ry, r){ g.beginPath(); g.ellipse(cx, cy, rx, ry, r || 0, 0, 7); g.fill(); }
    function T(p){ g.beginPath(); g.moveTo(p[0], p[1]); for(var i = 2; i < p.length; i += 2) g.lineTo(p[i], p[i + 1]); g.closePath(); g.fill(); }
    var vt = corre ? -1.6 - Math.sin((t || 0) * .5) * .7 : 0;   // vento da corrida: as pontas vão para trás
    var hg = g.createLinearGradient(0, y + 1, 0, y + 20); hg.addColorStop(0, H); hg.addColorStop(1, HD);
    // ---------- do lado de lá (mais escuro): coque e orelha de gato de trás ----------
    if(c.det === 'coques'){ g.fillStyle = HD; E(x + 20, y - 2, 5.4, 5.4); g.fillStyle = '#1f47b0'; g.save(); g.translate(x + 19.6, y + 2.8); g.rotate(.15); g.fillRect(-3, -1.2, 6, 2.4); g.restore(); }
    if(c.det === 'gato'){ g.fillStyle = HD; T([x + 16, y + 3, x + 21, y - 8, x + 25, y + 3]); }
    if(c.det === 'coelho'){ g.fillStyle = '#e6e2ee'; E(x + 15.6, y - 8.6, 3, 8.4, .12); }   // 22/11: orelha de coelho de lá
    // ---------- cabelo de trás (atrás da cabeça, do lado da nuca) ----------
    g.fillStyle = hg;
    if(c.back === 'chanel'){ g.beginPath(); g.moveTo(x + 8, y - 2); g.quadraticCurveTo(x - .8, y + 4, x + 1.2, y + 18); g.quadraticCurveTo(x-.8,y+23.4,x+3.6,y+25); g.quadraticCurveTo(x+9.4,y+25.7,x+13,y+23.8); g.lineTo(x + 13, y + 8); g.closePath(); g.fill(); }   // chanel curto, reto
    else if(c.back === 'pixie'){ g.beginPath();g.moveTo(x+5,y+2);g.quadraticCurveTo(x+.2,y+6,x+1,y+12);g.lineTo(x+3.6,y+13);g.quadraticCurveTo(x+1.7+vt*.25,y+17,x+2.4+vt*.25,y+19);g.quadraticCurveTo(x+5,y+18.1,x+7.5,y+15.5);g.quadraticCurveTo(x+7.8,y+17.4,x+9.7,y+17);g.lineTo(x+11,y+10);g.closePath();g.fill(); }
    else if(c.back === 'longo'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1, y + 18); g.quadraticCurveTo(x + .4 + vt * .5, y + 30, x + 2.4 + vt, y + 37); g.quadraticCurveTo(x + 6.4 + vt, y + 39.2, x + 10.5, y + 37); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); }
    else if(c.back === 'onduladof'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1.4, y + 14); g.quadraticCurveTo(x - 1.2 + vt * .3, y + 19, x + 1.2 + vt * .5, y + 23); g.quadraticCurveTo(x - 1 + vt * .7, y + 28, x + 2 + vt, y + 33);
      g.quadraticCurveTo(x + 6 + vt, y + 35.6, x + 10, y + 32); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); }
    else if(c.back === 'onduladom' || c.back === 'onduladom2'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1.4, y + 13); g.quadraticCurveTo(x - .8 + vt * .3, y + 18, x + 1.6 + vt * .5, y + 22.5); g.quadraticCurveTo(x + 5, y + 26, x + 9.5, y + 22); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); }
    // 22/11: Princesa e Hime de lado (antes saíam como o Curto)
    else if(c.back === 'princesa'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .5, y + 5, x + 1, y + 16); g.quadraticCurveTo(x - 1.6 + vt * .3, y + 22, x + .8 + vt * .5, y + 27);
      g.quadraticCurveTo(x - 1.4 + vt * .7, y + 32, x + 1.6 + vt, y + 37); g.quadraticCurveTo(x + 4 + vt, y + 41.5, x + 8 + vt * .6, y + 39.4); g.quadraticCurveTo(x + 10.6, y + 37.4, x + 11.4, y + 33.5); g.lineTo(x + 12, y + 9); g.closePath(); g.fill();
      g.fillStyle = HD; E(x + 2.6 + vt, y + 39.2, 2.8, 3.2, .25); g.fillStyle = hg; E(x + 3.2 + vt, y + 38.6, 2.6, 3, .25); }
    else if(c.back === 'hime'){ g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + .6, y + 5, x + .8, y + 16); g.lineTo(x + .4 + vt * .5, y + 39); g.lineTo(x + 12.4 + vt * .3, y + 39); g.lineTo(x + 12.4, y + 9); g.closePath(); g.fill(); }
    else if(c.back === 'cacheado'){ g.fillStyle = HD; E(x + 3 + vt * .4, y + 24, 4.6, 4.6); g.fillStyle = hg; [[6, 2, 7], [2.4, 9.5, 6.4], [2 + vt * .3, 17, 6], [6.5, 21, 5]].forEach(function(p){ E(x + p[0], y + p[1], p[2], p[2]); }); }
    else { g.beginPath(); g.moveTo(x + 7, y - 1); g.quadraticCurveTo(x + 1.5, y + 4, x + 2.6, y + 13.5); g.quadraticCurveTo(x + 4, y + 18.4, x + 8.5, y + 18); g.lineTo(x + 12, y + 9); g.closePath(); g.fill(); E(x + 4.5, y + 15.8, 2.2, 2.2); }
    if(c.back === 'rabo'){ var rs = corre ? Math.sin((t || 0) * .5) * 1.2 : 0; g.fillStyle = hg; g.beginPath(); g.moveTo(x + 5, y + .5); g.quadraticCurveTo(x - 5 + vt, y + 2 + rs, x - 5 + vt, y + 14 + rs);
      g.quadraticCurveTo(x - 4.4 + vt, y + 21 + rs, x - 1 + vt, y + 25 + rs); g.quadraticCurveTo(x - .6, y + 14, x + 5.4, y + 7); g.closePath(); g.fill(); g.fillStyle = '#e0457b'; E(x + 4.6, y + 3.4, 1.9, 2.8, -.4); }
    if(c.back === 'lateral'){ var ls = corre ? Math.sin((t || 0) * .5) * 1 : 0; g.fillStyle = hg; g.beginPath(); g.moveTo(x + 6.4, y + 3);
      g.quadraticCurveTo(x - 4 + vt, y + 8 + ls, x - 3 + vt, y + 20 + ls); g.quadraticCurveTo(x - 2 + vt, y + 29 + ls, x + 2 + vt * .6, y + 34 + ls); g.quadraticCurveTo(x + .4, y + 22, x + 6.6, y + 10); g.closePath(); g.fill();
      g.fillStyle = 'rgba(255,255,255,.16)'; g.beginPath(); g.moveTo(x + 3, y + 6); g.quadraticCurveTo(x - 2.4 + vt, y + 11, x - 1.6 + vt, y + 21); g.quadraticCurveTo(x - 1 + vt * .5, y + 12, x + 4, y + 7); g.fill();
      g.fillStyle = '#ff6fb5'; E(x + 5.4, y + 4.6, 2.6, 2.1, -.5); g.fillStyle = '#ffc2dc'; E(x + 4.9, y + 4.1, .9, .7); }
    if(c.back === 'marias'){ g.fillStyle = HD; E(x + 1.6 + vt * .4, y + 16, 3.6, 8.6, .32); g.fillStyle = hg; E(x + 3.4 + vt * .5, y + 17, 4.4, 9.8, .24); E(x + 3 + vt * .7, y + 25.4, 3, 6.4, .3); g.fillStyle = '#e0457b'; E(x + 6, y + 8.4, 2.2, 1.7, .5); }
    // ---------- look do Center⭐Run!: qual uniforme vale agora (a abdução vence o rank, o rank vence a roupa vestida) ----------
    U = U || {};
    var CRo = typeof TWAvatarRoupa !== 'undefined' && TWAvatarRoupa.cr ? TWAvatarRoupa.cr(c.out) : null;
    var ALV = !!U.alien || (!U.of && !!(CRo && CRo.alien)), OFL = ALV ? 0 : (U.of || (CRo && CRo.of) || 0), FXL = !ALV && !OFL && CRo && CRo.fx ? CRo.fx : '';
    var UC = U.px === 'fever' ? ['#ff6fa5', '#ffc2dc'] : U.px === 'ima' ? ['#b392f0', '#dccdfa'] : null;   // Fever e Ímã tingem o uniforme de rank, como de frente
    var bal = corre ? Math.sin((t || 0) * .5) : 0;
    if(OFL === 3){   // capa vermelha do Capitão, presa no ombro e voando para trás
      g.fillStyle = '#7d1228'; T([x + 9.8, y + 21.6, x + .4 + vt * 1.6 + bal, y + 41.6, x + 6 + vt, y + 42.4, x + 11.6, y + 30]);
      g.fillStyle = '#b01e3a'; T([x + 10.6, y + 21.4, x + 2.4 + vt * 1.4 + bal, y + 41, x + 11.4, y + 39.6]); }
    if(OFL === 5){   // asas da Kami-Oshi nas costas (a de lá mais escura), batendo devagar
      var bt = corre ? Math.sin((t || 0) * .3) * .12 : 0;
      g.fillStyle = 'rgba(232,224,200,.9)'; E(x + 6.4, y + 22.6, 4.4, 11.4, -.78 + bt);
      g.fillStyle = 'rgba(255,252,235,.97)'; E(x + 3.6, y + 25.6, 5, 13, -.62 - bt); g.fillStyle = 'rgba(255,226,140,.82)'; E(x + 4.8, y + 27.4, 3, 9, -.62 - bt);
      g.fillStyle = 'rgba(255,255,255,.7)'; E(x + 1, y + 20.6, 1.6, 4.4, -.62 - bt); }
    // ---------- pernas curtas e tênis branco com listra rosa (iguais aos da frente) ----------
    var pe = Math.sin((t || 0) * .25) * .4;
    function tenis(px, py, longe){   // o mesmo tênis da frente visto de lado: cano baixo arredondado e bico redondo
      g.fillStyle = longe ? '#d9d3ea' : '#ffffff'; g.beginPath(); g.moveTo(px + .6, py + 3.1); g.lineTo(px + .4, py + 1.2); g.quadraticCurveTo(px + .6, py, px + 2.2, py);
      g.lineTo(px + 4.4, py); g.quadraticCurveTo(px + 7.6, py + .4, px + 7.8, py + 2.2); g.quadraticCurveTo(px + 7.8, py + 3.1, px + 6.8, py + 3.1); g.closePath(); g.fill();
      g.fillStyle = longe ? '#cfc6e4' : '#ece7f6'; g.fillRect(px + .6, py + 2.6, 7, .55);   // solado
      g.fillStyle = longe ? '#d77aa8' : '#ff6fb5'; g.beginPath(); g.ellipse(px + 3.9, py + 1.35, 2.4, .42, 0, 0, 7); g.fill(); }
    // Coxa e canela articuladas entre quadril, joelho e tornozelo. A sola preserva a linha anterior.
    var amplitude=c.n==='Tsu'?2.9:c.n==='Lirika'?2.2:c.n==='Pati'?2.7:2.6;
    function pernaArticulada(hx,ax,ay,largura,cor,topo){
      topo=topo||y+36;
      g.save();g.beginPath();g.rect(x-8,topo,46,Math.max(0,y+45-topo));g.clip();
      var jx=(hx+ax)*.5+(corre?(ax-hx)*.22:0),jy=(y+36+ay)*.5;
      g.fillStyle=cor;g.beginPath();g.moveTo(hx-largura*.53,y+36);
      g.quadraticCurveTo(jx-largura*.62,jy,ax-largura*.45,ay);
      g.lineTo(ax+largura*.45,ay);
      g.quadraticCurveTo(jx+largura*.52,jy,hx+largura*.53,y+36);
      g.closePath();g.fill();g.restore();
    }
    var pl=corre?-passo*amplitude:0,levantou=corre?Math.max(0,-passo)*1.4:0;
    pernaArticulada(x+17.7,x+17.7+pl,y+42.6-levantou,4.6,escuro(perna,16));
    tenis(x+14.6+pl,y+41.4-levantou,true);
    // 22/11: cada roupa com a sua parte de baixo e as suas cores (antes todas viravam a mesma camiseta lisa e saia cinza)
    var RP = ALV ? 'espacial' : OFL ? 'of' + OFL : FXL ? 'cr_' + FXL : (c.out || ''), corR = /^#[0-9a-f]{6}$/i.test(c.outcol || '') ? c.outcol : '#ffffff', az = /^#?f{6}$/i.test(corR) ? '#3b5bdb' : corR;
    var AC1 = c.img || H, AC2 = escuro(AC1, 70), KF = FXL ? COR_FX[FXL] : null;   // macacão espacial: Tsu roxo, Lirika verde, Pati azul, Você = cor do cabelo
    function vestidoLongo(){   // Solo Center e Kami-Oshi: vestido até o joelho, por cima da perna de cá (de frente ele também cobre as pernas)
      var k5 = RP === 'of5', fim = k5 ? 42 : 40;
      g.fillStyle = UC ? UC[0] : k5 ? '#fffdf2' : '#fff0f7'; T([x + 7.6, y + 30, x + 22.8, y + 30, x + (k5 ? 27.2 : 26.2), y + fim, x + (k5 ? 3.4 : 4.4), y + fim]);
      g.fillStyle = 'rgba(120,100,150,.12)'; T([x + 7.6, y + 30, x + 10.6, y + 30, x + (k5 ? 7 : 7.6), y + fim, x + (k5 ? 3.4 : 4.4), y + fim]);
      g.fillStyle = '#ffd23f';
      if(k5){ g.fillRect(x + 3.4, y + 40.4, 23.8, 1.6); T([x + 20.8, y + 30, x + 22.6, y + 30, x + 26, y + 40.4, x + 24, y + 40.4]); }
      var bri = .45 + .45 * Math.sin((t || 0) * .2); g.fillStyle = k5 ? 'rgba(255,226,140,' + bri + ')' : 'rgba(255,230,120,' + bri + ')';
      g.fillRect(x + 9, y + 36, 1.6, 1.6); g.fillRect(x + 15.6, y + 38.2, 1.6, 1.6); g.fillRect(x + 20.4, y + 34.6, 1.6, 1.6); }
    var BX = {'':['#7d86aa', '#464d70'], seifuku:['#2e4183', '#1b2a5e'], y2k:['#34304a', '#1d1b29'], citypop:['#f6eedb', '#d8caa8']};
    if(RP === 'of1' || RP === 'of4'){   // Center (marinho, barra branca) e Eternal Ace (preto, barra dourada): saia evasê
      g.fillStyle = UC ? UC[1] : RP === 'of1' ? '#2a3f8a' : '#1a1426'; T([x + 7.4, y + 31, x + 22.8, y + 31, x + 25.8, y + 39, x + 5.2, y + 39]);
      g.fillStyle = 'rgba(255,255,255,.14)'; [10.4, 14.4, 18.4].forEach(function(px){ g.fillRect(x + px, y + 32.6, .8, 5.6); });
      g.fillStyle = RP === 'of1' ? '#ffffff' : '#ffd23f'; g.fillRect(x + 5.2, y + 37.8, 20.6, RP === 'of1' ? 1.2 : 1.6); }
    else if(RP === 'of2' || RP === 'of5'){}   // o vestido vem depois da perna de cá
    else if(RP === 'of3'){   // Capitão: saia marinho curta com barra dourada
      g.fillStyle = UC ? UC[1] : '#1b2a5e'; T([x + 7.6, y + 32, x + 22.6, y + 32, x + 23.4, y + 38, x + 7.2, y + 38]); g.fillStyle = '#ffd23f'; g.fillRect(x + 7.2, y + 36.8, 16.2, 1.4); }
    else if(RP === 'espacial'){   // shortinho cinza-claro do macacão, com a faixa lateral escura
      g.fillStyle = '#dfe6f5'; T([x + 7.6, y + 32, x + 22.6, y + 32, x + 23, y + 38.4, x + 7.2, y + 38.4]); g.fillStyle = AC2; g.fillRect(x + 14.4, y + 32, 1.6, 6.4); }
    else if(KF){   // Fever, Ímã e Mega: saia rodada clarinha com pregas e barra
      g.fillStyle = KF[1]; T([x + 7, y + 32, x + 23, y + 32, x + 25.8, y + 40, x + 4.4, y + 40]); g.fillStyle = 'rgba(255,255,255,.55)'; [10, 14, 18].forEach(function(px){ g.fillRect(x + px, y + 33.6, .7, 5.2); });
      g.fillStyle = FXL === 'ima' ? '#7b3ff0' : '#ffffff'; g.fillRect(x + 4.4, y + 38.8, 21.4, 1.2); }
    else if((RP==='zipper'||RP==='sweet')&&c.baixo==='bermuda'){
      g.fillStyle=corR;var bTop=RP==='zipper'?31:33,bEnd=RP==='zipper'?39:40.5;
      g.beginPath();g.moveTo(x+7.4,y+bTop);g.lineTo(x+22.8,y+bTop);g.quadraticCurveTo(x+24,y+bEnd-2,x+22.8,y+bEnd);
      g.lineTo(x+16,y+bEnd);g.lineTo(x+15,y+bEnd-2.5);g.lineTo(x+14,y+bEnd);g.lineTo(x+7,y+bEnd);
      g.quadraticCurveTo(x+6,y+bEnd-2,x+7.4,y+bTop);g.closePath();g.fill();
      g.fillStyle='#fff';if(RP==='sweet'){for(var cb=0;cb<5;cb++){g.beginPath();g.arc(x+8+cb*3.3,y+bEnd,1.65,0,Math.PI);g.fill();}}
      else g.fillRect(x+7.3,y+bEnd-.8,15.4,.8);
    }
    else if(RP === 'estrelado'){   // polainas listradas por cima da perna de cá e bermuda balonê com nuvenzinhas
      g.fillStyle = az; var estSaia=c.baixo==='saia',estB=estSaia?40:38,estL=estSaia?3.4:6,estR=estSaia?26.6:24.6;
      T([x+7.2,y+31,x+23,y+31,x+estR,y+estB,x+estL,y+estB]);g.fillStyle='#a5d8ff';g.fillRect(x+estL,y+estB-.8,estR-estL,1.1);
      g.fillStyle = '#fff'; for(var nv = 0; nv < 4; nv++){ E(x + 8.4 + nv * 4.4, y + 35.3, 1.6, 1); E(x + 9.6 + nv * 4.4, y + 34.8, 1.2, .9); } }
    else if(RP === 'sweet'){   // saia rodada com babado de chantilly
      g.fillStyle = corR; T([x + 7, y + 33, x + 23.2, y + 33, x + 27, y + 42, x + 3.4, y + 42]);
      g.fillStyle = 'rgba(0,0,0,.12)'; T([x + 7, y + 33, x + 10, y + 33, x + 6.4, y + 42, x + 3.4, y + 42]);
      g.fillStyle = '#ffffff'; T([x + 3.8, y + 40.6, x + 26.6, y + 40.6, x + 27.4, y + 42.4, x + 3, y + 42.4]); for(var cq = 0; cq < 7; cq++){ g.beginPath(); g.arc(x + 4.4 + cq * 3.8, y + 42.4, 1.7, 0, Math.PI); g.fill(); } }
    else if(RP === 'zipper'){   // shortinho branco bufante e a aba da saia caindo para trás
      g.fillStyle = '#ffffff'; T([x + 7.4, y + 31, x + 22.8, y + 31, x + 23.6, y + 37.4, x + 6.8, y + 37.4]); g.fillStyle = 'rgba(120,130,170,.22)'; g.fillRect(x + 7, y + 36.4, 16.6, 1);
      g.fillStyle = corR; T([x + 7.4, y + 30, x + 12.4, y + 30, x + 4.6, y + 41.6]); g.fillStyle = 'rgba(0,0,0,.14)'; T([x + 7.4, y + 30, x + 8.6, y + 30, x + 4.6, y + 41.6]); }
    else {   // saia ou bermuda: o degradê e as pregas da frente, na cor da roupa (Seifuku marinho, Cheeky preto, City Pop bege)
      var bx = BX[RP] || BX[''], sg = g.createLinearGradient(0, y + 33, 0, y + 40); sg.addColorStop(0, bx[0]); sg.addColorStop(1, bx[1]); g.fillStyle = sg;
      var pr = RP === 'citypop' ? 'rgba(150,120,70,.28)' : 'rgba(255,255,255,.18)';
      if(c.baixo === 'saia'){g.beginPath();g.moveTo(x+7.6,y+32);g.lineTo(x+22.6,y+32);
        g.quadraticCurveTo(x+23,y+36,x+25,y+39.5);g.quadraticCurveTo(x+15,y+40.5,x+5.4,y+39.5);
        g.quadraticCurveTo(x+7,y+36,x+7.6,y+32);g.closePath();g.fill();
        g.fillStyle=pr;[10.4,14.2,18].forEach(function(px){g.beginPath();g.moveTo(x+px,y+34);g.quadraticCurveTo(x+px-.3,y+36,x+px+(px-15)*.14,y+39.4);g.lineTo(x+px+.8+(px-15)*.14,y+39.4);g.closePath();g.fill();}); }
      else {g.beginPath();g.moveTo(x+7.6,y+32);g.lineTo(x+22.6,y+32);
        g.quadraticCurveTo(x+24,y+36,x+23.4,y+39.5);g.lineTo(x+16,y+39.5);g.lineTo(x+15,y+36.4);
        g.lineTo(x+14,y+39.5);g.lineTo(x+7.2,y+39.5);g.quadraticCurveTo(x+6.7,y+36,x+7.6,y+32);g.closePath();g.fill();
        g.fillStyle=pr;g.fillRect(x+15,y+34.5,.8,2.3); } }
    var pf=corre?passo*amplitude:0,pfy=corre?Math.max(0,passo)*1.4:0;
    pernaArticulada(x+13,x+13+pf,y+42.6-pfy,4.8,perna,y+(c.baixo==='saia'?39.6:38.6)-pfy);
    tenis(x+9.8+pf,y+41.8-pfy,false);
    if(RP === 'of2' || RP === 'of5') vestidoLongo();
    if(RP === 'estrelado' && !corre){ g.fillStyle = '#ff9ccd'; g.fillRect(x + 10.6, y + 38.4, 4.8, 3.6); g.fillStyle = '#ffe14d'; g.fillRect(x + 10.6, y + 39.4, 4.8, .8); g.fillStyle = '#4dd8ff'; g.fillRect(x + 10.6, y + 40.8, 4.8, .7); }
    // camisa: larga como a da frente, branca com sombra embaixo e nas costas; gola e gravata na beirada da frente
    // 17/11: o "Você" no Center⭐Run usa a cor da roupa do avatar (sem gravata quando não é o uniforme)
    // a mesma cor da frente: corDaRoupa = outcol ou branco (o Trainee também usa a cor escolhida); Zipper tem top branco
    var corCam = RP === 'zipper' ? '#ffffff' : RP === 'estrelado' ? az : CAM_U[RP] ? (UC && RP !== 'espacial' ? UC[0] : CAM_U[RP]) : KF ? KF[0] : corR;
    var cam = g.createLinearGradient(0, y + 21, 0, y + 34); cam.addColorStop(0, corCam); cam.addColorStop(1, corCam === '#ffffff' ? '#e3e7f3' : escuro(corCam, 34));
    // A lateral usa a assinatura do mesmo tronco frontal; os ombros e a gola ficam na régua original.
    var ass=typeof TWAvatarRoupa!=='undefined'&&TWAvatarRoupa.assinatura?TWAvatarRoupa.assinatura(c):null;
    var cintura=ass?(ass.cintura-7.2)*.52:0, assim=ass?ass.assim:0;
    g.fillStyle = cam; g.beginPath(); g.moveTo(x + 9.4, y + 23); g.quadraticCurveTo(x + 9.4, y + 21, x + 11.6, y + 21); g.lineTo(x + 19.8, y + 21); g.quadraticCurveTo(x + 22.2, y + 21, x + 22.4, y + 24);
    g.quadraticCurveTo(x+23.7,y+27,x+22.1-cintura,y+30);
    g.quadraticCurveTo(x+22.3-cintura,y+32,x+23.2,y+33.6-assim);
    g.quadraticCurveTo(x+15.4,y+34.5,x+7.6,y+33.6+assim);
    g.quadraticCurveTo(x+9.3+cintura,y+30,x+9.4,y+23);g.closePath();g.fill();
    g.fillStyle = 'rgba(120,130,170,.18)'; g.beginPath(); g.moveTo(x + 9.4, y + 23); g.lineTo(x + 11.6, y + 23); g.lineTo(x + 10.2, y + 34); g.lineTo(x + 7.6, y + 34); g.closePath(); g.fill();   // costas na sombra
    if(RP === ''){ g.fillStyle = '#1b2a5e'; T([x + 20.8, y + 24, x + 22.4, y + 24, x + 22.9, y + 30.4, x + 21.7, y + 31.8, x + 20.6, y + 30.4]);
    g.fillStyle = '#14204a'; T([x + 20.2, y + 21.6, x + 22.6, y + 21.6, x + 22.5, y + 24.2, x + 20.5, y + 24.2]); }
    else if(RP === 'of1'){   // Center: gola de marinheiro branca (aba nas costas e V na frente) e laço vermelho
      g.fillStyle = '#ffffff'; T([x + 9.6, y + 21, x + 14.8, y + 21, x + 14, y + 26.8, x + 9.2, y + 26.8]); T([x + 16.4, y + 21, x + 22.4, y + 21.4, x + 22.6, y + 29]);
      g.fillStyle = UC ? UC[0] : '#2a3f8a'; T([x + 18.6, y + 21, x + 22.4, y + 21.4, x + 22.5, y + 25.4]);
      g.fillStyle = '#e02a4a'; E(x + 22, y + 28.4, 1.7, 1.7); T([x + 22, y + 28.4, x + 20.4, y + 32.4, x + 21.6, y + 32.8]); T([x + 22, y + 28.4, x + 23.4, y + 32, x + 22.6, y + 32.6]); }
    else if(RP === 'of2'){   // Solo Center: debrum e cinto dourados e laço rosa na frente
      g.fillStyle = '#ffd23f'; T([x + 9.6, y + 21, x + 22.4, y + 21.2, x + 22.5, y + 22.6, x + 9.4, y + 22.6]); T([x + 7.8, y + 30.4, x + 23.1, y + 30.4, x + 23.2, y + 32, x + 7.7, y + 32]);
      g.fillStyle = '#ff4f9a'; T([x + 22.4, y + 25.8, x + 19.2, y + 23.2, x + 19.2, y + 28.4]); E(x + 22, y + 25.8, 1.5, 1.5); }
    else if(RP === 'of3'){   // Capitão: casaca marinho, V branco e botões dourados
      g.fillStyle = '#ffffff'; T([x + 19.2, y + 21, x + 22.4, y + 21.4, x + 22.4, y + 26.4]);
      g.fillStyle = '#ffd23f'; E(x + 21.4, y + 28.4, .8, .8); E(x + 21.6, y + 30.6, .8, .8); E(x + 21.8, y + 32.8, .8, .8); }
    else if(RP === 'of4'){   // Eternal Ace: preto com a faixa dourada, V branco e a joia vermelha
      g.fillStyle = '#ffd23f'; T([x + 20.6, y + 21.2, x + 22.4, y + 21.4, x + 23.1, y + 34, x + 21.2, y + 34]);
      g.fillStyle = '#ffffff'; T([x + 19.6, y + 21, x + 22.4, y + 21.4, x + 22.3, y + 24.8]); g.fillStyle = '#ff3d5e'; E(x + 21.9, y + 28.8, 1.4, 1.4); }
    else if(RP === 'of5'){   // Kami-Oshi: a faixa dourada desce do peito pelo vestido
      g.fillStyle = '#ffd23f'; T([x + 20.8, y + 21.2, x + 22.4, y + 21.4, x + 22.9, y + 30.4, x + 21, y + 30.4]); }
    else if(RP === 'espacial'){   // macacão: lateral escura, gola, cinto e painel na cor da Idol
      g.fillStyle = AC2; T([x + 9.4, y + 23, x + 11.8, y + 22, x + 10.6, y + 34, x + 7.6, y + 34]);
      g.fillStyle = AC1; T([x + 11.6, y + 20.4, x + 21.6, y + 20.6, x + 21.8, y + 22.4, x + 11.6, y + 22.4]); T([x + 7.9, y + 30, x + 23, y + 30, x + 23.1, y + 32, x + 7.8, y + 32]);
      g.fillRect(x + 19.2, y + 24, 3.4, 4); g.fillStyle = '#ffffff'; g.fillRect(x + 20.4, y + 25.2, 1.4, 1.4); }
    else if(FXL === 'fever'){   // estrela amarela no peito e chaminhas na barra da blusa
      g.fillStyle = KF[2]; estrelaL(g, x + 20, y + 27.2, 2.7); g.fillStyle = '#ffd23f'; [9, 13, 17].forEach(function(px){ T([x + px, y + 34, x + px + 1.4, y + 31.6, x + px + 2.8, y + 34]); }); }
    else if(FXL === 'ima'){   // ímã em U (pontas brancas) e uma estrelinha sendo puxada
      g.fillStyle = '#ff3d5e'; g.fillRect(x + 18.4, y + 24.6, 1.5, 3.8); g.fillRect(x + 21.1, y + 24.6, 1.5, 3.8); g.fillRect(x + 18.4, y + 27.2, 4.2, 1.5);
      g.fillStyle = '#ffffff'; g.fillRect(x + 18.4, y + 24.6, 1.5, 1); g.fillRect(x + 21.1, y + 24.6, 1.5, 1); g.fillStyle = '#ffe14d'; estrelaL(g, x + 13.4, y + 24.4, 1.4); }
    else if(FXL === 'mega'){   // coração branco e cinto dourado
      g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(x + 20.2, y + 29.6); g.bezierCurveTo(x + 17.4, y + 27.4, x + 18.6, y + 24.4, x + 20.2, y + 25.8); g.bezierCurveTo(x + 21.8, y + 24.4, x + 23, y + 27.4, x + 20.2, y + 29.6); g.fill();
      g.fillStyle = '#ffd23f'; T([x + 7.8, y + 32, x + 23.1, y + 32, x + 23.2, y + 33.6, x + 7.7, y + 33.6]); }
    else if(RP === 'seifuku'){   // gola de marinheiro: aba quadrada nas costas e o V na frente, com o lenço vermelho
      g.fillStyle = '#1b2a5e'; T([x + 9.6, y + 21, x + 14.4, y + 21, x + 13.6, y + 26.4, x + 9.2, y + 26.4]); g.fillStyle = '#ffffff'; g.fillRect(x + 9.4, y + 25.2, 4.2, .6);
      g.fillStyle = '#1b2a5e'; T([x + 18.6, y + 21, x + 22.4, y + 21.4, x + 22.6, y + 25.6]);
      g.fillStyle = '#e02a4a'; E(x + 22, y + 25.8, 1.5, 1.5); T([x + 22, y + 25.8, x + 20.6, y + 30, x + 21.8, y + 30.4]); T([x + 22, y + 25.8, x + 23.2, y + 29.6, x + 22.4, y + 30.2]); }
    else if(RP === 'y2k'){   // blazer aberto na cor da roupa; top preto e a barriguinha aparecendo na frente
      g.fillStyle = '#111'; T([x + 15.6, y + 21, x + 22.2, y + 21.6, x + 22.6, y + 27.2, x + 15.6, y + 27.2]);
      g.fillStyle = S; T([x + 15.6, y + 27.2, x + 22.6, y + 27.2, x + 22.9, y + 31.4, x + 15.6, y + 31.4]); g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x + 15.6, y + 31, 7.3, .6); }
    else if(RP === 'citypop'){   // paletó na cor da roupa, camisa preta por dentro com gola verde e barra branca
      g.fillStyle = '#111827'; T([x + 18.6, y + 21.4, x + 22.4, y + 22, x + 23.1, y + 33.4, x + 18.6, y + 33.4]); g.fillStyle = '#ffffff'; g.fillRect(x + 18.6, y + 32, 4.4, 1.6);
      g.fillStyle = '#34d399'; T([x + 17.6, y + 21, x + 22.4, y + 21.4, x + 22.6, y + 24.2, x + 18, y + 24.6]); g.fillStyle = '#fbbf24'; g.fillRect(x + 20.6, y + 28, 1.6, 1.6); }
    else if(RP === 'zipper'){   // corset com cadarço em X na frente e cintura alta na cor da roupa
      g.strokeStyle = '#222'; g.lineWidth = .6; g.beginPath(); g.moveTo(x + 20.2, y + 23.4); g.lineTo(x + 22, y + 25.4); g.moveTo(x + 22, y + 23.4); g.lineTo(x + 20.2, y + 25.4);
      g.moveTo(x + 20.4, y + 26.2); g.lineTo(x + 22.2, y + 28.2); g.moveTo(x + 22.2, y + 26.2); g.lineTo(x + 20.4, y + 28.2); g.stroke();
      g.fillStyle = corR; T([x + 8, y + 29, x + 22.8, y + 29, x + 23, y + 32, x + 7.8, y + 32]); }
    else if(RP === 'sweet'){   // avental branco na frente, com alça e o coração vermelho
      g.fillStyle = '#ffffff'; T([x + 15.6, y + 23, x + 22.4, y + 23.4, x + 23, y + 34, x + 15.6, y + 34]); g.fillStyle = corR; g.fillRect(x + 15.6, y + 23, 1.6, 4.6);
      g.fillStyle = '#ff2a4d'; g.fillRect(x + 19.4, y + 26.4, 1.4, 1.4); g.fillRect(x + 21, y + 26.4, 1.4, 1.4); g.fillRect(x + 19, y + 27.8, 3.8, 1.4); g.fillRect(x + 19.6, y + 29.2, 2.6, 1.2); }
    else if(RP === 'estrelado'){   // jaqueta com a faixa arco-íris, gola branca, laço rosa e a estrela no peito
      ['#ff6fb5', '#ffe14d', '#4dd8ff'].forEach(function(cc, j){ g.fillStyle = cc; T([x + 8, y + 28.4 + j * 1.4, x + 22.9, y + 26.6 + j * 1.4, x + 23, y + 27.9 + j * 1.4, x + 7.9, y + 29.7 + j * 1.4]); });
      g.fillStyle = '#fff'; T([x + 17.4, y + 21, x + 22.4, y + 21.4, x + 20.4, y + 24]); g.fillStyle = '#ff4f9a'; T([x + 22.2, y + 22.6, x + 19.6, y + 21, x + 19.6, y + 24.4]); g.fillStyle = '#ffd0e6'; E(x + 22, y + 22.6, 1, 1);
      g.fillStyle = '#ffe14d'; g.beginPath(); for(var st = 0; st < 10; st++){ var rr = st % 2 ? .9 : 2, an = st * Math.PI / 5 - Math.PI / 2; g[st ? 'lineTo' : 'moveTo'](x + 19.4 + Math.cos(an) * rr, y + 31 + Math.sin(an) * rr); } g.closePath(); g.fill(); }
    if(U.faixa){ g.strokeStyle = '#ff4f9a'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x + 10.4, y + 22.2); g.lineTo(x + 22.8, y + 32.6); g.stroke(); }   // faixa rosa de rank
    if(UC){ g.fillStyle = U.px === 'fever' ? '#ffe14d' : '#ffffff'; g.fillRect(x + 19.4, y + 27.4, 2.4, 2.4); g.fillRect(x + 20.2, y + 26.4, .8, 4.4); g.fillRect(x + 18.4, y + 28.2, 4.4, .8); }   // estrelinha do Fever/Ímã no peito
    // ombro arredondado (a mesma faixa de manga da frente, vista de lado) e o braço descendo
    var corM = RP === 'zipper' ? corR : RP === 'sweet' ? '#ffffff' : corCam, bufa = RP === 'zipper' || RP === 'sweet';
    var mg = g.createLinearGradient(0, y + 21, 0, y + 27); mg.addColorStop(0, corM); mg.addColorStop(1, corM === '#ffffff' ? '#e8ebf5' : escuro(corM, 24)); g.fillStyle = mg;
    g.beginPath(); g.ellipse(x + 15.2, y + 24.2, bufa ? 4.8 : 4.1, bufa ? 4 : 3.3, 0, 0, 7); g.fill();
    if(RP === 'of3' || RP === 'of4'){ g.fillStyle = '#ffd23f'; E(x + 15.2, y + 21.4, RP === 'of3' ? 4.6 : 4, RP === 'of3' ? 1.6 : 1.2);   // dragona dourada no ombro
      if(RP === 'of3'){ g.fillStyle = '#e7b94e'; for(var fr = 0; fr < 4; fr++) g.fillRect(x + 12 + fr * 2, y + 22.4, .7, 1.8); } }
    var bg = g.createLinearGradient(0, y + 26, 0, y + 34); bg.addColorStop(0, S); bg.addColorStop(1, SD); g.fillStyle = bg;
    if(corre){ g.save(); g.translate(x + 15.2, y + 26); g.rotate(-passo * .55); g.translate(-(x + 15.2), -(y + 26)); }
    // Cotovelo e punho no mesmo eixo da manga, com flexão durante a passada.
    var dobra=corre?passo*.9:0;
    g.beginPath();g.moveTo(x+13.4,y+26.4);g.lineTo(x+17,y+26.4);
    g.quadraticCurveTo(x+17.7+dobra,y+29.3,x+16.8+dobra,y+30.2);
    g.quadraticCurveTo(x+17.3+dobra,y+32.6,x+15.6+dobra,y+33.6);
    g.quadraticCurveTo(x+13.5+dobra,y+34,x+13.5+dobra,y+31.7);
    g.quadraticCurveTo(x+13.1+dobra,y+29.5,x+13.4,y+26.4);g.closePath();g.fill();
    if(corre) g.restore();
    // ---------- cabeça: crânio (o mesmo círculo da frente) + bochecha e queixo para a frente + narizinho ----------
    g.fillStyle = S; E(x + 14.6, y + 13, 11, 11); E(x + 18.6, y + 17.2, 7.4, 6.6);   // crânio da frente + bochecha cheia (perfil chibi, sem nariz)
    var bq = c.bochecha || '';   // 22/11: bochecha à escolha também de lado (Sem, Corada, Sardas, Estrelinha)
    if(bq !== 'sem'){ g.fillStyle = bq === 'forte' ? 'rgba(255,90,150,.5)' : bq === 'sardas' ? 'rgba(255,111,181,.2)' : bq === 'estrelinha' ? 'rgba(255,111,181,.28)' : 'rgba(255,120,150,.32)'; E(x + 20.6, y + 18.6, bq === 'forte' ? 2.8 : 2.4, bq === 'forte' ? 1.6 : 1.3); }
    if(bq === 'sardas'){ g.fillStyle = 'rgba(150,80,50,.55)'; [[19.4, 18.2], [21, 19], [22.4, 18.2], [20.2, 19.6]].forEach(function(q){ E(x + q[0], y + q[1], .4, .4); }); }
    if(bq === 'estrelinha'){ g.fillStyle = '#ffd23f'; estrelaL(g, x + 21.4, y + 18.2, 1.35); }
    // olho: a mesma peça de pixel da frente (sobrancelha, íris, pupila, dois brilhos)
    var e = +expr || 0, x0 = x + 19.6;
    if(e === 2 || e === 5 || e === 1){ g.strokeStyle = TINTA; g.lineWidth = 1.5; g.beginPath();
      if(e === 1){ g.moveTo(x0, y + 13.4); g.lineTo(x0 + 2.6, y + 15.4); g.lineTo(x0, y + 17.4); }
      else { g.moveTo(x0 - .4, y + 16.6); g.quadraticCurveTo(x0 + 1.6, y + (e === 5 ? 18.2 : 13.6), x0 + 3.6, y + 16.6); }
      g.stroke(); if(e === 5){ g.fillStyle = 'rgba(120,190,255,.85)'; E(x0 + 2.6, y + 18.6, .8, 1.2); } }
    else if(e === 6){ g.fillStyle = '#ff4f9a'; g.beginPath(); g.moveTo(x0 + 1.5, y + 18); g.bezierCurveTo(x0 - 1.6, y + 15.6, x0 - .4, y + 12.6, x0 + 1.5, y + 14.4); g.bezierCurveTo(x0 + 3.4, y + 12.6, x0 + 4.6, y + 15.6, x0 + 1.5, y + 18); g.fill(); }
    else if(typeof TWAvatarRosto !== 'undefined' && TWAvatarRosto.forma && (TWAvatarRosto.forma(c)||['Tsu','Lirika','Pati'].indexOf(c.n)>=0)) TWAvatarRosto.olho(g, c, x0, y - 4, -1);   // 22/11: forma do olho do editor (a peça da frente, cílio para trás)
    else { g.fillStyle = TINTA; g.fillRect(x0, y + 13, 3, 1); g.fillStyle = c.eye || '#5a3b2e'; g.fillRect(x0, y + 14, 3, 4); g.fillStyle = PUPILA; g.fillRect(x0 + 1, y + 15, 2, 2);
      g.fillStyle = '#fff'; g.fillRect(x0, y + 14, 1, 2); g.fillRect(x0 + 2, y + 17, 1, 1); }
    if(c.det === 'olheiras'){ g.fillStyle = 'rgba(130,70,90,.3)'; E(x0 + 1.6, y + 19.4, 1.9, .75); }   // 22/11: olheiras também de lado
    var SB = {fina:[11.2, 11.2, .9, .62], cheia:[11, 11, .6, 1.25], arqueada:[11.4, 11.6, 1.5, .8], preocupada:[10.2, 11.6, .4, .95], decidida:[11.8, 10.5, .4, 1.05]}[c.sobrancelha];
    if(SB){   // 22/11: sobrancelha do editor (a de dentro fica do lado do rosto, para a frente)
      var sb = e === 4 ? -.9 : e === 5 ? -.3 : 0, yi = SB[0] + sb - (e === 5 && c.sobrancelha !== 'preocupada' ? .7 : 0), yo = SB[1] + sb, xi = x0 + 3.8, xo = x0 - .6, xm = (xi + xo) / 2, ym = y + (yi + yo) / 2 - SB[2];
      g.save(); g.fillStyle = escuro(H, 70); g.globalAlpha = .92; g.beginPath(); g.moveTo(xo, y + yo); g.quadraticCurveTo(xm, ym, xi, y + yi);
      g.lineTo(xi, y + yi + SB[3]); g.quadraticCurveTo(xm, ym + SB[3] * 1.15, xo, y + yo + SB[3] * .55); g.closePath(); g.fill(); g.restore(); }
    // boca: o tracinho de sempre (ou o sorrisinho cheio), na beirada do rosto; a boca do editor nas expressões neutra, feliz e piscadinha
    g.fillStyle = TINTA; g.strokeStyle = TINTA;
    var bc = (e === 0 || e === 2 || e === 3) ? (c.boca || '') : '', fz = e === 2 || e === 3, mx = x + 22.2, my = y + 19.6;
    if(bc === 'triangulo'){ var tz = fz ? 1.3 : 1; T([mx - 1.7 * tz, my, mx + 1.7 * tz, my, mx, my + 2.3 * tz]); g.fillStyle = '#ff8fb0'; T([mx - .8 * tz, my + 1 + .3 * tz, mx + .8 * tz, my + 1 + .3 * tz, mx, my + 2.1 * tz]); }
    else if(bc === 'biquinho'){ g.fillStyle = '#d2557f'; E(x + 24, my + .2, .85, .7); E(x + 24, my + 1.4, .85, .7); g.fillStyle = 'rgba(255,255,255,.45)'; E(x + 23.8, my, .28, .2); }
    else if(bc === 'gato'){ g.lineWidth = .9; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx - 2, my + .4); g.quadraticCurveTo(mx - 1, my + 2, mx, my + .6); g.quadraticCurveTo(mx + 1, my + 2, mx + 2, my + .4); g.stroke(); if(fz){ g.fillStyle = '#ff8fb0'; E(mx, my + 2, .9, .5); } }
    else if(bc === 'lingua'){ if(fz){ g.beginPath(); g.arc(mx, my, 1.9, 0, Math.PI); g.fill(); } else { g.lineWidth = 1; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx - 1.4, my + .5); g.quadraticCurveTo(mx, my + 1.8, mx + 1.4, my + .5); g.stroke(); }
      g.fillStyle = '#ff7aa2'; E(mx + .7, my + (fz ? 2.3 : 1.9), 1, 1.2); }
    else if(bc === 'aberta' || (fz && bc === 'sorriso')){ var rb = fz ? 1.9 : 1.5; g.beginPath(); g.arc(mx, my, rb, 0, Math.PI); g.fill(); g.fillStyle = '#ff8fb0'; E(mx, my + rb * .62, rb * .5, rb * .28); }
    else if((bc === 'sorriso' || bc === 'dentinho') && !fz){ g.lineWidth = 1; g.lineCap = 'round'; g.beginPath(); g.moveTo(mx - 1.5, my + .4); g.quadraticCurveTo(mx, my + 1.9, mx + 1.5, my + .4); g.stroke();
      if(bc === 'dentinho'){ g.fillStyle = '#fff'; T([mx + .4, my + .8, mx + 1.3, my + .9, mx + .9, my + 2]); } }
    else if(e === 2 || e === 3 || e === 1 || e === 6){ g.beginPath(); g.moveTo(x + 21, y + 19.6); g.arc(x + 22.2, y + 19.6, 1.8, 0, Math.PI * .85); g.closePath(); g.fill(); }
    else if(e === 4){ E(x + 22.6, y + 20.4, .9, 1.1); }
    else g.fillRect(x + 21.4, y + 20.2, 2.4, 1);
    if(c.det === 'coelho'){ g.save(); g.translate(x + 10.4, y - 2); g.rotate(-.3); g.fillStyle = '#ffffff'; E(0, -6, 3.3, 9, 0); g.fillStyle = 'rgba(255,150,190,.9)'; E(.4, -5.2, 1.5, 6.4, 0); g.restore(); }   // e a de cá
    // ---------- cabelo de cima: a mesma calota (centro 15,8 raio 12) recortada pela franja ----------
    g.fillStyle = hg; g.beginPath(); g.moveTo(x + 26.4, y + 10);
    g.arc(x + 14.6, y + 8, 12, -.17, Math.PI, true);   // da testa, por cima, até a nuca
    var nuca = c.back === 'pixie' ? 16.8 : Math.max(7.5 + sl, c.back === 'chanel' ? 24.4 : 20.5);
    g.lineTo(x + 2.6, y + nuca - 2); g.quadraticCurveTo(x + 3, y + nuca, x + 6, y + nuca); g.lineTo(x + 10.4, y + nuca); g.lineTo(x + 13.4, y + 7.5 + sl); g.quadraticCurveTo(x + 12.4, y + 11.5, x + 13.6, y + 9.6);
    if(c.front === 'bagunca'){   // mechas da Tsu caindo na testa
      g.quadraticCurveTo(x + 13.4, y + 13.8, x + 15.6, y + 15.4); g.quadraticCurveTo(x + 16.4, y + 11, x + 18.8, y + 8.6); g.quadraticCurveTo(x + 20.4, y + 12.6, x + 23.6, y + 13.4); g.quadraticCurveTo(x + 23.8, y + 10.2, x + 26.4, y + 10);
    } else if(c.front === 'lateral' || c.front === 'risca'){   // 22/11: franja de lado caindo para trás (a Risca é mais longa)
      var fd = c.front === 'risca' ? 14.2 : 13; g.quadraticCurveTo(x + 15.2, y + fd + .6, x + 18.4, y + fd - .4); g.quadraticCurveTo(x + 22.6, y + 10.8, x + 26.4, y + (c.front === 'risca' ? 8.8 : 9.4));
    } else if(c.front === 'ondulada'){ g.quadraticCurveTo(x + 15, y + 12.8, x + 17.6, y + 11.6); g.quadraticCurveTo(x + 19.6, y + 13.4, x + 22, y + 11.4); g.quadraticCurveTo(x + 24, y + 12.6, x + 26.4, y + 10); }
    else if(c.front === 'repicada' || c.front === 'pontas'){   // bicos: Pontinhas mais finos e compridos
      var fp = c.front === 'pontas' ? 13 : 12; g.lineTo(x + 15.6, y + fp); g.lineTo(x + 17.6, y + 10); g.lineTo(x + 19.8, y + fp); g.lineTo(x + 21.8, y + 10.2); g.lineTo(x + 24, y + fp - .4); g.lineTo(x + 26.4, y + 10); }
    else if(c.front === 'cortina'){ g.quadraticCurveTo(x + 15.4, y + 14.6, x + 18, y + 13.4); g.quadraticCurveTo(x + 20.6, y + 9, x + 26.4, y + 7.6); }   // aberta no meio: cai do lado e sobe na testa
    else if(c.front === 'curta' || c.front === 'espetada'){ g.quadraticCurveTo(x + 14.6, y + 8.4, x + 16.4, y + 8); for(var fb = 0; fb < 3; fb++) g.quadraticCurveTo(x + 17.8 + fb * 3, y + 9.6, x + 19.4 + fb * 3, y + 7.8); g.lineTo(x + 26.4, y + 7.6); }
    else if(c.front==='reta'){ g.quadraticCurveTo(x+18.2,y+11.4,x+20.8,y+10.8); g.lineTo(x+21.3,y+10); g.quadraticCurveTo(x+24,y+11.2,x+26.4,y+10); }
    else g.lineTo(x + 26.4, y + 10);   // franja reta, na mesma altura da frente
    g.closePath(); g.fill();
    if(c.front === 'espetada'){ g.fillStyle = hg; T([x + 15, y - 1, x + 18.4, y - 9.6, x + 20.4, y - 1.4]); T([x + 19.4, y - 1, x + 25.4, y - 7.4, x + 24.6, y + 1.6]); T([x + 10.6, y - 2.4, x + 12.4, y - 9, x + 15.6, y - 2.2]); }   // espetos para cima
    if(c.front === 'cacheada'){ g.fillStyle = hg; [[16.4, 10.8], [19.6, 11.4], [22.8, 11], [25.4, 10]].forEach(function(q){ E(x + q[0], y + q[1], 1.9, 1.9); }); }
    if(c.front === 'arcoiris'){   // as mechas do arco-íris na franja, vistas de lado
      g.save(); g.beginPath(); g.arc(x + 14.6, y + 8, 12, 0, 7); g.clip(); g.beginPath(); g.rect(x + 15, y + 1.6, 12, 8.4); g.clip(); ['#ff6b8b', '#ffb347', '#ffe066', '#7be08a', '#6cc7ff', '#b38cff'].forEach(function(cc, j){ g.fillStyle = cc; g.fillRect(x + 15.4 + j * 1.9, y + 1.6, 1.9, 8.4); }); g.restore(); }
    // costeleta de cá: na frente da orelha, na mesma altura das laterais da frente
    if(c.back !== 'chanel' && c.back !== 'hime'){ g.fillStyle = hg; E(x + 11, y + 7.5 + sl, 2.4, 1.8); }   // ponta arredondada da lateral (como E(x+5,y+12+sl) da frente)
    // sombra da franja na pele e brilho do cabelo
    if(c.front !== 'curta' && c.front !== 'espetada' && c.front !== 'cortina'){ g.fillStyle = 'rgba(40,10,70,.18)'; g.fillRect(x + 14, y + 10, 12, 1); }   // franja alta não faz sombra na testa
    g.strokeStyle = HL; g.globalAlpha = .5; g.lineWidth = 1.3; g.beginPath(); g.arc(x + 14, y + 6, 8.5, -2.5, -1.3); g.stroke(); g.globalAlpha = 1;
    // 22/11: mecha do editor (Uma, Dupla, Luzes, Escondida) na cor da mecha, por cima do cabelo de cima
    var st = c.mecha || (c.streak ? 'uma' : ''), H2 = /^#[0-9a-f]{6}$/i.test(c.hair2 || '') ? c.hair2 : '#ffffff';
    if(st === 'uma' || st === 'dupla' || st === 'luzes' || st === 'escondida'){
      var m2 = g.createLinearGradient(0, y - 4, 0, y + 14); m2.addColorStop(0, H2); m2.addColorStop(1, escuro(H2, 60));
      g.save(); g.beginPath(); g.arc(x + 14.6, y + 8, 12, 0, 7); g.rect(x + 2.4, y + 8, 9, 16); g.clip(); g.fillStyle = m2; g.strokeStyle = m2; g.lineCap = 'round';
      function fio(a, b, cc, d, w){ g.lineWidth = w; g.beginPath(); g.moveTo(x + a[0], y + a[1]); g.quadraticCurveTo(x + b[0], y + b[1], x + cc[0], y + cc[1]); if(d) g.lineTo(x + d[0], y + d[1]); g.stroke(); }
      if(st === 'uma' || st === 'dupla'){ fio([15.6, -3.6], [21.6, -1.6], [23.4, 9.4], null, 3.2); if(st === 'dupla'){ g.strokeStyle = claro(H2, 70); fio([12, -3.4], [19, -1.6], [20.6, 9.6], null, 2.6); } }
      else if(st === 'luzes'){ g.lineWidth = 1; [[8, -1.2, 4.6, 6, 4.6, 14], [12.4, -3.6, 8.4, 2, 7.6, 12], [17.6, -3.6, 22.6, 0, 24, 8]].forEach(function(q){ g.beginPath(); g.moveTo(x + q[0], y + q[1]); g.quadraticCurveTo(x + q[2], y + q[3], x + q[4], y + q[5]); g.stroke(); }); }
      else { fio([4.2, 11.6], [2.6, 16], [4, nuca - 1.4], null, 2.2); fio([7.4, 12.6], [6, 17], [7.6, nuca - .8], null, 2); }   // escondida: a camada de baixo aparece em mechas na nuca
      g.restore(); }
    var enf = c.mecha === 'antena' || c.mecha === 'coracao' ? c.mecha : (c.det === 'antena' || c.det === 'coracao' ? c.det : '');
    if(enf){ var ag = g.createLinearGradient(0, y - 13, 0, y - 1); ag.addColorStop(0, claro(c.hair2 || H, 30)); ag.addColorStop(1, escuro(c.hair2 || H, 50)); g.fillStyle = ag;
      if(enf === 'antena'){ g.beginPath(); g.moveTo(x + 12.4, y - 2.8); g.quadraticCurveTo(x + 12, y - 10, x + 6.6, y - 12.4); g.quadraticCurveTo(x + 10, y - 8.6, x + 9.6, y - 3.2); g.closePath(); g.fill(); }   // anteninha voltada para trás
      else { g.beginPath(); g.moveTo(x + 13, y - 2.6); g.bezierCurveTo(x + 7.4, y - 6.6, x + 9.2, y - 12, x + 13, y - 9.2); g.bezierCurveTo(x + 16.8, y - 12, x + 18.6, y - 6.6, x + 13, y - 2.6); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.3)'; E(x + 11, y - 8.2, 1.1, .7, -.5); } }
    if(c.gl === 'redonda' || c.gl === 'quadrada'){   // óculos: a lente em volta do olho e a haste até a orelha
      g.strokeStyle = '#222'; g.lineWidth = 1; g.beginPath();
      if(c.gl === 'redonda'){ g.arc(x0 + 1.6, y + 15.6, 3, 0, 7); } else g.rect(x0 - 1.2, y + 12.6, 5.8, 5.6);
      g.moveTo(x0 - (c.gl === 'redonda' ? 1.4 : 1.2), y + 14.8); g.lineTo(x + 12.4, y + 14); g.stroke();
      g.fillStyle = 'rgba(200,230,255,.18)'; if(c.gl === 'redonda') E(x0 + 1.6, y + 15.6, 2.6, 2.6); else g.fillRect(x0 - .7, y + 13.1, 4.8, 4.6); }
    // ---------- do lado de cá, por cima: coque e orelha de gato ----------
    if(c.det === 'coques'){ g.fillStyle = H; E(x + 6.4, y - 1.8, 6, 6); g.fillStyle = HL; g.globalAlpha = .45; E(x + 4.6, y - 4, 2, 1.2, -.5); g.globalAlpha = 1; g.fillStyle = '#2a5bd7'; g.save(); g.translate(x + 7.6, y + 3.6); g.rotate(-.18); g.fillRect(-3.6, -1.4, 7.2, 2.8); g.restore(); }
    if(c.det === 'gato'){ g.fillStyle = H; T([x + 3, y + 5, x + 6, y - 8, x + 13, y]); g.fillStyle = 'rgba(255,150,190,.8)'; T([x + 6, y + 2, x + 7, y - 4, x + 10, y]); }
    if(c.back === 'hime'){ g.fillStyle = hg; g.fillRect(x + 10.2, y + 8, 3.6, 18.5); g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x + 10.8, y + 9, .9, 14); }   // mecha reta ao lado do rosto, cortada no queixo
    if(c.back === 'coque'){   // coque alto, um pouco para trás, com elástico rosa (como o da frente)
      var cq = g.createLinearGradient(0, y - 11, 0, y + 1); cq.addColorStop(0, HL); cq.addColorStop(1, HD);
      g.fillStyle = HD; E(x + 11.6, y - 2.2, 5.6, 2.4); g.fillStyle = cq; E(x + 11.2, y - 6, 6.2, 5.2);
      g.fillStyle = 'rgba(255,255,255,.28)'; E(x + 9, y - 8.2, 2.4, 1.1, -.35);
      g.fillStyle = '#ff6fb5'; g.beginPath(); g.ellipse(x + 11.6, y - 1.4, 5.4, 1.6, -.08, 0, Math.PI); g.ellipse(x + 11.6, y - 1.4, 4.4, .7, -.08, Math.PI, 0, true); g.closePath(); g.fill(); }
    if(c.back === 'trancas'){   // a trança do lado de cá, na frente do ombro (a outra fica atrás do corpo)
      var tb = c.hair || '#333', tw = corre ? Math.sin((t || 0) * .5) * .5 : 0;
      for(var k = 0; k < 7; k++){ var by = y + 17 + k * 2.9, rx = 2.9 - k * .16, ry = 1.9 - k * .07, ld = k % 2 ? 1 : -1, bx = x + 12.2 + ld * .55 + tw * k * .15;
        var gk = g.createLinearGradient(bx - rx, by - ry, bx + rx, by + ry); gk.addColorStop(0, claro(tb, 18)); gk.addColorStop(1, escuro(tb, 45));
        g.fillStyle = gk; E(bx, by, rx, ry, ld * .62); g.fillStyle = 'rgba(0,0,0,.16)'; E(bx + ld * .3, by + ry * .55, rx * .8, ry * .28, ld * .62); g.fillStyle = 'rgba(255,255,255,.22)'; E(bx - ld * .7, by - .8, rx * .45, ry * .3, ld * .62); }
      var tpx = x + 12.2 + tw, tpy = y + 17 + 7 * 2.9; g.fillStyle = '#ff6fb5'; E(tpx, tpy - .5, 2, 1.1);
      g.fillStyle = escuro(tb, 30); g.beginPath(); g.moveTo(tpx - 1.6, tpy + .2); g.quadraticCurveTo(tpx, tpy + 4.4, tpx + 1.6, tpy + .2); g.closePath(); g.fill(); }
    // 22/11: orelha de elfo e chifres de lado (antes sumiam)
    if(c.det === 'elfo'){ g.fillStyle = S; T([x + 12.8, y + 13.6, x + 5.8, y + 7.6, x + 10.6, y + 19.4, x + 12.8, y + 19.8]); g.fillStyle = 'rgba(255,120,160,.35)'; T([x + 11.8, y + 14.4, x + 7.8, y + 10, x + 10.8, y + 17.8]); }
    if(c.det === 'chifres'){ g.fillStyle = '#5a1620'; T([x + 8.4, y + 1, x + 5.6, y - 10.6, x + 12.6, y - .8]); g.fillStyle = '#7a1f2b'; T([x + 14.6, y - .4, x + 13, y - 12.4, x + 20.4, y - .2]);
      g.fillStyle = 'rgba(255,255,255,.18)'; T([x + 15.4, y - 1.4, x + 14.2, y - 9, x + 16.4, y - 1.6]); }
    if(ALV){   // anteninhas de alien da abdução, com as bolinhas verdes brilhando
      var ab = Math.sin((t || 0) * .15) * 2; g.strokeStyle = '#e8ffd0'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x + 11, y - 1.6); g.lineTo(x + 8.6, y - 9 - ab); g.moveTo(x + 16.4, y - 2.6); g.lineTo(x + 19.6, y - 9.6 + ab); g.stroke();
      g.save(); g.fillStyle = '#b6ff3b'; g.shadowColor = '#b6ff3b'; g.shadowBlur = 6; E(x + 8.6, y - 10 - ab, 1.9, 1.9); E(x + 19.6, y - 10.6 + ab, 1.9, 1.9); g.restore(); }
    if(RP === 'estrelado' && !c.hat){   // a presilha de estrela do Céu Estrelado: tiara rosa por cima e a estrela com fitinhas
      g.strokeStyle = '#ff6fb5'; g.lineWidth = 1.3; g.beginPath(); g.arc(x + 14.6, y + 8, 12.2, -2.05, -.95); g.stroke();
      g.fillStyle = '#4dd8ff'; g.fillRect(x + 19.4, y - 2.2, .8, 4.4); g.fillStyle = '#ff6fb5'; g.fillRect(x + 18.2, y - 2.2, .8, 3.6);
      g.fillStyle = '#ffe14d'; g.beginPath(); for(var sk = 0; sk < 10; sk++){ var rk = sk % 2 ? 1.1 : 2.6, ak = sk * Math.PI / 5 - Math.PI / 2; g[sk ? 'lineTo' : 'moveTo'](x + 19.2 + Math.cos(ak) * rk, y - 3.2 + Math.sin(ak) * rk); } g.closePath(); g.fill(); }
    if(c.det==='tulipa') CHAPEU.tulipa(g,x,y,E);
    else if(c.hat && CHAPEU[c.hat]) CHAPEU[c.hat](g, x, y, E);
    if(A && ACESSORIO[A]) ACESSORIO[A](g, x, y, E);
    if(c.det === 'torrada' && A !== 'torrada') ACESSORIO.torrada(g, x, y, E);   // 22/11: a Torrada comprada fica no detalhe
    if(OFL === 5){ g.save(); g.strokeStyle = '#ffe98a'; g.lineWidth = 1.8; g.shadowColor = '#ffe98a'; g.shadowBlur = 6; g.beginPath(); g.ellipse(x + 13.6, y - 15, 8.6, 2.4, -.08, 0, 7); g.stroke(); g.restore(); }   // auréola
  }
  // ---------- chapéus vistos de lado (17/11): cabeça centrada em (14.6, 8), raio 12, olhando para a direita ----------
  function flor(g, E, cx, cy, r, pc, cc){ g.fillStyle = pc; for(var k = 0; k < 5; k++){ var a = k * 1.2566 - 1.57; E(cx + Math.cos(a) * r, cy + Math.sin(a) * r, r * .8, r * .8); } g.fillStyle = cc; E(cx, cy, r * .55, r * .55); }
  var CHAPEU = {
    tiara:function(g,x,y,E){   // 22/11: Arco estelar como o da frente: aro dourado e a estrela no alto, com as bolinhas
      g.strokeStyle='#f5c518';g.lineWidth=1.3;g.beginPath();g.arc(x+14.6,y+8,12.3,-2.75,-.55);g.stroke();
      g.fillStyle='#ffe14d';g.strokeStyle='#e0a800';g.lineWidth=.5;estrelaL(g,x+13.4,y-5.2,3.4);g.stroke();
      g.fillStyle='rgba(255,255,255,.7)';E(x+12.6,y-6.2,.7,.5);g.fillStyle='#ff6fb5';E(x+5.2,y-.8,.9,.9);g.fillStyle='#4dd8ff';E(x+22.4,y-1.6,.9,.9);
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
  function tiara(g, x, y, E, ouro){   // a coroinha vista de lado: aro no alto da cabeça e três pontas, com as joias
    var cb = ouro ? '#ffd23f' : '#e2e8f0', cd = ouro ? '#b45309' : '#94a3b8';
    g.save(); g.translate(x + 14, y - 3.6); g.rotate(-.1); g.fillStyle = cb; g.strokeStyle = cd; g.lineWidth = .6;
    g.beginPath(); g.moveTo(-7, 2); g.lineTo(-7, -2.6); g.lineTo(-4, 1.4); g.lineTo(0, -6.4); g.lineTo(4, 1.4); g.lineTo(7, -2.6); g.lineTo(7, 2); g.closePath(); g.fill(); g.stroke();
    g.fillRect(-7.4, 1.2, 14.8, 1.8); g.strokeRect(-7.4, 1.2, 14.8, 1.8);
    g.fillStyle = '#ff4f9a'; E(0, -1.6, 1.1, 1.1); g.fillStyle = '#3b82f6'; E(-7, -1.8, .8, .8); g.fillStyle = '#22c55e'; E(7, -1.8, .8, .8);
    g.fillStyle = 'rgba(255,255,255,.6)'; g.fillRect(-.6, -4.2, .8, 1.6); g.restore(); }
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
    tiaraS:function(g, x, y, E){ tiara(g, x, y, E, false); },   // 22/11: Tiara de prata e dourada de lado (antes o Você voltava a correr de frente)
    tiaraO:function(g, x, y, E){ tiara(g, x, y, E, true); },
    mic:function(g, x, y, E){ g.fillStyle = '#222'; E(x + 11.4, y + 12.6, 2.6, 3); g.strokeStyle = '#222'; g.lineWidth = 1.1; g.beginPath(); g.moveTo(x + 12.4, y + 14.6); g.quadraticCurveTo(x + 15, y + 21.4, x + 22.4, y + 21.6); g.stroke(); g.fillStyle = '#ff4f9a'; E(x + 23.2, y + 21.4, 1.9, 1.9); }
  };
  // Desenha no canvas x (contexto 2D): cx = meio do boneco, chao = linha dos pés, ES = escala; com o contorno branco do jogo.
  function desenhar(x, cx, chao, ES, av, t, olhaEsquerda){
    var c = av && av.c ? av.c : av; if(!c) return;
    var tx = cx - 15 * ES, ty = chao - 44 * ES;
    x.save();
    if(olhaEsquerda){ x.translate(cx, 0); x.scale(-1, 1); x.translate(-cx, 0); }
    x.fillStyle = 'rgba(30,10,60,.25)'; x.beginPath(); x.ellipse(cx, chao + 2 * ES, 13 * ES, 2.4 * ES, 0, 0, 7); x.fill();
    if(typeof perfCharContorno === 'function') perfCharContorno(x, tx, ty, ES, function(){ lado(g, c, 0, 0, av.expr, t, undefined, av.a || ''); });
    x.restore();
  }
  // Correndo no Center⭐Run! (17/11): desenha no contexto do jogo, na grade 30×44 em (x, y) como o drawChar,
  // com o contorno de 1 px nas cores do boneco de frente (OUT: branco, ou rosa no Fever / lilás no Ímã).
  var corOff = null, silOff = null;
  function corre(g2, c, x, y, expr, t, run, OUT, A, U){
    var Q = 3, w = 44 * Q, h = 67 * Q;   // 22/11: 9 px a mais em cima para a auréola e as anteninhas
    if(!corOff){ corOff = document.createElement('canvas'); corOff.width = w; corOff.height = h; silOff = document.createElement('canvas'); silOff.width = w; silOff.height = h; }
    var o = corOff.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, w, h); o.setTransform(Q, 0, 0, Q, 11 * Q, 19 * Q);
    lado(o, c, 0, 0, expr, t, run, A, U);
    var s2 = silOff.getContext('2d'); s2.setTransform(1, 0, 0, 1, 0, 0); s2.clearRect(0, 0, w, h); s2.globalCompositeOperation = 'source-over'; s2.drawImage(corOff, 0, 0);
    s2.globalCompositeOperation = 'source-in'; s2.fillStyle = (OUT && OUT[0]) || '#fff'; s2.fillRect(0, 0, w, h); s2.globalCompositeOperation = 'source-over';
    var X = x - 11, Y = y - 19, k;
    for(k = 0; k < 8; k++){ var a = k * Math.PI / 4; g2.drawImage(silOff, X + Math.cos(a) * 1.1, Y + Math.sin(a) * 1.1, 44, 67); }
    g2.drawImage(corOff, X, Y, 44, 67);
  }
  // o Center⭐Run pergunta antes: chapéu ou acessório sem versão de lado continua de frente
  function sabe(c, A){ return (!c || !c.hat || !!CHAPEU[c.hat]) && (!A || !!ACESSORIO[A]); }
  window.TW_LADO = {desenhar:desenhar, partes:lado, corre:corre, sabe:sabe};
})();
