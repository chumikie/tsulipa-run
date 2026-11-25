/* Moon⭐Duo! — a parte que o resto do site usa desde a abertura (17/11/2026): estado do Duo, falas (Encontro do dia),
   fundo dos cenários (Perfil e Idol⭐News!), aviso de dupla (conta.js), recado das estrelas (hub.js) e a lojinha
   (Perfil, Loja e Photo⭐Studio!). O jogo em si (desenho da cena, telas, abas e Pedido de cena do dia) está em duo.js,
   duo-tela.js e duo-pedido.js, que só baixam quando o Duo abre. Código igual; só mudou de arquivo. */

var DUO_FALAS = [   // falas do convidado quando a pessoa toca nele (todas unissex)
  'Você brilha muito no palco! ✨', 'Força! Eu acredito em você 💪', 'Obrigado por ser meu duo! 🌙', 'Vamos ser Center juntos! ⭐',
  'Seu sorriso me dá energia! 😊', 'Hoje vai dar tudo certo! 🍀', 'Bora ensaiar mais um pouquinho? 🎶', 'Tô muito feliz de estar aqui com você! 💖',
  'Você é incrível do jeitinho que é! 🌈', 'Respira fundo... você consegue! 🫶', 'Que dupla mais fofa a nossa! 🎀', 'Ganbatte! がんばって！ 💜',
  'Cada ensaio te deixa mais forte! 🔥', 'Você merece todos os aplausos! 👏', 'Vamos fazer história no BRS48! 🎤', 'Conta comigo sempre! 🤝'
];
var duoGu = null, duoCena = 'dueto', duoFundo = 'basico', duoExEu = '', duoExGu = '', duoT = 0, duoAnim = 0, duoVeioHub = false;
function duoFundoDesenhar(x, W2, H2, f, t, corOshi){
  if(f === 'cafe'){   // café kawaii: parede listrada, janela, prateleira com xícaras e balcão
    var u = W2 / 320, i, gr = x.createLinearGradient(0, 0, 0, H2); gr.addColorStop(0, '#ffe9f3'); gr.addColorStop(1, '#fff6e8'); x.fillStyle = gr; x.fillRect(0, 0, W2, H2);
    x.fillStyle = 'rgba(255,156,205,.22)'; for(i = 0; i < 20; i++) x.fillRect(i * 18 * u, 0, 9 * u, H2 * .7);
    x.fillStyle = '#bfe9ff'; x.fillRect(W2 * .62, H2 * .1, 90 * u, 70 * u); x.fillStyle = '#fff'; x.fillRect(W2 * .62 + 43 * u, H2 * .1, 4 * u, 70 * u); x.fillRect(W2 * .62, H2 * .1 + 33 * u, 90 * u, 4 * u);
    x.strokeStyle = '#d9a7c7'; x.lineWidth = 3 * u; x.strokeRect(W2 * .62, H2 * .1, 90 * u, 70 * u);
    x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.arc(W2 * .62 + 22 * u + Math.sin(t * .01) * 4 * u, H2 * .1 + 18 * u, 7 * u, 0, 7); x.arc(W2 * .62 + 30 * u + Math.sin(t * .01) * 4 * u, H2 * .1 + 16 * u, 8 * u, 0, 7); x.fill();
    x.fillStyle = '#c98b55'; x.fillRect(W2 * .08, H2 * .28, 90 * u, 5 * u);
    ['#ff6fb5', '#4dd8ff', '#b6ff3b', '#ffe14d'].forEach(function(cc, j){ var cx = W2 * .08 + (12 + j * 22) * u, cy = H2 * .28; x.fillStyle = cc; x.fillRect(cx, cy - 12 * u, 12 * u, 12 * u); x.strokeStyle = cc; x.lineWidth = 2 * u; x.beginPath(); x.arc(cx + 13 * u, cy - 6 * u, 3.5 * u, -1.4, 1.4); x.stroke(); });
    [W2 * .3, W2 * .5].forEach(function(lx, j){ x.strokeStyle = '#8a6a7a'; x.lineWidth = 1.5 * u; x.beginPath(); x.moveTo(lx, 0); x.lineTo(lx, H2 * .14); x.stroke(); x.fillStyle = j ? '#ffe14d' : '#ff9ccd'; x.beginPath(); x.arc(lx, H2 * .16, 9 * u, Math.PI, 0); x.fill();
      var lg = x.createRadialGradient(lx, H2 * .18, 2, lx, H2 * .18, 50 * u); lg.addColorStop(0, 'rgba(255,240,180,.45)'); lg.addColorStop(1, 'rgba(255,240,180,0)'); x.fillStyle = lg; x.fillRect(lx - 50 * u, H2 * .16, 100 * u, 80 * u); });
    x.fillStyle = '#f3d3b8'; x.fillRect(0, H2 * .72, W2, H2 * .28);
    x.fillStyle = 'rgba(201,139,85,.25)'; for(i = 0; i < 16; i++) for(var j = 0; j < 4; j++) if((i + j) % 2) x.fillRect(i * 20 * u, H2 * .72 + j * 20 * u, 20 * u, 20 * u);
    perfEnfeites(x, W2, H2 * .7, ['#ff9ccd', '#ffd36b', '#c4a5ff'], 10, 7, t, .6);
    return;
  }
  if(TEMA_INFO[f]){ temaFundo(x, W2, H2, f, t); return; }
  perfFundo(x, W2, H2, f, corOshi || '#ff6fb5', t);
}
function lookSemRank(av){ av = JSON.parse(JSON.stringify(av || {})); if(typeof av.visual === 'string' && PERF_RANKVIS[av.visual]) av.visual = ''; return av; }   // a roupa de rank cobriria o look
function lookAtual(){ var vis = perfMeuAv && typeof perfMeuAv.visual === 'string' ? perfMeuAv.visual : ''; return lookSemRank(perfAvAtual({ visual: vis })); }
function duoMsgTxt(m){   // presentes do Moon⭐Duo! chegam como "duo:🧸:Nick"
  var p = /^duo:([^:]+):(.+)$/.exec(String(m || ''));
  return p ? p[1] + ' ' + tr('{nick} te mandou um presente pelo Moon⭐Duo!').replace('{nick}', p[2]) : m;
}
function duoTemaK(k){ return TEMA_INFO[k] && k !== 'halloween' ? k : ''; }
function lojaItem(k){
  k = String(k); var i;
  for(i = 0; i < LOJA_EXTRA.length; i++) if(LOJA_EXTRA[i][0] === k) return LOJA_EXTRA[i];
  if(/^tema_/.test(k) && duoTemaK(k.slice(5))){ var ti = TEMA_INFO[k.slice(5)]; return [k, ti[0], ti[1], DUO_TEMA_PRECO, 'tema']; }
  if(/^pose_/.test(k)){ var p = perfPoseInfo(k.slice(5)); if(p && p[3]) return [k, p[1], p[2], p[3], 'pose']; }
  if(/^fundo_/.test(k)){ for(i = 0; i < PERF_FUNDOS.length; i++) if(PERF_FUNDOS[i][0] === k.slice(6) && PERF_FUNDOS[i][3]) return [k, PERF_FUNDOS[i][1], PERF_FUNDOS[i][2], PERF_FUNDOS[i][3], 'fundo']; }
  return null;
}
function lojaTem(k){ return !lojaItem(k) || (Array.isArray(perfDono) && perfDono.indexOf(String(k)) >= 0); }
function perfLoja2UI(){
  acessoriosSync();
  var box = $('perfLoja2'), boxAcc = $('perfLojaAcessorios'), boxItens=$('perfLojaItens'); if(!box||!boxAcc||!boxItens) return;
  var L = PERF_POSES.filter(function(o){ return o[3]; }).map(function(o){ return ['pose_' + o[0], o[1], o[2], o[3], 'pose']; }).concat(LOJA_EXTRA);
  function cards(lista){return lista.map(function(it){
    var dono = lojaTem(it[0]);
    var prev = it[4] === 'duo' ? '<i class="lojaemo" aria-hidden="true">' + it[1] + '</i>' : '<canvas width="160" height="160" data-l2="' + it[0] + '"></canvas>';
    var tipo = it[4] === 'pose' ? tr('Pose') : it[4] === 'expr' ? tr('Expressão') : it[4] === 'acc' ? tr('Acessório') : it[4] === 'item' ? tr('Item') : 'Moon⭐Duo!';
    return '<div class="perfroupa">' + prev + '<b>' + it[1] + ' ' + escHtml(tr(it[2])) + '</b><small class="perftemp" translate="no">' + escHtml(tipo) + '</small>' +
      (dono ? '<em class="ok">✓ ' + escHtml(tr('Seu')) + '</em>' : '<button type="button" class="btn" data-comprar2="' + it[0] + '"' + (starT < it[3] ? ' disabled' : '') + '>★' + it[3] + '</button>') + '</div>';
  }).join('');}
  [box,boxAcc,boxItens].forEach(perfMiniaturasLiberar);
  boxAcc.innerHTML=cards(L.filter(function(it){return it[4]==='acc';}));
  boxItens.innerHTML=cards(L.filter(function(it){return it[4]==='item';}));
  box.innerHTML=cards(L.filter(function(it){return it[4]!=='acc'&&it[4]!=='item';}));
  [].forEach.call(document.querySelectorAll('#perfLoja2 canvas[data-l2], #perfLojaAcessorios canvas[data-l2], #perfLojaItens canvas[data-l2]'), function(cv){
    perfMiniaturaLoja(cv,function(){
    var k = cv.dataset.l2, av = perfAvAtual({ pose: /^pose_/.test(k) ? k.slice(5) : '', expr: /^expr_/.test(k) ? +k.slice(5) : 2, fundo: 'basico' });
    if(/^det_(coelho|tulipa|torrada)$/.test(k)){ av.c.det = k.slice(4); av.pose = 'v'; }
    if(k==='hat_palha'){ av.c.hat='palha'; av.pose='v'; }
    av.pose = /^pose_/.test(k) ? k.slice(5) : ''; av.expr = /^expr_/.test(k) ? +k.slice(5) : 2;
    try{ perfDesenharIdol(cv.getContext('2d'), 160, 160, av, true, /^expr_/.test(k), 0); }catch(e){}
    });
  });
}
function lojaComprar(k, btn, depois){
  btn.disabled = true;
  return contaRpc('comprar_visual', { p_key: k }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); }
    if(!r || !r.ok){ btn.disabled = false; if(sfx.hit) sfx.hit(); depois(false, tr(r && r.erro === 'saldo' ? 'Estrelas insuficientes' : r && r.erro === 'temporada' ? 'Só dá para guardar durante a temporada do tema.' : 'Não deu para falar com o servidor. Tente de novo.')); return; }
    perfDono = Array.isArray(r.visuais) ? r.visuais : perfDono.concat(k);
    if(sfx.rank) sfx.rank(); if(typeof insConferir === 'function') insConferir();
    depois(true, '✨ ' + tr('Comprado!'));
  }).catch(function(){ btn.disabled = false; depois(false, tr('Não deu para falar com o servidor. Tente de novo.')); });
}
var duoAvisoNick = '', duoAvisoFeito = false, duoAvisoTimer = 0;
function duoAvisoAgendar(){
  if(!contaJ||duoAvisoFeito||duoAvisoTimer)return;
  duoAvisoTimer=setTimeout(function(){
    duoAvisoTimer=0;
    if(!contaJ||duoAvisoFeito)return;
    duoAvisoFeito=true;
    duoAvisosConferir();
  },3000);
}
function duoAvisosConferir(){
  if(!contaJ) return;
  contaRpc('duo_avisos_pendentes').then(function(L){
    if(!Array.isArray(L) || !L.length) return;
    duoAvisoNick = L[0].nick;
    var txt = tr('{nick} encontrou você no Moon⭐Duo! e fez uma cena com você 🌙').replace('{nick}', L[0].nick);
    if(L.length === 2) txt += ' ' + tr('(e mais 1 pessoa!)'); else if(L.length > 2) txt += ' ' + tr('(e mais {n} pessoas!)').replace('{n}', L.length - 1);
    $('duoAvisoTxt').textContent = txt;
    $('duoAvisoIr').textContent = '🌙 ' + tr('Fazer um Moon⭐Duo! com {nick}').replace('{nick}', L[0].nick);
    $('duoAvisoOk').textContent = tr('Fechar');
    duoAvisoOv.hidden = false; [784, 1047, 1319].forEach(function(f, i){ beep(f, .12, 'triangle', .035, i * .1); });
  }).catch(function(){});
}

