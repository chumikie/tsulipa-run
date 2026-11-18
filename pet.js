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
// ML1.3-A: estado exclusivamente visual; nunca entra em petData ou no save.
var petLifePose = '', petLifePoseInicio = 0;
var petLifePoseOrigem = null, petLifePetPerto = 0; // ML1.8-A: somente estado visual da aba
var petLifePhoneOlhar = false;
//→petLifeCompanhiaVisual
//→petLifePoseEscolher
//→petLifePoseUI
//→petLifeSofaApoio
//→petLifeSofa
//→petLifeSofaBracos
var PET_LIFE_ASSENTO = 180;   // nenhuma pose desenha as pernas retas abaixo do assento
// Lugar e postura de cada pose no sofá (origem do avatar 2.4×, inclinação em rad).
var PET_LIFE_POSES = {
  sentar:    {x:64, y:84, rot:0},      // sentado ereto no meio do sofá
  descansar: {x:50, y:91, rot:-.17},   // recostado na almofada do braço, com mantinha
  conviver:  {x:92, y:84, rot:.13}     // 2 px para dentro: joelho não atravessa o braço direito
};
var PET_LIFE_EM_PE = {x:78, y:PET_FLOOR - 44*2.4, rot:0, sit:0};
//→petLifeMovimentoReduzido
//→petLifePoseDesenho
//→petLifePetAproximar
//→petLifeRoupaSaia
var petLifeCorColo = '#dfe6f5';   // cor da roupa no quadril, lida do próprio avatar desenhado
var petLifeCorSaia = '#dfe6f5';
//→petLifeQuadril
//→petLifeCanelaRoupa
//→petLifeLerCorColo
var petData = null, petOpen = false, petT = 0, petFx = [], petEsc = 'tsu';
var petHop = 0, petSmile = 0, petLastPat = 0, petBg = null, petBgOshi = null, petDpr = 1, petBgFase = '';
//→petLuzFase
var PET_LUZ_CEU = { manha:['#bfe8ff','#fff1c9'], dia:['#8fd0f5','#d6f0ff'], tarde:['#ff9a6b','#ffd1a3'], noite:['#1c1f5a','#3b3486'] };
//→petDesenharJanela
// Arrumar o quarto (modo construir do Sims / quartos do LPS): arrastar móveis e quadros.
// Móveis só deslizam no chão (a base fica sempre em y 177, com sombra); quadros ficam na parede.
// A arrumação mora só neste aparelho (chave própria, fora do save sincronizado do Pet).
var PET_ARRUMO_KEY = 'tw_camarim_arrumacao';
var PET_MOVEIS = {   // centro padrão, largura e limites no chão (entre o sofá e a arara)
  mesa:    {cx:166, w:30, min:166, max:272},
  estante: {cx:200, w:38, min:170, max:268},
  abajur:  {cx:279, w:24, min:170, max:282}
};
var petArrumo = null, petArrumando = false, petArrastando = null;
//→petArrumoPersistivel
//→petArrumoDono
//→petArrumoAnterior
//→petArrumoChave
//→petArrumoLer
//→petArrumoSalvar
//→petArrumoX
//→petArrumoDx
//→petArrumoQuadro
//→petArrumoLivre
//→petArrumoPegar
//→petArrumoMover
//→petArrumoAbaixo
//→petArrumoSoltar
//→petArrumoModo
//→petArrumoPadrao
//→petArrumoDesenhar
// Abajur de chão ao lado da arara: base no piso (y 177) e sombra, como os outros móveis.
var PET_ABAJUR_X = 279;
//→petDesenharAbajur
//→petLuzAmbiente
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
  if(typeof petActUI === 'function') petActUI();
  if(typeof petDevUI === 'function') petDevUI();
  if(typeof petRankUI === 'function') petRankUI(p);   // estágio do pet (V2.1)
  if(typeof petSyncEstadoUI==='function')petSyncEstadoUI();
}
//→petFitCanvas
//→petMakeBg
//→petPremiosDesejo
//→petLifeHit
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
  pt:['Agenda⭐','Chat⭐','Fotos⭐','Cartas⭐'], en:['Agenda⭐','Chat⭐','Photos⭐','Letters⭐'],
  es:['Agenda⭐','Chat⭐','Fotos⭐','Cartas⭐'], id:['Agenda⭐','Chat⭐','Foto⭐','Surat⭐'],
  th:['ตาราง⭐','แชต⭐','รูปภาพ⭐','จดหมาย⭐'], ja:['予定⭐','チャット⭐','写真⭐','お手紙⭐']
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
  pt:['Guardar em Momentos⭐','Guardado no TsuPhone! 💗','Não foi possível guardar esta foto.','Nenhuma foto nesta sessão.','Guarde voluntariamente uma selfie ou foto da corrida, do Karaoke⭐Time! ou do Moon⭐Duo! para vê-la aqui.','Baixar PNG','Fotos temporárias: somem ao sair da página.','Ampliar foto','Voltar aos Momentos'],
  en:['Keep in Moments⭐','Saved to TsuPhone! 💗','Could not keep this photo.','No photos in this session.','Choose to keep a selfie or a photo from Center⭐Run!, Karaoke⭐Time! or Moon⭐Duo! to see it here.','Download PNG','Temporary photos: cleared when leaving the page.','Enlarge photo','Back to Moments'],
  es:['Guardar en Momentos⭐','¡Guardado en TsuPhone! 💗','No se pudo guardar esta foto.','Aún no hay fotos en esta sesión.','Guarda una selfie o foto de Center⭐Run!, Karaoke⭐Time! o Moon⭐Duo! para verla aquí.','Descargar PNG','Fotos temporales: desaparecen al salir de la página.','Ampliar foto','Volver a Momentos'],
  id:['Simpan di Momen⭐','Tersimpan di TsuPhone! 💗','Foto ini tidak bisa disimpan.','Belum ada foto dalam sesi ini.','Simpan selfie atau foto Center⭐Run!, Karaoke⭐Time!, atau Moon⭐Duo! untuk melihatnya di sini.','Unduh PNG','Foto sementara: hilang saat meninggalkan halaman.','Perbesar foto','Kembali ke Momen'],
  th:['เก็บในความทรงจำ⭐','เก็บใน TsuPhone แล้ว! 💗','เก็บรูปนี้ไม่สำเร็จ','ยังไม่มีรูปในรอบนี้','เลือกเก็บเซลฟี่หรือรูปจาก Center⭐Run!, Karaoke⭐Time! หรือ Moon⭐Duo! เพื่อดูที่นี่','ดาวน์โหลด PNG','รูปชั่วคราวจะหายไปเมื่อออกจากหน้าเว็บ','ขยายรูป','กลับไปความทรงจำ'],
  ja:['思い出に保存⭐','TsuPhoneに保存しました! 💗','この写真は保存できませんでした。','このセッションの写真はまだありません。','セルフィーや Center⭐Run!、Karaoke⭐Time!、Moon⭐Duo! の写真を選んで保存するとここに表示されます。','PNGを保存','写真は一時保存です。ページを離れると消えます。','写真を拡大','思い出に戻る']
};
var PET_PHONE_JORNAL_TEXTO = {
  pt:['Cenas públicas do Idol⭐News! · novas fotos a cada dia.','As fotos aparecem quando a vitrine de Idols carregar.','Atualizar fotos','Ampliar foto','Voltar ao Jornal','Baixar PNG','No iPhone, segure a imagem para salvar se necessário.'],
  en:['Public Idol⭐News! scenes · new photos every day.','Photos appear once the Idol showcase loads.','Refresh photos','Enlarge photo','Back to News','Download PNG','On iPhone, press and hold the image to save if needed.'],
  es:['Escenas públicas de Idol⭐News! · nuevas fotos cada día.','Las fotos aparecen cuando carga la vitrina de Idols.','Actualizar fotos','Ampliar foto','Volver a Noticias','Descargar PNG','En iPhone, mantén pulsada la imagen para guardarla si hace falta.'],
  id:['Foto publik Idol⭐News! · foto baru setiap hari.','Foto muncul setelah etalase Idol dimuat.','Segarkan foto','Perbesar foto','Kembali ke Berita','Unduh PNG','Di iPhone, tekan dan tahan gambar untuk menyimpan jika perlu.'],
  th:['ภาพสาธารณะจาก Idol⭐News! · ภาพใหม่ทุกวัน','ภาพจะปรากฏเมื่อโหลดรายชื่อไอดอลแล้ว','อัปเดตภาพ','ขยายภาพ','กลับไปข่าว','ดาวน์โหลด PNG','บน iPhone กดค้างที่ภาพเพื่อบันทึกหากจำเป็น'],
  ja:['Idol⭐News! の公開写真 · 毎日新しい写真','アイドル一覧の読み込み後に写真が表示されます。','写真を更新','写真を拡大','ニュースに戻る','PNGを保存','iPhoneでは必要に応じて画像を長押しして保存できます。']
};
// Fotos⭐: uma única Polaroid temporária; nunca entra no save ou no Supabase.
var petPhoneFotoUrl = '', petPhoneFotoDono = '', petPhoneFotoErro = '';
// ML1.2-C.2-B: até quatro fotos da sessão, nunca persistidas ou transmitidas.
var petPhoneMomentos = [], petPhoneMomentosDono = '', petPhoneMomentoFonte = '', petPhoneMomentoFonteDono = '', petPhoneMomentoSelecionado = '';
// Fotos públicas do Jornal: só objetos da cena e uma PNG temporária sob toque.
var petPhoneJornalFotos = [], petPhoneJornalIndice = -1, petPhoneJornalUrl = '';
// ML1.2-B: diálogos fictícios, só nesta sessão. Nunca enviam ou salvam mensagens.
var petPhoneChatConversa = '', petPhoneChatSessao = '', petPhoneChatRespostas = {};
function petPhoneContaChave(){
  if(!contaJ) return '';
  var id = (typeof contaAuthUserId === 'string' && contaAuthUserId) || contaJ.id || contaJ.nick || '';
  return String(id) + ':' + (typeof contaSessaoToken !== 'undefined' ? contaSessaoToken : '');
}
//→petPhonePapel
// Papel de parede próprio do celular (não é a foto do quarto): Idol e Pet num
// palquinho na cor do Oshi, sempre na proporção do visor (260×140) e na resolução da tela.
var PET_CAPA_W = 260, PET_CAPA_H = 140;
//→petPhoneCapaDesenhar
//→petPhoneIcon
//→petPhoneIcones
// O celular leva o nome do jogador: "{nick}Phone". Sem conta, continua TsuPhone.
function petPhoneNome(){
  var n = String((typeof contaJ !== 'undefined' && contaJ && contaJ.nick) || '').trim();
  return (n ? Array.from(n).slice(0, 12).join('') : 'Tsu') + 'Phone';
}
//→petPhoneMarca
// Cartas de fã (o correio do Neopets): uma por dia, montada no aparelho com o que já
// existe (recordes, pet). Fãs com nomes inventados; nada vai ao servidor nem ao save.
var petPhoneCartaAberta = '';
var petCartasLidasSessao = [];   // como o resto do celular: só na memória da aba, sem save
var PET_CARTA_FAS = ['Usamado','Homina','Sayami','Kyorin','Hanoka','Mayoka','Minarei','Makohan','Amimi','Chibiko','Usahana','Rinako','Lucimi','Kyomami','Sakuhime','Pichiru','Kururun','Purinne','Momorin','Kiraho'];
var PET_CARTA_SELOS = ['🌸','🍓','🐰','⭐','🎀','🌙','🍰','💐'];
var PET_CARTA_TEXTOS = {
  rec:'Vi seu recorde de {b} no Center⭐Run! Treinei a semana inteira para chegar perto. 😳',
  look:'O seu look de hoje ficou lindo! Posso me inspirar nele para o próximo show? 🎀',
  pet:'Manda um oi para {p}! É o pet mais fofo de todo o backstage. 🐾',
  hand:'Fui no Handshake⭐Event! e você lembrou do meu presente favorito. Ganhei o dia! 🤝',
  cafe:'Pedi no Happy⭐Cafe! a bebida que você recomendou. Já virou a minha favorita! 🧋',
  vontade:'Soube que você realizou as vontades de {p}. Que cuidado lindo! 💕',
  apoio:'Torço por você em todos os shows. Continua brilhando, {n}! ✨'
};
//→petCartaHash
//→petCartaDia   // dia de Brasília
//→petCartasLidas
//→petCartaRecorde
//→petCartasLista
// Carta com foto: quando um Momento é guardado na sessão, um fã responde com a polaroid.
var PET_CARTA_PALCO = {
  pt:'Guardei sua foto do karaokê. Dá até vontade de cantar junto quando vejo esse palco!',
  en:'I kept your karaoke photo. Seeing that stage makes me want to sing along!',
  es:'Guardé tu foto del karaoke. ¡Al ver ese escenario me dan ganas de cantar contigo!',
  id:'Kusimpan foto karaokemu. Melihat panggung itu bikin aku ingin ikut nyanyi!',
  th:'ฉันเก็บรูปคาราโอเกะของเธอไว้แล้ว พอเห็นเวทีนั้นก็อยากร้องตามเลย!',
  ja:'カラオケの写真、大事にしてるよ。あのステージを見ると私も一緒に歌いたくなる！'
};
var PET_CARTA_FOTO_TEXTOS = {
  pet:'Que foto fofa de você com {p}! Já virou o fundo do meu celular. 📸',
  center:'Vi sua foto do Center⭐Run! e guardei no meu mural de fã. 🏁',
  karaoke:'Sua foto do Karaoke⭐Time! ficou com cara de capa de revista! 🎤',
  duo:'A foto do Moon⭐Duo! ficou linda. Vocês combinam muito! 🌙',
  look:'Amei o seu Look do dia! Você arrasou no tema. 👗'
};
//→petCartaFotoMomento
//→petCartaComFoto
//→petCartaFotoRender
//→petCartasNovas
//→petCartaAbrir
//→petCartaDataTxt
//→petCartasHtml
//→petPhoneAgendaHtml
//→petPhoneFotoLimpar
function petPhoneFotoChave(){
  return petPhoneContaChave() + ':' + (typeof petData !== 'undefined' && petData ? petData.ativo || '' : '');
}
function petPhoneMomentoTexto(i){ return String((PET_PHONE_MOMENTO_TEXTO[LANG] || PET_PHONE_MOMENTO_TEXTO.pt)[i]).split('TsuPhone').join(petPhoneNome()); }
function petPhoneMomentoSoltar(f){
  // PNGs recebidos do iframe vivem somente nesta página. As outras fotos usam data URLs.
  if(f && f.blobUrl){ URL.revokeObjectURL(f.url); if(f.miniUrl && f.miniUrl !== f.url) URL.revokeObjectURL(f.miniUrl); }
}
function petPhoneMomentosLimitar(){
  while(petPhoneMomentos.length > 4 || petPhoneMomentos.reduce(function(n,f){ return n + (f.bytes || f.url.length); },0) > 16*1024*1024){
    petPhoneMomentoSoltar(petPhoneMomentos.shift());
  }
  if(petPhoneMomentoSelecionado && !petPhoneMomentos.some(function(f){return f.id === petPhoneMomentoSelecionado;})) petPhoneMomentoSelecionado = '';
}
function petPhoneMomentosLimpar(){
  var corpo = $('petPhoneCorpo');
  if(corpo && corpo.querySelectorAll){
    corpo.querySelectorAll('[data-momento-id]').forEach(function(img){img.removeAttribute('src');});
    corpo.querySelectorAll('[data-momento-baixar]').forEach(function(a){a.removeAttribute('href');});
  }
  var ampliada=$('petPhoneMomentoImagem'),download=$('petPhoneMomentoBaixar');
  if(ampliada)ampliada.removeAttribute('src');
  var quadro=$('petPhoneQuadroImagem');
  if(quadro)quadro.removeAttribute('src');
  if(download)download.removeAttribute('href');
  petPhoneMomentos.forEach(petPhoneMomentoSoltar);
  petVidaFotoCache = null; petVidaFotoUrl = ''; petVidaQuadroEstado = null; petVidaQuadroChave = null;
  petPhoneMomentos = []; petPhoneMomentosDono = ''; petPhoneMomentoFonte = ''; petPhoneMomentoFonteDono = ''; petPhoneMomentoSelecionado = '';
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
function petPhoneMomentoGuardar(tipo, url, especie){
  return !!petPhoneMomentoAdicionar(tipo, url, especie);
}
function petPhoneMomentoAdicionar(tipo, url, especie){
  if(['pet','center','duo','look','studio'].indexOf(tipo) < 0 || !contaJ || !petAtivo()) return false;
  if(typeof url !== 'string' || url.length > 10*1024*1024 || !/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(url)) return false;
  petPhoneMomentosConferir();
  var dono = petPhoneFotoChave(); if(!dono || !petPhoneContaChave()) return false;
  var label = {pet:'Backstage⭐Pet!',center:'Center⭐Run!',duo:'Moon⭐Duo!',look:tr('Look do dia⭐'),studio:'Photo⭐Studio!'}[tipo];
  var entrada = {tipo:tipo,rotulo:label,url:url,dono:dono,id:String(Date.now()) + '-' + String(Math.random()).slice(2,8)};
  if(tipo === 'pet') entrada.nomePet = petAtivo().nome;
  if(tipo === 'studio' && ['sakura','tulipa','girassol','lunar'].indexOf(especie) >= 0) entrada.especie = especie;
  petPhoneMomentosDono = dono;
  petPhoneMomentos.push(entrada);
  petPhoneMomentosLimitar();
  if(typeof TWVidaCidade!=='undefined')TWVidaCidade.registrar('foto',{id:entrada.id});
  if(petPhoneOpen && petPhoneTela === 'fotos' && petPhoneFotosAba === 'momentos') petPhoneRender();
  return entrada.id;
}
function petPhoneMomentoGuardarBlob(tipo, blob, mini){
  if(tipo !== 'karaoke' || !contaJ || !petAtivo() || !(blob instanceof Blob) || blob.type !== 'image/png' || !blob.size || blob.size > 10*1024*1024) return false;
  if(mini && (!(mini instanceof Blob) || mini.type !== 'image/png' || !mini.size || mini.size > 1024*1024)) return false;
  if(blob.size + (mini ? mini.size : 0) > 16*1024*1024) return false;
  petPhoneMomentosConferir();
  var dono = petPhoneFotoChave(), url = '', miniUrl = '';
  if(!dono || !petPhoneContaChave()) return false;
  try{
    url = URL.createObjectURL(blob);
    miniUrl = mini ? URL.createObjectURL(mini) : url;
  }catch(e){
    if(url) URL.revokeObjectURL(url);
    return false;
  }
  petPhoneMomentosDono = dono;
  petPhoneMomentos.push({tipo:tipo,rotulo:'Karaoke⭐Time!',url:url,miniUrl:miniUrl,blobUrl:true,
    bytes:blob.size+(mini ? mini.size : 0),dono:dono,id:String(Date.now())+'-'+String(Math.random()).slice(2,8)});
  petPhoneMomentosLimitar();
  if(typeof TWVidaCidade!=='undefined')TWVidaCidade.registrar('foto',{id:petPhoneMomentos[petPhoneMomentos.length-1].id});
  if(petPhoneOpen && petPhoneTela === 'fotos' && petPhoneFotosAba === 'momentos') petPhoneRender();
  return true;
}
//→PET_FOTO_QUADRO
//→PET_QUADRO_ESTADO_TR
//→petPhoneMomentosHtml
//→petPhoneMomentosRender
//→petPhoneMomentoAbrir
//→petPhoneMomentoVoltar
//→petPhoneMomentoQuadro
//→petPhoneFotoHtml
//→petPhoneJornalLimpar
//→petPhoneJornalHtml
//→petPhoneJornalRender
//→petPhoneJornalAbrir
//→petPhoneJornalVoltar
function petPhoneJornalVitrinePronta(){
  if(petPhoneOpen && petPhoneTela === 'fotos' && petPhoneFotosAba === 'jornal' && petPhoneJornalIndice < 0) petPhoneRender();
}
//→petPhoneJornalAtualizar
//→petPhoneFotosHtml
//→petPhoneFotosAbaAbrir
//→petPhoneFotoRender
//→petPhoneFotoTirar
//→petPhoneFotoRepetir
//→petPhoneFotoGuardar
//→petPhoneChatContatos
//→petPhoneChatAvatarHtml
//→petPhoneChatRetratos
//→petPhoneChatVariante
//→petPhoneChatMensagens
//→petPhoneChatReacao
//→petPhoneChatSincronizar
//→petPhoneChatHtml
//→petPhoneChatAbrir
//→petPhoneChatResponder
//→petPhoneRender
// Sons do celular (Web Audio, mesmo beep do jogo; respeita o mudo). Curtos e fofos, estilo celular Y2K.
var PET_PHONE_SONS = {
  abrir:[[1047,.07,'triangle',.035,0],[1319,.07,'triangle',.035,.07],[1568,.07,'triangle',.035,.14],[2093,.16,'sine',.03,.21],[2637,.1,'sine',.012,.3]],
  fechar:[[1568,.06,'triangle',.03,0],[1175,.06,'triangle',.03,.06],[880,.12,'sine',.03,.12]],
  app:[[1319,.05,'sine',.032,0],[1760,.08,'sine',.028,.05]],
  voltar:[[1175,.05,'sine',.028,0],[880,.07,'sine',.025,.05]],
  toque:[[1568,.04,'sine',.026,0],[2093,.06,'triangle',.016,.04]],
  carta:[[988,.05,'triangle',.028,0],[1319,.05,'triangle',.028,.06],[1976,.14,'sine',.022,.12]]
};
//→petPhoneSom
//→petPhoneAbrir
//→petPhoneFechar
//→petPhoneVoltar
//→petPhoneTelaAbrir
var petPhoneAgendaCache = null;
//→petPhoneAgendaCarregar
//→petPhoneExterno
//→petLifeUI
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
//→petLifeAbrir
//→petLifeTap
//→petIdleJeito
//→petEstrelaBrinquedo
//→petPasseioBrinquedo
//→petBrinquedoEspontaneo
//→petDecorFavorito
//→petDecorReacao
//→petRotinaVisual
// Saudação visual curta ao abrir o camarim; sem áudio, timer ou persistência.
var petRecepcaoFrames = 0;
//→petRecepcaoJeito
//→petRecepcaoPulo
//→petRecepcaoDesenhar
//→petSurpresaAntes
//→petAmizadeVisual
//→petToqueIdolVisual
//→petIdolAcompanhaBrinquedo
var PET_VIDA_PRATELEIRA = {flor:{x:190,r:9},foto:{x:208,r:10},y:144};
//→petVidaLembrancaToque
function petVidaLembrancaAbrir(acao){
  if(!petOpen || petView !== 'room' || petGame || !contaJ || !petAtivo()) return false;
  if(acao === 'jardim'){
    if(typeof window.bloomAbrir !== 'function') return false;
    var fechar = $('petX');
    if(fechar) fechar.click();
    window.bloomAbrir();
    return true;
  }
  if(acao !== 'foto') return false;
  petPhoneMomentosConferir();
  var quadro = petVidaQuadroLer(), dono = petPhoneFotoChave();
  var momento = quadro === null ? petCartaFotoMomento() :
    petPhoneMomentos.find(function(f){return f.id === quadro.id && f.dono === dono;});
  if(!petPhoneAbrir('fotos')) return false;
  petPhoneFotosAbaAbrir('momentos');
  if(momento) petPhoneMomentoAbrir(momento.id);
  return true;
}
// As lembranças ocupam a prateleira superior e acompanham o móvel.
var petVidaFotoCache = null, petVidaFotoUrl = '', petVidaQuadroChave = null, petVidaQuadroEstado = null;
function petVidaQuadroCampo(){
  if(!contaJ || !petData || !petData.ativo) return '';
  var id = contaJ.id || (typeof contaAuthUserId === 'string' && contaAuthUserId);
  return id ? 'tw_pet_quadro_v1:' + JSON.stringify([id,petData.ativo]) : '';
}
function petVidaQuadroLer(){
  var chave = petVidaQuadroCampo();
  if(chave === petVidaQuadroChave) return petVidaQuadroEstado;
  petVidaQuadroChave = chave;
  petVidaQuadroEstado = null;
  if(!chave) return null;
  try{
    var bruto = localStorage.getItem(chave);
    if(bruto === '') petVidaQuadroEstado = {id:'',url:''};
    else if(bruto && bruto.length <= 65536){
      var foto = JSON.parse(bruto);
      if(foto && /^[A-Za-z0-9_-]{1,48}$/.test(foto.id) && typeof foto.url === 'string' &&
        /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(foto.url)) petVidaQuadroEstado = foto;
    }
  }catch(e){}
  return petVidaQuadroEstado;
}
function petVidaQuadroSalvar(chave, foto){
  if(!chave || chave !== petVidaQuadroCampo()) return false;
  try{
    var valor = foto.id ? JSON.stringify(foto) : '';
    if(valor.length > 65536) return false;
    localStorage.setItem(chave,valor);
  }catch(e){return false;}
  petVidaQuadroChave = chave;
  petVidaQuadroEstado = foto;
  return true;
}
var petVidaRetornoInicio = -1000;
//→petVidaFotoAtual
//→petVidaOlharLembranca
//→petVidaPetAtencao
//→petVidaLembrancaReacao
//→petVidaLembrancaBrilho
//→petVidaLembrancaCenario
//→petDrawRoom
var petRaf=0,petDrawDelta=1,petDrawDeltaPending=0;
//→petLoop
//→petAnimLigar
function petAnimParar(){if(petRaf){cancelAnimationFrame(petRaf);petRaf=0;}petDrawDeltaPending=0;}
//→petOpenUI
//→petClose
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
//→petRecLeft
var petComprando = false;
//→petPay
function petFind(list, k){ for(var i = 0; i < list.length; i++) if(list[i][0] === k) return list[i]; return null; }
//→petDaily
//→petUseItem
//→petToggleSleep
//→petPlay
//→petActUI
//→petMenuUI
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
//→petLembrarCuidado
//→petDesenharLembranca
// Balão de vontade (inspirado no The Sims): o Pet pede um cuidado que já existe.
// Vive só nesta aba; atender dá humor e corações, nunca estrelas nem pontos de cuidado.
var petVontade = null, petVontadeProx = 0, petVontadeFeitas = 0;
var PET_VONTADE_TXT = {comer:'quero {i}!', banho:'banho!', dormir:'soninho...', brincar:'brincar!', carinho:'carinho!', cantar:'cantar!', falar:'conversar!'};
var PET_VONTADE_EMO = {banho:'🛁', dormir:'💤', brincar:'⭐', carinho:'💕', cantar:'🎤', falar:'💬'};
var PET_COMIDA_EMO = {onigiri:'🍙', agua:'💧', gyoza:'🥟', dango:'🍡', redvelvet:'🍰', tiramisu:'🍮'};
//→petVontadeComidas
//→petVontadeEscolher
//→petVontadeTick
//→petVontadeAtender
//→petVontadeTexto
//→petVontadeDesenhar
//→petPreferenciaAtividade
//→petPreferenciaCelebrar
//→petCuidadoReagir
//→petDrawExtras
var PET_STICK = {   // adesivos da foto, de acordo com o humor
  'Feliz!':              ['💖', '✨', '🌸', '💕', '⭐'],
  'Dormindo...':         ['💤', '🌙', '⭐', '✨', '💜'],
  'Com sono...':         ['💤', '🌙', '🥱', '⭐', '💜'],
  'Com fome...':         ['🍙', '🍡', '💭', '🥺', '✨'],
  'Precisa de banho...': ['🫧', '🧼', '💦', '🫧', '✨'],
  'Com saudade...':      ['💭', '🥺', '💌', '💗', '✨'],
  'Tranquilo':           ['🎵', '🌷', '✨', '💗', '🎶']
};
//→petMakePhoto
//→petDevUI
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
  ['nebyura', 'Pôster NeByur✰',     80, 151, 85, 27, 35.5, 'quadro',    0],
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
//→petColor
function petEmo(k){ return PET_SP[k] ? PET_SP[k].emo : '💖'; }
//→petMeuLiberado
function petMix(h, alvo, a){   // mistura uma cor com branco (alvo 1) ou preto (alvo 0)
  var c = parseInt(String(h).replace('#', ''), 16), r = c >> 16, gg = (c >> 8) & 255, b = c & 255, w = alvo ? 255 : 0;
  return 'rgb(' + Math.round(r + (w - r) * a) + ',' + Math.round(gg + (w - gg) * a) + ',' + Math.round(b + (w - b) * a) + ')';
}
//→petShow
//→petBuildPick
//→petMarkPick
//→petPickMsg
//→petAdopt
//→petSwitch
//→petDrawPick
//→petMkOpen
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
//→petDressMenuUI
//→petDressClick
//→petMakeUI
//→petDrawMake
//→petEx
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
//→petDrawDirt
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
//→petCharTap
//→petDrawEmote
//→petDrawDecor
//→petDecorMenuUI
//→petDecorClick
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
//→petCharVoice
//→petSing
//→petSingFrame
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
//→petPers
//→petHoraBR
//→petBabble
//→petTalk
//→petDrawTalk
//→petNowS
//→petG   // troca o g com segurança (padrão do jogo)
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
//→petXP
//→petRankUI
// Acessórios exclusivos desenhados no espaço do pet (chamado pelo drawPet e pelo Meu Pet)
var PET_RANK_TIARA_STARS=[[-6.5,-9.6,1.6],[0,-11.8,2.2],[6.5,-9.6,1.6]];
function petDrawRankAcc(ctx, a, tp){
  if(a === 'fita'){   // hachimaki rosa com nó de lado
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 12, 11, 0, 0, 7); ctx.clip();
    ctx.fillStyle = '#fff'; ctx.fillRect(-13, -8.6, 26, 3.4); ctx.fillStyle = '#ff6fb5'; ctx.fillRect(-13, -7.9, 26, 1.9);
    ctx.restore();
    ctx.fillStyle = '#ff6fb5'; petDrawPolygon(ctx,[10.5, -7, 15.5, -10, 14.5, -5.5]); petDrawPolygon(ctx,[10.5, -6.5, 15, -3, 12.5, -2.5]);
  } else if(a === 'mic'){   // headset com microfone
    ctx.strokeStyle = '#334155'; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(0, -1, 12.6, 11.6, 0, Math.PI * 1.05, Math.PI * (tp === 'pati' ? 1.52 : 1.95)); ctx.stroke();   // Pucchi: arco para antes da coroa
    ctx.fillStyle = '#334155'; petDrawEllipse(ctx,-11.6, 0, 2, 2.6);
    ctx.beginPath(); ctx.moveTo(-11, 1.5); ctx.quadraticCurveTo(-10, 6, -4, 5.6); ctx.stroke();
    ctx.fillStyle = '#ff6fb5'; petDrawEllipse(ctx,-3.6, 5.6, 1.3, 1.1);
  } else if(a === 'tiara'){   // tiara com três estrelinhas
    var tpTi = tp === 'pati'; if(tpTi){ ctx.save(); ctx.translate(-1, -1.5); ctx.rotate(-.58); ctx.scale(.82, .82); }   // Pucchi: tiara girada sobre a cabeça, à esquerda da coroa (V3.1)
    ctx.strokeStyle = '#f5b400'; ctx.lineWidth = .8; ctx.beginPath(); ctx.ellipse(0, -1, 11, 10.2, 0, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    for(var si=0;si<PET_RANK_TIARA_STARS.length;si++){
      var star=PET_RANK_TIARA_STARS[si];ctx.fillStyle='#ffe14d';ctx.beginPath();
      for(var q=0;q<10;q++){var rr=q%2?star[2]*.45:star[2],an=q*Math.PI/5-Math.PI/2;ctx[q?'lineTo':'moveTo'](star[0]+Math.cos(an)*rr,star[1]+Math.sin(an)*rr);}
      ctx.closePath();ctx.fill();
    }
    if(tpTi) ctx.restore();
  } else if(a === 'faixa'){   // faixa dourada de Center atravessando o corpo
    ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, 12, 11, 0, 0, 7); ctx.clip();
    ctx.rotate(.3); ctx.fillStyle = '#fbbf24'; ctx.fillRect(-16, 6.4, 32, 3.2);   // V3.1: faixa mais baixa, abaixo da boca (não cobre os olhos)
    ctx.fillStyle = '#fff7d6'; ctx.fillRect(-16, 6.9, 32, .7);
    ctx.restore();
    ctx.fillStyle = '#ff6fb5'; petDrawEllipse(ctx,6.2, 10.4, 1.6, 1.6);
  } else if(a === 'aureola'){   // auréola dourada flutuando
    ctx.save(); ctx.shadowColor = '#fde047'; ctx.shadowBlur = 6;
    ctx.strokeStyle = '#fde047'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.ellipse(0, tp === 'pati' ? -23 : -18.5, 8, 2.4, 0, 0, 7); ctx.stroke();   // Pucchi: acima da coroa
    ctx.restore();
  }
}
//→petDrawPromo
var PET_MINI_CAP = 50;      // teto de estrelas por dia, somando os dois minijogos
var PET_BEAT = 0.34;        // mesmo andamento da faixa lofi do camarim (Pacote A)
var PET_JUMP = 0.46;        // duração do pulo na corda (s)
var PET_LANES = ['#9b30d9', '#5cc72c', '#4169e1'];   // roxo Tsu, verde Lirika, azul Pati
var petGame = null;
var PET_SPECIAL = { sorvete:1 };
//→petMenuFiltro
//→petMini
//→petPlayMenuUI
//→petPlayClick
//→petGameStart
//→petJumpH   // pico de 28px
//→petGameTap
//→petHitLane
//→petJump
//→petGameUpdate
//→petGameEnd
//→petGameClose
//→petGameAbort
//→petGameBtns
//→petGameDraw
var PET_TEMAS = [   // [chave, início MM-DD, fim MM-DD] — para um tema novo, é só acrescentar uma linha
  ['halloween', '10-24', '11-02']
];
var petTemaOn = '';
//→petTemaAtual
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
//→petDrawHalloween
//→petDrawChapeu
//→petRoomBack
//→petRoomFront
//→petRoomTap
//→petTemaFoto
//→petDrawArvore
//→petDrawPresente
//→petDrawNatal
//→petDrawGorro
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
//→petPhUI
function petPhShow(on, modo){ if(on) petPhMode = modo || 'pet'; petPhBox.hidden = !on; if(on){ if(typeof petPhUI === 'function') petPhUI(); else petSalaCarregar().then(function(){ if(!petPhBox.hidden) petPhUI(); }).catch(function(){}); } }
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

