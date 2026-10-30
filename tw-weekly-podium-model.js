/* Pure weekly podium helpers shared by the site and offline tests. */
(function(root,factory){
  "use strict";
  var api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.TsuWeeklyPodiumModel=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  function sundayKey(timestamp){
    var parts=new Intl.DateTimeFormat('en-US',{
      timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'
    }).formatToParts(new Date(timestamp===undefined?Date.now():timestamp));
    var values={};
    parts.forEach(function(part){values[part.type]=part.value;});
    var date=new Date(Date.UTC(+values.year,+values.month-1,+values.day));
    date.setUTCDate(date.getUTCDate()-date.getUTCDay());
    return date.toISOString().slice(0,10);
  }
  function clean(list){
    if(!Array.isArray(list))return [];
    var best=Object.create(null);
    list.slice(0,30).forEach(function(person){
      if(!person||typeof person!=='object')return;
      var nick=String(person.nick||person.name||'').trim().slice(0,24);
      var score=Math.floor(Number(person.score===0?0:(person.score||person.pts||0)));
      if(!nick||!Number.isSafeInteger(score)||score<=0)return;
      var key=nick.toLocaleLowerCase('pt-BR');
      if(!best[key]||score>best[key].score)best[key]={nick:nick,score:score};
    });
    return Object.keys(best).map(function(key){return best[key];})
      .sort(function(a,b){return b.score-a.score||a.nick.localeCompare(b.nick);}).slice(0,3);
  }
  return Object.freeze({sundayKey:sundayKey,clean:clean});
});
