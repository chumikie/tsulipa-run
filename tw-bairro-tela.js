/* Vida no bairro — a parte de tela (painel, cena da bagunça, toast e pergunta do guia no Mapa).
   Saiu do tw-bairro.js em 17/11/2026 e baixa só quando o painel ou o Mapa abre; o núcleo (contagem, "Hoje", Chat) segue no
   tw-bairro.js desde a abertura. O código é o mesmo; o que vem do núcleo chega por TW_BAIRRO._k. */
(function(){
  'use strict';
  var B = window.TW_BAIRRO; if(!B || !B._k || !B._tela) return;
  var K = B._k, resolver = K.resolver, pularGuia = K.pularGuia, ler = K.ler, RUAS = K.RUAS, esc = K.esc, t = K.t, JOGO_NOME = K.JOGO_NOME, guia = K.guia, bagunca = K.bagunca, ruaNome = K.ruaNome, gestoNome = K.gestoNome, vr = K.vr, jogosTxt = K.jogosTxt, baguncaPassada = K.baguncaPassada, gestosAprendidos = K.gestosAprendidos, ORDEM = K.ORDEM, bico = K.bico, NIVEIS = K.NIVEIS, BICOS = K.BICOS, bicoNome = K.bicoNome, POR_DIA = K.POR_DIA, sabeGesto = K.sabeGesto, premioTxt = K.premioTxt, ruaAberta = K.ruaAberta;
  /* ---------- tela (janela no padrão das outras) ---------- */
  var ov = null;
  function estilo(){
    if(document.getElementById('twBairroCss')) return;
    var s = document.createElement('style'); s.id = 'twBairroCss';
    s.textContent =
      '.twbov{z-index:22}.twbp{max-width:760px}.twbp h2{margin:0}.twb-sub{display:block;text-align:center;font-size:.86rem;opacity:.8;margin:2px 0 10px}' +
      '.twb-box{background:rgba(255,255,255,.72);border:1.5px solid rgba(155,48,217,.18);border-radius:18px;padding:12px 14px;margin:10px 0;text-align:left}' +
      'html.dark .twb-box,body.dark .twb-box{background:rgba(40,24,70,.72);border-color:rgba(255,255,255,.14)}' +
      '.twb-box h3{margin:0 0 8px;font-size:1rem;display:flex;gap:6px;align-items:center}' +
      '.twb-bag{display:grid;grid-template-columns:minmax(0,1fr);gap:8px}.twb-bag canvas{width:100%;height:auto;border-radius:14px;display:block}' +
      '.twb-bag p{margin:0;font-size:.92rem;line-height:1.35}.twb-bag .twb-ok{font-weight:800;color:#2fb36b}' +
      '.twb-bt{border:0;border-radius:999px;padding:9px 16px;font:inherit;font-weight:800;background:linear-gradient(135deg,#9b30d9,#ff4fa3);color:#fff;cursor:pointer;justify-self:start}' +
      '.twb-bt[disabled]{opacity:.45;cursor:default}.twb-bt.twb-bt-falta{opacity:1;background:#f1ebff;color:#6b3fc4;border:1.5px dashed rgba(123,63,240,.45);box-shadow:none}' + '.twb-bt-claro{background:#fff;color:#7a2bbf;border:1.5px solid rgba(155,48,217,.3)}' +
      '.twb-ruas{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px}' +
      '.twb-rua{border-radius:16px;padding:10px 12px;background:#fff;border:1.5px solid var(--twb-c);position:relative}' +
      'html.dark .twb-rua,body.dark .twb-rua{background:rgba(255,255,255,.06)}' +
      '.twb-rua.twb-off{opacity:.55}.twb-rua b{display:block;font-size:.95rem}.twb-rua small{display:block;font-size:.78rem;opacity:.8;line-height:1.3}' +
      '.twb-niv{display:flex;gap:4px;margin:6px 0 4px}.twb-niv i{width:22px;height:8px;border-radius:4px;background:rgba(0,0,0,.1)}.twb-niv i.on{background:var(--twb-c)}' +
      '.twb-barra{height:6px;border-radius:3px;background:rgba(0,0,0,.08);overflow:hidden;margin:4px 0}.twb-barra i{display:block;height:100%;background:var(--twb-c)}' +
      '.twb-pr{display:flex;flex-wrap:wrap;gap:4px;margin:6px 0}.twb-pr span{font-size:.72rem;border-radius:999px;padding:2px 8px;background:rgba(0,0,0,.05)}.twb-pr span.on{background:var(--twb-c);color:#fff}' +
      '.twb-rua .twb-bt{padding:6px 12px;font-size:.82rem;margin-top:4px}' +
      '.twb-gestos{display:flex;flex-wrap:wrap;gap:6px}.twb-gestos span{border-radius:999px;padding:4px 10px;background:rgba(155,48,217,.1);font-size:.85rem;font-weight:700}' +
      '.twb-guia{display:flex;gap:10px;align-items:center;flex-wrap:wrap}.twb-guia p{margin:0;flex:1 1 220px;font-size:.9rem}' +
      '.twb-regra{font-size:.76rem;opacity:.7;text-align:center;margin:8px 0 0}' +
      '.twb-pergunta{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:100000;background:#fff;color:#3a1a5c;border-radius:18px;padding:14px 16px;box-shadow:0 10px 30px rgba(60,20,110,.3);max-width:min(92vw,420px);text-align:center}' +
      '.twb-pergunta p{margin:0 0 10px;font-weight:700}.twb-pergunta div{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}' +
      '.petphone-chat-contato{position:relative}.petphone-chat-contato>.petphone-badge{top:50%;right:30px;left:auto;transform:translateY(-50%)}' +
      '.twc-hj-bico{display:block;font-size:.74rem;opacity:.78;margin-top:2px}' +
      '[data-tw-bairro].twb-guia-off{opacity:.5}[data-tw-bairro] .twb-breve{font-size:.68em;margin-left:4px;opacity:.85}';
    document.head.appendChild(s);
  }
  function montar(){
    if(ov) return; estilo();
    ov = document.createElement('div'); ov.className = 'ov twbov tw-window-overlay'; ov.id = 'twBairroOv'; ov.hidden = true;
    ov.innerHTML = '<div class="panel twbp tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="twBairroTit">' +
      '<button type="button" class="perfx tw-window-control tw-window-close" data-twb="fechar" aria-label="✕">✕</button>' +
      '<h2 class="tw-modal-title" id="twBairroTit"></h2><small class="tw-modal-jp" lang="ja">まちのくらし</small><span class="twb-sub" id="twBairroSub"></span>' +
      '<div id="twBairroCorpo"></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){
      if(e.target === ov){ fechar(); return; }
      var b = e.target.closest && e.target.closest('[data-twb]'); if(!b) return;
      var a = b.getAttribute('data-twb');
      if(a === 'fechar') fechar();
      else if(a === 'resolver'){ if(resolver()) ui(); }
      else if(a === 'pular'){ pularGuia(); ui(); }
      else if(a === 'jogar') jogar(b.getAttribute('data-j'));
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov && !ov.hidden) fechar(); });
  }
  function abrir(origem){
    montar(); ler(); ui();
    if(window.TW_JANELAS) TW_JANELAS.preparar(ov,origem);
    ov.hidden = false;
  }
  function fechar(){ if(ov) ov.hidden = true; }
  function acaoCelular(a){   // pede uma ação ao visual novo (mesmo caminho dos botões dele)
    var cel = document.getElementById('twCel'); if(!cel) return false;
    var b = document.createElement('button'); b.type = 'button'; b.hidden = true; b.setAttribute('data-a', a); cel.appendChild(b);
    try{ b.click(); } finally { b.remove(); } return true;
  }
  function jogar(j){
    fechar();
    if(j === 'mapa'){ if(!acaoCelular('mapa')){ var m = document.querySelector('.tw-mapa'); if(m && m.scrollIntoView) m.scrollIntoView({behavior:'smooth'}); } return; }
    if(j === 'bloom' && typeof window.bloomAbrir === 'function') return window.bloomAbrir();
    if(j === 'battle' && typeof window.battleAbrir === 'function') return window.battleAbrir();
    if(j === 'studio' && typeof window.studioAbrir === 'function') return window.studioAbrir();
    var c = document.querySelector('#hubCards [data-ir="' + j + '"]'); if(c && !c.disabled) c.click();
  }
  function botaoJogo(r){
    var j = r === 'praca' ? 'mapa' : RUAS[r].jogos.filter(function(k){
      return k === 'bloom' || k === 'battle' || k === 'studio' || !!document.querySelector('#hubCards [data-ir="' + k + '"]'); })[0];
    return j ? '<button type="button" class="twb-bt" data-twb="jogar" data-j="' + esc(j) + '">' + esc(r === 'praca' ? t('passear') : t('jogar') + ' · ' + (JOGO_NOME[j] || j)) + '</button>' : '';
  }
  function ui(){
    if(!ov) return; ler();
    ov.querySelector('#twBairroTit').textContent = t('tit');
    ov.querySelector('#twBairroSub').textContent = t('sub');
    var g = guia(), b = bagunca(), h = window.TW_PILOTO_BAIRRO ? TW_PILOTO_BAIRRO.rua() : '';
    var guiaH = '';   // 17/11: a bagunça (a cena) vem primeiro; o guia dos primeiros dias depois
    if(g.ativo) guiaH = '<section class="twb-box twb-guia"><p><b>' + esc(t('guiaTit', {d:g.dia})) + '</b><br>' +
      esc(t('guiaTxt', {r:(g.amanha.length ? g.amanha.map(ruaNome).join(' + ') : '—')})) + '</p><button type="button" class="twb-bt twb-bt-claro" data-twb="pular">' + esc(t('pular')) + '</button></section>';
    h += '<section class="twb-box twb-bag"><h3>' + esc(t('bagTit')) + ' · ' + esc(ruaNome(b.rua)) + '</h3>' +
      '<canvas id="twBairroCv" width="480" height="200" aria-hidden="true"></canvas>' +
      '<p><b>' + esc(b.quem) + '</b> ' + esc(b.fez) + '.</p>' +
      (b.ok ? '<p class="twb-ok">✓ ' + esc(t('resolvida')) + '</p><p>' + esc(b.fim) + '</p>' :
        '<p>' + esc(t('precisa', {g:RUAS[b.gesto].gesto.emoji + ' ' + gestoNome(b.gesto)})) + '.' + (b.sabe ? '' : ' ' + esc(t('aprenda', vr(b.gesto, {j:jogosTxt(b.gesto)})))) + '</p>' +
        '<button type="button" class="twb-bt' + (b.sabe ? '' : ' twb-bt-falta') + '" data-twb="resolver"' + (b.sabe ? '' : ' disabled') + '>' + esc(b.sabe ? RUAS[b.gesto].gesto.emoji + ' ' + t('fazer') : '🔒 ' + t('faltaAprender')) + '</button>') +
      (baguncaPassada() ? '<p class="twb-regra">' + esc(t('vizinhos')) + '</p>' : '') + '</section>' + guiaH;
    var ap = gestosAprendidos();
    h += '<section class="twb-box"><h3>' + esc(t('gestos')) + '</h3>' + (ap.length ? '<div class="twb-gestos">' + ap.map(function(r){
      return '<span>' + esc(RUAS[r].gesto.emoji + ' ' + gestoNome(r)) + '</span>'; }).join('') + '</div>' : '<p class="twb-regra" style="text-align:left;margin:0">' + esc(t('semGesto')) + '</p>') + '</section>';
    h += '<section class="twb-box"><h3>' + esc(t('ruas')) + '</h3><div class="twb-ruas">' + ORDEM.map(function(r){
      var k = bico(r), aberta = !g.ativo || g.abertas.indexOf(r) >= 0, pc = k.nivel >= 3 ? 100 : Math.round((k.pts - (k.nivel ? NIVEIS[k.nivel - 1] : 0)) / (k.prox - (k.nivel ? NIVEIS[k.nivel - 1] : 0)) * 100);
      return '<article class="twb-rua' + (aberta ? '' : ' twb-off') + '" style="--twb-c:' + RUAS[r].cor + '"><b>' + esc(RUAS[r].emoji + ' ' + ruaNome(r)) + (aberta ? '' : ' · ' + esc(t('emBreve'))) + '</b>' +
        (BICOS ? '<small>' + esc(bicoNome(r)) + ' · ' + esc(k.nivel ? t('nivel', {n:k.nivel}) : t('novato')) + '</small>' +
        '<div class="twb-niv" aria-hidden="true">' + [1, 2, 3].map(function(n){ return '<i class="' + (k.nivel >= n ? 'on' : '') + '"></i>'; }).join('') + '</div>' +
        '<div class="twb-barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pc + '"><i style="width:' + pc + '%"></i></div>' +
        '<small>' + esc(k.nivel >= 3 ? t('max') : k.hoje >= POR_DIA ? t('hojeCheio') : t('falta', {f:k.falta, n:k.nivel + 1})) + '</small>' : 
        '<small>' + esc(RUAS[r].gesto.emoji + ' ' + gestoNome(r)) + (sabeGesto(r) ? ' ✓' : '') + '</small>' + (sabeGesto(r) ? '' : '<small>' + esc(t('jogue', {j:jogosTxt(r)})) + '</small>')) +
        '<div class="twb-pr">' + [1, 2, 3].map(function(n){ return '<span class="' + (k.nivel >= n ? 'on' : '') + '">' + esc(premioTxt(r, n)) + '</span>'; }).join('') + '</div>' +
        '<small>' + esc(t('conta', {j:jogosTxt(r)})) + '</small>' + (k.nivel < 3 ? botaoJogo(r) : '') + '</article>';
    }).join('') + '</div><p class="twb-regra">' + esc(t('regra')) + '</p></section>';
    ov.querySelector('#twBairroCorpo').innerHTML = h;
    desenharCena(b);
  }
  // cena da bagunça: o seu Idol (com o gesto, se já resolveu) e o bichinho, sobre a cor da rua
  function desenharCena(b, t){
    var cv = ov && ov.querySelector('#twBairroCv'); if(!cv) return;
    if(typeof window.twNitido === 'function' && !cv.__twN) window.twNitido(cv);
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, c = RUAS[b.rua].cor, ok = b.ok, Bi = window.TW_BICHOS;
    t = t || 0;
    // cenário da rua (tw-bichos.js): antes a bagunça, depois tudo arrumado; sem o arquivo, o fundo simples de antes
    if(!(Bi && Bi.cena(x, b.rua, W, H, ok, t))){
      var gr = x.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#fff6fd'); gr.addColorStop(1, c + '55');
      x.fillStyle = gr; x.fillRect(0, 0, W, H); x.fillStyle = c + '33'; x.fillRect(0, H - 34, W, 34);
    }
    try{
      if(typeof perfDesenharIdol === 'function'){
        var av = typeof hubAv === 'function' ? hubAv() : (typeof perfAvAtual === 'function' ? perfAvAtual({}) : null);
        if(av){
          av.pet = null; av.fundo = '';
          var gs = RUAS[b.gesto].gesto; av.pose = ok ? gs.pose : ''; av.expr = ok ? gs.expr : 0;
          x.save(); x.translate(-W * .22, 0); perfDesenharIdol(x, W, H, av, false, 0, 0); x.restore();
        }
      }
    }catch(e){}
    // o bicho: no mesmo traço dos personagens (tw-bichos.js); a borboleta voa perto da tulipa, a nuvem fica no céu
    var ES = 2.75, bx = W * .63, chao = H - 16, bicho = b.bicho;
    if(bicho === 'passaro') bx = W * .55;   // ao lado da fonte, não na frente
    if(bicho === 'borboleta'){ bx = ok ? W * .66 : W * .76; chao = H - 40; }
    if(bicho === 'nuvem'){ bx = ok ? W * .88 : W * .74; chao = ok ? H * .62 : H * .78; }
    var feito = Bi && Bi.desenhar(x, bicho, bx, chao, ES, ok ? 'feliz' : 'travesso', t);
    if(!feito){
      if(bicho === 'nuvem') nuvem(x, bx, chao - 40, ok);
      else if(typeof window.twMapaBicho === 'function') window.twMapaBicho(bicho, x, bx, chao, 1.5, 0);
    }
    // balãozinho: "!" na cor da rua antes, coração depois
    var topo = chao - 44 * ES + (bicho === 'nuvem' ? 34 : bicho === 'borboleta' ? 20 : 40), bb = bx + 30;
    if(ok) coracao(x, bb + 4, topo - 6 + Math.sin(t * .15) * 2, 11, '#ff4fa3');
    else { x.save(); x.fillStyle = '#fff'; x.strokeStyle = c; x.lineWidth = 2.5; x.beginPath(); if(x.roundRect) x.roundRect(bb - 12, topo - 26, 26, 22, 10); else x.rect(bb - 12, topo - 26, 26, 22); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(bb - 4, topo - 4.5); x.lineTo(bb - 9, topo + 4); x.lineTo(bb + 3, topo - 4.5); x.fill(); x.fillStyle = c; x.font = '900 17px system-ui, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('!', bb + 1, topo - 14.5); x.restore(); }
    cenaAnimar();
  }
  // movimento leve (asas, pulinho, gotas) enquanto o painel está aberto; parado com "reduzir movimento"
  var cenaRaf = 0, cenaT = 0;
  function cenaAnimar(){
    if(cenaRaf || desenharCena.rodando || !window.TW_BICHOS || typeof requestAnimationFrame !== 'function') return;
    try{ if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return; }catch(e){}
    var ultimo = 0;
    function passo(agora){
      cenaRaf = 0;
      if(!ov || ov.hidden || !ov.querySelector('#twBairroCv')) return;
      if(agora - ultimo >= 50){ ultimo = agora; cenaT += 1.5; desenharCena.rodando = true; try{ desenharCena(bagunca(), cenaT); }catch(e){} desenharCena.rodando = false; }
      cenaRaf = requestAnimationFrame(passo);
    }
    cenaRaf = requestAnimationFrame(passo);
  }
  function coracao(x, cx, cy, r, cor){
    x.save(); x.fillStyle = cor; x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath();
    x.moveTo(cx, cy + r); x.bezierCurveTo(cx - r * 1.6, cy - r * .2, cx - r * .7, cy - r * 1.3, cx, cy - r * .45);
    x.bezierCurveTo(cx + r * .7, cy - r * 1.3, cx + r * 1.6, cy - r * .2, cx, cy + r); x.closePath(); x.stroke(); x.fill(); x.restore();
  }
  // Nuvem Resmungona: bolinhas brancas com contorno lilás (como as nuvens do Mapa); cara emburrada ou sorrindo
  function nuvem(x, cx, cy, feliz){
    x.save(); x.translate(cx, cy); x.lineJoin = 'round';
    var bolas = [[-34, 6, 22], [-12, -10, 26], [14, -6, 24], [34, 8, 20], [0, 12, 24]];
    x.fillStyle = '#ffffff'; x.strokeStyle = '#9a8fd6'; x.lineWidth = 4;
    bolas.forEach(function(q){ x.beginPath(); x.arc(q[0], q[1], q[2], 0, 7); x.stroke(); });
    bolas.forEach(function(q){ x.beginPath(); x.arc(q[0], q[1], q[2], 0, 7); x.fill(); });
    x.fillStyle = '#3a2a4a'; x.strokeStyle = '#3a2a4a'; x.lineWidth = 2.6; x.lineCap = 'round';
    x.beginPath(); x.arc(-11, 4, 3.2, 0, 7); x.arc(11, 4, 3.2, 0, 7); x.fill();
    x.beginPath();
    if(feliz){ x.arc(0, 10, 7, .2, Math.PI - .2); }
    else { x.moveTo(-17, -5); x.lineTo(-6, -1); x.moveTo(17, -5); x.lineTo(6, -1); x.moveTo(-6, 16); x.quadraticCurveTo(0, 11, 6, 16); }
    x.stroke();
    x.fillStyle = 'rgba(255,111,181,.45)'; x.beginPath(); x.ellipse(-20, 12, 5, 3, 0, 0, 7); x.ellipse(20, 12, 5, 3, 0, 0, 7); x.fill();
    if(!feliz){ x.fillStyle = '#9a8fd6'; [[-18, 40], [0, 46], [18, 40]].forEach(function(g){ x.beginPath(); x.ellipse(g[0], g[1], 2.4, 4.5, 0, 0, 7); x.fill(); }); }
    x.restore();
  }
  function toast(msg){
    try{ if(typeof window.twcToast === 'function') return window.twcToast(msg); }catch(e){}
    try{ if(typeof hubToast === 'function') return hubToast(msg); }catch(e){}
  }

  /* ---------- guia no Mapa: as ruas acendem uma por dia (nada trancado) ---------- */
  function guiaPergunta(rua, entrar){
    if(ruaAberta(rua)) return false;
    estilo(); var velho = document.getElementById('twBairroPerg'); if(velho) velho.remove();
    var d = document.createElement('div'); d.className = 'twb-pergunta'; d.id = 'twBairroPerg'; d.setAttribute('role', 'dialog');
    d.innerHTML = '<p>' + esc(t('guiaRua', {r:ruaNome(rua)})) + '</p><div><button type="button" class="twb-bt" data-p="entrar">' + esc(t('entrar')) + '</button>' +
      '<button type="button" class="twb-bt twb-bt-claro" data-p="pular">' + esc(t('pular')) + '</button>' +
      '<button type="button" class="twb-bt twb-bt-claro" data-p="depois">' + esc(t('depois')) + '</button></div>';
    d.addEventListener('click', function(e){
      var b = e.target.closest && e.target.closest('[data-p]'); if(!b) return;
      var a = b.getAttribute('data-p'); d.remove();
      if(a === 'pular'){ pularGuia(); guiaMarcar(); }
      if(a === 'entrar' || a === 'pular') entrar();
    });
    document.body.appendChild(d);
    return true;
  }
  function guiaMarcar(raiz){
    var g = guia(); estilo();
    [].forEach.call((raiz || document).querySelectorAll('[data-tw-bairro]'), function(b){
      var r = b.getAttribute('data-tw-bairro'), off = g.ativo && g.abertas.indexOf(r) < 0;
      b.classList.toggle('twb-guia-off', off);
      var s = b.querySelector('.twb-breve');
      if(off && !s){ s = document.createElement('span'); s.className = 'twb-breve'; s.textContent = '✨ ' + t('emBreve'); b.appendChild(s); }
      else if(!off && s) s.remove();
    });
  }

  estilo();
  B._tela({abrir:abrir, fechar:fechar, toast:toast, guiaPergunta:guiaPergunta, guiaMarcar:guiaMarcar});
})();
