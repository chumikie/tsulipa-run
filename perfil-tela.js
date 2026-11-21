//←perfGrupoCodigo
function perfGrupoCodigo(d){ return d && d.grupo || 'BRS48'; }
//←perfGrupo
function perfGrupo(g){ return PERF_GRUPOS.find(function(x){return x.codigo===g;}) || PERF_GRUPOS[0]; }
//←perfEstiloChip
function perfEstiloChip(d){   // emoji + time ao lado do nome
  var g=perfGrupo(perfGrupoCodigo(d)), t=d&&g.times.find(function(x){return x.codigo===d.time;}), h = '';
  if(d && d.emoji) h += '<span class="perfemo" aria-hidden="true">' + escHtml(d.emoji) + '</span>';
  if(d)h += '<span class="perftime" style="background:#efe4ff;color:#2c1a5e">' + perfGrupoBandeira(g) + ' ' + escHtml(g.nome) + '</span>';
  if(t) h += '<span class="perftime" style="background:' + t.cor + ';color:' + perfCorTexto(t.cor) + '">' + escHtml(t.nome) + '</span>';
  return h;
}
//←perfLogo
function perfLogo(){ return '<span class="perflogo" translate="no">TsuLiPa<i>⭐</i>World</span>'; }
//←perfAniverHtml
function perfAniverHtml(d){
  var a = /^\d\d-\d\d$/.test(d.aniver || '') ? d.aniver.split('-') : ['', ''], trava = !!d.aniver_livre;
  var dias = '<option value="">' + escHtml(tr('Dia')) + '</option>', meses = '<option value="">' + escHtml(tr('Mês')) + '</option>';
  for(var i = 1; i <= 31; i++) dias += '<option value="' + i + '"' + (+a[1] === i ? ' selected' : '') + '>' + i + '</option>';
  PERF_MESES.forEach(function(m, i){ meses += '<option value="' + (i + 1) + '"' + (+a[0] === i + 1 ? ' selected' : '') + '>' + escHtml(tr(m)) + '</option>'; });
  return '<label>🎂 ' + escHtml(tr('Aniversário')) + ' <span class="perfaniv-sel"><select id="perfAnivDia"' + (trava ? ' disabled' : '') + '>' + dias + '</select><select id="perfAnivMes"' + (trava ? ' disabled' : '') + '>' + meses + '</select></span></label>' +
    '<small class="perfaniv-nota">' + escHtml(tr(trava ? 'Dá para trocar de novo em {data}.' : 'Só dia e mês, sem o ano. No seu dia, seu perfil vira festa! Dá para trocar 1 vez por ano.')).replace('{data}', escHtml(perfData(d.aniver_livre))) +
      ' ' + escHtml(({pt:'O dia aparece no Calendário do jogo para todo mundo.',en:'The day shows in the game Calendar for everyone.',es:'El día aparece en el Calendario del juego para todos.',id:'Tanggalnya tampil di Kalender game untuk semua orang.',th:'วันนี้จะแสดงในปฏิทินของเกมให้ทุกคนเห็น',ja:'日付はゲームのカレンダーにみんなに表示されます。'})[typeof LANG === 'string' ? LANG : 'pt'] || '') + '</small>';
}
//←perfMontar
function perfMontar(){
  var d = perfAtual, meu = perfMeu, h = '';
  perfBestConta = Math.max(+d.best || 0, meu ? best : 0);
  var ri = rankOf(perfBestConta), rk = RANKS[ri], os = PERF_OSHI[d.oshi];
  if(meu){
    perfDono = Array.isArray(d.visuais) ? d.visuais.slice() : [];
    perfLojaSincronizar();
    if(!perfGenAv){
      var a = d.avatar && !d.avatar.auto ? d.avatar : {};
      perfGenAv = perfAvAtual({ visual: typeof a.visual === 'string' ? a.visual : '', pose: typeof a.pose === 'string' ? a.pose : 'v', expr: a.expr === undefined ? 2 : +a.expr, fundo: typeof a.fundo === 'string' ? a.fundo : 'basico', pet: perfPetDoAvatar(a) });
    }
  }
  var desde = d.desde ? escHtml(tr('No {logo} desde {data}')).replace('{logo}', perfLogo()).replace('{data}', escHtml(perfData(d.desde))) : '';
  var cora = '<span class="perfcora" id="perfCora">💖 <b>' + (+d.coracoes || 0) + '</b></span>';
  if(!meu) cora = '<button type="button" class="perfcora" id="perfCora"' + (d.dei_coracao ? ' aria-pressed="true"' : '') + ' title="' + escHtml(tr(d.dei_coracao ? 'Você deu um coração hoje!' : 'Dar coração')) + '">' + (d.dei_coracao ? '💖' : '🤍') + ' <b>' + (+d.coracoes || 0) + '</b></button>';
  var heroBg = os ? ' style="background:linear-gradient(120deg,' + perfRgba(os[2], .26) + ',rgba(255,111,181,.14) 55%,' + perfRgba(os[2], .14) + ')"' : '';
  h += '<div class="perfhero"' + heroBg + '><i class="perfbr b1">✦</i><i class="perfbr b2">♡</i><i class="perfbr b3">✧</i><i class="perfbr b4">✦</i>' +
       '<div class="perffotocol"><button type="button" class="perffotow" id="perfFotoBtn" title="' + escHtml(tr('Toque na foto para ver inteira')) + '" aria-label="' + escHtml(tr('Toque na foto para ver inteira')) + '"><canvas id="perfFoto" width="240" height="240"></canvas><span class="perfselo">' + PERF_RANK_EMO[ri] + '</span></button>' + cora + '</div>' +
       '<div class="perfid"><b class="perfnm"' + (/^#[0-9a-f]{6}$/i.test(d.cor || '') ? ' style="color:' + d.cor + '"' : '') + '>' + escHtml(d.nick) + '</b>' + perfEstiloChip(d) + '<span class="perfrk">' + escHtml(tr(rk[1])) + '</span>' +
       (os ? '<span class="perfoshi" style="background:' + os[2] + ';color:' + perfCorTexto(os[2]) + '">推し ' + os[0] + ' ' + escHtml(tr(os[1])) + '</span>' : '') +
       '<small>' + escHtml(tr('Recorde')) + ': <b>' + (+d.best || 0) + '</b></small>' + (desde ? '<small>' + desde + '</small>' : '') +
       (d.frase ? '<q class="perffrase">' + escHtml(d.frase) + '</q>' : '<em class="perfkao">' + escHtml(PERF_KAO[Math.floor(Math.random() * PERF_KAO.length)]) + '</em>') + '</div></div>' +
       (d.aniver_hoje ? '<div class="perfaniv"><span class="perfaniv-c" aria-hidden="true">🎉</span><b>🎂 ' + escHtml(meu ? tr('Feliz aniversário! Hoje o seu perfil está em festa 🎉') : tr('Hoje é aniversário de {nick}! Deixe um recado 💌').replace('{nick}', d.nick)) + '</b>' + (meu ? '<small>' + escHtml(tr('Que o seu novo ciclo seja cheio de brilho, música e muitos Centers! ✨')) + '</small>' : '') + '<span class="perfaniv-c d" aria-hidden="true">🎊</span></div>' : '') +
       (!meu && contaJ && d.duo_on !== false ? '<div class="btns perfduo"><button type="button" class="btn duobtn" id="perfDuo">🌙 <span translate="no">Moon⭐Duo!</span></button></div>' : '');
  if(meu) h += '<div class="perftabs" role="tablist">' + [['perfil', '💖', 'Perfil'], ['montar', '✏️', 'Montar Idol'], ['estudio', '📸', 'Estúdio']].concat(d.admin ? [['moderacao', '🛡️', 'Moderação']] : []).map(function(t){
    return '<button type="button" role="tab" data-aba="' + t[0] + '" aria-pressed="' + (perfAba === t[0]) + '">' + t[1] + ' ' + escHtml(tr(t[2])) + '</button>'; }).join('') + '</div>';
  if(!meu && d.admin_ver) h += admBarraHtml(d);   // só a moderação vê
  if(meu && d.bloqueado) h += '<p class="perfmsg admaviso">⛔ ' + escHtml(tr('Sua conta está bloqueada pela moderação.')) + '</p>';
  h += '<p class="perfmsg" id="perfTopoMsg" hidden></p><div id="perfAbaCorpo"></div>';
  h += '<div class="btns" style="margin-top:14px"><button type="button" class="btn alt" id="perfVoltar">' + escHtml(tr('VOLTAR')) + '</button></div>';
  $('perfCorpo').innerHTML = h;
  if(window.TW_PESSOAL) try{ window.TW_PESSOAL.vitrineMontar(d, meu); }catch(e){}   // vitrine do perfil (tw-pessoal.js)
  if(window.TW_CONQ) try{ window.TW_CONQ.perfilMontar(d, meu); }catch(e){}   // destaques e conquistas à vista (tw-conquistas.js)
  $('perfVoltar').onclick = perfFechar;
  $('perfFotoBtn').onclick = function(){ perfZoom = !perfZoom; perfFotoAtual(); beep(perfZoom ? 784 : 988, .05, 'triangle', .04); };
  if(!meu) $('perfCora').onclick = perfDarCoracao;
  if($('perfDuo')) $('perfDuo').onclick = function(){ var n = perfAtual && perfAtual.nick; if(n && typeof duoAbrir === 'function') duoAbrir(n); };
  perfFotoAtual();
  perfAbaMostrar();
}
//←perfAbaMostrar
function perfAbaMostrar(){
  var box = $('perfAbaCorpo'), d = perfAtual, meu = perfMeu, h = '';
  [].forEach.call(document.querySelectorAll('#perfCorpo .perftabs button'), function(b){ b.setAttribute('aria-pressed', b.dataset.aba === perfAba); });
  if(meu && perfAba === 'moderacao'){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; admPainel(); return; }
  if(!meu || perfAba === 'perfil'){
    if(meu){
      h += '<div class="perfnums"><div class="n1"><b>★ ' + starT + '</b><small>' + escHtml(tr('Estrelas')) + '</small></div>' +
           '<div class="n2"><b>' + (+d.corridas || 0) + '</b><small>' + escHtml(tr('Corridas')) + '</small></div>' +
           '<div class="n3"><b>' + (+d.centers || 0) + '</b><small>' + escHtml(tr('Centers')) + '</small></div></div>';
      h += '<section id="ktTicketInventory" class="tw-rank-profile"><h3>🎟️ Karaoke⭐Time!</h3></section>';
      var perfilTemEmoji = !!String(d.emoji || '').trim();
      var perfilTemCor = /^#[0-9a-f]{6}$/i.test(d.cor || '');
      if(!perfilTemEmoji || !perfilTemCor){
        h += '<aside class="perfprofile-nudge" role="status"><strong>✨ ' + escHtml(tr('Seu perfil pode ficar ainda mais com a sua cara!')) + '</strong><p>' + escHtml(tr('Escolha um emoji e uma cor para personalizar sua identidade no TsuLiPa⭐World.')) + '</p><button type="button" class="btn" id="perfProfileStyleCta">🎨 ' + escHtml(tr('Preencher agora')) + '</button></aside>';
      }
    }
    h += '<h3>🏆 ' + escHtml(tr('Estante de troféus')) + '</h3>' + perfInsHtml(d.insignias || [], meu);
    h += '<h3>📔 ' + escHtml(tr('Diário de carreira')) + '</h3>' + perfDiarioHtml(d, meu);
    if(typeof cardsHtml === 'function') h += '<h3>🃏 ' + escHtml(tr('Últimos cards do Star⭐Gacha!')) + '</h3>' + cardsHtml(d.cards || [], 'perfCards', meu);
    // Center Run: posição geral, recorde por personagem e últimas corridas
    if(!meu){   // no próprio perfil, esses recordes ficam em 🏅 Meus recordes, na tela de início
    h += '<h3>🏁 ' + escHtml(tr('Center Run')) + '</h3>';
    if(d.pos_geral) h += '<p class="perfpos-geral"><span class="perfpos">#' + d.pos_geral + '</span> ' + escHtml(tr('no ranking geral')) + ' · ' + escHtml(tr('Recorde')) + ' <b>' + (+d.best || 0) + '</b></p>';
    if(meu){
      var pp = {}, ks;
      Object.keys(d.por_personagem || {}).forEach(function(k){ var n = k === 'Você' ? 'Idol' : k; pp[n] = Math.max(pp[n] || 0, +d.por_personagem[k] || 0); });   // "Você" = nome antigo do Idol
      ks = Object.keys(pp);
      if(ks.length) h += '<div class="perfchips">' + ks.map(function(k){ return '<span>' + escHtml(k) + ' · <b>' + pp[k] + '</b></span>'; }).join('') + '</div>';
    }
    h += '<h4 class="perfsub">🕒 ' + escHtml(tr('Últimas 5 corridas')) + '</h4><ol class="lb perfult">' + perfUltimas(d.ultimas || [], d.admin_ver) + '</ol>';
    if(d.melhores && d.melhores.length) h += '<h4 class="perfsub">🏆 ' + escHtml(tr('5 melhores corridas')) + '</h4><ol class="lb perfult">' + perfUltimas(d.melhores, d.admin_ver) + '</ol>';
    } else h += '<p class="perfrecaviso">🏅 ' + escHtml(tr('Seus recordes do Center⭐Run!, Sora⭐Jump! e dos outros jogos agora ficam em Meus recordes, na tela de início.')) + '</p>';
    h += '<h3>🎮 ' + escHtml(tr('Minijogos do camarim')) + '</h3><div class="perfmini" id="perfMini">' + (meu ? '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>' : '') + '</div>';
    h += '<h3>🐾 ' + escHtml(tr('Pets')) + '</h3><div class="perfpets" id="perfPets"></div>';
    h += '<h3>💌 ' + escHtml(tr('Recados')) + '</h3>' + perfRecadosHtml(d, meu);
    if(meu) h += perfBioHtml(d) + perfApagarHtml();
    box.innerHTML = h;
    if(window.TW_CONQ) try{ window.TW_CONQ.abaPerfil(d, meu); }catch(e){}   // "Quase lá" e perfil completo, acima da estante
    var profileStyleCta = $('perfProfileStyleCta');
    if(profileStyleCta) profileStyleCta.onclick = function(){
      var target = $('perfBioEmoji') || $('perfBioCor');
      if(!target) return;
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(target.scrollIntoView) target.scrollIntoView({ behavior:reduce?'auto':'smooth', block:'center' });
      try{ target.focus({ preventScroll:true }); }catch(e){ target.focus(); }
    };
    if(meu){ twRankRenderProfile(); twRankLoad(); perfSoraHistNuvem(); if(window.ktTickets){window.ktTickets.renderProfile();window.ktTickets.refresh();} }
    if(typeof cardsDesenhar === 'function') cardsDesenhar(d.cards || [], 'perfCards');
    perfPets(d, meu);
    if(meu) perfMiniCarregar(); else perfMiniUI(null, d.mini || {});
  } else {
    h += '<canvas id="perfGenCv" width="560" height="560" aria-hidden="true"></canvas>';
    if(perfAba === 'montar') h += '<p class="perfdica">' + escHtml(tr('Tudo o que você muda aqui vale para o Idol do jogo.')) + '</p><div class="cust perfmont" id="perfMont"></div><div class="btns"><button type="button" class="btn alt" id="perfLook">💾 ' + escHtml(tr('Salvar look')) + '</button></div><p class="perfmsg" id="perfLookMsg" hidden></p>' +
      '<h3>🛍️ ' + escHtml(tr('Lojinha de roupas')) + '</h3><p class="perfdica">' + escHtml(tr('Roupas que só existem aqui. Depois de comprar, aparecem em Roupa no montador (para todas as personagens).')) + '</p><p class="perfmsg" id="perfLojaMsg" hidden></p><div class="perfloja" id="perfLoja"></div>' +
      '<h3>🎀 ' + escHtml(tr('Acessórios')) + '</h3><p class="perfdica">' + escHtml(tr('Use seus acessórios comprados no montador do Idol.')) + '</p><div class="perfloja" id="perfLojaAcessorios"></div>' +
      '<h3>🍞 ' + escHtml(tr('Itens')) + '</h3><div class="perfloja" id="perfLojaItens"></div>' +
      '<h3>🛍️ ' + escHtml(tr('Lojinha de poses e extras')) + '</h3><p class="perfdica">' + escHtml(tr('Poses e expressões valem para o Estúdio e para a câmera do jogo. Os extras do Moon⭐Duo! liberam cenas e cenários.')) + '</p><p class="perfmsg" id="perfLoja2Msg" hidden></p><div class="perfloja" id="perfLoja2"></div>';
    else h += '<p class="perfmsg" id="perfGenMsg" hidden></p><div class="btns perfbtns" id="perfGenBtns"></div><div class="petph perfopts" id="perfGenOpts"></div>';
    box.innerHTML = h;
    if(perfAba === 'montar'){ perfMontUI(); perfLojaUI(); if(typeof perfLoja2UI === 'function') perfLoja2UI(); } else perfGenUI();
    perfAnimLigar();
  }
}
//←perfSoraHist
function perfSoraHist(){
  var g = null;
  try{
    var ls = window.localStorage, r = ls.getItem('__tsulipa_sorajump_test_v1__::brs48cr_hist');
    if(!r || r === '__TW_TEST_DELETED__') r = ls.getItem('brs48cr_hist');
    var d = JSON.parse(r || 'null'); g = d && d.games && d.games.sora_jump;
  }catch(e){}
  return '<div id="perfSoraHist">' + (g ? perfSoraListas(g.last5, g.best5) : '') + '</div>';
}
//←perfSoraHistNuvem
function perfSoraHistNuvem(){
  if(!contaJ || typeof contaRpc !== 'function') return;
  contaRpc('sora_my_profile').then(function(d){
    var box = $('perfSoraHist');
    if(box && d && Array.isArray(d.ultimas) && d.ultimas.length) box.innerHTML = perfSoraListas(d.ultimas, d.melhores);
  }).catch(function(){});
}
//←perfInsNv
function perfInsNv(tem, k){ var n = 0; (tem || []).forEach(function(x){ var p = String(x).split(':'); if(p[0] === k) n = Math.max(n, +p[1] || 1); }); return n; }
//←perfInsHtml
function perfInsHtml(tem, meu){
  if(meu && typeof conqLista === 'function') tem = (tem || []).concat(conqLista());   // conquistas dos jogos novos guardadas no aparelho
  perfInsTem = tem || [];
  var tmA = typeof temaAtual === 'function' ? temaAtual() : '';
  var lista = PERF_INS.filter(function(i){ return perfInsNv(tem, i[0]) > 0 || (meu && (!/^(tema_|esp_)/.test(i[0]) || i[0] === 'tema_' + tmA)); });
  // As insígnias sazonais ficam no fim da estante, inclusive quando conquistadas.
  var sazonais = lista.filter(function(i){ return i[0].indexOf('tema_') === 0; });
  lista = lista.filter(function(i){ return i[0].indexOf('tema_') !== 0; }).concat(sazonais);
  if(!lista.length) return '<p class="perfcarr">✧</p>';
  var ganhos = lista.filter(function(i){ return perfInsNv(tem, i[0]) > 0; }).length;
  return '<p class="perfestconta"><b>' + ganhos + '</b> / ' + lista.length + ' ' + escHtml(tr('troféus na estante')) + '</p>' +
    '<div class="perfins perfestante" id="perfIns">' + lista.map(function(i){
    var nv = perfInsNv(tem, i[0]), ok = nv > 0;
    return '<button type="button" class="perfin' + (ok ? ' ok' : '') + '" data-ins="' + i[0] + '" aria-pressed="' + (perfInsSel === i[0]) + '" title="' + escHtml(tr(i[2])) + '"><span>' + (ok ? i[1] : '🔒') + '</span>' + (nv > 1 ? '<i class="perfnv">' + '★★★'.slice(0, nv) + '</i>' : '') + '</button>';
  }).join('') + '</div><p class="perfinsdesc" id="perfInsDesc"' + (perfInsSel ? '' : ' hidden') + '></p>';
}
//←perfDarCoracao
function perfDarCoracao(){
  var b = $('perfCora'), d = perfAtual;
  if(!contaJ){ perfTopoMsg(tr('Entre com Google para dar coração e deixar recados.')); return; }
  if(d.dei_coracao){ perfTopoMsg('💖 ' + tr('Você deu um coração hoje!')); return; }
  b.disabled = true;
  contaRpc('dar_coracao', { p_nick: d.nick }).then(function(r){
    b.disabled = false;
    if(r && r.ok === false && PERF_REC_ERRO[r.erro]){ perfTopoMsg(tr(PERF_REC_ERRO[r.erro])); return; }   // bloqueado pela moderação
    d.dei_coracao = true; if(r && typeof r.total === 'number') d.coracoes = r.total;
    if(r && r.ok === true && typeof hubAgendaSocialConfirmar === 'function') hubAgendaSocialConfirmar('coracao');
    b.innerHTML = '💖 <b>' + (+d.coracoes || 0) + '</b>'; b.setAttribute('aria-pressed', 'true');
    perfChuvaCoracoes(b);
    perfTopoMsg('💖 ' + tr('Você deu um coração hoje!'));
    if(typeof insConferir === 'function') insConferir();
    [1047, 1319, 1568].forEach(function(f, i){ beep(f, .12, 'sine', .04, i * .07); });
  }).catch(function(){ b.disabled = false; perfTopoMsg(tr('Não deu para falar com o servidor. Tente de novo.')); });
}
//←perfRecadosHtml
function perfRecadosHtml(d, meu){
  var L = Array.isArray(d.recados) ? d.recados : [], h = '';
  if(!meu){
    if(!d.recados_on) h += '<p class="perfcarr">' + escHtml(tr('Essa pessoa não está recebendo recados.')) + '</p>';
    else if(!contaJ) h += '<p class="perfcarr">' + escHtml(tr('Entre com Google para dar coração e deixar recados.')) + '</p>';
    else if(d.recado_hoje) h += '<p class="perfcarr">💌 ' + escHtml(tr('Você já deixou um recado hoje para essa pessoa.')) + '</p>';
    else h += '<div class="perfrecform"><input class="nick perfcampo" id="perfRecTxt" maxlength="60" autocomplete="off" placeholder="' + escHtml(tr('Deixe um recado (até 60 letras)')) + '"><button type="button" class="btn" id="perfRecOk">💌 ' + escHtml(tr('Enviar')) + '</button></div>';
  }
  h += '<p class="perfmsg" id="perfRecMsg" hidden></p>';
  h += L.length ? '<ul class="perfrecs">' + L.map(function(r){
    return '<li><div><button type="button" class="lbn" data-nick="' + escHtml(r.nick) + '">' + escHtml(r.nick) + '</button> <small>' + escHtml(perfData(r.created_at)) + '</small></div><p>' + escHtml(r.texto) + '</p>' +
           (r.pode_apagar || d.admin_ver ? '<button type="button" class="perfrecx" data-id="' + (+r.id) + '"' + (!r.pode_apagar ? ' data-adm="1"' : '') + ' aria-label="✕">✕</button>' : '') + '</li>';
  }).join('') + '</ul>' : '<p class="perfcarr">' + escHtml(tr('Nenhum recado ainda.')) + '</p>';
  if(meu) h += '<label class="perfrecon"><input type="checkbox" id="perfRecOn"' + (d.recados_on !== false ? ' checked' : '') + '> ' + escHtml(tr('Aceitar recados')) + '</label>' +
    '<label class="perfrecon"><input type="checkbox" id="perfDuoOn"' + (d.duo_on !== false ? ' checked' : '') + '> 🌙 ' + escHtml(tr('Aparecer no Moon⭐Duo! e nos outdoors do Center Run')) + '</label>';
  return h;
}
//←perfBioHtml
function perfBioHtml(d){
  var cur = d.oshi || '';
  if(PERF_OSHI_JOG && PERF_OSHI_JOG.length){   // só quem joga, agrupado pelo time
    var grupos = [];
    PERF_GRUPOS.forEach(function(g){g.times.forEach(function(t){grupos.push([g.codigo,t.codigo,perfGrupoBandeira(g)+' '+g.nome+' · '+t.nome]);});grupos.push([g.codigo,'',perfGrupoBandeira(g)+' '+g.nome+' · '+tr('Sem time')]);});
    var meuK = perfSlug(d.nick || '');
    var opts = '<option value=""' + (cur ? '' : ' selected') + '>' + escHtml(tr('Sem oshi')) + '</option>' +
      '<option value="tsulipa"' + (cur === 'tsulipa' ? ' selected' : '') + '>🎤🐨👑 ' + escHtml(tr('Trio TsuLiPa')) + '</option>';
    grupos.forEach(function(gp){
      var L = PERF_OSHI_JOG.filter(function(p){ return perfGrupoCodigo(p)===gp[0] && (p.time||'')===gp[1] && perfSlug(p.nick)!==meuK; });
      if(!L.length) return;
      opts += '<optgroup label="' + escHtml(gp[2]) + '">' + L.map(function(p){
        var k = perfSlug(p.nick), o = PERF_OSHI[k] || ['⭐'];
        return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + escHtml(o[0]) + ' ' + escHtml(p.nick) + '</option>'; }).join('') + '</optgroup>';
    });
    if(cur && cur !== 'tsulipa' && !PERF_OSHI_JOG.some(function(p){ return perfSlug(p.nick) === cur; }) && PERF_OSHI[cur])
      opts += '<option value="' + escHtml(cur) + '" selected>' + escHtml(PERF_OSHI[cur][0] + ' ' + PERF_OSHI[cur][1]) + '</option>';
    return perfBioMontar(d, opts);
  }
  var sel2 = '<option value=""' + (cur ? '' : ' selected') + '>' + escHtml(tr('Sem oshi')) + '</option>' + PERF_OSHI_TIMES.map(function(t){
    return '<optgroup label="' + escHtml(tr(t[0])) + '">' + t[1].map(function(m){
      var k = perfOshiKey(m[0]);
      return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + m[1] + ' ' + escHtml(tr(m[0])) + '</option>'; }).join('') + '</optgroup>';
  }).join('');
  return perfBioMontar(d, sel2);
}
//←perfBioMontar
function perfBioMontar(d, sel2){
  var tm = d.time || '', grupo=perfGrupoCodigo(d), cor = /^#[0-9a-f]{6}$/i.test(d.cor || '') ? d.cor : '#ff6fb5';
  return '<div class="perfbio"><h3>✏️ ' + escHtml(tr('Editar perfil')) + '</h3>' +
    '<label>' + escHtml(tr('Seu emoji')) + ' <input class="nick perfcampo perfemoin" id="perfBioEmoji" maxlength="8" autocomplete="off" value="' + escHtml(d.emoji || '') + '" placeholder="🎤"></label>' +
    '<div class="perfemolist" role="group" aria-label="' + escHtml(tr('Seu emoji')) + '">' + PERF_EMOJIS.map(function(e){ return '<button type="button" data-pemo="' + e + '">' + e + '</button>'; }).join('') + '</div>' +
    '<label>' + escHtml(tr('Sua cor')) + ' <input type="color" id="perfBioCor" value="' + cor + '"></label>' +
    '<label>🌏 ' + escHtml(tr('Grupo')) + ' <select id="perfBioGrupo">' + PERF_GRUPOS.map(function(g){return '<option value="'+escHtml(g.codigo)+'"'+(grupo===g.codigo?' selected':'')+'>'+perfGrupoBandeira(g)+' '+escHtml(g.nome)+'</option>';}).join('')+'</select></label>' +
    '<label>' + escHtml(tr('Seu time')) + ' <select id="perfBioTime"><option value="">' + escHtml(tr('Sem time')) + '</option>' +
      perfGrupo(grupo).times.map(function(t){return '<option value="'+escHtml(t.codigo)+'"'+(t.codigo===tm?' selected':'')+'>'+escHtml(t.nome)+'</option>';}).join('')+'</select></label>' +
    '<label>' + escHtml(tr('Oshi')) + ' <select id="perfBioOshi">' + sel2 + '</select></label>' +
    '<label>' + escHtml(tr('Frase do perfil')) + ' <input class="nick perfcampo" id="perfBioFrase" maxlength="60" autocomplete="off" placeholder="✨ ' + escHtml(tr('Escreva uma frase fofa (até 60 letras)')) + '" value="' + escHtml(d.frase || '') + '"></label>' +
    perfAniverHtml(d) + '<p class="perfmsg" id="perfBioMsg" hidden></p><div class="btns"><button type="button" class="btn" id="perfBioOk">' + escHtml(tr('Salvar')) + '</button></div></div>';
}
//←perfPets
// Pets: os seus (do aparelho, os mais atuais) ou os da pessoa (resumo vindo do servidor)
function perfPets(d, meu){
  var box = $('perfPets'), lista = [], ativo = '';
  if(meu && petData && petData.pets){
    ativo = petData.ativo;
    (petData.donos || Object.keys(petData.pets)).forEach(function(k){ var p = petData.pets[k]; if(p) lista.push({ k:k, nome:p.nome, xp:p.xp, cfg:p.cfg, acc:p.acc, bochecha:p.bochecha }); });
  } else if(meu && d.pets && d.pets.pets){
    ativo = d.pets.ativo || '';
    Object.keys(d.pets.pets).forEach(function(k){ var p = d.pets.pets[k] || {}; lista.push({ k:k, nome:p.nome, xp:p.xp, acc:p.acc, cfg:p.cfg }); });
  } else if(!meu && Array.isArray(d.pets)){
    ativo = d.ativo || '';
    lista = d.pets.map(function(p){ return { k:p.k, nome:p.nome, xp:p.xp, acc:p.acc, cfg:p.cfg }; });
  }
  lista = lista.filter(function(p){ return PET_SP[p.k]; });
  if(!lista.length){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Nenhum pet ainda.')) + '</p>'; return; }
  box.innerHTML = '';
  lista.forEach(function(p, i){
    var st = PET_STAGES[petStage({ xp: +p.xp || 0 })];
    var el = document.createElement('div'); el.className = 'perfpet' + (p.k === ativo ? ' on' : ''); el.style.animationDelay = (i * .35) + 's';
    var cv = document.createElement('canvas'); cv.width = 144; cv.height = 120; el.appendChild(cv);
    el.insertAdjacentHTML('beforeend', '<b>' + escHtml(p.nome || PET_SP[p.k].n) + '</b><small>' + st[2] + ' ' + escHtml(tr(st[1])) + (p.k === ativo ? ' · ⭐' : '') + '</small>');
    box.appendChild(el);
    perfDesenharPetEm(cv.getContext('2d'), perfPetDoAvatar({ pet:p }) || { k:p.k }, 72, 64, 2.6);
  });
}
//←perfMiniCarregar
function perfMiniCarregar(){
  var box = $('perfMini');
  perfConferir(); var envio = perfSync.hasPending(contaJ && contaJ.nick) ? perfEnviar() : Promise.resolve();   // aguarda a confirmação do save antes de perguntar o ranking
  envio.then(function(){ return contaRpc('ranking_minijogos'); }).then(function(r){ if(box.isConnected) perfMiniUI(r || {}, (perfAtual && perfAtual.mini) || {}); })
       .catch(function(){ if(box.isConnected) perfMiniUI({}, (perfAtual && perfAtual.mini) || {}); });
}
//←perfMiniUI
function perfMiniUI(r, resumo){   // r: ranking completo (seu perfil) · resumo: pontos e posição (perfil de outra pessoa)
  var loc = perfMeu ? ((petData && petData.mini && petData.mini.rec) || {}) : {};
  $('perfMini').innerHTML = [['ritmo', '🎵', 'Ritmo'], ['corda', '🪢', 'Pular corda']].map(function(j){
    var R = (r && r[j[0]]) || {}, S = (resumo && resumo[j[0]]) || {};
    var pts = Math.max(+loc[j[0]] || 0, +R.meu || 0, +S.pts || 0), posN = R.pos || S.pos, tot = R.total || S.total || 0, top = Array.isArray(R.top) ? R.top : [];
    var pos = posN ? '<span class="perfpos">#' + posN + ' <small>' + escHtml(tr('de')) + ' ' + tot + '</small></span>' : '';
    var lista = !r ? '' : top.length ? '<ol>' + top.map(function(t, i){
      var eu = contaJ && String(t.nick).toLowerCase() === String(contaJ.nick).toLowerCase();
      return '<li' + (eu ? ' class="eu"' : '') + '><span>' + (['🥇', '🥈', '🥉'][i] || (i + 1) + '.') + ' ' + escHtml(t.nick) + '</span><b>' + (+t.pts || 0) + '</b></li>'; }).join('') + '</ol>'
      : '<p class="perfcarr">' + escHtml(tr('Ninguém jogou ainda.')) + '</p>';
    return '<div class="perfjogo"><div class="perfjtop"><b>' + j[1] + ' ' + escHtml(tr(j[2])) + '</b>' + pos + '</div>' +
           '<small>' + escHtml(tr(perfMeu ? 'Seu recorde' : 'Recorde')) + ': <b>🏆 ' + pts + '</b></small>' + lista + '</div>';
  }).join('');
}
//←perfVisInfo
function perfVisInfo(k){ for(var i = 0; i < PERF_VIS.length; i++) if(PERF_VIS[i][0] === k) return PERF_VIS[i]; return PERF_VIS[0]; }
//←perfFundoInfo
function perfFundoInfo(k){ if(k==='cafe')return ['cafe','☕','Café kawaii',90]; for(var i = 0; i < PERF_FUNDOS.length; i++) if(PERF_FUNDOS[i][0] === k) return PERF_FUNDOS[i]; return PERF_FUNDOS[0]; }
//←perfFaltando
function perfFaltando(){   // o que está escolhido e ainda não foi comprado: [chave no servidor, emoji + nome, preço]
  var av = perfGenAv, L = [];
  if(!perfTem('visual', av.visual)){ var v = perfVisInfo(av.visual); L.push([v[0], perfRot(v), v[3]]); }
  if(!perfTem('pose', av.pose)){ var p = perfPoseInfo(av.pose); L.push(['pose_' + p[0], perfRot(p), p[3]]); }
  if(!perfTem('fundo', av.fundo)){ var f = perfFundoInfo(av.fundo); L.push([f[0]==='cafe'?'duo_cafe':'fundo_' + f[0], perfRot(f), f[3]]); }
  if(!perfTem('expr', av.expr) && typeof lojaItem === 'function'){ var ei = lojaItem('expr_' + av.expr); if(ei) L.push([ei[0], ei[1] + ' ' + tr(ei[2]), ei[3]]); }
  return L;
}
//←perfPetsDono
function perfPetsDono(){   // pets que você tem (para aparecer na foto)
  if(!petData || !petData.pets) return [];
  return (petData.donos || Object.keys(petData.pets)).filter(function(k){ return petData.pets[k] && PET_SP[k]; });
}
//←perfGenUI
function perfGenUI(){
  var av = perfGenAv;
  function grp(label, campo, lista, cur){
    return '<div><span>' + escHtml(tr(label)) + '</span>' + lista.map(function(o){
      var extra = '', preco = campo === 'visual' || campo === 'pose' || campo === 'fundo' ? o[3] : (campo === 'expr' && typeof lojaItem === 'function' && lojaItem('expr_' + o[0])) ? lojaItem('expr_' + o[0])[3] : 0;
      if(preco && !perfTem(campo, o[0])) extra = ' <em>★' + preco + '</em>';
      else if(preco) extra = ' ✓';
      return '<button type="button" data-f="' + campo + '" data-v="' + escHtml(o[0]) + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + escHtml(perfRot(o)) + extra + '</button>';
    }).join('') + '</div>';
  }
  var vis = PERF_VIS.filter(function(o){ return perfBestConta >= o[4]; });
  var exprs = PET_PH_EXPRS.filter(function(o){ return o[0] !== ''; });
  var pets = [['', '🚫', 'Sem pet']].concat(perfPetsDono().map(function(k){ var p = petData.pets[k]; return [k, PET_SP[k].emo, p.nome || PET_SP[k].n]; }));
  if(av.pet && perfPetsDono().indexOf(av.pet.k) < 0) av.pet = null;
  $('perfGenOpts').innerHTML = grp('Visual', 'visual', vis, av.visual) + grp('Pose', 'pose', PERF_POSES, av.pose) + grp('Expressão', 'expr', exprs, String(av.expr)) +
    grp('Fundo', 'fundo', PERF_FUNDOS.filter(function(o){ return o[0] !== 'temporada' || temaPerfil(); }).concat([['cafe','☕','Café kawaii',90]]), av.fundo) + (pets.length > 1 ? grp('Pet na foto', 'pet', pets, av.pet ? av.pet.k : '') : '');
  var b = $('perfGenBtns'), m = $('perfGenMsg'), falta = perfFaltando();
  if(!falta.length){
    b.innerHTML = '<a class="btn" id="perfPng" download="tsulipa-idol.png" href="#">⬇️ ' + escHtml(tr('Baixar PNG')) + '</a><button type="button" class="btn alt" id="perfUsar">🖼️ ' + escHtml(tr('Usar como foto do perfil')) + '</button>';
    m.hidden = true;
  } else {
    b.innerHTML = falta.map(function(f){
      if(/^(pose|expr)_/.test(f[0])) return '<button type="button" class="btn alt" data-irloja="1">🛍️ ' + escHtml(tr('Na lojinha')) + ': ' + escHtml(f[1]) + ' ★' + f[2] + '</button>';   // poses e expressões só se compram na lojinha
      return '<button type="button" class="btn perfcompra" data-k="' + escHtml(f[0]) + '"' + (starT < f[2] ? ' disabled' : '') + '>' + escHtml(tr('Comprar')) + ' ' + escHtml(f[1]) + ' ★' + f[2] + '</button>'; }).join('');
    var soma = falta.reduce(function(s, f){ return s + f[2]; }, 0);
    m.textContent = tr('Prévia: compre o que está marcado com ★ para baixar e usar.') + (starT < soma ? ' (★ ' + starT + ')' : '');
    m.hidden = false;
  }
  perfGenDesenhar();
  if(!falta.length){
    $('perfPng').onclick = function(){ this.href = perfPng(); this.download = 'tsulipa-idol-' + String(perfAtual.nick).replace(/[^\w-]+/g, '') + '.png'; };   // a foto só é gerada aqui
    $('perfUsar').onclick = perfUsarFoto;
  }
}
//←perfAnimar
// O estúdio e o montador são uma cena animada (como o menu e o camarim), redesenhada a cada 2 quadros
function perfAnimar(ms){
  perfAnimId = 0;
  if(!perfMeu || (perfAba !== 'montar' && perfAba !== 'estudio') || !twAnimacaoVisivel($('perfGenCv'))) return;
  var mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30()),delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta($('perfGenCv'),ms):1,perfPrevT=perfT;perfT+=delta;
  if((mobile30&&TWMotionLifecycle.render30Due($('perfGenCv'),ms))||(!mobile30&&Math.floor((perfT+1e-6)/2)>Math.floor((perfPrevT+1e-6)/2))) perfGenDesenhar();
  perfAnimId = requestAnimationFrame(perfAnimar);
}
//←perfAnimLigar
function perfAnimLigar(){ if(!perfAnimId) perfAnimId = requestAnimationFrame(perfAnimar); }
//←perfGenCharAtual
function perfGenCharAtual(){
  var c=PERF_GEN_DRAW_CHAR;
  for(var i=0;i<PERF_CAMPOS.length;i++){var f=PERF_CAMPOS[i];c[f]=CU[f];}
  c.img=c.hair;
  return c;
}
//←perfGenTemFaltando
function perfGenTemFaltando(){
  var av=perfGenAv;
  if(!perfTem('visual',av.visual))return true;
  if(!perfTem('pose',av.pose))return true;
  if(!perfTem('fundo',av.fundo))return true;
  return !perfTem('expr',av.expr)&&typeof lojaItem==='function'&&!!lojaItem('expr_'+av.expr);
}
//←perfGenDesenhar
function perfGenDesenhar(){
  var cv=$('perfGenCv');if(!cv||!perfGenAv)return;
  var base=perfGenCharAtual(),av=perfGenAv,prev=false;
  av.c=base;av.a=accSel||'';
  if(perfAba==='montar'){
    av=PERF_GEN_DRAW_AV;av.c=base;av.a=accSel||'';av.visual='';av.pose='v';av.expr=2;av.fundo='basico';
    if(perfProva){
      var preview=PERF_GEN_PREVIEW_CHAR;
      for(var i=0;i<PERF_CAMPOS.length;i++){var f=PERF_CAMPOS[i];preview[f]=base[f];}
      preview.img=base.img;preview.out=perfProva;
      av.c=preview;prev=!perfLojaTem(perfProva);
    }
  }else prev=perfGenTemFaltando();
  var x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);
  if(perfMinhaCor){
    var colorAv=PERF_GEN_COLOR_AV;colorAv.c=av.c;colorAv.a=av.a;colorAv.visual=av.visual||'';colorAv.pose=av.pose||'v';colorAv.expr=av.expr;colorAv.fundo=av.fundo;colorAv.pet=av.pet||null;colorAv.cor=perfMinhaCor;av=colorAv;
  }
  perfDesenharIdol(x,cv.width,cv.height,av,true,false,perfT+1);
  if(prev){
    var u=cv.width/320;
    x.save();x.translate(14*u,14*u);
    x.fillStyle='rgba(123,63,240,.85)';x.beginPath();x.roundRect?x.roundRect(0,0,92*u,24*u,12*u):x.rect(0,0,92*u,24*u);x.fill();
    x.fillStyle='#fff';x.font='900 '+Math.round(12*u)+'px "M PLUS Rounded 1c",sans-serif';x.textBaseline='middle';x.textAlign='center';
    x.fillText('★ '+tr('PRÉVIA'),46*u,12.5*u);x.restore();
  }
}
//←perfPng
function perfPng(){
  var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 1024;
  var x = cv.getContext('2d');
  perfGenAv.c = perfAvAtual().c; perfGenAv.a = accSel || '';
  perfDesenharIdol(x, 1024, 1024, perfGenAv, true);
  if(perfGenAv.fundo){   // assinatura discreta (só com fundo)
    x.font = '800 26px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'right'; x.fillStyle = 'rgba(255,255,255,.85)';
    x.shadowColor = 'rgba(30,10,60,.6)'; x.shadowBlur = 6;
    x.fillText(perfAtual.nick + ' · TsuLiPa⭐World', 1000, 1004);
  }
  return perfGenAv.fundo ? (window.twMarcaPng?window.twMarcaPng(cv):cv.toDataURL('image/png')) : cv.toDataURL('image/png');   // com fundo: selo do site; transparente fica limpo
}
//←perfComprar
function perfComprar(k, btn){
  var pedido=perfPedido;
  btn.disabled = true;
  contaRpc('comprar_visual', { p_key:k }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); }
    if(perfOv.hidden||pedido!==perfPedido)return;
    var m = $('perfGenMsg');
    if(!r || !r.ok){
      m.hidden = false;
      m.textContent = r && r.erro === 'rank' ? tr('Alcance esse rank para comprar.') : r && r.erro === 'saldo' ? tr('Estrelas insuficientes') : tr('Não deu para falar com o servidor. Tente de novo.');
      btn.disabled = false; if(sfx.hit) sfx.hit(); return;
    }
    perfDono = Array.isArray(r.visuais) ? r.visuais : perfDono.concat(k);
    if(sfx.rank) sfx.rank();
    perfGenUI();
    m = $('perfGenMsg'); m.textContent = '✨ ' + tr('Comprado!'); m.hidden = false;
  }).catch(function(){ if(perfOv.hidden||pedido!==perfPedido)return;btn.disabled = false; var m = $('perfGenMsg'); m.textContent = tr('Não deu para falar com o servidor. Tente de novo.'); m.hidden = false; });
}
//←perfUsarFoto
function perfUsarFoto(){
  var pedido=perfPedido;
  var g2 = perfGenAv, av = perfAvAtual({ visual: g2.visual, pose: g2.pose, expr: g2.expr, fundo: g2.fundo || 'basico', pet: g2.pet || null });
  var btn = $('perfUsar'); btn.disabled = true;
  perfConferir();
  (av.pet ? perfEnviar() : Promise.resolve()).then(function(){ return contaRpc('salvar_avatar', { p_avatar: av }); }).then(function(r){   // com pet: a nuvem precisa saber que o pet é seu
    if(r&&r.ok){perfMeuAv=av;perfIconeConta();}
    if(perfOv.hidden||pedido!==perfPedido)return;
    btn.disabled = false;
    var m = $('perfGenMsg'); m.hidden = false;
    if(r && r.ok){ perfAtual.avatar = av; perfFotoAtual(); m.textContent = '🖼️ ' + tr('Foto do perfil atualizada!'); if(sfx.card) sfx.card(); }
    else m.textContent = tr({ visual_nao_comprado:'Esse visual ainda não foi comprado.', fundo_nao_comprado:'Esse fundo ainda não foi comprado.', pose_nao_comprada:'Essa pose ainda não foi comprada.', roupa_nao_comprada:'Essa roupa ainda não foi comprada.', pet:'Esse pet ainda não chegou na nuvem. Tente de novo em alguns segundos.' }[r && r.erro] || 'Não deu para falar com o servidor. Tente de novo.');
  }).catch(function(){ if(!perfOv.hidden&&pedido===perfPedido)btn.disabled = false; });
}
//←perfDiarioHojeHtml

