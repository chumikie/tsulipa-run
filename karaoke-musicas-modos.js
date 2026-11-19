/* Karaoke⭐Time!: trilhas dos outros modos do site como músicas do jogo de ritmo.
   As melodias vêm das trilhas sintetizadas que já tocam no Center⭐Run! (TR.kawaii, tense, hard, alien, unit),
   no Sora⭐Jump! (soraMusicMelody) e na vitrine do início (hubMusicaTocar), convertidas para notas MIDI
   no formato de `songs` do karaoke-time.html: 64 passos de meia batida, -1 = pausa, um acorde a cada 8 passos.
   Fica fora do HTML para respeitar o limite de tamanho da página. */
(function(root){
 var LISTA=[
  {key:'kawaii',icon:'🍭',name:'Mega Kawaii',origem:'Center⭐Run! · poder Mega',stars:'★★★',
   song:{title:'Mega Kawaii 🍭',bpm:120,lead:'triangle',style:'pop',fall:1650,cpb:1,ch:[[60,64,67],[60,64,67],[53,57,60],[55,59,62]],
    mel:[72,76,79,84,79,76,72,76,79,84,79,76,84,88,91,88,72,77,81,84,81,77,72,77,74,79,83,86,83,79,-1,-1,72,-1,79,84,79,-1,72,76,79,-1,79,76,84,-1,91,88,77,81,84,-1,81,77,-1,77,79,-1,83,-1,84,-1,-1,-1]}},
  {key:'tensa',icon:'⚡',name:'Corrida Tensa',origem:'Center⭐Run! · fase tensa',stars:'★★',
   song:{title:'Corrida Tensa ⚡',bpm:126,lead:'square',style:'run',fall:1550,cpb:1,ch:[[57,60,64],[57,60,64],[53,57,60],[52,56,59]],
    mel:[69,-1,69,72,-1,69,-1,68,69,-1,69,72,-1,76,75,-1,65,-1,65,69,-1,65,-1,64,64,-1,64,68,-1,71,70,-1,69,-1,69,72,-1,69,-1,68,69,-1,72,76,-1,76,75,-1,65,-1,69,72,-1,69,65,-1,64,-1,68,-1,71,-1,-1,-1]}},
  {key:'dificil',icon:'🔥',name:'Modo Difícil',origem:'Center⭐Run! · fase difícil',stars:'★★★',
   song:{title:'Modo Difícil 🔥',bpm:138,lead:'square',style:'dance',fall:1450,cpb:1,ch:[[57,60,64],[57,60,64],[50,53,57],[52,56,59]],
    mel:[69,70,69,68,69,72,71,69,76,75,74,73,74,77,76,75,74,75,74,73,74,77,76,74,71,72,71,70,71,74,73,71,69,-1,69,-1,72,-1,71,-1,76,-1,74,-1,77,-1,76,-1,74,75,74,73,74,77,76,74,76,-1,75,-1,76,-1,-1,-1]}},
  {key:'alien',icon:'🛸',name:'Kimi wa Alien!',origem:'Center⭐Run! · abdução',stars:'★★★',
   song:{title:'Kimi wa Alien! 🛸',bpm:110,lead:'sine',style:'pop',fall:1750,cpb:1,ch:[[60,64,67],[60,64,70],[53,57,60],[58,62,65]],
    mel:[72,74,76,79,76,74,72,70,72,74,76,79,82,79,76,74,72,-1,77,-1,81,-1,77,76,74,-1,70,-1,74,77,-1,-1,72,74,76,79,76,74,72,70,72,74,76,79,82,79,76,74,77,79,81,84,81,79,77,-1,74,-1,77,-1,82,-1,-1,-1]}},
  {key:'unit',icon:'✨',name:'Unit⭐Sync!',origem:'Center⭐Run! · modo Unit',stars:'★★★',
   song:{title:'Unit⭐Sync! ✨',bpm:118,lead:'square',style:'dance',fall:1600,cpb:1,ch:[[60,64,67],[60,64,67],[53,57,60],[55,59,62]],
    mel:[72,76,79,84,76,79,84,88,79,84,88,91,84,88,91,-1,77,81,84,89,81,84,89,-1,79,83,86,91,83,86,-1,-1,72,-1,79,84,76,-1,84,88,79,-1,88,91,84,-1,91,-1,77,-1,84,89,81,-1,89,-1,79,-1,86,-1,84,-1,-1,-1]}},
  {key:'sora',icon:'☁️',name:'Sora⭐Jump!',origem:'Sora⭐Jump!',stars:'★★★',
   song:{title:'Sora⭐Jump! ☁️',bpm:116,lead:'triangle',style:'pop',fall:1650,cpb:1,ch:[[60,64,67],[60,64,67],[55,59,62],[55,59,62],[57,60,64],[57,60,64],[53,57,60],[53,57,60]],
    mel:[76,79,81,84,83,81,79,-1,79,81,83,86,84,83,81,-1,79,83,86,88,86,84,83,-1,81,84,88,91,88,86,84,-1,81,83,84,88,91,88,86,-1,83,84,86,88,91,93,91,-1,84,83,81,79,81,83,84,-1,84,83,81,79,76,79,81,-1]}},
  {key:'vitrine',icon:'🛍️',name:'Vitrine Brilhante',origem:'Vitrine do início',stars:'★★★',
   song:{title:'Vitrine Brilhante 🛍️',bpm:116,lead:'square',style:'pop',fall:1700,cpb:1,ch:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],
    mel:[81,84,86,84,81,79,81,-1,79,81,84,81,79,76,79,-1,76,79,81,79,76,74,76,-1,74,76,79,81,84,81,84,-1,81,-1,84,86,-1,84,81,-1,79,-1,81,84,-1,79,76,-1,76,-1,79,81,-1,79,76,-1,76,79,81,84,-1,84,-1,-1]}}
 ];
 // Trechos das gravações do trio. As pausas e alturas vêm dos ataques do áudio.
 var GRAVACOES=[
  {"key":"zipper","icon":"♪","name":"Zipper","stars":"★★","song":{"title":"Zipper","bpm":99.5,"fall":1750,"recording":"./audio/karaoke/zipper.mp3","mel":[57,68,56,54,56,64,62,66,68,66,66,68,70,74,74,74,59,55,60,59,54,-1,79,82,67,-1,82,67,82,-1,81,69,80,54,77,77,54,81,69,69,80,-1,69,69,81,57,55,67,55,69,70,-1,55,57,79,65,74,63,63,-1,69,62,65,64,64,89,76,-1,65,62,56,56,56,67,82,84,69,70,69,81,69,81,69,69,69,57,57,57,57,-1,86,62,56,55,66,60,67,61,71,69,57,57,66,68,63,54,69,75,55,55,57,62,54,69,74,66,67,69,64,88,73,67,68,-1,69,71,59,64,70,55,70,71,57,57,55,66,65,66,68,57,68,68,71,72,59,57,57,68,72,68,57,79,79,-1,79,79,55,-1,74,54,54,-1,86,59,91,91,64,-1,76,76,76,-1,57,57,90,91,86,86,91,-1,62,55,90,62,61,57,57,63,57,80,57,75,61,65,74,70,57,58,64,74]}},
  {"key":"hitonatsu","icon":"♪","name":"Hitonatsu no Dekigoto","stars":"★★","song":{"title":"Hitonatsu no Dekigoto","bpm":109.9,"fall":1750,"recording":"./audio/karaoke/hitonatsu.mp3","mel":[63,63,58,54,56,63,63,73,63,59,75,82,54,54,54,61,63,63,75,63,69,57,56,61,60,73,64,64,75,58,61,62,62,69,57,54,63,64,56,56,69,56,71,71,60,70,70,61,78,61,61,58,60,59,59,67,55,54,57,61,63,60,61,78,64,78,78,78,62,63,76,65,76,58,79,63,61,61,63,75,63,63,54,63,56,56,54,60,59,54,54,54,55,70,58,57,58,68,72,54,56,75,56,56,56,58,58,56,59,71,59,77,58,75,75,57,70,-1,77,77,77,58,70,57,58,58,58,55,55,55,55,70,58,71,56,59,59,57,56,62,55,68,75,66,54,66,72,61,71,68,55,68,56,54,70,67,64,74,68,59,63,70,75,71,60,71,71,60,71,70,56,54,54,68,68,66,66,66,62,66,68,54,68,56,58,66,58,58,60,57,69,71,77,70,70,90,56,68,56,57,70,71,71,71,71,68,54,64,75,73,54,64,61,59,69,64,69,66,71,58]}},
  {"key":"staywithme","icon":"♪","name":"STAY WITH ME ~Mayonaka no Door~","stars":"★★","song":{"title":"STAY WITH ME ~Mayonaka no Door~","bpm":108.3,"fall":1750,"recording":"./audio/karaoke/staywithme.mp3","mel":[65,65,65,65,61,64,68,68,69,79,69,65,62,65,67,67,65,69,67,-1,55,67,55,77,67,56,76,77,54,67,57,-1,72,-1,65,66,54,62,67,-1,69,69,65,65,65,65,66,67,55,69,67,67,67,67,74,74,55,67,54,55,74,54,55,-1,65,68,57,57,57,69,57,57,54,79,57,69,54,67,69,71,54,71,69,69,69,69,69,69,69,69,69,69,54,55,70,71,70,56,70,71,72,72,72,72,54,72,72,72,54,72,54,69,54,73,58,71,54,55,76,55,60,57,67,70,54,65,65,55,54,65,57,69,69,69,69,69,54,66,54,69,54,-1,60,59,70,70,70,81,54,81,81,81,81,63,67,69,67,67,68,69,69,81,69,64,65,-1,65,65,65,65,65,65,54,65,54,59,54,66,69,59,54,57,67,55,54,54,55,58,60,55,54,54,65,55,73,54,77,-1,77,77,77,77,77,54,77,77,54,54,54,54,54,54,54,72,54,54,54]}}
 ];
 var CATALOGO=LISTA.concat(GRAVACOES);
 function nome(k){for(var i=0;i<CATALOGO.length;i++)if(CATALOGO[i].key===k)return CATALOGO[i].name;return '';}
 function cartao(m){
  return '<div class="kt-audio-clip kt-library-track" role="group" aria-label="'+m.name+'">'+
   '<span class="kt-audio-icon">'+m.icon+'</span>'+
   '<span class="kt-audio-label"><b>'+m.name+'</b><small>'+m.song.bpm+' BPM · '+m.stars+'</small><small class="kt-library-best" data-kt-song-best="'+m.key+'">Sem recorde ainda</small></span>'+
   '<span class="kt-library-actions"><button type="button" class="kt-library-action" data-kt-song-preview="'+m.key+'">▶ Ouvir</button>'+
   '<button type="button" class="kt-library-action" data-kt-song-select="'+m.key+'" data-kt-song-name="'+m.name+' · '+m.song.bpm+' BPM" aria-pressed="false">✓ Selecionar</button></span></div>';
 }
 /* Junta as trilhas ao catálogo `songs` e cria o cartão da biblioteca e a opção do seletor (uma vez só). */
 function montar(songs,doc){
  CATALOGO.forEach(function(m){if(!songs[m.key])songs[m.key]=m.song;});
  if(!doc||!doc.getElementById)return;
  var grade=doc.querySelector('.kt-library-tracks'),sel=doc.getElementById('ktSong');
  if(grade&&!grade.querySelector('[data-kt-song-best="'+LISTA[0].key+'"]'))grade.insertAdjacentHTML('beforeend',CATALOGO.map(cartao).join(''));
  if(sel&&!sel.querySelector('option[value="'+LISTA[0].key+'"]')){
   var grupos=sel.querySelectorAll('optgroup'),grupo=grupos.length?grupos[grupos.length-1]:sel;   // entram junto dos Temas do TsuLiPa⭐World
   CATALOGO.forEach(function(m){var o=doc.createElement('option');o.value=m.key;o.textContent=m.icon+' '+m.name+' · '+m.song.bpm+' BPM · '+m.stars;grupo.appendChild(o);});
  }
 }
 root.KT_MUSICAS_MODOS=LISTA;root.ktMusicasModosMontar=montar;root.ktMusicaModoNome=nome;
 if(typeof module!=='undefined'&&module.exports)module.exports={lista:LISTA,gravacoes:GRAVACOES,montar:montar,nome:nome};
})(typeof window!=='undefined'?window:this);
