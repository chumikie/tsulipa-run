function upd(arr,row){
  var a=(arr||[]).slice();
  a.push(row);
  a.sort(function(x,y){return (y.score||0)-(x.score||0) || (x.t||0)-(y.t||0)});
  return a.slice(0,15);
}
function newItems(ob,sc){var a=ACC.filter(function(x){return x[2]>0&&x[2]>ob&&sc>=x[2]});refreshAcc();return a.length?'<br>✨ '+tr('Item novo')+': '+a.map(function(x){return tr(x[1])}).join(', '):''}
function getPartner(currentSel) {
  var options = (currentSel === 0) ? [1, 2] : (currentSel === 1) ? [0, 2] : (currentSel === 2) ? [0, 1] : [0, 1, 2];
  
  if (window.partnerBag && window.partnerBag.length > 0) {
    window.partnerBag = window.partnerBag.filter(function(id) { return id !== currentSel; });
  }

  if (!window.partnerBag || window.partnerBag.length === 0) {
    var pool = options.slice();
    // Embaralha a ordem do trio/dupla
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = pool[i]; pool[i] = pool[j]; pool[j] = temp;
    }
    // Evita que o primeiro da nova rodada seja igual ao último da rodada anterior
    if (pool.length > 1 && pool[0] === window.lastPartnerPicked) {
      var first = pool.shift();
      pool.push(first);
    }
    window.partnerBag = pool;
  }
  
  var chosen = window.partnerBag.shift();
  window.lastPartnerPicked = chosen;
  return chosen;
}
// Textos das metas e do fim (17/11), com tradução própria aqui (as tabelas do tw-i18n têm contagem fixa)
var CR_TXT={
 en:{'Meta cumprida!':'Goal complete!','Pegue {n} estrelas':'Grab {n} stars','Passe de {n} pontos':'Pass {n} points','Pule {n} obstáculos':'Jump {n} obstacles','Pegue uma carta':'Grab a card','Meta':'Goal','Estrelas':'Stars','Faltam {n} pontos para {r}':'{n} points to {r}','{n} dias seguidos':'{n} days in a row'},
 es:{'Meta cumprida!':'¡Meta cumplida!','Pegue {n} estrelas':'Atrapa {n} estrellas','Passe de {n} pontos':'Supera {n} puntos','Pule {n} obstáculos':'Salta {n} obstáculos','Pegue uma carta':'Atrapa una carta','Meta':'Meta','Estrelas':'Estrellas','Faltam {n} pontos para {r}':'Faltan {n} puntos para {r}','{n} dias seguidos':'{n} días seguidos'},
 id:{'Meta cumprida!':'Target selesai!','Pegue {n} estrelas':'Ambil {n} bintang','Passe de {n} pontos':'Lewati {n} poin','Pule {n} obstáculos':'Lompati {n} rintangan','Pegue uma carta':'Ambil satu kartu','Meta':'Target','Estrelas':'Bintang','Faltam {n} pontos para {r}':'{n} poin lagi menuju {r}','{n} dias seguidos':'{n} hari berturut-turut'},
 th:{'Meta cumprida!':'ทำเป้าหมายสำเร็จ!','Pegue {n} estrelas':'เก็บดาว {n} ดวง','Passe de {n} pontos':'ทำคะแนนเกิน {n}','Pule {n} obstáculos':'กระโดดข้ามสิ่งกีดขวาง {n} ครั้ง','Pegue uma carta':'เก็บการ์ด 1 ใบ','Meta':'เป้าหมาย','Estrelas':'ดาว','Faltam {n} pontos para {r}':'อีก {n} คะแนนถึง {r}','{n} dias seguidos':'ติดต่อกัน {n} วัน'},
 ja:{'Meta cumprida!':'目標クリア！','Pegue {n} estrelas':'スターを{n}個とろう','Passe de {n} pontos':'{n}点をこえよう','Pule {n} obstáculos':'障害物を{n}回とびこえよう','Pegue uma carta':'カードを1枚とろう','Meta':'目標','Estrelas':'スター','Faltam {n} pontos para {r}':'{r}まであと{n}点','{n} dias seguidos':'{n}日連続'}};
function crTr(k){ var l = typeof LANG !== 'undefined' ? LANG : 'pt', d = CR_TXT[l]; return (d && d[k]) || tr(k); }
// ---------- Onde se perde (17/11): tipo do obstáculo, se estava no ar, velocidade e se era padrão montado ----------
// Vai para runs.causa/meta pela corrida_telemetria, só depois que o servidor confirma a corrida (conta.js).
function crTelemetriaAnotar(o){
  try{
    var vel = typeof sp === 'number' ? Math.round(sp) : 0;
    window.crTelemetria = {causa:(o && o.k || 'x') + ':' + (P.air ? 'ar' : 'chao') + ':v' + vel + (o && o.padrao ? ':pad' : ''),
      meta:crMeta ? crMeta.k + ':' + (crMeta.feita ? 'ok' : crMetaProgresso() + '-' + crMeta.alvo) : ''};
  }catch(e){}
}
// ---------- Metas curtas (17/11): uma por corrida, no topo da tela; cumprida, vale +★5 na hora ----------
// O bônus entra nas estrelas da corrida (stars), que o servidor valida no fim com o mesmo limite de sempre (tempo e teto diário).
var CR_METAS = [
  {k:'estrelas', alvo:15, txt:'Pegue {n} estrelas'},
  {k:'pontos', alvo:1500, txt:'Passe de {n} pontos'},
  {k:'pulos', alvo:12, txt:'Pule {n} obstáculos'},
  {k:'carta', alvo:1, txt:'Pegue uma carta'}
], CR_META_PREMIO = 5, crMeta = null;
function crMetaNova(){ var m = CR_METAS[Math.floor(Math.random() * CR_METAS.length)]; crMeta = {k:m.k, alvo:m.alvo, txt:m.txt, feita:false, cartas:0, pulos:0, brilho:0, frame0:frame}; }
function crMetaProgresso(){
  if(!crMeta) return 0;
  var v = crMeta.k === 'estrelas' ? stars : crMeta.k === 'pontos' ? Math.floor(score) : crMeta.k === 'pulos' ? crMeta.pulos : crMeta.cartas;
  return Math.min(crMeta.alvo, v);
}
function crMetaConferir(){
  if(!crMeta || crMeta.feita || state !== 'play' || isTestGame) return;
  if(crMetaProgresso() >= crMeta.alvo){
    crMeta.feita = true; crMeta.brilho = 120; stars += CR_META_PREMIO;
    var seq = crMetaSequencia(); crMeta.seq = seq.n; crMeta.extra = seq.extra; if(seq.extra) stars += seq.extra;
    toast = '🎯 ' + crTr('Meta cumprida!') + ' +★' + (CR_META_PREMIO + seq.extra) + (seq.n > 1 ? ' · 🔥 ' + crTr('{n} dias seguidos').replace('{n}', seq.n) : ''); toastT = 140;
    try{ if(sfx && sfx.rank) sfx.rank(); }catch(e){}
  }
}
// Sequência (17/11): a primeira meta cumprida de cada dia conta; dias seguidos dão +★1 por dia a mais (até +★4).
// Guardado no aparelho (tw_cr_meta_seq); o bônus entra nas estrelas da corrida, que o servidor valida como sempre.
function crMetaSequencia(){
  var r = {n:1, extra:0};
  try{
    var d = new Date(), hoje = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(), on = new Date(d.getTime() - 864e5);
    var ontem = on.getFullYear() + '-' + (on.getMonth() + 1) + '-' + on.getDate();
    var st = JSON.parse(localStorage.getItem('tw_cr_meta_seq') || 'null') || {};
    if(st.dia === hoje){ r.n = st.n || 1; return r; }          // já contou hoje: sem bônus de novo
    r.n = st.dia === ontem ? (st.n || 0) + 1 : 1; r.extra = Math.min(4, r.n - 1);
    localStorage.setItem('tw_cr_meta_seq', JSON.stringify({dia:hoje, n:r.n}));
  }catch(e){}
  return r;
}
function crMetaDesenhar(){
  if(!crMeta || state !== 'play' || isTestGame || crPratica) return;
  var txt = crTr(crMeta.txt).replace('{n}', crMeta.alvo), prog = crMetaProgresso(), fim = crMeta.feita;
  var rot = (fim ? '✓ ' : '🎯 ') + txt + (crMeta.alvo > 1 && !fim ? '  ' + prog + '/' + crMeta.alvo : '') + (fim ? '  +★' + CR_META_PREMIO : '');
  g.save(); g.font = '700 12px "M PLUS Rounded 1c",sans-serif'; var pt = W < 500, w = Math.min(pt ? W - 20 : W - 230, g.measureText(rot).width + 26), x0 = pt ? 10 : W / 2 - w / 2 + 50, y0 = pt ? 92 : 10;   // celular em pé: abaixo do placar, longe dos botões de pausa/câmera/som
  if(crMeta.brilho > 0){ crMeta.brilho--; g.shadowColor = '#b6ff3b'; g.shadowBlur = 14; }
  g.fillStyle = fim ? 'rgba(78,154,0,.85)' : 'rgba(23,12,37,.72)'; g.beginPath(); if(g.roundRect) g.roundRect(x0, y0, w, 24, 12); else g.rect(x0, y0, w, 24); g.fill(); g.shadowBlur = 0;
  if(!fim && crMeta.alvo > 1){ g.fillStyle = 'rgba(255,111,181,.85)'; g.beginPath(); if(g.roundRect) g.roundRect(x0 + 4, y0 + 19, (w - 8) * prog / crMeta.alvo, 3, 1.5); else g.rect(x0 + 4, y0 + 19, (w - 8) * prog / crMeta.alvo, 3); g.fill(); }
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(rot, x0 + w / 2, y0 + 11.5, w - 12); g.restore();
}
// padrões: [tipo, espaço antes] — sempre com espaço para pousar e pular de novo
var CR_PADROES = [[['cable', 190]], [['stick', 210], ['cable', 210]], [['cable', 190]], [['speaker', 240]]];
function spawn(){
  var t=s2Rand(),o;
  if(t<.4) o={k:'cable',w:56,h:12};
  else if(t<.75) o={k:'speaker',w:36,h:48};
  else {
    var q2=s2Rand();
    o={k:'stick',w:24,h:42,pal:q2<.65?['#9b30d9','#b6ff3b','#4169e1']:q2<.85?['#4169e1','#ffe14d','#34d399']:['#ff6fb5','#4dd8ff','#ffe14d']};
  }
  o.x=nextX; o.y=GY-o.h; obs.push(o);
  // 17/11: de vez em quando, um padrão montado à mão no lugar do sorteio puro (ritmo que dá para ler e aprender)
  var crPadrao = false;
  if(frame > 1800 && s2Rand() < .14){
    crPadrao = true;
    var pad = CR_PADROES[Math.floor(s2Rand() * CR_PADROES.length)], px = o.x + o.w;
    for(var pi2 = 0; pi2 < pad.length; pi2++){ var pp = pad[pi2], o3 = {k:pp[0], w:pp[0] === 'cable' ? 56 : pp[0] === 'speaker' ? 36 : 24, h:pp[0] === 'cable' ? 12 : pp[0] === 'speaker' ? 48 : 42};
      if(o3.k === 'stick') o3.pal = ['#9b30d9', '#b6ff3b', '#4169e1'];
      o3.x = px + pp[1] + sp * 6; o3.y = GY - o3.h; o3.padrao = true; obs.push(o3); px = o3.x + o3.w; }
    nextX = px - o.w;
  }

  if(!crPadrao && s2Rand()<(frame>5400?Math.min(.3,(frame-5400)/12000):0)){
    var o2={k:'speaker',w:36,h:48,x:o.x+o.w+s2Rnd(55,95)};
    o2.y=GY-48; obs.push(o2);
    nextX+=o2.w+s2Rnd(80,140);
  }

  var r=s2Rand();
  if(r<.7){
    var n=3,cx=o.x+o.w/2,cd=s2Rand()<.4&&frame-lastCard>1500,q=s2Rand(),cty=q<.4?'plain':q<.7?'fever':'ima';
    if(cd)lastCard=frame;
    for(var i=0;i<n;i++){
      var u=(i-1)/1;
      items.push({k:(cd&&i===1)?'card':'star',x:cx+u*46-8,y:GY-o.h-34-(1-u*u)*32,w:18,h:18,got:false,ct:cty});
    }
  }

  var gap = sp * 40 + s2Rnd(110, 340);
  if(s2Rand()<0.25) gap += s2Rnd(200, 500); 
	
	// --- GERADOR DE PLATEIA DINÂMICO ---
    if (score >= 450) { 
    var fanChance = score < 5000 ? 0.30 + ((score - 450) / 4550) * 0.45 : 0.90;
    
    if (s2CosRand() < fanChance) {
      var lsColors = ['#9b30d9', '#b6ff3b', '#4169e1'];
      if (sel === 3) lsColors.push(CU.hair);
      
      // quantos grupinhos por intervalo, mínimo/máximo de fãs por grupo e distância entre eles
      var fanGroups = score >= 10000 ? 3 : score >= 5000 ? 2 : 1;
      var fanMin    = score >= 10000 ? 3 : 1;
      var fanMax    = score >= 10000 ? 8 : score >= 5000 ? 5 : score >= 2500 ? 3 : 2;
      var fanSpace  = score >= 10000 ? 20 : score >= 5000 ? 26 : 34;
      
      for (var fg = 0; fg < fanGroups; fg++) {
        var numFans = fanMin + Math.floor(s2CosRand() * (fanMax - fanMin + 1));
        var gx = nextX + s2CosRnd(10, Math.max(110, gap - 120));   // cada grupo começa num ponto do intervalo
        for (var fi = 0; fi < numFans; fi++) {
          fans.push({
            x: gx + (fi * fanSpace) + s2CosRnd(-4, 4),
            y: GY - 15 - s2CosRnd(0, 7),
            color: lsColors[Math.floor(s2CosRand() * lsColors.length)],
            offset: s2CosRand() * 10
          });
        }
      }
    }
  }
	
  nextX += gap;
}
function jump(){
  ac();
  if(state==='menu'||state==='over'||paused)return;
  if(pw && pw.k==='alien')return;
  held=true;
  if(!P.air){P.vy=-12.5;P.air=true;sfx.jump();crPuloGuardado=0}
  else crPuloGuardado=9;   // 17/11: toque um pouco antes de pousar fica guardado e o pulo sai ao encostar no chão (~150 ms)
}
var crPuloGuardado=0,crPuloSegura=0;
function celebDraw(){
  if(state !== 'over') return;
  var og = g, ch = CH[sel], pu = .5 + .5 * Math.sin(ct * .05);
  g = cc;
  g.clearRect(0, 0, 200, 150);
  
  var Q = curPal(), sg = g.createLinearGradient(0, 0, 0, 140);
  sg.addColorStop(0, Q[0]);
  sg.addColorStop(1, Q[1]);
  g.fillStyle = sg;
  g.fillRect(0, 0, 200, 150);
  
  for(var b = 0; b < 9; b++){ 
    var bh = 30 + (b * 37 % 40), bx = b * 24 - 6; 
    g.fillStyle = b % 2 ? Q[2] : Q[3]; 
    g.fillRect(bx, 140 - bh, 20, bh); 
    g.fillStyle = 'rgba(255,235,150,0.3)'; 
    if(b % 3 !== 0){ 
      for(var wy = 140 - bh + 8; wy < 130; wy += 12){ 
        g.fillRect(bx + 4, wy, 4, 4); 
        g.fillRect(bx + 12, wy, 4, 4); 
      } 
    } 
  }
  
  g.fillStyle = Q[6];
  g.fillRect(0, 140, 200, 10);
  g.fillStyle = Q[7];
  g.fillRect(0, 140, 200, 2);
  
  if(wasAbducted) ufoDraw(165, 40, .85);
  
  if(window.wasGiant){
    g.save();
    g.translate(32, 42);
    g.scale(1.2, 1.2);
    g.rotate(-0.2);
    g.shadowColor = '#ff6fb5';
    g.shadowBlur = 8;
    g.fillStyle = '#d97706';
    g.beginPath();
    g.moveTo(-6, 2);
    g.lineTo(6, 2);
    g.lineTo(0, 14);
    g.fill();
    g.fillStyle = '#ff6fb5';
    g.beginPath();
    g.arc(0, -1, 7, 0, 7);
    g.fill();
    g.beginPath();
    g.arc(-4, 2, 4, 0, 7);
    g.fill();
    g.beginPath();
    g.arc(4, 2, 4, 0, 7);
    g.fill();
    g.fillStyle = '#fff';
    g.fillRect(-2, -3, 2, 2);
    g.fillRect(2, -1, 2, 2);
    g.fillStyle = '#4dd8ff';
    g.fillRect(-1, -6, 2, 2);
    g.restore();
  }

  var cn = g.createLinearGradient(0, 0, 0, 140);
  cn.addColorStop(0, 'rgba(255,255,255,.5)');
  cn.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = cn;
  g.beginPath();
  g.moveTo(88, 0);
  g.lineTo(112, 0);
  g.lineTo(165, 140);
  g.lineTo(35, 140);
  g.fill();

  var rg = g.createRadialGradient(100, 85, 4, 100, 85, 75);
  rg.addColorStop(0, 'rgba(' + GLc() + ',' + (.5 + .25 * pu) + ')');
  rg.addColorStop(1, 'rgba(255,160,220,0)');
  g.fillStyle = rg;
  g.fillRect(0, 0, 200, 150);

  g.fillStyle = 'rgba(255,255,255,.28)';
  g.beginPath();
  g.ellipse(100, 140, 48, 7, 0, 0, 7);
  g.fill();

  g.save();
  g.scale(2, 2);
  for(var i = 0; i < 9; i++){
    var a = ct * .02 + i * .7, px = 50 + Math.cos(a) * (28 + i % 3 * 5), py = 38 + Math.sin(a * 1.3) * (24 + i % 2 * 6), sz = 1 + 2 * Math.abs(Math.sin(ct * .07 + i * 1.9));
    g.fillStyle = i % 2 ? '#ffe14d' : '#ff9ccd';
    g.fillRect(px - sz, py - .5, sz * 2, 1);
    g.fillRect(px - .5, py - sz, 1, sz * 2);
  }
  
  var jumpY = 27 - (1 - Math.cos(ct * .05)) / 2 * 8;
  var pList = (window.collectedPartners || []).filter(function(id) { return id !== sel; });
  
  if (sel === 3 && pList.length >= 3) {
    // --- QUARTETO: Formação de Palco (Simetria Perfeita e Centralizada) ---
    
    // 1. Linha de Trás (Mais altos, nas bordas simétricas)
    drawChar(CH[pList[0]], 5,  jumpY - 5, 1, 2, true); // Fundo Esquerda (Tsu)
    drawChar(CH[pList[2]], 65, jumpY - 5, 1, 2, true); // Fundo Direita (Pati)
    
    // 2. Linha da Frente (Mais baixos, centralizados juntos)
    drawChar(CH[pList[1]], 25, jumpY + 2, 1, 2, true); // Frente Esquerda (Lirika)
    drawChar(ch,           45, jumpY + 2, 1, finalExpr); // Frente Direita (Você)

    // Emojis recalculados milimetricamente para o topo de cada cabeça (X + 15)
    g.font = '7px sans-serif';
    g.textAlign = 'center';
    
    // Corações de trás (mais altos)
    g.fillText('💜', 20, jumpY - 12 + Math.sin(ct * 0.12) * 2.5);
    g.fillText('💙', 80, jumpY - 12 + Math.cos(ct * 0.15) * 2.5);
    
    // Corações da frente (mais baixos)
    g.fillText('💚', 40, jumpY - 5  + Math.cos(ct * 0.12) * 2.5);
    g.fillText('💖', 60, jumpY - 5  + Math.sin(ct * 0.15) * 2.5);

  } else if (pList.length >= 2) {
    // Trio na tela de Fim do Show (Oshi no centro exato)
    drawChar(CH[pList[0]], 11, jumpY + 2, 1, 2, true);
    drawChar(ch,           35, jumpY,     1, finalExpr);
    drawChar(CH[pList[1]], 59, jumpY + 2, 1, 2, true);
    
    // Corações animados e dinâmicos pulando individualmente para o Trio!
    g.font = '7px sans-serif';
    g.textAlign = 'center';
    var hMap = ['💜', '💚', '💙', '💖'];
    g.fillText(hMap[pList[0]], 26, jumpY - 6 + Math.sin(ct * 0.12) * 2.5);
    g.fillText(hMap[sel],      50, jumpY - 8 + Math.cos(ct * 0.12) * 2.5);
    g.fillText(hMap[pList[1]], 74, jumpY - 6 + Math.sin(ct * 0.15) * 2.5);
  } else if (pList.length === 1) {
    // Dupla na tela de Fim do Show
    drawChar(CH[pList[0]], 20, jumpY + 1, 1, 2, true);
    drawChar(ch,           50, jumpY,     1, finalExpr);
  } else {
    // Solo
    drawChar(ch, 35, jumpY, 1, finalExpr);
  }
  petPalco(g, 88, 72, .55, ct);   // seu pet comemorando no palco (Backstage⭐Pet!)
  g.restore();
  
  g = og;
}
function celeb(t){
  cancelAnimationFrame(celebRaf);celebRaf=0;
  if(state !== 'over'||twIndex2BaseFramesPaused()) return;
  ct+=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta(cc.canvas,t):1;
  if(!window.TWMotionLifecycle||TWMotionLifecycle.render30Due(cc.canvas,t)){
  var og = g;
  try { celebDraw(); }
  catch(err){ console.error('celeb:', err); }
  finally { g = og; }
  }
  celebRaf = requestAnimationFrame(celeb);
}
var CR_COLISAO = {
  pt:['Colisão com {obstaculo}','Ainda no ar','No chão','Obstáculo suspenso','Tentar de novo'],
  en:['Hit {obstaculo}','Still in the air','On the ground','Overhead obstacle','Try again'],
  es:['Choque con {obstaculo}','Aún en el aire','En el suelo','Obstáculo suspendido','Volver a intentar'],
  id:['Menabrak {obstaculo}','Masih di udara','Di tanah','Rintangan di atas','Coba lagi'],
  th:['ชน{obstaculo}','ยังอยู่กลางอากาศ','อยู่บนพื้น','สิ่งกีดขวางเหนือศีรษะ','ลองอีกครั้ง'],
  ja:['{obstaculo}にぶつかった','ジャンプ中','地上','頭上の障害物','もう一度挑戦']
};
var CR_OBSTACULOS = {
  cable:['o cabo','the cable','el cable','kabel','สายเคเบิล','ケーブル'],
  speaker:['a caixa de som','the speaker','el altavoz','pengeras suara','ลำโพง','スピーカー'],
  stick:['o lightstick','the lightstick','el lightstick','lightstick','แท่งไฟ','ペンライト'],
  colchonete:['o colchonete','the mat','la colchoneta','matras','เสื่อ','マット'],
  cone:['o cone','the cone','el cono','kerucut','กรวย','コーン'],
  garrafinha:['a garrafa','the bottle','la botella','botol','ขวดน้ำ','ボトル'],
  arara:['a arara de roupas','the clothes rack','el perchero','rak pakaian','ราวเสื้อผ้า','衣装ラック'],
  case:['a caixa de transporte','the equipment case','la caja de transporte','kotak peralatan','กล่องอุปกรณ์','機材ケース'],
  carrinho:['o carrinho','the cart','el carrito','troli','รถเข็น','カート'],
  camtrilho:['a câmera em trilho','the camera rig','la cámara sobre rieles','kamera rel','กล้องบนราง','レールカメラ'],
  refletor:['o refletor','the spotlight','el reflector','lampu sorot','ไฟสปอตไลต์','スポットライト'],
  lanterna:['a lanterna','the lantern','la linterna','lentera','โคมไฟ','ランタン'],
  balde:['o balde','the bucket','el cubo','ember','ถัง','バケツ'],
  taiko:['o taiko','the taiko drum','el tambor taiko','drum taiko','กลองไทโกะ','太鼓'],
  mala:['a mala','the suitcase','la maleta','koper','กระเป๋าเดินทาง','スーツケース'],
  esteira:['a esteira','the conveyor belt','la cinta transportadora','ban berjalan','สายพาน','ベルトコンベア'],
  faplaca:['a placa de fã','the fan sign','el cartel de fan','papan penggemar','ป้ายแฟนคลับ','応援ボード'],
  escada:['a escada','the ladder','la escalera','tangga','บันได','はしご'],
  caixaluz:['a caixa de luz','the light box','la caja de luces','kotak lampu','กล่องไฟ','照明ボックス'],
  fita:['a fita','the ribbon','la cinta','pita','ริบบิ้น','リボン']
};
function crIdiomaResultado(){
  return typeof LANG === 'string' && Object.prototype.hasOwnProperty.call(CR_COLISAO, LANG) ? LANG : 'pt';
}
var CR_AJUSTE_TR={
  pt:['Tente pular um pouco mais tarde para ainda estar no ar ao passar.','Tente iniciar o pulo um pouco antes de alcançar o obstáculo.','Tente deslizar antes de chegar ao refletor.','Mantenha o deslize até passar sob o refletor.'],
  en:['Jump slightly later so you are still in the air as you pass.','Start your jump slightly before you reach the obstacle.','Start sliding before reaching the spotlight.','Keep sliding until you clear the spotlight.'],
  es:['Salta un poco más tarde para seguir en el aire al pasar.','Empieza el salto un poco antes del obstáculo.','Deslízate antes de llegar al reflector.','Mantén el deslizamiento hasta pasar el reflector.'],
  id:['Lompat sedikit lebih lambat agar masih di udara saat melewatinya.','Mulai lompat sedikit sebelum rintangan.','Meluncurlah sebelum mencapai lampu sorot.','Terus meluncur hingga melewati lampu.'],
  th:['ลองกระโดดช้าลงเล็กน้อยเพื่อให้ยังลอยอยู่ตอนผ่าน','เริ่มกระโดดก่อนถึงสิ่งกีดขวางเล็กน้อย','เริ่มสไลด์ก่อนถึงไฟส่องเวที','สไลด์ต่อจนพ้นไฟส่องเวที'],
  ja:['少し遅く跳んで、空中で通過しましょう。','障害物に届く少し前に跳びましょう。','照明に届く前にスライドしましょう。','照明を通過するまでスライドを続けましょう。']
};
function crAjusteColisao(impacto){
  var i=impacto.suspenso?(impacto.deslizou?3:2):impacto.ar&&impacto.descendo?0:1;
  return CR_AJUSTE_TR[crIdiomaResultado()][i];
}
function crColisaoTexto(impacto){
  if(!impacto || !Object.prototype.hasOwnProperty.call(CR_OBSTACULOS, impacto.tipo)) return '';
  var idioma = crIdiomaResultado();
  var texto = CR_COLISAO[idioma], nome = CR_OBSTACULOS[impacto.tipo][Object.keys(CR_COLISAO).indexOf(idioma)];
  return texto[0].replace('{obstaculo}', nome) + ' · ' + texto[impacto.ar ? 1 : 2] + (impacto.suspenso ? ' · ' + texto[3] : '');
}