// Diário de carreira: linha do tempo de marcos, montada com o que o perfil já traz (e, no próprio perfil,
// com o que fica no aparelho: receitas do Happy⭐Cafe!, recorde do Handshake e conquistas dos jogos novos).
// Resumo transitório da Agenda: somente missões já confirmadas no Hub, nunca um marco salvo.
function perfDiarioHojeHtml(meu){
  if(!meu || typeof contaJ === 'undefined' || !contaJ || typeof hubMisDados === 'undefined' || !Array.isArray(hubMisDados)) return '';
  var validas = hubMisDados.filter(function(m){ return m && +m.meta > 0; });
  if(!validas.length) return '';
  var feitas = validas.filter(function(m){ return !!m.feito || (+m.prog >= +m.meta); });
  var chaveFoco = typeof hubAgendaFocoAtual === 'function' ? hubAgendaFocoAtual() : '';
  var foco = chaveFoco && validas.find(function(m){ return m.k === chaveFoco; });
  var pedidoFoco = chaveFoco === 'pedido_fa' && typeof hubAgendaPedidoFa === 'function' ? hubAgendaPedidoFa() : null;
  var focoTxt = {pt:'Em foco',en:'In focus',es:'En foco',id:'Fokus',th:'เป้าหมาย',ja:'目標'};
  var destaque = '';
  if(foco){
    var tf = foco.k === 'collect' && typeof hubCollectHoje === 'function' ? hubCollectHoje() : (typeof HUB_MIS !== 'undefined' && HUB_MIS[foco.k]) || ['🎯','Missões do dia'];
    var total = Math.max(1, +foco.meta || 1), feito = Math.min(total, Math.max(0, +foco.prog || 0));
    destaque = '<li>📌 ' + escHtml(focoTxt[LANG] || focoTxt.pt) + ': ' + escHtml(tf[0] + ' ' + tr(tf[1]).replace('{n}', foco.meta)) + ' · ' + (foco.feito ? '✓' : feito + '/' + total) + '</li>';
  }
  if(pedidoFoco){
    var estadoPedido = !pedidoFoco.carregado ? '' : pedidoFoco.feito ? ' · ✓' :
      ' · ' + Math.min(pedidoFoco.meta, pedidoFoco.prog) + '/' + pedidoFoco.meta;
    destaque = '<li>📌 ' + escHtml(focoTxt[LANG] || focoTxt.pt) + ': 💌 ' + escHtml(pedidoFoco.titulo) + estadoPedido + '</li>';
  }
  var nomes = feitas.filter(function(m){ return !foco || m.k !== foco.k; }).slice(0, 2).map(function(m){
    var t = m.k === 'collect' && typeof hubCollectHoje === 'function' ? hubCollectHoje() : (typeof HUB_MIS !== 'undefined' && HUB_MIS[m.k]) || ['🎯','Missões do dia'];
    return '<li>' + escHtml(t[0] + ' ' + tr(t[1]).replace('{n}', m.meta)) + '</li>';
  }).join('');
  return '<section class="perfdiario-hoje"><div class="perfdiario-hoje-top"><b>🌸 ' + escHtml(tr('Hoje')) + ' · ' + escHtml(tr('Missões do dia')) + '</b><em>' + feitas.length + '/' + validas.length + '</em></div>' +
    (destaque || nomes ? '<ul>' + destaque + nomes + '</ul>' : '') + '</section>';
}
//←perfDiarioHtml
function perfDiarioHtml(d, meu){
  var itens = [], n = function(v){ return (+v || 0).toLocaleString('pt-BR'); };
  if(d.desde) itens.push(['🌱', tr('Estreia no TsuLiPa⭐World'), String(d.desde).slice(0, 10).split('-').reverse().join('/')]);
  var c = +d.corridas || 0;
  [1, 10, 50, 100, 500, 1000].forEach(function(m){ if(c >= m) itens.push(['🏃', m === 1 ? tr('Primeira corrida no Center⭐Run!') : tr('{n} corridas no Center⭐Run!').replace('{n}', n(m)), '']); });
  var ce = +d.centers || 0;
  if(ce >= 1) itens.push(['👑', tr('Primeiro Center!'), '']);
  [10, 50, 100].forEach(function(m){ if(ce >= m) itens.push(['👑', tr('{n} Centers').replace('{n}', n(m)), '']); });
  if(+d.best > 0) itens.push(['🏆', tr('Recorde no Center⭐Run!'), n(d.best) + ' ' + tr('pts')]);
  var ins = (d.insignias || []).concat(meu && typeof conqLista === 'function' ? conqLista() : []);
  var nomes = {}; PERF_INS.forEach(function(i){ nomes[i[0]] = i; });
  ins.forEach(function(x){ var k = String(x).split(':')[0], i = nomes[k]; if(i) itens.push([i[1], tr('Insígnia: {n}').replace('{n}', tr(i[2])), '']); });
  if(+d.coracoes > 0) itens.push(['💖', tr('Corações recebidos'), n(d.coracoes)]);
  if(meu){
    try{ var rec = JSON.parse(localStorage.getItem('tw_cafe_receitas')) || {}, nr = Object.keys(rec).length; if(nr) itens.push(['📒', tr('Receitas no Caderno do Happy⭐Cafe!'), nr + '/20']); }catch(e){}
    try{ var rc = +localStorage.getItem('tw_cafe_recorde') || 0; if(rc) itens.push(['🧋', tr('Recorde no Happy⭐Cafe!'), n(rc) + ' ' + tr('pts')]); }catch(e){}
    try{ var rh = +localStorage.getItem('tw_handshake_recorde') || 0; if(rh) itens.push(['🤝', tr('Recorde no Handshake⭐Event!'), n(rh) + ' ' + tr('pts')]); }catch(e){}
  }
  var hoje = perfDiarioHojeHtml(meu);
  // Memórias da visita: só aparecem no próprio perfil, nunca são salvas no Diário.
  var memoria = meu && window.TWVidaCidade ? window.TWVidaCidade.diarioHtml() : '';
  if(!itens.length) return hoje + memoria + '<p class="perfcarr">' + escHtml(tr('A sua história começa na primeira corrida!')) + '</p>';
  return hoje + memoria + '<ol class="perfdiario">' + itens.map(function(i){ return '<li><span class="pdemo">' + i[0] + '</span><b>' + escHtml(i[1]) + '</b>' + (i[2] ? '<small>' + escHtml(i[2]) + '</small>' : '') + '</li>'; }).join('') + '</ol>';
}
