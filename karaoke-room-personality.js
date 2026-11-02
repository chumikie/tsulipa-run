(function(root,factory){
 'use strict';
 var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeRoomPersonality=api;
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
 function hash(value){var s=String(value),h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
 function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
 function create(options){
  options=options||{};var random=typeof options.random==='function'?options.random:Math.random;
  var recent={},recentPairs=[];
  function identity(actor){return String(actor&&(actor.playerId||actor.id||actor.nick)||'anonymous').trim().toLowerCase();}
  function profile(actor){
   if(!actor||typeof actor!=='object')return null;
   var key=identity(actor),existing=actor._ktPersonality;
   if(existing&&existing.key===key)return existing;
   var seed=hash(key),base=TYPES[seed%TYPES.length],variance=function(shift){return (((seed>>>shift)&255)/255-.5)*.12;},p={key:key,type:base.id,tone:base.tone};
   ['sociability','energy','wanderlust','cheer','expressiveness','shyness','curiosity','playfulness'].forEach(function(field,i){p[field]=clamp(base[field]+variance((i*5)%24),.05,.98);});
   actor._ktPersonality=p;return p;
  }
  function prepare(actors){(Array.isArray(actors)?actors:[]).forEach(profile);return actors||[];}
  function reset(actors){recent={};recentPairs=[];return prepare(actors);}
  function roll(){var n=Number(random());return Number.isFinite(n)?clamp(n,0,.999999):0;}
  function weighted(items,weight){if(!items.length)return null;var weights=items.map(function(item){return Math.max(.04,Number(weight(item))||0);}),total=weights.reduce(function(a,b){return a+b;},0),pick=roll()*total;for(var i=0;i<items.length;i++){pick-=weights[i];if(pick<0)return items[i];}return items[items.length-1];}
  function choose(actors,activity){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(!list.length)return null;var key=activity||'wander',history=recent[key]||(recent[key]=[]),fresh=list.filter(function(a){return history.indexOf(identity(a))<0;}),pool=fresh.length?fresh:list;
   var fields={wander:'wanderlust',talk:'sociability',cheer:'cheer',observe:'curiosity'},field=fields[key]||'sociability',selected=weighted(pool,function(a){var p=profile(a);return .18+p[field]*p[field];});
   if(selected){history.push(identity(selected));if(history.length>3)history.shift();}return selected;
  }
  function pairKey(a,b){return [identity(a),identity(b)].sort().join('|');}
  function chooseConversation(actors){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(list.length<2)return null;var pairs=[];
   for(var i=0;i<list.length;i++)for(var j=i+1;j<list.length;j++){
    var a=list[i],b=list[j],pa=profile(a),pb=profile(b),key=pairKey(a,b),score=.2+((pa.sociability+pb.sociability)/2)*.52+((pa.curiosity+pb.curiosity)/2)*.14+(1-Math.abs(pa.energy-pb.energy))*.14;
    if(recentPairs.indexOf(key)>=0)score*=.12;
    pairs.push({a:a,b:b,key:key,score:score});
   }
   var picked=weighted(pairs,function(item){return item.score;});if(!picked)return null;
   recentPairs.push(picked.key);if(recentPairs.length>5)recentPairs.shift();
   var pa=profile(picked.a),pb=profile(picked.b),initiative=function(p){return p.sociability*.42+p.curiosity*.24+p.playfulness*.2+p.expressiveness*.14-p.shyness*.18;};
   return initiative(pa)>=initiative(pb)?[picked.a,picked.b]:[picked.b,picked.a];
  }
  function chooseAudience(actors){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(!list.length)return [];var cheerer=choose(list,'cheer');if(list.length===1)return [cheerer];var observer=choose(list.filter(function(a){return a!==cheerer;}),'observe');return observer?[cheerer,observer]:[cheerer];}
  function delay(actor,activity){var p=profile(actor);if(!p)return 0;if(activity==='wander')return Math.round((1-p.wanderlust)*360);if(activity==='social')return Math.round((1-p.sociability)*180);return 0;}
  function gesture(actor,context){var p=profile(actor);if(!p)return 'look';if(context==='cheer')return p.cheer>.62&&p.energy>.42?'applause':'look';if(context==='listen')return p.expressiveness>.78&&p.shyness<.25?'talk':'look';if(context==='talk')return p.expressiveness>.43&&p.shyness<.82?'talk':'look';return 'look';}
  function dialogue(actor,role,language){var p=profile(actor),locale=LINES[language]?language:'pt',tone=p?p.tone:'gentle',pack=LINES[locale][tone]||LINES[locale].gentle,kind=role==='reply'?'reply':role==='cheer'?'cheer':'start',lines=pack[kind];return lines[Math.floor(roll()*lines.length)];}
  function decideSocial(actors,singer,language){var list=(Array.isArray(actors)?actors:[]).filter(Boolean);if(!list.length||(!singer&&list.length<2))return null;var selected=singer?chooseAudience(list):chooseConversation(list),first=selected&&selected[0],second=selected&&selected[1]||null;if(!first||(!singer&&!second))return null;return {first:first,second:second,firstKind:gesture(first,singer?'cheer':'talk'),secondKind:second?gesture(second,'listen'):'look',firstLine:dialogue(first,singer?'cheer':'start',language),secondLine:second&&!singer?dialogue(second,'reply',language):null};}
  return {profile:profile,prepare:prepare,reset:reset,choose:choose,chooseConversation:chooseConversation,chooseAudience:chooseAudience,delay:delay,gesture:gesture,dialogue:dialogue,decideSocial:decideSocial};
 }
 return {create:create,types:TYPES.map(function(t){return t.id;})};
});
