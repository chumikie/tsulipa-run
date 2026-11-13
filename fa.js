/* TsuLiPa⭐World — Pedidos de fã (só front-end; o servidor sorteia, confere e entrega).
   Todo dia um fã (um Idol da vitrine, sorteado pela data) pede algo; ao cumprir, você entrega e ganha 1 carta de fã 💌.
   RPCs pedido_fa_hoje / entregar_pedido_fa: proposta em supabase/sql/proposta/20261103170000_pedidos_de_fa.sql.
   Este arquivo só declara funções e tabelas. */
var FA_PEDIDOS = {   // texto do pedido; {n} = meta
  corridas3:  ['🏁', 'Quero ver você correr {n} vezes no Center⭐Run! hoje!'],
  estrelas30: ['⭐', 'Junta {n} estrelas no Center⭐Run! pra mim hoje?'],
  pontos1500: ['🎯', 'Faz {n} pontos numa corrida do Center⭐Run!, por favor!'],
  karaoke1:   ['🎤', 'Canta pra mim no Karaoke⭐Time! hoje? Só {n} show!']
};
var faDados = null, faDadosConta = '', faDadosDia = '';
function faContaDono(){
  if(typeof contaJ === 'undefined' || !contaJ) return '';
  // jogador() pode omitir id; a sessão Google distingue contas com o mesmo nick.
  return String((typeof contaAuthUserId === 'string' && contaAuthUserId) || contaJ.id || contaJ.nick || '');
}
function faDadosAtuais(){
  var dono = faContaDono();
  var dia = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  return dono && dono === faDadosConta && dia === faDadosDia && faDados && !faDados.erro &&
    Object.prototype.hasOwnProperty.call(FA_PEDIDOS, faDados.tipo) ? faDados : null;
}
function faFa(){   // o fã do dia: um Idol da vitrine que não é você (mesmo para o dia todo)
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols.filter(function(p){ return p && p.nick && p.avatar; }) : [];
  var eu = String(contaJ && contaJ.nick || '').toLowerCase(); L = L.filter(function(p){ return String(p.nick).toLowerCase() !== eu; });
  if(!L.length) return null;
  L.sort(function(a, b){ return String(a.nick).localeCompare(String(b.nick)); });
  var d = Math.floor((Date.now() - 3 * 3600e3) / 864e5), h = 0, s = eu + d; for(var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return L[h % L.length];
}
function faCartaoHtml(){
  return '<button type="button" class="hubmusica hubfa" id="hubFa">💌 <b>' + escHtml(tr('Pedido de fã')) + '</b><small class="tw-hubgame-jp" lang="ja">ファンのお願い</small><small id="hubFaSub">' + escHtml(contaJ ? tr('Um fã deixou um pedido pra você!') : tr('Entre para receber pedidos de fãs')) + '</small></button>';
}
function faAbrir(){
  if(!contaJ){ contaEntrar(); return; }
  var dono = faContaDono(), sessao = typeof contaSessaoToken === 'number' ? contaSessaoToken : null;
  var dia = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  faDadosConta = dono; faDadosDia = dia;
  faOv.hidden = false; faDados = null; faUI();
  if(typeof hubAgendaUI === 'function') hubAgendaUI();
  function atual(d){
    if(!contaJ || faContaDono() !== dono || faDadosConta !== dono || faDadosDia !== dia ||
       (sessao !== null && contaSessaoToken !== sessao)) return;
    faDados = d && d.ok ? d : { erro:'servidor' }; faUI();
    if(typeof hubAgendaUI === 'function') hubAgendaUI();
  }
  contaRpc('pedido_fa_hoje').then(atual).catch(function(){ atual(null); });
}
function faFechar(){ faOv.hidden = true; }
function faUI(){
  var c = $('faCorpo'); if(!c) return;
  var fa = faFa(), h = '<canvas id="faCv" width="360" height="300" aria-hidden="true"></canvas>';
  if(faDados === null) h += '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  else if(faDados.erro) h += '<p class="albumaviso">🛠️ ' + escHtml(tr('Os pedidos de fã começam em breve!')) + '</p>';
  else {
    var p = FA_PEDIDOS[faDados.tipo] || ['💌', '{n}'], meta = +faDados.meta || 1, prog = Math.min(meta, +faDados.progresso || 0);
    var tm = typeof temaAtual === 'function' ? temaAtual() : '', ti = tm && typeof TEMA_INFO !== 'undefined' ? TEMA_INFO[tm] : null;
    if(ti) h += '<p class="fatema">' + ti[0] + ' ' + escHtml(tr('Pedido especial: {t}!').replace('{t}', tr(ti[1]))) + '</p>';
    else if(typeof eventoAtual === 'function') h += '<p class="fatema">' + eventoAtual().emo + ' ' + escHtml(tr(eventoAtual().nome)) + '</p>';   // sem data especial: o evento da semana   // pedidos ligados ao evento do momento
    h += '<div class="facarta"><small>' + escHtml(tr('Um recado de')) + ' <b>' + escHtml(fa ? fa.nick : tr('um fã')) + '</b></small><p>' + p[0] + ' ' + escHtml(tr(p[1]).replace('{n}', meta.toLocaleString('pt-BR'))) + '</p></div>' +
      '<div class="albumbarra"><i style="width:' + Math.round(prog / meta * 100) + '%"></i></div><p class="albumprog">' + prog.toLocaleString('pt-BR') + ' / ' + meta.toLocaleString('pt-BR') + '</p>' +
      (faDados.resgatado ? '<p class="faok">💌 ' + escHtml(tr('Pedido entregue! Volte amanhã para um novo.')) + '</p>'
        : '<div class="btns"><button type="button" class="btn" id="faEntregar"' + (faDados.feito ? '' : ' disabled') + '>💌 ' + escHtml(tr('Entregar')) + '</button></div>') +
      '<p class="fainfo">' + escHtml(tr('Cartas de fã')) + ': <b>' + (+faDados.cartas || 0) + '</b></p><p class="perfmsg" id="faMsg" hidden></p>';
  }
  c.innerHTML = h;
  var cv = $('faCv'), x = cv && cv.getContext('2d');
  if(x){ try{ perfFundo(x, cv.width, cv.height, 'basico', '#ff6fb5', 0); if(fa) perfDesenharIdol(x, cv.width, cv.height, Object.assign({}, fa.avatar, { pose:'coracao', expr:3, visual:'' }), false, false, 0); }catch(e){} }
}
function faEntregar(b){
  var dono = faContaDono(), dia = faDadosDia, dados = faDados;
  var sessao = typeof contaSessaoToken === 'number' ? contaSessaoToken : null;
  function mesmaConta(){
    return !!(dono && faContaDono() === dono && faDadosConta === dono && faDadosDia === dia &&
      faDados === dados && (sessao === null || contaSessaoToken === sessao));
  }
  b.disabled = true;
  contaRpc('entregar_pedido_fa').then(function(r){
    if(!mesmaConta()){ b.disabled = false; return; }
    if(r && r.ok){ faDados.resgatado = true; faDados.cartas = +r.cartas || (+faDados.cartas || 0) + 1; if(sfx && sfx.rank) try{ sfx.rank(); }catch(e){} faUI(); if(typeof hubAgendaUI === 'function') hubAgendaUI(); return; }
    var m = $('faMsg'); if(m){ m.textContent = tr(r && r.erro === 'incompleto' ? 'Ainda falta um pouquinho!' : 'Não deu para falar com o servidor. Tente de novo.'); m.hidden = false; } b.disabled = false;
  }).catch(function(){ b.disabled = false; });
}
