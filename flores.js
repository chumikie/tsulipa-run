/* TsuLiPa⭐World — as flores do Bloom⭐Garden! ganham uso, e o Caderno do Café volta pela conta.
   • Handshake⭐Event!: antes de começar, leve uma flor colhida para a mesa. Ela é gasta no servidor
     (jardim_usar_flor) e a fila começa mais animada (mais Hype = mais folga para errar). A pontuação
     continua sendo só a conferida pelo servidor.
   • Happy⭐Cafe!: ao abrir, as receitas que o servidor já comprovou (cafe_caderno) entram no Caderno,
     então ele não se perde ao trocar de aparelho.
   Sem as funções no banco, nada muda. Não altera handshake.js nem cafe.js (só envolve funções). */
(function(){
  'use strict';
  var FLOR = {sakura:['🌸',10], tulipa:['🌷',15], girassol:['🌻',20], lunar:['⭐',30]}, ORDEM = ['sakura','tulipa','girassol','lunar'];
  var T = {
    pt:{levar:'Levar uma flor para a mesa',dica:'Colha flores no Bloom⭐Garden! para enfeitar a mesa e animar a fila.',usou:'{f} deixou a fila animada: +{n} Hype!',erro:'A flor não chegou à mesa. A partida começa sem ela.'},
    en:{levar:'Bring a flower to the table',dica:'Pick flowers in Bloom⭐Garden! to decorate the table and cheer up the line.',usou:'The {f} cheered up the line: +{n} Hype!',erro:'The flower didn\'t make it. Starting without it.'},
    es:{levar:'Llevar una flor a la mesa',dica:'Cosecha flores en Bloom⭐Garden! para decorar la mesa y animar la fila.',usou:'¡{f} animó la fila: +{n} de Hype!',erro:'La flor no llegó a la mesa. La partida empieza sin ella.'},
    id:{levar:'Bawa bunga ke meja',dica:'Petik bunga di Bloom⭐Garden! untuk menghias meja dan menyemangati antrean.',usou:'{f} bikin antrean semangat: +{n} Hype!',erro:'Bunganya tidak sampai. Permainan dimulai tanpa bunga.'},
    th:{levar:'นำดอกไม้ไปวางบนโต๊ะ',dica:'เก็บดอกไม้ใน Bloom⭐Garden! มาแต่งโต๊ะให้แถวคึกคัก',usou:'{f} ทำให้แถวคึกคัก: +{n} Hype!',erro:'ดอกไม้ไปไม่ถึงโต๊ะ เริ่มเกมโดยไม่มีดอกไม้'},
    ja:{levar:'テーブルに花を飾る',dica:'Bloom⭐Garden!で花を摘んで、テーブルを飾って列を盛り上げよう。',usou:'{f}で列が盛り上がった：Hype +{n}！',erro:'花が届きませんでした。花なしで始めます。'}
  };
  function L(){ return typeof LANG === 'string' && T[LANG] ? LANG : 'pt'; }
  function t(k){ return T[L()][k]; }
  function nomeFlor(k){ var B = window.BLOOM_TR; return (B && (B[L()] || B.pt)[k]) || k; }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(s) : String(s); }
  var flores = null, escolhida = null, ocupado = false;
  window.TW_FLORES = { bonus: function(k){ return FLOR[k] ? FLOR[k][1] : 0; } };

  function carregar(){
    if(typeof contaJ === 'undefined' || !contaJ || typeof contaRpc !== 'function') return;
    contaRpc('jardim_estado').then(function(r){ if(r && r.ok){ flores = r.flores || {}; if(typeof hsUI === 'function' && hs && hs.fase === 'inicio') hsUI(); } }).catch(function(){});
  }
  // ---------- Handshake ----------
  if(typeof window.hsAbrir === 'function'){
    var abrir = window.hsAbrir;
    window.hsAbrir = function(){ escolhida = null; var r = abrir.apply(this, arguments); carregar(); return r; };
  }
  if(typeof window.hsUI === 'function'){
    var ui = window.hsUI;
    window.hsUI = function(){
      var r = ui.apply(this, arguments);
      try{
        if(!hs || typeof contaJ === 'undefined' || !contaJ || !flores) return r;
        var c = document.getElementById('hsCorpo'); if(!c) return r;
        if(hs.fase === 'inicio' || hs.fase === 'fim'){
          var bt = c.querySelector('#hsJogar'), box = bt && bt.parentNode; if(!box) return r;
          var tem = ORDEM.filter(function(k){ return +flores[k] > 0; });
          if(escolhida && !(+flores[escolhida] > 0)) escolhida = null;
          var h = tem.length ? '<div class="hsflores"><b>' + esc(t('levar')) + '</b><div>' + tem.map(function(k){
              return '<button type="button" class="hsflor' + (k === escolhida ? ' on' : '') + '" data-hsflor="' + k + '" aria-pressed="' + (k === escolhida) + '"' + (ocupado ? ' disabled' : '') + '>' +
                FLOR[k][0] + ' ' + esc(nomeFlor(k)) + ' ×' + (+flores[k]) + ' <i>+' + FLOR[k][1] + ' 🔥</i></button>'; }).join('') + '</div></div>'
            : '<p class="hsdica">🌷 ' + esc(t('dica')) + '</p>';
          box.insertAdjacentHTML('beforebegin', h);
        } else if(hs.flor && hs.rodada === 1 && hs.fase === 'fila'){
          c.insertAdjacentHTML('beforeend', '<p class="hsdica hsflormsg">' + FLOR[hs.flor][0] + ' ' + esc(t('usou').replace('{f}', nomeFlor(hs.flor)).replace('{n}', FLOR[hs.flor][1])) + '</p>');
        } else if(hs.florErro && hs.rodada === 1 && hs.fase === 'fila'){
          c.insertAdjacentHTML('beforeend', '<p class="hsdica">' + esc(t('erro')) + '</p>');
        }
      }catch(e){}
      return r;
    };
  }
  if(typeof window.hsIniciarSeguro === 'function'){
    var iniciar = window.hsIniciarSeguro;
    window.hsIniciarSeguro = function(){
      var k = escolhida, self = this, args = arguments;
      if(!k || typeof contaJ === 'undefined' || !contaJ || typeof contaRpc !== 'function') return iniciar.apply(self, args);
      escolhida = null; ocupado = true;
      contaRpc('jardim_usar_flor', {p_flor:k, p_uso:'handshake'}).then(function(r){ return r; }, function(){ return null; }).then(function(r){
        ocupado = false;
        iniciar.apply(self, args);
        if(!hs) return;
        if(r && r.ok){
          hs.flor = k; hs.hype = Math.min(100, hs.hype + FLOR[k][1]);
          if(flores) flores[k] = Math.max(0, +r.qtd || 0);
          if(typeof beep === 'function') try{ beep(1319, .08, 'triangle', .04); }catch(e){}
        } else hs.florErro = true;
        if(typeof hsUI === 'function') hsUI();
      });
    };
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-hsflor]'); if(!b || ocupado) return;
    var k = b.getAttribute('data-hsflor'); escolhida = escolhida === k ? null : k;
    if(typeof hsUI === 'function') hsUI();
  });
  // a flor escolhida fica num vasinho em cima da mesa
  if(typeof window.hsDesenhar === 'function'){
    var desenhar = window.hsDesenhar;
    window.hsDesenhar = function(){
      var r = desenhar.apply(this, arguments);
      try{
        if(!hs || !hs.flor) return r;
        var cv = document.getElementById('hsCv'); if(!cv) return r;
        var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height, vx = W2 * .93, vy = H2 * .6;
        x.save(); x.fillStyle = '#c9a7ff'; x.strokeStyle = '#fff'; x.lineWidth = 2;
        x.beginPath(); x.moveTo(vx - 12, vy - 18); x.lineTo(vx + 12, vy - 18); x.lineTo(vx + 9, vy + 4); x.lineTo(vx - 9, vy + 4); x.closePath(); x.fill(); x.stroke();
        x.font = Math.round(H2 * .1) + 'px sans-serif'; x.textAlign = 'center'; x.fillText(FLOR[hs.flor][0], vx, vy - 20 + Math.sin(Date.now() / 600) * 1.5);
        x.restore();
      }catch(e){}
      return r;
    };
  }
  // ---------- Café: Caderno a partir da conta ----------
  if(typeof window.cfAbrir === 'function'){
    var cfab = window.cfAbrir;
    window.cfAbrir = function(){
      var r = cfab.apply(this, arguments);
      if(typeof contaJ !== 'undefined' && contaJ && typeof contaRpc === 'function' && typeof cfLer === 'function'){
        contaRpc('cafe_caderno').then(function(L){
          if(!Array.isArray(L) || !L.length) return;
          var rec = cfLer(CF_RECEITAS_KEY, {}), mudou = false;
          L.forEach(function(k){ if(/^\d+-\d+$/.test(k) && !rec[k]){ rec[k] = 1; mudou = true; } });
          if(mudou){ cfGravar(CF_RECEITAS_KEY, rec); if(typeof cfUI === 'function' && cf) cfUI(); }
        }).catch(function(){});
      }
      return r;
    };
  }
})();
