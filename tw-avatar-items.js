/* Desenhos originais: feat/avatar-careca-capitao-estrela.
   21/11/2026: Coroa de Tulipas, Chapéu de Palha e Torrada vieram do centerrun.js para cá — antes só o
   Center⭐Run! as desenhava e elas sumiam no Karaoke⭐Time! e no Sora⭐Jump!. */
(function(){
'use strict';
window.TWAvatarItems={
 tulipa:function(g,c,x,y){   // Coroa de Tulipas (Zipper⭐Shop!) — guirlanda mística: ramos, folhas ovais e tulipas de pétalas arredondadas
    function E(cx,cy,rx,ry,r){g.beginPath();g.ellipse(cx,cy,rx,ry,r||0,0,7);g.fill();}   // mesma elipse cheia do drawChar
 // guirlanda mística: ramos, folhas ovais e tulipas de pétalas arredondadas
    var tc=['#9b30d9','#b6ff3b','#4169e1',/^#[0-9a-f]{6}$/i.test(c.luz||'')?c.luz:'#ff6fb5'];
    g.strokeStyle='#3b9d70';g.lineWidth=1.25;g.beginPath();g.moveTo(x+2,y+8);g.bezierCurveTo(x+7,y-2,x+23,y-2,x+28,y+8);g.stroke();
    for(var tf=0;tf<4;tf++){
      var fx=x+5.5+tf*6.3,fy=y+2.8-Math.sin(tf*Math.PI/3)*2;
      g.fillStyle='#52b978';E(fx-3.5,fy+2.8,2.6,1.25,-.55);E(fx+3.5,fy+2.8,2.6,1.25,.55);
      g.strokeStyle='#32875c';g.lineWidth=.7;g.beginPath();g.moveTo(fx,fy+5);g.lineTo(fx,fy);g.stroke();
      g.fillStyle=tc[tf];g.beginPath();g.moveTo(fx-3,fy+1.5);g.bezierCurveTo(fx-4.3,fy-3.5,fx-1.8,fy-4.3,fx,fy-1.8);g.bezierCurveTo(fx+1.8,fy-4.3,fx+4.3,fy-3.5,fx+3,fy+1.5);g.quadraticCurveTo(fx,fy+4.6,fx-3,fy+1.5);g.fill();
      g.fillStyle='rgba(255,255,255,.65)';E(fx-.9,fy-.7,.75,1.05,-.4);
    }
    g.fillStyle='#fff4b1';E(x+15,y-5.5,.9,.9);E(x+2,y+3,.65,.65);E(x+28,y+3,.65,.65);
  
 },
 palha:function(g,x,y){   // Chapéu de Palha (Zipper⭐Shop!) — copa cobrindo o topo, aba na altura da testa e fita TsuLiPa
    function E(cx,cy,rx,ry,r){g.beginPath();g.ellipse(cx,cy,rx,ry,r||0,0,7);g.fill();}   // mesma elipse cheia do drawChar
 // chapéu de palha que veste a cabeça: copa cobrindo o topo, aba na altura da testa e fita TsuLiPa
    g.fillStyle='#e7bf74';g.beginPath();g.ellipse(x+15,y+7.4,16.6,3.2,-.05,0,7);g.fill();                      // aba (parte de trás)
    g.fillStyle='#f7dc9b';g.beginPath();g.moveTo(x+4.6,y+7);g.quadraticCurveTo(x+4.2,y-3.6,x+15,y-4);g.quadraticCurveTo(x+25.8,y-3.6,x+25.4,y+7);g.closePath();g.fill();   // copa
    g.strokeStyle='rgba(177,130,59,.4)';g.lineWidth=.5;g.beginPath();g.moveTo(x+7,y-.4);g.quadraticCurveTo(x+15,y-2.6,x+23,y-.4);g.moveTo(x+5.6,y+2.2);g.quadraticCurveTo(x+15,y+.4,x+24.4,y+2.2);g.stroke();   // trama
    g.fillStyle='#9b30d9';g.fillRect(x+4.9,y+4,20.2,2);g.fillStyle='#b6ff3b';g.fillRect(x+12,y+4,3,2);g.fillStyle='#4169e1';g.fillRect(x+16,y+4,3,2);   // fita
    g.fillStyle='#f9df9d';g.beginPath();g.ellipse(x+15,y+7.6,16,2.3,-.05,0,7);g.fill();                         // aba (frente)
    g.strokeStyle='rgba(172,121,55,.5)';g.lineWidth=.6;g.beginPath();g.ellipse(x+15,y+7.6,16,2.3,-.05,0,7);g.stroke();
    g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(x+10,y-.6,3.6,1.1,-.3,0,7);g.fill();             // brilho da copa
    g.fillStyle='#9b30d9';g.beginPath();g.ellipse(x+22.6,y+5,1.9,1.5,0,0,7);g.fill();g.fillStyle='#fff3b2';g.beginPath();g.ellipse(x+22.6,y+5,.7,.7,0,0,7);g.fill();   // florzinha
  
 },
 torrada:function(g,x,y){   // Torrada na boca (item de mão) — a ponta fica entre os lábios, com o pão pendendo para fora
    function E(cx,cy,rx,ry,r){g.beginPath();g.ellipse(cx,cy,rx,ry,r||0,0,7);g.fill();}   // mesma elipse cheia do drawChar
 // a ponta fica entre os lábios, com o pão pendendo para fora
    g.save();g.translate(x+15.5,y+24);g.rotate(-.24);
    g.fillStyle='#bc7a40';g.beginPath();g.moveTo(-1,-1);g.lineTo(1,-2.4);g.lineTo(3,-1.5);g.quadraticCurveTo(9,-4,11,-1);g.lineTo(11,9);g.quadraticCurveTo(6,11,1,9);g.closePath();g.fill();
    g.fillStyle='#f6ce86';g.beginPath();g.moveTo(1,.2);g.lineTo(3,-.2);g.quadraticCurveTo(8,-2,9,-.2);g.lineTo(9,7.6);g.quadraticCurveTo(5,9,2,7.4);g.closePath();g.fill();
    g.fillStyle='#ffe9b1';g.fillRect(4,2,3.8,3.5);g.fillStyle='rgba(176,109,53,.28)';g.fillRect(3,6.7,5,1);g.restore();
    g.strokeStyle='#643725';g.lineWidth=1.4;g.beginPath();g.moveTo(x+13.1,y+24);g.quadraticCurveTo(x+15.2,y+25.3,x+17,y+24);g.stroke(); // boca segura a ponta do pão
  
 },
 capitao:function(g,x,y){   // quepe militar: copa larga e achatada, faixa dourada, cordão, pala preta e insígnia de estrela
    g.save();g.translate(0,2.2);   // assenta na cabeça (antes ficava pousado acima do cabelo)
    var capShade=g.createLinearGradient(x+5,y-8,x+25,y+6);capShade.addColorStop(0,'#1a1a25');capShade.addColorStop(.48,'#090b12');capShade.addColorStop(1,'#03040a');
    g.fillStyle=capShade;g.strokeStyle='rgba(255,231,178,.58)';g.lineWidth=.7;
    g.beginPath();g.moveTo(x+5,y+2.5);g.lineTo(x+0.5,y-4.5);g.quadraticCurveTo(x+15,y-11,x+29.5,y-4.5);g.lineTo(x+25,y+2.5);g.closePath();g.fill();g.stroke();
    g.fillStyle='rgba(255,255,255,.10)';g.beginPath();g.ellipse(x+15,y-5.2,12.5,2.2,0,0,7);g.fill();   // tampo achatado
    var goldBand=g.createLinearGradient(0,y,0,y+3);goldBand.addColorStop(0,'#fff0b0');goldBand.addColorStop(.45,'#e7b94e');goldBand.addColorStop(1,'#a96c20');g.fillStyle=goldBand;g.fillRect(x+5,y-0.5,20,3);
    var brimShade=g.createLinearGradient(x+3,y+3,x+27,y+8);brimShade.addColorStop(0,'#080910');brimShade.addColorStop(.5,'#2a2a36');brimShade.addColorStop(1,'#04050b');
    g.fillStyle=brimShade;g.beginPath();g.moveTo(x+4,y+2.4);g.quadraticCurveTo(x+15,y+9.5,x+26,y+2.4);g.closePath();g.fill();g.stroke();   // pala
    g.strokeStyle='#e7b94e';g.lineWidth=.7;g.beginPath();g.moveTo(x+6,y+3.1);g.quadraticCurveTo(x+15,y+5,x+24,y+3.1);g.stroke();   // cordão
    g.fillStyle='#ffe27a';g.beginPath();g.ellipse(x+6,y+3.1,.9,.9,0,0,7);g.ellipse(x+24,y+3.1,.9,.9,0,0,7);g.fill();
    g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=.55;g.beginPath();g.moveTo(x+4,y-4.6);g.quadraticCurveTo(x+15,y-9.5,x+26,y-4.6);g.stroke();
    g.fillStyle='#ffe27a';g.strokeStyle='#a96c20';g.lineWidth=.45;g.beginPath();
    for(var si=0;si<10;si++){var sr=si%2===0?3.3:1.45,sa=-Math.PI/2+si*Math.PI/5,sx=x+15+Math.cos(sa)*sr,sy=y-4+Math.sin(sa)*sr;if(si===0)g.moveTo(sx,sy);else g.lineTo(sx,sy);}
    g.closePath();g.fill();g.stroke();
    g.restore();
 },
 estrela:function(g,x,y){   // presilha de estrela ao lado da franja (mesma região do hibisco, um pouco abaixo)
    g.save();g.translate(x+5.5,y+8);
    g.rotate(-.35);g.fillStyle='#c9cdd8';g.fillRect(-5.5,-.8,11,1.6);g.fillStyle='#8f95a6';g.fillRect(-5.5,.4,11,.4);g.rotate(.35);   // grampo
    var starGold=g.createRadialGradient(-.8,-1.1,.2,0,0,3.3*1.45);starGold.addColorStop(0,'#fff2b8');starGold.addColorStop(.55,'#f2c34c');starGold.addColorStop(1,'#c98b28');
    g.fillStyle=starGold;g.strokeStyle='#fff0bd';g.lineWidth=.6;g.beginPath();
    for(var si=0;si<10;si++){var sr=si%2===0?4.6:2.05,sa=-Math.PI/2+si*Math.PI/5;if(si===0)g.moveTo(Math.cos(sa)*sr,Math.sin(sa)*sr);else g.lineTo(Math.cos(sa)*sr,Math.sin(sa)*sr);}
    g.closePath();g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(-1.2,-1.5,.65,0,7);g.fill();g.restore();
 }
};
})();
