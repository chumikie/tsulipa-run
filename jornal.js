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
  lista = Array.isArray(lista) ? lista.slice(0, 5) : [];
  return '<section class="jnpodio"><h4>' + tit + '</h4>' + (lista.length ? '<ol>' + lista.map(function(p, i){
    return '<li><span class="jnmed">' + (['🥇', '🥈', '🥉'][i] || '<b class="jnpos">' + (i + 1) + 'º</b>') + '</span><canvas class="jnfoto" width="64" height="64" data-jnick="' + escHtml(p.nick) + '" aria-hidden="true"></canvas><b>' + escHtml(p.nick) + '</b><small>' + jornalNum(p.score) + ' ' + un + '</small></li>';
  }).join('') + '</ol>' : '<p class="jnvazio">' + escHtml(tr('Ninguém ainda. Seja a primeira pessoa!')) + '</p>') + '</section>';
}
var jornalSemanaDados = {};
function jornalMontar(d){
  d = d || {}; jornalSemanaDados = d;
  var sem = typeof d.semana === 'string' ? d.semana : '', c1 = (d.center || [])[0], cast = typeof bannerElenco === 'function' ? bannerElenco() : null;
  var at = typeof shopAtendente === 'function' ? shopAtendente() : null, mus = typeof hubMusicaSemana === 'function' ? hubMusicaSemana() : null;
  var vista = ''; try{ vista = KaraokeRoomViews.NAMES[KaraokeRoomViews.viewFor(Date.now())]; }catch(e){}
  var total = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && +hubIdolsDados.total || 0;
  var combo = (d.karaoke_combo || [])[0], prec = (d.karaoke_acertos || [])[0];
  var h = '<header class="jntopo"><b class="jnnome" translate="no">📰 Idol<span class="tw-modal-star">⭐</span>News!</b><small lang="ja">アイドル・ニュース</small>' +
    '<p>' + (sem ? escHtml(tr('Semana de {a} a {b}').replace('{a}', jornalData(sem)).replace('{b}', jornalData(sem, 6))) + ' · ' : '') + escHtml(tr('placar parcial até domingo 0h')) + '</p></header>';
  if(c1) h += '<article class="jnmanchete"><button type="button" class="jnfotolink" data-jnperfil="' + escHtml(c1.nick) + '" aria-label="' + escHtml(tr('Ver perfil') + ': ' + c1.nick) + '"><canvas class="jnfoto jngrande" width="128" height="128" data-jnick="' + escHtml(c1.nick) + '" aria-hidden="true"></canvas></button><div><small>' + escHtml(tr('Manchete')) + '</small>' +
    '<h3><button type="button" class="jnnick jnnickg" data-jnperfil="' + escHtml(c1.nick) + '">' + escHtml(c1.nick) + '</button> ' + escHtml(tr('lidera o')) + ' <span translate="no">Center⭐Run!</span></h3><p>' + jornalNum(c1.score) + ' ' + escHtml(tr('pontos na melhor corrida da semana.')) + '</p></div></article>';
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
  if(mus) h += '<section class="jnbloco jnmusica"><h4>🎵 ' + escHtml(tr('Música da semana')) + '</h4><p><b translate="no">' + escHtml(mus[1]) + '</b>' + (vista ? ' · ' + escHtml(tr('Vista da janela do Karaoke')) + ': ' + escHtml(vista) : '') + '</p>' +
    '<div class="btns"><button type="button" class="btn" id="jnMusicaIr">🎤 ' + escHtml(tr('Cantar no Karaoke⭐Time!')) + '</button></div></section>';
  h += jornalTimesHtml() + jornalFestHtml() + jornalTrioHtml();
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
  // Foto especial: 8 Idols diante de uma paisagem do Karaoke, sorteada por dia.
  // Reutiliza o Canvas 2D da janela da sala sem alterar os três sorteios anteriores.
  if(gente.length >= 8 && typeof KaraokeRoomViews !== 'undefined' && KaraokeRoomViews.VIEWS.length){
    var ciclo = KaraokeRoomViews.VIEWS.length, locais = jornalSorteio(KaraokeRoomViews.VIEWS, Math.floor(dia / ciclo) + 31);
    var local = locais[((dia % ciclo) + ciclo) % ciclo], oito = [];
    for(var j = 0; j < 8; j++) oito.push(gente[(pos + j) % gente.length]);
    fotos.push({ cena:['ceu', '📸', '{n} tirando foto de grupo', ['v','banzai','nyan','coracao','tchau','v','banzai','coracao']], grupo:oito, tipo:'janela', local:local, noturna:dia % 3 === 0 });
  }
  // telão do Karaoke: o pódio da semana se apresentando juntos
  var kar = (jornalSemanaDados.karaoke || []).slice(0, 3).map(function(p){ var a = jornalAvatar(p.nick); return a ? { nick:p.nick, avatar:a } : null; }).filter(Boolean);
  if(kar.length >= 2) fotos.push({ cena:['palco', '📺', '{n} no telão do Karaoke⭐Time!', ['mic', 'luz', 'banzai']], grupo:kar, tipo:'telao' });
  // você e o seu pet (só para quem entrou e tem pet)
  var pa = typeof petAtivo === 'function' ? petAtivo() : null;
  if(contaJ && pa && petData && PET_SP[petData.ativo] && typeof perfAvAtual === 'function'){
    var meu = perfAvAtual({ pose:'coracao', expr:3, fundo:'basico' }); meu.pet = { k:petData.ativo, acc:typeof pa.acc === 'string' ? pa.acc : '' };
    var nomePet = pa.nome || PET_SP[petData.ativo].n;
    fotos.push({ cena:['oshi', '🐾', '{n} com ' + nomePet + ' no camarim', ['coracao']], grupo:[{ nick:contaJ.nick, avatar:meu }], tipo:'pet', legenda:tr('{a} com {b} no camarim').replace('{a}', contaJ.nick).replace('{b}', nomePet) });
  }
  jornalFotosHoje = fotos;
  box.innerHTML = fotos.map(function(f, i){
    return '<figure class="jnfoto3"><button type="button" class="jnfotobtn" data-jfoto="' + i + '" aria-label="' + escHtml(tr('Ampliar foto')) + '"><canvas width="480" height="300" aria-hidden="true"></canvas></button><figcaption>' + f.cena[1] + ' ' + escHtml(jornalLegenda(f)) + '</figcaption></figure>';
  }).join('');
  fotos.forEach(function(f, i){ var b = box.querySelector('[data-jfoto="' + i + '"]'), cv = b && b.querySelector('canvas'); if(cv) jornalFotoDesenhar(cv, f, false); });
}
var jornalFotosHoje = [];
function jornalLegenda(f){
  if(f.legenda) return f.legenda;
  if(f.tipo === 'janela') return tr('{n} tirando foto de grupo').replace('{n}', '8 Idols') + ' · ' + (KaraokeRoomViews.NAMES[f.local] || f.local);
  var nomes = f.grupo.map(function(p){ return p.nick; }), lista = tr('{a} e {b}').replace('{a}', nomes.slice(0, -1).join(', ')).replace('{b}', nomes[nomes.length - 1]);
  return tr(f.cena[2]).replace('{n}', lista);
}
function jornalFotoDesenhar(cv, f, assinatura){
  var x = cv.getContext('2d'); if(!x) return;
  var W2 = cv.width, H2 = cv.height, cor = (f.grupo[0].avatar.c && f.grupo[0].avatar.c.hair) || '#ff6fb5';
  x.clearRect(0, 0, W2, H2);
  try{
    if(f.tipo === 'janela' && typeof KaraokeRoomViews !== 'undefined') KaraokeRoomViews.drawScene(x, 0, 0, W2, H2, 0, f.local, !!f.noturna);
    else if(f.cena[0] === 'cafe' && typeof duoFundoDesenhar === 'function') duoFundoDesenhar(x, W2, H2, 'cafe', 0, cor);
    else perfFundo(x, W2, H2, f.cena[0], cor, 0);
  }catch(e){}
  if(f.tipo === 'telao'){   // moldura de telão com luzinhas
    x.save(); x.strokeStyle = '#ffd23f'; x.lineWidth = W2 / 60; x.strokeRect(x.lineWidth / 2, x.lineWidth / 2, W2 - x.lineWidth, H2 - x.lineWidth);
    for(var q = 0; q < 16; q++){ x.fillStyle = q % 2 ? '#ff6fb5' : '#4dd8ff'; x.beginPath(); x.arc(W2 * (q + .5) / 16, W2 / 120, W2 / 140, 0, 7); x.fill(); }
    x.restore();
  }
  var n = f.grupo.length, slot = W2 / n;
  if(f.tipo === 'pet'){
    var av1 = JSON.parse(JSON.stringify(f.grupo[0].avatar)), pet = typeof perfPetDoAvatar === 'function' ? perfPetDoAvatar(av1) : null;
    av1.visual = ''; av1.pet = null; av1.pose = 'banzai'; av1.expr = 3;
    x.save(); x.translate(-W2 * .07, -H2 * .42); x.rotate(-.045);
    try{ perfDesenharIdol(x, W2 * .82, H2 * 1.55, av1, false, false, 0); }catch(e){}
    x.restore();
    if(pet && typeof perfDesenharPetEm === 'function'){
      x.save(); x.translate(W2 * .77, H2 * .69); x.rotate(-.12);
      perfDesenharPetEm(x, pet, 0, 0, H2 / 68, 0); x.restore();
    }
    x.save(); x.textAlign = 'center'; x.font = '900 ' + Math.round(H2 * .095) + 'px sans-serif';
    [['♥',.82,.23,'#ff6fb5'],['✦',.61,.13,'#ffe14d'],['✦',.93,.45,'#8ae8ff']].forEach(function(a){ x.fillStyle = a[3]; x.fillText(a[0], W2 * a[1], H2 * a[2]); });
    x.restore(); n = 0;
  }
  if(f.tipo === 'janela'){
    f.grupo.forEach(function(p, k){
      var av8 = JSON.parse(JSON.stringify(p.avatar)), slot8 = W2 / 8;
      var balanco = [-.045,.025,-.035,.04,-.025,.04,-.03,.035][k];
      var varia = [1.04,.98,1.02,1.06,.97,1.03,.99,1.04][k];
      var altura = H2 * .54 * varia;
      var chao = H2 * (.962 - Math.abs(k - 3.5) * .009);
      var centro = slot8 * (k + .5);
      av8.pose = f.cena[3][k]; av8.expr = [3,2,6,3][k % 4]; av8.visual = ''; av8.pet = null;
      // Panorâmica em arco: oito rostos visíveis, sem uma fila cobrir a outra.
      // Cada Idol gira ao redor dos próprios pés, que continuam na areia.
      x.save(); x.translate(centro, chao); x.rotate(balanco);
      x.translate(-slot8 * .52, -altura * .9);
      try{ perfDesenharIdol(x, slot8 * 1.04, altura, av8, false, false, 0); }catch(e){}
      x.restore();
    });
    n = 0;
  }
  if(n) f.grupo.forEach(function(p, k){
    var av = JSON.parse(JSON.stringify(p.avatar)); av.pose = f.cena[3][k % f.cena[3].length]; av.expr = [2, 3, 6, 3][k % 4]; av.visual = '';
    var inclinacao = [-.065,.06,-.045,.07][k % 4], ampliacao = [1.045,.985,1.07,1.015][k % 4];
    var altura = H2 * .94 * ampliacao, chao = H2 * (.93 + [0,.008,-.007,.005][k % 4]);
    var centro = W2 / 2 + (k - (n - 1) / 2) * slot * .79;
    // Aproxima o trio, alterna pose e escala, mas conserva os pés na linha do chão.
    x.save(); x.translate(centro, chao); x.rotate(inclinacao);
    x.translate(-slot * .61, -altura * .9);
    try{ perfDesenharIdol(x, slot * 1.22, altura, av, false, false, 0); }catch(e){} x.restore();
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
function jornalTop5(d){   // o pódio do servidor tem 3; Center, Sora e Karaoke têm listas maiores: completa até 5
  d = d || {};
  var cen = _supabase ? _supabase.rpc('top_scores', { periodo:'week' }).then(function(r){ return r.error ? null : (r.data || []).map(function(x){ return { nick:x.name, score:x.score }; }); }) : Promise.resolve(null);
  var sor = _supabase ? _supabase.rpc('sora_ranking', { p_period:'week' }).then(function(r){ return r.error ? null : (r.data || []).map(function(x){ return { nick:x.nick, score:x.score }; }); }) : Promise.resolve(null);
  var kar = contaJ ? contaRpc('kt_ranking').then(function(k){ return k && Array.isArray(k.score) ? k.score.map(function(x){ return { nick:x.nick, score:x.score }; }) : null; }) : Promise.resolve(null);
  return Promise.all([cen.catch(function(){ return null; }), sor.catch(function(){ return null; }), kar.catch(function(){ return null; })]).then(function(r){
    if(r[0] && r[0].length >= (d.center || []).length) d.center = r[0];
    if(r[1] && r[1].length >= (d.sora || []).length) d.sora = r[1];
    if(r[2] && r[2].length >= (d.karaoke || []).length) d.karaoke = r[2];
    return d;
  });
}
function jornalAbrir(){
  jornalOv.hidden = false; jornalOv.scrollTop = 0;
  $('jornalCorpo').innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  if(typeof hubIdolsCarregar === 'function' && !(typeof hubIdolsDados !== 'undefined' && hubIdolsDados)) hubIdolsCarregar();
  contaRpc('tw_podio_semana').then(function(d){ return jornalTop5(d); }).then(function(d){ if(jornalOv.hidden) return; $('jornalCorpo').innerHTML = jornalMontar(d); jornalFotos(); jornalFotosDia(); jornalPostsCarregar(); jornalTimesCarregar(); jornalFestCarregar(); jornalTrioCarregar(); })
    .catch(function(){ if(!jornalOv.hidden){ $('jornalCorpo').innerHTML = jornalMontar({}); jornalFotos(); jornalFotosDia(); jornalPostsCarregar(); jornalTimesCarregar(); jornalFestCarregar(); jornalTrioCarregar(); } });
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
// ---------- Meta semanal dos Teams do BRS48 (RPC times_semana: proposta 20261103160000_times_semana.sql) ----------
var jornalTimes = null;
function jornalTimesHtml(){ return '<section class="jnbloco jntimes"><h4>🤝 ' + escHtml(tr('Meta dos Teams')) + ' <small>BRS48</small></h4><div id="jornalTimes"></div></section>'; }
function jornalTimeInfo(cod){
  var g = typeof PERF_GRUPOS !== 'undefined' ? PERF_GRUPOS.find(function(x){ return x.codigo === 'BRS48'; }) : null;
  return (g && g.times || []).find(function(t){ return t.codigo === cod; }) || { codigo:cod, nome:'Team ' + cod, cor:'#7b3ff0' };
}
function jornalTimesUI(){
  var box = $('jornalTimes'); if(!box) return;
  if(jornalTimes === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  var L = jornalTimes && Array.isArray(jornalTimes.times) ? jornalTimes.times : [];
  if(!L.length){ box.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('A meta dos Teams começa em breve: escolha o seu Team no perfil e jogue Center⭐Run! e Karaoke⭐Time! para encher a barra.')) + '</p>'; return; }
  box.innerHTML = '<p class="jndica">' + escHtml(tr('Como funciona: cada Team tem uma meta de 300 pontos por membro que jogou nesta semana. Os pontos são as estrelas ganhas no Center⭐Run! + 10 por show do Karaoke⭐Time!. Bateu a meta, o Team ganha a coroa 👑.')) + '</p>' + L.map(function(t, i){
    var info = jornalTimeInfo(t.codigo), meta = Math.max(1, +t.meta || 1), pts = +t.pontos || 0, pc = Math.min(100, Math.round(pts / meta * 100)), ok = pts >= meta;
    return '<div class="jntime"><div class="jntimel"><b style="color:' + info.cor + '">' + (i + 1) + 'º ' + escHtml(info.nome) + (ok ? ' 👑' : '') + '</b><small>' + jornalNum(pts) + ' / ' + jornalNum(meta) + '</small></div>' +
      '<div class="albumbarra jntimeb"><i style="width:' + pc + '%;background:' + info.cor + '"></i></div>' +
      '<small class="jntimed">' + escHtml(tr('Pontos: ⭐ {e} + 🎤 {s} shows × 10 · Meta: 300 × {a} que jogaram')).replace('{e}', jornalNum(t.estrelas)).replace('{s}', jornalNum(t.shows)).replace('{a}', Math.max(1, +t.ativos || 0)) + '</small></div>';
  }).join('');
}
function jornalTimesCarregar(){
  jornalTimes = null; jornalTimesUI();
  contaRpc('times_semana').then(function(d){ jornalTimes = d || {}; jornalTimesUI(); }).catch(function(){ jornalTimes = {}; jornalTimesUI(); });
}
// ---------- Festival de Unidades (RPC festival_unidades: proposta 20261103190000_festival_e_ensaio_trio.sql) ----------
var jornalFest = null;
function jornalFestHtml(){ return '<section class="jnbloco jntimes"><h4>🎤 ' + escHtml(tr('Festival de Unidades')) + ' <small id="jornalFestMus"></small></h4><div id="jornalFest"></div></section>'; }
function jornalFestUI(){
  var box = $('jornalFest'); if(!box) return;
  var mus = typeof hubMusicaSemana === 'function' ? hubMusicaSemana() : null, m = $('jornalFestMus'); if(m && mus) m.textContent = mus[1];
  if(jornalFest === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  var L = jornalFest && Array.isArray(jornalFest.times) ? jornalFest.times : [];
  if(!L.length){ box.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('O Festival de Unidades começa em breve!')) + '</p>'; return; }
  var max = Math.max.apply(null, L.map(function(t){ return +t.total || 0; }).concat([1]));
  box.innerHTML = '<p class="jndica">' + escHtml(tr('Cada membro canta sozinho a música da semana no Karaoke⭐Time!; a melhor nota de cada um soma para o seu Team.')) + '</p>' + L.map(function(t, i){
    var info = jornalTimeInfo(t.codigo), tot = +t.total || 0;
    return '<div class="jntime"><div class="jntimel"><b style="color:' + info.cor + '">' + (['🥇', '🥈', '🥉'][i] || (i + 1) + 'º') + ' ' + escHtml(info.nome) + '</b><small>' + jornalNum(tot) + ' ' + escHtml(tr('pts')) + '</small></div>' +
      '<div class="albumbarra jntimeb"><i style="width:' + Math.round(tot / max * 100) + '%;background:' + info.cor + '"></i></div>' +
      '<small class="jntimed">🎤 ' + (+t.cantaram || 0) + ' ' + escHtml(tr('cantaram')) + (t.destaque ? ' · 🌟 ' + escHtml(tr('Destaque')) + ': ' + escHtml(t.destaque) + ' (' + jornalNum(t.destaque_nota) + ')' : '') + '</small></div>';
  }).join('');
}
function jornalFestCarregar(){ jornalFest = null; jornalFestUI(); contaRpc('festival_unidades').then(function(d){ jornalFest = d || {}; jornalFestUI(); }).catch(function(){ jornalFest = {}; jornalFestUI(); }); }
// ---------- Ensaio de trio (RPC meu_trio_semana) ----------
var jornalTrio = null;
function jornalTrioHtml(){ return '<section class="jnbloco"><h4>🎭 ' + escHtml(tr('Ensaio de trio')) + '</h4><div id="jornalTrio"></div></section>'; }
function jornalTrioUI(){
  var box = $('jornalTrio'); if(!box) return;
  if(!contaJ){ box.innerHTML = '<p class="jnvazio">' + escHtml(tr('Entre na sua conta para ensaiar em trio.')) + '</p>'; return; }
  var d = jornalTrio;
  if(d === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  if(!d.ok){ box.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('O Ensaio de trio começa em breve!')) + '</p>'; return; }
  if(!d.aberto){ box.innerHTML = '<p class="jndica">' + escHtml(tr('Toda sexta você ganha um trio com outros Idols. Cada um faz a sua parte até domingo e o trio libera uma cena especial!')) + '</p><p class="jnvazio">📅 ' + escHtml(tr('Os trios saem na sexta.')) + '</p>'; return; }
  if(d.fora || !Array.isArray(d.membros)){ box.innerHTML = '<p class="jnvazio">' + escHtml(tr('Jogue durante a semana para entrar no trio da próxima sexta!')) + '</p>'; return; }
  var todos = d.membros.every(function(m){ return m.feito; });
  box.innerHTML = '<p class="jndica">' + escHtml(tr('Sua parte: terminar 1 corrida no Center⭐Run! ou 1 show no Karaoke⭐Time! até domingo.')) + '</p>' +
    '<ul class="trlista">' + d.membros.map(function(m){ return '<li class="tritem">' + (m.feito ? '✅' : '⏳') + ' <span><b>' + escHtml(m.nick) + '</b>' + (m.eu ? ' (' + escHtml(tr('você')) + ')' : '') + '</span></li>'; }).join('') + '</ul>' +
    (todos ? '<p class="faok">🎉 ' + escHtml(tr('Ensaio completo! A cena do trio está liberada.')) + '</p><button type="button" class="jnfotobtn" id="jnTrioCena" aria-label="' + escHtml(tr('Ampliar foto')) + '"><canvas width="480" height="300" aria-hidden="true"></canvas></button>' : '');
  var b = $('jnTrioCena'); if(b) jornalTrioDesenhar(b.querySelector('canvas'), false);
}
function jornalTrioDesenhar(cv, assinatura){   // a cena especial: o trio no palco, cada um numa pose
  var d = jornalTrio; if(!cv || !d || !Array.isArray(d.membros)) return;
  var f = { cena:['palco', '🎭', '', ['mic', 'banzai', 'luz']], grupo:d.membros.map(function(m){ return { nick:m.nick, avatar:m.avatar || { c:{} } }; }) };
  jornalFotoDesenhar(cv, f, assinatura);
}
function jornalTrioAmpliar(){
  var cv = document.createElement('canvas'); cv.width = 1440; cv.height = 900; jornalTrioDesenhar(cv, true);
  var u = cv.toDataURL('image/png'); $('shimg').src = u; $('shimg').alt = tr('Ensaio de trio'); $('shdl').href = u; $('shdl').download = 'ensaio-de-trio.png';
  if(typeof petPhShow === 'function') petPhShow(false); $('shr').hidden = false;
}
function jornalTrioCarregar(){
  jornalTrio = null; jornalTrioUI(); if(!contaJ) return;
  contaRpc('meu_trio_semana').then(function(d){ jornalTrio = d || { ok:false }; jornalTrioUI(); }).catch(function(){ jornalTrio = { ok:false }; jornalTrioUI(); });
}
