/* TsuLiPa⭐World — Bloom⭐Garden! (Fase 4, versão 1).
   4 canteiros na Vila das Flores: semente custa ★, 1 rega por dia (Brasília), a flor fica guardada na conta.
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
    rpc('jardim_estado').then(function(r){ if(r && r.ok){ st = r; window.TW_BLOOM_ON = true; } }).catch(function(){});
  }
  function montarOv(){
    if(ov) return ov;
    ov = document.createElement('div'); ov.className = 'ov bloomov tw-window-overlay'; ov.id = 'bloomOv'; ov.hidden = true;
    ov.innerHTML = '<div class="panel bloomp tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="bloomTit">' +
      '<button type="button" class="perfx tw-window-control tw-window-close" id="bloomX" aria-label="✕">✕</button>' +
      '<h2 class="tw-modal-title" id="bloomTit"></h2><small class="tw-modal-jp" lang="ja">ブルームガーデン</small>' +
      '<canvas id="bloomCv" width="720" height="360"></canvas><div id="bloomCorpo"></div></div>';
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
      else if(a === 'plantar'){ var s = ov.querySelector('#bloomSem' + c); acao('jardim_plantar', {p_canteiro:c, p_semente:s ? s.value : 'sakura'}); }
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
  function fechar(){ if(ov) ov.hidden = true; cancelAnimationFrame(anim); anim = 0; }
  function acao(nome, args){
    ocupado = true; msg = ''; escolha = -1; idolIr(args && args.p_canteiro); ui();
    rpc(nome, args).then(function(r){
      if(r && r.ok){
        if(window.TWVidaCidade)window.TWVidaCidade.registrar('bloom_'+nome.replace('jardim_',''),{flor:r.flor});
        if(typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} if(typeof setBest === 'function') try{ setBest(); }catch(e){} }
        if(nome === 'jardim_colher'){ msg = SEM[r.flor][0] + ' ' + t('colheu', t(r.flor)); for(var i = 0; i < 14; i++) festa.push({c:args.p_canteiro, i:i, t0:performance.now()}); if(typeof sfx !== 'undefined' && sfx && sfx.rank) try{ sfx.rank(); }catch(e){} }
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
        if(window.TWVidaCidade)window.TWVidaCidade.registrar('bloom_'+nome.replace('jardim_',''),{flor:r.flor});
        if(r.flor && SEM[r.flor]){ colhidas.push(SEM[r.flor][0]); for(var k = 0; k < 14; k++) festa.push({c:i, i:k, t0:performance.now()}); }
      });
    });
    fila.then(function(){
      if(colhidas.length){ msg = colhidas.join(' ') + ' ' + t('colhido'); if(typeof sfx !== 'undefined' && sfx && sfx.rank) try{ sfx.rank(); }catch(e){} }
      else if(typeof beep === 'function') try{ beep(880, .07, 'triangle', .04); }catch(e){}
      return rpc('jardim_estado').then(function(e){ if(e && e.ok) st = e; });
    }).catch(function(){ msg = t('erro'); }).then(function(){ ocupado = false; ui(); laco(); });
  }
  function canteiro(i){ return st && Array.isArray(st.canteiros) ? st.canteiros.find(function(c){ return +c.canteiro === i; }) : null; }
  function ui(){
    if(!ov) return;
    ov.querySelector('#bloomTit').textContent = '🌷 ' + t('tit');
    var corpo = ov.querySelector('#bloomCorpo'), dis = ocupado ? ' disabled' : '';
    if(!st){ corpo.innerHTML = '<p class="perfcarr">' + esc(typeof tr === 'function' ? tr('Carregando...') : '…') + '</p>' + (msg ? '<p class="bloommsg">' + esc(msg) + '</p>' : ''); desenhar(); return; }
    var h = '<p class="bloomsub">' + esc(t('sub')) + ' <b>★ ' + (+st.stars || 0) + '</b></p>';
    if(msg) h += '<p class="bloommsg" aria-live="polite">' + esc(msg) + '</p>';
    if(escolha >= 0 && !canteiro(escolha)){
      h += '<div class="bloompick" role="group"><b>🌱 ' + esc(t('escolha', escolha + 1)) + '</b><div>' + ORDEM.map(function(k){
        var p = st.sementes && st.sementes[k] || [0, 0], caro = (+st.stars || 0) < +p[0];
        return '<button type="button" class="btn alt" data-bloom="semente" data-c="' + escolha + '" data-s="' + k + '"' + (ocupado || caro ? ' disabled' : '') + '>' +
          '<span>' + SEM[k][0] + ' ' + esc(t(k)) + '</span><small>★' + p[0] + ' · ' + esc(t('dia', p[1], p[1]).replace(/^\d+\//, '')) + '</small></button>'; }).join('') +
        '</div><button type="button" class="bloomnao" data-bloom="cancelar">' + esc(t('fechar')) + '</button></div>';
    } else h += '<p class="bloomdica">👆 ' + esc(t('toque')) + '</p>';
    var aRegar = pendentes(false).length, aColher = pendentes(true).length;
    if(aRegar > 1 || aColher > 1) h += '<div class="btns bloomlote">' +
      (aColher > 1 ? '<button type="button" class="btn" data-bloom="colher-tudo"' + dis + '>🌼 ' + esc(t('colherTudo')) + ' (' + aColher + ')</button>' : '') +
      (aRegar > 1 ? '<button type="button" class="btn alt" data-bloom="regar-tudo"' + dis + '>💧 ' + esc(t('regarTudo')) + ' (' + aRegar + ')</button>' : '') + '</div>';
    h += '<ul class="bloomlista">';
    for(var i = 0; i < 4; i++){
      var c = canteiro(i);
      h += '<li><b>' + esc(t('cant')) + ' ' + (i + 1) + '</b> ';
      if(!c){
        h += '<span>' + esc(t('vazio')) + '</span><select id="bloomSem' + i + '"' + dis + '>' + ORDEM.map(function(k){ var p = st.sementes && st.sementes[k] || [0, 0];
          return '<option value="' + k + '">' + SEM[k][0] + ' ' + esc(t(k)) + ' · ★' + p[0] + ' · ' + esc(t('dia', p[1], p[1]).replace(/^\d+\//, '')) + '</option>'; }).join('') +
          '</select><button type="button" class="btn" data-bloom="plantar" data-c="' + i + '"' + dis + '>' + esc(t('plantar')) + '</button>';
      } else {
        var florida = pronta(c);
        h += '<span>' + SEM[c.semente][0] + ' ' + esc(t(c.semente)) + ' · ' + esc(florida ? t('pronta') : t('dia', c.regas, c.precisa)) + '</span>' +
          (florida ? '<button type="button" class="btn" data-bloom="colher" data-c="' + i + '"' + dis + '>🌼 ' + esc(t('colher')) + '</button>' :
            c.regado_hoje ? '<em>' + esc(t('regado')) + '</em>' : '<button type="button" class="btn alt" data-bloom="regar" data-c="' + i + '"' + dis + '>💧 ' + esc(t('regar')) + '</button>');
      }
      h += '</li>';
    }
    h += '</ul><p class="bloomdica">' + esc(t('dica')) + '</p><h3>' + esc(t('flores')) + '</h3>';
    var fl = st.flores || {}, tem = ORDEM.filter(function(k){ return +fl[k] > 0; });
    h += tem.length ? '<p class="bloomflores">' + tem.map(function(k){ return '<span>' + SEM[k][0] + ' ' + esc(t(k)) + ' ×' + (+fl[k]) + '</span>'; }).join('') + '</p>' : '<p class="bloomdica">' + esc(t('nenhuma')) + '</p>';
    corpo.innerHTML = h; desenhar();
  }
  // ---------- canteiros desenhados no canvas (mesmo estilo chapado do jogo) ----------
  function desenhar(){
    var cv = ov && ov.querySelector('#bloomCv'); if(!cv) return;
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, tm = performance.now() / 1000;
    var hr = hora(), noite = hr >= 19 || hr < 6, tarde = hr >= 17 && hr < 19;
    var g = x.createLinearGradient(0, 0, 0, H);
    if(noite){ g.addColorStop(0, '#231a5c'); g.addColorStop(1, '#6a4aa8'); }
    else if(tarde){ g.addColorStop(0, '#ffb98a'); g.addColorStop(1, '#ffd9ec'); }
    else { g.addColorStop(0, '#c7e6ff'); g.addColorStop(1, '#ffe6f4'); }
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    if(noite){
      x.fillStyle = '#fff'; for(var e2 = 0; e2 < 26; e2++){ x.globalAlpha = .35 + .5 * Math.abs(Math.sin(tm * 1.4 + e2 * 1.7)); x.beginPath(); x.arc((e2 * 131 + 40) % W, 10 + (e2 * 47) % 110, 1.2 + (e2 % 3) * .5, 0, 7); x.fill(); }
      x.globalAlpha = 1; x.fillStyle = '#fff6c9'; x.beginPath(); x.arc(610, 52, 24, 0, 7); x.fill(); x.fillStyle = '#231a5c'; x.globalAlpha = .9; x.beginPath(); x.arc(600, 46, 21, 0, 7); x.fill(); x.globalAlpha = 1;
    } else if(tarde){ x.fillStyle = '#fff1b8'; x.globalAlpha = .9; x.beginPath(); x.arc(600, 150, 34, 0, 7); x.fill(); x.globalAlpha = 1; }
    x.fillStyle = noite ? '#b9a8e8' : '#fff'; [[110, 50, 1], [520, 40, .8]].forEach(function(n){ var cx = (n[0] + tm * 6) % (W + 160) - 80; x.globalAlpha = .9; x.beginPath(); x.ellipse(cx, n[1], 46 * n[2], 16 * n[2], 0, 0, 7); x.ellipse(cx - 26 * n[2], n[1] + 5, 26 * n[2], 12 * n[2], 0, 0, 7); x.ellipse(cx + 26 * n[2], n[1] - 4, 30 * n[2], 14 * n[2], 0, 0, 7); x.fill(); }); x.globalAlpha = 1;
    x.fillStyle = noite ? '#5f9c8f' : '#a8e6b8'; x.fillRect(0, H * .5, W, H * .5); x.fillStyle = noite ? '#4f8a80' : '#92ddb0'; x.fillRect(0, H * .5, W, 8);
    for(var f = 0; f < 19; f++){ var fx = 12 + f * 39; x.fillStyle = noite ? '#cfc4ea' : '#fff7ea'; x.beginPath(); x.moveTo(fx, H * .5 - 34); x.lineTo(fx + 8, H * .5 - 44); x.lineTo(fx + 16, H * .5 - 34); x.lineTo(fx + 16, H * .5 + 4); x.lineTo(fx, H * .5 + 4); x.fill(); }
    x.fillStyle = noite ? '#cfc4ea' : '#fff7ea'; x.fillRect(0, H * .5 - 26, W, 6); x.fillRect(0, H * .5 - 10, W, 6);
    jardineiro(x, H, tm);
    for(var i = 0; i < 4; i++){
      var cx = 100 + i * 173, by = H * .78, c = canteiro(i);
      x.fillStyle = 'rgba(60,30,20,.16)'; x.beginPath(); x.ellipse(cx, by + 30, 78, 14, 0, 0, 7); x.fill();
      x.fillStyle = '#c98d55'; rr(x, cx - 74, by - 22, 148, 52, 18); x.fill();
      x.fillStyle = c && c.regado_hoje ? '#7a4a2b' : '#a8723f'; rr(x, cx - 66, by - 16, 132, 38, 14); x.fill();
      x.fillStyle = '#fff'; x.font = '19px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText(String(i + 1), cx - 56, by + 27);
      if(c && noite && c.semente === 'lunar' && pronta(c)){ var hl = x.createRadialGradient(cx, by - 100, 4, cx, by - 100, 60); hl.addColorStop(0, 'rgba(217,194,255,.75)'); hl.addColorStop(1, 'rgba(217,194,255,0)'); x.fillStyle = hl; x.fillRect(cx - 62, by - 162, 124, 124); }
      if(c) planta(x, cx, by - 6, c, tm);
      balao(x, cx, by, i, c, tm);
      if(c && c.regado_hoje) for(var d = 0; d < 3; d++){ var u = (tm * .8 + d / 3) % 1; x.fillStyle = 'rgba(127,211,255,' + (1 - u).toFixed(2) + ')'; x.beginPath(); x.arc(cx - 30 + d * 30, by - 60 + u * 40, 4, 0, 7); x.fill(); }
    }
    festa = festa.filter(function(p){ var u = (performance.now() - p.t0) / 1400; if(u > 1) return false; var a = p.i / 14 * Math.PI * 2, r = 20 + u * 90;
      x.globalAlpha = 1 - u; x.font = '22px sans-serif'; x.fillText(['🌸','✨','🌷','💖'][p.i % 4], 100 + p.c * 173 + Math.cos(a) * r, H * .6 + Math.sin(a) * r * .6 - u * 30); x.globalAlpha = 1; return true; });
  }
  function hora(){
    if(typeof window.TW_MAPA_HORA === 'number') return window.TW_MAPA_HORA;
    try{ return +new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo', hour:'numeric', hourCycle:'h23'}).format(new Date()); }catch(e){ return new Date().getHours(); }
  }
  // Balãozinho de cada canteiro: ＋ (vazio), 💧 (falta regar hoje), 🌼 (pode colher) e o progresso n/m.
  function balao(x, cx, by, i, c, tm){
    var ico = !c ? '＋' : pronta(c) ? '🌼' : c.regado_hoje ? '' : '💧', sel = escolha === i;
    if(c && !pronta(c)){ x.fillStyle = '#fff'; x.font = '19px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.fillText((+c.regas || 0) + '/' + (+c.precisa || 0), cx + 44, by + 27); }
    if(!ico) return;
    var bx = cx + 50, byy = by - 58 + Math.sin(tm * 3 + i) * 3;
    x.fillStyle = sel ? '#ffe14d' : '#fff'; x.strokeStyle = !c ? '#b6a0ee' : pronta(c) ? '#ff9bb8' : '#7fd3ff'; x.lineWidth = 3;
    x.beginPath(); x.arc(bx, byy, 17, 0, 7); x.fill(); x.stroke();
    x.beginPath(); x.moveTo(bx - 6, byy + 15); x.lineTo(bx - 12, byy + 25); x.lineTo(bx + 2, byy + 16); x.fillStyle = sel ? '#ffe14d' : '#fff'; x.fill();
    x.fillStyle = '#7b3ff0'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = (!c ? '22px "Mochiy Pop One",sans-serif' : '19px sans-serif'); x.fillText(ico, bx, byy + 1); x.textBaseline = 'alphabetic';
  }
  // O seu Idol (e o pet ativo) cuidam do jardim: passeiam atrás dos canteiros e vão até o que você tocou.
  // Usa o mesmo desenho do jogo, ligando o visual só durante o desenho; sem ele, o jardim fica como antes.
  function jardineiro(x, H, tm){
    if(typeof hubAv !== 'function' || typeof perfChar !== 'function' || typeof drawChar !== 'function' || typeof perfCharContorno !== 'function') return;
    var av = null, salvo = null, sc = 2.05, chao = H * .5 + 44;
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
  function planta(x, cx, by, c, tm){
    var s = SEM[c.semente], prog = Math.min(1, (+c.regas || 0) / Math.max(1, +c.precisa || 1)), sway = Math.sin(tm * 1.8 + cx) * 3;
    if(prog <= 0){ x.fillStyle = '#6b3f22'; x.beginPath(); x.ellipse(cx, by, 12, 6, 0, 0, 7); x.fill(); x.fillStyle = '#8bd17c'; x.beginPath(); x.ellipse(cx + 2, by - 6, 4, 6, .4, 0, 7); x.fill(); return; }
    var alt = 22 + prog * 70;
    x.strokeStyle = '#4fb06a'; x.lineWidth = 6; x.lineCap = 'round'; x.beginPath(); x.moveTo(cx, by); x.quadraticCurveTo(cx + sway, by - alt / 2, cx + sway, by - alt); x.stroke();
    x.fillStyle = '#6fd18f'; [[-1, .45], [1, .65]].forEach(function(l){ if(prog < l[1] - .2) return; x.beginPath(); x.ellipse(cx + l[0] * 14 + sway * .5, by - alt * l[1], 13, 6, l[0] * .5, 0, 7); x.fill(); });
    var top = by - alt;
    if(prog < 1){ x.fillStyle = s[1]; x.beginPath(); x.ellipse(cx + sway, top, 8 + prog * 6, 11 + prog * 6, 0, 0, 7); x.fill(); return; }
    var r = 20 + Math.sin(tm * 2.4 + cx) * 1.5;
    x.fillStyle = s[1]; for(var k = 0; k < 6; k++){ var a = k / 6 * Math.PI * 2 + tm * .3; x.beginPath(); x.ellipse(cx + sway + Math.cos(a) * r * .7, top + Math.sin(a) * r * .7, r * .55, r * .38, a, 0, 7); x.fill(); }
    x.fillStyle = s[2]; x.beginPath(); x.arc(cx + sway, top, r * .42, 0, 7); x.fill();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(cx + sway - 4, top - 4, r * .13, 0, 7); x.fill();
  }
  function rr(x, a, b, w, h, r){ x.beginPath(); x.moveTo(a + r, b); x.arcTo(a + w, b, a + w, b + h, r); x.arcTo(a + w, b + h, a, b + h, r); x.arcTo(a, b + h, a, b, r); x.arcTo(a, b, a + w, b, r); x.closePath(); }
  function laco(){ cancelAnimationFrame(anim); (function f(){ if(!ov || ov.hidden) return; desenhar(); var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; if(!reduz || festa.length) anim = requestAnimationFrame(f); })(); }
  window.bloomAbrir = abrir;
  window.bloomSondar = sondar;
  window.BLOOM_TR = T;
  // Liga depois do login: quando o hub se redesenha, pergunta ao servidor uma única vez.
  var sondado = false;
  ['hubCardsUI','contaUI'].forEach(function(n){ var o = window[n]; if(typeof o !== 'function') return;
    window[n] = function(){ var r = o.apply(this, arguments); if(!sondado && typeof contaJ !== 'undefined' && contaJ){ sondado = true; sondar(); } return r; }; });
})();
