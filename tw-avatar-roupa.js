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
  // Assinaturas dos personagens oficiais, nunca gravadas no avatar ou atribuídas por gênero.
  // Os pés, punhos e ombros conservam as âncoras usadas nas poses e nas colisões.
  var PERFIS=Object.freeze({
    Tsu:Object.freeze({cintura:5.8,ombro:3.9,perna:.20,joelho:.25,assim:.15}),
    Lirika:Object.freeze({cintura:6.5,ombro:4.3,perna:.15,joelho:.15,assim:0}),
    Pati:Object.freeze({cintura:6.1,ombro:4.1,perna:.30,joelho:.20,assim:-.12})
  });
  var NEUTRO=Object.freeze({cintura:6.3,ombro:4.2,perna:0,joelho:0,assim:0});
  function assinatura(c){
    return c&&Object.prototype.hasOwnProperty.call(PERFIS,c.n)?PERFIS[c.n]:NEUTRO;
  }
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
    // Abas costuradas em tecido: Cheeky tem recorte oblíquo, City Pop uma lapela e bolso.
    if(roupa==='y2k'||roupa==='citypop'){
      g.save();g.fillStyle='rgba(40,10,70,.19)';
      var a=roupa==='y2k'?10:11;
      T(g,[x+7,y+22,x+a,y+22,x+7.4,y+27]);
      T(g,[x+30-a,y+22,x+23,y+22,x+22.6,y+27]);
      g.strokeStyle='rgba(255,255,255,.36)';g.lineWidth=.45;
      g.beginPath();g.moveTo(x+8,y+30);g.lineTo(x+9.5,y+30);g.moveTo(x+20.5,y+30);g.lineTo(x+22,y+30);g.stroke();g.restore();
    }
  }

  // Parte de baixo no lugar do retângulo claro comum. Devolve false quando a roupa não usa (fica o desenho antigo).
  function baixo(g, c, x, y, roupa){
    if(!tem(roupa)) return false;
    var k = BAIXO[roupa], tipo = qual(c, roupa), corBarra = (c && c.outcol) || '#ff8fc8';
    if(tipo === 'bermuda'){
      // Bermuda com abertura central e cantos do tecido curvos.
      var cintura = assinatura(c).cintura;
      g.save(); g.beginPath(); g.moveTo(x+cintura,y+32);
      g.quadraticCurveTo(x+15,y+33,x+30-cintura,y+32);
      g.quadraticCurveTo(x+25,y+34.5,x+24.5,y+39.1);
      g.quadraticCurveTo(x+21,y+40.6,x+16,y+39.9);
      g.lineTo(x+15,y+36.7); g.lineTo(x+14,y+39.9);
      g.quadraticCurveTo(x+9,y+40.6,x+5.5,y+39.1);
      g.quadraticCurveTo(x+5,y+34.5,x+cintura,y+32); g.closePath();
      g.clip(); g.fillStyle = k.cor; g.fillRect(x+5,y+32,20,9);
      g.fillStyle = k.linha; g.fillRect(x + 14.6, y + 35, .8, 5);           // costura do meio
      if(k.barra){ g.fillStyle = corBarra; g.fillRect(x + 5, y + 39, 20, 1); }
      luz(g, x, y, function(){ g.rect(x + 6.5, y + 32, 17, 8); }, true);
      // Cintura e duas dobras curtas: volume sem mudar a silhueta nem o comprimento.
      g.save(); g.strokeStyle='rgba(255,255,255,.16)'; g.lineWidth=.45; g.lineCap='round';
      g.beginPath(); g.moveTo(x+7.4,y+33.4); g.lineTo(x+22.6,y+33.4); g.stroke();
      g.restore();g.restore();
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
    coracao:{L:[3,25.5,10.3,28.5],R:[27,25.5,20,28.5]}, mic:{R:[27,25.5,22.5,23.2]}, nyan:{}   // braços dobrados para dentro: a manga fica no ombro e o braço passa por cima
  };
  // Régua frontal 30 × 44. Os punhos das fotos continuam sob os dedos e os objetos.
  // Cada segmento tem uma largura própria. O eixo da manga termina no cotovelo.
  function articulacao(c, pose, lado){
    var dir = lado === 'L' ? -1 : 1, ombro = 15 + dir * 12;
    var estilo = assinatura(c), abertura = estilo.assim * 2.6 + estilo.perna;
    var ex, ey, wx, wy;
    if(typeof pose === 'object' && pose && Number.isFinite(pose.sit)){
      var senta = pose.sit, repouso = Math.max(0, -pose.rot / .17);
      var visita = Math.max(0, pose.rot / .13);
      ex = ombro + dir * (1 + abertura + visita * 1.6) * senta;
      ey = 29 + senta * (2.6 - repouso);
      wx = ombro - dir * (5.3 - abertura) * senta;
      wy = 32 + 1.4 * senta;
      if(lado === 'L'){ wx -= 4 * repouso; wy -= 11 * repouso; }
      else { wx += 12 * visita; wy -= 5 * visita; }
    }else{
      var alvo = BRACOS[pose] && BRACOS[pose][lado];
      if(!alvo) return null;
      wx = alvo[2]; wy = alvo[3];
      var sobe = wy < 20;
      ex = ombro + dir * (sobe ? 4.6 : 1.5) + dir * abertura;
      ey = sobe ? (pose === 'banzai' ? 19.5 : 22.4) : 31.4;
    }
    return [ombro, 25.5, ex, ey, wx, wy];
  }
  function membro(g, c, x, y, pose, lado){
    var a = articulacao(c, pose, lado);
    if(!a) return;
    g.save(); g.lineCap = 'round'; g.strokeStyle = c.skin;
    // One soft silhouette rather than two visibly tapered sticks.
    g.lineWidth = 4.1; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(x+a[0],y+a[1]);
    g.lineTo(x+(a[0]+a[2])*.5,y+(a[1]+a[3])*.5);
    g.quadraticCurveTo(x+a[2],y+a[3],x+(a[2]+a[4])*.5,y+(a[3]+a[5])*.5);
    g.lineTo(x+a[4],y+a[5]); g.stroke();
    if(typeof pose === 'object' || pose === 'coracao'){
      g.fillStyle = c.skin; g.beginPath();
      g.ellipse(x+a[4], y+a[5], 2.25, 1.6, Math.atan2(a[5]-a[3],a[4]-a[2]), 0, 2*Math.PI); g.fill();
    }
    g.restore();
  }
  // Ombro ligado à roupa. Braço parado: manguinha no ombro. Braço em pose: a manga gira junto com o braço,
  // saindo do ombro na direção da mão, e o braço continua de dentro dela.
  function ombro(g, c, x, y, roupa, pose){
    if(!tem(roupa)) return;
    var cor = (c && c.outcol) || '#ffffff', mov = {L:articulacao(c,pose,'L'), R:articulacao(c,pose,'R')},
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
    // Corte e costura distintos nos três figurinos de palco; os ornamentos originais vêm por cima.
    g.save();g.beginPath();p[1](g,x,y);g.clip();g.lineWidth=.55;g.strokeStyle='rgba(54,30,80,.24)';g.lineCap='round';
    if(nome==='estrelado-baixo'||nome==='sweet-saia'||nome==='zipper-saia'){
      var xs=nome==='zipper-saia'?[6,24]:nome==='sweet-saia'?[5,10,20,25]:[8,13,17,22];
      xs.forEach(function(a){g.beginPath();g.moveTo(x+a,y+32);g.quadraticCurveTo(x+a+(a-15)*.12,y+37,x+a+(a-15)*.3,y+43);g.stroke();});
    }else if(nome==='zipper-mangas'||nome==='zipper-tronco'){
      [2,28].forEach(function(a){g.beginPath();g.moveTo(x+a-2,y+24);g.quadraticCurveTo(x+a,y+26,x+a+2,y+24);g.stroke();});
    }else{
      [7,23].forEach(function(a){g.beginPath();g.moveTo(x+a,y+24);g.quadraticCurveTo(x+a+(15-a)*.15,y+28,x+a,y+32);g.stroke();});
    }
    g.restore();
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
    // Identity Restoration: a cintura individual fica sugerida (≈4,4–4,7) e a camisa encosta nos braços,
    // como o bloco 4–26 da main; antes ficava um vão claro entre manga, braço e tronco.
    var a=assinatura(c),w=4.6+(a.cintura-6.3)*.35,omb=a.ombro;
    g.save();g.beginPath();g.moveTo(x+11,y+21.6);
    g.quadraticCurveTo(x+6.8,y+21.2,x+omb,y+24);
    g.quadraticCurveTo(x+5.9,y+26.6,x+w,y+29.4);
    g.quadraticCurveTo(x+w+.3,y+31.5,x+w-1.1,y+33.6+a.assim);
    g.quadraticCurveTo(x+10.3,y+34.7,x+15,y+34.4);
    g.quadraticCurveTo(x+19.7,y+34.7,x+31.1-w,y+33.6-a.assim);
    g.quadraticCurveTo(x+29.7-w,y+31.5,x+30-w,y+29.4);
    g.quadraticCurveTo(x+24.1,y+26.6,x+30-omb,y+24);
    g.quadraticCurveTo(x+23.2,y+21.2,x+19,y+21.6);
    g.closePath();g.clip();g.fillRect(x+4,y+21,22,15);
    tronco(g,x,y,'',c);
    g.strokeStyle='rgba(54,40,85,.18)';g.lineWidth=.45;
    g.beginPath();g.moveTo(x+7,y+33);g.quadraticCurveTo(x+15,y+34.1,x+23,y+33);g.stroke();
    // Apenas a barra: sem pinças anatômicas no pequeno uniforme.
    g.restore();
  }
  // Franja reta clássica: uma massa contínua, sem serrilhado de mechas.
  function reta(g,x,y){
    g.beginPath();g.moveTo(x+3,y+8);g.quadraticCurveTo(x+15,y+7.5,x+27,y+8);
    g.lineTo(x+27,y+14);g.quadraticCurveTo(x+15,y+14.35,x+3,y+14);
    g.closePath();g.fill();
  }
  function pescoco(g,x,y){
    // Pescoço discreto, sob o queixo e a gola, na régua original.
    g.fillRect(x+12,y+18,6,6);
  }
  function coques(g,x,y,cor){
    // Volumes originais, unidos à calota e com os elásticos clássicos.
    g.fillStyle=cor;
    [4,26].forEach(function(cx){g.beginPath();g.ellipse(x+cx,y+3,6,6,0,0,7);g.fill();});
    g.fillStyle='#2a5bd7';g.fillRect(x+1,y+6,7,3);g.fillRect(x+22,y+6,7,3);
  }
  function formaBracos(g,x,y){
    // Identity Restoration: braço único encostado no tronco, punho levemente recolhido e mão arredondada.
    // As âncoras de ombro (y+24) e da ponta da mão (y+33,4) são as mesmas da régua 30×44.
    [1,-1].forEach(function(k){
      var a=k===1?x:x+30;function X(v){return a+k*v;}
      g.moveTo(X(.8),y+24);g.quadraticCurveTo(X(.55),y+27,X(.95),y+29.5);
      g.quadraticCurveTo(X(.45),y+30.9,X(.75),y+32.3);
      g.quadraticCurveTo(X(1.3),y+33.5,X(3),y+33.4);
      g.quadraticCurveTo(X(5),y+33.4,X(5.25),y+31.7);
      g.quadraticCurveTo(X(5.35),y+30.3,X(4.95),y+29.5);
      g.quadraticCurveTo(X(5.3),y+27,X(5.4),y+24);
      g.quadraticCurveTo(X(3),y+23.4,X(.8),y+24);g.closePath();
    });
  }
  function bracosBase(g,x,y){g.beginPath();formaBracos(g,x,y);g.fill();}
  function pernas(g,x,y,up,c){
    var a=assinatura(c);
    [9,17].forEach(function(dx,i){
      var X=x+dx,Y=y+36+((i===0?!up:up)?-2:0),B=y+44;
      var k=i===0?-a.joelho:a.joelho;
      g.beginPath();g.moveTo(X-a.perna,Y);g.lineTo(X+5+a.perna,Y);
      g.quadraticCurveTo(X+5.1+a.perna+k,B-4,X+4.5,B-1);g.lineTo(X+4.5,B);
      g.lineTo(X+.5,B);g.lineTo(X+.5,B-1);
      g.quadraticCurveTo(X-.1-a.perna+k,B-4,X-a.perna,Y);g.closePath();g.fill();
    });
  }
  function bracos(g, x, y){   // braços parados
    g.save();g.beginPath();formaBracos(g,x,y);g.clip();
    [1,25].forEach(function(dx){g.save();g.beginPath();g.rect(x+dx-.3,y+24,4.8,9.6);g.clip();luzPele(g,x+dx,x+dx+4,y+24,y+33.4,true,y+28);g.restore();});g.restore();
    // Dobra da palma da main: é o que faz a ponta do braço ser lida como mão no celular.
    g.save();g.strokeStyle='rgba(65,28,45,.22)';g.lineWidth=.45;g.lineCap='round';
    [[x+2.1,x+3.5],[x+26.5,x+27.9]].forEach(function(p){g.beginPath();g.moveTo(p[0],y+31.2);g.quadraticCurveTo((p[0]+p[1])/2,y+30.7,p[1],y+31.3);g.stroke();});g.restore();
  }
  function rosto(g, x, y){
    g.save(); g.beginPath(); g.ellipse(x + 15, y + 17, 11, 11, 0, 0, 7); g.clip();
    luzPele(g, x + 4, x + 26, y + 5, y + 28, false, y + 21); g.restore();
  }
  // Chanel e longo: as costas continuam o degradê do topo. A cabeça fica 4px acima (translate), por isso 'topo' desloca a régua.
  function cabelo(g, H, HD, y, b, topo){
    if(b !== 'chanel' && b !== 'longo') return null;
    var L = b === 'longo' ? 41 : 25, d = topo ? 4 : 0, gr = g.createLinearGradient(0, y + 1 + d, 0, y + L + d);
    gr.addColorStop(0, H); gr.addColorStop(19 / (L - 1), HD); gr.addColorStop(1, escuro(H, 82));
    return gr;
  }
  // Nuca clássica: os três volumes originais da frente, compartilhados.
  function pixie(g,x,y){
    T(g,[x+4,y+10,x+0,y+17,x+3,y+19,x+2,y+24,x+8,y+21,x+9,y+14]);
    T(g,[x+26,y+10,x+30,y+17,x+27,y+19,x+28,y+24,x+22,y+21,x+21,y+14]);
    T(g,[x+9,y+22,x+15,y+28,x+21,y+22]);
  }
  function costas(g, x, y, b){   // contorno: sai da cabeça (centro y+8 antes do translate) e desce pelas laterais
    g.beginPath(); g.moveTo(x + 3, y + 8); g.arc(x + 15, y + 8, 12, Math.PI, 0);
    if(b === 'longo'){ g.quadraticCurveTo(x + 34, y + 34, x + 27, y + 41); g.lineTo(x + 3, y + 41); g.quadraticCurveTo(x - 4, y + 34, x + 3, y + 8); }
    else { g.quadraticCurveTo(x + 30.5, y + 21, x + 26.5, y + 25); g.lineTo(x + 3.5, y + 25); g.quadraticCurveTo(x - .5, y + 21, x + 3, y + 8); }   // chanel: corte reto logo abaixo do queixo (antes descia até o meio do tronco e parecia cabelo comprido)
    g.fill();
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
    g.beginPath(); g.moveTo(x + 3, y + 8); g.lineTo(x + 3, y + 12); g.quadraticCurveTo(x + 4.5, y + 17, x + 8, y + 19.5);
    g.quadraticCurveTo(x + 8.6, y + 14, x + 11.5, y + 10.5); g.quadraticCurveTo(x + 12.6, y + 15.5, x + 16, y + 18);
    g.quadraticCurveTo(x + 16.8, y + 13, x + 19.8, y + 9.5); g.quadraticCurveTo(x + 21.4, y + 14, x + 24.5, y + 16.5);
    g.quadraticCurveTo(x + 24.9, y + 12.5, x + 27, y + 10.5); g.lineTo(x + 27, y + 8); g.closePath(); g.fill();
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

  var api = { pixie:pixie, assinatura:assinatura, articulacao:articulacao, membro:membro, tem:tem, qual:qual, baixo:baixo, tronco:tronco, ombro:ombro, parte:parte, luzPropria:luzPropria, BAIXO:BAIXO, BRACOS:BRACOS,
              bracos:bracos, bracosBase:bracosBase, pernas:pernas, camisa:camisa, pescoco:pescoco, coques:coques, rosto:rosto, cabelo:cabelo, costas:costas, sombraFranja:sombraFranja, bagunca:bagunca, reta:reta, gravata:gravata,
              cr:cr, crLook:crLook, CR_COR:CR_COR };
  root.TWAvatarRoupa = api;
  if(typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : this);

