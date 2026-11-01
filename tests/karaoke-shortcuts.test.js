const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const html = fs.readFileSync(path.join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const resume = html.match(/function finishResume\(\)\{[^\n]+\}\nfunction pause\(value\)\{[^\n]+\}/);
const tick = html.match(/function tick\(\)\{[\s\S]*?\}\nfunction hit\(/);
const keyhandler = [...html.matchAll(/document\.addEventListener\('keydown',function\(e\)\{[\s\S]*?\n\}\);/g)]
  .map(m => m[0]).find(src => src.includes("key==='c'"));
assert(resume && tick && keyhandler, 'Contagem, áudio e atalhos existem');

const clock = {ms:2000}, note = {at:3000,done:false};
const run = {start:0,paused:false,resumeUntil:0,pauseAt:0,audioStep:0,step:250,total:240,
  notes:[note],auto:true,offsetMs:0,score:0,combo:0,hits:0,attempts:0};
let audio=0,scheduled=0;
const stage = {ktCalibration:{open:false}};
const ctx=vm.createContext({run,performance:{now:()=>clock.ms},kNow:()=>clock.ms,AC:null,
  krDemoCantor:null,document:{hidden:false},$:id=>stage[id],silence:()=>{},ac:()=>audio++,schedule:()=>scheduled++,
  updateUI:()=>{},checkpoint:()=>{},lastCheckpoint:clock.ms,lastUI:clock.ms,KT_HIT_WINDOWS:{good:100},react:()=>{},
  end:()=>{throw Error('Não deve encerrar');}});
vm.runInContext(resume[0]+'\n'+tick[0].replace(/\nfunction hit\($/,''),ctx);
ctx.pause(true);
clock.ms=3000;ctx.pause(false);
assert.equal(run.resumeUntil,6000,'retomada exige contagem de 3 segundos');
clock.ms=5999;ctx.tick();
assert.equal(run.paused,true,'sem pontuação ou áudio antes da contagem');
assert.equal(scheduled,0);
clock.ms=6000;ctx.tick();
assert.equal(run.paused,false,'retomada após os 3 segundos');
assert.equal(run.start,4000,'relógio compensou toda a pausa');
assert.equal(note.at,7000,'notas permanecem sincronizadas');
assert.equal(audio,1);
assert.equal(scheduled,1);
clock.ms=7000;ctx.pause(true);ctx.pause(false);ctx.pause(true);
assert.equal(run.paused,true);
assert.equal(run.resumeUntil,0,'P cancela a contagem em andamento');
ctx.pause(false);ctx.document.hidden=true;clock.ms=10000;ctx.tick();
assert.equal(run.resumeUntil,0,'aba oculta não retoma por engano');

let listener;const actions=[],shortcutRun={paused:false,resumeUntil:0};
const elements={ktResult:{open:false},ktClosed:{hidden:true},ktCalibration:{open:false},ktFoto:{click:()=>actions.push('camera')},krMicBtn:{disabled:false,click:()=>actions.push('microphone')}};
vm.runInNewContext(keyhandler,{run:shortcutRun,$:id=>elements[id],hit:i=>actions.push('hit'+i),
  pause:flag=>actions.push('pause'+flag),document:{querySelectorAll:()=>[],addEventListener:(event,fn)=>{listener=fn;}}});
function press(key,other={}){let prevented=false;listener({key,repeat:false,target:{tagName:'BODY'},preventDefault:()=>{prevented=true;},...other});return prevented;}
assert(press('p'));assert.equal(actions.at(-1),'pausetrue');
shortcutRun.paused=true;shortcutRun.resumeUntil=9000;
assert(press('p'));assert.equal(actions.at(-1),'pausetrue','P cancela a contagem ativa');
shortcutRun.paused=false;shortcutRun.resumeUntil=0;
assert(press('m'));assert.equal(actions.at(-1),'microphone','M must trigger the existing microphone control');
const beforeDisabledMic=actions.length;elements.krMicBtn.disabled=true;assert.equal(press('m'),false,'M must not hijack input when microphone is disabled');assert.equal(actions.length,beforeDisabledMic);elements.krMicBtn.disabled=false;
assert(press('c'));assert.equal(actions.at(-1),'camera');
assert(press('s'));assert.equal(elements.ktCalibration.open,true);
assert.equal(actions.at(-1),'pausetrue','abrir configurações pausa o show');
assert(press('s'));assert.equal(elements.ktCalibration.open,false);
assert(press('d'));assert.equal(actions.at(-1),'hit0');
const previous=actions.length;
press('c',{ctrlKey:true});press('p',{target:{tagName:'INPUT'}});
elements.ktClosed.hidden=false;press('s');press('c');
assert.equal(actions.length,previous,'atalhos não interferem em formulário, sistema ou cortina');
assert(!html.includes("kt.start('practice')"),'ensaio livre foi retirado da interface');
console.log('Karaoke: P/M/C/S, pausa e retomada de 3 segundos sem desvio musical OK');
