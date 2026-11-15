/* TsuLiPa⭐World · Humor do Idol, Desejo do dia e Diamantinho (15/11/2026, visual de celular).
   Ideia do The Sims com regra nossa: as barrinhas são só um jeitinho de dar motivo para variar os jogos.
   Nada aqui mexe em estrelas, ranking ou save do servidor; tudo fica neste aparelho (brs48cr_humor_v1).
   Ao cumprir o Desejo do dia, a pessoa ganha o passe do dia do Camarim VIP (aberto para todo mundo, sem dinheiro). */
(function(){
  'use strict';
  var CHAVE = 'brs48cr_humor_v1';
  var BARRAS = ['energia', 'diversao', 'brilho', 'amizade'];
  var TX = {
    humor:{pt:'Humor do seu Idol',en:"Your Idol's mood",es:'Ánimo de tu Idol',id:'Mood Idol-mu',th:'อารมณ์ไอดอลของคุณ',ja:'アイドルのきぶん'},
    energia:{pt:'Energia',en:'Energy',es:'Energía',id:'Energi',th:'พลังงาน',ja:'げんき'},
    diversao:{pt:'Diversão',en:'Fun',es:'Diversión',id:'Seru',th:'ความสนุก',ja:'たのしさ'},
    brilho:{pt:'Brilho',en:'Sparkle',es:'Brillo',id:'Kilau',th:'ประกาย',ja:'キラキラ'},
    amizade:{pt:'Amizade',en:'Friendship',es:'Amistad',id:'Pertemanan',th:'มิตรภาพ',ja:'なかよし'},
    desejo:{pt:'Desejo do dia',en:'Wish of the day',es:'Deseo del día',id:'Keinginan hari ini',th:'ความปรารถนาประจำวัน',ja:'きょうのおねがい'},
    feito:{pt:'Desejo cumprido! ✨',en:'Wish granted! ✨',es:'¡Deseo cumplido! ✨',id:'Keinginan terkabul! ✨',th:'สมหวังแล้ว! ✨',ja:'おねがいかなった！✨'},
    serie:{pt:'{n} dia(s) seguido(s)',en:'{n}-day streak',es:'{n} día(s) seguido(s)',id:'{n} hari berturut-turut',th:'ติดต่อกัน {n} วัน',ja:'{n}日れんぞく'},
    ir:{pt:'Ir',en:'Go',es:'Ir',id:'Ayo',th:'ไป',ja:'いく'},
    dica:{pt:'Jogar enche as barrinhas; a Energia volta sozinha descansando.',en:'Playing fills the bars; Energy comes back by resting.',es:'Jugar llena las barras; la Energía vuelve descansando.',id:'Bermain mengisi bar; Energi pulih sendiri saat istirahat.',th:'เล่นเกมเพื่อเติมแถบ พลังงานจะฟื้นเองเมื่อพัก',ja:'あそぶとバーがたまります。げんきは休むともどります。'},
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
  // o que cada jogo faz nas barrinhas: [energia, diversão, brilho, amizade]
  var EFEITO = {run:[-8, 16, 10, 0], karaoke:[-8, 14, 16, 4], sora:[-7, 18, 6, 0], cafe:[4, 12, 4, 8], battle:[-9, 12, 18, 4], studio:[-3, 10, 14, 6],
    handshake:[-5, 10, 8, 16], bloom:[8, 8, 4, 6], duo:[-3, 12, 6, 16], pet:[4, 8, 2, 12], gacha:[0, 10, 6, 0], mapa:[2, 6, 0, 6], frase:[0, 4, 2, 12], coracao:[0, 2, 2, 10]};
  // RPCs que querem dizer "jogou de verdade" (só com conta). Visitante conta pela abertura do jogo.
  var RPC_JOGO = {terminar_corrida:'run', kt_run_finish:'karaoke', sora_run_finish:'sora', cafe_run_finalizar:'cafe', cafe_concluir:'cafe', handshake_run_finish:'handshake',
    handshake_premio:'handshake', battle_jogar:'battle', battle_desafiar:'battle', studio_publicar:'studio', studio_clique:'studio', jardim_regar:'bloom', jardim_colher:'bloom',
    jardim_plantar:'bloom', duo_registrar:'duo', gacha_girar:'gacha', dar_coracao:'coracao'};
  var TREINO_VISITANTE = {run:1, cafe:1, battle:1, studio:1, handshake:1, mapa:1, frase:1};

  function lang(){ return typeof LANG === 'string' ? LANG : 'pt'; }
  function t(k, n){ var d = TX[k], s = d ? (d[lang()] || d.pt) : k; return n != null ? s.replace('{n}', n) : s; }
  function hoje(){ var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function ontem(){ var d = new Date(Date.now() - 864e5); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function nickSemente(){ try{ return logado() ? String(contaJ.nick || '') : 'visitante'; }catch(e){ return 'visitante'; } }
  function hash(s){ var h = 2166136261; for(var i = 0; i < s.length; i++){ h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function limita(v){ return Math.max(5, Math.min(100, Math.round(v))); }

  var est;
  function ler(){
    try{ est = JSON.parse(localStorage.getItem(CHAVE) || 'null'); }catch(e){ est = null; }
    if(!est || typeof est !== 'object') est = {energia:80, diversao:55, brilho:50, amizade:50, ts:Date.now(), serie:0, ultimo:'', vip:'', desejo:null};
    BARRAS.forEach(function(b){ if(typeof est[b] !== 'number') est[b] = 50; });
    passarTempo();
  }
  function salvar(){ try{ localStorage.setItem(CHAVE, JSON.stringify(est)); }catch(e){} }
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
    var d = lista[hash(dia + '|' + nickSemente()) % lista.length];
    est.desejo = {dia:dia, k:d[0], ev:d[1], feito:false, logado:logado()}; salvar();
    return est.desejo;
  }
  function media(){ return (est.energia + est.diversao + est.brilho + est.amizade) / 4; }
  function cor(){ var m = media(); return m >= 60 ? '#7be35a' : m >= 35 ? '#ffd23f' : '#ff6fb5'; }

  var ouvintes = [];
  function avisar(tipo){ ouvintes.forEach(function(f){ try{ f(tipo); }catch(e){} }); }
  function evento(ev, fraco){
    ler();
    var ef = EFEITO[ev]; if(ef){ var k = fraco ? .5 : 1; BARRAS.forEach(function(b, i){ est[b] = limita(est[b] + ef[i] * k); }); }
    var d = desejoHoje(), cumpriu = false;
    if(!d.feito && d.ev === ev){
      d.feito = true; cumpriu = true;
      est.serie = est.ultimo === ontem() ? (+est.serie || 0) + 1 : (est.ultimo === hoje() ? +est.serie || 1 : 1);
      est.ultimo = hoje(); est.vip = hoje();
      BARRAS.forEach(function(b){ est[b] = limita(est[b] + 15); });
    }
    salvar(); avisar(cumpriu ? 'desejo' : 'humor');
  }

  var H = window.TW_HUMOR = {
    barras:BARRAS, t:t,
    estado:function(){ ler(); return {energia:est.energia, diversao:est.diversao, brilho:est.brilho, amizade:est.amizade, media:media(), cor:cor(), serie:+est.serie || 0}; },
    cor:function(){ if(!est) ler(); return cor(); },
    desejo:function(){ ler(); var d = desejoHoje(), def = DESEJOS.filter(function(x){ return x[0] === d.k; })[0] || DESEJOS[0];
      return {k:d.k, ev:d.ev, icone:def[2], texto:def[3][lang()] || def[3].pt, feito:!!d.feito, serie:+est.serie || 0}; },
    vipHoje:function(){ ler(); return est.vip === hoje(); },
    cansado:function(){ ler(); return est.energia < 25; },
    evento:evento,
    ouvir:function(f){ ouvintes.push(f); }
  };

  // ganchos: RPCs que terminam partidas (conta) e a abertura de jogos (visitante, efeito pela metade)
  if(typeof window.contaRpc === 'function' && !window.contaRpc.twHumor){
    var orig = window.contaRpc;
    window.contaRpc = function(nome, args){
      var p = orig.apply(this, arguments);
      try{ p.then(function(r){ if(r && r.ok === false) return;
        if(RPC_JOGO[nome]) evento(RPC_JOGO[nome]);
        else if(nome === 'presenca_ping' && args && args.p_frase) evento('frase'); }, function(){}); }catch(e){}
      return p;
    };
    window.contaRpc.twHumor = true;
    if(orig.twcManut) window.contaRpc.twcManut = true;
  }
  H.abriu = function(jogo){ if(!logado() || !RPC_JOGO_INVERSO[jogo]) evento(jogo, true); };
  var RPC_JOGO_INVERSO = {}; Object.keys(RPC_JOGO).forEach(function(k){ RPC_JOGO_INVERSO[RPC_JOGO[k]] = 1; });
  ler();
})();
