/* Karaoke⭐Time! — clipe do dia no telão: o elenco aparece uniformizado.
   Cada tema do clipe usa a roupa do jogo mais parecida com ele, todos na mesma cor.
   Só muda o desenho do clipe; o visual salvo de cada conta não é alterado. */
(function(root, factory){
 'use strict';
 var api = factory();
 if(typeof module === 'object' && module.exports) module.exports = api;
 else root.KaraokeClipUniforms = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function(){
 'use strict';
 // tema do clipe (concept.set) → [roupa do jogo, cor]
 var UNIFORMES = {
  neon:   ['technopop', '#62e5ed'],   // Neon Debut → Electric Party (prata e neon)
  sakura: ['sakura',    '#ffb7d5'],   // Sakura Letter → roupa Sakura
  moon:   ['estrelado', '#2d3b6c'],   // Moon Serenade → Nagareboshi (estrelado)
  ocean:  ['seifuku',   '#17657b'],   // Ocean Pop → Debut (marinheira)
  candy:  ['decora',    '#ff9ccf'],   // Candy Parade → Decora kei
  disco:  ['disco',     '#b7baff'],   // Mirror Disco → Dancing High (disco)
  aurora: ['pijama',    '#a6f3d0'],   // Aurora Dream → Yume (sonho)
  ribbon: ['sweet',     '#f3b7d9']    // Ribbon Theatre → Valentine
 };
 function apply(production){
  var u = production && production.concept && UNIFORMES[production.concept.set];
  if(!u || !Array.isArray(production.members)) return production;
  production.members = production.members.map(function(m){
   return Object.assign({}, m, { char: Object.assign({}, m.char || {}, { out:u[0], outcol:u[1] }) });
  });
  return production;
 }
 return Object.freeze({ UNIFORMES:UNIFORMES, apply:apply });
});
