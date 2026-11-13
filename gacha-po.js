/* TsuLiPa⭐World — Pó de estrela do Star⭐Gacha! (dentro do Álbum).
   1 cópia repetida = 1 pó · 5 pós = 1 card que falta. Regras e segurança no servidor:
   supabase/sql/proposta/20261113_gacha_po_garantia_REVIEW_ONLY.sql (gacha_po_status,
   gacha_converter_repetido, gacha_resgatar_card).
   DESLIGADO POR CONSTRUÇÃO: a seção só aparece quando gacha_po_status() existe no banco e
   responde ok. Antes do SQL ser aplicado o Álbum continua exatamente igual.
   O navegador nunca decide quantidades: só pede, e mostra o que o servidor devolveu. */
var GPO_TR = {
  pt:['Pó de estrela','1 repetido = 1 pó · 5 pós = 1 card que falta','Converter repetidos','Converter 1 cópia de {n} em 1 pó? A primeira cópia fica no álbum.','Converter','Cancelar','Resgatar um card que falta','Resgatar o card de {n} por 5 pós?','Resgatar','Sem repetidos para converter.','Faltam {n} pós para resgatar.','+1 pó de estrela!','{n} chegou ao seu álbum!','Não deu certo. Tente de novo.','Seu álbum está completo!'],
  en:['Star dust','1 duplicate = 1 dust · 5 dust = 1 missing card','Convert duplicates','Turn 1 copy of {n} into 1 dust? Your first copy stays in the album.','Convert','Cancel','Get a missing card','Get {n}\'s card for 5 dust?','Get card','No duplicates to convert.','{n} more dust to get a card.','+1 star dust!','{n} joined your album!','Something went wrong. Try again.','Your album is complete!'],
  es:['Polvo de estrella','1 repetido = 1 polvo · 5 polvos = 1 card que falta','Convertir repetidos','¿Convertir 1 copia de {n} en 1 polvo? La primera copia se queda en el álbum.','Convertir','Cancelar','Conseguir un card que falta','¿Conseguir el card de {n} por 5 polvos?','Conseguir','No hay repetidos para convertir.','Faltan {n} polvos para conseguir un card.','¡+1 polvo de estrella!','¡{n} llegó a tu álbum!','No funcionó. Inténtalo de nuevo.','¡Tu álbum está completo!'],
  id:['Debu bintang','1 duplikat = 1 debu · 5 debu = 1 kartu yang kurang','Tukar duplikat','Ubah 1 salinan {n} jadi 1 debu? Salinan pertama tetap di album.','Ubah','Batal','Ambil kartu yang kurang','Ambil kartu {n} dengan 5 debu?','Ambil','Tidak ada duplikat untuk ditukar.','Kurang {n} debu untuk mengambil kartu.','+1 debu bintang!','{n} masuk ke albummu!','Gagal. Coba lagi.','Albummu sudah lengkap!'],
  th:['ผงดาว','การ์ดซ้ำ 1 ใบ = ผง 1 · ผง 5 = การ์ดที่ยังขาด 1 ใบ','แลกการ์ดซ้ำ','แลกการ์ด {n} 1 ใบเป็นผง 1? ใบแรกยังอยู่ในอัลบั้ม','แลก','ยกเลิก','รับการ์ดที่ยังขาด','รับการ์ดของ {n} ด้วยผง 5?','รับการ์ด','ไม่มีการ์ดซ้ำให้แลก','ขาดผงอีก {n} เพื่อรับการ์ด','+1 ผงดาว!','{n} เข้ามาในอัลบั้มแล้ว!','ไม่สำเร็จ ลองอีกครั้ง','อัลบั้มของคุณครบแล้ว!'],
  ja:['スターダスト','ダブり1枚 = 1ダスト · 5ダスト = 足りないカード1枚','ダブりを変換','{n}のカード1枚を1ダストに変換しますか？最初の1枚はアルバムに残ります。','変換する','キャンセル','足りないカードをもらう','5ダストで{n}のカードをもらいますか？','もらう','変換できるダブりはありません。','カードまであと{n}ダスト。','スターダスト+1！','{n}がアルバムに加わりました！','うまくいきませんでした。もう一度試してね。','アルバムがコンプリート！']
};
function gpoT(i, n){
  var l = typeof LANG === 'string' && GPO_TR[LANG] ? LANG : 'pt';
  var s = GPO_TR[l][i]; return n === undefined ? s : s.replace('{n}', n);
}
var gpoStatus = null, gpoBusy = false, gpoPend = null, gpoMsg = '', gpoSel = '';
function gpoUuid(){
  try{ if(crypto && crypto.randomUUID) return crypto.randomUUID(); }catch(e){}
  var h = '0123456789abcdef', s = '';
  for(var i = 0; i < 36; i++) s += (i === 8 || i === 13 || i === 18 || i === 23) ? '-' : i === 14 ? '4' : h[(Math.random() * 16) | 0];
  return s;
}
function gpoCarregar(){
  if(typeof contaRpc !== 'function') return Promise.resolve();
  return contaRpc('gacha_po_status').then(function(r){ gpoStatus = r && r.ok ? r : null; })
    .catch(function(){ gpoStatus = null; })   // função ainda não existe no banco: seção fica escondida
    .then(function(){ gpoPintar(); });
}
function gpoHtml(){
  var st = gpoStatus; if(!st) return '';
  var po = Math.max(0, +st.po || 0), custo = Math.max(1, +st.custo_troca || 5);
  var rep = Array.isArray(st.repetidos) ? st.repetidos : [], falta = Array.isArray(st.faltando) ? st.faltando : [];
  var dis = gpoBusy ? ' disabled' : '';
  var h = '<section class="gpo" aria-live="polite"><h3>✨ ' + escHtml(gpoT(0)) + ': <b>' + po + '</b></h3><p class="gpoexp">' + escHtml(gpoT(1)) + '</p>';
  if(gpoMsg) h += '<p class="gpomsg">' + escHtml(gpoMsg) + '</p>';
  if(gpoPend){
    var txt = gpoPend.tipo === 'converter' ? gpoT(3, gpoPend.nick) : gpoT(7, gpoPend.nick);
    h += '<div class="gpoconf"><p>' + escHtml(txt) + '</p><div class="btns"><button type="button" class="btn" data-gpo="ok"' + dis + '>' +
      escHtml(gpoPend.tipo === 'converter' ? gpoT(4) : gpoT(8)) + '</button><button type="button" class="btn alt" data-gpo="nao"' + dis + '>' + escHtml(gpoT(5)) + '</button></div></div>';
  }
  h += '<h4>' + escHtml(gpoT(2)) + '</h4>';
  if(rep.length) h += '<div class="gporep">' + rep.map(function(c){
    return '<button type="button" class="gpochip" data-gpo="c" data-gpon="' + escHtml(c.nick) + '"' + dis + '>🃏 ' + escHtml(c.nick) + ' ×' + (+c.vezes || 0) + ' <i>→ +1 ✨</i></button>';
  }).join('') + '</div>';
  else h += '<p class="gpovazio">' + escHtml(gpoT(9)) + '</p>';
  h += '<h4>' + escHtml(gpoT(6)) + '</h4>';
  if(!falta.length) h += '<p class="gpovazio">🎉 ' + escHtml(gpoT(14)) + '</p>';
  else if(po < custo) h += '<p class="gpovazio">' + escHtml(gpoT(10, custo - po)) + '</p>';
  else {
    if(!falta.some(function(c){ return c.nick === gpoSel; })) gpoSel = falta[0].nick;
    h += '<div class="gporesg"><select id="gpoSel" aria-label="' + escHtml(gpoT(6)) + '"' + dis + '>' + falta.map(function(c){
      return '<option' + (c.nick === gpoSel ? ' selected' : '') + '>' + escHtml(c.nick) + '</option>';
    }).join('') + '</select><button type="button" class="btn" data-gpo="r"' + dis + '>' + escHtml(gpoT(8)) + ' (−' + custo + ' ✨)</button></div>';
  }
  return h + '</section>';
}
function gpoPintar(){
  var corpo = typeof $ === 'function' && $('albumCorpo'); if(!corpo) return;
  var box = $('gpoBox');
  if(!gpoStatus || !albumPronto){ if(box) box.remove(); return; }
  if(!box){ box = document.createElement('div'); box.id = 'gpoBox'; var bt = corpo.querySelector('.albumgrade'); corpo.insertBefore(box, bt || null); }
  box.innerHTML = gpoHtml();
}
function gpoEnviar(){
  var p = gpoPend; if(!p || gpoBusy) return;
  gpoBusy = true; gpoMsg = ''; gpoPintar();
  // a mesma requisição (p.req) é reenviada se a pessoa tentar de novo: o servidor não repete a operação
  var rpc = p.tipo === 'converter' ? 'gacha_converter_repetido' : 'gacha_resgatar_card';
  contaRpc(rpc, {p_nick: p.nick, p_requisicao: p.req}).then(function(r){
    if(r && r.ok){
      gpoPend = null;
      gpoMsg = p.tipo === 'converter' ? '✨ ' + gpoT(11) : '🃏 ' + gpoT(12, r.card && r.card.nick || p.nick);
      if(typeof sfx !== 'undefined' && sfx && sfx.card) try{ sfx.card(); }catch(e){}
      return contaRpc('album_cards').then(function(L){ if(Array.isArray(L)) albumDados = L; }).catch(function(){});
    }
    var e = r && r.erro;
    if(e !== 'parametros' && e !== 'sem_conta') gpoPend = null;   // falha definitiva: limpa e recarrega a lista
    gpoMsg = e === 'po_insuficiente' ? gpoT(10, Math.max(1, (+gpoStatus.custo_troca || 5) - (+gpoStatus.po || 0))) : gpoT(13);
  }).catch(function(){ gpoMsg = gpoT(13); })            // rede: mantém o pedido (mesma requisição) para tentar de novo
    .then(function(){ gpoBusy = false; return gpoCarregar(); })
    .then(function(){ if(typeof albumUI === 'function') albumUI(); });
}
function gpoClique(e){
  var b = e.target.closest && e.target.closest('[data-gpo]'); if(!b || gpoBusy || !gpoStatus) return;
  var k = b.dataset.gpo;
  if(k === 'c') gpoPend = {tipo: 'converter', nick: b.dataset.gpon, req: gpoUuid()};
  else if(k === 'r'){ var s = $('gpoSel'); var n = s ? s.value : gpoSel; if(!n) return; gpoSel = n; gpoPend = {tipo: 'resgatar', nick: n, req: gpoUuid()}; }
  else if(k === 'nao') gpoPend = null;
  else if(k === 'ok'){ gpoEnviar(); return; }
  gpoMsg = ''; gpoPintar();
}
// Encaixe no Álbum sem alterar album.js: ao abrir, consulta o pó; a cada redesenho, recoloca a seção.
if(typeof albumUI === 'function' && typeof albumAbrir === 'function' && !albumUI._gpo){
  var _gpoAlbumUI = albumUI, _gpoAlbumAbrir = albumAbrir;
  albumUI = function(){ var r = _gpoAlbumUI.apply(this, arguments); gpoPintar(); return r; };
  albumUI._gpo = true;
  albumAbrir = function(){ gpoStatus = null; gpoPend = null; gpoMsg = ''; var r = _gpoAlbumAbrir.apply(this, arguments); if(typeof contaJ !== 'undefined' && contaJ) gpoCarregar(); return r; };
  document.addEventListener('click', gpoClique);
  document.addEventListener('change', function(e){ if(e.target && e.target.id === 'gpoSel') gpoSel = e.target.value; });
}
