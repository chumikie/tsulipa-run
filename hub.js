/* Tela de início (hub) — cards, missões, Top Idols, TsuLiPa⭐TV, insígnia nova, busca, música e vitrine.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 7), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (montagem da tela, estado, listeners e hubMostrar() continuam lá).
   Temas da temporada, desenhos do Center⭐Run e o modo admin ficam para outras etapas. */
var HUB_COLLECT = 'https://brs48-collect.vercel.app/', HUB_BLOG = 'https://brs48.blogspot.com/';
var HUB_YOUTUBE = 'https://www.youtube.com/@BRS48';   // canal oficial do BRS48
// Missão fixa "collect": a cada dia o site sorteia um destes destinos (mesmo para a conta o dia todo).
// O servidor continua recebendo marcar_visita('collect'); a missão não muda de chave.
// Para incluir outro destino, acrescente [emoji, texto, endereço] aqui (e a tradução em tw-i18n.js).
var HUB_COLLECT_LINKS = [
  ['🎴', 'Visite o BRS48 Collect!', 'https://brs48-collect.vercel.app/'],
  ['📰', 'Visite o Blog do BRS48', 'https://brs48.blogspot.com/'],
  ['▶️', 'Visite o YouTube do BRS48', 'https://www.youtube.com/@BRS48'],
  ['💌', 'Visite o BRS48 Members Blog', 'https://brs48membersblog.blogspot.com/'],
  ['▶️', 'Visite o YouTube do SPR48', 'https://www.youtube.com/@SPR48'],
  ['▶️', 'Visite o YouTube do SKU48', 'https://www.youtube.com/@SKU48Official']
];
function hubCollectHoje(){
  var d = new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10), id = (contaJ && contaJ.id) || '', h = 0, i, k = d + '|' + id;
  for(i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) >>> 0;
  return HUB_COLLECT_LINKS[h % HUB_COLLECT_LINKS.length];
}
var HUB_MIS = {   // textos das missões (as regras ficam no servidor: missoes_lista)
  collect:['🎴', 'Visite o BRS48 Collect!'],   // texto trocado pelo link do dia (hubCollectHoje)
  duo:['🌙', 'Faça um Moon⭐Duo!'],
  corra2:['🏃', 'Corra {n} vezes no Center⭐Run!'], corra3:['🏃', 'Corra {n} vezes no Center⭐Run!'], corra5:['🏃', 'Corra {n} vezes no Center⭐Run!'],
  coracao:['💖', 'Dê 1 coração em um perfil'], recado:['💌', 'Deixe 1 recado em um perfil'], mini:['🎮', 'Ganhe estrelas em um minijogo do camarim'], pet:['🛍️', 'Compre algo para o seu pet'],
  estrelas150:['⭐', 'Pegue {n} estrelas nas corridas'], estrelas300:['⭐', 'Pegue {n} estrelas nas corridas'],
  estrelas50:['⭐', 'Pegue {n} estrelas nas corridas'], estrelas100:['🌟', 'Chegue a {n} estrelas nas corridas hoje'],
  pontos2000:['🎤', 'Faça {n} pontos em uma corrida'], pontos5000:['👑', 'Faça {n} pontos em uma corrida'], tsulipa:['💜', 'Corra com Tsu, Lirika e Pati'],
  handshake:['🤝', 'Acerte um presente no Handshake⭐Event!'], cafe:['🧋', 'Sirva um pedido perfeito no Happy⭐Cafe!']
};
var HUB_NOVIDADES = [["🗓️", "Evento da semana no Idol⭐News!: um tema novo toda segunda, com bônus no Happy⭐Cafe! e no Handshake⭐Event!"], ["📔", "Diário de carreira e Estante de troféus no Perfil, com insígnias dos jogos novos"], ["📰", "Idol⭐News!: Top 5, Fotos do dia, Festival de Unidades e Ensaio de trio"], ["💌", "Pedido de fã: um pedido especial por dia"], ["🐾", "Seu pet passeia no Café e no Handshake… e às vezes pega um docinho!"], ["🤝", "Handshake⭐Event!: lembre o presente favorito de cada fã na fila"], ["🧋", "Happy⭐Cafe!: monte shakes, frappés e docinhos para os fãs e complete o Caderno de receitas"], ["🎴", "Álbum de cards e Troca de cards com outros Idols"], ["🎉", "Lançamento oficial do TsuLiPa⭐World! Obrigada por jogar com a gente 💜"], ["🏁", "Center⭐Run!: corra pelo palco, pegue estrelas e microfones… e tente pegar o Center!"], ["🎤", "Karaoke⭐Time!: cante no ritmo com uma plateia nova todo dia"], ["☁️", "Sora⭐Jump!: pule de nuvem em nuvem e entre no Top Idols da semana"], ["🐾", "Backstage⭐Pet!: adote, cuide, vista e brinque com seu pet"], ["🎰", "Star⭐Gacha!: 1 giro por dia com estrelas e cards de outros jogadores"], ["🌙", "Moon⭐Duo! e Encontro do dia: cenas fofas com outros Idols"], ["💖", "Perfil com Montar Idol, Estúdio, lojinha, corações, recados e insígnias"], ["🎯", "Missões do dia, rankings da semana e algumas surpresas pra descobrir ✨"], ["🔒", "Privacidade e segurança atualizadas: o que os jogos novos guardam, trocas de cards e como funciona o clima do Hoje"], ["🌏", "Jogo em português, inglês, espanhol, indonésio, tailandês e japonês"]];
// Sequência de boas-vindas exclusiva da INDEX2: a página principal conserva o tutorial original.
var HUB_TUT = [['💖', 'Meu Perfil', 'Entre com Google para salvar na nuvem, montar seu Idol, ganhar insígnias, corações e recados.'],
               ['🏁', 'Center⭐Run!', 'Pule os obstáculos do palco, pegue estrelas e os microfones das parceiras. Chegue ao Center!'],
               ['🐾', 'Backstage⭐Pet!', 'Cuide do seu pet no camarim: comida, banho, roupinhas e minijogos que valem estrelas.'],
               ['☁️', 'Sora⭐Jump!', 'Suba entre nuvens, colete estrelas e descubra paisagens inesperadas.']];
