/* 🏅 Meus recordes — seção da tela de início, logo depois dos Jogos.
   Abas lado a lado (uma aberta por vez, como sanfona) com os recordes pessoais de cada jogo.
   Center⭐Run! e Sora⭐Jump! vêm do servidor (os mesmos dados que antes ficavam no seu perfil);
   Karaoke vem do quadro semanal já carregado; Handshake e Happy Cafe ficam no aparelho. */
var recAba = '', recPerfil = null, recSora = null, recCarregando = false;
var REC_ABAS = [['run', '🏁', 'Center⭐Run!'], ['sora', '☁️', 'Sora⭐Jump!'], ['karaoke', '🎤', 'Karaoke⭐Time!'], ['hand', '🤝', 'Handshake⭐Event!'], ['cafe', '🧋', 'Happy⭐Cafe!']];
function recLocal(k){ try{ return JSON.parse(localStorage.getItem(k)); }catch(e){ return null; } }
function recNum(v){ return (+v || 0).toLocaleString('pt-BR'); }
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
  if(k === 'hand'){ var h = +recLocal('tw_handshake_recorde') || 0; return h ? recNum(h) : '—'; }
  if(k === 'cafe'){ var c = +recLocal('tw_cafe_recorde') || 0; return c ? recNum(c) : '—'; }
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
      '<p class="recdica">' + escHtml(tr('Salvo neste aparelho')) + '</p>';
  }
  if(k === 'cafe'){
    var rec = recLocal('tw_cafe_receitas') || {}, nr = Object.keys(rec).length;
    var c1 = typeof conqTem === 'function' && conqTem('jogo_barista'), c2 = typeof conqTem === 'function' && conqTem('jogo_caderno');
    return '<div class="recnums"><span><b>' + recResumo('cafe') + '</b><small>' + escHtml(tr('Recorde')) + '</small></span><span><b>' + nr + '/20</b><small>' + escHtml(tr('Caderno do café')) + '</small></span>' +
      '<span><b>' + (c1 ? '🧋' : '🔒') + (c2 ? '📒' : '🔒') + '</b><small>' + escHtml(tr('Insígnias')) + '</small></span></div><p class="recdica">' + escHtml(tr('Salvo neste aparelho')) + '</p>';
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
