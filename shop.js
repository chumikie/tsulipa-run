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
    '<p class="perfmsg" id="shopProvMsg" hidden></p></section>' +
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
}
function shopAvAtual(){   // o seu Idol (com a roupa que está provando)
  var av = perfAvAtual({ fundo:'basico', pose:'v', expr:3 }); if(perfProva) av.c.out = perfProva; return av;
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
function shopFechar(){ shopOv.hidden = true; perfProva = ''; $('shopCorpo').innerHTML = ''; hubMostrar(); }
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
  shopOv.hidden = true; perfProva = ''; $('shopCorpo').innerHTML = '';
  perfAba = 'estudio'; perfZoom = true; perfAbrir(undefined, true);
}
