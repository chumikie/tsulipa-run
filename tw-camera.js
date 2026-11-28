/* TsuLiPa⭐World · câmera no jeito do Center⭐Run! (23/11/2026, pedido da dona)
   A foto da corrida tinha flash, prévia grande e escolha de moldura, pose e expressão na própria tela da foto.
   Este módulo leva o mesmo jeito para as outras câmeras (Camarim VIP, Moon⭐Duo! e Photo⭐Studio!):
   - nitidez: a cena é desenhada de novo em 2× ou 3× (como a tela do aparelho), não copiada do canvas da página;
   - moldura (Polaroid, Oshi, Palco ou sem moldura), pose e expressão (as mesmas da corrida, com os cadeados da lojinha);
   - enquadramento: inteiro ou de perto (aproxima de quem está na foto);
   - tela: prévia grande e botões grandes; "Salvar foto" baixa no PC e abre o compartilhar no celular (tw-marca.js).
   Uso: TW_CAMERA.abrir({titulo, arquivo, W, H, desenhar:function(ctx, W, H, opc){}, foco:[x, y], legenda:[l1, l2],
        pose:true, expr:true, moldura:'polaroid', aoSalvar:function(canvas){}, aoGuardar:function(canvas, botao){}})
   opc = {pose:'' | 'v' | ..., expr:'' | '0'..'6', S:escala} ('' = como a cena já estava; S para quem usa rascunhos próprios). Nada aqui grava no servidor. */
