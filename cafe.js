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
  return { base:Math.floor(r() * CF_BASES.length), cob:n >= 2 || r() < .4 ? Math.floor(r() * CF_COBERTURAS.length) : -1,
    enf:Math.floor(r() * CF_ENFEITES.length), doce:n >= 4 && r() < .6 ? Math.floor(r() * CF_DOCES.length) : -1 };
}
function cfPaciencia(){ return Math.max(420, 900 - cf.atendidos * 45); }   // em quadros (~60/s)
function cfAbrir(){
  cfOv.hidden = false; cfOv.scrollTop = 0;
  cf = { fase:'inicio', pontos:0, vidas:3, atendidos:0, perfeitos:0, combo:0, cli:null, monta:null, t0:0, fala:'', novas:[], hearts:[] };
  cfUI(); if(!cfAnim) cfAnim = requestAnimationFrame(cfLoop);
}
function cfFechar(){ cfOv.hidden = true; cf = null; }
function cfNovoCliente(){
  var r = hsSorteio(Date.now() + cf.atendidos * 131), livres = hsNomesLivres(), nome = livres[Math.floor(r() * livres.length)] || 'Mimi';
  var f = hsFa(r, nome); f.pedido = cfPedido(r, cf.atendidos);
  cf.cli = f; cf.monta = { base:-1, cob:-1, enf:-1, doce:-1 }; cf.fase = 'pedido'; cf.t0 = cfT; cf.fala = '';
  cfUI();
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
  if(sfx && sfx.card) try{ sfx.card(); }catch(e){}
  cfUI();
}
function cfServir(saiu){
  if(!cf || cf.fase !== 'pedido') return;
  var p = cf.cli.pedido, m = cf.monta, J = HS_JEITOS[cf.cli.jeito] || HS_JEITOS.fofo;
  var certo = !saiu && m.base === p.base && m.cob === p.cob && m.enf === p.enf && m.doce === p.doce;
  var resto = Math.max(0, 1 - (cfT - cf.t0) / cfPaciencia());
  cf.atendidos++;
  if(certo){
    cf.combo++; cf.perfeitos++;
    cf.pontos += Math.round((100 + resto * 100 + (p.cob >= 0 ? 30 : 0) + (p.doce >= 0 ? 40 : 0)) * (1 + Math.min(cf.combo - 1, 5) * .1));
    var oks = { animado:['Que delícia! Vou postar foto! 📸', 'Perfeito!! 💖'], timido:['E-está lindo… obrigado. 🥹', 'Tão gostoso…'], fofo:['Que fofo esse copo! 💕', 'Yay! Igualzinho! ☕'] }[cf.cli.jeito] || ['Perfeito!! 💖'];
    cf.fala = tr(oks[Math.floor(Math.random() * oks.length)]);
    var rec = cfLer(CF_RECEITAS_KEY, {}), chave = p.base + '-' + p.enf;
    if(!rec[chave]){ rec[chave] = 1; cfGravar(CF_RECEITAS_KEY, rec); cf.novas.push(cfNomeReceita(p)); }
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
  if(cf.perfeitos > 0){ try{ localStorage.setItem('tw_cf_dia', new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10)); }catch(e){} if(contaJ) contaRpc('marcar_visita', { p_k:'cafe' }).catch(function(){}); }   // missão do dia (quando o servidor tiver a chave)
  var rec = cfLer(CF_RECORDE_KEY, 0); cf.novoRec = cf.pontos > rec; if(cf.novoRec) cfGravar(CF_RECORDE_KEY, cf.pontos);
  cfUI();
}
function cfLoop(ms){
  cfAnim = 0; if(!twAnimacaoVisivel(cfOv)) return;
  var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('cfCv'), ms) : 1; cfT += d;
  if(cf){
    var dt = cfT - cf.t0;
    if(cf.fase === 'pedido'){ if(dt > cfPaciencia()) cfServir(true); var bar = $('cfPac'); if(bar) bar.style.width = Math.max(0, 100 - dt / cfPaciencia() * 100) + '%'; }
    else if(cf.fase === 'reacao' && dt > 90){ if(cf.vidas <= 0 || cf.atendidos >= 12) cfFim(); else cfNovoCliente(); }
  }
  if(Math.floor(cfT / 2) !== Math.floor((cfT - d) / 2)) cfDesenhar();
  cfAnim = requestAnimationFrame(cfLoop);
}
function cfCopo(x, cx, by, m, s){   // copo em pixel (blocos), mesmo jeito das roupas: bebida, faixa TsuLiPa, cobertura, enfeite, canudo
  var u = 7 * s, cw = 12, ch = 15, ox = Math.round(cx - cw * u / 2), oy = Math.round(by - ch * u), j, i;
  x.fillStyle = 'rgba(30,10,60,.18)'; x.fillRect(ox - u, by - u * .4, (cw + 2) * u, u * .8);
  for(j = 0; j < ch; j++){ var enc = j >= 12 ? 1 : 0, l0 = enc, l1 = cw - enc;   // copo afunila embaixo
    for(i = l0; i < l1; i++){
      var borda = i === l0 || i === l1 - 1, cor = 'rgba(255,255,255,.45)';
      if(m.base >= 0 && j >= 3){ cor = CF_BASES[m.base][2]; if(i === l0 + 1) cor = 'rgba(255,255,255,.35)'; }
      if(j >= 7 && j <= 8) cor = '#ff9ccf';
      if(borda) cor = '#ffffff';
      x.fillStyle = cor; x.fillRect(ox + i * u, oy + j * u, Math.ceil(u), Math.ceil(u));
      if(m.base >= 0 && j >= 3 && i === l0 + 1 && !(j >= 7 && j <= 8)){ x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(ox + i * u, oy + j * u, Math.ceil(u), Math.ceil(u)); }
    }
  }
  x.fillStyle = '#fff'; x.fillRect(ox + 4 * u, oy + 7 * u + 2, 4 * u, u - 2);   // letreirinho da faixa
  x.fillStyle = '#ff6fb5'; x.fillRect(ox + 8 * u, oy - 7 * u, u, 9 * u); x.fillRect(ox + 9 * u, oy - 8 * u, u, u);   // canudo
  if(m.cob >= 0) cfSprite(x, 'cob' + m.cob, cx, oy + u, u);
  if(m.enf >= 0) cfSprite(x, 'enf' + m.enf, cx - u, oy - (m.cob >= 0 ? 4 : 0) * u, u * .8);
  if(m.doce >= 0){ var dx = ox + (cw + 7) * u; x.fillStyle = '#fff'; x.fillRect(dx - 7 * u, by - u, 14 * u, u); x.fillStyle = '#f2c5e3'; x.fillRect(dx - 6 * u, by, 12 * u, u * .6); cfSprite(x, 'doce' + m.doce, dx, by - u, u); }
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
  if(cf && cf.monta) cfCopo(x, W2 * .6, H2 * .82, cf.monta, 1);
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
  if(cf.fase === 'inicio') h += '<p class="hsdica">' + escHtml(tr('Os fãs chegam ao balcão do café do grupo. Monte a bebida na ordem (base, cobertura e enfeite), junte o docinho se pedirem e sirva antes da paciência acabar!')) + '</p>' +
    '<p class="hsdica">📒 ' + escHtml(tr('Cada pedido perfeito guarda uma receita no Caderno do café:')) + ' <b>' + nRec + '/' + totRec + '</b></p>' +
    '<div class="btns"><button type="button" class="btn" id="cfJogar">☕ ' + escHtml(tr('Abrir o café')) + '</button></div>';
  else if(cf.fase === 'pedido' || cf.fase === 'reacao'){
    h += '<div class="hstempo"><i id="cfPac" style="width:100%"></i></div>' +
      cfBotoes('base', CF_BASES, '1. Base') + cfBotoes('cob', CF_COBERTURAS, '2. Cobertura (se pedir)') + cfBotoes('enf', CF_ENFEITES, '3. Enfeite') + cfBotoes('doce', CF_DOCES, 'Docinho (se pedir)') +
      '<div class="btns cfacoes"><button type="button" class="btn sec" data-cf="lixo:0">🗑️ ' + escHtml(tr('Recomeçar copo')) + '</button><button type="button" class="btn" id="cfServir"' + (cf.monta.base < 0 || cf.monta.enf < 0 || cf.fase !== 'pedido' ? ' disabled' : '') + '>🛎️ ' + escHtml(tr('Servir')) + '</button></div>';
  }
  else if(cf.fase === 'fim'){
    h += '<p class="hsfim">' + (cf.novoRec ? '🏆 ' + escHtml(tr('Novo recorde!')) + ' ' : '') + escHtml(tr('O café fechou!')) + ' <b>' + cf.pontos.toLocaleString('pt-BR') + '</b> ' + escHtml(tr('pts')) + '</p>' +
      '<div class="hsresumo"><span>☕ ' + cf.perfeitos + '/' + cf.atendidos + ' ' + escHtml(tr('perfeitos')) + '</span><span>📒 ' + nRec + '/' + totRec + '</span></div>';
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
function cfClique(e){
  var b = e.target.closest && e.target.closest('[data-cf]');
  if(b){ var p = b.dataset.cf.split(':'); cfEscolher(p[0], +p[1]); return; }
  if(e.target.closest && e.target.closest('#cfServir')){ cfServir(false); return; }
  if(e.target.closest && e.target.closest('#cfJogar')){ cf = { fase:'inicio', pontos:0, vidas:3, atendidos:0, perfeitos:0, combo:0, cli:null, monta:null, t0:cfT, fala:'', novas:[], hearts:[] }; cfNovoCliente(); }
}
function cfHubHtml(){
  var feito = false; try{ feito = localStorage.getItem('tw_cf_dia') === new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }catch(e){}
  return '<button type="button" class="hubcard hubcafe' + (feito ? '' : ' tw-alert-pink') + '" data-ir="cafe">' + (feito ? '' : '<em class="hubalerta" aria-hidden="true">!</em>') + '<i>🧋</i><b translate="no">Happy⭐Cafe!</b><small class="tw-hubgame-jp" lang="ja">ハッピー・カフェ</small><small>' + escHtml(tr('Monte shakes e frappés para os fãs!')) + '</small></button>';
}


/* Itens da cena em pixel, como as roupas e os personagens: cada letra é um bloquinho de cor. */
var CF_PX = {
  cob0:['....WW....','...WWWW...','..WWHWWW..','.WWWWWWWW.','WWHWWWWWWW','.WWWWWWWW.'],
  cob1:['.CCCCCCCC.','CCHCCCCCCC','CCCCCCCCCC','C.CC.CC.CC','C..C.CC..C','...C..C...'],
  cob2:['....WW....','...WPWW...','..WWWWYW..','.WBWWWWPW.','WWWWGWWWWW','.WWPWWWBW.'],
  enf0:['.RR...RR.','RRHR.RRRR','RHRRRRRRR','RRRRRRRRR','.RRRRRRR.','..RRRRR..','...RRR...','....R....'],
  enf1:['....Y....','...YHY...','YYYYHYYYY','.YYYYYYY.','..YYYYY..','.YYY.YYY.','YY.....YY'],
  enf2:['.....GG..','....G....','...G.G...','..G...G..','.KK...KK.','KHKK.KHKK','KKKK.KKKK','.KK...KK.'],
  enf3:['OO.....OO','OOO...OOO','OOOOPOOOO','OOOPPPOOO','OOOOPOOOO','OOO...OOO','OO.....OO'],
  doce0:['..TTTTT..','.TTHTTDT.','TTDTTTTTT','TTTTTDTTT','TDTTTTTTT','.TTTDTTT.','..TTTTT..'],
  doce1:['MMMMMMMMMM','MLLLPLLLLM','MLLLLLLLLM','DDDDDDDDDD','DLDDDDDDDD','DDDDDDDDDD'],
  doce2:['...TTT...','..THTTT..','.TTDTTDT.','TTDTTTDTT','TT.....TT','T.......T'],
  doce3:['TTTTTTTTT','THDTDTDTT','TTTTTTTTT','TDTDTDTDT','TTTTTTTTT','TDTDTDTDT','TTTTTTTTT']
};
var CF_PAL = { W:'#fffaf2', H:'#ffffff', C:'#f0a73a', P:'#ff6fb5', Y:'#ffd23f', B:'#3fc1ff', G:'#5fb04a', R:'#ff4f9a', K:'#d6123a', O:'#e8b27a',
  T:'#e3a346', D:'#7a4a2a', M:'#8a5236', L:'#a8683f', S:'#ff9ccf' };
function cfSprite(x, nome, cx, by, u){   // desenha o sprite com a base em (cx, by); u = tamanho do bloquinho
  var m = CF_PX[nome]; if(!m) return; var w = m[0].length, h = m.length, ox = Math.round(cx - w * u / 2), oy = Math.round(by - h * u);
  for(var j = 0; j < h; j++) for(var i = 0; i < w; i++){ var ch = m[j][i]; if(ch === '.') continue; x.fillStyle = CF_PAL[ch]; x.fillRect(ox + i * u, oy + j * u, Math.ceil(u), Math.ceil(u)); }
}
