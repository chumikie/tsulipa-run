/* TsuLiPa⭐World — Handshake⭐Event! (握手会): minijogo de memória e tempo.
   Uma fila de fãs passa pela mesa do seu Idol; cada um diz o nome e o presente favorito.
   Depois eles voltam embaralhados e você tem poucos segundos (o aperto de mão) para lembrar o presente.
   Acertar sobe o Hype; errar ou demorar derruba. Os fãs são NPCs com nomes inventados e visuais sorteados
   do próprio catálogo do jogo (cabelos, cortes, franjas, roupas, acessórios). Recorde no aparelho.
   Prêmio diário (ticket do Karaoke ou item do pet, nunca estrelas): RPC handshake_premio,
   proposta em supabase/sql/proposta/20261103200000_handshake_premio.sql. Este arquivo só declara funções e tabelas. */
var HS_NOMES = ['Nana', 'Kiko', 'Lulu', 'Momo', 'Rafi', 'Yumi', 'Toto', 'Pipo', 'Mel', 'Juju', 'Cacau', 'Lili', 'Koko', 'Duda', 'Nino', 'Mimi', 'Teté', 'Bubu', 'Fifi', 'Gigi', 'Zezé', 'Biba', 'Tuca', 'Dodô', 'Lalá', 'Chico', 'Pururu', 'Nunu', 'Kaká', 'Pepê'];
var HS_PRESENTES = [   // [emoji, nome, grupo]: as opções erradas vêm de preferência do mesmo grupo (fica mais difícil)
  ['🍓', 'Morango', 'doce'], ['🍰', 'Bolo', 'doce'], ['🍬', 'Bala', 'doce'], ['🧁', 'Cupcake', 'doce'], ['🍙', 'Onigiri', 'doce'],
  ['🎀', 'Laço', 'fofo'], ['🧸', 'Ursinho', 'fofo'], ['💌', 'Cartinha', 'fofo'], ['🌸', 'Flor', 'fofo'],
  ['🌙', 'Lua', 'brilho'], ['💎', 'Joia', 'brilho'], ['🎵', 'Música', 'brilho'], ['⭐', 'Estrela', 'brilho'], ['🌈', 'Arco-íris', 'brilho']];
