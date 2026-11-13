/* TsuLiPa⭐World — Zipper⭐Shop! (lojinha como sessão própria, inspirada no Star⭐Gacha!).
   Cena: o seu Idol chega à lojinha de Harajuku e é atendido por Tsu, Lirika ou Pati (uma por dia, 0h de Brasília).
   A vitrine usa as listas e as compras que já existem (comprar_visual): roupas (perfLojaUI) e acessórios, itens,
   poses e extras (perfLoja2UI). Nada novo no banco. Este arquivo só declara funções e tabelas. */
var SHOP_ATENDE = [['Tsu', 0, '#9b30d9'], ['Lirika', 1, '#3f9c1f'], ['Pati', 2, '#4169e1']];
var SHOP_OI = ['Bem-vindo à Zipper⭐Shop!', 'Provou, gostou, levou!', 'Tem roupa nova na arara!'];
var shopT = 0, shopAnim = 0, shopFala = { txt:'', t0:-999 };
function shopAtendente(){   // uma por dia; nunca a própria pessoa (Tsu, Lirika ou Pati/Patiliri não se atendem)
  var d = Math.floor((Date.now() - 3 * 3600e3) / 864e5), eu = String(typeof contaJ !== 'undefined' && contaJ && contaJ.nick || '').toLowerCase();
  if(eu === 'patiliri') eu = 'pati';
  for(var k = 0; k < 3; k++){ var a = SHOP_ATENDE[(((d + k) % 3) + 3) % 3]; if(a[0].toLowerCase() !== eu) return a; }
  return SHOP_ATENDE[0];
}
function shopHtml(){
  return '<div class="panel shopp tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="shopTit">' +
    '<button type="button" class="perfx tw-window-control tw-window-close" id="shopX">✕</button>' +
    '<h2 class="tw-modal-title" id="shopTit" translate="no">🛍️ Zipper<span class="tw-modal-star">⭐</span>Shop!</h2><small class="tw-modal-jp" lang="ja">ジッパー・ショップ</small>' +
    '<p class="tw-modal-lede" id="shopLede"></p>' +
    '<canvas id="shopCv" width="640" height="380" aria-hidden="true"></canvas>' +
    '<p class="shopsaldo" id="shopSaldo"></p>' +
    '<div id="shopCorpo"></div></div>';
}
function shopCorpoHtml(){   // os mesmos blocos (e ids) da lojinha do perfil: as compras seguem iguais
  return '<section class="shopprov"><h3>🪞 ' + escHtml(tr('Provador')) + '</h3><canvas id="shopProvCv" width="512" height="512" aria-hidden="true"></canvas>' +
    '<div class="btns"><button type="button" class="btn" id="shopSalvar">💾 ' + escHtml(tr('Salvar visual')) + '</button><a class="btn alt" id="shopPng" href="#" download="zipper-shop.png">⬇️ ' + escHtml(tr('Baixar PNG')) + '</a></div>' +
    '<p class="perfmsg" id="shopProvMsg" hidden></p>' + shopLookHtml() + '</section>' +
    '<h3>✏️ ' + escHtml(tr('Montar Idol')) + '</h3><div class="cust perfmont" id="perfMont"></div>' +
    '<div class="btns shopmontbtns"><button type="button" class="btn alt" id="shopFotoPerfil">📸 ' + escHtml(tr('Foto do perfil')) + '</button></div>' +
    '<h3>👗 ' + escHtml(tr('Roupas')) + '</h3><p class="perfdica">' + escHtml(tr('Toque em Provar para ver no seu Idol antes de comprar.')) + '</p>' +
    '<div class="perfloja" id="perfLoja"></div><p class="perfmsg" id="perfLojaMsg" hidden></p>' +
    '<h3>🎀 ' + escHtml(tr('Acessórios')) + '</h3><div class="perfloja" id="perfLojaAcessorios"></div>' +
    '<h3>🍞 ' + escHtml(tr('Itens')) + '</h3><div class="perfloja" id="perfLojaItens"></div>' +
    '<h3>✨ ' + escHtml(tr('Poses e extras')) + '</h3><div class="perfloja" id="perfLoja2"></div><p class="perfmsg" id="perfLoja2Msg" hidden></p>';
}
function shopUI(){
  var a = shopAtendente();
  $('shopLede').textContent = tr('Hoje quem atende é') + ' ' + a[0] + ' ' + ['💜', '💚', '💙'][a[1]];
  $('shopSaldo').textContent = '★ ' + (starT || 0);
  if(typeof perfMontUI === 'function') perfMontUI();
  if(typeof perfLojaUI === 'function') perfLojaUI();
  if(typeof perfLoja2UI === 'function') perfLoja2UI();
  shopProvador();
  shopLookUI();
}
function shopAvAtual(){   // o seu Idol (com a roupa que está provando)
  var av = perfAvAtual({ fundo:'basico', pose:'v', expr:3 }); if(perfProva) av.c.out = perfProva; return av;
}
// Look do dia (dress-up da Barbie): um tema de cor por dia (0h de Brasília), igual para todo mundo.
// Combina quando a cor da roupa entra no tema; com as meias no mesmo tom, vira "Look completo".
// A foto é uma polaroid PNG feita no aparelho e guardada nos Momentos da sessão. Nada vai ao servidor.
var SHOP_LOOKS = [
  ['chiclete', '💗', 'Look rosa-chiclete', 'Roupa em tons de rosa.', function(h){ return h.s > .25 && h.l > .45 && (h.h >= 300 || h.h < 12); }],
  ['ceu',      '🩵', 'Look céu azul', 'Roupa azul-clara ou azul-céu.', function(h){ return h.s > .2 && h.l > .4 && h.h >= 185 && h.h < 240; }],
  ['menta',    '🌿', 'Look menta', 'Roupa verde ou verde-menta.', function(h){ return h.s > .2 && h.l > .3 && h.h >= 80 && h.h < 175; }],
  ['por',      '🌅', 'Look pôr do sol', 'Roupa laranja, pêssego ou amarela.', function(h){ return h.s > .3 && h.l > .35 && h.h >= 12 && h.h < 60; }],
  ['lavanda',  '💜', 'Look lavanda', 'Roupa lilás, lavanda ou roxa.', function(h){ return h.s > .2 && h.h >= 245 && h.h < 300; }],
  ['branco',   '🤍', 'Look tudo branco', 'Roupa branca ou quase branca.', function(h){ return h.l > .86 && h.s < .35; }],
  ['noite',    '🌙', 'Look noite estrelada', 'Roupa escura: preto, marinho ou vinho.', function(h){ return h.l < .3; }]
];
function shopLookHoje(){ var d = Math.floor((Date.now() - 3 * 3600e3) / 864e5); return SHOP_LOOKS[((d % SHOP_LOOKS.length) + SHOP_LOOKS.length) % SHOP_LOOKS.length]; }
function shopHsl(hex){
  var c = parseInt(String(hex || '').replace('#', ''), 16); if(isNaN(c)) return {h:0, s:0, l:1};
  var r = (c >> 16) / 255, g2 = ((c >> 8) & 255) / 255, b = (c & 255) / 255, mx = Math.max(r, g2, b), mn = Math.min(r, g2, b), l = (mx + mn) / 2, d = mx - mn, h = 0, s = 0;
  if(d){ s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g2 - b) / d) % 6 : mx === g2 ? (b - r) / d + 2 : (r - g2) / d + 4; h = (h * 60 + 360) % 360; }
  return {h:h, s:s, l:l};
}
function shopLookEstado(){
  var look = shopLookHoje(), c = shopAvAtual().c || {};
  var roupa = look[4](shopHsl(c.outcol || '#ffffff')), meias = !!c.legcol && c.legcol !== '#1c1c30' && look[4](shopHsl(c.legcol));
  return {look:look, combina:roupa, completo:roupa && meias};
}
function shopLookHtml(){
  return '<div class="shoplook" id="shopLook" role="status" aria-live="polite"></div>' +
    '<div class="btns"><button type="button" class="btn" id="shopLookFoto">📸 ' + escHtml(tr('Foto do Look do dia')) + '</button></div>' +
    '<p class="perfmsg" id="shopLookMsg" hidden></p>';
}
function shopLookUI(){
  var box = $('shopLook'), bt = $('shopLookFoto'); if(!box) return;
  var e = shopLookEstado(), L = e.look;
  box.className = 'shoplook' + (e.combina ? ' on' : '');
  box.innerHTML = '<b>' + L[1] + ' ' + escHtml(tr('Look do dia')) + ': ' + escHtml(tr(L[2])) + '</b><span>' + escHtml(tr(L[3])) + ' ' +
    escHtml(tr('As meias no mesmo tom completam o look.')) + '</span><em>' +
    escHtml(e.completo ? '✨ ' + tr('Look completo!') : e.combina ? '💖 ' + tr('Combina com o tema!') : '🪞 ' + tr('Escolha a cor da roupa em Montar Idol.')) + '</em>';
  if(bt) bt.disabled = !e.combina;
}
function shopLookFoto(){
  var e = shopLookEstado(), msg = $('shopLookMsg'); if(!e.combina) return;
  var W = 600, H = 720, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  var x = cv.getContext('2d'); if(!x) return;
  var cor = (shopAvAtual().c || {}).outcol || '#ff6fb5';
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);                                   // papel da polaroid
  var fundo = x.createLinearGradient(0, 30, 0, 570); fundo.addColorStop(0, '#fff0f8'); fundo.addColorStop(1, cor);
  x.fillStyle = fundo; x.fillRect(30, 30, 540, 540);
  x.globalAlpha = .5; x.fillStyle = '#ffffff'; x.font = '34px sans-serif'; x.textAlign = 'center';
  [[90, 100, '✦'], [510, 130, '★'], [80, 470, '★'], [520, 480, '✦'], [300, 80, '♡']].forEach(function(s){ x.fillText(s[2], s[0], s[1]); });
  x.globalAlpha = 1;
  x.save(); x.beginPath(); x.rect(30, 30, 540, 540); x.clip(); x.translate(30, 30);
  try{ perfDesenharIdol(x, 540, 540, shopAvAtual(), false); }catch(err){}
  x.restore();
  x.fillStyle = '#7b3ff0'; x.font = '900 30px "M PLUS Rounded 1c",sans-serif';
  x.fillText(e.look[1] + ' ' + tr(e.look[2]) + (e.completo ? ' ✨' : ''), W / 2, 625);
  x.fillStyle = '#8a6aa8'; x.font = '800 20px "M PLUS Rounded 1c",sans-serif';
  var hoje = new Date(Date.now() - 3 * 3600e3).toISOString().slice(5, 10).split('-').reverse().join('/');
  x.fillText((contaJ && contaJ.nick ? contaJ.nick + ' · ' : '') + tr('Look do dia') + ' · ' + hoje + ' · Zipper⭐Shop!', W / 2, 668);
  var url = cv.toDataURL('image/png');
  var guardou = typeof petPhoneMomentoGuardar === 'function' && petPhoneMomentoGuardar('look', url);
  if(msg){
    msg.hidden = false;
    msg.innerHTML = escHtml(guardou ? '💗 ' + tr('Guardado nos Momentos do celular!') : tr('Adote um pet no Backstage⭐Pet! para guardar nos Momentos.')) +
      ' <a href="' + url + '" download="look-do-dia.png">⬇️ ' + escHtml(tr('Baixar PNG')) + '</a>';
  }
  if(sfx && sfx.card) try{ sfx.card(); }catch(err){}
}
function shopProvador(){
  var cv = $('shopProvCv'), x = cv && cv.getContext('2d'); if(!x) return;
  x.clearRect(0, 0, cv.width, cv.height);
  try{ perfDesenharIdol(x, cv.width, cv.height, shopAvAtual(), true); }catch(e){}
}
function shopPng(a){   // PNG 1024×1024 com assinatura, como o do perfil
  var cv = document.createElement('canvas'); cv.width = cv.height = 1024; var x = cv.getContext('2d');
  try{ perfDesenharIdol(x, 1024, 1024, shopAvAtual(), true); }catch(e){}
  x.font = '800 26px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'right'; x.fillStyle = 'rgba(255,255,255,.85)'; x.shadowColor = 'rgba(30,10,60,.6)'; x.shadowBlur = 6;
  x.fillText((contaJ && contaJ.nick ? contaJ.nick + ' · ' : '') + 'Zipper⭐Shop! · TsuLiPa⭐World', 1000, 1004);
  a.href = cv.toDataURL('image/png'); a.download = 'zipper-shop' + (contaJ && contaJ.nick ? '-' + String(contaJ.nick).replace(/[^\w-]+/g, '') : '') + '.png';
}
function shopSalvar(){
  var m = $('shopProvMsg');
  if(perfProva && !perfLojaTem(perfProva)){ if(m){ m.textContent = tr('Compre a roupa para salvar com ela.'); m.hidden = false; } return; }
  if(perfProva){ perfMontMudou('out', perfProva); perfProva = ''; }
  if(typeof lookSalvar === 'function') lookSalvar(true, m);
  if(contaJ && (!perfMeuAv || perfMeuAv.auto)) contaRpc('salvar_avatar', { p_avatar: perfAvAtual({ auto:true }) }).catch(function(){});
  if(sfx && sfx.card) try{ sfx.card(); }catch(e){}
  shopUI();
}
function shopAbrir(){
  if(!contaJ){ contaEntrar(); return; }
  if(!perfOv.hidden) petLifeCancelar('trofeus'); // troca de rota a partir do Perfil
  if(perfOv.hidden){ var pc = $('perfAbaCorpo'); if(pc) pc.innerHTML = ''; }   // os ids da lojinha passam a ser os da Zipper⭐Shop!
  else perfFechar();
  perfProva = '';
  $('shopCorpo').innerHTML = shopCorpoHtml();
  shopOv.hidden = false; shopOv.scrollTop = 0; shopT = 0;
  shopFala = { txt:SHOP_OI[Math.floor(Math.random() * SHOP_OI.length)], t0:40 };
  shopUI();
  contaRpc('meu_perfil').then(function(d){   // compras atualizadas (podem ter sido feitas em outro aparelho)
    if(!d || shopOv.hidden) return; perfDono = Array.isArray(d.visuais) ? d.visuais.slice() : perfDono; perfLojaSincronizar(); shopUI();
  }).catch(function(){});
  if(!shopAnim) shopAnim = requestAnimationFrame(shopLoop);
}
function shopFechar(){ shopOv.hidden = true; perfProva = ''; $('shopCorpo').innerHTML = ''; if(!petLifeRetornar('espelho')) hubMostrar(); }
function shopLoop(ms){
  shopAnim = 0; if(!twAnimacaoVisivel(shopOv)) return;
  var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('shopCv'), ms) : 1, ant = shopT; shopT += d;
  if(Math.floor(shopT / 2) > Math.floor(ant / 2)) shopDesenhar();
  shopAnim = requestAnimationFrame(shopLoop);
}
function shopDesenhar(){
  var cv = $('shopCv'); if(!cv) return;
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, t = shopT, i, chao = H2 * .9, a = shopAtendente();
  x.clearRect(0, 0, W2, H2);
  if(typeof KaraokeRoomViews === 'object' && KaraokeRoomViews){   // a rua de Harajuku ao fundo
    x.save(); try{ KaraokeRoomViews.draw(x, -20, -20, W2 + 40, H2 * .82 + 20, t, 'harajuku', KaraokeRoomViews.isNight(Date.now())); }catch(e){} x.restore();
  } else perfFundo(x, W2, H2, 'temporada', '#ff6fb5', t);
  x.fillStyle = '#f6e7ff'; x.fillRect(0, chao - 6, W2, H2 - chao + 6); x.fillStyle = '#e3cdf7'; x.fillRect(0, chao - 6, W2, 4);
  var bx = W2 * .66;
  // fachada: toldo listrado nas cores do TsuLiPa e letreiro
  x.fillStyle = '#fff'; x.fillRect(bx - 170, 62, 340, chao - 62);
  x.fillStyle = '#ffe3f2'; x.fillRect(bx - 160, 108, 320, chao - 170);
  for(i = 0; i < 8; i++){ x.fillStyle = ['#9b30d9', '#ffffff', '#5cc72c', '#ffffff', '#4169e1', '#ffffff', '#ff6fb5', '#ffffff'][i]; x.beginPath(); x.moveTo(bx - 172 + i * 43, 70); x.lineTo(bx - 129 + i * 43, 70); x.lineTo(bx - 129 + i * 43, 104); x.quadraticCurveTo(bx - 150 + i * 43, 116, bx - 172 + i * 43, 104); x.fill(); }
  x.fillStyle = '#ff6fb5'; x.fillRect(bx - 178, 44, 356, 28);
  x.fillStyle = '#fff'; x.font = '900 17px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ZIPPER ⭐ SHOP!', bx, 59);
  // arara com cabides e roupinhas coloridas
  x.strokeStyle = '#8a6a9e'; x.lineWidth = 4; x.beginPath(); x.moveTo(bx - 150, 132); x.lineTo(bx - 30, 132); x.stroke();
  x.beginPath(); x.moveTo(bx - 146, 132); x.lineTo(bx - 146, chao - 70); x.moveTo(bx - 34, 132); x.lineTo(bx - 34, chao - 70); x.stroke();
  ['#ff6fb5', '#4dd8ff', '#ffe14d', '#b6ff3b', '#9b30d9'].forEach(function(cor, j){
    var hx = bx - 132 + j * 23, sw = Math.sin(t * .05 + j) * 1.5;
    x.strokeStyle = '#8a6a9e'; x.lineWidth = 2; x.beginPath(); x.arc(hx, 138, 4, Math.PI, 0); x.stroke();
    x.fillStyle = cor; x.beginPath(); x.moveTo(hx - 9 + sw, 144); x.lineTo(hx + 9 + sw, 144); x.lineTo(hx + 11 + sw, 182); x.lineTo(hx - 11 + sw, 182); x.closePath(); x.fill();
    x.fillStyle = 'rgba(255,255,255,.55)'; x.fillRect(hx - 9 + sw, 150, 18, 3);
  });
  // atendente do dia atrás do balcão
  var oS = state, oPw = pw, oDpw = dpw, oR = rankI, oSa = sash, oA = accSel, oF = frame, sc = 2.6;
  try{
    state = 'play'; pw = null; dpw = null; rankI = 0; sash = false; accSel = ''; frame = t;
    var ax = bx + 80, bob = Math.sin(t * .06) * 1.2;
    perfCharContorno(x, ax - 15 * sc, chao - 70 - 34 * sc + bob, sc, function(){ charPose = 'v'; drawChar(CH[a[1]], 0, 0, 0, t - shopFala.t0 < 150 && t > shopFala.t0 ? 3 : 2, false); });
    charPose = ''; perfAntena = '';
    x.fillStyle = '#c98b55'; x.fillRect(bx + 10, chao - 70, 150, 70); x.fillStyle = '#a0673a'; x.fillRect(bx + 10, chao - 70, 150, 8);   // balcão
    x.font = '22px sans-serif'; x.fillText('🛍️', bx + 50, chao - 84); x.fillText('🎀', bx + 128, chao - 82);
    // o seu Idol entra pela esquerda (com a roupa que estiver provando)
    var c = Object.assign({}, CU); if(perfProva) c.out = perfProva;   // na loja é sempre o seu Idol (o que você monta aqui)
    var psc = 3, alvo = bx - 230, px = Math.min(alvo, -30 + t * 3), anda = px < alvo;
    accSel = typeof perfAvAtual === 'function' ? (perfAvAtual().a || '') : '';
    x.fillStyle = 'rgba(30,10,60,.25)'; x.beginPath(); x.ellipse(px, chao, 14 * psc, 2.4 * psc, 0, 0, 7); x.fill();
    perfCharContorno(x, px - 15 * psc, chao - 44 * psc - (anda ? Math.abs(Math.sin(t * .3)) * 4 : 0), psc, function(){ charPose = anda ? '' : (perfProva ? 'v' : ''); drawChar(c, 0, 0, anda ? 1 : 0, perfProva ? 3 : 2, false); });
  }catch(e){}
  finally{ state = oS; pw = oPw; dpw = oDpw; rankI = oR; sash = oSa; accSel = oA; frame = oF; charPose = ''; perfAntena = ''; }
  // balão da atendente
  var rg = t - shopFala.t0;
  if(shopFala.txt && rg >= 0 && rg < 220){
    var txt = tr(shopFala.txt); x.save(); x.globalAlpha = rg < 190 ? 1 : (220 - rg) / 30;
    x.font = '15px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    var tw = x.measureText(txt).width + 26, bxx = Math.min(W2 - tw / 2 - 8, bx + 80), byy = chao - 70 - 34 * sc - 30;
    x.fillStyle = '#fff'; x.strokeStyle = a[2]; x.lineWidth = 2.5; x.beginPath();
    if(x.roundRect) x.roundRect(bxx - tw / 2, byy - 16, tw, 32, 16); else x.rect(bxx - tw / 2, byy - 16, tw, 32);
    x.fill(); x.stroke(); x.fillStyle = a[2]; x.fillText(txt, bxx, byy + 1); x.restore();
  }
}
function shopReage(){   // tocar na cena: a atendente fala de novo
  if(shopT - shopFala.t0 < 60) return;
  shopFala = { txt:SHOP_OI[Math.floor(Math.random() * SHOP_OI.length)], t0:shopT };
  if(sfx && sfx.star) try{ sfx.star(); }catch(e){}
}
function shopHubHtml(){   // botão em "Meu mundo"
  var lock = !contaJ ? '<em class="tw-profile-lock" aria-hidden="true" title="' + escHtml(tr('Entrar com Google')) + '">🔒</em>' : '';
  return '<button type="button" class="hubcard hubloja" data-ir="loja">' + lock + '<i>🛍️</i><b translate="no">Zipper⭐Shop!</b><small class="tw-hubgame-jp" lang="ja">ジッパー・ショップ</small>' +
    '<small>' + escHtml(tr('Roupas, acessórios e poses')) + '</small></button>';
}
function shopFotoPerfil(){   // a foto do perfil (Estúdio) continua no perfil: a loja leva até lá
  petLifeCancelar('espelho'); // quem seguiu para outra tela deixa de estar no fluxo do espelho
  shopOv.hidden = true; perfProva = ''; $('shopCorpo').innerHTML = '';
  perfAba = 'estudio'; perfZoom = true; perfAbrir(undefined, true);
}
