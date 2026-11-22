/* Encontro do dia — a parte da abertura (17/11/2026): o dia de Brasília, o encontro já sorteado e o botão no bloco "Hoje".
   A cena (desenho, dança, toques e foto) está em encontro.js, que só baixa quando o Encontro abre. Código igual. */
var ENC_KEY = 'brs48cr_enc';   // chave nova (não renomeia nenhuma antiga): { dia, nick, avatar, fala }
var encDados = null, encAnim = 0, encT = 0, encRenderGrupo = [], encRenderOrdem = [];
function encHoje(){ return dk(); }   // dia de hoje no horário de Brasília (AAAA-MM-DD)
function encDono(){ return contaJ && contaJ.nick ? String(contaJ.nick).toLowerCase() : ''; }   // de quem é o encontro guardado ('' = sem login)
function encLer(){ try{ var j = JSON.parse(localStorage.getItem(ENC_KEY) || 'null'); return j && j.dia === encHoje() && (j.dono || '') === encDono() ? j : null; }catch(e){ return null; } }
function encOrdem(d){   // da esquerda para a direita, como aparecem no palco: trio = extra 1, principal, extra 2
  var ex = (Array.isArray(d.extras) ? d.extras : []).filter(function(o){ return o && o.nick; });
  return ex.length >= 2 ? [ex[0], d, ex[1]] : [d].concat(ex);
}
function encNomes(d){ return encOrdem(d).map(function(o){ return o.nick; }).join(' & '); }
function encBtnUI(){
  var feito = encLer();
  encBtn.innerHTML = feito
    ? '🌟 ' + escHtml(tr('Encontro de hoje')) + ': <b>' + escHtml(encNomes(feito)) + '</b><small class="tw-hubgame-jp" lang="ja">今日の出会い</small><small>' + escHtml(tr('ver de novo')) + '</small>'
    : '🌟 <b>' + escHtml(tr('Encontro do dia')) + '</b><small class="tw-hubgame-jp" lang="ja">今日の出会い</small><small>' + escHtml(tr('Quem vai aparecer hoje?')) + '</small>';
  encBtn.classList.toggle('feito', !!feito);
}

/* ---------- a cena baixa quando o Encontro abre ---------- */
var encPronto = false, encPedido = false, encFila = [];
function encCarregar(depois){
  if(encPronto){ if(depois) depois(); return; }
  if(depois) encFila.push(depois);
  if(encPedido) return; encPedido = true;
  var s = document.createElement('script'); s.src = './encontro.js?v=4'; s.async = true;
  s.onload = function(){ encPronto = true; var f = encFila.splice(0); f.forEach(function(fn){ try{ fn(); }catch(e){ if(window.console) console.error(e); } }); };
  s.onerror = function(){ encPedido = false; encFila.length = 0; };
  document.body.appendChild(s);
}
// Substitutos até a cena chegar (as declarações do encontro.js os trocam).
function encMostrar(d){ encCarregar(function(){ window.encMostrar(d); }); }
function encAbrirNovo(d){ encCarregar(function(){ window.encAbrirNovo(d); }); }
function encLoop(){}
