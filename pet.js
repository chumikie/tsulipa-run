/* Backstage⭐Pet! — funções e tabelas fixas do camarim dos pets.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 1), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas; ele carrega antes do script principal do index.html, que é quem
   executa tudo na mesma ordem de antes (variáveis com estado, listeners e chamadas de inicialização continuam lá).
   Sincronização com a nuvem: pet-sync.js (não duplicar aqui). */
var PET_KEY = 'brs48cr_pet';
var PET_SP = {   // chaves internas iguais às do drawPet; nomes de exibição
  tsu:    { n:'Chu',    cor:'#9b30d9', emo:'💜' },
  lirika: { n:'Koali',  cor:'#16a34a', emo:'💚' },
  pati:   { n:'Pucchi', cor:'#4169e1', emo:'💙' },
  meu:    { n:'Meu Pet', cor:'#ff6fb5', emo:'💖' }   // pet montável (V2): a cor real vem da montagem
};
var PET_NEEDS = [['fome','🍙','Fome','#ff6fb5'],['energia','⚡','Energia','#4169e1'],['humor','💖','Humor','#9b30d9'],['higiene','🫧','Higiene','#7ed321']];
var PET_RATE = { fome:7.0, energia:5.0, humor:6.0, higiene:4.0 }; // dobro da velocidade original
var PET_CAP = 12 * 36e5;                                           // queda máxima contada: 12h fora
var PET_FLOOR = 196, PET_X = 250, PET_SC = 2.4;                  // chão e posição do pet no camarim
var petData = null, petOpen = false, petT = 0, petFx = [], petEsc = 'tsu';
var petHop = 0, petSmile = 0, petLastPat = 0, petBg = null, petBgOshi = null, petDpr = 1;
function petLoad(){
  try{
    var d = JSON.parse(localStorage.getItem(PET_KEY) || 'null');
    petData = (d && d.v === 1 && d.pets && d.pets[d.ativo]) ? d : null;
    if(petData) petNormalize();   // completa saves antigos com os campos da V2
  }catch(e){ petData = null; }
}
function petSave(changed){ if(!petData) return; try{ localStorage.setItem(PET_KEY, JSON.stringify(petData)); }catch(e){} if(changed && typeof perfPetMudou === 'function') perfPetMudou(); }
function petAtivo(){ return petData ? petData.pets[petData.ativo] : null; }
function petClamp(v){ return Math.max(0, Math.min(100, Math.round(v * 100) / 100)); }
// Queda pelo relógio real: calcula o tempo desde a última visita (com teto e
// proteção contra relógio voltando). Só o pet ativo perde pontos.
function petTick(){
  var p = petAtivo(); if(!p) return;
  var now = Date.now(), el = now - (p.t || now);
  if(el < 0) el = 0;
  if(el > PET_CAP) el = PET_CAP;
  var h = el / 36e5;
  Object.keys(PET_RATE).forEach(function(k){
    if(p.dorme && k === 'energia') p[k] = petClamp(p[k] + PET_SLEEP_RATE * h);   // dormindo: recupera energia
    else p[k] = petClamp(p[k] - PET_RATE[k] * h * (p.dorme ? .5 : 1));          // dormindo: o resto cai pela metade
  });
  if(p.dorme && p.energia >= 100){ p.dorme = false; petSay(tr('Bom dia!') + ' ☀️'); }   // acorda sozinho quando descansou
  p.t = now;
}
function petMood(p){
  if(p.dorme) return ['💤', 'Dormindo...'];
  var m = Math.min(p.fome, p.energia, p.humor, p.higiene);
  if(m >= 60) return ['✨💖', 'Feliz!'];
  if(p.energia < 25) return ['💤', 'Com sono...'];
  if(p.fome < 25) return ['🍙', 'Com fome...'];
  if(p.higiene < 25) return ['🫧', 'Precisa de banho...'];
  if(p.humor < 25) return ['💭', 'Com saudade...'];
  return ['🎵', 'Tranquilo'];
}
function petUI(){
  var p = petAtivo(); if(!p) return;
  $('petNm').textContent = petEmo(petData.ativo) + ' ' + p.nome;
  $('petSt').textContent = tr(petMood(p)[1]);
  $('petStars').textContent = '★ ' + starT;
  $('petBars').innerHTML = PET_NEEDS.map(function(n){
    var v = Math.round(p[n[0]]);
    return '<div class="petbar"><span><em style="font-style:normal">' + n[1] + ' ' + tr(n[2]) + '</em><em style="font-style:normal">' + v + '</em></span>' +
           '<i><b style="width:' + v + '%;background:' + n[3] + '"></b></i></div>';
  }).join('');
  petActUI();
  petDevUI();
  petRankUI(p);   // estágio do pet (V2.1)
  if(typeof petSyncEstadoUI==='function')petSyncEstadoUI();
}
function petFitCanvas(){
  var d = Math.min(2, window.devicePixelRatio || 1);
  if(d !== petDpr || petCv.width !== 360 * d){ petDpr = d; petCv.width = 360 * d; petCv.height = 220 * d; petBg = null; }
}
// Fundo fixo desenhado uma vez num canvas fora da tela (refeito ao trocar o Oshi)
function petMakeBg(){
  var c = document.createElement('canvas'); c.width = 360 * petDpr; c.height = 220 * petDpr;
  var x = c.getContext('2d'); x.scale(petDpr, petDpr);
  var ac = { tsu:'#9b30d9', lirika:'#22c55e', pati:'#4169e1' }[OSHI] || '#ff6fb5';
  function RR(px, py, w, h, r){ x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }

  // Parede com listras na cor do Oshi
  var wg = x.createLinearGradient(0, 0, 0, 170); wg.addColorStop(0, '#fff0f8'); wg.addColorStop(1, '#ecdcff');
  x.fillStyle = wg; x.fillRect(0, 0, 360, 170);
  x.globalAlpha = .07; x.fillStyle = ac; for(var s = 0; s < 360; s += 24) x.fillRect(s, 0, 12, 170); x.globalAlpha = 1;

  // Varal de bandeirinhas
  x.strokeStyle = 'rgba(123,63,240,.35)'; x.lineWidth = 1; x.beginPath(); x.moveTo(0, 14); x.quadraticCurveTo(180, 34, 360, 14); x.stroke();
  var fc = ['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5'];
  for(var f = 0; f < 12; f++){ var fx = 15 + f * 30, fy = 14 + Math.sin(f / 11 * Math.PI) * 9.5; x.fillStyle = fc[f % 4]; x.beginPath(); x.moveTo(fx - 6, fy); x.lineTo(fx + 6, fy); x.lineTo(fx, fy + 11); x.closePath(); x.fill(); }

  petDrawDecor(x);   // mural com pôsteres e quadros (V2)

  // Penteadeira + espelho de camarim (moldura e vidro; as lâmpadas piscam no loop)
  x.fillStyle = '#f7d9ea'; RR(18, 140, 132, 30, 6); x.fill();
  x.fillStyle = '#e9b8d3'; x.fillRect(18, 152, 132, 3);
  x.fillStyle = '#ffe9a8'; RR(30, 40, 108, 96, 10); x.fill();
  var mg = x.createLinearGradient(40, 50, 128, 126); mg.addColorStop(0, '#dff3ff'); mg.addColorStop(.55, '#bfe3ff'); mg.addColorStop(1, '#e9dcff');
  x.fillStyle = mg; RR(40, 50, 88, 76, 6); x.fill();
  x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.moveTo(52, 56); x.lineTo(66, 56); x.lineTo(48, 92); x.lineTo(46, 80); x.closePath(); x.fill();
  // Itens na penteadeira: batom, perfume, foto do TsuLiPa
  x.fillStyle = '#ff6fb5'; x.fillRect(118, 130, 6, 10); x.fillStyle = '#c0265f'; x.fillRect(118, 127, 6, 4);
  x.fillStyle = 'rgba(180,220,255,.9)'; RR(130, 126, 12, 14, 3); x.fill(); x.fillStyle = '#4169e1'; x.fillRect(134, 122, 4, 5);

  // Meu Camarim⭐Life! ML1: objetos estáticos no mesmo fundo em cache.
  // Celular na mesinha lateral, sem cobrir o personagem nem os controles do pet.
  x.fillStyle = '#dfb1dc'; RR(152, 149, 27, 21, 4); x.fill();
  x.fillStyle = '#c68dbd'; x.fillRect(154, 156, 23, 2);
  x.fillStyle = '#ffb9dd'; RR(158.5, 123.5, 16, 27.5, 4); x.fill();
  x.strokeStyle = '#b8eaff'; x.lineWidth = 1.5; x.stroke();
  x.fillStyle = '#eddaff'; RR(160.5, 127, 12, 17, 2); x.fill();
  x.fillStyle = '#b6eaff'; RR(161.5, 128, 10, 15, 2); x.fill();
  x.fillStyle = ac; x.beginPath(); x.arc(166.5, 135, 3, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.font = '8px sans-serif'; x.textAlign = 'center'; x.fillText('★', 166.5, 138);
  x.fillStyle = '#fff'; x.beginPath(); x.arc(166.5, 147.3, 1.5, 0, 7); x.fill();
  x.fillStyle = '#bbebff'; x.fillRect(158, 122, 3, 3); x.fillStyle = '#fff'; x.fillRect(159, 123, 1, 1);
  x.fillStyle = '#ff80c4'; x.fillText('✦', 178, 146);

  // Pequena estante de lembranças sob o mural; não ocupa espaços de decoração salvos.
  x.fillStyle = '#bd82c1'; RR(181, 144, 38, 5, 2); x.fill();
  x.fillStyle = '#84539d'; x.fillRect(184, 149, 4, 9); x.fillRect(212, 149, 4, 9);
  x.fillStyle = '#ffe4a4'; RR(186, 126, 12, 17, 2); x.fill();
  x.fillStyle = '#e6b952'; x.fillRect(190, 137, 4, 6);
  x.fillStyle = '#9b30d9'; x.fillRect(201, 130, 13, 12);
  x.fillStyle = '#fff4c9'; x.font = '10px sans-serif'; x.fillText('★', 207.5, 139);

  // Arara de roupas com os figurinos nas cores do TsuLiPa
  x.strokeStyle = '#b9a3d6'; x.lineWidth = 3;
  x.beginPath(); x.moveTo(292, 58); x.lineTo(292, 170); x.moveTo(350, 58); x.lineTo(350, 170); x.moveTo(288, 60); x.lineTo(354, 60); x.stroke();
  [['#9b30d9', 300], ['#b6ff3b', 316], ['#4169e1', 332], ['#ff6fb5', 344]].forEach(function(r){
    x.strokeStyle = '#8f7bb0'; x.lineWidth = 1; x.beginPath(); x.arc(r[1], 64, 3, Math.PI, 0); x.stroke();
    x.fillStyle = r[0]; x.beginPath(); x.moveTo(r[1] - 7, 67); x.lineTo(r[1] + 7, 67); x.lineTo(r[1] + 10, 112); x.lineTo(r[1] - 10, 112); x.closePath(); x.fill();
    x.fillStyle = 'rgba(255,255,255,.35)'; x.fillRect(r[1] - 1, 68, 2, 40);
  });

  // Piso de madeira rosada
  var fg = x.createLinearGradient(0, 170, 0, 220); fg.addColorStop(0, '#f5c9dd'); fg.addColorStop(1, '#e4a9c6');
  x.fillStyle = fg; x.fillRect(0, 170, 360, 50);
  x.strokeStyle = 'rgba(255,255,255,.35)'; x.lineWidth = 1;
  for(var py = 182; py < 220; py += 12){ x.beginPath(); x.moveTo(0, py); x.lineTo(360, py); x.stroke(); }
  x.fillStyle = 'rgba(123,63,240,.18)'; x.fillRect(0, 170, 360, 2);
  // Tapetinho redondo embaixo do pet
  x.fillStyle = 'rgba(255,255,255,.45)'; x.beginPath(); x.ellipse(PET_X, PET_FLOOR + 4, 46, 9, 0, 0, 7); x.fill();
  x.strokeStyle = ac; x.globalAlpha = .4; x.lineWidth = 2; x.stroke(); x.globalAlpha = 1;
  petBg = c; petBgOshi = OSHI;
}
// Áreas pequenas e explícitas: o espelho fica acima do hitbox do Idol e
// a estante acima do item de temporada. Botões HTML oferecem alvos maiores.
function petLifeHit(lx, ly){
  if(lx >= 45 && lx <= 126 && ly >= 52 && ly <= 82) return 'espelho';
  if(lx >= 156 && lx <= 180 && ly >= 122 && ly <= 156) return 'celular';
  if(lx >= 180 && lx <= 211 && ly >= 123 && ly <= 149) return 'estante';
  return '';
}
var PET_LIFE_TEXTOS = {
  pt:['Espelho','Celular','Estante','Troféus','Álbum'],
  en:['Mirror','Phone','Shelf','Trophies','Album'],
  es:['Espejo','Móvil','Estante','Trofeos','Álbum'],
  id:['Cermin','Ponsel','Rak','Piala','Album'],
  th:['กระจก','โทรศัพท์','ชั้นวาง','ถ้วยรางวัล','อัลบั้ม'],
  ja:['鏡','スマホ','棚','トロフィー','アルバム']
};
// ML1.2-A: TsuPhone vive na memória da aba; não cria saves nem progressão.
var PET_PHONE_APPS = {
  pt:['Agenda⭐','Chat⭐','Fotos⭐','Perfil⭐'], en:['Agenda⭐','Chat⭐','Photos⭐','Profile⭐'],
  es:['Agenda⭐','Chat⭐','Fotos⭐','Perfil⭐'], id:['Agenda⭐','Chat⭐','Foto⭐','Profil⭐'],
  th:['ตาราง⭐','แชต⭐','รูปภาพ⭐','โปรไฟล์⭐'], ja:['予定⭐','チャット⭐','写真⭐','プロフィール⭐']
};
var petPhoneOpen = false, petPhoneTela = 'home', petPhoneVoltarTela = '';
var petPhoneAgendaDados = null, petPhoneAgendaDono = '', petPhoneAgendaReq = 0;
// ML1.2-C.2-A: abas apenas em memória; Momentos/Jornal serão conectados nas próximas etapas.
var petPhoneFotosAba = 'camera';
var PET_PHONE_FOTOS_TEXTO = {
  pt:['Câmera','Momentos','Jornal','Minhas Memórias⭐','As fotos de corridas, shows e encontros aparecerão aqui nas próximas etapas.','Fotos do dia⭐','As cenas públicas do Idol⭐News! serão integradas aqui na próxima etapa.','Em preparação'],
  en:['Camera','Moments','News','My Memories⭐','Photos of races, shows and encounters will appear here in future updates.','Photos of the day⭐','Public Idol⭐News! scenes will appear here in a future update.','Coming soon'],
  es:['Cámara','Momentos','Noticias','Mis Recuerdos⭐','Las fotos de carreras, shows y encuentros aparecerán aquí próximamente.','Fotos del día⭐','Las escenas públicas de Idol⭐News! se integrarán aquí próximamente.','Próximamente'],
  id:['Kamera','Momen','Berita','Kenanganku⭐','Foto dari lari, pertunjukan, dan pertemuan akan muncul di sini pada pembaruan berikutnya.','Foto hari ini⭐','Adegan publik Idol⭐News! akan hadir di sini pada pembaruan berikutnya.','Segera hadir'],
  th:['กล้อง','ความทรงจำ','ข่าว','ความทรงจำของฉัน⭐','ภาพจากการวิ่ง การแสดง และการพบปะจะปรากฏที่นี่ในการอัปเดตถัดไป','ภาพวันนี้⭐','ภาพสาธารณะจาก Idol⭐News! จะปรากฏที่นี่ในการอัปเดตถัดไป','เร็ว ๆ นี้'],
  ja:['カメラ','思い出','ニュース','わたしの思い出⭐','レースやライブ、出会いの写真は今後の更新でここに登場します。','今日の写真⭐','Idol⭐News!の公開写真は今後の更新でここに登場します。','準備中']
};
var PET_PHONE_MOMENTO_TEXTO = {
  pt:['Guardar em Momentos⭐','Guardado no TsuPhone! 💗','Não foi possível guardar esta foto.','Nenhuma foto nesta sessão.','Guarde voluntariamente uma selfie, foto da corrida ou do Moon⭐Duo! para vê-la aqui.','Baixar PNG','Fotos temporárias: somem ao sair da página.'],
  en:['Keep in Moments⭐','Saved to TsuPhone! 💗','Could not keep this photo.','No photos in this session.','Choose to keep a selfie, race photo or Moon⭐Duo! photo to see it here.','Download PNG','Temporary photos: cleared when leaving the page.'],
  es:['Guardar en Momentos⭐','¡Guardado en TsuPhone! 💗','No se pudo guardar esta foto.','Aún no hay fotos en esta sesión.','Guarda una selfie, foto de carrera o Moon⭐Duo! para verla aquí.','Descargar PNG','Fotos temporales: desaparecen al salir de la página.'],
  id:['Simpan di Momen⭐','Tersimpan di TsuPhone! 💗','Foto ini tidak bisa disimpan.','Belum ada foto dalam sesi ini.','Simpan selfie, foto lari, atau foto Moon⭐Duo! untuk melihatnya di sini.','Unduh PNG','Foto sementara: hilang saat meninggalkan halaman.'],
  th:['เก็บในความทรงจำ⭐','เก็บใน TsuPhone แล้ว! 💗','เก็บรูปนี้ไม่สำเร็จ','ยังไม่มีรูปในรอบนี้','เลือกเก็บเซลฟี่ รูปวิ่ง หรือรูป Moon⭐Duo! เพื่อดูที่นี่','ดาวน์โหลด PNG','รูปชั่วคราวจะหายไปเมื่อออกจากหน้าเว็บ'],
  ja:['思い出に保存⭐','TsuPhoneに保存しました! 💗','この写真は保存できませんでした。','このセッションの写真はまだありません。','セルフィー、レース、Moon⭐Duo!の写真を選んで保存するとここに表示されます。','PNGを保存','写真は一時保存です。ページを離れると消えます。']
};
// Fotos⭐: uma única Polaroid temporária; nunca entra no save ou no Supabase.
var petPhoneFotoUrl = '', petPhoneFotoDono = '', petPhoneFotoErro = '';
// ML1.2-C.2-B: até quatro fotos da sessão, nunca persistidas ou transmitidas.
var petPhoneMomentos = [], petPhoneMomentosDono = '', petPhoneMomentoFonte = '', petPhoneMomentoFonteDono = '';
// ML1.2-B: diálogos fictícios, só nesta sessão. Nunca enviam ou salvam mensagens.
var petPhoneChatConversa = '', petPhoneChatSessao = '', petPhoneChatRespostas = {};
function petPhoneContaChave(){
  if(!contaJ) return '';
  var id = (typeof contaAuthUserId === 'string' && contaAuthUserId) || contaJ.id || contaJ.nick || '';
  return String(id) + ':' + (typeof contaSessaoToken !== 'undefined' ? contaSessaoToken : '');
}
function petPhonePapel(){
  var c = $('petPhoneWp'); if(!c || !petCv || !petCv.width) return;
  var x = c.getContext('2d'); if(!x) return;
  x.clearRect(0, 0, c.width, c.height);
  // Recorte proporcional do cenário já desenhado: Idol e Pet sem distorção.
  var srcW = petCv.width, srcH = petCv.height, ratio = c.width / c.height;
  var cropH = Math.min(srcH, srcW / ratio), cropW = Math.min(srcW, srcH * ratio);
  var sx = (srcW - cropW) / 2, sy = (srcH - cropH) * .68;
  x.drawImage(petCv, sx, sy, cropW, cropH, 0, 0, c.width, c.height);
}
// Quatro ícones originais do Idol⭐Touch, desenhados uma vez em Canvas 2D.
// Reutilizam a paleta T2; não há imagens externas, timers ou animação extra.
function petPhoneIcon(c, tipo){
  if(!c || !c.getContext) return;
  var x = c.getContext('2d'); if(!x) return;
  x.save(); x.clearRect(0,0,c.width,c.height); x.scale(c.width/64,c.height/64);
  function rr(a,b,w,h,r){
    x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);
    x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();
  }
  function box(a,b,w,h,r,fill,stroke,lw){
    rr(a,b,w,h,r);x.fillStyle=fill;x.fill();
    if(stroke){x.strokeStyle=stroke;x.lineWidth=lw||2;x.stroke();}
  }
  function star(a,b,r,fill){
    x.beginPath();for(var i=0;i<10;i++){
      var z=-Math.PI/2+i*Math.PI/5,d=i%2?r*.44:r;
      if(!i)x.moveTo(a+Math.cos(z)*d,b+Math.sin(z)*d);
      else x.lineTo(a+Math.cos(z)*d,b+Math.sin(z)*d);
    }
    x.closePath();x.fillStyle=fill;x.fill();
  }
  var cor={agenda:['#ffe0f0','#ff6fb5'],chat:['#cbefff','#4169e1'],
    fotos:['#e8d5ff','#9b30d9'],perfil:['#e9f5d1','#9b30d9']}[tipo];
  if(!cor){x.restore();return;}
  var bg=x.createLinearGradient(6,5,57,60);
  bg.addColorStop(0,'#fff');bg.addColorStop(.53,cor[0]);bg.addColorStop(1,'#d7eaff');
  box(3,3,58,58,17,bg,'#fff',2.2);
  x.fillStyle='rgba(255,255,255,.6)';rr(9,7,37,7,4);x.fill();
  if(tipo==='agenda'){
    box(12,15,40,37,7,'#fff','#c184c7',2);
    box(12,15,40,12,6,'#ff6fb5');
    x.strokeStyle='#fff';x.lineWidth=3;x.lineCap='round';
    for(var d=22;d<=42;d+=20){x.beginPath();x.moveTo(d,12);x.lineTo(d,20);x.stroke();}
    x.fillStyle='#b9a0e4';x.font='bold 18px sans-serif';x.textAlign='center';
    x.fillText('♥',31,45);star(47,46,7,'#ffe37a');
  }else if(tipo==='chat'){
    box(11,17,36,27,11,'#fff','#7a78cb',2.3);
    x.fillStyle='#fff';x.beginPath();x.moveTo(20,42);x.lineTo(17,51);x.lineTo(29,43);x.fill();
    x.fillStyle='#4169e1';for(var j=0;j<3;j++){x.beginPath();x.arc(23+j*8,30,2.6,0,7);x.fill();}
    box(35,35,16,14,6,'#ffd5ef','#fff',1.8);
    x.fillStyle='#d4549a';x.font='bold 12px sans-serif';x.textAlign='center';x.fillText('♥',43,45);
  }else if(tipo==='fotos'){
    x.save();x.translate(28,32);x.rotate(-.13);box(-19,-19,37,43,4,'#fff','#c79fd6',2);
    box(-15,-15,29,28,3,'#c5edff');
    x.fillStyle='#b6e64b';x.beginPath();x.moveTo(-15,13);x.lineTo(-4,-1);x.lineTo(3,7);x.lineTo(12,-4);x.lineTo(14,13);x.fill();
    star(4,-8,5,'#ffe16a');x.restore();
    star(48,16,8,'#ffcf48');
    x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.moveTo(48,5);x.lineTo(48,27);x.moveTo(37,16);x.lineTo(59,16);x.stroke();
  }else if(tipo==='perfil'){
    x.fillStyle='#fff';x.beginPath();x.arc(32,31,22,0,7);x.fill();
    box(16,40,32,14,9,'#ff80c1','#fff',1.5);
    x.fillStyle='#9b30d9';x.beginPath();x.arc(32,29,17,Math.PI,Math.PI*2);x.lineTo(49,36);x.lineTo(15,36);x.closePath();x.fill();
    x.fillStyle='#f6b37c';x.beginPath();x.ellipse(32,33,11,12,0,0,7);x.fill();
    x.fillStyle='#654386';for(var j=0;j<2;j++){x.beginPath();x.arc(28+j*8,34,1.4,0,7);x.fill();}
    x.strokeStyle='#854e74';x.lineWidth=1.5;x.beginPath();x.arc(32,36,3,.2,Math.PI-.2);x.stroke();
    star(45,17,9,'#ffdf5f');
  }
  x.restore();
}
function petPhoneIcones(corpo){
  if(!corpo || !corpo.querySelectorAll) return;
  corpo.querySelectorAll('canvas[data-phone-icon]').forEach(function(c){petPhoneIcon(c,c.dataset.phoneIcon);});
}
function petPhoneAgendaHtml(){
  if(!contaJ) return '<p class="petphone-dica">🔒 ' + escHtml(tr('Entre com Google para ver sua Agenda.')) + '</p>';
  if(petPhoneAgendaDono !== petPhoneContaChave()) return '<p class="petphone-dica">⌛ ' + escHtml(tr('Carregando...')) + '</p>';
  if(petPhoneAgendaDados === null) return '<p class="petphone-dica">⌛ ' + escHtml(tr('Carregando...')) + '</p>';
  if(!petPhoneAgendaDados.length) return '<p class="petphone-dica">📅 ' + escHtml(tr('Nenhum compromisso disponível agora.')) + '</p>';
  var validas = petPhoneAgendaDados.filter(function(m){ return m && typeof m.k === 'string' && +m.meta > 0; }).slice(0, 6);
  if(!validas.length) return '<p class="petphone-dica">📅 ' + escHtml(tr('Nenhum compromisso disponível agora.')) + '</p>';
  return '<ul class="petphone-agenda">' + validas.map(function(m){
    var cfg = m.k === 'collect' && typeof hubCollectHoje === 'function' ? hubCollectHoje() : (typeof HUB_MIS !== 'undefined' && HUB_MIS[m.k]) || ['🎯',m.k];
    var meta = Math.max(1,+m.meta||1), prog = Math.min(meta,Math.max(0,+m.prog||0));
    return '<li><span>' + cfg[0] + '</span><div><b>' + escHtml(tr(cfg[1]).replace('{n}',String(meta))) + '</b><small>' + (m.feito ? '✓ ' + escHtml(tr('Concluída')) : prog + '/' + meta) + '</small></div></li>';
  }).join('') + '</ul>';
}
function petPhoneFotoLimpar(){
  petPhoneFotoUrl = ''; petPhoneFotoDono = ''; petPhoneFotoErro = '';
}
function petPhoneFotoChave(){
  return petPhoneContaChave() + ':' + (typeof petData !== 'undefined' && petData ? petData.ativo || '' : '');
}
function petPhoneMomentoTexto(i){ return (PET_PHONE_MOMENTO_TEXTO[LANG] || PET_PHONE_MOMENTO_TEXTO.pt)[i]; }
function petPhoneMomentosLimpar(){
  var corpo = $('petPhoneCorpo');
  if(corpo && corpo.querySelectorAll){
    corpo.querySelectorAll('[data-momento-id]').forEach(function(img){img.removeAttribute('src');});
    corpo.querySelectorAll('[data-momento-baixar]').forEach(function(a){a.removeAttribute('href');});
  }
  petPhoneMomentos = []; petPhoneMomentosDono = ''; petPhoneMomentoFonte = ''; petPhoneMomentoFonteDono = '';
  var botao = $('shPhone'); if(botao) botao.hidden = true;
  if(petPhoneOpen && petPhoneTela === 'fotos' && petPhoneFotosAba === 'momentos') petPhoneRender();
}
function petPhoneMomentosConferir(){
  var dono = petPhoneFotoChave();
  if(petPhoneMomentosDono && (petPhoneMomentosDono !== dono || !petPhoneContaChave())) petPhoneMomentosLimpar();
}
function petPhoneMomentoDisponivel(tipo){
  petPhoneMomentoFonte = ''; petPhoneMomentoFonteDono = '';
  var b = $('shPhone'); if(!b) return;
  if(['pet','center'].indexOf(tipo) >= 0 && contaJ && petAtivo()){
    petPhoneMomentoFonte = tipo; petPhoneMomentoFonteDono = petPhoneFotoChave();
  }
  b.hidden = !petPhoneMomentoFonte;
  b.disabled = false; b.textContent = '💗 ' + petPhoneMomentoTexto(0);
}
function petPhoneMomentoGuardar(tipo, url){
  if(['pet','center','duo'].indexOf(tipo) < 0 || !contaJ || !petAtivo()) return false;
  if(typeof url !== 'string' || url.length > 10*1024*1024 || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(url)) return false;
  petPhoneMomentosConferir();
  var dono = petPhoneFotoChave(); if(!dono || !petPhoneContaChave()) return false;
  var label = {pet:'Backstage⭐Pet!',center:'Center⭐Run!',duo:'Moon⭐Duo!'}[tipo];
  var entrada = {tipo:tipo,rotulo:label,url:url,dono:dono,id:String(Date.now()) + '-' + String(Math.random()).slice(2,8)};
  petPhoneMomentosDono = dono;
  petPhoneMomentos.push(entrada);
  while(petPhoneMomentos.length > 4 || petPhoneMomentos.reduce(function(n,f){ return n + f.url.length; },0) > 16*1024*1024) petPhoneMomentos.shift();
  if(petPhoneOpen && petPhoneTela === 'fotos' && petPhoneFotosAba === 'momentos') petPhoneRender();
  return true;
}
function petPhoneMomentosHtml(){
  petPhoneMomentosConferir();
  if(!petPhoneMomentos.length) return '<section class="petphone-fotos-espera"><div class="petphone-fotos-ilustra" aria-hidden="true"><span>🏁</span><span>🐾</span><span>🌙</span></div><strong>' + escHtml(petPhoneMomentoTexto(3)) + '</strong><p>' + escHtml(petPhoneMomentoTexto(4)) + '</p></section>';
  return '<section class="petphone-momentos"><div class="petphone-momentos-grid">' + petPhoneMomentos.slice().reverse().map(function(f){
    return '<article class="petphone-momento"><img data-momento-id="' + f.id + '" alt="' + escHtml(f.rotulo) + '" loading="lazy"><b>' + escHtml(f.rotulo) + '</b><a data-momento-baixar="' + f.id + '" download="tsulipa-momento.png">⬇️ ' + escHtml(petPhoneMomentoTexto(5)) + '</a></article>';
  }).join('') + '</div><p class="petphone-photo-ajuda">' + escHtml(petPhoneMomentoTexto(6)) + '</p></section>';
}
function petPhoneMomentosRender(){
  if(!petPhoneOpen || petPhoneTela !== 'fotos' || petPhoneFotosAba !== 'momentos') return;
  var corpo = $('petPhoneCorpo'); if(!corpo || !corpo.querySelectorAll) return;
  petPhoneMomentos.forEach(function(f){
    var img = corpo.querySelector('[data-momento-id="' + f.id + '"]');
    var dl = corpo.querySelector('[data-momento-baixar="' + f.id + '"]');
    if(img) img.src = f.url;
    if(dl){dl.href = f.url;dl.download = 'tsulipa-' + f.tipo + '-' + f.id + '.png';}
  });
}
function petPhoneFotoHtml(){
  var fotoPronta = !!petPhoneFotoUrl && petPhoneFotoDono === petPhoneFotoChave();
  return '<div class="petphone-photo">' +
    '<div class="petphone-photo-preview">' + (fotoPronta
      ? '<img id="petPhoneFotoImg" alt="' + escHtml(tr('Selfie do Idol com o Pet')) + '">'
      : '<div class="petphone-photo-espera"><canvas id="petPhoneWp" width="260" height="125" aria-hidden="true"></canvas><span>📸 ' + escHtml(tr('Idol + Pet')) + '</span></div>') + '</div>' +
    '<button type="button" class="petphone-photo-tirar" data-phone="tirar-selfie">📸 ' + escHtml(tr(fotoPronta ? 'Tirar outra selfie!' : 'Tirar selfie!')) + '</button>' +
    (fotoPronta ? '<a class="petphone-photo-baixar" id="petPhoneFotoBaixar" download="tsulipa-camarim.png">⬇️ ' + escHtml(tr('Baixar PNG')) + '</a>' +
      '<button type="button" data-phone="guardar-selfie">💗 ' + escHtml(petPhoneMomentoTexto(0)) + '</button>' : '') +
    (petPhoneFotoErro ? '<p class="petphone-photo-erro" role="status">' + escHtml(petPhoneFotoErro) + '</p>' : '') +
    '<p class="petphone-photo-dica">' + escHtml(tr('Use as poses e molduras já disponíveis na câmera do Camarim. A foto só fica aqui até fechar o TsuPhone.')) + '</p>' +
    '<button type="button" class="petphone-photo-album" data-phone="abrir-album">🃏 ' + escHtml(tr('Ver Álbum de cards')) + '</button>' +
    '<p class="petphone-photo-ajuda">' + escHtml(tr('No iPhone, segure a imagem para salvar se o download não abrir.')) + '</p></div>';
}
function petPhoneFotosHtml(){
  var txt = PET_PHONE_FOTOS_TEXTO[LANG] || PET_PHONE_FOTOS_TEXTO.pt;
  var tabs = [['camera','📸'],['momentos','💗'],['jornal','📰']];
  var nav = '<nav class="petphone-fotos-tabs" aria-label="' + escHtml(tr('Fotos')) + '">' + tabs.map(function(t, i){
    return '<button type="button" data-phone="fotos-aba" data-aba="' + t[0] + '" aria-pressed="' + (petPhoneFotosAba === t[0]) + '"><span aria-hidden="true">' + t[1] + '</span><b>' + escHtml(txt[i]) + '</b></button>';
  }).join('') + '</nav>';
  if(petPhoneFotosAba === 'camera') return nav + petPhoneFotoHtml();
  if(petPhoneFotosAba === 'momentos') return nav + petPhoneMomentosHtml();
  var jornal = petPhoneFotosAba === 'jornal';
  return nav + '<section class="petphone-fotos-espera" aria-label="' + escHtml(txt[jornal ? 5 : 3]) + '">' +
    '<div class="petphone-fotos-ilustra" aria-hidden="true"><span>' + (jornal ? '📰' : '🏁') + '</span><span>' + (jornal ? '🌷' : '🎤') + '</span><span>' + (jornal ? '📸' : '🌙') + '</span></div>' +
    '<strong>' + escHtml(txt[jornal ? 5 : 3]) + '</strong><p>' + escHtml(txt[jornal ? 6 : 4]) + '</p>' +
    '<small>✦ ' + escHtml(txt[7]) + ' ✦</small></section>';
}
function petPhoneFotosAbaAbrir(k){
  if(!petPhoneOpen || petPhoneTela !== 'fotos' || ['camera','momentos','jornal'].indexOf(k) < 0) return false;
  petPhoneFotosAba = k; petPhoneRender();
  var botao = document.querySelector('#petPhoneCorpo [data-phone="fotos-aba"][data-aba="' + k + '"]');
  if(botao) botao.focus();
  return true;
}
function petPhoneFotoRender(){
  if(!petPhoneOpen || petPhoneTela !== 'fotos' || petPhoneFotosAba !== 'camera') return;
  if(petPhoneFotoDono && petPhoneFotoDono !== petPhoneFotoChave()) petPhoneFotoLimpar();
  var img = $('petPhoneFotoImg'), baixar = $('petPhoneFotoBaixar');
  if(petPhoneFotoUrl && petPhoneFotoDono === petPhoneFotoChave()){
    if(img) img.src = petPhoneFotoUrl;
    if(baixar){
      baixar.href = petPhoneFotoUrl;
      var p = petAtivo(), nome = p && p.nome || 'pet';
      baixar.download = 'tsulipa-camarim-' + (String(nome).replace(/[^a-z0-9]/gi,'').toLowerCase() || 'pet') + '.png';
    }
  }else petPhonePapel(); // miniatura do mesmo Canvas do Camarim, sem nova renderização.
}
function petPhoneFotoTirar(){
  if(!petPhoneOpen || petPhoneTela !== 'fotos' || petPhoneFotosAba !== 'camera' || petView !== 'room' || petGame || !contaJ || !petAtivo()) return false;
  // A câmera existente respeita pose, expressão, molduras e bloqueios da lojinha.
  // A captura é feita somente no toque; nunca em animação nem em segundo plano.
  var chave = petPhoneFotoChave(), url = null;
  try{ url = petMakePhoto(); }catch(e){}
  if(!petPhoneOpen || petPhoneTela !== 'fotos' || chave !== petPhoneFotoChave()) return false;
  if(typeof url !== 'string' || url.length > 10*1024*1024 || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(url)){
    petPhoneFotoErro = tr('Não foi possível tirar a selfie. Tente novamente.');
    petPhoneRender();return false;
  }
  petPhoneFotoUrl = url;petPhoneFotoDono = chave;petPhoneFotoErro = '';
  petPhoneRender();return true;
}
function petPhoneFotoGuardar(){
  if(!petPhoneOpen || petPhoneTela !== 'fotos' || petPhoneFotosAba !== 'camera' || !petPhoneFotoUrl || petPhoneFotoDono !== petPhoneFotoChave()) return false;
  if(!petPhoneMomentoGuardar('pet',petPhoneFotoUrl)) return false;
  petPhoneFotosAba = 'momentos'; petPhoneRender();return true;
}
function petPhoneChatContatos(){
  var contatos = [
    {id:'idol:tsu',nome:'Tsu',tipo:'idol',avatar:'🎤',papel:tr('Idol · Tsu'),cor:'#9b30d9'},
    {id:'idol:lirika',nome:'Lirika',tipo:'idol',avatar:'🐨',papel:tr('Idol · Lirika'),cor:'#22a76d'},
    {id:'idol:pati',nome:'Pati',tipo:'idol',avatar:'👑',papel:tr('Idol · Pati'),cor:'#4169e1'}
  ];
  // Fonte única: fãs NPCs já reconhecidos e filtrados pelo Happy⭐Cafe!.
  // Não usar os jogadores reais exibidos como figurantes no Handshake.
  var memorias = typeof cfVisitasMemorias === 'function' ? cfVisitasMemorias() : [];
  if(!Array.isArray(memorias)) return contatos;
  var vistos = Object.create(null);
  memorias.slice(0,8).forEach(function(m){
    if(!m || typeof HS_NOMES === 'undefined' || HS_NOMES.indexOf(m.nome) < 0 || vistos[m.nome] ||
      typeof HS_PRESENTES === 'undefined' || !Number.isInteger(m.pres) || !HS_PRESENTES[m.pres]) return;
    vistos[m.nome] = true;
    var cor = m.c && typeof m.c.hair === 'string' && /^#[0-9a-fA-F]{6}$/.test(m.c.hair) ? m.c.hair : '#b778d1';
    contatos.push({id:'fan:'+m.nome,nome:m.nome,tipo:'fan',avatar:'💗',papel:tr('Fã conhecido · Handshake'),
      cor:cor,jeito:['animado','timido','fofo'].indexOf(m.jeito)>=0 ? m.jeito : 'fofo',
      visual:m.c && typeof m.c === 'object' && !Array.isArray(m.c) ? m.c : {},
      encontro:typeof m.dia === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(m.dia) ? m.dia : '',
      presente:HS_PRESENTES[m.pres],cafe:typeof hsCafePendente !== 'undefined' && hsCafePendente &&
        typeof hsMemChave === 'function' && hsCafePendente.conta === hsMemChave() &&
        hsCafePendente.nome === m.nome && hsCafePendente.pres === m.pres});
  });
  return contatos;
}
// Retratos reais dos fãs a partir do avatar já lembrado no Handshake.
// O renderer do Perfil é reutilizado em modo rosto, uma vez por tela e sem rAF.
function petPhoneChatAvatarHtml(c){
  return '<span class="petphone-chat-avatar" style="--chat-cor:'+c.cor+'"><canvas width="96" height="96" data-phone-portrait="'+
    escHtml(c.id)+'" aria-hidden="true">'+c.avatar+'</canvas></span>';
}
function petPhoneChatRetratos(corpo){
  if(!corpo || !corpo.querySelectorAll) return;
  var contatos = petPhoneChatContatos();
  corpo.querySelectorAll('canvas[data-phone-portrait]').forEach(function(cv){
    var contato = contatos.find(function(c){return c.id === cv.dataset.phonePortrait;});
    var x = cv.getContext && cv.getContext('2d');
    if(!contato || !x) return;
    x.clearRect(0,0,cv.width,cv.height);
    x.save();
    try{
      if(contato.tipo === 'fan' && typeof perfDesenharIdol === 'function'){
        perfDesenharIdol(x,cv.width,cv.height,{c:contato.visual,expr:contato.jeito==='timido'?0:3,fundo:''},false,true,0);
      }else{
        x.font='52px sans-serif';x.textAlign='center';x.textBaseline='middle';
        x.fillText(contato.avatar,cv.width/2,cv.height/2+3);
      }
    }catch(e){
      x.clearRect(0,0,cv.width,cv.height);
      x.font='46px sans-serif';x.textAlign='center';x.textBaseline='middle';
      x.fillText(contato.avatar,cv.width/2,cv.height/2);
    }finally{x.restore();}
  });
}
// Variação previsível ao longo dos dias: não sorteia a cada render nem salva estado.
function petPhoneChatVariante(c){
  var s = new Date().getDate(), chave = c.id;
  for(var i=0;i<chave.length;i++) s = (s*31 + chave.charCodeAt(i)) % 997;
  return s%3;
}
function petPhoneChatMensagens(c){
  if(c.tipo === 'fan'){
    var presente = c.presente, favorito = String(presente[0])+' '+String(presente[1]);
    var v=petPhoneChatVariante(c);
    var abertura={
      timido:['Oi… lembra de mim? Fiquei feliz de te encontrar no Handshake. 💗','É-é você! O nosso encontro foi muito especial… 💗','Oi… fiquei pensando no nosso aperto de mão. 🌷'],
      animado:['OII!! Que bom te ver de novo! ⭐','AAAA! Olha quem apareceu no meu Chat!! 🎉','Você voltou! Que dia perfeito para um reencontro!! 💖'],
      fofo:['Oii! Adorei nosso encontro! 💕','Yay! Nosso reencontro merece estrelinhas! ✨','Oiee! Que alegria ver seu nome aqui! 🎀']
    };
    var oi=abertura[c.jeito][v];
    var jeito = typeof HS_JEITOS !== 'undefined' && HS_JEITOS[c.jeito];
    var recordacao = jeito && typeof jeito.fav === 'string' ? jeito.fav.replace('{p}',favorito) : 'Meu favorito é '+favorito+'!';
    var falas=[oi,recordacao];
    if(c.encontro){
      var dia=c.encontro.slice(8,10)+'/'+c.encontro.slice(5,7);
      falas.push(['Lembra de '+dia+'? Guardei aquele encontro com carinho. 💌',
        'Ainda lembro do nosso encontro de '+dia+'! ⭐',
        'O dia '+dia+' ficou no meu coração. 💖'][v]);
    }
    if(c.cafe) falas.push(['Adorei o carinho no Happy⭐Cafe! Quero te ver de novo no Handshake. ☕',
      'Foi tão bom ser atendido por você no Happy⭐Cafe! 🍰',
      'Valeu por lembrar de mim no Happy⭐Cafe! Até o próximo Handshake! 💗'][v]);
    return falas;
  }
  var p=petAtivo(), nomePet = p && p.nome || tr('seu Pet');
  var hora=new Date().getHours(), saudacao=hora<12?'Bom dia':hora<18?'Boa tarde':'Boa noite';
  var v=petPhoneChatVariante(c), preocupado=p && Number.isFinite(p.humor) && p.humor<40;
  if(c.id === 'idol:tsu') return [saudacao+', '+(contaJ && contaJ.nick || tr('Idol'))+'! ⭐',
    preocupado ? nomePet+' parece precisar de carinho. Que tal uma pausa no camarim? 🐾' :
      ['O camarim está uma graça! Já deu carinho para '+nomePet+' hoje?',
       nomePet+' está por perto? Hora de descansar um pouquinho antes do show! 🐾',
       'Um show fica melhor depois de brincar com '+nomePet+'! ✨'][v]];
  if(c.id === 'idol:lirika') return [saudacao+', Idol. 🌷',
    ['As lembranças dos fãs no Happy⭐Cafe! e no Handshake deixam os encontros especiais.',
     'Guardar as lembranças dos fãs também é cuidar da nossa história. 🌷',
     'Os reencontros no Café e no Handshake merecem carinho, mesmo nos dias calmos. 💌'][v]];
  return [saudacao+'! 🎀', ['Já passou no espelho do camarim? Quero ver seu próximo look de show! ✨',
    'Se você mudou o visual hoje, me conta depois! O espelho te espera. 💄',
    'Um laço, uma cor nova… que tal escolher um look para o próximo show? 👑'][v]];
}
function petPhoneChatReacao(c,opcao){
  var v=petPhoneChatVariante(c);
  if(c.tipo === 'fan'){
    var reacoes={
      timido:[['O-obrigada… vou guardar essa lembrança. 💗','Você lembrou de mim… 🥹','É-é tão bom saber disso… 🌷'],['Sério? Fico tão feliz… até logo! 🌷','A-até a próxima… vou esperar! 💗','Vou torcer baixinho por você… ✨']],
      animado:[['ISSOOO! Melhor encontro!! ⭐','AEEE! Vou contar pra todo mundo!! 🎉','Que demais! Meu coração tá pulando!! 💖'],['AEEE! Vou torcer muito por você!! 💖','Até a próxima! Não esquece de mim!! ⭐','SHOW! Já estou contando os dias!! 🎤']],
      fofo:[['Que fofura! Meu coração brilhou! 💕','Ownn! Você é um amor! 🎀','Nossas lembranças têm glitter! ✨'],['Combinado! Vou estar torcendo por você! 🎀','Até logo, estrelinha! 💌','Nos vemos no próximo encontro! 💖']]
    };
    return reacoes[c.jeito][opcao][v];
  }
  if(c.id === 'idol:tsu') return (opcao === 0 ? ['Isso! Um carinho no Pet e bora brilhar! ⭐','O Pet também faz parte do nosso time! 🐾','Cuidar do Pet é coisa de Idol estrela! ✨'] :
    ['Te espero no próximo show! ✨','Até logo! Vamos brilhar no palco! 🎤','O próximo show vai ser incrível! ⭐'])[v];
  if(c.id === 'idol:lirika') return (opcao === 0 ? ['Que bom. As pequenas coisas importam. 🌷','Que lindo. Guarde esse sentimento. 💌','Fico feliz de ouvir isso. 🌷'] :
    ['Até mais. Cuide das suas lembranças. 💖','Boa sorte no próximo encontro. 🌟','Até o próximo dia tranquilo. 🌸'])[v];
  return (opcao === 0 ? ['Aaa, quero ver esse visual! 🎀','Agora sim! Arrasa no espelho! 💄','É isso! Mostra seu brilho! 👑'] :
    ['Boa! Vai ficar lindo no palco! ⭐','Até o próximo show! 🎀','Te espero na próxima apresentação! 💕'])[v];
}
function petPhoneChatSincronizar(){
  var chave = petPhoneContaChave();
  if(chave !== petPhoneChatSessao){
    petPhoneChatSessao = chave;
    petPhoneChatConversa = '';
    petPhoneChatRespostas = Object.create(null);
  }
}
function petPhoneChatHtml(){
  petPhoneChatSincronizar();
  var contatos = petPhoneChatContatos();
  var contato = contatos.find(function(c){return c.id === petPhoneChatConversa;});
  var aviso = '<p class="petphone-chat-aviso">✦ '+escHtml(tr('Conversas fictícias do jogo · ninguém recebe mensagens'))+'</p>';
  if(!contato){
    petPhoneChatConversa = '';
    var lista = contatos.map(function(c){
      return '<button type="button" class="petphone-chat-contato" data-phone="chat-abrir" data-conversa="'+escHtml(c.id)+'">'+
        petPhoneChatAvatarHtml(c)+'<span class="petphone-chat-contato-texto"><b>'+escHtml(c.nome)+
        '</b><small>'+escHtml(c.papel)+'</small></span><span aria-hidden="true">›</span></button>';
    }).join('');
    var temFas = contatos.some(function(c){return c.tipo === 'fan';});
    return aviso+'<div class="petphone-chat-lista">'+lista+'</div>'+
      (!temFas ? '<p class="petphone-chat-dica">💌 '+escHtml(tr('Conheça fãs no Handshake⭐Event! para guardar novas lembranças aqui.'))+'</p>' : '');
  }
  var mensagens = petPhoneChatMensagens(contato);
  var resposta = petPhoneChatRespostas[contato.id];
  var opcoes = contato.tipo === 'fan' ? ['Vou guardar nossa lembrança! 💖','Até o próximo encontro! ⭐'] :
    ['Vou cuidar de tudo! 💕','Até o próximo show! ✨'];
  return '<div class="petphone-chat-pessoa">'+petPhoneChatAvatarHtml(contato)+
    '<div><b>'+escHtml(contato.nome)+'</b><small>'+escHtml(contato.papel)+'</small></div></div>'+aviso+
    '<div class="petphone-chat-falas">'+mensagens.map(function(msg){
      return '<p class="petphone-chat-msg petphone-chat-npc">'+escHtml(msg)+'</p>';
    }).join('')+(resposta ? '<p class="petphone-chat-msg petphone-chat-eu">'+escHtml(opcoes[resposta.opcao])+'</p>'+
      '<p class="petphone-chat-msg petphone-chat-npc">'+escHtml(resposta.reacao)+'</p>' : '')+'</div>'+
    (!resposta ? '<div class="petphone-chat-opcoes"><span>'+escHtml(tr('Escolha uma resposta:'))+'</span>'+opcoes.map(function(op,i){
      return '<button type="button" data-phone="chat-responder" data-resposta="'+i+'">'+escHtml(op)+'</button>';
    }).join('')+'</div>' : '<p class="petphone-chat-fim">✦ '+escHtml(tr('Conversa por hoje concluída.'))+'</p>');
}
function petPhoneChatAbrir(id){
  if(!petPhoneOpen || petPhoneTela !== 'chat') return false;
  petPhoneChatSincronizar();
  if(!petPhoneChatContatos().some(function(c){return c.id === id;})) return false;
  petPhoneChatConversa = id;petPhoneRender();
  var corpo = $('petPhoneCorpo');if(corpo)corpo.scrollTop = 0;
  return true;
}
function petPhoneChatResponder(opcao){
  if(!petPhoneOpen || petPhoneTela !== 'chat' || (opcao !== 0 && opcao !== 1)) return false;
  petPhoneChatSincronizar();
  var contato = petPhoneChatContatos().find(function(c){return c.id === petPhoneChatConversa;});
  if(!contato || petPhoneChatRespostas[contato.id]) return false;
  petPhoneChatRespostas[contato.id] = {opcao:opcao,reacao:petPhoneChatReacao(contato,opcao)};
  petPhoneRender();
  var corpo = $('petPhoneCorpo');if(corpo)corpo.scrollTop = corpo.scrollHeight || 0;
  return true;
}
function petPhoneRender(){
  if(!petPhoneOpen) return;
  var corpo = $('petPhoneCorpo'); if(!corpo) return;
  var nomes = PET_PHONE_APPS[LANG] || PET_PHONE_APPS.pt;
  if(petPhoneTela === 'home'){
    corpo.innerHTML = '<div class="petphone-capa"><canvas id="petPhoneWp" width="260" height="125" aria-hidden="true"></canvas>' +
      '<strong>✦ ' + escHtml(tr('Meu Idol')) + ' · ' + escHtml(contaJ && contaJ.nick || '') + '</strong><span>🐾 ' + escHtml(petAtivo() && petAtivo().nome || '') + '</span></div>' +
      '<div class="petphone-apps">' + [['agenda',nomes[0]],['chat',nomes[1]],['fotos',nomes[2]],['perfil',nomes[3]]].map(function(a){
        return '<button type="button" data-phone="' + a[0] + '"><canvas data-phone-icon="' + a[0] + '" width="128" height="128" aria-hidden="true"></canvas><b>' + escHtml(a[1]) + '</b></button>';
      }).join('') + '</div>';
    petPhonePapel();
    petPhoneIcones(corpo);
    return;
  }
  var idx = {agenda:0,chat:1,fotos:2,perfil:3}[petPhoneTela];
  var titulo = ['📅 ','💬 ','📸 ','💖 '][idx] + nomes[idx];
  var conteudo = '';
  if(petPhoneTela === 'agenda') conteudo = petPhoneAgendaHtml();
  else if(petPhoneTela === 'chat') conteudo = petPhoneChatHtml();
  else if(petPhoneTela === 'fotos') conteudo = petPhoneFotosHtml();
  else if(petPhoneTela === 'perfil') conteudo = '<div class="petphone-appbox"><span>💖✨</span><p>' + escHtml(contaJ && contaJ.nick || tr('Meu Idol')) + '</p><button type="button" data-phone="abrir-perfil">👤 ' + escHtml(tr('Abrir Perfil')) + '</button></div>';
  corpo.innerHTML = '<header class="petphone-pagetopo"><button type="button" data-phone="voltar" aria-label="Voltar">‹</button><h2>' + titulo + '</h2></header>' + conteudo;
  if(petPhoneTela === 'chat') petPhoneChatRetratos(corpo);
  if(petPhoneTela === 'fotos'){
    petPhoneFotoRender(); petPhoneMomentosRender();
  }
}
function petPhoneAbrir(tela){
  if(!petOpen || petView !== 'room' || petGame || !petAtivo() || !contaJ) return false;
  if(petPhoneFotoDono && petPhoneFotoDono !== petPhoneFotoChave()) petPhoneFotoLimpar();
  petPhoneMomentosConferir();
  petPhoneFotosAba = 'camera';
  petPhoneAgendaDados = null; petPhoneAgendaDono = '';
  petPhoneTela = ['agenda','chat','fotos','perfil'].indexOf(tela) >= 0 ? tela : 'home';
  $('petPhone').hidden = false; petPhoneOpen = true;
  $('petPhoneHora').textContent = new Date().toLocaleTimeString(LANG === 'pt' ? 'pt-BR' : undefined,{hour:'2-digit',minute:'2-digit'});
  $('petPhone').style.setProperty('--petphone-oshi',({tsu:'#9b30d9',lirika:'#22c55e',pati:'#4169e1'})[OSHI]||'#ff6fb5');
  petAnimParar(); petPhoneRender();
  if(petPhoneTela === 'agenda') petPhoneAgendaCarregar();
  $('petPhoneX').focus();
  return true;
}
function petPhoneFechar(retomar){
  if(!petPhoneOpen) return false;
  petPhoneOpen = false; petPhoneTela = 'home'; petPhoneFotosAba = 'camera'; petPhoneAgendaReq++;
  petPhoneAgendaDados = null; petPhoneAgendaDono = '';
  petPhoneFotoLimpar();
  $('petPhone').hidden = true;
  if(retomar !== false){ petAnimLigar(); var botao = document.querySelector('#petLifeNav [data-life="celular"]'); if(botao) botao.focus(); }
  return true;
}
function petPhoneVoltar(){
  if(!petPhoneOpen) return false;
  if(petPhoneTela === 'chat' && petPhoneChatConversa){
    petPhoneChatConversa = '';petPhoneRender();return true;
  }
  if(petPhoneTela === 'home') return petPhoneFechar();
  petPhoneTela = 'home'; petPhoneAgendaReq++; petPhoneRender(); return true;
}
function petPhoneTelaAbrir(k){
  if(!petPhoneOpen || ['agenda','chat','fotos','perfil'].indexOf(k) < 0) return false;
  if(k === 'chat') petPhoneChatConversa = '';
  if(k === 'fotos') petPhoneFotosAba = 'camera';
  petPhoneTela = k; petPhoneRender();
  if(k === 'agenda') petPhoneAgendaCarregar();
  return true;
}
function petPhoneAgendaCarregar(){
  if(!petPhoneOpen || petPhoneTela !== 'agenda') return;
  var req = ++petPhoneAgendaReq, dono = petPhoneContaChave();
  petPhoneAgendaDados = null; petPhoneAgendaDono = dono; petPhoneRender();
  contaRpc('missoes').then(function(d){
    if(req !== petPhoneAgendaReq || !petPhoneOpen || petPhoneTela !== 'agenda' || dono !== petPhoneContaChave()) return;
    petPhoneAgendaDados = Array.isArray(d) ? d : []; petPhoneAgendaDono = dono; petPhoneRender();
  }).catch(function(){
    if(req === petPhoneAgendaReq && petPhoneOpen && petPhoneTela === 'agenda' && dono === petPhoneContaChave()){
      petPhoneAgendaDados = []; petPhoneRender();
    }
  });
}
function petPhoneExterno(k){
  if(!petPhoneOpen || (k !== 'album' && k !== 'perfil')) return false;
  petPhoneVoltarTela = petPhoneTela;
  petPhoneFechar(false);
  if(!petLifeAbrir(k === 'album' ? 'album' : 'trofeus')){
    petPhoneVoltarTela = ''; petPhoneAbrir(); return false;
  }
  return true;
}
function petLifeUI(){
  var nomes = PET_LIFE_TEXTOS[LANG] || PET_LIFE_TEXTOS.pt;
  ['espelho','celular','estante','trofeus','album'].forEach(function(k,i){
    var b = document.querySelector('#petRoom [data-life="' + k + '"]');
    if(!b) return;
    b.querySelector('span').textContent = nomes[i];
    b.setAttribute('aria-label', nomes[i]);
  });
  var estante = $('petLifeEstante');
  if(estante) estante.setAttribute('aria-label', tr('Estante de troféus'));
  if(petView !== 'room'){
    var painel = $('petLifeEstante'), botao = document.querySelector('#petLifeNav [data-life="estante"]');
    if(painel) painel.hidden = true;
    if(botao) botao.setAttribute('aria-expanded','false');
  }
}
// A origem da navegação vive apenas nesta aba e nunca entra nos saves do Pet.
var petLifeOrigem = '', petLifeVeioHub = false, petLifeHubAntes = false;
function petLifeVoltaUI(){
  var linha = $('hubHojeLinha');
  if(!linha) return;
  var voltar = $('petLifeVoltar');
  if(petLifeOrigem !== 'celular'){
    if(voltar) voltar.remove();
    return;
  }
  if(!voltar){
    voltar = document.createElement('button');
    voltar.type = 'button'; voltar.id = 'petLifeVoltar'; voltar.className = 'petlife-voltar';
    voltar.onclick = function(){ petLifeRetornar('celular'); };
  }
  // O Hub ainda pode estar na tela inicial "TOQUE PARA COMEÇAR".
  // Nesse caso o retorno não pode ficar escondido dentro de #hubMenu.
  if(!hubComecou) $('hubToque').after(voltar);
  else linha.insertBefore(voltar, linha.firstChild);
  voltar.textContent = '↩ ' + tr('Meu Camarim⭐Life!');
}
function petLifeCancelar(k){
  if(k && petLifeOrigem !== k) return false;
  if(!petLifeOrigem) return false;
  petLifeOrigem = ''; petLifeVoltaUI();
  petPhoneVoltarTela = '';
  return true;
}
function petLifeRetornar(k){
  if(petLifeOrigem !== k || !contaJ || state !== 'menu') return false;
  var veioHub = petLifeVeioHub, hubAntes = petLifeHubAntes, phoneTela = petPhoneVoltarTela;
  petLifeCancelar(k);
  if(!hubAntes && !hubOv.hidden) hubFechar();
  petVeioHub = veioHub;
  if(!hubOv.hidden) hubMusicaParar();
  petOpenUI(); // reabre o mesmo quarto; sem novo save ou progressão de ML1.1
  if(phoneTela && petOpen) petPhoneAbrir(phoneTela);
  return true;
}
// Só navega para telas existentes. Nada é comprado, creditado ou salvo aqui.
function petLifeAbrir(k){
  if(!petOpen || !petAtivo() || petView !== 'room' || petGame) return false;
  var painel = $('petLifeEstante'), botao = document.querySelector('#petLifeNav [data-life="estante"]');
  if(k === 'estante'){
    painel.hidden = !painel.hidden;
    if(botao) botao.setAttribute('aria-expanded', String(!painel.hidden));
    return true;
  }
  if(['espelho','celular','trofeus','album'].indexOf(k) < 0) return false;
  if(!contaJ){ contaEntrar(); return true; } // mesmas proteções do Provador, Perfil e Álbum
  if(painel) painel.hidden = true;
  if(botao) botao.setAttribute('aria-expanded','false');
  if(k === 'celular') return petPhoneAbrir(); // não sai do quarto nem passa pelo Hub
  petLifeVeioHub = petVeioHub;
  petLifeHubAntes = !hubOv.hidden;
  petClose(); // conserva o encerramento normal do Backstage e o retorno ao Hub
  if(hubOv.hidden) hubMostrar();
  petLifeOrigem = k;
  petLifeVoltaUI();
  if(k === 'espelho') shopAbrir();
  else if(k === 'trofeus') perfAbrir();
  else if(k === 'album'){
    $('albumTit').textContent = '📖 ' + tr('Álbum de cards');
    albumAbrir();
  }
  return true;
}
function petLifeTap(lx, ly){
  if(!petOpen || petView !== 'room' || petGame) return false;
  var k = petLifeHit(lx, ly);
  return k ? petLifeAbrir(k) : false;
}
// Personalidade visual: só usa o tempo de desenho, sem timers ou dados novos no save.
function petIdleJeito(k, cfg, t, parado){
  if(!parado) return { x:0, y:0, brilho:false };
  if(k === 'meu'){
    // O visual já escolhido define o jeito: olhos sonolentos, felizes ou curiosos.
    k = cfg && cfg.olhos === 'sono' ? 'lirika' :
        cfg && cfg.olhos === 'feliz' ? 'tsu' : 'pati';
  }
  if(k === 'tsu') return { x:Math.sin(t * .042) * 2.2,
    y:-Math.pow(Math.max(0, Math.sin(t * .095)), 6) * 5.5, brilho:false };
  if(k === 'lirika') return { x:Math.sin(t * .012) * .7,
    y:Math.sin(t * .027) * 1.2, brilho:false };
  // Pucchi observa o quarto e dá passinhos pequenos, com curiosidade discreta.
  return { x:Math.sin(t * .017) * 5,
    y:-Math.pow(Math.max(0, Math.sin(t * .053)), 8) * 2.5,
    brilho:Math.sin(t * .033) > .985 };
}
// A estrelinha do minijogo Brincar também aparece às vezes no camarim.
// Tudo é visual e determinístico: nenhum contador, timer, recompensa ou save.
function petEstrelaBrinquedo(x, px, py, ang, esc){
  x.save(); x.translate(px, py); x.rotate(ang); x.scale(esc, esc);
  x.fillStyle = '#ffe14d'; x.strokeStyle = '#f59e0b'; x.lineWidth = 1;
  x.beginPath();
  for(var q = 0; q < 10; q++){
    var rr = q % 2 ? 4 : 9, an = q * Math.PI / 5 - Math.PI / 2;
    x[q ? 'lineTo' : 'moveTo'](Math.cos(an) * rr, Math.sin(an) * rr);
  }
  x.closePath(); x.fill(); x.stroke(); x.restore();
}
// Passinho curto até a estrelinha e volta ao mesmo lugar, no tempo do loop existente.
// Nunca altera PET_X, o save, o hitbox ou o estado das ações do jogador.
function petPasseioBrinquedo(k, cfg, t, livre){
  var fase = t % 620;
  if(!livre || fase < 230 || fase > 410) return {x:0,y:0};
  k = petRecepcaoJeito(k, cfg);
  var u = (fase - 230) / 180;
  var aproxima = Math.pow(Math.sin(Math.PI * u), 2);
  var distancia = k === 'tsu' ? 20 : k === 'lirika' ? 8 : 24;
  var passo = k === 'lirika' ? .038 : k === 'tsu' ? .115 : .077;
  return {x:-distancia * aproxima,
    y:-Math.abs(Math.sin(fase * passo)) * (k === 'tsu' ? 2.5 : k === 'pati' ? 1.8 : .7) * aproxima};
}
function petBrinquedoEspontaneo(x, k, cfg, t, ativo){
  var fase = t % 620;
  if(!ativo || fase < 240 || fase > 390) return false;
  var u = (fase - 240) / 150, fade = Math.min(1, u * 8, (1 - u) * 8);
  var jeito = k === 'meu' ? (cfg && cfg.olhos === 'sono' ? 'lirika' :
    cfg && cfg.olhos === 'feliz' ? 'tsu' : 'pati') : k;
  var px = 184 + (jeito === 'pati' ? 28 * u : jeito === 'tsu' ? 37 * u : 8 * u);
  var py = PET_FLOOR - 13 - (jeito === 'tsu' ? Math.abs(Math.sin(fase * .12)) * 12 :
    jeito === 'pati' ? Math.abs(Math.sin(fase * .07)) * 5 : 0);
  x.save(); x.globalAlpha = fade;
  petEstrelaBrinquedo(x, px, py, fase * (jeito === 'lirika' ? .012 : .055), .85);
  if(jeito === 'pati' && u > .55){ x.font = '13px sans-serif'; x.fillStyle = '#fff2a2';
    x.fillText('✧', px + 14, py - 12); }
  x.restore();
  return true;
}
// O Pet admira o pôster gratuito quando ele está realmente exposto no mural.
// Reação somente visual: respeita a decoração guardada e a pausa das animações.
// Cada espécie presta atenção primeiro à decoração que combina com seu jeito.
// Usa apenas objetos já expostos e imagens prontas; o pôster gratuito é o fallback.
function petDecorFavorito(k, cfg, decor, imgs){
  if(k === 'meu') k = cfg && cfg.olhos === 'sono' ? 'lirika' :
    cfg && cfg.olhos === 'feliz' ? 'tsu' : 'pati';
  var preferencias = k === 'tsu' ? ['brs48','zipper'] :
    k === 'lirika' ? ['campo','banner','zipper'] :
    ['nebyura','doces','zipper'];
  for(var i = 0; i < preferencias.length; i++){
    var chave = preferencias[i], img = imgs[chave];
    if(decor && decor[chave] && img && img.complete && img.naturalWidth){
      for(var j = 0; j < PET_DECOR.length; j++) if(PET_DECOR[j][0] === chave)
        return { item:PET_DECOR[j], jeito:k };
    }
  }
  return null;
}
function petDecorReacao(x, k, cfg, t, ativo){
  var fase = t % 860;
  if(!ativo || fase < 350 || fase > 490) return false;
  var alvo = petDecorFavorito(k, cfg, petData && petData.decor, petDecorImgs);
  if(!alvo) return false;
  var u = (fase - 350) / 140, alfa = Math.min(1, u * 8, (1 - u) * 8);
  var it = alvo.item, jeito = alvo.jeito;
  var origemX = it[3] + it[5] / 2, origemY = it[4] + it[6] / 2;
  var passo = jeito === 'tsu' ? Math.abs(Math.sin(u * 13)) * 5 :
    jeito === 'pati' ? Math.sin(u * 11) * 3 : 0;
  x.save(); x.globalAlpha = alfa; x.textAlign = 'center';
  x.fillStyle = jeito === 'lirika' ? '#b8f2ba' : jeito === 'pati' ? '#b7ddff' : '#ffe47c';
  x.font = jeito === 'tsu' ? '17px sans-serif' : '13px sans-serif';
  x.fillText('✦', origemX + (PET_X - 18 - origemX) * u,
    origemY + (PET_FLOOR - 60 - origemY) * u - passo);
  if(jeito === 'pati' && petPreferenciaAtividade(k,cfg,'explorar')){ x.font = '11px sans-serif';
    x.fillText('✧', origemX + (PET_X - 30 - origemX) * u,
      origemY - 10 + (PET_FLOOR - 80 - origemY) * u);
    x.fillText('✦', PET_X + 25, PET_FLOOR - 70 - Math.sin(u * 9) * 4); }
  x.restore();
  return true;
}
// Pequena rotina cíclica de descanso, observação e brincadeira.
// Não muda p.dorme, barras ou saves; somente a pose desenhada quando ocioso.
function petRotinaVisual(k, cfg, t, ativo){
  if(!ativo) return { modo:'', pulo:0 };
  if(k === 'meu') k = cfg && cfg.olhos === 'sono' ? 'lirika' :
    cfg && cfg.olhos === 'feliz' ? 'tsu' : 'pati';
  var fase = t % 900;
  var descanso = k === 'lirika' ? fase >= 130 && fase < 320 :
    k === 'pati' ? fase >= 590 && fase < 655 : fase >= 90 && fase < 155;
  var observa = k === 'pati' ? fase >= 160 && fase < 325 :
    k === 'lirika' ? fase >= 430 && fase < 515 : fase >= 275 && fase < 345;
  var brinca = k === 'tsu' ? fase >= 410 && fase < 535 :
    k === 'pati' ? fase >= 350 && fase < 435 : fase >= 665 && fase < 705;
  return { modo:descanso?'descanso':observa?'observa':brinca?'brinca':'',
    pulo:brinca ? Math.pow(Math.max(0,Math.sin(fase * (k === 'tsu' ? .1 : .055))),6) * (k === 'tsu' ? 4 : 2) : 0 };
}
// Saudação visual curta ao abrir o camarim; sem áudio, timer ou persistência.
var petRecepcaoFrames = 0;
function petRecepcaoJeito(k, cfg){
  if(k !== 'meu') return k;
  return cfg && cfg.olhos === 'sono' ? 'lirika' :
    cfg && cfg.olhos === 'feliz' ? 'tsu' : 'pati';
}
function petRecepcaoPulo(k, cfg, restante){
  if(restante <= 0) return 0;
  var t = (90 - restante) / 90, jeito = petRecepcaoJeito(k, cfg);
  return jeito === 'tsu' ? Math.pow(Math.max(0,Math.sin(t * Math.PI * 4)),2) * 6 :
    jeito === 'pati' ? Math.pow(Math.max(0,Math.sin(t * Math.PI * 2)),2) * 2 : 0;
}
function petRecepcaoDesenhar(x, k, cfg, restante){
  if(restante <= 0) return;
  var jeito = petRecepcaoJeito(k, cfg), t = (90 - restante) / 90;
  x.save(); x.globalAlpha = Math.min(1, (1 - t) * 4);
  x.textAlign = 'center'; x.fillStyle = jeito === 'lirika' ? '#b8f2ba' :
    jeito === 'pati' ? '#b7ddff' : '#ff8ac9';
  x.font = jeito === 'tsu' ? '18px sans-serif' : '15px sans-serif';
  x.fillText(jeito === 'tsu' ? '♥' : '✦', PET_X + 21, PET_FLOOR - 69 - t * 18);
  if(jeito === 'pati'){ x.font = '11px sans-serif';
    x.fillText('✧', PET_X - 23, PET_FLOOR - 57 - t * 10); }
  x.restore();
}
// Pequena pausa de surpresa antes do brinquedo ou de admirar o mural.
// Apenas função do quadro atual: sem timers e sem alterar o estado do Pet.
function petSurpresaAntes(k, cfg, t, livre){
  if(!livre) return null;
  var faseToy = t % 620, faseDecor = t % 860;
  var toy = faseToy >= 206 && faseToy < 230;
  var decor = !toy && (faseToy < 230 || faseToy > 410) &&
    faseDecor >= 325 && faseDecor < 350 &&
    !!petDecorFavorito(k, cfg, petData && petData.decor, petDecorImgs);
  if(!toy && !decor) return null;
  var jeito = petRecepcaoJeito(k, cfg), u = toy ? (faseToy - 206) / 24 : (faseDecor - 325) / 25;
  return { ex:jeito === 'tsu' ? 'feliz' : jeito === 'lirika' ? 'sono' : null,
    sinal:jeito === 'tsu' ? '✦' : jeito === 'lirika' ? '✧' : '!',
    cor:jeito === 'tsu' ? '#f8b21c' : jeito === 'lirika' ? '#69b881' : '#5b8be5',
    alfa:Math.sin(u * Math.PI) };
}
// Cumprimento espontâneo entre Pet e Idol, só com estado visual do quadro.
// Nunca desloca a posição habitual, o hitbox, as necessidades ou o save.
function petAmizadeVisual(k, cfg, t, livre){
  if(!livre) return null;
  var fase = t % 960, faseToy = t % 620, faseDecor = t % 860;
  if(fase < 680 || fase >= 790 ||
    (faseToy >= 206 && faseToy <= 410) ||
    (faseDecor >= 325 && faseDecor <= 490)) return null;
  var u = (fase - 680) / 110, alfa = Math.sin(u * Math.PI);
  var jeito = petRecepcaoJeito(k, cfg);
  return {x:-(jeito === 'tsu' ? 9 : jeito === 'lirika' ? 3 : 7) * alfa,
    ex:jeito === 'tsu' ? 'amor' : 'feliz',
    sinal:jeito === 'tsu' ? '♥' : jeito === 'lirika' ? '♡' : '✧',
    cor:jeito === 'tsu' ? '#ff8ac9' : jeito === 'lirika' ? '#b8f2ba' : '#b7ddff',
    u:u, alfa:alfa};
}
// Resposta ao toque no Idol, sincronizada ao emote já existente (sem timer novo).
function petToqueIdolVisual(k, cfg, t, ativo){
  if(!ativo || t < 0 || t >= 46) return null;
  var jeito = petRecepcaoJeito(k, cfg), u = t / 46;
  var alfa = Math.sin(u * Math.PI);
  return { ex:jeito === 'lirika' ? 'amor' : 'feliz',
    x:-(jeito === 'lirika' ? 2 : jeito === 'pati' ? 4 : 0) * alfa,
    sinal:jeito === 'tsu' ? '♥' : jeito === 'lirika' ? '♡' : '✧',
    cor:jeito === 'tsu' ? '#ff8ac9' : jeito === 'lirika' ? '#b8f2ba' : '#b7ddff',
    u:u, alfa:alfa };
}
// O Idol acompanha por instantes a estrelinha já desenhada no quarto.
// Somente cálculo do quadro; a pose retorna ao eixo habitual sem estado salvo.
function petIdolAcompanhaBrinquedo(k, cfg, t, livre){
  var fase = t % 620, faseDecor = t % 860;
  if(!livre || fase < 265 || fase >= 360 ||
    (faseDecor >= 350 && faseDecor <= 490)) return null;
  var u = (fase - 265) / 95, alfa = Math.sin(u * Math.PI);
  var jeito = petRecepcaoJeito(k, cfg);
  return { inclina:(jeito === 'tsu' ? .03 : jeito === 'lirika' ? .012 : .022) * alfa,
    sinal:jeito === 'tsu' ? '✦' : jeito === 'lirika' ? '♡' : '✧',
    cor:jeito === 'tsu' ? '#ffdb81' : jeito === 'lirika' ? '#b8f2ba' : '#b7ddff',
    u:u, alfa:alfa };
}
function petDrawRoom(){
  var p = petAtivo(); if(!p) return;
  if(!petBg || petBgOshi !== OSHI) petMakeBg();
  var x = petCtx;
  x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, petCv.width, petCv.height);
  x.drawImage(petBg, 0, 0);
  x.setTransform(petDpr, 0, 0, petDpr, 0, 0);
  if(petGame){ petGameDraw(x, p); return; }   // minijogos do ⭐ Brincar (V2.1)

  // Lâmpadas do espelho piscando
  for(var i = 0; i < 12; i++){
    var bx = i < 4 ? 40 + i * 29.3 : i < 8 ? 34 : 134, by = i < 4 ? 45 : 58 + ((i - 4) % 4) * 22;
    x.globalAlpha = .6 + .4 * Math.sin(petT * .06 + i * 1.7);
    x.fillStyle = '#fff7c2'; x.beginPath(); x.arc(bx, by, 3.2, 0, 7); x.fill();
  }
  x.globalAlpha = 1;

  petRoomBack(x, p);   // tema da temporada + brilho de estágio (V2.1)
  var mood = petMood(p), sleepy = p.dorme || p.energia < 25, happy = mood[1] === 'Feliz!';

  // Quando estão livres, Pet e Idol trocam um gesto breve de amizade.
  var amizade = petAmizadeVisual(petData.ativo, p.cfg, petT,
    !sleepy && !petAnim && petHop <= 0 && p.fome >= 25 && p.humor >= 25 &&
    petRecepcaoFrames <= 0 && petCharT <= 0 && petLove <= 0 && petSmile <= 0);

  var toqueIdol = petEmote && petEmote.toqueIdol ?
    petToqueIdolVisual(petData.ativo, p.cfg, petEmote.t,
      !sleepy && !petAnim && p.fome >= 25 && p.humor >= 25 &&
      petRecepcaoFrames <= 0 && petLove <= 0) : null;

  // O Idol observa a brincadeira espontânea, sem deslocar o lugar habitual.
  var idolBrincando = petIdolAcompanhaBrinquedo(petData.ativo, p.cfg, petT,
    !sleepy && !petAnim && petHop <= 0 && p.fome >= 25 && p.humor >= 25 &&
    petRecepcaoFrames <= 0 && petCharT <= 0 && petLove <= 0 && petSmile <= 0);

  // Personagem ativo (Tsu, Lirika, Pati ou "Você" com o visual salvo); pula quando é tocado
  var expr = (petSmile > 0 || petCharT > 0 || happy || amizade || idolBrincando) ? 2 : 0;
  var chop = petCharT > 0 ? Math.sin((24 - petCharT) / 24 * Math.PI) * 12 : 0;
  var og = g;
  try{
    g = x; g.save();
    g.translate(78, PET_FLOOR - 44 * 2.4 + Math.sin(petT * .05) * 1.5 - chop);
    if(idolBrincando) g.rotate(idolBrincando.inclina);
    g.scale(2.4, 2.4);
    drawChar(CH[sel], 0, 0, 0, expr);
    g.restore();
  } finally { g = og; }
  if(idolBrincando){ x.save(); x.globalAlpha = idolBrincando.alfa * .8;
    x.fillStyle = idolBrincando.cor; x.font = '13px sans-serif'; x.textAlign = 'center';
    x.fillText(idolBrincando.sinal, 125 + 49 * idolBrincando.u,
      PET_FLOOR - 105 + 61 * idolBrincando.u -
      Math.sin(idolBrincando.u * Math.PI) * 4);
    x.restore(); }

  // O mesmo brinquedo do Brincar visita o quarto sem afetar o minijogo.
  petBrinquedoEspontaneo(x, petData.ativo, p.cfg, petT,
    !sleepy && !petAnim && !petGame && petHop <= 0);
  // Sombra + pet: o jeito aparece apenas quando está acordado e sem ação em andamento.
  var hop = petHop > 0 ? Math.sin((20 - petHop) / 20 * Math.PI) * 14 : 0;
  var recebendo = petRecepcaoFrames > 0 && !sleepy && !petAnim && petHop <= 0;
  if(recebendo) hop += petRecepcaoPulo(petData.ativo, p.cfg, petRecepcaoFrames);
  var livre = !sleepy && !petAnim && petHop <= 0 && p.fome >= 25 && p.humor >= 25 && !recebendo;
  var rotina = petRotinaVisual(petData.ativo, p.cfg, petT, livre);
  hop += rotina.pulo;
  var jeito = petIdleJeito(petData.ativo, p.cfg, petT, livre);
  if(rotina.modo === 'descanso'){ jeito.x *= .25; jeito.y *= .25; }
  var passeio = petPasseioBrinquedo(petData.ativo, p.cfg, petT, livre);
  var surpresa = petSurpresaAntes(petData.ativo, p.cfg, petT, livre);
  jeito.x += passeio.x + (amizade ? amizade.x : 0) + (toqueIdol ? toqueIdol.x : 0); jeito.y += passeio.y;
  petDecorReacao(x, petData.ativo, p.cfg, petT, !sleepy && !petAnim && petHop <= 0);
  x.fillStyle = 'rgba(80,30,120,.18)'; x.beginPath(); x.ellipse(PET_X + jeito.x, PET_FLOOR + 2, 26 - hop * .5, 5, 0, 0, 7); x.fill();
  x.save(); x.translate(jeito.x, jeito.y);
  drawPet(x, petType(petData.ativo), PET_X, PET_FLOOR - 12 * PET_SC - hop, PET_SC,
    sleepy ? petT * .35 : petT,
    toqueIdol ? toqueIdol.ex : (petEx(p) || (amizade ? amizade.ex : (surpresa ? surpresa.ex : (rotina.modo === 'descanso' ? 'sono' : rotina.modo === 'brinca' ? 'feliz' : null)))));
  petDrawDirt(x, p, PET_X, PET_FLOOR - 12 * PET_SC - hop);
  petRoomFront(x, p, hop);   // chapéu do tema, estrelinhas de estágio e promoção (V2.1)
  x.restore();
  if(toqueIdol){ x.save(); x.globalAlpha = toqueIdol.alfa * .9; x.fillStyle = toqueIdol.cor;
    x.textAlign = 'center'; x.font = '15px sans-serif';
    x.fillText(toqueIdol.sinal, PET_X + jeito.x - 27,
      PET_FLOOR - 79 - Math.sin(toqueIdol.u * Math.PI) * 9);
    x.restore(); }
  if(amizade){ x.save(); x.globalAlpha = amizade.alfa * .85; x.fillStyle = amizade.cor;
    x.textAlign = 'center'; x.font = '16px sans-serif';
    x.fillText(amizade.sinal, 206 - 52 * amizade.u,
      PET_FLOOR - 83 - Math.sin(amizade.u * Math.PI) * 9);
    x.restore(); }
  if(surpresa){ x.save(); x.globalAlpha = surpresa.alfa; x.fillStyle = surpresa.cor;
    x.textAlign = 'center'; x.font = '900 15px sans-serif';
    x.fillText(surpresa.sinal, PET_X + jeito.x + 22, PET_FLOOR - 68 + jeito.y);
    x.restore(); }
  if(recebendo) petRecepcaoDesenhar(x, petData.ativo, p.cfg, petRecepcaoFrames);
  if(rotina.modo === 'descanso' && petPreferenciaAtividade(petData.ativo,p.cfg,'descanso')){
    x.save(); x.globalAlpha = .5; x.font = '12px sans-serif'; x.fillStyle = '#b8f2ba';
    x.fillText('✧', PET_X + 24, PET_FLOOR - 64); x.restore();
  }
  if(petRecepcaoFrames > 0) petRecepcaoFrames = Math.max(0, petRecepcaoFrames - petDrawDelta);
  if(jeito.brilho){ x.save(); x.fillStyle = '#ffe47c'; x.font = '12px sans-serif';
    x.fillText('✧', PET_X + jeito.x + 22, PET_FLOOR - 67 + jeito.y); x.restore(); }

  petDrawExtras(x, p);
  petDesenharLembranca(x);
  // Balão de humor acima do pet
  x.font = '18px sans-serif'; x.textAlign = 'center'; x.fillStyle = '#000';
  x.fillText(mood[0], PET_X + 4, PET_FLOOR - 66 - petMoodLift(p) + Math.sin(petT * .07) * 3);

  // Efeitos (corações do carinho etc.)
  for(var k = petFx.length - 1; k >= 0; k--){
    var e = petFx[k]; e.t+=petDrawDelta;
    x.globalAlpha = Math.max(0, 1 - e.t / 50);
    x.font = '16px sans-serif'; x.fillText(e.s, e.x + Math.sin(e.t * .2 + k) * 6, e.y - e.t * .8);
    if(e.t > 50) petFx.splice(k, 1);
  }
  x.globalAlpha = 1;
  petDrawEmote(x);   // balão do personagem quando é tocado
  petDrawTalk(x);    // balão de fala do pet (💬 Conversar)
  if(petHop > 0) petHop=Math.max(0,petHop-petDrawDelta);
  if(petSmile > 0) petSmile=Math.max(0,petSmile-petDrawDelta);
  if(petCharT > 0) petCharT=Math.max(0,petCharT-petDrawDelta);
  if(petLove > 0) petLove=Math.max(0,petLove-petDrawDelta);
}
var petRaf=0,petDrawDelta=1,petDrawDeltaPending=0;
function petLoop(ms){
  petRaf=0;
  if(!petOpen||petPhoneOpen||!twAnimacaoVisivel($('petov'))){petDrawDeltaPending=0;return;}
  var cv=$('petCv'),mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30());
  var antes=petT,delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta(cv,ms):1;
  petT+=delta;petDrawDeltaPending+=delta;
  sync();   // a sincronização de áudio/estado continua em todos os quadros lógicos
  if(!window.TWMotionLifecycle||TWMotionLifecycle.render30Due(cv,ms)){
    petDrawDelta=Math.max(.1,petDrawDeltaPending||delta);petDrawDeltaPending=0;
    try{
      if(petView==='room'&&petData)petDrawRoom();else if(petView==='make')petDrawMake();else petDrawPick();
    }catch(err){console.error('pet:',err);}
    finally{petDrawDelta=1;}
  }
  if(petData&&Math.floor(petT/300)>Math.floor(antes/300)){petTick();petSave();petUI();} // relógio lógico preservado (~5 s)
  petRaf=requestAnimationFrame(petLoop);
}
function petAnimLigar(){if(!petRaf&&petOpen&&!petPhoneOpen&&twAnimacaoVisivel($('petov')))petRaf=requestAnimationFrame(petLoop);}
function petAnimParar(){if(petRaf){cancelAnimationFrame(petRaf);petRaf=0;}petDrawDeltaPending=0;}
function petOpenUI(){
  if(state !== 'menu') return;

  // Exige o preenchimento do nome de Idol igual ao botão JOGAR
  var inputNick = $('nick');
  var nomeLimpo = (inputNick ? inputNick.value : '').trim();
  if(!nomeLimpo){
    if(inputNick){
      inputNick.classList.remove('aviso-erro');
      void inputNick.offsetWidth; // Reinicia a animação de tremor
      inputNick.classList.add('aviso-erro');
      inputNick.focus();
    }
    if(sfx && sfx.hit) sfx.hit();
    var nm = $('nickMsg');
    if(nm){
      nm.hidden = false;
      clearTimeout(nm._t);
      nm._t = setTimeout(function(){ nm.hidden = true; }, 3500);
    }
    return; // Bloqueia a entrada no camarim até digitar o nome!
  }

  petLoad();
  if(petData){ petTick(); petSave(); }
  petDaily();
  $('petov').hidden = false;
  petView = petData ? 'room' : 'col';
  petShow();
  petRecepcaoFrames = petData ? 90 : 0;
  if(!petOpen){ petOpen = true; petAnimLigar(); }
}
function petClose(){
  petRecepcaoFrames = 0; petLembrancaRecente = null;
  if(petPhoneOpen) petPhoneFechar(false);
  var estante = $('petLifeEstante'), bEstante = document.querySelector('#petLifeNav [data-life="estante"]');
  if(estante) estante.hidden = true;
  if(bEstante) bEstante.setAttribute('aria-expanded','false');
  if(petData){ petTick(); petSave(); }
  if(contaJ && typeof perfEnviar==='function' && perfSync.hasPending(contaJ.nick)) perfEnviar();
  petOpen = false;petAnimParar();
  $('petov').hidden = true;
  petGameAbort(); petPhShow(false);   // V2.1
  sync();   // volta a música do menu
}
	// Liga/desliga o aviso (!) na patinha automaticamente a cada 2 segundos
