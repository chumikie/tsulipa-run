/* Karaoke⭐Time!: o show de ritmo — trilhas e vozes sintetizadas, notas, acertos, combo, pausa, retomada e fim do show.
   Saiu do karaoke-time.html em 17/11/2026 (passo 4, o último do plano da #109). O código é o mesmo; tudo o que vem da sala
   chega por "D" e é lido na hora (D.nome()), porque alguns valores são trocados depois (ex.: krUI). Os dois que o show
   grava na sala (krRhythmRun e krRhythmLastSecond) usam D.nome(valor). */
(function(){
function criar(D){
var run=null,songKey='normal',voices=new Set(),audioTimer=0,lastUI=0,lastReaction=0,lastResult=null,lastCheckpoint=0,audioStateContext=null;
var songs={
 normal:{title:'Brilha Comigo ⭐',bpm:108,lead:'triangle',style:'pop',fall:1750,cpb:1,
  ch:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],
  mel:[72,-1,74,76,-1,79,-1,76, 74,-1,71,74,-1,76,-1,-1, 72,-1,76,79,-1,81,79,-1, 77,-1,76,74,-1,72,-1,-1,
       79,-1,79,81,-1,79,76,-1, 74,-1,76,79,-1,83,-1,-1, 84,-1,83,81,-1,79,76,-1, 77,-1,76,74,-1,72,-1,-1]},
 fast:{title:'Love × Debut 💗',bpm:132,lead:'square',style:'dance',fall:1550,cpb:1,
  ch:[[59,62,66],[55,59,62],[62,66,69],[57,61,64]],
  mel:[74,-1,78,-1,81,-1,78,-1, 79,-1,78,76,-1,74,-1,-1, 74,-1,78,-1,81,-1,86,-1, 85,-1,83,81,-1,76,-1,-1,
       83,83,-1,81,-1,78,81,-1, 79,-1,81,83,-1,86,-1,-1, 86,-1,85,83,-1,81,78,-1, 81,-1,83,85,-1,86,-1,-1]},
 chill:{title:'Doce Melodia 🌙',bpm:90,lead:'sine',style:'ballad',fall:2000,cpb:1,
  ch:[[57,61,64,68],[54,57,61,64],[59,62,66,69],[52,56,59,62]],
  mel:[76,-1,-1,73,-1,-1,71,-1, 73,-1,-1,-1,69,-1,-1,-1, 74,-1,-1,76,-1,-1,78,-1, 76,-1,-1,-1,-1,-1,-1,-1,
       76,-1,78,80,-1,-1,81,-1, 78,-1,-1,-1,76,-1,-1,-1, 74,-1,76,-1,78,-1,-1,74, 76,-1,-1,-1,-1,-1,-1,-1]},
 tema:{title:'TsuLiPa⭐World 🌷',bpm:116,lead:'square',style:'pop',fall:1700,cpb:1,
  ch:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],
  mel:[81,84,86,84,81,79,81,-1, 79,81,84,81,79,76,79,-1, 76,79,81,79,76,74,76,-1, 74,76,79,81,84,81,84,-1,
       81,-1,84,86,-1,84,81,-1, 79,-1,81,84,-1,79,76,-1, 76,-1,79,81,-1,79,76,-1, 74,76,79,-1,84,-1,-1,-1]},
 corrida:{title:'Center⭐Run! 🏁',bpm:120,lead:'square',style:'run',fall:1500,cpb:2,
  ch:[[60,64,67],[53,57,60],[55,59,62],[60,64,67]],
  mel:[72,76,79,76,74,77,81,77, 72,76,79,84,83,79,76,79, 72,-1,79,-1,74,-1,81,-1, 79,-1,84,-1,83,-1,79,-1,
       72,76,79,76,74,77,81,77, 72,76,79,84,83,79,76,79, 81,79,77,76,74,76,77,79, 84,-1,83,-1,84,-1,-1,-1]},
 gacha:{title:'Star⭐Gacha! 🎰',bpm:124,lead:'square',style:'pop',fall:1600,cpb:1,
  ch:[[60,64,67],[55,59,62],[57,60,64],[53,57,60]],
  mel:[84,-1,79,84,88,-1,86,84, 83,-1,79,-1,86,84,83,79, 81,-1,84,88,91,-1,88,84, 89,88,86,84,86,88,91,-1,
       84,-1,-1,79,84,-1,88,-1, 86,-1,84,-1,83,-1,79,-1, 81,-1,84,-1,88,-1,91,-1, 89,-1,88,-1,86,-1,84,-1]},
 duo:{title:'Moon⭐Duo! 🌛',bpm:84,lead:'sine',style:'box',fall:2100,cpb:1,
  ch:[[53,57,60,64],[52,55,59,62],[50,53,57,60],[48,52,55,59]],
  mel:[81,-1,-1,79,76,-1,79,-1, 76,-1,74,-1,72,-1,-1,-1, 77,-1,76,74,72,-1,74,-1, 76,-1,-1,72,71,-1,72,-1,
       81,-1,84,-1,81,79,-1,-1, 79,-1,76,-1,74,-1,-1,-1, 77,-1,81,79,77,-1,76,-1, 74,-1,72,-1,71,-1,72,-1]}
};
/* Cada musica e uma melodia; -1 marca pausas. */if(typeof ktMusicasModosMontar==='function')ktMusicasModosMontar(songs,document);
Object.keys(songs).forEach(function(k){var c=songs[k],cnt={},tot=0;c.mel.forEach(function(m){if(m>=0){cnt[m]=(cnt[m]||0)+1;tot++;}});var acc=0;c.lanes={};Object.keys(cnt).map(Number).sort(function(a,b){return a-b;}).forEach(function(m){c.lanes[m]=Math.min(3,Math.floor((acc+cnt[m]/2)*4/tot));acc+=cnt[m];});});
/* Deterministic note map keeps rests, including on strong beats. */
function makeNoteMap(song,total,step,start){var notes=[],heard=0,lastLane=-1,streak=0,lastPitch=-1;
 for(var i=0;i<total;i++){var pitch=song.mel[i%song.mel.length];if(pitch<0)continue;
  var volta=Math.floor(i/song.mel.length),progress=i/total;
  var keep=volta>=2||progress>=.65||progress>=.35&&heard%5!==4||progress<.35&&heard%3!==2;
  heard++;if(!keep)continue;
  var lane=song.lanes[pitch];if(lane===lastLane&&streak>=3){var toward=pitch>=lastPitch?1:-1;lane=Math.max(0,Math.min(3,lane+toward));if(lane===lastLane)lane=lastLane===3?2:lastLane+1;}
  streak=lane===lastLane?streak+1:1;lastLane=lane;lastPitch=pitch;
  /* kNow() ja desconta a latencia de saida: somar outra aqui desloca o acerto. */
  var at=start+i*step;notes.push({lane:lane,at:at,done:false,idx:i});
  /* Duas teclas simultaneas apenas no primeiro tempo do compasso; nunca em pausas. */
  if((volta>=2||progress>=.5)&&i%8===0&&Math.floor(i/8)%2===0){var pair=lane<=1?lane+2:lane-2;notes.push({lane:pair,at:at,done:false,idx:i});}
 }return notes;}
/* Janelas de julgamento coincidem com centro e halo visual. */
/* Zona de acerto (18/11/2026, a pedido do dono: "mais acessível"): BOM foi de ±100 para ±150 ms e PERFECT de ±45
   para ±55 ms. O halo desenhado na pista sai destes mesmos números, então o que se vê continua sendo o que vale.
   O teto de pontos não mudou (PERFECT ainda pede precisão); quem errava por pouco agora faz BOM em vez de MISS. */
var KT_HIT_WINDOWS={perfect:55,good:150},KT_NOTE_PX_PER_MS=.21,KT_NOTE_HALF_HEIGHT=4;
function ktNoteY(delta,fall,top,target){var halo=KT_HIT_WINDOWS.good*KT_NOTE_PX_PER_MS;
 if(delta>=-KT_HIT_WINDOWS.good)return target+delta*KT_NOTE_PX_PER_MS;
 var duration=Math.max(1,fall-KT_HIT_WINDOWS.good),travel=Math.max(1,target-halo-top),progress=Math.max(0,Math.min(1,(delta+fall)/duration));
 /* Chegada previsivel: a curva antiga ficava quase parada no alto e disparava no fim. */
 return top+travel*Math.pow(progress,3);}
function hz(m){return 440*Math.pow(2,(m-69)/12);}
function active(){return !!run;}
function ktOutputLatencyMs(){
 if(!D.AC())return 0;
 var seconds=Number.isFinite(D.AC().outputLatency)?D.AC().outputLatency:(Number.isFinite(D.AC().baseLatency)?D.AC().baseLatency:0);
 return Math.min(500,Math.max(0,seconds*1000));
}
function ktVincularEstadoAudio(ctx){
 if(!ctx||ctx!==D.AC()||audioStateContext===ctx||!ctx.addEventListener)return;
 audioStateContext=ctx;
 ctx.addEventListener('statechange',function(){
  if(ctx!==D.AC()||!run||!run.audioReady||!run.audioClock||run.paused||ctx.state==='running')return;
  run.audioClock=false;
  pause(true);
 });
}
function ktPrepararRelogioAudio(target,prepareMs,elapsed,onReady){
 var ctx=D.ac()(),waitStarted=performance.now(),pending=D.acResumePromise();
 function arm(){
  if(run!==target)return;
  var now=performance.now(),audioReady=!!(ctx&&ctx.state==='running'),waitMs=Math.max(0,now-waitStarted);
  target.start=now+prepareMs-elapsed;
  target.audioOrigin=audioReady?ctx.currentTime+prepareMs/1000-elapsed/1000:0;
  target.audioClock=audioReady;target.audioReady=true;
  target.audioStep=Math.max(0,Math.ceil(elapsed/target.step));
  target.notes.forEach(function(n){n.at=target.start+n.idx*target.step;});
  target.feedbackUntil=target.start;
  if(audioReady){if(!audioTimer)audioTimer=setInterval(schedule,25);schedule();}
  if(onReady)onReady(audioReady,waitMs);
 }
 ktVincularEstadoAudio(ctx);
 if(ctx&&ctx.state==='running')arm();
 else if(pending&&typeof pending.then==='function')pending.then(arm,arm);
 else arm();
}
function silence(){voices.forEach(function(o){try{o.stop();}catch(e){}});voices.clear();}
var ktPreviewRouting=false;
/* Som das músicas (15/11/2026): mesma partitura e mesmo relógio; só o timbre melhorou.
   Mixer com compressor suave e eco no tempo da música, filtro nas ondas quadradas (menos "bip"),
   esquerda/direita, bateria com ruído (caixa e chimbal), virada antes do refrão e acorde final. */
var ktMixer=null,ktRuidoBuf=null;
function ktMix(){if(ktMixer&&ktMixer.ctx===D.AC())return ktMixer;var m={ctx:D.AC(),in:D.AC().destination,eco:null,d:null};
 try{var comp=D.AC().createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=14;comp.ratio.value=3;comp.attack.value=.004;comp.release.value=.22;
  m.in=D.AC().createGain();m.in.gain.value=1.1;m.in.connect(comp);comp.connect(globalThis.TW_AUDIO ? globalThis.TW_AUDIO.saida(D.AC()) : D.AC().destination);
  m.eco=D.AC().createGain();m.eco.gain.value=.2;m.d=D.AC().createDelay(1);m.d.delayTime.value=.3;var fb=D.AC().createGain(),lp=D.AC().createBiquadFilter();fb.gain.value=.3;lp.type='lowpass';lp.frequency.value=2300;
  m.eco.connect(m.d);m.d.connect(lp);lp.connect(fb);fb.connect(m.d);lp.connect(m.in);}catch(e){m.in=globalThis.TW_AUDIO ? globalThis.TW_AUDIO.saida(D.AC()) : D.AC().destination;m.eco=null;m.d=null;}
 ktMixer=m;return m;}
function voice(freq,dur,time,vol,type,pan,eco){if(D.muted()||!D.AC())return;var t=Math.max(D.AC().currentTime,time),o=D.AC().createOscillator(),g=D.AC().createGain(),extra=[],no=g,mx=ktPreviewRouting?null:ktMix();o.type=type||'sine';o.frequency.setValueAtTime(freq,t);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(g);
 try{if(o.type==='square'||o.type==='sawtooth'){var f=D.AC().createBiquadFilter();f.type='lowpass';f.frequency.setValueAtTime(Math.min(4200,Math.max(900,freq*5)),t);f.Q.value=.7;no.connect(f);no=f;extra.push(f);}
  if(pan&&D.AC().createStereoPanner){var pn=D.AC().createStereoPanner();pn.pan.value=Math.max(-1,Math.min(1,pan));no.connect(pn);no=pn;extra.push(pn);}}catch(e){}
 no.connect(ktPreviewRouting?previewPlayer.output(D.AC()):mx.in);if(eco&&mx&&mx.eco)no.connect(mx.eco);
 voices.add(o);o.onended=function(){voices.delete(o);o.disconnect();g.disconnect();extra.forEach(function(n){n.disconnect();});};o.start(t);o.stop(t+dur+.02);}
function ruido(time,dur,vol,hp,pan){if(D.muted()||!D.AC())return;
 if(!ktRuidoBuf||ktRuidoBuf.sampleRate!==D.AC().sampleRate){var n=Math.floor(D.AC().sampleRate*.5),b=D.AC().createBuffer(1,n,D.AC().sampleRate),d=b.getChannelData(0),sd=12345;for(var i=0;i<n;i++){sd=(sd*1103515245+12345)&0x7fffffff;d[i]=sd/0x3fffffff-1;}ktRuidoBuf=b;}   /* ruído fixo: nada sorteado */
 var t=Math.max(D.AC().currentTime,time),src=D.AC().createBufferSource(),f=D.AC().createBiquadFilter(),g=D.AC().createGain(),no=g,pn=null;src.buffer=ktRuidoBuf;f.type='highpass';f.frequency.value=hp||2000;
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);src.connect(f);f.connect(g);
 try{if(pan&&D.AC().createStereoPanner){pn=D.AC().createStereoPanner();pn.pan.value=pan;g.connect(pn);no=pn;}}catch(e){}
 no.connect(ktPreviewRouting?previewPlayer.output(D.AC()):ktMix().in);voices.add(src);src.onended=function(){voices.delete(src);src.disconnect();f.disconnect();g.disconnect();if(pn)pn.disconnect();};src.start(t,(time*7.3)%.3);src.stop(t+dur+.02);}
