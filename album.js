/* TsuLiPa⭐World — Álbum de cards do Star⭐Gacha! (só leitura).
   Um espaço para cada Idol da vitrine; os cards que você já tirou ficam no lugar, os outros mostram "?".
   Os dados vêm da consulta album_cards (proposta para o Supabase: docs/ALBUM_CARDS_SUPABASE.md).
   Enquanto ela não existir no banco, o álbum mostra os espaços e avisa que começa em breve.
   Este arquivo só declara funções e tabelas. */
var ALBUM_POR_PAGINA = 9;
var albumPag = 0, albumDados = null, albumPronto = false;
function albumIdols(){
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols : [];
  return L.filter(function(p){ return p && p.nick; }).map(function(p){ return String(p.nick); }).sort(function(a, b){ return a.localeCompare(b); });
}
function albumAbrir(){
  if(!contaJ){ contaEntrar(); return; }
  albumOv.hidden = false; albumOv.scrollTop = 0; albumPag = 0; albumDados = null; albumPronto = false;
  if(typeof hubIdolsCarregar === 'function' && !(typeof hubIdolsDados !== 'undefined' && hubIdolsDados)) hubIdolsCarregar();
  albumUI();
  contaRpc('album_cards').then(function(L){ albumDados = Array.isArray(L) ? L : []; albumPronto = true; albumUI(); })
    .catch(function(){ albumDados = []; albumPronto = false; albumUI(); });
}
function albumFechar(){ albumOv.hidden = true; petLifeRetornar('album'); }
function albumUI(){
  var corpo = $('albumCorpo'); if(!corpo) return;
  var nomes = albumIdols(), tenho = {};
  (albumDados || []).forEach(function(c){ var n = c && c.card && c.card.nick; if(n && !tenho[n]) tenho[n] = c; });
  // quem saiu no álbum mas não está mais na vitrine continua com o seu espaço
  Object.keys(tenho).forEach(function(n){ if(nomes.indexOf(n) < 0) nomes.push(n); });
  var total = nomes.length, achados = nomes.filter(function(n){ return tenho[n]; }).length;
  var pags = Math.max(1, Math.ceil(total / ALBUM_POR_PAGINA)); albumPag = Math.min(albumPag, pags - 1);
  var pg = nomes.slice(albumPag * ALBUM_POR_PAGINA, (albumPag + 1) * ALBUM_POR_PAGINA), lista = [];
  var h = '<p class="albumprog"><b>' + achados + '</b> / ' + total + ' ' + escHtml(tr('Idols no seu álbum')) + '</p>' +
    '<div class="albumbarra" aria-hidden="true"><i style="width:' + (total ? Math.round(achados / total * 100) : 0) + '%"></i></div>';
  h += albumMetasHtml(achados);
  if(albumDados === null) h += '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  else if(!albumPronto) h += '<p class="albumaviso">🛠️ ' + escHtml(tr('O álbum começa a guardar seus cards em breve. Por enquanto, veja quem falta!')) + '</p>';
  h += '<div class="albumgrade">' + pg.map(function(n){
    var c = tenho[n];
    if(!c) return '<div class="albumslot vazio"><div class="cardvazio"><b>🃏</b><span>?</span></div><small>' + escHtml(n) + '</small></div>';
    var i = lista.push(c) - 1;
    return '<button type="button" class="albumslot" data-cardz="album|' + i + '" title="' + escHtml(tr('Ver card')) + '"><canvas id="albumCv' + i + '" width="360" height="504"></canvas><small>' + escHtml(n) + (+c.vezes > 1 ? ' ×' + (+c.vezes) : '') + '</small></button>';
  }).join('') + '</div>';
  if(pags > 1) h += '<div class="albumpags"><button type="button" class="btn alt" data-album="-1"' + (albumPag ? '' : ' disabled') + '>◀</button><span>' + (albumPag + 1) + ' / ' + pags + '</span><button type="button" class="btn alt" data-album="1"' + (albumPag < pags - 1 ? '' : ' disabled') + '>▶</button></div>';
  if(albumPronto) h += '<div class="btns"><button type="button" class="btn" id="albumTrocar">🔁 ' + escHtml(tr('Trocar cards')) + '</button></div>';
  corpo.innerHTML = h;
  cardsMem.album = lista;
  lista.forEach(function(c, i){ var cv = $('albumCv' + i); if(cv && c.card) try{ gachaCardDesenhar(cv, cardsDados(c)); }catch(e){} });
}
// metas de coleção (só visuais): 5, 15, 30 e 50 Idols. A primeira vez que alcança uma, comemora uma vez neste aparelho.
var ALBUM_METAS = [[5, '🌱'], [15, '🌸'], [30, '💎'], [50, '👑']];
function albumMetasHtml(achados){
  if(!albumPronto) return '';
  var visto = 0; try{ visto = +localStorage.getItem('tw_album_meta') || 0; }catch(e){}
  var nova = 0;
  var h = '<div class="albummetas">' + ALBUM_METAS.map(function(m){
    var ok = achados >= m[0]; if(ok && m[0] > visto) nova = m[0];
    return '<span class="albummeta' + (ok ? ' ok' : '') + '" title="' + m[0] + ' Idols"><i>' + m[1] + '</i><b>' + m[0] + '</b></span>';
  }).join('') + '</div>';
  if(nova){ try{ localStorage.setItem('tw_album_meta', String(nova)); }catch(e){}
    h += '<p class="albummetanova">✨ ' + escHtml(tr('Nova meta do álbum: {n} Idols!').replace('{n}', nova)) + '</p>';
    if(typeof sfx !== 'undefined' && sfx && sfx.rank) try{ sfx.rank(); }catch(e){} }
  return h;
}
function albumPagina(d){ albumPag = Math.max(0, albumPag + d); albumUI(); if(sfx && sfx.card) try{ sfx.card(); }catch(e){} }
