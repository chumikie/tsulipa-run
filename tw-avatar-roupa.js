/* TsuLiPa⭐World — roupa do avatar 2D (folha E aprovada em 05/11/2026).
   Para Trainee (''), Cheeky (y2k), Seifuku e City Pop:
   - parte de baixo própria, à escolha do jogador: c.baixo = 'saia' (pregueada) ou 'bermuda' (cintura alta);
     sem escolha, City Pop usa bermuda e as outras, saia;
   - Trainee: camisa inteira na cor escolhida, com gravata (as laterais e a manga são do mesmo tecido);
   - ombro ligado à roupa: a manga começa no tronco e o braço (parado ou levantado) sai de dentro dela;
   - luz contínua: o mesmo degradê de antes (claro à esquerda, escuro à direita, mais escuro embaixo),
     recortado só no tecido base, sem passar por cima de gravata, laço, gola ou estampa.
   Só retângulos, trapézios e cantos arredondados, como o resto do drawChar. Folha F: Estrelado, Zipper e Sweet
   mantêm o desenho e ganham a mesma luz contínua. Roupas da loja e looks de rank continuam como estavam.
   Usado pelas três cópias do drawChar: centerrun.js, karaoke-time.html e sora-jump.html. */
(function(root){
  'use strict';
  var BAIXO = {
    '':      { cor:'#4a5170', linha:'#3b4160' },
    y2k:     { cor:'#1d1b29', linha:'#34304a', barra:true },
    seifuku: { cor:'#1b2a5e', linha:'#2e4183' },
    citypop: { cor:'#f1e7d0', linha:'#d8caa8' }
  };
  function tem(roupa){ return typeof roupa === 'string' && Object.prototype.hasOwnProperty.call(BAIXO, roupa); }
  function qual(c, roupa){
    var b = c && c.baixo;
    if(b === 'saia' || b === 'bermuda') return b;
    return roupa === 'citypop' ? 'bermuda' : 'saia';
  }
  function T(g, a){ g.beginPath(); g.moveTo(a[0], a[1]); for(var i = 2; i < a.length; i += 2) g.lineTo(a[i], a[i + 1]); g.closePath(); g.fill(); }
  function retangulo(g, X, Y, W, H, R){ if(R && g.roundRect) g.roundRect(X, Y, W, H, R); else g.rect(X, Y, W, H); }

  // Degradê único da roupa: o mesmo de antes (branco .2 à esquerda → roxo-escuro .24 à direita),
  // mas atravessando a roupa inteira, de ombro a ombro, e recortado pelo caminho do tecido.
  function luz(g, x, y, caminho, parteDeBaixo){
    g.save();
    g.beginPath(); caminho(); g.clip();
    var h = g.createLinearGradient(x + 1, 0, x + 29, 0), k = parteDeBaixo ? .8 : 1;
    h.addColorStop(0, 'rgba(255,255,255,' + (.2 * k) + ')'); h.addColorStop(.32, 'rgba(255,255,255,0)');
    h.addColorStop(.6, 'rgba(40,10,70,0)'); h.addColorStop(1, 'rgba(40,10,70,' + (.24 * k) + ')');
    g.fillStyle = h; g.fillRect(x - 4, y + 20, 38, 24);
    var v = parteDeBaixo ? g.createLinearGradient(0, y + 35, 0, y + 40) : g.createLinearGradient(0, y + 29, 0, y + 35);
    v.addColorStop(0, 'rgba(40,10,70,0)'); v.addColorStop(1, 'rgba(40,10,70,' + (parteDeBaixo ? .1 : .16) + ')');
    g.fillStyle = v; g.fillRect(x - 4, parteDeBaixo ? y + 35 : y + 29, 38, parteDeBaixo ? 6 : 6);
    if(!parteDeBaixo && g.createRadialGradient){   // sombra macia do pescoço, sem cantos
      var r = g.createRadialGradient(x + 15, y + 22, 0, x + 15, y + 22, 6);
      r.addColorStop(0, 'rgba(40,10,70,.16)'); r.addColorStop(1, 'rgba(40,10,70,0)');
      g.fillStyle = r; g.fillRect(x + 8, y + 21, 14, 8);
    }
    g.restore();
  }

  // Luz do tronco: chamada logo depois do tecido base e antes dos detalhes de cada roupa.
  function tronco(g, x, y, roupa, c){
    if(!tem(roupa)) return;
    if(roupa === '' && c){   // Trainee: camisa inteira na cor escolhida; as laterais cinza viram só uma dobra do mesmo tecido
      g.fillStyle = c.outcol || '#ffffff'; g.fillRect(x + 4, y + 22, 3, 12); g.fillRect(x + 23, y + 22, 3, 12);
      g.fillStyle = 'rgba(40,10,70,.12)'; g.fillRect(x + 4, y + 22, 1.4, 12); g.fillRect(x + 24.6, y + 22, 1.4, 12);
    }
    luz(g, x, y, function(){
      if(roupa === 'y2k'){ g.rect(x + 7, y + 22, 3, 10); g.rect(x + 20, y + 22, 3, 10); }
      else if(roupa === 'citypop'){ g.rect(x + 7, y + 22, 4, 11); g.rect(x + 19, y + 22, 4, 11); }
      else g.rect(x + 4, y + 22, 22, 12);
    }, false);
  }

  // Parte de baixo no lugar do retângulo claro comum. Devolve false quando a roupa não usa (fica o desenho antigo).
  function baixo(g, c, x, y, roupa){
    if(!tem(roupa)) return false;
    var k = BAIXO[roupa], tipo = qual(c, roupa), corBarra = (c && c.outcol) || '#ff8fc8';
    if(tipo === 'bermuda'){
      g.fillStyle = k.cor; g.fillRect(x + 6.5, y + 32, 17, 8);
      g.fillStyle = k.linha; g.fillRect(x + 14.6, y + 35, .8, 5);           // costura do meio
      if(k.barra){ g.fillStyle = corBarra; g.fillRect(x + 6.5, y + 39, 17, 1); }
      luz(g, x, y, function(){ g.rect(x + 6.5, y + 32, 17, 8); }, true);
      return true;
    }
    g.fillStyle = k.cor; T(g, [x + 6, y + 32, x + 24, y + 32, x + 27, y + 40, x + 3, y + 40]);
    g.fillStyle = k.linha;
    [9, 12.5, 16, 19.5].forEach(function(px){ var d = (px - 15) * .12; T(g, [x + px, y + 34, x + px + .7, y + 34, x + px + .7 + d, y + 40, x + px + d, y + 40]); });   // pregas
    if(k.barra){ g.fillStyle = corBarra; T(g, [x + 3.4, y + 39, x + 26.6, y + 39, x + 27, y + 40, x + 3, y + 40]); }
    luz(g, x, y, function(){ g.moveTo(x + 6, y + 32); g.lineTo(x + 24, y + 32); g.lineTo(x + 27, y + 40); g.lineTo(x + 3, y + 40); g.closePath(); }, true);
    return true;
  }

  // Braços que saem do lugar em cada pose: [ombro x, ombro y, mão x, mão y] (mesma régua do petPoseArms/perfPose*).
  var BRACOS = {
    v:{ R:[27, 25.5, 34, 15.5] }, tchau:{ R:[27, 25.5, 34, 15.5] }, luz:{ R:[27, 25.5, 33, 16.5] },
    banzai:{ L:[3, 25.5, -3.5, 13.5], R:[27, 25.5, 33.5, 13.5] },
    coracao:{}, mic:{}, nyan:{}   // braços dobrados para dentro: a manga fica no ombro e o braço passa por cima
  };
  // Ombro ligado à roupa. Braço parado: manguinha no ombro. Braço em pose: a manga gira junto com o braço,
  // saindo do ombro na direção da mão, e o braço continua de dentro dela.
  function ombro(g, c, x, y, roupa, pose){
    if(!tem(roupa)) return;
    var cor = (c && c.outcol) || '#ffffff', mov = !pose ? {} : (BRACOS[pose] || BRACOS.v),
        blazer = roupa === 'y2k' || roupa === 'citypop';   // nesses dois looks, a manga substitui o painel lateral antigo
    var formas = [];
    // A costura acompanha o braço (x=3/27); o blazer recua meio pixel para manter o tecido unido.
    if(mov.L) formas.push(manga(x, y, blazer ? [3.5, mov.L[1], mov.L[2], mov.L[3]] : mov.L));
    else formas.push(function(){ retangulo(g, x + (blazer ? 1 : .6), y + 22, blazer ? 8.5 : 5.6, blazer ? 7 : 4.6, [2.2, 0, 0, 1.2]); });
    if(mov.R) formas.push(manga(x, y, blazer ? [26.5, mov.R[1], mov.R[2], mov.R[3]] : mov.R));
    else formas.push(function(){ retangulo(g, x + (blazer ? 20.5 : 23.8), y + 22, blazer ? 8.5 : 5.6, blazer ? 7 : 4.6, [0, 2.2, 1.2, 0]); });
    function manga(x, y, b){   // Manga única começa no blazer e cobre o começo do braço, sem painel pendurado
      return function(){
        var dx = b[2] - b[0], dy = b[3] - b[1], n = Math.sqrt(dx * dx + dy * dy) || 1,
            ux = dx / n, uy = dy / n, raio = blazer ? 3.4 : 2.7, alcance = blazer ? 6 : 4,
            px = -uy * raio, py = ux * raio;
        var ax = x + b[0], ay = y + b[1], bx = ax + ux * alcance, by = ay + uy * alcance;
        g.moveTo(ax + px, ay + py); g.lineTo(bx + px, by + py); g.lineTo(bx - px, by - py); g.lineTo(ax - px, ay - py); g.closePath();
        g.moveTo(ax + raio, ay); g.arc(ax, ay, raio, 0, Math.PI * 2, true); // mesma orientação do polígono: não recorta uma fresta no ombro
      };
    }
    function todas(){ formas.forEach(function(f){ f(); }); }
    g.save(); g.fillStyle = cor; g.beginPath(); todas(); g.fill(); g.restore();
    luz(g, x, y, todas, false);
  }


  // Folha F: Estrelado, Zipper e Sweet usam a mesma luz contínua, só no tecido da cor escolhida.
  var LUZ_PROPRIA = { estrelado:1, zipper:1, sweet:1 };
  function luzPropria(roupa){ return tem(roupa) || (typeof roupa === 'string' && LUZ_PROPRIA[roupa] === 1); }
  var PARTES = {
    'estrelado-baixo': [true,  function(g, x, y){ g.moveTo(x + 5, y + 31); g.lineTo(x + 25, y + 31); g.lineTo(x + 27, y + 38); g.lineTo(x + 3, y + 38); g.closePath(); }],
    'estrelado-tronco':[false, function(g, x, y){ g.rect(x + 4, y + 22, 22, 10); }],
    'estrelado-sora':  [false, function(g, x, y){ g.rect(x + 4, y + 22, 22, 12); }],
    'zipper-saia':     [true,  function(g, x, y){ g.moveTo(x + 4, y + 30); g.lineTo(x + 12, y + 30); g.lineTo(x + 2, y + 42); g.closePath(); g.moveTo(x + 26, y + 30); g.lineTo(x + 18, y + 30); g.lineTo(x + 28, y + 42); g.closePath(); }],
    'zipper-tronco':   [false, function(g, x, y){ g.ellipse(x + 3, y + 24, 3, 4, 0, 0, 7); g.moveTo(x + 30, y + 24); g.ellipse(x + 27, y + 24, 3, 4, 0, 0, 7); g.rect(x + 5, y + 29, 20, 3); }],
    'zipper-mangas':   [false, function(g, x, y){ g.ellipse(x + 1.5, y + 24.5, 4, 4, 0, 0, 7); g.moveTo(x + 32.5, y + 24.5); g.ellipse(x + 28.5, y + 24.5, 4, 4, 0, 0, 7); }],
    'sweet-saia':      [true,  function(g, x, y){ g.moveTo(x + 2, y + 33); g.lineTo(x + 28, y + 33); g.lineTo(x + 34, y + 43); g.lineTo(x - 2, y + 43); g.closePath(); }],
    'sweet-tronco':    [false, function(g, x, y){ g.rect(x + 4, y + 22, 22, 12); }]
  };
  // Chamada logo depois de cada peça de tecido e antes dos detalhes que ficam por cima dela.
  function parte(g, x, y, nome){
    var p = PARTES[nome]; if(!p) return;
    luz(g, x, y, function(){ p[1](g, x, y); }, p[0]);
  }

  // V3.1 (06/11/2026): pele, cabelo e gravata com a mesma luz contínua da roupa. Usado pelas três cópias do drawChar.
  function escuro(hex, n){ return '#' + String(hex || '').replace(/^#/, '').replace(/../g, function(cc){ return ('0' + Math.max(0, parseInt(cc, 16) - n).toString(16)).substr(-2); }); }
  function luzPele(g, X0, X1, Y0, Y1, forte, base){   // claro à esquerda, escuro à direita e embaixo (recorte já aplicado)
    var h = g.createLinearGradient(X0, 0, X1, 0);
    h.addColorStop(0, 'rgba(255,255,255,' + (forte ? .18 : .16) + ')'); h.addColorStop(forte ? .32 : .35, 'rgba(255,255,255,0)');
    h.addColorStop(forte ? .6 : .62, 'rgba(40,10,70,0)'); h.addColorStop(1, 'rgba(40,10,70,' + (forte ? .22 : .16) + ')');
    g.fillStyle = h; g.fillRect(X0 - 1, Y0, X1 - X0 + 2, Y1 - Y0);
    var v = g.createLinearGradient(0, base, 0, Y1);
    v.addColorStop(0, 'rgba(40,10,70,0)'); v.addColorStop(1, 'rgba(40,10,70,.14)');
    g.fillStyle = v; g.fillRect(X0 - 1, base, X1 - X0 + 2, Y1 - base);
  }
  function bracos(g, x, y){   // braços parados
    g.save(); g.beginPath(); g.rect(x + 1, y + 24, 4, 9); g.rect(x + 25, y + 24, 4, 9); g.clip();
    luzPele(g, x + 1, x + 29, y + 24, y + 33, true, y + 28); g.restore();
  }
  function rosto(g, x, y){
    g.save(); g.beginPath(); g.ellipse(x + 15, y + 17, 11, 11, 0, 0, 7); g.clip();
    luzPele(g, x + 4, x + 26, y + 5, y + 28, false, y + 21); g.restore();
  }
  // Chanel e longo: as costas continuam o degradê do topo. A cabeça fica 4px acima (translate), por isso 'topo' desloca a régua.
  function cabelo(g, H, HD, y, b, topo){
    if(b !== 'chanel' && b !== 'longo') return null;
    var L = b === 'longo' ? 41 : 31, d = topo ? 4 : 0, gr = g.createLinearGradient(0, y + 1 + d, 0, y + L + d);
    gr.addColorStop(0, H); gr.addColorStop(19 / (L - 1), HD); gr.addColorStop(1, escuro(H, 82));
    return gr;
  }
  function costas(g, x, y, b){   // contorno: sai da cabeça (centro y+8 antes do translate) e desce pelas laterais
    g.beginPath(); g.moveTo(x + 3, y + 8); g.arc(x + 15, y + 8, 12, Math.PI, 0);
    if(b === 'longo'){ g.quadraticCurveTo(x + 34, y + 34, x + 27, y + 41); g.lineTo(x + 3, y + 41); g.quadraticCurveTo(x - 4, y + 34, x + 3, y + 8); }
    else { g.quadraticCurveTo(x + 32, y + 30, x + 25, y + 31); g.lineTo(x + 5, y + 31); g.quadraticCurveTo(x - 2, y + 30, x + 3, y + 8); }
    g.fill();
  }
  // Sombra de 1px da franja, só na pele: fora do topo e das costeletas (que têm o mesmo degradê). Chamar dentro do save() da franja.
  function sombraFranja(g, x, y, f, sl, ondulado){
    if(f === 'espetada' || f === 'arcoiris' || ondulado) return;
    g.beginPath(); g.rect(x - 12, y - 16, 54, 60); g.moveTo(x + 3, y + 12); g.arc(x + 15, y + 12, 12, Math.PI, 0); g.closePath();
    g.rect(x + 3, y + 11.5, 4, sl + .5); g.rect(x + 23, y + 11.5, 4, sl + .5); g.clip('evenodd');
    var t = g.getTransform ? Math.abs(g.getTransform().d) : 1;
    g.shadowColor = 'rgba(40,10,70,.22)'; g.shadowOffsetX = 0; g.shadowOffsetY = t * 1.1; g.shadowBlur = 0;
  }
  function bagunca(g, x, y){   // franja da Tsu: três mechas curvas
    g.beginPath(); g.moveTo(x + 3, y + 8); g.lineTo(x + 3, y + 12); g.quadraticCurveTo(x + 4.5, y + 17, x + 8, y + 19.5);
    g.quadraticCurveTo(x + 8.6, y + 14, x + 11.5, y + 10.5); g.quadraticCurveTo(x + 12.6, y + 15.5, x + 16, y + 18);
    g.quadraticCurveTo(x + 16.8, y + 13, x + 19.8, y + 9.5); g.quadraticCurveTo(x + 21.4, y + 14, x + 24.5, y + 16.5);
    g.quadraticCurveTo(x + 24.9, y + 12.5, x + 27, y + 10.5); g.lineTo(x + 27, y + 8); g.closePath(); g.fill();
  }
  function gravata(g, x, y){   // Trainee: nó, lâmina com ponta e brilho do lado da luz
    g.fillStyle = '#1b2a5e'; T(g, [x + 14.4, y + 24.2, x + 16.6, y + 24.2, x + 17.5, y + 30.6, x + 15.5, y + 32.6, x + 13.5, y + 30.6]);
    g.fillStyle = 'rgba(255,255,255,.16)'; T(g, [x + 14.4, y + 24.2, x + 15.5, y + 24.2, x + 15.5, y + 32.6, x + 13.5, y + 30.6]);
    g.fillStyle = '#14204a'; T(g, [x + 13.7, y + 22, x + 17.3, y + 22, x + 16.7, y + 24.4, x + 14.3, y + 24.4]);
    g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x + 14.3, y + 22.4, 1.2, .8);
  }

  var api = { tem:tem, qual:qual, baixo:baixo, tronco:tronco, ombro:ombro, parte:parte, luzPropria:luzPropria, BAIXO:BAIXO, BRACOS:BRACOS,
              bracos:bracos, rosto:rosto, cabelo:cabelo, costas:costas, sombraFranja:sombraFranja, bagunca:bagunca, gravata:gravata };
  root.TWAvatarRoupa = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
