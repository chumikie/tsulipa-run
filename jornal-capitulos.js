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
