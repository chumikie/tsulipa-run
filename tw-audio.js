/* Volume geral do aparelho compartilhado pela página e pelos jogos incorporados. */
(function(){
  'use strict';
  var chave='tw_audio_geral_v1', canais=[], midias=new Set();
  function ler(){
    try{
      var dado=JSON.parse(localStorage.getItem(chave));
      if(dado && Number.isFinite(dado.volume))return {volume:Math.max(0,Math.min(100,dado.volume)),mudo:dado.mudo===true};
    }catch(e){}
    return {volume:100,mudo:false};
  }
  var estado=ler();
  function nivel(){return estado.mudo?0:estado.volume/100;}
  function atualizar(){
    canais.forEach(function(c){c.gain.gain.value=nivel();});
    midias.forEach(function(m){m.el.volume=m.base*nivel();});
    window.dispatchEvent(new Event('tw-audio'));
  }
  function definir(changes){
    if(Number.isFinite(changes.volume))estado.volume=Math.max(0,Math.min(100,Math.round(changes.volume)));
    if(typeof changes.mudo==='boolean')estado.mudo=changes.mudo;
    try{localStorage.setItem(chave,JSON.stringify(estado));}catch(e){}
    atualizar();
  }
  function saida(ctx){
    var canal=canais.find(function(c){return c.ctx===ctx;});
    if(canal)return canal.gain;
    var gain=ctx.createGain();gain.gain.value=nivel();gain.connect(ctx.destination);
    canais.push({ctx:ctx,gain:gain});return gain;
  }
  function midia(el,base){
    var m={el:el,base:base};
    function ativa(){el.volume=base*nivel();midias.add(m);}
    function encerra(){midias.delete(m);}
    ativa();
    el.addEventListener('play',ativa);
    ['pause','ended','error'].forEach(function(e){el.addEventListener(e,encerra);});
    return el;
  }
  window.addEventListener('storage',function(e){if(e.key===chave||e.key===null){estado=ler();atualizar();}});
  window.TW_AUDIO={estado:function(){return {volume:estado.volume,mudo:estado.mudo};},definir:definir,saida:saida,midia:midia};
})();
