/* Idol⭐News! — "História em capítulos": quadrinhos curtos do TsuLiPa (Tsu, Lirika e Pati), desenhados no Canvas
   com os mesmos bonecos do jogo. Inspirados na história real do trio no BRS48 (Draft 1st Generation, ago/2021, e as
   músicas da unit TsuLiPa em cada Unit Festival); as falas são de brincadeira. Um capítulo novo todo domingo,
   a partir da estreia junto com o Calendário (15/11/2026). Só leitura: nada vai para o servidor. */
var JN_CAPS_INICIO = Date.UTC(2026, 10, 15);   // estreia junto com o Calendário
var JN_CAPS_TX = {
  sec:{pt:'História em capítulos',en:'Story in chapters',es:'Historia en capítulos',id:'Cerita bersambung',th:'เรื่องราวเป็นตอน',ja:'連載ストーリー'},
  dica:{pt:'Quadrinhos do TsuLiPa inspirados na história real do trio; as falas são de brincadeira. Capítulo novo todo domingo!',en:"TsuLiPa comics inspired by the trio's real story; the lines are just for fun. A new chapter every Sunday!",es:'Cómics de TsuLiPa inspirados en la historia real del trío; los diálogos son de broma. ¡Capítulo nuevo cada domingo!',id:'Komik TsuLiPa yang terinspirasi kisah nyata trio ini; dialognya cuma bercanda. Bab baru setiap Minggu!',th:'การ์ตูน TsuLiPa จากเรื่องจริงของทั้งสาม บทพูดเป็นแค่ความสนุก ตอนใหม่ทุกวันอาทิตย์!',ja:'TsuLiPaの実話から生まれたマンガ（セリフはお遊び）。毎週日曜に新しい話！'},
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
    ['ceu', [[1, 'tchau']], {pt:'Dois verões, duas músicas: Secret Base e Splash Dream.',en:'Two summers, two songs: Secret Base and Splash Dream.',es:'Dos veranos, dos canciones: Secret Base y Splash Dream.',id:'Dua musim panas, dua lagu: Secret Base dan Splash Dream.',th:'สองฤดูร้อน สองเพลง: Secret Base และ Splash Dream',ja:'ふたつの夏、Secret BaseとSplash Dream。'},
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
    {id:'convite-misterioso',data:'2026-12-27',pronto:false},
    {id:'ensaio-impossivel',data:'2027-01-03',pronto:false},
    {id:'lembranca-lirika',data:'2027-01-10',pronto:false},
    {id:'plano-pati',data:'2027-01-17',pronto:false},
    {id:'quando-luz-apaga',data:'2027-01-24',pronto:false},
    {id:'palco-nosso',data:'2027-01-31',pronto:false}
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
var JN_T1_EP4 = {"id":"plano-pati","title":{"pt":"O Grande Plano do Pati","en":"Pati's Big Plan","es":"El gran plan de Pati","id":"Rencana Besar Pati","th":"แผนใหญ่ของปาติ","ja":"パティの大作戦"},"panels":[["noite",[[2,"v"],[1,"coracao"],[0,"tchau"]],{"pt":"Pati levanta a tampa da caixa azul. Em vez de um tesouro, encontra fitas, três cartões e um pequeno gravador.","en":"Pati opens the blue box. Instead of treasure, he finds ribbons, three cards and a tiny recorder.","es":"Pati abre la caja azul. En vez de un tesoro, encuentra cintas, tres tarjetas y una grabadora pequeña.","id":"Pati membuka kotak biru. Bukan harta karun, melainkan pita, tiga kartu, dan perekam kecil.","th":"ปาติเปิดกล่องสีน้ำเงิน ข้างในไม่ใช่สมบัติ แต่มีริบบิ้น การ์ดสามใบ และเครื่องบันทึกเสียงเล็ก ๆ","ja":"パティが青い箱を開ける。宝物の代わりに、リボンと三枚のカード、小さな録音機が入っていた。"},[[2,{"pt":"Achei o tesouro! ...Ué, isso é material de decoração?","en":"Found the treasure! ...Wait, is this party decoration?","es":"¡Encontré el tesoro! ...¿Eh? ¿Son adornos para una fiesta?","id":"Harta karunnya ketemu! ...Lho, ini hiasan pesta?","th":"เจอสมบัติแล้ว! ...เอ๊ะ นี่ของตกแต่งงานเลี้ยงเหรอ?","ja":"宝物発見！…あれ、パーティーの飾り？"}],[1,{"pt":"Olha os cartões. Tem um para cada um de nós.","en":"Look at the cards. There's one for each of us.","es":"Miren las tarjetas. Hay una para cada uno.","id":"Lihat kartunya. Ada satu untuk kita masing-masing.","th":"ดูการ์ดสิ มีของพวกเราคนละใบเลย","ja":"カードを見て。一人一枚ずつあるよ。"}]]],["basico",[[2,"banzai"],[0,"v"]],{"pt":"No primeiro cartão está escrito: 'Preparem juntos um palco pequeno, como no começo'. Pati já tem um plano.","en":"The first card says: 'Build a small stage together, like at the beginning.' Pati already has a plan.","es":"La primera tarjeta dice: «Preparen juntos un escenario pequeño, como al principio». Pati ya tiene un plan.","id":"Kartu pertama berbunyi: 'Siapkan panggung kecil bersama, seperti dulu.' Pati langsung punya rencana.","th":"การ์ดใบแรกเขียนว่า 'ช่วยกันจัดเวทีเล็ก ๆ เหมือนตอนเริ่มต้น' ปาติมีแผนทันที","ja":"一枚目には「最初の頃のように、小さなステージを三人で作ろう」とある。パティはひらめいた。"},[[2,{"pt":"Eu cuido de tudo! Um palco surpresa com luzes, fitas e... um sino!","en":"I'll handle everything! A surprise stage with lights, ribbons and... a bell!","es":"¡Yo me encargo! ¡Un escenario sorpresa con luces, cintas y... una campana!","id":"Biar aku urus! Panggung kejutan dengan lampu, pita, dan... lonceng!","th":"ฉันจัดการเอง! เวทีเซอร์ไพรส์พร้อมไฟ ริบบิ้น แล้วก็... กระดิ่ง!","ja":"僕に任せて！ライトとリボンと…鈴もつけよう！"}],[0,{"pt":"Um sino? De novo?","en":"A bell? Again?","es":"¿Una campana? ¿Otra vez?","id":"Lonceng? Lagi?","th":"กระดิ่งอีกแล้วเหรอ?","ja":"鈴をまた使うの？"}]]],["palco",[[2,"mic"],[0,"tchau"],[1,"v"]],{"pt":"Pati tenta pendurar as fitas sozinho. Uma cai sobre a cabeça de Tsu, e a outra prende o microfone.","en":"Pati tries hanging the ribbons alone. One lands on Tsu's head; another tangles the microphone.","es":"Pati intenta colgar las cintas solo. Una cae sobre Tsu y otra se enreda en el micrófono.","id":"Pati mencoba memasang pita sendirian. Satu jatuh di kepala Tsu, satu lagi melilit mikrofon.","th":"ปาติพยายามแขวนริบบิ้นคนเดียว เส้นหนึ่งตกใส่หัว Tsu อีกเส้นพันไมโครโฟน","ja":"パティが一人でリボンを飾ると、一本はTsuの頭に、もう一本はマイクに絡まった。"},[[0,{"pt":"Pati, eu virei parte da decoração!","en":"Pati, I've become part of the decorations!","es":"¡Pati, ahora soy parte de la decoración!","id":"Pati, aku malah jadi hiasan!","th":"ปาติ ฉันกลายเป็นของตกแต่งแล้ว!","ja":"パティ、僕まで飾りになっちゃった！"}],[2,{"pt":"É... uma instalação artística!","en":"It's... modern art!","es":"Es... ¡arte moderno!","id":"Itu... seni modern!","th":"นี่มัน... ศิลปะสมัยใหม่!","ja":"こ、これは現代アートだよ！"}]]],["basico",[[1,"coracao"],[2,"v"],[0,"mic"]],{"pt":"Lirika sugere dividir as tarefas. Tsu organiza o espaço, Pati monta os enfeites e ela testa o gravador.","en":"Lirika suggests sharing the work. Tsu organizes the space, Pati arranges the decorations and she tests the recorder.","es":"Lirika propone repartir las tareas. Tsu organiza el espacio, Pati pone los adornos y ella prueba la grabadora.","id":"Lirika mengajak berbagi tugas. Tsu mengatur tempat, Pati menghias, dan ia memeriksa perekam.","th":"ลิริกะแนะนำให้แบ่งหน้าที่ Tsu จัดพื้นที่ ปาติตกแต่ง และเธอลองเครื่องบันทึกเสียง","ja":"リリカは役割分担を提案。Tsuが場所を整え、パティが飾り、リリカが録音機を試す。"},[[1,{"pt":"Se fizermos juntos, vai ficar com a nossa cara.","en":"If we do it together, it'll feel like us.","es":"Si lo hacemos juntos, tendrá nuestro estilo.","id":"Kalau kita kerjakan bersama, hasilnya pasti khas kita.","th":"ถ้าทำด้วยกัน มันจะเป็นเวทีในแบบของเรา","ja":"一緒に作れば、私たちらしいステージになるよ。"}],[2,{"pt":"Tá bom. Eu aceito ajuda... só não mexam no meu sino!","en":"Okay. I'll accept help... just don't touch my bell!","es":"Está bien. Acepto ayuda... ¡pero no toquen mi campana!","id":"Baiklah. Aku terima bantuan... asal jangan sentuh loncengku!","th":"ก็ได้ ฉันยอมให้ช่วย... แต่อย่าแตะกระดิ่งนะ!","ja":"わかった、手伝って！でも鈴だけは触らないで！"}]]],["palco",[[0,"v"],[1,"mic"],[2,"coracao"]],{"pt":"O pequeno palco fica pronto. Ao apertar o gravador, ouvem três vozes antigas dizendo: 'Quando as luzes apagarem, lembrem-se de brilhar juntos'.","en":"The little stage is ready. The recorder plays three old voices: 'When the lights go out, remember to shine together.'","es":"El pequeño escenario está listo. La grabadora reproduce tres voces antiguas: «Cuando se apaguen las luces, recuerden brillar juntos».","id":"Panggung kecil selesai. Perekam memutar tiga suara lama: 'Saat lampu padam, ingatlah untuk bersinar bersama.'","th":"เวทีเล็กเสร็จแล้ว เครื่องบันทึกเปิดเสียงเก่าสามเสียงว่า 'เมื่อไฟดับ อย่าลืมเปล่งประกายไปด้วยกัน'","ja":"小さなステージが完成。録音機から昔の三人の声が流れる。「灯りが消えても、一緒に輝こう」"},[[0,{"pt":"Essa gravação é nossa... mas quem guardou tudo isso?","en":"Those are our voices... but who kept all this?","es":"Son nuestras voces... pero ¿quién guardó todo esto?","id":"Itu suara kita... tapi siapa yang menyimpan semuanya?","th":"นั่นเสียงของพวกเรา... แต่ใครเก็บมันไว้กันนะ?","ja":"これ、僕たちの声だ…でも誰が残してくれたんだろう？"}],[2,{"pt":"Eu tenho um plano para descobrir. Só preciso de uma lanterna!","en":"I've got a plan to find out. I just need a flashlight!","es":"Tengo un plan para averiguarlo. ¡Solo necesito una linterna!","id":"Aku punya rencana untuk mencari tahu. Tinggal butuh senter!","th":"ฉันมีแผนหาคำตอบ ขอแค่ไฟฉาย!","ja":"確かめる作戦があるよ。懐中電灯だけ貸して！"}]]]]};
/* Episódio 5: roteiro e arte privados, sem integração pública. */
var JN_T1_EP5 = {"id":"quando-luz-apaga","title":{"pt":"Quando a Luz Apaga","en":"When the Lights Go Out","es":"Cuando se apagan las luces","id":"Saat Lampu Padam","th":"เมื่อไฟดับ","ja":"灯りが消えるとき"},"panels":[["palco",[[0,"mic"],[1,"v"],[2,"tchau"]],{"pt":"O pequeno palco está pronto. Tsu segura o gravador enquanto Pati procura a lanterna para investigar a mensagem.","en":"The little stage is ready. Tsu holds the recorder while Pati looks for a flashlight to investigate the message.","es":"El pequeño escenario está listo. Tsu sostiene la grabadora mientras Pati busca una linterna para investigar el mensaje.","id":"Panggung kecil sudah siap. Tsu memegang perekam sementara Pati mencari senter untuk menyelidiki pesan.","th":"เวทีเล็กพร้อมแล้ว Tsu ถือเครื่องบันทึกเสียง ส่วนปาติกำลังหาไฟฉายเพื่อสืบเรื่องข้อความ","ja":"小さなステージが完成。Tsuは録音機を持ち、パティはメッセージの謎を調べる懐中電灯を探している。"},[[0,{"pt":"E se a gente não conseguir fazer esse palco brilhar?","en":"What if we can't make this stage shine?","es":"¿Y si no logramos hacer brillar este escenario?","id":"Bagaimana kalau kita gagal membuat panggung ini bersinar?","th":"ถ้าเราทำให้เวทีนี้เปล่งประกายไม่ได้ล่ะ?","ja":"もしこのステージを輝かせられなかったら？"}],[2,{"pt":"Eu trouxe a lanterna! Só não achei as pilhas.","en":"I found the flashlight! Just not the batteries.","es":"¡Encontré la linterna! Solo me faltan las pilas.","id":"Senternya ketemu! Baterainya saja belum.","th":"เจอไฟฉายแล้ว! แต่ยังหาถ่านไม่เจอ","ja":"懐中電灯は見つけた！電池はまだだけど。"}]]],["noite",[[0,"coracao"],[1,"tchau"]],{"pt":"De repente, as luzes do palco se apagam. O silêncio faz Tsu lembrar das vezes em que teve medo de decepcionar os amigos.","en":"Suddenly the stage lights go out. In the silence, Tsu remembers fearing he might let his friends down.","es":"De pronto se apagan las luces. En el silencio, Tsu recuerda el miedo a decepcionar a sus amigos.","id":"Tiba-tiba lampu panggung padam. Dalam keheningan, Tsu teringat rasa takut mengecewakan teman-temannya.","th":"ทันใดนั้นไฟเวทีก็ดับ ในความเงียบ Tsu นึกถึงความกลัวว่าจะทำให้เพื่อนผิดหวัง","ja":"突然ステージの灯りが消える。静けさの中、Tsuは仲間をがっかりさせる怖さを思い出す。"},[[0,{"pt":"Eu sempre tento deixar tudo perfeito... mas às vezes tenho medo de atrapalhar vocês.","en":"I try to make everything perfect... but sometimes I'm scared I'll hold you back.","es":"Siempre intento que todo salga perfecto... pero a veces temo ser un estorbo.","id":"Aku selalu ingin semuanya sempurna... tapi kadang takut menghambat kalian.","th":"ฉันพยายามทำทุกอย่างให้สมบูรณ์แบบ... แต่บางทีก็กลัวว่าจะเป็นภาระ","ja":"いつも完璧にしたいけど…二人の足を引っ張るのが怖いんだ。"}],[1,{"pt":"Você nunca precisou ser perfeito para estar aqui.","en":"You never had to be perfect to belong here.","es":"Nunca necesitaste ser perfecto para estar aquí.","id":"Kamu tak perlu sempurna untuk ada di sini.","th":"เธอไม่จำเป็นต้องสมบูรณ์แบบเพื่ออยู่ตรงนี้หรอก","ja":"ここにいるのに、完璧である必要なんてないよ。"}]]],["basico",[[2,"banzai"],[0,"v"],[1,"coracao"]],{"pt":"Pati encontra as pilhas no bolso da própria jaqueta. A lanterna acende e ilumina os três rostos.","en":"Pati finds the batteries in his own jacket pocket. The flashlight lights up their faces.","es":"Pati encuentra las pilas en el bolsillo de su chaqueta. La linterna ilumina sus rostros.","id":"Pati menemukan baterai di saku jaketnya sendiri. Senter menyinari wajah mereka.","th":"ปาติพบถ่านอยู่ในกระเป๋าเสื้อของตัวเอง ไฟฉายส่องใบหน้าของทั้งสาม","ja":"パティは自分の上着のポケットで電池を発見。懐中電灯が三人の顔を照らす。"},[[2,{"pt":"Pronto! O brilho oficial do nosso palco sou eu!","en":"There! I'm officially the stage lighting!","es":"¡Listo! ¡Yo soy la iluminación oficial del escenario!","id":"Nah! Akulah lampu resmi panggung kita!","th":"เรียบร้อย! ฉันนี่แหละไฟเวทีอย่างเป็นทางการ!","ja":"よし！今日の照明係は僕だ！"}],[0,{"pt":"Então ilumina o caminho. Eu vou com vocês.","en":"Then light the way. I'll go with you.","es":"Entonces ilumina el camino. Iré con ustedes.","id":"Kalau begitu, terangi jalannya. Aku ikut kalian.","th":"งั้นช่วยส่องทางนะ ฉันจะไปกับพวกเธอ","ja":"じゃあ道を照らして。一緒に行くよ。"}]]],["noite",[[1,"mic"],[0,"coracao"],[2,"v"]],{"pt":"Lirika reproduz o final da gravação. Depois das três vozes, ouve-se um clique e um trecho quase inaudível.","en":"Lirika replays the end of the recording. After their three voices comes a click and a barely audible phrase.","es":"Lirika reproduce el final de la grabación. Tras sus tres voces se oye un clic y una frase casi inaudible.","id":"Lirika memutar akhir rekaman. Setelah tiga suara mereka, terdengar klik dan kalimat yang nyaris tak terdengar.","th":"ลิริกะเปิดท้ายเสียงบันทึกอีกครั้ง หลังเสียงของทั้งสามมีเสียงคลิกและคำพูดเบามาก","ja":"リリカが録音の最後を再生する。三人の声のあとに、クリック音と小さな言葉が聞こえる。"},[[1,{"pt":"Esperem... alguém gravou mais uma frase: 'A resposta está onde vocês ficam juntos'.","en":"Wait... there's another phrase: 'The answer is where you stand together'.","es":"Esperen... hay otra frase: «La respuesta está donde están juntos».","id":"Tunggu... ada kalimat lain: 'Jawabannya ada di tempat kalian berdiri bersama'.","th":"เดี๋ยวก่อน... มีอีกประโยคว่า 'คำตอบอยู่ตรงที่พวกเธอยืนด้วยกัน'","ja":"待って…もう一言ある。「答えは三人が並ぶ場所にある」。"}],[2,{"pt":"No palco? Ou na fila da cantina?","en":"Onstage? Or in the cafeteria line?","es":"¿En el escenario? ¿O en la fila de la cafetería?","id":"Di panggung? Atau antrean kantin?","th":"บนเวที? หรือแถวโรงอาหาร?","ja":"ステージ？それとも食堂の列？"}]]],["palco",[[0,"v"],[1,"coracao"],[2,"tchau"]],{"pt":"Os três voltam ao centro do palco. Sob a estrela lilás desenhada no chão, encontram um envelope fechado, endereçado ao trio.","en":"They return to center stage. Beneath a lilac star on the floor lies a sealed envelope addressed to the trio.","es":"Regresan al centro del escenario. Bajo una estrella lila pintada en el suelo encuentran un sobre cerrado dirigido a los tres.","id":"Mereka kembali ke tengah panggung. Di bawah bintang ungu di lantai ada amplop tertutup untuk mereka bertiga.","th":"ทั้งสามกลับมากลางเวที ใต้ดาวสีม่วงบนพื้นมีซองจดหมายปิดผนึกจ่าหน้าถึงทั้งสาม","ja":"三人はステージの中央へ戻る。床の薄紫の星の下に、三人宛ての封筒が隠されていた。"},[[0,{"pt":"Agora eu quero abrir. Não porque está tudo perfeito, mas porque estamos juntos.","en":"Now I want to open it. Not because everything's perfect, but because we're together.","es":"Ahora quiero abrirlo. No porque todo sea perfecto, sino porque estamos juntos.","id":"Sekarang aku ingin membukanya. Bukan karena semuanya sempurna, tapi karena kita bersama.","th":"ตอนนี้ฉันอยากเปิดมัน ไม่ใช่เพราะทุกอย่างสมบูรณ์แบบ แต่เพราะเราอยู่ด้วยกัน","ja":"今なら開けたい。完璧だからじゃなくて、みんなが一緒だから。"}],[1,{"pt":"Então vamos descobrir juntos.","en":"Then let's find out together.","es":"Entonces descubramos la verdad juntos.","id":"Kalau begitu, ayo cari tahu bersama.","th":"งั้นมาหาคำตอบด้วยกันเถอะ","ja":"じゃあ、一緒に確かめよう。"}]]]]};
/* Episódio 6: final da temporada, privado até aprovação editorial. */
var JN_T1_EP6 = {"id":"palco-nosso","title":{"pt":"O Palco é Nosso","en":"The Stage Is Ours","es":"El escenario es nuestro","id":"Panggung Milik Kita","th":"เวทีนี้เป็นของเรา","ja":"ステージは私たちのもの"},"panels":[["palco",[[0,"v"],[1,"coracao"],[2,"tchau"]],{"pt":"No centro do palco, os três abrem o último envelope. Dentro há uma fotografia e uma carta assinada pela antiga equipe de bastidores.","en":"At center stage, they open the last envelope. Inside are a photograph and a letter signed by their former backstage crew.","es":"En el centro del escenario abren el último sobre. Dentro hay una foto y una carta firmada por su antiguo equipo de bastidores.","id":"Di tengah panggung, mereka membuka amplop terakhir. Ada foto dan surat bertanda tangan kru belakang panggung lama.","th":"กลางเวที ทั้งสามเปิดซองสุดท้าย ข้างในมีรูปถ่ายและจดหมายจากทีมงานเบื้องหลังในอดีต","ja":"ステージ中央で最後の封筒を開ける。中には写真と、昔の舞台裏スタッフからの手紙があった。"},[[1,{"pt":"Era a equipe que cuidava da gente nos primeiros ensaios!","en":"It's the crew who looked after us during our first rehearsals!","es":"¡Es el equipo que nos cuidaba en los primeros ensayos!","id":"Ini kru yang menjaga kita saat latihan pertama!","th":"นี่คือทีมงานที่ดูแลเราตอนซ้อมครั้งแรก!","ja":"初めての練習を支えてくれたスタッフさんたちだ！"}],[2,{"pt":"Então a caça ao tesouro era um presente?","en":"So the treasure hunt was a gift?","es":"¿Entonces la búsqueda del tesoro era un regalo?","id":"Jadi perburuan harta karun ini hadiah?","th":"งั้นการล่าสมบัตินี่คือของขวัญเหรอ?","ja":"じゃあ宝探しはプレゼントだったの？"}]]],["basico",[[1,"mic"],[0,"coracao"]],{"pt":"A carta explica: a equipe guardou a caixa azul com fitas, cartões e o gravador do primeiro ensaio. A estrela lilás era a marca desenhada naquele dia.","en":"The letter explains: the crew kept the blue box with ribbons, cards and a recording from their first rehearsal. The lilac star was their old hand-drawn mark.","es":"La carta explica que el equipo guardó la caja azul con cintas, tarjetas y la grabación del primer ensayo. La estrella lila era su dibujo de aquel día.","id":"Surat itu menjelaskan: kru menyimpan kotak biru berisi pita, kartu, dan rekaman latihan pertama. Bintang ungu adalah gambar mereka saat itu.","th":"จดหมายอธิบายว่าทีมงานเก็บกล่องสีน้ำเงินพร้อมริบบิ้น การ์ด และเสียงซ้อมครั้งแรก ดาวสีม่วงคือสัญลักษณ์ที่วาดไว้ในวันนั้น","ja":"手紙によると、スタッフは初練習のリボンやカード、録音を青い箱に保管していた。薄紫の星はあの日描いた印だった。"},[[0,{"pt":"Eles guardaram até a nossa promessa de brilhar juntos.","en":"They even kept our promise to shine together.","es":"Hasta guardaron nuestra promesa de brillar juntos.","id":"Mereka bahkan menyimpan janji kita untuk bersinar bersama.","th":"พวกเขาเก็บแม้แต่คำสัญญาที่เราจะเปล่งประกายด้วยกัน","ja":"一緒に輝こうって約束まで残してくれたんだ。"}],[1,{"pt":"E prepararam as pistas para a gente lembrar por quê.","en":"And made the clues so we'd remember why.","es":"Y prepararon las pistas para que recordáramos por qué.","id":"Mereka menyiapkan petunjuk agar kita ingat alasannya.","th":"และทำคำใบ้ให้เราจำได้ว่าทำไมถึงสัญญาไว้","ja":"思い出せるように、手がかりを用意してくれたんだね。"}]]],["noite",[[2,"banzai"],[1,"v"],[0,"tchau"]],{"pt":"Uma última linha da carta diz: 'O palco não precisa ser grande. O importante é que vocês o construam juntos'. Pati olha para as fitas tortas.","en":"The final line says: 'The stage needn't be big. What matters is building it together.' Pati eyes his crooked ribbons.","es":"La última línea dice: «El escenario no tiene que ser grande. Lo importante es construirlo juntos». Pati mira sus cintas torcidas.","id":"Baris terakhir berbunyi: 'Panggung tak harus besar. Yang penting kalian membangunnya bersama.' Pati melirik pita miringnya.","th":"บรรทัดสุดท้ายเขียนว่า 'เวทีไม่ต้องใหญ่ สิ่งสำคัญคือสร้างมันด้วยกัน' ปาติมองริบบิ้นที่แขวนเอียง","ja":"最後には「ステージは大きくなくていい。三人で作ることが大切」と。パティは曲がったリボンを見た。"},[[2,{"pt":"Então... minhas fitas tortas também contam como trabalho em equipe?","en":"So... do my crooked ribbons count as teamwork too?","es":"Entonces... ¿mis cintas torcidas también cuentan como trabajo en equipo?","id":"Jadi... pita miringku juga termasuk kerja sama?","th":"งั้น... ริบบิ้นที่เบี้ยวของฉันก็นับเป็นทีมเวิร์กใช่ไหม?","ja":"じゃあ…曲がったリボンもチームワークってこと？"}],[1,{"pt":"Contam. Mas amanhã vamos endireitar uma delas!","en":"They do. But tomorrow let's straighten at least one!","es":"Sí. ¡Pero mañana enderezamos al menos una!","id":"Iya. Tapi besok kita luruskan satu, ya!","th":"นับสิ แต่พรุ่งนี้มาจัดให้ตรงสักเส้นนะ!","ja":"もちろん。でも明日は一本くらい直そうね！"}]]],["palco",[[0,"mic"],[1,"coracao"],[2,"v"]],{"pt":"Tsu posiciona o gravador, Lirika segura a fotografia e Pati acende a lanterna. O pequeno palco se ilumina com a luz que eles têm.","en":"Tsu sets down the recorder, Lirika holds the photo and Pati switches on the flashlight. Their little stage glows with the light they have.","es":"Tsu coloca la grabadora, Lirika sostiene la foto y Pati enciende la linterna. Su pequeño escenario brilla con la luz que tienen.","id":"Tsu meletakkan perekam, Lirika memegang foto, dan Pati menyalakan senter. Panggung kecil bersinar dengan cahaya seadanya.","th":"Tsu วางเครื่องบันทึก ลิริกะถือรูป และปาติเปิดไฟฉาย เวทีเล็กสว่างด้วยแสงที่พวกเขามี","ja":"Tsuが録音機を置き、リリカが写真を持ち、パティが懐中電灯をつける。小さなステージに光が差す。"},[[0,{"pt":"Eu estava com medo de errar. Agora só quero cantar com vocês.","en":"I was afraid of messing up. Now I just want to sing with you.","es":"Tenía miedo de equivocarme. Ahora solo quiero cantar con ustedes.","id":"Aku takut salah. Sekarang aku hanya ingin bernyanyi bersama kalian.","th":"ฉันกลัวทำพลาด แต่ตอนนี้แค่อยากร้องเพลงกับพวกเธอ","ja":"失敗が怖かった。でも今は二人と歌いたい。"}],[2,{"pt":"E eu prometo tocar o sino só no final!","en":"And I promise to ring the bell only at the end!","es":"¡Y prometo tocar la campana solo al final!","id":"Aku janji membunyikan lonceng hanya di akhir!","th":"ฉันสัญญาว่าจะเขย่ากระดิ่งตอนจบเท่านั้น!","ja":"鈴は最後まで鳴らさないって約束する！"}]]],["palco",[[0,"v"],[1,"coracao"],[2,"banzai"]],{"pt":"Eles cantam juntos. Quando a música termina, o sino toca no tempo certo. Ao lado da caixa azul, a fotografia ganha um lugar de destaque.","en":"They sing together. When the song ends, the bell rings right on cue. The photograph finds a place of honor beside the blue box.","es":"Cantan juntos. Al terminar la canción, la campana suena justo a tiempo. La foto queda expuesta junto a la caja azul.","id":"Mereka bernyanyi bersama. Saat lagu berakhir, lonceng berbunyi tepat waktu. Foto itu dipajang di samping kotak biru.","th":"ทั้งสามร้องเพลงด้วยกัน เมื่อเพลงจบ กระดิ่งดังตรงจังหวะ รูปถ่ายถูกวางไว้ข้างกล่องสีน้ำเงิน","ja":"三人で歌う。曲が終わると、鈴がぴったりのタイミングで鳴った。写真は青い箱の隣に飾られる。"},[[1,{"pt":"O palco é nosso. E cada lembrança também.","en":"The stage is ours. And so is every memory.","es":"El escenario es nuestro. Y también cada recuerdo.","id":"Panggung ini milik kita. Begitu juga setiap kenangan.","th":"เวทีนี้เป็นของเรา และทุกความทรงจำก็เช่นกัน","ja":"ステージは私たちのもの。思い出も全部ね。"}],[2,{"pt":"Próxima missão: guardar as pilhas no lugar certo!","en":"Next mission: put the batteries somewhere sensible!","es":"¡Próxima misión: guardar bien las pilas!","id":"Misi berikutnya: simpan baterai di tempat yang benar!","th":"ภารกิจต่อไป: เก็บถ่านให้ถูกที่!","ja":"次の任務は電池をちゃんとしまうこと！"}]]]]};
function jnT1Ep6Texto(lang){
 var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
 return {titulo:JN_T1_EP6.title[idioma],quadros:JN_T1_EP6.panels.map(function(p,i){
  return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
 })};
}
/* Prévia interna: conserva o desenho oficial, mas limita texto no Canvas.
   O texto integral permanece no figcaption acessível, sem truncamento. */
/* Objetos narrativos desenhados sobre o Canvas existente, apenas na temporada privada.
   Cartão no canto inferior direito: não interfere com os balões superiores. */
var JN_T1_OBJETOS=[
 ['carta','estrela','carta','estrela','carta'],
 ['foto','foto','sino','foto','caixa'],
 ['foto','estrela','foto','foto','caixa'],
 ['caixa','carta','fitas','gravador','gravador'],
 ['gravador','estrela','lanterna','gravador','carta'],
 ['carta','caixa','fitas','gravador','foto']
];
function jnT1ObjetoDesenhar(canvas,episodio,quadro,cantinho){
 // Pistas da história desenhadas como "itens de jogo": brilho redondo atrás, degradês, contorno macio e reflexo.
 var tipo=JN_T1_OBJETOS[episodio] && JN_T1_OBJETOS[episodio][quadro];
 if(!tipo || !canvas || !canvas.getContext) return false;
 var c=canvas.getContext('2d'); if(!c) return false;
 var W=canvas.width,H=canvas.height,base=Math.min(W/480,H/320),esc=base*(cantinho?.54:1);
 function lg(y0,y1,a,b){var g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
 function rr(x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
 function estrela(cx,cy,R,r,pontas){c.beginPath();for(var j=0;j<pontas*2;j++){var a=-Math.PI/2+j*Math.PI/pontas,rr2=j%2?r:R;var xx=cx+Math.cos(a)*rr2,yy=cy+Math.sin(a)*rr2;if(!j)c.moveTo(xx,yy);else c.lineTo(xx,yy);}c.closePath();}
 function brilho(x,y,s){c.save();c.fillStyle='#fff';c.beginPath();c.moveTo(x,y-s);c.quadraticCurveTo(x,y,x+s,y);c.quadraticCurveTo(x,y,x,y+s);c.quadraticCurveTo(x,y,x-s,y);c.quadraticCurveTo(x,y,x,y-s);c.fill();c.restore();}
 function contorno(cor,lw){c.lineJoin='round';c.lineCap='round';c.strokeStyle=cor;c.lineWidth=lw||3;c.stroke();}
 c.save(); c.translate(W-(cantinho?32:58)*base,H-(cantinho?32:58)*base); c.scale(esc,esc);
 // aura: disco lilás translúcido com borda branca e sombra suave (o item "flutua" sobre a cena)
 c.save();c.shadowColor='rgba(60,20,110,.35)';c.shadowBlur=14;c.shadowOffsetY=4;
 var au=c.createRadialGradient(-8,-10,4,0,0,46);au.addColorStop(0,'rgba(255,255,255,.98)');au.addColorStop(.7,'rgba(240,228,255,.95)');au.addColorStop(1,'rgba(214,190,255,.92)');
 c.fillStyle=au;c.beginPath();c.arc(0,0,44,0,Math.PI*2);c.fill();c.restore();
 c.lineWidth=3;c.strokeStyle='#fff';c.beginPath();c.arc(0,0,44,0,Math.PI*2);c.stroke();
 c.lineWidth=1.5;c.strokeStyle='rgba(155,48,217,.35)';c.beginPath();c.arc(0,0,40,0,Math.PI*2);c.stroke();
 jnT1Item(c,tipo);
 c.restore();return true;
}
function jnT1Item(c,tipo){   // desenha a pista centrada em (0,0), ~60px, sem a aura
 function lg(y0,y1,a,b){var g=c.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g;}
 function rr(x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
 function estrela(cx,cy,R,r,pontas){c.beginPath();for(var j=0;j<pontas*2;j++){var a=-Math.PI/2+j*Math.PI/pontas,rr2=j%2?r:R;var xx=cx+Math.cos(a)*rr2,yy=cy+Math.sin(a)*rr2;if(!j)c.moveTo(xx,yy);else c.lineTo(xx,yy);}c.closePath();}
 function brilho(x,y,s){c.save();c.fillStyle='#fff';c.beginPath();c.moveTo(x,y-s);c.quadraticCurveTo(x,y,x+s,y);c.quadraticCurveTo(x,y,x,y+s);c.quadraticCurveTo(x,y,x-s,y);c.quadraticCurveTo(x,y,x,y-s);c.fill();c.restore();}
 function contorno(cor,lw){c.lineJoin='round';c.lineCap='round';c.strokeStyle=cor;c.lineWidth=lw||3;c.stroke();}
 c.save();c.shadowColor='rgba(60,20,110,.28)';c.shadowBlur=4;c.shadowOffsetY=2;
 if(tipo==='carta'){
  c.rotate(-.12);rr(-25,-16,50,34,6);c.fillStyle=lg(-16,18,'#fffaf0','#ffe6c7');c.fill();c.shadowColor='transparent';contorno('#8e5fb0');
  c.beginPath();c.moveTo(-23,-14);c.lineTo(0,4);c.lineTo(23,-14);contorno('#8e5fb0',2.5);
  c.beginPath();c.moveTo(-23,16);c.lineTo(-6,2);c.moveTo(23,16);c.lineTo(6,2);contorno('rgba(142,95,176,.45)',2);
  c.fillStyle=lg(-4,14,'#c99bff','#8a4fe0');c.beginPath();c.arc(0,5,9,0,Math.PI*2);c.fill();contorno('#6b36b8',2);   // lacre lilás
  estrela(0,5,5.5,2.4,5);c.fillStyle='#fff6c4';c.fill();
 }else if(tipo==='estrela'){
  estrela(0,1,28,13,5);c.fillStyle=lg(-27,28,'#e7d0ff','#9b5cf0');c.fill();c.shadowColor='transparent';contorno('#6b36b8',3);
  estrela(-2,-2,17,8,5);c.fillStyle='rgba(255,255,255,.35)';c.fill();
  brilho(-9,-9,6);brilho(16,-15,4);
 }else if(tipo==='caixa'){
  rr(-24,-6,48,30,5);c.fillStyle=lg(-6,24,'#7fb4ff','#3f73d6');c.fill();c.shadowColor='transparent';contorno('#2d4f9c');
  rr(-28,-16,56,13,4);c.fillStyle=lg(-16,-3,'#a8cdff','#5d93ec');c.fill();contorno('#2d4f9c');
  c.fillStyle=lg(-16,24,'#e6c8ff','#b77df5');c.fillRect(-5,-16,10,40);c.strokeStyle='#8a4fe0';c.lineWidth=1.5;c.strokeRect(-5,-16,10,40);
  c.fillStyle='#c99bff';c.beginPath();c.ellipse(-9,-20,9,6,-.5,0,Math.PI*2);c.ellipse(9,-20,9,6,.5,0,Math.PI*2);c.fill();contorno('#8a4fe0',2);
  c.fillStyle='#a56cf0';c.beginPath();c.arc(0,-18,4,0,Math.PI*2);c.fill();
  c.fillStyle='rgba(255,255,255,.35)';rr(-22,-4,14,6,3);c.fill();
 }else if(tipo==='foto'){
  c.rotate(.1);rr(-24,-27,48,54,4);c.fillStyle='#fffefb';c.fill();c.shadowColor='transparent';contorno('#8e7aa8',2);
  var cg=c.createLinearGradient(0,-21,0,10);cg.addColorStop(0,'#bcd9ff');cg.addColorStop(1,'#f3dcff');c.fillStyle=cg;c.fillRect(-19,-21,38,32);
  [['#9b30d9',-10],['#3cb043',0],['#4169e1',10]].forEach(function(m){c.fillStyle=m[0];c.beginPath();c.arc(m[1],0,4.5,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(m[1]-6,11);c.quadraticCurveTo(m[1],2,m[1]+6,11);c.fill();});
  estrela(13,-14,4.5,2,5);c.fillStyle='#b77df5';c.fill();
  c.fillStyle='rgba(255,214,236,.85)';c.save();c.rotate(-.5);c.fillRect(-8,-34,16,8);c.restore();   // fitinha adesiva
 }else if(tipo==='gravador'){
  rr(-28,-17,56,36,8);c.fillStyle=lg(-17,19,'#d9d6ee','#9a96c4');c.fill();c.shadowColor='transparent';contorno('#4f4a78');
  rr(-21,-11,42,17,4);c.fillStyle='#fff';c.fill();contorno('#6b6699',1.5);
  [-10,10].forEach(function(x){c.fillStyle='#5b5688';c.beginPath();c.arc(x,-2.5,5.5,0,Math.PI*2);c.fill();c.fillStyle='#d9d6ee';c.beginPath();c.arc(x,-2.5,2,0,Math.PI*2);c.fill();});
  c.fillStyle='#ff6fb5';c.beginPath();c.arc(-12,12,3.2,0,Math.PI*2);c.fill();
  c.fillStyle='#5b5688';rr(-2,9.5,16,5,2.5);c.fill();
  c.fillStyle='rgba(255,255,255,.4)';rr(-24,-14,20,4,2);c.fill();
 }else if(tipo==='fitas'){
  c.shadowColor='transparent';
  [['#b77df5','#7b3ff0',-1],['#ff9cc9','#ff4f9a',1]].forEach(function(f){c.lineCap='round';c.lineWidth=8;c.strokeStyle=f[1];c.beginPath();c.moveTo(-24*f[2],-22);c.bezierCurveTo(26*f[2],-18,-26*f[2],4,22*f[2],22);c.stroke();
   c.lineWidth=4;c.strokeStyle=f[0];c.beginPath();c.moveTo(-24*f[2],-22);c.bezierCurveTo(26*f[2],-18,-26*f[2],4,22*f[2],22);c.stroke();});
  brilho(-14,-6,4);brilho(16,6,3);
 }else if(tipo==='lanterna'){
  c.save();c.shadowColor='transparent';var fx=c.createLinearGradient(0,-12,0,-40);fx.addColorStop(0,'rgba(255,240,160,.9)');fx.addColorStop(1,'rgba(255,240,160,0)');
  c.fillStyle=fx;c.beginPath();c.moveTo(-9,-12);c.lineTo(-22,-40);c.lineTo(22,-40);c.lineTo(9,-12);c.closePath();c.fill();c.restore();
  rr(-8,-2,16,28,5);c.fillStyle=lg(-2,26,'#ffd36b','#e59a1e');c.fill();c.shadowColor='transparent';contorno('#9a5a14',2.5);
  c.beginPath();c.moveTo(-12,-14);c.lineTo(12,-14);c.lineTo(8,-2);c.lineTo(-8,-2);c.closePath();c.fillStyle=lg(-14,-2,'#fff3b8','#ffc94a');c.fill();contorno('#9a5a14',2.5);
  c.fillStyle='#ff6fb5';c.beginPath();c.arc(0,8,3,0,Math.PI*2);c.fill();
  c.fillStyle='rgba(255,255,255,.45)';rr(-5,1,3,20,1.5);c.fill();
 }else if(tipo==='sino'){
  c.beginPath();c.moveTo(-20,14);c.quadraticCurveTo(-14,8,-14,-4);c.quadraticCurveTo(-14,-22,0,-22);c.quadraticCurveTo(14,-22,14,-4);c.quadraticCurveTo(14,8,20,14);c.closePath();
  c.fillStyle=lg(-22,14,'#ffe58a','#e2a516');c.fill();c.shadowColor='transparent';contorno('#9a6a0c');
  c.fillStyle='#c98a0c';c.beginPath();c.arc(0,18,5,0,Math.PI*2);c.fill();contorno('#9a6a0c',2);
  c.fillStyle='#ff6fb5';c.beginPath();c.ellipse(-7,-25,7,4.5,-.4,0,Math.PI*2);c.ellipse(7,-25,7,4.5,.4,0,Math.PI*2);c.fill();contorno('#d23f86',1.5);   // lacinho
  c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.ellipse(-6,-8,3,9,.25,0,Math.PI*2);c.fill();
  brilho(14,-18,4);
 }
 c.restore();
}
/* Direção de cena da Temporada 1: o que cada quadro mostra além dos personagens.
   d = cenário (porta, espelho, cortina, palquinho, estrelachao, holofote) · pr = pistas na cena [tipo, 'mao'|'cabeca'|'chao', posição do personagem ou x do chão]
   fx = reações de mangá [posição do personagem, '!'|'?'|'gota'|'notas'|'coracoes'|'brilho'|'corre'] · luz = 'escuro' | 'lanterna' | 'memoria' | 'penumbra' */
var JN_T1_CENA = [
 [{d:['porta','espelho'],pr:[['carta','chao',.27]],fx:[[0,'!']]},
  {d:['espelho'],pr:[['carta','mao',0]],fx:[[1,'?']]},
  {pr:[['carta','mao',0]],fx:[[1,'!'],[2,'brilho']]},
  {d:['holofote'],fx:[[0,'corre'],[1,'!']]},
  {pr:[['carta','mao',0]],fx:[[1,'notas'],[2,'?']]}],
 [{d:['espelho'],pr:[['foto','mao',1],['sino','mao',2]],fx:[[0,'brilho']]},
  {d:['espelho'],pr:[['sino','mao',0],['foto','mao',1]],fx:[[0,'brilho']]},
  {pr:[['sino','mao',2]],fx:[[0,'gota'],[2,'notas']]},
  {pr:[['foto','mao',0]],fx:[[0,'!'],[1,'coracoes']]},
  {pr:[['foto','mao',1]],fx:[[0,'notas'],[2,'?']]}],
 [{d:['espelho'],pr:[['foto','mao',0]],fx:[[0,'brilho']]},
  {luz:'memoria',fx:[[0,'gota'],[1,'gota']]},
  {luz:'memoria',fx:[[0,'coracoes'],[1,'brilho'],[2,'notas']]},
  {d:['espelho'],pr:[['foto','mao',0]],fx:[[0,'!'],[1,'?']]},
  {d:['cortina'],pr:[['caixa','chao',.35]],fx:[[1,'!'],[2,'!']]}],
 [{d:['cortina'],pr:[['caixa','chao',.35],['gravador','mao',0]],fx:[[0,'!'],[1,'brilho']]},
  {pr:[['carta','mao',1]],fx:[[0,'brilho']]},
  {d:['palquinho'],pr:[['fitas','cabeca',1],['fitas','mao',0]],fx:[[1,'gota'],[2,'?']]},
  {d:['palquinho'],pr:[['gravador','mao',0],['fitas','mao',1]],fx:[[2,'brilho']]},
  {d:['palquinho'],pr:[['gravador','mao',0]],fx:[[0,'notas'],[1,'!'],[2,'coracoes']]}],
 [{d:['palquinho'],pr:[['gravador','mao',0]],fx:[[2,'?']]},
  {luz:'escuro',fx:[[0,'gota'],[1,'?']]},
  {luz:'lanterna',pr:[['lanterna','mao',0]],fx:[[1,'!'],[2,'brilho']]},
  {luz:'penumbra',pr:[['gravador','mao',0]],fx:[[0,'notas'],[1,'!'],[2,'?']]},
  {d:['estrelachao','palquinho'],pr:[['carta','mao',0]],fx:[[1,'!'],[2,'brilho']]}],
 [{d:['estrelachao'],pr:[['carta','mao',0],['foto','mao',1]],fx:[[2,'!']]},
  {d:['espelho'],pr:[['carta','mao',0]],fx:[[1,'coracoes']]},
  {pr:[['fitas','mao',0]],fx:[[0,'gota'],[1,'coracoes'],[2,'brilho']]},
  {d:['palquinho','holofote'],pr:[['gravador','mao',0],['foto','mao',1],['lanterna','mao',2]],fx:[[0,'brilho']]},
  {d:['palquinho'],pr:[['sino','mao',2],['caixa','chao',.06]],fx:[[0,'notas'],[1,'notas'],[2,'coracoes']]}]
];
function jnT1Cenario(x,W,H,cena,etapa,xs,ES,chao){
 if(!cena) return;
 function rr(a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
 function lg(x0,y0,x1,y1,st){var g=x.createLinearGradient(x0,y0,x1,y1);st.forEach(function(s2){g.addColorStop(s2[0],s2[1]);});return g;}
 var topoBoneco=chao-112*ES+8;
 if(etapa==='fundo'){
  (cena.d||[]).forEach(function(d){x.save();
   if(d==='porta'){   // porta do camarim com plaquinha de estrela e a fresta embaixo
    rr(34,96,96,H-96-14,10);x.fillStyle=lg(0,96,0,H,[[0,'#c9a2ef'],[1,'#9f6fd6']]);x.fill();x.lineWidth=4;x.strokeStyle='#6b3fa6';x.stroke();
    rr(46,110,72,88,8);x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=3;x.stroke();rr(46,208,72,70,8);x.stroke();
    x.fillStyle='#ffd23f';x.beginPath();x.arc(114,214,6,0,7);x.fill();
    rr(58,120,48,22,11);x.fillStyle='#fff6c4';x.fill();x.fillStyle='#9b30d9';x.font='900 14px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('★ TsuLiPa',82,131);
    x.fillStyle='rgba(40,10,70,.35)';x.fillRect(34,H-18,96,4);
   }else if(d==='espelho'){   // espelho de camarim com lâmpadas
    var ex=W-128,ey=70;rr(ex,ey,104,120,14);x.fillStyle='#fff3fa';x.fill();x.lineWidth=5;x.strokeStyle='#e7b6d6';x.stroke();
    rr(ex+12,ey+12,80,96,8);x.fillStyle=lg(0,ey,0,ey+108,[[0,'#d8ecff'],[1,'#f3e1ff']]);x.fill();
    x.fillStyle='rgba(255,255,255,.6)';x.beginPath();x.moveTo(ex+22,ey+20);x.lineTo(ex+44,ey+20);x.lineTo(ex+26,ey+60);x.lineTo(ex+16,ey+60);x.closePath();x.fill();
    for(var k=0;k<5;k++){[[ex+6+k*23,ey+4],[ex+6+k*23,ey+116]].forEach(function(b2){var gl=x.createRadialGradient(b2[0],b2[1],1,b2[0],b2[1],9);gl.addColorStop(0,'#fffbe0');gl.addColorStop(1,'rgba(255,230,140,0)');x.fillStyle=gl;x.beginPath();x.arc(b2[0],b2[1],9,0,7);x.fill();x.fillStyle='#ffe58a';x.beginPath();x.arc(b2[0],b2[1],3.5,0,7);x.fill();});}
    rr(ex-14,ey+120,132,12,4);x.fillStyle='#c9a2ef';x.fill();
   }else if(d==='cortina'){   // cortinas nas laterais com franja dourada
    [[0,1],[W,-1]].forEach(function(c2){x.save();x.translate(c2[0],0);x.scale(c2[1],1);
     x.fillStyle=lg(0,0,70,0,[[0,'#7a1f6e'],[.5,'#b23a8f'],[1,'#7a1f6e']]);x.beginPath();x.moveTo(0,0);x.lineTo(78,0);x.quadraticCurveTo(50,H*.55,70,H);x.lineTo(0,H);x.closePath();x.fill();
     x.strokeStyle='rgba(255,255,255,.18)';x.lineWidth=3;for(var f=12;f<70;f+=16){x.beginPath();x.moveTo(f,0);x.quadraticCurveTo(f-10,H*.5,f-4,H);x.stroke();}
     x.fillStyle='#ffd23f';x.fillRect(0,0,82,10);x.restore();});
   }else if(d==='palquinho'){   // palco pequeno montado pelo trio: tablado, fitas e pisca-pisca
    rr(40,H-58,W-80,30,10);x.fillStyle=lg(0,H-58,0,H-28,[[0,'#e8b47a'],[1,'#b9783e']]);x.fill();x.lineWidth=3;x.strokeStyle='#7a4a1f';x.stroke();
    x.strokeStyle='rgba(122,74,31,.35)';x.lineWidth=2;for(var t2=80;t2<W-60;t2+=46){x.beginPath();x.moveTo(t2,H-56);x.lineTo(t2,H-30);x.stroke();}
    x.strokeStyle='#ff9cc9';x.lineWidth=3;x.beginPath();x.moveTo(28,58);x.quadraticCurveTo(W/2,104,W-28,58);x.stroke();
    for(var l2=0;l2<11;l2++){var tl=l2/10,lx=28+(W-56)*tl,ly=58+46*4*tl*(1-tl);x.fillStyle=['#ffd23f','#b6ff3b','#4dd8ff','#ff6fb5','#c4a5ff'][l2%5];x.beginPath();x.arc(lx,ly+5,4.5,0,7);x.fill();}
   }else if(d==='estrelachao'){   // a estrela lilás desenhada no chão do palco
    x.translate(W/2,H-22);x.scale(1,.3);x.beginPath();for(var j=0;j<10;j++){var an=-Math.PI/2+j*Math.PI/5,r=j%2?28:64;var px=Math.cos(an)*r,py=Math.sin(an)*r;if(!j)x.moveTo(px,py);else x.lineTo(px,py);}x.closePath();
    x.fillStyle='rgba(189,139,255,.75)';x.fill();x.lineWidth=5;x.strokeStyle='#fff';x.stroke();
   }else if(d==='holofote'){   // um refletor aceso no palco vazio
    var gh=x.createLinearGradient(W*.72,0,W*.66,H);gh.addColorStop(0,'rgba(255,250,210,.85)');gh.addColorStop(1,'rgba(255,250,210,.05)');
    x.fillStyle=gh;x.beginPath();x.moveTo(W*.7,0);x.lineTo(W*.78,0);x.lineTo(W*.86,H);x.lineTo(W*.52,H);x.closePath();x.fill();
   }
   x.restore();});
  return;
 }
 // frente: pistas na cena, reações e luz
 function ponto(onde,i){var cx=xs[i]!=null?xs[i]:W/2;
  if(onde==='mao') return [cx+30*ES,chao-38*ES,.42*ES];
  if(onde==='cabeca') return [cx+4*ES,topoBoneco+22*ES,.4*ES];
  return [i*W,chao-14,.62];}
 (cena.pr||[]).forEach(function(pr){var pt=ponto(pr[1],pr[2]);x.save();x.translate(pt[0],pt[1]);x.scale(pt[2],pt[2]);
  if(pr[1]==='chao'){x.fillStyle='rgba(40,10,70,.22)';x.beginPath();x.ellipse(0,26,30,6,0,0,7);x.fill();}
  try{jnT1Item(x,pr[0]);}catch(e){} x.restore();});
 if(cena.luz==='memoria'){   // lembrança: tom lilás-sépia, vinheta e moldura de sonho
  x.save();x.globalCompositeOperation='multiply';x.fillStyle='rgba(230,205,170,.55)';x.fillRect(0,0,W,H);x.restore();
  var vg=x.createRadialGradient(W/2,H/2,H*.3,W/2,H/2,W*.65);vg.addColorStop(0,'rgba(255,240,255,0)');vg.addColorStop(1,'rgba(255,236,250,.85)');x.fillStyle=vg;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(255,255,255,.7)';for(var m=0;m<14;m++){x.beginPath();x.arc((m*97)%W,20+((m*53)%(H-40)),2+(m%3),0,7);x.fill();}
 }else if(cena.luz==='escuro'||cena.luz==='penumbra'||cena.luz==='lanterna'){
  var ov=document.createElement('canvas');ov.width=W;ov.height=H;var o=ov.getContext('2d');
  o.fillStyle=cena.luz==='penumbra'?'rgba(14,6,40,.55)':'rgba(10,4,30,.82)';o.fillRect(0,0,W,H);
  if(cena.luz==='lanterna'){var lx2=xs[0]+30*ES,ly2=chao-38*ES;o.globalCompositeOperation='destination-out';var gl2=o.createRadialGradient(W*.62,chao-70,10,W*.62,chao-70,W*.5);gl2.addColorStop(0,'rgba(0,0,0,1)');gl2.addColorStop(.7,'rgba(0,0,0,.8)');gl2.addColorStop(1,'rgba(0,0,0,0)');
   o.fillStyle=gl2;o.beginPath();o.moveTo(lx2,ly2-8);o.lineTo(W+20,chao-200);o.lineTo(W+20,H+10);o.lineTo(lx2,ly2+8);o.closePath();o.fill();o.beginPath();o.arc(W*.62,chao-70,W*.3,0,7);o.fill();}
  x.drawImage(ov,0,0);
  if(cena.luz==='lanterna'){x.save();x.globalCompositeOperation='lighter';var gl3=x.createRadialGradient(W*.62,chao-70,10,W*.62,chao-70,W*.32);gl3.addColorStop(0,'rgba(255,230,140,.35)');gl3.addColorStop(1,'rgba(255,230,140,0)');x.fillStyle=gl3;x.fillRect(0,0,W,H);x.restore();}
  if(cena.luz==='escuro'){x.fillStyle='rgba(255,255,255,.85)';[[.2,.3],[.7,.2],[.45,.12],[.85,.45]].forEach(function(e2){x.beginPath();x.arc(e2[0]*W,e2[1]*H,1.6,0,7);x.fill();});}
 }
 (cena.fx||[]).forEach(function(f){var cx=xs[f[0]];if(cx==null)return;var hx=cx+24*ES,hy=topoBoneco+16*ES;x.save();x.lineCap='round';x.lineJoin='round';
  if(f[1]==='!'||f[1]==='?'){x.translate(hx,hy);x.rotate(.18);x.font='900 30px "M PLUS Rounded 1c",sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=6;x.strokeStyle='#fff';x.strokeText(f[1],0,0);x.fillStyle=f[1]==='!'?'#ff4f9a':'#7b3ff0';x.fillText(f[1],0,0);
   x.strokeStyle=f[1]==='!'?'#ff4f9a':'#7b3ff0';x.lineWidth=3;[-.9,-.4,.2].forEach(function(a){x.beginPath();x.moveTo(Math.cos(a-1.4)*18,Math.sin(a-1.4)*18);x.lineTo(Math.cos(a-1.4)*26,Math.sin(a-1.4)*26);x.stroke();});}
  else if(f[1]==='gota'){x.translate(cx+20*ES,topoBoneco+30*ES);x.fillStyle='#8fd3ff';x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.moveTo(0,-11);x.quadraticCurveTo(8,1,0,7);x.quadraticCurveTo(-8,1,0,-11);x.fill();x.stroke();}
  else if(f[1]==='notas'){x.font='900 22px sans-serif';x.textAlign='center';x.lineWidth=5;x.strokeStyle='#fff';[['♪',hx,hy,'#9b30d9'],['♫',hx+18,hy-16,'#ff6fb5']].forEach(function(n){x.strokeText(n[0],n[1],n[2]);x.fillStyle=n[3];x.fillText(n[0],n[1],n[2]);});}
  else if(f[1]==='coracoes'){[[hx,hy,9,'#ff4f9a'],[hx+16,hy-14,6,'#ff9cc9']].forEach(function(h){x.save();x.translate(h[0],h[1]);x.fillStyle=h[3];x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.moveTo(0,h[2]*.9);x.bezierCurveTo(-h[2]*1.4,-h[2]*.2,-h[2]*.6,-h[2]*1.2,0,-h[2]*.4);x.bezierCurveTo(h[2]*.6,-h[2]*1.2,h[2]*1.4,-h[2]*.2,0,h[2]*.9);x.fill();x.stroke();x.restore();});}
  else if(f[1]==='brilho'){[[hx,hy,10],[hx+16,hy-14,6],[hx-6,hy-20,4]].forEach(function(b3){x.fillStyle='#fff3a8';x.strokeStyle='#e2a516';x.lineWidth=1.5;x.beginPath();x.moveTo(b3[0],b3[1]-b3[2]);x.quadraticCurveTo(b3[0],b3[1],b3[0]+b3[2],b3[1]);x.quadraticCurveTo(b3[0],b3[1],b3[0],b3[1]+b3[2]);x.quadraticCurveTo(b3[0],b3[1],b3[0]-b3[2],b3[1]);x.quadraticCurveTo(b3[0],b3[1],b3[0],b3[1]-b3[2]);x.fill();x.stroke();});}
  else if(f[1]==='corre'){x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=4;[0,14,28].forEach(function(o){x.beginPath();x.moveTo(cx-40*ES-o*.6,chao-60*ES+o*1.2);x.lineTo(cx-28*ES,chao-60*ES+o*1.2);x.stroke();});}
  x.restore();});
}
function jnT1DesenharSeguro(canvas,p,episodio,quadro){
 if(!canvas || !canvas.getContext || !p) return false;
 var ctx=canvas.getContext('2d'); if(!ctx) return false;
 function curto(valor,largura,linhas,tamanho){
  var texto=jnCapT(valor); ctx.save();
  ctx.font='800 '+tamanho+'px "M PLUS Rounded 1c",sans-serif';
  var palavras=String(texto).split(/\s+/), partes=[],linha='';
  // Divide também palavras sem espaços (JA/TH), evitando estouro horizontal.
  function encaixar(palavra){
   if(ctx.measureText(palavra).width<=largura) return [palavra];
   var pedacos=[],at='',unidades;
   // Quebra por palavra/grafema (Intl.Segmenter) para não separar acentos e marcas tonais do tailandês.
   try{ unidades=Array.from(new Intl.Segmenter(jnCapL(),{granularity:'word'}).segment(palavra),function(x){return x.segment;}); }catch(e){ unidades=null; }
   if(!unidades) try{ unidades=Array.from(new Intl.Segmenter(jnCapL(),{granularity:'grapheme'}).segment(palavra),function(x){return x.segment;}); }catch(e){ unidades=Array.from(palavra); }
   unidades.forEach(function(c){
    if(at && ctx.measureText(at+c).width>largura){pedacos.push(at);at=c;}else at+=c;
   });
   if(at)pedacos.push(at);return pedacos;
  }
  palavras.forEach(function(palavra){
   encaixar(palavra).forEach(function(pedaco){
    var tentativa=linha?linha+' '+pedaco:pedaco;
    if(linha && ctx.measureText(tentativa).width>largura){partes.push(linha);linha=pedaco;}
    else linha=tentativa;
   });
  });
  if(linha)partes.push(linha);
  var reduz=partes.length>linhas,ret=partes.slice(0,linhas);
  if(reduz && ret.length){
   var fim=ret.length-1;
   while(ret[fim] && ctx.measureText(ret[fim]+'…').width>largura)ret[fim]=ret[fim].slice(0,-1);
   ret[fim]+='…';
  }
  ctx.restore();return ret.join(' ');
 }
 var nar=p[2]?{pt:curto(p[2],canvas.width-60,3,14)}:null;
 // Falas até 4 linhas: as falas-chave da história não perdem o fim (texto integral segue na legenda HTML).
 var falas=p[3].map(function(f){return [f[0],{pt:curto(f[1],196,4,15)}];});
 var cena=(typeof episodio==='number' && JN_T1_CENA[episodio])?JN_T1_CENA[episodio][quadro]:null;
 jnCapDesenhar(canvas,[p[0],p[1],nar,falas,cena],true);
 // o selo da pista só aparece quando ela não está desenhada na cena
 if(typeof episodio==='number' && typeof quadro==='number' && !(cena && ((cena.pr && cena.pr.length) || /escuro|penumbra/.test(cena.luz||'')))) jnT1ObjetoDesenhar(canvas,episodio,quadro,p[1].length>=3);
 return true;
}
/* Chamado somente após inserir o HTML autorizado no leitor; não altera o leitor antigo. */
function jnT1PintarQuadros(root,episodio){
 if(!jnT1Disponivel(episodio) || !root || !root.querySelectorAll) return false;
 var desenhar=[jnT1PilotoDesenhar,jnT1Ep2Desenhar,jnT1Ep3Desenhar,
              jnT1Ep4Desenhar,jnT1Ep5Desenhar,jnT1Ep6Desenhar][episodio];
 if(typeof desenhar!=='function') return false;
 var telas=root.querySelectorAll('.jn-t1 canvas');
 if(telas.length!==5) return false;
 [].forEach.call(telas,function(cv,i){desenhar(cv,i);});
 return true;
}
function jnT1Ep6Desenhar(canvas,indice){
 if(!canvas || indice<0 || indice>=JN_T1_EP6.panels.length) return false;
 jnT1DesenharSeguro(canvas,JN_T1_EP6.panels[indice],5,indice);
 return true;
}
function jnT1Ep6Html(){
 if(!jnT1Disponivel(5)) return '';
 var t=jnT1Ep6Texto(jnCapL());
 return '<section class="jn-t1" aria-label="'+escHtml(t.titulo)+'"><h4>'+escHtml(t.titulo)+'</h4>'+
 t.quadros.map(function(q){return '<figure><canvas width="480" height="320" role="img" aria-label="'+escHtml(q.narracao)+'"></canvas><figcaption><p>'+escHtml(q.narracao)+'</p>'+
 q.falas.map(function(f){return '<p><strong>'+escHtml(f.personagem)+':</strong> '+escHtml(f.texto)+'</p>';}).join('')+'</figcaption></figure>';}).join('')+'</section>';
}
function jnT1Ep5Texto(lang){
 var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
 return {titulo:JN_T1_EP5.title[idioma],quadros:JN_T1_EP5.panels.map(function(p,i){
  return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
 })};
}
function jnT1Ep5Desenhar(canvas,indice){
 if(!canvas || indice<0 || indice>=JN_T1_EP5.panels.length) return false;
 jnT1DesenharSeguro(canvas,JN_T1_EP5.panels[indice],4,indice);
 return true;
}
function jnT1Ep5Html(){
 if(!jnT1Disponivel(4)) return '';
 var t=jnT1Ep5Texto(jnCapL());
 return '<section class="jn-t1" aria-label="'+escHtml(t.titulo)+'"><h4>'+escHtml(t.titulo)+'</h4>'+
 t.quadros.map(function(q){return '<figure><canvas width="480" height="320" role="img" aria-label="'+escHtml(q.narracao)+'"></canvas><figcaption><p>'+escHtml(q.narracao)+'</p>'+
 q.falas.map(function(f){return '<p><strong>'+escHtml(f.personagem)+':</strong> '+escHtml(f.texto)+'</p>';}).join('')+'</figcaption></figure>';}).join('')+'</section>';
}
function jnT1Ep4Texto(lang){
 var idioma=/^(pt|en|es|id|th|ja)$/.test(lang)?lang:'pt';
 return {titulo:JN_T1_EP4.title[idioma],quadros:JN_T1_EP4.panels.map(function(p,i){
  return {numero:i+1,narracao:p[2][idioma],falas:p[3].map(function(f){return {personagem:['Tsu','Lirika','Pati'][f[0]],texto:f[1][idioma]};})};
 })};
}
function jnT1Ep4Desenhar(canvas,indice){
 if(!canvas || indice<0 || indice>=JN_T1_EP4.panels.length) return false;
 jnT1DesenharSeguro(canvas,JN_T1_EP4.panels[indice],3,indice);
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
 jnT1DesenharSeguro(canvas,JN_T1_EP3.panels[indice],2,indice);
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
 jnT1DesenharSeguro(canvas,JN_T1_EP2.panels[indice],1,indice);
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
  jnT1DesenharSeguro(canvas,p,0,indice);
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
// Os quadrinhos estreiam junto com o Calendário, em 15/11/2026: um capítulo por domingo, em ordem (1 em 15/11, 2 em 22/11 … 6 em 20/12).
function jnCapData(i){ return new Date(JN_CAPS_INICIO + i * 7 * 864e5).toISOString().slice(0, 10); }   // domingos
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
  jnT1LeitorUI(box);
}
/* Leitor da Temporada 1, inerte enquanto bloqueada: só mostra episódios que jnT1Disponivel libera
   (JN_T1_PUBLICADA + pronto + data de Brasília). Com tudo bloqueado não acrescenta nada à página. */
var jnT1Sel = -1;
function jnT1LeitorUI(box){
  if(!box || typeof jnT1Disponivel !== 'function') return false;
  var htmlDe = [jnT1PilotoHtml, jnT1Ep2Html, jnT1Ep3Html, jnT1Ep4Html, jnT1Ep5Html, jnT1Ep6Html], lib = [];
  for(var i = 0; i < 6; i++) if(jnT1Disponivel(i)) lib.push(i);
  if(!lib.length) return false;
  if(lib.indexOf(jnT1Sel) < 0) jnT1Sel = lib[lib.length - 1];
  var t = [jnT1PilotoTexto, jnT1Ep2Texto, jnT1Ep3Texto, jnT1Ep4Texto, jnT1Ep5Texto, jnT1Ep6Texto];
  var sec = document.createElement('div'); sec.className = 'jnt1leitor';
  sec.innerHTML = '<h5 class="jncaptit">' + escHtml(JN_T1.titulo) + '</h5><div class="jncapabas">' + lib.map(function(i){
      return '<button type="button" class="jncapaba' + (i === jnT1Sel ? ' jncapon' : '') + '" data-jnt1="' + i + '"' + (i === jnT1Sel ? ' aria-pressed="true"' : '') + '><b>' + escHtml(jnCapT(JN_CAPS_TX.cap, i + 1)) + '</b><small>' + escHtml(t[i](jnCapL()).titulo) + '</small></button>';
    }).join('') + '</div>' + htmlDe[jnT1Sel]();
  box.appendChild(sec);
  [].forEach.call(sec.querySelectorAll('[data-jnt1]'), function(b){ b.addEventListener('click', function(){ jnT1Sel = +b.getAttribute('data-jnt1'); jornalCapsUI(); }); });
  try{ jnT1PintarQuadros(sec, jnT1Sel); }catch(e){}
  return true;
}
function jnCapAv(k, pose){   // o boneco oficial do membro (os mesmos do banner do início)
  if(typeof HUB_TRIO === 'undefined' || typeof HUB_TRIO_DRAW_CHARS === 'undefined' || typeof CH === 'undefined' || !HUB_TRIO[k]) return null;
  var m = HUB_TRIO[k], c = JSON.parse(JSON.stringify(HUB_TRIO_DRAW_CHARS[k])), base = CH[m[0]];
  if(base){ c.out = base.out; c.outcol = base.outcol; }
  return {c:c, pose:pose || '', expr:m[4]};
}
/* Temporada 0 (os 6 capítulos das músicas dos Unit Festivals): direção de cena por quadro, desenhada no Canvas.
   cena: cenário próprio (com profundidade e luz); cam: 'geral' | 'medio' | 'close' (close = foco num membro, cortado no peito);
   expr: expressões já existentes dos bonecos {membro: n} (0 neutra, 1 animada, 2 sorriso, 3 piscadinha, 4 surpresa, 5 emoção);
   vira: membros que olham para o outro lado (espelhados); placa: o letreiro do palco; ano: a paleta do festival. */
var JN_T0_DIR = [
  [{cena:'audicao', cam:'medio', expr:{0:2}}, {cena:'sala', cam:'medio', vira:[2], expr:{1:3, 2:2}}, {cena:'palco', ano:'draft', placa:'DRAFT 1st GEN', expr:{0:2, 2:1}}],
  [{cena:'sala', noite:1, cam:'geral', expr:{0:2}}, {cena:'espelho', cam:'close', foco:1, expr:{1:0}}, {cena:'palco', ano:'2021', placa:'POLYRHYTHM', expr:{0:2, 2:1}}],
  [{cena:'cidade', cam:'close', foco:2, expr:{2:3}}, {cena:'cidade', neon:'PLASTIC LOVE', cam:'medio', vira:[1], expr:{0:2}}, {cena:'palco', ano:'2023', placa:'PLASTIC LOVE', neve:1, expr:{1:3}}],
  [{cena:'praia', cam:'medio', expr:{1:2}}, {cena:'praia', tarde:1, cam:'medio', vira:[0], expr:{2:2, 0:2}}, {cena:'palco', ano:'2025', placa:'SPLASH DREAM', agua:1, expr:{0:1}}],
  [{cena:'janela', cam:'close', foco:0, expr:{0:5}}, {cena:'longe', cam:'medio', expr:{1:5, 2:2}}, {cena:'palco', ano:'2026', placa:'ENDLESS DAYDREAM', expr:{2:2}}],
  [{cena:'abobora', cam:'medio', expr:{2:4}}, {cena:'portao', cam:'geral', vira:[0], expr:{1:1, 0:2}}, {cena:'palco', ano:'world', placa:'TsuLiPa⭐World', confete:1, expr:{0:2, 1:2, 2:1}}]
];
var JN_T0_ANO = {draft:['#2a1660', '#7b3ff0', '#ff6fb5'], '2021':['#3a1a6e', '#ffb627', '#ffe680'], '2023':['#101a4a', '#4dd8ff', '#ff6fb5'],
  '2025':['#0d3a5c', '#29c5f6', '#ffd23f'], '2026':['#2a1450', '#c79bff', '#ffb3d9'], world:['#3a1470', '#ff6fb5', '#b6ff3b']};
JN_CAPS.forEach(function(c, i){ (c[2] || []).forEach(function(q, k){ var d = JN_T0_DIR[i] && JN_T0_DIR[i][k]; if(d) q.jnT0 = d; }); });
/* Acabamento no estilo do site: moldura branca com contorno lilás (como os cards), narração em cartão claro com a faixa
   roxo→rosa do TsuLiPa⭐World, balões com sombra suave e texto na tinta roxa do site. */
var JN_TINTA = '#4a2a7a';
function jnNarracao(x, rr, W, nl, lh){
  var nh = nl.length * lh + 14;
  x.save(); x.shadowColor = 'rgba(80,40,160,.18)'; x.shadowBlur = 8; x.shadowOffsetY = 2; rr(10, 10, W - 20, nh, 14); x.fillStyle = 'rgba(255,255,255,.94)'; x.fill(); x.restore();
  rr(10, 10, W - 20, nh, 14); x.strokeStyle = '#e2d7fd'; x.lineWidth = 2; x.stroke();
  var fx = x.createLinearGradient(0, 10, 0, 10 + nh); fx.addColorStop(0, '#9b30d9'); fx.addColorStop(1, '#ff6fb5'); x.fillStyle = fx; rr(16, 16, 5, nh - 12, 2.5); x.fill();
  x.fillStyle = '#5b2bb5'; x.textAlign = 'left'; x.textBaseline = 'top'; nl.forEach(function(l, k){ x.fillText(l, 30, 17 + k * lh); });
  return nh;
}
function jnBalaoFundo(x, rr, bx, by, bw, bh, corM){
  x.save(); x.shadowColor = 'rgba(80,40,160,.22)'; x.shadowBlur = 8; x.shadowOffsetY = 3; rr(bx, by, bw, bh, 16); x.fillStyle = '#fff'; x.fill(); x.restore();
  rr(bx, by, bw, bh, 16); x.strokeStyle = corM; x.lineWidth = 2.5; x.stroke();
}
function jnMoldura(x, rr, W, H){ x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 6; rr(3, 3, W - 6, H - 6, 19); x.stroke(); x.strokeStyle = '#e2d7fd'; x.lineWidth = 2; rr(1, 1, W - 2, H - 2, 21); x.stroke(); }
function jnT0Forma(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
function jnT0Brilho(x, a, b, r, c){ x.fillStyle = c || 'rgba(255,255,255,.9)'; x.beginPath(); for(var i = 0; i < 8; i++){ var rr2 = i % 2 ? r * .35 : r, an = i * Math.PI / 4; x.lineTo(a + Math.cos(an) * rr2, b + Math.sin(an) * rr2); } x.closePath(); x.fill(); }
function jnT0Lua(x, a, b, r){ x.save(); x.shadowColor = 'rgba(255,240,180,.8)'; x.shadowBlur = 18; x.fillStyle = '#fff6c4'; x.beginPath(); x.arc(a, b, r, 0, 7); x.fill(); x.restore();
  x.fillStyle = 'rgba(0,0,0,.0)'; x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(230,214,150,.55)'; [[-.3, -.2, .18], [.25, .2, .14], [.05, .35, .09]].forEach(function(c){ x.beginPath(); x.arc(a + c[0] * r, b + c[1] * r, c[2] * r, 0, 7); x.fill(); }); }
// lado do céu sem balão: a lua, o sol e os letreiros vão para o lado oposto a quem fala
function jnT0Cena(x, W, H, d, camada, falaX, chao){
  var lado = falaX == null ? 1 : (falaX > W / 2 ? 0 : 1), cx = lado ? W - 70 : 70, i, g;
  if(camada === 'fundo'){
    if(d.cena === 'audicao'){   // audição: cortina escura, um holofote só e o número de inscrição no chão
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d0f3d'); g.addColorStop(1, '#3a1a6e'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      for(i = 0; i < W; i += 40){ var dob = x.createLinearGradient(i, 0, i + 40, 0); dob.addColorStop(0, 'rgba(70,16,110,.55)'); dob.addColorStop(.5, 'rgba(150,60,190,.42)'); dob.addColorStop(1, 'rgba(70,16,110,.55)'); x.fillStyle = dob; x.fillRect(i, 0, 40, H - 70); }
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,246,196,.65)'); g.addColorStop(1, 'rgba(255,246,196,.05)');
      x.fillStyle = g; x.beginPath(); x.moveTo(W / 2 - 26, 0); x.lineTo(W / 2 + 26, 0); x.lineTo(W / 2 + 130, H); x.lineTo(W / 2 - 130, H); x.closePath(); x.fill();
      x.fillStyle = '#2a1450'; x.fillRect(0, H - 70, W, 70); x.fillStyle = 'rgba(255,246,196,.35)'; x.beginPath(); x.ellipse(W / 2, H - 20, 120, 16, 0, 0, 7); x.fill();
      x.fillStyle = '#ffd23f'; x.font = '400 15px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText('AUDITION', W / 2 + (lado ? 150 : -150), H - 32);
      return;
    }
    if(d.cena === 'sala' || d.cena === 'espelho'){   // sala de ensaio: parede lilás, espelho grande, barra e piso de madeira
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, d.noite ? '#3b2a6e' : '#efe6ff'); g.addColorStop(1, d.noite ? '#5a3d8f' : '#fde9f5'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      var ex = d.cena === 'espelho' ? 30 : 110, ew = d.cena === 'espelho' ? 220 : 260;
      var vg = x.createLinearGradient(ex, 40, ex + ew, H - 80); vg.addColorStop(0, d.noite ? 'rgba(190,205,255,.28)' : '#eaf3ff'); vg.addColorStop(1, d.noite ? 'rgba(150,120,230,.2)' : '#f6eaff');
      jnT0Forma(x, ex, 40, ew, H - 120, 16); x.fillStyle = vg; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 6; x.stroke(); jnT0Forma(x, ex - 3, 37, ew + 6, H - 114, 18); x.strokeStyle = '#d9c6ff'; x.lineWidth = 2; x.stroke();
      x.save(); jnT0Forma(x, ex, 40, ew, H - 120, 16); x.clip(); var bg2 = x.createLinearGradient(ex, 40, ex + 90, 140); bg2.addColorStop(0, 'rgba(255,255,255,.75)'); bg2.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = bg2; x.beginPath(); x.moveTo(ex + 18, 40); x.lineTo(ex + 64, 40); x.lineTo(ex + 8, H - 80); x.lineTo(ex - 30, H - 80); x.closePath(); x.fill(); x.restore();
      jnT0Brilho(x, ex + ew - 26, 62, 7); jnT0Brilho(x, ex + ew - 44, 84, 4);
      if(d.noite){ var wx = lado ? W - 110 : 20, wy = 54; jnT0Forma(x, wx, wy, 90, 84, 12); var ng = x.createLinearGradient(0, wy, 0, wy + 84); ng.addColorStop(0, '#140b38'); ng.addColorStop(1, '#3a2470'); x.fillStyle = ng; x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 5; x.stroke(); x.lineWidth = 3; x.beginPath(); x.moveTo(wx + 45, wy + 3); x.lineTo(wx + 45, wy + 81); x.stroke(); jnT0Lua(x, wx + 66, wy + 20, 12); jnT0Brilho(x, wx + 20, wy + 18, 4); jnT0Brilho(x, wx + 28, wy + 66, 3); }
      x.strokeStyle = '#d9a86c'; x.lineWidth = 6; x.beginPath(); x.moveTo(0, H - 116); x.lineTo(W, H - 116); x.stroke();
      g = x.createLinearGradient(0, H - 80, 0, H); g.addColorStop(0, '#e7b98a'); g.addColorStop(1, '#c98a5a'); x.fillStyle = g; x.fillRect(0, H - 80, W, 80);
      x.strokeStyle = 'rgba(120,70,30,.25)'; x.lineWidth = 2; for(i = -4; i < 12; i++){ x.beginPath(); x.moveTo(W / 2 + i * 40, H - 80); x.lineTo(W / 2 + i * 80, H); x.stroke(); }
      return;
    }
    if(d.cena === 'cidade'){   // cidade à noite, clima city pop: céu roxo, prédios com janelas acesas e letreiro neon
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b0f45'); g.addColorStop(.6, '#5a1f7a'); g.addColorStop(1, '#ff6fb5'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      for(i = 0; i < 26; i++) jnT0Brilho(x, (i * 97) % W, 12 + (i * 53) % 110, 2 + i % 3, 'rgba(255,255,255,.75)');
      if(!d.neon) jnT0Lua(x, cx, 82, 18);
      var pr = [[0, 150, 70], [60, 110, 60], [116, 170, 54], [166, 130, 70], [232, 96, 50], [278, 160, 64], [338, 120, 58], [392, 150, 50], [438, 105, 60]];
      pr.forEach(function(b, k){ var bg3 = x.createLinearGradient(0, b[1], 0, H); bg3.addColorStop(0, k % 2 ? '#3d1f7a' : '#48248a'); bg3.addColorStop(1, '#1d0d45');
        jnT0Forma(x, b[0] + 2, b[1], b[2] - 4, H - b[1] + 20, 9); x.fillStyle = bg3; x.fill(); x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(b[0] + 4, b[1] + 6, 3, H - b[1] - 6);
        for(var jy = b[1] + 16; jy < H - 40; jy += 24) for(var jx = b[0] + 12; jx < b[0] + b[2] - 12; jx += 18){ if(((jx * 7 + jy * 3 + k) % 7) < 2){ var cj = (jx + jy) % 3 ? '255,210,122' : '255,179,217';
          x.save(); x.shadowColor = 'rgba(' + cj + ',.9)'; x.shadowBlur = 6; jnT0Forma(x, jx, jy, 7, 9, 2.5); x.fillStyle = 'rgb(' + cj + ')'; x.fill(); x.restore(); } } });
      if(d.neon){ var nx = lado ? W - 120 : 120; x.save(); x.shadowColor = '#ff6fb5'; x.shadowBlur = 16; x.strokeStyle = '#ffb3d9'; x.lineWidth = 3; jnT0Forma(x, nx - 82, 84, 164, 34, 17); x.stroke();
        x.fillStyle = '#fff0f8'; x.font = '400 17px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(d.neon, nx, 102); x.restore(); x.textBaseline = 'alphabetic'; }
      g = x.createLinearGradient(0, H - 46, 0, H); g.addColorStop(0, '#2a1458'); g.addColorStop(1, '#12082e'); x.fillStyle = g; x.fillRect(0, H - 46, W, 46);
      x.fillStyle = 'rgba(255,111,181,.35)'; x.fillRect(0, H - 46, W, 3);
      return;
    }
    if(d.cena === 'praia'){   // verão: céu, mar, sol (ou pôr do sol), areia e um guarda-sol
      g = x.createLinearGradient(0, 0, 0, H * .62); if(d.tarde){ g.addColorStop(0, '#ff9a8b'); g.addColorStop(1, '#ffd27a'); } else { g.addColorStop(0, '#6ec6ff'); g.addColorStop(1, '#c9f0ff'); }
      x.fillStyle = g; x.fillRect(0, 0, W, H * .62);
      var sx = d.tarde ? W / 2 : cx, sy = d.tarde ? H * .56 : 70; x.save(); x.shadowColor = d.tarde ? '#ff7a59' : '#fff3a0'; x.shadowBlur = 26; x.fillStyle = d.tarde ? '#ff8a5c' : '#ffe14d'; x.beginPath(); x.arc(sx, sy, d.tarde ? 30 : 24, 0, 7); x.fill(); x.restore();
      if(!d.tarde){ x.fillStyle = '#fff'; [[W / 2 - 40, 40], [W / 2 + 20, 70]].forEach(function(n){ x.beginPath(); x.arc(n[0], n[1], 14, 0, 7); x.arc(n[0] + 16, n[1] - 6, 16, 0, 7); x.arc(n[0] + 34, n[1], 13, 0, 7); x.fill(); }); }
      g = x.createLinearGradient(0, H * .58, 0, H * .78); g.addColorStop(0, d.tarde ? '#d9628a' : '#2aa6e0'); g.addColorStop(1, d.tarde ? '#9b4ab0' : '#5fd0f5'); x.fillStyle = g; x.fillRect(0, H * .58, W, H * .2);
      x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 2; for(i = 0; i < 4; i++){ x.beginPath(); x.moveTo(20 + i * 120, H * .66 + (i % 2) * 8); x.quadraticCurveTo(50 + i * 120, H * .63 + (i % 2) * 8, 80 + i * 120, H * .66 + (i % 2) * 8); x.stroke(); }
      if(d.tarde){ x.fillStyle = 'rgba(255,200,120,.45)'; x.fillRect(sx - 30, H * .6, 60, 4); x.fillRect(sx - 18, H * .65, 36, 3); }
      g = x.createLinearGradient(0, H * .76, 0, H); g.addColorStop(0, '#ffe3a8'); g.addColorStop(1, '#f2c27a'); x.fillStyle = g; x.fillRect(0, H * .76, W, H * .24);
      if(!d.tarde){ var gx = lado ? W - 50 : 50; x.strokeStyle = '#fff'; x.lineWidth = 4; x.beginPath(); x.moveTo(gx, H * .9); x.lineTo(gx + (lado ? -14 : 14), H * .5); x.stroke();
      x.fillStyle = '#ff6fb5'; x.beginPath(); x.moveTo(gx + (lado ? -14 : 14) - 52, H * .52); x.quadraticCurveTo(gx + (lado ? -14 : 14), H * .3, gx + (lado ? -14 : 14) + 52, H * .52); x.closePath(); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.moveTo(gx + (lado ? -14 : 14) - 18, H * .52); x.quadraticCurveTo(gx + (lado ? -14 : 14), H * .36, gx + (lado ? -14 : 14) + 18, H * .52); x.closePath(); x.fill(); }
      return;
    }
    if(d.cena === 'janela'){   // quarto à noite: janela grande com a lua do lado sem balão, luzinhas e um caderno de letra
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a1d5c'); g.addColorStop(1, '#4a2f86'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      var jx2 = lado ? W - 210 : 20; jnT0Forma(x, jx2, 26, 190, 170, 18); var jg = x.createLinearGradient(0, 26, 0, 196); jg.addColorStop(0, '#120a34'); jg.addColorStop(1, '#3a2470'); x.fillStyle = jg; x.fill(); for(i = 0; i < 14; i++) jnT0Brilho(x, jx2 + 14 + (i * 37) % 170, 40 + (i * 29) % 140, 2 + i % 3);
      jnT0Lua(x, jx2 + 130, 80, 26); jnT0Forma(x, jx2, 26, 190, 170, 18); x.strokeStyle = '#fff'; x.lineWidth = 6; x.stroke(); x.lineWidth = 4; x.beginPath(); x.moveTo(jx2 + 95, 29); x.lineTo(jx2 + 95, 193); x.stroke();
      ['#ff6fb5', '#ffd23f', '#b6ff3b', '#4dd8ff', '#c79bff'].forEach(function(c, k){ x.fillStyle = c; x.beginPath(); x.arc(30 + k * 100, 16 + (k % 2) * 6, 5, 0, 7); x.fill(); });
      x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, 14); x.quadraticCurveTo(W / 2, 30, W, 14); x.stroke();
      return;
    }
    if(d.cena === 'longe'){   // "mesmo longe": a tela dividida na diagonal, um lado de dia e o outro de noite
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffd6ec'); g.addColorStop(1, '#fff3c4'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.save(); x.beginPath(); x.moveTo(W * .56, 0); x.lineTo(W, 0); x.lineTo(W, H); x.lineTo(W * .44, H); x.closePath(); x.clip();
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1b1450'); g.addColorStop(1, '#3d2a8a'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      for(i = 0; i < 12; i++) jnT0Brilho(x, W * .6 + (i * 41) % (W * .38), 20 + (i * 37) % 160, 2 + i % 3);
      jnT0Lua(x, W - 60, 150, 16); x.restore();
      x.fillStyle = '#ffe14d'; x.save(); x.shadowColor = '#fff3a0'; x.shadowBlur = 20; x.beginPath(); x.arc(56, 150, 20, 0, 7); x.fill(); x.restore();
      x.strokeStyle = '#fff'; x.lineWidth = 6; x.beginPath(); x.moveTo(W * .56, 0); x.lineTo(W * .44, H); x.stroke();
      x.fillStyle = 'rgba(60,20,100,.12)'; x.fillRect(0, H - 40, W, 40);
      return;
    }
    if(d.cena === 'abobora'){   // Halloween: céu roxo-laranja, lua do lado sem balão, cerquinha e abóboras nas bordas
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#2a1450'); g.addColorStop(.7, '#7a2d6b'); g.addColorStop(1, '#ff8a3d'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      jnT0Lua(x, cx, 60, 30);
      [[cx + (lado ? -60 : 60), 120], [cx + (lado ? -20 : 20), 150]].forEach(function(m){ x.fillStyle = '#1a0a2e'; x.beginPath(); x.moveTo(m[0], m[1]); x.quadraticCurveTo(m[0] - 9, m[1] - 9, m[0] - 18, m[1] - 2); x.quadraticCurveTo(m[0] - 9, m[1] - 2, m[0], m[1] + 4); x.quadraticCurveTo(m[0] + 9, m[1] - 2, m[0] + 18, m[1] - 2); x.quadraticCurveTo(m[0] + 9, m[1] - 9, m[0], m[1]); x.fill(); });
      x.fillStyle = '#1a0a2e'; x.fillRect(0, H - 70, W, 6); for(i = 10; i < W; i += 36){ x.beginPath(); x.moveTo(i - 5, H - 40); x.lineTo(i - 5, H - 90); x.lineTo(i, H - 98); x.lineTo(i + 5, H - 90); x.lineTo(i + 5, H - 40); x.fill(); }
      x.fillStyle = '#3a1f2a'; x.fillRect(0, H - 40, W, 40);
      return;
    }
    if(d.cena === 'portao'){   // véspera da abertura: o portão do TsuLiPa⭐World com bandeirinhas (abaixo dos balões, acima das cabeças)
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#c9a8ff'); g.addColorStop(1, '#ffd6ec'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      var gy = 44, cg2 = x.createLinearGradient(0, 0, 18, 0); x.fillStyle = '#7b3ff0'; jnT0Forma(x, W / 2 - 172, gy + 30, 20, H - gy - 66, 9); x.fill(); jnT0Forma(x, W / 2 + 152, gy + 30, 20, H - gy - 66, 9); x.fill();
      x.fillStyle = '#fff'; x.beginPath(); x.moveTo(W / 2 - 180, gy + 46); x.quadraticCurveTo(W / 2, gy + 6, W / 2 + 180, gy + 46); x.lineTo(W / 2 + 180, gy + 72); x.quadraticCurveTo(W / 2, gy + 32, W / 2 - 180, gy + 72); x.closePath(); x.fill(); x.strokeStyle = '#7b3ff0'; x.lineWidth = 3; x.stroke();
      x.fillStyle = '#7b3ff0'; x.font = '400 15px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TsuLiPa⭐World · 27/10', W / 2, gy + 40); x.textBaseline = 'alphabetic';
      for(i = 0; i < 10; i++){ var bx2 = W / 2 - 160 + i * 34, by2 = gy + 78 + Math.sin(i / 9 * Math.PI) * 10; x.fillStyle = ['#ff6fb5', '#ffd23f', '#b6ff3b', '#4dd8ff', '#9b30d9'][i % 5]; x.beginPath(); x.moveTo(bx2, by2); x.lineTo(bx2 + 22, by2); x.lineTo(bx2 + 11, by2 + 16); x.closePath(); x.fill(); }
      jnT0Forma(x, W / 2 - 148, gy + 98, 296, H - gy - 132, 18); x.fillStyle = 'rgba(255,255,255,.5)'; x.fill();
      x.fillStyle = '#e8d5ff'; x.fillRect(0, H - 40, W, 40);
      return;
    }
    if(d.cena === 'palco'){   // palco do festival: telão com o nome da música, feixes de luz na cor do ano e piso de LED
      var pal = JN_T0_ANO[d.ano] || JN_T0_ANO.draft;
      g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, pal[0]); g.addColorStop(1, '#12082e'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      [[.15, pal[1]], [.38, pal[2]], [.62, pal[1]], [.85, pal[2]]].forEach(function(f){ x.save(); g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, f[1] + 'aa'); g.addColorStop(1, f[1] + '00'); x.fillStyle = g;
        x.beginPath(); x.moveTo(f[0] * W - 10, 0); x.lineTo(f[0] * W + 10, 0); x.lineTo(f[0] * W + 70, H); x.lineTo(f[0] * W - 70, H); x.closePath(); x.fill(); x.restore(); });
      g = x.createLinearGradient(0, H - 70, 0, H); g.addColorStop(0, '#3a1a6e'); g.addColorStop(1, '#12082e'); x.fillStyle = g; x.fillRect(0, H - 70, W, 70);
      var led = x.createLinearGradient(0, 0, W, 0); ['#ff6fb5', '#ffd23f', '#b6ff3b', '#4dd8ff', '#9b30d9'].forEach(function(c, k){ led.addColorStop(k / 4, c); }); x.fillStyle = led; x.fillRect(0, H - 72, W, 4);
      // faixa da frente do palco com a música e o festival (fica entre os pés do trio e a plateia, sem cobrir ninguém)
      x.fillStyle = 'rgba(10,4,30,.55)'; x.fillRect(0, H - 40, W, 40);
      if(d.neve) for(i = 0; i < 30; i++){ x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc((i * 71) % W, (i * 43) % (H - 90), 1.5 + i % 3, 0, 7); x.fill(); }
      return;
    }
  } else {   // camada da frente (na frente dos bonecos)
    if(d.cena === 'palco'){   // plateia de costas com lightsticks nas cores do trio: dá profundidade ao palco
      var cores = ['#9b30d9', '#3cb043', '#4169e1', '#ff6fb5'];
      for(i = 0; i < 14; i++){ var hx = 12 + i * 35 + (i % 2) * 8, hy = H + 12 + (i % 3) * 4, c2 = cores[i % 4];
        x.save(); x.translate(hx + 14, hy - 30); x.rotate((i % 2 ? -.35 : .3)); x.shadowColor = c2; x.shadowBlur = 14; x.fillStyle = c2; x.fillRect(-3, -34, 6, 30); x.fillStyle = '#fff'; x.fillRect(-3, -34, 6, 8); x.restore();
        x.fillStyle = '#1a0a2e'; x.beginPath(); x.arc(hx, hy - 8, 15, Math.PI, 0); x.fill(); x.fillRect(hx - 22, hy - 8, 44, 20); }
      // nome da música e do festival na frente do palco, por cima da plateia (sempre legível)
      var pal2 = JN_T0_ANO[d.ano] || JN_T0_ANO.draft, sub2 = d.ano === 'draft' ? 'BRS48 · 2021' : d.ano === 'world' ? '27/10/2026' : 'UNIT FESTIVAL ' + d.ano, txt2 = d.placa + '  ·  ' + sub2;
      x.save(); x.font = '400 14px "Mochiy Pop One",sans-serif'; var pw = Math.min(W - 30, x.measureText(txt2).width + 36);
      x.beginPath(); x.moveTo(W / 2 - pw / 2 + 14, H - 36); x.arcTo(W / 2 + pw / 2, H - 36, W / 2 + pw / 2, H - 8, 14); x.arcTo(W / 2 + pw / 2, H - 8, W / 2 - pw / 2, H - 8, 14); x.arcTo(W / 2 - pw / 2, H - 8, W / 2 - pw / 2, H - 36, 14); x.arcTo(W / 2 - pw / 2, H - 36, W / 2 + pw / 2, H - 36, 14); x.closePath();
      x.fillStyle = 'rgba(18,8,46,.92)'; x.fill(); x.strokeStyle = pal2[1]; x.lineWidth = 2.5; x.stroke();
      x.shadowColor = pal2[2]; x.shadowBlur = 8; x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt2, W / 2, H - 21, pw - 20); x.restore(); x.textBaseline = 'alphabetic';
      if(d.confete) for(i = 0; i < 36; i++){ x.fillStyle = ['#ff6fb5', '#ffd23f', '#b6ff3b', '#4dd8ff', '#c79bff'][i % 5]; x.save(); x.translate((i * 89) % W, 20 + (i * 47) % (H - 120)); x.rotate(i); x.fillRect(-4, -2, 8, 4); x.restore(); }
      if(d.agua) for(i = 0; i < 22; i++){ x.fillStyle = 'rgba(160,230,255,.8)'; x.beginPath(); var ax = (i * 67) % W, ay = H - 90 - (i * 29) % 120; x.moveTo(ax, ay - 6); x.quadraticCurveTo(ax + 5, ay + 2, ax, ay + 5); x.quadraticCurveTo(ax - 5, ay + 2, ax, ay - 6); x.fill(); }
      return;
    }
    if(d.cena === 'abobora'){ [[34, H - 30, 26], [W - 40, H - 26, 30], [W - 92, H - 18, 18]].forEach(function(a){ x.fillStyle = '#ff8a1f'; x.beginPath(); x.ellipse(a[0], a[1], a[2], a[2] * .8, 0, 0, 7); x.fill(); x.strokeStyle = 'rgba(160,60,0,.5)'; x.lineWidth = 2; x.beginPath(); x.ellipse(a[0], a[1], a[2] * .45, a[2] * .8, 0, 0, 7); x.stroke(); x.fillStyle = '#4f9a00'; x.fillRect(a[0] - 2, a[1] - a[2] * .8 - 8, 5, 9);
      x.fillStyle = '#ffe14d'; x.beginPath(); x.moveTo(a[0] - 10, a[1] - 4); x.lineTo(a[0] - 4, a[1] - 10); x.lineTo(a[0] - 1, a[1] - 3); x.fill(); x.beginPath(); x.moveTo(a[0] + 10, a[1] - 4); x.lineTo(a[0] + 4, a[1] - 10); x.lineTo(a[0] + 1, a[1] - 3); x.fill(); }); return; }
    if(d.cena === 'espelho'){ return; }
  }
}
function jnT0Desenhar(cv, p, d){
  var x = cv.getContext('2d'), W = cv.width, H = cv.height, cor = ['#9b30d9', '#3cb043', '#4169e1'];
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  function rr(a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function linhas(txt, larg){ var ps = String(txt).split(' '), L = [], at = ''; ps.forEach(function(w){ var t = at ? at + ' ' + w : w; if(x.measureText(t).width > larg && at){ L.push(at); at = w; } else at = t; }); if(at) L.push(at); return L; }
  x.save(); rr(0, 0, W, H, 22); x.clip();
  var gente = p[1], n = gente.length, cam = d.cam || 'geral', palco = d.cena === 'palco';
  var ES = cam === 'close' ? 3.1 : n === 1 ? (cam === 'medio' ? 2.35 : 2.1) : n === 2 ? (cam === 'medio' ? 2.05 : 1.9) : (palco ? 1.5 : 1.6);
  var xs = n === 1 ? [cam === 'close' ? .64 : .5] : n === 2 ? [.3, .7] : [.2, .5, .8];
  var chao = cam === 'close' ? H + 44 : palco ? H - 44 : d.cena === 'praia' ? H - 14 : H - 10;
  var falas = p[3], falaX = falas.length ? falas.reduce(function(a, f){ var i = gente.findIndex(function(g){ return g[0] === f[0]; }); return a + (i >= 0 ? xs[i] * W : W / 2); }, 0) / falas.length : null;
  if(cam === 'close') falaX = xs[0] > .5 ? W * .2 : W * .8;   // no close o balão fica do lado oposto ao rosto
  try{ jnT0Cena(x, W, H, d, 'fundo', falaX, chao); }catch(e){}
  var onde = {}, topoCab = {};
  gente.forEach(function(g, i){
    var av = jnCapAv(g[0], g[1]); if(!av) return; var cx = xs[i] * W; onde[g[0]] = cx;
    if(d.expr && d.expr[g[0]] != null) av.expr = d.expr[g[0]];
    var vira = d.vira && d.vira.indexOf(g[0]) >= 0;
    if(cam !== 'close'){ x.fillStyle = 'rgba(40,10,70,.18)'; x.beginPath(); x.ellipse(cx, chao - 4, 30 * ES / 1.6, 6, 0, 0, 7); x.fill(); }
    x.save();
    if(vira){ x.translate(cx, 0); x.scale(-1, 1); x.translate(-cx, 0); }
    x.translate(cx - 52 * ES, chao - 112 * ES + 8); x.scale(ES, ES);
    try{ if(typeof perfDesenharIdol === 'function') perfDesenharIdol(x, 104, 112, av, false, false, 30 + i * 17); }catch(e){}
    x.restore();
    topoCab[g[0]] = chao - 112 * ES + 8 + 28 * ES;   // ~altura do alto da cabeça
  });
  try{ jnT0Cena(x, W, H, d, 'frente', falaX, chao); }catch(e){}
  var topo = 12;
  if(p[2]){   // narração
    x.font = '800 15px "M PLUS Rounded 1c",sans-serif'; var nl = linhas(jnCapT(p[2]), W - 70), nh = jnNarracao(x, rr, W, nl, 19);
    topo = 10 + nh + 10;
  }
  falas.forEach(function(f, i){   // balão: no close, ao lado do rosto; na conversa, um de cada lado; o rabinho aponta para quem fala
    var cx = onde[f[0]] != null ? onde[f[0]] : W / 2;
    x.font = '800 16px "M PLUS Rounded 1c",sans-serif'; var bl = linhas(jnCapT(f[1]), cam === 'close' ? 170 : 190), bw = Math.max.apply(null, bl.map(function(l){ return x.measureText(l).width; })) + 28, bh = bl.length * 20 + 14;
    var bx, by = topo;
    if(cam === 'close'){ bx = cx > W / 2 ? Math.max(10, cx - 110 - bw) : Math.min(W - bw - 10, cx + 110); by = d.cena === 'espelho' ? topo + 6 : Math.max(topo, 70); }   // no espelho o balão sobe para mostrar o reflexo
    else if(falas.length > 1){ bx = i ? Math.min(W - bw - 10, Math.max(W / 2 + 6, cx - bw / 2)) : Math.max(10, Math.min(W / 2 - 6 - bw, cx - bw / 2)); by = topo + (i ? 10 : 0); }
    else bx = Math.max(10, Math.min(W - bw - 10, cx - bw / 2));
    var cab = topoCab[f[0]] != null ? topoCab[f[0]] : H / 2;
    if(cam !== 'close' && by + bh + 18 > cab) by = Math.max(topo, cab - bh - 20);   // nunca em cima do rosto
    jnBalaoFundo(x, rr, bx, by, bw, bh, cor[f[0]]); x.lineWidth = 2.5;
    var tx, ty, px2, py2;
    if(cam === 'close'){ ty = by + bh / 2; tx = cx > bx ? bx + bw : bx; px2 = tx + (cx > bx ? 18 : -18); py2 = ty + 10;
      x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx, ty - 9); x.lineTo(px2, py2); x.lineTo(tx, ty + 9); x.closePath(); x.fill(); x.strokeStyle = cor[f[0]]; x.beginPath(); x.moveTo(tx, ty - 9); x.lineTo(px2, py2); x.lineTo(tx, ty + 9); x.stroke();
      x.fillStyle = '#fff'; x.fillRect(tx + (cx > bx ? -3 : 0), ty - 7, 3, 14); }
    else { tx = Math.max(bx + 18, Math.min(bx + bw - 18, cx)); var dx = cx > tx ? 10 : cx < tx ? -10 : 0;
      x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx - 9, by + bh - 2); x.lineTo(tx + dx, by + bh + 16); x.lineTo(tx + 9, by + bh - 2); x.closePath(); x.fill();
      x.strokeStyle = cor[f[0]]; x.beginPath(); x.moveTo(tx - 9, by + bh); x.lineTo(tx + dx, by + bh + 16); x.lineTo(tx + 9, by + bh); x.stroke(); }
    x.fillStyle = JN_TINTA; x.textAlign = 'center'; x.textBaseline = 'top'; bl.forEach(function(l, k){ x.fillText(l, bx + bw / 2, by + 8 + k * 20); });
  });
  x.restore();
  jnMoldura(x, rr, W, H);
}
function jnCapDesenhar(cv, p, temporada){
  if(!temporada && p && p.jnT0) return jnT0Desenhar(cv, p, p.jnT0);   // temporada 0: direção de cena própria
  var x = cv.getContext('2d'), W = cv.width, H = cv.height, cor = ['#9b30d9', '#3cb043', '#4169e1'];
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, W, H);
  function rr(a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function linhas(txt, larg){ var ps = String(txt).split(' '), L = [], at = ''; ps.forEach(function(w){ var t = at ? at + ' ' + w : w; if(x.measureText(t).width > larg && at){ L.push(at); at = w; } else at = t; }); if(at) L.push(at); return L; }
  x.save(); rr(0, 0, W, H, 22); x.clip();
  try{ if(typeof perfFundo === 'function') perfFundo(x, W, H, p[0], '#ff6fb5', 0); else throw 0; }catch(e){ var g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f3e9ff'); g.addColorStop(1, '#ffe6f4'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
  var gente = p[1], n = gente.length, ES = n === 1 ? 2.2 : n === 2 ? 1.95 : 1.65, xs = n === 1 ? [.5] : n === 2 ? [.3, .7] : [.2, .5, .8], chao = H - 6, onde = {};
  var cenaT1 = temporada && p[4] && typeof jnT1Cenario === 'function' ? p[4] : null;
  if(cenaT1) try{ jnT1Cenario(x, W, H, cenaT1, 'fundo', xs.map(function(v){ return v * W; }), ES, chao); }catch(e){}
  gente.forEach(function(g, i){
    var av = jnCapAv(g[0], g[1]); if(!av) return; var cx = xs[i] * W; onde[g[0]] = cx;
    x.fillStyle = 'rgba(40,10,70,.16)'; x.beginPath(); x.ellipse(cx, chao - 4, 30 * ES / 1.6, 6, 0, 0, 7); x.fill();
    x.save();
    if(temporada && n > 1){ var incl = (i - (n - 1) / 2) * -.05; x.translate(cx, chao); x.rotate(incl); x.translate(-cx, -chao); }   // os personagens se inclinam um para o outro
    x.translate(cx - 52 * ES, chao - 112 * ES + 8); x.scale(ES, ES);
    try{ if(typeof perfDesenharIdol === 'function') perfDesenharIdol(x, 104, 112, av, false, false, 30 + i * 17); }catch(e){}
    x.restore();
  });
  if(cenaT1) try{ jnT1Cenario(x, W, H, cenaT1, 'frente', xs.map(function(v){ return v * W; }), ES, chao); }catch(e){}
  var topoFala = p[2] ? 64 : 14;
  if(p[2]){   // narração: caixinha amarela no canto, como nos mangás
    var nlh = temporada ? 17 : 19; x.font = '800 ' + (temporada ? 14 : 15) + 'px "M PLUS Rounded 1c",sans-serif'; var nl = linhas(jnCapT(p[2]), W - 60), nh = nl.length * nlh + 14;
    nl = linhas(jnCapT(p[2]), W - 70); nh = jnNarracao(x, rr, W, nl, nlh);
    topoFala = 10 + nh + 10;
  }
  var proximaFalaY = topoFala;
  p[3].forEach(function(f, i){   // balões de fala com rabinho apontando para quem fala
    var cx = onde[f[0]] != null ? onde[f[0]] : W / 2;
    var flh = temporada ? 18 : 20; x.font = '800 ' + (temporada ? 15 : 16) + 'px "M PLUS Rounded 1c",sans-serif'; var bl = linhas(jnCapT(f[1]), temporada ? 196 : 190), bw = Math.max.apply(null, bl.map(function(l){ return x.measureText(l).width; })) + 26, bh = bl.length * flh + 14;
    var bx = Math.max(8, Math.min(W - bw - 8, cx - bw / 2 + (p[3].length > 1 ? (i ? 30 : -30) : 0))), by = topoFala + (p[3].length > 1 && i ? 8 : 0);
    if(p[3].length > 1 && i) by = topoFala + 6;
    if(temporada && p[3].length === 2){by = topoFala; bx = i ? Math.max(W / 2 + 4, Math.min(W - bw - 8, cx - bw / 2)) : Math.max(8, Math.min(W / 2 - 4 - bw, cx - bw / 2));}
    else if(temporada){by = proximaFalaY;proximaFalaY += bh + 8;}
    jnBalaoFundo(x, rr, bx, by, bw, bh, cor[f[0]]); x.lineWidth = 2.5;
    var tx = Math.max(bx + 18, Math.min(bx + bw - 18, cx));
    x.fillStyle = '#fff'; x.beginPath(); x.moveTo(tx - 9, by + bh - 2); x.lineTo(tx + (cx > tx ? 10 : cx < tx ? -10 : 0), by + bh + 16); x.lineTo(tx + 9, by + bh - 2); x.closePath(); x.fill();
    x.strokeStyle = cor[f[0]]; x.beginPath(); x.moveTo(tx - 9, by + bh); x.lineTo(tx + (cx > tx ? 10 : cx < tx ? -10 : 0), by + bh + 16); x.lineTo(tx + 9, by + bh); x.stroke();
    x.fillStyle = JN_TINTA; x.textAlign = 'center'; x.textBaseline = 'top'; bl.forEach(function(l, k){ x.fillText(l, bx + bw / 2, by + 8 + k * flh); });
  });
  x.restore();
  jnMoldura(x, rr, W, H);
}

/* Tocar num quadro do quadrinho abre ele grande, na largura toda da tela (em 320px o quadro na página fica pequeno demais para ler).
   Vale para os capítulos antigos e para a temporada. Fecha tocando de novo, no ✕ ou com Esc. */
var JN_ZOOM_TX = {fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'とじる'},dica:{pt:'Toque no quadro para ampliar',en:'Tap a panel to enlarge',es:'Toca la viñeta para ampliar',id:'Ketuk panel untuk memperbesar',th:'แตะช่องเพื่อขยาย',ja:'コマをタップで拡大'}};
function jnQuadroZoom(cv){
  if(!cv || typeof document === 'undefined') return;
  var url; try{ url = cv.toDataURL('image/png'); }catch(e){ return; }
  // celular em pé: o quadro deita (gira 90°) para usar a altura da tela — fica ~2,5× maior
  var gira = typeof innerWidth === 'number' && innerWidth < innerHeight && innerWidth < 600;
  var ov = document.createElement('div'); ov.className = 'jnzoom' + (gira ? ' jnzoom-gira' : ''); ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', cv.getAttribute('aria-label') || '');
  var leg = '', fig = cv.closest && cv.closest('figure'), cap = fig && fig.querySelector('figcaption'); if(cap) leg = cap.innerHTML;
  ov.innerHTML = '<button type="button" class="jnzoomx" aria-label="' + escHtml(jnCapT(JN_ZOOM_TX.fechar)) + '">✕</button><img alt="" src="' + url + '">' + (leg ? '<div class="jnzoomleg">' + leg + '</div>' : '');
  var antes = document.activeElement;
  function fechar(){ ov.remove(); document.removeEventListener('keydown', tecla); try{ antes && antes.focus && antes.focus(); }catch(e){} }
  function tecla(e){ if(e.key === 'Escape') fechar(); }
  ov.addEventListener('click', fechar); document.addEventListener('keydown', tecla);
  document.body.appendChild(ov); try{ ov.querySelector('.jnzoomx').focus(); }catch(e){}
}
if(typeof document !== 'undefined') document.addEventListener('click', function(e){
  var cv = e.target && e.target.closest && e.target.closest('.jncapq canvas, .jn-t1 canvas'); if(cv) jnQuadroZoom(cv);
});
