/* Happy⭐Cafe! — modo "Dois no balcão".
   Dois fãs esperam ao mesmo tempo, cada um com a sua paciência; há um copo só e você escolhe para quem servir.
   Liga quando dá para validar do jeito certo:
     • sem conta (treino): sempre;
     • com conta: só se o servidor tiver cafe_run_pedidos/cafe_run_etapa2
       (aplicadas em produção em 13/11; arquivo em supabase/sql/aplicado/20261113_cafe_dois_no_balcao.sql, PR #88).
   Em qualquer outro caso o Café roda exatamente como antes (um cliente por vez, cafe.js).
   Mesma pontuação, 12 pedidos, 3 vidas; cada pedido ganha +4 s de paciência porque o tempo corre para os dois. */
(function(){
  'use strict';
  if(typeof cfIniciarSeguro !== 'function' || typeof cfUI !== 'function' || typeof cfLoop !== 'function') return;
  var orig = { iniciar:cfIniciarSeguro, ui:cfUI, loop:cfLoop };
  var LADOS = [.2, .44];   // centro de cada cliente (fração da largura do canvas)

  function vazio(){ return { base:-1, cob:-1, enf:-1, doce:-1 }; }
  function esperando(){ return cf.fila.filter(function(e){ return e.estado === 'espera'; }); }
  function ladoLivre(){ var usados = cf.fila.map(function(e){ return e.lado; }); return usados.indexOf(0) < 0 ? 0 : usados.indexOf(1) < 0 ? 1 : -1; }
  function nomesUsados(){ var u = {}; cf.fila.forEach(function(e){ u[e.cli.nome] = 1; }); return u; }

  function novoFa(pedido){
    var r = hsSorteio(Date.now() + cf.criados * 131 + Math.floor(Math.random() * 997)), usados = nomesUsados();
    var livres = hsNomesLivres().filter(function(n){ return !usados[n]; });
    var f = hsFa(r, livres[Math.floor(r() * livres.length)] || 'Mimi');
    f.pedido = pedido || cfPedido(r, cf.criados);
    return f;
  }
  function entrar(f, sv, passados){
    var lado = ladoLivre(); if(lado < 0) return;
    var limite = sv ? sv.limite_segundos * 60 : Math.max(420, 900 - cf.criados * 45) + 240;
    cf.fila.push({ cli:f, sv:sv || null, lado:lado, t0:cfT - (passados || 0) * 60, limite:limite, estado:'espera', ok:false, fala:'', tR:0 });
  }
  // completa o balcão até 2 fãs (sem passar de 12 pedidos na partida)
  function preencher(){
    if(!cf || !cf.duplo || cf.buscando || cf.vidas <= 0) return;
    if(cf.modoServidor === 'novo' && cf.runId){
      cf.buscando = true; var atual = cf;
      contaRpc('cafe_run_pedidos', { p_run:atual.runId }).then(function(r){
        if(cf !== atual) return; atual.buscando = false;
        if(!(r && r.ok && Array.isArray(r.pedidos))){ virarTreino(); preencher(); return; }
        var tem = {}; atual.fila.forEach(function(e){ if(e.sv) tem[e.sv.sessao] = 1; });
        r.pedidos.forEach(function(p){ if(!tem[p.sessao] && p.pedido){ entrar(novoFa(p.pedido), p, +p.segundos_passados || 0); } });
        atual.criados = +r.criados || atual.criados;
        if(atual.fase === 'preparando') atual.fase = 'pedido';
        cfUI();
      }).catch(function(){ if(cf === atual){ atual.buscando = false; virarTreino(); preencher(); } });
      return;
    }
    while(esperando().length < 2 && cf.criados < 12 && ladoLivre() >= 0){ entrar(novoFa(), null, 0); cf.criados++; }
    if(cf.fase === 'preparando') cf.fase = 'pedido';
    cfUI();
  }
  function virarTreino(){ if(!cf) return; cf.modoServidor = 'treino'; if(cf.provaEstado !== 'confirmado') cf.provaEstado = 'sem_comprovacao'; }

  function servir(lado, saiu){
    if(!cf || !cf.duplo || cf.fase !== 'pedido') return;
    var e = cf.fila.filter(function(q){ return q.lado === lado && q.estado === 'espera'; })[0]; if(!e) return;
    var p = e.cli.pedido, m = cf.monta;
    var certo = !saiu && m.base === p.base && m.cob === p.cob && m.enf === p.enf && m.doce === p.doce;
    var resto = Math.max(0, 1 - (cfT - e.t0) / e.limite);
    cf.atendidos++;
    if(e.sv && cf.modoServidor === 'novo'){
      var atual = cf; atual.verificando = (atual.verificando || 0) + 1;
      contaRpc('cafe_run_etapa2', { p_sessao:e.sv.sessao, p_monta:{ base:m.base, cob:m.cob, enf:m.enf, doce:m.doce }, p_saiu:!!saiu }).then(function(r){
        if(cf !== atual) return; atual.verificando--;
        if(r && r.ok && r.confirmado){
          atual.pontos = +r.pontos || 0; atual.vidas = +r.vidas; atual.perfeitos = +r.perfeitos || atual.perfeitos; atual.combo = +r.combo || 0;
          if(r.certo){ atual.provaEstado = 'confirmado'; try{ localStorage.setItem('tw_cf_dia', new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10)); }catch(er){} }
          else if(atual.provaEstado !== 'confirmado') atual.provaEstado = 'sem_comprovacao';
          if(!!r.certo !== e.ok){ e.ok = !!r.certo; }
        } else virarTreino();
        cfUI();
      }).catch(function(){ if(cf === atual){ atual.verificando--; atual.provaEstado = 'pendente'; virarTreino(); cfUI(); } });
    }
    var px = LADOS[e.lado];
    if(certo){
      cf.combo++; cf.perfeitos++;
      var semana = typeof eventoAtual === 'function' && p.base === eventoAtual().base;
      if(!(e.sv && cf.modoServidor === 'novo')) cf.pontos += (semana ? 50 : 0) + Math.round((100 + resto * 100 + (p.cob >= 0 ? 30 : 0) + (p.doce >= 0 ? 40 : 0)) * (1 + Math.min(cf.combo - 1, 5) * .1));
      var rec = cfLer(CF_RECEITAS_KEY, {}), chave = p.base + '-' + p.enf;
      if(!rec[chave]){
        rec[chave] = 1; cfGravar(CF_RECEITAS_KEY, rec); cf.novas.push(cfNomeReceita(p));
        if(Object.keys(rec).length >= CF_BASES.length * CF_ENFEITES.length && typeof conqGanhar === 'function' && conqGanhar('jogo_caderno')) cf.conq.push('📒 ' + tr('Caderno completo'));
      }
      for(var k = 0; k < 6; k++) cf.hearts.push({ x:px - .05 + Math.random() * .1, y:.55, v:.004 + Math.random() * .004, t:0, e:['💖', '☕', '✨'][k % 3] });
      if(sfx && sfx.star) try{ sfx.star(); }catch(er){}
    } else {
      cf.combo = 0; if(!(e.sv && cf.modoServidor === 'novo')) cf.vidas--; else cf.vidas = Math.max(0, cf.vidas - 1);
      if(sfx && sfx.hit) try{ sfx.hit(); }catch(er){}
    }
    e.estado = 'reacao'; e.ok = certo; e.tR = cfT; e.saiu = !!saiu;
    if(!saiu) cf.monta = vazio();   // o copo foi entregue; se o fã foi embora, o copo continua para o outro
    if(typeof eventoPetReagir === 'function') eventoPetReagir('cafe', cfT, false, certo ? (cf.combo >= 3 ? 'combo' : 'acerto') : 'erro');
    cfUI();
  }

  function loopDuplo(ms){
    cfAnim = 0; if(!twAnimacaoVisivel(cfOv)) return;
    var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('cfCv'), ms) : 1; cfT += d;
    if(cf && cf.fase === 'pedido'){
      esperando().forEach(function(e){ if(cfT - e.t0 > e.limite) servir(e.lado, true); });
      cf.fila.forEach(function(e){ var bar = $('cfPac' + e.lado); if(bar && e.estado === 'espera') bar.style.width = Math.max(0, 100 - (cfT - e.t0) / e.limite * 100) + '%'; });
      var antes = cf.fila.length;
      cf.fila = cf.fila.filter(function(e){ return !(e.estado === 'reacao' && cfT - e.tR > 90); });
      if(cf.fila.length !== antes){
        if(cf.vidas <= 0){ if(!cf.verificando) cfFim(); }
        else if(cf.criados >= 12 && !esperando().length && !cf.fila.length){ if(!cf.verificando) cfFim(); }
        else { preencher(); cfUI(); }
      } else if(cf.vidas <= 0 && !cf.fila.some(function(e){ return e.estado === 'reacao'; }) && !cf.verificando) cfFim();
      else if(cf.criados >= 12 && !cf.fila.length && !cf.verificando) cfFim();
    }
    if(Math.floor(cfT / 2) !== Math.floor((cfT - d) / 2)) cfDesenhar();
    cfAnim = requestAnimationFrame(cfLoop);
  }

  function iconesPedido(p){
    return CF_BASES[p.base][0] + (p.cob >= 0 ? CF_COBERTURAS[p.cob][0] : '') + CF_ENFEITES[p.enf][0] + (p.doce >= 0 ? ' + ' + CF_DOCES[p.doce][0] : '');
  }
  function uiDuplo(){
    var corpo = $('cfCorpo'); if(!corpo || !cf) return;
    if(cf.fase !== 'pedido' && cf.fase !== 'preparando') return orig.ui();
    var h = '<div class="hsstatus"><span>⭐ ' + cf.pontos.toLocaleString('pt-BR') + '</span><span>' + '❤️'.repeat(Math.max(0, cf.vidas)) + '🤍'.repeat(Math.max(0, 3 - cf.vidas)) + '</span><span>☕ ' + cf.atendidos + '/12</span><span>👥 2</span></div>';
    if(cf.fase === 'preparando'){ corpo.innerHTML = h + '<p class="hsdica">⏳ ' + escHtml(tr('Preparando o pedido validado…')) + '</p>'; return; }
    if(cf.atendidos === 0) h += '<p class="hsdica cfduplo-dica">👥 ' + escHtml(tr('Dois no balcão! Monte o copo e escolha para quem servir. Quem está com pouca paciência vai primeiro!')) + '</p>';
    if(cf.aviso) h += '<p class="cfaviso">' + escHtml(cf.aviso) + '</p>';
    h += '<div class="cfduplo-pac">' + [0, 1].map(function(l){
      var e = cf.fila.filter(function(q){ return q.lado === l; })[0];
      return '<div class="cfduplo-p' + (e ? '' : ' vazio') + '"><small>' + (l ? '➡ ' : '⬅ ') + (e ? escHtml(e.cli.nome) : '…') + '</small><div class="hstempo"><i id="cfPac' + l + '" style="width:' + (e && e.estado === 'espera' ? 100 : 0) + '%"></i></div></div>';
    }).join('') + '</div>';
    h += cfBotoes('base', CF_BASES, '1. Base') + cfBotoes('cob', CF_COBERTURAS, '2. Cobertura (se pedir)') + cfBotoes('enf', CF_ENFEITES, '3. Enfeite') + cfBotoes('doce', CF_DOCES, 'Docinho (se pedir)');
    var pronto = cf.monta.base >= 0 && cf.monta.enf >= 0;
    h += '<div class="btns cfacoes cfduplo-acoes"><button type="button" class="btn sec" data-cf="lixo:0">🗑️ ' + escHtml(tr('Recomeçar copo')) + '</button>' + [0, 1].map(function(l){
      var e = cf.fila.filter(function(q){ return q.lado === l && q.estado === 'espera'; })[0];
      return '<button type="button" class="btn" data-cfd-servir="' + l + '"' + (!e || !pronto ? ' disabled' : '') + '>🛎️ ' + (l ? '' : '⬅ ') + escHtml(e ? e.cli.nome : tr('Servir')) + (l ? ' ➡' : '') + '</button>';
    }).join('') + '</div>';
    corpo.innerHTML = h;
  }

  // desenho (chamado pelo cfDesenhar, entre o fundo e o balcão / depois do copo)
  window.cfDuploClientes = function(x, W2, H2, t){
    cf.fila.forEach(function(e){
      var dt = t - e.t0, entra = Math.min(1, dt / 14), sai = e.estado === 'reacao' && t - e.tR > 50 ? (t - e.tR - 50) / 40 : 0;
      var gesto = e.estado === 'espera' ? (cfClienteImpaciente(e.cli, dt, e.limite, 'pedido') || cfClienteGesto(e.cli, dt, 'pedido')) : null;
      var cx = W2 * LADOS[e.lado];
      try{
        x.save(); x.translate(cx - W2 * .18 - (1 - entra) * W2 * .3 - sai * W2 * .6 + (gesto ? gesto.dx : 0), H2 * .26 + (gesto ? gesto.dy : 0));
        perfDesenharIdol(x, W2 * .36, H2 * .74, { c:e.cli.c, pose:e.estado === 'reacao' ? (e.ok ? 'coracao' : '') : gesto ? gesto.pose : e.cli.pose,
          expr:e.estado === 'reacao' && !e.ok ? 0 : gesto && gesto.expr != null ? gesto.expr : e.cli.expr, fundo:'' }, false, false, t);
        x.restore();
      }catch(er){ try{ x.restore(); }catch(z){} }
    });
  };
  window.cfDuploBaloes = function(x, W2, H2, t){
    cf.fila.forEach(function(e){
      var cx = W2 * LADOS[e.lado], bw = W2 * .29, bh = 74, bx = e.lado ? W2 * .3 + 4 : 4, by = 6;
      var cor = e.estado === 'reacao' ? (e.ok ? '#3fae62' : '#e0303a') : '#ff6fb5', resto = e.estado === 'espera' ? Math.max(0, 1 - (t - e.t0) / e.limite) : 0;
      if(e.estado === 'espera' && resto < .3) cor = '#ff8a3d';
      x.save(); x.fillStyle = '#fff'; x.strokeStyle = cor; x.lineWidth = 3.5;
      x.beginPath(); if(x.roundRect) x.roundRect(bx, by, bw, bh, 14); else x.rect(bx, by, bw, bh); x.fill(); x.stroke();
      x.beginPath(); x.moveTo(cx - 7, by + bh - 1); x.lineTo(cx, by + bh + 10); x.lineTo(cx + 7, by + bh - 1); x.closePath(); x.fill();
      x.fillStyle = '#d63384'; x.font = '900 16px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'left';
      x.fillText((e.lado ? '➡ ' : '⬅ ') + e.cli.nome, bx + 12, by + 22, bw - 20);
      x.font = '28px sans-serif'; x.fillStyle = '#3c2a8f';
      x.fillText(e.estado === 'reacao' ? (e.ok ? '💖 ✅' : e.saiu ? '😢 …' : '🥲 ✖') : iconesPedido(e.cli.pedido), bx + 12, by + 56, bw - 20);
      if(e.estado === 'espera'){ x.fillStyle = '#f3e3ff'; x.fillRect(bx + 12, by + bh - 9, bw - 24, 4); x.fillStyle = cor; x.fillRect(bx + 12, by + bh - 9, (bw - 24) * resto, 4); }
      x.restore();
    });
  };

  // ---- ganchos (o resto do Café segue intacto) ----
  window.cfIniciarSeguro = function(){
    var escolhida = cf && cf.fase === 'inicio' ? cf.assinatura : null, visita = cf && cf.fase === 'inicio' ? cf.faEspecial : null;
    cf = { fase:'preparando', pontos:0, vidas:3, atendidos:0, perfeitos:0, combo:0, cli:null, monta:vazio(), t0:cfT, fala:'', novas:[], hearts:[],
      servidor:null, runId:null, modoServidor:null, verificacaoPendente:false, provaEstado:'', conq:[], assinatura:escolhida, assinaturaUsada:false, faEspecial:visita,
      duplo:true, fila:[], criados:0, buscando:false, verificando:0, doceT:0, rouboT:-999 };
    hsVisitaPreparar(cf);
    if(!contaJ){ cf.modoServidor = 'treino'; preencher(); return; }
    var atual = cf; cfUI();
    contaRpc('cafe_run_iniciar').then(function(r){
      if(cf !== atual) return;
      if(!(r && r.ok && r.run_id)){ atual.duplo = false; atual.fase = 'pedido'; cfNovoCliente(); return; }
      atual.runId = r.run_id; atual.modoServidor = 'novo';
      contaRpc('cafe_run_pedidos', { p_run:atual.runId }).then(function(p){
        if(cf !== atual) return;
        if(p && p.ok && Array.isArray(p.pedidos)){
          p.pedidos.forEach(function(q){ if(q.pedido) entrar(novoFa(q.pedido), q, +q.segundos_passados || 0); });
          atual.criados = +p.criados || atual.fila.length; atual.fase = 'pedido'; cfUI(); return;
        }
        atual.duplo = false; cfNovoCliente();   // servidor sem o modo novo: um cliente por vez, como sempre
      }).catch(function(){ if(cf === atual){ atual.duplo = false; cfNovoCliente(); } });
    }).catch(function(){ if(cf === atual){ atual.duplo = false; cfNovoCliente(); } });
  };
  window.cfUI = function(){ if(cf && cf.duplo) return uiDuplo(); return orig.ui(); };
  window.cfLoop = function(ms){ if(cf && cf.duplo) return loopDuplo(ms); return orig.loop(ms); };
  // servir para o fã da esquerda/direita (o resto dos cliques continua no cfClique do café)
  document.addEventListener('click', function(ev){
    var b = ev.target && ev.target.closest && ev.target.closest('#cfOv [data-cfd-servir]'); if(!b || b.disabled) return;
    ev.stopPropagation(); servir(+b.dataset.cfdServir, false);
  }, true);
})();