function ktBumbo(time,vol){if(D.muted()||!D.AC())return;var t=Math.max(D.AC().currentTime,time),o=D.AC().createOscillator(),g=D.AC().createGain();o.type='sine';o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(46,t+.12);
 g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.0001,t+.24);o.connect(g);g.connect(ktPreviewRouting?previewPlayer.output(D.AC()):ktMix().in);voices.add(o);o.onended=function(){voices.delete(o);o.disconnect();g.disconnect();};o.start(t);o.stop(t+.26);}
// O áudio usa o mesmo relógio das notas. Uma retomada inicia na posição já jogada.
var decodedRecording=null, loadingRecordings=new Map(), startRequest=0;
function loadRecording(song,ctx){
 if(decodedRecording && decodedRecording.song===song)return Promise.resolve(decodedRecording.buffer);
 if(loadingRecordings.has(song))return loadingRecordings.get(song);
 var pending=fetch(song.recording).then(function(response){
   if(!response.ok)throw Error('recording');
   return response.arrayBuffer();
 }).then(function(bytes){return ctx.decodeAudioData(bytes);}).then(function(buffer){
   decodedRecording={song:song,buffer:buffer};return buffer;
 }).finally(function(){loadingRecordings.delete(song);});
 loadingRecordings.set(song,pending);return pending;
}
function recordedBeat(playback){
 if(D.muted() || !playback.recordingBuffer || (playback.recordingSource && voices.has(playback.recordingSource)))return;
 var ctx=D.AC(), offset=Math.max(0,ctx.currentTime-playback.audioOrigin);
 if(offset>=playback.recordingBuffer.duration)return;
 var source=ctx.createBufferSource();
 source.buffer=playback.recordingBuffer;
 source.connect(ktPreviewRouting?previewPlayer.output(ctx):ktMix().in);
 playback.recordingSource=source;voices.add(source);
 source.onended=function(){voices.delete(source);source.disconnect();};
 source.start(Math.max(ctx.currentTime,playback.audioOrigin),offset);
}
function beat(i,target){var playback=target||run;if(!playback||!D.AC()||!playback.audioReady||!playback.audioClock||D.AC().state!=='running')return;var c=playback.song,t=playback.audioOrigin+i*playback.step/1000;if(c.recording){recordedBeat(playback);return;}if(t<D.AC().currentTime-.05)return;
var p=i%8,len=c.mel.length,step=playback.step/1000,volta=Math.floor(i/len),up=volta>=2?2:0,chord=c.ch[Math.floor(i/(8/c.cpb))%c.ch.length].map(function(n){return n+up;}),root=chord[0];while(root>52)root-=12;
/* A partir da 3ª volta, o refrão sobe um tom; pistas ficam fixas. */
if(playback===run&&i%len===0&&volta===2&&!playback.auto){playback.feedback='Refrão! ✨';playback.feedbackUntil=performance.now()+(t-D.AC().currentTime)*1000+1200;}
var st=c.style,soft=st==='ballad'||st==='box';
/* bateria */
if(!ktPreviewRouting){var mxd=ktMix();if(mxd.d){var alvoEco=Math.min(.6,step*1.5);if(Math.abs(mxd.d.delayTime.value-alvoEco)>.005)mxd.d.delayTime.setValueAtTime(alvoEco,D.AC().currentTime);}}   /* eco no tempo da música */
var vira=volta===1&&(i%len)>=len-4;   /* virada de bateria antes do refrão subir de tom */
if(st==='dance'||st==='run'){if(p%2===0)ktBumbo(t,.11);}else if(p===0||(!soft&&p===4))ktBumbo(t,.095);
if(!soft&&(p===2||p===6)){voice(196,.07,t,.022,'triangle',-.08);ruido(t,.13,.05,1500,-.08);}
if(vira&&!soft){ruido(t,.07,.03+.008*((i%len)-(len-4)),1800,.15);ruido(t+step*.5,.06,.028,2200,-.15);}
if(soft&&p===4)ruido(t,.05,.012,3000,.2);
/* Energia de pista no estilo hi-NRG (inspirado nas trilhas dance de jogos dos anos 2000, sem copiar melodia nenhuma):
   palmas em camadas no 2 e no 4, chimbal aberto no contratempo e arpejo de sintetizador em semicolcheias. */
var nrg=st==='dance'||st==='run'||st==='pop';
if(nrg&&(p===2||p===6)){ruido(t,.09,.03,1100,.12);ruido(t+.011,.08,.024,1300,-.12);ruido(t+.023,.12,.028,1000,0);}
if(st==='dance'||st==='run'){if(p%2===1)ruido(t,.11,.03,6500,.32);else ruido(t,.025,.012,9000,.32);}
else if(!soft||p%2===0)ruido(t,.03,soft?.008:.016,8000,.3);
if(nrg){for(var aq=0;aq<2;aq++){var na=chord[(p*2+aq)%chord.length]+(aq?24:12);voice(hz(na),step*.42,t+aq*step/2,st==='pop'?.006:.009,'sawtooth',aq?.35:-.35,true);}}
/* baixo */
if(st==='dance'){voice(hz(root+(p%2?12:0)),step*.9,t,.05,'triangle');}
else if(st==='run'){voice(hz(root+(p===3||p===7?7:0)),step*.85,t,.05,'triangle');}
else if(soft){if(p===0||p===4)voice(hz(root),step*3.6,t,.045,'triangle');}
else if(st==='pop')voice(hz(root+(p%2?12:0)),step*.85,t,.045,'triangle');
else if(p%2===0)voice(hz(root),step*1.8,t,.05,'triangle');
/* harmonia */
if(p%(8/c.cpb)===0)chord.forEach(function(n,k){voice(hz(n),step*(8/c.cpb)*.95,t,soft?.011:.009,'sine',(k-1)*.4,true);});
if(soft)voice(hz(chord[p%chord.length]+12),step*.9,t,st==='box'?.011:.007,'sine');
else if(st==='pop'&&p%2===1)voice(hz(chord[(p>>1)%chord.length]+12),step*.6,t,.006,'triangle');
/* Brilho acompanha ataques melódicos; pausas nunca viram notas. */
var m=c.mel[i%len];if(m>=0){m+=up;var d=step*(c.mel[(i+1)%len]<0?1.7:.95),cues=playback.cuesByStep&&playback.cuesByStep[i];voice(hz(m),d,t,c.lead==='square'?.04:.048,c.lead,0,true);voice(hz(m+12),d*.6,t,st==='box'?.012:.006,'sine');if(volta===1&&p%2===0)voice(hz(m+19),d*.5,t,.005,'sine');if(volta>=2)voice(hz(m+7),d*.8,t,.007,'triangle');if(cues&&cues.length){voice(hz(m+12),Math.min(.20,d*.45),t,.025,'triangle');if(cues.length>1)voice(hz(chord[1]+12),step*.72,t,.022,'triangle');}}
if(playback.total&&i===playback.total-1&&!ktPreviewRouting){chord.concat([root+12]).forEach(function(n,k){voice(hz(n+12),1.6,t+step,.022,'triangle',(k-1.5)*.3,true);});ktBumbo(t+step,.1);ruido(t+step,.7,.025,5000,.2);}   /* acorde final, em vez de cortar seco */}
/* Relógio de áudio único, já descontando a latência de saída. */
function kNow(){if(run&&run.audioClock&&D.AC()&&D.AC().state==='running'&&run.audioOrigin)return run.start+(D.AC().currentTime-run.audioOrigin)*1000-ktOutputLatencyMs();return performance.now();}
function schedule(){if(!run||run.paused||!run.audioReady||!run.audioClock||!D.AC()||D.AC().state!=='running')return;/* Antecedencia no relogio nativo do audio, sem aplicar a latencia outra vez. */var elapsed=(D.AC().currentTime-run.audioOrigin)*1000;while(run.audioStep<run.total&&run.audioStep*run.step<elapsed+220)beat(run.audioStep++);}
function start(mode,buffer){if(run)return;
 if(mode!==true && D.$()('ktSong').value)songKey=D.$()('ktSong').value;
 var selected=songs[songKey], key=songKey, request=++startRequest;
 if(selected && selected.recording && !buffer){
   var ctx=D.ac()();
   if(!ctx)return;
   loadRecording(selected,ctx).then(function(decoded){
     if(request===startRequest && songKey===key && !document.hidden)start(mode,decoded);
   }).catch(function(){if(request===startRequest)timingMessage(D.tr()('Não foi possível iniciar a prévia musical.'));});
   return;
 }
 previewPlayer.stop(false);if(typeof D.ktAudioVitrine()!=='undefined'&&D.ktAudioVitrine())D.ktAudioVitrine().stop();/* A simulação automática interna não gasta tentativas; jogadores só entram após confirmação. */var rehearsal=window.ktEnsaio&&(mode==='ensaio'||mode==='confirmed'),practice=mode===true||rehearsal;if(!practice&&mode!=='confirmed'){D.ktFlow().request();return;}if(!practice&&!D.krSt().aberta)return;var wasClosed=practice&&!D.krSt().aberta;if(wasClosed)D.krSt().aberta=true;var admission=!practice&&typeof D.ktMeta()!=='undefined'&&D.ktMeta()?D.ktMeta().begin(songKey):null;if(admission&&!admission.ok){if(wasClosed)D.krSt().aberta=false;return;}if(admission){songKey=admission.round.song;D.$()('ktSong').value=songKey;}if(typeof D.ktDaily()!=='undefined'&&D.ktDaily())D.ktDaily().beforeStart();var auto=mode===true;D.krMusicaParar()();D.ac()();silence();if(!songs[songKey])songKey='normal';var song=songs[songKey],step=60000/song.bpm/2,now=performance.now(),prepareMs=4000,resumeElapsed=0;run={song:song,step:step,durationMs:auto?KaraokeRoomAutoMic.SHOW_PLAY_MS:rehearsal?20000:60000,rehearsal:rehearsal,songKey:songKey,start:now+prepareMs,paused:false,pauseAt:0,resumeUntil:0,skipBeforeUnload:false,auto:auto,practice:practice,practiceOpenedRoom:wasClosed,offsetMs:D.ktFlow().offset(),score:0,combo:0,maxCombo:0,hits:0,attempts:0,timing:{early:0,late:0},notes:[],audioOrigin:0,audioClock:false,audioReady:false,audioStep:0,feedback:'Prepare-se!',feedbackUntil:now+prepareMs,flash:[0,0,0,0]};
if(rehearsal && window.ktEnsaioRegistrar)window.ktEnsaioRegistrar('iniciados',songKey);
run.recordingBuffer=buffer;
run.total=Math.floor((run.durationMs-1000)/step);run.notes=makeNoteMap(song,run.total,step,run.start);if(admission){run.session=admission.round;var saved=admission.round.checkpoint;if(saved){resumeElapsed=Math.max(0,Number(saved.elapsed)||0);run.start=now-resumeElapsed;['score','combo','maxCombo','hits','attempts'].forEach(function(k){run[k]=saved[k]||0;});run.timing=timingRestaurar(saved,run.hits);var oldDone={};if(saved.noteMap!==2){var oldPos=0;for(var j=0;j<run.total;j++)if(song.mel[j%song.mel.length]>=0)oldDone[j]=!!saved.done[oldPos++];}run.notes.forEach(function(n,i){n.at=run.start+n.idx*step;n.done=saved.noteMap===2?!!saved.done[i]:!!oldDone[n.idx];});D.krEu().canto=saved.canto||D.krEu().canto;run.audioStep=Math.max(0,Math.ceil(resumeElapsed/step));}}/* Sons de destaque seguem o mesmo idx musical, inclusive após retomada. */run.cuesByStep={};run.notes.forEach(function(n){(run.cuesByStep[n.idx]||(run.cuesByStep[n.idx]=[])).push(n);});/* A calibracao e apenas do INPUT: nunca deslocar nota visual ou som. */D.krRhythmRun(run);
if(!auto){D.krClearHandheld()('stage');D.krEu().no_mic=true;D.krEu().micT=60*60;D.krEu().x=D.krEu().tx=480;D.krEu().y=D.krEu().ty=286;}else if(D.krDemoCantor())D.krDemoCantor().endsAt=now+KaraokeRoomAutoMic.SHOW_DURATION_MS;
setTimeout(function(){if(!auto)D.krIrAoPalco()();D.krRoomAtualizar()();},160);
D.$()('ktStart').disabled=true;D.$()('ktStart').textContent='🎤 Show em andamento';D.$()('ktSong').disabled=true;D.$()('ktPause').disabled=true;D.$()('ktEnd').disabled=false;D.$()('ktKeys').hidden=!!auto;D.$()('ktSession').hidden=false;timingMessage((D.KR_RHYTHM_TOUCH_DIAGNOSTIC()[D.LANG()]||D.KR_RHYTHM_TOUCH_DIAGNOSTIC().pt).ready);lastUI=0;D.krUI()();updateUI();var activeRun=run;ktPrepararRelogioAudio(activeRun,resumeElapsed?0:prepareMs,resumeElapsed,function(audioReady,waitMs){if(run!==activeRun)return;if(D.krDemoCantor()&&waitMs>0)D.krDemoCantor().endsAt+=waitMs;if(!resumeElapsed&&typeof D.krLoungeReactToShow()==='function')D.krLoungeReactToShow()('start',{song:song,player:D.krDemoCantor()&&D.krDemoCantor().bot?D.krDemoCantor().bot:D.krEu(),language:D.LANG()});D.$()('ktPause').disabled=false;updateUI();checkpoint();});}
var previewPlayer=window.KaraokeMusicPreview.create({
 loadRecording:loadRecording,
 getSong:function(key){return songs[key];},getContext:D.ac(),
 getResumePromise:function(){return D.acResumePromise();},isMuted:function(){return D.muted();},
 isBusy:function(){return !!run;},beat:function(i,target){var was=ktPreviewRouting;ktPreviewRouting=!!target&&target!==run;try{beat(i,target);}finally{ktPreviewRouting=was;}},silence:silence,
 stopAmbient:D.krMusicaParar(),restoreAmbient:D.krMusicaMudarModo(),
 stopVoicePreview:function(){if(D.ktAudioVitrine())D.ktAudioVitrine().stop();},
 getSelectedSong:function(){return D.$()('ktSong').value;},getElement:D.$(),translate:D.tr()
});
function checkpoint(){if(run&&!run.practice&&typeof D.ktMeta()!=='undefined'&&D.ktMeta())D.ktMeta().checkpoint(run);}
function adjustOffset(ms){if(run)run.offsetMs=ms;}
/* Calibração automática (18/11/2026): 8 batidas de metrônomo; a pessoa toca junto. A diferença entre o toque e a
   batida OUVIDA (o horário agendado no relógio do áudio, já sem a latência de saída) é o atraso do aparelho.
   Usa a mediana dos toques e ignora a primeira batida, que serve só para a pessoa pegar o ritmo. */
