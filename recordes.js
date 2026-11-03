/* 🏅 Meus recordes — seção da tela de início, logo depois dos Jogos.
   Abas lado a lado (uma aberta por vez, como sanfona) com os recordes pessoais de cada jogo.
   Center⭐Run! e Sora⭐Jump! vêm do servidor (os mesmos dados que antes ficavam no seu perfil);
   Karaoke vem do quadro semanal já carregado; Handshake e Happy Cafe ficam no aparelho. */
var recAba = '', recPerfil = null, recSora = null, recCarregando = false;
var REC_ABAS = [['run', '🏁', 'Center⭐Run!'], ['hand', '🤝', 'Handshake⭐Event!'], ['cafe', '🧋', 'Happy⭐Cafe!'], ['karaoke', '🎤', 'Karaoke⭐Time!'], ['sora', '☁️', 'Sora⭐Jump!']];
function recLocal(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } }
function recNum(v){ return (+v || 0).toLocaleString('pt-BR'); }
// Histórico pequeno por conta neste aparelho: sem RPC, prêmios ou ranking público.
var REC_LOCAL_PREFIX = 'tw_recordes_v1:', recLocalSeq = 0;
function recLocalDono(){ return contaJ && contaJ.id ? String(contaJ.id) : 'aparelho'; }
function recLocalChave(k){ return REC_LOCAL_PREFIX + recLocalDono() + ':' + k; }
function recSemanaLocal(at){
  var partes = new Intl.DateTimeFormat('en-US', {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(at));
  var d = {}; partes.forEach(function(p){d[p.type]=p.value;});
  var domingo = new Date(Date.UTC(+d.year,+d.month-1,+d.day));
  domingo.setUTCDate(domingo.getUTCDate()-domingo.getUTCDay());
  return domingo.toISOString().slice(0,10);
}
function recLocalCompactar(itens){
  var vistos = Object.create(null), validos = [];
  (Array.isArray(itens) ? itens.slice(-100) : []).forEach(function(p){
    if(!p || typeof p.id !== 'string' || p.id.length>50 || vistos[p.id]) return;
    if(!Number.isSafeInteger(p.score) || p.score<0 || p.score>10000000 || !Number.isSafeInteger(p.at) || p.at<0) return;
    vistos[p.id]=1; validos.push({id:p.id,score:p.score,at:p.at});
  });
  var melhores = validos.slice().sort(function(a,b){return b.score-a.score || a.at-b.at;}).slice(0,5);
  var recentes = validos.slice().sort(function(a,b){return b.at-a.at || b.id.localeCompare(a.id);}).slice(0,5);
  var manter = Object.create(null);
  melhores.concat(recentes).forEach(function(p){ manter[p.id]=1; });
  return validos.filter(function(p){return manter[p.id];}).sort(function(a,b){return b.at-a.at;});
}
function recHistoricoLocal(k, at){
  var agora = at===undefined ? Date.now() : at, semana = recSemanaLocal(agora);
  var salvo = recLocal(recLocalChave(k)) || {};
  var mesmaSemana = salvo.v===1 && salvo.semana===semana;
  return {v:1,semana:semana,melhorSemana:mesmaSemana && Number.isSafeInteger(salvo.melhorSemana) ? Math.max(0,salvo.melhorSemana) : 0,
    partidas:recLocalCompactar(salvo.partidas)};
}
function recRegistrarLocal(k, score, at){
  if(k!=='hand' && k!=='cafe') return false;
  var n = Number(score);
  if(!Number.isSafeInteger(n) || n<0 || n>10000000) return false;
  var agora = at===undefined ? Date.now() : at, d = recHistoricoLocal(k, agora);
  d.partidas = recLocalCompactar(d.partidas.concat([{id:String(agora)+'-'+(++recLocalSeq),score:n,at:agora}]));
  d.melhorSemana = Math.max(d.melhorSemana,n);
  try{localStorage.setItem(recLocalChave(k),JSON.stringify(d));return true;}catch(e){return false;}
}
function recMaiorLocal(k){
  var d = recHistoricoLocal(k), maior = d.partidas.reduce(function(m,p){return Math.max(m,p.score);},0);
  // O recorde antigo do aparelho não é atribuído a outra conta que entre neste navegador.
  if(recLocalDono()==='aparelho'){
    var chave = k==='hand' ? 'tw_handshake_recorde' : 'tw_cafe_recorde';
    maior=Math.max(maior,+recLocal(chave)||0);
  }
  return maior;
}
function recHistoricoHtml(k){
  var d = recHistoricoLocal(k);
  function linha(p){
    var data = new Date(p.at).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'});
    return '<li><span><small>' + escHtml(data) + '</small></span><strong>' + recNum(p.score) + '</strong></li>';
  }
  var melhores = d.partidas.slice().sort(function(a,b){return b.score-a.score || a.at-b.at;}).slice(0,5);
  var recentes = d.partidas.slice().sort(function(a,b){return b.at-a.at;}).slice(0,5);
  var vazio = '<li style="justify-content:center"><em>—</em></li>';
  return '<div class="recnums"><span><b>' + (d.melhorSemana ? recNum(d.melhorSemana) : '—') + '</b><small>' + escHtml(tr('Melhor da semana')) + '</small></span></div>' +
    '<h4 class="perfsub">🏆 ' + escHtml(tr('5 melhores pontuações')) + '</h4><ol class="lb perfult">' + (melhores.length ? melhores.map(linha).join('') : vazio) + '</ol>' +
    '<h4 class="perfsub">🕒 ' + escHtml(tr('5 pontuações recentes')) + '</h4><ol class="lb perfult">' + (recentes.length ? recentes.map(linha).join('') : vazio) + '</ol>';
}
function recCarregar(){
  recUI();
  if(!contaJ || recCarregando) return;
  recCarregando = true;
  Promise.all([
    contaRpc('meu_perfil').then(function(d){ recPerfil = d || null; }).catch(function(){}),
    contaRpc('sora_my_profile').then(function(d){ recSora = d || null; }).catch(function(){})
  ]).then(function(){ recCarregando = false; recUI(); });
}
function recResumo(k){   // linha curta mostrada na aba fechada
  var d = recPerfil || {};
  if(k === 'run') return d.best ? (d.pos_geral ? '#' + d.pos_geral + ' · ' : '') + recNum(d.best) : '—';
  if(k === 'sora'){ var m = typeof twRankData !== 'undefined' && Number.isSafeInteger(twRankData.mine) ? twRankData.mine : 0; return m ? recNum(m) + ' m' : '—'; }
  if(k === 'karaoke'){ var u = typeof twRankData !== 'undefined' ? twRankData.ktUsados : null; return u == null ? '—' : Math.min(5, u) + '/5'; }
  if(k === 'hand'){ var h = recMaiorLocal('hand'); return h ? recNum(h) : '—'; }
  if(k === 'cafe'){ var c = recMaiorLocal('cafe'); return c ? recNum(c) : '—'; }
  return '';
}
function recCorpo(k){
  var d = recPerfil || {}, h = '';
  var precisaConta = '<p class="recvazio">🔒 ' + escHtml(tr('Entre com Google para ver os seus recordes online.')) + '</p>';
  if(k === 'run'){
    if(!contaJ) return precisaConta;
    if(!recPerfil) return '<p class="recvazio">' + escHtml(tr('Carregando...')) + '</p>';
    if(d.pos_geral) h += '<p class="perfpos-geral"><span class="perfpos">#' + d.pos_geral + '</span> ' + escHtml(tr('no ranking geral')) + ' · ' + escHtml(tr('Recorde')) + ' <b>' + recNum(d.best) + '</b></p>';
    var pp = {}; Object.keys(d.por_personagem || {}).forEach(function(n){ var nn = n === 'Você' ? 'Idol' : n; pp[nn] = Math.max(pp[nn] || 0, +d.por_personagem[n] || 0); });
    var ks = Object.keys(pp); if(ks.length) h += '<div class="perfchips">' + ks.map(function(n){ return '<span>' + escHtml(n) + ' · <b>' + pp[n] + '</b></span>'; }).join('') + '</div>';
    if(typeof perfUltimas === 'function'){
      h += '<h4 class="perfsub">🕒 ' + escHtml(tr('Últimas 5 corridas')) + '</h4><ol class="lb perfult">' + perfUltimas(d.ultimas || [], d.admin_ver) + '</ol>';
      if(d.melhores && d.melhores.length) h += '<h4 class="perfsub">🏆 ' + escHtml(tr('5 melhores corridas')) + '</h4><ol class="lb perfult">' + perfUltimas(d.melhores, d.admin_ver) + '</ol>';
    }
    return h;
  }
  if(k === 'sora'){
    if(!contaJ) return precisaConta;
    h += '<p id="twSoraWeekScore"></p>';   // preenchido por twRankRenderProfile (mesmo texto que ficava no perfil)
    var s = recSora || {};
    if(typeof perfSoraListas === 'function') h += perfSoraListas(s.ultimas || [], s.melhores || []);
    return h;
  }
  if(k === 'karaoke'){
    if(!contaJ) return precisaConta;
    var u = typeof twRankData !== 'undefined' ? twRankData.ktUsados : null, tk = typeof twRankData !== 'undefined' ? twRankData.ktTickets : null;
    h += '<div class="recnums"><span><b>' + (u == null ? '—' : Math.min(5, u) + '/5') + '</b><small>' + escHtml(tr('Shows de hoje')) + '</small></span><span><b>' + (tk == null ? '—' : recNum(tk)) + '</b><small>' + escHtml(tr('Tickets extras')) + '</small></span></div>';
    return h + '<p class="recdica">' + escHtml(tr('O ranking da semana fica no 🎤 do banner.')) + '</p>';
  }
  if(k === 'hand'){
    var conq = typeof conqTem === 'function' && conqTem('jogo_memoria');
    return '<div class="recnums"><span><b>' + recResumo('hand') + '</b><small>' + escHtml(tr('Recorde')) + '</small></span><span><b>' + (conq ? '🤝' : '🔒') + '</b><small>' + escHtml(tr('Memória de fã')) + '</small></span></div>' +
      recHistoricoHtml('hand') + '<p class="recdica">' + escHtml(tr('Salvo neste aparelho')) + '</p>';
  }
  if(k === 'cafe'){
    var rec = recLocal('tw_cafe_receitas') || {}, nr = Object.keys(rec).length;
    var c1 = typeof conqTem === 'function' && conqTem('jogo_barista'), c2 = typeof conqTem === 'function' && conqTem('jogo_caderno');
    return '<div class="recnums"><span><b>' + recResumo('cafe') + '</b><small>' + escHtml(tr('Recorde')) + '</small></span><span><b>' + nr + '/20</b><small>' + escHtml(tr('Caderno do café')) + '</small></span>' +
      '<span><b>' + (c1 ? '🧋' : '🔒') + (c2 ? '📒' : '🔒') + '</b><small>' + escHtml(tr('Insígnias')) + '</small></span></div>' + recHistoricoHtml('cafe') + '<p class="recdica">' + escHtml(tr('Salvo neste aparelho')) + '</p>';
  }
  return '';
}
function recUI(){
  var box = $('hubRec'); if(!box) return;
  var h = '<h2>🏅 ' + escHtml(tr('Meus recordes')) + ' <small class="tw-hubgame-jp" lang="ja">マイレコード</small></h2><div class="recabas" role="tablist">' +
    REC_ABAS.map(function(a){ var on = recAba === a[0];
      return '<button type="button" class="recaba' + (on ? ' on' : '') + '" role="tab" aria-selected="' + on + '" aria-expanded="' + on + '" data-rec="' + a[0] + '"><i>' + a[1] + '</i><b translate="no">' + a[2] + '</b><small>' + escHtml(recResumo(a[0])) + '</small></button>';
    }).join('') + '</div>';
  if(recAba) h += '<div class="reccorpo" role="tabpanel">' + recCorpo(recAba) + '</div>';
  box.innerHTML = h;
  if(recAba === 'sora' && typeof twRankRenderProfile === 'function') twRankRenderProfile();
}
function recClique(e){
  var b = e.target.closest && e.target.closest('[data-rec]'); if(!b) return;
  recAba = recAba === b.dataset.rec ? '' : b.dataset.rec;
  if(typeof sfx !== 'undefined' && sfx.card) try{ sfx.card(); }catch(x){}
  recUI();
}
