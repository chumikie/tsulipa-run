/* TsuLiPa⭐World · Passatempos do dia (21/11/2026 · PR das melhorias, parte 5).
   Inspirados nos joguinhos antigos do site da Turma da Mônica: caça-palavras, 5 diferenças e labirinto, rápidos,
   desenhados aqui mesmo no Canvas e iguais para todo mundo no mesmo dia (sorteio pelo dia de Brasília).
   Cada um vale ★5 uma vez por dia (passatempo_feito); fazer os três no mesmo dia dá a insígnia 🧩 Passatempo em dia.
   Entra no "Hoje" e no Menu. Atalhos: [data-twpa="abrir"] e [data-twpa="caca"|"dif"|"lab"].
   API: window.TW_PASSA = {t, feitos, abrir, contaMudou}. */
(function(){
  'use strict';
  var TXT = {
    tit:{pt:'Passatempos do dia',en:'Daily puzzles',es:'Pasatiempos del día',id:'Teka-teki harian',th:'เกมคลายเครียดประจำวัน',ja:'今日のあそび'},
    sub:{pt:'{f}/3 feitos · ★{p} cada',en:'{f}/3 done · ★{p} each',es:'{f}/3 hechos · ★{p} cada uno',id:'{f}/3 selesai · ★{p} masing-masing',th:'ทำแล้ว {f}/3 · ★{p} ต่ออัน',ja:'{f}/3 クリア · 各★{p}'},
    subOk:{pt:'Os 3 de hoje feitos!',en:'All 3 done today!',es:'¡Los 3 de hoy hechos!',id:'Ketiganya selesai hari ini!',th:'ทำครบ 3 อย่างวันนี้แล้ว!',ja:'今日の3つクリア！'},
    jogar:{pt:'Jogar',en:'Play',es:'Jugar',id:'Main',th:'เล่น',ja:'あそぶ'},
    caca:{pt:'Caça-palavras',en:'Word search',es:'Sopa de letras',id:'Cari kata',th:'ค้นหาคำ',ja:'ことばさがし'},
    dif:{pt:'5 diferenças',en:'Spot 5 differences',es:'5 diferencias',id:'5 perbedaan',th:'จับผิดภาพ 5 จุด',ja:'まちがいさがし5つ'},
    lab:{pt:'Labirinto',en:'Maze',es:'Laberinto',id:'Labirin',th:'เขาวงกต',ja:'めいろ'},
    cacaDica:{pt:'Toque na primeira e na última letra de cada palavra.',en:'Tap the first and last letter of each word.',es:'Toca la primera y la última letra de cada palabra.',id:'Ketuk huruf pertama dan terakhir tiap kata.',th:'แตะตัวอักษรตัวแรกและตัวสุดท้ายของแต่ละคำ',ja:'ことばの最初と最後の文字をタップしてね。'},
    difDica:{pt:'Toque nas 5 coisas que mudaram na foto de baixo.',en:'Tap the 5 things that changed in the bottom picture.',es:'Toca las 5 cosas que cambiaron en la foto de abajo.',id:'Ketuk 5 hal yang berubah di gambar bawah.',th:'แตะ 5 จุดที่เปลี่ยนไปในรูปล่าง',ja:'下の絵でちがう5か所をタップしてね。'},
    labDica:{pt:'Leve o 🐾 até o 🎤 (setas, deslizar ou teclado).',en:'Take 🐾 to 🎤 (arrows, swipe or keyboard).',es:'Lleva 🐾 hasta 🎤 (flechas, deslizar o teclado).',id:'Bawa 🐾 ke 🎤 (panah, geser, atau keyboard).',th:'พา 🐾 ไปหา 🎤 (ลูกศร ปัด หรือคีย์บอร์ด)',ja:'🐾を🎤まで連れていこう（矢印・スワイプ・キーボード）。'},
    achou:{pt:'{n}/{t} achadas',en:'{n}/{t} found',es:'{n}/{t} encontradas',id:'{n}/{t} ketemu',th:'เจอแล้ว {n}/{t}',ja:'{n}/{t} みつけた'},
    pronto:{pt:'Conseguiu! 🎉',en:'You did it! 🎉',es:'¡Lo lograste! 🎉',id:'Berhasil! 🎉',th:'ทำได้แล้ว! 🎉',ja:'できた！🎉'},
    ganhou:{pt:'{j}: +★{p}',en:'{j}: +★{p}',es:'{j}: +★{p}',id:'{j}: +★{p}',th:'{j}: +★{p}',ja:'{j}: +★{p}'},
    jaFeito:{pt:'Hoje este já valeu estrelas; jogar de novo é só pela diversão.',en:'This one already paid stars today; replay just for fun.',es:'Este ya dio estrellas hoy; jugar de nuevo es solo por diversión.',id:'Yang ini sudah memberi bintang hari ini; main lagi cuma untuk seru-seruan.',th:'อันนี้ได้ดาววันนี้แล้ว เล่นอีกเพื่อความสนุก',ja:'今日はもうスター獲得ずみ。あとはお楽しみで！'},
    semConta:{pt:'Entre com Google para ganhar as estrelas.',en:'Sign in with Google to earn the stars.',es:'Entra con Google para ganar las estrellas.',id:'Masuk dengan Google untuk dapat bintang.',th:'เข้าสู่ระบบด้วย Google เพื่อรับดาว',ja:'スターをもらうにはGoogleでログインしてね。'},
    voltar:{pt:'Voltar',en:'Back',es:'Volver',id:'Kembali',th:'กลับ',ja:'もどる'},
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'とじる'},
    cima:{pt:'Cima',en:'Up',es:'Arriba',id:'Atas',th:'ขึ้น',ja:'うえ'},
    baixo:{pt:'Baixo',en:'Down',es:'Abajo',id:'Bawah',th:'ลง',ja:'した'},
    esq:{pt:'Esquerda',en:'Left',es:'Izquierda',id:'Kiri',th:'ซ้าย',ja:'ひだり'},
    dir:{pt:'Direita',en:'Right',es:'Derecha',id:'Kanan',th:'ขวา',ja:'みぎ'},
    insignia:{pt:'Os 3 passatempos de hoje! 🧩',en:'All 3 puzzles today! 🧩',es:'¡Los 3 pasatiempos de hoy! 🧩',id:'3 teka-teki hari ini! 🧩',th:'ครบ 3 เกมวันนี้! 🧩',ja:'今日の3つ全部！🧩'}
  };
  var PREMIO = 5, TIPOS = ['caca', 'dif', 'lab'];
  function L(){ var l = typeof LANG === 'string' ? LANG : 'pt'; return TXT.tit[l] ? l : 'pt'; }
  function t(k, v){ var s = (TXT[k] && (TXT[k][L()] || TXT[k].pt)) || k; return s.replace(/\{(\w+)\}/g, function(_, n){ return v && v[n] != null ? v[n] : ''; }); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem conta')); }
  function lerLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function gravarLS(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function aviso(txt, ic){ if(window.TW_CELULAR && TW_CELULAR.toast) TW_CELULAR.toast(txt, ic || '🧩'); else if(typeof contaAviso === 'function') contaAviso(txt); }
  function som(f, d){ if(typeof beep === 'function') try{ beep(f, d || .05, 'triangle', .04); }catch(e){} }
  function redesenhar(){ try{ window.dispatchEvent(new Event('tw-semana')); }catch(e){} }
  function hoje(){ return new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }   // Brasília
  // sorteio do dia: o mesmo para todo mundo
  function semente(s){ var h = 1779033703 ^ s.length; for(var i = 0; i < s.length; i++){ h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return h >>> 0; }
  function sorteio(s){ var a = semente(s); return function(){ a |= 0; a = a + 0x6D2B79F5 | 0; var r = Math.imul(a ^ a >>> 15, 1 | a); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }

  // ---------- o que já foi feito hoje ----------
  var feitosSrv = null, feitosDia = '';
  function chaveLocal(){ return 'tw_passa:' + hoje(); }
  function feitos(){
    var loc = (lerLS(chaveLocal()) || '').split(',').filter(Boolean);
    var srv = feitosDia === hoje() && feitosSrv ? feitosSrv : [];
    return TIPOS.filter(function(k){ return loc.indexOf(k) >= 0 || srv.indexOf(k) >= 0; });
  }
  function carregar(){
    if(!logado()) return;
    rpc('passatempos_hoje').then(function(r){ if(r && Array.isArray(r.feitos)){ feitosSrv = r.feitos; feitosDia = hoje(); redesenhar(); } }).catch(function(){});
  }
  function concluir(tipo){
    var antes = feitos(), loc = (lerLS(chaveLocal()) || '').split(',').filter(Boolean);
    if(loc.indexOf(tipo) < 0){ loc.push(tipo); gravarLS(chaveLocal(), loc.join(',')); }
    som(1319, .12); setTimeout(function(){ som(1568, .14); }, 110);
    var depois = feitos();
    if(depois.length === 3 && antes.length < 3 && typeof conqGanhar === 'function'){ try{ if(conqGanhar('jogo_passatempo')) aviso(t('insignia'), '🧩'); }catch(e){} }
    if(!logado()){ status(t('pronto') + ' ' + t('semConta')); redesenhar(); return; }
    rpc('passatempo_feito', {p_tipo:tipo}).then(function(r){
      if(r && r.ok){
        feitosSrv = (feitosDia === hoje() && feitosSrv ? feitosSrv : []).concat([tipo]); feitosDia = hoje();
        if(r.pago){ if(typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; gravarLS('brs48cr_st', starT); if(typeof setBest === 'function') setBest(); } aviso(t('ganhou', {j:t(tipo), p:r.premio || PREMIO}), '🌟'); status(t('pronto') + ' +★' + (r.premio || PREMIO)); }
        else status(t('pronto'));
      } else status(t('pronto'));
      redesenhar();
    }).catch(function(){ status(t('pronto')); redesenhar(); });
  }

  // ---------- janela ----------
  var ov = null, voltarFoco = null, jogo = null;
  function fechar(){ jogo = null; if(ov){ ov.hidden = true; ov.replaceChildren(); } var f = voltarFoco; voltarFoco = null; if(f && f.isConnected) try{ f.focus(); }catch(e){} }
  function janela(html){
    if(!ov){
      ov = document.createElement('div'); ov.className = 'ov twp-ov twk-ov twpa-ov'; ov.hidden = true; document.body.appendChild(ov);
      ov.addEventListener('click', function(e){ if(e.target === ov || (e.target.closest && e.target.closest('[data-twpa-x]'))) fechar(); });
    }
    if(ov.hidden){ var at = document.activeElement; voltarFoco = at && at !== document.body ? at : null; }
    ov.innerHTML = '<div class="panel twp-panel twk-panel twpa-panel" role="dialog" aria-modal="true" aria-labelledby="twpaTit">' + html + '</div>';
    ov.hidden = false;
    var foco = ov.querySelector('[data-twpa-foco]') || ov.querySelector('.btn'); if(foco) try{ foco.focus(); }catch(e){}
  }
  function status(txt){ var s = ov && ov.querySelector('.twpa-status'); if(s) s.textContent = txt; }
  window.addEventListener('keydown', function(e){
    if(!ov || ov.hidden) return;
    if(e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); fechar(); return; }
    if(jogo && jogo.tecla && /^Arrow/.test(e.key)){ e.preventDefault(); e.stopImmediatePropagation(); jogo.tecla(e.key); return; }
    if(e.key !== 'Tab') return;
    var it = Array.from(ov.querySelectorAll('button,a[href],input')).filter(function(el){ return !el.disabled && el.getClientRects().length; });
    if(!it.length) return;
    var a = document.activeElement, p = it[0], u = it[it.length - 1];
    if(e.shiftKey && (a === p || !ov.contains(a))){ e.preventDefault(); e.stopImmediatePropagation(); u.focus(); }
    else if(!e.shiftKey && (a === u || !ov.contains(a))){ e.preventDefault(); e.stopImmediatePropagation(); p.focus(); }
  }, true);
  function topo(tipo){
    return '<h2 class="twp-tit" id="twpaTit">🧩 ' + esc(tipo ? t(tipo) : t('tit')) + '</h2>';
  }
  function rodape(){ return '<p class="twpa-status" role="status" aria-live="polite"></p><div class="btns"><button type="button" class="btn alt" data-twpa="abrir">' + esc(t('voltar')) + '</button><button type="button" class="btn alt" data-twpa-x>' + esc(t('fechar')) + '</button></div>'; }
  function abrir(){
    jogo = null; carregar();
    var f = feitos();
    janela(topo() + '<ul class="twpa-lista">' + TIPOS.map(function(k){
      var ok = f.indexOf(k) >= 0, ic = {caca:'🔤', dif:'🔍', lab:'🌀'}[k];
      return '<li><button type="button" class="twpa-item' + (ok ? ' ok' : '') + '" data-twpa="' + k + '"><span class="twpa-ic" aria-hidden="true">' + ic + '</span><b>' + esc(t(k)) + '</b><em>' + (ok ? '✓' : '★' + PREMIO) + '</em></button></li>';
    }).join('') + '</ul><p class="twk-nota">' + esc(f.length >= 3 ? t('subOk') : t('sub', {f:f.length, p:PREMIO})) + '</p><div class="btns"><button type="button" class="btn alt" data-twpa-x>' + esc(t('fechar')) + '</button></div>');
  }
  function aviso1(tipo){ return feitos().indexOf(tipo) >= 0 ? '<p class="twk-nota">' + esc(t('jaFeito')) + '</p>' : ''; }

  // ---------- caça-palavras ----------
  var PALAVRAS = ['TSU', 'LIRIKA', 'PATI', 'CENTER', 'IDOL', 'PALCO', 'KARAOKE', 'SORA', 'CHU', 'KOALI', 'PUCCHI', 'ESTRELA', 'OSHI', 'SENBATSU', 'MOCHI', 'DANGO', 'ZIPPER', 'GACHA', 'FESTIVAL', 'CAMARIM', 'POLAROID', 'DUO', 'CAFE', 'BLOOM'];
  function montarCaca(){
    var N = 9, r = sorteio(hoje() + ':caca'), g = [], usadas = [], dirs = [[0, 1], [1, 0], [1, 1]];
    for(var i = 0; i < N * N; i++) g.push('');
    var pool = PALAVRAS.filter(function(w){ return w.length <= N - 1; }).slice();
    while(usadas.length < 5 && pool.length){
      var w = pool.splice(Math.floor(r() * pool.length), 1)[0];
      for(var tent = 0; tent < 200; tent++){
        var d = dirs[Math.floor(r() * dirs.length)], l0 = Math.floor(r() * (N - d[0] * (w.length - 1))), c0 = Math.floor(r() * (N - d[1] * (w.length - 1))), ok = true, cel = [];
        for(var j = 0; j < w.length; j++){ var ix = (l0 + d[0] * j) * N + c0 + d[1] * j; if(g[ix] && g[ix] !== w[j]){ ok = false; break; } cel.push(ix); }
        if(!ok) continue;
        cel.forEach(function(ix, j){ g[ix] = w[j]; }); usadas.push({w:w, cel:cel, ok:false}); break;
      }
    }
    var AZ = 'ABCDEFGHIJKLMNOPRSTUVZ';
    for(var k = 0; k < g.length; k++) if(!g[k]) g[k] = AZ[Math.floor(r() * AZ.length)];
    return {N:N, g:g, palavras:usadas};
  }
  function jogarCaca(){
    var C = montarCaca(), sel = -1, achados = {};
    function html(){
      return topo('caca') + '<p class="twk-txt">' + esc(t('cacaDica')) + '</p>' + aviso1('caca') +
        '<ul class="twpa-palavras">' + C.palavras.map(function(p){ return '<li' + (p.ok ? ' class="ok"' : '') + '>' + esc(p.w) + '</li>'; }).join('') + '</ul>' +
        '<div class="twpa-grade" style="--n:' + C.N + '" role="grid">' + C.g.map(function(ch, i){
          return '<button type="button" class="twpa-letra' + (achados[i] ? ' ok' : '') + (sel === i ? ' sel' : '') + '" data-pc="' + i + '" aria-label="' + esc(ch + ' ' + (Math.floor(i / C.N) + 1) + '-' + (i % C.N + 1)) + '"' + (i === 0 ? ' data-twpa-foco' : '') + '>' + esc(ch) + '</button>';
        }).join('') + '</div>' + rodape();
    }
    function tocar(i){
      if(sel < 0){ sel = i; som(880); return pintar(i); }
      var a = sel; sel = -1;
      var la = Math.floor(a / C.N), ca = a % C.N, lb = Math.floor(i / C.N), cb = i % C.N, dl = Math.sign(lb - la), dc = Math.sign(cb - ca);
      var passos = Math.max(Math.abs(lb - la), Math.abs(cb - ca));
      if(a === i || !(la === lb || ca === cb || Math.abs(lb - la) === Math.abs(cb - ca))){ som(330); return pintar(i); }
      var cel = []; for(var j = 0; j <= passos; j++) cel.push((la + dl * j) * C.N + ca + dc * j);
      var s = cel.map(function(x){ return C.g[x]; }).join(''), inv = s.split('').reverse().join('');
      var p = C.palavras.filter(function(q){ return !q.ok && (q.w === s || q.w === inv); })[0];
      if(!p){ som(330); return pintar(i); }
      p.ok = true; cel.forEach(function(x){ achados[x] = 1; }); som(1175, .08);
      pintar(i);
      if(C.palavras.every(function(q){ return q.ok; })) concluir('caca');
      else status(t('achou', {n:C.palavras.filter(function(q){ return q.ok; }).length, t:C.palavras.length}));
    }
    function pintar(foco){
      janela(html());
      var b = ov.querySelector('[data-pc="' + foco + '"]'); if(b) try{ b.focus(); }catch(e){}
      if(C.palavras.every(function(q){ return q.ok; })) status(t('pronto'));
    }
    jogo = {tipo:'caca', tocar:tocar};
    janela(html());
  }

  // ---------- 5 diferenças ----------
  var COISAS = ['⭐', '💖', '🎵', '🌸', '🎤', '🍡', '🎀', '✨', '🌙', '💜', '💚', '💙', '🍓', '🎶', '🌟', '🧁'];
  function montarDif(){
    var r = sorteio(hoje() + ':dif'), W = 320, H = 170, obj = [];
    for(var tent = 0; obj.length < 13 && tent < 400; tent++){
      var s = 20 + Math.floor(r() * 14), x = 22 + r() * (W - 44), y = 22 + r() * (H - 52);
      if(obj.some(function(o){ return Math.hypot(o.x - x, o.y - y) < (o.s + s) * .75; })) continue;
      obj.push({e:COISAS[Math.floor(r() * COISAS.length)], x:x, y:y, s:s});
    }
    var idx = obj.map(function(_, i){ return i; }), dif = [];
    while(dif.length < 5){ var i = idx.splice(Math.floor(r() * idx.length), 1)[0], tipo = ['some', 'troca', 'grande'][Math.floor(r() * 3)], nova = obj[i].e;
      if(tipo === 'troca') while(nova === obj[i].e) nova = COISAS[Math.floor(r() * COISAS.length)];
      dif.push({i:i, tipo:tipo, e:nova, x:obj[i].x, y:obj[i].y, s:obj[i].s, ok:false}); }
    return {W:W, H:H, obj:obj, dif:dif};
  }
  function desenharDif(cv, D, b){
    var dpr = Math.min(2, window.devicePixelRatio || 1), x = cv.getContext('2d');
    cv.width = D.W * dpr; cv.height = D.H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var gr = x.createLinearGradient(0, 0, 0, D.H); gr.addColorStop(0, '#d9ccff'); gr.addColorStop(.7, '#ffe0f0'); gr.addColorStop(1, '#ffd0e6');
    x.fillStyle = gr; x.fillRect(0, 0, D.W, D.H);
    x.fillStyle = '#7b3ff0'; x.fillRect(0, D.H - 22, D.W, 22); x.fillStyle = '#9b30d9'; x.fillRect(0, D.H - 22, D.W, 4);   // palco
    x.textAlign = 'center'; x.textBaseline = 'middle';
    D.obj.forEach(function(o, i){
      var d = b ? D.dif.filter(function(q){ return q.i === i; })[0] : null, e = o.e, s = o.s;
      if(d && d.tipo === 'some') return;
      if(d && d.tipo === 'troca') e = d.e;
      if(d && d.tipo === 'grande') s = Math.round(s * 1.6);
      x.font = s + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; x.fillText(e, o.x, o.y);
    });
    D.dif.forEach(function(q){ if(!q.ok) return; x.strokeStyle = '#ff2d8a'; x.lineWidth = 3; x.beginPath(); x.arc(q.x, q.y, q.s * .95, 0, Math.PI * 2); x.stroke(); });
  }
  function jogarDif(){
    var D = montarDif();
    janela(topo('dif') + '<p class="twk-txt">' + esc(t('difDica')) + '</p>' + aviso1('dif') +
      '<div class="twpa-fotos"><canvas class="twpa-cv" data-difa="1" aria-hidden="true"></canvas><canvas class="twpa-cv twpa-cv-b" data-difb="1" role="img" aria-label="' + esc(t('difDica')) + '"></canvas></div>' + rodape());
    var A = ov.querySelector('[data-difa]'), B = ov.querySelector('[data-difb]');
    function pintar(){ desenharDif(A, D, false); desenharDif(B, D, true); }
    pintar();
    function toque(e){
      var cv = e.currentTarget, rc = cv.getBoundingClientRect(), px = (e.clientX - rc.left) / rc.width * D.W, py = (e.clientY - rc.top) / rc.height * D.H;
      var q = D.dif.filter(function(d){ return !d.ok && Math.hypot(d.x - px, d.y - py) < Math.max(24, d.s); })[0];
      if(!q){ som(330); cv.classList.remove('twpa-erro'); void cv.offsetWidth; cv.classList.add('twpa-erro'); return; }
      q.ok = true; som(1175, .08); pintar();
      var n = D.dif.filter(function(d){ return d.ok; }).length;
      if(n === D.dif.length) concluir('dif'); else status(t('achou', {n:n, t:D.dif.length}));
    }
    A.addEventListener('pointerup', toque); B.addEventListener('pointerup', toque);
    jogo = {tipo:'dif'};
  }

  // ---------- labirinto ----------
  function montarLab(){
    var N = 9, r = sorteio(hoje() + ':lab'), P = [];   // paredes: [cima, direita, baixo, esquerda]
    for(var i = 0; i < N * N; i++) P.push([1, 1, 1, 1]);
    var vis = {}, pilha = [0]; vis[0] = 1;
    var DL = [[-1, 0, 0, 2], [0, 1, 1, 3], [1, 0, 2, 0], [0, -1, 3, 1]];
    while(pilha.length){
      var c = pilha[pilha.length - 1], l = Math.floor(c / N), k = c % N;
      var viz = DL.filter(function(d){ var l2 = l + d[0], k2 = k + d[1]; return l2 >= 0 && l2 < N && k2 >= 0 && k2 < N && !vis[l2 * N + k2]; });
      if(!viz.length){ pilha.pop(); continue; }
      var d = viz[Math.floor(r() * viz.length)], n = (l + d[0]) * N + k + d[1];
      P[c][d[2]] = 0; P[n][d[3]] = 0; vis[n] = 1; pilha.push(n);
    }
    return {N:N, P:P, eu:0, fim:N * N - 1, passos:0};
  }
  function desenharLab(cv, M){
    var T = 32, S = M.N * T + 4, dpr = Math.min(2, window.devicePixelRatio || 1), x = cv.getContext('2d');
    cv.width = S * dpr; cv.height = S * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    x.fillStyle = '#fff7fb'; x.fillRect(0, 0, S, S);
    x.strokeStyle = '#7b3ff0'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath();
    M.P.forEach(function(w, i){
      var X = 2 + (i % M.N) * T, Y = 2 + Math.floor(i / M.N) * T;
      if(w[0]){ x.moveTo(X, Y); x.lineTo(X + T, Y); } if(w[1]){ x.moveTo(X + T, Y); x.lineTo(X + T, Y + T); }
      if(w[2]){ x.moveTo(X, Y + T); x.lineTo(X + T, Y + T); } if(w[3]){ x.moveTo(X, Y); x.lineTo(X, Y + T); }
    });
    x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = '22px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
    var pos = function(i){ return [2 + (i % M.N) * T + T / 2, 2 + Math.floor(i / M.N) * T + T / 2 + 1]; };
    var f = pos(M.fim); x.fillText('🎤', f[0], f[1]); var e = pos(M.eu); x.fillText('🐾', e[0], e[1]);
  }
  function jogarLab(){
    var M = montarLab(), fim = false;
    janela(topo('lab') + '<p class="twk-txt">' + esc(t('labDica')) + '</p>' + aviso1('lab') +
      '<canvas class="twpa-cv twpa-lab" role="img" aria-label="' + esc(t('labDica')) + '"></canvas>' +
      '<div class="twpa-setas"><button type="button" class="btn alt" data-twpa-seta="ArrowUp" aria-label="' + esc(t('cima')) + '" data-twpa-foco>▲</button><span><button type="button" class="btn alt" data-twpa-seta="ArrowLeft" aria-label="' + esc(t('esq')) + '">◀</button>' +
      '<button type="button" class="btn alt" data-twpa-seta="ArrowDown" aria-label="' + esc(t('baixo')) + '">▼</button><button type="button" class="btn alt" data-twpa-seta="ArrowRight" aria-label="' + esc(t('dir')) + '">▶</button></span></div>' + rodape());
    var cv = ov.querySelector('.twpa-lab'); desenharLab(cv, M);
    function mover(k){
      if(fim) return;
      var d = {ArrowUp:[-1, 0, 0], ArrowRight:[0, 1, 1], ArrowDown:[1, 0, 2], ArrowLeft:[0, -1, 3]}[k]; if(!d) return;
      if(M.P[M.eu][d[2]]){ som(262, .03); return; }
      M.eu += d[0] * M.N + d[1]; M.passos++; som(660, .025); desenharLab(cv, M);
      if(M.eu === M.fim){ fim = true; concluir('lab'); }
    }
    var ini = null;
    cv.addEventListener('pointerdown', function(e){ ini = [e.clientX, e.clientY]; });
    cv.addEventListener('pointerup', function(e){ if(!ini) return; var dx = e.clientX - ini[0], dy = e.clientY - ini[1]; ini = null;
      if(Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; mover(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp')); });
    jogo = {tipo:'lab', tecla:mover};
  }

  // ---------- cliques ----------
  document.addEventListener('click', function(e){
    var el = e.target && e.target.closest ? e.target : null; if(!el) return;
    var pc = el.closest('[data-pc]'); if(pc && jogo && jogo.tocar){ jogo.tocar(+pc.getAttribute('data-pc')); return; }
    var sa = el.closest('[data-twpa-seta]'); if(sa && jogo && jogo.tecla){ jogo.tecla(sa.getAttribute('data-twpa-seta')); return; }
    var b = el.closest('[data-twpa]'); if(!b) return;
    var k = b.getAttribute('data-twpa');
    if(k === 'abrir') abrir(); else if(k === 'caca') jogarCaca(); else if(k === 'dif') jogarDif(); else if(k === 'lab') jogarLab();
  });

  function contaMudou(){ feitosSrv = null; feitosDia = ''; carregar(); redesenhar(); }
  window.TW_PASSA = {t:t, feitos:feitos, abrir:abrir, contaMudou:contaMudou, _montarCaca:montarCaca, _montarLab:montarLab, _montarDif:montarDif};
  if(logado()) carregar();
})();
