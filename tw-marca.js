/* TsuLiPa⭐World · assinatura nas imagens salvas (20/11/2026).
   Todo PNG que a pessoa baixa (cards, fotos, resultados) sai com um selinho em uma faixa própria abaixo da foto com o endereço
   do site, para quem vir a imagem nos stories saber onde jogar. A imagem da tela não muda: o selo vai numa cópia.
   twMarcaPng(canvas[, tipo]) → data URL PNG com o selo. Se algo falhar, devolve a imagem original. */
(function(){
  'use strict';
  var SITE = 'tsulipa-world.vercel.app';
  function pill(x, px, py, w, h){ var r = h / 2; x.beginPath(); if(x.roundRect) x.roundRect(px, py, w, h, r); else x.rect(px, py, w, h); }
  function marcar(cv){
    var W = cv.width, H = cv.height;
    if(!W || !H) return null;
    var fs = Math.max(1, Math.min(Math.max(10, Math.round(Math.min(W, H * 1.4) * 0.026)), W / 22)), txt = SITE;
    var faixa = Math.ceil(fs * 3);
    // Reserva espaço fora da foto: nomes, legendas e rostos ficam intactos.
    var c = document.createElement('canvas'); c.width = W; c.height = H + faixa;
    var x = c.getContext('2d'); x.drawImage(cv, 0, 0, W, H);
    x.fillStyle = '#f4eefc'; x.fillRect(0, H, W, faixa);
    x.font = '800 ' + fs + 'px "M PLUS Rounded 1c","Mochiy Pop One",sans-serif';
    var tw = x.measureText(txt).width, ph = Math.round(fs * 1.75), pw = Math.round(tw + fs * 1.3), m = Math.round(fs * .6);
    var px = (W - pw) / 2, py = H + (faixa - ph) / 2;
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

/* Compartilhar (21/11/2026 · PR das melhorias, item 1).
   No celular, todo link de imagem com "download" (PNG/JPG das 17 telas que exportam foto) abre o compartilhar do
   aparelho com a imagem pronta — Instagram, WhatsApp, "Salvar imagem". No computador continua baixando.
   Vale para links na página (clique da pessoa) e para os criados só para baixar (a.click() sem estar na página).
   Para não compartilhar um link específico: data-tw-baixar="1". JSON/ICS e outros arquivos seguem baixando.
   Depois de salvar/compartilhar, avisa a página com o evento "tw-foto-salva" (o convite de conta escuta). */
(function(){
  'use strict';
  var IMG = /\.(png|jpe?g|webp)$/i;
  function celular(){ try{ return matchMedia('(pointer:coarse)').matches; }catch(e){ return false; } }
  function podeArquivos(){
    if(typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function' || typeof File !== 'function') return false;
    try{ return navigator.canShare({files:[new File([new Uint8Array(1)], 'x.png', {type:'image/png'})]}); }catch(e){ return false; }
  }
  var LIGADO = null;
  function ligado(){ if(LIGADO === null) LIGADO = celular() && podeArquivos(); return LIGADO; }
  function tipoDe(nome){ return /\.jpe?g$/i.test(nome) ? 'image/jpeg' : /\.webp$/i.test(nome) ? 'image/webp' : 'image/png'; }
  // Lê o arquivo na hora (sem esperar): o compartilhar só abre dentro do toque da pessoa.
  function arquivoDe(href, nome){
    var bytes;
    if(/^data:/i.test(href)){
      var i = href.indexOf(','), meta = href.slice(5, i), dado = href.slice(i + 1);
      var bin = /;base64/i.test(meta) ? atob(dado) : decodeURIComponent(dado);
      bytes = new Uint8Array(bin.length); for(var k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
    } else if(/^blob:/i.test(href)){
      var x = new XMLHttpRequest(); x.open('GET', href, false); x.overrideMimeType('text/plain; charset=x-user-defined'); x.send();
      var t = x.responseText; bytes = new Uint8Array(t.length); for(var j = 0; j < t.length; j++) bytes[j] = t.charCodeAt(j) & 255;
    } else return null;
    return new File([bytes], nome, {type:tipoDe(nome)});
  }
  function avisar(nome){ try{ document.dispatchEvent(new CustomEvent('tw-foto-salva', {detail:{nome:nome}})); }catch(e){} }
  var baixarOriginal = HTMLAnchorElement.prototype.click;
  function compartilhar(a){
    if(!ligado() || a.dataset.twBaixar === '1') return false;
    var nome = a.getAttribute('download') || '', href = a.getAttribute('href') || a.href || '';
    if(!IMG.test(nome) || !/^(data:image|blob:)/i.test(href)) return false;
    var arq; try{ arq = arquivoDe(href, nome); }catch(e){ arq = null; }
    if(!arq || !navigator.canShare({files:[arq]})) return false;
    navigator.share({files:[arq], title:'TsuLiPa⭐World', text:'🌷 ' + (window.TW_SITE || 'tsulipa-world.vercel.app')}).then(function(){ avisar(nome); }, function(err){
      if(err && err.name === 'AbortError') return;                       // a pessoa fechou o compartilhar
      a.dataset.twBaixar = '1'; try{ baixarOriginal.call(a); } finally { delete a.dataset.twBaixar; } avisar(nome);
    });
    return true;
  }
  // links criados só para baixar (não estão na página)
  HTMLAnchorElement.prototype.click = function(){
    if(!this.isConnected && this.hasAttribute('download') && compartilhar(this)) return;
    if(this.hasAttribute('download') && IMG.test(this.getAttribute('download') || '')) setTimeout(avisar, 0, this.getAttribute('download'));
    return baixarOriginal.apply(this, arguments);
  };
  // links na página: o clique da pessoa (depois dos onclick que preenchem o href)
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest && e.target.closest('a[download]');
    if(!a || e.defaultPrevented) return;
    var nome = a.getAttribute('download') || '';
    if(!IMG.test(nome)) return;
    if(compartilhar(a)){ e.preventDefault(); return; }
    setTimeout(avisar, 0, nome);
  }, false);
  window.TW_COMPARTILHAR = {ligado:ligado, arquivoDe:arquivoDe};
})();