(function(){
  'use strict';
  var TXT = {
    abrir:{pt:'Abrir câmera',en:'Open camera',es:'Abrir cámara',id:'Buka kamera',th:'เปิดกล้อง',ja:'カメラを開く'},
    cam:{pt:'Câmera',en:'Camera',es:'Cámara',id:'Kamera',th:'กล้อง',ja:'カメラ'},
    moldura:{pt:'Moldura',en:'Frame',es:'Marco',id:'Bingkai',th:'กรอบ',ja:'フレーム'},
    pose:{pt:'Pose',en:'Pose',es:'Pose',id:'Pose',th:'ท่าโพส',ja:'ポーズ'},
    expr:{pt:'Expressão',en:'Expression',es:'Expresión',id:'Ekspresi',th:'สีหน้า',ja:'表情'},
    quadro:{pt:'Enquadramento',en:'Framing',es:'Encuadre',id:'Bingkai foto',th:'การจัดเฟรม',ja:'フレーミング'},
    inteiro:{pt:'Inteiro',en:'Full',es:'Completo',id:'Penuh',th:'เต็มภาพ',ja:'全体'},
    perto:{pt:'De perto',en:'Close-up',es:'De cerca',id:'Dekat',th:'ระยะใกล้',ja:'アップ'},
    polaroid:{pt:'Polaroid',en:'Polaroid',es:'Polaroid',id:'Polaroid',th:'โพลารอยด์',ja:'ポラロイド'},
    oshi:{pt:'Oshi',en:'Oshi',es:'Oshi',id:'Oshi',th:'โอชิ',ja:'推し'},
    palco:{pt:'Palco',en:'Stage',es:'Escenario',id:'Panggung',th:'เวที',ja:'ステージ'},
    sem:{pt:'Sem moldura',en:'No frame',es:'Sin marco',id:'Tanpa bingkai',th:'ไม่มีกรอบ',ja:'フレームなし'},
    normal:{pt:'Como está',en:'As is',es:'Como está',id:'Seperti ini',th:'ตามเดิม',ja:'そのまま'},
    salvar:{pt:'Salvar foto',en:'Save photo',es:'Guardar foto',id:'Simpan foto',th:'บันทึกรูป',ja:'写真を保存'},
    guardar:{pt:'Guardar no Álbum',en:'Keep in the Album',es:'Guardar en el Álbum',id:'Simpan di Album',th:'เก็บในอัลบั้ม',ja:'アルバムに保存'},
    fechar:{pt:'Fechar',en:'Close',es:'Cerrar',id:'Tutup',th:'ปิด',ja:'閉じる'},
    loja:{pt:'{item} está na lojinha do perfil (Montar Idol) por ★{n}.',en:'{item} is in the profile shop (Build Idol) for ★{n}.',es:'{item} está en la tiendita del perfil (Armar Idol) por ★{n}.',id:'{item} ada di toko profil (Rakit Idol) seharga ★{n}.',th:'{item} อยู่ในร้านโปรไฟล์ (สร้างไอดอล) ราคา ★{n}',ja:'{item}はプロフィールのショップ（アイドルを作る）で★{n}。'},
    previa:{pt:'Prévia da foto',en:'Photo preview',es:'Vista previa de la foto',id:'Pratinjau foto',th:'ตัวอย่างรูป',ja:'写真のプレビュー'}
  };
  // Nomes das poses e expressões da corrida (PET_PH_*), traduzidos aqui para não criar chaves no tw-i18n.js
  var NOMES = {
    V:{en:'V',es:'V',id:'V',th:'V',ja:'ピース'}, 'Coração':{en:'Heart',es:'Corazón',id:'Hati',th:'หัวใจ',ja:'ハート'}, Tchau:{en:'Wave',es:'Adiós',id:'Dadah',th:'บ๊ายบาย',ja:'バイバイ'},
    Microfone:{en:'Mic',es:'Micrófono',id:'Mikrofon',th:'ไมค์',ja:'マイク'}, Lightstick:{en:'Lightstick',es:'Lightstick',id:'Lightstick',th:'แท่งไฟ',ja:'ペンライト'},
    Auto:{en:'Auto',es:'Auto',id:'Auto',th:'อัตโนมัติ',ja:'おまかせ'}, Sorriso:{en:'Smile',es:'Sonrisa',id:'Senyum',th:'ยิ้ม',ja:'笑顔'}, Olhar:{en:'Gaze',es:'Mirada',id:'Tatap',th:'มอง',ja:'見つめる'},
    Piscadinha:{en:'Wink',es:'Guiño',id:'Kedip',th:'ขยิบตา',ja:'ウインク'}, 'Ai!':{en:'Ouch!',es:'¡Ay!',id:'Aduh!',th:'โอ๊ย!',ja:'いたっ！'}, Surpresa:{en:'Surprise',es:'Sorpresa',id:'Kaget',th:'ประหลาดใจ',ja:'びっくり'},
    Chorinho:{en:'Teary',es:'Lloroso',id:'Berkaca-kaca',th:'น้ำตาคลอ',ja:'うるうる'}, Apaixonado:{en:'In love',es:'Enamorado',id:'Jatuh cinta',th:'หลงรัก',ja:'メロメロ'}
  };
  function L(){ var l = typeof LANG === 'string' ? LANG : 'pt'; return TXT.cam[l] ? l : 'pt'; }
  function t(k, v){ var s = (TXT[k] && (TXT[k][L()] || TXT[k].pt)) || k; if(v) for(var n in v) s = s.split('{' + n + '}').join(v[n]); return s; }
  function nome(n){ var l = L(); if(l === 'pt') return n; var d = NOMES[n]; return (d && d[l]) || (typeof tr === 'function' ? tr(n) : n); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function reduzMov(){ try{ return matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(e){ return false; } }
  function oshiCor(){ try{ if(typeof petPhCor === 'function') return petPhCor() || '#ff6fb5'; }catch(e){} return '#ff6fb5'; }

  var MOLDURAS = [['polaroid', '📷'], ['oshi', '💜'], ['palco', '✨'], ['sem', '▫️']];
  function poses(){ return (typeof PET_PH_POSES !== 'undefined' && PET_PH_POSES.length ? PET_PH_POSES : [['', '🙂', 'Normal'], ['v', '✌️', 'V'], ['coracao', '🫰', 'Coração'], ['tchau', '👋', 'Tchau']]); }
  function exprs(){ return (typeof PET_PH_EXPRS !== 'undefined' && PET_PH_EXPRS.length ? PET_PH_EXPRS : [['', '✨', 'Auto'], ['2', '😊', 'Sorriso'], ['0', '👀', 'Olhar'], ['3', '😉', 'Piscadinha'], ['1', '😣', 'Ai!']]); }
  // cadeado da lojinha, igual à câmera da corrida (pose_x / expr_n)
  function trava(campo, o){
    var key = campo === 'pose' && o[3] ? 'pose_' + o[0] : (campo === 'expr' && typeof lojaItem === 'function' && lojaItem('expr_' + o[0])) ? 'expr_' + o[0] : '';
    if(!key || typeof lojaTem !== 'function' || typeof lojaItem !== 'function') return null;
    return lojaTem(key) ? null : lojaItem(key);
  }

  // Pincel que desenha em S× sem a cena saber: setTransform/resetTransform guardam a escala (a cena do VIP zera a matriz).
  function pincel(ctx, S){
    var P = {};
    function liga(k){ var f = ctx[k]; return typeof f === 'function' ? f.bind(ctx) : undefined; }
    return new Proxy(P, {
      get:function(_, k){
        if(k === 'setTransform') return function(a, b, c, d, e, f){ if(typeof a === 'object' && a){ var m = a; return ctx.setTransform(m.a * S, m.b * S, m.c * S, m.d * S, m.e * S, m.f * S); } return ctx.setTransform(a * S, b * S, c * S, d * S, e * S, f * S); };
        if(k === 'resetTransform') return function(){ ctx.setTransform(S, 0, 0, S, 0, 0); };
        if(k === 'getTransform') return function(){ var m = ctx.getTransform(); return new DOMMatrix([m.a / S, m.b / S, m.c / S, m.d / S, m.e / S, m.f / S]); };
        var v = ctx[k]; return typeof v === 'function' ? liga(k) : v;
      },
      set:function(_, k, v){ if(k === 'shadowBlur' || k === 'shadowOffsetX' || k === 'shadowOffsetY') v = v * S; ctx[k] = v; return true; }
    });
  }
  function escala(){ var z = window.devicePixelRatio || 1; return Math.max(2, Math.min(3, Math.round(z))); }

  var st = null, ov = null, voltaFoco = null;
  function cena(){
    var S = st.S, W = st.W, H = st.H, c = document.createElement('canvas'); c.width = Math.round(W * S); c.height = Math.round(H * S);
    c.dataset.nitido = '0';
    var x = c.getContext('2d'); x.setTransform(S, 0, 0, S, 0, 0);
    var falso = {width:W, height:H, getContext:function(){ return pincel(x, S); }};
    st.desenhar(pincel(x, S), W, H, {pose:st.pose, expr:st.expr, S:S}, falso);
    if(st.quadro !== 'perto') return c;
    // De perto: aproxima 1,45× no ponto de foco (quem está na foto), sem sair da cena
    var z = 1.45, cw = c.width / z, ch = c.height / z, fx = (st.foco ? st.foco[0] : W / 2) * S, fy = (st.foco ? st.foco[1] : H * .55) * S;
    var sx = Math.max(0, Math.min(c.width - cw, fx - cw / 2)), sy = Math.max(0, Math.min(c.height - ch, fy - ch / 2));
    var p = document.createElement('canvas'); p.width = c.width; p.height = c.height;
    var px = p.getContext('2d'); px.imageSmoothingQuality = 'high'; px.drawImage(c, sx, sy, cw, ch, 0, 0, p.width, p.height);
    return p;
  }
  function ret(x, a, b, w, h, r){ x.beginPath(); if(x.roundRect) x.roundRect(a, b, w, h, r); else x.rect(a, b, w, h); }
  function estrela(x, cx, cy, r){ x.beginPath(); for(var i = 0; i < 10; i++){ var rr = i % 2 ? r * .45 : r, a = -Math.PI / 2 + i * Math.PI / 5; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } x.closePath(); x.fill(); }
  function texto(x, s, cx, y, tam, cor, peso, maxW){
    x.font = (peso || '800') + ' ' + tam + 'px "M PLUS Rounded 1c","Mochiy Pop One",sans-serif';
    var k = tam; while(x.measureText(s).width > maxW && k > 9){ k--; x.font = (peso || '800') + ' ' + k + 'px "M PLUS Rounded 1c","Mochiy Pop One",sans-serif'; }
    x.fillStyle = cor; x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillText(s, cx, y);
  }
  // Monta a foto final: cena + moldura (tudo em S×; as medidas abaixo são lógicas)
  function montar(){
    var S = st.S, W = st.W, H = st.H, foto = cena(), m = st.moldura;
    if(m === 'sem') return foto;
    var pad = Math.round(Math.max(16, W * .045)), base = Math.round(Math.max(96, H * .26, W * .17)), FW = W + pad * 2, FH = H + pad + base;
    var c = document.createElement('canvas'); c.width = FW * S; c.height = FH * S; c.dataset.nitido = '0';
    var x = c.getContext('2d'); x.setTransform(S, 0, 0, S, 0, 0);
    var oc = oshiCor(), escuro = m === 'palco', l1 = st.legenda[0] || '', l2 = st.legenda[1] || '';
    if(m === 'polaroid'){
      x.fillStyle = '#fffdf8'; x.fillRect(0, 0, FW, FH);
      x.save(); x.globalAlpha = .07; x.fillStyle = '#9b30d9';
      for(var dy = 10; dy < FH; dy += 16) for(var dx = (dy / 16 % 2) * 8 + 6; dx < FW; dx += 16){ x.beginPath(); x.arc(dx, dy, 1.4, 0, 7); x.fill(); }
      x.restore();
    } else if(m === 'oshi'){
      var g = x.createLinearGradient(0, 0, 0, FH); g.addColorStop(0, oc); g.addColorStop(1, '#ffffff');
      x.fillStyle = '#fff'; x.fillRect(0, 0, FW, FH); x.globalAlpha = .28; x.fillStyle = g; x.fillRect(0, 0, FW, FH); x.globalAlpha = 1;
      x.save(); x.globalAlpha = .12; x.strokeStyle = oc; x.lineWidth = 6;
      for(var d = -FH; d < FW; d += 26){ x.beginPath(); x.moveTo(d, FH); x.lineTo(d + FH, 0); x.stroke(); }
      x.restore();
      x.strokeStyle = oc; x.lineWidth = 5; ret(x, 6, 6, FW - 12, FH - 12, 16); x.stroke();
      x.fillStyle = oc; [[18, 18], [FW - 18, 18], [18, FH - 18], [FW - 18, FH - 18]].forEach(function(s){ estrela(x, s[0], s[1], 8); });
    } else {
      var gp = x.createLinearGradient(0, 0, FW, FH); gp.addColorStop(0, '#2a1260'); gp.addColorStop(1, '#4a1d7a');
      x.fillStyle = gp; x.fillRect(0, 0, FW, FH);
      var gb = x.createLinearGradient(0, 0, FW, 0); gb.addColorStop(0, '#7b3ff0'); gb.addColorStop(.5, '#ff6fb5'); gb.addColorStop(1, '#b6ff3b');
      x.strokeStyle = gb; x.lineWidth = 5; ret(x, 5, 5, FW - 10, FH - 10, 18); x.stroke();
      ['#ffe14d', '#ff6fb5', '#b6ff3b', '#9fd8ff'].forEach(function(cor, i){ x.fillStyle = cor; for(var k = 0; k < 4; k++){ var sx = (i * 97 + k * 151) % (FW - 30) + 15, sy = H + pad + 12 + ((i * 53 + k * 37) % Math.max(10, base - 24)); estrela(x, sx, sy, 3 + (k % 2) * 2); } });
    }
    // a foto, com uma sombrinha e borda branca
    x.save(); x.shadowColor = 'rgba(40,10,90,.22)'; x.shadowBlur = 10 * S; x.shadowOffsetY = 3 * S;
    x.fillStyle = '#fff'; x.fillRect(pad - 3, pad - 3, W + 6, H + 6); x.restore();
    x.drawImage(foto, pad, pad, W, H);
    if(m === 'polaroid'){ x.save(); x.translate(FW / 2, pad - 2); x.rotate(-.03); x.fillStyle = 'rgba(255,111,181,.55)'; x.fillRect(-60, -10, 120, 22); x.restore(); }
    var cy = H + pad + base * .42, cor1 = escuro ? '#ffffff' : m === 'oshi' ? '#3a2470' : '#5b2bb5', cor2 = escuro ? '#e9ddff' : '#9a86c8';
    var t1 = Math.round(Math.min(base * .4, Math.max(base * .26, FW * .05))), t2 = Math.round(t1 * .6);   // legível também nas fotos largas (Duo)
    if(l1) texto(x, l1, FW / 2, cy, t1, cor1, '400', FW - pad * 2);
    if(l2) texto(x, l2, FW / 2, cy + t1 * 1.15, t2, cor2, '800', FW - pad * 2);
    return c;
  }
  function render(){
    var c, url;
    try{
      c = montar();
      url = window.twMarcaPng ? window.twMarcaPng(c) : c.toDataURL('image/png');
    }catch(e){ return false; }
    st.final = c;
    var img = ov.querySelector('.twcam-img'), a = ov.querySelector('.twcam-salvar');
    img.src = url;
    a.href = url;
    a.download = st.arquivo;
    return true;
  }
  function grupo(campo, rot, lista, atual, nomeDe){
    return '<div class="twcam-g" role="group" aria-label="' + esc(rot) + '"><span>' + esc(rot) + '</span><div>' + lista.map(function(o){
      var tv = campo === 'pose' || campo === 'expr' ? trava(campo, o) : null;
      return '<button type="button" data-cf="' + campo + '" data-cv="' + esc(o[0]) + '" aria-pressed="' + (atual === o[0]) + '"' + (tv ? ' data-trava="' + esc(tv[3]) + '" data-tnome="' + esc(nomeDe(o)) + '" class="twcam-trava"' : '') + '>' +
        esc(o[1] + ' ' + nomeDe(o)) + (tv ? ' 🔒★' + esc(tv[3]) : '') + '</button>';
    }).join('') + '</div></div>';
  }
  function opcoes(){
    var h = grupo('moldura', t('moldura'), MOLDURAS, st.moldura, function(o){ return t(o[0]); }) +
      grupo('quadro', t('quadro'), [['inteiro', '🖼️'], ['perto', '🔍']], st.quadro, function(o){ return t(o[0]); });
    if(st.temPose) h += grupo('pose', t('pose'), poses(), st.pose, function(o){ return o[0] === '' ? t('normal') : nome(o[2]); });
    if(st.temExpr) h += grupo('expr', t('expr'), exprs(), st.expr, function(o){ return nome(o[2]); });
    ov.querySelector('.twcam-ops').innerHTML = h + '<p class="twcam-msg" hidden></p>';
  }
  function estilo(){
    if(document.getElementById('twcamCss')) return;
    var s = document.createElement('style'); s.id = 'twcamCss';
    s.textContent = '.twcam{position:fixed;inset:0;z-index:9000;display:flex;align-items:flex-end;justify-content:center;background:rgba(15,11,48,.72);padding:0}' +
      '.twcam[hidden]{display:none}' +
      '.twcam-p{box-sizing:border-box;width:min(560px,100%);max-height:100dvh;overflow:auto;padding:14px 14px calc(16px + env(safe-area-inset-bottom,0px));border-radius:26px 26px 0 0;background:linear-gradient(180deg,#fff6fb,#f3ecff);color:#3a2470;font-family:"M PLUS Rounded 1c",sans-serif;box-shadow:0 -8px 30px rgba(40,10,90,.35)}' +
      '@media (min-width:700px){.twcam{align-items:center;padding:20px}.twcam-p{border-radius:26px;max-height:calc(100dvh - 40px)}}' +
      '.twcam-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}.twcam-top h2{flex:1;margin:0;font:400 17px "Mochiy Pop One",sans-serif;color:#5b2bb5}' +
      '.twcam-x{width:44px;height:44px;border-radius:50%;border:2px solid #e0d3ff;background:#fff;color:#7b3ff0;font-size:20px;font-weight:900;cursor:pointer}' +
      '.twcam-v{display:flex;justify-content:center;background:repeating-conic-gradient(#f3ecff 0 25%,#fff 0 50%) 0 0/18px 18px;border-radius:18px;padding:8px}' +
      '.twcam-img{display:block;max-width:100%;max-height:min(52dvh,520px);width:auto;height:auto;border-radius:10px;box-shadow:0 6px 18px rgba(60,20,120,.22)}' +
      '.twcam-ops{display:flex;flex-direction:column;gap:8px;margin:12px 0}' +
      '.twcam-g>span{display:block;text-align:center;font-size:12px;font-weight:800;color:#7a68a8;margin-bottom:4px}' +
      '.twcam-g>div{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}' +
      '.twcam-g button{min-height:44px;border:2px solid transparent;border-radius:99px;background:#efe6ff;color:#3a2470;font:inherit;font-size:13px;font-weight:800;padding:6px 13px;cursor:pointer}' +
      '.twcam-g button[aria-pressed="true"]{border-color:#7b3ff0;background:#fff;box-shadow:0 2px 0 #d9c8ff}' +
      '.twcam-g button.twcam-trava{opacity:.7}.twcam-g button:focus-visible,.twcam-b:focus-visible,.twcam-x:focus-visible{outline:3px solid #ff6fb5;outline-offset:2px}' +
      '.twcam-msg{margin:0;text-align:center;font-size:12.5px;font-weight:800;color:#c2367f}' +
      '.twcam-bts{display:flex;gap:8px;flex-wrap:wrap}.twcam-b{flex:1 1 140px;display:flex;align-items:center;justify-content:center;gap:8px;min-height:52px;border:0;border-radius:18px;font:400 15px "Mochiy Pop One",sans-serif;cursor:pointer;text-decoration:none}' +
      '.twcam-b[hidden]{display:none}.twcam-salvar{background:linear-gradient(120deg,#7b3ff0,#ff6fb5);color:#fff;box-shadow:0 4px 0 #5b2bb5}.twcam-guardar{background:#fff;color:#7b3ff0;border:2px solid #d9c8ff!important;box-shadow:0 3px 0 #d9c8ff}' +
      '.twcam-flash{position:fixed;inset:0;background:#fff;z-index:9001;pointer-events:none;opacity:1;transition:opacity .4s ease-out}' +
      ':root[data-theme="dark"] .twcam-p{background:linear-gradient(180deg,#2a1f45,#1d1636);color:#f1e9ff}:root[data-theme="dark"] .twcam-top h2{color:#e2d2ff}:root[data-theme="dark"] .twcam-g button{background:#3a2a66;color:#f1e9ff}:root[data-theme="dark"] .twcam-g button[aria-pressed="true"]{background:#2a1f45;border-color:#b98cff}:root[data-theme="dark"] .twcam-v{background:repeating-conic-gradient(#2f2453 0 25%,#261d45 0 50%) 0 0/18px 18px}:root[data-theme="dark"] .twcam-g>span{color:#cdbcff}:root[data-theme="dark"] .twcam-x{background:#2a1f45;border-color:#4a3a78;color:#e2d2ff}' +
      '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .twcam-p{background:linear-gradient(180deg,#2a1f45,#1d1636);color:#f1e9ff}:root:not([data-theme="light"]) .twcam-top h2{color:#e2d2ff}:root:not([data-theme="light"]) .twcam-g button{background:#3a2a66;color:#f1e9ff}:root:not([data-theme="light"]) .twcam-g button[aria-pressed="true"]{background:#2a1f45;border-color:#b98cff}:root:not([data-theme="light"]) .twcam-v{background:repeating-conic-gradient(#2f2453 0 25%,#261d45 0 50%) 0 0/18px 18px}:root:not([data-theme="light"]) .twcam-g>span{color:#cdbcff}:root:not([data-theme="light"]) .twcam-x{background:#2a1f45;border-color:#4a3a78;color:#e2d2ff}}';
    document.head.appendChild(s);
  }
  function criar(){
    estilo();
    ov = document.createElement('div'); ov.className = 'twcam'; ov.id = 'twCamera'; ov.hidden = true;
    ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-labelledby', 'twcamT');
    ov.innerHTML = '<div class="twcam-p"><div class="twcam-top"><h2 id="twcamT"></h2><button type="button" class="twcam-x" data-cf="fechar"></button></div>' +
      '<div class="twcam-v"><img class="twcam-img" alt=""></div><div class="twcam-ops"></div>' +
      '<div class="twcam-bts"><a class="twcam-b twcam-salvar" href="#"></a><button type="button" class="twcam-b twcam-guardar" data-cf="guardar" hidden></button></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click', function(e){
      if(e.target === ov){ fechar(); return; }
      var s = e.target.closest && e.target.closest('.twcam-salvar');
      if(s){ if(st && st.aoSalvar) try{ st.aoSalvar(st.final); }catch(er){} return; }   // o download/compartilhar segue pelo link (tw-marca.js)
      var b = e.target.closest && e.target.closest('[data-cf]'); if(!b || !st) return;
      var f = b.dataset.cf;
      if(f === 'fechar'){ fechar(); return; }
      if(f === 'guardar'){ if(st.aoGuardar) try{ st.aoGuardar(st.final, b); }catch(er){} return; }
      if(b.dataset.trava){ var m = ov.querySelector('.twcam-msg'); m.textContent = '🔒 ' + t('loja', {item:b.dataset.tnome, n:b.dataset.trava}); m.hidden = false; return; }
      var v = b.dataset.cv, anterior = st[f];
      if(f === 'moldura') st.moldura = v; else if(f === 'quadro') st.quadro = v; else if(f === 'pose') st.pose = v; else if(f === 'expr') st.expr = v;
      try{ if(typeof beep === 'function') beep(988, .04, 'triangle', .04); }catch(er){}
      if(!render()){ st[f] = anterior; return; }
      opcoes();
      var nb = ov.querySelector('[data-cf="' + f + '"][data-cv="' + (window.CSS && CSS.escape ? CSS.escape(v) : v) + '"]'); if(nb) nb.focus();
    });
    // Esc fecha só a câmera: pega a tecla antes das telas de trás (Studio, Duo e TsuPhone também ouvem o Esc)
    window.addEventListener('keydown', function(e){
      if(e.key !== 'Escape' || !ov || ov.hidden) return;
      e.preventDefault(); e.stopImmediatePropagation(); fechar();
    }, true);
    ov.addEventListener('keydown', function(e){
      if(e.key !== 'Tab') return;
      var f = [].slice.call(ov.querySelectorAll('button:not([hidden]),a[href]')).filter(function(el){ return el.offsetParent !== null; });
      if(!f.length) return;
      if(e.shiftKey && document.activeElement === f[0]){ e.preventDefault(); f[f.length - 1].focus(); }
      else if(!e.shiftKey && document.activeElement === f[f.length - 1]){ e.preventDefault(); f[0].focus(); }
    });
  }
  function flash(){
    if(reduzMov()) return;
    var fl = document.createElement('div'); fl.className = 'twcam-flash'; document.body.appendChild(fl);
    fl.getBoundingClientRect(); fl.style.opacity = '0'; setTimeout(function(){ fl.remove(); }, 420);
    try{ if(typeof beep === 'function'){ beep(1568, .05, 'triangle', .05); beep(2093, .06, 'triangle', .04, .05); } }catch(e){}
  }
  function abrir(o){
    if(!o || typeof o.desenhar !== 'function' || !o.W || !o.H) return false;
    if(!ov) criar();
    st = {W:o.W, H:o.H, S:escala(), desenhar:o.desenhar, foco:o.foco || null, legenda:o.legenda || [], arquivo:o.arquivo || 'tsulipa-foto.png',
      moldura:o.moldura || 'polaroid', quadro:'inteiro', pose:o.poseInicial || '', expr:'', temPose:!!o.pose, temExpr:!!o.expr,
      aoSalvar:o.aoSalvar || null, aoGuardar:o.aoGuardar || null, aoFechar:o.aoFechar || null};
    voltaFoco = document.activeElement;
    ov.querySelector('#twcamT').textContent = '📸 ' + (o.titulo || t('cam'));
    ov.querySelector('.twcam-x').setAttribute('aria-label', t('fechar')); ov.querySelector('.twcam-x').textContent = '✕';
    ov.querySelector('.twcam-img').alt = t('previa');
    ov.querySelector('.twcam-salvar').textContent = '⬇ ' + t('salvar');
    var g = ov.querySelector('.twcam-guardar'); g.hidden = !st.aoGuardar; g.disabled = false; g.textContent = t('guardar');
    if(!render()){ st = null; return false; }
    opcoes(); flash();
    ov.hidden = false;
    ov.querySelector('.twcam-p').scrollTop = 0;
    ov.querySelector('.twcam-x').focus({preventScroll:true});
    return true;
  }
  function fechar(){
    if(!ov || ov.hidden) return;
    ov.hidden = true; var cb = st && st.aoFechar; st = null;
    if(cb) try{ cb(); }catch(e){}
    if(voltaFoco && voltaFoco.focus && document.contains(voltaFoco)) try{ voltaFoco.focus(); }catch(e){}
  }
  window.TW_CAMERA = {abrir:abrir, fechar:fechar, aberta:function(){ return !!(ov && !ov.hidden); }, t:t};
})();
