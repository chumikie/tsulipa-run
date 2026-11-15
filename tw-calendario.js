/* O ano do TsuLiPa — calendário em tempo real (horário de Brasília), desde o lançamento do TsuLiPa⭐World (27/10/2026,
   o primeiro cadastro no servidor, em plena temporada de Halloween).
   Marca no calendário: aniversários do trio (Tsu 05/09, Pati 23/09; a Lirika faz em maio, sem dia público no blog),
   o aniversário do BRS48 (13/11/2015), o mês da Draft 1st Generation (agosto de 2021), o aniversário do jogo,
   os temas de data do jogo (TEMAS, em centerrun.js) e o evento da semana (EVENTOS, em evento.js).
   As falas do dia mudam com a data. Só leitura: nada vai para o servidor. */
(function(){
  'use strict';
  if(typeof window === 'undefined') return;
  var INICIO = '2026-10-27';
  function L(){ return (typeof LANG === 'string' && /^(pt|en|es|id|th|ja)$/.test(LANG)) ? LANG : 'pt'; }
  function tx(o){ return o ? (o[L()] || o.pt) : ''; }
  function p2(n){ return (n < 10 ? '0' : '') + n; }
  function hoje(){ return new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }
  function partes(d){ return {y:+d.slice(0, 4), m:+d.slice(5, 7), d:+d.slice(8, 10)}; }
  function diaN(d){ var a = partes(d), b = partes(INICIO); return Math.round((Date.UTC(a.y, a.m - 1, a.d) - Date.UTC(b.y, b.m - 1, b.d)) / 864e5) + 1; }

  // [quem fala: 0 Tsu, 1 Lirika, 2 Pati, texto] — o Tsu e o Pati falam no masculino; a Lirika, no feminino
  var F = {
    anivTsu:[[1, {pt:'Hoje é aniversário do Tsu! Otanjoubi omedetou~!',en:"It's Tsu's birthday today! Otanjoubi omedetou~!",es:'¡Hoy es el cumpleaños de Tsu! ¡Otanjoubi omedetou~!',id:'Hari ini ulang tahun Tsu! Otanjoubi omedetou~!',th:'วันนี้วันเกิด Tsu! Otanjoubi omedetou~!',ja:'今日はTsuの誕生日！おたんじょうびおめでとう〜！'}],
             [2, {pt:'Parabéns, Tsu!! Hoje tem pudim em dobro!!',en:'Happy birthday, Tsu!! Double pudding today!!',es:'¡¡Feliz cumple, Tsu!! ¡¡Hoy hay flan doble!!',id:'Selamat ulang tahun, Tsu!! Hari ini puding dobel!!',th:'สุขสันต์วันเกิด Tsu!! วันนี้พุดดิ้งสองเท่า!!',ja:'Tsu、おめでとう！！今日はプリン2倍！！'}]],
    anivPati:[[0, {pt:'Hoje é aniversário do Pati! Bora encher o mapa de corações?',en:"It's Pati's birthday! Let's fill the map with hearts?",es:'¡Hoy es el cumpleaños de Pati! ¿Llenamos el mapa de corazones?',id:'Hari ini ulang tahun Pati! Yuk penuhi peta dengan hati?',th:'วันนี้วันเกิด Pati! มาเติมหัวใจให้เต็มแผนที่กัน?',ja:'今日はPatiの誕生日！マップをハートでいっぱいにしよう？'}],
              [1, {pt:'Otanjoubi omedetou, Pati! Parabéns e Patchau~!',en:'Otanjoubi omedetou, Pati! Happy birthday and Patchau~!',es:'¡Otanjoubi omedetou, Pati! ¡Feliz cumple y Patchau~!',id:'Otanjoubi omedetou, Pati! Selamat dan Patchau~!',th:'Otanjoubi omedetou, Pati! สุขสันต์และ Patchau~!',ja:'Pati、おたんじょうびおめでとう！パチャウ〜！'}]],
    mesLirika:[[0, {pt:'Maio é o mês do aniversário da Lirika! Manda um oi verde pra ela ♡',en:"May is Lirika's birthday month! Send her a green hello ♡",es:'¡Mayo es el mes del cumple de Lirika! Mándale un saludo verde ♡',id:'Mei bulan ulang tahun Lirika! Kirim salam hijau untuknya ♡',th:'พฤษภาคมเป็นเดือนเกิดของ Lirika! ส่งคำทักทายสีเขียวให้เธอ ♡',ja:'5月はLirikaの誕生月！緑のあいさつを送ってね ♡'}],
               [2, {pt:'Mês da Lirika! Conte com o Pati pra fazer a festa!!',en:"Lirika's month! Count on Pati for the party!!",es:'¡Mes de Lirika! ¡Cuenta con el Pati para la fiesta!!',id:'Bulan Lirika! Andalkan Pati buat pestanya!!',th:'เดือนของ Lirika! ปาติจัดปาร์ตี้เอง!!',ja:'Lirikaの月！パーティーはPatiにまかせて！！'}]],
    lanc:[[2, {pt:'Foi hoje que o TsuLiPa⭐World abriu as portas! Obrigado por jogar com a gente!!',en:'TsuLiPa⭐World opened its doors today! Thanks for playing with us!!',es:'¡Hoy abrió sus puertas TsuLiPa⭐World! ¡¡Gracias por jugar con nosotros!!',id:'Hari ini TsuLiPa⭐World dibuka! Makasih sudah main bareng kami!!',th:'วันนี้ TsuLiPa⭐World เปิดประตูแล้ว! ขอบคุณที่เล่นกับเรานะ!!',ja:'今日TsuLiPa⭐Worldがオープン！いっしょに遊んでくれてありがとう！！'}]],
    anivJogo:[[1, {pt:'Hoje o TsuLiPa⭐World faz aniversário! Arigatou por mais um ano~',en:"It's TsuLiPa⭐World's birthday! Arigatou for another year~",es:'¡Hoy TsuLiPa⭐World cumple años! Arigatou por un año más~',id:'Hari ini TsuLiPa⭐World ulang tahun! Arigatou untuk setahun lagi~',th:'วันนี้วันเกิด TsuLiPa⭐World! Arigatou สำหรับอีกปี~',ja:'今日はTsuLiPa⭐Worldの誕生日！また1年ありがとう〜'}]],
    brs48:[[1, {pt:'Hoje é aniversário do BRS48! Desde 2015 brilhando juntos~',en:"It's BRS48's anniversary! Shining together since 2015~",es:'¡Hoy es el aniversario de BRS48! Brillando juntos desde 2015~',id:'Hari ini ulang tahun BRS48! Bersinar bersama sejak 2015~',th:'วันนี้วันครบรอบ BRS48! เปล่งประกายด้วยกันตั้งแต่ 2015~',ja:'今日はBRS48の記念日！2015年からいっしょにキラキラ〜'}],
           [0, {pt:'Feliz aniversário, BRS48! Oiê pra todo mundo do grupo!',en:'Happy anniversary, BRS48! Oiê to everyone in the group!',es:'¡Feliz aniversario, BRS48! ¡Oiê a todo el grupo!',id:'Selamat ulang tahun, BRS48! Oiê untuk semua anggota!',th:'สุขสันต์วันครบรอบ BRS48! Oiê ทุกคนในวง!',ja:'BRS48、記念日おめでとう！グループのみんなにオイエー！'}]],
    geracao:[[0, {pt:'Em agosto de 2021 nós três entramos juntos na Draft 1st Generation!',en:'In August 2021 the three of us joined the Draft 1st Generation together!',es:'¡En agosto de 2021 los tres entramos juntos en la Draft 1st Generation!',id:'Agustus 2021 kami bertiga masuk Draft 1st Generation bersama!',th:'สิงหาคม 2021 พวกเราสามคนเข้า Draft 1st Generation พร้อมกัน!',ja:'2021年8月、3人いっしょにドラフト1期生になったよ！'}],
             [2, {pt:'Mês da nossa geração! Mesma turma, mesmo sonho!!',en:'Our generation month! Same class, same dream!!',es:'¡Mes de nuestra generación! ¡¡Misma clase, mismo sueño!!',id:'Bulan angkatan kami! Angkatan sama, mimpi sama!!',th:'เดือนของรุ่นเรา! รุ่นเดียวกัน ฝันเดียวกัน!!',ja:'わたしたちの期の月！同じ期、同じ夢！！'}]],
    halloween:[[0, {pt:'Halloween no TsuLiPa⭐World! Doce ou travessura?',en:'Halloween in TsuLiPa⭐World! Trick or treat?',es:'¡Halloween en TsuLiPa⭐World! ¿Dulce o truco?',id:'Halloween di TsuLiPa⭐World! Trick or treat?',th:'ฮาโลวีนใน TsuLiPa⭐World! Trick or treat?',ja:'TsuLiPa⭐Worldのハロウィン！トリック・オア・トリート？'}]],
    aniversario:[[1, {pt:'Semana de aniversário do BRS48! Tem festa no mapa todo~',en:"BRS48's anniversary week! There's a party all over the map~",es:'¡Semana de aniversario de BRS48! Hay fiesta en todo el mapa~',id:'Minggu ulang tahun BRS48! Ada pesta di seluruh peta~',th:'สัปดาห์ครบรอบ BRS48! มีปาร์ตี้ทั่วแผนที่~',ja:'BRS48記念週間！マップ中でパーティー〜'}],
                 [0, {pt:'Semana do BRS48! Bora comemorar com a roupa da festa?',en:'BRS48 week! Celebrate in the party outfit?',es:'¡Semana de BRS48! ¿Celebramos con la ropa de fiesta?',id:'Minggu BRS48! Rayakan pakai baju pesta?',th:'สัปดาห์ BRS48! ฉลองด้วยชุดปาร์ตี้กัน?',ja:'BRS48ウィーク！パーティー衣装でお祝いしよう？'}],
                 [2, {pt:'Aniversário do BRS48 chegando!! Conte com o Pati pro bolo!!',en:"BRS48's anniversary is here!! Count on Pati for the cake!!",es:'¡¡Llega el aniversario de BRS48!! ¡¡Cuenta con el Pati para el pastel!!',id:'Ulang tahun BRS48 datang!! Andalkan Pati buat kuenya!!',th:'วันครบรอบ BRS48 มาแล้ว!! เค้กให้ปาติจัดการ!!',ja:'BRS48の記念日がきたよ！！ケーキはPatiにまかせて！！'}]],
    cap:[[1, {pt:'Capítulo novo da nossa história no Idol⭐News!~',en:'A new chapter of our story in Idol⭐News!~',es:'¡Capítulo nuevo de nuestra historia en Idol⭐News!~',id:'Bab baru cerita kami di Idol⭐News!~',th:'ตอนใหม่ของเรื่องเราใน Idol⭐News!~',ja:'Idol⭐News!にわたしたちの新しいお話〜'}],
         [2, {pt:'Saiu capítulo novo do quadrinho!! Corre pro Idol⭐News!!',en:'New comic chapter is out!! Run to Idol⭐News!!',es:'¡¡Salió un capítulo nuevo del cómic!! ¡¡Corre a Idol⭐News!!',id:'Bab komik baru keluar!! Cepat ke Idol⭐News!!',th:'การ์ตูนตอนใหม่มาแล้ว!! รีบไป Idol⭐News!!',ja:'マンガの新しい話が出たよ！！Idol⭐News!へ急いで！！'}]],
    natal:[[2, {pt:'Feliz Natal!! Conte com o Pati pra deixar seu dia mais feliz!!',en:'Merry Christmas!! Count on Pati to make your day happier!!',es:'¡¡Feliz Navidad!! ¡¡Cuenta con el Pati para alegrar tu día!!',id:'Selamat Natal!! Andalkan Pati buat bikin harimu lebih bahagia!!',th:'สุขสันต์วันคริสต์มาส!! ให้ปาติทำให้วันของคุณสดใส!!',ja:'メリークリスマス！！Patiがあなたの一日をもっと楽しくするよ！！'}]],
    anonovo:[[1, {pt:'Feliz ano novo! Akemashite omedetou~!',en:'Happy new year! Akemashite omedetou~!',es:'¡Feliz año nuevo! ¡Akemashite omedetou~!',id:'Selamat tahun baru! Akemashite omedetou~!',th:'สวัสดีปีใหม่! Akemashite omedetou~!',ja:'あけましておめでとう〜！'}]],
    tema:[[0, {pt:'{t} no TsuLiPa⭐World! Bora jogar com a roupa do tema?',en:'{t} in TsuLiPa⭐World! Play in the theme outfit?',es:'¡{t} en TsuLiPa⭐World! ¿Jugamos con la ropa del tema?',id:'{t} di TsuLiPa⭐World! Main pakai baju tema?',th:'{t} ใน TsuLiPa⭐World! เล่นด้วยชุดธีมกัน?',ja:'TsuLiPa⭐Worldは{t}！テーマの衣装で遊ぼう？'}],
          [1, {pt:'Chegou {t}! O mapa todo está decorado~',en:'{t} is here! The whole map is decorated~',es:'¡Llegó {t}! Todo el mapa está decorado~',id:'{t} datang! Seluruh peta didekorasi~',th:'{t} มาแล้ว! ทั้งแผนที่ตกแต่งสวย~',ja:'{t}がきたよ！マップ中がデコされてる〜'}],
          [2, {pt:'É tempo de {t}!! Vem brilhar com a gente!!',en:"It's {t} time!! Come shine with us!!",es:'¡¡Es tiempo de {t}!! ¡¡Ven a brillar con nosotros!!',id:'Waktunya {t}!! Ayo bersinar bersama!!',th:'ถึงเวลา {t} แล้ว!! มาเปล่งประกายด้วยกัน!!',ja:'{t}の季節！！いっしょにキラキラしよう！！'}]],
    dia:[[0, {pt:'Oiê! Dia {n} do TsuLiPa⭐World. Bora brilhar hoje?',en:'Oiê! Day {n} of TsuLiPa⭐World. Shall we shine today?',es:'¡Oiê! Día {n} de TsuLiPa⭐World. ¿Brillamos hoy?',id:'Oiê! Hari ke-{n} TsuLiPa⭐World. Bersinar hari ini?',th:'Oiê! วันที่ {n} ของ TsuLiPa⭐World วันนี้มาเปล่งประกายกัน?',ja:'オイエー！TsuLiPa⭐World {n}日目。今日もキラキラしよう？'}],
         [1, {pt:'Tudo bem com vocês? Dia {n} do TsuLiPa⭐World~',en:'How is everyone? Day {n} of TsuLiPa⭐World~',es:'¿Todo bien? Día {n} de TsuLiPa⭐World~',id:'Apa kabar semuanya? Hari ke-{n} TsuLiPa⭐World~',th:'ทุกคนสบายดีไหม? วันที่ {n} ของ TsuLiPa⭐World~',ja:'みんな元気？TsuLiPa⭐World {n}日目〜'}],
         [2, {pt:'Dia {n}! Conte com o Pati pra deixar seu dia mais feliz!!',en:'Day {n}! Count on Pati to make your day happier!!',es:'¡Día {n}! ¡¡Cuenta con el Pati para alegrar tu día!!',id:'Hari ke-{n}! Andalkan Pati bikin harimu bahagia!!',th:'วันที่ {n}! ให้ปาติทำให้วันของคุณสดใส!!',ja:'{n}日目！Patiがあなたの一日をもっと楽しくするよ！！'}]]
  };
  var NOMES = {
    lanc:{pt:'Lançamento do TsuLiPa⭐World',en:'TsuLiPa⭐World launch',es:'Lanzamiento de TsuLiPa⭐World',id:'Peluncuran TsuLiPa⭐World',th:'เปิดตัว TsuLiPa⭐World',ja:'TsuLiPa⭐World オープン'},
    anivJogo:{pt:'Aniversário do TsuLiPa⭐World',en:"TsuLiPa⭐World's birthday",es:'Cumpleaños de TsuLiPa⭐World',id:'Ulang tahun TsuLiPa⭐World',th:'วันเกิด TsuLiPa⭐World',ja:'TsuLiPa⭐World の誕生日'},
    anivTsu:{pt:'Aniversário do Tsu',en:"Tsu's birthday",es:'Cumpleaños de Tsu',id:'Ulang tahun Tsu',th:'วันเกิด Tsu',ja:'Tsuの誕生日'},
    anivPati:{pt:'Aniversário do Pati',en:"Pati's birthday",es:'Cumpleaños de Pati',id:'Ulang tahun Pati',th:'วันเกิด Pati',ja:'Patiの誕生日'},
    mesLirika:{pt:'Mês do aniversário da Lirika',en:"Lirika's birthday month",es:'Mes del cumpleaños de Lirika',id:'Bulan ulang tahun Lirika',th:'เดือนเกิดของ Lirika',ja:'Lirikaの誕生月'},
    brs48:{pt:'Aniversário do BRS48 (2015)',en:"BRS48's anniversary (2015)",es:'Aniversario de BRS48 (2015)',id:'Ulang tahun BRS48 (2015)',th:'วันครบรอบ BRS48 (2015)',ja:'BRS48 記念日（2015）'},
    cap:{pt:'Capítulo {n} do quadrinho no Idol⭐News!',en:'Comic chapter {n} in Idol⭐News!',es:'Capítulo {n} del cómic en Idol⭐News!',id:'Bab {n} komik di Idol⭐News!',th:'การ์ตูนตอนที่ {n} ใน Idol⭐News!',ja:'Idol⭐News!のマンガ第{n}話'},
    geracao:{pt:'Mês da Draft 1st Generation (2021)',en:'Draft 1st Generation month (2021)',es:'Mes de la Draft 1st Generation (2021)',id:'Bulan Draft 1st Generation (2021)',th:'เดือน Draft 1st Generation (2021)',ja:'ドラフト1期生の月（2021）'}
  };
  function trT(s){ try{ return typeof tr === 'function' ? tr(s) : s; }catch(e){ return s; } }
  function temaDe(d){   // tema de data do jogo naquele dia: {k, nome, cor} ou null
    var T = typeof TEMAS !== 'undefined' && Array.isArray(TEMAS) ? TEMAS : null, I = typeof TEMA_INFO !== 'undefined' ? TEMA_INFO : null;
    if(!T || !I) return null; var md = d.slice(5);
    for(var i = 0; i < T.length; i++){ var a = T[i][1], b = T[i][2];
      if(a <= b ? (md >= a && md <= b) : (md >= a || md <= b)){ var inf = I[T[i][0]]; if(inf) return {k:T[i][0], nome:trT(inf[1]), cor:(inf[6] || ['#9b30d9'])[0], ate:b}; } }
    return null;
  }
  function semanaDe(d){   // evento da semana (segunda a domingo) naquele dia
    if(typeof EVENTOS === 'undefined' || !Array.isArray(EVENTOS) || !EVENTOS.length) return null;
    var a = partes(d), w = Math.floor((Math.floor(Date.UTC(a.y, a.m - 1, a.d) / 864e5) + 3) / 7), e = EVENTOS[w % EVENTOS.length];
    return {k:e[0], nome:trT(e[2]), cor:e[6]};
  }
  function marcas(d){   // o que acontece no dia: lista de {k, nome, ic, cor}
    var md = d.slice(5), y = +d.slice(0, 4), m = [];
    if(md === '10-27' && d >= INICIO) m.push({k:y === 2026 ? 'lanc' : 'anivJogo', nome:tx(NOMES[y === 2026 ? 'lanc' : 'anivJogo']), ic:'estrela', cor:'#7b3ff0'});
    if(md === '09-05') m.push({k:'anivTsu', nome:tx(NOMES.anivTsu), ic:'bolo', cor:'#9b30d9'});
    if(md === '09-23') m.push({k:'anivPati', nome:tx(NOMES.anivPati), ic:'bolo', cor:'#4169e1'});
    if(md === '11-13') m.push({k:'brs48', nome:tx(NOMES.brs48), ic:'coroa', cor:'#ff6fb5'});
    var nc = Math.round((Date.UTC(y, +d.slice(5, 7) - 1, +d.slice(8, 10)) - Date.UTC(2026, 9, 27)) / 864e5);   // quadrinho: um capítulo toda terça
    if(nc >= 0 && nc % 7 === 0 && nc / 7 < 6) m.push({k:'cap', nome:tx(NOMES.cap).replace('{n}', nc / 7 + 1), ic:'news', cor:'#ff6fb5'});
    // Temporada 1: nenhuma marca visível até episódios, arte e seis idiomas estarem prontos.
    // Datas fixas em Brasília; a série histórica de terça permanece acima, intacta.
    var t1Datas=['2026-11-16','2026-11-23','2026-11-30','2026-12-07','2026-12-14','2026-12-21'];
    var t1Indice=t1Datas.indexOf(d);
    if(t1Indice>=0 && typeof JN_T1 !== 'undefined' && JN_T1.publicada &&
       JN_T1.episodios[t1Indice] && JN_T1.episodios[t1Indice].pronto){
      m.push({k:'capT1',nome:'Bastidores de um Sonho · '+(t1Indice+1),ic:'news',cor:'#9b30d9'});
    }
    return m;
  }
  function doMes(mo){ return mo === 5 ? {k:'mesLirika', nome:tx(NOMES.mesLirika), cor:'#4fa81a'} : mo === 8 ? {k:'geracao', nome:tx(NOMES.geracao), cor:'#7b3ff0'} : null; }
  function hash(s){ var h = 2166136261; for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function fala(d){   // a fala do dia: {quem, txt}
    d = d || hoje();
    var mk = marcas(d), te = temaDe(d), mes = doMes(+d.slice(5, 7)), h = hash(d), lista, t2 = '';
    if(mk.length) lista = F[mk[0].k];
    else if(te && F[te.k]) lista = F[te.k];
    else if(te){ lista = F.tema; t2 = te.nome; }
    else if(mes && h % 3 === 0) lista = F[mes.k];
    else lista = F.dia;
    var e = lista[h % lista.length];
    return {quem:e[0], txt:tx(e[1]).replace('{t}', t2).replace('{n}', Math.max(1, diaN(d)))};
  }
  window.TW_CAL = {inicio:INICIO, hoje:hoje, diaN:diaN, marcas:marcas, doMes:doMes, tema:temaDe, semana:semanaDe, fala:fala, partes:partes, p2:p2};
})();
