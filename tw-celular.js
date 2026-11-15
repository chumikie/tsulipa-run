/* TsuLiPa⭐World · visual de celular (prévia, 15/11/2026).
   Ideia do amigo + esqueleto do Link! Like!: a tela de início vira um celular de Idol — barra de cima
   (você e as estrelas), barra de baixo (Voltar · Menu · Início), widgets do dia e um app por jogo.
   Só carrega com a prévia ligada (chave brs48cr_celular ou ?celular=1). Não cria regra nova:
   cada ícone chama o mesmo card do hub antigo, que continua montado por baixo (login, cadeados,
   sons e prêmios seguem iguais). Desligar a prévia volta tudo ao visual clássico. */
(function(){
  'use strict';
  var CHAVE = 'brs48cr_celular';
  var T = {
    pt:{vis:'Visitante', ini:'Início', menu:'Menu', voltar:'Voltar', jogos:'Jogos', todos:'Todos os jogos', hoje:'Pra hoje', emdia:'Tudo em dia por hoje!',
        mis:'Missões do dia', rank:'Ranking da semana', tv:'Ver na TV', mapa:'Mapa', mapaAgora:'Agora no mapa: {quem} · {rua}', mapaVazio:'Passeie pelo mapa da cidade',
        menuSub:'Tudo do TsuLiPa⭐World', jogosSub:'{n} jogos · escolha um', ajustes:'Ajustes', ajustesSub:'Idioma, tema e conta', classico:'Voltar ao visual clássico',
        loginT:'Entre para jogar', loginTxt:'Este jogo salva o seu progresso na sua conta. Entre com o Google para jogar.', agoraNao:'Agora não', entrar:'Entrar', sair:'Sair', sairOk:'Toque de novo para sair',
        album:'Álbum', busca:'Procurar Idol', nov:'Novidades', estrelas:'Ganhar estrelas', perfil:'Seu perfil', previa:'Visual novo (prévia)'},
    en:{vis:'Visitor', ini:'Home', menu:'Menu', voltar:'Back', jogos:'Games', todos:'All games', hoje:'For today', emdia:"You're all set for today!",
        mis:'Daily missions', rank:'Weekly ranking', tv:'Watch on TV', mapa:'Map', mapaAgora:'On the map now: {quem} · {rua}', mapaVazio:'Stroll around the city map',
        menuSub:'Everything in TsuLiPa⭐World', jogosSub:'{n} games · pick one', ajustes:'Settings', ajustesSub:'Language, theme and account', classico:'Back to the classic look',
        loginT:'Sign in to play', loginTxt:'This game saves your progress to your account. Sign in with Google to play.', agoraNao:'Not now', entrar:'Sign in', sair:'Sign out', sairOk:'Tap again to sign out',
        album:'Album', busca:'Find an Idol', nov:"What's new", estrelas:'Get stars', perfil:'Your profile', previa:'New look (preview)'},
    es:{vis:'Visitante', ini:'Inicio', menu:'Menú', voltar:'Volver', jogos:'Juegos', todos:'Todos los juegos', hoje:'Para hoy', emdia:'¡Todo listo por hoy!',
        mis:'Misiones del día', rank:'Ranking de la semana', tv:'Ver en la TV', mapa:'Mapa', mapaAgora:'Ahora en el mapa: {quem} · {rua}', mapaVazio:'Pasea por el mapa de la ciudad',
        menuSub:'Todo de TsuLiPa⭐World', jogosSub:'{n} juegos · elige uno', ajustes:'Ajustes', ajustesSub:'Idioma, tema y cuenta', classico:'Volver al estilo clásico',
        loginT:'Entra para jugar', loginTxt:'Este juego guarda tu progreso en tu cuenta. Entra con Google para jugar.', agoraNao:'Ahora no', entrar:'Entrar', sair:'Salir', sairOk:'Toca otra vez para salir',
        album:'Álbum', busca:'Buscar Idol', nov:'Novedades', estrelas:'Ganar estrellas', perfil:'Tu perfil', previa:'Estilo nuevo (vista previa)'},
    id:{vis:'Pengunjung', ini:'Beranda', menu:'Menu', voltar:'Kembali', jogos:'Game', todos:'Semua game', hoje:'Untuk hari ini', emdia:'Semua beres untuk hari ini!',
        mis:'Misi harian', rank:'Peringkat minggu ini', tv:'Tonton di TV', mapa:'Peta', mapaAgora:'Di peta sekarang: {quem} · {rua}', mapaVazio:'Jalan-jalan di peta kota',
        menuSub:'Semua isi TsuLiPa⭐World', jogosSub:'{n} game · pilih satu', ajustes:'Pengaturan', ajustesSub:'Bahasa, tema, dan akun', classico:'Kembali ke tampilan klasik',
        loginT:'Masuk untuk bermain', loginTxt:'Game ini menyimpan progresmu di akunmu. Masuk dengan Google untuk bermain.', agoraNao:'Nanti saja', entrar:'Masuk', sair:'Keluar', sairOk:'Ketuk lagi untuk keluar',
        album:'Album', busca:'Cari Idol', nov:'Yang baru', estrelas:'Dapatkan bintang', perfil:'Profilmu', previa:'Tampilan baru (pratinjau)'},
    th:{vis:'ผู้เยี่ยมชม', ini:'หน้าแรก', menu:'เมนู', voltar:'กลับ', jogos:'เกม', todos:'เกมทั้งหมด', hoje:'สำหรับวันนี้', emdia:'วันนี้ครบหมดแล้ว!',
        mis:'ภารกิจประจำวัน', rank:'อันดับประจำสัปดาห์', tv:'ดูทางทีวี', mapa:'แผนที่', mapaAgora:'ตอนนี้บนแผนที่: {quem} · {rua}', mapaVazio:'เดินเล่นในแผนที่เมือง',
        menuSub:'ทุกอย่างใน TsuLiPa⭐World', jogosSub:'{n} เกม · เลือกหนึ่งเกม', ajustes:'ตั้งค่า', ajustesSub:'ภาษา ธีม และบัญชี', classico:'กลับไปหน้าตาแบบเดิม',
        loginT:'เข้าสู่ระบบเพื่อเล่น', loginTxt:'เกมนี้บันทึกความคืบหน้าไว้ในบัญชีของคุณ เข้าสู่ระบบด้วย Google เพื่อเล่น', agoraNao:'ไว้ก่อน', entrar:'เข้าสู่ระบบ', sair:'ออกจากระบบ', sairOk:'แตะอีกครั้งเพื่อออก',
        album:'อัลบั้ม', busca:'ค้นหาไอดอล', nov:'มีอะไรใหม่', estrelas:'รับดาว', perfil:'โปรไฟล์ของคุณ', previa:'หน้าตาใหม่ (ทดลอง)'},
    ja:{vis:'ゲスト', ini:'ホーム', menu:'メニュー', voltar:'もどる', jogos:'ゲーム', todos:'すべてのゲーム', hoje:'きょうのおすすめ', emdia:'きょうはぜんぶ完了！',
        mis:'デイリーミッション', rank:'今週のランキング', tv:'テレビで見る', mapa:'マップ', mapaAgora:'いまマップに：{quem}・{rua}', mapaVazio:'街のマップをおさんぽしよう',
        menuSub:'TsuLiPa⭐Worldのすべて', jogosSub:'{n}本のゲーム・ひとつ選んでね', ajustes:'設定', ajustesSub:'言語・テーマ・アカウント', classico:'クラシック表示にもどす',
        loginT:'ログインして遊ぼう', loginTxt:'このゲームは進みぐあいをアカウントに保存します。Googleでログインして遊んでね。', agoraNao:'あとで', entrar:'ログイン', sair:'ログアウト', sairOk:'もう一度タップでログアウト',
        album:'アルバム', busca:'アイドルをさがす', nov:'おしらせ', estrelas:'スターをもらう', perfil:'あなたのプロフィール', previa:'新しい表示（お試し）'}
  };
  // artigo certo no português: o Tsu, a Lirika, o Pati
  var ARTIGO = {Tsu:'o', Lirika:'a', Pati:'o'};
  function L(){ return (typeof LANG === 'string' && T[LANG]) ? LANG : 'pt'; }
  function t(k){ return T[L()][k] || T.pt[k]; }
  function tt(s){ return typeof tr === 'function' ? tr(s) : s; }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(String(s)) : String(s).replace(/[&<>"']/g, function(c){ return '&#' + c.charCodeAt(0) + ';'; }); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function som(){ try{ if(typeof beep === 'function') beep(988, .05, 'triangle', .04); }catch(e){} }

  /* ---------- ícones (traço) e degradês de cada app ---------- */
  var P = {
    run:'<path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/>',
    karaoke:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><path d="M12 18v3"/>',
    sora:'<path d="M7 18h10a4 4 0 0 0 .5-8A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/>',
    duo:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    cafe:'<path d="M4 9h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M8 3v3M12 3v3"/>',
    handshake:'<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4"/><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V10"/><path d="M13 10V6a1.5 1.5 0 0 1 3 0v6"/><path d="M7 11a5 5 0 0 0 9 4l2-4a1.5 1.5 0 0 0-2.6-1.4L16 12"/>',
    bloom:'<circle cx="12" cy="8" r="3"/><path d="M12 11v10"/><path d="M12 16c-3 0-5-2-5-4 2 0 5 1 5 4zM12 18c3 0 5-2 5-4-2 0-5 1-5 4z"/>',
    studio:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
    battle:'<path d="M12 2v6"/><rect x="10" y="8" width="4" height="13" rx="2"/><path d="M8 4l2 2M16 4l-2 2"/>',
    pet:'<circle cx="7" cy="9" r="1.8"/><circle cx="11" cy="6" r="1.8"/><circle cx="15" cy="6.5" r="1.8"/><circle cx="18" cy="10" r="1.8"/><path d="M8 17c0-3 2-5 4.5-5s4.5 2 4.5 4.5S15 20 12.5 19 8 20 8 17z"/>',
    gacha:'<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M3 9h18V6H3z"/><path d="M12 6v14"/><path d="M12 6c-2-3-6-3-5 0M12 6c2-3 6-3 5 0"/>',
    loja:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8a3 3 0 0 1 6 0"/>',
    perfil:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    mapa:'<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    news:'<rect x="4" y="4" width="13" height="16" rx="1"/><path d="M17 8h3v10a2 2 0 0 1-2 2"/><path d="M7 8h7M7 12h7M7 16h4"/>',
    album:'<rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 3v18"/><path d="M12 8h4M12 12h4"/>',
    missoes:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r=".6"/>',
    tv:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 3l4 3 4-3M8 21h8"/>',
    busca:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
    nov:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    ajustes:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
    todos:'<rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/>',
    trofeu:'<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4"/><path d="M12 13v4M8 21h8"/>',
    check:'<path d="M5 12l4 4 10-10"/>', seta:'<path d="M9 6l6 6-6 6"/>', mais:'<path d="M12 6v12M6 12h12"/>',
    voltar:'<path d="M9 7L4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-2"/>', menu:'<path d="M5 8h14M5 12h14M5 16h14"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
    casa:'<path d="M4 11l8-7 8 7"/><path d="M6 10v10h12V10"/><path d="M10 20v-5h4v5"/>', cadeado:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    estrela:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>'
  };
  function ico(k, tam){ return '<svg class="twc-ico" width="' + (tam || 28) + '" height="' + (tam || 28) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[k] || P.estrela) + '</svg>'; }
  var COR = {run:'roxo', karaoke:'rosa', sora:'azul', duo:'noite', cafe:'cafe', handshake:'rosa2', bloom:'verde', studio:'ceu', battle:'uva', pet:'uva', gacha:'rosa',
             loja:'verde', perfil:'roxo', mapa:'ceu', news:'noite', album:'azul', todos:'lima', tv:'roxo'};
  // brilhinhos (posições fixas, decorativos)
  var BRILHO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5c.7 5.4 2.6 7.6 9 9-6.4 1.4-8.3 3.6-9 9-.7-5.4-2.6-7.6-9-9 6.4-1.4 8.3-3.6 9-9z"/></svg>';
  function brilhos(lista){ return lista.map(function(b, i){ return '<i class="twc-brilho twc-b' + (b[3] || 'w') + '" style="left:' + b[0] + '%;top:' + b[1] + '%;width:' + b[2] + 'px;height:' + b[2] + 'px;animation-delay:' + (i * .55).toFixed(2) + 's" aria-hidden="true">' + BRILHO + '</i>'; }).join(''); }

  /* ---------- ligação com o hub antigo ---------- */
  function $id(id){ return document.getElementById(id); }
  function card(k){ var c = $id('hubCards'); return c && (c.querySelector('[data-ir="' + k + '"]') || c.querySelector('[data-twnovo="' + k + '"]')); }
  function chaveDe(c){ return c.getAttribute('data-ir') || c.getAttribute('data-twnovo') || ''; }
  function alerta(c){ return !!(c && (c.classList.contains('tw-alert-pink') || c.querySelector('.hubalerta:not([hidden])'))); }
  function titulo(c){ var b = c && c.querySelector('b'); return b ? b.textContent.trim() : ''; }
  function descricao(c){
    if(!c) return '';
    var s = [].slice.call(c.querySelectorAll('small')).filter(function(x){ return !x.hasAttribute('lang') && !x.classList.contains('tw-hubgame-jp') && !x.classList.contains('tw-karaoke-timer') && !x.classList.contains('tw-karaoke-ticket-count'); });
    return s.length ? s[s.length - 1].textContent.trim() : '';
  }
  // Mesma regra do clique dos cards no hub: estes pedem conta (Sora e Karaoke ficam livres se o teste sem login estiver ligado).
  var PEDE_LOGIN = {pet:1, gacha:1, loja:1, duo:1, sora:1, karaoke:1};
  function precisaEntrar(k){
    if(logado() || !PEDE_LOGIN[k]) return false;
    return !(window.TW_JOGOS_SEM_LOGIN && (k === 'sora' || k === 'karaoke'));
  }
  function abrirCard(k){
    var c = card(k); if(!c) return;
    if(precisaEntrar(k)){ pedirLogin(titulo(c)); return; }
    c.click();   // o mesmo caminho do hub: sons, cadeados, prêmios e telas continuam iguais
  }
  var JOGOS = ['run', 'karaoke', 'sora', 'battle', 'duo', 'cafe', 'handshake', 'studio', 'bloom', 'pet'];
  function jogosNaTela(){ return JOGOS.filter(function(k){ return !!card(k); }); }

  /* ---------- estado ---------- */
  var cel, tela, nav, folha, pilha = ['inicio'], classico = false, sairPend = 0, ultimaTela = '';
  function topo(){ return pilha[pilha.length - 1]; }
  function rankNome(){ try{ return (typeof RANKS !== 'undefined' && typeof rankOf === 'function') ? RANKS[rankOf(+best || 0)][1] : ''; }catch(e){ return ''; } }
  function nick(){ return logado() ? (contaJ.nick || contaJ.nome || '') : t('vis'); }
  function estrelas(){ var n = +(typeof starT !== 'undefined' ? starT : 0) || 0; try{ return n.toLocaleString(); }catch(e){ return String(n); } }
  function recorde(){ var n = +(typeof best !== 'undefined' ? best : 0) || 0; try{ return n.toLocaleString(); }catch(e){ return String(n); } }
  function visita(){
    var v = null; try{ v = typeof window.twMapaVisitaAgora === 'function' ? window.twMapaVisitaAgora() : null; }catch(e){ v = null; }
    if(!v) return t('mapaVazio');
    var quem = L() === 'pt' ? (ARTIGO[v.quem] || '') + ' ' + v.quem : v.quem;
    return t('mapaAgora').replace('{quem}', quem.trim()).replace('{rua}', v.nome);
  }

  /* ---------- pedaços da tela ---------- */
  function barraTopo(){
    return '<div class="twc-topo"><div class="twc-topo-in">' +
      '<button type="button" class="twc-eu" data-ir="perfil" aria-label="' + esc(t('perfil') + ': ' + nick()) + '"><canvas class="twc-av" data-av="1" width="96" height="96" aria-hidden="true"></canvas>' +
      '<span class="twc-eu-txt">' + (rankNome() ? '<small class="twc-lv">' + esc(rankNome()) + '</small>' : '') + '<b>' + esc(nick()) + '</b></span></button>' +
      '<span class="twc-st"><span class="twc-st-ico" aria-hidden="true">' + ico('estrela', 20) + '</span><b id="twcEstrelas">' + esc(estrelas()) + '</b>' +
      '<button type="button" class="twc-st-mais" data-ir="loja" aria-label="' + esc(t('estrelas')) + '">' + ico('mais', 16) + '</button></span>' +
      '<button type="button" class="twc-cfg" data-v="ajustes" aria-label="' + esc(t('ajustes')) + '">' + ico('ajustes', 22) + '</button>' +
      '</div><div class="twc-arco" aria-hidden="true"></div></div>';
  }
  function faixa(tit, sub, chip){
    return '<div class="twc-faixa"><span><h1>' + tit + '</h1><small>' + esc(sub) + '</small></span>' + (chip ? '<em>' + esc(chip) + '</em>' : '') +
      brilhos([[52, 18, 12], [66, 62, 9, 'l'], [80, 22, 10, 'r']]) + '</div>';
  }
  function badge(c){ return alerta(c) ? '<em class="twc-dot" aria-hidden="true">!</em>' : ''; }
  function cadeado(k){ return precisaEntrar(k) ? '<em class="twc-cad" aria-hidden="true">' + ico('cadeado', 13) + '</em>' : ''; }
  function app(k, nome, attrs, c){
    return '<button type="button" class="twc-app" ' + attrs + '><span class="twc-app-ico twc-g-' + (COR[k] || 'roxo') + '">' + ico(k, 30) + badge(c) + cadeado(k) + '</span><span class="twc-app-nome" translate="no">' + esc(nome) + '</span></button>';
  }
  // nomes curtos embaixo dos ícones (nomes próprios dos jogos, iguais em todos os idiomas)
  var CURTO = {run:'Center Run', karaoke:'Karaoke', sora:'Sora Jump', pet:'Pet', gacha:'Gacha', duo:'Moon Duo', cafe:'Happy Cafe', handshake:'Handshake', battle:'Idol Battle', studio:'Photo Studio', bloom:'Bloom Garden'};
  function nomeCurto(c, k){ return CURTO[k] || titulo(c).replace(/⭐/g, ' ').replace(/!$/, '').trim(); }

  // O coração do TsuLiPa⭐World continua: o logo animado, o tema do momento e o palco do Tsu, da Lirika e do Pati
  // (com os pets e a roupa da temporada). O palco é o mesmo canvas do hub clássico, copiado quadro a quadro,
  // e um toque nele chega ao hub como antes (o trio reage, os pets falam).
  function palco(){
    var logo = document.querySelector('#hub .hubin .hublogo'), tema = $id('hubTema'), cv = $id('hubCv');
    var rot = cv ? (cv.getAttribute('aria-label') || 'TsuLiPa') : 'TsuLiPa';
    return '<section class="twc-palco">' + brilhos([[6, 8, 14], [90, 6, 12, 'l'], [94, 40, 10, 'r'], [4, 46, 9, 'l']]) +
      '<h1 class="hublogo twc-hublogo" translate="no" aria-label="TsuLiPa World">' + (logo ? logo.innerHTML : 'TsuLiPa⭐World') + '</h1>' +
      '<p class="hubsub twc-hubsub" lang="ja">ツリパ⭐ワールド</p>' +
      (tema && !tema.hidden && tema.textContent ? '<p class="twc-tema">' + esc(tema.textContent) + '</p>' : '') +
      '<div class="twc-palco-moldura"><canvas id="twcPalcoCv" width="640" height="340" role="img" aria-label="' + esc(rot) + '"></canvas></div></section>';
  }
  var palcoRaf = 0;
  function palcoQuadro(){
    palcoRaf = 0;
    var dst = $id('twcPalcoCv'), src = $id('hubCv'), h = $id('hub');
    if(!dst || !src || !h || h.hidden || classico || document.hidden) return;
    try{
      if(dst.width !== src.width || dst.height !== src.height){ dst.width = src.width; dst.height = src.height; }
      var x = dst.getContext('2d'); x.clearRect(0, 0, dst.width, dst.height); x.drawImage(src, 0, 0);
    }catch(e){ return; }
    palcoRaf = requestAnimationFrame(palcoQuadro);
  }
  function palcoLigar(){ if(!palcoRaf) palcoRaf = requestAnimationFrame(palcoQuadro); }
  function palcoToque(e){   // repassa o toque para o canvas do hub, no mesmo ponto proporcional
    var dst = e.currentTarget, src = $id('hubCv'); if(!src) return;
    var a = dst.getBoundingClientRect(), b = src.getBoundingClientRect(); if(!a.width || !b.width) return;
    var fx = (e.clientX - a.left) / a.width, fy = (e.clientY - a.top) / a.height;
    src.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, clientX:b.left + fx * b.width, clientY:b.top + fy * b.height}));
  }
  function telaInicio(){
    var alertas = [].slice.call(document.querySelectorAll('#hubCards .hubcard')).filter(alerta).slice(0, 3);
    var mis = (logado() && typeof hubMisDados !== 'undefined' && Array.isArray(hubMisDados)) ? hubMisDados : null;
    var feitas = mis ? mis.filter(function(m){ return m.feito; }).length : 0;
    var linhas = alertas.map(function(c){
      return '<button type="button" class="twc-linha" data-ir="' + esc(chaveDe(c)) + '"><span class="twc-linha-ico twc-g-' + (COR[chaveDe(c)] || 'roxo') + '">' + ico(chaveDe(c), 18) + '</span><span class="twc-linha-txt"><b translate="no">' + esc(titulo(c)) + '</b><small>' + esc(descricao(c)) + '</small></span>' + ico('seta', 18) + '</button>';
    });
    if(mis && mis.length) linhas.push('<button type="button" class="twc-linha" data-a="missoes"><span class="twc-linha-ico twc-g-lima">' + ico('missoes', 18) + '</span><span class="twc-linha-txt"><b>' + esc(t('mis')) + '</b><small>' + feitas + '/' + mis.length + '</small></span>' + ico('seta', 18) + '</button>');
    if(!linhas.length) linhas.push('<p class="twc-emdia">' + ico('check', 18) + ' ' + esc(t('emdia')) + '</p>');
    var pc = mis && mis.length ? Math.round(feitas / mis.length * 100) : 0;
    var pi = []; try{ pi = typeof hubPetInfo === 'function' ? hubPetInfo() : []; }catch(e){ pi = []; }
    var petC = card('pet'), petEmo = (petC && petC.querySelector('i')) ? petC.querySelector('i').textContent : '';
    var grade = [['run'], ['karaoke'], ['sora'], ['pet'], ['mapa', 'a'], ['news', 'a'], ['gacha'], ['todos', 'v']].map(function(g){
      var k = g[0];
      if(g[1] === 'a') return app(k, k === 'news' ? 'Idol News' : t('mapa'), 'data-a="' + k + '"');
      if(g[1] === 'v') return app(k, t('todos'), 'data-v="jogos"');
      var c = card(k); if(!c) return '';
      return app(k, nomeCurto(c, k), 'data-ir="' + k + '"', c);
    }).join('');
    return '<div class="twc-pag twc-inicio"><div class="twc-lado">' + palco() +
      '<button type="button" class="twc-ticker" data-a="mapa"><i class="twc-vivo" aria-hidden="true"></i><span id="twcVisita">' + esc(visita()) + '</span>' + ico('seta', 18) + '</button>' +
      '<section class="twc-card twc-hoje" aria-labelledby="twcHojeT"><div class="twc-card-cab"><h2 id="twcHojeT">' + esc(t('hoje')) + '</h2>' +
        (mis && mis.length ? '<span class="twc-prog"><span class="twc-barra" aria-hidden="true"><i style="width:' + pc + '%"></i></span><small>' + feitas + '/' + mis.length + '</small></span>' : '') + '</div>' +
        linhas.join('') + brilhos([[94, -4, 16, 'r']]) + '</section></div>' +
      '<div class="twc-lado"><div class="twc-duas">' +
        '<button type="button" class="twc-card twc-idol" data-ir="pet"><canvas class="twc-idol-av" data-av="1" width="160" height="160" aria-hidden="true"></canvas>' +
          (petEmo ? '<span class="twc-idol-pet" aria-hidden="true">' + esc(petEmo) + '</span>' : '') + '<b>' + esc(pi[0] || 'Backstage⭐Pet!') + '</b>' + badge(petC) + brilhos([[10, 10, 11], [80, 40, 9]]) + '</button>' +
        '<button type="button" class="twc-card twc-rank" data-a="tv"><span class="twc-rank-t">' + ico('trofeu', 20) + '<b>' + esc(t('rank')) + '</b></span><span class="twc-rank-n">' + esc(recorde()) + '</span><small>' + esc(tt('Recorde')) + ' · ' + esc(t('tv')) + '</small>' + brilhos([[78, 64, 10, 'l'], [70, 12, 8]]) + '</button>' +
      '</div>' +
      '<section class="twc-apps" aria-label="' + esc(t('jogos')) + '">' + grade + '</section>' +
      '</div></div>';
  }
  function banner(k, tit, linha, botao, attrs, fita, extra){
    return '<button type="button" class="twc-banner twc-g-' + (COR[k] || 'roxo') + '" ' + attrs + '><i class="twc-varre" aria-hidden="true"></i>' + (fita ? '<em class="twc-fita">' + esc(fita) + '</em>' : '') +
      '<span class="twc-banner-txt"><b translate="no">' + esc(tit) + '</b><small>' + esc(linha) + '</small>' + (extra || '') + '</span><span class="twc-banner-btn">' + esc(botao) + '</span>' +
      brilhos([[70, 14, 10], [62, 70, 8, 'l']]) + '</button>';
  }
  function telaMenu(){
    var run = card('run'), kar = card('karaoke'), gac = card('gacha');
    var musica = ''; try{ musica = typeof hubMusicaSemana === 'function' ? hubMusicaSemana()[1] : ''; }catch(e){}
    var bs = [];
    if(run) bs.push(banner('run', titulo(run), tt('Recorde') + ': ' + recorde(), tt('Jogar'), 'data-ir="run"'));
    if(kar) bs.push(banner('karaoke', titulo(kar), musica ? tt('Música da semana') + ': ' + musica : descricao(kar), tt('Abrir'), 'data-ir="karaoke"', alerta(kar) ? '!' : ''));
    if(gac) bs.push(banner('gacha', titulo(gac), tt('1 giro por dia'), tt('Abrir'), 'data-ir="gacha"', alerta(gac) ? '!' : ''));
    bs.push(banner('news', 'Idol⭐News!', tt('Os destaques da semana'), tt('Abrir'), 'data-a="news"'));
    var at = [['missoes', t('mis'), 'data-a="missoes"'], ['perfil', tt('Meu Perfil'), 'data-ir="perfil"'], ['loja', 'Zipper Shop', 'data-ir="loja"'], ['album', t('album'), 'data-a="album"'],
              ['tv', 'TsuLiPa TV', 'data-a="tv"'], ['busca', t('busca'), 'data-a="busca"'], ['nov', t('nov'), 'data-a="nov"'], ['ajustes', t('ajustes'), 'data-v="ajustes"']];
    if(typeof window.albumAbrir !== 'function') at = at.filter(function(a){ return a[0] !== 'album'; });
    return faixa(esc(t('menu')), t('menuSub')) + '<div class="twc-pag twc-menu"><div class="twc-banners">' + bs.join('') + '</div>' +
      '<section class="twc-atalhos" aria-label="' + esc(t('menu')) + '">' + at.map(function(a){
        var c = a[2].indexOf('data-ir') === 0 ? card(a[0]) : null;
        return '<button type="button" class="twc-atalho" ' + a[2] + '>' + ico(a[0], 26) + '<span>' + esc(a[1]) + '</span>' + badge(c) + cadeado(a[0]) + '</button>';
      }).join('') + '</section></div>';
  }
  function telaJogos(){
    var ks = jogosNaTela();
    return faixa(esc(t('jogos')), t('jogosSub').replace('{n}', ks.length)) + '<div class="twc-pag twc-jogos"><div class="twc-lista">' + ks.map(function(k){
      var c = card(k);
      return '<button type="button" class="twc-jogo twc-g-' + (COR[k] || 'roxo') + '" data-ir="' + k + '"><span class="twc-jogo-ico">' + ico(k, 24) + '</span>' +
        '<span class="twc-jogo-txt"><b translate="no">' + esc(titulo(c)) + '</b><small>' + esc(descricao(c)) + '</small></span>' +
        (alerta(c) ? '<em class="twc-novo" aria-hidden="true">!</em>' : '') + (precisaEntrar(k) ? '<em class="twc-novo twc-novo-cad" aria-hidden="true">' + ico('cadeado', 14) + '</em>' : '') + ico('seta', 20) + '</button>';
    }).join('') + '</div></div>';
  }
  function telaAjustes(){
    var LG = [['pt', 'Português'], ['en', 'English'], ['es', 'Español'], ['id', 'Indonesia'], ['th', 'ไทย'], ['ja', '日本語']];
    var OS = [['', '☀️', tt('Padrão')], ['tsu', '🎤', 'Tsu'], ['lirika', '🐨', 'Lirika'], ['pati', '👑', 'Pati']];
    var oshi = typeof OSHI === 'string' ? OSHI : '';
    return faixa(esc(t('ajustes')), t('ajustesSub')) + '<div class="twc-pag twc-ajustes">' +
      '<section class="twc-card"><h2>' + esc(tt('Idioma')) + '</h2><div class="twc-chips" role="group" aria-label="' + esc(tt('Idioma')) + '">' +
        LG.map(function(l){ return '<button type="button" data-l="' + l[0] + '" aria-pressed="' + (L() === l[0]) + '" lang="' + l[0] + '">' + l[1] + '</button>'; }).join('') + '</div></section>' +
      '<section class="twc-card"><h2>' + esc(tt('Tema do Oshi')) + '</h2><div class="twc-chips" role="group" aria-label="' + esc(tt('Tema do Oshi')) + '">' +
        OS.map(function(o){ return '<button type="button" data-o="' + o[0] + '" aria-pressed="' + (oshi === o[0]) + '"><span aria-hidden="true">' + o[1] + '</span> ' + esc(o[2]) + '</button>'; }).join('') + '</div></section>' +
      '<section class="twc-card"><h2>' + esc(nick()) + '</h2>' + (logado()
        ? '<button type="button" class="twc-btn twc-btn-claro" data-a="sair">' + esc(sairPend ? t('sairOk') : t('sair')) + '</button>'
        : '<button type="button" class="twc-btn" data-a="entrar">' + esc(t('entrar')) + ' · Google</button>') + '</section>' +
      '<button type="button" class="twc-btn twc-btn-claro" data-a="classico">' + esc(t('classico')) + '</button>' +
      '</div>';
  }
  function telaInicial(){   // antes do "Toque para começar" (libera o som do aparelho)
    return '<div class="twc-abre">' + brilhos([[14, 18, 14], [82, 24, 12, 'l'], [24, 70, 10, 'r'], [76, 66, 14], [50, 12, 9, 'l']]) +
      (function(){ var lg = document.querySelector('#hub .hubin .hublogo'); return lg ? '<h1 class="hublogo twc-hublogo twc-logo-abre" translate="no" aria-label="TsuLiPa World">' + lg.innerHTML + '</h1>' : '<h1 class="twc-logo" translate="no">TsuLiPa<span>⭐</span>World</h1>'; })() +
      '<p class="hubsub twc-hubsub" lang="ja">ツリパ⭐ワールド</p>' +
      '<button type="button" class="twc-comecar" data-a="comecar"><i class="twc-varre" aria-hidden="true"></i><span>' + esc(tt('TOQUE PARA COMEÇAR')) + '</span></button></div>';
  }
  function barraBaixo(){
    var v = topo(), noMenu = v === 'menu' && !classico, raiz = pilha.length < 2 && !classico;
    return '<button type="button" class="twc-nav-b" data-n="voltar"' + (raiz ? ' disabled' : '') + '>' + ico('voltar', 26) + '<span>' + esc(t('voltar')) + '</span></button>' +
      '<span class="twc-nav-meio"><button type="button" class="twc-nav-menu' + (noMenu ? ' twc-aberto' : '') + '" data-n="menu" aria-label="' + esc(noMenu ? t('ini') : t('menu')) + '" aria-expanded="' + noMenu + '">' + ico(noMenu ? 'x' : 'menu', 28) +
        (!noMenu && document.querySelector('#hubCards .hubcard.tw-alert-pink') ? '<em class="twc-dot" aria-hidden="true">!</em>' : '') + brilhos([[-6, -6, 13, 'l']]) + '</button></span>' +
      '<button type="button" class="twc-nav-b" data-n="inicio"' + (v === 'inicio' && !classico ? ' aria-current="page"' : '') + '>' + ico('casa', 26) + '<span>' + esc(t('ini')) + '</span></button>';
  }

  /* ---------- desenhar ---------- */
  function avatares(){
    [].slice.call(cel.querySelectorAll('canvas[data-av]')).forEach(function(cv){ try{ if(typeof perfFotoRedonda === 'function' && typeof hubAv === 'function') perfFotoRedonda(cv, hubAv(), true); }catch(e){} });
  }
  function desenhar(){
    if(!cel) return;
    var comecou = typeof hubComecou !== 'undefined' ? hubComecou : true;
    var v = comecou ? topo() : 'abre', chave = v + '|' + pilha.length;
    var rolagem = chave === ultimaTela ? tela.scrollTop : 0; ultimaTela = chave;
    tela.setAttribute('data-tela', v);
    var part = $id('hubPart');   // as partículas do tema do momento (neve, pétalas, corações...) caem no celular também
    tela.innerHTML = '<div class="hubpart twc-part" aria-hidden="true">' + (part ? part.innerHTML : '') + '</div>' +
      (v === 'abre' ? telaInicial() : barraTopo() + (v === 'menu' ? telaMenu() : v === 'jogos' ? telaJogos() : v === 'ajustes' ? telaAjustes() : telaInicio()));
    tela.scrollTop = rolagem;
    nav.hidden = v === 'abre';
    nav.innerHTML = barraBaixo();
    document.body.classList.toggle('tw-cel-classico', classico);
    avatares();
    var pc = $id('twcPalcoCv'); if(pc){ pc.addEventListener('click', palcoToque); palcoLigar(); }
  }
  function ir(v){ if(classico) sairClassico(); if(topo() !== v) pilha.push(v); som(); desenhar(); tela.scrollTop = 0; focarTitulo(); }
  function inicio(){ if(classico) sairClassico(); pilha = ['inicio']; som(); desenhar(); tela.scrollTop = 0; }
  function voltar(){ if(classico){ sairClassico(); som(); desenhar(); return; } if(pilha.length > 1){ pilha.pop(); som(); desenhar(); focarTitulo(); } }
  function focarTitulo(){ var h = tela.querySelector('.twc-faixa h1'); if(h){ h.setAttribute('tabindex', '-1'); try{ h.focus({preventScroll:true}); }catch(e){} } }

  // Partes que ainda moram no hub antigo (missões, busca, novidades, mapa): mostra o hub por baixo,
  // rolado até ela, e a barra de baixo continua lá para voltar ao celular.
  function classicoEm(sel, depois){
    var el = document.querySelector(sel); if(!el) return;
    classico = true; desenhar();
    requestAnimationFrame(function(){ try{ el.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){ el.scrollIntoView(); } if(depois) try{ depois(el); }catch(e){} });
  }
  function sairClassico(){ classico = false; var h = $id('hub'); if(h) h.scrollTop = 0; palcoLigar(); }

  /* ---------- aviso "Entre para jogar" (antes o card abria o login direto e parecia que o jogo não abria) ---------- */
  function pedirLogin(nome){
    folha.innerHTML = '<div class="twc-folha-caixa" role="dialog" aria-modal="true" aria-labelledby="twcLoginT"><span class="twc-folha-ico twc-g-roxo">' + ico('cadeado', 28) + '</span>' +
      '<h2 id="twcLoginT">' + esc(t('loginT')) + '</h2>' + (nome ? '<p class="twc-folha-nome" translate="no">' + esc(nome) + '</p>' : '') + '<p>' + esc(t('loginTxt')) + '</p>' +
      '<button type="button" class="twc-btn" data-f="entrar">' + esc(t('entrar')) + ' · Google</button><button type="button" class="twc-btn twc-btn-claro" data-f="fechar">' + esc(t('agoraNao')) + '</button>' +
      brilhos([[12, 8, 12], [86, 14, 10, 'l']]) + '</div>';
    folha.hidden = false;
    var b = folha.querySelector('[data-f="entrar"]'); if(b) try{ b.focus(); }catch(e){}
  }
  function fecharFolha(){ folha.hidden = true; folha.innerHTML = ''; }

  function acao(a, el){
    if(a === 'comecar'){ if(typeof hubComecar === 'function') hubComecar(); return; }
    if(a === 'mapa') return classicoEm('#twMapa', function(sec){ if(!sec.classList.contains('aberto')){ var b = sec.querySelector('.tw-mapa-botao'); if(b) b.click(); } });
    if(a === 'missoes') return classicoEm('#hubMisPainel');
    if(a === 'busca') return classicoEm('.hubbusca', function(){ var i = $id('hubBusca'); if(i) try{ i.focus({preventScroll:true}); }catch(e){} });
    if(a === 'nov') return classicoEm('.hubnov', function(d){ d.open = true; });
    if(a === 'news'){ if(typeof window.jornalAbrir === 'function'){ try{ if(typeof sfx !== 'undefined' && sfx.card) sfx.card(); }catch(e){} window.jornalAbrir(); } return; }
    if(a === 'tv'){ var tv = $id('twRankTvAbrir'); if(tv) tv.click(); return; }
    if(a === 'album'){ if(typeof window.albumAbrir === 'function') window.albumAbrir(); return; }
    if(a === 'entrar'){ if(typeof contaEntrar === 'function') contaEntrar(); return; }
    if(a === 'sair'){
      if(sairPend){ sairPend = 0; if(typeof contaSair === 'function') contaSair(); return; }
      sairPend = 1; el.textContent = t('sairOk'); setTimeout(function(){ if(sairPend){ sairPend = 0; if(topo() === 'ajustes') desenhar(); } }, 4000); return;
    }
    if(a === 'classico') desligar();
  }
  function limparEndereco(){ try{ var u = new URL(location.href); if(u.searchParams.has('celular')){ u.searchParams.delete('celular'); history.replaceState(history.state, '', u.pathname + u.search + u.hash); } }catch(e){} }

  function clique(e){
    var b = e.target.closest && e.target.closest('button'); if(!b || !cel.contains(b) || b.disabled) return;
    if(b.dataset.f){ var f = b.dataset.f; fecharFolha(); if(f === 'entrar' && typeof contaEntrar === 'function') contaEntrar(); return; }
    if(b.dataset.n){ var n = b.dataset.n; if(n === 'voltar') voltar(); else if(n === 'inicio') inicio(); else if(topo() === 'menu' && !classico) voltar(); else ir('menu'); return; }
    if(b.dataset.v){ ir(b.dataset.v); return; }
    if(b.dataset.l){   // idioma: o mesmo botão do menu do Center Run (salva e traduz o jogo todo; o hub se refaz e o celular junto)
      var lb = document.querySelector('.lang button[data-l="' + b.dataset.l + '"]'); if(lb) lb.click(); som(); return;
    }
    if(b.dataset.o !== undefined){ if(typeof applyOshi === 'function') applyOshi(b.dataset.o); if(typeof hubCfgUI === 'function') hubCfgUI(); som(); desenhar(); return; }
    if(b.dataset.a){ acao(b.dataset.a, b); return; }
    if(b.dataset.ir){ abrirCard(b.dataset.ir); }
  }

  /* ---------- montar ---------- */
  // Ligar e desligar na hora, sem recarregar a página (o hub clássico nunca deixou de estar montado por baixo).
  function desligar(){
    try{ localStorage.removeItem(CHAVE); }catch(e){}
    window.TW_CELULAR_LIGADO = false; limparEndereco(); fecharFolha();
    if(cel){ cel.remove(); cel = null; }
    document.body.classList.remove('tw-cel', 'tw-cel-classico');
    classico = false; pilha = ['inicio'];
    if(typeof hubCfgUI === 'function') hubCfgUI();
  }
  function ligar(){ window.TW_CELULAR_LIGADO = true; pilha = ['inicio']; classico = false; montar(); }
  function montar(){
    var h = $id('hub'); if(!h || cel) return;
    document.body.classList.add('tw-cel');
    cel = document.createElement('div'); cel.id = 'twCel'; cel.className = 'twc';
    cel.innerHTML = '<div class="twc-tela" id="twcTela"></div><nav class="twc-nav" id="twcNav" aria-label="TsuLiPa⭐World"></nav><div class="twc-folha" id="twcFolha" hidden></div>';
    h.appendChild(cel);
    tela = $id('twcTela'); nav = $id('twcNav'); folha = $id('twcFolha');
    cel.addEventListener('click', clique);
    folha.addEventListener('click', function(e){ if(e.target === folha) fecharFolha(); });
    if(!montar.tecla) document.addEventListener('keydown', function(e){
      if(e.key !== 'Escape' || !cel || h.hidden) return;
      if(!folha.hidden){ e.preventDefault(); fecharFolha(); return; }
      if(document.querySelector('[aria-modal="true"]:not([hidden])')) return;
      if(classico || pilha.length > 1){ e.preventDefault(); voltar(); }
    });
    montar.tecla = true;
    desenhar();
  }
  // Refaz junto com o hub (idioma, login, estrelas, alertas, missões, "Toque para começar").
  ['hubMontar', 'hubCardsUI', 'hubComecar', 'hubMisUI', 'hubMostrar', 'hubTemaUI'].forEach(function(nome){
    var f = window[nome]; if(typeof f !== 'function') return;
    window[nome] = function(){ var r = f.apply(this, arguments); try{ if(cel) desenhar(); }catch(e){} return r; };
  });
  // Estrelas e visita do mapa mudam sozinhas: atualiza só esses textos (sem refazer a tela e perder o foco).
  setInterval(function(){
    var h = $id('hub'); if(!cel || !h || h.hidden) return;
    var s = $id('twcEstrelas'); if(s && s.textContent !== estrelas()) s.textContent = estrelas();
    var v = $id('twcVisita'); if(v){ var tx = visita(); if(v.textContent !== tx) v.textContent = tx; }
  }, 5000);
  if(document.readyState !== 'loading') montar(); else document.addEventListener('DOMContentLoaded', montar);
  window.TW_CELULAR = {txt:T, jogos:JOGOS, pedeLogin:PEDE_LOGIN, chave:CHAVE, ligar:ligar, desligar:desligar};
})();
