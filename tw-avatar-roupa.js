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
      if(roupa === 'y2k'){ g.rect(x + 3, y + 22, 6, 5); g.rect(x + 21, y + 22, 6, 5); g.rect(x + 7, y + 22, 3, 10); g.rect(x + 20, y + 22, 3, 10); }
      else if(roupa === 'citypop'){ g.rect(x + 2, y + 22, 6, 5); g.rect(x + 22, y + 22, 6, 5); g.rect(x + 7, y + 22, 4, 11); g.rect(x + 19, y + 22, 4, 11); }
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
    var cor = (c && c.outcol) || '#ffffff', mov = !pose ? {} : (BRACOS[pose] || BRACOS.v);   // outras poses do petPoseArms levantam o braço direito
    var formas = [];
    if(mov.L) formas.push(manga(x, y, mov.L)); else formas.push(function(){ retangulo(g, x + .6, y + 22, 5.6, 4.6, [2.2, 0, 0, 1.2]); });
    if(mov.R) formas.push(manga(x, y, mov.R)); else formas.push(function(){ retangulo(g, x + 23.8, y + 22, 5.6, 4.6, [0, 2.2, 1.2, 0]); });
    function manga(x, y, b){   // retângulo de 4 de comprimento e 5,4 de largura ao longo do braço, com o ombro arredondado
      return function(){
        var dx = b[2] - b[0], dy = b[3] - b[1], n = Math.sqrt(dx * dx + dy * dy) || 1, ux = dx / n, uy = dy / n, px = -uy * 2.7, py = ux * 2.7;
        var ax = x + b[0], ay = y + b[1], bx = ax + ux * 4, by = ay + uy * 4;
        g.moveTo(ax + px, ay + py); g.lineTo(bx + px, by + py); g.lineTo(bx - px, by - py); g.lineTo(ax - px, ay - py); g.closePath();
        g.moveTo(ax + 2.7, ay); g.arc(ax, ay, 2.7, 0, Math.PI * 2);
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

  var api = { tem:tem, qual:qual, baixo:baixo, tronco:tronco, ombro:ombro, parte:parte, luzPropria:luzPropria, BAIXO:BAIXO, BRACOS:BRACOS };
  root.TWAvatarRoupa = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);
