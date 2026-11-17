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
  function t(k, v){ var s = tx(TX[k]) || k; if(v) for(var n in v) s = s.split('{' + n + '}').join(v[n]); return s; }
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
  function bicoNome(r){ return tx(BICO_NOME[r]); }
  function gestoNome(r){ return tx(GESTO_NOME[r]); }

  /* ---------- estado (um por conta, neste aparelho) ---------- */
  var todos = null, est = null, dono = '';
  function lerTodos(){ if(todos) return todos; try{ todos = JSON.parse(localStorage.getItem(CHAVE) || '{}') || {}; }catch(e){ todos = {}; } if(typeof todos !== 'object' || Array.isArray(todos)) todos = {}; return todos; }
  function salvar(){ try{ localStorage.setItem(CHAVE, JSON.stringify(todos)); }catch(e){} }
  function veterano(){
    try{ if(typeof best !== 'undefined' && +best > 0) return true; }catch(e){}
    try{ var h = JSON.parse(localStorage.getItem('brs48cr_humor_v1') || 'null'); if(h && ((+h.maxSerie || 0) > 0 || (h.recados || []).length)) return true; }catch(e){}
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
    if(subiu) toast('✨ ' + t('subiu', {n:depois, b:bicoNome(r)}) + ' · ' + premioTxt(r, depois));
    return {rua:r, nivel:depois, subiu:subiu};
  }
  function premioTxt(r, n){ return n === 1 ? t('p1') : n === 2 ? t('p2', {g:gestoNome(r)}) : t('p3', vr(r)); }
  function gestosAprendidos(){ return ORDEM.filter(function(r){ return bico(r).nivel >= 2; }); }

  /* ---------- bagunça da semana ---------- */
  function bagunca(){
    ler(); var sem = domingo(hoje()), i = ((Math.floor(diasEntre('2026-10-25', sem) / 7) % 6) + 6) % 6;
    var r = ORDEM[i], g = ORDEM[(i + 2) % 6], b = BAG[r], st = est.bag[sem] || {};
    return {semana:sem, rua:r, gesto:g, bicho:BICHO[r], quem:tx(b.quem), fez:tx(b.fez), fim:tx(b.fim), ok:!!st.ok,
      sabe:bico(g).nivel >= 2, domingo:hoje() === sem};
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
      out.push(b.ok ? f(FALA.bagOk, {fim:b.fim}) : f(FALA.bag, {q:b.quem, f:b.fez, g:gestoNome(b.gesto)}) + (b.sabe ? '' : ' ' + t('aprenda', vr(b.gesto))));
    } else if(id === 'idol:lirika'){
      var u = est.ultimo;
      if(u && RUAS[u.rua] && diasEntre(u.dia, hoje()) <= 3) out.push(f(FALA.subiu, {n:u.n, b:bicoNome(u.rua), p:premioTxt(u.rua, u.n)}));
      else { var r = menorRua(); out.push(f(FALA.dica, vr(r, {j:jogosTxt(r)}))); }
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

  /* ---------- tela (janela no padrão das outras) ---------- */
  var ov = null;
  function estilo(){
    if(document.getElementById('twBairroCss')) return;
    var s = document.createElement('style'); s.id = 'twBairroCss';
    s.textContent =
      '.twbov{z-index:22}.twbp{max-width:760px}.twbp h2{margin:0}.twb-sub{display:block;text-align:center;font-size:.86rem;opacity:.8;margin:2px 0 10px}' +
      '.twb-box{background:rgba(255,255,255,.72);border:1.5px solid rgba(155,48,217,.18);border-radius:18px;padding:12px 14px;margin:10px 0;text-align:left}' +
      'html.dark .twb-box,body.dark .twb-box{background:rgba(40,24,70,.72);border-color:rgba(255,255,255,.14)}' +
      '.twb-box h3{margin:0 0 8px;font-size:1rem;display:flex;gap:6px;align-items:center}' +
      '.twb-bag{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}.twb-bag canvas{width:100%;height:auto;border-radius:14px;display:block}' +
      '.twb-bag p{margin:0;font-size:.92rem;line-height:1.35}.twb-bag .twb-ok{font-weight:800;color:#2fb36b}' +
      '.twb-bt{border:0;border-radius:999px;padding:9px 16px;font:inherit;font-weight:800;background:linear-gradient(135deg,#9b30d9,#ff4fa3);color:#fff;cursor:pointer;justify-self:start}' +
      '.twb-bt[disabled]{opacity:.45;cursor:default}.twb-bt-claro{background:#fff;color:#7a2bbf;border:1.5px solid rgba(155,48,217,.3)}' +
      '.twb-ruas{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}' +
      '.twb-rua{border-radius:16px;padding:10px 12px;background:#fff;border:1.5px solid var(--twb-c);position:relative}' +
      'html.dark .twb-rua,body.dark .twb-rua{background:rgba(255,255,255,.06)}' +
      '.twb-rua.twb-off{opacity:.55}.twb-rua b{display:block;font-size:.95rem}.twb-rua small{display:block;font-size:.78rem;opacity:.8;line-height:1.3}' +
      '.twb-niv{display:flex;gap:4px;margin:6px 0 4px}.twb-niv i{width:22px;height:8px;border-radius:4px;background:rgba(0,0,0,.1)}.twb-niv i.on{background:var(--twb-c)}' +
      '.twb-barra{height:6px;border-radius:3px;background:rgba(0,0,0,.08);overflow:hidden;margin:4px 0}.twb-barra i{display:block;height:100%;background:var(--twb-c)}' +
      '.twb-pr{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.twb-pr span{font-size:.72rem;border-radius:999px;padding:2px 8px;background:rgba(0,0,0,.05)}.twb-pr span.on{background:var(--twb-c);color:#fff}' +
      '.twb-rua .twb-bt{padding:6px 12px;font-size:.82rem;margin-top:4px}' +
      '.twb-gestos{display:flex;flex-wrap:wrap;gap:6px}.twb-gestos span{border-radius:999px;padding:4px 10px;background:rgba(155,48,217,.1);font-size:.85rem;font-weight:700}' +
      '.twb-guia{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.twb-guia p{margin:0;flex:1 1 220px;font-size:.9rem}' +
      '.twb-regra{font-size:.76rem;opacity:.7;text-align:center;margin:8px 0 0}' +
      '.twb-pergunta{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:100000;background:#fff;color:#3a1a5c;border-radius:18px;padding:14px 16px;box-shadow:0 10px 30px rgba(60,20,110,.3);max-width:min(92vw,420px);text-align:center}' +
      '.twb-pergunta p{margin:0 0 10px;font-weight:700}.twb-pergunta div{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}' +
      '.petphone-chat-contato{position:relative}.petphone-chat-contato>.petphone-badge{top:50%;right:30px;left:auto;transform:translateY(-50%)}' +
      '.twc-hj-bico{display:block;font-size:.74rem;opacity:.78;margin-top:2px}' +
      '[data-tw-bairro].twb-guia-off{opacity:.5}[data-tw-bairro] .twb-breve{font-size:.68em;margin-left:4px;opacity:.85}';
    document.head.appendChild(s);
  }
  function montar(){
    if(ov) return; estilo();
    ov = document.createElement('div'); ov.className = 'ov twbov tw-window-overlay'; ov.id = 'twBairroOv'; ov.hidden = true;
    ov.innerHTML = '<div class="panel twbp tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="twBairroTit">' +
      '<button type="button" class="perfx tw-window-control tw-window-close" data-twb="fechar" aria-label="✕">✕</button>' +
      '<h2 class="tw-modal-title" id="twBairroTit"></h2><small class="tw-modal-jp" lang="ja">まちのくらし</small><span class="twb-sub" id="twBairroSub"></span>' +
      '<div id="twBairroCorpo"></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){
      if(e.target === ov){ fechar(); return; }
      var b = e.target.closest && e.target.closest('[data-twb]'); if(!b) return;
      var a = b.getAttribute('data-twb');
      if(a === 'fechar') fechar();
      else if(a === 'resolver'){ if(resolver()) ui(); }
      else if(a === 'pular'){ pularGuia(); ui(); }
      else if(a === 'jogar') jogar(b.getAttribute('data-j'));
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov && !ov.hidden) fechar(); });
  }
  function abrir(){ montar(); ler(); ui(); ov.hidden = false; }
  function fechar(){ if(ov) ov.hidden = true; }
  function acaoCelular(a){   // pede uma ação ao visual novo (mesmo caminho dos botões dele)
    var cel = document.getElementById('twCel'); if(!cel) return false;
    var b = document.createElement('button'); b.type = 'button'; b.hidden = true; b.setAttribute('data-a', a); cel.appendChild(b);
    try{ b.click(); } finally { b.remove(); } return true;
  }
  function jogar(j){
    fechar();
    if(j === 'mapa'){ if(!acaoCelular('mapa')){ var m = document.querySelector('.tw-mapa'); if(m && m.scrollIntoView) m.scrollIntoView({behavior:'smooth'}); } return; }
    if(j === 'bloom' && typeof window.bloomAbrir === 'function') return window.bloomAbrir();
    if(j === 'battle' && typeof window.battleAbrir === 'function') return window.battleAbrir();
    if(j === 'studio' && typeof window.studioAbrir === 'function') return window.studioAbrir();
    var c = document.querySelector('#hubCards [data-ir="' + j + '"]'); if(c && !c.disabled) c.click();
  }
  function botaoJogo(r){
    var j = r === 'praca' ? 'mapa' : RUAS[r].jogos.filter(function(k){
      return k === 'bloom' || k === 'battle' || k === 'studio' || !!document.querySelector('#hubCards [data-ir="' + k + '"]'); })[0];
    return j ? '<button type="button" class="twb-bt" data-twb="jogar" data-j="' + esc(j) + '">' + esc(r === 'praca' ? t('passear') : t('jogar') + ' · ' + (JOGO_NOME[j] || j)) + '</button>' : '';
  }
  function ui(){
    if(!ov) return; ler();
    ov.querySelector('#twBairroTit').textContent = t('tit');
    ov.querySelector('#twBairroSub').textContent = t('sub');
    var g = guia(), b = bagunca(), h = '';
    if(g.ativo) h += '<section class="twb-box twb-guia"><p><b>' + esc(t('guiaTit', {d:g.dia})) + '</b><br>' +
      esc(t('guiaTxt', {r:(g.amanha.length ? g.amanha.map(ruaNome).join(' + ') : '—')})) + '</p><button type="button" class="twb-bt twb-bt-claro" data-twb="pular">' + esc(t('pular')) + '</button></section>';
    h += '<section class="twb-box twb-bag"><h3>' + esc(t('bagTit')) + ' · ' + esc(ruaNome(b.rua)) + '</h3>' +
      '<canvas id="twBairroCv" width="480" height="200" aria-hidden="true"></canvas>' +
      '<p><b>' + esc(b.quem) + '</b> ' + esc(b.fez) + '.</p>' +
      (b.ok ? '<p class="twb-ok">✓ ' + esc(t('resolvida')) + '</p><p>' + esc(b.fim) + '</p>' :
        '<p>' + esc(t('precisa', {g:RUAS[b.gesto].gesto.emoji + ' ' + gestoNome(b.gesto)})) + '.' + (b.sabe ? '' : ' ' + esc(t('aprenda', vr(b.gesto)))) + '</p>' +
        '<button type="button" class="twb-bt" data-twb="resolver"' + (b.sabe ? '' : ' disabled') + '>' + esc(RUAS[b.gesto].gesto.emoji + ' ' + t('fazer')) + '</button>') +
      (baguncaPassada() ? '<p class="twb-regra">' + esc(t('vizinhos')) + '</p>' : '') + '</section>';
    var ap = gestosAprendidos();
    h += '<section class="twb-box"><h3>' + esc(t('gestos')) + '</h3>' + (ap.length ? '<div class="twb-gestos">' + ap.map(function(r){
      return '<span>' + esc(RUAS[r].gesto.emoji + ' ' + gestoNome(r)) + '</span>'; }).join('') + '</div>' : '<p class="twb-regra" style="text-align:left;margin:0">' + esc(t('semGesto')) + '</p>') + '</section>';
    h += '<section class="twb-box"><h3>' + esc(t('ruas')) + '</h3><div class="twb-ruas">' + ORDEM.map(function(r){
      var k = bico(r), aberta = !g.ativo || g.abertas.indexOf(r) >= 0, pc = k.nivel >= 3 ? 100 : Math.round((k.pts - (k.nivel ? NIVEIS[k.nivel - 1] : 0)) / (k.prox - (k.nivel ? NIVEIS[k.nivel - 1] : 0)) * 100);
      return '<article class="twb-rua' + (aberta ? '' : ' twb-off') + '" style="--twb-c:' + RUAS[r].cor + '"><b>' + esc(RUAS[r].emoji + ' ' + ruaNome(r)) + (aberta ? '' : ' · ' + esc(t('emBreve'))) + '</b>' +
        '<small>' + esc(bicoNome(r)) + ' · ' + esc(k.nivel ? t('nivel', {n:k.nivel}) : t('novato')) + '</small>' +
        '<div class="twb-niv" aria-hidden="true">' + [1, 2, 3].map(function(n){ return '<i class="' + (k.nivel >= n ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="twb-barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pc + '"><i style="width:' + pc + '%"></i></div>' +
        '<small>' + esc(k.nivel >= 3 ? t('max') : k.hoje >= POR_DIA ? t('hojeCheio') : t('falta', {f:k.falta, n:k.nivel + 1})) + '</small>' +
        '<div class="twb-pr">' + [1, 2, 3].map(function(n){ return '<span class="' + (k.nivel >= n ? 'on' : '') + '">' + esc(premioTxt(r, n)) + '</span>'; }).join('') + '</div>' +
        '<small>' + esc(t('conta', {j:jogosTxt(r)})) + '</small>' + (k.nivel < 3 ? botaoJogo(r) : '') + '</article>';
    }).join('') + '</div><p class="twb-regra">' + esc(t('regra')) + '</p></section>';
    ov.querySelector('#twBairroCorpo').innerHTML = h;
    desenharCena(b);
  }
  // cena da bagunça: o seu Idol (com o gesto, se já resolveu) e o bichinho, sobre a cor da rua
  function desenharCena(b){
    var cv = ov && ov.querySelector('#twBairroCv'); if(!cv) return;
    if(typeof window.twNitido === 'function') window.twNitido(cv);
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, c = RUAS[b.rua].cor;
    var gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#fff6fd'); gr.addColorStop(1, c + '55');
    x.fillStyle = gr; x.fillRect(0, 0, W, H);
    x.fillStyle = c + '33'; x.fillRect(0, H - 34, W, 34);
    for(var i = 0; i < 14; i++){ x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc((i * 73 + 20) % W, 18 + (i * 37) % 90, 2 + i % 3, 0, 7); x.fill(); }
    try{
      if(typeof perfDesenharIdol === 'function'){
        var av = typeof hubAv === 'function' ? hubAv() : (typeof perfAvAtual === 'function' ? perfAvAtual({}) : null);
        if(av){
          av.pet = null; av.fundo = '';
          var gs = RUAS[b.gesto].gesto; av.pose = b.ok ? gs.pose : ''; av.expr = b.ok ? gs.expr : 0;
          x.save(); x.translate(-W * .2, 0); perfDesenharIdol(x, W, H, av, false, 0, 0); x.restore();
        }
      }
    }catch(e){}
    var bx = W * .72, by = H * .62, ok = b.ok;
    if(b.bicho === 'nuvem') nuvem(x, bx, by - 20, ok);
    else if(typeof window.twMapaBicho === 'function') window.twMapaBicho(b.bicho, x, bx, by + (b.bicho === 'gato' ? 30 : 0), b.bicho === 'gato' ? 1.6 : 1.5, 0);
    else if(typeof window.twMapaCarregar === 'function' && !desenharCena.pediu){   // o mapa baixa depois da abertura
      desenharCena.pediu = true; try{ window.twMapaCarregar(); }catch(e){}
      setTimeout(function(){ if(ov && !ov.hidden) desenharCena(bagunca()); }, 1500);
    }
    if(ok) coracao(x, W * .84, H * .24, 14, '#ff4fa3');
    else { x.save(); x.font = 'bold 30px system-ui, sans-serif'; x.textAlign = 'center'; x.fillStyle = c; x.fillText('?!', W * .87, H * .3); x.restore(); }
  }
  function coracao(x, cx, cy, r, cor){
    x.save(); x.fillStyle = cor; x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath();
    x.moveTo(cx, cy + r); x.bezierCurveTo(cx - r * 1.6, cy - r * .2, cx - r * .7, cy - r * 1.3, cx, cy - r * .45);
    x.bezierCurveTo(cx + r * .7, cy - r * 1.3, cx + r * 1.6, cy - r * .2, cx, cy + r); x.closePath(); x.stroke(); x.fill(); x.restore();
  }
  // Nuvem Resmungona: bolinhas brancas com contorno lilás (como as nuvens do Mapa); cara emburrada ou sorrindo
  function nuvem(x, cx, cy, feliz){
    x.save(); x.translate(cx, cy); x.lineJoin = 'round';
    var bolas = [[-34, 6, 22], [-12, -10, 26], [14, -6, 24], [34, 8, 20], [0, 12, 24]];
    x.fillStyle = '#ffffff'; x.strokeStyle = '#9a8fd6'; x.lineWidth = 4;
    bolas.forEach(function(q){ x.beginPath(); x.arc(q[0], q[1], q[2], 0, 7); x.stroke(); });
    bolas.forEach(function(q){ x.beginPath(); x.arc(q[0], q[1], q[2], 0, 7); x.fill(); });
    x.fillStyle = '#3a2a4a'; x.strokeStyle = '#3a2a4a'; x.lineWidth = 2.6; x.lineCap = 'round';
    x.beginPath(); x.arc(-11, 4, 3.2, 0, 7); x.arc(11, 4, 3.2, 0, 7); x.fill();
    x.beginPath();
    if(feliz){ x.arc(0, 10, 7, .2, Math.PI - .2); }
    else { x.moveTo(-17, -5); x.lineTo(-6, -1); x.moveTo(17, -5); x.lineTo(6, -1); x.moveTo(-6, 16); x.quadraticCurveTo(0, 11, 6, 16); }
    x.stroke();
    x.fillStyle = 'rgba(255,111,181,.45)'; x.beginPath(); x.ellipse(-20, 12, 5, 3, 0, 0, 7); x.ellipse(20, 12, 5, 3, 0, 0, 7); x.fill();
    if(!feliz){ x.fillStyle = '#9a8fd6'; [[-18, 40], [0, 46], [18, 40]].forEach(function(g){ x.beginPath(); x.ellipse(g[0], g[1], 2.4, 4.5, 0, 0, 7); x.fill(); }); }
    x.restore();
  }
  function toast(msg){
    try{ if(typeof window.twcToast === 'function') return window.twcToast(msg); }catch(e){}
    try{ if(typeof hubToast === 'function') return hubToast(msg); }catch(e){}
  }

  /* ---------- guia no Mapa: as ruas acendem uma por dia (nada trancado) ---------- */
  function guiaPergunta(rua, entrar){
    if(ruaAberta(rua)) return false;
    estilo(); var velho = document.getElementById('twBairroPerg'); if(velho) velho.remove();
    var d = document.createElement('div'); d.className = 'twb-pergunta'; d.id = 'twBairroPerg'; d.setAttribute('role', 'dialog');
    d.innerHTML = '<p>' + esc(t('guiaRua', {r:ruaNome(rua)})) + '</p><div><button type="button" class="twb-bt" data-p="entrar">' + esc(t('entrar')) + '</button>' +
      '<button type="button" class="twb-bt twb-bt-claro" data-p="pular">' + esc(t('pular')) + '</button>' +
      '<button type="button" class="twb-bt twb-bt-claro" data-p="depois">' + esc(t('depois')) + '</button></div>';
    d.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('[data-p]'); if(!b) return;
      var a = b.getAttribute('data-p'); d.remove();
      if(a === 'pular'){ pularGuia(); guiaMarcar(); }
      if(a === 'entrar' || a === 'pular') entrar();
    });
    document.body.appendChild(d);
    return true;
  }
  function guiaMarcar(raiz){
    var g = guia(); estilo();
    [].forEach.call((raiz || document).querySelectorAll('[data-tw-bairro]'), function(b){
      var r = b.getAttribute('data-tw-bairro'), off = g.ativo && g.abertas.indexOf(r) < 0;
      b.classList.toggle('twb-guia-off', off);
      var s = b.querySelector('.twb-breve');
      if(off && !s){ s = document.createElement('span'); s.className = 'twb-breve'; s.textContent = '✨ ' + t('emBreve'); b.appendChild(s); }
      else if(!off && s) s.remove();
    });
  }

  /* ---------- resumo para o "Hoje" do visual novo ---------- */
  function resumo(){
    var b = bagunca(), r = menorRua(true), k = bico(r);
    return {ok:b.ok, tit:t('bagTit') + ' · ' + ruaNome(b.rua), sub:b.ok ? t('resolvida') : b.quem + ' ' + b.fez,
      bico:t('hjBico', {b:bicoNome(r), s:k.nivel >= 3 ? t('max') : t('falta', {f:k.falta, n:k.nivel + 1})}), bt:t('ver')};
  }

  // conta junto com o Humor (só jogos confirmados ou treino de visitante; "fraco" não conta)
  function ligarHumor(){
    var H = window.TW_HUMOR; if(!H || typeof H.ouvir !== 'function' || H.twBairro) return !!(H && H.twBairro);
    H.twBairro = true;
    H.ouvir(function(tipo, ev, fraco){ if(ev && !fraco) contar(ev); });
    return true;
  }
  if(document.head) estilo(); else document.addEventListener('DOMContentLoaded', estilo);
  if(!ligarHumor()){ var tent = 0, it = setInterval(function(){ if(ligarHumor() || ++tent > 40) clearInterval(it); }, 250); }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-bairro]'); if(!b) return;
    e.preventDefault(); abrir();
  });

  window.TW_BAIRRO = {t:t, abrir:abrir, fechar:fechar, bico:bico, contar:contar, bagunca:bagunca, resolver:resolver,
    guia:guia, ruaAberta:ruaAberta, pularGuia:pularGuia, guiaPergunta:guiaPergunta, guiaMarcar:guiaMarcar,
    falas:falas, novas:novas, lida:lida, novaDe:novaDe, resumo:resumo, gestos:gestosAprendidos,
    ouvir:function(fn){ ouvintes.push(fn); }, ORDEM:ORDEM, RUAS:RUAS, NIVEIS:NIVEIS, POR_DIA:POR_DIA};
})();
