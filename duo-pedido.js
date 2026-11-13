/* Moon⭐Duo! — Pedido de cena do dia (só front-end, sem prêmio no banco).
   Todo dia (0h de Brasília) sai uma cena e um cenário liberados para todo mundo. Montar e salvar a foto
   cumpre o pedido (fica marcado no aparelho). Liga o Duo a um objetivo diário e prepara o Photo⭐Studio!. */
(function(){
  'use strict';
  var CHAVE = 'tw_duo_pedido';
  var T = {
    tit:  {pt:'Pedido de cena do dia', en:'Scene request of the day', es:'Pedido de escena del día', id:'Permintaan adegan hari ini', th:'คำขอฉากประจำวัน', ja:'今日のシーンリクエスト'},
    cena: {pt:'Cena', en:'Scene', es:'Escena', id:'Adegan', th:'ฉาก', ja:'シーン'},
    fundo:{pt:'Cenário', en:'Backdrop', es:'Fondo', id:'Latar', th:'ฉากหลัง', ja:'背景'},
    mont: {pt:'Montar', en:'Set up', es:'Montar', id:'Atur', th:'จัดฉาก', ja:'セット'},
    pron: {pt:'Pronto! Agora é só salvar a foto 📸', en:'Ready! Now just save the photo 📸', es:'¡Listo! Ahora guarda la foto 📸', id:'Siap! Tinggal simpan fotonya 📸', th:'พร้อมแล้ว! บันทึกรูปได้เลย 📸', ja:'準備OK！写真を保存しよう📸'},
    feito:{pt:'Pedido do dia cumprido! Volte amanhã ✨', en:'Done for today! Come back tomorrow ✨', es:'¡Pedido cumplido! Vuelve mañana ✨', id:'Selesai hari ini! Kembali besok ✨', th:'ทำสำเร็จแล้ว! พรุ่งนี้มาใหม่นะ ✨', ja:'今日のリクエスト達成！また明日✨'}
  };
  function t(k){ var L = (typeof LANG === 'string' && LANG) || 'pt'; return T[k][L] || T[k].pt; }
  function diaBR(){ return Math.floor((Date.now() - 3 * 3600e3) / 864e5); }
  function feitoHoje(){ try{ return localStorage.getItem(CHAVE) === String(diaBR()); }catch(e){ return false; } }
  function marcar(){ try{ localStorage.setItem(CHAVE, String(diaBR())); }catch(e){} }
  function pronto(){ return typeof DUO_CENAS !== 'undefined' && typeof duoFundos === 'function' && typeof duoTrava === 'function'; }
  // sorteio estável do dia (mesmo pedido para todo mundo na mesma data, quando possível)
  function pedido(){
    if(!pronto()) return null;
    var d = diaBR(), cenas = DUO_CENAS.filter(function(c){ return !c[7]; });
    var fundos = duoFundos().filter(function(o){ return !duoTrava('data-dfundo', o); });
    if(!cenas.length || !fundos.length) return null;
    var c = cenas[((d * 7) % cenas.length + cenas.length) % cenas.length], f = fundos[((d * 5 + 3) % fundos.length + fundos.length) % fundos.length];
    return { cena:c, fundo:f };
  }
  function bate(p){ return p && typeof duoCena !== 'undefined' && duoCena === p.cena[0] && duoFundo === p.fundo[0]; }
  function nome(o){ return (typeof tr === 'function' ? tr(o[2]) : o[2]); }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(s) : String(s); }

  function ui(){
    var palco = document.getElementById('duoPalco'); if(!palco) return;
    var box = document.getElementById('duoPedido');
    if(!box){ box = document.createElement('div'); box.id = 'duoPedido'; box.className = 'duo-pedido'; palco.insertBefore(box, palco.firstChild); }
    var p = pedido(); if(!p){ box.hidden = true; return; }
    box.hidden = false;
    var feito = feitoHoje(), ok = bate(p);
    box.classList.toggle('feito', feito); box.classList.toggle('ok', ok && !feito);
    box.innerHTML = '<span class="duo-pedido-ico">📸</span><span class="duo-pedido-txt"><b>' + esc(t('tit')) + '</b><small>' +
      (feito ? esc(t('feito')) : ok ? esc(t('pron')) :
        esc(t('cena')) + ': ' + p.cena[1] + ' ' + esc(nome(p.cena)) + ' · ' + esc(t('fundo')) + ': ' + p.fundo[1] + ' ' + esc(nome(p.fundo))) +
      '</small></span>' + (feito || ok ? '' : '<button type="button" class="duo-pedido-bt">' + esc(t('mont')) + '</button>');
  }
  function montar(){
    var p = pedido(); if(!p) return;
    duoCena = p.cena[0]; duoFundo = p.fundo[0];
    if(typeof duoBalao !== 'undefined') duoBalao = null;
    if(typeof duoT !== 'undefined') duoT = 0;
    if(typeof duoPalcoUI === 'function') duoPalcoUI();
    if(typeof duoRegistrar === 'function') try{ duoRegistrar(); }catch(e){}
    if(typeof beep === 'function') try{ beep(1175, .06, 'triangle', .05); }catch(e){}
  }
  document.addEventListener('click', function(e){
    var el = e.target && e.target.closest ? e.target : null; if(!el) return;
    if(el.closest('.duo-pedido-bt')){ e.preventDefault(); montar(); return; }
    // salvar a foto com a cena e o cenário do dia cumpre o pedido
    if(el.closest('#duoPng,#duoPngSem') && !feitoHoje() && bate(pedido())){
      marcar(); ui();
      if(typeof sfx !== 'undefined' && sfx && sfx.rank) try{ sfx.rank(); }catch(er){}
    }
  }, true);
  if(typeof window.duoPalcoUI === 'function'){
    var o = window.duoPalcoUI;
    window.duoPalcoUI = function(){ var r = o.apply(this, arguments); try{ ui(); }catch(e){} return r; };
  }
  window.twDuoPedido = { pedido:pedido, feitoHoje:feitoHoje };
})();
