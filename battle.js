/* Idol⭐Battle! v1 — show de palco de 3 rodadas.
   O cliente NUNCA calcula prêmio online: somente battle_jogar() pode premiar.
   Sem RPC instalada: treino declaradamente local, sem estrelas ou saves.
*/
(function(){
'use strict';
var T={
 pt:{title:'Idol⭐Battle!',subtitle:'Três Idols, três apresentações!',cant:'Canto',dance:'Dança',charm:'Carisma',daily:'Rival do dia',stage:'Escalar sua unit',play:'Começar show!',again:'Tentar novamente',save:'Salvar polaroid',practice:'Treino sem prêmio — o Battle online aguarda ativação segura no servidor.',wait:'Carregando a Arena...',error:'Não foi possível conferir o show. Tente novamente.',used:'Tentativas restantes',win:'Sua unit venceu!',lose:'O rival venceu!',draw:'Empate!',reward:'Recompensa confirmada: ★5',noReward:'Sem recompensa nesta partida',locked:'Volte amanhã para desafiar o rival novamente.',guest:'Entre com Google para disputar partidas oficiais.',my:'Você',other:'Rival',starter:'Unit inicial',rivalHint:'Os três rivais são revelados; a ordem de apresentação permanece secreta.',choose:'Escolha três Idols diferentes, um por rodada.',none:'Sem cards suficientes, a unit inicial entra em cena.',loading:'Preparando a Arena...',points:'Pontos'},
 en:{title:'Idol⭐Battle!',subtitle:'Three Idols, three performances!',cant:'Singing',dance:'Dance',charm:'Charisma',daily:"Today's rival",stage:'Choose your unit',play:'Start the show!',again:'Try again',save:'Save polaroid',practice:'Practice only — online Battle is waiting for safe server activation; no rewards.',wait:'Loading the Arena...',error:'Could not verify the show. Try again.',used:'Attempts left',win:'Your unit won!',lose:'The rival won!',draw:'Draw!',reward:'Verified reward: ★5',noReward:'No reward this match',locked:'Come back tomorrow to face the rival again.',guest:'Sign in with Google for official matches.',my:'You',other:'Rival',starter:'Starter unit',rivalHint:'See the three rivals, but not their performance order.',choose:'Choose three different Idols, one per round.',none:'Not enough cards? The starter unit can perform.',loading:'Preparing the Arena...',points:'Points'},
 es:{title:'Idol⭐Battle!',subtitle:'¡Tres Idols, tres actuaciones!',cant:'Canto',dance:'Baile',charm:'Carisma',daily:'Rival del día',stage:'Forma tu unit',play:'¡Empezar!',again:'Intentar de nuevo',save:'Guardar polaroid',practice:'Solo práctica — el Battle online espera activación segura; sin premios.',wait:'Cargando la Arena...',error:'No se pudo verificar la actuación.',used:'Intentos restantes',win:'¡Ganó tu unit!',lose:'¡Ganó el rival!',draw:'¡Empate!',reward:'Premio verificado: ★5',noReward:'Sin premio esta vez',locked:'Vuelve mañana.',guest:'Entra con Google para jugar oficialmente.',my:'Tú',other:'Rival',starter:'Unit inicial',rivalHint:'Se ven los rivales, pero no su orden.',choose:'Elige tres Idols distintos.',none:'La unit inicial puede jugar.',loading:'Preparando la Arena...',points:'Puntos'},
 id:{title:'Idol⭐Battle!',subtitle:'Tiga Idol, tiga penampilan!',cant:'Menyanyi',dance:'Tari',charm:'Karisma',daily:'Lawan hari ini',stage:'Pilih unit',play:'Mulai pertunjukan!',again:'Coba lagi',save:'Simpan polaroid',practice:'Latihan saja — Battle online menunggu server aman; tanpa hadiah.',wait:'Memuat Arena...',error:'Hasil tidak dapat diverifikasi.',used:'Percobaan tersisa',win:'Unitmu menang!',lose:'Lawan menang!',draw:'Seri!',reward:'Hadiah terverifikasi: ★5',noReward:'Tanpa hadiah kali ini',locked:'Kembali besok.',guest:'Masuk Google untuk pertandingan resmi.',my:'Kamu',other:'Lawan',starter:'Unit awal',rivalHint:'Tiga lawan terlihat, urutannya rahasia.',choose:'Pilih tiga Idol berbeda.',none:'Unit awal bisa digunakan.',loading:'Menyiapkan Arena...',points:'Poin'},
 th:{title:'Idol⭐Battle!',subtitle:'ไอดอล 3 คน 3 รอบ!',cant:'ร้องเพลง',dance:'เต้น',charm:'เสน่ห์',daily:'คู่แข่งวันนี้',stage:'เลือกยูนิต',play:'เริ่มโชว์!',again:'ลองอีกครั้ง',save:'บันทึกโพลารอยด์',practice:'โหมดฝึกซ้อมเท่านั้น — รอเปิดเซิร์ฟเวอร์ที่ปลอดภัย ไม่มีรางวัล',wait:'กำลังโหลดอารีนา...',error:'ตรวจสอบผลไม่ได้ ลองอีกครั้ง',used:'ครั้งที่เหลือ',win:'ยูนิตของคุณชนะ!',lose:'คู่แข่งชนะ!',draw:'เสมอ!',reward:'รางวัลยืนยัน: ★5',noReward:'รอบนี้ไม่มีรางวัล',locked:'กลับมาใหม่พรุ่งนี้',guest:'เข้าสู่ระบบ Google เพื่อเล่นจริง',my:'คุณ',other:'คู่แข่ง',starter:'ยูนิตเริ่มต้น',rivalHint:'เห็นคู่แข่งทั้งสาม แต่ไม่เห็นลำดับ',choose:'เลือกไอดอล 3 คนไม่ซ้ำกัน',none:'ใช้ยูนิตเริ่มต้นได้',loading:'กำลังเตรียมอารีนา...',points:'คะแนน'},
 ja:{title:'Idol⭐Battle!',subtitle:'3人のアイドルで3ステージ！',cant:'歌',dance:'ダンス',charm:'カリスマ',daily:'今日のライバル',stage:'ユニットを編成',play:'ショー開始！',again:'もう一度',save:'ポラロイドを保存',practice:'練習のみ — サーバーの安全な公開待ちです。報酬はありません。',wait:'アリーナを読み込み中…',error:'結果を確認できませんでした。',used:'残り挑戦回数',win:'あなたのユニットの勝ち！',lose:'ライバルの勝ち！',draw:'引き分け！',reward:'確定報酬：★5',noReward:'今回は報酬なし',locked:'また明日挑戦してね',guest:'公式戦はGoogleでログイン',my:'あなた',other:'ライバル',starter:'初期ユニット',rivalHint:'ライバル3人は見えるけど、出番は秘密',choose:'異なる3人のアイドルを選んでね',none:'最初のユニットでも遊べます',loading:'アリーナを準備中…',points:'点'}
};
var DEFAULT=[{nick:'Tsu',canto:5,danca:6,carisma:5,qtd:1},{nick:'Lirika',canto:6,danca:5,carisma:5,qtd:1},{nick:'Pati',canto:5,danca:5,carisma:6,qtd:1}];
var ov=null,estado=null,unit=[],rodadas=null,ocupado=false,msg='',servidor=false;
function lang(){return typeof LANG==='string'&&T[LANG]?LANG:'pt';}
function trB(k){return T[lang()][k]||T.pt[k]||k;}
function esc(x){return typeof escHtml==='function'?escHtml(String(x)):String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function logado(){return typeof contaJ!=='undefined'&&!!contaJ&&typeof contaRpc==='function';}
function hoje(){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function treino(){return {ok:true,dia:hoje(),starter:true,tentativas:0,max_tentativas:5,premiado:false,
  cards:DEFAULT.map(function(c){return Object.assign({},c);}),
  rival:DEFAULT.map(function(c,i){return {nick:c.nick,canto:5+i%2,danca:5+(i+1)%2,carisma:5};})};}
function montar(){
 if(ov)return;
 ov=document.createElement('div');ov.className='ov battleov tw-window-overlay';ov.hidden=true;ov.id='battleOv';
 ov.innerHTML='<div class="panel battlep tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="battleTit">'+
  '<button type="button" class="perfx tw-window-control tw-window-close" data-battle="fechar" aria-label="✕">✕</button>'+
  '<h2 class="tw-modal-title" id="battleTit" translate="no">Idol⭐Battle!</h2><small class="tw-modal-jp" lang="ja">アイドルバトル</small>'+
  '<p class="battle-sub" id="battleSub"></p><div id="battleCorpo" aria-live="polite"></div><canvas id="battleFoto" width="560" height="420" hidden></canvas></div>';
 document.body.appendChild(ov);
 ov.addEventListener('click',function(e){
   if(e.target===ov){fechar();return;}
   var b=e.target.closest&&e.target.closest('[data-battle]');if(!b||ocupado)return;
   if(b.getAttribute('data-battle')==='fechar'){fechar();return;}
   if(b.getAttribute('data-battle')==='jogar'){jogar();return;}
   if(b.getAttribute('data-battle')==='outra'){rodadas=null;msg='';render();return;}
   if(b.getAttribute('data-battle')==='salvar'){salvar();return;}
 });
 ov.addEventListener('change',function(e){
   if(e.target.matches&&e.target.matches('[data-battle-slot]')){
     unit[Number(e.target.getAttribute('data-battle-slot'))]=e.target.value;
     render();
   }
 });
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&ov&&!ov.hidden){e.stopPropagation();fechar();}});
}
function abrir(){
 montar();ov.hidden=false;estado=treino();unit=estado.cards.slice(0,3).map(function(c){return c.nick;});
 rodadas=null;ocupado=false;msg='';servidor=false;render();
 if(logado()){
   // Falha ou ausência da RPC nunca cria pontuação: mantém treino explícito.
   contaRpc('battle_status').then(function(r){
     if(!ov||ov.hidden)return;
     if(r&&r.ok&&Array.isArray(r.cards)&&Array.isArray(r.rival)&&r.rival.length===3){
       estado=r;servidor=true;
       unit=(r.cards||[]).slice(0,3).map(function(c){return c.nick;});
       render();
     }
   }).catch(function(){});
 }
}
function fechar(){if(ov)ov.hidden=true;}
function nomeRound(i){return trB(['cant','dance','charm'][i]);}
function valor(c,i){return Number(c&&c[['canto','danca','carisma'][i]])||0;}
function render(){
 if(!ov||ov.hidden||!estado)return;
 ov.querySelector('#battleSub').textContent=trB('subtitle');
 var area=ov.querySelector('#battleCorpo');
 var limite=servidor&&Number(estado.tentativas)>=Number(estado.max_tentativas||5);
 var texto='<div class="battle-status'+(servidor?' real':' treino')+'">'+
  (servidor?'★ '+trB('used')+': '+Math.max(0,(Number(estado.max_tentativas)||5)-Number(estado.tentativas||0)):
    '🧪 '+trB('practice'))+'</div>';
 texto+='<section class="battle-rival"><h3>🏟️ '+esc(trB('daily'))+'</h3><div class="battle-trio">'+
   estado.rival.map(function(c){return '<div class="battle-idol"><span>🎤</span><b>'+esc(c.nick)+'</b></div>';}).join('')+
   '</div><p class="battle-hint">'+esc(trB('rivalHint'))+'</p></section>';
 texto+='<section class="battle-escalar"><h3>✨ '+esc(trB('stage'))+'</h3><p class="battle-hint">'+esc(estado.starter?trB('none'):trB('choose'))+'</p>';
 for(var i=0;i<3;i++){
   texto+='<label class="battle-slot"><span>'+['🎤','💃','💖'][i]+' '+esc(nomeRound(i))+'</span><select data-battle-slot="'+i+'">'+
    estado.cards.map(function(c){return '<option value="'+esc(c.nick)+'"'+(unit[i]===c.nick?' selected':'')+'>'+esc(c.nick)+
     ' · '+valor(c,i)+'/10</option>';}).join('')+'</select></label>';
 }
 texto+='</section>';
 if(rodadas){
   var wins=rodadas.filter(function(c){return c.ganhou===true;}).length;
   var losses=rodadas.filter(function(c){return c.ganhou===false;}).length;
   var cab=wins>losses?trB('win'):wins<losses?trB('lose'):trB('draw');
   texto+='<section class="battle-resultado"><h3>'+(wins>losses?'🏆 ':wins<losses?'🎭 ':'🤝 ')+esc(cab)+'</h3>';
   texto+='<div class="battle-result-grid">'+rodadas.map(function(r,i){return '<div class="battle-round"><b>'+esc(nomeRound(i))+'</b>'+
      '<span>'+esc(r.meu||unit[i])+' '+Number(r.eu||0)+' : '+Number(r.eles||0)+' '+esc(r.rival||'?')+'</span></div>';}).join('')+'</div>';
   texto+='<p>'+esc(servidor&&Number(estado.ultimo_premio)===5?trB('reward'):trB('noReward'))+'</p>'+
   '<button type="button" class="btn alt" data-battle="salvar">📸 '+esc(trB('save'))+'</button> '+
   '<button type="button" class="btn" data-battle="outra">'+esc(trB('again'))+'</button></section>';
 }else{
   if(msg)texto+='<p class="battle-error">'+esc(msg)+'</p>';
   texto+='<div class="btns"><button type="button" class="btn battle-start" data-battle="jogar"'+(limite||ocupado?' disabled':'')+'>'+
    esc(limite?trB('locked'):ocupado?trB('loading'):trB('play'))+'</button></div>';
 }
 area.innerHTML=texto;
}
function treinoShow(){
 var other=estado.rival;
 return unit.map(function(n,i){
   var eu=estado.cards.find(function(c){return c.nick===n;})||DEFAULT[i];
   var rival=other[(i+1)%3],a=valor(eu,i),b=valor(rival,i);
   return {tipo:['canto','danca','carisma'][i],meu:n,rival:rival.nick,eu:a,eles:b,ganhou:a>b};
 });
}
function jogar(){
 if(ocupado||rodadas||!estado)return;
 if(unit.length!==3||new Set(unit).size!==3||unit.some(function(x){return !estado.cards.some(function(c){return c.nick===x;});})){
   msg=trB('choose');render();return;
 }
 ocupado=true;msg='';render();
 if(!servidor){
   rodadas=treinoShow();ocupado=false;render();desenharPolaroid();return;
 }
 contaRpc('battle_jogar',{p_unit:unit.slice()}).then(function(r){
   if(!r||!r.ok||!Array.isArray(r.rodadas)||r.rodadas.length!==3)throw Error('invalid result');
   rodadas=r.rodadas;estado.tentativas=Number(r.tentativas);estado.ultimo_premio=Number(r.premio)||0;
   if(estado.ultimo_premio===5&&typeof r.stars==='number'&&typeof starT!=='undefined'){
     starT=r.stars;try{localStorage.setItem('brs48cr_st',starT);}catch(e){}
     if(typeof setBest==='function')try{setBest();}catch(e){}
   }
   desenharPolaroid();
 }).catch(function(){msg=trB('error');}).then(function(){ocupado=false;render();});
}
function desenharPolaroid(){
 var cv=ov&&ov.querySelector('#battleFoto');if(!cv||!rodadas)return;
 var x=cv.getContext('2d'),W=cv.width,H=cv.height;
 x.clearRect(0,0,W,H);var g=x.createLinearGradient(0,0,W,H);
 g.addColorStop(0,'#42278c');g.addColorStop(.55,'#a044c1');g.addColorStop(1,'#ff75b6');
 x.fillStyle='#fff';x.fillRect(0,0,W,H);
 x.fillStyle=g;x.fillRect(18,18,W-36,H-100);
 x.font='26px "Mochiy Pop One",sans-serif';x.fillStyle='#fff';x.textAlign='center';x.fillText('Idol⭐Battle!',W/2,70);
 x.font='15px "Mochiy Pop One",sans-serif';x.fillText('✦ ✧ ★ ✦ ✧',W/2,110);
 unit.forEach(function(n,i){x.fillStyle=['#fbd8ee','#def8ff','#fff1b0'][i];x.beginPath();x.arc(115+i*165,217,58,0,Math.PI*2);x.fill();
   x.fillStyle='#512d87';x.font='52px sans-serif';x.fillText('★',115+i*165,236);
   x.font='14px "Mochiy Pop One",sans-serif';x.fillStyle='#fff';x.fillText(String(n).slice(0,14),115+i*165,305);});
 x.fillStyle='#48306e';x.font='15px "Mochiy Pop One",sans-serif';x.fillText(trB('my')+' · '+trB('daily')+' · '+estado.dia,W/2,H-40);
}
function salvar(){
 var cv=ov&&ov.querySelector('#battleFoto');if(!cv||!rodadas)return;
 var a=document.createElement('a');a.download='idol-battle-'+String(estado.dia||hoje())+'.png';a.href=cv.toDataURL('image/png');
 document.body.appendChild(a);a.click();a.remove();
}
window.TW_BATTLE_ON=true;window.battleAbrir=abrir;window.TW_BATTLE_TR=T;
})();