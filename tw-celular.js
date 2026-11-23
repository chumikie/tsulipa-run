/* TsuLiPa⭐World · visual de celular — o visual oficial da v3 nos telefones (prévia em 15/11, oficial em 17/11/2026).
   Ideia do amigo + esqueleto do Link! Like!: a tela de início vira um celular de Idol — barra de cima
   (você e as estrelas), barra de baixo (Voltar · Menu · Início), widgets do dia e um app por jogo.
   Liga sozinho em qualquer aparelho (desde 17/11/2026), a não ser que a chave brs48cr_celular seja "0" (?celular=0). Não cria regra nova:
   cada ícone chama o mesmo card do hub antigo, que continua montado por baixo (login, cadeados,
   sons e prêmios seguem iguais). Ajustes → "Voltar ao visual clássico" volta ao antigo. */
(function(){
  'use strict';
  var CHAVE = 'brs48cr_celular';
  var T = {
    pt:{idols:'Idols do TsuLiPa⭐World', tut1:'Este é o seu celular de Idol!', tut1b:'Em cima ficam você e as suas estrelas. Embaixo: Voltar, Menu e Início, em todas as telas.', tut2:'Cada app é um jogo', tut2b:'A bolinha vermelha avisa que tem novidade. O cadeado pede para entrar com o Google.', tut3:'O Menu guarda o resto', tut3b:'Pra hoje, ranking, pet, álbum, Idol News e ajustes. Quer o visual antigo? Está em Ajustes.', tutOk:'Próximo', tutFim:'Vamos lá!', tutPular:'Pular',
        rankVazio:'Jogue o Center Run para entrar no ranking', todosAlbum:'Todos', outros:'Outros', albumSub:'Seus cards do Star⭐Gacha!', albumVazio:'Nenhum card aqui ainda. Gire o Star⭐Gacha!', albumCompleto:'Ver metas e trocar cards', filtro:'Filtrar por Oshi',
        vis:'Visitante', ini:'Início', menu:'Menu', voltar:'Voltar', jogos:'Jogos', todos:'Todos os jogos', hoje:'Pra hoje', emdia:'Tudo em dia por hoje!',
        mis:'Missões do dia', rank:'Ranking da semana', tv:'Ver na TV', mapa:'Mapa', mapaAgora:'Agora no mapa: {quem} · {rua}', mapaVazio:'Passeie pelo mapa da cidade',
        menuSub:'Tudo do TsuLiPa⭐World', jogosSub:'{n} jogos · escolha um', ajustes:'Ajustes', ajustesSub:'Idioma, tema e conta', classico:'Voltar ao visual clássico',
        loginT:'Entre para jogar', loginTxt:'Este jogo salva o seu progresso na sua conta. Entre com o Google para jogar.', agoraNao:'Agora não', entrar:'Entrar', sair:'Sair', sairOk:'Toque de novo para sair',
        album:'Álbum', busca:'Procurar Idol', nov:'Novidades', estrelas:'Ganhar estrelas', perfil:'Seu perfil'},
    en:{idols:'TsuLiPa⭐World Idols', tut1:'This is your Idol phone!', tut1b:'You and your stars are at the top. At the bottom: Back, Menu and Home, on every screen.', tut2:'Each app is a game', tut2b:'A red dot means something new. A lock means sign in with Google.', tut3:'The Menu holds the rest', tut3b:'For today, ranking, pet, album, Idol News and settings. Want the old look? It is in Settings.', tutOk:'Next', tutFim:"Let's go!", tutPular:'Skip',
        rankVazio:'Play Center Run to join the ranking', todosAlbum:'All', outros:'Others', albumSub:'Your Star⭐Gacha! cards', albumVazio:'No cards here yet. Spin the Star⭐Gacha!', albumCompleto:'See goals and trade cards', filtro:'Filter by Oshi',
        vis:'Visitor', ini:'Home', menu:'Menu', voltar:'Back', jogos:'Games', todos:'All games', hoje:'For today', emdia:"You're all set for today!",
        mis:'Daily missions', rank:'Weekly ranking', tv:'Watch on TV', mapa:'Map', mapaAgora:'On the map now: {quem} · {rua}', mapaVazio:'Stroll around the city map',
        menuSub:'Everything in TsuLiPa⭐World', jogosSub:'{n} games · pick one', ajustes:'Settings', ajustesSub:'Language, theme and account', classico:'Back to the classic look',
        loginT:'Sign in to play', loginTxt:'This game saves your progress to your account. Sign in with Google to play.', agoraNao:'Not now', entrar:'Sign in', sair:'Sign out', sairOk:'Tap again to sign out',
        album:'Album', busca:'Find an Idol', nov:"What's new", estrelas:'Get stars', perfil:'Your profile'},
    es:{idols:'Idols de TsuLiPa⭐World', tut1:'¡Este es tu celular de Idol!', tut1b:'Arriba estás tú con tus estrellas. Abajo: Volver, Menú e Inicio, en todas las pantallas.', tut2:'Cada app es un juego', tut2b:'El punto rojo avisa que hay novedad. El candado pide entrar con Google.', tut3:'El Menú guarda el resto', tut3b:'Para hoy, ranking, mascota, álbum, Idol News y ajustes. ¿Quieres el estilo anterior? Está en Ajustes.', tutOk:'Siguiente', tutFim:'¡Vamos!', tutPular:'Saltar',
        rankVazio:'Juega Center Run para entrar al ranking', todosAlbum:'Todos', outros:'Otros', albumSub:'Tus cards de Star⭐Gacha!', albumVazio:'Aún no hay cards aquí. ¡Gira el Star⭐Gacha!', albumCompleto:'Ver metas e intercambiar cards', filtro:'Filtrar por Oshi',
        vis:'Visitante', ini:'Inicio', menu:'Menú', voltar:'Volver', jogos:'Juegos', todos:'Todos los juegos', hoje:'Para hoy', emdia:'¡Todo listo por hoy!',
        mis:'Misiones del día', rank:'Ranking de la semana', tv:'Ver en la TV', mapa:'Mapa', mapaAgora:'Ahora en el mapa: {quem} · {rua}', mapaVazio:'Pasea por el mapa de la ciudad',
        menuSub:'Todo de TsuLiPa⭐World', jogosSub:'{n} juegos · elige uno', ajustes:'Ajustes', ajustesSub:'Idioma, tema y cuenta', classico:'Volver al estilo clásico',
        loginT:'Entra para jugar', loginTxt:'Este juego guarda tu progreso en tu cuenta. Entra con Google para jugar.', agoraNao:'Ahora no', entrar:'Entrar', sair:'Salir', sairOk:'Toca otra vez para salir',
        album:'Álbum', busca:'Buscar Idol', nov:'Novedades', estrelas:'Ganar estrellas', perfil:'Tu perfil'},
    id:{idols:'Idol TsuLiPa⭐World', tut1:'Ini ponsel Idol-mu!', tut1b:'Di atas ada kamu dan bintangmu. Di bawah: Kembali, Menu, dan Beranda, di setiap layar.', tut2:'Setiap aplikasi adalah game', tut2b:'Titik merah berarti ada yang baru. Gembok berarti masuk dengan Google.', tut3:'Menu menyimpan sisanya', tut3b:'Untuk hari ini, peringkat, hewan, album, Idol News, dan pengaturan. Mau tampilan lama? Ada di Pengaturan.', tutOk:'Lanjut', tutFim:'Ayo!', tutPular:'Lewati',
        rankVazio:'Main Center Run untuk masuk peringkat', todosAlbum:'Semua', outros:'Lainnya', albumSub:'Kartu Star⭐Gacha! milikmu', albumVazio:'Belum ada kartu di sini. Putar Star⭐Gacha!', albumCompleto:'Lihat target dan tukar kartu', filtro:'Saring menurut Oshi',
        vis:'Pengunjung', ini:'Beranda', menu:'Menu', voltar:'Kembali', jogos:'Game', todos:'Semua game', hoje:'Untuk hari ini', emdia:'Semua beres untuk hari ini!',
        mis:'Misi harian', rank:'Peringkat minggu ini', tv:'Tonton di TV', mapa:'Peta', mapaAgora:'Di peta sekarang: {quem} · {rua}', mapaVazio:'Jalan-jalan di peta kota',
        menuSub:'Semua isi TsuLiPa⭐World', jogosSub:'{n} game · pilih satu', ajustes:'Pengaturan', ajustesSub:'Bahasa, tema, dan akun', classico:'Kembali ke tampilan klasik',
        loginT:'Masuk untuk bermain', loginTxt:'Game ini menyimpan progresmu di akunmu. Masuk dengan Google untuk bermain.', agoraNao:'Nanti saja', entrar:'Masuk', sair:'Keluar', sairOk:'Ketuk lagi untuk keluar',
        album:'Album', busca:'Cari Idol', nov:'Yang baru', estrelas:'Dapatkan bintang', perfil:'Profilmu'},
    th:{idols:'ไอดอลของ TsuLiPa⭐World', tut1:'นี่คือมือถือไอดอลของคุณ!', tut1b:'ด้านบนคือคุณและดาวของคุณ ด้านล่าง: กลับ เมนู และหน้าแรก ในทุกหน้าจอ', tut2:'แต่ละแอปคือเกมหนึ่งเกม', tut2b:'จุดแดงแปลว่ามีของใหม่ แม่กุญแจแปลว่าต้องเข้าสู่ระบบด้วย Google', tut3:'เมนูเก็บทุกอย่างที่เหลือ', tut3b:'สำหรับวันนี้ อันดับ สัตว์เลี้ยง อัลบั้ม Idol News และการตั้งค่า อยากได้หน้าตาแบบเดิม? อยู่ในการตั้งค่า', tutOk:'ถัดไป', tutFim:'ไปกันเลย!', tutPular:'ข้าม',
        rankVazio:'เล่น Center Run เพื่อติดอันดับ', todosAlbum:'ทั้งหมด', outros:'อื่น ๆ', albumSub:'การ์ด Star⭐Gacha! ของคุณ', albumVazio:'ยังไม่มีการ์ดที่นี่ ลองหมุน Star⭐Gacha!', albumCompleto:'ดูเป้าหมายและแลกการ์ด', filtro:'กรองตามโอชิ',
        vis:'ผู้เยี่ยมชม', ini:'หน้าแรก', menu:'เมนู', voltar:'กลับ', jogos:'เกม', todos:'เกมทั้งหมด', hoje:'สำหรับวันนี้', emdia:'วันนี้ครบหมดแล้ว!',
        mis:'ภารกิจประจำวัน', rank:'อันดับประจำสัปดาห์', tv:'ดูทางทีวี', mapa:'แผนที่', mapaAgora:'ตอนนี้บนแผนที่: {quem} · {rua}', mapaVazio:'เดินเล่นในแผนที่เมือง',
        menuSub:'ทุกอย่างใน TsuLiPa⭐World', jogosSub:'{n} เกม · เลือกหนึ่งเกม', ajustes:'ตั้งค่า', ajustesSub:'ภาษา ธีม และบัญชี', classico:'กลับไปหน้าตาแบบเดิม',
        loginT:'เข้าสู่ระบบเพื่อเล่น', loginTxt:'เกมนี้บันทึกความคืบหน้าไว้ในบัญชีของคุณ เข้าสู่ระบบด้วย Google เพื่อเล่น', agoraNao:'ไว้ก่อน', entrar:'เข้าสู่ระบบ', sair:'ออกจากระบบ', sairOk:'แตะอีกครั้งเพื่อออก',
        album:'อัลบั้ม', busca:'ค้นหาไอดอล', nov:'มีอะไรใหม่', estrelas:'รับดาว', perfil:'โปรไฟล์ของคุณ'},
    ja:{idols:'TsuLiPa⭐Worldのアイドル', tut1:'これがあなたのアイドルケータイ！', tut1b:'上にはあなたとスター。下には「もどる・メニュー・ホーム」がどの画面にもあります。', tut2:'アプリひとつがゲームひとつ', tut2b:'赤い点はお知らせ。カギはGoogleでログインが必要です。', tut3:'のこりはメニューに', tut3b:'きょうのおすすめ、ランキング、ペット、アルバム、Idol News、設定。前の表示がいい？設定にあります。', tutOk:'つぎへ', tutFim:'はじめよう！', tutPular:'スキップ',
        rankVazio:'Center Runを遊んでランキングに参加しよう', todosAlbum:'全員', outros:'その他', albumSub:'あなたのStar⭐Gacha!カード', albumVazio:'まだカードがありません。Star⭐Gacha!を回そう！', albumCompleto:'目標とカード交換を見る', filtro:'推しで絞り込む',
        vis:'ゲスト', ini:'ホーム', menu:'メニュー', voltar:'もどる', jogos:'ゲーム', todos:'すべてのゲーム', hoje:'きょうのおすすめ', emdia:'きょうはぜんぶ完了！',
        mis:'デイリーミッション', rank:'今週のランキング', tv:'テレビで見る', mapa:'マップ', mapaAgora:'いまマップに：{quem}・{rua}', mapaVazio:'街のマップをおさんぽしよう',
        menuSub:'TsuLiPa⭐Worldのすべて', jogosSub:'{n}本のゲーム・ひとつ選んでね', ajustes:'設定', ajustesSub:'言語・テーマ・アカウント', classico:'クラシック表示にもどす',
        loginT:'ログインして遊ぼう', loginTxt:'このゲームは進みぐあいをアカウントに保存します。Googleでログインして遊んでね。', agoraNao:'あとで', entrar:'ログイン', sair:'ログアウト', sairOk:'もう一度タップでログアウト',
        album:'アルバム', busca:'アイドルをさがす', nov:'おしらせ', estrelas:'スターをもらう', perfil:'あなたのプロフィール'}
  };
  // artigo certo no português: o Tsu, a Lirika, o Pati
  var ARTIGO = {Tsu:'o', Lirika:'a', Pati:'o'};
  function L(){ return (typeof LANG === 'string' && T[LANG]) ? LANG : 'pt'; }
  function t(k){ return T[L()][k] || T.pt[k]; }
  // Textos da rodada BarbieGirls/Zwinky (15/11): frases, interiores, Cantinho dos pais e manutenção
  var T2 = {
    falar:{pt:'Falar',en:'Say',es:'Decir',id:'Bilang',th:'พูด',ja:'ひとこと'},
    entrarEm:{pt:'Entrar: {n}',en:'Go in: {n}',es:'Entrar: {n}',id:'Masuk: {n}',th:'เข้า: {n}',ja:'入る：{n}'},
    dentroSub:{pt:'Quem passa por aqui agora',en:"Who's hanging out here now",es:'Quién está aquí ahora',id:'Siapa yang ada di sini',th:'ใครอยู่ที่นี่ตอนนี้',ja:'いまここにいるアイドル'},
    paisPriv:{pt:'Privacidade e segurança',en:'Privacy and safety',es:'Privacidad y seguridad',id:'Privasi dan keamanan',th:'ความเป็นส่วนตัวและความปลอดภัย',ja:'プライバシーと安全'},
    manutT:{pt:'Estamos arrumando o palco!',en:"We're setting up the stage!",es:'¡Estamos preparando el escenario!',id:'Kami sedang menata panggung!',th:'กำลังจัดเวทีอยู่นะ!',ja:'ステージを準備中！'},
    manutTxt:{pt:'O servidor deu uma pausinha. Seu progresso está guardado. Enquanto isso, dá para jogar o Center⭐Run! normalmente.',en:'The server is taking a little break. Your progress is safe. Meanwhile you can still play Center⭐Run!.',es:'El servidor está en una pausita. Tu progreso está guardado. Mientras tanto puedes jugar Center⭐Run!.',id:'Server sedang istirahat sebentar. Progresmu aman. Sementara itu kamu tetap bisa main Center⭐Run!.',th:'เซิร์ฟเวอร์พักแป๊บนึง ความคืบหน้าของคุณยังอยู่ครบ ระหว่างนี้เล่น Center⭐Run! ได้ตามปกติ',ja:'サーバーがひと休み中です。進み具合は保存されています。そのあいだもCenter⭐Run!は遊べます。'},
    semNet:{pt:'Sem internet agora',en:'No internet right now',es:'Sin internet ahora',id:'Tidak ada internet',th:'ตอนนี้ไม่มีอินเทอร์เน็ต',ja:'いまインターネットにつながっていません'},
    tentar:{pt:'Tentar de novo',en:'Try again',es:'Intentar de nuevo',id:'Coba lagi',th:'ลองอีกครั้ง',ja:'もう一度'},
    vip:{pt:'Camarim VIP',en:'VIP Dressing Room',es:'Camerino VIP',id:'Ruang Rias VIP',th:'ห้องแต่งตัว VIP',ja:'VIP楽屋'},
    vipSub:{pt:'Seu passe de hoje: foto com o TsuLiPa!',en:"Today's pass: a photo with TsuLiPa!",es:'Tu pase de hoy: ¡foto con TsuLiPa!',id:'Tiket hari ini: foto bareng TsuLiPa!',th:'บัตรผ่านวันนี้: ถ่ายรูปกับ TsuLiPa!',ja:'きょうのパス：TsuLiPaと写真！'},
    vipAberto:{pt:'Aberto para você hoje ✨',en:'Open for you today ✨',es:'Abierto para ti hoy ✨',id:'Terbuka untukmu hari ini ✨',th:'เปิดให้คุณวันนี้ ✨',ja:'きょうは入れるよ ✨'},
    vipFechado:{pt:'Cumpra o desejo do dia para entrar',en:"Grant today's wish to get in",es:'Cumple el deseo del día para entrar',id:'Penuhi keinginan hari ini untuk masuk',th:'ทำความปรารถนาวันนี้ให้สำเร็จเพื่อเข้า',ja:'きょうのおねがいをかなえると入れます'},
    vipComo:{pt:'O Camarim VIP abre para todo mundo, todo dia: é só cumprir o desejo do dia do seu Idol. Lá dentro, o TsuLiPa tira uma foto com você!',en:"The VIP Dressing Room opens for everyone, every day: just grant your Idol's wish of the day. Inside, TsuLiPa takes a photo with you!",es:'El Camerino VIP abre para todos, todos los días: solo cumple el deseo del día de tu Idol. ¡Adentro, TsuLiPa se toma una foto contigo!',id:'Ruang Rias VIP terbuka untuk semua orang setiap hari: cukup penuhi keinginan Idol-mu hari ini. Di dalam, TsuLiPa foto bareng kamu!',th:'ห้อง VIP เปิดให้ทุกคนทุกวัน แค่ทำความปรารถนาประจำวันของไอดอลให้สำเร็จ ข้างในมี TsuLiPa รอถ่ายรูปกับคุณ!',ja:'VIP楽屋はだれでも毎日入れます。アイドルの「きょうのおねがい」をかなえるだけ。中でTsuLiPaがいっしょに写真をとってくれるよ！'},
    vipGanhou:{pt:'Passe VIP liberado!',en:'VIP pass unlocked!',es:'¡Pase VIP liberado!',id:'Tiket VIP terbuka!',th:'ปลดล็อกบัตร VIP แล้ว!',ja:'VIPパスゲット！'},
    vipRecepcao:{pt:'O trio preparou um cantinho especial para receber você. Cumprimente cada Idol ou toque no palco para ver as reações!',en:'The trio prepared a special welcome for you. Greet an Idol or tap the stage to see their reactions!',es:'¡El trío preparó una bienvenida especial! Saluda a un Idol o toca el escenario para ver sus reacciones.',id:'Trio menyiapkan sambutan spesial! Sapa Idol atau sentuh panggung untuk melihat reaksinya.',th:'ทั้งสามคนเตรียมต้อนรับคุณเป็นพิเศษ! ทักทายไอดอลหรือแตะเวทีเพื่อดูปฏิกิริยา',ja:'3人があなたをお出迎え！アイドルにあいさつするか、ステージをタップしてみてね。'},
    vipCumprimentar:{pt:'Cumprimentar o trio',en:'Greet the trio',es:'Saludar al trío',id:'Sapa trio',th:'ทักทายทั้งสามคน',ja:'3人にあいさつ'},
    vipPoseTitulo:{pt:'Pose da lembrança',en:'Keepsake pose',es:'Pose del recuerdo',id:'Pose kenangan',th:'ท่าโพสที่ระลึก',ja:'記念写真のポーズ'},
    vipPoseV:{pt:'Paz ✌',en:'Peace ✌',es:'Paz ✌',id:'Peace ✌',th:'สันติภาพ ✌',ja:'ピース ✌'},
    vipPoseCoracao:{pt:'Coração ♡',en:'Heart ♡',es:'Corazón ♡',id:'Hati ♡',th:'หัวใจ ♡',ja:'ハート ♡'},
    vipPoseTchau:{pt:'Aceno 👋',en:'Wave 👋',es:'Saludo 👋',id:'Lambaian 👋',th:'โบกมือ 👋',ja:'手を振る 👋'},
    vipDica:{pt:'Toque nos Idols para descobrir suas reações. A foto é uma lembrança voluntária.',en:'Tap the Idols to see their reactions. The photo is an optional keepsake.',es:'Toca a los Idols para ver sus reacciones. La foto es un recuerdo opcional.',id:'Sentuh Idol untuk melihat reaksinya. Foto adalah kenang-kenangan opsional.',th:'แตะไอดอลเพื่อดูปฏิกิริยา การถ่ายรูปเป็นทางเลือก',ja:'アイドルをタップすると反応するよ。写真は自由に保存できる思い出だよ。'},
    vipFoto:{pt:'Foto VIP (PNG)',en:'VIP photo (PNG)',es:'Foto VIP (PNG)',id:'Foto VIP (PNG)',th:'รูป VIP (PNG)',ja:'VIP写真（PNG）'},
    treino:{pt:'Treino',en:'Practice',es:'Práctica',id:'Latihan',th:'ฝึกซ้อม',ja:'練習'},
    legCad:{pt:'pede conta para abrir',en:'needs an account',es:'necesita cuenta',id:'perlu akun',th:'ต้องมีบัญชี',ja:'アカウントが必要'},
    legTreino:{pt:'joga sem conta, mas prêmio e ranking só entrando',en:'play without an account; prizes and rankings need one',es:'juega sin cuenta; premios y ranking necesitan una',id:'main tanpa akun; hadiah dan peringkat perlu akun',th:'เล่นได้โดยไม่มีบัญชี แต่รางวัลและอันดับต้องเข้าสู่ระบบ',ja:'アカウントなしで遊べます。ごほうびとランキングはログインが必要'},
    jogarRun:{pt:'Jogar Center⭐Run!',en:'Play Center⭐Run!',es:'Jugar Center⭐Run!',id:'Main Center⭐Run!',th:'เล่น Center⭐Run!',ja:'Center⭐Run!であそぶ'},
    novNovo:{pt:'novo',en:'new',es:'nuevo',id:'baru',th:'ใหม่',ja:'NEW'},
    novTem:{pt:'O que tem no TsuLiPa⭐World',en:"What's in TsuLiPa⭐World",es:'Qué hay en TsuLiPa⭐World',id:'Isi TsuLiPa⭐World',th:'มีอะไรใน TsuLiPa⭐World',ja:'TsuLiPa⭐Worldにあるもの'},
    novPosts:{pt:'Do Idol⭐News!',en:'From Idol⭐News!',es:'De Idol⭐News!',id:'Dari Idol⭐News!',th:'จาก Idol⭐News!',ja:'Idol⭐News!より'}
  };
  function t2(k, n){ var d = T2[k]; var s2 = d ? (d[L()] || d.pt) : k; return n != null ? s2.replace('{n}', n) : s2; }
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
    nota:'<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
    estrela:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    bolo:'<path d="M4 20h16M5 20v-7h14v7"/><path d="M5 15c2 1.5 4 1.5 7 0s5-1.5 7 0"/><path d="M12 13V9"/><path d="M12 6.5c.8-.8.8-1.7 0-2.5-.8.8-.8 1.7 0 2.5z"/>',
    pin:'<path d="M12 21s-6-5.6-6-11a6 6 0 0112 0c0 5.4-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>',
    regua:'<path d="M4 17L17 4l3 3L7 20z"/><path d="M8 13l1.5 1.5M11 10l1.5 1.5M14 7l1.5 1.5"/>',
    paleta:'<path d="M12 3a9 9 0 100 18c1.4 0 2-1 1.6-2-.5-1.2.3-2.4 1.6-2.4H17a4 4 0 004-4c0-5.2-4-9.6-9-9.6z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="14.5" cy="7" r="1"/>',
    pata:'<circle cx="7" cy="9" r="1.8"/><circle cx="12" cy="6.5" r="1.8"/><circle cx="17" cy="9" r="1.8"/><path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.6 1.5 2.3 3 1.8 1.6-.5 3.4-.5 5 0 1.5.5 3-.2 3-1.8C17.5 15 15 12 12 12z"/>',
    coracao:'<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
    aspas:'<path d="M5 17c0-4 1.5-7 4.5-8.5M14 17c0-4 1.5-7 4.5-8.5"/><circle cx="7" cy="16" r="2"/><circle cx="16" cy="16" r="2"/>',
    coroa:'<path d="M4 18h16l1-10-5 4-4-6-4 6-5-4z"/>',
    cal:'<rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="M8 14h2M14 14h2M8 17h2"/>',
    chama:'<path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-3.6-2.8-5.6-3.6-9.3-1.9 1.4-2.8 3.2-2.6 5.4-1.4-.9-2.2-2.3-2.3-4C7.7 9 5.5 11.4 5.5 14.8 5.5 18.4 8 21 12 21z"/>',
    fala:'<path d="M5 5h14a2 2 0 012 2v8a2 2 0 01-2 2h-7l-5 4v-4H5a2 2 0 01-2-2V7a2 2 0 012-2z"/>',
    escudo:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
    nuvem:'<path d="M7 18h10a4 4 0 00.6-8 6 6 0 00-11.4 1.6A3.3 3.3 0 007 18z"/>',
    arcoiris:'<path d="M3 18a9 9 0 0118 0"/><path d="M6.5 18a5.5 5.5 0 0111 0"/><path d="M10 18a2 2 0 014 0"/>',
    trio:'<circle cx="12" cy="7" r="3.2"/><circle cx="6" cy="15" r="3.2"/><circle cx="18" cy="15" r="3.2"/><path d="M9.6 9.4L7.8 12.3M14.4 9.4l1.8 2.9M9.2 15h5.6"/>',
    // atalhos do Menu (22/11): um desenho para cada, sem repetir
    quebra:'<path d="M5 8h3.2a2 2 0 113.6 0H15v3.2a2 2 0 110 3.6V18h-3.2a2 2 0 10-3.6 0H5z"/>',
    porta:'<path d="M6 21V4.5A1.5 1.5 0 017.5 3h9A1.5 1.5 0 0118 4.5V21"/><path d="M4 21h16"/><path d="M12 7.2l.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2-1.5-1.4 2-.3z"/><circle cx="15" cy="14.5" r=".7"/>',
    convite:'<rect x="3" y="6" width="18" height="13" rx="2.5"/><path d="M3.8 7.5L12 13l8.2-5.5"/><path d="M12 3v2.2M9.6 3.8l1 1.4M14.4 3.8l-1 1.4"/>',
    sino:'<path d="M6 16V11a6 6 0 0112 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 004 0"/><path d="M12 3v2"/>',
    grafico:'<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 16v-3M12 16V8M16 16v-5"/>',
    carta:'<path d="M4 6h16v12H4z"/><path d="M4 6l8 6.5L20 6"/><path d="M12 17.2l-1.6-1.5a1 1 0 011.6-1.2 1 1 0 011.6 1.2z"/>',
    brilho:'<path d="M12 3c.6 4.4 2.2 6.4 7 7-4.8.6-6.4 2.6-7 7-.6-4.4-2.2-6.4-7-7 4.8-.6 6.4-2.6 7-7z"/><path d="M19 15.5c.2 1.6.8 2.3 2.5 2.5-1.7.2-2.3.9-2.5 2.5-.2-1.6-.8-2.3-2.5-2.5 1.7-.2 2.3-.9 2.5-2.5z"/>',
    app:'<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M12 7v6.5M9.5 11l2.5 2.5 2.5-2.5"/><path d="M10.5 18.5h3"/>'
  };
  function ico(k, tam){ return '<svg class="twc-ico" width="' + (tam || 28) + '" height="' + (tam || 28) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[k] || P.estrela) + '</svg>'; }
  var COR = {run:'roxo', karaoke:'rosa', sora:'azul', duo:'noite', cafe:'cafe', handshake:'rosa2', bloom:'verde', studio:'ceu', battle:'uva', pet:'uva', gacha:'rosa',
             loja:'verde', perfil:'roxo', mapa:'ceu', news:'noite', album:'azul', todos:'lima', tv:'roxo', trio:'rosa'};
  // brilhinhos (posições fixas, decorativos)
  var BRILHO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5c.7 5.4 2.6 7.6 9 9-6.4 1.4-8.3 3.6-9 9-.7-5.4-2.6-7.6-9-9 6.4-1.4 8.3-3.6 9-9z"/></svg>';
  function brilhos(lista){ return lista.map(function(b, i){ return '<i class="twc-brilho twc-b' + (b[3] || 'w') + '" style="left:' + b[0] + '%;top:' + b[1] + '%;width:' + b[2] + 'px;height:' + b[2] + 'px;animation-delay:' + (i * .55).toFixed(2) + 's" aria-hidden="true">' + BRILHO + '</i>'; }).join(''); }

  /* ---------- ligação com o hub antigo ---------- */
  function $id(id){ return document.getElementById(id); }
  function card(k){ var c = $id('hubCards'); return c && (c.querySelector('[data-ir="' + k + '"]') || c.querySelector('[data-twnovo="' + k + '"]')); }
  function chaveDe(c){ return c.getAttribute('data-ir') || c.getAttribute('data-twnovo') || ''; }
  function alerta(c){ return !!(c && c.classList && (c.classList.contains('tw-alert-pink') || c.querySelector('.hubalerta:not([hidden])'))); }
  function titulo(c){ var b = c && c.querySelector('b'); return b ? b.textContent.trim() : ''; }
  function descricao(c){
    if(!c) return '';
    var s = [].slice.call(c.querySelectorAll('small')).filter(function(x){ return !x.hasAttribute('lang') && !x.classList.contains('tw-hubgame-jp') && !x.classList.contains('tw-karaoke-timer') && !x.classList.contains('tw-karaoke-ticket-count'); });
    return s.length ? s[s.length - 1].textContent.trim() : '';
  }
  // Mesma regra do clique dos cards no hub: estes pedem conta (Sora e Karaoke ficam livres se o teste sem login estiver ligado).
  // Bloom⭐Garden! e o Álbum também precisam de conta (o Bloom abre o login direto; o Álbum lê os cards da conta).
  var PEDE_LOGIN = {pet:1, gacha:1, loja:1, duo:1, sora:1, karaoke:1, bloom:1, album:1};
  // Estes abrem para visitante em TREINO (joga tudo, mas prêmio e ranking só com conta): selo "Treino" em vez de cadeado.
  var TREINO = {battle:1, cafe:1, handshake:1, studio:1};
  function emTreino(k){ return !logado() && !!TREINO[k]; }
  function seloTreino(k){ return emTreino(k) ? '<em class="twc-treino">' + esc(t2('treino')) + '</em>' : ''; }
  function precisaEntrar(k){
    if(logado() || !PEDE_LOGIN[k]) return false;
    return !(window.TW_JOGOS_SEM_LOGIN && (k === 'sora' || k === 'karaoke'));
  }
  function abrirCard(k){
    var c = card(k); if(!c) return;
    if(precisaEntrar(k)){ pedirLogin(titulo(c)); return; }
    c.click();   // o mesmo caminho do hub: sons, cadeados, prêmios e telas continuam iguais
  }
  // Star⭐Gacha! entrou na lista em 22/11: o banner dele saiu do Menu na poda e esta passou a ser a entrada principal
  var JOGOS = ['run', 'karaoke', 'sora', 'gacha', 'battle', 'duo', 'cafe', 'handshake', 'studio', 'bloom', 'pet'];
  function jogosNaTela(){ return JOGOS.filter(function(k){ return !!card(k); }); }

  /* ---------- estado ---------- */
  var cel, tela, nav, folha, pilha = ['inicio'], classico = false, sairPend = 0, ultimaTela = '';
  function topo(){ return pilha[pilha.length - 1]; }
  function rankNome(){ try{ return (typeof RANKS !== 'undefined' && typeof rankOf === 'function') ? tt(RANKS[rankOf(+best || 0)][1]) : ''; }catch(e){ return ''; } }   // "Audição" → "Audition"...
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
      (window.TW_CONQ && logado() && TW_CONQ.novidade() ? '<i class="twc-eu-ponto" aria-hidden="true"></i>' : '') + '<span class="twc-eu-txt">' + (rankNome() ? '<small class="twc-lv">' + esc(rankNome()) + '</small>' : '') + '<b>' + esc(nick()) + '</b></span></button>' +
      '<span class="twc-st"><span class="twc-st-ico" aria-hidden="true">' + ico('estrela', 20) + '</span><b id="twcEstrelas">' + esc(estrelas()) + '</b>' +
      '<button type="button" class="twc-st-mais" data-ir="loja" aria-label="' + esc(t('estrelas')) + '">' + ico('mais', 16) + '</button></span>' +
      '<button type="button" class="twc-cfg" data-v="ajustes" aria-label="' + esc(t('ajustes')) + '">' + ico('ajustes', 22) + '</button>' +
      '</div><div class="twc-arco" aria-hidden="true"></div></div>';
  }
  function faixa(tit, sub, chip){
    return '<div class="twc-faixa"><span><h1>' + tit + '</h1><small>' + esc(sub) + '</small></span>' + (chip ? '<em>' + esc(chip) + '</em>' : '') +
      brilhos([[52, 18, 12], [66, 62, 9, 'l'], [80, 22, 10, 'r']]) + '</div>';
  }
  function badge(c){ return (c === true || alerta(c)) ? '<em class="twc-dot" aria-hidden="true">!</em>' : ''; }   // c: card do hub ou true (ex.: missão pendente)
  function cadeado(k){ return precisaEntrar(k) ? '<em class="twc-cad" aria-hidden="true">' + ico('cadeado', 13) + '</em><span class="twc-sr"> (' + esc(t2('legCad')) + ')</span>' : ''; }
  function app(k, nome, attrs, c){
    return '<button type="button" class="twc-app" ' + attrs + '><span class="twc-app-ico twc-g-' + (COR[k] || 'roxo') + '">' + ico(k, 30) + badge(c) + cadeado(k) + '</span><span class="twc-app-nome" translate="no">' + esc(nome) + '</span>' + seloTreino(k) + '</button>';
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
    var v = null; try{ v = typeof window.twMapaVisitaAgora === 'function' ? window.twMapaVisitaAgora() : null; }catch(e){ v = null; }
    return '<section class="twc-palco">' + brilhos([[6, 8, 14], [90, 6, 12, 'l'], [94, 40, 10, 'r'], [4, 46, 9, 'l']]) +
      '<h1 class="hublogo twc-hublogo" translate="no" aria-label="TsuLiPa World">' + (logo ? logo.innerHTML : 'TsuLiPa⭐World') + '</h1>' +
      (tema && !tema.hidden && tema.textContent ? '<p class="twc-tema">' + esc(tema.textContent) + '</p>' : '') +
      '<div class="twc-palco-moldura"><canvas id="twcPalcoCv" width="640" height="340" role="img" aria-label="' + esc(rot) + '"></canvas>' +
      '<button type="button" class="twc-fichas-chip" data-v="trio"><span class="twc-fichas-rostos" aria-hidden="true">' +
        [0, 1, 2].map(function(k){ return '<canvas data-membro="' + k + '" width="64" height="64" style="--fc:' + FICHAS[k].cor[0] + '"></canvas>'; }).join('') +
        '</span><span>' + esc(tf('fichas')) + '</span></button>' +
      // quem passeia no mapa agora vira um selinho no canto do palco (com a bolinha do membro)
      '<button type="button" class="twc-selo" data-a="mapa">' + (v ? '<canvas class="twc-bola-mini" data-membro="' + v.k + '" width="64" height="64" aria-hidden="true"></canvas>' : '<i class="twc-vivo" aria-hidden="true"></i>') +
      '<span id="twcVisita">' + esc(visita()) + '</span>' + ico('seta', 16) + '</button></div></section>';
  }
  // O palco do Início é desenhado direto pelo hubLoop (hub.js) através de twcPalcoAlvo(): uma cena por quadro.
  // (Até 17/11 o hubCv era desenhado e copiado aqui a cada quadro, o que dobrava o trabalho e travava o Início.)
  // Devolve: o canvas do palco quando ele está visível; false = visual novo ligado mas palco fora da tela (não desenhar);
  // null = visual clássico (o hub desenha no hubCv, como sempre).
  var palcoVis = {t:0, v:false, el:null};
  window.twcPalcoAlvo = function(){
    if(!cel || classico) return null;
    var dst = $id('twcPalcoCv'), h = $id('hub');
    if(!dst || !dst.isConnected || !h || h.hidden || document.hidden) return false;
    var agora = Date.now();
    if(palcoVis.el !== dst || agora - palcoVis.t > 400){
      palcoVis.el = dst; palcoVis.t = agora;
      try{ palcoVis.v = window.TWMotionLifecycle ? window.TWMotionLifecycle.isVisible(dst) : !!dst.offsetParent; }catch(e){ palcoVis.v = !!dst.offsetParent; }
    }
    if(!palcoVis.v) return false;
    var src = $id('hubCv');
    if(src && (dst.width !== src.width || dst.height !== src.height)){ dst.width = src.width; dst.height = src.height; }
    palcoFreio(dst);
    return dst;
  };
  // Freio do palco (17/11), igual ao do Center⭐Run (centerrun-corrida.js): o palco deveria trocar de quadro a cada ~33 ms;
  // se a mediana passar de 45 ms, o aparelho não está aguentando → menos pixels no palco (2× → 1,5× → 1×), e o aparelho
  // guarda o nível (tw_palco_nitidez) para o próximo Início já abrir leve. Aparelho que aguenta não perde nitidez.
  var palcoDes = {el:null, ult:0, ms:[], teto:0};
  function palcoFreio(dst){
    var N = window.TW_NITIDEZ; if(!N || !N.limitar || N.desligada) return;
    if(!palcoDes.teto){ var sv = 0; try{ sv = +localStorage.getItem('tw_palco_nitidez') || 0; }catch(e){} palcoDes.teto = sv || 9; }
    if(palcoDes.el !== dst){ palcoDes.el = dst; palcoDes.ult = 0; palcoDes.ms = []; if(palcoDes.teto < 9) N.limitar(dst, palcoDes.teto); }
    if(palcoDes.teto <= 1) return;
    var agora = performance.now(), d = palcoDes.ult ? agora - palcoDes.ult : 0; palcoDes.ult = agora;
    if(d <= 0 || d > 400) return;                     // pausa, troca de tela ou aba escondida: não conta
    palcoDes.ms.push(d); if(palcoDes.ms.length < 75) return;
    var o = palcoDes.ms.slice().sort(function(a, b){ return a - b; }), med = o[o.length >> 1]; palcoDes.ms = [];
    if(med <= 45) return;
    var k = N.escala(dst), novo = k > 1.5 ? 1.5 : 1; if(k <= 1) return;
    palcoDes.teto = novo; N.limitar(dst, novo); try{ localStorage.setItem('tw_palco_nitidez', String(novo)); }catch(e){}
  }
  var palcoRaf = 0;
  function palcoQuadro(){   // primeiro quadro logo que o Início é montado (sem esperar o próximo passo do hubLoop)
    palcoRaf = 0;
    var dst = $id('twcPalcoCv'); if(!dst || classico || typeof hubDesenhar !== 'function') return;
    palcoVis.t = 0;
    // sempre um primeiro desenho, mesmo com uma janela por cima: o palco novo nunca fica em branco nem na resolução errada
    var src = $id('hubCv'); if(src && (dst.width !== src.width || dst.height !== src.height)){ dst.width = src.width; dst.height = src.height; }
    try{ palcoFreio(dst); hubDesenhar(dst); }catch(e){}
  }
  function palcoLigar(){ if(!palcoRaf) palcoRaf = requestAnimationFrame(palcoQuadro); }
  function palcoToque(e){   // repassa o toque para o canvas do hub, no mesmo ponto proporcional
    var dst = e.currentTarget, src = $id('hubCv'); if(!src) return;
    var a = dst.getBoundingClientRect(), b = src.getBoundingClientRect(); if(!a.width || !b.width) return;
    var fx = (e.clientX - a.left) / a.width, fy = (e.clientY - a.top) / a.height;
    src.dispatchEvent(new MouseEvent('click', {bubbles:true, cancelable:true, clientX:b.left + fx * b.width, clientY:b.top + fy * b.height}));
  }

  /* ---------- bolinhas do Tsu, da Lirika e do Pati (desenhadas pelo próprio jogo, como as do Link! Like!) ---------- */
  var MEMBROS = [['tsu', 'Tsu', '#9b30d9'], ['lirika', 'Lirika', '#3cb043'], ['pati', 'Pati', '#4169e1']];
  function membroAv(k){
    if(typeof HUB_TRIO === 'undefined' || typeof HUB_TRIO_DRAW_CHARS === 'undefined' || typeof CH === 'undefined' || !HUB_TRIO[k]) return null;
    var m = HUB_TRIO[k], c = JSON.parse(JSON.stringify(HUB_TRIO_DRAW_CHARS[k])), base = CH[m[0]];
    if(base){ c.out = base.out; c.outcol = base.outcol; }
    return {c:c, pose:'', expr:m[4], fundo:'basico'};
  }
  function bolinhas(){
    [].slice.call(cel.querySelectorAll('canvas[data-membro]')).forEach(function(cv){
      var av = membroAv(+cv.getAttribute('data-membro'));
      try{ if(av && typeof perfFotoRedonda === 'function') perfFotoRedonda(cv, av, true); }catch(e){}
    });
  }

  /* ---------- vitrine de Idols (quem joga), só rosto e nome; tocar abre o perfil (o mesmo .lbn do site) ---------- */
  var idolsPedido = 0;
  function idols(){
    var L = (typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols)) ? hubIdolsDados.idols.filter(function(p){ return p && p.nick && p.avatar; }) : null;
    if(!L){   // pede a vitrine no máximo uma vez por minuto (sem isso, cada redesenho pedia de novo)
      if(typeof hubIdolsCarregar === 'function' && Date.now() - idolsPedido > 60e3){ idolsPedido = Date.now(); try{ hubIdolsCarregar(); }catch(e){} }
      return '';
    }
    if(!L.length) return '';
    return '<section class="twc-idols" aria-labelledby="twcIdolsT"><h2 id="twcIdolsT">' + esc(t('idols')) + '</h2><span class="twc-online" data-twc-online hidden></span><div class="twc-idols-fila">' + L.slice(0, 20).map(function(p, i){
      return '<button type="button" class="lbn twc-idol-b" data-nick="' + esc(p.nick) + '"><canvas data-idol="' + i + '" width="96" height="96" aria-hidden="true"></canvas><span translate="no">' + esc(p.nick) + '</span></button>';
    }).join('') + '</div></section>';
  }
  function idolsDesenhar(){
    var L = (typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols)) ? hubIdolsDados.idols.filter(function(p){ return p && p.nick && p.avatar; }) : [];
    [].slice.call(cel.querySelectorAll('canvas[data-idol]')).forEach(function(cv){ var p = L[+cv.getAttribute('data-idol')]; try{ if(p && typeof perfFotoRedonda === 'function') perfFotoRedonda(cv, p.avatar, true); }catch(e){} });
  }

  /* ---------- Início: palco, um destaque e os apps ---------- */
  function pendencias(){ return [].slice.call(document.querySelectorAll('#hubCards .hubcard')).filter(alerta); }
  /* ---------- Tela inicial limpa (pedido do Pati): o palco e poucas "portas" grandes; cada porta abre o seu cantinho ---------- */
  var TP = {
    jogosSub:{pt:'Todos os jogos',en:'All games',es:'Todos los juegos',id:'Semua game',th:'เกมทั้งหมด',ja:'ぜんぶのゲーム'},
    misPorta:{pt:'Missões',en:'Missions',es:'Misiones',id:'Misi',th:'ภารกิจ',ja:'ミッション'},
    misSub:{pt:'Do dia, fãs e Teams',en:'Daily, fans and Teams',es:'Del día, fans y Teams',id:'Harian, fans, dan Teams',th:'รายวัน แฟน และทีม',ja:'デイリー・ファン・チーム'},
    mapaSub:{pt:'Passeie e diga oi',en:'Stroll and say hi',es:'Pasea y saluda',id:'Jalan-jalan dan menyapa',th:'เดินเล่นและทักทาย',ja:'おさんぽしてあいさつ'},
    newsSub:{pt:'Fotos, quadrinhos e Top',en:'Photos, comics and Top',es:'Fotos, cómics y Top',id:'Foto, komik, dan Top',th:'รูป การ์ตูน และท็อป',ja:'写真・マンガ・ランキング'},
    camarim:{pt:'Camarim',en:'Dressing room',es:'Camerino',id:'Ruang ganti',th:'ห้องแต่งตัว',ja:'楽屋'},
    camarimSub:{pt:'Seu pet e a decoração',en:'Your pet and decor',es:'Tu mascota y la decoración',id:'Hewan dan dekorasi',th:'สัตว์เลี้ยงและการตกแต่ง',ja:'ペットとインテリア'},
    folhaMis:{pt:'O que você quer fazer?',en:'What do you want to do?',es:'¿Qué quieres hacer?',id:'Mau ngapain?',th:'อยากทำอะไร?',ja:'なにをする？'},
    misDia:{pt:'Missões do dia',en:'Daily missions',es:'Misiones del día',id:'Misi harian',th:'ภารกิจประจำวัน',ja:'デイリーミッション'},
    misDiaSub:{pt:'Ganhe estrelas hoje',en:'Earn stars today',es:'Gana estrellas hoy',id:'Dapat bintang hari ini',th:'รับดาวได้วันนี้',ja:'今日スターをもらおう'},
    fa:{pt:'Pedido de fã',en:'Fan request',es:'Pedido de fan',id:'Permintaan fans',th:'คำขอจากแฟน',ja:'ファンのおねがい'},
    faSub:{pt:'Um fã pediu algo pra você',en:'A fan asked you for something',es:'Un fan te pidió algo',id:'Ada fans yang minta sesuatu',th:'แฟนขออะไรบางอย่าง',ja:'ファンからのおねがい'},
    meta:{pt:'Meta dos Teams',en:'Teams goal',es:'Meta de los Teams',id:'Target Teams',th:'เป้าหมายทีม',ja:'チーム目標'},
    metaSub:{pt:'Jogue junto com o seu Team',en:'Play together with your Team',es:'Juega junto con tu Team',id:'Main bareng Team-mu',th:'เล่นร่วมกับทีมของคุณ',ja:'チームといっしょにプレイ'}
  };
  function tp(k){ var d = TP[k]; return d ? (d[L()] || d.pt) : k; }
  function porta(k, ico2, tit, sub, attrs, cor, c){
    return '<button type="button" class="twc-porta twc-porta-' + k + '" ' + attrs + '><span class="twc-porta-ico twc-g-' + cor + '">' + ico(ico2, 34) + badge(c) + '</span>' +
      '<span class="twc-porta-txt"><b>' + esc(tit) + '</b><small>' + esc(sub) + '</small></span></button>';   // 22/11: sem o brilhinho no canto (no PC parecia sujeira na tela)
  }
  function portas(){
    var mis = (logado() && typeof hubMisDados !== 'undefined' && Array.isArray(hubMisDados)) ? hubMisDados : null;
    var feitas = mis ? mis.filter(function(m){ return m.feito; }).length : 0;
    var C = window.TW_CAL, dn = C ? C.diaN(C.hoje()) : 0, pet = card('pet');
    var nj = 0; try{ nj = jogosNaTela().length; }catch(e){}
    return '<section class="twc-portas" aria-label="' + esc(t('menu')) + '">' +
      porta('jogos', 'run', t('jogos'), nj ? nj + ' · ' + tp('jogosSub') : tp('jogosSub'), 'data-v="jogos"', 'rosa') +
      porta('missoes', 'missoes', tp('misPorta'), mis && mis.length ? feitas + '/' + mis.length + ' · ' + tp('misSub') : tp('misSub'), 'data-a="portaMis"', 'lima', !!(mis && feitas < mis.length)) +
      porta('mapa', 'mapa', t('mapa'), tp('mapaSub'), 'data-a="mapa"', 'azul') +
      porta('news', 'news', 'Idol⭐News!', tp('newsSub'), 'data-a="news"', 'roxo') +
      porta('camarim', 'pata', tp('camarim'), tp('camarimSub'), 'data-ir="pet"', 'rosa', pet) +
      porta('cal', 'cal', tc('cal'), dn >= 1 ? tc('diaN', dn) : tc('calSub'), 'data-v="cal"', 'sol') + '</section>';
  }
  function folhaMissoes(){
    folha.innerHTML = '<div class="twc-folha-caixa twc-folha-portas" role="dialog" aria-modal="true" aria-labelledby="twcMisT"><span class="twc-folha-ico twc-g-lima">' + ico('missoes', 28) + '</span>' +
      '<h2 id="twcMisT">' + esc(tp('folhaMis')) + '</h2>' +
      [['misDia', 'missoes', 'lima', 'misDia'], ['fa', 'coracao', 'rosa', 'fa'], ['meta', 'trio', 'azul', 'meta']].map(function(o){
        return '<button type="button" class="twc-folha-op" data-f="' + o[3] + '"><span class="twc-linha-ico twc-g-' + o[2] + '">' + ico(o[1], 20) + '</span><span><b>' + esc(tp(o[0])) + '</b><small>' + esc(tp(o[0] + 'Sub')) + '</small></span>' + ico('seta', 16) + '</button>';
      }).join('') + '<button type="button" class="twc-btn twc-btn-claro" data-f="fechar">' + esc(t('agoraNao')) + '</button></div>';
    folha.hidden = false;
  }

  /* ---------- Hoje: uma lista só, com progresso (desejo → Camarim VIP, missões, capítulo de domingo, aniversário) ---------- */
  var THJ = {
    tit:{pt:'Hoje',en:'Today',es:'Hoy',id:'Hari ini',th:'วันนี้',ja:'きょう'},
    vip:{pt:'Prêmio: Camarim VIP',en:'Reward: VIP Dressing Room',es:'Premio: Camerino VIP',id:'Hadiah: Ruang Rias VIP',th:'รางวัล: ห้องแต่งตัว VIP',ja:'ごほうび：VIP楽屋'},
    vipOk:{pt:'Camarim VIP liberado!',en:'VIP Dressing Room unlocked!',es:'¡Camerino VIP liberado!',id:'Ruang Rias VIP terbuka!',th:'ปลดล็อกห้องแต่งตัว VIP แล้ว!',ja:'VIP楽屋オープン！'},
    entrar:{pt:'Entrar',en:'Go in',es:'Entrar',id:'Masuk',th:'เข้าไป',ja:'入る'},
    mis:{pt:'Missões do dia',en:'Daily missions',es:'Misiones del día',id:'Misi harian',th:'ภารกิจประจำวัน',ja:'デイリーミッション'},
    misOk:{pt:'Todas cumpridas!',en:'All done!',es:'¡Todas cumplidas!',id:'Semua selesai!',th:'ทำครบแล้ว!',ja:'ぜんぶクリア！'},
    misFalta:{pt:'{f} de {n} cumpridas',en:'{f} of {n} done',es:'{f} de {n} cumplidas',id:'{f} dari {n} selesai',th:'ทำแล้ว {f} จาก {n}',ja:'{n}こ中{f}こクリア'},
    ver:{pt:'Ver',en:'See',es:'Ver',id:'Lihat',th:'ดู',ja:'見る'},
    ler:{pt:'Ler',en:'Read',es:'Leer',id:'Baca',th:'อ่าน',ja:'読む'},
    cap:{pt:'Capítulo {n} do quadrinho',en:'Comic chapter {n}',es:'Capítulo {n} del cómic',id:'Bab {n} komik',th:'การ์ตูนตอนที่ {n}',ja:'マンガ第{n}話'},
    capNovo:{pt:'Novo no Idol⭐News!',en:'New in Idol⭐News!',es:'¡Nuevo en Idol⭐News!',id:'Baru di Idol⭐News!',th:'ใหม่ใน Idol⭐News!',ja:'Idol⭐News!に新着！'},
    capLido:{pt:'Lido ✓',en:'Read ✓',es:'Leído ✓',id:'Sudah dibaca ✓',th:'อ่านแล้ว ✓',ja:'読んだ ✓'},
    aniv:{pt:'Aniversário de {p}!',en:"It's {p}'s birthday!",es:'¡Cumpleaños de {p}!',id:'Ulang tahun {p}!',th:'วันเกิดของ {p}!',ja:'{p}のおたんじょうび！'},
    anivSub:{pt:'Mande um coração ou deixe um recado no perfil',en:'Send a heart or leave a note on the profile',es:'Manda un corazón o deja un mensaje en el perfil',id:'Kirim hati atau tinggalkan pesan di profil',th:'ส่งหัวใจหรือฝากข้อความในโปรไฟล์',ja:'ハートを送るか、プロフィールにメッセージを残そう'},
    anivEu:{pt:'Feliz aniversário, {p}! 🎂',en:'Happy birthday, {p}! 🎂',es:'¡Feliz cumpleaños, {p}! 🎂',id:'Selamat ulang tahun, {p}! 🎂',th:'สุขสันต์วันเกิด {p}! 🎂',ja:'おたんじょうびおめでとう、{p}！🎂'},
    anivEuSub:{pt:'O TsuLiPa⭐World inteiro está comemorando com você',en:'All of TsuLiPa⭐World is celebrating with you',es:'Todo TsuLiPa⭐World celebra contigo',id:'Seluruh TsuLiPa⭐World merayakan bersamamu',th:'ทั้ง TsuLiPa⭐World ฉลองไปกับคุณ',ja:'TsuLiPa⭐Worldのみんながおいわいしてるよ'},
    coracao:{pt:'♡ Coração',en:'♡ Heart',es:'♡ Corazón',id:'♡ Hati',th:'♡ หัวใจ',ja:'♡ ハート'},
    deu:{pt:'Coração enviado!',en:'Heart sent!',es:'¡Corazón enviado!',id:'Hati terkirim!',th:'ส่งหัวใจแล้ว!',ja:'ハートを送ったよ！'},
    perfil:{pt:'Perfil',en:'Profile',es:'Perfil',id:'Profil',th:'โปรไฟล์',ja:'プロフ'},
    trio:{pt:'Fichinha',en:'Profile card',es:'Fichita',id:'Kartu profil',th:'การ์ดโปรไฟล์',ja:'プロフィール'},
    maisAniv1:{pt:'+1 aniversário hoje',en:'+1 more birthday today',es:'+1 cumpleaños más hoy',id:'+1 ulang tahun lagi hari ini',th:'+1 วันเกิดวันนี้',ja:'きょうの誕生日 +1'},
    maisAniv:{pt:'+{n} aniversários hoje',en:'+{n} more birthdays today',es:'+{n} cumpleaños más hoy',id:'+{n} ulang tahun lagi hari ini',th:'+{n} วันเกิดวันนี้',ja:'きょうの誕生日 +{n}'},
    verLista:{pt:'Ver lista',en:'See list',es:'Ver lista',id:'Lihat daftar',th:'ดูรายการ',ja:'リストを見る'},
    verTudo:{pt:'Ver tudo (+{n})',en:'See all (+{n})',es:'Ver todo (+{n})',id:'Lihat semua (+{n})',th:'ดูทั้งหมด (+{n})',ja:'ぜんぶ見る（+{n}）'},
    recolher:{pt:'Recolher',en:'Collapse',es:'Recoger',id:'Tutup',th:'ย่อ',ja:'とじる'},
    tudo:{pt:'Tudo feito por hoje! ✨',en:'All done for today! ✨',es:'¡Todo listo por hoy! ✨',id:'Semua beres hari ini! ✨',th:'วันนี้ทำครบแล้ว! ✨',ja:'きょうはぜんぶできた！✨'},
    enc:{pt:'Encontro do dia',en:'Daily meetup',es:'Encuentro del día',id:'Temu hari ini',th:'นัดพบวันนี้',ja:'今日の出会い'},
    encSub:{pt:'Quem vai aparecer hoje? Vale ★3.',en:'Who will show up today? Worth ★3.',es:'¿Quién aparecerá hoy? Vale ★3.',id:'Siapa yang muncul hari ini? Dapat ★3.',th:'วันนี้ใครจะมา? ได้ ★3',ja:'今日は誰に会える？★3'},
    encOk:{pt:'Hoje: {n}',en:'Today: {n}',es:'Hoy: {n}',id:'Hari ini: {n}',th:'วันนี้: {n}',ja:'今日：{n}'},
    encBt:{pt:'Descobrir',en:'Find out',es:'Descubrir',id:'Lihat',th:'ดูเลย',ja:'見る'},
    rival:{pt:'Rival do dia no Idol⭐Battle!',en:'Rival of the day in Idol⭐Battle!',es:'Rival del día en Idol⭐Battle!',id:'Rival hari ini di Idol⭐Battle!',th:'คู่แข่งประจำวันใน Idol⭐Battle!',ja:'Idol⭐Battle!の今日のライバル'},
    vitSemana:{pt:'🏆 {n} vitória(s) nesta semana',en:'🏆 {n} win(s) this week',es:'🏆 {n} victoria(s) esta semana',id:'🏆 {n} kemenangan minggu ini',th:'🏆 ชนะ {n} ครั้งในสัปดาห์นี้',ja:'🏆 今週{n}勝'},
    rivalSub:{pt:'Vença a unit rival: ★5, e o primeiro Battle do dia vale mais ★15.',en:'Beat the rival unit: ★5, plus ★15 for your first Battle of the day.',es:'Vence a la unit rival: ★5, y la primera Battle del día vale ★15 más.',id:'Kalahkan unit rival: ★5, plus ★15 untuk Battle pertama hari ini.',th:'ชนะยูนิตคู่แข่ง: ★5 และแบตเทิลแรกของวันได้อีก ★15',ja:'ライバルユニットに勝って★5、今日最初のBattleで+★15'},
    rivalOk:{pt:'Rival vencido hoje!',en:'Rival beaten today!',es:'¡Rival vencido hoy!',id:'Rival dikalahkan hari ini!',th:'ชนะคู่แข่งวันนี้แล้ว!',ja:'今日のライバルに勝利！'},
    jogar:{pt:'Jogar',en:'Play',es:'Jugar',id:'Main',th:'เล่น',ja:'遊ぶ'},
    seq:{pt:'🔥 {n} dias seguidos',en:'🔥 {n}-day streak',es:'🔥 {n} días seguidos',id:'🔥 {n} hari berturut-turut',th:'🔥 ต่อเนื่อง {n} วัน',ja:'🔥 {n}日連続'},
    seqProx:{pt:' · {n} dias = prêmio',en:' · {n} days = prize',es:' · {n} días = premio',id:' · {n} hari = hadiah',th:' · {n} วัน = รางวัล',ja:' · {n}日でごほうび'},
    tambem:{pt:'Também hoje',en:'Also today',es:'También hoy',id:'Juga hari ini',th:'วันนี้ยังมี',ja:'ほかにも'},
    erro:{pt:'Não deu agora. Tente de novo!',en:"Couldn't do it now. Try again!",es:'No se pudo ahora. ¡Inténtalo de nuevo!',id:'Belum bisa sekarang. Coba lagi!',th:'ตอนนี้ยังไม่ได้ ลองใหม่นะ!',ja:'いまはできなかった。もう一度ためしてね！'}
  };
  function thj(k, o){ var d = THJ[k], s2 = d ? (d[L()] || d.pt) : k; if(o) for(var q in o) s2 = s2.split('{' + q + '}').join(o[q]); return s2; }
  var CAPS_INICIO = Date.UTC(2026, 10, 15);   // quadrinhos: um por domingo desde 15/11 (o mesmo de jornal-capitulos.js)
  function capHoje(){   // {n, data} do capítulo mais recente já liberado (horário de Brasília), ou null
    var C = window.TW_CAL, h = C ? C.hoje() : new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10), r = null;
    for(var i = 0; i < 6; i++){ var d = new Date(CAPS_INICIO + i * 7 * 864e5).toISOString().slice(0, 10); if(d <= h) r = {n:i + 1, data:d}; }
    return r;
  }
  function capLidos(){
    try{
      var lidos=JSON.parse(localStorage.getItem('tw_cap_lidos_v2'));
      if(Array.isArray(lidos))return lidos;
      var legado=Math.min(6,Number(localStorage.getItem('tw_cap_lido'))||0);
      return [1,2,3,4,5,6].filter(function(n){return n<=legado;});
    }catch(e){ return []; }
  }
  window.twCapRegistrar=function(n){
    var c=capHoje(), lidos=capLidos();
    if(!c || !Number.isInteger(n) || n<1 || n>c.n || lidos.includes(n))return;
    try{localStorage.setItem('tw_cap_lidos_v2',JSON.stringify(lidos.concat(n)));}catch(e){}
    if(topo()==='inicio')desenhar();
  };
  function anivDados(){ try{ var o = JSON.parse(localStorage.getItem('tw_aniv_cor') || 'null'), h = window.TW_CAL ? window.TW_CAL.hoje() : ''; return o && o.dia === h ? o : {dia:h, nicks:[]}; }catch(e){ return {dia:'', nicks:[]}; } }
  function anivDei(nick){ return anivDados().nicks.indexOf(String(nick).toLowerCase()) >= 0; }
  function anivGuardar(nick){ var o = anivDados(); if(o.nicks.indexOf(nick.toLowerCase()) < 0) o.nicks.push(nick.toLowerCase()); try{ localStorage.setItem('tw_aniv_cor', JSON.stringify(o)); }catch(e){} }
  function anivCoracao(nick, b){
    if(!logado()){ pedirLogin(thj('coracao')); return; }
    b.disabled = true;
    contaRpc('dar_coracao', {p_nick:nick}).then(function(r){
      if(r && (r.ok || r.ok === false && !r.erro)){ anivGuardar(nick); som(); carinho(); toast(thj('deu'), 'coracao'); if(window.TW_HUMOR) try{ window.TW_HUMOR.evento('coracao'); }catch(e){} desenhar(); }
      else if(r && r.erro === 'proprio'){ anivGuardar(nick); desenhar(); }
      else { b.disabled = false; toast(thj('erro')); }
    }).catch(function(){ b.disabled = false; toast(thj('erro')); });
  }
  var hojeAberto = false, hojeAnivTodos = false;
  function hojeHtml(){
    var itens = [], feitos = 0, H = window.TW_HUMOR, C = window.TW_CAL;
    function linha(ok, cor, icone, tit, sub, botao, extra){
      itens.push('<div class="twc-hj-it' + (ok ? ' twc-hj-ok' : '') + '"><span class="twc-hj-ico twc-g-' + cor + '" aria-hidden="true">' + ico(ok ? 'check' : icone, 18) + '</span>' +
        '<span class="twc-hj-txt"><b>' + tit + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + (extra || '') + '</span>' + (botao || '') + '</div>');
      if(ok) feitos++;
    }
    // 1. desejo do dia → Camarim VIP
    if(H){ var d = H.desejo(), vip = H.vipHoje();
      linha(d.feito, COR[desejoIco(d.ev)] || 'rosa', desejoIco(d.ev), esc(H.t('desejo')), esc(d.texto),
        d.feito ? '' : '<button type="button" class="twc-hj-bt" data-desejo="' + esc(d.ev) + '">' + esc(H.rotuloRota(d.ev)) + '</button>',
        '<button type="button" class="twc-hj-vip' + (vip ? ' twc-hj-vip-on' : '') + '" data-a="vip">' + ico(vip ? 'coroa' : 'cadeado', 13) + '<span>' + esc(vip ? thj('vipOk') : thj('vip')) + '</span>' + (vip ? '<em>' + esc(thj('entrar')) + '</em>' : '') + '</button>'); }
    var festival = '';
    if(typeof jornalFestivalPrazo === 'function' && typeof hubMusicaSemana === 'function'){
      festival = '<div class="twc-hj-it"><span class="twc-hj-ico twc-g-roxo" aria-hidden="true">' + ico('karaoke', 18) + '</span>' +
        '<span class="twc-hj-txt"><b>' + esc(tt('Festival de Unidades')) + '</b><small>' +
        esc(hubMusicaSemana()[1] + ' · ' + jornalFestivalPrazo()) + '</small></span>' +
        '<button type="button" class="twc-hj-bt" data-a="festival">' + esc(jornalFestivalTexto(0)) + '</button></div>';
    }
    var proxima = window.TW_PILOTO_BAIRRO && TW_PILOTO_BAIRRO.continuacao();
    var continuar = proxima ? '<div class="twc-hj-it"><span class="twc-hj-ico twc-g-uva" aria-hidden="true">' + ico('pin',18) +
      '</span><span class="twc-hj-txt"><b>' + esc(proxima.titulo) + '</b><small>' + esc(proxima.sub) +
      '</small></span><button type="button" class="twc-hj-bt" data-piloto-bairro="continuar">' + esc(tt('Continuar')) + '</button></div>' : '';
    // 2. missões do dia (com conta)
    var mis = (logado() && typeof hubMisDados !== 'undefined' && Array.isArray(hubMisDados)) ? hubMisDados : null;
    if(mis && mis.length){ var mf = mis.filter(function(m){ return m.feito; }).length, ok2 = mf >= mis.length;
      // sequência: dias seguidos com 3+ missões (tw-estreia.js → missoes_sequencia)
      var sq = window.TW_ESTREIA && TW_ESTREIA.sequencia ? TW_ESTREIA.sequencia() : null;
      var fogo = sq && sq.dias > 0 ? '<span class="twc-hj-fogo">' + esc(thj('seq', {n:sq.dias}) + (sq.proximo ? thj('seqProx', {n:sq.proximo}) : '')) + '</span>' : '';
      linha(ok2, 'lima', 'missoes', esc(thj('mis')), esc(ok2 ? thj('misOk') : thj('misFalta', {f:mf, n:mis.length})), ok2 ? '' : '<button type="button" class="twc-hj-bt" data-a="missoes">' + esc(thj('ver')) + '</button>', fogo); }
    // Encontro do dia (o botão antigo ficou só no hub clássico e no mapa: desde 09/11 ninguém achava)
    if(typeof encLer === 'function' && typeof encBtn !== 'undefined'){ var ef = encLer();
      linha(!!ef, 'rosa', 'coracao', esc(thj('enc')), esc(ef ? thj('encOk', {n:typeof encNomes === 'function' ? encNomes(ef) : ef.nick}) : thj('encSub')),
        ef ? '' : '<button type="button" class="twc-hj-bt" data-a="encontro">' + esc(thj('encBt')) + '</button>'); }
    // Passatempos do dia (tw-passatempos.js): caça-palavras, 5 diferenças e labirinto, ★5 cada
    if(window.TW_PASSA){ var pf = TW_PASSA.feitos().length;
      linha(pf >= 3, 'ceu', 'estrela', esc(TW_PASSA.t('tit')), esc(pf >= 3 ? TW_PASSA.t('subOk') : TW_PASSA.t('sub', {f:pf, p:5})),
        pf >= 3 ? '' : '<button type="button" class="twc-hj-bt" data-twpa="abrir">' + esc(TW_PASSA.t('jogar')) + '</button>'); }
    // Rival do dia do Idol⭐Battle! (battle_status, carregado pelo tw-estreia.js)
    var rv = window.TW_ESTREIA && TW_ESTREIA.rival ? TW_ESTREIA.rival() : null;
    if(rv && typeof window.battleAbrir === 'function')
      linha(rv.premiado, 'uva', 'trofeu', esc(thj('rival')), esc(rv.premiado ? thj('rivalOk') : thj('rivalSub')), rv.premiado ? '' : '<button type="button" class="twc-hj-bt" data-a="battle-rival">' + esc(thj('jogar')) + '</button>',
        (function(){ var sm = window.TW_COMUNIDADE && TW_COMUNIDADE.semana ? TW_COMUNIDADE.semana() : null; return sm && +sm.battle > 0 ? '<span class="twc-hj-fogo">' + esc(thj('vitSemana', {n:+sm.battle})) + '</span>' : ''; })());   // vitórias da semana (meu_recorde_semana)
    // 3. capítulo do domingo (aparece na semana em que saiu)
    var cp = capHoje(), hj = C ? C.hoje() : '';
    if(cp && hj && (Date.parse(hj) - Date.parse(cp.data)) / 864e5 < 7){ var lido = capLidos().includes(cp.n);
      linha(lido, 'roxo', 'news', esc(thj('cap', {n:cp.n})), esc(lido ? thj('capLido') : thj('capNovo')), lido ? '' : '<button type="button" class="twc-hj-bt" data-a="ler-capitulo">' + esc(thj('ler')) + '</button>'); }
    // 4. aniversários do dia: jogadores (coração + perfil) e o trio (fichinha)
    if(C){ calAniversarios(); var mk = C.marcas(hj), eu = logado() ? String(contaJ.nick || '').toLowerCase() : '';
      mk.forEach(function(m){
        if(m.k === 'anivJog') (m.quem || []).filter(function(nk, i){ return hojeAnivTodos || i === 0 || nk.toLowerCase() === eu; }).forEach(function(nk){
          if(nk.toLowerCase() === eu){ linha(true, 'sol', 'bolo', esc(thj('anivEu', {p:nk})), esc(thj('anivEuSub'))); return; }
          var dei = anivDei(nk);
          linha(dei, 'sol', 'bolo', esc(thj('aniv', {p:nk})), esc(dei ? thj('deu') : thj('anivSub')),
            '<span class="twc-hj-bts">' + (dei ? '' : '<button type="button" class="twc-hj-bt" data-anivcor="' + esc(nk) + '">' + esc(thj('coracao')) + '</button>') +
            '<button type="button" class="twc-hj-bt twc-hj-bt-claro lbn" data-nick="' + esc(nk) + '">' + esc(thj('perfil')) + '</button></span>');
        });
        var resto = m.k === 'anivJog' && !hojeAnivTodos ? (m.quem || []).length - 1 - ((m.quem || []).slice(1).some(function(nk){ return nk.toLowerCase() === eu; }) ? 1 : 0) : 0;
        if(resto > 0) itens.push('<button type="button" class="twc-hj-mais twc-hj-aniv-mais" data-hjaniv="1"><span class="twc-hj-ico twc-g-sol" aria-hidden="true">' + ico('bolo', 16) + '</span><b>' + esc(resto === 1 ? thj('maisAniv1') : thj('maisAniv', {n:resto})) + '</b>' + ico('seta', 16) + '</button>');
        if(m.k === 'anivTsu' || m.k === 'anivPati' || m.k === 'anivLirika') linha(false, 'sol', 'bolo', esc(m.nome), '', '<button type="button" class="twc-hj-bt" data-v="trio">' + esc(thj('trio')) + '</button>');
      });
    }
    // 5. Vida no bairro (tw-bairro.js): a bagunça da semana e o bico que está mais perto de subir
    var B = window.TW_BAIRRO;
    if(B){ try{ var rb = B.resumo();
      linha(rb.ok, 'uva', 'pin', esc(rb.tit), esc(rb.sub), '<button type="button" class="twc-hj-bt" data-bairro="abrir">' + esc(rb.bt) + '</button>',
        rb.bico ? '<small class="twc-hj-bico">' + esc(rb.bico) + '</small>' : ''); }catch(e){} }
    var tot = itens.filter(function(h){ return h.indexOf('twc-hj-it') >= 0; }).length; if(!tot) return '';
    var pc = Math.round(feitos / tot * 100), lista;
    // o "Também hoje" (outros eventos) entra na lista do "Ver tudo": um lugar só para tudo do dia
    var al = pendencias(), extra = al.length ? '<button type="button" class="twc-hj-mais" data-ir="' + esc(chaveDe(al[0])) + '"><small>' + esc(thj('tambem')) + '</small><b translate="no">' + esc(titulo(al[0])) + '</b>' +
      (al.length > 1 ? '<em>+' + (al.length - 1) + '</em>' : '') + ico('seta', 16) + '</button>' : '';
    if(extra) extra += passeioHoje(al[0]);
    var todos = extra ? itens.concat([extra]) : itens, fechar = '<button type="button" class="twc-hj-ver twc-hj-ver-bx" data-hjver="1">' + esc(thj('recolher')) + '</button>';
    var topo = continuar + festival;
    if(feitos === tot) lista = hojeAberto ? todos.join('') : extra;   // tudo feito: a lista recolhe (abre no "Ver lista"); o próximo evento fica à vista
    else {
      // Início curto (PR das melhorias, 21/11/2026): no máximo 3 pendências à vista, contando o Festival e o
      // "Continuar", e de tipos diferentes (jogo, gente, mapa, leitura). A ordem dos tipos gira a cada dia, para a
      // tela não pedir sempre as mesmas coisas; o resto fica no "Ver tudo".
      var cand = [festival, continuar].filter(Boolean).concat(itens.filter(function(h){ return h.indexOf('twc-hj-it') >= 0 && h.indexOf('twc-hj-ok') < 0; }));
      var tipo = function(h){ return /data-anivcor|data-hjaniv|data-v="trio"|data-a="encontro"/.test(h) ? 'gente' : /data-bairro|data-piloto-bairro/.test(h) ? 'mapa' : /ler-capitulo|data-twpa/.test(h) ? 'leitura' : 'jogo'; };
      var giro = ['jogo', 'gente', 'mapa', 'leitura'], dia = Math.floor((Date.now() - 3 * 36e5) / 864e5) % giro.length;
      giro = giro.slice(dia).concat(giro.slice(0, dia));
      var escolha = continuar ? [continuar] : [];   // o "Continuar" retoma algo já começado: fica sempre à vista
      giro.forEach(function(tp){ if(escolha.length < 3){ var h = cand.filter(function(x){ return tipo(x) === tp && escolha.indexOf(x) < 0; })[0]; if(h) escolha.push(h); } });
      cand.forEach(function(h){ if(escolha.length < 3 && escolha.indexOf(h) < 0) escolha.push(h); });
      escolha.sort(function(a, b){ return cand.indexOf(a) - cand.indexOf(b); });   // na tela, a ordem de importância de sempre
      var sobra = [festival, continuar].filter(Boolean).length + todos.length - escolha.length;
      if(sobra <= 1 || hojeAberto) lista = todos.join('') + (hojeAberto && sobra > 1 ? fechar : '');
      else { topo = ''; lista = escolha.join('') + '<button type="button" class="twc-hj-ver twc-hj-ver-bx" data-hjver="1">' + esc(thj('verTudo', {n:sobra})) + '</button>'; }
    }
    return '<section class="twc-hj" aria-labelledby="twcHjT"><div class="twc-hj-cab"><h2 id="twcHjT">' + esc(thj('tit')) + '</h2>' +
      '<span class="twc-prog"><span class="twc-barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + tot + '" aria-valuenow="' + feitos + '" aria-label="' + esc(thj('tit')) + '"><i style="width:' + pc + '%"></i></span><small>' + feitos + '/' + tot + '</small></span></div>' +
      (feitos === tot ? '<p class="twc-hj-tudo">' + esc(thj('tudo')) + ' <button type="button" class="twc-hj-ver" data-hjver="1">' + esc(hojeAberto ? thj('recolher') : thj('verLista')) + '</button></p>' : '') +
      topo + lista + '</section>';
  }

  var ESTREIA_TR = {
    pt:['Jogar corrida', 'Tirar foto'],
    en:['Play a run', 'Take a photo'],
    es:['Jugar carrera', 'Tomar foto'],
    id:['Main lari', 'Ambil foto'],
    th:['ลงแข่งวิ่ง', 'ถ่ายรูป'],
    ja:['ランに挑戦', '写真を撮る']
  };
  var estreia = null;
  var ENSAIO_NOME = {pt:'Ensaiar no Karaoke · 20 s',en:'Karaoke rehearsal · 20 s',es:'Ensayar en Karaoke · 20 s',id:'Latihan Karaoke · 20 dtk',th:'ซ้อมคาราโอเกะ · 20 วิ',ja:'カラオケ練習 · 20秒'};
  function estreiaHtml(){
    if(logado()) return '';
    var botoes = '';
    if((!estreia || estreia.concluiu === null) && card('run') && card('studio')){
      if(!estreia) estreia = {inicio:performance.now(), tentativa:null, concluiu:null};
      var textos = ESTREIA_TR[L()];
      botoes = '<button type="button" class="twc-btn twc-rapido" data-estreia="run">' + ico('run', 16) + esc(textos[0]) + '</button>' +
        '<button type="button" class="twc-btn twc-btn-claro twc-rapido" data-estreia="studio">' + ico('studio', 16) + esc(textos[1]) + '</button>';
    }
    if(new URLSearchParams(location.search).get('piloto_karaoke') === '1'){
      botoes += '<button type="button" class="twc-btn twc-btn-claro twc-rapido" data-a="karaokeEnsaio">' +
        ico('karaoke', 16) + esc(ENSAIO_NOME[L()] || ENSAIO_NOME.pt) + '</button>';
    }
    return botoes ? '<div class="twc-rapidos twc-estreia">' + botoes + '</div>' : '';
  }
  function estreiaEtapa(jogo, concluiu){
    if(!estreia || !estreia.tentativa || estreia.tentativa.jogo !== jogo || logado() || estreia.concluiu !== null) return;
    var tentativa = estreia.tentativa, agora = performance.now();
    if(!concluiu && tentativa.comecou === null) tentativa.comecou = agora;
    if(concluiu && tentativa.comecou !== null) estreia.concluiu = agora;
  }
  function estreiaMedidas(){
    if(!estreia) return null;
    var tentativa = estreia.tentativa;
    function desdeInicio(instante){ return instante === null ? null : Math.round(instante - estreia.inicio); }
    return {
      atividade:tentativa ? tentativa.jogo : null,
      escolhaMs:tentativa ? desdeInicio(tentativa.escolheu) : null,
      inicioMs:tentativa ? desdeInicio(tentativa.comecou) : null,
      conclusaoMs:desdeInicio(estreia.concluiu)
    };
  }

  var PIN_CHAVE = 'tw_cel_atalhos_v1', pinAberto = false, pinItens;
  var PIN_ROTAS = JOGOS.concat(['mapa', 'news', 'festival', 'cal']);
  var PIN_TX = {
    pt:['Atalhos fixados','Editar atalhos','Escolha até dois atalhos.','Remova um atalho para fixar outro.'],
    en:['Pinned shortcuts','Edit shortcuts','Choose up to two shortcuts.','Remove a shortcut to pin another.'],
    es:['Accesos fijados','Editar accesos','Elige hasta dos accesos.','Quita un acceso para fijar otro.'],
    id:['Pintasan tersemat','Edit pintasan','Pilih hingga dua pintasan.','Lepas satu pintasan untuk menyematkan yang lain.'],
    th:['ทางลัดที่ปักหมุด','แก้ไขทางลัด','เลือกทางลัดได้ไม่เกินสองรายการ','เลิกปักหมุดหนึ่งรายการเพื่อเพิ่มรายการอื่น'],
    ja:['固定したショートカット','ショートカットを編集','ショートカットを2つまで選べます。','別の項目を固定するには1つ外してください。']
  };
  function pinLista(){
    if(pinItens) return pinItens;
    try{
      var dados = JSON.parse(localStorage.getItem(PIN_CHAVE));
      if(Array.isArray(dados)) return pinItens = dados.filter(function(k, i){
        return PIN_ROTAS.indexOf(k) >= 0 && dados.indexOf(k) === i;
      }).slice(0, 2);
    }catch(e){}
    return pinItens = [];
  }
  function pinNome(k){
    if(k === 'mapa') return t('mapa');
    if(k === 'news') return 'Idol⭐News!';
    if(k === 'festival') return tt('Festival de Unidades');
    if(k === 'cal') return tc('cal');
    return titulo(card(k));
  }
  function pinHtml(){
    var atalhos = pinLista().filter(pinNome).map(function(k){
      return '<button type="button" class="twc-btn twc-btn-claro twc-rapido" data-pin-ir="' + k + '">' +
        ico(k === 'festival' ? 'karaoke' : k, 16) + esc(pinNome(k)) + '</button>';
    }).join('');
    return atalhos ? '<div class="twc-rapidos" role="group" aria-label="' + esc((PIN_TX[L()] || PIN_TX.pt)[0]) + '">' + atalhos + '</div>' : '';
  }
  function pinEditorHtml(){
    var lista = pinLista(), tx = PIN_TX[L()] || PIN_TX.pt;
    var opcoes = pinAberto ? PIN_ROTAS.filter(pinNome).map(function(k){
      var marcado = lista.indexOf(k) >= 0;
      return '<button type="button" data-pin="' + k + '" aria-pressed="' + marcado + '"' +
        (!marcado && lista.length === 2 ? ' aria-disabled="true"' : '') + '>' + esc(pinNome(k)) + '</button>';
    }).join('') : '';
    return '<section class="twc-card twc-pins" aria-labelledby="twcPinsTitulo">' +
      '<h2 id="twcPinsTitulo">' + esc(tx[0]) + '</h2><button type="button" id="twcPinEditar" class="twc-btn twc-btn-claro" aria-expanded="' +
      pinAberto + '" aria-controls="twcPinOpcoes">' + esc(tx[1]) + '</button>' +
      '<div id="twcPinOpcoes"' + (pinAberto ? '' : ' hidden') + '><p role="status">' +
      esc(tx[lista.length === 2 ? 3 : 2]) + '</p><div class="twc-chips">' + opcoes + '</div></div></section>';
  }
  function pinAlternar(k){
    if(PIN_ROTAS.indexOf(k) < 0 || !pinNome(k)) return;
    var lista = pinLista(), i = lista.indexOf(k);
    if(i >= 0) lista.splice(i, 1);
    else if(lista.length < 2) lista.push(k);
    else return;
    try{ localStorage.setItem(PIN_CHAVE, JSON.stringify(lista)); }catch(e){}
    som(); desenhar();
  }

  function passeioHoje(c){
    return c && window.TW_RITMO ? TW_RITMO.passeioHoje(chaveDe(c),function(k){return titulo(card(k));}) : '';
  }
  function telaInicio(){
    var al = pendencias(), d = al[0];
    var destaque = d
      ? '<button type="button" class="twc-destaque" data-ir="' + esc(chaveDe(d)) + '"><em class="twc-etiqueta">' + esc(t('hoje')) + '</em><span class="twc-linha-ico twc-g-' + (COR[chaveDe(d)] || 'roxo') + '">' + ico(chaveDe(d), 18) + '</span>' +
        '<span class="twc-destaque-txt"><b translate="no">' + esc(titulo(d)) + '</b><small>' + esc(descricao(d)) + '</small></span>' + (al.length > 1 ? '<em class="twc-mais" aria-label="' + esc('+' + (al.length - 1)) + '">+' + (al.length - 1) + '</em>' : '') + ico('seta', 18) + '</button>'
      : '<p class="twc-destaque twc-destaque-ok">' + ico('check', 18) + ' ' + esc(t('emdia')) + '</p>';
    var grade = [['run'], ['karaoke'], ['sora'], ['pet'], ['mapa', 'a'], ['news', 'a'], ['gacha'], ['todos', 'v']].map(function(g){
      var k = g[0];
      if(g[1] === 'a') return app(k, k === 'news' ? 'Idol News' : t('mapa'), 'data-a="' + k + '"');
      if(g[1] === 'v') return app(k, t('todos'), 'data-v="jogos"');
      var c = card(k); if(!c) return '';
      return app(k, nomeCurto(c, k), 'data-ir="' + k + '"', c);
    }).join('');
    var hjHtml = hojeHtml();   // a lista do dia; sem nada para mostrar, fica o destaque de antes
    if(!hjHtml && d)destaque += passeioHoje(d);
    // celular: palco, Hoje e portas um embaixo do outro; computador: palco e portas à esquerda, o Hoje inteiro à direita
    return '<div class="twc-pag twc-inicio"><div class="twc-lado twc-ini-palco">' + palco() + estreiaHtml() + (window.TW_CONQ && logado() ? TW_CONQ.cartaoHtml() : '') + '</div>' +
      '<div class="twc-lado twc-ini-hoje">' + (hjHtml || destaque) + '</div><div class="twc-lado twc-ini-portas">' + pinHtml() + portas() + '</div></div>';
  }

  /* ---------- Menu: você, o dia, os destaques e os atalhos ---------- */
  // Nome curto na grade de atalhos (o inteiro vai para o leitor de tela). Só onde o nome do módulo passa de
  // duas linhas em 320–390 px ou quebra no meio de uma palavra (TsuLiPa⭐World, アイドルをさがす).
  var ATC = {
    'data-twk="lembrete"':{pt:'Show de sábado',en:'Saturday Show',es:'Show del sábado',id:'Show Sabtu',th:'โชว์วันเสาร์',ja:'土曜ショー'},
    'data-twp="recado"':{pt:'Recado ao trio',en:'Note to the trio',es:'Mensaje al trío',id:'Pesan ke trio',th:'ข้อความถึงทริโอ',ja:'トリオへ手紙'},
    'data-a="busca"':{ja:'アイドル検索'},
    'data-v="trio"':{ja:'プロフ'},   // "プロフィール" quebrava em "プロ / フィール" em 320 px
    'data-twk="concurso"':{ja:'コーデ大会'},   // "コーデコンテスト" quebrava em "コーデコ / ンテスト"
    // hífen opcional (U+00AD): só aparece quando a palavra não cabe na largura do atalho (320 px)
    'data-twpa="abrir"':{pt:'Passa\u00adtempos',es:'Pasa\u00adtiempos',th:'เกมประจำวัน'},
    'data-bairro="abrir"':{en:'Neighbor\u00adhood life',id:'Kampung kita'},
    'data-a="nov"':{es:'Nove\u00addades'}
  };
  var TM = {
    mais:{pt:'Mais',en:'More',es:'Más',id:'Lainnya',th:'เพิ่มเติม',ja:'もっと'},
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'閉じる'},
    maisTit:{pt:'Mais no TsuLiPa⭐World',en:'More in TsuLiPa⭐World',es:'Más en TsuLiPa⭐World',id:'Lainnya di TsuLiPa⭐World',th:'เพิ่มเติมใน TsuLiPa⭐World',ja:'TsuLiPa⭐Worldのその他'}
  };
  function tm(k){ var d = TM[k]; return d[L()] || d.pt; }
  var menuMais = [];
  // Pasta "Mais" do Menu: os mesmos botões (mesmos data-*), numa folha por cima; tocar num deles fecha a folha.
  function folhaMais(){
    folha.innerHTML = '<div class="twc-folha-caixa twc-folha-mais" role="dialog" aria-modal="true" aria-labelledby="twcMaisT"><h2 id="twcMaisT">' + esc(tm('maisTit')) + '</h2>' +
      '<div class="twc-mais-grade">' + menuMais.map(function(a){
        var c = a[0] === 'nov' ? novTemNovo() : null, curto = atCurto(a[2], a[1]);
        return '<button type="button" class="twc-atalho" ' + a[2] + (curto !== a[1] ? ' aria-label="' + esc(a[1]) + '" title="' + esc(a[1]) + '"' : '') + '><span class="twc-at-ico" aria-hidden="true">' + ico(a[0], 26) + '</span><span class="twc-at-nome">' + esc(curto) + '</span>' + badge(c) + '</button>';
      }).join('') + '</div><button type="button" class="twc-btn twc-btn-claro" data-f="fechar">' + esc(tm('fechar')) + '</button></div>';
    folha.hidden = false;
    var pri = folha.querySelector('.twc-mais-grade button'); if(pri) try{ pri.focus(); }catch(e){}
  }
  // Fecha a pasta depois que o toque chega aos módulos (alguns escutam no documento, na captura, e param o evento).
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('.twc-folha-mais .twc-atalho');
    if(b) setTimeout(function(){ if(folha && folha.querySelector('.twc-folha-mais')) fecharFolha(); }, 0);
  }, true);
  function atCurto(attrs, nome){ var k = String(attrs).split(' ')[0], d = ATC[k]; return (d && d[L()]) || nome; }
  function telaMenu(){
    var pi = []; try{ pi = typeof hubPetInfo === 'function' ? hubPetInfo() : []; }catch(e){ pi = []; }
    var petC = card('pet'), petEmo = (petC && petC.querySelector('i')) ? petC.querySelector('i').textContent : '';
    var rec = +(typeof best !== 'undefined' ? best : 0) || 0;
    // Poda de 22/11 (dona): os banners do Center⭐Run!, Karaoke⭐Time! e Star⭐Gacha! saíram do Menu: já estão na porta Jogos.
    // Sem repetir o que já tem porta no Início (Missões, Calendário, Mapa, News, Camarim) nem a engrenagem do topo (Ajustes).
    // Sem repetir dentro do Menu: a TV já é o card do Ranking; o "Hoje", o Calendário e o desejo/VIP ficam no Início.
    // [ícone, nome, atributos]. Cada atalho tem um desenho próprio (antes: trio, coração, estrela e calendário repetidos).
    // Na grade vai o nome curto (ATC); o nome inteiro fica no aria-label e no title.
    var at = [['loja', 'Zipper Shop', 'data-ir="loja"'], ['coracao', thj('enc'), 'data-a="encontro"'], ['quebra', window.TW_PASSA ? TW_PASSA.t('tit') : '', 'data-twpa="abrir"'],
              ['album', t('album'), 'data-a="album"'], ['busca', t('busca'), 'data-a="busca"'], ['nov', t('nov'), 'data-a="nov"'], ['trio', tf('fichas'), 'data-v="trio"'],
              ['porta', tt2('tour'), 'data-v="tour"']];
    at = at.filter(function(a){ return a[1]; });   // atalho de módulo que ainda não carregou fica de fora
    if(window.TW_RITMO) at.push(['mapa', TW_RITMO.t(0), 'data-v="ritmo"']);   // Seu ritmo (#125, tw-ritmo.js): na pasta "Mais" desde a poda de 22/11
    if(window.TW_BAIRRO) at.push(['pin', window.TW_BAIRRO.t('tit'), 'data-bairro="abrir"']);   // Vida no bairro (tw-bairro.js)
    if(window.TW_COMUNIDADE){   // comunidade (tw-comunidade.js): concurso, convite, lembrete do show e app
      var cm = window.TW_COMUNIDADE;
      at.push(['trofeu', cm.t('concurso'), 'data-twk="concurso"']);
      if(window.TW_ESTREIA && TW_ESTREIA.trilhaAtiva()) at.push(['brilho', TW_ESTREIA.t('trilha'), 'data-twe="trilha"']);   // primeira semana (tw-estreia.js)
      if(logado()) at.push(['convite', cm.t('convite'), 'data-twk="convite"']);
      at.push(['sino', cm.t('lembrete'), 'data-twk="lembrete"']);
      if(cm.podeInstalar()) at.push(['app', cm.t('instalar'), 'data-twk="instalar"']);
    }
    if(window.TW_PESSOAL && logado()){
      // "Meu mês" saiu em 22/11: a retrospectiva já está no "Esta semana" do Calendário, em todas as larguras.
      at.push(['carta', window.TW_PESSOAL.t('recado'), 'data-twp="recado"']);
    }   // Caixa de recados para o TsuLiPa (tw-pessoal.js)
    // Poda de 22/11 (dona): 7 atalhos à vista + a pasta "Mais" com o resto (como as pastas de apps do celular).
    // Ficam à vista os passeios do dia a dia; comunidade, avisos e recados vão para a pasta.
    var VISTA = ['data-ir="loja"', 'data-a="encontro"', 'data-twpa="abrir"', 'data-a="album"', 'data-a="busca"', 'data-v="trio"', 'data-bairro="abrir"'];
    var principais = at.filter(function(a){ return VISTA.indexOf(a[2]) >= 0; }), extras = at.filter(function(a){ return VISTA.indexOf(a[2]) < 0; });
    menuMais = extras;
    if(extras.length) principais.push(['todos', tm('mais'), 'data-a="menuMais"']);
    at = principais;
    // Grade sem "sobra" torta: 4 colunas (2 linhas de 4 com a pasta) e última linha centralizada se faltar algum módulo.
    var colPc = Math.min(8, at.length);
    return faixa(esc(t('menu')), t('menuSub')) + '<div class="twc-pag twc-menu">' +
      '<div class="twc-menu-topo"><div class="twc-duas">' +
        '<button type="button" class="twc-card twc-idol" data-ir="pet"><canvas class="twc-idol-av" data-av="1" width="160" height="160" aria-hidden="true"></canvas>' +
          (petEmo ? '<span class="twc-idol-pet" aria-hidden="true">' + esc(petEmo) + '</span>' : '') + '<b>' + esc(pi[0] || 'Backstage⭐Pet!') + '</b>' + badge(petC) + '</button>' +
        '<button type="button" class="twc-card twc-rank" data-a="tv"><span class="twc-rank-t">' + ico('trofeu', 20) + '<b>' + esc(t('rank')) + '</b></span>' +
          (rec ? '<span class="twc-rank-n">' + esc(recorde()) + '</span><small>' + esc(tt('Recorde')) + ' · ' + esc(t('tv')) + '</small>' : '<small class="twc-rank-vazio">' + esc(t('rankVazio')) + '</small><small>' + esc(t('tv')) + '</small>') + '</button>' +
      '</div></div>' + humorHtml(true) +
      idols() +
      '<section class="twc-atalhos" aria-label="' + esc(t('menu')) + '" style="--twc-at-col:' + colPc + '">' + at.map(function(a){
        var c = a[0] === 'nov' ? novTemNovo() : a[0] === 'todos' ? menuMais.some(function(x){ return x[0] === 'nov'; }) && novTemNovo() : a[2].indexOf('data-ir') === 0 ? card(a[0]) : null;
        var novo = a[0] === 'loja' && window.TW_ESTREIA && TW_ESTREIA.lojaNovo && TW_ESTREIA.lojaNovo() ? '<em class="twc-novo">' + esc(TW_ESTREIA.t('novo')) + '</em>' : '';   // selo "Novo" na Zipper⭐Shop!
        var curto = atCurto(a[2], a[1]), nomeInteiro = curto !== a[1] ? ' aria-label="' + esc(a[1]) + '" title="' + esc(a[1]) + '"' : '';
        return '<button type="button" class="twc-atalho" ' + a[2] + nomeInteiro + '><span class="twc-at-ico" aria-hidden="true">' + ico(a[0], 26) + '</span><span class="twc-at-nome' + (L() === 'ja' ? ' twc-at-cjk' : '') + '">' + esc(curto) + '</span>' + (novo || badge(c)) + cadeado(a[0]) + '</button>';
      }).join('') + '</section></div>';
  }

  /* ---------- Álbum: grade de cards com filtro pelas bolinhas (como a tela de cartas do Link! Like!) ---------- */
  // Lê só album_cards (a mesma consulta do álbum clássico). O filtro usa o Oshi gravado em cada card.
  var album = {dados:null, erro:false, filtro:'', carregando:false};
  function semAcento(s){ return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim(); }
  function albumCarregar(){
    if(album.carregando || typeof contaRpc !== 'function') return;
    album.carregando = true;
    contaRpc('album_cards').then(function(L){ album.dados = Array.isArray(L) ? L : []; album.erro = false; })
      .catch(function(){ album.dados = []; album.erro = true; })
      .then(function(){ album.carregando = false; if(cel && topo() === 'album') desenhar(); });
  }
  function albumGrupo(c){ var o = semAcento(c && c.card && c.card.oshi); return o === 'tsu' || o === 'lirika' || o === 'pati' ? o : 'outros'; }
  function telaAlbum(){
    if(album.dados === null) albumCarregar();
    var tenho = {}, lista = [];
    (album.dados || []).forEach(function(c){ var n = c && c.card && c.card.nick; if(n && !tenho[n]){ tenho[n] = c; lista.push(c); } });
    var nomes = []; try{ nomes = typeof albumIdols === 'function' ? albumIdols() : []; }catch(e){ nomes = []; }
    Object.keys(tenho).forEach(function(n){ if(nomes.indexOf(n) < 0) nomes.push(n); });
    var total = Math.max(nomes.length, lista.length);
    var f = album.filtro, mostrar = f ? lista.filter(function(c){ return albumGrupo(c) === f; }) : lista;
    var faltam = f ? [] : nomes.filter(function(n){ return !tenho[n]; });
    if(typeof cardsMem !== 'undefined') cardsMem.twcAlbum = mostrar;   // o toque abre o mesmo zoom de card do jogo (salvar como imagem incluso)
    var filtros = [['', '<span class="twc-bola-todos">' + ico('todos', 22) + '</span>', t('todosAlbum')]].concat(MEMBROS.map(function(m, i){ return [m[0], '<canvas class="twc-bola" data-membro="' + i + '" width="96" height="96" aria-hidden="true" style="--cor:' + m[2] + '"></canvas>', m[1]]; }))
      .concat([['outros', '<span class="twc-bola-todos twc-bola-outros">' + ico('estrela', 22) + '</span>', t('outros')]]);
    var corpo;
    if(album.dados === null) corpo = '<p class="twc-vazio">' + esc(tt('Carregando...')) + '</p>';
    else if(!mostrar.length && !faltam.length) corpo = '<p class="twc-vazio">' + esc(album.erro ? tt('O álbum começa a guardar seus cards em breve. Por enquanto, veja quem falta!') : t('albumVazio')) + '</p>';
    else corpo = '<div class="twc-cartas">' + mostrar.map(function(c, i){
        return '<button type="button" class="twc-carta" data-cardz="twcAlbum|' + i + '" aria-label="' + esc(tt('Ver card') + ': ' + c.card.nick) + '"><canvas data-carta="' + i + '" width="360" height="504" aria-hidden="true"></canvas>' + (+c.vezes > 1 ? '<em class="twc-vezes">×' + (+c.vezes) + '</em>' : '') + '<small translate="no">' + esc(c.card.nick) + '</small></button>';
      }).join('') + faltam.map(function(n){ return '<span class="twc-carta twc-carta-falta"><span class="twc-carta-q" aria-hidden="true">?</span><small translate="no">' + esc(n) + '</small></span>'; }).join('') + '</div>';
    return faixa(esc(t('album')), t('albumSub'), lista.length + ' / ' + total) + '<div class="twc-pag twc-album">' +
      '<div class="twc-album-corpo">' + (window.TW_ALBUM_FOTOS ? TW_ALBUM_FOTOS.html() : '') + '<nav class="twc-filtros" aria-label="' + esc(t('filtro')) + '">' + filtros.map(function(x){
        return '<button type="button" class="twc-filtro" data-filtro="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + '<span>' + esc(x[2]) + '</span></button>';
      }).join('') + '</nav><section class="twc-card twc-album-grade" aria-live="polite">' + corpo + '</section></div>' +
      (card('battle') ? '<button type="button" class="twc-btn" data-ir="battle">Idol⭐Battle! · ' + esc(albumBattleTexto()) + '</button>' : '') +
      (typeof window.albumAbrir === 'function' ? '<button type="button" class="twc-btn twc-btn-claro" data-a="albumCompleto">' + esc(t('albumCompleto')) + '</button>' : '') + '</div>';
  }
  var cartasRaf = 0;
  function cartasDesenhar(){   // em lotes de 4, para não travar o celular com muitos cards
    cancelAnimationFrame(cartasRaf);
    var lista = typeof cardsMem !== 'undefined' ? (cardsMem.twcAlbum || []) : [], i = 0;
    var cvs = [].slice.call(cel.querySelectorAll('canvas[data-carta]'));
    (function lote(){
      for(var n = 0; n < 4 && i < cvs.length; n++, i++){ var cv = cvs[i], c = lista[+cv.getAttribute('data-carta')]; try{ if(c && c.card && typeof gachaCardDesenhar === 'function') gachaCardDesenhar(cv, cardsDados(c)); }catch(e){} }
      if(i < cvs.length) cartasRaf = requestAnimationFrame(lote);
    })();
  }
  function telaJogos(){
    var ks = jogosNaTela(), sem = window.TW_SEMANA && window.TW_SEMANA.jogoDaSemana ? window.TW_SEMANA.jogoDaSemana() : null;
    // Jogo da semana (o menos jogado na semana anterior, missão com ★5 a mais) vem primeiro e com selo
    if(sem && ks.indexOf(sem) > 0) ks = [sem].concat(ks.filter(function(k){ return k !== sem; }));
    return faixa(esc(t('jogos')), t('jogosSub').replace('{n}', ks.length)) + '<div class="twc-pag twc-jogos"><div class="twc-lista">' + ks.map(function(k){
      var c = card(k);
      return '<button type="button" class="twc-jogo twc-g-' + (COR[k] || 'roxo') + '" data-ir="' + k + '"><span class="twc-jogo-ico">' + ico(k, 24) + '</span>' +
        '<span class="twc-jogo-txt"><b translate="no">' + esc(titulo(c)) + '</b>' + (k === sem ? '<span class="twc-semana-selo">🌟 ' + esc(window.TW_SEMANA.t('jogo')) + '</span>' : '') + '<small>' + esc(descricao(c)) + '</small></span>' +
        (alerta(c) ? '<em class="twc-novo" aria-hidden="true">!</em>' : '') + seloTreino(k) + (precisaEntrar(k) ? '<em class="twc-novo twc-novo-cad" aria-hidden="true">' + ico('cadeado', 14) + '</em><span class="twc-sr"> (' + esc(t2('legCad')) + ')</span>' : '') + ico('seta', 20) + '</button>';
    }).join('') + '</div>' + (logado() ? '' : '<p class="twc-legenda"><span aria-hidden="true">' + ico('cadeado', 13) + '</span> ' + esc(t2('legCad')) + ' · <b>' + esc(t2('treino')) + '</b>: ' + esc(t2('legTreino')) + '</p>') + '</div>';
  }
  function telaAjustes(){
    var LG = [['pt', 'Português'], ['en', 'English'], ['es', 'Español'], ['id', 'Bahasa Indonesia'], ['th', 'ไทย'], ['ja', '日本語']];
    var OS = [['', '☀️', tt('Padrão')], ['tsu', '🎤', 'Tsu'], ['lirika', '🐨', 'Lirika'], ['pati', '👑', 'Pati']];
    var oshi = typeof OSHI === 'string' ? OSHI : '';
    return faixa(esc(t('ajustes')), t('ajustesSub')) + '<div class="twc-pag twc-ajustes">' + '<section class="twc-card">'+twAudioControles('twc')+'</section>' + pinEditorHtml() +
      '<section class="twc-card"><h2>' + esc(tt('Idioma')) + '</h2><div class="twc-chips" role="group" aria-label="' + esc(tt('Idioma')) + '">' +
        LG.map(function(l){ return '<button type="button" data-l="' + l[0] + '" aria-pressed="' + (L() === l[0]) + '" lang="' + l[0] + '">' + l[1] + '</button>'; }).join('') + '</div></section>' +
      '<section class="twc-card"><h2>' + esc(tt('Tema do Oshi')) + '</h2><div class="twc-chips" role="group" aria-label="' + esc(tt('Tema do Oshi')) + '">' +
        OS.map(function(o){ return '<button type="button" data-o="' + o[0] + '" aria-pressed="' + (oshi === o[0]) + '"><span aria-hidden="true">' + o[1] + '</span> ' + esc(o[2]) + '</button>'; }).join('') + '</div></section>' +
      '<section class="twc-card"><h2>' + esc(nick()) + '</h2>' + (logado()
        ? '<button type="button" class="twc-btn twc-btn-claro" data-a="sair">' + esc(sairPend ? t('sairOk') : t('sair')) + '</button>'
        : '<button type="button" class="twc-btn" data-a="entrar">' + esc(t('entrar')) + ' · Google</button>') + '</section>' +
      '<a class="twc-btn twc-btn-claro twc-btn-link" href="./privacidade.html" target="_blank" rel="noopener"><span class="twc-btn-ic" aria-hidden="true">' + ico('escudo', 18) + '</span>' + esc(t2('paisPriv')) + '</a>' +
      '<button type="button" class="twc-btn twc-btn-claro" data-a="classico">' + esc(t('classico')) + '</button>' +
      '</div>';
  }
  function telaInicial(){   // antes do "Toque para começar" (libera o som do aparelho)
    // abertura animada (ideia do site Loveez, arte nossa): 3 camadas em parallax + o trio flutuando em volta do logo
    // na ordem do nome: Tsu à esquerda, Lirika no centro (um pouco mais alta), Pati à direita
    var px = '<div class="twc-px" aria-hidden="true"><i class="twc-px1"></i><i class="twc-px2"></i><i class="twc-px3"></i></div>' +
      '<div class="twc-flutua" aria-hidden="true">' + [[0, 'twc-fl0'], [1, 'twc-fl2'], [2, 'twc-fl1']].map(function(f){ return '<canvas class="twc-fl ' + f[1] + '" data-idol="' + f[0] + '" width="208" height="224"></canvas>'; }).join('') + '</div>';
    return '<div class="twc-abre">' + px + brilhos([[14, 18, 14], [82, 24, 12, 'l'], [24, 70, 10, 'r'], [76, 66, 14], [50, 12, 9, 'l']]) +
      (function(){ var lg = document.querySelector('#hub .hubin .hublogo'); return lg ? '<h1 class="hublogo twc-hublogo twc-logo-abre" translate="no" aria-label="TsuLiPa World">' + lg.innerHTML + '</h1>' : '<h1 class="twc-logo" translate="no">TsuLiPa<span>⭐</span>World</h1>'; })() +
      '<p class="hubsub twc-hubsub" lang="ja">ツリパ⭐ワールド</p>' +
      '<div class="twc-abre-vitrine" id="twcAbreVitrine"></div>' +
      '<button type="button" class="twc-comecar" data-a="comecar"><i class="twc-varre" aria-hidden="true"></i><span>' + esc(tt('TOQUE PARA COMEÇAR')) + '</span></button></div>';
  }
  // o trio de corpo inteiro nas camadas da abertura (o movimento é só CSS; "reduzir movimento" deixa parado)
  function flutuantes(){
    [].slice.call(cel.querySelectorAll('canvas[data-idol]')).forEach(function(cv){
      var av = membroAv(+cv.getAttribute('data-idol')); if(!av || typeof perfDesenharIdol !== 'function') return;
      var x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height); x.scale(2, 2);
      try{ perfDesenharIdol(x, 104, 112, av, false, false, 0, cv.closest('.twc-f2-palco') ? 'inteiro' : null); }catch(e){}
    });
  }
  // parallax: o dedo/mouse (e a inclinação do aparelho, quando o navegador deixa) mexe as camadas de leve
  function naAbre(){ return !!(cel && tela && tela.getAttribute('data-tela') === 'abre'); }
  var pxRaf = 0, pxAlvo = [0, 0];
  function pxMover(x, y){ pxAlvo = [Math.max(-1, Math.min(1, x)), Math.max(-1, Math.min(1, y))];
    if(pxRaf || !cel) return; pxRaf = requestAnimationFrame(function(){ pxRaf = 0; if(!cel) return; cel.style.setProperty('--mx', pxAlvo[0].toFixed(3)); cel.style.setProperty('--my', pxAlvo[1].toFixed(3)); }); }
  if(typeof window.addEventListener === 'function'){
    window.addEventListener('pointermove', function(e){ if(naAbre()) pxMover(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1); }, {passive:true});
    window.addEventListener('deviceorientation', function(e){ if(naAbre() && e.gamma != null) pxMover(e.gamma / 30, (e.beta - 45) / 30); }, {passive:true});
  }
  // A abertura já está pronta quando montar() roda. Não cobrir a interface
  // com uma espera decorativa dependente de timers ou do evento load.
  function barraBaixo(){
    var v = topo(), noMenu = v === 'menu' && !classico, raiz = pilha.length < 2 && !classico;
    return '<button type="button" class="twc-nav-b" data-n="voltar"' + (raiz ? ' disabled' : '') + '>' + ico('voltar', 26) + '<span>' + esc(t('voltar')) + '</span></button>' +
      '<span class="twc-nav-meio"><button type="button" class="twc-nav-menu' + (noMenu ? ' twc-aberto' : '') + '" data-n="menu" aria-label="' + esc(noMenu ? t('ini') : t('menu')) + '" aria-expanded="' + noMenu + '">' + ico(noMenu ? 'x' : 'menu', 28) +
        (!noMenu && (document.querySelector('#hubCards .hubcard.tw-alert-pink') || novTemNovo()) ? '<em class="twc-dot" aria-hidden="true">!</em>' : '') + brilhos([[-6, -6, 13, 'l']]) + '</button></span>' +
      '<button type="button" class="twc-nav-b" data-n="inicio"' + (v === 'inicio' && !classico ? ' aria-current="page"' : '') + '>' + ico('casa', 26) + '<span>' + esc(t('ini')) + '</span></button>';
  }

  /* ---------- Mapa, Missões, Procurar Idol e Novidades dentro do celular ----------
     São as mesmas partes do início clássico (com os mesmos cliques e regras), trazidas para uma tela do celular
     enquanto ela está aberta e devolvidas ao sair. Tudo continua dentro do #hub, então nada deixa de funcionar. */
  var EMB = {mapa:['#twMapa', 'mapa'], missoes:['#hubMisPainel', 'mis'], busca:['.hubbusca', 'busca'], nov:['.hubnov', 'nov']}, embAtual = null;
  function buscaAtalhos(q){
    var box = $id('twcBuscaAtalhos'); if(!box)return;
    var termos=semAcento(q).replace(/[^\p{L}\p{M}\p{N}]+/gu,' ').trim().split(' ').filter(Boolean);
    if(!termos.length){box.replaceChildren();return;}
    var rotas=jogosNaTela().map(function(k){
      var c=card(k), apelidos={run:'corrida correr palco runner',karaoke:'música ritmo show cantar',sora:'nuvens pulo altura',studio:'foto fotografia retrato camera',cafe:'café comida bebida receita balcão',handshake:'fã presente memória',duo:'dupla foto dança',pet:'camarim quarto bichinho',bloom:'jardim flor plantar',battle:'arena batalha cards'};
      return [titulo(c),descricao(c)+(precisaEntrar(k)?' · '+t2('legCad'):''),apelidos[k]||'', 'data-ir="'+k+'"'];
    }).concat([
      [t('mapa'),tp('mapaSub'),'cidade rua praça lugar','data-a="mapa"'],
      [tt('Festival de Unidades'),jornalFestivalTexto(0),'placar música da semana team','data-a="festival"'],
      ['Idol⭐News!',tp('newsSub'),'jornal quadrinho notícias','data-a="news"'],
      [t('album'),t('albumSub'),'cartas coleção gacha','data-a="album"'],
      ['Momentos⭐',tp('camarimSub'),'foto fotos galeria porta retrato','data-a="momentos"'],
      [t('ajustes'),t('ajustesSub'),'config configuração volume áudio som','data-v="ajustes"'],
      [t('mis'),tp('misSub'),'missão objetivos progresso','data-a="missoes"']
    ]);
    var encontrados=rotas.filter(function(r){
      var texto=semAcento(r.slice(0,3).join(' '));
      return termos.every(function(p){return texto.includes(p);});
    });
    box.innerHTML='<h2>'+esc(twLinkTexto(6))+'</h2>'+(encontrados.length?encontrados.map(function(r){
      return '<button type="button" class="twc-atalho" '+r[3]+'><span><b>'+esc(r[0])+'</b><small>'+esc(r[1])+'</small></span></button>';
    }).join(''):'<p role="status">'+esc(twLinkTexto(7))+'</p>');
  }
  function telaEmb(k){
    return faixa(esc(k === 'busca' ? twLinkTexto(5) : t(EMB[k][1])), k === 'mapa' ? visita() : t('menuSub')) + '<div class="twc-pag twc-emb twc-emb-' + k + '">' +
      (k === 'mapa' ? '<span class="twc-online" data-twc-online hidden></span>' + (window.TW_SEMANA ? window.TW_SEMANA.mapaHtml() : '') : '') + '<div id="twcEmbSlot"></div>' +
      (k === 'busca' ? '<section id="twcBuscaAtalhos" class="twc-busca-atalhos" aria-label="'+esc(twLinkTexto(6))+'"></section>' : '') + (k === 'mapa' ? frasesHtml() : '') + '</div>';
  }
  /* ---------- Humor do Idol + Desejo do dia + passe do Camarim VIP (tw-humor.js; ideia do The Sims, arte nossa) ---------- */
  function humorHtml(semDesejo){   // semDesejo: o desejo do dia e o VIP já aparecem no "Hoje" do Início
    var H = window.TW_HUMOR; if(!H) return '';
    var e = H.estado(), d = H.desejo(), vip = H.vipHoje();
    var barras = H.barras.map(function(b){ var v = e[b];
      return '<div class="twc-hb twc-hb-' + b + '"><span>' + esc(H.t(b)) + '</span><i role="progressbar" aria-label="' + esc(H.t(b)) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '"><b style="width:' + v + '%"></b></i></div>'; }).join('');
    // Menu (semDesejo): versão compacta (23/11, pedido da dona) — as 4 barras numa linha e a explicação dentro do "Como funciona".
    var intro = '<p class="twc-humor-dica">' + esc(H.t('intro')) + '</p>';
    return '<section class="twc-humor' + (semDesejo ? ' twc-humor-mini' : '') + '" aria-labelledby="twcHumorT"><div class="twc-humor-top"><span class="twc-diam" style="--c:' + e.cor + '" aria-hidden="true"></span><h2 id="twcHumorT">' + esc(H.t('humor')) + '</h2>' +
      (e.serie > 0 ? '<em class="twc-serie"><span aria-hidden="true">' + ico('chama', 14) + '</span>' + esc(H.t('serie', e.serie)) + '</em>' : '') + '</div>' +
      (semDesejo ? '' : intro) + '<div class="twc-hbs">' + barras + '</div><details class="twc-humor-dica"><summary>' + esc(H.t('como')) + '</summary>' + (semDesejo ? '<p>' + esc(H.t('intro')) + '</p>' : '') + H.barras.map(function(b){return '<p><b>' + esc(H.t(b)) + '</b> · ' + esc(H.t(b+'Ajuda')) + '</p>';}).join('') + '<p>' + esc(H.t('efeitos')) + '</p><p>' + esc(H.t('corGuia')) + '</p><p>' + esc(H.t('regra')) + '</p></details>' +
      (H.cansado() ? '<p class="twc-humor-dica">' + esc(H.t('cansado')) + '</p>' : '') + (semDesejo ? '</section>' :
      '<div class="twc-desejo' + (d.feito ? ' twc-desejo-ok' : '') + '"><span class="twc-desejo-ico twc-g-' + (COR[desejoIco(d.ev)] || 'rosa') + '" aria-hidden="true">' + ico(d.feito ? 'check' : desejoIco(d.ev), 22) + '</span><span class="twc-desejo-txt"><small>' + esc(H.t('desejo')) + '</small><b>' + esc(d.feito ? H.t('feito') : d.texto) + '</b></span>' +
        (d.feito ? '' : '<button type="button" class="twc-btn twc-desejo-ir" data-desejo="' + esc(d.ev) + '">' + esc(H.rotuloRota(d.ev)) + '</button>') + '</div>' +
      '<button type="button" class="twc-vip' + (vip ? ' twc-vip-on' : '') + '" data-a="vip"><span class="twc-vip-coroa" aria-hidden="true">' + ico('coroa', 24) + '</span><span><b>' + esc(t2('vip')) + '</b><small>' + esc(vip ? t2('vipAberto') : t2('vipFechado')) + '</small></span>' +
        (vip ? ico('seta', 18) : '<em class="twc-cad twc-cad-vip" aria-hidden="true">' + ico('cadeado', 13) + '</em>') + '</button></section>');
  }
  function desejoIco(ev){ return ev === 'frase' ? 'fala' : ev; }
  function desejoIr(ev){
    if(ev === 'mapa' || ev === 'frase'){ ir('emb:mapa'); return; }
    if(ev === 'bloom' && !card('bloom') && typeof window.bloomAbrir === 'function'){ window.bloomAbrir(); return; }
    if(ev === 'battle' && typeof window.battleAbrir === 'function' && !card('battle')){ window.battleAbrir(); return; }
    if(ev === 'studio' && typeof window.studioAbrir === 'function' && !card('studio')){ window.studioAbrir(); return; }
    abrirCard(ev);
  }
  // Avisos em fila (21/11/2026): ao entrar podem chegar vários de uma vez (kit, trilha, bônus, sequência...);
  // cada um aparece por inteiro, um depois do outro, sem repetir o mesmo texto. Ícone: nome do desenho ou um emoji.
  function toast(txt, icone){
    if(!cel) return;
    toast.fila = toast.fila || [];
    if(toast.ativo){
      if(toast.atual !== txt && !toast.fila.some(function(f){ return f[0] === txt; }) && toast.fila.length < 8) toast.fila.push([txt, icone]);
      return;
    }
    var el = $id('twcToast');
    if(!el){ el = document.createElement('div'); el.id = 'twcToast'; el.className = 'twc-toast'; el.setAttribute('role', 'status'); cel.appendChild(el); }
    var desenho = icone && /^[a-z0-9_]+$/.test(icone) ? ico(icone, 22) : icone ? '<span class="twc-toast-emo">' + esc(icone) + '</span>' : '';
    el.innerHTML = (desenho ? '<span class="twc-toast-ic" aria-hidden="true">' + desenho + '</span>' : '') + '<span>' + esc(txt) + '</span>'; el.classList.remove('twc-toast-on'); void el.offsetWidth; el.classList.add('twc-toast-on');
    toast.ativo = true; toast.atual = txt;
    clearTimeout(toast.t); toast.t = setTimeout(function(){
      el.classList.remove('twc-toast-on');
      setTimeout(function(){ toast.ativo = false; toast.atual = ''; var n = toast.fila.shift(); if(n) toast(n[0], n[1]); }, 320);
    }, toast.fila.length ? 2800 : 3800);
  }
  window.twcToast = function(txt){ toast(txt, 'estrela'); };   // usado pelo tw-bairro.js (nível novo no bico da rua)
  // Vida no bairro (tw-bairro.js): ponto, nível, bagunça e guia redesenham o Início
  (function ligaBairro(n){ if(window.TW_BAIRRO){ window.TW_BAIRRO.ouvir(function(){ if(cel && !classico && topo() === 'inicio') agendaDesenho(); }); }
    else if(n < 40 && typeof setTimeout === 'function') setTimeout(function(){ ligaBairro(n + 1); }, 250); })(0);
  if(window.TW_HUMOR) window.TW_HUMOR.ouvir(function(tipo){
    if(tipo === 'desejo'){ var rq = window.TW_HUMOR.ultimoRecado();
      toast(window.TW_HUMOR.t('feito') + ' ' + t2('vipGanhou') + (rq && logado() ? '\n' + window.TW_HUMOR.t('novoRecado', rq).replace(/^📱\s*/, '') : ''), 'coroa');
      if(typeof petBg !== 'undefined') try{ petBg = null; }catch(e){} try{ if(typeof beep === 'function'){ beep(784, .08, 'triangle', .05); setTimeout(function(){ beep(1175, .12, 'triangle', .05); }, 110); } }catch(e){} }
    if(cel && !classico && topo() === 'inicio') agendaDesenho();
  });
  var desenhoPend = 0;
  function agendaDesenho(){ if(desenhoPend) return; desenhoPend = setTimeout(function(){ desenhoPend = 0; if(cel && !classico && topo() === 'inicio') desenhar(); }, 300); }
  if(window.TW_PILOTO_BAIRRO) window.addEventListener('tw-piloto-bairro',agendaDesenho);
  if(window.addEventListener) window.addEventListener('tw-semana', agendaDesenho);   // "Esta semana" (tw-semana.js)
  function vipFoto(serie){   // Polaroid do Camarim VIP em PNG (canvas → toDataURL), sem servidor
    var cv = $id('twcDentroCv'); if(!cv || topo() !== 'dentro:vip') return;
    // A pose escolhida precisa estar no Canvas antes da captura, mesmo em toques rápidos.
    try{ dentroDesenhar(cv, 'vip', performance.now() / 1000); }catch(e){}
    var W = cv.width + 40, Hh = cv.height + 110, o = document.createElement('canvas'); o.width = W; o.height = Hh;
    var x = o.getContext('2d'); x.fillStyle = '#fffdf7'; x.fillRect(0, 0, W, Hh); x.drawImage(cv, 20, 20);
    x.fillStyle = '#5b2bb5'; x.font = '26px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText('👑 ' + t2('vip') + ' · TsuLiPa⭐World', W / 2, cv.height + 62);
    x.fillStyle = '#9a86c8'; x.font = '700 16px "M PLUS Rounded 1c",sans-serif'; x.fillText(nick() + ' · ' + new Date().toLocaleDateString(), W / 2, cv.height + 90);
    if(serie){ TW_ALBUM_FOTOS.salvar('vip',o,serie); return; }
    // 23/11: a foto abre na câmera no jeito do Center⭐Run! (tw-camera.js): nítida, com moldura, pose, expressão e "de perto"
    function guardaMini(f){   // cópia pequena (JPEG) para o álbum do app Humor no TsuPhone e para o tapete vermelho do camarim
      try{ var mini = document.createElement('canvas'), k = 360 / f.width; mini.width = 360; mini.height = Math.round(f.height * k);
        mini.getContext('2d').drawImage(f, 0, 0, mini.width, mini.height);
        if(window.TW_HUMOR) window.TW_HUMOR.guardarFotoVip(mini.toDataURL('image/jpeg', .82)); }catch(e){}
      if(typeof petBg !== 'undefined') try{ petBg = null; }catch(e){}
    }
    var s0 = performance.now() / 1000, poseSala = vipPose;
    if(window.TW_CAMERA && TW_CAMERA.abrir({titulo:t2('vip'), arquivo:'tsulipa-camarim-vip.png', W:cv.width, H:cv.height, foco:[320, 236], pose:true, expr:true, poseInicial:vipPose,
        legenda:['👑 ' + t2('vip') + ' · TsuLiPa⭐World', nick() + ' · ' + new Date().toLocaleDateString()],
        desenhar:function(x2, W2, H2, opc, falso){ var pv = vipPose, ev = vipExpr; vipPose = opc.pose || ''; vipExpr = opc.expr; try{ dentroDesenhar(falso, 'vip', s0); } finally { vipPose = pv; vipExpr = ev; } },
        aoSalvar:guardaMini, aoFechar:function(){ vipPose = poseSala; }})) return;
    try{ var a = document.createElement('a'); a.href = (window.twMarcaPng?window.twMarcaPng(o):o.toDataURL('image/png')); a.download = 'tsulipa-camarim-vip.png'; document.body.appendChild(a); a.click(); a.remove(); }catch(e){}
    guardaMini(o);
  }

  /* ---------- frases prontas (sem chat livre) ---------- */
  function frasesHtml(){
    var P = window.TW_PRESENCA; if(!P) return '';
    return '<section class="twc-frases" aria-labelledby="twcFrasesT"><h2 id="twcFrasesT"><span aria-hidden="true">' + ico('fala', 18) + '</span>' + esc(t2('falar').replace(/^💬\s*/, '')) + '</h2><div class="twc-frases-l">' +
      P.frases.map(function(k){ return '<button type="button" data-frase="' + k + '">' + esc(P.texto(k)) + '</button>'; }).join('') + '</div>' +
      (logado() ? '' : '<p class="twc-frases-dica">' + esc(P.ui('so')) + '</p>') + '</section>';
  }

  /* ---------- entrar nos lugares (ideia do BarbieGirls, arte nossa): o Café, a Zipper⭐Shop! e o Star⭐Gacha! têm um
     "lado de dentro" com quem está online nessa rua (e a vitrine) passeando, com os balões das frases prontas.
     O botão grande abre o lugar de verdade (o mesmo card do hub, com as mesmas regras). ---------- */
  // cores: [parede em cima, piso em cima, rodameio, parede embaixo, piso embaixo]
  var DENTRO = {cafe:{cor:['#fff3e6', '#f2c49c', '#c98a5a', '#ffe1c7', '#dca47a'], ico:'cafe', nome:'Café'}, loja:{cor:['#f6ecff', '#e7d4ff', '#9a6fd6', '#ead9ff', '#cdb1f5'], ico:'loja', nome:'Zipper⭐Shop!'},
    gacha:{cor:['#ecf8ff', '#c9e8ff', '#5a9fd6', '#d6efff', '#a9d4f5'], ico:'gacha', nome:'Star⭐Gacha!'},
    vip:{cor:['#3a1a5c', '#7a2d6b', '#ffd23f', '#5a2470', '#4a1a52'], ico:'estrela', nome:'Camarim VIP'}};
  window.twMapaEntrar = function(id){ if(!cel || classico || !DENTRO[id] || !card(id)) return false; ir('dentro:' + id); return true; };
  var vipPose = ''; // apenas nesta sessão, sem persistência ou efeito em outros interiores
  var vipExpr = ''; // expressão escolhida na câmera (tw-camera.js), só enquanto ela desenha a foto
  var vipReduzMov = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function telaDentro(id){
    var d = DENTRO[id], c = id === 'vip' ? null : card(id), nome = id === 'vip' ? t2('vip') : c ? titulo(c) : d.nome;
    var botao = id === 'vip' ? '<button type="button" class="twc-btn twc-dentro-ir" data-a="vipFoto"><span class="twc-btn-ic" aria-hidden="true">' + ico('studio', 20) + '</span>' + esc(t2('vipFoto')) + '</button>'
      : '<button type="button" class="twc-btn twc-dentro-ir" data-ir="' + esc(id) + '">' + esc(t2('entrarEm', nome)) + '</button>';
    return faixa(esc(nome), id === 'vip' ? t2('vipSub') : t2('dentroSub')) + '<div class="twc-pag twc-dentro twc-dentro-' + id + '"><div class="twc-dentro-cena"><canvas id="twcDentroCv" width="640" height="400" role="img" aria-label="' + esc(nome) + '"></canvas></div>' +
      (id === 'vip' ? '<fieldset class="twc-vip-poses"><legend>' + esc(t2('vipPoseTitulo')) + '</legend>' + [['v','vipPoseV'],['coracao','vipPoseCoracao'],['tchau','vipPoseTchau']].map(function(p){ return '<button type="button" class="twc-vip-pose" data-a="vipPose" data-pose="' + p[0] + '" aria-pressed="' + (vipPose === p[0]) + '">' + esc(t2(p[1])) + '</button>'; }).join('') + '</fieldset>' : '') +
      (id === 'vip' ? '<section class="twc-vip-boas" aria-label="' + esc(t2('vip')) + '"><p>' + esc(t2('vipRecepcao')) + '</p><button type="button" class="twc-btn twc-btn-claro twc-vip-ola" data-a="vipOla">' + esc(t2('vipCumprimentar')) + '</button><small>' + esc(t2('vipDica')) + '</small></section>' : '') + botao + (id === 'vip' && window.TW_ALBUM_FOTOS ? TW_ALBUM_FOTOS.botao('data-a="vipSerie"') : '') + frasesHtml() + '</div>';
  }
  var dentroRaf = 0;
  function dentroLigar(){ if(!dentroRaf) dentroRaf = requestAnimationFrame(dentroQuadro); }
  function dentroQuadro(ms){
    dentroRaf = 0;
    var cv = $id('twcDentroCv'), v = topo(); if(!cv || v.indexOf('dentro:') !== 0 || document.hidden) return;
    try{ dentroDesenhar(cv, v.slice(7), ms / 1000); }catch(e){ return; }
    dentroRaf = requestAnimationFrame(dentroQuadro);
  }
  function dentroGente(){
    var L2 = [], vistos = {}, P = window.TW_PRESENCA, me = '';
    try{ me = logado() ? String(contaJ.nick).toLowerCase() : ''; }catch(e){}
    var trio = ['tsu', 'lirika', 'patiliri'];
    (P && P.lista ? P.lista : []).concat(typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols : []).forEach(function(p){
      var n = p && String(p.nick || '').toLowerCase(); if(!n || vistos[n] || n === me || trio.indexOf(n) >= 0 || !p.avatar) return; vistos[n] = 1; L2.push(p); });
    return L2.slice(0, 4);
  }
  function dentroDesenhar(cv, id, s){
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, d = DENTRO[id] || DENTRO.cafe, chao = H - 70, PISO = chao - 40;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    // kit de desenho no mesmo jeito do mapa: formas arredondadas, degradê suave e contorno branco + sombra de contato
    function forma(a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    function caixa(a, b, w, h, r, cor, cor2, contorno){
      forma(a, b, w, h, r);
      if(cor2){ var gg = x.createLinearGradient(0, b, 0, b + h); gg.addColorStop(0, cor); gg.addColorStop(1, cor2); x.fillStyle = gg; } else x.fillStyle = cor;
      x.fill(); if(contorno !== false){ x.strokeStyle = contorno || 'rgba(255,255,255,.9)'; x.lineWidth = 3; x.stroke(); }
    }
    function sombra(cx, cy, rx){ x.fillStyle = 'rgba(60,20,90,.14)'; x.beginPath(); x.ellipse(cx, cy, rx, rx * .16, 0, 0, 7); x.fill(); }
    function brilho(a, b, r){ x.fillStyle = 'rgba(255,255,255,.95)'; x.beginPath(); for(var i = 0; i < 8; i++){ var rr2 = i % 2 ? r * .35 : r, an = i * Math.PI / 4; x.lineTo(a + Math.cos(an) * rr2, b + Math.sin(an) * rr2); } x.closePath(); x.fill(); }
    // parede com listras + rodameio, janela com céu e varal de luzinhas
    var pg = x.createLinearGradient(0, 0, 0, PISO); pg.addColorStop(0, d.cor[0]); pg.addColorStop(1, d.cor[3] || d.cor[0]);
    x.fillStyle = pg; x.fillRect(0, 0, W, PISO);
    x.fillStyle = 'rgba(255,255,255,' + (id === 'vip' ? '.05' : '.45') + ')'; for(var i = 0; i < W; i += 44) x.fillRect(i, 0, 20, PISO);
    var pv = x.createLinearGradient(0, PISO, 0, H); pv.addColorStop(0, d.cor[1]); pv.addColorStop(1, d.cor[4] || d.cor[1]);
    x.fillStyle = pv; x.fillRect(0, PISO, W, H - PISO);
    x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 2; for(var j = -H; j < W; j += 58){ x.beginPath(); x.moveTo(j, H); x.lineTo(j + 70, PISO); x.stroke(); }
    x.fillStyle = d.cor[2]; x.fillRect(0, PISO - 6, W, 8); x.fillStyle = 'rgba(255,255,255,.5)'; x.fillRect(0, PISO - 6, W, 2);
    if(id !== 'vip'){
      caixa(W - 150, 28, 118, 92, 14, '#cfeeff', '#eaf7ff'); x.fillStyle = '#fff'; x.fillRect(W - 92, 30, 4, 88); x.fillRect(W - 148, 72, 114, 4);
      x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.ellipse(W - 120, 56, 18, 7, 0, 0, 7); x.ellipse(W - 60, 96, 14, 5, 0, 0, 7); x.fill();
      x.strokeStyle = 'rgba(123,63,240,.35)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 16); x.quadraticCurveTo(W / 2, 46, W, 16); x.stroke();
      ['#ff6fb5', '#ffd23f', '#7b3ff0', '#b6ff3b', '#4169e1'].forEach(function(c2, k){ for(var q = k; q < 16; q += 5){ var lx = 20 + q * 40, ly = 16 + Math.sin(lx / W * Math.PI) * 26;
        x.fillStyle = c2; x.globalAlpha = .55 + .45 * Math.abs(Math.sin(s * 2 + q)); x.beginPath(); x.arc(lx, ly + 7, 5.5, 0, 7); x.fill(); x.globalAlpha = 1; } });
    }
    if(id === 'cafe'){
      // vitrine de doces + balcão de madeira, quadro de menu e luminárias
      caixa(250, 44, 150, 86, 14, '#3a2a35', '#2e2029', '#c98a5a'); x.fillStyle = '#fff8e6'; x.font = '400 20px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText('MENU ♡', 325, 76);
      x.fillStyle = 'rgba(255,255,255,.75)'; x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.fillText('shake · frappé · cupcake', 325, 102);
      [140, 520].forEach(function(lx){ x.strokeStyle = '#c98a5a'; x.lineWidth = 2; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, 40); x.stroke();
        var lg = x.createRadialGradient(lx, 52, 4, lx, 70, 90); lg.addColorStop(0, 'rgba(255,236,170,.55)'); lg.addColorStop(1, 'rgba(255,236,170,0)'); x.fillStyle = lg; x.fillRect(lx - 90, 40, 180, 150);
        x.fillStyle = '#ff9cc8'; x.beginPath(); x.moveTo(lx - 18, 56); x.lineTo(lx + 18, 56); x.lineTo(lx + 10, 40); x.lineTo(lx - 10, 40); x.closePath(); x.fill(); });
      sombra(140, PISO + 2, 120);
      caixa(30, chao - 160, 220, 52, 14, '#e8f6ff', '#cde9ff'); [['#ffb3d6', '#ff6fb5'], ['#fff3a8', '#ffd23f'], ['#d8ffb0', '#7be35a'], ['#e2ccff', '#9b5cff']].forEach(function(c2, k){
        var cx2 = 62 + k * 52; caixa(cx2 - 15, chao - 140, 30, 22, 6, c2[0], null, false); x.fillStyle = c2[1]; x.beginPath(); x.arc(cx2, chao - 142, 13, Math.PI, 0); x.fill();
        x.fillStyle = '#ff3d6e'; x.beginPath(); x.arc(cx2, chao - 158, 4, 0, 7); x.fill(); });
      caixa(30, chao - 110, 220, 70, 16, '#d9a173', '#b97c50'); x.fillStyle = 'rgba(255,255,255,.25)'; x.fillRect(40, chao - 84, 200, 3); x.fillRect(40, chao - 64, 200, 3);
      sombra(500, PISO + 6, 130);
      caixa(390, chao - 104, 230, 64, 26, '#8fd3ff', '#5fb8f0'); caixa(400, chao - 132, 210, 44, 20, '#b7e4ff', '#8fd3ff');
      [430, 505, 580].forEach(function(px2){ caixa(px2 - 26, chao - 126, 52, 30, 14, '#ffd0e8', '#ffb3d6'); });
      sombra(325, PISO + 30, 40); x.fillStyle = '#c98a5a'; x.fillRect(321, chao - 62, 8, 52); caixa(290, chao - 70, 70, 12, 6, '#fff');
      caixa(306, chao - 92, 14, 22, 5, '#ff9cc8', null, false); caixa(330, chao - 88, 14, 18, 5, '#b6ff3b', null, false);
    } else if(id === 'loja'){
      // arara com roupas de verdade (vestido, saia, jaqueta), espelho de camarim e prateleira de sapatos/bolsas
      sombra(140, PISO + 2, 120);
      x.strokeStyle = '#b39ad9'; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(36, chao - 200); x.lineTo(246, chao - 200); x.moveTo(44, chao - 200); x.lineTo(44, chao - 34); x.moveTo(238, chao - 200); x.lineTo(238, chao - 34); x.stroke();
      [['#ff6fb5', 'vestido'], ['#7b3ff0', 'jaqueta'], ['#4169e1', 'saia'], ['#b6ff3b', 'vestido'], ['#ffd23f', 'jaqueta']].forEach(function(r2, k){
        var cx2 = 70 + k * 38; x.strokeStyle = '#8f7bb0'; x.lineWidth = 2; x.beginPath(); x.arc(cx2, chao - 194, 5, Math.PI, 0); x.stroke();
        x.fillStyle = r2[0]; x.strokeStyle = '#fff'; x.lineWidth = 2.5; x.beginPath();
        if(r2[1] === 'vestido'){ x.moveTo(cx2 - 9, chao - 188); x.lineTo(cx2 + 9, chao - 188); x.lineTo(cx2 + 18, chao - 112); x.lineTo(cx2 - 18, chao - 112); }
        else if(r2[1] === 'saia'){ x.moveTo(cx2 - 11, chao - 172); x.lineTo(cx2 + 11, chao - 172); x.lineTo(cx2 + 17, chao - 132); x.lineTo(cx2 - 17, chao - 132); }
        else { x.moveTo(cx2 - 15, chao - 188); x.lineTo(cx2 + 15, chao - 188); x.lineTo(cx2 + 15, chao - 128); x.lineTo(cx2 - 15, chao - 128); }
        x.closePath(); x.fill(); x.stroke(); x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(cx2 - 1, chao - 186, 2, 50); });
      sombra(530, PISO + 4, 70);
      caixa(470, chao - 236, 120, 196, 60, '#fff', '#f3eaff', '#d9c6ff'); caixa(482, chao - 224, 96, 172, 48, '#dff1ff', '#c8e2ff', false);
      x.fillStyle = 'rgba(255,255,255,.75)'; x.beginPath(); x.moveTo(500, chao - 200); x.lineTo(516, chao - 200); x.lineTo(498, chao - 150); x.lineTo(492, chao - 160); x.closePath(); x.fill();
      for(var lb = 0; lb < 8; lb++){ var an2 = Math.PI + lb / 7 * Math.PI; x.fillStyle = (Math.floor(s * 2) + lb) % 2 ? '#fff6c4' : '#ffe57a'; x.beginPath(); x.arc(530 + Math.cos(an2) * 66, chao - 176 + Math.sin(an2) * 66, 5, 0, 7); x.fill(); }
      caixa(300, chao - 150, 130, 10, 5, '#d9c6ff'); caixa(300, chao - 100, 130, 10, 5, '#d9c6ff');
      caixa(310, chao - 172, 34, 22, 8, '#ff6fb5'); x.strokeStyle = '#ff6fb5'; x.lineWidth = 3; x.beginPath(); x.arc(327, chao - 172, 10, Math.PI, 0); x.stroke();
      caixa(360, chao - 168, 54, 18, 9, '#4169e1'); caixa(312, chao - 120, 40, 20, 10, '#ffd23f'); caixa(366, chao - 118, 44, 18, 9, '#b6ff3b');
      sombra(345, chao - 26, 90); caixa(255, chao - 46, 180, 26, 13, '#ffc2e2', '#ff9cc8');
    } else if(id === 'gacha'){
      // máquina de gacha de verdade: cúpula com cápsulas que pulam, corpo, manivela e saída
      sombra(130, PISO + 4, 100);
      caixa(56, chao - 120, 148, 112, 22, '#ff6fb5', '#d94a93'); caixa(90, chao - 82, 80, 30, 12, '#fff', '#ffe3f1', false);
      x.fillStyle = '#7b3ff0'; x.beginPath(); x.arc(130, chao - 98, 13, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 4; x.beginPath(); x.moveTo(130, chao - 98); x.lineTo(130 + Math.cos(s * 1.5) * 11, chao - 98 + Math.sin(s * 1.5) * 11); x.stroke();
      var dg = x.createRadialGradient(110, chao - 200, 10, 130, chao - 170, 82); dg.addColorStop(0, 'rgba(255,255,255,.95)'); dg.addColorStop(1, 'rgba(210,236,255,.55)');
      x.fillStyle = dg; x.beginPath(); x.arc(130, chao - 172, 70, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 4; x.stroke();
      x.save(); x.beginPath(); x.arc(130, chao - 172, 66, 0, 7); x.clip();
      ['#ffd23f', '#7b3ff0', '#b6ff3b', '#4169e1', '#ff6fb5', '#fff', '#ffb300', '#5eead4'].forEach(function(c2, k){
        var cx2 = 90 + (k % 4) * 26 + (k > 3 ? 13 : 0), cy2 = chao - 140 - Math.floor(k / 4) * 26 + Math.sin(s * 3 + k) * 3;
        x.fillStyle = c2; x.beginPath(); x.arc(cx2, cy2, 12, Math.PI, 0); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(cx2, cy2, 12, 0, Math.PI); x.fill();
        x.strokeStyle = 'rgba(60,30,120,.18)'; x.lineWidth = 1.5; x.beginPath(); x.arc(cx2, cy2, 12, 0, 7); x.stroke(); });
      x.restore(); x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.ellipse(98, chao - 206, 14, 8, -.6, 0, 7); x.fill();
      caixa(96, chao - 248, 68, 18, 9, '#7b3ff0'); x.fillStyle = '#fff'; x.font = '400 11px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText('GACHA', 130, chao - 235);
      caixa(240, 40, 170, 64, 18, '#2a1d4a', '#1d1433', '#ffd23f'); x.font = '400 22px "Mochiy Pop One",sans-serif'; x.fillStyle = '#ffd23f'; x.textAlign = 'center';
      x.shadowColor = '#ffd23f'; x.shadowBlur = 12 + 6 * Math.sin(s * 3); x.fillText('★ STAR ★', 325, 80); x.shadowBlur = 0;
      caixa(420, chao - 150, 190, 10, 5, '#d9c6ff'); caixa(420, chao - 96, 190, 10, 5, '#d9c6ff');
      for(var cp = 0; cp < 6; cp++){ var c3 = ['#ff6fb5', '#ffd23f', '#7b3ff0', '#b6ff3b', '#4169e1', '#ffb300'][cp], px3 = 440 + (cp % 3) * 60, py3 = cp < 3 ? chao - 162 : chao - 108;
        x.fillStyle = c3; x.beginPath(); x.arc(px3, py3, 11, Math.PI, 0); x.fill(); x.fillStyle = '#fff'; x.beginPath(); x.arc(px3, py3, 11, 0, Math.PI); x.fill(); }
    } else if(id === 'vip'){   // Camarim VIP: cortinas de veludo, holofote, espelho de lâmpadas, tapete vermelho e cordão
      var hol = x.createRadialGradient(W / 2, 0, 10, W / 2, 140, 340); hol.addColorStop(0, 'rgba(255,240,180,.5)'); hol.addColorStop(1, 'rgba(255,240,180,0)');
      x.fillStyle = hol; x.fillRect(0, 0, W, PISO);
      [[0, 1], [W, -1]].forEach(function(cc){ var cg = x.createLinearGradient(cc[0], 0, cc[0] + cc[1] * 110, 0); cg.addColorStop(0, '#8a1250'); cg.addColorStop(1, '#c2185b');
        x.fillStyle = cg; x.beginPath(); x.moveTo(cc[0], 0); x.lineTo(cc[0] + cc[1] * 120, 0); x.quadraticCurveTo(cc[0] + cc[1] * 60, PISO * .55, cc[0] + cc[1] * 95, PISO + 10); x.lineTo(cc[0], PISO + 10); x.closePath(); x.fill();
        x.strokeStyle = 'rgba(255,255,255,.18)'; x.lineWidth = 3; for(var fz = 1; fz < 4; fz++){ x.beginPath(); x.moveTo(cc[0] + cc[1] * fz * 26, 0); x.quadraticCurveTo(cc[0] + cc[1] * fz * 18, PISO * .55, cc[0] + cc[1] * fz * 22, PISO); x.stroke(); } });
      x.fillStyle = '#ffd23f'; x.fillRect(0, 0, W, 10);
      caixa(250, 30, 140, 150, 70, '#ffd23f', '#e0a400'); caixa(262, 42, 116, 126, 58, '#efe6ff', '#d9ecff', false);
      x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.moveTo(282, 70); x.lineTo(298, 70); x.lineTo(280, 120); x.lineTo(274, 110); x.closePath(); x.fill();
      for(var lb2 = 0; lb2 < 10; lb2++){ var an = Math.PI + lb2 / 9 * Math.PI; x.fillStyle = (Math.floor(s * 3) + lb2) % 2 ? '#fff6c4' : '#ffe57a'; x.beginPath(); x.arc(320 + Math.cos(an) * 80, 105 + Math.sin(an) * 82, 6, 0, 7); x.fill(); }
      var tp = x.createLinearGradient(0, PISO, 0, H); tp.addColorStop(0, '#c2185b'); tp.addColorStop(1, '#e91e63');
      x.fillStyle = tp; x.beginPath(); x.moveTo(240, H); x.lineTo(400, H); x.lineTo(362, PISO); x.lineTo(278, PISO); x.closePath(); x.fill();
      x.fillStyle = '#ffd23f'; x.fillRect(240, H - 6, 160, 6);
      [[22, -1], [618, 1]].forEach(function(pp){   // pedestais nas bordas: ninguém fica colado neles
       x.fillStyle = '#ffd23f'; x.fillRect(pp[0] - 4, chao - 110, 8, 76); x.beginPath(); x.arc(pp[0], chao - 112, 9, 0, 7); x.fill(); caixa(pp[0] - 14, chao - 38, 28, 8, 4, '#e0a400', null, false); });
      x.strokeStyle = '#b0124f'; x.lineWidth = 8; x.lineCap = 'round'; x.beginPath(); x.moveTo(22, chao - 96); x.quadraticCurveTo(118, chao - 58, 214, chao - 96); x.moveTo(426, chao - 96); x.quadraticCurveTo(522, chao - 58, 618, chao - 96); x.stroke();
      [[110, 60, 9], [530, 70, 8], [200, 150, 6], [450, 160, 7], [320, 24, 6]].forEach(function(b2, k){ var r3 = b2[2] * (.6 + .4 * Math.abs(Math.sin(s * 1.6 + k))); x.fillStyle = '#fff6c4'; x.beginPath(); for(var i3 = 0; i3 < 8; i3++){ var rr3 = i3 % 2 ? r3 * .35 : r3, a3 = i3 * Math.PI / 4; x.lineTo(b2[0] + Math.cos(a3) * rr3, b2[1] + Math.sin(a3) * rr3); } x.closePath(); x.fill(); });
    }
    if(id !== 'vip') [[60, 150, 6], [W - 40, 160, 5], [W / 2, 30, 5]].forEach(function(b3, k){ brilho(b3[0], b3[1], b3[2] * (.6 + .4 * Math.abs(Math.sin(s * 1.4 + k)))); });
    // gente: quem está online nesta rua (com os balões das frases) + vitrine + você
    var P = window.TW_PRESENCA, gente = id === 'vip' ? [] : dentroGente(), eu = typeof hubAv === 'function' ? hubAv() : null, lugares = [215, 335, 455, 570, 100], ES = 1.72, CH = 112 * ES, agora = Date.now(), rg = dentroReage && agora - dentroReage.t0 < 2200 ? dentroReage : null;
    dentroUltimos = [];
    var todos = gente.map(function(p, k){ return {av:p.avatar, nick:p.nick, fala:p.frase ? {frase:p.frase, em:(+p.frase_em || 0) * 1000} : null, x:lugares[k]}; });
    if(id === 'vip') todos = MEMBROS.map(function(m, k){ var av = membroAv(k); return av ? {av:av.c ? {c:av.c, pose:'', expr:av.expr} : av, nick:m[1], x:[180, 455, 562][k], membro:true} : null; }).filter(Boolean);
    if(eu) todos.push({av:eu, nick:'', fala:P && P.minha, x:id === 'vip' ? 320 : lugares[todos.length] || 140, eu:true});
    todos.forEach(function(g, k){
      var cw = 104, ch = 112, px = g.x - cw * ES / 2, pulo = id === 'vip' && vipReduzMov ? 0 : Math.max(0, Math.sin(s * 2.4 + k * 1.7)) * 4, fr = s * 60 + k * 37;
      var tocado = rg && rg.k === k, rt = tocado ? (agora - rg.t0) / 1000 : 0;
      if(tocado && !(id === 'vip' && vipReduzMov)) pulo += Math.max(0, Math.sin(Math.min(1, rt / .5) * Math.PI)) * 30;
      dentroUltimos.push({x:g.x, k:k, nick:g.nick, eu:!!g.eu, membro:g.membro ? MEMBROS.findIndex(function(m){ return m[1] === g.nick; }) : -1});
      var av = {}; for(var q in g.av) av[q] = g.av[q];
      av.pose = id === 'vip' && vipPose ? vipPose : (tocado ? ['coracao', 'tchau', 'v'][k % 3] : ['tchau', 'v', 'coracao', 'mic', 'luz'][Math.floor(s / 3 + k) % 5]);
      if(id === 'vip' && g.eu && vipExpr !== '') av.expr = +vipExpr;
      x.save(); x.translate(px, chao - CH + 14 - pulo); x.scale(ES, ES);
      try{ if(typeof perfDesenharIdol === 'function') perfDesenharIdol(x, cw, ch, av, false, false, fr); }catch(e){}
      x.restore();
      if(g.nick){ x.font = '800 19px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; var tw = Math.min(140, x.measureText(g.nick).width + 22);   // legível no celular
        caixa(g.x - tw / 2, chao + 10, tw, 28, 14, 'rgba(123,63,240,.92)'); x.fillStyle = '#fff'; x.fillText(g.nick, g.x, chao + 31, tw - 8); }
      // o diamantinho do humor em cima de você (igual ao mapa). No Camarim VIP ele saiu (22/11, pedido da dona): ficava solto
      // embaixo da argola dourada, longe da cabeça, e lembrava demais o The Sims. O humor continua no ícone e no Mapa.
      if(g.eu && window.TW_HUMOR && id !== 'vip'){
        var dc = window.TW_HUMOR.cor(), gi = vipReduzMov ? 1 : Math.cos(s * 2.4), dw = 9 * Math.max(.25, Math.abs(gi)), dy = chao - CH + 62 - pulo - (vipReduzMov ? 0 : Math.sin(s * 2) * 3);
        x.fillStyle = dc; x.strokeStyle = 'rgba(30,10,60,.55)'; x.lineWidth = 2; x.beginPath(); x.moveTo(g.x, dy - 16); x.lineTo(g.x + dw, dy); x.lineTo(g.x, dy + 7); x.lineTo(g.x - dw, dy); x.closePath(); x.fill(); x.stroke();
        x.fillStyle='rgba(255,255,255,.3)';x.beginPath();x.moveTo(g.x,dy-16);x.lineTo(g.x-dw,dy);x.lineTo(g.x,dy+7);x.closePath();x.fill();
        x.strokeStyle='rgba(255,255,255,.48)';x.lineWidth=1;x.beginPath();x.moveTo(g.x,dy-16);x.lineTo(g.x,dy+7);x.moveTo(g.x-dw,dy);x.lineTo(g.x+dw,dy);x.stroke();
        x.fillStyle='rgba(255,255,255,.88)';x.beginPath();x.moveTo(g.x,dy-7);x.lineTo(g.x+3,dy-3);x.lineTo(g.x,dy+1);x.lineTo(g.x-3,dy-3);x.closePath();x.fill(); }
      var fl = g.fala; if(fl && fl.frase && P && Date.now() - fl.em < (g.eu ? 8000 : 12000)){
        var tx = P.texto(fl.frase); x.font = 'bold 16px "M PLUS Rounded 1c",sans-serif'; var lg = Math.min(220, x.measureText(tx).width + 24), by = chao - CH + 22 - pulo;
        caixa(g.x - lg / 2 - 2.5, by - 2.5, lg + 5, 35, 16, '#c9b3ff'); caixa(g.x - lg / 2, by, lg, 30, 14, '#fff'); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(g.x - 6, by + 29); x.lineTo(g.x, by + 38); x.lineTo(g.x + 6, by + 29); x.fill();
        x.fillStyle = '#5b2bb5'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(tx, g.x, by + 15.5, lg - 12); x.textBaseline = 'alphabetic'; }
      if(tocado){   // reação ao toque: coraçõezinhos subindo
        x.save(); x.textAlign = 'center'; x.font = '22px sans-serif';
        for(var h = 0; h < 5; h++){ var ft = (rt * .9 + h * .2) % 1; x.globalAlpha = Math.min(1, (2.2 - rt) * 2) * Math.sin(ft * Math.PI);
          x.fillStyle = ['#ff6fb5', '#9b30d9', '#ffd23f'][h % 3]; x.fillText('♥', g.x + (h - 2) * 20 + Math.sin(rt * 5 + h) * 6, chao - CH + 96 - ft * 70 - pulo); }
        x.restore(); }
    });
  }
  var dentroReage = null, dentroUltimos = [], carinhoEm = 0;
  function carinho(){   // um carinho conta um pouquinho na amizade (no máximo a cada 30 s, pra não virar botão de farmar)
    var a = Date.now(); if(a - carinhoEm < 30000 || !window.TW_HUMOR) return; carinhoEm = a;
    try{ window.TW_HUMOR.evento('coracao', true); }catch(e){}
  }
  function dentroClique(e){
    var cv = e.currentTarget, r = cv.getBoundingClientRect(), px = (e.clientX - r.left) * cv.width / r.width, py = (e.clientY - r.top) * cv.height / r.height, chao = cv.height - 70;
    if(py < chao - 112 * 1.72 || py > chao + 34) return;
    var melhor = null, dm = 60; dentroUltimos.forEach(function(g){ var d = Math.abs(px - g.x); if(d < dm){ dm = d; melhor = g; } });
    if(!melhor) return;
    dentroReage = {k:melhor.k, t0:Date.now()};
    if(melhor.membro >= 0 && typeof HUB_FALAS !== 'undefined'){ var L2 = HUB_FALAS[melhor.membro]; try{ if(L2 && typeof hubVozTocar === 'function') hubVozTocar(L2[Math.floor(Math.random() * (L2.length - 1))][0]); }catch(e2){} }
    else som();
    carinho();
  }

  /* ---------- O ano do TsuLiPa: calendário em tempo real (dados em tw-calendario.js) ---------- */
  var TC = {
    cal:{pt:'Calendário',en:'Calendar',es:'Calendario',id:'Kalender',th:'ปฏิทิน',ja:'カレンダー'},
    calSub:{pt:'O ano do TsuLiPa, desde o lançamento',en:'The TsuLiPa year, since launch',es:'El año de TsuLiPa, desde el lanzamiento',id:'Tahun TsuLiPa, sejak peluncuran',th:'ปีของ TsuLiPa ตั้งแต่เปิดตัว',ja:'TsuLiPaの一年、オープンから'},
    diaN:{pt:'Dia {n} do TsuLiPa⭐World',en:'Day {n} of TsuLiPa⭐World',es:'Día {n} de TsuLiPa⭐World',id:'Hari ke-{n} TsuLiPa⭐World',th:'วันที่ {n} ของ TsuLiPa⭐World',ja:'TsuLiPa⭐World {n}日目'},
    antes:{pt:'Antes do lançamento',en:'Before launch',es:'Antes del lanzamiento',id:'Sebelum peluncuran',th:'ก่อนเปิดตัว',ja:'オープン前'},
    tema:{pt:'Tema',en:'Theme',es:'Tema',id:'Tema',th:'ธีม',ja:'テーマ'},
    semana:{pt:'Evento da semana',en:'Weekly event',es:'Evento de la semana',id:'Acara minggu ini',th:'กิจกรรมประจำสัปดาห์',ja:'今週のイベント'},
    ate:{pt:'até {n}',en:'until {n}',es:'hasta {n}',id:'sampai {n}',th:'ถึง {n}',ja:'{n}まで'},
    hoje:{pt:'Hoje',en:'Today',es:'Hoy',id:'Hari ini',th:'วันนี้',ja:'今日'},
    ant:{pt:'Mês anterior',en:'Previous month',es:'Mes anterior',id:'Bulan sebelumnya',th:'เดือนก่อน',ja:'前の月'},
    prox:{pt:'Próximo mês',en:'Next month',es:'Mes siguiente',id:'Bulan berikutnya',th:'เดือนถัดไป',ja:'次の月'},
    abrir:{pt:'Ver o calendário',en:'Open the calendar',es:'Ver el calendario',id:'Lihat kalender',th:'ดูปฏิทิน',ja:'カレンダーを見る'},
    legAniv:{pt:'Tsu, Lirika e Pati',en:'Tsu, Lirika and Pati',es:'Tsu, Lirika y Pati',id:'Tsu, Lirika, dan Pati',th:'Tsu, Lirika และ Pati',ja:'Tsu・Lirika・Pati'},
    legJog:{pt:'Idols jogadores',en:'Player Idols',es:'Idols jugadores',id:'Idol pemain',th:'ไอดอลผู้เล่น',ja:'プレイヤーのアイドル'},
    legJogo:{pt:'TsuLiPa⭐World',en:'TsuLiPa⭐World',es:'TsuLiPa⭐World',id:'TsuLiPa⭐World',th:'TsuLiPa⭐World',ja:'TsuLiPa⭐World'},
    legTema:{pt:'Tema de data',en:'Seasonal theme',es:'Tema de fecha',id:'Tema musiman',th:'ธีมตามเทศกาล',ja:'季節のテーマ'}
  };
  function tc(k, n){ var d = TC[k]; var r = d ? (d[L()] || d.pt) : k; return n != null ? r.replace('{n}', n) : r; }
  var calSel = '', calMes = '', calCapsPedido = false;
  function calLimites(){ var C = window.TW_CAL, h = C.hoje(), y = +h.slice(0, 4), m = +h.slice(5, 7) + 12; y += Math.floor((m - 1) / 12); m = (m - 1) % 12 + 1; return ['2026-10', y + '-' + C.p2(m)]; }
  function calMesMover(n){ var C = window.TW_CAL; if(!C) return; var a = (calMes || C.hoje().slice(0, 7)), y = +a.slice(0, 4), m = +a.slice(5, 7) + n;
    while(m < 1){ m += 12; y--; } while(m > 12){ m -= 12; y++; } var r = y + '-' + C.p2(m), lim = calLimites(); calMes = r < lim[0] ? lim[0] : r > lim[1] ? lim[1] : r; calSel = ''; }
  function nomeMes(y, m){ try{ return new Intl.DateTimeFormat(L() === 'pt' ? 'pt-BR' : L(), {month:'long', year:'numeric', timeZone:'UTC'}).format(new Date(Date.UTC(y, m - 1, 15))).replace(/^./, function(c){ return c.toUpperCase(); }); }catch(e){ return m + '/' + y; } }
  function mesCurto(m){ try{ return new Intl.DateTimeFormat(L() === 'pt' ? 'pt-BR' : L(), {month:'short', timeZone:'UTC'}).format(new Date(Date.UTC(2026, m - 1, 15))).replace('.', ''); }catch(e){ return String(m); } }
  function dataCurta(d){ try{ return new Intl.DateTimeFormat(L() === 'pt' ? 'pt-BR' : L(), {day:'numeric', month:'long', timeZone:'UTC'}).format(new Date(Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)))); }catch(e){ return d; } }
  function falaHtml(f, cls){
    return '<div class="twc-calfala ' + (cls || '') + '"><canvas data-membro="' + f.quem + '" width="96" height="96" aria-hidden="true"></canvas><p><b>' + esc(MEMBROS[f.quem][1]) + '</b>' + esc(f.txt) + '</p></div>';
  }
  function calHojeHtml(){
    var C = window.TW_CAL; if(!C) return ''; calAniversarios();
    var h = C.hoje(), n = C.diaN(h), te = C.tema(h), mk = C.marcas(h), mes = C.doMes(+h.slice(5, 7)), ev = mk[0] || (te ? {nome:te.nome, cor:te.cor} : mes);
    return '<button type="button" class="twc-card twc-calhoje" data-v="cal" aria-label="' + esc(tc('abrir')) + '">' +
      '<span class="twc-caldata" style="--c:' + (ev && ev.cor || '#7b3ff0') + '"><small>' + esc(mesCurto(+h.slice(5, 7))) + '</small><b>' + (+h.slice(8, 10)) + '</b></span>' +
      '<span class="twc-calhoje-t"><em>' + esc(n >= 1 ? tc('diaN', n) : tc('antes')) + (ev ? ' · ' + esc(ev.nome) : '') + '</em>' + falaHtml(C.fala(h), 'twc-calfala-mini') + '</span>' +
      '<span class="twc-calhoje-ir" aria-hidden="true">' + ico('cal', 20) + '</span></button>';
  }
  var calAnivPedido = 0;
  function calAniversarios(){   // aniversários dos jogadores (dia e mês), uma vez a cada 10 minutos
    if(calAnivPedido && Date.now() - calAnivPedido < 6e5) return; calAnivPedido = Date.now();
    if(typeof contaRpc !== 'function' || !window.TW_CAL || !window.TW_CAL.jogadores) return;
    contaRpc('calendario_aniversarios').then(function(r){ window.TW_CAL.jogadores(r); if(topo() === 'cal' || topo() === 'menu') desenhar(); }).catch(function(){ calAnivPedido = 0; });
  }
  var CAL_ACOES = {
    pt:['Abrir atividade','Adicionar ao meu calendário','Festival desta semana','Prazo no seu horário','Ler capítulo'],
    en:['Open activity','Add to my calendar','This week’s Festival','Deadline in your time zone','Read chapter'],
    es:['Abrir actividad','Añadir a mi calendario','Festival de esta semana','Plazo en tu horario','Leer capítulo'],
    id:['Buka aktivitas','Tambah ke kalender saya','Festival minggu ini','Batas waktu di zona waktumu','Baca bab'],
    th:['เปิดกิจกรรม','เพิ่มลงในปฏิทินของฉัน','เทศกาลสัปดาห์นี้','กำหนดส่งตามเวลาท้องถิ่น','อ่านตอน'],
    ja:['アクティビティを開く','マイカレンダーに追加','今週のフェスティバル','現地時間での締め切り','エピソードを読む']
  };
  function calFestival(sabado){
    var meioDia = Date.parse(sabado + 'T12:00:00Z');
    if(!Number.isFinite(meioDia) || new Date(meioDia).getUTCDay() !== 6) return null;
    var virada = hubFestivalVirada(meioDia);
    if(virada <= Date.now()) return null;
    return {nome:tt('Festival de Unidades'), musica:hubMusicaSemana(meioDia)[1], prazo:virada - 60000, virada:virada,
      atual:virada === hubFestivalVirada(), cor:'#7b3ff0', ic:'karaoke'};
  }
  function calIcs(sabado){
    var f = calFestival(sabado); if(!f) return;
    function iso(ms){ return new Date(ms).toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z'; }
    function campo(t){ return t.replace(/[\\;,]/g, '\\$&').replace(/\r?\n/g, '\\n'); }
    var arquivo = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//TsuLiPa World//Festival//PT','BEGIN:VEVENT',
      'UID:festival-' + sabado + '@tsulipa-world.vercel.app','DTSTAMP:' + iso(Date.now()),'DTSTART:' + iso(f.prazo),
      'DTEND:' + iso(f.virada),'SUMMARY:' + campo(f.nome),'DESCRIPTION:' + campo(f.musica),
      'URL:https://tsulipa-world.vercel.app/festival.html','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    var a = document.createElement('a'), url = URL.createObjectURL(new Blob([arquivo], {type:'text/calendar;charset=utf-8'}));
    a.href = url; a.download = 'tsulipa-festival-' + sabado + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 30000);
  }
  function telaCal(){
    calAniversarios();
    // As marcas da temporada vêm com os quadrinhos. Uma falha não dispara novos pedidos a cada atualização.
    if(!calCapsPedido && typeof jnT1Disponivel !== 'function' && typeof window.jornalCapsCarregar === 'function'){
      calCapsPedido = true;
      window.jornalCapsCarregar(function(ok){ if(ok && topo() === 'cal') desenhar(); });
    }
    var C = window.TW_CAL; if(!C) return faixa(esc(tc('cal')), tc('calSub')) + '<div class="twc-pag"></div>';
    var h = C.hoje(); if(!calMes) calMes = h.slice(0, 7); if(!calSel) calSel = calMes === h.slice(0, 7) ? h : calMes + '-01';
    var y = +calMes.slice(0, 4), m = +calMes.slice(5, 7), lim = calLimites(), dias = new Date(Date.UTC(y, m, 0)).getUTCDate(), w0 = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
    var sem = []; for(var i = 0; i < 7; i++){ try{ sem.push(new Intl.DateTimeFormat(L() === 'pt' ? 'pt-BR' : L(), {weekday:'narrow', timeZone:'UTC'}).format(new Date(Date.UTC(2026, 10, 1 + i)))); }catch(e){ sem.push('DSTQQSS'[i]); } }
    var cel2 = []; for(var b = 0; b < w0; b++) cel2.push('<span class="twc-cald twc-cald-v" aria-hidden="true"></span>');
    for(var d = 1; d <= dias; d++){
      var ds = calMes + '-' + C.p2(d), mk = C.marcas(ds), te = C.tema(ds), antes = ds < C.inicio;
      var fest = calFestival(ds); if(fest) mk = mk.concat(fest);
      var cls = 'twc-cald' + (ds === h ? ' twc-cald-hoje' : '') + (ds === calSel ? ' twc-cald-sel' : '') + (antes ? ' twc-cald-antes' : '') + (te && !antes ? ' twc-cald-tema' : '');
      var rot = dataCurta(ds) + (mk.length ? ': ' + mk.map(function(x){ return x.nome; }).join(', ') : '') + (te && !antes ? ' · ' + te.nome : '');
      cel2.push('<button type="button" class="' + cls + '" data-cald="' + ds + '"' + (te && !antes ? ' style="--t:' + te.cor + '"' : '') + ' aria-label="' + esc(rot) + '" aria-pressed="' + (ds === calSel) + '"><b>' + d + '</b>' +
        (mk.length ? '<i style="--c:' + mk[0].cor + '">' + ico(mk[0].ic, 13) + '</i>' : '') + '</button>');
    }
    var mes = C.doMes(m), sd = calSel, smk = C.marcas(sd), ste = C.tema(sd), sse = C.semana(sd), sn = C.diaN(sd);
    var tx = CAL_ACOES[L()] || CAL_ACOES.pt, festival = calFestival(sd), acoes = '';
    var itens = smk.map(function(x){
      if(sd <= h && (x.k === 'cap' || x.k === 'capT1')){
        acoes += '<button type="button" class="twc-btn twc-btn-claro" data-cal-cap="' + x.k + '">' +
          esc(tx[4] + ' · ' + x.nome) + '</button>';
      }
      return '<li style="--c:' + x.cor + '"><span>' + ico(x.ic, 16) + '</span>' + esc(x.nome) + '</li>';
    });
    var prazo = '';
    if(festival){
      itens.push('<li style="--c:' + festival.cor + '"><span>' + ico(festival.ic, 16) + '</span>' +
        esc(festival.nome + ' · ' + festival.musica) + '</li>');
      var hora = new Intl.DateTimeFormat(L() === 'pt' ? 'pt-BR' : L(), {dateStyle:'medium', timeStyle:'short'}).format(festival.prazo);
      prazo = '<p class="twc-cal-hora">' + esc(tx[3]) + ' · <time datetime="' + new Date(festival.prazo).toISOString() + '">' + esc(hora) + '</time></p>';
      if(festival.atual) acoes += '<button type="button" class="twc-btn twc-btn-claro" id="twcCalFestival" data-a="festival">' + esc(tx[0]) + '</button>';
      acoes += '<button type="button" class="twc-btn twc-btn-claro" data-cal-ics="' + sd + '">' + esc(tx[1]) + '</button>';
    }else if(sd === h){
      var sabado = new Date(hubFestivalVirada() - 4 * 36e5).toISOString().slice(0, 10);
      acoes += '<button type="button" class="twc-btn twc-btn-claro" id="twcCalSemana" data-cal-dia="' + sabado + '">' + esc(tx[2]) + '</button>';
    }
    if(ste) itens.push('<li style="--c:' + ste.cor + '"><span>' + ico('estrela', 16) + '</span>' + esc(tc('tema')) + ': ' + esc(ste.nome) + ' <small>' + esc(tc('ate', ste.ate.slice(3) + '/' + ste.ate.slice(0, 2))) + '</small></li>');
    if(sse && sd >= C.inicio) itens.push('<li style="--c:' + sse.cor + '"><span>' + ico('cal', 16) + '</span>' + esc(tc('semana')) + ': ' + esc(sse.nome) + '</li>');
    if(mes) itens.push('<li style="--c:' + mes.cor + '"><span>' + ico(mes.k === 'mesLirika' ? 'bolo' : 'trio', 16) + '</span>' + esc(mes.nome) + '</li>');
    return faixa(esc(tc('cal')), tc('calSub')) + '<div class="twc-pag twc-cal">' +
      '<section class="twc-card twc-calmes"><div class="twc-calcab">' +
        '<button type="button" class="twc-calnav" data-calmes="-1"' + (calMes <= lim[0] ? ' disabled' : '') + ' aria-label="' + esc(tc('ant')) + '">‹</button>' +
        '<h2>' + esc(nomeMes(y, m)) + '</h2>' +
        '<button type="button" class="twc-calnav" data-calmes="1"' + (calMes >= lim[1] ? ' disabled' : '') + ' aria-label="' + esc(tc('prox')) + '">›</button></div>' +
        (mes ? '<p class="twc-calfaixa" style="--c:' + mes.cor + '">' + ico(mes.k === 'mesLirika' ? 'bolo' : 'trio', 15) + esc(mes.nome) + '</p>' : '') +
        '<div class="twc-calgrade" role="group" aria-label="' + esc(nomeMes(y, m)) + '">' + sem.map(function(x){ return '<span class="twc-calsem" aria-hidden="true">' + esc(x) + '</span>'; }).join('') + cel2.join('') + '</div>' +
        '<p class="twc-legenda twc-callegenda"><span><i style="--c:#9b30d9">' + ico('bolo', 12) + '</i>' + esc(tc('legAniv')) + '</span><span><i style="--c:#ff8a3d">' + ico('bolo', 12) + '</i>' + esc(tc('legJog')) + '</span><span><i style="--c:#7b3ff0">' + ico('estrela', 12) + '</i>' + esc(tc('legJogo')) + '</span><span><i class="twc-callg-tema"></i>' + esc(tc('legTema')) + '</span></p>' +
      '</section>' +
      '<section class="twc-card twc-caldia" id="twcCalDia" aria-live="polite"><h2>' + esc(dataCurta(sd)) + (sd === h ? ' · ' + esc(tc('hoje')) : '') + '</h2>' +
        '<small class="twc-caldn">' + esc(sn >= 1 ? tc('diaN', sn) : tc('antes')) + '</small>' +
        (itens.length ? '<ul class="twc-calitens">' + itens.join('') + '</ul>' : '') +
        prazo + (acoes ? '<div class="twc-cal-acoes">' + acoes + '</div>' : '') +
        (sd >= C.inicio ? falaHtml(C.fala(sd)) : '') + '</section>' +
      // Poda de 22/11 (dona): "Esta semana" (show de sábado, festa, jogo da semana, retrospectiva) saiu do Início e mora aqui
      (window.TW_SEMANA ? '<div class="twc-cal-semana">' + window.TW_SEMANA.html() + '</div>' : '') + '</div>';
  }

  /* ---------- Tour de camarins: o camarim (Backstage⭐Pet!) de outros Idols, com 1 coração por dia em cada um ---------- */
  var TT = {
    tour:{pt:'Tour de camarins',en:'Dressing room tour',es:'Tour de camerinos',id:'Tur ruang ganti',th:'ทัวร์ห้องแต่งตัว',ja:'楽屋ツアー'},
    tourSub:{pt:'Visite o camarim de outros Idols',en:"Visit other Idols' dressing rooms",es:'Visita el camerino de otros Idols',id:'Kunjungi ruang ganti Idol lain',th:'ไปเยี่ยมห้องแต่งตัวของไอดอลคนอื่น',ja:'ほかのアイドルの楽屋へ'},
    vazio:{pt:'Ainda não tem camarim para visitar. Volte daqui a pouco!',en:'No dressing rooms to visit yet. Come back soon!',es:'Aún no hay camerinos para visitar. ¡Vuelve pronto!',id:'Belum ada ruang ganti untuk dikunjungi. Kembali lagi nanti!',th:'ยังไม่มีห้องให้เยี่ยม กลับมาใหม่นะ!',ja:'まだ見られる楽屋がないよ。またあとでね！'},
    carregando:{pt:'Abrindo as portas…',en:'Opening the doors…',es:'Abriendo las puertas…',id:'Membuka pintu…',th:'กำลังเปิดประตู…',ja:'ドアをあけてるよ…'},
    camarimDe:{pt:'Camarim de {n}',en:"{n}'s dressing room",es:'Camerino de {n}',id:'Ruang ganti {n}',th:'ห้องแต่งตัวของ {n}',ja:'{n}の楽屋'},
    darCor:{pt:'Deixar um coração',en:'Leave a heart',es:'Dejar un corazón',id:'Beri hati',th:'ส่งหัวใจ',ja:'ハートをおくる'},
    deu:{pt:'Coração deixado hoje!',en:'Heart left today!',es:'¡Corazón dejado hoy!',id:'Hati sudah dikirim hari ini!',th:'ส่งหัวใจวันนี้แล้ว!',ja:'今日はハートをおくったよ！'},
    login:{pt:'Entre na sua conta para deixar corações',en:'Sign in to leave hearts',es:'Entra en tu cuenta para dejar corazones',id:'Masuk untuk memberi hati',th:'เข้าสู่ระบบเพื่อส่งหัวใจ',ja:'ハートをおくるにはログインしてね'},
    prox:{pt:'Próximo camarim',en:'Next dressing room',es:'Siguiente camerino',id:'Ruang ganti berikutnya',th:'ห้องถัดไป',ja:'つぎの楽屋'},
    erro:{pt:'Não deu para abrir agora. Tente de novo!',en:"Couldn't open it now. Try again!",es:'No se pudo abrir ahora. ¡Inténtalo de nuevo!',id:'Belum bisa dibuka. Coba lagi!',th:'เปิดไม่ได้ตอนนี้ ลองใหม่นะ!',ja:'いまは開けなかった。もう一度ためしてね！'}
  };
  function tt2(k, n){ var d = TT[k]; var r = d ? (d[L()] || d.pt) : k; return n != null ? r.replace('{n}', n) : r; }
  var tourLista = null, tourDados = {}, tourPedido = 0;
  function tourCarregar(){
    if(tourPedido && Date.now() - tourPedido < 30000) return; tourPedido = Date.now();
    if(typeof contaRpc !== 'function'){ tourLista = []; return; }
    contaRpc('camarim_tour').then(function(r){ tourLista = Array.isArray(r) ? r : []; if(topo() === 'tour') desenhar(); })
      .catch(function(){ tourLista = tourLista || []; tourPedido = 0; if(topo() === 'tour') desenhar(); });
  }
  function corOshi(o){ return {tsu:'#9b30d9', lirika:'#3cb043', pati:'#4169e1'}[o] || '#ff6fb5'; }
  function telaTour(){
    if(!tourLista) tourCarregar();
    var L2 = tourLista || [];
    return faixa(esc(tt2('tour')), tt2('tourSub')) + (window.TW_RITMO ? '<p class="twc-pag tw-tour-aviso">'+esc(TW_RITMO.t(26))+'</p>' : '') + '<div class="twc-pag twc-tour">' + (tourLista === null ? '<p class="twc-tour-msg">' + esc(tt2('carregando')) + '</p>' :
      !L2.length ? '<p class="twc-tour-msg">' + esc(tt2('vazio')) + '</p>' :
      '<div class="twc-tour-grade">' + L2.map(function(p, i){
        return '<button type="button" class="twc-card twc-tour-item" data-v="tour:' + esc(p.nick) + '" style="--c:' + corOshi(p.oshi) + '"><canvas data-tav="' + i + '" width="120" height="120" aria-hidden="true"></canvas>' +
          '<b translate="no">' + esc(p.nick) + '</b><small><span aria-hidden="true">♥</span> ' + (+p.coracoes || 0) + (p.dei ? ' · ✓' : '') + '</small></button>'; }).join('') + '</div>') + '</div>';
  }
  function tourAvatares(){
    [].slice.call(cel.querySelectorAll('canvas[data-tav]')).forEach(function(cv){ var p = tourLista && tourLista[+cv.getAttribute('data-tav')];
      try{ if(p && p.avatar && typeof perfFotoRedonda === 'function') perfFotoRedonda(cv, p.avatar, true); }catch(e){} });
  }
  function telaTourVer(nick){
    var d = tourDados[nick.toLowerCase()];
    if(!d){ tourAbrir(nick); return faixa(esc(tt2('camarimDe', nick)), tt2('tourSub')) + '<div class="twc-pag twc-tour"><p class="twc-tour-msg">' + esc(tt2('carregando')) + '</p></div>'; }
    if(d.erro) return faixa(esc(tt2('camarimDe', nick)), tt2('tourSub')) + '<div class="twc-pag twc-tour"><p class="twc-tour-msg">' + esc(tt2('erro')) + '</p></div>';
    var idx = (tourLista || []).findIndex(function(p){ return p.nick.toLowerCase() === nick.toLowerCase(); }), prox = tourLista && tourLista.length > 1 ? tourLista[(idx + 1) % tourLista.length] : null;
    return faixa(esc(tt2('camarimDe', d.nick)), tt2('tourSub')) + '<div class="twc-pag twc-tour">' +
      '<section class="twc-card twc-tour-cena" style="--c:' + corOshi(d.oshi) + '"><canvas id="twcTourCv" width="720" height="440" role="img" aria-label="' + esc(tt2('camarimDe', d.nick)) + '"></canvas>' +
        '<div class="twc-tour-bar"><span class="twc-tour-cor" aria-live="polite"><b>♥ ' + (+d.coracoes || 0) + '</b></span>' +
        (d.eu ? '' : '<button type="button" class="twc-btn twc-tour-btn" data-tourcor="' + esc(d.nick) + '"' + (d.dei ? ' disabled' : '') + '>' + ico('coracao', 18) + ' ' + esc(d.dei ? tt2('deu') : tt2('darCor')) + '</button>') + '</div></section>' +
      (prox && prox.nick.toLowerCase() !== nick.toLowerCase() ? '<button type="button" class="twc-btn twc-btn-claro twc-btn-link" data-v="tour:' + esc(prox.nick) + '">' + esc(tt2('prox')) + ' · ' + esc(prox.nick) + ' ›</button>' : '') + '</div>';
  }
  function tourAbrir(nick){
    var k = nick.toLowerCase(); if(tourDados[k] && !tourDados[k].erro) return; tourDados[k] = null;
    var feito = function(d){ tourDados[k] = d && d.nick ? d : {erro:true}; if(topo() === 'tour:' + nick) desenhar(); };
    var abre = function(){ contaRpc('camarim_ver', {p_nick:nick}).then(feito).catch(function(){ feito(null); }); };
    if(typeof petSalaCarregar === 'function') petSalaCarregar().then(abre, abre); else abre();
  }
  function tourDesenhar(){
    var cv = $id('twcTourCv'), v = topo(); if(!cv || v.indexOf('tour:') !== 0) return;
    var d = tourDados[v.slice(5).toLowerCase()]; if(!d || d.erro) return;
    var x = cv.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cv.width, cv.height);
    if(typeof petMakeBg !== 'function' || typeof drawPet !== 'function' || typeof OSHI === 'undefined' || typeof petData === 'undefined') return;
    // desenha com o camarim do visitado e devolve tudo do jeito que estava (o seu camarim não muda)
    var o = {data:petData, arr:petArrumo, bg:petBg, oshi:OSHI, dpr:petDpr, tema:petTemaOn, bgO:petBgOshi, bgF:petBgFase};
    try{
      var pets = {}; pets[d.ativo] = d.pet || {};
      petData = {ativo:d.ativo, pets:pets, decor:d.decor || {}, inv:{}, roupas:{}, rec:{}, donos:{}, dia:''};
      petArrumo = {v:1, chao:{}, parede:{}}; OSHI = d.oshi || ''; petDpr = 2; petBg = null; petTemaOn = '';
      petMakeBg(); x.save(); x.scale(cv.width / 360, cv.height / 220); x.drawImage(petBg, 0, 0, 360, 220);
      if(d.avatar && typeof perfDesenharIdol === 'function'){ x.save(); x.translate(18, PET_FLOOR - 112 * 1.45 + 10); x.scale(1.45, 1.45);
        try{ var av = {}; for(var q in d.avatar) av[q] = d.avatar[q]; av.pose = 'tchau'; perfDesenharIdol(x, 104, 112, av, false, false, 40); }catch(e){} x.restore(); }
      x.fillStyle = 'rgba(80,30,120,.18)'; x.beginPath(); x.ellipse(PET_X, PET_FLOOR + 2, 26, 5, 0, 0, 7); x.fill();
      drawPet(x, petType(d.ativo), PET_X, PET_FLOOR - 12 * PET_SC, PET_SC, 0, 'feliz');
      if(d.pet && d.pet.nome){ x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; var nw = x.measureText(d.pet.nome).width + 18;
        x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); x.roundRect ? x.roundRect(PET_X - nw / 2, PET_FLOOR - 116, nw, 18, 9) : x.rect(PET_X - nw / 2, PET_FLOOR - 116, nw, 18); x.fill();
        x.fillStyle = corOshi(d.oshi); x.fillText(d.pet.nome, PET_X, PET_FLOOR - 103); }
      x.restore();
    }catch(e){}
    finally{ petData = o.data; petArrumo = o.arr; petBg = o.bg; OSHI = o.oshi; petDpr = o.dpr; petTemaOn = o.tema; petBgOshi = o.bgO; petBgFase = o.bgF; }
  }
  function tourCoracao(nick, b){
    if(!logado()){ toast(tt2('login'), 'coracao'); return; }
    b.disabled = true;
    contaRpc('camarim_coracao', {p_nick:nick}).then(function(r){
      var d = tourDados[nick.toLowerCase()];
      if(r && (r.ok || r.erro === 'feito')){ if(d){ d.dei = true; if(r.coracoes) d.coracoes = r.coracoes; }
        (tourLista || []).forEach(function(p){ if(p.nick.toLowerCase() === nick.toLowerCase()){ p.dei = true; if(r.coracoes) p.coracoes = r.coracoes; } });
        som(); carinho(); toast(tt2('deu'), 'coracao'); desenhar(); }
      else { b.disabled = false; toast(tt2('erro')); }
    }).catch(function(){ b.disabled = false; toast(tt2('erro')); });
  }

  /* ---------- Fichinhas do trio (dados do perfil oficial no blog do BRS48, Draft 1st Generation) + mapa de amizades ----------
     Fonte: brs48.blogspot.com/2021/08/{tsu,lirika,pati}.html. Só o que o blog informa (sem ano de nascimento). */
  var FICHAS = [
    {k:0, nome:'Miniwa Tsumiki', jp:'御庭つみき', apelido:'Tsu (つ)', aniv:'05/09', local:'Paraíba, Brasil', altura:'1,80 m', time:'Team S · Sub-Captain', cor:['#9b30d9', 'Violeta'],
      pet:['🐈', 'Chu'], frase:'Oiê! Sou o Tsu, membro da primeira geração draft do BRS48!', blog:'https://brs48.blogspot.com/2021/08/tsu.html',
      gostos:{pt:'Ouvir música, pudim, cozinhar frango, playlists dos anos 60, dias de chuva, BNK48, AKB48, Dal Shabet',en:'Listening to music, pudding, cooking chicken, 1960s playlists, rainy days, BNK48, AKB48, Dal Shabet',es:'Escuchar música, flan, cocinar pollo, playlists de los 60, días de lluvia, BNK48, AKB48, Dal Shabet',id:'Dengar musik, puding, masak ayam, playlist tahun 60-an, hari hujan, BNK48, AKB48, Dal Shabet',th:'ฟังเพลง, พุดดิ้ง, ทำไก่, เพลย์ลิสต์ยุค 60, วันฝนตก, BNK48, AKB48, Dal Shabet',ja:'音楽をきくこと、プリン、チキン料理、60年代のプレイリスト、雨の日、BNK48、AKB48、Dal Shabet'}, audicao:'Twinkle Twinkle (Secret)', oshis:'Chiba Erii'},
    {k:1, nome:'Shiroma Lirika', jp:'城間りりか', apelido:'Lirika (りりか)', aniv:{pt:'maio',en:'May',es:'mayo',id:'Mei',th:'พฤษภาคม',ja:'5月'}, local:'São Paulo, Brasil', altura:'1,40 m', time:'Team S', cor:['#4fa81a', 'Verde Limão'],
      pet:['🐨', 'Koali'], frase:'Shiroma Lirika desu, yoroshiku onegaishima~su!', blog:'https://brs48.blogspot.com/2021/08/lirika.html',
      gostos:{pt:'Verde, K-pop, IZ*ONE, =LOVE, idols japonesas, falar japonês',en:'Green, K-pop, IZ*ONE, =LOVE, Japanese idols, speaking Japanese',es:'El verde, K-pop, IZ*ONE, =LOVE, idols japonesas, hablar japonés',id:'Hijau, K-pop, IZ*ONE, =LOVE, idol Jepang, berbahasa Jepang',th:'สีเขียว, เคป็อป, IZ*ONE, =LOVE, ไอดอลญี่ปุ่น, พูดภาษาญี่ปุ่น',ja:'緑、K-POP、IZ*ONE、=LOVE、日本のアイドル、日本語'}, audicao:'Oogoe Diamond (AKB48)', oshis:'Imamura Maria'},
    {k:2, nome:'Patiliri Kriyl', jp:'パチリリ・クリイル', apelido:'Pati (パチ)', aniv:'23/09', local:'São Paulo, Brasil', altura:'', time:'Team S', cor:['#4169e1', 'Azul Real'],
      pet:['👑', 'Pucchi'], frase:'Conte com o Pati pra deixar seu dia mais feliz!! Beijinhos e Patchau!!', blog:'https://brs48.blogspot.com/2021/08/pati.html',
      gostos:{pt:'Cantar, dançar, desenhar, criar looks, sapatos, bolsas, mahou shoujo, animes de idol, stream de joguinhos, músicas do AKB48',en:'Singing, dancing, drawing, putting looks together, shoes, bags, magical girls, idol anime, game streams, AKB48 songs',es:'Cantar, bailar, dibujar, crear looks, zapatos, bolsos, mahou shoujo, animes de idols, streams de juegos, canciones de AKB48',id:'Menyanyi, menari, menggambar, bikin outfit, sepatu, tas, mahou shoujo, anime idol, streaming game, lagu AKB48',th:'ร้องเพลง, เต้น, วาดรูป, แต่งตัว, รองเท้า, กระเป๋า, สาวน้อยเวทมนตร์, อนิเมะไอดอล, สตรีมเกม, เพลง AKB48',ja:'歌、ダンス、お絵かき、コーデ、くつ、バッグ、魔法少女、アイドルアニメ、ゲーム配信、AKB48の曲'}, audicao:'Dear... (iDOLM@STER)', oshis:'Imamura Maria · Shitao Miu · Oguri Yui'}];
  var TF = {
    trio:{pt:'TsuLiPa',en:'TsuLiPa',es:'TsuLiPa',id:'TsuLiPa',th:'TsuLiPa',ja:'TsuLiPa'},
    fichas:{pt:'Fichinhas',en:'Profiles',es:'Fichas',id:'Profil',th:'โปรไฟล์',ja:'プロフィール'},
    trioSub:{pt:'Fichinhas do Tsu, da Lirika e do Pati',en:'Profiles of Tsu, Lirika and Pati',es:'Fichas de Tsu, Lirika y Pati',id:'Profil Tsu, Lirika, dan Pati',th:'โปรไฟล์ของ Tsu, Lirika และ Pati',ja:'Tsu・Lirika・Patiのプロフィール'},
    aniv:{pt:'Aniversário',en:'Birthday',es:'Cumpleaños',id:'Ulang tahun',th:'วันเกิด',ja:'誕生日'},
    local:{pt:'De',en:'From',es:'De',id:'Dari',th:'จาก',ja:'出身'},
    altura:{pt:'Altura',en:'Height',es:'Altura',id:'Tinggi',th:'ส่วนสูง',ja:'身長'},
    time:{pt:'Time',en:'Team',es:'Equipo',id:'Tim',th:'ทีม',ja:'チーム'},
    geracao:{pt:'Geração',en:'Generation',es:'Generación',id:'Generasi',th:'รุ่น',ja:'期'},
    cor:{pt:'Cor',en:'Color',es:'Color',id:'Warna',th:'สี',ja:'カラー'},
    cantaram:{pt:'{n} músicas que cantaram juntos',en:'{n} songs they sang together',es:'{n} canciones que cantaron juntos',id:'{n} lagu yang dinyanyikan bersama',th:'{n} เพลงที่ร้องด้วยกัน',ja:'いっしょに歌った曲：{n}曲'},
    soDois:{pt:'{n} só os dois',en:'{n} just the two of them',es:'{n} solo los dos',id:'{n} hanya berdua',th:'{n} เพลงแค่สองคน',ja:'ふたりだけで{n}曲'},
    comTrio:{pt:'Também com {q}: {n} músicas do trio',en:'Also with {q}: {n} trio songs',es:'También con {q}: {n} canciones del trío',id:'Juga bersama {q}: {n} lagu trio',th:'กับ {q} ด้วย: {n} เพลงของทั้งสาม',ja:'{q}もいっしょ：3人の曲{n}曲'},
    verTodas:{pt:'Ver mais {n}',en:'See {n} more',es:'Ver {n} más',id:'Lihat {n} lagi',th:'ดูอีก {n}',ja:'あと{n}曲を見る'},
    unitFest:{pt:'A unit TsuLiPa no Unit Festival',en:'The TsuLiPa unit at Unit Festival',es:'La unit TsuLiPa en el Unit Festival',id:'Unit TsuLiPa di Unit Festival',th:'ยูนิต TsuLiPa ใน Unit Festival',ja:'Unit FestivalのTsuLiPa'},
    audicao:{pt:'Música da audição',en:'Audition song',es:'Canción de la audición',id:'Lagu audisi',th:'เพลงออดิชัน',ja:'オーディション曲'},
    oshis:{pt:'Oshis',en:'Oshis',es:'Oshis',id:'Oshi',th:'โอชิ',ja:'推し'},
    gosta:{pt:'Gosta de',en:'Likes',es:'Le gusta',id:'Suka',th:'ชอบ',ja:'すきなもの'},
    pet:{pt:'Pet',en:'Pet',es:'Mascota',id:'Hewan',th:'สัตว์เลี้ยง',ja:'ペット'},
    amizades:{pt:'Amizades',en:'Friendship',es:'Amistades',id:'Persahabatan',th:'มิตรภาพ',ja:'なかよし'},
    ouvir:{pt:'Ouvir',en:'Listen',es:'Escuchar',id:'Dengar',th:'ฟัง',ja:'きく'},
    blog:{pt:'Perfil no blog oficial',en:'Profile on the official blog',es:'Perfil en el blog oficial',id:'Profil di blog resmi',th:'โปรไฟล์ในบล็อกทางการ',ja:'公式ブログのプロフィール'},
    mapaAmigos:{pt:'Mapa de amizades',en:'Friendship map',es:'Mapa de amistades',id:'Peta pertemanan',th:'แผนผังมิตรภาพ',ja:'なかよしマップ'},
    unitTrio:{pt:'unit TsuLiPa',en:'TsuLiPa unit',es:'unit TsuLiPa',id:'unit TsuLiPa',th:'ยูนิต TsuLiPa',ja:'ユニットTsuLiPa'},
    dupla:{pt:'dupla NeByur✰',en:'NeByur✰ duo',es:'dúo NeByur✰',id:'duo NeByur✰',th:'ดูโอ NeByur✰',ja:'デュオNeByur✰'},
    mesmaGeracao:{pt:'Os três entraram juntos: Draft 1st Generation · ago/2021',en:'All three joined together: Draft 1st Generation · Aug 2021',es:'Los tres entraron juntos: Draft 1st Generation · ago/2021',id:'Bertiga masuk bersama: Draft 1st Generation · Agu 2021',th:'ทั้งสามเข้ามาพร้อมกัน: Draft 1st Generation · ส.ค. 2021',ja:'3人いっしょに加入：ドラフト1期生・2021年8月'},
    toque:{pt:'Toque no Tsu, na Lirika, no Pati ou nos pets',en:'Tap Tsu, Lirika, Pati or the pets',es:'Toca a Tsu, Lirika, Pati o las mascotas',id:'Ketuk Tsu, Lirika, Pati, atau hewannya',th:'แตะ Tsu, Lirika, Pati หรือสัตว์เลี้ยง',ja:'Tsu・Lirika・Patiやペットをタップしてね'}
  };
  function tf(k){ var d = TF[k]; return d ? (d[L()] || d.pt) : k; }
  // Laços do trio — fatos dos perfis oficiais (brs48.blogspot.com/2021/08/{tsu,lirika,pati}.html) e da NeByur✰.
  var amigosSel = 3;
  function T6(pt, en, es, id, th, ja){ return {pt:pt, en:en, es:es, id:id, th:th, ja:ja}; }
  var LACOS = [
    {par:[0, 1], nome:T6('Tsu & Lirika','Tsu & Lirika','Tsu y Lirika','Tsu & Lirika','Tsu & Lirika','Tsu＆Lirika'), ic:'estrela', fatos:[
      T6('Entraram juntos como kenkyuusei em agosto de 2021','Joined together as kenkyuusei in August 2021','Entraron juntos como kenkyuusei en agosto de 2021','Masuk bersama sebagai kenkyuusei pada Agustus 2021','เข้ามาเป็นเค็นคิวเซย์พร้อมกันในเดือนสิงหาคม 2021','2021年8月にいっしょに研究生として加入'),
      T6('Promovidos ao Team S no mesmo dia: 26/02/2023','Promoted to Team S on the same day: 26/02/2023','Ascendidos al Team S el mismo día: 26/02/2023','Naik ke Team S di hari yang sama: 26/02/2023','ได้เลื่อนขึ้น Team S วันเดียวกัน: 26/02/2023','同じ日にTeam Sへ昇格：2023/02/26'),
      T6('Os dois cantaram Oshibe to Meshibe to Yoru no Chouchou, cada um num dueto','Both sang Oshibe to Meshibe to Yoru no Chouchou, each in a duet','Los dos cantaron Oshibe to Meshibe to Yoru no Chouchou, cada uno en un dúo','Keduanya menyanyikan Oshibe to Meshibe to Yoru no Chouchou, masing-masing dalam duet','ทั้งคู่ร้อง Oshibe to Meshibe to Yoru no Chouchou คนละดูเอ็ต','ふたりとも「おしべとめしべと夜の蝶々」をそれぞれデュエットで')],
      musicas:[['Wagamama na Nagareboshi', 'TsuLiPa · 1st Single Zipper (2026)'], ['Pan Pan Papa Pan', 'Sherbet Pink · B-side'], ['Gattsuki Girls', 'Teacher Teacher · B-side']]},
    {par:[1, 2], nome:T6('Lirika & Pati','Lirika & Pati','Lirika y Pati','Lirika & Pati','Lirika & Pati','Lirika＆Pati'), ic:'coracao', fatos:[
      T6('A mesma oshi: Imamura Maria (a kami-oshi do Pati)','Same oshi: Imamura Maria (Pati’s kami-oshi)','La misma oshi: Imamura Maria (la kami-oshi de Pati)','Oshi yang sama: Imamura Maria (kami-oshi Pati)','โอชิคนเดียวกัน: Imamura Maria (คามิโอชิของ Pati)','同じ推し：今村麻莉愛（Patiの神推し）'),
      T6('Oshi graduada em comum: Honda Hitomi','A graduated oshi in common: Honda Hitomi','Una oshi graduada en común: Honda Hitomi','Oshi yang sudah lulus yang sama: Honda Hitomi','โอชิที่จบการศึกษาเหมือนกัน: Honda Hitomi','卒業した推しも同じ：本田仁美'),
      T6('Os dois são de São Paulo','Both are from São Paulo','Los dos son de São Paulo','Keduanya dari São Paulo','ทั้งคู่มาจากเซาเปาลู','ふたりともサンパウロ出身')],
      musicas:[['Samishii Nettaigyo (Wink)', 'TsuLiPa · 1st Single Zipper (2026)'], ['Underground', 'Unit Festival 2025 · Next Station'], ['Show (Ado)', 'Halloween 2023 · Onegai My Kouhai'], ['Treinando Para Te Amar', 'Request Hour 2023']]},
    {par:[0, 2], nome:T6('Tsu & Pati · NeByur✰','Tsu & Pati · NeByur✰','Tsu y Pati · NeByur✰','Tsu & Pati · NeByur✰','Tsu & Pati · NeByur✰','Tsu＆Pati・NeByur✰'), ic:'nota', fatos:[
      T6('Unit NeByur✰: estreou com o single “Me Beija!” em 04/04/2026','Unit NeByur✰: debuted with the single “Me Beija!” on 04/04/2026','Unit NeByur✰: debutó con el single “Me Beija!” el 04/04/2026','Unit NeByur✰: debut dengan single “Me Beija!” pada 04/04/2026','ยูนิต NeByur✰: เดบิวต์ด้วยซิงเกิล “Me Beija!” 04/04/2026','ユニットNeByur✰：2026/04/04シングル「Me Beija!」でデビュー'),
      T6('Os dois amam o AKB48','Both love AKB48','A los dos les encanta AKB48','Keduanya suka AKB48','ทั้งคู่รัก AKB48','ふたりともAKB48が大好き'),
      T6('Oshi graduada em comum: Itano Tomomi','A graduated oshi in common: Itano Tomomi','Una oshi graduada en común: Itano Tomomi','Oshi yang sudah lulus yang sama: Itano Tomomi','โอชิที่จบการศึกษาเหมือนกัน: Itano Tomomi','卒業した推しも同じ：板野友美'),
      T6('Aniversários em setembro: 05/09 e 23/09','Birthdays in September: 05/09 and 23/09','Cumpleaños en septiembre: 05/09 y 23/09','Ulang tahun di bulan September: 05/09 dan 23/09','วันเกิดเดือนกันยายน: 05/09 และ 23/09','誕生日はどちらも9月：9/5と9/23')],
      musicas:[['Me Beija!', 'NeByur✰ · 1st Single (04/04/2026)'], ['Te Deixar', 'NeByur✰ · Me Beija! (2026)'], ['Ódio', 'NeByur✰ · pré-estreia'], ['Wish You Hapiness!!', 'Ano Novo 2023 · TsuLiPa'], ['Touch You', 'Unit Festival 2021 · High T'], ['Nante Bohemian', 'Unit Festival 2023 · Bohemian'], ['Big Bang Bolleyball', 'Unit Festival 2025 · Cerulean Nights'], ["C'mon join us", 'Unit Festival 2026 · Boyzfroms'],
        ['Dancing High', 'Sayonara no Imi · B-side (Tsu center)'], ['Bad∞End∞Night', 'Halloween 2022'], ['Natsu no Owari no Amaoto ga', 'Birthday Units 2022'], ['Nagori Zakura', '1000º vídeo'],
        ['Teacher Teacher', 'A-side'], ['10nen Zakura', 'A-side'], ['Sayonara no Imi', 'A-side'], ['Poison Girl', 'Special single'], ['Mikaeri Bijin', 'Special single · B-side'],
        ['Você é uma Melodia', '10nen Zakura · B-side'], ['Dead end', 'Sayonara no Imi · B-side'], ['Meu Verso de Paixão', 'Sayonara no Imi · B-side'], ['Amanojaku Batta', 'Sayonara no Imi · B-side'],
        ['Sugaring Off Party!', 'Outono 2022'], ['Daqui 10 Anos', 'BRS48 · 10 anos'], ['So Long', 'Ano Novo 2026'], ['ANTI', '3rd Album'], ['Madonna no sentaku', '3rd Album'],
        ['NO WAY MAN', 'Request Hour 2023'], ['Ruby', 'Request Hour 2023'], ['Wink wa 3kai', 'Gekokujou 1st Mini Concert']]},
    {par:[0, 1, 2], nome:T6('Os três · TsuLiPa','The three · TsuLiPa','Los tres · TsuLiPa','Bertiga · TsuLiPa','ทั้งสาม · TsuLiPa','3人・TsuLiPa'), ic:'trio', fatos:[
      T6('Draft 1st Generation, agosto de 2021 · o primeiro ensaio juntos foi Zipper, em maio de 2021','Draft 1st Generation, August 2021 · their first rehearsal together was Zipper, May 2021','Draft 1st Generation, agosto de 2021 · su primer ensayo juntos fue Zipper, en mayo de 2021','Draft 1st Generation, Agustus 2021 · latihan pertama bersama: Zipper, Mei 2021','Draft 1st Generation สิงหาคม 2021 · ซ้อมด้วยกันครั้งแรกคือ Zipper เดือนพฤษภาคม 2021','ドラフト1期生（2021年8月）・はじめての練習は2021年5月の「Zipper」'),
      T6('1º single da TsuLiPa: “Zipper”, em 25/01/2026 (com a Zipper regravada)','TsuLiPa’s 1st single: “Zipper”, 25/01/2026 (with Zipper re-recorded)','1.er single de TsuLiPa: “Zipper”, 25/01/2026 (con Zipper regrabada)','Single pertama TsuLiPa: “Zipper”, 25/01/2026 (Zipper direkam ulang)','ซิงเกิลแรกของ TsuLiPa: “Zipper” 25/01/2026 (อัดเพลง Zipper ใหม่)','TsuLiPaの1stシングル「Zipper」（2026/01/25・Zipperを再録）'),
      T6('Hoje os três estão no Team S (o Pati chegou no Summer Shuffle 2026)','All three are in Team S now (Pati joined in the 2026 Summer Shuffle)','Hoy los tres están en el Team S (Pati llegó en el Summer Shuffle 2026)','Sekarang bertiga di Team S (Pati pindah di Summer Shuffle 2026)','ตอนนี้ทั้งสามอยู่ Team S (Pati ย้ายมาใน Summer Shuffle 2026)','いまは3人ともTeam S（Patiは2026年夏のシャッフルで移籍）')],
      linha:[['2021', 'Polyrhythm'], ['2023', 'Plastic Love'], ['2024', 'Secret Base'], ['2025', 'Splash Dream / Binetsu kara Mystery'], ['2026', "I can't stop the loneliness"]],
      musicas:[['Zipper', '1st Draft Audition Concert (2021) · 1st Single TsuLiPa (2026)'], ['Hitonatsu no Dekigoto', 'TsuLiPa · 1st Single Zipper (2026)'], ['STAY WITH ME ~Mayonaka no Door~', 'TsuLiPa · 1st Single Zipper (2026)'],
        ['Cheeky Cheeky', 'TsuLiPa · pré-estreia'], ['Polyrhythm', 'Unit Festival 2021'], ['Plastic Love', 'Unit Festival 2023'], ['Secret Base', 'Unit Festival 2024'], ['Splash Dream / Binetsu kara Mystery', 'Unit Festival 2025'], ["I can't stop the loneliness", 'Unit Festival 2026'],
        ['Love Pulsar', 'Halloween Night · TsuLiPa'], ['Valentine Kiss', 'Want You! Want You! · TsuLiPa'], ['Phoenix Dance', 'Summer Love Sounds Good · TsuLiPa'], ['Aitakatta', 'BRS48 · 7 anos · TsuLiPa'], ['Monster (Arashi)', 'TsuLiPa & Eiko'],
        ['Mogyutto "love" de Sekkin Chuu!', '1st Draft Generation · 2026'], ['Kyun', 'A-side'], ['Yume wa Nigenai', 'Shekarashika! · B-side'], ['Yume wa Nigenai (PT)', '10nen Zakura · B-side'],
        ['Bokutachi wa Tatakawanai', '3rd Album ANTI'], ['Neko Allergy', 'Tsu Talks Senbatsu'], ['26 Estados e 1 Distrito', 'BRS48 · 6 anos'], ['Kibou ni Tsuite', 'Request Hour 2023']]}
  ];
  function t6(o){ return o ? (o[L()] || o.pt) : ''; }
  // Fichinhas em abas (uma Idol por vez, sem rolar 2.500px): foto de cada um no topo, palco com o boneco e o pet,
  // dados em blocos, "gosta de" em chips, a frase oficial em balão com a voz de verdade, e o mapa de amizades numa aba própria.
  var trioAba = 0;
  function telaTrio(){
    var abas = MEMBROS.map(function(m, k){
      return '<button type="button" role="tab" class="twc-trio-aba' + (trioAba === k ? ' on' : '') + '" data-trioaba="' + k + '" aria-selected="' + (trioAba === k) + '" style="--fc:' + FICHAS[k].cor[0] + '">' +
        '<canvas data-membro="' + k + '" width="96" height="96" aria-hidden="true"></canvas><b translate="no">' + esc(m[1]) + '</b></button>';
    }).join('') + '<button type="button" role="tab" class="twc-trio-aba twc-trio-aba-amigos' + (trioAba === 3 ? ' on' : '') + '" data-trioaba="3" aria-selected="' + (trioAba === 3) + '">' +
      '<span class="twc-trio-aba-ic" aria-hidden="true">' + ico('coracao', 26) + '</span><b>' + esc(tf('amizades')) + '</b></button>';
    var corpo;
    if(trioAba === 3){
      corpo = '<section class="twc-amigos" aria-labelledby="twcAmigosT"><h2 id="twcAmigosT">' + esc(tf('mapaAmigos')) + '</h2>' +
        '<div class="twc-amigos-c"><canvas id="twcAmigosCv" width="680" height="410" role="img" aria-label="' +
          esc(tf('mapaAmigos') + ': ' + tf('mesmaGeracao') + ' · ' + tf('unitTrio') + ' (Tsu, Lirika, Pati) · ' + tf('dupla') + ' (Tsu, Pati) · ' + tf('pet') + ': Chu, Koali, Pucchi') + '"></canvas></div>' +
        '<div class="twc-lacos" role="tablist" aria-label="' + esc(tf('mapaAmigos')) + '">' + [3, 0, 1, 2].map(function(i){ var lc = LACOS[i];
          return '<button type="button" role="tab" class="twc-laco' + (amigosSel === i ? ' on' : '') + '" data-laco="' + i + '" aria-selected="' + (amigosSel === i) + '"><span class="twc-laco-rostos" aria-hidden="true">' +
            lc.par.map(function(k){ return '<canvas data-membro="' + k + '" width="64" height="64" style="--fc:' + FICHAS[k].cor[0] + '"></canvas>'; }).join('') + '</span><b>' + esc(t6(lc.nome)) + '</b></button>'; }).join('') + '</div>' +
        (function(){ var lc = LACOS[amigosSel];
          return '<div class="twc-laco-card" role="tabpanel" style="--fc:' + (lc.par.length === 2 ? FICHAS[lc.par[1]].cor[0] : '#7b3ff0') + '"><h3>' + ico(lc.ic, 18) + esc(t6(lc.nome)) + '</h3><ul>' +
            lc.fatos.map(function(f){ return '<li>' + esc(t6(f)) + '</li>'; }).join('') + '</ul>' +
            (lc.linha ? '<p class="twc-laco-sub">' + esc(tf('unitFest')) + '</p><ol class="twc-laco-linha">' + lc.linha.map(function(l){ return '<li><b>' + esc(l[0]) + '</b><span translate="no">' + esc(l[1]) + '</span></li>'; }).join('') + '</ol>' : '') +
            (lc.musicas ? (function(){ var mus = function(m){ return '<li><b translate="no">' + esc(m[0]) + '</b><small translate="no">' + esc(m[1]) + '</small></li>'; };
              var trio = LACOS[3].musicas, duo = lc.par.length === 2, tot = lc.musicas.length + (duo ? trio.length : 0), vis = lc.musicas.slice(0, 8), resto = lc.musicas.slice(8);
              var terceiro = duo ? MEMBROS[[0, 1, 2].filter(function(k){ return lc.par.indexOf(k) < 0; })[0]][1] : '';
              return '<p class="twc-laco-sub">' + ico('nota', 14) + esc(tf('cantaram').replace('{n}', tot)) + (duo ? ' · ' + esc(tf('soDois').replace('{n}', lc.musicas.length)) : '') + '</p>' +
                '<ul class="twc-laco-mus">' + vis.map(mus).join('') + '</ul>' +
                (resto.length ? '<details class="twc-laco-mais"><summary>' + esc(tf('verTodas').replace('{n}', resto.length)) + '</summary><ul class="twc-laco-mus">' + resto.map(mus).join('') + '</ul></details>' : '') +
                (duo ? '<details class="twc-laco-mais"><summary>' + esc(tf('comTrio').replace('{q}', terceiro).replace('{n}', trio.length)) + '</summary><ul class="twc-laco-mus">' + trio.map(mus).join('') + '</ul></details>' : '');
            })() : '') + '</div>'; })() +
        '<p class="twc-amigos-dica"><span aria-hidden="true">' + ico('coracao', 14) + '</span>' + esc(tf('toque')) + '</p>' +
        '<div class="twc-sr">' + MEMBROS.map(function(m, k){ return '<button type="button" data-amigo="' + k + '">' + esc(m[1]) + '</button>'; }).join('') + '</div></section>';
    } else {
      var f = FICHAS[trioAba], m = MEMBROS[f.k], aniv = typeof f.aniv === 'string' ? f.aniv : (f.aniv[L()] || f.aniv.pt);
      var bloco = function(ic, r, v, extra){ return v ? '<div class="twc-f2-bloco"><span class="twc-f2-ic" aria-hidden="true">' + ico(ic, 18) + '</span><dt>' + esc(tf(r)) + '</dt><dd>' + (extra || '') + v + '</dd></div>' : ''; };
      var gostos = String(f.gostos[L()] || f.gostos.pt).split(/,\s*|、/).filter(Boolean);
      corpo = '<article class="twc-f2" style="--fc:' + f.cor[0] + '" aria-labelledby="twcF' + f.k + '" role="tabpanel">' +
        '<header class="twc-f2-palco"><span class="twc-f2-luz" aria-hidden="true"></span>' +
          '<canvas class="twc-ficha-idol" data-idol="' + f.k + '" width="208" height="224" aria-hidden="true"></canvas>' +
          '<canvas class="twc-ficha-pet twc-f2-pet" data-pet="' + m[0] + '" width="72" height="72" aria-hidden="true"></canvas>' +
          '<div class="twc-f2-nome"><small>Draft 1st Generation</small><h2 id="twcF' + f.k + '" translate="no">' + esc(m[1]) + '</h2>' +
            '<b lang="ja">' + esc(f.jp) + '</b><span translate="no">' + esc(f.nome) + '</span><em>' + esc(f.time) + '</em></div></header>' +
        '<div class="twc-f2-fala"><blockquote lang="pt">' + esc(f.frase) + '</blockquote>' +
          '<button type="button" class="twc-f2-voz" data-triovoz="' + f.k + '" aria-label="' + esc(tf('ouvir')) + '">' + ico('fala', 18) + '<span>' + esc(tf('ouvir')) + '</span></button></div>' +
        '<dl class="twc-f2-grade">' + bloco('bolo', 'aniv', esc(aniv)) + bloco('pin', 'local', esc(f.local)) + bloco('regua', 'altura', esc(f.altura)) +
          bloco('paleta', 'cor', esc(f.cor[1]), '<i class="twc-ficha-cor" aria-hidden="true"></i>') + bloco('pata', 'pet', esc(f.pet[1])) + bloco('nota', 'audicao', esc(f.audicao)) + bloco('estrela', 'oshis', esc(f.oshis)) + '</dl>' +
        '<section class="twc-f2-gosta"><h3>' + ico('coracao', 16) + esc(tf('gosta')) + '</h3><ul>' + gostos.map(function(g){ return '<li>' + esc(g) + '</li>'; }).join('') + '</ul></section>' +
        '<a class="twc-btn twc-btn-claro twc-ficha-blog" href="' + f.blog + '" target="_blank" rel="noopener">' + esc(tf('blog')) + ' ↗</a></article>';
    }
    return faixa(esc(tf('trio')), tf('trioSub')) + '<div class="twc-pag twc-trio"><div class="twc-trio-abas" role="tablist" aria-label="' + esc(tf('trio')) + '">' + abas + '</div>' + corpo + '</div>';
  }
  // mapa de amizades desenhado com os bonecos e os pets de verdade do jogo (perfDesenharIdol + drawPet).
  // Os três lado a lado, na mesma altura (a Lirika no meio, ninguém "acima"): mesma geração, unit TsuLiPa e a dupla NeByur✰.
  // Tocar num membro: pulinho, fala com a voz de verdade (as mesmas do palco) e coraçõezinhos; tocar num pet: o pet pula e faz o som dele.
  var amigosRaf = 0, amigosReage = null, amigosX = [150, 340, 530], amigosAl = [1, 1, 1], amigosPosAtual = null;
  var AMIGOS_POS = [{k:0, x:150, y:350, pet:[226, 330]}, {k:1, x:340, y:350, pet:[416, 330]}, {k:2, x:530, y:350, pet:[606, 330]}];
  function amigosLigar(){ if(!amigosRaf) amigosRaf = requestAnimationFrame(amigosQuadro); }
  function amigosQuadro(ms){
    amigosRaf = 0; var cv = $id('twcAmigosCv'); if(!cv || topo() !== 'trio' || document.hidden) return;
    var reduz = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    try{ amigosDesenhar(cv, reduz ? 0 : ms / 1000, ms); }catch(e){ return; }
    if(!reduz || (amigosReage && ms - amigosReage.t0 < 2400)) amigosRaf = requestAnimationFrame(amigosQuadro);
  }
  function amigosTocar(tipo, k){
    var agora = typeof performance !== 'undefined' ? performance.now() : Date.now(), txt = '';
    if(tipo === 'm'){
      var L2 = typeof HUB_FALAS !== 'undefined' ? HUB_FALAS[k] : null;
      if(L2){ var f = L2[Math.floor(Math.random() * (L2.length - 1))]; txt = f[1];
        try{ if(typeof hubVozTocar === 'function') hubVozTocar(f[0]); }catch(e){} }
    } else { txt = (FICHAS[k] && FICHAS[k].pet ? FICHAS[k].pet[1] : '') + ' ♡';   // o nome do pet aparece no balão ao tocar
      try{ if(typeof petVoice === 'function') petVoice(null, MEMBROS[k][0]); }catch(e){} }
    amigosReage = {tipo:tipo, k:k, t0:agora, txt:txt};
    carinho();
    amigosLigar();
  }
  function amigosClique(e){
    var cv = e.currentTarget, r = cv.getBoundingClientRect(), px = (e.clientX - r.left) * cv.width / r.width, py = (e.clientY - r.top) * cv.height / r.height;
    for(var i = 0; i < 3; i++){ var a = (amigosPosAtual || AMIGOS_POS)[i]; if(a.a != null && a.a < .5) continue;
      if(Math.hypot(px - a.pet[0], py - a.pet[1]) < 42){ amigosTocar('p', i); return; }
      if(Math.abs(px - a.x) < 58 && py > a.y - 175 && py < a.y + 12){ amigosTocar('m', i); return; } }
  }
  function amigosDesenhar(cv, s, ms){
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, agora = ms != null ? ms : (typeof performance !== 'undefined' ? performance.now() : 0);
    var lacoM = LACOS[amigosSel] || LACOS[3], alvoX = [150, 340, 530], alvoA = [1, 1, 1];
    if(lacoM.par.length === 2){ alvoX[lacoM.par[0]] = 235; alvoX[lacoM.par[1]] = 445; [0, 1, 2].forEach(function(k){ if(lacoM.par.indexOf(k) < 0) alvoA[k] = 0; }); }
    var reduzM = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    for(var km = 0; km < 3; km++){ amigosX[km] += reduzM ? alvoX[km] - amigosX[km] : (alvoX[km] - amigosX[km]) * .16; amigosAl[km] += reduzM ? alvoA[km] - amigosAl[km] : (alvoA[km] - amigosAl[km]) * .18; }
    var POS = [0, 1, 2].map(function(k){ return {k:k, x:amigosX[k], y:350, pet:[amigosX[k] + 76, 330], a:amigosAl[k]}; }); amigosPosAtual = POS;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    function rr(a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
    // Cena de palco à noite: céu com nebulosas nas cores do trio, arco de lâmpadas de letreiro, refletores e piso com LED
    var cor = MEMBROS.map(function(m){ return m[2]; }), lacoAt = LACOS[amigosSel] || LACOS[3];
    var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0b3d'); g.addColorStop(.55, '#3b1a7a'); g.addColorStop(1, '#6b2a8f');
    rr(0, 0, W, H, 34); x.fillStyle = g; x.fill(); x.save(); rr(0, 0, W, H, 34); x.clip();
    [[110, 90, cor[0]], [340, 60, '#7cc400'], [570, 90, cor[2]]].forEach(function(n){ var ng = x.createRadialGradient(n[0], n[1], 10, n[0], n[1], 220); ng.addColorStop(0, n[2] + '66'); ng.addColorStop(1, n[2] + '00'); x.fillStyle = ng; x.fillRect(0, 0, W, H); });
    for(var e = 0; e < 46; e++){ var ex = (e * 137.5) % W, ey = (e * 61.3) % 300, tw = .35 + .65 * Math.abs(Math.sin(s * 1.3 + e)); x.globalAlpha = tw * .9; x.fillStyle = e % 7 ? '#fff' : '#ffe58a'; x.beginPath(); x.arc(ex, ey, e % 5 ? 1.3 : 2.2, 0, 7); x.fill(); }
    x.globalAlpha = 1;
    // arco de lâmpadas (letreiro de show) atrás do trio
    x.save(); x.lineWidth = 10; x.strokeStyle = 'rgba(255,255,255,.12)'; x.beginPath(); x.ellipse(W / 2, 330, 300, 270, 0, Math.PI, 2 * Math.PI); x.stroke();
    for(var lb = 0; lb <= 30; lb++){ var an = Math.PI + lb / 30 * Math.PI, bx2 = W / 2 + Math.cos(an) * 300, by2 = 330 + Math.sin(an) * 270, on = (Math.floor(s * 4) + lb) % 3 !== 0;
      var gb = x.createRadialGradient(bx2, by2, 1, bx2, by2, 10); gb.addColorStop(0, on ? 'rgba(255,240,180,.95)' : 'rgba(255,240,180,.35)'); gb.addColorStop(1, 'rgba(255,240,180,0)'); x.fillStyle = gb; x.beginPath(); x.arc(bx2, by2, 10, 0, 7); x.fill();
      x.fillStyle = on ? '#fff6d0' : '#a98fd6'; x.beginPath(); x.arc(bx2, by2, 3.4, 0, 7); x.fill(); }
    x.restore();
    // refletores: um cone na cor de cada membro (quem não está no laço fica com a luz apagada)
    POS.forEach(function(p, k){
      var aceso = lacoAt.par.indexOf(k) >= 0; if(p.a < .05) return; var ang = Math.sin(s * .7 + k) * .05;
      x.save(); x.translate(p.x, -20); x.rotate(ang); var lg = x.createLinearGradient(0, 0, 0, 380); lg.addColorStop(0, cor[k] + (aceso ? 'aa' : '22')); lg.addColorStop(1, cor[k] + '00');
      x.fillStyle = lg; x.beginPath(); x.moveTo(-14, 0); x.lineTo(14, 0); x.lineTo(92, 380); x.lineTo(-92, 380); x.closePath(); x.fill(); x.restore(); });
    // piso do palco com reflexo e a faixa de LED na borda
    var pg = x.createLinearGradient(0, 330, 0, H); pg.addColorStop(0, '#4a2496'); pg.addColorStop(1, '#1f0d4a'); x.fillStyle = pg; x.fillRect(0, 330, W, H - 330);
    x.strokeStyle = 'rgba(255,255,255,.07)'; x.lineWidth = 2; for(var fl2 = -6; fl2 <= 6; fl2++){ x.beginPath(); x.moveTo(W / 2 + fl2 * 40, 330); x.lineTo(W / 2 + fl2 * 120, H); x.stroke(); }
    var led = x.createLinearGradient(0, 0, W, 0); ['#ff6fb5', '#ffd23f', '#b6ff3b', '#4dd8ff', '#9b30d9', '#ff6fb5'].forEach(function(c2, i2){ led.addColorStop(i2 / 5, c2); });
    x.fillStyle = led; x.fillRect(0, 327, W, 5); x.globalAlpha = .35; x.fillRect(0, 332, W, 8); x.globalAlpha = 1;

    function pilula(px, py, txt, fundo, letra, tam){
      x.font = '400 ' + (tam || 17) + 'px "Mochiy Pop One",sans-serif'; var w = x.measureText(txt).width + 30, h = (tam || 17) + 16;
      x.save(); x.shadowColor = 'rgba(255,111,181,.55)'; x.shadowBlur = 14; x.shadowOffsetY = 3; rr(px - w / 2, py - h / 2, w, h, h / 2); x.fillStyle = fundo; x.fill(); x.restore();
      x.save(); rr(px - w / 2, py - h / 2, w, h, h / 2); x.clip(); x.fillStyle = 'rgba(255,255,255,.28)'; x.fillRect(px - w / 2, py - h / 2, w, h / 2); x.restore();
      x.strokeStyle = '#fff'; x.lineWidth = 3; rr(px - w / 2, py - h / 2, w, h, h / 2); x.stroke();
      x.fillStyle = letra; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, px, py + 1);
    }
    var laco = LACOS[amigosSel] || LACOS[3], noLaco = function(k){ return laco.par.indexOf(k) >= 0; };
    if(laco.par.length === 3){
      // os três: fita da unit TsuLiPa nas três cores passando por cima, e a faixa da geração
      var arco = x.createLinearGradient(110, 0, 570, 0); arco.addColorStop(0, cor[0]); arco.addColorStop(.5, '#7cc400'); arco.addColorStop(1, cor[2]);
      x.save(); x.lineCap = 'round'; x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 18; x.beginPath(); x.moveTo(110, 168); x.quadraticCurveTo(340, 30, 570, 168); x.stroke();
      x.strokeStyle = arco; x.lineWidth = 10; x.stroke(); x.restore();
      pilula(W / 2, 96, '♡ ' + tf('unitTrio'), '#7b3ff0', '#fff', 24);
      pilula(W / 2, 32, tf('mesmaGeracao'), '#fff', '#7b3ff0', 18);
    } else {
      // dupla: os dois lado a lado no centro, um holofote só sobre eles e um selo de coração entre os dois
      var cA = cor[laco.par[0]], cB = cor[laco.par[1]], mx = (POS[laco.par[0]].x + POS[laco.par[1]].x) / 2, pul = 1 + Math.sin(s * 3) * .05;
      x.save(); var hz = x.createRadialGradient(mx, 352, 20, mx, 352, 230); hz.addColorStop(0, 'rgba(255,240,250,.55)'); hz.addColorStop(1, 'rgba(255,240,250,0)');
      x.fillStyle = hz; x.beginPath(); x.ellipse(mx, 352, 230, 40, 0, 0, 7); x.fill();
      var cone = x.createLinearGradient(0, 0, 0, 360); cone.addColorStop(0, 'rgba(255,245,255,.45)'); cone.addColorStop(1, 'rgba(255,245,255,0)');
      x.fillStyle = cone; x.beginPath(); x.moveTo(mx - 24, 0); x.lineTo(mx + 24, 0); x.lineTo(mx + 210, 360); x.lineTo(mx - 210, 360); x.closePath(); x.fill(); x.restore();
      x.save(); x.translate(mx, 236); x.scale(pul, pul);
      function cor2(r){ x.beginPath(); x.moveTo(0, r * .95); x.bezierCurveTo(-r * 1.5, -r * .1, -r * .75, -r * 1.25, 0, -r * .45); x.bezierCurveTo(r * .75, -r * 1.25, r * 1.5, -r * .1, 0, r * .95); x.closePath(); }
      x.shadowColor = 'rgba(255,111,181,.8)'; x.shadowBlur = 22; x.fillStyle = '#fff'; cor2(31); x.fill(); x.shadowBlur = 0;
      var hg = x.createLinearGradient(-26, -26, 26, 26); hg.addColorStop(0, cA); hg.addColorStop(.5, '#ff6fb5'); hg.addColorStop(1, cB); x.fillStyle = hg; cor2(25); x.fill();
      x.fillStyle = 'rgba(255,255,255,.55)'; x.beginPath(); x.ellipse(-9, -10, 6, 3.5, -.6, 0, 7); x.fill();
      [[-46, -18, 7], [44, -26, 5], [36, 22, 4], [-40, 24, 4]].forEach(function(b, n){ var r = b[2] * (.6 + .4 * Math.abs(Math.sin(s * 2.4 + n))); x.fillStyle = '#fff6c4';
        x.beginPath(); x.moveTo(b[0], b[1] - r); x.quadraticCurveTo(b[0], b[1], b[0] + r, b[1]); x.quadraticCurveTo(b[0], b[1], b[0], b[1] + r); x.quadraticCurveTo(b[0], b[1], b[0] - r, b[1]); x.quadraticCurveTo(b[0], b[1], b[0], b[1] - r); x.fill(); });
      x.restore();
      pilula(W / 2, 40, t6(laco.nome), '#ff6fb5', '#fff', 24);
    }
    var rg = amigosReage && agora - amigosReage.t0 < 2400 ? amigosReage : null, rt = rg ? (agora - rg.t0) / 1000 : 0;
    POS.forEach(function(p, k){
      var av = membroAv(k); if(!av) return;
      if(p.a < .03) return; x.save(); x.globalAlpha = p.a;   // na dupla, o terceiro sai de cena
      var pulo = Math.max(0, Math.sin(s * 2.2 + k * 2.1)) * 5;
      if(rg && rg.tipo === 'm' && rg.k === k) pulo += Math.max(0, Math.sin(Math.min(1, rt / .5) * Math.PI)) * 34;
      // pódio redondo na cor do membro, com aro de luz
      var pdg = x.createLinearGradient(0, p.y - 12, 0, p.y + 22); pdg.addColorStop(0, '#ffffff'); pdg.addColorStop(.25, cor[k]); pdg.addColorStop(1, '#1f0d4a');
      x.fillStyle = pdg; x.beginPath(); x.ellipse(p.x, p.y + 12, 64, 16, 0, 0, Math.PI); x.lineTo(p.x - 64, p.y - 2); x.ellipse(p.x, p.y - 2, 64, 16, 0, Math.PI, 0, true); x.closePath(); x.fill();
      var tg = x.createRadialGradient(p.x, p.y - 4, 4, p.x, p.y - 2, 64); tg.addColorStop(0, '#fff'); tg.addColorStop(1, cor[k]); x.fillStyle = tg; x.beginPath(); x.ellipse(p.x, p.y - 2, 64, 16, 0, 0, 7); x.fill();
      x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 2.5; x.beginPath(); x.ellipse(p.x, p.y - 2, 64, 16, 0, 0, 7); x.stroke();
      x.save(); x.translate(p.x - 78, p.y - 168 + 6 - pulo); x.scale(1.5, 1.5);
      var deLado = laco.par.length === 2 && noLaco(k) && window.TW_LADO && !(rg && rg.tipo === 'm' && rg.k === k);   // na dupla, os dois de perfil, um virado para o outro
      try{ var a2 = {}; for(var q in av) a2[q] = av[q]; a2.pose = rg && rg.tipo === 'm' && rg.k === k ? ['coracao', 'tchau', 'v'][k] : ['nyan', 'mic', 'v'][k]; if(!deLado) perfDesenharIdol(x, 104, 112, a2, false, false, s * 60); }catch(e){}
      x.restore();
      if(deLado) try{ window.TW_LADO.desenhar(x, p.x, p.y - 11 - pulo, 2.05, av, s * 60, p.x > mx); }catch(e){}
      // faixa com o nome (fita com pontas recortadas)
      x.font = '400 22px "Mochiy Pop One",sans-serif'; var nw2 = x.measureText(MEMBROS[k][1]).width + 30, ny = p.y + 38;   // legível no celular (o canvas aparece ~metade)
      x.fillStyle = 'rgba(0,0,0,.25)'; x.beginPath(); x.moveTo(p.x - nw2 / 2 - 12, ny - 9); x.lineTo(p.x - nw2 / 2, ny - 9); x.lineTo(p.x - nw2 / 2, ny + 15); x.lineTo(p.x - nw2 / 2 - 12, ny + 15); x.lineTo(p.x - nw2 / 2 - 6, ny + 2); x.closePath(); x.fill();
      x.beginPath(); x.moveTo(p.x + nw2 / 2 + 12, ny - 9); x.lineTo(p.x + nw2 / 2, ny - 9); x.lineTo(p.x + nw2 / 2, ny + 15); x.lineTo(p.x + nw2 / 2 + 12, ny + 15); x.lineTo(p.x + nw2 / 2 + 6, ny + 2); x.closePath(); x.fill();
      var fg = x.createLinearGradient(0, ny - 17, 0, ny + 17); fg.addColorStop(0, cor[k]); fg.addColorStop(1, '#2a1060'); rr(p.x - nw2 / 2, ny - 17, nw2, 34, 8); x.fillStyle = fg; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2.5; x.stroke();
      x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(MEMBROS[k][1], p.x, ny + 1);
      var pp = 0; if(rg && rg.tipo === 'p' && rg.k === k) pp = Math.max(0, Math.sin(Math.min(1, rt / .45) * Math.PI)) * 30;
      if(typeof drawPet === 'function'){ var cg = x.createLinearGradient(0, p.pet[1] + 20, 0, p.pet[1] + 36); cg.addColorStop(0, '#ffd1e8'); cg.addColorStop(1, '#ff8cc6');
        x.fillStyle = cg; x.beginPath(); x.ellipse(p.pet[0], p.pet[1] + 28, 26, 8, 0, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();   // almofadinha do pet
        try{ drawPet(x, MEMBROS[k][0], p.pet[0], p.pet[1] - pp, 1.55, s * 60 + k * 20, 'feliz'); }catch(e){} }
      x.restore();
    });
    // reação: balão com a fala de verdade e coraçõezinhos subindo
    if(rg){
      var alvo = POS[rg.k], bxp = rg.tipo === 'm' ? alvo.x : alvo.pet[0], byp = rg.tipo === 'm' ? alvo.y - 176 : alvo.pet[1] - 46, al = Math.min(1, (2.4 - rt) * 2);
      x.save(); x.globalAlpha = al;
      for(var h = 0; h < 5; h++){ var ft = (rt * .9 + h * .2) % 1; x.fillStyle = [cor[rg.k], '#ff6fb5', '#ffd23f'][h % 3]; x.font = '20px sans-serif'; x.textAlign = 'center';
        x.globalAlpha = al * Math.sin(ft * Math.PI); x.fillText('♥', bxp + (h - 2) * 18 + Math.sin(rt * 5 + h) * 6, byp + 30 - ft * 60); }
      x.globalAlpha = al;
      if(rg.txt){ x.font = '800 22px "M PLUS Rounded 1c",sans-serif'; var lw = Math.min(W - 24, x.measureText(rg.txt).width + 32), bxx = Math.max(lw / 2 + 8, Math.min(W - lw / 2 - 8, bxp));
        rr(bxx - lw / 2, byp - 44, lw, 42, 18); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = cor[rg.k]; x.lineWidth = 3; x.stroke();
        x.fillStyle = '#fff'; x.beginPath(); x.moveTo(bxp - 7, byp - 3); x.lineTo(bxp, byp + 8); x.lineTo(bxp + 7, byp - 3); x.closePath(); x.fill();
        x.fillStyle = '#4a2a7a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(rg.txt, bxx, byp - 22, lw - 18); }
      x.restore();
    }
    x.fillStyle = '#fff'; [[50, 70], [630, 80], [250, 150], [430, 150], [40, 300], [650, 260]].forEach(function(b, k){
      var r = 5 + 3 * Math.abs(Math.sin(s * 1.6 + k)); x.save(); x.translate(b[0], b[1]); x.beginPath();
      for(var i2 = 0; i2 < 8; i2++){ var rr2 = i2 % 2 ? r * .35 : r, an = i2 * Math.PI / 4; x.lineTo(Math.cos(an) * rr2, Math.sin(an) * rr2); } x.closePath(); x.fill(); x.restore(); });
    x.restore();
  }
  function trioPintar(){
    [].slice.call(cel.querySelectorAll('canvas.twc-ficha-pet[data-pet]')).forEach(function(cv){
      var xx = cv.getContext('2d'); xx.clearRect(0, 0, cv.width, cv.height); try{ if(typeof drawPet === 'function') drawPet(xx, cv.getAttribute('data-pet'), 36, 34, 1.15, 0, 'feliz'); }catch(e){} });
    flutuantes(); amigosLigar();
    var am = $id('twcAmigosCv'); if(am && !am.twc){ am.twc = true; am.addEventListener('click', amigosClique); }
  }

  /* ---------- manutenção fofa: quando o servidor (ou a internet) cai, um aviso com o trio em vez de erro seco ---------- */
  var falhas = 0, manutVista = false;
  // conezinho de obra desenhado (sem emoji): laranja com faixas brancas e base roxa
  var CONE = '<svg class="twc-cone" viewBox="0 0 40 48" width="34" height="41"><path d="M16 4h8l10 34H6z" fill="#ff8a3d" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M13.2 16h13.6l1.9 7H11.3zM10 28.5h20l1.6 5.5H8.4z" fill="#fff"/><rect x="2" y="38" width="36" height="7" rx="3.5" fill="#7b3ff0" stroke="#fff" stroke-width="2"/></svg>';
  function manutMostrar(){
    if(!cel || !folha || manutVista || !folha.hidden || tutI >= 0) return;
    manutVista = true;
    var off = typeof navigator !== 'undefined' && navigator.onLine === false;
    folha.innerHTML = '<div class="twc-folha-caixa twc-manut" role="dialog" aria-modal="true" aria-labelledby="twcManutT">' +
      '<div class="twc-manut-palco" aria-hidden="true">' + CONE + MEMBROS.map(function(m, k){ return '<canvas data-membro="' + k + '" width="96" height="96"></canvas>'; }).join('') + CONE + '</div>' +
      '<h2 id="twcManutT">' + esc(off ? t2('semNet') : t2('manutT')) + '</h2><p>' + esc(t2('manutTxt')) + '</p>' +
      '<button type="button" class="twc-btn" data-f="manutRun">' + esc(t2('jogarRun')) + '</button><button type="button" class="twc-btn twc-btn-claro" data-f="manutTentar">' + esc(t2('tentar')) + '</button>' +
      brilhos([[10, 10, 12], [88, 12, 10, 'l']]) + '</div>';
    folha.hidden = false;
    [].slice.call(folha.querySelectorAll('canvas[data-membro]')).forEach(function(cv){ var av = membroAv(+cv.getAttribute('data-membro')); try{ if(av && typeof perfFotoRedonda === 'function') perfFotoRedonda(cv, av, true); }catch(e){} });
  }
  function falhaDeRede(err){ var m = String(err && (err.message || err.code || err) || ''); return /sem_supabase|fetch|network|load failed|timeout|50[234]|ECONN/i.test(m); }
  if(typeof window.contaRpc === 'function' && !window.contaRpc.twcManut){
    var rpcOrig = window.contaRpc;
    window.contaRpc = function(){
      return rpcOrig.apply(this, arguments).then(function(r){ falhas = 0; return r; }, function(err){
        if(falhaDeRede(err)){ falhas++; if(falhas >= 3) manutMostrar(); }
        throw err; });
    };
    window.contaRpc.twcManut = true;
  }
  if(typeof window.addEventListener === 'function') window.addEventListener('offline', function(){ falhas = 3; manutVista = false; manutMostrar(); });
  var ruaFofaPendente = false;
  window.twcAbrirRuaFofa = function(origem){
    if(!cel || classico) return;
    ruaFofaPendente = true;
    if(topo() === 'emb:mapa') embutir('mapa');
    else ir('emb:mapa',origem);
  };
  function embutir(k){
    var el = document.querySelector(EMB[k][0]), slot = $id('twcEmbSlot');
    if(slot && !el && k === 'mapa'){
      slot.textContent = TW_CARGA.texto(0);
      function atual(){ return topo() === 'emb:mapa' && $id('twcEmbSlot') === slot; }
      function falhou(){ if(atual()) TW_CARGA.erro(slot, function(){ embutir('mapa'); }); }
      window.twMapaCarregar().then(function(){
        if(!atual()) return;
        if(document.querySelector(EMB.mapa[0])){ slot.replaceChildren(); embutir('mapa'); }
        else falhou();
      }, falhou);
      return;
    }
    if(!slot) return;
    if(k === 'nov'){ novidadesMontar(slot); return; }
    if(!el) return;
    if(embAtual && embAtual.el !== el) devolver();
    if(!embAtual) embAtual = {el:el, pai:el.parentNode, prox:el.nextSibling};
    slot.appendChild(el);
    if(k === 'mapa' && !el.classList.contains('aberto')){ var b = el.querySelector('.tw-mapa-botao'); if(b) b.click(); }
    if(k === 'mapa' && ruaFofaPendente && typeof window.twMapaRuaFofa === 'function'){
      if(window.twMapaRuaFofa()) ruaFofaPendente = false;
    }
    if(k === 'mapa') setTimeout(function(){ try{ window.dispatchEvent(new Event('resize')); }catch(e){} }, 60);
    if(k === 'missoes' && typeof hubMisCarregar === 'function' && logado() && !(typeof hubMisDados !== 'undefined' && hubMisDados)) hubMisCarregar();
    if(k === 'nov') el.open = true;
    if(k === 'busca'){
      var i=$id('hubBusca');
      if(i){i.maxLength=48;i.setAttribute('aria-label',twLinkTexto(5));i.placeholder=twLinkTexto(5);buscaAtalhos(i.value);}
    }
  }
  /* ---------- Novidades (17/11): os posts do Idol⭐News! com data e selo "novo", e embaixo a lista fixa do que tem no site ---------- */
  var NOV_VISTO = 'tw_nov_visto', novPosts = null, novFalhou = false;
  function novVisto(){ try{ return +localStorage.getItem(NOV_VISTO) || 0; }catch(e){ return 0; } }
  function novidadesHtml(){
    var visto = novVisto(), h = '';
    if(novPosts && novPosts.length){
      h += '<h3 class="twc-nov-tit">' + esc(t2('novPosts')) + '</h3><div class="twc-nov-posts">' + novPosts.map(function(p){
        var d = new Date(p.criado), ms = d.getTime(), dt = isNaN(ms) ? '' : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
        var img = /^data:image\/jpeg;base64,/.test(p.imagem || '') ? '<img src="' + p.imagem + '" alt="" loading="lazy">' : '';
        return '<article class="twc-nov-post">' + img + '<div><p class="twc-nov-meta">' + (dt ? '<time>' + dt + '</time>' : '') +
          (ms > visto ? '<span class="twc-nov-novo">' + esc(t2('novNovo')) + '</span>' : '') + '</p><h4>' + esc(p.titulo || '') + '</h4>' +
          (p.legenda ? '<p>' + esc(p.legenda) + '</p>' : '') + '</div></article>';
      }).join('') + '</div>';
    }
    var origem = document.getElementById('hubNov'), lista = origem ? origem.innerHTML : '';
    if(lista) h += '<details class="twc-nov-tem"' + (novPosts && novPosts.length ? '' : ' open') + '><summary>' + esc(t2('novTem')) + '</summary><ul>' + lista + '</ul></details>';
    return h;
  }
  // ponto vermelho no Menu e no atalho Novidades quando há post do Idol⭐News! mais novo que a última visita
  function novTemNovo(){ if(novPosts === null){ novBuscar(); return false; } var v = novVisto(); return novPosts.some(function(p){ var ms = new Date(p.criado).getTime(); return ms > v; }); }
  function novBuscar(){
    if(novPosts !== null || typeof window.contaRpc !== 'function') return; novPosts = [];
    window.contaRpc('news_posts').then(function(lista){
      if(!Array.isArray(lista)) throw new Error('news_posts');
      novPosts = lista.slice(0, 8);
      novFalhou = false;
    }).catch(function(){ novFalhou = true; }).then(function(){
      var slot = $id('twcEmbSlot');
      if(topo() === 'emb:nov' && slot) novidadesMontar(slot);
      else if(novTemNovo()) novPontos();
    });
  }
  function novPontos(){   // só acrescenta o ponto, sem redesenhar a tela (não mexe na rolagem)
    [cel && cel.querySelector('.twc-nav-menu:not(.twc-aberto)'), cel && cel.querySelector('.twc-atalho[data-a="nov"]')].forEach(function(b){ if(b && !b.querySelector('.twc-dot')) b.insertAdjacentHTML('beforeend', '<em class="twc-dot" aria-hidden="true">!</em>'); });
  }
  function novidadesMontar(slot){
    slot.innerHTML = '<section class="hubpainel hubnov twc-novidades-conteudo" aria-label="' + esc(t('nov')) + '">' + novidadesHtml() + '</section>';
    if(novFalhou){
      var aviso = document.createElement('div');
      slot.firstElementChild.prepend(aviso);
      TW_CARGA.erro(aviso, function(){
        novFalhou = false;
        novPosts = null;
        aviso.textContent = TW_CARGA.texto(0);
        novBuscar();
      });
    }
    novBuscar();
    // marca como visto logo depois de mostrar: o selo "novo" fica nesta visita e some na próxima
    if(novPosts && novPosts.length) setTimeout(function(){ try{ localStorage.setItem(NOV_VISTO, String(Date.now())); }catch(e){} }, 1500);
  }
  /* ---------- a vitrine antiga (luzes, confete, lightsticks) na tela de abertura, com o Tsu, a Lirika e o Pati desfilando juntos ---------- */
  function vitrineDevolver(){
    var box = $id('hubIdols'), cv = $id('hubCv');
    if(!box || !cv || !cel || !cel.contains(box)) return;
    cv.parentNode.insertBefore(box, cv.nextSibling);
    if(typeof hubIV !== 'undefined') hubIV.cw = 0;
  }
  function vitrineTrazer(){
    var box = $id('hubIdols'), slot = $id('twcAbreVitrine');
    if(!box || !slot || box.parentNode === slot) return;
    slot.appendChild(box); box.classList.add('mini');
    if(typeof hubIV !== 'undefined') hubIV.cw = 0;
    var L0 = typeof hubIV !== 'undefined' && hubIV.L && hubIV.L[0];
    // Inicializa a vitrine apenas quando vazia, sem inscrever hubIdolsUI em redraws.
    if(typeof hubIdolsUI === 'function' && (box.hidden || !box.children.length)) try{ hubIdolsUI(); }catch(e){}
    if(typeof hubIdolsLigar === 'function' && !box.twcLigada){ try{ hubIdolsLigar(); box.twcLigada = true; }catch(e){} }
  }
  // o Tsu, a Lirika e o Pati entram na fila da vitrine (só com o celular ligado); sem pontuação
  window.twcTrioVitrine = function(){
    if(!window.TW_CELULAR_LIGADO) return [];
    return MEMBROS.map(function(m, i){ var av = membroAv(i); return av ? {nick:m[1], best:0, av:av, fase:i * .4, ex:+av.expr || 0, reage:-9, trio:true, cor:m[2]} : null; }).filter(Boolean);
  };
  if(typeof window.hubIdolsLugar === 'function' && !window.hubIdolsLugar.twc){
    var lugarOrig = window.hubIdolsLugar;
    window.hubIdolsLugar = function(){
      var r = lugarOrig.apply(this, arguments);
      if(cel && !classico && typeof hubComecou !== 'undefined' && !hubComecou) vitrineTrazer();
      return r;
    };
    window.hubIdolsLugar.twc = true;
  }
  function devolver(){
    if(!embAtual) return;
    var e = embAtual; embAtual = null;
    var busca=e.el.querySelector('#hubBusca');
    if(busca){busca.maxLength=12;busca.removeAttribute('placeholder');busca.setAttribute('aria-label',tt('Procurar Idol pelo nome'));}
    if(e.pai && e.pai.isConnected) e.pai.insertBefore(e.el, e.prox && e.prox.parentNode === e.pai ? e.prox : null);
    else { var c = $id('hubCards'); if(c) c.appendChild(e.el); }
  }

  /* ---------- desenhar ---------- */
  function avatares(){
    [].slice.call(cel.querySelectorAll('canvas[data-av]')).forEach(function(cv){ try{ if(typeof perfFotoRedonda === 'function' && typeof hubAv === 'function') perfFotoRedonda(cv, hubAv(), true); }catch(e){} });
  }
  function desenhar(){
    if(!cel) return;
    var comecou = typeof hubComecou !== 'undefined' ? hubComecou : true;
    var v = comecou ? topo() : 'abre', chave = v + '|' + pilha.length;
    // A abertura é estática entre toques: não desmontar/recriar seus canvases,
    // nem retirar/reinserir a vitrine dos Idols em atualizações de login e missões.
    if(v === 'abre' && tela && tela.getAttribute('data-tela') === 'abre' && $id('twcAbreVitrine')){
      // O hub clássico pode mover a vitrine de volta; recoloque-a sem destruir a abertura.
      requestAnimationFrame(function(){
        if(cel && tela && tela.getAttribute('data-tela') === 'abre') vitrineTrazer();
      });
      return;
    }
    var rolagem=chave===ultimaTela?tela.scrollTop:0;
    var passeioAnterior=chave===ultimaTela && tela.querySelector('.tw-ritmo-hoje[open] [data-passeio]');
    var focoAnterior=chave===ultimaTela&&tela.contains(document.activeElement)?pontoAtual():null;
    ultimaTela = chave;
    tela.setAttribute('data-tela', v);
    if(embAtual && embAtual.el.parentNode && tela.contains(embAtual.el)) embAtual.pai.insertBefore(embAtual.el, embAtual.prox && embAtual.prox.parentNode === embAtual.pai ? embAtual.prox : null);
    vitrineDevolver();
    // Não clonar a árvore animada do hub a cada navegação: custo alto de DOM no iPhone.
    var serie = v === 'album' && tela.querySelector('details.album-fotos[open]');
    tela.innerHTML =
      (v === 'abre' ? telaInicial() : barraTopo() + (v === 'ritmo' && window.TW_RITMO ? TW_RITMO.html() : v === 'menu' ? telaMenu() : v === 'jogos' ? telaJogos() : v === 'ajustes' ? telaAjustes() : v === 'album' ? telaAlbum() : v === 'trio' ? telaTrio() : v === 'cal' ? telaCal() : v === 'tour' ? telaTour() : v.indexOf('tour:') === 0 ? telaTourVer(v.slice(5)) : v.indexOf('dentro:') === 0 ? telaDentro(v.slice(7)) : v.indexOf('emb:') === 0 ? telaEmb(v.slice(4)) : telaInicio()));
    if(passeioAnterior){
      var passeio=tela.querySelector('.tw-ritmo-hoje');
      if(passeio && passeio.querySelector('[data-passeio]').dataset.passeio===passeioAnterior.dataset.passeio)passeio.open=true;
    }
    var novaSerie = serie && tela.querySelector('details.album-fotos');
    if(novaSerie) novaSerie.replaceWith(serie);
    if(window.TW_ALBUM_FOTOS) TW_ALBUM_FOTOS.conferir();
    nav.hidden = v === 'abre';
    nav.innerHTML = barraBaixo();
    document.body.classList.toggle('tw-cel-classico', classico);
    avatares(); bolinhas(); idolsDesenhar(); if(v === 'album') cartasDesenhar(); if(v.indexOf('emb:') === 0) embutir(v.slice(4)); else devolver();
    if(v === 'abre'){ flutuantes(); requestAnimationFrame(function(){ if(cel && tela && tela.getAttribute('data-tela') === 'abre') vitrineTrazer(); }); }
    tela.scrollTop = rolagem;   // depois de trazer o mapa/painel de volta (antes, a tela encolhia e voltava ao topo)
    var pc = $id('twcPalcoCv'); if(pc){ pc.addEventListener('click', palcoToque); palcoLigar(); }
    if(v.indexOf('dentro:') === 0){ dentroLigar(); var dcv = $id('twcDentroCv'); if(dcv && !dcv.twc){ dcv.twc = true; dcv.addEventListener('click', dentroClique); } }
    if(v === 'trio') trioPintar();
    if(v === 'tour') tourAvatares();
    if(v.indexOf('tour:') === 0) tourDesenhar();
    if(window.TW_PRESENCA) try{ window.TW_PRESENCA.contadorUI(); }catch(e){}
    if(v === 'inicio') setTimeout(tutTalvez, 400);
    if(focoAnterior&&focoAnterior.foco)restaurarPonto(focoAnterior);
  }
  var pontosPilha=[];
  function pontoAtual(alvo){
    if(!cel||!tela)return null;
    var el=alvo||document.activeElement, seletor='';
    if(el && cel.contains(el)){
      if(el.id)seletor='#'+CSS.escape(el.id);
      else ['data-passeio','data-a','data-ir','data-v','data-n','data-twpa','data-estreia','data-pin','data-pin-ir','data-piloto-bairro','data-cald','data-calmes','data-cal-ics','data-cal-cap','data-tw-bairro'].some(function(a){
        if(!el.hasAttribute(a))return false;
        seletor='['+a+'="'+CSS.escape(el.getAttribute(a))+'"]';return true;
      });
    }
    var selecao=el&&el.id==='hubBusca'?[el.selectionStart,el.selectionEnd]:null;
    return {rota:topo(),top:tela.scrollTop,foco:seletor,selecao:selecao};
  }
  function restaurarPonto(p, original){
    if(!p||!cel||p.rota!==topo()||$id('hub').hidden)return false;
    tela.scrollTop=p.top;
    var el=original&&cel.contains(original)?original:p.foco&&cel.querySelector(p.foco);
    if(el&&el.getClientRects().length){
      el.focus({preventScroll:true});
      if(p.selecao&&el.id==='hubBusca')el.setSelectionRange(p.selecao[0],p.selecao[1]);
    }else focarTitulo();
    return true;
  }
  function ir(v,origem){
    if(classico)sairClassico();
    if(topo()===v)return;
    if(v==='cal')calCapsPedido=false;
    if(v!=='emb:mapa')ruaFofaPendente=false;
    pontosPilha[pilha.length-1]=origem&&origem.ponto||pontoAtual();pilha.push(v);
    som();desenhar();tela.scrollTop=0;
    var busca=v==='emb:busca'&&$id('hubBusca');
    if(busca)busca.focus({preventScroll:true});else focarTitulo();
  }
  function inicio(){ ruaFofaPendente = false; if(classico) sairClassico(); pilha = ['inicio']; pontosPilha=[]; som(); desenhar(); tela.scrollTop = 0; focarTitulo(); }
  function voltar(){
    ruaFofaPendente = false;
    if(classico){ sairClassico(); som(); desenhar(); return; }
    if(topo()==='emb:mapa' && typeof window.twMapaVoltarRua==='function' && window.twMapaVoltarRua()){
      som();return;
    }
    if(pilha.length>1){
      pilha.pop();var ponto=pontosPilha.pop();som();desenhar();
      if(ponto)restaurarPonto(ponto);else focarTitulo();
    }
  }
  function focarTitulo(){ var h = tela.querySelector('.twc-faixa h1, .twc-abre h1, #twcHjT'); if(h){ h.setAttribute('tabindex', '-1'); try{ h.focus({preventScroll:true}); }catch(e){} } }

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
    if(a === 'menuMais'){ folhaMais(); return; }
    if(a === 'comecar'){
      if(typeof hubComecar === 'function')hubComecar();
      requestAnimationFrame(function(){if(cel&&!$id('hub').hidden&&folha.hidden&&!janelas().length)focarTitulo();});
      return;
    }
    if(a === 'mapa' || a === 'missoes' || a === 'busca' || a === 'nov'){ ir('emb:' + a); return; }
    if(a === 'encontro'){ if(typeof encBtn !== 'undefined' && encBtn.onclick) encBtn.onclick(); return; }   // Encontro do dia
    if(a === 'battle-rival'){ if(typeof window.battleAbrir === 'function') window.battleAbrir(); return; }
    if(a === 'momentos'){
      if(!logado()){pedirLogin('Momentos⭐');return;}
      TW_CARGA.abrir('Momentos⭐', petSalaCarregar, function(){
        if(!logado())return;
        petVeioHub=true;
        petOpenUI();
        if(petPhoneAbrir('fotos'))petPhoneFotosAbaAbrir('momentos');
      });
      return;
    }
    if(a === 'karaokeEnsaio' && !logado()){ twPreviewAbrirJogo('karaoke','ensaio'); return; }
    if(a === 'festival'){ if(typeof window.jornalAbrir === 'function') window.jornalAbrir('festival'); return; }
    if(a === 'ler-capitulo'){ var cap=capHoje(); if(cap)jornalAbrir('capitulo',{tipo:'cap',data:cap.data},window.TW_JANELAS && TW_JANELAS.origem(el)); return; }
    if(a === 'news'){ if(typeof window.jornalAbrir === 'function'){ try{ if(typeof sfx !== 'undefined' && sfx.card) sfx.card(); }catch(e){} window.jornalAbrir(); } return; }
    if(a === 'tv'){ var tv = $id('twRankTvAbrir'); if(tv) tv.click(); return; }
    if(a === 'vipOla'){ // A8.4-A: apenas reação local, sem saves ou recompensas
      if(topo() === 'dentro:vip' && dentroUltimos.length){
        var membrosVip = dentroUltimos.filter(function(g){ return g.membro >= 0; });
        if(membrosVip.length){ var escolhido = membrosVip[Math.floor(Date.now() / 2500) % membrosVip.length]; dentroReage = {k:escolhido.k,t0:Date.now()}; som(); }
      }
      return;
    }
    if(a === 'vipPose'){ // A8.4-B: seleção efêmera, somente dentro do VIP
      if(topo() !== 'dentro:vip') return;
      var p = el && el.getAttribute('data-pose');
      if(['v','coracao','tchau'].indexOf(p) < 0) return;
      vipPose = p;
      var botoes = document.querySelectorAll('.twc-vip-pose');
      [].forEach.call(botoes,function(b){ b.setAttribute('aria-pressed',String(b.getAttribute('data-pose') === p)); });
      return;
    }
    if(a === 'vipFoto'){ vipFoto(); return; }
    if(a === 'vipSerie' && window.TW_ALBUM_FOTOS){ vipFoto(el); return; }
    if(a === 'portaMis'){ som(); folhaMissoes(); return; }
    if(a === 'vip'){
      if(window.TW_HUMOR && window.TW_HUMOR.vipHoje()){ ir('dentro:vip'); return; }
      var dz = window.TW_HUMOR ? window.TW_HUMOR.desejo() : null;
      folha.innerHTML = '<div class="twc-folha-caixa" role="dialog" aria-modal="true" aria-labelledby="twcVipT"><p class="twc-folha-ico twc-vip-selo" aria-hidden="true">' + ico('coroa', 34) + '</p><h2 id="twcVipT">' + esc(t2('vip')) + '</h2><p>' + esc(t2('vipComo')) + '</p>' +
        (dz ? '<p class="twc-folha-desejo"><span class="twc-desejo-ico twc-g-' + (COR[desejoIco(dz.ev)] || 'rosa') + '" aria-hidden="true">' + ico(desejoIco(dz.ev), 20) + '</span><b>' + esc(dz.texto) + '</b></p><button type="button" class="twc-btn" data-f="desejoIr" data-ev="' + esc(dz.ev) + '">' + esc(window.TW_HUMOR.rotuloRota(dz.ev)) + '</button>' : '') +
        '<button type="button" class="twc-btn twc-btn-claro" data-f="fechar">' + esc(t('agoraNao')) + '</button></div>';
      folha.hidden = false; return;
    }
    if(a === 'album'){ if(!logado()){ pedirLogin(t('album')); return; } album.dados = null; ir('album'); return; }
    if(a === 'albumCompleto'){ if(typeof window.albumAbrir === 'function') window.albumAbrir(); return; }
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
    if(b.dataset.passeio){ abrirCard(b.dataset.passeio); return; }
    if(b.dataset.ritmo && window.TW_RITMO){ var focoRitmo=b.dataset.ritmo; if(TW_RITMO.agir(focoRitmo)){desenhar();var focoNovo=cel.querySelector('[data-ritmo="'+focoRitmo+'"]');if(focoNovo)focoNovo.focus();}return;}
    if(b.dataset.f){ var f = b.dataset.f;
      if(f === 'tutOk'){ tutI++; som(); if(tutI > 2) tutFim(); else tutMostrar(); return; }
      if(f === 'tutPular'){ tutFim(); return; }
      if(f === 'manutTentar'){ fecharFolha(); falhas = 0; manutVista = false; if(typeof hubIdolsCarregar === 'function') try{ hubIdolsEm = 0; hubIdolsCarregar(); }catch(e){} if(window.TW_PRESENCA) window.TW_PRESENCA.atualizar(); return; }
      if(f === 'manutRun'){ fecharFolha(); abrirCard('run'); return; }
      if(f === 'misDia'){ fecharFolha(); acao('missoes'); return; }
      if(f === 'fa'){ fecharFolha(); if(!logado()){ pedirLogin(tp('fa')); return; } if(typeof faAbrir === 'function') faAbrir(); return; }
      if(f === 'meta'){ fecharFolha(); if(typeof window.jornalAbrir === 'function') window.jornalAbrir('comunidade'); return; }
      if(f === 'desejoIr'){ var evd = b.dataset.ev; fecharFolha(); desejoIr(evd); return; }
      fecharFolha(); if(f === 'entrar' && typeof contaEntrar === 'function') contaEntrar(); return; }
    if(b.dataset.n){ var n = b.dataset.n; if(n === 'voltar') voltar(); else if(n === 'inicio') inicio(); else if(topo() === 'menu' && !classico) voltar(); else ir('menu'); return; }
    if(b.dataset.v){ ir(b.dataset.v); return; }
    if(b.id === 'twcPinEditar'){ pinAberto = !pinAberto; desenhar(); return; }
    if(b.dataset.pin){ pinAlternar(b.dataset.pin); return; }
    if(b.dataset.pinIr){
      var atalho = b.dataset.pinIr;
      if(atalho === 'cal') ir('cal');
      else if(JOGOS.indexOf(atalho) >= 0) abrirCard(atalho);
      else acao(atalho, b);
      return;
    }
    if(b.dataset.desejo){ som(); desejoIr(b.dataset.desejo); return; }
    if(b.dataset.amigo != null){ amigosTocar('m', +b.dataset.amigo); return; }
    if(b.dataset.laco != null){ amigosSel = +b.dataset.laco; som(); desenhar(); return; }
    if(b.dataset.trioaba != null){ trioAba = +b.dataset.trioaba; som(); desenhar(); return; }
    if(b.dataset.triovoz != null){ var Lv = typeof HUB_FALAS !== 'undefined' ? HUB_FALAS[+b.dataset.triovoz] : null; try{ if(Lv && typeof hubVozTocar === 'function') hubVozTocar(Lv[Math.floor(Math.random() * (Lv.length - 1))][0]); else som(); }catch(e){} b.classList.remove('fala'); void b.offsetWidth; b.classList.add('fala'); return; }
    if(b.dataset.anivcor){ anivCoracao(b.dataset.anivcor, b); return; }
    if(b.dataset.hjaniv){ hojeAnivTodos = true; som(); desenhar(); return; }
    if(b.dataset.hjver){ hojeAberto = !hojeAberto; som(); desenhar(); return; }
    if(b.dataset.tourcor){ tourCoracao(b.dataset.tourcor, b); return; }
    if(b.dataset.calmes){ calMesMover(+b.dataset.calmes); som(); desenhar(); return; }
    if(b.dataset.calIcs){ calIcs(b.dataset.calIcs); return; }
    if(b.dataset.calCap){
      if(typeof window.jornalAbrir === 'function') window.jornalAbrir('capitulo', {tipo:b.dataset.calCap, data:calSel});
      return;
    }
    if(b.dataset.cald || b.dataset.calDia){
      calSel = b.dataset.cald || b.dataset.calDia; calMes = calSel.slice(0, 7);
      som(); desenhar();
      var dt = $id('twcCalDia');
      if(b.dataset.calDia){ var abrir = $id('twcCalFestival'); if(abrir) abrir.focus({preventScroll:true}); }
      if(dt) dt.scrollIntoView({block:'nearest'});
      return;
    }
    if(b.dataset.frase){
      if(window.TW_PRESENCA){ window.TW_PRESENCA.falar(b.dataset.frase); b.classList.add('twc-falou'); setTimeout(function(){ b.classList.remove('twc-falou'); }, 600); } som(); return; }
    if(b.dataset.filtro !== undefined){ album.filtro = b.dataset.filtro; som(); desenhar(); return; }
    if(b.dataset.cardz) return;   // o zoom do card é do próprio jogo (gacha)
    if(b.dataset.l){   // idioma: o mesmo botão do menu do Center Run (salva e traduz o jogo todo; o hub se refaz e o celular junto)
      var lb = document.querySelector('.lang button[data-l="' + b.dataset.l + '"]'); if(lb) lb.click(); som(); return;
    }
    if(b.dataset.o !== undefined){ if(typeof applyOshi === 'function') applyOshi(b.dataset.o); if(typeof hubCfgUI === 'function') hubCfgUI(); som(); desenhar(); return; }
    if(b.dataset.estreia && estreia && !logado()){
      estreia.tentativa = {jogo:b.dataset.estreia, escolheu:performance.now(), comecou:null};
      abrirCard(b.dataset.estreia);
      return;
    }
    if(b.dataset.a){ acao(b.dataset.a, b); return; }
    if(b.dataset.ir){ abrirCard(b.dataset.ir); }
  }

  /* ---------- moldura do celular nas janelas (Perfil, Pet, Loja, Gacha, Idol News, Café, Handshake...) ----------
     Toda janela do jogo (.tw-window-overlay) abre entre a mesma barra de cima e a mesma barra de baixo do celular.
     Voltar fecha a janela pelo botão ✕ dela (o jogo cuida do resto, como sempre); Menu e Início voltam ao celular. */
  var mold = null, moldRaf = 0;
  function janelas(){
    // a TsuLiPa⭐TV! também conta como janela (ganha a moldura e fecha pelo Voltar / Início)
    return [].slice.call(document.querySelectorAll('.tw-window-overlay,#twRankTvModal')).filter(function(o){ return !o.hidden && o.getClientRects().length > 0; })
      .sort(function(a, b){ return (parseInt(getComputedStyle(a).zIndex, 10) || 0) - (parseInt(getComputedStyle(b).zIndex, 10) || 0); });
  }
  function fecharJanelas(){
    for(var n = 0; n < 6; n++){
      var j = janelas(), topoJ = j[j.length - 1]; if(!topoJ) return;
      var x = topoJ.querySelector('.tw-window-close,.tw-rank-tv-close'); if(!x) return;
      x.click();
    }
  }
  function sairDoJogo(ctx){   // usa o próprio "← Início" de cada tela, que já sabe limpar o endereço e a música
    var b = ctx === 'kt' ? $id('twPreviewVoltar') : ctx === 'cr' ? $id('hubVolta') : null;
    if(b) b.click();
  }
  function voltarAoHub(){ var h = $id('hub'); if(h && h.hidden && typeof hubMostrar === 'function') hubMostrar(); }
  function molduraDesenhar(){
    var nav2 = '<button type="button" class="twc-nav-b" data-m="voltar">' + ico('voltar', 26) + '<span>' + esc(t('voltar')) + '</span></button>' +
      '<span class="twc-nav-meio"><button type="button" class="twc-nav-menu" data-m="menu" aria-label="' + esc(t('menu')) + '">' + ico('menu', 28) + '</button></span>' +
      '<button type="button" class="twc-nav-b" data-m="inicio">' + ico('casa', 26) + '<span>' + esc(t('ini')) + '</span></button>';
    mold.innerHTML = '<div class="twc-moldura-topo">' + barraTopo() + '</div><nav class="twc-nav twc-moldura-nav" aria-label="TsuLiPa⭐World">' + nav2 + '</nav>';
    [].slice.call(mold.querySelectorAll('canvas[data-av]')).forEach(function(cv){ try{ if(typeof perfFotoRedonda === 'function' && typeof hubAv === 'function') perfFotoRedonda(cv, hubAv(), true); }catch(e){} });
  }
  // Onde a moldura aparece: numa janela do jogo, no menu do Center⭐Run! (antes de correr) e no salão do
  // Karaoke⭐Time! (antes do show). Correndo ou cantando, as barras saem, como na Live do Link! Like!.
  function contexto(){
    if(janelas().length) return 'janela';
    var h = $id('hub'), menu = $id('menu'), kt = $id('twPreviewJogo');
    if(kt && !kt.hidden && kt.getAttribute('data-jogo') === 'karaoke' && !document.documentElement.classList.contains('tw-kt-arena')) return 'kt';
    if(h && h.hidden && menu && !menu.hidden && !document.body.classList.contains('jogando') && (!kt || kt.hidden)) return 'cr';
    return '';
  }
  function molduraAtualizar(){
    moldRaf = 0;
    if(!mold) return;
    var ctx = cel ? contexto() : '', on = !!ctx;
    document.body.classList.toggle('tw-cel-janela', ctx === 'janela');
    document.body.classList.toggle('tw-cel-cr', ctx === 'cr');
    document.body.classList.toggle('tw-cel-kt', ctx === 'kt');
    if(on && (mold.hidden || mold.dataset.k !== nick() + '|' + LANG)){ mold.dataset.k = nick() + '|' + LANG; molduraDesenhar(); }
    if(mold.hidden !== !on) mold.hidden = !on;
  }
  function molduraClique(e){
    var b = e.target.closest && e.target.closest('button'); if(!b || !mold.contains(b)) return;
    var m = b.dataset.m;
    var ctx = contexto();
    if(m === 'voltar'){
      if(ctx === 'janela'){ var j = janelas(), x = j[j.length - 1].querySelector('.tw-window-close,.tw-rank-tv-close'); if(x) x.click(); }
      else sairDoJogo(ctx);
      som(); return;
    }
    // tudo o mais sai da janela (ou do jogo) e segue no celular
    fecharJanelas(); sairDoJogo(contexto()); voltarAoHub();
    if(m === 'menu'){ ir('menu'); return; }
    if(m === 'inicio'){ inicio(); return; }
    if(b.dataset.v){ ir(b.dataset.v); return; }
    if(b.dataset.desejo){ som(); desejoIr(b.dataset.desejo); return; }
    if(b.dataset.amigo != null){ amigosTocar('m', +b.dataset.amigo); return; }
    if(b.dataset.laco != null){ amigosSel = +b.dataset.laco; som(); desenhar(); return; }
    if(b.dataset.trioaba != null){ trioAba = +b.dataset.trioaba; som(); desenhar(); return; }
    if(b.dataset.triovoz != null){ var Lv = typeof HUB_FALAS !== 'undefined' ? HUB_FALAS[+b.dataset.triovoz] : null; try{ if(Lv && typeof hubVozTocar === 'function') hubVozTocar(Lv[Math.floor(Math.random() * (Lv.length - 1))][0]); else som(); }catch(e){} b.classList.remove('fala'); void b.offsetWidth; b.classList.add('fala'); return; }
    if(b.dataset.tourcor){ tourCoracao(b.dataset.tourcor, b); return; }
    if(b.dataset.calmes){ calMesMover(+b.dataset.calmes); som(); desenhar(); return; }
    if(b.dataset.cald){ calSel = b.dataset.cald; som(); desenhar(); var dt = $id('twcCalDia'); if(dt) try{ dt.scrollIntoView({block:'nearest', behavior:'smooth'}); }catch(e){} return; }
    if(b.dataset.frase){
      if(window.TW_PRESENCA){ window.TW_PRESENCA.falar(b.dataset.frase); b.classList.add('twc-falou'); setTimeout(function(){ b.classList.remove('twc-falou'); }, 600); } som(); return; }
    if(b.dataset.ir){ abrirCard(b.dataset.ir); }
  }
  function molduraMontar(){
    if(mold) return;
    mold = document.createElement('div'); mold.id = 'twcMoldura'; mold.className = 'twc twc-moldura'; mold.hidden = true;
    document.body.appendChild(mold);
    mold.addEventListener('click', molduraClique);
    var agenda = function(){ if(!moldRaf && cel) moldRaf = requestAnimationFrame(molduraAtualizar); }, ob = new MutationObserver(function(records){
      // Ignora mudanças no próprio celular/moldura: evitam feedback de desenho e piscadas.
      for(var i=0;i<records.length;i++){
        var el=records[i].target;
        if(el && el.nodeType === 1 && el.closest && el.closest('#twCel,#twcMoldura')) continue;
        if(el === document.body && records[i].type === 'childList'){
          var nodes=[].slice.call(records[i].addedNodes).concat([].slice.call(records[i].removedNodes));
          if(nodes.length && nodes.every(function(n){ return n.id === 'twCel' || n.id === 'twcMoldura'; })) continue;
        }
        if(el === document.body && records[i].attributeName === 'class') continue;
        agenda(); return;
      }
    });
    ob.observe(document.body, {subtree:true, attributes:true, attributeFilter:['hidden','class'], childList:true});
    setInterval(function(){ if(cel) agenda(); }, 1500);
    ob.observe(document.documentElement, {attributes:true, attributeFilter:['class']});
  }

  /* ---------- boas-vindas do celular (3 telas, uma vez por aparelho; o tutorial clássico fica para o visual antigo) ---------- */
  var TUT_CHAVE = 'tw_cel_tut_v1', tutI = -1;
  function tutVisto(){ try{ return localStorage.getItem(TUT_CHAVE) === '1'; }catch(e){ return true; } }
  function tutFim(){ tutI = -1; try{ localStorage.setItem(TUT_CHAVE, '1'); }catch(e){} fecharFolha(); if(twLinkRota(location.hash.slice(1))||twLinkRetomar())twAbrirPeloEndereco(); }
  function tutMostrar(){
    var P2 = [['tut1', 'tut1b', 'casa'], ['tut2', 'tut2b', 'todos'], ['tut3', 'tut3b', 'menu']], p = P2[tutI]; if(!p){ tutFim(); return; }
    folha.innerHTML = '<div class="twc-folha-caixa twc-tut" role="dialog" aria-modal="true" aria-labelledby="twcTutT"><span class="twc-folha-ico twc-g-roxo">' + ico(p[2], 28) + '</span>' +
      '<h2 id="twcTutT">' + esc(t(p[0])) + '</h2><p>' + esc(t(p[1])) + '</p>' +
      '<span class="twc-tut-pontos" aria-hidden="true">' + P2.map(function(_, i){ return '<i' + (i === tutI ? ' class="on"' : '') + '></i>'; }).join('') + '</span>' +
      '<button type="button" class="twc-btn" data-f="tutOk">' + esc(tutI < P2.length - 1 ? t('tutOk') : t('tutFim')) + '</button>' +
      (tutI < P2.length - 1 ? '<button type="button" class="twc-btn twc-btn-claro" data-f="tutPular">' + esc(t('tutPular')) + '</button>' : '') +
      brilhos([[12, 8, 12], [86, 14, 10, 'l']]) + '</div>';
    folha.hidden = false;
    var b = folha.querySelector('[data-f="tutOk"]'); if(b) try{ b.focus(); }catch(e){}
  }
  // 20/11/2026: o "já vi" acompanha a conta. Quem entra com uma conta que já jogou (estrelas ou recorde no servidor)
  // não vê o tutorial de novo em outro aparelho; com sessão salva, espera a conta chegar (até 4 s) antes de decidir.
  function tutContaVeterana(j){ return !!j && ((+j.best || 0) > 0 || (+j.stars || 0) > 0); }
  function tutMarcarVisto(){ try{ localStorage.setItem(TUT_CHAVE, '1'); }catch(e){} }
  function tutSessaoGuardada(){ try{ for(var i = 0; i < localStorage.length; i++){ var k = localStorage.key(i); if(/^sb-.*-auth-token$/.test(k)) return true; } }catch(e){} return false; }
  var tutEsperaAte = 0;
  function tutTalvez(){
    if(tutI >= 0 || tutVisto() || typeof hubComecou === 'undefined' || !hubComecou) return;
    var j = typeof contaJ !== 'undefined' ? contaJ : null;
    if(tutContaVeterana(j)){ tutMarcarVisto(); return; }
    if(!j && tutSessaoGuardada()){
      if(!tutEsperaAte) tutEsperaAte = Date.now() + 4000;
      if(Date.now() < tutEsperaAte){ setTimeout(tutTalvez, 300); return; }
    }
    tutI = 0; tutMostrar();
  }
  function tutContaChegou(j){ if(!tutContaVeterana(j)) return; tutMarcarVisto(); if(tutI >= 0){ tutI = -1; fecharFolha(); } }

  /* ---------- montar ---------- */
  // Ligar e desligar na hora, sem recarregar a página (o hub clássico nunca deixou de estar montado por baixo).
  function desligar(){
    try{ localStorage.setItem(CHAVE, '0'); }catch(e){}   // escolheu o clássico: fica assim até ligar de novo
    window.TW_CELULAR_LIGADO = false; limparEndereco(); fecharFolha();
    devolver(); vitrineDevolver();
    if(cel){ cel.remove(); cel = null; }
    if(mold){ mold.hidden = true; }
    document.body.classList.remove('tw-cel', 'tw-cel-classico', 'tw-cel-janela', 'tw-cel-cr', 'tw-cel-kt');
    classico = false; pilha = ['inicio'];
    if(typeof hubCfgUI === 'function') hubCfgUI();
  }
  function ligar(){ window.TW_CELULAR_LIGADO = true; pilha = ['inicio']; classico = false; montar(); }
  // Se a interface nova falhar, o hub clássico deve continuar acessível.
  // Não tocar em saves, conta, inventário ou dados do servidor.
  function falhaInicializacao(erro){
    try{ vitrineDevolver(); }catch(e){}
    try{ if(cel){ cel.remove(); cel = null; } }catch(e){}
    tela = nav = folha = null;
    try{ if(mold) mold.hidden = true; }catch(e){}
    document.body.classList.remove('tw-cel', 'tw-cel-classico', 'tw-cel-janela', 'tw-cel-cr', 'tw-cel-kt');
    window.TW_CELULAR_LIGADO = false;
    try{ localStorage.removeItem(CHAVE); }catch(e){}
    try{ console.error('[TsuLiPa] Visual novo indisponível; mantendo hub clássico.', erro); }catch(e){}
  }
  function montar(){
    var h = $id('hub'); if(!h || cel || !window.TW_CELULAR_LIGADO) return;
    try{
    molduraMontar();
    cel = document.createElement('div'); cel.id = 'twCel'; cel.className = 'twc';
    cel.innerHTML = '<div class="twc-tela" id="twcTela"></div><nav class="twc-nav" id="twcNav" aria-label="TsuLiPa⭐World"></nav><div class="twc-folha" id="twcFolha" hidden></div>';
    h.appendChild(cel);
    tela = $id('twcTela'); nav = $id('twcNav'); folha = $id('twcFolha');
    cel.addEventListener('click', clique);
    cel.addEventListener('input', function(e){
      if(e.target.id==='hubBusca')buscaAtalhos(e.target.value);
    });
    folha.addEventListener('click', function(e){ if(e.target === folha){ if(tutI >= 0) tutFim(); else fecharFolha(); } });
    if(!montar.tecla) document.addEventListener('keydown', function(e){
      if(e.key !== 'Escape' || e.defaultPrevented || !cel || h.hidden) return;
      if(!folha.hidden){ e.preventDefault(); if(tutI >= 0) tutFim(); else fecharFolha(); return; }
      if(Array.from(document.querySelectorAll('[aria-modal="true"],dialog[open]')).some(function(el){return el.getClientRects().length;}))return;
      if(classico || pilha.length > 1){ e.preventDefault(); voltar(); }
    });
    montar.tecla = true;
    desenhar();
    document.body.classList.add('tw-cel');
    }catch(e){ falhaInicializacao(e); }
  }
  // Vários eventos do hub podem ocorrer na mesma frame (login, estrelas, missões).
  // Um único desenho por frame evita reconstruir toda a tela repetidamente.
  var redesenhoRaf = 0;
  function agendarRedesenho(){
    if(!cel || redesenhoRaf) return;
    redesenhoRaf = requestAnimationFrame(function(){
      redesenhoRaf = 0;
      if(!cel) return;
      try{ desenhar(); }catch(e){ falhaInicializacao(e); }
    });
  }
  // Refaz junto com o hub (idioma, login, estrelas, alertas, missões, "Toque para começar").
  ['hubMontar', 'hubCardsUI', 'hubComecar', 'hubMisUI', 'hubMostrar', 'hubTemaUI'].forEach(function(nome){
    var f = window[nome]; if(typeof f !== 'function') return;
    window[nome] = function(){ var r = f.apply(this, arguments); agendarRedesenho(); return r; };
  });
  // Estrelas e visita do mapa mudam sozinhas: atualiza só esses textos (sem refazer a tela e perder o foco).
  setInterval(function(){
    var h = $id('hub'); if(!cel || !h || h.hidden) return;
    var s = $id('twcEstrelas'); if(s && s.textContent !== estrelas()) s.textContent = estrelas();
    var v = $id('twcVisita'); if(v){ var tx = visita(); if(v.textContent !== tx){ v.textContent = tx; if(tela && tela.getAttribute('data-tela') !== 'abre') agendarRedesenho(); } }   // trocou quem passeia: refaz o selinho com a bolinha certa
  }, 5000);
  if(document.readyState !== 'loading') montar(); else document.addEventListener('DOMContentLoaded', montar);
  window.TW_CELULAR = {visitar:function(k){
      if(k==='mapa'){acao('mapa');return;}
      if(k==='tour'){ir('tour');return;}
      if(k==='fotos'){ir('album');return;}
      if(['run','sora','karaoke','loja','studio','pet'].indexOf(k)>=0)abrirCard(k);
    },toast:toast, tutContaChegou:tutContaChegou, txt:T, jogos:JOGOS, pedeLogin:PEDE_LOGIN, chave:CHAVE, ligar:ligar, desligar:desligar, rotaPronta:function(){return tutVisto()&&!classico&&(!folha||folha.hidden);}, pontoAtual:pontoAtual, restaurarPonto:restaurarPonto, estreiaEtapa:estreiaEtapa, estreiaMedidas:estreiaMedidas};
})();

