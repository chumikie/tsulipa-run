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
    labDica:{pt:'Leve o gatinho até o microfone (setas, deslizar ou teclado).',en:'Take the kitten to the microphone (arrows, swipe or keyboard).',es:'Lleva al gatito hasta el micrófono (flechas, deslizar o teclado).',id:'Bawa anak kucing ke mikrofon (panah, geser, atau keyboard).',th:'พาลูกแมวไปหาไมโครโฟน (ลูกศร ปัด หรือคีย์บอร์ด)',ja:'子ねこをマイクまで連れていこう（矢印・スワイプ・キーボード）。'},
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
    colorir:{pt:'Colorir o seu Idol',en:'Color your Idol',es:'Colorea tu Idol',id:'Warnai Idol-mu',th:'ระบายสีไอดอลของคุณ',ja:'アイドルのぬりえ'},
    colorirDica:{pt:'Escolha uma cor e toque numa parte do desenho. Livre, sem estrelas.',en:'Pick a color and tap a part of the drawing. Just for fun, no stars.',es:'Elige un color y toca una parte del dibujo. Libre, sin estrellas.',id:'Pilih warna lalu ketuk bagian gambar. Bebas, tanpa bintang.',th:'เลือกสีแล้วแตะส่วนของภาพ เล่นฟรี ไม่มีดาว',ja:'色をえらんで絵をタップ。自由にどうぞ（スターなし）。'},
    limpar:{pt:'Limpar',en:'Clear',es:'Borrar',id:'Hapus',th:'ล้าง',ja:'けす'},
    salvar:{pt:'Salvar PNG',en:'Save PNG',es:'Guardar PNG',id:'Simpan PNG',th:'บันทึก PNG',ja:'PNGで保存'},
    semIdol:{pt:'Abra o jogo uma vez para montar o seu Idol.',en:'Open the game once to set up your Idol.',es:'Abre el juego una vez para crear tu Idol.',id:'Buka gim sekali untuk membuat Idol-mu.',th:'เปิดเกมหนึ่งครั้งเพื่อสร้างไอดอลของคุณ',ja:'一度ゲームを開いてアイドルを作ってね。'},
    desfazer:{"pt":"Desfazer","en":"Undo","es":"Deshacer","id":"Urungkan","th":"เลิกทำ","ja":"元に戻す"},
    cores:{"pt":"Cores","en":"Colors","es":"Colores","id":"Warna","th":"สี","ja":"色"},
    corN:{"pt":"Cor {n}","en":"Color {n}","es":"Color {n}","id":"Warna {n}","th":"สี {n}","ja":"色 {n}"},
    parte:{"pt":"Área {n} de {t}. Enter para pintar.","en":"Area {n} of {t}. Enter to paint.","es":"Área {n} de {t}. Enter para pintar.","id":"Area {n} dari {t}. Enter untuk mewarnai.","th":"พื้นที่ {n} จาก {t} กด Enter เพื่อระบายสี","ja":"エリア {n}/{t}。Enterでぬる。"},
    colorirTeclas:{"pt":"Escolha uma cor. Toque para pintar; no teclado, setas escolhem a área e Enter pinta.","en":"Pick a color. Tap to paint; on keyboard, arrows select an area and Enter paints.","es":"Elige un color. Toca para pintar; las flechas eligen un área y Enter pinta.","id":"Pilih warna. Ketuk untuk mewarnai; panah memilih area dan Enter mewarnai.","th":"เลือกสีแล้วแตะเพื่อระบายสี ใช้ปุ่มลูกศรเลือกพื้นที่และ Enter เพื่อระบายสี","ja":"色を選んでタップ。矢印でエリアを選び、Enterでぬれます。"},
    pintou:{"pt":"Cor aplicada.","en":"Color applied.","es":"Color aplicado.","id":"Warna diterapkan.","th":"ระบายสีแล้ว","ja":"色をぬりました。"},
    objeto:{"pt":"Objeto {n} de {t}. Enter para conferir.","en":"Object {n} of {t}. Enter to check.","es":"Objeto {n} de {t}. Enter para comprobar.","id":"Objek {n} dari {t}. Enter untuk memeriksa.","th":"วัตถุ {n} จาก {t} กด Enter เพื่อตรวจสอบ","ja":"オブジェクト {n}/{t}。Enterでチェック。"},
    difTeclas:{"pt":"Encontre as diferenças. Setas escolhem um objeto; Enter confere.","en":"Find the differences. Arrows select an object; Enter checks.","es":"Encuentra las diferencias. Las flechas eligen un objeto; Enter comprueba.","id":"Cari perbedaan. Panah memilih objek; Enter memeriksa.","th":"ค้นหาจุดต่าง ใช้ลูกศรเลือกวัตถุและ Enter เพื่อตรวจสอบ","ja":"まちがいさがし。矢印で選び、Enterでチェック。"},
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
  function efeito(el, nome){
    if(!el)return;el.classList.remove(nome);void el.offsetWidth;el.classList.add(nome);
  }
  function status(txt){ var s = ov && ov.querySelector('.twpa-status'); if(s) s.textContent = txt; }
  window.addEventListener('keydown', function(e){
    if(!ov || ov.hidden) return;
    if(e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); fechar(); return; }
    if(jogo && jogo.tecla && /^Arrow/.test(e.key)){ e.preventDefault(); e.stopImmediatePropagation(); jogo.tecla(e.key); return; }
    if(e.key !== 'Tab') return;
    var it = Array.from(ov.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')).filter(function(el){ return !el.disabled && el.getClientRects().length; });
    if(!it.length) return;
    var a = document.activeElement, p = it[0], u = it[it.length - 1];
    if(e.shiftKey && (a === p || !ov.contains(a))){ e.preventDefault(); e.stopImmediatePropagation(); u.focus(); }
    else if(!e.shiftKey && (a === u || !ov.contains(a))){ e.preventDefault(); e.stopImmediatePropagation(); p.focus(); }
  }, true);
  function topo(tipo){
    return '<h2 class="twp-tit" id="twpaTit">' + icone(tipo) + esc(tipo ? t(tipo) : t('tit')) + '</h2>';
  }
  function rodape(){ return '<p class="twpa-status" role="status" aria-live="polite"></p><div class="btns"><button type="button" class="btn alt" data-twpa="abrir">' + esc(t('voltar')) + '</button><button type="button" class="btn alt" data-twpa-x>' + esc(t('fechar')) + '</button></div>'; }
  function abrir(){
    jogo = null; carregar();
    var f = feitos();
    janela(topo() + '<ul class="twpa-lista">' + TIPOS.map(function(k){
      var ok = f.indexOf(k) >= 0;
      return '<li><button type="button" class="twpa-item' + (ok ? ' ok' : '') + '" data-twpa="' + k + '"><span class="twpa-ic" aria-hidden="true">' + icone(k) + '</span><b>' + esc(t(k)) + '</b><em>' + (ok ? '✓' : '★' + PREMIO) + '</em></button></li>';
    }).join('') + '<li><button type="button" class="twpa-item" data-twpa="colorir"><span class="twpa-ic" aria-hidden="true">' + icone('colorir') + '</span><b>' + esc(t('colorir')) + '</b><em>♡</em></button></li></ul><p class="twk-nota">' + esc(f.length >= 3 ? t('subOk') : t('sub', {f:f.length, p:PREMIO})) + '</p><div class="btns"><button type="button" class="btn alt" data-twpa-x>' + esc(t('fechar')) + '</button></div>');
  }
  function aviso1(tipo){ return feitos().indexOf(tipo) >= 0 ? '<p class="twk-nota">' + esc(t('jaFeito')) + '</p>' : ''; }

  // Pequenas peças do palco, desenhadas localmente; não dependem da fonte de emojis.
  function selo(x,k,cx,cy,s){
    x.save();x.translate(cx,cy);x.scale(s/30,s/30);x.lineWidth=1.6;x.lineJoin='round';x.lineCap='round';x.strokeStyle='#49306e';
    function el(a,b,rx,ry,c){x.fillStyle=c;x.beginPath();x.ellipse(a,b,rx,ry,0,0,Math.PI*2);x.fill();x.stroke();}
    function linha(a,b,c,d){x.beginPath();x.moveTo(a,b);x.lineTo(c,d);x.stroke();}
    function estrela(a,b,r,c){x.fillStyle=c;x.beginPath();for(var i=0;i<10;i++){var t=i*Math.PI/5-Math.PI/2,R=i%2?r*.45:r;x[i?'lineTo':'moveTo'](a+Math.cos(t)*R,b+Math.sin(t)*R);}x.closePath();x.fill();x.stroke();}
    if(k==='estrela'||k==='brilho'||k==='sol'){estrela(0,0,12,k==='sol'?'#ffae58':'#ffd166');if(k==='brilho')estrela(10,-9,4,'#ff9dcc');}
    else if(k==='coracao'||k==='luz'){x.fillStyle=k==='luz'?'#9b70f0':'#ff82bb';x.beginPath();x.moveTo(0,11);x.bezierCurveTo(-23,-2,-10,-20,0,-9);x.bezierCurveTo(10,-20,23,-2,0,11);x.fill();x.stroke();if(k==='luz'){x.fillStyle='#ece0ff';x.fillRect(-2,10,4,8);x.strokeRect(-2,10,4,8);}}
    else if(k==='mic'){x.save();x.rotate(.4);x.fillStyle='#9d7de6';x.fillRect(-3,-1,6,15);x.strokeRect(-3,-1,6,15);el(0,-7,7,8,'#c9ddf6');linha(-5,-7,5,-7);linha(-4,-3,4,-3);x.restore();}
    else if(k==='nota'||k==='duasNotas'){x.lineWidth=3;x.strokeStyle='#8050d0';linha(3,7,3,-12);linha(3,-12,12,-9);el(-2,8,6,4,'#9d7de6');if(k==='duasNotas'){linha(12,-9,12,5);el(8,6,5,4,'#ff8dbd');}}
    else if(k==='flor'){for(var j=0;j<5;j++)el(Math.cos(j*1.26)*7,Math.sin(j*1.26)*7,5,5,'#ffa3ce');el(0,0,4,4,'#ffd166');}
    else if(k==='dango'){x.strokeStyle='#9a6c42';x.lineWidth=3;linha(0,-13,0,15);el(0,8,6,6,'#a8e2ac');el(0,-1,6,6,'#fff4de');el(0,-10,6,6,'#ffafcd');}
    else if(k==='laco'){x.fillStyle='#ff8cba';x.beginPath();x.moveTo(0,0);x.lineTo(-12,-9);x.quadraticCurveTo(-17,0,-12,9);x.closePath();x.fill();x.stroke();x.beginPath();x.moveTo(0,0);x.lineTo(12,-9);x.quadraticCurveTo(17,0,12,9);x.closePath();x.fill();x.stroke();el(0,0,4,5,'#c799f4');}
    else if(k==='lua'){x.fillStyle='#ffe5a3';x.beginPath();x.moveTo(6,-13);x.bezierCurveTo(-18,-16,-18,15,6,13);x.bezierCurveTo(-4,7,-4,-7,6,-13);x.fill();x.stroke();}
    else if(k==='folha'){x.fillStyle='#b6eb8a';x.beginPath();x.moveTo(-10,11);x.quadraticCurveTo(-15,-13,13,-12);x.quadraticCurveTo(15,12,-10,11);x.fill();x.stroke();linha(-10,11,8,-7);}
    else if(k==='disco'){el(0,0,13,13,'#9da5f5');el(0,0,6,6,'#f5b4d8');el(0,0,2,2,'#fff');linha(-9,-3,-3,-9);}
    else if(k==='morango'){x.fillStyle='#ff7c9e';x.beginPath();x.moveTo(-11,-7);x.quadraticCurveTo(-16,2,0,14);x.quadraticCurveTo(16,2,11,-7);x.closePath();x.fill();x.stroke();x.fillStyle='#a3df9c';x.beginPath();x.moveTo(-12,-8);x.lineTo(-3,-13);x.lineTo(0,-9);x.lineTo(8,-14);x.lineTo(11,-7);x.closePath();x.fill();x.stroke();x.fillStyle='#fff1ae';[-5,1,6].forEach(function(a){x.fillRect(a,-1,1.5,3);});}
    else if(k==='bolo'){x.fillStyle='#ba97ec';x.fillRect(-9,-1,18,14);x.strokeRect(-9,-1,18,14);el(0,-3,12,7,'#fff2fa');el(0,-10,3,3,'#ff83ac');}
    else if(k==='gato'){x.fillStyle='#b79aef';x.beginPath();x.moveTo(-11,5);x.lineTo(-12,-13);x.lineTo(-4,-7);x.quadraticCurveTo(0,-10,4,-7);x.lineTo(12,-13);x.lineTo(11,5);x.quadraticCurveTo(0,17,-11,5);x.fill();x.stroke();el(-5,0,1.2,2,'#38265e');el(5,0,1.2,2,'#38265e');x.strokeStyle='#38265e';linha(-2,5,0,7);linha(0,7,2,5);}
    x.restore();
  }
  function icone(k){
    var p={caca:'<rect x="5" y="5" width="22" height="22" rx="5"/><path d="M10 11h3m6 0h3M10 17h12m-12 6h3m6 0h3"/>',dif:'<circle cx="13" cy="13" r="8"/><path d="m19 19 8 8M10 13h6m-3-3v6"/>',lab:'<path d="M5 12V5h22v22H5v-9h8V11h7v10h-7"/>',colorir:'<path d="m7 25 2-8L22 4l6 6-13 13-8 2Zm3-8 5 5M19 7l6 6"/>'};
    return '<svg class="twpa-icone" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round">'+(p[k]||p.caca)+'</svg>';
  }

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
      var p = C.palavras.filter(function(q){ return !q.ok && (q.w === s || q.w === inv) && (q.cel[0] === a && q.cel[q.cel.length-1] === i || q.cel[0] === i && q.cel[q.cel.length-1] === a); })[0];
      if(!p){ som(330); return pintar(i); }
      p.ok = true; cel.forEach(function(x){ achados[x] = 1; }); som(1175, .08);
      pintar(i); efeito(ov.querySelector('.twpa-grade'),'twpa-acerto');
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
  var COISAS = ['estrela','coracao','nota','flor','mic','dango','laco','brilho','lua','luz','folha','disco','morango','duasNotas','sol','bolo'];
  function montarDif(){
    var r = sorteio(hoje() + ':dif'), W = 320, H = 170, obj = [];
    var lugares=Array.from({length:15},function(_,i){return i;});
    while(obj.length<13){var cel=lugares.splice(Math.floor(r()*lugares.length),1)[0];obj.push({e:COISAS[Math.floor(r()*COISAS.length)],x:32+(cel%5)*64,y:29+Math.floor(cel/5)*49,s:22});}
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
    // Prateleiras do camarim: cada peça tem um lugar estável e uma área de toque separada.
    x.fillStyle='rgba(255,255,255,.42)';x.fillRect(8,5,D.W-16,D.H-31);
    [49,98,147].forEach(function(y){x.fillStyle='#c3a0e4';x.fillRect(10,y,D.W-20,4);x.fillStyle='#eee0ff';x.fillRect(10,y,D.W-20,1);});
    x.textAlign = 'center'; x.textBaseline = 'middle';
    D.obj.forEach(function(o, i){
      var d = b ? D.dif.filter(function(q){ return q.i === i; })[0] : null, e = o.e, s = o.s;
      if(d && d.tipo === 'some') return;
      if(d && d.tipo === 'troca') e = d.e;
      if(d && d.tipo === 'grande') s = Math.round(s * 1.6);
      selo(x,e,o.x,o.y,s);
    });
    D.dif.forEach(function(q){ if(!q.ok) return; x.strokeStyle = '#ff2d8a'; x.lineWidth = 3; x.beginPath(); x.arc(q.x, q.y, q.s * .95, 0, Math.PI * 2); x.stroke(); });
  }
  function jogarDif(){
    var D = montarDif();
    janela(topo('dif') + '<p class="twk-txt">' + esc(t('difDica')) + '</p>' + aviso1('dif') +
      '<div class="twpa-fotos"><figure><figcaption>A</figcaption><canvas data-nitido="0" class="twpa-cv" data-difa="1" aria-hidden="true"></canvas></figure><figure><figcaption>B</figcaption><canvas data-nitido="0" tabindex="0" class="twpa-cv twpa-cv-b" data-difb="1" role="button" aria-label="' + esc(t('difTeclas')) + '"></canvas></figure></div>' + rodape());
    var A = ov.querySelector('[data-difa]'), B = ov.querySelector('[data-difb]');
    function pintar(){ desenharDif(A, D, false); desenharDif(B, D, true); }
    pintar();
    function conferir(px,py,cv){
      var q = D.dif.filter(function(d){ return !d.ok && Math.hypot(d.x - px, d.y - py) < Math.min(24, d.s+2); })[0];
      if(!q){ som(330); cv.classList.remove('twpa-erro'); void cv.offsetWidth; cv.classList.add('twpa-erro'); return; }
      q.ok = true; som(1175, .08); pintar(); efeito(cv,'twpa-acerto');
      var n = D.dif.filter(function(d){ return d.ok; }).length;
      if(n === D.dif.length) concluir('dif'); else status(t('achou', {n:n, t:D.dif.length}));
    }
    // Escolhe o objeto mais próximo; o raio nunca invade a célula vizinha.
    function toque(e){var cv=e.currentTarget,rc=cv.getBoundingClientRect();conferir((e.clientX-rc.left)/rc.width*D.W,(e.clientY-rc.top)/rc.height*D.H,cv);}
    A.addEventListener('pointerup', toque); B.addEventListener('pointerup', toque);
    var cursor=0;
    B.addEventListener('keydown',function(e){
      if(/^Arrow/.test(e.key)){e.preventDefault();cursor=(cursor+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+D.obj.length)%D.obj.length;pintar();var o=D.obj[cursor],x=B.getContext('2d');x.strokeStyle='#4169e1';x.lineWidth=2;x.strokeRect(o.x-27,o.y-22,54,44);status(t('objeto',{n:cursor+1,t:D.obj.length}));}
      else if(e.key==='Enter'||e.key===' '){e.preventDefault();var o=D.obj[cursor];conferir(o.x,o.y,B);}
    });
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
    return {N:N, P:P, eu:0, fim:N * N - 1, passos:0, trilha:[0]};
  }
  function desenharLab(cv, M){
    var T = 32, S = M.N * T + 4, dpr = Math.min(2, window.devicePixelRatio || 1), x = cv.getContext('2d');
    cv.width = S * dpr; cv.height = S * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var fundo=x.createLinearGradient(0,0,S,S);fundo.addColorStop(0,'#fff9fd');fundo.addColorStop(1,'#eee5ff');x.fillStyle=fundo;x.fillRect(0,0,S,S);
    x.strokeStyle='#d3b9ff';x.lineWidth=13;x.lineJoin='round';x.lineCap='round';x.beginPath();
    (M.trilha||[0]).forEach(function(i,j){var a=2+(i%M.N)*T+T/2,b=2+Math.floor(i/M.N)*T+T/2;x[j?'lineTo':'moveTo'](a,b);});x.stroke();
    x.strokeStyle = '#7b3ff0'; x.lineWidth = 3; x.lineCap = 'round'; x.beginPath();
    M.P.forEach(function(w, i){
      var X = 2 + (i % M.N) * T, Y = 2 + Math.floor(i / M.N) * T;
      if(w[0]){ x.moveTo(X, Y); x.lineTo(X + T, Y); } if(w[1]){ x.moveTo(X + T, Y); x.lineTo(X + T, Y + T); }
      if(w[2]){ x.moveTo(X, Y + T); x.lineTo(X + T, Y + T); } if(w[3]){ x.moveTo(X, Y); x.lineTo(X, Y + T); }
    });
    x.stroke();
    x.textAlign = 'center'; x.textBaseline = 'middle';
    var pos = function(i){ return [2 + (i % M.N) * T + T / 2, 2 + Math.floor(i / M.N) * T + T / 2 + 1]; };
    var f = pos(M.fim); selo(x,'mic',f[0],f[1],22); var e = pos(M.eu); selo(x,'gato',e[0],e[1],24);
  }
  function jogarLab(){
    var M = montarLab(), fim = false;
    janela(topo('lab') + '<p class="twk-txt">' + esc(t('labDica')) + '</p>' + aviso1('lab') +
      '<canvas data-nitido="0" class="twpa-cv twpa-lab" role="img" aria-label="' + esc(t('labDica')) + '"></canvas>' +
      '<div class="twpa-setas"><button type="button" class="btn alt" data-twpa-seta="ArrowUp" aria-label="' + esc(t('cima')) + '" data-twpa-foco>▲</button><span><button type="button" class="btn alt" data-twpa-seta="ArrowLeft" aria-label="' + esc(t('esq')) + '">◀</button>' +
      '<button type="button" class="btn alt" data-twpa-seta="ArrowDown" aria-label="' + esc(t('baixo')) + '">▼</button><button type="button" class="btn alt" data-twpa-seta="ArrowRight" aria-label="' + esc(t('dir')) + '">▶</button></span></div>' + rodape());
    var cv = ov.querySelector('.twpa-lab'); desenharLab(cv, M);
    function mover(k){
      if(fim) return;
      var d = {ArrowUp:[-1, 0, 0], ArrowRight:[0, 1, 1], ArrowDown:[1, 0, 2], ArrowLeft:[0, -1, 3]}[k]; if(!d) return;
      if(M.P[M.eu][d[2]]){ som(262, .03); efeito(cv,'twpa-erro'); return; }
      M.eu += d[0] * M.N + d[1]; M.passos++; var anterior=M.trilha.indexOf(M.eu);if(anterior>=0)M.trilha=M.trilha.slice(0,anterior+1);else M.trilha.push(M.eu); som(660, .025); desenharLab(cv, M);
      if(M.eu === M.fim){ fim = true; efeito(cv,'twpa-acerto'); concluir('lab'); }
    }
    var ini = null;
    cv.addEventListener('pointerdown', function(e){ ini = [e.clientX, e.clientY]; });
    cv.addEventListener('pointercancel', function(){ini=null;});
    cv.addEventListener('pointerup', function(e){ if(!ini) return; var dx = e.clientX - ini[0], dy = e.clientY - ini[1]; ini = null;
      if(Math.max(Math.abs(dx), Math.abs(dy)) < 18) return; mover(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp')); });
    jogo = {tipo:'lab', tecla:mover};
  }

  // ---------- colorir o seu Idol (livre, sem estrelas) ----------
  // As mesmas peças do avatar viram áreas brancas com linhas vetoriais. Um mapa de áreas separado recebe
  // os toques; a cor não depende de um contorno em pixels estar fechado. O original permanece intacto.
  var PALETA = ['#7b3ff0', '#9b30d9', '#4169e1', '#ff6fb5', '#b6ff3b', '#ffd166', '#ff8c42', '#f5d0b5', '#c68642', '#8d5524', '#1c1c30', '#ffffff'];
  // As áreas vêm das formas fechadas do próprio drawChar, sem detectar bordas em pixels.
  function criarPintura(av){
    if(typeof drawChar !== 'function' || typeof perfChar !== 'function') return null;
    var S=720, H=800, cv=document.createElement('canvas'), mapa=document.createElement('canvas');
    cv.width=mapa.width=S;cv.height=mapa.height=H;
    var x=cv.getContext('2d'), m=mapa.getContext('2d',{willReadFrequently:true}), cores={}, historico=[], ids=[], n=0, bounds=null;
    var INK='#38265e', c=perfChar(av), sc=12.3;
    function limite(a,b){if(!bounds)bounds=[a,b,a,b];else{bounds[0]=Math.min(bounds[0],a);bounds[1]=Math.min(bounds[1],b);bounds[2]=Math.max(bounds[2],a);bounds[3]=Math.max(bounds[3],b);}}
    function escuro(cor){return typeof cor==='string' && /^#[0-9a-f]{6}$/i.test(cor) && Math.max(parseInt(cor.slice(1,3),16),parseInt(cor.slice(3,5),16),parseInt(cor.slice(5,7),16))<100;}
    function area(fn,args,box){
      if(x.globalAlpha<.5)return;
      var id=++n, pequeno=box && box[2]-box[0]<5 && box[3]-box[1]<5, detalhe=pequeno&&escuro(x.fillStyle);
      if(!detalhe)ids.push(id);
      x.save();m.save();
      x.globalAlpha=m.globalAlpha=1;x.shadowBlur=m.shadowBlur=0;
      x.fillStyle=detalhe?INK:(cores[id]||'#ffffff');m.fillStyle='rgb('+(id&255)+','+((id>>8)&255)+','+((id>>16)&255)+')';
      x[fn].apply(x,args);m[fn].apply(m,args);
      if(!detalhe){x.strokeStyle=INK;x.lineWidth=.32;x.lineJoin='round';x.lineCap='round';if(fn==='fillRect')x.strokeRect.apply(x,args);else x.stroke();}
      x.restore();m.restore();
    }
    var proxy=new Proxy(x,{
      set:function(obj,k,v){obj[k]=v;if(k in m && typeof m[k]!=='function')try{m[k]=v;}catch(e){}return true;},
      get:function(obj,k){
        if(k==='fill')return function(){area('fill',arguments,bounds);};
        if(k==='fillRect')return function(a,b,w,h){area('fillRect',[a,b,w,h],[a,b,a+w,b+h]);};
        if(k==='stroke')return function(){if(obj.globalAlpha<.5)return;obj.save();obj.globalAlpha=1;obj.shadowBlur=0;obj.strokeStyle=INK;obj.lineWidth=Math.min(obj.lineWidth,.65);obj.stroke.apply(obj,arguments);obj.restore();};
        var v=obj[k];if(typeof v!=='function')return v;
        return function(){
          var a=arguments;
          if(k==='beginPath')bounds=null;
          else if(k==='arc'){limite(a[0]-a[2],a[1]-a[2]);limite(a[0]+a[2],a[1]+a[2]);}
          else if(k==='ellipse'){limite(a[0]-a[2],a[1]-a[3]);limite(a[0]+a[2],a[1]+a[3]);}
          else if(k==='rect'||k==='roundRect'){limite(a[0],a[1]);limite(a[0]+a[2],a[1]+a[3]);}
          else if(/^(moveTo|lineTo|quadraticCurveTo|bezierCurveTo)$/.test(k))for(var i=0;i<a.length;i+=2)limite(a[i],a[i+1]);
          // Gradientes só são consultados pelo renderer: a área final usa cor lisa.
          if(typeof m[k]==='function' && !/^create|get|measure|isPoint|to/.test(k))m[k].apply(m,a);
          return v.apply(obj,a);
        };
      }
    });
    function render(){
      x.setTransform(1,0,0,1,0,0);m.setTransform(1,0,0,1,0,0);x.clearRect(0,0,S,H);m.clearRect(0,0,S,H);
      x.fillStyle='#fff';x.fillRect(0,0,S,H);n=0;ids=[];
      var antes={g:g,state:state,pw:pw,dpw:dpw,rankI:rankI,sash:sash,accSel:accSel,frame:frame,charPose:charPose,antena:perfAntena,portrait:perfCharPortrait};
      try{
        g=proxy;state='play';pw=null;dpw=null;rankI=0;sash=false;accSel=typeof av.a==='string'?av.a:'';frame=0;charPose='';perfCharPortrait=true;
        proxy.save();proxy.translate(S/2-15*sc,150);proxy.scale(sc,sc);drawChar(c,0,0,0,[0,1,2,3,4,5,6].indexOf(+av.expr)>=0?+av.expr:2,false);proxy.restore();
      }finally{g=antes.g;state=antes.state;pw=antes.pw;dpw=antes.dpw;rankI=antes.rankI;sash=antes.sash;accSel=antes.accSel;frame=antes.frame;charPose=antes.charPose;perfAntena=antes.antena;perfCharPortrait=antes.portrait;}
    }
    function guardar(){historico.push(Object.assign({},cores));if(historico.length>30)historico.shift();}
    function pintar(id,cor){if(ids.indexOf(id)<0||cores[id]===cor)return false;guardar();cores[id]=cor;render();return true;}
    try{render();}catch(e){return null;}
    return {canvas:cv,areas:function(){return ids.slice();},pintar:pintar,
      tocar:function(px,py,cor){if(px<0||py<0||px>=S||py>=H)return false;var d=m.getImageData(px,py,1,1).data;return d[3]===255&&pintar(d[0]+d[1]*256+d[2]*65536,cor);},
      limpar:function(){guardar();cores={};render();},desfazer:function(){if(!historico.length)return false;cores=historico.pop();render();return true;},podeDesfazer:function(){return historico.length>0;}};
  }
  function jogarColorir(){
    var av=typeof hubAv==='function'?JSON.parse(JSON.stringify(hubAv()||{})):null, P=av&&criarPintura(av);
    if(!P){janela(topo('colorir')+'<p class="twk-txt">'+esc(t('semIdol'))+'</p>'+rodape());return;}
    var cor=PALETA[3], selecionada=0;
    janela(topo('colorir').replace('🧩','🖍️')+'<p class="twk-txt">'+esc(t('colorirDica'))+'</p>'+
      '<canvas data-nitido="0" class="twpa-cv twpa-colorir" width="720" height="800" tabindex="0" role="button" aria-label="'+esc(t('colorirTeclas'))+'"></canvas>'+
      '<div class="twpa-paleta" role="group" aria-label="'+esc(t('cores'))+'">'+PALETA.map(function(c,i){return '<button type="button" class="twpa-cor" data-twpa-cor="'+c+'" style="background:'+c+'" aria-label="'+esc(t('corN',{n:i+1}))+'" aria-pressed="'+(c===cor)+'"'+(i===3?' data-twpa-foco':'')+'></button>';}).join('')+'</div>'+
      '<div class="btns twpa-ferramentas"><button type="button" class="btn alt" data-twpa-desfazer disabled>'+esc(t('desfazer'))+'</button><button type="button" class="btn alt" data-twpa-limpar>'+esc(t('limpar'))+'</button><button type="button" class="btn" data-twpa-salvar>'+esc(t('salvar'))+'</button></div>'+rodape());
    var cv=ov.querySelector('.twpa-colorir'), x=cv.getContext('2d');
    function mostrar(){x.clearRect(0,0,720,800);x.drawImage(P.canvas,0,0);ov.querySelector('[data-twpa-desfazer]').disabled=!P.podeDesfazer();}
    function pintou(ok){if(ok){mostrar();som(1047,.04);efeito(cv,'twpa-acerto');status(t('pintou'));}}
    mostrar();
    var inicio=null;
    cv.addEventListener('pointerdown',function(e){inicio=[e.clientX,e.clientY];});
    cv.addEventListener('pointercancel',function(){inicio=null;});
    cv.addEventListener('pointerup',function(e){if(!inicio||Math.hypot(e.clientX-inicio[0],e.clientY-inicio[1])>10){inicio=null;return;}inicio=null;var r=cv.getBoundingClientRect();pintou(P.tocar(Math.floor((e.clientX-r.left)/r.width*720),Math.floor((e.clientY-r.top)/r.height*800),cor));});
    cv.addEventListener('keydown',function(e){var ids=P.areas();if(!ids.length)return;if(/^Arrow/.test(e.key)){e.preventDefault();e.stopPropagation();selecionada=(selecionada+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+ids.length)%ids.length;status(t('parte',{n:selecionada+1,t:ids.length}));}else if(e.key==='Enter'||e.key===' '){e.preventDefault();pintou(P.pintar(ids[selecionada],cor));}});
    jogo={tipo:'colorir',cor:function(c,bt){cor=c;ov.querySelectorAll('[data-twpa-cor]').forEach(function(z){z.setAttribute('aria-pressed',String(z===bt));});},
      limpar:function(){P.limpar();mostrar();},desfazer:function(){P.desfazer();mostrar();},
      salvar:function(){var a=document.createElement('a');a.href=window.twMarcaPng?twMarcaPng(P.canvas):P.canvas.toDataURL('image/png');a.download='tsulipa-colorir.png';document.body.appendChild(a);a.click();a.remove();}};
  }

  // ---------- cliques ----------
  document.addEventListener('click', function(e){
    var el = e.target && e.target.closest ? e.target : null; if(!el) return;
    var pc = el.closest('[data-pc]'); if(pc && jogo && jogo.tocar){ jogo.tocar(+pc.getAttribute('data-pc')); return; }
    var sa = el.closest('[data-twpa-seta]'); if(sa && jogo && jogo.tecla){ jogo.tecla(sa.getAttribute('data-twpa-seta')); return; }
    if(el.closest('[data-twpa-desfazer]') && jogo && jogo.desfazer){ jogo.desfazer(); return; }
    var cr = el.closest('[data-twpa-cor]'); if(cr && jogo && jogo.cor){ jogo.cor(cr.getAttribute('data-twpa-cor'), cr); return; }
    if(el.closest('[data-twpa-limpar]') && jogo && jogo.limpar){ jogo.limpar(); return; }
    if(el.closest('[data-twpa-salvar]') && jogo && jogo.salvar){ jogo.salvar(); return; }
    var b = el.closest('[data-twpa]'); if(!b) return;
    var k = b.getAttribute('data-twpa');
    if(k === 'abrir') abrir(); else if(k === 'caca') jogarCaca(); else if(k === 'dif') jogarDif(); else if(k === 'lab') jogarLab(); else if(k === 'colorir') jogarColorir();
  });

  function contaMudou(){ fechar(); feitosSrv = null; feitosDia = ''; carregar(); redesenhar(); }
  window.TW_PASSA = {t:t, feitos:feitos, abrir:abrir, contaMudou:contaMudou, _montarCaca:montarCaca, _montarLab:montarLab, _montarDif:montarDif};
  if(logado()) carregar();
})();

