/* Karaoke⭐Time! — vistas da janela da sala (Canvas 2D).
   Cinco vistas, uma por semana, trocando todo domingo à 0h de Brasília (junto com o ranking semanal), sempre na mesma ordem:
   Gigoia → Liberdade → Tailândia → Harajuku → Praia. Cada vista tem versão de dia (6h–18h em Brasília) e de noite.
   Gigoia e Liberdade de noite são as vistas originais da sala (mesmo desenho); as versões de dia trocam céu, luzes e cores.
   Arquivo independente: a página só chama KaraokeRoomViews.draw(...) no lugar da janela. */
(function(root, factory){
 'use strict';
 var api = factory();
 if(typeof module === 'object' && module.exports) module.exports = api;
 else root.KaraokeRoomViews = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
 'use strict';
 var VIEWS = ['gigoia', 'liberdade', 'tailandia', 'harajuku', 'praia'];
 var NAMES = { gigoia:'Gigoia', liberdade:'Liberdade', tailandia:'Tailândia', harajuku:'Harajuku', praia:'Praia' };
 // Música da semana: combina com a vista (mesma regra do banco em private.kt_musica_da_semana)
 var SONGS = { gigoia:'chill', liberdade:'duo', tailandia:'normal', harajuku:'fast', praia:'gacha' };
 var BRT = 3 * 3600e3, WEEK = 7 * 864e5;
 var ANCHOR = Date.UTC(2026, 10, 1, 3);   // domingo, 01/11/2026, 0h de Brasília: semana da Liberdade
 var ANCHOR_INDEX = 1;
 var PI2 = Math.PI * 2;

 function weekIndex(ms){ return Math.floor((ms - ANCHOR) / WEEK); }
 function viewFor(ms){ var i = (ANCHOR_INDEX + weekIndex(ms)) % VIEWS.length; return VIEWS[(i + VIEWS.length) % VIEWS.length]; }
 function nextChange(ms){ return ANCHOR + (weekIndex(ms) + 1) * WEEK; }
 function songFor(ms){ return SONGS[viewFor(ms)]; }
 function isNight(ms){ var h = new Date(ms - BRT).getUTCHours(); return h < 6 || h >= 18; }

 // ---------- utilidades ----------
 function rr(x, a, b, w, h, r){ x.beginPath(); if(x.roundRect) x.roundRect(a, b, w, h, r); else x.rect(a, b, w, h); }
 function hex(c){ c = String(c).replace('#', ''); if(c.length === 3) c = c.replace(/./g, '$&$&'); var n = parseInt(c, 16) || 0; return [n >> 16, n >> 8 & 255, n & 255]; }
 function mix(a, b, k){ var p = hex(a), q = hex(b); return 'rgb(' + [0, 1, 2].map(function(i){ return Math.round(p[i] + (q[i] - p[i]) * k); }).join(',') + ')'; }
 function sky(x, R, stops, pos){ var g = x.createLinearGradient(0, R.y, 0, R.y + R.h); stops.forEach(function(s, i){ g.addColorStop(pos ? pos[i] : i / (stops.length - 1), s); }); x.fillStyle = g; x.fillRect(R.x, R.y, R.w, R.h); }
 function glow(x, cx, cy, r, cor){ var g = x.createRadialGradient(cx, cy, 0, cx, cy, r); g.addColorStop(0, cor); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(cx - r, cy - r, r * 2, r * 2); }
 function disco(x, cx, cy, r, cor){ x.fillStyle = cor; x.beginPath(); x.arc(cx, cy, r, 0, PI2); x.fill(); }
 function sol(x, cx, cy, r){ glow(x, cx, cy, r * 3.2, 'rgba(255,240,170,.55)'); disco(x, cx, cy, r, '#fff1a6'); disco(x, cx - r * .25, cy - r * .25, r * .45, 'rgba(255,255,255,.55)'); }
 function lua(x, cx, cy, r){ glow(x, cx, cy, r * 2.6, 'rgba(255,236,190,.28)'); disco(x, cx, cy, r, 'rgba(255,232,190,.95)'); disco(x, cx + r * .35, cy - r * .2, r * .22, 'rgba(230,205,170,.6)'); }
 function estrelas(x, R, n, t){ for(var i = 0; i < n; i++){ var sx = R.x + (i * 47.3 % R.w), sy = R.y + (i * 29.7 % (R.h * .42)); x.fillStyle = 'rgba(255,255,255,' + (.35 + .35 * Math.abs(Math.sin(t * .03 + i))) + ')'; x.fillRect(sx, sy, 1.4, 1.4); } }
 function nuvem(x, cx, cy, s, cor){ x.fillStyle = cor; [[0, 0, 7], [7, -3, 6], [13, 1, 5], [-6, 2, 5]].forEach(function(c){ x.beginPath(); x.arc(cx + c[0] * s, cy + c[1] * s, c[2] * s, 0, PI2); x.fill(); }); }

 // ---------- Gigoia (vila à beira d'água) ----------
 function gigoia(x, R, t, N){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h, i;
  sky(x, R, N ? ['#1f3b64', '#587caa', '#efad9a', '#f8c6a0'] : ['#5aaee6', '#8fd0f2', '#cdeefa', '#ecf9ff'], [0, .34, .55, 1]);
  if(N){ x.fillStyle = 'rgba(255,221,176,.84)'; x.beginPath(); x.arc(rx + rw * .73, ry + rh * .39, 8, 0, PI2); x.fill(); }
  else { sol(x, rx + rw * .78, ry + rh * .2, 9); nuvem(x, rx + rw * .2, ry + rh * .16, .9, 'rgba(255,255,255,.9)'); nuvem(x, rx + rw * .5, ry + rh * .1, .7, 'rgba(255,255,255,.8)'); }
  x.fillStyle = N ? '#465e78' : '#6f93b4';
  x.beginPath(); x.moveTo(rx, ry + rh * .48);
  [[.1, .35], [.22, .38], [.34, .24], [.46, .46], [.62, .39], [.76, .47], [1, .4]].forEach(function(p){ x.lineTo(rx + rw * p[0], ry + rh * p[1]); });
  x.lineTo(rx + rw, ry + rh * .64); x.lineTo(rx, ry + rh * .64); x.closePath(); x.fill();
  x.fillStyle = N ? '#315b60' : '#4f8f74';
  x.beginPath(); x.moveTo(rx, ry + rh * .54);
  x.quadraticCurveTo(rx + rw * .16, ry + rh * .43, rx + rw * .33, ry + rh * .55);
  x.quadraticCurveTo(rx + rw * .48, ry + rh * .44, rx + rw * .65, ry + rh * .56);
  x.quadraticCurveTo(rx + rw * .82, ry + rh * .42, rx + rw, ry + rh * .55);
  x.lineTo(rx + rw, ry + rh * .7); x.lineTo(rx, ry + rh * .7); x.closePath(); x.fill();
  for(var tree = 0; tree < 7; tree++){
   var tx = rx + tree * (rw / 6), base = ry + rh * .7, ht = 13 + (tree % 3) * 5;
   x.strokeStyle = N ? '#253f45' : '#3c5b4a'; x.lineWidth = 2.2; x.beginPath(); x.moveTo(tx, base); x.lineTo(tx - 2, base - ht); x.stroke();
   for(var br = 0; br < 4; br++){
    var bx = tx - 11 + br * 7, by = base - ht - (br % 2) * 4;
    x.strokeStyle = N ? '#365f55' : '#4b7a5c'; x.lineWidth = 1.7; x.beginPath(); x.moveTo(tx - 2, base - ht + 3); x.quadraticCurveTo(bx, by + 2, bx + (br - 1) * 2, by - 4); x.stroke();
    x.fillStyle = (N ? ['#4e8a70', '#70a77d', '#3a705d'] : ['#5fb07f', '#86c98c', '#4b9468'])[br % 3];
    x.beginPath(); x.arc(bx + (br - 1) * 2, by - 5, 4.8 + (br % 2), 0, PI2); x.fill();
   }
  }
  var waterY = ry + rh * .69, w = x.createLinearGradient(0, waterY, 0, ry + rh);
  (N ? ['#427e95', '#3a8d9e', '#24566e'] : ['#5cc3dc', '#44b2c9', '#2d86a6']).forEach(function(c, k){ w.addColorStop([0, .38, 1][k], c); });
  x.fillStyle = w; x.fillRect(rx, waterY, rw, rh * .31);
  [{u:.02, w:.22, h:.24, c:'#e7b69b', r:'#604f55'}, {u:.27, w:.21, h:.28, c:'#e8c98e', r:'#6b4d4c'}, {u:.51, w:.2, h:.22, c:'#d994a3', r:'#4e4b61'}, {u:.74, w:.23, h:.25, c:'#a9d4b9', r:'#5b5357'}].forEach(function(b){
   var bx = rx + b.u * rw, bw = b.w * rw, bh = b.h * rh, by = waterY - bh - 3;
   x.fillStyle = 'rgba(14,27,42,.28)'; x.fillRect(bx - 2, by + bh - 1, bw + 4, 4);
   x.fillStyle = N ? b.c : mix(b.c, '#ffffff', .18); x.fillRect(bx, by, bw, bh);
   x.fillStyle = N ? b.r : mix(b.r, '#c9744f', .45); x.beginPath(); x.moveTo(bx - 4, by + 3); x.lineTo(bx + bw * .48, by - bh * .23); x.lineTo(bx + bw + 4, by + 3); x.closePath(); x.fill();
   x.fillStyle = N ? 'rgba(255,231,183,.94)' : 'rgba(150,200,230,.9)';
   for(var wj = 0; wj < 3; wj++) x.fillRect(bx + 5 + wj * (bw - 10) / 3, by + 9, 4, 6);
   x.fillStyle = '#795344'; x.fillRect(bx + 5, by + bh - 8, 4, 8); x.fillRect(bx + bw - 9, by + bh - 8, 4, 8);
   for(var post = 0; post < 3; post++){ var px = bx + post * bw / 2; x.strokeStyle = '#6c4e43'; x.lineWidth = 2; x.beginPath(); x.moveTo(px, by + bh - 2); x.lineTo(px, waterY + 3); x.stroke(); }
   x.fillStyle = N ? 'rgba(255,214,165,.6)' : 'rgba(255,255,255,.5)'; x.fillRect(bx, by + bh - 2, bw, 2);
  });
  x.fillStyle = '#845d4c'; x.fillRect(rx, waterY - 2, rw * .55, 4);
  x.strokeStyle = '#c28c69'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(rx, waterY - 8); x.lineTo(rx + rw * .55, waterY - 8);
  [6, rw * .2, rw * .4].forEach(function(o){ x.moveTo(rx + o, waterY - 8); x.lineTo(rx + o, waterY - 1); }); x.stroke();
  for(var bulb = 0; bulb < 8; bulb++){
   var lx2 = rx + bulb * rw / 7, ly2 = waterY - 18 - Math.sin(bulb / 7 * Math.PI) * 8;
   x.strokeStyle = N ? 'rgba(255,224,163,.7)' : 'rgba(120,90,70,.6)'; x.lineWidth = 1; x.beginPath(); x.moveTo(lx2, waterY - 25); x.lineTo(lx2, ly2); x.stroke();
   x.fillStyle = N ? '#ffdb91' : '#f3ead2'; x.shadowColor = '#ffcf83'; x.shadowBlur = N ? 5 : 0; x.beginPath(); x.arc(lx2, ly2, 1.8, 0, PI2); x.fill(); x.shadowBlur = 0;
  }
  for(i = 0; i < 13; i++){
   var rxx = rx + ((i * 19 + t * .22) % (rw + 18)) - 9, ryy = waterY + 4 + (i % 4) * 6;
   x.strokeStyle = 'rgba(212,248,250,' + (.18 + (i % 3) * .09) + ')'; x.lineWidth = 1.1; x.beginPath(); x.moveTo(rxx, ryy); x.quadraticCurveTo(rxx + 5, ryy - 1, rxx + 11, ryy); x.stroke();
  }
  var bx2 = rx + rw * .68 + Math.sin(t * .012) * 11, by2 = waterY + 16;
  x.fillStyle = '#1f3448'; x.beginPath(); x.moveTo(bx2 - 15, by2); x.lineTo(bx2 + 16, by2); x.lineTo(bx2 + 10, by2 + 5); x.lineTo(bx2 - 10, by2 + 5); x.closePath(); x.fill();
  x.fillStyle = '#f5e8d6'; x.fillRect(bx2 - 7, by2 - 8, 14, 7);
  x.fillStyle = ['#f59fb3', '#a7f3d0', '#93c5fd'][Math.floor(t / 35) % 3]; x.fillRect(bx2 - 9, by2 - 10, 18, 3);
 }

 // ---------- Liberdade (rua com lanternas) ----------
 function liberdade(x, R, t, N){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h;
  sky(x, R, N ? ['#343a73', '#b06b9b', '#f2a77d', '#f8ccad'] : ['#6cb6ea', '#a6d7f4', '#f9e6cc', '#fff1de'], [0, .42, .76, 1]);
  if(N){ x.fillStyle = 'rgba(255,222,171,.92)'; x.beginPath(); x.arc(rx + rw * .73, ry + rh * .3, 11, 0, PI2); x.fill(); }
  else { sol(x, rx + rw * .73, ry + rh * .2, 10); nuvem(x, rx + rw * .25, ry + rh * .14, .8, 'rgba(255,255,255,.85)'); }
  [{u:0, w:.2, h:.58, c:'#574a75'}, {u:.17, w:.19, h:.73, c:'#786083'}, {u:.35, w:.17, h:.52, c:'#48516f'}, {u:.51, w:.2, h:.67, c:'#6c526e'}, {u:.7, w:.16, h:.48, c:'#434d6d'}, {u:.84, w:.2, h:.63, c:'#76566d'}].forEach(function(b, i){
   var bx = rx + b.u * rw, bw = b.w * rw, bh = b.h * rh, by = ry + rh - bh - 4;
   x.fillStyle = N ? b.c : mix(b.c, '#d9e2f2', .42); x.fillRect(bx, by, bw, bh);
   x.fillStyle = ['#f6bd7b', '#a9edeb', '#f7a8d2'][i % 3]; x.fillRect(bx + 3, by + 8, Math.max(4, bw * .35), 4);
   for(var wy = by + 17; wy < ry + rh - 14; wy += 12) for(var wx = bx + 5; wx < bx + bw - 3; wx += 9){
    var aceso = Math.floor(wx + wy + i) % 3 === 0;
    x.fillStyle = N ? (aceso ? 'rgba(255,231,173,.92)' : 'rgba(34,27,61,.45)') : (aceso ? 'rgba(235,248,255,.85)' : 'rgba(70,80,110,.4)');
    x.fillRect(wx, wy, 4, 5);
   }
  });
  for(var l = 0; l < 5; l++){
   var lx = rx + 12 + l * 43;
   x.strokeStyle = 'rgba(28,25,59,.9)'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(lx, ry + 2); x.lineTo(lx, ry + 22); x.stroke();
   x.fillStyle = l % 2 ? '#f7a8d2' : '#f9d98a'; x.shadowColor = x.fillStyle; x.shadowBlur = N ? 8 : 0;
   rr(x, lx - 4, ry + 18, 8, 12, 3); x.fill(); x.shadowBlur = 0;
  }
  x.fillStyle = N ? '#272742' : '#5b5d78'; x.fillRect(rx, ry + rh - 15, rw, 15);
  for(var rf = 0; rf < 14; rf++){
   var rfx = rx + (rf * 23 + t * .23) % (rw + 20) - 10;
   x.strokeStyle = ['rgba(249,168,212,.45)', 'rgba(147,197,253,.4)', 'rgba(167,243,208,.32)'][rf % 3]; x.lineWidth = 1.5;
   if(!N) x.globalAlpha = .45;
   x.beginPath(); x.moveTo(rfx, ry + rh - 14); x.lineTo(rfx + 3, ry + rh - 5 - (rf % 4)); x.stroke(); x.globalAlpha = 1;
  }
 }
 function liberdadeFrente(x, R, t, N){   // arco, lanternas e barraquinhas (por cima do reflexo do vidro, como no original)
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h, ruaY = ry + rh - 15, cY0 = ry + 51, cY1 = ry + 40, cX0 = rx + 14, cX1 = rx + rw * .5, cX2 = rx + rw - 14;
  [cX0, cX2].forEach(function(px){
   x.fillStyle = '#2f2340'; x.fillRect(px - 1.6, cY0 - 3, 3.2, ruaY - cY0 + 3);
   x.fillStyle = '#4a3a63'; x.fillRect(px - 1.6, cY0 - 3, 1.2, ruaY - cY0 + 3);
   x.fillStyle = '#241a33'; x.fillRect(px - 5, ruaY - 3, 10, 4);
   x.fillStyle = '#6b5486'; x.fillRect(px - 3.5, cY0 - 6, 7, 3);
  });
  x.strokeStyle = 'rgba(104,34,39,.95)'; x.lineWidth = 4; x.beginPath(); x.moveTo(cX0, cY0); x.quadraticCurveTo(cX1, cY1, cX2, cY0); x.stroke();
  for(var lf = 0; lf < 5; lf++){
   var u = (lf + .5) / 5, iu = 1 - u, lx = iu * iu * cX0 + 2 * iu * u * cX1 + u * u * cX2, ly0 = iu * iu * cY0 + 2 * iu * u * cY1 + u * u * cY0, ly = ly0 + 13;
   x.strokeStyle = 'rgba(54,37,58,.9)'; x.lineWidth = 1; x.beginPath(); x.moveTo(lx, ly0); x.lineTo(lx, ly - 6); x.stroke();
   var lc = lf % 2 ? '#ffd98a' : '#ff9fb6', lg = x.createRadialGradient(lx - 1.4, ly - 2, .5, lx, ly, 7);
   lg.addColorStop(0, N ? '#fffdf2' : mix(lc, '#ffffff', .4)); lg.addColorStop(.55, lc); lg.addColorStop(1, lf % 2 ? '#e88f3c' : '#d9596f');
   x.save(); x.shadowColor = lc; x.shadowBlur = N ? 9 : 0; x.fillStyle = lg; x.beginPath(); x.ellipse(lx, ly, 4.4, 6.4, 0, 0, PI2); x.fill(); x.restore();
   x.strokeStyle = 'rgba(140,60,70,.55)'; x.lineWidth = .7; x.beginPath(); x.ellipse(lx, ly, 4.4, 6.4, 0, 0, PI2); x.stroke();
   x.fillStyle = 'rgba(120,40,50,.45)'; x.fillRect(lx - 2.2, ly - 6.6, 4.4, 1.3); x.fillRect(lx - 2.2, ly + 5.3, 4.4, 1.3);
   x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(lx - 1.5, ly - 2.2, 1.1, 1.6, 0, 0, PI2); x.fill();
  }
  [[rx + 26, 42, '茶'], [rx + rw * .40, 40, '麺'], [rx + rw * .68, 42, '']].forEach(function(a, idx){
   var sx2 = a[0], sw = a[1], topo = ruaY - 26;
   x.fillStyle = N ? (idx % 2 ? '#3b2a4e' : '#44304f') : (idx % 2 ? '#6a5683' : '#76598a'); x.fillRect(sx2, topo + 8, sw, ruaY - topo - 8);
   x.fillStyle = N ? 'rgba(255,226,190,.45)' : 'rgba(255,248,236,.6)'; x.fillRect(sx2 + 4, topo + 13, sw - 8, 9);
   x.fillStyle = idx % 2 ? '#e9b8c7' : '#f2d6ae'; x.beginPath(); x.moveTo(sx2 - 3, topo + 8); x.lineTo(sx2 + sw * .5, topo); x.lineTo(sx2 + sw + 3, topo + 8); x.closePath(); x.fill();
   x.fillStyle = idx % 2 ? '#8a3d58' : '#b3444c'; for(var st = 0; st < 4; st++) x.fillRect(sx2 - 3 + st * (sw + 6) / 4, topo + 8, (sw + 6) / 8, 5);
   if(a[2]){ x.fillStyle = N ? 'rgba(247,224,207,.94)' : 'rgba(90,40,60,.9)'; x.font = '900 7px sans-serif'; x.textAlign = 'center'; x.fillText(a[2], sx2 + sw * .5, topo + 22); }
  });
  multidao(x, R, ruaY + 1, ry + rh - 1, 16, t, N, N ? ['luz', '', 'luz', 'sacola', 'luz', 'crepe'] : ['sacola', '', 'crepe', 'balao', '', 'sacola']);
  for(var r2 = 0; r2 < 6; r2++){
   x.fillStyle = ['rgba(255,226,190,.22)', 'rgba(247,168,210,.18)', 'rgba(167,243,208,.15)'][r2 % 3];
   x.beginPath(); x.ellipse(rx + 17 + r2 * 33, ry + rh - 6, 7 + (r2 % 3) * 2, 1.7, 0, 0, PI2); x.fill();
  }
 }

 // ---------- Tailândia (Wat Arun e o rio Chao Phraya) ----------
 function prang(x, cx, base, w, h, N){   // torre do templo: andares que afinam, com mosaico de porcelana e ponta fina
  var tiers = 7, cor = N ? '#f3cf7a' : '#efe4d0', sombra = N ? '#c99a45' : '#cfc0a6';
  for(var k = 0; k < tiers; k++){
   var y0 = base - h * k / tiers, y1 = base - h * (k + 1) / tiers, w0 = w * (1 - k / tiers * .82), w1 = w * (1 - (k + 1) / tiers * .82);
   x.fillStyle = k % 2 ? sombra : cor;
   x.beginPath(); x.moveTo(cx - w0 / 2, y0); x.lineTo(cx - w1 / 2, y1); x.lineTo(cx + w1 / 2, y1); x.lineTo(cx + w0 / 2, y0); x.closePath(); x.fill();
   x.fillStyle = N ? 'rgba(255,240,200,.7)' : ['#f4a9c0', '#9fd1e8', '#f6d27a'][k % 3];
   for(var d = -2; d <= 2; d++) x.fillRect(cx + d * w0 / 6 - .6, (y0 + y1) / 2 - .6, 1.2, 1.2);
  }
  x.strokeStyle = N ? '#ffe6a8' : '#d9c8a6'; x.lineWidth = 1.3; x.beginPath(); x.moveTo(cx, base - h); x.lineTo(cx, base - h - h * .22); x.stroke();
  x.fillStyle = x.strokeStyle; x.beginPath(); x.arc(cx, base - h - h * .05, 1.6, 0, PI2); x.fill();
 }
 function tailandia(x, R, t, N){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h, i, rio = ry + rh * .7;
  sky(x, R, N ? ['#141a45', '#2b2f6b', '#6a4a86', '#c9768a'] : ['#4fa6e6', '#86c9f0', '#d2efff', '#fff3df']);
  if(N){ estrelas(x, R, 26, t); lua(x, rx + rw * .82, ry + rh * .17, 8); }
  else { sol(x, rx + rw * .84, ry + rh * .18, 9); nuvem(x, rx + rw * .18, ry + rh * .2, .8, 'rgba(255,255,255,.88)'); nuvem(x, rx + rw * .62, ry + rh * .1, .6, 'rgba(255,255,255,.75)'); }
  // cidade baixa ao fundo
  x.fillStyle = N ? '#2a2d55' : '#9fb7cf';
  for(i = 0; i < 11; i++){ var bw = 10 + (i * 7) % 9, bh = 8 + (i * 13) % 14; x.fillRect(rx + i * rw / 10 - 4, rio - 14 - bh, bw, bh + 14); }
  if(N){ x.fillStyle = 'rgba(255,214,140,.75)'; for(i = 0; i < 26; i++) x.fillRect(rx + (i * 37 % rw), rio - 10 - (i * 11 % 16), 1.6, 1.6); }
  // árvores e base do templo
  x.fillStyle = N ? '#1f3a3a' : '#4f9a6c';
  for(i = 0; i < 9; i++){ x.beginPath(); x.arc(rx + i * rw / 8, rio - 7, 9 + (i % 3) * 2, Math.PI, 0); x.fill(); }
  var cx = rx + rw * .5, base = rio - 8;
  x.fillStyle = N ? '#2a2a4a' : '#b9a98e'; x.fillRect(rx, rio - 7, rw, 7);   // margem de pedra até a água
  x.fillStyle = N ? 'rgba(255,220,150,.25)' : 'rgba(255,255,255,.35)'; x.fillRect(rx, rio - 7, rw, 1);
  if(N) glow(x, cx, base - 40, 70, 'rgba(255,200,110,.38)');
  x.fillStyle = N ? '#d9a752' : '#e6d8bf'; x.fillRect(cx - rw * .28, base - 6, rw * .56, 13);
  prang(x, cx - rw * .2, base - 4, 16, 34, N); prang(x, cx + rw * .2, base - 4, 16, 34, N);
  prang(x, cx, base - 4, 30, 70, N);
  // rio
  var w = x.createLinearGradient(0, rio, 0, ry + rh);
  w.addColorStop(0, N ? '#26325e' : '#6fbfd0'); w.addColorStop(1, N ? '#141a3a' : '#3f8ea8');
  x.fillStyle = w; x.fillRect(rx, rio, rw, ry + rh - rio);
  if(N){ for(i = 0; i < 9; i++){ var ry2 = rio + 3 + i * 4; x.fillStyle = 'rgba(255,205,120,' + (.55 - i * .05) + ')'; x.fillRect(cx - 9 + Math.sin(t * .05 + i) * 3, ry2, 18 - i, 1.5); } }
  for(i = 0; i < 10; i++){ var wx = rx + ((i * 23 + t * .25) % (rw + 16)) - 8, wy = rio + 6 + (i % 4) * 7; x.strokeStyle = N ? 'rgba(170,190,255,.25)' : 'rgba(255,255,255,.4)'; x.lineWidth = 1; x.beginPath(); x.moveTo(wx, wy); x.quadraticCurveTo(wx + 5, wy - 1, wx + 10, wy); x.stroke(); }
  // barco de cauda longa com guirlanda na proa
  var bx = rx + ((t * .35) % (rw + 80)) - 40, by = rio + 22;
  x.fillStyle = N ? '#3a2a3a' : '#8a4b2c';
  x.beginPath(); x.moveTo(bx - 22, by - 4); x.quadraticCurveTo(bx - 6, by + 4, bx + 18, by + 1); x.lineTo(bx + 26, by - 7); x.lineTo(bx + 18, by - 2); x.lineTo(bx - 18, by - 2); x.closePath(); x.fill();
  x.fillStyle = ['#ff6fa8', '#ffd25e', '#7cf29a'][Math.floor(t / 40) % 3]; x.fillRect(bx + 20, by - 9, 4, 3);
  x.fillStyle = N ? '#ffd98a' : '#f5e8d6'; x.fillRect(bx - 8, by - 9, 14, 6);
  x.strokeStyle = N ? '#5a4a5a' : '#555'; x.lineWidth = 1; x.beginPath(); x.moveTo(bx - 22, by - 4); x.lineTo(bx - 34, by + 3); x.stroke();
 }

 // ---------- Harajuku (rua Takeshita) ----------
 function harajuku(x, R, t, N){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h, i, chao = ry + rh - 18, fy = ry + rh * .26;
  sky(x, R, N ? ['#1d1440', '#3a1f63', '#7a3c8c'] : ['#8fd3ff', '#c9e9ff', '#ffe8f6']);
  if(N) estrelas(x, R, 14, t); else { nuvem(x, rx + rw * .22, ry + rh * .12, .7, 'rgba(255,255,255,.9)'); nuvem(x, rx + rw * .74, ry + rh * .09, .6, 'rgba(255,255,255,.85)'); }
  // fachadas dos dois lados, em perspectiva
  var lojas = N ? ['#3b2a63', '#4a2c5e', '#2e3566', '#55305f'] : ['#ffc6dd', '#c8b6ff', '#b8ecff', '#fff0a8'];
  var neon = ['#ff5fb0', '#5ff2ff', '#ffe066', '#b47bff', '#7cf29a'];
  for(var lado = 0; lado < 2; lado++) for(i = 0; i < 3; i++){
   var near = i === 0, w = rw * (near ? .22 : i === 1 ? .14 : .09), h = rh * (near ? .74 : i === 1 ? .6 : .48);
   var bx = lado ? rx + rw - w - (i === 0 ? 0 : i === 1 ? rw * .22 : rw * .36) : rx + (i === 0 ? 0 : i === 1 ? rw * .22 : rw * .36);
   var by = chao - h;
   x.fillStyle = lojas[(i + lado * 2) % 4]; x.fillRect(bx, by, w, h);
   x.fillStyle = N ? 'rgba(255,220,250,.25)' : 'rgba(255,255,255,.55)';
   for(var wy = by + 10; wy < chao - 14; wy += 10) x.fillRect(bx + 3, wy, w - 6, 4);
   // placa vertical
   var nc = neon[(i * 2 + lado) % neon.length], px = lado ? bx + 2 : bx + w - 8;
   x.save(); if(N){ x.shadowColor = nc; x.shadowBlur = 8; }
   x.fillStyle = N ? nc : mix(nc, '#ffffff', .25); rr(x, px, by + 6, 6, Math.min(30, h * .45), 2); x.fill(); x.restore();
   // toldo
   x.fillStyle = i % 2 ? '#ff7eb6' : '#7ec8ff'; x.fillRect(bx, chao - 16, w, 3);
   for(var s = 0; s < w; s += 6){ x.fillStyle = (s / 6) % 2 ? '#ffffff' : (i % 2 ? '#ff7eb6' : '#7ec8ff'); x.fillRect(bx + s, chao - 13, 3, 3); }
  }
  // portal da rua
  var gx0 = rx + rw * .28, gx1 = rx + rw * .72;
  x.fillStyle = N ? '#2a2347' : '#6b5a8f'; x.fillRect(gx0, fy, 3, chao - fy); x.fillRect(gx1 - 3, fy, 3, chao - fy);
  x.save(); if(N){ x.shadowColor = '#ff7ed0'; x.shadowBlur = 10; }
  var pg = x.createLinearGradient(gx0, 0, gx1, 0); pg.addColorStop(0, '#ff8ccf'); pg.addColorStop(.5, '#c39bff'); pg.addColorStop(1, '#7fd8ff');
  x.fillStyle = pg; rr(x, gx0 - 4, fy - 12, gx1 - gx0 + 8, 13, 4); x.fill(); x.restore();
  x.fillStyle = '#ffffff'; x.font = '900 7px sans-serif'; x.textAlign = 'center'; x.fillText('竹下通り', (gx0 + gx1) / 2, fy - 3);
  // balões no portal
  [[gx0 - 1, '#ff7eb6', -5], [gx0 + 4, '#ffe066', -3], [gx1 + 1, '#7ec8ff', 5], [gx1 - 4, '#ff9cc8', 3]].forEach(function(b, k){   // balões amarrados no portal
   var ax = b[0], ay = fy - 6, bx = ax + b[2] + Math.sin(t * .04 + k) * 1.2, by = fy - 22 - (k % 2) * 4;
   x.strokeStyle = 'rgba(255,255,255,.8)'; x.lineWidth = .6; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by + 3.6); x.stroke();
   x.fillStyle = b[1]; x.beginPath(); x.ellipse(bx, by, 3.2, 4, 0, 0, PI2); x.fill();
   x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(bx - 1, by - 1.4, .9, 1.3, 0, 0, PI2); x.fill();
  });
  // loja de crepe no fim da rua
  var cx = rx + rw * .5, cy = chao - 26;
  x.fillStyle = N ? '#3a2a55' : '#ffffff'; x.fillRect(cx - 18, cy, 36, 26);
  x.fillStyle = N ? '#ffd2e8' : '#ff9cc8'; x.fillRect(cx - 20, cy - 3, 40, 5);
  x.fillStyle = '#f7d79a'; x.beginPath(); x.moveTo(cx - 6, cy + 18); x.lineTo(cx, cy + 6); x.lineTo(cx + 6, cy + 18); x.closePath(); x.fill();
  x.fillStyle = '#ffffff'; x.beginPath(); x.arc(cx, cy + 7, 4, 0, PI2); x.fill(); x.fillStyle = '#ff6f9f'; x.beginPath(); x.arc(cx + 1, cy + 4, 1.6, 0, PI2); x.fill();
  // chão da rua
  var g = x.createLinearGradient(0, chao, 0, ry + rh); g.addColorStop(0, N ? '#2b2440' : '#e9dff2'); g.addColorStop(1, N ? '#1b1630' : '#d6c8e6');
  x.fillStyle = g; x.fillRect(rx, chao, rw, ry + rh - chao);
  if(N) for(i = 0; i < 6; i++){ x.fillStyle = ['rgba(255,95,176,.25)', 'rgba(95,242,255,.22)', 'rgba(255,224,102,.2)'][i % 3]; x.beginPath(); x.ellipse(rx + 18 + i * 34, ry + rh - 7, 9, 1.8, 0, 0, PI2); x.fill(); }
  // rua lotada: gente fazendo compras, comendo crepe, com balões e lightsticks
  multidao(x, R, chao - 1, chao + 3, 16, t, N, N ? ['luz', 'luz', 'sacola', 'luz', 'crepe', 'luz'] : ['sacola', 'crepe', 'balao', 'sacola', '', 'luz'], .12);
  multidao(x, R, chao + 4, ry + rh - 1, 20, t + 500, N, N ? ['luz', 'sacola', 'luz', 'balao', 'luz'] : ['crepe', 'sacola', 'balao', '', 'sacola', 'luz'], .2);
 }

 // ---------- Praia ----------
 function coqueiro(x, bx, by, h, lado, N){
  x.strokeStyle = N ? '#3a2a24' : '#9a6a3e'; x.lineWidth = 3; x.beginPath(); x.moveTo(bx, by); x.quadraticCurveTo(bx + lado * h * .15, by - h * .55, bx + lado * h * .32, by - h); x.stroke();
  var tx = bx + lado * h * .32, ty = by - h;
  x.fillStyle = N ? '#1f4038' : '#3fae6a';
  [-2.6, -1.9, -1.2, -.5, .2].forEach(function(a){ var ax = Math.cos(a) * 18, ay = Math.sin(a) * 9; x.beginPath(); x.moveTo(tx, ty); x.quadraticCurveTo(tx + ax * .6, ty + ay - 6, tx + ax, ty + ay + 5); x.quadraticCurveTo(tx + ax * .5, ty + ay - 1, tx, ty + 1); x.fill(); });
  x.fillStyle = N ? '#3a2a24' : '#7a4a2a'; x.beginPath(); x.arc(tx - 1, ty + 3, 2, 0, PI2); x.arc(tx + 2, ty + 3.5, 2, 0, PI2); x.fill();
 }
 function praia(x, R, t, N){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h, i, mar = ry + rh * .5, areia = ry + rh * .76;
  sky(x, R, N ? ['#0f1a44', '#23336e', '#4b4f8f', '#7d6aa8'] : ['#3fa2e8', '#7fcaf5', '#c9ecff', '#fff4dc']);
  var ax = rx + rw * .62, ay = ry + rh * .26;
  if(N){ estrelas(x, R, 24, t); lua(x, ax, ay, 9); } else { sol(x, ax, ay, 11); nuvem(x, rx + rw * .2, ry + rh * .16, .8, 'rgba(255,255,255,.9)'); }
  var g = x.createLinearGradient(0, mar, 0, areia); g.addColorStop(0, N ? '#1d2c64' : '#2f9fd8'); g.addColorStop(1, N ? '#24407a' : '#5fd0e6');
  x.fillStyle = g; x.fillRect(rx, mar, rw, areia - mar);
  // caminho de luz do sol/lua no mar
  for(i = 0; i < 8; i++){ var yy = mar + 3 + i * 4.5; x.fillStyle = N ? 'rgba(255,236,190,' + (.5 - i * .05) + ')' : 'rgba(255,255,220,' + (.6 - i * .06) + ')'; x.fillRect(ax - (10 - i) + Math.sin(t * .05 + i) * 2, yy, (10 - i) * 2, 1.5); }
  for(i = 0; i < 12; i++){ var wx = rx + ((i * 21 + t * .3) % (rw + 16)) - 8, wy = mar + 6 + (i % 5) * 5; x.strokeStyle = 'rgba(255,255,255,' + (N ? .22 : .5) + ')'; x.lineWidth = 1; x.beginPath(); x.moveTo(wx, wy); x.quadraticCurveTo(wx + 5, wy - 1.5, wx + 10, wy); x.stroke(); }
  // espuma e areia
  x.fillStyle = N ? 'rgba(220,230,255,.5)' : 'rgba(255,255,255,.85)';
  x.beginPath(); x.moveTo(rx, areia); for(i = 0; i <= 10; i++) x.lineTo(rx + i * rw / 10, areia - 2 - Math.sin(t * .04 + i) * 1.5); x.lineTo(rx + rw, areia + 2); x.lineTo(rx, areia + 2); x.closePath(); x.fill();
  var s = x.createLinearGradient(0, areia, 0, ry + rh); s.addColorStop(0, N ? '#6a5a7a' : '#f7dca0'); s.addColorStop(1, N ? '#4a3e5e' : '#efc77f');
  x.fillStyle = s; x.fillRect(rx, areia + 1, rw, ry + rh - areia);
  // guarda-sóis
  [[rx + rw * .3, '#ff7eb6'], [rx + rw * .58, '#7ec8ff']].forEach(function(u, k){
   var ux = u[0], uy = areia + 6;
   x.strokeStyle = N ? '#5a4a5a' : '#8a6a4a'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(ux, uy + 16); x.lineTo(ux + 2, uy - 6); x.stroke();
   x.fillStyle = N ? mix(u[1], '#2a2050', .45) : u[1]; x.beginPath(); x.moveTo(ux - 14, uy - 2); x.quadraticCurveTo(ux + 2, uy - 18, ux + 18, uy - 6); x.closePath(); x.fill();
   x.fillStyle = N ? 'rgba(255,255,255,.3)' : '#ffffff'; x.beginPath(); x.moveTo(ux - 6, uy - 7); x.quadraticCurveTo(ux + 1, uy - 15, ux + 2, uy - 14); x.lineTo(ux + 4, uy - 6); x.closePath(); x.fill();
   if(!k && !N){ x.fillStyle = '#ffe066'; rr(x, ux + 4, uy + 10, 14, 4, 2); x.fill(); }
  });
  var h1 = rh * .62, h2 = rh * .55, t1 = [rx + 10 + h1 * .32, ry + rh - 4 - h1], t2 = [rx + rw - 8 - h2 * .32, ry + rh - 2 - h2];
  coqueiro(x, rx + 10, ry + rh - 4, h1, 1, N); coqueiro(x, rx + rw - 8, ry + rh - 2, h2, -1, N);
  if(N){
   // varal de luzinhas entre os coqueiros e fogueira
   var my2 = Math.max(t1[1], t2[1]) + 22; x.strokeStyle = 'rgba(40,30,50,.8)'; x.lineWidth = .8; x.beginPath(); x.moveTo(t1[0], t1[1] + 4); x.quadraticCurveTo((t1[0] + t2[0]) / 2, my2, t2[0], t2[1] + 4); x.stroke();
   for(i = 1; i <= 9; i++){ var u = i / 10, lx = (1 - u) * (1 - u) * t1[0] + 2 * (1 - u) * u * (t1[0] + t2[0]) / 2 + u * u * t2[0], ly = (1 - u) * (1 - u) * (t1[1] + 4) + 2 * (1 - u) * u * my2 + u * u * (t2[1] + 4) + 1.5; x.save(); x.shadowColor = '#ffd98a'; x.shadowBlur = 6; x.fillStyle = ['#ffd98a', '#ff9fb6', '#a7f3d0'][i % 3]; x.beginPath(); x.arc(lx, ly, 1.8, 0, PI2); x.fill(); x.restore(); }
   var fx = rx + rw * .8, fy = ry + rh - 10, f = Math.sin(t * .25) * 1.5;
   glow(x, fx, fy - 6, 26, 'rgba(255,150,60,.5)');
   x.fillStyle = '#ff8a2a'; x.beginPath(); x.moveTo(fx - 6, fy); x.quadraticCurveTo(fx - 4, fy - 12 - f, fx, fy - 16 - f); x.quadraticCurveTo(fx + 4, fy - 10 + f, fx + 6, fy); x.closePath(); x.fill();
   x.fillStyle = '#ffe066'; x.beginPath(); x.moveTo(fx - 3, fy); x.quadraticCurveTo(fx - 1, fy - 7, fx, fy - 9 + f); x.quadraticCurveTo(fx + 2, fy - 6, fx + 3, fy); x.closePath(); x.fill();
   x.strokeStyle = '#5a3a2a'; x.lineWidth = 2; x.beginPath(); x.moveTo(fx - 8, fy + 1); x.lineTo(fx + 8, fy - 1); x.moveTo(fx - 8, fy - 1); x.lineTo(fx + 8, fy + 1); x.stroke();
  } else {
   // pipa no céu
   var kx = rx + rw * .36 + Math.sin(t * .02) * 6, ky = ry + rh * .2 + Math.cos(t * .03) * 3;
   x.fillStyle = '#ff6fa8'; x.beginPath(); x.moveTo(kx, ky - 6); x.lineTo(kx + 5, ky); x.lineTo(kx, ky + 7); x.lineTo(kx - 5, ky); x.closePath(); x.fill();
   var hx = rx + rw * .44, hy = ry + rh - 6;   // quem segura a pipa, em pé na areia
   pessoa(x, hx, hy, 1.1, 2, t, false, '', -1);
   x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = .8; x.beginPath(); x.moveTo(kx, ky + 7); x.quadraticCurveTo(kx + 2, ky + 30, hx - 4, hy - 9); x.stroke();
  }
 }

 // Pessoas da multidão: pés sempre na linha do chão (fy). De dia, roupas coloridas; de noite, silhuetas com lightstick neon,
 // como a plateia do Center⭐Run!. item: 'luz' (lightstick), 'sacola', 'balao' (preso na mão), 'crepe' ou ''.
 var ROUPAS_DIA = ['#ff8fc4', '#7ec8ff', '#ffd76a', '#b79cff', '#7fe0b0', '#ffb38a', '#ffffff'];
 var CABELOS = ['#2a1f2e', '#5a3a2a', '#f2d27a', '#ff7eb6', '#7a5cff', '#1d2b55', '#c8c8d8'];
 var NEON = ['#ff5fb0', '#5ff2ff', '#ffe066', '#b47bff', '#7cf29a', '#9b30d9', '#b6ff3b', '#4169e1'];
 function pessoa(x, px, fy, s, k, t, N, item, dir){
  var passo = Math.sin(t * .18 + k * 1.7), corpo = N ? '#1e293b' : ROUPAS_DIA[k % ROUPAS_DIA.length], pele = N ? '#1e293b' : ['#f1c9a5', '#d9a074', '#8d5a3b', '#fbe5d8'][k % 4];
  var perna = 4 * s, tronco = 7 * s, larg = 5.6 * s, cab = 2.7 * s, bob = Math.abs(passo) * .5 * s;
  x.fillStyle = N ? '#141c2e' : '#3a3550';
  x.fillRect(px - larg * .38 + passo * s * .8, fy - perna, 1.8 * s, perna);
  x.fillRect(px + larg * .1 - passo * s * .8, fy - perna, 1.8 * s, perna);
  x.fillStyle = corpo; rr(x, px - larg / 2, fy - perna - tronco - bob, larg, tronco, 1.5 * s); x.fill();
  var hy = fy - perna - tronco - cab - bob;
  x.fillStyle = pele; x.beginPath(); x.arc(px, hy, cab, 0, PI2); x.fill();
  x.fillStyle = N ? '#0f1626' : CABELOS[(k * 3) % CABELOS.length]; x.beginPath(); x.arc(px, hy - cab * .15, cab * 1.05, Math.PI, 0); x.fill();
  var mx = px + (dir || 1) * larg * .62, my = fy - perna - tronco * .55 - bob;
  if(item === 'luz'){ var c = NEON[k % NEON.length], up = Math.abs(Math.sin(t * .12 + k)) * 2 * s; x.save(); if(N){ x.shadowColor = c; x.shadowBlur = 6; } x.fillStyle = c; x.fillRect(mx - .7 * s, my - 6 * s - up, 1.5 * s, 6.5 * s); x.restore(); }
  else if(item === 'sacola'){ x.fillStyle = NEON[(k + 2) % NEON.length]; x.fillRect(mx - 1.6 * s, my, 3.2 * s, 3.2 * s); x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = .5; x.strokeRect(mx - 1.6 * s, my, 3.2 * s, 3.2 * s); }
  else if(item === 'balao'){ var bx = mx + Math.sin(t * .05 + k) * s, by = my - 11 * s; x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = .6; x.beginPath(); x.moveTo(mx, my); x.lineTo(bx, by + 2.4 * s); x.stroke(); x.fillStyle = ['#ff7eb6', '#ffe066', '#7ec8ff'][k % 3]; x.beginPath(); x.ellipse(bx, by, 2 * s, 2.5 * s, 0, 0, PI2); x.fill(); }
  else if(item === 'crepe'){ x.fillStyle = '#f2c27a'; x.beginPath(); x.moveTo(mx - 1.2 * s, my - 2.6 * s); x.lineTo(mx, my + .8 * s); x.lineTo(mx + 1.2 * s, my - 2.6 * s); x.closePath(); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(mx, my - 2.8 * s, 1.2 * s, 0, PI2); x.fill(); }
 }
 // multidão andando numa faixa de chão [y0, y1] (mais longe = menor); cada pessoa entra por um lado e sai pelo outro
 function multidao(x, R, y0, y1, n, t, N, itens, vel){
  var L = [];
  for(var k = 0; k < n; k++){
   var prof = (k * .618) % 1, fy = y0 + (y1 - y0) * prof, s = .55 + prof * .55, dir = k % 3 ? 1 : -1, v = (vel || .16) * (.6 + (k % 4) * .2);
   var span = R.w + 30, px = R.x - 15 + (((k * 37.7 + dir * t * v) % span) + span) % span;
   L.push([fy, px, s, k, dir]);
  }
  L.sort(function(a, b){ return a[0] - b[0]; });
  L.forEach(function(p){ var it = itens[p[3] % itens.length]; pessoa(x, p[1], p[0], p[2], p[3], t, N, it, p[4]); });
 }

 var CENAS = { gigoia:gigoia, liberdade:liberdade, tailandia:tailandia, harajuku:harajuku, praia:praia };

 // Vidro e moldura da janela (iguais aos da sala original)
 function vidro(x, R){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h, g = x.createLinearGradient(rx, ry, rx + rw, ry + rh);
  g.addColorStop(0, 'rgba(202,235,255,.12)'); g.addColorStop(.45, 'rgba(226,245,255,.03)'); g.addColorStop(1, 'rgba(178,218,255,.16)');
  x.fillStyle = g; x.fillRect(rx, ry, rw, rh);
  x.fillStyle = 'rgba(255,255,255,.13)'; x.beginPath(); x.moveTo(rx + 8, ry + 8); x.lineTo(rx + rw * .22, ry + 8); x.lineTo(rx + rw * .04, ry + rh * .56); x.lineTo(rx + 8, ry + rh * .64); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(245,252,255,.2)'; x.lineWidth = 2; x.beginPath();
  x.moveTo(rx + rw * .64, ry + 3); x.lineTo(rx + rw * .51, ry + rh * .5); x.moveTo(rx + rw * .69, ry + 3); x.lineTo(rx + rw * .56, ry + rh * .5); x.stroke();
 }
 function moldura(x, R){
  var rx = R.x, ry = R.y, rw = R.w, rh = R.h;
  x.save(); x.shadowColor = 'rgba(1,3,15,.48)'; x.shadowBlur = 9; x.shadowOffsetY = 4;
  x.strokeStyle = '#30224d'; x.lineWidth = 8; rr(x, rx - 2, ry - 2, rw + 4, rh + 4, 14); x.stroke();
  x.shadowBlur = 0; x.shadowOffsetY = 0;
  x.strokeStyle = '#b9a6e7'; x.lineWidth = 1.6; rr(x, rx - 2, ry - 2, rw + 4, rh + 4, 14); x.stroke();
  x.strokeStyle = '#6d5b91'; x.lineWidth = 5; rr(x, rx + 2, ry + 2, rw - 4, rh - 4, 10); x.stroke();
  x.strokeStyle = 'rgba(246,249,255,.42)'; x.lineWidth = 1.2; x.beginPath();
  x.moveTo(rx + rw * .5, ry + 4); x.lineTo(rx + rw * .5, ry + rh - 4); x.moveTo(rx + 4, ry + rh * .52); x.lineTo(rx + rw - 4, ry + rh * .52); x.stroke();
  x.fillStyle = 'rgba(255,255,255,.6)'; rr(x, rx + 8, ry + 5, 32, 2, 1); x.fill();
  x.restore();
 }

 // Desenha a janela inteira (cena + vidro + moldura). key/night vazios = os da semana e da hora atuais.
 function draw(x, rx, ry, rw, rh, t, key, night){
  var now = Date.now(), R = { x:rx, y:ry, w:rw, h:rh };
  key = CENAS[key] ? key : viewFor(now);
  if(typeof night !== 'boolean') night = isNight(now);
  t = t || 0;
  x.save();
  x.shadowColor = 'rgba(0,0,0,.42)'; x.shadowBlur = 14; x.shadowOffsetY = 5;
  rr(x, rx, ry, rw, rh, 13); x.clip();
  x.shadowBlur = 0; x.shadowOffsetY = 0;
  CENAS[key](x, R, t, night);
  vidro(x, R);
  if(key === 'liberdade') liberdadeFrente(x, R, t, night);
  x.restore();
  moldura(x, R);
  return key;
 }

 // Apenas a PAISAGEM por trás da janela: sem vidro, divisórias ou moldura.
 // Idol⭐News! usa a arte oficial das cinco vistas, sem redesenhar cenários.
 function drawScene(x, rx, ry, rw, rh, t, key, night){
  var now = Date.now(), R = { x:rx, y:ry, w:rw, h:rh };
  key = CENAS[key] ? key : viewFor(now);
  if(typeof night !== 'boolean') night = isNight(now);
  t = t || 0;
  x.save();
  x.beginPath(); x.rect(rx, ry, rw, rh); x.clip();
  CENAS[key](x, R, t, night);
  if(key === 'liberdade') liberdadeFrente(x, R, t, night);
  x.restore();
  return key;
 }

 return Object.freeze({ VIEWS:VIEWS.slice(), NAMES:NAMES, SONGS:SONGS, viewFor:viewFor, songFor:songFor, nextChange:nextChange, isNight:isNight, weekIndex:weekIndex, draw:draw, drawScene:drawScene });
});
