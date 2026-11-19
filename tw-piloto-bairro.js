/* Editorial opt-in, with progress and timing kept in this browser. */
(function(){
  'use strict';
  var MS_DIA = 864e5, MS_SEMANA = 7 * MS_DIA;
  var parametros = new URLSearchParams(location.search);
  if(parametros.get('piloto_bairro') !== '1') return;
  var dataPedida = parametros.get('piloto_bairro_inicio') || '', dataInicio = '2026-11-22';
  if(/^\d{4}-\d{2}-\d{2}$/.test(dataPedida)){
    var domingo = new Date(dataPedida + 'T03:00:00Z');
    if(domingo.getUTCDay() === 0 && domingo.toISOString().slice(0,10) === dataPedida) dataInicio = dataPedida;
  }
  var inicio = Date.parse(dataInicio + 'T03:00:00Z');
  var pauta = [
    {titulo:'A vitrine da Rua Fofa', fundo:'rosa', tarefa:'Fotografe seu Idol no cenário rosa para a vitrine da rua.',
      morador:'Guardei um lugar para a sua foto. Olha como a vitrine ficou linda!',
      feito:'A vitrine abriu e a sua foto faz parte da exposição.', faltou:'Os vizinhos abriram a vitrine com fotos do próprio bairro.'},
    {titulo:'Um céu na Rua Fofa', fundo:'nuvens', tarefa:'Fotografe seu Idol entre as nuvens para o mural da Rua Fofa.',
      morador:'Sua foto ficou entre as nuvens. Dá uma olhada no nosso mural!',
      feito:'O mural de nuvens foi inaugurado com a sua contribuição.', faltou:'Os vizinhos terminaram o mural com as fotos que tinham.'},
    {titulo:'Uma vitrine de boas-vindas', fundo:'rosa', escolha:true,
      tarefa:'Escolha como ajudar a Rosa. Tire uma foto no Studio ou prepare o pedido de boas-vindas no Café.',
      morador:'A sua foto ficou na entrada. Agora quem passa por aqui sabe como a Rua Fofa recebe as visitas!',
      moradorCafe:'O pedido ficou uma delícia! Pus a plaquinha do Café na vitrine para receber as visitas.',
      feito:'A Rosa abriu a vitrine de boas-vindas com a sua foto.',
      feitoCafe:'A Rosa inaugurou a vitrine com a plaquinha do Café, em agradecimento pelo pedido que você preparou.',
      faltou:'A Rosa abriu a vitrine de boas-vindas com as flores dos vizinhos.'}
  ];
  var banco = 'tw_piloto_rua_fofa_v1:' + dataInicio, pendente = null, dadosVolateis = {}, somenteMemoria = false;
  function dono(){
    return typeof contaJ !== 'undefined' && contaJ ?
      'conta:' + (typeof contaAuthUserId === 'string' && contaAuthUserId || contaJ.id || String(contaJ.nick || '').toLowerCase()) : 'visitante';
  }
  function tudo(){
    if(somenteMemoria) return dadosVolateis;
    try{
      var dados = JSON.parse(localStorage.getItem(banco));
      return dados && typeof dados === 'object' && !Array.isArray(dados) ? dados : dadosVolateis;
    }catch(e){ return dadosVolateis; }
  }
  function semana(){ return Math.floor((Date.now() - inicio) / MS_SEMANA); }
  function ler(i){
    var dados = tudo();
    return Object.assign({}, (dados[dono()] || {})[i]);
  }
  function marcar(i, etapa, foto){
    if(!pauta[i]) return;
    var dados = tudo(), k = dono(), ficha = Object.assign({}, dados[k]), atual = Object.assign({}, ficha[i]);
    if(atual[etapa]) return;
    atual[etapa] = Date.now(); if(foto) atual.foto = foto; ficha[i] = atual; dados[k] = ficha; dadosVolateis = dados;
    try{ localStorage.setItem(banco, JSON.stringify(dados)); }catch(e){ somenteMemoria = true; }
    window.dispatchEvent(new Event('tw-piloto-bairro'));
  }
  function atual(){ return pauta[semana()] || null; }
  function desfechos(){ return pauta.map(function(p, i){ return {p:p,i:i}; }).filter(function(d){ return d.i < semana(); }).reverse(); }
  function botao(rotulo, acao, classe){
    return '<button type="button" class="' + classe + '" data-piloto-bairro="' + acao + '">' + escHtml(rotulo) + '</button>';
  }
  function bicoAtivo(){ var p = atual(); return !!p && (p.escolha || parametros.get('piloto_bico') === '1'); }
  function contribuicao(ficha){ return ficha.concluiu ? 'studio' : ficha.bicoConcluiu ? 'cafe' : ''; }
  function continuacao(){
    var d = desfechos().find(function(e){ return !ler(e.i).leu; });
    if(d) return {titulo:d.p.titulo,sub:'Desfecho no Idol⭐News!',acao:'jornal',i:d.i};
    var i = semana(), p = atual(), ficha = ler(i);
    if(!p) return null;
    if(p.escolha) return contribuicao(ficha) ? null : {titulo:p.titulo,sub:'Escolha como ajudar a Rosa',acao:'rua'};
    if(!ficha.concluiu) return {titulo:p.titulo,sub:ficha.abriu ? 'Foto no Studio' : 'História da Rua Fofa',acao:ficha.abriu ? 'studio' : 'rua'};
    return bicoAtivo() && !ficha.bicoConcluiu ? {titulo:p.titulo,sub:'Um pedido no Café',acao:'cafe'} : null;
  }
  function exposicao(){
    for(var i = Math.min(semana(),pauta.length - 1); i >= 0; i--){
      var registro = ler(i);
      if(registro.concluiu || (pauta[i].escolha && registro.bicoConcluiu)) return {registro:registro,pauta:pauta[i]};
    }
    return null;
  }
  function vitrine(){
    var item = exposicao(), disponivel = !!atual() || desfechos().length > 0;
    if(!disponivel) return '';
    var escolha = item && item.pauta.escolha && contribuicao(item.registro);
    var foto = item && item.registro.foto, placa = escolha ? escolha === 'cafe' : pauta.some(function(_,i){ return i <= semana() && ler(i).bicoConcluiu; });
    var exposicaoHtml = typeof foto === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(foto) ?
      '<img src="' + escHtml(foto) + '" alt="Sua foto em exposição na Rua Fofa">' :
      (item && item.registro.concluiu ? '<span>🖼️ Sua foto</span>' : '');
    return '<div class="tw-piloto-vitrine" aria-label="Vitrine da Rua Fofa">' +
      (exposicaoHtml || (placa ? '' : '<span>🌷 Vitrine em preparação</span>')) +
      (placa ? '<span>☕ Plaquinha da casa</span>' : '') +
      '</div><p class="tw-piloto-morador"><b>Rosa</b> · “' + escHtml(item ? (escolha === 'cafe' ? item.pauta.moradorCafe : item.pauta.morador) : placa ?
        'Obrigada pelo pedido! Coloquei sua plaquinha na vitrine.' :
        'Estou preparando a exposição da Rua Fofa.') + '”</p>';
  }
  function vitrineMapa(){
    var html = vitrine();
    return html ? '<h3>Vitrine da Rua Fofa</h3>' + html + botao('Ver história','rua','twc-hj-bt') : '';
  }
  function rua(){
    var i = semana(), p = atual(), d = desfechos()[0], ficha = ler(i);
    if(!p && !d) return '';
    var h = '<section class="twb-box"><h3>' + escHtml(p ? p.titulo : 'Histórias da Rua Fofa') + '</h3>';
    h += vitrine() + botao('Visitar a Rua Fofa no Mapa','mapa','twb-bt twb-bt-claro');
    if(p && p.escolha){
      var feita = contribuicao(ficha);
      h += '<p>' + escHtml(feita === 'studio' ? 'Sua foto está na vitrine de boas-vindas.' :
        feita === 'cafe' ? 'A plaquinha do seu pedido está na vitrine de boas-vindas.' : p.tarefa) + '</p>';
      if(!feita) h += '<div class="btns">' + botao('Tirar a foto no Studio','studio','twb-bt') +
        botao('Preparar o pedido no Café','cafe','twb-bt twb-bt-claro') + '</div>';
    }else if(p) h += '<p>' + escHtml(ficha.concluiu ? '📷 Sua foto está na vitrine da Rua Fofa.' : p.tarefa) + '</p>' +
      (ficha.concluiu ? '' : botao('Abrir o Studio com este cenário','studio','twb-bt'));
    if(bicoAtivo() && !p.escolha) h += '<p>' + (ficha.bicoConcluiu ? '☕ A plaquinha da casa está na vitrine. Você recebeu a lembrança da Rua Fofa.' :
      botao('Atender um pedido da Rua Fofa','cafe','twb-bt twb-bt-claro')) + '</p>';
    if(d) h += '<p>' + botao('Ver desfechos no Idol⭐News!','jornal','twb-bt twb-bt-claro') + '</p>';
    return h + '</section>';
  }
  function jornal(){
    var d = desfechos();
    if(!d.length) return '';
    return '<section class="jnbloco" id="jornalRuaFofa"><h4 tabindex="-1">Histórias da Rua Fofa</h4>' + d.map(function(e){
      var ficha = ler(e.i);
      return '<details data-piloto-desfecho="' + e.i + '"><summary>' + escHtml(e.p.titulo) + '</summary><p>' +
        escHtml(ficha.concluiu ? e.p.feito : e.p.escolha && ficha.bicoConcluiu ? e.p.feitoCafe : e.p.faltou) + '</p>' +
        (ficha.bicoConcluiu && !e.p.escolha ? '<p>☕ Sua plaquinha virou uma lembrança da Rua Fofa.</p>' : '') + '</details>';
    }).join('') + '</section>';
  }
  function concluir(tipo, token, cena){
    if(!token || token.tipo !== tipo || token.dono !== dono() || token.i !== semana()) return false;
    var estado = ler(token.i), foto;
    if(pauta[token.i].escolha && contribuicao(estado)) return contribuicao(estado) === tipo;
    if(!(tipo === 'studio' ? estado.iniciou : estado.bicoIniciou)) return false;
    if(cena && !estado.concluiu){
      try{
        var mini = document.createElement('canvas'); mini.width = 160; mini.height = Math.round(cena.height*160/cena.width);
        mini.getContext('2d').drawImage(cena,0,0,mini.width,mini.height);
        foto = mini.toDataURL('image/jpeg',.78);
      }catch(e){}
    }
    marcar(token.i, tipo === 'studio' ? 'concluiu' : 'bicoConcluiu', foto);
    return true;
  }
  document.addEventListener('toggle', function(e){
    var detalhe = e.target;
    if(detalhe.matches && detalhe.matches('#jornalRuaFofa details') && detalhe.open){
      var i = Number(detalhe.dataset.pilotoDesfecho);
      if(i < semana()) marcar(i, 'leu');
    }
  },true);
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-piloto-bairro]');
    if(!b) return;
    var origem = window.TW_JANELAS && TW_JANELAS.origem(b);
    var i = semana(), p = atual(), acao = b.dataset.pilotoBairro;
    var edicao = null;
    if(acao === 'continuar'){
      var destino = continuacao(); if(!destino) return;
      acao = destino.acao; edicao = destino.i;
    }
    if(acao === 'jornal'){ TW_BAIRRO.fechar(); jornalAbrir('ruaFofa',edicao,origem); return; }
    if(acao === 'mapa'){
      TW_BAIRRO.fechar();
      if(window.twcAbrirRuaFofa) window.twcAbrirRuaFofa(origem);
      return;
    }
    if(acao === 'rua'){
      if(b.closest('#studioOv')) studioFechar();
      if(p) marcar(i, 'abriu');
      TW_BAIRRO.abrir(origem); return;
    }
    if(!p || (p.escolha && contribuicao(ler(i)))) return;
    if(acao === 'studio'){
      marcar(i, 'abriu'); TW_BAIRRO.fechar();
      studioAbrir({origem:origem,piloto:{i:i,dono:dono(),tipo:'studio',fundo:p.fundo}});
    }
    if(acao === 'cafe' && bicoAtivo()){
      pendente = {i:i,dono:dono(),tipo:'cafe'};
      var token = pendente;
      TW_CARGA.abrir('Happy⭐Cafe!', twJogosCarregar, function(){
        if(token !== pendente || token.i !== semana() || token.dono !== dono() || (p.escolha && contribuicao(ler(i)))) return;
        pendente = null; TW_BAIRRO.fechar(); cfPilotoAbrir(token);
      });
    }
  });
  function iniciar(tipo, token){
    if(!token || token.tipo !== tipo || token.dono !== dono() || token.i !== semana()) return;
    marcar(token.i, tipo === 'studio' ? 'iniciou' : 'bicoIniciou');
  }
  window.addEventListener('storage',function(e){
    if(e.key === banco) window.dispatchEvent(new Event('tw-piloto-bairro'));
  });
  var exibida = semana();
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden && semana() !== exibida){
      exibida = semana();
      window.dispatchEvent(new Event('tw-piloto-bairro'));
    }
  });
  window.TW_PILOTO_BAIRRO = {continuacao:continuacao, rua:rua, vitrineMapa:vitrineMapa, jornal:jornal, iniciar:iniciar, concluir:concluir,
    medidas:function(){
      return pauta.map(function(p, i){
        var etapas = ler(i); delete etapas.foto;
        return {titulo:p.titulo, etapas:etapas};
      });
    }};
})();