// Jeitos dos fãs: muda como se apresentam e como reagem
var HS_JEITOS = {
  animado: { oi:['Aaah, é você! Eu sou {n}!', 'Oi oi! Sou {n}!'], fav:'Eu AMO {p}!', ok:['Você lembrou! 💖', 'Aaaah! Vou contar pra todo mundo!'], erro:['Ah… era {p}! 🥲'] },
  timido:  { oi:['É-é um prazer… sou {n}.', 'Oi… eu sou {n}.'], fav:'Eu gosto de {p}…', ok:['Você lembrou de mim… 🥹', 'O-obrigado!'], erro:['Tudo bem… era {p}.'] },
  fofo:    { oi:['Oiê! Me chamo {n}!', 'Olá! Sou {n}!'], fav:'Meu favorito: {p}!', ok:['Que fofo! 💕', 'Yay! Acertou!'], erro:['Hehe, era {p}!'] }
};
var HS_JEITO_LISTA = ['animado', 'timido', 'fofo'];
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
  var jeito = um(HS_JEITO_LISTA), J = HS_JEITOS[jeito];
  return { nome:nome, c:c, pres:Math.floor(r() * HS_PRESENTES.length), pose:um(['v', 'tchau', 'coracao', '']), expr:jeito === 'timido' ? 0 : um([2, 3, 6]), jeito:jeito, oi:um(J.oi) };
}
function hsRecorde(){ try{ return +localStorage.getItem(HS_RECORDE_KEY) || 0; }catch(e){ return 0; } }
function hsAbrir(){
  hsOv.hidden = false; hsOv.scrollTop = 0;
  hs = { fase:'inicio', pontos:0, hype:60, rodada:0, fila:[], quiz:[], qi:0, t0:0, msg:'', premio:null, combo:0, comboMax:0, acertos:0, total:0, superfas:0, historico:[], hearts:[], servidor:null, respostas:[], provaErro:'' };
  hsUI(); hsRecuperar(); if(!hsAnim) hsAnim = requestAnimationFrame(hsLoop);
}
function hsFechar(){ hsOv.hidden = true; hs = null; }
function hsNovaRodada(){
  var r = hsSorteio(Date.now() + hs.rodada * 977), usadosNome = {};
  hs.historico.forEach(function(f){ usadosNome[f.nome] = 1; });
  var livres = hsNomesLivres().filter(function(n){ return !usadosNome[n]; }), n = Math.min(3 + Math.floor(hs.rodada * .8), 6), fila = [];
  for(var i = 0; i < n && livres.length; i++){ var nome = livres.splice(Math.floor(r() * livres.length), 1)[0]; fila.push(hsFa(r, nome)); }
  // O servidor determina as respostas desta partida; a estética/ordem dos fãs permanece local.
  var presentesServidor = hs.servidor && hs.servidor.desafios && hs.servidor.desafios[hs.rodada];
  if(Array.isArray(presentesServidor) && presentesServidor.length === fila.length){ fila.forEach(function(f, i){ f.pres = presentesServidor[i]; }); }
  fila.forEach(function(f,i){ f.hsOrigem=hs.rodada+1; f.hsIndice=i; });
  // presentes diferentes entre si na mesma rodada (fica justo lembrar)
  var usados = {}; fila.forEach(function(f){ while(usados[f.pres]) f.pres = (f.pres + 1) % HS_PRESENTES.length; usados[f.pres] = 1; });
  if(typeof eventoPresente === 'function' && fila.length){ var ep = eventoPresente(); if(!usados[ep]){ fila[Math.floor(r() * fila.length)].pres = ep; } }   // o presente da semana sempre aparece
  var quiz = fila.slice();
  // Superfã: da 2ª rodada em diante, um fã de uma rodada anterior volta SEM se apresentar de novo (vale bônus)
  if(hs.historico.length && hs.rodada >= 1){
    var sf = hs.historico[Math.floor(r() * hs.historico.length)];
    if(!usados[sf.pres]){ sf = Object.assign({}, sf, { superfa:true }); quiz.push(sf); }
  }
  hs.historico = hs.historico.concat(fila);
  hs.fila = fila; hs.quiz = quiz.sort(function(){ return r() - .5; }); hs.qi = -1; hs.vi = 0; hs.fase = 'fila'; hs.t0 = hsT; hs.rodada++;
  hsUI();
}
function hsTempoPergunta(){ return Math.max(240, 420 - hs.rodada * 30); }   // ~7s no começo, ~4s no fim   // em quadros (60 por segundo)
function hsProxima(){
  hs.qi++;
  if(hs.qi >= hs.quiz.length){ if(hs.hype <= 0 || hs.rodada >= 5) return hsFim(); hs.fase = 'pausa'; hs.t0 = hsT; hsUI(); return; }
  var f = hs.quiz[hs.qi], ops = [f.pres], r = hsSorteio(Date.now()), grupo = HS_PRESENTES[f.pres][2];
  // as erradas: até 2 do mesmo grupo do certo e, de preferência, presentes de outros fãs da fila (pegadinha)
  var mesmo = HS_PRESENTES.map(function(p, i){ return i; }).filter(function(i){ return i !== f.pres && HS_PRESENTES[i][2] === grupo; });
  var daFila = hs.quiz.map(function(q){ return q.pres; }).filter(function(p){ return p !== f.pres; });
  [daFila, mesmo].forEach(function(L){ L = L.slice(); while(ops.length < 3 && L.length){ var o = L.splice(Math.floor(r() * L.length), 1)[0]; if(ops.indexOf(o) < 0) ops.push(o); } });
  while(ops.length < 4){ var o = Math.floor(r() * HS_PRESENTES.length); if(ops.indexOf(o) < 0) ops.push(o); }
  hs.ops = ops.sort(function(){ return r() - .5; }); hs.fase = 'quiz'; hs.t0 = hsT; hs.resp = -1; hsUI();
}
function hsResponder(i){
  if(!hs || hs.fase !== 'quiz' || hs.resp >= 0) return;
  var f = hs.quiz[hs.qi], ok = i >= 0 && hs.ops[i] === f.pres, rest = Math.max(0, 1 - (hsT - hs.t0) / hsTempoPergunta()), J = HS_JEITOS[f.jeito] || HS_JEITOS.fofo;
  if(hs.servidor && f.hsOrigem && Number.isInteger(f.hsIndice)) hs.respostas.push({ rodada:hs.rodada, origem:f.hsOrigem, indice:f.hsIndice, resposta:i>=0?hs.ops[i]:-1, restante:Math.round(rest*1000), superfa:!!f.superfa });
  hs.resp = i; hs.ok = ok; hs.total++;
  if(ok){
    hs.combo++; hs.comboMax = Math.max(hs.comboMax, hs.combo); hs.acertos++;
    if(typeof eventoPresente === 'function' && f.pres === eventoPresente()) hs.pontos += 50;
    if(hs.combo >= 10 && typeof conqGanhar === 'function' && conqGanhar('jogo_memoria')) hs.conq = '🤝 ' + tr('Memória de fã');
    var base = 100 + Math.round(rest * 80) + hs.rodada * 10 + (f.superfa ? 150 : 0);
    hs.pontos += Math.round(base * (1 + Math.min(hs.combo - 1, 10) * .1));
    hs.hype = Math.min(100, hs.hype + (f.superfa ? 15 : 8)); if(f.superfa) hs.superfas++;
    hs.fala = tr(J.ok[Math.floor(Math.random() * J.ok.length)]);
    for(var k = 0; k < 6; k++) hs.hearts.push({ x:.18 + Math.random() * .2, y:.6, v:.004 + Math.random() * .004, t:0, e:['💖', '💕', '✨'][k % 3] });
    if(sfx && sfx.star) try{ sfx.star(); }catch(e){}
  } else {
    hs.combo = 0; hs.hype = Math.max(0, hs.hype - (i < 0 ? 18 : 22));
    hs.fala = tr(J.erro[0]).replace('{p}', HS_PRESENTES[f.pres][0] + ' ' + tr(HS_PRESENTES[f.pres][1]));
    if(sfx && sfx.hit) try{ sfx.hit(); }catch(e){}
  }
  hs.fase = 'resposta'; hs.t0 = hsT; hsUI();
}
function hsAplicarPet(r){
  if(!r || r.tipo !== 'pet' || !r.item) return true;
  if(!petData && typeof petLoad === 'function') petLoad();
  if(!petData) return false; // prêmio fica no registro do Supabase; resgatar quando houver pet.
  var dono = contaJ && (contaJ.id || contaJ.nick) || '', chave = dono + ':' + r.dia;
  petData.hsPremios = petData.hsPremios || {};
  if(petData.hsPremios[chave]) return true;
  petData.inv = petData.inv || {};
  petData.inv[r.item] = (petData.inv[r.item] || 0) + 1;
  petData.hsPremios[chave] = r.item; // marcador e item são salvos juntos, para evitar reaplicação.
  petSave(true);
  return true;
}
function hsReceberPremio(r, atual){
  if(!r || !r.ok) return;
  if(r.tipo === 'ticket' && window.ktTickets && window.ktTickets.refresh) try{ window.ktTickets.refresh(); }catch(e){}
  var pronto = hsAplicarPet(r);
  if(atual && hs === atual){ hs.premio = r; hs.premioPetPendente = !pronto; hsUI(); }
}
function hsRecuperar(){
  if(!contaJ) return;
  contaRpc('handshake_estado').then(function(r){ if(r && r.ok && r.entregue) hsReceberPremio(r, hs); }).catch(function(){});
  var pendente = null;
  try{ pendente = JSON.parse(localStorage.getItem('tw_hs_pendente') || 'null'); }catch(e){}
  if(!pendente || pendente.nick !== contaJ.nick || !pendente.sessao) return;
  contaRpc('handshake_premio', {p_sessao:pendente.sessao,p_respostas:pendente.respostas}).then(function(r){
    if(r && r.ok){ try{localStorage.removeItem('tw_hs_pendente');}catch(e){} hsReceberPremio(r, hs); }
    else if(r && r.erro === 'pontos') try{localStorage.removeItem('tw_hs_pendente');}catch(e){}
  }).catch(function(){});
}
function hsIniciarSeguro(){
  hsReiniciar(); var atual = hs;
  if(!contaJ){ hsNovaRodada(); return; } // livre para praticar sem conta.
  hs.fase = 'preparando'; hsUI();
  contaRpc('handshake_iniciar').then(function(r){
    if(hs !== atual) return;
    if(r && r.ok && Array.isArray(r.desafios)) atual.servidor = r;
    else atual.provaErro = (r && r.erro) || 'servidor';
    hsNovaRodada();
  }).catch(function(){ if(hs === atual){ atual.provaErro='servidor'; hsNovaRodada(); } });
}
function hsFim(){
  var atual=hs;
  if(!atual || atual.fase==='fim') return;
  atual.fase='fim'; var rec=hsRecorde(); atual.novo=atual.pontos>rec;
  if(atual.novo) try{ localStorage.setItem(HS_RECORDE_KEY,atual.pontos); }catch(e){}
  hsUI();
  if(!contaJ || !atual.servidor || !atual.respostas.length) return;
  var args={p_sessao:atual.servidor.sessao,p_respostas:atual.respostas};
  try{ localStorage.setItem('tw_hs_pendente',JSON.stringify({nick:contaJ.nick,sessao:args.p_sessao,respostas:args.p_respostas})); }catch(e){}
  contaRpc('handshake_premio',args).then(function(r){
    if(r && (r.ok || r.erro==='pontos')) try{ localStorage.removeItem('tw_hs_pendente'); }catch(e){}
    if(hs!==atual) return;
    if(r && r.ok) hsReceberPremio(r,atual);
    else { atual.premio={erro:r&&r.erro||'servidor'}; hsUI(); }
  }).catch(function(){ if(hs===atual){atual.premio={erro:'servidor'};hsUI();} });
}
function hsLoop(ms){
  hsAnim = 0; if(!twAnimacaoVisivel(hsOv)) return;
  var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('hsCv'), ms) : 1; hsT += d;
  if(hs){
    var dt = hsT - hs.t0;
    if(hs.fase === 'fila' && dt > 160){ hs.vi++; hs.t0 = hsT; if(hs.vi >= hs.fila.length){ hs.fase = 'lembrar'; } hsUI(); }
    else if(hs.fase === 'lembrar' && dt > 100) hsProxima();
    else if(hs.fase === 'quiz' && dt > hsTempoPergunta()) hsResponder(-1);
    else if(hs.fase === 'resposta' && dt > 80){ if(hs.hype <= 0) hsFim(); else hsProxima(); }
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
  // holofotes + fila de fãs esperando ao fundo
  x.save(); x.globalAlpha = .18 + .06 * Math.sin(t / 20); x.fillStyle = '#fff6b0';
  [[.3, -1], [.75, 1]].forEach(function(h){ x.beginPath(); x.moveTo(W2 * h[0], 0); x.lineTo(W2 * h[0] + h[1] * W2 * .2 - W2 * .12, H2); x.lineTo(W2 * h[0] + h[1] * W2 * .2 + W2 * .12, H2); x.closePath(); x.fill(); });
  x.restore();
  // fila de verdade: os próximos fãs (mesmo visual sorteado), pequenos e esperando a vez, com plaquinha de nº
  if(hs && hs.fase === 'fila'){
    var prox = hs.fila.slice(hs.vi + 1, hs.vi + 5);
    prox.forEach(function(pf, q){
      var esc = .5 - q * .05, fw = W2 * .3 * esc / .5, fh = H2 * .62 * esc / .5, qx = W2 * .02 + q * W2 * .085, qy = H2 * .32 + q * 4 + Math.sin(t / 10 + q) * 2;
      x.save(); x.globalAlpha = .9 - q * .15; try{ x.translate(qx, qy); perfDesenharIdol(x, fw, fh, { c:pf.c, pose:'', expr:pf.expr, fundo:'' }, false, false, t + q * 13); }catch(e){} x.restore();
    });
    if(prox.length){ x.save(); x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = 'rgba(255,255,255,.9)'; x.beginPath(); if(x.roundRect) x.roundRect(10, H2 - 30, 92, 22, 11); else x.rect(10, H2 - 30, 92, 22); x.fill();
      x.fillStyle = '#7b3ff0'; x.textBaseline = 'middle'; x.fillText('👥 ' + tr('Fila') + ': ' + prox.length, 20, H2 - 19); x.restore(); }
  }
  x.save(); x.fillStyle = 'rgba(255,255,255,.94)'; x.strokeStyle = '#ff9ccf'; x.lineWidth = 3; x.beginPath(); if(x.roundRect) x.roundRect(W2 * .18, 12, W2 * .64, 38, 19); else x.rect(W2 * .18, 12, W2 * .64, 38); x.fill(); x.stroke(); x.fillStyle = '#d63384'; x.textAlign = 'center'; x.textBaseline = 'middle';
  x.font = '900 18px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.fillText('🤝 HANDSHAKE ⭐ EVENT! 握手会', W2 / 2, 32); x.restore();
  // o seu Idol atrás da mesa (à direita)
  try{ var meu = perfAvAtual({ pose:hs && hs.fase === 'resposta' && hs.ok ? 'banzai' : 'tchau', expr:hs && hs.fase === 'resposta' && !hs.ok ? 0 : 3, fundo:'' });
    x.save(); x.translate(W2 * .52, H2 * .02); perfDesenharIdol(x, W2 * .46, H2 * .92, meu, false, false, t); x.restore(); }catch(e){}
  // mesa
  x.fillStyle = '#c98b55'; x.fillRect(W2 * .46, H2 * .7, W2 * .54, H2 * .3); x.fillStyle = '#a0673a'; x.fillRect(W2 * .46, H2 * .7, W2 * .54, 8);
  x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(W2 * .46, H2 * .7 + 8, W2 * .54, 4);
  var nomeIdol = (typeof idolNomeVisivel === 'function' && idolNomeVisivel()) || (contaJ && contaJ.nick) || 'Idol';
  x.save(); x.font = '900 17px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
  var pw = Math.min(W2 * .4, x.measureText(nomeIdol).width + 54), px = W2 * .73 - pw / 2, py = H2 * .75, ph = 40;
  var gp = x.createLinearGradient(px, py, px + pw, py + ph); gp.addColorStop(0, '#ffd1ea'); gp.addColorStop(1, '#d9c8ff');
  x.fillStyle = 'rgba(80,40,120,.25)'; x.beginPath(); if(x.roundRect) x.roundRect(px + 3, py + 4, pw, ph, 12); else x.rect(px + 3, py + 4, pw, ph); x.fill();
  x.fillStyle = gp; x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath(); if(x.roundRect) x.roundRect(px, py, pw, ph, 12); else x.rect(px, py, pw, ph); x.fill(); x.stroke();
  x.fillStyle = '#7b3ff0'; x.fillText('⭐ ' + nomeIdol + ' ⭐', W2 * .73, py + ph / 2 + 1);
  x.font = '800 10px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#d63384'; x.fillText('HANDSHAKE', W2 * .73, py - 7); x.restore();
  // combo
  if(hs && hs.combo >= 2){ x.save(); x.font = '900 20px "Mochiy Pop One",sans-serif'; x.textAlign = 'right'; x.fillStyle = '#ff6fb5'; x.strokeStyle = '#fff'; x.lineWidth = 5;
    var ct = 'COMBO x' + hs.combo; x.strokeText(ct, W2 - 14, 74); x.fillText(ct, W2 - 14, 74); x.restore(); }
  // o fã da vez (à esquerda), entrando
  var f = hsFaAtual();
  if(f){
    var dt = hsT - (hs ? hs.t0 : 0), entra = Math.min(1, dt / 14), fx = -W2 * .25 + entra * W2 * (hs.fase === 'fila' ? .37 : .27);
    try{ x.save(); x.translate(fx, H2 * .06); perfDesenharIdol(x, W2 * .44, H2 * .9, { c:f.c, pose:f.pose, expr:f.expr, fundo:'' }, false, false, t); x.restore(); }catch(e){}
    if(hs.fase === 'fila'){   // balão: nome + presente favorito
      var J = HS_JEITOS[f.jeito] || HS_JEITOS.fofo, pr = HS_PRESENTES[f.pres], txt = tr(f.oi || 'Oi! Eu sou {n}!').replace('{n}', f.nome), t2l = tr(J.fav).replace('{p}', pr[0] + ' ' + tr(pr[1]));
      x.save(); x.font = '900 22px "M PLUS Rounded 1c",sans-serif'; var w = Math.min(W2 * .56, Math.max(x.measureText(txt).width, x.measureText(t2l).width) + 32);
      x.fillStyle = '#fff'; x.strokeStyle = '#ff6fb5'; x.lineWidth = 4; x.beginPath(); if(x.roundRect) x.roundRect(12, H2 * .16, w, 86, 18); else x.rect(12, H2 * .16, w, 86); x.fill(); x.stroke();
      x.fillStyle = '#3c2a8f'; x.textAlign = 'left'; x.fillText(txt, 28, H2 * .16 + 34);
      x.fillStyle = '#d63384'; x.fillText(t2l, 28, H2 * .16 + 68); x.restore();
    } else {
      x.save(); x.font = '900 22px "M PLUS Rounded 1c",sans-serif'; var t2 = hs.fase === 'resposta' && hs.fala ? hs.fala : f.superfa ? tr('Voltei! Lembra de mim? Sou {n}! 🌟').replace('{n}', f.nome) : tr('Lembra de mim? Sou {n}!').replace('{n}', f.nome), w2 = Math.min(W2 * .56, x.measureText(t2).width + 32);
      x.fillStyle = '#fff'; x.strokeStyle = '#7b3ff0'; x.lineWidth = 3; x.beginPath(); if(x.roundRect) x.roundRect(12, H2 * .16, w2, 50, 18); else x.rect(12, H2 * .16, w2, 50); x.fill(); x.stroke();
      x.fillStyle = '#7b3ff0'; x.textAlign = 'left'; x.fillText(t2, 28, H2 * .16 + 33); x.restore();
      if(f.superfa){ x.save(); x.font = '900 13px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#fff'; x.strokeStyle = '#ffb000'; x.lineWidth = 2; x.beginPath(); if(x.roundRect) x.roundRect(14, H2 * .16 + 56, 120, 22, 11); else x.rect(14, H2 * .16 + 56, 120, 22); x.fillStyle = '#ffb000'; x.fill(); x.fillStyle = '#fff'; x.fillText('🌟 ' + tr('Superfã! +150'), 22, H2 * .16 + 71); x.restore(); }
      if(hs.fase === 'resposta'){ x.save(); x.font = '48px sans-serif'; x.textAlign = 'center'; x.fillText(hs.ok ? '💖' : '💦', W2 * .5, H2 * .45 - Math.min(20, dt)); x.restore(); }
    }
  }
  if(typeof eventoPetDesenhar === 'function') eventoPetDesenhar(x, W2 * .46, H2 * .9, t, 1.3, W2 * (.4 + .04 * Math.sin(t / 90)));
  hsCoracoes(x, W2, H2);
}
function hsCoracoes(x, W2, H2){
  if(!hs || !hs.hearts.length) return; x.save(); x.font = '26px sans-serif'; x.textAlign = 'center';
  hs.hearts = hs.hearts.filter(function(h){ h.t++; h.y -= h.v; x.globalAlpha = Math.max(0, 1 - h.t / 70); x.fillText(h.e, W2 * h.x + Math.sin(h.t / 6) * 8, H2 * h.y); return h.t < 70; });
  x.restore();
}
function hsReiniciar(){ var p = hs.premio; hs = { fase:'inicio', pontos:0, hype:60, rodada:0, fila:[], quiz:[], qi:0, t0:hsT, msg:'', premio:null, combo:0, comboMax:0, acertos:0, total:0, superfas:0, historico:[], hearts:[], servidor:null, respostas:[], provaErro:'' }; }
function hsUI(){
  var c = $('hsCorpo'); if(!c || !hs) return;
  var h = '<div class="hsstatus"><span>⭐ ' + hs.pontos.toLocaleString('pt-BR') + '</span><span>' + escHtml(tr('Rodada')) + ' ' + Math.max(1, hs.rodada) + '/5</span>' + (hs.combo >= 2 ? '<span class="hscombo">🔥 x' + hs.combo + '</span>' : '') + '<span>🏆 ' + hsRecorde().toLocaleString('pt-BR') + '</span></div>' +
    '<div class="hshype"><b>🔥 Hype</b><div class="albumbarra"><i style="width:' + hs.hype + '%"></i></div></div>';
  if(hs.fase === 'preparando') h += '<p class="hsdica">⏳ ' + escHtml(tr('Preparando o registro do evento…')) + '</p>';
  if(hs.fase === 'inicio') h += '<p class="hsdica">' + escHtml(tr('Os fãs vão passar pela sua mesa dizendo o nome e o presente favorito. Depois eles voltam: escolha o presente certo antes do aperto de mão acabar!')) + '</p>' +
    (typeof eventoAtual === 'function' ? '<p class="hsdica evsemana">' + eventoAtual().emo + ' <b>' + escHtml(tr(eventoAtual().nome)) + '</b>: ' + escHtml(tr('o presente {p} vale +50!').replace('{p}', eventoAtual().pres)) + '</p>' : '') +
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
    if(hs.conq) h += '<p class="faok">🏆 ' + escHtml(tr('Insígnia nova na Estante de troféus:')) + ' ' + escHtml(hs.conq) + '</p>';
    h += '<div class="hsresumo"><span>🎯 ' + hs.acertos + '/' + hs.total + '</span><span>🔥 ' + escHtml(tr('Combo máx.')) + ' ' + hs.comboMax + '</span><span>🌟 ' + escHtml(tr('Superfãs')) + ' ' + hs.superfas + '</span></div>';
    if(hs.premioPetPendente) h += '<p class="hsdica">🎁 ' + escHtml(tr('Prêmio registrado no servidor. Crie ou abra seu pet para receber o mimo.')) + '</p>';
    if(!hs.servidor && contaJ) h += '<p class="hsdica">🔒 ' + escHtml(tr('Partida de treino: o servidor não confirmou o início; sem prêmio nem missão.')) + '</p>';
    if(hs.premio && hs.premio.erro === 'servidor') h += '<p class="hsdica">⏳ ' + escHtml(tr('Registro pendente. Ele será recuperado ao reabrir o evento.')) + '</p>';
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
  if(e.target.closest && e.target.closest('#hsJogar')){ hsIniciarSeguro(); if(sfx && sfx.card) try{ sfx.card(); }catch(x){} }
}
function hsHubHtml(){
  var feito = false; try{ feito = localStorage.getItem('tw_hs_dia') === new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }catch(e){}
  return '<button type="button" class="hubcard hubhandshake' + (feito ? '' : ' tw-alert-pink') + '" data-ir="handshake">' + (feito ? '' : '<em class="hubalerta" aria-hidden="true">!</em>') + '<i>🤝</i><b translate="no">Handshake⭐Event!</b><small class="tw-hubgame-jp" lang="ja">握手会</small><small>' + escHtml(tr('Lembre o presente de cada fã!')) + '</small></button>';
}
