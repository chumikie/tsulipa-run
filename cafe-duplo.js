/* Happy⭐Cafe! — modo "Dois no balcão".
   Dois fãs esperam ao mesmo tempo, cada um com a sua paciência; cada um tem o próprio copo em preparo.
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
  var ESCOLHA = {
    pt:'Escolha um fã para ver a comanda',en:'Choose a fan to see their order',es:'Elige un fan para ver su pedido',
    id:'Pilih penggemar untuk melihat pesanannya',th:'เลือกแฟนเพื่อดูออเดอร์',ja:'ファンを選んで注文を見る'
  };
  var RETORNO = {
    pt:['Pouca paciência','Pedido certo!','Pedido certo, por pouco!','O tempo do pedido acabou.','Confira os ingredientes na comanda.'],
    en:['Running out of patience','Correct order!','Correct order, just in time!','The order timed out.','Check the ingredients on the order.'],
    es:['Poca paciencia','¡Pedido correcto!','¡Pedido correcto, justo a tiempo!','Se acabó el tiempo del pedido.','Revisa los ingredientes del pedido.'],
    id:['Hampir tidak sabar','Pesanan benar!','Pesanan benar, tepat waktu!','Waktu pesanan habis.','Periksa bahan pada pesanan.'],
    th:['ใกล้หมดความอดทน','ออเดอร์ถูกต้อง!','ออเดอร์ถูกต้อง ทันเวลาพอดี!','หมดเวลาของออเดอร์แล้ว','ตรวจส่วนผสมในใบสั่ง'],
    ja:['もうすぐ待ち時間終了','注文どおり！','注文どおり、ぎりぎりセーフ！','注文は時間切れです。','伝票の材料を確認しよう。']
  };
  var COPOS = {
    pt:['Atenda primeiro','Copo ativo','Copo vazio','Ingredientes no copo'],
    en:['Serve first','Active cup','Empty cup','Ingredients in the cup'],
    es:['Atender primero','Vaso activo','Vaso vacío','Ingredientes en el vaso'],
    id:['Layani dulu','Gelas aktif','Gelas kosong','Bahan dalam gelas'],
    th:['เสิร์ฟก่อน','แก้วที่เลือก','แก้วเปล่า','ส่วนผสมในแก้ว'],
    ja:['先に提供','選択中のカップ','空のカップ','カップの材料']
  };
  var TURNO = {
    pt:['Treinar chegadas alternadas','Turno de treino · os fãs chegam com 3 s de intervalo.','Pedidos certos no prazo','Ingrediente com mais erros','Nenhum ingrediente errado','Extra na categoria'],
    en:['Practice staggered arrivals','Practice shift · fans arrive 3 s apart.','Correct orders on time','Most missed ingredient','No ingredient mistakes','Extra in category'],
    es:['Practicar llegadas escalonadas','Turno de práctica · los fans llegan con 3 s de diferencia.','Pedidos correctos a tiempo','Ingrediente con más errores','Sin errores de ingredientes','Extra en la categoría'],
    id:['Latihan kedatangan bergantian','Giliran latihan · penggemar datang berselang 3 dtk.','Pesanan benar tepat waktu','Bahan yang paling sering keliru','Tidak ada kesalahan bahan','Tambahan pada kategori'],
    th:['ฝึกรับลูกค้าสลับกัน','รอบฝึก · แฟนมาห่างกัน 3 วินาที','ออเดอร์ถูกต้องและทันเวลา','ส่วนผสมที่ผิดบ่อยที่สุด','ไม่มีส่วนผสมผิด','ส่วนผสมเกินในหมวด'],
    ja:['時間差で来店する練習','練習シフト · ファンは3秒間隔で来店します。','時間内に正しく出した注文','最も間違えた材料','材料の間違いなし','余分な材料の種類']
  };
  var CAUSAS = {
    pt:['Receitas incorretas','Receitas certas fora do prazo','Pedidos vencidos sem receita pronta'],
    en:['Incorrect recipes','Correct recipes served late','Expired orders without a complete recipe'],
    es:['Recetas incorrectas','Recetas correctas fuera de plazo','Pedidos vencidos sin receta lista'],
    id:['Resep salah','Resep benar yang terlambat','Pesanan habis waktu sebelum resep siap'],
    th:['สูตรผิด','สูตรถูกแต่ส่งช้า','ออเดอร์หมดเวลาก่อนทำเสร็จ'],
    ja:['レシピの間違い','レシピは正解だが時間切れ','完成前に時間切れ']
  };
  function turno(i){ return (TURNO[LANG] || TURNO.pt)[i]; }
  var INGREDIENTES = [['base',CF_BASES,'Base'],['cob',CF_COBERTURAS,'Cobertura'],['enf',CF_ENFEITES,'Enfeite'],['doce',CF_DOCES,'Docinho']];
  function registrarErro(pedido,monta){
    INGREDIENTES.forEach(function(tipo){
      var esperado = pedido[tipo[0]], servido = monta[tipo[0]];
      if(esperado === servido) return;
      var id = tipo[0] + ':' + esperado;
      var erro = cf.errosIngredientes.get(id) || {nome:esperado < 0 ? turno(5) + ' · ' + tr(tipo[2]) : tr(tipo[1][esperado][1]), total:0};
      erro.total++;
      cf.errosIngredientes.set(id,erro);
      var categoria=cf.errosCategorias[tipo[0]] || {total:0};
      categoria.total++;categoria.pedido=pedido;categoria.servido=servido;
      cf.errosCategorias[tipo[0]]=categoria;
    });
  }
  function resumoTurno(){
    var erros = Array.from(cf.errosIngredientes.values()), max = erros.reduce(function(n,e){ return Math.max(n,e.total); },0);
    var nomes = erros.filter(function(e){ return e.total === max; }).map(function(e){ return e.nome; }).join(', ');
    var categorias=Object.keys(cf.errosCategorias), maior=categorias.reduce(function(n,k){return Math.max(n,cf.errosCategorias[k].total);},0);
    var botoes=categorias.filter(function(k){return cf.errosCategorias[k].total===maior;}).map(function(k){
      return '<button type="button" class="btn alt" data-cf-pratica="foco" data-tipo="'+k+'">'+escHtml(cfFocoTexto(0,k))+'</button>';
    }).join('');
    return '<p class="hsdica" id="cfTurnoResumo"><b>' + escHtml(turno(2)) + ' · ' + cf.perfeitos + '/' + cf.atendidos +
      '</b><br>' + (CAUSAS[LANG]||CAUSAS.pt).map(function(rotulo,i){return escHtml(rotulo)+' · '+cf.causas[i];}).join('<br>') + '<br>' + escHtml(max ? turno(3) + ' · ' + nomes + ' (' + max + ')' : turno(4)) + '</p>' + (botoes ? '<div class="btns">'+botoes+'</div>' : '');
  }
  function botaoTurno(){
    return '<button type="button" class="btn alt" data-cfd-turno>' + escHtml(turno(0)) + '</button>';
  }
  function copos(i){ return (COPOS[LANG] || COPOS.pt)[i]; }
  function retorno(i){ return (RETORNO[LANG] || RETORNO.pt)[i]; }
  function paciencia(e){ return Math.max(0, 1 - (cfT - e.t0) / e.limite); }
  var LADOS = [.2, .44];   // centro de cada cliente (fração da largura do canvas)

  function vazio(){ return { base:-1, cob:-1, enf:-1, doce:-1 }; }
  function esperando(){ return cf.fila.filter(function(e){ return e.estado === 'espera'; }); }
  function prazo(e){ return e.t0 + e.limite; }
  function maisUrgente(fila){
    if(fila.length < 2 || prazo(fila[0]) === prazo(fila[1])) return null;
    return prazo(fila[0]) < prazo(fila[1]) ? fila[0] : fila[1];
  }
  function selecionar(e){
    if(cf.alvoBalcao) cf.alvoBalcao.monta = cf.monta;
    cf.alvoBalcao = e || null;
    cf.monta = e ? e.monta : vazio();
  }
  function ladoLivre(){ var usados = cf.fila.map(function(e){ return e.lado; }); return usados.indexOf(0) < 0 ? 0 : usados.indexOf(1) < 0 ? 1 : -1; }
  function nomesUsados(){ var u = {}; cf.fila.forEach(function(e){ u[e.cli.nome] = 1; }); return u; }

  function novoFa(pedido){
    var r = hsSorteio(Date.now() + cf.criados * 131 + Math.floor(Math.random() * 997)), usados = nomesUsados();
    var livres = hsNomesLivres().filter(function(n){ return !usados[n]; });
    var primeiro = cf.primeiroFa && !cf.fila.length && cf.atendidos === 0 ? cf.primeiroFa : null;
    var f = cfIdentificarFa(hsFa(r, primeiro ? primeiro.nome : livres[Math.floor(r() * livres.length)] || 'Momorin'), primeiro);
    f.pedido = pedido || cfPedido(r, cf.criados);
    return f;
  }
  function entrar(f, sv, passados){
    var lado = ladoLivre(); if(lado < 0) return;
    var limite = sv ? sv.limite_segundos * 60 : Math.max(420, 900 - cf.criados * 45) + 240;
    cf.fila.push({ cli:f, sv:sv || null, lado:lado, t0:cfT - (passados || 0) * 60, limite:limite, monta:vazio(), estado:'espera', ok:false, fala:'', tR:0 });
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
    if(cf.alternado){
      if(cf.criados >= 12 || ladoLivre() < 0 || cfT < cf.proximaChegada) return;
      entrar(novoFa(),null,0); cf.criados++;
      cf.proximaChegada = cfT + 180;
      var foco = document.activeElement;
      var acao = foco && foco.closest('#cfCorpo [data-cf],#cfCorpo [data-cfd-servir],#cfCorpo [data-cfd-cliente]');
    }else while(esperando().length < 2 && cf.criados < 12 && ladoLivre() >= 0){ entrar(novoFa(), null, 0); cf.criados++; }
    if(cf.fase === 'preparando') cf.fase = 'pedido';
    cfUI();
    if(acao){
      var atributo = ['data-cf','data-cfd-servir','data-cfd-cliente'].find(function(a){ return acao.hasAttribute(a); });
      var botao = $('cfCorpo').querySelector('[' + atributo + '="' + CSS.escape(acao.getAttribute(atributo)) + '"]');
      if(botao) botao.focus({preventScroll:true});
    }
  }
  function virarTreino(){ if(!cf) return; cf.modoServidor = 'treino'; if(cf.provaEstado !== 'confirmado') cf.provaEstado = 'sem_comprovacao'; }

  function servir(lado, saiu){
    if(!cf || !cf.duplo || cf.fase !== 'pedido') return;
    var e = cf.fila.filter(function(q){ return q.lado === lado && q.estado === 'espera'; })[0]; if(!e) return;
    if(cf.alternado && cfT >= prazo(e)) saiu = true;
    var selecionado = cf.alvoBalcao === e;
    var p = e.cli.pedido, m = selecionado ? cf.monta : e.monta;
    if(selecionado) selecionar(null);
    var receitaCerta = m.base === p.base && m.cob === p.cob && m.enf === p.enf && m.doce === p.doce;
    var certo = !saiu && receitaCerta;
    if(cf.alternado && !certo) cf.causas[saiu ? (receitaCerta ? 1 : 2) : 0]++;
    var resto = paciencia(e);
    e.resultado = saiu ? retorno(3) : certo ? retorno(resto < .25 ? 2 : 1) : cfDetalhePedido(p, m) || retorno(4);
    var numero = ++cf.atendidos;
    if(!certo && (!cf.alternado || !receitaCerta)) cfLembrarErro(cf, numero, p);
    if(cf.alternado && !saiu && !certo) registrarErro(p,m);
    cf.ultimoAtendimento = e;
    e.confirmacao = cf.provaEstado === 'pendente' ? 3 : 4;
    if(e.sv && cf.modoServidor === 'novo'){
      e.confirmacao = 0;
      var atual = cf; atual.verificando = (atual.verificando || 0) + 1;
      contaRpc('cafe_run_etapa2', { p_sessao:e.sv.sessao, p_monta:{ base:m.base, cob:m.cob, enf:m.enf, doce:m.doce }, p_saiu:!!saiu }).then(function(r){
        if(cf !== atual) return; atual.verificando--; e.tR = Math.max(e.tR,cfT - 30);
        e.confirmacao = r && r.ok && r.confirmado ? (r.certo === true ? 1 : 2) : 3;
        if(r && r.ok && r.confirmado){
          if(r.certo === false) cfLembrarErro(atual, numero, p);
          atual.pontos = +r.pontos || 0; atual.vidas = +r.vidas; atual.perfeitos = +r.perfeitos || atual.perfeitos; atual.combo = +r.combo || 0;
          if(r.certo){ atual.provaEstado = 'confirmado'; cfConsultarMissao(atual); try{ localStorage.setItem('tw_cf_dia', new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10)); }catch(er){} }
          else if(atual.provaEstado !== 'confirmado') atual.provaEstado = 'sem_comprovacao';
          if(r.certo && certo && atual.dono === contaJ && atual.contaFa === hsMemChave()){
            hsCafeConfirmar(e.cli, atual.contaFa);
            cfCidadeReencontro(e.cli, atual.contaFa, e.sv.sessao);
          }
          if(!!r.certo !== e.ok){
            e.ok = !!r.certo;
            e.resultado = r.certo ? retorno(1) : retorno(3);
          }
        } else virarTreino();
        cfUI();
      }).catch(function(){ if(cf === atual){ atual.verificando--; e.tR = Math.max(e.tR,cfT - 30); e.confirmacao = 3; virarTreino(); atual.provaEstado = 'pendente'; cfUI(); } });
    }
    var px = LADOS[e.lado];
    if(certo){
      cf.combo++; cf.perfeitos++;
      var semana = typeof eventoAtual === 'function' && p.base === eventoAtual().base;
      if(!(e.sv && cf.modoServidor === 'novo')) cf.pontos += (semana ? 50 : 0) + Math.round((100 + resto * 100 + (p.cob >= 0 ? 30 : 0) + (p.doce >= 0 ? 40 : 0)) * (1 + Math.min(cf.combo - 1, 5) * .1));
      var rec = cfLer(CF_RECEITAS_KEY, {}), chave = p.base + '-' + p.enf;
      if(!cf.alternado && !rec[chave]){
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
    if(typeof eventoPetReagir === 'function') eventoPetReagir('cafe', cfT, false, certo ? (cf.combo >= 3 ? 'combo' : 'acerto') : 'erro');
    cfUI();
  }

  function loopDuplo(ms){
    cfAnim = 0; if(!twAnimacaoVisivel(cfOv)) return;
    var d = window.TWMotionLifecycle ? TWMotionLifecycle.frameDelta($('cfCv'), ms) : 1; cfT += d;
    if(cf && cf.fase === 'pedido'){
      esperando().forEach(function(e){ if(cfT - e.t0 > e.limite) servir(e.lado, true); });
      esperando().forEach(function(e){
        var bar = $('cfPac' + e.lado), pc = paciencia(e) * 100;
        if(bar) cfPacienciaUI(bar, pc, $('cfPacEmo' + e.lado));
        var urgente = $('cfUrgente' + e.lado);
        if(urgente) urgente.hidden = pc >= 25;
      });
      var antes = cf.fila.length;
      cf.fila = cf.fila.filter(function(e){ return !(e.estado === 'reacao' && e.confirmacao !== 0 && cfT - e.tR > 90); });
      if(cf.fila.length !== antes){
        if(cf.vidas <= 0){ if(!cf.verificando) cfFim(); }
        else if(cf.criados >= 12 && !esperando().length && !cf.fila.length){ if(!cf.verificando) cfFim(); }
        else { preencher(); cfUI(); }
      } else if(cf.alternado && cf.vidas > 0 && cf.criados < 12 && ladoLivre() >= 0 && cfT >= cf.proximaChegada) preencher();
      else if(cf.vidas <= 0 && !cf.fila.some(function(e){ return e.estado === 'reacao'; }) && !cf.verificando) cfFim();
      else if(cf.criados >= 12 && !cf.fila.length && !cf.verificando) cfFim();
    }
    if(Math.floor(cfT / 2) !== Math.floor((cfT - d) / 2)) cfDesenhar();
    cfAnim = requestAnimationFrame(cfLoop);
  }

  function iconesPedido(p){
    return CF_BASES[p.base][0] + (p.cob >= 0 ? CF_COBERTURAS[p.cob][0] : '') + CF_ENFEITES[p.enf][0] + (p.doce >= 0 ? ' + ' + CF_DOCES[p.doce][0] : '');
  }
  function copoHtml(m, ativo){
    var items = INGREDIENTES.map(function(item){ return item[1][m[item[0]]]; }).filter(Boolean);
    return '<div class="cfduplo-copo">' +
      (ativo ? '<strong class="cfduplo-copo-ativo">' + escHtml(copos(1)) + '</strong>' : '') +
      (items.length ? '<ul aria-label="' + escHtml(copos(3)) + '">' + items.map(function(item){
        var nome = tr(item[1]);
        return '<li title="' + escHtml(nome) + '"><span aria-hidden="true">' + escHtml(item[0]) +
          '</span><span class="twc-sr">' + escHtml(nome) + '</span></li>';
      }).join('') + '</ul>' : '<small>' + escHtml(copos(2)) + '</small>') + '</div>';
  }
  function uiDuplo(){
    var corpo = $('cfCorpo'); if(!corpo || !cf) return;
    if(cf.fase !== 'pedido' && cf.fase !== 'preparando' && cf.fase !== 'saudacao'){
      orig.ui();
      if(cf.alternado && !cf.pratica && cf.fase === 'fim'){
        corpo.querySelector('.hsresumo').insertAdjacentHTML('afterend',resumoTurno());
        corpo.querySelector('#cfJogar').insertAdjacentHTML('afterend',botaoTurno());
      }
      return;
    }
    var h = '<div class="hsstatus"><span>⭐ ' + cf.pontos.toLocaleString('pt-BR') + '</span><span>' + '❤️'.repeat(Math.max(0, cf.vidas)) + '🤍'.repeat(Math.max(0, 3 - cf.vidas)) + '</span><span>☕ ' + cf.atendidos + '/12</span><span>👥 2</span></div>';
    if(cf.fase === 'saudacao'){
      corpo.innerHTML = h + cfSaudacaoFa(cf.primeiroFa) + '<div class="btns"><button class="btn" type="button" data-cfd-aceitar>' + escHtml(tr('Continuar')) + '</button></div>';
      return;
    }
    if(cf.fase === 'preparando'){ corpo.innerHTML = h + '<p class="hsdica">⏳ ' + escHtml(tr('Preparando o pedido validado…')) + '</p>'; return; }
    var alvo = cf.alvoBalcao, primeiro = maisUrgente(esperando());
    if(cf.alternado) h += '<p class="hsdica">' + escHtml(turno(1)) + '</p>';
    h += '<section class="cf-comanda"><div class="cfduplo-pac">' + [0, 1].map(function(l){
      var e = cf.fila.find(function(q){ return q.lado === l; });
      var espera = e && e.estado === 'espera', copo = e === alvo ? cf.monta : e && e.monta;
      return '<div class="cfduplo-p' + (e && e === alvo ? ' cf-atendendo' : '') + '">' +
        '<button type="button" data-cfd-cliente="' + l + '" aria-pressed="' + Boolean(e && e === alvo) + '"' +
        (espera ? '' : ' disabled') + '>' + (e ? (e.cli.hsLembranca ? '💌 ' : '') + escHtml(e.cli.nome) : '—') + '</button>' +
        cfBarraPedido(l, espera ? paciencia(e) : 0, e && e.cli.nome) +
        (e && e === primeiro ? '<small class="cfduplo-primeiro">↳ ' + escHtml(copos(0)) + '</small>' : '') +
        (espera ? copoHtml(copo,e === alvo) : '') +
        '<small class="cfduplo-urgente" id="cfUrgente' + l + '"' + (!espera || paciencia(e) >= .25 ? ' hidden' : '') + '>⏳ ' + escHtml(retorno(0)) + '</small>' + '</div>';
    }).join('') + '</div><p class="cfpedidotxt" aria-live="polite">' + (alvo ?
      '<b>'+escHtml(alvo.cli.nome)+'</b> · '+escHtml(cfPedidoIlustrativo(alvo.cli.pedido).replace(/^☕ /,'')) :
      escHtml(ESCOLHA[LANG] || ESCOLHA.pt)) + '</p></section>';
    if(cf.aviso) h += '<p class="cfaviso">' + escHtml(cf.aviso) + '</p>';
    h += cfBotoes('base', CF_BASES, '1. Base') + cfBotoes('cob', CF_COBERTURAS, '2. Cobertura (se pedir)') + cfBotoes('enf', CF_ENFEITES, '3. Enfeite') + cfBotoes('doce', CF_DOCES, 'Docinho (se pedir)');
    var pronto = cf.monta.base >= 0 && cf.monta.enf >= 0, ultimo = cf.ultimoAtendimento;
    h += '<div class="cf-rodape"><div class="btns cfacoes cfduplo-acoes"><button type="button" class="btn sec" data-cf="lixo:0"' + (!alvo ? ' disabled' : '') + '>🗑️ ' +
      escHtml(tr('Recomeçar copo')) + '</button><button type="button" class="btn" data-cfd-servir="' + (alvo ? alvo.lado : '') + '"' +
      (!alvo || !pronto ? ' disabled' : '') + '>🛎️ ' + escHtml(tr('Servir')) + '</button></div>' +
      (ultimo && ultimo.resultado ? '<p class="cfpedidotxt" role="status"><b>' + escHtml(ultimo.cli.nome) + '</b> · ' + escHtml(ultimo.resultado) + '</p>' : '') +
      cfRetornoPedido(ultimo ? ultimo.confirmacao : null,ultimo && ultimo.cli.nome) + '</div>';
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
  window.cfIniciarSeguro = function(alternado){
    var escolhida = cf && cf.fase === 'inicio' ? cf.assinatura : null, visita = cf && cf.fase === 'inicio' ? cf.faEspecial : null;
    cf = { fase:'preparando', pontos:0, vidas:3, atendidos:0, perfeitos:0, combo:0, cli:null, monta:vazio(), t0:cfT, fala:'', novas:[], hearts:[],
      servidor:null, runId:null, modoServidor:null, verificacaoPendente:false, provaEstado:'', conq:[], assinatura:escolhida, assinaturaUsada:false, faEspecial:visita,
      duplo:true, fila:[], criados:0, buscando:false, verificando:0, doceT:0, rouboT:-999 };
    if(alternado){
      cf.alternado = true; cf.causas = [0,0,0]; cf.proximaChegada = cfT; cf.errosIngredientes = new Map(); cf.errosCategorias = {};
    }
    cf.dono = contaJ; cf.sessao = typeof contaSessaoToken === 'undefined' ? null : contaSessaoToken;
    hsVisitaPreparar(cf);
    cf.contaFa = hsMemChave();
    cf.primeiroFa = cfLembrancaInicial();
    if(cf.primeiroFa){ cf.fase = 'saudacao'; cfUI(); return; }
    iniciarPedidos();
  };
  function iniciarPedidos(){
    if(cf.dono !== contaJ || cf.contaFa !== hsMemChave()){ cfAbrir(); return; }
    cf.fase = 'preparando';
    if(cf.alternado || !contaJ){ cf.modoServidor = 'treino'; preencher(); return; }
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
  }
  window.cfUI = function(){
    if(cf && cf.duplo) return uiDuplo();
    orig.ui();
    if(cf && cf.fase === 'inicio') $('cfJogar').insertAdjacentHTML('afterend',botaoTurno());
  };
  window.cfLoop = function(ms){ if(cf && cf.duplo) return loopDuplo(ms); return orig.loop(ms); };
  // servir para o fã da esquerda/direita (o resto dos cliques continua no cfClique do café)
  document.addEventListener('click', function(ev){
    var treino = ev.target && ev.target.closest && ev.target.closest('#cfOv [data-cfd-turno]');
    if(treino && cf && (cf.fase === 'inicio' || cf.fase === 'fim')){ cfIniciarSeguro(true); return; }
    var ingrediente = ev.target && ev.target.closest && ev.target.closest('#cfOv [data-cf]');
    if(ingrediente && !ingrediente.disabled && cf && cf.duplo && cf.fase === 'pedido' && !cf.alvoBalcao){
      var fila = esperando();
      if(fila.length) selecionar(maisUrgente(fila) || fila[0]);
    }
    var aceitar = ev.target && ev.target.closest && ev.target.closest('#cfOv [data-cfd-aceitar]');
    if(aceitar && cf && cf.duplo && cf.fase === 'saudacao'){ iniciarPedidos(); return; }
    var b = ev.target && ev.target.closest && ev.target.closest('#cfOv [data-cfd-cliente], #cfOv [data-cfd-servir]');
    if(!b || b.disabled || !cf || !cf.duplo || cf.fase !== 'pedido') return;
    ev.stopPropagation();
    if(b.dataset.cfdCliente != null){
      selecionar(esperando().find(function(e){return e.lado === +b.dataset.cfdCliente;}));
      cfUI();
      var foco = $('cfCorpo').querySelector('[data-cfd-cliente="'+b.dataset.cfdCliente+'"]');
      if(foco) foco.focus({preventScroll:true});
    }else if(cf.alvoBalcao && cf.alvoBalcao.lado === +b.dataset.cfdServir) servir(cf.alvoBalcao.lado,false);
  }, true);
})();
