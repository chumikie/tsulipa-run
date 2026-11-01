/* Desenhos originais: feat/avatar-careca-capitao-estrela. */
(function(){
'use strict';
window.TWAvatarItems={
 capitao:function(g,x,y){   // quepe militar: copa larga e achatada, faixa dourada, cordão, pala preta e insígnia de estrela
    g.save();
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
