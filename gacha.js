/* Star⭐Gacha! — giro diário, cápsula, card do Idol e últimos cards.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 3), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (estado, janela do gacha, listeners e inicialização continuam lá). */
var GACHA_SORTE = ['Hoje não veio nada... mas amanhã a sorte gira! 🍀', 'Cápsula vazia! Pelo menos você treinou o giro 💪', 'Nada hoje. A Tsu disse que dá sorte tentar amanhã 🎤',
  'Só confete! 🎊 Volte amanhã', 'A Lirika guardou o prêmio pra amanhã 🐨', 'O Pati disse: amanhã é dia de coroa! 👑', 'Sorte pequena: um sorriso 😊', 'Hoje não... mas o Center te espera! ⭐'];
var GACHA_BONUS = { ima:'🧲 Ímã', escudo:'🛡️ Escudo', fever:'🔥 Fever' };
var gachaFeito = false, gachaRes = null, gachaT = 0, gachaAnim = 0, gachaGiro = -1, gachaAgora = false;
function gachaConferir(){
  if(!contaJ){ gachaFeito = false; return; }
  contaRpc('gacha_hoje').then(function(r){ gachaFeito = !!(r && r.tipo); gachaRes = gachaFeito ? r : null; if(!hubOv.hidden) hubCardsUI(); if(!gachaOv.hidden){ gachaUI(); gachaCardUI(); } }).catch(function(){});
}
function gachaTexto(r){
  if(!r) return '';
  if(r.tipo === 'ticket') return ({pt:'🎟️ Você ganhou +1 ticket de Karaoke!',en:'🎟️ You won +1 Karaoke ticket!',es:'🎟️ ¡Ganaste +1 ticket de Karaoke!',th:'🎟️ คุณได้ตั๋วคาราโอเกะ +1 ใบ!',ja:'🎟️ カラオケチケットを1枚獲得！'}[LANG]||'🎟️ Você ganhou +1 ticket de Karaoke!');
  if(r.tipo === 'estrelas') return '⭐ ' + tr('Você ganhou') + ' ★' + r.valor + '!';
  if(r.tipo === 'bonus') return '✨ ' + tr('Bônus na próxima corrida') + ': ' + (GACHA_BONUS[r.valor] || r.valor) + '!';
  if(r.tipo === 'card') return '🃏 ' + tr('Você tirou o card de') + ' ' + (r.card ? r.card.nick : r.valor) + '!';
  return tr(GACHA_SORTE[(+r.valor || 0) % GACHA_SORTE.length]);
}
function gachaUI(){
  $('gachaTit').innerHTML = '🎰 Star<span class="tw-modal-star">⭐</span>Gacha!';
  $('twGachaLede').textContent = tr('1 giro por dia');
  var b = $('gachaGirar'), t = $('gachaTxt');
  if(!contaJ){ b.textContent = '🎰 ' + tr('Girar!'); b.disabled = false; t.textContent = tr('Entre com Google para girar (1 vez por dia).'); return; }
  if(gachaFeito){ b.textContent = tr('Volte amanhã') + ' 🌙'; b.disabled = false; t.textContent = (gachaAgora ? '' : '✅ ' + tr('Você já girou hoje!') + ' ') + gachaTexto(gachaRes); return; }
  b.textContent = '🎰 ' + tr('Girar!'); b.disabled = gachaGiro >= 0; t.textContent = tr('Gire a manivela e veja o que sai da cápsula!');
}
function gachaCardUI(){   // o card do Idol que saiu (estilo dos cards do BRS48 Collect)
  var cv = $('gachaCardCv'), dl = $('gachaCardDl'), d = gachaRes && gachaRes.tipo === 'card' && gachaRes.card;
  cv.hidden = !d; dl.hidden = !d; if(!d) return;
  gachaCardDesenhar(cv, d);
  dl.textContent = '⬇️ ' + tr('Baixar card');
  dl.onclick = function(){ this.href = cv.toDataURL('image/png'); this.download = 'star-gacha-' + String(d.nick).replace(/[^\w-]+/g, '') + '.png'; };
}
function gachaCardDesenhar(cv, d){
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, i, h = 0;
  for(i = 0; i < d.nick.length; i++) h = (h * 31 + d.nick.charCodeAt(i)) % 997;
  var oshi = d.oshi && PERF_OSHI[d.oshi], cor = oshi ? oshi[2] : ['#b48cff', '#ffb36b', '#6bc8ff', '#ff8fc7'][h % 4];
  var best = +d.best || 0, rk = rankOf(best), rar = d.aniver ? 'BDAY' : rk >= 9 ? 'SSR' : rk >= 6 ? 'SR' : rk >= 3 ? 'R' : 'N';   // raridade pelo rank do Center Run: N até Team · R Senbatsu–tCenter · SR wCenter–Solo Center · SSR Capitão+
  function rr(x0, y0, w, hh, r0){ x.beginPath(); x.moveTo(x0 + r0, y0); x.arcTo(x0 + w, y0, x0 + w, y0 + hh, r0); x.arcTo(x0 + w, y0 + hh, x0, y0 + hh, r0); x.arcTo(x0, y0 + hh, x0, y0, r0); x.arcTo(x0, y0, x0 + w, y0, r0); x.closePath(); }
  x.clearRect(0, 0, W2, H2);
  rr(0, 0, W2, H2, 22); x.save(); x.clip();
  var gr = x.createLinearGradient(0, 0, W2, H2); if(d.aniver){ gr.addColorStop(0, '#ffc6e3'); gr.addColorStop(.35, '#e2d1ff'); gr.addColorStop(.7, '#c6f1ff'); gr.addColorStop(1, '#fff1a8'); } else { gr.addColorStop(0, petMix(cor, 1, .82)); gr.addColorStop(.5, petMix(cor, 1, .55)); gr.addColorStop(1, petMix(cor, 1, .75)); }
  x.fillStyle = gr; x.fillRect(0, 0, W2, H2);
  x.globalAlpha = .35; x.fillStyle = '#fff';   // faixas de luz em diagonal
  for(i = -2; i < 8; i++){ x.beginPath(); x.moveTo(i * 70, 0); x.lineTo(i * 70 + 26, 0); x.lineTo(i * 70 - 174, H2); x.lineTo(i * 70 - 200, H2); x.fill(); }
  x.globalAlpha = 1;
  perfEnfeites(x, W2, H2 * 1.3, ['#fff', petMix(cor, 0, .1), '#ffe14d'], 14, h, 0, .75);
  for(i = 0; i < 26; i++){ x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.arc(W2 - 70 + (i % 6) * 10, 300 + Math.floor(i / 6) * 10, 2, 0, 7); x.fill(); }   // bolinhas no canto, como nos cards do Collect
  // o Idol (sem fundo próprio, por cima do card)
  if(d.aniver){   // confete e faixa de parabéns
    for(i = 0; i < 46; i++){ x.fillStyle = ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#9b30d9'][i % 5]; x.save(); x.translate(cenaHash(i * 3) * W2, cenaHash(i * 7) * H2 * .7); x.rotate(cenaHash(i) * 6); x.fillRect(-4, -2, 8, 4); x.restore(); }
  }
  var av = d.avatar && typeof d.avatar === 'object' ? JSON.parse(JSON.stringify(d.avatar)) : {}; av.pet = null;
  if(d.aniver){ av.c = av.c && typeof av.c === 'object' ? av.c : {}; av.c.out = 'festa48'; }
  var tmp = document.createElement('canvas'); tmp.width = W2; tmp.height = 380;
  try{ perfDesenharIdol(tmp.getContext('2d'), W2, 380, av, false, false, 0); }catch(e){}
  x.drawImage(tmp, 0, 18);
  // pet ativo no canto
  if(d.pet && PET_SP[d.pet.k]){
    x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc(W2 - 52, 330, 34, 0, 7); x.fill();
    x.strokeStyle = cor; x.lineWidth = 3; x.stroke();
    perfDesenharPetEm(x, { k:d.pet.k, acc:d.pet.acc || '' }, W2 - 52, 332, 1.7, 0);
  }
  // selo de raridade
  var rg = x.createLinearGradient(14, 14, 84, 44), RC = { BDAY:['#ff6fb5', '#9b30d9'], SSR:['#ffe14d', '#f59e0b'], SR:['#ff9ccd', '#ff4f9a'], R:['#9ec8ff', '#4169e1'], N:['#d8cdea', '#9a8bb8'] }[rar]; rg.addColorStop(0, RC[0]); rg.addColorStop(1, RC[1]);
  x.fillStyle = rg; rr(14, 14, rar === 'BDAY' ? 84 : rar === 'SSR' ? 70 : rar === 'SR' ? 54 : 40, 30, 8); x.fill();
  x.fillStyle = '#fff'; x.font = '900 20px sans-serif'; x.textAlign = 'left'; x.fillText(rar, 24, 37);
  // placa do nome
  x.fillStyle = 'rgba(255,255,255,.92)'; rr(14, H2 - 132, W2 - 28, 118, 16); x.fill();
  x.fillStyle = cor; x.fillRect(14, H2 - 132, 8, 118);
  x.fillStyle = '#2c1a5e'; x.font = '900 26px sans-serif'; x.fillText(String(d.nick).slice(0, 14), 32, H2 - 98);
  x.fillStyle = '#9b30d9'; x.font = '800 15px sans-serif'; x.fillText(tr(RANKS[rankOf(best)][1]) + ' · 🏆 ' + best, 32, H2 - 74);
  if(oshi){ x.fillStyle = '#6b5a8e'; x.font = '700 14px sans-serif'; x.fillText('推し ' + oshi[0] + ' ' + oshi[1], 32, H2 - 52); }
  if(d.frase){ x.fillStyle = '#6b5a8e'; x.font = 'italic 13px sans-serif'; x.fillText('“' + String(d.frase).slice(0, 34) + '”', 32, H2 - 30); }
  x.fillStyle = 'rgba(44,26,94,.55)'; x.font = '800 11px sans-serif'; x.textAlign = 'right'; x.fillText(d.aniver ? 'TsuLiPa⭐World · HAPPY BIRTHDAY!' : 'TsuLiPa⭐World · STAR⭐GACHA!', W2 - 24, H2 - 18);
  if(d.aniver){   // fita "Happy Birthday" no alto
    x.save(); x.translate(W2 - 70, 46); x.rotate(.32); var fg = x.createLinearGradient(-90, 0, 90, 0); fg.addColorStop(0, '#ff6fb5'); fg.addColorStop(.5, '#9b30d9'); fg.addColorStop(1, '#4169e1');
    x.fillStyle = fg; x.fillRect(-110, -16, 220, 32); x.fillStyle = '#fff'; x.font = '900 15px sans-serif'; x.textAlign = 'center'; x.fillText('🎂 HAPPY BIRTHDAY!', 0, 6); x.restore();
  }
  x.restore();
  x.strokeStyle = 'rgba(255,255,255,.9)'; x.lineWidth = 6; rr(3, 3, W2 - 6, H2 - 6, 20); x.stroke();
}
function gachaAbrir(){ gachaAgora = false;   // abre por cima da tela de início (sem o Center Run no fundo)
  if(typeof gachaCardsCarregar === 'function') gachaCardsCarregar(); gachaOv.hidden = false; gachaT = 0; gachaGiro = -1; gachaUI(); gachaCardUI(); if(!gachaAnim) gachaAnim = requestAnimationFrame(gachaLoop); gachaConferir(); if(hubComecou) hubMusicaTocar(); }
function gachaFechar(){ gachaOv.hidden = true; hubMostrar(); }
function gachaDesenhar(){
  var cv = $('gachaCv'), x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, t = gachaT, i;
  x.clearRect(0, 0, W2, H2);
  perfFundo(x, W2, H2, 'temporada', '#ff6fb5', t);
  var bx = W2 * .62, chao = H2 * .9;
  // barraquinha: toldo listrado nas cores do TsuLiPa
  x.fillStyle = '#7a4a2a'; x.fillRect(bx - 150, 70, 12, chao - 70); x.fillRect(bx + 138, 70, 12, chao - 70);
  for(i = 0; i < 8; i++){ x.fillStyle = ['#9b30d9', '#ffffff', '#5cc72c', '#ffffff', '#4169e1', '#ffffff', '#ff6fb5', '#ffffff'][i]; x.beginPath(); x.moveTo(bx - 160 + i * 40, 60); x.lineTo(bx - 120 + i * 40, 60); x.lineTo(bx - 120 + i * 40, 96); x.quadraticCurveTo(bx - 140 + i * 40, 112, bx - 160 + i * 40, 96); x.fill(); }
  x.fillStyle = '#ff6fb5'; x.fillRect(bx - 165, 48, 330, 14);
  x.fillStyle = '#fff'; x.font = '900 13px sans-serif'; x.textAlign = 'center'; x.fillText('STAR ⭐ GACHA!', bx, 59);
  x.fillStyle = '#c98b55'; x.fillRect(bx - 150, chao - 70, 300, 70); x.fillStyle = '#a0673a'; x.fillRect(bx - 150, chao - 70, 300, 8);
  // máquina de cápsulas
  var mx = bx, my = chao - 70, giro = gachaGiro >= 0 ? gachaGiro : 0;
  x.fillStyle = '#e0303a'; x.fillRect(mx - 46, my - 70, 92, 70); x.fillStyle = '#b91c1c'; x.fillRect(mx - 46, my - 10, 92, 10);
  x.fillStyle = 'rgba(220,240,255,.75)'; x.beginPath(); x.arc(mx, my - 110, 52, 0, 7); x.fill();
  for(i = 0; i < 11; i++){   // cápsulas com luz, sombra e brilho
    var a = i * 2.4 + (gachaGiro >= 0 ? t * .25 : 0), rr = 14 + (i % 3) * 11, kx = mx + Math.cos(a) * rr, ky = my - 104 + Math.sin(a) * rr * .7, kc = ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#9b30d9'][i % 5];
    var kg = x.createRadialGradient(kx - 3, ky - 3, 1, kx, ky, 10); kg.addColorStop(0, petMix(kc, 1, .6)); kg.addColorStop(.6, kc); kg.addColorStop(1, petMix(kc, 0, .35));
    x.fillStyle = kg; x.beginPath(); x.arc(kx, ky, 9, 0, 7); x.fill();
    x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc(kx, ky + 1, 9, 0, Math.PI); x.fill();   // metade de baixo branca, como as cápsulas de verdade
    x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 1; x.beginPath(); x.moveTo(kx - 9, ky + 1); x.lineTo(kx + 9, ky + 1); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); x.ellipse(kx - 3.5, ky - 4, 2.6, 1.6, -.6, 0, 7); x.fill();
  }
  var vg = x.createRadialGradient(mx - 18, my - 128, 4, mx, my - 110, 52); vg.addColorStop(0, 'rgba(255,255,255,.55)'); vg.addColorStop(.35, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(120,160,220,.25)');
  x.fillStyle = vg; x.beginPath(); x.arc(mx, my - 110, 52, 0, 7); x.fill();   // reflexo do vidro
  x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath(); x.arc(mx, my - 110, 52, 0, 7); x.stroke();
  x.save(); x.translate(mx + 18, my - 40); x.rotate(gachaGiro >= 0 ? t * .3 : 0); x.fillStyle = '#ffe14d'; x.fillRect(-14, -3, 28, 6); x.beginPath(); x.arc(0, 0, 8, 0, 7); x.fill(); x.restore();
  x.fillStyle = '#2b1b4a'; x.fillRect(mx - 26, my - 28, 22, 14);
  if(gachaGiro >= 0 && t % 90 > 45 || (gachaFeito && gachaRes && gachaAgora)){   // a cápsula sai (só logo depois de girar)
    var aberta = gachaFeito && gachaRes && gachaAgora;
    x.fillStyle = '#ff6fb5'; x.beginPath(); x.arc(mx - 15, my - 6 - (aberta ? 4 : 0), 10, Math.PI, 0); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(mx - 15, my - 6 + (aberta ? 6 : 0), 10, 0, Math.PI); x.fill();
    if(aberta){ x.font = '28px sans-serif'; x.fillText(gachaRes.tipo === 'estrelas' ? '⭐' : gachaRes.tipo === 'bonus' ? '✨' : '🍀', mx - 15, my - 26 - Math.abs(Math.sin(t * .08)) * 8); }
  }
  // o seu personagem vai até a barraquinha
  var c = sel === 3 ? CU : CH[sel], sc = 3.2, alvo = bx - 120, px = Math.min(alvo, 40 + t * 3), anda = px < alvo;
  var oS = state, oPw = pw, oDpw = dpw, oR = rankI, oSa = sash, oF = frame;
  try{
    state = 'play'; pw = null; dpw = null; rankI = 0; sash = false; frame = t;
    x.fillStyle = 'rgba(30,10,60,.25)'; x.beginPath(); x.ellipse(px, chao, 14 * sc, 2.4 * sc, 0, 0, 7); x.fill();
    perfCharContorno(x, px - 15 * sc, chao - 44 * sc - (anda ? Math.abs(Math.sin(t * .3)) * 4 : 0), sc, function(){ charPose = anda ? '' : 'v'; drawChar(c, 0, 0, anda ? 1 : 0, gachaFeito ? 3 : 2, false); });
  }catch(e){}
  finally{ state = oS; pw = oPw; dpw = oDpw; rankI = oR; sash = oSa; frame = oF; charPose = ''; perfAntena = ''; }
}
function gachaLoop(ms){
  gachaAnim = 0; if(!twAnimacaoVisivel(gachaOv)) return;
  var mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30()),delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta($('gachaCv'),ms):1,gachaPrevT=gachaT;gachaT+=delta; if(gachaGiro >= 0) gachaGiro+=delta;
  if((mobile30&&TWMotionLifecycle.render30Due($('gachaCv'),ms))||(!mobile30&&Math.floor((gachaT+1e-6)/2)>Math.floor((gachaPrevT+1e-6)/2))) gachaDesenhar();
  gachaAnim = requestAnimationFrame(gachaLoop);
}
function gachaBonus(){   // bônus do Gachapon: começa a próxima corrida com o poder
  contaRpc('usar_bonus').then(function(b){
    if(!b || state !== 'play') return;
    if(b === 'escudo') shield = 1;
    else pw = { k:b, t:480 };
    toast = '🎰 ' + tr('Bônus do Star⭐Gacha!') + ': ' + (GACHA_BONUS[b] || b); toastT = 140;
    if(sfx.card) sfx.card();
  }).catch(function(){});
}
// --- cards do Star⭐Gacha! (molduras, zoom, últimos cards) ---
var cardsMem = {};
function cardsDia(s){ var p = /^(\d{4})-(\d\d)-(\d\d)/.exec(String(s || '')); return p ? p[3] + '/' + p[2] : ''; }
function cardsHtml(lista, pre, meu){
  if(pre === 'gachaCards'){   // no gacha: sempre 3 molduras (as vazias mostram que cabem 3)
    lista = lista || [];
    return '<p class="cardsdica">' + escHtml(tr('Os 3 últimos cards que você tirar aparecem aqui. O novo sempre empurra o mais antigo.')) + '</p><div class="cards3">' + [0, 1, 2].map(function(i){
      var c = lista[i];
      if(!c) return '<div class="cardmini vazio" aria-hidden="true"><div class="cardvazio"><b>🃏</b><span>?</span></div><small>' + escHtml(tr('Vazio')) + '</small></div>';
      return '<button type="button" class="cardmini' + (c.tipo === 'aniver' ? ' bday' : '') + '" data-cardz="' + pre + '|' + i + '"><canvas id="' + pre + 'Cv' + i + '" width="360" height="504"></canvas><small>' + (c.tipo === 'aniver' ? '🎂 ' : '🃏 ') + escHtml(c.card ? c.card.nick : '') + ' · ' + cardsDia(c.dia) + '</small></button>';
    }).join('') + '</div>';
  }
  if(!lista || !lista.length) return '<p class="perfcarr">' + escHtml(tr(meu === false ? 'Nenhum card ainda.' : 'Nenhum card ainda. Gire o Star⭐Gacha!')) + '</p>';
  return '<div class="cards3">' + lista.slice(0, 3).map(function(c, i){
    return '<button type="button" class="cardmini' + (c.tipo === 'aniver' ? ' bday' : '') + '" data-cardz="' + pre + '|' + i + '" title="' + escHtml(tr('Ver card')) + '"><canvas id="' + pre + 'Cv' + i + '" width="360" height="504"></canvas><small>' + (c.tipo === 'aniver' ? '🎂 ' : '🃏 ') + escHtml(c.card ? c.card.nick : '') + ' · ' + cardsDia(c.dia) + '</small></button>';
  }).join('') + '</div>';
}
function cardsDados(c){ var d = JSON.parse(JSON.stringify(c.card || {})); if(c.tipo === 'aniver') d.aniver = true; d.nick = d.nick || '?'; return d; }
function cardsDesenhar(lista, pre){
  cardsMem[pre] = lista || [];
  cardsMem[pre].slice(0, 3).forEach(function(c, i){ var cv = $(pre + 'Cv' + i); if(cv && c.card) try{ gachaCardDesenhar(cv, cardsDados(c)); }catch(e){} });
}
function gachaCardsCarregar(){
  var box = $('gachaCards'); if(!box) return;
  $('gachaCardsT').textContent = '🃏 ' + tr('Seus últimos cards');
  if(!contaJ){ box.innerHTML = ''; return; }
  contaRpc('meus_cards').then(function(L){ box.innerHTML = cardsHtml(L || [], 'gachaCards', true); cardsDesenhar(L || [], 'gachaCards'); }).catch(function(){});
}
