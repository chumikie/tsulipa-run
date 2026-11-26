/* Moon⭐Duo! — cenas de dupla com outro Idol: desenho, telas, abas, lojinha de poses/extras, itens travados e aviso.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 4), sem mudar nada: mesmo nome, mesmo código.
   Desde 17/11/2026 baixa só quando o Duo abre (duo-base.js chama); o estado, a lojinha e o que o resto do site usa ficam no
   duo-base.js. Este arquivo só DECLARA funções e tabelas fixas; antes carregava antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (estado, janela do Duo, listeners e inicialização continuam lá). */
// A roupa de cada um vem do banco (foto do perfil); aqui só se monta a cena: pose, cenário, expressão e falas.
var DUO_CENAS = [   // [chave, emoji, nome, minha pose, pose do convidado, distância entre os dois (em unidades do personagem), expressão padrão, item da lojinha]
  ['dueto',     '🎤', 'Dueto',            'mic',     'mic',     52, 2],
  ['vv',        '✌️', 'Pose dupla',       'v',       'v',       48, 2],
  ['coracao',   '🫶', 'Coração juntos',   'coracao', 'coracao', 50, 2],
  ['maos',      '🤝', 'Mãos dadas',       'dmao',    'dmao',    44, 2],
  ['hightouch', '🙌', 'High-touch',       'dhigh',   'dhigh',   42, 2],
  ['guarda',    '☂️', 'Guarda-chuva',     'dguarda', '',        40, 2, 'duo_guarda'],
  ['comida',    '🍓', 'Comidinha',        'dsegura', 'dsegura', 46, 2],
  ['danca',     '💃', 'Dança',            '*',       '*',       52, 2],
  ['selfie',    '🤳', 'Selfie',           'dselfie', 'v',       38, 3, 'duo_selfie'],
  ['seis',      '6️⃣', 'Six Seven',        'dseis',   'dseis',   50, 3, 'duo_seis'],
  ['neon',      '✨', 'Pose Neon',        'dneon',   'dneon',   50, 3, 'duo_neon'],
  ['luzes',     '💜', 'Lightsticks',      'luz',     'luz',     50, 2],
  ['pets',      '🐾', 'Com os pets',      'tchau',   'tchau',   62, 2]
];
var DUO_DANCA = ['banzai', 'v', 'dneon', 'tchau', 'dseis'];
var DUO_FUNDO_EXTRA = [['cafe', '☕', 'Café kawaii']];
var DUO_PRES_EMO = ['🌸', '🍓', '🧸', '💌', '🎀', '⭐'];
var DUO_FALAS_CENA = {
  dueto:['Nossa harmonia ficou perfeita! 🎵'], coracao:['Esse coração é pra você! 🫶'], maos:['Juntos a gente vai mais longe! 🤝'],
  hightouch:['Toca aqui! Arrasamos! 🙌'], guarda:['Debaixo do guarda-chuva tá quentinho! ☂️'], comida:['Itadakimasu! Tá uma delícia! 🍓'],
  danca:['Não para de dançar! 💃'], selfie:['Sorria! Essa vai pro álbum! 📸'], seis:['Six... SEVEN! 🙌'], neon:['Brilhando igual neon! ✨'],
  luzes:['Acende o lightstick! 💜'], pets:['Os pets também viraram amigos! 🐾']
};
var DUO_FALA_OSHI = 'Bora torcer por {oshi} juntos! 💖';
var duoBalao = null, duoPulo = null, duoRegistrados = {}, duoPresEmo = '🧸', duoPresQt = 0, duoOff = null, duoPoseForce = ''; var duoOffS = 1;
var DUO_OW = 680, DUO_OH = 560;   // largo para o brilho dos visuais não ficar cortado
function duoBraco(x1, y1, x2, y2){ g.save(); g.lineCap = 'round'; g.strokeStyle = g.fillStyle; g.lineWidth = 4; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
function duoMao(x, y, c, ang){
  // Palma e polegar arredondados, na mesma escala do braço; a pose continua no ponto original.
  g.save();g.translate(x,y);g.rotate(ang||0);g.fillStyle=c.skin;
  g.beginPath();g.ellipse(0,0,2.65,2.25,0,0,Math.PI*2);g.ellipse(-1.35,-1.6,1.15,1.45,-.4,0,Math.PI*2);g.fill();
  g.restore();
}
function duoGeo(av, t){ var big = av && av.visual === 'mega', sc = DUO_OH / (big ? 68 : 82), ch = DUO_OH * (big ? .95 : .9); return { sc:sc, ch:ch, tx:DUO_OW / 2 - 15 * sc, ty:ch - 44 * sc, bob:t && !(typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches) ? Math.sin(t * .06) * .85 * sc : 0 }; }
function duoIdolEm(x, av, sx, chao, pose, expr, t, espelho){
  // duoOffS: a câmera (tw-camera.js) desenha a foto em 2×/3×; o rascunho de cada Idol acompanha para não borrar
  var S = duoOffS || 1;
  if(!duoOff || duoOff.__s !== S){ duoOff = document.createElement('canvas'); duoOff.width = DUO_OW * S; duoOff.height = DUO_OH * S; duoOff.__s = S; }
  var o = duoOff.getContext('2d'); o.setTransform(S, 0, 0, S, 0, 0); o.clearRect(0, 0, DUO_OW, DUO_OH);
  var a = JSON.parse(JSON.stringify(av || {})), G = duoGeo(a, t);
  a.pet = null; a.expr = expr; a.pose = DUO_POSE_FN[pose] ? 'v' : (perfPoseInfo(pose) ? pose : '');
  duoPoseForce = DUO_POSE_FN[pose] ? pose : '';
  try{ perfDesenharIdol(o, DUO_OW, DUO_OH, a, false, false, t); }catch(e){}
  finally{ duoPoseForce = ''; }
  var ox = sx - DUO_OW / 2, oy = chao - G.ch;
  x.save(); if(espelho){ x.translate(sx * 2, 0); x.scale(-1, 1); }
  x.drawImage(duoOff, ox, oy, DUO_OW, DUO_OH); x.restore();
}
function duoPonto(av, sx, chao, t, espelho, u, v){   // ponto do personagem (unidades do drawChar) → ponto do palco
  var G = duoGeo(av, t), X = sx - DUO_OW / 2 + G.tx + u * G.sc, Y = chao - G.ch + G.ty + v * G.sc + G.bob;
  return [espelho ? 2 * sx - X : X, Y];
}
function duoCoracao(x, cx, cy, r, cor){ x.fillStyle = cor; x.beginPath(); x.moveTo(cx, cy + r * .9); x.bezierCurveTo(cx - r * 1.4, cy - r * .1, cx - r * .7, cy - r * 1.1, cx, cy - r * .35); x.bezierCurveTo(cx + r * .7, cy - r * 1.1, cx + r * 1.4, cy - r * .1, cx, cy + r * .9); x.fill(); }
function duoEstrela(x, sx, sy, r, cor, gira){ x.fillStyle = cor; x.beginPath(); for(var q = 0; q < 10; q++){ var rr = q % 2 ? r * .42 : r, an = q * Math.PI / 5 - Math.PI / 2 + (gira || 0); x[q ? 'lineTo' : 'moveTo'](sx + Math.cos(an) * rr, sy + Math.sin(an) * rr); } x.closePath(); x.fill(); }
function duoMeuAv(){ return lookAtual(); }   // no Moon⭐Duo! você aparece com o look que está vestindo agora
function duoGuAv(){ var a = duoGu && duoGu.look && typeof duoGu.look === 'object' ? duoGu.look : duoGu && duoGu.avatar && typeof duoGu.avatar === 'object' ? duoGu.avatar : {}; return lookSemRank(a); }
function duoMeuPet(){ var k = petData && petData.ativo; return k && PET_SP[k] ? { k:k, acc:(petData.pets && petData.pets[k] && petData.pets[k].acc) || '', cfg:petData.pets && petData.pets[k] && petData.pets[k].cfg } : null; }
function duoInfo(){ for(var i = 0; i < DUO_CENAS.length; i++) if(DUO_CENAS[i][0] === duoCena) return DUO_CENAS[i]; return DUO_CENAS[0]; }
var duoQuadro='aberto', duoInvertido=false;
function duoQuadroGeo(w,h,unidade,cena){
  var deslocamento=cena[5]*unidade/2*(duoInvertido?-1:1);
  return {eu:w/2-deslocamento,gu:w/2+deslocamento,pivo:h*.42,zoom:duoQuadro==='perto'?1.13:1};
}
// Hitbox acompanha a escala real de cada Idol, inclusive quando só um usa o visual Mega.
function duoAlvoToque(px,py,chao,q,escEu,escGu){
  var alvos=[{k:'eu',x:q.eu,sc:escEu},{k:'gu',x:q.gu,sc:escGu}].filter(function(a){
    return py>=chao-52*a.sc&&py<=chao+10&&Math.abs(px-a.x)<20*a.sc;
  });
  alvos.sort(function(a,b){return Math.abs(px-a.x)/a.sc-Math.abs(px-b.x)/b.sc;});
  return alvos.length?alvos[0].k:'';
}
function duoRender(x, W2, H2, comFundo, comUI){
  var reduzDuo=typeof matchMedia==='function'&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t = reduzDuo?1:(duoT || 1), inf = duoInfo(), eu = duoMeuAv(), gu = duoGuAv();
  var G = duoGeo(eu, t), U = G.sc, chao = H2 * .9, q=duoQuadroGeo(W2,H2,U,inf), sxE=q.eu, sxG=q.gu, i;
  var poseE = inf[3], poseG = inf[4], exE = duoExEu === '' ? inf[6] : +duoExEu, exG = duoExGu === '' ? inf[6] : +duoExGu;
  if(inf[0] === 'danca'){ poseE = poseG = DUO_DANCA[Math.floor(t / 46) % DUO_DANCA.length]; }
  if(inf[0] === 'guarda') poseG = '';
  x.clearRect(0, 0, W2, H2);
  if(comFundo) duoFundoDesenhar(x, W2, H2, duoFundo, t, perfChar(eu).hair);
  x.save();x.translate(W2/2,q.pivo);x.scale(q.zoom,q.zoom);x.translate(-W2/2,-q.pivo);
  // efeitos de fundo da cena
  if(inf[0] === 'dueto'){ [sxE, sxG].forEach(function(sx){ var lg = x.createLinearGradient(sx, 0, sx, chao); lg.addColorStop(0, 'rgba(255,248,200,.55)'); lg.addColorStop(1, 'rgba(255,248,200,0)'); x.fillStyle = lg; x.beginPath(); x.moveTo(sx - 18, 0); x.lineTo(sx + 18, 0); x.lineTo(sx + 95, chao); x.lineTo(sx - 95, chao); x.closePath(); x.fill(); }); }
  if(inf[0] === 'luzes' || inf[0] === 'neon'){ for(i = 0; i < 26; i++){ var cc = ['#ff6fb5', '#4dd8ff', '#b6ff3b', '#9b30d9', '#ffe14d'][i % 5]; x.globalAlpha = .35 + .3 * Math.sin(t * .08 + i); x.fillStyle = cc; x.beginPath(); x.arc((cenaHash(i) * W2), H2 * .55 + cenaHash(i + 40) * H2 * .3, 5 + (i % 3) * 2, 0, 7); x.fill(); } x.globalAlpha = 1; }
  if(inf[0] === 'neon'){ x.save(); x.lineWidth = 6; x.shadowBlur = 18; ['#ff6fb5', '#4dd8ff', '#b6ff3b'].forEach(function(cc, j){ x.strokeStyle = cc; x.shadowColor = cc; x.globalAlpha = .55 + .35 * Math.sin(t * .1 + j * 2); x.beginPath(); x.moveTo(0, H2 * (.18 + j * .09)); x.lineTo(W2, H2 * (.3 + j * .09) + Math.sin(t * .05 + j) * 20); x.stroke(); }); x.restore(); }
  // os dois Idols (com pulinho ao tocar e passinho na dança)
  function pulo(quem){ if(reduzDuo||!duoPulo || duoPulo.quem !== quem) return 0; var p = (t - duoPulo.t0) / 22; if(p < 0 || p >= 1) return 0; return -Math.sin(p * Math.PI) * 34; }
  // A dupla divide a batida, com resposta ligeiramente atrasada do convidado.
  // As âncoras das mãos e adereços recebem exatamente a mesma altura.
  var danca=inf[0]==='danca'&&!reduzDuo;
  var dz=danca?-Math.pow(Math.max(0,Math.sin(t*.136)),2)*12:0;
  var dzGu=danca?-Math.pow(Math.max(0,Math.sin((t-3)*.136)),2)*12:0;
  var chE = chao + pulo('eu') + dz, chG = chao + pulo('gu') + dzGu;
  if(inf[0] === 'guarda') duoGuardaChuva(x, eu, sxE, chE, t, duoInvertido);
  duoIdolEm(x, eu, sxE, chE, poseE, exE, t, duoInvertido);
  duoIdolEm(x, gu, sxG, chG, poseG, exG, t + 37, !duoInvertido);
  // enfeites da cena por cima
  var mE = duoPonto(eu, sxE, chE, t, duoInvertido, 15, 27), mG = duoPonto(gu, sxG, chG, t + 37, !duoInvertido, 15, 27);
  if(inf[0] === 'coracao'){ var pu = 1 + .08 * Math.sin(t * .12); duoCoracao(x, W2 / 2, (mE[1] + mG[1]) / 2 - 30, 34 * pu, '#ff4f9a'); duoCoracao(x, W2 / 2 - 10, (mE[1] + mG[1]) / 2 - 42, 8 * pu, 'rgba(255,255,255,.7)'); }
  if(inf[0] === 'maos' || inf[0] === 'coracao' || inf[0] === 'pets'){ for(i = 0; i < 6; i++){ var hy = ((t * 1.1 + i * 55) % 260); x.globalAlpha = Math.max(0, 1 - hy / 260); duoCoracao(x, W2 / 2 + Math.sin(t * .04 + i * 2) * 40, chao - 160 - hy, 10 + (i % 3) * 3, ['#ff6fb5', '#ff9ccd', '#ffb3d6'][i % 3]); } x.globalAlpha = 1; }
  if(inf[0] === 'hightouch'){ var hp = duoPonto(eu, sxE, chE, t, duoInvertido, 35.5, 10.5), ph = (t % 60) / 60; if(ph < .4){ x.save(); x.globalAlpha = 1 - ph / .4; x.strokeStyle = '#ffe14d'; x.lineWidth = 5; for(i = 0; i < 8; i++){ var an = i * Math.PI / 4, r1 = 20 + ph * 90, r2 = 34 + ph * 120; x.beginPath(); x.moveTo(W2 / 2 + Math.cos(an) * r1, hp[1] + Math.sin(an) * r1); x.lineTo(W2 / 2 + Math.cos(an) * r2, hp[1] + Math.sin(an) * r2); x.stroke(); } x.restore(); } duoEstrela(x, W2 / 2, hp[1] - 6, 16, '#ffe14d', t * .05); }
  if(inf[0] === 'comida'){ duoComida(x, mE[0], mE[1], U, 'crepe', t); duoComida(x, mG[0], mG[1], U, 'parfait', t); for(i = 0; i < 4; i++) duoEstrela(x, W2 / 2 + (i - 1.5) * 34, chao - 300 + Math.sin(t * .08 + i) * 10, 7, '#ffe14d', t * .03); }
  if(inf[0] === 'dueto' || inf[0] === 'danca'){ x.font = '700 34px sans-serif'; x.textAlign = 'center'; for(i = 0; i < 5; i++){ var ny = (t * .9 + i * 70) % 330; x.globalAlpha = Math.max(0, 1 - ny / 330); x.fillStyle = ['#9b30d9', '#ff6fb5', '#4169e1'][i % 3]; x.fillText(i % 2 ? '♪' : '♫', W2 / 2 + Math.sin(t * .03 + i * 1.7) * 90, chao - 170 - ny); } x.globalAlpha = 1; }
  if(inf[0] === 'selfie' && (t % 150) < 8){ var fp = duoPonto(eu, sxE, chE, t, duoInvertido, 37, 9); x.fillStyle = 'rgba(255,255,255,' + (1 - (t % 150) / 8) * .8 + ')'; x.beginPath(); x.arc(fp[0], fp[1], 60, 0, 7); x.fill(); }
  if(inf[0] === 'seis'){ var up = Math.sin(t * .22) > 0; x.font = '900 64px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.lineWidth = 8; x.strokeStyle = '#fff';
    [['6', sxE, up], ['7', sxG, !up]].forEach(function(n){ var yy = chao - 340 - (n[2] ? 16 : 0); x.strokeText(n[0], n[1], yy); x.fillStyle = n[0] === '6' ? '#ff6fb5' : '#4169e1'; x.fillText(n[0], n[1], yy); }); }
  if(inf[0] === 'pets'){   // os dois pets na frente, brincando com uma bolinha
    var pe = duoMeuPet(), pg = duoGu.pet && PET_SP[duoGu.pet.k] ? duoGu.pet : null, bx = W2 / 2 + Math.sin(t * .05) * 40, by = chao - 30 - Math.abs(Math.sin(t * .1)) * 70;
    x.fillStyle = 'rgba(30,10,60,.2)'; x.beginPath(); x.ellipse(bx, chao + 4, 16, 4, 0, 0, 7); x.fill();
    var bg2 = x.createRadialGradient(bx - 4, by - 4, 2, bx, by, 14); bg2.addColorStop(0, '#fff'); bg2.addColorStop(1, '#ff6fb5'); x.fillStyle = bg2; x.beginPath(); x.arc(bx, by, 13, 0, 7); x.fill();
    if(pe) perfDesenharPetEm(x, pe, W2 / 2 - 78, chao - 40 - Math.abs(Math.sin(t * .1 + 1)) * 12, 3.4, t);
    if(pg) perfDesenharPetEm(x, { k:pg.k, acc:pg.acc || '' }, W2 / 2 + 78, chao - 40 - Math.abs(Math.sin(t * .1 + 2.4)) * 12, 3.4, t + 50);
  }
  // plaquinhas com os nomes
  x.font = '800 20px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
  [[sxE, contaJ ? contaJ.nick : tr('Você'), '#9b30d9'], [sxG, duoGu.nick, '#4169e1']].forEach(function(n){
    var w = Math.min(220, x.measureText(n[1]).width + 30), yy = chao + 26;
    x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); if(x.roundRect) x.roundRect(n[0] - w / 2, yy - 20, w, 30, 15); else x.rect(n[0] - w / 2, yy - 20, w, 30); x.fill();
    x.fillStyle = n[2]; x.fillText(String(n[1]).slice(0, 16), n[0], yy + 2);
  });
  if(comUI && duoBalao && t - duoBalao.t0 < 260){   // balão de fala do convidado
    var hd = duoPonto(gu, sxG, chG, t + 37, !duoInvertido, 15, -4), al = Math.min(1, (t - duoBalao.t0) / 8, (260 - (t - duoBalao.t0)) / 20);
    x.save(); x.globalAlpha = al; x.font = '800 24px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
    var linhas = duoQuebra(x, duoBalao.txt, 330), bw = 0; linhas.forEach(function(l){ bw = Math.max(bw, x.measureText(l).width); }); bw += 40;
    var bh = linhas.length * 32 + 26, bxx = Math.max(bw / 2 + 10, Math.min(W2 - bw / 2 - 10, hd[0])), byy = Math.max(10, hd[1] - bh - 40);
    x.fillStyle = '#fff'; x.strokeStyle = '#ff9ccd'; x.lineWidth = 4; x.beginPath(); if(x.roundRect) x.roundRect(bxx - bw / 2, byy, bw, bh, 22); else x.rect(bxx - bw / 2, byy, bw, bh); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(hd[0] - 12, byy + bh - 2); x.lineTo(hd[0], byy + bh + 22); x.lineTo(hd[0] + 10, byy + bh - 2); x.fill();
    x.fillStyle = '#4b2a7a'; linhas.forEach(function(l, j){ x.fillText(l, bxx, byy + 40 + j * 32); });
    x.restore();
  }
  x.restore();
  return { sxE:sxE, sxG:sxG, chao:chao, U:U };
}
function duoQuebra(x, s, max){ var pal = String(s).split(' '), L = [], cur = ''; pal.forEach(function(p){ var tt = cur ? cur + ' ' + p : p; if(x.measureText(tt).width > max && cur){ L.push(cur); cur = p; } else cur = tt; }); if(cur) L.push(cur); return L; }
function duoGuardaChuva(x, av, sx, chao, t, espelho){
  var h = duoPonto(av, sx, chao, t, espelho, 33.6, 14.8), r = 150, cy = h[1] - 150, cx = h[0];
  x.strokeStyle = '#6b4a8a'; x.lineWidth = 5; x.beginPath(); x.moveTo(cx, h[1] + 14); x.lineTo(cx, cy); x.stroke();
  x.beginPath(); x.arc(cx - 8, h[1] + 14, 8, 0, Math.PI); x.stroke();
  var cores = ['#ff9ccd', '#fff', '#c4a5ff', '#fff', '#9ee7ff', '#fff'];
  for(var i = 0; i < 6; i++){ x.fillStyle = cores[i]; x.beginPath(); x.moveTo(cx, cy); x.arc(cx, cy, r, Math.PI + i * Math.PI / 6, Math.PI + (i + 1) * Math.PI / 6); x.closePath(); x.fill(); }
  x.fillStyle = 'rgba(255,255,255,.6)'; for(i = 0; i < 6; i++){ x.beginPath(); x.arc(cx - r + r / 6 + i * r / 3, cy, r / 6, 0, Math.PI); x.fill(); }
  x.fillStyle = '#6b4a8a'; x.beginPath(); x.arc(cx, cy - r - 4, 6, 0, 7); x.fill();
  x.strokeStyle = 'rgba(120,170,255,.55)'; x.lineWidth = 2.5;   // chuvinha ao redor
  for(i = 0; i < 40; i++){ var rx = cenaHash(i * 3) * 960, ry = (cenaHash(i * 7) * 600 + t * 9) % 600; if(Math.abs(rx - cx) < r && ry > cy - r && ry < h[1] + 120) continue; x.beginPath(); x.moveTo(rx, ry); x.lineTo(rx - 4, ry + 16); x.stroke(); }
}
function duoComida(x, cx, cy, U, tipo, t){
  var s = U / 6.8;
  if(tipo === 'crepe'){
    x.fillStyle = '#f2c27c'; x.beginPath(); x.moveTo(cx - 20 * s, cy - 18 * s); x.lineTo(cx + 20 * s, cy - 18 * s); x.lineTo(cx, cy + 26 * s); x.closePath(); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(cx - 8 * s, cy - 20 * s, 10 * s, 0, 7); x.arc(cx + 8 * s, cy - 22 * s, 11 * s, 0, 7); x.fill();
    x.fillStyle = '#e8394d'; x.beginPath(); x.arc(cx, cy - 30 * s, 7 * s, 0, 7); x.fill(); x.fillStyle = '#4caf50'; x.fillRect(cx - 2 * s, cy - 40 * s, 4 * s, 5 * s);
  } else {
    x.fillStyle = 'rgba(200,230,255,.85)'; x.beginPath(); x.moveTo(cx - 16 * s, cy - 26 * s); x.lineTo(cx + 16 * s, cy - 26 * s); x.lineTo(cx + 9 * s, cy + 14 * s); x.lineTo(cx - 9 * s, cy + 14 * s); x.closePath(); x.fill();
    ['#ff9ccd', '#fff', '#c4a5ff', '#fff'].forEach(function(cc, j){ x.fillStyle = cc; x.fillRect(cx - (14 - j * 1.5) * s, cy - (22 - j * 9) * s, (28 - j * 3) * s, 8 * s); });
    x.fillStyle = '#fff'; x.beginPath(); x.arc(cx, cy - 30 * s, 12 * s, 0, 7); x.fill();
    x.fillStyle = '#e8394d'; x.beginPath(); x.arc(cx + 3 * s, cy - 40 * s, 6 * s, 0, 7); x.fill();
    x.fillStyle = '#c98b55'; x.fillRect(cx + 8 * s, cy - 52 * s, 3 * s, 22 * s);
  }
}
function duoLoop(ms){
  duoAnim = 0; if(!duoGu||!twAnimacaoVisivel($('duoCv'))) return;
  var mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30()),delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta($('duoCv'),ms):1,duoPrevT=duoT;duoT+=delta;
  if((mobile30&&TWMotionLifecycle.render30Due($('duoCv'),ms))||(!mobile30&&Math.floor((duoT+1e-6)/2)>Math.floor((duoPrevT+1e-6)/2))){ var cv = $('duoCv'); try{ duoRender(cv.getContext('2d'), cv.width, cv.height, true, true); }catch(e){} }
  duoAnim = requestAnimationFrame(duoLoop);
}
function duoRotulo(k){
  var L = {
    pt:['Salvar foto','Álbum e atividades','Mais cenas','Abrir câmera'],
    en:['Save photo','Album and activities','More scenes','Open camera'],
    es:['Guardar foto','Álbum y actividades','Más escenas','Abrir cámara'],
    ja:['写真を保存','アルバムとアクティビティ','ほかのシーン','カメラを開く'],
    th:['บันทึกภาพ','อัลบั้มและกิจกรรม','ฉากเพิ่มเติม','เปิดกล้อง'],
    id:['Simpan foto','Album dan aktivitas','Adegan lainnya','Buka kamera']
  };
  return (L[typeof LANG === 'string' ? LANG : 'pt'] || L.pt)[k];
}
function duoTexto(){
  $('duoSalvarTitulo').textContent = duoRotulo(0);
  $('duoExtraTitulo').textContent = duoRotulo(1);
  $('duoSub').textContent = tr('Monte cenas fofas com outro Idol do TsuLiPa⭐World!');
  $('duoTrocar').textContent = '🔁 ' + tr('Trocar dupla');
  $('duoPng').textContent = '📸 ' + (window.TW_CAMERA ? duoRotulo(3) : tr('Salvar PNG')); $('duoPngSem').textContent = '🫥 ' + tr('PNG sem fundo');
  $('duoPhone').textContent = '💗 ' + petPhoneMomentoTexto(0);
  var rua=$('duoRuaFofa'),voltar=$('duoVoltarRua');
  rua.hidden=!duoPiloto||!duoGu;
  voltar.hidden=!duoPiloto;
  var serie = $('duoSerie');
  if(serie && window.TW_ALBUM_FOTOS){
    serie.textContent = TW_ALBUM_FOTOS.textoSalvar(); serie.hidden = !serie.textContent; serie.disabled = false;
  }
}
function duoTrava(attr, o){   // chave da lojinha que falta para usar este chip ('' = liberado)
  if(attr === 'data-dfundo' && duoTemaK(o[0])) return duoTemaGratis(o[0]) || lojaTem('tema_' + o[0]) ? '' : 'tema_' + o[0];   // tema: grátis na temporada ou se guardou
  var k = attr === 'data-dcena' ? (o[7] || '') : attr === 'data-dfundo' ? (o[0] === 'cafe' ? 'duo_cafe' : lojaItem('fundo_' + o[0]) ? 'fundo_' + o[0] : '') : (attr === 'data-dexeu' || attr === 'data-dexgu') && lojaItem('expr_' + o[0]) ? 'expr_' + o[0] : '';
  return k && !lojaTem(k) ? k : '';
}
function duoChips(lista, sel, attr){ return lista.map(function(o){ var tv = duoTrava(attr, o), it = tv && lojaItem(tv);
  return '<button type="button" class="duochip' + (tv ? ' trava' : '') + '" ' + (tv ? 'data-dtrava="' + tv + '"' : attr + '="' + escHtml(o[0]) + '"') + ' aria-pressed="' + (o[0] === sel) + '"><span>' + o[1] + '</span> ' + escHtml(tr(o[2])) + (tv ? ' <small>🔒★' + it[3] + '</small>' : '') + '</button>'; }).join(''); }
