/* TsuLiPa⭐World · "Esta semana" (20/11/2026)
   Um cartão no Início (no computador, ocupa a coluna da direita embaixo do "Hoje") com o que acontece na semana:
   • Show de sábado — termine uma música no Karaoke⭐Time! no sábado: ★20 e um lugar na plateia (show_sabado_*).
   • Festa no mapa — na 1ª semana de cada tema da temporada o mapa ganha bandeirinhas e quem passa por lá
     guarda de graça o cenário do camarim daquele tema (festa_estado / festa_resgatar).
   • Jogo da semana — o jogo menos jogado na semana anterior; a missão do dia dele vale ★5 a mais (jogo_da_semana).
   • Visitante — lembrete de que dá para jogar sem conta e guardar tudo depois com o Google.
   Também mostra, no fim do Center⭐Run! de quem joga sem conta, o convite para guardar as estrelas.
   Tudo o que dá estrela é conferido no servidor; aqui só se lê e se mostra. */
(function(){
  'use strict';
  var TX = {
    tit:{pt:'Esta semana',en:'This week',es:'Esta semana',id:'Minggu ini',th:'สัปดาห์นี้',ja:'今週'},
    show:{pt:'Show de sábado',en:'Saturday show',es:'Show del sábado',id:'Pertunjukan Sabtu',th:'โชว์วันเสาร์',ja:'土曜ライブ'},
    showHoje:{pt:'É hoje! Termine uma música no Karaoke⭐Time! e ganhe ★{p} + lugar na plateia.',en:"It's today! Finish a song in Karaoke⭐Time! for ★{p} and a seat in the audience.",es:'¡Es hoy! Termina una canción en Karaoke⭐Time! y gana ★{p} + un lugar en el público.',id:'Hari ini! Selesaikan satu lagu di Karaoke⭐Time! dan dapat ★{p} + kursi penonton.',th:'วันนี้แหละ! ร้องจบหนึ่งเพลงใน Karaoke⭐Time! รับ ★{p} และที่นั่งผู้ชม',ja:'今日だよ！Karaoke⭐Time!で1曲歌いきって★{p}と客席をゲット。'},
    showProx:{pt:'Sábado, {d}: termine uma música no Karaoke⭐Time! e ganhe ★{p}.',en:'Saturday, {d}: finish a song in Karaoke⭐Time! for ★{p}.',es:'Sábado, {d}: termina una canción en Karaoke⭐Time! y gana ★{p}.',id:'Sabtu, {d}: selesaikan satu lagu di Karaoke⭐Time! untuk ★{p}.',th:'วันเสาร์ {d}: ร้องจบหนึ่งเพลงใน Karaoke⭐Time! รับ ★{p}',ja:'{d}（土）：Karaoke⭐Time!で1曲歌いきって★{p}。'},
    showFui:{pt:'Você está na plateia deste sábado ✓',en:"You're in this Saturday's audience ✓",es:'Estás en el público de este sábado ✓',id:'Kamu ada di penonton Sabtu ini ✓',th:'คุณอยู่ในกลุ่มผู้ชมเสาร์นี้แล้ว ✓',ja:'今週の客席にいます ✓'},
    plateia:{pt:'Plateia de {d}',en:'Audience on {d}',es:'Público del {d}',id:'Penonton {d}',th:'ผู้ชมวันที่ {d}',ja:'{d}の客席'},
    plateiaVazia:{pt:'A plateia ainda está vazia. Seja a primeira pessoa!',en:'The audience is still empty. Be the first!',es:'El público aún está vacío. ¡Sé la primera persona!',id:'Penonton masih kosong. Jadilah yang pertama!',th:'ยังไม่มีผู้ชมเลย เป็นคนแรกกันเถอะ!',ja:'客席はまだ空いてるよ。一番乗りしよう！'},
    cantar:{pt:'Cantar',en:'Sing',es:'Cantar',id:'Nyanyi',th:'ร้องเพลง',ja:'歌う'},
    pegar:{pt:'Pegar ★{p}',en:'Get ★{p}',es:'Tomar ★{p}',id:'Ambil ★{p}',th:'รับ ★{p}',ja:'★{p}をもらう'},
    cantarAntes:{pt:'Termine uma música no Karaoke⭐Time! hoje e volte aqui.',en:'Finish a song in Karaoke⭐Time! today and come back.',es:'Termina una canción en Karaoke⭐Time! hoy y vuelve aquí.',id:'Selesaikan satu lagu di Karaoke⭐Time! hari ini lalu kembali.',th:'ร้องจบหนึ่งเพลงใน Karaoke⭐Time! วันนี้แล้วกลับมา',ja:'今日Karaoke⭐Time!で1曲歌いきってから戻ってね。'},
    ganhou:{pt:'Você entrou na plateia! +★{p}',en:'You joined the audience! +★{p}',es:'¡Entraste al público! +★{p}',id:'Kamu masuk penonton! +★{p}',th:'เข้าร่วมกลุ่มผู้ชมแล้ว! +★{p}',ja:'客席に入ったよ！+★{p}'},
    festa:{pt:'Festa de {t} no mapa',en:'{t} party on the map',es:'Fiesta de {t} en el mapa',id:'Pesta {t} di peta',th:'ปาร์ตี้ {t} บนแผนที่',ja:'マップで{t}パーティー'},
    festaTxt:{pt:'Até {d}. Passe pelo mapa e guarde de graça o cenário do camarim do tema.',en:'Until {d}. Visit the map and keep the theme dressing-room scenery for free.',es:'Hasta el {d}. Pasa por el mapa y guarda gratis el escenario del camerino del tema.',id:'Sampai {d}. Mampir ke peta dan simpan gratis latar ruang ganti tema ini.',th:'ถึง {d} แวะแผนที่แล้วเก็บฉากห้องแต่งตัวธีมนี้ฟรี',ja:'{d}まで。マップに寄って、テーマの楽屋背景を無料でゲット。'},
    festaOk:{pt:'Lembrança guardada no camarim ✓',en:'Keepsake saved in the dressing room ✓',es:'Recuerdo guardado en el camerino ✓',id:'Kenang-kenangan tersimpan di ruang ganti ✓',th:'เก็บของที่ระลึกไว้ในห้องแต่งตัวแล้ว ✓',ja:'楽屋に記念品を保存しました ✓'},
    festaProx:{pt:'Próxima festa no mapa: {t} · {d}',en:'Next party on the map: {t} · {d}',es:'Próxima fiesta en el mapa: {t} · {d}',id:'Pesta berikutnya di peta: {t} · {d}',th:'ปาร์ตี้ถัดไปบนแผนที่: {t} · {d}',ja:'次のマップパーティー：{t}・{d}'},
    irMapa:{pt:'Ir ao mapa',en:'Go to map',es:'Ir al mapa',id:'Ke peta',th:'ไปแผนที่',ja:'マップへ'},
    guardar:{pt:'Guardar lembrança',en:'Keep keepsake',es:'Guardar recuerdo',id:'Simpan kenangan',th:'เก็บของที่ระลึก',ja:'記念品をもらう'},
    festaMapa:{pt:'Festa de {t}! Guarde a lembrança da festa.',en:'{t} party! Keep the party keepsake.',es:'¡Fiesta de {t}! Guarda el recuerdo.',id:'Pesta {t}! Simpan kenang-kenangannya.',th:'ปาร์ตี้ {t}! เก็บของที่ระลึกไว้นะ',ja:'{t}パーティー！記念品をもらおう。'},
    jogo:{pt:'Jogo da semana',en:'Game of the week',es:'Juego de la semana',id:'Game minggu ini',th:'เกมประจำสัปดาห์',ja:'今週のゲーム'},
    jogoTxt:{pt:'{j}: a missão do dia dele vale ★{b} a mais.',en:'{j}: its daily mission is worth ★{b} more.',es:'{j}: su misión del día vale ★{b} más.',id:'{j}: misi hariannya bernilai ★{b} lebih.',th:'{j}: ภารกิจประจำวันได้เพิ่ม ★{b}',ja:'{j}：デイリーミッションが★{b}アップ。'},
    jogar:{pt:'Jogar',en:'Play',es:'Jugar',id:'Main',th:'เล่น',ja:'あそぶ'},
    visit:{pt:'Jogando sem conta',en:'Playing without an account',es:'Jugando sin cuenta',id:'Main tanpa akun',th:'เล่นโดยไม่มีบัญชี',ja:'アカウントなしでプレイ中'},
    visitTxt:{pt:'Suas estrelas ficam só neste aparelho. Entre com Google para guardar até ★1.000 na nuvem e aparecer no ranking.',en:'Your stars stay on this device only. Sign in with Google to keep up to ★1,000 in the cloud and join the ranking.',es:'Tus estrellas quedan solo en este dispositivo. Entra con Google para guardar hasta ★1.000 en la nube y aparecer en el ranking.',id:'Bintangmu hanya tersimpan di perangkat ini. Masuk dengan Google untuk menyimpan hingga ★1.000 di cloud dan masuk peringkat.',th:'ดาวของคุณอยู่แค่ในเครื่องนี้ เข้าสู่ระบบด้วย Google เพื่อเก็บได้ถึง ★1,000 บนคลาวด์และติดอันดับ',ja:'スターはこの端末だけに保存されています。Googleでログインすると★1,000までクラウドに保存でき、ランキングにも載ります。'},
    visitFim:{pt:'Você tem ★{n} neste aparelho. Entre com Google para guardar na nuvem (até ★1.000) e entrar no ranking.',en:'You have ★{n} on this device. Sign in with Google to keep them in the cloud (up to ★1,000) and join the ranking.',es:'Tienes ★{n} en este dispositivo. Entra con Google para guardarlas en la nube (hasta ★1.000) y entrar al ranking.',id:'Kamu punya ★{n} di perangkat ini. Masuk dengan Google untuk menyimpannya di cloud (hingga ★1.000) dan masuk peringkat.',th:'คุณมี ★{n} ในเครื่องนี้ เข้าสู่ระบบด้วย Google เพื่อเก็บบนคลาวด์ (สูงสุด ★1,000) และติดอันดับ',ja:'この端末に★{n}あります。Googleでログインするとクラウドに保存（★1,000まで）してランキングに参加できます。'},
    entrar:{pt:'Entrar com Google',en:'Sign in with Google',es:'Entrar con Google',id:'Masuk dengan Google',th:'เข้าสู่ระบบด้วย Google',ja:'Googleでログイン'},
    login:{pt:'Entre com Google para guardar.',en:'Sign in with Google to keep it.',es:'Entra con Google para guardarlo.',id:'Masuk dengan Google untuk menyimpan.',th:'เข้าสู่ระบบด้วย Google เพื่อเก็บ',ja:'保存するにはGoogleでログイン。'},
    erro:{pt:'Não deu agora. Tente de novo daqui a pouco.',en:"Couldn't do it now. Try again soon.",es:'No se pudo ahora. Inténtalo en un rato.',id:'Belum bisa sekarang. Coba lagi nanti.',th:'ตอนนี้ยังทำไม่ได้ ลองใหม่อีกครั้งนะ',ja:'今はできませんでした。少ししてからもう一度。'}
  };
  var JOGOS = {karaoke:['karaoke','Karaoke⭐Time!'], sora:['sora','Sora⭐Jump!'], cafe:['cafe','Happy⭐Cafe!'], handshake:['handshake','Handshake⭐Event!'], jardim:['bloom','Bloom⭐Garden!'], battle:['battle','Idol⭐Battle!']};
  function L(){ return typeof LANG === 'string' && TX.tit[LANG] ? LANG : 'pt'; }
  function t(k, v){ var s = (TX[k] && (TX[k][L()] || TX[k].pt)) || k; if(v) Object.keys(v).forEach(function(n){ s = s.split('{' + n + '}').join(v[n]); }); return s; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem_rpc')); }
  function dm(iso){ var p = String(iso || '').split('-'); return p.length === 3 ? p[2] + '/' + p[1] : ''; }
  function temaNome(k, semEmoji){ var I = typeof TEMA_INFO !== 'undefined' ? TEMA_INFO[k] : null; if(!I) return k; var n = I[1]; try{ n = typeof tr === 'function' ? tr(n) : n; }catch(e){} return semEmoji ? n : I[0] + ' ' + n; }
  function temaEmoji(k){ var I = typeof TEMA_INFO !== 'undefined' ? TEMA_INFO[k] : null; return I ? I[0] : '🎉'; }
  function aviso(txt){ try{ if(typeof toast === 'function') return toast(txt); }catch(e){} try{ if(window.TW_CELULAR && TW_CELULAR.toast) return TW_CELULAR.toast(txt); }catch(e){}
    var d = document.createElement('div'); d.className = 'tws-aviso'; d.setAttribute('role', 'status'); d.textContent = txt; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 3200); }

  var S = {show:null, festa:null, jogo:null, em:0, dono:'', pedindo:false};
  function redesenhar(){ try{ window.dispatchEvent(new Event('tw-semana')); }catch(e){} }
  function carregar(forcar){
    var dono = logado() ? String(contaJ.nick || '').toLowerCase() : '';
    if(S.pedindo || (!forcar && dono === S.dono && Date.now() - S.em < 5 * 60e3)) return;
    S.pedindo = true; S.dono = dono;
    Promise.all([
      rpc('show_sabado_estado').catch(function(){ return null; }),
      rpc('festa_estado').catch(function(){ return null; }),
      rpc('jogo_da_semana').catch(function(){ return null; })
    ]).then(function(r){
      S.show = r[0]; S.festa = r[1]; S.jogo = r[2]; S.em = Date.now(); S.pedindo = false;
      try{ if(S.festa && S.festa.ativa) document.body.setAttribute('data-tw-festa', S.festa.tema); else document.body.removeAttribute('data-tw-festa'); }catch(e){}
      redesenhar();
    });
  }

  function item(cor, emo, tit, txt, botoes, extra, cls){
    return '<div class="twc-hj-it tws-it' + (cls ? ' ' + cls : '') + '"><span class="twc-hj-ico twc-g-' + cor + ' tws-emo" aria-hidden="true">' + emo + '</span>' +
      '<span class="twc-hj-txt"><b>' + tit + '</b>' + (txt ? '<small>' + txt + '</small>' : '') + (extra || '') + '</span>' + (botoes || '') + '</div>';
  }
  function bt(attrs, txt, claro){ return '<button type="button" class="twc-hj-bt' + (claro ? ' twc-hj-bt-claro' : '') + '" ' + attrs + '>' + esc(txt) + '</button>'; }

  function html(){
    carregar(false);
    var h = [], s = S.show, f = S.festa, j = S.jogo;
    if(s){
      var txt = s.eu ? t('showFui') : s.hoje_sabado ? t('showHoje', {p:s.premio}) : t('showProx', {d:dm(s.sabado), p:s.premio});
      var nomes = (s.plateia || []).map(function(p){ return '<span class="tws-chip" translate="no">' + esc(p.nick) + '</span>'; }).join('');
      var mais = s.total > (s.plateia || []).length ? '<span class="tws-chip tws-chip-mais">+' + (s.total - s.plateia.length) + '</span>' : '';
      var plateia = '<small class="tws-plateia"><em>' + esc(t('plateia', {d:dm(s.plateia_de)})) + '</em>' + (nomes ? nomes + mais : esc(t('plateiaVazia'))) + '</small>';
      var bots = s.hoje_sabado && logado() && !s.eu ? '<span class="twc-hj-bts">' + bt('data-ir="karaoke"', t('cantar')) + bt('data-semana="show"', t('pegar', {p:s.premio}), true) + '</span>' : (s.eu ? '' : bt('data-ir="karaoke"', t('cantar')));
      h.push(item('rosa', '🎤', esc(t('show')), esc(txt), bots, plateia));
    }
    if(f){
      if(f.ativa){
        var tn = temaNome(f.tema);
        h.push(item('sol', temaEmoji(f.tema), esc(t('festa', {t:temaNome(f.tema, true)})), esc(f.guardou ? t('festaOk') : t('festaTxt', {d:dm(f.fim)})),
          f.guardou ? bt('data-a="mapa"', t('irMapa'), true) : '<span class="twc-hj-bts">' + bt('data-semana="festa"', t('guardar')) + bt('data-a="mapa"', t('irMapa'), true) + '</span>'));
      } else if(f.proxima){
        h.push(item('sol', temaEmoji(f.proxima.tema), esc(t('festaProx', {t:temaNome(f.proxima.tema, true), d:dm(f.proxima.inicio)})), '', ''));
      }
    }
    if(j && JOGOS[j.k]){
      var g = JOGOS[j.k];
      h.push(item('lima', '🌟', esc(t('jogo')), esc(t('jogoTxt', {j:g[1], b:j.bonus || 5})), bt('data-ir="' + g[0] + '"', t('jogar'))));
    }
    if(!logado()) h.push(item('uva', '☁️', esc(t('visit')), esc(t('visitTxt')), bt('data-semana="entrar"', t('entrar')), '', 'tws-visit'));
    if(!h.length) return '';
    return '<section class="twc-hj tws" aria-labelledby="twsT"><div class="twc-hj-cab"><h2 id="twsT">' + esc(t('tit')) + '</h2></div>' + h.join('') + '</section>';
  }
  // faixa de bandeirinhas e convite dentro do Mapa durante a festa
  function mapaHtml(){
    carregar(false);
    var f = S.festa; if(!f || !f.ativa) return '';
    var I = typeof TEMA_INFO !== 'undefined' ? TEMA_INFO[f.tema] : null, cores = I && I[6] ? I[6] : ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b'];
    var bandeiras = ''; for(var i = 0; i < 18; i++) bandeiras += '<i style="--c:' + cores[i % cores.length] + '"></i>';
    return '<div class="tws-festa" role="note"><div class="tws-band" aria-hidden="true">' + bandeiras + '</div><p><span aria-hidden="true">' + temaEmoji(f.tema) + '</span> ' +
      esc(f.guardou ? t('festaOk') : t('festaMapa', {t:temaNome(f.tema, true)})) + (f.guardou ? '' : ' ' + bt('data-semana="festa"', t('guardar'))) + '</p></div>';
  }

  function entrar(){ var b = document.getElementById('contaEntrar'); if(b && b.offsetParent !== null){ b.click(); return; } if(typeof contaEntrar === 'function') contaEntrar(); }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-semana]'); if(!b) return;
    var a = b.getAttribute('data-semana'); e.preventDefault(); e.stopPropagation();
    if(a === 'entrar'){ entrar(); return; }
    if(!logado()){ aviso(t('login')); entrar(); return; }
    b.disabled = true;
    if(a === 'show') rpc('show_sabado_marcar').then(function(r){
      if(r && r.ok){ aviso(t('ganhou', {p:r.premio})); if(typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(x){} if(typeof setBest === 'function') setBest(); } }
      else if(r && r.erro === 'cantar') aviso(t('cantarAntes'));
      else if(!(r && r.erro === 'feito')) aviso(t('erro'));
      carregar(true);
    }).catch(function(){ aviso(t('erro')); b.disabled = false; });
    if(a === 'festa') rpc('festa_resgatar').then(function(r){
      if(r && r.ok){ aviso(t('festaOk')); try{ if(Array.isArray(r.visuais) && typeof perfDono !== 'undefined') perfDono = r.visuais; if(typeof perfLojaSincronizar === 'function') perfLojaSincronizar(); if(typeof sfx !== 'undefined' && sfx.rank) sfx.rank(); }catch(x){} }
      else if(!(r && r.erro === 'feito')) aviso(t('erro'));
      carregar(true);
    }).catch(function(){ aviso(t('erro')); b.disabled = false; });
  }, true);

  // Fim do Center⭐Run! sem conta: convite para guardar as estrelas
  function visitanteFim(){
    var over = document.getElementById('over'); if(!over) return;
    var box = document.getElementById('twsVisitFim');
    if(over.hidden || logado()){ if(box) box.hidden = true; return; }
    var n = Math.max(0, Math.floor(+(typeof starT !== 'undefined' ? starT : 0) || 0));
    if(!box){ box = document.createElement('div'); box.id = 'twsVisitFim'; box.className = 'tws-visitfim';
      var res = document.getElementById('res'); if(res && res.parentNode) res.parentNode.insertBefore(box, res.nextSibling); else over.querySelector('.panel').appendChild(box); }
    box.innerHTML = '<p>☁️ ' + esc(t('visitFim', {n:n.toLocaleString(L() === 'en' ? 'en-US' : 'pt-BR')})) + '</p><button type="button" class="btn alt" data-semana="entrar">' + esc(t('entrar')) + '</button>';
    box.hidden = false;
  }
  function observarFim(){
    var over = document.getElementById('over'); if(!over) return;
    try{ new MutationObserver(visitanteFim).observe(over, {attributes:true, attributeFilter:['hidden']}); }catch(e){}
  }

  window.TW_SEMANA = {
    html:html, mapaHtml:mapaHtml, carregar:carregar,
    depoisDoKaraoke:function(){   // Karaoke⭐Time! confirmado pelo servidor: no sábado, entra na plateia sozinho
      carregar(true);
      var d = new Date(Date.now() - 3 * 36e5); if(d.getUTCDay() !== 6 || !logado()) return;
      rpc('show_sabado_marcar').then(function(r){ if(r && r.ok){ aviso(t('ganhou', {p:r.premio})); if(typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(x){} if(typeof setBest === 'function') setBest(); } carregar(true); } }).catch(function(){});
    }
  };
  function iniciar(){ observarFim(); setTimeout(function(){ carregar(false); }, 1200); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
