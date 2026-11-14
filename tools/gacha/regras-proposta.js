/* TsuLiPa⭐World · Protótipo isolado da economia do Star⭐Gacha!
 * NÃO importado pelo site e NÃO vinculado ao Supabase.
 * Contrato proposto para servidor: somente a transação autenticada decide o resultado.
 */
(function(root,factory){
  var rules=factory();
  if(typeof module==='object'&&module.exports)module.exports=rules;
  else root.TW_GACHA_REGRAS_PROPOSTA=rules;
}(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  var PITY_LIMITE=7, PO_POR_DUPLICATA=1, CUSTO_RESGATE=5;
  function inteiro(n,nome){
    if(!Number.isSafeInteger(n)||n<0)throw new Error(nome+' inválido');
    return n;
  }
  function resultado(tipo,semPremioAnterior){
    inteiro(semPremioAnterior,'sequência');
    // Sempre 1 giro por dia: a garantia NÃO concede giros extras.
    if(semPremioAnterior>=PITY_LIMITE&&tipo==='nada')return {permitido:false,erro:'pity_deve_sortear_premio'};
    if(!['nada','ticket','estrelas','bonus','card'].includes(tipo))throw new Error('tipo inválido');
    return {permitido:true,semPremio:tipo==='nada'?semPremioAnterior+1:0,
      garantiaAtivada:semPremioAnterior>=PITY_LIMITE};
  }
  function converter(qtdAtual,teveCardDoGacha){
    inteiro(qtdAtual,'quantidade atual');
    // Conversão VOLUNTÁRIA: entrega uma cópia, mantém a primeira do Álbum.
    // O servidor confere card_movimentos, o log de giros e o lock das trocas.
    if(!teveCardDoGacha||qtdAtual<2)return {ok:false,erro:'sem_repetido'};
    return {ok:true,qtdDepois:qtdAtual-1,poRecebido:PO_POR_DUPLICATA};
  }
  function troca(saldo,custo,disponiveis,escolhido){
    inteiro(saldo,'saldo');inteiro(custo,'custo');
    if(custo!==CUSTO_RESGATE)return {ok:false,erro:'custo_invalido'};
    if(!Array.isArray(disponiveis)||!disponiveis.includes(escolhido))
      return {ok:false,erro:'card_nao_disponivel'};
    if(saldo<custo)return {ok:false,erro:'po_insuficiente'};
    return {ok:true,saldoDepois:saldo-custo,card:escolhido};
  }
  return Object.freeze({PITY_LIMITE,PO_POR_DUPLICATA,CUSTO_RESGATE,
    resultado,converter,troca});
}));