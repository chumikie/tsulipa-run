(function(root,factory){
 'use strict';var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;else root.KaraokeRoomPersonality=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 var TYPES=[
  {id:'extrovertido',tone:'bright',sociability:.94,energy:.74,wanderlust:.78,cheer:.88,expressiveness:.91,shyness:.08,curiosity:.56,playfulness:.66},
  {id:'timido',tone:'gentle',sociability:.32,energy:.38,wanderlust:.27,cheer:.42,expressiveness:.29,shyness:.91,curiosity:.63,playfulness:.22},
  {id:'festeiro',tone:'bright',sociability:.82,energy:.97,wanderlust:.93,cheer:.98,expressiveness:.96,shyness:.07,curiosity:.51,playfulness:.9},
  {id:'tranquilo',tone:'gentle',sociability:.58,energy:.29,wanderlust:.31,cheer:.54,expressiveness:.35,shyness:.3,curiosity:.54,playfulness:.28},
  {id:'brincalhao',tone:'bright',sociability:.88,energy:.77,wanderlust:.7,cheer:.84,expressiveness:.9,shyness:.12,curiosity:.72,playfulness:.98},
  {id:'fa_dedicado',tone:'curious',sociability:.67,energy:.68,wanderlust:.42,cheer:.97,expressiveness:.72,shyness:.23,curiosity:.92,playfulness:.42},
  {id:'curioso',tone:'curious',sociability:.7,energy:.66,wanderlust:.84,cheer:.69,expressiveness:.67,shyness:.2,curiosity:.99,playfulness:.58}
 ];
 var MUSIC_STYLES=['pop','dance','ballad','run','box'],GESTURES=['applause','heart','wave','smile','nod','emoji'];
 var LINES={
  pt:{
   bright:{start:['Olha isso! ✨','Que energia boa!','Essa sala tá brilhando!'],reply:['Siiim! 💜','Também senti!','Bora aproveitar! ♡'],cheer:['Vai, estrela! ⭐','Arrasa no refrão! 💖','Aí sim! 👏']},
   gentle:{start:['Que música bonita...','Gosto desse clima.','Tá tudo tão leve hoje.'],reply:['Também acho. ♡','É gostoso ficar aqui.','Dá vontade de ouvir mais.'],cheer:['Você tá indo bem. 💜','Que bonito de ouvir. ✨','Tô torcendo daqui. ♡']},
   curious:{start:['Como será a próxima?','Reparou naquele detalhe?','Esse ritmo é diferente!'],reply:['Agora fiquei curiosa!','Quero ver também!','Boa pergunta! ♪'],cheer:['Que virada boa! ✨','Olha esse combo!','Quero ouvir mais!']}
  },
  en:{
   bright:{start:['Look at that! ✨','Such good energy!','This room is glowing!'],reply:['Yesss! 💜','I feel it too!','Let’s enjoy this! ♡'],cheer:['Shine on! ⭐','Own that chorus! 💖','That was it! 👏']},
   gentle:{start:['What a lovely song...','I like this mood.','It feels so peaceful.'],reply:['I think so too. ♡','It’s nice being here.','I could listen all day.'],cheer:['You’re doing great. 💜','That sounded lovely. ✨','I’m cheering for you. ♡']},
   curious:{start:['What comes on next?','Did you notice that detail?','That rhythm is different!'],reply:['Now I’m curious!','I want to see too!','Good question! ♪'],cheer:['What a lovely turn! ✨','Look at that combo!','More, please!']}
  },
  es:{
   bright:{start:['¡Mira eso! ✨','¡Qué energía tan buena!','¡La sala brilla!'],reply:['¡Siii! 💜','¡Yo también lo siento!','¡Vamos a disfrutar! ♡'],cheer:['¡Brilla! ⭐','¡Dale con ese coro! 💖','¡Eso es! 👏']},
   gentle:{start:['Qué canción tan bonita...','Me gusta este ambiente.','Hoy todo está tranquilo.'],reply:['Pienso igual. ♡','Se está muy bien aquí.','Podría escucharla más.'],cheer:['Vas muy bien. 💜','Qué bonito suena. ✨','Te apoyo desde aquí. ♡']},
   curious:{start:['¿Qué vendrá después?','¿Viste ese detalle?','¡Qué ritmo tan distinto!'],reply:['¡Ahora tengo curiosidad!','¡Yo también quiero verlo!','¡Buena pregunta! ♪'],cheer:['¡Qué buen cambio! ✨','¡Mira ese combo!','¡Quiero escuchar más!']}
  },
  th:{
   bright:{start:['ดูนั่นสิ! ✨','พลังดีมากเลย!','ห้องนี้สดใสจัง!'],reply:['ใช่เลย! 💜','ฉันก็รู้สึกเหมือนกัน!','มาสนุกกันเถอะ! ♡'],cheer:['เปล่งประกายเลย! ⭐','ร้องท่อนนี้ให้สุด! 💖','เยี่ยมมาก! 👏']},
   gentle:{start:['เพลงเพราะจัง...','ชอบบรรยากาศแบบนี้','วันนี้สงบดีนะ'],reply:['ฉันก็คิดแบบนั้น ♡','อยู่ตรงนี้สบายจัง','ฟังได้อีกนานเลย'],cheer:['ทำได้ดีมาก 💜','เพราะมากเลย ✨','ฉันเป็นกำลังใจให้นะ ♡']},
   curious:{start:['เพลงต่อไปจะเป็นอะไรนะ?','เห็นรายละเอียดนั้นไหม?','จังหวะนี้แปลกใหม่จัง!'],reply:['ตอนนี้ฉันสงสัยแล้ว!','ฉันก็อยากเห็น!','เป็นคำถามที่ดี! ♪'],cheer:['เปลี่ยนจังหวะได้ดี! ✨','ดูคอมโบนั่นสิ!','อยากฟังอีก!']}
  },
  ja:{
   bright:{start:['見て見て！ ✨','すごくいい雰囲気！','この部屋、輝いてる！'],reply:['そうそう！ 💜','私もそう思う！','一緒に楽しもう！ ♡'],cheer:['輝いて！ ⭐','サビを決めて！ 💖','最高！ 👏']},
   gentle:{start:['すてきな曲だね...','この雰囲気が好き。','今日は穏やかだね。'],reply:['私もそう思う。♡','ここにいると落ち着くね。','ずっと聴いていたいな。'],cheer:['その調子だよ。💜','とてもきれいな歌声。✨','ここから応援してる。♡']},
   curious:{start:['次は何の曲かな？','あの細かいところ気づいた？','面白いリズムだね！'],reply:['気になってきた！','私も見たい！','いい質問だね！ ♪'],cheer:['いい切り替え！ ✨','あのコンボを見て！','もっと聴きたい！']}
  }
 };

 var REACTION_LINES={
  pt:{start:['A música começou! ✨','Vamos ouvir! ♡','Que clima bom! ♪'],hit:['Boa! 💜','Aí sim! ✨','Gostei desse acerto!'],combo:['Olha esse combo! ⭐','Que sequência linda! 👏','Tá brilhando! 💖'],miss:['Vai dar certo! 💜','Respira, você consegue! ♡','Tô torcendo por você!'],finish:['Que apresentação! 👏','Aplausos! Você brilhou! ✨','Foi lindo de assistir! ♡'],record:['NOVO RECORDE! ⭐','Você brilhou demais! 💖','Essa marca merece festa! ✨']},
  en:{start:['The song is starting! ✨','Let’s listen! ♡','What a lovely mood! ♪'],hit:['Nice one! 💜','That was great! ✨','Loved that hit!'],combo:['Look at that combo! ⭐','What a lovely streak! 👏','You’re shining! 💖'],miss:['You’ve got this! 💜','Take a breath, you can do it! ♡','I’m cheering for you!'],finish:['What a performance! 👏','Bravo! You shone! ✨','That was lovely to watch! ♡'],record:['NEW RECORD! ⭐','You absolutely shone! 💖','That deserves a celebration! ✨']},
  es:{start:['¡Empieza la canción! ✨','Vamos a escuchar. ♡','¡Qué buen ambiente! ♪'],hit:['¡Bien! 💜','¡Eso es! ✨','¡Buen acierto!'],combo:['¡Mira ese combo! ⭐','¡Qué buena racha! 👏','¡Estás brillando! 💖'],miss:['¡Tú puedes! 💜','Respira, lo lograrás. ♡','¡Te estoy apoyando!'],finish:['¡Qué presentación! 👏','¡Aplausos! ¡Brillaste! ✨','¡Fue precioso! ♡'],record:['¡NUEVO RÉCORD! ⭐','¡Brillaste muchísimo! 💖','¡Eso merece una fiesta! ✨']},
  th:{start:['เพลงเริ่มแล้ว! ✨','มาฟังกันเถอะ ♡','บรรยากาศดีจัง! ♪'],hit:['เยี่ยมเลย! 💜','ดีมาก! ✨','จังหวะสวย!'],combo:['คอมโบนั้นสุดยอด! ⭐','ต่อเนื่องได้ดีมาก! 👏','เปล่งประกายเลย! 💖'],miss:['ทำได้นะ! 💜','หายใจลึก ๆ แล้วลองใหม่ ♡','ฉันเอาใจช่วยนะ!'],finish:['การแสดงยอดเยี่ยม! 👏','ปรบมือให้เลย! ✨','ดูเพลินมาก! ♡'],record:['สถิติใหม่! ⭐','เก่งมากเลย! 💖','ต้องฉลองแล้ว! ✨']},
  ja:{start:['曲が始まるよ！ ✨','ゆっくり聴こう。♡','いい雰囲気だね！ ♪'],hit:['いいね！ 💜','その調子！ ✨','ナイスヒット！'],combo:['そのコンボすごい！ ⭐','きれいな連続！ 👏','輝いてるよ！ 💖'],miss:['大丈夫、できるよ！ 💜','深呼吸して、次いこう。♡','応援してるよ！'],finish:['すてきなステージ！ 👏','拍手！輝いてたよ！ ✨','見ていて楽しかった！ ♡'],record:['新記録！ ⭐','本当に輝いてた！ 💖','お祝いしなきゃ！ ✨']}
 };
 var EVENT_BASE={start:.28,hit:.09,combo:.25,miss:.2,finish:.58,record:.78};
 var POSES={applause:'banzai',heart:'coracao',wave:'neon',smile:'v',nod:'v',emoji:'coracao'};
 function hash(value){var s=String(value),h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
 function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
 function create(options){
  options=options||{};var random=typeof options.random==='function'?options.random:Math.random,recent={},recentPairs=[],recentGestures={};
  function identity(actor){return String(actor&&(actor.playerId||actor.id||actor.nick)||'anonymous').trim().toLowerCase();}
  function profile(actor){
   if(!actor||typeof actor!=='object')return null;
   var key=identity(actor),existing=actor._ktPersonality;if(existing&&existing.key===key)return existing;
   var seed=hash(key),base=TYPES[seed%TYPES.length],variance=function(shift){return (((seed>>>shift)&255)/255-.5)*.12;},p={key:key,type:base.id,tone:base.tone};
   ['sociability','energy','wanderlust','cheer','expressiveness','shyness','curiosity','playfulness'].forEach(function(field,i){p[field]=clamp(base[field]+variance((i*5)%24),.05,.98);});
   p.musicPreferences={};MUSIC_STYLES.forEach(function(style){p.musicPreferences[style]=clamp(.2+(hash(key+'|music|'+style)%76)/100,.2,.96);});
   p.favoriteStyles=MUSIC_STYLES.slice().sort(function(a,b){return p.musicPreferences[b]-p.musicPreferences[a];}).slice(0,2);
   p.gestureFavorites=[];for(var gi=0;gi<3;gi++){var g=GESTURES[hash(key+'|gesture|'+gi)%GESTURES.length];if(p.gestureFavorites.indexOf(g)<0)p.gestureFavorites.push(g);}
   actor._ktPersonality=p;return p;
  }
  function prepare(actors){(Array.isArray(actors)?actors:[]).forEach(profile);return actors||[];}
  function reset(actors){recent={};recentPairs=[];recentGestures={};return prepare(actors);}
  function roll(){var n=Number(random());return Number.isFinite(n)?clamp(n,0,.999999):0;}
  function weighted(items,weight){if(!items.length)return null;var weights=items.map(function(item){return Math.max(.04,Number(weight(item))||0);}),total=weights.reduce(function(a,b){return a+b;},0),pick=roll()*total;for(var i=0;i<items.length;i++){pick-=weights[i];if(pick<0)return items[i];}return items[items.length-1];}
  function pairKey(a,b){return [identity(a),identity(b)].sort().join('|');}
  function choose(actors,activity){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(!list.length)return null;var key=activity||'wander',history=recent[key]||(recent[key]=[]),fresh=list.filter(function(a){return history.indexOf(identity(a))<0;}),pool=fresh.length?fresh:list,fields={wander:'wanderlust',talk:'sociability',cheer:'cheer',observe:'curiosity'},field=fields[key]||'sociability',selected=weighted(pool,function(a){var p=profile(a);return .18+p[field]*p[field];});if(selected){history.push(identity(selected));if(history.length>3)history.shift();}return selected;}
  function chooseConversation(actors){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(list.length<2)return null;var pairs=[];
   for(var i=0;i<list.length;i++)for(var j=i+1;j<list.length;j++){var a=list[i],b=list[j],pa=profile(a),pb=profile(b),key=pairKey(a,b),distance=Number.isFinite(a.x)&&Number.isFinite(b.x)?Math.hypot(a.x-b.x,(a.y||0)-(b.y||0)):120,proximity=1-clamp(distance/620,0,.82),score=.2+((pa.sociability+pb.sociability)/2)*.42+((pa.curiosity+pb.curiosity)/2)*.12+(1-Math.abs(pa.energy-pb.energy))*.1+proximity*.16;if(recentPairs.indexOf(key)>=0)score*=.12;pairs.push({a:a,b:b,key:key,score:score});}
   var picked=weighted(pairs,function(item){return item.score;});if(!picked)return null;recentPairs.push(picked.key);if(recentPairs.length>5)recentPairs.shift();
   var pa=profile(picked.a),pb=profile(picked.b),initiative=function(p){return p.sociability*.42+p.curiosity*.24+p.playfulness*.2+p.expressiveness*.14-p.shyness*.18;};return initiative(pa)>=initiative(pb)?[picked.a,picked.b]:[picked.b,picked.a];
  }
  function chooseAudience(actors){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(!list.length)return [];var cheerer=choose(list,'cheer');if(list.length===1)return [cheerer];var observer=choose(list.filter(function(a){return a!==cheerer;}),'observe');return observer?[cheerer,observer]:[cheerer];}
  function delay(actor,activity){var p=profile(actor);if(!p)return 0;if(activity==='wander')return Math.round((1-p.wanderlust)*360);if(activity==='social')return Math.round((1-p.sociability)*180);return 0;}
  function activityDuration(actor,activity){var p=profile(actor);if(!p)return 120;var base={walk:140,drink:190,dance:170,seat:0,observe:210}[activity]||140;return Math.round(base*(.78+p.energy*.42)*(.82+roll()*.36));}
  function decideActivity(actor,context){var p=profile(actor),ctx=context||{},items=[{id:'walk',weight:.3+p.wanderlust*.3},{id:'drink',weight:.06+p.curiosity*.13},{id:'dance',weight:.04+p.energy*.2},{id:'observe',weight:.08+p.shyness*.12+(1-p.energy)*.1}];if(ctx.seatAvailable)items.push({id:'seat',weight:.08+p.curiosity*.12+p.sociability*.04});var chosen=weighted(items,function(item){return item.weight;});return chosen?chosen.id:'walk';}
  function gesture(actor,context){var p=profile(actor);if(!p)return 'look';if(context==='cheer')return p.cheer>.62&&p.energy>.42?'applause':'look';if(context==='listen')return p.expressiveness>.78&&p.shyness<.25?'talk':'look';if(context==='play')return p.playfulness>.48&&p.expressiveness>.45?'heart':'talk';if(context==='talk')return p.expressiveness>.43&&p.shyness<.82?'talk':'look';return 'look';}
  function dialogue(actor,role,language){var p=profile(actor),locale=LINES[language]?language:'pt',tone=p?p.tone:'gentle',pack=LINES[locale][tone]||LINES[locale].gentle,kind=role==='reply'?'reply':role==='cheer'?'cheer':'start',lines=pack[kind];return lines[Math.floor(roll()*lines.length)];}
  function reactionLine(actor,event,language){var p=profile(actor),locale=REACTION_LINES[language]?language:'pt',lines=REACTION_LINES[locale][event]||REACTION_LINES[locale].hit;if(!p||p.expressiveness<.38&&event!=='miss'&&event!=='finish')return '';return lines[Math.floor(roll()*lines.length)]||'';}
  function musicAffinity(actor,context){var p=profile(actor),song=context&&context.song,style=song&&song.style?song.style:(context&&context.style);return p&&style&&p.musicPreferences[style]!==undefined?p.musicPreferences[style]:.5;}
  function decideReactions(actors,event,context){
   var list=(Array.isArray(actors)?actors:[]).filter(Boolean),ctx=context||{},type=EVENT_BASE[event]?event:'hit',out=[];
   list.forEach(function(actor){var p=profile(actor),affinity=musicAffinity(actor,ctx),chance=EVENT_BASE[type];chance+=(p.cheer-.5)*.18+(p.expressiveness-.5)*.16+(p.sociability-.5)*.08+(affinity-.5)*.2;
    if(type==='miss')chance+=p.cheer*.12+p.shyness*.05;if(type==='finish'||type==='record')chance+=p.cheer*.12+p.energy*.06;if(p.shyness>.72&&type!=='miss')chance-=.07;if(ctx.completed===false&&type==='finish')chance*=.72;
    chance=clamp(chance,.035,.92);if(roll()>=chance)return;
    var history=recentGestures[identity(actor)]||(recentGestures[identity(actor)]=[]),choices=p.gestureFavorites.slice();if(type==='miss')choices=['heart','smile','nod'];if(type==='finish'||type==='record')choices=choices.concat(['applause','heart']);
    var fresh=choices.filter(function(g){return history.indexOf(g)<0;}),pool=fresh.length?fresh:choices,gestureName=pool[Math.floor(roll()*pool.length)]||'smile',baseDuration={start:88,hit:62,combo:105,miss:90,finish:145,record:175}[type]||90;
    history.push(gestureName);if(history.length>3)history.shift();
    out.push({actor:actor,event:type,gesture:gestureName,pose:POSES[gestureName]||'v',emoji:({applause:'👏',heart:'💖',wave:'✨',smile:'☺️',nod:'🎵',emoji:'⭐'})[gestureName]||'✨',line:reactionLine(actor,type,ctx.language||'pt'),duration:Math.round(baseDuration*(.78+p.expressiveness*.48)),intensity:clamp(.35+p.energy*.4+p.cheer*.25,.2,1),musicAffinity:affinity});
   });return out;
  }
  function decideSocial(actors,singer,language){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(!list.length||(!singer&&list.length<2))return null;var selected=singer?chooseAudience(list):chooseConversation(list),first=selected&&selected[0],second=selected&&selected[1]||null;if(!first||(!singer&&!second))return null;var interaction='talk';if(!singer&&second){var play=(profile(first).playfulness+profile(second).playfulness)/2;if(roll()<.05+play*.1)interaction='play';}return {first:first,second:second,interaction:interaction,firstKind:interaction==='play'?gesture(first,'play'):gesture(first,singer?'cheer':'talk'),secondKind:interaction==='play'?'heart':(second?gesture(second,singer?'listen':'talk'):'look'),firstLine:dialogue(first,singer?'cheer':'start',language),secondLine:second&&!singer?dialogue(second,'reply',language):null};}
  function clearActivity(actor,state){if(!actor||!state)return;if(state.activeItem==='drink'&&actor._ktLoungeDrink)actor.drink='';if(state.activeItem==='dance')actor.danca='';state.activeItem='';actor._ktLoungeDrink=false;}
  function activateActivity(actor,state){if(!actor||!state)return;var a=state.activity||'walk';if(a==='drink'&&!actor.drink&&!actor.itemSala&&!actor.snackSala){actor.drink=['tsu','lirika','pati'][Math.floor(roll()*3)];state.activeItem='drink';actor._ktLoungeDrink=true;}else if(a==='dance'&&!actor.itemSala&&!actor.snackSala){actor.danca=['neon','giro','pulo'][Math.floor(roll()*3)];state.activeItem='dance';}else if(a==='seat'&&state.targetSeat){state.returnX=state.targetSeat[0];state.returnY=state.targetSeat[1];}}
  function finishActivity(actor,state,context){if(!actor||!state)return;var c=context||{},now=Number(c.time)||0,random=typeof c.random==='function'?c.random:roll;clearActivity(actor,state);state.phase='rest';state.route=null;state.routeIndex=0;state.targetX=null;state.activity='observe';state.waitUntil=now+600+random()*240+(typeof c.delay==='function'?c.delay(actor):0);actor._ktLoungeWalking=false;var list=Array.isArray(c.actors)?c.actors:[],i=list.indexOf(actor);if(i>=0)list.splice(i,1);var next=Math.max(Number(c.nextAt)||0,now+600+random()*180);if(typeof c.setNextAt==='function')c.setNextAt(next);return next;}
  function freeSofaSlot(actor,actors,slots,player,singer){if(!actor||!Array.isArray(actors)||!Array.isArray(slots))return null;for(var si=0;si<slots.length;si++){var slot=slots[si],busy=false;for(var bi=0;bi<actors.length;bi++){var other=actors[bi];if(other!==actor&&Math.hypot(other.x-slot[0],other.y-slot[1])<34){busy=true;break;}}if(!busy&&player&&!player.no_mic&&Math.hypot(player.x-slot[0],player.y-slot[1])<34)busy=true;if(!busy&&singer&&Math.hypot(singer.x-slot[0],singer.y-slot[1])<34)busy=true;if(!busy&&Math.hypot(actor.x-slot[0],actor.y-slot[1])>28)return slot;}return null;}
  function createSocialDirector(deps){deps=deps||{};var first=null,second=null,until=0,nextAt=0;
   function now(){var n=Number(typeof deps.now==='function'?deps.now():0);return Number.isFinite(n)?n:0;}
   function allowed(){return typeof deps.allowed!=='function'||!!deps.allowed();}
   function clear(){if(first){first._ktSocialUntil=0;first._ktSocialKind='';first._ktSocialTargetX=first.x;}if(second){second._ktSocialUntil=0;second._ktSocialKind='';second._ktSocialTargetX=second.x;}first=null;second=null;until=0;}
   function reset(){clear();nextAt=now()+480+roll()*240;}
   function active(){return !!(first||second);}
   function shouldUpdate(){if(!allowed())return false;if(first){var due=until;if(typeof first._ktSocialUntil==='number'&&first._ktSocialUntil<due)due=first._ktSocialUntil;if(second&&typeof second._ktSocialUntil==='number'&&second._ktSocialUntil<due)due=second._ktSocialUntil;return now()>=due;}if(typeof deps.hasWalkers==='function'&&deps.hasWalkers())return false;return now()>=nextAt;}
   function update(){var t=now();if(!allowed()){clear();return false;}if(first){if(t<until&&first._ktSocialUntil>t&&(!second||second._ktSocialUntil>t))return false;clear();nextAt=t+360+roll()*240;}if((typeof deps.hasWalkers==='function'&&deps.hasWalkers())||t<nextAt)return false;
    var singer=typeof deps.singer==='function'?deps.singer():null,source=typeof deps.actors==='function'?deps.actors():[],eligible=(Array.isArray(source)?source:[]).filter(function(actor){return typeof deps.canSocialize!=='function'||deps.canSocialize(actor,singer,t);});
    if(singer?!eligible.length:eligible.length<2){nextAt=t+(singer?240:300);return false;}
    var language=typeof deps.language==='function'?deps.language():'pt',social=decideSocial(eligible,singer,language),a=social&&social.first,b=social&&social.second;
    if(!a){a=choose(eligible,singer?'cheer':'talk');if(!singer&&a){var rest=eligible.filter(function(actor){return actor!==a;}),pair=chooseConversation(rest);b=pair&&pair[0]||null;}}
    if(!a||(!singer&&!b)){nextAt=t+300;return false;}
    var untilAt=t+(singer?90+roll()*70:150+roll()*60);a._ktSocialKind=social?social.firstKind:(singer?'applause':'talk');a._ktSocialTargetX=singer?singer.x:b.x;a._ktSocialUntil=untilAt;
    if(b){b._ktSocialKind=social?social.secondKind:(singer?'look':'talk');b._ktSocialTargetX=singer?singer.x:a.x;b._ktSocialUntil=untilAt;}
    if(typeof deps.onDialogue==='function'){deps.onDialogue(a,social&&social.firstLine||dialogue(a,singer?'cheer':'start',language),t);if(!singer&&b)deps.onDialogue(b,social&&social.secondLine||dialogue(b,'reply',language),t+45);}
    nextAt=t+(singer?360+roll()*300:510+roll()*390);first=a;second=b;until=t+(singer?160:230);return true;
   }
   return {clear:clear,reset:reset,active:active,shouldUpdate:shouldUpdate,update:update};
  }
  function createShowReactor(deps){deps=deps||{};var lastEventAt=-1e9;return function(event,details){if(typeof deps.allowed==='function'&&!deps.allowed())return 0;var t=Number(typeof deps.now==='function'?deps.now():0);if(event==='hit'&&t-lastEventAt<24)return 0;if(event==='combo'&&t-lastEventAt<28)return 0;lastEventAt=t;var ctx=Object.assign({},details||{}),singer=ctx.player||(typeof deps.singer==='function'?deps.singer(ctx):null);if(event==='start'&&typeof deps.onStart==='function')deps.onStart();var eligible=typeof deps.eligible==='function'?deps.eligible(singer,t):[];ctx.language=ctx.language||(typeof deps.language==='function'?deps.language():'pt');var reactions=decideReactions(eligible,event,ctx);for(var i=0;i<reactions.length;i++)if(typeof deps.apply==='function')deps.apply(reactions[i],singer,t,event);if(typeof deps.after==='function')deps.after();return reactions.length;};}
  return {profile:profile,prepare:prepare,reset:reset,choose:choose,chooseConversation:chooseConversation,chooseAudience:chooseAudience,delay:delay,activityDuration:activityDuration,decideActivity:decideActivity,gesture:gesture,dialogue:dialogue,decideSocial:decideSocial,decideReactions:decideReactions,musicAffinity:musicAffinity,clearActivity:clearActivity,activateActivity:activateActivity,finishActivity:finishActivity,freeSofaSlot:freeSofaSlot,createSocialDirector:createSocialDirector,createShowReactor:createShowReactor};
 }
 return {create:create,types:TYPES.map(function(t){return t.id;})};
});
