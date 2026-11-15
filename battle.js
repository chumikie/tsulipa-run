/* Idol⭐Battle! v1 — show de palco de 3 rodadas.
   O cliente NUNCA calcula prêmio online: somente battle_jogar() pode premiar.
   Sem conta (ou sem resposta do servidor): treino declaradamente local, sem estrelas ou saves.
   O show no palco só ENCENA o resultado que já veio pronto; pular não muda nada.
*/
(function(){
'use strict';
var T={
 pt:{title:'Idol⭐Battle!',subtitle:'Três Idols, três apresentações!',cant:'Canto',dance:'Dança',charm:'Carisma',daily:'Rival do dia',stage:'Escalar sua unit',play:'Começar show!',again:'Tentar novamente',save:'Salvar polaroid',practice:'Treino sem prêmio.',wait:'Carregando a Arena...',error:'Não foi possível conferir o show. Tente novamente.',used:'Tentativas restantes',win:'Sua unit venceu!',lose:'O rival venceu!',draw:'Empate!',reward:'Recompensa confirmada: ★5',noReward:'Sem recompensa nesta partida',locked:'Volte amanhã para desafiar o rival novamente.',guest:'Entre com Google para disputar partidas oficiais.',my:'Você',other:'Rival',starter:'Unit inicial',rivalHint:'Cada rival esconde um atributo (?) e a ordem de apresentação é secreta.',choose:'Escolha três Idols diferentes, um por rodada.',none:'Sem cards suficientes, a unit inicial entra em cena.',loading:'Preparando a Arena...',points:'Pontos',skip:'Pular ▶▶',prizeDone:'★5 de hoje já conquistada!',prizeOpen:'A primeira vitória de hoje vale ★5.',round:'Rodada',yourUnit:'Sua unit',copies:'Cards repetidos dão bônus no palco.',rankTitle:'Top da Arena · semana',rankEmpty:'Ninguém venceu nesta semana ainda. Seja a primeira pessoa!',tabDaily:"Rival do dia",tabArena:"Arena dos Idols",arenaLeft:"Desafios restantes",friendly:"Desafio amistoso: vale a glória, não ★.",arenaMine:"Sua unit na arena",arenaNone:"Você ainda não tem uma unit valendo na arena.",arenaSave:"Deixar minha escalação na arena",arenaSaveHint:"Monte aqui a escalação que fica na arena. Quem desafiar você não vê a ordem.",arenaSaved:"Unit salva! Agora outros Idols podem desafiar você.",arenaEmpty:"Ainda não há units de outros Idols por aqui. Deixe a sua e chame a galera!",challenge:"Desafiar",challenged:"Já desafiado hoje",fans:"fãs da arena",vsUnit:"Unit de {n}",arenaLimit:"Você já fez os desafios de hoje. Volte amanhã!",arenaGone:"Essa unit não está mais disponível.",backArena:"◀ Voltar para a arena",defFan:"A defesa venceu: {n} ganhou um fã",cheerTitle:"Torcida de flores",cheerToday:"Hoje a torcida levou {f}: +1 em {r}.",cheerPick:"Leve uma flor (1 por dia, ela é gasta) e ganhe +1 nas partidas de hoje:",cheerNone:"Colha flores no Bloom⭐Garden! para animar a torcida: +1 no palco.",cheerAll:"todas as rodadas"},
 en:{title:'Idol⭐Battle!',subtitle:'Three Idols, three performances!',cant:'Singing',dance:'Dance',charm:'Charisma',daily:"Today's rival",stage:'Choose your unit',play:'Start the show!',again:'Try again',save:'Save polaroid',practice:'Practice only, no rewards.',wait:'Loading the Arena...',error:'Could not verify the show. Try again.',used:'Attempts left',win:'Your unit won!',lose:'The rival won!',draw:'Draw!',reward:'Verified reward: ★5',noReward:'No reward this match',locked:'Come back tomorrow to face the rival again.',guest:'Sign in with Google for official matches.',my:'You',other:'Rival',starter:'Starter unit',rivalHint:'Each rival hides one stat (?), and their order is secret.',choose:'Choose three different Idols, one per round.',none:'Not enough cards? The starter unit can perform.',loading:'Preparing the Arena...',points:'Points',skip:'Skip ▶▶',prizeDone:"Today's ★5 already earned!",prizeOpen:"Today's first win is worth ★5.",round:'Round',yourUnit:'Your unit',copies:'Duplicate cards give a stage bonus.',rankTitle:'Arena Top · this week',rankEmpty:'No wins this week yet. Be the first!',tabDaily:"Today's rival",tabArena:"Idol Arena",arenaLeft:"Challenges left",friendly:"Friendly challenge: for glory, not ★.",arenaMine:"Your unit in the arena",arenaNone:"You don't have a unit in the arena yet.",arenaSave:"Leave my lineup in the arena",arenaSaveHint:"Build the lineup you leave in the arena here. Challengers can't see the order.",arenaSaved:"Unit saved! Other Idols can challenge you now.",arenaEmpty:"No units from other Idols yet. Leave yours and invite everyone!",challenge:"Challenge",challenged:"Already challenged today",fans:"arena fans",vsUnit:"{n}'s unit",arenaLimit:"You've used today's challenges. Come back tomorrow!",arenaGone:"That unit is no longer available.",backArena:"◀ Back to the arena",defFan:"The defense won: {n} gained a fan",cheerTitle:"Flower cheer",cheerToday:"Today the crowd brought {f}: +1 in {r}.",cheerPick:"Bring one flower (1 per day, it gets used up) for +1 in today's matches:",cheerNone:"Pick flowers in Bloom⭐Garden! to cheer the crowd: +1 on stage.",cheerAll:"every round"},
 es:{title:'Idol⭐Battle!',subtitle:'¡Tres Idols, tres actuaciones!',cant:'Canto',dance:'Baile',charm:'Carisma',daily:'Rival del día',stage:'Forma tu unit',play:'¡Empezar!',again:'Intentar de nuevo',save:'Guardar polaroid',practice:'Solo práctica, sin premios.',wait:'Cargando la Arena...',error:'No se pudo verificar la actuación.',used:'Intentos restantes',win:'¡Ganó tu unit!',lose:'¡Ganó el rival!',draw:'¡Empate!',reward:'Premio verificado: ★5',noReward:'Sin premio esta vez',locked:'Vuelve mañana.',guest:'Entra con Google para jugar oficialmente.',my:'Tú',other:'Rival',starter:'Unit inicial',rivalHint:'Cada rival oculta un atributo (?) y su orden es secreto.',choose:'Elige tres Idols distintos.',none:'La unit inicial puede jugar.',loading:'Preparando la Arena...',points:'Puntos',skip:'Saltar ▶▶',prizeDone:'¡★5 de hoy ya conseguida!',prizeOpen:'La primera victoria de hoy vale ★5.',round:'Ronda',yourUnit:'Tu unit',copies:'Los cards repetidos dan un bonus en el escenario.',rankTitle:'Top de la Arena · semana',rankEmpty:'Nadie ha ganado esta semana todavía. ¡Sé la primera persona!',tabDaily:"Rival del día",tabArena:"Arena de Idols",arenaLeft:"Desafíos restantes",friendly:"Desafío amistoso: por la gloria, no por ★.",arenaMine:"Tu unit en la arena",arenaNone:"Aún no tienes una unit en la arena.",arenaSave:"Dejar mi alineación en la arena",arenaSaveHint:"Arma aquí la alineación que dejas en la arena. Quien te desafíe no ve el orden.",arenaSaved:"¡Unit guardada! Ahora otros Idols pueden desafiarte.",arenaEmpty:"Todavía no hay units de otros Idols. ¡Deja la tuya e invita a todos!",challenge:"Desafiar",challenged:"Ya desafiado hoy",fans:"fans de la arena",vsUnit:"Unit de {n}",arenaLimit:"Ya hiciste los desafíos de hoy. ¡Vuelve mañana!",arenaGone:"Esa unit ya no está disponible.",backArena:"◀ Volver a la arena",defFan:"Ganó la defensa: {n} sumó un fan",cheerTitle:"Hinchada de flores",cheerToday:"Hoy la hinchada llevó {f}: +1 en {r}.",cheerPick:"Lleva una flor (1 por día, se gasta) y gana +1 en los shows de hoy:",cheerNone:"Cosecha flores en Bloom⭐Garden! para animar a la hinchada: +1 en el escenario.",cheerAll:"todas las rondas"},
 id:{title:'Idol⭐Battle!',subtitle:'Tiga Idol, tiga penampilan!',cant:'Menyanyi',dance:'Tari',charm:'Karisma',daily:'Lawan hari ini',stage:'Pilih unit',play:'Mulai pertunjukan!',again:'Coba lagi',save:'Simpan polaroid',practice:'Latihan saja, tanpa hadiah.',wait:'Memuat Arena...',error:'Hasil tidak dapat diverifikasi.',used:'Percobaan tersisa',win:'Unitmu menang!',lose:'Lawan menang!',draw:'Seri!',reward:'Hadiah terverifikasi: ★5',noReward:'Tanpa hadiah kali ini',locked:'Kembali besok.',guest:'Masuk Google untuk pertandingan resmi.',my:'Kamu',other:'Lawan',starter:'Unit awal',rivalHint:'Tiap lawan menyembunyikan satu atribut (?), urutannya rahasia.',choose:'Pilih tiga Idol berbeda.',none:'Unit awal bisa digunakan.',loading:'Menyiapkan Arena...',points:'Poin',skip:'Lewati ▶▶',prizeDone:'★5 hari ini sudah didapat!',prizeOpen:'Kemenangan pertama hari ini bernilai ★5.',round:'Babak',yourUnit:'Unitmu',copies:'Kartu duplikat memberi bonus di panggung.',rankTitle:'Top Arena · minggu ini',rankEmpty:'Belum ada yang menang minggu ini. Jadilah yang pertama!',tabDaily:"Lawan hari ini",tabArena:"Arena Idol",arenaLeft:"Tantangan tersisa",friendly:"Tantangan persahabatan: demi kehormatan, bukan ★.",arenaMine:"Unitmu di arena",arenaNone:"Kamu belum punya unit di arena.",arenaSave:"Taruh susunanku di arena",arenaSaveHint:"Susun di sini unit yang kamu taruh di arena. Penantang tidak melihat urutannya.",arenaSaved:"Unit tersimpan! Idol lain sekarang bisa menantangmu.",arenaEmpty:"Belum ada unit Idol lain. Taruh unitmu dan ajak semuanya!",challenge:"Tantang",challenged:"Sudah ditantang hari ini",fans:"penggemar arena",vsUnit:"Unit {n}",arenaLimit:"Tantangan hari ini sudah habis. Kembali besok!",arenaGone:"Unit itu sudah tidak tersedia.",backArena:"◀ Kembali ke arena",defFan:"Pertahanan menang: {n} mendapat satu penggemar",cheerTitle:"Dukungan bunga",cheerToday:"Hari ini penonton membawa {f}: +1 di {r}.",cheerPick:"Bawa satu bunga (1 per hari, bunganya terpakai) untuk +1 di pertandingan hari ini:",cheerNone:"Petik bunga di Bloom⭐Garden! untuk menyemangati penonton: +1 di panggung.",cheerAll:"semua babak"},
 th:{title:'Idol⭐Battle!',subtitle:'ไอดอล 3 คน 3 รอบ!',cant:'ร้องเพลง',dance:'เต้น',charm:'เสน่ห์',daily:'คู่แข่งวันนี้',stage:'เลือกยูนิต',play:'เริ่มโชว์!',again:'ลองอีกครั้ง',save:'บันทึกโพลารอยด์',practice:'โหมดฝึกซ้อมเท่านั้น ไม่มีรางวัล',wait:'กำลังโหลดอารีนา...',error:'ตรวจสอบผลไม่ได้ ลองอีกครั้ง',used:'ครั้งที่เหลือ',win:'ยูนิตของคุณชนะ!',lose:'คู่แข่งชนะ!',draw:'เสมอ!',reward:'รางวัลยืนยัน: ★5',noReward:'รอบนี้ไม่มีรางวัล',locked:'กลับมาใหม่พรุ่งนี้',guest:'เข้าสู่ระบบ Google เพื่อเล่นจริง',my:'คุณ',other:'คู่แข่ง',starter:'ยูนิตเริ่มต้น',rivalHint:'คู่แข่งแต่ละคนซ่อนค่าหนึ่งอย่าง (?) และลำดับเป็นความลับ',choose:'เลือกไอดอล 3 คนไม่ซ้ำกัน',none:'ใช้ยูนิตเริ่มต้นได้',loading:'กำลังเตรียมอารีนา...',points:'คะแนน',skip:'ข้าม ▶▶',prizeDone:'ได้รับ ★5 ของวันนี้แล้ว!',prizeOpen:'ชนะครั้งแรกของวันนี้ได้ ★5',round:'รอบ',yourUnit:'ยูนิตของคุณ',copies:'การ์ดซ้ำให้โบนัสบนเวที',rankTitle:'ท็อปอารีนา · สัปดาห์นี้',rankEmpty:'สัปดาห์นี้ยังไม่มีใครชนะ มาเป็นคนแรกกันเถอะ!',tabDaily:"คู่แข่งวันนี้",tabArena:"อารีนาไอดอล",arenaLeft:"ท้าได้อีก",friendly:"ท้าประลองกระชับมิตร: เพื่อเกียรติ ไม่ได้ ★",arenaMine:"ยูนิตของคุณในอารีนา",arenaNone:"คุณยังไม่มียูนิตในอารีนา",arenaSave:"วางยูนิตของฉันในอารีนา",arenaSaveHint:"จัดยูนิตที่จะวางในอารีนาได้ที่นี่ ผู้ท้าจะไม่เห็นลำดับ",arenaSaved:"บันทึกยูนิตแล้ว! ไอดอลคนอื่นท้าคุณได้แล้ว",arenaEmpty:"ยังไม่มียูนิตของไอดอลคนอื่น วางของคุณแล้วชวนทุกคนมาเลย!",challenge:"ท้าประลอง",challenged:"ท้าไปแล้ววันนี้",fans:"แฟนอารีนา",vsUnit:"ยูนิตของ {n}",arenaLimit:"วันนี้ท้าครบแล้ว กลับมาใหม่พรุ่งนี้!",arenaGone:"ยูนิตนี้ไม่พร้อมใช้งานแล้ว",backArena:"◀ กลับไปอารีนา",defFan:"ฝ่ายป้องกันชนะ: {n} ได้แฟนเพิ่ม",cheerTitle:"กองเชียร์ดอกไม้",cheerToday:"วันนี้กองเชียร์ถือ {f}: +1 ใน{r}",cheerPick:"นำดอกไม้ 1 ดอก (วันละ 1 ดอก ใช้แล้วหมดไป) เพื่อ +1 ในการแข่งวันนี้:",cheerNone:"เก็บดอกไม้ใน Bloom⭐Garden! มาให้กองเชียร์: +1 บนเวที",cheerAll:"ทุกรอบ"},
 ja:{title:'Idol⭐Battle!',subtitle:'3人のアイドルで3ステージ！',cant:'歌',dance:'ダンス',charm:'カリスマ',daily:'今日のライバル',stage:'ユニットを編成',play:'ショー開始！',again:'もう一度',save:'ポラロイドを保存',practice:'練習のみ。報酬はありません。',wait:'アリーナを読み込み中…',error:'結果を確認できませんでした。',used:'残り挑戦回数',win:'あなたのユニットの勝ち！',lose:'ライバルの勝ち！',draw:'引き分け！',reward:'確定報酬：★5',noReward:'今回は報酬なし',locked:'また明日挑戦してね',guest:'公式戦はGoogleでログイン',my:'あなた',other:'ライバル',starter:'初期ユニット',rivalHint:'ライバルはそれぞれ能力を1つ隠していて(?)、出番も秘密',choose:'異なる3人のアイドルを選んでね',none:'最初のユニットでも遊べます',loading:'アリーナを準備中…',points:'点',skip:'スキップ ▶▶',prizeDone:'今日の★5は獲得済み！',prizeOpen:'今日の初勝利で★5',round:'ラウンド',yourUnit:'あなたのユニット',copies:'同じカードが複数あるとステージでボーナス',rankTitle:'アリーナTOP・今週',rankEmpty:'今週はまだ勝者がいません。最初の一人になろう！',tabDaily:"今日のライバル",tabArena:"アイドルアリーナ",arenaLeft:"残りチャレンジ",friendly:"フレンドリーマッチ：★はなし、名誉をかけて！",arenaMine:"アリーナのあなたのユニット",arenaNone:"まだアリーナにユニットがありません。",arenaSave:"この編成をアリーナに置く",arenaSaveHint:"アリーナに置く編成をここで組めます。挑戦者に出番は見えません。",arenaSaved:"ユニットを保存！他のアイドルが挑戦できます。",arenaEmpty:"まだ他のアイドルのユニットがありません。あなたのユニットを置いてみんなを誘おう！",challenge:"挑戦する",challenged:"今日は挑戦済み",fans:"アリーナのファン",vsUnit:"{n}のユニット",arenaLimit:"今日のチャレンジは終了。また明日！",arenaGone:"そのユニットは今は使えません。",backArena:"◀ アリーナに戻る",defFan:"防衛成功：{n}にファンが1人増えた",cheerTitle:"お花の応援",cheerToday:"今日の応援は{f}：{r}に+1。",cheerPick:"花を1つ届けると（1日1つ・使うとなくなります）、今日のバトルで+1：",cheerNone:"Bloom⭐Garden!で花を摘んで応援しよう：ステージで+1。",cheerAll:"全ラウンド"}
};
var DEFAULT=[{nick:'Tsu',canto:5,danca:6,carisma:5,qtd:1},{nick:'Lirika',canto:6,danca:5,carisma:5,qtd:1},{nick:'Pati',canto:5,danca:5,carisma:6,qtd:1}];
var ATR=['canto','danca','carisma'],COR=['#ff6fb5','#4dd8ff','#b6ff3b'];
// Ícones desenhados das três apresentações (microfone, sapatilha, coração) e do troféu: os mesmos
// traços valem no HTML (SVG) e no palco (Path2D), sem depender do emoji de cada aparelho.
var ICP=[
 ['M12 2.5A3.5 3.5 0 0 0 8.5 6v5a3.5 3.5 0 0 0 7 0V6A3.5 3.5 0 0 0 12 2.5zM6 10.5a1 1 0 0 1 2 0 4 4 0 0 0 8 0 1 1 0 0 1 2 0 6 6 0 0 1-5 5.9V19h2.5a1 1 0 0 1 0 2h-7a1 1 0 0 1 0-2H11v-2.6a6 6 0 0 1-5-5.9z'],
 ['M7.5 3h4a1 1 0 0 1 1 1v7.2l6.3 2.4c1.4.5 2.2 1.8 2.2 3.2V17H3v-1.3c0-1 .3-2 .9-2.8L6.5 9.5V4a1 1 0 0 1 1-1z','M3 18.2h18V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z'],
 ['M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'],
 ['M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z']
];
function ico(i,extra){return '<svg class="battle-ic'+(extra?' '+extra:'')+'" viewBox="0 0 24 24" aria-hidden="true">'+ICP[i].map(function(d){return '<path fill="currentColor" d="'+d+'"/>';}).join('')+'</svg>';}
function icoCanvas(x,i,cx,cy,tam,cor){
 if(typeof Path2D!=='function')return;
 x.save();x.translate(cx-tam/2,cy-tam/2);x.scale(tam/24,tam/24);x.lineJoin='round';
 ICP[i].forEach(function(d){var c=new Path2D(d);x.strokeStyle='rgba(30,10,70,.85)';x.lineWidth=5*24/tam;x.stroke(c);});
 ICP[i].forEach(function(d){x.fillStyle=cor||'#fff';x.fill(new Path2D(d));});
 x.restore();
}
// Texto do palco com o ícone da rodada à esquerda, os dois centralizados juntos.
function rotulo(x,i,txt,cx,y,px,cor){
 var w=x.measureText(txt).width,ic=px*1.05,total=ic+px*.3+w;
 icoCanvas(x,i,cx-total/2+ic/2,y-px*.36,ic,cor);
 contorno(x,txt,cx-total/2+ic+px*.3+w/2,y,cor);
}
var SW=560,SH=520,DUR=2;               // palco lógico (px) e duração de cada rodada (s)
var ov=null,estado=null,unit=[],rodadas=null,ocupado=false,msg='',servidor=false;
var fase='escalar',showT0=0,showRaf=0; // escalar → show → fim
var ranking=null;                       // Top da Arena (só aparece se o servidor responder)
var torcida=null;                       // v3: flor levada hoje para a torcida (Bloom⭐Garden! → Battle)
var FLOR={sakura:['#ff93c0',0],tulipa:['#f26a93',1],girassol:['#f8b62a',2],lunar:['#ab8ef6',-1]};  // cor da flor, rodada do bônus
var modo='dia',arena=null,alvo=null,msgOk=false; // v2: Arena dos Idols (units salvas); alvo = unit desafiada
var T_LIVE={pt:['BRILHO','Combo'],en:['SHINE','Combo'],es:['BRILLO','Combo'],id:['KILAU','Combo'],th:['ประกาย','คอมโบ'],ja:['キラキラ','コンボ']};
Object.keys(T_LIVE).forEach(function(l){if(!T[l])return;T[l].brilho=T_LIVE[l][0];T[l].combo=T_LIVE[l][1];});
function lang(){return typeof LANG==='string'&&T[LANG]?LANG:'pt';}
// Lightsticks no ritmo (só diversão local durante o show; o placar é sempre o do servidor).
var T_RITMO={pt:['📣 Agitar lightstick','Lightsticks no ritmo: {n}/{t}','A plateia foi à loucura!','Boa torcida!','Toque na batida do anel na próxima vez!'],
 en:['📣 Wave lightstick','Lightsticks on the beat: {n}/{t}','The crowd went wild!','Nice cheering!','Tap with the ring\'s beat next time!'],
 es:['📣 Agitar lightstick','Lightsticks al ritmo: {n}/{t}','¡El público enloqueció!','¡Buena porra!','¡La próxima vez toca al ritmo del anillo!'],
 id:['📣 Goyang lightstick','Lightstick sesuai ketukan: {n}/{t}','Penonton jadi heboh!','Sorakan bagus!','Lain kali ketuk mengikuti cincin!'],
 th:['📣 โบกแท่งไฟ','โบกตรงจังหวะ: {n}/{t}','คนดูกรี๊ดกันใหญ่!','เชียร์ได้ดี!','ครั้งหน้าแตะตามจังหวะวงแหวนนะ!'],
 ja:['📣 ペンライトをふる','リズムにあわせて: {n}/{t}','会場が大もりあがり！','ナイス応援！','つぎは輪っかのリズムでタップしてね！']};
Object.keys(T_RITMO).forEach(function(l){if(!T[l])return;var v=T_RITMO[l];T[l].agitar=v[0];T[l].ritmo=v[1];T[l].ritmoTop=v[2];T[l].ritmoOk=v[3];T[l].ritmoPouco=v[4];});
// Habilidades dos cards (como as skills das cartas nas lives): cada card tem uma, ligada ao seu melhor atributo.
// Disparam quando a torcida fecha 3 batidas seguidas na rodada daquele card e enchem o contador de corações.
// É a festa da torcida: o placar e o prêmio continuam sendo só os do servidor.
var T_SKILL={pt:['Nota Alta','Passo Duplo','Piscadinha','HABILIDADE!','Corações da torcida','Habilidades: {n}/3 · Corações da torcida: {c}','Combina com a rodada: +3 ♥'],
 en:['High Note','Double Step','Little Wink','SKILL!','Crowd hearts','Skills: {n}/3 · Crowd hearts: {c}','Matches the round: +3 ♥'],
 es:['Nota Alta','Paso Doble','Guiñito','¡HABILIDAD!','Corazones del público','Habilidades: {n}/3 · Corazones del público: {c}','Combina con la ronda: +3 ♥'],
 id:['Nada Tinggi','Langkah Ganda','Kedipan','SKILL!','Hati penonton','Skill: {n}/3 · Hati penonton: {c}','Cocok dengan babak: +3 ♥'],
 th:['โน้ตสูง','สเต็ปคู่','ขยิบตา','สกิล!','หัวใจจากคนดู','สกิล: {n}/3 · หัวใจจากคนดู: {c}','เข้ากับรอบ: +3 ♥'],
 ja:['ハイノート','ダブルステップ','ウインク','スキル！','ファンのハート','スキル: {n}/3 · ファンのハート: {c}','ラウンドにぴったり: +3 ♥']};
Object.keys(T_SKILL).forEach(function(l){if(!T[l])return;var v=T_SKILL[l];T[l].sk0=v[0];T[l].sk1=v[1];T[l].sk2=v[2];T[l].skill=v[3];T[l].coracoes=v[4];T[l].skillRes=v[5];T[l].skMatch=v[6];});
function trB(k){return T[lang()][k]||T.pt[k]||k;}
function habilidade(c){   // 0 Nota Alta (canto) · 1 Passo Duplo (dança) · 2 Piscadinha (carisma); empate fica com o primeiro
 var m=0;for(var i=1;i<3;i++)if(valor(c,i)>valor(c,m))m=i;return m;}
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
function dataBonita(d){
 try{var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(d));if(!m)return String(d||'');
   return new Intl.DateTimeFormat({pt:'pt-BR',en:'en-US',es:'es',id:'id',th:'th',ja:'ja'}[lang()]||'pt-BR',{timeZone:'UTC',day:'2-digit',month:'2-digit',year:'numeric'})
     .format(new Date(Date.UTC(+m[1],+m[2]-1,+m[3],12)));}catch(e){return String(d||'');}
}
function nomeCurto(n,max){n=String(n==null?'?':n);max=max||13;return n.length>max?n.slice(0,max-1)+'…':n;}

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
 // tocar no palco (ou apertar espaço) durante o show também agita o lightstick
 ov.addEventListener('pointerdown',function(e){if(fase==='show'&&e.target&&e.target.id==='battleStage'){e.preventDefault();agitar();}});
 document.addEventListener('keydown',function(e){if(fase==='show'&&ov&&!ov.hidden&&(e.key===' '||e.key==='Enter')&&!(e.target&&e.target.closest&&e.target.closest('button,select,input'))){e.preventDefault();agitar();}});
 ov.addEventListener('click',function(e){
   if(e.target===ov){fechar();return;}
   var b=e.target.closest&&e.target.closest('[data-battle]');if(!b)return;
   var a=b.getAttribute('data-battle');
   if(a==='fechar'){fechar();return;}
   if(a==='agitar'){agitar();return;}
   if(a==='pular'){fimDoShow();return;}
   if(ocupado)return;
   if(a==='jogar'){jogar();return;}
   if(a==='outra'||a==='voltar'){rodadas=null;msg='';msgOk=false;fase='escalar';if(a==='voltar'||modo==='arena'){alvo=null;carregarArena();}render();return;}
   if(a==='tab-dia'||a==='tab-arena'){modo=a==='tab-arena'&&arena?'arena':'dia';alvo=null;rodadas=null;msg='';msgOk=false;fase='escalar';render();return;}
   if(a==='desafiar'){var n=b.getAttribute('data-nick');alvo=(arena&&arena.lista||[]).find(function(x){return x.nick===n;})||null;msg='';msgOk=false;render();return;}
   if(a==='salvar-unit'){salvarUnit();return;}
   if(a==='torcida'){levarFlor(b.getAttribute('data-flor'));return;}
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
 rodadas=null;ritmo=null;ocupado=false;msg='';servidor=false;fase='escalar';ranking=null;torcida=null;modo='dia';arena=null;alvo=null;msgOk=false;render();
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
   carregarRanking();carregarArena();carregarTorcida();
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
// Torcida de flores (v3). Sem a função no servidor a seção não aparece e nada muda.
function carregarTorcida(){
 if(!logado())return;
 contaRpc('battle_torcida').then(function(r){
   if(!r||!r.ok||!r.flores||typeof r.flores!=='object')return;
   torcida=r;if(ov&&!ov.hidden&&fase==='escalar'&&!ocupado)render();
 }).catch(function(){});
}
function nomeFlor(k){
 var n='';try{var B=window.BLOOM_TR;n=B&&(B[lang()]||B.pt)[k]||'';}catch(e){}
 return n||(k.charAt(0).toUpperCase()+k.slice(1));
}
function florDot(k){return FLOR[k]?'<i class="battle-fdot" style="background:'+FLOR[k][0]+'" aria-hidden="true"></i>':'';}
function levarFlor(k){
 if(ocupado||!torcida||torcida.hoje||!FLOR[k]||!(Number(torcida.flores[k])>0))return;
 ocupado=true;msg='';render();
 contaRpc('battle_torcida_levar',{p_flor:k}).then(function(r){
   if(!r||!r.ok)throw Error('flor');
   torcida.hoje=k;torcida.flores[k]=Number(r.qtd)||0;
 }).catch(function(){msg=trB('error');msgOk=false;carregarTorcida();}).then(function(){ocupado=false;render();});
}
function torcidaHtml(){
 if(!torcida||!servidor)return '';
 var h='<section class="battle-torcida"><h3>'+esc(trB('cheerTitle'))+'</h3>';
 if(torcida.hoje&&FLOR[torcida.hoje]){
   var i=FLOR[torcida.hoje][1];
   h+='<p class="battle-fas">'+florDot(torcida.hoje)+esc(trB('cheerToday').replace('{f}',nomeFlor(torcida.hoje)).replace('{r}',i<0?trB('cheerAll'):nomeRound(i)))+'</p>';
 }else{
   var tem=Object.keys(FLOR).filter(function(k){return Number(torcida.flores[k])>0;});
   if(!tem.length)h+='<p class="battle-hint">'+esc(trB('cheerNone'))+'</p>';
   else h+='<p class="battle-hint">'+esc(trB('cheerPick'))+'</p><div class="battle-flores">'+tem.map(function(k){
     var i=FLOR[k][1];
     return '<button type="button" class="btn alt" data-battle="torcida" data-flor="'+k+'"'+(ocupado?' disabled':'')+'><span>'+florDot(k)+esc(nomeFlor(k))+' ×'+Math.min(99,Number(torcida.flores[k]))+'</span>'+
       '<small>+1 '+(i<0?ico(0)+ico(1)+ico(2):ico(i)+esc(nomeRound(i)))+'</small></button>';}).join('')+'</div>';
 }
 return h+'</section>';
}
// Arena dos Idols (v2). Sem as funções no servidor a aba não aparece e nada muda.
function carregarArena(){
 if(!logado())return;
 contaRpc('battle_arena').then(function(r){
   if(!r||!r.ok||!Array.isArray(r.lista))return;
   arena=r;if(ov&&!ov.hidden&&fase==='escalar'&&!ocupado)render();
 }).catch(function(){});
}
function naArena(){return modo==='arena'&&servidor&&!!arena;}
function salvarUnit(){
 if(ocupado||!naArena())return;
 if(unit.length!==3||new Set(unit).size!==3){msg=trB('choose');msgOk=false;render();return;}
 ocupado=true;msg='';render();
 contaRpc('battle_unit_salvar',{p_unit:unit.slice()}).then(function(r){
   if(!r||!r.ok||!Array.isArray(r.unit))throw Error('unit');
   arena.minha={fas:Number(r.fas)||0,unit:r.unit};msg=trB('arenaSaved');msgOk=true;
 }).catch(function(){msg=trB('error');msgOk=false;}).then(function(){ocupado=false;render();});
}
function slotsHtml(){
 var h='';
 for(var i=0;i<3;i++){
   var escolhido=cardDe(unit[i]),forca=Math.max(0,Math.min(10,valor(escolhido,i)));
   h+='<label class="battle-slot"><span>'+ico(i)+esc(nomeRound(i))+'</span><span class="battle-selection"><select data-battle-slot="'+i+'">'+
    estado.cards.map(function(c){return '<option value="'+esc(c.nick)+'"'+(unit[i]===c.nick?' selected':'')+'>'+esc(c.nick)+
     ' · '+valor(c,i)+'/10</option>';}).join('')+'</select>'+
     '<span class="battle-power" role="img" aria-label="'+esc(nomeRound(i))+' '+forca+'/10"><i style="width:'+ (forca*10) +'%"></i><b>'+forca+'/10</b></span></span></label>';
 }
 return h;
}
function abasHtml(){
 if(!servidor||!arena)return '';
 return '<div class="battle-tabs" role="tablist">'+[['dia','',trB('tabDaily')],['arena','',trB('tabArena')]].map(function(t){
   var on=(modo==='arena')===(t[0]==='arena');
   return '<button type="button" role="tab" aria-selected="'+on+'" class="battle-tab'+(on?' on':'')+'" data-battle="tab-'+t[0]+'">'+t[1]+esc(t[2])+'</button>';}).join('')+'</div>';
}
function arenaStatusHtml(){
 var max=Number(arena.max_desafios)||3,feitos=Number(arena.desafios)||0;
 return '<div class="battle-status real">'+esc(trB('arenaLeft'))+': '+Math.max(0,max-feitos)+' / '+max+'<br><small>'+esc(trB('friendly'))+'</small></div>';
}
function lobbyHtml(){
 var max=Number(arena.max_desafios)||3,cheio=(Number(arena.desafios)||0)>=max;
 var minha=arena.minha&&Array.isArray(arena.minha.unit)&&arena.minha.unit.length===3?arena.minha:null;
 var h=arenaStatusHtml()+'<section class="battle-escalar"><h3>'+esc(trB('arenaMine'))+'</h3>';
 if(minha)h+='<div class="battle-trio">'+minha.unit.map(function(c,i){return idolHtml(c,true,ico(i)+esc(nomeRound(i)),i);}).join('')+
   '</div><p class="battle-fas">'+ico(2)+(Number(minha.fas)||0)+' '+esc(trB('fans'))+'</p>';
 else h+='<p class="battle-hint">'+esc(trB('arenaNone'))+'</p>';
 h+='<p class="battle-hint">'+esc(trB('arenaSaveHint'))+'</p>'+slotsHtml()+
   '<div class="btns"><button type="button" class="btn alt" data-battle="salvar-unit"'+(ocupado?' disabled':'')+'>'+esc(trB('arenaSave'))+'</button></div>';
 if(msg)h+='<p class="battle-error'+(msgOk?' ok':'')+'">'+esc(msg)+'</p>';
 h+='</section>';
 if(!arena.lista.length)return h+'<p class="battle-hint">'+esc(trB('arenaEmpty'))+'</p>';
 return h+arena.lista.map(function(d){
   var feito=!!d.desafiado,idols=Array.isArray(d.idols)?d.idols.slice(0,3):[];
   return '<section class="battle-rival battle-def"><h3>'+esc(trB('vsUnit').replace('{n}',d.nick))+' <span class="battle-placar">'+ico(2)+(Number(d.fas)||0)+'</span></h3>'+
     '<div class="battle-trio">'+idols.map(function(c){return idolHtml(c,false,'',-1);}).join('')+'</div>'+
     '<div class="btns"><button type="button" class="btn" data-battle="desafiar" data-nick="'+esc(d.nick)+'"'+(feito||cheio?' disabled':'')+'>'+
     esc(feito?trB('challenged'):cheio?trB('arenaLimit'):trB('challenge'))+'</button></div></section>';}).join('');
}
function rankingHtml(){
 if(!ranking||!servidor)return '';
 var top=ranking.top.slice(0,5),eu=ranking.eu&&typeof ranking.eu==='object'?ranking.eu:null;
 var h='<section class="battle-rank"><h3>'+ico(3)+esc(trB('rankTitle'))+'</h3>';
 if(!top.length)h+='<p class="battle-hint">'+esc(trB('rankEmpty'))+'</p>';
 else h+='<ol>'+top.map(function(p,i){
   return '<li><span class="battle-med m'+(i+1)+'">'+(i+1)+'</span>'+
    '<canvas class="battle-av battle-av-s" width="132" height="150" data-battle-av="'+esc(p.nick)+'" data-meu="0" aria-hidden="true"></canvas>'+
    '<b>'+esc(p.nick)+'</b><small>'+ico(3)+(Number(p.score)||0)+'</small></li>';}).join('')+'</ol>';
 if(eu&&Number(eu.pos)>0)h+='<p class="battle-rank-eu">'+esc(trB('my'))+': '+Number(eu.pos)+'º · '+ico(3)+(Number(eu.score)||0)+'</p>';
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
// Rival: um atributo fica escondido (?) até o show — o mesmo para todo mundo no mesmo dia.
function oculto(c){var t=chave(c&&c.nick)+'|'+(estado&&estado.dia||hoje()),h=0;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h%3;}
function chips(c,destaque,esconde){
 return '<span class="battle-chips">'+ATR.map(function(a,i){
   if(esconde===i)return '<i class="oculto" title="?">'+ico(i)+'?</i>';
   return '<i'+(destaque===i?' class="on"':'')+'>'+ico(i)+Number(c[a]||0)+'</i>';}).join('')+'</span>';
}
function idolHtml(c,meu,rotulo,destaque,esconde){
 return '<div class="battle-idol">'+(rotulo?'<small>'+rotulo+'</small>':'')+
   '<canvas class="battle-av" width="132" height="150" data-battle-av="'+esc(c.nick)+'" data-meu="'+(meu?1:0)+'" aria-hidden="true"></canvas>'+
   '<b>'+esc(c.nick)+'</b>'+chips(c,destaque,esconde)+(meu?'<small class="battle-skill" style="--c:'+COR[habilidade(c)]+'">✦ '+esc(trB('sk'+habilidade(c)))+'</small>':'')+
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
   area.innerHTML='<div class="battle-showhud"><b id="battleLiveRodada">'+esc(nomeRound(0))+' · 1/3</b><span>'+esc(trB('my'))+' × '+esc(trB('other'))+'</span></div>'+
    '<div class="battle-showtrack" aria-hidden="true"><i id="battleShowFill"></i></div>'+
    '<p class="battle-sr" id="battleNarra"></p><div class="btns"><button type="button" class="btn battle-agitar" data-battle="agitar">'+esc(trB('agitar'))+'</button><button type="button" class="btn alt battle-skip" data-battle="pular">'+esc(trB('skip'))+'</button></div>';
   return;
 }
 var max=Number(estado.max_tentativas)||5,usadas=Number(estado.tentativas)||0;
 var limite=servidor&&usadas>=max,emArena=naArena();
 if(emArena&&fase==='escalar'&&!alvo){area.innerHTML=abasHtml()+lobbyHtml();desenharMiniaturas();return;}
 if(emArena)limite=(Number(arena.desafios)||0)>=(Number(arena.max_desafios)||3);
 var texto=(fase==='escalar'?abasHtml():'')+(emArena?arenaStatusHtml():'<div class="battle-status'+(servidor?' real':' treino')+'">'+
  (servidor?'★ '+esc(trB('used'))+': '+Math.max(0,max-usadas)+' / '+max+
     '<br><small>'+esc(estado.premiado?trB('prizeDone'):trB('prizeOpen'))+'</small>':
    esc(trB('practice'))+(logado()?'':' '+esc(trB('guest'))))+'</div>');
 if(fase==='fim'&&rodadas){
   var wins=rodadas.filter(function(c){return c.ganhou===true;}).length,losses=3-wins;
   var cab=wins>losses?trB('win'):trB('lose');
   texto+='<section class="battle-resultado"><h3>'+esc(cab)+' <span class="battle-placar">'+wins+' × '+losses+'</span></h3>';
   texto+='<div class="battle-result-grid">'+rodadas.map(function(r,i){return '<div class="battle-round'+(r.ganhou?' win':'')+'"><b>'+ico(i)+esc(nomeRound(i))+'</b>'+
      '<span>'+esc(r.meu||unit[i])+(Number(r.bonus)>0&&torcida&&FLOR[torcida.hoje]?' <em class="battle-bonus">'+florDot(torcida.hoje)+'+1</em>':'')+' <strong>'+Number(r.eu||0)+'</strong> : <strong>'+Number(r.eles||0)+'</strong> '+esc(r.rival||'?')+'</span></div>';}).join('')+'</div>';
   texto+=ritmoResultado();
   texto+=(emArena?(wins<2&&alvo?'<p class="battle-fas">'+esc(trB('defFan').replace('{n}',alvo.nick))+'</p>':''):'<p>'+esc(servidor&&Number(estado.ultimo_premio)===5?trB('reward'):trB('noReward'))+'</p>')+
   '<button type="button" class="btn alt" data-battle="salvar">'+esc(trB('save'))+'</button> '+
   (emArena?'<button type="button" class="btn" data-battle="voltar">'+esc(trB('backArena'))+'</button></section>':
   '<button type="button" class="btn" data-battle="outra"'+(limite?' disabled':'')+'>'+esc(limite?trB('locked'):trB('again'))+'</button></section>');
   area.innerHTML=texto+(emArena?'':rankingHtml());desenharMiniaturas();return;
 }
 texto+='<section class="battle-rival"><h3>'+(emArena?esc(trB('vsUnit').replace('{n}',alvo.nick)):esc(trB('daily')))+'</h3><div class="battle-trio">'+
   (emArena?alvo.idols:estado.rival).map(function(c){return idolHtml(c,false,'',-1,oculto(c));}).join('')+
   '</div><p class="battle-hint">'+esc(trB('rivalHint'))+'</p></section>';
 texto+='<section class="battle-escalar"><h3>'+esc(trB('stage'))+'</h3><div class="battle-trio">'+
   unit.map(function(n,i){var c=cardDe(n)||{nick:n};return idolHtml(c,true,ico(i)+esc(nomeRound(i)),i);}).join('')+
   '</div><p class="battle-hint">'+esc(estado.starter?trB('none'):trB('choose'))+'</p>';
 texto+=slotsHtml()+'</section>'+torcidaHtml();
 if(msg)texto+='<p class="battle-error">'+esc(msg)+'</p>';
 texto+='<div class="btns"><button type="button" class="btn battle-start" data-battle="jogar"'+(limite||ocupado?' disabled':'')+'>'+
    esc(limite?(emArena?trB('arenaLimit'):trB('locked')):ocupado?trB('loading'):trB('play'))+'</button>'+
    (emArena?' <button type="button" class="btn alt" data-battle="voltar">'+esc(trB('backArena'))+'</button>':'')+'</div>';
 area.innerHTML=texto+(emArena?'':rankingHtml());
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
 if(naArena()&&alvo){
   // Desafio amistoso: o servidor resolve com a ordem secreta da defesa; nunca há ★.
   var desafiado=alvo;
   contaRpc('battle_desafiar',{p_alvo:desafiado.nick,p_unit:unit.slice(),p_requisicao:requisicao}).then(function(r){
     if(r&&r.ok===false&&r.erro){
       msg=r.erro==='limite'?trB('arenaLimit'):r.erro==='repetido'?trB('challenged'):(r.erro==='alvo'||r.erro==='indisponivel')?trB('arenaGone'):trB('error');
       if(r.erro!=='unit'){alvo=null;carregarArena();}
       ocupado=false;render();return;
     }
     if(!r||!r.ok||!Array.isArray(r.rodadas)||r.rodadas.length!==3)throw Error('invalid result');
     rodadas=r.rodadas;arena.desafios=Number(r.desafios)||0;desafiado.desafiado=true;estado.ultimo_premio=0;
     if(window.TWVidaCidade)window.TWVidaCidade.registrar('battle',{id:'arena/'+String(r.dia||'')+'/'+String(r.desafios||'')});
     ocupado=false;comecarShow();
   }).catch(function(){msg=trB('error');ocupado=false;render();});
   return;
 }
 contaRpc('battle_jogar',{p_unit:unit.slice(),p_requisicao:requisicao}).then(function(r){
   if(!r||!r.ok||!Array.isArray(r.rodadas)||r.rodadas.length!==3)throw Error('invalid result');
   rodadas=r.rodadas;estado.tentativas=Number(r.tentativas);estado.ultimo_premio=Number(r.premio)||0;
   if(estado.ultimo_premio===5)estado.premiado=true;
   if(window.TWVidaCidade)window.TWVidaCidade.registrar('battle',{id:String(r.dia||'')+'/'+String(r.tentativas||'')});if(typeof twMissoesAtualizar==='function')twMissoesAtualizar();
   if(estado.ultimo_premio===5&&typeof r.stars==='number'&&typeof starT!=='undefined'){
     starT=r.stars;try{localStorage.setItem('brs48cr_st',starT);}catch(e){}
     if(typeof setBest==='function')try{setBest();}catch(e){}
   }
   ocupado=false;comecarShow();carregarRanking();
 }).catch(function(){msg=trB('error');ocupado=false;render();});
}

/* ---------- Show no palco ---------- */
// Sons do próprio jogo (sfx respeita o mudo); se não existirem, o show segue em silêncio.
var showSom=-1;
var SOM_NOVO={star:'ponto',hit:'perdeu',rank:'vitoria',over:'perdeu',photo:'flash'};
function som(k){try{if(typeof twJogoSom==='function'&&SOM_NOVO[k])return twJogoSom(SOM_NOVO[k]);if(typeof sfx!=='undefined'&&sfx&&typeof sfx[k]==='function')sfx[k]();}catch(e){}}
var ritmo=null,BATIDA=.5,BAT0=.25;
function batidas(){return Math.floor((DUR*3-BAT0)/BATIDA)+1;}
function agitar(){
 if(fase!=='show'||!ritmo)return;
 var t=agora()-showT0,b=Math.round((t-BAT0)/BATIDA),d=Math.abs(t-(BAT0+b*BATIDA));
 if(b<0||b>=batidas())return;
 if(d<.14&&!ritmo.pegas[b]){ritmo.pegas[b]=d<.07?2:1;ritmo.n++;ritmo.combo=(ritmo.combo||0)+1;ritmo.festa.push({t:t,b:ritmo.pegas[b]});
   try{if(typeof twJogoSom==='function')twJogoSom('toque');}catch(e){}
   ritmo.cor+=ritmo.pegas[b];
   var ri=Math.min(2,Math.floor(t/DUR)),cd=cardDe(unit[ri]);
   if(ritmo.combo>=3&&!ritmo.sk[ri]&&cd){var hb=habilidade(cd),ganho=5+(hb===ri?3:0);
     ritmo.sk[ri]={t:t,h:hb,g:ganho,match:hb===ri};ritmo.skN++;ritmo.cor+=ganho;
     try{if(typeof twJogoSom==='function')twJogoSom('ponto');}catch(e){}}}
 else{ritmo.erros++;ritmo.combo=0;}
 var bt=ov&&ov.querySelector('[data-battle="agitar"]');if(bt){bt.classList.remove('pulsa');void bt.offsetWidth;bt.classList.add('pulsa');}
}
function ritmoDesenhar(x,t){
 if(!ritmo)return;
 // Combo: o anel que fecha na batida fica no centro, e o número é quantos acertos seguidos no ritmo (errar a batida zera)
 var fase2=((t-BAT0)%BATIDA+BATIDA)%BATIDA/BATIDA,perto=Math.min(fase2,1-fase2),cx=SW/2,cy=SH-118,cb=ritmo.combo||0;
 medidor(x,cx,cy,34,cb?(cb%10)/10||1:0,['#ffd23f','#b6ff3b','#4dd8ff','#ff6fb5'][Math.floor(cb/10)%4],String(cb),trB('combo'));
 x.save();x.strokeStyle=perto<.14?'#b6ff3b':'rgba(255,255,255,'+(.9-perto).toFixed(2)+')';x.lineWidth=4;
 x.beginPath();x.arc(cx,cy,42+(1-fase2)*22,0,Math.PI*2);x.stroke();   // anel que fecha na batida
 // contador de corações da torcida (ao lado do Combo)
 x.save();x.font=fonte(16);var ct='♥ '+(ritmo.cor||0),cw=x.measureText(ct).width+24;var hx0=Math.max(48,cw/2+8),hy0=SH-34;rrect(x,hx0-cw/2,hy0-15,cw,30,15);x.fillStyle='rgba(255,255,255,.95)';x.fill();
 x.fillStyle='#ff4f9a';x.textAlign='center';x.textBaseline='middle';x.fillText(ct,hx0,hy0+1);x.font=fonte(10);x.textBaseline='alphabetic';contorno(x,trB('coracoes'),Math.max(64,hx0),hy0-22,'#fff');x.restore();
 // habilidade disparada: a carta da vez brilha, faixa com o nome e uma chuva de corações saindo dela
 [0,1,2].forEach(function(ri){var k=ritmo.sk[ri];if(!k)return;var u=(t-k.t)/1.4;if(u<0||u>1)return;
   var hx=SW/2+(ri-1)*96,hy=SH-60,cor=COR[k.h];
   x.save();x.globalAlpha=Math.min(1,(1-u)*3);x.strokeStyle=cor;x.lineWidth=6;x.shadowColor=cor;x.shadowBlur=22;rrect(x,hx-36,hy-62,72,98,10);x.stroke();x.restore();
   for(var q=0;q<10;q++){var an=-Math.PI/2+(q-4.5)*.22,dd=20+u*150;coracao(x,hx+Math.cos(an)*dd,hy-40+Math.sin(an)*dd,6+(q%3)*2,q%2?cor:'#ff6fb5',1-u);}
   var e2=Math.min(1,u/.15),sc=.6+.4*(1-Math.pow(1-e2,3));
   x.save();x.globalAlpha=Math.min(1,(1-u)*3);x.translate(SW/2,300);x.scale(sc,sc);
   var g=x.createLinearGradient(-170,0,170,0);g.addColorStop(0,cor);g.addColorStop(1,'#7b3ff0');rrect(x,-170,-30,340,60,30);x.fillStyle=g;x.fill();x.strokeStyle='#fff';x.lineWidth=4;x.stroke();
   x.textAlign='center';x.font=fonte(13);contorno(x,trB('skill')+' '+(k.match?'· '+trB('skMatch'):''),0,-8,'#fff3a8');
   x.font=fonte(20);contorno(x,'✦ '+trB('sk'+k.h)+'  +'+k.g+' ♥',0,18,'#fff');x.restore();});
 ritmo.festa=ritmo.festa.filter(function(f){var u=(t-f.t)/1.1;if(u>1)return false;   // corações e lightsticks que sobem a cada acerto
   for(var k=0;k<(f.b===2?7:4);k++){var px=60+((k*97+Math.round(f.t*50))%(SW-120)),py=SH-150-u*140-(k%3)*8;
     if(k%2)coracao(x,px,py,8,['#ff6fb5','#ffd23f'][k%4>1?1:0],1-u);
     else{x.globalAlpha=1-u;x.strokeStyle=['#ff6fb5','#b6ff3b','#4dd8ff','#ffe14d'][k%4];x.lineWidth=5;x.lineCap='round';
       x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.sin(u*9+k)*7,py-16);x.stroke();}}
   return true;});
 x.restore();
}
function ritmoResultado(){
 if(!ritmo||(!ritmo.n&&!ritmo.erros))return '';
 var tot=batidas(),pc=ritmo.n/tot,frase=pc>=.75?trB('ritmoTop'):pc>=.35?trB('ritmoOk'):trB('ritmoPouco');
 return '<p class="battle-ritmo">'+esc(trB('ritmo').replace('{n}',ritmo.n).replace('{t}',tot))+' · '+esc(frase)+'</p>'+
   '<p class="battle-ritmo battle-skillres">'+esc(trB('skillRes').replace('{n}',ritmo.skN||0).replace('{c}',ritmo.cor||0))+'</p>';
}
function pararShow(){if(showRaf){cancelAnimationFrame(showRaf);showRaf=0;}}
function comecarShow(){
 if(!ov||ov.hidden||!rodadas)return;
 pararShow();
 if(calmo()||typeof requestAnimationFrame!=='function'){fimDoShow();return;}
 fase='show';showT0=agora();showSom=-1;ritmo={n:0,erros:0,pegas:{},festa:[],cor:0,sk:{},skN:0};render();
 (function quadro(){
   showRaf=0;if(!ov||ov.hidden||fase!=='show')return;
   var t=agora()-showT0;
   if(t>=DUR*3+.15){fimDoShow();return;}
   var ri=Math.min(2,Math.floor(t/DUR));
   var live=ov.querySelector('#battleLiveRodada'),progresso=ov.querySelector('#battleShowFill');
   if(live&&live.getAttribute('data-ri')!==String(ri)){
     live.setAttribute('data-ri',String(ri));live.textContent=nomeRound(ri)+' · '+(ri+1)+'/3';
   }
   if(progresso)progresso.style.width=Math.min(100,t/(DUR*3)*100).toFixed(1)+'%';
   if(ri>showSom&&t-ri*DUR>1.3){showSom=ri;som(rodadas[ri].ganhou?'star':'hit');
     // quem usa leitor de tela acompanha o placar de cada rodada (a área é aria-live)
     var nr=ov.querySelector('#battleNarra'),rr=rodadas[ri];
     if(nr)nr.textContent=nomeRound(ri)+': '+(rr.meu||unit[ri])+' '+Number(rr.eu||0)+' × '+Number(rr.eles||0)+' '+(rr.rival||'');
   }
   desenharPalco(t);showRaf=requestAnimationFrame(quadro);
 })();
}
function fimDoShow(){
 if(!rodadas)return;
 pararShow();fase='fim';render();desenharPalco(-1);desenharPolaroid();
 som(rodadas.filter(function(r){return r.ganhou;}).length>=2?'rank':'over');
 var st=ov.querySelector('#battleStage');
 if(st){var w=rodadas.filter(function(r){return r.ganhou;}).length;st.setAttribute('aria-label','Idol⭐Battle! '+w+' × '+(3-w));}
}
/* Palco no formato de Live (inspirado no Link! Like!, com desenho próprio do TsuLiPa):
   arco de progresso com estrelas no topo, placar de Brilho, cenário de salão com telão, guirlanda de flores
   e chão de madeira, a unit inteira no palco, o card de quem se apresenta entrando pela lateral,
   medidores redondos (você · Combo da torcida · rival) e a "mão" com os 3 cards da unit.
   Tudo só ENCENA o resultado que já veio do servidor: nada aqui decide ponto ou prêmio. */
var ARCO={cx:SW/2,cy:700,r:680};
function arcoAng(p){var a0=Math.acos((SW/2-40)/ARCO.r);return Math.PI+a0+(Math.PI-2*a0)*p;}   // p 0→1 da esquerda para a direita
function arcoXY(p,dr){var a=arcoAng(p),r=ARCO.r+(dr||0);return [ARCO.cx+Math.cos(a)*r,ARCO.cy+Math.sin(a)*r];}
function arcoProgresso(x,prog,feitas){
 x.save();x.lineCap='round';
 x.strokeStyle='rgba(255,255,255,.95)';x.lineWidth=22;x.beginPath();x.arc(ARCO.cx,ARCO.cy,ARCO.r,arcoAng(0),arcoAng(1));x.stroke();
 for(var i=0;i<3;i++){
   var a=arcoAng(i/3)+.004,b=arcoAng((i+1)/3)-.004,cheio=Math.max(0,Math.min(1,prog*3-i));
   x.lineCap='butt';x.lineWidth=13;x.strokeStyle='rgba(120,90,180,.22)';x.beginPath();x.arc(ARCO.cx,ARCO.cy,ARCO.r,a,b);x.stroke();
   if(cheio>0){x.strokeStyle=COR[i];x.beginPath();x.arc(ARCO.cx,ARCO.cy,ARCO.r,a,a+(b-a)*cheio);x.stroke();
     // tracinhos como os do medidor deles
     x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=2;
     for(var s=0;s<cheio*14;s++){var an=a+(b-a)*(s/14),p1=[ARCO.cx+Math.cos(an)*(ARCO.r-6),ARCO.cy+Math.sin(an)*(ARCO.r-6)],p2=[ARCO.cx+Math.cos(an)*(ARCO.r+6),ARCO.cy+Math.sin(an)*(ARCO.r+6)];
       x.beginPath();x.moveTo(p1[0],p1[1]);x.lineTo(p2[0],p2[1]);x.stroke();}
     x.lineWidth=13;}
 }
 // estrela no fim de cada apresentação: acesa (verde) se ganhou, rosa se perdeu
 for(var k=0;k<3;k++){
   var q=arcoXY((k+1)/3,-1),r0=rodadas[k],feita=k<feitas;
   x.fillStyle='#fff';x.strokeStyle=feita?(r0.ganhou?'#7cc400':'#ff6fb5'):'#d9c8ff';x.lineWidth=3;
   x.beginPath();x.arc(q[0],q[1],15,0,Math.PI*2);x.fill();x.stroke();
   estrela(x,q[0],q[1]+1,9,feita?(r0.ganhou?'#ffcf1f':'#ff9ccc'):'#e6dcff');
 }
 x.restore();
}
function estrela(x,cx,cy,r,cor){
 x.save();x.fillStyle=cor;x.beginPath();
 for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}
 x.closePath();x.fill();x.restore();
}
function rrect(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath();}
function placarBrilho(x,valor){
 var txt=String(Math.max(0,Math.round(valor))).padStart(6,'0');
 x.save();rrect(x,SW/2-74,42,148,46,12);x.fillStyle='#2b1d4a';x.fill();x.strokeStyle='#ffb347';x.lineWidth=3;x.stroke();
 x.font=fonte(22);x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.fillText(txt,SW/2,60);
 x.font=fonte(10);x.fillStyle='#ff9ccc';x.fillText(trB('brilho'),SW/2,79);
 x.restore();
}
function fundoPalco(x,cor,t){
 // parede do salão
 var g=x.createLinearGradient(0,0,0,SH);g.addColorStop(0,'#fbf6ff');g.addColorStop(.45,'#e9dcff');g.addColorStop(1,'#d6c3fb');
 x.fillStyle=g;x.fillRect(0,0,SW,SH);
 // faixas diagonais suaves (ornamento do fundo)
 x.save();x.globalAlpha=.18;x.fillStyle=cor;
 [[380,40],[430,18]].forEach(function(f){x.beginPath();x.moveTo(f[0],0);x.lineTo(f[0]+f[1],0);x.lineTo(f[0]+f[1]-200,SH);x.lineTo(f[0]-200,SH);x.closePath();x.fill();});
 x.restore();
 // telão com arco-íris de giz e estrelinhas
 rrect(x,70,118,420,170,16);x.fillStyle='#d8b98c';x.fill();
 rrect(x,78,126,404,154,10);var tg=x.createLinearGradient(0,126,0,280);tg.addColorStop(0,'#2d1b5e');tg.addColorStop(1,'#3e2a7c');x.fillStyle=tg;x.fill();
 x.save();rrect(x,78,126,404,154,10);x.clip();
 ['#ff8fb8','#ffc56b','#fff38a','#a6ef6b','#7fd3ff','#b69bff'].forEach(function(c,i){
   x.strokeStyle=c;x.globalAlpha=.55;x.lineWidth=7;x.lineCap='round';x.beginPath();x.arc(SW/2,292,118-i*9,Math.PI*1.08,Math.PI*1.92);x.stroke();});
 x.globalAlpha=1;
 for(var s=0;s<11;s++){var px=96+(s*71)%370,py=140+(s*37)%110,a=.35+.55*Math.abs(Math.sin(t*1.6+s));estrela(x,px,py,4+(s%3),'rgba(255,255,255,'+a.toFixed(2)+')');}
 x.restore();
 // guirlanda de flores com bandeirinhas
 x.save();x.strokeStyle='#7cc46a';x.lineWidth=3;x.beginPath();x.moveTo(40,112);x.quadraticCurveTo(SW/2,148,SW-40,112);x.stroke();
 for(var b=0;b<12;b++){var u=(b+.5)/12,bx=40+(SW-80)*u,by=112+Math.sin(u*Math.PI)*18;
   x.fillStyle=['#ff6fb5','#4dd8ff','#ffe14d','#b6ff3b'][b%4];x.beginPath();x.moveTo(bx-9,by);x.lineTo(bx+9,by);x.lineTo(bx,by+15);x.closePath();x.fill();}
 for(var f=0;f<7;f++){var v=f/6,fx=40+(SW-80)*v,fy=112+Math.sin(v*Math.PI)*18,fc=['#ff5d8f','#4a7dff','#ffd23f','#7b3ff0','#ff8a3d','#3cb043','#ff6fb5'][f];
   for(var p=0;p<6;p++){var an=p/6*Math.PI*2+t*.4;x.fillStyle=fc;x.beginPath();x.arc(fx+Math.cos(an)*7,fy+Math.sin(an)*7,6,0,Math.PI*2);x.fill();}
   x.fillStyle='#fff6d0';x.beginPath();x.arc(fx,fy,4.5,0,Math.PI*2);x.fill();}
 x.restore();
 // chão de madeira em perspectiva
 var fg=x.createLinearGradient(0,300,0,SH);fg.addColorStop(0,'#e9b97c');fg.addColorStop(1,'#c98a4b');
 x.fillStyle=fg;x.fillRect(0,300,SW,SH-300);
 x.save();x.strokeStyle='rgba(120,70,30,.28)';x.lineWidth=1.5;
 for(var l=-8;l<=8;l++){x.beginPath();x.moveTo(SW/2+l*16,300);x.lineTo(SW/2+l*70,SH);x.stroke();}
 [318,342,372,410,456].forEach(function(y){x.beginPath();x.moveTo(0,y);x.lineTo(SW,y);x.stroke();});
 x.restore();
 // holofotes na cor da apresentação
 x.save();x.globalCompositeOperation='lighter';
 [[150,-.18],[410,.18]].forEach(function(h,i){var bal=Math.sin(t*1.3+i*2)*.07,lg=x.createLinearGradient(h[0],0,h[0],380);
   lg.addColorStop(0,cor);lg.addColorStop(1,'rgba(255,255,255,0)');x.globalAlpha=.16;x.fillStyle=lg;x.beginPath();
   x.moveTo(h[0]+(h[1]+bal)*300-14,0);x.lineTo(h[0]+(h[1]+bal)*300+14,0);x.lineTo(h[0]+90,380);x.lineTo(h[0]-90,380);x.closePath();x.fill();});
 x.restore();
}
function coracao(x,cx,cy,r,cor,a){
 x.save();x.globalAlpha=a;x.fillStyle=cor;x.translate(cx,cy);x.beginPath();x.moveTo(0,r*.9);
 x.bezierCurveTo(-r*1.4,-r*.1,-r*.7,-r*1.1,0,-r*.35);x.bezierCurveTo(r*.7,-r*1.1,r*1.4,-r*.1,0,r*.9);x.fill();
 x.globalAlpha=a*.6;x.fillStyle='#fff';x.beginPath();x.arc(-r*.38,-r*.38,r*.2,0,Math.PI*2);x.fill();x.restore();
}
function coracoes(x,t,quantos){   // corações que sobem do chão (posições fixas: nada sorteado)
 for(var k=0;k<quantos;k++){var ciclo=1.6,u=((t+k*.37)%ciclo)/ciclo,cx=60+(k*113)%(SW-120)+Math.sin(u*6+k)*10,cy=372-u*170;
   coracao(x,cx,cy,9+(k%3)*2,['#c9b3ff','#9ec9ff','#ffb3d9'][k%3],(1-u)*.8);}
}
function cartaMini(x,nick,i,cx,cy,w,h,o){   // card da unit desenhado no próprio palco
 o=o||{};var c=cardDe(nick)||{nick:nick},v=valor(c,i);
 x.save();x.translate(cx,cy);if(o.ang)x.rotate(o.ang);
 if(o.brilho){x.shadowColor=o.brilho;x.shadowBlur=18;}
 rrect(x,-w/2,-h/2,w,h,8);x.fillStyle='#fff';x.fill();x.shadowBlur=0;
 rrect(x,-w/2+3,-h/2+3,w-6,h-6,6);var g=x.createLinearGradient(0,-h/2,0,h/2);g.addColorStop(0,COR[i]);g.addColorStop(1,'#7b3ff0');x.fillStyle=g;x.fill();
 x.save();rrect(x,-w/2+3,-h/2+3,w-6,h-6,6);x.clip();
 x.globalAlpha=.35;x.fillStyle='#fff';for(var d=-2;d<4;d++){x.beginPath();x.moveTo(-w/2+d*w/3,-h/2);x.lineTo(-w/2+d*w/3+10,-h/2);x.lineTo(-w/2+d*w/3-30,h/2);x.lineTo(-w/2+d*w/3-40,h/2);x.fill();}
 x.globalAlpha=1;desenharIdol(x,nick,true,0,h/2-h*.14,h/62,o.t||0,{semPose:true});x.restore();
 // número do atributo no canto (como o custo das cartas deles) e o nome embaixo
 x.fillStyle='#fff';x.beginPath();x.arc(-w/2+11,-h/2+11,10,0,Math.PI*2);x.fill();
 x.font=fonte(12);x.textAlign='center';x.textBaseline='middle';x.fillStyle='#432675';x.fillText(String(v||'?'),-w/2+11,-h/2+12);
 x.font=fonte(Math.max(9,Math.round(w/7)));x.textBaseline='alphabetic';contorno(x,nomeCurto(nick,8),0,h/2-6,'#fff');
 if(o.apagado){rrect(x,-w/2,-h/2,w,h,8);x.fillStyle='rgba(40,20,80,.35)';x.fill();}
 x.restore();
}
function medidor(x,cx,cy,r,frac,cor,txt,rot){
 x.save();
 x.fillStyle='#fff';x.beginPath();x.arc(cx,cy,r+7,0,Math.PI*2);x.fill();
 x.strokeStyle='#2b1d4a';x.lineWidth=r*.42;x.beginPath();x.arc(cx,cy,r*.72,0,Math.PI*2);x.stroke();
 x.strokeStyle=cor;x.lineCap='butt';x.beginPath();x.arc(cx,cy,r*.72,-Math.PI/2,-Math.PI/2+Math.PI*2*Math.max(0,Math.min(1,frac)));x.stroke();
 x.font=fonte(Math.round(r*.62));x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';
 x.lineJoin='round';x.strokeStyle='#2b1d4a';x.lineWidth=4;x.strokeText(txt,cx,cy+1);x.fillText(txt,cx,cy+1);
 x.font=fonte(11);x.textBaseline='alphabetic';contorno(x,rot,cx,cy-r-12,'#fff');
 x.restore();
}
function maoDeCards(x,ativo,feitas,tt){   // a "mão" com os 3 cards da unit; o da vez sobe e brilha
 x.save();var fy=SH-6;rrect(x,-10,SH-82,SW+20,90,22);x.fillStyle='rgba(43,29,74,.82)';x.fill();x.restore();
 unit.forEach(function(n,i){
   var sel=i===ativo,cx=SW/2+(i-1)*96,cy=SH-44-(sel?14:0)+(sel?Math.sin(tt*4)*2:0);
   cartaMini(x,n,i,cx,cy,64,90,{ang:(i-1)*.08,brilho:sel?'#b6ff3b':null,apagado:i<feitas&&!rodadas[i].ganhou,t:tt});
 });
}
function pontos(x,ate){arcoProgresso(x,ate/3,ate);}
function contorno(x,txt,px,py,cor){
 x.lineJoin='round';x.strokeStyle='rgba(30,10,70,.85)';x.lineWidth=5;x.strokeText(txt,px,py);x.fillStyle=cor||'#fff';x.fillText(txt,px,py);
}
function brilhoAte(tt){   // placar de Brilho: soma dos seus pontos já mostrados (o mesmo número que veio do servidor)
 var s=0;for(var k=0;k<3;k++){var u=tt-k*DUR;if(u<=.4)break;s+=Number(rodadas[k].eu||0)*Math.min(1,(u-.4)/.8);}return s*1000;
}
function desenharPalco(t){
 var cv=ov&&ov.querySelector('#battleStage'),x=cv&&cv.getContext&&cv.getContext('2d');if(!x||!rodadas)return;
 var fim=t<0,tt=fim?agora():t;
 x.setTransform(cv.width/SW,0,0,cv.height/SH,0,0);x.clearRect(0,0,SW,SH);
 x.textAlign='center';x.textBaseline='alphabetic';
 if(fim){
   var wins=rodadas.filter(function(r){return r.ganhou;}).length,venceu=wins>=2;
   fundoPalco(x,venceu?'#ffe14d':'#b8a3ff',0);
   if(venceu)for(var k=0;k<34;k++){x.fillStyle=['#ff6fb5','#b6ff3b','#4dd8ff','#ffe14d','#7b3ff0'][k%5];
     x.save();x.translate((k*89+40)%SW,120+(k*47)%170);x.rotate(k);x.fillRect(-3,-1.5,6,3);x.restore();}
   coracoes(x,1.2,venceu?9:3);
   unit.forEach(function(n,i){desenharIdol(x,n,true,SW/2+(i-1)*130,372-(i===1?0:6),3,0,{expr:venceu?3:null});
     x.font=fonte(15);contorno(x,nomeCurto(n,10),SW/2+(i-1)*130,400);});
   arcoProgresso(x,1,3);
   placarBrilho(x,brilhoAte(DUR*3));
   x.font=fonte(30);contorno(x,venceu?trB('win'):trB('lose'),SW/2,150,venceu?'#fff3a8':'#fff');
   x.font=fonte(24);contorno(x,wins+' × '+(3-wins),SW/2,186);
   maoDeCards(x,-1,3,0);
   return;
 }
 var i=Math.min(2,Math.floor(tt/DUR)),u=tt-i*DUR,r=rodadas[i];
 fundoPalco(x,COR[i],tt);
 arcoProgresso(x,Math.min(1,tt/(DUR*3)),i);
 placarBrilho(x,brilhoAte(tt));
 x.font=fonte(15);rotulo(x,i,nomeRound(i)+'  '+(i+1)+'/3',SW/2,168,15,'#fff');
 // o resto da unit dança atrás, e a dupla da rodada fica na frente
 unit.forEach(function(n,k){if(k===i)return;var bx=k===(i+1)%3?62:268;
   desenharIdol(x,n,true,bx,322,1.7,tt+k,{bob:-Math.abs(Math.sin(tt*6+k))*3});});
 var entra=Math.min(1,u/.35),e=1-Math.pow(1-entra,3);
 var conta=Math.max(0,Math.min(1,(u-.4)/.8)),veredito=u>1.3;
 var mx=170-(1-e)*220,rx=400+(1-e)*220;
 var pulo=function(ganhou){return veredito?(ganhou?-Math.abs(Math.sin((u-1.3)*9))*10:0):-Math.abs(Math.sin(tt*7))*3;};
 desenharIdol(x,r.meu||unit[i],true,mx,372,2.8,tt,{bob:pulo(r.ganhou),apagado:veredito&&!r.ganhou,expr:veredito&&r.ganhou?3:null,semPose:!veredito});
 desenharIdol(x,r.rival,false,rx,372,2.8,tt,{bob:pulo(!r.ganhou),apagado:veredito&&r.ganhou,vira:true,expr:veredito&&!r.ganhou?3:null,semPose:!veredito});
 x.font=fonte(14);contorno(x,nomeCurto(r.meu||unit[i]),mx,392);contorno(x,nomeCurto(r.rival),rx,392,'#d9f3ff');
 coracoes(x,tt,u>.4?6:2);
 if(u>.4){
   var a=Math.round(Number(r.eu||0)*conta),b=Math.round(Number(r.eles||0)*conta);
   x.font=fonte(veredito&&r.ganhou?54:44);contorno(x,String(a),SW/2-48,222,veredito&&r.ganhou?'#fff3a8':'#fff');
   x.font=fonte(veredito&&!r.ganhou?54:44);contorno(x,String(b),SW/2+48,222,veredito&&!r.ganhou?'#fff3a8':'#fff');
   x.font=fonte(22);contorno(x,':',SW/2,212);
 }
 if(u>.4&&Number(r.bonus)>0&&torcida&&FLOR[torcida.hoje]){x.fillStyle=FLOR[torcida.hoje][0];x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(SW/2-62,166,6.5,0,Math.PI*2);x.fill();x.stroke();x.font=fonte(15);contorno(x,'+1',SW/2-42,171,'#ffd9f0');}
 if(veredito){
   var wx=r.ganhou?mx:rx,s=1+Math.max(0,.5-(u-1.3))*1.2;
   x.save();x.translate(wx,262);x.scale(s,s);x.font=fonte(22);contorno(x,'★ WIN ★',0,0,'#fff3a8');x.restore();
   var ef=u-1.3;if(ef>=0&&ef<.9){x.save();for(var k2=0;k2<12;k2++){var an=k2/12*Math.PI*2+i*.4,rr=26+ef*110;
     x.globalAlpha=1-ef/.9;x.fillStyle=k2%3===0?'#b6ff3b':k2%3===1?'#fff3a8':'#ff6fb5';
     x.beginPath();x.arc(wx+Math.cos(an)*rr,320+Math.sin(an)*rr*.7,3.4*(1-ef/.9)+1.2,0,Math.PI*2);x.fill();}x.restore();}
 }
 // medidores: os seus pontos da rodada · Combo (a torcida no ritmo) · os pontos do rival
 var maxR=Math.max(1,Number(r.eu||0),Number(r.eles||0));
 medidor(x,58,SH-118,30,Number(r.eu||0)*conta/maxR,'#ff6fb5',String(Math.round(Number(r.eu||0)*conta)),trB('my'));
 medidor(x,SW-58,SH-118,30,Number(r.eles||0)*conta/maxR,'#4dd8ff',String(Math.round(Number(r.eles||0)*conta)),trB('other'));
 maoDeCards(x,i,i,tt);
 // o card de quem se apresenta entra deslizando pela direita (o "corte" das cartas)
 if(u<1.15){var ent=u<.3?u/.3:u>.85?Math.max(0,1-(u-.85)/.3):1,ez=1-Math.pow(1-ent,3);
   cartaMini(x,r.meu||unit[i],i,SW+60-ez*130,250,92,128,{brilho:'#ff6fb5',t:tt});}
 if(fase==='show')ritmoDesenhar(x,tt);
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
 x.font=fonte(15);contorno(x,wins+' × '+(3-wins),W/2,92,venceu?'#fff3a8':'#fff');
 unit.forEach(function(n,i){
   desenharIdol(x,n,true,W/2+(i-1)*150,284,3,0,{expr:venceu?3:null});
   x.font=fonte(12);rotulo(x,i,nomeCurto(n),W/2+(i-1)*150,308,12);
 });
 x.restore();
 x.fillStyle='#48306e';x.font=fonte(15);x.textAlign='center';
 x.fillText(trB('yourUnit')+' · '+(naArena()&&alvo?trB('vsUnit').replace('{n}',nomeCurto(alvo.nick)):trB('daily'))+' · '+dataBonita(estado.dia),W/2,H-52);
 x.font=fonte(11);x.fillStyle='#8a6cc0';x.fillText('TsuLiPa⭐World',W/2,H-26);
}
function salvar(){
 var cv=ov&&ov.querySelector('#battleFoto');if(!cv||!rodadas)return;
 som('photo');
 var a=document.createElement('a');a.download='idol-battle-'+String(estado.dia||hoje())+'.png';a.href=cv.toDataURL('image/png');
 document.body.appendChild(a);a.click();a.remove();
}
window.TW_BATTLE_ON=true;window.battleAbrir=abrir;window.TW_BATTLE_TR=T;
})();
