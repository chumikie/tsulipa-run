/* TsuLiPa⭐World — Charmaker (editor do "Você"), inspirado no Charat: prévia grande com expressões e girar,
   abas de partes com miniaturas desenhadas, paleta rápida de cor de cabelo, 🎲 Sortear e ↩ Desfazer. Não cria campo nem regra nova:
   muda os mesmos <select>/<input> do editor e dispara os eventos deles, então o save (saveCu),
   o perfil e as trancas por ranking continuam exatamente como estavam. A pele nunca é sorteada. */
(function(){
  'use strict';
  var PALETA = ['#ff7eb6', '#ff6fb5', '#c084fc', '#7b3ff0', '#4169e1', '#4dd8ff', '#7edb9c', '#ffe14d', '#ff8f6b', '#4b2b1a', '#2a1a12', '#f4f1ea'];
  var OLHOS = ['#5a3b2e', '#4169e1', '#7b3ff0', '#2fa57a', '#c2185b', '#3a2a4a', '#8a5a00'];
  var MEIAS = ['#1c1c30', '#ffffff', '#ff9ccd', '#4a5170', '#c9b8ff'];
  var ROUPA = ['#ffffff', '#ff8fc8', '#b8a3ff', '#7fd3ff', '#b6ff3b', '#ffe08a', '#ff8f6b'];
  var anterior = null;

  function $(id){ return document.getElementById(id); }
  function cu(){ return typeof CU !== 'undefined' ? CU : null; }
  function sorteia(l){ return l[Math.floor(Math.random() * l.length)]; }
  function trocar(id, v, ev){
    var e = $(id); if(!e) return;
    e.value = v;
    try{ e.dispatchEvent(new Event(ev || 'change', {bubbles:true})); }catch(_){ if(e.onchange) e.onchange(); }
  }
  function marcarPaleta(){
    var c = cu(), box = $('hairsw'); if(!c || !box) return;
    [].forEach.call(box.children, function(b){ b.setAttribute('aria-pressed', String(b.getAttribute('data-cor') === String(c.hair).toLowerCase())); });
  }
  function paleta(){
    var box = $('hairsw'); if(!box || box.childElementCount) return;
    PALETA.forEach(function(cor){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'sw'; b.style.background = cor;
      b.setAttribute('data-cor', cor); b.setAttribute('aria-label', (typeof tr === 'function' ? tr('Cor') : 'Cor') + ' ' + cor);
      b.onclick = function(){ trocar('chair', cor, 'input'); marcarPaleta(); };
      box.appendChild(b);
    });
    marcarPaleta();
    var cor = $('chair'); if(cor) cor.addEventListener('input', marcarPaleta);
  }
  // Só opções liberadas (as trancadas por ranking ficam com disabled).
  function livres(id, fora){
    var e = $(id); if(!e) return [];
    return [].filter.call(e.options, function(o){ return !o.disabled && (!fora || fora.indexOf(o.value) < 0); }).map(function(o){ return o.value; });
  }
  function sortear(){
    var c = cu(); if(!c) return;
    anterior = JSON.parse(JSON.stringify(c));
    trocar('chair', sorteia(PALETA), 'input');
    trocar('cstr', sorteia(PALETA), 'input');
    ['cback', 'cfront', 'colho', 'csobr', 'cboca', 'cbochecha', 'cout', 'cbaixo', 'cgl'].forEach(function(id){ var l = livres(id); if(l.length) trocar(id, sorteia(l)); });
    var mecha = livres('cstk'); if(mecha.length) trocar('cstk', Math.random() < .6 ? '' : sorteia(mecha));
    var det = livres('cdet', ['olheiras']); if(det.length) trocar('cdet', Math.random() < .55 ? '' : sorteia(det));
    var chapeu = livres('chat'); if(chapeu.length) trocar('chat', Math.random() < .5 ? '' : sorteia(chapeu));
    trocar('ceye', sorteia(OLHOS), 'input');
    trocar('coutcol', sorteia(ROUPA), 'input');
    trocar('cleg', sorteia(MEIAS), 'input');
    depois(); atualizar();
    try{ if(typeof sfx !== 'undefined' && sfx && sfx.card) sfx.card(); }catch(_){}
  }
  function desfazer(){
    var c = cu(); if(!c || !anterior) return;
    Object.keys(c).forEach(function(k){ if(!(k in anterior)) delete c[k]; });
    Object.keys(anterior).forEach(function(k){ c[k] = anterior[k]; });
    anterior = null;
    if(typeof saveCu === 'function') saveCu();
    if(typeof pick === 'function') pick(3);
    var chair = $('chair'); if(chair) chair.value = c.hair || '#ff7eb6';
    ['cstr', 'ceye', 'coutcol', 'cleg'].forEach(function(id){ var e = $(id), f = {cstr:'hair2', ceye:'eye', coutcol:'outcol', cleg:'legcol'}[id]; if(e && c[f]) e.value = c[f]; });
    depois(); atualizar();
  }
  function depois(){
    var c = cu(), d = $('custDesfazer');
    if(d) d.disabled = !anterior;
    try{ if(c && typeof cw !== 'undefined' && cw.children[3] && cw.children[3].firstChild) cw.children[3].firstChild.style.background = c.hair; }catch(_){}
    marcarPaleta();
  }
  /* ---------- Estilo Charat: prévia grande, expressões, girar, abas de partes e miniaturas ---------- */
  var PARTES = [
    {id:'cback', campo:'back', nome:'Corte'}, {id:'cfront', campo:'front', nome:'Franja'},
    {id:'cstk', campo:'mecha', nome:'Mecha'}, {id:'cdet', campo:'det', nome:'Detalhe'},
    {id:'colho', campo:'olho', nome:'Olhos'}, {id:'csobr', campo:'sobrancelha', nome:'Sobrancelha'},
    {id:'cboca', campo:'boca', nome:'Boca'}, {id:'cbochecha', campo:'bochecha', nome:'Bochecha'},
    {id:'cout', campo:'out', nome:'Roupa'}, {id:'cbaixo', campo:'baixo', nome:'Parte de baixo'},
    {id:'chat', campo:'hat', nome:'Acessório'}, {id:'cgl', campo:'gl', nome:'Óculos'}
  ];
  var EXPR = [[0, '🙂', 'Normal'], [2, '😆', 'Feliz'], [3, '😉', 'Piscadinha'], [4, '😮', 'Surpresa'], [5, '😢', 'Chorinho'], [6, '😍', 'Apaixonado'], [1, '😣', 'Concentrado']];
  var aba = 0, expr = 0, virado = false, pedido = 0, pedidoMini = 0;
  function T(t){ return typeof tr === 'function' ? tr(t) : t; }
  // Desenha um personagem do editor num canvas qualquer (mesmo drawChar do jogo).
  function pintar(cv, c, S, tx, ty, ex, espelho){
    if(typeof perfChar !== 'function' || typeof drawChar !== 'function' || typeof perfCharContorno !== 'function') return false;
    var x = cv.getContext('2d'), pose = typeof charPose !== 'undefined' ? charPose : '';
    x.save();
    if(espelho){ x.translate(cv.width, 0); x.scale(-1, 1); }
    try{ charPose = ''; perfCharContorno(x, tx, ty, S, function(){ drawChar(perfChar({c:c}), 0, 0, 0, ex, false); }); }catch(e){}
    finally{ charPose = pose; x.restore(); }
    return true;
  }
  function prev(){
    var cv = $('cmCv'), c = cu(); if(!cv || !c || $('cust').hidden) return;
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, S = 6.3, chao = H - 28;
    x.clearRect(0, 0, W, H);
    var bg = x.createRadialGradient(W / 2, H * .45, 10, W / 2, H * .5, W * .6);
    bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, 'rgba(232,220,255,.9)');
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.fillStyle = 'rgba(155,48,217,.12)'; x.beginPath(); x.ellipse(W / 2, chao, 100, 16, 0, 0, Math.PI * 2); x.fill();
    pintar(cv, c, S, W / 2 - 15 * S, chao - 44 * S, expr, virado);
  }
  function miniaturas(){
    var box = $('cmGrade'), c = cu(), p = PARTES[aba], sel = p && $(p.id); if(!box || !c || !sel) return;
    try{ if(window.TWAvatarHair && TWAvatarHair.rotular) TWAvatarHair.rotular(); }catch(_){}
    var atual = p.campo === 'mecha' ? (c.mecha || (c.streak ? 'uma' : '')) : p.campo === 'hat' && c.det === 'tulipa' ? 'tulipa' : (c[p.campo] || '');
    box.setAttribute('aria-labelledby', 'cmAba' + aba);
    box.innerHTML = '';
    [].forEach.call(sel.options, function(o){
      var b = document.createElement('button'); b.type = 'button'; b.className = 'cmmini';
      b.setAttribute('aria-pressed', String(o.value === atual)); b.disabled = o.disabled;
      b.setAttribute('aria-label', o.textContent);
      var cv = document.createElement('canvas'); cv.width = 132; cv.height = 132; cv.setAttribute('aria-hidden', 'true');
      var nome = document.createElement('span'); nome.textContent = o.textContent.replace(/^🔒\s*/, '');
      b.appendChild(cv); b.appendChild(nome);
      var mod = JSON.parse(JSON.stringify(c)); mod[p.campo] = o.value; if(p.campo === 'mecha') mod.streak = !!o.value;
      if(p.campo === 'hat'){ if(o.value === 'tulipa'){ mod.det = 'tulipa'; mod.hat = ''; } else if(mod.det === 'tulipa') mod.det = ''; }
      if(o.disabled){ var tr2 = document.createElement('i'); tr2.className = 'cmtranca'; tr2.textContent = '🔒'; tr2.setAttribute('aria-hidden', 'true'); b.appendChild(tr2); }
      // corte: do topo à cintura (dá para ver curto × longo); franja/mecha/detalhe: a cabeça; rosto: zoom no rosto
      var rosto = /^(olho|sobrancelha|boca|bochecha|gl)$/.test(p.campo), corte = p.campo === 'back', corpo = p.campo === 'out' || p.campo === 'baixo',
          chapeu = p.campo === 'hat',
          S = rosto ? 6.2 : corte ? 2.6 : corpo ? 2.35 : chapeu ? 3.9 : 4.4, meio = rosto ? 19 : corte ? 16 : corpo ? 19.5 : chapeu ? 9.5 : 12.5;
      pintar(cv, mod, S, 66 - 15 * S, 66 - meio * S, 0, false);
      b.addEventListener('click', function(){ if(b.disabled) return; trocar(p.id, o.value); });
      box.appendChild(b);
    });
  }
  function abas(){
    var box = $('cmAbas'); if(!box || box.childElementCount) return;
    PARTES.forEach(function(p, i){
      var b = document.createElement('button'); b.type = 'button'; b.id = 'cmAba' + i; b.setAttribute('role', 'tab');
      b.textContent = T(p.nome); b.setAttribute('aria-selected', String(i === aba));
      b.addEventListener('click', function(){ aba = i; [].forEach.call(box.children, function(x, k){ x.setAttribute('aria-selected', String(k === i)); }); miniaturas(); });
      box.appendChild(b);
    });
  }
  function expressoes(){
    var box = $('cmExpr'); if(!box || box.childElementCount) return;
    EXPR.forEach(function(e){
      var b = document.createElement('button'); b.type = 'button'; b.textContent = e[1]; b.setAttribute('aria-label', T(e[2]));
      b.setAttribute('aria-pressed', String(e[0] === expr));
      b.addEventListener('click', function(){ expr = e[0]; [].forEach.call(box.children, function(x){ if(x.dataset.girar !== '1') x.setAttribute('aria-pressed', String(x === b)); }); prev(); });
      box.appendChild(b);
    });
    var g = document.createElement('button'); g.type = 'button'; g.dataset.girar = '1'; g.textContent = '↔'; g.setAttribute('aria-label', T('Girar'));
    g.setAttribute('aria-pressed', 'false');
    g.addEventListener('click', function(){ virado = !virado; g.setAttribute('aria-pressed', String(virado)); prev(); });
    box.appendChild(g);
  }
  // Redesenha no próximo quadro (prévia) e um pouco depois (miniaturas), sem repetir trabalho.
  function atualizar(){
    if(!pedido) pedido = requestAnimationFrame(function(){ pedido = 0; prev(); });
    clearTimeout(pedidoMini); pedidoMini = setTimeout(miniaturas, 120);
  }
  function estudio(){
    abas(); expressoes();
    ['cust', 'cust_roupa'].forEach(function(id){ var e = $(id); if(e && !e.dataset.cmOuvindo){ e.dataset.cmOuvindo = '1'; e.addEventListener('input', atualizar, true); e.addEventListener('change', atualizar, true); e.addEventListener('click', atualizar, true); } });
    // a aba do Você abre por pick(3): redesenha quando o editor aparece
    var cust = $('cust');
    if(cust && typeof MutationObserver === 'function' && !cust.dataset.cmObs){ cust.dataset.cmObs = '1'; new MutationObserver(function(){ if(!cust.hidden) atualizar(); }).observe(cust, {attributes:true, attributeFilter:['hidden']}); }
    atualizar();
  }
  function iniciar(){
    paleta(); estudio();
    var s = $('custSortear'), d = $('custDesfazer');
    if(s && !s.dataset.ligado){ s.dataset.ligado = '1'; s.addEventListener('click', sortear); }
    if(d && !d.dataset.ligado){ d.dataset.ligado = '1'; d.addEventListener('click', desfazer); }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  window.TW_CHARMAKER = { paleta:PALETA.slice(), sortear:sortear, desfazer:desfazer, partes:PARTES.map(function(p){ return p.campo; }), atualizar:atualizar };
})();