function petAlertAtualizar(){
  if(document.hidden)return;
  var el=$('petAlert');if(!el)return;
  var p=typeof petAtivo==='function'?petAtivo():null;
  if(!p){el.hidden=true;return;}
  petTick();
  el.hidden=!(p.fome<40||p.energia<40||p.humor<40||p.higiene<40);
}
var petAlertGate=null;
function petAlertLigar(){
  if(petAlertGate){petAlertGate.refresh();return;}
  petAlertGate=twIntervaloVisivel($('petBtn'),function(){return true;},petAlertAtualizar,2000);
}
function petAlertParar(){
  if(petAlertGate){petAlertGate.destroy();petAlertGate=null;}
}
var PET_FOOD = [   // [chave, nome, preço ★, recarga (min), +fome, +humor, +energia]
  ['onigiri',   'Onigiri',         0, 60, 20,  2,  0],
  ['agua',      'Água',            0, 60, 10,  2,  0],
  ['gyoza',     'Gyoza',           4,  0, 30,  4,  0],
  ['dango',     'Dango',           8,  0, 35, 10,  0],
  ['redvelvet', 'Bolo red velvet', 12, 0, 50, 15,  0],
  ['tiramisu',  'Tiramisu',        15, 0, 60, 20, 10]
];
var PET_BATH = [   // [chave, nome, preço ★, recarga (min), +higiene, +humor]
  ['banho',  'Banho simples',   0, 60,  35,  0],
  ['espuma', 'Banho de espuma', 12, 0, 100, 10]
];
var PET_GIFTS = ['gyoza', 'gyoza', 'dango', 'dango', 'redvelvet', 'tiramisu'];   // sorteio do presente diário
var PET_SLEEP_RATE = 15;   // energia recuperada por hora dormindo
var PET_PLAY_CD = 5;       // minutos entre uma brincadeira e outra
var petMenuK = '', petAnim = null, petMsg = null;
function petSay(s){ petMsg = { s:s, t:0 }; }
function petRecLeft(k, min){ var r = (petData && petData.rec && petData.rec[k]) || 0; return Math.max(0, r + min * 6e4 - Date.now()); }
var petComprando = false;
function petPay(price){
  if(price<=0) return Promise.resolve(true);
  if(petComprando || starT<price) return Promise.resolve(false);
  if(!contaJ){
    starT-=price;
    try{localStorage.setItem('brs48cr_st',starT);}catch(e){}
    setBest();return Promise.resolve(true);
  }
  petComprando=true;
  return contaRpc('gastar_estrelas',{p_qtd:price,p_motivo:'camarim'}).then(function(r){
    if(r&&typeof r.stars==='number'){starT=r.stars;try{localStorage.setItem('brs48cr_st',starT);}catch(e){}setBest();}
    return !!(r&&r.ok===true);
  }).catch(function(){
    petSay(tr('Não deu para falar com o servidor. Tente de novo.'));return false;
  }).then(function(ok){petComprando=false;if(petOpen)petUI();return ok;});
}
function petFind(list, k){ for(var i = 0; i < list.length; i++) if(list[i][0] === k) return list[i]; return null; }
function petDaily(){
  if(!petData) return;
  var d = dk();
  if(petData.dia === d) return;
  petData.dia = d;
  var k = PET_GIFTS[Math.floor(Math.random() * PET_GIFTS.length)];
  petData.inv = petData.inv || {};
  petData.inv[k] = (petData.inv[k] || 0) + 1;
  petSave(true);
  petSay('🎁 ' + tr('Presente do dia') + ': ' + tr(petFind(PET_FOOD, k)[1]));
}
function petUseItem(list, k){
  var p = petAtivo(), it = petFind(list, k), food = list === PET_FOOD;
  if(!p || !it || p.dorme || petAnim) return;
  if(PET_SPECIAL[k] && !((petData.inv || {})[k] > 0)) return;   // sorvete de morango: só o ganho nos minijogos
  petTick();
  if(food ? p.fome >= 95 : p.higiene >= 95){ petSay(tr(food ? 'Já está satisfeito!' : 'Já está limpinho!')); return; }
  petData.inv = petData.inv || {}; petData.rec = petData.rec || {};
  if(it[3] && petRecLeft(k, it[3]) > 0) return;
  var guardado=(petData.inv[k]||0)>0;
  return petPay(guardado ? 0 : it[2]).then(function(ok){
    if(!ok){petSay(tr('Estrelas insuficientes'));beep(220,.15,'square',.04);return;}
    if(guardado)petData.inv[k]--;
    if(it[3])petData.rec[k]=Date.now();
  if(food){
    p.fome = petClamp(p.fome + it[4]); p.humor = petClamp(p.humor + it[5]); p.energia = petClamp(p.energia + it[6]);
    petAnim = { k:'comer', item:k, t:0 };
    [660, 880, 660, 990].forEach(function(f, i){ beep(f, .06, 'triangle', .04, i * .18); });
  } else {
    p.higiene = petClamp(p.higiene + it[4]); p.humor = petClamp(p.humor + it[5]);
    petAnim = { k:'banho', espuma:k === 'espuma', t:0 };
    [1318, 1568, 1760, 2093].forEach(function(f, i){ beep(f, .05, 'sine', .035, i * .09); });
  }
  petMenuK = '';
  petXP(p, k === 'sorvete' ? 8 : 3);   // pontos de cuidado (V2.1)
  petSave(true); petUI();
  });
}
function petToggleSleep(){
  var p = petAtivo(); if(!p || petAnim) return;
  petTick();
  if(!p.dorme && p.energia >= 90){ petSay(tr('Ainda não está com sono!')); return; }
  p.dorme = !p.dorme; petMenuK = '';
  if(p.dorme){ petSay(tr('Boa noite!') + ' 🌙'); beep(523, .2, 'sine', .04); beep(392, .3, 'sine', .04, .18); }
  else { petSay(tr('Bom dia!') + ' ☀️'); beep(784, .1, 'triangle', .05); beep(1046, .15, 'triangle', .05, .1); }
  petSave(true); petUI();
}
function petPlay(){
  var p = petAtivo(); if(!p || p.dorme || petAnim) return;
  petTick();
  if(petRecLeft('brincar', PET_PLAY_CD) > 0) return;
  if(p.energia < 15){ petSay(tr('Está cansado demais...')); return; }
  petData.rec = petData.rec || {};
  p.humor = petClamp(p.humor + 15); p.energia = petClamp(p.energia - 8); p.fome = petClamp(p.fome - 3);
  petData.rec.brincar = Date.now();
  petAnim = { k:'brincar', t:0 }; petMenuK = '';
  petXP(p, 4);   // pontos de cuidado (V2.1)
  [784, 988, 1175, 1568].forEach(function(f, i){ beep(f, .07, 'square', .03, i * .1); });
  petSave(true); petUI();
}
function petActUI(){
  var p = petAtivo(); if(!p) return;
  var playLeft = petRecLeft('brincar', PET_PLAY_CD), singLeft = petRecLeft('cantar', PET_SING_CD);
  var acts = [['comer','🍙','Comer'], ['banho','🫧','Banho'], p.dorme ? ['dormir','☀️','Acordar'] : ['dormir','🌙','Dormir'], ['brincar','⭐','Brincar'], ['cantar','🎤','Cantar'], ['falar','💬','Conversar'], ['visual','🎀','Acessório'], ['decorar','🖼️','Decorar']];
  $('petActs').innerHTML = acts.map(function(a){
    var cdL = a[0] === 'cantar' ? singLeft : 0;
    var off = !!petGame || (p.dorme && a[0] !== 'dormir' && a[0] !== 'decorar' && a[0] !== 'visual' && a[0] !== 'falar') || cdL > 0;
    var cd = (cdL > 0 && !p.dorme) ? '<small>⏳ ' + Math.ceil(cdL / 6e4) + ' min</small>' : '';
    return '<button type="button" data-a="' + a[0] + '"' + (off ? ' disabled' : '') + ' aria-pressed="' + (petMenuK === a[0]) + '">' + a[1] + ' ' + escHtml(tr(a[2])) + cd + '</button>';
  }).join('');
  petMenuUI();
}
function petMenuUI(){
  var m = $('petMenu'), p = petAtivo();
  if(petMenuK === 'decorar' && p){ petDecorMenuUI(m); return; }   // mural (V2)
  if(petMenuK === 'visual' && p){ petDressMenuUI(m, p); return; } // vestir itens no pet
  if(petMenuK === 'brincar' && p && !p.dorme){ petPlayMenuUI(m, p); return; } // minijogos (V2.1)
  if(!petMenuK || !p || p.dorme){ m.hidden = true; m.innerHTML = ''; return; }
  var list = petMenuK === 'comer' ? PET_FOOD : PET_BATH, inv = petData.inv || {}, food = list === PET_FOOD;
  m.hidden = false;
  m.innerHTML = list.filter(petMenuFiltro).map(function(it){
    var left = it[3] ? petRecLeft(it[0], it[3]) : 0, n = inv[it[0]] || 0;
    var tag = n > 0 ? '🎁 x' + n : left > 0 ? '⏳ ' + Math.ceil(left / 6e4) + ' min' : it[2] ? '★ ' + it[2] : tr('Grátis');
    var off = n <= 0 && (left > 0 || starT < it[2]);
    var fx = food ? '+' + it[4] + '🍙' + (it[5] ? ' +' + it[5] + '💖' : '') + (it[6] ? ' +' + it[6] + '⚡' : '')
                  : (it[4] >= 100 ? '100' : '+' + it[4]) + '🫧' + (it[5] ? ' +' + it[5] + '💖' : '');
    return '<button type="button" data-k="' + it[0] + '"' + (off ? ' disabled' : '') + '><canvas width="72" height="60" data-f="' + it[0] + '"></canvas>' +
           '<b>' + escHtml(tr(it[1])) + '</b><small>' + fx + '</small><em>' + tag + '</em></button>';
  }).join('');
  [].forEach.call(m.querySelectorAll('canvas'), function(c){
    var x = c.getContext('2d'); x.scale(2, 2); petDrawItem(x, c.dataset.f, 18, 16, 1);
  });
}
function petDrawItem(x, k, cx, cy, s){
  x.save(); x.translate(cx, cy); x.scale(s, s);
  function E(ex, ey, rx, ry, r){ x.beginPath(); x.ellipse(ex, ey, rx, ry, r || 0, 0, 7); x.fill(); }
  function RR(px, py, w, h, r){ x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
  function face(fy){ x.fillStyle = '#3b2a3a'; E(-3.5, fy, 1, 1.2); E(3.5, fy, 1, 1.2); x.fillStyle = '#ff9ccd'; E(-6, fy + 2.5, 1.8, 1); E(6, fy + 2.5, 1.8, 1); }
  if(k === 'onigiri'){
    x.fillStyle = '#ffffff'; x.strokeStyle = '#e6dfe8'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(0, -12); x.quadraticCurveTo(13, 8, 11, 11); x.lineTo(-11, 11); x.quadraticCurveTo(-13, 8, 0, -12); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#1f3a2e'; RR(-6, 4, 12, 7, 1.5); x.fill();
    face(0);
  } else if(k === 'agua'){
    x.fillStyle = 'rgba(200,235,255,.75)'; x.strokeStyle = '#9fd3f5'; x.lineWidth = 1;
    x.beginPath(); x.moveTo(-8, -9); x.lineTo(8, -9); x.lineTo(6, 12); x.lineTo(-6, 12); x.closePath(); x.fill(); x.stroke();
    x.fillStyle = '#7cc8f7'; x.beginPath(); x.moveTo(-7.3, -2); x.lineTo(7.3, -2); x.lineTo(6, 12); x.lineTo(-6, 12); x.closePath(); x.fill();
    x.strokeStyle = '#ff6fb5'; x.lineWidth = 2; x.beginPath(); x.moveTo(2, 6); x.lineTo(5, -14); x.lineTo(9, -15); x.stroke();
    x.fillStyle = 'rgba(255,255,255,.7)'; x.fillRect(-5, -6, 2, 14);
  } else if(k === 'gyoza'){
    x.fillStyle = '#f5d9a8'; x.beginPath(); x.moveTo(-13, 6); x.quadraticCurveTo(0, -16, 13, 6); x.closePath(); x.fill();
    x.fillStyle = '#d99a4e'; x.beginPath(); x.moveTo(-13, 6); x.quadraticCurveTo(0, 11, 13, 6); x.closePath(); x.fill();
    x.strokeStyle = '#e2b877'; x.lineWidth = 1;
    for(var i = -2; i <= 2; i++){ x.beginPath(); x.moveTo(i * 4, -4 + Math.abs(i)); x.lineTo(i * 4 + 1.5, -9 + Math.abs(i) * 1.6); x.stroke(); }
    x.fillStyle = '#3b2a3a'; E(-3, 2, .9, 1.1); E(3, 2, .9, 1.1);
  } else if(k === 'dango'){
    x.strokeStyle = '#c9a16b'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(-12, 13); x.lineTo(11, -13); x.stroke();
    [['#ffc4d8', -6, 6], ['#fff7fb', 0, -1], ['#c8efb4', 6, -8]].forEach(function(b){
      x.fillStyle = b[0]; E(b[1], b[2], 5.6, 5.6);
      x.fillStyle = 'rgba(255,255,255,.7)'; E(b[1] - 2, b[2] - 2, 1.6, 1.1);
    });
    x.fillStyle = '#3b2a3a'; E(-1.8, -1, .7, .9); E(1.8, -1, .7, .9);
  } else if(k === 'redvelvet'){
    x.fillStyle = '#fff4ea'; x.beginPath(); x.moveTo(-13, 11); x.lineTo(13, 11); x.lineTo(13, -3); x.lineTo(-13, 5); x.closePath(); x.fill();
    x.fillStyle = '#b5223b'; x.beginPath(); x.moveTo(-13, 11); x.lineTo(13, 11); x.lineTo(13, 6); x.lineTo(-13, 9.5); x.closePath(); x.fill();
    x.beginPath(); x.moveTo(-13, 7.5); x.lineTo(13, 2); x.lineTo(13, -1); x.lineTo(-13, 5.5); x.closePath(); x.fill();
    x.fillStyle = '#fffaf5'; x.beginPath(); x.moveTo(-13, 5); x.lineTo(13, -3); x.lineTo(13, -6); x.lineTo(-13, 2); x.closePath(); x.fill();
    x.fillStyle = '#e8364f'; E(6, -9, 3.5, 3.2); x.fillStyle = '#4fa34a'; E(6, -12.3, 2, 1);
    x.fillStyle = '#c0265f'; E(-4, -1.2, .8, .8); E(1, -2.6, .8, .8);
  } else if(k === 'tiramisu'){
    x.fillStyle = '#f6e7cf'; RR(-12, -7, 24, 18, 2); x.fill();
    x.fillStyle = '#8a5a3b'; x.fillRect(-12, -1, 24, 3.5); x.fillRect(-12, 6, 24, 3.5);
    x.fillStyle = '#5b3a29'; RR(-12, -9, 24, 4.5, 2); x.fill();
    x.fillStyle = '#7a4e35'; for(var d = 0; d < 7; d++) E(-10 + d * 3.4, -10.5 + (d % 2), .7, .7);
    x.fillStyle = '#3b2a1e'; x.save(); x.rotate(-.5); x.fillRect(2, -16, 2.2, 10); x.restore();
    x.fillStyle = '#6fcf7a'; E(-6, -11, 2.2, 1.1, -.4);
  } else if(k === 'banho'){
    x.fillStyle = '#ffd84d'; E(1, 4, 10, 7); E(-5, -4, 6, 6);
    x.fillStyle = '#ff9a3c'; x.beginPath(); x.moveTo(-10, -4); x.lineTo(-16, -3); x.lineTo(-10, -1); x.closePath(); x.fill();
    x.fillStyle = '#3b2a3a'; E(-6, -6, 1, 1.2);
    x.fillStyle = 'rgba(255,255,255,.6)'; E(4, 1, 4, 2);
  } else if(k === 'espuma'){
    [['#ffffff', -6, 4, 7], ['#ffd6ec', 5, 5, 6], ['#d6ecff', 0, -4, 7], ['#ffffff', 8, -6, 4], ['#eafff0', -9, -6, 4]].forEach(function(b){
      x.fillStyle = b[0]; E(b[1], b[2], b[3], b[3]);
      x.strokeStyle = 'rgba(155,48,217,.25)'; x.lineWidth = .8; x.stroke();
      x.fillStyle = 'rgba(255,255,255,.9)'; E(b[1] - b[3] * .35, b[2] - b[3] * .35, b[3] * .25, b[3] * .18);
    });
  } else if(k === 'sorvete'){   // sorvete de morango (prêmio de recorde nos minijogos)
    x.fillStyle = '#e8b06a'; x.beginPath(); x.moveTo(-7, 0); x.lineTo(7, 0); x.lineTo(0, 14); x.closePath(); x.fill();
    x.strokeStyle = '#c98c47'; x.lineWidth = .7; x.beginPath(); x.moveTo(-4, 2); x.lineTo(3, 9); x.moveTo(4, 2); x.lineTo(-3, 9); x.stroke();
    x.fillStyle = '#ffb3cf'; E(0, -4, 8, 7); E(-5, 0, 3, 2.4); E(4, .5, 3, 2.2);
    x.fillStyle = 'rgba(255,255,255,.6)'; E(-3, -7, 2.4, 1.4);
    x.fillStyle = '#e8364f'; E(1, -12, 3, 3.4); x.fillStyle = '#4fa34a'; E(1, -15.4, 2, .9);
    face(-4);
  }
  x.restore();
}
// Agradecimentos visuais por cuidado. Usa os efeitos que já existem no Canvas.
// Nunca altera as necessidades, custos, cooldowns ou o save.
// Último cuidado apenas nesta sessão de camarim (não entra em petData/save).
var petLembrancaRecente = null;
function petLembrarCuidado(acao){
  if(petData && petData.ativo) petLembrancaRecente = {pet:petData.ativo, acao:acao, t:petT};
}
function petDesenharLembranca(x){
  var m = petLembrancaRecente;
  if(!m || !petData || m.pet !== petData.ativo) return false;
  var idade = petT - m.t;
  if(idade < 45 || idade > 270){ if(idade > 270 || idade < 0) petLembrancaRecente = null; return false; }
  var simbolos = {comer:'♡', banho:'✧', carinho:'♥', brincar:'♪'};
  var p = petAtivo(), k = petRecepcaoJeito(petData.ativo, p && p.cfg);
  var cor = k === 'lirika' ? '#54ae70' : k === 'pati' ? '#5b8be5' : '#e858a5';
  x.save(); x.globalAlpha = Math.min(.65, (270 - idade) / 90);
  x.font = '15px sans-serif'; x.textAlign = 'center'; x.fillStyle = cor;
  x.fillText(simbolos[m.acao] || '✦', PET_X - 28, PET_FLOOR - 54 - Math.sin(idade * .04) * 3);
  x.restore();
  return true;
}
// Afinidade visual por atividade, sem bônus de jogo ou novo estado persistido.
function petPreferenciaAtividade(k, cfg, atividade){
  k = petRecepcaoJeito(k, cfg);
  return k === 'tsu' ? atividade === 'brincar' :
    k === 'lirika' ? (atividade === 'carinho' || atividade === 'descanso') :
    (atividade === 'comer' || atividade === 'explorar');
}
function petPreferenciaCelebrar(atividade){
  var k = petData && petData.ativo, p = petAtivo();
  if(!k || !petPreferenciaAtividade(k, p && p.cfg, atividade)) return false;
  var jeito = petRecepcaoJeito(k, p && p.cfg);
  petFx.push({x:PET_X + 27,y:PET_FLOOR - 89,t:0,
    s:jeito === 'tsu' ? '🌟' : jeito === 'lirika' ? '💚' : '✧'});
  petSmile = Math.max(petSmile, 35);
  return true;
}
function petCuidadoReagir(acao){
  petLembrarCuidado(acao);
  var k = petData && petData.ativo, cfg = k === 'meu' && petAtivo() ? petAtivo().cfg : null;
  if(k === 'meu') k = petRecepcaoJeito(k, cfg);
  var emotes = {
    tsu: {comer:['😋','💜'], banho:['🫧','✨'], carinho:['💕','✦']},
    lirika: {comer:['🍡'], banho:['🫧','💚'], carinho:['💚']},
    pati: {comer:['⭐','😋'], banho:['💦','✧'], carinho:['💙','✧']}
  };
  var lista = emotes[k] && emotes[k][acao] || ['✨'];
  for(var i = 0; i < lista.length; i++)
    petFx.push({x:PET_X + (i ? 19 : -12), y:PET_FLOOR - 72 - (i ? 8 : 0), t:0, s:lista[i]});
  petPreferenciaCelebrar(acao);
}
function petDrawExtras(x, p){
  // Noite: quarto escurece enquanto o pet dorme
  if(p.dorme){
    x.fillStyle = 'rgba(28,14,72,.55)'; x.fillRect(0, 0, 360, 220);
    x.font = '22px sans-serif'; x.textAlign = 'center'; x.fillStyle = '#000'; x.fillText('🌙', 322, 40);
    x.fillStyle = '#fff7c2';
    for(var s = 0; s < 6; s++){ x.globalAlpha = .4 + .6 * Math.abs(Math.sin(petT * .03 + s * 2)); x.fillRect(180 + s * 22, 20 + (s * 37 % 30), 2, 2); }
    x.globalAlpha = 1;
    x.font = '800 13px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center'; x.fillStyle = '#e9dcff';
    for(var z = 0; z < 3; z++){ var zt = (petT * .5 + z * 40) % 120; x.globalAlpha = Math.max(0, 1 - zt / 120); x.fillText('Z', PET_X + 22 + zt * .25, PET_FLOOR - 50 - zt * .4); }
    x.globalAlpha = 1;
  }

  if(petAnim){
    var a = petAnim; a.t+=petDrawDelta;
    if(a.k === 'comer'){
      var bite = Math.min(1, a.t / 90);
      if(Math.floor(a.t/22)>Math.floor((a.t-petDrawDelta)/22)) petHop = 20;
      petSmile = 40;
      if(bite < 1) petDrawItem(x, a.item, PET_X - 42, PET_FLOOR - 30, 1.9 * (1 - bite * .6));
      x.fillStyle = '#f5d9a8';
      for(var c = 0; c < 4; c++) if((a.t + c * 7) % 28 < 14) x.fillRect(PET_X - 30 + c * 5, PET_FLOOR - 12 + ((a.t + c * 7) % 14), 2, 2);
      if(a.t >= 95){ petAnim = null; petCuidadoReagir('comer'); petSay(tr('Que delícia!')); }
    } else if(a.k === 'banho'){
      for(var i = 0; i < 16; i++){
        var bx = PET_X + Math.sin(i * 2.1 + a.t * .05) * 32, by = PET_FLOOR - 8 - ((a.t * 1.2 + i * 17) % 75), r = 2.5 + (i % 3) * 1.8;
        x.fillStyle = a.espuma ? ['rgba(255,214,236,.75)', 'rgba(214,236,255,.75)', 'rgba(255,255,255,.85)'][i % 3] : 'rgba(255,255,255,.7)';
        x.beginPath(); x.arc(bx, by, r, 0, 7); x.fill();
        x.strokeStyle = 'rgba(123,63,240,.25)'; x.lineWidth = .8; x.stroke();
      }
      if(a.espuma){
        x.fillStyle = 'rgba(255,255,255,.92)';
        [[-12, 0, 8], [0, -4, 10], [12, 0, 8], [-5, -10, 6], [7, -9, 6]].forEach(function(f){ x.beginPath(); x.arc(PET_X + f[0], PET_FLOOR - 52 + f[1], f[2], 0, 7); x.fill(); });
      }
      if(Math.floor(a.t/40)>Math.floor((a.t-petDrawDelta)/40)) petHop = 20;
      if(a.t >= 150){ petAnim = null; petCuidadoReagir('banho'); }
    } else if(a.k === 'brincar'){
      var u = .5 - .5 * Math.cos(a.t * .045);
      var sx = 120 + (PET_X - 150) * u, sy = PET_FLOOR - 28 - Math.abs(Math.sin(a.t * .09)) * 55;
      petEstrelaBrinquedo(x, sx, sy, a.t * .15, 1);
      if(u > .9 && petHop === 0) petHop = 20;
      petSmile = 40;
      if(a.t >= 210){ petAnim = null; petLembrarCuidado('brincar'); petFx.push({ x:PET_X, y:PET_FLOOR - 70, t:0, s:'🎵' }); petPreferenciaCelebrar('brincar'); }
    } else if(a.k === 'cantar'){
      petSingFrame(x, a);   // show do 🎤 Cantar (sons do camarim)
    }
  }

  // Mensagem curta no topo do camarim
  if(petMsg){
    petMsg.t+=petDrawDelta;
    var al = petMsg.t < 150 ? 1 : Math.max(0, 1 - (petMsg.t - 150) / 30);
    x.globalAlpha = al;
    x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
    var w = x.measureText(petMsg.s).width + 22;
    x.fillStyle = 'rgba(255,255,255,.94)'; x.beginPath(); x.moveTo(180 - w / 2 + 11, 36); x.arcTo(180 + w / 2, 36, 180 + w / 2, 60, 11); x.arcTo(180 + w / 2, 60, 180 - w / 2, 60, 11); x.arcTo(180 - w / 2, 60, 180 - w / 2, 36, 11); x.arcTo(180 - w / 2, 36, 180 + w / 2, 36, 11); x.closePath(); x.fill();
    x.fillStyle = '#7b3ff0'; x.fillText(petMsg.s, 180, 52);
    x.globalAlpha = 1;
    if(petMsg.t > 180) petMsg = null;
  }
}
var PET_STICK = {   // adesivos da foto, de acordo com o humor
  'Feliz!':              ['💖', '✨', '🌸', '💕', '⭐'],
  'Dormindo...':         ['💤', '🌙', '⭐', '✨', '💜'],
  'Com sono...':         ['💤', '🌙', '🥱', '⭐', '💜'],
  'Com fome...':         ['🍙', '🍡', '💭', '🥺', '✨'],
  'Precisa de banho...': ['🫧', '🧼', '💦', '🫧', '✨'],
  'Com saudade...':      ['💭', '🥺', '💌', '💗', '✨'],
  'Tranquilo':           ['🎵', '🌷', '✨', '💗', '🎶']
};
function petMakePhoto(){
  var p = petAtivo(); if(!p) return null;
  petTick();
  var S = 2, W2 = 400, H2 = 430, c2 = document.createElement('canvas');
  c2.width = W2 * S; c2.height = H2 * S;
  var x = c2.getContext('2d'); x.scale(S, S);
  var mood = petMood(p), stick = PET_STICK[mood[1]] || PET_STICK['Tranquilo'], ac = petColor(petData.ativo);
  function fit(text, maxW, size, weight){ do { x.font = weight + ' ' + size + 'px "M PLUS Rounded 1c",sans-serif'; size--; } while(x.measureText(text).width > maxW && size > 11); }

  // 1. Papel da polaroid com bolinhas bem suaves
  x.fillStyle = '#fffafd'; x.fillRect(0, 0, W2, H2);
  x.fillStyle = 'rgba(255,111,181,.07)';
  for(var dy = 12; dy < H2; dy += 18) for(var dx = (dy / 18 % 2) * 9 + 6; dx < W2; dx += 18){ x.beginPath(); x.arc(dx, dy, 1.6, 0, 7); x.fill(); }
  petPhFrameDraw(x, W2, H2, 'papel');   // molduras Oshi e Estágio (Foto 2.0)

  // 2. Foto: o camarim em alta resolução (redesenha o fundo em 2x e devolve o normal)
  var od = petDpr; petDpr = 2; petMakeBg(); var bg = petBg; petDpr = od; petBg = null;
  x.save();
  x.beginPath(); x.rect(20, 20, 360, 220); x.clip();
  x.drawImage(bg, 20, 20, 360, 220);
  x.translate(20, 20);

  // Personagem ativo (sorrindo, ou tranquilo se o pet estiver dormindo)
  petCharFoto(x, 78, PET_FLOOR - 44 * 2.4, 2.4, function(){   // contorno suave + pose e expressão (Foto 2.0)
    charPose = petPhPose;
    drawChar(CH[sel], 0, 0, 0, petPhExprVal(p.dorme ? 0 : 2));
  });

  // Pet com sombra
  x.fillStyle = 'rgba(80,30,120,.18)'; x.beginPath(); x.ellipse(PET_X, PET_FLOOR + 2, 26, 5, 0, 0, 7); x.fill();
  drawPet(x, petType(petData.ativo), PET_X, PET_FLOOR - 12 * PET_SC, PET_SC, 0, petEx(p, true));
  petDrawDirt(x, p, PET_X, PET_FLOOR - 12 * PET_SC);
  petTemaFoto(x);   // tema ligado aparece na foto (V2.1)

  // Noite, se estiver dormindo
  if(p.dorme){
    x.fillStyle = 'rgba(28,14,72,.5)'; x.fillRect(0, 0, 360, 220);
    x.font = '22px sans-serif'; x.textAlign = 'center'; x.fillStyle = '#000'; x.fillText('🌙', 322, 40);
    x.font = '800 13px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#e9dcff';
    x.fillText('Z', PET_X + 24, PET_FLOOR - 52); x.fillText('Z', PET_X + 33, PET_FLOOR - 66);
  }

  // Balão de humor e adesivos espalhados
  x.textAlign = 'center'; x.fillStyle = '#000';
  x.font = '22px sans-serif'; x.fillText(mood[0], PET_X + 4, PET_FLOOR - 68);
  [[28, 42, -.25, 0], [196, 38, .18, 1], [338, 196, .22, 2], [168, 204, -.12, 3]].forEach(function(s){
    x.save(); x.translate(s[0], s[1]); x.rotate(s[2]); x.font = '20px sans-serif'; x.fillText(stick[s[3]], 0, 0); x.restore();
  });

  // Vinheta rosada de "flash"
  var vg = x.createRadialGradient(180, 110, 70, 180, 110, 240);
  vg.addColorStop(0, 'rgba(255,255,255,0)'); vg.addColorStop(1, 'rgba(255,190,225,.32)');
  x.fillStyle = vg; x.fillRect(0, 0, 360, 220);
  x.restore();
  x.strokeStyle = 'rgba(18,54,94,.08)'; x.lineWidth = 1; x.strokeRect(20.5, 20.5, 359, 219);

  // 3. Fita adesiva (washi tape) na cor do pet
  x.save(); x.translate(200, 16); x.rotate(-.05);
  x.globalAlpha = .6; x.fillStyle = ac; x.fillRect(-58, -11, 116, 22);
  x.globalAlpha = .35; x.fillStyle = '#fff'; for(var tp = -50; tp < 58; tp += 14) x.fillRect(tp, -11, 6, 22);
  x.restore(); x.globalAlpha = 1;
  petPhFrameDraw(x, W2, H2, 'topo');   // selo de estágio / etiqueta do Oshi (Foto 2.0)

  // 4. Textos (Nome do Pet + Nome de Idol digitado pelo jogador)
  var nomeJogador = ($('nick') && $('nick').value.trim()) || nick || CH[sel].n;
  var title = petEmo(petData.ativo) + ' ' + p.nome + ' & ' + nomeJogador;
  x.textAlign = 'center'; x.fillStyle = '#12365e';
  fit(title, 340, 26, 800); x.fillText(title, 200, 280);
  x.fillStyle = '#ff6fb5'; x.font = '700 17px "M PLUS Rounded 1c",sans-serif';
  x.fillText(mood[0] + ' ' + tr(mood[1]), 200, 307);

  // Mini barras das necessidades
  PET_NEEDS.forEach(function(n, i){
    var bx = 40 + i * 82, v = Math.round(p[n[0]]);
    x.font = '13px sans-serif'; x.textAlign = 'left'; x.fillText(n[1], bx, 337);
    x.fillStyle = '#eef0f6'; x.beginPath(); x.roundRect ? x.roundRect(bx + 19, 328, 52, 8, 4) : x.rect(bx + 19, 328, 52, 8); x.fill();
    x.fillStyle = n[3]; x.beginPath(); x.roundRect ? x.roundRect(bx + 19, 328, Math.max(4, 52 * v / 100), 8, 4) : x.rect(bx + 19, 328, 52 * v / 100, 8); x.fill();
  });

  // Data e adesivos na margem
  var loc = { pt:'pt-BR', en:'en-US', es:'es-ES', th:'th-TH', ja:'ja-JP' }[LANG] || 'pt-BR';
  x.textAlign = 'center'; x.fillStyle = '#94a3b8'; x.font = '600 12px "M PLUS Rounded 1c",sans-serif';
  x.fillText(new Date().toLocaleDateString(loc, { day:'2-digit', month:'2-digit', year:'numeric' }), 200, 368);
  x.font = '22px sans-serif';
  x.textAlign = 'left'; x.fillText(stick[4], 26, 392); x.fillText('🐾', 26, 300);
  x.textAlign = 'right'; x.fillText('🫰', 374, 392); x.fillText('🐾', 374, 300);

  // Marca d'água
  x.textAlign = 'center'; x.fillStyle = '#94a3b8'; x.font = '500 11px "M PLUS Rounded 1c",sans-serif';
  x.fillText('🌷 TsuLiPa⭐World · Backstage⭐Pet!', 200, 414);

  return c2.toDataURL('image/png');
}
function petDevUI(){
  var box = $('petDev'); if(!box) return;
  var on = !$('tstw').hidden && !!petData;
  box.hidden = !on;
  if(!on || box.children.length) return;
  [['st', '+100 ★'], ['h6', '⏩ +6h'], ['gift', '🎁 Presente'], ['meu', '🔓 Center'], ['reset', '🔄 Recomeçar']].forEach(function(b){
    var e = document.createElement('button'); e.type = 'button'; e.dataset.d = b[0]; e.textContent = b[1]; box.appendChild(e);
  });
}
var PET_OFF = ['tsu', 'lirika', 'pati'];   // pets oficiais do TsuLiPa (cores oficiais fixas)
var PET_PRICE = 400;                       // ★ para adotar o 2º e o 3º pet oficial
var PET_MEU_RANK = 5000;                   // Meu Pet: liberado ao alcançar o Center
var petView = 'room', petCharT = 0, petLove = 0, petEmote = null, petDevUnlock = false, petMk = null;
var PET_MK_DEF = { orelha:'gato', cor:'#ff6fb5', olhos:'brilho', bochecha:true, acc:'laco' };
var PET_MK = {   // peças do Meu Pet, baseadas nos três pets do TsuLiPa
  orelha: [['gato','🐱','Gato'], ['coala','🐨','Coala'], ['coroa','👑','Coroa'], ['coelho','🐰','Coelho'], ['nenhuma','⚪','Nenhuma']],
  olhos:  [['redondo','●','Redondos'], ['brilho','✦','Brilhantes'], ['feliz','^^','Felizes'], ['sono','︶','Sonolentos']],
  acc:    [['','✖','Nenhum'], ['laco','🎀','Laço'], ['estrela','⭐','Estrela'], ['anel','🪐','Anel'], ['oculos','👓','Óculos'], ['flor','🌸','Flor']],
  cor:    ['#ff6fb5', '#f9a8d4', '#c084fc', '#a5b4fc', '#7dd3fc', '#5eead4', '#86efac', '#fde047', '#fdba74', '#fca5a5', '#e2e8f0', '#94a3b8']
};
var PET_EMOTES = ['💕', '✌️', '(≧◡≦)', '✨', 'ファイト!', '🎤', '(｡♥‿♥｡)', '💜💚💙', 'がんばろう!', '(๑>◡<๑)', 'Otsukare~!', '🫶'];
// Mural do camarim: [chave, nome, preço ★, x, y, largura, altura, estilo, inclinação]
var PET_DECOR = [   // chaves antigas mantidas: quem já comprou continua com o item (agora com a arte nova)
  ['zipper',  'Pôster ツリパ',       0, 148, 36, 48, 39.5, 'poster',   -.03],
  ['banner',  'Quadro ポリリズム',    60, 205, 34, 30, 38.2, 'quadro',    0],
  ['brs48',   'Pôster OUR STORY',  120, 243, 34, 41, 35,   'poster',    .03],
  ['nebyura', 'Pôster NeByura',     80, 151, 85, 27, 35.5, 'quadro',    0],
  ['campo',   'Pôster SECRET BASE', 80, 189, 84, 27, 34.1, 'polaroid', -.06],
  ['doces',   'Quadro Valentine',  100, 226, 87, 52, 33,   'quadro',    0]
];
var PET_DECOR_IMG = {
  zipper: './img/mural-zipper.webp',
  banner: './img/mural-banner.webp',
  brs48: './img/mural-brs48.webp',
  nebyura: './img/mural-nebyura.webp',
  campo: './img/mural-campo.webp',
  doces: './img/mural-doces.webp'
};
var petDecorImgs = {};
function petNormalize(){   // completa saves antigos (só adiciona campos, nunca apaga nada)
  if(!petData.donos) petData.donos = Object.keys(petData.pets);
  if(!petData.decor) petData.decor = { zipper: 1 };   // pôster de presente na parede
}
function petType(k){ return k === 'meu' ? ((petData && petData.pets.meu && petData.pets.meu.cfg) || PET_MK_DEF) : k; }
function petColor(k){ return k === 'meu' ? petType('meu').cor : PET_SP[k].cor; }
function petEmo(k){ return PET_SP[k] ? PET_SP[k].emo : '💖'; }
function petMeuLiberado(){ return best >= PET_MEU_RANK || petDevUnlock; }
function petMix(h, alvo, a){   // mistura uma cor com branco (alvo 1) ou preto (alvo 0)
  var c = parseInt(String(h).replace('#', ''), 16), r = c >> 16, gg = (c >> 8) & 255, b = c & 255, w = alvo ? 255 : 0;
  return 'rgb(' + Math.round(r + (w - r) * a) + ',' + Math.round(gg + (w - gg) * a) + ',' + Math.round(b + (w - b) * a) + ')';
}
function petShow(){
  if(!petData && petView === 'room') petView = 'col';
  $('petAdopt').hidden = petView !== 'col';
  $('petMake').hidden = petView !== 'make';
  $('petRoom').hidden = petView !== 'room';
  petLifeUI();
  if(petView === 'col') petBuildPick();
  else if(petView === 'make') petMakeUI();
  else { petFitCanvas(); petUI(); }
}
function petBuildPick(){
  var box = $('petPick'), first = !petData;
  box.innerHTML = '';
  $('petPickTxt').textContent = tr(first ? 'Escolha seu primeiro pet. O primeiro é presente!' : 'Seus pets: toque para trocar ou adotar outro.');
  $('petBack').hidden = first;
  $('petMkEdit').hidden = !(petData && petData.pets.meu);
  $('petPickMsg').hidden = true;
  PET_OFF.concat('meu').forEach(function(k){
    var own = !!(petData && petData.pets[k]);
    var b = document.createElement('button'); b.type = 'button'; b.dataset.k = k;
    var c = document.createElement('canvas'); c.width = 144; c.height = 120; b.appendChild(c);
    var nm = document.createElement('b'), st = document.createElement('small');
    nm.textContent = own ? petData.pets[k].nome : (k === 'meu' ? tr('Meu Pet') : PET_SP[k].n);
    if(k === 'meu' && !own && !petMeuLiberado()){ st.textContent = '🔒 Center'; b.classList.add('lock'); }
    else if(own) st.textContent = petData.ativo === k ? '✓ ' + tr('Ativo') : tr('Usar');
    else if(k === 'meu') st.textContent = '✨ ' + tr('Criar');
    else st.textContent = first ? tr('Grátis') : '★ ' + PET_PRICE;
    if(own && petData.ativo === k) b.classList.add('on');
    b.appendChild(nm); b.appendChild(st); box.appendChild(b);
  });
  if(first){ if(PET_OFF.indexOf(petEsc) < 0) petEsc = 'tsu'; }
  else petEsc = '';   // na coleção, nada vem pré-selecionado para compra
  petMarkPick();
}
function petMarkPick(){
  var first = !petData;
  [].forEach.call($('petPick').children, function(b){ b.setAttribute('aria-pressed', b.dataset.k === petEsc); });
  $('petPickForm').hidden = !petEsc;
  $('petGo').textContent = tr('ADOTAR') + (first ? '' : ' ★' + PET_PRICE);
  $('petGo').disabled = !first && starT < PET_PRICE;
}
function petPickMsg(s){ var m = $('petPickMsg'); m.textContent = s; m.hidden = false; }
function petAdopt(){
  var k = petEsc, first = !petData;
  if(PET_OFF.indexOf(k) < 0 || (!first && petData.pets[k])) return;
  return petPay(first ? 0 : PET_PRICE).then(function(ok){
    if(!ok){petPickMsg(tr('Estrelas insuficientes'));beep(220,.15,'square',.04);return;}
  var nm = ($('petName').value || '').trim().slice(0, 12) || PET_SP[k].n, now = Date.now();
  if(first){ petData = { v:1, ativo:k, donos:[], pets:{} }; petNormalize(); }
  else petTick();   // fecha a conta do pet que estava ativo antes de trocar
  petData.pets[k] = { nome:nm, fome:80, energia:80, humor:90, higiene:85, t:now, nasc:now };
  petData.donos.push(k); petData.ativo = k;
  $('petName').value = ''; petEsc = '';
  petSave(true);
  if(sfx.card) sfx.card();
  petView = 'room'; petShow();
  petFx.push({ x:PET_X, y:PET_FLOOR - 70, t:0, s:'🎉' });
  });
}
function petSwitch(k){   // os pets que não estão ativos "descansam" e não perdem pontos
  if(!petData || !petData.pets[k]) return;
  if(petData.ativo !== k){
    petTick();
    petData.ativo = k; petData.pets[k].t = Date.now();
    petAnim = null; petMenuK = ''; petEmote = null; petLembrancaRecente = null;
    petSave(true);
    petSay(petEmo(k) + ' ' + petData.pets[k].nome + '!');
  }
  petView = 'room'; petShow();
}
function petDrawPick(){
  [].forEach.call($('petPick').children, function(b){
    var c = b.firstChild, x = c.getContext('2d'), k = b.dataset.k;
    x.clearRect(0, 0, 144, 120);
    if(k === 'meu' && !(petData && petData.pets.meu)){
      if(!petMeuLiberado()){   // silhueta misteriosa
        x.save(); x.translate(72, 62 + Math.sin(petT * .08) * 3.5); x.scale(2.6, 2.6);
        x.fillStyle = 'rgba(123,63,240,.28)';
        x.beginPath(); x.moveTo(-11, -4); x.lineTo(-10, -16); x.lineTo(-2, -9); x.fill();
        x.beginPath(); x.moveTo(11, -4); x.lineTo(10, -16); x.lineTo(2, -9); x.fill();
        x.beginPath(); x.ellipse(0, 0, 12, 11, 0, 0, 7); x.fill();
        x.fillStyle = '#fff'; x.font = '800 12px sans-serif'; x.textAlign = 'center'; x.fillText('?', 0, 4.5);
        x.restore(); return;
      }
      drawPet(x, PET_MK_DEF, 72, 62, 2.6, petT + 60); return;
    }
    drawPet(x, petType(k), 72, 62, 2.6, petT + (k === 'lirika' ? 20 : k === 'pati' ? 40 : 0));
  });
}
function petMkOpen(){
  var cur = petData && petData.pets.meu;
  petMk = JSON.parse(JSON.stringify((cur && cur.cfg) || PET_MK_DEF));
  $('petMkName').value = cur ? cur.nome : '';
  $('petMkSave').textContent = tr(cur ? 'SALVAR' : 'CRIAR');
  petView = 'make'; petShow();
}
// Lista de itens do guarda-roupa do pet no camarim: [chave, emoji, nome, preço em ★]
var PET_WARDROBE = [
  ['',         '✖',  'Nenhum',    0],
  ['laco',     '🎀', 'Laço',     15],
  ['flor',     '🌸', 'Flor',     20],
  ['oculos',   '👓', 'Óculos',   25],
  ['estrela',  '⭐', 'Estrela',  30],
  ['anel',     '🪐', 'Anel',     40],
  ['bochecha', '😊', 'Bochechas', 10]
];
function petDressMenuUI(m, p){
  petData.roupas = petData.roupas || { '': 1 };
  var isMeu = (petData.ativo === 'meu' && p.cfg);
  var curAcc = isMeu ? (p.cfg.acc || '') : (p.acc || '');
  var curBoch = isMeu ? !!p.cfg.bochecha : !!p.bochecha;
  m.hidden = false;
  m.innerHTML = PET_WARDROBE.map(function(it){
    var k = it[0], own = (k === '' || !!petData.roupas[k]);
    var eq = (k === 'bochecha') ? curBoch : (curAcc === k);
    var lock = !own && it[4];   // item de estágio ainda não conquistado (V2.1)
    var tag = own ? (eq ? '✓ ' + tr('Ativo') : tr('Usar')) : lock ? '🔒 ' + tr(PET_STAGES[it[4]][1]) : ('★ ' + it[3]);
    var off = lock || (!own && starT < it[3]);
    return '<button type="button" data-k="' + k + '"' + (off ? ' disabled' : '') + ' aria-pressed="' + eq + '">' +
           '<span style="font-size:20px;line-height:1.2">' + it[1] + '</span>' +
           '<b>' + escHtml(tr(it[2])) + '</b><em>' + tag + '</em></button>';
  }).join('');
}
function petDressClick(k){
  var p=petAtivo();if(!p||!petData)return;
  var it=petFind(PET_WARDROBE,k);if(!it)return;
  petData.roupas=petData.roupas||{'':1};
  var comprar=k!==''&&!petData.roupas[k];if(comprar&&it[4])return;
  return petPay(comprar ? it[3] : 0).then(function(ok){
    if(!ok){petSay(tr('Estrelas insuficientes'));beep(220,.15,'square',.04);return;}
    if(comprar){petData.roupas[k]=1;if(sfx.card)sfx.card();}
    else beep(988,.05,'triangle',.04);
    var isMeu=(petData.ativo==='meu'&&p.cfg);
    if(k==='bochecha'){
      if(isMeu)p.cfg.bochecha=!p.cfg.bochecha;
      else p.bochecha=!p.bochecha;
    }else{
      if(isMeu)p.cfg.acc=(p.cfg.acc===k?'':k);
      else p.acc=(p.acc===k?'':k);
    }
    petHop=16;petSmile=45;petSave(true);petUI();
  });
}
function petMakeUI(){
  var box = $('petMkOpts'); box.innerHTML = '';
  var jaAdotado = !!(petData && petData.pets && petData.pets.meu);
  function grp(label, html){ var d = document.createElement('div'); d.className = 'grp'; d.innerHTML = '<span>' + escHtml(tr(label)) + '</span>' + html; box.appendChild(d); }
  function chips(campo, lista){ return lista.map(function(o){ return '<button type="button" data-f="' + campo + '" data-v="' + o[0] + '" aria-pressed="' + (petMk[campo] === o[0]) + '">' + o[1] + ' ' + escHtml(tr(o[2])) + '</button>'; }).join(''); }
  // Só deixa escolher Orelhas e Cor ANTES de adotar; depois de adotado, a cor e espécie são fixas!
  if(!jaAdotado){
    grp('Orelhas', chips('orelha', PET_MK.orelha));
    grp('Cor', PET_MK.cor.map(function(c){ return '<button type="button" class="sw2" data-f="cor" data-v="' + c + '" aria-pressed="' + (petMk.cor === c) + '" style="background:' + c + '" aria-label="' + c + '"></button>'; }).join(''));
  }
  grp('Olhos', chips('olhos', PET_MK.olhos));
  grp('Bochechas', '<button type="button" data-f="bochecha" data-v="1" aria-pressed="' + !!petMk.bochecha + '">🌸 ' + escHtml(tr('Sim')) + '</button><button type="button" data-f="bochecha" data-v="0" aria-pressed="' + !petMk.bochecha + '">' + escHtml(tr('Não')) + '</button>');
  grp('Acessório', chips('acc', PET_MK.acc));
  if(!jaAdotado || !(petData.pets.meu.cfg && petData.pets.meu.cfg.pers)) grp('Personalidade', chips('pers', PET_MK.pers));
}
function petDrawMake(){
  var c = $('petMkCv'), x = c.getContext('2d');
  x.clearRect(0, 0, 300, 200);
  var gr = x.createRadialGradient(150, 100, 10, 150, 100, 110);
  gr.addColorStop(0, 'rgba(255,200,235,.7)'); gr.addColorStop(1, 'rgba(255,200,235,0)');
  x.fillStyle = gr; x.fillRect(0, 0, 300, 200);
  x.fillStyle = 'rgba(123,63,240,.15)'; x.beginPath(); x.ellipse(150, 168, 56, 10, 0, 0, 7); x.fill();
  if(petMk) drawPet(x, petMk, 150, 100, 4.2, petT);
}
// ex: 'amor' (carinho), 'feliz' (brincar/banho), 'nhac' (comendo), 'sono', 'choro' (fome ou saudade)
function petEx(p, foto){
  if(!foto){
    if(petAnim) return petAnim.k === 'comer' ? 'nhac' : 'feliz';
    if(petLove > 0) return 'amor';
  }
  if(p.dorme || p.energia < 25) return 'sono';
  if(p.fome < 25 || p.humor < 25) return 'choro';
  if(!foto && petCharT > 0) return 'feliz';
  return null;
}
function petFace(ctx, ex, o, t){   // desenha olhos e boca de expressão (o: posição dos olhos e da boca)
  function E(cx, cy, rx, ry){ ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 7); ctx.fill(); }
  var ox = o.x, ey = o.y, my = o.m, c = o.c || '#2b1b3a';
  ctx.lineCap = 'round';
  if(ex === 'amor'){
    ctx.fillStyle = '#ff4f9a';
    [-1, 1].forEach(function(s){ var hx = s * ox, hy = ey;
      ctx.beginPath(); ctx.moveTo(hx, hy + 2.3);
      ctx.bezierCurveTo(hx - 3.3, hy - .1, hx - 1.9, hy - 3.1, hx, hy - 1.2);
      ctx.bezierCurveTo(hx + 1.9, hy - 3.1, hx + 3.3, hy - .1, hx, hy + 2.3); ctx.fill(); });
    ctx.fillStyle = '#be185d'; ctx.beginPath(); ctx.arc(0, my, 2.4, 0, Math.PI); ctx.fill();
  } else if(ex === 'feliz' || ex === 'nhac'){
    ctx.strokeStyle = c; ctx.lineWidth = 1.3;
    [-1, 1].forEach(function(s){ ctx.beginPath(); ctx.arc(s * ox, ey + .9, 2, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); });
    ctx.fillStyle = '#be185d';
    if(ex === 'nhac'){ E(0, my + .3, 2, .5 + 1.6 * Math.abs(Math.sin(t * .35))); }
    else { ctx.beginPath(); ctx.arc(0, my - .4, 2.6, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#f9a8d4'; E(0, my + 1.2, 1.4, .7); }
  } else if(ex === 'sono'){
    ctx.strokeStyle = c; ctx.lineWidth = 1.2;
    [-1, 1].forEach(function(s){ ctx.beginPath(); ctx.arc(s * ox, ey - .6, 2, Math.PI * .15, Math.PI * .85); ctx.stroke(); });
    ctx.fillStyle = c; E(0, my + .4, 1, 1.2);
  } else if(ex === 'choro'){
    ctx.fillStyle = c; E(-ox, ey, 2.4, 2.9); E(ox, ey, 2.4, 2.9);
    ctx.fillStyle = '#fff'; E(-ox - .8, ey - 1, 1, 1.2); E(ox - .8, ey - 1, 1, 1.2); E(-ox + .7, ey + .9, .5, .5); E(ox + .7, ey + .9, .5, .5);
    var td = (t * .03) % 1;
    ctx.fillStyle = 'rgba(125,211,252,.95)'; E(-ox - .4, ey + 3.2 + td * 4, 1, 1.5); E(ox + .4, ey + 3.2 + ((td + .5) % 1) * 4, 1, 1.5);
    ctx.strokeStyle = c; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(-2, my + 1); ctx.quadraticCurveTo(-1, my - .6, 0, my + .6); ctx.quadraticCurveTo(1, my - .6, 2, my + 1); ctx.stroke();
  }
}
function petDrawDirt(x, p, cx, cy){   // sujeirinha e "cheirinho" quando a higiene está baixa
  if(!p || p.higiene >= 25) return;
  x.save(); x.translate(cx, cy); x.scale(PET_SC, PET_SC);
  x.fillStyle = 'rgba(120,80,40,.55)';
  [[-6, 4, 1.6], [5, 6, 1.3], [-1, 8, 1.1], [8, -3, 1.2], [-8, -2, .9]].forEach(function(d){ x.beginPath(); x.arc(d[0], d[1], d[2], 0, 7); x.fill(); });
  x.strokeStyle = 'rgba(132,204,22,.6)'; x.lineWidth = .8; x.lineCap = 'round';
  [-14, 14].forEach(function(sx, i){ var o = Math.sin(petT * .08 + i) * 1.5;
    x.beginPath(); x.moveTo(sx, -2); x.quadraticCurveTo(sx + 2, -6 + o, sx, -9); x.quadraticCurveTo(sx - 2, -12 + o, sx, -15); x.stroke(); });
  x.restore();
}
function petDrawCustom(ctx, cfg, t, ex, appearanceOverride){
  var cor = cfg.cor || '#ff6fb5', lt = petMix(cor, 1, .45), dk = petMix(cor, 0, .3), dk2 = petMix(cor, 0, .6);
  ctx.shadowColor = lt; ctx.shadowBlur = 12;
  ctx.fillStyle = dk; petDrawEllipse(ctx,-6, 10, 3, 2.5); petDrawEllipse(ctx,6, 10, 3, 2.5);
  if(cfg.orelha === 'gato'){ ctx.fillStyle = dk; petDrawPolygon(ctx,[-11, -4, -10, -16, -2, -9]); petDrawPolygon(ctx,[11, -4, 10, -16, 2, -9]); ctx.fillStyle = '#f9a8d4'; petDrawPolygon(ctx,[-9, -5, -8.5, -13, -4, -8.5]); petDrawPolygon(ctx,[9, -5, 8.5, -13, 4, -8.5]); }
  else if(cfg.orelha === 'coala'){ ctx.fillStyle = dk; petDrawEllipse(ctx,-10, -7, 5, 5); petDrawEllipse(ctx,10, -7, 5, 5); ctx.fillStyle = lt; petDrawEllipse(ctx,-10, -7, 2.8, 2.8); petDrawEllipse(ctx,10, -7, 2.8, 2.8); }
  else if(cfg.orelha === 'coelho'){ ctx.fillStyle = dk; petDrawEllipse(ctx,-5, -14, 2.8, 7, -.15); petDrawEllipse(ctx,5, -14, 2.8, 7, .15); ctx.fillStyle = '#f9a8d4'; petDrawEllipse(ctx,-5, -14, 1.3, 5, -.15); petDrawEllipse(ctx,5, -14, 1.3, 5, .15); }
  if(!petDrawRampCustomBody(ctx,cor,lt,dk)){
    var bg = ctx.createLinearGradient(0, -11, 0, 11);
    bg.addColorStop(0, lt); bg.addColorStop(.6, cor); bg.addColorStop(1, dk);
    ctx.fillStyle = bg; petDrawEllipse(ctx,0, 0, 12, 11);
  }
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.45)'; petDrawEllipse(ctx,-4, -6, 3.5, 1.8, -.3);
  if(cfg.orelha === 'coroa'){
    ctx.save(); ctx.translate(4, -11); ctx.rotate(.22);
    if(!petDrawRampCrown(ctx)){
      var cg = ctx.createLinearGradient(0, -6, 0, 2); cg.addColorStop(0, '#fde047'); cg.addColorStop(1, '#d97706');
      ctx.fillStyle = cg; petDrawPolygon(ctx,[-6, 2, -6, -5, -2, -1, 0, -6, 2, -1, 6, -5, 6, 2]);
    }
    ctx.strokeStyle = '#92400e'; ctx.lineWidth = .8; ctx.beginPath();ctx.moveTo(-6,2);ctx.lineTo(-6,-5);ctx.lineTo(-2,-1);ctx.lineTo(0,-6);ctx.lineTo(2,-1);ctx.lineTo(6,-5);ctx.lineTo(6,2);ctx.closePath();ctx.stroke(); ctx.restore();
  }
  var o = { x:4.5, y:-1, m:2.6, c:dk2 };
  if(ex) petFace(ctx, ex, o, t);
  else if(cfg.olhos === 'feliz') petFace(ctx, 'feliz', o, t);
  else if(cfg.olhos === 'sono') petFace(ctx, 'sono', o, t);
  else {
    var big = cfg.olhos === 'brilho';
    ctx.fillStyle = dk2; petDrawEllipse(ctx,-4.5, -1, big ? 2.6 : 2.2, big ? 3.1 : 2.6); petDrawEllipse(ctx,4.5, -1, big ? 2.6 : 2.2, big ? 3.1 : 2.6);
    ctx.fillStyle = '#fff'; petDrawEllipse(ctx,-5.2, -2.2, big ? 1.1 : .9, big ? 1.3 : 1.1); petDrawEllipse(ctx,3.8, -2.2, big ? 1.1 : .9, big ? 1.3 : 1.1);
    if(big){ petDrawEllipse(ctx,-3.8, .5, .55, .55); petDrawEllipse(ctx,5.2, .5, .55, .55); }
    ctx.strokeStyle = dk2; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 2.4, 1.8, Math.PI * .15, Math.PI * .85); ctx.stroke();
  }
  var hasOverride=appearanceOverride&&typeof appearanceOverride==='object',
      cheeks=hasOverride&&typeof appearanceOverride.bochecha==='boolean'?appearanceOverride.bochecha:!!cfg.bochecha;
  if(cheeks){ ctx.fillStyle = 'rgba(255,111,181,.55)'; petDrawEllipse(ctx,-7.6, 2.9, 2.2, 1.2); petDrawEllipse(ctx,7.6, 2.9, 2.2, 1.2); }
  var a = hasOverride&&typeof appearanceOverride.acc==='string'?appearanceOverride.acc:cfg.acc;
  if(a === 'laco'){ ctx.fillStyle = '#ff4f9a'; petDrawPolygon(ctx,[-7, -10, -12, -13, -12, -7]); petDrawPolygon(ctx,[-7, -10, -2, -13, -2, -7]); ctx.fillStyle = '#be185d'; petDrawEllipse(ctx,-7, -10, 1.4, 1.4); }
  else if(a === 'estrela'){ ctx.fillStyle = '#ffe14d'; ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = .6; ctx.beginPath();
    for(var q = 0; q < 10; q++){ var rr = q % 2 ? 1.8 : 4.2, an = q * Math.PI / 5 - Math.PI / 2; ctx[q ? 'lineTo' : 'moveTo'](8 + Math.cos(an) * rr, -10 + Math.sin(an) * rr); }
    ctx.closePath(); ctx.fill(); ctx.stroke(); }
  else if(a === 'anel'){ ctx.save(); ctx.rotate(-.22); ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,.88)'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.ellipse(0, 2, 20, 4.5, 0, -0.35, Math.PI + 0.35); ctx.stroke();
    ctx.strokeStyle = lt; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, 2, 18.5, 3.5, 0, 0.05, Math.PI - 0.05); ctx.stroke(); ctx.restore(); }
  else if(a === 'oculos'){ ctx.strokeStyle = '#1f2937'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(-4.5, -1, 3.4, 0, 7); ctx.moveTo(7.9, -1); ctx.arc(4.5, -1, 3.4, 0, 7); ctx.moveTo(-1.1, -1.5); ctx.lineTo(1.1, -1.5); ctx.stroke(); }
  else if(a === 'flor'){ ctx.fillStyle = '#ffc4d8'; for(var k = 0; k < 5; k++){ var an2 = k * 1.2566 - 1.57; petDrawEllipse(ctx,-8 + Math.cos(an2) * 2.4, -9 + Math.sin(an2) * 2.4, 2, 2); } ctx.fillStyle = '#e85a8a'; petDrawEllipse(ctx,-8, -9, 1.3, 1.3); }
  else if(a) petDrawRankAcc(ctx, a);   // acessórios de estágio (V2.1)
}
function petCharTap(){
  if(petCharT > 0) return;
  petCharT = 24; petSmile = 50;
  var p = petAtivo(), acordado = !!(p && !p.dorme);
  petEmote = { s:PET_EMOTES[Math.floor(Math.random() * PET_EMOTES.length)], t:0,
    toqueIdol:acordado && !petAnim };
  // Chu pula; Koali e Pucchi respondem com gestos suaves no mesmo Canvas.
  if(acordado && petRecepcaoJeito(petData.ativo, p.cfg) === 'tsu') petHop = 20;
  petCharVoice();
}
function petDrawEmote(x){
  if(!petEmote) return;
  var e = petEmote; e.t+=petDrawDelta;
  x.globalAlpha = e.t < 70 ? 1 : Math.max(0, 1 - (e.t - 70) / 20);
  x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
  var w = x.measureText(e.s).width + 18, bx = 114, by = PET_FLOOR - 124 - Math.min(6, e.t * .4);
  x.fillStyle = 'rgba(255,255,255,.95)';
  x.beginPath(); x.moveTo(bx - w / 2 + 9, by - 11); x.arcTo(bx + w / 2, by - 11, bx + w / 2, by + 9, 9); x.arcTo(bx + w / 2, by + 9, bx - w / 2, by + 9, 9);
  x.lineTo(bx + 4, by + 9); x.lineTo(bx, by + 15); x.lineTo(bx - 4, by + 9);
  x.arcTo(bx - w / 2, by + 9, bx - w / 2, by - 11, 9); x.arcTo(bx - w / 2, by - 11, bx + w / 2, by - 11, 9); x.closePath(); x.fill();
  x.strokeStyle = 'rgba(255,111,181,.6)'; x.lineWidth = 1.2; x.stroke();
  x.fillStyle = '#7b3ff0'; x.fillText(e.s, bx, by + 3.5);
  x.globalAlpha = 1;
  if(e.t > 90) petEmote = null;
}
function petDrawDecor(x){
  if(!petData || !petData.decor) return;
  PET_DECOR.forEach(function(it){
    var k = it[0], im = petDecorImgs[k];
    if(!petData.decor[k] || !im || !im.complete || !im.naturalWidth) return;
    var px = it[3], py = it[4], w = it[5], h = it[6], st = it[7];
    x.save(); x.translate(px + w / 2, py + h / 2); x.rotate(it[8]);
    x.shadowColor = 'rgba(80,30,120,.28)'; x.shadowBlur = 4; x.shadowOffsetY = 2;
    if(st === 'polaroid'){ x.fillStyle = '#fff'; x.fillRect(-w / 2 - 2.5, -h / 2 - 2.5, w + 5, h + 9); }
    else if(st === 'quadro'){ x.fillStyle = '#f4c96b'; x.fillRect(-w / 2 - 3, -h / 2 - 3, w + 6, h + 6); }
    else { x.fillStyle = '#fff'; x.fillRect(-w / 2 - 1, -h / 2 - 1, w + 2, h + 2); }
    x.shadowColor = 'transparent';
    if(st === 'quadro'){ x.fillStyle = '#c8963e'; x.fillRect(-w / 2 - 1, -h / 2 - 1, w + 2, h + 2); }
    x.drawImage(im, -w / 2, -h / 2, w, h);
    if(st === 'poster'){   // fitas nos cantos
      x.fillStyle = 'rgba(255,111,181,.55)';
      x.save(); x.translate(-w / 2 + 2, -h / 2 + 1); x.rotate(-.6); x.fillRect(-5, -2, 10, 4); x.restore();
      x.save(); x.translate(w / 2 - 2, -h / 2 + 1); x.rotate(.6); x.fillRect(-5, -2, 10, 4); x.restore();
    } else if(st === 'polaroid'){   // alfinete
      x.fillStyle = '#ff6fb5'; x.beginPath(); x.arc(0, -h / 2 - 1, 1.8, 0, 7); x.fill();
      x.fillStyle = 'rgba(255,255,255,.7)'; x.beginPath(); x.arc(-.5, -h / 2 - 1.6, .6, 0, 7); x.fill();
    }
    x.restore();
  });
}
function petDecorMenuUI(m){
  var d = petData.decor || {};
  m.hidden = false;
  m.innerHTML = PET_DECOR.map(function(it){
    var k = it[0], own = k in d;
    var tag = own ? (d[k] ? '🖼️ ' + tr('Na parede') : tr('Guardado')) : (it[2] ? '★ ' + it[2] : tr('Grátis'));
    var off = !own && starT < it[2];
    return '<button type="button" data-k="' + k + '"' + (off ? ' disabled' : '') + ' aria-pressed="' + !!(own && d[k]) + '"><img src="' + PET_DECOR_IMG[k] + '" alt="">' +
           '<b>' + escHtml(tr(it[1])) + '</b><em>' + tag + '</em></button>';
  }).join('');
}
function petDecorClick(k){
  var it=petFind(PET_DECOR,k);if(!it||!petData)return;
  var d=petData.decor,comprar=!(k in d);
  return petPay(comprar ? it[2] : 0).then(function(ok){
    if(!ok){petSay(tr('Estrelas insuficientes'));beep(220,.15,'square',.04);return;}
    if(comprar){d[k]=1;petSay('🖼️ '+tr(it[1])+'!');if(sfx.card)sfx.card();}
    else {d[k]=d[k]?0:1;beep(d[k]?988:660,.06,'triangle',.04);}
    petBg=null;petSave(true);petUI();
  });
}
var PET_SING_CD = 10;          // minutos entre um show e outro
var petSinging = false;        // durante o show a faixa de fundo fica em silêncio
var petMi = 0, petMusLast = '';
// Melodia original em Fá maior (64 passos = 8 compassos de colcheias; 0 = pausa)
var PET_MEL = [
  440, 0, 523, 659, 0, 587, 523, 0,     392, 0, 349, 440, 523, 0, 587, 0,
  466, 0, 587, 698, 0, 659, 587, 523,   523, 0, 0, 392, 440, 466, 440, 0,
  523, 0, 659, 784, 0, 698, 659, 0,     698, 0, 659, 587, 0, 523, 440, 0,
  466, 523, 587, 0, 698, 0, 659, 587,   659, 0, 0, 0, 523, 0, 0, 0
];
// Acordes com sétima (um por compasso): Fmaj7, Dm7, Gm7, C7
var PET_CHORDS = [[174.61, 220, 261.63, 329.63], [146.83, 174.61, 220, 261.63], [196, 233.08, 293.66, 349.23], [130.81, 196, 233.08, 329.63]];
// Jingle original do 🎤 Cantar (32 passos de 0,15 s) e o baixo de cada tempo
var PET_JINGLE = [523, 587, 659, 784, 659, 0, 523, 0, 587, 659, 698, 880, 784, 0, 0, 0,
                  880, 784, 659, 698, 784, 0, 659, 0, 587, 523, 587, 659, 698, 0, 1047, 0];
