/* TsuLiPa⭐World — Handshake⭐Event! (握手会): minijogo de memória e tempo.
   Uma fila de fãs passa pela mesa do seu Idol; cada um diz o nome e o presente favorito.
   Depois eles voltam embaralhados e você tem poucos segundos (o aperto de mão) para lembrar o presente.
   Acertar sobe o Hype; errar ou demorar derruba. Os fãs são NPCs com nomes inventados e visuais sorteados
   do próprio catálogo do jogo (cabelos, cortes, franjas, roupas, acessórios). Recorde no aparelho.
   Prêmio diário (ticket do Karaoke ou item do pet, nunca estrelas): RPC handshake_premio,
   proposta em supabase/sql/proposta/20261103200000_handshake_premio.sql. Este arquivo só declara funções e tabelas. */
var HS_NOMES = ['Nana', 'Kiko', 'Lulu', 'Momo', 'Rafi', 'Yumi', 'Toto', 'Pipo', 'Mel', 'Juju', 'Cacau', 'Lili', 'Koko', 'Duda', 'Nino', 'Mimi', 'Teté', 'Bubu', 'Fifi', 'Gigi', 'Zezé', 'Biba', 'Tuca', 'Dodô', 'Lalá', 'Chico', 'Pururu', 'Nunu', 'Kaká', 'Pepê'];
var HS_PRESENTES = [['🍓', 'Morango'], ['🍰', 'Bolo'], ['🎀', 'Laço'], ['🌸', 'Flor'], ['💌', 'Cartinha'], ['🧸', 'Ursinho'], ['🍬', 'Bala'], ['🌙', 'Lua'], ['🎵', 'Música'], ['🍙', 'Onigiri'], ['🧁', 'Cupcake'], ['💎', 'Joia']];
var HS_CABELOS = ['#ff7eb6', '#000000', '#864ffe', '#0000ff', '#ffd23f', '#8b4513', '#4dd8ff', '#b6ff3b', '#f2f2f2', '#d63384', '#2f5be0', '#c98b55'];
var HS_PELES = ['#f1c9a5', '#e0ac69', '#b97a50', '#8d5524', '#ffdbac'];
var HS_RECORDE_KEY = 'tw_handshake_recorde';
var hs = null, hsAnim = 0, hsT = 0;
function hsSorteio(seed){ var s = (seed >>> 0) || 1; return function(){ s = (s * 1103515245 + 12345) >>> 0; return (s >>> 8) / 16777216; }; }
function hsOpcoes(id){ var el = $(id); return el ? [].map.call(el.options, function(o){ return o.value; }) : ['']; }
function hsNomesLivres(){   // nunca usa um nome igual ao de um jogador real
  var reais = {}; ((typeof hubIdolsDados !== 'undefined' && hubIdolsDados && hubIdolsDados.idols) || []).forEach(function(p){ reais[String(p.nick).toLowerCase()] = 1; });
  if(contaJ && contaJ.nick) reais[String(contaJ.nick).toLowerCase()] = 1;
  return HS_NOMES.filter(function(n){ return !reais[n.toLowerCase()]; });
}
function hsFa(r, nome){   // um fã com visual sorteado do catálogo que já existe
  function um(L){ return L[Math.floor(r() * L.length)]; }
  var c = {}; for(var k in PERF_BASE) c[k] = PERF_BASE[k];
  c.hair = um(HS_CABELOS); c.img = c.hair; c.skin = um(HS_PELES); c.hair2 = um(HS_CABELOS);
  c.back = um(hsOpcoes('cback')); c.front = um(hsOpcoes('cfront')); c.det = r() < .4 ? um(hsOpcoes('cdet')) : '';
  c.out = um(hsOpcoes('cout')); c.outcol = um(['#ffffff', '#ff9ccd', '#c8e3fb', '#cdeec6', '#ffe9a8', '#d9c7fb']);
  c.gl = r() < .25 ? um(hsOpcoes('cgl')) : ''; c.hat = r() < .25 ? um(hsOpcoes('chat')) : '';
  return { nome:nome, c:c, pres:Math.floor(r() * HS_PRESENTES.length), pose:um(['v', 'tchau', 'coracao', '']), expr:um([2, 3, 6]) };
}
function hsRecorde(){ try{ return +localStorage.getItem(HS_RECORDE_KEY) || 0; }catch(e){ return 0; } }
function hsAbrir(){
  hsOv.hidden = false; hsOv.scrollTop = 0;
  hs = { fase:'inicio', pontos:0, hype:60, rodada:0, fila:[], quiz:[], qi:0, t0:0, msg:'', premio:null };
  hsUI(); if(!hsAnim) hsAnim = requestAnimationFrame(hsLoop);
}
function hsFechar(){ hsOv.hidden = true; hs = null; }
function hsNovaRodada(){
  var r = hsSorteio(Date.now() + hs.rodada * 977), livres = hsNomesLivres().slice(), n = Math.min(3 + hs.rodada, 7), fila = [];
  for(var i = 0; i < n && livres.length; i++){ var nome = livres.splice(Math.floor(r() * livres.length), 1)[0]; fila.push(hsFa(r, nome)); }
  // presentes diferentes entre si na mesma rodada (fica justo lembrar)
  var usados = {}; fila.forEach(function(f){ while(usados[f.pres]) f.pres = (f.pres + 1) % HS_PRESENTES.length; usados[f.pres] = 1; });
  hs.fila = fila; hs.quiz = fila.slice().sort(function(){ return r() - .5; }); hs.qi = -1; hs.vi = 0; hs.fase = 'fila'; hs.t0 = hsT; hs.rodada++;
  hsUI();
}
function hsTempoPergunta(){ return Math.max(150, 270 - hs.rodada * 20); }   // em quadros (60 por segundo)
function hsProxima(){
  hs.qi++;
  if(hs.qi >= hs.quiz.length){ if(hs.hype <= 0 || hs.rodada >= 5) return hsFim(); hs.fase = 'pausa'; hs.t0 = hsT; hsUI(); return; }
  var f = hs.quiz[hs.qi], ops = [f.pres], r = hsSorteio(Date.now());
  while(ops.length < 4){ var o = Math.floor(r() * HS_PRESENTES.length); if(ops.indexOf(o) < 0) ops.push(o); }
  hs.ops = ops.sort(function(){ return r() - .5; }); hs.fase = 'quiz'; hs.t0 = hsT; hs.resp = -1; hsUI();
}
function hsResponder(i){
  if(!hs || hs.fase !== 'quiz' || hs.resp >= 0) return;
  var f = hs.quiz[hs.qi], ok = i >= 0 && hs.ops[i] === f.pres, rest = Math.max(0, 1 - (hsT - hs.t0) / hsTempoPergunta());
  hs.resp = i; hs.ok = ok;
  if(ok){ hs.pontos += 100 + Math.round(rest * 60) + hs.rodada * 10; hs.hype = Math.min(100, hs.hype + 8); if(sfx && sfx.star) try{ sfx.star(); }catch(e){} }
  else { hs.hype = Math.max(0, hs.hype - 22); if(sfx && sfx.hit) try{ sfx.hit(); }catch(e){} }
  hs.fase = 'resposta'; hs.t0 = hsT; hsUI();
}
function hsFim(){
  hs.fase = 'fim'; var rec = hsRecorde(); hs.novo = hs.pontos > rec;
  if(hs.novo) try{ localStorage.setItem(HS_RECORDE_KEY, hs.pontos); }catch(e){}
  hsUI();
  if(contaJ && hs.pontos >= 600) contaRpc('handshake_premio', { p_pontos:hs.pontos }).then(function(r){
    if(!hs) return;
    if(r && r.ok){
      if(r.tipo === 'pet' && r.item){ if(!petData && typeof petLoad === 'function') petLoad(); if(petData){ petData.inv = petData.inv || {}; petData.inv[r.item] = (petData.inv[r.item] || 0) + 1; petSave(true); } }
      if(r.tipo === 'ticket' && window.ktTickets && window.ktTickets.refresh) try{ window.ktTickets.refresh(); }catch(e){}
      hs.premio = r;
    } else hs.premio = { erro:r && r.erro };
    hsUI();
  }).catch(function(){ if(hs){ hs.premio = { erro:'servidor' }; hsUI(); } });
}
function hsLoop(ms){
  hsAnim = 0; if(!twAnimacaoVisivel(hsOv)) return;
  var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('hsCv'), ms) : 1; hsT += d;
  if(hs){
    var dt = hsT - hs.t0;
    if(hs.fase === 'fila' && dt > 110){ hs.vi++; hs.t0 = hsT; if(hs.vi >= hs.fila.length){ hs.fase = 'lembrar'; } hsUI(); }
    else if(hs.fase === 'lembrar' && dt > 70) hsProxima();
    else if(hs.fase === 'quiz' && dt > hsTempoPergunta()) hsResponder(-1);
    else if(hs.fase === 'resposta' && dt > 55){ if(hs.hype <= 0) hsFim(); else hsProxima(); }
    else if(hs.fase === 'pausa' && dt > 90) hsNovaRodada();
    if(hs.fase === 'quiz'){ var bar = $('hsTempo'); if(bar) bar.style.width = Math.max(0, 100 - dt / hsTempoPergunta() * 100) + '%'; }
  }
  if(Math.floor(hsT / 2) !== Math.floor((hsT - d) / 2)) hsDesenhar();
  hsAnim = requestAnimationFrame(hsLoop);
}
function hsFaAtual(){
  if(!hs) return null;
  if(hs.fase === 'fila') return hs.fila[hs.vi];
  if(hs.fase === 'quiz' || hs.fase === 'resposta') return hs.quiz[hs.qi];
  return null;
}
function hsDesenhar(){
  var cv = $('hsCv'); if(!cv) return;
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, t = hsT;
  x.clearRect(0, 0, W2, H2);
  try{ perfFundo(x, W2, H2, 'palco', '#ff6fb5', t); }catch(e){}
  // faixa do evento
  x.save(); x.fillStyle = 'rgba(255,255,255,.92)'; x.fillRect(W2 * .18, 14, W2 * .64, 34); x.fillStyle = '#d63384'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '900 18px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.fillText('🤝 HANDSHAKE ⭐ EVENT! 握手会', W2 / 2, 32); x.restore();
  // o seu Idol atrás da mesa (à direita)
  try{ var meu = perfAvAtual({ pose:hs && hs.fase === 'resposta' && hs.ok ? 'banzai' : 'tchau', expr:hs && hs.fase === 'resposta' && !hs.ok ? 0 : 3, fundo:'' });
    x.save(); x.translate(W2 * .52, H2 * .02); perfDesenharIdol(x, W2 * .46, H2 * .92, meu, false, false, t); x.restore(); }catch(e){}
  // mesa
  x.fillStyle = '#c98b55'; x.fillRect(W2 * .46, H2 * .7, W2 * .54, H2 * .3); x.fillStyle = '#a0673a'; x.fillRect(W2 * .46, H2 * .7, W2 * .54, 8);
  x.fillStyle = '#fff'; x.fillRect(W2 * .6, H2 * .76, W2 * .26, H2 * .1); x.fillStyle = '#ff6fb5'; x.font = '800 13px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
  x.fillText(contaJ && contaJ.nick ? contaJ.nick : 'Idol', W2 * .73, H2 * .82);
  // o fã da vez (à esquerda), entrando
  var f = hsFaAtual();
  if(f){
    var dt = hsT - (hs ? hs.t0 : 0), entra = Math.min(1, dt / 14), fx = -W2 * .25 + entra * W2 * .27;
    try{ x.save(); x.translate(fx, H2 * .06); perfDesenharIdol(x, W2 * .44, H2 * .9, { c:f.c, pose:f.pose, expr:f.expr, fundo:'' }, false, false, t); x.restore(); }catch(e){}
    if(hs.fase === 'fila'){   // balão: nome + presente favorito
      var txt = tr('Oi! Eu sou {n}!').replace('{n}', f.nome), pr = HS_PRESENTES[f.pres], t2l = tr('Meu favorito:') + ' ' + pr[0] + ' ' + tr(pr[1]);
      x.save(); x.font = '900 22px "M PLUS Rounded 1c",sans-serif'; var w = Math.min(W2 * .56, Math.max(x.measureText(txt).width, x.measureText(t2l).width) + 32);
      x.fillStyle = '#fff'; x.strokeStyle = '#ff6fb5'; x.lineWidth = 4; x.beginPath(); if(x.roundRect) x.roundRect(12, H2 * .16, w, 86, 18); else x.rect(12, H2 * .16, w, 86); x.fill(); x.stroke();
      x.fillStyle = '#3c2a8f'; x.textAlign = 'left'; x.fillText(txt, 28, H2 * .16 + 34);
      x.fillStyle = '#d63384'; x.fillText(t2l, 28, H2 * .16 + 68); x.restore();
    } else {
      x.save(); x.font = '900 22px "M PLUS Rounded 1c",sans-serif'; var t2 = tr('Lembra de mim? Sou {n}!').replace('{n}', f.nome), w2 = Math.min(W2 * .56, x.measureText(t2).width + 32);
      x.fillStyle = '#fff'; x.strokeStyle = '#7b3ff0'; x.lineWidth = 3; x.beginPath(); if(x.roundRect) x.roundRect(12, H2 * .16, w2, 50, 18); else x.rect(12, H2 * .16, w2, 50); x.fill(); x.stroke();
      x.fillStyle = '#7b3ff0'; x.textAlign = 'left'; x.fillText(t2, 28, H2 * .16 + 33); x.restore();
      if(hs.fase === 'resposta'){ x.save(); x.font = '48px sans-serif'; x.textAlign = 'center'; x.fillText(hs.ok ? '💖' : '💦', W2 * .5, H2 * .45 - Math.min(20, dt)); x.restore(); }
    }
  }
}
function hsUI(){
  var c = $('hsCorpo'); if(!c || !hs) return;
  var h = '<div class="hsstatus"><span>⭐ ' + hs.pontos.toLocaleString('pt-BR') + '</span><span>' + escHtml(tr('Rodada')) + ' ' + Math.max(1, hs.rodada) + '/5</span><span>🏆 ' + hsRecorde().toLocaleString('pt-BR') + '</span></div>' +
    '<div class="hshype"><b>🔥 Hype</b><div class="albumbarra"><i style="width:' + hs.hype + '%"></i></div></div>';
  if(hs.fase === 'inicio') h += '<p class="hsdica">' + escHtml(tr('Os fãs vão passar pela sua mesa dizendo o nome e o presente favorito. Depois eles voltam: escolha o presente certo antes do aperto de mão acabar!')) + '</p>' +
    '<div class="btns"><button type="button" class="btn" id="hsJogar">🤝 ' + escHtml(tr('Começar o Handshake')) + '</button></div>' +
    '<p class="hsdica">🎁 ' + escHtml(tr('Fez 600 pontos? Ganha um prêmio do dia: ticket do Karaoke⭐Time! ou um mimo para o seu pet.')) + '</p>';
  else if(hs.fase === 'fila') h += '<p class="hsdica">👀 ' + escHtml(tr('Memorize: fã {a} de {b}')).replace('{a}', hs.vi + 1).replace('{b}', hs.fila.length) + '</p>';
  else if(hs.fase === 'lembrar') h += '<p class="hsdica">✨ ' + escHtml(tr('Agora eles voltam! Lembra do presente de cada um?')) + '</p>';
  else if(hs.fase === 'quiz' || hs.fase === 'resposta'){
    h += '<div class="hstempo"><i id="hsTempo" style="width:100%"></i></div><div class="hsops">' + hs.ops.map(function(o, i){
      var p = HS_PRESENTES[o], cls = hs.fase === 'resposta' ? (o === hs.quiz[hs.qi].pres ? ' certo' : i === hs.resp ? ' errado' : '') : '';
      return '<button type="button" class="hsop' + cls + '" data-hs="' + i + '"' + (hs.fase === 'resposta' ? ' disabled' : '') + '><span>' + p[0] + '</span><small>' + escHtml(tr(p[1])) + '</small></button>';
    }).join('') + '</div>';
  }
  else if(hs.fase === 'pausa') h += '<p class="hsdica">🎶 ' + escHtml(tr('Próxima fila chegando… agora com mais fãs!')) + '</p>';
  else if(hs.fase === 'fim'){
    h += '<p class="hsfim">' + (hs.novo ? '🏆 ' + escHtml(tr('Novo recorde!')) + ' ' : '') + escHtml(tr('Fim do evento!')) + ' <b>' + hs.pontos.toLocaleString('pt-BR') + '</b> ' + escHtml(tr('pts')) + '</p>';
    if(hs.premio && hs.premio.ok) h += '<p class="faok">🎁 ' + escHtml(hs.premio.tipo === 'ticket' ? tr('Você ganhou 1 ticket do Karaoke⭐Time!') : tr('Seu pet ganhou um mimo! Está guardado no camarim.')) + '</p>';
    else if(hs.premio && hs.premio.erro === 'hoje') h += '<p class="hsdica">' + escHtml(tr('O prêmio de hoje já foi entregue. Volte amanhã!')) + '</p>';
    else if(hs.pontos >= 600 && !contaJ) h += '<p class="hsdica">' + escHtml(tr('Entre na sua conta para ganhar o prêmio do dia.')) + '</p>';
    else if(hs.pontos < 600) h += '<p class="hsdica">' + escHtml(tr('Faça 600 pontos para ganhar o prêmio do dia.')) + '</p>';
    h += '<div class="btns"><button type="button" class="btn" id="hsJogar">🔁 ' + escHtml(tr('Jogar de novo')) + '</button></div>';
  }
  c.innerHTML = h;
}
function hsClique(e){
  var b = e.target.closest && e.target.closest('[data-hs]'); if(b){ hsResponder(+b.dataset.hs); return; }
  if(e.target.closest && e.target.closest('#hsJogar')){ hs.pontos = 0; hs.hype = 60; hs.rodada = 0; hs.premio = null; hsNovaRodada(); if(sfx && sfx.card) try{ sfx.card(); }catch(x){} }
}
function hsHubHtml(){
  return '<button type="button" class="hubcard hubhandshake" data-ir="handshake"><i>🤝</i><b translate="no">Handshake⭐Event!</b><small class="tw-hubgame-jp" lang="ja">握手会</small><small>' + escHtml(tr('Lembre o presente de cada fã!')) + '</small></button>';
}
