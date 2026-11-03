/* TsuLiPa⭐World — Troca de cards (Star⭐Gacha!). 1 card repetido por 1 card, com aceite dos dois lados.
   RPCs propor_troca / responder_troca / cancelar_troca / minhas_trocas: proposta em
   supabase/sql/proposta/20261103180000_troca_de_cards.sql. Este arquivo só declara funções e tabelas. */
var trocaLista = null, trocaAviso = '';
function trocaNome(chave){   // a chave é o nick em minúsculas; mostra como está na vitrine
  var L = albumIdols(); for(var i = 0; i < L.length; i++) if(L[i].toLowerCase() === String(chave)) return L[i];
  return String(chave || '?');
}
function trocaRepetidos(){ return (albumDados || []).filter(function(c){ return c && c.card && c.card.nick && +c.vezes >= 2; }).map(function(c){ return c.card.nick; }); }
function trocaAbrir(){
  if(!contaJ){ contaEntrar(); return; }
  trocaOv.hidden = false; trocaOv.scrollTop = 0; trocaLista = null; trocaUI();
  contaRpc('minhas_trocas').then(function(L){ trocaLista = Array.isArray(L) ? L : []; trocaUI(); }).catch(function(){ trocaLista = 'erro'; trocaUI(); });
}
function trocaFechar(){ trocaOv.hidden = true; }
function trocaItem(t){
  var outro = '<b>' + escHtml(t.outro) + '</b>', dou = '<b>' + escHtml(trocaNome(t.dou)) + '</b>', quero = '<b>' + escHtml(trocaNome(t.quero)) + '</b>';
  var txt = t.eu_propus ? tr('Você dá {a} e recebe {b} de {c}') : tr('{c} dá {b} e quer {a}');
  txt = escHtml(txt).replace('{a}', dou).replace('{b}', quero).replace('{c}', outro);
  if(!t.eu_propus) txt = escHtml(tr('{c} dá {b} e quer {a}')).replace('{c}', outro).replace('{b}', dou).replace('{a}', quero);
  var acoes = '';
  if(t.status === 'pendente') acoes = t.eu_propus ? '<button type="button" class="btn alt" data-trcancelar="' + (+t.id) + '">' + escHtml(tr('Cancelar')) + '</button>'
    : '<button type="button" class="btn" data-trsim="' + (+t.id) + '">' + escHtml(tr('Aceitar')) + '</button><button type="button" class="btn alt" data-trnao="' + (+t.id) + '">' + escHtml(tr('Recusar')) + '</button>';
  else acoes = '<em class="trstatus">' + ({ aceita:'✅ ' + tr('Aceita'), recusada:'✖️ ' + tr('Recusada'), cancelada:tr('Cancelada'), vencida:'⌛ ' + tr('Vencida') }[t.status] || t.status) + '</em>';
  return '<li class="tritem">🔁 <span>' + txt + '</span><div class="btns">' + acoes + '</div></li>';
}
function trocaUI(){
  var c = $('trocaCorpo'); if(!c) return;
  if(trocaLista === null){ c.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  if(trocaLista === 'erro'){ c.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('As trocas de cards começam em breve!')) + '</p>'; return; }
  var rec = trocaLista.filter(function(t){ return !t.eu_propus && t.status === 'pendente'; }), env = trocaLista.filter(function(t){ return t.eu_propus && t.status === 'pendente'; }), fim = trocaLista.filter(function(t){ return t.status !== 'pendente'; }).slice(0, 5);
  var meus = trocaRepetidos(), todos = albumIdols();
  var h = '<p class="perfdica">' + escHtml(tr('Troque um card repetido por um card de outra pessoa. A troca só acontece se ela aceitar e também tiver o card repetido.')) + '</p>';
  h += '<h3>📥 ' + escHtml(tr('Recebidas')) + '</h3>' + (rec.length ? '<ul class="trlista">' + rec.map(trocaItem).join('') + '</ul>' : '<p class="jnvazio">' + escHtml(tr('Nenhuma proposta por enquanto.')) + '</p>');
  h += '<h3>📤 ' + escHtml(tr('Enviadas')) + '</h3>' + (env.length ? '<ul class="trlista">' + env.map(trocaItem).join('') + '</ul>' : '<p class="jnvazio">' + escHtml(tr('Nenhuma proposta por enquanto.')) + '</p>');
  h += '<h3>✨ ' + escHtml(tr('Nova troca')) + '</h3>';
  if(!meus.length) h += '<p class="jnvazio">' + escHtml(tr('Você ainda não tem cards repetidos para trocar.')) + '</p>';
  else h += '<div class="trform"><label>' + escHtml(tr('Com quem')) + ' <input type="text" id="trPara" maxlength="24" list="trNicks" autocomplete="off"><datalist id="trNicks">' + todos.filter(function(n){ return n !== (contaJ && contaJ.nick); }).map(function(n){ return '<option value="' + escHtml(n) + '">'; }).join('') + '</datalist></label>' +
    '<label>' + escHtml(tr('Eu dou')) + ' <select id="trDou">' + meus.map(function(n){ return '<option value="' + escHtml(n) + '">' + escHtml(n) + '</option>'; }).join('') + '</select></label>' +
    '<label>' + escHtml(tr('Eu quero')) + ' <select id="trQuero">' + todos.map(function(n){ return '<option value="' + escHtml(n) + '">' + escHtml(n) + '</option>'; }).join('') + '</select></label>' +
    '<div class="btns"><button type="button" class="btn" id="trPropor">🔁 ' + escHtml(tr('Propor troca')) + '</button></div></div>';
  h += '<p class="perfmsg" id="trMsg" hidden></p>';
  if(fim.length) h += '<h3>🕑 ' + escHtml(tr('Últimas trocas')) + '</h3><ul class="trlista">' + fim.map(trocaItem).join('') + '</ul>';
  c.innerHTML = h;
  if(trocaAviso){ trocaMsg(trocaAviso); trocaAviso = ''; }
}
function trocaMsg(t){ var m = $('trMsg'); if(m){ m.textContent = t; m.hidden = false; } }
var TROCA_ERROS = { pessoa:'Não achei essa pessoa.', cards:'Escolha dois cards diferentes.', sem_repetido:'Você precisa ter esse card repetido.', sem_repetido_outro:'A outra pessoa não tem mais o card repetido.', limite:'Você já tem 3 propostas esperando resposta.', vencida:'Essa proposta venceu.', troca:'Essa proposta não está mais disponível.' };
function trocaResp(r, ok){
  if(r && r.ok){ trocaAviso = ok; if(sfx && sfx.rank) try{ sfx.rank(); }catch(e){} trocaAbrir(); if(typeof albumAbrir === 'function' && !albumOv.hidden) contaRpc('album_cards').then(function(L){ albumDados = Array.isArray(L) ? L : albumDados; albumUI(); }).catch(function(){}); return; }
  trocaMsg(tr(TROCA_ERROS[r && r.erro] || 'Não deu para falar com o servidor. Tente de novo.'));
}
function trocaClique(e){
  var b = e.target, id;
  if(b.id === 'trPropor'){
    var para = ($('trPara').value || '').trim(), dou = $('trDou').value, quero = $('trQuero').value;
    if(!para){ trocaMsg(tr('Escreva com quem quer trocar.')); return; }
    b.disabled = true;
    contaRpc('propor_troca', { p_para:para, p_dou:dou, p_quero:quero }).then(function(r){ b.disabled = false; trocaResp(r, '✨ ' + tr('Proposta enviada!')); }).catch(function(){ b.disabled = false; trocaResp(null); });
  } else if((id = b.dataset && (b.dataset.trsim || b.dataset.trnao))){
    b.disabled = true;
    contaRpc('responder_troca', { p_id:+id, p_aceitar:!!b.dataset.trsim }).then(function(r){ trocaResp(r, b.dataset.trsim ? '🔁 ' + tr('Troca feita!') : tr('Proposta recusada.')); }).catch(function(){ trocaResp(null); });
  } else if((id = b.dataset && b.dataset.trcancelar)){
    contaRpc('cancelar_troca', { p_id:+id }).then(function(r){ trocaResp(r, tr('Proposta cancelada.')); }).catch(function(){ trocaResp(null); });
  }
}
