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
      feito:'A vitrine abriu e a sua foto faz parte da exposição.', faltou:'Os vizinhos abriram a vitrine com fotos do próprio bairro.'},
    {titulo:'Um céu na Rua Fofa', fundo:'nuvens', tarefa:'Fotografe seu Idol entre as nuvens para o mural da Rua Fofa.',
      feito:'O mural de nuvens foi inaugurado com a sua contribuição.', faltou:'Os vizinhos terminaram o mural com as fotos que tinham.'}
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
  function hoje(){
    var i = semana(), p = atual(), d = desfechos()[0];
    var h = p ? '<p><b>' + escHtml(p.titulo) + '</b> · ' +
      botao('Ver história na Rua Fofa','rua','twc-hj-bt') + '</p>' : '';
    if(d && !ler(d.i).leu) h += '<p>' + botao('Ler o desfecho da Rua Fofa','jornal','twc-hj-bt') + '</p>';
    return h ? '<div class="twc-card twc-piloto-bairro">' + h + '</div>' : '';
  }
  function bicoAtivo(){ return parametros.get('piloto_bico') === '1' && !!atual(); }
  function falaRosa(){
    var i=semana();
    if(i<1 || !pauta[i])return '';
    var antes=ler(i-1);
    if(antes.concluiu && antes.bicoConcluiu)return 'A foto e a plaquinha que você trouxe na semana passada ficaram lindas juntas. Quer ver o que estamos preparando agora?';
    if(antes.concluiu)return 'Lembra da foto que você fez na semana passada? Ela fez parte da vitrine. Vem ver o que estamos preparando agora!';
    if(antes.bicoConcluiu)return 'A plaquinha do pedido que você preparou na semana passada ainda está aqui. Obrigada por voltar!';
    return '';
  }
  function rua(){
    var i = semana(), p = atual(), d = desfechos()[0], ficha = ler(i);
    if(!p && !d) return '';
    var h = '<section class="twb-box"><h3>' + escHtml(p ? p.titulo : 'Histórias da Rua Fofa') + '</h3>';
    var exposicao = ficha.concluiu ? ficha : d ? ler(d.i) : ficha;
    var placa = ficha.bicoConcluiu || exposicao.bicoConcluiu || desfechos().some(function(e){ return ler(e.i).bicoConcluiu; });
    if(exposicao.concluiu || placa){
      var foto = exposicao.foto;
      h += '<div class="tw-piloto-vitrine" aria-label="Vitrine da Rua Fofa">' +
        (typeof foto === 'string' && /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(foto)
          ? '<img src="' + escHtml(foto) + '" alt="Sua foto em exposição na Rua Fofa">' : exposicao.concluiu ? '<span>🖼️ Sua foto</span>' : '') +
        (placa ? '<span>☕ Plaquinha da casa</span>' : '') + '</div>';
    }
    var fala=falaRosa();
    if(fala)h+='<p class="tw-piloto-rosa"><b>Rosa</b> · '+escHtml(fala)+'</p>';
    if(p) h += '<p>' + escHtml(ficha.concluiu ? '📷 Sua foto está na vitrine da Rua Fofa.' : p.tarefa) + '</p>' +
      (ficha.concluiu ? '' : botao('Abrir o Studio com este cenário','studio','twb-bt'));
    if(bicoAtivo()) h += '<p>' + (ficha.bicoConcluiu ? '☕ A plaquinha da casa está na vitrine. Você recebeu a lembrança da Rua Fofa.' :
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
        escHtml(ficha.concluiu ? e.p.feito : e.p.faltou) + '</p>' +
        (ficha.bicoConcluiu ? '<p>☕ Sua plaquinha virou uma lembrança da Rua Fofa.</p>' : '') + '</details>';
    }).join('') + '</section>';
  }
  function concluir(tipo, token, cena){
    if(!token || token.tipo !== tipo || token.dono !== dono() || token.i !== semana()) return false;
    var estado = ler(token.i), foto;
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
    var i = semana(), p = atual(), acao = b.dataset.pilotoBairro;
    if(acao === 'jornal'){ TW_BAIRRO.fechar(); jornalAbrir('ruaFofa'); return; }
    if(acao === 'rua'){
      if(b.closest('#studioOv')) studioFechar();
      if(p) marcar(i, 'abriu');
      TW_BAIRRO.abrir(); return;
    }
    if(!p) return;
    if(acao === 'studio'){
      marcar(i, 'abriu'); TW_BAIRRO.fechar();
      studioAbrir({piloto:{i:i,dono:dono(),tipo:'studio',fundo:p.fundo}});
    }
    if(acao === 'cafe' && bicoAtivo()){
      pendente = {i:i,dono:dono(),tipo:'cafe'};
      var token = pendente;
      TW_CARGA.abrir('Happy⭐Cafe!', twJogosCarregar, function(){
        if(token !== pendente || token.i !== semana() || token.dono !== dono()) return;
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
  window.TW_PILOTO_BAIRRO = {hoje:hoje, rua:rua, falaRosa:falaRosa, jornal:jornal, iniciar:iniciar, concluir:concluir,
    medidas:function(){
      return pauta.map(function(p, i){
        var etapas = ler(i); delete etapas.foto;
        return {titulo:p.titulo, etapas:etapas};
      });
    }};
})();
