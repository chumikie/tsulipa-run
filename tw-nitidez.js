/* TsuLiPa⭐World · nitidez automática dos desenhos em canvas (17/11/2026)
   Problema: quase todo desenho do site é feito num canvas de tamanho fixo (ex.: 480 × 320) e mostrado maior na tela,
   ainda mais no celular (densidade 2–3×) e no computador com zoom do Windows → quadrinhos, fichinhas, palcos e o
   próprio Center⭐Run saíam borrados (medido: 0,35–0,6 pixel real por pixel de tela no celular).
   Solução, num ponto só: quando um desenho pede o pincel 2D (getContext) de um canvas QUE ESTÁ NA PÁGINA, ele ganha
   mais pixels reais e uma escala por baixo. Para o jogo nada muda:
   - cv.width / cv.height continuam respondendo o tamanho lógico (toques e coordenadas iguais);
   - setTransform / resetTransform mantêm a escala; sombras (shadowBlur/Offset) acompanham;
   - drawImage com esse canvas como origem copia no tamanho lógico;
   - toDataURL / toBlob devolvem a imagem no tamanho lógico de sempre (fotos, posts e downloads iguais).
   Fica de fora: canvas fora da página (rascunhos), quem já desenha na resolução certa, data-nitido="0" e canvas que
   leem pixels de volta (getImageData). Só muda a resolução no próximo getContext (nunca apaga um desenho parado).
   Teto: 3×, e 2× para canvas grandes (> 150 mil pixels lógicos, ex.: Center⭐Run e Sora⭐Jump, que redesenham a cada quadro). */
