(function(root,factory){
 "use strict";
 var api=factory();
 if(typeof module==="object"&&module.exports)module.exports=api;
 else root.KaraokeMusicPreview=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
 "use strict";
 function create(options){
  options=options||{};
  var current=null,timer=0,lastUi=0,DURATION=59000,volume=.7;
  function el(id){return options.getElement?options.getElement(id):document.getElementById(id);}
  function tr(value){return options.translate?options.translate(value):value;}
  function elapsed(){
   if(!current)return 0;
   if(current.paused)return current.elapsed||0;
   var ctx=current.context;
   if(!ctx||!current.audioClock)return current.elapsed||0;
   return Math.max(0,Math.min(DURATION,(ctx.currentTime-current.audioOrigin)*1000));
  }
  function render(message){
   var title=el("ktPreviewTitle"),status=el("ktPreviewStatus"),progress=el("ktPreviewProgress"),time=el("ktPreviewTime"),toggle=el("ktPreviewToggle"),stopButton=el("ktPreviewStop"),globalStatus=el("ktAudioStatus");
   var ms=elapsed(),playing=!!(current&&!current.paused),key=current&&current.songKey;
   if(title)title.textContent=current?current.song.title:tr("Player musical");
   if(status)status.textContent=message||(playing?tr("Tocando"):current?tr("Prévia pausada."):tr("Escolha uma música para ouvir."));
   if(progress)progress.value=ms;
   if(time)time.textContent=String(Math.floor(ms/60000)).padStart(2,"0")+":"+String(Math.floor(ms/1000)%60).padStart(2,"0")+" / 00:59";
   if(toggle){toggle.disabled=!!(options.isBusy&&options.isBusy());toggle.textContent=playing?"⏸ "+tr("Pausar"):current?"▶ "+tr("Retomar"):"▶ "+tr("Ouvir");}
   if(stopButton)stopButton.disabled=!current;
   if(globalStatus&&message)globalStatus.textContent=message;
   var volumeControl=el("ktPreviewVolume");if(volumeControl&&Number(volumeControl.value)!==Math.round(volume*100))volumeControl.value=Math.round(volume*100);
   var rootElement=el("ktAudioLibrary");
   if(rootElement&&rootElement.querySelectorAll)[].forEach.call(rootElement.querySelectorAll("[data-kt-song-preview]"),function(button){
    var active=button.dataset.ktSongPreview===key;
    button.textContent=active&&playing?"⏸ "+tr("Pausar"):active&&current?"▶ "+tr("Retomar"):"▶ "+tr("Ouvir");
    button.setAttribute("aria-pressed",active&&playing?"true":"false");
    button.disabled=!!(options.isBusy&&options.isBusy());
   });
  }
  function stop(restoreAmbient,message){
   if(timer){clearInterval(timer);timer=0;}
   var had=!!current;current=null;
   if(had&&options.silence)options.silence();
   render(message||"");
   if(restoreAmbient&&had&&!(options.isBusy&&options.isBusy())&&!(options.isMuted&&options.isMuted())&&options.restoreAmbient)options.restoreAmbient();
   return had;
  }
  function schedule(){
   if(!current||current.paused||!current.audioClock||!current.context)return;
   if(current.context.state!=="running"){pause();return;}
   var ms=elapsed();
   while(current.audioStep<current.total&&current.audioStep*current.step<ms+220)options.beat(current.audioStep++,current);
   if(performance.now()-lastUi>=100){lastUi=performance.now();render();}
   if(ms>=DURATION)stop(true,tr("Prévia finalizada."));
  }
  function arm(target,fromMs){
   if(current!==target)return;
   var ctx=options.getContext?options.getContext():null;
   function begin(){
    if(current!==target)return;
    if(!ctx||ctx.state!=="running"){stop(true,tr("Não foi possível iniciar a prévia musical."));return;}
    target.context=ctx;target.elapsed=Math.max(0,fromMs||0);
    target.audioOrigin=ctx.currentTime+.06-target.elapsed/1000;
    target.audioClock=true;target.paused=false;
    target.audioStep=Math.max(0,Math.ceil(target.elapsed/target.step));
    if(!timer)timer=setInterval(schedule,25);
    render();schedule();
   }
   if(ctx&&ctx.state==="running")begin();
   else{
    var pending=options.getResumePromise?options.getResumePromise():null;
    if(pending&&typeof pending.then==="function")pending.then(begin,begin);
    else begin();
   }
  }
  function play(key){
   if(options.isBusy&&options.isBusy()){var busy=el("ktAudioStatus");if(busy)busy.textContent=tr("A prévia musical só pode tocar fora de uma partida.");return false;}
   var song=options.getSong&&options.getSong(key);
   if(!song)return false;
   if(options.isMuted&&options.isMuted()){var muted=el("ktAudioStatus");if(muted)muted.textContent=tr("O som está desativado. Ative o botão de som para ouvir.");return false;}
   if(current&&current.songKey===key){if(current.paused)return resume();return pause();}
   stop(false);
   if(options.stopVoicePreview)options.stopVoicePreview();
   if(options.stopAmbient)options.stopAmbient();
   var step=60000/song.bpm/2,target={songKey:key,song:song,step:step,total:Math.floor(DURATION/step),audioStep:0,audioOrigin:0,audioClock:false,paused:false,elapsed:0,cuesByStep:{}};
   current=target;lastUi=0;render();arm(target,0);return true;
  }
  function pause(){
   if(!current||current.paused)return false;
   current.elapsed=elapsed();current.paused=true;
   if(timer){clearInterval(timer);timer=0;}
   if(options.silence)options.silence();
   render();return true;
  }
  function resume(){if(!current||!current.paused||(options.isBusy&&options.isBusy()))return false;arm(current,current.elapsed);return true;}
  function toggle(key){
   if(current&&(!key||current.songKey===key)){if(current.paused)return resume();return pause();}
   return play(key||(options.currentSong?options.currentSong():"normal"));
  }
  function state(){return current?{songKey:current.songKey,paused:current.paused,elapsed:elapsed()}:null;}
  var volumeControl=el("ktPreviewVolume");
  if(options.setVolume)options.setVolume(volume);
  if(volumeControl)volumeControl.addEventListener("input",function(){
   volume=Math.max(0,Math.min(1,(Number(volumeControl.value)||0)/100));
   if(options.setVolume)options.setVolume(volume);
  });
  render();
  return Object.freeze({play:play,pause:pause,resume:resume,stop:stop,toggle:toggle,state:state});

 }
 return Object.freeze({create:create});
});