var PET_JBASS = [174.61, 130.81, 146.83, 196, 174.61, 164.81, 196, 174.61];
// Som com "deslize" de tom (o beep() toca uma nota fixa; aqui a nota escorrega de f1 para f2)
function petGlide(f1, f2, d, t, v, when){
  var a = ac(); if(!a || muted) return;
  var o = a.createOscillator(), gn = a.createGain(), s = a.currentTime + (when || 0);
  o.type = t || 'sine';
  o.frequency.setValueAtTime(f1, s); o.frequency.exponentialRampToValueAtTime(f2, s + d);
  gn.gain.setValueAtTime(.0001, s); gn.gain.exponentialRampToValueAtTime(v || .05, s + .015); gn.gain.exponentialRampToValueAtTime(.001, s + d);
  o.connect(gn); gn.connect(a.destination); o.start(s); o.stop(s + d + .02);
}
function petMusicK(){
  if(!petOpen) return 'menu';
  var p = petData && petAtivo();
  return (p && p.dorme && petView === 'room') ? 'petSono' : 'pet';
}
function petMusicStep(k){
  if(petMusLast !== k){ petMusLast = k; petMi = 0; }   // toda faixa começa do primeiro compasso
  var i = petMi++ % 64, st = i % 8, ch = PET_CHORDS[(i >> 3) % 4], n = PET_MEL[i];
  if(petSinging) return;
  if(k === 'pet'){
    // Lofi chiptune: acorde dedilhado, baixo sincopado, melodia com leve "chorus" e balanço (swing)
    var sw = st % 2 ? .06 : 0;
    if(st === 0) ch.forEach(function(f, j){ beep(f, 1.7, 'triangle', .011, j * .014); });
    if(st === 4) beep(ch[3], .9, 'triangle', .008);
    if(st === 0 || st === 5) beep(ch[0] / 2, .45, 'triangle', .045, sw);
    if(n){ beep(n, .3, 'triangle', .02, sw); beep(n * 1.004, .22, 'square', .007, sw); }
    if(st % 2) beep(4200, .015, 'triangle', .004, sw);
  } else {
    if(n){ beep(n * 2, .9, 'sine', .022); beep(n * 4, .2, 'sine', .003); }
    if(st === 0) beep(ch[0] * 2, 1.4, 'sine', .012);
    if(st === 4) beep(ch[2] * 2, 1.2, 'sine', .009);
  }
}
function petVoice(p, kf){   // kf (opcional): pet específico (ex.: os pets do banner)
  var k = kf || (petData && petData.ativo);
  if(p && p.dorme){ petGlide(260, 200, .5, 'sine', .03); return; }                                            // ronquinho
  if(k === 'tsu'){ petGlide(620, 1180, .11, 'triangle', .06); petGlide(1180, 880, .14, 'triangle', .05, .11); }  // Chu: "nya~"
  else if(k === 'lirika'){ petGlide(480, 720, .2, 'sine', .07); petGlide(720, 560, .24, 'sine', .055, .2); }      // Koali: "kyu~" macio
  else if(k === 'pati'){ petGlide(520, 380, .08, 'square', .03); petGlide(330, 250, .14, 'square', .028, .1); }   // Pucchi: "hmph!"
  else { petGlide(1100, 1500, .06, 'sine', .06); petGlide(1100, 1600, .07, 'sine', .06, .1); }                    // Meu Pet: "pi-pi!"
}
function petCharVoice(){
  if(sel === 0){ petGlide(660, 1320, .09, 'square', .03); beep(1568, .07, 'square', .03, .09); }                          // Tsu: "pyon!" espacial
  else if(sel === 1){ beep(659, .14, 'triangle', .06); beep(784, .2, 'triangle', .06, .1); beep(988, .16, 'sine', .02, .1); } // Lirika: "la~" doce
  else if(sel === 2){ petGlide(440, 660, .1, 'sawtooth', .025); beep(880, .12, 'square', .03, .1); }                     // Pati: "hm~♪" confiante
  else { beep(880, .07, 'sine', .06); beep(1175, .1, 'sine', .05, .07); }                                                // Você: "pon-pon"
}
function petSing(){
  var p = petAtivo(); if(!p || p.dorme || petAnim) return;
  petTick();
  if(petRecLeft('cantar', PET_SING_CD) > 0) return;
  if(p.energia < 10){ petSay(tr('Está cansado demais...')); return; }
  petData.rec = petData.rec || {};
  p.humor = petClamp(p.humor + 12); p.energia = petClamp(p.energia - 4);
  petData.rec.cantar = Date.now();
  petAnim = { k:'cantar', t:0 }; petMenuK = '';
  petXP(p, 6);   // pontos de cuidado (V2.1)
  petSinging = true;
  PET_JINGLE.forEach(function(f, i){
    var w = i * .15;
    if(f){ beep(f, .16, 'square', .022, w); beep(f / 2, .2, 'triangle', .03, w); }
    if(i % 4 === 0) beep(PET_JBASS[i / 4], .5, 'triangle', .045, w);
    if(i % 2) beep(4200, .02, 'triangle', .006, w);
  });
  petEmote = { s:'♪ ラララ ♪', t:0 };
  petSave(true); petUI();
}
// Animação do show (chamada dentro do petDrawExtras)
function petSingFrame(x, a){
  // Holofotes de palco balançando
  x.save();
  var hg = x.createLinearGradient(0, 0, 0, PET_FLOOR + 4);
  hg.addColorStop(0, 'rgba(255,236,150,.5)'); hg.addColorStop(1, 'rgba(255,170,215,.22)');
  x.fillStyle = hg;
  [[110, -.18], [PET_X, .18]].forEach(function(b){
    var sx = b[0] + Math.sin(a.t * .05 + b[1] * 9) * 10;
    x.beginPath(); x.moveTo(sx - 8 + b[1] * 60, 0); x.lineTo(sx + 8 + b[1] * 60, 0); x.lineTo(sx + 46, PET_FLOOR + 4); x.lineTo(sx - 46, PET_FLOOR + 4); x.closePath(); x.fill();
  });
  x.restore();
  // Microfone na mão do personagem (acompanha o pulinho)
  var mj = petCharT > 0 ? Math.sin((24 - petCharT) / 24 * Math.PI) * 12 : 0;
  x.save(); x.translate(0, -mj + Math.sin(petT * .05) * 1.5);
  x.lineCap = 'round'; x.strokeStyle = '#ff6fb5'; x.lineWidth = 3.2;
  x.beginPath(); x.moveTo(147, PET_FLOOR - 46); x.lineTo(141, PET_FLOOR - 61); x.stroke();
  x.fillStyle = '#d7dbe6'; x.beginPath(); x.arc(139.5, PET_FLOOR - 65, 4.6, 0, 7); x.fill();
  x.strokeStyle = 'rgba(80,60,110,.35)'; x.lineWidth = .7; x.stroke();
  x.fillStyle = 'rgba(255,255,255,.85)'; x.beginPath(); x.arc(138.1, PET_FLOOR - 66.6, 1.4, 0, 7); x.fill();
  x.restore();
  // Notinhas no ritmo, pet pulando e personagem dançando
  if(a.t % 18 === 1){ petHop = 16; petFx.push({ x:PET_X + (Math.random() * 36 - 18), y:PET_FLOOR - 60, t:0, s:['🎵', '🎶', '💖', '✨'][(a.t / 18 | 0) % 4] }); }
  if(a.t % 36 === 1){ petCharT = 24; petFx.push({ x:104 + Math.random() * 24, y:PET_FLOOR - 112, t:0, s:a.t % 72 === 1 ? '🎤' : '🎶' }); }
  petSmile = 40;
  if(a.t === 150) petEmote = { s:'♪ ～ ♪', t:0 };
  if(a.t >= 295){
    petAnim = null; petSinging = false;
    petVoice(petAtivo());
    petFx.push({ x:PET_X, y:PET_FLOOR - 70, t:0, s:'👏' });
    petSay(tr('Que show!') + ' 🎤');
    petUI();
  }
}
var PET_TALK_CD = 60;          // minutos para o próximo bônus de humor da conversa
var petTalkB = null, petTalkLast = '';
// Personalidade de cada pet (o Meu Pet escolhe a dele no criador)
var PET_PERS = { tsu:'eletrico', lirika:'sono', pati:'marrento' };
// {n} = nome de Idol · {p} = nome do pet
var PET_FALAS = {
  eletrico: {
    'Feliz!': ['Nyaa! Hoje eu brilho mais que estrela! ☆(ゝω・)v', 'Bora fazer um show? Eu já tô aquecido! ٩(^ω^)و', 'Meu coração tá dando loop de montanha-russa! (ﾉ≧∀≦)ﾉ'],
    'Tranquilo': ['Sabia que existe planeta feito de diamante? Eu quero um! (・ω・)ノ', 'Tô contando as estrelinhas do teto… já perdi a conta! (*\'▽\'*)', 'Nya~ tô de boa, mas pronto pra aventura! (｀・ω・´)✧'],
    'Com fome...': ['Minha barriga tá fazendo barulho de nave espacial… (´・ω・`)', 'Dango! Gyoza! Qualquer coisa! Rápido! ヽ(°〇°)ﾉ', 'Se eu não comer agora, viro poeira cósmica… (×_×)'],
    'Com sono...': ['Só mais um pulinho… e depois dormir… (=^-ω-^=)', 'Minha bateria tá piscando no vermelho… (－ω－) zzz', 'Eu NÃO tô com sono! …tô sim. (￣o￣) zzZ'],
    'Precisa de banho...': ['Rolei numa nuvem de poeira estelar… acho que preciso de banho! (^▽^;)', 'Tô cheirando a corrida de 5000 pontos… (；￣Д￣)', 'Banho de espuma! Com bolhas gigantes! Por favor! ✧(◕‿◕✿)'],
    'Com saudade...': ['Você sumiu igual cometa… volta mais vezes? (｡•́︿•̀｡)', 'Fiquei olhando a porta esperando você… (´；ω；`)', 'Brinca comigo? Só um pouquinho? (っ´ω`)っ'],
    'Dormindo...': ['…mais cinco voltas na lua… zzz', '…nyaa… estrela cadente… minha… zzz'],
    dia: ['Bom diaaa! O sol já subiu no palco! ☀️ ٩(◕‿◕)۶'],
    noite: ['A noite é a melhor hora pra ver estrela! ☆ﾟ.*･｡ﾟ'],
    nome: ['{n}! {n}! Olha eu aqui! ヾ(≧▽≦*)o', '{n} é a melhor Idol da galáxia inteira! ★']
  },
  sono: {
    'Feliz!': ['Fico quentinha quando você vem aqui… (˘ω˘)♡', 'Hoje tá tudo tão macio… igual nuvem… (◡‿◡✿)', 'Obrigada por cuidar de mim… de verdade… (っ´▽`)っ♡'],
    'Tranquilo': ['Tô aqui… só existindo… devagarinho… (￣ー￣)', 'Sabe o que é bom? Ficar paradinha… com você… (´ω`)', 'Escutei a música do camarim… ela é fofinha… ♪(´ε`)'],
    'Com fome...': ['Um dango… pequenininho… por favor? (｡•́︿•̀｡)', 'Minha barriguinha fez "kyu~"… (´；ω；`)', 'Será que tem tiramisu… escondido em algum lugar…? (・ω・)'],
    'Com sono...': ['Cinco minutinhos… ou cinquenta… (－_－) zzZ', 'Meus olhinhos tão pesados… igual cobertor… (˘ω˘)', 'Posso dormir aqui no seu colo…? (。-ω-)zzz'],
    'Precisa de banho...': ['Banho quentinho… depois soneca… combinado? (´･ω･`)', 'Acho que dormi na poeira… ops… (〃▽〃)', 'Quero ficar cheirosa… igual flor… 🌸 (◡ω◡)'],
    'Com saudade...': ['Senti sua falta… bem baixinho… (´._.`)', 'Guardei um cantinho do sofá pra você… (っ˘ω˘ς)', 'Fica mais um pouquinho…? (｡•́︿•̀｡)'],
    'Dormindo...': ['…dango… de nuvem… zzz', '…kyu… tá quentinho… zzz'],
    dia: ['Bom dia… já? …tá bom… (－ω－)☀️'],
    noite: ['Boa noite… sonha comigo, tá…? 🌙 (˘ω˘)'],
    nome: ['{n}… gosto de falar seu nome… ele é macio… (◡‿◡)', '{n}, você canta tão bonito… eu durmo feliz… ♪']
  },
  marrento: {
    'Feliz!': ['Hmph. Não é como se eu gostasse de carinho… continua. (￣^￣)', 'Tá, admito: hoje foi um dia digno da realeza. 👑 (￣ー￣)', 'Não fica se achando só porque eu tô sorrindo. (¬‿¬)'],
    'Tranquilo': ['Estou supervisionando o camarim. É um trabalho importante. (￣^￣)ゞ', 'Hmph. Até que esse lugar é aceitável. (¬_¬)', 'Um rei não precisa de nada. …talvez de um petisco. (￣～￣)'],
    'Com fome...': ['Gyoza. Agora. Eu sou da realeza, sabia? (¬_¬)', 'O serviço deste camarim está péssimo. Cadê meu bolo? (╬Ò﹏Ó)', 'Não tô com fome. Minha barriga que tá. Hmph. (｀へ´)'],
    'Com sono...': ['Um rei não boceja. Isso foi… um rugido. (－_－)', 'Não tô cansado! Só tô descansando os olhos. (￣ρ￣)..zzZ', 'Apaga a luz. É uma ordem real. 👑 (－ω－)'],
    'Precisa de banho...': ['Ninguém viu nada. Me dá logo esse banho. (╬Ò﹏Ó)', 'Uma majestade não fica suja. Isso é… purpurina escura. (¬_¬;)', 'Banho de espuma. Só aceito o de espuma. 🫧 (￣^￣)'],
    'Com saudade...': ['Hmph. Nem percebi que você sumiu. …contei cada minuto, mas nem percebi. (｀ε´)', 'Não é que eu estava te esperando. Eu só estava aqui. Na porta. (¬_¬)', 'Se você sumir de novo, eu… vou ficar bravo. Muito. (´；ω；`)'],
    'Dormindo...': ['…curvem-se… diante de {p}… zzz', '…hmph… meu gyoza… zzz'],
    dia: ['Bom dia. Pode servir meu café da manhã agora. 👑 (￣^￣)'],
    noite: ['Boa noite. E eu não ronco. Nunca. (－_－)'],
    nome: ['{n}… até que você é uma Idol razoável. Hmph. (¬‿¬)', 'Tá, {n}, você pode ser minha fã número um. Só hoje. (￣ー￣)']
  }
};
// Falas do Meu Pet sem gênero (a fala original continua para Chu, Koali e Pucchi)
var PET_NEUTRO = {
  "Bora fazer um show? Eu já tô aquecido! ٩(^ω^)و": "Bora fazer um show? Já tô no aquecimento! ٩(^ω^)و",
  "Nya~ tô de boa, mas pronto pra aventura! (｀・ω・´)✧": "Nya~ tô de boa, mas com energia pra aventura! (｀・ω・´)✧",
  "Fico quentinha quando você vem aqui… (˘ω˘)♡": "Fica tudo quentinho quando você vem aqui… (˘ω˘)♡",
  "Obrigada por cuidar de mim… de verdade… (っ´▽`)っ♡": "Valeu por cuidar de mim… de verdade… (っ´▽`)っ♡",
  "Sabe o que é bom? Ficar paradinha… com você… (´ω`)": "Sabe o que é bom? Ficar de bobeira… com você… (´ω`)",
  "Quero ficar cheirosa… igual flor… 🌸 (◡ω◡)": "Quero ficar com cheirinho de flor… 🌸 (◡ω◡)",
  "Um rei não precisa de nada. …talvez de um petisco. (￣～￣)": "A realeza não precisa de nada. …talvez de um petisco. (￣～￣)",
  "Um rei não boceja. Isso foi… um rugido. (－_－)": "A realeza não boceja. Isso foi… um rugido. (－_－)",
  "Não tô cansado! Só tô descansando os olhos. (￣ρ￣)..zzZ": "Não tô com sono! Só tô descansando os olhos. (￣ρ￣)..zzZ",
  "Se você sumir de novo, eu… vou ficar bravo. Muito. (´；ω；`)": "Se você sumir de novo, eu… vou ficar de mal. Muito. (´；ω；`)"
  };