/* ---------- o jogo baixa quando o Duo abre ---------- */
var duoJogoPronto = false, duoJogoFila = [], duoJogoPedido = false;
function duoJogoCarregar(depois){
  if(duoJogoPronto){ if(depois) depois(); return; }
  if(depois) duoJogoFila.push(depois);
  if(duoJogoPedido) return; duoJogoPedido = true;
  // duo.js redeclara duoFechar; o index.html já embrulhou o duoFechar desta página (música), então guardamos o embrulho
  var embrulho = window.duoFechar, arqs = ['./duo.js?v=16', './duo-tela.js?v=9', './duo-pedido.js?v=4'], i = 0;
  (function proximo(){
    if(i >= arqs.length){
      if(window.duoFechar !== embrulho){ duoFecharJogo = window.duoFechar; window.duoFechar = embrulho; }
      duoJogoPronto = true; var f = duoJogoFila.splice(0); f.forEach(function(fn){ try{ fn(); }catch(e){ if(window.console) console.error(e); } }); return;
    }
    var s = document.createElement('script'); s.src = arqs[i++]; s.async = false;
    s.onload = proximo; s.onerror = function(){ duoJogoPedido = false; duoJogoFila.length = 0; };
    document.body.appendChild(s);
  })();
}
// Até o jogo chegar: abrir pede o jogo e abre em seguida; fechar e o laço não têm o que fazer.
var duoFecharJogo = null;
function duoAbrir(){ var a = arguments; duoJogoCarregar(function(){ window.duoAbrir.apply(window, a); }); }
function duoFechar(){ if(duoFecharJogo) return duoFecharJogo.apply(this, arguments); }
function duoLoop(){}

