/* TsuLiPa⭐World · mais pessoal (20/11/2026)
   • Retrospectiva do mês (retro_mes): cartão 1080×1350 desenhado aqui, pronto para salvar e postar (com o selo do site).
   • Vitrine do perfil (minha_vitrine / salvar_vitrine / perfil_publico.vitrine): card favorito, insígnia de destaque e
     música do coração, mostrados logo abaixo do topo do Perfil.
   • Caixa de recados para o TsuLiPa (recado_tsulipa_enviar): até 3 por dia; só a moderação lê.
   • Email mensal opcional (email_mensal): liga/desliga na janela da retrospectiva. O envio é da Edge Function email-mensal.
   Nada aqui muda estrelas. */
(function(){
  'use strict';
  var TX = {
    retro:{pt:'Meu mês no TsuLiPa⭐World',en:'My month in TsuLiPa⭐World',es:'Mi mes en TsuLiPa⭐World',id:'Bulanku di TsuLiPa⭐World',th:'เดือนของฉันใน TsuLiPa⭐World',ja:'TsuLiPa⭐Worldでの今月'},
    retroItem:{pt:'Sua retrospectiva de {m}',en:'Your {m} recap',es:'Tu resumen de {m}',id:'Rekap {m} kamu',th:'สรุปเดือน{m}ของคุณ',ja:'{m}のふりかえり'},
    retroSub:{pt:'Corridas, músicas, cards e o Idol que mais subiu ao palco com você.',en:'Runs, songs, cards and the Idol who joined you on stage the most.',es:'Carreras, canciones, cartas y el Idol que más subió al escenario contigo.',id:'Lari, lagu, kartu, dan Idol yang paling sering tampil bersamamu.',th:'การวิ่ง เพลง การ์ด และไอดอลที่ขึ้นเวทีกับคุณมากที่สุด',ja:'ラン、歌、カード、いちばん一緒にステージに立ったアイドル。'},
    ver:{pt:'Ver',en:'View',es:'Ver',id:'Lihat',th:'ดู',ja:'見る'},
    salvar:{pt:'Salvar imagem',en:'Save image',es:'Guardar imagen',id:'Simpan gambar',th:'บันทึกรูป',ja:'画像を保存'},
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'閉じる'},
    email:{pt:'Quero receber minha retrospectiva por email todo mês',en:'Email me my recap every month',es:'Quiero recibir mi resumen por email cada mes',id:'Kirim rekap ke emailku tiap bulan',th:'ส่งสรุปให้ทางอีเมลทุกเดือน',ja:'毎月ふりかえりをメールで受け取る'},
    emailNota:{pt:'Vai para o email da sua conta Google. Dá para desligar quando quiser.',en:'Sent to your Google account email. Turn it off anytime.',es:'Llega al email de tu cuenta Google. Puedes desactivarlo cuando quieras.',id:'Dikirim ke email akun Google-mu. Bisa dimatikan kapan saja.',th:'ส่งไปที่อีเมลบัญชี Google ปิดได้ทุกเมื่อ',ja:'Googleアカウントのメールに届きます。いつでもオフにできます。'},
    dias:{pt:'dias jogados',en:'days played',es:'días jugados',id:'hari main',th:'วันที่เล่น',ja:'プレイ日数'},
    corridas:{pt:'corridas',en:'runs',es:'carreras',id:'lari',th:'การวิ่ง',ja:'ラン'},
    melhor:{pt:'melhor corrida',en:'best run',es:'mejor carrera',id:'lari terbaik',th:'วิ่งดีที่สุด',ja:'ベストラン'},
    musicas:{pt:'músicas cantadas',en:'songs sung',es:'canciones cantadas',id:'lagu dinyanyikan',th:'เพลงที่ร้อง',ja:'歌った曲'},
    estrelas:{pt:'estrelas ganhas',en:'stars earned',es:'estrellas ganadas',id:'bintang didapat',th:'ดาวที่ได้',ja:'獲得スター'},
    cards:{pt:'cards novos',en:'new cards',es:'cartas nuevas',id:'kartu baru',th:'การ์ดใหม่',ja:'新カード'},
    duo:{pt:'cenas no Moon⭐Duo!',en:'Moon⭐Duo! scenes',es:'escenas en Moon⭐Duo!',id:'adegan Moon⭐Duo!',th:'ฉาก Moon⭐Duo!',ja:'Moon⭐Duo!のシーン'},
    fotos:{pt:'fotos no Studio',en:'Studio photos',es:'fotos en el Studio',id:'foto Studio',th:'รูปใน Studio',ja:'スタジオ写真'},
    sora:{pt:'metros no Sora',en:'meters in Sora',es:'metros en Sora',id:'meter di Sora',th:'เมตรใน Sora',ja:'Soraのメートル'},
    show:{pt:'shows de sábado',en:'Saturday shows',es:'shows del sábado',id:'pertunjukan Sabtu',th:'โชว์วันเสาร์',ja:'土曜ライブ'},
    idol:{pt:'Idol que mais subiu ao palco com você: {n}',en:'Idol who joined you on stage the most: {n}',es:'Idol que más subió al escenario contigo: {n}',id:'Idol yang paling sering tampil bersamamu: {n}',th:'ไอดอลที่ขึ้นเวทีกับคุณมากที่สุด: {n}',ja:'いちばん一緒にステージに立ったアイドル：{n}'},
    obrigado:{pt:'Obrigado por brilhar com a gente! — Tsu, Lirika e Pati',en:'Thanks for shining with us! — Tsu, Lirika & Pati',es:'¡Gracias por brillar con nosotros! — Tsu, Lirika y Pati',id:'Terima kasih sudah bersinar bersama kami! — Tsu, Lirika & Pati',th:'ขอบคุณที่มาเปล่งประกายด้วยกัน! — Tsu, Lirika และ Pati',ja:'一緒に輝いてくれてありがとう！— Tsu・Lirika・Pati'},
    vitrine:{pt:'Vitrine',en:'Showcase',es:'Vitrina',id:'Etalase',th:'ตู้โชว์',ja:'ショーケース'},
    editar:{pt:'Editar vitrine',en:'Edit showcase',es:'Editar vitrina',id:'Ubah etalase',th:'แก้ไขตู้โชว์',ja:'ショーケースを編集'},
    cardFav:{pt:'Card favorito',en:'Favorite card',es:'Carta favorita',id:'Kartu favorit',th:'การ์ดโปรด',ja:'お気に入りカード'},
    insDest:{pt:'Insígnia de destaque',en:'Featured badge',es:'Insignia destacada',id:'Lencana unggulan',th:'เหรียญเด่น',ja:'注目バッジ'},
    musica:{pt:'Música do coração',en:'Song of my heart',es:'Canción del corazón',id:'Lagu favorit',th:'เพลงในใจ',ja:'心の一曲'},
    nenhum:{pt:'— nenhum —',en:'— none —',es:'— ninguno —',id:'— tidak ada —',th:'— ไม่มี —',ja:'— なし —'},
    guardar:{pt:'Guardar',en:'Save',es:'Guardar',id:'Simpan',th:'บันทึก',ja:'保存'},
    vazio:{pt:'Monte sua vitrine: card favorito, insígnia e música do coração.',en:'Build your showcase: favorite card, badge and song.',es:'Arma tu vitrina: carta favorita, insignia y canción.',id:'Susun etalasemu: kartu favorit, lencana, dan lagu.',th:'จัดตู้โชว์: การ์ดโปรด เหรียญ และเพลงในใจ',ja:'ショーケースを作ろう：カード、バッジ、心の一曲。'},
    salvo:{pt:'Vitrine guardada ✓',en:'Showcase saved ✓',es:'Vitrina guardada ✓',id:'Etalase tersimpan ✓',th:'บันทึกตู้โชว์แล้ว ✓',ja:'ショーケースを保存しました ✓'},
    recado:{pt:'Recado para o TsuLiPa',en:'Message to TsuLiPa',es:'Mensaje para TsuLiPa',id:'Pesan untuk TsuLiPa',th:'ข้อความถึง TsuLiPa',ja:'TsuLiPaへのメッセージ'},
    recadoTxt:{pt:'Ideia, carinho, pedido de música ou algo que não funcionou: só o Tsu, a Lirika e o Pati leem.',en:'An idea, some love, a song request or a bug: only Tsu, Lirika and Pati read it.',es:'Una idea, cariño, un pedido de canción o algo que falló: solo Tsu, Lirika y Pati lo leen.',id:'Ide, dukungan, request lagu, atau bug: hanya Tsu, Lirika, dan Pati yang membaca.',th:'ไอเดีย กำลังใจ ขอเพลง หรือสิ่งที่ใช้ไม่ได้: มีแค่ Tsu, Lirika และ Pati ที่อ่าน',ja:'アイデア、応援、リクエスト、不具合など：読むのはTsu・Lirika・Patiだけ。'},
    enviar:{pt:'Enviar',en:'Send',es:'Enviar',id:'Kirim',th:'ส่ง',ja:'送信'},
    enviado:{pt:'Recado enviado! Obrigado 💌',en:'Message sent! Thank you 💌',es:'¡Mensaje enviado! Gracias 💌',id:'Pesan terkirim! Terima kasih 💌',th:'ส่งแล้ว! ขอบคุณ 💌',ja:'送信しました！ありがとう 💌'},
    limite:{pt:'Já foram 3 recados hoje. Amanhã tem mais!',en:'3 messages today already. More tomorrow!',es:'Ya van 3 mensajes hoy. ¡Mañana hay más!',id:'Sudah 3 pesan hari ini. Besok lagi ya!',th:'วันนี้ส่งครบ 3 ข้อความแล้ว พรุ่งนี้ส่งใหม่นะ',ja:'今日は3通送りました。また明日！'},
    login:{pt:'Entre com Google para usar.',en:'Sign in with Google to use this.',es:'Entra con Google para usarlo.',id:'Masuk dengan Google untuk memakai.',th:'เข้าสู่ระบบด้วย Google ก่อนนะ',ja:'Googleでログインしてね。'},
    erro:{pt:'Não deu agora. Tente de novo daqui a pouco.',en:"Couldn't do it now. Try again soon.",es:'No se pudo ahora. Inténtalo en un rato.',id:'Belum bisa sekarang. Coba lagi nanti.',th:'ตอนนี้ยังทำไม่ได้ ลองใหม่นะ',ja:'今はできませんでした。少ししてからもう一度。'}
  };
  function L(){ return typeof LANG === 'string' && TX.retro[LANG] ? LANG : 'pt'; }
  function t(k, v){ var s = (TX[k] && (TX[k][L()] || TX[k].pt)) || k; if(v) Object.keys(v).forEach(function(n){ s = s.split('{' + n + '}').join(v[n]); }); return s; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem_rpc')); }
  function loc(){ return {pt:'pt-BR',en:'en-US',es:'es-ES',id:'id-ID',th:'th-TH',ja:'ja-JP'}[L()]; }
  function nomeMes(iso){ var p = String(iso || '').split('-'); try{ return new Date(Date.UTC(+p[0], +p[1] - 1, 15)).toLocaleDateString(loc(), {month:'long', year:'numeric', timeZone:'UTC'}); }catch(e){ return p[1] + '/' + p[0]; } }
  function num(n){ try{ return (+n || 0).toLocaleString(loc()); }catch(e){ return String(+n || 0); } }
  function aviso(txt){ if(window.TW_CELULAR && TW_CELULAR.toast) return TW_CELULAR.toast(txt);
    var d = document.createElement('div'); d.className = 'tws-aviso'; d.setAttribute('role', 'status'); d.textContent = txt; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 3200); }

  /* ---------- janela simples (mesmo visual das janelas do jogo) ---------- */
  var ov=null, janelaPedido=0, janelaConta=null;
  function fechar(){
    janelaPedido++;
    if(ov){ov.hidden=true;ov.replaceChildren();}
  }
  function novoPedido(){
    janelaConta=contaSessaoAtual();
    return {id:++janelaPedido,conta:janelaConta};
  }
  function vigente(pedido, controle){
    return pedido.id===janelaPedido && pedido.conta() &&
      (!controle || (ov && !ov.hidden && ov.contains(controle)));
  }
  function contaMudou(){
    if(janelaConta && !janelaConta()){fechar();janelaConta=null;}
    if(vitMinha && !vitMinha.conta())vitMinha=null;
  }
  function erro(pedido, controle){
    if(vigente(pedido,controle))aviso(t('erro'));
  }
  function janela(html){
    if(!ov){ ov = document.createElement('div'); ov.className = 'ov twp-ov'; ov.hidden = true; document.body.appendChild(ov);
      ov.addEventListener('click', function(e){ if(e.target === ov || (e.target.closest && e.target.closest('[data-twp="fechar"]'))) fechar(); }); }
    ov.innerHTML = '<div class="panel twp-panel" role="dialog" aria-modal="true">' + html + '</div>'; ov.hidden = false;
    var f = ov.querySelector('button,textarea'); if(f) try{ f.focus(); }catch(e){}
    return ov;
  }

  /* ---------- Retrospectiva ---------- */
  var COR = ['#9b30d9', '#5cc72c', '#4169e1', '#ff6fb5'];
  function rr(x, a, b, w, h, r){ x.beginPath(); if(x.roundRect) x.roundRect(a, b, w, h, r); else x.rect(a, b, w, h); }
  function desenharRetro(d){
    var W = 1080, H = 1350, cv = document.createElement('canvas'); cv.width = W; cv.height = H; var x = cv.getContext('2d');
    var g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#2a1260'); g.addColorStop(.55, '#5a2bc4'); g.addColorStop(1, '#c2367f'); x.fillStyle = g; x.fillRect(0, 0, W, H);
    for(var i = 0; i < 60; i++){ var sx = (i * 197) % W, sy = (i * 331) % H; x.fillStyle = 'rgba(255,255,255,' + (.15 + (i % 5) * .08) + ')'; x.beginPath(); x.arc(sx, sy, 2 + (i % 3), 0, 7); x.fill(); }
    // faixa do trio (as três cores, nessa ordem: Tsu · Lirika · Pati)
    ['#9b30d9', '#5cc72c', '#4169e1'].forEach(function(c, i){ x.fillStyle = c; x.fillRect(i * W / 3, 0, W / 3, 14); });
    x.textAlign = 'center'; x.fillStyle = '#fff';
    x.font = '400 64px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif'; x.fillText(t('retro'), W / 2, 130);
    x.font = '800 40px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#ffe9f4'; x.fillText(nomeMes(d.mes) + ' · ' + (d.nick || ''), W / 2, 196);
    var itens = [['📅', d.dias, 'dias'], ['🏁', d.corridas, 'corridas'], ['🏆', d.melhor, 'melhor'], ['🎤', d.musicas, 'musicas'], ['⭐', d.estrelas, 'estrelas'], ['🃏', d.cards, 'cards'],
                 ['🌙', d.duo, 'duo'], ['📸', d.fotos, 'fotos'], ['☁️', d.sora, 'sora'], ['🎶', d.show, 'show']].filter(function(it){ return (+it[1] || 0) > 0; });
    if(!itens.length) itens = [['📅', d.dias || 0, 'dias']];
    itens = itens.slice(0, 8);
    var cols = 2, tw = 440, th = 180, gx = 40, gy = 30, x0 = (W - (cols * tw + gx)) / 2, y0 = 260;
    itens.forEach(function(it, k){
      var cx = x0 + (k % cols) * (tw + gx), cy = y0 + Math.floor(k / cols) * (th + gy);
      x.fillStyle = 'rgba(255,255,255,.95)'; rr(x, cx, cy, tw, th, 36); x.fill();
      x.fillStyle = COR[k % COR.length]; rr(x, cx, cy, 16, th, 8); x.fill();
      x.textAlign = 'left'; x.font = '64px sans-serif'; x.fillText(it[0], cx + 40, cy + 108);
      x.fillStyle = '#2a1f45'; x.font = '800 72px "M PLUS Rounded 1c",sans-serif'; x.fillText(num(it[1]), cx + 140, cy + 100);
      x.fillStyle = '#6c6488'; var fsz = 30; do { x.font = '700 ' + fsz + 'px "M PLUS Rounded 1c",sans-serif'; fsz -= 2; } while(fsz > 18 && x.measureText(t(it[2])).width > tw - 170); x.fillText(t(it[2]), cx + 142, cy + 144);
    });
    var yIdol = y0 + Math.ceil(itens.length / cols) * (th + gy) + 20;
    x.textAlign = 'center';
    if(d.idol){ x.fillStyle = '#fff3b0'; x.font = '800 38px "M PLUS Rounded 1c",sans-serif'; x.fillText('💖 ' + t('idol', {n:d.idol}), W / 2, yIdol + 30); yIdol += 70; }
    x.fillStyle = '#fff'; x.font = '700 32px "M PLUS Rounded 1c",sans-serif'; x.fillText(t('obrigado'), W / 2, Math.min(H - 110, yIdol + 50));
    return cv;
  }
  function abrirRetro(mes){
    if(!logado()){ aviso(t('login')); return; }
    var pedido=novoPedido();
    rpc('retro_mes', {p_mes:mes || null}).then(function(d){
      if(!vigente(pedido))return;
      if(!d || !d.ok){ aviso(t('erro')); return; }
      var cv = desenharRetro(d), url = window.twMarcaPng ? window.twMarcaPng(cv) : cv.toDataURL('image/png');
      var email=window.TW_EMAIL_MENSAL_DISPONIVEL===true;
      var o = janela('<h2 class="twp-tit twp-sr">' + esc(t('retro')) + '</h2><img class="twp-img" alt="' + esc(t('retroItem', {m:nomeMes(d.mes)})) + '" src="' + url + '">' +
        (email ? '<label class="twp-check"><input type="checkbox" id="twpEmail" disabled> ' + esc(t('email')) + '</label><small class="twp-nota">' + esc(t('emailNota')) + '</small>' : '') +
        '<div class="btns"><a class="btn" id="twpBaixar" download="tsulipa-retrospectiva-' + esc(String(d.mes).slice(0, 7)) + '.png" href="' + url + '">⬇️ ' + esc(t('salvar')) + '</a>' +
        '<button type="button" class="btn alt" data-twp="fechar">' + esc(t('fechar')) + '</button></div>');
      if(!email)return;
      var ck = o.querySelector('#twpEmail');
      rpc('email_mensal').then(function(r){
        if(!vigente(pedido,ck))return;
        if(!r||!r.ok){erro(pedido,ck);return;}
        ck.checked=r.ligado===true;ck.disabled=false;
      }).catch(function(){erro(pedido,ck);});
      ck.onchange=function(){
        if(ck.disabled || !vigente(pedido,ck))return;
        var ligado=ck.checked;
        ck.disabled=true;
        rpc('email_mensal',{p_ligar:ligado}).then(function(r){
          if(!r||!r.ok)throw Error('preferencia');
          if(vigente(pedido,ck)){ck.checked=r.ligado===true;ck.disabled=false;}
        }).catch(function(){
          if(vigente(pedido,ck)){ck.checked=!ligado;ck.disabled=false;erro(pedido,ck);}
        });
      };
    }).catch(function(){erro(pedido);});
  }
  // item no cartão "Esta semana": nos 7 primeiros dias do mês destaca o mês que acabou
  function retroItemHtml(){
    if(!logado()) return '';
    var hoje = new Date(Date.now() - 3 * 36e5), dia = hoje.getUTCDate();
    var ant = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 1, 1)).toISOString().slice(0, 10);
    var mes = dia <= 7 ? ant : hoje.toISOString().slice(0, 8) + '01';
    return '<div class="twc-hj-it tws-it"><span class="twc-hj-ico twc-g-roxo tws-emo" aria-hidden="true">🗓️</span><span class="twc-hj-txt"><b>' + esc(t('retroItem', {m:nomeMes(mes)})) + '</b><small>' + esc(t('retroSub')) + '</small></span>' +
      '<button type="button" class="twc-hj-bt" data-twp="retro" data-mes="' + mes + '">' + esc(t('ver')) + '</button></div>';
  }

  /* ---------- Vitrine do perfil ---------- */
  function insInfo(k){
    var base = String(k || '').split(':')[0], L2 = typeof PERF_INS !== 'undefined' ? PERF_INS : [];
    for(var i = 0; i < L2.length; i++) if(L2[i][0] === base) return [L2[i][1], (typeof tr === 'function' ? tr(L2[i][2]) : L2[i][2])];
    return ['✨', base];
  }
  function vitrineHtml(v, meu){
    v = v || {};
    if(!v.card && !v.insignia && !v.musica) return meu ? '<section class="twp-vitrine twp-vazia"><p>' + esc(t('vazio')) + '</p><button type="button" class="btn alt" data-twp="vitrine-editar">✏️ ' + esc(t('editar')) + '</button></section>' : '';
    var ins = v.insignia ? insInfo(v.insignia) : null;
    return '<section class="twp-vitrine" aria-label="' + esc(t('vitrine')) + '"><h3>✨ ' + esc(t('vitrine')) + '</h3><div class="twp-vit-grade">' +
      (v.card ? '<figure class="twp-vit-card"><canvas id="twpVitCard" width="180" height="252"></canvas><figcaption>' + esc(t('cardFav')) + '</figcaption></figure>' : '') +
      '<div class="twp-vit-lado">' +
      (ins ? '<p class="twp-vit-ins"><span aria-hidden="true">' + ins[0] + '</span><b>' + esc(ins[1]) + '</b><small>' + esc(t('insDest')) + '</small></p>' : '') +
      (v.musica ? '<p class="twp-vit-mus"><span aria-hidden="true">🎵</span><b translate="no">' + esc(v.musica) + '</b><small>' + esc(t('musica')) + '</small></p>' : '') +
      '</div></div>' + (meu ? '<button type="button" class="btn alt twp-vit-ed" data-twp="vitrine-editar">✏️ ' + esc(t('editar')) + '</button>' : '') + '</section>';
  }
  var vitMinha = null;
  function vitrineMontar(d, meu){   // chamado pelo Perfil depois de montar o topo
    var corpo = document.getElementById('perfCorpo'); if(!corpo) return;
    var hero=corpo.querySelector('.perfhero'), conta=contaSessaoAtual();
    if(!hero)return;
    var antigo = corpo.querySelector('.twp-vitrine'); if(antigo) antigo.remove();
    function por(v, card){
      if(!conta()||!hero.isConnected||corpo.querySelector('.perfhero')!==hero)return;
      var anterior=corpo.querySelector('.twp-vitrine');if(anterior)anterior.remove();
      var w = document.createElement('div'); w.innerHTML = vitrineHtml(v, meu); var sec = w.firstElementChild; if(!sec) return;
      hero.parentNode.insertBefore(sec, hero.nextSibling);
      var cv = sec.querySelector('#twpVitCard');
      if(cv && card && typeof gachaCardDesenhar === 'function' && typeof cardsDados === 'function') try{ gachaCardDesenhar(cv, cardsDados({card:card})); }catch(e){}
    }
    if(!meu){ por(d && d.vitrine, d && d.vitrine_card); return; }
    if(!logado())return;
    por({},null);
    rpc('minha_vitrine').then(function(r){
      if(!conta()||!hero.isConnected||corpo.querySelector('.perfhero')!==hero||!r||r.ok===false)return;
      vitMinha={conta:conta,dados:r};
      por(r.vitrine,r.vitrine_card);
    }).catch(function(){});
  }
  function vitrineEditar(){
    if(!logado()){ aviso(t('login')); return; }
    var pedido=novoPedido(), hero=document.querySelector('#perfCorpo .perfhero');
    Promise.all([rpc('album_cards'), vitMinha && vitMinha.conta() ? Promise.resolve(vitMinha.dados) : rpc('minha_vitrine')]).then(function(r){
      if(!vigente(pedido) || (hero && (!hero.isConnected || document.getElementById('perfOv').hidden)))return;
      if(!r[1] || r[1].ok===false || !Array.isArray(r[0])){erro(pedido);return;}
      var cards = (Array.isArray(r[0]) ? r[0] : []).map(function(c){ return c && c.card && c.card.nick; }).filter(Boolean);
      var mv = r[1] || {}, v = mv.vitrine || {}, ins = Array.isArray(mv.insignias) ? mv.insignias : [];
      function opts(L, atual, rot){ return '<option value="">' + esc(t('nenhum')) + '</option>' + L.map(function(k){ return '<option value="' + esc(k) + '"' + (k === atual ? ' selected' : '') + '>' + esc(rot ? rot(k) : k) + '</option>'; }).join(''); }
      var o = janela('<h2 class="twp-tit">✏️ ' + esc(t('editar')) + '</h2>' +
        '<label class="twp-campo">' + esc(t('cardFav')) + '<select id="twpVCard">' + opts(cards, v.card) + '</select></label>' +
        '<label class="twp-campo">' + esc(t('insDest')) + '<select id="twpVIns">' + opts(ins, v.insignia, function(k){ var i = insInfo(k); return i[0] + ' ' + i[1]; }) + '</select></label>' +
        '<label class="twp-campo">' + esc(t('musica')) + '<input id="twpVMus" maxlength="60" value="' + esc(v.musica || '') + '" placeholder="Zipper"></label>' +
        '<div class="btns"><button type="button" class="btn" id="twpVOk">' + esc(t('guardar')) + '</button><button type="button" class="btn alt" data-twp="fechar">' + esc(t('fechar')) + '</button></div>');
      o.querySelector('#twpVOk').onclick = function(){
        var b=this;if(!vigente(pedido,b)||b.disabled)return;
        b.disabled=true;
        rpc('salvar_vitrine', {p_card:o.querySelector('#twpVCard').value, p_insignia:o.querySelector('#twpVIns').value, p_musica:o.querySelector('#twpVMus').value.trim()}).then(function(res){
          if(pedido.conta()&&res&&res.ok)vitMinha=null;
          if(!vigente(pedido,b))return;
          if(res && res.ok){ aviso(t('salvo')); fechar(); if(typeof perfAbrir === 'function' && typeof perfMeu !== 'undefined' && perfMeu) try{ perfAbrir('', true); }catch(e){} }
          else { b.disabled = false; aviso(t('erro')); }
        }).catch(function(){ if(vigente(pedido,b)){b.disabled=false;erro(pedido,b);} });
      };
    }).catch(function(){erro(pedido);});
  }

  /* ---------- Caixa de recados para o TsuLiPa ---------- */
  function recadoAbrir(){
    if(!logado()){ aviso(t('login')); return; }
    var pedido=novoPedido();
    var o = janela('<h2 class="twp-tit">💌 ' + esc(t('recado')) + '</h2><p class="twp-nota">' + esc(t('recadoTxt')) + '</p>' +
      '<textarea id="twpRecado" maxlength="500" rows="5"></textarea><small class="twp-cont" id="twpCont">0/500</small>' +
      '<div class="btns"><button type="button" class="btn" id="twpEnviar">' + esc(t('enviar')) + '</button><button type="button" class="btn alt" data-twp="fechar">' + esc(t('fechar')) + '</button></div>');
    var ta = o.querySelector('#twpRecado'), ct = o.querySelector('#twpCont');
    ta.oninput = function(){ ct.textContent = ta.value.length + '/500'; };
    o.querySelector('#twpEnviar').onclick = function(){
      var b = this, txt = ta.value.trim(); if(txt.length < 2 || b.disabled || !vigente(pedido,b)) return; b.disabled = true;
      rpc('recado_tsulipa_enviar', {p_texto:txt}).then(function(r){
        if(!vigente(pedido,b))return;
        if(r && r.ok){ fechar(); aviso(t('enviado')); }
        else { b.disabled = false; aviso(t(r && r.erro === 'limite' ? 'limite' : 'erro')); }
      }).catch(function(){ if(vigente(pedido,b)){b.disabled=false;erro(pedido,b);} });
    };
  }

  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-twp]'); if(!b) return;
    var a = b.getAttribute('data-twp'); if(a === 'fechar') return;
    e.preventDefault(); e.stopPropagation();
    if(a === 'retro') abrirRetro(b.getAttribute('data-mes'));
    else if(a === 'vitrine-editar') vitrineEditar();
    else if(a === 'recado') recadoAbrir();
  }, true);

  window.TW_PESSOAL = {contaMudou:contaMudou,retroItemHtml:retroItemHtml, abrirRetro:abrirRetro, vitrineMontar:vitrineMontar, recadoAbrir:recadoAbrir, t:t, desenharRetro:desenharRetro};
})();
