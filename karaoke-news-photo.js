/* Idol⭐News! — foto do telão: o mesmo conceito, o mesmo cenário vetorial e
   o mesmo sorteio diário de elenco usados pelo Karaoke⭐Time!.
   A rotina background() abaixo é cópia literal da ktClip.background de karaoke-time.html.
   Caso o clipe mude, o teste compara o conteúdo para exigir sincronização.
   Nenhuma chamada de ranking ou crédito é feita aqui. */
(function(root, factory){
 'use strict';
 var api=factory();
 if(typeof module==='object'&&module.exports)module.exports=api;
 else root.KaraokeNewsPhoto=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 var CONCEITOS=[{"name":"Neon Debut","set":"neon","colors":["#17103b","#48257c","#62e5ed"]},{"name":"Sakura Letter","set":"sakura","colors":["#3f214e","#91607c","#ffd3e9"]},{"name":"Moon Serenade","set":"moon","colors":["#0b183d","#2d3b6c","#fff0ba"]},{"name":"Ocean Pop","set":"ocean","colors":["#093543","#17657b","#9df5e2"]},{"name":"Candy Parade","set":"candy","colors":["#4a2858","#86527c","#ffe0a7"]},{"name":"Mirror Disco","set":"disco","colors":["#21113f","#59306f","#b7baff"]},{"name":"Aurora Dream","set":"aurora","colors":["#101e3d","#315067","#a6f3d0"]},{"name":"Ribbon Theatre","set":"ribbon","colors":["#361c48","#763969","#f3b7d9"]}];
 function hash(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
 function modulo(n,d){return(n%d+d)%d;}
 function mdc(a,b){while(b){var t=b;b=a%b;a=t;}return a;}
 function idNick(n){var h=5381;n=String(n).toLowerCase();for(var i=0;i<n.length;i++)h=((h*33)^n.charCodeAt(i))>>>0;return 'site-'+h.toString(36);}
 function diaNumero(d){if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return NaN;return Math.floor(Date.parse(d+'T00:00:00Z')/86400000);}
 function tema(dia){var n=diaNumero(dia);if(!Number.isFinite(n))return null;var s=CONCEITOS.slice().sort(function(a,b){return hash('concept-v1|'+a.name)-hash('concept-v1|'+b.name);});return s[modulo(n+3,s.length)];}
 function cast(dia,rows,dono){
  var nday=diaNumero(dia),eu=idNick(dono||'Tsu');
  if(!Number.isFinite(nday))return null;
  var mapa=new Map();
  (Array.isArray(rows)?rows:[]).forEach(function(p){
   if(!p||p.blocked||p.bloqueado||!p.nick||!p.avatar||!p.avatar.c)return;
   var nick=String(p.nick).trim().slice(0,48),id=idNick(nick),c=p.avatar.c;
   if(!nick||!c.hair||!c.skin)return;
   var v={id:id,nick:nick,avatar:p.avatar};
   if(!mapa.has(id))mapa.set(id,v);
  });
  var pool=Array.from(mapa.values()).sort(function(a,b){return a.id<b.id?-1:a.id>b.id?1:0;});
  // A sala usa os dados live; se forem menos de dez, ela completa com figurantes.
  // Não atribuímos fotos a pessoas que talvez não estejam naquele elenco incompleto.
  if(pool.length<11)return null;
  pool.sort(function(a,b){return hash('kt-cast-v2|'+a.id)-hash('kt-cast-v2|'+b.id)||(a.id<b.id?-1:a.id>b.id?1:0);});
  var n=pool.length,stride=Math.max(1,Math.floor(n/2));
  while(n>1&&mdc(stride,n)!==1)stride++;
  var start=modulo(modulo(nday,n)*stride,n),seats=[];
  for(var i=0;i<n&&seats.length<10;i++){var pessoa=pool[(start+i)%n];if(pessoa.id!==eu)seats.push(pessoa);}
  seats.sort(function(a,b){return hash(dia+'|seats-v2|'+a.id)-hash(dia+'|seats-v2|'+b.id)||(a.id<b.id?-1:a.id>b.id?1:0);});
  // Mesmo recorte de seis Idols do KaraokeClip.make, excluindo o espectador.
  var elenco=seats.filter(function(p){return p.id!==eu;}).sort(function(a,b){return hash('clip|'+dia+'|'+a.id)-hash('clip|'+dia+'|'+b.id)||(a.id<b.id?-1:a.id>b.id?1:0);}).slice(0,6);
  if(elenco.length!==6)return null;
  return {day:dia,concept:tema(dia),members:elenco};
 }
function star(x,a,b,r,color){x.fillStyle=color;x.beginPath();for(var i=0;i<10;i++){var ang=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.43:r;if(!i)x.moveTo(a+Math.cos(ang)*rr,b+Math.sin(ang)*rr);else x.lineTo(a+Math.cos(ang)*rr,b+Math.sin(ang)*rr);}x.closePath();x.fill();}
function rgba(hex,a){var n=parseInt(String(hex).slice(1),16);return 'rgba('+(n>>16&255)+','+(n>>8&255)+','+(n&255)+','+a+')';}
function glow(x,cx,cy,r,color,a){var g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,rgba(color,a));g.addColorStop(1,rgba(color,0));x.fillStyle=g;x.fillRect(cx-r,cy-r,r*2,r*2);}
/* Camadas de profundidade comuns a todos os conceitos (atrás do tema). */
function depthBack(x,c,t,w,h){var colors=c.colors,s=t*.004,i;
 glow(x,w*.5,h*.18,w*.62,colors[2],.22);glow(x,w*.5,h*.62,w*.45,colors[1],.35);
 for(i=0;i<12;i++){var bx=(i*83+Math.sin(s*.7+i*2.1)*14)%w,by=18+(i*47)%(h*.55),br=7+i%4*5;glow(x,bx,by,br,i%3?colors[2]:'#ffffff',.10+i%3*.03);}}
/* Feixes, palco e vinheta: na frente do tema, atrás dos Idols. */
function depthFront(x,c,t,w,h){var colors=c.colors,s=t*.006,i,fy=h*.7;
 x.save();x.globalCompositeOperation='lighter';
 for(i=0;i<3;i++){var ox=w*(.22+i*.28)+Math.sin(s+i*1.7)*w*.06,spread=w*.13;var g=x.createLinearGradient(0,0,0,fy+10);g.addColorStop(0,rgba(i===1?'#ffffff':colors[2],.16));g.addColorStop(1,rgba(colors[2],0));x.fillStyle=g;x.beginPath();x.moveTo(ox-4,0);x.lineTo(ox+4,0);x.lineTo(ox+spread,fy+10);x.lineTo(ox-spread,fy+10);x.closePath();x.fill();}
 x.restore();
 var fl=x.createLinearGradient(0,fy,0,h);fl.addColorStop(0,rgba(colors[2],.30));fl.addColorStop(.18,rgba(colors[1],.55));fl.addColorStop(1,'rgba(7,4,25,.78)');x.fillStyle=fl;x.fillRect(0,fy,w,h-fy);
 x.strokeStyle=rgba(colors[2],.18);x.lineWidth=1;for(i=0;i<=10;i++){x.beginPath();x.moveTo(w*.5+(i-5)*w*.06,fy);x.lineTo(w*.5+(i-5)*w*.2,h);x.stroke();}
 for(i=1;i<4;i++){var yy=fy+(h-fy)*(i*i)/12;x.beginPath();x.moveTo(0,yy);x.lineTo(w,yy);x.stroke();}
 x.fillStyle=rgba('#ffffff',.35);x.fillRect(0,fy,w,1);
 glow(x,w*.5,h*.86,w*.42,colors[2],.20);
 var v=x.createRadialGradient(w/2,h*.5,h*.35,w/2,h*.5,w*.7);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(6,2,20,.55)');x.fillStyle=v;x.fillRect(0,0,w,h);}
function background(x,c,t,w,h){var colors=c.colors,g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,colors[0]);g.addColorStop(.65,colors[1]);g.addColorStop(1,colors[0]);x.fillStyle=g;x.fillRect(0,0,w,h);var s=t*.007;depthBack(x,c,t,w,h);
 if(c.set==='neon'){x.shadowColor=colors[2];x.shadowBlur=8;x.strokeStyle=colors[2];x.lineWidth=1.5;for(var i=0;i<5;i++){var a=18+i*18;x.globalAlpha=.65-i*.09;x.strokeRect(a,18+i*7,w-2*a,h-42-i*10);}x.shadowBlur=0;x.globalAlpha=.3;for(i=0;i<9;i++){x.beginPath();x.moveTo(w/2,h*.45);x.lineTo(i*w/8,h);x.stroke();}}
 if(c.set==='sakura'){[[1,-5,h*.8,25,35,75,40,145,10,8],[-1,w+5,h*.7,w-30,40,w-70,30,w-150,4,6]].forEach(function(r){var bgr=x.createLinearGradient(0,r[2],0,r[9]);bgr.addColorStop(0,'#2a1530');bgr.addColorStop(1,'#5a3350');x.strokeStyle=bgr;x.lineCap='round';x.lineWidth=r[9];x.beginPath();x.moveTo(r[1],r[2]);x.bezierCurveTo(r[3],r[4],r[5],r[6],r[7],r[8]);x.stroke();x.lineWidth=r[9]*.35;x.strokeStyle='rgba(255,210,235,.25)';x.stroke();
   for(var k=0;k<7;k++){var tt=k/6,bx2=Math.pow(1-tt,3)*r[1]+3*Math.pow(1-tt,2)*tt*r[3]+3*(1-tt)*tt*tt*r[5]+tt*tt*tt*r[7],by2=Math.pow(1-tt,3)*r[2]+3*Math.pow(1-tt,2)*tt*r[4]+3*(1-tt)*tt*tt*r[6]+tt*tt*tt*r[8];glow(x,bx2,by2,16,'#ffc2df',.55);for(var f=0;f<3;f++){var fx2=bx2+Math.cos(k*2+f*2.1)*7,fy2=by2+Math.sin(k*3+f*2.1)*6;for(var q=0;q<5;q++){var pg=x.createRadialGradient(fx2,fy2,0,fx2,fy2,5);pg.addColorStop(0,'#fff');pg.addColorStop(1,f%2?'#ff9cc9':'#ffd1e6');x.fillStyle=pg;x.beginPath();x.ellipse(fx2+Math.cos(q*1.26)*2.8,fy2+Math.sin(q*1.26)*2.8,2.8,1.8,q*1.26,0,7);x.fill();}x.fillStyle='#ffe27a';x.beginPath();x.arc(fx2,fy2,.9,0,7);x.fill();}}});
  for(i=0;i<22;i++){var px=(i*61+Math.sin(s+i)*8)%w,py=(i*31+t*.13)%h,pr=i%3===0?4:2.6;x.save();x.translate(px,py);x.rotate(s*1.5+i);x.globalAlpha=i%3===0?.95:.6;var pg2=x.createLinearGradient(-pr,0,pr,0);pg2.addColorStop(0,'#fff6fb');pg2.addColorStop(1,i%2?'#ffaad2':'#ffd6ea');x.fillStyle=pg2;x.beginPath();x.moveTo(0,-pr);x.quadraticCurveTo(pr*1.2,-pr*.2,0,pr);x.quadraticCurveTo(-pr*1.2,-pr*.2,0,-pr);x.fill();x.restore();}x.globalAlpha=1;}
 if(c.set==='moon'){x.fillStyle='#fff1bf';x.shadowColor='#fff4d4';x.shadowBlur=16;x.beginPath();x.arc(w*.79,h*.33,25,0,7);x.fill();x.shadowBlur=0;x.fillStyle=colors[0];x.beginPath();x.arc(w*.79+10,h*.33-7,23,0,7);x.fill();for(i=0;i<28;i++)star(x,(i*43+13)%w,(i*29+15)%(h*.7),1.5+i%3*.5,colors[2]);}
 if(c.set==='ocean'){for(i=0;i<5;i++){x.fillStyle=['#58d5d5','#288eae','#347fa5','#226882','#154e72'][i];x.globalAlpha=.25+i*.11;x.beginPath();x.moveTo(0,h);for(var q=0;q<=w;q+=8)x.lineTo(q,h*.45+i*16+Math.sin(q*.024+s+i)*10);x.lineTo(w,h);x.closePath();x.fill();}x.globalAlpha=1;for(i=0;i<14;i++){var obx=(i*59+25)%w+Math.sin(s*2+i)*4,oby=h-((t*.2+i*27)%h),orr=2.5+i%4*1.6,og=x.createRadialGradient(obx-orr*.4,oby-orr*.4,0,obx,oby,orr);og.addColorStop(0,'rgba(255,255,255,.85)');og.addColorStop(.5,'rgba(185,255,240,.18)');og.addColorStop(1,'rgba(185,255,240,.55)');x.fillStyle=og;x.beginPath();x.arc(obx,oby,orr,0,7);x.fill();x.strokeStyle='rgba(225,255,250,.7)';x.lineWidth=.8;x.stroke();}
  for(i=0;i<3;i++){glow(x,w*(.2+i*.3)+Math.sin(s+i)*20,h*.18,46,'#9df5e2',.18);}}
 if(c.set==='candy'){for(i=0;i<7;i++){x.fillStyle=['#f9b2d6','#9ed7ef','#d8c1ff'][i%3];x.globalAlpha=.14;x.save();x.translate(i*70-20,0);x.rotate(.2);x.fillRect(0,-h,28,h*3);x.restore();}x.globalAlpha=1;
  /* algodão-doce ao fundo: nuvens fofas com volume */
  [[.12,.34,30,'#ffc2df'],[.42,.22,24,'#bfe6ff'],[.72,.3,34,'#ffd6ec'],[.95,.18,22,'#d9c8ff']].forEach(function(n,k){var nx=w*n[0]+Math.sin(s*.5+k)*6,ny=h*n[1]+Math.cos(s*.4+k)*3,r=n[2];
   [[0,0,1],[-.8,.25,.7],[.8,.22,.75],[-.35,-.35,.62],[.4,-.3,.6]].forEach(function(b){var g=x.createRadialGradient(nx+b[0]*r-r*b[2]*.3,ny+b[1]*r-r*b[2]*.35,1,nx+b[0]*r,ny+b[1]*r,r*b[2]);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.45,n[3]);g.addColorStop(1,rgba(n[3],.0));x.globalAlpha=.55;x.fillStyle=g;x.beginPath();x.arc(nx+b[0]*r,ny+b[1]*r,r*b[2],0,7);x.fill();});});
  x.globalAlpha=1;
  /* pirulitos: espiral, sombra, brilho e lacinho; os de trás menores e mais apagados */
  for(i=0;i<8;i++){var back=i%2===0,rr=back?8:12,cx=i*(w/7.4)+14,cy=(back?34:52)+Math.sin(s+i)*9,ca=['#ff8fc8','#7fd4ff','#ffd36b','#c7a6ff'][i%4];
   x.save();x.globalAlpha=back?.62:.95;x.translate(cx,cy);x.rotate(Math.sin(s*.8+i)*.12);
   var sg=x.createLinearGradient(-1.5,0,1.5,0);sg.addColorStop(0,'#fff');sg.addColorStop(1,'#e8dccb');x.fillStyle=sg;x.fillRect(-1.3,rr-1,2.6,rr*2.6);
   x.fillStyle='rgba(20,8,40,.25)';x.beginPath();x.arc(1.5,2,rr,0,7);x.fill();
   var bg=x.createRadialGradient(-rr*.35,-rr*.4,1,0,0,rr);bg.addColorStop(0,'#ffffff');bg.addColorStop(.35,'#fff6fb');bg.addColorStop(1,'#ffe4f1');x.fillStyle=bg;x.beginPath();x.arc(0,0,rr,0,7);x.fill();
   x.strokeStyle=ca;x.lineWidth=rr*.28;x.lineCap='round';x.beginPath();for(var a=0;a<Math.PI*5.2;a+=.25){var rs=rr*.12+a/(Math.PI*5.2)*rr*.8,ax=Math.cos(a+s*1.6)*rs,ay=Math.sin(a+s*1.6)*rs;if(!a)x.moveTo(ax,ay);else x.lineTo(ax,ay);}x.stroke();
   var sh=x.createRadialGradient(-rr*.3,-rr*.35,0,-rr*.3,-rr*.35,rr*.7);sh.addColorStop(0,'rgba(255,255,255,.85)');sh.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=sh;x.beginPath();x.arc(0,0,rr,0,7);x.fill();
   x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1;x.beginPath();x.arc(0,0,rr-.5,0,7);x.stroke();
   if(!back){x.fillStyle=ca;x.beginPath();x.moveTo(0,rr+2);x.quadraticCurveTo(-7,rr-3,-6,rr+6);x.closePath();x.fill();x.beginPath();x.moveTo(0,rr+2);x.quadraticCurveTo(7,rr-3,6,rr+6);x.closePath();x.fill();x.beginPath();x.arc(0,rr+2,1.6,0,7);x.fill();}
   x.restore();}
  /* balinhas embrulhadas caindo devagar */
  for(i=0;i<6;i++){var fy=(i*37+t*.12)%(h*.7),fx=(i*71+20)%w+Math.sin(s+i)*6,cb=['#ffb3d9','#9fe0ff','#ffe08a'][i%3];x.save();x.globalAlpha=.85;x.translate(fx,fy);x.rotate(s*.9+i);
   x.fillStyle=cb;x.beginPath();x.moveTo(-9,-3);x.lineTo(-5,0);x.lineTo(-9,3);x.closePath();x.fill();x.beginPath();x.moveTo(9,-3);x.lineTo(5,0);x.lineTo(9,3);x.closePath();x.fill();
   var cg=x.createRadialGradient(-1.5,-1.5,0,0,0,5);cg.addColorStop(0,'#fff');cg.addColorStop(.4,cb);cg.addColorStop(1,rgba(cb,.9));x.fillStyle=cg;x.beginPath();x.ellipse(0,0,5.5,4,0,0,7);x.fill();x.restore();}
  x.globalAlpha=1;}
 if(c.set==='disco'){for(i=0;i<9;i++)for(var j=0;j<5;j++){x.fillStyle=['#d4bbff','#fff3a9','#ffc1e0','#9fdfe8'][(i+j)%4];x.globalAlpha=.12+.14*Math.max(0,Math.sin(s+i+j));x.fillRect(i*w/9+2,j*h/5+2,w/9-4,h/5-4);}x.globalAlpha=1;x.strokeStyle='rgba(220,215,255,.7)';x.lineWidth=1;x.beginPath();x.moveTo(w/2,0);x.lineTo(w/2,10);x.stroke();glow(x,w/2,29,40,'#ffffff',.25);
  x.save();x.beginPath();x.arc(w/2,29,19,0,7);x.clip();var dg=x.createRadialGradient(w/2-7,22,2,w/2,29,20);dg.addColorStop(0,'#ffffff');dg.addColorStop(.5,'#c9c3ee');dg.addColorStop(1,'#6e62a0');x.fillStyle=dg;x.fillRect(w/2-20,9,40,40);
  for(var dr=0;dr<8;dr++)for(var dc=0;dc<10;dc++){var fxd=w/2-19+dc*4+(dr%2)*2,fyd=10+dr*5,lit=Math.max(0,Math.sin(s*3+dr*1.3+dc*.9));x.fillStyle='rgba(255,255,255,'+(.08+lit*.55)+')';x.fillRect(fxd,fyd,3.2,4);x.fillStyle=['rgba(255,170,220,.35)','rgba(160,230,255,.35)','rgba(255,240,160,.35)'][(dr+dc)%3];if(lit>.85)x.fillRect(fxd,fyd,3.2,4);}
  x.restore();x.strokeStyle='rgba(255,255,255,.6)';x.lineWidth=1;x.beginPath();x.arc(w/2,29,19,0,7);x.stroke();
  for(i=0;i<5;i++){var ang=s*.8+i*1.26,sx2=w/2+Math.cos(ang)*w*.42,sy2=29+Math.abs(Math.sin(ang))*h*.45;star(x,sx2,sy2,2.4,'#fff');}}
 if(c.set==='aurora'){for(i=0;i<5;i++){x.save();x.globalAlpha=.17;x.strokeStyle=['#a6f3d0','#92d3fc','#d0b7ff'][i%3];x.shadowColor=x.strokeStyle;x.shadowBlur=18;x.lineWidth=15;x.beginPath();x.moveTo(-20,30+i*13);x.bezierCurveTo(w*.3,100+Math.sin(s+i)*35,w*.6,-30,w+20,40+i*10);x.stroke();x.restore();}}
 if(c.set==='ribbon'){for(i=0;i<2;i++){var sd=i?-1:1,ox0=i?w:0,cg2=x.createLinearGradient(ox0,0,ox0+sd*75,0);for(var fo=0;fo<=6;fo++)cg2.addColorStop(fo/6,fo%2?'#7d3a6c':'#c47bb0');x.fillStyle=cg2;x.beginPath();x.moveTo(ox0,0);x.lineTo(ox0+sd*65,0);x.quadraticCurveTo(ox0+sd*22,h*.35,ox0+sd*74,h);x.lineTo(ox0,h);x.closePath();x.fill();
   var sh2=x.createLinearGradient(0,0,0,h);sh2.addColorStop(0,'rgba(255,220,240,.25)');sh2.addColorStop(1,'rgba(40,10,40,.35)');x.fillStyle=sh2;x.fill();
   x.fillStyle='#ffd27a';x.beginPath();x.ellipse(ox0+sd*30,h*.55,9,4,0,0,7);x.fill();x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(ox0+sd*28,h*.54,4,1.5,0,0,7);x.fill();}
  x.lineCap='round';x.strokeStyle='#b8862e';x.lineWidth=4;x.beginPath();x.moveTo(0,12);x.quadraticCurveTo(w/2,61,w,12);x.stroke();x.strokeStyle='#ffe7a8';x.lineWidth=1.6;x.stroke();
  for(i=1;i<5;i++){var tt2=i/5,rx=w*tt2,ry=12+(1-Math.pow(2*tt2-1,2))*24.5;x.fillStyle=['#ff8fc8','#c7a6ff','#7fd4ff','#ffd36b'][i%4];x.beginPath();x.moveTo(rx,ry);x.quadraticCurveTo(rx-9,ry-6,rx-8,ry+4);x.closePath();x.fill();x.beginPath();x.moveTo(rx,ry);x.quadraticCurveTo(rx+9,ry-6,rx+8,ry+4);x.closePath();x.fill();x.fillStyle='#fff';x.beginPath();x.arc(rx,ry,1.8,0,7);x.fill();}}
 x.globalAlpha=1;x.shadowBlur=0;for(i=0;i<8;i++)star(x,(i*67+31)%w,20+(i*37)%(h*.62),1.5,colors[2]);depthFront(x,c,t,w,h);}
 function drawBackground(x,concept,w,h){
  if(!concept)return;
  x.save();background(x,concept,0,w,h);x.restore();
 }
 return Object.freeze({themes:CONCEITOS,theme:tema,cast:cast,drawBackground:drawBackground});
});