var cal = null;
var KT_CAL = {batidas:8, passo:700, espera:1200, longe:340};
function calibrarComecar(){
  if(run || !D.AC() || D.muted()) return null;
  var AC = D.AC(), origemAC = AC.currentTime, origemPerf = performance.now(), lat = ktOutputLatencyMs();
  cal = {quando:[], toques:[]};
  for(var i = 0; i < KT_CAL.batidas; i++){
    var t = origemAC + (KT_CAL.espera + i * KT_CAL.passo) / 1000;
    voice(i % 4 === 0 ? 1320 : 880, .07, t, i % 4 === 0 ? .06 : .045, 'triangle');
    /* O som agendado em AC.currentTime só chega ao ouvido "lat" ms depois, então a batida é OUVIDA mais tarde.
       Somando a latência aqui, a conta fica igual à que o hit() faz durante a música (kNow() desconta a mesma lat). */
    cal.quando.push(origemPerf + (t - origemAC) * 1000 + lat);
  }
  return {batidas:KT_CAL.batidas, passo:KT_CAL.passo, comeca:cal.quando[0] - performance.now(), dura:cal.quando[KT_CAL.batidas - 1] + KT_CAL.passo - performance.now()};
}
function calibrarToque(event){
  if(!cal) return null;
  var agora = ktInputTime(performance.now(), event, performance.now()), melhor = Infinity;
  cal.quando.forEach(function(q, i){ if(i === 0) return; var d = agora - q; if(Math.abs(d) < Math.abs(melhor)) melhor = d; });
  if(!isFinite(melhor) || Math.abs(melhor) > KT_CAL.longe) return {n:cal.toques.length, fora:true};
  cal.toques.push(melhor);
  return {n:cal.toques.length, delta:melhor};
}
function calibrarFim(){
  if(!cal) return null;
  var v = cal.toques.slice().sort(function(a, b){ return a - b; }); cal = null;
  if(v.length < 4) return {poucos:true, n:v.length};
  var meio = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2;
  return {n:v.length, offset:Math.round(meio / 10) * 10, media:Math.round(meio)};
}
function calibrarAtiva(){ return !!cal; }
function react(type,message){
 var now=performance.now();if(now-lastReaction<420)return;lastReaction=now;
 var event=type==='MISS'?'miss':type==='COMBO'?'combo':type==='FINISH'?'finish':type==='GOOD'?'hit':'hit';
 if(typeof D.krLoungeReactToShow()==='function')D.krLoungeReactToShow()(event,{song:run&&run.song,combo:run&&run.combo,score:run&&run.score,language:D.LANG()});
}
/* Usa timestamp físico sem ampliar janelas de acerto. */
function ktInputTime(now,event,perfNow){if(!event||!Number.isFinite(event.timeStamp))return now;var stamp=event.timeStamp;if(stamp>1e12&&Number.isFinite(performance.timeOrigin))stamp-=performance.timeOrigin;var lag=perfNow-stamp;return now-(lag>=0&&lag<=120?lag:0);}
function ktTimingProbe(notes,lane,now,offset){var own=null,other=null,closest=null,delta=Infinity,otherDelta=Infinity,closestDelta=Infinity;
 notes.forEach(function(n){var d=now-(n.at+offset),distance=Math.abs(d);
  if(n.lane===lane&&distance<Math.abs(closestDelta)){closest=n;closestDelta=d;}
  if(n.done)return;
  if(n.lane===lane&&distance<Math.abs(delta)){own=n;delta=d;}
  else if(n.lane!==lane&&distance<Math.abs(otherDelta)){other=n;otherDelta=d;}
 });return {own:own,delta:delta,other:other,otherDelta:otherDelta,closest:closest,closestDelta:closestDelta};}
