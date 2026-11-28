/* Karaoke⭐Time!: biblioteca musical (trilhas, prévia e escolha), vozes do trio e as cabecinhas que falam.
   Saiu do karaoke-time.html em 17/11/2026 (passo 2 do plano da #109). Código igual; o que vinha da sala chega por "o":
   $, tr, LANG (lang), KaraokeAvatar (avatar), CH, kt() (o show), meta() (ktMeta) e muted() (som desligado). */
(function(){
'use strict';
function criar(o){
  var $=o.$,tr=o.tr,KaraokeAvatar=o.avatar,CH=o.CH,LANG=o.lang||'pt';
  function K(){return o.kt();}
  var allowed={
    'tsu-1':1,'tsu-2':1,'tsu-3':1,'tsu-4':1,'tsu-5':1,
    'lirika-1':1,'lirika-2':1,'lirika-3':1,'lirika-4':1,'lirika-5':1,
    'pati-1':1,'pati-2':1,'pati-3':1,'pati-4':1,'pati-5':1
  };
  var avatarIndex={tsu:0,lirika:1,pati:2},avatarColors={tsu:'#9b30d9',lirika:'#4ade80',pati:'#4169e1'},avatarLooks={},voiceIndex={tsu:0,lirika:0,pati:0},reactionIndex={tsu:0,lirika:0,pati:0},animationFrame=0,lastAvatarFrame=0;
  var avatarPoses=['banzai','v','neon','coracao','luz'];
  var avatarReactions={tsu:['💜','✨','⭐'],lirika:['💚','🌸','✨'],pati:['💙','🎵','⭐']};
  var voiceLines={
    tsu:['Oiê!','Eu sou o Tsu!','にげていかない','Eu amo comer pudim.','hehe~'],
    lirika:['Oi, gente linda!','Li - ri - ka!','ゆめはぜったい','Tudo bem com vocês?','hehe~'],
    pati:['Oi gente, meu nome é Pati!','Bem gamer, tals...','いっておきたい','Um beijo. Chu!','hehe~']
  };
  var player=null,playingId='',headObserver=null,headsVisible=false;
  var root=$('ktAudioLibrary'),status=$('ktAudioStatus');
  function updateButtons(){
    if(!root)return;
    var activeVoice=playingId.split('-')[0];
    [].forEach.call(root.querySelectorAll('[data-kt-voice-group]'),function(button){
      var active=button.dataset.ktVoiceGroup===activeVoice&&!!player;
      button.setAttribute('aria-pressed',active?'true':'false');
      button.classList.toggle('is-speaking',active);
    });
    [].forEach.call(root.querySelectorAll('[data-kt-audio]'),function(button){
      var active=button.dataset.ktAudio===playingId;
      button.setAttribute('aria-pressed',active?'true':'false');
      var label=button.querySelector('.kt-audio-action');
      if(label)label.textContent=active?'■ '+tr('Parar'):'▶ '+tr('Ouvir');
    });
  }
  function stop(message){
    var old=player;player=null;playingId='';
    if(old){try{old.pause();old.removeAttribute('src');old.load();}catch(e){}}
    updateButtons();
    if(status && (message || old))status.textContent=message||'';
  }
  function play(id,restart){
    if(!allowed[id]||!root)return;
    if(K())K().stopPreview(false);
    if(o.muted()){if(status)status.textContent=tr('O som está desativado. Ative o botão de som para ouvir.');return;}
    if(player&&playingId===id&&!restart){stop('');return;}
    stop('');
    if(typeof window.Audio!=='function'){if(status)status.textContent=tr('Este navegador não oferece reprodução de áudio.');return;}
    var next;
    try{
      next=new Audio('./audio/'+id+'.mp3?v=1');
      next.preload='none';next.volume=.6;if(window.TW_AUDIO)window.TW_AUDIO.midia(next,.6);player=next;playingId=id;
    }catch(e){if(status)status.textContent=tr('Não foi possível preparar este áudio.');return;}
    updateButtons();
    if(status){var voiceStatus={pt:'♪ Voz de personagem reproduzindo',en:'♪ Character voice playing',id:'♪ Suara karakter sedang diputar',es:'♪ Voz de personaje en reproducción',th:'♪ กำลังเล่นเสียงตัวละคร',ja:'♪ キャラクター音声を再生中'};status.textContent=voiceStatus[LANG]||voiceStatus.pt;}
    function finish(message){if(player!==next)return;stop(message);}
    next.addEventListener('ended',function(){finish('');},{once:true});
    next.addEventListener('error',function(){finish(tr('Não foi possível reproduzir este áudio.'));},{once:true});
    try{
      var promise=next.play();
      if(promise&&typeof promise.catch==='function')promise.catch(function(){finish(tr('Toque em Ouvir para tentar novamente.'));});
    }catch(e){finish(tr('Não foi possível reproduzir este áudio.'));}
  }
  function syncTracks(){
    if(!root)return;var selector=$('ktSong');if(!selector)return;
    [].forEach.call(root.querySelectorAll('[data-kt-song-select]'),function(button){
      var selected=button.dataset.ktSongSelect===selector.value;
      button.setAttribute('aria-pressed',selected?'true':'false');
      button.disabled=!!selector.disabled;
      var track=button.closest('.kt-library-track');
      if(track)track.classList.toggle('kt-song-selected',selected);
    });
  }
  function syncLibraryStart(){
    var original=$('ktStart'),button=$('ktLibraryStart');
    if(!original||!button)return;
    button.disabled=!!original.disabled;
    button.textContent=original.textContent;
  }
  function speakGroup(group,button){
    if(!Object.prototype.hasOwnProperty.call(voiceLines,group))return;
    var list=voiceLines[group],index=voiceIndex[group]||0,id=group+'-'+(index+1);
    voiceIndex[group]=(index+1)%list.length;
    var caption=root.querySelector('[data-kt-voice-caption="'+group+'"]');
    if(caption)caption.textContent=list[index];
    if(button){
      var reactions=avatarReactions[group]||['✨'];
      button.dataset.ktReaction=reactions[reactionIndex[group]%reactions.length];
      reactionIndex[group]=(reactionIndex[group]+1)%reactions.length;
      button.dataset.ktReactionUntil=String(performance.now()+850);
      button.classList.remove('kt-reacting');
      button.offsetWidth;
      if(!motionReduced())button.classList.add('kt-reacting');
      button.setAttribute('aria-label',tr('Falar com')+' '+group.charAt(0).toUpperCase()+group.slice(1)+', '+tr('voz')+' '+(index+1)+' de '+list.length);
    }
    if(status)status.textContent=group.charAt(0).toUpperCase()+group.slice(1)+' · '+list[index];
    play(id,true);
  }
  function motionReduced(){
    try{return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}
  }
  function drawHeads(now){
    if(!root||typeof KaraokeAvatar==='undefined'||typeof CH==='undefined')return;
    now=Number.isFinite(now)?now:performance.now();
    var frame=Math.floor(now/16.6667);
    [].forEach.call(root.querySelectorAll('[data-kt-voice-group]'),function(button){
      var group=button.dataset.ktVoiceGroup,index=avatarIndex[group],canvas=button.querySelector('canvas');
      if(!button.hasAttribute('aria-label'))button.setAttribute('aria-label',tr('Falar com')+' '+group.charAt(0).toUpperCase()+group.slice(1));
      if(index===undefined||!canvas||!CH[index])return;
      var ctx=canvas.getContext('2d');if(!ctx)return;
      /* Cópia visual exclusiva da vitrine: preserva cabelo/rosto e não altera CH. */
      var cached=avatarLooks[group];
      if(!cached||cached.source!==CH[index]){
        cached={source:CH[index],value:Object.assign({},CH[index],{out:'zipper',outcol:avatarColors[group]})};
        avatarLooks[group]=cached;
      }
      var speaking=button.classList.contains('is-speaking');
      var reacting=now<(Number(button.dataset.ktReactionUntil)||0);
      var phase=Math.floor(frame/32)+index;
      var pose=reacting?['coracao','banzai','neon'][phase%3]:(speaking?avatarPoses[phase%avatarPoses.length]:'v');
      var expression=(speaking||reacting)?(phase%2?3:0):2;
      button.classList.toggle('kt-reacting',reacting&&!motionReduced());
      button.style.setProperty('--kt-avatar-color',avatarColors[group]);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      try{KaraokeAvatar.draw(ctx,cached.value,44,91,1.45,pose,expression,frame+index*11,false);}catch(e){}
    });
  }
  function animateHeads(now){
    animationFrame=0;
    if(!root||!headsVisible||document.hidden)return;
    if(now-lastAvatarFrame>=80){drawHeads(now);lastAvatarFrame=now;}
    animationFrame=requestAnimationFrame(animateHeads);
  }
  function startHeadAnimation(){
    if(!root||!headsVisible||document.hidden)return;
    drawHeads(performance.now());
    if(motionReduced()||animationFrame)return;
    animationFrame=requestAnimationFrame(animateHeads);
  }
  function stopHeadAnimation(){
    if(animationFrame&&typeof cancelAnimationFrame==='function')cancelAnimationFrame(animationFrame);
    animationFrame=0;
  }
  function observeHeads(){
    var heads=root&&root.querySelector('.kt-library-heads');
    if(!heads)return;
    if(typeof IntersectionObserver==='function'){
      headObserver=new IntersectionObserver(function(entries){
        headsVisible=entries.some(function(entry){return entry.isIntersecting&&entry.intersectionRatio>=.08;});
        if(headsVisible)startHeadAnimation();else stopHeadAnimation();
      },{threshold:.08});
      headObserver.observe(heads);
    }else{headsVisible=true;startHeadAnimation();}
  }
  function refresh(){
    if(!root)return;
    var personal={};
    try{var M=o.meta();if(M&&typeof M.personalSongs==='function')personal=M.personalSongs()||{};}catch(e){}
    [].forEach.call(root.querySelectorAll('[data-kt-song-best]'),function(node){
      var row=personal[node.dataset.ktSongBest];
      node.textContent=row&&Number.isFinite(row.score)
        ?tr('Seu recorde pessoal')+': '+Math.round(row.score).toLocaleString('pt-BR')+' pts'
        :tr('Sem recorde ainda');
    });
    drawHeads();
  }
  var songSelector=$('ktSong');if(songSelector)songSelector.addEventListener('change',syncTracks);
  if(root)root.addEventListener('click',function(event){
    var libraryStart=event.target.closest&&event.target.closest('[data-kt-library-start]');
    if(libraryStart&&root.contains(libraryStart)){
      var originalStart=$('ktStart');
      if(originalStart&&!originalStart.disabled)originalStart.click();
      return;
    }
    var voiceChoice=event.target.closest&&event.target.closest('[data-kt-voice-group]');
    if(voiceChoice&&root.contains(voiceChoice)){speakGroup(voiceChoice.dataset.ktVoiceGroup,voiceChoice);return;}
    var songPreview=event.target.closest&&event.target.closest('[data-kt-song-preview]');
    if(songPreview&&root.contains(songPreview)){if(K())K().togglePreview(songPreview.dataset.ktSongPreview);return;}
    var songChoice=event.target.closest&&event.target.closest('[data-kt-song-select]');
    if(songChoice&&root.contains(songChoice)){
      if(player)stop('');
      var selector=$('ktSong');
      if(!selector||selector.disabled){if(status)status.textContent=tr('A trilha pode ser escolhida quando não houver show em andamento.');return;}
      if(K())K().stopPreview(true);
      selector.value=songChoice.dataset.ktSongSelect;
      selector.dispatchEvent(new Event('change',{bubbles:true}));syncTracks();
      if(status)status.textContent=tr('Trilha selecionada')+' · '+(songChoice.dataset.ktSongName||selector.value);
      return;
    }
    var button=event.target.closest&&event.target.closest('[data-kt-audio]');
    if(button&&root.contains(button))play(button.dataset.ktAudio);
  });
  document.addEventListener('visibilitychange',function(){if(document.hidden){if(player)stop('');stopHeadAnimation();}else if(headsVisible)startHeadAnimation();});
  window.addEventListener('pagehide',function(){stopHeadAnimation();if(headObserver)headObserver.disconnect();stop('');});
  var originalStart=$('ktStart');
  if(originalStart&&typeof MutationObserver==='function')
    new MutationObserver(syncLibraryStart).observe(originalStart,{attributes:true,attributeFilter:['disabled'],childList:true,characterData:true,subtree:true});
  if(songSelector&&typeof MutationObserver==='function')
    new MutationObserver(syncTracks).observe(songSelector,{attributes:true,attributeFilter:['disabled']});
  refresh();syncTracks();syncLibraryStart();observeHeads();
  if(root&&songSelector&&document.documentElement.classList.contains('kt-no-site'))
    document.documentElement.classList.add('kt-library-ready');
  return {play:play,stop:function(){stop('');},refresh:refresh,speakGroup:speakGroup};
}
window.KaraokeBiblioteca={criar:criar};
})();
