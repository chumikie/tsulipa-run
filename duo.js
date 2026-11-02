/* Moon⭐Duo! — cenas de dupla com outro Idol: desenho, telas, abas, lojinha de poses/extras, itens travados e aviso.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 4), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
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
var DUO_FALAS = [   // falas do convidado quando a pessoa toca nele (todas unissex)
  'Você brilha muito no palco! ✨', 'Força! Eu acredito em você 💪', 'Obrigado por ser meu duo! 🌙', 'Vamos ser Center juntos! ⭐',
  'Seu sorriso me dá energia! 😊', 'Hoje vai dar tudo certo! 🍀', 'Bora ensaiar mais um pouquinho? 🎶', 'Tô muito feliz de estar aqui com você! 💖',
  'Você é incrível do jeitinho que é! 🌈', 'Respira fundo... você consegue! 🫶', 'Que dupla mais fofa a nossa! 🎀', 'Ganbatte! がんばって！ 💜',
  'Cada ensaio te deixa mais forte! 🔥', 'Você merece todos os aplausos! 👏', 'Vamos fazer história no BRS48! 🎤', 'Conta comigo sempre! 🤝'
];
var DUO_FALAS_CENA = {
  dueto:['Nossa harmonia ficou perfeita! 🎵'], coracao:['Esse coração é pra você! 🫶'], maos:['Juntos a gente vai mais longe! 🤝'],
  hightouch:['Toca aqui! Arrasamos! 🙌'], guarda:['Debaixo do guarda-chuva tá quentinho! ☂️'], comida:['Itadakimasu! Tá uma delícia! 🍓'],
  danca:['Não para de dançar! 💃'], selfie:['Sorria! Essa vai pro álbum! 📸'], seis:['Six... SEVEN! 🙌'], neon:['Brilhando igual neon! ✨'],
  luzes:['Acende o lightstick! 💜'], pets:['Os pets também viraram amigos! 🐾']
};
var DUO_FALA_OSHI = 'Bora torcer por {oshi} juntos! 💖';
var duoGu = null, duoCena = 'dueto', duoFundo = 'basico', duoExEu = '', duoExGu = '', duoT = 0, duoAnim = 0, duoVeioHub = false;
var duoBalao = null, duoPulo = null, duoRegistrados = {}, duoPresEmo = '🧸', duoPresQt = 0, duoOff = null, duoPoseForce = '';
var DUO_OW = 680, DUO_OH = 560;   // largo para o brilho dos visuais não ficar cortado
function duoBraco(x1, y1, x2, y2){ g.save(); g.lineCap = 'round'; g.strokeStyle = g.fillStyle; g.lineWidth = 4; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
function duoMao(x, y, c){ g.fillStyle = c.skin; g.beginPath(); g.arc(x, y, 2.4, 0, 7); g.fill(); }
function duoGeo(av, t){ var big = av && av.visual === 'mega', sc = DUO_OH / (big ? 68 : 82), ch = DUO_OH * (big ? .95 : .9); return { sc:sc, ch:ch, tx:DUO_OW / 2 - 15 * sc, ty:ch - 44 * sc, bob:t ? Math.sin(t * .06) * 1.1 * sc : 0 }; }
function duoIdolEm(x, av, sx, chao, pose, expr, t, espelho){
  if(!duoOff){ duoOff = document.createElement('canvas'); duoOff.width = DUO_OW; duoOff.height = DUO_OH; }
  var o = duoOff.getContext('2d'); o.setTransform(1, 0, 0, 1, 0, 0); o.clearRect(0, 0, DUO_OW, DUO_OH);
  var a = JSON.parse(JSON.stringify(av || {})), G = duoGeo(a, t);
  a.pet = null; a.expr = expr; a.pose = DUO_POSE_FN[pose] ? 'v' : (perfPoseInfo(pose) ? pose : '');
  duoPoseForce = DUO_POSE_FN[pose] ? pose : '';
  try{ perfDesenharIdol(o, DUO_OW, DUO_OH, a, false, false, t); }catch(e){}
  finally{ duoPoseForce = ''; }
  var ox = sx - DUO_OW / 2, oy = chao - G.ch;
  x.save(); if(espelho){ x.translate(sx * 2, 0); x.scale(-1, 1); }
  x.drawImage(duoOff, ox, oy); x.restore();
}
function duoPonto(av, sx, chao, t, espelho, u, v){   // ponto do personagem (unidades do drawChar) → ponto do palco
  var G = duoGeo(av, t), X = sx - DUO_OW / 2 + G.tx + u * G.sc, Y = chao - G.ch + G.ty + v * G.sc + G.bob;
  return [espelho ? 2 * sx - X : X, Y];
}
function duoCoracao(x, cx, cy, r, cor){ x.fillStyle = cor; x.beginPath(); x.moveTo(cx, cy + r * .9); x.bezierCurveTo(cx - r * 1.4, cy - r * .1, cx - r * .7, cy - r * 1.1, cx, cy - r * .35); x.bezierCurveTo(cx + r * .7, cy - r * 1.1, cx + r * 1.4, cy - r * .1, cx, cy + r * .9); x.fill(); }
function duoEstrela(x, sx, sy, r, cor, gira){ x.fillStyle = cor; x.beginPath(); for(var q = 0; q < 10; q++){ var rr = q % 2 ? r * .42 : r, an = q * Math.PI / 5 - Math.PI / 2 + (gira || 0); x[q ? 'lineTo' : 'moveTo'](sx + Math.cos(an) * rr, sy + Math.sin(an) * rr); } x.closePath(); x.fill(); }
function duoFundoDesenhar(x, W2, H2, f, t, corOshi){
  if(f === 'cafe'){   // café kawaii: parede listrada, janela, prateleira com xícaras e balcão
    var u = W2 / 320, i, gr = x.createLinearGradient(0, 0, 0, H2); gr.addColorStop(0, '#ffe9f3'); gr.addColorStop(1, '#fff6e8'); x.fillStyle = gr; x.fillRect(0, 0, W2, H2);
    x.fillStyle = 'rgba(255,156,205,.22)'; for(i = 0; i < 20; i++) x.fillRect(i * 18 * u, 0, 9 * u, H2 * .7);
    x.fillStyle = '#bfe9ff'; x.fillRect(W2 * .62, H2 * .1, 90 * u, 70 * u); x.fillStyle = '#fff'; x.fillRect(W2 * .62 + 43 * u, H2 * .1, 4 * u, 70 * u); x.fillRect(W2 * .62, H2 * .1 + 33 * u, 90 * u, 4 * u);
    x.strokeStyle = '#d9a7c7'; x.lineWidth = 3 * u; x.strokeRect(W2 * .62, H2 * .1, 90 * u, 70 * u);
    x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.arc(W2 * .62 + 22 * u + Math.sin(t * .01) * 4 * u, H2 * .1 + 18 * u, 7 * u, 0, 7); x.arc(W2 * .62 + 30 * u + Math.sin(t * .01) * 4 * u, H2 * .1 + 16 * u, 8 * u, 0, 7); x.fill();
    x.fillStyle = '#c98b55'; x.fillRect(W2 * .08, H2 * .28, 90 * u, 5 * u);
    ['#ff6fb5', '#4dd8ff', '#b6ff3b', '#ffe14d'].forEach(function(cc, j){ var cx = W2 * .08 + (12 + j * 22) * u, cy = H2 * .28; x.fillStyle = cc; x.fillRect(cx, cy - 12 * u, 12 * u, 12 * u); x.strokeStyle = cc; x.lineWidth = 2 * u; x.beginPath(); x.arc(cx + 13 * u, cy - 6 * u, 3.5 * u, -1.4, 1.4); x.stroke(); });
    [W2 * .3, W2 * .5].forEach(function(lx, j){ x.strokeStyle = '#8a6a7a'; x.lineWidth = 1.5 * u; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, H2 * .14); x.stroke(); x.fillStyle = j ? '#ffe14d' : '#ff9ccd'; x.beginPath(); x.arc(lx, H2 * .16, 9 * u, Math.PI, 0); x.fill();
      var lg = x.createRadialGradient(lx, H2 * .18, 2, lx, H2 * .18, 50 * u); lg.addColorStop(0, 'rgba(255,240,180,.45)'); lg.addColorStop(1, 'rgba(255,240,180,0)'); x.fillStyle = lg; x.fillRect(lx - 50 * u, H2 * .16, 100 * u, 80 * u); });
    x.fillStyle = '#f3d3b8'; x.fillRect(0, H2 * .72, W2, H2 * .28);
    x.fillStyle = 'rgba(201,139,85,.25)'; for(i = 0; i < 16; i++) for(var j = 0; j < 4; j++) if((i + j) % 2) x.fillRect(i * 20 * u, H2 * .72 + j * 20 * u, 20 * u, 20 * u);
    perfEnfeites(x, W2, H2 * .7, ['#ff9ccd', '#ffd36b', '#c4a5ff'], 10, 7, t, .6);
    return;
  }
  if(TEMA_INFO[f]){ temaFundo(x, W2, H2, f, t); return; }
  perfFundo(x, W2, H2, f, corOshi || '#ff6fb5', t);
}
function lookSemRank(av){ av = JSON.parse(JSON.stringify(av || {})); if(typeof av.visual === 'string' && PERF_RANKVIS[av.visual]) av.visual = ''; return av; }   // a roupa de rank cobriria o look
function lookAtual(){ var vis = perfMeuAv && typeof perfMeuAv.visual === 'string' ? perfMeuAv.visual : ''; return lookSemRank(perfAvAtual({ visual: vis })); }
function duoMeuAv(){ return lookAtual(); }   // no Moon⭐Duo! você aparece com o look que está vestindo agora
function duoGuAv(){ var a = duoGu && duoGu.look && typeof duoGu.look === 'object' ? duoGu.look : duoGu && duoGu.avatar && typeof duoGu.avatar === 'object' ? duoGu.avatar : {}; return lookSemRank(a); }
function duoMeuPet(){ var k = petData && petData.ativo; return k && PET_SP[k] ? { k:k, acc:(petData.pets && petData.pets[k] && petData.pets[k].acc) || '', cfg:petData.pets && petData.pets[k] && petData.pets[k].cfg } : null; }
function duoInfo(){ for(var i = 0; i < DUO_CENAS.length; i++) if(DUO_CENAS[i][0] === duoCena) return DUO_CENAS[i]; return DUO_CENAS[0]; }
function duoRender(x, W2, H2, comFundo, comUI){
  var t = duoT || 1, inf = duoInfo(), eu = duoMeuAv(), gu = duoGuAv();
  var G = duoGeo(eu, t), U = G.sc, chao = H2 * .9, gap = inf[5] * U, sxE = W2 / 2 - gap / 2, sxG = W2 / 2 + gap / 2, i;
  var poseE = inf[3], poseG = inf[4], exE = duoExEu === '' ? inf[6] : +duoExEu, exG = duoExGu === '' ? inf[6] : +duoExGu;
  if(inf[0] === 'danca'){ poseE = poseG = DUO_DANCA[Math.floor(t / 46) % DUO_DANCA.length]; }
  if(inf[0] === 'guarda') poseG = '';
  x.clearRect(0, 0, W2, H2);
  if(comFundo) duoFundoDesenhar(x, W2, H2, duoFundo, t, perfChar(eu).hair);
  // efeitos de fundo da cena
  if(inf[0] === 'dueto'){ [sxE, sxG].forEach(function(sx){ var lg = x.createLinearGradient(sx, 0, sx, chao); lg.addColorStop(0, 'rgba(255,248,200,.55)'); lg.addColorStop(1, 'rgba(255,248,200,0)'); x.fillStyle = lg; x.beginPath(); x.moveTo(sx - 18, 0); x.lineTo(sx + 18, 0); x.lineTo(sx + 95, chao); x.lineTo(sx - 95, chao); x.closePath(); x.fill(); }); }
  if(inf[0] === 'luzes' || inf[0] === 'neon'){ for(i = 0; i < 26; i++){ var cc = ['#ff6fb5', '#4dd8ff', '#b6ff3b', '#9b30d9', '#ffe14d'][i % 5]; x.globalAlpha = .35 + .3 * Math.sin(t * .08 + i); x.fillStyle = cc; x.beginPath(); x.arc((cenaHash(i) * W2), H2 * .55 + cenaHash(i + 40) * H2 * .3, 5 + (i % 3) * 2, 0, 7); x.fill(); } x.globalAlpha = 1; }
  if(inf[0] === 'neon'){ x.save(); x.lineWidth = 6; x.shadowBlur = 18; ['#ff6fb5', '#4dd8ff', '#b6ff3b'].forEach(function(cc, j){ x.strokeStyle = cc; x.shadowColor = cc; x.globalAlpha = .55 + .35 * Math.sin(t * .1 + j * 2); x.beginPath(); x.moveTo(0, H2 * (.18 + j * .09)); x.lineTo(W2, H2 * (.3 + j * .09) + Math.sin(t * .05 + j) * 20); x.stroke(); }); x.restore(); }
  // os dois Idols (com pulinho ao tocar e passinho na dança)
  function pulo(quem){ if(!duoPulo || duoPulo.quem !== quem) return 0; var p = (t - duoPulo.t0) / 22; if(p >= 1) return 0; return -Math.sin(p * Math.PI) * 34; }
  var dz = inf[0] === 'danca' ? -Math.abs(Math.sin(t * .136)) * 14 : 0;
  var chE = chao + pulo('eu') + dz, chG = chao + pulo('gu') + dz;
  if(inf[0] === 'guarda') duoGuardaChuva(x, eu, sxE, chE, t, false);
  duoIdolEm(x, eu, sxE, chE, poseE, exE, t, false);
  duoIdolEm(x, gu, sxG, chG, poseG, exG, t + 37, true);
  // enfeites da cena por cima
  var mE = duoPonto(eu, sxE, chE, t, false, 15, 27), mG = duoPonto(gu, sxG, chG, t + 37, true, 15, 27);
  if(inf[0] === 'coracao'){ var pu = 1 + .08 * Math.sin(t * .12); duoCoracao(x, W2 / 2, (mE[1] + mG[1]) / 2 - 30, 34 * pu, '#ff4f9a'); duoCoracao(x, W2 / 2 - 10, (mE[1] + mG[1]) / 2 - 42, 8 * pu, 'rgba(255,255,255,.7)'); }
  if(inf[0] === 'maos' || inf[0] === 'coracao' || inf[0] === 'pets'){ for(i = 0; i < 6; i++){ var hy = ((t * 1.1 + i * 55) % 260); x.globalAlpha = Math.max(0, 1 - hy / 260); duoCoracao(x, W2 / 2 + Math.sin(t * .04 + i * 2) * 40, chao - 160 - hy, 10 + (i % 3) * 3, ['#ff6fb5', '#ff9ccd', '#ffb3d6'][i % 3]); } x.globalAlpha = 1; }
  if(inf[0] === 'hightouch'){ var hp = duoPonto(eu, sxE, chE, t, false, 35.5, 10.5), ph = (t % 60) / 60; if(ph < .4){ x.save(); x.globalAlpha = 1 - ph / .4; x.strokeStyle = '#ffe14d'; x.lineWidth = 5; for(i = 0; i < 8; i++){ var an = i * Math.PI / 4, r1 = 20 + ph * 90, r2 = 34 + ph * 120; x.beginPath(); x.moveTo(W2 / 2 + Math.cos(an) * r1, hp[1] + Math.sin(an) * r1); x.lineTo(W2 / 2 + Math.cos(an) * r2, hp[1] + Math.sin(an) * r2); x.stroke(); } x.restore(); } duoEstrela(x, W2 / 2, hp[1] - 6, 16, '#ffe14d', t * .05); }
  if(inf[0] === 'comida'){ duoComida(x, mE[0], mE[1], U, 'crepe', t); duoComida(x, mG[0], mG[1], U, 'parfait', t); for(i = 0; i < 4; i++) duoEstrela(x, W2 / 2 + (i - 1.5) * 34, chao - 300 + Math.sin(t * .08 + i) * 10, 7, '#ffe14d', t * .03); }
  if(inf[0] === 'dueto' || inf[0] === 'danca'){ x.font = '700 34px sans-serif'; x.textAlign = 'center'; for(i = 0; i < 5; i++){ var ny = (t * .9 + i * 70) % 330; x.globalAlpha = Math.max(0, 1 - ny / 330); x.fillStyle = ['#9b30d9', '#ff6fb5', '#4169e1'][i % 3]; x.fillText(i % 2 ? '♪' : '♫', W2 / 2 + Math.sin(t * .03 + i * 1.7) * 90, chao - 170 - ny); } x.globalAlpha = 1; }
  if(inf[0] === 'selfie' && (t % 150) < 8){ var fp = duoPonto(eu, sxE, chE, t, false, 37, 9); x.fillStyle = 'rgba(255,255,255,' + (1 - (t % 150) / 8) * .8 + ')'; x.beginPath(); x.arc(fp[0], fp[1], 60, 0, 7); x.fill(); }
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
    var hd = duoPonto(gu, sxG, chG, t + 37, true, 15, -4), al = Math.min(1, (t - duoBalao.t0) / 8, (260 - (t - duoBalao.t0)) / 20);
    x.save(); x.globalAlpha = al; x.font = '800 24px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
    var linhas = duoQuebra(x, duoBalao.txt, 330), bw = 0; linhas.forEach(function(l){ bw = Math.max(bw, x.measureText(l).width); }); bw += 40;
    var bh = linhas.length * 32 + 26, bxx = Math.max(bw / 2 + 10, Math.min(W2 - bw / 2 - 10, hd[0])), byy = Math.max(10, hd[1] - bh - 40);
    x.fillStyle = '#fff'; x.strokeStyle = '#ff9ccd'; x.lineWidth = 4; x.beginPath(); if(x.roundRect) x.roundRect(bxx - bw / 2, byy, bw, bh, 22); else x.rect(bxx - bw / 2, byy, bw, bh); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(hd[0] - 12, byy + bh - 2); x.lineTo(hd[0], byy + bh + 22); x.lineTo(hd[0] + 10, byy + bh - 2); x.fill();
    x.fillStyle = '#4b2a7a'; linhas.forEach(function(l, j){ x.fillText(l, bxx, byy + 40 + j * 32); });
    x.restore();
  }
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
function duoTexto(){
  $('duoSub').textContent = tr('Monte cenas fofas com outro Idol do TsuLiPa⭐World!');
  $('duoTrocar').textContent = '🔁 ' + tr('Trocar dupla');
  $('duoPng').textContent = '📸 ' + tr('Salvar PNG'); $('duoPngSem').textContent = '🫥 ' + tr('PNG sem fundo');
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
function duoPalcoUI(){
  $('duoEscolha').hidden = true; $('duoPalco').hidden = false; duoTexto();
  $('duoNomes').innerHTML = '🌙 <b>' + escHtml(contaJ ? contaJ.nick : tr('Você')) + '</b> × <b>' + escHtml(duoGu.nick) + '</b>';
  $('duoDica').textContent = '👆 ' + tr('Toque em {nick} para ouvir uma mensagem!').replace('{nick}', duoGu.nick);
  duoTabUI();
  if(!duoAnim) duoAnim = requestAnimationFrame(duoLoop);
}
function duoEscolhaUI(msg){
  $('duoPalco').hidden = true; $('duoEscolha').hidden = false; duoTexto();
  if(!contaJ){ $('duoEscolha').innerHTML = '<p class="duodica">' + escHtml(tr('Entre com Google para usar o Moon⭐Duo!')) + '</p><div class="btns"><button type="button" class="btn" id="duoEntrar">' + escHtml(tr('Entrar com Google')) + '</button></div>'; return; }
  $('duoEscolha').innerHTML = (msg ? '<p class="perfmsg">' + escHtml(msg) + '</p>' : '') +
    '<p class="duodica">' + escHtml(tr('Escolha com quem fazer a dupla:')) + '</p>' +
    '<input class="nick duobusca" id="duoBusca" maxlength="24" autocomplete="off" placeholder="🔍 ' + escHtml(tr('Procurar Idol pelo nome')) + '">' +
    '<div class="duosug" id="duoRes"></div><p class="duodica"><b>✨ ' + escHtml(tr('Sugestões')) + '</b></p><div class="duosug" id="duoSug"><p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p></div>';
  contaRpc('duo_sugestoes').then(function(L){ var b = $('duoSug'); if(!b) return; b.innerHTML = Array.isArray(L) && L.length ? L.map(duoNickBtn).join('') : '<p class="perfcarr">✧</p>'; }).catch(function(){});
}
function duoNickBtn(p){ return '<button type="button" class="duochip" data-dnick="' + escHtml(p.nick) + '">🌙 ' + escHtml(p.nick) + ' <small>' + (+p.best || 0) + '</small></button>'; }
var duoBuscaT=0,duoBuscaSeq=0;
function duoBuscaCancelar(){clearTimeout(duoBuscaT);duoBuscaT=0;duoBuscaSeq++;}
var duoLoadSeq=0;
function duoCarregar(nick){
  var seq=++duoLoadSeq;
  $('duoEscolha').innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  contaRpc('duo_convidado', { p_nick: String(nick).slice(0, 24) }).then(function(r){
    if(seq!==duoLoadSeq||duoOv.hidden)return;
    if(!r || r.erro){ duoGu = null; duoEscolhaUI(tr(r && r.erro === 'eu' ? 'Escolha outra pessoa para a dupla 😉' : r && r.erro === 'off' ? 'Essa pessoa não está participando do Moon⭐Duo!' : 'Esse nome ainda não tem perfil (jogou sem conta).')); return; }
    duoGu = r; duoBalao = null; duoPalcoUI(); duoRegistrar();
    beep(1047, .08, 'triangle', .04); beep(1568, .1, 'triangle', .04, .08);
  }).catch(function(){ if(seq===duoLoadSeq&&!duoOv.hidden)duoEscolhaUI(tr('Não deu para falar com o servidor. Tente de novo.')); });
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
function duoTabUI(){
  var tabs = [['cena', '🎬', 'Cena'], ['fundo', '🏞️', 'Cenário'], ['expr', '😊', 'Expressões'], ['pres', '🎁', 'Presente']];
  $('duoTabs').innerHTML = tabs.map(function(t){ return '<button type="button" role="tab" data-dtab="' + t[0] + '" aria-pressed="' + (duoTab === t[0]) + '"><span aria-hidden="true">' + t[1] + '</span> ' + escHtml(tr(t[2])) + '</button>'; }).join('');
  var c = $('duoTabC'), h = '';
  if(duoTab === 'cena') h = duoCards(DUO_CENAS, duoCena, 'data-dcena');
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
  if(duoTab === 'fundo'){ var cor = perfChar(duoMeuAv()).hair; [].forEach.call(c.querySelectorAll('canvas[data-dthumb]'), function(cv){ try{ duoFundoDesenhar(cv.getContext('2d'), 160, 100, cv.dataset.dthumb, 40, cor); }catch(e){} }); }
}
function duoPresUI(){
  var box = $('duoTabC'); if(duoTab !== 'pres') return;
  box.innerHTML = '<b>🎁 ' + escHtml(tr('Presente para {nick}').replace('{nick}', duoGu.nick)) + '</b>' +
    '<div class="duopresemo">' + DUO_PRES_EMO.map(function(m){ return '<button type="button" class="duoexb" data-demo="' + m + '" aria-pressed="' + (m === duoPresEmo) + '">' + m + '</button>'; }).join('') + '</div>' +
    '<div class="duoseg">' + [0, 10, 30, 50].map(function(n){ return '<button type="button" data-dqt="' + n + '" aria-pressed="' + (n === duoPresQt) + '">' + (n ? '★' + n : escHtml(tr('Só carinho'))) + '</button>'; }).join('') + '</div>' +
    '<p class="duoresumo">' + escHtml(tr('Você vai enviar')) + ' <b>' + duoPresEmo + (duoPresQt ? ' + ★' + duoPresQt : '') + '</b> · ' + escHtml(tr('seu saldo')) + ' ★' + starT + '</p>' +
    '<small>' + escHtml(tr('As estrelas saem do seu saldo. 1 presente por pessoa por dia.')) + '</small>' +
    '<div class="btns"><button type="button" class="btn" id="duoPresOk">' + escHtml(tr('Enviar')) + ' ' + duoPresEmo + '</button></div>';
}
var DUO_PRES_ERRO = { hoje:'Você já mandou um presente hoje para essa pessoa.', limite:'Você chegou ao limite de presentes de hoje.', saldo:'Estrelas insuficientes.', alvo:'Essa pessoa não está participando do Moon⭐Duo!', bloqueado:'Sua conta está bloqueada pela moderação.' };
function duoMsg(t){var m=$('duoMsg');if(!m||duoOv.hidden)return;if(m._twTimeout){m._twTimeout.cancel();m._twTimeout=null;}m.textContent=t;m.hidden=!t;if(t)m._twTimeout=twTimeoutVisivel(m,function(){return !duoOv.hidden&&m.isConnected;},function(){m.hidden=true;m._twTimeout=null;},5000);}
function duoAbrir(nick){
  duoVeioHub = !hubOv.hidden; lookSalvar();   // abre por cima da tela de início
  if(typeof perfOv !== 'undefined' && !perfOv.hidden) perfFechar();
  duoOv.hidden = false; duoOv.scrollTop = 0; duoT = 0; duoBalao = null; duoTexto();
  if(duoTrava('data-dfundo', [duoFundo])){ var tk = typeof temaAtual === 'function' ? temaAtual() : ''; duoFundo = tk && tk !== 'halloween' && TEMA_INFO[tk] ? tk : 'basico'; }
  if(duoTrava('data-dcena', duoInfo())) duoCena = 'dueto';
  if(duoExEu !== '' && duoTrava('data-dexeu', [duoExEu])) duoExEu = ''; if(duoExGu !== '' && duoTrava('data-dexgu', [duoExGu])) duoExGu = '';
  if(nick && contaJ) duoCarregar(nick);
  else { duoGu = null; duoEscolhaUI(); }
  if(sfx.card) sfx.card();
  if(typeof hubComecou !== 'undefined' && hubComecou) hubMusicaTocar();
}
function duoFechar(){ duoBuscaCancelar();var msg=$('duoMsg');if(msg&&msg._twTimeout){msg._twTimeout.cancel();msg._twTimeout=null;}duoLoadSeq++;duoOv.hidden = true; if(duoAnim){ cancelAnimationFrame(duoAnim); duoAnim = 0; } if(duoVeioHub) hubMostrar(); }
function duoMsgTxt(m){   // presentes do Moon⭐Duo! chegam como "duo:🧸:Nick"
  var p = /^duo:([^:]+):(.+)$/.exec(String(m || ''));
  return p ? p[1] + ' ' + tr('{nick} te mandou um presente pelo Moon⭐Duo!').replace('{nick}', p[2]) : m;
}
function duoTemaK(k){ return TEMA_INFO[k] && k !== 'halloween' ? k : ''; }   // o Halloween tem o fundo próprio da lojinha
function duoTemaGratis(k){ return !!duoTemaK(k) && temaAtual() === k; }
function temaProxTxt(k){   // quando o tema volta ("01/12")
  var md = dk().slice(5), prox = '', menor = '';
  TEMAS.forEach(function(l){ if(l[0] !== k) return; if(!menor || l[1] < menor) menor = l[1]; if(l[1] > md && (!prox || l[1] < prox)) prox = l[1]; });
  var a = prox || menor; return a ? a.slice(3) + '/' + a.slice(0, 2) : '';
}
function lojaItem(k){
  k = String(k); var i;
  for(i = 0; i < LOJA_EXTRA.length; i++) if(LOJA_EXTRA[i][0] === k) return LOJA_EXTRA[i];
  if(/^tema_/.test(k) && duoTemaK(k.slice(5))){ var ti = TEMA_INFO[k.slice(5)]; return [k, ti[0], ti[1], DUO_TEMA_PRECO, 'tema']; }
  if(/^pose_/.test(k)){ var p = perfPoseInfo(k.slice(5)); if(p && p[3]) return [k, p[1], p[2], p[3], 'pose']; }
  if(/^fundo_/.test(k)){ for(i = 0; i < PERF_FUNDOS.length; i++) if(PERF_FUNDOS[i][0] === k.slice(6) && PERF_FUNDOS[i][3]) return [k, PERF_FUNDOS[i][1], PERF_FUNDOS[i][2], PERF_FUNDOS[i][3], 'fundo']; }
  return null;
}
function lojaTem(k){ return !lojaItem(k) || (Array.isArray(perfDono) && perfDono.indexOf(String(k)) >= 0); }
function perfLoja2UI(){
  acessoriosSync();
  var box = $('perfLoja2'), boxAcc = $('perfLojaAcessorios'), boxItens=$('perfLojaItens'); if(!box||!boxAcc||!boxItens) return;
  var L = PERF_POSES.filter(function(o){ return o[3]; }).map(function(o){ return ['pose_' + o[0], o[1], o[2], o[3], 'pose']; }).concat(LOJA_EXTRA);
  function cards(lista){return lista.map(function(it){
    var dono = lojaTem(it[0]);
    var prev = it[4] === 'duo' ? '<i class="lojaemo" aria-hidden="true">' + it[1] + '</i>' : '<canvas width="160" height="160" data-l2="' + it[0] + '"></canvas>';
    var tipo = it[4] === 'pose' ? tr('Pose') : it[4] === 'expr' ? tr('Expressão') : it[4] === 'acc' ? tr('Acessório') : it[4] === 'item' ? tr('Item') : 'Moon⭐Duo!';
    return '<div class="perfroupa">' + prev + '<b>' + it[1] + ' ' + escHtml(tr(it[2])) + '</b><small class="perftemp" translate="no">' + escHtml(tipo) + '</small>' +
      (dono ? '<em class="ok">✓ ' + escHtml(tr('Seu')) + '</em>' : '<button type="button" class="btn" data-comprar2="' + it[0] + '"' + (starT < it[3] ? ' disabled' : '') + '>★' + it[3] + '</button>') + '</div>';
  }).join('');}
  boxAcc.innerHTML=cards(L.filter(function(it){return it[4]==='acc';}));
  boxItens.innerHTML=cards(L.filter(function(it){return it[4]==='item';}));
  box.innerHTML=cards(L.filter(function(it){return it[4]!=='acc'&&it[4]!=='item';}));
  [].forEach.call(document.querySelectorAll('#perfLoja2 canvas[data-l2], #perfLojaAcessorios canvas[data-l2], #perfLojaItens canvas[data-l2]'), function(cv){
    var k = cv.dataset.l2, av = perfAvAtual({ pose: /^pose_/.test(k) ? k.slice(5) : '', expr: /^expr_/.test(k) ? +k.slice(5) : 2, fundo: 'basico' });
    if(/^det_(coelho|tulipa|torrada)$/.test(k)){ av.c.det = k.slice(4); av.pose = 'v'; }
    if(k==='hat_palha'){ av.c.hat='palha'; av.pose='v'; }
    av.pose = /^pose_/.test(k) ? k.slice(5) : ''; av.expr = /^expr_/.test(k) ? +k.slice(5) : 2;
    try{ perfDesenharIdol(cv.getContext('2d'), 160, 160, av, true, /^expr_/.test(k), 0); }catch(e){}
  });
}
function lojaComprar(k, btn, depois){
  btn.disabled = true;
  return contaRpc('comprar_visual', { p_key: k }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); }
    if(!r || !r.ok){ btn.disabled = false; if(sfx.hit) sfx.hit(); depois(false, tr(r && r.erro === 'saldo' ? 'Estrelas insuficientes' : r && r.erro === 'temporada' ? 'Só dá para guardar durante a temporada do tema.' : 'Não deu para falar com o servidor. Tente de novo.')); return; }
    perfDono = Array.isArray(r.visuais) ? r.visuais : perfDono.concat(k);
    if(sfx.rank) sfx.rank(); if(typeof insConferir === 'function') insConferir();
    depois(true, '✨ ' + tr('Comprado!'));
  }).catch(function(){ btn.disabled = false; depois(false, tr('Não deu para falar com o servidor. Tente de novo.')); });
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
var duoAvisoNick = '', duoAvisoFeito = false, duoAvisoTimer = 0;
function duoAvisoAgendar(){
  if(!contaJ||duoAvisoFeito||duoAvisoTimer)return;
  duoAvisoTimer=setTimeout(function(){
    duoAvisoTimer=0;
    if(!contaJ||duoAvisoFeito)return;
    duoAvisoFeito=true;
    duoAvisosConferir();
  },3000);
}
function duoAvisosConferir(){
  if(!contaJ) return;
  contaRpc('duo_avisos_pendentes').then(function(L){
    if(!Array.isArray(L) || !L.length) return;
    duoAvisoNick = L[0].nick;
    var txt = tr('{nick} encontrou você no Moon⭐Duo! e fez uma cena com você 🌙').replace('{nick}', L[0].nick);
    if(L.length === 2) txt += ' ' + tr('(e mais 1 pessoa!)'); else if(L.length > 2) txt += ' ' + tr('(e mais {n} pessoas!)').replace('{n}', L.length - 1);
    $('duoAvisoTxt').textContent = txt;
    $('duoAvisoIr').textContent = '🌙 ' + tr('Fazer um Moon⭐Duo! com {nick}').replace('{nick}', L[0].nick);
    $('duoAvisoOk').textContent = tr('Fechar');
    duoAvisoOv.hidden = false; [784, 1047, 1319].forEach(function(f, i){ beep(f, .12, 'triangle', .035, i * .1); });
  }).catch(function(){});
}
