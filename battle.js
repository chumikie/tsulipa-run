/* Idol⭐Battle! v1 — show de palco de 3 rodadas.
   O cliente NUNCA calcula prêmio online: somente battle_jogar() pode premiar.
   Sem conta (ou sem resposta do servidor): treino declaradamente local, sem estrelas ou saves.
   O show no palco só ENCENA o resultado que já veio pronto; pular não muda nada.
*/
(function(){
'use strict';
var T={
 pt:{title:'Idol⭐Battle!',subtitle:'Três Idols, três apresentações!',cant:'Canto',dance:'Dança',charm:'Carisma',daily:'Rival do dia',stage:'Escalar sua unit',play:'Começar show!',again:'Tentar novamente',save:'Salvar polaroid',practice:'Treino sem prêmio.',wait:'Carregando a Arena...',error:'Não foi possível conferir o show. Tente novamente.',used:'Tentativas restantes',win:'Sua unit venceu!',lose:'O rival venceu!',draw:'Empate!',reward:'Recompensa confirmada: ★5',noReward:'Sem recompensa nesta partida',locked:'Volte amanhã para desafiar o rival novamente.',guest:'Entre com Google para disputar partidas oficiais.',my:'Você',other:'Rival',starter:'Unit inicial',rivalHint:'Os três rivais são revelados; a ordem de apresentação permanece secreta.',choose:'Escolha três Idols diferentes, um por rodada.',none:'Sem cards suficientes, a unit inicial entra em cena.',loading:'Preparando a Arena...',points:'Pontos',skip:'Pular ▶▶',prizeDone:'★5 de hoje já conquistada!',prizeOpen:'A primeira vitória de hoje vale ★5.',round:'Rodada',yourUnit:'Sua unit',copies:'Cards repetidos dão bônus no palco.',rankTitle:'Top da Arena · semana',rankEmpty:'Ninguém venceu nesta semana ainda. Seja a primeira pessoa!'},
 en:{title:'Idol⭐Battle!',subtitle:'Three Idols, three performances!',cant:'Singing',dance:'Dance',charm:'Charisma',daily:"Today's rival",stage:'Choose your unit',play:'Start the show!',again:'Try again',save:'Save polaroid',practice:'Practice only, no rewards.',wait:'Loading the Arena...',error:'Could not verify the show. Try again.',used:'Attempts left',win:'Your unit won!',lose:'The rival won!',draw:'Draw!',reward:'Verified reward: ★5',noReward:'No reward this match',locked:'Come back tomorrow to face the rival again.',guest:'Sign in with Google for official matches.',my:'You',other:'Rival',starter:'Starter unit',rivalHint:'See the three rivals, but not their performance order.',choose:'Choose three different Idols, one per round.',none:'Not enough cards? The starter unit can perform.',loading:'Preparing the Arena...',points:'Points',skip:'Skip ▶▶',prizeDone:"Today's ★5 already earned!",prizeOpen:"Today's first win is worth ★5.",round:'Round',yourUnit:'Your unit',copies:'Duplicate cards give a stage bonus.',rankTitle:'Arena Top · this week',rankEmpty:'No wins this week yet. Be the first!'},
 es:{title:'Idol⭐Battle!',subtitle:'¡Tres Idols, tres actuaciones!',cant:'Canto',dance:'Baile',charm:'Carisma',daily:'Rival del día',stage:'Forma tu unit',play:'¡Empezar!',again:'Intentar de nuevo',save:'Guardar polaroid',practice:'Solo práctica, sin premios.',wait:'Cargando la Arena...',error:'No se pudo verificar la actuación.',used:'Intentos restantes',win:'¡Ganó tu unit!',lose:'¡Ganó el rival!',draw:'¡Empate!',reward:'Premio verificado: ★5',noReward:'Sin premio esta vez',locked:'Vuelve mañana.',guest:'Entra con Google para jugar oficialmente.',my:'Tú',other:'Rival',starter:'Unit inicial',rivalHint:'Se ven los rivales, pero no su orden.',choose:'Elige tres Idols distintos.',none:'La unit inicial puede jugar.',loading:'Preparando la Arena...',points:'Puntos',skip:'Saltar ▶▶',prizeDone:'¡★5 de hoy ya conseguida!',prizeOpen:'La primera victoria de hoy vale ★5.',round:'Ronda',yourUnit:'Tu unit',copies:'Los cards repetidos dan un bonus en el escenario.',rankTitle:'Top de la Arena · semana',rankEmpty:'Nadie ha ganado esta semana todavía. ¡Sé la primera persona!'},
 id:{title:'Idol⭐Battle!',subtitle:'Tiga Idol, tiga penampilan!',cant:'Menyanyi',dance:'Tari',charm:'Karisma',daily:'Lawan hari ini',stage:'Pilih unit',play:'Mulai pertunjukan!',again:'Coba lagi',save:'Simpan polaroid',practice:'Latihan saja, tanpa hadiah.',wait:'Memuat Arena...',error:'Hasil tidak dapat diverifikasi.',used:'Percobaan tersisa',win:'Unitmu menang!',lose:'Lawan menang!',draw:'Seri!',reward:'Hadiah terverifikasi: ★5',noReward:'Tanpa hadiah kali ini',locked:'Kembali besok.',guest:'Masuk Google untuk pertandingan resmi.',my:'Kamu',other:'Lawan',starter:'Unit awal',rivalHint:'Tiga lawan terlihat, urutannya rahasia.',choose:'Pilih tiga Idol berbeda.',none:'Unit awal bisa digunakan.',loading:'Menyiapkan Arena...',points:'Poin',skip:'Lewati ▶▶',prizeDone:'★5 hari ini sudah didapat!',prizeOpen:'Kemenangan pertama hari ini bernilai ★5.',round:'Babak',yourUnit:'Unitmu',copies:'Kartu duplikat memberi bonus di panggung.',rankTitle:'Top Arena · minggu ini',rankEmpty:'Belum ada yang menang minggu ini. Jadilah yang pertama!'},
 th:{title:'Idol⭐Battle!',subtitle:'ไอดอล 3 คน 3 รอบ!',cant:'ร้องเพลง',dance:'เต้น',charm:'เสน่ห์',daily:'คู่แข่งวันนี้',stage:'เลือกยูนิต',play:'เริ่มโชว์!',again:'ลองอีกครั้ง',save:'บันทึกโพลารอยด์',practice:'โหมดฝึกซ้อมเท่านั้น ไม่มีรางวัล',wait:'กำลังโหลดอารีนา...',error:'ตรวจสอบผลไม่ได้ ลองอีกครั้ง',used:'ครั้งที่เหลือ',win:'ยูนิตของคุณชนะ!',lose:'คู่แข่งชนะ!',draw:'เสมอ!',reward:'รางวัลยืนยัน: ★5',noReward:'รอบนี้ไม่มีรางวัล',locked:'กลับมาใหม่พรุ่งนี้',guest:'เข้าสู่ระบบ Google เพื่อเล่นจริง',my:'คุณ',other:'คู่แข่ง',starter:'ยูนิตเริ่มต้น',rivalHint:'เห็นคู่แข่งทั้งสาม แต่ไม่เห็นลำดับ',choose:'เลือกไอดอล 3 คนไม่ซ้ำกัน',none:'ใช้ยูนิตเริ่มต้นได้',loading:'กำลังเตรียมอารีนา...',points:'คะแนน',skip:'ข้าม ▶▶',prizeDone:'ได้รับ ★5 ของวันนี้แล้ว!',prizeOpen:'ชนะครั้งแรกของวันนี้ได้ ★5',round:'รอบ',yourUnit:'ยูนิตของคุณ',copies:'การ์ดซ้ำให้โบนัสบนเวที',rankTitle:'ท็อปอารีนา · สัปดาห์นี้',rankEmpty:'สัปดาห์นี้ยังไม่มีใครชนะ มาเป็นคนแรกกันเถอะ!'},
 ja:{title:'Idol⭐Battle!',subtitle:'3人のアイドルで3ステージ！',cant:'歌',dance:'ダンス',charm:'カリスマ',daily:'今日のライバル',stage:'ユニットを編成',play:'ショー開始！',again:'もう一度',save:'ポラロイドを保存',practice:'練習のみ。報酬はありません。',wait:'アリーナを読み込み中…',error:'結果を確認できませんでした。',used:'残り挑戦回数',win:'あなたのユニットの勝ち！',lose:'ライバルの勝ち！',draw:'引き分け！',reward:'確定報酬：★5',noReward:'今回は報酬なし',locked:'また明日挑戦してね',guest:'公式戦はGoogleでログイン',my:'あなた',other:'ライバル',starter:'初期ユニット',rivalHint:'ライバル3人は見えるけど、出番は秘密',choose:'異なる3人のアイドルを選んでね',none:'最初のユニットでも遊べます',loading:'アリーナを準備中…',points:'点',skip:'スキップ ▶▶',prizeDone:'今日の★5は獲得済み！',prizeOpen:'今日の初勝利で★5',round:'ラウンド',yourUnit:'あなたのユニット',copies:'同じカードが複数あるとステージでボーナス',rankTitle:'アリーナTOP・今週',rankEmpty:'今週はまだ勝者がいません。最初の一人になろう！'}
};
var DEFAULT=[{nick:'Tsu',canto:5,danca:6,carisma:5,qtd:1},{nick:'Lirika',canto:6,danca:5,carisma:5,qtd:1},{nick:'Pati',canto:5,danca:5,carisma:6,qtd:1}];
var ATR=['canto','danca','carisma'],ICO=['🎤','💃','💖'],COR=['#ff6fb5','#4dd8ff','#b6ff3b'];
var SW=560,SH=320,DUR=2;               // palco lógico (px) e duração de cada rodada (s)
var ov=null,estado=null,unit=[],rodadas=null,ocupado=false,msg='',servidor=false;
var fase='escalar',showT0=0,showRaf=0; // escalar → show → fim
var ranking=null;                       // Top da Arena (só aparece se o servidor responder)
function lang(){return typeof LANG==='string'&&T[LANG]?LANG:'pt';}
function trB(k){return T[lang()][k]||T.pt[k]||k;}
function esc(x){return typeof escHtml==='function'?escHtml(String(x)):String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function logado(){return typeof contaJ!=='undefined'&&!!contaJ&&typeof contaRpc==='function';}
function calmo(){try{return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);}catch(e){return false;}}
function agora(){return (window.performance&&performance.now?performance.now():Date.now())/1000;}
function hoje(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function chave(n){return String(n==null?'':n).trim().toLowerCase();}
function treino(){return {ok:true,dia:hoje(),starter:true,tentativas:0,max_tentativas:5,premiado:false,
  cards:DEFAULT.map(function(c){return Object.assign({},c);}),
  rival:[{nick:'Tsu',canto:5,danca:4,carisma:6},{nick:'Lirika',canto:4,danca:6,carisma:5},{nick:'Pati',canto:6,danca:5,carisma:4}]};}

/* ---------- Idols no canvas ----------
   Usa o mesmo desenho do jogo (perfChar + drawChar + contorno de adesivo), ligando o
   visual só durante o desenho e devolvendo os globais como estavam. Sem essas funções
   (página de teste, erro de carga) cai num medalhão simples — nunca quebra o Battle. */
function visual(nick,meu){
 var k=chave(nick),trio=['tsu','lirika','pati'].indexOf(k),achou=null;
 var trioAntes=!servidor||(meu&&estado&&estado.starter);
 function doTrio(){
   if(trio<0||typeof HUB_TRIO==='undefined'||typeof HUB_TRIO_DRAW_CHARS==='undefined'||typeof CH==='undefined')return null;
   var m=HUB_TRIO[trio],c=HUB_TRIO_DRAW_CHARS[trio],base=CH[m[0]];if(!c||!base)return null;
   c.out=base.out;c.outcol=base.outcol;return {c:c,expr:m[4],pose:m[1],acc:''};
 }
 function daVitrine(){
   if(typeof hubIdolsDados==='undefined'||!hubIdolsDados||!Array.isArray(hubIdolsDados.idols)||typeof perfChar!=='function')return null;
   for(var i=0;i<hubIdolsDados.idols.length;i++){
     var p=hubIdolsDados.idols[i];
     if(p&&p.avatar&&p.avatar.c&&chave(p.nick)===k)
       return {c:perfChar(p.avatar),expr:[0,1,2,3,4,5,6].indexOf(+p.avatar.expr)>=0?+p.avatar.expr:2,
         pose:typeof p.avatar.pose==='string'?p.avatar.pose:'',acc:typeof p.avatar.a==='string'?p.avatar.a:''};
   }
   return null;
 }
 try{achou=trioAntes?(doTrio()||daVitrine()):(daVitrine()||doTrio());}catch(e){achou=null;}
 return achou;
}
function medalhao(x,nick,cx,chao,sc){
 var k=chave(nick),h=0,i;for(i=0;i<k.length;i++)h=(h*31+k.charCodeAt(i))%360;
 var r=15*sc,cy=chao-r-4*sc;
 x.save();x.fillStyle='hsl('+h+',72%,82%)';x.strokeStyle='#fff';x.lineWidth=2.2*sc/2.4;
 x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();x.stroke();
 x.fillStyle='hsl('+h+',55%,36%)';x.textAlign='center';x.textBaseline='middle';
 x.font='700 '+(r*1.05)+'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';
 x.fillText((String(nick||'?').trim().charAt(0)||'?').toUpperCase(),cx,cy+r*.06);
 x.restore();
}
function desenharIdol(x,nick,meu,cx,chao,sc,t,o){
 o=o||{};var v=visual(nick,meu),bob=o.bob||0,feito=false,salvo=null;
 x.save();
 if(o.apagado)x.globalAlpha=.45;
 x.fillStyle='rgba(20,6,50,.3)';x.beginPath();x.ellipse(cx,chao,10*sc,2*sc,0,0,Math.PI*2);x.fill();
 if(o.vira){x.translate(cx*2,0);x.scale(-1,1);}
 if(v&&typeof drawChar==='function'&&typeof perfCharContorno==='function'){
   try{
     salvo=[state,pw,dpw,rankI,sash,accSel,frame,charPose];
     state='play';pw=null;dpw=null;rankI=0;sash=false;accSel=v.acc;frame=Math.floor(t*60);
     perfCharContorno(x,cx-15*sc,chao-44*sc+bob,sc,function(){charPose=o.semPose?'':v.pose;drawChar(v.c,0,0,0,o.expr==null?v.expr:o.expr,false);});
     feito=true;
   }catch(e){feito=false;}
   finally{if(salvo){state=salvo[0];pw=salvo[1];dpw=salvo[2];rankI=salvo[3];sash=salvo[4];accSel=salvo[5];frame=salvo[6];charPose=salvo[7];}}
 }
 if(!feito)medalhao(x,nick,cx,chao+bob,sc);
 x.restore();
}
function fonte(px){return '400 '+px+'px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';}
function nomeCurto(n){n=String(n==null?'?':n);return n.length>13?n.slice(0,12)+'…':n;}

/* ---------- Janela ---------- */
function montar(){
 if(ov)return;
 ov=document.createElement('div');ov.className='ov battleov tw-window-overlay';ov.hidden=true;ov.id='battleOv';
 ov.innerHTML='<div class="panel battlep tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="battleTit">'+
  '<button type="button" class="perfx tw-window-control tw-window-close" data-battle="fechar" aria-label="✕">✕</button>'+
  '<h2 class="tw-modal-title" id="battleTit" translate="no">Idol⭐Battle!</h2><small class="tw-modal-jp" lang="ja">アイドルバトル</small>'+
  '<p class="battle-sub" id="battleSub"></p>'+
  '<canvas id="battleStage" class="battle-stage" width="'+SW*2+'" height="'+SH*2+'" role="img" hidden></canvas>'+
  '<div id="battleCorpo" aria-live="polite"></div><canvas id="battleFoto" width="1120" height="840" hidden></canvas></div>';
 document.body.appendChild(ov);
 ov.addEventListener('click',function(e){
   if(e.target===ov){fechar();return;}
   var b=e.target.closest&&e.target.closest('[data-battle]');if(!b)return;
   var a=b.getAttribute('data-battle');
   if(a==='fechar'){fechar();return;}
   if(a==='pular'){fimDoShow();return;}
   if(ocupado)return;
   if(a==='jogar'){jogar();return;}
   if(a==='outra'){rodadas=null;msg='';fase='escalar';render();return;}
   if(a==='salvar'){salvar();return;}
 });
 ov.addEventListener('change',function(e){
   if(e.target.matches&&e.target.matches('[data-battle-slot]')){
     // Escolher um Idol que já está em outra rodada troca os dois de lugar.
     var i=Number(e.target.getAttribute('data-battle-slot')),v=e.target.value,j=unit.indexOf(v);
     if(j>=0&&j!==i)unit[j]=unit[i];
     unit[i]=v;render();
   }
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov&&!ov.hidden){e.stopPropagation();fechar();}});
}
function abrir(){
 montar();ov.hidden=false;estado=treino();unit=estado.cards.slice(0,3).map(function(c){return c.nick;});
 rodadas=null;ocupado=false;msg='';servidor=false;fase='escalar';ranking=null;render();
 // Os visuais dos cards vêm da vitrine que o Hub já usa (sem consulta nova só para o Battle).
 try{if(typeof hubIdolsCarregar==='function'&&!(typeof hubIdolsDados!=='undefined'&&hubIdolsDados)&&logado())hubIdolsCarregar();}catch(e){}
 if(logado()){
   // Falha ou ausência da RPC nunca cria pontuação: mantém treino explícito.
   contaRpc('battle_status').then(function(r){
     if(!ov||ov.hidden||fase!=='escalar'||ocupado)return;
     if(r&&r.ok&&Array.isArray(r.cards)&&r.cards.length>=3&&Array.isArray(r.rival)&&r.rival.length===3){
       estado=r;servidor=true;
       unit=melhorEscalacao(r.cards);
       render();
     }
   }).catch(function(){});
   carregarRanking();
 }
}
// Ranking semanal de vitórias. Sem a função no servidor (ou com erro) a seção simplesmente não aparece.
function carregarRanking(){
 if(!logado())return;
 contaRpc('battle_ranking').then(function(r){
   if(!r||!r.ok||!Array.isArray(r.top))return;
   ranking=r;if(ov&&!ov.hidden&&fase!=='show')render();
 }).catch(function(){});
}
function rankingHtml(){
 if(!ranking||!servidor)return '';
 var top=ranking.top.slice(0,5),eu=ranking.eu&&typeof ranking.eu==='object'?ranking.eu:null;
 var h='<section class="battle-rank"><h3>🏆 '+esc(trB('rankTitle'))+'</h3>';
 if(!top.length)h+='<p class="battle-hint">'+esc(trB('rankEmpty'))+'</p>';
 else h+='<ol>'+top.map(function(p,i){
   return '<li><span class="battle-med">'+(['🥇','🥈','🥉'][i]||(i+1)+'º')+'</span>'+
    '<canvas class="battle-av battle-av-s" width="132" height="150" data-battle-av="'+esc(p.nick)+'" data-meu="0" aria-hidden="true"></canvas>'+
    '<b>'+esc(p.nick)+'</b><small>🏆 '+(Number(p.score)||0)+'</small></li>';}).join('')+'</ol>';
 if(eu&&Number(eu.pos)>0)h+='<p class="battle-rank-eu">'+esc(trB('my'))+': '+Number(eu.pos)+'º · 🏆 '+(Number(eu.score)||0)+'</p>';
 return h+'</section>';
}
function fechar(){pararShow();if(ov)ov.hidden=true;}
function nomeRound(i){return trB(['cant','dance','charm'][i]);}
function valor(c,i){return Number(c&&c[ATR[i]])||0;}
function cardDe(n){return estado.cards.find(function(c){return c.nick===n;})||null;}
// Sugestão inicial: a combinação de 3 cards diferentes com a maior soma nas três rodadas.
function melhorEscalacao(cards){
 var L=cards.slice(0,40),best=null,bs=-1,a,b,c;
 for(a=0;a<L.length;a++)for(b=0;b<L.length;b++){if(b===a)continue;
   for(c=0;c<L.length;c++){if(c===a||c===b)continue;
     var s=valor(L[a],0)+valor(L[b],1)+valor(L[c],2);
     if(s>bs){bs=s;best=[L[a].nick,L[b].nick,L[c].nick];}
   }}
 return best||cards.slice(0,3).map(function(x){return x.nick;});
}
function chips(c,destaque){
 return '<span class="battle-chips">'+ATR.map(function(a,i){
   return '<i'+(destaque===i?' class="on"':'')+'>'+ICO[i]+Number(c[a]||0)+'</i>';}).join('')+'</span>';
}
function idolHtml(c,meu,rotulo,destaque){
 return '<div class="battle-idol">'+(rotulo?'<small>'+rotulo+'</small>':'')+
   '<canvas class="battle-av" width="132" height="150" data-battle-av="'+esc(c.nick)+'" data-meu="'+(meu?1:0)+'" aria-hidden="true"></canvas>'+
   '<b>'+esc(c.nick)+'</b>'+chips(c,destaque)+
   (meu&&Number(c.qtd)>1?'<em title="'+esc(trB('copies'))+'">×'+Math.min(99,Number(c.qtd))+'</em>':'')+'</div>';
}
function desenharMiniaturas(){
 var L=ov.querySelectorAll('[data-battle-av]'),t=agora();
 for(var i=0;i<L.length;i++){
   var cv=L[i],x=cv.getContext&&cv.getContext('2d');if(!x)continue;
   x.clearRect(0,0,cv.width,cv.height);
   desenharIdol(x,cv.getAttribute('data-battle-av'),cv.getAttribute('data-meu')==='1',cv.width/2,cv.height-12,2.9,t,{});
 }
}
function render(){
 if(!ov||ov.hidden||!estado)return;
 ov.querySelector('#battleSub').textContent=trB('subtitle');
 var area=ov.querySelector('#battleCorpo'),stage=ov.querySelector('#battleStage');
 stage.hidden=fase==='escalar';
 if(fase==='show'){
   area.innerHTML='<div class="btns"><button type="button" class="btn alt battle-skip" data-battle="pular">'+esc(trB('skip'))+'</button></div>';
   return;
 }
 var max=Number(estado.max_tentativas)||5,usadas=Number(estado.tentativas)||0;
 var limite=servidor&&usadas>=max;
 var texto='<div class="battle-status'+(servidor?' real':' treino')+'">'+
  (servidor?'★ '+esc(trB('used'))+': '+Math.max(0,max-usadas)+' / '+max+
     '<br><small>'+esc(estado.premiado?trB('prizeDone'):trB('prizeOpen'))+'</small>':
    '🧪 '+esc(trB('practice'))+(logado()?'':' '+esc(trB('guest'))))+'</div>';
 if(fase==='fim'&&rodadas){
   var wins=rodadas.filter(function(c){return c.ganhou===true;}).length,losses=3-wins;
   var cab=wins>losses?trB('win'):trB('lose');
   texto+='<section class="battle-resultado"><h3>'+(wins>losses?'🏆 ':'🎭 ')+esc(cab)+' <span class="battle-placar">'+wins+' × '+losses+'</span></h3>';
   texto+='<div class="battle-result-grid">'+rodadas.map(function(r,i){return '<div class="battle-round'+(r.ganhou?' win':'')+'"><b>'+ICO[i]+' '+esc(nomeRound(i))+'</b>'+
      '<span>'+esc(r.meu||unit[i])+' <strong>'+Number(r.eu||0)+'</strong> : <strong>'+Number(r.eles||0)+'</strong> '+esc(r.rival||'?')+'</span></div>';}).join('')+'</div>';
   texto+='<p>'+esc(servidor&&Number(estado.ultimo_premio)===5?trB('reward'):trB('noReward'))+'</p>'+
   '<button type="button" class="btn alt" data-battle="salvar">📸 '+esc(trB('save'))+'</button> '+
   '<button type="button" class="btn" data-battle="outra"'+(limite?' disabled':'')+'>'+esc(limite?trB('locked'):trB('again'))+'</button></section>';
   area.innerHTML=texto+rankingHtml();desenharMiniaturas();return;
 }
 texto+='<section class="battle-rival"><h3>🏟️ '+esc(trB('daily'))+'</h3><div class="battle-trio">'+
   estado.rival.map(function(c){return idolHtml(c,false,'',-1);}).join('')+
   '</div><p class="battle-hint">'+esc(trB('rivalHint'))+'</p></section>';
 texto+='<section class="battle-escalar"><h3>✨ '+esc(trB('stage'))+'</h3><div class="battle-trio">'+
   unit.map(function(n,i){var c=cardDe(n)||{nick:n};return idolHtml(c,true,ICO[i]+' '+esc(nomeRound(i)),i);}).join('')+
   '</div><p class="battle-hint">'+esc(estado.starter?trB('none'):trB('choose'))+'</p>';
 for(var i=0;i<3;i++){
   texto+='<label class="battle-slot"><span>'+ICO[i]+' '+esc(nomeRound(i))+'</span><select data-battle-slot="'+i+'">'+
    estado.cards.map(function(c){return '<option value="'+esc(c.nick)+'"'+(unit[i]===c.nick?' selected':'')+'>'+esc(c.nick)+
     ' · '+valor(c,i)+'/10</option>';}).join('')+'</select></label>';
 }
 texto+='</section>';
 if(msg)texto+='<p class="battle-error">'+esc(msg)+'</p>';
 texto+='<div class="btns"><button type="button" class="btn battle-start" data-battle="jogar"'+(limite||ocupado?' disabled':'')+'>'+
    esc(limite?trB('locked'):ocupado?trB('loading'):trB('play'))+'</button></div>';
 area.innerHTML=texto+rankingHtml();
 desenharMiniaturas();
}
function treinoShow(){
 var other=estado.rival;
 return unit.map(function(n,i){
   var eu=cardDe(n)||DEFAULT[i];
   var rival=other[(i+1)%3],a=valor(eu,i),b=valor(rival,i);
   return {tipo:ATR[i],meu:n,rival:rival.nick,eu:a,eles:b,ganhou:a>b};
 });
}
function jogar(){
 if(ocupado||rodadas||!estado)return;
 if(unit.length!==3||new Set(unit).size!==3||unit.some(function(x){return !cardDe(x);})){
   msg=trB('choose');render();return;
 }
 ocupado=true;msg='';render();
 if(!servidor){
   rodadas=treinoShow();ocupado=false;comecarShow();return;
 }
 // O servidor aceita uma chave de idempotência por partida para evitar
 // dois giros se a rede repetir a mesma requisição.
 if(!window.crypto||typeof window.crypto.randomUUID!=='function'){
   msg=trB('error');ocupado=false;render();return;
 }
 var requisicao=window.crypto.randomUUID();
 contaRpc('battle_jogar',{p_unit:unit.slice(),p_requisicao:requisicao}).then(function(r){
   if(!r||!r.ok||!Array.isArray(r.rodadas)||r.rodadas.length!==3)throw Error('invalid result');
   rodadas=r.rodadas;estado.tentativas=Number(r.tentativas);estado.ultimo_premio=Number(r.premio)||0;
   if(estado.ultimo_premio===5)estado.premiado=true;
   if(window.TWVidaCidade)window.TWVidaCidade.registrar('battle',{id:String(r.dia||'')+'/'+String(r.tentativas||'')});
   if(estado.ultimo_premio===5&&typeof r.stars==='number'&&typeof starT!=='undefined'){
     starT=r.stars;try{localStorage.setItem('brs48cr_st',starT);}catch(e){}
     if(typeof setBest==='function')try{setBest();}catch(e){}
   }
   ocupado=false;comecarShow();carregarRanking();
 }).catch(function(){msg=trB('error');ocupado=false;render();});
}

/* ---------- Show no palco ---------- */
function pararShow(){if(showRaf){cancelAnimationFrame(showRaf);showRaf=0;}}
function comecarShow(){
 if(!ov||ov.hidden||!rodadas)return;
 pararShow();
 if(calmo()||typeof requestAnimationFrame!=='function'){fimDoShow();return;}
 fase='show';showT0=agora();render();
 (function quadro(){
   showRaf=0;if(!ov||ov.hidden||fase!=='show')return;
   var t=agora()-showT0;
   if(t>=DUR*3+.15){fimDoShow();return;}
   desenharPalco(t);showRaf=requestAnimationFrame(quadro);
 })();
}
function fimDoShow(){
 if(!rodadas)return;
 pararShow();fase='fim';render();desenharPalco(-1);desenharPolaroid();
 var st=ov.querySelector('#battleStage');
 if(st){var w=rodadas.filter(function(r){return r.ganhou;}).length;st.setAttribute('aria-label','Idol⭐Battle! '+w+' × '+(3-w));}
}
function fundoPalco(x,cor,t){
 var g=x.createLinearGradient(0,0,0,SH);g.addColorStop(0,'#241050');g.addColorStop(.6,'#55249c');g.addColorStop(1,'#2a1258');
 x.fillStyle=g;x.fillRect(0,0,SW,SH);
 // holofotes
 x.save();x.globalCompositeOperation='lighter';
 [[150,-.18],[410,.18]].forEach(function(h,i){
   var bal=Math.sin(t*1.3+i*2)*.07,lg=x.createLinearGradient(h[0],0,h[0],250);
   lg.addColorStop(0,cor);lg.addColorStop(1,'rgba(255,255,255,0)');
   x.globalAlpha=.3;x.fillStyle=lg;x.beginPath();x.moveTo(h[0]+(h[1]+bal)*300-14,0);x.lineTo(h[0]+(h[1]+bal)*300+14,0);
   x.lineTo(h[0]+78,250);x.lineTo(h[0]-78,250);x.closePath();x.fill();
 });
 x.restore();
 // estrelinhas do telão
 x.fillStyle='rgba(255,255,255,.75)';
 for(var i=0;i<16;i++){var px=(i*97+31)%SW,py=18+(i*53)%110,r=1+((i*7)%3)*.45,a=.35+.4*Math.abs(Math.sin(t*1.7+i));
   x.globalAlpha=a;x.beginPath();x.arc(px,py,r,0,Math.PI*2);x.fill();}
 x.globalAlpha=1;
 // palco
 var pg=x.createLinearGradient(0,222,0,262);pg.addColorStop(0,'#ffd9f0');pg.addColorStop(1,'#c79bf2');
 x.fillStyle=pg;x.beginPath();x.ellipse(SW/2,244,238,26,0,0,Math.PI*2);x.fill();
 x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=2;x.beginPath();x.ellipse(SW/2,244,238,26,0,0,Math.PI*2);x.stroke();
 // plateia com lightsticks
 for(var k=0;k<15;k++){
   var cx=18+k*37.5,cy=SH+6-(k%2)*7;
   x.fillStyle='#160a36';x.beginPath();x.arc(cx,cy-20,13,0,Math.PI*2);x.fill();x.fillRect(cx-16,cy-12,32,30);
   var ang=Math.sin(t*4+k*1.3)*.32,lx=cx+11+Math.sin(ang)*20,ly=cy-22-Math.cos(ang)*20;
   x.strokeStyle=['#ff6fb5','#b6ff3b','#4dd8ff','#ffe14d'][k%4];x.lineWidth=3.2;x.lineCap='round';
   x.beginPath();x.moveTo(cx+11,cy-20);x.lineTo(lx,ly);x.stroke();
   x.save();x.globalAlpha=.35;x.fillStyle=x.strokeStyle;x.beginPath();x.arc(lx,ly,6,0,Math.PI*2);x.fill();x.restore();
 }
}
function pontos(x,ate){
 for(var i=0;i<3;i++){
   var cx=SW/2-24+i*24,r=rodadas[i];
   x.beginPath();x.arc(cx,54,7.5,0,Math.PI*2);
   x.fillStyle=i<ate?(r.ganhou?'#b6ff3b':'#ff6fb5'):'rgba(255,255,255,.28)';x.fill();
   x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=1.4;x.stroke();
 }
}
function contorno(x,txt,px,py,cor){
 x.lineJoin='round';x.strokeStyle='rgba(30,10,70,.85)';x.lineWidth=5;x.strokeText(txt,px,py);x.fillStyle=cor||'#fff';x.fillText(txt,px,py);
}
function desenharPalco(t){
 var cv=ov&&ov.querySelector('#battleStage'),x=cv&&cv.getContext&&cv.getContext('2d');if(!x||!rodadas)return;
 var fim=t<0,tt=fim?agora():t;
 x.setTransform(cv.width/SW,0,0,cv.height/SH,0,0);x.clearRect(0,0,SW,SH);
 x.textAlign='center';x.textBaseline='alphabetic';
 if(fim){
   var wins=rodadas.filter(function(r){return r.ganhou;}).length,venceu=wins>=2;
   fundoPalco(x,venceu?'#ffe14d':'#b8a3ff',0);
   if(venceu)for(var k=0;k<34;k++){x.fillStyle=['#ff6fb5','#b6ff3b','#4dd8ff','#ffe14d','#fff'][k%5];
     x.save();x.translate((k*89+40)%SW,60+(k*47)%150);x.rotate(k);x.fillRect(-3,-1.5,6,3);x.restore();}
   unit.forEach(function(n,i){desenharIdol(x,n,true,SW/2+(i-1)*112,240-(i===1?0:4),2.5,0,{expr:venceu?3:null});
     x.font=fonte(16);contorno(x,nomeCurto(n),SW/2+(i-1)*112,272);});
   x.font=fonte(24);contorno(x,(venceu?'🏆 ':'')+(venceu?trB('win'):trB('lose')),SW/2,32,venceu?'#fff3a8':'#fff');
   pontos(x,3);
   x.font=fonte(22);contorno(x,wins+' × '+(3-wins),SW/2,92);
   return;
 }
 var i=Math.min(2,Math.floor(tt/DUR)),u=tt-i*DUR,r=rodadas[i];
 fundoPalco(x,COR[i],tt);
 x.font=fonte(24);contorno(x,ICO[i]+' '+nomeRound(i)+'  '+(i+1)+'/3',SW/2,32);
 pontos(x,i);
 var entra=Math.min(1,u/.35),e=1-Math.pow(1-entra,3);
 var conta=Math.max(0,Math.min(1,(u-.4)/.8)),veredito=u>1.3;
 var mx=170-(1-e)*220,rx=390+(1-e)*220;
 var pulo=function(ganhou){return veredito?(ganhou?-Math.abs(Math.sin((u-1.3)*9))*10:0):-Math.abs(Math.sin(tt*7))*3;};
 desenharIdol(x,r.meu||unit[i],true,mx,238,2.6,tt,{bob:pulo(r.ganhou),apagado:veredito&&!r.ganhou,expr:veredito&&r.ganhou?3:null,semPose:!veredito});
 desenharIdol(x,r.rival,false,rx,238,2.6,tt,{bob:pulo(!r.ganhou),apagado:veredito&&r.ganhou,vira:true,expr:veredito&&!r.ganhou?3:null,semPose:!veredito});
 x.font=fonte(16);
 contorno(x,nomeCurto(r.meu||unit[i]),mx,272);
 contorno(x,nomeCurto(r.rival),rx,272);
 x.font=fonte(13);
 contorno(x,trB('my'),mx,100,'#ffd9f0');
 contorno(x,trB('other'),rx,100,'#d9f3ff');
 if(u>.4){
   var a=Math.round(Number(r.eu||0)*conta),b=Math.round(Number(r.eles||0)*conta);
   x.font=fonte(veredito&&r.ganhou?58:48);contorno(x,String(a),SW/2-46,182,veredito&&r.ganhou?'#fff3a8':'#fff');
   x.font=fonte(veredito&&!r.ganhou?58:48);contorno(x,String(b),SW/2+46,182,veredito&&!r.ganhou?'#fff3a8':'#fff');
   x.font=fonte(22);contorno(x,':',SW/2,172);
 }
 if(veredito){
   var wx=r.ganhou?mx:rx,s=1+Math.max(0,.5-(u-1.3))*1.2;
   x.save();x.translate(wx,88);x.scale(s,s);x.font=fonte(24);contorno(x,'★ WIN ★',0,0,'#fff3a8');x.restore();
 }
}
function desenharPolaroid(){
 var cv=ov&&ov.querySelector('#battleFoto');if(!cv||!rodadas)return;
 var x=cv.getContext('2d'),W=560,H=420;
 x.setTransform(cv.width/W,0,0,cv.height/H,0,0);x.clearRect(0,0,W,H);
 var wins=rodadas.filter(function(r){return r.ganhou;}).length,venceu=wins>=2;
 x.fillStyle='#fff';x.fillRect(0,0,W,H);
 x.save();x.beginPath();x.rect(18,18,W-36,H-108);x.clip();
 var g=x.createLinearGradient(0,0,W,H);
 g.addColorStop(0,'#42278c');g.addColorStop(.55,'#a044c1');g.addColorStop(1,'#ff75b6');
 x.fillStyle=g;x.fillRect(0,0,W,H);
 x.fillStyle='rgba(255,255,255,.8)';
 for(var k=0;k<22;k++){x.globalAlpha=.3+((k*37)%60)/100;x.beginPath();x.arc(30+(k*83)%500,34+(k*59)%120,1+(k%3)*.6,0,Math.PI*2);x.fill();}
 x.globalAlpha=1;
 var pg=x.createLinearGradient(0,262,0,300);pg.addColorStop(0,'#ffd9f0');pg.addColorStop(1,'#c79bf2');
 x.fillStyle=pg;x.beginPath();x.ellipse(W/2,286,250,26,0,0,Math.PI*2);x.fill();
 x.textAlign='center';x.textBaseline='alphabetic';
 x.font=fonte(26);contorno(x,'Idol⭐Battle!',W/2,62);
 x.font=fonte(15);contorno(x,(venceu?'🏆 ':'')+wins+' × '+(3-wins),W/2,92,venceu?'#fff3a8':'#fff');
 unit.forEach(function(n,i){
   desenharIdol(x,n,true,W/2+(i-1)*150,284,3,0,{expr:venceu?3:null});
   x.font=fonte(12);contorno(x,ICO[i]+' '+nomeCurto(n),W/2+(i-1)*150,308);
 });
 x.restore();
 x.fillStyle='#48306e';x.font=fonte(15);x.textAlign='center';
 x.fillText(trB('yourUnit')+' · '+trB('daily')+' · '+estado.dia,W/2,H-52);
 x.font=fonte(11);x.fillStyle='#8a6cc0';x.fillText('TsuLiPa⭐World',W/2,H-26);
}
function salvar(){
 var cv=ov&&ov.querySelector('#battleFoto');if(!cv||!rodadas)return;
 var a=document.createElement('a');a.download='idol-battle-'+String(estado.dia||hoje())+'.png';a.href=cv.toDataURL('image/png');
 document.body.appendChild(a);a.click();a.remove();
}
window.TW_BATTLE_ON=true;window.battleAbrir=abrir;window.TW_BATTLE_TR=T;
})();
