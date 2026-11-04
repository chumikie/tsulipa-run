/* Conta — login com Google, caixa de login do menu, carregar/importar a conta, estrelas e ranking conferidos no
   servidor, modo teste com parceiras e apagar a conta (LGPD).
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, consolidação), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que guarda o estado
   da conta (contaJ, _supabase…) e liga os eventos na mesma ordem de antes. */
var contaJ = null, contaRun = null, contaPronta = false;
// Cor escolhida no perfil (salvar_estilo). O lightstick usa ela; sem cor, usa a do cabelo.
var perfMinhaCor = '';
function perfGuardarCor(c){
  perfMinhaCor = /^#[0-9a-f]{6}$/i.test(c || '') ? String(c).toLowerCase() : '';
  try{ if(perfMinhaCor) localStorage.setItem('brs48cr_cor', perfMinhaCor); else localStorage.removeItem('brs48cr_cor'); }catch(e){}
}
function contaRpc(nome, args){
  if(!_supabase) return Promise.reject(new Error('sem_supabase'));
  return _supabase.rpc(nome, args || {}).then(function(r){ if(r.error) throw r.error; return r.data; });
}
function contaSiteOk(){ return /^https?:$/.test(location.protocol) && !/claude|anthropic|usercontent/i.test(location.hostname); }
function contaUI(){
  if(typeof idolChipNome === 'function') idolChipNome();
  if(typeof hubLoginCtaUI==='function') hubLoginCtaUI();
  var box = $('contaBox'); if(!box) return;
  var nIn = $('nick');
  if(contaJ){
    box.innerHTML = '<span class="conta-ok">☁️ <b>' + escHtml(contaJ.nick) + '</b></span><button type="button" class="conta-perfil" id="contaPerfil"><canvas id="contaAv" width="64" height="64" aria-hidden="true"></canvas>' + escHtml(tr('Perfil')) + '</button><button type="button" class="conta-sair" id="contaSair">' + escHtml(tr('Sair')) + '</button>';
    $('contaPerfil').onclick = function(e){ e.stopPropagation(); perfAbrir(); };   // V2.1.3: o rostinho do Idol abre o perfil
    perfIconeConta();
    if(nIn){ nIn.value = contaJ.nick; nIn.disabled = true; nIn.classList.remove('chamativo'); }
    $('contaSair').onclick = function(e){ e.stopPropagation(); contaSair(); };
  } else {
    box.innerHTML = '<button type="button" class="conta-google" id="contaEntrar">' +
      '<svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true"><path fill="#4285F4" d="M45 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.9 6.5-9.6 6.5-16.1z"/><path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.1 15.5 46 24 46z"/><path fill="#FBBC05" d="M11.8 28.2c-.4-1.3-.7-2.7-.7-4.2s.3-2.9.7-4.2v-5.7H4.5C3 17.1 2 20.4 2 24s1 6.9 2.5 9.9l7.3-5.7z"/><path fill="#EA4335" d="M24 10.8c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.9 4.5 14.1l7.3 5.7c1.7-5.2 6.5-9 12.2-9z"/></svg>' +
      '<span>' + escHtml(tr('Entrar com Google')) + '</span></button><small class="conta-dica">' + escHtml(tr('Opcional: guarda suas estrelas na nuvem e libera o ranking online.')) + ' <a href="privacidade.html" target="_blank" rel="noopener">🔐 ' + escHtml(tr('Privacidade e segurança')) + '</a></small>';
    if(nIn) nIn.disabled = false;
    $('contaEntrar').onclick = function(e){ e.stopPropagation(); contaEntrar(); };
  }
}
function contaEntrar(){
  if(!_supabase || !contaSiteOk()){ contaAviso(tr('O login funciona no site do jogo (GitHub ou Netlify), não neste arquivo.')); return; }
  _supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo: location.origin + location.pathname } });
}
function contaSair(){
  contaSessaoToken++;contaAuthUserId='';
  if(_supabase) _supabase.auth.signOut();
  contaJ = null; contaRun = null; perfGuardarCor(''); contaUI();
  if(window.ktTickets)window.ktTickets.reset();
  perfSair();   // V2.1.3
}
function contaAviso(t){
  var nm = $('nickMsg'); if(!nm) return;
  nm.textContent = t; nm.hidden = false; clearTimeout(nm._t);
  nm._t = setTimeout(function(){ nm.hidden = true; nm.textContent = tr('✨ Digite seu nome de Idol! ✨'); }, 4500);
}
function contaSessao(sess){
  contaAuthPronta=true;
  var userId=sess&&sess.user&&sess.user.id?String(sess.user.id):'';
  if(userId===contaAuthUserId)return;
  contaAuthUserId=userId;
  var token=++contaSessaoToken;
  if(typeof perfConf!=='undefined'&&perfConf)perfConf.hidden=true;
  if(contaJ){contaJ=null;contaRun=null;nick='';contaUI();perfSair();if(window.ktTickets)window.ktTickets.reset();}
  if(!sess){if(contaJ){contaJ=null;contaUI();perfSair();}if(window.ktTickets)window.ktTickets.reset();return;}
  contaRpc('jogador').then(function(j){
    if(token!==contaSessaoToken)return;
    if(contaJ&&(!j||contaJ.nick!==j.nick)){
      contaJ=null;contaRun=null;nick='';contaUI();perfSair();
      if(window.ktTickets)window.ktTickets.reset();
    }
    if(j)perfAntesDeEntrar(j,token);
    else contaPedirNome(token);
  }).catch(function(){if(token===contaSessaoToken)contaAviso(tr('Não deu para falar com o servidor. Tente de novo.'));});
}
function contaAplicar(j, token, semRecuperar){
  if(token!==undefined&&token!==contaSessaoToken)return;
  contaJ = j;
  starT = j.stars;
  if(j.best > best){ best = j.best; try{ localStorage.setItem('brs48cr_best', best); }catch(e){} }
  nick = j.nick;
  try{ localStorage.setItem('brs48cr_st', starT); localStorage.setItem('brs48cr_nick', nick); }catch(e){}
  setBest(); contaUI();
  if(window.ktTickets)window.ktTickets.refresh();
  if(typeof s2SyncProfile === 'function') s2SyncProfile();
  if(typeof petUI === 'function' && petOpen) petUI();
  perfAoEntrar();   // V2.1.3: nuvem + presente da conta
  if(typeof duoAvisoAgendar==='function')duoAvisoAgendar();
  if(!semRecuperar)contaRecuperarCorridas();
}
function contaPedirNome(token){
  token=token===undefined?contaSessaoToken:token;
  $('contaTit').textContent = '✨ ' + tr('Escolha seu nome de Idol');
  $('contaTxt').textContent = tr('Ele aparece no ranking e não pode ser igual ao de outra pessoa.');
  $('contaOk').textContent = tr('CONFIRMAR');
  $('contaNome').value = nick || ''; $('contaErro').hidden = true;
  contaOv.hidden = false; twTimeoutVisivel(contaOv,function(){return !contaOv.hidden;},function(){var input=$('contaNome');if(input)input.focus();},50);
}
function contaInicioCorrida(){
  contaRun = null;
  if(!contaJ || isTestGame) return;
  contaRecuperarCorridas();
  function semInicio(){
    if(typeof toast==='string'){toast=tr('Corrida sem autorização do servidor');toastT=180;}
    return null;
  }
  contaRun = contaRpc('iniciar_corrida').then(function(id){return id||semInicio();},semInicio);
  if(typeof gachaBonus === 'function') gachaBonus();   // V2.1.3
}
// Id da sessão autenticada quando o perfil não expõe a coluna id.
// Preserva a identidade usada nos registros antigos se jogador().id existir.
function contaCorridaDono(){
  if(!contaJ)return '';
  if(contaJ.id)return String(contaJ.id);
  return typeof contaAuthUserId==='string'?contaAuthUserId:'';
}
// Recupera a mesma corrida autorizada pelo servidor, inclusive após fechar/reabrir a página.
// O UUID permanece o mesmo: a RPC impede dupla finalização e mantém o limite de 100 estrelas.
var contaCorridasKey='brs48cr_corridas_pendentes_v1';
var contaCorridasMemoria=[],contaCorridaEnviando=false,contaCorridaAvisos={};
function contaCorridasLer(){
  var a=contaCorridasMemoria;
  try{var salvo=localStorage.getItem(contaCorridasKey);if(salvo!==null)a=JSON.parse(salvo);}catch(e){}
  if(!Array.isArray(a))return [];
  var agora=Date.now();
  return a.filter(function(p){return p&&typeof p.owner==='string'&&typeof p.id==='string'&&p.id.length>0&&p.id.length<100&&
    Number.isInteger(p.score)&&p.score>=0&&p.score<=300000&&Number.isInteger(p.stars)&&p.stars>=0&&
    typeof p.char==='string'&&typeof p.at==='number'&&p.at<=agora+60000&&agora-p.at<7200000;});
}
function contaCorridasGuardar(a){
  contaCorridasMemoria=a;
  try{localStorage.setItem(contaCorridasKey,JSON.stringify(a));}catch(e){}
}
function contaCorridaRetirar(p){
  contaCorridasGuardar(contaCorridasLer().filter(function(x){return x.owner!==p.owner||x.id!==p.id;}));
}
function contaRecuperarCorridas(preferida){
  if(contaCorridaEnviando||!contaJ)return;
  var owner=contaCorridaDono(),sessao=contaSessaoToken;
  if(!owner)return;
  // A corrida recém-finalizada deve seguir ao servidor mesmo se o armazenamento local
  // estiver indisponível ou devolver uma versão antiga da fila.
  var p=(preferida&&preferida.owner===owner?preferida:null)||contaCorridasLer().find(function(x){return x.owner===owner;});
  if(!p)return;
  var definitiva=false,feedback=contaCorridaAvisos[p.id];
  function mesmaConta(){return !!(contaJ&&contaCorridaDono()===owner&&contaSessaoToken===sessao);}
  function atualizar(msg){if(feedback){feedback.aviso(msg);try{feedback.refresh();}catch(e){}}}
  contaCorridaEnviando=true;
  contaUltimaRun={id:p.id,ok:false};
  contaRpc('terminar_corrida',{p_run:p.id,p_score:p.score,p_stars:p.stars,p_char:p.char,p_device:did}).then(function(r){
    if(!mesmaConta())return;
    if(!r||r.ok!==true){
      // Rejeição definitiva, inclusive UUID já encerrado: nunca reenvia nem concede moedas.
      if(r&&r.ok===false){contaCorridaRetirar(p);definitiva=true;}
      throw Error(r&&r.erro||'corrida_nao_confirmada');
    }
    contaCorridaRetirar(p);definitiva=true;
    if(typeof r.stars==='number'){starT=r.stars;try{localStorage.setItem('brs48cr_st',starT);}catch(e){}setBest();}
    if(typeof r.best==='number'&&r.best>best){best=r.best;try{localStorage.setItem('brs48cr_best',best);}catch(e){}setBest();}
    atualizar(r.limite_diario===true?
      (r.creditadas>0?String(r.creditadas)+' '+tr('estrelas')+' · ':'')+tr('Limite diário do Center⭐Run! atingido (100 estrelas)'):
      String(r.creditadas||0)+' '+tr('estrelas'));
    contaUltimaRun.ok=true;
    quartetoTalvez();hubAposCorrida();
    if(!feedback&&typeof showLb==='function'){try{showLb($('lbo'));}catch(e){}}
  }).catch(function(err){
    if(!mesmaConta())return;
    if(typeof console!=='undefined'&&console.error)console.error('Center⭐Run!: falha ao confirmar corrida online',err&&err.message||err);
    var pendente=!definitiva;
    // Uma resposta perdida pode ter sido gravada. Consulta o saldo antes de informar.
    return contaRpc('jogador').then(function(j){
      if(!mesmaConta())return;
      if(j&&typeof j.stars==='number')contaAplicar(j,sessao,true);
      atualizar(pendente?tr('Resultado pendente de sincronização · tente ao reconectar'):
        tr('Saldo conferido na nuvem; corrida não confirmada.'));
    }).catch(function(){
      if(mesmaConta())atualizar(pendente?tr('Resultado pendente de sincronização'):tr('Recompensa não validada'));
    });
  }).finally(function(){
    contaCorridaEnviando=false;
    if(definitiva)delete contaCorridaAvisos[p.id];
    // Processa pendências restantes somente após confirmação ou rejeição definitiva.
    if(definitiva&&mesmaConta())contaRecuperarCorridas();
  });
}
function contaFimCorrida(score, est, ch, refresh){
  var owner=contaCorridaDono(),sessao=contaSessaoToken,campo=$('cr-recompensa');
  function mesmaConta(){return !!(owner&&contaJ&&contaCorridaDono()===owner&&contaSessaoToken===sessao);}
  function aviso(msg){
    var rr=$('res'),aguardando=tr('Aguardando validação do servidor');
    if(campo&&campo.isConnected!==false)campo.textContent=msg;
    else if(rr&&rr.innerHTML.includes(aguardando))rr.innerHTML=rr.innerHTML.replace(aguardando,msg);
  }
  if(!mesmaConta()||!contaRun){
    aviso(tr('Recompensa não validada')+' · '+tr('Corrida sem autorização do servidor'));
    refresh();return;
  }
  var run=contaRun;contaRun=null;
  run.then(function(id){
    if(!mesmaConta())return;
    if(typeof id!=='string'||!id)throw Error('inicio_nao_validado');
    var p={owner:String(owner),id:id,score:Math.floor(score),stars:Math.max(0,Math.floor(est)),char:String(ch||'').slice(0,12),at:Date.now()};
    var fila=contaCorridasLer();
    if(!fila.some(function(x){return x.owner===p.owner&&x.id===p.id;}))fila.push(p);
    contaCorridasGuardar(fila);
    contaCorridaAvisos[id]={aviso:aviso,refresh:refresh};
    contaRecuperarCorridas(p);
  }).catch(function(err){
    if(mesmaConta()){if(typeof console!=='undefined'&&console.error)console.error('Center⭐Run!: autorização da corrida indisponível',err&&err.message||err);aviso(tr('Corrida sem autorização do servidor'));refresh();}
  });
}
if(typeof window!=='undefined'&&window.addEventListener){
  window.addEventListener('online',contaRecuperarCorridas);
  window.addEventListener('pageshow',contaRecuperarCorridas);
}
if(typeof document!=='undefined'&&document.addEventListener){
  document.addEventListener('visibilitychange',function(){if(!document.hidden)contaRecuperarCorridas();});
}
function contaGasto(qtd, motivo){   // compra no camarim: desconta na hora e confirma no servidor
  if(!contaJ || qtd <= 0) return;
  contaRpc('gastar_estrelas', { p_qtd:qtd, p_motivo:motivo || 'camarim' }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); if(petOpen) petUI(); }
  }).catch(function(){});
}
function contaGanhoMini(qtd){
  if(!contaJ || qtd <= 0) return;
  contaRpc('ganhar_minijogo', { p_qtd:qtd }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); if(petOpen) petUI(); }
  }).catch(function(){});
}
function contaTesteParceiras(){
  var s = $('tstP'); if(!s || $('tstw').hidden) return;
  var n = +s.value || 0; if(!n) return;
  var op = sel === 0 ? [1, 2] : sel === 1 ? [0, 2] : sel === 2 ? [0, 1] : [0, 1, 2];
  window.collectedPartners = op.slice(0, n);
}
// Moldura do SALVAR IMAGEM: borda na cor do Oshi, estrelinhas nos cantos e a data
function petShareMoldura(x, W2, H2){
  var oc = petPhCor(), loc = { pt:'pt-BR', en:'en-US', es:'es-ES', th:'th-TH', ja:'ja-JP' }[LANG] || 'pt-BR';
  x.save(); x.shadowBlur = 0;
  x.strokeStyle = oc; x.lineWidth = 8; x.globalAlpha = .9;
  x.beginPath(); x.roundRect ? x.roundRect(8, 8, W2 - 16, H2 - 16, 22) : x.rect(8, 8, W2 - 16, H2 - 16); x.stroke();
  x.globalAlpha = .55; x.strokeStyle = '#fff'; x.lineWidth = 2;
  x.beginPath(); x.roundRect ? x.roundRect(17, 17, W2 - 34, H2 - 34, 16) : x.rect(17, 17, W2 - 34, H2 - 34); x.stroke();
  x.globalAlpha = 1; x.fillStyle = '#fff'; x.font = '900 20px sans-serif'; x.textAlign = 'center';
  [[28, 36], [W2 - 28, 36], [28, H2 - 22], [W2 - 28, H2 - 22]].forEach(function(p){ x.fillText('★', p[0], p[1]); });
  x.fillStyle = 'rgba(255,255,255,.75)'; x.font = '700 13px "M PLUS Rounded 1c",sans-serif';
  x.fillText(new Date().toLocaleDateString(loc, { day:'2-digit', month:'2-digit', year:'numeric' }), W2 / 2, H2 - 25);
  x.restore();
}
function perfApagarHtml(){
  return '<details class="perfapagar"><summary>⚠️ ' + escHtml(tr('Apagar minha conta')) + '</summary>' +
    '<p>' + escHtml(tr('Isso apaga de verdade a sua conta, o save na nuvem, as corridas do ranking, os recados e os corações. O progresso deste aparelho continua aqui.')) + '</p>' +
    '<label>' + escHtml(tr('Para confirmar, digite o seu nome de Idol:')) + ' <input class="nick perfcampo" id="perfApagarNome" maxlength="24" autocomplete="off"></label>' +
    '<p class="perfmsg" id="perfApagarMsg" hidden></p><div class="btns"><button type="button" class="btn perfperigo" id="perfApagarOk">🗑️ ' + escHtml(tr('APAGAR PARA SEMPRE')) + '</button></div>' +
    '<p class="perfdica"><a href="privacidade.html" target="_blank" rel="noopener">🔐 ' + escHtml(tr('Privacidade e segurança')) + '</a></p></details>';
}
// Para ligar: coloque aqui o Client ID PÚBLICO do Google (termina em .apps.googleusercontent.com). Vazio = login antigo.
var GOOGLE_CLIENT_ID = '781179638857-k6qcb45jh2q627gqr0qsqu57uaotmcp7.apps.googleusercontent.com';
function gisHex(buf){ return Array.prototype.map.call(new Uint8Array(buf), function(b){ return ('0' + b.toString(16)).slice(-2); }).join(''); }
function gisEntrar(){
  var raw = gisHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then(function(h){
    var hashed = gisHex(h);
    function pronto(){
      google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, nonce: hashed, ux_mode: 'popup', auto_select: false, itp_support: true,
        callback: function(resp){
          var m = $('gisMsg'); m.hidden = false; m.textContent = tr('Carregando...');
          _supabase.auth.signInWithIdToken({ provider: 'google', token: resp.credential, nonce: raw }).then(function(r){
            if(r && r.error){ m.textContent = tr('Não deu para falar com o servidor. Tente de novo.'); return; }
            gisOv.hidden = true;
          });
        } });
      $('gisTit').textContent = tr('Entrar com Google'); $('gisMsg').hidden = true; $('gisBtn').innerHTML = ''; $('gisAntigo').textContent = tr('Não funcionou? Entrar de outro jeito');
      google.accounts.id.renderButton($('gisBtn'), { type: 'standard', theme: 'outline', size: 'large', shape: 'pill', text: 'continue_with', logo_alignment: 'left' });
      gisOv.hidden = false;
    }
    if(window.google && google.accounts && google.accounts.id) return pronto();
    var s = document.createElement('script'); s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.onload = pronto;
    s.onerror = function(){ _supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: location.origin + location.pathname } }); };
    document.head.appendChild(s);
  });
}
