/* TsuLiPa⭐World — motor de camadas do avatar (Identity Restoration, 27/11/2026).
   Monta o Idol a partir de peças DESENHADAS À MÃO (PNG ou SVG), como o Charat: cada peça ocupa a mesma folha
   48 × 64 unidades (16 px por unidade = 768 × 1024 px), alinhada ao molde docs/arte/molde-avatar.svg.
   Peças com "tinta" são desenhadas em cinza e recebem a cor escolhida pelo jogador (cabelo, pele, olhos,
   roupa, meias), então uma peça serve para qualquer cor sem mexer no save.

   Segurança do jogo:
   - Só liga com ?arte=prototipo (ou outro pacote registrado) na URL. Sem isso, não carrega nada e o drawChar
     da main desenha tudo, como sempre.
   - Não lê nem grava localStorage, Supabase, saldo ou inventário. Só desenha.
   - Se faltar QUALQUER peça para o avatar ou a cena (pose de foto, bicolor, expressão sem desenho), devolve
     false e o drawChar original desenha aquele avatar. Nada fica pela metade. */
(function(root){
  'use strict';
  var U = 16, MOLDE = Object.freeze({w:48, h:64, ox:9, oy:14});
  var pacotes = {}, ativo = null, imagens = {}, tintas = {}, nTintas = 0;
  var COR_HEX = /^#[0-9a-f]{6}$/i;
  function cor(v, padrao){ return typeof v === 'string' && COR_HEX.test(v) ? v : padrao; }
  function tem(o, k){ return !!o && Object.prototype.hasOwnProperty.call(o, k); }

  // Ordem das camadas, de trás para a frente. Cada função devolve a chave da peça (ou null: camada opcional ausente).
  // A chave segue o nome do campo salvo; '' vira 'padrao'. Expressões: a peça "rosto/olho/x@2" é usada no sorriso.
  function nome(v){ return typeof v === 'string' && v ? v : 'padrao'; }
  var ORDEM = [
    {k:function(c){ return c.det === 'coques' ? 'detalhe/coques' : null; }, tinta:'hair'},
    {k:function(c){ return 'cabeloTras/' + (c.back || 'curto'); }, tinta:'hair'},
    {k:function(){ return 'corpo/padrao'; }, tinta:'skin'},
    {k:function(){ return 'pernas/meias'; }, tinta:'legcol'},
    {k:function(){ return 'pernas/sapatos'; }},
    {k:function(c){ return 'baixo/' + (c.baixo === 'saia' ? 'saia' : 'bermuda'); }},
    {k:function(c){ return 'roupa/' + (c.out || 'uniforme'); }, tinta:'outcol'},
    {k:function(c, e){ return 'rosto/olho/' + nome(c.olho) + (e ? '@' + e : ''); }, tinta:'eye'},
    {k:function(c){ return 'rosto/bochecha/' + nome(c.bochecha); }},
    {k:function(c, e){ return 'rosto/boca/' + nome(c.boca) + (e ? '@' + e : ''); }},
    {k:function(c){ return 'rosto/sobrancelha/' + nome(c.sobrancelha); }, tinta:'hair'},
    {k:function(c){ return c.det === 'gato' ? 'detalhe/gato' : c.det && c.det !== 'coques' ? 'detalhe/' + c.det : null; }, tinta:'hair'},
    {k:function(c){ return 'cabeloFrente/' + (c.front || 'bagunca'); }, tinta:'hair'},
    {k:function(c){ return c.gl ? 'oculos/' + c.gl : null; }},
    {k:function(c){ return c.hat ? 'acessorio/' + c.hat : null; }}
  ];
  var PADRAO_COR = {hair:'#222222', skin:'#f1c9a5', eye:'#5a3b2e', outcol:'#ffffff', legcol:'#1c1c30'};

  function registrar(p){
    if(!p || typeof p.nome !== 'string' || !p.pecas) return false;
    pacotes[p.nome] = {nome:p.nome, base:String(p.base || ''), pecas:p.pecas};
    return true;
  }
  function pacote(){ return ativo && pacotes[ativo] || null; }
  // Lista de camadas para este avatar; null quando falta peça (aí o drawChar original desenha).
  function camadas(c, expr){
    var p = pacote(); if(!p || !c) return null;
    if(c.streak && !tem(p.pecas, 'suporte/bicolor')) return null;   // mecha bicolor ligada: ainda sem peça própria
    var e = +expr || 0, lista = [];
    for(var i = 0; i < ORDEM.length; i++){
      var k = ORDEM[i].k(c, e);
      if(k === null) continue;
      if(!tem(p.pecas, k)) return null;
      lista.push({k:k, peca:p.pecas[k], tinta:ORDEM[i].tinta || null});
    }
    return lista;
  }
  function imagem(url){
    var im = imagens[url];
    if(!im){
      if(typeof Image === 'undefined') return null;
      im = imagens[url] = new Image(); im.decoding = 'async'; im.src = url;
    }
    return im.complete && im.naturalWidth ? im : null;
  }
  function pronta(lista, base){
    var ok = true;
    lista.forEach(function(l){ ['cor', 'linha'].forEach(function(f){ if(l.peca[f] && !imagem(base + l.peca[f])) ok = false; }); });
    return ok;
  }
  // Pinta a peça cinza com a cor escolhida, mantendo luz, sombra e contorno (multiply) e a transparência original.
  function tingida(im, hex){
    var chave = im.src + '|' + hex, t = tintas[chave];
    if(t) return t;
    if(typeof document === 'undefined') return im;
    t = document.createElement('canvas'); t.width = im.naturalWidth; t.height = im.naturalHeight;
    var x = t.getContext('2d');
    x.drawImage(im, 0, 0);
    x.globalCompositeOperation = 'multiply'; x.fillStyle = hex; x.fillRect(0, 0, t.width, t.height);
    x.globalCompositeOperation = 'destination-in'; x.drawImage(im, 0, 0);
    if(++nTintas > 96){ tintas = {}; nTintas = 1; }
    return tintas[chave] = t;
  }
  function desenhar(g, c, x, y, run, expr){
    if(typeof charPose !== 'undefined' && charPose) return false;   // poses da foto: o desenho atual cuida
    var p = pacote(), lista = camadas(c, expr);
    if(!lista || !pronta(lista, p.base)) return false;
    var pulo = run && typeof frame === 'number' && Math.floor(frame / 6) % 2 ? -1 : 0;
    var X = x - MOLDE.ox, Y = y - MOLDE.oy + pulo;
    lista.forEach(function(l){
      var im = l.peca.cor ? imagem(p.base + l.peca.cor) : null;
      if(im) g.drawImage(l.tinta ? tingida(im, cor(c[l.tinta], PADRAO_COR[l.tinta])) : im, X, Y, MOLDE.w, MOLDE.h);
      var li = l.peca.linha ? imagem(p.base + l.peca.linha) : null;
      if(li) g.drawImage(li, X, Y, MOLDE.w, MOLDE.h);
    });
    return true;
  }
  // Envolve o drawChar global sem mudar o texto dele: com peça, desenha a peça; sem peça, chama o original.
  function instalar(win){
    win = win || root;
    if(typeof win.drawChar !== 'function' || win.drawChar.__camadas) return false;
    var original = win.drawChar;
    var novo = function(c, x, y, run, expr){
      try{ if(desenhar(win.g || g, c, x, y, run, expr)) return; }catch(e){}
      return original.apply(this, arguments);
    };
    novo.__camadas = true; novo.original = original;
    win.drawChar = novo;
    return true;
  }
  function ativar(nomePacote){ ativo = tem(pacotes, nomePacote) ? nomePacote : null; return !!ativo; }
  function pecasFaltando(c, expr){
    var p = pacote(); if(!p) return [];
    var e = +expr || 0;
    return ORDEM.map(function(o){ return o.k(c || {}, e); }).filter(function(k){ return k !== null && !tem(p.pecas, k); });
  }

  var api = {U:U, MOLDE:MOLDE, ORDEM_CHAVES:function(c, e){ return ORDEM.map(function(o){ return o.k(c || {}, +e || 0); }); },
    registrar:registrar, ativar:ativar, camadas:camadas, desenhar:desenhar, instalar:instalar, pecasFaltando:pecasFaltando,
    ativo:function(){ return ativo; }};
  root.TWCamadas = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;

  // Pré-visualização: ?arte=prototipo carrega o pacote de exemplo e liga o motor só nesta aba.
  if(typeof location !== 'undefined' && typeof document !== 'undefined'){
    var m = /[?&]arte=([a-z0-9-]{1,32})(?:&|$)/.exec(location.search || '');
    if(m){
      var s = document.createElement('script');
      s.src = './arte/avatar/' + m[1] + '/pacote.js?v=1';
      s.onload = function(){ if(ativar(m[1])){ var tenta = function(){ if(!instalar(root)) setTimeout(tenta, 120); }; tenta(); } };
      document.head.appendChild(s);
    }
  }
})(typeof window !== 'undefined' ? window : this);
