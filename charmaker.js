/* TsuLiPa⭐World — Charmaker (editor do "Você").
   Paleta rápida de cor de cabelo, 🎲 Sortear e ↩ Desfazer. Não cria campo nem regra nova:
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
    ['cback', 'cfront', 'colho', 'cboca', 'cbochecha', 'cout', 'cbaixo', 'cgl'].forEach(function(id){ var l = livres(id); if(l.length) trocar(id, sorteia(l)); });
    var mecha = livres('cstk'); if(mecha.length) trocar('cstk', Math.random() < .6 ? '' : sorteia(mecha));
    var det = livres('cdet', ['olheiras']); if(det.length) trocar('cdet', Math.random() < .55 ? '' : sorteia(det));
    var chapeu = livres('chat'); if(chapeu.length) trocar('chat', Math.random() < .5 ? '' : sorteia(chapeu));
    trocar('ceye', sorteia(OLHOS), 'input');
    trocar('coutcol', sorteia(ROUPA), 'input');
    trocar('cleg', sorteia(MEIAS), 'input');
    depois();
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
    depois();
  }
  function depois(){
    var c = cu(), d = $('custDesfazer');
    if(d) d.disabled = !anterior;
    try{ if(c && typeof cw !== 'undefined' && cw.children[3] && cw.children[3].firstChild) cw.children[3].firstChild.style.background = c.hair; }catch(_){}
    marcarPaleta();
  }
  function iniciar(){
    paleta();
    var s = $('custSortear'), d = $('custDesfazer');
    if(s && !s.dataset.ligado){ s.dataset.ligado = '1'; s.addEventListener('click', sortear); }
    if(d && !d.dataset.ligado){ d.dataset.ligado = '1'; d.addEventListener('click', desfazer); }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  window.TW_CHARMAKER = { paleta:PALETA.slice(), sortear:sortear, desfazer:desfazer };
})();