var timingReadout=document.createElement('output');timingReadout.id='ktTimingFeedback';timingReadout.className='kt-timing-readout';timingReadout.setAttribute('aria-live','polite');D.$()('ktHint').after(timingReadout);
function timingMessage(message){timingReadout.textContent=message;}
function timingDetail(delta){var l=D.KR_RHYTHM_TOUCH_DIAGNOSTIC()[D.LANG()]||D.KR_RHYTHM_TOUCH_DIAGNOSTIC().pt;return (Math.abs(delta)<5?l.onTime:(delta<0?l.early:l.late))+' '+Math.abs(Math.round(delta))+' ms';}
var TIMING_RESUMO_TR = {
 pt:['Adiantados: {n}','Atrasados: {n}','Notas perdidas: {n}','Seus acertos ficaram quase sempre do mesmo lado. Confira “Ajustar timing” antes do próximo show.'],
 en:['Early: {n}','Late: {n}','Missed notes: {n}','Your hits were consistently early or late. Check “Adjust timing” before the next show.'],
 es:['Adelantados: {n}','Atrasados: {n}','Notas perdidas: {n}','Tus aciertos tendieron a adelantarse o atrasarse. Revisa «Ajustar ritmo» antes del próximo show.'],
 id:['Terlalu awal: {n}','Terlambat: {n}','Not terlewat: {n}','Ketukanmu cenderung terlalu awal atau terlambat. Periksa pengaturan timing sebelum pertunjukan berikutnya.'],
 th:['แตะเร็ว: {n}','แตะช้า: {n}','โน้ตที่พลาด: {n}','จังหวะที่แตะมักจะเร็วหรือช้าไปทางเดียวกัน ลองปรับจังหวะก่อนการแสดงครั้งหน้า'],
 ja:['早め: {n}','遅め: {n}','ミスしたノーツ: {n}','ヒットが早めか遅めに偏っています。次のショーの前にタイミング調整を確認しましょう。']
};
function timingRestaurar(saved,hits){
 var t=saved&&saved.timing;
 if(!t||![t.early,t.late].every(function(n){return Number.isInteger(n)&&n>=0;})||t.early+t.late>hits)return {early:0,late:0};
 return {early:t.early,late:t.late};
}
function timingResumo(r){
 var t=r.timing, maior=Math.max(t.early,t.late);
 return {contagens:[t.early,t.late,Math.max(0,r.notes.length-r.hits)],sugerir:maior>=8&&maior>=r.hits*.7};
}
function timingResultado(r){
 var box=D.$()('ktResultTiming'), dica=D.$()('ktResultTimingTip');
 if(!box||!dica)return;
 var resumo=timingResumo(r), texto=TIMING_RESUMO_TR[D.LANG()]||TIMING_RESUMO_TR.pt;
 box.textContent=resumo.contagens.map(function(n,i){return texto[i].replace('{n}',n);}).join(' · ');
 box.hidden=false;
 dica.hidden=!resumo.sugerir;
 dica.textContent=resumo.sugerir?texto[3]:'';
 var medir=D.$()('ktResultMedir'); if(medir)medir.hidden=!resumo.sugerir;   // 19/11: a dica leva ao "Medir sozinho" (karaoke-time.html)
}
function judge(note,delta,lane){note.done=true;
 if(delta<=-35)run.timing.early++;else if(delta>=35)run.timing.late++;
run.hits++;run.attempts++;run.combo++;run.maxCombo=Math.max(run.maxCombo,run.combo);var perfect=Math.abs(delta)<=KT_HIT_WINDOWS.perfect;run.score+=(perfect?100:65)+Math.min(20,run.combo)*2;run.feedback=(perfect?'PERFECT! ✨':'BOM! 💫')+' '+timingDetail(delta);timingMessage(run.feedback);run.feedbackUntil=kNow()+480;run.flash[lane]=kNow()+(perfect?220:110);/* retorno do toque: nota da raia e brilhinho no PERFECT */try{D.beep()([523,659,784,988][lane]||784,perfect?.09:.06,'triangle',perfect?.035:.022);if(perfect)D.beep()(([523,659,784,988][lane]||784)*2,.07,'sine',.018,.03);}catch(e){}if(perfect&&typeof D.krBolhas()!=='undefined'&&typeof D.krEu()!=='undefined')D.krBolhas().push({emo:['✨','💖','⭐','🎵'][lane]||'✨',x:D.krEu().x+(lane-1.5)*18,y:D.krEu().y-120,t:0,_ktUntil:performance.now()+700});if(run.combo>0&&run.combo%5===0)react('COMBO','');else if(run.combo%3===0)react('GOOD','');}
function tick(){if(!run)return;if(run.paused&&run.resumeUntil){if(document.hidden){run.resumeUntil=0;updateUI();return;}if(performance.now()>=run.resumeUntil)finishResume();}if(run.paused||!run.audioReady)return;var now=kNow();if(now-lastCheckpoint>1000){checkpoint();lastCheckpoint=now;}if(run.auto&&typeof KaraokeRoomAutoMic!=='undefined')KaraokeRoomAutoMic.simulatePerformance(run,now,D.krDemoCantor()&&D.krDemoCantor().bot,function(e){react(e==='combo'?'COMBO':e==='miss'?'MISS':'GOOD','');});for(var i=0;i<run.notes.length;i++){var n=run.notes[i];if(n.done)continue;var delta=now-(n.at+run.offsetMs);/* Aguardar evento enfileirado com timestamp original, sem ampliar a janela de BOM. */if(delta>KT_HIT_WINDOWS.good+120){n.done=true;run.attempts++;run.combo=0;run.feedback='Você consegue! ♡';run.feedbackUntil=now+500;if(i%4===0)react('MISS','');}}
if(!run.auto){var secs=Math.min(60,Math.max(0,Math.ceil((run.start+run.durationMs-now)/1000)));D.krEu().micT=secs*60;if(secs!==D.krRhythmLastSecond()){D.krRhythmLastSecond(secs);D.krUI()();}}if(now-run.start>=run.durationMs){end(true);return;}if(now-lastUI>120){updateUI();lastUI=now;}}
function hit(lane,event){if(!run||run.paused||run.auto)return;var now=ktInputTime(kNow(),event,performance.now());if(now<run.start-170)return;var p=ktTimingProbe(run.notes,lane,now,run.offsetMs),l=D.KR_RHYTHM_TOUCH_DIAGNOSTIC()[D.LANG()]||D.KR_RHYTHM_TOUCH_DIAGNOSTIC().pt;
 run.flash[lane]=kNow()+110;
 /* Toque sem nota por perto (nenhuma nota pendente a menos de 280 ms) não pune, nem o toque repetido logo após acertar: só acende a raia. */
 if((!p.own||Math.abs(p.delta)>KT_HIT_WINDOWS.good)&&!(p.own&&Math.abs(p.delta)<=280)&&!(p.other&&Math.abs(p.otherDelta)<=KT_HIT_WINDOWS.good)){updateUI();return;}
 if(!p.own||Math.abs(p.delta)>KT_HIT_WINDOWS.good){run.combo=0;run.attempts++;var msg=p.other&&Math.abs(p.otherDelta)<=KT_HIT_WINDOWS.good?l.wrong:(p.closest&&Math.abs(p.closestDelta)<=280?timingDetail(p.closestDelta):l.empty);run.feedback='MISS ♪ '+msg;run.feedbackUntil=kNow()+520;timingMessage(run.feedback);react('MISS','');}
 else judge(p.own,p.delta,lane);
 updateUI();checkpoint();}
