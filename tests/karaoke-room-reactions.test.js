'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
function block(from,to){const a=html.indexOf(from),b=html.indexOf(to,a);assert(a>=0&&b>a);return html.slice(a,b);}
const pets=block('var ktPets=','var ktMicBalanco=');
const faces=block('function ktPetRosto(','/* Pets da TsuLiPa na sala');
const drums=block('var ktPandeiro=','function ktMesaKaraoke(');
function setup(){
 let now=1000;const audio=[];
 const env={Math,performance:{now:()=>now},krWhimsicalReducedMotion:false,muted:false,
  krBots:[[160,400],[232,470],[332,470],[432,470],[532,470],[632,470],[732,470],[800,400]].map(([x,y],i)=>({x,y,nick:'Idol '+i})),
  krBolhas:[],ac:()=>null,beep:(...args)=>audio.push(['beep',...args]),krRuido:(...args)=>audio.push(['noise',...args]),ktEstrelinha:()=>{}};
 vm.createContext(env);vm.runInContext(faces+pets+drums,env);
 return {env,audio,time:n=>{now=n;}};
}
for(const fps of [30,60,120])for(const i of [0,1,2]){
 const {env:e,time}=setup(),p=e.ktPets[i];e.ktPets=[p];
 e.ktPetAvancar(p,i,0,1000);const initial={x:p.x,y:p.y};
 assert(e.ktPetToque(p.x,p.y-14));assert.equal(p.ex,'feliz');assert.equal(p.toques,1);assert.equal(e.krBolhas.length,2);
 const visit=p.visita;time(1100);assert(e.ktPetToque(p.x,p.y-14));assert.equal(p.visita,visit,'Debounced taps keep the same visit');assert.equal(p.toques,1);
 time(1600);assert(e.ktPetToque(p.x,p.y-14));assert.equal(p.ex,'amor');assert.equal(p.toques,2);
 assert.equal(p.x,initial.x);assert.equal(p.y,initial.y,'Retargeting must not teleport the pet');
 let now=1600,frame=0,arrived=false,returned=false;
 for(let step=0;step<fps*12;step++){
  const a={x:p.x,y:p.y};now+=1000/fps;frame+=60/fps;const dt=Math.min(.05,(now-p.tickAt)/1000);time(now);e.ktPetAvancar(p,i,frame,now);
  assert(Math.hypot(p.x-a.x,p.y-a.y)<=230*dt+.001,'Movement is speed-limited at '+fps+' fps');
  assert(!e.ktPetCruzaMesa(a,p),'Route must keep the pet envelope outside the table: '+JSON.stringify({fps,i,a,b:{x:p.x,y:p.y},visit:p.visita}));
  assert(p.x-26>=48&&p.x+26<=912&&p.y<=520,'Pet remains inside the approved mobile crop');
  if(p.visita&&p.visita.phase==='carinho')arrived=true;
  if(arrived&&!p.visita){returned=true;const orbit=e.ktPetOrbita(i,frame);assert(Math.hypot(p.x-orbit.x,p.y-orbit.y)<.01,'Return joins the moving orbit without a jump');break;}
 }
 assert(arrived&&returned,'Pet must greet an Idol and return at '+fps+' fps');
}
{
 const {env:e,time}=setup(),p=e.ktPets[0];e.ktPets=[p];e.ktPetAvancar(p,0,0,1000);e.ktPetToque(p.x,p.y-14);
 const a={x:p.x,y:p.y};time(61000);e.ktPetAvancar(p,0,3600,61000);
 assert(Math.hypot(p.x-a.x,p.y-a.y)<=11.501,'Background-tab time cannot cause a jump');
 e.krWhimsicalReducedMotion=true;const b={x:p.x,y:p.y};time(61050);e.ktPetAvancar(p,0,3603,61050);
 assert(Math.hypot(p.x-b.x,p.y-b.y)<=7.501,'Reduced-motion visit uses a gentler speed');
 e.krBots=[];p.toques=1;e.ktPetVisitar(p);assert.equal(p.visita.path.at(-1).y,306,'Empty audience has a safe fallback');
}
{
 const {env:e}=setup(),a=e.ktPets[0],b=e.ktPets[1];e.ktPets=[a,b];
 Object.assign(a,{x:400,y:300,hitY:286});Object.assign(b,{x:420,y:300,hitY:286});
 e.ktPetToque(401,286);assert.equal(a.toques,1);assert.equal(b.toques,undefined,'Overlapping hit areas select the nearest face');
}
{
 const {env:e,audio,time}=setup();
 assert(e.ktPandeiroToque(564,360));const original=JSON.stringify(audio);assert(audio.length>0);
 audio.length=0;assert(e.ktPandeiroToque(248,292));assert.equal(JSON.stringify(audio),original,'Both pandeiros use identical audio parameters');
 assert.equal(e.ktPandeiro.t0,1000);assert.equal(e.ktPandeiroExtra.t0,1000,'Each pandeiro has independent shake state');
 audio.length=0;time(1100);assert(e.ktPandeiroToque(248,292));assert.equal(audio.length,0,'Repeated touch is debounced');
 assert.equal(e.ktPandeiroToque(480,160),false,'Decorative hit zones never intercept the rhythm screen');
 time(1400);assert(e.ktPandeiroToque(248,292));assert(audio.length>0);
}
{
 const {env:e}=setup();let depth=0;
 const gradient={addColorStop(){}};
 const ctx=new Proxy({save(){depth++;},restore(){depth--;},createLinearGradient:()=>gradient,createRadialGradient:()=>gradient},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
 for(const type of ['tsu','lirika','pati'])for(const face of ['','feliz','amor'])for(const running of [false,true])e.ktPetDesenho(ctx,type,0,0,1.2,10,face,running);
 e.ktPandeiroParede(ctx,10);assert.equal(depth,0,'Drawing restores canvas state for all three pet faces and the new pandeiro');
}
console.log('Karaoke room reactions: pet faces, safe visits/return at 30/60/120 fps, cooldowns, background recovery, crop bounds and shared pandeiro sound passed');
