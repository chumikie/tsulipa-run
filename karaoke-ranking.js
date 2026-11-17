/* Karaoke⭐Time!: ranking da semana (Pontuação, Mais shows, Quem mais evoluiu), música da semana e abas.
   Saiu do karaoke-time.html em 17/11/2026: primeira parte do plano de dividir o arquivo (#109).
   O código é o mesmo de antes; o ktMeta da sala chama KaraokeRanking.criar({...}) e usa render()/reset(). */
(function(){
'use strict';
function criar(o){
var $=o.$,tr=o.tr,rules=o.rules,context=o.context,KaraokeAvatar=o.avatar,lastSignature='',activeTab='score';
window.ktBoardsAgora=function(){var c=context(),b=window.ktOnline.boards()||rules.boards(c.day),ex=b.online?(b.extra||{}):rules.extraBoards(c.day,c.id);return Object.assign({},b,{shows:(ex.shows||{}).top||[],evolucao:(ex.evolucao||{}).top||[]});};
function renderBoards(){var c=context(),b=window.ktOnline.boards()||rules.boards(c.day),signature=JSON.stringify(b)+JSON.stringify(b.online?b.me:rules.mine(c.day,c.id))+(b.online?'':JSON.stringify(rules.songBoard(c.day,ktSongWeekKey(),c.id))+JSON.stringify(rules.extraBoards(c.day,c.id)))+ktSongWeekKey();if(signature===lastSignature)return;lastSignature=signature;$('ktRankBadge').textContent=b.online?'Ranking online · TsuLiPa⭐World':'Ranking deste aparelho';var nt=document.querySelector('.kt-weekly-note');if(nt)nt.textContent=b.online?'Uma nova semana começa domingo, à meia-noite de Brasília. Vale o melhor resultado de cada Idol na semana, em qualquer aparelho.':'Uma nova semana começa domingo, à meia-noite de Brasília. Apenas os melhores resultados da semana atual são mantidos nesta cópia.';var ft=$('ktFootNote');if(ft&&b.online)ft.textContent='Jogo solo · os outros Idols da sala são contas do TsuLiPa⭐World, sorteadas todo dia. Cinco shows por dia · ranking online da semana · horário de Brasília.';$('ktWeekLabel').textContent='Semana de '+b.week.split('-').reverse().join('/')+' a '+b.ends.split('-').reverse().join('/')+' · Brasília';
 var ex=b.online?(b.extra||{}):rules.extraBoards(c.day,c.id);
 ['score','shows','evolucao'].forEach(function(metric){var list=$('ktBoard-'+metric),d=metric==='score'?{top:b.score,me:b.online?(b.me||{}).score:rules.mine(c.day,c.id).score}:(ex[metric]||{top:[],me:null}),i;list.replaceChildren();
  d.top.forEach(function(row,i){list.appendChild(ktRankLi(['🥇','🥈','🥉','4','5'][i],row,ktRankValor(metric,metric==='score'?row.score:row.valor)));});
  if(d.me&&+d.me.pos>5){var eu=ktRankLi(d.me.pos+'º',null,ktRankValor(metric,d.me.valor),'kt-rank-eu');eu.querySelector('.kt-rank-name').textContent=tr('Você');list.appendChild(eu);}
  for(i=d.top.length;i<3;i++)list.appendChild(ktRankLi(['🥇','🥈','🥉'][i],null,'—','kt-rank-vaga'));});try{renderSongWeek(c,b);}catch(e){}}
/* Música da semana (karaoke-room-views.js). */
function ktSongWeekKey(){try{return window.KaraokeRoomViews?KaraokeRoomViews.songFor(Date.now()):'';}catch(e){return '';}}
function ktSongWeekName(k){var n=document.querySelector('[data-kt-song-best="'+k+'"]'),t=n&&n.closest('.kt-library-track');return t?t.getAttribute('aria-label'):k;}
function ktRankValor(m,v){v=+v||0;return m==='shows'?v+' '+tr(v===1?'show':'shows'):m==='evolucao'?'+'+v.toLocaleString('pt-BR'):v.toLocaleString('pt-BR');}
function ktRankLi(medal,row,value,cls){var li=document.createElement('li'),m=document.createElement('span'),f=row&&row.avatar?document.createElement('canvas'):document.createElement('span'),nm=document.createElement('span'),v=document.createElement('strong');if(cls)li.className=cls;m.className='kt-medal';m.textContent=medal;f.className='kt-rank-face';f.setAttribute('aria-hidden','true');nm.className='kt-rank-name';nm.textContent=row?row.nick:tr('Em breve');v.textContent=value;li.append(m,f,nm,v);if(row&&row.avatar){f.width=f.height=72;try{KaraokeAvatar.draw(f.getContext('2d'),Object.assign({},row.avatar.c,{_avatarA:row.avatar.a||'',_avatarVisual:row.avatar.visual||''}),36,100,2.8,'v',0,0,false);}catch(e){f.hidden=true;}}return li;}
function renderSongWeek(c,b){var k=ktSongWeekKey(),box=$('ktSongWeek');if(!box)return;box.hidden=!k;if(!k)return;
 var d=b.online?(b.song&&b.song.song===k?b.song:{top:[],me:null}):rules.songBoard(c.day,k,c.id),list=$('ktBoard-song'),i;
 $('ktSongWeekTitle').textContent='🎵 '+tr('Música da semana')+': '+ktSongWeekName(k);list.replaceChildren();
 /* 1º da Pontuação: 👑; o ouro vai para o próximo. */
 var lead=b.score&&b.score[0],m=0;d.top.forEach(function(row){var isLead=!!lead&&(b.online?row.nick===lead.nick:row.id===lead.id),li=ktRankLi(isLead?'👑':['🥇','🥈','🥉','4','5'][m++],row,(+row.score||0).toLocaleString('pt-BR'),isLead?'kt-rank-lider':'');if(isLead){var tag=document.createElement('small');tag.className='kt-lider-tag';tag.textContent=tr('já é 1º em Pontuação');li.querySelector('.kt-rank-name').appendChild(tag);}list.appendChild(li);});
 for(i=m;i<3;i++)list.appendChild(ktRankLi(['🥇','🥈','🥉'][i],null,'—','kt-rank-vaga'));
 if(d.me&&+d.me.pos>5){var eu=ktRankLi(d.me.pos+'º',null,(+d.me.valor||0).toLocaleString('pt-BR'),'kt-rank-eu');eu.querySelector('.kt-rank-name').textContent=tr('Você');list.appendChild(eu);}
 [].forEach.call(document.querySelectorAll('.kt-library-track'),function(t){var n=t.querySelector('[data-kt-song-best]'),bb=t.querySelector('.kt-audio-label b');t.classList.toggle('kt-week-song',!!n&&n.dataset.ktSongBest===k);if(bb)bb.setAttribute('data-week-label','⭐ '+tr('Música da semana'));});}
[].forEach.call(document.querySelectorAll('[data-kt-rank]'),function(button){button.onclick=function(){activeTab=button.dataset.ktRank;[].forEach.call(document.querySelectorAll('[data-kt-rank]'),function(b){b.setAttribute('aria-pressed',b.dataset.ktRank===activeTab);});[].forEach.call(document.querySelectorAll('.kt-rank-card[data-metric]'),function(card){card.dataset.mobileActive=card.dataset.metric===activeTab?'true':'false';});};});
return {render:renderBoards,reset:function(){lastSignature='';},aba:function(){return activeTab;}};
}
window.KaraokeRanking={criar:criar};
})();
/* Placar desenhado na sala: lê o mesmo ranking (ktBoardsAgora) no máximo a cada 2 s. Fica global porque a sala o consulta. */
var ktPlacarCache={t:-1e9,b:null};
var ktPlacarModos=[['score','Maiores pontuações','⭐'],['shows','Mais shows na semana','🎤'],['evolucao','Quem mais evoluiu','📈']];
function ktPlacarDadosSemana(){var now=performance.now();if(now-ktPlacarCache.t>2000){ktPlacarCache.t=now;try{ktPlacarCache.b=window.ktBoardsAgora?window.ktBoardsAgora():null;}catch(e){ktPlacarCache.b=null;}}return ktPlacarCache.b;}