function end(impacto){
  var crT = typeof crTr === 'function' ? crTr : tr;
  var cm = typeof crMeta !== 'undefined' ? crMeta : null;
  if(cm) cm.acabou = true;
  if(state==='over')return;
  state='over';if(typeof crPuloLimpar==='function')crPuloLimpar();sfx.over();sync();shake=14;
  if(!isTestGame && window.TW_CELULAR && typeof window.TW_CELULAR.estreiaEtapa === 'function') window.TW_CELULAR.estreiaEtapa('run', true);
  document.body.classList.remove('jogando');
  $('jb').style.display='none';
  $('pause').style.display='none';
  $('cam').style.display='none';
  var s=Math.floor(score),nb=!isTestGame&&s>best,ob=best;lastS=s;dpw=pw;
  var esperaEstrelas=!!(_supabase&&contaJ&&!isTestGame&&(nick||'').trim().toLowerCase()!=='tsuadmin');
  if(!isTestGame&&!esperaEstrelas)starT+=stars;
  try{localStorage.setItem('brs48cr_st',starT)}catch(e){}
  if(nb){best=s;try{localStorage.setItem('brs48cr_best',s)}catch(e){}}
  setBest();
  finalExpr = typeof exprFinal === 'function' ? exprFinal(s, nb) : (s < 450 ? 1 : (Math.random() < 0.5 ? 0 : 2));   // V2.1.3
  
  var rId = rankOf(s);
  try{ document.dispatchEvent(new CustomEvent('tw-corrida-fim', {detail:{pontos:s, teste:!!(typeof isTestGame !== 'undefined' && isTestGame)}})); }catch(_){}   // recorde da semana (tw-comunidade.js)
  // Este acabamento é opcional: se refreshAcc falhar, a confirmação online não pode parar.
  var novosItens='';
  try{novosItens=newItems(ob,s)}catch(err){if(typeof console!=='undefined'&&console.error)console.error('Center⭐Run!: acabamento dos itens indisponível',err);}
  // 17/11: fim em um quadro só — pontos, estrelas, posição, a meta da corrida e quanto falta para a próxima posição
  var crProx=RANKS[rId+1],crFalta=crProx?Math.max(1,crProx[0]-s):0;
  var crMetaTxt=(cm&&!isTestGame)?(cm.feita?'✓ '+crT('Meta cumprida!')+' +★'+(CR_META_PREMIO+(cm.extra||0))+(cm.seq>1?' · 🔥 '+crT('{n} dias seguidos').replace('{n}',cm.seq):''):crT(cm.txt).replace('{n}',cm.alvo)+(cm.alvo>1?' · '+crMetaProgresso()+'/'+cm.alvo:'')):'';
  $('res').innerHTML='<div class="crfim"><div class="crfim-pts"><strong>'+s+'</strong> <span>'+tr('pontos')+'</span>'+(nb?'<em>'+tr('novo recorde!')+'</em>':'')+'</div>'
    +'<div class="crfim-grade"><div><small>★ '+crT('Estrelas')+'</small><b>'+(esperaEstrelas?'<span id="cr-recompensa">'+tr('Aguardando validação do servidor')+'</span>':stars+' '+(typeof trEstrelas==='function'?trEstrelas(stars):tr('estrelas')))+'</b></div>'
    +'<div><small>'+tr('Posição')+'</small><b>'+tr(RANKS[rId][1])+'</b></div>'
    +(crMetaTxt?'<div class="crfim-meta'+(cm.feita?' ok':'')+'"><small>🎯 '+crT('Meta')+'</small><b>'+crMetaTxt+'</b></div>':'')+'</div>'
    +(crProx?'<p class="crfim-prox">'+crT('Faltam {n} pontos para {r}').replace('{n}',crFalta).replace('{r}',tr(crProx[1]))+'</p>':'')+'</div>'+novosItens
    +((contaJ||isTestGame)?'':'<br><small style="color:var(--b1);font-weight:800">🔐 '+tr('Entre com Google para aparecer no ranking online')+'</small>');   // V2.1.2

  var colisao = !isTestGame ? crColisaoTexto(impacto) : '';
  if(colisao) $('res').innerHTML += '<p class="crfim-colisao" id="crFimColisao">' + colisao + '</p><p class="crfim-colisao" id="crFimAjuste">' + crAjusteColisao(impacto) + '</p>';
  if(typeof crPraticaConfig === 'function') crPraticaConfig(colisao ? impacto : null);

  // Envia o resultado assim que a tela o apresenta. Falhas em acabamentos
  // opcionais abaixo não podem impedir a confirmação online da corrida.
  var enviarOnline=!!(_supabase&&contaJ&&!isTestGame&&(nick||'').trim().toLowerCase()!=='tsuadmin');
  var refresh=function(){showLb($('lbo'));if(!$('lbmw').hidden)showLb($('lbm'))};
  if(enviarOnline)contaFimCorrida(s,stars,CH[sel].n,refresh);
  if(!isTestGame && s>0 && window.TW_HUMOR) window.TW_HUMOR.treino('run');
  
 var isTesting = isTestGame;
  var nomeDigitado = (nick || '').trim().toLowerCase();
  var isAdmin = (nomeDigitado === 'tsuadmin');
  var row={name:nick||tr('Visitante'),score:s,rankId:rId,char:CH[sel].n,t:Date.now()};
  if(!isTestGame && typeof bestcSalvar==='function'){ bestcSalvar(sel, s); refreshAcc(); }   // V2.1.3: recorde por personagem

 if(!isTesting && !isAdmin){
    local = upd(local, row);
    if(lw.w !== wk()) lw = {w: wk(), rows: []};
    lw.rows = upd(lw.rows, row);
    
    if(ld.d !== dk()) ld = {d: dk(), rows: []};
    ld.rows = upd(ld.rows, row);
    
    try{
      localStorage.setItem('brs48cr_lb', JSON.stringify(local));
      localStorage.setItem('brs48cr_lw', JSON.stringify(lw));
      localStorage.setItem('brs48cr_ld', JSON.stringify(ld));
    }catch(e){}
  }
  
  // V2.1.2: apenas o servidor confirma pontos e estrelas de partidas autenticadas.
  if(!enviarOnline)refresh();
  
clearTimeout(overTimer);
  overTimer = setTimeout(function(){
    var resultado = $('over'), tentar = $('again');
    resultado.hidden = false;
    resultado.scrollTop = 0;
    tentar.textContent = CR_COLISAO[crIdiomaResultado()][4];
    if(colisao) tentar.setAttribute('aria-describedby', 'crFimColisao crFimAjuste');
    else tentar.removeAttribute('aria-describedby');
    tentar.focus({preventScroll:true});
    celeb();
  }, 300); // 300ms para abrir rápido e responsivo
}
function hit(a,b){
  if(b.k==='cable'){
    var pMid = a.x + a.w * 0.5;
    if(pMid > b.x + b.w * 0.75) return false;
    var mx1 = 12, mx2 = 8, myTop = 5;
    return (a.x + a.w - mx1 > b.x) &&
           (a.x + mx2 < b.x + b.w) &&
           (a.y + a.h > b.y + myTop) &&
           (a.y < b.y + b.h);
  }
  var mx = 6, my = 4;   // 17/11: 2 px a mais de folga na lateral (raspar de leve não conta)
  return (a.x + a.w - mx > b.x) &&
         (a.x + mx < b.x + b.w) &&
         (a.y + a.h - my > b.y) &&
         (a.y + my < b.y + b.h);
}
function crPularQuadro(dt){
  var crSegurando = held || crPuloSegura > 0;   // pulo guardado conta como toque curto segurado (não vira pulinho)
  if(!crSegurando && P.vy < -1.5) P.vy *= 0.82;
  P.vy += ((crSegurando && P.vy < 0) ? .5 : .85) * dt;
  if(crPuloSegura > 0) crPuloSegura = Math.max(0, crPuloSegura - dt);
  P.y += P.vy * dt;
  if(P.y >= GY - P.h){
    P.y = GY - P.h;
    P.vy = 0;
    P.air = false;
    if(crPuloGuardado > 0 && state === 'play' && !paused){ P.vy = -12.5; P.air = true; sfx.jump(); crPuloSegura = 8; }   // pulo guardado
    crPuloGuardado = 0;
  }
}