var TW_INDEX2_TUT_KEY='tw_index2_tut_v2';
function twRankTvModalFechar(){
  var modal=$('twRankTvModal'),trigger=$('twRankTvAbrir');
  if(!modal||modal.hidden)return;
  modal.hidden=true;if(typeof twRankStop==='function')twRankStop();
  if(trigger){trigger.setAttribute('aria-expanded','false');trigger.focus({preventScroll:true});}
}
function twMicAcerto(){   // som de acerto: arpejo brilhante de "nota perfeita" + brilhinhos subindo
  if(typeof muted !== 'undefined' && muted) return; ac();
  [[1047, 0], [1319, .07], [1568, .14], [2093, .21]].forEach(function(n){ beep(n[0], .16, 'triangle', .03, n[1]); beep(n[0] * 2, .08, 'sine', .01, n[1] + .02); });
  [1568, 2093, 2637].forEach(function(f, i){ beep(f, .5, 'sine', .018 - i * .004, .32); });   // acorde de "perfect"
  beep(523, .45, 'sine', .03, .3);
  if(typeof petGlide === 'function') petGlide(2349, 3520, .18, 'sine', .012, .36);
  [3136, 3520, 4186].forEach(function(f, i){ beep(f, .05, 'sine', .009, .55 + i * .06); });
}
function twMicRender(){
  var tela = $('twMicTela'); if(!tela) return;
  var w = TW_MIC_WORDS[LANG] || TW_MIC_WORDS.pt, list = twRankData.kacertos || [], top = list[0];
  var tit = $('twMicTit'); if(tit) tit.textContent = '🎤 Karaoke⭐Time!';
  var sub = $('twMicModal') && $('twMicModal').querySelector('.tw-rank-tv-head small'); if(sub){ sub.textContent = w[5]; sub.lang = LANG; }   // subtítulo no idioma do site, como o da TV
  var fx = $('twMicFechar'); if(fx) fx.setAttribute('aria-label', w[3]);
  tela.innerHTML = '<b>' + escHtml(w[0]) + '</b>' + (top ?
    '<div class="tw-tv-idol-stage"><span class="tw-tv-idol-sparkle" aria-hidden="true">🎶</span>' +
    '<span class="tw-rank-avatar-wrap tw-tv-idol-avatar"><span class="tw-rank-avatar-fallback" aria-hidden="true">🎤</span>' +
    '<canvas class="tw-rank-avatar" width="64" height="64" data-nick="' + escHtml(top.nick) + '" aria-hidden="true" style="display:none"></canvas></span>' +
    '<span class="tw-tv-idol-sparkle" aria-hidden="true">💖</span></div>' +
    '<p>' + escHtml(top.nick) + '</p><strong>💖 ' + top.score.toLocaleString() + '%</strong>' +
    (list.length > 1 ? '<ol class="tw-mic-lista">' + list.slice(1, 3).map(function(r, i){ return '<li>' + ['🥈', '🥉'][i] + ' ' + escHtml(r.nick) + ' · ' + r.score.toLocaleString() + '%</li>'; }).join('') + '</ol>' : '') +
    '<small class="tw-mic-sub">' + escHtml(w[4]) + '</small>' :
    '<p class="tw-rank-wait">' + escHtml(twRankData.online ? w[1] : twRankStatus('karaoke')) + '</p>');
}
var twMicSessao=0;
function twMicFechar(semFoco){
  twMicSessao++;
  var m=$('twMicModal'),b=$('twMicAbrir');if(!m||m.hidden)return;
  m.hidden=true;if(b){b.setAttribute('aria-expanded','false');if(!semFoco&&!hubOv.hidden)b.focus({preventScroll:true});}
}
var hubT = 0, hubAnim = 0, hubComecou = false, hubTutI = 0, hubMisDados = null;
function hubTemaUI(){   // chip do tema, partículas da tela e cor do fundo
  var k = temaAtual(), inf = TEMA_INFO[k], el = $('hubTema');
  if(inf){ el.textContent = inf[0] + ' ' + tr('Tema do momento') + ': ' + tr(inf[1]) + (TEMA_MUSICA[k] ? ' · ♪ ' + TEMA_MUSICA[k] : '') + ' · ' + tr('até') + ' ' + temaAteTxt(); el.hidden = false; }
  else el.hidden = true;
  var emo = inf ? { neve:'❄', petala:'🌸', folha:'🍁', coracao:'💖', flor:'🌼', sol:'✦', estrela:'★', fogos:'✨', morcego:'🦇', balao:'🎈', confete:'🎉' }[inf[5]] : '';
  $('hubPart').innerHTML = Array.apply(null, Array(14)).map(function(_, i){
    var s = emo || ['✦', '♡', '★'][i % 3], cor = emo ? '' : ';color:' + ['#9b30d9', '#ff6fb5', '#4169e1', '#5cc72c'][i % 4];
    return '<i style="left:' + (temaHash(i * 3) * 100).toFixed(1) + '%;animation-delay:-' + (temaHash(i * 7) * 14).toFixed(1) + 's;animation-duration:' + (10 + temaHash(i) * 8).toFixed(1) + 's;font-size:' + (12 + temaHash(i * 5) * 14).toFixed(0) + 'px' + cor + '">' + s + '</i>';
  }).join('');
  hubOv.setAttribute('data-tema', k || '');
}
function hubAv(){   // o seu Idol (com a pose e o visual da foto do perfil) e o pet ativo, no fundo da temporada
  var av = perfMeuAv && typeof perfMeuAv === 'object' ? JSON.parse(JSON.stringify(perfMeuAv)) : perfAvAtual({ pose:'v' });
  av.c = perfAvAtual().c; av.fundo = 'temporada';
  if(perfMinhaCor) av.cor = perfMinhaCor;
  if(!av.pose) av.pose = 'v';
  var p = petAtivo && petAtivo();
  av.pet = p && petData && PET_SP[petData.ativo] ? { k:petData.ativo, acc:p.acc || '', cfg: petData.ativo === 'meu' ? p.cfg : null } : null;
  return av;
}
var HUB_ROUPA_TEMA = { criancas:'jardineira', aniversario:'festa48', halloween:'vampiro', natal:'rena', anonovo:'reveillon', verao:'floral', valentine:'coracao', outono:'outono', sakura:'sakura', inverno:'puffer', tanabata:'yukata', primavera:'cardiga' };
var HUB_TRIO = [[0, 'nyan', .2, 'tsu', 6], [1, 'mic', .5, 'lirika', 3], [2, 'v', .78, 'pati', 2]];
var HUB_REAGE = { i:-1, t0:0, emo:[] };
var HUB_TRIO_EMO = [['💜','⭐','🐈'], ['💚','🌼','🐨'], ['💙','🌙','✨']];
var HUB_TRIO_OI = ['Oiê!', 'Oi, gente linda!', 'Oi gente, meu nome é Pati!'];
// As 5 falinhas de cada uma (voz real, com legenda e emoji da fala). Carregam só no primeiro toque.
var HUB_FALAS = [
  [['tsu-1','Oiê!','👋'], ['tsu-2','Eu sou o Tsu!','⭐'], ['tsu-3','にげていかない','🎤'], ['tsu-4','Eu amo comer pudim.','🍮'], ['tsu-5','hehe~','😆']],
  [['lirika-1','Oi, gente linda!','💚'], ['lirika-2','Li - ri - ka!','🐨'], ['lirika-3','ゆめはぜったい','🌈'], ['lirika-4','Tudo bem com vocês?','🌼'], ['lirika-5','hehe~','😆']],
  [['pati-1','Oi gente, meu nome é Pati!','💙'], ['pati-2','Bem gamer, tals...','🎮'], ['pati-3','いっておきたい','🌙'], ['pati-4','Um beijo. Chu!','💋'], ['pati-5','hehe~','😆']]
];
var HUB_PET_REAGE = { i:-1, t0:-999 }, HUB_FALA_ULT = [-1, -1, -1], HUB_FALA_CONTA = [0, 0, 0], hubVozAtual = null, HUB_VOZ_VOL = .55;
function hubVozParar(){
  var a=hubVozAtual;if(!a)return;hubVozAtual=null;
  try{a.pause();a.removeAttribute('src');a.load();}catch(e){}
}
function hubVozTocar(nome){   // voz curta: substitui e libera completamente a anterior
  if(typeof muted !== 'undefined' && muted || document.hidden || hubOv.hidden) return;
  hubVozParar();
  try{
    var a=new Audio('./audio/'+nome+'.mp3?v=1');a.volume=HUB_VOZ_VOL;hubVozAtual=a;
    a.addEventListener('loadedmetadata',function(){if(hubVozAtual===a&&isFinite(a.duration))HUB_REAGE.dur=Math.max(150,Math.round(a.duration*60)+50);},{once:true});
    var release=function(){if(hubVozAtual===a)hubVozParar();else{try{a.pause();a.removeAttribute('src');a.load();}catch(e){}}};
    a.addEventListener('ended',release,{once:true});a.addEventListener('error',release,{once:true});
    var pr=a.play();if(pr&&pr.catch)pr.catch(release);
  }catch(e){hubVozParar();}
}
function hubTrioReage(i){
  if(i < 0 || i > 2 || (HUB_REAGE.i === i && hubT - HUB_REAGE.t0 < 60)) return;
  var L = HUB_FALAS[i], ri = L.length - 1, k;   // a risada (última) vem a cada duas falas: fala, fala, hehe~
  if(HUB_FALA_CONTA[i] >= 2){ k = ri; HUB_FALA_CONTA[i] = 0; }
  else { k = Math.floor(Math.random() * ri); if(k === HUB_FALA_ULT[i]) k = (k + 1) % ri; HUB_FALA_CONTA[i]++; }
  HUB_FALA_ULT[i] = k;
  var f = L[k];
  HUB_REAGE = { i:i, t0:hubT, txt:f[1], emo:[0,1,2,3,4].map(function(n){ return { e:n % 2 ? f[2] : HUB_TRIO_EMO[i][n % 3], dx:(n - 2) * 9 + (Math.random() * 6 - 3), v:.5 + Math.random() * .5 }; }) };
  hubVozTocar(f[0]);
}   // [personagem, pose, posição, pet, expressão]
function hubDesenhar(){   // o TsuLiPa (trio) com os pets, no fundo do tema do momento (e com a roupa do tema)
  var cv = $('hubCv'); if(!cv) return;
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, t = hubT || 1, roupa = HUB_ROUPA_TEMA[temaAtual()] || '';
  var sc = H2 / 96, chao = H2 * .9;
  var oS = state, oPw = pw, oDpw = dpw, oR = rankI, oSa = sash, oA = accSel, oF = frame;
  try{
    x.clearRect(0, 0, W2, H2);
    perfFundo(x, W2, H2, 'temporada', '#ff6fb5', t);
    state = 'play'; pw = null; dpw = null; rankI = 0; sash = false; accSel = ''; frame = t;
    var visita = typeof bannerElenco === 'function' ? bannerElenco() : null;
    if(cv.getAttribute('role') === 'img' && typeof bannerRotulo === 'function'){ var rot = bannerRotulo(); if(cv.getAttribute('aria-label') !== rot) cv.setAttribute('aria-label', rot); }
    if(visita) bannerVisitaDesenhar(x, W2, H2, visita, t, roupa, sc, chao);
    else HUB_TRIO.forEach(function(m, i){
      var c=HUB_TRIO_DRAW_CHARS[i],base=CH[m[0]];
      c.out=base.out;c.outcol=base.outcol;
      if(roupa){ c.out = roupa; c.outcol = c.img; }   // roupa da temporada na cor de cada um
      var cx = W2 * m[2], bob = Math.sin(t * .06 + i * 2.1) * 1.1 * sc, ex = m[4];
      var rg = HUB_REAGE.i === i ? hubT - HUB_REAGE.t0 : 999;
      var rgD = (HUB_REAGE.dur || 220) - 30;   // reage enquanto a voz toca
      if(rg < rgD){ bob -= Math.abs(Math.sin(rg / 35 * Math.PI)) * (rg < 70 ? 9 : 3) * sc * (rg < 70 ? 1 - rg / 90 : 1); ex = 3; }
      x.fillStyle = 'rgba(30,10,60,.22)'; x.beginPath(); x.ellipse(cx, chao - .4 * sc, 9 * sc, 1.6 * sc, 0, 0, 7); x.fill();   // sombra pequena, só sob os pés
      perfCharContorno(x, cx - 15 * sc, chao - 44 * sc + bob, sc, function(){ charPose = m[1]; drawChar(c, 0, 0, 0, ex, false); });
      if(PET_SP[m[3]]){   // o pet de cada um, flutuando ao lado
        var pg = hubT - HUB_PET_REAGE.t0, pul = HUB_PET_REAGE.i === i && pg < 40 ? Math.abs(Math.sin(pg / 40 * Math.PI * 2)) * 5 * sc : 0;
        var ps = sc * .46, px = cx + 24 * sc, py = chao - 22 * sc + Math.sin(t * .08 + i) * 1.5 * sc - pul;   // flutuando, sem sombra (não cobre as abóboras)
        perfDesenharPetEm(x, { k:m[3], acc:'' }, px, py, ps, t + i * 40);
        if(HUB_PET_REAGE.i === i && pg < 70){ x.save(); x.globalAlpha = pg < 50 ? 1 : (70 - pg) / 20; x.textAlign = 'center'; x.font = (5 * sc) + 'px sans-serif'; x.fillStyle = ['#ff6fb5', '#5cc72c', '#4169e1'][i]; x.fillText('♪', px - 5 * sc, py - 9 * sc - pg * sc / 8); x.fillText('♡', px + 5 * sc, py - 12 * sc - pg * sc / 7); x.restore(); }
      }
    });
    var rg2 = hubT - HUB_REAGE.t0;
    var rDur = HUB_REAGE.dur || 220;   // dura o tempo da voz + um pouquinho
    if(HUB_REAGE.i >= 0 && rg2 < rDur){   // balão kawaii (balão + rabinho num só contorno) e emojis subindo dos lados
      var hi = HUB_REAGE.i, hx = W2 * HUB_TRIO[hi][2], top = chao - 50 * sc, al = rg2 < rDur - 30 ? 1 : (rDur - rg2) / 30;
      var corA = ['#9b30d9', '#3f9c1f', '#4169e1'][hi], corB = ['#ff9ce6', '#b6ff3b', '#7fd4ff'][hi];
      var pop = rg2 < 8 ? .6 + rg2 / 20 : 1;
      x.save(); x.globalAlpha = Math.max(0, al); x.textAlign = 'center'; x.textBaseline = 'middle';
      var txt = tr(HUB_REAGE.txt || HUB_TRIO_OI[hi]); x.font = (5 * sc) + 'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';
      var tw = x.measureText(txt).width + 10 * sc, th = 11 * sc, bx = Math.max(tw / 2 + 6, Math.min(W2 - tw / 2 - 6, hx)), by = top - 9 * sc;
      x.translate(bx, by); x.scale(pop, pop);
      var rr = th / 2, l = -tw / 2, rt = tw / 2, tp = -th / 2, bt = th / 2;
      var tx = Math.max(l + rr + 2.5 * sc, Math.min(rt - rr - 2.5 * sc, hx - bx)), tl = 3.2 * sc;
      x.beginPath(); x.moveTo(l + rr, tp); x.lineTo(rt - rr, tp); x.arc(rt - rr, 0, rr, -Math.PI / 2, Math.PI / 2);
      x.lineTo(tx + 2.4 * sc, bt); x.quadraticCurveTo(tx + .6 * sc, bt + tl * .5, tx, bt + tl); x.quadraticCurveTo(tx - .6 * sc, bt + tl * .5, tx - 2.4 * sc, bt);
      x.lineTo(l + rr, bt); x.arc(l + rr, 0, rr, Math.PI / 2, Math.PI * 1.5); x.closePath();
      var gr = x.createLinearGradient(0, tp, 0, bt + tl); gr.addColorStop(0, '#ffffff'); gr.addColorStop(1, '#fff0fa');
      x.shadowColor = corA; x.shadowBlur = 5 * sc; x.fillStyle = gr; x.fill(); x.shadowColor = 'transparent'; x.shadowBlur = 0;
      x.lineWidth = .9 * sc; x.lineJoin = 'round'; x.strokeStyle = corA; x.stroke();
      x.fillStyle = corA; x.fillText(txt, 0, .4 * sc);
      x.font = (3.6 * sc) + 'px sans-serif'; x.fillStyle = corB; x.fillText('✦', l - 1.6 * sc, tp + .5 * sc); x.fillText('♡', rt + 1.8 * sc, bt - 1.5 * sc);
      x.restore();
      if(rg2 < 140){
        x.save(); x.globalAlpha = rg2 < 110 ? 1 : (140 - rg2) / 30; x.textAlign = 'center'; x.textBaseline = 'middle';
        // No computador os emojis saíam apagados porque herdavam a cor semitransparente usada antes;
        // agora a cor é opaca, e o brilho branco e o pulinho de entrada deixam eles vivos como no celular.
        x.font = (6.5 * sc) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
        x.shadowColor = 'rgba(255,255,255,.95)'; x.shadowBlur = 2.4 * sc;
        x.fillStyle = '#000';   // cor opaca: no Chrome do Windows o emoji herda a transparência da cor anterior (a sombra dos pés, 22%)
        HUB_REAGE.emo.forEach(function(e2, n){   // sobem dos lados do Idol, abaixo do balão
          var lado = n % 2 ? 1 : -1, ex2 = hx + lado * (13 + (n % 3) * 4) * sc, ey = chao - 26 * sc - rg2 * e2.v * sc / 7 - n * 2 * sc;
          var nasce = rg2 - n * 3, esc = nasce < 0 ? 0 : nasce < 8 ? .4 + nasce / 8 * .9 : nasce < 13 ? 1.3 - (nasce - 8) / 5 * .3 : 1;
          if(esc <= 0) return;
          x.save(); x.translate(ex2 + Math.sin(rg2 / 9 + n) * 1.5 * sc, Math.max(top + 4 * sc, ey)); x.rotate(Math.sin(rg2 / 11 + n * 1.7) * .18); x.scale(esc, esc);
          x.fillText(e2.e, 0, 0); x.restore();
        });
        x.restore();
      }
    }
    if(temaPerfil() === 'halloween'){   // abóboras na frente: nada fica por cima delas
      var u = W2 / 320; petDrawAbobora(x, W2 * .1, H2 * .95, 2.1 * u, true); petDrawAbobora(x, W2 * .9, H2 * .95, 1.7 * u, true);
    }
  }catch(e){}
  finally{ state = oS; pw = oPw; dpw = oDpw; rankI = oR; sash = oSa; accSel = oA; frame = oF; charPose = ''; perfAntena = ''; }
}
function hubLoop(ms){
  hubAnim = 0; if(!twAnimacaoVisivel(hubOv)) return;
  var mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30()),delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta($('hubCv'),ms):1,hubPrevT=hubT;hubT+=delta; if((mobile30&&TWMotionLifecycle.render30Due($('hubCv'),ms))||(!mobile30&&Math.floor((hubT+1e-6)/2)>Math.floor((hubPrevT+1e-6)/2))) hubDesenhar();
  hubAnim = requestAnimationFrame(hubLoop);
}
function hubPetInfo(){   // como está o pet ativo (sem mexer no save): [texto, precisa de atenção]
  var p = petData && petAtivo && petAtivo(); if(!p) return [tr('Adote um pet!'), false, false];
  var h = Math.min(Math.max(0, Date.now() - (p.t || Date.now())), PET_CAP) / 36e5, menor = 100, comFome = false;
  Object.keys(PET_RATE).forEach(function(k){ var v = (p[k] || 0) - PET_RATE[k] * h * (p.dorme ? .5 : 1); if(k === 'fome') comFome = v < 40; if(!(p.dorme && k === 'energia')) menor = Math.min(menor, v); });
  var nome = p.nome || (PET_SP[petData.ativo] ? PET_SP[petData.ativo].n : 'Pet');
  return menor < 40 ? [nome + ' ' + tr('precisa de você!'), true, comFome] : [nome + ' ' + tr('está bem!'), false, comFome];
}
// Karaoke⭐Day! (antiga sala simultânea de domingo) foi aposentado.
// Karaoke⭐Time! é um jogo solo: a conta joga, a plateia são contas cadastradas e o ranking semanal é online.
// Não existe sala online (o antigo Karaoke⭐Day!, com fila e horário de domingo, foi removido).
var TW_KARAOKE_TIME=true;
function twKaraokeAtualizarCard(){
  var cards=$('hubCards'),card=cards&&cards.querySelector('[data-ir="karaoke"]');
  if(!card)return;
  if(TW_KARAOKE_TIME){
    var tt=card.querySelector('.tw-karaoke-timer'),tk=card.querySelector('.tw-karaoke-ticket-count');
    card.classList.remove('tw-karaoke-locked');card.removeAttribute('aria-disabled');
    // Rosa de alerta (como Pet, Gacha e Sora) enquanto faltar algum dos 5 shows do dia.
    var usados=contaJ&&typeof twRankData!=='undefined'?twRankData.ktUsados:null,faltam=usados===null?null:Math.max(0,5-usados),extras=contaJ&&typeof twRankData!=='undefined'?Math.max(0,twRankData.ktTickets||0):0;
    if(tk){var labels = window.TW_I18N.locale.labels;;tk.textContent='🎟️ '+(contaJ?extras:'—');tk.setAttribute('aria-label',(labels[LANG]||labels.pt)+': '+(contaJ?extras:'—'));tk.classList.toggle('tw-has-ticket',extras>0);}
    var pendente=!!contaJ&&(faltam!==0||extras>0);
    card.classList.toggle('tw-alert-pink',pendente);
    var al=card.querySelector('.hubalerta');
    if(pendente&&!al)card.insertAdjacentHTML('beforeend','<em class="hubalerta" aria-hidden="true">!</em>');
    else if(!pendente&&al)al.remove();
    var txtK=faltam===null?{pt:'🎤 5 shows por dia',en:'🎤 5 shows a day',es:'🎤 5 shows al día',ja:'🎤 1日5回のショー',th:'🎤 วันละ 5 โชว์',id:'🎤 5 pertunjukan per hari'}:
      faltam===0&&extras>0?{pt:'🎤 Gratuitas usadas',en:'🎤 Free shows used',es:'🎤 Gratis agotados',ja:'🎤 無料分終了',th:'🎤 ใช้สิทธิ์ฟรีครบแล้ว',id:'🎤 Jatah gratis habis'}:
      faltam===0?{pt:'🌙 Volte amanhã',en:'🌙 Come back tomorrow',es:'🌙 Vuelve mañana',ja:'🌙 また明日',th:'🌙 กลับมาพรุ่งนี้',id:'🌙 Kembali besok'}:
      {pt:'🎤 Faltam '+faltam+' de 5 shows',en:'🎤 '+faltam+' of 5 shows left',es:'🎤 Quedan '+faltam+' de 5 shows',ja:'🎤 残り'+faltam+'/5回',th:'🎤 เหลือ '+faltam+' จาก 5 โชว์',id:'🎤 Tersisa '+faltam+' dari 5 pertunjukan'};
    // as mesmas estrelinhas da sala: ★ = show que ainda resta hoje, ☆ = show já usado
    var pips=faltam===null?'':'★'.repeat(faltam)+'☆'.repeat(5-faltam)+' · ';
    if(tt)tt.textContent=pips?pips+(txtK[LANG]||txtK.pt).replace(/^\S+\s/,''):(txtK[LANG]||txtK.pt);
    card.title='Karaoke⭐Time!';
  }
}
// Consulta somente local: acompanha a missão diária do Sora em seu armazenamento isolado.
// Preserva as chaves originais e nunca faz chamadas à API de contas ou do Supabase.
function twSoraMissaoPendente(){
  try{
    var key='brs48cr_mis_sora', isolated='__tsulipa_sorajump_test_v1__::'+key;
    var dia=localStorage.getItem(isolated);
    if(dia==='__TW_TEST_DELETED__')return true;
    if(dia===null)dia=localStorage.getItem(key);
    return dia!==dk();
  }catch(e){return true;}
}
var HUB_MUSICAS = [['duo','Moon⭐Duo!'],['normal','Brilha Comigo'],['fast','Love × Debut'],['gacha','Star⭐Gacha!'],['chill','Doce Melodia']];
function hubMusicaSemana(){   // mesmo rodízio do karaoke-room-views.js: troca todo domingo 0h de Brasília; semana de 01/11/2026 = Moon⭐Duo!
  var sem = Math.floor((Date.now() - Date.UTC(2026, 10, 1, 3)) / 6048e5);
  return HUB_MUSICAS[((sem % 5) + 5) % 5];
}
// Agenda visual: reaproveita exclusivamente as missões já carregadas pelo Hub.
var HUB_AGENDA_ROTAS = {cafe:'cafe',handshake:'handshake',duo:'duo',pet:'pet',mini:'pet'};
// O compromisso é uma preferência da sessão: nunca entra no save nem modifica a missão.
var hubAgendaFoco = '', hubAgendaFocoConta = '', hubAgendaFocoDia = '';
function hubAgendaFocoAtual(){
  var dono = typeof contaJ !== 'undefined' && contaJ ?
    String((typeof contaAuthUserId === 'string' && contaAuthUserId) || contaJ.id || contaJ.nick || '') : '';
  var dia = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  if(dono !== hubAgendaFocoConta || dia !== hubAgendaFocoDia){
    hubAgendaFoco = ''; hubAgendaFocoConta = dono; hubAgendaFocoDia = dia;
  }
  return dono ? hubAgendaFoco : '';
}
// Pedido de fã é apenas uma opção da Agenda: os dados vêm da janela já existente.
var HUB_AGENDA_FA_ROTAS = {corridas3:'run',estrelas30:'run',pontos1500:'run',karaoke1:'karaoke'};
function hubAgendaPedidoFa(){
  if(!contaJ || typeof faAbrir !== 'function') return null;
  var d = typeof faDadosAtuais === 'function' ? faDadosAtuais() : null;
  var conhecido = d && typeof FA_PEDIDOS !== 'undefined' && FA_PEDIDOS[d.tipo];
  return {
    k:'pedido_fa', titulo:conhecido ? tr(conhecido[1]).replace('{n}', d.meta) : tr('Pedido de fã'),
    meta:d ? Math.max(1, +d.meta || 1) : 0,
    prog:d ? Math.max(0, +d.progresso || 0) : 0,
    feito:!!(d && d.resgatado), pronta:!!(d && d.feito),
    carregado:!!conhecido, pedidoTipo:conhecido ? d.tipo : ''
  };
}
// Convite somente da sessão atual: não é missão nem cria estado persistido.
function hubAgendaReencontro(){
  var pendente = typeof hsCafePendente !== 'undefined' ? hsCafePendente : null;
  if(!pendente || !contaJ || typeof hsMemChave !== 'function' ||
     pendente.conta !== hsMemChave() || typeof hsMemLer !== 'function' ||
     typeof hsNomesLivres !== 'function') return null;
  var memoria = hsMemLer().find(function(m){ return m.nome === pendente.nome && m.pres === pendente.pres; });
  return memoria && hsNomesLivres().indexOf(memoria.nome) >= 0 ? memoria : null;
}
function hubAgendaEscolher(lista){
  if(!Array.isArray(lista) || !lista.length) return null;
  var foco = hubAgendaFocoAtual();
  var escolhida = foco && lista.find(function(m){ return m && m.k === foco; });
  if(escolhida) return escolhida; // manter o compromisso visível até o jogador escolher outro
  var abertas = lista.filter(function(m){ return m && !m.feito; });
  var pronta = abertas.find(function(m){ return +m.prog >= Math.max(1, +m.meta || 1); });
  return pronta || abertas.find(function(m){ return HUB_AGENDA_ROTAS[m.k]; }) || abertas[0] || lista[0] || null;
}
// Só oferece outra missão diária realmente pendente; pedidos de fã não são missões novas.
// Ação social já confirmada: atualizar somente a missão em foco pela consulta existente.
function hubAgendaSocialConfirmar(tipo){
  if(!contaJ || hubAgendaFocoAtual() !== tipo) return;
  hubMisCarregar();
}
function hubAgendaProximo(lista, atual){
  if(!Array.isArray(lista)) return null;
  var pendentes = lista.filter(function(m){
    return m && m.k !== 'pedido_fa' && m.k !== atual && +m.meta > 0 && !m.feito && +m.prog < +m.meta;
  });
  return pendentes.find(function(m){ return HUB_AGENDA_ROTAS[m.k]; }) || pendentes[0] || null;
}
function hubAgendaUI(){
  var linha = $('hubHojeLinha'), b = $('hubAgenda');
  if(!linha) return;
  var missoes = Array.isArray(hubMisDados) ? hubMisDados.filter(function(m){ return m && typeof m.k === 'string' && +m.meta > 0; }) : [];
  // O pedido só se junta às opções quando a lista normal do Hub foi carregada.
  var pedido = contaJ && Array.isArray(hubMisDados) ? hubAgendaPedidoFa() : null;
  if(pedido) missoes.push(pedido);
  if(!contaJ || !missoes.length){
    if(b) b.remove();
    return;
  }
  if(!b || b.tagName !== 'DIV'){
    if(b) b.remove();
    b = document.createElement('div');
    b.id = 'hubAgenda';
    b.className = 'hubmusica hubagenda';
    b.style.gridColumn = '1 / -1';
    linha.appendChild(b);
  }
  if(linha.lastElementChild !== b) linha.appendChild(b);
  var m = hubAgendaEscolher(missoes), ehPedido = m.k === 'pedido_fa';
  var social = m.k === 'coracao' || m.k === 'recado';
  var t = ehPedido ? ['💌',m.titulo] : m.k === 'collect' ? hubCollectHoje() : HUB_MIS[m.k] || ['🎯', m.k];
  var meta = Math.max(1, +m.meta || 1), prog = Math.min(meta, Math.max(0, +m.prog || 0));
  var pronta = ehPedido ? m.pronta : prog >= meta, rotulos = {
    pt:['Agenda do Idol','Meu compromisso de hoje','Concluída','Próximo compromisso'],
    en:['Idol Agenda',"Today's focus",'Completed','Next commitment'],
    es:['Agenda del Idol','Mi compromiso de hoy','Completada','Siguiente compromiso'],
    id:['Agenda Idol','Fokus hari ini','Selesai','Komitmen berikutnya'],
    th:['ตารางไอดอล','เป้าหมายวันนี้','สำเร็จแล้ว','ภารกิจถัดไป'],
    ja:['アイドルの予定','今日の目標','達成','次の予定']
  }, textos = rotulos[LANG] || rotulos.pt;
  var descricao = t[0] + ' ' + (ehPedido ? t[1] : tr(t[1]).replace('{n}', m.meta));
  var estado = ehPedido && !m.carregado ? '—' : m.feito ? '✓ ' + escHtml(textos[2]) : prog + '/' + meta;
  var acao = ehPedido ? (!m.carregado || m.feito ? tr('Pedido de fã') : pronta ? tr('Entregar') : tr('Abrir')) :
    m.feito ? tr('Missões do dia') : pronta ? tr('Resgatar') : social ? tr('Procurar Idol pelo nome') : tr('Abrir');
  var proximo = (m.feito || pronta) ? hubAgendaProximo(missoes, m.k) : null;
  var reencontro = hubAgendaReencontro();
  var mensagemReencontro = reencontro && tr(
    reencontro.jeito === 'animado' ? '{n} saiu animado do Café! Talvez volte no Handshake.' :
    reencontro.jeito === 'timido' ? '{n} sorriu timidamente no Café. Talvez vocês se encontrem no Handshake.' :
    '{n} guardou com carinho a visita ao Café. Talvez volte no Handshake.'
  ).replace('{n}', reencontro.nome);
  var opcoes = missoes.map(function(item){
    var nome = item.k === 'pedido_fa' ? ['💌',item.titulo] : item.k === 'collect' ? hubCollectHoje() : HUB_MIS[item.k] || ['🎯', item.k];
    var legenda = nome[0] + ' ' + (item.k === 'pedido_fa' ? nome[1] : tr(nome[1]).replace('{n}', item.meta)) + (item.feito ? ' ✓' : '');
    return '<option value="' + escHtml(item.k) + '"' + (item.k === m.k ? ' selected' : '') + '>' + escHtml(legenda) + '</option>';
  }).join('');
  b.innerHTML = '<label for="hubAgendaEscolha">📅 <b>' + escHtml(textos[0]) + '</b></label>' +
    '<small>' + escHtml(textos[1]) + '</small>' +
    '<select id="hubAgendaEscolha" aria-label="' + escHtml(textos[1]) + '">' + opcoes + '</select>' +
    '<small class="hubagendaresumo">' + escHtml(descricao) + ' · ' + estado + '</small>' +
    '<button type="button" class="hubagendaabrir">' + escHtml(acao) + ' ↗</button>' +
    (ehPedido && m.carregado && !pronta && !m.feito ?
      '<button type="button" class="hubagendaabrir hubagendaver">💌 ' + escHtml(tr('Pedido de fã')) + ' ↗</button>' : '') +
    (proximo ? '<button type="button" class="hubagendaabrir hubagendaproximo" aria-label="' +
      escHtml(textos[3]) + '">✨ ' + escHtml(textos[3]) + ' ↗</button>' : '') +
    (reencontro ? '<strong class="hubagendaresumo">💌 ' + escHtml(tr('Possível reencontro com {n}').replace('{n}', reencontro.nome)) + '</strong>' +
      '<small class="hubagendaresumo">' + escHtml(mensagemReencontro) + ' ' +
      escHtml(tr('A aparição depende dos desafios do servidor.')) + '</small>' +
      '<button type="button" class="hubagendaabrir hubagendareencontro" style="min-height:44px">🤝 ' +
      escHtml(tr('Tentar reencontro no Handshake')) + ' ↗</button>' : '');
  b.querySelector('select').onchange = function(e){
    var chave = e.target.value;
    if(missoes.some(function(item){ return item.k === chave; })){
      hubAgendaFocoAtual(); hubAgendaFoco = chave; hubAgendaUI();
    }
  };
  b.querySelector('button').onclick = function(){
    if(ehPedido && (!m.carregado || pronta || m.feito)){ faAbrir(); return; }
    if(social && !pronta && !m.feito){
      var busca = $('hubBusca');
      if(busca){
        if(typeof busca.scrollIntoView === 'function') busca.scrollIntoView({behavior:'smooth', block:'center'});
        busca.focus(); return; // o jogador escolhe o perfil e decide dar coração ou escrever
      }
    }
    var rota = ehPedido ? HUB_AGENDA_FA_ROTAS[m.pedidoTipo] : !pronta ? HUB_AGENDA_ROTAS[m.k] : '';
    var cards = $('hubCards'), destino = rota && cards && cards.querySelector('[data-ir="' + rota + '"]');
    if(destino && typeof destino.click === 'function'){ destino.click(); return; }
    if(ehPedido){ faAbrir(); return; }
    var painel = $('hubMisPainel');
    if(painel && typeof painel.scrollIntoView === 'function') painel.scrollIntoView({behavior:'smooth',block:'center'});
  };
  var ver = b.querySelector('.hubagendaver');
  if(ver) ver.onclick = faAbrir; // atualização somente quando o jogador solicitar
  var avancar = b.querySelector('.hubagendaproximo');
  if(avancar) avancar.onclick = function(){
    var outra = hubAgendaProximo(missoes, m.k);
    if(!outra) return;
    hubAgendaFocoAtual(); hubAgendaFoco = outra.k; hubAgendaUI();
  };
  var tentar = b.querySelector('.hubagendareencontro');
  if(tentar) tentar.onclick = function(){
    var cards = $('hubCards'), destino = cards && cards.querySelector('[data-ir="handshake"]');
    if(destino && typeof destino.click === 'function') destino.click();
  };
}
// Ao fechar os dois jogos de fãs, reler as missões já existentes (sem nova RPC).
// Registrar somente quando o Hub abre, sem executar código ao importar o módulo.
var hubAgendaFechamentoRegistrado = false;
function hubAgendaEscutarFechamento(){
  if(hubAgendaFechamentoRegistrado) return;
  document.addEventListener('click', function(e){
    if(!e.target || !e.target.closest || !e.target.closest('#cfX, #hsX')) return;
    if(!contaJ || typeof hubOv === 'undefined' || !hubOv || hubOv.hidden) return;
    hubAgendaUI(); // convite e despedida atualizam sem nova consulta online
    if(hubAgendaFocoAtual()) hubMisCarregar();
  });
  hubAgendaFechamentoRegistrado = true;
}
function hubBlocosUI(){   // títulos dos blocos Hoje / Jogos / Meu mundo e o atalho da Música da semana
  var t = $('hubHojeT'); if(!t) return;
  t.innerHTML = '☀️ ' + escHtml(tr('Hoje')) + ' <small class="tw-jpsub" lang="ja">今日</small>' + (typeof hojeHtml === 'function' ? hojeHtml() : '');
  if(typeof hojeIniciar === 'function') hojeIniciar();
  var m = hubMusicaSemana(), b = $('hubMusica');
  b.innerHTML = '🎵 <b>' + escHtml(tr('Música da semana')) + '</b><small class="tw-hubgame-jp" lang="ja">今週の曲</small><small translate="no">' + escHtml(m[1]) + '</small>';
  b.onclick = function(){ var k = hubOv.querySelector('#hubCards [data-ir="karaoke"]'); if(k) k.click(); };
  b.style.display = 'none';   // a Música da semana agora mora no Idol⭐News!
  var linha = $('hubHojeLinha'), jn = $('hubJornal');
  if(linha && !jn){ jn = document.createElement('button'); jn.type = 'button'; jn.className = 'hubmusica hubjornal'; jn.id = 'hubJornal'; jn.onclick = function(){ if(sfx.card) sfx.card(); jornalAbrir(); }; linha.appendChild(jn); }
  var fb = $('hubFa');
  if(linha && typeof faCartaoHtml === 'function'){ if(fb) fb.remove(); linha.insertAdjacentHTML('beforeend', faCartaoHtml()); fb = $('hubFa'); fb.onclick = function(){ if(sfx.card) sfx.card(); $('faTit').textContent = '💌 ' + tr('Pedido de fã'); faAbrir(); }; }
  if(jn) jn.innerHTML = '📰 <b translate="no">Idol⭐News!</b><small class="tw-hubgame-jp" lang="ja">アイドル・ニュース</small><small>' + escHtml(tr('Os destaques da semana')) + '</small>';
  hubAgendaUI();
}
function hubLoginCtaUI(){   // visitante: botão "Entrar" pequeno na linha do tema do Oshi (benefícios no title)
  var box=$('hubLoginCta'); if(!box) return;
  var btn=$('hubLoginBtn'); box.hidden=false;
  if(contaJ){   // logado: o mesmo lugar vira "Sair" (toque duas vezes para confirmar)
    btn.classList.add('hubsair'); $('hubLoginTxt').textContent='🚪 '+tr('Sair');
    btn.title=tr('Sair da conta')+' ('+contaJ.nick+')'; btn.setAttribute('aria-label',btn.title);
    btn.onclick=function(e){ e.stopPropagation();
      if(btn.dataset.confirma){ delete btn.dataset.confirma; contaSair(); return; }
      btn.dataset.confirma='1'; $('hubLoginTxt').textContent='🚪 '+tr('Sair?')+' ✓';
      setTimeout(function(){ if(btn.dataset.confirma){ delete btn.dataset.confirma; if(contaJ) $('hubLoginTxt').textContent='🚪 '+tr('Sair'); } },4000); };
    return;
  }
  btn.classList.remove('hubsair'); delete btn.dataset.confirma;
  $('hubLoginTxt').textContent=tr('Entrar');
  var dica=tr('Entrar com Google')+': '+tr('☁️ Salva na nuvem · 🎯 Missões · 🏆 Ranking');
  $('hubLoginBtn').title=dica; $('hubLoginBtn').setAttribute('aria-label',dica);
  $('hubLoginBtn').onclick=function(e){ e.stopPropagation(); contaEntrar(); };
}
function hubGameAbrir(nome){
  var verbo={pt:'Abrir',en:'Open',es:'Abrir',ja:'開く',th:'เปิด',id:'Buka'};
  return (verbo[LANG]||verbo.pt)+' '+nome;
}
function hubCardsUI(){
  hubLoginCtaUI();
  var pi = hubPetInfo(), soraPendente = twSoraMissaoPendente();
  var lockHtml = !contaJ ? '<em class="tw-profile-lock" aria-hidden="true" title="' + escHtml(tr('Entrar com Google')) + '">🔒</em>' : '';
  // 🧪 Temporário: os cards dos jogos especiais aparecem livres sem login.
  var gameLock = (!contaJ && !window.TW_JOGOS_SEM_LOGIN) ? lockHtml : '';
  hubBlocosUI();
  $('hubCards').innerHTML =
    '<h2 class="hubblocot hubbt-mundo">💖 ' + escHtml(tr('Meu mundo')) + ' <small class="tw-jpsub" lang="ja">マイワールド</small></h2>' +
    '<button type="button" class="hubcard hubperf" data-ir="perfil"><canvas id="hubAvCv" width="96" height="96" aria-hidden="true"></canvas><b>' + escHtml(tr('Meu Perfil')) + '</b><small class="tw-hubgame-jp" lang="ja">マイプロフィール</small><small>' + escHtml(contaJ ? contaJ.nick : tr('Entrar com Google')) + '</small></button>' +
    '<button type="button" class="hubcard hubpet' + (pi[2] ? ' tw-alert-pink' : '') + '" data-ir="pet">' + lockHtml + '<i>' + (petData && petData.ativo && PET_SP[petData.ativo] ? PET_SP[petData.ativo].emo : '🐾') + '</i><b translate="no">Backstage⭐Pet!</b><small class="tw-hubgame-jp" lang="ja">バックステージ・ペット</small><small>' + escHtml(pi[0]) + '</small>' + (contaJ && pi[1] ? '<em class="hubalerta">!</em>' : '') + '</button>' +
    (typeof shopHubHtml === 'function' ? shopHubHtml() : '') +
    '<h2 class="hubblocot hubbt-jogos">🎮 ' + escHtml(tr('Jogos')) + ' <small class="tw-jpsub" lang="ja">ゲーム</small></h2>' +
    '<button type="button" class="hubcard hubrun" data-ir="run"><i>🏁</i><b translate="no">Center⭐Run!</b><small class="tw-hubgame-jp" lang="ja">センター・ラン</small><small>🏆 ' + escHtml(tr('Recorde')) + ': ' + (best || 0) + '</small><span class="hubgo">▶ ' + escHtml(tr('Jogar')) + '</span></button>' +
    '<button type="button" class="hubcard hubgacha' + (contaJ && gachaFeito ? '' : ' on') + '" data-ir="gacha">' + lockHtml + '<i>🎰</i><b>' + '<span translate="no">Star⭐Gacha!</span>' + '</b><small class="tw-hubgame-jp" lang="ja">スター・ガチャ</small><small>' + escHtml(tr('1 giro por dia')) + '</small>' + (contaJ && !gachaFeito ? '<em class="hubalerta">!</em>' : '') + '</button>' +
    (typeof hsHubHtml === 'function' ? hsHubHtml() : '') + (typeof cfHubHtml === 'function' ? cfHubHtml() : '');
  // Vitrine de teste: dois novos jogos são cards nativos do hub, sem outra homepage.
  var twGamesTxt = window.TW_I18N.locale.twGamesTxt;
  twGamesTxt = twGamesTxt[LANG]||twGamesTxt.pt;
  $('hubCards').insertAdjacentHTML('beforeend',
    '<button type="button" class="hubcard tw-hubgame tw-hubgame-sora' + (soraPendente ? ' tw-alert-pink' : '') + '" data-ir="sora" aria-label="'+escHtml(hubGameAbrir('Sora Jump'))+'">' + gameLock + '<i aria-hidden="true">☁️</i><b translate="no">Sora<span class="tw-star">⭐</span>Jump!</b><small class="tw-hubgame-jp" lang="ja">ソラ・ジャンプ</small><small>'+escHtml(twGamesTxt[0])+'</small>'+(contaJ && soraPendente?'<em class="hubalerta" aria-hidden="true">!</em>':'')+'</button>'+
    '<button type="button" class="hubcard tw-hubgame tw-hubgame-karaoke" data-ir="karaoke" aria-label="'+escHtml(hubGameAbrir('Karaoke Time'))+'">' + gameLock + '<i aria-hidden="true">🎤</i><b translate="no">Karaoke<span class="tw-star">⭐</span>'+(TW_KARAOKE_TIME?'Time!':'Day!')+'</b><small class="tw-hubgame-jp" lang="ja">'+(TW_KARAOKE_TIME?'カラオケ・タイム':'カラオケ・デー')+'</small><small>'+escHtml(twGamesTxt[1])+'</small><small class="tw-karaoke-timer" aria-live="off"></small><small class="tw-karaoke-ticket-count" aria-live="polite">🎟️ —</small></button>' +
    '<button type="button" class="hubcard hubduo" data-ir="duo">' + lockHtml + '<i>🌙</i><b translate="no">Moon⭐Duo!</b><small class="tw-hubgame-jp" lang="ja">ムーン・デュオ</small><small>' + escHtml(tr('Duas amizades, mil cenas! Monte poses, danças e lanchinhos com outro Idol.')) + '</small></button>'
  );
  // Jogos em ordem alfabética. O Center⭐Run! continua primeiro e ocupa a linha inteira.
  ['handshake','cafe','karaoke','duo','sora','gacha'].forEach(function(k){
    var card = $('hubCards').querySelector('[data-ir="' + k + '"]');
    if(card) $('hubCards').appendChild(card);
  });
  twKaraokeAtualizarCard();
  try{ perfFotoRedonda($('hubAvCv'), hubAv(), true); }catch(e){}
}
function hubMisUI(){
  hubAgendaUI();
  $('hubMisT').innerHTML = '🎯 ' + escHtml(tr('Missões do dia')) + '<small class="tw-jpsub" lang="ja">今日のミッション</small>';
  var box = $('hubMis');
  if(!contaJ){ box.innerHTML = '<p class="hubdica">' + escHtml('🔒 ' + tr('Entrar com Google') + ' · ' + tr('Missões do dia')) + '</p>'; return; }
  if(!hubMisDados){ box.innerHTML = '<p class="hubdica">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  box.innerHTML = '<ul class="hubmis">' + hubMisDados.map(function(m){
    var t = m.k === 'collect' ? hubCollectHoje() : HUB_MIS[m.k] || ['🎯', m.k], pc = Math.round(Math.min(1, m.prog / Math.max(1, m.meta)) * 100), pronto = m.prog >= m.meta;
    var acao = m.feito ? '<em class="ok">✓ ★' + m.premio + '</em>' : (m.k === 'collect' && !pronto) ? '<button type="button" class="btn alt" data-collect="1">' + escHtml(tr('Abrir')) + ' ↗</button>' : (m.k === 'duo' && !pronto) ? '<button type="button" class="btn alt" data-hduo="1">' + escHtml(tr('Abrir')) + ' 🌙</button>' : pronto ? '<button type="button" class="btn" data-resg="' + escHtml(m.k) + '">' + escHtml(tr('Resgatar')) + ' ★' + m.premio + '</button>' : '<em>' + (m.meta > 9 ? m.prog + '/' + m.meta : m.prog + '/' + m.meta) + ' · ★' + m.premio + '</em>';
    return '<li class="' + (m.feito ? 'feita' : pronto ? 'pronta' : '') + '"><span>' + t[0] + '</span><div><b>' + escHtml(tr(t[1]).replace('{n}', m.meta)) + '</b><i style="--p:' + pc + '%"></i></div>' + acao + '</li>';
  }).join('') + '</ul>';
}
function hubMisCarregar(){
  if(typeof recCarregar === 'function') recCarregar();   // 🏅 Meus recordes (depois dos Jogos)
  if(!contaJ){ hubMisDados = null; hubMisUI(); return; }
  hubMisDados = null; hubMisUI();
  contaRpc('missoes').then(function(r){ hubMisDados = Array.isArray(r) ? r : []; hubMisUI(); }).catch(function(){});
}
// INDEX 2 · actual TsuLiPa hub extension, never a standalone/mock homepage.
// Center, Sora⭐Jump! and Karaoke⭐Time! weekly podiums are served by verified backend RPCs.
// Karaoke⭐Time! is a solo rhythm game; its visual audience is not a simultaneous room.
var TW_RANK_ONLINE_READY=true, TW_SORA_WEEK_STORAGE='tw_index2_sora_week';
var twRankData={week:'',center:[],sora:[],karaoke:[],kcombo:[],kacertos:[],ktUsados:null,ktTickets:0,centerOK:false,online:false,mine:null,readAt:0,active:0};
var twRankTimer=null,twRankPending=null;
var twRankGames=[['center','🏁','Center⭐Run!','pts'],['sora','☁️','Sora⭐Jump!','m'],['karaoke','🎤','Karaoke⭐Time!','pts']];
function twRankWord(i){return (TW_RANK_WORDS[LANG]||TW_RANK_WORDS.pt)[i];}
function twRankSundayKey(timestamp){
 var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(timestamp===undefined?Date.now():timestamp));
 var o={};parts.forEach(function(p){o[p.type]=p.value;});
 var d=new Date(Date.UTC(+o.year,+o.month-1,+o.day));d.setUTCDate(d.getUTCDate()-d.getUTCDay());
 return d.toISOString().slice(0,10);
}
function twRankLocal(){
 var week=twRankSundayKey();
 try{
  var v=JSON.parse(localStorage.getItem(TW_SORA_WEEK_STORAGE)||'null');
  if(v&&v.week!==week){localStorage.removeItem(TW_SORA_WEEK_STORAGE);return null;}
  if(v&&v.week===week&&contaJ&&v.nick===contaJ.nick&&Number.isSafeInteger(v.score)&&v.score>0)return v;
 }catch(e){}
 return null;
}
function twRankRecordLocal(value){
 var score=Number(value);
 if(!contaJ||!contaJ.nick||!Number.isSafeInteger(score)||score<1||score>200000)return;
 var old=twRankLocal();
 try{localStorage.setItem(TW_SORA_WEEK_STORAGE,JSON.stringify({week:twRankSundayKey(),nick:contaJ.nick,score:Math.max(score,old?old.score:0)}));}catch(e){}
 twRankRenderProfile();
}
function twRankCheckWeek(){
 var now=twRankSundayKey();
 if(now===twRankData.week)return;
 twRankData.week=now;twRankData.center=[];twRankData.sora=[];twRankData.karaoke=[];twRankData.kcombo=[];twRankData.kacertos=[];
 twRankData.centerOK=false;twRankData.online=false;twRankData.mine=null;twRankData.readAt=0;
}
function twRankClean(list){
 if(!Array.isArray(list))return [];
 var best=Object.create(null);
 list.slice(0,30).forEach(function(p){
  if(!p||typeof p!=='object')return;
  var nick=String(p.nick||p.name||'').trim().slice(0,24);
  var score=Math.floor(Number(p.score===0?0:(p.score||p.pts||0)));
  if(!nick||!Number.isSafeInteger(score)||score<=0)return;
  var key=nick.toLocaleLowerCase('pt-BR');
  if(!best[key]||score>best[key].score)best[key]={nick:nick,score:score};
 });
 return Object.keys(best).map(function(k){return best[k];})
  .sort(function(a,b){return b.score-a.score||a.nick.localeCompare(b.nick);}).slice(0,3);
}
function twRankStatus(id){
 if(id==='center'&&!twRankData.centerOK)return twRankWord(2);
 if((id==='sora'||id==='karaoke')&&!twRankData.online)return twRankWord(1);
 return twRankWord(0);
}
function twRankRow(row,i,unit,game){
 var face={center:'🏁',sora:'☁️',karaoke:'🎤'}[game]||'⭐';
 return '<li><span class="tw-rank-medal" aria-hidden="true">'+['🥇','🥈','🥉'][i]+'</span>'+
  '<span class="tw-rank-avatar-wrap"><span class="tw-rank-avatar-fallback" aria-hidden="true">'+face+'</span>'+
  '<canvas class="tw-rank-avatar" width="48" height="48" data-nick="'+escHtml(row.nick)+'" aria-hidden="true" style="display:none"></canvas></span>'+
  '<button type="button" class="lbn tw-rank-nick" data-nick="'+escHtml(row.nick)+'">'+escHtml(row.nick)+'</button>'+
  '<strong>'+row.score.toLocaleString()+' '+unit+'</strong></li>';
}
function twRankSlots(list){
 var rows=Array.isArray(list)?list.slice(0,3):[];
 while(rows.length<3)rows.push(null);
 return rows;
}
function twRankEmptyRow(i,game){
 var face={center:'🏁',sora:'☁️',karaoke:'🎤'}[game]||'⭐';
 var medal=['🥇','🥈','🥉'][i]||'';
 return '<li class="tw-rank-empty" aria-label="'+(i+1)+' · '+escHtml(twRankWord(15))+'">'+
  '<span class="tw-rank-medal" aria-hidden="true">'+medal+'</span>'+
  '<span class="tw-rank-avatar-wrap"><span class="tw-rank-avatar-fallback" aria-hidden="true">'+face+'</span></span>'+
  '<span class="tw-rank-empty-name">'+escHtml(twRankWord(15))+'</span>'+
  '<strong>—</strong></li>';
}
function twRankDrawAvatars(){
 var people=typeof hubIdolsDados!=='undefined'&&hubIdolsDados&&Array.isArray(hubIdolsDados.idols)?hubIdolsDados.idols:[];
 [].forEach.call(document.querySelectorAll('#hub .tw-rank-avatar'),function(cv){
  var key=String(cv.getAttribute('data-nick')||'').trim().toLocaleLowerCase('pt-BR'),person=null;
  for(var i=0;i<people.length;i++){
   var p=people[i];if(p&&p.nick&&p.avatar&&String(p.nick).trim().toLocaleLowerCase('pt-BR')===key){person=p;break;}
  }
  if(!person||typeof perfDesenharIdol!=='function'){cv.style.display='none';return;}
  try{var ctx=cv.getContext('2d');if(!ctx){cv.style.display='none';return;}
   ctx.clearRect(0,0,cv.width,cv.height);perfDesenharIdol(ctx,cv.width,cv.height,person.avatar,true,true,0);cv.style.display='block';
  }catch(e){cv.style.display='none';}
 });
}
function twRankRender(){
 twRankCheckWeek();
 var tv=$('twRankTv'),screen=$('twRankTvScreen'),buttons=$('twRankTvButtons'),hall=$('twRankColumns'),hallWrap=$('twRankHall');
 if(!screen||!buttons||!hall)return;
 if(tv){tv.setAttribute('aria-label',twRankWord(12));var cap=tv.querySelector('.tw-rank-tv-head small');if(cap)cap.textContent=twRankWord(14);}
 buttons.setAttribute('aria-label',twRankWord(11));
 if(hallWrap){hallWrap.setAttribute('aria-label',twRankWord(13));var cap2=hallWrap.querySelector('.tw-rank-sub');if(cap2)cap2.textContent=twRankWord(13);}
 var g=twRankGames[twRankData.active],top=twRankData[g[0]][0];
 var tvStageHtml = top ?
   '<div class="tw-tv-idol-stage">' +
     '<span class="tw-tv-idol-sparkle" aria-hidden="true">✨</span>' +
     '<span class="tw-rank-avatar-wrap tw-tv-idol-avatar">' +
       '<span class="tw-rank-avatar-fallback" aria-hidden="true">👑</span>' +
       '<canvas class="tw-rank-avatar" width="64" height="64" data-nick="'+escHtml(top.nick)+'" aria-hidden="true" style="display:none"></canvas>' +
     '</span>' +
     '<span class="tw-tv-idol-sparkle" aria-hidden="true">💖</span>' +
   '</div>' : '';
 screen.classList.remove('tw-tv-desliza');void screen.offsetWidth;screen.classList.add('tw-tv-desliza');   // troca de canal deslizando
 screen.innerHTML='<b>'+g[1]+' '+g[2]+'</b>'+(top?
  tvStageHtml+'<p>'+escHtml(twRankWord(twRankData.active+3)+top.nick)+'?</p><strong>🏆 '+top.score.toLocaleString()+' '+g[3]+'</strong>':
  '<p class="tw-rank-wait">'+escHtml(twRankStatus(g[0]))+'</p>');
 buttons.innerHTML=twRankGames.map(function(k,i){
  return '<button type="button" data-tw-rank="'+i+'" aria-pressed="'+(twRankData.active===i)+'">'+k[1]+' <span>'+k[2]+'</span></button>';
 }).join('');
 var note=$('twRankWeekNote');if(note)note.textContent=twRankData.online?twRankWord(6):twRankWord(10);
 // Top Idols: os três rankings ficam visíveis simultaneamente, sem abas.
 hall.innerHTML=twRankGames.map(function(k){
  var list=twRankData[k[0]];
  var ready=k[0]==='center'?twRankData.centerOK:twRankData.online;
  return '<div class="tw-rank-game"><h3>'+k[1]+' '+k[2]+'</h3>'+
   (ready?'<ol>'+twRankSlots(list).map(function(r,i){return r?twRankRow(r,i,k[3],k[0]):twRankEmptyRow(i,k[0]);}).join('')+'</ol>':
    '<p>'+escHtml(twRankStatus(k[0]))+'</p>')+'</div>';
 }).join('');
 twMicRender();
 twRankDrawAvatars();
}
function twRankRenderProfile(){
 var box=$('twSoraWeekScore');if(!box||!contaJ)return;
 twRankCheckWeek();
 var score=Number.isSafeInteger(twRankData.mine)&&twRankData.mine>=0?twRankData.mine:0,local=twRankLocal();
 box.textContent=score>0?
  twRankWord(7)+': '+score.toLocaleString()+' m':
  local?twRankWord(7)+': '+local.score.toLocaleString()+' m · '+twRankWord(8):
   twRankWord(7)+': 0 m';
}
function twRankLoad(force){
 twRankCheckWeek();
 if(twRankPending)return twRankPending;
 if(!force&&Date.now()-twRankData.readAt<180000)return Promise.resolve();
 twRankData.readAt=Date.now();
 if(!_supabase){twRankRender();return Promise.resolve();}
 var week=twRankData.week;
 var center=_supabase.rpc('top_scores',{periodo:'week'}).then(function(res){
  if(res.error)throw res.error;
  if(week===twRankData.week){twRankData.center=twRankClean(res.data);twRankData.centerOK=true;}
 }).catch(function(){if(week===twRankData.week)twRankData.centerOK=false;});
 var online=TW_RANK_ONLINE_READY?contaRpc('tw_podio_semana').then(function(data){
  if(!data||data.semana!==week||twRankData.week!==week)return;
  twRankData.center=twRankClean(data.center);twRankData.sora=twRankClean(data.sora);
  twRankData.karaoke=twRankClean(data.karaoke);twRankData.online=true;twRankData.centerOK=true;
  twRankData.kcombo=twRankClean(data.karaoke_combo);
  twRankData.ktUsados=Number.isInteger(data.meu_kt_usados)?Math.min(5,data.meu_kt_usados):null;
  twRankData.kacertos=twRankClean((Array.isArray(data.karaoke_acertos)?data.karaoke_acertos:[]).map(function(r){return r&&{nick:r.nick,score:Math.round(Number(r.score)*10)};})).map(function(r){return {nick:r.nick,score:r.score/10};});
  var ownSora=Number(data.meu_sora);twRankData.mine=Number.isSafeInteger(ownSora)&&ownSora>=0?ownSora:0;
 }).catch(function(){twRankData.online=false;}):Promise.resolve();
 twRankPending=Promise.all([center,online]).then(function(){
  twRankPending=null;twRankRender();twRankRenderProfile();
  if(typeof twKaraokeAtualizarCard==='function')twKaraokeAtualizarCard();
  if(contaJ&&window.ktTickets)window.ktTickets.refresh();
 });
 return twRankPending;
}
function twRankRefreshAfterSora(){
 var pending=twRankPending;
 Promise.resolve(pending).catch(function(){}).then(function(){
  twRankData.readAt=0;
  return twRankLoad(true);
 }).catch(function(){});
}
function twIntervaloVisivel(el,enabled,callback,delay){
  var timer=0;
  function start(){if(!timer)timer=setInterval(callback,delay);}
  function stop(){if(timer){clearInterval(timer);timer=0;}}
  if(window.TWMotionLifecycle&&el){
    return window.TWMotionLifecycle.watchLoop(el,enabled,start,stop);
  }
  // Compatibilidade: sem o controlador, mantém o comportamento anterior.
  start();
  return {refresh:start,destroy:stop};
}
function twTimeoutVisivel(el,enabled,callback,delay){
  var timer=0,done=false,gate=null;
  function stop(){if(timer){clearTimeout(timer);timer=0;}}
  function run(){
    timer=0;if(done)return;done=true;
    if(gate)gate.destroy();
    if(!el||!el.isConnected||document.hidden||(enabled&&!enabled()))return;
    callback();
  }
  function start(){if(!done&&!timer)timer=setTimeout(run,Math.max(0,delay||0));}
  if(window.TWMotionLifecycle&&el)gate=window.TWMotionLifecycle.watchLoop(el,enabled,start,stop);
  else if(el&&el.isConnected&&!document.hidden&&(!enabled||enabled()))start();
  return {cancel:function(){if(done)return;done=true;stop();if(gate)gate.destroy();},refresh:function(){if(gate)gate.refresh();}};
}
var twRankRotationWanted=false,twRankVisibilityGate=null,twRankVisibilityElement=null;
function twRankTimerStart(){
 if(twRankTimer)return;
 twRankTimer=setInterval(function(){
  var modal=$('twRankTvModal');
  if(!twRankRotationWanted||hubOv.hidden||document.hidden||!modal||modal.hidden)return;
  var was=twRankData.week;twRankCheckWeek();if(was!==twRankData.week)twRankLoad();
  twRankData.active=(twRankData.active+1)%3;twRankRender();
 },6500);
}
function twRankTimerPause(){if(twRankTimer){clearInterval(twRankTimer);twRankTimer=null;}}
function twRankStop(){
 twRankRotationWanted=false;
 if(twRankVisibilityGate)twRankVisibilityGate.refresh();
 else twRankTimerPause();
}
function twRankVisibility(){
 var tv=$('twRankTv');if(!tv)return;
 tv.hidden=false;
 var modalTv=$('twRankTvModal'),calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
 if(twRankVisibilityGate&&twRankVisibilityGate.destroyed){twRankVisibilityGate=null;twRankVisibilityElement=null;}
 if(twRankVisibilityElement!==modalTv){if(twRankVisibilityGate){twRankVisibilityGate.destroy();twRankVisibilityGate=null;}twRankVisibilityElement=modalTv;}
 twRankRotationWanted=!!(modalTv&&!modalTv.hidden&&!hubOv.hidden&&!calm);
 if(!twRankVisibilityGate&&modalTv&&window.TWMotionLifecycle){
  twRankVisibilityGate=window.TWMotionLifecycle.watchLoop(modalTv,function(){return twRankRotationWanted;},twRankTimerStart,twRankTimerPause);
 }else if(twRankVisibilityGate)twRankVisibilityGate.refresh();
 else if(twRankRotationWanted)twRankTimerStart();
 else twRankTimerPause();
}
function hubMontar(){
  $('hubToque').textContent = tr('TOQUE PARA COMEÇAR');
  var runBack=$('hubVolta'),dailyRun=$('playDaily');
  if(runBack)runBack.textContent='← '+tr('Início');
  if(dailyRun)dailyRun.textContent=tr('📅 Corrida do dia');
  var tvTitle=$('twRankTvModalTitle'),tvOpen=$('twRankTvAbrir'),tvClose=$('twRankTvFechar');
  var tvOpenLabels = window.TW_I18N.locale.tvOpenLabels;;
  var tvCloseLabels = window.TW_I18N.locale.tvCloseLabels;;
  if(tvTitle)tvTitle.textContent='📺 TsuLiPa⭐TV!';
  if(tvOpen)tvOpen.setAttribute('aria-label',tvOpenLabels[LANG]||tvOpenLabels.pt);
  if(tvClose)tvClose.setAttribute('aria-label',tvCloseLabels[LANG]||tvCloseLabels.pt);
  $('hubNovT').textContent = '✨ ' + tr('Novidades');
  $('hubNov').innerHTML = HUB_NOVIDADES.map(function(n){ return '<li>' + n[0] + ' ' + escHtml(tr(n[1])) + '</li>'; }).join('');
  $('hubPriv').textContent = '🔐 ' + tr('Privacidade e segurança');
  $('hubBusca').placeholder = '🔍 ' + tr('Procurar Idol pelo nome');
  $('hubLinks').innerHTML = '<a href="' + HUB_YOUTUBE + '" target="_blank" rel="noopener" data-hlink="yt">▶️ ' + escHtml(tr('YouTube do BRS48')) + '</a><a href="' + HUB_BLOG + '" target="_blank" rel="noopener" data-hlink="blog">📰 ' + escHtml(tr('Blog do BRS48')) + '</a><a href="' + HUB_COLLECT + '" target="_blank" rel="noopener" data-hlink="collect">🎴 BRS48 Collect!</a>';
  hubTemaUI(); hubCardsUI(); hubMisUI(); hubCfgUI(); twRankRender();
  hubIdolsTituloUI();
  if(typeof twPreviewAtualizarIdioma==='function')twPreviewAtualizarIdioma();
}
function hubCfgUI(){   // idioma e tema do Oshi também na tela de início (os mesmos botões do menu do Center Run)
  var L = [['pt', 'PT'], ['es', 'ES'], ['en', 'EN'], ['id', 'ID'], ['th', 'TH'], ['ja', '日本語']], O = [['', '☀️', 'Padrão'], ['tsu', '🎤', 'Tsu'], ['lirika', '🐨', 'Lirika'], ['pati', '👑', 'Pati']];
  $('hubCfg').innerHTML = '<span role="group" aria-label="' + escHtml(tr('Idioma')) + '">' + L.map(function(l){ return '<button type="button" data-hl="' + l[0] + '" aria-pressed="' + (LANG === l[0]) + '">' + l[1] + '</button>'; }).join('') + '</span>' +
    '<span role="group" aria-label="' + escHtml(tr('Tema do Oshi')) + '">' + O.map(function(o){ return '<button type="button" data-ho="' + o[0] + '" title="' + escHtml(tr(o[2])) + '" aria-pressed="' + (OSHI === o[0]) + '">' + o[1] + '</button>'; }).join('') + '</span>' +
    '<span class="hubloginbox" id="hubLoginCta" hidden><button type="button" class="hublogin" id="hubLoginBtn">' + '<svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true"><path fill="#4285F4" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.1z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5C3 17.1 2 20.4 2 24s1 6.9 2.5 9.9l7.3-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/></svg>' + '<span id="hubLoginTxt"></span></button></span>';   // visitante: login discreto na mesma linha, sem ocupar espaço
  hubLoginCtaUI();
}
function hubAvisoCarregar(){   // aviso da moderação no topo das Novidades
  contaRpc('aviso_inicio').then(function(t){
    var el = $('hubAviso');
    if(!el){ el = document.createElement('p'); el.id = 'hubAviso'; el.className = 'hubaviso'; var nv = hubOv.querySelector('.hubnov'); nv.parentNode.insertBefore(el, nv); }
    el.textContent = t ? '📣 ' + t : ''; el.hidden = !t;
  }).catch(function(){});
}
function presentesConferir(){   // presentes para todos criados pela moderação: resgata e mostra num pop-up só
  if(!contaJ) return;
  contaRpc('presentes_pendentes').then(function(L){
    if(!Array.isArray(L) || !L.length) return;
    var partes = [], msg = '', est = 0;
    return L.reduce(function(pr, pz){ return pr.then(function(){ return contaRpc('resgatar_presente', { p_id: pz.id }).then(function(r){
      if(!r || !r.ok) return;
      if(typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); }
      est += +r.estrelas || 0; msg = (typeof duoMsgTxt === 'function' ? duoMsgTxt(r.mensagem) : r.mensagem) || msg;
      if(r.item){ if(Array.isArray(r.visuais)){ perfDono = r.visuais; perfLojaSincronizar(); } var vi = admItens().filter(function(o){ return o[0] === r.item; })[0]; partes.push(vi ? vi[1] : r.item); }
      if(r.camarim){
        if(!petData) petLoad();
        var tp = r.camarim.split(':')[0], k = r.camarim.slice(tp.length + 1), it;
        if(petData && k){
          if(tp === 'acc' && (it = petFind(PET_WARDROBE, k))){ petData.roupas = petData.roupas || { '': 1 }; petData.roupas[k] = 1; partes.push(it[1] + ' ' + tr(it[2])); }
          else if(tp === 'decor' && (it = petFind(PET_DECOR, k))){ petData.decor = petData.decor || {}; petData.decor[k] = 1; petBg = null; partes.push('🖼️ ' + tr(it[1])); }
          else if(tp === 'food' && (it = petFind(PET_FOOD, k) || petFind(PET_BATH, k))){ petData.inv = petData.inv || {}; petData.inv[k] = (petData.inv[k] || 0) + 1; partes.push('🍰 ' + tr(it[1])); }
          petSave(true); perfConferir(); if(petOpen) petUI();
        }
      }
    }); }); }, Promise.resolve()).then(function(){
      if(!est && !partes.length && !msg) return;
      $('perfPresTit').textContent = (!est && !partes.length) ? '📣 ' + tr('Mensagem da moderação') : '🎁 ' + tr('Presente da TsuLiPa!');
      $('perfPresNome').textContent = msg || '';
      $('perfPresTxt').textContent = (est ? '★' + est + (partes.length ? ' · ' : '') : '') + partes.join(' · ');
      $('perfPresOk').textContent = tr('OBA!');
      $('perfPresArte').innerHTML = '<span class="perfpres-emo">' + ((!est && !partes.length) ? '📣' : '🎁') + '</span>';
      perfPres.hidden = false; if(sfx.rank) sfx.rank();
      hubCardsUI();
    });
  }).catch(function(){});
}
function hubMostrar(){
  hubAgendaEscutarFechamento();
  hubMontar(); hubAvisoCarregar(); gachaConferir();
  hubOv.hidden = false; document.body.classList.add('hubon');
  sync();
  twIndex2PauseBaseFrames();
  if(hubComecou){ hubMusicaParar(); hubMusicaTocar(); }   // V2.1.3: só toca depois de aparecer (antes ficava em silêncio ao voltar do gacha)
  $('hubToque').hidden = hubComecou; $('hubMenu').hidden = !hubComecou;
  twRankVisibility();twRankLoad();
  if(hubComecou) hubMisCarregar();
  if(!hubAnim) hubAnim = requestAnimationFrame(hubLoop);
}
function hubFechar(){
  petLifeCancelar('celular');
  buscaCancelarTodas();
  var micModal=$('twMicModal');if(micModal&&!micModal.hidden)twMicFechar(true);
  hubVozParar();
  hubOv.hidden = true; twRankStop(); document.body.classList.remove('hubon'); hubMusicaParar(); sitePartUI();
  twIndex2ResumeBaseFrames();sync();
  var v = $('hubVolta'); if(v) v.textContent = '← ' + tr('Início');
}
function twTrofeuFanfarra(){   // troféu da TsuLiPa TV: fanfarra curta, kawaii e orgulhosa
  if(typeof muted !== 'undefined' && muted) return; ac();
  [[784, 0, .10], [1047, .10, .10], [1319, .20, .13]].forEach(function(n){   // "ta-ra-ráá" subindo
    beep(n[0], n[2], 'square', .028, n[1]); beep(n[0] * 2, n[2] * .7, 'triangle', .011, n[1]);
  });
  [1568, 1976, 2349].forEach(function(f, i){ beep(f, .45, 'triangle', .026 - i * .006, .33); });   // acorde de chegada
  beep(392, .52, 'sine', .042, .33); beep(523, .5, 'sine', .022, .35);                              // baixo orgulhoso
  if(typeof petGlide === 'function') petGlide(2093, 3136, .2, 'sine', .014, .42);                   // brilho subindo
  [2637, 3136, 2093].forEach(function(f, i){ beep(f, .06, 'sine', .011, .58 + i * .07); });         // estrelinhas
}
function hubJingle(){   // musiquinha de abertura (Web Audio, igual aos outros sons do jogo)
  [[784, 0], [988, .12], [1175, .24], [1568, .36], [1319, .52], [1568, .64], [2093, .8]].forEach(function(n){ beep(n[0], .22, 'square', .028, n[1]); beep(n[0] / 2, .26, 'triangle', .035, n[1]); });
  beep(523, .9, 'sine', .03, .8);
}
function twAbrirPeloEndereco(){   // link direto: abre a tela pedida depois do "Toque para começar"
  var alvo=location.hash==='#karaoke'?'karaoke':location.hash==='#center-run'?'run':'';
  if(!alvo)return;var c=hubOv.querySelector('[data-ir="'+alvo+'"]');if(c)twTimeoutVisivel(hubOv,function(){return !hubOv.hidden&&c.isConnected;},function(){c.click();},350);
}
function hubComecar(){
  ac();hubJingle();twTimeoutVisivel(hubOv,function(){return !hubOv.hidden&&hubComecou;},hubMusicaTocar,1100);
  hubComecou = true; $('hubToque').hidden = true; $('hubMenu').hidden = false;
  petLifeVoltaUI();
  twRankVisibility();
  if(typeof hubIdolsLugar === 'function') hubIdolsLugar();   // a vitrine desce para o fim do menu
  hubMisCarregar();
  // The INDEX2 welcome has its own marker, without changing original brs48cr_* saves.
  var visto=null;try{visto=localStorage.getItem(TW_INDEX2_TUT_KEY);}catch(e){}
  var rever=false;try{rever=new URLSearchParams(location.search).get('tutorial')==='1';}catch(e){}
  if(!visto||rever){hubTutI=0;hubTutUI();}
  else twAbrirPeloEndereco();
}
function hubTutUI(){   // Quatro slides de boas-vindas.
  var el=$('hubTut'),it=HUB_TUT[hubTutI],texto=TW_INDEX2_TUT_I18N[LANG]||TW_INDEX2_TUT_I18N.pt;
  var descricao=hubTutI===3?texto[0]:tr(it[2]);
  var chamada=hubTutI===3?'<p class="tw-hubtut-soon">'+escHtml(texto[1])+'</p>':'';
  el.innerHTML='<div class="hubtutc" role="dialog" aria-modal="true"><i>'+it[0]+'</i><b translate="no">'+escHtml(tr(it[1]))+'</b><p>'+escHtml(descricao)+'</p>'+chamada+
    '<div class="hubdots">'+HUB_TUT.map(function(_,i){return '<span'+(i===hubTutI?' class="on"':'')+'></span>';}).join('')+'</div>'+
    '<div class="btns"><button type="button" class="btn alt" id="hubTutPular">'+escHtml(tr('Pular'))+'</button><button type="button" class="btn" id="hubTutOk">'+escHtml(tr(hubTutI<HUB_TUT.length-1?'Próximo':'Vamos lá!'))+'</button></div></div>';
  el.hidden=false;
}
function hubTutFim(){ $('hubTut').hidden=true;try{localStorage.setItem(TW_INDEX2_TUT_KEY,'1');}catch(e){} }
// Jogos especiais: o iframe só carrega após clicar no card.
var twPreviewJogoAnterior = null;
function twPreviewEnviarVisibilidadeIframe(visible){
  var frame=$('twPreviewIframe');if(!frame||!frame.contentWindow||!twPreviewJogoAnterior)return;
  try{frame.contentWindow.postMessage({type:'TW_GAME_VISIBILITY',visible:!!visible},location.protocol==='file:'?'*':location.origin);}catch(e){}
}
function twPreviewSomRotular(){
  var botao=$('twPreviewSom');if(!botao)return;
  var txt=TW_SORA_SOM_TEXTOS[LANG]||TW_SORA_SOM_TEXTOS.pt;
  var ligado=botao.getAttribute('aria-pressed')==='true';
  var rotulo=ligado?txt.off:txt.on;
  botao.textContent=ligado?'🔊':'🔇';
  botao.setAttribute('aria-label',rotulo);botao.title=rotulo;
}
function twPreviewSomSincronizar(ligado){
  var botao=$('twPreviewSom');if(!botao)return;
  if(typeof ligado!=='boolean'){botao.disabled=true;twPreviewSomRotular();return;}
  botao.disabled=false;botao.setAttribute('aria-pressed',String(ligado));twPreviewSomRotular();
}
function twPreviewAtualizarIdioma(){
  var fechar=$('twKaraokePopupFechar');
  if(fechar)fechar.setAttribute('aria-label',({pt:'Fechar',en:'Close',es:'Cerrar',ja:'閉じる',th:'ปิด'}[LANG]||'Fechar')+' '+(twPreviewJogoAnterior==='sora'?'Sora Jump':'Karaoke Time'));
  var voltar=$('twPreviewVoltarTxt');
  if(voltar)voltar.textContent=twPreviewTextos[LANG]||twPreviewTextos.pt;
  twPreviewSomRotular();
}
var twPreviewHeaderMarcador=null;
function twPreviewCabecalhoOficial(abrir){
  var slot=$('twPreviewHeaderSlot'),cab=twPreviewHeaderPrincipal;
  if(!slot||!cab)return;
  if(abrir&&!twPreviewHeaderMarcador){
    twPreviewHeaderMarcador=document.createComment('TsuLiPa official header original position');
    cab.parentNode.insertBefore(twPreviewHeaderMarcador,cab);
    slot.appendChild(cab);
    var som=$('twPreviewSom');if(som)slot.appendChild(som);
  }else if(!abrir&&twPreviewHeaderMarcador){
    twPreviewHeaderMarcador.parentNode.insertBefore(cab,twPreviewHeaderMarcador);
    twPreviewHeaderMarcador.remove();
    twPreviewHeaderMarcador=null;
  }
}
// Same hub calendar and particle markup as the published home screen.
// Never invent a second particle generator, colors, counters or background loop.
function twPreviewMontarFundo(){
  var wrap=$('twPreviewJogo');if(!wrap)return;
  var k=typeof temaAtual==='function'?temaAtual():'';
  wrap.setAttribute('data-tema',TEMA_INFO[k]?k:'');
  var fundo=$('twPreviewPart'),origem=$('hubPart');
  if(fundo&&origem)fundo.innerHTML=origem.innerHTML;
}
// Visual mode now belongs to sora-jump.html?embed=index2; no iframe DOM injection.
function twPreviewAbrirJogo(tipo){
  if(tipo !== 'sora' && tipo !== 'karaoke')return;
  var kTime=tipo==='karaoke';   // Karaoke⭐Time! abre todo dia: é jogo solo, sem sala online nem horário
  var wrap=$('twPreviewJogo'),frame=$('twPreviewIframe'),text=$('twPreviewTitulo');
  if(!wrap||!frame||!wrap.hidden)return;
  twPreviewJogoAnterior=tipo;
  if(typeof hubMusicaParar==='function')hubMusicaParar();
  if(typeof ovMusicaParar==='function')ovMusicaParar();
  if(typeof music==='function'){music(false);curT='';}   // para a faixa do Center Run; o jogo de dentro toca a dele
  if(tipo!=='sora'){hubOv.hidden=true;document.body.classList.remove('hubon');}   // Karaoke⭐Time! é uma tela da página, como o Center⭐Run!
  if(text)text.textContent=tipo==='sora'?'☁️ Sora⭐Jump!':'🎤 Karaoke⭐Time!';
  frame.title=tipo==='sora'?'☁️ Sora⭐Jump!':'🎤 Karaoke⭐Time!';
  wrap.setAttribute('data-jogo',tipo);
  wrap.removeAttribute('data-karaoke-popup');wrap.toggleAttribute('data-karaoke-tela',kTime);
  if(tipo==='sora'){hubOv.inert=true;wrap.setAttribute('role','dialog');wrap.setAttribute('aria-modal','true');wrap.setAttribute('aria-label',frame.title);}
  twPreviewAtualizarIdioma();
  twPreviewMontarFundo();
  twPreviewCabecalhoOficial(tipo!=='sora');   // só o Sora fica como pop-up sobre a página
  wrap.hidden=false;
  twIndex2PauseBaseFrames();
  var som=$('twPreviewSom');
  if(som){
    som.hidden=tipo!=='sora';som.disabled=tipo!=='sora';
    som.setAttribute('aria-pressed','true');twPreviewSomRotular();
  }
  // The selected Oshi and language accompany the iframe; no new storage or RPC call.
  var tema=['tsu','lirika','pati'].indexOf(OSHI)>=0?OSHI:'';
  // O jogo aberto aqui usa as MESMAS cores da página: tema claro/escuro atual.
  var temaCor='light';
  try{
    var htmlEl=document.documentElement;
    temaCor=(htmlEl&&htmlEl.getAttribute&&htmlEl.getAttribute('data-theme'))||
      ((typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light');
  }catch(e){}
  var context='?embed=index2&oshi='+encodeURIComponent(tema)+'&lang='+encodeURIComponent(LANG)+'&theme='+encodeURIComponent(temaCor);
  frame.src=tipo==='sora'?'./sora-jump.html'+context:'./karaoke-time.html'+context;
  if(kTime){window.scrollTo(0,0);if(location.hash!=='#karaoke'){try{history.pushState({tw:'karaoke'},'','#karaoke');}catch(e){}}}   // voltar do navegador/celular fecha o Karaoke
  var fechar=tipo==='sora'?$('twKaraokePopupFechar'):$('twPreviewVoltar');
  if(fechar)fechar.focus({preventScroll:true});
}
function twPreviewFecharJogo(){
  var wrap=$('twPreviewJogo'),frame=$('twPreviewIframe');
  if(!wrap||wrap.hidden)return;
  var ultimo=twPreviewJogoAnterior;
  var eraPopup=wrap.hasAttribute('data-karaoke-popup');
  twPreviewEnviarVisibilidadeIframe(false);
  frame.src='about:blank';
  var som=$('twPreviewSom');if(som){som.hidden=true;som.disabled=true;}
  wrap.hidden=true;twPreviewJogoAnterior=null;
  wrap.removeAttribute('data-jogo');
  wrap.removeAttribute('data-karaoke-popup');wrap.removeAttribute('data-karaoke-tela');frame.style.height='';
  if(ultimo==='karaoke'&&location.hash==='#karaoke'){try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}}
  wrap.removeAttribute('role');wrap.removeAttribute('aria-modal');
  hubOv.inert=false;
  var fundo=$('twPreviewPart');if(fundo)fundo.textContent='';
  twPreviewCabecalhoOficial(false);
  if(eraPopup)twKaraokeAtualizarCard();else hubMostrar();
  if(typeof muted!=='undefined'&&!muted&&typeof hubComecou!=='undefined'&&hubComecou&&typeof hubMusicaTocar==='function')hubMusicaTocar();
  // hubMostrar re-creates cards; return focus to the fresh game launcher.
  var card=ultimo&&hubOv.querySelector('[data-ir="'+ultimo+'"]');
  if(card)card.focus({preventScroll:true});
}
var insFila=[],insAberto=false,insEsperar=0,insMostrarTimer=0,insConferirToken=0;
function insConferir(){
  if(!contaJ)return;
  clearTimeout(insEsperar);
  var dono=contaJ.nick,token=++insConferirToken;
  insEsperar=setTimeout(function(){
    insEsperar=0;
    if(!contaJ||contaJ.nick!==dono||token!==insConferirToken)return;
    contaRpc('insignias_novas').then(function(r){
      if(!contaJ||contaJ.nick!==dono||token!==insConferirToken)return;
      if(Array.isArray(r)&&r.length){insFila=insFila.concat(r);insMostrar();}
    }).catch(function(){});
  },900);
}
function insAgendarMostrar(delay){
  clearTimeout(insMostrarTimer);
  insMostrarTimer=setTimeout(function(){insMostrarTimer=0;insMostrar();},delay);
}
function insCancelar(){
  clearTimeout(insEsperar);insEsperar=0;insConferirToken++;
  clearTimeout(insMostrarTimer);insMostrarTimer=0;
  insFila=[];insAberto=false;if(insOv)insOv.hidden=true;
}
function insMostrar(){
  if(!contaJ||insAberto||!insFila.length)return;
  var k = insFila.shift(), it = null;
  for(var i = 0; i < PERF_INS.length; i++) if(PERF_INS[i][0] === String(k).split(':')[0]){ it = PERF_INS[i]; break; }
  if(!it){ insMostrar(); return; }
  insAberto = true;
  insOv.innerHTML = '<div class="panel insp" role="dialog" aria-modal="true"><p class="insnova">✨ ' + escHtml(tr('Insígnia nova!')) + ' ✨</p><div class="insemo">' + it[1] + '</div><b>' + escHtml(tr(it[2])) + insNivelTxt(k) + '</b><p>' + escHtml(tr(it[3])) + '</p>' +
    '<div class="btns"><button type="button" class="btn alt" id="insVer">' + escHtml(tr('Ver no perfil')) + '</button><button type="button" class="btn" id="insOk">' + escHtml(tr('Oba!')) + '</button></div></div>';
  insOv.hidden = false;
  [1047, 1319, 1568, 2093].forEach(function(f, j){ beep(f, .16, 'triangle', .04, j * .09); });
}
var contaUltimaRun = null, quartetoPend = false;
function hubAoEntrar(){ hubCardsUI(); hubMisCarregar(); setTimeout(insConferir, 2500); setTimeout(presentesConferir, 5000); }
function hubAposCorrida(){ hubMisDados = null; insConferir(); }
function quartetoFoto(){   // SALVAR IMAGEM no fim do show: o Idol com Tsu, Lirika e Pati no palco
  if(!contaJ || sel !== 3) return;
  var pl = (window.collectedPartners || []).filter(function(id, i, a){ return id !== 3 && a.indexOf(id) === i; });
  if(pl.length < 3) return;
  quartetoPend = true; quartetoTalvez();
}
function quartetoTalvez(){
  if(!quartetoPend || !contaUltimaRun || !contaUltimaRun.ok) return;
  quartetoPend = false;
  contaRpc('marcar_quarteto', { p_run: contaUltimaRun.id }).then(function(r){ if(r && r.ok) insConferir(); }).catch(function(){});
}
var buscaInputs=[];
function buscaCancelar(inp){
  if(!inp)return;
  clearTimeout(inp._twBuscaTimer);inp._twBuscaTimer=0;
  inp._twBuscaSeq=(inp._twBuscaSeq||0)+1;
}
function buscaCancelarTodas(){buscaInputs.forEach(buscaCancelar);}
function buscaLigar(inp,res){
  if(!inp||inp._ok)return;
  inp._ok=true;inp._twBuscaRes=res;buscaInputs.push(inp);
  inp.addEventListener('keydown',function(e){e.stopPropagation();});
  inp.addEventListener('input',function(){
    buscaCancelar(inp);
    var q=inp.value.trim(),seq=inp._twBuscaSeq;
    if(q.length<2){res.innerHTML='';return;}
    inp._twBuscaTimer=setTimeout(function(){
      inp._twBuscaTimer=0;
      if(seq!==inp._twBuscaSeq||!inp.isConnected||!res.isConnected||hubOv.hidden||inp.value.trim()!==q)return;
      contaRpc('buscar_perfis',{p_q:q}).then(function(L){
        if(seq!==inp._twBuscaSeq||!inp.isConnected||!res.isConnected||hubOv.hidden||inp.value.trim()!==q)return;
        L=Array.isArray(L)?L:[];
        res.innerHTML=L.length?L.map(function(p){return '<button type="button" class="lbn" data-nick="'+escHtml(p.nick)+'">'+escHtml(p.nick)+' <small>🏆 '+(+p.best||0)+'</small></button>';}).join(''):'<em>'+escHtml(tr('Nenhuma.'))+'</em>';
      }).catch(function(){if(seq===inp._twBuscaSeq&&res.isConnected&&!hubOv.hidden)res.innerHTML='';});
    },350);
  });
}
var hubMus = null;
function hubMusicaTocar(){
  if(hubMus || muted || !hubTelaAberta() || twJogoEmPopup()) return;
  var a = ac(); if(!a) return;
  var k = temaAtual(), tom = { halloween:-3, natal:2, anonovo:5, inverno:2, sakura:0, tanabata:-5 }[k] || 0;
  var menor = k === 'halloween', suave = k === 'sakura' || k === 'primavera' || k === 'tanabata';
  var esc = menor ? [0, 2, 3, 5, 7, 8, 10, 12, 14, 15] : [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];   // escala menor ou pentatônica
  var acordes = menor ? [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2]] : [[0, 4, 7], [-5, -1, 2], [-3, 0, 4], [-7, -3, 0]];   // I–V–vi–IV
  var mel = [4, 5, 6, 5, 4, 3, 4, -1, 3, 4, 5, 4, 3, 2, 3, -1, 2, 3, 4, 3, 2, 1, 2, -1, 1, 2, 3, 4, 5, 4, 5, -1];
  var f0 = 523.25 * Math.pow(2, tom / 12), passo = 60 / 116 / 2, n = 0, prox = a.currentTime + .05;
  function hz(st){ return f0 * Math.pow(2, st / 12); }
  function nota(f, ini, dur, tipo, vol){ var o = a.createOscillator(), gn = a.createGain(); o.type = tipo; o.frequency.setValueAtTime(f, ini); gn.gain.setValueAtTime(vol, ini); gn.gain.exponentialRampToValueAtTime(.0005, ini + dur); o.connect(gn); gn.connect(a.destination); o.start(ini); o.stop(ini + dur + .02); }
  var ruido = a.createBuffer(1, a.sampleRate * .05, a.sampleRate), dd = ruido.getChannelData(0);
  for(var i = 0; i < dd.length; i++) dd[i] = (Math.random() * 2 - 1) * (1 - i / dd.length);
  function chimbal(ini, vol){ var s = a.createBufferSource(), gn = a.createGain(), fl = a.createBiquadFilter(); fl.type = 'highpass'; fl.frequency.value = 6000; s.buffer = ruido; gn.gain.value = vol; s.connect(fl); fl.connect(gn); gn.connect(a.destination); s.start(ini); }
  hubMus = setInterval(function(){
    if(document.hidden || muted || !hubTelaAberta()){ hubMusicaParar(); return; }
    while(prox < a.currentTime + .3){
      var c = acordes[Math.floor(n / 8) % 4], m = mel[n % 32];
      if(m >= 0) nota(hz(esc[m]), prox, passo * 1.6, suave ? 'sine' : 'square', suave ? .022 : .014);
      nota(hz(c[n % 3] + 12), prox, passo * .9, 'triangle', .012);                          // arpejo
      if(n % 4 === 0) nota(hz(c[0] - 24), prox, passo * 3.5, 'triangle', .03);                  // baixo
      if(k === 'natal' && n % 8 === 4) nota(hz(c[2] + 24), prox, .5, 'sine', .012);              // sininho
      if(n % 2 === 1) chimbal(prox, .025);
      n++; prox += passo;
    }
  }, 60);
}
var petVeioHub = false;
function hubTelaAberta(){ return (!hubOv.hidden && !(typeof petOpen !== 'undefined' && petOpen)) || (typeof gachaOv !== 'undefined' && !gachaOv.hidden) || (typeof duoOv !== 'undefined' && !duoOv.hidden); }   // gacha e Moon⭐Duo! usam a música da tela de início
function hubMusicaParar(){ if(hubMus){ clearInterval(hubMus); hubMus = null; } }
function sitePartUI(){ sitePart.innerHTML = $('hubPart').innerHTML; }
var ovMus = null, ovMusK = '';
function ovMusicaParar(){ if(ovMus){ clearInterval(ovMus); ovMus = null; } ovMusK = ''; }
function ovMusicaTocar(k){
  if(muted){ ovMusicaParar(); return; }
  if(ovMus && ovMusK === k) return;
  ovMusicaParar(); hubMusicaParar();
  var a = ac(); if(!a) return;
  ovMusK = k;
  var bpm = k === 'gacha' ? 124 : 70, passo = 60 / bpm / 2, n = 0, prox = a.currentTime + .08;
  function hz(m){ return 440 * Math.pow(2, (m - 69) / 12); }   // nota MIDI → Hz
  function nota(f, ini, dur, tipo, vol, ataque){
    var o = a.createOscillator(), gn = a.createGain(); o.type = tipo; o.frequency.setValueAtTime(f, ini);
    gn.gain.setValueAtTime(.0001, ini); gn.gain.linearRampToValueAtTime(vol, ini + (ataque || .01)); gn.gain.exponentialRampToValueAtTime(.0004, ini + dur);
    o.connect(gn); gn.connect(a.destination); o.start(ini); o.stop(ini + dur + .05);
  }
  var rb = a.createBuffer(1, a.sampleRate * .25, a.sampleRate), rd = rb.getChannelData(0);
  for(var i = 0; i < rd.length; i++) rd[i] = Math.random() * 2 - 1;
  function ruido(ini, dur, vol, corte, tipoF){
    var s = a.createBufferSource(), gn = a.createGain(), fl = a.createBiquadFilter(); fl.type = tipoF || 'highpass'; fl.frequency.value = corte;
    s.buffer = rb; gn.gain.setValueAtTime(vol, ini); gn.gain.exponentialRampToValueAtTime(.0003, ini + dur); s.connect(fl); fl.connect(gn); gn.connect(a.destination); s.start(ini); s.stop(ini + dur + .02);
  }
  function bumbo(ini, vol){ var o = a.createOscillator(), gn = a.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(140, ini); o.frequency.exponentialRampToValueAtTime(45, ini + .18); gn.gain.setValueAtTime(vol, ini); gn.gain.exponentialRampToValueAtTime(.0005, ini + .22); o.connect(gn); gn.connect(a.destination); o.start(ini); o.stop(ini + .25); }

  var G_SUS = [[57, 60, 64], [53, 57, 60], [50, 53, 57], [52, 56, 59]], G_TRI = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]];
  var G_MEL_SUS = [76, -1, 72, -1, 69, -1, 72, 76, 77, -1, 76, -1, 72, -1, 69, -1, 74, -1, 72, -1, 69, -1, 65, 69, 68, 69, 71, 72, 74, 75, 76, 80];
  var G_MEL_TRI = [84, -1, 79, 84, 88, -1, 86, 84, 83, -1, 79, -1, 86, 84, 83, 79, 81, -1, 84, 88, 91, -1, 88, 84, 89, 88, 86, 84, 86, 88, 91, -1];
  // Moon⭐Duo!: Fmaj7 – Em7 – Dm7 – Cmaj7, caixinha de música com eco, chiado de vinil e sininhos de fada
  var D_ACO = [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59]];
  var D_MEL = [81, -1, -1, 79, 76, -1, 79, -1, 76, -1, 74, -1, 72, -1, -1, -1, 77, -1, 76, 74, 72, -1, 74, -1, 76, -1, -1, 72, 71, -1, 72, -1];

  ovMus = setInterval(function(){
    var aberta = ovMusK === 'gacha' ? !gachaOv.hidden : !duoOv.hidden;
    if(document.hidden || muted || !aberta){ ovMusicaParar(); if(!document.hidden && !muted && hubComecou && !hubOv.hidden) hubMusicaTocar(); return; }
    while(prox < a.currentTime + .3){
      var st = n % 8, bar = Math.floor(n / 8);
      if(ovMusK === 'gacha'){
        var sec = Math.floor(bar / 4) % 2, b4 = bar % 4, ch = (sec ? G_TRI : G_SUS)[b4], m = (sec ? G_MEL_TRI : G_MEL_SUS)[(b4 * 8 + st) % 32];
        if(!sec){
          nota(hz(ch[st % 3] + 12), prox, passo * .9, 'triangle', .016);                      // arpejo tenso
          if(st % 4 === 0) nota(hz(ch[0] - 12), prox, passo * 3.5, 'triangle', .034);          // baixo
          ruido(prox, .03, st % 2 ? .012 : .02, 7000);                                       // tique-taque da roleta
          if(m >= 0) nota(hz(m), prox, passo * 1.4, 'square', .011);
          if(b4 === 3) ruido(prox + passo / 2, .06, .008 + st * .004, 2500, 'bandpass');      // rufar que cresce
          if(b4 === 3 && st === 7) nota(hz(83), prox + passo / 2, .25, 'square', .02);       // "vai sair..."
        } else {
          if(st === 0) ch.forEach(function(x2, j){ nota(hz(x2 + 12), prox, passo * 6, 'square', .009, .02); });   // acorde de fanfarra
          if(st % 2 === 0) nota(hz(ch[0] - 12), prox, passo * 1.8, 'triangle', .04);
          if(m >= 0) nota(hz(m), prox, passo * 1.5, 'square', .016);
          if(m >= 0) nota(hz(m - 12), prox, passo * 1.5, 'triangle', .012);
          if(st === 0 || st === 4) bumbo(prox, .09);
          if(st === 2 || st === 6) ruido(prox, .12, .03, 1800, 'bandpass');                  // caixa
          if(st === 0 && b4 === 0) ruido(prox, .7, .03, 6000);                               // prato do triunfo
          ruido(prox, .02, .01, 8000);
        }
      } else {
        var sw = st % 2 ? passo * .18 : 0, acd = D_ACO[bar % 4], md = D_MEL[(bar % 4) * 8 + st];
        if(st === 0) acd.forEach(function(x2, j){ nota(hz(x2), prox + j * .03, passo * 7.5, 'sine', .014, .12); });   // acorde macio, dedilhado
        if(st === 0) nota(hz(acd[0] - 12), prox, passo * 3, 'triangle', .03, .04);
        if(st === 5) nota(hz(acd[0] - 12), prox + sw, passo * 2, 'triangle', .02, .04);
        if(st === 0 || st === 4) bumbo(prox, st === 0 ? .05 : .035);
        if(st === 4) ruido(prox, .09, .012, 1400, 'bandpass');                                // caixa abafada
        if(st % 2 === 1) ruido(prox + sw, .025, .004, 6000);                                  // chimbal leve
        if(md >= 0){ nota(hz(md), prox + sw, passo * 2.2, 'sine', .018, .015); nota(hz(md + 12), prox + sw + passo * .75, passo * 1.5, 'sine', .006, .015); }   // caixinha de música + eco
        if(Math.random() < .12) nota(hz(96 + [0, 4, 7, 11][Math.floor(Math.random() * 4)]), prox + Math.random() * passo, .6, 'sine', .004, .005);   // sininhos de fada
        if(Math.random() < .5) ruido(prox + Math.random() * passo, .01, .0025, 3000);       // chiado de vinil
      }
      n++; prox += passo;
    }
  }, 60);
}
// Áudio procedural também dorme em segundo plano; retoma a música da tela ativa.
function twMusicaPaginaVisibilidade(){
  if(document.hidden){hubVozParar();music(false);curT='';hubMusicaParar();ovMusicaParar();return;}
  if(muted)return;
  if(!gachaOv.hidden){ovMusicaTocar('gacha');return;}
  if(!duoOv.hidden){ovMusicaTocar('duo');return;}
  if(hubComecou&&!hubOv.hidden){hubMusicaTocar();return;}
  curT='';sync();
}
function hubIdolsCarregar(){
  if(Date.now() - hubIdolsEm < 5 * 60e3 && hubIdolsDados){ hubIdolsUI(); return; }   // recarrega no máximo a cada 5 min
  hubIdolsEm = Date.now();
  contaRpc('vitrine_idols').then(function(d){ hubIdolsDados = d && Array.isArray(d.idols) ? d : null; hubIdolsUI(); if(typeof petPhoneJornalVitrinePronta === 'function') petPhoneJornalVitrinePronta(); })
    .catch(function(){ hubIdolsEm = 0; var b = $('hubIdols'); if(b) b.hidden = true; });
}
function hubIdolsTituloUI(){
  var title=$('hubIdolsT');if(!title)return;
  var tituloIdols=window.TW_I18N.rows.seasonalThemeInfoLabels[1];
  var idiomaIdols={pt:0,en:1,es:2,th:3,ja:4,id:5}[LANG];
  title.innerHTML=escHtml(tituloIdols[idiomaIdols]||tituloIdols[0])+' <small class="tw-jpsub tw-jpinline" lang="ja">出会えるアイドル</small>';
}
function hubIdolsUI(){
  var box = $('hubIdols'); if(!box) return;
  var L = hubIdolsDados ? hubIdolsDados.idols.filter(function(p){ return p && p.nick && p.avatar; }) : [];
  if(!L.length){ box.hidden = true; hubIdolsParar(); return; }
  hubIdolsTituloUI();
  // lista escondida para teclado e leitor de tela (o palco em si é um canvas)
  $('hubIdolsLista').innerHTML = L.map(function(p, i){ return '<button type="button" data-hireage="' + i + '">' + escHtml(p.nick) + ' · ★ ' + (+p.best || 0) + '</button>'; }).join('');
  hubIV.L = L.map(function(p, i){ return { nick:p.nick, best:+p.best || 0, av:p.avatar, fase:(i * 1.7) % 5, ex:+p.avatar.expr, reage:-9 }; });
  box.hidden = false; hubIdolsTam(); hubIdolsLigar(); if(typeof twRankRender==='function')twRankRender();
}
function hubIdolsLugar(){
  var box = $('hubIdols'), busca = hubOv.querySelector('.hubbusca'), missions = $('hubMisPainel'), cv = $('hubCv'); if(!box || !busca || !cv) return;
  if(hubComecou){ var anchor = missions || busca; if(box.previousElementSibling !== anchor) anchor.parentNode.insertBefore(box, anchor.nextSibling); box.classList.remove('mini');
    // Top Idols logo abaixo da vitrine (site corrido, em coluna única).
    }   // o Top Idols mora no Idol⭐News! (jornal.js)
  else { if(box.previousElementSibling !== cv) cv.parentNode.insertBefore(box, cv.nextSibling); box.classList.add('mini'); }
  hubIV.cw = 0;
}
var hubIV = { k:1, cw:0, ch:0, L:[], x:0, t0:0, ult:0, raf:0, w:0, h:0, dpr:1, conf:[], par:false, vis:true, beamAssets:null };
var HUB_IV_CEL = 104, HUB_IV_ACOES = ['cantar', 'dancar', 'pular', 'coracao', 'luz'];
var HUB_IV_BEAMS = [{ color:'155,48,217', x:.12 }, { color:'182,255,59', x:.5 }, { color:'65,105,225', x:.88 }];
function hubIdolsBeamTexturas(height){
  var scale = (hubIV.dpr || 1) * (hubIV.k || 1), cache = hubIV.beamAssets;
  if(cache && cache.height === height && cache.scale === scale) return cache.items;
  var items = [];
  for(var i = 0; i < HUB_IV_BEAMS.length; i++){
    var cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.ceil(92 * scale)); cv.height = Math.max(1, Math.ceil(height * scale));
    var ctx = cv.getContext('2d'); if(!ctx){ hubIV.beamAssets = { height:height, scale:scale, items:null }; return null; }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    var color = HUB_IV_BEAMS[i].color, grad = ctx.createLinearGradient(46, 0, 46, height);
    grad.addColorStop(0, 'rgba(' + color + ',.55)'); grad.addColorStop(1, 'rgba(' + color + ',0)');
    ctx.fillStyle = grad; ctx.beginPath(); ctx.moveTo(39, 0); ctx.lineTo(53, 0); ctx.lineTo(92, height); ctx.lineTo(0, height); ctx.closePath(); ctx.fill();
    items.push(cv);
  }
  hubIV.beamAssets = { height:height, scale:scale, items:items };
  return items;
}
function hubIdolsTam(){
  var cv = $('hubIdolsCv'); if(!cv) return;
  var cw = cv.clientWidth || 560, ch = cv.clientHeight || 192, d = Math.min(2, window.devicePixelRatio || 1);
  if(cw === hubIV.cw && ch === hubIV.ch && d === hubIV.dpr) return;
  hubIV.cw = cw; hubIV.ch = ch; hubIV.dpr = d; cv.width = Math.round(cw * d); cv.height = Math.round(ch * d);
  hubIV.k = ch / 192; var w = cw / hubIV.k, h = 192; hubIV.w = w; hubIV.h = h;   // a cena tem sempre 192 de altura e encolhe inteira
  hubIV.conf = []; for(var i = 0; i < 26; i++) hubIV.conf.push({ x:Math.random() * w, y:Math.random() * h, v:12 + Math.random() * 22, r:Math.random() * 6, c:['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#c4a5ff'][i % 5] });
}
function hubIdolsLigar(){ if(!hubIV.raf) hubIV.raf = requestAnimationFrame(hubIdolsLoop); }
function hubIdolsParar(){ if(hubIV.raf){ cancelAnimationFrame(hubIV.raf); hubIV.raf = 0; } }
function hubIdolsLoop(ms){
  hubIV.raf = 0;
  var box = $('hubIdols'); if(!box || box.hidden || !hubIV.vis || !twAnimacaoVisivel(hubOv)) return;
  if(ms - hubIV.ult < 32){hubIV.raf=requestAnimationFrame(hubIdolsLoop);return;}   // ~30 quadros por segundo, e só quando aparece na tela
  var dt = hubIV.ult ? Math.min(.1, (ms - hubIV.ult) / 1000) : 0; hubIV.ult = ms;
  var calmo = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!hubIV.par && !calmo) hubIV.x += dt * 34;
  hubIV.s = ms / 1000;
  try{ hubIdolsDesenhar(ms / 1000, dt, calmo); }catch(e){ hubIdolsParar();return; }
  if(hubIV.vis&&twAnimacaoVisivel(hubOv))hubIV.raf=requestAnimationFrame(hubIdolsLoop);
}
function hubIdolsFundo(x, W, H, s, dt){
  var chao = H - 60;
  // céu do palco: roxo Tsu → magenta → azul Pati, respirando devagar
  var gr = x.createLinearGradient(0, 0, W, H), k = (Math.sin(s * .4) + 1) / 2;
  gr.addColorStop(0, '#2a0f63'); gr.addColorStop(.45 + k * .15, '#6a1f9e'); gr.addColorStop(1, '#183a9e');
  x.fillStyle = gr; x.fillRect(0, 0, W, H);
  // telão de LED quadriculado ao fundo
  x.save(); x.globalAlpha = .12; x.fillStyle = '#ffffff';
  for(var gx = (-(hubIV.x * .3) % 14); gx < W; gx += 14) for(var gy = 6; gy < chao - 20; gy += 14) if(((gx + gy) | 0) % 3) x.fillRect(gx, gy, 2, 2);
  x.restore();
  // canhões de luz: a textura é rasterizada uma vez por escala/altura e só gira a cada quadro
  var beams = hubIdolsBeamTexturas(chao + 10);
  for(var i = 0; i < HUB_IV_BEAMS.length; i++){
    var beam = HUB_IV_BEAMS[i], bx = W * beam.x, ang = Math.sin(s * .8 + i * 2.1) * .5;
    x.save(); x.translate(bx, -6); x.rotate(ang);
    if(beams) x.drawImage(beams[i], -46, 0, 92, chao + 10);
    else {
      var lg = x.createLinearGradient(0, 0, 0, chao + 10); lg.addColorStop(0, 'rgba(' + beam.color + ',.55)'); lg.addColorStop(1, 'rgba(' + beam.color + ',0)');
      x.fillStyle = lg; x.beginPath(); x.moveTo(-7, 0); x.lineTo(7, 0); x.lineTo(46, chao + 10); x.lineTo(-46, chao + 10); x.closePath(); x.fill();
    }
    x.restore();
  }
  // bandeirinhas
  var cores = ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#c4a5ff'];
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, 4); x.quadraticCurveTo(W / 2, 16, W, 4); x.stroke();
  for(var i = 0, n = Math.ceil(W / 22); i < n; i++){ var fx = i * 22 + 6, fy = 4 + Math.sin(i / n * Math.PI) * 6 + Math.sin(s * 3 + i) * .8;
    x.fillStyle = cores[i % 5]; x.beginPath(); x.moveTo(fx, fy); x.lineTo(fx + 12, fy); x.lineTo(fx + 6, fy + 10); x.closePath(); x.fill(); }
  // confete caindo
  hubIV.conf.forEach(function(c){ c.y += c.v * dt; c.r += dt * 4; if(c.y > chao){ c.y = -6; c.x = Math.random() * W; }
    x.save(); x.translate(c.x, c.y); x.rotate(c.r); x.fillStyle = c.c; x.fillRect(-2, -1, 4, 2.4); x.restore(); });
  // palco: chão brilhante com o neon do arco-íris do jogo
  var pg = x.createLinearGradient(0, chao, 0, H); pg.addColorStop(0, '#3b1a86'); pg.addColorStop(1, '#14063d');
  x.fillStyle = pg; x.fillRect(0, chao, W, H - chao);
  var ng = x.createLinearGradient(-(hubIV.x % W), 0, W * 2 - (hubIV.x % W), 0);
  ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#ff6fb5'].forEach(function(c, j, a){ ng.addColorStop(j / (a.length - 1), c); });
  x.fillStyle = ng; x.fillRect(0, chao, W, 3);
  x.save(); x.globalAlpha = .18; x.fillRect(0, chao + 3, W, 8); x.restore();
  // plateia: lightsticks balançando na beira do palco
  for(var j = 0, m = Math.ceil(W / 26) + 1; j < m; j++){
    var lx = j * 26 + 8 - (hubIV.x * .5) % 26, a2 = Math.sin(s * 4 + j * .9) * .45, cc = cores[j % 5];
    x.save(); x.translate(lx, H + 6); x.rotate(a2);
    x.fillStyle = 'rgba(10,4,30,.85)'; x.fillRect(-1.5, -6, 3, 8);
    x.shadowColor = cc; x.shadowBlur = 8; x.fillStyle = cc; x.fillRect(-2, -16, 4, 10); x.restore();
  }
  return chao;
}
function hubIdolsDesenhar(s, dt, calmo){
  var cv = $('hubIdolsCv'); if(!cv) return; hubIdolsTam();
  var x = cv.getContext('2d'), W = hubIV.w, H = hubIV.h, L = hubIV.L, n = L.length; if(!n) return;
  x.setTransform(hubIV.dpr * hubIV.k, 0, 0, hubIV.dpr * hubIV.k, 0, 0);
  var chao = hubIdolsFundo(x, W, H, calmo ? 0 : s, calmo ? 0 : dt);
  var anel = Math.max(n, Math.ceil((W + HUB_IV_CEL) / HUB_IV_CEL)) * HUB_IV_CEL, ini = Math.floor(hubIV.x / HUB_IV_CEL);
  var fr = s * 60;   // o desenho do Idol conta o tempo em quadros (60 por segundo)
  for(var k = ini - 1; k * HUB_IV_CEL - hubIV.x < W + HUB_IV_CEL; k++){
    var i = ((k % n) + n) % n, p = L[i], px = k * HUB_IV_CEL - hubIV.x;
    if(px < -HUB_IV_CEL) continue;
    var acao = HUB_IV_ACOES[Math.floor((calmo ? 0 : s / 4) + p.fase) % HUB_IV_ACOES.length];
    var av = {}; for(var q in p.av) av[q] = p.av[q];
    var dy = 0, rot = 0, dx = 0, ff = s * 2 + i;
    if(acao === 'cantar'){ av.pose = 'mic'; av.expr = 3; }
    else if(acao === 'dancar'){ av.pose = ['v', 'banzai', 'nyan', 'tchau'][Math.floor(s * 2.2 + i) % 4]; rot = Math.sin(s * 5 + i) * .1; dx = Math.sin(s * 2.5 + i) * 4; }
    else if(acao === 'pular'){ var ph = (s * 1.6 + i * .3) % 1; dy = -Math.sin(ph * Math.PI) * 22; av.pose = dy < -10 ? 'banzai' : 'v'; }
    else if(acao === 'coracao'){ av.pose = 'coracao'; av.expr = 3; }
    else { av.pose = 'luz'; rot = Math.sin(s * 3 + i) * .06; }
    if(calmo){ dy = 0; rot = 0; dx = 0; }
    var rg = s - p.reage;   // tocou no Idol: pulão feliz com corações e estrelinhas
    if(rg >= 0 && rg < 1.1){ var pr = rg / 1.1; dy = -Math.sin(pr * Math.PI) * 34; rot = Math.sin(pr * Math.PI * 2) * .12; dx = 0; av.pose = 'banzai'; av.expr = 3; }
    var cw = HUB_IV_CEL, ch = 112, cx = px + dx, top = chao - ch + 10;
    // sombra no chão (diminui no pulo)
    x.fillStyle = 'rgba(0,0,0,' + (.3 + dy / 120) + ')'; x.beginPath(); x.ellipse(px + cw / 2 + dx, chao + 2, 18 + dy / 3, 3.2, 0, 0, 7); x.fill();
    x.save(); x.translate(cx + cw / 2, top + ch + dy); x.rotate(rot); x.translate(-cw / 2, -ch);
    perfDesenharIdol(x, cw, ch, av, false, false, fr + i * 37);
    x.restore();
    // efeitos de cada ação
    var ex2 = px + cw / 2 + dx, ey = top + 20 + dy;
    x.font = '900 13px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
    if(acao === 'cantar' || acao === 'luz') for(var u = 0; u < 2; u++){ var ph2 = (s * .7 + u * .5 + i * .13) % 1; x.globalAlpha = 1 - ph2; x.fillStyle = u ? '#ffe14d' : '#ff9ccd'; x.fillText(u ? '♫' : '♪', ex2 + 22 + Math.sin(ph2 * 6) * 5, ey + 10 - ph2 * 34); }
    if(acao === 'coracao') for(var v = 0; v < 2; v++){ var ph3 = (s * .6 + v * .5 + i * .2) % 1; x.globalAlpha = 1 - ph3; x.fillStyle = '#ff6fb5'; x.fillText('♥', ex2 - 18 + v * 36 + Math.sin(ph3 * 5) * 4, ey + 6 - ph3 * 30); }
    if(rg >= 0 && rg < 1.4){ var pb = rg / 1.4; x.globalAlpha = 1 - pb;
      for(var z = 0; z < 6; z++){ var an = z / 6 * Math.PI * 2 + pb, rr = 14 + pb * 34; x.fillStyle = ['#ff6fb5', '#ffe14d', '#4dd8ff', '#b6ff3b', '#c4a5ff', '#ff9ccd'][z]; x.fillText(z % 2 ? '★' : '♥', ex2 + Math.cos(an) * rr, ey + 18 + Math.sin(an) * rr * .7 - pb * 10); } }
    else if(acao === 'pular' && dy > -3){ x.globalAlpha = .7; x.fillStyle = '#fff'; x.fillText('✦', ex2 - 24, chao - 4); x.fillText('✦', ex2 + 24, chao - 6); }
    x.globalAlpha = 1;
    // nome e recorde
    x.font = '900 11px "M PLUS Rounded 1c",sans-serif';
    var nm = p.nick.length > 11 ? p.nick.slice(0, 10) + '…' : p.nick, tw = x.measureText(nm).width + 16, nx = px + cw / 2;
    x.fillStyle = 'rgba(255,255,255,.95)'; hubIdolsPilula(x, nx - tw / 2, chao + 9, tw, 16, 8); x.fill();
    x.fillStyle = '#5b2bb5'; x.fillText(nm, nx, chao + 21);
    x.font = '800 10px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#ffe14d'; x.fillText('★ ' + p.best, nx, chao + 36);
  }
}
function hubIdolsReage(p, i){   // pulinho + musiquinha (cada Idol num tom diferente)
  if(hubIV.s - p.reage < .5) return;
  p.reage = hubIV.s || 0;
  var base = [523, 587, 659, 698, 784, 880][i % 6];
  [[1, 0], [1.25, .07], [1.5, .14], [2, .22]].forEach(function(n){ beep(base * n[0], .12, 'triangle', .045, n[1]); });
  beep(base * 3, .08, 'sine', .03, .3);
}
function hubIdolsPilula(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
