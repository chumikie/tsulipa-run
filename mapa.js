/* TsuLiPa⭐World — Mapa da cidade idol (só front-end).
   Reaproveita as 5 vistas da janela do Karaoke⭐Time! (karaoke-room-views.js) como lugares da cidade.
   Cada lugar só abre o que já existe no site; nada novo é salvo. Este arquivo só declara funções e tabelas. */
var MAPA_LUGARES = [   // [vista, emoji, destino, texto do destino]
  ['liberdade', '🎤', 'karaoke', 'Karaoke⭐Time!'],
  ['praia',     '☁️', 'sora',    'Sora⭐Jump!'],
  ['gigoia',    '🐾', 'pet',     'Backstage⭐Pet!'],
  ['harajuku',  '🛍️', 'loja',    'Lojinha'],
  ['tailandia', '🌏', 'grupos',  'Grupos internacionais']
];
function mapaVistas(){ return typeof KaraokeRoomViews === 'object' && KaraokeRoomViews && typeof KaraokeRoomViews.draw === 'function' ? KaraokeRoomViews : null; }
function mapaHtml(){
  var V = mapaVistas(); if(!V) return '';
  var semana = '';
  try{ semana = V.viewFor(Date.now()); }catch(e){}
  return '<h2 class="hubblocot hubbt-mapa">🗺️ ' + escHtml(tr('Mapa da cidade')) + ' <small class="tw-jpsub" lang="ja">アイドルタウン</small></h2>' +
    '<div class="mapa" id="hubMapa">' + MAPA_LUGARES.map(function(l){
      var nome = V.NAMES[l[0]] || l[0], dest = l[2] === 'loja' || l[2] === 'grupos' ? tr(l[3]) : l[3];
      return '<button type="button" class="mapalugar mapa-' + l[0] + '" data-mapa="' + l[0] + '" aria-label="' + escHtml(nome + ': ' + dest) + '">' +
        '<canvas width="320" height="180" aria-hidden="true"></canvas>' +
        (l[0] === semana ? '<em class="mapasem">🎤 ' + escHtml(tr('Vista da semana')) + '</em>' : '') +
        '<b translate="no">' + escHtml(nome) + '</b><small>' + l[1] + ' <span translate="no">' + escHtml(dest) + '</span></small></button>';
    }).join('') + '</div>';
}
function mapaDesenhar(){
  var V = mapaVistas(), box = $('hubMapa'); if(!V || !box) return;
  var noite = false; try{ noite = V.isNight(Date.now()); }catch(e){}
  [].forEach.call(box.querySelectorAll('[data-mapa]'), function(b){
    var cv = b.querySelector('canvas'), x = cv && cv.getContext('2d'); if(!x) return;
    x.clearRect(0, 0, cv.width, cv.height);
    try{ V.draw(x, 4, 4, cv.width - 8, cv.height - 8, 0, b.dataset.mapa, noite); }catch(e){}
  });
}
function mapaPerfilEm(aba, alvoId){   // abre o próprio perfil numa aba e rola até um campo
  if(!contaJ){ contaEntrar(); return; }
  perfAba = aba; perfZoom = true; perfAbrir(undefined, true);
  var n = 0, iv = setInterval(function(){
    var el = $(alvoId);
    if(el || ++n > 40 || perfOv.hidden){ clearInterval(iv); if(el && el.scrollIntoView){ el.scrollIntoView({ block:'center' }); if(el.focus) try{ el.focus({ preventScroll:true }); }catch(e){} } }
  }, 100);
}
function mapaIr(lugar){
  var l = MAPA_LUGARES.find(function(x){ return x[0] === lugar; }); if(!l) return;
  if(l[2] === 'loja'){ if(sfx.card) sfx.card(); mapaPerfilEm('montar', 'perfLoja'); return; }
  if(l[2] === 'grupos'){ if(sfx.card) sfx.card(); mapaPerfilEm('perfil', 'perfBioGrupo'); return; }
  var c = hubOv.querySelector('#hubCards [data-ir="' + l[2] + '"]'); if(c) c.click();
}
