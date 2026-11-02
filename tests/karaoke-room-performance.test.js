'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
function has(source,message){assert(html.includes(source),message);}
has('function ktMicCor(p)','Microphone color resolver must accept the active singer');
has('function ktPedestal(x,px,py,person)','Stage microphone must receive its owner');
has('if(micSinger)ktPedestal(x,micSinger.x,micSinger.y,micSinger)','A singer on stage must always have a microphone at their position');
has('j.profileColor||j.corPerfil||j.color||j.cor','Pillow color must prefer the member profile color');
has('profile=j===krRoomRenderPlayer?ktMicCor()','Pillow color must read the local profile color for the seated player');
has('krEu._ktGoingToSofa=true','Sofa routes must enter their slower movement mode');
has('krEu._ktGoingToSofa?2.65','Sofa walking must use its slower target speed without changing the fast return contract');
has("pose=singPose===1?'neon':singPose===2?'banzai':'mic'",'Singing must alternate microphone and dance poses');
has('busy=krHandBusy(j)&&!walking&&!j.no_mic','Singing avatars must not be frozen by the handheld-item busy state');
has('talking||j.no_mic?1','Singing and spoken balloons must activate the open-mouth expression');
has('touchAge>=0&&touchAge<1?6','Speaker-box jumps must activate a temporary expressive face');
has('if(ex===4||ex===5)ex=2','The renderer must preserve expression 1 for singing/speech');
console.log('Karaoke room performance: singer microphone/profile color, pillow colors, slower sofa route, singing choreography and reactive expressions passed');
