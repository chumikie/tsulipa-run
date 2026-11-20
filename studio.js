/* TsuLiPa⭐World — Photo⭐Studio! v1 (docs/PHOTO_STUDIO_PROPOSTA.md).
   Pauta do dia da Idol⭐News! → você monta a foto (cenário, pose, luz, enquadramento, objeto) → clique →
   o servidor confere (studio_pauta / studio_clique: 1–3 estrelas, ★5/dia na 1ª foto com 3) → polaroid PNG.
   Sem conta: treino com pauta local, sem prêmio. Nenhuma imagem sai do aparelho.
   Cenários do estúdio são próprios (não liberam fundos/poses pagos da lojinha). */
(function(){
  'use strict';
  var FUNDOS = ['rosa','cortina','nuvens','neon'], POSES = ['normal','v','coracao','tchau'], LUZES = ['suave','neon','por'],
      QUADROS = ['rosto','meio','inteiro'], OBJ = ['nenhum','balao','microfone','lightstick'], FLORES = ['sakura','tulipa','girassol','lunar'];
  var EMO = {rosa:'🎀',cortina:'🪟',nuvens:'☁️',neon:'💜',normal:'🙂',v:'✌️',coracao:'🫰',tchau:'👋',suave:'🕯️',neon_l:'🌈',por:'🌇',rosto:'🙂',meio:'👕',inteiro:'🧍',nenhum:'✖',balao:'🎈',microfone:'🎤',lightstick:'🪄'};
  var T = {
    pt:{tit:'Photo⭐Studio!',aba1:'Estúdio',aba2:'Mural',publicar:'Publicar no mural',publicado:'Publicada no mural da semana!',ja:'Você já publicou uma foto hoje.',vazio:'Ninguém publicou ainda esta semana. Seja a primeira foto!',capa:'Capa da semana',parcial:'líder até agora',sua:'sua foto',dicaMural:'Uma foto por dia. Dê ❤️ nas fotos de que mais gostar: a mais curtida vira a Capa do Idol⭐News!',pauta:'Pauta do dia',fundo:'Cenário',pose:'Pose',luz:'Luz',quadro:'Enquadramento',objeto:'Objeto',clique:'📸 Clicar!',outra:'Tirar outra',salvar:'Salvar foto',
      treino:'Treino sem conta: entre para o fotógrafo conferir e ganhar ★5.',premio:'+★5 pela foto perfeita do dia!',erro:'Não deu certo. Tente de novo.',estrelas:'{n} de 3 estrelas',falta:'Faltou na pauta: {x}',perfeita:'Pauta completa!',
      rosa:'Fundo rosa',cortina:'Janela',nuvens:'Nuvens',neon:'Neon',normal:'Normal',v:'Pose V ✌',coracao:'Coração',tchau:'Tchau',suave:'Suave',neon_l:'Neon',por:'Pôr do sol',rosto:'Rosto',meio:'Meio corpo',inteiro:'Corpo inteiro',nenhum:'Nenhum',balao:'Balões',microfone:'Microfone',lightstick:'Lightstick',flor:'Flor',
      t_luz:'Ensaio de luz',t_quadro:'Retrato de revista',t_objeto:'Capa com objeto'},
    en:{tit:'Photo⭐Studio!',aba1:'Studio',aba2:'Board',publicar:'Post to the board',publicado:'Posted to this week\'s board!',ja:'You already posted a photo today.',vazio:'Nobody has posted this week yet. Be the first photo!',capa:'Cover of the week',parcial:'leading so far',sua:'your photo',dicaMural:'One photo a day. Give ❤️ to your favorites: the most loved one becomes the Idol⭐News! cover.',pauta:'Today\'s brief',fundo:'Backdrop',pose:'Pose',luz:'Light',quadro:'Framing',objeto:'Prop',clique:'📸 Snap!',outra:'Take another',salvar:'Save photo',
      treino:'Practice without an account: sign in for the photographer to check and earn ★5.',premio:'+★5 for today\'s perfect photo!',erro:'Something went wrong. Try again.',estrelas:'{n} of 3 stars',falta:'Missing from the brief: {x}',perfeita:'Brief complete!',
      rosa:'Pink backdrop',cortina:'Window',nuvens:'Clouds',neon:'Neon',normal:'Normal',v:'V pose ✌',coracao:'Heart',tchau:'Wave',suave:'Soft',neon_l:'Neon',por:'Sunset',rosto:'Face',meio:'Half body',inteiro:'Full body',nenhum:'None',balao:'Balloons',microfone:'Microphone',lightstick:'Lightstick',flor:'Flower',
      t_luz:'Lighting shoot',t_quadro:'Magazine portrait',t_objeto:'Cover with a prop'},
    es:{tit:'Photo⭐Studio!',aba1:'Estudio',aba2:'Mural',publicar:'Publicar en el mural',publicado:'¡Publicada en el mural de la semana!',ja:'Ya publicaste una foto hoy.',vazio:'Nadie ha publicado esta semana. ¡Sé la primera foto!',capa:'Portada de la semana',parcial:'líder por ahora',sua:'tu foto',dicaMural:'Una foto por día. Da ❤️ a tus favoritas: la más querida es la portada de Idol⭐News!',pauta:'Pauta del día',fundo:'Fondo',pose:'Pose',luz:'Luz',quadro:'Encuadre',objeto:'Objeto',clique:'📸 ¡Clic!',outra:'Tomar otra',salvar:'Guardar foto',
      treino:'Práctica sin cuenta: inicia sesión para que el fotógrafo revise y ganar ★5.',premio:'¡+★5 por la foto perfecta del día!',erro:'No funcionó. Inténtalo de nuevo.',estrelas:'{n} de 3 estrellas',falta:'Faltó en la pauta: {x}',perfeita:'¡Pauta completa!',
      rosa:'Fondo rosa',cortina:'Ventana',nuvens:'Nubes',neon:'Neón',normal:'Normal',v:'Pose V ✌',coracao:'Corazón',tchau:'Saludo',suave:'Suave',neon_l:'Neón',por:'Atardecer',rosto:'Rostro',meio:'Medio cuerpo',inteiro:'Cuerpo entero',nenhum:'Ninguno',balao:'Globos',microfone:'Micrófono',lightstick:'Lightstick',flor:'Flor',
      t_luz:'Sesión de luz',t_quadro:'Retrato de revista',t_objeto:'Portada con objeto'},
    id:{tit:'Photo⭐Studio!',aba1:'Studio',aba2:'Papan',publicar:'Pasang di papan',publicado:'Terpasang di papan minggu ini!',ja:'Kamu sudah memasang foto hari ini.',vazio:'Belum ada yang memasang minggu ini. Jadilah foto pertama!',capa:'Sampul minggu ini',parcial:'memimpin sementara',sua:'fotomu',dicaMural:'Satu foto per hari. Beri ❤️ ke favoritmu: yang paling disukai jadi sampul Idol⭐News!',pauta:'Tugas hari ini',fundo:'Latar',pose:'Pose',luz:'Cahaya',quadro:'Bingkai',objeto:'Properti',clique:'📸 Jepret!',outra:'Foto lagi',salvar:'Simpan foto',
      treino:'Latihan tanpa akun: masuk agar fotografer memeriksa dan dapat ★5.',premio:'+★5 untuk foto sempurna hari ini!',erro:'Gagal. Coba lagi.',estrelas:'{n} dari 3 bintang',falta:'Kurang dari tema: {x}',perfeita:'Tema lengkap!',
      rosa:'Latar pink',cortina:'Jendela',nuvens:'Awan',neon:'Neon',normal:'Normal',v:'Pose V ✌',coracao:'Hati',tchau:'Dadah',suave:'Lembut',neon_l:'Neon',por:'Senja',rosto:'Wajah',meio:'Setengah badan',inteiro:'Seluruh badan',nenhum:'Tidak ada',balao:'Balon',microfone:'Mikrofon',lightstick:'Lightstick',flor:'Bunga',
      t_luz:'Pemotretan cahaya',t_quadro:'Potret majalah',t_objeto:'Sampul dengan properti'},
    th:{tit:'Photo⭐Studio!',aba1:'สตูดิโอ',aba2:'บอร์ด',publicar:'โพสต์ลงบอร์ด',publicado:'โพสต์ลงบอร์ดของสัปดาห์แล้ว!',ja:'วันนี้คุณโพสต์รูปไปแล้ว',vazio:'สัปดาห์นี้ยังไม่มีใครโพสต์ เป็นรูปแรกเลย!',capa:'ปกประจำสัปดาห์',parcial:'นำอยู่ตอนนี้',sua:'รูปของคุณ',dicaMural:'วันละหนึ่งรูป กด ❤️ ให้รูปที่ชอบ: รูปที่ได้ใจมากที่สุดจะขึ้นปก Idol⭐News!',pauta:'โจทย์วันนี้',fundo:'ฉากหลัง',pose:'ท่าทาง',luz:'แสง',quadro:'มุมกล้อง',objeto:'พร็อพ',clique:'📸 ถ่ายเลย!',outra:'ถ่ายอีกรูป',salvar:'บันทึกรูป',
      treino:'ฝึกแบบไม่มีบัญชี: เข้าสู่ระบบเพื่อให้ช่างภาพตรวจและรับ ★5',premio:'+★5 จากรูปสมบูรณ์แบบวันนี้!',erro:'ไม่สำเร็จ ลองอีกครั้ง',estrelas:'{n} จาก 3 ดาว',falta:'ขาดจากโจทย์: {x}',perfeita:'ครบตามโจทย์!',
      rosa:'ฉากชมพู',cortina:'หน้าต่าง',nuvens:'ก้อนเมฆ',neon:'นีออน',normal:'ปกติ',v:'ท่า V ✌',coracao:'หัวใจ',tchau:'โบกมือ',suave:'นุ่มนวล',neon_l:'นีออน',por:'พระอาทิตย์ตก',rosto:'ใบหน้า',meio:'ครึ่งตัว',inteiro:'เต็มตัว',nenhum:'ไม่มี',balao:'ลูกโป่ง',microfone:'ไมโครโฟน',lightstick:'แท่งไฟ',flor:'ดอกไม้',
      t_luz:'ถ่ายเล่นแสง',t_quadro:'ภาพนิตยสาร',t_objeto:'ปกพร้อมพร็อพ'},
    ja:{tit:'Photo⭐Studio!',aba1:'スタジオ',aba2:'掲示板',publicar:'掲示板に投稿',publicado:'今週の掲示板に投稿しました！',ja:'今日はもう投稿しました。',vazio:'今週はまだ投稿がありません。最初の一枚になろう！',capa:'今週の表紙',parcial:'現在トップ',sua:'あなたの写真',dicaMural:'投稿は1日1枚。好きな写真に❤️を：一番人気がIdol⭐News!の表紙に！',pauta:'今日のお題',fundo:'背景',pose:'ポーズ',luz:'ライト',quadro:'フレーミング',objeto:'小物',clique:'📸 パシャ！',outra:'もう一枚',salvar:'写真を保存',
      treino:'アカウントなしの練習：ログインするとカメラマンが判定して★5がもらえます。',premio:'今日のパーフェクト写真で★5！',erro:'うまくいきませんでした。もう一度試してね。',estrelas:'3つ中{n}つ星',falta:'お題で足りないもの：{x}',perfeita:'お題コンプリート！',
      rosa:'ピンク背景',cortina:'窓',nuvens:'くも',neon:'ネオン',normal:'ふつう',v:'Vサイン ✌',coracao:'ハート',tchau:'バイバイ',suave:'やわらか',neon_l:'ネオン',por:'夕焼け',rosto:'顔',meio:'上半身',inteiro:'全身',nenhum:'なし',balao:'風船',microfone:'マイク',lightstick:'ペンライト',flor:'花',
      t_luz:'ライト撮影',t_quadro:'雑誌のポートレート',t_objeto:'小物の表紙'}
  };
  // Tema da semana: muda todo domingo 0h de Brasília (mesma régua da música da semana). Só um selo local no mural.
  var TEMAS = [
    ['neon', function(e){ return e.fundo === 'neon' || e.luz === 'neon'; }],
    ['ceu', function(e){ return e.fundo === 'nuvens'; }],
    ['sol', function(e){ return e.luz === 'por'; }],
    ['flores', function(e){ return (String(e.objeto || '').indexOf('flor_') === 0 || arranjoFlores(e.objeto).length>0); }],
    ['palco', function(e){ return e.objeto === 'microfone' || e.objeto === 'lightstick'; }],
    ['close', function(e){ return e.quadro === 'rosto'; }],
    ['fofura', function(e){ return e.pose === 'coracao'; }]
  ];
  var T_TEMA = {
    pt:{rot:'Tema da semana',dica:'Publique no mural uma foto no tema: ★3 uma vez por semana.',premio:'+★{n} pelo tema da semana!',ok:'Sua cena está no tema!',selo:'No tema',neon:'Noite neon',ceu:'Dia de céu azul',sol:'Pôr do sol',flores:'Semana das flores',palco:'Clima de palco',close:'Close de revista',fofura:'Fofura máxima'},
    en:{rot:'Theme of the week',dica:'Post an on-theme photo to the board: ★3 once a week.',premio:'+★{n} for the theme of the week!',ok:'Your scene matches the theme!',selo:'On theme',neon:'Neon night',ceu:'Blue sky day',sol:'Sunset',flores:'Flower week',palco:'Stage vibes',close:'Magazine close-up',fofura:'Max cuteness'},
    es:{rot:'Tema de la semana',dica:'Publica en el mural una foto en el tema: ★3 una vez por semana.',premio:'¡+★{n} por el tema de la semana!',ok:'¡Tu escena está en el tema!',selo:'En el tema',neon:'Noche neón',ceu:'Día de cielo azul',sol:'Atardecer',flores:'Semana de las flores',palco:'Ambiente de escenario',close:'Primer plano de revista',fofura:'Ternura máxima'},
    id:{rot:'Tema minggu ini',dica:'Unggah foto sesuai tema ke papan: ★3 seminggu sekali.',premio:'+★{n} untuk tema minggu ini!',ok:'Adeganmu sesuai tema!',selo:'Sesuai tema',neon:'Malam neon',ceu:'Hari langit biru',sol:'Senja',flores:'Minggu bunga',palco:'Suasana panggung',close:'Close-up majalah',fofura:'Super imut'},
    th:{rot:'ธีมประจำสัปดาห์',dica:'โพสต์รูปที่ตรงธีมบนบอร์ด: รับ ★3 สัปดาห์ละครั้ง',premio:'+★{n} จากธีมประจำสัปดาห์!',ok:'ฉากของคุณตรงธีมแล้ว!',selo:'ตรงธีม',neon:'คืนนีออน',ceu:'วันฟ้าใส',sol:'พระอาทิตย์ตก',flores:'สัปดาห์ดอกไม้',palco:'บรรยากาศเวที',close:'โคลสอัปนิตยสาร',fofura:'น่ารักสุดๆ'},
    ja:{rot:'今週のテーマ',dica:'テーマに合った写真を掲示板に投稿すると、週に1回★3！',premio:'今週のテーマで★{n}！',ok:'シーンがテーマにぴったり！',selo:'テーマ',neon:'ネオンナイト',ceu:'青空の日',sol:'夕やけ',flores:'お花ウィーク',palco:'ステージ気分',close:'雑誌風アップ',fofura:'かわいさMAX'}
  };
  function temaSemana(){ var sem = Math.floor((Date.now() - Date.UTC(2026, 10, 1, 3)) / 6048e5); return TEMAS[((sem % TEMAS.length) + TEMAS.length) % TEMAS.length]; }
  function tt(k){ var d = T_TEMA[L()] || T_TEMA.pt; return d[k] || T_TEMA.pt[k] || k; }
  function noTema(e){ try{ return !!(e && temaSemana()[1](e)); }catch(_){ return false; } }
  function temaHtml(atual){
    var tm = temaSemana(), ok = atual && noTema(atual);
    return '<div class="sttema' + (ok ? ' ok' : '') + '"><b>🗓️ ' + esc(tt('rot')) + ': ' + esc(tt(tm[0])) + '</b><span>' + esc(ok ? '✨ ' + tt('ok') : tt('dica')) + '</span></div>';
  }
  function L(){ return typeof LANG === 'string' && T[LANG] ? LANG : 'pt'; }
  function t(k){ return T[L()][k] || T.pt[k] || k; }
  function nomeOpc(tipo, v){ if(arranjoFlores(v).length)return referenciaT()[3]; if(v.indexOf('flor_') === 0){ var B = window.BLOOM_TR, k = v.slice(5); return (B && (B[L()] || B.pt)[k]) || t('flor'); } return t(tipo === 'luz' && v === 'neon' ? 'neon_l' : v); }
  // Sem emoji nos botões: cenário, luz e flores ganham uma amostra de cor desenhada; o resto é só o nome.
  var AMOSTRA = {fundo:{rosa:'linear-gradient(160deg,#ffe3f1,#ffb3d6)',cortina:'linear-gradient(160deg,#dff1ff,#fff 55%,#bfe0ff)',nuvens:'linear-gradient(180deg,#9fd4ff,#fff)',neon:'linear-gradient(135deg,#7b3ff0,#ff6fb5)'},
    luz:{suave:'radial-gradient(circle at 35% 35%,#fff,#ffe9b8)',neon:'linear-gradient(135deg,#ff5fd2,#4dd8ff)',por:'linear-gradient(180deg,#ffb35c,#ff7fa8)'},
    flor:{sakura:'#ff93c0',tulipa:'#f26a93',girassol:'#f8b62a',lunar:'#ab8ef6'}};
  function emo(){ return ''; }
  function marca(tipo, v){
    var g = v.indexOf('flor_') === 0 ? AMOSTRA.flor[v.slice(5)] : (AMOSTRA[tipo] || {})[v];
    return g ? '<i class="stsw" style="background:' + g + '" aria-hidden="true"></i>' : '';
  }
  function esc(s){ return typeof escHtml === 'function' ? escHtml(s) : String(s); }
  var aba = 'estudio', mural = null, publicou = false, ov = null, anim = 0, pauta = null, servidor = false, esc_ = {fundo:'rosa',pose:'v',luz:'suave',quadro:'inteiro',objeto:'nenhum'}, flores = {}, fase = 'monta', foto = null, msg = '', ocupado = false, cont = 0;
  var sessao = 0, donoSessao = null, muralCarregando = false, muralErro = false, escolheuObjeto = false;
  var FAVORITA_TR = {
    pt:['Guardar composição','Usar composição favorita','Composição guardada neste aparelho.','Composição aplicada.','Substituir composição favorita'],
    en:['Save composition','Use favorite composition','Composition saved on this device.','Composition applied.','Replace favorite composition'],
    es:['Guardar composición','Usar composición favorita','Composición guardada en este dispositivo.','Composición aplicada.','Reemplazar composición favorita'],
    id:['Simpan komposisi','Gunakan komposisi favorit','Komposisi tersimpan di perangkat ini.','Komposisi diterapkan.','Ganti komposisi favorit'],
    th:['บันทึกองค์ประกอบภาพ','ใช้ภาพจัดองค์ประกอบโปรด','บันทึกองค์ประกอบภาพในอุปกรณ์แล้ว','ใช้องค์ประกอบภาพแล้ว','แทนที่องค์ประกอบภาพโปรด'],
    ja:['構図を保存','お気に入りの構図を使う','端末に構図を保存しました。','構図を適用しました。','お気に入りの構図を上書き']
  };
  var CAMPOS_COMPOSICAO = {fundo:FUNDOS,pose:POSES,luz:LUZES,quadro:QUADROS};
  var favorita = null, chaveFavorita = null;
  var referenciaUrl = '', referenciaCarregando = false, referenciaObjeto = '', arranjoStudio = '';
  var REFERENCIA_TR = {
    pt:['Foto de referência','Esta foto antiga pode servir de guia visual.','Não foi possível abrir a referência.','Arranjo de flores','Arranjo guardado na foto local.'],
    en:['Reference photo','Use this older photo as a visual guide.','Could not open the reference.','Flower arrangement','Arrangement saved in your local photo.'],
    es:['Foto de referencia','Usa esta foto antigua como guía visual.','No se pudo abrir la referencia.','Arreglo floral','Arreglo guardado en la foto local.'],
    id:['Foto referensi','Gunakan foto lama ini sebagai panduan visual.','Foto referensi gagal dibuka.','Rangkaian bunga','Rangkaian disimpan di foto lokal.'],
    th:['ภาพอ้างอิง','ใช้ภาพเก่านี้เป็นแนวทางได้','เปิดภาพอ้างอิงไม่ได้','ช่อดอกไม้','บันทึกช่อดอกไม้ในภาพบนอุปกรณ์แล้ว'],
    ja:['参考写真','以前の写真を見ながら撮影できます。','参考写真を開けませんでした。','花のアレンジ','この端末の写真にアレンジを保存しました。']
  };
  function referenciaT(){return REFERENCIA_TR[L()] || REFERENCIA_TR.pt;}
  function limparReferencia(){
    if(referenciaUrl)URL.revokeObjectURL(referenciaUrl);
    referenciaUrl='';referenciaCarregando=false;referenciaObjeto='';
  }
  function arranjoFlores(item){
    if(typeof item!=='string' || item.indexOf('arranjo_')!==0)return [];
    var lista=item.slice(8).split('+');
    return lista.length>=2 && lista.length<=3 && new Set(lista).size===lista.length &&
      lista.every(function(k){return FLORES.indexOf(k)>=0;}) ? lista : [];
  }
  function arranjoDisponivel(item){
    var lista=arranjoFlores(item);
    return lista.length>0 && lista.every(function(k){return +flores[k]>0;});
  }
  function aplicarObjetoReferencia(){
    var item=referenciaObjeto;
    if(escolheuObjeto || fase!=='monta' || typeof item!=='string')return;
    if(OBJ.indexOf(item)>=0)esc_.objeto=item;
    else if(item.indexOf('flor_')===0 && +flores[item.slice(5)]>0)esc_.objeto=item;
    else if(arranjoDisponivel(item)){arranjoStudio=item;esc_.objeto=item;}
  }
  function aplicarReferencia(atalho,sess,dono){
    if(!atalho || !atalho.referencia || !window.TW_ALBUM_FOTOS)return;
    referenciaCarregando=true;
    TW_ALBUM_FOTOS.referencia(atalho.referencia,atalho.donoAlbum).then(function(ref){
      if(!sessaoAtiva(sess,dono))return;
      if(!ref)throw Error('referencia');
      referenciaUrl=URL.createObjectURL(ref.blob);
      var campos=composicaoValida(ref.composicao);
      if(campos){
        Object.assign(esc_,campos);
        referenciaObjeto=ref.composicao.objeto;aplicarObjetoReferencia();
      }else msg=referenciaT()[1];
    }).catch(function(){if(sessaoAtiva(sess,dono))msg=referenciaT()[2];}).then(function(){
      if(sessaoAtiva(sess,dono)){referenciaCarregando=false;ui();}
    });
  }

  function composicaoChave(){
    var id = logado() && (contaJ.id || contaJ.nick);
    if(logado() && typeof contaAuthUserId === 'string' && contaAuthUserId) id = contaAuthUserId;
    return 'tw_studio_composicao_v1:' + (id ? 'conta:' + encodeURIComponent(id) : 'visitante');
  }
  function composicaoValida(dados){
    if(!dados) return null;
    var campos = Object.keys(CAMPOS_COMPOSICAO);
    if(!campos.every(function(k){ return CAMPOS_COMPOSICAO[k].indexOf(dados[k]) >= 0; })) return null;
    return {fundo:dados.fundo,pose:dados.pose,luz:dados.luz,quadro:dados.quadro};
  }
  function composicaoAcao(acao){
    if(fase !== 'monta' || aba !== 'estudio' || chaveFavorita !== composicaoChave()) return;
    var texto = FAVORITA_TR[L()];
    if(acao === 'usar-composicao' && favorita){
      Object.assign(esc_, favorita);
      msg = texto[3];
    }else if(acao === 'guardar-composicao'){
      var campos = composicaoValida(esc_);
      try{
        if(!campos) throw Error('composicao');
        localStorage.setItem(chaveFavorita, JSON.stringify(campos));
        favorita = campos;
        msg = texto[2];
      }catch(e){ msg = t('erro'); }
    }
    ui();
    var alvo = ov.querySelector('[data-st="' + acao + '"]');
    if(alvo) alvo.focus({preventScroll:true});
  }
  var MURAL_REDE = {
    pt:['Não foi possível atualizar o Mural.','Tentar novamente'],
    en:['Could not refresh the board.','Try again'],
    es:['No se pudo actualizar el mural.','Reintentar'],
    id:['Papan tidak dapat diperbarui.','Coba lagi'],
    th:['อัปเดตบอร์ดไม่สำเร็จ','ลองอีกครั้ง'],
    ja:['掲示板を更新できませんでした。','再試行']
  };
  function sessaoAtiva(sess, dono){
    return sess === sessao && ov && !ov.hidden && dono === donoFoto();
  }
  var MOMENTOS = {
    pt:['Guardar em Momentos','Guardada em Momentos!'],en:['Keep in Moments','Saved to Moments!'],
    es:['Guardar en Momentos','¡Guardada en Momentos!'],id:['Simpan di Momen','Tersimpan di Momen!'],
    th:['เก็บในโมเมนต์','เก็บในโมเมนต์แล้ว!'],ja:['思い出に保存','思い出に保存しました！']
  };
  function donoFoto(){ return typeof petPhoneFotoChave === 'function' ? petPhoneFotoChave() : (logado() && (contaJ.id || contaJ.nick)) || ''; }
  var HISTORICO = {
    pt:'Publicada! O figurino histórico ainda não foi confirmado pelo servidor.',
    en:'Posted! The server has not confirmed the historical look yet.',
    es:'¡Publicada! El servidor aún no confirmó el look histórico.',
    id:'Dipublikasikan! Server belum mengonfirmasi riwayat penampilan.',
    th:'เผยแพร่แล้ว! เซิร์ฟเวอร์ยังไม่ยืนยันชุดในภาพ',
    ja:'投稿しました！サーバーはまだ衣装の保存を確認していません。'
  };
  var PARTILHA = {
    pt:'No Mural, seu figurino e cenário ficam visíveis para outros Idols. O PNG fica no aparelho.',
    en:'On the board, other Idols can see your look and scene. The PNG stays on your device.',
    es:'En el mural, otros Idols pueden ver tu look y escena. El PNG queda en tu dispositivo.',
    id:'Di papan, Idol lain dapat melihat penampilan dan latarmu. PNG tetap di perangkatmu.',
    th:'บนบอร์ด ไอดอลคนอื่นจะเห็นชุดและฉากของคุณ ไฟล์ PNG อยู่บนอุปกรณ์ของคุณ',
    ja:'掲示板では他のアイドルに衣装とシーンが公開されます。PNGは端末に残ります。'
  };
  function podeGuardar(){ return foto && !foto.guardada && logado() && foto.dono === donoFoto() &&
    typeof petAtivo === 'function' && petAtivo() && typeof petPhoneMomentoAdicionar === 'function'; }
  window.TW_STUDIO_ON = true;
  // Retrato v1: somente dados de desenho, sem nick, ID, saldo, inventário, save ou PNG.
  function retratoSeguro(r){
    if(!r || r.v !== 1 || !r.avatar || typeof r.avatar !== 'object' || Array.isArray(r.avatar) ||
      !r.avatar.c || typeof r.avatar.c !== 'object' || Array.isArray(r.avatar.c) ||
      typeof r.tempo !== 'number' || !Number.isFinite(r.tempo) || r.tempo < 0 || r.tempo > 31536000) return null;
    var src = r.avatar, c = {}, av = {c:c};
    function cor(v){ return typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v); }
    function chave(v){ return typeof v === 'string' && /^[a-z0-9_-]{0,32}$/i.test(v); }
    ['hair','hair2','skin','eye','outcol','legcol'].forEach(function(k){ if(cor(src.c[k])) c[k] = src.c[k]; });
    ['mecha','back','front','det','gl','out','baixo','hat','olho','boca','bochecha','sobrancelha'].forEach(function(k){ if(chave(src.c[k])) c[k] = src.c[k]; });
    if(typeof src.c.streak === 'boolean') c.streak = src.c.streak;
    ['a','visual'].forEach(function(k){ if(chave(src[k])) av[k] = src[k]; });
    if(cor(src.cor)) av.cor = src.cor;
    if(Number.isInteger(src.expr) && src.expr >= 0 && src.expr <= 6) av.expr = src.expr;
    var pet = src.pet;
    if(pet && ['tsu','lirika','pati','meu'].indexOf(pet.k) >= 0){
      av.pet = {k:pet.k};
      if(chave(pet.acc)) av.pet.acc = pet.acc;
      if(typeof pet.bochecha === 'boolean') av.pet.bochecha = pet.bochecha;
      if(pet.k === 'meu' && pet.cfg && typeof pet.cfg === 'object' && !Array.isArray(pet.cfg)){
        var cfg = av.pet.cfg = {};
        var op = {orelha:['gato','coala','coroa','coelho','nenhuma'],olhos:['redondo','brilho','feliz','sono'],acc:['','laco','estrela','anel','oculos','flor']};
        Object.keys(op).forEach(function(k){ if(op[k].indexOf(pet.cfg[k]) >= 0) cfg[k] = pet.cfg[k]; });
        if(cor(pet.cfg.cor)) cfg.cor = pet.cfg.cor;
        if(typeof pet.cfg.bochecha === 'boolean') cfg.bochecha = pet.cfg.bochecha;
      }
    }
    return {v:1,avatar:av,tempo:r.tempo};
  }
  function retratoPost(post, proprio){
    var r = retratoSeguro(post && post.retrato);
    return r ? {avatar:r.avatar,tempo:r.tempo} : {avatar:proprio ? null : (post && post.avatar || {}),tempo:1};
  }
  window.TW_STUDIO_RETRATO = {limpar:retratoSeguro, ler:retratoPost};
  function hojeBR(){ return new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10); }
  function h(s){ var x = 0; for(var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) >>> 0; return x; }
  function pautaLocal(){ var d = hojeBR(), k = h(d + 'k') % 3, tp = ['luz','quadro','objeto'][k], L2 = {luz:LUZES,quadro:QUADROS,objeto:OBJ.slice(1)}[tp];
    return {dia:d, fundo:FUNDOS[h(d + 'f') % 4], pose:POSES[h(d + 'p') % 4], detalhe:{tipo:tp, valor:L2[h(d + 'v') % L2.length]}}; }
  function logado(){ return typeof contaJ !== 'undefined' && contaJ && typeof contaRpc === 'function'; }
  function acertos(){ if(!pauta) return [false,false,false]; return [esc_.fundo === pauta.fundo, esc_.pose === pauta.pose, esc_[pauta.detalhe.tipo] === pauta.detalhe.valor]; }

  var categoriaStudio='fundo', pautaAberta=false;
  function montarOv(){
    if(ov) return;
    ov = document.createElement('div'); ov.className = 'ov studioov tw-window-overlay'; ov.id = 'studioOv'; ov.hidden = true;
    ov.innerHTML = '<div class="panel studiop tw-modal tw-window tw-window-surface" role="dialog" aria-modal="true" aria-labelledby="studioTit">' +
      '<button type="button" class="perfx tw-window-control tw-window-close" id="studioX" aria-label="✕">✕</button>' +
      '<h2 class="tw-modal-title" id="studioTit"></h2><small class="tw-modal-jp" lang="ja">フォトスタジオ</small>' +
      '<div class="stabas" id="studioAbas"></div><details id="studioPauta"><summary></summary><div></div></details>' +
      '<div class="stbancada"><div id="studioVisor"><canvas id="studioCv" width="480" height="680"></canvas><div id="studioAcao"></div></div><div id="studioCorpo"></div></div><div id="studioMural" hidden></div>' +
      (typeof twLinkBotao === 'function' ? twLinkBotao('studio') : '') + '</div>';
    document.body.appendChild(ov);
    ov.querySelector('#studioPauta').addEventListener('toggle',function(){pautaAberta=this.open;});
    ov.addEventListener('click', function(e){
      if(e.target === ov || e.target.id === 'studioX'){ fechar(); return; }
      if(donoSessao !== donoFoto()){ fechar(); return; }
      var b = e.target.closest && e.target.closest('[data-st]'); if(!b || ocupado) return;
      var a = b.getAttribute('data-st'), v = b.getAttribute('data-v');
      if(a === 'categoria'){
        categoriaStudio=v;ui();
        ov.querySelector('[data-st="categoria"][aria-pressed="true"]').focus({preventScroll:true});
        return;
      }
      if(a === 'aba'){ aba = v; ui(); if(aba === 'mural') carregarMural(); return; }
      if(a === 'guardar-composicao' || a === 'usar-composicao'){ composicaoAcao(a); return; }
      if(a === 'mural-retry'){ carregarMural(); return; }
      if(a === 'duo' && logado() && typeof duoAbrir === 'function'){ fechar(); duoAbrir(); return; }
      if(a === 'momentos' && foto && foto.guardada){ studioMomentos(); return; }
      if(a === 'publicar'){ publicar(); return; }
      if(a === 'curtir'){ curtir(+v, b); return; }
      if(a === 'clique') clicar(); else if(a === 'outra'){ fase = 'monta'; foto = null; msg = ''; ui(); }
      else if(a === 'salvar') salvar();
      else if(a === 'serie' && foto && !foto.serie && !foto.seriePendente && foto.dono === donoFoto() && window.TW_ALBUM_FOTOS){
        var selecionada = foto;
        selecionada.seriePendente = true;
        TW_ALBUM_FOTOS.salvar('studio',polaroidLimpa(selecionada),b,selecionada.escolhas,{edicao:selecionada.edicao}).then(function(ok){
          selecionada.seriePendente = false;
          if(ok) selecionada.serie = true;
          else if(foto === selecionada && !b.isConnected) ui();
        });
      }
      else if(a === 'guardar') guardar();
      else if(esc_.hasOwnProperty(a)){
        var tinhaFoco = document.activeElement === b;
        if(a === 'objeto') escolheuObjeto = true;
        esc_[a] = v; ui();
        if(tinhaFoco){
          var selecionado = ov.querySelector('[data-st="' + a + '"][aria-pressed="true"]');
          if(selecionado) selecionado.focus({preventScroll:true});
        }
        if(typeof beep === 'function') try{ beep(988, .04, 'triangle', .03); }catch(er){}
      }
    });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && ov && !ov.hidden) fechar(); });
  }
  var pilotoStudio = null, lookTemporario=null;
  function abrir(atalho){
    montarOv();
    limparReferencia(); arranjoStudio='';categoriaStudio='fundo';pautaAberta=false;
    pilotoStudio = window.TW_PILOTO_BAIRRO && atalho && atalho.piloto || null;
    var sess = ++sessao, dono = donoFoto();
    lookTemporario=atalho&&atalho.dono===dono&&atalho.look?{dono:dono,av:atalho.look,aviso:atalho.aviso}:null;
    var flor = atalho && atalho.dono === dono && FLORES.indexOf(atalho.flor) >= 0 ? atalho.flor : '';
    if(dono !== donoSessao){
      mural = null;
      esc_.objeto = 'nenhum';
    }
    donoSessao = dono;
    var chave = composicaoChave();
    if(chaveFavorita !== null && chaveFavorita !== chave){
      Object.assign(esc_, {fundo:'rosa',pose:'v',luz:'suave',quadro:'inteiro'});
    }
    chaveFavorita = chave;
    favorita = null;
    try{ favorita = composicaoValida(JSON.parse(localStorage.getItem(chave))); }catch(e){}
    muralCarregando = muralErro = false;
    flores = {}; escolheuObjeto = false;
    if(esc_.objeto.indexOf('flor_') === 0 || arranjoFlores(esc_.objeto).length) esc_.objeto = 'nenhum';
    if(atalho && window.TW_JANELAS) TW_JANELAS.preparar(ov,atalho.origem);
    ocupado = false; ov.hidden = false; aba = 'estudio'; publicou = false;
    if(pilotoStudio && FUNDOS.indexOf(pilotoStudio.fundo) >= 0) esc_.fundo = pilotoStudio.fundo;
    fase = 'monta'; foto = null; msg = ''; servidor = false; pauta = pilotoStudio ? null : pautaLocal();
    var querReferencia=atalho && atalho.referencia && logado() && !pilotoStudio;
    referenciaCarregando=!!querReferencia;
    ui(); laco();
    if(querReferencia)aplicarReferencia(atalho,sess,dono);
    if(logado() && !pilotoStudio){
      contaRpc('studio_pauta').then(function(r){
        if(sessaoAtiva(sess, dono) && r && r.ok){ pauta = r; servidor = true; ui(); }
      }).catch(function(){});
      contaRpc('jardim_estado').then(function(r){
        if(!sessaoAtiva(sess, dono) || !r || !r.ok) return;
        flores = r.flores || {};
        if(flor && +flores[flor] > 0 && fase === 'monta' && !escolheuObjeto){esc_.objeto = 'flor_' + flor;categoriaStudio='objeto';}
        var arranjo=atalho && atalho.dono === dono && Array.isArray(atalho.arranjo) ? 'arranjo_'+atalho.arranjo.join('+') : '';
        if(arranjoDisponivel(arranjo) && fase==='monta' && !escolheuObjeto){arranjoStudio=arranjo;esc_.objeto=arranjo;categoriaStudio='objeto';}
        if(querReferencia)aplicarObjetoReferencia();
        ui();
      }).catch(function(){});
    }
  }
  function fechar(){ limparReferencia(); lookTemporario=null; sessao++; if(ov) ov.hidden = true; cancelAnimationFrame(anim); anim = 0; }
  function clicar(){
    if(referenciaCarregando)return;
    var sess = sessao, dono = donoFoto();
    fase = 'contagem'; cont = performance.now(); ocupado = true; ui();
    if(pilotoStudio && esc_.fundo === pilotoStudio.fundo) TW_PILOTO_BAIRRO.iniciar('studio',pilotoStudio);
    if(window.TW_CELULAR && typeof window.TW_CELULAR.estreiaEtapa === 'function') window.TW_CELULAR.estreiaEtapa('studio', false);
    if(typeof twJogoSom === 'function'){ twJogoSom('toque'); setTimeout(function(){ twJogoSom('toque'); }, 600); setTimeout(function(){ twJogoSom('toque'); }, 1200); }
    setTimeout(function(){
      if(sess !== sessao) return;
      if(dono !== donoFoto()){ fase = 'monta'; ocupado = false; ui(); return; }
      var ac = acertos(), n = Math.max(1, ac.filter(Boolean).length);
      if(typeof twJogoSom === 'function'){ twJogoSom('flash'); setTimeout(function(){ twJogoSom(n >= 3 ? 'vitoria' : 'ponto'); }, 450); }
      else if(typeof beep === 'function') try{ beep(1760, .05, 'square', .03); }catch(e){}
      foto = {avatar:JSON.parse(JSON.stringify(meuAv() || {})),estrelas:n, escolhas:JSON.parse(JSON.stringify(esc_)), t0:performance.now(), dia:hojeBR(), legenda:pauta ? t('t_' + pauta.detalhe.tipo) : '', dono:dono, verificada:false, premio:0};
      foto.retrato = retratoSeguro({v:1,avatar:foto.avatar,tempo:foto.t0 / 1000});
      // PNG local conserva o avatar original; somente o retrato público é filtrado.
      var capturada = foto;
      try{ capturarCena(capturada); }catch(e){ foto = null; fase = 'monta'; ocupado = false; msg = t('erro'); ui(); return; }
      if(window.TW_CELULAR && typeof window.TW_CELULAR.estreiaEtapa === 'function') window.TW_CELULAR.estreiaEtapa('studio', true);
      if(pilotoStudio){
        if(esc_.fundo === pilotoStudio.fundo && TW_PILOTO_BAIRRO.concluir('studio',pilotoStudio,capturada.cena))capturada.edicao=TW_PILOTO_BAIRRO.edicao(pilotoStudio);
        fase = 'foto'; ocupado = false; ui(); return;
      }
      if(!logado() && window.TW_HUMOR) window.TW_HUMOR.treino('studio');
      if(arranjoFlores(capturada.escolhas.objeto).length){
        fase='foto';ocupado=false;msg=referenciaT()[4];ui();return;
      }
      if(lookTemporario || !logado() || !servidor){ fase = 'foto'; ocupado = false; msg = logado() ? '' : t('treino'); ui(); return; }
      contaRpc('studio_clique', {p:capturada.escolhas}).then(function(r){
        if(sess !== sessao || dono !== donoFoto() || foto !== capturada) return;
        if(r && r.ok){
          if(window.TWVidaCidade)window.TWVidaCidade.registrar('studio_clique',{id:pauta&&pauta.dia});if(typeof twMissoesAtualizar==='function')twMissoesAtualizar();
          foto.estrelas = +r.estrelas || n; foto.verificada = true; foto.premio = +r.premio || 0;
          if(foto.premio && typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} if(typeof setBest === 'function') try{ setBest(); }catch(e){} }
          msg = foto.premio ? t('premio') : '';
        } else msg = t('erro');
      }).catch(function(){ if(sess === sessao && dono === donoFoto()) msg = t('erro'); }).then(function(){ if(sess !== sessao) return; if(dono !== donoFoto()){ foto = null; fase = 'monta'; } else fase = 'foto'; ocupado = false; ui(); });
    }, 1900);
  }
  function capturarCena(f){
    var cv = document.createElement('canvas'); cv.width = 432; cv.height = 540;
    cena(cv.getContext('2d'), cv.width, cv.height, f.escolhas, f.t0 / 1000, f.avatar);
    f.cena = cv;
  }
  function polaroidLimpa(f){
    if(f.polaroid) return f.polaroid;
    var cv = document.createElement('canvas'); cv.width = 480; cv.height = 680;
    var x = cv.getContext('2d'), W = cv.width, H = cv.height;
    x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); x.drawImage(f.cena, 24, 24);
    x.fillStyle = '#3c2a8f'; x.textAlign = 'center'; x.font = '30px "Mochiy Pop One",sans-serif';
    x.fillText('⭐'.repeat(f.estrelas) + '☆'.repeat(3 - f.estrelas), W / 2, H - 76);
    x.font = '16px "Mochiy Pop One",sans-serif'; x.fillStyle = '#b83a9e';
    x.fillText('Photo⭐Studio! · ' + f.legenda + ' · ' + f.dia.split('-').reverse().slice(0, 2).join('/'), W / 2, H - 40);
    f.polaroid = cv; return cv;
  }
  function fotoUrl(f){
    if(!f.url) f.url = polaroidLimpa(f).toDataURL('image/png');
    return f.url;
  }
  function salvar(){
    if(!foto || fase !== 'foto' || foto.dono !== donoFoto()) return;
    try{ var a = document.createElement('a'); a.download = 'photo-studio-' + foto.dia + '.png'; a.href = fotoUrl(foto); document.body.appendChild(a); a.click(); a.remove(); }catch(e){ msg = t('erro'); ui(); }
  }
  function guardar(){
    if(!podeGuardar() || fase !== 'foto') return;
    try{
      var especie = foto.escolhas.objeto.indexOf('flor_') === 0 ? foto.escolhas.objeto.slice(5) : '';
      var id = petPhoneMomentoAdicionar('studio', fotoUrl(foto), especie);
      if(!id) throw Error('momento');
      foto.guardada = id; msg = MOMENTOS[L()][1]; ui();
    }catch(e){ msg = t('erro'); ui(); }
  }
  function studioMomentos(){
    if(!logado() || typeof petAtivo !== 'function' || !petAtivo()) return;
    var dono = donoFoto(), sess = sessao, id = foto.guardada;
    TW_CARGA.abrir('Backstage⭐Pet!', petSalaCarregar, function(){
      if(!sessaoAtiva(sess, dono)) return;
      petVeioHub = true;
      petOpenUI();
      if(petOpen && petPhoneAbrir('fotos')){
        petPhoneFotosAbaAbrir('momentos');
        petPhoneMomentoAbrir(id);
        fechar();
      }
    });
  }
  function chips(tipo, lista){
    return '<div class="stgrupo"><b>' + esc(t(tipo)) + '</b><div>' + lista.map(function(v){
      return '<button type="button" class="stchip' + (esc_[tipo] === v ? ' on' : '') + '" data-st="' + tipo + '" data-v="' + v + '" aria-pressed="' + (esc_[tipo] === v) + '"' + (ocupado ? ' disabled' : '') + '>' + marca(tipo, v) + '<span>' + esc(nomeOpc(tipo, v)) + '</span><i class="stcheck" aria-hidden="true">✓</i></button>'; }).join('') + '</div></div>';
  }
  function ui(){
    if(!ov) return;
    ov.querySelector('#studioTit').textContent = t('tit');
    var abas = ov.querySelector('#studioAbas'), noMural = aba === 'mural';
    abas.innerHTML = logado() ? ['estudio','mural'].map(function(k, i){ return '<button type="button" class="stabab' + (aba === k ? ' on' : '') + '" data-st="aba" data-v="' + k + '" aria-pressed="' + (aba === k) + '">' + esc(t(i ? 'aba2' : 'aba1')) + '</button>'; }).join('') : '';
    var visor = ov.querySelector('#studioVisor'), visorAnterior = visor.dataset.fase;
    visor.dataset.fase = fase;
    ov.querySelector('.stbancada').hidden=noMural;
    var pautaBox=ov.querySelector('#studioPauta');
    pautaBox.hidden=noMural || (!pauta && !temaHtml(esc_));
    pautaBox.open=pautaAberta;
    ov.querySelector('#studioMural').hidden = !noMural;
    if(noMural){ muralUI(); return; }
    var ac = acertos(), d = pauta && pauta.detalhe;
    pautaBox.querySelector('summary').textContent=pauta?t('pauta')+' · '+ac.filter(Boolean).length+'/3':t('pauta');
    pautaBox.querySelector('div').innerHTML = pauta ? '<div class="stpauta"><b>' + esc(t('pauta')) + ': ' + esc(t('t_' + d.tipo)) + '</b><span>' +
      [[ac[0], nomeOpc('fundo', pauta.fundo)], [ac[1], nomeOpc('pose', pauta.pose)], [ac[2], nomeOpc(d.tipo, d.valor)]]
        .map(function(p){ return '<i class="' + (p[0] ? 'ok' : '') + '">' + (p[0] ? '✓ ' : '') + esc(p[1]) + '</i>'; }).join('') + '</span></div>' + temaHtml(esc_) : temaHtml(esc_);
    var acao=ov.querySelector('#studioAcao'), obturador=acao.querySelector('[data-st="clique"]');
    var resultados=acao.querySelector('.stresultado-acoes');
    if(!resultados){resultados=document.createElement('div');resultados.className='btns stresultado-acoes';acao.appendChild(resultados);}
    resultados.hidden=fase!=='foto';
    if(!obturador){
      obturador=document.createElement('button');obturador.type='button';obturador.className='btn stclique';
      obturador.dataset.st='clique';acao.appendChild(obturador);
    }
    obturador.hidden=fase==='foto';
    obturador.textContent=t('clique');
    obturador.disabled=ocupado||referenciaCarregando;
    var c = ov.querySelector('#studioCorpo'), hh = '';
    if(referenciaUrl && donoSessao===donoFoto()) hh+='<figure class="st-referencia"><img src="'+esc(referenciaUrl)+
      '" alt="'+esc(referenciaT()[0])+'"><figcaption>'+esc(referenciaT()[0])+'</figcaption></figure>';
    if(fase==='monta' && lookTemporario && lookTemporario.aviso) hh += '<p class="stmsg" role="status">' + esc(lookTemporario.aviso) + '</p>';
    if(msg) hh += '<p class="stmsg" aria-live="polite">' + esc(msg) + '</p>';
    if(fase === 'foto'){
      // As estrelas já estão na polaroid: aqui vai o que faltou na pauta (ou que ela ficou completa).
      var fa = pauta ? [[ac[0], nomeOpc('fundo', pauta.fundo)], [ac[1], nomeOpc('pose', pauta.pose)], [ac[2], nomeOpc(d.tipo, d.valor)]].filter(function(p){ return !p[0]; }).map(function(p){ return p[1]; }) : [];
      resultados.innerHTML=(window.TW_ALBUM_FOTOS&&!foto.serie&&!foto.seriePendente?TW_ALBUM_FOTOS.botao('data-st="serie"'):'')+
        '<button type="button" class="btn" data-st="salvar">💾 '+esc(t('salvar'))+'</button>';
      if(foto.verificada && !publicou) hh += '<p class="stdica">' + esc(PARTILHA[L()]) + '</p>';
      hh += '<p class="stres">' + esc(t('estrelas').replace('{n}', foto.estrelas)) + '</p>' +
        (pauta ? '<p class="stfalta' + (fa.length ? '' : ' ok') + '">' + esc(fa.length ? t('falta').replace('{x}', fa.join(' · ')) : '✓ ' + t('perfeita')) + '</p>' : '') +
        '<div class="btns">' + (foto.verificada && !publicou ? '<button type="button" class="btn" data-st="publicar"' + (ocupado ? ' disabled' : '') + '>' + esc(t('publicar')) + '</button>' : '') + (podeGuardar() ? '<button type="button" class="btn alt" data-st="guardar">💗 ' + esc(MOMENTOS[L()][0]) + '</button>' : '') +
        (pilotoStudio ? (window.TW_PILOTO_BAIRRO ? TW_PILOTO_BAIRRO.aposContribuicao() : '') + '<button type="button" class="btn alt" data-piloto-bairro="rua">Voltar à Rua Fofa</button>' : '') + (foto.guardada ? '<button type="button" class="btn alt" data-st="momentos">📖 ' + 'Momentos⭐' + '</button>' : '') + (logado() ? '<button type="button" class="btn alt" data-st="duo">Moon⭐Duo!</button>' : '') + '<button type="button" class="btn alt" data-st="outra">🔁 ' + esc(t('outra')) + '</button></div>';
    } else {
      var objs = OBJ.concat(FLORES.filter(function(k){ return +flores[k] > 0; }).map(function(k){ return 'flor_' + k; }));
      if(arranjoDisponivel(arranjoStudio))objs.push(arranjoStudio);
      if(esc_.objeto.indexOf('flor_') === 0 && objs.indexOf(esc_.objeto) < 0) esc_.objeto = 'nenhum';
      var categorias={fundo:FUNDOS,pose:POSES,luz:LUZES,quadro:QUADROS,objeto:objs};
      hh += '<div class="stcategorias" role="group" aria-label="'+esc(t('pauta'))+'">'+Object.keys(categorias).map(function(k){
        return '<button type="button" class="stabab" data-st="categoria" data-v="'+k+'" aria-pressed="'+(k===categoriaStudio)+'">'+esc(t(k))+'</button>';
      }).join('')+'</div>'+chips(categoriaStudio,categorias[categoriaStudio]);
      if(fase === 'monta'){
        var ft = FAVORITA_TR[L()];
        hh += '<div class="btns"><button type="button" class="btn alt" data-st="guardar-composicao">' + esc(ft[favorita ? 4 : 0]) + '</button>' +
          (favorita ? '<button type="button" class="btn alt" data-st="usar-composicao">' + esc(ft[1]) + '</button>' : '') + '</div>';
      }
      if(!logado()) hh += '<p class="stdica">' + esc(t('treino')) + '</p>';
    }
    c.innerHTML = hh; desenhar();
    if(fase === 'foto' && visorAnterior === 'contagem' && visor.scrollIntoView) visor.scrollIntoView({block:'nearest'});
  }
  // ---------- Mural da revista (v2) ----------
  function publicar(){
    if(!foto || !logado() || foto.dono !== donoFoto()) return; ocupado = true; ui();
    var capturada = foto, sess = sessao, dono = foto.dono;
    var p = Object.assign({}, capturada.escolhas);
    if(capturada.retrato) p.retrato = capturada.retrato;
    contaRpc('studio_publicar', {p:p}).then(function(r){
      if(sess !== sessao || dono !== donoFoto() || foto !== capturada) return;
      if(r && r.ok){
        if(window.TWVidaCidade)window.TWVidaCidade.registrar('studio_publicar',{id:pauta&&pauta.dia});
        publicou = true;
        // tema da semana: ★3 uma vez por semana (o servidor confere o tema; studio_publicar)
        if(+r.premio_tema > 0){
          msg = t('publicado') + ' ' + tt('premio').replace('{n}', r.premio_tema);
          if(typeof r.stars === 'number' && typeof starT !== 'undefined'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} if(typeof setBest === 'function') try{ setBest(); }catch(e){} }
          try{ if(typeof twJogoSom === 'function') twJogoSom('vitoria'); }catch(e){}
        } else msg = t('publicado');
        if(capturada.retrato && r.retrato_guardado !== true) msg += ' ' + HISTORICO[L()]; }
      else if(r && r.erro === 'ja_publicou'){ publicou = true; msg = t('ja'); }
      else msg = t('erro');
    }).catch(function(){ if(sess === sessao && dono === donoFoto()) msg = t('erro'); }).then(function(){ if(sess !== sessao) return; if(dono !== donoFoto()){ foto = null; fase = 'monta'; } ocupado = false; ui(); });
  }
  function carregarMural(){
    if(!logado() || muralCarregando) return;
    var sess = sessao, dono = donoFoto();
    muralCarregando = true; muralErro = false; muralUI();
    contaRpc('studio_mural').then(function(lista){
      if(!sessaoAtiva(sess, dono)) return;
      if(Array.isArray(lista)) mural = lista;
      else muralErro = true;
    }).catch(function(){
      if(sessaoAtiva(sess, dono)) muralErro = true;
    }).then(function(){
      if(!sessaoAtiva(sess, dono)) return;
      muralCarregando = false; muralUI();
    });
  }
  function curtir(id, b){
    if(!id || muralCarregando) return;
    var sess = sessao, dono = donoFoto();
    if(b) b.disabled = true;
    contaRpc('studio_curtir', {p_id:id}).then(function(r){
      if(!sessaoAtiva(sess, dono)) return;
      if(r && r.ok && mural){ mural.forEach(function(m){ if(+m.id === id){ m.coracoes = +r.coracoes; m.curti = true; } }); if(typeof beep === 'function') try{ beep(1319, .06, 'triangle', .04); }catch(e){} }
      muralUI();
    }).catch(function(){ if(sessaoAtiva(sess, dono)) muralUI(); });
  }
  function muralUI(){
    var box = ov && ov.querySelector('#studioMural'); if(!box || box.hidden) return;
    var h = temaHtml(null) + '<p class="stdica">' + esc(t('dicaMural')) + '</p>';
    if(muralErro){
      var rede = MURAL_REDE[L()];
      h += '<p class="stmsg" role="status">' + esc(rede[0]) + '</p>' +
        '<button type="button" class="btn alt" data-st="mural-retry">' + esc(rede[1]) + '</button>';
    } else if(muralCarregando || mural === null){
      h += '<p class="perfcarr" role="status">' + esc(typeof tr === 'function' ? tr('Carregando...') : '…') + '</p>';
    }
    if(mural && !mural.length && !muralCarregando && !muralErro) h += '<p class="stmsg">' + esc(t('vazio')) + '</p>';
    h += '<div class="stmural">' + (mural || []).map(function(m, i){
      return '<figure class="stpost"><canvas width="240" height="300" data-stpost="' + i + '"></canvas><figcaption>' + (noTema(m.escolhas) ? '<em class="stselo">✨ ' + esc(tt('selo')) + '</em>' : '') + '<b>' + esc(m.minha ? t('sua') : m.nick) + '</b> ' +
        '<button type="button" class="stcoracao' + (m.curti ? ' on' : '') + '" data-st="curtir" data-v="' + (+m.id) + '"' + (m.curti || m.minha || muralCarregando ? ' disabled' : '') + ' aria-label="❤️">' + (m.curti ? '❤️' : '🤍') + ' ' + (+m.coracoes || 0) + '</button></figcaption></figure>';
    }).join('') + '</div>';
    box.innerHTML = h;
    [].forEach.call(box.querySelectorAll('canvas[data-stpost]'), function(cv){ var m = mural[+cv.getAttribute('data-stpost')];
      var r = retratoPost(m, m.minha);
      try{ polaroid(cv, m.escolhas || {}, r.avatar, +m.estrelas || 1, '', r.tempo); }catch(e){} });
  }
  // polaroid estática (mural e capa do Idol⭐News!)
  function polaroid(cv, e, av, est, legenda, tempo){
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, m = Math.round(W * .05);
    var fw = Math.min(W - 2*m, (H - 5*m) / 1.25), fh = fw * 1.25, left = (W-fw)/2;
    x.fillStyle = '#fff'; x.fillRect(0, 0, W, H);
    x.save(); x.beginPath(); x.rect(left, m, fw, fh); x.clip(); x.translate(left, m); cena(x, fw, fh, e, typeof tempo === 'number' ? tempo : 1, av); x.restore();
    x.fillStyle = '#3c2a8f'; x.textAlign = 'center'; x.font = Math.round(W * .07) + 'px "Mochiy Pop One",sans-serif';
    x.fillText('⭐'.repeat(est) + '☆'.repeat(3 - est), W / 2, H - m * 2.2);
    if(legenda){ x.font = Math.round(W * .05) + 'px "Mochiy Pop One",sans-serif'; x.fillStyle = '#b83a9e'; x.fillText(legenda, W / 2, H - m * .8); }
  }
  window.studioPolaroid = polaroid;
  // ---------- desenho ----------
  function meuAv(){ if(lookTemporario&&lookTemporario.dono===donoFoto())return lookTemporario.av; try{ if(typeof lookAtual === 'function'){
    var av = lookAtual();
    if(typeof perfMeuAv !== 'undefined' && perfMeuAv && perfMeuAv.expr != null) av.expr = perfMeuAv.expr;
    return av;
  } }catch(e){} try{ if(typeof hubAv === 'function') return hubAv(); }catch(e){} return {}; }
  function fundo(x, W, H, f, tm){
    var g;
    if(f === 'rosa'){ g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffd6ea'); g.addColorStop(.75, '#ffeef6'); g.addColorStop(1, '#f7c5dd'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = 'rgba(255,255,255,.5)'; x.beginPath(); x.ellipse(W / 2, H * .9, W * .55, H * .08, 0, 0, 7); x.fill(); }
    else if(f === 'cortina'){ x.fillStyle = '#fff4e6'; x.fillRect(0, 0, W, H); x.fillStyle = '#bfe9ff'; x.fillRect(W * .2, H * .1, W * .6, H * .45); x.fillStyle = '#fff'; x.fillRect(W * .495, H * .1, W * .01, H * .45); x.fillRect(W * .2, H * .32, W * .6, H * .01);
      x.fillStyle = '#ff9bd0'; for(var s = 0; s < 2; s++){ x.beginPath(); x.moveTo(s ? W * .8 : W * .2, H * .06); x.quadraticCurveTo(s ? W * .62 : W * .38, H * .3, s ? W * .74 : W * .26, H * .62); x.lineTo(s ? W * .86 : W * .14, H * .62); x.lineTo(s ? W * .86 : W * .14, H * .06); x.fill(); }
      x.fillStyle = '#f3d3b8'; x.fillRect(0, H * .82, W, H * .18); }
    else if(f === 'nuvens'){ g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#9fd8ff'); g.addColorStop(1, '#fbe7ff'); x.fillStyle = g; x.fillRect(0, 0, W, H);
      x.fillStyle = '#fff'; [[.2, .2, 1], [.75, .32, .8], [.35, .78, 1.3], [.85, .85, 1]].forEach(function(n, i){ var cx = W * n[0] + Math.sin(tm / 2 + i) * W * .0125, cy = H * n[1], r = W * .0625 * n[2];
        x.beginPath(); x.arc(cx, cy, r, 0, 7); x.arc(cx - r, cy + W / 60, r * .7, 0, 7); x.arc(cx + r, cy + W / 80, r * .75, 0, 7); x.fill(); }); }
    else { x.fillStyle = '#1d1238'; x.fillRect(0, 0, W, H); x.lineWidth = 6; x.lineCap = 'round';
      [['#ff6fb5', .12], ['#4dd8ff', .22], ['#b6ff3b', .32]].forEach(function(c, i){ x.strokeStyle = c[0]; x.globalAlpha = .55 + .35 * Math.sin(tm * 2 + i); x.beginPath(); x.arc(W / 2, H * .5, W * (.3 + c[1]), Math.PI * 1.1, Math.PI * 1.9); x.stroke(); });
      x.globalAlpha = 1; x.fillStyle = '#2b1d55'; x.fillRect(0, H * .82, W, H * .18); }
  }
  function luz(x, W, H, l){
    x.save(); var g;
    if(l === 'neon'){ x.globalCompositeOperation = 'screen'; g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, 'rgba(255,80,190,.35)'); g.addColorStop(1, 'rgba(60,200,255,.35)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    else if(l === 'por'){ x.globalCompositeOperation = 'multiply'; g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(255,170,110,.75)'); g.addColorStop(1, 'rgba(255,120,150,.6)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    else { x.globalCompositeOperation = 'screen'; g = x.createRadialGradient(W * .3, H * .2, 10, W * .3, H * .2, W * .9); g.addColorStop(0, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    x.restore();
  }
  function baloes(x, W, H, tm){
    x.save();
    [['#ff6fb5', .16, .2], ['#ffd23f', .26, .14], ['#4dd8ff', .12, .1]].forEach(function(b, i){ var bx = W * b[1], by = H * b[2] + Math.sin(tm * 1.5 + i) * H / 120;
      x.strokeStyle = 'rgba(80,60,120,.5)'; x.lineWidth = 2; x.beginPath(); x.moveTo(bx, by + H * .057); x.quadraticCurveTo(bx + W * .021, H * .45, W * .3, H * .62); x.stroke();
      x.fillStyle = b[0]; x.beginPath(); x.ellipse(bx, by, W * .054, H * .053, 0, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.ellipse(bx - W / 60, by - H / 60, W / 80, H * .015, -.4, 0, 7); x.fill(); });
    x.restore();
  }
  function objetoNaMao(x, item, pose, corpo, cor, quadro){
    // Na paz e no aceno, a mão esquerda segura o objeto e a direita continua livre.
    var mao = pose === 'coracao' ? [20,28.5,.48] :
      pose === 'v' || pose === 'tchau' ? [3,31,-.35] : [27,31,.30];
    var arranjo=arranjoFlores(item), flor = item.indexOf('flor_') === 0 || arranjo.length>0, angulo = mao[2];
    // Em retratos próximos, incline a haste para dentro sem mover a mão da pose.
    if(flor && quadro !== 'inteiro' && pose !== 'coracao'){
      angulo = mao[0] < 15 ? .46 : -.46;
    }
    x.save();
    x.translate(corpo.x + mao[0] * corpo.scale, corpo.y + mao[1] * corpo.scale);
    x.scale(corpo.scale, corpo.scale);
    x.rotate(angulo);
    x.lineCap = 'round';
    if(arranjo.length && typeof window.bloomDesenharFlor === 'function'){
      var pos = arranjo.length===2 ? [[-2.8,-8],[2.5,-9]] : [[-3.4,-8],[0,-11],[3.4,-8.6]];
      arranjo.forEach(function(k,i){
        var p=pos[i];x.strokeStyle='#44845a';x.lineWidth=.65;x.beginPath();x.moveTo(0,2.3);x.quadraticCurveTo(0,-3,p[0],p[1]);x.stroke();
      });
      arranjo.forEach(function(k,i){x.save();x.translate(pos[i][0],pos[i][1]);x.scale(.12,.12);window.bloomDesenharFlor(x,k,0,0,24);x.restore();});
      x.fillStyle='#cf82b2';x.fillRect(-1.3,-1.5,2.6,1.25);
    }else if(flor){
      var especie = item.slice(5);
      x.strokeStyle = '#44845a'; x.lineWidth = .68;
      x.beginPath(); x.moveTo(-.3,2.3); x.quadraticCurveTo(.7,-2.7,0,-6); x.stroke();
      x.fillStyle = '#64a974'; x.beginPath(); x.moveTo(.28,-2);
      x.quadraticCurveTo(1,-4.3,2.7,-4.5); x.quadraticCurveTo(2.4,-2.6,.28,-2); x.fill();
      // Mesmas pétalas do canteiro, na escala da mão do Idol.
      if(typeof window.bloomDesenharFlor === 'function'){
        x.save(); x.translate(0,-6.6); x.scale(.14,.14);
        window.bloomDesenharFlor(x, especie, 0, 0, especie === 'girassol' ? 22 : 19);
        x.restore();
      }
    } else {
      var mic = item === 'microfone';
      x.strokeStyle = '#49375f'; x.lineWidth = 1.55;
      x.beginPath(); x.moveTo(0,1.6); x.lineTo(0,-4.4); x.stroke();
      if(mic){
        x.fillStyle = '#746980'; x.beginPath(); x.ellipse(0,-5.3,1.85,2.15,0,0,7); x.fill();
        x.strokeStyle = '#ded6e4'; x.lineWidth = .46;
        x.beginPath(); x.moveTo(-1.3,-5.3); x.lineTo(1.3,-5.3); x.stroke();
      } else {
        x.strokeStyle = cor || '#ef83bb'; x.lineWidth = 2.4;
        x.beginPath(); x.moveTo(0,-2.8); x.lineTo(0,-7.6); x.stroke();
        x.strokeStyle = '#fff4fa'; x.lineWidth = .55;
        x.beginPath(); x.moveTo(-.4,-3.2); x.lineTo(-.4,-7); x.stroke();
      }
    }
    x.fillStyle = corpo.skin; x.beginPath(); x.ellipse(-.25,0,1.34,.86,-.18,0,7); x.fill();
    x.restore();
  }
  function cena(x, W, H, e, tm, avOutro){
    fundo(x, W, H, e.fundo, tm);
    var av = JSON.parse(JSON.stringify(avOutro || meuAv() || {})); av.pose = e.pose === 'normal' ? '' : e.pose; av.fundo = '';
    if(e.objeto === 'balao') baloes(x, W, H, tm);
    var corpo;
    var quadro = e.quadro || 'inteiro', comFlor = (String(e.objeto || '').indexOf('flor_') === 0 || arranjoFlores(e.objeto).length>0);
    if(typeof perfDesenharIdol === 'function'){
      corpo = perfDesenharIdol(x, W, H, av, false, false, tm * 60, quadro, comFlor);
    }
    if(corpo && e.objeto && e.objeto !== 'nenhum' && e.objeto !== 'balao'){
      objetoNaMao(x, e.objeto, av.pose, corpo, av.cor, quadro);
    }
    luz(x, W, H, e.luz);
  }
  // Foto perfeita: estrelinhas que piscam em volta da polaroid (paradas com "reduzir movimento").
  var calmo = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  function brilhos(x, W, H, s){
    var P = [[.1,.08],[.88,.12],[.06,.6],[.93,.52],[.18,.9],[.82,.86],[.5,.04]];
    x.save(); x.textAlign = 'center'; x.textBaseline = 'middle';
    P.forEach(function(q, i){
      var a = calmo ? .8 : .35 + .65 * Math.abs(Math.sin(s * 2.4 + i * 1.3)), r = (calmo ? 1 : .8 + .4 * Math.sin(s * 3 + i)) * W * .028;
      x.globalAlpha = a; x.fillStyle = i % 2 ? '#ffd23f' : '#ff6fb5';
      x.beginPath(); for(var k = 0; k < 8; k++){ var ang = k * Math.PI / 4, rr = k % 2 ? r * .38 : r; x.lineTo(W * q[0] + Math.cos(ang) * rr, H * q[1] + Math.sin(ang) * rr); }
      x.closePath(); x.fill();
    });
    x.restore();
  }
  function desenhar(){
    var cv = ov && ov.querySelector('#studioCv'); if(!cv) return;
    var x = cv.getContext('2d'), W = cv.width, H = cv.height, tm = performance.now() / 1000;
    x.save(); x.clearRect(0, 0, W, H);
    if(fase === 'foto' && foto){   // polaroid: moldura branca, foto, estrelas e data
      x.drawImage(polaroidLimpa(foto), 0, 0);
      var fl = Math.max(0, 1 - (performance.now() - foto.t0) / 500); if(fl > 0){ x.fillStyle = 'rgba(255,255,255,' + fl + ')'; x.fillRect(0, 0, W, H); }
      if(foto.estrelas >= 3) brilhos(x, W, H, (performance.now() - foto.t0) / 1000);
    } else {
      x.fillStyle = '#fff'; x.fillRect(0,0,W,H);
      x.save(); x.beginPath(); x.rect(24,24,W-48,(W-48)*1.25); x.clip(); x.translate(24,24);
      cena(x, W-48, (W-48)*1.25, esc_, tm); x.restore();
      x.strokeStyle = 'rgba(255,255,255,.38)'; x.lineWidth = 1;
      var fw = W-48, fh = fw*1.25;
      x.beginPath();
      for(var linha=1;linha<3;linha++){
        x.moveTo(24+fw*linha/3,24); x.lineTo(24+fw*linha/3,24+fh);
        x.moveTo(24,24+fh*linha/3); x.lineTo(W-24,24+fh*linha/3);
      }
      x.stroke();
      if(fase === 'contagem'){ var n = 3 - Math.floor((performance.now() - cont) / 600); if(n >= 1){ x.fillStyle = 'rgba(30,10,60,.35)'; x.fillRect(0, 0, W, H);
        x.fillStyle = '#fff'; x.font = '140px "Mochiy Pop One",sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(n), W / 2, H / 2); } }
    }
    x.restore();
  }
  function laco(){ cancelAnimationFrame(anim); (function f(){ if(!ov || ov.hidden) return; if(donoSessao !== donoFoto()){ fechar(); return; } if(!document.hidden && aba === 'estudio') desenhar(); anim = requestAnimationFrame(f); })(); }
  // Capa da semana no Idol⭐News! (aba Jogadores e eventos): a foto mais curtida do mural
  function capaNews(){
    var painel = document.getElementById('jnAbaComunidade'); if(!painel || !logado() || document.getElementById('jnCapaStudio')) return;
    contaRpc('studio_capa').then(function(c){
      if(!c || !c.escolhas || document.getElementById('jnCapaStudio')) return;
      var sec = document.createElement('section'); sec.className = 'jnbloco jncapa'; sec.id = 'jnCapaStudio';
      sec.innerHTML = '<h4>📸 ' + esc(t('capa')) + ' · <span translate="no">Photo⭐Studio!</span></h4><canvas width="300" height="375"></canvas>' +
        '<p><b>' + esc(c.nick) + '</b> · ❤️ ' + (+c.coracoes || 0) + (c.fechada ? '' : ' · ' + esc(t('parcial'))) + '</p>';
      painel.insertBefore(sec, painel.firstChild);
      var r = retratoPost(c, false);
      try{ polaroid(sec.querySelector('canvas'), c.escolhas, r.avatar, +c.estrelas || 1, 'Idol⭐News! · ' + t('capa'), r.tempo); }catch(e){}
    }).catch(function(){});
  }
  window.studioCapaNews = capaNews;   // o carregador sob demanda chama isto quando o Idol⭐News! abre antes do Studio
  if(typeof window.jornalAbasIniciar === 'function' && !window.TW_STUDIO_SOB_DEMANDA){
    var abasOrig = window.jornalAbasIniciar;
    window.jornalAbasIniciar = function(){ var r = abasOrig.apply(this, arguments); try{ capaNews(); }catch(e){} return r; };
  }
  window.studioAbrir = abrir;
  window.studioFechar = fechar;
  window.TW_STUDIO_TEMA = { atual:function(){ return temaSemana()[0]; }, noTema:noTema };
  window.STUDIO_TR = T;
})();
