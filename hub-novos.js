/* TsuLiPa⭐World — os jogos novos também moram no Hub.
   Bloom⭐Garden!, Photo⭐Studio! e Idol⭐Battle! já abriam pelo mapa; aqui ganham cards na lista de
   Jogos, com o mesmo molde dos outros. Não cria regra nem consulta nova: só chama o que cada jogo
   já expõe (bloomAbrir, studioAbrir, battleAbrir) e lê o resumo que o jardim já carregou. */
(function(){
  'use strict';
  var TXT = {
    pt:{bloom:'Plante, regue um pouquinho por dia e colha flores.', studio:'A pauta do dia pede uma foto: monte a cena e clique.', battle:'Escale três Idols e vença o rival do dia.', regar:'Hora de regar', colher:'Tem flor para colher'},
    en:{bloom:'Plant, water a little every day and pick flowers.', studio:"Today's brief asks for a photo: set the scene and shoot.", battle:"Pick three Idols and beat today's rival.", regar:'Time to water', colher:'A flower is ready'},
    es:{bloom:'Planta, riega un poquito cada día y cosecha flores.', studio:'La pauta del día pide una foto: arma la escena y dispara.', battle:'Elige tres Idols y vence al rival del día.', regar:'Hora de regar', colher:'Hay flor para cosechar'},
    id:{bloom:'Tanam, siram sedikit setiap hari, lalu petik bunganya.', studio:'Tugas hari ini meminta satu foto: atur adegan lalu jepret.', battle:'Pilih tiga Idol dan kalahkan lawan hari ini.', regar:'Waktunya menyiram', colher:'Ada bunga siap dipetik'},
    th:{bloom:'ปลูก รดน้ำวันละนิด แล้วเก็บดอกไม้', studio:'โจทย์วันนี้ขอรูปหนึ่งใบ: จัดฉากแล้วกดถ่าย', battle:'เลือกไอดอลสามคนแล้วเอาชนะคู่แข่งวันนี้', regar:'ถึงเวลารดน้ำ', colher:'มีดอกไม้พร้อมเก็บ'},
    ja:{bloom:'種をまいて、毎日少しずつ水をあげて、花を摘もう。', studio:'今日のお題は写真1枚。シーンを作って撮ろう。', battle:'アイドル3人を選んで今日のライバルに勝とう。', regar:'水やりの時間', colher:'摘める花があります'}
  };
  var JOGOS = [
    {k:'bloom', nome:'Bloom', resto:'Garden!', jp:'ブルームガーデン', ico:'🌷', abrir:'bloomAbrir'},
    {k:'studio', nome:'Photo', resto:'Studio!', jp:'フォトスタジオ', ico:'📸', abrir:'studioAbrir'},
    {k:'battle', nome:'Idol', resto:'Battle!', jp:'アイドルバトル', ico:'🏟️', abrir:'battleAbrir'}
  ];
  function L(){ return (typeof LANG === 'string' && TXT[LANG]) ? TXT[LANG] : TXT.pt; }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(String(s)) : String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }
  function cards(){
    var box = document.getElementById('hubCards'); if(!box || !box.querySelector) return;
    var jardim = null; try{ jardim = typeof window.bloomResumo === 'function' ? window.bloomResumo() : null; }catch(e){ jardim = null; }
    JOGOS.forEach(function(j){
      if(typeof window[j.abrir] !== 'function' || box.querySelector('[data-twnovo="' + j.k + '"]')) return;
      var aviso = j.k === 'bloom' && jardim ? (jardim.colher ? L().colher : jardim.regar ? L().regar : '') : '';
      var abrir = typeof hubGameAbrir === 'function' ? hubGameAbrir(j.nome + ' ' + j.resto.replace('!', '')) : j.nome + ' ' + j.resto;
      box.insertAdjacentHTML('beforeend',
        '<button type="button" class="hubcard tw-hubgame tw-hubnovo tw-hubnovo-' + j.k + (aviso ? ' tw-alert-pink' : '') + '" data-twnovo="' + j.k + '" aria-label="' + esc(abrir) + '">' +
        '<i aria-hidden="true">' + j.ico + '</i><b translate="no">' + j.nome + '<span class="tw-star">⭐</span>' + j.resto + '</b>' +
        '<small class="tw-hubgame-jp" lang="ja">' + j.jp + '</small><small>' + esc(aviso || L()[j.k]) + '</small>' +
        (aviso ? '<em class="hubalerta">!</em>' : '') + '</button>');
    });
  }
  // Mesmo padrão do bloom.js: embrulha o redesenho do Hub em vez de editar o hub.js.
  var orig = window.hubCardsUI;
  if(typeof orig === 'function') window.hubCardsUI = function(){ var r = orig.apply(this, arguments); try{ cards(); }catch(e){} return r; };
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-twnovo]'); if(!b) return;
    var j = JOGOS.filter(function(x){ return x.k === b.getAttribute('data-twnovo'); })[0];
    if(j && typeof window[j.abrir] === 'function'){ try{ if(typeof sfx !== 'undefined' && sfx && sfx.card) sfx.card(); }catch(_){} window[j.abrir](); }
  });
  window.TW_HUB_NOVOS = {txt:TXT, jogos:JOGOS.map(function(j){ return j.k; })};
})();
