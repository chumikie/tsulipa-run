/* Karaoke⭐Time!: desenho dos enfeites da sala (plantas, mesa, caixas de som, armário, neon, pandeiro, monitores, brilhos)
   e as camadas lentas que guardam esses enfeites prontos entre um quadro e outro.
   Saiu do karaoke-time.html em 17/11/2026 (passo 3 do plano da #109). O desenho é o mesmo de antes; o que vinha da sala chega
   por "D": funções da sala como D.nome(...) e valores que mudam como D.nome(). */
(function(){
'use strict';
function criar(D){
function ktCaixaSomViva(x,X,Y,W,H,t){
 var k=(performance.now()-D.ktCaixaPulso().t0)/700;
 if(D.ktCaixaPulso().alvo!=='grande'||k<0||k>=1){ktCaixaSom(x,X,Y,W,H,t);return;}
 var cx=X+W/2,cy=Y+H/2;x.save();
 for(var r=0;r<3;r++){var rk=Math.min(1,k*1.4+r*.18);x.globalAlpha=(1-rk)*.7;x.strokeStyle=['#ff9fd2','#b9a8ff','#7ff0c9'][r];x.lineWidth=3;x.beginPath();x.arc(cx,cy,30+rk*60,0,7);x.stroke();}
 x.globalAlpha=(1-k)*.45;var gg=x.createRadialGradient(cx,cy,4,cx,cy,90);gg.addColorStop(0,'#ffd6f0');gg.addColorStop(1,'rgba(255,214,240,0)');x.fillStyle=gg;x.fillRect(cx-90,cy-90,180,180);x.restore();
 /* O desenho da caixa permanece parado; só as ondas e o brilho se movimentam. */
 ktCaixaSom(x,X,Y,W,H,t);
}
function ktEstrelinha(x,cx,cy,r,cor){x.fillStyle=cor;x.beginPath();x.moveTo(cx,cy-r);x.quadraticCurveTo(cx+r*.18,cy-r*.18,cx+r,cy);x.quadraticCurveTo(cx+r*.18,cy+r*.18,cx,cy+r);x.quadraticCurveTo(cx-r*.18,cy+r*.18,cx-r,cy);x.quadraticCurveTo(cx-r*.18,cy-r*.18,cx,cy-r);x.fill();}
function ktRR(x,X,Y,W,H,R){x.beginPath();if(x.roundRect)x.roundRect(X,Y,W,H,R);else x.rect(X,Y,W,H);}
function ktEsc(c,f){var m=/^#([0-9a-f]{6})$/i.exec(String(c||''));if(!m)return '#5e3d9c';var n=parseInt(m[1],16),r=n>>16,g=(n>>8)&255,b=n&255;
 return 'rgb('+Math.round(r*(1-f))+','+Math.round(g*(1-f))+','+Math.round(b*(1-f))+')';}
function ktSombra(x,cx,cy,rx,ry,a){x.fillStyle='rgba(8,4,26,'+(a||.28)+')';x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.fill();}
function ktCorPastel(h,k){var n=parseInt(String(h).slice(1),16);if(!(n>=0))return '#ffb3d9';var r=n>>16&255,g=n>>8&255,b=n&255;r=Math.round(r+(255-r)*k);g=Math.round(g+(255-g)*k);b=Math.round(b+(255-b)*k);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function ktEstrela(x,cx,cy,r1,r2){x.beginPath();for(var q=0;q<10;q++){var a=-Math.PI/2+q*Math.PI/5,rr=q%2?r2:r1;x.lineTo(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr);}x.closePath();}
function ktCoracao(x,cx,cy,s){x.beginPath();x.moveTo(cx,cy+s*.9);x.bezierCurveTo(cx-s*1.3,cy+s*.1,cx-s*.9,cy-s*.95,cx,cy-s*.35);x.bezierCurveTo(cx+s*.9,cy-s*.95,cx+s*1.3,cy+s*.1,cx,cy+s*.9);x.closePath();}
function ktCaixaSom(x,X,Y,W,H,t){
 var o=D.KT_OL(),pul=.5+.5*Math.sin(t*.22);
 ktSombra(x,X+W/2,Y+H+3,W/2+8,7,.32);
 var g=x.createLinearGradient(X,0,X+W,0);g.addColorStop(0,'#6a529a');g.addColorStop(.55,'#43316b');g.addColorStop(1,'#271c44');
 x.save();x.shadowColor='rgba(150,110,240,.5)';x.shadowBlur=16;ktRR(x,X,Y,W,H,12);x.fillStyle=g;x.fill();x.restore();ktRR(x,X,Y,W,H,12);x.strokeStyle=o;x.lineWidth=2.2;x.stroke();
 x.strokeStyle='rgba(255,255,255,.22)';x.lineWidth=1.4;x.beginPath();x.moveTo(X+6,Y+12);x.lineTo(X+6,Y+H-12);x.stroke();
 function cone(cx,cy,r,cor){
  var ring=x.createLinearGradient(cx-r,cy-r,cx+r,cy+r);ring.addColorStop(0,'#f1ebff');ring.addColorStop(1,'#8e7bc6');
  x.fillStyle=ring;x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.fill();x.strokeStyle=o;x.lineWidth=1.6;x.stroke();
  x.save();x.shadowColor=cor;x.shadowBlur=8+10*pul;x.strokeStyle=cor;x.lineWidth=2.2;x.beginPath();x.arc(cx,cy,r-3,0,Math.PI*2);x.stroke();x.restore();
  var cn=x.createRadialGradient(cx-r*.25,cy-r*.3,1,cx,cy,r-4);cn.addColorStop(0,'#4b3a75');cn.addColorStop(1,'#130d26');
  x.fillStyle=cn;x.beginPath();x.arc(cx,cy,(r-5)*(.96+.04*pul),0,Math.PI*2);x.fill();
  var dc=x.createRadialGradient(cx-2,cy-2,.5,cx,cy,r*.32);dc.addColorStop(0,'#ffffff');dc.addColorStop(1,'#7e6bb3');
  x.fillStyle=dc;x.beginPath();x.arc(cx,cy,r*.3,0,Math.PI*2);x.fill();x.strokeStyle=o;x.lineWidth=1;x.stroke();
 }
 cone(X+W/2,Y+26,11,'#7fd4ff');cone(X+W/2,Y+H*.47,W*.33,'#ff6fb5');cone(X+W/2,Y+H*.8,W*.29,'#b28bff');
 for(var d=0;d<5;d++){var cd=['#ff6fb5','#ffd84d','#b6ff3b','#7fd4ff','#b28bff'][d];x.save();x.globalAlpha=.55+.45*Math.sin(t*.12+d);x.shadowColor=cd;x.shadowBlur=6;x.fillStyle=cd;x.beginPath();x.arc(X+16+d*(W-32)/4,Y+H-9,2.2,0,Math.PI*2);x.fill();x.restore();}
 x.fillStyle='#ffd84d';ktEstrela(x,X+W-13,Y+12,6,2.8);x.fill();x.strokeStyle=o;x.lineWidth=1;x.stroke();
}
function ktArmario(x,X,Y,W,H,t){
 var o=D.KT_OL(),i;
 ktSombra(x,X+W/2,Y+H+3,W/2+8,7,.32);
 var g=x.createLinearGradient(X,Y,X+W,Y+H);g.addColorStop(0,'#eadcff');g.addColorStop(.45,'#b79af0');g.addColorStop(1,'#7656b6');
 x.save();x.shadowColor='rgba(200,160,255,.45)';x.shadowBlur=16;ktRR(x,X,Y+6,W,H-6,10);x.fillStyle=g;x.fill();x.restore();ktRR(x,X,Y+6,W,H-6,10);x.strokeStyle=o;x.lineWidth=2.2;x.stroke();
 ktRR(x,X-5,Y,W+10,12,6);var tg=x.createLinearGradient(0,Y,0,Y+12);tg.addColorStop(0,'#f5ecff');tg.addColorStop(1,'#a888e6');x.fillStyle=tg;x.fill();x.stroke();
 var gx=X+8,gy=Y+18,gw=W-16,gh=H*.52;
 var vidro=x.createLinearGradient(gx,gy,gx,gy+gh);vidro.addColorStop(0,'#2d2050');vidro.addColorStop(1,'#1a1233');
 ktRR(x,gx,gy,gw,gh,7);x.fillStyle=vidro;x.fill();x.strokeStyle=o;x.lineWidth=1.6;x.stroke();
 var sh1=gy+gh*.5,sh2=gy+gh-4;
 x.fillStyle='#c9b0ff';x.fillRect(gx+2,sh1-2,gw-4,3);x.fillRect(gx+2,sh2-2,gw-4,3);
 /* prateleira de cima: troféu, microfone de coleção e CDs */
 var tx=gx+11,ty=sh1-2;x.fillStyle='#d79a1c';ktRR(x,tx-6,ty-4,12,4,2);x.fill();
 var tro=x.createLinearGradient(tx-8,0,tx+8,0);tro.addColorStop(0,'#fff3b0');tro.addColorStop(.5,'#ffd84d');tro.addColorStop(1,'#c78a12');
 x.fillStyle=tro;x.beginPath();x.moveTo(tx-8,ty-23);x.lineTo(tx+8,ty-23);x.quadraticCurveTo(tx+8,ty-11,tx,ty-10);x.quadraticCurveTo(tx-8,ty-11,tx-8,ty-23);x.fill();x.strokeStyle=o;x.lineWidth=1;x.stroke();
 x.fillRect(tx-1.3,ty-10,2.6,6);x.fillStyle='#fff';ktEstrela(x,tx,ty-17.5,3.2,1.4);x.fill();
 var mx=gx+29;x.fillStyle='#3b2d5e';ktRR(x,mx-6,ty-3,12,3,1.5);x.fill();x.fillStyle='#cfc6ea';x.fillRect(mx-.8,ty-14,1.6,11);
 x.save();x.translate(mx,ty-14);x.rotate(-.35);x.fillStyle='#2a1f45';ktRR(x,-1.8,-1,3.6,9,1.5);x.fill();var mg=x.createRadialGradient(-1.5,-6,.5,0,-5,5);mg.addColorStop(0,'#fff');mg.addColorStop(.5,'#ff9ccf');mg.addColorStop(1,'#d9468f');x.fillStyle=mg;x.shadowColor='#ff6fb5';x.shadowBlur=5+3*Math.sin(t*.12);x.beginPath();x.arc(0,-5,4.6,0,7);x.fill();x.shadowBlur=0;x.strokeStyle='rgba(40,10,50,.35)';x.lineWidth=.5;for(var mgl=-1;mgl<=1;mgl++){x.beginPath();x.moveTo(-4,-5+mgl*1.8);x.lineTo(4,-5+mgl*1.8);x.stroke();}x.fillStyle='#ffe27a';x.fillRect(-2.4,-.6,4.8,1.2);x.restore();
 for(i=0;i<3;i++){var ccx=gx+46+i*10,ccy=ty-1;x.save();x.translate(ccx,ccy);x.rotate(-.1+i*.05);
  x.fillStyle=['#ffd6ec','#d6ecff','#e6dcff'][i];ktRR(x,-6,-19,12,19,1.5);x.fill();x.strokeStyle=o;x.lineWidth=.8;x.stroke();
  x.fillStyle=['#ff6fb5','#4169e1','#9b30d9'][i];x.fillRect(-6,-19,2,19);
  var dg2=x.createLinearGradient(-4,-15,6,-3);dg2.addColorStop(0,'#ffffff');dg2.addColorStop(.35,'#ffc3ea');dg2.addColorStop(.6,'#c9f2ff');dg2.addColorStop(1,'#e2d2ff');x.fillStyle=dg2;x.beginPath();x.arc(1.2,-9.5,4.6,0,7);x.fill();x.fillStyle='#2d2050';x.beginPath();x.arc(1.2,-9.5,1,0,7);x.fill();x.restore();}
 /* Prateleira com mangás e lightsticks nas cores da TsuLiPa. */
 var by=sh2-2,capas=[['#ffd1e8','#9b5de5','#ff6fb5'],['#d9f0ff','#f4a259','#4169e1'],['#efe3ff','#2a1f45','#9b30d9'],['#fff3c4','#e76f8a','#b6ff3b']];
 capas.forEach(function(c,k){var mx2=gx+4+k*10.5,my2=by-17;x.save();x.translate(mx2+4.5,by);x.rotate(k===3?.12:0);x.translate(-(mx2+4.5),-by);
  ktRR(x,mx2,my2,9.5,17,1.2);x.fillStyle=c[0];x.fill();x.strokeStyle=o;x.lineWidth=.8;x.stroke();
  x.fillStyle='rgba(255,255,255,.9)';x.fillRect(mx2+1,my2+1.2,7.5,2.6);x.fillStyle=c[2];x.fillRect(mx2+2,my2+2,4.5,1);
  x.fillStyle=c[1];x.beginPath();x.arc(mx2+4.75,my2+9.4,3.6,Math.PI,0);x.fill();x.fillRect(mx2+1.15,my2+9.4,1.4,5);x.fillRect(mx2+7,my2+9.4,1.4,5);
  x.fillStyle='#ffe3cf';x.beginPath();x.arc(mx2+4.75,my2+10.6,2.6,0,7);x.fill();
  x.fillStyle=c[2];x.beginPath();x.arc(mx2+3.7,my2+10.6,.8,0,7);x.arc(mx2+5.8,my2+10.6,.8,0,7);x.fill();x.fillStyle='#fff';x.fillRect(mx2+3.6,my2+10.1,.45,.45);x.fillRect(mx2+5.7,my2+10.1,.45,.45);
  ktEstrelinha(x,mx2+8,my2+6,1.4,'#fffbe0');ktCoracao(x,mx2+2,my2+15,1.1);x.fillStyle=c[2];x.fill();x.restore();});
 var lcx=gx+gw-15;x.fillStyle='#e9e2f7';ktRR(x,lcx-8,by-7,16,7,2);x.fill();x.strokeStyle=o;x.lineWidth=.8;x.stroke();
 [['#9b30d9',-5,-.2],['#b6ff3b',0,0],['#4169e1',5,.2]].forEach(function(l,k){x.save();x.translate(lcx+l[1],by-6);x.rotate(l[2]);x.fillStyle='#f4f0ff';x.fillRect(-1.1,-6,2.2,6);
  x.shadowColor=l[0];x.shadowBlur=7+5*Math.sin(t*.1+k);x.fillStyle=l[0];ktRR(x,-2.2,-20,4.4,15,2.2);x.fill();x.shadowBlur=0;x.fillStyle='rgba(255,255,255,.55)';x.fillRect(-1.1,-18.5,1,11);x.restore();});
 /* reflexo no vidro */
 x.fillStyle='rgba(255,255,255,.1)';x.beginPath();x.moveTo(gx+6,gy+2);x.lineTo(gx+20,gy+2);x.lineTo(gx+8,gy+gh-2);x.lineTo(gx+2,gy+gh-2);x.closePath();x.fill();
 x.strokeStyle='rgba(43,27,76,.55)';x.lineWidth=1.2;x.beginPath();x.moveTo(gx+gw/2,gy);x.lineTo(gx+gw/2,gy+gh);x.stroke();
 /* gavetas com puxador de coração */
 var dy=gy+gh+6,dh=(Y+H-8-dy)/2-3;
 for(i=0;i<2;i++){var yy=dy+i*(dh+5);ktRR(x,X+8,yy,W-16,dh,6);var dg=x.createLinearGradient(0,yy,0,yy+dh);dg.addColorStop(0,'#f2e8ff');dg.addColorStop(1,'#c3a6f5');x.fillStyle=dg;x.fill();x.strokeStyle=o;x.lineWidth=1.4;x.stroke();
  x.fillStyle='#ff6fb5';ktCoracao(x,X+W/2,yy+dh/2,3.6);x.fill();x.strokeStyle=o;x.lineWidth=.8;x.stroke();}
 x.fillStyle=D.KT_INK();ktRR(x,X+8,Y+H-1,8,6,2);x.fill();ktRR(x,X+W-16,Y+H-1,8,6,2);x.fill();
}
function ktNeon(x,cx,cy,t){
 var fl=(Math.sin(t*.9)>.97)?.55:1;
 ktRR(x,cx-74,cy-20,148,40,12);var bg=x.createLinearGradient(0,cy-20,0,cy+20);bg.addColorStop(0,'rgba(40,24,78,.85)');bg.addColorStop(1,'rgba(22,13,46,.85)');x.fillStyle=bg;x.fill();
 x.strokeStyle='rgba(185,161,245,.6)';x.lineWidth=1.4;x.stroke();
 x.save();x.textAlign='center';x.textBaseline='middle';x.font='900 18px "Mochiy Pop One","M PLUS Rounded 1c",sans-serif';
 x.globalAlpha=fl;x.shadowColor='#ff6fb5';x.shadowBlur=14;x.strokeStyle='#ff9ccf';x.lineWidth=3;x.strokeText('Karaoke★Time!',cx,cy+1,136);
 x.shadowBlur=6;x.fillStyle='#fff3fb';x.fillText('Karaoke★Time!',cx,cy+1,136);x.restore();
 x.fillStyle='#7fd4ff';[-60,60].forEach(function(d){x.save();x.shadowColor='#7fd4ff';x.shadowBlur=8;ktCoracao(x,cx+d,cy-11,3);x.fill();x.restore();});
}
function ktPandeiroParede(x,t){var P=D.ktPandeiroExtra(),k=(performance.now()-P.t0)/500,active=k>=0&&k<1;
 x.save();x.translate(P.x,P.y);x.strokeStyle='#d8b4fe';x.lineWidth=1.4;x.beginPath();x.moveTo(0,-21);x.lineTo(0,-15);x.stroke();
 x.fillStyle='#ffe6a8';x.beginPath();x.arc(0,-22,2,0,7);x.fill();
 if(active){x.translate(0,-Math.sin(k*Math.PI)*3);x.rotate(Math.sin(k*Math.PI*6)*(1-k)*.22);}
 x.shadowColor='rgba(255,209,102,.5)';x.shadowBlur=active?12:4;
 var g=x.createLinearGradient(-16,-16,16,16);g.addColorStop(0,'#fff1b3');g.addColorStop(.5,'#e8ae45');g.addColorStop(1,'#b87523');
 x.fillStyle=g;x.strokeStyle='#8b5f9e';x.lineWidth=1.4;x.beginPath();x.arc(0,0,17,0,7);x.fill();x.stroke();x.shadowBlur=0;
 x.fillStyle='#fff7df';x.beginPath();x.arc(0,0,13,0,7);x.fill();ktEstrelinha(x,0,0,6,'#ff9ccf');
 for(var i=0;i<6;i++){var a=i*Math.PI/3,cx=Math.cos(a)*15.5,cy=Math.sin(a)*15.5;
  x.fillStyle='#b8c4de';x.beginPath();x.ellipse(cx,cy,2.5,1.6,a,0,7);x.fill();
  x.strokeStyle='#ffffff';x.lineWidth=.8;x.beginPath();x.moveTo(cx-1.4,cy-.4);x.lineTo(cx+1.4,cy-.4);x.stroke();}
 ['#c7a6ff','#ff9ccf'].forEach(function(c,i){x.strokeStyle=c;x.lineWidth=2;x.beginPath();x.moveTo(12,7+i*3);x.quadraticCurveTo(23,12+i*3,20+Math.sin(t*.1+i)*2,21+i*3);x.stroke();});
 x.restore();}
function ktMesaKaraoke(x,t){var cx=480,cy=346,I='rgba(60,30,110,.2)',k;x.save();
 /* balões de coração amarrados na mesa */
 [[382,'#ff9ccf',0],[578,'#c7a6ff',1.7]].forEach(function(b){var bx=b[0]+Math.sin(t*.03+b[2])*3,by=292+Math.sin(t*.04+b[2])*3;x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1;x.beginPath();x.moveTo(b[0]+(b[0]<cx?8:-8),cy+4);x.bezierCurveTo(b[0]-6,cy-14,bx+6,by+30,bx,by+12);x.stroke();
  x.save();x.shadowColor=b[1];x.shadowBlur=10;var g=x.createRadialGradient(bx-4,by-4,1,bx,by,13);g.addColorStop(0,'#fff');g.addColorStop(.35,b[1]);g.addColorStop(1,ktEsc(b[1],.3));x.fillStyle=g;ktCoracao(x,bx,by,11);x.fill();x.restore();x.strokeStyle=I;x.lineWidth=1.4;ktCoracao(x,bx,by,11);x.stroke();
  x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.ellipse(bx-5,by-4,2.4,1.4,-.6,0,7);x.fill();x.fillStyle=ktEsc(b[1],.3);x.beginPath();x.moveTo(bx-2,by+11);x.lineTo(bx+2,by+11);x.lineTo(bx,by+8);x.closePath();x.fill();});
 /* sombra no chão e pés */
 ktSombra(x,cx,cy+30,132,14,.4);
 [[-84,1],[84,1],[-52,0],[52,0]].forEach(function(p){if(!p[1])return;var lx=cx+p[0];var lg=x.createLinearGradient(lx-6,0,lx+6,0);lg.addColorStop(0,'#5a2f16');lg.addColorStop(.5,'#9a5a2e');lg.addColorStop(1,'#4a2510');x.fillStyle=lg;ktRR(x,lx-6,cy+10,12,16,4);x.fill();x.strokeStyle=I;x.lineWidth=1.4;x.stroke();x.fillStyle='#ffd36e';ktRR(x,lx-6,cy+22,12,3,1.5);x.fill();});
 /* lateral laqueada */
 var sg=x.createLinearGradient(0,cy,0,cy+16);sg.addColorStop(0,'#9a5a2e');sg.addColorStop(1,'#5a2f16');x.fillStyle=sg;x.beginPath();x.ellipse(cx,cy+11,122,30,0,0,Math.PI);x.lineTo(cx-122,cy);x.ellipse(cx,cy,122,30,0,Math.PI,0,true);x.closePath();x.fill();x.strokeStyle=I;x.lineWidth=1.8;x.stroke();
 x.strokeStyle='#ffd36e';x.lineWidth=1.3;x.beginPath();x.ellipse(cx,cy+6,121,30,0,.05,Math.PI-.05);x.stroke();
 for(k=0;k<7;k++){var a=.35+k*(Math.PI-.7)/6;ktEstrelinha(x,cx+Math.cos(a)*121,cy+11+Math.sin(a)*30-3,2.6,'#fff3b0');}
 /* tampo */
 var tg=x.createRadialGradient(cx-30,cy-14,8,cx,cy,130);tg.addColorStop(0,'#e9b984');tg.addColorStop(.6,'#c4844c');tg.addColorStop(1,'#93582c');x.fillStyle=tg;x.beginPath();x.ellipse(cx,cy,122,30,0,0,Math.PI*2);x.fill();x.strokeStyle=I;x.lineWidth=1.8;x.stroke();
 x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=1.4;x.beginPath();x.ellipse(cx,cy-1,116,26,0,Math.PI*1.08,Math.PI*1.55);x.stroke();
 /* toalhinha de renda */
 x.save();x.beginPath();for(k=0;k<=36;k++){var aa=k/36*Math.PI*2,rr=k%2?1:0,px=cx+Math.cos(aa)*(106+rr*2.5),py=cy+1+Math.sin(aa)*(24+rr*.8);k?x.lineTo(px,py):x.moveTo(px,py);}x.closePath();
 var cg=x.createLinearGradient(0,cy-26,0,cy+26);cg.addColorStop(0,'#fff0f8');cg.addColorStop(1,'#ffb8dc');x.fillStyle=cg;x.fill();x.strokeStyle='rgba(42,22,80,.55)';x.lineWidth=1.1;x.stroke();x.restore();
 x.fillStyle='rgba(255,255,255,.95)';for(k=0;k<36;k++){var ab=k/36*Math.PI*2;x.beginPath();x.arc(cx+Math.cos(ab)*101,cy+1+Math.sin(ab)*21.5,.9,0,7);x.fill();}
 x.strokeStyle='rgba(255,111,181,.35)';x.lineWidth=1;x.setLineDash([3,2]);x.beginPath();x.ellipse(cx,cy+1,90,18,0,0,Math.PI*2);x.stroke();x.setLineDash([]);
 /* 11 copos: dez membros decorativos e o jogador, cada um na cor de seu perfil. */
 var gente=[];try{(typeof D.krBots()!=='undefined'&&Array.isArray(D.krBots())?D.krBots():[]).forEach(function(b){gente.push({x:b.x,c:D.ktCorMembro(b)});});gente.push({x:D.krEu().x,c:D.ktCorMembro({nick:D.nick(),char:D.meuChar()})});}catch(e){}
 while(gente.length<11)gente.push({x:999+gente.length,c:['#ffb3d9','#c7a6ff','#9fd8ff','#a6f0c6','#ffe27a'][gente.length%5]});
 gente.sort(function(a,b){return a.x-b.x;});
 gente.slice(0,11).forEach(function(p,i){var a=Math.PI*(1.12+i*.76/10),gx=cx+Math.cos(a)*96,gy=cy+Math.sin(a)*15+1;x.save();x.translate(gx,gy);x.scale(1.15,1.15);ktKopo(x,0,0,p.c,t+i*20,I);x.restore();});
 /* prato de onigiri */
 ktPrato(x,cx-62,cy+3,17,6,'#ffd6ea',I);
 [[-7,0],[7,0],[0,3]].forEach(function(q){var ox=cx-62+q[0],oy=cy+q[1],og=x.createLinearGradient(ox-6,oy-8,ox+5,oy+4);og.addColorStop(0,'#ffffff');og.addColorStop(.6,'#fdf6ee');og.addColorStop(1,'#e9dccf');x.fillStyle=og;x.beginPath();x.moveTo(ox,oy-8);x.quadraticCurveTo(ox+2,oy-8.5,ox+7,oy+1);x.quadraticCurveTo(ox+7.5,oy+3.5,ox+5,oy+3.5);x.lineTo(ox-5,oy+3.5);x.quadraticCurveTo(ox-7.5,oy+3.5,ox-7,oy+1);x.quadraticCurveTo(ox-2,oy-8.5,ox,oy-8);x.closePath();x.fill();x.strokeStyle=I;x.lineWidth=1.1;x.stroke();x.fillStyle='rgba(255,255,255,.95)';x.beginPath();x.ellipse(ox-2.4,oy-3.6,1.3,2.2,.5,0,7);x.fill();
  x.fillStyle='#1f3a34';ktRR(x,ox-3.2,oy-1.5,6.4,5,1);x.fill();x.fillStyle='rgba(166,240,198,.6)';x.fillRect(ox-2.6,oy-.8,5.2,.7);x.fillStyle='#ff9ccf';x.beginPath();x.arc(ox,oy-4.6,1.2,0,7);x.fill();});
 /* barquinho de takoyaki no centro */
 x.save();x.translate(cx-20,cy+3);ktSombra(x,0,6,22,4,.25);var bg=x.createLinearGradient(0,-4,0,6);bg.addColorStop(0,'#f6d39a');bg.addColorStop(1,'#c99556');x.fillStyle=bg;x.beginPath();x.moveTo(-22,-4);x.lineTo(22,-4);x.quadraticCurveTo(19,5,14,6);x.lineTo(-14,6);x.quadraticCurveTo(-19,5,-22,-4);x.closePath();x.fill();x.strokeStyle=I;x.lineWidth=1.2;x.stroke();x.strokeStyle='rgba(120,70,30,.35)';x.lineWidth=.7;x.beginPath();x.moveTo(-18,1);x.lineTo(18,1);x.stroke();
 [[-10,-8],[0,-9],[10,-8],[-14,-3],[-4.5,-3.5],[5,-3.5],[14,-3]].forEach(function(q,qi){var bgg=x.createRadialGradient(q[0]-1.5,q[1]-1.8,.5,q[0],q[1],5);bgg.addColorStop(0,'#ffe0a3');bgg.addColorStop(.6,'#d98a3d');bgg.addColorStop(1,'#9c5521');x.fillStyle=bgg;x.beginPath();x.arc(q[0],q[1],4.6,0,7);x.fill();x.strokeStyle=I;x.lineWidth=.9;x.stroke();
  x.fillStyle='#5a2a12';x.beginPath();x.ellipse(q[0],q[1]-1.6,3.6,2.2,0,0,7);x.fill();x.strokeStyle='#fffaf0';x.lineWidth=.8;x.beginPath();x.moveTo(q[0]-3,q[1]-2);x.lineTo(q[0]-1,q[1]-.6);x.lineTo(q[0]+1,q[1]-2.4);x.lineTo(q[0]+3,q[1]-1);x.stroke();
  x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.arc(q[0]+2.2,q[1]-.4,.9,0,7);x.fill();x.fillStyle='#4caf50';x.fillRect(q[0]-1.4,q[1]-3,.9,.9);x.fillRect(q[0]+1.2,q[1]-2.2,.9,.9);x.fillStyle='#ffc7a8';x.fillRect(q[0]+.2,q[1]-3.4,1.6,.8);});
 x.strokeStyle='#e8c48a';x.lineWidth=1;x.beginPath();x.moveTo(14,-9);x.lineTo(21,-17);x.stroke();x.restore();
 /* prato de dango */
 ktPrato(x,cx+24,cy+4,17,6,'#cfe9ff',I);
 [[-5,-.35],[5,.3]].forEach(function(q){x.save();x.translate(cx+24+q[0],cy+2);x.rotate(q[1]-1.2);x.strokeStyle='#d9b27a';x.lineWidth=1.2;x.beginPath();x.moveTo(-12,0);x.lineTo(13,0);x.stroke();
  [['#ffb3d1',-6.5],['#fff6ea',0],['#a6e3a1',6.5]].forEach(function(d){var dg=x.createRadialGradient(d[1]-1.2,-1.2,.4,d[1],0,3.8);dg.addColorStop(0,'#fff');dg.addColorStop(.45,d[0]);dg.addColorStop(1,ktEsc(d[0],.18));x.fillStyle=dg;x.beginPath();x.arc(d[1],0,3.5,0,7);x.fill();x.strokeStyle=I;x.lineWidth=.9;x.stroke();x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(d[1]-1.1,-1.2,.9,0,7);x.fill();});x.restore();});
 /* docinhos brasileiros: brigadeiros e beijinhos nas forminhas */
 ktPrato(x,cx+68,cy+4,17,6,'#ffe7a8',I);
 [[-9,-.5,0],[0,-1.5,1],[9,-.5,0],[-4.5,3.5,1],[4.5,3.5,0]].forEach(function(q,qi){var bx2=cx+68+q[0],by2=cy+2+q[1],bei=q[2]===1;
  x.fillStyle=['#ff9ccf','#c7a6ff','#9fd8ff','#ffb3a7','#a6f0c6'][qi];x.beginPath();x.moveTo(bx2-4.4,by2-1);x.lineTo(bx2+4.4,by2-1);x.lineTo(bx2+3.4,by2+3);x.lineTo(bx2-3.4,by2+3);x.closePath();x.fill();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=.6;for(var fz=-3;fz<=3;fz+=1.5){x.beginPath();x.moveTo(bx2+fz,by2-1);x.lineTo(bx2+fz*.8,by2+3);x.stroke();}
  var bgr=x.createRadialGradient(bx2-1.3,by2-3.6,.4,bx2,by2-2,4.2);if(bei){bgr.addColorStop(0,'#ffffff');bgr.addColorStop(.6,'#fff4e2');bgr.addColorStop(1,'#e6d3b8');}else{bgr.addColorStop(0,'#8a5a3c');bgr.addColorStop(.55,'#4a2616');bgr.addColorStop(1,'#2a120a');}x.fillStyle=bgr;x.beginPath();x.arc(bx2,by2-2,3.7,0,7);x.fill();
  if(bei){x.fillStyle='rgba(200,170,130,.7)';for(var cc=0;cc<5;cc++)x.fillRect(bx2-2.4+cc*1.2,by2-3.4+(cc%2)*1.6,.7,.7);x.fillStyle='#5a2a12';x.fillRect(bx2-.5,by2-6.2,1,1.8);}
  else{['#ff6fb5','#ffe14d','#7fd4ff','#b6ff3b','#fff'].forEach(function(cr,ci){x.fillStyle=cr;x.fillRect(bx2-2.6+((ci*37+qi*11)%6),by2-4.8+((ci*23+qi*7)%5)*.9,.9,.6);});}
  x.fillStyle='rgba(255,255,255,'+(bei?.9:.55)+')';x.beginPath();x.ellipse(bx2-1.4,by2-3.8,1.1,.7,-.5,0,7);x.fill();});
 /* cestinha de pão de queijo */
 x.save();x.translate(cx+2,cy+17);ktSombra(x,0,5,17,3.5,.25);var cs=x.createLinearGradient(0,-3,0,6);cs.addColorStop(0,'#e7b77a');cs.addColorStop(1,'#a8703c');x.fillStyle=cs;x.beginPath();x.moveTo(-15,-2);x.lineTo(15,-2);x.quadraticCurveTo(13,6,9,6);x.lineTo(-9,6);x.quadraticCurveTo(-13,6,-15,-2);x.closePath();x.fill();x.strokeStyle=I;x.lineWidth=1;x.stroke();
 x.strokeStyle='rgba(120,70,30,.45)';x.lineWidth=.7;for(k=-12;k<=12;k+=4){x.beginPath();x.moveTo(k,-1.5);x.lineTo(k*.75,5.5);x.stroke();}x.beginPath();x.moveTo(-14,1.5);x.lineTo(14,1.5);x.stroke();
 x.fillStyle='#ffb3d9';x.beginPath();x.moveTo(-15,-2.5);x.lineTo(-9,-6);x.lineTo(-6,-2.5);x.closePath();x.moveTo(15,-2.5);x.lineTo(9,-6);x.lineTo(6,-2.5);x.closePath();x.fill();
 [[-7,-4],[0,-5.5],[7,-4],[-3.5,-1.5],[3.5,-1.5]].forEach(function(q){var pq=x.createRadialGradient(q[0]-1.3,q[1]-1.5,.4,q[0],q[1],4.4);pq.addColorStop(0,'#fff3c4');pq.addColorStop(.55,'#f2c35e');pq.addColorStop(1,'#c98a2c');x.fillStyle=pq;x.beginPath();x.arc(q[0],q[1],4,0,7);x.fill();x.strokeStyle='rgba(150,90,20,.5)';x.lineWidth=.6;x.beginPath();x.moveTo(q[0]-1.6,q[1]+.6);x.lineTo(q[0]+.2,q[1]-.6);x.lineTo(q[0]+1.8,q[1]+.4);x.stroke();x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.ellipse(q[0]-1.4,q[1]-1.8,1.1,.7,-.5,0,7);x.fill();});
 x.restore();
 /* livro de músicas aberto */
 x.save();x.translate(cx-89,cy+16);x.rotate(-.1);ktSombra(x,1,7,18,3.5,.25);var bkg=x.createLinearGradient(0,-10,0,9);bkg.addColorStop(0,'#a36bff');bkg.addColorStop(1,'#5b25c4');x.fillStyle=bkg;ktRR(x,-17,-10,34,19,3);x.fill();x.strokeStyle=I;x.lineWidth=1.2;x.stroke();
 x.fillStyle='#fffaf2';x.beginPath();x.moveTo(-15,-8.5);x.quadraticCurveTo(-7,-10.5,0,-7.5);x.lineTo(0,7);x.quadraticCurveTo(-7,4.5,-15,6);x.closePath();x.moveTo(15,-8.5);x.quadraticCurveTo(7,-10.5,0,-7.5);x.lineTo(0,7);x.quadraticCurveTo(7,4.5,15,6);x.closePath();x.fill();x.strokeStyle='rgba(42,22,80,.6)';x.lineWidth=.8;x.stroke();
 x.strokeStyle='rgba(123,63,240,.45)';x.lineWidth=.8;for(k=0;k<4;k++){x.beginPath();x.moveTo(-12.5,-4.5+k*3);x.lineTo(-3,-3.5+k*3);x.moveTo(3,-3.5+k*3);x.lineTo(12.5,-4.5+k*3);x.stroke();}
 x.fillStyle='#ff6fb5';x.beginPath();x.moveTo(5,-9);x.lineTo(8,-9);x.lineTo(8,-1);x.lineTo(6.5,-2.5);x.lineTo(5,-1);x.closePath();x.fill();x.fillStyle='#ff6fb5';ktCoracao(x,-8,-7.2,1.6);x.fill();x.restore();
 /* microfones sem fio deitados */
 [[cx-40,cy+16,'#ff6fb5',-.25],[cx+42,cy+16,'#7fd4ff',.25+Math.PI]].forEach(function(m){x.save();x.translate(m[0],m[1]);ktSombra(x,0,3.5,13,2.5,.25);x.rotate(m[3]);var hg=x.createLinearGradient(0,-3,0,3);hg.addColorStop(0,'#5b4a8a');hg.addColorStop(.5,'#2e2350');hg.addColorStop(1,'#1a1233');x.fillStyle=hg;ktRR(x,-13,-2.6,18,5.2,2.6);x.fill();x.strokeStyle=I;x.lineWidth=1;x.stroke();x.fillStyle=m[2];x.fillRect(1,-2.6,2.2,5.2);x.fillStyle='rgba(255,255,255,.4)';x.fillRect(-11,-1.8,10,1);
  var mg=x.createRadialGradient(6.8,-1.6,.5,8,0,5.5);mg.addColorStop(0,'#ffffff');mg.addColorStop(.5,'#cfd3e6');mg.addColorStop(1,'#7f86a8');x.fillStyle=mg;x.beginPath();x.arc(8.5,0,5,0,7);x.fill();x.strokeStyle=I;x.lineWidth=1;x.stroke();x.strokeStyle='rgba(60,60,100,.35)';x.lineWidth=.6;x.beginPath();x.moveTo(5,-2);x.lineTo(12,2);x.moveTo(5,2);x.lineTo(12,-2);x.moveTo(8.5,-5);x.lineTo(8.5,5);x.stroke();x.restore();});
 /* pandeiro com fitinhas */
 var pk=(performance.now()-D.ktPandeiro().t0)/500,pw=pk>=0&&pk<1?Math.sin(pk*Math.PI*6)*(1-pk)*.35:0;x.save();x.translate(cx+84,cy+14-(pk>=0&&pk<1?Math.sin(pk*Math.PI)*4:0));x.rotate(.12+pw);ktSombra(x,0,5,16,3.5,.25);[['#ff6fb5',-1],['#7fd4ff',1]].forEach(function(f,fi){x.strokeStyle=f[0];x.lineWidth=2;x.beginPath();x.moveTo(11,1);x.quadraticCurveTo(17,4+fi*3+Math.sin(t*.12+fi)*2,22,2+fi*4);x.stroke();});
 var pdg=x.createLinearGradient(0,-6,0,6);pdg.addColorStop(0,'#ffe9a0');pdg.addColorStop(1,'#e8a92e');x.fillStyle=pdg;x.beginPath();x.ellipse(0,0,13,6.5,0,0,Math.PI*2);x.fill();x.strokeStyle=I;x.lineWidth=1.2;x.stroke();x.fillStyle='#fff7df';x.beginPath();x.ellipse(0,-1,10,4.6,0,0,Math.PI*2);x.fill();x.strokeStyle='rgba(42,22,80,.4)';x.lineWidth=.8;x.stroke();x.fillStyle='#ff9ccf';ktEstrelinha(x,0,-1,3,'#ffb3d9');
 for(k=0;k<6;k++){var aj=k/6*Math.PI*2+.3,jx=Math.cos(aj)*12.5,jy=Math.sin(aj)*6.2;var jg=x.createLinearGradient(jx-2,jy-1.4,jx+2,jy+1.4);jg.addColorStop(0,'#ffffff');jg.addColorStop(1,'#9aa3c4');x.fillStyle=jg;x.beginPath();x.ellipse(jx,jy,2.2,1.4,0,0,7);x.fill();}x.restore();
 /* brilhinhos */
 for(k=0;k<5;k++){var tw=Math.max(0,Math.sin(t*.08+k*1.6));if(tw>.05){x.globalAlpha=tw;ktEstrelinha(x,cx-90+k*45,cy-30-(k%2)*6,3.5,'#fffbe0');}}x.globalAlpha=1;
 x.restore();}
function ktPrato(x,px,py,rx,ry,borda,I){ktSombra(x,px,py+3,rx+1,ry*.7,.22);x.fillStyle='#ffffff';x.beginPath();x.ellipse(px,py,rx,ry,0,0,Math.PI*2);x.fill();x.strokeStyle=I;x.lineWidth=1.1;x.stroke();x.strokeStyle=borda;x.lineWidth=1.6;x.beginPath();x.ellipse(px,py,rx-2.5,ry-1.6,0,0,Math.PI*2);x.stroke();}
function ktKopo(x,gx,gy,c,t,I){ktSombra(x,gx,gy+1.5,6.5,2,.28);x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.ellipse(gx,gy+.5,6.5,2,0,0,7);x.fill();
 x.save();x.beginPath();x.moveTo(gx-4.6,gy-12);x.lineTo(gx+4.6,gy-12);x.lineTo(gx+3.8,gy);x.quadraticCurveTo(gx,gy+1.4,gx-3.8,gy);x.closePath();x.fillStyle='rgba(235,245,255,.45)';x.fill();x.save();x.clip();
 var lg=x.createLinearGradient(0,gy-8,0,gy);lg.addColorStop(0,ktCorPastel(c,.05));lg.addColorStop(1,ktEsc(c,.22));x.fillStyle=lg;x.fillRect(gx-6,gy-9.5,12,11);x.fillStyle='rgba(255,255,255,.7)';x.fillRect(gx-6,gy-9.8,12,.9);x.fillStyle='rgba(255,255,255,.75)';x.fillRect(gx-2.6,gy-7.4,2.4,2.4);x.fillRect(gx+.6,gy-6,2,2);x.fillStyle='rgba(255,255,255,.55)';x.fillRect(gx-3.8,gy-11,1,10);x.restore();
 x.strokeStyle=I;x.lineWidth=1;x.stroke();x.restore();
 x.strokeStyle=ktEsc(c,.35);x.lineWidth=1.3;x.beginPath();x.moveTo(gx+1,gy-6);x.lineTo(gx+3.4,gy-16);x.lineTo(gx+5.6,gy-16.6);x.stroke();
 x.fillStyle=c;x.beginPath();x.arc(gx-3.6,gy-12.2,1.9,0,7);x.fill();x.strokeStyle=I;x.lineWidth=.6;x.stroke();}
function ktMonitorGrande(x,X,Y,lado,t){
 var o=D.KT_OL(),W=62,H=32,pul=Math.max(0,Math.sin(t*.22)),bat=1+pul*.06;
 ktSombra(x,X,Y+2,W/2+6,5,.34);
 x.save();
 /* tampa (perspectiva) */
 x.beginPath();x.moveTo(X-W/2+4,Y-H-7);x.lineTo(X+W/2-4,Y-H-7);x.lineTo(X+W/2,Y-H);x.lineTo(X-W/2,Y-H);x.closePath();
 var tg=x.createLinearGradient(0,Y-H-7,0,Y-H);tg.addColorStop(0,'#c9b8ff');tg.addColorStop(1,'#8c74d0');x.fillStyle=tg;x.fill();x.strokeStyle=o;x.lineWidth=1.6;x.stroke();
 /* corpo */
 var g=x.createLinearGradient(X-W/2,0,X+W/2,0);g.addColorStop(0,lado>0?'#7a62b8':'#3c2c68');g.addColorStop(.5,'#5a4594');g.addColorStop(1,lado>0?'#3c2c68':'#7a62b8');
 x.shadowColor='rgba(255,111,181,'+(.25+pul*.45)+')';x.shadowBlur=8+pul*10;ktRR(x,X-W/2,Y-H,W,H,7);x.fillStyle=g;x.fill();x.shadowBlur=0;x.strokeStyle=o;x.lineWidth=1.8;x.stroke();
 /* tela da grade */
 ktRR(x,X-W/2+4,Y-H+4,W-8,H-9,5);x.fillStyle='rgba(20,12,44,.55)';x.fill();
 x.fillStyle='rgba(201,184,255,.18)';for(var gy=Y-H+7;gy<Y-6;gy+=3)for(var gx=X-W/2+7;gx<X+W/2-6;gx+=3){x.fillRect(gx,gy,1,1);}
 /* woofer (pulsa) */
 var wx=X-9*lado,wy=Y-H/2-2;x.save();x.translate(wx,wy);x.scale(bat,bat);
 x.fillStyle='#160d2e';x.beginPath();x.arc(0,0,11.5,0,7);x.fill();x.strokeStyle='#b28bff';x.lineWidth=1.3;x.shadowColor='#b28bff';x.shadowBlur=4+pul*8;x.stroke();x.shadowBlur=0;
 var cg=x.createRadialGradient(-3,-3,1,0,0,10);cg.addColorStop(0,'#b9a8ff');cg.addColorStop(.6,'#4a3a7e');cg.addColorStop(1,'#1d1438');x.fillStyle=cg;x.beginPath();x.arc(0,0,9,0,7);x.fill();
 x.fillStyle='#2a1f4a';x.beginPath();x.arc(0,0,3.6,0,7);x.fill();x.fillStyle='rgba(255,255,255,.75)';x.beginPath();x.ellipse(-1.2,-1.3,1.4,.9,-.6,0,7);x.fill();x.restore();
 /* tweeter + LED */
 var tx=X+17*lado,ty=Y-H/2-5;x.fillStyle='#160d2e';x.beginPath();x.arc(tx,ty,5,0,7);x.fill();x.strokeStyle='#ffb3d9';x.lineWidth=1;x.stroke();x.fillStyle='#cfc2ff';x.beginPath();x.arc(tx,ty,2.2,0,7);x.fill();
 x.fillStyle=pul>.6?'#b6ff3b':'#4c7a2a';x.shadowColor='#b6ff3b';x.shadowBlur=pul>.6?6:0;x.beginPath();x.arc(tx,Y-8,1.6,0,7);x.fill();x.shadowBlur=0;
 /* pezinhos */
 x.fillStyle='#241a40';x.beginPath();x.ellipse(X-W/2+9,Y+.5,5,1.8,0,0,7);x.ellipse(X+W/2-9,Y+.5,5,1.8,0,0,7);x.fill();
 /* coraçãozinho e brilhos subindo da caixa */
 for(var h=0;h<2;h++){var ph=((t*.006)+h*.5+(lado>0?0:.25))%1,hx=X+(h?10:-12)*lado+Math.sin(ph*9+h)*4,hy=Y-H-10-ph*34;x.globalAlpha=(1-ph)*.9;x.shadowColor=h?'#7fd4ff':'#ff6fb5';x.shadowBlur=10;x.fillStyle=h?'#bfe9ff':'#ff9ccf';ktCoracao(x,hx,hy,3.2+ (1-ph)*1.2);x.fill();}
 x.globalAlpha=Math.max(0,Math.sin(t*.09+lado));x.shadowColor='#fff3b0';x.shadowBlur=8;ktEstrelinha(x,X+(W/2+4)*lado,Y-H-4,4,'#fffbe0');
 x.restore();}
function ktMonitorSomViva(x,X,Y,lado,t){
 var alvo=lado>0?'left':'right',k=(performance.now()-D.ktCaixaPulso().t0)/700;
 if(D.ktCaixaPulso().alvo!==alvo||k<0||k>=1){ktMonitorGrande(x,X,Y,lado,t);return;}
 var cx=X,cy=Y-16;x.save();
 for(var r=0;r<3;r++){var rk=Math.min(1,k*1.4+r*.18);x.globalAlpha=(1-rk)*.72;x.strokeStyle=['#ff9fd2','#b9a8ff','#7ff0c9'][r];x.lineWidth=2.5;x.beginPath();x.ellipse(cx,cy,17+rk*34,8+rk*18,0,0,Math.PI*2);x.stroke();}
 x.globalAlpha=(1-k)*.42;var gg=x.createRadialGradient(cx,cy,2,cx,cy,55);gg.addColorStop(0,'#ffd6f0');gg.addColorStop(1,'rgba(255,214,240,0)');x.fillStyle=gg;x.fillRect(cx-55,cy-45,110,90);x.restore();
 /* Mantém o gabinete apoiado; só anéis e cones internos pulsam. */
 ktMonitorGrande(x,X,Y,lado,t);
}
function ktVasinho(x,px,py,w,h,c1,c2){ktSombra(x,px,py+1.5,w*.62,3.5,.3);var g=x.createLinearGradient(px-w/2,0,px+w/2,0);g.addColorStop(0,c1);g.addColorStop(.45,c2);g.addColorStop(1,'#2a1f45');x.fillStyle=g;x.beginPath();x.moveTo(px-w/2,py-h);x.lineTo(px+w/2,py-h);x.lineTo(px+w*.38,py);x.lineTo(px-w*.38,py);x.closePath();x.fill();x.strokeStyle=D.KT_OL();x.lineWidth=1.4;x.stroke();x.fillStyle=c2;ktRR(x,px-w/2-1.5,py-h-3,w+3,4.5,2);x.fill();x.stroke();x.fillStyle='#3a2618';x.beginPath();x.ellipse(px,py-h,w/2-1,1.9,0,0,7);x.fill();x.fillStyle='#5a3a24';x.beginPath();x.ellipse(px,py-h-.6,w/2-4,1.1,0,0,7);x.fill();}
function ktVasoBorda(x,px,py,w,h,c2){x.save();x.beginPath();x.rect(px-w/2-3,py-h+.2,w+6,3);x.clip();x.fillStyle=c2;ktRR(x,px-w/2-1.5,py-h-3,w+3,4.5,2);x.fill();x.strokeStyle=D.KT_OL();x.lineWidth=1.4;x.stroke();x.restore();}
function ktEspada(x,px,py,s,t){ktVasinho(x,px,py,20*s,15*s,'#8e74c9','#c9b8ff');var base=py-15*s+.5;x.save();var n=5;for(var i=0;i<n;i++){var k=i-(n-1)/2,bx=px+k*3.4*s,H=(40+[6,14,0,10,4][i])*s,a=k*.16+Math.sin(t*.02+i)*.015,tx=bx+Math.sin(a)*H,ty=base-H,wd=(2.9+(i%2)*.6)*s;
  var folha=function(){x.beginPath();x.moveTo(bx-wd,base);x.quadraticCurveTo(bx-wd*1.2+Math.sin(a)*H*.5,base-H*.55,tx,ty);x.quadraticCurveTo(bx+wd*1.2+Math.sin(a)*H*.5,base-H*.55,bx+wd,base);x.closePath();};
  x.beginPath();x.moveTo(bx-wd,base);x.quadraticCurveTo(bx-wd*1.2+Math.sin(a)*H*.5,base-H*.55,tx,ty);x.quadraticCurveTo(bx+wd*1.2+Math.sin(a)*H*.5,base-H*.55,bx+wd,base);x.closePath();
  var lg=x.createLinearGradient(bx-wd,0,bx+wd,0);lg.addColorStop(0,'#1f5a3a');lg.addColorStop(.5,'#3c8a55');lg.addColorStop(1,'#245f40');x.fillStyle=lg;x.fill();
  x.save();x.clip();x.strokeStyle='rgba(190,230,170,.32)';x.lineWidth=.9*s;for(var z=0;z<7;z++){var zy=py-10*s-z*H/7.5;x.beginPath();x.moveTo(bx-wd*2+Math.sin(a)*(py-zy),zy);x.lineTo(bx+Math.sin(a)*(py-zy),zy-2.5*s);x.lineTo(bx+wd*2+Math.sin(a)*(py-zy),zy);x.stroke();}x.restore();
  folha();x.strokeStyle='#d9d36a';x.lineWidth=.9*s;x.stroke();}
 x.restore();ktVasoBorda(x,px,py,20*s,15*s,'#c9b8ff');}
function ktComigo(x,px,py,s,t){ktVasinho(x,px,py,22*s,16*s,'#5e86a8','#a7d8f0');x.save();var folhas=[[-1.95,30],[-1.5,40],[-1.15,34],[-2.35,26],[-.8,27],[-1.7,22],[-1.3,24]];
 folhas.forEach(function(f,i){var a=f[0]+Math.sin(t*.018+i)*.03,L=f[1]*s,sx=px+(i-3)*1.2*s,sy=py-16*s+.5,ex=sx+Math.cos(a)*L,ey=sy+Math.sin(a)*L;
  x.strokeStyle='#5d9a4f';x.lineWidth=1.6*s;x.beginPath();x.moveTo(sx,sy);x.quadraticCurveTo(sx+Math.cos(a)*L*.4,sy+Math.sin(a)*L*.4-4*s,ex,ey);x.stroke();
  x.save();x.translate(ex,ey);x.rotate(a+Math.PI/2*0);var rx=11*s,ry=6*s;x.beginPath();x.ellipse(rx*.8,0,rx,ry,0,0,7);var g=x.createLinearGradient(0,-ry,0,ry);g.addColorStop(0,'#2f7a3c');g.addColorStop(.5,'#4f9a4a');g.addColorStop(1,'#2a6a36');x.fillStyle=g;x.fill();
  x.save();x.clip();x.fillStyle='rgba(236,246,196,.85)';[[.5,-.2,3.2,1.6],[1.0,.25,3.6,1.8],[1.35,-.15,2.6,1.3],[.75,.05,2,1]].forEach(function(m){x.beginPath();x.ellipse(rx*m[0],ry*m[1],m[2]*s,m[3]*s,.2,0,7);x.fill();});x.restore();
  x.strokeStyle='rgba(20,60,30,.6)';x.lineWidth=.7;x.beginPath();x.moveTo(0,0);x.lineTo(rx*1.75,0);x.stroke();x.strokeStyle='rgba(220,255,200,.5)';x.beginPath();x.ellipse(rx*.8,0,rx,ry,0,0,7);x.stroke();x.restore();});
 x.restore();ktVasoBorda(x,px,py,22*s,16*s,'#a7d8f0');}
function ktSamambaia(x,cx,y0,top,t,esc){esc=esc||1;var sw=Math.sin(t*.015+cx)*.05;x.save();x.strokeStyle='rgba(230,215,255,.6)';x.lineWidth=1;[-7,7].forEach(function(d){x.beginPath();x.moveTo(cx,y0);x.lineTo(cx+d,top-2);x.stroke();});
 x.translate(cx,top);x.rotate(sw);x.scale(esc,esc);
 for(var f=0;f<11;f++){var side=f%2?1:-1,ang=(f/10-.5)*2.4,L=26+(f*13)%16,ex=Math.sin(ang)*L*1.2,ey=8+Math.abs(Math.cos(ang))*L*.55+L*.45;
  var cx1=Math.sin(ang)*L*.7,cy1=-6+(f%3)*2;x.strokeStyle='#3f7d3a';x.lineWidth=1.1;x.beginPath();x.moveTo(0,0);x.quadraticCurveTo(cx1,cy1,ex,ey);x.stroke();
  for(var q=1;q<=8;q++){var u=q/9,qx=(1-u)*(1-u)*0+2*(1-u)*u*cx1+u*u*ex,qy=2*(1-u)*u*cy1+u*u*ey,dx=2*(1-u)*cx1+2*u*(ex-cx1),dy=2*(1-u)*cy1+2*u*(ey-cy1),an=Math.atan2(dy,dx),sz=(1-u*.6)*3.4;
   x.fillStyle=q%2?'#5aa957':'#7cc46a';[1,-1].forEach(function(k){x.beginPath();x.ellipse(qx+Math.cos(an+k*1.2)*sz,qy+Math.sin(an+k*1.2)*sz,sz,sz*.42,an+k*1.2,0,7);x.fill();});}}
 /* cachepô */
 var g=x.createLinearGradient(-12,0,12,0);g.addColorStop(0,'#a58be0');g.addColorStop(.5,'#e9ddff');g.addColorStop(1,'#7a62b8');x.fillStyle=g;x.beginPath();x.moveTo(-12,-4);x.lineTo(12,-4);x.quadraticCurveTo(11,8,0,9);x.quadraticCurveTo(-11,8,-12,-4);x.fill();x.strokeStyle=D.KT_OL();x.lineWidth=1.3;x.stroke();
 x.fillStyle='#ffb3d9';x.beginPath();x.arc(0,3,1.8,0,7);x.fill();x.restore();}
function ktPlantasSala(x,t){
 ktSamambaia(x,22,0,30,t);ktSamambaia(x,267,0,12,t,.62);ktSamambaia(x,688,0,12,t,.62);ktSamambaia(x,938,0,30,t);
 ktEspada(x,74,326,.95,t);ktComigo(x,880,326,.9,t);
 /* canto de baixo, ao lado da caixa de som */
 ktComigo(x,46,534,1.25,t);ktEspada(x,104,536,1.05,t);}
function ktBrilhos(x,t){
 [[118,316,1],[132,520,.8],[208,300,.7],[300,512,.6],[402,330,.6],[560,330,.6],[662,512,.6],[752,300,.7],[828,520,.8],[842,316,1],[480,520,.8],[240,412,.5],[720,412,.5]].forEach(function(p,i){
  var a=Math.max(0,Math.sin(t*.07+i*1.7)),r=(3+3*a)*p[2];if(a<.05)return;x.save();x.globalAlpha=a;x.shadowColor='#fff3b0';x.shadowBlur=8;x.fillStyle='#fffbe0';
  x.beginPath();x.moveTo(p[0],p[1]-r*2);x.quadraticCurveTo(p[0],p[1],p[0]+r*2,p[1]);x.quadraticCurveTo(p[0],p[1],p[0],p[1]+r*2);x.quadraticCurveTo(p[0],p[1],p[0]-r*2,p[1]);x.quadraticCurveTo(p[0],p[1],p[0],p[1]-r*2);x.fill();x.restore();});
}
function ktDecorSala(x,t,paleta){
 var p0=(paleta&&paleta[0])||'#ff6fb5';
 ktNeon(x,146,228,t);
 ktPandeiroParede(x,t);
 ktCaixaSomViva(x,14,330,82,134,t);
 ktArmario(x,846,330,98,142,t);
 ktMonitorSomViva(x,322,328,1,t);ktMonitorSomViva(x,638,328,-1,t);
 ktBrilhos(x,t);
 for(var h=0;h<12;h++){var hx=130+h*64,c=['#ff6fb5','#b28bff','#7fd4ff','#ffd84d'][h%4],al=.55+.45*Math.sin(t*.06+h*.9);
  x.save();x.globalAlpha=al;x.shadowColor=c;x.shadowBlur=9;x.fillStyle=c;ktCoracao(x,hx,529,4.6);x.fill();x.restore();}
}
return {ktCaixaSomViva:ktCaixaSomViva,ktEstrelinha:ktEstrelinha,ktRR:ktRR,ktEsc:ktEsc,ktSombra:ktSombra,ktCorPastel:ktCorPastel,ktEstrela:ktEstrela,ktCoracao:ktCoracao,ktCaixaSom:ktCaixaSom,ktArmario:ktArmario,ktNeon:ktNeon,ktPandeiroParede:ktPandeiroParede,ktMesaKaraoke:ktMesaKaraoke,ktPrato:ktPrato,ktKopo:ktKopo,ktMonitorGrande:ktMonitorGrande,ktMonitorSomViva:ktMonitorSomViva,ktVasinho:ktVasinho,ktVasoBorda:ktVasoBorda,ktEspada:ktEspada,ktComigo:ktComigo,ktSamambaia:ktSamambaia,ktPlantasSala:ktPlantasSala,ktBrilhos:ktBrilhos,ktDecorSala:ktDecorSala};
}
window.KaraokePalco={criar:criar,camada:camada,camadas:camadas};
/* Camada lenta: um enfeite que se mexe devagar é redesenhado num canvas guardado a cada "ms" milissegundos e, nos outros quadros,
   só copiado com um drawImage. Mesma resolução e mesma transformação do canvas da sala, então o resultado é igual; muda só
   quantas vezes por segundo a animação lenta anda (ex.: 15 em vez de 30). */
var camadas={};
function camada(nome,x,ms,desenhar,chave){
  if(camada.desligada){desenhar(x);return;}if(camada.ms!=null)ms=camada.ms;/* teste: KaraokePalco.camada.ms=0 redesenha todo quadro */
  var cv=x.canvas,c=camadas[nome],agora=performance.now(),m=x.getTransform?x.getTransform():null;
  if(!c){c=camadas[nome]={cv:document.createElement('canvas'),t:-1e9,chave:null,n:0};c.x=c.cv.getContext('2d');}
  if(!c.x||!m){desenhar(x);return;}
  /* Aparelho lento (quadro mais demorado que a camada): ela seria refeita todo quadro e a cópia só somaria custo; desenha direto. */
  var gap=agora-(c.u||-1e9);c.u=agora;if(gap>=ms*.9&&gap<1000){c.lento=(c.lento||0)+1;}else c.lento=0;
  if(c.lento>=3){c.t=-1e9;desenhar(x);return;}
  var mk=m.a+','+m.b+','+m.c+','+m.d+','+m.e+','+m.f+'|'+(chave==null?'':chave);
  if(c.cv.width!==cv.width||c.cv.height!==cv.height){c.cv.width=cv.width;c.cv.height=cv.height;c.t=-1e9;}
  if(agora-c.t>=ms||mk!==c.chave){c.t=agora;c.chave=mk;c.n++;c.x.setTransform(1,0,0,1,0,0);c.x.clearRect(0,0,c.cv.width,c.cv.height);c.x.setTransform(m);desenhar(c.x);}
  x.save();x.setTransform(1,0,0,1,0,0);if(x.globalAlpha!==1)x.globalAlpha=1;if(x.globalCompositeOperation!=='source-over')x.globalCompositeOperation='source-over';if(x.shadowBlur)x.shadowBlur=0;if(x.filter&&x.filter!=='none')x.filter='none';x.drawImage(c.cv,0,0);x.restore();
}
})();