var crPratica = null, crPraticaAlvo = null;
var CR_DESAFIO_TR={
  pt:['Desafio de pulo e deslize','Pule o cabo e deslize sob o refletor.','Pulo','Deslize','Passou','Colidiu'],
  en:['Jump and slide challenge','Jump over cables and slide under spotlights.','Jump','Slide','Cleared','Hit'],
  es:['Reto de salto y deslizamiento','Salta el cable y deslízate bajo el reflector.','Salto','Deslizamiento','Superado','Choque'],
  id:['Tantangan lompat dan meluncur','Lompati kabel dan meluncur di bawah lampu.','Lompat','Meluncur','Lolos','Tertabrak'],
  th:['ความท้าทายกระโดดและสไลด์','กระโดดข้ามสายและสไลด์ลอดไฟ','กระโดด','สไลด์','ผ่าน','ชน'],
  ja:['ジャンプとスライドに挑戦','ケーブルを跳び、照明の下をスライド。','ジャンプ','スライド','クリア','衝突']
};
function crDesafioTexto(i){return CR_DESAFIO_TR[crIdiomaResultado()][i];}
function crDesafioBotoes(){
  $('crDesafioMenu').textContent=$('crDesafioFim').textContent=crDesafioTexto(0);
}
var CR_PISTA_TR = {
  pt:['Tentar na pista','Treino na pista','Você passou pelo obstáculo na pista!','Você bateu na pista. Tente de novo.'],
  en:['Try on the track','Track practice','You cleared the obstacle on the track!','You hit the obstacle. Try again.'],
  es:['Probar en la pista','Práctica en pista','¡Superaste el obstáculo en la pista!','Chocaste en la pista. Inténtalo otra vez.'],
  id:['Coba di lintasan','Latihan di lintasan','Kamu melewati rintangan di lintasan!','Kamu menabrak rintangan. Coba lagi.'],
  th:['ลองในสนาม','ฝึกบนสนาม','ผ่านสิ่งกีดขวางบนสนามแล้ว!','ชนสิ่งกีดขวาง ลองอีกครั้ง'],
  ja:['コースで試す','コース練習','コースの障害物をクリア！','障害物にぶつかりました。もう一度！']
};
var CR_PRATICA_TR = {
  pt:['Praticar obstáculo','Treino · {n} s','Sair do treino','Passou por {n} de 3 obstáculos.','Treino sem pontuação'],
  en:['Practice obstacle','Practice · {n} s','Exit practice','Cleared {n} of 3 obstacles.','Unscored practice'],
  es:['Practicar obstáculo','Práctica · {n} s','Salir de la práctica','Superaste {n} de 3 obstáculos.','Práctica sin puntuación'],
  id:['Latih rintangan','Latihan · {n} dtk','Keluar dari latihan','Melewati {n} dari 3 rintangan.','Latihan tanpa skor'],
  th:['ฝึกผ่านสิ่งกีดขวาง','ฝึกซ้อม · {n} วิ','ออกจากการฝึก','ผ่าน {n} จาก 3 สิ่งกีดขวาง','ฝึกซ้อมโดยไม่นับคะแนน'],
  ja:['障害物を練習','練習 · {n}秒','練習を終える','3つ中{n}つをクリアしました。','スコアなしの練習']
};
function crPraticaTexto(i){ return CR_PRATICA_TR[crIdiomaResultado()][i]; }
function crPraticaConfig(impacto){
  crPraticaAlvo = impacto && impacto.obstaculo ? impacto : null;
  var pista = $('crPraticaPista');
  var isolado=crPraticaAlvo && !crPraticaAlvo.suspenso && ['cable','speaker'].includes(crPraticaAlvo.tipo);
  if(pista){ pista.hidden = !crPraticaAlvo; pista.textContent = CR_PISTA_TR[crIdiomaResultado()][0]; }
  var botao = $('crPraticaBt'), info = $('crPraticaStatus');
  if(botao){ botao.hidden = !isolado; botao.textContent = crPraticaTexto(0); }
  if(info) info.textContent = '';
}
function crPraticaComecar(naPista){
  var desafio=naPista==='desafio';
  if(crPratica || (desafio ? state!=='over'&&state!=='menu' : !crPraticaAlvo||state!=='over'))return;
  naPista = naPista === true;
  if(naPista && $('crPraticaPista').hidden) return;
  var alvo = desafio?'cable':crPraticaAlvo.tipo, cabo = alvo === 'cable';
  var velo = naPista && crPraticaAlvo.velocidade > 0 ? crPraticaAlvo.velocidade : 5.5*SC;
  crPratica = {tempo:0, passou:0, pista:naPista, desafio:desafio, limite:desafio?448:naPista?240:540, anterior:{estado:state, P:P,obs:obs,items:items,pops:pops,fans:fans,sp:sp,frame:frame,dist:dist,pw:pw,shake:shake,
    inv:inv,shield:shield,s2Sliding:s2Sliding,s2SlideTimer:s2SlideTimer,pet:window.activePetFly}};
  P = {x:80,y:GY-44,vy:0,w:30,h:44,air:false};
  var obst = naPista && crPraticaAlvo.obstaculo;
  obs = (desafio?[96,192,288,384]:naPista?[120]:[100,260,420]).map(function(t,i){
    if(desafio && i%2===1)return {k:'refletor',x:P.x+t*velo,y:GY-72,w:46,h:46,high:true};
    var h = obst ? obst.h : cabo ? 12 : 48;
    return {k:alvo,x:P.x+t*velo,y:GY-(obst&&obst.top||h),w:obst ? obst.w : cabo ? 56 : 36,h:h,high:!!(naPista && crPraticaAlvo.suspenso)};
  });
  if(naPista) dist = Math.max(0,dist-velo*120);
  if(typeof crPuloLimpar==='function')crPuloLimpar();
  items=[];pops=[];fans=[];pw=null;inv=0;shield=0;shake=0;held=false;paused=false;
  s2Sliding=false;s2SlideTimer=0;crPuloGuardado=0;crPuloSegura=0;window.activePetFly=null;sp=velo;
  $('menu').hidden=true;$('over').hidden=true;$('crPraticaPainel').hidden=false;$('crPraticaTempo').textContent=crPraticaTexto(1).replace('{n}',Math.ceil(crPratica.limite/60));
  $('crPraticaSair').textContent=crPraticaTexto(2);$('crPraticaTitulo').textContent=desafio?crDesafioTexto(1):naPista?CR_PISTA_TR[crIdiomaResultado()][1]:crPraticaTexto(4);
  $('pause').style.display='block';$('pause').textContent='⏸';$('pz').hidden=true;
  if((window.matchMedia&&matchMedia('(pointer:coarse)').matches)||(desafio&&navigator.maxTouchPoints>0))$('jb').style.display='block';
  document.body.classList.add('jogando');state='play';
  if(desafio || naPista && crPraticaAlvo.suspenso)s2ShowSlideButton();
  $('crPraticaSair').focus({preventScroll:true});last=performance.now();sync();
}
function crPraticaTerminar(completo){
  if(!crPratica)return;
  var registro = crPratica, a = registro.anterior; crPratica=null;
  P=a.P;obs=a.obs;items=a.items;pops=a.pops;fans=a.fans;sp=a.sp;frame=a.frame;dist=a.dist;pw=a.pw;shake=a.shake;
  inv=a.inv;shield=a.shield;s2Sliding=a.s2Sliding;s2SlideTimer=a.s2SlideTimer;window.activePetFly=a.pet;
  if(typeof crPuloLimpar==='function')crPuloLimpar();
  held=false;paused=false;state=a.estado;
  s2ShowSlideButton();
  $('jb').style.display='none';$('pause').style.display='none';$('pz').hidden=true;$('crPraticaPainel').hidden=true;
  document.body.classList.remove('jogando');$('over').hidden=state!=='over';$('menu').hidden=state!=='menu';
  if(registro.desafio){
    var out=state==='menu'?$('crDesafioMenuStatus'):$('crPraticaStatus');
    if(completo)out.textContent=registro.resultado;
    (state==='menu'?$('crDesafioMenu'):$('crDesafioFim')).focus({preventScroll:true});sync();return;
  }
  var pista = $('crPraticaPista');
  if(completo && !registro.pista) pista.hidden = false;
  if(completo) $('crPraticaStatus').textContent=registro.pista ?
    CR_PISTA_TR[crIdiomaResultado()][registro.passou?2:3] : crPraticaTexto(3).replace('{n}',registro.passou);
  (registro.pista || completo ? pista : $('crPraticaBt')).focus({preventScroll:true});sync();
}
function crPraticaQuadro(dt){
  crPratica.tempo+=dt; frame+=dt;dist+=sp*dt;
  if(crPratica.desafio || obs[0].high)s2DeslizeQuadro(dt);
  crPularQuadro(dt);
  if(crPuloGuardado>0)crPuloGuardado=Math.max(0,crPuloGuardado-dt);
  obs.forEach(function(o){
    o.x-=sp*dt;
    if(o.testado)return;
    if(hit(P,o)){o.testado=true;o.errou=true;sfx.hit();return;}
    if(o.x+o.w<P.x){o.testado=true;crPratica.passou++;sfx.star();}
  });
  if(crPratica.tempo>=crPratica.limite){
    if(crPratica.desafio)crPratica.resultado=obs.map(function(o,i){
      return (i+1)+'. '+crDesafioTexto(o.high?3:2)+' · '+crDesafioTexto(o.errou?5:4);
    }).join(' / ');
    crPraticaTerminar(true);return;
  }
  $('crPraticaTempo').textContent=crPraticaTexto(1).replace('{n}',Math.ceil((crPratica.limite-crPratica.tempo)/60));
}
function update(dt){
  frame+=dt;var s0=Math.min(5.5+frame*.0011,12)+Math.min(3,Math.max(0,score-5000)*.0003);sp=s0*SC;dist+=sp*dt;score+=s0*CFG.DIST_RATE*dt;

	// --- LÓGICA DO PAPARAZZI ---
  var curPapa = Math.floor(score / 2500); // Dispara a cada 2500 pontos exatos
  if(curPapa > window.lastPaparazzi && score > 0 && state === 'play') {
    window.lastPaparazzi = curPapa;
    window.flashAlpha = 1; // Ativa a cegueira branca no máximo (100%)
    if (sfx.photo) sfx.photo(); // Toca o sonzinho de foto!
  }

  // Faz a tela branca sumir gradativamente
  if (window.flashAlpha > 0) {
    window.flashAlpha -= dt * 0.035; // Velocidade em que o clarão apaga
    if (window.flashAlpha < 0) window.flashAlpha = 0;
  }

// Disparo a cada 1500 pontos
  var curPetMilestone = Math.floor(score / 1500);
  if(curPetMilestone > (window.lastPetMilestone || 0) && score > 0 && state === 'play'){
    window.lastPetMilestone = curPetMilestone;
    
    // Algoritmo sem repetição (Shuffle Bag)
    if(!window.petBag || window.petBag.length === 0){
      var candidatos = ['tsu', 'lirika', 'pati'].filter(function(k){ return k !== window.lastPetKey; });
      if(s2DailyMode){
         for(var si=candidatos.length-1;si>0;si--){
           var sj=Math.floor(s2Rand()*(si+1)),tmp=candidatos[si];candidatos[si]=candidatos[sj];candidatos[sj]=tmp;
         }
       }else candidatos.sort(function(){ return Math.random() - 0.5; });
      candidatos.push(window.lastPetKey ? window.lastPetKey : (s2Rand() < 0.5 ? 'tsu' : 'pati'));
      window.petBag = candidatos;
    }
    var chosenPet = window.petBag.shift();
    window.lastPetKey = chosenPet;

    // Configuração do pet em voo
    window.activePetFly = {
      type: petCorridaTipo(chosenPet),   // Backstage⭐Pet!: quem voa é o seu pet ativo (sem pet adotado: o sorteado, como antes)
      x: W + 70,
      y: GY - 80,
      dropped: false
    };
  }

  // Atualização do Pet em voo
  if(window.activePetFly){
    window.activePetFly.x -= (sp * 1.35) * dt; // Voa um pouco mais rápido que a pista
    
    // Ponto onde ele larga os presentes (um pouco antes do meio da tela)
    if(!window.activePetFly.dropped && window.activePetFly.x <= W * 0.65){
      window.activePetFly.dropped = true;
	  petPresenteVoz(); // vozinha do seu pet ("nya~", "kyu~", "hmph!"); sem pet adotado continua o "Mew!" de antes
      var dropX = window.activePetFly.x;
      var dropY = window.activePetFly.y;
      sfx.card();
      toast = petPresenteMsg();   // "🎁 Mochi trouxe um presente!" (sem pet adotado: "Presente do Pet! 🎁")
      toastT = 75;
      
      // 15% de chance de Item Especial (Card com efeito ou Sorvete)
      if(s2Rand() < petCorridaChance()){   // 15% normal · 25% com o pet feliz · +5% no estágio Center
        var isCard = s2Rand() < 0.5;
        items.push({
          k: isCard ? 'card' : 'morango',
          x: dropX,
          y: dropY,
          w: isCard ? 18 : 22,
          h: isCard ? 18 : 22,
          got: false,
          ct: isCard ? (s2Rand() < 0.5 ? 'fever' : 'ima') : 'plain',
          petDrop: true
        });
      } else {
        // 85% de chance: 5 estrelas saindo direto do pet em arco
        for(var si = 0; si < 5; si++){
          items.push({
            k: 'star',
            x: dropX + (si * 28),
            y: dropY - Math.sin((si / 4) * Math.PI) * 25,
            w: 18,
            h: 18,
            got: false,
            ct: 'plain',
            petDrop: true
          });
        }
      }
    }
	  
    
    // Saiu da tela pela esquerda
    if(window.activePetFly.x < -60){
      window.activePetFly = null;
    }
  }

  
  var curUfo = Math.floor(score/CFG.UFO_EVERY);
  if(curUfo > lastUfo && score > 0 && state === 'play') {
    lastUfo = curUfo;
    items.push({k:'ufo', x: nextX + 150, y: GY - 100, w: 32, h: 20, got: false});
  }

var curMorango = Math.floor(score/3500); // Surge a cada 3500 pontos
  if(curMorango > (window.lastMorango||0) && score > 0 && state === 'play') {
    window.lastMorango = curMorango;
    items.push({k:'morango', x: nextX + 250, y: GY - 30, w: 22, h: 22, got: false});
  }

	var curMic = Math.floor(score/3000); // Surge a cada 3000 pontos (V2.1.3; antes 4000)
if(curMic > (window.lastMic||0) && score > 0 && state === 'play') {
  window.lastMic = curMic;
  items.push({k:'mic_unit', x: nextX + 300, y: GY - 55, w: 20, h: 20, got: false});
}

  if (pw && pw.k === 'alien') {
    var targetY = (GY - 115) + Math.sin(frame * 0.12) * 14;
    P.y += (targetY - P.y) * 0.12 * dt;
    P.vy = 0; P.air = true;
  } else {
    crPularQuadro(dt);
  }
  if(crPuloGuardado > 0) crPuloGuardado = Math.max(0, crPuloGuardado - dt);

  obs.forEach(function(o){o.x-=sp*dt});items.forEach(function(o){o.x-=sp*dt});nextX-=sp*dt;
	fans.forEach(function(f){ f.x -= sp*dt });
    fans = fans.filter(function(f){ return f.x > -40 });
	items.forEach(function(it){
    if(it.petDrop){
      var dx=(P.x+15)-it.x, dy=(P.y+22)-it.y, d=Math.hypot(dx,dy)||1;
      if(d<260){ it.x += (dx/d)*9*dt; it.y += (dy/d)*9*dt; }
    }
  });
  if(state==='play' && (!crMeta || crMeta.acabou || crMeta.frame0 > frame)) crMetaNova();   // corrida nova (o frame volta a 0 no começo)
  if(crMeta && state==='play') for(var mo=0; mo<obs.length; mo++){ var ob=obs[mo]; if(!ob.passou && ob.x+ob.w < P.x){ ob.passou=true; crMeta.pulos++; } }
  crMetaConferir();
  obs=obs.filter(function(o){return o.x>-90});items=items.filter(function(o){return o.x>-40&&!o.got});
  if(nextX<W+40)spawn();
  
  if(pw){
    if(pw.k==='ima')items.forEach(function(it){var dx=P.x+15-it.x,dy=P.y+22-it.y,d=Math.hypot(dx,dy)||1;if(d<170&&it.k==='star'){it.x+=dx/d*7*dt;it.y+=dy/d*7*dt}});
 if((pw.t-=dt)<=0){
  if(pw.k==='alien' || pw.k==='gigante'){
      inv=150; // Garante escudo temporário de 2,5s ao sair do disco ou desinchar
      if(pw.k==='alien'){ P.air=true; P.vy=0; abducted=false; }
  }
  pw=null;
}
  }
  
  var pb={x:P.x,y:P.y,w:P.w,h:P.h};
  if(inv>0) inv-=dt;
  if(inv<=0 && !(pw && (pw.k==='alien' || pw.k==='gigante'))) {
    for(var i=0;i<obs.length;i++){
      if(hit(pb,obs[i])){
        if(shield){shield--;inv=90;sfx.hit();shake=8;toast=tr('Escudo usado!');toastT=80;break}
        var obstaculo = obs[i];
        crTelemetriaAnotar(obstaculo);
        end({tipo:obstaculo.k, ar:P.air, descendo:P.vy>0, deslizou:s2Sliding, suspenso:obstaculo.high, velocidade:sp,
          obstaculo:{w:obstaculo.w,h:obstaculo.h,top:GY-obstaculo.y}});
        return;
      }
    }
  }


items.forEach(function(it){
    var margemItem = it.k === 'ufo' ? 0 : -4;
    // Removida a trava de Alien, agora coleta suavemente sem bugar o loop!
    if(!it.got && pb.x + margemItem < it.x + it.w && pb.x + pb.w - margemItem > it.x && pb.y + margemItem < it.y + it.h && pb.y + pb.h - margemItem > it.y){
      it.got=true;
      if(it.k==='ufo'){
        score+=CFG.UFO_BONUS; pops.push({x:it.x,y:it.y,t:0,s:'+'+CFG.UFO_BONUS});
        pw={k:'alien',t:CFG.UFO_FRAMES};abducted=true;wasAbducted=true; toast=tr('Kimi wa Alien!'); toastT=110; sfx.ufo();
      } else if(it.k==='card'){
        if(crMeta) crMeta.cartas++;
        score+=100;pops.push({x:it.x,y:it.y,t:0,s:'+100'});sfx.card();
        if(!pw || (pw.k!=='alien' && pw.k!=='gigante')){
            if(it.ct==='plain'){toast=tr('Card! +100')}else{pw={k:it.ct,t:480};toast=pw.k==='fever'?tr('Fever! Estrelas em dobro'):tr('Ímã de estrelas!')}
            toastT=110;
        }
      } else if(it.k==='morango'){
        score+=200; pops.push({x:it.x,y:it.y,t:0,s:'+200'}); sfx.card();
        window.wasGiant=true;
        if(!pw || pw.k!=='alien'){
          pw={k:'gigante',t:400}; inv=400; toast=tr('Mega TsuLiPa!'); toastT=110;
        }
      } else if (it.k === 'mic_unit') {
        score += 300; pops.push({x:it.x, y:it.y, t:0, s:'+300'});
        if (!pw || (pw.k !== 'alien' && pw.k !== 'gigante')) {
          var novoParceiro = getPartner(sel);
          pw = {k: 'unit', partner: novoParceiro, t: 900}; 
          window.wasUnit = novoParceiro;
          
          if(!window.collectedPartners) window.collectedPartners = [];
          if(window.collectedPartners.indexOf(novoParceiro) === -1) {
            window.collectedPartners.push(novoParceiro);
          }

          toast = tr('Unit Mode! Sinergia ✨'); toastT = 110; sfx.card();
        } else {   // V2.1.3: abduzido ou gigante — o poder continua, mas a parceira entra no palco do fim do show
          var parcX = getPartner(sel);
          if(!window.collectedPartners) window.collectedPartners = [];
          if(window.collectedPartners.indexOf(parcX) === -1) window.collectedPartners.push(parcX);
          sfx.card();
        }
      } else {
        var v=pw&&pw.k==='fever'?CFG.STAR_FEVER:CFG.STAR;
        if (pw && pw.k === 'unit') v *= 2; 
        if(pw&&pw.k==='alien') v=Math.round(v*CFG.UFO_STAR_MULT);
        score+=v;pops.push({x:it.x,y:it.y,t:0,s:'+'+v});stars++;sfx.star();
      }
    }
  });
  
  var r=rankOf(score);if(r>rankI){rankI=r;toast=tr('Subiu para ')+tr(RANKS[r][1])+'!';toastT=110;sfx.rank();if(r>=7){sash=true;shield=Math.min(2,shield+1);toast+=tr(' Escudo e look!')}}
  pops.forEach(function(p){p.t+=dt});pops=pops.filter(function(p){return p.t<40});if(toastT>0)toastT-=dt;abducted=!!(pw&&pw.k==='alien');sync();
}
function drawCity(arr,w,off,base,col,win,widthLimit){
  widthLimit = widthLimit || W;
  var o=-(off%w);
  for(var k=0;k<Math.ceil(widthLimit/w)+1;k++){
    arr.forEach(function(b,bi){
      var x=b.x+o+k*w;
      if(x>widthLimit||x+b.w<0)return;
      g.fillStyle=col;
      g.fillRect(x,base-b.h,b.w,b.h);
      if(win){
        g.fillStyle=win;
        var seed=(bi*37+Math.floor(b.s*100))|0;
        for(var r=0,yy=base-b.h+10;yy<base-10;yy+=14,r++){
          for(var c=0,xx=x+7;xx<x+b.w-9;xx+=12,c++){
            if(((c*7+r*13+seed)%7)<2) g.fillRect(xx,yy,4,5);
          }
        }
      }
    });
  }
}
function ufoDraw(x,y,k){
  g.save();g.translate(x,y);g.scale(k,k);
  var u=g.createRadialGradient(0,0,2,0,0,26);
  u.addColorStop(0,'rgba(182,255,59,.85)');u.addColorStop(.5,'rgba(182,255,59,.3)');u.addColorStop(1,'rgba(182,255,59,0)');
  g.fillStyle=u;g.beginPath();g.arc(0,0,26,0,7);g.fill();
  g.fillStyle='#9b30d9';g.beginPath();g.ellipse(0,0,16,6,0,0,7);g.fill();
  g.fillStyle='#b6ff3b';g.beginPath();g.ellipse(0,-3,9,6,0,Math.PI,0);g.fill();
  g.fillStyle='#4169e1';[[-9,0,2.5],[0,1,3],[9,0,2.5]].forEach(function(p){g.beginPath();g.arc(p[0],p[1],p[2],0,7);g.fill()});
  g.restore();
}
function drawBushes(off, baseY, widthLimit){
  baseY = baseY || GY; widthLimit = widthLimit || W;
  var step=46,base=Math.floor(off/step),o=off%step;
  g.fillStyle='rgba(16,64,44,.96)';g.fillRect(0,baseY-7,widthLimit,7);
  for(var j=-1;j<widthLimit/step+2;j++){
    var idx=base+j,a=(((idx*53)%7)+7)%7/7,x=j*step-o;
    function bb(cx,cy,r){g.beginPath();g.arc(cx,cy,r,0,7);g.fill()}
    g.fillStyle='rgba(16,64,44,.96)';bb(x+12,baseY-6,9+a*4);bb(x+26,baseY-8,11+a*3);bb(x+39,baseY-5,8+a*3);
    g.fillStyle='rgba(74,222,128,.2)';bb(x+22,baseY-13,5+a*2);bb(x+34,baseY-11,4);
  }
}
function drawProps(arr,w,off,base,widthLimit){
  widthLimit = widthLimit || W;
  var o=-(off%w);
  var sak=(frame/3600)%4<1||(frame/3600)%4>=3?'#ffb3e0':'#4ade80';
  for(var k=0;k<Math.ceil(widthLimit/w)+1;k++){
    arr.forEach(function(b){
      var x=b.x+o+k*w;
      if(x>widthLimit||x+b.w<0)return;
      if(b.type<0.45){
        g.fillStyle='#2d3748';g.fillRect(x+b.w/2-2,base-20,4,20);
        g.fillStyle=sak;
        g.beginPath();g.arc(x+b.w/2,base-24,11,0,7);g.fill();
        g.beginPath();g.arc(x+b.w/2-7,base-19,8,0,7);g.fill();
        g.beginPath();g.arc(x+b.w/2+7,base-19,8,0,7);g.fill();
      }else if(b.type<0.8){
        g.fillStyle='#1f2937';g.fillRect(x+b.w/2-1,base-b.h,2.5,b.h);
        g.fillRect(x+b.w/2-7,base-b.h,9,2.5);
        g.fillStyle='#fef08a';g.beginPath();g.arc(x+b.w/2-5,base-b.h+3,3,0,7);g.fill();
        g.fillStyle='rgba(254,240,138,0.18)';g.beginPath();g.arc(x+b.w/2-5,base-b.h+3,12,0,7);g.fill();
      }else{
        g.fillStyle='#1f2937';g.fillRect(x+b.w/2-1.5,base-16,3,16);
        g.fillStyle='rgba(56,189,248,0.75)';g.fillRect(x+b.w/2-14,base-30,28,14);
        g.strokeStyle='rgba(255,255,255,0.4)';g.lineWidth=1;g.strokeRect(x+b.w/2-14,base-30,28,14);
      }
    });
  }
}   // Foto 2.0 do Backstage⭐Pet!: '' = braços normais (corrida, menu e cartões continuam iguais)
function charDrawDarkColor(hex,amount){
 var raw=String(hex||'').replace(/^#/,'');
 return '#'+raw.replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-amount).toString(16)).substr(-2)});
}
function charDrawHairRamp(color){
 var key='hair|'+String(color||''),ramp=CHAR_DRAW_RAMP_CACHE.get(key);
 if(ramp)return ramp;
 var dark=charDrawDarkColor(color,60),made=charDrawVerticalRamp(key,25,19,color,dark);
 made.dark=dark;return made;
}
function charDrawStreakRamp(color){
 var key='streak|'+String(color||''),ramp=CHAR_DRAW_RAMP_CACHE.get(key);
 if(ramp)return ramp;
 return charDrawVerticalRamp(key,10,10,color,charDrawDarkColor(color,60));
}
function curPal(){var t=frame/3600,i=Math.floor(t)%4,f=t-Math.floor(t),b=f>.75?(f-.75)/.25:0;b=b*b*(3-2*b);var a=PALR[i],c=PALR[(i+1)%4];for(var k=0;k<a.length;k++){var v=a[k],w=c[k];CURPAL_CACHE[k]='rgb('+Math.round(v[0]+(w[0]-v[0])*b)+','+Math.round(v[1]+(w[1]-v[1])*b)+','+Math.round(v[2]+(w[2]-v[2])*b)+')';}return CURPAL_CACHE;}
function GLc(){return lastS>=30000?'255,215,90':'255,225,245'}
function drawSafe(ctx, fn) {
  ctx.save();
  try {
    fn();
  } finally {
    ctx.restore();
  }
}
function makeShare(){
  var W2=600,H2=760,c2=document.createElement('canvas');c2.width=W2;c2.height=H2;var x2=c2.getContext('2d'),og=g,Q=curPal(),i;
  var sk=x2.createLinearGradient(0,0,0,H2);sk.addColorStop(0,Q[0]);sk.addColorStop(1,Q[1]);x2.fillStyle=sk;x2.fillRect(0,0,W2,H2);
  
g = x2;
for(var b = 0; b < 15; b++){
  var bh = 60 + (b * 87 % 140);
  var bx = b * 45 - 20;
  g.fillStyle = b % 2 ? Q[2] : Q[3];
  g.fillRect(bx, H2 - 60 - bh, 46, bh);
  g.fillStyle = 'rgba(255,235,150,0.3)';
  if(b % 3 !== 0){
    for(var wy = H2 - 60 - bh + 15; wy < H2 - 70; wy += 22){
      g.fillRect(bx + 8, wy, 8, 8);
      g.fillRect(bx + 26, wy, 8, 8);
    }
  }
}
g = og;

  
  x2.fillStyle=Q[6];x2.fillRect(0,H2-60,W2,60);x2.fillStyle=Q[7];x2.fillRect(0,H2-60,W2,4);
  
  if(wasAbducted){
     g=x2; g.save(); g.translate(520, 270); g.scale(2.6, 2.6);
     var ufoG = g.createRadialGradient(0, 0, 2, 0, 0, 26);
     ufoG.addColorStop(0, 'rgba(182, 255, 59, 0.85)'); ufoG.addColorStop(0.5, 'rgba(182, 255, 59, 0.3)'); ufoG.addColorStop(1, 'rgba(182, 255, 59, 0)');
     g.fillStyle = ufoG; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
     g.shadowColor = '#b6ff3b'; g.shadowBlur = 14;
     g.fillStyle='#9b30d9'; g.beginPath(); g.ellipse(0, 0, 16, 6, 0, 0, 7); g.fill(); 
     g.fillStyle='#b6ff3b'; g.beginPath(); g.ellipse(0, -3, 9, 6, 0, Math.PI, 0); g.fill(); g.shadowBlur = 0;
     g.fillStyle='#4169e1'; g.beginPath(); g.arc(-9,0,2.5,0,7); g.fill(); g.beginPath(); g.arc(0,1,3,0,7); g.fill(); g.beginPath(); g.arc(9,0,2.5,0,7); g.fill(); 
     g.restore(); g=og;
  }

if (window.wasGiant) {
    g = x2; g.save(); g.translate(80, 270); g.scale(3.2, 3.2); g.rotate(-0.2);
    g.shadowColor = '#ff6fb5'; g.shadowBlur = 15;
    g.fillStyle='#d97706'; g.beginPath(); g.moveTo(-6,2); g.lineTo(6,2); g.lineTo(0,14); g.fill(); 
    g.fillStyle='#ff6fb5'; g.beginPath(); g.arc(0,-1,7,0,7); g.fill(); 
    g.beginPath(); g.arc(-4,2,4,0,7); g.fill(); g.beginPath(); g.arc(4,2,4,0,7); g.fill(); 
    g.fillStyle='#fff'; g.fillRect(-2,-3,2,2); g.fillRect(2,-1,2,2); g.fillStyle='#4dd8ff'; g.fillRect(-1,-6,2,2);
    g.restore(); g = og;
}
  
  var cn=x2.createLinearGradient(0,0,0,H2-60);cn.addColorStop(0,'rgba(255,255,255,.4)');cn.addColorStop(1,'rgba(255,255,255,0)');x2.fillStyle=cn;x2.beginPath();x2.moveTo(255,0);x2.lineTo(345,0);x2.lineTo(500,H2-60);x2.lineTo(100,H2-60);x2.fill();
  var rg=x2.createRadialGradient(300,560,10,300,560,230);rg.addColorStop(0,'rgba('+GLc()+',.6)');rg.addColorStop(1,'rgba(255,160,220,0)');x2.fillStyle=rg;x2.fillRect(0,0,W2,H2);
  for(i=0;i<16;i++){var px=300+Math.cos(i*1.7)*(130+i%4*22),py=560+Math.sin(i*2.3)*(110+i%3*20),sz=4+i%3*3;x2.fillStyle=i%2?'#ffe14d':'#ff9ccd';x2.fillRect(px-sz,py-1,sz*2,2);x2.fillRect(px-1,py-sz,2,sz*2)}
  
g=x2;g.save();
    if (window.wasGiant) {
      g.translate(300, H2-240);
      g.scale(1.15, 1.15); 
      g.translate(-300, -(H2-240)); 
      
      var hg = g.createRadialGradient(300, H2-160, 20, 300, H2-160, 160);
      hg.addColorStop(0, 'rgba(255,111,181,0.6)'); 
      hg.addColorStop(1, 'rgba(255,111,181,0)');
      g.fillStyle = hg; 
      g.beginPath(); 
      g.arc(300, H2-160, 160, 0, 7); 
      g.fill();
    }
    
   // Fecha o save aberto antes do wasGiant para não acumular transformações
    g.restore();

    var chaoY = H2 - 60; // Linha exata do chão do palco (700)
    var centroPalcoX = 300;
    // Filtra para garantir que o Oshi principal nunca se repita na lista de parceiros
    var partners = (window.collectedPartners || []).filter(function(id) { return id !== sel; });

    // Helper para desenhar qualquer idol com os pés cravados no chão e centralizado no X desejado
    function drawOnStage(charObj, centerX, sc, yOffset, expr) {
      var drawX = centerX - (15 * sc);
      var drawY = chaoY - (44 * sc) + (yOffset || 0);
      var eu = charObj === CH[sel];
      petCharFoto(x2, drawX, drawY, sc, function(){   // contorno suave (V2.1.2); o seu personagem com pose e expressão escolhidas
        if(eu) charPose = petPhPose;
        drawChar(charObj, 0, 0, 1, eu ? petPhExprVal(expr) : expr, !eu);
      });
      g = og;
    }

    if (sel === 3 && partners.length >= 3) {
      // --- CASO 1: QUARTETO SHINY (Você + Tsu, Lirika e Pati grandes e alinhados!) ---
      var scQ = 3.5; // Bonecos grandes (154px de altura) e sem colidir!

      // Aura Shiny Mágica atrás do Quarteto no palco
      var shinyG = x2.createRadialGradient(centroPalcoX, chaoY - 90, 20, centroPalcoX, chaoY - 90, 220);
      shinyG.addColorStop(0, 'rgba(182, 255, 59, 0.55)');
      shinyG.addColorStop(0.5, 'rgba(155, 48, 217, 0.40)');
      shinyG.addColorStop(1, 'rgba(65, 105, 225, 0)');
      x2.fillStyle = shinyG;
      x2.fillRect(40, chaoY - 260, 520, 260);

      // Desenha os 4 membros bem distribuídos no palco (distância de 118px entre cada centro)
      drawOnStage(CH[partners[0]], centroPalcoX - 177, scQ, 0, 2);
      drawOnStage(CH[partners[1]], centroPalcoX - 59,  scQ, -4, 2);
      drawOnStage(CH[partners[2]], centroPalcoX + 177, scQ, 0, 2);
      // Você com destaque no centro-direita
      drawOnStage(CH[sel],         centroPalcoX + 59,  scQ, -6, finalExpr);

      x2.save();
      x2.textAlign = 'center';
      x2.shadowColor = 'rgba(255, 111, 181, 0.85)';
      x2.shadowBlur = 14;
      x2.font = '30px sans-serif';
      x2.fillText('✨', 120, 125); x2.fillText('💖', 145, 170); x2.fillText('🎶', 95, 215); x2.fillText('🎤', 155, 250);
      x2.fillText('✨', 480, 125); x2.fillText('⭐', 455, 170); x2.fillText('💖', 505, 215); x2.fillText('🎵', 445, 250);

      // Corações e brilhos levitando em arco bem ACIMA das coroas/cabeças de cada membro!
      var topY = chaoY - (44 * scQ) - 55;
      var heartMap = ['💜', '💚', '💙', '💖'];
      x2.font = '28px sans-serif';
      x2.fillText(heartMap[partners[0]], centroPalcoX - 177, topY + 6);
      x2.fillText(heartMap[partners[1]], centroPalcoX - 59,  topY - 8);
      x2.fillText('💖',                  centroPalcoX + 59,  topY - 12);
      x2.fillText(heartMap[partners[2]], centroPalcoX + 177, topY + 6);
      
      x2.font = '20px sans-serif';
      x2.fillText('✨', centroPalcoX - 118, topY - 22);
      x2.fillText('👑', centroPalcoX,       topY - 30);
      x2.fillText('✨', centroPalcoX + 118, topY - 22);
      x2.restore();

          } else if (partners.length >= 2) {
      // --- CASO 2: TRIO ---
      var scT = 4.2;
      var esp = 145;   // distância entre os centros
      drawOnStage(CH[partners[0]], centroPalcoX - esp, scT, 0, 2);
      drawOnStage(CH[sel],         centroPalcoX,       scT, -4, finalExpr);
      drawOnStage(CH[partners[1]], centroPalcoX + esp, scT, 0, 2);

      x2.save();
      x2.textAlign = 'center';
      x2.textBaseline = 'alphabetic';
      x2.shadowColor = 'rgba(255, 111, 181, 0.85)';
      x2.shadowBlur = 14;
      x2.font = '30px sans-serif';
      var topY = chaoY - (44 * scT) - 45;
      var heartMap = ['💜', '💚', '💙', '💖']; // Tsu, Lirika, Pati, Você

      x2.fillText(heartMap[partners[0]], centroPalcoX - esp, topY + 8);
      x2.fillText(heartMap[sel],         centroPalcoX,       topY - 6);
      x2.fillText(heartMap[partners[1]], centroPalcoX + esp, topY + 8);

      x2.font = '20px sans-serif';
      x2.fillText('✨', centroPalcoX - esp / 2, topY - 18);
      x2.fillText('✨', centroPalcoX + esp / 2, topY - 18);
      x2.restore();

    } else if (partners.length === 1) {
      // --- CASO 3: DUPLA (Oshi + 1 parceiro) ---
      var scD = 4.7;
      drawOnStage(CH[partners[0]], centroPalcoX - 85, scD, 0, 2);
      drawOnStage(CH[sel],         centroPalcoX + 85, scD, -4, finalExpr);

      x2.fillStyle = '#fff';
      x2.font = '22px sans-serif';
      x2.textAlign = 'center';
      x2.fillText('🎶 ✨ 🎶', centroPalcoX, chaoY - (44 * scD) - 25);

    } else {
      // --- CASO 4: SOLO ---
      drawOnStage(CH[sel], centroPalcoX, 5.2, 0, finalExpr);
    }
    g = og;
    petPalco(x2, 540, chaoY + 2, 2.6, frame);   // seu pet comemorando no palco (Backstage⭐Pet!)
  
    // Textos informativos do Pôster de Fim de Jogo
    var t = typeof tr === 'function' ? tr : function(w){return w;};
    x2.textAlign='center';x2.shadowColor='rgba(0,0,0,.5)';x2.shadowBlur=12;x2.fillStyle='#fff';
    var ttl='TsuLiPa⭐World · Center⭐Run!',tfs=36;do{x2.font='800 '+tfs+'px "M PLUS Rounded 1c",sans-serif';tfs--}while(x2.measureText(ttl).width>500&&tfs>20);x2.fillText(ttl,300,64);
    x2.font='400 16px "M PLUS Rounded 1c",sans-serif';x2.fillStyle='#ff9ccd';x2.fillText('センターラン',300,95);
    
    x2.fillStyle='#fff';x2.font='700 38px "M PLUS Rounded 1c",sans-serif';x2.fillText(nick||t('Anônimo'),300,130);
    x2.font='800 95px "M PLUS Rounded 1c",sans-serif';x2.fillText(String(lastS),300,225);
    x2.font='700 26px "M PLUS Rounded 1c",sans-serif';x2.fillText(t('pontos'),300,265);
    x2.fillStyle='#ffe14d';x2.fillText('★ '+stars+' '+t('estrelas'),300,300);
    
    x2.fillStyle='#ffe14d';x2.font='800 34px "M PLUS Rounded 1c",sans-serif';
    var currentRankId=rankOf(lastS);x2.fillText(t(RANKS[currentRankId][1]),300,345);
    
    // Texto de rodapé seguro dentro da margem inferior da imagem
    x2.shadowBlur=0;x2.fillStyle='rgba(255,255,255,.9)';x2.font='700 16px "M PLUS Rounded 1c",sans-serif';
    x2.fillText(t('Jogue também e entre no ranking!'),300,H2-44);
    petShareMoldura(x2, W2, H2);   // moldura na cor do Oshi + data (V2.1.2)
  
  return (window.twMarcaPng?window.twMarcaPng(c2):c2.toDataURL('image/png'));
}
function draw(){
  var P2=curPal();
  if(s2ArtActive()){
    g.save();
    if(shake>0){g.translate(rnd(-shake,shake)/2,rnd(-shake,shake)/2);shake-=1;}
    s2DrawSceneryBg();
    crLuzesPalco();   // 17/11: as luzes de palco também nos palcos da Temporada 2
    s2DrawSceneryFloor();
  } else {
  var P2=curPal(),sk=g.createLinearGradient(0,0,0,GY);sk.addColorStop(0,P2[0]);sk.addColorStop(1,P2[1]);g.fillStyle=sk;g.fillRect(0,0,W,H);for(var si=0;si<36;si++){g.globalAlpha=.25+.25*Math.sin(frame*.04+si*1.7);g.fillStyle='#fff';g.fillRect((si*97)%W,(si*53)%Math.max(40,GY-170)+8,2,2)}g.globalAlpha=1;
  cenaNuvens(P2); cenaPassaros(P2);   // cenário vivo (V2.2)
  g.save();if(shake>0){g.translate(rnd(-shake,shake)/2,rnd(-shake,shake)/2);shake-=1}
  
  g.fillStyle=P2[2];g.fillRect(0,GY-16,W,16);
  drawCity(far,farW,dist*.15,GY-10,P2[2],P2[4].replace('rgb(','rgba(').replace(')',',.25)'));
  // profundidade (16/11/2026): névoa na cor do céu sobre a cidade de longe — o fundo fica mais apagado e a cena ganha distância
  var nev=g.createLinearGradient(0,GY-220,0,GY);nev.addColorStop(0,cenaMix(cenaRGB(P2[1]),cenaRGB(P2[1]),0,0));nev.addColorStop(1,cenaMix(cenaRGB(P2[1]),cenaRGB(P2[1]),0,.42));g.fillStyle=nev;g.fillRect(0,GY-220,W,220);
  drawCity(near,nearW,dist*.35,GY,P2[3],P2[5].replace('rgb(','rgba(').replace(')',',.48)'));
  var nev2=g.createLinearGradient(0,GY-90,0,GY);nev2.addColorStop(0,cenaMix(cenaRGB(P2[1]),cenaRGB(P2[1]),0,0));nev2.addColorStop(1,cenaMix(cenaRGB(P2[1]),cenaRGB(P2[1]),0,.16));g.fillStyle=nev2;g.fillRect(0,GY-90,W,90);   // um pouco de névoa também na de perto
  g.fillStyle=P2[3];g.fillRect(0,GY-8,W,8);
  crLuzesPalco();   // 17/11: canhões de luz que varrem o céu e batem no compasso (mais fortes no Fever)
  if(typeof cenaCartazes === 'function') cenaCartazes(P2);   // V2.1.3: cartazes do BRS48 e do TsuLiPa
  cenaMultidao(P2);   // multidão que cresce com a pontuação (V2.2) — agora ATRÁS dos arbustos
  drawBushes(dist*.62);

  drawProps(props,propsW,dist*.5,GY);
	
	// --- DESENHANDO A PLATEIA ---
  fans.forEach(function(f){
    // O pulinho é feito com a função seno, baseado no tempo (frame)
    var jump = Math.abs(Math.sin(frame * 0.1 + f.offset)) * 6;
    var fy = f.y - jump;
    
    // Corpo do fã (Silhueta escura)
    g.fillStyle = '#1e293b'; 
    g.fillRect(f.x, fy, 12, 16); 
    g.beginPath(); g.arc(f.x + 6, fy - 5, 6, 0, 7); g.fill(); // Cabeça
    
    // Lightstick neon brilhando
    g.fillStyle = f.color;
    g.shadowColor = f.color;
    g.shadowBlur = 8;
    g.fillRect(f.x + 10, fy - 12, 3, 14); // O bastão de luz na mãozinha
    g.shadowBlur = 0;
  });

	
  cenaGrilo(P2);   // grilo "cri cri" de noite (V2.2)
  if(typeof cenaPinguim === 'function') cenaPinguim();   // V2.1.3: pinguim correndo
  g.fillStyle=P2[6];g.fillRect(0,GY,W,H-GY);
  g.fillStyle=P2[7];g.shadowColor=P2[7];g.shadowBlur=14;g.fillRect(0,GY,W,3);g.shadowBlur=0;
  g.fillStyle='rgba(255,255,255,.12)';for(var x=-(dist%60);x<W;x+=60)g.fillRect(x,GY+22,30,3);
  }
  obs.forEach(function(o){
    if(typeof obsDesenhar==='function'){obsDesenhar(o);return;}
    if(o.k==='cable'){g.fillStyle='#222';g.fillRect(o.x,o.y+4,o.w,6);g.fillStyle='#ffd23f';g.fillRect(o.x+6,o.y+2,10,10);g.fillRect(o.x+o.w-16,o.y+2,10,10)}
    else if(o.k==='speaker'){g.fillStyle='#111827';g.fillRect(o.x,o.y,o.w,o.h);g.strokeStyle='#5a6b9a';g.lineWidth=2;g.strokeRect(o.x+1,o.y+1,o.w-2,o.h-2);g.fillStyle='#3a4a7a';g.beginPath();g.arc(o.x+o.w/2,o.y+17,9,0,7);g.fill();g.beginPath();g.arc(o.x+o.w/2,o.y+36,5,0,7);g.fill()}
    else{var c=o.pal;for(var i=0;i<3;i++){var lx=o.x+i*9+2;g.fillStyle='#ddd';g.fillRect(lx,o.y+16,5,o.h-16);g.fillStyle=c[i];g.shadowColor=c[i];g.shadowBlur=10;g.fillRect(lx-1,o.y+(i%2)*4,7,18);g.shadowBlur=0}}
  });
  crAvisoObstaculo();   // 17/11: o próximo obstáculo avisa na beirada antes de entrar na tela
  items.forEach(function(it){var bob=Math.sin(frame*.12+it.x*.05)*3,cx=it.x+9,cy=it.y+9+bob;
	
    // --- AURA DE DESTAQUE (morango e microfone): anel pulsante + brilho + estrelinhas girando ---
    if (it.k === 'morango' || it.k === 'mic_unit') {
      var auM = it.k === 'morango', auC = auM ? '255,111,181' : '155,48,217';
      g.save(); g.translate(auM ? cx + 7 : cx, auM ? cy + 7 : cy);
      var auG = g.createRadialGradient(0, 0, 3, 0, 0, 34);
      auG.addColorStop(0, 'rgba(' + auC + ',' + (0.35 + 0.15 * Math.sin(frame * 0.15)) + ')'); auG.addColorStop(1, 'rgba(' + auC + ',0)');
      g.fillStyle = auG; g.beginPath(); g.arc(0, 0, 34, 0, 7); g.fill();
      for (var ar = 0; ar < 2; ar++) {
        var auP = (frame * 0.025 + ar * 0.5) % 1;
        g.strokeStyle = 'rgba(' + auC + ',' + (0.85 * (1 - auP)) + ')'; g.lineWidth = 2;
        g.beginPath(); g.arc(0, 0, 10 + auP * 26, 0, 7); g.stroke();
      }
      g.fillStyle = '#fff';
      for (var as = 0; as < 4; as++) {
        var aa = frame * 0.05 + as * Math.PI / 2, ar2 = 22 + Math.sin(frame * 0.1 + as) * 3;
        g.fillRect(Math.cos(aa) * ar2 - 1, Math.sin(aa) * ar2 - 1, 3, 3);
      }
      g.restore();
    }

     if (it.petDrop) {
      g.save();
      g.translate(cx, cy);
      // Halo dourado suave no fundo
      var petHalo = g.createRadialGradient(0, 0, 2, 0, 0, 20);
      petHalo.addColorStop(0, 'rgba(255, 225, 77, 0.6)');
      petHalo.addColorStop(1, 'rgba(255, 225, 77, 0)');
      g.fillStyle = petHalo;
      g.beginPath(); g.arc(0, 0, 20, 0, 7); g.fill();
      // Brilhinhos flutuantes
      g.fillStyle = '#fff';
      g.fillRect(Math.sin(frame * 0.1 + it.x) * 12, -10 + Math.cos(frame * 0.15) * 5, 2, 2);
      g.fillRect(-10 + Math.cos(frame * 0.12) * 5, Math.sin(frame * 0.08) * 10, 2, 2);
      g.restore();
    }
							 
    if(it.k==='card'){g.save();g.translate(cx,cy);g.rotate(Math.sin(frame*.08)*.2);g.fillStyle='#fff';g.fillRect(-9,-13,18,26);g.fillStyle={fever:'#ff8466',ima:'#c8a2f5'}[it.ct]||'#0a84ff';g.fillRect(-7,-11,14,16);if(it.ct==='ima'){g.fillStyle='rgba(255,255,255,'+(.4+.4*Math.sin(frame*.3))+')';g.fillRect(-4,-8,3,3);g.fillRect(2,-3,2,2)}g.fillStyle='#ff6fb5';g.fillRect(-7,7,14,4);g.restore()}
  
  
else if(it.k==='morango'){
      g.save(); g.translate(cx+7, cy+7); g.rotate(Math.sin(frame*0.1)*0.2);
      // Cone
      g.fillStyle='#d97706'; g.beginPath(); g.moveTo(-6,2); g.lineTo(6,2); g.lineTo(0,14); g.fill(); 
      // Sorvete rosa em 3 bolas
      g.fillStyle='#ff6fb5'; g.beginPath(); g.arc(0,-1,7,0,7); g.fill(); 
      g.beginPath(); g.arc(-4,2,4,0,7); g.fill(); g.beginPath(); g.arc(4,2,4,0,7); g.fill(); 
      // Granulados branco e azul
      g.fillStyle='#fff'; g.fillRect(-2,-3,2,2); g.fillRect(2,-1,2,2); g.fillStyle='#4dd8ff'; g.fillRect(-1,-6,2,2);
      g.restore();
    }

	else if (it.k === 'mic_unit') {
  g.save(); g.translate(cx, cy); g.rotate(Math.sin(frame*0.1)*0.2);
  // Halo lilás/roxo cintilante
  var halo = g.createRadialGradient(0, 0, 2, 0, 0, 24);
  halo.addColorStop(0, 'rgba(155, 48, 217, ' + (0.6 + 0.4*Math.sin(frame*0.2)) + ')');
  halo.addColorStop(1, 'rgba(155, 48, 217, 0)');
  g.fillStyle = halo; g.beginPath(); g.arc(0, 0, 24, 0, 7); g.fill();
  
  // Corpo do microfone preto
  g.fillStyle = '#111'; g.beginPath(); g.arc(0, -6, 6, 0, 7); g.fill(); // Globo
  g.fillRect(-2, -3, 4, 14); // Cabo
  g.fillStyle = '#444'; g.beginPath(); g.arc(0, -6, 6, Math.PI, 0); g.fill(); // Detalhe prata
  g.restore();
}
		
    else if(it.k==='ufo'){
      g.save(); g.translate(cx+7, cy); g.rotate(Math.sin(frame*0.1)*0.2);
      var ufoG = g.createRadialGradient(0, 0, 2, 0, 0, 26);
      ufoG.addColorStop(0, 'rgba(182, 255, 59, 0.85)');
      ufoG.addColorStop(0.5, 'rgba(182, 255, 59, 0.3)');
      ufoG.addColorStop(1, 'rgba(182, 255, 59, 0)');
      g.fillStyle = ufoG;
      g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
      g.shadowColor = '#b6ff3b'; g.shadowBlur = 14;
      g.fillStyle='#9b30d9'; g.beginPath(); g.ellipse(0, 0, 16, 6, 0, 0, 7); g.fill(); 
      g.fillStyle='#b6ff3b'; g.beginPath(); g.ellipse(0, -3, 9, 6, 0, Math.PI, 0); g.fill(); 
      g.shadowBlur = 0;
      g.fillStyle='#4169e1'; g.beginPath(); g.arc(-9,0,2.5,0,7); g.fill(); g.beginPath(); g.arc(0,1,3,0,7); g.fill(); g.beginPath(); g.arc(9,0,2.5,0,7); g.fill(); 
      g.restore();
    }
    else{var fv=pw&&pw.k==='fever';if(fv){g.fillStyle='rgba(255,140,100,.3)';g.beginPath();g.arc(cx,cy,15,0,7);g.fill()}g.fillStyle='#ffe14d';g.shadowColor=fv?'#ff8466':'#ffe14d';g.shadowBlur=fv?18:8;g.beginPath();for(var i=0;i<10;i++){var r=i%2?4:10,a=-Math.PI/2+i*Math.PI/5;g.lineTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.fill();g.shadowBlur=0}});

if(window.activePetFly){
    drawPet(g, window.activePetFly.type, window.activePetFly.x, window.activePetFly.y, 1.2, frame);
  }

  if(rankI>=10&&state==='play'){var ag=g.createRadialGradient(P.x+15,P.y+22,4,P.x+15,P.y+22,52);var hc=rankI>=11?'hsla('+((frame*3)%360|0)+',90%,70%,':'rgba(255,225,120,';ag.addColorStop(0,hc+'.55)');ag.addColorStop(1,hc+'0)');g.fillStyle=ag;g.fillRect(P.x-40,P.y-30,110,110);g.fillStyle='#ffe14d';for(var ei=0;ei<4;ei++)g.fillRect(P.x-8-ei*14,P.y+10+Math.sin(frame*.2+ei)*14,3,3)}
  
  if(pw && pw.k==='alien'){
      var bgL = g.createLinearGradient(0, 0, 0, P.y + P.h + 25);
      bgL.addColorStop(0, 'rgba(182, 255, 59, 0.65)');
      bgL.addColorStop(1, 'rgba(182, 255, 59, 0)');
      g.fillStyle = bgL;
      g.beginPath();
      g.moveTo(P.x + P.w/2 - 35, 0);
      g.lineTo(P.x + P.w/2 + 35, 0);
      g.lineTo(P.x + P.w/2 + 18, P.y + P.h + 24);
      g.lineTo(P.x + P.w/2 - 18, P.y + P.h + 24);
      g.fill();
      g.fillStyle = '#b6ff3b';
      for(var pi=0; pi<5; pi++){
        var py = ((frame*3 + pi*30) % (P.y + 100));
        g.fillRect(P.x + P.w/2 - 10 + Math.sin(frame*0.1 + pi)*10, P.y + P.h - py, 3, 3);
      }
  }

  var playExpr = (shake > 0 || (inv > 0 && !abducted)) ? 1 : 0; 
  if(typeof exprCorrida === 'function') playExpr = exprCorrida(playExpr);   // V2.1.3
  var runAnim = state==='play' ? (!P.air ? Math.sin(frame*.5) : (pw && pw.k==='alien' ? Math.sin(frame*.25) : 0)) : 0;

g.save();
  var isGiant = (pw && pw.k === 'gigante');
  if (isGiant) {
    g.translate(P.x + P.w/2, P.y + P.h); g.scale(1.5, 1.5); g.translate(-(P.x + P.w/2), -(P.y + P.h));
    var hg = g.createRadialGradient(P.x+15, P.y+22, 10, P.x+15, P.y+22, 35);
    hg.addColorStop(0, 'rgba(255,111,181,0.6)'); hg.addColorStop(1, 'rgba(255,111,181,0)');
    g.fillStyle = hg; g.beginPath(); g.arc(P.x+15, P.y+22, 35, 0, 7); g.fill();
  }
  // Se for gigante, NÃO pisca. Fica invencível e destrói tudo no caminho!
  var blink = (inv > 0 && !abducted && !isGiant && ((frame/4|0)%2)); 
	
// Desenha APENAS o parceiro sorteado no microfone atual acompanhando você!
  if (pw && pw.k === 'unit' && pw.partner !== undefined) {
    drawChar(CH[pw.partner], P.x - 34, P.y, runAnim, 2, true);
        var heartColors = ['💜', '💚', '💙'];
    g.save();
    g.textAlign = 'center';
    g.textBaseline = 'alphabetic';
    g.font = '9px sans-serif';
    g.fillText(heartColors[pw.partner] || '✨', P.x - 19, P.y - 10 + Math.sin(frame * 0.12) * 1.5);
    g.restore();
  }

	
  if(!blink || (s2HitEmotion>0 && state==='play')){
    g.save();
    var reaction=s2HitEmotion>0 && state==='play';
    if(reaction)g.translate(Math.sin(frame*.8)*(s2HitEmotion>36?2.2:.9),0);
    s2DrawingRunChar=true;
    try{drawChar(CH[sel],P.x,P.y,runAnim,reaction?(s2HitEmotion>36?4:5):playExpr);}
    finally{s2DrawingRunChar=false;g.restore();}
  }
  g.restore();
  
  if(shield&&state==='play'){g.strokeStyle='rgba(120,220,255,'+(.6+.3*Math.sin(frame*.2))+')';g.lineWidth=3;g.shadowColor='#4dd8ff';g.shadowBlur=14;g.beginPath();g.arc(P.x+15,P.y+22,32,0,7);g.stroke();if(shield>1){g.beginPath();g.arc(P.x+15,P.y+22,39,0,7);g.stroke()}g.shadowBlur=0}
  g.restore();
	
// --- EFEITO VISUAL DO FLASH E PAPARAZZI ---
  if (window.flashAlpha > 0.01) {
    // 1. O clarão pinta a tela de branco PRIMEIRO
    g.fillStyle = 'rgba(255, 255, 255, ' + (window.flashAlpha * 0.85) + ')';
    g.fillRect(0, 0, W, H);
    
    // 2. O paparazzi é desenhado POR CIMA, como uma silhueta escura contra a luz
    var papX = P.x + 180 + (1 - window.flashAlpha) * 40; 
    var papY = GY - 16;
    g.fillStyle = '#0f172a'; // Tom ultra escuro
    g.fillRect(papX, papY, 14, 16); 
    g.beginPath(); g.arc(papX + 7, papY - 4, 7, 0, 7); g.fill(); 
    
    // Câmera fotográfica
    g.fillStyle = '#000'; g.fillRect(papX - 6, papY - 2, 12, 8); 
    g.fillStyle = '#fff'; g.beginPath(); g.arc(papX - 6, papY + 2, 4, 0, 7); g.fill();
  }
  
	
  g.textAlign='center';g.font='800 15px "M PLUS Rounded 1c",sans-serif';pops.forEach(function(p){g.globalAlpha=Math.max(0,1-p.t/40);g.fillStyle='#ffe14d';g.fillText(p.s,p.x+9,p.y-p.t*.9)});g.globalAlpha=1;
  if(!crPratica){
    if(s2ArtActive())s2ArtHudBacking();
    g.fillStyle='rgba(255,255,255,.92)';g.font='800 18px "M PLUS Rounded 1c",sans-serif';g.textAlign='left';
    g.fillText(String(Math.floor(score)).padStart(5,'0'),14,28);
    g.font='700 12px "M PLUS Rounded 1c",sans-serif';g.fillStyle='#ff9ccd';g.fillText(tr(RANKS[rankI||rankOf(score)][1]),14,46);g.fillStyle='#ffe14d';g.fillText('★ '+stars,14,64);
  }
  if(pw&&state==='play'){g.textAlign='right';g.fillStyle='#ffe14d';g.fillText((pw.k==='fever'?tr('Fever '):pw.k==='alien'?tr('Abdução '):pw.k==='gigante'?tr('Mega '):pw.k==='unit'?tr('Unit ✨ '):tr('Ímã '))+Math.ceil(pw.t/60)+'s',W-16,72)}
  crMetaDesenhar();
  if(!crPratica&&toastT>0){g.globalAlpha=Math.min(1,toastT/30);g.textAlign='center';g.font='800 '+(W<500?16:26)+'px "M PLUS Rounded 1c",sans-serif';g.fillStyle='#fff';g.shadowColor='#ff6fb5';g.shadowBlur=16;g.fillText(toast,W/2,W<500?122:86,W-24);g.shadowBlur=0;g.globalAlpha=1}
}
// Celular que não aguenta (17/11): mede a corrida e, se ficar abaixo de ~45 quadros por segundo, pede menos pixels
// ao canvas do jogo (2× → 1,5× → 1×). O aparelho guarda o nível (tw_cr_nitidez) para a próxima corrida já começar leve.
var crDes={ms:[],n:0,teto:0};
function crDesempenho(ms){
  var N=window.TW_NITIDEZ;if(!N||!N.limitar||N.desligada||typeof cv==='undefined')return;
  if(!crDes.teto){var sv=0;try{sv=+localStorage.getItem('tw_cr_nitidez')||0;}catch(e){}crDes.teto=sv||9;if(sv)N.limitar(cv,sv);}
  if(crDes.teto<=1)return;
  if(++crDes.n<90)return;                         // os primeiros ~1,5 s têm carga de arquivos e desenhos novos
  crDes.ms.push(ms);if(crDes.ms.length<150)return;
  var o=crDes.ms.slice().sort(function(a,b){return a-b;}),med=o[o.length>>1];crDes.ms=[];
  if(med<=22)return;                               // ~45 qps ou mais: está bem
  var k=N.escala(cv),novo=k>1.5?1.5:1;if(k<=1)return;
  crDes.teto=novo;N.limitar(cv,novo);try{localStorage.setItem('tw_cr_nitidez',String(novo));}catch(e){}
}
function loop(t){
  twIndex2BaseRaf=0;
  if(twIndex2BaseFramesPaused()){last=0;return;}
  var rawDt = last ? (t - last) / 16.667 : 1;
  var dt = Math.max(0.1, Math.min(rawDt, 2.5));
  if(state==='play'&&!paused&&rawDt<20)crDesempenho(rawDt*16.667);
  last=t;
  if(state==='play'&&!paused)update(dt);
  else if(state==='over'&&shake>0)frame+=dt;
  if(!window.TWMotionLifecycle||TWMotionLifecycle.render30Due($('stage'),t))draw();
  twIndex2BaseRaf=requestAnimationFrame(loop);
}
function makeCard(){
  var W2=400, H2=540, c2=document.createElement('canvas');
  c2.width=W2; c2.height=H2; var x2=c2.getContext('2d'), og=g, Q=curPal();
  var charCor = (sel === 3 ? CU.hair : CH[sel].img) || '#ff6fb5';
  
  // 1. O Papel da Polaroid com bolinhas suaves na cor da personagem
  x2.fillStyle='#fffafd'; x2.fillRect(0,0,W2,H2);
  x2.save();
  x2.fillStyle = charCor;
  x2.globalAlpha = 0.08;
  for(var dy = 12; dy < H2; dy += 18){
    for(var dx = (dy / 18 % 2) * 9 + 6; dx < W2; dx += 18){
      x2.beginPath(); x2.arc(dx, dy, 1.6, 0, 7); x2.fill();
    }
  }
  x2.restore();
  petPhFrameDraw(x2, W2, H2, 'papel');   // molduras Oshi e Rank (Foto 2.0)
  
  // 2. Fundo da Foto (Céu dinâmico da paleta atual)
  var sk=x2.createLinearGradient(0,20,0,380);
  sk.addColorStop(0,Q[0]); sk.addColorStop(1,Q[1]);
  x2.fillStyle=sk; x2.fillRect(20,20,360,360);
  
  // 2.5 Estrelas brilhantes nas cores do Trio (Roxo, Azul, Verde)
  var coresTrio = ['#b04fe6', '#4169e1', '#7ed321'];
  for(var st=0; st<25; st++) {
    x2.fillStyle = coresTrio[st % 3];
    x2.globalAlpha = 0.3 + Math.random()*0.7;
    x2.beginPath(); x2.arc(20 + Math.random()*360, 20 + Math.random()*250, Math.random()*2.5 + 1, 0, 7); x2.fill();
  }
  x2.globalAlpha = 1;

  // 2.6 A Cidade ao Fundo (Prédios e janelinhas)
  for(var b=0; b<8; b++){
    var bh = 40 + (b * 67 % 110);
    x2.fillStyle = b % 2 ? Q[2] : Q[3];
    x2.fillRect(20 + b * 45, 300 - bh, 46, bh);
    x2.fillStyle = 'rgba(255,235,150,0.3)';
    if(b % 3 !== 0){
      for(var wy = 300 - bh + 12; wy < 290; wy += 18){
        x2.fillRect(20 + b * 45 + 8, wy, 6, 6);
        x2.fillRect(20 + b * 45 + 26, wy, 6, 6);
      }
    }
  }
  
  // Chãozinho do palco
  x2.fillStyle=Q[2]; x2.fillRect(20,300,360,80);
  x2.fillStyle=Q[6]; x2.fillRect(20,345,360,35);
  x2.fillStyle=Q[7]; x2.fillRect(20,345,360,4);
  
  // Faixa Idol TsuLiPa decorando a base da foto
  var faixag = x2.createLinearGradient(20, 375, 380, 375);
  faixag.addColorStop(0, '#9b30d9'); // Tsu
  faixag.addColorStop(0.5, '#4169e1'); // Pati
  faixag.addColorStop(1, '#b6ff3b'); // Lirika
  x2.fillStyle = faixag;
  x2.fillRect(20, 375, 360, 5);

  // 3. Capturando o Personagem
  var isGiant = (pw && pw.k === 'gigante');
  var isAlien = (pw && pw.k === 'alien');
  var cT = isGiant ? [133, 102, 4.5] : isAlien ? [148, 80, 3.5] : [148, 146, 3.5];   // posição e escala de cada caso (iguais às de antes)
  g=x2; g.save(); 
  g.translate(cT[0], cT[1]); g.scale(cT[2], cT[2]);
  if(isGiant) {
    var hg = g.createRadialGradient(15, 22, 10, 15, 22, 35);
    hg.addColorStop(0, 'rgba(255,111,181,0.6)'); hg.addColorStop(1, 'rgba(255,111,181,0)');
    g.fillStyle = hg; g.beginPath(); g.arc(15, 22, 35, 0, 7); g.fill();
  }
  
  // O Pulo do Gato: Expressão e Animação
  // Expressão: Dano = 1 (susto). Se não for dano, Expressão = 2 (Sorrindo super fofa!) — a Foto 2.0 pode trocar
  var exprFoto = petPhExprVal((inv>0 && !isGiant && !isAlien) ? 1 : 2);
  
  // Captura o balanço da perna e pulo do exato milissegundo do jogo
  var runAnim = state==='play' ? (!P.air ? Math.sin(frame*.5) : (isAlien ? Math.sin(frame*.25) : 0)) : 0;

// Captura os halos na polaroid
  if (pw && pw.k === 'fever') {
    var fH = g.createRadialGradient(15, 22, 5, 15, 22, 55);
    fH.addColorStop(0, 'rgba(255, 132, 102, 0.4)'); fH.addColorStop(1, 'rgba(255, 132, 102, 0)');
    g.fillStyle = fH; g.beginPath(); g.arc(15, 22, 55, 0, 7); g.fill();
  } else if (pw && pw.k === 'ima') {
    var iH = g.createRadialGradient(15, 22, 5, 15, 22, 55);
    iH.addColorStop(0, 'rgba(200, 162, 245, 0.4)'); iH.addColorStop(1, 'rgba(200, 162, 245, 0)');
    g.fillStyle = iH; g.beginPath(); g.arc(15, 22, 55, 0, 7); g.fill();
  }
  g.restore(); g=og;

  // Dupla (Unit) e jogador principal, com contorno suave para não sumirem no fundo (Foto 2.0)
  var unitFoto = (pw && pw.k === 'unit' && pw.partner !== undefined);
  var xOffsetPrincipal = unitFoto ? 18 : 0;
  petCharFoto(x2, cT[0], cT[1], cT[2], function(){
    if (unitFoto) {
      drawChar(CH[pw.partner], -18, 0, runAnim, 2, true);
      var hCols = ['💜', '💚', '💙'];
      g.save(); g.textAlign = 'center'; g.font = '8px sans-serif'; g.fillStyle = '#000';
      g.fillText(hCols[pw.partner] || '✨', -3, -10);
      g.restore();
    }
    charPose = petPhPose;   // pose escolhida (Foto 2.0)
    drawChar(CH[sel], xOffsetPrincipal, 0, runAnim, exprFoto);
  });

// Sorteia ou define o pet principal e os coadjuvantes para enfeitar embaixo
  var listaPets = ['tsu', 'lirika', 'pati'];
  var mainPetKey = sel===0 ? 'tsu' : sel===1 ? 'lirika' : sel===2 ? 'pati' : (OSHI || listaPets[Math.floor(Math.random()*3)]);
  var cartaoPets = petCartaoPets(mainPetKey, listaPets);   // [seu pet ativo, outros da coleção] (sem pet adotado: igual a antes)
  
// Desenha o pet principal bem grande e imponente no céu da foto (escala 2.0)
  petBrilhoEstagio(x2, 325, 75, 44);
  drawPet(x2, cartaoPets[0], 325, 75, 2.0, frame);

  // Vinheta suave de flash e borda interna da foto
  var vg = x2.createRadialGradient(200, 200, 90, 200, 200, 260);
  vg.addColorStop(0, 'rgba(255,255,255,0)');
  vg.addColorStop(1, 'rgba(255,190,225,0.22)');
  x2.fillStyle = vg; x2.fillRect(20, 20, 360, 360);
  x2.strokeStyle = 'rgba(18,54,94,0.08)'; x2.lineWidth = 1; x2.strokeRect(20.5, 20.5, 359, 359);

  // Fita adesiva (washi tape) colada no topo da foto, na cor da personagem!
  x2.save();
  x2.translate(200, 18);
  x2.rotate(-0.05);
  x2.globalAlpha = 0.65;
  x2.fillStyle = charCor;
  x2.fillRect(-58, -11, 116, 22);
  x2.globalAlpha = 0.35;
  x2.fillStyle = '#ffffff';
  for(var tp = -50; tp < 58; tp += 14) x2.fillRect(tp, -11, 6, 22);
  x2.restore();
  x2.globalAlpha = 1;
  petPhFrameDraw(x2, W2, H2, 'topo', 380, ['🏆', RANKS[rankI][1]]);   // Foto 2.0: selo com o rank da corrida

  // Descobre quais são os outros 2 pets (coadjuvantes)
  var petsCoadjuvantes = cartaoPets.slice(1);

  // 4. Textos do Photocard
  var t = typeof tr === 'function' ? tr : function(w){return w;};
  x2.fillStyle='#12365e'; x2.textAlign='center';
  x2.font='800 28px "M PLUS Rounded 1c",sans-serif';
  x2.fillText(nick || t('Anônimo'), 200, 432, 290);
  
  x2.fillStyle='#ff6fb5'; var rkTxt = t(RANKS[rankI][1]) + ' ✧ ' + Math.floor(score) + ' pts', rkF = 20; x2.font='700 20px "M PLUS Rounded 1c",sans-serif';
  while(rkF > 13 && x2.measureText(rkTxt).width > 190){ rkF--; x2.font='700 ' + rkF + 'px "M PLUS Rounded 1c",sans-serif'; }
  var rkW = Math.min(190, x2.measureText(rkTxt).width);
  x2.fillText(rkTxt, 200, 464, 190);
  
  // Os dois outros pets nas laterais, sempre fora do texto (V2.1.3)
  drawPet(x2, petsCoadjuvantes[0], Math.max(42, Math.min(85, 200 - rkW / 2 - 34)), 452, 1.15, frame);
  drawPet(x2, petsCoadjuvantes[1], Math.min(358, Math.max(315, 200 + rkW / 2 + 34)), 452, 1.15, frame);

  // Adesivinhos de brilho e corações na Polaroid
  x2.fillStyle = '#ff6fb5';
  x2.font = '22px sans-serif';
  x2.textAlign = 'left';
  x2.fillText('✨', 35, 415);   // Brilho na margem inferior esquerda
  x2.fillText('💕', 35, 60);    // No topo esquerdo da moldura
  
  x2.textAlign = 'right';
  x2.fillText('💕', 370, 415);  // Corações na margem inferior direita
  x2.fillText('🫰', 365, 495);  // Mãozinha de coração no canto inferior direito

  // Data formatada conforme o idioma + Marca d'água oficial no rodapé
  var loc = { pt:'pt-BR', en:'en-US', es:'es-ES', th:'th-TH', ja:'ja-JP' }[LANG] || 'pt-BR';
  x2.textAlign = 'center';
  x2.fillStyle = '#94a3b8';
  x2.font = '600 12px "M PLUS Rounded 1c",sans-serif';
  x2.fillText(new Date().toLocaleDateString(loc, { day:'2-digit', month:'2-digit', year:'numeric' }), 200, 498);
  x2.font='500 11px "M PLUS Rounded 1c",sans-serif';
  x2.fillText('🌷 TsuLiPa⭐World · Center⭐Run! · BRS48 Official Photocard', 200, 524);
	
  return (window.twMarcaPng?window.twMarcaPng(c2):c2.toDataURL('image/png'));
}
function cenaRGB(s){ var m = String(s).match(/\d+/g) || [0, 0, 0]; return [+m[0], +m[1], +m[2]]; }
function cenaMix(a, b, t, al){ return 'rgba(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' + Math.round(a[1] + (b[1] - a[1]) * t) + ',' + Math.round(a[2] + (b[2] - a[2]) * t) + ',' + (al === undefined ? 1 : al) + ')'; }
function cenaNoite(P2){ var c = cenaRGB(P2[0]); return (c[0] * .3 + c[1] * .59 + c[2] * .11) < 80; }
function cenaNuvens(P2){
  var top = cenaRGB(P2[0]), bot = cenaRGB(P2[1]), cid = cenaRGB(P2[2]), wh = [255, 255, 255];
  var noite = cenaNoite(P2), yMax = Math.max(60, GY - 190);
  [[.03, .04, .62, .55, 300], [.07, .09, .95, .78, 240]].forEach(function(L, li){
    var off = dist * L[0] + frame * L[1], esp = L[4], i0 = Math.floor(off / esp);
    for(var i = i0; i < i0 + Math.ceil(W / esp) + 2; i++){
      var h = cenaHash(i * 3 + li * 101); if(h < .3) continue;   // alguns espaços ficam sem nuvem
      var cx = (i - i0) * esp - (off % esp) + h * 90 - 40, cy = 26 + cenaHash(i * 7 + li) * (yMax - 26), s = L[2] * (.75 + cenaHash(i * 11 + li) * .5);
      cenaNuvem(cx, cy, s, L[3] * (noite ? .7 : 1), top, bot, cid, wh, noite);
    }
  });
}
function cenaNuvem(cx, cy, s, al, top, bot, cid, wh, noite){
  var B = [[-22, 4, 12], [-7, -4, 16], [12, -2, 14], [27, 5, 10], [2, 7, 13]];
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = cenaMix(bot, cid, .45, al * .9);                       // sombra embaixo, na cor do cenário
  B.forEach(function(b){ g.beginPath(); g.arc(b[0], b[1] + 4, b[2], 0, 7); g.fill(); });
  g.fillStyle = cenaMix(cenaRGB(cenaMix(top, bot, .5)), wh, noite ? .25 : .55, al);   // corpo
  B.forEach(function(b){ g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); });
  g.fillStyle = cenaMix(top, wh, noite ? .45 : .82, al * .75);          // luz em cima
  [[-9, -8, 9], [10, -6, 8]].forEach(function(b){ g.beginPath(); g.arc(b[0], b[1], b[2], 0, 7); g.fill(); });
  g.restore();
}
function cenaPassaros(P2){
  if(!cenaAves && frame > cenaProxAves && state === 'play'){
    var dir = Math.random() < .5 ? 1 : -1;
    cenaAves = { f0:frame, dir:dir, y:30 + Math.random() * Math.max(30, GY - 220), n:3 + Math.floor(Math.random() * 3) };
  }
  if(!cenaAves) return;
  var A = cenaAves, t = frame - A.f0, x0 = A.dir > 0 ? -40 + t * 1.7 : W + 40 - t * 1.7;
  if(x0 < -160 || x0 > W + 160){ cenaAves = null; cenaProxAves = frame + 1500 + Math.random() * 1500; return; }   // 25 a 50 s até o próximo
  g.save(); g.strokeStyle = cenaMix(cenaRGB(P2[1]), [20, 10, 40], .65, .85); g.lineWidth = 1.6; g.lineCap = 'round';
  for(var j = 0; j < A.n; j++){
    var bx = x0 - A.dir * j * 13, by = A.y + (j % 2 ? 1 : -1) * Math.ceil(j / 2) * 7 + Math.sin(t * .05 + j) * 2, fl = Math.sin(t * .25 + j * 1.3) * 3;
    g.beginPath(); g.moveTo(bx - 6, by - fl); g.quadraticCurveTo(bx - 3, by - 1, bx, by); g.quadraticCurveTo(bx + 3, by - 1, bx + 6, by - fl); g.stroke();
  }
  g.restore();
}
function cenaMultidao(P2){
  var dens = score >= 10000 ? .95 : score >= 5000 ? .7 : score >= 2500 ? .32 : 0;
  if(!dens) return;
  var cores = ['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5', '#ffe14d'], esp = 11, off = dist * .45, i0 = Math.floor(off / esp);
  var silh = cenaMix(cenaRGB(P2[3]), [10, 8, 30], .45);
  for(var fila = 0; fila < (score >= 10000 ? 2 : 1); fila++){
    var base = GY - 14 - fila * 6;
    for(var i = i0; i < i0 + Math.ceil(W / esp) + 2; i++){
      var h = cenaHash(i * 13 + fila * 977); if(h > dens) continue;
      var x = (i - i0) * esp - (off % esp), pulo = Math.abs(Math.sin(frame * .1 + i * .7)) * (score >= 5000 ? 4 : 2.5), y = base - pulo - cenaHash(i * 5) * 3;
      g.fillStyle = silh; g.fillRect(x, y - 9, 8, 10); g.beginPath(); g.arc(x + 4, y - 12, 4, 0, 7); g.fill();
      var c = cores[Math.floor(cenaHash(i * 17 + fila) * cores.length)], bal = Math.sin(frame * .1 + i) * 2;
      g.fillStyle = c; g.globalAlpha = .9; g.fillRect(x + 6 + bal * .3, y - 21, 2, 9); g.globalAlpha = .28; g.fillRect(x + 4 + bal * .3, y - 23, 6, 13); g.globalAlpha = 1;
    }
  }
}
function cenaGrilo(P2){
  if(!cenaGrl && state === 'play' && frame > cenaProxGrilo){
    if(cenaNoite(P2) && Math.random() < .5) cenaGrl = { d0:dist, f0:frame, ult:0 };
    else cenaProxGrilo = frame + 600;
  }
  if(!cenaGrl) return;
  var G = cenaGrl, x = W + 20 - (dist - G.d0) * .62, t = frame - G.f0;
  if(x < -30){ cenaGrl = null; cenaProxGrilo = frame + 2400 + Math.random() * 1800; return; }
  var hop = (t % 160) < 14 ? Math.sin((t % 160) / 14 * Math.PI) * 6 : 0, y = GY - 4 - hop;
  if(typeof griloAmor === 'function') griloAmor(G, x);   // V2.1.3
  g.save(); g.translate(x, y);
  g.strokeStyle = '#3f6212'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(-3, 1); g.lineTo(-7, 4); g.moveTo(1, 1); g.lineTo(-1, 4); g.moveTo(3, 1); g.lineTo(6, 4); g.stroke();   // perninhas
  g.beginPath(); g.moveTo(5, -2); g.quadraticCurveTo(10, -10, 14, -9); g.moveTo(5, -2); g.quadraticCurveTo(9, -12, 11, -13); g.stroke();   // antenas
  g.fillStyle = '#65a30d'; g.beginPath(); g.ellipse(0, -1, 6, 2.8, -.1, 0, 7); g.fill();
  g.fillStyle = '#4d7c0f'; g.beginPath(); g.arc(5, -2, 2.4, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.fillRect(5.5, -3, 1, 1);
  g.restore();
  if(x > 20 && x < W - 20 && t - G.ult > 70){   // canta enquanto está na tela
    G.ult = t;
    for(var k = 0; k < 3; k++){ beep(4400, .035, 'sine', .018, k * .06); beep(4700, .03, 'sine', .01, k * .06 + .02); }
  }
  if(t - G.ult < 40){
    g.save(); g.globalAlpha = 1 - (t - G.ult) / 40; g.fillStyle = '#d9f99d'; g.font = '800 10px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
    g.fillText('cri cri ♪', x + 4, y - 16 - (t - G.ult) * .2); g.restore();
  }
}
// Girar o celular no meio da corrida: refaz a tela no formato novo e move tudo junto com o chão
function cenaGirarTela(){
  var pt2 = matchMedia('(max-width:700px) and (orientation:portrait)').matches;
  if((pt2 ? 380 : 720) === W) return;
  var oG = GY; layout(); var dy = GY - oG;
  if(P) P.y += dy;
  [obs, items, fans].forEach(function(L){ (L || []).forEach(function(o){ if(typeof o.y === 'number') o.y += dy; }); });
  if(window.activePetFly) window.activePetFly.y += dy;
  if(!paused) setPause(true);
}
function bestcSalvar(i, s){ var o = bestcLer() || bestcIniciar(); if(s > (+o[i] || 0)){ o[i] = s; bestcGravar(o); } }
function griloAmor(G, x){   // encostar no grilo da noite: ★1 e "Amor Grilado" (uma vez por grilo)
  if(G.pego || state !== 'play' || !P || P.air) return;
  if(Math.abs(x - (P.x + 15)) < 14){ G.pego = true; stars += 1; toast = '🦗 ' + tr('Amor Grilado!') + ' +★1'; toastT = 110; beep(1568, .08, 'triangle', .04); beep(2093, .1, 'triangle', .04, .08); }
}
function cenaPinguim(){   // de vez em quando, um pinguim passa correndo no fundo
  if(state !== 'play') return;
  if(frame < 5){ cenaPg = null; cenaPgFeito = false; }
  if(!cenaPg && !cenaPgFeito && score > 1500 && Math.random() < .002){ cenaPg = { x: W + 30, f: 0 }; cenaPgFeito = true; toast = '🐧 ' + tr('Hashire! Penguin!'); toastT = 100; }
  if(!cenaPg) return;
  var p = cenaPg; p.f++; p.x -= 5.5;
  if(p.x < -40){ cenaPg = null; return; }
  var y = GY - 6 - Math.abs(Math.sin(p.f * .4)) * 4, w = Math.sin(p.f * .5) * .25;
  g.save(); g.translate(p.x, y); g.rotate(w * .3);
  g.fillStyle = '#1f2937'; g.beginPath(); g.ellipse(0, -10, 7, 10, 0, 0, 7); g.fill();
  g.fillStyle = '#fff'; g.beginPath(); g.ellipse(1.5, -8, 4.5, 7, 0, 0, 7); g.fill();
  g.fillStyle = '#1f2937'; g.beginPath(); g.ellipse(-6, -9, 2, 5, w + .4, 0, 7); g.fill();
  g.fillStyle = '#f59e0b'; g.beginPath(); g.moveTo(-6, -15); g.lineTo(-11, -14); g.lineTo(-6, -13); g.fill(); g.fillRect(-4, 0, 3, 1.5); g.fillRect(1, 0, 3, 1.5);
  g.fillStyle = '#fff'; g.fillRect(-4, -17, 2, 2); g.fillStyle = '#111'; g.fillRect(-4, -16.5, 1, 1);
  g.fillStyle = '#ff6fb5'; g.fillRect(-2, -20, 6, 2);   // faixinha de idol
  g.restore();
}
function exprCorrida(base){   // reação do personagem durante a corrida
  if(base === 1) return 1;                                   // bateu: "ai!"
  if(pw && pw.k === 'alien') return 4;                        // abduzido: surpresa
  if(pw && pw.k === 'unit' && pw.t > 780) return 6;           // a parceira acabou de chegar: apaixonado
  if(pw && (pw.k === 'fever' || pw.k === 'gigante')) return 2; // Fever e Mega: sorrisão
  return base;
}
function exprFinal(s, recorde){   // expressão no fim do show
  if(recorde) return 6;
  if(s < 450) return 5;
  return Math.random() < .5 ? 2 : 3;
}
function outdoorFotoDe(p){   // foto quadrada do perfil (feita uma vez e guardada)
  if(outdoorFoto[p.nick]) return outdoorFoto[p.nick];
  var c = document.createElement('canvas'); c.width = 112; c.height = 112;
  try{ perfDesenharIdol(c.getContext('2d'), 112, 112, p.avatar, true, true, 0); }catch(e){}
  return (outdoorFoto[p.nick] = c);
}
function cenaCartazes(P2){
  var esp = 640, off = dist * .35, i0 = Math.floor(off / esp), noite = typeof cenaNoite === 'function' && cenaNoite(P2);
  function rr(x0, y0, w, h, r){ g.beginPath(); g.moveTo(x0 + r, y0); g.arcTo(x0 + w, y0, x0 + w, y0 + h, r); g.arcTo(x0 + w, y0 + h, x0, y0 + h, r); g.arcTo(x0, y0 + h, x0, y0, r); g.arcTo(x0, y0, x0 + w, y0, r); g.closePath(); }
  for(var i = i0; i <= i0 + 2; i++){
    var jog = outdoorJog.length && (i % 3 !== 0) ? outdoorJog[((i % outdoorJog.length) + outdoorJog.length) % outdoorJog.length] : null;
    var sku = !jog && ((i % 15 + 15) % 15 === 9); // 1 SKU a cada 5 placas institucionais; BRS continua predominante
    var w = jog ? 58 : 54, h = jog ? 74 : 66, x = Math.round(i * esp - off + 260), y0 = GY - (jog ? 118 : 110), k;
    if(x < -80 || x > W + 20) continue;
    var neon = jog ? '#ff6fb5' : sku ? '#ffc18e' : '#4dd8ff';
    g.save(); g.globalAlpha = noite ? .95 : .88;
    // poste único, discreto
    g.fillStyle = noite ? '#231d38' : '#4a4266'; g.fillRect(x + w / 2 - 2, y0 + h, 4, GY - y0 - h);
    if(noite){ var lg = g.createRadialGradient(x + w / 2, y0 + h / 2, 6, x + w / 2, y0 + h / 2, 60); lg.addColorStop(0, jog ? 'rgba(255,111,181,.22)' : sku ? 'rgba(255,153,85,.22)' : 'rgba(77,216,255,.22)'); lg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = lg; g.fillRect(x - 40, y0 - 40, w + 80, h + 80); }
    // moldura escura com contorno neon
    g.fillStyle = '#1d1730'; rr(x - 3, y0 - 3, w + 6, h + 6, 7); g.fill();
    g.strokeStyle = neon; g.lineWidth = 1.6; if(noite){ g.shadowColor = neon; g.shadowBlur = 8; } rr(x - 3, y0 - 3, w + 6, h + 6, 7); g.stroke(); g.shadowBlur = 0;
    g.save(); rr(x, y0, w, h, 5); g.clip();
    if(jog){
      g.drawImage(outdoorFotoDe(jog), x, y0, w, w);
      g.fillStyle = 'rgba(29,23,48,.92)'; g.fillRect(x, y0 + w, w, h - w);
      g.fillStyle = '#ffe9f5'; g.font = '800 8px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
      g.fillText('⭐ ' + String(jog.nick).slice(0, 10), x + w / 2, y0 + w + 11, w - 4);
    } else {
      var bg = g.createLinearGradient(x, y0, x + w, y0 + h); bg.addColorStop(0, sku ? '#ffac71' : '#3c46ca'); bg.addColorStop(1, sku ? '#ff9550' : '#262d8f');
      g.fillStyle = bg; g.fillRect(x, y0, w, h);
      g.fillStyle = '#fff'; g.textAlign = 'left'; g.font = '200 21px "Josefin Sans","Futura","Century Gothic","Avenir",sans-serif';
      g.fillText(sku ? 'SKU' : 'BRS', x + 7, y0 + 30); g.fillText('48', x + 7, y0 + 56);
    }
    g.fillStyle = 'rgba(255,255,255,.08)'; g.beginPath(); g.moveTo(x, y0); g.lineTo(x + w * .6, y0); g.lineTo(x, y0 + h * .5); g.closePath(); g.fill();   // reflexo
    g.restore();
    // luzinhas no alto
    for(k = 0; k < 4; k++){ var on = Math.floor(frame / 14 + k) % 2 === 0; g.fillStyle = on ? neon : 'rgba(255,255,255,.25)'; g.beginPath(); g.arc(x + 6 + k * (w - 12) / 3, y0 - 6, 1.6, 0, 7); g.fill(); }
    g.restore();
  }
}
function obsRR(x0, y0, w, h, r){ g.beginPath(); g.moveTo(x0 + r, y0); g.arcTo(x0 + w, y0, x0 + w, y0 + h, r); g.arcTo(x0 + w, y0 + h, x0, y0 + h, r); g.arcTo(x0, y0 + h, x0, y0, r); g.arcTo(x0, y0, x0 + w, y0, r); g.closePath(); }
// 17/11: luzes de palco entre a cidade e a plateia — dois canhões que varrem devagar e pulsam na batida da trilha
// que está tocando (sem som, 120 BPM = uma batida a cada 30 quadros). Cores do trio; no Fever ficam mais fortes e rosadas.
function crLuzesPalco(){
  if(state === 'menu') return;
  // na batida da trilha que está tocando (baixo a cada 2 passos); sem som, o compasso fixo de 120 BPM
  var agoraB = performance.now(), batMs = (typeof crPassoMs === 'number' ? crPassoMs : 190) * 2, bat;
  if(typeof crBatidaT === 'number' && crBatidaT && agoraB - crBatidaT < batMs * 3) bat = Math.min(1, (agoraB - crBatidaT) / batMs);
  else bat = (frame % 30) / 30;
  var pulso = Math.pow(1 - bat, 3), fever = !!(pw && pw.k === 'fever');
  var base = (fever ? .2 : .1) + pulso * (fever ? .2 : .1), cores = fever ? ['255,111,181', '255,111,181'] : ['155,48,217', '65,105,225'];
  g.save(); g.globalCompositeOperation = 'lighter';
  for(var i = 0; i < 2; i++){
    var ox = i ? W * .82 : W * .18, ang = Math.sin(frame * .012 + i * 2.1) * .55 + (i ? -.35 : .35), len = GY + 40;
    var tx = ox + Math.sin(ang) * len, ty = GY + 10, larg = 70 + pulso * 26;
    var gr = g.createLinearGradient(ox, -10, tx, ty); gr.addColorStop(0, 'rgba(' + cores[i] + ',' + (base * 1.6).toFixed(3) + ')'); gr.addColorStop(1, 'rgba(' + cores[i] + ',0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(ox - 6, -10); g.lineTo(ox + 6, -10); g.lineTo(tx + larg, ty); g.lineTo(tx - larg, ty); g.closePath(); g.fill();
    var pool = g.createRadialGradient(tx, GY - 4, 4, tx, GY - 4, larg * 1.2); pool.addColorStop(0, 'rgba(' + cores[i] + ',' + (base * 1.4).toFixed(3) + ')'); pool.addColorStop(1, 'rgba(' + cores[i] + ',0)');
    g.fillStyle = pool; g.fillRect(tx - larg * 1.3, GY - 40, larg * 2.6, 50);
  }
  g.restore();
}
// 17/11: aviso do próximo obstáculo — brilho rosa no chão, na beirada direita, e um "!" na altura dele, que
// fica mais forte conforme ele chega (≈ meio segundo antes de aparecer). Só o mais próximo; some no Fever/Gigante.
function crAvisoObstaculo(){
  if(state !== 'play' || (pw && (pw.k === 'gigante' || pw.k === 'alien'))) return;
  for(var i = 0; i < obs.length; i++){
    var o = obs[i]; if(o.x <= W - 4 || o.x > W + 210) continue;
    var calmo=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var perto = 1 - (o.x - W) / 210, a = (.25 + .45 * perto) * (calmo?1:(.7 + .3 * Math.sin(frame * .45)));
    var gr = g.createRadialGradient(W, GY, 2, W, GY, 46 + 24 * perto); gr.addColorStop(0, 'rgba(255,111,181,' + a.toFixed(3) + ')'); gr.addColorStop(1, 'rgba(255,111,181,0)');
    g.fillStyle = gr; g.fillRect(W - 72, GY - 64, 72, 86);
    var cy = Math.max(24, Math.min(GY - 12, o.y - 4));
    g.save(); g.globalAlpha = Math.min(1, .35 + perto); g.fillStyle = '#ff6fb5'; g.shadowColor = '#ff6fb5'; g.shadowBlur = 8;
    g.beginPath(); if(g.roundRect) g.roundRect(W - 22, cy - 9, 16, 18, 6); else g.rect(W - 22, cy - 9, 16, 18); g.fill(); g.shadowBlur = 0;
    g.fillStyle = '#fff'; g.font = 'bold 13px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.high?'↓':'↑', W - 14, cy + .5); g.restore();
    break;
  }
}
function obsDesenhar(o){
  var x = o.x, y = o.y, w = o.w, h = o.h, i;
  g.save();
  g.fillStyle = 'rgba(10,5,30,.3)'; g.beginPath(); g.ellipse(x + w / 2, y + h + 1, w * .55, 3, 0, 0, 7); g.fill();
  if(o.k === 'cable'){   // cabo de palco preso com fita rosa e conectores
    g.lineCap = 'round'; g.strokeStyle = '#1c1830'; g.lineWidth = 7; g.beginPath(); g.moveTo(x + 5, y + 8); g.bezierCurveTo(x + w * .3, y + 2, x + w * .62, y + 13, x + w - 5, y + 7); g.stroke();
    g.strokeStyle = 'rgba(255,255,255,.2)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x + 7, y + 6.3); g.bezierCurveTo(x + w * .3, y + .4, x + w * .62, y + 11.4, x + w - 7, y + 5.4); g.stroke();
    g.save(); g.translate(x + w / 2, y + 7.5); g.rotate(-.12); g.fillStyle = '#ff6fb5'; g.fillRect(-7, -6, 14, 12); g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-7, -6, 14, 2.5);
    g.fillStyle = '#fff'; g.font = '900 6px sans-serif'; g.textAlign = 'center'; g.fillText('48', 0, 3); g.restore();
    [[x + 1, y + 8, 1], [x + w - 1, y + 7, -1]].forEach(function(c){
      var cg = g.createLinearGradient(c[0], c[1] - 4, c[0], c[1] + 4); cg.addColorStop(0, '#f2f4ff'); cg.addColorStop(1, '#8a90b5');
      g.fillStyle = cg; obsRR(c[2] > 0 ? c[0] : c[0] - 10, c[1] - 4, 10, 8, 2.5); g.fill();
      g.fillStyle = '#ffd23f'; g.fillRect(c[2] > 0 ? c[0] + 7 : c[0] - 9.5, c[1] - 2.5, 2.5, 5);
    });
  } else if(o.k === 'speaker'){   // caixa de retorno do palco, pulsando na batida
    var cg2 = g.createLinearGradient(x, y, x + w, y + h); cg2.addColorStop(0, '#3a3156'); cg2.addColorStop(1, '#16122a');
    g.fillStyle = cg2; obsRR(x, y, w, h, 5); g.fill();
    g.strokeStyle = '#5c4f8a'; g.lineWidth = 1.5; obsRR(x + .75, y + .75, w - 1.5, h - 1.5, 4.5); g.stroke();
    g.fillStyle = '#b9b3d6'; [[x, y], [x + w - 5, y], [x, y + h - 5], [x + w - 5, y + h - 5]].forEach(function(c){ obsRR(c[0], c[1], 5, 5, 1.5); g.fill(); });
    var pul = 1 + (Math.floor(frame / 8) % 2 ? .07 : 0), cx = x + w / 2, cy = y + h * .62;
    var wg = g.createRadialGradient(cx - 2, cy - 2, 1, cx, cy, 11 * pul); wg.addColorStop(0, '#6b5fa0'); wg.addColorStop(.6, '#2a2340'); wg.addColorStop(1, '#120f20');
    g.fillStyle = wg; g.beginPath(); g.arc(cx, cy, 11 * pul, 0, 7); g.fill();
    g.strokeStyle = 'rgba(255,111,181,.6)'; g.lineWidth = 1.4; g.beginPath(); g.arc(cx, cy, 12.5 * pul, 0, 7); g.stroke();
    g.fillStyle = '#9a8fd0'; g.beginPath(); g.arc(cx, cy, 3, 0, 7); g.fill();
    g.fillStyle = '#211b36'; g.beginPath(); g.arc(cx, y + h * .22, 4.5, 0, 7); g.fill(); g.fillStyle = '#8d84c2'; g.beginPath(); g.arc(cx, y + h * .22, 1.8, 0, 7); g.fill();
    g.fillStyle = Math.floor(frame / 10) % 2 ? '#b6ff3b' : '#4dd8ff'; g.shadowColor = g.fillStyle; g.shadowBlur = 6; g.fillRect(x + 7, y + h - 6, w - 14, 1.8); g.shadowBlur = 0;
  } else {   // lightsticks de verdade: cabo, tubo de luz e estrelinha no topo
    var c = o.pal;
    for(i = 0; i < 3; i++){
      var lx = x + i * 8 + 1, top = y + (i % 2) * 4, sw = Math.sin(frame * .15 + i) * .04;
      g.save(); g.translate(lx + 3, y + h); g.rotate(sw); g.translate(-(lx + 3), -(y + h));
      var hg = g.createLinearGradient(lx, 0, lx + 6, 0); hg.addColorStop(0, '#f6f3ff'); hg.addColorStop(1, '#b8b0d8');
      g.fillStyle = hg; obsRR(lx + .5, top + 19, 5, y + h - top - 19, 2); g.fill();
      g.fillStyle = '#2a2440'; g.fillRect(lx + .5, top + 23, 5, 2);
      g.shadowColor = c[i]; g.shadowBlur = 12;
      var tg = g.createLinearGradient(lx, 0, lx + 7, 0); tg.addColorStop(0, c[i]); tg.addColorStop(.5, '#ffffff'); tg.addColorStop(1, c[i]);
      g.fillStyle = tg; obsRR(lx - .5, top, 7, 20, 3.5); g.fill(); g.shadowBlur = 0;
      g.fillStyle = '#fff'; g.beginPath(); for(var q = 0; q < 10; q++){ var r2 = q % 2 ? 1.2 : 2.8, an = q * Math.PI / 5 - Math.PI / 2; g[q ? 'lineTo' : 'moveTo'](lx + 3 + Math.cos(an) * r2, top - 1.5 + Math.sin(an) * r2); } g.closePath(); g.fill();
      g.restore();
    }
  }
  g.restore();
}
function s2Rand(){
  if(!s2DailyMode) return Math.random();
  var t = (s2DailySeed += 0x6D2B79F5) >>> 0;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function s2Rnd(a, b){ return a + s2Rand() * (b - a); }
function s2CosRand(){
  if(!s2DailyMode) return Math.random();
  var t=(s2DailyCosmeticSeed+=0x6D2B79F5)>>>0;
  t=Math.imul(t^(t>>>15),t|1);
  t^=t+Math.imul(t^(t>>>7),t|61);
  return ((t^(t>>>14))>>>0)/4294967296;
}
function s2CosRnd(a,b){return a+s2CosRand()*(b-a);}
// Gerador de obstáculos específicos de cada cenário + cartas (incluindo "Coro") + plataformas no Dome
function s2SpawnStage(){
  var st = S2_STAGES[s2StageIdx] || S2_STAGES[0];
  var id = st.id;
  var t = s2Rand(), o;

  // Se estiver no Desafio de Fim de Cenário (5 obstáculos no ritmo da música)
  if(!crPratica && s2Challenge && s2Challenge.active && s2Challenge.left > 0){
    var isHigh = (s2Challenge.left % 2 === 0) && (id === 'estudio' || id === 'geral' || id === 'backstage' || id === 'dome');
    if(isHigh){
      o = { k: id === 'estudio' ? 'refletor' : 'fita', w: 42, h: 46, high: true, x: nextX, y: GY - 64, challenge: true };
    } else {
      o = { k: id === 'ensaio' ? 'cone' : id === 'backstage' ? 'case' : id === 'geral' ? 'caixaluz' : 'speaker', w: 32, h: 40, x: nextX, y: GY - 40, challenge: true };
    }
    obs.push(o);
    items.push({ k:'star', x: o.x + o.w/2 - 9, y: isHigh ? GY - 24 : GY - o.h - 42, w:18, h:18, got:false, ct:'plain' });
    s2Challenge.left--;
    nextX += Math.max(155, sp * 26);
    if(s2Challenge.left === 0){
      // Cortina fecha logo após o 5º obstáculo do desafio
      s2Challenge.finishX = o.x + o.w + 40;
    }
    return;
  }

  // Obstáculos por cenário conforme a tabela aprovada
  if(id === 'rua'){
    if(t < 0.4) o = { k:'cable', w:56, h:12 };
    else if(t < 0.75) o = { k:'speaker', w:36, h:48 };
    else {
      var q2 = s2Rand();
      o = { k:'stick', w:24, h:42, pal: q2<.65?['#9b30d9','#b6ff3b','#4169e1']:q2<.85?['#4169e1','#ffe14d','#34d399']:['#ff6fb5','#4dd8ff','#ffe14d'] };
    }
    o.x = nextX; o.y = GY - o.h;
  } else if(id === 'ensaio'){
    // Sala de ensaio: Colchonetes, cones, garrafinhas de água
    if(t < 0.38) o = { k:'colchonete', w:54, h:16, x:nextX, y:GY-16 };
    else if(t < 0.74) o = { k:'cone', w:28, h:38, x:nextX, y:GY-38 };
    else o = { k:'garrafinha', w:24, h:34, x:nextX, y:GY-34 };
  } else if(id === 'backstage'){
    // Backstage do teatro: Araras de figurino, cases de equipamento, carrinho de maquiagem (anda!)
    if(t < 0.36) o = { k:'arara', w:40, h:50, x:nextX, y:GY-50 };
    else if(t < 0.70) o = { k:'case', w:42, h:38, x:nextX, y:GY-38 };
    else o = { k:'carrinho', w:44, h:40, x:nextX, y:GY-40, mv:-1.15, warn:true };
  } else if(id === 'estudio'){
    // Estúdio de TV: Câmera em trilho (anda!), cabos no chão, refletor baixo (exige abaixar!)
    if(t < 0.34) o = { k:'cable', w:56, h:12, x:nextX, y:GY-12 };
    else if(t < 0.68) o = { k:'camtrilho', w:40, h:44, x:nextX, y:GY-44, mv:-1.35, warn:true };
    else o = { k:'refletor', w:46, h:46, x:nextX, y:GY-72, high:true };
  } else if(id === 'festival'){
    // Festival de verão: Lanternas caídas, baldes de peixinho, taiko
    if(t < 0.35) o = { k:'lanterna', w:34, h:34, x:nextX, y:GY-34 };
    else if(t < 0.68) o = { k:'balde', w:36, h:28, x:nextX, y:GY-28 };
    else o = { k:'taiko', w:44, h:46, x:nextX, y:GY-46 };
  } else if(id === 'aeroporto'){
    // Aeroporto da turnê: Malas, esteira (empurra!), fãs com placas
    if(t < 0.36) o = { k:'mala', w:34, h:42, x:nextX, y:GY-42 };
    else if(t < 0.68) o = { k:'esteira', w:64, h:14, x:nextX, y:GY-14, push:true };
    else o = { k:'faplaca', w:32, h:46, x:nextX, y:GY-46 };
  } else if(id === 'geral'){
    // Ensaio geral: Escadas de equipe, caixas de luz, fitas de marcação (no chão ou suspensas para abaixar)
    if(t < 0.35) o = { k:'escada', w:34, h:52, x:nextX, y:GY-52 };
    else if(t < 0.70) o = { k:'caixaluz', w:40, h:38, x:nextX, y:GY-38 };
    else {
      var highFita = s2Rand() < 0.55;
      o = { k:'fita', w:48, h: highFita ? 44 : 12, x:nextX, y: highFita ? GY-70 : GY-12, high: highFita };
    }
  } else {
    // Dome do grande show: Caixas de retorno, canhões de luz/laser, fitas suspensas + Plataformas de 2 alturas!
    if(t < 0.36) o = { k:'speaker', w:36, h:48, x:nextX, y:GY-48 };
    else if(t < 0.72){
      var q3 = s2Rand();
      o = { k:'stick', w:24, h:42, x:nextX, y:GY-42, pal: q3<.5?['#9b30d9','#b6ff3b','#4169e1']:['#ff6fb5','#4dd8ff','#ffe14d'] };
    } else {
      o = { k:'fita', w:48, h:44, x:nextX, y:GY-70, high:true };
    }
    // No Dome, gera plataforma superior (2ª altura) com estrelas que valem mais!
    if(s2Rand() < 0.55){
      var pw2 = 150 + Math.floor(s2Rand() * 90);
      var px2 = nextX + 40;
      var py2 = GY - 82;
      s2Platforms.push({ x:px2, y:py2, w:pw2, h:10 });
      for(var si2 = 0; si2 < 4; si2++){
        items.push({
          k:'star',
          x: px2 + 22 + si2 * 34,
          y: py2 - 26,
          w:18, h:18, got:false, ct:'plain',
          upper:true // estrela do 2º andar vale 2x!
        });
      }
    }
  }
  obs.push(o);

  // Estrelas e Cartas (incluindo a nova carta "Coro"!)
  var r = s2Rand();
  if(r < 0.75){
    var n = 3, cx = o.x + o.w / 2;
    var cd = s2Rand() < 0.42 && (frame - lastCard > 1350);
    var q = s2Rand();
    // Sorteia entre plain, fever, ima e a nova carta 'coro'!
    var cty = q < 0.28 ? 'plain' : q < 0.54 ? 'fever' : q < 0.78 ? 'ima' : 'coro';
    if(cd) lastCard = frame;
    for(var i = 0; i < n; i++){
      var u = (i - 1) / 1;
      var starY = o.high ? (GY - 24) : (GY - o.h - 34 - (1 - u * u) * 32);
      items.push({
        k: (cd && i === 1) ? 'card' : 'star',
        x: cx + u * 46 - 8,
        y: starY,
        w: 18, h: 18, got: false, ct: cty
      });
    }
  }

  // Corredor de fãs (fila de fãs na beira do palco para dar high-five!)
  if(score >= s2NextFanRow && s2Rand() < 0.45){
    s2NextFanRow = score + 550 + Math.floor(s2Rand() * 450);
    var fx0 = o.x + o.w + 95;
    for(var fk = 0; fk < 5; fk++){
      s2FanRows.push({
        x: fx0 + fk * 28,
        y: GY - 28,
        w: 20, h: 28,
        hi5: false,
        cor: ['#ff6fb5','#b6ff3b','#4169e1','#a678ff','#ffe14d'][fk % 5]
      });
    }
  }

  var gap = sp * 40 + s2Rnd(110, 330);
  if(s2Rand() < 0.25) gap += s2Rnd(180, 440);
  nextX += gap;
}
function s2Plateia(x0, gap){
  if(score < 450 || s2CosRand() >= (score < 5000 ? 0.30 + ((score - 450) / 4550) * 0.45 : 0.90)) return;
  var cores = ['#9b30d9', '#b6ff3b', '#4169e1']; if(typeof sel !== 'undefined' && sel === 3 && typeof CU !== 'undefined') cores.push(CU.hair);
  var grupos = score >= 10000 ? 3 : score >= 5000 ? 2 : 1, mn = score >= 10000 ? 3 : 1, mx = score >= 10000 ? 8 : score >= 5000 ? 5 : score >= 2500 ? 3 : 2, esp = score >= 10000 ? 20 : score >= 5000 ? 26 : 34;
  for(var fg = 0; fg < grupos; fg++){
    var n = mn + Math.floor(s2CosRand() * (mx - mn + 1)), gx = x0 + s2CosRnd(10, Math.max(110, gap - 120));
    for(var fi = 0; fi < n; fi++) fans.push({ x: gx + fi * esp + s2CosRnd(-4, 4), y: GY - 15 - s2CosRnd(0, 7), color: cores[Math.floor(s2CosRand() * cores.length)], offset: s2CosRand() * 10 });
  }
}
function s2ObsNovo(o){
  g.save();
  // Obstáculos suspensos projetam sombra no piso, nunca uma base falsa na altura de colisão.
  if(o.high){g.fillStyle='rgba(37,19,66,.15)';g.beginPath();g.ellipse(o.x+o.w/2,GY+1,o.w*.52,2.5,0,0,7);g.fill();}
  // Destaque musical se for obstáculo do Desafio de Fim de Cenário
  if(o.challenge){
    g.strokeStyle = '#ffe14d';
    g.lineWidth = 2;
    g.strokeRect(o.x - 2, o.y - 2, o.w + 4, o.h + 4);
    g.font = '10px sans-serif';
    g.fillStyle = '#ffe14d';
    g.fillText('♪', o.x + o.w/2 - 3, o.y - 6);
  }
  // Seta de aviso para obstáculos que andam (carrinho de maquiagem e câmera em trilho)
  if(o.warn && o.x > P.x){
    var calmo=typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var pulse = calmo ? .85 : 0.55 + 0.45 * Math.sin(frame * 0.25);
    // A silhueta permanece legível contra o palco claro ou escuro.
    var avisoX = o.x - 11, avisoY = o.y + o.h / 2;
    g.fillStyle = '#482342';
    g.beginPath(); g.roundRect(avisoX-7,avisoY-7,14,14,4); g.fill();
    g.strokeStyle = '#fff0ca'; g.lineWidth = 1; g.stroke();
    g.fillStyle = '#ffe6a2'; g.beginPath();
    g.moveTo(avisoX-4,avisoY); g.lineTo(avisoX+3,avisoY-4);
    g.lineTo(avisoX+3,avisoY+4); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,175,121,' + pulse + ')';
    g.fillRect(avisoX+9,avisoY-3,2,6);
  }

  if(o.k === 'cable'){
    g.fillStyle = '#222'; g.fillRect(o.x, o.y + 4, o.w, 6);
    g.fillStyle = '#ffd23f'; g.fillRect(o.x + 6, o.y + 2, 10, 10); g.fillRect(o.x + o.w - 16, o.y + 2, 10, 10);
  } else if(o.k === 'speaker'){
    g.fillStyle = '#111827'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = '#5a6b9a'; g.lineWidth = 2; g.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
    g.fillStyle = '#3a4a7a'; g.beginPath(); g.arc(o.x + o.w/2, o.y + 17, 9, 0, 7); g.fill();
    g.beginPath(); g.arc(o.x + o.w/2, o.y + 36, 5, 0, 7); g.fill();
  } else if(o.k === 'stick'){
    var c = o.pal || ['#9b30d9','#b6ff3b','#4169e1'];
    for(var i = 0; i < 3; i++){
      var lx = o.x + i * 9 + 2;
      g.fillStyle = '#ddd'; g.fillRect(lx, o.y + 16, 5, o.h - 16);
      g.fillStyle = c[i]; g.shadowColor = c[i]; g.shadowBlur = 10;
      g.fillRect(lx - 1, o.y + (i % 2) * 4, 7, 18); g.shadowBlur = 0;
    }
  } else if(o.k === 'colchonete'){
    // Colchonete dobrado azul/rosa de sala de ensaio
    g.fillStyle = '#38bdf8'; g.fillRect(o.x, o.y + 4, o.w, o.h - 4);
    g.fillStyle = '#0284c7'; g.fillRect(o.x, o.y + 9, o.w, 3);
    g.fillStyle = '#f472b6'; g.fillRect(o.x + 6, o.y, o.w - 12, 6);
  } else if(o.k === 'cone'){
    // Cone de marcação de coreografia
    g.fillStyle = '#f97316';
    g.beginPath(); g.moveTo(o.x + o.w/2, o.y); g.lineTo(o.x + o.w - 2, o.y + o.h); g.lineTo(o.x + 2, o.y + o.h); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.fillRect(o.x + 7, o.y + 14, o.w - 14, 5);
    g.fillStyle = '#ea580c'; g.fillRect(o.x, o.y + o.h - 4, o.w, 4);
  } else if(o.k === 'garrafinha'){
    // Kit de garrafinhas de água das Idols
    for(var gi = 0; gi < 2; gi++){
      var gx = o.x + gi * 12;
      g.fillStyle = '#bae6fd'; g.fillRect(gx + 2, o.y + 8, 9, o.h - 8);
      g.fillStyle = '#38bdf8'; g.fillRect(gx + 2, o.y + 16, 9, 8);
      g.fillStyle = gi === 0 ? '#ff6fb5' : '#a678ff'; g.fillRect(gx + 4, o.y + 2, 5, 6);
    }
  } else if(o.k === 'arara'){
    // Arara de figurino cintilante
    g.strokeStyle = '#cbd5e1'; g.lineWidth = 2.5;
    g.strokeRect(o.x + 4, o.y + 4, o.w - 8, o.h - 4);
    var cols = ['#ff6fb5','#9b30d9','#4169e1'];
    for(var ai = 0; ai < 3; ai++){
      g.fillStyle = cols[ai];
      g.beginPath(); g.moveTo(o.x + 8 + ai * 10, o.y + 8); g.lineTo(o.x + 16 + ai * 10, o.y + 8); g.lineTo(o.x + 18 + ai * 10, o.y + 36); g.lineTo(o.x + 6 + ai * 10, o.y + 36); g.closePath(); g.fill();
    }
  } else if(o.k === 'case'){
    // Flight case de equipamento de palco
    g.fillStyle = '#1e293b'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = '#94a3b8'; g.lineWidth = 2; g.strokeRect(o.x + 1, o.y + 1, o.w - 2, o.h - 2);
    g.fillStyle = '#eab308'; g.fillRect(o.x + 12, o.y + 14, o.w - 24, 8);
  } else if(o.k === 'carrinho'){
    // Carrinho de maquiagem com rodinhas
    g.fillStyle = '#f472b6'; g.fillRect(o.x + 2, o.y + 10, o.w - 4, o.h - 16);
    g.fillStyle = '#fbcfe8'; g.fillRect(o.x + 4, o.y + 14, o.w - 8, 7);
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 2, 6, 8);
    g.fillStyle = '#a855f7'; g.fillRect(o.x + 18, o.y + 4, 8, 6);
    g.fillStyle = '#111827';
    g.beginPath(); g.arc(o.x + 9, o.y + o.h - 3, 4, 0, 7); g.arc(o.x + o.w - 9, o.y + o.h - 3, 4, 0, 7); g.fill();
  } else if(o.k === 'camtrilho'){
    // Câmera de TV em trilho
    g.fillStyle = '#334155'; g.fillRect(o.x + 8, o.y + 16, o.w - 16, o.h - 20);
    g.fillStyle = '#0f172a'; g.fillRect(o.x + 4, o.y + 4, o.w - 8, 14);
    g.fillStyle = '#38bdf8'; g.beginPath(); g.arc(o.x + 6, o.y + 11, 5, 0, 7); g.fill();
    g.fillStyle = '#ef4444'; g.beginPath(); g.arc(o.x + o.w - 8, o.y + 7, 2.5, 0, 7); g.fill();
  } else if(o.k === 'refletor'){
    // Refletor suspenso baixo (passar por baixo deslizando ▼)
    g.strokeStyle = '#64748b'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(o.x + o.w/2, 0); g.lineTo(o.x + o.w/2, o.y + 6); g.stroke();
    g.fillStyle = '#1e293b'; g.fillRect(o.x + 4, o.y, o.w - 8, 22);
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 18, o.w - 16, 6);
    var lg = g.createLinearGradient(0, o.y + 22, 0, GY);
    lg.addColorStop(0, 'rgba(253,224,71,.45)'); lg.addColorStop(1, 'rgba(253,224,71,0)');
    g.fillStyle = lg; g.beginPath(); g.moveTo(o.x + 8, o.y + 24); g.lineTo(o.x + o.w - 8, o.y + 24); g.lineTo(o.x + o.w + 8, GY); g.lineTo(o.x - 8, GY); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.font = '800 10px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
    g.fillText('▼', o.x + o.w/2, o.y + 14);
  } else if(o.k === 'lanterna'){
    // Lanterna japonesa chōchin
    g.fillStyle = '#ef4444'; g.beginPath(); g.ellipse(o.x + o.w/2, o.y + o.h/2, o.w/2, o.h/2 - 2, 0, 0, 7); g.fill();
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 2, o.w - 16, 4); g.fillRect(o.x + 8, o.y + o.h - 6, o.w - 16, 4);
  } else if(o.k === 'balde'){
    // Balde de festival (kingyo sukui)
    g.fillStyle = '#f97316'; g.fillRect(o.x + 2, o.y + 6, o.w - 4, o.h - 6);
    g.fillStyle = '#38bdf8'; g.fillRect(o.x + 5, o.y + 8, o.w - 10, 6);
  } else if(o.k === 'taiko'){
    // Tambor Taiko
    g.fillStyle = '#78350f'; g.fillRect(o.x + 6, o.y + 28, o.w - 12, o.h - 28);
    g.fillStyle = '#dc2626'; g.beginPath(); g.arc(o.x + o.w/2, o.y + 20, 18, 0, 7); g.fill();
    g.fillStyle = '#fef3c7'; g.beginPath(); g.arc(o.x + o.w/2, o.y + 20, 13, 0, 7); g.fill();
  } else if(o.k === 'mala'){
    // Mala de turnê
    g.fillStyle = '#ec4899'; g.fillRect(o.x + 4, o.y + 10, o.w - 8, o.h - 14);
    g.strokeStyle = '#94a3b8'; g.lineWidth = 2; g.strokeRect(o.x + 11, o.y + 2, o.w - 22, 8);
    g.fillStyle = '#fde047'; g.fillRect(o.x + 8, o.y + 18, 8, 6);
  } else if(o.k === 'esteira'){
    // Esteira de bagagem que empurra
    g.fillStyle = '#334155'; g.fillRect(o.x, o.y + 2, o.w, o.h - 2);
    g.fillStyle = '#38bdf8';
    for(var ei = 0; ei < 3; ei++){
      var ex = o.x + 10 + ((ei * 20 - frame * 1.5) % (o.w - 16) + (o.w - 16)) % (o.w - 16);
      g.fillRect(ex, o.y + 5, 6, 4);
    }
  } else if(o.k === 'faplaca'){
    // Fã com cartaz de apoio
    g.fillStyle = '#ff6fb5'; g.fillRect(o.x + 2, o.y, o.w - 4, 18);
    g.fillStyle = '#fff'; g.font = '800 8px sans-serif'; g.textAlign = 'center'; g.fillText('OSHI💖', o.x + o.w/2, o.y + 12);
    g.fillStyle = '#334155'; g.fillRect(o.x + 10, o.y + 18, 12, o.h - 18);
  } else if(o.k === 'escada'){
    // Escada de equipe técnica (Ensaio Geral)
    g.strokeStyle = '#fbbf24'; g.lineWidth = 2.5;
    g.beginPath();
    g.moveTo(o.x + 4, o.y + o.h); g.lineTo(o.x + o.w/2 - 2, o.y);
    g.moveTo(o.x + o.w - 4, o.y + o.h); g.lineTo(o.x + o.w/2 + 2, o.y);
    for(var si = 10; si < o.h; si += 11){
      g.moveTo(o.x + 6, o.y + si); g.lineTo(o.x + o.w - 6, o.y + si);
    }
    g.stroke();
  } else if(o.k === 'caixaluz'){
    // Caixa de luz / equipamento de iluminação
    g.fillStyle = '#1f2937'; g.fillRect(o.x, o.y, o.w, o.h);
    g.strokeStyle = '#fde047'; g.lineWidth = 2; g.strokeRect(o.x + 2, o.y + 2, o.w - 4, o.h - 4);
    g.fillStyle = '#fde047'; g.beginPath(); g.arc(o.x + o.w/2, o.y + o.h/2, 8, 0, 7); g.fill();
  } else if(o.k === 'fita'){
    // Fita de marcação (suspensa para deslizar ▼ ou no chão para pular)
    if(o.high){
      g.fillStyle = '#fde047'; g.fillRect(o.x, o.y + 10, o.w, 14);
      g.fillStyle = '#111827';
      for(var fi = 0; fi < o.w; fi += 12) g.fillRect(o.x + fi, o.y + 10, Math.min(6,o.w-fi), 14);
      g.fillStyle = '#fff'; g.font = '800 10px "M PLUS Rounded 1c",sans-serif'; g.textAlign = 'center';
      g.fillText('▼', o.x + o.w/2, o.y + 8);
    } else {
      g.fillStyle = '#fde047'; g.fillRect(o.x, o.y + 4, o.w, 6);
      g.fillStyle = '#ef4444'; g.fillRect(o.x + 4, o.y + 2, 8, 8); g.fillRect(o.x + o.w - 12, o.y + 2, 8, 8);
    }
  }
  g.restore();
}
// Center Run T2: only visual layers. Coordinates and simulation stay in the game.
function s2ArtActive(){ return s2StageIdx > 0; }
function s2ArtRect(x,y,w,h,c){g.fillStyle=c;g.fillRect(x,y,w,h);}
function s2ArtLine(x,y,xx,yy,c,w){g.strokeStyle=c;g.lineWidth=w||1;g.beginPath();g.moveTo(x,y);g.lineTo(xx,yy);g.stroke();}
function s2ArtOval(x,y,rx,ry,c){g.fillStyle=c;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
function s2ArtPoly(points,c){g.fillStyle=c;g.beginPath();points.forEach(function(p,i){if(i)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1]);});g.closePath();g.fill();}
function s2ArtGradient(y,h,a,b){var v=g.createLinearGradient(0,y,0,y+h);v.addColorStop(0,a);v.addColorStop(1,b);g.fillStyle=v;g.fillRect(0,y,W,h);}
function s2ArtRepeat(step,speed,fn){var offset=dist*speed;var first=Math.floor(offset/step);for(var n=first;n*step-offset<W+step;n++)fn(n*step-offset,n);}
function s2ArtBeam(x,y,tx,ty,width,c){s2ArtPoly([[x-4,y],[x+4,y],[tx+width,ty],[tx-width,ty]],c);}
function s2ArtStar(x,y,r,c){var p=[];for(var i=0;i<10;i++){var a=i*Math.PI/5-Math.PI/2,rr=i%2?r*.45:r;p.push([x+Math.cos(a)*rr,y+Math.sin(a)*rr]);}s2ArtPoly(p,c);}
function s2ArtTruss(y,c){s2ArtLine(0,y,W,y,c,2);s2ArtLine(0,y+12,W,y+12,c,2);for(var x=0;x<W;x+=32){s2ArtLine(x,y,x+32,y+12,c);s2ArtLine(x,y+12,x+32,y,c);}}
// Small material details belong to existing architecture, never the running lane.
function s2ArtRound(x,y,w,h,r,c){g.fillStyle=c;g.beginPath();g.roundRect(x,y,w,h,r);g.fill();}
function s2ArtGlow(x,y,r,c){var v=g.createRadialGradient(x,y,0,x,y,r);v.addColorStop(0,c);v.addColorStop(1,'rgba(255,238,213,0)');g.fillStyle=v;g.fillRect(x-r,y-r,r*2,r*2);}
// Local light/material helpers, with bounded gradients and no canvas filters.
function s2ArtShade(x,y,w,h,a,b,horizontal,r){
  if(w<=0||h<=0)return;
  var v=g.createLinearGradient(x,y,horizontal?x+w:x,horizontal?y:y+h);
  v.addColorStop(0,a);v.addColorStop(1,b);
  s2ArtRound(x,y,w,h,r||0,v);
}
function s2ArtContact(x,y,rx,ry,alpha){
  g.save();g.translate(x,y);g.scale(rx,ry);
  var v=g.createRadialGradient(0,0,0,0,0,1);v.addColorStop(0,'rgba(20,14,36,'+alpha+')');v.addColorStop(1,'rgba(20,14,36,0)');
  g.fillStyle=v;g.fillRect(-1,-1,2,2);g.restore();
}
function s2ArtWallWash(x,y,w,h,c){
  // Elliptical radial falloff avoids rectangular edges on illuminated walls.
  g.save();g.translate(x,y+h*.38);g.scale(w*.65,h*.8);
  var v=g.createRadialGradient(0,0,0,0,0,1);v.addColorStop(0,c);v.addColorStop(1,'rgba(255,238,213,0)');
  g.fillStyle=v;g.fillRect(-1,-1,2,2);g.restore();
}
function s2ArtBow(x,y,r,c){
  s2ArtPoly([[x,y],[x-r,y-r*.7],[x-r*.9,y+r*.65]],c);
  s2ArtPoly([[x,y],[x+r,y-r*.7],[x+r*.9,y+r*.65]],c);
  s2ArtOval(x,y,r*.24,r*.28,'#f6dce7');
}
function s2ArtPetal(x,y,r,c){for(var j=0;j<5;j++){var a=j*Math.PI*.4-Math.PI/2;s2ArtOval(x+Math.cos(a)*r*.65,y+Math.sin(a)*r*.65,r*.45,r*.45,c);}s2ArtOval(x,y,r*.2,r*.2,'#f8e9bc');}
// Reconstructed from the owner's visual reference; all actors and gameplay remain original.
function s2RefPanel(x,y,w,h,a,b,r){s2ArtShade(x,y,w,h,a,b,false,r||0);}
function s2RefPlane(x,y,scale){
  g.save();g.translate(x,y);g.scale(scale,scale);
  s2ArtContact(0,14,91,6,.13);
  s2ArtPoly([[-9,-4],[-36,-30],[-23,-31],[23,-3]],'#e8edf5');
  s2ArtPoly([[-62,-3],[-76,-34],[-64,-34],[-43,-4]],'#e7e6ef');
  s2ArtPoly([[-70,-29],[-76,-34],[-64,-34],[-59,-28]],'#ed8bc3');
  s2ArtOval(0,0,88,11,'#f8fbff');
  s2ArtShade(-78,2,155,5,'rgba(145,161,185,0)','rgba(145,161,185,.28)',false,2);
  s2ArtLine(-65,2,76,2,'#dc80b4',2.5);
  for(var j=0;j<21;j++)s2ArtRound(-62+j*6,-5,3,3,1,'#8392ad');
  s2ArtPoly([[0,1],[-26,23],[-7,25],[35,5]],'#e7edf7');
  s2ArtOval(16,12,9,4,'#c0cbdc');s2ArtOval(20,12,5,3,'#8596b1');
  s2ArtPoly([[70,-6],[82,-3],[76,-1],[69,-2]],'#8096b4');
  g.restore();
}
function s2RefDisplay(x,y,w,h,dome){
  var r=dome?9:h*.5;
  s2ArtContact(x+w*.5,y+h+10,w*.57,14,.23);
  s2ArtRound(x-3,y-3,w+6,h+6,r+2,dome?'#9db640':'#c9c7f8');
  s2ArtRound(x-1,y-1,w+2,h+2,r+1,'#24213f');
  g.save();g.beginPath();g.roundRect(x,y,w,h,r);g.clip();
  var v=g.createLinearGradient(x,y,x+w,y+h);v.addColorStop(0,dome?'#8129a8':'#6b46c2');v.addColorStop(.48,dome?'#cc359b':'#b74ad9');v.addColorStop(1,'#2499d7');g.fillStyle=v;g.fillRect(x,y,w,h);
  if(dome){
    for(var i=0;i<24;i++){var a=i*Math.PI/12+frame*.0006;var rr=w;var da=Math.PI/30;s2ArtPoly([[x+w*.5,y+h*.5],[x+w*.5+Math.cos(a)*rr,y+h*.5+Math.sin(a)*rr],[x+w*.5+Math.cos(a+da)*rr,y+h*.5+Math.sin(a+da)*rr]],i%2?'rgba(255,155,174,.09)':'rgba(114,68,218,.08)');}
    for(var j=1;j<5;j++){g.strokeStyle='rgba(255,199,229,.13)';g.lineWidth=1;g.beginPath();g.ellipse(x+w*.5,y+h*.5,h*.15+j*h*.19,h*.15+j*h*.19,0,0,Math.PI*2);g.stroke();}
    s2ArtGlow(x+w*.5,y+h*.5,h*.49,'rgba(255,193,123,.2)');
    s2ArtStar(x+w*.5,y+h*.48,Math.min(25,h*.19),'#ffe566');
  }else{
    for(var k=-2;k<12;k++)s2ArtPoly([[x+k*w/8,y],[x+(k+1)*w/8,y],[x+(k-2)*w/8,y+h],[x+(k-3)*w/8,y+h]],k%2?'rgba(255,201,253,.13)':'rgba(69,48,144,.12)');
    s2ArtOval(x+w*.5,y+h*.5,h*.28,h*.28,'rgba(240,177,255,.16)');
  }
  s2ArtShade(x,y,w,h,'rgba(255,255,255,.13)','rgba(18,11,49,.1)',false);
  for(var sy=y+3;sy<y+h;sy+=5)s2ArtLine(x,sy,x+w,sy,'rgba(241,217,255,.035)');
  g.restore();
  s2ArtLine(x+r,y-1,x+w-r,y-1,dome?'#dcdf74':'#eee1ff');
}
function s2DrawSceneryBg(){
  var id=S2_STAGES[s2StageIdx].id;if(id==='rua')return;
  var rear=GY-12,i,x;
  g.save();g.lineCap='round';g.lineJoin='round';
  if(id==='ensaio'){
    s2ArtGradient(0,GY,'#f2e9fc','#d4eaf5');
    s2RefPanel(0,0,W,20,'#f5e7ff','#d4b3e3');
    s2ArtLine(0,23,W,23,'#aa7ac7',2);s2ArtLine(0,26,W,26,'#fff2ff',2);
    s2ArtRepeat(290,.22,function(x){
      s2ArtRound(x+1,30,286,rear-28,3,'#c4b3dc');
      s2RefPanel(x+4,33,280,rear-34,'#eefaff','#cce7f2',2);
      s2ArtLine(x+5,35,x+282,35,'#fff',1);
      s2ArtPoly([[x+212,33],[x+230,33],[x+172,rear-4],[x+152,rear-4]],'rgba(255,255,255,.35)');
      s2ArtPoly([[x+241,33],[x+247,33],[x+195,rear-4],[x+189,rear-4]],'rgba(255,255,255,.17)');
      s2ArtShade(x+4,33,280,10,'rgba(115,113,161,.12)','rgba(115,113,161,0)',false);
      s2ArtRound(x+62,5,155,4,2,'#fff9ef');
    });
    s2ArtLine(0,GY-53,W,GY-53,'rgba(87,61,112,.13)',4);
    s2ArtRepeat(150,.22,function(x){s2ArtLine(x+70,GY-56,x+70,GY-45,'#ba9d7e',3);s2ArtLine(x+72,GY-56,x+72,GY-47,'#f4d9b2');});
    s2ArtLine(0,GY-58,W,GY-58,'#b28a60',5);s2ArtLine(0,GY-60,W,GY-60,'#ebce9e',2);
    s2RefPanel(0,GY-12,W,9,'#675078','#372347');
  }else if(id==='backstage'){
    s2ArtGradient(0,GY,'#1a102b','#4d235b');
    s2ArtRepeat(310,.2,function(x,n){
      s2ArtRect(x+5,18,6,GY-27,'#251333');s2ArtLine(x+12,18,x+12,GY-17,'rgba(171,94,169,.18)');
      s2ArtWallWash(x+149,20,230,GY-40,'rgba(249,174,188,.105)');
      s2ArtGlow(x+149,18,24,'rgba(255,220,166,.2)');s2ArtOval(x+149,18,2.5,2.5,'#ffe7b2');
      var doorY=GY-124;
      s2ArtRect(x+28,doorY+3,61,119,'rgba(13,6,23,.4)');
      s2RefPanel(x+23,doorY,60,122,'#d8a0d6','#a86ba9');
      s2RefPanel(x+27,doorY+4,52,116,'#63346d','#452455');
      s2ArtLine(x+30,doorY+7,x+75,doorY+7,'rgba(244,180,229,.45)');
      s2ArtLine(x+30,doorY+59,x+75,doorY+59,'#875487');
      s2ArtStar(x+53,doorY+26,7,'#f7d668');s2ArtOval(x+71,doorY+83,2,2,'#eccc88');
      if(n%2===0){
        var vx=x+127,vy=GY-106;
        s2ArtRound(vx-3,vy-3,84,61,4,'rgba(24,11,30,.4)');s2RefPanel(vx,vy,78,55,'#f9dea7','#bb8f70',5);
        s2RefPanel(vx+6,vy+6,66,43,'#ddf4ff','#a7d6e9',2);
        s2ArtPoly([[vx+20,vy+6],[vx+32,vy+6],[vx+14,vy+48],[vx+8,vy+48]],'rgba(255,255,255,.5)');
        for(i=0;i<6;i++){s2ArtOval(vx+7+i*13,vy+3,1.6,1.6,'#fff9d5');s2ArtOval(vx+7+i*13,vy+52,1.6,1.6,'#fff9d5');}
        s2ArtShade(vx+2,vy+61,75,12,'rgba(10,4,22,.4)','rgba(10,4,22,0)',false);
        s2ArtRound(vx-3,vy+58,85,5,2,'#c495bd');s2ArtLine(vx+8,vy+64,vx+8,GY-13,'#62336e',3);s2ArtLine(vx+70,vy+64,vx+70,GY-13,'#62336e',3);
        s2ArtRound(vx+24,GY-24,29,12,5,'#ca73b4');
      }else{
        var rx=x+124,ry=GY-99;
        s2ArtLine(rx,ry,rx+103,ry,'#d7c9e8',3);s2ArtLine(rx+6,ry,rx,GY-12,'#bca8d4',2);s2ArtLine(rx+97,ry,rx+103,GY-12,'#bca8d4',2);
        ['#ec8fcb','#90caef','#c4aff4','#f7d78d','#acdfbb'].forEach(function(c,j){var cx=rx+14+j*17;s2ArtLine(cx,ry+1,cx,ry+8,'#d8d1e8');s2ArtPoly([[cx-4,ry+7],[cx+4,ry+7],[cx+7,ry+44],[cx-7,ry+44]],c);s2ArtLine(cx+3,ry+10,cx+5,ry+42,'rgba(69,33,88,.19)');});
      }
    });
    s2RefPanel(0,GY-10,W,8,'#572f63','#23142f');s2ArtLine(0,GY-9,W,GY-9,'#b17fbe');
  }else if(id==='estudio'){
    s2ArtGradient(0,GY,'#101029','#202d52');
    s2ArtLine(0,13,W,13,'#6c668d',2);s2ArtLine(0,17,W,17,'#272138');
    var sw=Math.min(340,W*.66),sh=Math.min(138,sw*.45),sx=(W-sw)*.5,sy=Math.max(W<500?116:77,(GY-70-sh)*.5);
    for(i=0;i<3;i++){var fx=W*(.13+i*.37);s2ArtLine(fx,17,fx,51,'#45415b');s2ArtRect(fx-7,49,14,8,'#2d2745');s2ArtBeam(fx,57,fx+Math.sin(frame*.005+i)*16,GY-22,44,['rgba(169,135,229,.07)','rgba(132,180,234,.06)','rgba(235,141,209,.06)'][i]);}
    s2ArtLine(sx+sw*.24,17,sx+sw*.24,sy,'#68607d',1.5);s2ArtLine(sx+sw*.76,17,sx+sw*.76,sy,'#68607d',1.5);
    s2ArtWallWash(W*.5,sy-5,sw+70,sh+80,'rgba(138,91,231,.12)');s2RefDisplay(sx,sy,sw,sh,false);
    s2RefPanel(0,GY-8,W,8,'#172440','#11132b');
  }else if(id==='festival'){
    s2ArtGradient(0,GY,'#150c2e','#4a1b5a');
    for(i=0;i<18;i++)s2ArtOval((i*79+31)%W,30+(i*41)%Math.max(40,GY-160),.65,.65,'rgba(255,223,226,.25)');
    // Far silhouettes and one occasional stall keep the night open and readable.
    s2ArtRepeat(550,.12,function(x,n){
      var fy=GY-94;
      s2ArtPoly([[x-20,fy+10],[x+52,fy-14],[x+131,fy+10]],'#22132f');s2RefPanel(x-3,fy+10,118,84,'#281531','#1e1129');
      s2ArtRect(x+14,fy+35,13,8,'#786052');s2ArtRect(x+70,fy+40,12,8,'#6c5254');
    });
    s2ArtRepeat(620,.22,function(x,n){
      var bx=x+365,by=GY-103;
      s2ArtContact(bx+69,GY-10,83,9,.24);
      s2RefPanel(bx+5,by+8,126,85,'#82414b','#4a273d');s2RefPanel(bx+14,by+27,108,37,'#d79a53','#82523c');
      s2ArtPoly([[bx-5,by+12],[bx+15,by-3],[bx+122,by-3],[bx+141,by+12]],'#925141');
      for(i=0;i<7;i++)s2ArtRect(bx+2+i*19,by+12,18,12,i%2?'#f5d78e':'#d8934a');
      s2ArtShade(bx+14,by+24,108,10,'rgba(50,16,34,.35)','rgba(50,16,34,0)',false);
      s2ArtLine(bx+15,by+67,bx+123,by+67,'#e6a15e',4);
      ['#94b8dd','#e38ba3','#c2d58c','#bb8bcf'].forEach(function(c,j){s2ArtOval(bx+29+j*23,by+58,5.5,5.5,c);});
    });
    s2ArtRepeat(410,.18,function(x){
      s2ArtLine(x+20,50,x+20,GY-12,'#4e3540',5);
      g.strokeStyle='#a37683';g.lineWidth=1;g.beginPath();g.moveTo(x+20,61);g.quadraticCurveTo(x+225,82,x+430,61);g.stroke();
      for(i=0;i<8;i++){var xx=x+40+i*48,yy=63+Math.sin((20+i*48)/410*Math.PI)*9;s2ArtPoly([[xx,yy],[xx+10,yy+1],[xx+5,yy+11]],['#d4c98c','#d28eaf','#8cb6ca'][i%3]);}
      g.strokeStyle='#644555';g.beginPath();g.moveTo(x+20,112);g.quadraticCurveTo(x+225,136,x+430,112);g.stroke();
      for(i=0;i<6;i++){var lx=x+51+i*65,ly=116+Math.sin((31+i*65)/410*Math.PI)*10;s2ArtLine(lx,ly-2,lx,ly+6,'#81616b');s2ArtGlow(lx,ly+15,24,'rgba(255,174,110,.16)');s2ArtOval(lx,ly+15,6,9,i%3===1?'#f8dba6':'#de5e80');s2ArtOval(lx-1,ly+14,3,7,i%3===1?'#fff1c6':'#f58e9e');s2ArtRect(lx-3,ly+6,6,2,'#79504f');s2ArtRect(lx-3,ly+23,6,2,'#79504f');s2ArtLine(lx-5,ly+12,lx+5,ly+12,'rgba(143,66,65,.19)');}
    });
    s2RefPanel(0,GY-12,W,12,'#382135','#221628');
  }else if(id==='aeroporto'){
    s2ArtGradient(0,GY,'#63c4ef','#c4e8f4');
    s2ArtRepeat(430,.035,function(x){s2ArtOval(x+76,93,37,8,'rgba(245,252,255,.85)');s2ArtOval(x+99,90,22,9,'rgba(245,252,255,.85)');});
    var horizon=GY-133;
    s2RefPanel(0,horizon,W,97,'#a6b2c3','#75859e');s2ArtLine(0,horizon,W,horizon,'#d5e6ed',2);
    s2ArtRepeat(180,.05,function(x){s2ArtRect(x+15,horizon+51,89,3,'#eff3f5');});
    var px=W*.46-(dist*.045)%(W+400);if(px < -130)px+=W+400;
    s2RefPlane(px,horizon+44,.9);
    s2RefPlane(W+80-(frame*.2)%(W+620),65,.42);
    s2ArtRepeat(350,.18,function(x){
      s2ArtLine(x+155,22,x+155,GY-37,'rgba(100,143,173,.42)',2);
      s2ArtRect(x+310,22,17,GY-59,'rgba(80,127,156,.14)');s2ArtShade(x+300,22,19,GY-59,'#c7dce8','#f7fbfd',true);s2ArtRect(x+319,22,3,GY-59,'#b0c6d6');
      s2ArtPoly([[x+198,24],[x+224,24],[x+137,GY-39],[x+112,GY-39]],'rgba(255,255,255,.13)');
    });
    s2RefPanel(0,0,W,21,'#f4f8ff','#d5e2ed');s2ArtLine(0,23,W,23,'#a8becf',2);
    s2RefPanel(0,GY-37,W,29,'#edf2f8','#c7d5e3');
    s2ArtRepeat(500,.24,function(x){
      var yy=GY-28;
      s2ArtContact(x+337,GY-8,49,6,.13);
      for(i=0;i<3;i++){s2ArtRound(x+301+i*24,yy-5,21,14,4,'#efa3ce');s2ArtLine(x+304+i*24,yy-3,x+318+i*24,yy-3,'#ffd7ed');s2ArtRect(x+302+i*24,yy+9,20,3,'#d88db8');s2ArtLine(x+304+i*24,yy+12,x+304+i*24,GY-8,'#a2b4cc',2);}
      s2ArtLine(x+298,yy+13,x+373,yy+13,'#a8b8cc',2);
    });
    s2RefPanel(0,GY-8,W,8,'#1b415a','#11263b');
  }else if(id==='geral'||id==='dome'){
    var live=id==='dome';s2ArtGradient(0,GY,live?'#120a28':'#0b1423',live?'#3d1552':'#26394b');
    s2ArtTruss(19,live?'#51405f':'#626d80');
    if(live){
      var dw=Math.min(390,W*.7),dh=Math.min(128,dw*.4),dx=(W-dw)*.5,dy=W<500?112:57;
      g.strokeStyle='rgba(148,99,188,.24)';g.lineWidth=3;g.beginPath();g.moveTo(-30,GY-20);g.quadraticCurveTo(W*.5,-55,W+30,GY-20);g.stroke();
      s2ArtWallWash(W*.5,dy,dw+100,dh+85,'rgba(199,50,164,.12)');s2RefDisplay(dx,dy,dw,dh,true);
      for(var row=0;row<3;row++)s2ArtRepeat(17,.12+row*.025,function(x,n){var yy=GY-64+row*16+Math.sin(frame*.05+n)*2;var pal=['#c76aff','#b9ea55','#7a9df5','#f1b264'];s2ArtOval(x+4,yy+13,4,5,'#251630');s2ArtRect(x+9,yy,2,13,pal[((n+row)%4+4)%4]);});
    }else{
      for(var r=0;r<3;r++){
        var yy=GY-197+r*53;
        s2RefPanel(0,yy-7,W,45,'#25394d','#18283c');s2ArtLine(0,yy-7,W,yy-7,'#34475a');
        s2ArtRepeat(20,.06,function(x){s2ArtRound(x+3,yy,9,26,1,'#374b60');s2ArtLine(x+5,yy+2,x+5,yy+23,'#41566a');});
      }
      s2RefPanel(W*.12,GY-107,W*.3,89,'#101d2d','#0a1625');
      s2ArtRepeat(89,.04,function(x){s2ArtRect(x,GY-105,4,82,'#26394d');});
      s2ArtLine(W*.47,31,W*.47,GY-145,'#354152',5);
      for(i=0;i<5;i++)s2ArtRound(W*.47-4,42+i*17,9,12,1,'#17212f');
    }
    for(i=0;i<3;i++){var xx=W*(.13+i*.37);s2ArtRect(xx-6,31,12,7,'#31213b');s2ArtBeam(xx,38,xx+25*Math.sin(frame*.004+i),GY-18,live?47:32,live?['rgba(219,116,201,.075)','rgba(190,186,85,.065)','rgba(138,149,235,.07)'][i]:'rgba(197,217,241,.055)');}
    s2RefPanel(0,GY-10,W,10,live?'#352345':'#1c3144',live?'#21112f':'#112335');
  }
  g.restore();
}
function s2DrawSceneryFloor(){
  var id=S2_STAGES[s2StageIdx].id;
  var pal={ensaio:['#e6c08b','#c7a06e','#cb91e9'],backstage:['#672c78','#442450','#ff92d2'],estudio:['#10223e','#0b152d','#f1689f'],festival:['#3e2446','#251830','#e2ad55'],aeroporto:['#e7eff7','#c4d6e5','#4fc4ee'],geral:['#152638','#0b1524','#e4ce68'],dome:['#29113e','#130b24','#bde849']}[id];if(!pal)return;
  g.save();s2ArtGradient(GY,H-GY,pal[0],pal[1]);s2ArtRect(0,GY,W,2,pal[2]);
  s2ArtShade(0,GY+2,W,7,'rgba(16,9,29,.25)','rgba(16,9,29,0)',false);
  if(id==='ensaio'){
    for(var y=GY+18;y<H;y+=18){s2ArtLine(0,y,W,y,'rgba(127,85,43,.2)');s2ArtRepeat(180,1,function(x){s2ArtLine(x+(Math.floor(y/18)%2)*85,y,x+(Math.floor(y/18)%2)*85,y+18,'rgba(127,85,43,.17)');});}
    s2ArtShade(0,GY+3,W,H-GY-3,'rgba(255,237,197,.12)','rgba(255,237,197,0)',false);
  }else if(id==='backstage'){
    s2ArtLine(0,H-23,W,H-23,'#b08b54');s2ArtShade(0,GY+3,W,19,'rgba(248,133,211,.1)','rgba(248,133,211,0)',false);
  }else if(id==='festival'){
    for(var row=0;row<2;row++)s2ArtRepeat(70,1,function(x){s2ArtRound(x+row*32,GY+12+row*23,57,12,5,row?'#5a3a5d':'#70516d');s2ArtLine(x+5+row*32,GY+13+row*23,x+48+row*32,GY+13+row*23,'rgba(185,146,167,.15)');});
  }else if(id==='aeroporto'){
    s2ArtLine(0,GY+36,W,GY+36,'#88b7d1');s2ArtRepeat(83,.8,function(x){s2ArtLine(x,GY+3,x,H,'#afc8d9');});
    s2ArtRepeat(350,.18,function(x){s2ArtPoly([[x+198,GY+4],[x+224,GY+4],[x+153,H],[x+125,H]],'rgba(255,255,255,.2)');});
  }else if(id==='dome'){
    for(var yy=GY+13;yy<H;yy+=14)s2ArtLine(0,yy,W,yy,'rgba(169,99,205,.25)');
    s2ArtRepeat(75,1,function(x){s2ArtLine(x,GY+3,x+(x-W*.5)*.1,H,'rgba(159,87,190,.22)');});
    s2ArtShade(0,GY+3,W,18,'rgba(182,236,71,.1)','rgba(182,236,71,0)',false);
  }else if(id==='estudio'){
    s2ArtRepeat(190,.4,function(x){s2ArtPoly([[x+25,GY+31],[x+49,GY+31],[x+42,GY+36],[x+18,GY+36]],'#28628d');});
  }
  if(id==='dome')s2Platforms.forEach(function(pl){s2RefPanel(pl.x,pl.y,pl.w,pl.h,'#c7ec65','#81b84c');s2ArtRect(pl.x,pl.y,pl.w,2,'#eff6a7');s2ArtRect(pl.x+6,pl.y+pl.h,pl.w-12,Math.max(0,GY-pl.y-pl.h),'rgba(168,213,78,.17)');});
  g.restore();
}
function s2ArtHudBacking(){g.save();s2ArtRound(6,6,188,88,12,'rgba(23,12,37,.73)');g.restore();}
function s2DrawSeasonOverlay(){
  // Tema sazonal (ex.: Halloween) aparece por cima de TODOS os cenários!
  if(typeof temaAtual === 'function' && temaAtual() === 'halloween'){
    g.save();
    for(var hi = 0; hi < 3; hi++){
      var hx = ((hi * 260 - dist * 0.45) % (W + 80) + (W + 80)) % (W + 80) - 40;
      // Abóbora iluminada na beira do palco
      g.fillStyle = '#f97316';
      g.beginPath(); g.ellipse(hx, GY - 8, 9, 7, 0, 0, 7); g.fill();
      g.fillStyle = '#fde047';
      g.fillRect(hx - 4, GY - 10, 2, 2); g.fillRect(hx + 2, GY - 10, 2, 2);
      // Morceguinho voando no alto
      var batX = ((W - (frame * 0.9 + hi * 190) % (W + 100)) + W + 100) % (W + 100) - 50;
      var batY = 44 + (hi % 2) * 22 + Math.sin(frame * 0.2 + hi) * 5;
      g.fillStyle = '#1e1b4b';
      g.beginPath(); g.arc(batX, batY, 3, 0, 7); g.fill();
      g.fillRect(batX - 7, batY - 1, 5, 2); g.fillRect(batX + 2, batY - 1, 5, 2);
    }
    g.restore();
  }
}
// Desenha Corredor de Fãs, Parceiras do Coro, HUD de Combo/Cenário e Cortina de Palco
function s2DrawForeground(){
  // 1. Corredor de fãs na beira do palco (high-five!)
  s2FanRows.forEach(function(fn){
    var bounce = fn.hi5 ? -8 : Math.abs(Math.sin(frame * 0.15 + fn.x * 0.05)) * 3;
    g.save();
    g.fillStyle = '#334155';
    g.fillRect(fn.x + 4, fn.y + 10 + bounce, 12, 18);
    g.beginPath(); g.arc(fn.x + 10, fn.y + 5 + bounce, 6, 0, 7); g.fill();
    // Mãozinha erguida para o high-five
    g.fillStyle = fn.hi5 ? '#ffe14d' : fn.cor;
    g.font = '12px sans-serif'; g.textAlign = 'center';
    g.fillText(fn.hi5 ? '✨' : '🤚', fn.x + 10, fn.y - 2 + bounce);
    g.restore();
  });

  // 2. Carta "Coro": parceiras correndo na frente da Idol pegando estrelas!
  if(s2Coro && s2Coro.t > 0 && state === 'play'){
    var cPartners = s2Coro.partners || [];
    cPartners.forEach(function(pid, idx){
      var px = P.x + 68 + idx * 38 + Math.sin(frame * 0.12 + idx) * 6;
      var py = GY - 44 - Math.abs(Math.sin(frame * 0.25 + idx)) * 6;
      g.save();
      drawChar(CH[pid], px, py, Math.sin(frame * 0.55 + idx), 2, true);
      g.font = '10px sans-serif'; g.textAlign = 'center';
      g.fillText('🎶', px + 15, py - 6);
      g.restore();
    });
  }

  // 3. Efeito visual de deslizar (poeira brilhante nos pés quando abaixada)
  if(s2Sliding && state === 'play'){
    g.save();
    g.fillStyle = '#ff9ccd';
    for(var si = 0; si < 3; si++){
      g.beginPath();
      g.arc(P.x - 4 - si * 7 + (frame % 5), P.y + P.h - 3 - (si % 2) * 3, 2.5, 0, 7);
      g.fill();
    }
    g.restore();
  }

  // 4. HUD da Temporada 2: Nome do cenário atual, Combo de estrelas (x2 / x3), Coro e Desafio
  if(state === 'play' || state === 'over'){
    var st = S2_STAGES[s2StageIdx] || S2_STAGES[0];
    g.save();
    g.textAlign = 'left';
    g.font = '700 11px "M PLUS Rounded 1c",sans-serif';
    g.fillStyle = '#ffd6f0';
    // Sem a data aqui (ela vazava do quadro do placar); na Corrida do dia só o selo 📅.
    g.fillText((s2DailyMode ? '📅 ' : '📍 ') + tr(st.nome), 14, 80, 174);

    // Multiplicador de Combo de Estrelas no canto superior
    var mult = s2Combo >= 25 ? 3 : s2Combo >= 10 ? 2 : 1;
    if(s2Combo >= 3){
      g.textAlign = 'right';
      g.font = '800 ' + (mult > 1 ? '16' : '13') + 'px "M PLUS Rounded 1c",sans-serif';
      g.fillStyle = mult === 3 ? '#b6ff3b' : mult === 2 ? '#ffe14d' : '#ff9ccd';
      g.fillText('★ Combo ' + s2Combo + (mult > 1 ? ' (x' + mult + '!)' : ''), W - 16, 28);
    }

    // Contador do Coro se ativo
    if(s2Coro && s2Coro.t > 0){
      g.textAlign = 'right';
      g.font = '800 13px "M PLUS Rounded 1c",sans-serif';
      g.fillStyle = '#ff9ccd';
      g.fillText('🎶 Coro ' + Math.ceil(s2Coro.t / 60) + 's', W - 16, 48);
    }

    // Bônus pastel mais legível: ação dominante, 5 notas individuais, pulso ao acertar.
    if(s2Challenge && s2Challenge.active){
      var bc=s2Challenge, words=S2_BONUS_LABELS[LANG]||S2_BONUS_LABELS.pt;
      var expected=bc.beat%2===0?words.jump:words.slide;
      var w=Math.min(W-24,490), x=(W-w)/2, y=36, h=149, r=22;
      var grad=g.createLinearGradient(x,y,x+w,y+h);
      grad.addColorStop(0,'rgba(123,63,240,.96)');
      grad.addColorStop(.52,'rgba(255,111,181,.97)');
      grad.addColorStop(1,'rgba(65,105,225,.96)');
      g.save();
      g.fillStyle=grad;g.shadowColor='#ffabeb';g.shadowBlur=bc.flash>0?22:11;
      g.beginPath();g.moveTo(x+r,y);g.lineTo(x+w-r,y);
      g.quadraticCurveTo(x+w,y,x+w,y+r);
      g.lineTo(x+w,y+h-r);g.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
      g.lineTo(x+r,y+h);g.quadraticCurveTo(x,y+h,x,y+h-r);
      g.lineTo(x,y+r);g.quadraticCurveTo(x,y,x+r,y);g.closePath();g.fill();
      g.shadowBlur=0;g.strokeStyle='rgba(255,255,255,.78)';g.lineWidth=2;g.stroke();
      g.textAlign='center';g.fillStyle='#fff';
      g.font='900 23px "M PLUS Rounded 1c",sans-serif';
      g.fillText('✦ '+words.title+' ✦',W/2,y+29,w-28);
      // Placa clara de alto contraste: prioridade ao comando no celular.
      g.fillStyle='rgba(255,255,255,.94)';
      g.beginPath();g.moveTo(x+24,y+42);g.lineTo(x+w-24,y+42);
      g.quadraticCurveTo(x+w-12,y+42,x+w-12,y+54);
      g.lineTo(x+w-12,y+94);g.quadraticCurveTo(x+w-12,y+106,x+w-24,y+106);
      g.lineTo(x+24,y+106);g.quadraticCurveTo(x+12,y+106,x+12,y+94);
      g.lineTo(x+12,y+54);g.quadraticCurveTo(x+12,y+42,x+24,y+42);g.closePath();g.fill();
      g.fillStyle='#532887';g.font='900 41px "M PLUS Rounded 1c",sans-serif';
      g.fillText(expected,W/2,y+88,w-48);
      // As cinco estrelas representam notas individuais acertadas, não notas geradas.
      var baseX=W/2-114;
      for(var bi=0;bi<5;bi++){
        var earned=!!bc.hitsMask[bi], current=bc.beat===bi;
        var py=y+129;
        if(earned && bc.flash>0 && bi===bc.beat)py-=Math.sin((18-bc.flash)/18*Math.PI)*7;
        g.save();g.textAlign='center';g.font='900 27px sans-serif';
        g.fillStyle=earned?'#fff176':current?'#ffffff':'rgba(255,255,255,.60)';
        if(earned){g.shadowColor='#ffe14d';g.shadowBlur=11;}
        g.fillText(earned?'★':'☆',baseX+bi*57,py);
        g.restore();
      }
      g.fillStyle='#fff';g.font='800 19px "M PLUS Rounded 1c",sans-serif';
      g.textAlign='right';g.fillText(bc.hits+'/5',x+w-22,y+134,58);
      g.restore();
    }
    g.restore();
  }

  // 5. Cortina de Palco na transição de cenário (fecha e abre sem pausar o jogo!)
  if(s2Curtain){
    var p = Math.max(0, Math.min(1, s2Curtain.p));
    var halfW = (W / 2 + 24) * p;
    g.save();
    // Cortina esquerda e direita de veludo vermelho/roxo Idol com franja dourada
    var cgL = g.createLinearGradient(0, 0, halfW, 0);
    cgL.addColorStop(0, '#4c1d95'); cgL.addColorStop(0.7, '#a855f7'); cgL.addColorStop(1, '#ff8ecb');
    g.fillStyle = cgL;
    g.fillRect(0, 0, halfW, H);

    var cgR = g.createLinearGradient(W - halfW, 0, W, 0);
    cgR.addColorStop(0, '#ff8ecb'); cgR.addColorStop(0.3, '#52cfba'); cgR.addColorStop(1, '#4169e1');
    g.fillStyle = cgR;
    g.fillRect(W - halfW, 0, halfW, H);

    // Estrelinhas flutuantes suaves enquanto a cortina passa.
    g.save();g.textAlign='center';g.font='bold 18px sans-serif';
    var sparkleColors=['#ffe14d','#ffffff','#b6ff3b','#ffb3dd','#a6f4ff'];
    for(var sc=0;sc<16;sc++){
      var sx=(sc*61+frame*1.6)%W,sy=32+(sc*47)%Math.max(60,GY-48);
      g.globalAlpha=.36+.38*Math.abs(Math.sin(frame*.08+sc));
      g.fillStyle=sparkleColors[sc%sparkleColors.length];
      g.fillText('✦',sx,sy);
    }
    g.restore();
    // Bordas douradas da cortina
    g.fillStyle = '#fde047';
    g.fillRect(halfW - 6, 0, 6, H);
    g.fillRect(W - halfW, 0, 6, H);

    if(p > 0.65 && s2Curtain.nextIdx !== undefined){
      var nxtSt = S2_STAGES[s2Curtain.nextIdx] || S2_STAGES[s2StageIdx];
      g.fillStyle = '#fff';
      g.font = '800 22px "M PLUS Rounded 1c",sans-serif';
      g.textAlign = 'center';
      g.fillText('✨ ' + tr(nxtSt.nome) + ' ✨', W / 2, H / 2);
    }
    g.restore();
  }
}
