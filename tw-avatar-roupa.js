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
    return 'bermuda';   // V3.1: padrão unissex; a saia só aparece quando a pessoa escolhe
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
      // Bermuda com abertura central e cantos do tecido curvos.
      g.save();g.beginPath();g.moveTo(x+6.5,y+32);g.lineTo(x+23.5,y+32);
      g.quadraticCurveTo(x+24,y+36,x+23.2,y+39.7);g.quadraticCurveTo(x+20,y+40.3,x+15.6,y+39.7);
      g.quadraticCurveTo(x+15.4,y+37.8,x+15,y+36.4);g.quadraticCurveTo(x+14.6,y+37.9,x+14.4,y+39.7);g.quadraticCurveTo(x+10,y+40.3,x+6.8,y+39.7);
      g.quadraticCurveTo(x+6,y+36,x+6.5,y+32);g.closePath();g.clip();
      g.fillStyle = k.cor; g.fillRect(x + 6.5, y + 32, 17, 8);
      g.fillStyle = k.linha; g.fillRect(x + 14.6, y + 35, .8, 5);           // costura do meio
      if(k.barra){ g.fillStyle = corBarra; g.fillRect(x + 6.5, y + 39, 17, 1); }
      luz(g, x, y, function(){ g.rect(x + 6.5, y + 32, 17, 8); }, true);
      // Cintura e duas dobras curtas: volume sem mudar a silhueta nem o comprimento.
      g.save(); g.strokeStyle='rgba(255,255,255,.16)'; g.lineWidth=.45; g.lineCap='round';
      g.beginPath(); g.moveTo(x+7.4,y+33.4); g.lineTo(x+22.6,y+33.4); g.stroke();
      [10,20].forEach(function(px){g.beginPath();g.moveTo(x+px,y+34.2);g.quadraticCurveTo(x+px+(px<15?-.55:.55),y+35.5,x+px,y+36.7);g.stroke();});g.restore();g.restore();
      return true;
    }
    // Saia com caimento curvo na mesma largura histórica.
    g.save();g.beginPath();g.moveTo(x+6,y+32);g.lineTo(x+24,y+32);
    g.quadraticCurveTo(x+24.5,y+36,x+27,y+39.5);g.quadraticCurveTo(x+15,y+40.5,x+3,y+39.5);
    g.quadraticCurveTo(x+5.5,y+36,x+6,y+32);g.closePath();g.clip();
    g.fillStyle = k.cor; T(g, [x + 6, y + 32, x + 24, y + 32, x + 27, y + 40, x + 3, y + 40]);
    g.fillStyle = k.linha;
    [9, 12.5, 16, 19.5].forEach(function(px){ var d = (px - 15) * .12;
      g.beginPath();g.moveTo(x+px,y+34);g.quadraticCurveTo(x+px+d*.3,y+37,x+px+d,y+40);
      g.lineTo(x+px+1+d,y+40);g.quadraticCurveTo(x+px+.5+d*.3,y+37,x+px+.7,y+34);g.closePath();g.fill();
    });   // pregas que abrem em direção à barra
    if(k.barra){ g.fillStyle = corBarra; T(g, [x + 3.4, y + 39, x + 26.6, y + 39, x + 27, y + 40, x + 3, y + 40]); }
    luz(g, x, y, function(){ g.moveTo(x + 6, y + 32); g.lineTo(x + 24, y + 32); g.lineTo(x + 27, y + 40); g.lineTo(x + 3, y + 40); g.closePath(); }, true);
    // Luz nas cristas das pregas e cintura; todas as linhas ficam dentro do tecido.
    g.save();g.lineCap='round';g.lineWidth=.48;g.strokeStyle='rgba(255,255,255,.20)';
    [10.2,14,17.8,21.6].forEach(function(px){var d=(px-15)*.12;g.beginPath();g.moveTo(x+px,y+34.1);g.quadraticCurveTo(x+px+d*.35,y+36.5,x+px+d,y+38.7);g.stroke();});
    g.strokeStyle='rgba(40,10,70,.18)';g.beginPath();g.moveTo(x+6.3,y+33.1);g.lineTo(x+23.7,y+33.1);g.stroke();g.restore();g.restore();
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
        g.moveTo(ax + px, ay + py);
        g.quadraticCurveTo(ax+ux*alcance*.55+px*1.13,ay+uy*alcance*.55+py*1.13,bx+px*.91,by+py*.91);
        g.quadraticCurveTo(bx+ux*.45,by+uy*.45,bx-px*.91,by-py*.91);
        g.quadraticCurveTo(ax+ux*alcance*.55-px*1.13,ay+uy*alcance*.55-py*1.13,ax-px,ay-py);g.closePath();
        g.moveTo(ax + raio, ay); g.arc(ax, ay, raio, 0, Math.PI * 2, true); // mesma orientação do polígono: não recorta uma fresta no ombro
      };
    }
    function todas(){ formas.forEach(function(f){ f(); }); }
    g.save(); g.fillStyle = cor; g.beginPath(); todas(); g.fill(); g.restore();
    luz(g, x, y, todas, false);
    // Costura do punho dentro da manga, acompanhando a mesma direção do braço.
    g.save();g.lineWidth=.55;g.lineCap='round';g.strokeStyle='rgba(40,10,70,.21)';
    ['L','R'].forEach(function(lado){
      var b=mov[lado];
      if(b){
        var ox=b[0]+(blazer?(lado==='L'?.5:-.5):0),dx=b[2]-ox,dy=b[3]-b[1],n=Math.hypot(dx,dy)||1;
        var ux=dx/n,uy=dy/n,raio=(blazer?3.4:2.7)-.6,dist=(blazer?6:4)-.7;
        var cx=x+ox+ux*dist,cy=y+b[1]+uy*dist;
        g.beginPath();g.moveTo(cx-uy*raio,cy+ux*raio);g.lineTo(cx+uy*raio,cy-ux*raio);g.stroke();
      }else{
        var sx=lado==='L'?x+(blazer?1.8:1.4):x+(blazer?21.3:24.6),sy=y+(blazer?28.1:25.9),sw=blazer?6.7:4;
        g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+sw,sy);g.stroke();
      }
    });g.restore();
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
  // Contorno comum, ombro largo e mão curva. Mantém a régua 30×44.
  function camisa(g,x,y,c){
    g.save();g.beginPath();g.moveTo(x+11,y+21.6);
    g.quadraticCurveTo(x+6.8,y+21.2,x+4.2,y+24);
    g.quadraticCurveTo(x+5.9,y+26.6,x+6.8,y+29.4);
    g.quadraticCurveTo(x+7.2,y+31.5,x+6.1,y+33.6);
    g.quadraticCurveTo(x+10.3,y+34.7,x+15,y+34.4);
    g.quadraticCurveTo(x+19.7,y+34.7,x+23.9,y+33.6);
    g.quadraticCurveTo(x+22.8,y+31.5,x+23.2,y+29.4);
    g.quadraticCurveTo(x+24.1,y+26.6,x+25.8,y+24);
    g.quadraticCurveTo(x+23.2,y+21.2,x+19,y+21.6);
    g.closePath();g.clip();g.fillRect(x+4,y+21,22,15);
    tronco(g,x,y,'',c);
    g.strokeStyle='rgba(54,40,85,.18)';g.lineWidth=.45;
    g.beginPath();g.moveTo(x+7,y+33);g.quadraticCurveTo(x+15,y+34.1,x+23,y+33);g.stroke();
    // Pinças laterais da camisa: partem da axila e convergem para a cintura.
    [1,-1].forEach(function(k){var a=k===1?x:x+30;g.beginPath();
      g.moveTo(a+k*6.1,y+25.5);g.quadraticCurveTo(a+k*9.2,y+28.3,a+k*7.8,y+31.6);g.stroke();
    });
    g.restore();
  }
  function pescoco(g,x,y){
    g.beginPath();g.moveTo(x+12,y+18);g.lineTo(x+18,y+18);
    g.quadraticCurveTo(x+17,y+21.5,x+19,y+22.4);
    g.quadraticCurveTo(x+15,y+25.4,x+11,y+22.4);
    g.quadraticCurveTo(x+13,y+21.5,x+12,y+18);g.fill();
  }
  function coques(g,x,y,cor){
    g.save();
    for(var lado=-1;lado<=1;lado+=2){
      var cx=x+15+11*lado,cy=y+2.5;
      // Dois volumes de cabelo entrelaçados; as pontas se recolhem junto ao elástico.
      g.fillStyle=cor;g.beginPath();g.moveTo(cx-lado*3.5,cy+5);
      g.bezierCurveTo(cx-lado*8,cy+1,cx-lado*5.8,cy-5.2,cx,cy-6.3);
      g.bezierCurveTo(cx+lado*6.4,cy-7.1,cx+lado*7,cy+.9,cx+lado*3.8,cy+4);
      g.quadraticCurveTo(cx+lado*1.2,cy+6,cx-lado*3.5,cy+5);g.closePath();g.fill();
      g.strokeStyle='rgba(178,164,200,.38)';g.lineWidth=.68;g.lineCap='round';
      g.beginPath();g.moveTo(cx-lado*3.4,cy+2.1);g.bezierCurveTo(cx-lado*5.5,cy-3.5,cx+lado*2.8,cy-5.7,cx+lado*3.5,cy-1.6);
      g.quadraticCurveTo(cx+lado*4,cy+1.3,cx,cy+3.8);g.stroke();
      g.beginPath();g.moveTo(cx-lado*1.8,cy+2);g.quadraticCurveTo(cx-lado*3,cy-1.5,cx+lado*.8,cy-2.5);g.stroke();
      g.fillStyle='#4362b3';g.beginPath();g.ellipse(cx-lado,cy+4.6,3.8,1.3,-lado*.45,0,7);g.fill();
    }
    g.restore();
  }
  function formaBracos(g,x,y){
    [1,-1].forEach(function(k){
      var a=k===1?x:x+30;function X(v){return a+k*v;}
      g.moveTo(X(.9),y+24);g.quadraticCurveTo(X(.65),y+26.9,X(1.55),y+28.65);
      g.quadraticCurveTo(X(1.95),y+29.3,X(1.6),y+30);
      g.quadraticCurveTo(X(.9),y+31.4,X(1.5),y+32.5);
      g.quadraticCurveTo(X(2.2),y+33.6,X(3.55),y+33.3);
      g.quadraticCurveTo(X(4.8),y+33.15,X(4.8),y+31.9);
      g.quadraticCurveTo(X(5.9),y+32.05,X(5.65),y+31.15);
      g.quadraticCurveTo(X(5.4),y+30.45,X(4.45),y+29.7);
      g.quadraticCurveTo(X(4.15),y+28.9,X(4.8),y+27.5);
      g.quadraticCurveTo(X(5.25),y+25.6,X(5),y+24);g.closePath();
    });
  }
  function bracosBase(g,x,y){g.beginPath();formaBracos(g,x,y);g.fill();}
  function pernas(g,x,y,up){
    [9,17].forEach(function(dx,i){
      var X=x+dx,Y=y+36+((i===0?!up:up)?-2:0),B=y+44;
      g.beginPath();g.moveTo(X,Y);g.lineTo(X+5,Y);
      g.quadraticCurveTo(X+5,B-3,X+4.5,B-1);g.lineTo(X+4.5,B);
      g.lineTo(X+.5,B);g.lineTo(X+.5,B-1);
      g.quadraticCurveTo(X,B-3,X,Y);g.closePath();g.fill();
    });
  }
  function bracos(g, x, y){   // braços parados
    g.save();g.beginPath();formaBracos(g,x,y);g.clip();
    [1,25].forEach(function(dx){g.save();g.beginPath();g.rect(x+dx,y+24,4,9);g.clip();luzPele(g,x+dx,x+dx+4,y+24,y+33,true,y+28);g.restore();});g.restore();
    // Volume do antebraço e pulso, dentro dos pontos de encaixe.
    g.save();g.fillStyle='rgba(255,255,255,.13)';
    [2.1,26.1].forEach(function(a){g.beginPath();g.moveTo(x+a,y+25.1);g.quadraticCurveTo(x+a-.4,y+28.5,x+a+.3,y+30);g.quadraticCurveTo(x+a+.65,y+28.1,x+a+.65,y+25.1);g.closePath();g.fill();});g.restore();
    // Dobras pequenas da palma, legíveis no retrato.
    g.save();g.strokeStyle='rgba(65,28,45,.22)';g.lineWidth=.45;g.lineCap='round';
    [[x+2.1,x+3.5],[x+26.5,x+27.9]].forEach(function(p){g.beginPath();g.moveTo(p[0],y+30.4);g.quadraticCurveTo((p[0]+p[1])/2,y+29.9,p[1],y+30.5);g.stroke();});g.restore();
  }
  function rosto(g, x, y){
    g.save(); g.beginPath(); g.ellipse(x + 15, y + 17, 11, 11, 0, 0, 7); g.clip();
    luzPele(g, x + 4, x + 26, y + 5, y + 28, false, y + 21); g.restore();
  }
  // Chanel e longo: as costas continuam o degradê do topo. A cabeça fica 4px acima (translate), por isso 'topo' desloca a régua.
  function cabelo(g, H, HD, y, b, topo){
    if(b !== 'chanel' && b !== 'longo') return null;
    var L = b === 'longo' ? 41 : 25, d = topo ? 4 : 0, gr = g.createLinearGradient(0, y + 1 + d, 0, y + L + d);
    gr.addColorStop(0, H); gr.addColorStop(.22, H); gr.addColorStop(19 / (L - 1), HD); gr.addColorStop(1, escuro(H, 55));
    return gr;
  }
  function costas(g, x, y, b){   // contorno: sai da cabeça (centro y+8 antes do translate) e desce pelas laterais
    g.beginPath(); g.moveTo(x + 3, y + 8); g.arc(x + 15, y + 8, 12, Math.PI, 0);
    if(b === 'longo'){ g.quadraticCurveTo(x + 34, y + 34, x + 27, y + 41); g.quadraticCurveTo(x + 25, y + 40, x + 24, y + 37);
      g.quadraticCurveTo(x + 22, y + 42, x + 17, y + 42);
      g.lineTo(x + 15, y + 39);
      g.quadraticCurveTo(x + 11, y + 43, x + 7, y + 40);
      g.lineTo(x + 6, y + 37); g.lineTo(x + 3, y + 41); g.quadraticCurveTo(x - 4, y + 34, x + 3, y + 8); }
    else { // Chanel: volume na nuca, pontas dirigidas ao maxilar e contorno levemente assimétrico.
      g.quadraticCurveTo(x+29.8,y+14,x+28.1,y+20.8);
      g.quadraticCurveTo(x+27.5,y+24.4,x+25.3,y+25.2);
      g.quadraticCurveTo(x+20,y+26.6,x+15.7,y+25.7);
      g.quadraticCurveTo(x+10.3,y+27.2,x+5,y+25.7);
      g.quadraticCurveTo(x+.9,y+24.6,x+1.8,y+18);
      g.quadraticCurveTo(x+1.4,y+12,x+3,y+8);
    }   // chanel: corte reto logo abaixo do queixo (antes descia até o meio do tronco e parecia cabelo comprido)
    g.fill();
    // Mechas nas costas seguem a curvatura do corte, recortadas na silhueta.
    g.save();g.clip();g.lineCap='round';g.lineWidth=.65;g.strokeStyle='rgba(255,255,255,.15)';
    var fim=b==='longo'?39:24;
    g.beginPath();g.moveTo(x+6,y+5);g.quadraticCurveTo(x+1.8,y+17,x+5.8,y+fim);g.stroke();
    g.strokeStyle='rgba(40,10,70,.15)';g.beginPath();g.moveTo(x+24,y+7);g.quadraticCurveTo(x+29,y+18,x+24.2,y+fim);g.stroke();g.restore();
  }
  // Sombra de 1px da franja, só na pele: fora do topo e das costeletas (que têm o mesmo degradê).
  // Abre um save() próprio e devolve true: o drawChar desenha a franja uma vez aqui (só para gerar a sombra),
  // fecha com restore() e desenha a franja de novo sem este recorte, cobrindo as frestas de anti-aliasing do recorte.
  function sombraFranja(g, x, y, f, sl, ondulado){
    if(f === 'espetada' || f === 'arcoiris' || ondulado) return false;
    g.save(); g.beginPath(); g.rect(x - 12, y - 16, 54, 60); g.moveTo(x + 3, y + 12); g.arc(x + 15, y + 12, 12, Math.PI, 0); g.closePath();
    g.rect(x + 3, y + 11.5, 4, sl + .5); g.rect(x + 23, y + 11.5, 4, sl + .5); g.clip('evenodd');
    var t = g.getTransform ? Math.abs(g.getTransform().d) : 1;
    g.shadowColor = 'rgba(40,10,70,.22)'; g.shadowOffsetX = 0; g.shadowOffsetY = t * 1.1; g.shadowBlur = 0;
    return true;
  }
  function bagunca(g, x, y){   // franja da Tsu: três mechas curvas
    g.beginPath();g.moveTo(x+3,y+8);g.quadraticCurveTo(x+2.7,y+12.7,x+5,y+16.2);
    g.quadraticCurveTo(x+6.5,y+18.4,x+8.2,y+19.5);
    g.quadraticCurveTo(x+7.7,y+15.3,x+12,y+10.8);
    g.quadraticCurveTo(x+12.1,y+14.7,x+16.3,y+18.2);
    g.quadraticCurveTo(x+17.1,y+14,x+20.1,y+10.1);
    g.quadraticCurveTo(x+21.1,y+13.9,x+24.2,y+16.6);
    g.quadraticCurveTo(x+24.6,y+13,x+27,y+10.2);
    g.lineTo(x+27,y+8);g.quadraticCurveTo(x+15,y+4.8,x+3,y+8);g.closePath();g.fill();
  }
  function gravata(g, x, y){   // Trainee: nó, lâmina com ponta e brilho do lado da luz
    // As pontas da gola acompanham o nó da gravata.
    g.fillStyle = 'rgba(60,42,92,.23)';
    T(g,[x+9,y+22,x+15,y+23,x+12,y+26.5]);
    T(g,[x+21,y+22,x+15,y+23,x+18,y+26.5]);
    g.fillStyle = '#fff8f4';
    T(g,[x+9,y+21.8,x+15,y+22.6,x+12,y+25.5]);
    T(g,[x+21,y+21.8,x+15,y+22.6,x+18,y+25.5]);
    g.fillStyle = '#1b2a5e'; T(g, [x + 14.4, y + 24.2, x + 16.6, y + 24.2, x + 17.5, y + 30.6, x + 15.5, y + 32.6, x + 13.5, y + 30.6]);
    g.fillStyle = 'rgba(255,255,255,.16)'; T(g, [x + 14.4, y + 24.2, x + 15.5, y + 24.2, x + 15.5, y + 32.6, x + 13.5, y + 30.6]);
    g.fillStyle = '#14204a'; T(g, [x + 13.7, y + 22, x + 17.3, y + 22, x + 16.7, y + 24.4, x + 14.3, y + 24.4]);
    g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(x + 14.3, y + 22.4, 1.2, .8);
  }

  // 22/11/2026: os looks do Center⭐Run! viram roupas de vestir (c.out = 'cr_…'), liberadas pelo recorde.
  // Os 5 uniformes de rank reaproveitam o desenho de rank do drawChar (OF 1–5, com capa, asas e auréola);
  // o Abduzido é o macacão espacial da abdução; Fever, Ímã e Mega têm o look próprio abaixo (crLook).
  var CR = {
    cr_center:{ of:1 }, cr_solo:{ of:2 }, cr_capitao:{ of:3 }, cr_ace:{ of:4 }, cr_kami:{ of:5 },
    cr_alien:{ alien:true }, cr_fever:{ fx:'fever' }, cr_ima:{ fx:'ima' }, cr_mega:{ fx:'mega' }
  };
  function cr(out){ return typeof out === 'string' && Object.prototype.hasOwnProperty.call(CR, out) ? CR[out] : null; }
  // [camisa, saia, enfeite]: as mesmas cores que o Fever (rosa) e o Ímã (lilás) dão ao uniforme na corrida
  var CR_COR = { fever:['#ff6fa5', '#ffc2dc', '#ffe14d'], ima:['#b392f0', '#dccdfa', '#ffffff'], mega:['#ff4fa3', '#ffc2dc', '#ffffff'] };
  function estrela(g, cx, cy, r){ g.beginPath(); for(var k = 0; k < 10; k++){ var rr = k % 2 ? r * .42 : r, a = k * Math.PI / 5 - Math.PI / 2; g[k ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } g.closePath(); g.fill(); }
  function coracao(g, cx, cy, r){ g.beginPath(); g.moveTo(cx, cy + r); g.bezierCurveTo(cx - r * 1.6, cy - r * .2, cx - r * .7, cy - r * 1.4, cx, cy - r * .45); g.bezierCurveTo(cx + r * .7, cy - r * 1.4, cx + r * 1.6, cy - r * .2, cx, cy + r); g.fill(); }
  // De frente, na grade 30×44 do drawChar. Devolve true quando desenhou (o drawChar pula a roupa básica).
  function crLook(g, c, x, y, fx, E, T2){
    var k = CR_COR[fx]; if(!k) return false;
    T2 = T2 || function(a){ T(g, a); };
    g.fillStyle = k[1]; T2([x + 6, y + 32, x + 24, y + 32, x + 27, y + 40, x + 3, y + 40]);   // saia rodada
    g.fillStyle = 'rgba(255,255,255,.55)'; [9, 13, 17, 21].forEach(function(px){ g.fillRect(x + px, y + 34, .7, 5.4); });
    g.fillStyle = fx === 'ima' ? '#7b3ff0' : '#ffffff'; T2([x + 3.4, y + 38.8, x + 26.6, y + 38.8, x + 27, y + 40, x + 3, y + 40]);
    g.fillStyle = k[0]; g.fillRect(x + 4, y + 22, 22, 12);   // blusa
    luz(g, x, y, function(){ g.rect(x + 4, y + 22, 22, 12); }, false);
    if(fx === 'fever'){   // estrela amarela no peito e chaminhas na barra
      g.fillStyle = k[2]; estrela(g, x + 15, y + 27.4, 3.6);
      g.fillStyle = '#ffd23f'; [6, 11, 16, 21].forEach(function(px){ T2([x + px, y + 34, x + px + 1.5, y + 31.4, x + px + 3, y + 34]); });
    } else if(fx === 'ima'){   // ímã em U no peito, com as pontas brancas, e estrelinhas sendo puxadas
      g.fillStyle = '#ff3d5e'; g.fillRect(x + 11.6, y + 24.4, 2.2, 5); g.fillRect(x + 16.2, y + 24.4, 2.2, 5); g.fillRect(x + 11.6, y + 28.2, 6.8, 2.2);
      g.fillStyle = '#ffffff'; g.fillRect(x + 11.6, y + 24.4, 2.2, 1.4); g.fillRect(x + 16.2, y + 24.4, 2.2, 1.4);
      g.fillStyle = '#ffe14d'; estrela(g, x + 8, y + 24.6, 1.5); estrela(g, x + 22, y + 24.6, 1.5);
    } else {   // Mega: coração branco grande e cinto dourado
      g.fillStyle = k[2]; coracao(g, x + 15, y + 26.8, 3.4);
      g.fillStyle = '#ffd23f'; g.fillRect(x + 4, y + 32, 22, 1.6);
    }
    return true;
  }

  var api = { tem:tem, qual:qual, baixo:baixo, tronco:tronco, ombro:ombro, parte:parte, luzPropria:luzPropria, BAIXO:BAIXO, BRACOS:BRACOS,
              bracos:bracos, bracosBase:bracosBase, pernas:pernas, camisa:camisa, pescoco:pescoco, coques:coques, rosto:rosto, cabelo:cabelo, costas:costas, sombraFranja:sombraFranja, bagunca:bagunca, gravata:gravata,
              cr:cr, crLook:crLook, CR_COR:CR_COR };
  root.TWAvatarRoupa = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);

