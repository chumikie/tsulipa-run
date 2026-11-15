/* Idol⭐News! — "História em capítulos": quadrinhos curtos do TsuLiPa (Tsu, Lirika e Pati), desenhados no Canvas
   com os mesmos bonecos do jogo. Inspirados na história real do trio no BRS48 (Draft 1st Generation, ago/2021, e as
   músicas da unit TsuLiPa em cada Unit Festival); as falas são de brincadeira. Um capítulo novo toda terça-feira,
   a partir do lançamento do TsuLiPa⭐World (27/10/2026). Só leitura: nada vai para o servidor. */
var JN_CAPS_INICIO = Date.UTC(2026, 9, 27);
var JN_CAPS_TX = {
  sec:{pt:'História em capítulos',en:'Story in chapters',es:'Historia en capítulos',id:'Cerita bersambung',th:'เรื่องราวเป็นตอน',ja:'連載ストーリー'},
  dica:{pt:'Quadrinhos do TsuLiPa inspirados na história real do trio; as falas são de brincadeira. Capítulo novo toda terça!',en:"TsuLiPa comics inspired by the trio's real story; the lines are just for fun. A new chapter every Tuesday!",es:'Cómics de TsuLiPa inspirados en la historia real del trío; los diálogos son de broma. ¡Capítulo nuevo cada martes!',id:'Komik TsuLiPa yang terinspirasi kisah nyata trio ini; dialognya cuma bercanda. Bab baru setiap Selasa!',th:'การ์ตูน TsuLiPa จากเรื่องจริงของทั้งสาม บทพูดเป็นแค่ความสนุก ตอนใหม่ทุกวันอังคาร!',ja:'TsuLiPaの実話から生まれたマンガ（セリフはお遊び）。毎週火曜に新しい話！'},
  cap:{pt:'Cap. {n}',en:'Ch. {n}',es:'Cap. {n}',id:'Bab {n}',th:'ตอน {n}',ja:'第{n}話'},
  em:{pt:'Chega em {d}',en:'Arrives on {d}',es:'Llega el {d}',id:'Tiba {d}',th:'มาวันที่ {d}',ja:'{d}に公開'},
  novo:{pt:'Novo!',en:'New!',es:'¡Nuevo!',id:'Baru!',th:'ใหม่!',ja:'NEW!'},
  quadro:{pt:'Quadro {n}',en:'Panel {n}',es:'Viñeta {n}',id:'Panel {n}',th:'ช่อง {n}',ja:'コマ{n}'}
};
// [título, subtítulo, [quadros]] — quadro: [fundo, [[membro, pose], ...], narração, [[membro, fala], ...]]
var JN_CAPS = [
  [{pt:'Mesma geração',en:'Same generation',es:'Misma generación',id:'Angkatan yang sama',th:'รุ่นเดียวกัน',ja:'同じ期'}, 'Draft 1st Generation · 2021', [
    ['basico', [[0, 'tchau']], {pt:'Agosto de 2021: a primeira geração draft do BRS48.',en:"August 2021: BRS48's first draft generation.",es:'Agosto de 2021: la primera generación draft de BRS48.',id:'Agustus 2021: angkatan draft pertama BRS48.',th:'สิงหาคม 2021: Draft รุ่นแรกของ BRS48',ja:'2021年8月、BRS48ドラフト1期生。'},
      [[0, {pt:'Oiê! Sou o Tsu!',en:"Oiê! I'm Tsu!",es:'¡Oiê! ¡Soy Tsu!',id:'Oiê! Aku Tsu!',th:'Oiê! ผม Tsu!',ja:'オイエー！Tsuだよ！'}]]],
    ['basico', [[1, 'coracao'], [2, 'v']], null,
      [[1, {pt:'Shiroma Lirika desu!',en:'Shiroma Lirika desu!',es:'¡Shiroma Lirika desu!',id:'Shiroma Lirika desu!',th:'Shiroma Lirika desu!',ja:'城間りりかです！'}], [2, {pt:'E eu sou o Pati!',en:"And I'm Pati!",es:'¡Y yo soy Pati!',id:'Dan aku Pati!',th:'และผมคือ Pati!',ja:'Patiです！'}]]],
    ['palco', [[0, 'v'], [1, 'coracao'], [2, 'banzai']], {pt:'Os três entraram juntos na Draft 1st Generation.',en:'The three joined the Draft 1st Generation together.',es:'Los tres entraron juntos en la Draft 1st Generation.',id:'Mereka bertiga masuk Draft 1st Generation bersama.',th:'ทั้งสามเข้า Draft 1st Generation พร้อมกัน',ja:'3人いっしょにドラフト1期生に。'},
      [[2, {pt:'Mesma turma, mesmo sonho!!',en:'Same class, same dream!!',es:'¡¡Misma clase, mismo sueño!!',id:'Angkatan sama, mimpi sama!!',th:'รุ่นเดียวกัน ฝันเดียวกัน!!',ja:'同じ期、同じ夢！！'}]]]
  ]],
  [{pt:'Nasce a unit TsuLiPa',en:'The TsuLiPa unit is born',es:'Nace la unit TsuLiPa',id:'Unit TsuLiPa lahir',th:'ยูนิต TsuLiPa ถือกำเนิด',ja:'ユニットTsuLiPa誕生'}, 'Unit Festival 2021 · Polyrhythm', [
    ['noite', [[0, 'v'], [1, 'mic'], [2, 'tchau']], {pt:'O primeiro Unit Festival está chegando.',en:'The first Unit Festival is coming.',es:'Se acerca el primer Unit Festival.',id:'Unit Festival pertama sudah dekat.',th:'Unit Festival ครั้งแรกใกล้เข้ามา',ja:'はじめてのUnit Festivalが近づいてる。'},
      [[0, {pt:'Tsu + Lirika + Pati = TsuLiPa!',en:'Tsu + Lirika + Pati = TsuLiPa!',es:'¡Tsu + Lirika + Pati = TsuLiPa!',id:'Tsu + Lirika + Pati = TsuLiPa!',th:'Tsu + Lirika + Pati = TsuLiPa!',ja:'Tsu＋Lirika＋Pati＝TsuLiPa！'}]]],
    ['basico', [[1, 'mic']], null,
      [[1, {pt:'Bora ensaiar mais uma vez?',en:'One more rehearsal?',es:'¿Ensayamos una vez más?',id:'Latihan sekali lagi?',th:'ซ้อมอีกรอบไหม?',ja:'もう一回練習しよう？'}]]],
    ['palco', [[0, 'mic'], [1, 'luz'], [2, 'banzai']], {pt:'No palco: Polyrhythm!',en:'On stage: Polyrhythm!',es:'En el escenario: ¡Polyrhythm!',id:'Di panggung: Polyrhythm!',th:'บนเวที: Polyrhythm!',ja:'ステージでPolyrhythm！'},
      [[2, {pt:'Arrasamos!!',en:'We nailed it!!',es:'¡¡Lo logramos!!',id:'Kita keren!!',th:'เยี่ยมไปเลย!!',ja:'やったー！！'}]]]
  ]],
  [{pt:'Luzes da cidade',en:'City lights',es:'Luces de la ciudad',id:'Lampu kota',th:'แสงไฟในเมือง',ja:'街の灯り'}, 'Unit Festival 2023 · Plastic Love', [
    ['noite', [[2, 'v']], {pt:'2023: a unit volta com clima de cidade à noite.',en:'2023: the unit returns with a city-night mood.',es:'2023: la unit vuelve con aire de ciudad nocturna.',id:'2023: unit kembali dengan suasana kota malam.',th:'2023: ยูนิตกลับมาในบรรยากาศเมืองยามค่ำ',ja:'2023年、夜の街のムードで再結成。'},
      [[2, {pt:'Que vibe retrô!',en:'Such a retro vibe!',es:'¡Qué vibra retro!',id:'Vibe retro banget!',th:'ฟีลเรโทรสุดๆ!',ja:'レトロな感じ！'}]]],
    ['noite', [[0, 'mic'], [1, 'coracao']], null,
      [[0, {pt:'Plastic Love é a nossa música deste ano!',en:'Plastic Love is our song this year!',es:'¡Plastic Love es nuestra canción este año!',id:'Plastic Love lagu kita tahun ini!',th:'Plastic Love คือเพลงของเราปีนี้!',ja:'今年はPlastic Love！'}]]],
    ['palco', [[0, 'luz'], [1, 'mic'], [2, 'coracao']], {pt:'Luzes neon e muito brilho.',en:'Neon lights and lots of sparkle.',es:'Luces de neón y mucho brillo.',id:'Lampu neon dan banyak kilau.',th:'ไฟนีออนและประกายเต็มเวที',ja:'ネオンとキラキラ。'},
      [[1, {pt:'Kirei~!',en:'Kirei~!',es:'¡Kirei~!',id:'Kirei~!',th:'Kirei~!',ja:'きれい〜！'}]]]
  ]],
  [{pt:'Dois verões',en:'Two summers',es:'Dos veranos',id:'Dua musim panas',th:'สองฤดูร้อน',ja:'ふたつの夏'}, 'Unit Festival 2024 · 2025', [
    ['ceu', [[1, 'tchau']], {pt:'Dois verões, duas músicas: Secret Base e Dream Splash.',en:'Two summers, two songs: Secret Base and Dream Splash.',es:'Dos veranos, dos canciones: Secret Base y Dream Splash.',id:'Dua musim panas, dua lagu: Secret Base dan Dream Splash.',th:'สองฤดูร้อน สองเพลง: Secret Base และ Dream Splash',ja:'ふたつの夏、Secret BaseとDream Splash。'},
      [[1, {pt:'Verão com vocês é o melhor!',en:'Summer with you two is the best!',es:'¡El verano con ustedes es lo mejor!',id:'Musim panas bareng kalian paling seru!',th:'ฤดูร้อนกับพวกเธอดีที่สุด!',ja:'ふたりとの夏がいちばん！'}]]],
    ['ceu', [[2, 'coracao'], [0, 'v']], null,
      [[2, {pt:'A gente se vê no próximo festival?',en:'See you at the next festival?',es:'¿Nos vemos en el próximo festival?',id:'Ketemu di festival berikutnya?',th:'เจอกันเทศกาลหน้านะ?',ja:'次のフェスでも会える？'}], [0, {pt:'Prometido!',en:'Promise!',es:'¡Prometido!',id:'Janji!',th:'สัญญา!',ja:'約束！'}]]],
    ['palco', [[0, 'banzai'], [1, 'luz'], [2, 'mic']], {pt:'E a promessa foi cumprida.',en:'And the promise was kept.',es:'Y la promesa se cumplió.',id:'Dan janji itu ditepati.',th:'และสัญญานั้นก็เป็นจริง',ja:'そして約束は守られた。'},
      [[0, {pt:'TsuLiPa de novo!',en:'TsuLiPa again!',es:'¡TsuLiPa otra vez!',id:'TsuLiPa lagi!',th:'TsuLiPa อีกครั้ง!',ja:'またTsuLiPa！'}]]]
  ]],
  [{pt:'Juntos, sempre',en:'Always together',es:'Juntos, siempre',id:'Selalu bersama',th:'อยู่ด้วยกันเสมอ',ja:'いつもいっしょ'}, "Unit Festival 2026 · I can't stop the loneliness", [
    ['noite', [[0, 'mic']], {pt:'2026: uma música mais madura e emocionante.',en:'2026: a more mature, moving song.',es:'2026: una canción más madura y emotiva.',id:'2026: lagu yang lebih dewasa dan menyentuh.',th:'2026: เพลงที่โตขึ้นและซึ้งกว่าเดิม',ja:'2026年、大人っぽくて胸にしみる曲。'},
      [[0, {pt:'Essa vai tocar o coração de todo mundo.',en:"This one will touch everyone's heart.",es:'Esta va a tocar el corazón de todos.',id:'Lagu ini bakal menyentuh hati semua.',th:'เพลงนี้จะทำให้ทุกคนซึ้ง',ja:'みんなの心にとどくはず。'}]]],
    ['basico', [[1, 'coracao'], [2, 'v']], null,
      [[1, {pt:'Mesmo longe, ninguém fica sozinho.',en:'Even far apart, no one is alone.',es:'Aunque lejos, nadie se queda solo.',id:'Walau jauh, tak ada yang sendirian.',th:'ถึงจะอยู่ไกล ก็ไม่มีใครโดดเดี่ยว',ja:'離れていても、ひとりじゃない。'}]]],
    ['palco', [[0, 'luz'], [1, 'mic'], [2, 'tchau']], {pt:'Mais um Unit Festival juntos.',en:'Another Unit Festival together.',es:'Otro Unit Festival juntos.',id:'Satu Unit Festival lagi bersama.',th:'อีกหนึ่ง Unit Festival ด้วยกัน',ja:'またいっしょのUnit Festival。'},
      [[2, {pt:'Beijinhos e Patchau!!',en:'Kisses and Patchau!!',es:'¡¡Besitos y Patchau!!',id:'Muah dan Patchau!!',th:'จุ๊บๆ และ Patchau!!',ja:'チュッ、パチャウ！！'}]]]
  ]],
  [{pt:'As portas se abrem',en:'The doors open',es:'Se abren las puertas',id:'Pintu terbuka',th:'ประตูเปิดแล้ว',ja:'扉がひらく'}, 'TsuLiPa⭐World · 27/10/2026', [
    ['halloween', [[2, 'v']], {pt:'Outubro de 2026, em plena temporada de Halloween...',en:'October 2026, right in Halloween season...',es:'Octubre de 2026, en plena temporada de Halloween...',id:'Oktober 2026, tepat di musim Halloween...',th:'ตุลาคม 2026 ช่วงฮาโลวีนพอดี...',ja:'2026年10月、ハロウィンのまっただなか…'},
      [[2, {pt:'Tá tudo pronto?',en:'Is everything ready?',es:'¿Está todo listo?',id:'Semua sudah siap?',th:'พร้อมหมดแล้วยัง?',ja:'準備はできた？'}]]],
    ['temporada', [[1, 'tchau'], [0, 'v']], null,
      [[1, {pt:'O TsuLiPa⭐World vai abrir!',en:'TsuLiPa⭐World is opening!',es:'¡TsuLiPa⭐World va a abrir!',id:'TsuLiPa⭐World akan dibuka!',th:'TsuLiPa⭐World กำลังจะเปิด!',ja:'TsuLiPa⭐World、オープン！'}]]],
    ['palco', [[0, 'tchau'], [1, 'coracao'], [2, 'banzai']], {pt:'E agora você também faz parte dessa história.',en:'And now you are part of this story too.',es:'Y ahora tú también eres parte de esta historia.',id:'Dan sekarang kamu juga bagian dari cerita ini.',th:'และตอนนี้คุณก็เป็นส่วนหนึ่งของเรื่องนี้',ja:'そして今、あなたもこの物語の一員。'},
      [[0, {pt:'Boas-vindas ao TsuLiPa⭐World!',en:'Welcome to TsuLiPa⭐World!',es:'¡Bienvenidas y bienvenidos a TsuLiPa⭐World!',id:'Selamat datang di TsuLiPa⭐World!',th:'ยินดีต้อนรับสู่ TsuLiPa⭐World!',ja:'TsuLiPa⭐Worldへようこそ！'}]]]
  ]]
];
/* Temporada 1 — estrutura editorial, ainda não publicada.
   Não ligar a interface antes de roteiro, arte e seis traduções aprovados. */