(function(){
  'use strict';
  // Freio (17/11): ?nitidez=0 desliga (fica guardado no aparelho em tw_nitidez), ?nitidez=1 liga de novo.
  // Desligado, nada aqui é instalado e os desenhos voltam a ser como antes.
  try{
    var q = new URLSearchParams(location.search).get('nitidez');
    if(q === '0' || q === '1') localStorage.setItem('tw_nitidez', q);
    if(localStorage.getItem('tw_nitidez') === '0'){ window.TW_NITIDEZ = {escala:function(){ return 1; }, preparar:function(){ return 1; }, desligada:true}; return; }
  }catch(e){}
  var P = window.HTMLCanvasElement && HTMLCanvasElement.prototype, C = window.CanvasRenderingContext2D && CanvasRenderingContext2D.prototype;
  if(!P || !C || P.__twNitidez) return;
  P.__twNitidez = true;
  var dW = Object.getOwnPropertyDescriptor(P, 'width'), dH = Object.getOwnPropertyDescriptor(P, 'height');
  if(!dW || !dH || !dW.set || !dH.set) return;
  var getCtx = P.getContext, setT = C.setTransform, resetT = C.resetTransform, drawImg = C.drawImage;
  var toURL = P.toDataURL, toBlob = P.toBlob, getImg = C.getImageData;

  var PEQUENO = 120000;   // canvas até ~350 × 350 lógicos
  function estado(cv){ return cv.__twA; }
  function precisa(cv, st){
    var z = window.devicePixelRatio || 1, vis = cv.clientWidth;
    if(!vis) return st.k || (st.w * st.h <= PEQUENO ? Math.min(3, Math.ceil(z * 4) / 4) : 1);   // ainda sem tamanho na tela
    var k = Math.ceil(z * vis / st.w * 4) / 4;
    var teto = st.w * st.h > 150000 ? 2 : 3;
    return Math.min(teto, Math.max(1, k));
  }
  function aplicar(cv, st, ctx){
    var k = precisa(cv, st);
    if(k === st.k) return;
    st.k = k; dW.set.call(cv, Math.round(st.w * k)); dH.set.call(cv, Math.round(st.h * k));
    try{ setT.call(ctx || getCtx.call(cv, '2d'), k, 0, 0, k, 0, 0); }catch(e){}
  }
  function adotar(cv){
    if(cv.__twN || cv.__twA === false) return null;  // twNitido (perfil.js) já cuida, ou ficou de fora
    if(cv.dataset && cv.dataset.nitido === '0'){ cv.__twA = false; return null; }
    var w = dW.get.call(cv), h = dH.get.call(cv), z = window.devicePixelRatio || 1, vis = cv.clientWidth;
    if(!w || !h) return null;
    // sem tamanho na tela ainda (desenhado logo ao ser criado): os pequenos já nascem na densidade do aparelho
    if(!vis){ if(w * h > PEQUENO || z <= 1.05) return null; }
    else if(z * vis / w <= 1.05){ return null; }     // já está na resolução certa (ou maior): não mexe
    var st = cv.__twA = {w:w, h:h, k:0};
    try{
      Object.defineProperty(cv, 'width', {configurable:true, get:function(){ return st.w; }, set:function(v){ st.w = Math.max(0, Math.floor(+v || 0)); st.k = 0; aplicar(cv, st); }});
      Object.defineProperty(cv, 'height', {configurable:true, get:function(){ return st.h; }, set:function(v){ st.h = Math.max(0, Math.floor(+v || 0)); st.k = 0; aplicar(cv, st); }});
    }catch(e){ cv.__twA = false; return null; }
    return st;
  }
  P.getContext = function(tipo, op){
    var ctx = getCtx.apply(this, arguments);
    if(tipo === '2d' && ctx && this.isConnected){
      try{ var st = estado(this) || adotar(this); if(st) aplicar(this, st, ctx); }catch(e){}
    }
    return ctx;
  };
  function kDe(ctx){ var st = ctx && ctx.canvas && ctx.canvas.__twA; return st && st.k > 1 ? st.k : 1; }
  C.setTransform = function(a, b, c, d, e, f){
    var k = kDe(this);
    if(k !== 1 && typeof a === 'number') return setT.call(this, a * k, b * k, c * k, d * k, e * k, f * k);
    if(k !== 1 && a && typeof a === 'object'){ return setT.call(this, (a.a||1) * k, (a.b||0) * k, (a.c||0) * k, (a.d||1) * k, (a.e||0) * k, (a.f||0) * k); }
    return setT.apply(this, arguments);
  };
  if(resetT) C.resetTransform = function(){ var k = kDe(this); return k !== 1 ? setT.call(this, k, 0, 0, k, 0, 0) : resetT.call(this); };
  ['shadowBlur', 'shadowOffsetX', 'shadowOffsetY'].forEach(function(nome){
    var d = Object.getOwnPropertyDescriptor(C, nome); if(!d || !d.set) return;
    Object.defineProperty(C, nome, {configurable:true, enumerable:d.enumerable, get:function(){ var k = kDe(this); return d.get.call(this) / k; }, set:function(v){ d.set.call(this, (+v || 0) * kDe(this)); }});
  });
  C.drawImage = function(img){
    var st = img && img.__twA;
    if(st && st.k > 1){
      var a = arguments, k = st.k;
      if(a.length === 3) return drawImg.call(this, img, 0, 0, st.w * k, st.h * k, a[1], a[2], st.w, st.h);
      if(a.length === 5) return drawImg.call(this, img, 0, 0, st.w * k, st.h * k, a[1], a[2], a[3], a[4]);
      if(a.length === 9) return drawImg.call(this, img, a[1] * k, a[2] * k, a[3] * k, a[4] * k, a[5], a[6], a[7], a[8]);
    }
    return drawImg.apply(this, arguments);
  };
  function copiaLogica(cv){
    var st = cv.__twA, o = document.createElement('canvas'); dW.set.call(o, st.w); dH.set.call(o, st.h);
    var x = getCtx.call(o, '2d'); x.imageSmoothingQuality = 'high'; drawImg.call(x, cv, 0, 0, st.w * st.k, st.h * st.k, 0, 0, st.w, st.h); return o;
  }
  P.toDataURL = function(){ var st = this.__twA; if(st && st.k > 1) return toURL.apply(copiaLogica(this), arguments); return toURL.apply(this, arguments); };
  if(toBlob) P.toBlob = function(){ var st = this.__twA; if(st && st.k > 1) return toBlob.apply(copiaLogica(this), arguments); return toBlob.apply(this, arguments); };
  // quem lê pixels de volta continua na resolução lógica: na primeira leitura, a escala é desfeita para sempre
  C.getImageData = function(){
    var cv = this.canvas, st = cv && cv.__twA;
    if(st && st.k > 1){ var o = copiaLogica(cv); cv.__twA = false; delete cv.width; delete cv.height; dW.set.call(cv, st.w); dH.set.call(cv, st.h); drawImg.call(this, o, 0, 0); }
    return getImg.apply(this, arguments);
  };
  // preparar(cv): para canvas pequenos desenhados ANTES de entrar na página (miniaturas, fotos redondas):
  // já nascem na densidade do aparelho. Devolve a escala aplicada.
  function preparar(cv){
    if(!cv || cv.__twN || cv.__twA === false) return 1;
    var st = cv.__twA;
    if(!st){
      var w = dW.get.call(cv), h = dH.get.call(cv), z = window.devicePixelRatio || 1;
      if(!w || !h || w * h > PEQUENO || z <= 1.05 || (cv.dataset && cv.dataset.nitido === '0')) return 1;
      st = cv.__twA = {w:w, h:h, k:0};
      try{
        Object.defineProperty(cv, 'width', {configurable:true, get:function(){ return st.w; }, set:function(v){ st.w = Math.max(0, Math.floor(+v || 0)); st.k = 0; aplicar(cv, st); }});
        Object.defineProperty(cv, 'height', {configurable:true, get:function(){ return st.h; }, set:function(v){ st.h = Math.max(0, Math.floor(+v || 0)); st.k = 0; aplicar(cv, st); }});
      }catch(e){ cv.__twA = false; return 1; }
    }
    aplicar(cv, st);
    return st.k || 1;
  }
  window.TW_NITIDEZ = {escala:function(cv){ var st = cv && cv.__twA; return st ? st.k : 1; }, preparar:preparar};
})();
