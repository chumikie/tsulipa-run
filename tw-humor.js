/* TsuLiPa⭐World · Humor do Idol, Desejo do dia e Diamantinho (15/11/2026, visual de celular).
   Ideia do The Sims com regra nossa: as barrinhas são só um jeitinho de dar motivo para variar os jogos.
   Nada aqui mexe em estrelas, ranking ou save do servidor; tudo fica neste aparelho (brs48cr_humor_v1).
   Ao cumprir o Desejo do dia, a pessoa ganha o passe do dia do Camarim VIP (aberto para todo mundo, sem dinheiro). */
(function(){
  'use strict';
  var CHAVE = 'brs48cr_humor_v1';
  var BARRAS = ['energia', 'diversao', 'brilho', 'amizade'];
  var TX = {
    intro:{"pt": "O Humor acompanha o ritmo do seu Idol. Varie as atividades e dê tempo para descansar.", "en": "Mood follows your Idol’s daily rhythm. Try different activities and make time to rest.", "es": "El Ánimo acompaña el ritmo de tu Idol. Varía las actividades y deja tiempo para descansar.", "id": "Mood mengikuti keseharian Idol-mu. Coba beragam aktivitas dan luangkan waktu untuk istirahat.", "th": "อารมณ์เปลี่ยนตามกิจกรรมของไอดอล ลองทำกิจกรรมหลากหลายและพักบ้าง", "ja": "きぶんはアイドルの毎日のリズム。いろいろ遊んで、休む時間もとろう。"},
    como:{"pt": "Como cuidar do Humor", "en": "How to care for your mood", "es": "Cómo cuidar el Ánimo", "id": "Cara menjaga Mood", "th": "ดูแลอารมณ์อย่างไร", "ja": "きぶんのととのえ方"},
    energiaAjuda:{"pt": "Volta com o tempo de descanso. Café e Jardim também ajudam.", "en": "Recovers with rest over time. The Café and Garden help too.", "es": "Se recupera descansando. El Café y el Jardín también ayudan.", "id": "Pulih seiring waktu saat istirahat. Kafe dan Taman juga membantu.", "th": "ฟื้นเมื่อได้พัก คาเฟ่และสวนช่วยได้เช่นกัน", "ja": "時間をおいて休むと回復。カフェやお庭も役立つよ。"},
    diversaoAjuda:{"pt": "Sobe quando você joga e realiza atividades.", "en": "Rises when you play and complete activities.", "es": "Sube cuando juegas y realizas actividades.", "id": "Naik saat bermain dan melakukan aktivitas.", "th": "เพิ่มเมื่อเล่นเกมและทำกิจกรรม", "ja": "ゲームや活動をすると上がるよ。"},
    brilhoAjuda:{"pt": "Cantar, fazer shows e tirar fotos ajudam seu Idol a brilhar.", "en": "Singing, performing and taking photos help your Idol shine.", "es": "Cantar, dar shows y tomar fotos ayudan a tu Idol a brillar.", "id": "Bernyanyi, tampil, dan berfoto membuat Idol-mu bersinar.", "th": "ร้องเพลง แสดงโชว์ และถ่ายรูปช่วยให้ไอดอลเปล่งประกาย", "ja": "歌やライブ、写真でアイドルをかがやかせよう。"},
    amizadeAjuda:{"pt": "Encontros, cuidados e interações fazem essa barrinha subir.", "en": "Meetings, care and interactions raise this bar.", "es": "Los encuentros, cuidados e interacciones hacen subir esta barra.", "id": "Pertemuan, perawatan, dan interaksi menaikkan bar ini.", "th": "การพบปะ ดูแล และพูดคุยช่วยเพิ่มแถบนี้", "ja": "出会いやおせわ、交流で上がるよ。"},
    regra:{"pt": "O desejo só conta quando você realiza a ação. Abrir a tela não basta. Cumpri-lo libera o Camarim VIP de hoje.", "en": "A wish counts only when you perform the action. Opening its screen is not enough. Completing it unlocks today’s VIP Room.", "es": "El deseo cuenta al realizar la acción, no solo al abrir la pantalla. Cumplirlo abre el Camerino VIP de hoy.", "id": "Keinginan terpenuhi setelah aksinya dilakukan, bukan hanya membuka layar. Selesaikan untuk membuka Ruang VIP hari ini.", "th": "ต้องทำกิจกรรมจริงจึงจะสมหวัง แค่เปิดหน้าไม่พอ ทำสำเร็จเพื่อเปิดห้อง VIP วันนี้", "ja": "画面を開くだけでは達成にならないよ。実際に行動すると、きょうのVIP楽屋が開きます。"},
    vipSim:{"pt": "Camarim VIP liberado hoje", "en": "VIP Room unlocked today", "es": "Camerino VIP abierto hoy", "id": "Ruang VIP terbuka hari ini", "th": "ห้อง VIP เปิดแล้ววันนี้", "ja": "きょうのVIP楽屋は開いています"},
    vipNao:{"pt": "Camarim VIP: cumpra o desejo de hoje", "en": "VIP Room: complete today’s wish", "es": "Camerino VIP: cumple el deseo de hoy", "id": "Ruang VIP: penuhi keinginan hari ini", "th": "ห้อง VIP: ทำความปรารถนาวันนี้ให้สำเร็จ", "ja": "VIP楽屋：きょうのおねがいをかなえよう"},
    efeitos:{"pt": "O cristal mostra a média das quatro barrinhas. Elas não mudam seus pontos, estrelas ou acesso aos jogos. Este progresso fica neste aparelho.", "en": "The crystal shows the average of the four bars. They do not change your scores, stars or access to games. This progress stays on this device.", "es": "El cristal muestra el promedio de las cuatro barras. No cambian tus puntos, estrellas ni acceso a los juegos. Este progreso queda en este dispositivo.", "id": "Kristal menunjukkan rata-rata empat bar. Bar tidak mengubah skor, bintang, atau akses game. Progres ini tersimpan di perangkat ini.", "th": "คริสตัลแสดงค่าเฉลี่ยของทั้งสี่แถบ ไม่เปลี่ยนคะแนน ดาว หรือสิทธิ์เข้าเกม ความคืบหน้านี้อยู่ในอุปกรณ์นี้", "ja": "クリスタルは4本のバーの平均。スコアやスター、ゲームへのアクセスは変わりません。この進みぐあいはこの端末に保存されます。"},
    corGuia:{"pt": "Verde: 60–100 · Amarelo: 35–59 · Rosa: abaixo de 35.", "en": "Green: 60–100 · Yellow: 35–59 · Pink: below 35.", "es": "Verde: 60–100 · Amarillo: 35–59 · Rosa: menos de 35.", "id": "Hijau: 60–100 · Kuning: 35–59 · Merah muda: di bawah 35.", "th": "เขียว: 60–100 · เหลือง: 35–59 · ชมพู: ต่ำกว่า 35", "ja": "緑：60〜100・黄：35〜59・ピンク：35未満。"},
    humor:{pt:'Humor do seu Idol',en:"Your Idol's mood",es:'Ánimo de tu Idol',id:'Mood Idol-mu',th:'อารมณ์ไอดอลของคุณ',ja:'アイドルのきぶん'},
    energia:{pt:'Energia',en:'Energy',es:'Energía',id:'Energi',th:'พลังงาน',ja:'げんき'},
    diversao:{pt:'Diversão',en:'Fun',es:'Diversión',id:'Seru',th:'ความสนุก',ja:'たのしさ'},
    brilho:{pt:'Brilho',en:'Sparkle',es:'Brillo',id:'Kilau',th:'ประกาย',ja:'キラキラ'},
    amizade:{pt:'Amizade',en:'Friendship',es:'Amistad',id:'Pertemanan',th:'มิตรภาพ',ja:'なかよし'},
    desejo:{pt:'Desejo do dia',en:'Wish of the day',es:'Deseo del día',id:'Keinginan hari ini',th:'ความปรารถนาประจำวัน',ja:'きょうのおねがい'},
    feito:{pt:'Desejo cumprido!',en:'Wish granted!',es:'¡Deseo cumplido!',id:'Keinginan terkabul!',th:'สมหวังแล้ว!',ja:'おねがいかなった！'},
    serie:{pt:'{n} dia(s) seguido(s)',en:'{n}-day streak',es:'{n} día(s) seguido(s)',id:'{n} hari berturut-turut',th:'ติดต่อกัน {n} วัน',ja:'{n}日れんぞく'},
    ir:{pt:'Ir',en:'Go',es:'Ir',id:'Ayo',th:'ไป',ja:'いく'},
    dica:{pt:'Jogar enche as barrinhas; a Energia volta sozinha descansando.',en:'Playing fills the bars; Energy comes back by resting.',es:'Jugar llena las barras; la Energía vuelve descansando.',id:'Bermain mengisi bar; Energi pulih sendiri saat istirahat.',th:'เล่นเกมเพื่อเติมแถบ พลังงานจะฟื้นเองเมื่อพัก',ja:'あそぶとバーがたまります。げんきは休むともどります。'},
    app:{pt:'Humor',en:'Mood',es:'Ánimo',id:'Mood',th:'อารมณ์',ja:'きぶん'},
    recados:{pt:'Recados do TsuLiPa',en:'Notes from TsuLiPa',es:'Mensajes de TsuLiPa',id:'Pesan dari TsuLiPa',th:'ข้อความจาก TsuLiPa',ja:'TsuLiPaからのメッセージ'},
    semRecado:{pt:'Cumpra o desejo do dia e o trio manda um recado aqui!',en:"Grant today's wish and the trio sends you a note here!",es:'¡Cumple el deseo del día y el trío te manda un mensaje aquí!',id:'Penuhi keinginan hari ini dan trio akan mengirim pesan di sini!',th:'ทำความปรารถนาวันนี้ให้สำเร็จ แล้วทั้งสามจะส่งข้อความมาที่นี่!',ja:'きょうのおねがいをかなえると、ここにトリオからメッセージがとどくよ！'},
    premios:{pt:'Prêmios do camarim',en:'Dressing room prizes',es:'Premios del camerino',id:'Hadiah ruang rias',th:'รางวัลห้องแต่งตัว',ja:'楽屋のごほうび'},
    pTrofeu:{pt:'Troféu na estante (3 dias seguidos)',en:'Shelf trophy (3-day streak)',es:'Trofeo en la estantería (3 días seguidos)',id:'Piala di rak (3 hari berturut-turut)',th:'ถ้วยรางวัลบนชั้น (ติดต่อกัน 3 วัน)',ja:'たなのトロフィー（3日れんぞく）'},
    pEspelho:{pt:'Espelho VIP com lâmpadas (7 dias seguidos)',en:'VIP mirror lights (7-day streak)',es:'Espejo VIP con luces (7 días seguidos)',id:'Cermin VIP berlampu (7 hari berturut-turut)',th:'กระจก VIP มีไฟ (ติดต่อกัน 7 วัน)',ja:'VIPミラーのライト（7日れんぞく）'},
    pTapete:{pt:'Tapete vermelho (foto no Camarim VIP)',en:'Red carpet (photo in the VIP Room)',es:'Alfombra roja (foto en el Camerino VIP)',id:'Karpet merah (foto di Ruang VIP)',th:'พรมแดง (ถ่ายรูปในห้อง VIP)',ja:'レッドカーペット（VIP楽屋で写真）'},
    fotoVip:{pt:'Sua foto VIP',en:'Your VIP photo',es:'Tu foto VIP',id:'Foto VIP-mu',th:'รูป VIP ของคุณ',ja:'あなたのVIP写真'},
    baixar:{pt:'Baixar foto',en:'Download photo',es:'Descargar foto',id:'Unduh foto',th:'ดาวน์โหลดรูป',ja:'写真を保存'},
    novoRecado:{pt:'📱 Recado novo do {n} no TsuPhone!',en:'📱 New note from {n} on the TsuPhone!',es:'📱 ¡Mensaje nuevo de {n} en el TsuPhone!',id:'📱 Pesan baru dari {n} di TsuPhone!',th:'📱 ข้อความใหม่จาก {n} ใน TsuPhone!',ja:'📱 TsuPhoneに{n}からメッセージ！'},
    cansado:{pt:'Seu Idol está cansadinho: que tal o Café ou o Jardim?',en:'Your Idol is a bit tired: how about the Café or the Garden?',es:'Tu Idol está cansadito: ¿qué tal el Café o el Jardín?',id:'Idol-mu agak lelah: coba Kafe atau Taman?',th:'ไอดอลเหนื่อยนิดหน่อย ลองไปคาเฟ่หรือสวนไหม?',ja:'すこしおつかれ。カフェかお庭はどう？'}
  };
  // desejos: [chave, jogo/evento que cumpre, ícone, texto]
  var DESEJOS = [
    ['karaoke', 'karaoke', '🎤', {pt:'Quero cantar uma música no Karaoke',en:'I want to sing a song at Karaoke',es:'Quiero cantar una canción en el Karaoke',id:'Aku mau nyanyi satu lagu di Karaoke',th:'อยากร้องเพลงในคาราโอเกะ',ja:'カラオケで1曲うたいたい'}],
    ['run', 'run', '🏁', {pt:'Quero correr no Center⭐Run!',en:'I want to run in Center⭐Run!',es:'Quiero correr en Center⭐Run!',id:'Aku mau lari di Center⭐Run!',th:'อยากวิ่งใน Center⭐Run!',ja:'Center⭐Run!で走りたい'}],
    ['sora', 'sora', '☁️', {pt:'Quero pular entre as nuvens',en:'I want to jump through the clouds',es:'Quiero saltar entre las nubes',id:'Aku mau lompat di antara awan',th:'อยากกระโดดบนก้อนเมฆ',ja:'雲の上をジャンプしたい'}],
    ['cafe', 'cafe', '🧋', {pt:'Quero preparar um shake no Café',en:'I want to make a shake at the Café',es:'Quiero preparar un batido en el Café',id:'Aku mau bikin shake di Kafe',th:'อยากทำเชคที่คาเฟ่',ja:'カフェでシェイクを作りたい'}],
    ['battle', 'battle', '🎀', {pt:'Quero fazer um show no Idol⭐Battle!',en:'I want to do a show in Idol⭐Battle!',es:'Quiero hacer un show en Idol⭐Battle!',id:'Aku mau tampil di Idol⭐Battle!',th:'อยากโชว์ใน Idol⭐Battle!',ja:'Idol⭐Battle!でライブしたい'}],
    ['studio', 'studio', '📸', {pt:'Quero tirar uma foto no Studio',en:'I want to take a photo at the Studio',es:'Quiero tomar una foto en el Studio',id:'Aku mau foto di Studio',th:'อยากถ่ายรูปที่สตูดิโอ',ja:'スタジオで写真をとりたい'}],
    ['handshake', 'handshake', '🤝', {pt:'Quero encontrar fãs no Handshake',en:'I want to meet fans at Handshake',es:'Quiero ver fans en el Handshake',id:'Aku mau ketemu fans di Handshake',th:'อยากพบแฟนๆ ที่แฮนด์เชค',ja:'握手会でファンに会いたい'}],
    ['bloom', 'bloom', '🌷', {pt:'Quero cuidar do jardim',en:'I want to tend the garden',es:'Quiero cuidar el jardín',id:'Aku mau merawat taman',th:'อยากดูแลสวน',ja:'お庭のおせわをしたい'}],
    ['mapa', 'mapa', '🗺️', {pt:'Quero passear por uma rua do mapa',en:'I want to stroll down a street on the map',es:'Quiero pasear por una calle del mapa',id:'Aku mau jalan-jalan di peta',th:'อยากเดินเล่นบนแผนที่',ja:'マップの通りをおさんぽしたい'}],
    ['oi', 'frase', '💬', {pt:'Quero dizer oi para alguém no mapa',en:'I want to say hi to someone on the map',es:'Quiero saludar a alguien en el mapa',id:'Aku mau menyapa seseorang di peta',th:'อยากทักทายใครสักคนบนแผนที่',ja:'マップでだれかにあいさつしたい'}]
  ];
  // recados do trio quando o desejo é cumprido (o Tsu e o Pati falam no masculino; a Lirika, no feminino)
  var RECADOS = [
    ['Tsu', '💜', [{pt:'Oiê! Vi que você cumpriu o desejo de hoje. Tô orgulhoso!',en:"Oiê! I saw you granted today's wish. So proud of you!",es:'¡Oiê! Vi que cumpliste el deseo de hoy. ¡Qué orgullo!',id:'Oiê! Aku lihat kamu memenuhi keinginan hari ini. Bangga banget!',th:'โอ้ย! เห็นแล้วนะว่าทำความปรารถนาวันนี้สำเร็จ ภูมิใจมาก!',ja:'オイエ！きょうのおねがい、かなえたね。ほこらしいよ！'},
      {pt:'Mais um dia de brilho! Bora comemorar com um pudim?',en:'Another day of sparkle! Celebrate with some pudding?',es:'¡Otro día brillando! ¿Celebramos con un flan?',id:'Satu hari lagi berkilau! Rayakan pakai puding?',th:'อีกวันที่เปล่งประกาย! ฉลองด้วยพุดดิ้งไหม?',ja:'きょうもキラキラ！プリンでおいわいしよう？'}]],
    ['Lirika', '💚', [{pt:'E! Nani kore? Você conseguiu! Tô muito orgulhosa!',en:'E! Nani kore? You did it! I am so proud!',es:'¡E! ¿Nani kore? ¡Lo lograste! ¡Estoy muy orgullosa!',id:'E! Nani kore? Kamu berhasil! Aku bangga banget!',th:'เอ๊ะ! นานิโคเระ? ทำได้แล้ว! ภูมิใจมาก!',ja:'え！なにこれ？できたね！すっごくうれしい！'},
      {pt:'Desejo cumprido! Amanhã tem mais, yoroshiku~',en:'Wish granted! More tomorrow, yoroshiku~',es:'¡Deseo cumplido! Mañana hay más, yoroshiku~',id:'Keinginan terkabul! Besok ada lagi, yoroshiku~',th:'สมหวังแล้ว! พรุ่งนี้มีอีกนะ โยโรชิกุ~',ja:'おねがいかなった！またあしたね、よろしく〜'}]],
    ['Pati', '💙', [{pt:'Conte com o Pati: hoje você brilhou demais!!',en:'Count on Pati: you shined so much today!!',es:'Cuenta con el Pati: ¡hoy brillaste muchísimo!!',id:'Andalkan Pati: hari ini kamu bersinar banget!!',th:'มีปาติอยู่ทั้งคน: วันนี้คุณเปล่งประกายสุดๆ!!',ja:'パチにまかせて：きょうはすっごくかがやいてた！！'},
      {pt:'Arrasou no desejo de hoje! Beijinhos e Patchau!!',en:"You nailed today's wish! Kisses and Patchau!!",es:'¡Arrasaste con el deseo de hoy! ¡Besitos y Patchau!!',id:'Keren banget hari ini! Muah dan Patchau!!',th:'เยี่ยมมากวันนี้! จุ๊บๆ และพัตจาว!!',ja:'きょうのおねがい、さいこう！チュッとパッチャウ！！'}]]
  ];
  // o que cada jogo faz nas barrinhas: [energia, diversão, brilho, amizade]
  var EFEITO = {run:[-8, 16, 10, 0], karaoke:[-8, 14, 16, 4], sora:[-7, 18, 6, 0], cafe:[4, 12, 4, 8], battle:[-9, 12, 18, 4], studio:[-3, 10, 14, 6],
    handshake:[-5, 10, 8, 16], bloom:[8, 8, 4, 6], duo:[-3, 12, 6, 16], pet:[4, 8, 2, 12], gacha:[0, 10, 6, 0], mapa:[2, 6, 0, 6], frase:[0, 4, 2, 12], coracao:[0, 2, 2, 10]};
  // Ações confirmadas pelo servidor. Visitantes usam o resultado local da ação, nunca a abertura.
  var RPC_JOGO = {terminar_corrida:'run', kt_run_finish:'karaoke', sora_run_finish:'sora', cafe_run_etapa:'cafe', cafe_concluir:'cafe', handshake_run_finish:'handshake',
    handshake_premio:'handshake', studio_clique:'studio', jardim_regar:'bloom', jardim_colher:'bloom',
    jardim_plantar:'bloom', duo_registrar:'duo', gacha_girar:'gacha', dar_coracao:'coracao'};
  var DESCOBERTA = {battle:1, studio:1, bloom:1};
  var TREINO_VISITANTE = {run:1, cafe:1, battle:1, studio:1, handshake:1, mapa:1, frase:1};

  function lang(){ return typeof LANG === 'string' ? LANG : 'pt'; }
  function t(k, n){ var d = TX[k], s = d ? (d[lang()] || d.pt) : k;
    // O celular leva o nome do Idol de quem joga ("SamiPhone"); sem conta, TsuPhone (petPhoneNome, pet.js).
    try{ if(typeof petPhoneNome === 'function') s = s.split('TsuPhone').join(petPhoneNome()); }catch(e){}
    return n != null ? s.replace('{n}', n) : s; }
  function hoje(){ var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function ontem(){ var d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function nickSemente(){ try{ return logado() ? String(contaJ.nick || '') : 'visitante'; }catch(e){ return 'visitante'; } }
  function hash(s){ var h = 2166136261; for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function limita(v){ return Math.max(5, Math.min(100, Math.round(v))); }

  // O formato antigo é compartilhado e não identifica o proprietário.
  // Conservar os dados originais sem atribuí-los a quem entrar primeiro.
  function chavePessoal(base){
    if(!logado()) return base + ':visitante';
    var uid = typeof contaAuthUserId === 'string' && contaAuthUserId || contaJ.id;
    return base + (uid ? ':id:' + uid : ':nick:' + nickSemente());
  }
  var est, donoLido;
  function ler(){
    donoLido = chavePessoal(CHAVE);
    try{ est = JSON.parse(localStorage.getItem(donoLido) || 'null'); }catch(e){ est = null; }
    if(!est || typeof est !== 'object') est = {energia:80, diversao:55, brilho:50, amizade:50, ts:Date.now(), serie:0, ultimo:'', vip:'', desejo:null};
    BARRAS.forEach(function(b){ if(typeof est[b] !== 'number') est[b] = 50; });
    passarTempo();
  }
  function salvar(){ try{ localStorage.setItem(chavePessoal(CHAVE), JSON.stringify(est)); }catch(e){} }
  function passarTempo(){   // o tempo passa: a energia descansa, o resto baixa devagarzinho
    var h = Math.max(0, Math.min(48, (Date.now() - (+est.ts || Date.now())) / 36e5));
    est.energia = limita(est.energia + h * 10); est.diversao = limita(est.diversao - h * 5);
    est.brilho = limita(est.brilho - h * 3); est.amizade = limita(est.amizade - h * 3);
    est.ts = Date.now();
  }
  function disponivel(d){
    if(!logado() && !TREINO_VISITANTE[d[1]]) return false;
    if(d[1] === 'mapa' || d[1] === 'frase') return true;
    var c = document.querySelector('#hubCards [data-ir="' + d[1] + '"]') || document.querySelector('#hubCards [data-twnovo="' + d[1] + '"]');
    return !!c || d[1] === 'battle' || d[1] === 'studio' || d[1] === 'bloom';
  }
  function desejoHoje(){
    var dia = hoje();
    if(est.desejo && est.desejo.dia === dia && (est.desejo.logado === logado())) return est.desejo;
    var lista = DESEJOS.filter(disponivel); if(!lista.length) lista = DESEJOS;
    // descoberta: os jogos menos jogados (Battle, Studio e Bloom) têm o dobro de chance de virar o desejo do dia
    lista = lista.concat(lista.filter(function(x){ return DESCOBERTA[x[1]]; }));
    var d = lista[hash(dia + '|' + nickSemente()) % lista.length];
    est.desejo = {dia:dia, k:d[0], ev:d[1], feito:false, logado:logado()}; salvar();
    return est.desejo;
  }
  function media(){ return (est.energia + est.diversao + est.brilho + est.amizade) / 4; }
  function cor(){ var m = media(); return m >= 60 ? '#7be35a' : m >= 35 ? '#ffd23f' : '#ff6fb5'; }

  var ouvintes = [];
  // ouvintes recebem (tipo, jogo, fraco): o tw-bairro.js usa o jogo para contar o bico da rua
  function avisar(tipo, ev, fraco){ ouvintes.forEach(function(f){ try{ f(tipo, ev, fraco); }catch(e){} }); }
  function evento(ev, fraco){
    ler();
    var ef = EFEITO[ev]; if(ef){ var k = fraco ? .5 : 1; BARRAS.forEach(function(b, i){ est[b] = limita(est[b] + ef[i] * k); }); }
    var d = desejoHoje(), cumpriu = false;
    if(!fraco && !d.feito && d.ev === ev){
      d.feito = true; cumpriu = true;
      est.serie = est.ultimo === ontem() ? (+est.serie || 0) + 1 : (est.ultimo === hoje() ? +est.serie || 1 : 1);
      est.ultimo = hoje(); est.vip = hoje(); est.maxSerie = Math.max(+est.maxSerie || 0, est.serie);
      var hm = hash(hoje() + '|recado'), quem = RECADOS[hm % 3], fala = quem[2][(hm >>> 3) % quem[2].length];
      est.recados = [{dia:hoje(), k:hm % 3, m:(hm >>> 3) % quem[2].length, lido:false}].concat(est.recados || []).slice(0, 7);
      est.ultimoRecado = quem[0];
      BARRAS.forEach(function(b){ est[b] = limita(est[b] + 15); });
    }
    salvar(); avisar(cumpriu ? 'desejo' : 'humor', ev, !!fraco);
  }

  var H = window.TW_HUMOR = {
    barras:BARRAS, t:t,
    estado:function(){ ler(); return {energia:est.energia, diversao:est.diversao, brilho:est.brilho, amizade:est.amizade, media:media(), cor:cor(), serie:+est.serie || 0}; },
    cor:function(){ if(!est || donoLido !== chavePessoal(CHAVE)) ler(); return cor(); },
    desejo:function(){ ler(); var d = desejoHoje(), def = DESEJOS.filter(function(x){ return x[0] === d.k; })[0] || DESEJOS[0];
      return {k:d.k, ev:d.ev, icone:def[2], texto:def[3][lang()] || def[3].pt, feito:!!d.feito, serie:+est.serie || 0}; },
    vipHoje:function(){ ler(); return est.vip === hoje(); },
    cansado:function(){ ler(); return est.energia < 25; },
    evento:evento,
    ultimoRecado:function(){ ler(); return est.ultimoRecado || ''; },
    mensagensNovas:function(){ ler(); return (est.recados || []).filter(function(r){ return !r.lido; }).length; },
    mensagensLidas:function(){ ler(); (est.recados || []).forEach(function(r){ r.lido = true; }); salvar(); },
    premios:function(){ ler(); return {trofeu:(+est.maxSerie || +est.serie || 0) >= 3, espelho:(+est.maxSerie || +est.serie || 0) >= 7, tapete:!!fotoVip()}; },
    guardarFotoVip:function(url){ try{ localStorage.setItem(chavePessoal(CHAVE_FOTO), JSON.stringify({dia:hoje(), url:url})); }catch(e){} avisar('foto'); },
    appHtml:appHtml,
    ouvir:function(f){ ouvintes.push(f); }
  };

  var CHAVE_FOTO = 'brs48cr_vip_foto_v1';
  function fotoVip(){ try{ var f = JSON.parse(localStorage.getItem(chavePessoal(CHAVE_FOTO)) || 'null'); return f && /^data:image\/(jpeg|png)/.test(f.url) ? f : null; }catch(e){ return null; } }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function estiloApp(){
    if(document.getElementById('twHumorAppCss')) return;
    var st = document.createElement('style'); st.id = 'twHumorAppCss';
    st.textContent = '.twh-app{display:grid;gap:12px;padding:4px 2px 14px;font-family:"M PLUS Rounded 1c",sans-serif}' +
      '.twh-box{background:var(--card,#fff);color:var(--ink,#342450);border-radius:16px;padding:12px;box-shadow:0 2px 0 rgba(123,63,240,.12);min-width:0;overflow-wrap:anywhere}' +
      '.twh-box h3{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin:0 0 8px;font:400 13px "Mochiy Pop One",sans-serif;color:var(--ink,#7b3ff0)}.twh-ic{flex:none}' +
      '.twh-serie{display:inline-flex;align-items:center;gap:3px;margin-left:auto;padding:2px 8px;border-radius:99px;background:#ffe3f1;color:#c2367f;font:800 11px "M PLUS Rounded 1c",sans-serif}' +
      '.twh-av{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;color:#fff;font:400 12px "Mochiy Pop One",sans-serif;font-style:normal;box-shadow:0 0 0 2px #fff,0 2px 0 2px rgba(60,30,120,.12)}' +
      '.twh-d{padding:8px 10px;border-radius:12px;background:#fff4fb;border:2px dashed #e2ccff;font-weight:800}.twh-ok{border-style:solid;border-color:#9be15d;background:#f4ffe6}' +
      '.twh-p{display:flex;align-items:center;gap:8px}.twh-pi{display:grid;place-items:center;width:26px;height:26px;border-radius:9px;background:#f6f0ff}' +
      '.twh-b{display:grid;grid-template-columns:minmax(0,76px) minmax(0,1fr) auto;align-items:center;gap:6px;margin:5px 0;font-weight:800;font-size:12px;color:var(--sub,#6b5a8e)}' +
      '.twh-b i{display:block;height:9px;border-radius:9px;background:#efe7ff;overflow:hidden}.twh-b b{display:block;height:100%;border-radius:9px}' +
      '.twh-intro,.twh-ajuda{font-size:13px;line-height:1.6;margin:8px 0;color:var(--ink,#342450)}.twh-guia summary{cursor:pointer;min-height:44px;display:list-item;padding:12px 0;font-weight:800}.twh-guia summary:focus-visible{outline:2px solid var(--ink,#7b3ff0);outline-offset:2px}.twh-num{font-size:12px;font-variant-numeric:tabular-nums}.twh-vip{font-weight:800;margin:10px 0 0;color:var(--ink,#342450)}.twh-d{color:#342450}.twh-b i{background:var(--chip,#efe7ff)}' +
      '.twh-d{display:flex;gap:8px;align-items:center;font-weight:800}.twh-d span{font-size:24px}' +
      '.twh-r{display:flex;gap:8px;align-items:flex-start;margin:6px 0;font-size:13px;line-height:1.4}' +
      '.twh-r small{display:block;color:#9a86c8;font-weight:800}.twh-p{margin:4px 0;font-size:12.5px;font-weight:700}.twh-p.off{opacity:.45}' +
      '.twh-foto img{display:block;width:100%;border-radius:6px;box-shadow:0 3px 10px rgba(60,30,120,.2)}.twh-foto a{display:inline-block;margin-top:8px;font-weight:800;color:#7b3ff0}';
    document.head.appendChild(st);
  }
  // ícones pequenos desenhados (o app segue o visual do TsuPhone, sem emojis)
  var SVG = {
    diamante:'<path d="M12 3l6 7-6 11L6 10z" fill="currentColor" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/>',
    carta:'<rect x="3" y="6" width="18" height="13" rx="3" fill="#fff" stroke="currentColor" stroke-width="2"/><path d="M4 8l8 6 8-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    presente:'<rect x="4" y="10" width="16" height="10" rx="2" fill="currentColor"/><rect x="3" y="7" width="18" height="4" rx="1.5" fill="currentColor"/><path d="M12 7v13" stroke="#fff" stroke-width="2"/><path d="M12 7c-2-3-6-3-5 0M12 7c2-3 6-3 5 0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    trofeu:'<path d="M7 4h10v5a5 5 0 01-10 0z" fill="currentColor"/><path d="M7 6H4a3 3 0 003 4M17 6h3a3 3 0 01-3 4M12 14v4M8 20h8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    luzes:'<circle cx="5" cy="7" r="2.4" fill="currentColor"/><circle cx="12" cy="5" r="2.4" fill="currentColor"/><circle cx="19" cy="7" r="2.4" fill="currentColor"/><circle cx="5" cy="15" r="2.4" fill="currentColor"/><circle cx="19" cy="15" r="2.4" fill="currentColor"/><rect x="8" y="9" width="8" height="10" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>',
    tapete:'<path d="M8 4h8l4 16H4z" fill="currentColor"/><path d="M12 4v16" stroke="#fff" stroke-width="1.6" opacity=".5"/>',
    coroa:'<path d="M3 18h18l1-11-5.5 4.5L12 5l-4.5 6.5L2 7z" fill="currentColor"/>',
    chama:'<path d="M12 21c4 0 6.5-2.6 6.5-6.2 0-3.6-2.8-5.6-3.6-9.3-1.9 1.4-2.8 3.2-2.6 5.4-1.4-.9-2.2-2.3-2.3-4C7.7 9 5.5 11.4 5.5 14.8 5.5 18.4 8 21 12 21z" fill="currentColor"/>',
    coracao:'<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
    cadeado:'<rect x="5" y="11" width="14" height="9" rx="2.5" fill="currentColor"/><path d="M8 11V8a4 4 0 018 0v3" fill="none" stroke="currentColor" stroke-width="2.2"/>',
    estrela:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/>'
  };
  function svg(k, cor, tam){ return '<svg class="twh-ic" viewBox="0 0 24 24" width="' + (tam || 18) + '" height="' + (tam || 18) + '" style="color:' + cor + '" aria-hidden="true">' + (SVG[k] || SVG.estrela) + '</svg>'; }
  function appHtml(){
    ler(); estiloApp();
    var e = H.estado(), d = H.desejo(), pr = H.premios(), f = fotoVip(), L2 = lang();
    var cores = {energia:'#7be35a', diversao:'#ff6fb5', brilho:'#ffd23f', amizade:'#4169e1'};
    var rec = (est.recados || []).map(function(r){ var q = RECADOS[r.k] || RECADOS[0], m = q[2][r.m] || q[2][0];
      return '<div class="twh-r"><em class="twh-av" style="background:' + ['#9b30d9', '#4fa81a', '#4169e1'][r.k] + '" aria-hidden="true">' + esc(q[0].charAt(0)) + '</em><span><small>' + esc(q[0]) + ' · ' + esc(r.dia.split('-').reverse().slice(0, 2).join('/')) + '</small>' + esc(m[L2] || m.pt) + '</span></div>'; }).join('');
    return '<div class="twh-app"><p class="twh-intro">' + esc(t('intro')) + '</p>' +
      '<section class="twh-box"><h3>' + svg('diamante', e.cor) + esc(t('humor')) + (e.serie ? '<span class="twh-serie">' + svg('chama', '#ff6f3d', 14) + esc(t('serie', e.serie)) + '</span>' : '') + '</h3>' +
        BARRAS.map(function(b){ return '<div class="twh-b"><span>' + esc(t(b)) + '</span><i role="meter" aria-label="' + esc(t(b)) + '" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + e[b] + '"><b style="width:' + e[b] + '%;background:' + cores[b] + '"></b></i><span class="twh-num" aria-hidden="true">' + e[b] + '/100</span></div>'; }).join('') + '<details class="twh-guia"><summary>' + esc(t('como')) + '</summary>' + BARRAS.map(function(b){return '<p class="twh-ajuda"><strong>' + esc(t(b)) + '</strong> · ' + esc(t(b+'Ajuda')) + '</p>';}).join('') + '<p class="twh-ajuda">' + esc(t('efeitos')) + '</p><p class="twh-ajuda">' + esc(t('corGuia')) + '</p></details></section>' +
      '<section class="twh-box"><h3>' + svg('estrela', '#ff6fb5') + esc(t('desejo')) + '</h3><div class="twh-d' + (d.feito ? ' twh-ok' : '') + '">' + esc(d.texto) + '</div><p class="twh-vip">' + esc(t(H.vipHoje() ? 'vipSim' : 'vipNao')) + '</p><p class="twh-ajuda">' + esc(d.feito ? t('feito') : t('regra')) + '</p></section>' +
      '<section class="twh-box"><h3>' + svg('carta', '#ff6fb5') + esc(t('recados')) + '</h3>' + (rec || '<p class="twh-p">' + esc(t('semRecado')) + '</p>') + '</section>' +
      '<section class="twh-box"><h3>' + svg('presente', '#7b3ff0') + esc(t('premios')) + '</h3>' +
        [['trofeu', 'trofeu', 'pTrofeu', '#e0a400'], ['espelho', 'luzes', 'pEspelho', '#ffb300'], ['tapete', 'tapete', 'pTapete', '#c2185b']].map(function(p){
          return '<p class="twh-p' + (pr[p[0]] ? '' : ' off') + '"><span class="twh-pi">' + svg(pr[p[0]] ? p[1] : 'cadeado', pr[p[0]] ? p[3] : '#b9a7dc', 16) + '</span>' + esc(t(p[2])) + '</p>'; }).join('') + '</section>' +
      (f ? '<section class="twh-box twh-foto"><h3>' + svg('coroa', '#e0a400') + esc(t('fotoVip')) + '</h3><img src="' + f.url + '" alt="' + esc(t('fotoVip')) + '"><a href="' + f.url + '" download="tsulipa-camarim-vip.jpg">' + esc(t('baixar')) + '</a></section>' : '') +
      '</div>';
  }

  // Só confirma ações com sucesso explícito e na mesma sessão que iniciou a chamada.
  if(typeof window.contaRpc === 'function' && !window.contaRpc.twHumor){
    var orig = window.contaRpc;
    window.contaRpc = function(nome, args){
      var dono = typeof contaJ !== 'undefined' ? contaJ : null;
      var sessao = typeof contaSessaoToken !== 'undefined' ? contaSessaoToken : null;
      var p = orig.apply(this, arguments);
      try{ p.then(function(r){
        if(!r || r.ok !== true || dono !== (typeof contaJ !== 'undefined' ? contaJ : null) ||
          sessao !== (typeof contaSessaoToken !== 'undefined' ? contaSessaoToken : null)) return;
        if((nome === 'cafe_run_etapa' || nome === 'cafe_concluir') && (r.confirmado !== true || r.certo !== true)) return;
        if(RPC_JOGO[nome]) evento(RPC_JOGO[nome]);
        else if(nome === 'presenca_ping' && args && args.p_frase === 'oi') evento('frase'); }, function(){}); }catch(e){}
      return p;
    };
    window.contaRpc.twHumor = true;
    if(orig.twcManut) window.contaRpc.twcManut = true;
  }
  H.abriu = function(){}; // Compatibilidade: navegar não altera humor, desejo ou passe VIP.
  H.treino = function(jogo){ if(!logado()) evento(jogo); };
  ler();
})();
