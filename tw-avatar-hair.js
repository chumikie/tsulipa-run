/* Cortes e franjas extras do Idol, no mesmo vocabulário 2D de drawChar (arco do
   topo, costeletas, sombra HD atrás e franja em polígono com o degradê do cabelo).
   Cortes (combinam com qualquer franja):
   onduladom  = Ondulado: volume fofo e arredondado ao redor da cabeça
   onduladom2 = Bicolor: metade na cor escolhida, metade preta (ref. Maruru)
   onduladof  = Repicado: médio, pontas para fora (ref. Mimimila)
   Franjas novas: ondulada, risca (lateral longa, ref. Maruru), repicada (ref. Mimimila).
   Os valores salvos dos cortes continuam os mesmos para não quebrar saves. */
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
function franja(T,x,y,f){
 if(f==='ondulada')T([x+3,y+10,x+8,y+5,x+14,y+7,x+20,y+3,x+27,y+8,x+29,y+13,x+24,y+16,x+20,y+14,x+17,y+21,x+13,y+15,x+9,y+19,x+7,y+13,x+3,y+14]);
 else if(f==='risca')franjaBicolor(T,x,y);
 else if(f==='repicada'){   // mecha entre os olhos + mechas laterais emoldurando o rosto
  T([x+3,y+6,x+27,y+6,x+27,y+10,x+25,y+16,x+22,y+11,x+19.5,y+17,x+17,y+11,x+15,y+20,x+13,y+11,x+10.5,y+17,x+8,y+11,x+5,y+16,x+3,y+10]);
  T([x+3,y+9,x+8,y+11,x+7,y+19,x+5.5,y+26,x+3,y+23]);
  T([x+27,y+9,x+22,y+11,x+23,y+19,x+24.5,y+26,x+27,y+23]);
 }else return false;
 return true;
}
function franjaOriginal(g,T,x,y,f){   // mesmas formas das franjas de drawChar, para pintar a metade preta
 if(franja(T,x,y,f))return;
 if(f==='reta')g.fillRect(x+3,y+8,24,6);
 else if(f==='lateral')T([x+3,y+12,x+7,y+8,x+27,y+8,x+27,y+19,x+17,y+11]);
 else if(f==='espetada')T([x+3,y+10,x+3,y+5,x+7,y-5,x+11,y+3,x+15,y-8,x+19,y+3,x+24,y-5,x+27,y+5,x+27,y+10]);
 else if(f!=='arcoiris')T([x+3,y+11,x+8,y+19,x+11,y+10,x+16,y+17,x+20,y+9,x+24,y+16,x+27,y+10,x+27,y+9,x+3,y+9]);   // bagunçada
}
var NOMES={en:{Ondulado:'Wavy',Bicolor:'Two-tone',Repicado:'Layered',Ondulada:'Wavy',Risca:'Side part',Repicada:'Layered'},
 es:{Ondulado:'Ondulado',Bicolor:'Bicolor',Repicado:'Desfilado',Ondulada:'Ondulado',Risca:'De lado',Repicada:'Desfilado'},
 th:{Ondulado:'ลอน',Bicolor:'สองสี',Repicado:'ซอยชั้น',Ondulada:'ลอน',Risca:'แสกข้าง',Repicada:'ซอยชั้น'},
 ja:{Ondulado:'ウェーブ',Bicolor:'ツートン',Repicado:'レイヤー',Ondulada:'ウェーブ',Risca:'サイド分け',Repicada:'レイヤー'}};
function rotular(){   // nomes curtos das opções novas, no idioma atual (o dicionário principal não as conhece)
 var l=(document.documentElement.lang||'').slice(0,2),d=NOMES[l]||{};
 [].forEach.call(document.querySelectorAll('option[data-twh]'),function(o){var k=o.getAttribute('data-twh'),v=d[k]||k;if(o.textContent!==v)o.textContent=v;});
}
if(typeof document!=='undefined'&&document.addEventListener){
 document.addEventListener('DOMContentLoaded',rotular);
 document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('.lang button'))setTimeout(rotular,0);},true);
 document.addEventListener('focusin',function(e){if(e.target&&e.target.tagName==='SELECT')rotular();},true);
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
 fringe:function(g,x,y,b,f,T){   // devolve true quando a franja é uma das novas
  if(b==='onduladom'){oval(g,x+4,y+14.5,2.4,4.6);oval(g,x+26,y+14.5,2.4,4.6);}   // laterais curvas do Ondulado
  return franja(T,x,y,f);
 },
 bicolor:function(g,c,x,y,b){
  if(b!=='onduladom2')return;
  // metade direita (de quem olha) em preto: topo, costeleta e a franja escolhida
  var f=c.front||'bagunca',pg=g.createLinearGradient(0,y+5,0,y+24);pg.addColorStop(0,PRETO_TOPO);pg.addColorStop(1,PRETO_BASE);
  var T=function(a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();g.fill();};
  g.save();if(f!=='espetada'){cabeca(g,x,y);g.clip();}g.beginPath();if(f==='arcoiris'){g.rect(x+15,y-10,16,16);g.rect(x+15,y+15,16,15);}else g.rect(x+15,y-10,16,40);g.clip();g.fillStyle=pg;   // o arco-íris fica por cima
 
  topoArco(g,x,y);g.fillRect(x+23,y+11.5,4,7.5);franjaOriginal(g,T,x,y,f);
  g.restore();
 }
};
})();