var JN_T1_PUBLICADA = false;
var JN_T1 = {
  id:'bastidores-de-um-sonho',
  titulo:'Bastidores de um Sonho',
  publicada:JN_T1_PUBLICADA,
  episodios:[
    {id:'convite-misterioso',data:'2026-11-16',pronto:false},
    {id:'ensaio-impossivel',data:'2026-11-23',pronto:false},
    {id:'lembranca-lirika',data:'2026-11-30',pronto:false},
    {id:'plano-pati',data:'2026-12-07',pronto:false},
    {id:'quando-luz-apaga',data:'2026-12-14',pronto:false},
    {id:'palco-nosso',data:'2026-12-21',pronto:false}
  ]
};
function jnT1HojeBrasilia(agora){
  var partes=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(agora || new Date());
  var valores={}; partes.forEach(function(p){ valores[p.type]=p.value; });
  return valores.year+'-'+valores.month+'-'+valores.day;
}
function jnT1Disponivel(i,agora){
  var ep=JN_T1.episodios[i];
  return !!(JN_T1_PUBLICADA && ep && ep.pronto && ep.data <= jnT1HojeBrasilia(agora));
}
/* A8 — roteiro e arte do episódio piloto. Não conectado ao leitor público. */
var JN_T1_PILOTO = {"id":"convite-misterioso","title":{"pt":"O Convite Misterioso","en":"The Mysterious Invitation","es":"La invitación misteriosa","id":"Undangan Misterius","th":"คำเชิญปริศนา","ja":"謎の招待状"},"panels":[["basico",[[0,"tchau"]],{"pt":"Uma carta lilás aparece debaixo da porta do camarim.","en":"A lilac envelope slips under the dressing-room door.","es":"Un sobre lila aparece bajo la puerta del camerino.","id":"Amplop ungu muda muncul di bawah pintu ruang ganti.","th":"ซองจดหมายสีม่วงอ่อนโผล่มาใต้ประตูห้องแต่งตัว","ja":"楽屋のドアの下に薄紫の封筒が届いた。"},[[0,{"pt":"Gente... alguém pediu uma apresentação secreta?","en":"Guys... did someone request a secret show?","es":"Oigan... ¿alguien pidió una actuación secreta?","id":"Teman-teman... ada yang meminta pertunjukan rahasia?","th":"ทุกคน... มีใครขอการแสดงลับเหรอ?","ja":"ねえ…誰かが秘密のライブを頼んだの？"}]]],["basico",[[1,"coracao"],[2,"v"]],{"pt":"No envelope, apenas uma estrela desenhada à mão.","en":"Inside is only a hand-drawn star.","es":"Dentro solo hay una estrella dibujada a mano.","id":"Di dalamnya hanya ada bintang yang digambar tangan.","th":"ข้างในมีเพียงรูปดาวที่วาดด้วยมือ","ja":"中には手描きの星がひとつだけ。"},[[1,{"pt":"Não tem assinatura. Mas esse desenho parece familiar.","en":"No signature. But that drawing looks familiar.","es":"No tiene firma. Pero ese dibujo me resulta familiar.","id":"Tidak ada tanda tangan. Tapi gambar ini terasa familier.","th":"ไม่มีลายเซ็น แต่รูปนี้ดูคุ้นจัง","ja":"差出人はないけど、この絵、見覚えがある。"}],[2,{"pt":"Será um mapa do tesouro?","en":"Could it be a treasure map?","es":"¿Será un mapa del tesoro?","id":"Jangan-jangan peta harta karun?","th":"หรือว่าจะเป็นแผนที่สมบัติ?","ja":"宝の地図だったりして？"}]]],["noite",[[0,"v"],[1,"tchau"],[2,"coracao"]],{"pt":"Atrás da carta há três palavras: 'Onde tudo começou'.","en":"On the back: three words — 'Where it all began'.","es":"Al dorso: tres palabras — «Donde todo comenzó».","id":"Di belakangnya tertulis: 'Tempat semuanya bermula'.","th":"ด้านหลังเขียนว่า 'จุดที่ทุกอย่างเริ่มต้น'","ja":"裏には「すべてが始まった場所」とある。"},[[0,{"pt":"Então precisamos lembrar do nosso primeiro ensaio!","en":"Then we need to remember our first rehearsal!","es":"¡Entonces recordemos nuestro primer ensayo!","id":"Kalau begitu, kita harus ingat latihan pertama kita!","th":"งั้นเราต้องนึกถึงการซ้อมครั้งแรก!","ja":"じゃあ、初めての練習を思い出そう！"}]]],["palco",[[2,"banzai"],[1,"mic"]],{"pt":"Pati corre até o palco vazio. Lirika percebe uma luz acesa.","en":"Pati runs to the empty stage. Lirika spots a light still on.","es":"Pati corre al escenario vacío. Lirika ve una luz encendida.","id":"Pati berlari ke panggung kosong. Lirika melihat lampu menyala.","th":"ปาติวิ่งไปยังเวทีว่าง ลิริกะเห็นไฟที่ยังเปิดอยู่","ja":"パティは誰もいないステージへ。リリカは灯りに気づく。"},[[2,{"pt":"Se for uma surpresa, eu quero estar na primeira fila!","en":"If it's a surprise, I want a front-row seat!","es":"¡Si es una sorpresa, quiero estar en primera fila!","id":"Kalau ini kejutan, aku mau duduk paling depan!","th":"ถ้าเป็นเซอร์ไพรส์ ฉันขอแถวหน้าเลย!","ja":"サプライズなら最前列がいい！"}],[1,{"pt":"Espera... tem outra carta ali.","en":"Wait... there's another envelope.","es":"Espera... hay otro sobre.","id":"Tunggu... ada amplop lain.","th":"เดี๋ยว... มีจดหมายอีกซอง","ja":"待って…もう一通あるよ。"}]]],["palco",[[0,"coracao"],[1,"v"],[2,"tchau"]],{"pt":"A segunda carta diz: 'Tragam uma lembrança. Segunda-feira nos vemos aqui.'","en":"The second note reads: 'Bring a memory. See you here on Monday.'","es":"La segunda nota dice: «Traigan un recuerdo. Nos vemos aquí el lunes».","id":"Surat kedua berbunyi: 'Bawa satu kenangan. Sampai jumpa di sini hari Senin.'","th":"จดหมายฉบับที่สองเขียนว่า 'นำความทรงจำมาด้วย แล้วพบกันที่นี่วันจันทร์'","ja":"二通目には「思い出を持って、月曜日にここで会おう」と。"},[[0,{"pt":"Combinado. Mas quem está preparando isso?","en":"Deal. But who's planning all this?","es":"De acuerdo. Pero ¿quién está preparando todo esto?","id":"Setuju. Tapi siapa yang merencanakan semua ini?","th":"ตกลง! แต่ใครเป็นคนเตรียมทั้งหมดนี้นะ?","ja":"約束だね。でも誰が準備してるんだろう？"}]]]]};
/* Episódio 2: conteúdo editorial privado, sem integração pública. */
var JN_T1_EP2 = {"id":"ensaio-impossivel","title":{"pt":"O Ensaio Impossível","en":"The Impossible Rehearsal","es":"El ensayo imposible","id":"Latihan Mustahil","th":"การซ้อมที่เป็นไปไม่ได้","ja":"大騒ぎのリハーサル"},"panels":[["basico",[[0,"mic"],[1,"v"],[2,"banzai"]],{"pt":"Na segunda-feira, os três chegam ao camarim com lembranças do primeiro ensaio.","en":"On Monday, the three arrive with memories of their first rehearsal.","es":"El lunes, los tres llegan con recuerdos de su primer ensayo.","id":"Hari Senin, mereka bertiga datang membawa kenangan latihan pertama.","th":"วันจันทร์ ทั้งสามนำความทรงจำจากการซ้อมครั้งแรกมาที่ห้องแต่งตัว","ja":"月曜日、三人は初めての練習の思い出を楽屋へ持ってきた。"},[[0,{"pt":"Eu trouxe a lista de passos. Hoje nada vai sair errado!","en":"I brought the step list. Nothing will go wrong today!","es":"Traje la lista de pasos. ¡Hoy nada saldrá mal!","id":"Aku bawa daftar gerakan. Hari ini pasti lancar!","th":"ฉันเอารายการท่าเต้นมาแล้ว วันนี้ต้องไม่มีพลาด!","ja":"振り付けリストを持ってきたよ。今日は完璧にする！"}]]],["basico",[[2,"tchau"],[1,"coracao"]],{"pt":"Pati tira do bolso um pequeno sino. Lirika traz uma foto antiga.","en":"Pati pulls a tiny bell from his pocket. Lirika brings an old photo.","es":"Pati saca una campanita del bolsillo. Lirika trae una foto antigua.","id":"Pati mengeluarkan lonceng kecil. Lirika membawa foto lama.","th":"ปาติหยิบกระดิ่งเล็ก ๆ ออกมา ลิริกะนำรูปเก่ามาด้วย","ja":"パティは小さな鈴を、リリカは古い写真を取り出した。"},[[2,{"pt":"Meu amuleto da sorte! Ele toca quando eu erro o passo.","en":"My lucky charm! It rings when I miss a step.","es":"¡Mi amuleto! Suena cuando me equivoco de paso.","id":"Jimat keberuntunganku! Bunyinya kalau aku salah langkah.","th":"เครื่องรางนำโชคของฉัน! มันดังเวลาฉันเต้นผิดท่า","ja":"僕のお守り！ステップを間違えると鳴るんだ。"}],[1,{"pt":"Então hoje vamos ouvir muito esse sino?","en":"So we'll hear that bell a lot today?","es":"¿Entonces hoy lo oiremos muchas veces?","id":"Berarti hari ini bakal sering berbunyi?","th":"งั้นวันนี้คงได้ยินบ่อยเลยสินะ?","ja":"じゃあ今日は何回も鳴るかな？"}]]],["palco",[[0,"mic"],[1,"v"],[2,"banzai"]],{"pt":"O ensaio começa. Tsu conta os tempos, mas o sino toca antes da música.","en":"Rehearsal begins. Tsu counts the beats, but the bell rings before the music.","es":"Empieza el ensayo. Tsu cuenta los tiempos, pero la campana suena antes de la música.","id":"Latihan dimulai. Tsu menghitung ketukan, tetapi lonceng berbunyi lebih dulu.","th":"เริ่มซ้อมแล้ว Tsu นับจังหวะ แต่กระดิ่งดังขึ้นก่อนเพลง","ja":"練習開始。Tsuが拍子を数える前に、鈴が鳴ってしまう。"},[[0,{"pt":"Cinco, seis, sete... Pati! Ainda nem começamos!","en":"Five, six, seven... Pati! We haven't even started!","es":"Cinco, seis, siete... ¡Pati! ¡Ni empezamos!","id":"Lima, enam, tujuh... Pati! Kita belum mulai!","th":"ห้า หก เจ็ด... ปาติ! เรายังไม่เริ่มเลย!","ja":"五、六、七…パティ！まだ始まってないよ！"}],[2,{"pt":"Foi o aquecimento do sino!","en":"The bell was warming up!","es":"¡Era el calentamiento de la campana!","id":"Loncengnya lagi pemanasan!","th":"กระดิ่งกำลังวอร์มอัปน่ะ!","ja":"鈴もウォーミングアップしてたんだ！"}]]],["noite",[[1,"mic"],[0,"coracao"]],{"pt":"Entre risadas, Lirika observa a fotografia: há uma estrela lilás no canto.","en":"Between laughs, Lirika notices a lilac star in the photo's corner.","es":"Entre risas, Lirika ve una estrella lila en la esquina de la foto.","id":"Di tengah tawa, Lirika melihat bintang ungu di sudut foto.","th":"ระหว่างเสียงหัวเราะ ลิริกะเห็นดาวสีม่วงที่มุมรูป","ja":"笑いながら、リリカは写真の隅の薄紫の星に気づく。"},[[1,{"pt":"Olhem! É a mesma estrela das cartas.","en":"Look! It's the same star from the letters.","es":"¡Miren! Es la misma estrella de las cartas.","id":"Lihat! Bintangnya sama seperti di surat.","th":"ดูสิ! ดาวดวงเดียวกับในจดหมายเลย","ja":"見て！手紙と同じ星だよ。"}],[0,{"pt":"Então alguém estava lá naquele dia...","en":"Then someone was there that day...","es":"Entonces alguien estuvo allí aquel día...","id":"Berarti ada seseorang di sana hari itu...","th":"แสดงว่าวันนั้นมีใครบางคนอยู่ด้วย...","ja":"じゃあ、あの日そこに誰かいたんだ…"}]]],["palco",[[0,"v"],[1,"coracao"],[2,"tchau"]],{"pt":"Os três repetem o primeiro passo juntos. Atrás da foto aparece outra pista: 'Procurem a caixa azul'.","en":"They repeat their first step together. Behind the photo is another clue: 'Find the blue box'.","es":"Repiten juntos el primer paso. Detrás de la foto hay otra pista: «Busquen la caja azul».","id":"Mereka mengulang langkah pertama bersama. Di balik foto ada petunjuk: 'Cari kotak biru'.","th":"ทั้งสามเต้นท่าแรกด้วยกัน ด้านหลังรูปมีคำใบ้ว่า 'ตามหากล่องสีน้ำเงิน'","ja":"三人で最初のステップを踊る。写真の裏には「青い箱を探して」とあった。"},[[2,{"pt":"Caça ao tesouro confirmada! Mas... onde fica essa caixa?","en":"Treasure hunt confirmed! But... where's that box?","es":"¡Confirmado, es una búsqueda del tesoro! Pero... ¿dónde está la caja?","id":"Benar, ini perburuan harta karun! Tapi... kotaknya di mana?","th":"ยืนยันแล้วว่าล่าสมบัติ! แต่... กล่องอยู่ไหนล่ะ?","ja":"宝探し決定！でも…箱はどこ？"}],[1,{"pt":"Talvez a foto tenha mais respostas do que parece.","en":"Maybe this photo holds more answers than we think.","es":"Quizá esta foto tenga más respuestas de lo que parece.","id":"Mungkin foto ini menyimpan lebih banyak jawaban.","th":"รูปนี้อาจมีคำตอบมากกว่าที่คิดนะ","ja":"この写真、まだ秘密がありそう。"}]]]]};
/* Episódio 3: conteúdo editorial privado, sem integração pública. */
var JN_T1_EP3 = {"id":"lembranca-lirika","title":{"pt":"A Lembrança da Lirika","en":"Lirika's Memory","es":"El recuerdo de Lirika","id":"Kenangan Lirika","th":"ความทรงจำของลิริกะ","ja":"リリカの思い出"},"panels":[["basico",[[1,"coracao"],[0,"v"]],{"pt":"Lirika volta ao camarim com a fotografia. Uma pequena estrela lilás brilha no canto do papel.","en":"Lirika returns to the dressing room with the photo. A tiny lilac star shines in its corner.","es":"Lirika vuelve al camerino con la foto. Una pequeña estrella lila brilla en una esquina.","id":"Lirika kembali ke ruang ganti membawa foto. Bintang ungu kecil terlihat di sudutnya.","th":"ลิริกะกลับมาที่ห้องแต่งตัวพร้อมรูปถ่าย มีดาวสีม่วงเล็ก ๆ อยู่ตรงมุม","ja":"リリカは写真を持って楽屋に戻る。隅には小さな薄紫の星。"},[[1,{"pt":"Eu lembro desse dia. Eu estava tão nervosa que quase fui embora.","en":"I remember that day. I was so nervous I almost went home.","es":"Recuerdo ese día. Estaba tan nerviosa que casi me fui a casa.","id":"Aku ingat hari itu. Aku gugup sekali sampai hampir pulang.","th":"ฉันจำวันนั้นได้ ตื่นเต้นจนเกือบกลับบ้านเลย","ja":"あの日を覚えてる。緊張して帰りそうになったんだ。"}],[0,{"pt":"Mas você ficou. E cantou com a gente.","en":"But you stayed. And sang with us.","es":"Pero te quedaste. Y cantaste con nosotros.","id":"Tapi kamu tetap tinggal dan bernyanyi bersama kami.","th":"แต่เธอก็อยู่ต่อ แล้วร้องเพลงกับพวกเรา","ja":"でも残って、一緒に歌ってくれたよ。"}]]],["noite",[[1,"mic"],[2,"tchau"]],{"pt":"Ela se lembra do primeiro ensaio: o palco parecia enorme e as vozes tremiam.","en":"She remembers the first rehearsal: the stage felt huge, and their voices shook.","es":"Recuerda el primer ensayo: el escenario parecía enorme y les temblaban las voces.","id":"Ia teringat latihan pertama: panggung terasa besar dan suara mereka gemetar.","th":"เธอนึกถึงการซ้อมครั้งแรก เวทีดูกว้างใหญ่และเสียงของทุกคนสั่น","ja":"初めての練習。ステージは大きく、みんなの声は震えていた。"},[[2,{"pt":"Eu errei a entrada e inventei uma reverência!","en":"I missed my cue and improvised a bow!","es":"¡Me equivoqué de entrada e improvisé una reverencia!","id":"Aku salah masuk lalu pura-pura membungkuk!","th":"ฉันเข้าผิดจังหวะ เลยโค้งคำนับแก้เขิน!","ja":"出番を間違えて、とっさにお辞儀したんだ！"}],[1,{"pt":"E isso me fez rir. Foi quando consegui respirar.","en":"And that made me laugh. That's when I could breathe.","es":"Y me hiciste reír. Entonces pude respirar.","id":"Aku jadi tertawa. Saat itulah aku bisa bernapas lega.","th":"แล้วฉันก็หัวเราะ ตอนนั้นเองที่หายใจโล่งขึ้น","ja":"それで笑えたの。やっと息ができた気がした。"}]]],["palco",[[0,"coracao"],[1,"v"],[2,"banzai"]],{"pt":"Na lembrança, Tsu estende a mão. Os três dão um passo juntos, mesmo fora do ritmo.","en":"In her memory, Tsu reaches out. The three take a step together, even off beat.","es":"En su recuerdo, Tsu le tiende la mano. Los tres dan un paso juntos, aunque fuera de ritmo.","id":"Dalam ingatannya, Tsu mengulurkan tangan. Mereka melangkah bersama meski tidak seirama.","th":"ในความทรงจำ Tsu ยื่นมือให้ ทั้งสามก้าวพร้อมกันแม้ไม่ตรงจังหวะ","ja":"思い出の中でTsuが手を差し出す。リズムはずれても、三人で一歩踏み出した。"},[[0,{"pt":"Se errarmos, erramos juntos. Depois tentamos de novo.","en":"If we mess up, we do it together. Then we try again.","es":"Si nos equivocamos, será juntos. Luego lo intentamos otra vez.","id":"Kalau salah, kita salah bersama. Lalu coba lagi.","th":"ถ้าพลาดก็พลาดด้วยกัน แล้วค่อยลองใหม่","ja":"失敗するなら一緒に。またやり直せばいいよ。"}],[1,{"pt":"Foi ali que comecei a me sentir em casa.","en":"That's when I started to feel at home.","es":"Ahí fue cuando empecé a sentirme en casa.","id":"Saat itulah aku mulai merasa seperti di rumah.","th":"ตอนนั้นเองที่ฉันเริ่มรู้สึกเหมือนอยู่บ้าน","ja":"あのとき、ここが居場所だと思えたんだ。"}]]],["basico",[[1,"v"],[2,"coracao"]],{"pt":"De volta ao presente, Lirika vira a foto. Atrás da estrela há um pequeno desenho de uma caixa azul.","en":"Back in the present, Lirika turns the photo over. Behind the star is a sketch of a blue box.","es":"De vuelta al presente, Lirika da vuelta a la foto. Detrás de la estrella hay una caja azul dibujada.","id":"Kembali ke masa kini, Lirika membalik foto. Di balik bintang ada gambar kotak biru.","th":"กลับมาปัจจุบัน ลิริกะพลิกรูป เห็นภาพกล่องสีน้ำเงินเล็ก ๆ อยู่หลังดาว","ja":"現在に戻り、リリカが写真を裏返す。星の裏には青い箱の絵。"},[[1,{"pt":"A caixa azul... eu já vi uma igual perto do nosso antigo camarim.","en":"The blue box... I've seen one near our old dressing room.","es":"La caja azul... vi una igual cerca de nuestro antiguo camerino.","id":"Kotak biru itu... aku pernah melihatnya dekat ruang ganti lama kita.","th":"กล่องสีน้ำเงิน... ฉันเคยเห็นแบบนี้ใกล้ห้องแต่งตัวเก่า","ja":"青い箱…昔の楽屋の近くで見たことがある。"}],[2,{"pt":"Ótimo! Eu já estava procurando no lugar das meias.","en":"Great! I was already searching the sock drawer.","es":"¡Genial! Yo ya buscaba en el cajón de calcetines.","id":"Bagus! Aku tadi malah mencarinya di laci kaus kaki.","th":"ดีเลย! ฉันเกือบไปหาในลิ้นชักถุงเท้าแล้ว","ja":"よかった！靴下の引き出しを探すところだった！"}]]],["noite",[[0,"v"],[1,"coracao"],[2,"tchau"]],{"pt":"Ao lado do antigo camarim, uma caixa azul espera sob uma cortina. Dentro, algo faz um leve barulho.","en":"Beside the old dressing room, a blue box waits under a curtain. Something inside makes a faint sound.","es":"Junto al antiguo camerino hay una caja azul bajo una cortina. Algo suena suavemente dentro.","id":"Di dekat ruang ganti lama, ada kotak biru di bawah tirai. Terdengar suara pelan dari dalam.","th":"ข้างห้องแต่งตัวเก่ามีกล่องสีน้ำเงินอยู่ใต้ม่าน ข้างในมีเสียงเบา ๆ","ja":"昔の楽屋のそば、カーテンの下に青い箱が。中から小さな音がする。"},[[1,{"pt":"Seja o que for, vamos abrir juntos.","en":"Whatever it is, let's open it together.","es":"Sea lo que sea, abrámosla juntos.","id":"Apa pun isinya, ayo buka bersama.","th":"ไม่ว่าจะเป็นอะไร มาเปิดด้วยกันเถอะ","ja":"何が入っていても、一緒に開けよう。"}],[2,{"pt":"Se for outro sino, prometo não tocar antes da hora!","en":"If it's another bell, I promise not to ring it early!","es":"Si es otra campana, ¡prometo no tocarla antes de tiempo!","id":"Kalau lonceng lagi, aku janji tak membunyikannya terlalu cepat!","th":"ถ้าเป็นกระดิ่งอีก ฉันสัญญาว่าจะไม่เขย่าก่อนเวลา!","ja":"また鈴なら、今度は早く鳴らさないよ！"}]]]]};
/* Episódio 4: roteiro e arte preparados, sem integração pública. */
var JN_T1_EP4 = {"id":"plano-pati","title":{"pt":"O Grande Plano do Pati","en":"Pati's Big Plan","es":"El gran plan de Pati","id":"Rencana Besar Pati","th":"แผนใหญ่ของปาติ","ja":"パティの大作戦"},"panels":[["noite",[[2,"v"],[1,"coracao"],[0,"tchau"]],{"pt":"Pati levanta a tampa da caixa azul. Em vez de um tesouro, encontra fitas, três cartões e um pequeno gravador.","en":"Pati opens the blue box. Instead of treasure, he finds ribbons, three cards and a tiny recorder.","es":"Pati abre la caja azul. En vez de un tesoro, encuentra cintas, tres tarjetas y una grabadora pequeña.","id":"Pati membuka kotak biru. Bukan harta karun, melainkan pita, tiga kartu, dan perekam kecil.","th":"ปาติเปิดกล่องสีน้ำเงิน ข้างในไม่ใช่สมบัติ แต่มีริบบิ้น การ์ดสามใบ และเครื่องบันทึกเสียงเล็ก ๆ","ja":"パティが青い箱を開ける。宝物の代わりに、リボンと三枚のカード、小さな録音機が入っていた。"},[[2,{"pt":"Achei o tesouro! ...Ué, isso é material de decoração?","en":"Found the treasure! ...Wait, is this party decoration?","es":"¡Encontré el tesoro! ...¿Eh? ¿Son adornos para una fiesta?","id":"Harta karunnya ketemu! ...Lho, ini hiasan pesta?","th":"เจอสมบัติแล้ว! ...เอ๊ะ นี่ของตกแต่งงานเลี้ยงเหรอ?","ja":"宝物発見！…あれ、パーティーの飾り？"}],[1,{"pt":"Olha os cartões. Tem um para cada um de nós.","en":"Look at the cards. There's one for each of us.","es":"Miren las tarjetas. Hay una para cada uno.","id":"Lihat kartunya. Ada satu untuk kita masing-masing.","th":"ดูการ์ดสิ มีของพวกเราคนละใบเลย","ja":"カードを見て。一人一枚ずつあるよ。"}]]],["basico",[[2,"banzai"],[0,"v"]],{"pt":"No primeiro cartão está escrito: 'Preparem juntos um palco pequeno, como no começo'. Pati já tem um plano.","en":"The first card says: 'Build a small stage together, like at the beginning.' Pati already has a plan.","es":"La primera tarjeta dice: «Preparen juntos un escenario pequeño, como al principio». Pati ya tiene un plan.","id":"Kartu pertama berbunyi: 'Siapkan panggung kecil bersama, seperti dulu.' Pati langsung punya rencana.","th":"การ์ดใบแรกเขียนว่า 'ช่วยกันจัดเวทีเล็ก ๆ เหมือนตอนเริ่มต้น' ปาติมีแผนทันที","ja":"一枚目には「最初の頃のように、小さなステージを三人で作ろう」とある。パティはひらめいた。"},[[2,{"pt":"Eu cuido de tudo! Um palco surpresa com luzes, fitas e... um sino!","en":"I'll handle everything! A surprise stage with lights, ribbons and... a bell!","es":"¡Yo me encargo! ¡Un escenario sorpresa con luces, cintas y... una campana!","id":"Biar aku urus! Panggung kejutan dengan lampu, pita, dan... lonceng!","th":"ฉันจัดการเอง! เวทีเซอร์ไพรส์พร้อมไฟ ริบบิ้น แล้วก็... กระดิ่ง!","ja":"僕に任せて！ライトとリボンと…鈴もつけよう！"}],[0,{"pt":"Um sino? De novo?","en":"A bell? Again?","es":"¿Una campana? ¿Otra vez?","id":"Lonceng? Lagi?","th":"กระดิ่งอีกแล้วเหรอ?","ja":"鈴？また？"}]]],["palco",[[2,"mic"],[0,"tchau"],[1,"v"]],{"pt":"Pati tenta pendurar as fitas sozinho. Uma cai sobre a cabeça de Tsu, e a outra prende o microfone.","en":"Pati tries hanging the ribbons alone. One lands on Tsu's head; another tangles the microphone.","es":"Pati intenta colgar las cintas solo. Una cae sobre Tsu y otra se enreda en el micrófono.","id":"Pati mencoba memasang pita sendirian. Satu jatuh di kepala Tsu, satu lagi melilit mikrofon.","th":"ปาติพยายามแขวนริบบิ้นคนเดียว เส้นหนึ่งตกใส่หัว Tsu อีกเส้นพันไมโครโฟน","ja":"パティが一人でリボンを飾ると、一本はTsuの頭に、もう一本はマイクに絡まった。"},[[0,{"pt":"Pati, eu virei parte da decoração!","en":"Pati, I've become part of the decorations!","es":"¡Pati, ahora soy parte de la decoración!","id":"Pati, aku malah jadi hiasan!","th":"ปาติ ฉันกลายเป็นของตกแต่งแล้ว!","ja":"パティ、僕まで飾りになっちゃった！"}],[2,{"pt":"É... uma instalação artística!","en":"It's... modern art!","es":"Es... ¡arte moderno!","id":"Itu... seni modern!","th":"นี่มัน... ศิลปะสมัยใหม่!","ja":"こ、これは現代アートだよ！"}]]],["basico",[[1,"coracao"],[2,"v"],[0,"mic"]],{"pt":"Lirika sugere dividir as tarefas. Tsu organiza o espaço, Pati monta os enfeites e ela testa o gravador.","en":"Lirika suggests sharing the work. Tsu organizes the space, Pati arranges the decorations and she tests the recorder.","es":"Lirika propone repartir las tareas. Tsu organiza el espacio, Pati pone los adornos y ella prueba la grabadora.","id":"Lirika mengajak berbagi tugas. Tsu mengatur tempat, Pati menghias, dan ia memeriksa perekam.","th":"ลิริกะแนะนำให้แบ่งหน้าที่ Tsu จัดพื้นที่ ปาติตกแต่ง และเธอลองเครื่องบันทึกเสียง","ja":"リリカは役割分担を提案。Tsuが場所を整え、パティが飾り、リリカが録音機を試す。"},[[1,{"pt":"Se fizermos juntos, vai ficar com a nossa cara.","en":"If we do it together, it'll feel like us.","es":"Si lo hacemos juntos, tendrá nuestro estilo.","id":"Kalau kita kerjakan bersama, hasilnya pasti khas kita.","th":"ถ้าทำด้วยกัน มันจะเป็นเวทีในแบบของเรา","ja":"一緒に作れば、私たちらしいステージになるよ。"}],[2,{"pt":"Tá bom. Eu aceito ajuda... só não mexam no meu sino!","en":"Okay. I'll accept help... just don't touch my bell!","es":"Está bien. Acepto ayuda... ¡pero no toquen mi campana!","id":"Baiklah. Aku terima bantuan... asal jangan sentuh loncengku!","th":"ก็ได้ ฉันยอมให้ช่วย... แต่อย่าแตะกระดิ่งนะ!","ja":"わかった、手伝って！でも鈴だけは触らないで！"}]]],["palco",[[0,"v"],[1,"mic"],[2,"coracao"]],{"pt":"O pequeno palco fica pronto. Ao apertar o gravador, ouvem três vozes antigas dizendo: 'Quando as luzes apagarem, lembrem-se de brilhar juntos'.","en":"The little stage is ready. The recorder plays three old voices: 'When the lights go out, remember to shine together.'","es":"El pequeño escenario está listo. La grabadora reproduce tres voces antiguas: «Cuando se apaguen las luces, recuerden brillar juntos».","id":"Panggung kecil selesai. Perekam memutar tiga suara lama: 'Saat lampu padam, ingatlah untuk bersinar bersama.'","th":"เวทีเล็กเสร็จแล้ว เครื่องบันทึกเปิดเสียงเก่าสามเสียงว่า 'เมื่อไฟดับ อย่าลืมเปล่งประกายไปด้วยกัน'","ja":"小さなステージが完成。録音機から昔の三人の声が流れる。「灯りが消えても、一緒に輝こう」"},[[0,{"pt":"Essa gravação é nossa... mas quem guardou tudo isso?","en":"Those are our voices... but who kept all this?","es":"Son nuestras voces... pero ¿quién guardó todo esto?","id":"Itu suara kita... tapi siapa yang menyimpan semuanya?","th":"นั่นเสียงของพวกเรา... แต่ใครเก็บมันไว้กันนะ?","ja":"これ、僕たちの声だ…でも誰が残してくれたんだろう？"}],[2,{"pt":"Eu tenho um plano para descobrir. Só preciso de uma lanterna!","en":"I've got a plan to find out. I just need a flashlight!","es":"Tengo un plan para averiguarlo. ¡Solo necesito una linterna!","id":"Aku punya rencana untuk mencari tahu. Tinggal butuh senter!","th":"ฉันมีแผนหาคำตอบ ขอแค่ไฟฉาย!","ja":"確かめる作戦があるよ。懐中電灯だけ貸して！"}]]]]};
function jnT1Ep4Texto(lang){
 var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
 return {titulo:JN_T1_EP4.title[idioma],quadros:JN_T1_EP4.panels.map(function(p,i){
  return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
 })};
}
function jnT1Ep4Desenhar(canvas,indice){
 if(!canvas || indice<0 || indice>=JN_T1_EP4.panels.length) return false;
 jnCapDesenhar(canvas,JN_T1_EP4.panels[indice]);
 return true;
}
function jnT1Ep4Html(){
 if(!jnT1Disponivel(3)) return '';
 var t=jnT1Ep4Texto(jnCapL());
 return '<section class="jn-t1" aria-label="'+escHtml(t.titulo)+'"><h4>'+escHtml(t.titulo)+'</h4>'+
 t.quadros.map(function(q){return '<figure><canvas width="480" height="320" role="img" aria-label="'+escHtml(q.narracao)+'"></canvas><figcaption><p>'+escHtml(q.narracao)+'</p>'+
 q.falas.map(function(f){return '<p><strong>'+escHtml(f.personagem)+':</strong> '+escHtml(f.texto)+'</p>';}).join('')+'</figcaption></figure>';}).join('')+'</section>';
}
function jnT1Ep3Texto(lang){
 var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
 return {titulo:JN_T1_EP3.title[idioma],quadros:JN_T1_EP3.panels.map(function(p,i){
  return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
 })};
}
function jnT1Ep3Desenhar(canvas,indice){
 if(!canvas || indice<0 || indice>=JN_T1_EP3.panels.length) return false;
 jnCapDesenhar(canvas,JN_T1_EP3.panels[indice]);
 return true;
}
function jnT1Ep3Html(){
 if(!jnT1Disponivel(2)) return '';
 var t=jnT1Ep3Texto(jnCapL());
 return '<section class="jn-t1" aria-label="'+escHtml(t.titulo)+'"><h4>'+escHtml(t.titulo)+'</h4>'+
 t.quadros.map(function(q){return '<figure><canvas width="480" height="320" role="img" aria-label="'+escHtml(q.narracao)+'"></canvas><figcaption><p>'+escHtml(q.narracao)+'</p>'+
 q.falas.map(function(f){return '<p><strong>'+escHtml(f.personagem)+':</strong> '+escHtml(f.texto)+'</p>';}).join('')+'</figcaption></figure>';}).join('')+'</section>';
}
function jnT1Ep2Texto(lang){
 var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
 return {titulo:JN_T1_EP2.title[idioma],quadros:JN_T1_EP2.panels.map(function(p,i){
  return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
 })};
}
function jnT1Ep2Desenhar(canvas,indice){
 if(!canvas || indice<0 || indice>=JN_T1_EP2.panels.length) return false;
 jnCapDesenhar(canvas,JN_T1_EP2.panels[indice]);
 return true;
}
function jnT1Ep2Html(){
 if(!jnT1Disponivel(1)) return '';
 var t=jnT1Ep2Texto(jnCapL());
 return '<section class="jn-t1" aria-label="'+escHtml(t.titulo)+'"><h4>'+escHtml(t.titulo)+'</h4>'+
 t.quadros.map(function(q){return '<figure><canvas width="480" height="320" role="img" aria-label="'+escHtml(q.narracao)+'"></canvas><figcaption><p>'+escHtml(q.narracao)+'</p>'+
 q.falas.map(function(f){return '<p><strong>'+escHtml(f.personagem)+':</strong> '+escHtml(f.texto)+'</p>';}).join('')+'</figcaption></figure>';}).join('')+'</section>';
}
function jnT1PilotoTexto(lang){
  var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
  return {titulo:JN_T1_PILOTO.title[idioma],quadros:JN_T1_PILOTO.panels.map(function(p,i){
    return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
  })};
}
function jnT1PilotoDesenhar(canvas,indice){
  // Reutiliza fundo, avatares oficiais e o renderer estático existente.
  if(!canvas || indice<0 || indice>=JN_T1_PILOTO.panels.length) return false;
  var p=JN_T1_PILOTO.panels[indice];
  jnCapDesenhar(canvas,p);
  return true;
}
function jnT1PilotoHtml(){
  // Não chamar até a publicação editorial da temporada estar autorizada.
  if(!jnT1Disponivel(0)) return '';
  var t=jnT1PilotoTexto(jnCapL());
  return '<section class="jn-t1" aria-label="'+escHtml(t.titulo)+'"><h4>'+escHtml(t.titulo)+'</h4>'+
    t.quadros.map(function(q){
      return '<figure><canvas width="480" height="320" role="img" aria-label="'+escHtml(q.narracao)+'"></canvas><figcaption><p>'+escHtml(q.narracao)+'</p>'+
      q.falas.map(function(f){return '<p><strong>'+escHtml(f.personagem)+':</strong> '+escHtml(f.texto)+'</p>';}).join('')+'</figcaption></figure>';
    }).join('')+'</section>';
}
var jnCapSel = -1;
function jnCapL(){ return (typeof LANG === 'string' && /^(pt|en|es|id|th|ja)$/.test(LANG)) ? LANG : 'pt'; }
function jnCapT(o, n){ var s = o ? (o[jnCapL()] || o.pt) : ''; return n != null ? s.replace('{n}', n).replace('{d}', n) : s; }
function jnCapData(i){ return new Date(JN_CAPS_INICIO + i * 7 * 864e5).toISOString().slice(0, 10); }   // terças-feiras
function jnCapsLiberados(){   // quantos capítulos já chegaram (horário de Brasília)
  var hoje = new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10), n = 0;
  for(var i = 0; i < JN_CAPS.length; i++) if(jnCapData(i) <= hoje) n = i + 1;
  return n;
}
function jornalCapsHtml(){
  return '<section class="jnbloco jncaps"><h4>📚 ' + escHtml(jnCapT(JN_CAPS_TX.sec)) + '</h4><p class="jndiariodica">' + escHtml(jnCapT(JN_CAPS_TX.dica)) + '</p><div id="jornalCaps"></div></section>';
}
function jornalCapsUI(){
  var box = typeof document !== 'undefined' && document.getElementById('jornalCaps'); if(!box) return;
  var lib = jnCapsLiberados(); if(jnCapSel < 0 || jnCapSel >= lib) jnCapSel = Math.max(0, lib - 1);
  var abas = JN_CAPS.map(function(c, i){
    var ok = i < lib, d = jnCapData(i);
    return '<button type="button" class="jncapaba' + (i === jnCapSel ? ' jncapon' : '') + '" data-jncap="' + i + '"' + (ok ? '' : ' disabled') + (i === jnCapSel ? ' aria-pressed="true"' : '') +
      ' aria-label="' + escHtml(jnCapT(JN_CAPS_TX.cap, i + 1) + ' · ' + (ok ? jnCapT(c[0]) : jnCapT(JN_CAPS_TX.em, d.slice(8) + '/' + d.slice(5, 7)))) + '"><b>' + escHtml(jnCapT(JN_CAPS_TX.cap, i + 1)) + '</b>' +
      (ok ? (i === lib - 1 ? '<em>' + escHtml(jnCapT(JN_CAPS_TX.novo)) + '</em>' : '') : '<small>🔒 ' + d.slice(8) + '/' + d.slice(5, 7) + '</small>') + '</button>';
  }).join('');
  var c = JN_CAPS[jnCapSel], q = c ? c[2] : [];
  box.innerHTML = '<div class="jncapabas">' + abas + '</div>' + (c ? '<h5 class="jncaptit">' + escHtml(jnCapT(c[0])) + ' <small translate="no">' + escHtml(c[1]) + '</small></h5>' +
    '<div class="jncapquadros">' + q.map(function(p, k){
      var alt = (p[2] ? jnCapT(p[2]) + ' ' : '') + p[3].map(function(f){ return ['Tsu', 'Lirika', 'Pati'][f[0]] + ': ' + jnCapT(f[1]); }).join(' ');
      return '<figure class="jncapq"><canvas width="480" height="320" role="img" aria-label="' + escHtml(jnCapT(JN_CAPS_TX.quadro, k + 1) + ': ' + alt) + '"></canvas></figure>';
    }).join('') + '</div>' : '');
  [].forEach.call(box.querySelectorAll('[data-jncap]'), function(b){ b.addEventListener('click', function(){ jnCapSel = +b.getAttribute('data-jncap'); if(typeof beep === 'function') try{ beep(988, .05, 'triangle', .04); }catch(e){} jornalCapsUI(); }); });
  [].forEach.call(box.querySelectorAll('.jncapq canvas'), function(cv, k){ try{ jnCapDesenhar(cv, q[k]); }catch(e){} });
}
function jnCapAv(k, pose){   // o boneco oficial do membro (os mesmos do banner do início)
  if(typeof HUB_TRIO === 'undefined' || typeof HUB_TRIO_DRAW_CHARS === 'undefined' || typeof CH === 'undefined' || !HUB_TRIO[k]) return null;
  var m = HUB_TRIO[k], c = JSON.parse(JSON.stringify(HUB_TRIO_DRAW_CHARS[k])), base = CH[m[0]];
  if(base){ c.out = base.out; c.outcol = base.outcol; }
  return {c:c, pose:pose || '', expr:m[4]};
}
function jnCapDesenhar(cv, p){
  var x = cv.getContext('2d'), W = cv.width, H = cv.height, cor = ['#9b30d9', '#3cb043', '#4169e1'];
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  function rr(a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function linhas(txt, larg){ var ps = String(txt).split(' '), L = [], at = ''; ps.forEach(function(w){ var t = at ? at + ' ' + w : w; if(x.measureText(t).width > larg && at){ L.push(at); at = w; } else at = t; }); if(at) L.push(at); return L; }
  x.save(); rr(0, 0, W, H, 22); x.clip();
  try{ if(typeof perfFundo === 'function') perfFundo(x, W, H, p[0], '#ff6fb5', 0); else throw 0; }catch(e){ var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f3e9ff'); g.addColorStop(1, '#ffe6f4'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  var gente = p[1], n = gente.length, ES = n === 1 ? 2.2 : n === 2 ? 1.95 : 1.65, xs = n === 1 ? [.5] : n === 2 ? [.3, .7] : [.2, .5, .8], chao = H - 6, onde = {};
  gente.forEach(function(g, i){
    var av = jnCapAv(g[0], g[1]); if(!av) return; var cx = xs[i] * W; onde[g[0]] = cx;
    x.fillStyle = 'rgba(40,10,70,.16)'; x.beginPath(); x.ellipse(cx, chao - 4, 30 * ES / 1.6, 6, 0, 0, 7); x.fill();
    x.save(); x.translate(cx - 52 * ES, chao - 112 * ES + 8); x.scale(ES, ES);
    try{ if(typeof perfDesenharIdol === 'function') perfDesenharIdol(x, 104, 112, av, false, false, 30 + i * 17); }catch(e){}
    x.restore();
  });
  var topoFala = p[2] ? 64 : 14;
  if(p[2]){   // narração: caixinha amarela no canto, como nos mangás
    x.font = '800 15px "M PLUS Rounded 1c",sans-serif'; var nl = linhas(jnCapT(p[2]), W - 60), nh = nl.length * 19 + 14;
    rr(10, 10, W - 20, nh, 10); x.fillStyle = '#fff6c4'; x.fill(); x.strokeStyle = '#3c2a6a'; x.lineWidth = 2.5; x.stroke();
    x.fillStyle = '#3c2a6a'; x.textAlign = 'left'; x.textBaseline = 'top'; nl.forEach(function(l, k){ x.fillText(l, 22, 17 + k * 19); });
    topoFala = 10 + nh + 10;
  }
  p[3].forEach(function(f, i){   // balões de fala com rabinho apontando para quem fala
    var cx = onde[f[0]] != null ? onde[f[0]] : W / 2;
    x.font = '800 16px "M PLUS Rounded 1c",sans-serif'; var bl = linhas(jnCapT(f[1]), 190), bw = Math.max.apply(null, bl.map(function(l){ return x.measureText(l).width; })) + 26, bh = bl.length * 20 + 14;
    var bx = Math.max(8, Math.min(W - bw - 8, cx - bw / 2 + (p[3].length > 1 ? (i ? 30 : -30) : 0))), by = topoFala + (p[3].length > 1 && i ? 8 : 0);
    if(p[3].length > 1 && i) by = topoFala + 6;
    rr(bx, by, bw, bh, 16); x.fillStyle = '#fff'; x.fill(); x.strokeStyle = cor[f[0]]; x.lineWidth = 3; x.stroke();
    var tx = Math.max(bx + 18, Math.min(bx + bw - 18, cx));
    x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx - 9, by + bh - 2); x.lineTo(tx + (cx > tx ? 10 : cx < tx ? -10 : 0), by + bh + 16); x.lineTo(tx + 9, by + bh - 2); x.closePath(); x.fill();
    x.strokeStyle = cor[f[0]]; x.beginPath(); x.moveTo(tx - 9, by + bh); x.lineTo(tx + (cx > tx ? 10 : cx < tx ? -10 : 0), by + bh + 16); x.lineTo(tx + 9, by + bh); x.stroke();
    x.fillStyle = '#3c2a6a'; x.textAlign = 'center'; x.textBaseline = 'top'; bl.forEach(function(l, k){ x.fillText(l, bx + bw / 2, by + 8 + k * 20); });
  });
  x.restore();
  x.strokeStyle = '#3c2a6a'; x.lineWidth = 4; rr(2, 2, W - 4, H - 4, 20); x.stroke();
}
