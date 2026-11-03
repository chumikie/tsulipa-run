/* Happy⭐Cafe! — café temático do grupo, inspirado nos cafés de shakes, frappés e docinhos.
   Os clientes (fãs NPC com nomes inventados e visuais que já existem no jogo) pedem uma bebida montada
   em camadas (base → cobertura → enfeite) e às vezes um docinho. Monte, sirva antes da paciência acabar.
   Prêmios só visuais: cada pedido perfeito libera um cartão de receita no Caderno do café (salvo no aparelho).
   Não dá estrelas e não usa o teto de ★50 do pet. */
var CF_BASES = [['☕', 'Café gelado', '#8a5a3b'], ['🍵', 'Matcha latte', '#9fd18b'], ['🍫', 'Chocolate', '#6b3b2a'], ['🍓', 'Frappé de morango', '#ff9cc4'], ['🫐', 'Shake de mirtilo', '#a99cff']];
var CF_COBERTURAS = [['🍦', 'Chantilly', '#fffaf2'], ['🍯', 'Caramelo', '#f0a73a'], ['🌈', 'Granulado', '#ffe0f0']];
var CF_ENFEITES = [['💗', 'Coração'], ['⭐', 'Estrela'], ['🍒', 'Cereja'], ['🎀', 'Laço de biscoito']];
var CF_DOCES = [['🍪', 'Cookie'], ['🟫', 'Brownie'], ['🥐', 'Croissant'], ['🧇', 'Waffle']];
var CF_RECEITAS_KEY = 'tw_cafe_receitas', CF_RECORDE_KEY = 'tw_cafe_recorde';
var cf = null, cfAnim = 0, cfT = 0;

