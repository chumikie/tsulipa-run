/* Happy⭐Cafe! — gorjeta visível. O jogo já paga pela rapidez (100 × o que sobrou da paciência, conferido
   pelo servidor); agora isso aparece: "Gorjeta +N" e moedinhas voando para o potinho do balcão.
   Só visual: não muda pontos, servidor, estrelas nem saves. Não altera cafe.js (envolve cfServir/cfDesenhar). */
(function(){
  'use strict';
  var TXT = {pt:'Gorjeta', en:'Tip', es:'Propina', id:'Tip', th:'ทิป', ja:'チップ'};
  function rotulo(){ var L = (typeof LANG === 'string' && LANG) || 'pt'; return TXT[L] || TXT.pt; }
  var voando = [];
  if(typeof window.cfServir === 'function'){
    var servir = window.cfServir;
    window.cfServir = function(saiu){
      var g = 0;
      try{
        if(cf && cf.fase === 'pedido' && cf.cli && cf.monta){
          var p = cf.cli.pedido, m = cf.monta;
          var certo = !saiu && m.base === p.base && m.cob === p.cob && m.enf === p.enf && m.doce === p.doce;
          if(certo) g = Math.round(Math.max(0, 1 - (cfT - cf.t0) / cfPaciencia()) * 100);
        }
      }catch(e){}
      var r = servir.apply(this, arguments);
      if(g >= 5){
        voando.push({v:g, t0:(typeof cfT === 'number' ? cfT : 0)});
        if(typeof beep === 'function') try{ beep(1568, .05, 'triangle', .03); beep(2093, .06, 'triangle', .025, .06); }catch(e){}
      }
      return r;
    };
  }
  if(typeof window.cfDesenhar === 'function'){
    var desenhar = window.cfDesenhar;
    window.cfDesenhar = function(){
      var r = desenhar.apply(this, arguments);
      if(!voando.length) return r;
      try{
        var cv = document.getElementById('cfCv'); if(!cv) return r;
        var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, agora = typeof cfT === 'number' ? cfT : 0;
        var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
        voando = voando.filter(function(v){
          var f = (agora - v.t0) / 80; if(f < 0 || f > 1) return false;   // ~1,3 s
          var a = Math.min(1, (1 - f) * 2.5), y = H2 * .66 - (reduz ? 0 : f * H2 * .14);
          x.save(); x.globalAlpha = a; x.textAlign = 'center'; x.font = '900 ' + Math.round(W2 * .04) + 'px "Mochiy Pop One",sans-serif';
          var s = '🪙 ' + rotulo() + ' +' + v.v;
          x.lineWidth = 5; x.strokeStyle = '#fff'; x.strokeText(s, W2 * .78, y); x.fillStyle = '#e8a400'; x.fillText(s, W2 * .78, y);
          if(!reduz) for(var i = 0; i < 4; i++){   // moedinhas caindo no potinho
            var u = Math.min(1, Math.max(0, f * 1.6 - i * .12)), cx = W2 * (.7 + i * .04) + (W2 * .84 - W2 * (.7 + i * .04)) * u, cy = H2 * .42 + u * H2 * .2 - Math.sin(u * Math.PI) * H2 * .1;
            x.fillStyle = '#ffc21a'; x.beginPath(); x.arc(cx, cy, W2 * .009, 0, 7); x.fill(); x.fillStyle = '#fff3a0'; x.beginPath(); x.arc(cx - 1, cy - 1, W2 * .004, 0, 7); x.fill();
          }
          x.restore(); return true;
        });
      }catch(e){}
      return r;
    };
  }
})();
