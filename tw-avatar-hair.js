/* Cortes 2D originais recuperados de feat/avatar-careca-capitao-estrela. */
(function(){
'use strict';
window.TWAvatarHair={
 isWavy:function(b){return b==='onduladom'||b==='onduladom2'||b==='onduladof';},
 back:function(g,c,x,y,b,E,T){if(!(b==='onduladom'||b==='onduladom2'||b==='onduladof'))return false;
if(b==='onduladom'||b==='onduladom2'){
    E(x+2,y+14,3.3,4.8,-.16);E(x+3,y+19,2.3,2.6,.12);E(x+28,y+14,3.3,4.8,.16);E(x+27,y+19,2.3,2.6,-.12);
    g.beginPath();g.moveTo(x+24,y+15);g.quadraticCurveTo(x+31,y+21,x+28,y+28);g.lineTo(x+25,y+31);g.quadraticCurveTo(x+25,y+26,x+22,y+23);g.closePath();g.fill();
    if(b==='onduladom2'){var back2=c.hair2||'#fff';g.save();g.beginPath();g.rect(x-4,y+9,19,29);g.clip();g.fillStyle=back2;E(x+2,y+14,3.3,4.8,-.16);E(x+3,y+19,2.3,2.6,.12);g.restore();}
  }
  else if(b==='onduladof'){
    g.beginPath();g.moveTo(x+3,y+10);g.quadraticCurveTo(x-2,y+16,x+1,y+23);g.quadraticCurveTo(x+2,y+28,x+7,y+28);g.quadraticCurveTo(x+10,y+25,x+11,y+21);g.quadraticCurveTo(x+15,y+26,x+19,y+22);g.quadraticCurveTo(x+21,y+28,x+24,y+28);g.quadraticCurveTo(x+29,y+25,x+29,y+20);g.quadraticCurveTo(x+32,y+13,x+27,y+9);g.closePath();g.fill();
    E(x+2,y+20,3.5,6,-.12);E(x+5,y+25,2.6,3.3,.2);E(x+28,y+20,3.5,6,.12);E(x+25,y+25,2.6,3.3,-.2);
  }

 return true;},
 top:function(g,x,y,b){
  if(b==='onduladom'||b==='onduladom2'){
    g.beginPath();g.moveTo(x+3,y+13);g.quadraticCurveTo(x+1,y+9,x+5,y+6);g.quadraticCurveTo(x+8,y+1,x+12,y+5);g.quadraticCurveTo(x+15,y+1,x+18,y+5);g.quadraticCurveTo(x+23,y+1,x+27,y+7);g.quadraticCurveTo(x+30,y+10,x+27,y+14);g.closePath();g.fill();
  }else if(b==='onduladof'){
    g.beginPath();g.moveTo(x+2,y+13);g.quadraticCurveTo(x-2,y+6,x+3,y+3);g.quadraticCurveTo(x+6,y-2,x+11,y+3);g.quadraticCurveTo(x+15,y-1,x+18,y+3);g.quadraticCurveTo(x+24,y-1,x+28,y+6);g.quadraticCurveTo(x+32,y+10,x+28,y+16);g.lineTo(x+27,y+26);g.quadraticCurveTo(x+23,y+22,x+22,y+17);g.quadraticCurveTo(x+19,y+24,x+16,y+25);g.quadraticCurveTo(x+13,y+21,x+13,y+15);g.quadraticCurveTo(x+9,y+22,x+6,y+24);g.quadraticCurveTo(x+4,y+19,x+4,y+15);g.closePath();g.fill();
    g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=.8;g.beginPath();g.moveTo(x+8,y+5);g.quadraticCurveTo(x+5,y+16,x+8,y+27);g.moveTo(x+21,y+4);g.quadraticCurveTo(x+26,y+15,x+24,y+28);g.stroke();
  }
 },
 fringe:function(g,x,y,b,T){
  if(b==='onduladom'||b==='onduladom2'){
    T([x+3,y+10,x+8,y+5,x+14,y+7,x+20,y+3,x+27,y+8,x+29,y+13,x+24,y+16,x+20,y+14,x+17,y+21,x+13,y+15,x+9,y+19,x+7,y+13,x+3,y+14]);
  }else if(b==='onduladof'){
    T([x+4,y+9,x+9,y+7,x+11,y+18,x+8,y+23]);T([x+9,y+7,x+14,y+6,x+16,y+20,x+13,y+25]);T([x+14,y+6,x+19,y+7,x+21,y+19,x+18,y+24]);T([x+19,y+7,x+25,y+9,x+25,y+20,x+22,y+23]);
  }
 },
 bicolor:function(g,c,x,y,b){
  if(b==='onduladom2'){
    var H2=c.hair2||'#ffffff',HD2='#'+H2.replace(/^#/,'').replace(/../g,function(cc){return ('0'+Math.max(0,parseInt(cc,16)-60).toString(16)).substr(-2)}),hg2=g.createLinearGradient(0,y+5,0,y+24);
    hg2.addColorStop(0,H2);hg2.addColorStop(1,HD2);
    g.save();g.beginPath();g.rect(x-3,y-4,18,34);g.clip();g.fillStyle=hg2;
    g.beginPath();g.moveTo(x+3,y+13);g.quadraticCurveTo(x+1,y+9,x+5,y+6);g.quadraticCurveTo(x+8,y+1,x+12,y+5);g.quadraticCurveTo(x+15,y+1,x+18,y+5);g.quadraticCurveTo(x+23,y+1,x+27,y+7);g.quadraticCurveTo(x+30,y+10,x+27,y+14);g.closePath();g.fill();
    g.beginPath();g.moveTo(x+3,y+11);g.lineTo(x+8,y+19);g.lineTo(x+11,y+10);g.lineTo(x+15,y+15);g.lineTo(x+15,y+9);g.lineTo(x+3,y+9);g.closePath();g.fill();
    g.restore();
  }
  
 }
};
})();