function cfLer(k, def){ try{ var v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; }catch(e){ return def; } }
function cfGravar(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function cfNomeReceita(p){ return tr(CF_BASES[p.base][1]) + ' ' + CF_ENFEITES[p.enf][0]; }
function cfPedido(r, n){
  // começa simples (base + enfeite) e vai pedindo cobertura e docinho
  var p = { base:Math.floor(r() * CF_BASES.length), cob:n >= 2 || r() < .4 ? Math.floor(r() * CF_COBERTURAS.length) : -1,
    enf:Math.floor(r() * CF_ENFEITES.length), doce:n >= 4 && r() < .6 ? Math.floor(r() * CF_DOCES.length) : -1 };
  if(typeof eventoAtual === 'function' && r() < .5){ var ev = eventoAtual(); p.base = ev.base; if(p.doce >= 0) p.doce = ev.doce; }   // pedido da semana
  return p;
}
function cfPaciencia(){ return Math.max(420, 900 - cf.atendidos * 45); }   // em quadros (~60/s)
function cfAbrir(){
  cfOv.hidden = false; cfOv.scrollTop = 0;
  cf = { fase:'inicio', pontos:0, vidas:3, atendidos:0, perfeitos:0, combo:0, cli:null, monta:null, t0:0, fala:'', novas:[], hearts:[], servidor:null, provaEstado:'' };
  cfUI(); if(!cfAnim) cfAnim = requestAnimationFrame(cfLoop);
}
function cfFechar(){ cfOv.hidden = true; cf = null; }
function cfNovoClienteLocal(){
  var r = hsSorteio(Date.now() + cf.atendidos * 131), livres = hsNomesLivres(), nome = livres[Math.floor(r() * livres.length)] || 'Mimi';
  var f = hsFa(r, nome); f.pedido = cfPedido(r, cf.atendidos); f.vaiRoubar = r() < .3; f.roubou = false;
  if(cf.servidor && cf.servidor.pedido) f.pedido = cf.servidor.pedido;
  cf.cli = f; cf.monta = { base:-1, cob:-1, enf:-1, doce:-1 }; cf.fase = 'pedido'; cf.t0 = cfT; cf.fala = '';
  cfUI();
}
function cfNovoCliente(){
  if(!cf) return;
  if(!contaJ || cf.provaEstado==='confirmado'){cf.servidor=null;cfNovoClienteLocal();return;}
  var atual=cf;
  cf.fase='preparando';cfUI();
  contaRpc('cafe_iniciar').then(function(r){
    if(cf!==atual)return;
    atual.servidor=r&&r.ok?r:null;
    cfNovoClienteLocal();
  }).catch(function(){if(cf===atual){atual.servidor=null;cfNovoClienteLocal();}});
}
function cfFalaPedido(p){
  var s = tr('Quero um {b}').replace('{b}', CF_BASES[p.base][0] + ' ' + tr(CF_BASES[p.base][1]));
  if(p.cob >= 0) s += ' ' + tr('com {c}').replace('{c}', CF_COBERTURAS[p.cob][0] + ' ' + tr(CF_COBERTURAS[p.cob][1]));
  s += ' ' + tr('e {e} em cima').replace('{e}', CF_ENFEITES[p.enf][0]);
  if(p.doce >= 0) s += ' + ' + CF_DOCES[p.doce][0] + ' ' + tr(CF_DOCES[p.doce][1]);
  return s + '!';
}
function cfEscolher(tipo, i){
  if(!cf || cf.fase !== 'pedido') return;
  if(tipo === 'lixo'){ cf.monta = { base:-1, cob:-1, enf:-1, doce:-1 }; cfUI(); return; }
  if(tipo !== 'doce' && tipo !== 'base' && cf.monta.base < 0) return;   // primeiro a base no copo
  cf.monta[tipo] = cf.monta[tipo] === i && tipo === 'doce' ? -1 : i;
  if(tipo === 'doce') cf.doceT = cfT;
  cf.aviso = '';
  if(sfx && sfx.card) try{ sfx.card(); }catch(e){}
  cfUI();
}
function cfServir(saiu){
  if(!cf || cf.fase !== 'pedido') return;
  var p = cf.cli.pedido, m = cf.monta, J = HS_JEITOS[cf.cli.jeito] || HS_JEITOS.fofo;
  var certo = !saiu && m.base === p.base && m.cob === p.cob && m.enf === p.enf && m.doce === p.doce;
  var resto = Math.max(0, 1 - (cfT - cf.t0) / cfPaciencia());
  cf.atendidos++;
  if(cf.servidor){
    var atual=cf, args={p_sessao:cf.servidor.sessao, p_monta:{base:m.base,cob:m.cob,enf:m.enf,doce:m.doce}};
    contaRpc('cafe_concluir',args).then(function(r){
      if(r && r.ok && r.confirmado){
        try{localStorage.setItem('tw_cf_dia',new Date(Date.now()-3*36e5).toISOString().slice(0,10));}catch(e){}
        atual.provaEstado='confirmado';
      } else atual.provaEstado='sem_comprovacao';
      if(cf===atual) cfUI();
    }).catch(function(){atual.provaEstado='pendente';if(cf===atual)cfUI();});
  }
  if(certo){
    cf.combo++; cf.perfeitos++;
    var semana = typeof eventoAtual === 'function' && p.base === eventoAtual().base;
    cf.pontos += (semana ? 50 : 0) + Math.round((100 + resto * 100 + (p.cob >= 0 ? 30 : 0) + (p.doce >= 0 ? 40 : 0)) * (1 + Math.min(cf.combo - 1, 5) * .1));
    var oks = { animado:['Que delícia! Vou postar foto! 📸', 'Perfeito!! 💖'], timido:['E-está lindo… obrigado. 🥹', 'Tão gostoso…'], fofo:['Que fofo esse copo! 💕', 'Yay! Igualzinho! ☕'] }[cf.cli.jeito] || ['Perfeito!! 💖'];
    cf.fala = tr(oks[Math.floor(Math.random() * oks.length)]);
    var rec = cfLer(CF_RECEITAS_KEY, {}), chave = p.base + '-' + p.enf;
    if(!rec[chave]){ rec[chave] = 1; cfGravar(CF_RECEITAS_KEY, rec); cf.novas.push(cfNomeReceita(p));
      if(Object.keys(rec).length >= CF_BASES.length * CF_ENFEITES.length && typeof conqGanhar === 'function' && conqGanhar('jogo_caderno')) cf.conq.push('📒 ' + tr('Caderno completo')); }
    for(var k = 0; k < 6; k++) cf.hearts.push({ x:.2 + Math.random() * .2, y:.55, v:.004 + Math.random() * .004, t:0, e:['💖', '☕', '✨'][k % 3] });
    if(sfx && sfx.star) try{ sfx.star(); }catch(e){}
  } else {
    cf.combo = 0; cf.vidas--;
    cf.fala = saiu ? tr('Demorou… volto outro dia. 😢') : tr('Hmm… não foi bem isso que eu pedi. 🥲');
    if(sfx && sfx.hit) try{ sfx.hit(); }catch(e){}
  }
  cf.ok = certo; cf.fase = 'reacao'; cf.t0 = cfT; cfUI();
}
function cfFim(){
  cf.fase = 'fim';
  if(cf.perfeitos >= 12 && typeof conqGanhar === 'function' && conqGanhar('jogo_barista')) cf.conq.push('🧋 ' + tr('Barista perfeito'));
  var rec = cfLer(CF_RECORDE_KEY, 0); cf.novoRec = cf.pontos > rec; if(cf.novoRec) cfGravar(CF_RECORDE_KEY, cf.pontos);
  cfUI();
}
function cfLoop(ms){
  cfAnim = 0; if(!twAnimacaoVisivel(cfOv)) return;
  var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('cfCv'), ms) : 1; cfT += d;
  if(cf){
    var dt = cfT - cf.t0;
    if(cf.fase === 'pedido' && cf.cli && cf.cli.vaiRoubar && !cf.cli.roubou && cf.monta.doce >= 0 && cfT - cf.doceT > 45 && typeof eventoPet === 'function' && eventoPet()){   // o pet pega o docinho!
      var pt = eventoPet(); cf.cli.roubou = true; cf.monta.doce = -1; cf.rouboT = cfT; cf.aviso = '🐾 ' + tr('{p} pegou o docinho! Coloque outro.').replace('{p}', pt.nome || tr('Seu pet')); cfUI(); }
    if(cf.fase === 'pedido'){ if(dt > cfPaciencia()) cfServir(true); var bar = $('cfPac'); if(bar) bar.style.width = Math.max(0, 100 - dt / cfPaciencia() * 100) + '%'; }
    else if(cf.fase === 'reacao' && dt > 90){ if(cf.vidas <= 0 || cf.atendidos >= 12) cfFim(); else cfNovoCliente(); }
  }
  if(Math.floor(cfT / 2) !== Math.floor((cfT - d) / 2)) cfDesenhar();
  cfAnim = requestAnimationFrame(cfLoop);
}
// Copo e itens no mesmo desenho dos personagens e roupas: formas chapadas (retângulos, elipses, triângulos)
// numa grade de unidades igual à do Idol, sem contorno, com um tom mais escuro e um mais claro.
function cfEscurece(hex, n){ return '#' + hex.replace(/^#/, '').replace(/../g, function(cc){ return ('0' + Math.max(0, Math.min(255, parseInt(cc, 16) + n)).toString(16)).substr(-2); }); }
function cfCopo(x, cx, by, m, k){   // k = tamanho de 1 unidade (o mesmo do Idol em cena)
  function E(ex, ey, rx, ry){ x.beginPath(); x.ellipse(cx + ex * k, by + ey * k, rx * k, ry * k, 0, 0, 7); x.fill(); }
  function T(a){ x.beginPath(); x.moveTo(cx + a[0] * k, by + a[1] * k); for(var i = 2; i < a.length; i += 2) x.lineTo(cx + a[i] * k, by + a[i + 1] * k); x.closePath(); x.fill(); }
  function R(rx, ry, w, h){ x.fillRect(cx + rx * k, by + ry * k, w * k, h * k); }
  x.save();
  x.fillStyle = 'rgba(30,10,60,.22)'; E(0, 0, 9, 1.6);   // sombra no balcão
  x.fillStyle = '#ff6fb5'; R(2, -30, 2, 12); R(2, -31, 5, 2);   // canudo
  x.fillStyle = 'rgba(235,245,255,.75)'; T([-7, -21, 7, -21, 5.5, 0, -5.5, 0]);   // copo
  if(m.base >= 0){ var cor = CF_BASES[m.base][2]; x.fillStyle = cor; T([-6.2, -17, 6.2, -17, 5, -1, -5, -1]); x.fillStyle = cfEscurece(cor, -40); T([2.5, -17, 6.2, -17, 5, -1, 1.8, -1]); }
  x.fillStyle = 'rgba(255,255,255,.7)'; R(-5.5, -19, 1.2, 16);   // brilho do vidro
  x.fillStyle = '#ff9ccf'; T([-6.6, -12, 6.6, -12, 6.3, -8.5, -6.3, -8.5]); x.fillStyle = '#fff'; R(-2.5, -11, 5, 1.4);   // faixa TsuLiPa
  x.fillStyle = '#ffffff'; R(-7.6, -22, 15.2, 1.6);   // borda
  var topo = -22;
  if(m.cob === 0 || m.cob === 2){ x.fillStyle = '#f1e6da'; E(0, -22, 7.5, 2.6); x.fillStyle = '#fffaf2'; E(0, -23.5, 7, 2.6); E(0, -26, 5, 2.4); E(0, -28.3, 3, 2); x.fillStyle = '#fffaf2'; T([-1, -29.5, 1, -29.5, 0, -32]); topo = -30;
    if(m.cob === 2){ [['#ff6fb5', -4, -24], ['#7b3ff0', 2, -25], ['#ffd23f', -1, -27], ['#3fc1ff', 4, -23], ['#5fd18b', -3, -26.5], ['#ff6fb5', 1, -29], ['#ffd23f', 5, -24.5], ['#3fc1ff', -5, -23]].forEach(function(p){ x.fillStyle = p[0]; R(p[1], p[2], 1.2, .6); }); } }
  else if(m.cob === 1){ x.fillStyle = '#f0a73a'; E(0, -22.5, 7.4, 2.2); R(-6, -22, 1.4, 3.5); R(-2, -22, 1.4, 5); R(3, -22, 1.4, 2.8); E(-5.3, -18.5, .7, .7); E(-1.3, -17, .7, .7); E(3.7, -19.2, .7, .7); x.fillStyle = '#ffc46b'; E(-2, -23.2, 3, .7); topo = -24; }
  // enfeite
  var ex = -1, ey = topo - 3;
  if(m.enf === 0){ x.fillStyle = '#ff4f9a'; E(ex - 1.6, ey - 1, 2, 2); E(ex + 1.6, ey - 1, 2, 2); T([ex - 3.5, ey - .3, ex + 3.5, ey - .3, ex, ey + 3.2]); x.fillStyle = '#ffb3d9'; E(ex - 2, ey - 1.6, .7, .6); }
  else if(m.enf === 1){ x.fillStyle = '#ffd23f'; var pts = []; for(var q = 0; q < 10; q++){ var an = -Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? 1.7 : 3.8; pts.push(ex + Math.cos(an) * rr, ey + Math.sin(an) * rr); } T(pts); x.fillStyle = '#fff3a6'; E(ex - .8, ey - .9, .7, .6); }
  else if(m.enf === 2){ x.fillStyle = '#5fb04a'; T([ex - 1.8, ey + 1, ex - 1, ey + 1, ex + 1.4, ey - 4.5, ex + 2, ey - 4]); T([ex + 2.4, ey + 1.2, ex + 3, ey + 1.2, ex + 2, ey - 4]); x.fillStyle = '#d6123a'; E(ex - 1.6, ey + 1.6, 1.9, 1.9); E(ex + 2.8, ey + 2, 1.9, 1.9); x.fillStyle = '#ff7a8a'; E(ex - 2.2, ey + 1, .5, .5); E(ex + 2.2, ey + 1.4, .5, .5); }
  else if(m.enf === 3){ x.fillStyle = '#e8b27a'; T([ex, ey, ex - 4.5, ey - 2.5, ex - 4.5, ey + 2.5]); T([ex, ey, ex + 4.5, ey - 2.5, ex + 4.5, ey + 2.5]); x.fillStyle = '#ff9ccf'; E(ex, ey, 1.3, 1.3); x.fillStyle = '#c98b55'; R(ex - 3.6, ey - .3, 1, .6); R(ex + 2.6, ey - .3, 1, .6); }
  // docinho no pratinho, ao lado
  if(m.doce >= 0){ var dx = 14;
    x.fillStyle = '#e9dcef'; E(dx, -.4, 7.5, 1.8); x.fillStyle = '#ffffff'; E(dx, -1, 7, 1.6);
    if(m.doce === 0){ x.fillStyle = '#c98b55'; E(dx, -3.6, 4.6, 3); x.fillStyle = '#e3a346'; E(dx, -4, 4.2, 2.6); x.fillStyle = '#5b3420'; [[-2, -4.6], [1.2, -3], [2.4, -5], [-.6, -5.6], [-2.6, -3]].forEach(function(p){ E(dx + p[0], p[1], .6, .5); }); }
    else if(m.doce === 1){ x.fillStyle = '#5b3420'; R(dx - 4, -6, 8, 4.6); x.fillStyle = '#8a5236'; R(dx - 4, -7.4, 8, 1.8); x.fillStyle = '#ff9ccf'; E(dx, -7.4, 1, .7); x.fillStyle = '#a8683f'; R(dx - 3.4, -6.9, 2, .5); }
    else if(m.doce === 2){ x.fillStyle = '#d98a2b'; E(dx - 3.4, -2.6, 2, 1.8); E(dx + 3.4, -2.6, 2, 1.8); x.fillStyle = '#e8a33c'; E(dx - 1.6, -3.6, 2.3, 2.4); E(dx + 1.6, -3.6, 2.3, 2.4); x.fillStyle = '#ffc46b'; E(dx, -4.4, 2, 2.6); x.fillStyle = '#ffe2a6'; E(dx - .6, -5.6, .8, .5); }
    else { x.fillStyle = '#d99a4e'; R(dx - 4.5, -7.6, 9, 6.2); x.fillStyle = '#ffd27a'; for(var a1 = 0; a1 < 3; a1++) for(var b1 = 0; b1 < 2; b1++) R(dx - 3.7 + a1 * 2.8, -6.8 + b1 * 2.8, 2, 2); x.fillStyle = '#fffaf2'; E(dx + 1.5, -7.6, 2, 1); x.fillStyle = '#ff6fb5'; E(dx + 1.5, -8.4, .7, .6); }
  }
  x.restore();
}
function cfDesenhar(){
  var cv = $('cfCv'); if(!cv) return;
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, t = cfT;
  // parede listrada pastel + varal de luzinhas + quadro do cardápio
  for(var i = 0; i < 16; i++){ x.fillStyle = i % 2 ? '#ffe3f1' : '#fff3f9'; x.fillRect(i * W2 / 16, 0, W2 / 16 + 1, H2); }
  x.strokeStyle = '#d9b3ff'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 18); x.quadraticCurveTo(W2 / 2, 44, W2, 18); x.stroke();
  for(var l = 0; l < 14; l++){ var lx = l * W2 / 13, ly = 18 + Math.sin(l / 13 * Math.PI) * 13; x.fillStyle = ['#ff6fb5', '#ffd23f', '#7b3ff0', '#3fc1ff'][l % 4]; x.globalAlpha = .6 + .4 * Math.sin(t / 12 + l); x.beginPath(); x.arc(lx, ly + 6, 5, 0, 7); x.fill(); }
  x.globalAlpha = 1;
  x.save(); x.fillStyle = '#4b3a63'; x.strokeStyle = '#c98b55'; x.lineWidth = 6; x.beginPath(); if(x.roundRect) x.roundRect(W2 * .6, 40, W2 * .36, 96, 10); else x.rect(W2 * .6, 40, W2 * .36, 96); x.fill(); x.stroke();
  x.fillStyle = '#fff'; x.font = '900 16px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.fillText('☕ Happy⭐Cafe!', W2 * .78, 62);
  x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#ffd1ea'; x.fillText('Shakes · Frappés · Lattes', W2 * .78, 82); x.fillStyle = '#c8e3fb'; x.fillText('Cookies · Brownies · Waffles', W2 * .78, 100);
  x.fillStyle = '#ffd23f'; x.fillText('ハッピー・カフェ', W2 * .78, 120); x.restore();
  // cliente no balcão
  var c = cf && cf.cli;
  if(c){
    var dt = t - cf.t0, entra = cf.fase === 'pedido' ? Math.min(1, dt / 14) : 1, sai = cf.fase === 'reacao' && dt > 50 ? (dt - 50) / 40 : 0;
    try{ x.save(); x.translate(-W2 * .2 + entra * W2 * .24 - sai * W2 * .5, H2 * .26); perfDesenharIdol(x, W2 * .36, H2 * .74, { c:c.c, pose:cf.fase === 'reacao' ? (cf.ok ? 'coracao' : '') : c.pose, expr:cf.fase === 'reacao' && !cf.ok ? 0 : c.expr, fundo:'' }, false, false, t); x.restore(); }catch(e){}
  }
  // balcão de madeira
  x.fillStyle = '#c98b55'; x.fillRect(0, H2 * .74, W2, H2 * .26); x.fillStyle = '#a0673a'; x.fillRect(0, H2 * .74, W2, 9); x.fillStyle = 'rgba(255,255,255,.18)'; x.fillRect(0, H2 * .74 + 9, W2, 4);
  cfDecor(x, W2, H2, H2 * .74 / 82 * 1.25, t);
  if(typeof eventoPetDesenhar === 'function'){ var rb = cf ? cfT - cf.rouboT : 999, kk = H2 * .74 / 82 * 1.25;
    eventoPetDesenhar(x, W2, H2 * .74 - 8, t, 1.1, rb < 80 ? W2 * .6 + 14 * kk + (rb > 40 ? (rb - 40) * 6 : 0) : W2 * (.74 + .06 * Math.sin(t / 120)));
    if(rb < 80){ x.save(); x.font = '20px sans-serif'; x.textAlign = 'center'; x.globalAlpha = Math.max(0, 1 - rb / 80); x.fillText('😋', W2 * .6 + 14 * kk + (rb > 40 ? (rb - 40) * 6 : 0), H2 * .74 - 52 - rb * .3); x.restore(); } }
  if(cf && cf.monta) cfCopo(x, W2 * .6, H2 * .8, cf.monta, H2 * .74 / 82 * 1.25);
  // balão do pedido / reação
  if(c && (cf.fase === 'pedido' || cf.fase === 'reacao')){
    var txt = cf.fase === 'pedido' ? cfFalaPedido(c.pedido) : cf.fala, nomeTxt = c.nome;
    x.save(); x.font = '900 17px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'left';
    var linhas = [], palavras = txt.split(' '), lin = '';
    palavras.forEach(function(pw){ var tst = lin ? lin + ' ' + pw : pw; if(x.measureText(tst).width > W2 * .5 && lin){ linhas.push(lin); lin = pw; } else lin = tst; }); if(lin) linhas.push(lin);
    var bw = W2 * .54, bh = 34 + linhas.length * 22;
    x.fillStyle = '#fff'; x.strokeStyle = cf.fase === 'reacao' ? (cf.ok ? '#3fae62' : '#e0303a') : '#ff6fb5'; x.lineWidth = 4;
    x.beginPath(); if(x.roundRect) x.roundRect(10, 50, bw, bh, 18); else x.rect(10, 50, bw, bh); x.fill(); x.stroke();
    x.fillStyle = '#d63384'; x.font = '900 13px "M PLUS Rounded 1c",sans-serif'; x.fillText(nomeTxt, 24, 70);
    x.fillStyle = '#3c2a8f'; x.font = '900 17px "M PLUS Rounded 1c",sans-serif'; linhas.forEach(function(L, i){ x.fillText(L, 24, 92 + i * 22); }); x.restore();
  }
  if(cf && cf.combo >= 2){ x.save(); x.font = '900 18px "Mochiy Pop One",sans-serif'; x.textAlign = 'right'; x.fillStyle = '#ff6fb5'; x.strokeStyle = '#fff'; x.lineWidth = 5; var ct = 'COMBO x' + cf.combo; x.strokeText(ct, W2 - 12, H2 * .7); x.fillText(ct, W2 - 12, H2 * .7); x.restore(); }
  if(cf && cf.hearts.length){ x.save(); x.font = '26px sans-serif'; x.textAlign = 'center';
    cf.hearts = cf.hearts.filter(function(h){ h.t++; h.y -= h.v; x.globalAlpha = Math.max(0, 1 - h.t / 70); x.fillText(h.e, W2 * h.x + Math.sin(h.t / 6) * 8, H2 * h.y); return h.t < 70; }); x.restore(); }
}
function cfBotoes(tipo, lista, tit){
  var m = cf.monta, trava = tipo !== 'base' && tipo !== 'doce' && m.base < 0;
  return '<div class="cfgrupo"><b>' + escHtml(tr(tit)) + '</b><div class="cfops">' + lista.map(function(o, i){
    return '<button type="button" class="cfop' + (m[tipo] === i ? ' on' : '') + '" data-cf="' + tipo + ':' + i + '"' + (trava ? ' disabled' : '') + '><span>' + o[0] + '</span><small>' + escHtml(tr(o[1])) + '</small></button>';
  }).join('') + '</div></div>';
}
function cfUI(){
  var c = $('cfCorpo'); if(!c || !cf) return;
  var rec = cfLer(CF_RECEITAS_KEY, {}), nRec = Object.keys(rec).length, totRec = CF_BASES.length * CF_ENFEITES.length;
  var h = '<div class="hsstatus"><span>⭐ ' + cf.pontos.toLocaleString('pt-BR') + '</span><span>' + '❤️'.repeat(Math.max(0, cf.vidas)) + '🤍'.repeat(Math.max(0, 3 - cf.vidas)) + '</span><span>☕ ' + cf.atendidos + '/12</span><span>🏆 ' + cfLer(CF_RECORDE_KEY, 0).toLocaleString('pt-BR') + '</span></div>';
  if(cf.fase === 'preparando') h += '<p class="hsdica">⏳ ' + escHtml(tr('Preparando o pedido validado…')) + '</p>';
  if(cf.fase === 'inicio') h += '<p class="hsdica">' + escHtml(tr('Os fãs chegam ao balcão do café do grupo. Monte a bebida na ordem (base, cobertura e enfeite), junte o docinho se pedirem e sirva antes da paciência acabar!')) + '</p>' +
    '<p class="hsdica">📒 ' + escHtml(tr('Cada pedido perfeito guarda uma receita no Caderno do café:')) + ' <b>' + nRec + '/' + totRec + '</b></p>' +
    (typeof eventoAtual === 'function' ? '<p class="hsdica evsemana">' + eventoAtual().emo + ' <b>' + escHtml(tr(eventoAtual().nome)) + '</b>: ' + escHtml(tr('pedidos de {b} valem +50!').replace('{b}', CF_BASES[eventoAtual().base][0] + ' ' + tr(CF_BASES[eventoAtual().base][1]))) + '</p>' : '') +
    '<div class="btns"><button type="button" class="btn" id="cfJogar">☕ ' + escHtml(tr('Abrir o café')) + '</button></div>';
  else if(cf.fase === 'pedido' || cf.fase === 'reacao'){
    if(cf.aviso) h += '<p class="cfaviso">' + escHtml(cf.aviso) + '</p>';
    h += '<div class="hstempo"><i id="cfPac" style="width:100%"></i></div>' +
      cfBotoes('base', CF_BASES, '1. Base') + cfBotoes('cob', CF_COBERTURAS, '2. Cobertura (se pedir)') + cfBotoes('enf', CF_ENFEITES, '3. Enfeite') + cfBotoes('doce', CF_DOCES, 'Docinho (se pedir)') +
      '<div class="btns cfacoes"><button type="button" class="btn sec" data-cf="lixo:0">🗑️ ' + escHtml(tr('Recomeçar copo')) + '</button><button type="button" class="btn" id="cfServir"' + (cf.monta.base < 0 || cf.monta.enf < 0 || cf.fase !== 'pedido' ? ' disabled' : '') + '>🛎️ ' + escHtml(tr('Servir')) + '</button></div>';
  }
  else if(cf.fase === 'fim'){
    h += '<p class="hsfim">' + (cf.novoRec ? '🏆 ' + escHtml(tr('Novo recorde!')) + ' ' : '') + escHtml(tr('O café fechou!')) + ' <b>' + cf.pontos.toLocaleString('pt-BR') + '</b> ' + escHtml(tr('pts')) + '</p>' +
      '<div class="hsresumo"><span>☕ ' + cf.perfeitos + '/' + cf.atendidos + ' ' + escHtml(tr('perfeitos')) + '</span><span>📒 ' + nRec + '/' + totRec + '</span></div>';
    if(cf.provaEstado==='confirmado') h += '<p class="faok">✅ ' + escHtml(tr('Pedido confirmado no servidor para a missão do dia.')) + '</p>';
    else if(cf.provaEstado==='pendente') h += '<p class="hsdica">⏳ ' + escHtml(tr('Não foi possível confirmar a missão. Tente outra partida com internet.')) + '</p>';
    else if(cf.perfeitos>0 && !cf.servidor) h += '<p class="hsdica">🔒 ' + escHtml(tr('Modo treino: pedido sem validação do servidor.')) + '</p>';
    if(cf.conq.length) h += '<p class="faok">🏆 ' + escHtml(tr('Insígnia nova na Estante de troféus:')) + ' ' + cf.conq.map(escHtml).join(' · ') + '</p>';
    if(cf.novas.length) h += '<p class="faok">📒 ' + escHtml(tr('Receitas novas no Caderno:')) + ' ' + cf.novas.map(escHtml).join(' · ') + '</p>';
    h += cfCaderno(rec) + '<div class="btns"><button type="button" class="btn" id="cfJogar">🔁 ' + escHtml(tr('Jogar de novo')) + '</button></div>';
  }
  c.innerHTML = h;
}
function cfCaderno(rec){
  var h = '<div class="cfcaderno"><b>📒 ' + escHtml(tr('Caderno do café')) + '</b><div class="cfrecs">';
  CF_BASES.forEach(function(b, bi){ CF_ENFEITES.forEach(function(e, ei){ var tem = rec[bi + '-' + ei];
    h += '<span class="cfrec' + (tem ? '' : ' vazio') + '" title="' + (tem ? escHtml(tr(b[1])) : '?') + '">' + (tem ? b[0] + e[0] : '❔') + '</span>'; }); });
  return h + '</div></div>';
}
function cfIniciarSeguro(){
  cf={fase:'inicio',pontos:0,vidas:3,atendidos:0,perfeitos:0,combo:0,cli:null,monta:null,t0:cfT,fala:'',novas:[],hearts:[],servidor:null,provaEstado:''};
  cfNovoCliente();
}
function cfClique(e){
  var b = e.target.closest && e.target.closest('[data-cf]');
  if(b){ var p = b.dataset.cf.split(':'); cfEscolher(p[0], +p[1]); return; }
  if(e.target.closest && e.target.closest('#cfServir')){ cfServir(false); return; }
  if(e.target.closest && e.target.closest('#cfJogar')){ cfIniciarSeguro(); }
}
function cfHubHtml(){
  var feito = false; try{ feito = localStorage.getItem('tw_cf_dia') === new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }catch(e){}
  return '<button type="button" class="hubcard hubcafe' + (feito ? '' : ' tw-alert-pink') + '" data-ir="cafe">' + (feito ? '' : '<em class="hubalerta" aria-hidden="true">!</em>') + '<i>🧋</i><b translate="no">Happy⭐Cafe!</b><small class="tw-hubgame-jp" lang="ja">ハッピー・カフェ</small><small>' + escHtml(tr('Monte shakes e frappés para os fãs!')) + '</small></button>';
}



// Decoração do café no mesmo desenho chapado: prateleira com canecas, potinho de gorjeta com estrelas e moedas,
// vasinho, lightstick, toalhinha rendada e adesivos no balcão
function cfDecor(x, W2, H2, k, t){
  function E(cx, cy, rx, ry){ x.beginPath(); x.ellipse(cx, cy, rx * k, ry * k, 0, 0, 7); x.fill(); }
  function R(rx, ry, w, h){ x.fillRect(rx, ry, w * k, h * k); }
  function Est(cx, cy, r, cor){ x.fillStyle = cor; x.beginPath(); for(var q = 0; q < 10; q++){ var an = -Math.PI / 2 + q * Math.PI / 5, rr = q % 2 ? r * .45 : r; x.lineTo(cx + Math.cos(an) * rr * k, cy + Math.sin(an) * rr * k); } x.closePath(); x.fill(); }
  function Cor(cx, cy, r, cor){ x.fillStyle = cor; E(cx - r * .45 * k, cy - r * .2 * k, r * .55, r * .55); E(cx + r * .45 * k, cy - r * .2 * k, r * .55, r * .55); x.beginPath(); x.moveTo(cx - r * k, cy); x.lineTo(cx + r * k, cy); x.lineTo(cx, cy + r * 1.05 * k); x.closePath(); x.fill(); }
  var topo = H2 * .74;
  x.save();
  // prateleira sob o quadro: canecas TsuLiPa, bolo na boleira e porta-retrato
  var sy = 172, sx = W2 * .7, sw = W2 * .27;
  x.fillStyle = '#a0673a'; x.fillRect(sx, sy, sw, 4); x.fillStyle = '#c98b55'; x.fillRect(sx, sy - 2, sw, 3);
  [['#ffd1ea', 0], ['#c8e3fb', 1], ['#cdeec6', 2]].forEach(function(c){ var mx = sx + 6 + c[1] * 7 * k; x.fillStyle = c[0]; x.fillRect(mx, sy - 6 * k, 5 * k, 6 * k); x.fillStyle = cfEscurece(c[0], -45); x.fillRect(mx + 5 * k, sy - 4.6 * k, 1.4 * k, 3 * k); Cor(mx + 2.5 * k, sy - 3.6 * k, 1, '#ff6fb5'); });
  var bx = sx + sw * .66; x.fillStyle = '#e9dcef'; x.fillRect(bx - 1, sy - 2 * k, 2, 2 * k); E(bx, sy - 2 * k, 5, 1); x.fillStyle = '#ffb3d9'; x.fillRect(bx - 4 * k, sy - 6.5 * k, 8 * k, 4.4 * k); x.fillStyle = '#fffaf2'; x.fillRect(bx - 4 * k, sy - 7 * k, 8 * k, 1.4 * k); x.fillStyle = '#d6123a'; E(bx, sy - 7.8 * k, .9, .9);
  var fx = sx + sw * .9; x.fillStyle = '#fff'; x.fillRect(fx - 4 * k, sy - 9 * k, 8 * k, 9 * k); x.fillStyle = '#c8b6ff'; x.fillRect(fx - 3 * k, sy - 8 * k, 6 * k, 6 * k); Est(fx, sy - 5 * k, 2, '#ffd23f');
  // toalhinha rendada na frente do balcão + adesivos
  for(var i = 0; i < 26; i++){ x.fillStyle = i % 2 ? '#ffd1ea' : '#fff3f9'; E(i * W2 / 25, topo + 12, 2.6, 1.8); }
  Cor(W2 * .1, topo + 34, 3, 'rgba(255,111,181,.75)'); Est(W2 * .3, topo + 40, 3.2, 'rgba(255,210,63,.85)'); Cor(W2 * .5, topo + 46, 2.4, 'rgba(200,182,255,.9)');
  Est(W2 * .72, topo + 44, 2.6, 'rgba(255,255,255,.75)'); Cor(W2 * .92, topo + 38, 3, 'rgba(255,111,181,.75)');
  // potinho de gorjetas: vidro com estrelas e moedas (cintilam)
  var px = W2 * .84, pb = topo + 2;
  x.fillStyle = 'rgba(30,10,60,.18)'; E(px, pb, 6, 1.2);
  x.fillStyle = 'rgba(235,245,255,.7)'; x.fillRect(px - 5 * k, pb - 11 * k, 10 * k, 11 * k);
  x.fillStyle = '#ffc21a'; [[-2.5, -1.5], [1.5, -1.3], [-.5, -3.2], [3, -3.6], [-3, -4.4]].forEach(function(p){ E(px + p[0] * k, pb + p[1] * k, 1.5, 1); });
  x.fillStyle = '#ffe680'; E(px - .5 * k, pb - 3.4 * k, .7, .4);
  Est(px - 1.5 * k, pb - 7 * k, 2, '#ffd23f'); Est(px + 2.3 * k, pb - 6 * k, 1.6, '#ff9ccf'); Est(px + .5 * k, pb - 9.2 * k, 1.4, '#c8b6ff');
  x.fillStyle = 'rgba(255,255,255,.75)'; x.fillRect(px - 4 * k, pb - 10 * k, 1 * k, 8 * k);
  x.fillStyle = '#ff6fb5'; x.fillRect(px - 6 * k, pb - 12.4 * k, 12 * k, 1.6 * k);   // tampinha
  x.fillStyle = '#fff'; x.fillRect(px - 3.6 * k, pb - 16.6 * k, 7.2 * k, 3.6 * k); x.fillStyle = '#ff6fb5'; Cor(px, pb - 15.6 * k, 1.1, '#ff6fb5');   // plaquinha
  var brilho = (Math.sin(t / 14) + 1) / 2; x.globalAlpha = brilho; Est(px + 4.5 * k, pb - 12 * k, 1.2, '#ffffff'); x.globalAlpha = 1;
  // vasinho com flor
  var vx = W2 * .955; x.fillStyle = '#5fb04a'; x.fillRect(vx - .5 * k, pb - 12 * k, 1 * k, 7 * k); E(vx - 2 * k, pb - 9 * k, 2, 1); E(vx + 2 * k, pb - 8 * k, 2, 1);
  x.fillStyle = '#ffb3d9'; [[0, -14], [-1.8, -12.6], [1.8, -12.6], [-1.1, -10.8], [1.1, -10.8]].forEach(function(p){ E(vx + p[0] * k, pb + p[1] * k, 1.4, 1.4); }); x.fillStyle = '#ffd23f'; E(vx, pb - 12.4 * k, .9, .9);
  x.fillStyle = '#c98b55'; x.fillRect(vx - 3 * k, pb - 5 * k, 6 * k, 5 * k); x.fillStyle = '#e0a370'; x.fillRect(vx - 3.6 * k, pb - 5.6 * k, 7.2 * k, 1.6 * k);
  // lightstick do fã-clube apoiado no balcão
  var lx = W2 * .43; x.fillStyle = '#4b3a63'; x.fillRect(lx - .8 * k, pb - 8 * k, 1.6 * k, 8 * k); x.fillStyle = 'rgba(255,111,181,' + (.6 + .4 * brilho) + ')'; E(lx, pb - 10.5 * k, 2.6, 3); x.fillStyle = '#fff'; Est(lx, pb - 10.6 * k, 1.3, '#ffffff');
  x.restore();
}
