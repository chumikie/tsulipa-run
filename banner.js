/* TsuLiPa⭐World — rodízio do banner da página inicial (só front-end).
   Dia 1: o TsuLiPa (com vozes). Dia 2: um trio de Idols do site. Dia 3: outro trio. Depois recomeça.
   O dia vira à 0h de Brasília. Os trios vêm da vitrine pública (vitrine_idols) e são sorteados pela data,
   então todo mundo vê o mesmo trio no mesmo dia. Idols do site não têm voz: só frase, emoji e um efeito sonoro.
   Este arquivo só declara funções e tabelas. */
var BANNER_TSULIPA = ['tsu', 'lirika', 'patiliri'];
var BANNER_FALAS = [['Oi!', '👋'], ['Bem-vindo!', '💖'], ['Vamos jogar?', '🎮'], ['Hoje tem show!', '🎤'], ['Obrigado por vir!', '✨'], ['Bora pro Center!', '🏁'], ['hehe~', '😆']];
var BANNER_EMO = ['💖', '⭐', '✨', '🎵', '🌸', '💫'];
var bannerCache = { chave:'', elenco:null };
// Uniforme dos trios do site: todos com a mesma roupa do jogo (troca a cada ciclo de 3 dias), cada um num tom pastel
var BANNER_UNIFORMES = ['seifuku', 'estrelado', 'y2k', 'zipper', 'sweet', 'citypop'];
var BANNER_PASTEIS = ['#f6c6e0', '#c8e3fb', '#cdeec6'];   // rosa, azul e verde suaves (as cores do TsuLiPa, em pastel)
function bannerUniforme(c, i, roupa){
  c.out = roupa || BANNER_UNIFORMES[((Math.floor(bannerDia() / 3) % BANNER_UNIFORMES.length) + BANNER_UNIFORMES.length) % BANNER_UNIFORMES.length];
  c.outcol = BANNER_PASTEIS[i % BANNER_PASTEIS.length];
  return c;
}
function bannerDia(){ return Math.floor((Date.now() - 3 * 3600e3) / 864e5); }   // dia de Brasília
function bannerSorteio(L, semente){   // embaralha igual para todos no mesmo ciclo
  var a = L.slice(), s = (semente * 2654435761) >>> 0 || 1;
  for(var i = a.length - 1; i > 0; i--){ s = (s * 1103515245 + 12345) >>> 0; var j = s % (i + 1), t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}
function bannerElenco(){   // null = dia do TsuLiPa (ou vitrine ainda não carregou)
  var dia = bannerDia(), fase = ((dia % 3) + 3) % 3;
  if(fase === 0 || typeof hubIdolsDados === 'undefined' || !hubIdolsDados || !Array.isArray(hubIdolsDados.idols)) return null;
  var chave = dia + '|' + hubIdolsDados.idols.length;
  if(bannerCache.chave === chave) return bannerCache.elenco;
  var pool = hubIdolsDados.idols.filter(function(p){
    return p && p.nick && p.avatar && p.avatar.c && typeof p.avatar.c === 'object' && BANNER_TSULIPA.indexOf(String(p.nick).toLowerCase()) < 0;
  });
  pool.sort(function(a, b){ return String(a.nick).localeCompare(String(b.nick)); });
  var elenco = null;
  if(pool.length >= 3){
    pool = bannerSorteio(pool, Math.floor(dia / 3));
    var ini = fase === 1 ? 0 : 3;
    elenco = [0, 1, 2].map(function(n){ var p = pool[(ini + n) % pool.length]; return { nick:String(p.nick).slice(0, 24), av:p.avatar }; });
    if(new Set(elenco.map(function(p){ return p.nick; })).size < 3) elenco = null;
  }
  bannerCache = { chave:chave, elenco:elenco };
  return elenco;
}
function bannerRotulo(){
  var e = bannerElenco();
  return e ? tr('Idols do TsuLiPa⭐World') + ': ' + e.map(function(p){ return p.nick; }).join(', ') : 'TsuLiPa: Tsu, Lirika e Pati';
}
function bannerVisitaDesenhar(x, W2, H2, elenco, t, roupa, sc, chao){   // os três Idols do site, com o nome embaixo
  elenco.forEach(function(p, i){
    var av = p.av || {}, c = perfChar(av), cx = W2 * HUB_TRIO[i][2], bob = Math.sin(t * .06 + i * 2.1) * 1.1 * sc;
    bannerUniforme(c, i, roupa);   // uniformizados: mesma roupa (ou a do tema), tons pastel
    var ex = [0, 1, 2, 3, 4, 5, 6].indexOf(+av.expr) >= 0 ? +av.expr : 2;
    var rg = HUB_REAGE.i === i ? hubT - HUB_REAGE.t0 : 999, rgD = (HUB_REAGE.dur || 200) - 30;
    if(rg < rgD){ bob -= Math.abs(Math.sin(rg / 35 * Math.PI)) * (rg < 70 ? 9 : 3) * sc * (rg < 70 ? 1 - rg / 90 : 1); ex = 3; }
    var pose = typeof perfPoseInfo === 'function' && perfPoseInfo(av.pose) ? av.pose : 'v';
    accSel = typeof av.a === 'string' ? av.a : '';
    x.fillStyle = 'rgba(30,10,60,.22)'; x.beginPath(); x.ellipse(cx, chao - .4 * sc, 9 * sc, 1.6 * sc, 0, 0, 7); x.fill();
    perfCharContorno(x, cx - 15 * sc, chao - 44 * sc + bob, sc, function(){ charPose = pose; drawChar(c, 0, 0, 0, ex, false); });
    charPose = ''; perfAntena = '';
    // plaquinha com o apelido
    x.save(); x.font = (3.4 * sc) + 'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    var nm = p.nick, w = x.measureText(nm).width + 5 * sc, h = 5.4 * sc, ny = Math.min(H2 - h / 2 - 1, chao + 2.8 * sc);
    x.fillStyle = ['#9b30d9', '#3f9c1f', '#4169e1'][i]; x.beginPath();
    if(x.roundRect) x.roundRect(cx - w / 2, ny - h / 2, w, h, h / 2); else x.rect(cx - w / 2, ny - h / 2, w, h);
    x.fill(); x.fillStyle = '#fff'; x.fillText(nm, cx, ny + .2 * sc); x.restore();
  });
  accSel = '';
}
function bannerVisitaReage(i){   // sem voz: frase, emojis e um efeito sonoro
  if(i < 0 || i > 2 || (HUB_REAGE.i === i && hubT - HUB_REAGE.t0 < 60)) return;
  var f = BANNER_FALAS[Math.floor(Math.random() * BANNER_FALAS.length)];
  HUB_REAGE = { i:i, t0:hubT, dur:200, txt:f[0], emo:[0, 1, 2, 3, 4].map(function(n){ return { e:n % 2 ? f[1] : BANNER_EMO[(i * 2 + n) % BANNER_EMO.length], dx:0, v:.5 + Math.random() * .5 }; }) };
  try{ if(!(typeof muted !== 'undefined' && muted) && sfx && sfx.star) sfx.star(); }catch(e){}
}

// Torcida do Star⭐Gacha!: os 3 do banner do dia torcem por quem gira.
// Nunca aparece a própria pessoa; se for Tsu, Lirika ou Patiliri, o TsuLiPa não torce (entra um trio do site).
function bannerPool(){
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols : [];
  L = L.filter(function(p){ return p && p.nick && p.avatar && p.avatar.c && typeof p.avatar.c === 'object' && BANNER_TSULIPA.indexOf(String(p.nick).toLowerCase()) < 0; });
  L.sort(function(a, b){ return String(a.nick).localeCompare(String(b.nick)); });
  return bannerSorteio(L, Math.floor(bannerDia() / 3));
}
function bannerTorcida(){   // null = sem torcida; {tsulipa:true} = Tsu, Lirika e Pati; senão {gente:[{nick,av}]}
  var eu = String(typeof contaJ !== 'undefined' && contaJ && contaJ.nick || '').toLowerCase();
  var souTsulipa = BANNER_TSULIPA.indexOf(eu) >= 0 || eu === 'pati';
  var cast = bannerElenco();
  if(!cast && !souTsulipa) return { tsulipa:true };
  var pool = bannerPool(); if(pool.length < 3) return souTsulipa ? null : { tsulipa:true };
  var gente = (cast || pool.slice(0, 3).map(function(p){ return { nick:String(p.nick).slice(0, 24), av:p.avatar }; })).filter(function(p){ return String(p.nick).toLowerCase() !== eu; });
  for(var i = 0; gente.length < 3 && i < pool.length; i++){   // completa sem repetir e sem a própria pessoa
    var p = pool[i], nk = String(p.nick).slice(0, 24);
    if(nk.toLowerCase() !== eu && !gente.some(function(g){ return g.nick === nk; })) gente.push({ nick:nk, av:p.avatar });
  }
  return gente.length === 3 ? { gente:gente } : null;
}
function bannerTorcidaDesenhar(x, W2, H2, t, girando){   // no canto esquerdo da sala do Gacha, pequenos, pulando
  var tc = bannerTorcida(); if(!tc) return;
  var sc = 1.9, chao = H2 * .9, xs = [W2 * .06, W2 * .14, W2 * .22];
  var oS = state, oPw = pw, oDpw = dpw, oR = rankI, oSa = sash, oA = accSel, oF = frame;
  try{
    state = 'play'; pw = null; dpw = null; rankI = 0; sash = false; frame = t;
    for(var i = 0; i < 3; i++){
      var c, pose = girando ? ['banzai', 'luz', 'banzai'][i] : ['luz', 'v', 'coracao'][i], ex = girando ? 3 : 2;
      if(tc.tsulipa){ c = CH[i]; accSel = ''; }
      else { var av = tc.gente[i].av || {}; c = bannerUniforme(perfChar(av), i, typeof HUB_ROUPA_TEMA !== 'undefined' && typeof temaAtual === 'function' ? HUB_ROUPA_TEMA[temaAtual()] || '' : ''); accSel = typeof av.a === 'string' ? av.a : ''; }
      var pulo = Math.abs(Math.sin(t * (girando ? .16 : .06) + i * 1.3)) * (girando ? 9 : 3), cx = xs[i];
      x.fillStyle = 'rgba(30,10,60,.2)'; x.beginPath(); x.ellipse(cx, chao, 11 * sc, 1.8 * sc, 0, 0, 7); x.fill();
      perfCharContorno(x, cx - 15 * sc, chao - 44 * sc - pulo, sc, function(){ charPose = pose; drawChar(c, 0, 0, 0, ex, false); });
      charPose = ''; perfAntena = '';
      if(girando && Math.floor(t / 20 + i) % 3 === 0){ x.save(); x.font = '16px sans-serif'; x.textAlign = 'center'; x.fillText(['💖', '⭐', '✨'][i], cx, chao - 50 * sc - pulo); x.restore(); }
    }
    if(girando){   // faixinha de torcida
      x.save(); x.font = '800 13px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      var txt = tr('Boa sorte!'), w = x.measureText(txt).width + 18, cx2 = W2 * .14, cy = chao - 50 * sc - 30;
      x.fillStyle = '#fff'; x.strokeStyle = '#ff6fb5'; x.lineWidth = 2; x.beginPath(); if(x.roundRect) x.roundRect(cx2 - w / 2, cy - 12, w, 24, 12); else x.rect(cx2 - w / 2, cy - 12, w, 24); x.fill(); x.stroke();
      x.fillStyle = '#d63384'; x.fillText(txt, cx2, cy + 1); x.restore();
    }
  }catch(e){}
  finally{ state = oS; pw = oPw; dpw = oDpw; rankI = oR; sash = oSa; accSel = oA; frame = oF; charPose = ''; perfAntena = ''; }
}