function petPers(){
  var k = petData && petData.ativo, p = petAtivo();
  if(k === 'meu') return (p && p.cfg && p.cfg.pers) || 'eletrico';
  return PET_PERS[k] || 'eletrico';
}
function petHoraBR(){
  try{ return parseInt(new Date().toLocaleString('en-US', { timeZone:'America/Sao_Paulo', hour:'numeric', hour12:false }), 10) % 24; }
  catch(e){ return new Date().getHours(); }
}
// "Blablablá" chiptune no timbre da personalidade
function petBabble(pers, n, dorme){
  var a = ac(); if(!a || muted) return;
  var cfg = dorme ? [180, 'sine', .022, .2, .16] :
            pers === 'sono' ? [520, 'sine', .05, .16, .13] :
            pers === 'marrento' ? [300, 'square', .022, .09, .1] :
                                  [760, 'triangle', .05, .07, .085];
  if(petData && petData.ativo === 'meu') cfg[0] *= 1.15;   // Meu Pet fala um tiquinho mais agudo
  for(var i = 0; i < n; i++){
    var f = cfg[0] * (0.85 + Math.random() * .4);
    petGlide(f, f * (Math.random() < .5 ? 1.18 : .86), cfg[3], cfg[1], cfg[2], i * cfg[4]);
  }
}
function petTalk(){
  var p = petAtivo(); if(!p) return;
  if(petTalkB && petTalkB.t < 40) return;   // evita spam de cliques
  petTick();
  var F = PET_FALAS[petPers()], mood = petMood(p)[1], h = petHoraBR(), pool = F[mood] || F['Tranquilo'];
  if(!p.dorme && (mood === 'Feliz!' || mood === 'Tranquilo')){
    var r = Math.random();
    if(r < .25 && nick) pool = F.nome;
    else if(r < .45 && h >= 5 && h < 12) pool = F.dia;
    else if(r < .45 && (h >= 19 || h < 5)) pool = F.noite;
  }
  if(typeof temaFalas === 'function' && temaFalas() && Math.random() < .4) pool = temaFalas();   // V2.1.3: frases da temporada
  var opts = pool.filter(function(s){ return s !== petTalkLast; });
  var s = (opts.length ? opts : pool)[Math.floor(Math.random() * (opts.length || pool.length))];
  petTalkLast = s;
  if(petData.ativo === 'meu' && PET_NEUTRO[s]) s = PET_NEUTRO[s];   // Meu Pet fala sem gênero
  s = tr(s).split('{n}').join(nick || CH[sel].n).split('{p}').join(p.nome);
  petTalkB = { s:s, t:0, dur:Math.min(320, 110 + s.length * 3) };
  petBabble(petPers(), Math.min(9, 3 + Math.round(s.length / 12)), p.dorme);
  if(!p.dorme){
    petHop = 14; petSmile = 60;
    petData.rec = petData.rec || {};
    if(petRecLeft('falar', PET_TALK_CD) <= 0){
      petData.rec.falar = Date.now();
      p.humor = petClamp(p.humor + 5);
      petXP(p, 3);   // pontos de cuidado (V2.1)
      petFx.push({ x:PET_X + 20, y:PET_FLOOR - 60, t:0, s:'💬' });
      petSave(true); petUI();
    }
  }
}
// Balão de fala acima do pet (quebra em até 3 linhas)
function petDrawTalk(x){
  if(!petTalkB) return;
  var b = petTalkB; b.t+=petDrawDelta;
  x.save();
  x.globalAlpha = b.t < 8 ? b.t / 8 : b.t > b.dur - 20 ? Math.max(0, (b.dur - b.t) / 20) : 1;
  x.font = '800 11px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'center';
  var maxW = 176, lines = [], cur = '';
  b.s.split(' ').forEach(function(w){
    var t = cur ? cur + ' ' + w : w;
    if(x.measureText(t).width <= maxW){ cur = t; return; }
    if(cur && x.measureText(w).width <= maxW){ lines.push(cur); cur = w; return; }
    // palavra longa ou idioma sem espaços (japonês, tailandês): quebra por letra,
    // sem separar kaomoji (…) nem acentos do tailandês, e sem começar linha com 。、！？…
    var units = w.match(/\([^()]*\)|.[\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0300-\u036F\uFE0F]*/g) || [w];
    units.forEach(function(ch, i){
      var t2 = cur + (i === 0 && cur ? ' ' : '') + ch;
      if(x.measureText(t2).width > maxW && cur && '。、！？…」）～〜ー!?,.'.indexOf(ch.charAt(0)) < 0){ lines.push(cur); cur = ch; } else cur = t2;
    });
  });
  if(cur) lines.push(cur);
  if(lines.length > 3){ lines = lines.slice(0, 3); lines[2] += '…'; }
  var w = 0; lines.forEach(function(l){ w = Math.max(w, x.measureText(l).width); });
  w += 20;
  var hgt = lines.length * 14 + 10, bot = PET_FLOOR - 74 - Math.min(4, b.t * .5), top = bot - hgt;
  var cx = Math.max(w / 2 + 6, Math.min(354 - w / 2, PET_X - 10)), L = cx - w / 2, R = cx + w / 2;
  x.fillStyle = 'rgba(255,255,255,.96)';
  x.beginPath(); x.moveTo(L + 10, top); x.arcTo(R, top, R, bot, 10); x.arcTo(R, bot, L, bot, 10);
  x.lineTo(PET_X + 5, bot); x.lineTo(PET_X + 1, bot + 7); x.lineTo(PET_X - 5, bot);
  x.arcTo(L, bot, L, top, 10); x.arcTo(L, top, R, top, 10); x.closePath(); x.fill();
  x.strokeStyle = petColor(petData.ativo); x.lineWidth = 1.4; x.stroke();
  x.fillStyle = '#12365e';
  lines.forEach(function(l, i){ x.fillText(l, cx, top + 17 + i * 14); });
  x.restore();
  if(b.t > b.dur) petTalkB = null;
}
function petNowS(){ return performance.now() / 1000; }
function petG(fn){ var og = g; try{ fn(); } finally { g = og; } }   // troca o g com segurança (padrão do jogo)
var PET_STAGES = [   // [pontos de cuidado, rank do Center Run, emoji, acessório exclusivo liberado]
  [0,   'Audição',    '🎤', ''],
  [40,  'Kenkyuusei', '📒', 'fita'],
  [120, 'Team',       '👯', 'mic'],
  [260, 'Senbatsu',   '🌟', 'tiara'],
  [480, 'Center',     '👑', 'faixa'],
  [800, 'Kami-Oshi',  '😇', 'aureola']
];
var petPromo = null;
function petXPInit(p){   // pets antigos começam com um pouco de pontos pela idade (até o Team)
  if(typeof p.xp !== 'number'){ var dias = Math.floor((Date.now() - (p.nasc || Date.now())) / 864e5); p.xp = Math.min(120, Math.max(0, dias * 8)); }
}
function petStage(p){
  if(!p) return 0;
  petXPInit(p);
  for(var i = PET_STAGES.length - 1; i > 0; i--) if(p.xp >= PET_STAGES[i][0]) return i;
  return 0;
}
function petXP(p, n){
  if(!p || !petData) return;
  var s0 = petStage(p);
  p.xp = Math.round((p.xp + n) * 10) / 10;
  var s1 = petStage(p);
  if(s1 > s0){
    var st = PET_STAGES[s1];
    petData.roupas = petData.roupas || { '': 1 };
    if(st[3]) petData.roupas[st[3]] = 1;
    petPromo = { t:0, s:s1 };
    if(sfx.rank) sfx.rank();
  }
  petSave(true);
}
function petRankUI(p){
  var el = $('petRank'); if(!el || !p) return;
  var s = petStage(p), st = PET_STAGES[s], nx = PET_STAGES[s + 1];
  petData.roupas = petData.roupas || { '': 1 };
  for(var i = 1; i <= s; i++) if(PET_STAGES[i][3]) petData.roupas[PET_STAGES[i][3]] = 1;   // garante os itens já conquistados
  var pct = nx ? Math.max(3, Math.round((p.xp - st[0]) / (nx[0] - st[0]) * 100)) : 100;
  el.innerHTML = '<b>' + st[2] + ' ' + escHtml(tr(st[1])) + '</b><i><u style="width:' + pct + '%"></u></i>' +
                 '<small>' + (nx ? Math.floor(p.xp) + '/' + nx[0] + ' → ' + escHtml(tr(nx[1])) : '⭐ MAX') + '</small>';
}
// Acessórios exclusivos desenhados no espaço do pet (chamado pelo drawPet e pelo Meu Pet)
var PET_RANK_TIARA_STARS=[[-6.5,-9.6,1.6],[0,-11.8,2.2],[6.5,-9.6,1.6]];
function petDrawRankAcc(ctx, a, tp){
  if(a === 'fita'){   // hachimaki rosa com nó de lado
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 12, 11, 0, 0, 7); ctx.clip();
    ctx.fillStyle = '#fff'; ctx.fillRect(-13, -8.6, 26, 3.4); ctx.fillStyle = '#ff6fb5'; ctx.fillRect(-13, -7.9, 26, 1.9);
    ctx.restore();
    ctx.fillStyle = '#ff6fb5'; petDrawPolygon(ctx,[10.5, -7, 15.5, -10, 14.5, -5.5]); petDrawPolygon(ctx,[10.5, -6.5, 15, -3, 12.5, -2.5]);
  } else if(a === 'mic'){   // headset com microfone
    ctx.strokeStyle = '#334155'; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, -1, 12.6, 11.6, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    ctx.fillStyle = '#334155'; petDrawEllipse(ctx,-11.6, 0, 2, 2.6);
    ctx.beginPath(); ctx.moveTo(-11, 1.5); ctx.quadraticCurveTo(-10, 6, -4, 5.6); ctx.stroke();
    ctx.fillStyle = '#ff6fb5'; petDrawEllipse(ctx,-3.6, 5.6, 1.3, 1.1);
  } else if(a === 'tiara'){   // tiara com três estrelinhas
    var tpTi = tp === 'pati'; if(tpTi){ ctx.save(); ctx.translate(-6, 3); ctx.rotate(-.42); ctx.scale(.78, .78); }   // Pucchi: tiara de lado, ao lado da coroa
    ctx.strokeStyle = '#f5b400'; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(0, -1, 11, 10.2, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    for(var si=0;si<PET_RANK_TIARA_STARS.length;si++){
      var star=PET_RANK_TIARA_STARS[si];ctx.fillStyle='#ffe14d';ctx.beginPath();
      for(var q=0;q<10;q++){var rr=q%2?star[2]*.45:star[2],an=q*Math.PI/5-Math.PI/2;ctx[q?'lineTo':'moveTo'](star[0]+Math.cos(an)*rr,star[1]+Math.sin(an)*rr);}
      ctx.closePath();ctx.fill();
    }
    if(tpTi) ctx.restore();
  } else if(a === 'faixa'){   // faixa dourada de Center atravessando o corpo
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 12, 11, 0, 0, 7); ctx.clip();
    ctx.rotate(.62); ctx.fillStyle = '#fbbf24'; ctx.fillRect(-16, 1.6, 32, 3.6);
    ctx.fillStyle = '#fff7d6'; ctx.fillRect(-16, 2.1, 32, .7);
    ctx.restore();
    ctx.fillStyle = '#ff6fb5'; petDrawEllipse(ctx,5.4, 7.6, 1.6, 1.6);
  } else if(a === 'aureola'){   // auréola dourada flutuando
    ctx.save(); ctx.shadowColor = '#fde047'; ctx.shadowBlur = 6;
    ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(0, -18.5, 8, 2.4, 0, 0, 7); ctx.stroke();
    ctx.restore();
  }
}
// Banner de promoção
function petDrawPromo(x){
  if(!petPromo) return;
  var pr = petPromo, st = PET_STAGES[pr.s]; pr.t+=petDrawDelta;
  var a = pr.t < 15 ? pr.t / 15 : pr.t > 225 ? Math.max(0, (240 - pr.t) / 15) : 1;
  x.save(); x.globalAlpha = a;
  for(var i = 0; i < 26; i++){   // confete nas cores do TsuLiPa
    var cx = (i * 53 + pr.t * (1 + i % 3)) % 360, cy = (i * 31 + pr.t * (1.2 + (i % 4) * .3)) % 220;
    x.fillStyle = ['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5', '#ffe14d'][i % 5];
    x.save(); x.translate(cx, cy); x.rotate(pr.t * .1 + i); x.fillRect(-2.5, -1.2, 5, 2.4); x.restore();
  }
  var w = 230, bx = 180 - w / 2, by = 64;
  x.fillStyle = 'rgba(255,255,255,.96)'; x.beginPath(); x.roundRect ? x.roundRect(bx, by, w, 62, 14) : x.rect(bx, by, w, 62); x.fill();
  x.strokeStyle = '#f5b400'; x.lineWidth = 2; x.stroke();
  x.textAlign = 'center'; x.fillStyle = '#ff6fb5'; x.font = '900 15px "M PLUS Rounded 1c",sans-serif';
  x.fillText('🎉 ' + tr('Promoção!') + ' 🎉', 180, by + 21);
  x.fillStyle = '#7b3ff0'; x.font = '900 17px "M PLUS Rounded 1c",sans-serif';
  x.fillText(st[2] + ' ' + tr(st[1]), 180, by + 41);
  var it = st[3] && petFind(PET_WARDROBE, st[3]);
  if(it){ x.fillStyle = '#64748b'; x.font = '700 10px "M PLUS Rounded 1c",sans-serif'; x.fillText(tr('Novo acessório') + ': ' + it[1] + ' ' + tr(it[2]), 180, by + 55); }
  x.restore();
  if(pr.t > 240) petPromo = null;
}
var PET_MINI_CAP = 50;      // teto de estrelas por dia, somando os dois minijogos
var PET_BEAT = 0.34;        // mesmo andamento da faixa lofi do camarim (Pacote A)
var PET_JUMP = 0.46;        // duração do pulo na corda (s)
var PET_LANES = ['#9b30d9', '#5cc72c', '#4169e1'];   // roxo Tsu, verde Lirika, azul Pati
var petGame = null;
var PET_SPECIAL = { sorvete:1 };
function petMenuFiltro(it){ return !PET_SPECIAL[it[0]] || ((petData.inv || {})[it[0]] > 0); }
function petMini(){   // estrelas ganhas hoje e recordes (dentro do brs48cr_pet)
  petData.mini = petData.mini || { dia:'', ganho:0, rec:{} };
  var m = petData.mini; m.rec = m.rec || {};
  if(m.dia !== dk()){ m.dia = dk(); m.ganho = 0; }
  return m;
}
function petPlayMenuUI(m, p){
  var mi = petMini(), left = petRecLeft('brincar', PET_PLAY_CD), cap = '★ ' + mi.ganho + '/' + PET_MINI_CAP + ' ' + tr('hoje');
  var opts = [
    ['estrela', '⭐', 'Pegar estrela', '+15💖', left > 0 ? '⏳ ' + Math.ceil(left / 6e4) + ' min' : tr('Grátis'), left > 0],
    ['ritmo',   '🎵', 'Ritmo',         '🏆 ' + (mi.rec.ritmo || 0), cap, false],
    ['corda',   '🪢', 'Pular corda',   '🏆 ' + (mi.rec.corda || 0), cap, false]
  ];
  m.hidden = false;
  m.innerHTML = opts.map(function(o){
    return '<button type="button" data-k="' + o[0] + '"' + (o[5] ? ' disabled' : '') + '><span style="font-size:22px;line-height:1.3">' + o[1] + '</span>' +
           '<b>' + escHtml(tr(o[2])) + '</b><small>' + o[3] + '</small><em>' + o[4] + '</em></button>';
  }).join('');
}
function petPlayClick(k){
  if(k === 'estrela'){ petPlay(); return; }
  petGameStart(k);
}
function petGameStart(k){
  var p = petAtivo(); if(!p || p.dorme || petAnim || petGame) return;
  petTick();
  if(p.energia < 15){ petSay(tr('Está cansado demais...')); return; }
  ac();
  if(document.activeElement && document.activeElement.blur) document.activeElement.blur();   // o Espaço não "clica" de novo no botão
  petMenuK = ''; petSinging = true; petTalkB = null;
  petGameBtns(false);   // 📷 e 🐾 somem durante o minijogo
  var now = petNowS(), t0 = now + 2;
  petGame = { k:k, t0:t0, last:now, fim:null, fx:[] };
  [0, .5, 1].forEach(function(w){ beep(660, .1, 'square', .03, .5 + w); });
  beep(1320, .18, 'square', .035, 2);
  if(k === 'ritmo'){
    var notes = [];
    for(var i = 0; i < 128; i++){ var n = PET_MEL[i % 64]; if(n) notes.push({ t:t0 + i * PET_BEAT, lane:n < 500 ? 0 : n < 620 ? 1 : 2, f:n, st:0 }); }
    petGame.notes = notes; petGame.step = 0; petGame.end = t0 + 128 * PET_BEAT + .6;
    petGame.score = 0; petGame.combo = 0; petGame.maxc = 0; petGame.perf = 0; petGame.bom = 0; petGame.err = 0; petGame.flash = [0, 0, 0];
  } else {
    petGame.ph = Math.PI; petGame.per = 1.3; petGame.jt = -9; petGame.pulos = 0;
  }
  petUI();
}
function petJumpH(now, jt){ var u = (now - jt) / PET_JUMP; return u < 0 || u > 1 ? 0 : 112 * u * (1 - u); }   // pico de 28px
// Toques no canvas durante o minijogo (true = o toque foi usado pelo jogo)
function petGameTap(lx, ly){
  var G = petGame; if(!G) return false;
  if(G.fim){ if(G.fim.t > 30) petGameClose(); return true; }
  if(G.k === 'ritmo') petHitLane(lx < 120 ? 0 : lx < 240 ? 1 : 2);
  else petJump();
  return true;
}
function petHitLane(l){
  var G = petGame, now = petNowS(); if(!G || G.fim || now < G.t0 - .3) return;
  G.flash[l] = 10;
  var best = null, bd = 9;
  G.notes.forEach(function(n){ if(n.st || n.lane !== l) return; var d = Math.abs(n.t - now); if(d < bd){ bd = d; best = n; } });
  if(!best || bd > .16) return;   // toque fora de hora não pune (clima kawaii)
  best.st = bd <= .07 ? 1 : 2;
  if(best.st === 1){ G.perf++; G.score += 100 + G.combo * 2; } else { G.bom++; G.score += 50; }
  G.combo++; if(G.combo > G.maxc) G.maxc = G.combo;
  beep(best.f, .3, 'triangle', .035); beep(best.f * 1.004, .22, 'square', .012);   // você "toca" a melodia
  if(best.st === 1) beep(best.f * 2, .08, 'sine', .02, .02);
  G.fx.push({ l:l, s:tr(best.st === 1 ? 'Perfeito!' : 'Bom!'), c:best.st === 1 ? '#f5b400' : '#ffffff', t:0 });
  if(G.combo % 8 === 0) petHop = 16;
}
function petJump(){
  var G = petGame, now = petNowS(); if(!G || G.fim || G.k !== 'corda' || now < G.t0) return;
  if(petJumpH(now, G.jt) > 0) return;   // já está no ar
  G.jt = now;
  beep(392, .06, 'triangle', .035); beep(587, .07, 'triangle', .025, .04);
}
function petGameUpdate(){
  var G = petGame, now = petNowS(), dt = Math.min(.05, now - G.last); G.last = now;
  if(G.fim){ G.fim.t+=petDrawDelta; if(G.fim.t > 420) petGameClose(); return; }
  if(G.k === 'ritmo'){
    while(G.step < 128 && G.t0 + G.step * PET_BEAT < now + .12){   // acompanhamento lofi agendado no tempo certo
      var i = G.step, w = Math.max(0, G.t0 + i * PET_BEAT - now), st = i % 8, ch = PET_CHORDS[(i >> 3) % 4];
      if(st === 0) ch.forEach(function(f, j){ beep(f, 1.7, 'triangle', .011, w + j * .014); });
      if(st === 0 || st === 5) beep(ch[0] / 2, .45, 'triangle', .045, w);
      if(st % 2) beep(4200, .015, 'triangle', .004, w);
      if(st % 4 === 0) beep(90, .09, 'sine', .05, w);
      G.step++;
    }
    G.notes.forEach(function(n){
      if(!n.st && now > n.t + .16){ n.st = 3; G.err++; G.combo = 0; G.fx.push({ l:n.lane, s:tr('Errou'), c:'#cbd5e1', t:0 }); }
    });
    for(var l = 0; l < 3; l++) if(G.flash[l] > 0) G.flash[l]--;
    if(now > G.end) petGameEnd();
  } else if(now >= G.t0){
    var prev = G.ph;
    G.ph += 2 * Math.PI * dt / G.per;
    if(Math.floor(prev / (2 * Math.PI)) !== Math.floor(G.ph / (2 * Math.PI))){   // a corda passou pelo chão
      if(petJumpH(now, G.jt) > 7){
        G.pulos++; G.per = Math.max(.55, G.per * .965);
        beep(523 * Math.pow(2, Math.min(G.pulos, 24) / 12), .08, 'square', .022);
        if(G.pulos % 10 === 0) G.fx.push({ l:1, s:G.pulos + '!', c:'#f5b400', t:0 });
      } else { beep(220, .25, 'sawtooth', .03); beep(165, .3, 'sawtooth', .025, .12); petGameEnd(); }
    }
  }
}
function petGameEnd(){
  var G = petGame; if(!G || G.fim) return;
  var p = petAtivo(), mi = petMini(), k = G.k;
  var pts = k === 'ritmo' ? G.score : G.pulos;
  var est = k === 'ritmo' ? Math.min(40, Math.round(G.perf * .5 + G.bom * .25)) : Math.min(25, Math.floor(G.pulos / 2));
  var dar = Math.max(0, Math.min(est, PET_MINI_CAP - mi.ganho));
  if(dar > 0){ starT += dar; mi.ganho += dar; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); contaGanhoMini(dar); }
  var rec = pts > 0 && pts > (mi.rec[k] || 0);
  if(rec){ mi.rec[k] = pts; petData.inv = petData.inv || {}; petData.inv.sorvete = (petData.inv.sorvete || 0) + 1; }
  if(p){ petTick(); p.humor = petClamp(p.humor + 10); p.energia = petClamp(p.energia - 6); p.fome = petClamp(p.fome - 4); }
  G.fim = { t:0, pts:pts, est:est, dar:dar, rec:rec };
  if(rec){ if(sfx.rank) sfx.rank(); } else if(sfx.card) sfx.card();
  petSave(true);
  if(p) petXP(p, 5 + Math.min(10, Math.floor(k === 'ritmo' ? G.perf / 8 : G.pulos / 3)));
  petUI();
}
function petGameClose(){
  petGame = null; petSinging = false; petGameBtns(true);
  var p = petAtivo(); if(p){ petHop = 20; petSmile = 60; }
  petUI();
}
function petGameAbort(){ if(petGame){ petGame = null; petSinging = false; } petGameBtns(true); }
function petGameBtns(on){ ['petCam', 'petColBtn'].forEach(function(id){ var b = $(id); if(b) b.style.visibility = on ? '' : 'hidden'; }); }
// Desenho do minijogo (substitui a cena do camarim enquanto joga)
function petGameDraw(x, p){
  petGameUpdate();
  var G = petGame; if(!G) return;
  var now = petNowS(), beat = now > G.t0 ? (now - G.t0) / PET_BEAT : 0;
  x.textAlign = 'center';
  if(G.k === 'ritmo'){
    var bounce = now > G.t0 && !G.fim ? Math.abs(Math.sin(beat * Math.PI)) * 5 : 0;
    petG(function(){ g = x; g.save(); g.translate(78, PET_FLOOR - 44 * 2.4 - bounce); g.scale(2.4, 2.4); drawChar(CH[sel], 0, 0, 0, 2); g.restore(); });
    drawPet(x, petType(petData.ativo), PET_X, PET_FLOOR - 12 * PET_SC - (bounce > 3 ? 6 : 0), PET_SC, petT, 'feliz');
    x.fillStyle = 'rgba(30,12,70,.38)'; x.fillRect(0, 0, 360, 220);
    for(var l = 0; l < 3; l++){
      x.globalAlpha = .13 + G.flash[l] * .025; x.fillStyle = PET_LANES[l]; x.fillRect(l * 120 + 10, 0, 100, 220);
      x.globalAlpha = 1; x.strokeStyle = 'rgba(255,255,255,.85)'; x.lineWidth = 2;
      x.fillStyle = PET_LANES[l]; x.globalAlpha = .35; x.beginPath(); x.arc(60 + l * 120, 190, 14, 0, 7); x.fill();
      x.globalAlpha = 1; x.stroke();
    }
    G.notes.forEach(function(n){
      if(n.st === 1 || n.st === 2) return;
      var y = 190 - (n.t - now) * 125; if(y < -16 || y > 236) return;
      var cx = 60 + n.lane * 120;
      x.globalAlpha = n.st === 3 ? .35 : 1;
      x.fillStyle = PET_LANES[n.lane]; x.beginPath(); x.arc(cx, y, 11, 0, 7); x.fill();
      x.strokeStyle = '#fff'; x.lineWidth = 2; x.stroke();
      x.fillStyle = '#fff'; x.font = '900 13px "M PLUS Rounded 1c",sans-serif'; x.fillText('♪', cx, y + 4.5);
    });
    x.globalAlpha = 1;
    x.fillStyle = '#fff'; x.font = '900 13px "M PLUS Rounded 1c",sans-serif';
    x.fillText((G.combo > 1 ? 'Combo ×' + G.combo + '  ·  ' : '') + G.score + ' ' + tr('pontos'), 180, 18);
  } else {
    var ey = PET_FLOOR - 52, mid = ey + (PET_FLOOR + 2 - ey) * Math.cos(G.ph), cy = 2 * mid - ey, front = Math.cos(G.ph) > 0;
    var hc = petJumpH(now, G.jt), hp = petJumpH(now, G.jt + .05);
    function rope(){
      x.lineCap = 'round'; x.strokeStyle = '#ff6fb5'; x.lineWidth = 2.8;
      x.beginPath(); x.moveTo(36, ey); x.quadraticCurveTo(180, cy, 324, ey); x.stroke();
      x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = .8; x.stroke();
      x.fillStyle = '#7b3ff0'; x.fillRect(30, ey - 3, 10, 6); x.fillRect(320, ey - 3, 10, 6);
    }
    if(!front) rope();
    x.fillStyle = 'rgba(80,30,120,.18)';
    x.beginPath(); x.ellipse(125, PET_FLOOR + 2, 26 - hc * .3, 5, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(PET_X - 15, PET_FLOOR + 2, 22 - hp * .3, 4.5, 0, 0, 7); x.fill();
    petG(function(){ g = x; g.save(); g.translate(92, PET_FLOOR - 44 * 2.2 - hc); g.scale(2.2, 2.2); drawChar(CH[sel], 0, 0, 0, 2); g.restore(); });
    drawPet(x, petType(petData.ativo), PET_X - 15, PET_FLOOR - 12 * 2.2 - hp, 2.2, petT, hp > 0 ? 'feliz' : null);
    if(front) rope();
    x.fillStyle = '#7b3ff0'; x.font = '900 14px "M PLUS Rounded 1c",sans-serif';
    x.fillText(tr('Pulos') + ': ' + G.pulos + '   🏆 ' + (petMini().rec.corda || 0), 180, 20);
  }
  // Contagem e dica
  if(now < G.t0){
    var n3 = Math.ceil((G.t0 - now) / .5) - 1;
    x.fillStyle = 'rgba(255,255,255,.92)'; x.font = '900 40px "M PLUS Rounded 1c",sans-serif';
    x.fillText(n3 > 0 ? String(Math.min(3, n3)) : '♪', 180, 112);
    x.font = '800 12px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = G.k === 'ritmo' ? '#fff' : '#7b3ff0';
    x.fillText(tr(G.k === 'ritmo' ? 'Toque nas faixas no ritmo!' : 'Toque quando a corda passar no chão!'), 180, 140);
  }
  // Textos que sobem (Perfeito!, Bom!, Errou)
  for(var k = G.fx.length - 1; k >= 0; k--){
    var f = G.fx[k]; f.t+=petDrawDelta;
    x.globalAlpha = Math.max(0, 1 - f.t / 40); x.fillStyle = f.c; x.font = '900 13px "M PLUS Rounded 1c",sans-serif';
    x.fillText(f.s, 60 + f.l * 120, 166 - f.t * .6);
    if(f.t > 40) G.fx.splice(k, 1);
  }
  x.globalAlpha = 1;
  // Resultado
  if(G.fim){
    var F = G.fim, a = Math.min(1, F.t / 12);
    x.globalAlpha = a; x.fillStyle = 'rgba(30,12,70,.45)'; x.fillRect(0, 0, 360, 220);
    x.fillStyle = 'rgba(255,255,255,.97)'; x.beginPath(); x.roundRect ? x.roundRect(70, 40, 220, 140, 16) : x.rect(70, 40, 220, 140); x.fill();
    x.strokeStyle = F.rec ? '#f5b400' : '#ff6fb5'; x.lineWidth = 2.5; x.stroke();
    x.fillStyle = F.rec ? '#f5b400' : '#ff6fb5'; x.font = '900 18px "M PLUS Rounded 1c",sans-serif';
    x.fillText(F.rec ? '🏆 ' + tr('Novo recorde!') : '✨ ' + tr('Fim!'), 180, 70);
    x.fillStyle = '#12365e'; x.font = '900 22px "M PLUS Rounded 1c",sans-serif';
    x.fillText(G.k === 'ritmo' ? F.pts + ' ' + tr('pontos') : tr('Pulos') + ': ' + F.pts, 180, 100);
    x.font = '800 13px "M PLUS Rounded 1c",sans-serif'; x.fillStyle = '#7b3ff0';
    x.fillText('★ +' + F.dar + (F.dar < F.est ? '  (' + tr('Limite de estrelas de hoje atingido') + ')' : ''), 180, 122);
    if(F.rec){ x.fillStyle = '#ff6fb5'; x.fillText('🍓 ' + tr('Sorvete de morango') + ' +1', 180, 142); }
    x.fillStyle = '#94a3b8'; x.font = '700 11px "M PLUS Rounded 1c",sans-serif'; x.fillText(tr('Toque para voltar'), 180, 168);
    x.globalAlpha = 1;
  }
}
var PET_TEMAS = [   // [chave, início MM-DD, fim MM-DD] — para um tema novo, é só acrescentar uma linha
  ['halloween', '10-24', '11-02']
];
var petTemaOn = '';
function petTemaAtual(){
  if(typeof temaAtual === 'function') return temaAtual();   // V2.1.3: calendário completo (módulo de temas)
  var md = dk().slice(5);
  for(var i = 0; i < PET_TEMAS.length; i++){
    var a = PET_TEMAS[i][1], b = PET_TEMAS[i][2];
    if(a <= b ? (md >= a && md <= b) : (md >= a || md <= b)) return PET_TEMAS[i][0];
  }
  return '';
}
function petDrawAbobora(x, cx, by, s, aceso){
  x.save(); x.translate(cx, by); x.scale(s, s);
  if(aceso){ var gl = x.createRadialGradient(0, -8, 2, 0, -8, 20); gl.addColorStop(0, 'rgba(255,200,80,.55)'); gl.addColorStop(1, 'rgba(255,160,40,0)'); x.fillStyle = gl; x.beginPath(); x.arc(0, -8, 20, 0, 7); x.fill(); }
  x.fillStyle = '#e8650c'; x.beginPath(); x.ellipse(-5, -8, 6, 8, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(5, -8, 6, 8, 0, 0, 7); x.fill();
  x.fillStyle = '#ff8a1f'; x.beginPath(); x.ellipse(0, -8, 7, 8.5, 0, 0, 7); x.fill();
  x.fillStyle = '#4d7c0f'; x.fillRect(-1.2, -19, 2.4, 4.5);
  x.fillStyle = '#65a30d'; x.beginPath(); x.ellipse(3, -16.5, 3, 1.3, -.4, 0, 7); x.fill();
  var fl = .75 + .25 * Math.sin(petT * .3 + cx);
  x.fillStyle = aceso ? 'rgba(255,230,109,' + fl + ')' : '#7c2d12';
  x.beginPath(); x.moveTo(-6, -10); x.lineTo(-2.5, -10); x.lineTo(-4.2, -13); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(6, -10); x.lineTo(2.5, -10); x.lineTo(4.2, -13); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-6, -6.5); x.lineTo(6, -6.5); x.lineTo(4, -3.5); x.lineTo(1.5, -5); x.lineTo(-1.5, -3.5); x.lineTo(-4, -5); x.closePath(); x.fill();
  x.restore();
}
function petDrawMorcego(x, bx, by, s, t){
  x.save(); x.translate(bx, by); x.scale(s, s);
  var w = Math.sin(t) * 2;
  x.fillStyle = '#2a1640';
  x.beginPath(); x.moveTo(0, -2); x.quadraticCurveTo(-6, -6 - w, -11, -1); x.quadraticCurveTo(-7, -1, -6, 2); x.quadraticCurveTo(-3, 0, 0, 3);
  x.quadraticCurveTo(3, 0, 6, 2); x.quadraticCurveTo(7, -1, 11, -1); x.quadraticCurveTo(6, -6 - w, 0, -2); x.fill();
  x.beginPath(); x.ellipse(0, 0, 3, 3.6, 0, 0, 7); x.fill();
  x.beginPath(); x.moveTo(-2.6, -2.4); x.lineTo(-1.6, -5.4); x.lineTo(-.6, -3); x.fill(); x.beginPath(); x.moveTo(2.6, -2.4); x.lineTo(1.6, -5.4); x.lineTo(.6, -3); x.fill();
  x.fillStyle = '#ffe66d'; x.fillRect(-1.6, -.6, 1, 1); x.fillRect(.6, -.6, 1, 1);
  x.restore();
}
function petDrawHalloween(x, foto){
  var t = foto ? 0 : petT;
  // Luz roxa e laranja
  x.fillStyle = 'rgba(70,20,110,.16)'; x.fillRect(0, 0, 360, 220);
  var vg = x.createLinearGradient(0, 150, 0, 220); vg.addColorStop(0, 'rgba(255,140,40,0)'); vg.addColorStop(1, 'rgba(255,140,40,.18)');
  x.fillStyle = vg; x.fillRect(0, 150, 360, 70);
  // Teias nos cantos de cima
  x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = .7;
  [[0, 0, 1], [360, 0, -1]].forEach(function(c){
    for(var r = 0; r < 5; r++){ var an = r / 4 * Math.PI / 2; x.beginPath(); x.moveTo(c[0], c[1]); x.lineTo(c[0] + c[2] * Math.cos(an) * 34, c[1] + Math.sin(an) * 34); x.stroke(); }
    for(var k = 1; k <= 3; k++){ x.beginPath(); for(var r2 = 0; r2 <= 4; r2++){ var an2 = r2 / 4 * Math.PI / 2, rr = k * 10; x[r2 ? 'lineTo' : 'moveTo'](c[0] + c[2] * Math.cos(an2) * rr, c[1] + Math.sin(an2) * rr); } x.stroke(); }
  });
  // Morceguinhos pendurados no varal
  for(var i = 0; i < 6; i++){
    var bx = 30 + i * 60, u = bx / 360, vy = (1 - u) * (1 - u) * 14 + 2 * u * (1 - u) * 34 + u * u * 14;
    petDrawMorcego(x, bx, vy + 7 + Math.sin(t * .05 + i) * 1.2, .9, t * .25 + i);
  }
  // Fantasminha no espelho
  var gy = 76 + Math.sin(t * .04) * 4;
  x.save(); x.globalAlpha = .82; x.fillStyle = '#fff';
  x.beginPath(); x.arc(58, gy, 9, Math.PI, 0); x.lineTo(67, gy + 11);
  for(var w2 = 0; w2 < 4; w2++) x.quadraticCurveTo(64.75 - w2 * 4.5, gy + 14 - (w2 % 2) * 4, 62.5 - w2 * 4.5, gy + 11);
  x.closePath(); x.fill();
  x.fillStyle = '#2a1640'; x.beginPath(); x.ellipse(55, gy - 1, 1.3, 1.8, 0, 0, 7); x.fill(); x.beginPath(); x.ellipse(61, gy - 1, 1.3, 1.8, 0, 0, 7); x.fill();
  x.fillStyle = '#ff9ccd'; x.beginPath(); x.ellipse(58, gy + 3, 1.6, 1, 0, 0, 7); x.fill();
  x.restore();
  // Tigela de doces na penteadeira e abóboras nos cantos
  x.fillStyle = '#9b30d9'; x.beginPath(); x.ellipse(36, 138, 11, 4, 0, 0, Math.PI); x.fill(); x.fillRect(25, 134, 22, 4);
  [['#ff6fb5', 30], ['#b6ff3b', 36], ['#ffe14d', 42], ['#4169e1', 33], ['#ff8a1f', 39]].forEach(function(d, i){ x.fillStyle = d[0]; x.beginPath(); x.arc(d[1], 132 - (i > 2 ? 3 : 0), 2.6, 0, 7); x.fill(); });
  petDrawAbobora(x, 16, PET_FLOOR + 14, .8, true);
  petDrawAbobora(x, 344, PET_FLOOR + 14, .8, true);
}
// Chapéu de bruxa no pet (só enquanto o tema está ligado)
function petDrawChapeu(x, py, tf){
  x.save(); x.translate(PET_X, py + Math.sin(tf * .08) * 3.5); x.scale(PET_SC, PET_SC);
  x.translate(1, -10.5); x.rotate(-.14);
  x.fillStyle = '#2a1640'; x.beginPath(); x.ellipse(0, 0, 10, 2.4, 0, 0, 7); x.fill();
  x.beginPath(); x.moveTo(-5.5, -.5); x.lineTo(5.5, -.5); x.quadraticCurveTo(2, -8, 6, -14); x.quadraticCurveTo(-1, -11, -5.5, -.5); x.fill();
  x.fillStyle = '#9b30d9'; x.fillRect(-5.2, -3, 10.2, 2.2);
  x.fillStyle = '#ffe14d'; x.fillRect(-1.2, -3.2, 2.4, 2.6); x.fillStyle = '#9b30d9'; x.fillRect(-.5, -2.5, 1, 1.2);
  x.restore();
}
function petRoomBack(x, p){
  if(petTemaOn === 'halloween') petDrawHalloween(x, false);
  else if(petTemaOn === 'natal') petDrawNatal(x, false);
  else if(petTemaOn && typeof temaCamarim === 'function') temaCamarim(x, false, petT);   // V2.1.3: temas novos
  var s = petStage(p);
  if(s >= 5){   // Kami-Oshi: brilho dourado atrás do pet
    var gl = x.createRadialGradient(PET_X, PET_FLOOR - 30, 6, PET_X, PET_FLOOR - 30, 52);
    gl.addColorStop(0, 'rgba(255,210,63,' + (.5 + .12 * Math.sin(petT * .05)) + ')'); gl.addColorStop(1, 'rgba(255,210,63,0)');
    x.fillStyle = gl; x.beginPath(); x.arc(PET_X, PET_FLOOR - 30, 52, 0, 7); x.fill();
  }
  var tema = petTemaAtual();
  if(tema){   // o item da temporada fica no chão; pulsa para chamar atenção quando o tema está desligado
    if(!petTemaOn){ x.save(); x.globalAlpha = .35 + .3 * Math.sin(petT * .08); x.fillStyle = tema === 'natal' ? '#d9fbe0' : '#ffd27a'; x.beginPath(); x.ellipse(PET_ABOBORA.x, PET_ABOBORA.y - 10, 18, 18, 0, 0, 7); x.fill(); x.restore(); }
    if(tema === 'halloween') petDrawAbobora(x, PET_ABOBORA.x, PET_ABOBORA.y, 1.05, true);
    else if(tema === 'natal') petDrawArvore(x, PET_ABOBORA.x, PET_ABOBORA.y, 1, false);
    else if(typeof temaItemChao === 'function') temaItemChao(x, PET_ABOBORA.x, PET_ABOBORA.y, tema, petT);   // V2.1.3
  }
}
function petRoomFront(x, p, hop){
  var sl = p.dorme || p.energia < 25;
  if(petTemaOn === 'halloween') petDrawChapeu(x, PET_FLOOR - 12 * PET_SC - hop, sl ? petT * .35 : petT);
  else if(petTemaOn === 'natal') petDrawGorro(x, PET_FLOOR - 12 * PET_SC - hop, sl ? petT * .35 : petT);
  if(petStage(p) >= 4){   // Center ou mais: estrelinhas girando em volta
    x.fillStyle = '#f5b400'; x.textAlign = 'center'; x.font = '900 11px sans-serif';
    for(var i = 0; i < 3; i++){ var an = petT * .03 + i * 2.09; x.globalAlpha = .6 + .4 * Math.sin(petT * .1 + i); x.fillText('✦', PET_X + Math.cos(an) * 38, PET_FLOOR - 26 + Math.sin(an) * 13); }
    x.globalAlpha = 1;
  }
  petDrawPromo(x);
}
function petRoomTap(lx, ly){
  var tema = petTemaAtual();
  if(!tema || Math.abs(lx - PET_ABOBORA.x) > 18 || ly < PET_ABOBORA.y - 42 || ly > PET_ABOBORA.y + 8) return false;
  petTemaOn = petTemaOn ? '' : tema;
  if(petTemaOn === 'natal'){ [1047, 1319, 1568, 2093, 1568, 2637].forEach(function(f, i){ beep(f, .35, 'sine', .03, i * .09); beep(f * 2, .12, 'sine', .006, i * .09); }); petSay('🎄 ' + tr('Tema de Natal!')); }
  else if(petTemaOn && petTemaOn !== 'halloween' && typeof TEMA_INFO !== 'undefined' && TEMA_INFO[petTemaOn]){ [784, 988, 1175, 1568].forEach(function(f, i){ beep(f, .2, 'triangle', .035, i * .09); }); petSay(TEMA_INFO[petTemaOn][0] + ' ' + tr('Tema de') + ' ' + tr(TEMA_INFO[petTemaOn][1]) + '!'); }   // V2.1.3
  else if(petTemaOn){ [440, 523, 415, 349, 330].forEach(function(f, i){ beep(f, .16, 'square', .025, i * .11); beep(f / 2, .2, 'triangle', .03, i * .11); }); petSay('🎃 ' + tr('Tema de Halloween!')); }
  else { beep(330, .1, 'triangle', .04); beep(262, .14, 'triangle', .035, .08); petSay(tr('Tema desligado')); }
  return true;
}
function petTemaFoto(x){   // tema na foto (se estiver ligado)
  var p = petAtivo();
  if(petTemaOn === 'halloween'){
    petDrawHalloween(x, true);
    petDrawAbobora(x, PET_ABOBORA.x, PET_ABOBORA.y, 1.05, true);
    if(p) petDrawChapeu(x, PET_FLOOR - 12 * PET_SC, 0);
  } else if(petTemaOn === 'natal'){
    petDrawNatal(x, true);
    petDrawArvore(x, PET_ABOBORA.x, PET_ABOBORA.y, 1, true);
    if(p) petDrawGorro(x, PET_FLOOR - 12 * PET_SC, 0);
  } else if(petTemaOn && typeof temaCamarim === 'function'){   // V2.1.3: temas novos
    temaCamarim(x, true, 0); temaItemChao(x, PET_ABOBORA.x, PET_ABOBORA.y, petTemaOn, 0);
  }
}
function petDrawArvore(x, cx, by, s, foto){
  var t = foto ? 0 : petT;
  x.save(); x.translate(cx, by); x.scale(s, s);
  x.fillStyle = '#8b5a2b'; x.fillRect(-2.5, -6, 5, 6);
  [['#15803d', -6, 15, 13], ['#16a34a', -16, 12, 11], ['#22c55e', -25, 9, 10]].forEach(function(c){
    x.fillStyle = c[0]; x.beginPath(); x.moveTo(-c[2], c[1]); x.lineTo(c[2], c[1]); x.lineTo(0, c[1] - c[3] - 4); x.closePath(); x.fill();
  });
  var cores = ['#ff4f6d', '#ffe14d', '#60a5fa', '#ff6fb5', '#b6ff3b'];
  [[-8, -9], [6, -11], [-3, -16], [7, -19], [-5, -24], [3, -29], [-10, -7], [10, -7]].forEach(function(b, i){
    x.globalAlpha = (Math.sin(t * .12 + i * 1.7) > -.3) ? 1 : .35;
    x.fillStyle = cores[i % cores.length]; x.beginPath(); x.arc(b[0], b[1], 1.6, 0, 7); x.fill();
  });
  x.globalAlpha = 1;
  x.fillStyle = '#ffd23f'; x.beginPath();
  for(var q = 0; q < 10; q++){ var rr = q % 2 ? 1.8 : 4.4, an = q * Math.PI / 5 - Math.PI / 2; x[q ? 'lineTo' : 'moveTo'](Math.cos(an) * rr, -38 + Math.sin(an) * rr); }
  x.closePath(); x.fill();
  x.restore();
}
function petDrawPresente(x, cx, by, c1, c2){
  x.fillStyle = c1; x.fillRect(cx - 8, by - 13, 16, 13);
  x.fillStyle = c2; x.fillRect(cx - 1.5, by - 13, 3, 13); x.fillRect(cx - 8, by - 8, 16, 3);
  x.beginPath(); x.ellipse(cx - 3.5, by - 15, 3.5, 2, -.4, 0, 7); x.fill(); x.beginPath(); x.ellipse(cx + 3.5, by - 15, 3.5, 2, .4, 0, 7); x.fill();
}
function petDrawNatal(x, foto){
  var t = foto ? 0 : petT;
  x.fillStyle = 'rgba(40,70,150,.1)'; x.fillRect(0, 0, 360, 220);
  // Pisca-pisca no varal
  var cores = ['#ff4f6d', '#ffe14d', '#22c55e', '#60a5fa', '#ff6fb5'];
  for(var i = 0; i < 17; i++){
    var bx = 10 + i * 21, u = bx / 360, vy = (1 - u) * (1 - u) * 14 + 2 * u * (1 - u) * 34 + u * u * 14;
    var on = Math.sin(t * .1 + i * 1.3) > -.2;
    x.globalAlpha = on ? 1 : .35; x.fillStyle = cores[i % 5];
    x.beginPath(); x.ellipse(bx, vy + 3.5, 1.8, 2.6, 0, 0, 7); x.fill();
    if(on && !foto){ x.globalAlpha = .25; x.beginPath(); x.arc(bx, vy + 3.5, 5, 0, 7); x.fill(); }
  }
  x.globalAlpha = 1;
  // Guirlanda no espelho
  x.strokeStyle = '#15803d'; x.lineWidth = 4; x.beginPath(); x.arc(84, 46, 9, 0, 7); x.stroke();
  x.fillStyle = '#ef4444'; x.beginPath(); x.ellipse(80.5, 54, 3, 1.8, -.5, 0, 7); x.fill(); x.beginPath(); x.ellipse(87.5, 54, 3, 1.8, .5, 0, 7); x.fill();
  [[78, 40], [90, 42], [84, 37]].forEach(function(b){ x.fillStyle = '#ffe14d'; x.beginPath(); x.arc(b[0], b[1], 1.2, 0, 7); x.fill(); });
  // Presentes nos cantos
  petDrawPresente(x, 18, PET_FLOOR + 14, '#ef4444', '#22c55e');
  petDrawPresente(x, 342, PET_FLOOR + 14, '#60a5fa', '#ff6fb5');
  // Neve caindo
  x.fillStyle = 'rgba(255,255,255,.9)';
  for(var n = 0; n < 42; n++){
    var sx = (n * 83.3 + Math.sin(t * .02 + n) * 8) % 360, sy = (n * 47.9 + t * (.35 + (n % 4) * .12)) % 225 - 5, r = 1 + (n % 3) * .6;
    x.beginPath(); x.arc(sx, sy, r, 0, 7); x.fill();
  }
}
// Gorro de Natal no pet (só enquanto o tema está ligado)
function petDrawGorro(x, py, tf){
  x.save(); x.translate(PET_X, py + Math.sin(tf * .08) * 3.5); x.scale(PET_SC, PET_SC);
  x.translate(1, -9.5); x.rotate(-.12);
  x.fillStyle = '#ef4444'; x.beginPath(); x.moveTo(-7.5, 0); x.quadraticCurveTo(-1, -12, 9, -9); x.lineTo(7.5, 0); x.closePath(); x.fill();
  x.fillStyle = '#fff'; x.beginPath(); x.roundRect ? x.roundRect(-8.5, -1.5, 17, 3.6, 1.8) : x.rect(-8.5, -1.5, 17, 3.6); x.fill();
  x.beginPath(); x.arc(9.5, -9, 2.3, 0, 7); x.fill();
  x.restore();
}
var petPhFrame = 'polaroid', petPhPose = '', petPhExpr = '', petPhMode = 'pet';   // petPhMode: 'pet' (camarim) ou 'run' (📸 da corrida)
var PET_PH_FRAMES = [['polaroid', '📷', 'Polaroid'], ['oshi', '💜', 'Oshi'], ['estagio', '🏅', 'Estágio']];
var PET_PH_POSES = [['', '🙂', 'Normal'], ['v', '✌️', 'V'], ['coracao', '🫰', 'Coração'], ['tchau', '👋', 'Tchau']];
var PET_PH_EXPRS = [['', '✨', 'Auto'], ['2', '😊', 'Sorriso'], ['0', '👀', 'Olhar'], ['3', '😉', 'Piscadinha'], ['1', '😣', 'Ai!'], ['4', '😮', 'Surpresa'], ['5', '🥺', 'Chorinho'], ['6', '😍', 'Apaixonado']];   // números = expr do drawChar   // números = expr do drawChar
function petPhExprVal(padrao){ return petPhExpr === '' ? padrao : +petPhExpr; }
function petPhCor(){ return (sel === 3 ? (CU && CU.hair) : (CH[sel] && CH[sel].img)) || '#ff6fb5'; }
// Braços das poses (chamado pelo drawChar quando charPose está ligado; só nas fotos)
function petPoseArms(c, x, y){
  if(perfPoseAtras(c, x, y)) return;   // V2.1.3: Microfone, Banzai, Nyan e Lightstick
  if(charPose !== 'coracao') g.fillRect(x + 1, y + 24, 4, 9);   // braço esquerdo normal (no coração os dois braços vão ao peito)
  g.save(); g.lineCap = 'round'; g.strokeStyle = c.skin; g.lineWidth = 4;
  if(charPose === 'coracao'){
    g.fillStyle = c.skin; g.fillRect(x + 1, y + 24, 4, 3); g.fillRect(x + 25, y + 24, 4, 3);
    g.beginPath(); g.moveTo(x + 27, y + 26); g.lineTo(x + 20, y + 28.5); g.stroke();
    g.beginPath(); g.moveTo(x + 3, y + 26); g.lineTo(x + 10.3, y + 28.5); g.stroke();
    g.fillStyle = '#ff4f9a'; g.beginPath(); g.arc(x + 13.7, y + 26.4, 1.9, 0, 7); g.arc(x + 16.6, y + 26.4, 1.9, 0, 7); g.fill();
    g.beginPath(); g.moveTo(x + 11.9, y + 27.2); g.lineTo(x + 15.15, y + 31); g.lineTo(x + 18.4, y + 27.2); g.fill();
  } else {
    g.beginPath(); g.moveTo(x + 27, y + 25.5); g.lineTo(x + 34, y + 15.5); g.stroke();
    g.fillStyle = c.skin; g.beginPath(); g.arc(x + 34.5, y + 14.5, 2.4, 0, 7); g.fill();
    if(charPose === 'v'){ g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 33.6, y + 13); g.lineTo(x + 32.4, y + 9); g.moveTo(x + 35.4, y + 13); g.lineTo(x + 37.4, y + 9.4); g.stroke(); }
    else { g.lineWidth = 1.3; [-1.6, 0, 1.6].forEach(function(o){ g.beginPath(); g.moveTo(x + 34.5 + o, y + 13); g.lineTo(x + 34.5 + o * 1.6, y + 9.5); g.stroke(); });
      g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = .8; g.beginPath(); g.arc(x + 34.5, y + 13, 6, -1.3, -.4); g.stroke(); g.beginPath(); g.arc(x + 34.5, y + 13, 8.5, -1.3, -.4); g.stroke(); }
  }
  g.restore();
  g.fillStyle = c.skin;
}
// Desenha o(s) personagem(ns) da foto num canvas à parte e cola com um contorno suave,
// para personagens claros (pele clara, roupa branca) não sumirem no fundo claro.
// desenha(): chamadas de drawChar em unidades do personagem (o g já aponta para o canvas certo).
function petCharFoto(x, tx, ty, sc, desenha){
  var m = x.getTransform ? x.getTransform() : null, S = m ? Math.max(1, Math.sqrt(m.a * m.a + m.b * m.b)) : 1;
  var ux = -42, uy = -18, uw = 130, uh = 70, k = sc * S;   // área que cobre parceira do Unit, asas e braço levantado
  var cv = document.createElement('canvas'); cv.width = Math.ceil(uw * k); cv.height = Math.ceil(uh * k);
  var og = g;
  try{ g = cv.getContext('2d'); g.scale(k, k); g.translate(-ux, -uy); desenha(); }
  finally{ g = og; charPose = ''; }
  x.save();
  x.shadowColor = 'rgba(64,24,120,.32)'; x.shadowBlur = 9 * S;    // halo macio
  x.drawImage(cv, tx + ux * sc, ty + uy * sc, uw * sc, uh * sc);
  x.shadowColor = 'rgba(64,24,120,.55)'; x.shadowBlur = 2.2 * S;  // contorno fininho
  x.drawImage(cv, tx + ux * sc, ty + uy * sc, uw * sc, uh * sc);
  x.restore();
}
// Papel e enfeites das molduras: fase 'papel' (antes da foto) e 'topo' (depois da fita)
// fy = onde termina a foto (camarim 240, corrida 380); selo = [emoji, nome] (corrida: rank da partida)
function petPhFrameDraw(x, W2, H2, fase, fy, selo){
  var f = petPhFrame; if(f === 'polaroid') return;
  fy = fy || 240;
  var oc = petPhCor();
  if(fase === 'papel'){
    if(f === 'oshi'){
      var pg = x.createLinearGradient(0, 0, 0, H2); pg.addColorStop(0, petMix(oc, 1, .84)); pg.addColorStop(1, petMix(oc, 1, .94));
      x.fillStyle = pg; x.fillRect(0, 0, W2, H2);
      x.save(); x.globalAlpha = .1; x.strokeStyle = oc; x.lineWidth = 6;
      for(var d = -H2; d < W2; d += 26){ x.beginPath(); x.moveTo(d, H2); x.lineTo(d + H2, 0); x.stroke(); }
      x.restore();
      x.strokeStyle = oc; x.lineWidth = 5; x.beginPath(); x.roundRect ? x.roundRect(6, 6, W2 - 12, H2 - 12, 14) : x.rect(6, 6, W2 - 12, H2 - 12); x.stroke();
      x.fillStyle = oc; x.font = '900 14px sans-serif'; x.textAlign = 'center';
      [[16, 20], [W2 - 16, 20], [16, H2 - 10], [W2 - 16, H2 - 10]].forEach(function(s){ x.fillText('★', s[0], s[1]); });
    } else if(f === 'estagio'){
      x.fillStyle = '#fffaf0'; x.fillRect(0, 0, W2, H2);
      x.strokeStyle = '#e2b44a'; x.lineWidth = 3; x.strokeRect(7, 7, W2 - 14, H2 - 14);
      x.lineWidth = 1; x.strokeRect(12.5, 12.5, W2 - 25, H2 - 25);
      x.fillStyle = '#e2b44a'; x.font = '12px sans-serif'; x.textAlign = 'center';
      [[12, 15], [W2 - 12, 15], [12, H2 - 9], [W2 - 12, H2 - 9]].forEach(function(s){ x.fillText('◆', s[0], s[1]); });
    }
  } else {
    var p = petAtivo();
    if(f === 'estagio' && (selo || p)){   // selo do estágio do pet (ou do rank da corrida) no canto da foto
      var st = selo || [PET_STAGES[petStage(p)][2], PET_STAGES[petStage(p)][1]];
      x.save(); x.translate(W2 - 62, fy - 14);
      x.fillStyle = '#ff6fb5'; x.beginPath(); x.moveTo(-12, 10); x.lineTo(-18, 30); x.lineTo(-8, 25); x.lineTo(-4, 34); x.lineTo(0, 12); x.fill();
      x.fillStyle = '#9b30d9'; x.beginPath(); x.moveTo(12, 10); x.lineTo(18, 30); x.lineTo(8, 25); x.lineTo(4, 34); x.lineTo(0, 12); x.fill();
      x.fillStyle = '#f4c95d'; x.beginPath(); x.arc(0, 0, 25, 0, 7); x.fill();
      x.fillStyle = '#fff7df'; x.beginPath(); x.arc(0, 0, 20, 0, 7); x.fill();
      x.fillStyle = '#000'; x.textAlign = 'center'; x.font = '18px sans-serif'; x.fillText(st[0], 0, 1);
      x.fillStyle = '#9a6b12'; var nmS = tr(st[1]), fs = 8; do { x.font = '800 ' + fs + 'px "M PLUS Rounded 1c",sans-serif'; fs -= .5; } while(x.measureText(nmS).width > 36 && fs > 5);
      x.fillText(nmS, 0, 13);
      x.restore();
    } else if(f === 'oshi'){   // etiqueta "推し" com o nome do personagem
      var nm = '推し · ' + CH[sel].n;
      x.font = '900 13px "M PLUS Rounded 1c",sans-serif'; var w = x.measureText(nm).width + 22;
      x.save(); x.translate(34, fy - 4); x.rotate(-.06);
      x.fillStyle = oc; x.beginPath(); x.roundRect ? x.roundRect(0, -12, w, 24, 12) : x.rect(0, -12, w, 24); x.fill();
      x.fillStyle = '#fff'; x.textAlign = 'left'; x.fillText(nm, 11, 5);
      x.restore();
    }
  }
}
function petPhUI(){
  function grp(label, campo, lista, cur){
    return '<div><span>' + escHtml(tr(label)) + '</span>' + lista.map(function(o){
      var nome = (campo === 'frame' && o[0] === 'estagio' && petPhMode === 'run') ? '🏆 ' + escHtml(tr('Rank')) : o[1] + ' ' + escHtml(tr(o[2]));
      return '<button type="button" data-f="' + campo + '" data-v="' + o[0] + '" aria-pressed="' + (cur === o[0]) + '">' + nome + '</button>';
    }).join('') + '</div>';
  }
  petPhBox.innerHTML = (petPhMode === 'share' ? '' : grp('Moldura', 'frame', PET_PH_FRAMES, petPhFrame)) + grp('Pose', 'pose', PET_PH_POSES, petPhPose) + grp('Expressão', 'expr', PET_PH_EXPRS, petPhExpr);
}
function petPhShow(on, modo){ if(on) petPhMode = modo || 'pet'; petPhBox.hidden = !on; if(on) petPhUI(); }
// [principal, lado 1, lado 2]: o seu pet ativo em destaque e os outros da sua coleção (completa com os oficiais)
function petCartaoPets(padrao, oficiais){
  if(!petData || !petData.pets[petData.ativo]) return [padrao].concat(oficiais.filter(function(k){ return k !== padrao; }));
  var lista = [petData.ativo].concat((petData.donos || []).filter(function(k){ return k !== petData.ativo && petData.pets[k]; }));
  oficiais.forEach(function(k){ if(lista.indexOf(k) < 0) lista.push(k); });
  return lista.slice(0, 3).map(petType);
}
function petBrilhoEstagio(x, cx, cy, r){   // brilho de estágio atrás do pet ativo (Center ou mais)
  var p = petAtivo(); if(!p || petStage(p) < 4) return;
  var gl = x.createRadialGradient(cx, cy, 2, cx, cy, r);
  gl.addColorStop(0, petStage(p) >= 5 ? 'rgba(255,210,63,.6)' : 'rgba(255,225,120,.42)'); gl.addColorStop(1, 'rgba(255,210,63,0)');
  x.fillStyle = gl; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
// Pet ativo comemorando no palco (Fim do show e SALVAR IMAGEM); t = contador da animação
function petPalco(x, cx, chao, sc, t){
  if(!petData || !petData.pets[petData.ativo]) return;
  var hop = Math.abs(Math.sin(t * .09)) * 3 * sc / 2.6;
  x.fillStyle = 'rgba(40,10,70,.22)'; x.beginPath(); x.ellipse(cx, chao, 11 * sc, 2.4 * sc, 0, 0, 7); x.fill();
  petBrilhoEstagio(x, cx, chao - 12 * sc, 22 * sc);
  drawPet(x, petType(petData.ativo), cx, chao - 12 * sc - hop, sc, t, 'feliz');
}
// Aviso e vozinha quando o pet entrega o presente na corrida
function petPresenteMsg(){
  var p = petAtivo();
  return p ? '🎁 ' + tr('{p} trouxe um presente!').split('{p}').join(p.nome) : tr('Presente do Pet!') + ' 🎁';
}
function petPresenteVoz(){
  if(petData && petData.pets[petData.ativo]){ petVoice(null); return; }
  beep(1200, .08, 'sine', .05); beep(1600, .12, 'triangle', .05, .08);   // "Mew!" de antes (sem pet adotado)
}
function petCorridaTipo(padrao){   // padrao = o pet que o jogo sortearia (usado quando ainda não há pet adotado)
  if(petData && petData.ativo && petData.pets[petData.ativo]) return petType(petData.ativo);
  return padrao;
}
function petCorridaChance(){   // chance do presente especial (card ou sorvete)
  var p = petAtivo(); if(!p) return .15;
  var c = petMood(p)[1] === 'Feliz!' ? .25 : .15;   // pet feliz: 25%
  if(petStage(p) >= 4) c += .05;                     // estágio Center ou mais: +5%
  return c;
}
