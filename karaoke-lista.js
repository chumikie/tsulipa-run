/* TsuLiPa⭐World — sala do Karaoke⭐Time! como tela de "escolher música" (inspirada na MUSIC LIST do Link! Like!).
   Só aparece dentro do site com o visual de celular ligado. Não cria regra nova: a grade lê as trilhas do
   próprio seletor (#ktSong), escolher uma capa troca o seletor, "Ouvir" usa a prévia que já existe e "Cantar"
   aperta o mesmo botão de sempre (#ktStart). Tentativas, recordes e prêmios continuam no motor do karaoke. */
(function(root){
  'use strict';
  function ligada(){
    if(!document.documentElement.classList.contains('kt-no-site')) return false;
    try{ return !!(root.parent && root.parent !== root && root.parent.TW_CELULAR_LIGADO); }catch(e){ return false; }
  }
  var TX = {
    pt:{destaques:'Destaques',todas:'Todas',album:'TsuLiPa ao vivo',preparo:'Faixas em preparação',zipper:'Foi com Zipper que Tsu, Lirika e Pati ensaiaram juntos pela primeira vez.',musicas:'MÚSICAS', semana:'Música da semana', ouvir:'Ouvir', cantar:'Cantar', shows:'Shows de hoje', escolha:'Escolha uma música'},
    en:{destaques:'Featured',todas:'All',album:'TsuLiPa Live',preparo:'Tracks in preparation',zipper:'Zipper was the first song Tsu, Lirika and Pati rehearsed together.',musicas:'SONGS', semana:'Song of the week', ouvir:'Listen', cantar:'Sing', shows:"Today's shows", escolha:'Pick a song'},
    es:{destaques:'Destacadas',todas:'Todas',album:'TsuLiPa en vivo',preparo:'Canciones en preparación',zipper:'Zipper fue la primera canción que Tsu, Lirika y Pati ensayaron juntos.',musicas:'CANCIONES', semana:'Canción de la semana', ouvir:'Escuchar', cantar:'Cantar', shows:'Shows de hoy', escolha:'Elige una canción'},
    id:{destaques:'Pilihan',todas:'Semua',album:'TsuLiPa Live',preparo:'Lagu dalam persiapan',zipper:'Zipper adalah lagu pertama yang dilatih bersama oleh Tsu, Lirika, dan Pati.',musicas:'LAGU', semana:'Lagu minggu ini', ouvir:'Dengar', cantar:'Nyanyi', shows:'Pertunjukan hari ini', escolha:'Pilih lagu'},
    th:{destaques:'เพลงเด่น',todas:'ทั้งหมด',album:'TsuLiPa ไลฟ์',preparo:'เพลงที่กำลังเตรียม',zipper:'Zipper คือเพลงแรกที่ Tsu, Lirika และ Pati ซ้อมด้วยกัน',musicas:'เพลง', semana:'เพลงประจำสัปดาห์', ouvir:'ฟัง', cantar:'ร้อง', shows:'โชว์วันนี้', escolha:'เลือกเพลง'},
    ja:{destaques:'ピックアップ',todas:'すべて',album:'TsuLiPa ライブ',preparo:'準備中の曲',zipper:'Tsu、Lirika、Pati が初めて一緒に練習した曲は Zipper です。',musicas:'MUSIC LIST', semana:'今週の曲', ouvir:'きく', cantar:'うたう', shows:'きょうのショー', escolha:'曲をえらんでね'}
  };
  function idioma(){ var l = ''; try{ l = new URLSearchParams(location.search).get('lang') || localStorage.getItem('brs48cr_lang') || ''; }catch(e){} return l; }   // igual ao Karaoke (LANG fica dentro do script dele)
  function t(k){ var l = TX[idioma()] ? idioma() : 'pt'; return TX[l][k]; }
  function $(id){ return document.getElementById(id); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); }
  // capa desenhada pelo jogo: cada trilha tem o seu degradê (nada de imagem de fora)
  var CAPA = {normal:['#ffd36e','#ff9bd0'], fast:['#ff9bd0','#b04fe0'], chill:['#8cc8ff','#b69bff'], tema:['#ff9bd0','#7b3ff0'],
              corrida:['#b69bff','#4169e1'], gacha:['#ffd36e','#ff6f91'], duo:['#2d1b5e','#7b3ff0']};
  function capaEstilo(k){ var c = CAPA[k] || ['#c9b3ff','#7b3ff0']; return 'background:linear-gradient(150deg,' + c[0] + ',' + c[1] + ')'; }
  function trilhas(){
    var sel = $('ktSong'); if(!sel) return [];
    return [].slice.call(sel.options).map(function(o){
      var partes = o.textContent.split('·').map(function(x){ return x.trim(); }), nome = partes[0] || o.value, emo = '';
      var m = /^(\S+)\s+(.*)$/.exec(nome); if(m && !/[A-Za-z0-9]/.test(m[1])){ emo = m[1]; nome = m[2]; }
      return {k:o.value, emo:emo || '♪', nome:nome, bpm:partes[1] || '', estrelas:partes[2] || ''};
    });
  }
  function semana(){ try{ return root.KaraokeRoomViews ? root.KaraokeRoomViews.songFor(Date.now()) : ''; }catch(e){ return ''; } }
  function recorde(k){ var b = document.querySelector('[data-kt-song-best="' + k + '"]'); return b ? b.textContent.trim() : ''; }
  var box = null, todas = false;
  var trio = [
    {k:'zipper', nome:'Zipper'},
    {k:'hitonatsu', nome:'Hitonatsu no Dekigoto'},
    {k:'staywithme', nome:'STAY WITH ME ~Mayonaka no Door~'}
  ];
  function destaques(lista, semanal, atual){
    var ordem = [semanal].concat(trio.map(function(x){return x.k;}), [atual,'normal','fast','chill']);
    var porChave = new Map(lista.map(function(x){return [x.k,x];}));
    return Array.from(new Set(ordem)).filter(function(k){return porChave.has(k);})
      .slice(0,4).map(function(k){return porChave.get(k);});
  }
  function colecao(lista, aberta){
    var pendentes = trio.filter(function(m){return !lista.some(function(x){return x.k === m.k;});});
    if(!pendentes.length) return '';
    return '<details class="ktl-album"' + (aberta?' open':'') + '><summary>' + esc(t('album')) + ' · ' + esc(t('preparo')) +
      '</summary><p translate="no">Tsu · Lirika · Pati</p><ul>' +
      pendentes.map(function(m){return '<li translate="no">'+esc(m.nome)+'</li>';}).join('') +
      '</ul><p>'+esc(t('zipper'))+'</p></details>';
  }
  function desenhar(){
    if(!box) return;
    var sel = $('ktSong'), atual = sel ? sel.value : '', sem = semana(), lista = trilhas(), a = lista.filter(function(x){ return x.k === atual; })[0] || lista[0];
    var bloqueado = !!(sel && sel.disabled), cont = $('ktLimitCount'), pips = $('ktLimitPips');
    var rec = $('ktSongRecord');
    // só refaz quando algo que aparece mudou (o motor do karaoke mexe nesses textos o tempo todo)
    var assinatura = [todas, atual, sem, bloqueado, cont && cont.textContent, pips && pips.textContent, rec && rec.textContent, lista.length, idioma()].join('|');
    if(assinatura === box.getAttribute('data-k')) return; box.setAttribute('data-k', assinatura);
    var visiveis = todas ? lista : destaques(lista, sem, atual);
    var album = box.querySelector('.ktl-album');
    box.innerHTML =
      '<div class="ktl-cab"><h2 class="ktl-aba">' + esc(t('musicas')) + '</h2>' +
        '<span class="ktl-pt"><b>' + esc(t('shows')) + '</b><span>' + esc(cont ? cont.textContent : '') + '</span><i aria-hidden="true">' + esc(pips ? pips.textContent : '') + '</i></span></div>' +
      '<div class="ktl-filtros"><button type="button" data-ktl-filtro="destaques" aria-pressed="'+!todas+'">'+esc(t('destaques'))+'</button>' +
      '<button type="button" data-ktl-filtro="todas" aria-pressed="'+todas+'">'+esc(t('todas'))+' ('+lista.length+')</button></div>' +
      '<div class="ktl-grade" role="listbox" aria-label="' + esc(t('escolha')) + '">' + visiveis.map(function(x){
        return '<button type="button" class="ktl-capa" role="option" data-ktl="' + esc(x.k) + '" aria-selected="' + (x.k === atual) + '"' + (bloqueado ? ' disabled' : '') + '>' +
          '<span class="ktl-arte" style="' + capaEstilo(x.k) + '" aria-hidden="true"><i>' + esc(x.emo) + '</i>' + (x.k === sem ? '<em>★ ' + esc(t('semana')) + '</em>' : '') + '</span>' +
          '<span class="ktl-nome" translate="no">' + esc(x.nome) + '</span><small>' + esc(x.estrelas) + '</small></button>';
      }).join('') + '</div>' +
      (a ? '<div class="ktl-detalhe"><span class="ktl-arte ktl-arte-g" style="' + capaEstilo(a.k) + '" aria-hidden="true"><i>' + esc(a.emo) + '</i></span>' +
        '<div class="ktl-info">' + (a.k === sem ? '<em class="ktl-sem">★ ' + esc(t('semana')) + '</em>' : '') +
          '<h3 translate="no">' + esc(a.nome) + '</h3>' +
          (trio.some(function(m){return m.k===a.k;}) ? '<p>'+esc(t('album'))+' · Tsu, Lirika &amp; Pati</p>' : '') +
          (a.k==='zipper' ? '<p>'+esc(t('zipper'))+'</p>' : '') + '<p>' + esc([a.bpm, a.estrelas].filter(Boolean).join(' · ')) + '</p>' +
          '<p class="ktl-rec">' + esc(rec ? rec.textContent.replace(/\s*·\s*⭐.*$/, '') : recorde(a.k)) + '</p></div>' +
        '<div class="ktl-acoes"><button type="button" class="ktl-ouvir" data-ktl-ouvir="' + esc(a.k) + '">▶ ' + esc(t('ouvir')) + '</button>' +
          '<button type="button" class="ktl-cantar" data-ktl-cantar="1"' + (bloqueado ? ' disabled' : '') + '>🎤 ' + esc(t('cantar')) + '</button></div></div>' : '') + colecao(lista, album && album.open);
  }
  function clique(e){
    var b = e.target.closest && e.target.closest('button'); if(!b || !box.contains(b) || b.disabled) return;
    var sel = $('ktSong');
    if(b.dataset.ktlFiltro){
      todas = b.dataset.ktlFiltro === 'todas';
      desenhar();
      box.querySelector('[data-ktl-filtro="'+b.dataset.ktlFiltro+'"]').focus({preventScroll:true});
      return;
    }
    if(b.dataset.ktl && sel && !sel.disabled){
      try{ if(root.kt && root.kt.stopPreview) root.kt.stopPreview(true); }catch(_){}
      sel.value = b.dataset.ktl; sel.dispatchEvent(new Event('change', {bubbles:true})); desenhar(); var nova = box.querySelector('[data-ktl="' + b.dataset.ktl + '"]'); if(nova) try{ nova.focus({preventScroll:true}); }catch(_){} return;
    }
    if(b.dataset.ktlOuvir){ var p = document.querySelector('[data-kt-song-preview="' + b.dataset.ktlOuvir + '"]'); if(p) p.click(); else if(root.kt && root.kt.togglePreview) root.kt.togglePreview(b.dataset.ktlOuvir); return; }
    if(b.dataset.ktlCantar){ var s = $('ktStart'); if(s && !s.disabled) s.click(); }
  }
  // A lista fica logo abaixo da sala (o "palco" compacto), em qualquer tamanho de tela.
  function posicionar(){
    var alvo = $('krPalco');
    if(alvo && alvo.nextSibling !== box) alvo.parentNode.insertBefore(box, alvo.nextSibling);
  }
  function montar(){
    if(box || !ligada()) return;
    if(!$('krPalco')) return;
    document.documentElement.classList.add('kt-lista');
    box = document.createElement('section'); box.id = 'ktLista'; box.className = 'ktl'; box.setAttribute('aria-label', t('escolha'));
    posicionar();

    box.addEventListener('click', clique);
    var sel = $('ktSong'); if(sel) sel.addEventListener('change', desenhar);
    // recorde, tentativas e "show em andamento" mudam pelo motor do karaoke: a lista acompanha
    var ob = new MutationObserver(function(){ requestAnimationFrame(desenhar); });
    ['ktSongRecord', 'ktLimitCount', 'ktStart'].forEach(function(id){ var el = $(id); if(el) ob.observe(el, {childList:true, characterData:true, subtree:true, attributes:true, attributeFilter:['disabled']}); });
    if(sel) ob.observe(sel, {attributes:true, attributeFilter:['disabled']});
    desenhar();
  }
  if(document.readyState !== 'loading') setTimeout(montar, 0); else document.addEventListener('DOMContentLoaded', function(){ setTimeout(montar, 0); });
  root.KaraokeLista = {montar:montar, txt:TX};
})(typeof window !== 'undefined' ? window : globalThis);
