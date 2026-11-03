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
  if(contaJ && cf.perfeitos > 0) contaRpc('marcar_visita', { p_k:'cafe' }).catch(function(){});   // missão do dia (quando o servidor tiver a chave)
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
function cfCopo(x, cx, by, m, s){   // copo transparente montado em camadas
  var w = 70 * s, h = 96 * s;
  x.save();
  if(m.base >= 0){ x.fillStyle = CF_BASES[m.base][2]; x.beginPath(); x.moveTo(cx - w / 2 + 4, by - h + 22 * s); x.lineTo(cx + w / 2 - 4, by - h + 22 * s); x.lineTo(cx + w / 2 - 10 * s, by - 4); x.lineTo(cx - w / 2 + 10 * s, by - 4); x.closePath(); x.fill(); }
  x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 4; x.fillStyle = 'rgba(255,255,255,.22)';
  x.beginPath(); x.moveTo(cx - w / 2, by - h); x.lineTo(cx + w / 2, by - h); x.lineTo(cx + w / 2 - 8 * s, by); x.lineTo(cx - w / 2 + 8 * s, by); x.closePath(); x.fill(); x.stroke();
  x.fillStyle = '#ff9ccf'; x.fillRect(cx - w / 2 + 8 * s, by - h * .55, w - 16 * s, 12 * s);   // faixinha do café
  x.fillStyle = '#fff'; x.font = '900 ' + Math.round(9 * s) + 'px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('TsuLiPa', cx, by - h * .55 + 6 * s);
  if(m.cob >= 0){ x.fillStyle = CF_COBERTURAS[m.cob][2]; x.beginPath(); for(var i = 0; i < 3; i++) x.arc(cx - 20 * s + i * 20 * s, by - h - 2 * s, 16 * s, 0, 7); x.fill();
    if(m.cob === 2){ for(var g = 0; g < 10; g++){ x.fillStyle = ['#ff6fb5', '#7b3ff0', '#ffd23f', '#3fc1ff'][g % 4]; x.fillRect(cx - 28 * s + g * 6 * s, by - h - 8 * s + (g % 3) * 5 * s, 4 * s, 2 * s); } } }
  x.fillStyle = '#ff6fb5'; x.fillRect(cx + 10 * s, by - h - 40 * s, 5 * s, 44 * s);   // canudo
  if(m.enf >= 0){ x.font = Math.round(26 * s) + 'px sans-serif'; x.fillText(CF_ENFEITES[m.enf][0], cx - 6 * s, by - h - 18 * s); }
  if(m.doce >= 0){ x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx + w * .95, by - 6 * s, 30 * s, 9 * s, 0, 0, 7); x.fill(); x.font = Math.round(28 * s) + 'px sans-serif'; x.fillText(CF_DOCES[m.doce][0], cx + w * .95, by - 20 * s); }
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
  if(cf && cf.monta) cfCopo(x, W2 * .62, H2 * .9, cf.monta, 1);
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
  return '<button type="button" class="hubcard hubcafe" data-ir="cafe"><i>🧋</i><b translate="no">Happy⭐Cafe!</b><small class="tw-hubgame-jp" lang="ja">ハッピー・カフェ</small><small>' + escHtml(tr('Monte shakes e frappés para os fãs!')) + '</small></button>';
}
