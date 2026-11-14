/* TsuLiPa⭐World — Bloom⭐Garden! (Fase 4, versão 1).
   4 canteiros na Vila das Tulipas: semente custa ★, 1 rega por dia (Brasília), a flor fica guardada na conta.
   Tudo conferido no servidor (supabase/sql/aplicado/20261113_bloom_garden.sql: jardim_estado,
   jardim_plantar, jardim_regar, jardim_colher). Enquanto essas funções não existirem no banco, o
   jardim continua "Em breve" no mapa e esta janela não abre. Nunca dá ★: é um lugar de gastar. */
(function(){
  'use strict';
  var SEM = {sakura:['🌸','#ffb3d6','#ff6fb5'], tulipa:['🌷','#ff9bb8','#e8457a'], girassol:['🌻','#ffe066','#f5a623'], lunar:['⭐','#d9c2ff','#7b3ff0']};
  var ORDEM = ['sakura','tulipa','girassol','lunar'];
  var T = {
    pt:{tit:'Bloom⭐Garden!',sub:'Plante, regue um pouquinho por dia e colha flores.',cant:'Canteiro',vazio:'Vazio',plantar:'Plantar',regar:'Regar',regado:'Regado hoje ✓',colher:'Colher',pronta:'Florida!',flores:'Suas flores',nenhuma:'Nenhuma flor ainda.',estrelas:'Sem ★ suficiente.',erro:'Não deu certo. Tente de novo.',dia:'{n}/{m} dias',login:'Entre com a sua conta para cuidar do jardim.',
      sakura:'Sakura',tulipa:'Tulipa',girassol:'Girassol',lunar:'Flor-lunar',colheu:'Você colheu {f}!',dica:'Cada semente pede um número de dias com rega. Volte amanhã para regar de novo.',regarTudo:"Regar tudo",colherTudo:"Colher tudo",escolha:"Canteiro {n}: escolha a semente",toque:"Toque num canteiro para plantar, regar ou colher.",colhido:"Colheita feita!",fechar:"Agora não"},
    en:{tit:'Bloom⭐Garden!',sub:'Plant, water a little every day and pick flowers.',cant:'Bed',vazio:'Empty',plantar:'Plant',regar:'Water',regado:'Watered today ✓',colher:'Pick',pronta:'In bloom!',flores:'Your flowers',nenhuma:'No flowers yet.',estrelas:'Not enough ★.',erro:'Something went wrong. Try again.',dia:'{n}/{m} days',login:'Sign in to look after the garden.',
      sakura:'Sakura',tulipa:'Tulip',girassol:'Sunflower',lunar:'Moonflower',colheu:'You picked a {f}!',dica:'Each seed needs some days of watering. Come back tomorrow to water again.',regarTudo:"Water all",colherTudo:"Pick all",escolha:"Bed {n}: choose a seed",toque:"Tap a bed to plant, water or pick.",colhido:"Harvest done!",fechar:"Not now"},
    es:{tit:'Bloom⭐Garden!',sub:'Planta, riega un poquito cada día y cosecha flores.',cant:'Cantero',vazio:'Vacío',plantar:'Plantar',regar:'Regar',regado:'Regado hoy ✓',colher:'Cosechar',pronta:'¡Florecida!',flores:'Tus flores',nenhuma:'Aún no hay flores.',estrelas:'No tienes ★ suficientes.',erro:'No funcionó. Inténtalo de nuevo.',dia:'{n}/{m} días',login:'Inicia sesión para cuidar el jardín.',
      sakura:'Sakura',tulipa:'Tulipán',girassol:'Girasol',lunar:'Flor lunar',colheu:'¡Cosechaste {f}!',dica:'Cada semilla pide unos días de riego. Vuelve mañana para regar otra vez.',regarTudo:"Regar todo",colherTudo:"Cosechar todo",escolha:"Cantero {n}: elige la semilla",toque:"Toca un cantero para plantar, regar o cosechar.",colhido:"¡Cosecha lista!",fechar:"Ahora no"},
    id:{tit:'Bloom⭐Garden!',sub:'Tanam, siram sedikit setiap hari, lalu petik bunganya.',cant:'Petak',vazio:'Kosong',plantar:'Tanam',regar:'Siram',regado:'Sudah disiram ✓',colher:'Petik',pronta:'Sudah mekar!',flores:'Bungamu',nenhuma:'Belum ada bunga.',estrelas:'★ tidak cukup.',erro:'Gagal. Coba lagi.',dia:'{n}/{m} hari',login:'Masuk untuk merawat taman.',
      sakura:'Sakura',tulipa:'Tulip',girassol:'Bunga matahari',lunar:'Bunga bulan',colheu:'Kamu memetik {f}!',dica:'Setiap benih butuh beberapa hari disiram. Kembali besok untuk menyiram lagi.',regarTudo:"Siram semua",colherTudo:"Petik semua",escolha:"Petak {n}: pilih benih",toque:"Ketuk petak untuk menanam, menyiram, atau memetik.",colhido:"Panen selesai!",fechar:"Nanti saja"},
    th:{tit:'Bloom⭐Garden!',sub:'ปลูก รดน้ำวันละนิด แล้วเก็บดอกไม้',cant:'แปลง',vazio:'ว่าง',plantar:'ปลูก',regar:'รดน้ำ',regado:'รดน้ำแล้ววันนี้ ✓',colher:'เก็บ',pronta:'บานแล้ว!',flores:'ดอกไม้ของคุณ',nenhuma:'ยังไม่มีดอกไม้',estrelas:'★ ไม่พอ',erro:'ไม่สำเร็จ ลองอีกครั้ง',dia:'{n}/{m} วัน',login:'เข้าสู่ระบบเพื่อดูแลสวน',
      sakura:'ซากุระ',tulipa:'ทิวลิป',girassol:'ทานตะวัน',lunar:'ดอกจันทร์',colheu:'คุณเก็บ{f}ได้!',dica:'แต่ละเมล็ดต้องรดน้ำหลายวัน พรุ่งนี้มารดน้ำอีกนะ',regarTudo:"รดน้ำทั้งหมด",colherTudo:"เก็บทั้งหมด",escolha:"แปลง {n}: เลือกเมล็ด",toque:"แตะแปลงเพื่อปลูก รดน้ำ หรือเก็บดอกไม้",colhido:"เก็บเกี่ยวเรียบร้อย!",fechar:"ไว้ก่อน"},
    ja:{tit:'Bloom⭐Garden!',sub:'種をまいて、毎日少しずつ水をあげて、花を摘もう。',cant:'花壇',vazio:'空き',plantar:'植える',regar:'水やり',regado:'今日は水やり済み ✓',colher:'摘む',pronta:'満開！',flores:'あなたの花',nenhuma:'まだ花はありません。',estrelas:'★が足りません。',erro:'うまくいきませんでした。もう一度試してね。',dia:'{n}/{m}日',login:'ログインして庭のお世話をしよう。',
      sakura:'さくら',tulipa:'チューリップ',girassol:'ひまわり',lunar:'月の花',colheu:'{f}を摘みました！',dica:'種ごとに必要な水やりの日数があります。また明日水をあげてね。',regarTudo:"全部に水やり",colherTudo:"全部摘む",escolha:"花壇{n}：種を選んでね",toque:"花壇をタップして、植える・水やり・摘むができます。",colhido:"収穫完了！",fechar:"あとで"}
  };
  function t(k, n, m){ var L = (typeof LANG === 'string' && T[LANG]) ? LANG : 'pt'; var s = T[L][k] || T.pt[k]; return s.replace('{n}', n).replace('{m}', m).replace('{f}', n); }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(s) : String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  var st = null, ocupado = false, msg = '', ov = null, anim = 0, festa = [];
  var escolha = -1;                 // canteiro vazio tocado no desenho: mostra as sementes
  var idolX = 360, idolAlvo = 360, idolPulo = 0;    // o seu Idol passeia atrás dos canteiros e vai até o que foi cuidado
  window.TW_BLOOM_ON = false;
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem_conta')); }
  // Liga o jardim só quando o servidor responde (função aplicada no banco).
  function sondar(){
    if(typeof contaJ === 'undefined' || !contaJ) return;
    rpc('jardim_estado').then(function(r){ if(r && r.ok){ st = r; window.TW_BLOOM_ON = true; if(typeof hubCardsUI === 'function' && document.getElementById('hubCards')) try{ hubCardsUI(); }catch(e){} } }).catch(function(){});
  }
  function montarOv(){
    if(ov) return ov;
    ov = document.createElement('div'); ov.className = 'ov bloomov tw-window-overlay'; ov.id = 'bloomOv'; ov.hidden = true;
    ov.innerHTML = '<div class="panel bloomp tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="bloomTit">' +
      '<button type="button" class="perfx tw-window-control tw-window-close" id="bloomX" aria-label="✕">✕</button>' +
      '<h2 class="tw-modal-title" id="bloomTit"></h2><small class="tw-modal-jp" lang="ja">ブルームガーデン</small>' +
      '<canvas id="bloomCv" width="720" height="400" role="img"></canvas><div id="bloomCorpo"></div></div>';
    document.body.appendChild(ov);
    // Tocar num canteiro do desenho faz a ação certa: escolher semente, regar ou colher.
    var cvEl = ov.querySelector('#bloomCv');
    if(cvEl && cvEl.addEventListener) cvEl.addEventListener('click', function(e){
      if(ocupado || !st) return;
      var q = cvEl.getBoundingClientRect(); if(!q.width || !q.height) return;
      var px = (e.clientX - q.left) / q.width * cvEl.width, py = (e.clientY - q.top) / q.height * cvEl.height;
      var i = Math.floor((px - 13.5) / 173);
      if(i < 0 || i > 3 || py < cvEl.height * .42) return;
      tocar(i);
    });
    ov.addEventListener('click', function(e){
      if(e.target === ov || e.target.id === 'bloomX'){ fechar(); return; }
      var b = e.target.closest && e.target.closest('[data-bloom]'); if(!b || ocupado) return;
      var c = +b.getAttribute('data-c'), a = b.getAttribute('data-bloom');
      if(a === 'semente'){ escolha = -1; acao('jardim_plantar', {p_canteiro:c, p_semente:b.getAttribute('data-s')}); }
      else if(a === 'cancelar'){ escolha = -1; ui(); }
      else if(a === 'regar-tudo') emSerie('jardim_regar', pendentes(false));
      else if(a === 'colher-tudo') emSerie('jardim_colher', pendentes(true));
      else if(a === 'abrir'){ escolha = escolha === c ? -1 : c; msg = ''; ui(); }
      else if(a === 'regar') acao('jardim_regar', {p_canteiro:c});
      else if(a === 'colher') acao('jardim_colher', {p_canteiro:c});
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov && !ov.hidden) fechar(); });
    return ov;
  }
  function abrir(){
    if(typeof contaJ === 'undefined' || !contaJ){ if(typeof contaEntrar === 'function') contaEntrar(); return; }
    montarOv(); ov.hidden = false; msg = ''; escolha = -1; ui();
    rpc('jardim_estado').then(function(r){ if(r && r.ok){ st = r; window.TW_BLOOM_ON = true; } ui(); }).catch(function(){ msg = t('erro'); ui(); });
    laco();
  }
  function fechar(){ if(ov) ov.hidden = true; cancelAnimationFrame(anim); anim = 0; if(typeof hubCardsUI === 'function' && document.getElementById('hubCards')) try{ hubCardsUI(); }catch(e){} }
  function acao(nome, args){
    ocupado = true; msg = ''; escolha = -1; idolIr(args && args.p_canteiro); ui();
    rpc(nome, args).then(function(r){
      if(r && r.ok){
        if(window.TWVidaCidade)window.TWVidaCidade.registrar('bloom_'+nome.replace('jardim_',''),{flor:r.flor});if(typeof twMissoesAtualizar==='function')twMissoesAtualizar();
        if(typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} if(typeof setBest === 'function') try{ setBest(); }catch(e){} }
        if(nome === 'jardim_regar') chuva.push({c:args.p_canteiro, t0:performance.now()});
        if(nome === 'jardim_colher'){ msg = t('colheu', t(r.flor)); for(var i = 0; i < 14; i++) festa.push({c:args.p_canteiro, i:i, t0:performance.now(), k:r.flor}); if(typeof sfx !== 'undefined' && sfx && sfx.rank) try{ sfx.rank(); }catch(e){} }
        else if(typeof beep === 'function') try{ beep(nome === 'jardim_regar' ? 880 : 1175, .07, 'triangle', .04); }catch(e){}
      } else msg = r && r.erro === 'estrelas' ? t('estrelas') : t('erro');
      return rpc('jardim_estado').then(function(e){ if(e && e.ok) st = e; });
    }).catch(function(){ msg = t('erro'); }).then(function(){ ocupado = false; ui(); });
  }
  function pronta(c){ return !!c && +c.regas >= +c.precisa; }
  // canteiros que podem ser colhidos (true) ou que ainda pedem a rega de hoje (false)
  function pendentes(colher){
    var L = [];
    for(var i = 0; i < 4; i++){ var c = canteiro(i); if(c && (colher ? pronta(c) : (!pronta(c) && !c.regado_hoje))) L.push(i); }
    return L;
  }
  function tocar(i){
    var c = canteiro(i);
    if(!c){ escolha = escolha === i ? -1 : i; msg = ''; ui(); return; }
    escolha = -1;
    if(pronta(c)) acao('jardim_colher', {p_canteiro:i});
    else if(!c.regado_hoje) acao('jardim_regar', {p_canteiro:i});
    else { msg = t('regado'); idolIr(i); ui(); }
  }
  function idolIr(i){ if(typeof i === 'number' && i >= 0 && i <= 3){ idolAlvo = 100 + i * 173; idolPulo = performance.now(); } }
  // Mesma ação em vários canteiros, um de cada vez (o servidor confere cada um como sempre).
  function emSerie(nome, ids){
    if(!ids.length || ocupado) return;
    ocupado = true; msg = ''; escolha = -1; ui();
    var fila = Promise.resolve(), colhidas = [];
    ids.forEach(function(i){
      fila = fila.then(function(){ idolIr(i); return rpc(nome, {p_canteiro:i}); }).then(function(r){
        if(!r || !r.ok) return;
        if(window.TWVidaCidade)window.TWVidaCidade.registrar('bloom_'+nome.replace('jardim_',''),{flor:r.flor});if(typeof twMissoesAtualizar==='function')twMissoesAtualizar();
        if(r.flor && SEM[r.flor]){ colhidas.push(t(r.flor)); for(var k = 0; k < 14; k++) festa.push({c:i, i:k, t0:performance.now(), k:r.flor}); }
        else if(nome === 'jardim_regar') chuva.push({c:i, t0:performance.now()});
      });
    });
    fila.then(function(){
      if(colhidas.length){ msg = t('colhido') + ' ' + colhidas.join(' · '); if(typeof sfx !== 'undefined' && sfx && sfx.rank) try{ sfx.rank(); }catch(e){} }
      else if(typeof beep === 'function') try{ beep(880, .07, 'triangle', .04); }catch(e){}
      return rpc('jardim_estado').then(function(e){ if(e && e.ok) st = e; });
    }).catch(function(){ msg = t('erro'); }).then(function(){ ocupado = false; ui(); laco(); });
  }
  function canteiro(i){ return st && Array.isArray(st.canteiros) ? st.canteiros.find(function(c){ return +c.canteiro === i; }) : null; }
  // Ícones desenhados (sem emoji): gota, broto, flor e mais. Herdam a cor do texto do botão.
  var IC = {
    gota:'<svg class="bloomsvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.6c3.4 4.3 6.2 7.7 6.2 11.3a6.2 6.2 0 0 1-12.4 0C5.8 10.3 8.6 6.9 12 2.6z"/></svg>',
    broto:'<svg class="bloomsvg" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11 21v-7.2C7 13.9 4 11.3 3.6 6.8 8 6.6 10.7 8.5 11.8 11.4 12.5 7.3 15.3 4.7 20.4 4.5c.1 5.4-2.6 8.7-7.4 9.2V21z"/></svg>',
    flor:'<svg class="bloomsvg" viewBox="0 0 24 24" aria-hidden="true"><g fill="currentColor"><circle cx="12" cy="6" r="3.6"/><circle cx="17.7" cy="10.1" r="3.6"/><circle cx="15.5" cy="16.8" r="3.6"/><circle cx="8.5" cy="16.8" r="3.6"/><circle cx="6.3" cy="10.1" r="3.6"/></g><circle cx="12" cy="12" r="2.7" fill="#fff"/></svg>'
  };
  function pontos(c){ var h = '<i class="bloomdots" aria-hidden="true">'; for(var k = 0; k < +c.precisa; k++) h += '<u' + (k < +c.regas ? ' class="on"' : '') + '></u>'; return h + '</i>'; }
  function icone(k, prog){ return '<canvas class="bloomic" width="96" height="96" data-ic="' + (k || '') + '" data-prog="' + prog + '" aria-hidden="true"></canvas>'; }
  function ui(){
    if(!ov) return;
    ov.querySelector('#bloomTit').textContent = t('tit');
    var corpo = ov.querySelector('#bloomCorpo'), dis = ocupado ? ' disabled' : '';
    if(!st){ corpo.innerHTML = '<p class="perfcarr">' + esc(typeof tr === 'function' ? tr('Carregando...') : '…') + '</p>' + (msg ? '<p class="bloommsg">' + esc(msg) + '</p>' : ''); desenhar(); return; }
    var h = '<div class="bloomtopo"><p class="bloomsub">' + esc(t('sub')) + '</p><span class="bloomstar" aria-label="★ ' + (+st.stars || 0) + '">★ ' + (+st.stars || 0) + '</span></div>';
    if(msg) h += '<p class="bloommsg" aria-live="polite">' + esc(msg) + '</p>';
    if(escolha >= 0 && !canteiro(escolha)){
      h += '<div class="bloompick" role="group"><b>' + esc(t('escolha', escolha + 1)) + '</b><div>' + ORDEM.map(function(k){
        var p = st.sementes && st.sementes[k] || [0, 0], caro = (+st.stars || 0) < +p[0];
        return '<button type="button" class="bloomseed" data-bloom="semente" data-c="' + escolha + '" data-s="' + k + '"' + (ocupado || caro ? ' disabled' : '') + '>' +
          icone(k, 1) + '<span>' + esc(t(k)) + '</span><small>★' + p[0] + ' · ' + esc(t('dia', p[1], p[1]).replace(/^\d+\//, '')) + '</small></button>'; }).join('') +
        '</div><button type="button" class="bloomnao" data-bloom="cancelar">' + esc(t('fechar')) + '</button></div>';
    }
    var aRegar = pendentes(false).length, aColher = pendentes(true).length;
    if(aRegar > 1 || aColher > 1) h += '<div class="bloomlote">' +
      (aColher > 1 ? '<button type="button" class="btn" data-bloom="colher-tudo"' + dis + '>' + IC.flor + esc(t('colherTudo')) + ' · ' + aColher + '</button>' : '') +
      (aRegar > 1 ? '<button type="button" class="btn alt" data-bloom="regar-tudo"' + dis + '>' + IC.gota + esc(t('regarTudo')) + ' · ' + aRegar + '</button>' : '') + '</div>';
    h += '<ul class="bloomgrid">';
    for(var i = 0; i < 4; i++){
      var c = canteiro(i), florida = pronta(c);
      h += '<li class="bloomcard' + (!c ? ' vazio' : florida ? ' florida' : '') + (escolha === i ? ' sel' : '') + '">' +
        icone(c ? c.semente : '', c ? Math.min(1, (+c.regas || 0) / Math.max(1, +c.precisa || 1)) : -1) +
        '<div class="bloomtxt"><small>' + esc(t('cant')) + ' ' + (i + 1) + '</small><b>' + esc(c ? t(c.semente) : t('vazio')) + '</b>' +
        (c ? (florida ? '<em>' + esc(t('pronta')) + '</em>' : pontos(c) + '<span class="bloomsr">' + esc(t('dia', c.regas, c.precisa)) + '</span>') : '') + '</div>';
      if(!c) h += '<button type="button" class="btn alt" data-bloom="abrir" data-c="' + i + '"' + dis + '>' + IC.broto + esc(t('plantar')) + '</button>';
      else if(florida) h += '<button type="button" class="btn" data-bloom="colher" data-c="' + i + '"' + dis + '>' + IC.flor + esc(t('colher')) + '</button>';
      else if(c.regado_hoje) h += '<span class="bloomok">' + esc(t('regado')) + '</span>';
      else h += '<button type="button" class="btn alt" data-bloom="regar" data-c="' + i + '"' + dis + '>' + IC.gota + esc(t('regar')) + '</button>';
      h += '</li>';
    }
    h += '</ul><p class="bloomdica">' + esc(t('toque')) + ' ' + esc(t('dica')) + '</p><h3>' + esc(t('flores')) + '</h3>';
    var fl = st.flores || {}, tem = ORDEM.filter(function(k){ return +fl[k] > 0; });
    h += tem.length ? '<div class="bloomvasos">' + tem.map(function(k){ return '<span>' + icone(k, 1) + '<b>×' + (+fl[k]) + '</b><small>' + esc(t(k)) + '</small></span>'; }).join('') + '</div>' : '<p class="bloomdica">' + esc(t('nenhuma')) + '</p>';
    corpo.innerHTML = h; icones(); desenhar();
  }
  // Miniaturas: a mesma flor do canteiro, desenhada à mão em cada cartão, semente e vaso.
  function icones(){
    var L = ov.querySelectorAll('canvas[data-ic]');
    for(var i = 0; i < L.length; i++){
      var cv = L[i], x = cv.getContext && cv.getContext('2d'); if(!x) continue;
      var k = cv.getAttribute('data-ic'), p = +cv.getAttribute('data-prog');
      x.clearRect(0, 0, 96, 96);
      x.fillStyle = k && p >= 1 ? '#fff4fa' : '#f3f9f1'; x.beginPath(); x.arc(48, 48, 46, 0, 7); x.fill();
      if(!k){ x.fillStyle = '#b98558'; x.beginPath(); x.ellipse(48, 62, 24, 9, 0, 0, 7); x.fill(); x.fillStyle = '#8a5a36'; x.beginPath(); x.ellipse(48, 59, 19, 6, 0, 0, 7); x.fill(); continue; }
      if(p >= 1){ cabeca(x, k, 48, 48, 30, 0, false); continue; }
      x.save(); x.beginPath(); x.arc(48, 48, 46, 0, 7); x.clip(); planta(x, 48, 86, {semente:k, regas:Math.round(p * 100), precisa:100}, 0, .62); x.restore();
    }
  }
  // ---------- o jardim desenhado ----------
  var COR = {sakura:['#ffc9e0','#ff93c0','#e85a94'], tulipa:['#ffa3ba','#f26a93','#d63d72'], girassol:['#ffe270','#f8b62a','#7a4a2b'], lunar:['#e8dbff','#ab8ef6','#fff3b8']};
  var chuva = [];
  function desenhar(){
    var cv = ov && ov.querySelector('#bloomCv'); if(!cv) return;
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, tm = performance.now() / 1000, hz = H * .46;
    var hr = hora(), noite = hr >= 19 || hr < 6, tarde = hr >= 17 && hr < 19, i;
    var g = x.createLinearGradient(0, 0, 0, hz + 20);
    if(noite){ g.addColorStop(0, '#1f1750'); g.addColorStop(1, '#5a429c'); }
    else if(tarde){ g.addColorStop(0, '#ffb48c'); g.addColorStop(.6, '#ffd3de'); g.addColorStop(1, '#ffe9f1'); }
    else { g.addColorStop(0, '#bfe3ff'); g.addColorStop(1, '#fdeef6'); }
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if(noite){
      x.fillStyle = '#fff'; for(i = 0; i < 30; i++){ x.globalAlpha = .3 + .55 * Math.abs(Math.sin(tm * 1.3 + i * 1.7)); x.beginPath(); x.arc((i * 131 + 40) % W, 8 + (i * 47) % (hz - 50), 1.1 + (i % 3) * .5, 0, 7); x.fill(); }
      x.globalAlpha = .18; x.fillStyle = '#fff6c9'; x.beginPath(); x.arc(612, 58, 44, 0, 7); x.fill();
      x.globalAlpha = 1; x.beginPath(); x.arc(612, 58, 25, 0, 7); x.fill(); x.fillStyle = '#2a1f63'; x.beginPath(); x.arc(602, 51, 22, 0, 7); x.fill();
    } else {
      var sx = tarde ? 590 : 96, sy = tarde ? hz - 34 : 62;
      x.fillStyle = tarde ? '#fff0b0' : '#fff8d6'; x.globalAlpha = .35; x.beginPath(); x.arc(sx, sy, 50, 0, 7); x.fill(); x.globalAlpha = 1; x.beginPath(); x.arc(sx, sy, 30, 0, 7); x.fill();
    }
    x.fillStyle = noite ? 'rgba(190,172,236,.5)' : '#fff';
    [[150, 52, 1], [470, 84, .72], [660, 40, .55]].forEach(function(n, q){ var cx = (n[0] + tm * (5 + q * 2)) % (W + 200) - 100; x.globalAlpha = noite ? .8 : .92;
      x.beginPath(); x.ellipse(cx, n[1], 44 * n[2], 15 * n[2], 0, 0, 7); x.ellipse(cx - 27 * n[2], n[1] + 5, 25 * n[2], 11 * n[2], 0, 0, 7); x.ellipse(cx + 25 * n[2], n[1] + 3, 29 * n[2], 12 * n[2], 0, 0, 7); x.ellipse(cx + 4 * n[2], n[1] - 9 * n[2], 22 * n[2], 13 * n[2], 0, 0, 7); x.fill(); });
    x.globalAlpha = 1;
    // colinas ao fundo
    x.fillStyle = noite ? '#4f7f8c' : '#c9efd3'; x.beginPath(); x.ellipse(170, hz + 26, 300, 70, 0, 0, 7); x.fill();
    x.fillStyle = noite ? '#467684' : '#b7e7c4'; x.beginPath(); x.ellipse(590, hz + 34, 280, 62, 0, 0, 7); x.fill();
    // gramado
    var gg = x.createLinearGradient(0, hz, 0, H); gg.addColorStop(0, noite ? '#5c9c8c' : '#a9e4b5'); gg.addColorStop(1, noite ? '#4a8778' : '#8fd6a2');
    x.fillStyle = gg; x.fillRect(0, hz, W, H - hz);
    x.strokeStyle = noite ? 'rgba(40,90,80,.5)' : 'rgba(92,180,120,.55)'; x.lineWidth = 2.4; x.lineCap = 'round';
    for(i = 0; i < 26; i++){ var tx = (i * 97 + 23) % W, ty = hz + 26 + (i * 53) % (H - hz - 36); x.beginPath(); x.moveTo(tx - 5, ty); x.lineTo(tx - 7, ty - 8); x.moveTo(tx, ty); x.lineTo(tx, ty - 10); x.moveTo(tx + 5, ty); x.lineTo(tx + 7, ty - 8); x.stroke(); }
    // cerquinha
    var cf = noite ? '#d3c8ee' : '#fffaf2', cs = noite ? 'rgba(40,30,90,.25)' : 'rgba(170,130,150,.22)';
    x.fillStyle = cs; x.fillRect(0, hz - 9, W, 5); x.fillRect(0, hz + 7, W, 5);
    x.fillStyle = cf; x.fillRect(0, hz - 12, W, 5); x.fillRect(0, hz + 4, W, 5);
    for(i = 0; i < 22; i++){ var fx = 6 + i * 34; x.fillStyle = cs; rr(x, fx + 2, hz - 28, 14, 46, 7); x.fill(); x.fillStyle = cf; rr(x, fx, hz - 30, 14, 46, 7); x.fill(); }
    enfeites(x, W, H, hz, tm, noite);
    jardineiro(x, H, tm);
    for(i = 0; i < 4; i++){
      var cx = 100 + i * 173, by = H * .82, c = canteiro(i);
      caixote(x, cx, by, !!(c && c.regado_hoje), i, escolha === i);
      if(c && noite && c.semente === 'lunar' && pronta(c)){ var hl = x.createRadialGradient(cx, by - 124, 4, cx, by - 124, 70); hl.addColorStop(0, 'rgba(232,219,255,.7)'); hl.addColorStop(1, 'rgba(232,219,255,0)'); x.fillStyle = hl; x.fillRect(cx - 70, by - 194, 140, 140); }
      if(c) planta(x, cx, by - 16, c, tm, 1.22);
      balao(x, cx, by, i, c, tm);
    }
    bichinhos(x, W, hz, tm, noite);
    // gotas da rega e pétalas da colheita
    var agora = performance.now();
    chuva = chuva.filter(function(p){ var u = (agora - p.t0) / 900; if(u > 1) return false;
      for(var d = 0; d < 6; d++){ var v = (u * 1.4 - d * .08); if(v < 0 || v > 1) continue; var dx = 100 + p.c * 173 - 40 + d * 16, dy = H * .82 - 120 + v * 96;
        x.fillStyle = 'rgba(92,190,255,' + (1 - v * .6).toFixed(2) + ')'; x.beginPath(); x.moveTo(dx, dy - 7); x.quadraticCurveTo(dx + 5, dy + 1, dx, dy + 4); x.quadraticCurveTo(dx - 5, dy + 1, dx, dy - 7); x.fill(); }
      return true; });
    festa = festa.filter(function(p){ var u = (agora - p.t0) / 1500; if(u > 1) return false; var a = p.i / 14 * Math.PI * 2, r = 16 + u * 96, cc = COR[p.k] || COR.sakura;
      x.save(); x.globalAlpha = 1 - u * u; x.translate(100 + p.c * 173 + Math.cos(a) * r, H * .82 - 100 + Math.sin(a) * r * .6 - u * 34 + u * u * 46); x.rotate(a + u * 5);
      x.fillStyle = cc[p.i % 2]; x.beginPath(); x.ellipse(0, 0, 7, 3.6, 0, 0, 7); x.fill(); x.restore(); return true; });
  }
  // Enfeites fixos atrás dos canteiros: plaquinha do jardim e regador.
  function enfeites(x, W, H, hz, tm, noite){
    var i;
    // plaquinha
    var px = 44, py = hz + 44;
    x.fillStyle = '#a96a36'; rr(x, px - 3, py - 4, 6, 34, 3); x.fill();
    x.fillStyle = 'rgba(60,40,20,.16)'; rr(x, px - 25, py - 26, 52, 27, 8); x.fill();
    x.fillStyle = noite ? '#e6dcc8' : '#fff8ee'; rr(x, px - 27, py - 29, 52, 27, 8); x.fill();
    x.strokeStyle = '#d29a63'; x.lineWidth = 2; rr(x, px - 27, py - 29, 52, 27, 8); x.stroke();
    cabeca(x, 'sakura', px - 1, py - 15.5, 9, 0, false);
    // regador
    var gx = W - 52, gy = hz + 56;
    x.fillStyle = 'rgba(40,60,40,.16)'; x.beginPath(); x.ellipse(gx, gy + 20, 26, 5, 0, 0, 7); x.fill();
    x.strokeStyle = noite ? '#7f9bd8' : '#8fb6ff'; x.lineWidth = 5; x.lineCap = 'round';
    x.beginPath(); x.arc(gx + 15, gy + 2, 13, -1.2, 1.3); x.stroke();                       // alça
    x.beginPath(); x.moveTo(gx - 15, gy + 6); x.lineTo(gx - 34, gy - 10); x.stroke();       // bico
    x.fillStyle = noite ? '#8aa6e0' : '#a9c8ff'; rr(x, gx - 17, gy - 12, 34, 32, 8); x.fill();
    x.fillStyle = noite ? '#7f9bd8' : '#8fb6ff'; rr(x, gx - 17, gy + 8, 34, 12, 6); x.fill();
    x.fillStyle = 'rgba(255,255,255,.55)'; rr(x, gx - 11, gy - 7, 5, 16, 2.5); x.fill();
    x.fillStyle = noite ? '#7f9bd8' : '#8fb6ff'; x.beginPath(); x.ellipse(gx - 36, gy - 12, 6, 4, -.7, 0, 7); x.fill();
  }
  // Borboletas de dia, vaga-lumes à noite. Com "reduzir movimento" o laço não roda e eles ficam parados.
  function bichinhos(x, W, hz, tm, noite){
    var i;
    if(noite){
      for(i = 0; i < 9; i++){ var fx = (i * 83 + 60 + Math.sin(tm * .5 + i) * 26) % W, fy = hz + 30 + (i * 37) % 120 + Math.cos(tm * .7 + i * 2) * 10, a = .35 + .6 * Math.abs(Math.sin(tm * 1.6 + i * 1.3));
        var gl = x.createRadialGradient(fx, fy, 0, fx, fy, 9); gl.addColorStop(0, 'rgba(255,246,170,' + a.toFixed(2) + ')'); gl.addColorStop(1, 'rgba(255,246,170,0)'); x.fillStyle = gl; x.beginPath(); x.arc(fx, fy, 9, 0, 7); x.fill(); }
      return;
    }
    [['#ff9ccb', '#ffd3e8', 0], ['#a98bf5', '#e4d4ff', 2.4]].forEach(function(b, n){
      var u = tm * .22 + b[2], bx = W * .5 + Math.sin(u) * (W * .36) + Math.sin(u * 3.1) * 22, by = hz + 34 + Math.sin(u * 1.7 + n) * 30, bate = Math.abs(Math.sin(tm * 9 + n));
      x.save(); x.translate(bx, by); x.rotate(Math.cos(u) * .25);
      [-1, 1].forEach(function(l){ x.save(); x.scale(l * (.35 + bate * .65), 1);
        x.fillStyle = b[0]; x.beginPath(); x.ellipse(7, -4, 8, 6.5, -.4, 0, 7); x.fill();
        x.fillStyle = b[1]; x.beginPath(); x.ellipse(5.5, 4, 5.5, 4.5, .4, 0, 7); x.fill(); x.restore(); });
      x.fillStyle = '#6a4b8f'; rr(x, -1.2, -6, 2.4, 12, 1.2); x.fill(); x.restore();
    });
  }
  // Caixote de madeira com terra; a terra escurece quando o canteiro já foi regado hoje.
  function caixote(x, cx, by, molhado, i, sel){
    x.fillStyle = 'rgba(40,60,40,.18)'; x.beginPath(); x.ellipse(cx, by + 34, 82, 12, 0, 0, 7); x.fill();
    x.fillStyle = '#a96a36'; rr(x, cx - 76, by - 14, 152, 48, 13); x.fill();
    x.fillStyle = '#d29a63'; rr(x, cx - 76, by - 20, 152, 46, 13); x.fill();
    x.strokeStyle = 'rgba(120,70,36,.28)'; x.lineWidth = 2; x.beginPath(); x.moveTo(cx - 26, by - 6); x.lineTo(cx - 26, by + 24); x.moveTo(cx + 26, by - 6); x.lineTo(cx + 26, by + 24); x.stroke();
    x.fillStyle = '#ebbf90'; rr(x, cx - 76, by - 22, 152, 12, 6); x.fill();
    x.fillStyle = molhado ? '#6a4127' : '#8f5e39'; rr(x, cx - 68, by - 20, 136, 9, 4.5); x.fill();
    x.fillStyle = molhado ? 'rgba(160,215,255,.5)' : 'rgba(255,255,255,.16)'; for(var k = 0; k < 5; k++){ x.beginPath(); x.arc(cx - 52 + k * 26 + (k % 2) * 5, by - 15.5, 1.6, 0, 7); x.fill(); }
    if(sel){ x.strokeStyle = '#ffd84a'; x.lineWidth = 4; rr(x, cx - 80, by - 26, 160, 58, 16); x.stroke(); }
    x.fillStyle = '#fff8ee'; rr(x, cx - 12, by + 4, 24, 19, 7); x.fill();
    x.fillStyle = '#a96a36'; x.font = '14px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(i + 1), cx, by + 14.5); x.textBaseline = 'alphabetic';
  }
  function hora(){
    if(typeof window.TW_MAPA_HORA === 'number') return window.TW_MAPA_HORA;
    try{ return +new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', hour:'numeric', hourCycle:'h23'}).format(new Date()); }catch(e){ return new Date().getHours(); }
  }
  // Balãozinho de cada canteiro, com ícone desenhado: mais (vazio), gota (falta a rega de hoje), flor (pode colher).
  function balao(x, cx, by, i, c, tm){
    var tipo = !c ? 'mais' : pronta(c) ? 'flor' : c.regado_hoje ? '' : 'gota';
    if(!tipo) return;
    var bx = cx + 52, byy = by - 62 + Math.sin(tm * 2.6 + i) * 3;
    x.fillStyle = 'rgba(60,40,110,.14)'; x.beginPath(); x.arc(bx + 1.5, byy + 3, 18, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(bx, byy, 18, 0, 7); x.fill();
    x.beginPath(); x.moveTo(bx - 8, byy + 15); x.lineTo(bx - 15, byy + 26); x.lineTo(bx + 1, byy + 17); x.fill();
    if(tipo === 'mais'){ x.strokeStyle = '#9b7bf0'; x.lineWidth = 4; x.lineCap = 'round'; x.beginPath(); x.moveTo(bx - 8, byy); x.lineTo(bx + 8, byy); x.moveTo(bx, byy - 8); x.lineTo(bx, byy + 8); x.stroke(); }
    else if(tipo === 'gota'){ x.fillStyle = '#4db8ff'; x.beginPath(); x.moveTo(bx, byy - 11); x.bezierCurveTo(bx + 11, byy, bx + 9, byy + 10, bx, byy + 10); x.bezierCurveTo(bx - 9, byy + 10, bx - 11, byy, bx, byy - 11); x.fill(); x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.ellipse(bx - 3, byy + 2, 2, 3.4, .4, 0, 7); x.fill(); }
    else cabeca(x, c.semente, bx, byy, 12, tm, false);
  }
  // O seu Idol (e o pet ativo) cuidam do jardim: passeiam atrás dos canteiros e vão até o que você tocou.
  // Usa o mesmo desenho do jogo, ligando o visual só durante o desenho; sem ele, o jardim fica como antes.
  function jardineiro(x, H, tm){
    if(typeof hubAv !== 'function' || typeof perfChar !== 'function' || typeof drawChar !== 'function' || typeof perfCharContorno !== 'function') return;
    var av = null, salvo = null, sc = 2.05, chao = H * .46 + 60;
    try{ av = hubAv(); }catch(e){ av = null; }
    if(!av || !av.c) return;
    var parado = performance.now() - idolPulo > 2600;
    if(parado){ var falta = pendentes(true).concat(pendentes(false)); idolAlvo = falta.length ? 100 + falta[0] * 173 : 360 + Math.sin(tm * .25) * 150; }
    var d = idolAlvo - idolX; idolX += Math.abs(d) < 1.2 ? d : d * .06;
    var anda = Math.abs(d) > 3, pulo = !parado ? -Math.abs(Math.sin((performance.now() - idolPulo) / 130)) * 7 * Math.max(0, 1 - (performance.now() - idolPulo) / 1400) : 0;
    var bob = anda ? -Math.abs(Math.sin(tm * 9)) * 2.2 : 0;
    x.save();
    x.fillStyle = 'rgba(30,60,40,.2)'; x.beginPath(); x.ellipse(idolX, chao, 10 * sc, 2.2 * sc, 0, 0, 7); x.fill();
    try{
      salvo = [state, pw, dpw, rankI, sash, accSel, frame, charPose];
      state = 'play'; pw = null; dpw = null; rankI = 0; sash = false; accSel = typeof av.a === 'string' ? av.a : ''; frame = Math.floor(tm * 60);
      var c = perfChar(av), ex = [0, 1, 2, 3, 4, 5, 6].indexOf(+av.expr) >= 0 ? +av.expr : 2, vira = d < -3;
      if(vira){ x.translate(idolX * 2, 0); x.scale(-1, 1); }
      perfCharContorno(x, idolX - 15 * sc, chao - 44 * sc + bob + pulo, sc, function(){ charPose = anda ? '' : (av.pose || ''); drawChar(c, 0, 0, anda ? 1 : 0, ex, false); });
    }catch(e){}
    finally{ if(salvo){ state = salvo[0]; pw = salvo[1]; dpw = salvo[2]; rankI = salvo[3]; sash = salvo[4]; accSel = salvo[5]; frame = salvo[6]; charPose = salvo[7]; } }
    x.restore();
    try{
      var pet = typeof perfPetDoAvatar === 'function' ? perfPetDoAvatar(av) : null;
      if(pet && typeof perfDesenharPetEm === 'function') perfDesenharPetEm(x, pet, idolX + (d < -3 ? 30 : -30), chao - 8 + Math.sin(tm * 5) * 1.5, sc * .44, tm * 60);
    }catch(e){}
  }
  // Cada espécie tem o seu desenho: pétalas com entalhe (sakura), taça (tulipa), coroa e miolo (girassol), estrela (flor-lunar).
  function cabeca(x, k, cx, cy, r, tm, brilho){
    var c = COR[k] || COR.sakura, i, a;
    x.save(); x.translate(cx, cy);
    if(k === 'tulipa'){
      x.fillStyle = c[2]; x.beginPath(); x.moveTo(-r * .46, r * .5); x.quadraticCurveTo(0, -r * 1.7, r * .46, r * .5); x.quadraticCurveTo(0, r * .9, -r * .46, r * .5); x.fill();
      x.fillStyle = c[1]; x.beginPath(); x.moveTo(0, r * .78); x.bezierCurveTo(-r * 1.02, r * .62, -r * .88, -r * .7, -r * .36, -r * .98); x.quadraticCurveTo(-r * .04, -r * .1, 0, r * .78); x.fill();
      x.fillStyle = c[0]; x.beginPath(); x.moveTo(0, r * .78); x.bezierCurveTo(r * 1.02, r * .62, r * .88, -r * .7, r * .36, -r * .98); x.quadraticCurveTo(r * .04, -r * .1, 0, r * .78); x.fill();
      x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(r * .42, -r * .18, r * .09, r * .3, .25, 0, 7); x.fill();
    } else if(k === 'girassol'){
      for(i = 0; i < 16; i++){ x.save(); x.rotate(i / 16 * 6.2832 + tm * .04); x.fillStyle = i % 2 ? c[0] : c[1]; x.beginPath(); x.moveTo(0, -r * .34); x.quadraticCurveTo(r * .23, -r * .74, 0, -r * 1.08); x.quadraticCurveTo(-r * .23, -r * .74, 0, -r * .34); x.fill(); x.restore(); }
      x.fillStyle = c[2]; x.beginPath(); x.arc(0, 0, r * .46, 0, 7); x.fill();
      x.fillStyle = '#a06a3c'; for(i = 0; i < 9; i++){ a = i * 2.4; var d = r * .09 * Math.sqrt(i + .5); x.beginPath(); x.arc(Math.cos(a) * d, Math.sin(a) * d, r * .055, 0, 7); x.fill(); }
    } else if(k === 'lunar'){
      if(brilho){ var gl = x.createRadialGradient(0, 0, r * .2, 0, 0, r * 1.9); gl.addColorStop(0, 'rgba(255,243,184,.55)'); gl.addColorStop(1, 'rgba(255,243,184,0)'); x.fillStyle = gl; x.beginPath(); x.arc(0, 0, r * 1.9, 0, 7); x.fill(); }
      for(i = 0; i < 5; i++){ x.save(); x.rotate(i / 5 * 6.2832 + Math.sin(tm * .8) * .04); x.fillStyle = c[1]; x.beginPath(); x.moveTo(0, -r * .08); x.quadraticCurveTo(r * .46, -r * .46, 0, -r * 1.1); x.quadraticCurveTo(-r * .46, -r * .46, 0, -r * .08); x.fill(); x.restore(); }
      for(i = 0; i < 5; i++){ x.save(); x.rotate(i / 5 * 6.2832 + .6283); x.fillStyle = c[0]; x.beginPath(); x.moveTo(0, -r * .06); x.quadraticCurveTo(r * .3, -r * .34, 0, -r * .74); x.quadraticCurveTo(-r * .3, -r * .34, 0, -r * .06); x.fill(); x.restore(); }
      x.fillStyle = c[2]; x.beginPath(); x.arc(0, 0, r * .2, 0, 7); x.fill();
    } else {
      for(i = 0; i < 5; i++){ x.save(); x.rotate(i / 5 * 6.2832 + Math.sin(tm * 1.1) * .04);
        x.fillStyle = c[0]; x.beginPath(); x.moveTo(0, -r * .1); x.bezierCurveTo(r * .66, -r * .34, r * .56, -r * 1.06, r * .15, -r * 1.02); x.lineTo(0, -r * .82); x.lineTo(-r * .15, -r * 1.02); x.bezierCurveTo(-r * .56, -r * 1.06, -r * .66, -r * .34, 0, -r * .1); x.fill();
        x.strokeStyle = c[1]; x.lineWidth = Math.max(1, r * .05); x.lineCap = 'round'; x.beginPath(); x.moveTo(0, -r * .26); x.lineTo(0, -r * .56); x.stroke(); x.restore(); }
      x.fillStyle = c[2]; x.beginPath(); x.arc(0, 0, r * .19, 0, 7); x.fill();
      x.fillStyle = '#fff3b8'; for(i = 0; i < 5; i++){ a = i / 5 * 6.2832 + .3; x.beginPath(); x.arc(Math.cos(a) * r * .33, Math.sin(a) * r * .33, r * .055, 0, 7); x.fill(); }
    }
    x.restore();
  }
  function folha(x, px, py, lado, tam, ang){
    x.save(); x.translate(px, py); x.rotate(lado * ang); x.fillStyle = '#63c487';
    x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(lado * tam * .55, -tam * .5, lado * tam, -tam * .12); x.quadraticCurveTo(lado * tam * .5, tam * .26, 0, 0); x.fill();
    x.strokeStyle = '#3f9d68'; x.lineWidth = 1.4; x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(lado * tam * .5, -tam * .14, lado * tam * .86, -tam * .12); x.stroke(); x.restore();
  }
  // Fases: semente na terra → broto de duas folhas → haste com botão fechado → flor aberta.
  function planta(x, cx, by, c, tm, esc0){
    var k = c.semente, e = esc0 || 1, prog = Math.min(1, (+c.regas || 0) / Math.max(1, +c.precisa || 1));
    if(prog <= 0){
      x.fillStyle = '#5b3620'; x.beginPath(); x.ellipse(cx, by + 1, 13 * e, 5 * e, 0, 0, 7); x.fill();
      x.strokeStyle = '#3f9d68'; x.lineWidth = 2.6 * e; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, by); x.lineTo(cx, by - 9 * e); x.stroke();
      folha(x, cx, by - 8 * e, -1, 9 * e, .5); folha(x, cx, by - 8 * e, 1, 9 * e, .5); return;
    }
    var teto = {sakura:78, tulipa:82, girassol:108, lunar:88}[k] || 80, alt = (20 + prog * teto) * e, sway = Math.sin(tm * 1.6 + cx * .02) * 3.2 * prog * e;
    var tx = cx + sway, ty = by - alt;
    x.strokeStyle = '#3f9d68'; x.lineWidth = (k === 'girassol' ? 6.5 : 5) * e; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, by); x.quadraticCurveTo(cx + sway * .3, by - alt * .55, tx, ty); x.stroke();
    if(k === 'tulipa'){
      x.fillStyle = '#63c487'; [-1, 1].forEach(function(l){ x.beginPath(); x.moveTo(cx, by); x.quadraticCurveTo(cx + l * 26 * e, by - alt * .5, cx + l * 12 * e + sway * .4, by - alt * .78); x.quadraticCurveTo(cx + l * 6 * e, by - alt * .4, cx, by); x.fill(); });
    } else {
      if(prog > .3) folha(x, cx + sway * .25, by - alt * .34, -1, (k === 'girassol' ? 24 : 17) * e, .25);
      if(prog > .55) folha(x, cx + sway * .5, by - alt * .58, 1, (k === 'girassol' ? 22 : 15) * e, .25);
    }
    var r = ({sakura:22, tulipa:19, girassol:25, lunar:22}[k] || 21) * e;
    if(prog < 1){
      var b = (7 + prog * 8) * e, cc = COR[k] || COR.sakura;
      x.fillStyle = cc[1]; x.beginPath(); x.moveTo(tx, ty - b * 1.5); x.bezierCurveTo(tx + b, ty - b * .5, tx + b * .8, ty + b * .7, tx, ty + b * .7); x.bezierCurveTo(tx - b * .8, ty + b * .7, tx - b, ty - b * .5, tx, ty - b * 1.5); x.fill();
      x.fillStyle = '#4fb06a'; x.beginPath(); x.moveTo(tx - b * .8, ty + b * .1); x.quadraticCurveTo(tx, ty + b * 1.2, tx + b * .8, ty + b * .1); x.quadraticCurveTo(tx, ty + b * .6, tx - b * .8, ty + b * .1); x.fill();
      return;
    }
    cabeca(x, k, tx, ty, r + Math.sin(tm * 2.2 + cx) * .8 * e, tm, hora() >= 19 || hora() < 6);
  }
  function rr(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function laco(){ cancelAnimationFrame(anim); (function f(){ if(!ov || ov.hidden) return; desenhar(); var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; if(!reduz || festa.length || chuva.length) anim = requestAnimationFrame(f); })(); }
  window.bloomAbrir = abrir;
  // Resumo para o card do Hub (hub-novos.js): quantos canteiros pedem rega ou colheita, do último estado carregado.
  window.bloomResumo = function(){ return st ? {regar:pendentes(false).length, colher:pendentes(true).length} : null; };
  window.bloomSondar = sondar;
  window.bloomDesenharFlor = function(ctx, flor, x, y, raio){ cabeca(ctx, flor, x, y, raio, 0, false); };
  window.BLOOM_TR = T;
  // Liga depois do login: quando o hub se redesenha, pergunta ao servidor uma única vez.
  var sondado = false;
  ['hubCardsUI','contaUI'].forEach(function(n){ var o = window[n]; if(typeof o !== 'function') return;
    window[n] = function(){ var r = o.apply(this, arguments); if(!sondado && typeof contaJ !== 'undefined' && contaJ){ sondado = true; sondar(); } return r; }; });
})();
