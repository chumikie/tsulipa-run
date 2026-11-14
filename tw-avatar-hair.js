/* Cortes e franjas extras do Idol, no mesmo vocabulário 2D de drawChar (arco do
   topo, costeletas, sombra HD atrás e franja em polígono com o degradê do cabelo).
   Cortes (combinam com qualquer franja):
   onduladom  = Ondulado: volume fofo e arredondado ao redor da cabeça
   onduladom2 = Bicolor: metade na cor escolhida, metade preta (ref. Maruru)
   onduladof  = Repicado: médio, pontas para fora (ref. Mimimila)
   Franjas novas: ondulada (rótulo "Rebelde"), risca (lateral longa, ref. Maruru), repicada (ref. Mimimila).
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
function franja(T,x,y,f,g){
 if(f==='ondulada')T([x+3,y+10,x+8,y+5,x+14,y+7,x+20,y+3,x+27,y+8,x+29,y+13,x+24,y+16,x+20,y+14,x+17,y+21,x+13,y+15,x+9,y+19,x+7,y+13,x+3,y+14]);
 else if(f==='risca')franjaBicolor(T,x,y);
 else if(f==='cortina'||f==='curta'){}   // desenhadas em frente(): mostram a testa, que precisa da cor da pele
 else if(f==='pontas')T([x+3,y+6,x+27,y+6,x+27,y+12,x+24.5,y+15.5,x+21.5,y+10.5,x+18.3,y+17,x+15,y+10.5,x+11.7,y+17,x+8.5,y+10.5,x+5.5,y+15.5,x+3,y+12]);
 else if(f==='cacheada'&&g){   // cacheada: cachinhos redondos sobre a testa
  [[5.5,12.6],[10.2,13.6],[15,13],[19.8,13.6],[24.5,12.6]].forEach(function(p){oval(g,x+p[0],y+p[1],3.4,3.3);});
 }
 else if(f==='repicada'){   // mecha entre os olhos + mechas laterais emoldurando o rosto
  T([x+3,y+6,x+27,y+6,x+27,y+10,x+25,y+16,x+22,y+11,x+19.5,y+17,x+17,y+11,x+15,y+20,x+13,y+11,x+10.5,y+17,x+8,y+11,x+5,y+16,x+3,y+10]);
  T([x+3,y+9,x+8,y+11,x+7,y+19,x+5.5,y+26,x+3,y+23]);
  T([x+27,y+9,x+22,y+11,x+23,y+19,x+24.5,y+26,x+27,y+23]);
 }else return false;
 return true;
}
function franjaOriginal(g,T,x,y,f){   // mesmas formas das franjas de drawChar, para pintar a metade preta
 if(franja(T,x,y,f,g))return;
 if(f==='reta')g.fillRect(x+3,y+8,24,6);
 else if(f==='lateral')T([x+3,y+12,x+7,y+8,x+27,y+8,x+27,y+19,x+17,y+11]);
 else if(f==='espetada')T([x+3,y+10,x+3,y+5,x+7,y-5,x+11,y+3,x+15,y-8,x+19,y+3,x+24,y-5,x+27,y+5,x+27,y+10]);
 else if(f!=='arcoiris')T([x+3,y+11,x+8,y+19,x+11,y+10,x+16,y+17,x+20,y+9,x+24,y+16,x+27,y+10,x+27,y+9,x+3,y+9]);   // bagunçada
}
function escurecer(h,n){return '#'+String(h).replace(/^#/,'').replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-n).toString(16)).substr(-2)});}
function clarear(h,n){return '#'+String(h).replace(/^#/,'').replace(/../g,function(cc){return ('0'+Math.min(255,parseInt(cc,16)+n).toString(16)).substr(-2)});}
function T2(g,a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();g.fill();}
var NOMES={en:{'Rabo lateral':'Side ponytail',Tranças:'Braids',Coque:'Top bun',Princesa:'Princess waves',Hime:'Hime cut',Cortina:'Curtain',Curtinha:'Micro',Pontinhas:'Pointy',Cacheada:'Curly',Nenhuma:'None',Uma:'One',Dupla:'Double',Luzes:'Highlights',Escondida:'Peekaboo',Antena:'Ahoge',Coração:'Heart',Gato:'Cat ears',Elfo:'Elf ears',Olheiras:'Eye bags',Ondulado:'Wavy',Bicolor:'Two-tone',Repicado:'Layered',Rebelde:'Tousled',Risca:'Side part',Repicada:'Layered'},
 es:{'Rabo lateral':'Coleta lateral',Tranças:'Trenzas',Coque:'Moño',Princesa:'Princesa',Hime:'Hime',Cortina:'Cortina',Curtinha:'Cortita',Pontinhas:'Puntas',Cacheada:'Rizada',Nenhuma:'Ninguna',Uma:'Una',Dupla:'Doble',Luzes:'Reflejos',Escondida:'Oculta',Antena:'Antena',Coração:'Corazón',Gato:'Gato',Elfo:'Elfo',Olheiras:'Ojeras',Ondulado:'Ondulado',Bicolor:'Bicolor',Repicado:'Desfilado',Rebelde:'Rebelde',Risca:'De lado',Repicada:'Desfilado'},
 th:{'Rabo lateral':'หางม้าข้าง',Tranças:'ผมเปีย',Coque:'มวยผม',Princesa:'ลอนเจ้าหญิง',Hime:'ฮิเมะ',Cortina:'ม่าน',Curtinha:'สั้นจิ๋ว',Pontinhas:'แหลม',Cacheada:'หยิก',Nenhuma:'ไม่มี',Uma:'หนึ่ง',Dupla:'คู่',Luzes:'ไฮไลท์',Escondida:'ซ่อนสี',Antena:'ผมชี้',Coração:'หัวใจ',Gato:'หูแมว',Elfo:'หูเอลฟ์',Olheiras:'ใต้ตา',Ondulado:'ลอน',Bicolor:'สองสี',Repicado:'ซอยชั้น',Rebelde:'ยุ่งๆ',Risca:'แสกข้าง',Repicada:'ซอยชั้น'},
 ja:{'Rabo lateral':'サイドテール',Tranças:'みつあみ',Coque:'おだんご',Princesa:'プリンセスウェーブ',Hime:'姫カット',Cortina:'センター分け',Curtinha:'ショートバング',Pontinhas:'ギザギザ',Cacheada:'カール',Nenhuma:'なし',Uma:'ワン',Dupla:'ダブル',Luzes:'ハイライト',Escondida:'インナー',Antena:'アホ毛',Coração:'ハート',Gato:'猫耳',Elfo:'エルフ耳',Olheiras:'くま',Ondulado:'ウェーブ',Bicolor:'ツートン',Repicado:'レイヤー',Rebelde:'ふわはね',Risca:'サイド分け',Repicada:'レイヤー'}};
function rotular(){   // nomes curtos das opções novas, no idioma atual (o dicionário principal não as conhece)
 var l=(typeof LANG==='string'&&LANG)||(document.documentElement.lang||'').slice(0,2),d=NOMES[l]||{};
 [].forEach.call(document.querySelectorAll('option[data-twh]'),function(o){var k=o.getAttribute('data-twh'),v=d[k]||k;if(o.textContent!==v)o.textContent=v;});
}
if(typeof document!=='undefined'&&document.addEventListener){
 document.addEventListener('DOMContentLoaded',function(){
  rotular();
  // a troca de idioma é assíncrona: os nomes curtos são aplicados depois que applyLang termina
  if(typeof window.applyLang==='function'&&!window.applyLang.twHair){var orig=window.applyLang;window.applyLang=function(){var r=orig.apply(this,arguments);try{rotular();}catch(e){}return r;};window.applyLang.twHair=1;}
 });
 document.addEventListener('click',function(e){if(e.target&&e.target.closest&&e.target.closest('.lang button'))setTimeout(rotular,0);},true);
 document.addEventListener('focusin',function(e){if(e.target&&e.target.tagName==='SELECT')rotular();},true);
}
function rgba(h,a){h=String(h).replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');var n=parseInt(h.slice(0,6),16)||0;return 'rgba('+(n>>16)+','+(n>>8&255)+','+(n&255)+','+a+')';}
function fio(g,sx,sy,cx,cy,tx,ty,w,reto){   // mecha: larga na raiz e afinando na ponta (ou reta na Reta/Arco-íris)
 var h=w/2,t=reto?h:0;g.beginPath();g.moveTo(sx-h,sy);g.quadraticCurveTo(cx-h,cy,tx-t,ty);g.lineTo(tx+t,ty);g.quadraticCurveTo(cx+h,cy,sx+h,sy);g.closePath();g.fill();
}
var MECHA={bagunca:[12,1,10,8,8,18.5],reta:[11,1,11,8,11,14,1],lateral:[10,1,14,7,25,17],espetada:[13.5,9,14.5,2,15,-7],arcoiris:[11,1,11,8,11,15,1],
 ondulada:[14,1,15,10,17,20.5],risca:[12,1,15,9,21.5,19.5],repicada:[12,1,11,9,10.5,16.8],
 cortina:[13,1,12,8,9.5,15],curta:[11,1,11,5,11,9.5,1],pontas:[12,1,12,9,11.7,16.2],cacheada:[12,1,11.5,6,10.5,12]};
window.TWAvatarHair={
 rotular:rotular,
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
  if(b==='lateral'||b==='coque'){   // base curta (a mesma do Curto)
   g.beginPath();g.arc(x+15,y+12,13.2,Math.PI,0);g.lineTo(x+28.2,y+20);g.lineTo(x+25,y+22);g.lineTo(x+5,y+22);g.lineTo(x+1.8,y+20);g.closePath();g.fill();
   if(b==='lateral'){   // rabo de cavalo caindo pelo lado esquerdo, com xuxinha
    g.beginPath();g.moveTo(x+5,y+5);g.quadraticCurveTo(x-9,y+9,x-6,y+22);g.quadraticCurveTo(x-5,y+31,x+1,y+35);g.quadraticCurveTo(x-1,y+23,x+6,y+12);g.closePath();g.fill();
    g.save();g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.moveTo(x+1,y+8);g.quadraticCurveTo(x-6,y+13,x-4,y+24);g.quadraticCurveTo(x-4.5,y+14,x+2,y+9);g.fill();
    g.fillStyle='#ff6fb5';E(x+3.6,y+6.6,2.8,2.3,-.5);g.fillStyle='#ffc2dc';E(x+3,y+6,1,.8);g.restore();
   }   // o coque em si é desenhado em frente(), por cima, com o brilho do cabelo
   return true;
  }
  if(b==='trancas'){   // duas tranças caindo à frente dos ombros
   g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-1,y+24,x+4,y+25);g.lineTo(x+26,y+25);g.quadraticCurveTo(x+31,y+24,x+28,y+13);g.fill();
   [[-1,1],[31,-1]].forEach(function(t){
    for(var k=0;k<5;k++){var by=y+16+k*4.3,bx=x+t[0]+(k%2?t[1]*.9:0);E(bx,by,3.3,2.6,(k%2?-.35:.35)*t[1]);}
    g.save();g.fillStyle='rgba(0,0,0,.14)';for(var k2=0;k2<5;k2++)g.fillRect(x+t[0]-2.6,y+17.8+k2*4.3,5.2,.6);
    g.fillStyle='#ff6fb5';E(x+t[0],y+37.6,2.2,1.4);g.restore();
    T([x+t[0]-1.8,y+38.4,x+t[0]+1.8,y+38.4,x+t[0],y+42]);
   });
   return true;
  }
  if(b==='princesa'){   // longo ondulado, com cachos na ponta
   g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-5,y+28,x-2,y+38);
   for(var w=0;w<6;w++)g.quadraticCurveTo(x+.5+w*5.5,y+(w%2?41:45),x+3+w*5.5,y+42);
   g.quadraticCurveTo(x+35,y+28,x+28,y+13);g.closePath();g.fill();
   E(x-1.5,y+30,3.4,4.6,.2);E(x+31.5,y+30,3.4,4.6,-.2);
   return true;
  }
  if(b==='hime'){   // hime: liso até a cintura, pontas retas
   g.beginPath();g.moveTo(x+2,y+13);g.lineTo(x+.5,y+40);g.lineTo(x+29.5,y+40);g.lineTo(x+28,y+13);g.closePath();g.fill();
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
  if(b==='hime'){   // hime: mechas retas ao lado do rosto, cortadas na altura do queixo
   g.fillRect(x+2.6,y+10,4.6,16.5);g.fillRect(x+22.8,y+10,4.6,16.5);
   g.save();g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x+3.2,y+11,1,14);g.restore();
  }
  return franja(T,x,y,f,g);
 },
 mecha:function(g,c,x,y,f){   // Uma (JJ), Dupla (Meichan/Tata), Luzes (Apollo/Nanamaru), Escondida (Yami)
  var m=MECHA[f]||MECHA.bagunca,H2=c.hair2||'#ffffff',st=c.mecha||'uma',sg=g.createLinearGradient(0,y+1,0,y+18);
  if(st==='antena'||st==='coracao')return; // enfeite de mecha é desenhado acima do cabelo por bicolor()
  sg.addColorStop(0,H2);sg.addColorStop(1,escurecer(H2,60));
  g.save();if(f!=='espetada'){cabeca(g,x,y);g.clip();}g.fillStyle=sg;
  if(st==='luzes'){   // fios finos acompanhando a curva da cabeça, suaves na raiz e claros na ponta
   var L=[[2.6,5.2,10.8,2.2],[6,10.4,12.6,2.2],[9.4,13.6,14.6,1.9]],H3=rgba(H2,1);
   for(var i=0;i<6;i++){var l=L[i%3],k=i<3?-1:1,sx=x+15+k*l[0],tx=x+15+k*l[1],ty=y+l[2]-(i===4?1:0),lg=g.createLinearGradient(0,y+1,0,ty);
    lg.addColorStop(0,rgba(H2,0));lg.addColorStop(.3,rgba(H2,.85));lg.addColorStop(1,'rgba('+H3.slice(5,-3).split(',').map(function(v){return Math.min(255,+v+40);}).join(',')+',1)');g.fillStyle=lg;
    fio(g,sx,y+1.2,sx+k*(l[1]-l[0])*1.05,y+5,tx,ty,l[3],0);}
   g.fillStyle='rgba(255,255,255,.35)';fio(g,x+15-6.3,y+3.5,x+15-8.6,y+5.5,x+15-9.6,y+8.6,.7,0);fio(g,x+15+6.3,y+3.5,x+15+8.6,y+5.5,x+15+9.6,y+8.6,.7,0);
  }else if(st==='escondida'){   // camada de baixo colorida aparecendo nas laterais, junto ao rosto
   T2(g,[x+3,y+13,x+6.5,y+15,x+6,y+22,x+4.5,y+26,x+3,y+24]);T2(g,[x+27,y+13,x+23.5,y+15,x+24,y+22,x+25.5,y+26,x+27,y+24]);
  }else{
   fio(g,x+m[0],y+m[1],x+m[2],y+m[3],x+m[4],y+m[5],3.4,!!m[6]);
   if(st==='dupla'){var d2=g.createLinearGradient(0,y+1,0,y+18);d2.addColorStop(0,clarear(H2,70));d2.addColorStop(1,H2);g.fillStyle=d2;fio(g,x+m[0]+3.6,y+m[1]+.5,x+m[2]+3.6,y+m[3],x+m[4]+3.4,y+m[5]-1.2,3,!!m[6]);}
   g.fillStyle='rgba(255,255,255,.28)';fio(g,x+m[0]-.4,y+m[1]+1,x+m[2]-.5,y+m[3],x+(m[0]+m[4])/2-.3,y+(m[1]+m[5])/2,1,0);
  }
  g.restore();
 },
 detalhe:function(g,c,x,y){   // Antena (Decchan) e Coração (Z), na cor independente da mecha
  var d=c.mecha==='antena'||c.mecha==='coracao'?c.mecha:c.det,H=c.hair2||c.hair||'#ff7eb6',hg=g.createLinearGradient(0,y-9,0,y+3);hg.addColorStop(0,clarear(H,30));hg.addColorStop(1,escurecer(H,50));g.fillStyle=hg;
  if(d==='antena'){g.beginPath();g.moveTo(x+13,y+1.5);g.quadraticCurveTo(x+13,y-6,x+19,y-8);g.quadraticCurveTo(x+16,y-4.5,x+16.5,y+1.5);g.closePath();g.fill();}
  else if(d==='coracao'){g.beginPath();g.moveTo(x+15,y+1.5);g.bezierCurveTo(x+8,y-3,x+10,y-9,x+15,y-5.5);g.bezierCurveTo(x+20,y-9,x+22,y-3,x+15,y+1.5);g.closePath();g.fill();g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(x+12.5,y-4.5,1.2,.8,-.5,0,7);g.fill();}
 },
 // Camada da frente (já com o translate do rosto): franjas que mostram a testa e o coque.
 frente:function(g,c,x,y,b){
  var f=c.front||'',H=c.hair||'#ff7eb6',HD=escurecer(H,60),pele=c.skin||'#f1c9a5';
  function grad(){var hg=g.createLinearGradient(0,y+5,0,y+24);hg.addColorStop(0,H);hg.addColorStop(1,HD);return hg;}
  if(f==='cortina'||f==='curta'){
   g.save();cabeca(g,x,y);g.clip();
   if(f==='cortina'){   // risca no meio: a testa aparece num arco e as abas abrem para os lados
    g.fillStyle=pele;g.beginPath();g.moveTo(x+10.8,y+13);g.quadraticCurveTo(x+15,y+7.6,x+19.2,y+13);g.closePath();g.fill();
    g.fillStyle=grad();
    [[1,0],[-1,30]].forEach(function(m){var k=m[0],o=m[1];function X(v){return x+o+k*v;}
     g.beginPath();g.moveTo(X(15.2),y+8.4);g.quadraticCurveTo(X(12.2),y+9.6,X(10.4),y+13);g.quadraticCurveTo(X(8.2),y+17,X(6),y+19.5);g.lineTo(X(2),y+19.5);g.lineTo(X(2),y+4);g.lineTo(X(15.2),y+4);g.closePath();g.fill();});
   }else{   // curtinha: franja curta de bicos arredondados, logo abaixo do topo
    g.fillStyle=grad();g.beginPath();g.moveTo(x+3,y+6);g.lineTo(x+27,y+6);g.lineTo(x+27,y+11.4);
    for(var k=5;k>=0;k--)g.quadraticCurveTo(x+5+k*4,y+14.2,x+3+k*4,y+11.4);
    g.closePath();g.fill();
   }
   g.fillStyle='rgba(255,255,255,.18)';g.beginPath();g.ellipse(x+10,y+4.2,4.2,1.3,-.35,0,7);g.fill();   // o brilho de sempre volta por cima
   g.restore();
  }
  if(b==='coque'){   // coque alto com elástico, na luz do cabelo
   var cg=g.createLinearGradient(0,y-11,0,y+1);cg.addColorStop(0,clarear(H,25));cg.addColorStop(1,HD);
   g.fillStyle=cg;oval(g,x+15,y-4.6,6.4,5.4);
   g.fillStyle='rgba(255,255,255,.28)';g.beginPath();g.ellipse(x+12.8,y-6.6,2.4,1.2,-.35,0,7);g.fill();
   g.fillStyle='#7b3ff0';g.fillRect(x+10.6,y-.4,8.8,1.7);
  }
 },
 bicolor:function(g,c,x,y,b){
  if(c.mecha==='antena'||c.mecha==='coracao'||c.det==='antena'||c.det==='coracao')this.detalhe(g,c,x,y); // legado de saves em det
  if(b!=='onduladom2'){this.frente(g,c,x,y,b);return;}
  // metade direita (de quem olha) em preto: topo, costeleta e a franja escolhida
  var f=c.front||'bagunca',pg=g.createLinearGradient(0,y+5,0,y+24);pg.addColorStop(0,PRETO_TOPO);pg.addColorStop(1,PRETO_BASE);
  var T=function(a){g.beginPath();g.moveTo(a[0],a[1]);for(var i=2;i<a.length;i+=2)g.lineTo(a[i],a[i+1]);g.closePath();g.fill();};
  g.save();if(f!=='espetada'){cabeca(g,x,y);g.clip();}g.beginPath();if(f==='arcoiris'){g.rect(x+15,y-10,16,16);g.rect(x+15,y+15,16,15);}else g.rect(x+15,y-10,16,40);g.clip();g.fillStyle=pg;   // o arco-íris fica por cima
 
  topoArco(g,x,y);g.fillRect(x+23,y+11.5,4,7.5);franjaOriginal(g,T,x,y,f);
  g.restore();
  this.frente(g,c,x,y,b);
 }
};
})();
