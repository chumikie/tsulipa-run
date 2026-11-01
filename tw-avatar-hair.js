/* Cortes extras do Idol, no mesmo vocabulário 2D de drawChar (arco do topo,
   costeletas, sombra HD atrás e franja em polígono com o degradê do cabelo).
   onduladom  = Ondulado curto: volume fofo e arredondado ao redor da cabeça
   onduladom2 = Curto bicolor: metade na cor escolhida, metade preta (ref. Maruru)
   onduladof  = Repicado volumoso, médio, pontas para fora (ref. Mimimila)
   Os valores salvos continuam os mesmos para não quebrar saves. */
(function(){
'use strict';
var PRETO_TOPO='#3a3644',PRETO_BASE='#121018',PRETO_SOMBRA='#0c0a12';
function cabeca(g,x,y){g.beginPath();g.arc(x+15,y+12,12,Math.PI,0);g.lineTo(x+27,y+30);g.lineTo(x+3,y+30);g.closePath();}
function oval(g,cx,cy,rx,ry){g.beginPath();g.ellipse(cx,cy,rx,ry,0,0,7);g.fill();}
function topoOndulado(g,x,y){   // topo em ondas redondinhas (cachos macios), sem pontas
 g.beginPath();g.arc(x+15,y+12,12.5,Math.PI,0);g.lineTo(x+27.5,y+14);g.lineTo(x+2.5,y+14);g.closePath();g.fill();
 oval(g,x+15,y+2,6,4.4);oval(g,x+8.5,y+3.8,5,4.2);oval(g,x+21.5,y+3.8,5,4.2);oval(g,x+4.5,y+8.5,3.8,4.2);oval(g,x+25.5,y+8.5,3.8,4.2);
}
function topoArco(g,x,y){g.beginPath();g.arc(x+15,y+12,12,Math.PI,0);g.fill();}
function franjaBicolor(T,x,y){
 T([x+3,y+9,x+12,y+5,x+12,y+11,x+8,y+12,x+4,y+16]);                              // lado curto, penteado para fora
 T([x+11,y+5,x+27,y+7,x+27,y+17,x+25,y+14,x+22,y+20,x+19,y+13,x+15,y+19,x+13,y+11]); // mecha longa varrendo sobre o olho
}
window.TWAvatarHair={
 isWavy:function(b){return b==='onduladom'||b==='onduladom2'||b==='onduladof';},
 back:function(g,c,x,y,b,E,T){
  if(b==='onduladom'){
   // volume fofo e arredondado contornando a cabeça inteira até a altura da orelha
   g.beginPath();g.arc(x+15,y+12,14,Math.PI,0);g.lineTo(x+29,y+19);g.lineTo(x+1,y+19);g.closePath();g.fill();
   E(x+15,y+0.5,6.5,4.5);E(x+7,y+2.5,5.5,4.5);E(x+23,y+2.5,5.5,4.5);
   E(x+2,y+9,4.2,4.6);E(x+28,y+9,4.2,4.6);E(x+1.5,y+15.5,3.8,4.2);E(x+28.5,y+15.5,3.8,4.2);
   E(x+3.5,y+20,3,2.8);E(x+26.5,y+20,3,2.8);
   return true;
  }
  if(b==='onduladom2'){
   // mesma base do Curto; a metade direita da nuca fica preta
   g.beginPath();g.arc(x+15,y+12,13.2,Math.PI,0);g.lineTo(x+28.2,y+20);g.lineTo(x+25,y+22);g.lineTo(x+5,y+22);g.lineTo(x+1.8,y+20);g.closePath();g.fill();
   g.save();g.beginPath();g.rect(x+15,y-4,20,30);g.clip();g.fillStyle=PRETO_SOMBRA;
   g.beginPath();g.arc(x+15,y+12,13.2,Math.PI,0);g.lineTo(x+28.2,y+20);g.lineTo(x+25,y+22);g.lineTo(x+5,y+22);g.lineTo(x+1.8,y+20);g.closePath();g.fill();
   g.restore();
   return true;
  }
  if(b==='onduladof'){
   // volume repicado até os ombros, pontas abrindo para fora
   T([x+2,y+9,x+15,y+1,x+28,y+9,x+30,y+16,x+29,y+21,x+31,y+26,x+28,y+25,x+28,y+30,x+24.5,y+27.5,x+23,y+30,x+7,y+30,x+5.5,y+27.5,x+2,y+30,x+2,y+25,x-1,y+26,x+1,y+21,x+0,y+16]);
   E(x+2.5,y+15,3.2,5,-.2);E(x+27.5,y+15,3.2,5,.2);
   return true;
  }
  return false;
 },
 top:function(g,x,y,b){
  if(b==='onduladom')topoOndulado(g,x,y);
  else if(b==='onduladom2')topoArco(g,x,y);
  else if(b==='onduladof')topoArco(g,x,y);
 },
 fringe:function(g,x,y,b,T){
  if(b==='onduladom'){
   T([x+3,y+10,x+8,y+5,x+14,y+7,x+20,y+3,x+27,y+8,x+29,y+13,x+24,y+16,x+20,y+14,x+17,y+21,x+13,y+15,x+9,y+19,x+7,y+13,x+3,y+14]);
   oval(g,x+4,y+14.5,2.4,4.6);oval(g,x+26,y+14.5,2.4,4.6);   // laterais curvas em vez das costeletas retas
  }else if(b==='onduladom2'){
   franjaBicolor(T,x,y);
  }else if(b==='onduladof'){
   // franja repicada com uma mecha entre os olhos + mechas laterais emoldurando o rosto
   T([x+3,y+6,x+27,y+6,x+27,y+10,x+25,y+16,x+22,y+11,x+19.5,y+17,x+17,y+11,x+15,y+20,x+13,y+11,x+10.5,y+17,x+8,y+11,x+5,y+16,x+3,y+10]);
   T([x+3,y+9,x+8,y+11,x+7,y+19,x+5.5,y+26,x+3,y+23]);
   T([x+27,y+9,x+22,y+11,x+23,y+19,x+24.5,y+26,x+27,y+23]);
  }
 },
 bicolor:function(g,c,x,y,b){
  if(b!=='onduladom2')return;
  // metade direita (do ponto de vista de quem olha) em preto, cobrindo topo, costeleta e franja
  var pg=g.createLinearGradient(0,y+5,0,y+24);pg.addColorStop(0,PRETO_TOPO);pg.addColorStop(1,PRETO_BASE);
  g.save();cabeca(g,x,y);g.clip();g.beginPath();g.rect(x+15,y-4,16,34);g.clip();g.fillStyle=pg;
  topoArco(g,x,y);g.fillRect(x+23,y+11.5,4,7.5);
  franjaBicolor(function(a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();g.fill();},x,y);
  g.restore();
 }
};
})();
