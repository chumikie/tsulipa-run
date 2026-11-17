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
  // Sorteia um visual com o que já está liberado. direto=true grava no "Você" sem passar pelos campos do
  // Center Run (usado no Montar Idol do Perfil/Zipper Shop, onde o personagem selecionado no jogo pode ser outro).
  var CAMPO_ID = {hair:'chair', hair2:'cstr', eye:'ceye', outcol:'coutcol', legcol:'cleg', back:'cback', front:'cfront', olho:'colho',
    sobrancelha:'csobr', boca:'cboca', bochecha:'cbochecha', out:'cout', baixo:'cbaixo', gl:'cgl', mecha:'cstk', det:'cdet', hat:'chat'};
  function sortear(direto){
    var c = cu(); if(!c) return;
    anterior = JSON.parse(JSON.stringify(c));
    var m = {hair:sorteia(PALETA), hair2:sorteia(PALETA), eye:sorteia(OLHOS), outcol:sorteia(ROUPA), legcol:sorteia(MEIAS)};
    ['back', 'front', 'olho', 'sobrancelha', 'boca', 'bochecha', 'out', 'baixo', 'gl'].forEach(function(k){ var l = livres(CAMPO_ID[k]); if(l.length) m[k] = sorteia(l); });
    var mecha = livres('cstk'); if(mecha.length) m.mecha = Math.random() < .6 ? '' : sorteia(mecha);
    var det = livres('cdet', ['olheiras']); if(det.length) m.det = Math.random() < .55 ? '' : sorteia(det);
    var chapeu = livres('chat'); if(chapeu.length) m.hat = Math.random() < .5 ? '' : sorteia(chapeu);
    if(direto === true){
      Object.keys(m).forEach(function(k){ if(k !== 'hat' && k !== 'det') c[k] = m[k]; });
      c.img = c.hair; c.streak = !!c.mecha;
      if(c.det !== 'torrada'){ c.det = m.det || ''; }
      if(m.hat === 'tulipa'){ c.det = 'tulipa'; c.hat = ''; } else { c.hat = m.hat || ''; if(c.det === 'tulipa') c.det = ''; }
      if(typeof saveCu === 'function') saveCu();
      if(typeof sel !== 'undefined' && sel === 3 && typeof pick === 'function') pick(3);
    } else {
      Object.keys(m).forEach(function(k){ var cor = /^(hair|hair2|eye|outcol|legcol)$/.test(k); trocar(CAMPO_ID[k], m[k], cor ? 'input' : 'change'); });
    }
    depois(); atualizar();
    try{ if(typeof sfx !== 'undefined' && sfx && sfx.card) sfx.card(); }catch(_){}
  }
  function desfazer(){
    var c = cu(); if(!c || !anterior) return;
    Object.keys(c).forEach(function(k){ if(!(k in anterior)) delete c[k]; });
    Object.keys(anterior).forEach(function(k){ c[k] = anterior[k]; });
    anterior = null;
    if(typeof saveCu === 'function') saveCu();
    if(typeof sel !== 'undefined' && sel === 3 && typeof pick === 'function') pick(3);   // não troca o personagem do Center Run
    var chair = $('chair'); if(chair) chair.value = c.hair || '#ff7eb6';
    ['cstr', 'ceye', 'coutcol', 'cleg'].forEach(function(id){ var e = $(id), f = {cstr:'hair2', ceye:'eye', coutcol:'outcol', cleg:'legcol'}[id]; if(e && c[f]) e.value = c[f]; });
    depois(); atualizar();
  }
  function depois(){
    var c = cu(), d = $('custDesfazer');
    if(d) d.disabled = !anterior;
    [].forEach.call(document.querySelectorAll('[data-cm="desfazer"]'), function(b){ b.disabled = !anterior; });
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
  /* Visual de celular (15/11, ideia do BarbieGirls com arte nossa): o Idol fica numa redoma sobre um pedestal e as partes
     viram 3 passos — 1 Visual (penteadeira), 2 Roupa (guarda-roupa), 3 Acessórios (prateleira). Peça trancada pode ser
     PROVADA na redoma (só na prévia: nada é salvo nem comprado). */
  var PASSOS = [[0, '', 'Visual', [0, 1, 2, 3, 4, 5, 6, 7]], [1, '', 'Roupa', [8, 9]], [2, '', 'Acessórios', [10, 11]]];
  var TXT_CEL = {
    Visual:{pt:'Visual',en:'Look',es:'Look',id:'Tampilan',th:'ลุค',ja:'ルック'},
    Roupa:{pt:'Roupa',en:'Outfit',es:'Ropa',id:'Baju',th:'ชุด',ja:'服'},
    'Acessórios':{pt:'Acessórios',en:'Accessories',es:'Accesorios',id:'Aksesori',th:'เครื่องประดับ',ja:'アクセ'},
    provando:{pt:'Provando 👀 (não salva) · toque de novo para tirar',en:'Trying on 👀 (not saved) · tap again to remove',es:'Probando 👀 (no se guarda) · toca otra vez para quitar',
      id:'Mencoba 👀 (tidak disimpan) · ketuk lagi untuk melepas',th:'กำลังลอง 👀 (ไม่บันทึก) · แตะอีกครั้งเพื่อถอด',ja:'試着中 👀（保存されません）· もう一度タップで外す'},
    provar:{pt:'Provar',en:'Try on',es:'Probar',id:'Coba',th:'ลอง',ja:'試着'}};
  function celLigado(){ return !!window.TW_CELULAR_LIGADO; }
  function tc(k){ var l = typeof LANG === 'string' ? LANG : 'pt', d = TXT_CEL[k]; return d ? (d[l] || d.pt) : k; }
  var EXPR = [[0, '🙂', 'Normal'], [2, '😆', 'Feliz'], [3, '😉', 'Piscadinha'], [4, '😮', 'Surpresa'], [5, '😢', 'Chorinho'], [6, '😍', 'Apaixonado'], [1, '😣', 'Concentrado']];
  /* Favoritos: 3 visuais guardados neste aparelho (chave nova brs48cr_favs). Tocar num espaço cheio veste o
     visual; 💾 guarda o visual atual naquele espaço. Ao vestir, peças que não estão liberadas são ignoradas.
     A cor da pele não entra: ela só muda quando a pessoa escolhe. */
  var FAV_CHAVE = 'brs48cr_favs', FAV_CAMPOS = ['hair', 'hair2', 'eye', 'outcol', 'legcol', 'back', 'front', 'mecha', 'streak', 'det', 'olho',
    'sobrancelha', 'boca', 'bochecha', 'out', 'baixo', 'gl', 'hat'];
  function favLer(){ try{ var v = JSON.parse(localStorage.getItem(FAV_CHAVE) || '[]'); return Array.isArray(v) ? v.slice(0, 3) : []; }catch(_){ return []; } }
  function favGravar(l){ try{ localStorage.setItem(FAV_CHAVE, JSON.stringify(l.slice(0, 3))); }catch(_){} }
  function favGuardar(i){
    var c = cu(); if(!c) return; var l = favLer(), f = {};
    FAV_CAMPOS.forEach(function(k){ f[k] = c[k] == null ? (k === 'streak' ? false : '') : c[k]; });   // vazio vira '' para voltar exatamente igual
    while(l.length < i) l.push(null); l[i] = f; favGravar(l);
  }
  function favVestir(i, aoMudar){
    var c = cu(), f = favLer()[i]; if(!c || !f) return;
    anterior = JSON.parse(JSON.stringify(c));
    FAV_CAMPOS.forEach(function(k){
      if(f[k] === undefined) return;
      if(f[k] === null) f[k] = '';
      var id = CAMPO_ID[k];
      if(id && $(id) && $(id).tagName === 'SELECT' && livres(id).indexOf(String(f[k])) < 0 && !(k === 'hat' && f[k] === '')) return;   // peça trancada agora: fica a atual
      c[k] = f[k];
    });
    if(c.det === 'tulipa') c.hat = '';
    c.img = c.hair; c.streak = !!c.mecha;
    if(typeof saveCu === 'function') saveCu();
    if(typeof sel !== 'undefined' && sel === 3 && typeof pick === 'function') pick(3);
    depois(); atualizarTudo();
    if(aoMudar) try{ aoMudar('*'); }catch(_){}
    try{ if(typeof sfx !== 'undefined' && sfx && sfx.card) sfx.card(); }catch(_){}
  }
  var ESTADOS = {}, INSTANCIAS = [];
  function T(t){ return typeof tr === 'function' ? tr(t) : t; }
  function aplicar(mod, campo, v){ mod[campo] = v; if(campo === 'mecha') mod.streak = !!v;
    if(campo === 'hat'){ if(v === 'tulipa'){ mod.det = 'tulipa'; mod.hat = ''; } else if(mod.det === 'tulipa') mod.det = ''; } }
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
  /* Um estúdio = prévia + expressões + abas + grade. Pode existir em mais de um lugar (Center Run, Montar Idol
     do Perfil e da Zipper⭐Shop!); todos mudam os mesmos campos escondidos do editor (mesmo save e trancas).
     el: {cv, expr, abas, grade}; chave: guarda aba/expressão entre redesenhos; visivel(): se está na tela;
     aoMudar(campo): avisa a tela dona (ex.: o Perfil refaz a foto). */
  function Estudio(el, chave, visivel, aoMudar, mudar){
    var st = ESTADOS[chave] || (ESTADOS[chave] = {aba:0, expr:0, virado:false, passo:0, prova:null});
    var pedido = 0, pedidoMini = 0, eu = {};
    function prev(){
      var cv = el.cv, c = cu(); if(!cv || !c || !visivel()) return;
      if(typeof twNitido === 'function') twNitido(cv);   // prévia nítida no computador (17/11/2026)
      var x = cv.getContext('2d'), W = cv.width, H = cv.height, S = 6.3, chao = H - 28;
      x.clearRect(0, 0, W, H);
      if(celLigado()){ redoma(cv, c); return; }
      var bg = x.createRadialGradient(W / 2, H * .45, 10, W / 2, H * .5, W * .6);
      bg.addColorStop(0, '#ffffff'); bg.addColorStop(1, 'rgba(232,220,255,.9)');
      x.fillStyle = bg; x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(155,48,217,.12)'; x.beginPath(); x.ellipse(W / 2, chao, 100, 16, 0, 0, Math.PI * 2); x.fill();
      pintar(cv, c, S, W / 2 - 15 * S, chao - 44 * S, st.expr, st.virado);
    }
    // A redoma: pedestal com degrau, o Idol em pé e o vidro por cima (com reflexos e brilhinhos)
    function redoma(cv, c){
      var x = cv.getContext('2d'), W = cv.width, H = cv.height, cx = W / 2, topo = H - 66, S = 5.2;
      var f = x.createLinearGradient(0, 0, 0, H); f.addColorStop(0, '#fff4fb'); f.addColorStop(1, '#ffd9ee');
      x.fillStyle = f; x.fillRect(0, 0, W, H);
      // pedestal (dois degraus)
      x.fillStyle = '#e04f9c'; x.beginPath(); x.ellipse(cx, H - 22, 128, 17, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#ff8cc6'; x.fillRect(cx - 128, H - 46, 256, 24); x.beginPath(); x.ellipse(cx, H - 46, 128, 17, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#ffd0e8'; x.beginPath(); x.ellipse(cx, H - 46, 118, 13, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.ellipse(cx - 40, H - 49, 34, 4, 0, 0, Math.PI * 2); x.fill();
      var mod = c; if(st.prova){ mod = JSON.parse(JSON.stringify(c)); aplicar(mod, st.prova.campo, st.prova.valor); }
      pintar(cv, mod, S, cx - 15 * S, topo - 44 * S + 18, st.expr, st.virado);
      // vidro
      var R = 118, base = H - 48;
      x.save(); x.beginPath(); x.moveTo(cx - R, base); x.lineTo(cx - R, 140); x.arc(cx, 140, R, Math.PI, 0); x.lineTo(cx + R, base);
      x.fillStyle = 'rgba(214,236,255,.16)'; x.fill(); x.strokeStyle = 'rgba(255,255,255,.95)'; x.lineWidth = 4; x.stroke();
      x.strokeStyle = 'rgba(186,140,255,.55)'; x.lineWidth = 1.5; x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 7; x.lineCap = 'round';
      x.beginPath(); x.arc(cx, 140, R - 16, Math.PI * 1.08, Math.PI * 1.32); x.stroke();
      x.beginPath(); x.moveTo(cx - R + 16, 160); x.lineTo(cx - R + 16, 210); x.stroke();
      x.restore();
      x.fillStyle = '#fff'; [[cx + 78, 66, 7], [cx - 96, 108, 5], [cx + 100, 196, 4]].forEach(function(b){
        x.save(); x.translate(b[0], b[1]); x.beginPath(); for(var i = 0; i < 8; i++){ var r = i % 2 ? b[2] * .35 : b[2], a = i * Math.PI / 4; x.lineTo(Math.cos(a) * r, Math.sin(a) * r); } x.closePath(); x.fill(); x.restore(); });
      var dica = el.cv && el.cv.parentNode && el.cv.parentNode.querySelector('.cmprova');
      if(dica){ dica.hidden = !st.prova; dica.textContent = tc('provando'); }
    }
    function miniaturas(){
      var box = el.grade, c = cu(), p = PARTES[st.aba], sel = p && $(p.id); if(!box || !c || !sel || !visivel()) return;
      try{ if(window.TWAvatarHair && TWAvatarHair.rotular) TWAvatarHair.rotular(); }catch(_){}
      var atual = p.campo === 'mecha' ? (c.mecha || (c.streak ? 'uma' : '')) : p.campo === 'hat' && c.det === 'tulipa' ? 'tulipa' : (c[p.campo] || '');
      box.setAttribute('aria-labelledby', chave + 'Aba' + st.aba);
      box.innerHTML = '';
      [].forEach.call(sel.options, function(o){
        var b = document.createElement('button'); b.type = 'button'; b.className = 'cmmini';
        var podeProvar = o.disabled && celLigado();
        b.setAttribute('aria-pressed', String(podeProvar ? !!(st.prova && st.prova.campo === p.campo && st.prova.valor === o.value) : o.value === atual)); b.disabled = o.disabled && !podeProvar;
        if(podeProvar) b.classList.add('cmprovar');
        b.setAttribute('aria-label', o.textContent);
        var cv = document.createElement('canvas'); cv.width = 132; cv.height = 132; cv.setAttribute('aria-hidden', 'true');
        if(window.TW_NITIDEZ) TW_NITIDEZ.preparar(cv);   // 17/11: miniatura nasce na densidade do aparelho (era borrada)
        var nome = document.createElement('span'); nome.textContent = o.textContent.replace(/^🔒\s*/, '');
        b.appendChild(cv); b.appendChild(nome);
        var mod = JSON.parse(JSON.stringify(c)); mod[p.campo] = o.value; if(p.campo === 'mecha') mod.streak = !!o.value;
        if(p.campo === 'hat'){ if(o.value === 'tulipa'){ mod.det = 'tulipa'; mod.hat = ''; } else if(mod.det === 'tulipa') mod.det = ''; }
        if(o.disabled){ var tr2 = document.createElement('i'); tr2.className = 'cmtranca'; tr2.textContent = podeProvar ? '👀' : '🔒'; tr2.setAttribute('aria-hidden', 'true'); b.appendChild(tr2);
          if(podeProvar) b.setAttribute('aria-label', tc('provar') + ': ' + o.textContent.replace(/^🔒\s*/, '')); }
        // corte: do topo à cintura (dá para ver curto × longo); franja/mecha/detalhe: a cabeça; rosto: zoom no rosto
        var rosto = /^(olho|sobrancelha|boca|bochecha|gl)$/.test(p.campo), corte = p.campo === 'back', corpo = p.campo === 'out' || p.campo === 'baixo',
            chapeu = p.campo === 'hat',
            S = rosto ? 6.2 : corte ? 2.6 : corpo ? 2.35 : chapeu ? 3.4 : 4.4, meio = rosto ? 19 : corte ? 16 : corpo ? 19.5 : chapeu ? 8.5 : 12.5;
        pintar(cv, mod, S, 66 - 15 * S, 66 - meio * S, 0, false);
        b.addEventListener('click', function(){
          if(b.disabled) return;
          if(podeProvar){ st.prova = st.prova && st.prova.campo === p.campo && st.prova.valor === o.value ? null : {campo:p.campo, valor:o.value}; eu.atualizar(); return; }
          st.prova = null;
          if(mudar) mudar(p.campo, o.value); else trocar(p.id, o.value); atualizarTudo(); });
        box.appendChild(b);
      });
    }
    function passosUI(){   // só no visual de celular: os 3 móveis (penteadeira, guarda-roupa, prateleira)
      var box = el.abas; if(!box || !celLigado()) return;
      var nav = box.previousElementSibling && box.previousElementSibling.classList.contains('cmpassos') ? box.previousElementSibling : null;
      if(!nav){ nav = document.createElement('div'); nav.className = 'cmpassos'; nav.setAttribute('role', 'group'); box.parentNode.insertBefore(nav, box);
        PASSOS.forEach(function(g){ var b = document.createElement('button'); b.type = 'button'; b.className = 'cmpasso cmpasso' + g[0]; b.dataset.passo = g[0];
          b.innerHTML = '<em aria-hidden="true">' + ('0' + (g[0] + 1)) + '</em><span>' + tc(g[2]) + '</span>';
          b.addEventListener('click', function(){ st.passo = g[0]; st.aba = g[3][0]; passosUI(); miniaturas(); });
          nav.appendChild(b); }); }
      var g = PASSOS[st.passo] || PASSOS[0]; if(g[3].indexOf(st.aba) < 0){ st.passo = PASSOS.filter(function(q){ return q[3].indexOf(st.aba) >= 0; })[0][0]; g = PASSOS[st.passo]; }
      [].forEach.call(nav.children, function(b){ b.setAttribute('aria-pressed', String(+b.dataset.passo === st.passo)); });
      [].forEach.call(box.children, function(b, i){ b.hidden = g[3].indexOf(i) < 0; b.setAttribute('aria-selected', String(i === st.aba)); });
    }
    function abas(){
      var box = el.abas; if(!box || box.childElementCount){ passosUI(); return; }
      PARTES.forEach(function(p, i){
        var b = document.createElement('button'); b.type = 'button'; b.id = chave + 'Aba' + i; b.setAttribute('role', 'tab');
        b.textContent = T(p.nome); b.setAttribute('aria-selected', String(i === st.aba));
        b.addEventListener('click', function(){ st.aba = i; [].forEach.call(box.children, function(x, k){ x.setAttribute('aria-selected', String(k === i)); }); miniaturas(); });
        box.appendChild(b);
      });
      passosUI();
    }
    function expressoes(){
      var box = el.expr; if(!box || box.childElementCount) return;
      EXPR.forEach(function(e){
        var b = document.createElement('button'); b.type = 'button'; b.textContent = e[1]; b.setAttribute('aria-label', T(e[2]));
        b.setAttribute('aria-pressed', String(e[0] === st.expr));
        b.addEventListener('click', function(){ st.expr = e[0]; [].forEach.call(box.children, function(x){ if(x.dataset.girar !== '1') x.setAttribute('aria-pressed', String(x === b)); }); prev(); });
        box.appendChild(b);
      });
      var g = document.createElement('button'); g.type = 'button'; g.dataset.girar = '1'; g.textContent = '↔'; g.setAttribute('aria-label', T('Girar'));
      g.setAttribute('aria-pressed', String(st.virado));
      g.addEventListener('click', function(){ st.virado = !st.virado; g.setAttribute('aria-pressed', String(st.virado)); prev(); });
      box.appendChild(g);
    }
    // Redesenha no próximo quadro (prévia) e um pouco depois (miniaturas), sem repetir trabalho.
    eu.atualizar = function(){
      if(!pedido) pedido = requestAnimationFrame(function(){ pedido = 0; prev(); });
      clearTimeout(pedidoMini); pedidoMini = setTimeout(miniaturas, 120);
    };
    function favoritos(){
      var box = el.favs; if(!box || !visivel()) return;
      var l = favLer(); box.innerHTML = '<span class="cmfavt">' + T('Favoritos') + '</span>';
      for(var i = 0; i < 3; i++) (function(i){
        var f = l[i], w = document.createElement('div'); w.className = 'cmfav';
        var b = document.createElement('button'); b.type = 'button'; b.className = 'cmfavvestir';
        if(f){ var cv = document.createElement('canvas'); cv.width = 96; cv.height = 96; cv.setAttribute('aria-hidden', 'true'); b.appendChild(cv);
          b.setAttribute('aria-label', T('Vestir favorito') + ' ' + (i + 1)); pintar(cv, Object.assign({}, cu(), f), 3.2, 48 - 15 * 3.2, 48 - 13 * 3.2, 0, false);
          b.addEventListener('click', function(){ favVestir(i, aoMudar); });
        } else { b.textContent = '＋'; b.disabled = true; b.setAttribute('aria-label', T('Espaço vazio') + ' ' + (i + 1)); }
        var g = document.createElement('button'); g.type = 'button'; g.className = 'cmfavguardar'; g.textContent = T('Salvar');
        g.setAttribute('aria-label', T('Guardar visual atual no espaço') + ' ' + (i + 1));
        g.addEventListener('click', function(){ favGuardar(i); favoritos(); });
        w.appendChild(b); w.appendChild(g); box.appendChild(w);
      })(i);
    }
    var atualizarBase = eu.atualizar;
    eu.atualizar = function(){ atualizarBase(); clearTimeout(eu.tf); eu.tf = setTimeout(favoritos, 140); };
    eu.vivo = function(){ return !!(el.cv && el.cv.isConnected); };
    abas(); expressoes(); eu.atualizar();
    return eu;
  }
  function atualizarTudo(){ INSTANCIAS = INSTANCIAS.filter(function(i){ return i.vivo(); }); INSTANCIAS.forEach(function(i){ i.atualizar(); }); }
  var atualizar = atualizarTudo;
  function estudio(){
    var cust = $('cust'); if(!cust || !$('cmCv')) return;
    INSTANCIAS.push(Estudio({cv:$('cmCv'), expr:$('cmExpr'), abas:$('cmAbas'), grade:$('cmGrade'), favs:$('cmFavs')}, 'cm', function(){ return !cust.hidden; }));
    ['cust', 'cust_roupa'].forEach(function(id){ var e = $(id); if(e && !e.dataset.cmOuvindo){ e.dataset.cmOuvindo = '1'; e.addEventListener('input', atualizarTudo, true); e.addEventListener('change', atualizarTudo, true); e.addEventListener('click', atualizarTudo, true); } });
    // a aba do Você abre por pick(3): redesenha quando o editor aparece
    if(typeof MutationObserver === 'function' && !cust.dataset.cmObs){ cust.dataset.cmObs = '1'; new MutationObserver(function(){ if(!cust.hidden) atualizarTudo(); }).observe(cust, {attributes:true, attributeFilter:['hidden']}); }
  }
  // Estúdio dentro de outra tela (Montar Idol do Perfil e da Zipper⭐Shop!): monta no topo de "raiz".
  function montar(raiz, aoMudar){
    if(!raiz || !$('cmCv')) return null;
    var velho = raiz.querySelector(':scope > .cmestudio'); if(velho) velho.remove();
    var chave = 'cm' + (raiz.id || 'x'), box = document.createElement('div'); box.className = 'cmestudio';
    box.innerHTML = '<div class="cmprev"><canvas class="cmcv" width="440" height="360" role="img" aria-label="' + T('Prévia do visual') + '"></canvas><p class="cmprova" role="status" hidden></p>' +
      '<div class="cmexpr" role="group" aria-label="' + T('Expressões') + '"></div>' +
      '<div class="custacoes"><button type="button" class="btn alt" data-cm="sortear">🎲 <span>' + T('Sortear') + '</span></button><button type="button" class="btn alt" data-cm="desfazer"' + (anterior ? '' : ' disabled') + '>↩ <span>' + T('Desfazer') + '</span></button></div></div>' +
      '<div class="cmfavs" role="group" aria-label="' + T('Favoritos') + '"></div><div class="cmabas" role="tablist" aria-label="' + T('Partes') + '"></div><div class="cmgrade" role="tabpanel"></div>';
    raiz.insertBefore(box, raiz.firstChild); raiz.classList.add('cmativo');
    box.querySelector('[data-cm="sortear"]').addEventListener('click', function(){ sortear(true); if(aoMudar) try{ aoMudar('*'); }catch(_){} });
    box.querySelector('[data-cm="desfazer"]').addEventListener('click', function(){ desfazer(); if(aoMudar) try{ aoMudar('*'); }catch(_){} });
    var i = Estudio({cv:box.querySelector('.cmcv'), expr:box.querySelector('.cmexpr'), abas:box.querySelector('.cmabas'), grade:box.querySelector('.cmgrade'), favs:box.querySelector('.cmfavs')},
      chave, function(){ return box.isConnected && box.offsetParent !== null; }, aoMudar,
      typeof perfMontMudou === 'function' ? function(campo, v){ perfMontMudou(campo, v); } : null);   // grava sempre no Você
    INSTANCIAS.push(i);
    if(!raiz.dataset.cmOuvindo){ raiz.dataset.cmOuvindo = '1'; ['input', 'change', 'click'].forEach(function(ev){ raiz.addEventListener(ev, function(){ setTimeout(atualizarTudo, 0); }, true); }); }
    setTimeout(atualizarTudo, 60);
    return i;
  }
  function iniciar(){
    paleta(); estudio();
    var s = $('custSortear'), d = $('custDesfazer');
    if(s && !s.dataset.ligado){ s.dataset.ligado = '1'; s.addEventListener('click', function(){ sortear(false); }); }
    if(d && !d.dataset.ligado){ d.dataset.ligado = '1'; d.addEventListener('click', desfazer); }
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  window.TW_CHARMAKER = { paleta:PALETA.slice(), sortear:sortear, desfazer:desfazer, partes:PARTES.map(function(p){ return p.campo; }), atualizar:atualizarTudo, montar:montar, favoritos:favLer };
})();
