/* Desenhos originais: feat/avatar-careca-capitao-estrela. */
(function(){
'use strict';
window.TWAvatarItems={
 capitao:function(g,x,y){
    g.save();
    var capShade=g.createLinearGradient(x+5,y-8,x+25,y+6);capShade.addColorStop(0,'#1a1a25');capShade.addColorStop(.48,'#090b12');capShade.addColorStop(1,'#03040a');
    g.fillStyle=capShade;g.strokeStyle='rgba(255,231,178,.58)';g.lineWidth=.7;g.beginPath();g.moveTo(x+4,y+5);g.quadraticCurveTo(x+4,y-7,x+15,y-8);g.quadraticCurveTo(x+26,y-7,x+26,y+5);g.closePath();g.fill();g.stroke();
    var brimShade=g.createLinearGradient(x+3,y+3,x+27,y+8);brimShade.addColorStop(0,'#080910');brimShade.addColorStop(.5,'#171722');brimShade.addColorStop(1,'#04050b');
    g.fillStyle=brimShade;g.beginPath();g.ellipse(x+15,y+5,13,2.8,0,0,7);g.fill();g.stroke();
    var goldBand=g.createLinearGradient(0,y,0,y+3);goldBand.addColorStop(0,'#fff0b0');goldBand.addColorStop(.45,'#e7b94e');goldBand.addColorStop(1,'#a96c20');g.fillStyle=goldBand;g.fillRect(x+5,y+1,20,2);
    g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=.55;g.beginPath();g.moveTo(x+8,y-3);g.quadraticCurveTo(x+15,y-8,x+22,y-3);g.stroke();
    g.fillStyle='#ffe27a';g.strokeStyle='#a96c20';g.lineWidth=.45;g.beginPath();g.moveTo(x+15,y-6);g.lineTo(x+16.6,y-2.7);g.lineTo(x+20,y-2.1);g.lineTo(x+17.5,y+.3);g.lineTo(x+18.2,y+3.7);g.lineTo(x+15,y+2);g.lineTo(x+11.8,y+3.7);g.lineTo(x+12.5,y+.3);g.lineTo(x+10,y-2.1);g.lineTo(x+13.4,y-2.7);g.closePath();g.fill();g.stroke();
    g.restore();
 },
 estrela:function(g,x,y){
    g.save();g.translate(x+6,y+3);
    var starGold=g.createRadialGradient(-.8,-1.1,.2,0,0,3.3);starGold.addColorStop(0,'#fff2b8');starGold.addColorStop(.55,'#f2c34c');starGold.addColorStop(1,'#c98b28');
    g.fillStyle=starGold;g.strokeStyle='#fff0bd';g.lineWidth=.55;g.beginPath();
    for(var si=0;si<10;si++){var sr=si%2===0?3.2:1.45,sa=-Math.PI/2+si*Math.PI/5;if(si===0)g.moveTo(Math.cos(sa)*sr,Math.sin(sa)*sr);else g.lineTo(Math.cos(sa)*sr,Math.sin(sa)*sr);}
    g.closePath();g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.9)';g.beginPath();g.arc(-.85,-1.1,.48,0,7);g.fill();g.restore();
 }
};
})();
