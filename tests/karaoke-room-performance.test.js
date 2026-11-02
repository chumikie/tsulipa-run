'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
function has(source,message){assert(html.includes(source),message);}
has('function ktMicCor(person)','Microphone color resolver must accept the active singer');
has('function ktPedestal(x,px,py,person)','Stage microphone must receive its owner');
has('if(krStageSinger)ktPedestal(x,krStageSinger.x,krStageSinger.y,krStageSinger)','A singer on stage must always have a microphone at their position');
has('j.profileColor||j.corPerfil||j.color||j.cor','Pillow color must prefer the member profile color');
has('p.profileColor=ktMicCor();','The local player profile color must be copied into the render record without per-frame closures');
has('krEu._ktGoingToSofa=true','Sofa routes must enter their slower movement mode');
has('if(krEu._ktGoingToSofa)krVelocidadeAlvo=2.65','Sofa walking must use its slower target speed without changing the fast return contract');
has("pose=['mic','neon','banzai','mic'][singPose]",'Singing must alternate microphone and dance poses');
has('talking||j.no_mic?1','Singing and spoken balloons must activate the open-mouth expression');
has('touchAge>=0&&touchAge<1?6','Speaker-box jumps must activate a temporary expressive face');
has('if(ex===4||ex===5)ex=2','The renderer must preserve expression 1 for singing/speech');
console.log('Karaoke room performance: singer microphone/profile color, pillow colors, slower sofa route, singing choreography and reactive expressions passed');
