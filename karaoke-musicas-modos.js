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
 function nome(k){for(var i=0;i<LISTA.length;i++)if(LISTA[i].key===k)return LISTA[i].name;return '';}
 function cartao(m){
  return '<div class="kt-audio-clip kt-library-track" role="group" aria-label="'+m.name+'">'+
   '<span class="kt-audio-icon">'+m.icon+'</span>'+
   '<span class="kt-audio-label"><b>'+m.name+'</b><small>'+m.song.bpm+' BPM · '+m.stars+'</small><small class="kt-library-best" data-kt-song-best="'+m.key+'">Sem recorde ainda</small></span>'+
   '<span class="kt-library-actions"><button type="button" class="kt-library-action" data-kt-song-preview="'+m.key+'">▶ Ouvir</button>'+
   '<button type="button" class="kt-library-action" data-kt-song-select="'+m.key+'" data-kt-song-name="'+m.name+' · '+m.song.bpm+' BPM" aria-pressed="false">✓ Selecionar</button></span></div>';
 }
 /* Junta as trilhas ao catálogo `songs` e cria o cartão da biblioteca e a opção do seletor (uma vez só). */
 function montar(songs,doc){
  LISTA.forEach(function(m){if(!songs[m.key])songs[m.key]=m.song;});
  if(!doc||!doc.getElementById)return;
  var grade=doc.querySelector('.kt-library-tracks'),sel=doc.getElementById('ktSong');
  if(grade&&!grade.querySelector('[data-kt-song-best="'+LISTA[0].key+'"]'))grade.insertAdjacentHTML('beforeend',LISTA.map(cartao).join(''));
  if(sel&&!sel.querySelector('option[value="'+LISTA[0].key+'"]')){
   var grupos=sel.querySelectorAll('optgroup'),grupo=grupos.length?grupos[grupos.length-1]:sel;   // entram junto dos Temas do TsuLiPa⭐World
   LISTA.forEach(function(m){var o=doc.createElement('option');o.value=m.key;o.textContent=m.icon+' '+m.name+' · '+m.song.bpm+' BPM · '+m.stars;grupo.appendChild(o);});
  }
 }
 root.KT_MUSICAS_MODOS=LISTA;root.ktMusicasModosMontar=montar;root.ktMusicaModoNome=nome;
 if(typeof module!=='undefined'&&module.exports)module.exports={lista:LISTA,montar:montar,nome:nome};
})(typeof window!=='undefined'?window:this);
