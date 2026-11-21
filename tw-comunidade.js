/* TsuLiPa⭐World · comunidade (21/11/2026 · PR das melhorias, itens 2, 5, 6 e 8).
   - Convite com prêmio: link pessoal ?convite=CODIGO. O código fica guardado no aparelho até a pessoa entrar com
     Google; aí o convite é aceito, e quando ela termina a primeira corrida as duas ganham ★30 (servidor:
     convite_meu / convite_aceitar / convite_conferir).
   - Concurso de visual da semana: tema por semana, inscrição do visual salvo, até 3 votos, prêmio de ★50 para quem
     teve mais votos (concurso_estado / concurso_inscrever / concurso_votar / concurso_resgatar).
   - Chamado para voltar: instalar o site como app e lembrete do Show de sábado na agenda do celular (.ics semanal).
   - Visitante que salva ou compartilha uma foto (evento "tw-foto-salva", de tw-marca.js) recebe, uma vez por visita,
     o convite para criar a conta e guardar o Idol.
   Atalhos no Menu (tw-celular.js): [data-twk="convite"|"concurso"|"instalar"|"lembrete"]. */
(function(){
  'use strict';
  var CHAVE_CONVITE = 'tw_convite_pendente';
  var TXT = {
    convite:{pt:'Convidar amigos',en:'Invite friends',es:'Invitar amigos',id:'Undang teman',th:'ชวนเพื่อน',ja:'友だちを招待'},
    conviteTxt:{pt:'Mande o seu link. Quando a pessoa criar a conta e terminar a primeira corrida, vocês duas ganham ★{p}.',en:'Send your link. When they create an account and finish their first run, you both get ★{p}.',es:'Envía tu enlace. Cuando la persona cree su cuenta y termine su primera carrera, las dos ganan ★{p}.',id:'Kirim tautanmu. Saat temanmu membuat akun dan menyelesaikan lari pertama, kalian berdua dapat ★{p}.',th:'ส่งลิงก์ของคุณ เมื่อเพื่อนสร้างบัญชีและวิ่งรอบแรกจบ ทั้งสองคนจะได้ ★{p}',ja:'リンクを送ろう。相手がアカウントを作って最初のランを終えると、二人とも★{p}もらえます。'},
    conviteConta:{pt:'{a} aceitaram · {b} já valeram prêmio',en:'{a} accepted · {b} already rewarded',es:'{a} aceptaron · {b} ya dieron premio',id:'{a} menerima · {b} sudah dapat hadiah',th:'ตอบรับ {a} · ได้รางวัลแล้ว {b}',ja:'参加 {a}人 · 報酬済み {b}人'},
    copiar:{pt:'Copiar link',en:'Copy link',es:'Copiar enlace',id:'Salin tautan',th:'คัดลอกลิงก์',ja:'リンクをコピー'},
    compartilhar:{pt:'Compartilhar',en:'Share',es:'Compartir',id:'Bagikan',th:'แชร์',ja:'シェア'},
    copiado:{pt:'Link copiado!',en:'Link copied!',es:'¡Enlace copiado!',id:'Tautan disalin!',th:'คัดลอกลิงก์แล้ว!',ja:'リンクをコピーしました！'},
    conviteMsg:{pt:'Vem jogar comigo no TsuLiPa⭐World! Entrando por este link, a gente ganha estrelas:',en:'Come play TsuLiPa⭐World with me! Join with this link and we both get stars:',es:'¡Ven a jugar TsuLiPa⭐World conmigo! Entrando por este enlace, ganamos estrellas:',id:'Ayo main TsuLiPa⭐World bareng! Masuk lewat tautan ini dan kita dapat bintang:',th:'มาเล่น TsuLiPa⭐World กัน! เข้าผ่านลิงก์นี้แล้วเราได้ดาวทั้งคู่:',ja:'TsuLiPa⭐Worldで一緒に遊ぼう！このリンクから入ると二人ともスターがもらえるよ：'},
    aceito:{pt:'Você entrou pelo convite de {n}! Termine uma corrida no Center⭐Run! e vocês duas ganham ★{p}.',en:'You joined through {n}\'s invite! Finish a Center⭐Run! run and you both get ★{p}.',es:'¡Entraste por la invitación de {n}! Termina una carrera en Center⭐Run! y las dos ganan ★{p}.',id:'Kamu masuk lewat undangan {n}! Selesaikan satu lari Center⭐Run! dan kalian berdua dapat ★{p}.',th:'คุณเข้ามาผ่านคำชวนของ {n}! วิ่ง Center⭐Run! ให้จบหนึ่งรอบ แล้วทั้งคู่จะได้ ★{p}',ja:'{n}さんの招待で参加しました！Center⭐Run!を1回走りきると二人とも★{p}もらえます。'},
    pago:{pt:'Convite completo: você e {n} ganharam ★{p}!',en:'Invite complete: you and {n} got ★{p}!',es:'Invitación completa: ¡tú y {n} ganaron ★{p}!',id:'Undangan selesai: kamu dan {n} dapat ★{p}!',th:'คำชวนสำเร็จ: คุณกับ {n} ได้ ★{p}!',ja:'招待達成：あなたと{n}さんに★{p}！'},
    conviteVisit:{pt:'Você chegou por um convite! Entre com Google para as duas ganharem estrelas.',en:'You came through an invite! Sign in with Google so you both get stars.',es:'¡Llegaste por una invitación! Entra con Google para que las dos ganen estrellas.',id:'Kamu datang lewat undangan! Masuk dengan Google agar kalian berdua dapat bintang.',th:'คุณมาจากคำชวน! เข้าสู่ระบบด้วย Google เพื่อให้ทั้งคู่ได้ดาว',ja:'招待から来てくれました！Googleでログインすると二人ともスターがもらえます。'},
    concurso:{pt:'Concurso de visual',en:'Outfit contest',es:'Concurso de look',id:'Kontes gaya',th:'ประกวดลุค',ja:'コーデコンテスト'},
    concursoTxt:{pt:'Inscreva o seu visual e vote em até {v} visuais de outras pessoas. Quem tiver mais votos ganha ★{p} e a insígnia Look da semana.',en:'Enter your outfit and vote for up to {v} others. Most votes wins ★{p} and the Look of the week badge.',es:'Inscribe tu look y vota hasta {v} looks de otras personas. Quien tenga más votos gana ★{p} y la insignia Look de la semana.',id:'Daftarkan gayamu dan pilih sampai {v} gaya orang lain. Suara terbanyak menang ★{p} dan lencana Gaya minggu ini.',th:'ส่งลุคของคุณและโหวตให้คนอื่นได้ {v} ลุค คนที่ได้โหวตมากที่สุดได้ ★{p} และเหรียญลุคประจำสัปดาห์',ja:'自分のコーデでエントリーして、ほかの人のコーデに{v}票まで投票しよう。最多得票で★{p}と「今週のコーデ」バッジ！'},
    ate:{pt:'Até domingo, {d}',en:'Until Sunday, {d}',es:'Hasta el domingo, {d}',id:'Sampai Minggu, {d}',th:'ถึงวันอาทิตย์ {d}',ja:'日曜日（{d}）まで'},
    inscrever:{pt:'Inscrever meu visual',en:'Enter my outfit',es:'Inscribir mi look',id:'Daftarkan gayaku',th:'ส่งลุคของฉัน',ja:'エントリーする'},
    atualizar:{pt:'Atualizar meu visual',en:'Update my outfit',es:'Actualizar mi look',id:'Perbarui gayaku',th:'อัปเดตลุคของฉัน',ja:'コーデを更新'},
    inscrito:{pt:'Seu visual está no concurso!',en:'Your outfit is in the contest!',es:'¡Tu look está en el concurso!',id:'Gayamu ikut kontes!',th:'ลุคของคุณเข้าประกวดแล้ว!',ja:'エントリーしました！'},
    votos:{pt:'Seus votos: {a} de {b}',en:'Your votes: {a} of {b}',es:'Tus votos: {a} de {b}',id:'Suaramu: {a} dari {b}',th:'โหวตของคุณ: {a} จาก {b}',ja:'あなたの票：{a}/{b}'},
    votar:{pt:'Votar em {n}',en:'Vote for {n}',es:'Votar por {n}',id:'Pilih {n}',th:'โหวตให้ {n}',ja:'{n}さんに投票'},
    limite:{pt:'Você já usou os {v} votos da semana. Tire um voto para dar a outra pessoa.',en:'You used all {v} votes this week. Remove one to vote for someone else.',es:'Ya usaste los {v} votos de la semana. Quita uno para votar por otra persona.',id:'Kamu sudah memakai {v} suara minggu ini. Hapus satu untuk memilih orang lain.',th:'คุณใช้ครบ {v} โหวตของสัปดาห์แล้ว เอาออกหนึ่งโหวตเพื่อโหวตคนอื่น',ja:'今週の{v}票を使い切りました。ほかの人に投票するには1票取り消してください。'},
    vazio:{pt:'Ninguém se inscreveu ainda. Seja a primeira pessoa!',en:'No entries yet. Be the first!',es:'Nadie se inscribió todavía. ¡Sé la primera persona!',id:'Belum ada peserta. Jadilah yang pertama!',th:'ยังไม่มีใครส่งลุค มาเป็นคนแรกกัน!',ja:'まだエントリーがありません。最初の一人になろう！'},
    voce:{pt:'Você',en:'You',es:'Tú',id:'Kamu',th:'คุณ',ja:'あなた'},
    vencedor:{pt:'Semana passada ({t}): {n} venceu!',en:'Last week ({t}): {n} won!',es:'La semana pasada ({t}): ¡ganó {n}!',id:'Minggu lalu ({t}): {n} menang!',th:'สัปดาห์ที่แล้ว ({t}): {n} ชนะ!',ja:'先週（{t}）：{n}さんが優勝！'},
    resgatar:{pt:'Pegar meu prêmio de ★{p}',en:'Claim my ★{p} prize',es:'Recoger mi premio de ★{p}',id:'Ambil hadiah ★{p}',th:'รับรางวัล ★{p}',ja:'★{p}を受け取る'},
    ganhou:{pt:'Você ganhou ★{p} e a insígnia Look da semana!',en:'You got ★{p} and the Look of the week badge!',es:'¡Ganaste ★{p} y la insignia Look de la semana!',id:'Kamu dapat ★{p} dan lencana Gaya minggu ini!',th:'คุณได้ ★{p} และเหรียญลุคประจำสัปดาห์!',ja:'★{p}と「今週のコーデ」バッジをゲット！'},
    entrarVotar:{pt:'Entre com Google para se inscrever e votar.',en:'Sign in with Google to enter and vote.',es:'Entra con Google para inscribirte y votar.',id:'Masuk dengan Google untuk ikut dan memilih.',th:'เข้าสู่ระบบด้วย Google เพื่อส่งลุคและโหวต',ja:'Googleでログインするとエントリーと投票ができます。'},
    entrar:{pt:'Entrar com Google',en:'Sign in with Google',es:'Entrar con Google',id:'Masuk dengan Google',th:'เข้าสู่ระบบด้วย Google',ja:'Googleでログイン'},
    semVisual:{pt:'Monte e salve o seu visual primeiro (Center⭐Run! → Montar visual).',en:'Create and save your outfit first (Center⭐Run! → Edit look).',es:'Primero arma y guarda tu look (Center⭐Run! → Armar look).',id:'Buat dan simpan gayamu dulu (Center⭐Run! → Atur gaya).',th:'แต่งและบันทึกลุคก่อน (Center⭐Run! → แต่งตัว)',ja:'先にコーデを作って保存してね（Center⭐Run! → コーデ）。'},
    instalar:{pt:'Instalar como app',en:'Install as an app',es:'Instalar como app',id:'Pasang sebagai aplikasi',th:'ติดตั้งเป็นแอป',ja:'アプリとして追加'},
    instalarIos:{pt:'No iPhone: toque em Compartilhar (□↑) e depois em "Adicionar à Tela de Início".',en:'On iPhone: tap Share (□↑), then "Add to Home Screen".',es:'En iPhone: toca Compartir (□↑) y luego "Agregar a inicio".',id:'Di iPhone: ketuk Bagikan (□↑), lalu "Tambah ke Layar Utama".',th:'บน iPhone: แตะแชร์ (□↑) แล้วเลือก "เพิ่มไปยังหน้าจอโฮม"',ja:'iPhoneでは：共有（□↑）→「ホーム画面に追加」をタップ。'},
    lembrete:{pt:'Lembrete do Show de sábado',en:'Saturday Show reminder',es:'Recordatorio del Show del sábado',id:'Pengingat Show Sabtu',th:'เตือนโชว์วันเสาร์',ja:'土曜ショーのリマインダー'},
    lembreteOk:{pt:'Abra o arquivo para pôr o Show de sábado na sua agenda (toda semana, às 19h de Brasília).',en:'Open the file to add the Saturday Show to your calendar (every week, 7 pm Brasília time).',es:'Abre el archivo para poner el Show del sábado en tu agenda (cada semana, 19 h de Brasilia).',id:'Buka berkasnya untuk menambahkan Show Sabtu ke kalendermu (tiap minggu, 19.00 waktu Brasília).',th:'เปิดไฟล์เพื่อเพิ่มโชว์วันเสาร์ลงปฏิทิน (ทุกสัปดาห์ 19:00 เวลาบราซิเลีย)',ja:'ファイルを開くと土曜ショーがカレンダーに入ります（毎週、ブラジリア時間19時）。'},
    showTit:{pt:'Show de sábado no TsuLiPa⭐World',en:'Saturday Show at TsuLiPa⭐World',es:'Show del sábado en TsuLiPa⭐World',id:'Show Sabtu di TsuLiPa⭐World',th:'โชว์วันเสาร์ที่ TsuLiPa⭐World',ja:'TsuLiPa⭐World 土曜ショー'},
    showDesc:{pt:'Termine uma música no Karaoke⭐Time! hoje e ganhe ★20.',en:'Finish a song in Karaoke⭐Time! today and get ★20.',es:'Termina una canción en Karaoke⭐Time! hoy y gana ★20.',id:'Selesaikan satu lagu di Karaoke⭐Time! hari ini dan dapat ★20.',th:'ร้องเพลงใน Karaoke⭐Time! ให้จบวันนี้ แล้วรับ ★20',ja:'今日Karaoke⭐Time!で1曲歌いきると★20！'},
    fotoVisit:{pt:'Gostou do seu Idol? Crie a sua conta grátis com Google para guardar o visual, as fotos e as estrelas em qualquer aparelho.',en:'Love your Idol? Create a free account with Google to keep your outfit, photos and stars on any device.',es:'¿Te gustó tu Idol? Crea tu cuenta gratis con Google para guardar tu look, fotos y estrellas en cualquier dispositivo.',id:'Suka Idol-mu? Buat akun gratis dengan Google untuk menyimpan gaya, foto, dan bintang di perangkat mana pun.',th:'ชอบไอดอลของคุณไหม? สร้างบัญชีฟรีด้วย Google เพื่อเก็บลุค รูป และดาวไว้ใช้ได้ทุกเครื่อง',ja:'Idolを気に入った？Googleで無料アカウントを作れば、コーデや写真、スターをどの端末でも残せます。'},
    agoraNao:{pt:'Agora não',en:'Not now',es:'Ahora no',id:'Nanti saja',th:'ไว้ทีหลัง',ja:'あとで'},
    duoAlbum:{pt:'Álbum de duetos',en:'Duet album',es:'Álbum de dúos',id:'Album duet',th:'อัลบั้มดูเอ็ต',ja:'デュエットアルバム'},
    duoAlbumTxt:{pt:'Cada pessoa diferente com quem você fez uma cena no Moon⭐Duo! entra aqui. Complete as metas para ganhar estrelas.',en:'Everyone you made a Moon⭐Duo! scene with goes here. Reach the goals to earn stars.',es:'Cada persona con la que hiciste una escena en Moon⭐Duo! entra aquí. Cumple las metas para ganar estrellas.',id:'Setiap orang yang pernah membuat adegan Moon⭐Duo! bersamamu masuk ke sini. Capai targetnya untuk dapat bintang.',th:'ทุกคนที่คุณถ่ายฉากใน Moon⭐Duo! ด้วยจะอยู่ที่นี่ ทำเป้าหมายให้ครบเพื่อรับดาว',ja:'Moon⭐Duo!で一緒にシーンを撮った人がここに集まります。目標を達成するとスターがもらえます。'},
    parceiros:{pt:'{n} parceiros de cena',en:'{n} scene partners',es:'{n} compañeros de escena',id:'{n} rekan adegan',th:'คู่ถ่ายฉาก {n} คน',ja:'共演 {n}人'},
    meta:{pt:'{n} parceiros · ★{p}',en:'{n} partners · ★{p}',es:'{n} compañeros · ★{p}',id:'{n} rekan · ★{p}',th:'{n} คน · ★{p}',ja:'{n}人 · ★{p}'},
    pegar:{pt:'Pegar ★{p}',en:'Claim ★{p}',es:'Recoger ★{p}',id:'Ambil ★{p}',th:'รับ ★{p}',ja:'★{p}を受け取る'},
    duoVazio:{pt:'Faça a primeira cena no Moon⭐Duo! para começar o álbum.',en:'Make your first Moon⭐Duo! scene to start the album.',es:'Haz tu primera escena en Moon⭐Duo! para empezar el álbum.',id:'Buat adegan Moon⭐Duo! pertamamu untuk memulai album.',th:'ถ่ายฉากแรกใน Moon⭐Duo! เพื่อเริ่มอัลบั้ม',ja:'Moon⭐Duo!で最初のシーンを撮ってアルバムを始めよう。'},
    studio:{pt:'Sessão no Photo⭐Studio!',en:'Photo⭐Studio! session',es:'Sesión en Photo⭐Studio!',id:'Sesi Photo⭐Studio!',th:'เซสชัน Photo⭐Studio!',ja:'Photo⭐Studio!で撮影'},
    recSemana:{pt:'Seu recorde da semana: {n} pontos. Bata para subir no ranking!',en:'Your best this week: {n} points. Beat it to climb the ranking!',es:'Tu récord de la semana: {n} puntos. ¡Supéralo para subir en el ranking!',id:'Rekor minggu ini: {n} poin. Kalahkan untuk naik peringkat!',th:'สถิติสัปดาห์นี้ของคุณ: {n} คะแนน ทำให้ได้มากกว่าเพื่อไต่อันดับ!',ja:'今週のベスト：{n}点。超えてランキングを上げよう！'},
    recSemana0:{pt:'Primeira corrida da semana: qualquer pontuação já vira o seu recorde semanal.',en:'First run of the week: any score becomes your weekly best.',es:'Primera carrera de la semana: cualquier puntuación ya es tu récord semanal.',id:'Lari pertama minggu ini: skor berapa pun jadi rekor mingguanmu.',th:'รอบแรกของสัปดาห์: คะแนนเท่าไหร่ก็เป็นสถิติประจำสัปดาห์',ja:'今週初めてのラン：どんなスコアでも今週のベストになります。'},
    recNovo:{pt:'Novo recorde da semana! (antes: {n})',en:'New weekly best! (before: {n})',es:'¡Nuevo récord de la semana! (antes: {n})',id:'Rekor minggu ini baru! (sebelumnya: {n})',th:'สถิติใหม่ของสัปดาห์! (เดิม: {n})',ja:'今週のベスト更新！（前回：{n}）'},
    recFalta:{pt:'Faltaram {n} pontos para o seu recorde da semana.',en:'{n} points short of your weekly best.',es:'Te faltaron {n} puntos para tu récord de la semana.',id:'Kurang {n} poin dari rekor minggu ini.',th:'ขาดอีก {n} คะแนนจากสถิติสัปดาห์นี้',ja:'今週のベストまであと{n}点でした。'},
    perfilShare:{pt:'Compartilhar meu perfil',en:'Share my profile',es:'Compartir mi perfil',id:'Bagikan profilku',th:'แชร์โปรไฟล์ของฉัน',ja:'プロフィールをシェア'},
    perfilMsg:{pt:'Olha o meu Idol no TsuLiPa⭐World!',en:'Check out my Idol on TsuLiPa⭐World!',es:'¡Mira mi Idol en TsuLiPa⭐World!',id:'Lihat Idol-ku di TsuLiPa⭐World!',th:'มาดูไอดอลของฉันใน TsuLiPa⭐World!',ja:'TsuLiPa⭐Worldの私のIdolを見て！'},
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'閉じる'},
    erro:{pt:'Não deu certo agora. Tente de novo daqui a pouco.',en:'That didn\'t work. Please try again soon.',es:'No funcionó. Inténtalo de nuevo en un rato.',id:'Belum berhasil. Coba lagi sebentar lagi.',th:'ยังไม่สำเร็จ ลองใหม่อีกครั้งนะ',ja:'うまくいきませんでした。少ししてからもう一度試してください。'}
  };
  var TEMAS = [
    {pt:'Look de palco',en:'Stage look',es:'Look de escenario',id:'Gaya panggung',th:'ลุคบนเวที',ja:'ステージ衣装'},
    {pt:'Tudo de uma cor',en:'One color head to toe',es:'Todo de un color',id:'Satu warna',th:'สีเดียวทั้งตัว',ja:'ワントーンコーデ'},
    {pt:'Pastel kawaii',en:'Kawaii pastel',es:'Pastel kawaii',id:'Pastel kawaii',th:'พาสเทลคาวาอี้',ja:'パステルかわいい'},
    {pt:'Look de inverno',en:'Winter look',es:'Look de invierno',id:'Gaya musim dingin',th:'ลุคฤดูหนาว',ja:'冬コーデ'},
    {pt:'Dia de festa',en:'Party day',es:'Día de fiesta',id:'Hari pesta',th:'วันปาร์ตี้',ja:'パーティーの日'},
    {pt:'Cabelo colorido',en:'Colorful hair',es:'Cabello colorido',id:'Rambut warna-warni',th:'ผมสีสดใส',ja:'カラフルヘア'},
    {pt:'Noite de gala',en:'Gala night',es:'Noche de gala',id:'Malam gala',th:'ค่ำคืนกาล่า',ja:'ガラナイト'},
    {pt:'Inspirado no seu oshi',en:'Inspired by your oshi',es:'Inspirado en tu oshi',id:'Terinspirasi oshi-mu',th:'แรงบันดาลใจจากโอชิ',ja:'推しイメージ'}
  ];
  function L(){ var l = typeof LANG === 'string' ? LANG : 'pt'; return TXT.convite[l] ? l : 'pt'; }
  function t(k, v){ var s = (TXT[k] && (TXT[k][L()] || TXT[k].pt)) || k; return s.replace(/\{(\w+)\}/g, function(_, n){ return v && v[n] != null ? v[n] : ''; }); }
  function tema(i){ var x = TEMAS[((+i || 0) % 8 + 8) % 8]; return x[L()] || x.pt; }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem conta')); }
  function aviso(txt, ic){ if(window.TW_CELULAR && TW_CELULAR.toast) TW_CELULAR.toast(txt, ic || '🌟'); else if(typeof contaAviso === 'function') contaAviso(txt); }
  function lerLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function gravarLS(k, v){ try{ if(v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); }catch(e){} }
  function estrelas(n){
    if(typeof n !== 'number' || typeof starT === 'undefined') return;
    starT = n; gravarLS('brs48cr_st', starT); if(typeof setBest === 'function') setBest();
  }
  function entrar(){ if(typeof contaEntrar === 'function') contaEntrar(); }

  // ───── janela (mesmo visual das janelas da tw-pessoal) ─────
  var ov = null, voltarFoco = null, pedido = 0;
  function fechar(){ pedido++; if(ov){ ov.hidden = true; ov.replaceChildren(); } var f = voltarFoco; voltarFoco = null; if(f && f.isConnected) try{ f.focus(); }catch(e){} }
  window.addEventListener('keydown', function(e){
    if(!ov || ov.hidden) return;
    if(e.key === 'Escape'){ e.preventDefault(); e.stopImmediatePropagation(); fechar(); return; }
    if(e.key !== 'Tab') return;
    var it = Array.from(ov.querySelectorAll('button,a[href],input')).filter(function(el){ return !el.disabled && el.getClientRects().length; });
    if(!it.length) return;
    var a = document.activeElement, p = it[0], u = it[it.length - 1];
    if(e.shiftKey && (a === p || !ov.contains(a))){ e.preventDefault(); e.stopImmediatePropagation(); u.focus(); }
    else if(!e.shiftKey && (a === u || !ov.contains(a))){ e.preventDefault(); e.stopImmediatePropagation(); p.focus(); }
  }, true);
  function janela(html){
    if(!ov){
      ov = document.createElement('div'); ov.className = 'ov twp-ov twk-ov'; ov.hidden = true; document.body.appendChild(ov);
      ov.addEventListener('click', function(e){ if(e.target === ov || (e.target.closest && e.target.closest('[data-twk-x]'))) fechar(); });
    }
    if(ov.hidden){ var at = document.activeElement; voltarFoco = at && at !== document.body ? at : null; }
    ov.innerHTML = '<div class="panel twp-panel twk-panel" role="dialog" aria-modal="true" aria-labelledby="twkTit">' + html + '</div>';
    ov.hidden = false;
    var foco = ov.querySelector('.btn'); if(foco) try{ foco.focus(); }catch(e){}
    return ov;
  }

  // ───── Convite ─────
  function linkDe(cod){ return location.origin + '/?convite=' + encodeURIComponent(cod); }
  function abrirConvite(){
    if(!logado()){ janela('<h2 class="twp-tit" id="twkTit">💌 ' + esc(t('convite')) + '</h2><p class="twk-txt">' + esc(t('conviteTxt', {p:30})) + '</p><div class="btns"><button type="button" class="btn" data-twk="entrar">' + esc(t('entrar')) + '</button><button type="button" class="btn alt" data-twk-x>' + esc(t('fechar')) + '</button></div>'); return; }
    var meu = ++pedido;
    janela('<h2 class="twp-tit" id="twkTit">💌 ' + esc(t('convite')) + '</h2><p class="twk-txt">…</p>');
    rpc('convite_meu').then(function(r){
      if(meu !== pedido) return;
      if(!r || !r.ok || !r.codigo){ janela('<h2 class="twp-tit" id="twkTit">💌 ' + esc(t('convite')) + '</h2><p class="twk-txt">' + esc(t('erro')) + '</p><div class="btns"><button type="button" class="btn alt" data-twk-x>' + esc(t('fechar')) + '</button></div>'); return; }
      var link = linkDe(r.codigo), podeShare = typeof navigator.share === 'function';
      janela('<h2 class="twp-tit" id="twkTit">💌 ' + esc(t('convite')) + '</h2>' +
        '<p class="twk-txt">' + esc(t('conviteTxt', {p:r.premio || 30})) + '</p>' +
        '<p class="twk-link"><input type="text" readonly value="' + esc(link) + '" aria-label="' + esc(t('convite')) + '"></p>' +
        '<p class="twk-nota">' + esc(t('conviteConta', {a:r.aceitos || 0, b:r.premiados || 0})) + '</p>' +
        '<div class="btns">' + (podeShare ? '<button type="button" class="btn" data-twk="convite-share">📤 ' + esc(t('compartilhar')) + '</button>' : '') +
        '<button type="button" class="btn' + (podeShare ? ' alt' : '') + '" data-twk="convite-copiar">🔗 ' + esc(t('copiar')) + '</button>' +
        '<button type="button" class="btn alt" data-twk-x>' + esc(t('fechar')) + '</button></div>');
      ov.dataset.link = link;
    }).catch(function(){ if(meu === pedido) aviso(t('erro'), '⚠️'); });
  }
  function copiar(txt){
    if(navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(txt);
    var i = ov && ov.querySelector('.twk-link input'); if(i){ i.select(); try{ document.execCommand('copy'); }catch(e){} }
    return Promise.resolve();
  }
  // ?convite=CODIGO → guardado até a pessoa entrar (o login do Google volta sem os parâmetros)
  (function lerLink(){
    try{
      var u = new URL(location.href), c = (u.searchParams.get('convite') || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
      if(!c) return;
      gravarLS(CHAVE_CONVITE, c);
      u.searchParams.delete('convite'); history.replaceState(history.state, '', u.pathname + u.search + u.hash);
    }catch(e){}
  })();
  var conferindo = false, resolvido = {};   // conta sem convite ou já paga: não pergunta de novo nesta visita
  function chaveConta(){ return logado() ? String(contaJ.id || contaJ.nick || '') : ''; }
  function conviteConferir(){
    if(!logado() || conferindo || (resolvido[chaveConta()] && !lerLS(CHAVE_CONVITE))) return;
    conferindo = true;
    var conta = typeof contaSessaoAtual === 'function' ? contaSessaoAtual() : function(){ return true; };
    var cod = lerLS(CHAVE_CONVITE);
    (cod ? rpc('convite_aceitar', {p_codigo:cod}).then(function(r){
      if(!conta()) return;
      if(r && (r.ok || /^(codigo|proprio|conta_antiga|ja_aceito)$/.test(r.erro))) gravarLS(CHAVE_CONVITE, null);
      if(r && r.ok) aviso(t('aceito', {n:r.madrinha, p:r.premio || 30}), '💌');
    }) : Promise.resolve()).then(function(){ return rpc('convite_conferir'); }).then(function(r){
      if(!conta() || !r) return;
      if(r.agora){ aviso(t('pago', {n:r.madrinha, p:r.premio || 30}), '🎉'); estrelas(r.stars); }
      pendente = !!(r.convite && !r.pago);
      if(r.ok && !pendente) resolvido[chaveConta()] = true;
    }).catch(function(){}).then(function(){ conferindo = false; });
  }
  var pendente = false;
  function observarCorrida(){   // fim da corrida (#over aparece): se o convite ainda espera, confere de novo
    var over = document.getElementById('over'); if(!over) return;
    try{ new MutationObserver(function(){ if(!over.hidden && pendente) setTimeout(conviteConferir, 2500); }).observe(over, {attributes:true, attributeFilter:['hidden']}); }catch(e){}
  }
  function visitanteConvidado(){   // chegou por convite e ainda não entrou
    if(logado() || !lerLS(CHAVE_CONVITE)) return;
    try{ if(sessionStorage.getItem('twk_cv')) return; sessionStorage.setItem('twk_cv', '1'); }catch(e){ return; }
    janela('<h2 class="twp-tit" id="twkTit">💌 ' + esc(t('convite')) + '</h2><p class="twk-txt">' + esc(t('conviteVisit')) + '</p><div class="btns"><button type="button" class="btn" data-twk="entrar">' + esc(t('entrar')) + '</button><button type="button" class="btn alt" data-twk-x>' + esc(t('agoraNao')) + '</button></div>');
  }

  // ───── Concurso de visual da semana ─────
  var C = null;
  function data(d){ try{ return new Date(d + 'T12:00:00Z').toLocaleDateString(L() === 'pt' ? 'pt-BR' : L(), {day:'2-digit', month:'2-digit'}); }catch(e){ return d; } }
  function desenhar(cv, visual){
    try{
      var x = cv.getContext('2d'); x.clearRect(0, 0, cv.width, cv.height);
      if(typeof perfChar !== 'function' || typeof drawChar !== 'function' || typeof perfCharContorno !== 'function') return;
      perfCharContorno(x, 30, 20, 6, function(){ drawChar(perfChar({c:visual || {}}), 0, 0, 0, 0, false); });
    }catch(e){}
  }
  function abrirConcurso(){
    var meu = ++pedido;
    if(!ov || ov.hidden) janela('<h2 class="twp-tit" id="twkTit">🏆 ' + esc(t('concurso')) + '</h2><p class="twk-txt">…</p>');
    rpc('concurso_estado').then(function(d){
      if(meu !== pedido || !d || !d.ok) { if(meu === pedido && (!d || !d.ok)) aviso(t('erro'), '⚠️'); return; }
      C = d;
      var cards = (d.inscritos || []).map(function(e, i){
        var nome = e.eu ? t('voce') : e.nick;
        return '<li class="twk-card' + (e.votei ? ' votei' : '') + '"><canvas width="240" height="300" data-i="' + i + '" aria-hidden="true"></canvas>' +
          '<b>' + esc(nome) + '</b>' +
          (e.eu || !logado() ? '<span class="twk-votos">♥ ' + (+e.votos || 0) + '</span>' :
            '<button type="button" class="twk-votar" data-twk="votar" data-nick="' + esc(e.nick) + '" aria-pressed="' + (e.votei ? 'true' : 'false') + '" aria-label="' + esc(t('votar', {n:e.nick})) + '">' + (e.votei ? '♥' : '♡') + ' ' + (+e.votos || 0) + '</button>') +
          '</li>';
      }).join('');
      var ant = d.anterior || {}, venc = (ant.vencedores || []).join(', ');
      janela('<h2 class="twp-tit" id="twkTit">🏆 ' + esc(t('concurso')) + '</h2>' +
        '<p class="twk-tema">' + esc(tema(d.tema)) + ' <small>' + esc(t('ate', {d:data(d.ate)})) + '</small></p>' +
        '<p class="twk-txt">' + esc(t('concursoTxt', {t:tema(d.tema), v:d.votos_max || 3, p:d.premio || 50})) + '</p>' +
        (venc ? '<p class="twk-nota">👑 ' + esc(t('vencedor', {t:tema(ant.tema), n:venc})) + '</p>' : '') +
        (ant.posso_resgatar ? '<div class="btns"><button type="button" class="btn" data-twk="resgatar">🎁 ' + esc(t('resgatar', {p:d.premio || 50})) + '</button></div>' : '') +
        (logado() ? '<p class="twk-nota">' + esc(t('votos', {a:d.meus_votos || 0, b:d.votos_max || 3})) + '</p>' : '<p class="twk-nota">' + esc(t('entrarVotar')) + '</p>') +
        (cards ? '<ul class="twk-galeria">' + cards + '</ul>' : '<p class="twk-vazio">' + esc(t('vazio')) + '</p>') +
        '<div class="btns">' + (logado() ? '<button type="button" class="btn" data-twk="inscrever">👗 ' + esc(t(d.eu_inscrito ? 'atualizar' : 'inscrever')) + '</button>'
                                         : '<button type="button" class="btn" data-twk="entrar">' + esc(t('entrar')) + '</button>') +
        '<button type="button" class="btn alt" data-twk-x>' + esc(t('fechar')) + '</button></div>');
      ov.querySelectorAll('.twk-galeria canvas').forEach(function(cv){ var e = d.inscritos[+cv.dataset.i]; if(e) desenhar(cv, e.visual); });
    }).catch(function(){ if(meu === pedido) aviso(t('erro'), '⚠️'); });
  }
  function inscrever(b){
    b.disabled = true;
    // garante que a nuvem tem o visual de agora antes de tirar a "foto" da inscrição
    var antes = Promise.resolve();
    try{ if(typeof perfSync !== 'undefined' && perfSync && perfSync.markDirty) perfSync.markDirty();
         if(typeof perfEnviar === 'function') antes = Promise.resolve(perfEnviar()).catch(function(){}); }catch(e){}
    antes.then(function(){ return rpc('concurso_inscrever'); }).then(function(r){
      if(r && r.ok){ aviso(t('inscrito'), '👗'); abrirConcurso(); }
      else aviso(t(r && r.erro === 'sem_visual' ? 'semVisual' : 'erro'), '⚠️');
    }).catch(function(){ aviso(t('erro'), '⚠️'); }).then(function(){ b.disabled = false; });
  }
  function votar(b){
    b.disabled = true;
    rpc('concurso_votar', {p_nick:b.dataset.nick}).then(function(r){
      if(r && r.ok) abrirConcurso();
      else aviso(t(r && r.erro === 'limite' ? 'limite' : 'erro', {v:(C && C.votos_max) || 3}), '⚠️');
    }).catch(function(){ aviso(t('erro'), '⚠️'); }).then(function(){ b.disabled = false; });
  }
  function resgatar(b){
    b.disabled = true;
    rpc('concurso_resgatar').then(function(r){
      if(r && r.ok){ aviso(t('ganhou', {p:r.premio || 50}), '🏆'); estrelas(r.stars); abrirConcurso(); }
      else{ aviso(t('erro'), '⚠️'); b.disabled = false; }
    }).catch(function(){ aviso(t('erro'), '⚠️'); b.disabled = false; });
  }

  // ───── Instalar como app e lembrete do Show de sábado ─────
  var pedidoInstalar = null;
  window.addEventListener('beforeinstallprompt', function(e){ e.preventDefault(); pedidoInstalar = e; });
  window.addEventListener('appinstalled', function(){ pedidoInstalar = null; });
  function instalado(){ try{ return matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; }catch(e){ return false; } }
  function ios(){ return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function podeInstalar(){ return !instalado() && (!!pedidoInstalar || ios()); }
  function instalar(){
    if(pedidoInstalar){ var p = pedidoInstalar; pedidoInstalar = null; p.prompt(); return; }
    janela('<h2 class="twp-tit" id="twkTit">📲 ' + esc(t('instalar')) + '</h2><p class="twk-txt">' + esc(t('instalarIos')) + '</p><div class="btns"><button type="button" class="btn alt" data-twk-x>' + esc(t('fechar')) + '</button></div>');
  }
  function lembrete(){
    // próximo sábado (ou hoje, se for sábado), 19h de Brasília = 22h UTC; repete toda semana, com alerta na hora
    var agora = new Date(Date.now() - 3 * 36e5), dias = (6 - agora.getUTCDay() + 7) % 7;
    var sab = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), agora.getUTCDate() + dias, 22, 0, 0));
    function iso(d){ return d.toISOString().slice(0, 19).replace(/[-:]/g, '') + 'Z'; }
    function campo(s){ return s.replace(/[\\;,]/g, '\\$&'); }
    var ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//TsuLiPa World//Show de sabado//PT','BEGIN:VEVENT',
      'UID:show-sabado@tsulipa-world.vercel.app','DTSTAMP:' + iso(new Date()),'DTSTART:' + iso(sab),'DTEND:' + iso(new Date(sab.getTime() + 30 * 6e4)),
      'RRULE:FREQ=WEEKLY;BYDAY=SA','SUMMARY:' + campo(t('showTit')),'DESCRIPTION:' + campo(t('showDesc')),
      'URL:' + location.origin + '/','BEGIN:VALARM','ACTION:DISPLAY','TRIGGER:PT0M','DESCRIPTION:' + campo(t('showTit')),'END:VALARM',
      'END:VEVENT','END:VCALENDAR',''].join('\r\n');
    var a = document.createElement('a'), url = URL.createObjectURL(new Blob([ics], {type:'text/calendar;charset=utf-8'}));
    a.href = url; a.download = 'tsulipa-show-de-sabado.ics'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 30000);
    aviso(t('lembreteOk'), '📅');
  }

  // ───── Visitante que salvou uma foto: convite para guardar o Idol ─────
  document.addEventListener('tw-foto-salva', function(){
    if(logado()) return;
    try{ if(sessionStorage.getItem('twk_foto')) return; sessionStorage.setItem('twk_foto', '1'); }catch(e){ return; }
    setTimeout(function(){
      if(logado() || (ov && !ov.hidden)) return;
      janela('<h2 class="twp-tit" id="twkTit">☁️ ' + esc(t('entrar')) + '</h2><p class="twk-txt">' + esc(t('fotoVisit')) + '</p><div class="btns"><button type="button" class="btn" data-twk="entrar">' + esc(t('entrar')) + '</button><button type="button" class="btn alt" data-twk-x>' + esc(t('agoraNao')) + '</button></div>');
    }, 1200);
  });

  // ───── Moon⭐Duo!: álbum de duetos e atalhos para o concurso e o Studio ─────
  function duoAtalhos(){
    var palco = document.getElementById('duoPalco'), acoes = palco && palco.querySelector('.duoacoes');
    if(!acoes || palco.hidden || !logado() || palco.querySelector('.twk-duomais')) return;
    var d = document.createElement('div'); d.className = 'twk-duomais';
    d.innerHTML = '<button type="button" class="btn alt" data-twk="duo-album">📒 ' + esc(t('duoAlbum')) + '</button>' +
      '<button type="button" class="btn alt" data-twk="concurso">🏆 ' + esc(t('concurso')) + '</button>' +
      (typeof window.studioAbrir === 'function' ? '<button type="button" class="btn alt" data-twk="studio">📸 ' + esc(t('studio')) + '</button>' : '');
    var destino = document.getElementById('duoAtalhos');
    if(destino) destino.appendChild(d);
    else acoes.parentNode.insertBefore(d, acoes.nextSibling);
  }
  function abrirDuoAlbum(){
    var meu = ++pedido;
    janela('<h2 class="twp-tit" id="twkTit">📒 ' + esc(t('duoAlbum')) + '</h2><p class="twk-txt">…</p>');
    rpc('duo_album').then(function(d){
      if(meu !== pedido) return;
      if(!d || !d.ok){ aviso(t('erro'), '⚠️'); return; }
      var lista = d.lista || [];
      var metas = (d.metas || []).map(function(m){
        return '<li class="twk-meta' + (m.ok ? ' ok' : '') + '"><span>' + (m.ok ? '✅' : '⬜') + ' ' + esc(t('meta', {n:m.meta, p:m.premio})) + '</span>' +
          (m.ok && !m.resgatado ? '<button type="button" class="btn" data-twk="duo-meta" data-meta="' + (+m.meta) + '">🎁 ' + esc(t('pegar', {p:m.premio})) + '</button>' : '') + '</li>';
      }).join('');
      janela('<h2 class="twp-tit" id="twkTit">📒 ' + esc(t('duoAlbum')) + '</h2>' +
        '<p class="twk-txt">' + esc(t('duoAlbumTxt')) + '</p><p class="twk-tema">' + esc(t('parceiros', {n:d.parceiros || 0})) + '</p>' +
        '<ul class="twk-metas">' + metas + '</ul>' +
        (lista.length ? '<ul class="twk-galeria">' + lista.map(function(e, i){ return '<li class="twk-card"><canvas width="240" height="300" data-i="' + i + '" aria-hidden="true"></canvas><b>' + esc(e.nick) + '</b><span class="twk-nota">🎬 ' + (+e.cenas || 0) + '</span></li>'; }).join('') + '</ul>'
                      : '<p class="twk-vazio">' + esc(t('duoVazio')) + '</p>') +
        '<div class="btns"><button type="button" class="btn alt" data-twk-x>' + esc(t('fechar')) + '</button></div>');
      ov.querySelectorAll('.twk-galeria canvas').forEach(function(cv){
        var e = lista[+cv.dataset.i]; if(!e) return;
        try{ var x = cv.getContext('2d'); perfCharContorno(x, 30, 20, 6, function(){ drawChar(perfChar(e.avatar || {}), 0, 0, 0, 0, false); }); }catch(_){}
      });
    }).catch(function(){ if(meu === pedido) aviso(t('erro'), '⚠️'); });
  }
  function duoMeta(b){
    b.disabled = true;
    rpc('duo_album_resgatar', {p_meta:+b.dataset.meta}).then(function(r){
      if(r && r.ok){ aviso('🎁 +★' + r.premio, '📒'); estrelas(r.stars); abrirDuoAlbum(); } else { aviso(t('erro'), '⚠️'); b.disabled = false; }
    }).catch(function(){ aviso(t('erro'), '⚠️'); b.disabled = false; });
  }

  // ───── Center⭐Run!: recorde da semana no menu e no fim da corrida ─────
  var recSem = null, recPedido = 0;
  function recCarregar(){
    if(!logado()) { recSem = null; recMostrar(); return; }
    var meu = ++recPedido;
    rpc('meu_recorde_semana').then(function(r){ if(meu === recPedido && r && r.ok){ recSem = r; recMostrar(); try{ window.dispatchEvent(new Event('tw-semana')); }catch(e){} } }).catch(function(){});   // o Hoje mostra as vitórias do Battle
  }
  function recMostrar(){
    var menu = document.getElementById('menu'), pn = menu && menu.querySelector('.panel'); if(!pn) return;
    var el = document.getElementById('twkRecSemana');
    if(!el){ el = document.createElement('p'); el.id = 'twkRecSemana'; el.className = 'twk-recsemana'; var p = pn.querySelector('p'); if(p) p.parentNode.insertBefore(el, p.nextSibling); else pn.appendChild(el); }
    el.hidden = !recSem;
    if(recSem) el.textContent = '🏆 ' + (recSem.run > 0 ? t('recSemana', {n:(+recSem.run).toLocaleString()}) : t('recSemana0'));
  }
  document.addEventListener('tw-corrida-fim', function(e){
    var d = e.detail || {}; if(!logado() || d.teste || !recSem) return;
    var antes = +recSem.run || 0, pts = +d.pontos || 0;
    setTimeout(function(){
      var res = document.getElementById('res'); if(!res) return;
      var p = document.createElement('p'); p.className = 'twk-recfim';
      if(pts > antes){ p.textContent = '🏆 ' + t('recNovo', {n:antes.toLocaleString()}); recSem.run = pts; recMostrar(); }
      else if(antes > 0) p.textContent = '🎯 ' + t('recFalta', {n:(antes - pts + 1).toLocaleString()});
      else return;
      res.appendChild(p);
    }, 0);
  });

  // ───── Perfil: link para compartilhar e abrir pelo endereço (?perfil=Nick) ─────
  (function perfilDoLink(){
    try{
      var u = new URL(location.href), n = (u.searchParams.get('perfil') || '').trim().slice(0, 24);
      if(!n) return;
      u.searchParams.delete('perfil'); history.replaceState(history.state, '', u.pathname + u.search + u.hash);
      var tentar = function(k){ if(typeof perfAbrir === 'function' && typeof contaRpc === 'function') perfAbrir(n); else if(k < 20) setTimeout(tentar, 400, k + 1); };
      setTimeout(tentar, 1200, 0);
    }catch(e){}
  })();
  function perfilAtalho(){
    var ovp = document.getElementById('perfOv'), corpo = document.getElementById('perfCorpo');
    if(!ovp || ovp.hidden || !corpo || !logado() || typeof perfMeu === 'undefined' || !perfMeu || corpo.querySelector('.twk-perfshare')) return;
    if(!corpo.firstElementChild || corpo.querySelector('.perfcarr')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btn alt twk-perfshare'; b.dataset.twk = 'perfil-share';
    b.textContent = '🔗 ' + t('perfilShare'); corpo.appendChild(b);
  }
  function perfilCompartilhar(){
    var nk = logado() ? (contaJ.nick || '') : ''; if(!nk) return;
    var link = location.origin + '/?perfil=' + encodeURIComponent(nk);
    if(typeof navigator.share === 'function') navigator.share({title:'TsuLiPa⭐World', text:t('perfilMsg'), url:link}).catch(function(){});
    else copiar(link).then(function(){ aviso(t('copiado'), '🔗'); }, function(){});
  }

  // ───── Retrospectiva: abre sozinha uma vez no começo do mês (dias 1 a 7) ─────
  function retroAuto(){
    if(!logado() || !window.TW_PESSOAL || !TW_PESSOAL.abrirRetro || !TW_PESSOAL.retroMes) return;
    var hoje = new Date(Date.now() - 3 * 36e5); if(hoje.getUTCDate() > 7) return;
    var mes = TW_PESSOAL.retroMes(), chave = 'tw_retro_auto_' + chaveConta();
    if(lerLS(chave) === mes) return;
    setTimeout(function(){
      if(!logado() || (ov && !ov.hidden) || document.querySelector('.ov:not([hidden]) [aria-modal="true"]')) return;
      gravarLS(chave, mes); TW_PESSOAL.abrirRetro(mes);
    }, 4000);
  }

  // depois de qualquer toque, confere se o Duo ou o Perfil abriram (para pôr os atalhos)
  document.addEventListener('click', function(){ setTimeout(function(){ duoAtalhos(); perfilAtalho(); }, 350); }, true);
  // "Álbum e atividades" abre já com os atalhos, sem esperar o próximo clique.
  document.addEventListener('toggle', function(e){ if(e.target && e.target.id === 'duoExtra') duoAtalhos(); }, true);

  // ───── cliques ─────
  document.addEventListener('click', function(e){
    var b = e.target && e.target.closest && e.target.closest('[data-twk]'); if(!b) return;
    var k = b.dataset.twk;
    if(k === 'convite') abrirConvite();
    else if(k === 'concurso') abrirConcurso();
    else if(k === 'instalar') instalar();
    else if(k === 'lembrete') lembrete();
    else if(k === 'entrar'){ fechar(); entrar(); }
    else if(k === 'inscrever') inscrever(b);
    else if(k === 'votar') votar(b);
    else if(k === 'resgatar') resgatar(b);
    else if(k === 'duo-album') abrirDuoAlbum();
    else if(k === 'duo-meta') duoMeta(b);
    else if(k === 'studio'){ if(typeof window.studioAbrir === 'function') window.studioAbrir(); }
    else if(k === 'perfil-share') perfilCompartilhar();
    else if(k === 'convite-copiar') copiar(ov.dataset.link).then(function(){ aviso(t('copiado'), '🔗'); }, function(){});
    else if(k === 'convite-share'){ var l = ov.dataset.link; navigator.share({title:'TsuLiPa⭐World', text:t('conviteMsg'), url:l}).catch(function(){}); }
    else return;
    e.preventDefault();
  });

  function iniciar(){ observarCorrida(); setTimeout(visitanteConvidado, 2500); }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();

  window.TW_COMUNIDADE = {semana:function(){ return recSem; }, 
    t:t, podeInstalar:podeInstalar,
    contaMudou:function(){ if(logado()){ setTimeout(conviteConferir, 1500); setTimeout(recCarregar, 1800); retroAuto(); } else { pendente = false; recSem = null; recMostrar(); } },
    abrirConvite:abrirConvite, abrirConcurso:abrirConcurso, lembrete:lembrete
  };
})();
