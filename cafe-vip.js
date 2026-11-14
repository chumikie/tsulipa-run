/* Happy⭐Cafe! — cliente VIP. A 6ª e a 11ª cliente de cada turno é alguém do TsuLiPa (Tsu, Lirika ou
   Pati) e o pedido vale o DOBRO. No modo verificado quem dobra é o servidor (cafe_run_etapa/etapa2,
   supabase/sql/aplicado/20261113_cafe_vip.sql); no treino sem conta o dobro é só local.
   Não altera cafe.js: envolve cfNovoClienteLocal, cfServir e cfDesenhar. */
(function(){
  'use strict';
  var RODADAS = [6, 11], NOMES = ['Tsu', 'Lirika', 'Pati'];
  var TXT = {pt:'VIP · vale o dobro!', en:'VIP · double points!', es:'VIP · ¡vale el doble!', id:'VIP · poin ganda!', th:'VIP · คะแนนสองเท่า!', ja:'VIP・ポイント2倍！'};
  function rotulo(){ var L = (typeof LANG === 'string' && LANG) || 'pt'; return TXT[L] || TXT.pt; }
  function rodada(){ return cf && cf.servidor && +cf.servidor.rodada ? +cf.servidor.rodada : (cf ? cf.atendidos + 1 : 0); }
  window.cfEhVip = function(n){ return RODADAS.indexOf(n) >= 0; };
  if(typeof window.cfNovoClienteLocal === 'function'){
    var novo = window.cfNovoClienteLocal;
    window.cfNovoClienteLocal = function(){
      var n = rodada(), r = novo.apply(this, arguments);
      if(cf && cf.cli && window.cfEhVip(n)){ cf.cli.vip = true; cf.cli.nome = NOMES[Math.floor(Date.now() / 864e5 + n) % 3]; if(typeof cfUI === 'function') cfUI(); }
      return r;
    };
  }
  if(typeof window.cfServir === 'function'){
    var servir = window.cfServir;
    window.cfServir = function(saiu){
      var vip = cf && cf.cli && cf.cli.vip, local = cf && !(cf.servidor && cf.modoServidor === 'novo'), antes = cf ? cf.pontos : 0;
      var r = servir.apply(this, arguments);
      if(vip && local && cf && cf.ok && cf.pontos > antes) cf.pontos += cf.pontos - antes;   // treino: dobra só o que este pedido deu
      return r;
    };
  }
  if(typeof window.cfDesenhar === 'function'){
    var desenhar = window.cfDesenhar;
    window.cfDesenhar = function(){
      var r = desenhar.apply(this, arguments);
      if(!cf || !cf.cli || !cf.cli.vip || cf.fase === 'fim') return r;
      try{
        var cv = document.getElementById('cfCv'); if(!cv) return r;
        var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, tm = (typeof cfT === 'number' ? cfT : 0) / 60;
        var s = '👑 ' + rotulo(), fs = Math.round(W2 * .032);
        x.save(); x.font = '900 ' + fs + 'px "Mochiy Pop One",sans-serif'; var w = x.measureText(s).width + fs * 1.4, bx = W2 * .03, by = H2 * .78;
        var g = x.createLinearGradient(bx, 0, bx + w, 0); g.addColorStop(0, '#ffd23f'); g.addColorStop(1, '#ff9bd0');
        x.fillStyle = g; x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath();
        if(x.roundRect) x.roundRect(bx, by - fs, w, fs * 1.6, fs * .8); else x.rect(bx, by - fs, w, fs * 1.6); x.fill(); x.stroke();
        x.fillStyle = '#5a2a9e'; x.textBaseline = 'middle'; x.fillText(s, bx + fs * .7, by - fs * .2);
        for(var i = 0; i < 5; i++){ var a = Math.max(0, Math.sin(tm * 3 + i * 1.3)); x.globalAlpha = a; x.fillStyle = '#fff3a0';
          x.beginPath(); x.arc(bx + (i + .5) * w / 5, by - fs * 1.3 - a * 4, 2 + a * 2.5, 0, 7); x.fill(); }
        x.restore();
      }catch(e){}
      return r;
    };
  }
})();
