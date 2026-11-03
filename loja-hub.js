/* TsuLiPa⭐World — botão da Lojinha em "Meu mundo" (só front-end).
   Mostra a vista de Harajuku (a mesma da janela do Karaoke⭐Time!) e abre a lojinha que já existe no perfil
   (aba Montar Idol). Este arquivo só declara funções. */
function lojaHubHtml(){
  var lock = !contaJ ? '<em class="tw-profile-lock" aria-hidden="true" title="' + escHtml(tr('Entrar com Google')) + '">🔒</em>' : '';
  var arte = typeof KaraokeRoomViews === 'object' && KaraokeRoomViews ? '<canvas id="hubLojaCv" width="192" height="108" aria-hidden="true"></canvas>' : '<i>🛍️</i>';
  return '<button type="button" class="hubcard hubloja" data-ir="loja">' + lock + arte +
    '<span class="hublojat"><b>🛍️ ' + escHtml(tr('Lojinha')) + '</b><small class="tw-hubgame-jp" lang="ja">ショップ</small>' +
    '<small>' + escHtml(tr('Roupas e visuais da Harajuku')) + '</small></span></button>';
}
function lojaHubDesenhar(){
  var cv = $('hubLojaCv'), x = cv && cv.getContext('2d'); if(!x || typeof KaraokeRoomViews !== 'object') return;
  var noite = false; try{ noite = KaraokeRoomViews.isNight(Date.now()); }catch(e){}
  x.clearRect(0, 0, cv.width, cv.height);
  try{ KaraokeRoomViews.draw(x, 3, 3, cv.width - 6, cv.height - 6, 0, 'harajuku', noite); }catch(e){}
}
function lojaHubAbrir(){   // perfil > Montar Idol, rolando até a lojinha
  if(!contaJ){ contaEntrar(); return; }
  perfAba = 'montar'; perfZoom = true; perfAbrir(undefined, true);
  var n = 0, iv = setInterval(function(){
    var el = $('perfLoja');
    if(el || ++n > 40 || perfOv.hidden){ clearInterval(iv); if(el && el.scrollIntoView) el.scrollIntoView({ block:'center' }); }
  }, 100);
}
