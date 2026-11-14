/* TsuLiPa⭐World — Photo⭐Studio! v1 (docs/PHOTO_STUDIO_PROPOSTA.md).
   Pauta do dia da Idol⭐News! → você monta a foto (cenário, pose, luz, enquadramento, objeto) → clique →
   o servidor confere (studio_pauta / studio_clique: 1–3 estrelas, ★5/dia na 1ª foto com 3) → polaroid PNG.
   Sem conta: treino com pauta local, sem prêmio. Nenhuma imagem sai do aparelho.
   Cenários do estúdio são próprios (não liberam fundos/poses pagos da lojinha). */
(function(){
  'use strict';
  var FUNDOS = ['rosa','cortina','nuvens','neon'], POSES = ['normal','v','coracao','tchau'], LUZES = ['suave','neon','por'],
      QUADROS = ['rosto','meio','inteiro'], OBJ = ['nenhum','balao','microfone','lightstick'], FLORES = {sakura:'🌸',tulipa:'🌷',girassol:'🌻',lunar:'⭐'};
  var EMO = {rosa:'🎀',cortina:'🪟',nuvens:'☁️',neon:'💜',normal:'🙂',v:'✌️',coracao:'🫰',tchau:'👋',suave:'🕯️',neon_l:'🌈',por:'🌇',rosto:'🙂',meio:'👕',inteiro:'🧍',nenhum:'✖',balao:'🎈',microfone:'🎤',lightstick:'🪄'};
  var T = {
    pt:{tit:'Photo⭐Studio!',pauta:'Pauta do dia',fundo:'Cenário',pose:'Pose',luz:'Luz',quadro:'Enquadramento',objeto:'Objeto',clique:'📸 Clicar!',outra:'Tirar outra',salvar:'Salvar foto',
      treino:'Treino sem conta: entre para o fotógrafo conferir e ganhar ★5.',premio:'+★5 pela foto perfeita do dia!',erro:'Não deu certo. Tente de novo.',estrelas:'{n} de 3 estrelas',
      rosa:'Fundo rosa',cortina:'Janela',nuvens:'Nuvens',neon:'Neon',normal:'Normal',v:'V',coracao:'Coração',tchau:'Tchau',suave:'Suave',neon_l:'Neon',por:'Pôr do sol',rosto:'Rosto',meio:'Meio corpo',inteiro:'Corpo inteiro',nenhum:'Nenhum',balao:'Balões',microfone:'Microfone',lightstick:'Lightstick',flor:'Flor',
      t_luz:'Ensaio de luz',t_quadro:'Retrato de revista',t_objeto:'Capa com objeto'},
    en:{tit:'Photo⭐Studio!',pauta:'Today\'s brief',fundo:'Backdrop',pose:'Pose',luz:'Light',quadro:'Framing',objeto:'Prop',clique:'📸 Snap!',outra:'Take another',salvar:'Save photo',
      treino:'Practice without an account: sign in for the photographer to check and earn ★5.',premio:'+★5 for today\'s perfect photo!',erro:'Something went wrong. Try again.',estrelas:'{n} of 3 stars',
      rosa:'Pink backdrop',cortina:'Window',nuvens:'Clouds',neon:'Neon',normal:'Normal',v:'V',coracao:'Heart',tchau:'Wave',suave:'Soft',neon_l:'Neon',por:'Sunset',rosto:'Face',meio:'Half body',inteiro:'Full body',nenhum:'None',balao:'Balloons',microfone:'Microphone',lightstick:'Lightstick',flor:'Flower',
      t_luz:'Lighting shoot',t_quadro:'Magazine portrait',t_objeto:'Cover with a prop'},
    es:{tit:'Photo⭐Studio!',pauta:'Pauta del día',fundo:'Fondo',pose:'Pose',luz:'Luz',quadro:'Encuadre',objeto:'Objeto',clique:'📸 ¡Clic!',outra:'Tomar otra',salvar:'Guardar foto',
      treino:'Práctica sin cuenta: inicia sesión para que el fotógrafo revise y ganar ★5.',premio:'¡+★5 por la foto perfecta del día!',erro:'No funcionó. Inténtalo de nuevo.',estrelas:'{n} de 3 estrellas',
      rosa:'Fondo rosa',cortina:'Ventana',nuvens:'Nubes',neon:'Neón',normal:'Normal',v:'V',coracao:'Corazón',tchau:'Saludo',suave:'Suave',neon_l:'Neón',por:'Atardecer',rosto:'Rostro',meio:'Medio cuerpo',inteiro:'Cuerpo entero',nenhum:'Ninguno',balao:'Globos',microfone:'Micrófono',lightstick:'Lightstick',flor:'Flor',
      t_luz:'Sesión de luz',t_quadro:'Retrato de revista',t_objeto:'Portada con objeto'},
    id:{tit:'Photo⭐Studio!',pauta:'Tugas hari ini',fundo:'Latar',pose:'Pose',luz:'Cahaya',quadro:'Bingkai',objeto:'Properti',clique:'📸 Jepret!',outra:'Foto lagi',salvar:'Simpan foto',
      treino:'Latihan tanpa akun: masuk agar fotografer memeriksa dan dapat ★5.',premio:'+★5 untuk foto sempurna hari ini!',erro:'Gagal. Coba lagi.',estrelas:'{n} dari 3 bintang',
      rosa:'Latar pink',cortina:'Jendela',nuvens:'Awan',neon:'Neon',normal:'Normal',v:'V',coracao:'Hati',tchau:'Dadah',suave:'Lembut',neon_l:'Neon',por:'Senja',rosto:'Wajah',meio:'Setengah badan',inteiro:'Seluruh badan',nenhum:'Tidak ada',balao:'Balon',microfone:'Mikrofon',lightstick:'Lightstick',flor:'Bunga',
      t_luz:'Pemotretan cahaya',t_quadro:'Potret majalah',t_objeto:'Sampul dengan properti'},
    th:{tit:'Photo⭐Studio!',pauta:'โจทย์วันนี้',fundo:'ฉากหลัง',pose:'ท่าทาง',luz:'แสง',quadro:'มุมกล้อง',objeto:'พร็อพ',clique:'📸 ถ่ายเลย!',outra:'ถ่ายอีกรูป',salvar:'บันทึกรูป',
      treino:'ฝึกแบบไม่มีบัญชี: เข้าสู่ระบบเพื่อให้ช่างภาพตรวจและรับ ★5',premio:'+★5 จากรูปสมบูรณ์แบบวันนี้!',erro:'ไม่สำเร็จ ลองอีกครั้ง',estrelas:'{n} จาก 3 ดาว',
      rosa:'ฉากชมพู',cortina:'หน้าต่าง',nuvens:'ก้อนเมฆ',neon:'นีออน',normal:'ปกติ',v:'วี',coracao:'หัวใจ',tchau:'โบกมือ',suave:'นุ่มนวล',neon_l:'นีออน',por:'พระอาทิตย์ตก',rosto:'ใบหน้า',meio:'ครึ่งตัว',inteiro:'เต็มตัว',nenhum:'ไม่มี',balao:'ลูกโป่ง',microfone:'ไมโครโฟน',lightstick:'แท่งไฟ',flor:'ดอกไม้',
      t_luz:'ถ่ายเล่นแสง',t_quadro:'ภาพนิตยสาร',t_objeto:'ปกพร้อมพร็อพ'},
    ja:{tit:'Photo⭐Studio!',pauta:'今日のお題',fundo:'背景',pose:'ポーズ',luz:'ライト',quadro:'フレーミング',objeto:'小物',clique:'📸 パシャ！',outra:'もう一枚',salvar:'写真を保存',
      treino:'アカウントなしの練習：ログインするとカメラマンが判定して★5がもらえます。',premio:'今日のパーフェクト写真で★5！',erro:'うまくいきませんでした。もう一度試してね。',estrelas:'3つ中{n}つ星',
      rosa:'ピンク背景',cortina:'窓',nuvens:'くも',neon:'ネオン',normal:'ふつう',v:'ピース',coracao:'ハート',tchau:'バイバイ',suave:'やわらか',neon_l:'ネオン',por:'夕焼け',rosto:'顔',meio:'上半身',inteiro:'全身',nenhum:'なし',balao:'風船',microfone:'マイク',lightstick:'ペンライト',flor:'花',
      t_luz:'ライト撮影',t_quadro:'雑誌のポートレート',t_objeto:'小物の表紙'}
  };
  function L(){ return typeof LANG === 'string' && T[LANG] ? LANG : 'pt'; }
  function t(k){ return T[L()][k] || T.pt[k] || k; }
  function nomeOpc(tipo, v){ if(v.indexOf('flor_') === 0){ var B = window.BLOOM_TR, k = v.slice(5); return FLORES[k] + ' ' + ((B && (B[L()] || B.pt)[k]) || t('flor')); } return t(tipo === 'luz' && v === 'neon' ? 'neon_l' : v); }
  function emo(tipo, v){ return v.indexOf('flor_') === 0 ? FLORES[v.slice(5)] : EMO[tipo === 'luz' && v === 'neon' ? 'neon_l' : v] || ''; }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(s) : String(s); }
  var ov = null, anim = 0, pauta = null, servidor = false, esc_ = {fundo:'rosa',pose:'v',luz:'suave',quadro:'inteiro',objeto:'nenhum'}, flores = {}, fase = 'monta', foto = null, msg = '', ocupado = false, cont = 0;
  window.TW_STUDIO_ON = true;
  function hojeBR(){ return new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); }
  function h(s){ var x = 0; for(var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; }
  function pautaLocal(){ var d = hojeBR(), k = h(d + 'k') % 3, tp = ['luz','quadro','objeto'][k], L2 = {luz:LUZES,quadro:QUADROS,objeto:OBJ.slice(1)}[tp];
    return {dia:d, fundo:FUNDOS[h(d + 'f') % 4], pose:POSES[h(d + 'p') % 4], detalhe:{tipo:tp, valor:L2[h(d + 'v') % L2.length]}}; }
  function logado(){ return typeof contaJ !== 'undefined' && contaJ && typeof contaRpc === 'function'; }
  function acertos(){ if(!pauta) return [false,false,false]; return [esc_.fundo === pauta.fundo, esc_.pose === pauta.pose, esc_[pauta.detalhe.tipo] === pauta.detalhe.valor]; }

  function montarOv(){
    if(ov) return;
    ov = document.createElement('div'); ov.className = 'ov studioov tw-window-overlay'; ov.id = 'studioOv'; ov.hidden = true;
    ov.innerHTML = '<div class="panel studiop tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="studioTit">' +
      '<button type="button" class="perfx tw-window-control tw-window-close" id="studioX" aria-label="✕">✕</button>' +
      '<h2 class="tw-modal-title" id="studioTit"></h2><small class="tw-modal-jp" lang="ja">フォトスタジオ</small>' +
      '<div id="studioPauta"></div><canvas id="studioCv" width="480" height="600"></canvas><div id="studioCorpo"></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){
      if(e.target === ov || e.target.id === 'studioX'){ fechar(); return; }
      var b = e.target.closest && e.target.closest('[data-st]'); if(!b || ocupado) return;
      var a = b.getAttribute('data-st'), v = b.getAttribute('data-v');
      if(a === 'clique') clicar(); else if(a === 'outra'){ fase = 'monta'; foto = null; msg = ''; ui(); }
      else if(a === 'salvar') salvar();
      else if(esc_.hasOwnProperty(a)){ esc_[a] = v; ui(); if(typeof beep === 'function') try{ beep(988, .04, 'triangle', .03); }catch(er){} }
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov && !ov.hidden) fechar(); });
  }
  function abrir(){
    montarOv(); ov.hidden = false; fase = 'monta'; foto = null; msg = ''; servidor = false; pauta = pautaLocal(); ui(); laco();
    if(logado()){
      contaRpc('studio_pauta').then(function(r){ if(r && r.ok){ pauta = r; servidor = true; ui(); } }).catch(function(){});
      contaRpc('jardim_estado').then(function(r){ if(r && r.ok){ flores = r.flores || {}; ui(); } }).catch(function(){});
    }
  }
  function fechar(){ if(ov) ov.hidden = true; cancelAnimationFrame(anim); anim = 0; }
  function clicar(){
    fase = 'contagem'; cont = performance.now(); ocupado = true; ui();
    setTimeout(function(){
      var ac = acertos(), n = Math.max(1, ac.filter(Boolean).length);
      if(typeof beep === 'function') try{ beep(1760, .05, 'square', .03); }catch(e){}
      foto = {estrelas:n, escolhas:JSON.parse(JSON.stringify(esc_)), t0:performance.now(), verificada:false, premio:0};
      if(!logado() || !servidor){ fase = 'foto'; ocupado = false; msg = logado() ? '' : t('treino'); ui(); return; }
      contaRpc('studio_clique', {p:esc_}).then(function(r){
        if(r && r.ok){ foto.estrelas = +r.estrelas || n; foto.verificada = true; foto.premio = +r.premio || 0;
          if(foto.premio && typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} if(typeof setBest === 'function') try{ setBest(); }catch(e){} }
          msg = foto.premio ? t('premio') : '';
        } else msg = t('erro');
      }).catch(function(){ msg = t('erro'); }).then(function(){ fase = 'foto'; ocupado = false; ui(); });
    }, 1900);
  }
  function salvar(){
    var cv = ov && ov.querySelector('#studioCv'); if(!cv) return;
    try{ var a = document.createElement('a'); a.download = 'photo-studio-' + hojeBR() + '.png'; a.href = cv.toDataURL('image/png'); document.body.appendChild(a); a.click(); a.remove(); }catch(e){ msg = t('erro'); ui(); }
  }
  function chips(tipo, lista){
    return '<div class="stgrupo"><b>' + esc(t(tipo)) + '</b><div>' + lista.map(function(v){
      return '<button type="button" class="stchip' + (esc_[tipo] === v ? ' on' : '') + '" data-st="' + tipo + '" data-v="' + v + '" aria-pressed="' + (esc_[tipo] === v) + '"' + (ocupado ? ' disabled' : '') + '>' + emo(tipo, v) + ' ' + esc(nomeOpc(tipo, v)) + '</button>'; }).join('') + '</div></div>';
  }
  function ui(){
    if(!ov) return;
    ov.querySelector('#studioTit').textContent = '📸 ' + t('tit');
    var ac = acertos(), d = pauta && pauta.detalhe;
    ov.querySelector('#studioPauta').innerHTML = pauta ? '<div class="stpauta"><b>📰 ' + esc(t('pauta')) + ': ' + esc(t('t_' + d.tipo)) + '</b><span>' +
      [[ac[0], emo('fundo', pauta.fundo) + ' ' + nomeOpc('fundo', pauta.fundo)], [ac[1], emo('pose', pauta.pose) + ' ' + nomeOpc('pose', pauta.pose)], [ac[2], emo(d.tipo, d.valor) + ' ' + nomeOpc(d.tipo, d.valor)]]
        .map(function(p){ return '<i class="' + (p[0] ? 'ok' : '') + '">' + (p[0] ? '✓ ' : '') + esc(p[1]) + '</i>'; }).join('') + '</span></div>' : '';
    var c = ov.querySelector('#studioCorpo'), hh = '';
    if(msg) hh += '<p class="stmsg" aria-live="polite">' + esc(msg) + '</p>';
    if(fase === 'foto'){
      hh += '<p class="stres">' + '⭐'.repeat(foto.estrelas) + '☆'.repeat(3 - foto.estrelas) + ' · ' + esc(t('estrelas').replace('{n}', foto.estrelas)) + '</p>' +
        '<div class="btns"><button type="button" class="btn" data-st="salvar">💾 ' + esc(t('salvar')) + '</button><button type="button" class="btn alt" data-st="outra">🔁 ' + esc(t('outra')) + '</button></div>';
    } else {
      var objs = OBJ.concat(Object.keys(FLORES).filter(function(k){ return +flores[k] > 0; }).map(function(k){ return 'flor_' + k; }));
      if(esc_.objeto.indexOf('flor_') === 0 && objs.indexOf(esc_.objeto) < 0) esc_.objeto = 'nenhum';
      hh += chips('fundo', FUNDOS) + chips('pose', POSES) + chips('luz', LUZES) + chips('quadro', QUADROS) + chips('objeto', objs) +
        '<div class="btns"><button type="button" class="btn stclique" data-st="clique"' + (ocupado ? ' disabled' : '') + '>' + esc(t('clique')) + '</button></div>';
      if(!logado()) hh += '<p class="stdica">' + esc(t('treino')) + '</p>';
    }
    c.innerHTML = hh; desenhar();
  }
  // ---------- desenho ----------
  var off = null;
  function meuAv(){ try{ if(typeof lookAtual === 'function') return lookAtual(); }catch(e){} try{ if(typeof hubAv === 'function') return hubAv(); }catch(e){} return {}; }
  function fundo(x, W, H, f, tm){
    var g;
    if(f === 'rosa'){ g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffd6ea'); g.addColorStop(.75, '#ffeef6'); g.addColorStop(1, '#f7c5dd'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(W / 2, H * .9, W * .55, H * .08, 0, 0, 7); x.fill(); }
    else if(f === 'cortina'){ x.fillStyle = '#fff4e6'; x.fillRect(0, 0, W, H); x.fillStyle = '#bfe9ff'; x.fillRect(W * .2, H * .1, W * .6, H * .45); x.fillStyle = '#fff'; x.fillRect(W * .495, H * .1, W * .01, H * .45); x.fillRect(W * .2, H * .32, W * .6, H * .01);
      x.fillStyle = '#ff9bd0'; for(var s = 0; s < 2; s++){ x.beginPath(); x.moveTo(s ? W * .8 : W * .2, H * .06); x.quadraticCurveTo(s ? W * .62 : W * .38, H * .3, s ? W * .74 : W * .26, H * .62); x.lineTo(s ? W * .86 : W * .14, H * .62); x.lineTo(s ? W * .86 : W * .14, H * .06); x.fill(); }
      x.fillStyle = '#f3d3b8'; x.fillRect(0, H * .82, W, H * .18); }
    else if(f === 'nuvens'){ g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9fd8ff'); g.addColorStop(1, '#fbe7ff'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fff'; [[.2, .2, 1], [.75, .32, .8], [.35, .78, 1.3], [.85, .85, 1]].forEach(function(n, i){ var cx = W * n[0] + Math.sin(tm / 2 + i) * 6, cy = H * n[1], r = 30 * n[2];
        x.beginPath(); x.arc(cx, cy, r, 0, 7); x.arc(cx - r, cy + 8, r * .7, 0, 7); x.arc(cx + r, cy + 6, r * .75, 0, 7); x.fill(); }); }
    else { x.fillStyle = '#1d1238'; x.fillRect(0, 0, W, H); x.lineWidth = 6; x.lineCap = 'round';
      [['#ff6fb5', .12], ['#4dd8ff', .22], ['#b6ff3b', .32]].forEach(function(c, i){ x.strokeStyle = c[0]; x.globalAlpha = .55 + .35 * Math.sin(tm * 2 + i); x.beginPath(); x.arc(W / 2, H * .5, W * (.3 + c[1]), Math.PI * 1.1, Math.PI * 1.9); x.stroke(); });
      x.globalAlpha = 1; x.fillStyle = '#2b1d55'; x.fillRect(0, H * .82, W, H * .18); }
  }
  function luz(x, W, H, l){
    x.save(); var g;
    if(l === 'neon'){ x.globalCompositeOperation = 'screen'; g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,80,190,.35)'); g.addColorStop(1, 'rgba(60,200,255,.35)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    else if(l === 'por'){ x.globalCompositeOperation = 'multiply'; g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,170,110,.75)'); g.addColorStop(1, 'rgba(255,120,150,.6)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    else { x.globalCompositeOperation = 'screen'; g = x.createRadialGradient(W * .3, H * .2, 10, W * .3, H * .2, W * .9); g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    x.restore();
  }
  function objeto(x, W, H, o, tm){
    if(o === 'nenhum') return;
    x.save(); x.textAlign = 'center'; x.textBaseline = 'middle';
    if(o === 'balao'){ [['#ff6fb5', .16, .2], ['#ffd23f', .26, .14], ['#4dd8ff', .12, .1]].forEach(function(b, i){ var bx = W * b[1], by = H * b[2] + Math.sin(tm * 1.5 + i) * 5;
      x.strokeStyle = 'rgba(80,60,120,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(bx, by + 34); x.quadraticCurveTo(bx + 10, H * .45, W * .3, H * .62); x.stroke();
      x.fillStyle = b[0]; x.beginPath(); x.ellipse(bx, by, 26, 32, 0, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.ellipse(bx - 8, by - 10, 6, 9, -.4, 0, 7); x.fill(); }); }
    else { var e = o === 'microfone' ? '🎤' : o === 'lightstick' ? '🪄' : FLORES[o.slice(5)] || '';
      x.font = Math.round(H * .12) + 'px sans-serif'; x.fillText(e, W * .74, H * .64 + Math.sin(tm * 2) * 3);
      if(o === 'lightstick'){ var gl = x.createRadialGradient(W * .74, H * .6, 4, W * .74, H * .6, 70); gl.addColorStop(0, 'rgba(255,111,181,.45)'); gl.addColorStop(1, 'rgba(255,111,181,0)'); x.fillStyle = gl; x.fillRect(W * .74 - 70, H * .6 - 70, 140, 140); } }
    x.restore();
  }
  function cena(x, W, H, e, tm){
    fundo(x, W, H, e.fundo, tm);
    var av = JSON.parse(JSON.stringify(meuAv() || {})); av.pose = e.pose === 'normal' ? '' : e.pose; av.expr = 2; av.fundo = '';
    if(!off){ off = document.createElement('canvas'); }
    off.width = W; off.height = H; var o = off.getContext('2d'); o.clearRect(0, 0, W, H);
    try{ if(typeof perfDesenharIdol === 'function') perfDesenharIdol(o, W, H, av, false, e.quadro === 'rosto', tm * 60); }catch(er){}
    if(e.quadro === 'meio'){ var sh = H * .5, sw = sh * W / H; x.drawImage(off, W / 2 - sw / 2, H * .3, sw, sh, 0, 0, W, H); }
    else x.drawImage(off, 0, 0);
    objeto(x, W, H, e.objeto, tm);
    luz(x, W, H, e.luz);
  }
  function desenhar(){
    var cv = ov && ov.querySelector('#studioCv'); if(!cv) return;
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, tm = performance.now() / 1000;
    x.save(); x.clearRect(0, 0, W, H);
    if(fase === 'foto' && foto){   // polaroid: moldura branca, foto, estrelas e data
      x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
      x.save(); x.beginPath(); x.rect(24, 24, W - 48, H - 140); x.clip(); x.translate(24, 24); cena(x, W - 48, H - 140, foto.escolhas, foto.t0 / 1000); x.restore();
      var fl = Math.max(0, 1 - (performance.now() - foto.t0) / 500); if(fl > 0){ x.fillStyle = 'rgba(255,255,255,' + fl + ')'; x.fillRect(0, 0, W, H); }
      x.fillStyle = '#3c2a8f'; x.textAlign = 'center'; x.font = '30px "Mochiy Pop One",sans-serif'; x.fillText('⭐'.repeat(foto.estrelas) + '☆'.repeat(3 - foto.estrelas), W / 2, H - 76);
      x.font = '16px "Mochiy Pop One",sans-serif'; x.fillStyle = '#b83a9e';
      x.fillText('Photo⭐Studio! · ' + (pauta ? t('t_' + pauta.detalhe.tipo) : '') + ' · ' + hojeBR().split('-').reverse().slice(0, 2).join('/'), W / 2, H - 40);
    } else {
      cena(x, W, H, esc_, tm);
      x.strokeStyle = 'rgba(255,255,255,.75)'; x.lineWidth = 2; x.setLineDash([6, 6]); x.strokeRect(W / 3, 0, 0, H); x.strokeRect(2 * W / 3, 0, 0, H); x.strokeRect(0, H / 3, W, 0); x.strokeRect(0, 2 * H / 3, W, 0); x.setLineDash([]);
      if(fase === 'contagem'){ var n = 3 - Math.floor((performance.now() - cont) / 600); if(n >= 1){ x.fillStyle = 'rgba(30,10,60,.35)'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#fff'; x.font = '140px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), W / 2, H / 2); } }
    }
    x.restore();
  }
  function laco(){ cancelAnimationFrame(anim); (function f(){ if(!ov || ov.hidden) return; desenhar(); anim = requestAnimationFrame(f); })(); }
  window.studioAbrir = abrir;
  window.STUDIO_TR = T;
})();
