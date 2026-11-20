/* TsuLiPa⭐World · assinatura nas imagens salvas (20/11/2026).
   Todo PNG que a pessoa baixa (cards, fotos, resultados) sai com um selinho discreto no canto de baixo com o endereço
   do site, para quem vir a imagem nos stories saber onde jogar. A imagem da tela não muda: o selo vai numa cópia.
   twMarcaPng(canvas[, tipo]) → data URL PNG com o selo. Se algo falhar, devolve a imagem original. */
(function(){
  'use strict';
  var SITE = 'tsulipa-world.vercel.app';
  function pill(x, px, py, w, h){ var r = h / 2; x.beginPath(); if(x.roundRect) x.roundRect(px, py, w, h, r); else x.rect(px, py, w, h); }
  function marcar(cv){
    var W = cv.width, H = cv.height;
    if(!W || !H) return null;
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var x = c.getContext('2d'); x.drawImage(cv, 0, 0, W, H);
    var fs = Math.max(10, Math.round(Math.min(W, H * 1.4) * 0.026)), txt = '🌷 ' + SITE;
    x.font = '800 ' + fs + 'px "M PLUS Rounded 1c","Mochiy Pop One",sans-serif';
    var tw = x.measureText(txt).width, ph = Math.round(fs * 1.75), pw = Math.round(tw + fs * 1.3), m = Math.round(fs * .6);
    var px = W - pw - m, py = H - ph - m;
    x.save();
    x.shadowColor = 'rgba(40,10,90,.25)'; x.shadowBlur = Math.round(fs * .4);
    x.fillStyle = 'rgba(255,255,255,.88)'; pill(x, px, py, pw, ph); x.fill();
    x.shadowBlur = 0; x.lineWidth = Math.max(1, fs * .12); x.strokeStyle = 'rgba(123,63,240,.55)'; pill(x, px, py, pw, ph); x.stroke();
    x.fillStyle = '#5a2bc4'; x.textBaseline = 'middle'; x.textAlign = 'center'; x.fillText(txt, px + pw / 2, py + ph / 2 + 1);
    x.restore();
    return c;
  }
  window.twMarcaCanvas = function(cv){ try{ return marcar(cv) || cv; }catch(e){ return cv; } };
  window.twMarcaPng = function(cv, tipo){
    try{ var c = marcar(cv); if(c) return c.toDataURL(tipo || 'image/png'); }catch(e){}
    return cv.toDataURL(tipo || 'image/png');
  };
  window.TW_SITE = SITE;
})();