// ---------- Sala do pet sob demanda (pet-sala.js) ----------
// Na abertura fica só o que o Hub, a corrida e os outros jogos usam (desenho do pet, humor, lembranças, fotos guardadas).
// O quarto, o celular, a agenda, o camarim, o minijogo e a adoção baixam ao abrir o pet. Cada "//→nome" acima marca o
// lugar de uma função que mora em pet-sala.js (lá ela vem depois de "//←nome"); tests/pet-fonte.js remonta a ordem.
// Se mudar pet-sala.js, suba a versão em PET_SALA_ARQ.
var PET_SALA_ARQ='./pet-sala.js?v=16',PET_SALA_PRONTA=false,petSalaFila=[],petSalaP=null;
function petSalaAoCarregar(f){if(PET_SALA_PRONTA)f();else petSalaFila.push(f);}
function petSalaCarregar(){
  if(PET_SALA_PRONTA)return Promise.resolve();
  if(!petSalaP)petSalaP=new Promise(function(ok,er){var e=document.createElement('script');e.src=PET_SALA_ARQ;e.async=false;
    e.onload=ok;e.onerror=function(){petSalaP=null;er(new Error('pet'));};document.head.appendChild(e);})
    .then(function(){PET_SALA_PRONTA=true;var f;while((f=petSalaFila.shift()))try{f();}catch(e){if(window.console)console.error(e);}});
  return petSalaP;
}