function duoFundos(){
  var L = PERF_FUNDOS.filter(function(o){ return o[0] && o[0] !== 'temporada'; }).concat(DUO_FUNDO_EXTRA);
  Object.keys(TEMA_INFO).forEach(function(k){ if(k !== 'halloween') L.push([k, TEMA_INFO[k][0], TEMA_INFO[k][1]]); });
  return L;
}
function duoCenaAtual(){
  return {fundo:duoFundo,pose:duoCena,quadro:duoQuadro,invertido:duoInvertido,exprEu:duoExEu,exprGu:duoExGu,nick:duoGu.nick};
}
function duoAplicarCena(c){
  function livre(lista,attr,k,padrao){
    var item=lista.find(function(o){return o[0]===k;});
    return item&&!duoTrava(attr,item)?k:padrao;
  }
  duoFundo=livre(duoFundos(),'data-dfundo',c.fundo,'basico');
  duoCena=livre(DUO_CENAS,'data-dcena',c.pose,'dueto');
  duoExEu=livre(PET_PH_EXPRS,'data-dexeu',c.exprEu,'');
  duoExGu=livre(PET_PH_EXPRS,'data-dexgu',c.exprGu,'');
  duoQuadro=c.quadro==='perto'?'perto':'aberto';duoInvertido=c.invertido===true;
}
function duoGuardarRascunho(){
  if(duoPiloto && duoGu && window.TW_PILOTO_BAIRRO)TW_PILOTO_BAIRRO.guardarDupla(duoPiloto,duoCenaAtual());
}
function duoPalcoUI(){
  $('duoEscolha').hidden = true; $('duoPalco').hidden = false; duoTexto();
  $('duoNomes').innerHTML = '🌙 <b>' + escHtml(contaJ ? contaJ.nick : tr('Você')) + '</b> × <b>' + escHtml(duoGu.nick) + '</b>';
  $('duoDica').textContent = '👆 ' + tr('Toque em {nick} para ouvir uma mensagem!').replace('{nick}', duoGu.nick);
  duoTabUI();
  duoGuardarRascunho();
  if(!duoAnim) duoAnim = requestAnimationFrame(duoLoop);
}
function duoEscolhaUI(msg){
  $('duoPalco').hidden = true; $('duoEscolha').hidden = false; duoTexto();
  if(!contaJ){ $('duoEscolha').innerHTML = '<p class="duodica">' + escHtml(tr('Entre com Google para usar o Moon⭐Duo!')) + '</p><div class="btns"><button type="button" class="btn" id="duoEntrar">' + escHtml(tr('Entrar com Google')) + '</button></div>'; return; }
  $('duoEscolha').innerHTML = (msg ? '<p class="perfmsg">' + escHtml(msg) + '</p>' : '') + DUO_CENA_HTML +
    '<p class="duodica">' + escHtml(tr('Escolha com quem fazer a dupla:')) + '</p>' +
    '<input class="nick duobusca" id="duoBusca" maxlength="24" autocomplete="off" placeholder="🔍 ' + escHtml(tr('Procurar Idol pelo nome')) + '" aria-label="' + escHtml(tr('Procurar Idol pelo nome')) + '">' +
    '<div class="duosug" id="duoRes" aria-live="polite"></div><p class="duodica"><b>✨ ' + escHtml(tr('Sugestões')) + '</b></p><div class="duosug" id="duoSug"><p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p></div>';
  duoCenaDesenhar();
  // sem sugestões (ou sem rede), nunca um espaço vazio: o Tsu e a Lirika, que sempre topam uma dupla
  var sugestoes = $('duoSug'), dono = petPhoneContaChave();
  function duoSugMostrar(L){
    if(duoOv.hidden || !sugestoes.isConnected || dono !== petPhoneContaChave()) return;
    var lista = duoOutrosPerfis(L);
    if(!lista.length) lista = duoOutrosPerfis(DUO_SUG_RESERVA);
    sugestoes.innerHTML = lista.map(duoNickBtn).join('');
  }
  contaRpc('duo_sugestoes').then(duoSugMostrar).catch(function(){ duoSugMostrar(null); });
}
var DUO_SUG_RESERVA = [{nick:'Tsu'}, {nick:'Lirika'}];
// Cena no topo da escolha (17/11): você sob a lua, e um lugar vago com "?" esperando a dupla
var DUO_CENA_HTML = '<canvas class="duocena" id="duoCena" width="1120" height="400" aria-hidden="true"></canvas>';
function duoCenaDesenhar(){
  var cv = $('duoCena'), x = cv && cv.getContext && cv.getContext('2d'); if(!x) return;
  var W2 = cv.width, H2 = cv.height, i, ceu = x.createLinearGradient(0, 0, 0, H2); ceu.addColorStop(0, '#1d1556'); ceu.addColorStop(.7, '#3b2c86'); ceu.addColorStop(1, '#5a3aa6');
  x.fillStyle = ceu; x.fillRect(0, 0, W2, H2);
  for(i = 0; i < 26; i++) duoEstrela(x, (i * 197 + 40) % W2, 20 + (i * 83) % (H2 * .55), 3 + (i % 4) * 2, i % 5 ? 'rgba(255,255,255,.75)' : '#ffe14d', i);
  var lua = x.createRadialGradient(W2 / 2, 120, 10, W2 / 2, 120, 150); lua.addColorStop(0, 'rgba(255,243,168,.5)'); lua.addColorStop(1, 'rgba(255,243,168,0)'); x.fillStyle = lua; x.fillRect(0, 0, W2, H2);
  var m = document.createElement('canvas'); m.width = m.height = 140; var mx = m.getContext('2d'); mx.fillStyle = '#fff3a8'; mx.beginPath(); mx.arc(70, 70, 62, 0, 7); mx.fill(); mx.globalCompositeOperation = 'destination-out'; mx.beginPath(); mx.arc(98, 52, 56, 0, 7); mx.fill(); x.drawImage(m, W2 / 2 - 70, 48);
  var chao = H2 - 26, piso = x.createLinearGradient(0, chao - 40, 0, H2); piso.addColorStop(0, 'rgba(255,111,181,0)'); piso.addColorStop(1, 'rgba(255,111,181,.35)'); x.fillStyle = piso; x.fillRect(0, chao - 40, W2, H2);
  x.fillStyle = 'rgba(255,255,255,.14)'; x.beginPath(); x.ellipse(W2 * .3, chao, 130, 18, 0, 0, 7); x.ellipse(W2 * .7, chao, 130, 18, 0, 0, 7); x.fill();
  try{ x.save(); x.translate(W2 * .3, chao); x.scale(.74, .74); duoIdolEm(x, duoMeuAv(), 0, 0, 'v', 2, 0, false); x.restore(); }catch(e){ x.restore(); }
  // o lugar da dupla: contorno tracejado de coração com "?"
  x.save(); x.setLineDash([10, 9]); x.lineWidth = 5; x.strokeStyle = 'rgba(255,255,255,.6)'; x.beginPath();
  var cx = W2 * .7, cy = chao - 150, r = 70; x.moveTo(cx, cy + r * .95); x.bezierCurveTo(cx - r * 1.5, cy - r * .1, cx - r * .75, cy - r * 1.15, cx, cy - r * .35); x.bezierCurveTo(cx + r * .75, cy - r * 1.15, cx + r * 1.5, cy - r * .1, cx, cy + r * .95); x.stroke(); x.restore();
  x.font = '400 64px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#fff'; x.fillText('?', cx, cy - 4);
  duoCoracao(x, W2 / 2, chao - 70, 18, '#ff6fb5');
}
function duoOutrosPerfis(lista){
  var meuNick = contaJ && contaJ.nick.toLowerCase();
  return Array.isArray(lista) ? lista.filter(function(p){ return p && typeof p.nick === 'string' && p.nick && p.nick.toLowerCase() !== meuNick; }) : [];
}
function duoNickBtn(p){ return '<button type="button" class="duochip" data-dnick="' + escHtml(p.nick) + '">🌙 ' + escHtml(p.nick) + (p.best != null ? ' <small>' + (+p.best || 0) + '</small>' : '') + '</button>'; }
var duoBuscaT=0,duoBuscaSeq=0;
function duoBuscaCancelar(){clearTimeout(duoBuscaT);duoBuscaT=0;duoBuscaSeq++;}
var duoLoadSeq=0;
function duoCarregar(nick,recriar){
  var seq=++duoLoadSeq, dono=petPhoneContaChave();
  duoBuscaCancelar();
  duoGu = null;
  if(duoAnim){ cancelAnimationFrame(duoAnim); duoAnim = 0; }
  $('duoPalco').hidden = true;
  $('duoEscolha').hidden = false;
  $('duoEscolha').innerHTML = '<p class="perfcarr" role="status">' + escHtml(tr('Carregando...')) + '</p>';
  contaRpc('duo_convidado', { p_nick: String(nick).slice(0, 24) }).then(function(r){
    if(seq!==duoLoadSeq||duoOv.hidden||dono!==petPhoneContaChave())return;
    if(!r || r.erro){ duoGu = null; duoEscolhaUI(tr(r && r.erro === 'eu' ? 'Escolha outra pessoa para a dupla 😉' : r && r.erro === 'off' ? 'Essa pessoa não está participando do Moon⭐Duo!' : 'Esse nome ainda não tem perfil (jogou sem conta).')); return; }
    duoGu = r; duoBalao = duoPulo = null; duoT = 0; if(recriar)duoAplicarCena(recriar); duoPalcoUI(); duoRegistrar();
    beep(1047, .08, 'triangle', .04); beep(1568, .1, 'triangle', .04, .08);
  }).catch(function(){ if(seq===duoLoadSeq&&!duoOv.hidden&&dono===petPhoneContaChave())duoEscolhaUI(tr('Não deu para falar com o servidor. Tente de novo.')); });
}
function duoRegistrar(){   // conta a cena para a missão do dia e a insígnia (o servidor não deixa contar repetido no mesmo dia)
  if(!duoGu || !contaJ) return;
  var ch = duoGu.nick.toLowerCase() + '|' + duoCena; if(duoRegistrados[ch]) return; duoRegistrados[ch] = 1;
  contaRpc('duo_registrar', { p_nick: duoGu.nick, p_cena: duoCena }).then(function(r){
    if(r && r.contou){ if(typeof hubMisCarregar === 'function') hubMisCarregar(); if(typeof insConferir === 'function') setTimeout(insConferir, 400); }
  }).catch(function(){ delete duoRegistrados[ch]; });
}
function duoFala(){
  var L = DUO_FALAS.slice(), extra = DUO_FALAS_CENA[duoCena] || [], os = duoGu.oshi && PERF_OSHI[duoGu.oshi];
  L = L.concat(extra, extra);   // a fala da cena aparece mais vezes
  if(os) L.push(tr(DUO_FALA_OSHI).replace('{oshi}', tr(os[1])));
  var s = L[Math.floor(Math.random() * L.length)];
  return s.indexOf('{') < 0 ? tr(s) : s;
}
var duoTab = 'cena';
function duoCard(o, sel, attr, thumb){
  var tv = duoTrava(attr, o), it = tv && lojaItem(tv);
  return '<button type="button" class="duocard' + (tv ? ' trava' : '') + '" ' + (tv ? 'data-dtrava="' + tv + '"' : attr + '="' + escHtml(o[0]) + '"') + ' aria-pressed="' + (!tv && o[0] === sel) + '">' +
    (thumb ? '<canvas width="160" height="100" data-dthumb="' + escHtml(o[0]) + '" aria-hidden="true"></canvas>' : '<i aria-hidden="true">' + o[1] + '</i>') +
    '<span>' + (thumb ? o[1] + ' ' : '') + escHtml(tr(o[2])) + '</span>' + (tv ? '<em class="duopreco">🔒 ' + (it[4] === 'tema' ? '🗓️ ' + temaProxTxt(o[0]) : '★' + it[3]) + '</em>' : attr === 'data-dfundo' && duoTemaGratis(o[0]) && !lojaTem('tema_' + o[0]) ? '<em class="duopreco duogratis">' + escHtml(tr('Grátis até')) + ' ' + temaAteTxt() + '</em>' : '') + '</button>';
}
function duoCards(lista, sel, attr, thumb){
  var livres = lista.filter(function(o){ return !duoTrava(attr, o); }), travados = lista.filter(function(o){ return duoTrava(attr, o); });   // travados vão para o fim
  return '<div class="duogrid' + (thumb ? ' thumbs' : '') + '">' + livres.concat(travados).map(function(o){ return duoCard(o, sel, attr, thumb); }).join('') + '</div>';
}
function duoExRow(nome, sel, attr){
  return '<div class="duoexrow"><b>' + escHtml(nome) + '</b><div class="duoexbtns">' + PET_PH_EXPRS.map(function(o){
    var tv = duoTrava(attr, o), it = tv && lojaItem(tv);
    return '<button type="button" class="duoexb' + (tv ? ' trava' : '') + '" ' + (tv ? 'data-dtrava="' + tv + '"' : attr + '="' + o[0] + '"') + ' aria-pressed="' + (!tv && o[0] === sel) + '" title="' + escHtml(tr(o[2]) + (tv ? ' · ★' + it[3] : '')) + '" aria-label="' + escHtml(tr(o[2])) + '">' + o[1] + (tv ? '<em>🔒</em>' : '') + '</button>';
  }).join('') + '</div><small>' + escHtml(tr((PET_PH_EXPRS.filter(function(o){ return o[0] === sel; })[0] || PET_PH_EXPRS[0])[2])) + '</small></div>';
}
// A aba é reconstruída ao escolher uma cena; mantém o alvo do teclado e a seção expandida.
function duoFocoAtual(){
  var b=document.activeElement;
  if(!b||!duoOv.contains(b))return null;
  var attrs=['data-dtab','data-dcena','data-dfundo','data-dexeu','data-dexgu','data-demo','data-dqt'];
  for(var i=0;i<attrs.length;i++)if(b.hasAttribute(attrs[i]))return {attr:attrs[i],valor:b.getAttribute(attrs[i])};
  return null;
}
function duoRestaurarFoco(f){
  if(!f)return;
  var botoes=duoOv.querySelectorAll('button['+f.attr+']');
  for(var i=0;i<botoes.length;i++)if(botoes[i].getAttribute(f.attr)===f.valor&&!botoes[i].disabled){botoes[i].focus({preventScroll:true});break;}
}
function duoTabUI(){
  var foco=typeof document!=='undefined'?duoFocoAtual():null;
  var anterior=$('duoTabC'),mais=anterior.querySelector&&anterior.querySelector('.duo-mais-cenas'),aberto=mais&&mais.open;
  var tabs = [['cena', '🎬', 'Cena'], ['fundo', '🏞️', 'Cenário'], ['expr', '😊', 'Expressões'], ['pres', '🎁', 'Presente']];
  $('duoTabs').innerHTML = tabs.map(function(t){ return '<button type="button" role="tab" data-dtab="' + t[0] + '" aria-pressed="' + (duoTab === t[0]) + '"><span aria-hidden="true">' + t[1] + '</span> ' + escHtml(tr(t[2])) + '</button>'; }).join('');
  var c = $('duoTabC'), h = '';
  if(duoTab === 'cena'){
    var livres = DUO_CENAS.filter(function(o){ return !duoTrava('data-dcena', o); });
    var principais = livres.slice(0, 6), outras = DUO_CENAS.filter(function(o){ return principais.indexOf(o) < 0; });
    h = duoCards(principais, duoCena, 'data-dcena');
    if(outras.length) h += '<details class="duo-mais-cenas"' + (aberto||outras.some(function(o){return o[0] === duoCena;}) ? ' open' : '') + '><summary>' + escHtml(duoRotulo(2)) + ' (' + outras.length + ')</summary>' + duoCards(outras, duoCena, 'data-dcena') + '</details>';
  }
  else if(duoTab === 'fundo'){
    var perf = PERF_FUNDOS.filter(function(o){ return o[0] && o[0] !== 'temporada'; }), temas = [];
    Object.keys(TEMA_INFO).forEach(function(k){ if(k !== 'halloween') temas.push([k, TEMA_INFO[k][0], TEMA_INFO[k][1]]); });
    h = '<h4>' + escHtml(tr('Do perfil')) + '</h4>' + duoCards(perf, duoFundo, 'data-dfundo', true) +
        '<h4>' + escHtml(tr('Temas')) + '</h4>' + duoCards(temas, duoFundo, 'data-dfundo', true) +
        '<h4>' + escHtml(tr('Especiais')) + '</h4>' + duoCards(DUO_FUNDO_EXTRA, duoFundo, 'data-dfundo', true);
  }
  else if(duoTab === 'expr') h = duoExRow(contaJ ? contaJ.nick : tr('Você'), duoExEu, 'data-dexeu') + duoExRow(duoGu.nick, duoExGu, 'data-dexgu');
  c.innerHTML = h;
  if(duoTab === 'pres') duoPresUI();
  duoRestaurarFoco(foco);
  if(duoTab === 'fundo'){ var cor = perfChar(duoMeuAv()).hair; [].forEach.call(c.querySelectorAll('canvas[data-dthumb]'), function(cv){ try{ duoFundoDesenhar(cv.getContext('2d'), 160, 100, cv.dataset.dthumb, 40, cor); }catch(e){} }); }
}
function duoPresUI(){
  var box = $('duoTabC'); if(duoTab !== 'pres') return;
  var foco=typeof document!=='undefined'?duoFocoAtual():null;
  box.innerHTML = '<b>🎁 ' + escHtml(tr('Presente para {nick}').replace('{nick}', duoGu.nick)) + '</b>' +
    '<div class="duopresemo">' + DUO_PRES_EMO.map(function(m){ return '<button type="button" class="duoexb" data-demo="' + m + '" aria-pressed="' + (m === duoPresEmo) + '">' + m + '</button>'; }).join('') + '</div>' +
    '<div class="duoseg">' + [0, 10, 30, 50].map(function(n){ return '<button type="button" data-dqt="' + n + '" aria-pressed="' + (n === duoPresQt) + '">' + (n ? '★' + n : escHtml(tr('Só carinho'))) + '</button>'; }).join('') + '</div>' +
    '<p class="duoresumo">' + escHtml(tr('Você vai enviar')) + ' <b>' + duoPresEmo + (duoPresQt ? ' + ★' + duoPresQt : '') + '</b> · ' + escHtml(tr('seu saldo')) + ' ★' + starT + '</p>' +
    '<small>' + escHtml(tr('As estrelas saem do seu saldo. 1 presente por pessoa por dia.')) + '</small>' +
    '<div class="btns"><button type="button" class="btn" id="duoPresOk">' + escHtml(tr('Enviar')) + ' ' + duoPresEmo + '</button></div>';
  duoRestaurarFoco(foco);
}
var DUO_PRES_ERRO = { hoje:'Você já mandou um presente hoje para essa pessoa.', limite:'Você chegou ao limite de presentes de hoje.', saldo:'Estrelas insuficientes.', alvo:'Essa pessoa não está participando do Moon⭐Duo!', bloqueado:'Sua conta está bloqueada pela moderação.' };
function duoMsg(t){var m=$('duoMsg');if(!m||duoOv.hidden)return;if(m._twTimeout){m._twTimeout.cancel();m._twTimeout=null;}m.textContent=t;m.hidden=!t;if(t)m._twTimeout=twTimeoutVisivel(m,function(){return !duoOv.hidden&&m.isConnected;},function(){m.hidden=true;m._twTimeout=null;},5000);}
var duoPiloto=null,duoPilotoFoto=null;
function duoAbrir(nick,atalho){
  duoPiloto=atalho&&atalho.piloto||null;duoPilotoFoto=null;
  $('duoRuaGuardar').hidden=true;
  if(atalho&&window.TW_JANELAS)TW_JANELAS.preparar(duoOv,atalho.origem);
  duoVeioHub = !hubOv.hidden; lookSalvar();   // abre por cima da tela de início
  if(typeof perfOv !== 'undefined' && !perfOv.hidden) perfFechar();
  duoOv.hidden = false; duoOv.scrollTop = 0; duoT = 0; duoBalao = duoPulo = null; duoTexto();
  $('duoRuaStatus').textContent='';$('duoRuaFofa').disabled=false;
  if(duoTrava('data-dfundo', [duoFundo])){ var tk = typeof temaAtual === 'function' ? temaAtual() : ''; duoFundo = tk && tk !== 'halloween' && TEMA_INFO[tk] ? tk : 'basico'; }
  if(duoTrava('data-dcena', duoInfo())) duoCena = 'dueto';
  if(duoExEu !== '' && duoTrava('data-dexeu', [duoExEu])) duoExEu = ''; if(duoExGu !== '' && duoTrava('data-dexgu', [duoExGu])) duoExGu = '';
  duoLoadSeq++;
  if(nick && contaJ) duoCarregar(nick,atalho&&atalho.recriar);
  else { duoGu = null; duoEscolhaUI(); }
  if(sfx.card) sfx.card();
  if(typeof hubComecou !== 'undefined' && hubComecou) hubMusicaTocar();
}
function duoFechar(){ duoPiloto=null;duoPilotoFoto=null;duoBuscaCancelar();var msg=$('duoMsg');if(msg&&msg._twTimeout){msg._twTimeout.cancel();msg._twTimeout=null;}duoLoadSeq++;duoOv.hidden = true; if(duoAnim){ cancelAnimationFrame(duoAnim); duoAnim = 0; } if(duoVeioHub) hubMostrar(); }   // o Halloween tem o fundo próprio da lojinha
function duoTemaGratis(k){ return !!duoTemaK(k) && temaAtual() === k; }
function temaProxTxt(k){   // quando o tema volta ("01/12")
  var md = dk().slice(5), prox = '', menor = '';
  TEMAS.forEach(function(l){ if(l[0] !== k) return; if(!menor || l[1] < menor) menor = l[1]; if(l[1] > md && (!prox || l[1] < prox)) prox = l[1]; });
  var a = prox || menor; return a ? a.slice(3) + '/' + a.slice(0, 2) : '';
}
function duoTravaUI(k){
  var it = lojaItem(k), box = $('duoPresBox'); if(!it) return;
  box.hidden = false;
  if(it[4] === 'tema'){ box.innerHTML = '<b>🔒 ' + it[1] + ' ' + escHtml(tr(it[2])) + '</b><small>' + escHtml(tr('Esse cenário volta na temporada do tema ({data}). Quem guardar durante o tema usa o ano todo.').replace('{data}', temaProxTxt(k.slice(5)))) + '</small>'; beep(330, .08, 'triangle', .04); return; }
  if(it[4] === 'expr' || it[4] === 'pose'){ box.innerHTML = '<b>🔒 ' + it[1] + ' ' + escHtml(tr(it[2])) + '</b><small>' + escHtml(tr('{item} está na lojinha do perfil (Montar Idol) por ★{n}.').replace('{item}', it[1] + ' ' + tr(it[2])).replace('{n}', it[3])) + '</small>'; return; }
  box.innerHTML = '<b>🔒 ' + it[1] + ' ' + escHtml(tr(it[2])) + '</b><small>' + escHtml(tr('Desbloqueie com estrelas para usar no Moon⭐Duo!')) + ' (★ ' + starT + ')</small>' +
    '<div class="btns"><button type="button" class="btn" data-dcomprar="' + k + '"' + (starT < it[3] ? ' disabled' : '') + '>' + escHtml(tr('Desbloquear')) + ' ★' + it[3] + '</button></div>';
  beep(660, .05, 'triangle', .04);
}
function duoTemaGuardarUI(f){   // tema da vez, ainda não guardado: oferece guardar para sempre
  var k = 'tema_' + f, it = lojaItem(k), box = $('duoPresBox');
  if(!it || !contaJ || !duoTemaGratis(f) || lojaTem(k)) return;
  box.hidden = false;
  box.innerHTML = '<b>🗓️ ' + it[1] + ' ' + escHtml(tr(it[2])) + ' · ' + escHtml(tr('Grátis até')) + ' ' + temaAteTxt() + '</b><small>' + escHtml(tr('Guarde para usar o ano todo, mesmo depois da temporada.')) + ' (★ ' + starT + ')</small>' +
    '<div class="btns"><button type="button" class="btn" data-dcomprar="' + k + '"' + (starT < it[3] ? ' disabled' : '') + '>' + escHtml(tr('Guardar para sempre')) + ' ★' + it[3] + '</button></div>';
}
function duoComprar(k, b){
  lojaComprar(k, b, function(ok, msg){
    duoMsg(msg);
    if(ok){ var it = lojaItem(k); if(it && it[4] === 'duo' && k !== 'duo_cafe'){ DUO_CENAS.forEach(function(c){ if(c[7] === k) duoCena = c[0]; }); duoRegistrar(); } else if(k === 'duo_cafe') duoFundo = 'cafe'; else if(/^fundo_/.test(k)) duoFundo = k.slice(6); else if(/^tema_/.test(k)) duoFundo = k.slice(5); $('duoPresBox').hidden = true; duoPalcoUI(); }
  });
}

