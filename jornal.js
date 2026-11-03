/* TsuLiPa⭐World — Idol⭐News! (o jornal semanal do site; só leitura do que já existe).
   Também é aqui que ficam as Novidades e o Top Idols da semana (pódios), que saíram do fim da página inicial.
   Pódios da semana (tw_podio_semana), Idols da vitrine (vitrine_idols), música e vista da semana,
   banner do dia e atendente da Zipper⭐Shop!. A semana vai de domingo 0h a sábado (Brasília).
   Este arquivo só declara funções e tabelas. */
var JORNAL_NOVIDADES = [
  ['🛍️', 'Zipper⭐Shop!: a lojinha agora tem casa própria em Harajuku, com Tsu, Lirika ou Pati no balcão.'],
  ['🎭', 'Banner da página inicial com rodízio: um dia o TsuLiPa, nos outros dois, trios de Idols do site.'],
  ['📰', 'Chegou o Idol⭐News!: os destaques da semana, as fotos do dia, o Top Idols e as novidades num lugar só.'],
  ['🎮', 'No Center⭐Run!, o personagem Idol agora aparece com o seu nome.']
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
  var h = '<header class="jntopo"><b class="jnnome" translate="no">📰 Idol<span class="tw-modal-star">⭐</span>News!</b><small lang="ja">アイドル・ニュース</small>' +
    '<p>' + (sem ? escHtml(tr('Semana de {a} a {b}').replace('{a}', jornalData(sem)).replace('{b}', jornalData(sem, 6))) + ' · ' : '') + escHtml(tr('placar parcial até domingo 0h')) + '</p></header>';
  if(c1) h += '<article class="jnmanchete"><canvas class="jnfoto jngrande" width="128" height="128" data-jnick="' + escHtml(c1.nick) + '" aria-hidden="true"></canvas><div><small>' + escHtml(tr('Manchete')) + '</small>' +
    '<h3>' + escHtml(c1.nick) + ' ' + escHtml(tr('lidera o')) + ' <span translate="no">Center⭐Run!</span></h3><p>' + jornalNum(c1.score) + ' ' + escHtml(tr('pontos na melhor corrida da semana.')) + '</p></div></article>';
  h += '<section class="jnbloco"><h4>📸 ' + escHtml(tr('Fotos do dia')) + '</h4><div class="jnfotos" id="jornalFotosDia"></div></section>';
  h += '<h4 class="jntopt">🏆 Top Idols ' + escHtml(tr('da semana')) + '</h4><div class="jnpodios">' + jornalPodio('🏁 <span translate="no">Center⭐Run!</span>', d.center, tr('pts')) + jornalPodio('☁️ <span translate="no">Sora⭐Jump!</span>', d.sora, 'm') + jornalPodio('🎤 <span translate="no">Karaoke⭐Time!</span>', d.karaoke, tr('pts')) + '</div>';
  if(combo || prec) h += '<section class="jnbloco"><h4>🌟 ' + escHtml(tr('Destaques do Karaoke')) + '</h4><ul>' +
    (combo ? '<li>' + escHtml(tr('Maior combo')) + ': <b>' + escHtml(combo.nick) + '</b> (' + jornalNum(combo.score) + ')</li>' : '') +
    (prec ? '<li>' + escHtml(tr('Melhor precisão')) + ': <b>' + escHtml(prec.nick) + '</b> (' + String(prec.score).replace('.', ',') + '%)</li>' : '') + '</ul></section>';
  h += '<section class="jnbloco"><h4>🏙️ ' + escHtml(tr('Na cidade')) + '</h4><ul>' +
    '<li>' + escHtml(tr('No banner de hoje')) + ': <b>' + escHtml(cast ? cast.map(function(p){ return p.nick; }).join(', ') : 'Tsu, Lirika e Pati') + '</b></li>' +
    (at ? '<li>' + escHtml(tr('No balcão da Zipper⭐Shop!')) + ': <b>' + escHtml(at[0]) + '</b></li>' : '') +
    (mus ? '<li>' + escHtml(tr('Música da semana')) + ': <b translate="no">' + escHtml(mus[1]) + '</b></li>' : '') +
    (vista ? '<li>' + escHtml(tr('Vista da janela do Karaoke')) + ': <b>' + escHtml(vista) + '</b></li>' : '') +
    (total ? '<li>' + escHtml(tr('Idols na vitrine')) + ': <b>' + total + '</b></li>' : '') + '</ul></section>';
  h += jornalPostsHtml();
  return h;
}
function jornalFotos(){
  [].forEach.call(document.querySelectorAll('#jornalCorpo canvas[data-jnick]'), function(cv){
    var av = jornalAvatar(cv.dataset.jnick); if(!av) return;
    try{ perfFotoRedonda(cv, av, true); }catch(e){}
  });
}
// Fotos do dia: 3 ceninhas com 3 ou 4 Idols da vitrine, sorteadas pela data (todos veem as mesmas)
var JORNAL_CENAS = [   // [fundo, emoji, legenda, poses]
  ['palco', '🎤', '{n} ensaiando a coreografia nova no palco', ['mic', 'banzai', 'luz', 'v']],
  ['cafe', '☕', '{n} num lanchinho no café depois do show', ['coracao', 'v', 'tchau', '']],
  ['ceu', '☁️', '{n} pulando de nuvem em nuvem', ['banzai', 'v', 'nyan', 'tchau']],
  ['noite', '🌙', '{n} no ensaio da noite', ['luz', 'mic', 'coracao', 'v']],
  ['basico', '🌸', '{n} tirando foto de grupo', ['v', 'coracao', 'nyan', 'tchau']],
  ['oshi', '💖', '{n} com lightsticks para o Oshi', ['luz', 'luz', 'coracao', 'banzai']]
];
function jornalSorteio(L, s){ var a = L.slice(); s = (s * 2654435761) >>> 0 || 7; for(var i = a.length - 1; i > 0; i--){ s = (s * 1103515245 + 12345) >>> 0; var k = s % (i + 1), t = a[i]; a[i] = a[k]; a[k] = t; } return a; }
function jornalFotosDia(){
  var box = $('jornalFotosDia'); if(!box) return;
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols.filter(function(p){ return p && p.nick && p.avatar && p.avatar.c; }) : [];
  if(L.length < 3){ box.innerHTML = '<p class="jnvazio">' + escHtml(tr('As fotos aparecem quando a vitrine carregar.')) + '</p>'; return; }
  L.sort(function(a, b){ return String(a.nick).localeCompare(String(b.nick)); });
  var dia = Math.floor((Date.now() - 3 * 3600e3) / 864e5), gente = jornalSorteio(L, dia), cenas = jornalSorteio(JORNAL_CENAS, dia + 7), pos = 0, h = '';
  var fotos = [0, 1, 2].map(function(i){
    var n = (dia + i) % 2 ? 4 : 3; if(L.length < n) n = L.length;
    var grupo = []; for(var k = 0; k < n; k++) grupo.push(gente[(pos + k) % gente.length]); pos += n;
    return { cena:cenas[i % cenas.length], grupo:grupo };
  });
  jornalFotosHoje = fotos;
  box.innerHTML = fotos.map(function(f, i){
    return '<figure class="jnfoto3"><button type="button" class="jnfotobtn" data-jfoto="' + i + '" aria-label="' + escHtml(tr('Ampliar foto')) + '"><canvas width="480" height="300" aria-hidden="true"></canvas></button><figcaption>' + f.cena[1] + ' ' + escHtml(jornalLegenda(f)) + '</figcaption></figure>';
  }).join('');
  fotos.forEach(function(f, i){ var b = box.querySelector('[data-jfoto="' + i + '"]'), cv = b && b.querySelector('canvas'); if(cv) jornalFotoDesenhar(cv, f, false); });
}
var jornalFotosHoje = [];
function jornalLegenda(f){
  var nomes = f.grupo.map(function(p){ return p.nick; }), lista = tr('{a} e {b}').replace('{a}', nomes.slice(0, -1).join(', ')).replace('{b}', nomes[nomes.length - 1]);
  return tr(f.cena[2]).replace('{n}', lista);
}
function jornalFotoDesenhar(cv, f, assinatura){
  var x = cv.getContext('2d'); if(!x) return;
  var W2 = cv.width, H2 = cv.height, cor = (f.grupo[0].avatar.c && f.grupo[0].avatar.c.hair) || '#ff6fb5';
  x.clearRect(0, 0, W2, H2);
  try{ if(f.cena[0] === 'cafe' && typeof duoFundoDesenhar === 'function') duoFundoDesenhar(x, W2, H2, 'cafe', 0, cor); else perfFundo(x, W2, H2, f.cena[0], cor, 0); }catch(e){}
  var n = f.grupo.length, slot = W2 / n;
  f.grupo.forEach(function(p, k){
    var av = JSON.parse(JSON.stringify(p.avatar)); av.pose = f.cena[3][k % f.cena[3].length]; av.expr = [2, 3, 6, 3][k % 4]; av.visual = '';
    x.save(); x.translate(k * slot - slot * .1, H2 * .06); try{ perfDesenharIdol(x, slot * 1.2, H2 * .94, av, false, false, 0); }catch(e){} x.restore();
  });
  if(assinatura){
    var u = W2 / 480; x.font = '800 ' + Math.round(13 * u) + 'px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'right'; x.fillStyle = 'rgba(255,255,255,.9)';
    x.shadowColor = 'rgba(30,10,60,.6)'; x.shadowBlur = 5 * u; x.fillText('Idol⭐News! · TsuLiPa⭐World', W2 - 10 * u, H2 - 10 * u); x.shadowBlur = 0;
  }
}
function jornalFotoAmpliar(i){   // abre grande, com BAIXAR (a mesma tela de foto do jogo)
  var f = jornalFotosHoje[i]; if(!f) return;
  var cv = document.createElement('canvas'); cv.width = 1440; cv.height = 900; jornalFotoDesenhar(cv, f, true);
  var u = cv.toDataURL('image/png'), dia = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  $('shimg').src = u; $('shimg').alt = jornalLegenda(f); $('shdl').href = u; $('shdl').download = 'idol-news-' + dia + '-' + (i + 1) + '.png';
  if(typeof petPhShow === 'function') petPhShow(false);
  $('shr').hidden = false; if(sfx && sfx.card) try{ sfx.card(); }catch(e){}
}
function jornalAbrir(){
  jornalOv.hidden = false; jornalOv.scrollTop = 0;
  $('jornalCorpo').innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  if(typeof hubIdolsCarregar === 'function' && !(typeof hubIdolsDados !== 'undefined' && hubIdolsDados)) hubIdolsCarregar();
  contaRpc('tw_podio_semana').then(function(d){ if(jornalOv.hidden) return; $('jornalCorpo').innerHTML = jornalMontar(d); jornalFotos(); jornalFotosDia(); jornalPostsCarregar(); })
    .catch(function(){ if(!jornalOv.hidden){ $('jornalCorpo').innerHTML = jornalMontar({}); jornalFotos(); jornalFotosDia(); jornalPostsCarregar(); } });
}
function jornalFechar(){ jornalOv.hidden = true; }
// ---------- Novidades como blog: só a admin posta (imagem, título e legenda); ficam os 5 últimos ----------
// RPCs news_posts / admin_news_postar / admin_news_apagar: proposta em supabase/sql/proposta/20261103150000_idol_news_posts.sql
var jornalPosts = null, jornalPostImg = '';
function jornalPostsHtml(){
  var h = '<section class="jnbloco jnblog"><h4>✨ ' + escHtml(tr('Novidades')) + '</h4>';
  if(typeof perfAdmin !== 'undefined' && perfAdmin && contaJ) h += '<details class="jnpostar"><summary>✏️ ' + escHtml(tr('Novo post')) + '</summary>' +
    '<label>' + escHtml(tr('Título')) + ' <input type="text" id="jnPostTit" maxlength="80"></label>' +
    '<label>' + escHtml(tr('Legenda')) + ' <textarea id="jnPostLeg" maxlength="600" rows="3"></textarea></label>' +
    '<label>' + escHtml(tr('Imagem')) + ' <input type="file" id="jnPostImg" accept="image/*"></label><img id="jnPostPrev" alt="" hidden>' +
    '<div class="btns"><button type="button" class="btn" id="jnPostOk">' + escHtml(tr('Publicar')) + '</button></div><p class="perfmsg" id="jnPostMsg" hidden></p></details>';
  h += '<div id="jornalPosts"></div></section>';
  return h;
}
function jornalPostsUI(){
  var box = $('jornalPosts'); if(!box) return;
  if(jornalPosts === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  if(!jornalPosts.length){   // sem posts (ou o blog ainda não está no servidor): as novidades desta versão
    box.innerHTML = '<ul>' + JORNAL_NOVIDADES.map(function(n){ return '<li>' + n[0] + ' ' + escHtml(tr(n[1])) + '</li>'; }).join('') + '</ul>'; return;
  }
  var adm = typeof perfAdmin !== 'undefined' && perfAdmin;
  box.innerHTML = jornalPosts.map(function(p){
    var d = new Date(p.criado), dt = isNaN(d) ? '' : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
    return '<article class="jnpost">' + (/^data:image\/jpeg;base64,/.test(p.imagem || '') ? '<img src="' + p.imagem + '" alt="' + escHtml(p.titulo) + '" loading="lazy">' : '') +
      '<h5>' + escHtml(p.titulo) + (dt ? ' <small>' + dt + '</small>' : '') + '</h5>' + (p.legenda ? '<p>' + escHtml(p.legenda) + '</p>' : '') +
      (adm ? '<button type="button" class="btn alt jnpostdel" data-jnapagar="' + (+p.id) + '">🗑️ ' + escHtml(tr('Apagar')) + '</button>' : '') + '</article>';
  }).join('');
}
function jornalPostsCarregar(){
  jornalPosts = null; jornalPostsUI();
  contaRpc('news_posts').then(function(L){ jornalPosts = Array.isArray(L) ? L.slice(0, 5) : []; jornalPostsUI(); })
    .catch(function(){ jornalPosts = []; jornalPostsUI(); });
}
function jornalPostImagem(file){   // reduz para até 900 px e JPEG, antes de enviar
  jornalPostImg = ''; var pv = $('jnPostPrev'); if(!file) { if(pv) pv.hidden = true; return; }
  var r = new FileReader();
  r.onload = function(){ var im = new Image(); im.onload = function(){
    var k = Math.min(1, 900 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
    var q = .82, u = cv.toDataURL('image/jpeg', q); while(u.length > 340000 && q > .4){ q -= .1; u = cv.toDataURL('image/jpeg', q); }
    jornalPostImg = u; if(pv){ pv.src = u; pv.hidden = false; }
  }; im.src = r.result; };
  r.readAsDataURL(file);
}
function jornalPostar(btn){
  var m = $('jnPostMsg'), t = ($('jnPostTit').value || '').trim(), l = ($('jnPostLeg').value || '').trim();
  if(!t){ m.textContent = tr('Escreva um título.'); m.hidden = false; return; }
  btn.disabled = true;
  contaRpc('admin_news_postar', { p_titulo:t, p_legenda:l, p_imagem:jornalPostImg }).then(function(r){
    btn.disabled = false;
    if(!r || !r.ok){ m.textContent = tr('Não deu para publicar.'); m.hidden = false; return; }
    $('jnPostTit').value = ''; $('jnPostLeg').value = ''; jornalPostImagem(null); m.textContent = '✨ ' + tr('Publicado!'); m.hidden = false; jornalPostsCarregar();
  }).catch(function(){ btn.disabled = false; m.textContent = tr('Não deu para publicar.'); m.hidden = false; });
}
function jornalPostApagar(id){
  contaRpc('admin_news_apagar', { p_id:id }).then(function(){ jornalPostsCarregar(); }).catch(function(){});
}
