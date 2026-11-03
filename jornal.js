/* TsuLiPa⭐World — Jornal TsuLiPa semanal (só leitura do que já existe).
   Pódios da semana (tw_podio_semana), Idols da vitrine (vitrine_idols), música e vista da semana,
   banner do dia e atendente da Zipper⭐Shop!. A semana vai de domingo 0h a sábado (Brasília).
   Este arquivo só declara funções e tabelas. */
var JORNAL_NOVIDADES = [
  ['🛍️', 'Zipper⭐Shop!: a lojinha agora tem casa própria em Harajuku, com Tsu, Lirika ou Pati no balcão.'],
  ['🎭', 'Banner da página inicial com rodízio: um dia o TsuLiPa, nos outros dois, trios de Idols do site.'],
  ['📰', 'Chegou o Jornal TsuLiPa: os destaques da semana num lugar só.']
];
function jornalData(iso, mais){ var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + (mais || 0)); return ('0' + d.getUTCDate()).slice(-2) + '/' + ('0' + (d.getUTCMonth() + 1)).slice(-2); }
function jornalAvatar(nick){
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols : [];
  var p = L.find(function(i){ return i && i.nick === nick; }); return p && p.avatar ? p.avatar : null;
}
function jornalNum(n){ return (+n || 0).toLocaleString('pt-BR'); }
function jornalPodio(tit, lista, un){
  lista = Array.isArray(lista) ? lista.slice(0, 3) : [];
  return '<section class="jnpodio"><h4>' + tit + '</h4>' + (lista.length ? '<ol>' + lista.map(function(p, i){
    return '<li><span class="jnmed">' + ['🥇', '🥈', '🥉'][i] + '</span><canvas class="jnfoto" width="64" height="64" data-jnick="' + escHtml(p.nick) + '" aria-hidden="true"></canvas><b>' + escHtml(p.nick) + '</b><small>' + jornalNum(p.score) + ' ' + un + '</small></li>';
  }).join('') + '</ol>' : '<p class="jnvazio">' + escHtml(tr('Ninguém ainda. Seja a primeira pessoa!')) + '</p>') + '</section>';
}
function jornalMontar(d){
  d = d || {};
  var sem = typeof d.semana === 'string' ? d.semana : '', c1 = (d.center || [])[0], cast = typeof bannerElenco === 'function' ? bannerElenco() : null;
  var at = typeof shopAtendente === 'function' ? shopAtendente() : null, mus = typeof hubMusicaSemana === 'function' ? hubMusicaSemana() : null;
  var vista = ''; try{ vista = KaraokeRoomViews.NAMES[KaraokeRoomViews.viewFor(Date.now())]; }catch(e){}
  var total = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && +hubIdolsDados.total || 0;
  var combo = (d.karaoke_combo || [])[0], prec = (d.karaoke_acertos || [])[0];
  var h = '<header class="jntopo"><b class="jnnome" translate="no">📰 Jornal TsuLiPa</b><small lang="ja">ツリパ新聞</small>' +
    '<p>' + (sem ? escHtml(tr('Semana de')) + ' ' + jornalData(sem) + ' ' + escHtml(tr('a')) + ' ' + jornalData(sem, 6) + ' · ' : '') + escHtml(tr('placar parcial até domingo 0h')) + '</p></header>';
  if(c1) h += '<article class="jnmanchete"><canvas class="jnfoto jngrande" width="128" height="128" data-jnick="' + escHtml(c1.nick) + '" aria-hidden="true"></canvas><div><small>' + escHtml(tr('Manchete')) + '</small>' +
    '<h3>' + escHtml(c1.nick) + ' ' + escHtml(tr('lidera o')) + ' <span translate="no">Center⭐Run!</span></h3><p>' + jornalNum(c1.score) + ' ' + escHtml(tr('pontos na melhor corrida da semana.')) + '</p></div></article>';
  h += '<div class="jnpodios">' + jornalPodio('🏁 <span translate="no">Center⭐Run!</span>', d.center, tr('pts')) + jornalPodio('☁️ <span translate="no">Sora⭐Jump!</span>', d.sora, 'm') + jornalPodio('🎤 <span translate="no">Karaoke⭐Time!</span>', d.karaoke, tr('pts')) + '</div>';
  if(combo || prec) h += '<section class="jnbloco"><h4>🌟 ' + escHtml(tr('Destaques do Karaoke')) + '</h4><ul>' +
    (combo ? '<li>' + escHtml(tr('Maior combo')) + ': <b>' + escHtml(combo.nick) + '</b> (' + jornalNum(combo.score) + ')</li>' : '') +
    (prec ? '<li>' + escHtml(tr('Melhor precisão')) + ': <b>' + escHtml(prec.nick) + '</b> (' + String(prec.score).replace('.', ',') + '%)</li>' : '') + '</ul></section>';
  h += '<section class="jnbloco"><h4>🏙️ ' + escHtml(tr('Na cidade')) + '</h4><ul>' +
    '<li>' + escHtml(tr('No banner de hoje')) + ': <b>' + escHtml(cast ? cast.map(function(p){ return p.nick; }).join(', ') : 'Tsu, Lirika e Pati') + '</b></li>' +
    (at ? '<li>' + escHtml(tr('No balcão da Zipper⭐Shop!')) + ': <b>' + escHtml(at[0]) + '</b></li>' : '') +
    (mus ? '<li>' + escHtml(tr('Música da semana')) + ': <b translate="no">' + escHtml(mus[1]) + '</b></li>' : '') +
    (vista ? '<li>' + escHtml(tr('Vista da janela do Karaoke')) + ': <b>' + escHtml(vista) + '</b></li>' : '') +
    (total ? '<li>' + escHtml(tr('Idols na vitrine')) + ': <b>' + total + '</b></li>' : '') + '</ul></section>';
  h += '<section class="jnbloco"><h4>✨ ' + escHtml(tr('Novidades')) + '</h4><ul>' + JORNAL_NOVIDADES.map(function(n){ return '<li>' + n[0] + ' ' + escHtml(tr(n[1])) + '</li>'; }).join('') + '</ul></section>';
  return h;
}
function jornalFotos(){
  [].forEach.call(document.querySelectorAll('#jornalCorpo canvas[data-jnick]'), function(cv){
    var av = jornalAvatar(cv.dataset.jnick); if(!av) return;
    try{ perfFotoRedonda(cv, av, true); }catch(e){}
  });
}
function jornalAbrir(){
  jornalOv.hidden = false; jornalOv.scrollTop = 0;
  $('jornalCorpo').innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  if(typeof hubIdolsCarregar === 'function' && !(typeof hubIdolsDados !== 'undefined' && hubIdolsDados)) hubIdolsCarregar();
  contaRpc('tw_podio_semana').then(function(d){ if(jornalOv.hidden) return; $('jornalCorpo').innerHTML = jornalMontar(d); jornalFotos(); })
    .catch(function(){ if(!jornalOv.hidden){ $('jornalCorpo').innerHTML = jornalMontar({}); jornalFotos(); } });
}
function jornalFechar(){ jornalOv.hidden = true; }
