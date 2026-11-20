/* TsuLiPa⭐World · Vida no bairro (17/11/2026) — ideias do The Urbz escolhidas pelo dono, com regra nossa:
   • Bico da rua: os jogos de cada rua contam para um "bico" de 3 níveis (selo, gesto e título). Nunca dá estrela.
   • Bagunça da semana: um bichinho fofo apronta numa rua; o gesto certo (aprendido no bico de outra rua) resolve.
   • Mensagens: o trio comenta no Chat do celular do jogo (pet-sala.js pede TW_BAIRRO.falas).
   • Primeiros dias guiados: em conta nova, as ruas do Mapa acendem uma por dia. Nada é trancado: dá para entrar
     mesmo assim ou pular o guia.
   Tudo fica neste aparelho (brs48cr_bairro_v1, separado por conta). Só conta o que o Humor já conta: jogos
   confirmados pelo servidor (ou o treino de visitante), nunca abrir uma janela. Desenhos: só poses e expressões
   que já existem no desenho base (PERF_POSES grátis + expressões do drawChar). */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  var CHAVE = 'brs48cr_bairro_v1';
  var ORDEM = ['palco', 'harajuku', 'fofo', 'praca', 'arena', 'ceu'];
  // jogos (eventos do TW_HUMOR) que contam para o bico de cada rua — os mesmos lugares do Mapa
  var RUAS = {
    palco:{jogos:['run', 'karaoke', 'handshake'], emoji:'🎤', cor:'#9b30d9', gesto:{pose:'v', expr:2, emoji:'✌️'}},
    harajuku:{jogos:['cafe', 'gacha'], emoji:'🛍️', cor:'#ff4fa3', gesto:{pose:'', expr:3, emoji:'😉'}},
    fofo:{jogos:['bloom'], emoji:'🌷', cor:'#2fb36b', gesto:{pose:'coracao', expr:6, emoji:'🫰'}},
    praca:{jogos:['frase', 'coracao', 'mapa'], emoji:'⛲', cor:'#2f8fe0', gesto:{pose:'tchau', expr:2, emoji:'👋'}},
    arena:{jogos:['battle'], emoji:'🏟️', cor:'#e0742a', gesto:{pose:'v', expr:4, emoji:'🤩'}},
    ceu:{jogos:['sora', 'duo', 'studio'], emoji:'☁️', cor:'#6d6ae8', gesto:{pose:'coracao', expr:0, emoji:'💗'}}
  };
  var NIVEIS = [2, 6, 15];          // pontos para os níveis 1, 2 e 3
  var POR_DIA = 4;                  // no máximo 4 pontos por rua por dia: o bico anda junto com os dias, como no Urbz
  var GUIA = [['palco', 'praca'], ['harajuku'], ['fofo'], ['ceu'], ['arena']];   // dia 1, 2, 3, 4 e 5 do guia
  // os bichinhos já desenhados no Mapa (tw-mapa.js → twMapaBicho); a nuvem é desenhada aqui, com as mesmas formas simples
  var BICHO = {palco:'pombo', harajuku:'coelho', fofo:'borboleta', praca:'passaro', arena:'gato', ceu:'nuvem'};
  var JOGO_NOME = {run:'Center⭐Run!', karaoke:'Karaoke⭐Time!', handshake:'Handshake⭐Event!', cafe:'Happy⭐Cafe!', gacha:'Star⭐Gacha!',
    bloom:'Bloom⭐Garden!', battle:'Idol⭐Battle!', sora:'Sora⭐Jump!', duo:'Moon⭐Duo!', studio:'Photo⭐Studio!'};

  var TX = {
    tit:{pt:'Vida no bairro', en:'Neighborhood life', es:'Vida en el barrio', id:'Kehidupan di lingkungan', th:'ชีวิตในย่าน', ja:'まちのくらし'},
    sub:{pt:'Bicos, gestos e a bagunça da semana', en:'Side jobs, gestures and the week’s mischief', es:'Trabajitos, gestos y el lío de la semana', id:'Kerja sambilan, gestur, dan kekacauan minggu ini', th:'งานพิเศษ ท่าทาง และความวุ่นวายประจำสัปดาห์', ja:'おしごと・ジェスチャー・今週のさわぎ'},
    regra:{pt:'Tudo aqui é enfeite: nada muda suas estrelas nem o ranking. Fica salvo neste aparelho.', en:'Everything here is just for fun: nothing changes your stars or the ranking. Saved on this device.', es:'Todo aquí es adorno: nada cambia tus estrellas ni el ranking. Se guarda en este dispositivo.', id:'Semua di sini hanya hiasan: tidak mengubah bintang atau peringkat. Tersimpan di perangkat ini.', th:'ทุกอย่างที่นี่เป็นของตกแต่ง ไม่เปลี่ยนดาวหรืออันดับ บันทึกไว้ในเครื่องนี้', ja:'ここは飾りだけ。スターやランキングは変わらないよ。この端末に保存されます。'},
    bagTit:{pt:'Bagunça da semana', en:'Mischief of the week', es:'Lío de la semana', id:'Kekacauan minggu ini', th:'ความวุ่นวายประจำสัปดาห์', ja:'今週のさわぎ'},
    precisa:{pt:'Gesto que resolve: {g}', en:'Gesture that solves it: {g}', es:'Gesto que lo resuelve: {g}', id:'Gestur penyelesai: {g}', th:'ท่าที่ช่วยได้: {g}', ja:'解決のジェスチャー：{g}'},
    aprenda:{pt:'Aprenda no bico {rd} (nível 2).', en:'Learn it in the {r} side job (level 2).', es:'Apréndelo en el trabajito {rd} (nivel 2).', id:'Pelajari di kerja sambilan {r} (level 2).', th:'เรียนได้จากงานพิเศษที่ {r} (ระดับ 2)', ja:'{r}のおしごと（レベル2）で覚えよう。'},
    fazer:{pt:'Fazer o gesto', en:'Do the gesture', es:'Hacer el gesto', id:'Lakukan gestur', th:'ทำท่า', ja:'ジェスチャーする'},
    resolvida:{pt:'Bagunça resolvida!', en:'Mischief solved!', es:'¡Lío resuelto!', id:'Kekacauan beres!', th:'แก้ความวุ่นวายแล้ว!', ja:'さわぎ解決！'},
    vizinhos:{pt:'A semana acabou e os vizinhos resolveram juntos. Semana que vem tem outra!', en:'The week ended and the neighbors solved it together. Another one next week!', es:'La semana terminó y los vecinos lo resolvieron juntos. ¡La próxima semana hay otro!', id:'Minggu berakhir dan para tetangga menyelesaikannya bersama. Minggu depan ada lagi!', th:'สัปดาห์จบแล้ว เพื่อนบ้านช่วยกันแก้ไข สัปดาห์หน้ามีอีก!', ja:'今週はおしまい。ご近所さんがみんなで解決したよ。来週もお楽しみに！'},
    ruas:{pt:'Bicos das ruas', en:'Street side jobs', es:'Trabajitos de las calles', id:'Kerja sambilan tiap jalan', th:'งานพิเศษของแต่ละถนน', ja:'通りのおしごと'},
    nivel:{pt:'Nível {n}', en:'Level {n}', es:'Nivel {n}', id:'Level {n}', th:'ระดับ {n}', ja:'レベル{n}'},
    novato:{pt:'Ainda sem nível', en:'No level yet', es:'Aún sin nivel', id:'Belum ada level', th:'ยังไม่มีระดับ', ja:'まだレベルなし'},
    falta:{pt:'{f} para o nível {n}', en:'{f} to level {n}', es:'{f} para el nivel {n}', id:'{f} lagi ke level {n}', th:'อีก {f} ถึงระดับ {n}', ja:'レベル{n}まであと{f}'},
    max:{pt:'Bico completo!', en:'Side job complete!', es:'¡Trabajito completo!', id:'Kerja sambilan selesai!', th:'งานพิเศษครบแล้ว!', ja:'おしごとコンプリート！'},
    hojeCheio:{pt:'Por hoje chega nesta rua: volta amanhã.', en:'That’s all for this street today: come back tomorrow.', es:'Por hoy basta en esta calle: vuelve mañana.', id:'Cukup untuk hari ini di jalan ini: kembali besok.', th:'วันนี้ถนนนี้พอแล้ว พรุ่งนี้มาใหม่นะ', ja:'この通りは今日はここまで。また明日ね。'},
    conta:{pt:'Conta: {j}', en:'Counts: {j}', es:'Cuenta: {j}', id:'Dihitung: {j}', th:'นับจาก: {j}', ja:'カウント：{j}'},
    praca:{pt:'frases, corações e passeios', en:'phrases, hearts and strolls', es:'frases, corazones y paseos', id:'frasa, hati, dan jalan-jalan', th:'ประโยค หัวใจ และการเดินเล่น', ja:'フレーズ・ハート・おさんぽ'},
    p1:{pt:'Selo da rua', en:'Street badge', es:'Sello de la calle', id:'Lencana jalan', th:'ตราถนน', ja:'通りのバッジ'},
    p2:{pt:'Gesto: {g}', en:'Gesture: {g}', es:'Gesto: {g}', id:'Gestur: {g}', th:'ท่า: {g}', ja:'ジェスチャー：{g}'},
    p3:{pt:'Título: Estrela {rd}', en:'Title: Star of {r}', es:'Título: Estrella {rd}', id:'Gelar: Bintang {r}', th:'ฉายา: ดาวแห่ง {r}', ja:'称号：{r}のスター'},
    jogar:{pt:'Jogar', en:'Play', es:'Jugar', id:'Main', th:'เล่น', ja:'あそぶ'},
    passear:{pt:'Passear', en:'Stroll', es:'Pasear', id:'Jalan-jalan', th:'เดินเล่น', ja:'おさんぽ'},
    gestos:{pt:'Seus gestos', en:'Your gestures', es:'Tus gestos', id:'Gesturmu', th:'ท่าของคุณ', ja:'あなたのジェスチャー'},
    semGesto:{pt:'Chegue ao nível 2 de um bico para aprender o primeiro gesto.', en:'Reach level 2 in a side job to learn your first gesture.', es:'Llega al nivel 2 de un trabajito para aprender tu primer gesto.', id:'Capai level 2 di kerja sambilan untuk belajar gestur pertama.', th:'ถึงระดับ 2 ในงานพิเศษเพื่อเรียนท่าแรก', ja:'おしごとでレベル2になると最初のジェスチャーを覚えるよ。'},
    guiaTit:{pt:'Primeiros dias · dia {d} de 5', en:'First days · day {d} of 5', es:'Primeros días · día {d} de 5', id:'Hari-hari pertama · hari {d} dari 5', th:'วันแรก ๆ · วันที่ {d} จาก 5', ja:'はじめての日々・{d}/5日目'},
    guiaTxt:{pt:'Cada dia uma rua nova acende no Mapa. Amanhã: {r}.', en:'Each day a new street lights up on the Map. Tomorrow: {r}.', es:'Cada día se enciende una calle nueva en el Mapa. Mañana: {r}.', id:'Setiap hari satu jalan baru menyala di Peta. Besok: {r}.', th:'ทุกวันจะมีถนนใหม่สว่างบนแผนที่ พรุ่งนี้: {r}', ja:'毎日マップに新しい通りが灯るよ。あしたは{r}。'},
    pular:{pt:'Ver tudo agora', en:'See everything now', es:'Ver todo ahora', id:'Lihat semua sekarang', th:'ดูทั้งหมดเลย', ja:'今すぐぜんぶ見る'},
    guiaRua:{pt:'{r} acende no seu guia em breve. Quer entrar mesmo assim?', en:'{r} lights up in your guide soon. Go in anyway?', es:'{r} se enciende pronto en tu guía. ¿Entrar de todos modos?', id:'{r} segera menyala di panduanmu. Tetap masuk?', th:'{r} จะสว่างในคู่มือเร็ว ๆ นี้ เข้าไปเลยไหม?', ja:'{r}はもうすぐガイドで灯るよ。それでも入る？'},
    entrar:{pt:'Entrar', en:'Go in', es:'Entrar', id:'Masuk', th:'เข้าไป', ja:'入る'},
    depois:{pt:'Depois', en:'Later', es:'Después', id:'Nanti', th:'ทีหลัง', ja:'あとで'},
    emBreve:{pt:'em breve', en:'soon', es:'pronto', id:'segera', th:'เร็ว ๆ นี้', ja:'もうすぐ'},
    ver:{pt:'Ver', en:'View', es:'Ver', id:'Lihat', th:'ดู', ja:'見る'},
    faltaAprender:{pt:'Falta aprender o gesto', en:'Gesture not learned yet', es:'Falta aprender el gesto', id:'Gestur belum dipelajari', th:'ยังไม่ได้เรียนท่าทางนี้', ja:'ジェスチャーをまだ覚えていないよ'},
    hjBico:{pt:'Bico: {b} · {s}', en:'Side job: {b} · {s}', es:'Trabajito: {b} · {s}', id:'Kerja sambilan: {b} · {s}', th:'งานพิเศษ: {b} · {s}', ja:'おしごと：{b}・{s}'},
    subiu:{pt:'Nível {n} no bico {b}!', en:'Level {n} in {b}!', es:'¡Nivel {n} en {b}!', id:'Level {n} di {b}!', th:'ระดับ {n} ใน {b}!', ja:'{b}でレベル{n}！'},
    fechar:{pt:'Fechar', en:'Close', es:'Cerrar', id:'Tutup', th:'ปิด', ja:'閉じる'}
  };
  var RUA_NOME = {
    palco:{pt:'Star Stage'}, arena:{pt:'Star Arena'},
    harajuku:{pt:'Galeria do Brilho', en:'Sparkle Gallery', es:'Galería del Brillo', id:'Galeri Kilau', th:'แกลเลอรีประกายแสง', ja:'キラキラギャラリー'},
    fofo:{pt:'Vila das Tulipas', en:'Tulip Village', es:'Villa de los Tulipanes', id:'Desa Tulip', th:'หมู่บ้านทิวลิป', ja:'チューリップ村'},
    praca:{pt:'Praça Central', en:'Central Square', es:'Plaza Central', id:'Alun-alun Pusat', th:'จัตุรัสกลาง', ja:'セントラル広場'},
    ceu:{pt:'Jardim das Nuvens', en:'Cloud Garden', es:'Jardín de las Nubes', id:'Taman Awan', th:'สวนเมฆ', ja:'雲の庭'}
  };
  // "do/da" e "no/na" (pt) e "del/de la" e "en el/en la" (es); nos outros idiomas fica só o nome
  var RUA_DE = {pt:{palco:'do Star Stage', harajuku:'da Galeria do Brilho', fofo:'da Vila das Tulipas', praca:'da Praça Central', arena:'da Star Arena', ceu:'do Jardim das Nuvens'},
    es:{palco:'del Star Stage', harajuku:'de la Galería del Brillo', fofo:'de la Villa de los Tulipanes', praca:'de la Plaza Central', arena:'de la Star Arena', ceu:'del Jardín de las Nubes'}};
  var RUA_EM = {pt:{palco:'no Star Stage', harajuku:'na Galeria do Brilho', fofo:'na Vila das Tulipas', praca:'na Praça Central', arena:'na Star Arena', ceu:'no Jardim das Nuvens'},
    es:{palco:'en el Star Stage', harajuku:'en la Galería del Brillo', fofo:'en la Villa de los Tulipanes', praca:'en la Plaza Central', arena:'en la Star Arena', ceu:'en el Jardín de las Nubes'}};
  var BICO_NOME = {
    palco:{pt:'Bastidores do palco', en:'Backstage crew', es:'Detrás del escenario', id:'Kru belakang panggung', th:'ทีมหลังเวที', ja:'ステージ裏'},
    harajuku:{pt:'Vitrine da Galeria', en:'Gallery window', es:'Vitrina de la Galería', id:'Etalase Galeri', th:'ตู้โชว์แกลเลอรี', ja:'ギャラリーのショーウィンドウ'},
    fofo:{pt:'Canteiros da Vila', en:'Village flowerbeds', es:'Jardineras de la Villa', id:'Petak bunga Desa', th:'แปลงดอกไม้ในหมู่บ้าน', ja:'村の花だん'},
    praca:{pt:'Guia da Praça', en:'Square guide', es:'Guía de la Plaza', id:'Pemandu Alun-alun', th:'ไกด์จัตุรัส', ja:'広場の案内係'},
    arena:{pt:'Torcida da Arena', en:'Arena cheer squad', es:'Porra de la Arena', id:'Pendukung Arena', th:'กองเชียร์อารีนา', ja:'アリーナの応援団'},
    ceu:{pt:'Fotos nas Nuvens', en:'Cloud photos', es:'Fotos en las Nubes', id:'Foto di Awan', th:'ภาพถ่ายบนเมฆ', ja:'雲の上の写真'}
  };
  var GESTO_NOME = {
    palco:{pt:'Pose V', en:'V pose', es:'Pose V', id:'Pose V', th:'ท่า V', ja:'Vポーズ'},
    harajuku:{pt:'Piscadinha', en:'Wink', es:'Guiño', id:'Kedipan', th:'ขยิบตา', ja:'ウインク'},
    fofo:{pt:'Coração apaixonado', en:'Lovestruck heart', es:'Corazón enamorado', id:'Hati jatuh cinta', th:'หัวใจตกหลุมรัก', ja:'ラブラブハート'},
    praca:{pt:'Tchauzinho', en:'Little wave', es:'Saludito', id:'Lambaian kecil', th:'โบกมือ', ja:'バイバイ'},
    arena:{pt:'V de surpresa', en:'Surprised V', es:'V de sorpresa', id:'V kaget', th:'V ตกใจ', ja:'びっくりV'},
    ceu:{pt:'Coração tímido', en:'Shy heart', es:'Corazón tímido', id:'Hati malu', th:'หัวใจขี้อาย', ja:'てれハート'}
  };
  // bagunça na rua i; quem resolve é o gesto da rua ORDEM[(i + 2) % 6]
  var BAG = {
    palco:{quem:{pt:'Pombinho Maestro', en:'Maestro Pigeon', es:'Palomito Maestro', id:'Merpati Maestro', th:'นกพิราบวาทยกร', ja:'マエストロ鳩'},
      fez:{pt:'bagunçou as partituras do Star Stage', en:'scrambled the sheet music at Star Stage', es:'desordenó las partituras del Star Stage', id:'mengacak partitur di Star Stage', th:'ทำโน้ตเพลงที่ Star Stage ปนกัน', ja:'Star Stageの楽譜をぐちゃぐちゃに'},
      fim:{pt:'Com um coração, o Pombinho se acalmou e ajudou a guardar as partituras por cor.', en:'With a heart, the Pigeon calmed down and helped sort the sheet music by color.', es:'Con un corazón, el Palomito se calmó y ayudó a ordenar las partituras por color.', id:'Dengan hati, si Merpati tenang dan membantu menyusun partitur per warna.', th:'พอได้หัวใจ นกพิราบก็สงบและช่วยจัดโน้ตตามสี', ja:'ハートでハトは落ち着いて、楽譜を色ごとに片づけてくれたよ。'}},
    harajuku:{quem:{pt:'Coelhinha Gulosa', en:'Greedy Bunny', es:'Conejita Golosa', id:'Kelinci Rakus', th:'กระต่ายตะกละ', ja:'くいしんぼうウサギ'},
      fez:{pt:'comeu os docinhos da vitrine', en:'ate the sweets in the shop window', es:'se comió los dulces de la vitrina', id:'memakan manisan di etalase', th:'กินขนมในตู้โชว์', ja:'ショーウィンドウのおかしを食べちゃった'},
      fim:{pt:'Um tchauzinho chamou a Coelhinha para o Café: agora ela prova os doces novos antes de todo mundo.', en:'A little wave invited the Bunny to the Café: now she tastes the new sweets first.', es:'Un saludito invitó a la Conejita al Café: ahora prueba los dulces nuevos primero.', id:'Lambaian kecil mengajak si Kelinci ke Kafe: kini dia mencicipi manisan baru duluan.', th:'โบกมือชวนกระต่ายไปคาเฟ่ ตอนนี้เธอได้ชิมขนมใหม่ก่อนใคร', ja:'バイバイでウサギをカフェに招待。今は新作スイーツの試食係だよ。'}},
    fofo:{quem:{pt:'Borboleta Sapeca', en:'Cheeky Butterfly', es:'Mariposa Traviesa', id:'Kupu-kupu Jahil', th:'ผีเสื้อซุกซน', ja:'いたずらチョウチョ'},
      fez:{pt:'escondeu os regadores da Vila', en:'hid the Village watering cans', es:'escondió las regaderas de la Villa', id:'menyembunyikan penyiram di Desa', th:'ซ่อนบัวรดน้ำของหมู่บ้าน', ja:'村のじょうろをかくしちゃった'},
      fim:{pt:'O V de surpresa fez a Borboleta rir e mostrar o esconderijo: dentro da tulipa gigante!', en:'The surprised V made the Butterfly laugh and show the hiding spot: inside the giant tulip!', es:'¡La V de sorpresa hizo reír a la Mariposa y mostró el escondite: dentro del tulipán gigante!', id:'V kaget membuat si Kupu-kupu tertawa dan menunjukkan tempat persembunyian: di dalam tulip raksasa!', th:'ท่า V ตกใจทำให้ผีเสื้อหัวเราะและบอกที่ซ่อน: ในดอกทิวลิปยักษ์!', ja:'びっくりVでチョウチョが笑って、かくし場所を教えてくれたよ。巨大チューリップの中！'}},
    praca:{quem:{pt:'Passarinho Distraído', en:'Dreamy Bird', es:'Pajarito Distraído', id:'Burung Kecil Melamun', th:'นกน้อยใจลอย', ja:'うっかり小鳥'},
      fez:{pt:'espalhou as pétalas da fonte', en:'scattered the fountain petals', es:'esparció los pétalos de la fuente', id:'menyebarkan kelopak bunga di air mancur', th:'ทำกลีบดอกไม้ในน้ำพุกระจาย', ja:'噴水の花びらをちらかしちゃった'},
      fim:{pt:'O Passarinho ficou tímido junto e ajudou a juntar as pétalas, uma por uma.', en:'The Bird got shy too and helped gather the petals, one by one.', es:'El Pajarito se puso tímido también y ayudó a juntar los pétalos, uno por uno.', id:'Si Burung ikut malu dan membantu mengumpulkan kelopak satu per satu.', th:'นกน้อยเขินตามและช่วยเก็บกลีบดอกไม้ทีละกลีบ', ja:'小鳥もてれて、花びらを一枚ずつ集めてくれたよ。'}},
    arena:{quem:{pt:'Gatinho Paparazzi', en:'Paparazzi Kitty', es:'Gatito Paparazzi', id:'Kucing Paparazi', th:'แมวปาปารัซซี่', ja:'パパラッチねこ'},
      fez:{pt:'pegou os lightsticks da Arena', en:'took the Arena’s lightsticks', es:'se llevó los lightsticks de la Arena', id:'mengambil lightstick Arena', th:'เอาแท่งไฟของอารีนาไป', ja:'アリーナのペンライトを持っていっちゃった'},
      fim:{pt:'O Gatinho só queria uma foto! Depois da Pose V, devolveu tudo e virou fotógrafo da torcida.', en:'The Kitty only wanted a photo! After the V pose, it gave everything back and became the cheer photographer.', es:'¡El Gatito solo quería una foto! Tras la Pose V, devolvió todo y se volvió fotógrafo de la porra.', id:'Si Kucing cuma mau foto! Setelah pose V, semua dikembalikan dan dia jadi fotografer pendukung.', th:'แมวแค่อยากได้รูป! หลังท่า V ก็คืนทุกอย่างและกลายเป็นช่างภาพกองเชียร์', ja:'ねこは写真がほしかっただけ！Vポーズのあと全部返して、応援団のカメラマンになったよ。'}},
    ceu:{quem:{pt:'Nuvem Resmungona', en:'Grumpy Cloud', es:'Nube Gruñona', id:'Awan Cemberut', th:'เมฆขี้บ่น', ja:'ぶつぶつ雲'},
      fez:{pt:'tampou o arco-íris do Jardim', en:'covered the Garden’s rainbow', es:'tapó el arcoíris del Jardín', id:'menutupi pelangi di Taman', th:'บังรุ้งในสวน', ja:'庭のにじをかくしちゃった'},
      fim:{pt:'Uma piscadinha fez a Nuvem sorrir, e o arco-íris voltou mais brilhante.', en:'A wink made the Cloud smile, and the rainbow came back brighter.', es:'Un guiño hizo sonreír a la Nube, y el arcoíris volvió más brillante.', id:'Kedipan membuat si Awan tersenyum, dan pelangi kembali lebih terang.', th:'ขยิบตาทำให้เมฆยิ้ม และรุ้งก็กลับมาสดใสกว่าเดิม', ja:'ウインクで雲がにっこり。にじがもっと明るくもどったよ。'}}
  };
  // falas do trio no Chat (o Tsu e o Pati no masculino; a Lirika no feminino, como no resto do site)
  // Sem os bicos (BICOS = false), o gesto de uma rua se aprende jogando os jogos dela 2 vezes (os 2 pontos do antigo nível 1)
  var SEM_BICO = {
    sub:{pt:'Gestos e a bagunça da semana', en:'Gestures and the week’s mischief', es:'Gestos y el lío de la semana', id:'Gestur dan kekacauan minggu ini', th:'ท่าทางและความวุ่นวายประจำสัปดาห์', ja:'ジェスチャーと今週のさわぎ'},
    aprenda:{pt:'Aprenda jogando {j} ({r}).', en:'Learn it by playing {j} ({r}).', es:'Apréndelo jugando {j} ({r}).', id:'Pelajari dengan bermain {j} ({r}).', th:'เรียนได้โดยเล่น {j} ({r})', ja:'{j}をあそぶと覚えるよ（{r}）。'},
    ruas:{pt:'Ruas e gestos', en:'Streets and gestures', es:'Calles y gestos', id:'Jalan dan gestur', th:'ถนนและท่าทาง', ja:'通りとジェスチャー'},
    semGesto:{pt:'Jogue 2 vezes os jogos de uma rua para aprender o gesto dela.', en:'Play a street’s games twice to learn its gesture.', es:'Juega 2 veces los juegos de una calle para aprender su gesto.', id:'Mainkan game satu jalan 2 kali untuk mempelajari gesturnya.', th:'เล่นเกมของถนนนั้น 2 ครั้งเพื่อเรียนท่าทาง', ja:'通りのゲームを2回あそぶと、その通りのジェスチャーを覚えるよ。'},
    jogue:{pt:'Jogue {j}', en:'Play {j}', es:'Juega {j}', id:'Main {j}', th:'เล่น {j}', ja:'{j}をあそぼう'},
    dica:{pt:'Cada rua ensina um gesto. {Re}, vale jogar {j}.', en:'Every street teaches a gesture. At {r}, play {j}.', es:'Cada calle enseña un gesto. {Re} vale jugar {j}.', id:'Setiap jalan mengajarkan satu gestur. Di {r}, mainkan {j}.', th:'ทุกถนนสอนท่าทางหนึ่งท่า ที่ {r} ลองเล่น {j}', ja:'通りごとにジェスチャーを教えてくれるよ。{r}では{j}をあそんでね。'}
  };
  var FALA = {
    bag:{pt:'{q} {f}! Acho que um gesto resolve: {g}.', en:'{q} {f}! I think a gesture will fix it: {g}.', es:'¡{q} {f}! Creo que un gesto lo resuelve: {g}.', id:'{q} {f}! Kurasa satu gestur bisa membereskannya: {g}.', th:'{q} {f}! น่าจะแก้ได้ด้วยท่านี้: {g}', ja:'{q}が{f}！ジェスチャーで解決できそう：{g}。'},
    bagOk:{pt:'Você resolveu a bagunça! {fim}', en:'You solved the mischief! {fim}', es:'¡Resolviste el lío! {fim}', id:'Kamu membereskan kekacauan! {fim}', th:'คุณแก้ความวุ่นวายได้แล้ว! {fim}', ja:'さわぎを解決したね！{fim}'},
    subiu:{pt:'Vi que você chegou ao nível {n} no bico {b}! Você ganhou: {p}.', en:'I saw you reached level {n} in {b}! You got: {p}.', es:'¡Vi que llegaste al nivel {n} en {b}! Ganaste: {p}.', id:'Aku lihat kamu sampai level {n} di {b}! Kamu dapat: {p}.', th:'เห็นว่าถึงระดับ {n} ใน {b} แล้ว! ได้รับ: {p}', ja:'{b}でレベル{n}になったね！ゲット：{p}'},
    dica:{pt:'Cada rua tem um bico. {Re}, conta {j}.', en:'Every street has a side job. At {r}, {j} count.', es:'Cada calle tiene un trabajito. {Re} cuenta {j}.', id:'Setiap jalan punya kerja sambilan. Di {r}, yang dihitung: {j}.', th:'ทุกถนนมีงานพิเศษ ที่ {r} นับจาก {j}', ja:'通りごとにおしごとがあるよ。{r}では{j}がカウントされるよ。'},
    guia:{pt:'Dia {d} do seu guia: hoje acendeu {r} no Mapa! Amanhã tem mais.', en:'Day {d} of your guide: {r} lit up on the Map today! More tomorrow.', es:'Día {d} de tu guía: ¡hoy se encendió {r} en el Mapa! Mañana hay más.', id:'Hari {d} panduanmu: hari ini {r} menyala di Peta! Besok ada lagi.', th:'วันที่ {d} ของคู่มือ: วันนี้ {r} สว่างบนแผนที่แล้ว! พรุ่งนี้มีอีก', ja:'ガイド{d}日目：きょうはマップに{r}が灯ったよ！またあした。'},
    estrela:{pt:'Já viu os selos das ruas? Quero ver você virar Estrela {rd}!', en:'Seen the street badges? I want to see you become the Star of {r}!', es:'¿Viste los sellos de las calles? ¡Quiero verte como Estrella {rd}!', id:'Sudah lihat lencana jalan? Aku mau lihat kamu jadi Bintang {r}!', th:'เห็นตราของถนนหรือยัง? อยากเห็นคุณเป็นดาวแห่ง {r}!', ja:'通りのバッジ見た？{r}のスターになるところ見たいな！'}
  };

  function L(){ return (typeof LANG === 'string' && /^(pt|en|es|id|th|ja)$/.test(LANG)) ? LANG : 'pt'; }
  function tx(o){ return o ? (o[L()] || o.pt) : ''; }
  function t(k, v){ var s = tx(!BICOS && SEM_BICO[k] ? SEM_BICO[k] : TX[k]) || k; if(v) for(var n in v) s = s.split('{' + n + '}').join(v[n]); return s; }
  function f(o, v){ var s = tx(o); if(v) for(var n in v) s = s.split('{' + n + '}').join(v[n]); return s; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]; }); }
  function hoje(){ return new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }   // horário de Brasília
  function diasEntre(a, b){ return Math.round((Date.parse(b + 'T12:00:00Z') - Date.parse(a + 'T12:00:00Z')) / 864e5); }
  function domingo(d){ var dt = new Date(d + 'T12:00:00Z'); dt.setUTCDate(dt.getUTCDate() - dt.getUTCDay()); return dt.toISOString().slice(0, 10); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function quem(){ try{ return logado() ? 'c:' + String(contaJ.nick || contaJ.id || '').toLowerCase() : 'visitante'; }catch(e){ return 'visitante'; } }
  function ruaNome(r){ return tx(RUA_NOME[r]); }
  function vr(r, extra){   // {r} nome, {rd} "do/da …", {re}/{Re} "no/na …"
    var de = (RUA_DE[L()] || {})[r] || ruaNome(r), em = (RUA_EM[L()] || {})[r] || ruaNome(r), o = {r:ruaNome(r), rd:de, re:em, Re:em.charAt(0).toUpperCase() + em.slice(1)};
    if(extra) for(var k in extra) o[k] = extra[k]; return o;
  }
  // Bicos do dia: a contagem continua por baixo, mas nada aparece até a usuária liberar (17/11: "deixar os bicos para depois")
  var BICOS = false;
  function bicoNome(r){ return tx(BICO_NOME[r]); }
  function gestoNome(r){ return tx(GESTO_NOME[r]); }

  /* ---------- estado (um por conta, neste aparelho) ---------- */
  var todos = null, est = null, dono = '';
  function lerTodos(){ if(todos) return todos; try{ todos = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; }catch(e){ todos = {}; } if(typeof todos !== 'object' || Array.isArray(todos)) todos = {}; return todos; }
  function salvar(){ try{ localStorage.setItem(CHAVE, JSON.stringify(todos)); }catch(e){} }
  function veterano(){
    try{ if(typeof best !== 'undefined' && +best > 0) return true; }catch(e){}
    if(window.TW_HUMOR && typeof window.TW_HUMOR.estado === 'function' && window.TW_HUMOR.estado().serie > 0) return true;
    return false;
  }
  function ler(){
    var q = quem(); lerTodos();
    if(est && dono === q) return est;
    dono = q; est = todos[q];
    if(!est || typeof est !== 'object'){
      est = todos[q] = {v:1, pts:{}, dia:{}, visto:{}, bag:{}, lidas:{}, guia:{ini:hoje(), novo:!veterano(), pulou:false}};
      salvar();
    }
    ['pts', 'dia', 'visto', 'bag', 'lidas'].forEach(function(k){ if(!est[k] || typeof est[k] !== 'object') est[k] = {}; });
    if(!est.guia || typeof est.guia !== 'object') est.guia = {ini:hoje(), novo:false, pulou:false};
    // quem já joga nunca fica no guia (o recorde chega do servidor depois da abertura)
    if(est.guia.novo && !est.guia.pulou && veterano()){ est.guia.novo = false; salvar(); }
    return est;
  }

  /* ---------- bico ---------- */
  function nivelDe(p){ var n = 0; for(var i = 0; i < NIVEIS.length; i++) if(p >= NIVEIS[i]) n = i + 1; return n; }
  function ruaDoJogo(ev){ for(var i = 0; i < ORDEM.length; i++) if(RUAS[ORDEM[i]].jogos.indexOf(ev) >= 0) return ORDEM[i]; return ''; }
  function bico(r){
    ler(); var p = +est.pts[r] || 0, n = nivelDe(p), d = est.dia[r] || {};
    return {rua:r, pts:p, nivel:n, prox:n < 3 ? NIVEIS[n] : 0, falta:n < 3 ? NIVEIS[n] - p : 0, hoje:d.d === hoje() ? +d.n || 0 : 0};
  }
  var ouvintes = [];
  function avisar(o){ ouvintes.forEach(function(fn){ try{ fn(o); }catch(e){} }); }
  function contar(ev){
    var r = ruaDoJogo(ev); if(!r) return null;
    ler(); var d = est.dia[r] || {}, h = hoje();
    if(d.d !== h) d = {d:h, n:0};
    if(d.n >= POR_DIA) return null;
    var antes = nivelDe(+est.pts[r] || 0);
    d.n++; est.dia[r] = d; est.pts[r] = (+est.pts[r] || 0) + 1;
    var depois = nivelDe(est.pts[r]), subiu = depois > antes;
    if(subiu) est.ultimo = {rua:r, n:depois, dia:h};
    salvar(); avisar({tipo:subiu ? 'nivel' : 'ponto', rua:r, nivel:depois});
    if(subiu && BICOS) toast('✨ ' + t('subiu', {n:depois, b:bicoNome(r)}) + ' · ' + premioTxt(r, depois));
    return {rua:r, nivel:depois, subiu:subiu};
  }
  function premioTxt(r, n){ return n === 1 ? t('p1') : n === 2 ? t('p2', {g:gestoNome(r)}) : t('p3', vr(r)); }
  function sabeGesto(r){ return BICOS ? bico(r).nivel >= 2 : bico(r).nivel >= 1; }   // sem bicos: 2 partidas na rua (nível 1 por baixo)
  function gestosAprendidos(){ return ORDEM.filter(sabeGesto); }

  /* ---------- bagunça da semana ---------- */
  function bagunca(){
    ler(); var sem = domingo(hoje()), i = ((Math.floor(diasEntre('2026-10-25', sem) / 7) % 6) + 6) % 6;
    var r = ORDEM[i], g = ORDEM[(i + 2) % 6], b = BAG[r], st = est.bag[sem] || {};
    return {semana:sem, rua:r, gesto:g, bicho:BICHO[r], quem:tx(b.quem), fez:tx(b.fez), fim:tx(b.fim), ok:!!st.ok,
      sabe:sabeGesto(g), domingo:hoje() === sem};
  }
  function resolver(){
    var b = bagunca(); if(b.ok || !b.sabe) return false;
    est.bag[b.semana] = {ok:true, dia:hoje()};
    // guarda só as 8 últimas semanas
    Object.keys(est.bag).sort().slice(0, -8).forEach(function(k){ delete est.bag[k]; });
    salvar(); avisar({tipo:'bagunca'});
    if(typeof twJogoSom === 'function') try{ twJogoSom('vitoria'); }catch(e){}
    return true;
  }
  function baguncaPassada(){   // a da semana anterior, se ficou sem resolver: os vizinhos resolveram
    ler(); var sem = domingo(hoje()), ant = new Date(Date.parse(sem + 'T12:00:00Z') - 7 * 864e5).toISOString().slice(0, 10);
    if(est.guia && est.guia.ini && est.guia.ini > ant) return null;
    var st = est.bag[ant]; return st && st.ok ? null : ant;
  }

  /* ---------- primeiros dias guiados ---------- */
  function guia(){
    ler(); var g = est.guia;
    if(!g.novo || g.pulou) return {ativo:false, abertas:ORDEM.slice(), dia:0};
    var d = Math.max(1, diasEntre(g.ini, hoje()) + 1);
    if(d > GUIA.length) return {ativo:false, abertas:ORDEM.slice(), dia:d};
    var ab = []; for(var i = 0; i < d; i++) ab = ab.concat(GUIA[i]);
    return {ativo:true, abertas:ab, dia:d, hojeAbriu:GUIA[d - 1], amanha:GUIA[d] || []};
  }
  function ruaAberta(r){ return guia().abertas.indexOf(r) >= 0; }
  function pularGuia(){ ler(); est.guia.pulou = true; salvar(); avisar({tipo:'guia'}); try{ guiaMarcar(); }catch(e){} }

  /* ---------- mensagens do trio (Chat do celular do jogo) ---------- */
  function falas(id){
    ler(); var out = [];
    if(id === 'idol:tsu'){
      var b = bagunca();
      out.push(b.ok ? f(FALA.bagOk, {fim:b.fim}) : f(FALA.bag, {q:b.quem, f:b.fez, g:gestoNome(b.gesto)}) + (b.sabe ? '' : ' ' + t('aprenda', vr(b.gesto, {j:jogosTxt(b.gesto)}))));
    } else if(id === 'idol:lirika'){
      var u = est.ultimo;
      if(BICOS && u && RUAS[u.rua] && diasEntre(u.dia, hoje()) <= 3) out.push(f(FALA.subiu, {n:u.n, b:bicoNome(u.rua), p:premioTxt(u.rua, u.n)}));
      else { var r = menorRua(); out.push(f(BICOS ? FALA.dica : SEM_BICO.dica, vr(r, {j:jogosTxt(r)}))); }
    } else if(id === 'idol:pati'){
      var g = guia();
      out.push(g.ativo ? f(FALA.guia, {d:g.dia, r:g.hojeAbriu.map(ruaNome).join(' + ')}) : f(FALA.estrela, vr(menorRua(true))));
    }
    return out;
  }
  function menorRua(semCompleta){
    var r = ORDEM.slice().sort(function(a, b){ return bico(a).pts - bico(b).pts || ORDEM.indexOf(a) - ORDEM.indexOf(b); });
    if(semCompleta){ var x = r.filter(function(k){ return bico(k).nivel < 3; }); if(x.length) return x[0]; }
    return r[0];
  }
  function hashFalas(id){ var s = falas(id).join('|'), h = 0; for(var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return String(h); }
  var TRIO = ['idol:tsu', 'idol:lirika', 'idol:pati'];
  function novas(){ ler(); return TRIO.filter(function(id){ return est.lidas[id] !== hashFalas(id); }).length; }
  function lida(id){ if(TRIO.indexOf(id) < 0) return; ler(); est.lidas[id] = hashFalas(id); salvar(); }
  function novaDe(id){ ler(); return TRIO.indexOf(id) >= 0 && est.lidas[id] !== hashFalas(id); }

  function jogosTxt(r){ return r === 'praca' ? t('praca') : RUAS[r].jogos.map(function(j){ return JOGO_NOME[j] || j; }).join(', '); }

  /* ---------- tela: painel, cena, toast e pergunta do guia moram em tw-bairro-tela.js (17/11/2026) ----------
     Baixa quando o painel ou o Mapa abre (ou num toque que precise dela). A contagem, o "Hoje" e o Chat ficam aqui,
     carregados na abertura, para nenhuma partida deixar de contar. */
  var tela = null, telaFila = [], telaPedida = false;
  function carregarTela(){
    if(tela || telaPedida) return; telaPedida = true;
    var s = document.createElement('script'); s.src = './tw-bairro-tela.js?v=3'; s.async = true;
    s.onerror = function(){ telaPedida = false; };
    (document.head || document.documentElement).appendChild(s);
  }
  function comTela(fn){ if(tela){ fn(tela); return; } telaFila.push(fn); carregarTela(); }
  function abrir(origem){ comTela(function(T){ T.abrir(origem); }); }
  function fechar(){ if(tela) tela.fechar(); }
  function toast(msg){ comTela(function(T){ T.toast(msg); }); }
  function guiaPergunta(rua, entrar){ if(ruaAberta(rua)) return false; comTela(function(T){ T.guiaPergunta(rua, entrar); }); return true; }
  function guiaMarcar(raiz){   // o Mapa chama ao se montar; fora dos dias guiados não há marca nenhuma a pôr (nem a tirar sem a tela)
    if(tela){ tela.guiaMarcar(raiz); return; } if(!guia().ativo) return; comTela(function(T){ T.guiaMarcar(raiz); });
  }

  /* ---------- resumo para o "Hoje" do visual novo ---------- */
  function resumo(){
    var b = bagunca(), r = menorRua(true), k = bico(r);
    return {ok:b.ok, tit:t('bagTit') + ' · ' + ruaNome(b.rua), sub:b.ok ? t('resolvida') : b.quem + ' ' + b.fez,
      bico:BICOS ? t('hjBico', {b:bicoNome(r), s:k.nivel >= 3 ? t('max') : t('falta', {f:k.falta, n:k.nivel + 1})}) : '', bt:t('ver')};
  }

  // conta junto com o Humor (só jogos confirmados ou treino de visitante; "fraco" não conta)
  function ligarHumor(){
    var H = window.TW_HUMOR; if(!H || typeof H.ouvir !== 'function' || H.twBairro) return !!(H && H.twBairro);
    H.twBairro = true;
    H.ouvir(function(tipo, ev, fraco){ if(ev && !fraco) contar(ev); });
    return true;
  }
  if(!ligarHumor()){ var tent = 0, it = setInterval(function(){ if(ligarHumor() || ++tent > 40) clearInterval(it); }, 250); }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-bairro]'); if(!b) return;
    e.preventDefault(); abrir();
  });

  window.TW_BAIRRO = {t:t, abrir:abrir, fechar:fechar, bico:bico, contar:contar, bagunca:bagunca, resolver:resolver,
    guia:guia, ruaAberta:ruaAberta, pularGuia:pularGuia, guiaPergunta:guiaPergunta, guiaMarcar:guiaMarcar, preparar:carregarTela,
    falas:falas, novas:novas, lida:lida, novaDe:novaDe, resumo:resumo, gestos:gestosAprendidos,
    ouvir:function(fn){ ouvintes.push(fn); }, ORDEM:ORDEM, RUAS:RUAS, NIVEIS:NIVEIS, POR_DIA:POR_DIA,
    // só para tw-bairro-tela.js: o que a tela lê do núcleo, e como ela se apresenta
    _k:{resolver:resolver, pularGuia:pularGuia, ler:ler, RUAS:RUAS, esc:esc, t:t, JOGO_NOME:JOGO_NOME, guia:guia, bagunca:bagunca, ruaNome:ruaNome,
      gestoNome:gestoNome, vr:vr, jogosTxt:jogosTxt, baguncaPassada:baguncaPassada, gestosAprendidos:gestosAprendidos, ORDEM:ORDEM, bico:bico,
      NIVEIS:NIVEIS, BICOS:BICOS, bicoNome:bicoNome, POR_DIA:POR_DIA, sabeGesto:sabeGesto, premioTxt:premioTxt, ruaAberta:ruaAberta},
    _tela:function(T){ tela = T; var f = telaFila.splice(0); f.forEach(function(fn){ try{ fn(T); }catch(e){} }); }};
})();
