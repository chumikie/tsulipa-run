/* Modo admin — a parte que roda para todo mundo (17/11/2026): quem é admin, "Liberar tudo", nomes dos itens da loja
   (recados de presente no hub.js), a lista de Idols do hub (hubIdolsDados, usada por muitos arquivos) e o estado do Montar o Idol.
   O painel e as ferramentas de moderação estão em admin.js, que só baixa quando o Perfil confirma que a conta é admin.
   O servidor continua conferindo eh_admin() em todas as RPCs de admin. Código igual; só mudou de arquivo. */
var perfAdmin = false;
function contaAdmin(){ return !!(contaJ && perfAdmin); }
function admItens(){   // tudo o que se compra no servidor: visuais, poses, fundos e roupas
  return PERF_VIS.filter(function(o){ return o[0]; }).map(function(o){ return [o[0], perfRot(o)]; })
    .concat(PERF_POSES.filter(function(o){ return o[3]; }).map(function(o){ return ['pose_' + o[0], '🧍 ' + perfRot(o)]; }))
    .concat(typeof LOJA_EXTRA !== 'undefined' ? LOJA_EXTRA.map(function(o){ return [o[0], o[1] + ' ' + tr(o[2])]; }) : [])
    .concat(PERF_FUNDOS.filter(function(o){ return o[3]; }).map(function(o){ return ['fundo_' + o[0], '🖼️ ' + perfRot(o)]; }))
    .concat(PERF_LOJA.map(function(o){ return ['roupa_' + o[0], '👗 ' + perfRot(o)]; }));
}
// Montar o Idol de um membro (admin): visual completo, com as mesmas regras de liberação da roupa.
var admIdol=null;
// O servidor confere eh_admin() em admin_missoes_completar e libera o salvar_avatar só para a moderação.
var ADM_LIVRE_KEY = 'brs48cr_admlivre';
function admLivre(){ var v = false; try{ v = localStorage.getItem(ADM_LIVRE_KEY) === '1'; }catch(e){} return v && typeof contaAdmin === 'function' && contaAdmin(); }
function admLivreBtn(){ var on = admLivre();
  return '<button type="button" class="btn' + (on ? '' : ' alt') + '" id="admLivre" aria-pressed="' + on + '">' + (on ? '🔓 ' : '🔒 ') + escHtml(tr(on ? 'Liberar tudo: ligado' : 'Liberar tudo: desligado')) + '</button>'; }
var hubIdolsDados = null, hubIdolsEm = 0;

/* ---------- admin.js baixa só para quem é admin ---------- */
var admCarregado = false, admPedido = false, admFila = [];
function admCarregar(){
  if(admCarregado || admPedido) return; admPedido = true;
  var s = document.createElement('script'); s.src = './admin.js?v=8'; s.async = true;
  s.onload = function(){ admCarregado = true; var f = admFila.splice(0); f.forEach(function(fn){ try{ fn(); }catch(e){ if(window.console) console.error(e); } }); };
  s.onerror = function(){ admPedido = false; admFila.length = 0; };
  document.body.appendChild(s);
}
function admDepois(fn){ if(admCarregado) fn(); else { admFila.push(fn); admCarregar(); } }
// Substitutos até o admin.js chegar (as declarações dele os trocam). HTML sai vazio; ações rodam assim que ele chega.
function admBarraHtml(){ admCarregar(); return ''; }
function admOpts(){ admCarregar(); return ''; }
function admIdolFormHtml(){ admCarregar(); return ''; }
function admCamarimOpts(){ admCarregar(); return ''; }
function admAcao(){ var a = arguments; return new Promise(function(ok, falha){ admDepois(function(){ window.admAcao.apply(window, a).then(ok, falha); }); }); }
['admPainel', 'admExtra', 'admContasUI', 'admIdolPrev', 'admIdolPng', 'admRoupaPng', 'admVisualRoupa'].forEach(function(n){
  window[n] = function(){ var a = arguments; admDepois(function(){ window[n].apply(window, a); }); };
});