function updateUI(){if(!run)return;var seconds=Math.ceil(Math.max(0,run.start+run.durationMs-(run.paused?run.pauseAt:kNow()))/1000);seconds=Math.min(60,seconds);D.$()('ktClock').textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');D.$()('ktScore').textContent='★ '+run.score+' · Combo '+run.combo+' · '+(run.attempts?Math.round(run.hits/run.attempts*100):0)+'%';var p=D.KR_RHYTHM_PAUSE_COPY()[D.LANG()]||D.KR_RHYTHM_PAUSE_COPY().pt;D.$()('ktPause').textContent=p[run.resumeUntil?2:run.paused?1:0];D.$()('ktHint').textContent=D.KR_RHYTHM_HIT_HELP()[D.LANG()]||D.KR_RHYTHM_HIT_HELP().pt;}
function finishResume(){if(!run||!run.paused||!run.resumeUntil||document.hidden)return;var target=run,delta=kNow()-target.pauseAt;target.start+=delta;target.notes.forEach(function(n){n.at+=delta;});if(D.krDemoCantor())D.krDemoCantor().endsAt+=delta;target.resumeUntil=0;target.skipBeforeUnload=false;target.audioReady=false;target.audioClock=false;target.paused=true;clearInterval(audioTimer);audioTimer=0;silence();D.$()('ktPause').disabled=true;var elapsed=Math.max(0,performance.now()-target.start),resumeBotEnd=D.krDemoCantor()?D.krDemoCantor().endsAt:null;ktPrepararRelogioAudio(target,0,elapsed,function(audioReady,waitMs){if(run!==target)return;if(D.krDemoCantor()&&resumeBotEnd!==null)D.krDemoCantor().endsAt=resumeBotEnd+waitMs;target.paused=false;D.$()('ktPause').disabled=false;updateUI();checkpoint();});}
function pause(value){if(!run||!run.audioReady)return;if(value){if(run.resumeUntil){run.resumeUntil=0;clearInterval(audioTimer);audioTimer=0;updateUI();checkpoint();return;}if(run.paused)return;run.paused=true;run.pauseAt=kNow();clearInterval(audioTimer);audioTimer=0;silence();}else{if(!run.paused||run.resumeUntil||document.hidden)return;D.ac()();run.resumeUntil=performance.now()+3000;var panel=D.$()('ktCalibration');if(panel)panel.open=false;}updateUI();checkpoint();}
function warnPausedExit(event){if(!run||!run.paused||run.skipBeforeUnload)return;event.preventDefault();event.returnValue='';}
window.addEventListener('beforeunload',warnPausedExit);
function end(completed){if(!run)return;var r=run;if(completed&&r.rehearsal&&window.ktEnsaioRegistrar)window.ktEnsaioRegistrar('concluidos',r.songKey);var priorBest=lastResult?lastResult.score:null,fullCombo=r.attempts>0&&r.hits===r.attempts&&r.notes.every(function(n){return n.done;}),isSessionRecord=completed&&!r.auto&&!r.practice&&(fullCombo||(priorBest!==null&&r.score>priorBest));if(typeof D.krLoungeReactToShow()==='function')D.krLoungeReactToShow()(isSessionRecord?'record':'finish',{song:r.song,player:D.krDemoCantor()&&D.krDemoCantor().bot?D.krDemoCantor().bot:D.krEu(),score:r.score,combo:r.maxCombo,accuracy:r.attempts?Math.round(r.hits/r.attempts*100):0,completed:completed,fullCombo:fullCombo,language:D.LANG()});if(!r.practice&&typeof D.ktMeta()!=='undefined'&&D.ktMeta())D.ktMeta().complete(r,completed);run=null;D.krRhythmRun(null);clearInterval(audioTimer);audioTimer=0;silence();D.krEu().no_mic=false;D.krEu().micT=0;if(D.krDemoCantor())D.krDemoBotEnd()();D.$()('ktKeys').hidden=true;D.$()('ktPause').disabled=true;D.$()('ktEnd').disabled=true;D.$()('ktStart').disabled=false;D.$()('ktStart').textContent='🎤 Jogar ritmo';D.$()('ktSong').disabled=false;if(r.practiceOpenedRoom)D.krSt().aberta=false;if(typeof D.ktDaily()!=='undefined'&&D.ktDaily())D.ktDaily().afterEnd();D.$()('ktClock').textContent=completed?'00:00':r.rehearsal?'00:20':'01:00';D.krUI()();D.krMusicaMudarModo()();
if(completed&&!r.auto){lastResult={score:r.score,accuracy:r.attempts?Math.round(r.hits/r.attempts*100):0,combo:r.maxCombo,auto:r.auto,practice:r.practice};D.$()('ktResultText').textContent=(r.practice?D.ktFlow().t(7):'Seu show')+' · '+r.song.title;D.$()('ktResultScore').textContent=r.score;D.$()('ktResultAccuracy').textContent=lastResult.accuracy+'%';D.$()('ktResultCombo').textContent=r.maxCombo;timingResultado(r);D.$()('ktResultNote').textContent=r.practice?D.ktFlow().t(9):'Show concluído! Sua marca participa dos rankings locais desta semana.';var fc=r.attempts>0&&r.hits===r.attempts&&r.notes.every(function(n){return n.done;});var sel=D.$()('ktResultFC');if(!sel){sel=document.createElement('p');sel.id='ktResultFC';sel.className='kt-fc';D.$()('ktResultText').after(sel);}sel.hidden=!fc;sel.textContent='🌟 FULL COMBO! 🌟';if(fc)D.beep()(1318,.5,'triangle',.05,0),D.beep()(1568,.6,'triangle',.05,.12);D.$()('ktResult').showModal();if(window.ktOnline)window.ktOnline.showResult(!r.practice);D.ktResultNoPalco()();D.krBaloes()[typeof D.ktDaily()!=='undefined'&&D.ktDaily()?D.ktDaily().currentId():D.nick()]={txt:'Brilhou demais! ✨',t0:D.krT()};}else if(completed&&r.auto){D.$()('ktHint').textContent='Aplausos! O palco está livre novamente.';}else{D.$()('ktHint').textContent=r.practice?D.ktFlow().t(9):'Show encerrado. Esta tentativa foi usada; confira quantas restam hoje.';}if(!r.auto&&typeof D.ktMeta()!=='undefined'&&D.ktMeta()){var a=D.ktMeta().controls();D.$()('ktResultAgain').disabled=r.practice?false:a.remaining===0&&!(a.tickets>0);D.$()('ktResultAgain').textContent=r.practice?D.ktFlow().t(13):a.remaining?'Mais um show!':a.tickets>0?'🎟️ +1 show':'🌙 Volte amanhã';}}
function draw(x,tx,ty,tw,th){var r=run;if(!r)return;var now=r.paused?r.pauseAt:kNow(),colors=['#f9a8d4','#93c5fd','#a7f3d0','#ffe6a8'],top=ty+28,padsY=ty+th-66,target=padsY+13,lw=(tw-24)/4,goodPx=KT_HIT_WINDOWS.good*KT_NOTE_PX_PER_MS+KT_NOTE_HALF_HEIGHT,perfectPx=KT_HIT_WINDOWS.perfect*KT_NOTE_PX_PER_MS+KT_NOTE_HALF_HEIGHT;
x.save();x.beginPath();x.roundRect(tx,ty,tw,th,14);x.clip();var g=x.createLinearGradient(tx,ty,tx+tw,ty+th);g.addColorStop(0,'#110b2a');g.addColorStop(.52,'#513078');g.addColorStop(1,'#233f73');x.fillStyle=g;x.fillRect(tx,ty,tw,th);x.fillStyle='rgba(16,8,36,.8)';x.fillRect(tx,ty,tw,24);x.textAlign='left';x.font='800 9px "M PLUS Rounded 1c"';x.fillStyle='#fff';x.fillText(r.song.title,tx+9,ty+15,tw*.44);x.textAlign='right';x.fillStyle='#ffe6a8';x.fillText('★ '+r.score+'   × '+r.combo+'   '+(r.attempts?Math.round(r.hits/r.attempts*100):0)+'%',tx+tw-10,ty+15);
/* Halo GOOD ±100 ms; botão interno PERFECT ±45 ms. */
for(var i=0;i<4;i++){var lx=tx+12+i*lw,flashing=r.flash[i]>now;x.fillStyle='rgba(255,255,255,.035)';x.fillRect(lx+2,top,lw-4,target-top+goodPx);x.strokeStyle='rgba(255,255,255,.14)';x.lineWidth=1;x.beginPath();x.moveTo(lx,top);x.lineTo(lx,target+goodPx);x.stroke();x.save();x.shadowColor=colors[i];x.shadowBlur=flashing?15:7;x.globalAlpha=flashing?.56:.23;x.fillStyle=colors[i];x.beginPath();x.roundRect(lx+2,target-goodPx,lw-4,goodPx*2,11);x.fill();x.globalAlpha=1;x.strokeStyle=colors[i];x.lineWidth=1.3;x.stroke();x.shadowBlur=flashing?13:5;x.fillStyle=flashing?'#ffffff':colors[i];x.beginPath();x.roundRect(lx+5,target-perfectPx,lw-10,perfectPx*2,8);x.fill();x.strokeStyle='#ffffff';x.lineWidth=1;x.stroke();x.shadowBlur=0;x.font='800 11px "M PLUS Rounded 1c"';x.fillStyle='#211331';x.textAlign='center';x.fillText(['💖 D','💎 F','🍀 J','⭐ K'][i],lx+lw/2,target+4);x.restore();}
r.notes.forEach(function(n){if(n.done)return;var delta=now-n.at,fall=r.song.fall||1700;if(delta< -fall||delta>170)return;var y=ktNoteY(delta,fall,top,target),nx=tx+12+n.lane*lw+lw/2;x.fillStyle=colors[n.lane];x.strokeStyle='#fff';x.lineWidth=1.3;x.shadowColor=colors[n.lane];x.shadowBlur=8;x.beginPath();x.roundRect(nx-25,y-KT_NOTE_HALF_HEIGHT,50,KT_NOTE_HALF_HEIGHT*2,4);x.fill();x.stroke();x.fillStyle='#fff';x.beginPath();x.arc(nx,y,2,0,Math.PI*2);x.fill();});x.shadowBlur=0;
x.fillStyle='rgba(12,6,28,.6)';x.fillRect(tx,ty+th-19,tw,19);x.font='700 8px "M PLUS Rounded 1c"';x.textAlign='center';x.fillStyle='#e9dbff';x.fillText((D.KR_RHYTHM_TOUCH_DIAGNOSTIC()[D.LANG()]||D.KR_RHYTHM_TOUCH_DIAGNOSTIC().pt).center,tx+tw/2,ty+th-6,tw-14);if(r.feedbackUntil>now&&now>=r.start){x.fillStyle='#ffe6a8';x.font='800 13px "M PLUS Rounded 1c"';x.fillText(r.feedback,tx+tw/2,ty+th*.47,tw-16);}if(now<r.start||r.paused){var falling=now<r.start&&r.start-now<=(r.song.fall||1700);if(falling){/* Mostrar as primeiras notas durante a contagem, antes do primeiro som. */x.fillStyle='rgba(16,8,36,.7)';x.fillRect(tx+tw/2-59,ty+23,118,47);}else{x.fillStyle='rgba(16,8,36,.78)';x.fillRect(tx,ty,tw,th);}x.fillStyle='#fff';if(r.paused){x.font='800 27px "M PLUS Rounded 1c"';x.fillText('☾ Pausado',tx+tw/2,ty+th*.54);}else{var prep=D.krRhythmLabels()();if(falling){x.font='800 28px "M PLUS Rounded 1c"';x.fillText(String(Math.ceil((r.start-now)/1000)),tx+tw/2,ty+56);}else{x.font='800 12px "M PLUS Rounded 1c"';x.fillStyle='#f9a8d4';x.fillText(prep[0],tx+tw/2,ty+th*.32,tw-24);x.font='800 38px "M PLUS Rounded 1c"';x.fillStyle='#fff';x.fillText(String(Math.ceil((r.start-now)/1000)),tx+tw/2,ty+th*.55);x.font='700 10px "M PLUS Rounded 1c"';x.fillStyle='#e9dbff';x.fillText(prep[1],tx+tw/2,ty+th*.69,tw-24);}}}
if(r.paused&&r.resumeUntil){var remaining=Math.max(1,Math.ceil((r.resumeUntil-performance.now())/1000));x.fillStyle='rgba(18,9,45,.86)';x.fillRect(tx,ty,tw,th);x.textAlign='center';x.shadowColor='#f9a8d4';x.shadowBlur=20;x.fillStyle='#fff5fc';x.font='900 46px "M PLUS Rounded 1c"';x.fillText(String(remaining),tx+tw/2,ty+th*.57);x.shadowBlur=0;x.font='800 11px "M PLUS Rounded 1c"';x.fillStyle='#ffb4dc';x.fillText((D.KR_RHYTHM_PAUSE_COPY()[D.LANG()]||D.KR_RHYTHM_PAUSE_COPY().pt)[3],tx+tw/2,ty+th*.7);}
x.restore();D.ktOriginalFrame()(x,tx,ty,tw,th);}
/* Arena (karaoke-arena.js): o show do próprio jogador vira a tela do jogo. Daqui só sai o estado. */
function own(){return !!run&&!run.auto;}
function arena(){if(!own())return null;var r=run;return {now:r.paused?r.pauseAt:kNow(),notes:r.notes,fall:r.song.fall||1700,title:r.song.title,flash:r.flash,feedback:r.feedback,feedbackUntil:r.feedbackUntil,combo:r.combo,score:r.score,acc:r.attempts?Math.round(r.hits/r.attempts*100):0,start:r.start,durationMs:r.durationMs,paused:r.paused,resumeUntil:r.resumeUntil,perfect:KT_HIT_WINDOWS.perfect,good:KT_HIT_WINDOWS.good,prep:(D.krRhythmLabels()()||[''])[0]};}
function laneAt(px,py,event){if(!run||py<38||py>212||px<286||px>674)return false;hit(Math.max(0,Math.min(3,Math.floor((px-286-12)/((388-24)/4)))),event);return true;}
D.$()('ktSong').onchange=function(){if(!run){startRequest++;songKey=this.value;}};D.$()('ktPause').onclick=function(){if(run)pause(run.resumeUntil?true:!run.paused);};D.$()('ktEnd').onclick=function(){end(false);};D.$()('ktResultClose').onclick=function(){D.$()('ktResult').close();};D.$()('ktResultAgain').onclick=function(){D.$()('ktResult').close();D.ktFlow().request();};D.$()('ktStart').onclick=function(){D.ktFlow().request();};
[].forEach.call(document.querySelectorAll('[data-kt-hit]'),function(b){b.onpointerdown=function(e){e.preventDefault();hit(+b.dataset.ktHit,e);};b.onclick=function(e){if(e.detail===0)hit(+b.dataset.ktHit,e);};});
document.addEventListener('keydown',function(e){
 if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||D.$()('ktResult').open)return;
 var tag=e.target&&e.target.tagName;
 if(tag==='SELECT'||tag==='INPUT'||tag==='TEXTAREA'||e.target&&e.target.isContentEditable)return;
 if([].some.call(document.querySelectorAll('dialog[open]'),function(d){return d.id!=='ktPopup';}))return;
 var key=e.key.toLowerCase(),i=['d','f','j','k'].indexOf(key);
 if(i>=0&&run){e.preventDefault();hit(i,e);return;}
 if((key==='p'||key===' '&&tag!=='BUTTON')&&run){e.preventDefault();pause(run.resumeUntil?true:!run.paused);return;}
 if(key==='m'&&D.$()('ktClosed').hidden){var muteButton=D.$()('krMute');if(muteButton&&!muteButton.disabled){e.preventDefault();D.krAlternarSom()();return;}}
 if(key==='c'&&D.$()('ktClosed').hidden){e.preventDefault();D.$()('ktFoto').click();return;}
 if(key==='s'&&D.$()('ktClosed').hidden){e.preventDefault();var panel=D.$()('ktCalibration');panel.open=!panel.open;if(panel.open&&run)pause(true);}
});
window.addEventListener('pagehide',function(){previewPlayer.stop(false);if(run){pause(true);checkpoint();}});
document.addEventListener('visibilitychange',function(){if(document.hidden){previewPlayer.stop(false);if(run)pause(true);}});
return {start:start,end:end,tick:tick,active:active,hit:hit,pause:pause,adjustOffset:adjustOffset,calibrarComecar:calibrarComecar,calibrarToque:calibrarToque,calibrarFim:calibrarFim,calibrarAtiva:calibrarAtiva,previewSong:previewPlayer.play,pausePreview:previewPlayer.pause,resumePreview:previewPlayer.resume,stopPreview:previewPlayer.stop,togglePreview:previewPlayer.toggle,previewState:previewPlayer.state,paused:function(){return !!run&&run.paused;},allowExit:function(){if(run)run.skipBeforeUnload=true;},silence:silence,draw:draw,laneAt:laneAt,own:own,arena:arena};
}
window.KaraokeShow={criar:criar};
})();
