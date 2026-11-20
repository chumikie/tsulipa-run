/* TsuLiPa⭐World · nomes acessíveis para botões só de ícone (20/11/2026).
   Leitores de tela liam "✕", "✏️" ou nada. Aqui, todo botão cujo texto visível é só símbolo/emoji e que não tem
   aria-label, title nem aria-labelledby ganha um nome no idioma do jogo. Não muda nada na tela.
   Roda na abertura e depois sempre que uma janela nova entra no DOM (observador leve, no máximo duas vezes por segundo). */
(function(){
  'use strict';
  var T = {
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'閉じる'},
    editar:{pt:'Editar',en:'Edit',es:'Editar',id:'Ubah',th:'แก้ไข',ja:'編集'},
    renomear:{pt:'Renomear o pet',en:'Rename pet',es:'Renombrar mascota',id:'Ganti nama pet',th:'เปลี่ยนชื่อสัตว์เลี้ยง',ja:'ペットの名前を変える'},
    pausar:{pt:'Pausar',en:'Pause',es:'Pausar',id:'Jeda',th:'หยุดชั่วคราว',ja:'一時停止'},
    som:{pt:'Ligar ou desligar o som',en:'Sound on or off',es:'Activar o desactivar sonido',id:'Suara nyala/mati',th:'เปิด/ปิดเสียง',ja:'サウンドのオン・オフ'},
    foto:{pt:'Tirar foto',en:'Take photo',es:'Tomar foto',id:'Ambil foto',th:'ถ่ายรูป',ja:'写真を撮る'},
    pet:{pt:'Pet',en:'Pet',es:'Mascota',id:'Pet',th:'สัตว์เลี้ยง',ja:'ペット'},
    ajustes:{pt:'Ajustes',en:'Settings',es:'Ajustes',id:'Pengaturan',th:'ตั้งค่า',ja:'設定'},
    voltar:{pt:'Voltar',en:'Back',es:'Volver',id:'Kembali',th:'กลับ',ja:'戻る'},
    avancar:{pt:'Avançar',en:'Next',es:'Siguiente',id:'Berikutnya',th:'ถัดไป',ja:'次へ'},
    subir:{pt:'Pular',en:'Jump',es:'Saltar',id:'Lompat',th:'กระโดด',ja:'ジャンプ'},
    descer:{pt:'Deslizar',en:'Slide',es:'Deslizar',id:'Meluncur',th:'สไลด์',ja:'スライド'},
    tema:{pt:'Tema claro ou escuro',en:'Light or dark theme',es:'Tema claro u oscuro',id:'Tema terang/gelap',th:'ธีมสว่าง/มืด',ja:'ライト・ダークテーマ'},
    coracao:{pt:'Dar coração',en:'Give a heart',es:'Dar corazón',id:'Beri hati',th:'ให้หัวใจ',ja:'ハートを送る'},
    dormir:{pt:'Dormir',en:'Sleep',es:'Dormir',id:'Tidur',th:'นอน',ja:'寝る'},
    sentar:{pt:'Sentar',en:'Sit',es:'Sentarse',id:'Duduk',th:'นั่ง',ja:'座る'}
  };
  // símbolo visível → chave
  var POR_SIMBOLO = {'✕':'fechar','×':'fechar','✖':'fechar','✏️':'editar','✏':'editar','⏸':'pausar','⏸️':'pausar','🔊':'som','🔈':'som','🔇':'som',
    '📸':'foto','📷':'foto','🐾':'pet','⚙️':'ajustes','⚙':'ajustes','◀':'voltar','←':'voltar','‹':'voltar','▶':'avancar','→':'avancar','›':'avancar',
    '▲':'subir','▼':'descer','☀️':'tema','🌙':'tema','💗':'coracao','💖':'coracao','💤':'dormir','🛋️':'sentar','🛋':'sentar'};
  var POR_ID = {petRen:'renomear'};
  function lang(){ return typeof LANG === 'string' && T.fechar[LANG] ? LANG : 'pt'; }
  function so(b){ return (b.textContent || '').replace(/[\s️‍]/g, ''); }
  function semTexto(txt){ return !txt.replace(/[\p{Extended_Pictographic}\p{S}\p{P}]/gu, ''); }
  function nomear(b){
    if(b.hasAttribute('aria-label') || b.hasAttribute('aria-labelledby') || b.title) return;
    var txt = so(b); if(!txt || !semTexto(txt)) return;   // vazio: o texto chega depois; com letras: já tem nome
    var k = POR_ID[b.id] || (b.classList.contains('tw-window-close') ? 'fechar' : POR_SIMBOLO[txt] || POR_SIMBOLO[txt.replace(/[️]/g, '')]);
    if(k){ b.setAttribute('aria-label', T[k][lang()] || T[k].pt); b.setAttribute('data-tw-a11y', '1'); }
  }
  function varrer(raiz){ [].forEach.call((raiz || document).querySelectorAll('button,[role="button"]'), nomear); }
  var pedido = 0;
  function agendar(){ if(pedido) return; pedido = setTimeout(function(){ pedido = 0; varrer(document); }, 500); }   // no máximo 2 varreduras por segundo
  // troca de idioma: refaz os nomes que este arquivo colocou
  window.twA11yIdioma = function(){ [].forEach.call(document.querySelectorAll('[data-tw-a11y]'), function(b){ b.removeAttribute('aria-label'); b.removeAttribute('data-tw-a11y'); }); varrer(document); };
  function iniciar(){
    varrer(document);
    try{ new MutationObserver(agendar).observe(document.body, {childList:true, subtree:true}); }catch(e){}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
