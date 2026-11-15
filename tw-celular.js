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
    pt:{idols:'Idols do TsuLiPa⭐World', tut1:'Este é o seu celular de Idol!', tut1b:'Em cima ficam você e as suas estrelas. Embaixo: Voltar, Menu e Início, em todas as telas.', tut2:'Cada app é um jogo', tut2b:'A bolinha vermelha avisa que tem novidade. O cadeado pede para entrar com o Google.', tut3:'O Menu guarda o resto', tut3b:'Pra hoje, ranking, pet, álbum, Idol News e ajustes. Quer o visual antigo? Está em Ajustes.', tutOk:'Próximo', tutFim:'Vamos lá!', tutPular:'Pular',
        rankVazio:'Jogue o Center Run para entrar no ranking', todosAlbum:'Todos', outros:'Outros', albumSub:'Seus cards do Star⭐Gacha!', albumVazio:'Nenhum card aqui ainda. Gire o Star⭐Gacha!', albumCompleto:'Ver metas e trocar cards', filtro:'Filtrar por Oshi',
        vis:'Visitante', ini:'Início', menu:'Menu', voltar:'Voltar', jogos:'Jogos', todos:'Todos os jogos', hoje:'Pra hoje', emdia:'Tudo em dia por hoje!',
        mis:'Missões do dia', rank:'Ranking da semana', tv:'Ver na TV', mapa:'Mapa', mapaAgora:'Agora no mapa: {quem} · {rua}', mapaVazio:'Passeie pelo mapa da cidade',
        menuSub:'Tudo do TsuLiPa⭐World', jogosSub:'{n} jogos · escolha um', ajustes:'Ajustes', ajustesSub:'Idioma, tema e conta', classico:'Voltar ao visual clássico',
        loginT:'Entre para jogar', loginTxt:'Este jogo salva o seu progresso na sua conta. Entre com o Google para jogar.', agoraNao:'Agora não', entrar:'Entrar', sair:'Sair', sairOk:'Toque de novo para sair',
        album:'Álbum', busca:'Procurar Idol', nov:'Novidades', estrelas:'Ganhar estrelas', perfil:'Seu perfil', previa:'Visual novo (prévia)'},
    en:{idols:'TsuLiPa⭐World Idols', tut1:'This is your Idol phone!', tut1b:'You and your stars are at the top. At the bottom: Back, Menu and Home, on every screen.', tut2:'Each app is a game', tut2b:'A red dot means something new. A lock means sign in with Google.', tut3:'The Menu holds the rest', tut3b:'For today, ranking, pet, album, Idol News and settings. Want the old look? It is in Settings.', tutOk:'Next', tutFim:"Let's go!", tutPular:'Skip',
        rankVazio:'Play Center Run to join the ranking', todosAlbum:'All', outros:'Others', albumSub:'Your Star⭐Gacha! cards', albumVazio:'No cards here yet. Spin the Star⭐Gacha!', albumCompleto:'See goals and trade cards', filtro:'Filter by Oshi',
        vis:'Visitor', ini:'Home', menu:'Menu', voltar:'Back', jogos:'Games', todos:'All games', hoje:'For today', emdia:"You're all set for today!",
        mis:'Daily missions', rank:'Weekly ranking', tv:'Watch on TV', mapa:'Map', mapaAgora:'On the map now: {quem} · {rua}', mapaVazio:'Stroll around the city map',
        menuSub:'Everything in TsuLiPa⭐World', jogosSub:'{n} games · pick one', ajustes:'Settings', ajustesSub:'Language, theme and account', classico:'Back to the classic look',
        loginT:'Sign in to play', loginTxt:'This game saves your progress to your account. Sign in with Google to play.', agoraNao:'Not now', entrar:'Sign in', sair:'Sign out', sairOk:'Tap again to sign out',
        album:'Album', busca:'Find an Idol', nov:"What's new", estrelas:'Get stars', perfil:'Your profile', previa:'New look (preview)'},
    es:{idols:'Idols de TsuLiPa⭐World', tut1:'¡Este es tu celular de Idol!', tut1b:'Arriba estás tú con tus estrellas. Abajo: Volver, Menú e Inicio, en todas las pantallas.', tut2:'Cada app es un juego', tut2b:'El punto rojo avisa que hay novedad. El candado pide entrar con Google.', tut3:'El Menú guarda el resto', tut3b:'Para hoy, ranking, mascota, álbum, Idol News y ajustes. ¿Quieres el estilo anterior? Está en Ajustes.', tutOk:'Siguiente', tutFim:'¡Vamos!', tutPular:'Saltar',
        rankVazio:'Juega Center Run para entrar al ranking', todosAlbum:'Todos', outros:'Otros', albumSub:'Tus cards de Star⭐Gacha!', albumVazio:'Aún no hay cards aquí. ¡Gira el Star⭐Gacha!', albumCompleto:'Ver metas e intercambiar cards', filtro:'Filtrar por Oshi',
        vis:'Visitante', ini:'Inicio', menu:'Menú', voltar:'Volver', jogos:'Juegos', todos:'Todos los juegos', hoje:'Para hoy', emdia:'¡Todo listo por hoy!',
        mis:'Misiones del día', rank:'Ranking de la semana', tv:'Ver en la TV', mapa:'Mapa', mapaAgora:'Ahora en el mapa: {quem} · {rua}', mapaVazio:'Pasea por el mapa de la ciudad',
        menuSub:'Todo de TsuLiPa⭐World', jogosSub:'{n} juegos · elige uno', ajustes:'Ajustes', ajustesSub:'Idioma, tema y cuenta', classico:'Volver al estilo clásico',
        loginT:'Entra para jugar', loginTxt:'Este juego guarda tu progreso en tu cuenta. Entra con Google para jugar.', agoraNao:'Ahora no', entrar:'Entrar', sair:'Salir', sairOk:'Toca otra vez para salir',
        album:'Álbum', busca:'Buscar Idol', nov:'Novedades', estrelas:'Ganar estrellas', perfil:'Tu perfil', previa:'Estilo nuevo (vista previa)'},
    id:{idols:'Idol TsuLiPa⭐World', tut1:'Ini ponsel Idol-mu!', tut1b:'Di atas ada kamu dan bintangmu. Di bawah: Kembali, Menu, dan Beranda, di setiap layar.', tut2:'Setiap aplikasi adalah game', tut2b:'Titik merah berarti ada yang baru. Gembok berarti masuk dengan Google.', tut3:'Menu menyimpan sisanya', tut3b:'Untuk hari ini, peringkat, hewan, album, Idol News, dan pengaturan. Mau tampilan lama? Ada di Pengaturan.', tutOk:'Lanjut', tutFim:'Ayo!', tutPular:'Lewati',
        rankVazio:'Main Center Run untuk masuk peringkat', todosAlbum:'Semua', outros:'Lainnya', albumSub:'Kartu Star⭐Gacha! milikmu', albumVazio:'Belum ada kartu di sini. Putar Star⭐Gacha!', albumCompleto:'Lihat target dan tukar kartu', filtro:'Saring menurut Oshi',
        vis:'Pengunjung', ini:'Beranda', menu:'Menu', voltar:'Kembali', jogos:'Game', todos:'Semua game', hoje:'Untuk hari ini', emdia:'Semua beres untuk hari ini!',
        mis:'Misi harian', rank:'Peringkat minggu ini', tv:'Tonton di TV', mapa:'Peta', mapaAgora:'Di peta sekarang: {quem} · {rua}', mapaVazio:'Jalan-jalan di peta kota',
        menuSub:'Semua isi TsuLiPa⭐World', jogosSub:'{n} game · pilih satu', ajustes:'Pengaturan', ajustesSub:'Bahasa, tema, dan akun', classico:'Kembali ke tampilan klasik',
        loginT:'Masuk untuk bermain', loginTxt:'Game ini menyimpan progresmu di akunmu. Masuk dengan Google untuk bermain.', agoraNao:'Nanti saja', entrar:'Masuk', sair:'Keluar', sairOk:'Ketuk lagi untuk keluar',
        album:'Album', busca:'Cari Idol', nov:'Yang baru', estrelas:'Dapatkan bintang', perfil:'Profilmu', previa:'Tampilan baru (pratinjau)'},
    th:{idols:'ไอดอลของ TsuLiPa⭐World', tut1:'นี่คือมือถือไอดอลของคุณ!', tut1b:'ด้านบนคือคุณและดาวของคุณ ด้านล่าง: กลับ เมนู และหน้าแรก ในทุกหน้าจอ', tut2:'แต่ละแอปคือเกมหนึ่งเกม', tut2b:'จุดแดงแปลว่ามีของใหม่ แม่กุญแจแปลว่าต้องเข้าสู่ระบบด้วย Google', tut3:'เมนูเก็บทุกอย่างที่เหลือ', tut3b:'สำหรับวันนี้ อันดับ สัตว์เลี้ยง อัลบั้ม Idol News และการตั้งค่า อยากได้หน้าตาแบบเดิม? อยู่ในการตั้งค่า', tutOk:'ถัดไป', tutFim:'ไปกันเลย!', tutPular:'ข้าม',
        rankVazio:'เล่น Center Run เพื่อติดอันดับ', todosAlbum:'ทั้งหมด', outros:'อื่น ๆ', albumSub:'การ์ด Star⭐Gacha! ของคุณ', albumVazio:'ยังไม่มีการ์ดที่นี่ ลองหมุน Star⭐Gacha!', albumCompleto:'ดูเป้าหมายและแลกการ์ด', filtro:'กรองตามโอชิ',
        vis:'ผู้เยี่ยมชม', ini:'หน้าแรก', menu:'เมนู', voltar:'กลับ', jogos:'เกม', todos:'เกมทั้งหมด', hoje:'สำหรับวันนี้', emdia:'วันนี้ครบหมดแล้ว!',
        mis:'ภารกิจประจำวัน', rank:'อันดับประจำสัปดาห์', tv:'ดูทางทีวี', mapa:'แผนที่', mapaAgora:'ตอนนี้บนแผนที่: {quem} · {rua}', mapaVazio:'เดินเล่นในแผนที่เมือง',
        menuSub:'ทุกอย่างใน TsuLiPa⭐World', jogosSub:'{n} เกม · เลือกหนึ่งเกม', ajustes:'ตั้งค่า', ajustesSub:'ภาษา ธีม และบัญชี', classico:'กลับไปหน้าตาแบบเดิม',
        loginT:'เข้าสู่ระบบเพื่อเล่น', loginTxt:'เกมนี้บันทึกความคืบหน้าไว้ในบัญชีของคุณ เข้าสู่ระบบด้วย Google เพื่อเล่น', agoraNao:'ไว้ก่อน', entrar:'เข้าสู่ระบบ', sair:'ออกจากระบบ', sairOk:'แตะอีกครั้งเพื่อออก',
        album:'อัลบั้ม', busca:'ค้นหาไอดอล', nov:'มีอะไรใหม่', estrelas:'รับดาว', perfil:'โปรไฟล์ของคุณ', previa:'หน้าตาใหม่ (ทดลอง)'},
    ja:{idols:'TsuLiPa⭐Worldのアイドル', tut1:'これがあなたのアイドルケータイ！', tut1b:'上にはあなたとスター。下には「もどる・メニュー・ホーム」がどの画面にもあります。', tut2:'アプリひとつがゲームひとつ', tut2b:'赤い点はお知らせ。カギはGoogleでログインが必要です。', tut3:'のこりはメニューに', tut3b:'きょうのおすすめ、ランキング、ペット、アルバム、Idol News、設定。前の表示がいい？設定にあります。', tutOk:'つぎへ', tutFim:'はじめよう！', tutPular:'スキップ',
        rankVazio:'Center Runを遊んでランキングに参加しよう', todosAlbum:'全員', outros:'その他', albumSub:'あなたのStar⭐Gacha!カード', albumVazio:'まだカードがありません。Star⭐Gacha!を回そう！', albumCompleto:'目標とカード交換を見る', filtro:'推しで絞り込む',
        vis:'ゲスト', ini:'ホーム', menu:'メニュー', voltar:'もどる', jogos:'ゲーム', todos:'すべてのゲーム', hoje:'きょうのおすすめ', emdia:'きょうはぜんぶ完了！',
        mis:'デイリーミッション', rank:'今週のランキング', tv:'テレビで見る', mapa:'マップ', mapaAgora:'いまマップに：{quem}・{rua}', mapaVazio:'街のマップをおさんぽしよう',
        menuSub:'TsuLiPa⭐Worldのすべて', jogosSub:'{n}本のゲーム・ひとつ選んでね', ajustes:'設定', ajustesSub:'言語・テーマ・アカウント', classico:'クラシック表示にもどす',
        loginT:'ログインして遊ぼう', loginTxt:'このゲームは進みぐあいをアカウントに保存します。Googleでログインして遊んでね。', agoraNao:'あとで', entrar:'ログイン', sair:'ログアウト', sairOk:'もう一度タップでログアウト',
        album:'アルバム', busca:'アイドルをさがす', nov:'おしらせ', estrelas:'スターをもらう', perfil:'あなたのプロフィール', previa:'新しい表示（お試し）'}
  };
  // artigo certo no português: o Tsu, a Lirika, o Pati
  var ARTIGO = {Tsu:'o', Lirika:'a', Pati:'o'};
  function L(){ return (typeof LANG === 'string' && T[LANG]) ? LANG : 'pt'; }
  function t(k){ return T[L()][k] || T.pt[k]; }
  // Textos da rodada BarbieGirls/Zwinky (15/11): frases, interiores, Cantinho dos pais e manutenção
  var T2 = {
    falar:{pt:'💬 Falar',en:'💬 Say',es:'💬 Decir',id:'💬 Bilang',th:'💬 พูด',ja:'💬 ひとこと'},
    entrarEm:{pt:'Entrar: {n}',en:'Go in: {n}',es:'Entrar: {n}',id:'Masuk: {n}',th:'เข้า: {n}',ja:'入る：{n}'},
    dentroSub:{pt:'Quem passa por aqui agora',en:"Who's hanging out here now",es:'Quién está aquí ahora',id:'Siapa yang ada di sini',th:'ใครอยู่ที่นี่ตอนนี้',ja:'いまここにいるアイドル'},
    pais:{pt:'Cantinho dos pais',en:"Parents' corner",es:'Rincón de los padres',id:'Pojok orang tua',th:'มุมผู้ปกครอง',ja:'保護者のみなさまへ'},
    paisSub:{pt:'Como o TsuLiPa⭐World cuida de quem joga',en:'How TsuLiPa⭐World looks after players',es:'Cómo TsuLiPa⭐World cuida a quien juega',id:'Cara TsuLiPa⭐World menjaga pemain',th:'TsuLiPa⭐World ดูแลผู้เล่นอย่างไร',ja:'TsuLiPa⭐Worldの安心のしくみ'},
    pais1:{pt:'É um jogo de fã do BRS48: gratuito, sem anúncios e sem nada à venda com dinheiro de verdade. As estrelas só se ganham jogando.',en:'A BRS48 fan game: free, no ads and nothing sold for real money. Stars are only earned by playing.',es:'Un juego de fans de BRS48: gratis, sin anuncios y sin nada a la venta con dinero real. Las estrellas solo se ganan jugando.',id:'Game penggemar BRS48: gratis, tanpa iklan, dan tidak ada yang dijual dengan uang asli. Bintang hanya didapat dari bermain.',th:'เกมแฟนเมดของ BRS48 ฟรี ไม่มีโฆษณา และไม่มีอะไรขายด้วยเงินจริง ดาวได้จากการเล่นเท่านั้น',ja:'BRS48のファンゲームです。無料・広告なしで、お金で買えるものはありません。スターは遊んで集めるだけです。'},
    pais2:{pt:'Dá para jogar sem conta. Entrar com o Google é opcional e só guarda o progresso: o e-mail fica privado e nunca aparece no jogo. Não pedimos endereço, telefone nem fotos; o aniversário (só dia e mês) é opcional.',en:'You can play without an account. Google sign-in is optional and only keeps progress: the e-mail stays private and never shows in the game. We never ask for address, phone or photos; birthday (day and month only) is optional.',es:'Se puede jugar sin cuenta. Entrar con Google es opcional y solo guarda el progreso: el correo es privado y nunca aparece en el juego. No pedimos dirección, teléfono ni fotos; el cumpleaños (solo día y mes) es opcional.',id:'Bisa main tanpa akun. Masuk dengan Google opsional dan hanya menyimpan progres: email tetap pribadi dan tidak pernah muncul di game. Kami tidak meminta alamat, telepon, atau foto; ulang tahun (hanya tanggal dan bulan) opsional.',th:'เล่นได้โดยไม่ต้องมีบัญชี การเข้าสู่ระบบด้วย Google เป็นทางเลือกและใช้เก็บความคืบหน้าเท่านั้น อีเมลเป็นความลับและไม่แสดงในเกม เราไม่ขอที่อยู่ เบอร์โทร หรือรูปถ่าย วันเกิด (แค่วันและเดือน) ไม่บังคับ',ja:'アカウントなしでも遊べます。Googleログインは任意で、進み具合の保存だけに使います。メールアドレスは非公開で、ゲームに表示されません。住所・電話番号・写真はたずねません。誕生日（月日のみ）も任意です。'},
    pais3:{pt:'Não existe chat ao vivo. No mapa, os balões são frases prontas de uma lista. Os recados do perfil passam por filtro de palavras (sem palavrões, links ou telefones), têm até 60 letras, 1 por dia, e podem ser desligados no perfil.',en:'There is no live chat. On the map, bubbles are ready-made phrases from a list. Profile notes go through a word filter (no swearing, links or phone numbers), have up to 60 letters, 1 per day, and can be turned off in the profile.',es:'No hay chat en vivo. En el mapa, los globos son frases listas de una lista. Los mensajes del perfil pasan por un filtro de palabras (sin groserías, enlaces ni teléfonos), tienen hasta 60 letras, 1 por día, y se pueden desactivar en el perfil.',id:'Tidak ada obrolan langsung. Di peta, balon berisi kalimat siap pakai dari daftar. Pesan di profil melewati filter kata (tanpa kata kasar, tautan, atau nomor telepon), maksimal 60 huruf, 1 per hari, dan bisa dimatikan di profil.',th:'ไม่มีแชทสด บนแผนที่บอลลูนเป็นประโยคสำเร็จรูปจากรายการ ข้อความในโปรไฟล์ผ่านตัวกรองคำ (ไม่มีคำหยาบ ลิงก์ หรือเบอร์โทร) ยาวไม่เกิน 60 ตัวอักษร วันละ 1 ข้อความ และปิดได้ในโปรไฟล์',ja:'ライブチャットはありません。マップのふきだしはリストから選ぶ定型文です。プロフィールのメッセージは言葉のフィルターを通り（悪口・リンク・電話番号は不可）、60文字まで・1日1件で、プロフィールでオフにできます。'},
    pais4:{pt:'O nome de Idol e o boneco aparecem para outras pessoas (ranking, mapa, Battle). O administrador do jogo pode apagar recados, corrigir nomes ofensivos e bloquear contas que desrespeitem alguém.',en:'The Idol name and avatar are visible to others (rankings, map, Battle). The game admin can delete notes, fix offensive names and block accounts that disrespect anyone.',es:'El nombre de Idol y el avatar se ven para otras personas (ranking, mapa, Battle). El administrador puede borrar mensajes, corregir nombres ofensivos y bloquear cuentas que falten el respeto.',id:'Nama Idol dan avatar terlihat oleh orang lain (peringkat, peta, Battle). Admin game bisa menghapus pesan, memperbaiki nama yang menyinggung, dan memblokir akun yang tidak sopan.',th:'ชื่อไอดอลและอวตารจะแสดงให้คนอื่นเห็น (อันดับ แผนที่ Battle) ผู้ดูแลเกมลบข้อความ แก้ชื่อที่ไม่สุภาพ และบล็อกบัญชีที่ไม่ให้เกียรติผู้อื่นได้',ja:'アイドル名とアバターはほかの人にも表示されます（ランキング・マップ・Battle）。運営はメッセージの削除、失礼な名前の修正、ほかの人を傷つけるアカウントのブロックができます。'},
    pais5:{pt:'A conta pode ser apagada na hora em Meu Perfil → Apagar minha conta (save, ranking, recados e corações somem de verdade). O jogo é de inclusão: todo mundo é bem-vindo em tudo.',en:'The account can be deleted instantly in My Profile → Delete my account (save, rankings, notes and hearts are really erased). Everyone is welcome in everything.',es:'La cuenta se puede borrar al instante en Mi Perfil → Borrar mi cuenta (se eliminan de verdad el progreso, el ranking, los mensajes y los corazones). Todo el mundo es bienvenido en todo.',id:'Akun bisa dihapus seketika di Profil Saya → Hapus akun saya (simpanan, peringkat, pesan, dan hati benar-benar terhapus). Semua orang diterima di semua hal.',th:'ลบบัญชีได้ทันทีที่ โปรไฟล์ของฉัน → ลบบัญชีของฉัน (ข้อมูลที่บันทึก อันดับ ข้อความ และหัวใจถูกลบจริง) ทุกคนได้รับการต้อนรับในทุกอย่าง',ja:'アカウントは「マイプロフィール → アカウントを削除」ですぐに削除できます（セーブ・ランキング・メッセージ・ハートが本当に消えます）。だれでもすべてに参加できます。'},
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
    vipFoto:{pt:'Foto VIP (PNG)',en:'VIP photo (PNG)',es:'Foto VIP (PNG)',id:'Foto VIP (PNG)',th:'รูป VIP (PNG)',ja:'VIP写真（PNG）'},
    treino:{pt:'Treino',en:'Practice',es:'Práctica',id:'Latihan',th:'ฝึกซ้อม',ja:'練習'},
    legCad:{pt:'pede conta para abrir',en:'needs an account',es:'necesita cuenta',id:'perlu akun',th:'ต้องมีบัญชี',ja:'アカウントが必要'},
    legTreino:{pt:'joga sem conta, mas prêmio e ranking só entrando',en:'play without an account; prizes and rankings need one',es:'juega sin cuenta; premios y ranking necesitan una',id:'main tanpa akun; hadiah dan peringkat perlu akun',th:'เล่นได้โดยไม่มีบัญชี แต่รางวัลและอันดับต้องเข้าสู่ระบบ',ja:'アカウントなしで遊べます。ごほうびとランキングはログインが必要'},
    jogarRun:{pt:'Jogar Center⭐Run!',en:'Play Center⭐Run!',es:'Jugar Center⭐Run!',id:'Main Center⭐Run!',th:'เล่น Center⭐Run!',ja:'Center⭐Run!であそぶ'}
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
    estrela:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    trio:'<circle cx="12" cy="7" r="3.2"/><circle cx="6" cy="15" r="3.2"/><circle cx="18" cy="15" r="3.2"/><path d="M9.6 9.4L7.8 12.3M14.4 9.4l1.8 2.9M9.2 15h5.6"/>'
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
  function alerta(c){ return !!(c && (c.classList.contains('tw-alert-pink') || c.querySelector('.hubalerta:not([hidden])'))); }
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
    if(window.TW_HUMOR) try{ window.TW_HUMOR.abriu(k); }catch(e){}
    c.click();   // o mesmo caminho do hub: sons, cadeados, prêmios e telas continuam iguais
  }
  var JOGOS = ['run', 'karaoke', 'sora', 'battle', 'duo', 'cafe', 'handshake', 'studio', 'bloom', 'pet'];
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
      '<button type="button" class="twc-fichas-chip" data-v="trio">♡ ' + esc(tf('fichas')) + '</button>' +
      // quem passeia no mapa agora vira um selinho no canto do palco (com a bolinha do membro)
      '<button type="button" class="twc-selo" data-a="mapa">' + (v ? '<canvas class="twc-bola-mini" data-membro="' + v.k + '" width="64" height="64" aria-hidden="true"></canvas>' : '<i class="twc-vivo" aria-hidden="true"></i>') +
      '<span id="twcVisita">' + esc(visita()) + '</span>' + ico('seta', 16) + '</button></div></section>';
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
    return '<div class="twc-pag twc-inicio"><div class="twc-lado">' + palco() + '</div>' +
      '<div class="twc-lado">' + destaque + humorHtml() + '<section class="twc-apps" aria-label="' + esc(t('jogos')) + '">' + grade + '</section>' + idols() + '</div></div>';
  }

  /* ---------- Menu: você, o dia, os destaques e os atalhos ---------- */
  function banner(k, tit, linha, botao, attrs, fita, extra){
    return '<button type="button" class="twc-banner" ' + attrs + '><span class="twc-banner-ico twc-g-' + (COR[k] || 'roxo') + '">' + ico(k, 26) + '</span>' + (fita ? '<em class="twc-fita">' + esc(fita) + '</em>' : '') +
      '<span class="twc-banner-txt"><b translate="no">' + esc(tit) + '</b><small>' + esc(linha) + '</small>' + (extra || '') + '</span><span class="twc-amarelo">' + esc(botao) + '</span></button>';
  }
  function telaMenu(){
    var run = card('run'), kar = card('karaoke'), gac = card('gacha');
    var musica = ''; try{ musica = typeof hubMusicaSemana === 'function' ? hubMusicaSemana()[1] : ''; }catch(e){}
    var mis = (logado() && typeof hubMisDados !== 'undefined' && Array.isArray(hubMisDados)) ? hubMisDados : null;
    var feitas = mis ? mis.filter(function(m){ return m.feito; }).length : 0, pc = mis && mis.length ? Math.round(feitas / mis.length * 100) : 0;
    var linhas = pendencias().slice(0, 4).map(function(c){
      return '<button type="button" class="twc-linha" data-ir="' + esc(chaveDe(c)) + '"><span class="twc-linha-ico twc-g-' + (COR[chaveDe(c)] || 'roxo') + '">' + ico(chaveDe(c), 18) + '</span><span class="twc-linha-txt"><b translate="no">' + esc(titulo(c)) + '</b><small>' + esc(descricao(c)) + '</small></span>' + ico('seta', 18) + '</button>';
    });
    if(mis && mis.length) linhas.push('<button type="button" class="twc-linha" data-a="missoes"><span class="twc-linha-ico twc-g-lima">' + ico('missoes', 18) + '</span><span class="twc-linha-txt"><b>' + esc(t('mis')) + '</b><small>' + feitas + '/' + mis.length + '</small></span>' + ico('seta', 18) + '</button>');
    if(!linhas.length) linhas.push('<p class="twc-emdia">' + ico('check', 18) + ' ' + esc(t('emdia')) + '</p>');
    var pi = []; try{ pi = typeof hubPetInfo === 'function' ? hubPetInfo() : []; }catch(e){ pi = []; }
    var petC = card('pet'), petEmo = (petC && petC.querySelector('i')) ? petC.querySelector('i').textContent : '';
    var rec = +(typeof best !== 'undefined' ? best : 0) || 0;
    var bs = [];
    if(run) bs.push(banner('run', titulo(run), tt('Recorde') + ': ' + recorde(), tt('Jogar'), 'data-ir="run"'));
    if(kar) bs.push(banner('karaoke', titulo(kar), musica ? tt('Música da semana') + ': ' + musica : descricao(kar), tt('Abrir'), 'data-ir="karaoke"', alerta(kar) ? '!' : ''));
    if(gac) bs.push(banner('gacha', titulo(gac), tt('1 giro por dia'), tt('Abrir'), 'data-ir="gacha"', alerta(gac) ? '!' : ''));
    bs.push(banner('news', 'Idol⭐News!', tt('Os destaques da semana'), tt('Abrir'), 'data-a="news"'));
    var at = [['missoes', t('mis'), 'data-a="missoes"'], ['perfil', tt('Meu Perfil'), 'data-ir="perfil"'], ['loja', 'Zipper Shop', 'data-ir="loja"'], ['album', t('album'), 'data-a="album"'],
              ['tv', 'TsuLiPa TV', 'data-a="tv"'], ['busca', t('busca'), 'data-a="busca"'], ['nov', t('nov'), 'data-a="nov"'], ['trio', 'TsuLiPa ♡', 'data-v="trio"'], ['ajustes', t('ajustes'), 'data-v="ajustes"']];
    return faixa(esc(t('menu')), t('menuSub')) + '<div class="twc-pag twc-menu">' +
      '<div class="twc-menu-topo"><div class="twc-duas">' +
        '<button type="button" class="twc-card twc-idol" data-ir="pet"><canvas class="twc-idol-av" data-av="1" width="160" height="160" aria-hidden="true"></canvas>' +
          (petEmo ? '<span class="twc-idol-pet" aria-hidden="true">' + esc(petEmo) + '</span>' : '') + '<b>' + esc(pi[0] || 'Backstage⭐Pet!') + '</b>' + badge(petC) + '</button>' +
        '<button type="button" class="twc-card twc-rank" data-a="tv"><span class="twc-rank-t">' + ico('trofeu', 20) + '<b>' + esc(t('rank')) + '</b></span>' +
          (rec ? '<span class="twc-rank-n">' + esc(recorde()) + '</span><small>' + esc(tt('Recorde')) + ' · ' + esc(t('tv')) + '</small>' : '<small class="twc-rank-vazio">' + esc(t('rankVazio')) + '</small><small>' + esc(t('tv')) + '</small>') + '</button>' +
      '</div>' +
      '<section class="twc-card twc-hoje" aria-labelledby="twcHojeT"><div class="twc-card-cab"><h2 id="twcHojeT">' + esc(t('hoje')) + '</h2>' +
        (mis && mis.length ? '<span class="twc-prog"><span class="twc-barra" aria-hidden="true"><i style="width:' + pc + '%"></i></span><small>' + feitas + '/' + mis.length + '</small></span>' : '') + '</div>' +
        linhas.join('') + '</section></div>' +
      '<div class="twc-banners">' + bs.join('') + '</div>' +
      '<section class="twc-atalhos" aria-label="' + esc(t('menu')) + '">' + at.map(function(a){
        var c = a[2].indexOf('data-ir') === 0 ? card(a[0]) : null;
        return '<button type="button" class="twc-atalho" ' + a[2] + '>' + ico(a[0], 26) + '<span>' + esc(a[1]) + '</span>' + badge(c) + cadeado(a[0]) + '</button>';
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
      '<div class="twc-album-corpo"><nav class="twc-filtros" aria-label="' + esc(t('filtro')) + '">' + filtros.map(function(x){
        return '<button type="button" class="twc-filtro" data-filtro="' + x[0] + '" aria-pressed="' + (f === x[0]) + '">' + x[1] + '<span>' + esc(x[2]) + '</span></button>';
      }).join('') + '</nav><section class="twc-card twc-album-grade" aria-live="polite">' + corpo + '</section></div>' +
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
    var ks = jogosNaTela();
    return faixa(esc(t('jogos')), t('jogosSub').replace('{n}', ks.length)) + '<div class="twc-pag twc-jogos"><div class="twc-lista">' + ks.map(function(k){
      var c = card(k);
      return '<button type="button" class="twc-jogo twc-g-' + (COR[k] || 'roxo') + '" data-ir="' + k + '"><span class="twc-jogo-ico">' + ico(k, 24) + '</span>' +
        '<span class="twc-jogo-txt"><b translate="no">' + esc(titulo(c)) + '</b><small>' + esc(descricao(c)) + '</small></span>' +
        (alerta(c) ? '<em class="twc-novo" aria-hidden="true">!</em>' : '') + seloTreino(k) + (precisaEntrar(k) ? '<em class="twc-novo twc-novo-cad" aria-hidden="true">' + ico('cadeado', 14) + '</em><span class="twc-sr"> (' + esc(t2('legCad')) + ')</span>' : '') + ico('seta', 20) + '</button>';
    }).join('') + '</div>' + (logado() ? '' : '<p class="twc-legenda"><span aria-hidden="true">' + ico('cadeado', 13) + '</span> ' + esc(t2('legCad')) + ' · <b>' + esc(t2('treino')) + '</b>: ' + esc(t2('legTreino')) + '</p>') + '</div>';
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
      '<button type="button" class="twc-btn twc-btn-claro" data-v="pais">🌷 ' + esc(t2('pais')) + '</button>' +
      '<button type="button" class="twc-btn twc-btn-claro" data-a="classico">' + esc(t('classico')) + '</button>' +
      '</div>';
  }
  function telaInicial(){   // antes do "Toque para começar" (libera o som do aparelho)
    // abertura animada (ideia do site Loveez, arte nossa): 3 camadas em parallax + o trio flutuando em volta do logo
    var px = '<div class="twc-px" aria-hidden="true"><i class="twc-px1"></i><i class="twc-px2"></i><i class="twc-px3"></i></div>' +
      '<div class="twc-flutua" aria-hidden="true">' + [[0, 'twc-fl0'], [1, 'twc-fl1'], [2, 'twc-fl2']].map(function(f){ return '<canvas class="twc-fl ' + f[1] + '" data-idol="' + f[0] + '" width="208" height="224"></canvas>'; }).join('') + '</div>';
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
      try{ perfDesenharIdol(x, 104, 112, av, false, false, 0); }catch(e){}
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
  // tela de carregamento (só na primeira abertura da página): logo, o trio pulando e uma barrinha
  function carregamento(){
    if(carregamento.feito || !cel) return; carregamento.feito = true;
    var ov = document.createElement('div'); ov.className = 'twc-carrega'; ov.setAttribute('role', 'status'); ov.setAttribute('aria-label', 'Loading');
    ov.innerHTML = '<p class="twc-carrega-logo" translate="no">TsuLiPa<span>⭐</span>World</p><div class="twc-carrega-trio">' +
      MEMBROS.map(function(m, k){ return '<canvas data-membro="' + k + '" width="96" height="96" style="--d:' + (k * .18) + 's"></canvas>'; }).join('') +
      '</div><i class="twc-carrega-barra"><b></b></i>';
    cel.appendChild(ov);
    [].slice.call(ov.querySelectorAll('canvas[data-membro]')).forEach(function(cv){ var av = membroAv(+cv.getAttribute('data-membro')); try{ if(av && typeof perfFotoRedonda === 'function') perfFotoRedonda(cv, av, true); }catch(e){} });
    var t0 = Date.now();
    function pronto(){ return document.readyState === 'complete' && Date.now() - t0 > 900; }
    (function espera(){ if(pronto() || Date.now() - t0 > 4000){ ov.classList.add('twc-carrega-fim'); setTimeout(function(){ ov.remove(); }, 450); } else setTimeout(espera, 120); })();
  }
  function barraBaixo(){
    var v = topo(), noMenu = v === 'menu' && !classico, raiz = pilha.length < 2 && !classico;
    return '<button type="button" class="twc-nav-b" data-n="voltar"' + (raiz ? ' disabled' : '') + '>' + ico('voltar', 26) + '<span>' + esc(t('voltar')) + '</span></button>' +
      '<span class="twc-nav-meio"><button type="button" class="twc-nav-menu' + (noMenu ? ' twc-aberto' : '') + '" data-n="menu" aria-label="' + esc(noMenu ? t('ini') : t('menu')) + '" aria-expanded="' + noMenu + '">' + ico(noMenu ? 'x' : 'menu', 28) +
        (!noMenu && document.querySelector('#hubCards .hubcard.tw-alert-pink') ? '<em class="twc-dot" aria-hidden="true">!</em>' : '') + brilhos([[-6, -6, 13, 'l']]) + '</button></span>' +
      '<button type="button" class="twc-nav-b" data-n="inicio"' + (v === 'inicio' && !classico ? ' aria-current="page"' : '') + '>' + ico('casa', 26) + '<span>' + esc(t('ini')) + '</span></button>';
  }

  /* ---------- Mapa, Missões, Procurar Idol e Novidades dentro do celular ----------
     São as mesmas partes do início clássico (com os mesmos cliques e regras), trazidas para uma tela do celular
     enquanto ela está aberta e devolvidas ao sair. Tudo continua dentro do #hub, então nada deixa de funcionar. */
  var EMB = {mapa:['#twMapa', 'mapa'], missoes:['#hubMisPainel', 'mis'], busca:['.hubbusca', 'busca'], nov:['.hubnov', 'nov']}, embAtual = null;
  function telaEmb(k){
    return faixa(esc(t(EMB[k][1])), k === 'mapa' ? visita() : t('menuSub')) + '<div class="twc-pag twc-emb twc-emb-' + k + '">' +
      (k === 'mapa' ? '<span class="twc-online" data-twc-online hidden></span>' : '') + '<div id="twcEmbSlot"></div>' + (k === 'mapa' ? frasesHtml() : '') + '</div>';
  }
  /* ---------- Humor do Idol + Desejo do dia + passe do Camarim VIP (tw-humor.js; ideia do The Sims, arte nossa) ---------- */
  function humorHtml(){
    var H = window.TW_HUMOR; if(!H) return '';
    var e = H.estado(), d = H.desejo(), vip = H.vipHoje();
    var barras = H.barras.map(function(b){ var v = e[b];
      return '<div class="twc-hb twc-hb-' + b + '"><span>' + esc(H.t(b)) + '</span><i role="progressbar" aria-label="' + esc(H.t(b)) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + v + '"><b style="width:' + v + '%"></b></i></div>'; }).join('');
    return '<section class="twc-humor" aria-labelledby="twcHumorT"><div class="twc-humor-top"><span class="twc-diam" style="--c:' + e.cor + '" aria-hidden="true"></span><h2 id="twcHumorT">' + esc(H.t('humor')) + '</h2>' +
      (e.serie > 0 ? '<em class="twc-serie">🔥 ' + esc(H.t('serie', e.serie)) + '</em>' : '') + '</div>' +
      '<div class="twc-hbs">' + barras + '</div>' +
      (H.cansado() ? '<p class="twc-humor-dica">' + esc(H.t('cansado')) + '</p>' : '') +
      '<div class="twc-desejo' + (d.feito ? ' twc-desejo-ok' : '') + '"><span class="twc-desejo-ico" aria-hidden="true">' + d.icone + '</span><span class="twc-desejo-txt"><small>' + esc(H.t('desejo')) + '</small><b>' + esc(d.feito ? H.t('feito') : d.texto) + '</b></span>' +
        (d.feito ? '' : '<button type="button" class="twc-btn twc-desejo-ir" data-desejo="' + esc(d.ev) + '">' + esc(H.t('ir')) + '</button>') + '</div>' +
      '<button type="button" class="twc-vip' + (vip ? ' twc-vip-on' : '') + '" data-a="vip"><span aria-hidden="true">👑</span><span><b>' + esc(t2('vip')) + '</b><small>' + esc(vip ? t2('vipAberto') : t2('vipFechado')) + '</small></span>' +
        (vip ? ico('seta', 18) : '<em class="twc-cad twc-cad-vip" aria-hidden="true">' + ico('cadeado', 13) + '</em>') + '</button></section>';
  }
  function desejoIr(ev){
    if(ev === 'mapa' || ev === 'frase'){ ir('emb:mapa'); return; }
    if(ev === 'battle' && typeof window.battleAbrir === 'function' && !card('battle')){ window.battleAbrir(); return; }
    if(ev === 'studio' && typeof window.studioAbrir === 'function' && !card('studio')){ window.studioAbrir(); return; }
    abrirCard(ev);
  }
  function toast(txt){
    if(!cel) return; var el = $id('twcToast');
    if(!el){ el = document.createElement('div'); el.id = 'twcToast'; el.className = 'twc-toast'; el.setAttribute('role', 'status'); cel.appendChild(el); }
    el.textContent = txt; el.classList.remove('twc-toast-on'); void el.offsetWidth; el.classList.add('twc-toast-on');
    clearTimeout(toast.t); toast.t = setTimeout(function(){ el.classList.remove('twc-toast-on'); }, 3800);
  }
  if(window.TW_HUMOR) window.TW_HUMOR.ouvir(function(tipo){
    if(tipo === 'desejo'){ var rq = window.TW_HUMOR.ultimoRecado();
      toast('👑 ' + window.TW_HUMOR.t('feito') + ' ' + t2('vipGanhou') + (rq && logado() ? '\n' + window.TW_HUMOR.t('novoRecado', rq) : ''));
      if(typeof petBg !== 'undefined') try{ petBg = null; }catch(e){} try{ if(typeof beep === 'function'){ beep(784, .08, 'triangle', .05); setTimeout(function(){ beep(1175, .12, 'triangle', .05); }, 110); } }catch(e){} }
    if(cel && !classico && topo() === 'inicio') agendaDesenho();
  });
  var desenhoPend = 0;
  function agendaDesenho(){ if(desenhoPend) return; desenhoPend = setTimeout(function(){ desenhoPend = 0; if(cel && !classico && topo() === 'inicio') desenhar(); }, 300); }
  function vipFoto(){   // Polaroid do Camarim VIP em PNG (canvas → toDataURL), sem servidor
    var cv = $id('twcDentroCv'); if(!cv) return;
    var W = cv.width + 40, Hh = cv.height + 110, o = document.createElement('canvas'); o.width = W; o.height = Hh;
    var x = o.getContext('2d'); x.fillStyle = '#fffdf7'; x.fillRect(0, 0, W, Hh); x.drawImage(cv, 20, 20);
    x.fillStyle = '#5b2bb5'; x.font = '26px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText('👑 ' + t2('vip') + ' · TsuLiPa⭐World', W / 2, cv.height + 62);
    x.fillStyle = '#9a86c8'; x.font = '700 16px "M PLUS Rounded 1c",sans-serif'; x.fillText(nick() + ' · ' + new Date().toLocaleDateString(), W / 2, cv.height + 90);
    try{ var a = document.createElement('a'); a.href = o.toDataURL('image/png'); a.download = 'tsulipa-camarim-vip.png'; document.body.appendChild(a); a.click(); a.remove(); }catch(e){}
    // guarda uma cópia pequena (JPEG) para o álbum do app Humor no TsuPhone e para o tapete vermelho do camarim
    try{ var mini = document.createElement('canvas'), k = 360 / W; mini.width = 360; mini.height = Math.round(Hh * k);
      mini.getContext('2d').drawImage(o, 0, 0, mini.width, mini.height);
      if(window.TW_HUMOR) window.TW_HUMOR.guardarFotoVip(mini.toDataURL('image/jpeg', .82)); }catch(e){}
    if(typeof petBg !== 'undefined') try{ petBg = null; }catch(e){}
  }

  /* ---------- frases prontas (sem chat livre) ---------- */
  function frasesHtml(){
    var P = window.TW_PRESENCA; if(!P) return '';
    return '<section class="twc-frases" aria-labelledby="twcFrasesT"><h2 id="twcFrasesT">' + esc(t2('falar')) + '</h2><div class="twc-frases-l">' +
      P.frases.map(function(k){ return '<button type="button" data-frase="' + k + '">' + esc(P.texto(k)) + '</button>'; }).join('') + '</div>' +
      (logado() ? '' : '<p class="twc-frases-dica">' + esc(P.ui('so')) + '</p>') + '</section>';
  }

  /* ---------- entrar nos lugares (ideia do BarbieGirls, arte nossa): o Café, a Zipper⭐Shop! e o Star⭐Gacha! têm um
     "lado de dentro" com quem está online nessa rua (e a vitrine) passeando, com os balões das frases prontas.
     O botão grande abre o lugar de verdade (o mesmo card do hub, com as mesmas regras). ---------- */
  var DENTRO = {cafe:{cor:['#ffe9d6', '#f7c9a4', '#c98a5a'], ico:'cafe', nome:'Café'}, loja:{cor:['#f3e6ff', '#e2ccff', '#9a6fd6'], ico:'loja', nome:'Zipper⭐Shop!'},
    gacha:{cor:['#e5f6ff', '#c3e7ff', '#5a9fd6'], ico:'gacha', nome:'Star⭐Gacha!'},
    vip:{cor:['#3a1a5c', '#7a2d6b', '#ffd23f'], ico:'estrela', nome:'Camarim VIP'}};
  window.twMapaEntrar = function(id){ if(!cel || classico || !DENTRO[id] || !card(id)) return false; ir('dentro:' + id); return true; };
  function telaDentro(id){
    var d = DENTRO[id], c = id === 'vip' ? null : card(id), nome = id === 'vip' ? t2('vip') : c ? titulo(c) : d.nome;
    var botao = id === 'vip' ? '<button type="button" class="twc-btn twc-dentro-ir" data-a="vipFoto">📸 ' + esc(t2('vipFoto')) + '</button>'
      : '<button type="button" class="twc-btn twc-dentro-ir" data-ir="' + esc(id) + '">' + esc(t2('entrarEm', nome)) + '</button>';
    return faixa(esc(nome), id === 'vip' ? t2('vipSub') : t2('dentroSub')) + '<div class="twc-pag twc-dentro twc-dentro-' + id + '"><div class="twc-dentro-cena"><canvas id="twcDentroCv" width="640" height="400" role="img" aria-label="' + esc(nome) + '"></canvas></div>' +
      botao + frasesHtml() + '</div>';
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
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, d = DENTRO[id] || DENTRO.cafe, chao = H - 70;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
    x.fillStyle = d.cor[0]; x.fillRect(0, 0, W, chao - 40);                                   // parede
    x.fillStyle = 'rgba(255,255,255,.55)'; for(var i = 0; i < W; i += 40) x.fillRect(i, 0, 18, chao - 40);   // listras
    x.fillStyle = d.cor[1]; x.fillRect(0, chao - 40, W, H);                                    // piso
    x.fillStyle = 'rgba(255,255,255,.35)'; for(var j = 0; j < W; j += 64) x.fillRect(j, chao - 40, 2, H);
    x.fillStyle = d.cor[2]; x.fillRect(0, chao - 44, W, 6);                                    // rodapé
    // móveis de cada lugar (formas simples, cores chapadas)
    function caixa(a, b, w, h, r, cor){ x.fillStyle = cor; x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.fill(); }
    if(id === 'cafe'){
      caixa(30, chao - 150, 190, 110, 14, '#fff'); caixa(30, chao - 150, 190, 26, 12, '#ff9cc8');                  // balcão
      ['#ffb3d6', '#fff3a8', '#b6ff3b'].forEach(function(c2, k){ caixa(52 + k * 56, chao - 176, 34, 26, 8, c2); x.fillStyle = '#ff6fb5'; x.beginPath(); x.arc(69 + k * 56, chao - 178, 6, 0, 7); x.fill(); });   // cupcakes
      caixa(380, chao - 96, 220, 60, 22, '#8fd3ff'); caixa(390, chao - 120, 200, 34, 16, '#b7e4ff');                // sofá
      caixa(300, chao - 70, 64, 10, 5, '#fff'); x.fillStyle = '#c98a5a'; x.fillRect(328, chao - 60, 8, 34);          // mesinha
      caixa(250, 34, 140, 70, 12, '#fff'); x.fillStyle = '#c98a5a'; x.font = '22px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText('MENU ♡', 320, 78);
    } else if(id === 'loja'){
      x.strokeStyle = '#9a6fd6'; x.lineWidth = 6; x.beginPath(); x.moveTo(36, chao - 190); x.lineTo(236, chao - 190); x.stroke();      // arara
      ['#ff6fb5', '#7b3ff0', '#4169e1', '#b6ff3b', '#ffd23f'].forEach(function(c2, k){ caixa(46 + k * 38, chao - 186, 30, 74, 8, c2); });
      caixa(470, chao - 230, 120, 190, 60, '#fff'); caixa(482, chao - 218, 96, 166, 48, '#d8ecff');                 // espelho
      x.fillStyle = 'rgba(255,255,255,.8)'; x.fillRect(500, chao - 196, 10, 60);
      caixa(270, chao - 64, 150, 30, 14, '#ffc2e2');                                                                 // tapete-passarela
    } else if(id === 'vip'){   // Camarim VIP: tapete vermelho, espelho dourado com lâmpadas, cordão de veludo e holofote
      var hol = x.createRadialGradient(W / 2, 0, 10, W / 2, 120, 330); hol.addColorStop(0, 'rgba(255,240,180,.45)'); hol.addColorStop(1, 'rgba(255,240,180,0)');
      x.fillStyle = hol; x.fillRect(0, 0, W, chao);
      caixa(250, 30, 140, 150, 70, '#ffd23f'); caixa(262, 42, 116, 126, 58, '#e9dcff');
      for(var lb = 0; lb < 10; lb++){ var an = Math.PI + lb / 9 * Math.PI; x.fillStyle = (Math.floor(s * 3) + lb) % 2 ? '#fff6c4' : '#ffe57a'; x.beginPath(); x.arc(320 + Math.cos(an) * 80, 105 + Math.sin(an) * 82, 6, 0, 7); x.fill(); }
      x.fillStyle = '#c2185b'; x.beginPath(); x.moveTo(250, H); x.lineTo(390, H); x.lineTo(360, chao - 40); x.lineTo(280, chao - 40); x.closePath(); x.fill();
      x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(318, chao - 40, 4, H);
      [[70, '#ffd23f'], [570, '#ffd23f']].forEach(function(pp){ x.fillStyle = pp[1]; x.fillRect(pp[0] - 4, chao - 110, 8, 76); x.beginPath(); x.arc(pp[0], chao - 112, 9, 0, 7); x.fill(); });
      x.strokeStyle = '#b0124f'; x.lineWidth = 7; x.beginPath(); x.moveTo(70, chao - 96); x.quadraticCurveTo(150, chao - 60, 230, chao - 96); x.moveTo(410, chao - 96); x.quadraticCurveTo(490, chao - 60, 570, chao - 96); x.stroke();
      x.fillStyle = '#ffd23f'; x.font = '40px sans-serif'; x.textAlign = 'center';
      for(var st2 = 0; st2 < 6; st2++){ x.globalAlpha = .4 + .6 * Math.abs(Math.sin(s * 1.5 + st2)); x.fillText('✦', 40 + st2 * 112, 40 + (st2 % 2) * 30); } x.globalAlpha = 1;
    } else {
      caixa(40, chao - 220, 150, 190, 24, '#ff6fb5'); x.fillStyle = '#e8f6ff'; x.beginPath(); x.arc(115, chao - 160, 52, 0, 7); x.fill();   // máquina
      ['#ffd23f', '#7b3ff0', '#b6ff3b', '#4169e1', '#fff'].forEach(function(c2, k){ x.fillStyle = c2; x.beginPath(); x.arc(90 + (k % 3) * 24, chao - 172 + Math.floor(k / 3) * 26 + Math.sin(s * 2 + k) * 2, 11, 0, 7); x.fill(); });
      caixa(95, chao - 92, 40, 30, 8, '#fff'); caixa(440, 40, 150, 150, 18, '#fff'); x.font = '60px sans-serif'; x.textAlign = 'center'; x.fillText('⭐', 515, 140);
    }
    // gente: quem está online nesta rua (com os balões das frases) + vitrine + você
    var P = window.TW_PRESENCA, gente = id === 'vip' ? [] : dentroGente(), eu = typeof hubAv === 'function' ? hubAv() : null, lugares = [250, 360, 470, 580, 140];
    var todos = gente.map(function(p, k){ return {av:p.avatar, nick:p.nick, fala:p.frase ? {frase:p.frase, em:(+p.frase_em || 0) * 1000} : null, x:lugares[k]}; });
    if(id === 'vip') todos = MEMBROS.map(function(m, k){ var av = membroAv(k); return av ? {av:av.c ? {c:av.c, pose:'', expr:av.expr} : av, nick:m[1], x:[150, 490, 590][k], membro:true} : null; }).filter(Boolean);
    if(eu) todos.push({av:eu, nick:'', fala:P && P.minha, x:id === 'vip' ? 320 : lugares[todos.length] || 140, eu:true});
    todos.forEach(function(g, k){
      var cw = 104, ch = 112, px = g.x - cw / 2, pulo = Math.max(0, Math.sin(s * 2.4 + k * 1.7)) * 4, fr = s * 60 + k * 37;
      var av = {}; for(var q in g.av) av[q] = g.av[q];
      av.pose = ['tchau', 'v', 'coracao', 'mic', 'luz'][Math.floor(s / 3 + k) % 5];
      x.fillStyle = 'rgba(40,10,70,.16)'; x.beginPath(); x.ellipse(g.x, chao + 4, 22, 5, 0, 0, 7); x.fill();
      x.save(); x.translate(px, chao - ch + 8 - pulo);
      try{ if(typeof perfDesenharIdol === 'function') perfDesenharIdol(x, cw, ch, av, false, false, fr); }catch(e){}
      x.restore();
      if(g.nick){ x.font = '800 13px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; var tw = Math.min(120, x.measureText(g.nick).width + 16);
        caixa(g.x - tw / 2, chao + 12, tw, 20, 10, 'rgba(123,63,240,.9)'); x.fillStyle = '#fff'; x.fillText(g.nick, g.x, chao + 27, tw - 8); }
      if(g.eu){ x.fillStyle = '#b6ff3b'; x.font = '18px sans-serif'; x.textAlign = 'center'; x.fillText('★', g.x, chao - ch + 4 - pulo); }
      var fl = g.fala; if(fl && fl.frase && P && Date.now() - fl.em < (g.eu ? 8000 : 12000)){
        var tx = P.texto(fl.frase); x.font = 'bold 16px "M PLUS Rounded 1c",sans-serif'; var lg = Math.min(220, x.measureText(tx).width + 24), by = chao - 118 - pulo;
        caixa(g.x - lg / 2 - 2.5, by - 2.5, lg + 5, 35, 16, '#c9b3ff'); caixa(g.x - lg / 2, by, lg, 30, 14, '#fff'); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(g.x - 6, by + 29); x.lineTo(g.x, by + 38); x.lineTo(g.x + 6, by + 29); x.fill();
        x.fillStyle = '#5b2bb5'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(tx, g.x, by + 15.5, lg - 12); x.textBaseline = 'alphabetic'; }
    });
  }

  /* ---------- Fichinhas do trio (dados do perfil oficial no blog do BRS48, Draft 1st Generation) + mapa de amizades ----------
     Fonte: brs48.blogspot.com/2021/08/{tsu,lirika,pati}.html. Só o que o blog informa (sem ano de nascimento). */
  var FICHAS = [
    {k:0, nome:'Miniwa Tsumiki', jp:'御庭つみき', apelido:'Tsu (つ)', aniv:'05/09', local:'Paraíba, Brasil', altura:'1,80 m', time:'Team S · Sub-Captain', cor:['#9b30d9', 'Violeta'],
      pet:['🐈', 'Chu'], frase:'Oiê! Sou o Tsu, membro da primeira geração draft do BRS48!', blog:'https://brs48.blogspot.com/2021/08/tsu.html',
      gostos:{pt:'Ouvir música, preparar frango de vários jeitos, pudim, BNK48 e AKB48',en:'Listening to music, cooking chicken many ways, pudding, BNK48 and AKB48',es:'Escuchar música, cocinar pollo de mil formas, flan, BNK48 y AKB48',id:'Dengar musik, masak ayam berbagai cara, puding, BNK48 dan AKB48',th:'ฟังเพลง ทำไก่หลายแบบ พุดดิ้ง BNK48 และ AKB48',ja:'音楽をきくこと、いろんなチキン料理、プリン、BNK48とAKB48'}},
    {k:1, nome:'Shiroma Lirika', jp:'城間りりか', apelido:'Lirika (りりか)', aniv:{pt:'maio',en:'May',es:'mayo',id:'Mei',th:'พฤษภาคม',ja:'5月'}, local:'São Paulo, Brasil', altura:'1,40 m', time:'Team S', cor:['#7cc400', 'Verde Limão'],
      pet:['🐨', 'Koali'], frase:'Shiroma Lirika desu, yoroshiku onegaishima~su!', blog:'https://brs48.blogspot.com/2021/08/lirika.html',
      gostos:{pt:'Verde, capoeira, =LOVE (Youkoso! Ikorabu Numa) e IZ*ONE',en:'Green, capoeira, =LOVE (Youkoso! Ikorabu Numa) and IZ*ONE',es:'El verde, la capoeira, =LOVE (Youkoso! Ikorabu Numa) e IZ*ONE',id:'Hijau, capoeira, =LOVE (Youkoso! Ikorabu Numa) dan IZ*ONE',th:'สีเขียว คาโปเอร่า =LOVE (Youkoso! Ikorabu Numa) และ IZ*ONE',ja:'みどり、カポエイラ、=LOVE（ようこそ！イコラブ沼）、IZ*ONE'}},
    {k:2, nome:'Patiliri Kriyl', jp:'パチリリ・クリイル', apelido:'Pati (パチ)', aniv:'23/09', local:'São Paulo, Brasil', altura:'', time:'Team S', cor:['#4169e1', 'Azul Real'],
      pet:['👑', 'Pucchi'], frase:'Conte com o Pati pra deixar seu dia mais feliz!! Beijinhos e Patchau!!', blog:'https://brs48.blogspot.com/2021/08/pati.html',
      gostos:{pt:'Cantar, dançar e desenhar, criar looks, mahou shoujo e animes de idol',en:'Singing, dancing and drawing, putting looks together, magical girls and idol anime',es:'Cantar, bailar y dibujar, crear looks, mahou shoujo y animes de idols',id:'Menyanyi, menari, menggambar, bikin outfit, mahou shoujo dan anime idol',th:'ร้องเพลง เต้น วาดรูป จัดลุค มาโฮโชโจ และอนิเมะไอดอล',ja:'歌・ダンス・お絵かき、コーデづくり、魔法少女とアイドルアニメ'}}];
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
    gosta:{pt:'Gosta de',en:'Likes',es:'Le gusta',id:'Suka',th:'ชอบ',ja:'すきなもの'},
    pet:{pt:'Pet',en:'Pet',es:'Mascota',id:'Hewan',th:'สัตว์เลี้ยง',ja:'ペット'},
    blog:{pt:'Perfil no blog oficial',en:'Profile on the official blog',es:'Perfil en el blog oficial',id:'Profil di blog resmi',th:'โปรไฟล์ในบล็อกทางการ',ja:'公式ブログのプロフィール'},
    mapaAmigos:{pt:'Mapa de amizades',en:'Friendship map',es:'Mapa de amistades',id:'Peta pertemanan',th:'แผนผังมิตรภาพ',ja:'なかよしマップ'},
    unitTrio:{pt:'unit TsuLiPa',en:'TsuLiPa unit',es:'unit TsuLiPa',id:'unit TsuLiPa',th:'ยูนิต TsuLiPa',ja:'ユニットTsuLiPa'},
    dupla:{pt:'dupla NeByura',en:'NeByura duo',es:'dúo NeByura',id:'duo NeByura',th:'ดูโอ NeByura',ja:'デュオNeByura'},
    gekoku:{pt:'Gekokujou',en:'Gekokujou',es:'Gekokujou',id:'Gekokujou',th:'Gekokujou',ja:'下剋上'}
  };
  function tf(k){ var d = TF[k]; return d ? (d[L()] || d.pt) : k; }
  function telaTrio(){
    var cards = FICHAS.map(function(f){
      var m = MEMBROS[f.k], aniv = typeof f.aniv === 'string' ? f.aniv : (f.aniv[L()] || f.aniv.pt);
      var lin = function(r, v){ return v ? '<div><dt>' + esc(tf(r)) + '</dt><dd>' + v + '</dd></div>' : ''; };
      return '<article class="twc-ficha" style="--fc:' + f.cor[0] + '" aria-labelledby="twcF' + f.k + '"><header><canvas data-membro="' + f.k + '" width="120" height="120" aria-hidden="true"></canvas>' +
        '<span><h2 id="twcF' + f.k + '">' + esc(m[1]) + ' <small lang="ja">' + esc(f.jp) + '</small></h2><b>' + esc(f.nome) + '</b></span></header>' +
        '<dl>' + lin('aniv', esc(aniv)) + lin('local', esc(f.local)) + lin('altura', esc(f.altura)) + lin('time', esc(f.time)) + lin('geracao', 'Draft 1st Generation') +
        lin('cor', '<i class="twc-ficha-cor" aria-hidden="true"></i>' + esc(f.cor[1])) + lin('pet', esc(f.pet[0] + ' ' + f.pet[1])) + lin('gosta', esc(f.gostos[L()] || f.gostos.pt)) + '</dl>' +
        '<blockquote lang="pt">“' + esc(f.frase) + '”</blockquote><a class="twc-ficha-blog" href="' + f.blog + '" target="_blank" rel="noopener">' + esc(tf('blog')) + ' ↗</a></article>';
    }).join('');
    // mapa de amizades: o trio em triângulo (unit TsuLiPa e Gekokujou), a dupla NeByura (Tsu + Pati) e cada pet ao lado do seu Idol
    var mapa = '<section class="twc-amigos" aria-labelledby="twcAmigosT"><h2 id="twcAmigosT">' + esc(tf('mapaAmigos')) + '</h2><div class="twc-amigos-c">' +
      '<svg viewBox="0 0 320 260" aria-hidden="true"><g stroke-width="4" stroke-linecap="round" fill="none">' +
        '<line x1="160" y1="58" x2="62" y2="200" stroke="#c9a7ff"/><line x1="160" y1="58" x2="258" y2="200" stroke="#c9a7ff"/><line x1="62" y1="200" x2="258" y2="200" stroke="#c9a7ff"/>' +
        '<path d="M160 58 Q300 90 258 200" stroke="#ff6fb5" stroke-dasharray="2 9"/>' +
        '<line x1="160" y1="58" x2="226" y2="22" stroke="#ffd0e8" stroke-width="3"/><line x1="62" y1="200" x2="18" y2="246" stroke="#ffd0e8" stroke-width="3"/><line x1="258" y1="200" x2="302" y2="246" stroke="#ffd0e8" stroke-width="3"/></g>' +
        '<text x="160" y="150" text-anchor="middle" class="twc-amigos-t">♡ ' + esc(tf('unitTrio')) + '</text><text x="160" y="170" text-anchor="middle" class="twc-amigos-s">' + esc(tf('gekoku')) + '</text>' +
        '<text x="314" y="104" text-anchor="end" class="twc-amigos-s twc-amigos-rosa">' + esc(tf('dupla')) + '</text></svg>' +
      [[0, 50, 22], [1, 19, 77], [2, 81, 77]].map(function(p){ return '<span class="twc-amigo" style="left:' + p[1] + '%;top:' + p[2] + '%"><canvas data-membro="' + p[0] + '" width="96" height="96" aria-hidden="true"></canvas><b>' + esc(MEMBROS[p[0]][1]) + '</b></span>'; }).join('') +
      [[0, 71, 8], [1, 6, 94], [2, 94, 94]].map(function(p){ var f = FICHAS[p[0]]; return '<span class="twc-amigo-pet" style="left:' + p[1] + '%;top:' + p[2] + '%" title="' + esc(f.pet[1]) + '">' + f.pet[0] + '<small>' + esc(f.pet[1]) + '</small></span>'; }).join('') +
      '</div></section>';
    return faixa(esc(tf('trio')), tf('trioSub')) + '<div class="twc-pag twc-trio">' + mapa + '<div class="twc-fichas">' + cards + '</div></div>';
  }

  /* ---------- Cantinho dos pais ---------- */
  function telaPais(){
    return faixa(esc(t2('pais')), t2('paisSub')) + '<div class="twc-pag twc-pais"><section class="twc-card"><ul>' +
      ['pais1', 'pais2', 'pais3', 'pais4', 'pais5'].map(function(k, i){ return '<li><span aria-hidden="true">' + ['🎀', '☁️', '💬', '🛡️', '🌈'][i] + '</span>' + esc(t2(k)) + '</li>'; }).join('') +
      '</ul><a class="twc-btn twc-btn-claro" href="./privacidade.html" target="_blank" rel="noopener">' + esc(t2('paisPriv')) + '</a></section></div>';
  }

  /* ---------- manutenção fofa: quando o servidor (ou a internet) cai, um aviso com o trio em vez de erro seco ---------- */
  var falhas = 0, manutVista = false;
  function manutMostrar(){
    if(!cel || !folha || manutVista || !folha.hidden || tutI >= 0) return;
    manutVista = true;
    var off = typeof navigator !== 'undefined' && navigator.onLine === false;
    folha.innerHTML = '<div class="twc-folha-caixa twc-manut" role="dialog" aria-modal="true" aria-labelledby="twcManutT">' +
      '<div class="twc-manut-palco" aria-hidden="true"><span class="twc-cone">🚧</span>' + MEMBROS.map(function(m, k){ return '<canvas data-membro="' + k + '" width="96" height="96"></canvas>'; }).join('') + '<span class="twc-cone">🚧</span></div>' +
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
  function embutir(k){
    var el = document.querySelector(EMB[k][0]), slot = $id('twcEmbSlot'); if(!el || !slot) return;
    if(embAtual && embAtual.el !== el) devolver();
    if(!embAtual) embAtual = {el:el, pai:el.parentNode, prox:el.nextSibling};
    slot.appendChild(el);
    if(k === 'mapa' && !el.classList.contains('aberto')){ var b = el.querySelector('.tw-mapa-botao'); if(b) b.click(); }
    if(k === 'mapa') setTimeout(function(){ try{ window.dispatchEvent(new Event('resize')); }catch(e){} }, 60);
    if(k === 'missoes' && typeof hubMisCarregar === 'function' && logado() && !(typeof hubMisDados !== 'undefined' && hubMisDados)) hubMisCarregar();
    if(k === 'nov') el.open = true;
    if(k === 'busca'){ var i = $id('hubBusca'); if(i) setTimeout(function(){ try{ i.focus({preventScroll:true}); }catch(e){} }, 80); }
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
    if(typeof hubIdolsUI === 'function' && (box.hidden || !(L0 && L0.trio))) try{ hubIdolsUI(); }catch(e){}
    if(typeof hubIdolsLigar === 'function') try{ hubIdolsLigar(); }catch(e){}
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
    var rolagem = chave === ultimaTela ? tela.scrollTop : 0; ultimaTela = chave;
    tela.setAttribute('data-tela', v);
    if(embAtual && embAtual.el.parentNode && tela.contains(embAtual.el)) embAtual.pai.insertBefore(embAtual.el, embAtual.prox && embAtual.prox.parentNode === embAtual.pai ? embAtual.prox : null);
    vitrineDevolver();
    var part = $id('hubPart');   // as partículas do tema do momento (neve, pétalas, corações...) caem no celular também
    tela.innerHTML = '<div class="hubpart twc-part" aria-hidden="true">' + (part ? part.innerHTML : '') + '</div>' +
      (v === 'abre' ? telaInicial() : barraTopo() + (v === 'menu' ? telaMenu() : v === 'jogos' ? telaJogos() : v === 'ajustes' ? telaAjustes() : v === 'album' ? telaAlbum() : v === 'pais' ? telaPais() : v === 'trio' ? telaTrio() : v.indexOf('dentro:') === 0 ? telaDentro(v.slice(7)) : v.indexOf('emb:') === 0 ? telaEmb(v.slice(4)) : telaInicio()));
    nav.hidden = v === 'abre';
    nav.innerHTML = barraBaixo();
    document.body.classList.toggle('tw-cel-classico', classico);
    avatares(); bolinhas(); idolsDesenhar(); if(v === 'album') cartasDesenhar(); if(v.indexOf('emb:') === 0) embutir(v.slice(4)); else devolver();
    if(v === 'abre'){ vitrineTrazer(); flutuantes(); if(typeof performance !== 'undefined' && performance.now() < 6000) carregamento(); }
    tela.scrollTop = rolagem;   // depois de trazer o mapa/painel de volta (antes, a tela encolhia e voltava ao topo)
    var pc = $id('twcPalcoCv'); if(pc){ pc.addEventListener('click', palcoToque); palcoLigar(); }
    if(v.indexOf('dentro:') === 0) dentroLigar();
    if(window.TW_PRESENCA) try{ window.TW_PRESENCA.contadorUI(); }catch(e){}
    if(v === 'inicio') setTimeout(tutTalvez, 400);
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
    if(a === 'mapa' || a === 'missoes' || a === 'busca' || a === 'nov'){ ir('emb:' + a); return; }
    if(a === 'news'){ if(typeof window.jornalAbrir === 'function'){ try{ if(typeof sfx !== 'undefined' && sfx.card) sfx.card(); }catch(e){} window.jornalAbrir(); } return; }
    if(a === 'tv'){ var tv = $id('twRankTvAbrir'); if(tv) tv.click(); return; }
    if(a === 'vipFoto'){ vipFoto(); return; }
    if(a === 'vip'){
      if(window.TW_HUMOR && window.TW_HUMOR.vipHoje()){ ir('dentro:vip'); return; }
      var dz = window.TW_HUMOR ? window.TW_HUMOR.desejo() : null;
      folha.innerHTML = '<div class="twc-folha-caixa" role="dialog" aria-modal="true" aria-labelledby="twcVipT"><p class="twc-folha-ico" aria-hidden="true">👑</p><h2 id="twcVipT">' + esc(t2('vip')) + '</h2><p>' + esc(t2('vipComo')) + '</p>' +
        (dz ? '<p class="twc-folha-desejo">' + dz.icone + ' <b>' + esc(dz.texto) + '</b></p><button type="button" class="twc-btn" data-f="desejoIr" data-ev="' + esc(dz.ev) + '">' + esc(window.TW_HUMOR.t('ir')) + '</button>' : '') +
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
    if(b.dataset.f){ var f = b.dataset.f;
      if(f === 'tutOk'){ tutI++; som(); if(tutI > 2) tutFim(); else tutMostrar(); return; }
      if(f === 'tutPular'){ tutFim(); return; }
      if(f === 'manutTentar'){ fecharFolha(); falhas = 0; manutVista = false; if(typeof hubIdolsCarregar === 'function') try{ hubIdolsEm = 0; hubIdolsCarregar(); }catch(e){} if(window.TW_PRESENCA) window.TW_PRESENCA.atualizar(); return; }
      if(f === 'manutRun'){ fecharFolha(); abrirCard('run'); return; }
      if(f === 'desejoIr'){ var evd = b.dataset.ev; fecharFolha(); desejoIr(evd); return; }
      fecharFolha(); if(f === 'entrar' && typeof contaEntrar === 'function') contaEntrar(); return; }
    if(b.dataset.n){ var n = b.dataset.n; if(n === 'voltar') voltar(); else if(n === 'inicio') inicio(); else if(topo() === 'menu' && !classico) voltar(); else ir('menu'); return; }
    if(b.dataset.v){ ir(b.dataset.v); return; }
    if(b.dataset.desejo){ som(); desejoIr(b.dataset.desejo); return; }
    if(b.dataset.frase){ if(window.TW_HUMOR && !logado()) window.TW_HUMOR.evento('frase');
      if(window.TW_PRESENCA){ window.TW_PRESENCA.falar(b.dataset.frase); b.classList.add('twc-falou'); setTimeout(function(){ b.classList.remove('twc-falou'); }, 600); } som(); return; }
    if(b.dataset.filtro !== undefined){ album.filtro = b.dataset.filtro; som(); desenhar(); return; }
    if(b.dataset.cardz) return;   // o zoom do card é do próprio jogo (gacha)
    if(b.dataset.l){   // idioma: o mesmo botão do menu do Center Run (salva e traduz o jogo todo; o hub se refaz e o celular junto)
      var lb = document.querySelector('.lang button[data-l="' + b.dataset.l + '"]'); if(lb) lb.click(); som(); return;
    }
    if(b.dataset.o !== undefined){ if(typeof applyOshi === 'function') applyOshi(b.dataset.o); if(typeof hubCfgUI === 'function') hubCfgUI(); som(); desenhar(); return; }
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
    mold.hidden = !on;
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
    if(b.dataset.frase){ if(window.TW_HUMOR && !logado()) window.TW_HUMOR.evento('frase');
      if(window.TW_PRESENCA){ window.TW_PRESENCA.falar(b.dataset.frase); b.classList.add('twc-falou'); setTimeout(function(){ b.classList.remove('twc-falou'); }, 600); } som(); return; }
    if(b.dataset.ir){ abrirCard(b.dataset.ir); }
  }
  function molduraMontar(){
    if(mold) return;
    mold = document.createElement('div'); mold.id = 'twcMoldura'; mold.className = 'twc twc-moldura'; mold.hidden = true;
    document.body.appendChild(mold);
    mold.addEventListener('click', molduraClique);
    var agenda = function(){ if(!moldRaf) moldRaf = requestAnimationFrame(molduraAtualizar); }, ob = new MutationObserver(agenda);
    ob.observe(document.body, {subtree:true, attributes:true, attributeFilter:['hidden']});
    ob.observe(document.body, {attributes:true, attributeFilter:['class'], childList:true});   // body.jogando (Center⭐Run! correndo) e janelas criadas na hora (jogos que carregam depois)
    setInterval(function(){ if(cel) agenda(); }, 1500);   // rede de segurança: alguma janela que abriu sem avisar
    ob.observe(document.documentElement, {attributes:true, attributeFilter:['class']});   // html.tw-kt-arena (show do Karaoke)
  }

  /* ---------- boas-vindas do celular (3 telas, uma vez por aparelho; o tutorial clássico fica para o visual antigo) ---------- */
  var TUT_CHAVE = 'tw_cel_tut_v1', tutI = -1;
  function tutVisto(){ try{ return localStorage.getItem(TUT_CHAVE) === '1'; }catch(e){ return true; } }
  function tutFim(){ tutI = -1; try{ localStorage.setItem(TUT_CHAVE, '1'); }catch(e){} fecharFolha(); }
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
  function tutTalvez(){ if(tutI < 0 && !tutVisto() && typeof hubComecou !== 'undefined' && hubComecou){ tutI = 0; tutMostrar(); } }

  /* ---------- montar ---------- */
  // Ligar e desligar na hora, sem recarregar a página (o hub clássico nunca deixou de estar montado por baixo).
  function desligar(){
    try{ localStorage.removeItem(CHAVE); }catch(e){}
    window.TW_CELULAR_LIGADO = false; limparEndereco(); fecharFolha();
    devolver(); vitrineDevolver();
    if(cel){ cel.remove(); cel = null; }
    if(mold){ mold.hidden = true; }
    document.body.classList.remove('tw-cel', 'tw-cel-classico', 'tw-cel-janela', 'tw-cel-cr', 'tw-cel-kt');
    classico = false; pilha = ['inicio'];
    if(typeof hubCfgUI === 'function') hubCfgUI();
  }
  function ligar(){ window.TW_CELULAR_LIGADO = true; pilha = ['inicio']; classico = false; montar(); }
  function montar(){
    var h = $id('hub'); if(!h || cel) return;
    document.body.classList.add('tw-cel');
    molduraMontar();
    cel = document.createElement('div'); cel.id = 'twCel'; cel.className = 'twc';
    cel.innerHTML = '<div class="twc-tela" id="twcTela"></div><nav class="twc-nav" id="twcNav" aria-label="TsuLiPa⭐World"></nav><div class="twc-folha" id="twcFolha" hidden></div>';
    h.appendChild(cel);
    tela = $id('twcTela'); nav = $id('twcNav'); folha = $id('twcFolha');
    cel.addEventListener('click', clique);
    folha.addEventListener('click', function(e){ if(e.target === folha){ if(tutI >= 0) tutFim(); else fecharFolha(); } });
    if(!montar.tecla) document.addEventListener('keydown', function(e){
      if(e.key !== 'Escape' || !cel || h.hidden) return;
      if(!folha.hidden){ e.preventDefault(); if(tutI >= 0) tutFim(); else fecharFolha(); return; }
      if(document.querySelector('[aria-modal="true"]:not([hidden])')) return;
      if(classico || pilha.length > 1){ e.preventDefault(); voltar(); }
    });
    montar.tecla = true;
    desenhar();
    if(naAbre() && typeof performance !== 'undefined' && performance.now() < 6000) carregamento();   // só logo depois de abrir a página
  }
  // Refaz junto com o hub (idioma, login, estrelas, alertas, missões, "Toque para começar").
  ['hubMontar', 'hubCardsUI', 'hubComecar', 'hubMisUI', 'hubMostrar', 'hubTemaUI', 'hubIdolsUI'].forEach(function(nome){
    var f = window[nome]; if(typeof f !== 'function') return;
    window[nome] = function(){ var r = f.apply(this, arguments); try{ if(cel) desenhar(); }catch(e){} return r; };
  });
  // Estrelas e visita do mapa mudam sozinhas: atualiza só esses textos (sem refazer a tela e perder o foco).
  setInterval(function(){
    var h = $id('hub'); if(!cel || !h || h.hidden) return;
    var s = $id('twcEstrelas'); if(s && s.textContent !== estrelas()) s.textContent = estrelas();
    var v = $id('twcVisita'); if(v){ var tx = visita(); if(v.textContent !== tx){ v.textContent = tx; desenhar(); } }   // trocou quem passeia: refaz o selinho com a bolinha certa
  }, 5000);
  if(document.readyState !== 'loading') montar(); else document.addEventListener('DOMContentLoaded', montar);
  window.TW_CELULAR = {txt:T, jogos:JOGOS, pedeLogin:PEDE_LOGIN, chave:CHAVE, ligar:ligar, desligar:desligar};
})();
