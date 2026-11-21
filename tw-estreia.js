/* TsuLiPa⭐World · estreia e economia (21/11/2026 · PR das melhorias, parte 3).
   - Kit de estreia: uma vez por conta, ★100 + 1 item grátis à escolha (kit_estreia_estado / kit_estreia_resgatar).
   - Trilha da primeira semana (contas com até 14 dias): 5 passos de ★20 e ★40 no fim. Os passos são conferidos e
     pagos no servidor (trilha_estado / trilha_resgatar); aqui só se pede o prêmio do que já foi feito e se avisa.
   - Primeiro resultado do dia no Sora, Café, Handshake e Battle: ★15 cada (bonus_jogos_dia), conferido de tempos
     em tempos enquanto o site está aberto.
   - Promoção da semana: window.TW_PROMO (promo_semana) — a lojinha mostra o preço com desconto.
   - Loja mostrando o caminho: lembra as roupas que a pessoa provou e avisa quando as estrelas já dão para comprar.
   Atalho no Menu: [data-twe="trilha"]. */
(function(){
  'use strict';
  var TXT = {
    kitTit:{pt:'Presente de estreia',en:'Debut gift',es:'Regalo de estreno',id:'Hadiah debut',th:'ของขวัญเดบิวต์',ja:'デビューのプレゼント'},
    kitTxt:{pt:'Boas-vindas ao TsuLiPa⭐World! Você ganha ★{p} e escolhe um item para o seu Idol.',en:'Welcome to TsuLiPa⭐World! You get ★{p} and pick an item for your Idol.',es:'¡Bienvenida a TsuLiPa⭐World! Ganas ★{p} y eliges un ítem para tu Idol.',id:'Selamat datang di TsuLiPa⭐World! Kamu dapat ★{p} dan memilih satu item untuk Idol-mu.',th:'ยินดีต้อนรับสู่ TsuLiPa⭐World! รับ ★{p} และเลือกไอเทมหนึ่งชิ้นให้ไอดอลของคุณ',ja:'TsuLiPa⭐Worldへようこそ！★{p}と、Idolのアイテムを1つプレゼント。'},
    kitOk:{pt:'+★{p} e {i} já são seus!',en:'+★{p} and {i} are yours!',es:'¡+★{p} y {i} ya son tuyos!',id:'+★{p} dan {i} sudah jadi milikmu!',th:'+★{p} และ {i} เป็นของคุณแล้ว!',ja:'+★{p}と{i}をゲット！'},
    depois:{pt:'Escolher depois',en:'Choose later',es:'Elegir después',id:'Pilih nanti',th:'เลือกทีหลัง',ja:'あとで選ぶ'},
    trilha:{pt:'Primeira semana',en:'First week',es:'Primera semana',id:'Minggu pertama',th:'สัปดาห์แรก',ja:'最初の1週間'},
    trilhaTxt:{pt:'Cinco primeiros passos no TsuLiPa⭐World. Cada um vale ★{p}, e completar todos dá mais ★{f} e a insígnia Primeira semana.',en:'Your first five steps in TsuLiPa⭐World. Each is worth ★{p}; finishing all gives ★{f} more and the First week badge.',es:'Cinco primeros pasos en TsuLiPa⭐World. Cada uno vale ★{p}, y completarlos todos da ★{f} más y la insignia Primera semana.',id:'Lima langkah pertama di TsuLiPa⭐World. Masing-masing ★{p}; menyelesaikan semua memberi ★{f} lagi dan lencana Minggu pertama.',th:'ห้าก้าวแรกใน TsuLiPa⭐World แต่ละก้าวได้ ★{p} ทำครบทั้งหมดได้เพิ่ม ★{f} และเหรียญสัปดาห์แรก',ja:'TsuLiPa⭐Worldの最初の5ステップ。1つごとに★{p}、全部クリアで★{f}と「最初の1週間」バッジ！'},
    ate:{pt:'Até {d}',en:'Until {d}',es:'Hasta {d}',id:'Sampai {d}',th:'ถึง {d}',ja:'{d}まで'},
    p_corrida:{pt:'Faça uma corrida no Center⭐Run!',en:'Do a Center⭐Run! run',es:'Haz una carrera en Center⭐Run!',id:'Lari sekali di Center⭐Run!',th:'วิ่ง Center⭐Run! หนึ่งรอบ',ja:'Center⭐Run!を1回走る'},
    p_gacha:{pt:'Gire o Star⭐Gacha!',en:'Spin the Star⭐Gacha!',es:'Gira el Star⭐Gacha!',id:'Putar Star⭐Gacha!',th:'หมุน Star⭐Gacha!',ja:'Star⭐Gacha!を回す'},
    p_duo:{pt:'Faça uma foto no Moon⭐Duo!',en:'Take a Moon⭐Duo! photo',es:'Haz una foto en Moon⭐Duo!',id:'Ambil foto di Moon⭐Duo!',th:'ถ่ายรูปใน Moon⭐Duo!',ja:'Moon⭐Duo!で写真を撮る'},
    p_compra:{pt:'Compre algo na Zipper⭐Shop!',en:'Buy something at Zipper⭐Shop!',es:'Compra algo en Zipper⭐Shop!',id:'Beli sesuatu di Zipper⭐Shop!',th:'ซื้ออะไรสักอย่างที่ Zipper⭐Shop!',ja:'Zipper⭐Shop!で何か買う'},
    p_missao:{pt:'Complete uma missão do dia',en:'Complete a daily mission',es:'Completa una misión del día',id:'Selesaikan satu misi harian',th:'ทำภารกิจประจำวันหนึ่งอย่าง',ja:'デイリーミッションを1つクリア'},
    passoOk:{pt:'Primeira semana: {s} (+★{p})',en:'First week: {s} (+★{p})',es:'Primera semana: {s} (+★{p})',id:'Minggu pertama: {s} (+★{p})',th:'สัปดาห์แรก: {s} (+★{p})',ja:'最初の1週間：{s}（+★{p}）'},
    trilhaFim:{pt:'Primeira semana completa! +★{p} e a insígnia Primeira semana.',en:'First week complete! +★{p} and the First week badge.',es:'¡Primera semana completa! +★{p} y la insignia Primera semana.',id:'Minggu pertama selesai! +★{p} dan lencana Minggu pertama.',th:'ครบสัปดาห์แรกแล้ว! +★{p} และเหรียญสัปดาห์แรก',ja:'最初の1週間クリア！+★{p}とバッジ！'},
    j_sora:{pt:'Primeiro Sora⭐Jump! do dia',en:'First Sora⭐Jump! of the day',es:'Primer Sora⭐Jump! del día',id:'Sora⭐Jump! pertama hari ini',th:'Sora⭐Jump! แรกของวัน',ja:'今日最初のSora⭐Jump!'},
    j_cafe:{pt:'Primeiro turno do Happy⭐Cafe! do dia',en:'First Happy⭐Cafe! shift of the day',es:'Primer turno de Happy⭐Cafe! del día',id:'Shift Happy⭐Cafe! pertama hari ini',th:'กะแรกของ Happy⭐Cafe! วันนี้',ja:'今日最初のHappy⭐Cafe!'},
    j_hand:{pt:'Primeiro Handshake⭐Event! do dia',en:'First Handshake⭐Event! of the day',es:'Primer Handshake⭐Event! del día',id:'Handshake⭐Event! pertama hari ini',th:'Handshake⭐Event! แรกของวัน',ja:'今日最初のHandshake⭐Event!'},
    j_battle:{pt:'Primeiro Idol⭐Battle! do dia',en:'First Idol⭐Battle! of the day',es:'Primer Idol⭐Battle! del día',id:'Idol⭐Battle! pertama hari ini',th:'Idol⭐Battle! แรกของวัน',ja:'今日最初のIdol⭐Battle!'},
    promo:{pt:'Promoção da semana: {i} de ★{o} por ★{p} até domingo!',en:'Deal of the week: {i}, ★{p} instead of ★{o} until Sunday!',es:'Oferta de la semana: {i} de ★{o} por ★{p} ¡hasta el domingo!',id:'Promo minggu ini: {i} dari ★{o} jadi ★{p} sampai Minggu!',th:'โปรประจำสัปดาห์: {i} จาก ★{o} เหลือ ★{p} ถึงวันอาทิตย์!',ja:'今週のセール：{i}が★{o}→★{p}（日曜まで）！'},
    falta:{pt:'Faltam ★{n} · ~{c} corridas',en:'★{n} to go · ~{c} runs',es:'Faltan ★{n} · ~{c} carreras',id:'Kurang ★{n} · ~{c} lari',th:'ขาด ★{n} · ~{c} รอบ',ja:'あと★{n}・約{c}ラン'},
    falta1:{pt:'Faltam ★{n} · ~1 corrida',en:'★{n} to go · ~1 run',es:'Faltan ★{n} · ~1 carrera',id:'Kurang ★{n} · ~1 lari',th:'ขาด ★{n} · ~1 รอบ',ja:'あと★{n}・約1ラン'},
    podeComprar:{pt:'Você já pode comprar {i}, que provou na Zipper⭐Shop!',en:'You can now buy {i}, which you tried on at Zipper⭐Shop!',es:'¡Ya puedes comprar {i}, que te probaste en Zipper⭐Shop!',id:'Sekarang kamu bisa membeli {i} yang kamu coba di Zipper⭐Shop!',th:'ตอนนี้ซื้อ {i} ที่ลองใส่ใน Zipper⭐Shop! ได้แล้ว!',ja:'Zipper⭐Shop!で試着した{i}が買えるようになりました！'},
    novo:{pt:'Novo',en:'New',es:'Nuevo',id:'Baru',th:'ใหม่',ja:'NEW'},
    seqOk:{pt:'🔥 {n} dias seguidos de missões! +★{p}',en:'🔥 {n}-day mission streak! +★{p}',es:'🔥 ¡{n} días seguidos de misiones! +★{p}',id:'🔥 Misi {n} hari berturut-turut! +★{p}',th:'🔥 ทำภารกิจต่อเนื่อง {n} วัน! +★{p}',ja:'🔥 ミッション{n}日連続！+★{p}'},
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'閉じる'},
    erro:{pt:'Não deu certo agora. Tente de novo daqui a pouco.',en:'That didn\'t work. Please try again soon.',es:'No funcionó. Inténtalo de nuevo en un rato.',id:'Belum berhasil. Coba lagi sebentar lagi.',th:'ยังไม่สำเร็จ ลองใหม่อีกครั้งนะ',ja:'うまくいきませんでした。少ししてからもう一度試してください。'}
  };
  var CORRIDA_MEDIA = 55;   // ★ por corrida nos últimos 30 dias (11.052 em 198 corridas)
  function L(){ var l = typeof LANG === 'string' ? LANG : 'pt'; return TXT.kitTit[l] ? l : 'pt'; }
  function t(k, v){ var s = (TXT[k] && (TXT[k][L()] || TXT[k].pt)) || k; return s.replace(/\{(\w+)\}/g, function(_, n){ return v && v[n] != null ? v[n] : ''; }); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function tr2(s){ return typeof tr === 'function' ? tr(s) : s; }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem conta')); }
  function aviso(txt, ic){ if(window.TW_CELULAR && TW_CELULAR.toast) TW_CELULAR.toast(txt, ic || '🌟'); else if(typeof contaAviso === 'function') contaAviso(txt); }
  function lerLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function gravarLS(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function estrelas(n){ if(typeof n !== 'number' || typeof starT === 'undefined') return; starT = n; gravarLS('brs48cr_st', starT); if(typeof setBest === 'function') setBest(); }
  function conta(){ return logado() ? String(contaJ.id || contaJ.nick || '') : ''; }
  function nomeItem(k){
    var it = typeof lojaItem === 'function' ? lojaItem(k) : null;
    if(it) return it[1] + ' ' + tr2(it[2]);
    if(/^roupa_/.test(k) && typeof PERF_LOJA !== 'undefined') for(var i = 0; i < PERF_LOJA.length; i++) if(PERF_LOJA[i][0] === k.slice(6)) return PERF_LOJA[i][1] + ' ' + tr2(PERF_LOJA[i][2]);
    return k;
  }

  // janela simples (mesmo visual das outras janelas novas)
  var ov = null;
  function fechar(){ if(ov){ ov.hidden = true; ov.replaceChildren(); } }
  window.addEventListener('keydown', function(e){ if(ov && !ov.hidden && e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); fechar(); } }, true);
  function janela(html){
    if(!ov){ ov = document.createElement('div'); ov.className = 'ov twp-ov twk-ov twe-ov'; ov.hidden = true; document.body.appendChild(ov);
      ov.addEventListener('click', function(e){ if(e.target === ov || (e.target.closest && e.target.closest('[data-twe-x]'))) fechar(); }); }
    ov.innerHTML = '<div class="panel twp-panel twk-panel" role="dialog" aria-modal="true" aria-labelledby="tweTit">' + html + '</div>'; ov.hidden = false;
    var b = ov.querySelector('.btn'); if(b) try{ b.focus(); }catch(e){}
  }
  function outraJanelaAberta(){ return !!document.querySelector('.ov:not([hidden]) [aria-modal="true"]'); }

  // ───── Kit de estreia ─────
  var kitVisto = {};
  function kitConferir(forcar){
    if(!logado() || (kitVisto[conta()] && !forcar)) return;
    kitVisto[conta()] = true;
    rpc('kit_estreia_estado').then(function(d){
      if(!d || !d.ok || !d.disponivel || !(d.opcoes || []).length) return;
      if(!forcar && (outraJanelaAberta() || (ov && !ov.hidden))) { setTimeout(function(){ kitVisto[conta()] = false; kitConferir(); }, 20000); return; }
      janela('<h2 class="twp-tit" id="tweTit">🎁 ' + esc(t('kitTit')) + '</h2><p class="twk-txt">' + esc(t('kitTxt', {p:d.estrelas || 100})) + '</p>' +
        '<div class="twe-kit">' + d.opcoes.map(function(k){ return '<button type="button" class="btn alt" data-twe="kit" data-k="' + esc(k) + '">' + esc(nomeItem(k)) + '</button>'; }).join('') + '</div>' +
        '<div class="btns"><button type="button" class="btn alt" data-twe-x>' + esc(t('depois')) + '</button></div>');
    }).catch(function(){ kitVisto[conta()] = false; });
  }
  function kitEscolher(b){
    ov.querySelectorAll('[data-twe="kit"]').forEach(function(x){ x.disabled = true; });
    rpc('kit_estreia_resgatar', {p_item:b.dataset.k}).then(function(r){
      if(r && r.ok){
        estrelas(r.stars);
        if(Array.isArray(r.visuais) && typeof perfDono !== 'undefined'){ try{ perfDono = r.visuais.slice(); }catch(e){} }
        if(typeof perfLojaUI === 'function') try{ perfLojaUI(); }catch(e){}
        if(typeof perfLoja2UI === 'function') try{ perfLoja2UI(); }catch(e){}
        fechar(); aviso(t('kitOk', {p:r.premio || 100, i:nomeItem(r.item)}), '🎁');
        setTimeout(trilhaConferir, 800);
      } else { aviso(t('erro'), '⚠️'); ov.querySelectorAll('[data-twe="kit"]').forEach(function(x){ x.disabled = false; }); }
    }).catch(function(){ aviso(t('erro'), '⚠️'); ov.querySelectorAll('[data-twe="kit"]').forEach(function(x){ x.disabled = false; }); });
  }

  // ───── Trilha da primeira semana ─────
  var trilha = null, trilhaOcupada = false;
  function trilhaConferir(){
    if(!logado() || trilhaOcupada) return;
    trilhaOcupada = true;
    rpc('trilha_estado').then(function(d){
      trilha = d && d.ok ? d : null;
      if(!trilha || !trilha.ativa) return;
      // pede o prêmio de cada passo já feito, um de cada vez
      var fila = (trilha.passos || []).filter(function(p){ return p.feito && !p.resgatado; }).map(function(p){ return p.k; });
      return fila.reduce(function(pr, k){
        return pr.then(function(){ return rpc('trilha_resgatar', {p_passo:k}).then(function(r){
          if(!r || !r.ok) return;
          estrelas(r.stars);
          (trilha.passos || []).forEach(function(p){ if(p.k === k) p.resgatado = true; });
          if(r.fim){ trilha.ativa = false; aviso(t('trilhaFim', {p:r.premio}), '🏅'); }
          else aviso(t('passoOk', {s:t('p_' + k), p:r.premio}), '✅');
        }); });
      }, Promise.resolve());
    }).catch(function(){}).then(function(){ trilhaOcupada = false; });
  }
  function trilhaAbrir(){
    var mostrar = function(){
      if(!trilha){ aviso(t('erro'), '⚠️'); return; }
      var feitos = (trilha.passos || []).filter(function(p){ return p.feito; }).length;
      janela('<h2 class="twp-tit" id="tweTit">🌱 ' + esc(t('trilha')) + ' · ' + feitos + '/5</h2>' +
        '<p class="twk-txt">' + esc(t('trilhaTxt', {p:trilha.premio || 20, f:trilha.final || 40})) + '</p>' +
        (trilha.ate ? '<p class="twk-nota">' + esc(t('ate', {d:new Date(trilha.ate + 'T12:00:00Z').toLocaleDateString(L() === 'pt' ? 'pt-BR' : L(), {day:'2-digit', month:'2-digit'})})) + '</p>' : '') +
        '<ul class="twk-metas">' + (trilha.passos || []).map(function(p){ return '<li class="twk-meta' + (p.feito ? ' ok' : '') + '"><span>' + (p.feito ? '✅' : '⬜') + ' ' + esc(t('p_' + p.k)) + '</span><b>★' + (trilha.premio || 20) + '</b></li>'; }).join('') + '</ul>' +
        '<div class="btns"><button type="button" class="btn alt" data-twe-x>' + esc(t('fechar')) + '</button></div>');
    };
    if(trilha) mostrar(); else rpc('trilha_estado').then(function(d){ trilha = d && d.ok ? d : null; mostrar(); }).catch(function(){ aviso(t('erro'), '⚠️'); });
  }

  // ───── Primeiro resultado do dia nos outros jogos ─────
  var bonusOcupado = false, bonusUltimo = 0;
  function bonusConferir(){
    if(!logado() || bonusOcupado || document.hidden || Date.now() - bonusUltimo < 45000) return;
    bonusOcupado = true; bonusUltimo = Date.now();
    rpc('bonus_jogos_dia').then(function(r){
      if(!r || !r.ok || !(r.pagos || []).length) return;
      estrelas(r.stars);
      r.pagos.forEach(function(j, i){ setTimeout(function(){ aviso(t('j_' + j) + ' +★' + (r.premio || 15), '🎮'); }, i * 1800); });
    }).catch(function(){}).then(function(){ bonusOcupado = false; });
  }
  setInterval(function(){ bonusConferir(); provadosConferir(); }, 90000);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden){ bonusUltimo = 0; bonusConferir(); provadosConferir(); } });
  document.addEventListener('tw-corrida-fim', function(){ setTimeout(function(){ trilhaConferir(); provadosConferir(); }, 3000); });

  // ───── Promoção da semana ─────
  function promoCarregar(){
    rpc('promo_semana').then(function(p){
      if(!p || !p.ok || !p.k) return;
      window.TW_PROMO = p;
      if(typeof perfLojaUI === 'function') try{ perfLojaUI(); }catch(e){}
      var chave = 'tw_promo_vista_' + p.item + '_' + p.ate;
      if(!lerLS(chave)) setTimeout(function(){ if(!outraJanelaAberta()){ gravarLS(chave, '1'); aviso(t('promo', {i:nomeItem(p.item), o:p.original, p:p.preco}), '🏷️'); } }, 6000);
    }).catch(function(){});
  }
  // preço que vale agora (a lojinha usa)
  window.twPrecoLoja = function(k, base){ var p = window.TW_PROMO; return p && p.k === k ? +p.preco : base; };
  window.twFaltaTxt = function(preco){
    var n = Math.max(0, (+preco || 0) - (+starT || 0)); if(!n) return '';
    var c = Math.max(1, Math.ceil(n / CORRIDA_MEDIA));
    return t(c === 1 ? 'falta1' : 'falta', {n:n, c:c});
  };

  // ───── Roupas provadas: avisa quando as estrelas já dão ─────
  function provados(){ try{ return JSON.parse(lerLS('tw_provados') || '[]'); }catch(e){ return []; } }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-provar]'); if(!b || typeof PERF_LOJA === 'undefined') return;
    var k = b.dataset.provar, l = provados(); if(!k || l.indexOf(k) >= 0) return;
    l.push(k); gravarLS('tw_provados', JSON.stringify(l.slice(-12)));
  }, true);
  function provadosConferir(){
    if(!logado() || typeof PERF_LOJA === 'undefined' || typeof perfLojaDono !== 'function') return;
    var dono = []; try{ dono = perfLojaDono(); }catch(e){}
    provados().some(function(k){
      var it = null; for(var i = 0; i < PERF_LOJA.length; i++) if(PERF_LOJA[i][0] === k) it = PERF_LOJA[i];
      if(!it || dono.indexOf(k) >= 0) return false;
      var preco = window.twPrecoLoja(k, it[3]), chave = 'tw_provado_avisado_' + k;
      if((+starT || 0) < preco || lerLS(chave)) return false;
      gravarLS(chave, '1'); aviso(t('podeComprar', {i:it[1] + ' ' + tr2(it[2])}), '🛍️'); return true;
    });
  }

  // ───── Rival do dia (Idol⭐Battle!) e sequência das Missões, para o "Hoje" ─────
  var rivalD = null, seqD = null, hojePedido = 0;
  function redesenharHoje(){ try{ window.dispatchEvent(new Event('tw-semana')); }catch(e){} }
  function hojeCarregar(){
    if(!logado()){ rivalD = seqD = null; redesenharHoje(); return; }
    var meu = ++hojePedido, dono = conta();
    rpc('battle_status').then(function(r){
      if(meu !== hojePedido || dono !== conta() || !r || !r.ok) return;
      rivalD = {premiado:!!r.premiado, tentativas:+r.tentativas || 0}; redesenharHoje();
    }).catch(function(){});
    rpc('missoes_sequencia').then(function(r){
      if(meu !== hojePedido || dono !== conta() || !r || !r.ok) return;
      seqD = {dias:+r.dias || 0, proximo:r.proximo || null, hoje:!!r.hoje_ok};
      if(r.premio > 0){ estrelas(r.stars); aviso(t('seqOk', {n:seqD.dias, p:r.premio}), '🔥'); }
      redesenharHoje();
    }).catch(function(){});
  }
  // depois de missões e partidas a tela volta para o Início: recarrega sem pressa (no máximo 1 vez a cada 40 s)
  var hojeUltimo = 0;
  document.addEventListener('visibilitychange', function(){ if(!document.hidden && Date.now() - hojeUltimo > 40000){ hojeUltimo = Date.now(); hojeCarregar(); } });
  setInterval(function(){ if(!document.hidden && logado()){ hojeUltimo = Date.now(); hojeCarregar(); } }, 180000);

  // ───── Selo "Novo" na Zipper⭐Shop!: muda quando entra item novo no catálogo ─────
  function lojaAssinatura(){
    var k = [];
    try{ if(typeof PERF_LOJA !== 'undefined') PERF_LOJA.forEach(function(it){ k.push(it[0]); }); }catch(e){}
    try{ if(typeof LOJA_EXTRA !== 'undefined') LOJA_EXTRA.forEach(function(it){ k.push(it[0]); }); }catch(e){}
    return k.length ? k.sort().join(',') : '';
  }
  function lojaVista(){
    var a = lojaAssinatura(); if(a) gravarLS('tw_loja_vista', a);
  }
  function lojaNovo(){
    var a = lojaAssinatura(), v = lerLS('tw_loja_vista'); if(!a) return false;
    if(v === null){ gravarLS('tw_loja_vista', a); return false; }   // primeira vez neste aparelho: só guarda
    var vistos = v.split(',');
    return a.split(',').some(function(k){ return vistos.indexOf(k) < 0; });
  }
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-ir="loja"]'); if(b) lojaVista();
  }, true);
  setInterval(function(){ if(typeof shopOv !== 'undefined' && shopOv && !shopOv.hidden) lojaVista(); }, 5000);

  // ───── cliques ─────
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-twe]'); if(!b) return;
    if(b.dataset.twe === 'kit') kitEscolher(b);
    else if(b.dataset.twe === 'trilha') trilhaAbrir();
    else return;
    e.preventDefault();
  });

  promoCarregar();
  window.TW_ESTREIA = {
    t:t, trilhaAtiva:function(){ return !!(trilha && trilha.ativa); },
    rival:function(){ return rivalD; }, sequencia:function(){ return seqD; }, lojaNovo:lojaNovo,
    contaMudou:function(){
      if(!logado()){ trilha = null; hojeCarregar(); return; }
      setTimeout(function(){ kitConferir(); }, 3500);
      setTimeout(trilhaConferir, 2500);
      setTimeout(function(){ bonusUltimo = 0; bonusConferir(); }, 5000);
      setTimeout(provadosConferir, 7000);
      setTimeout(function(){ hojeUltimo = Date.now(); hojeCarregar(); }, 2000);
    }
  };
})();
