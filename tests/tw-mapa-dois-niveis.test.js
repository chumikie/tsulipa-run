// Contrato de navegação e renderização do mapa sem login e sem backend.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const js = fs.readFileSync(path.join(__dirname, '../tw-mapa.js'), 'utf8');
const eventHandlers = {};
// Pilha de navegação isolada: preserva um estado preexistente de outro módulo.
const entries=[{state:{tw:'hub'},url:'https://tsulipa.example/index.html'}];
let cursor=0,pushes=0,backs=0;
const historico={
  get state(){return entries[cursor].state;},
  pushState(state,_title,url){entries.splice(cursor+1);entries.push({state,url});cursor++;pushes++;},
  back(){if(cursor>0){cursor--;backs++;eventHandlers['window:popstate']?.({state:entries[cursor].state});}},
  forward(){if(cursor<entries.length-1){cursor++;eventHandlers['window:popstate']?.({state:entries[cursor].state});}}
};
const drew = { characters: 0, pets: 0, text: [], night: 0, sources: [] };
const ctx = new Proxy({}, {
  get(target, key) {
    if (key === 'createRadialGradient') return () => ({addColorStop() {}});
    if (key === 'fillText') return (s) => drew.text.push(String(s));
    if (key === 'fillRect') return () => { if (ctx.globalCompositeOperation === 'multiply') drew.night++; };
    if (key === 'setTransform' || key === 'clearRect' || key === 'drawImage' ||
      key === 'save' || key === 'restore' || key === 'fill' || key === 'stroke' ||
      key === 'beginPath' || key === 'arc' || key === 'ellipse' || key === 'translate' ||
      key === 'scale' || key === 'arcTo' || key === 'closePath' || key === 'moveTo' ||
      key === 'lineTo' || key === 'setLineDash' || key === 'quadraticCurveTo') return () => {};
    return target[key];
  },
  set(target,key,value) {target[key]=value; return true;}
});
function node(name) {
  return {
    name, hidden:false, disabled:false, style:{},
    classList:{contains(){return false;},toggle(){},add(){}},
    addEventListener(event,handler) {eventHandlers[name+':'+event]=handler;},
    setAttribute(key,v){this[key]=v;},
    getAttribute(){return null;},
    querySelector(){return null;},
    appendChild(child){child.parentNode=this;},
    click(){this.clicks=(this.clicks||0)+1;}
  };
}
const canvas=node('canvas');
canvas.width=1600;canvas.height=1000;
canvas.getContext=()=>ctx;
canvas.getBoundingClientRect=()=>({left:0,top:0,width:1600,height:canvas.height});
const sec=node('section'),menu=node('menu'),cards=node('hubCards'),roll=node('rolo'),hub=node('hub');
roll.scrollWidth=1600;roll.clientWidth=500;roll.scrollHeight=1000;roll.clientHeight=400;
const button=node('abrir'),back=node('voltar'),title=node('titulo'),subtitle=node('subtitulo'),hint=node('dica');
sec.querySelector=(selector)=>({
 'canvas':canvas,'.tw-mapa-rolo':roll,'.tw-mapa-voltar':back,
 '.tw-mapa-botao':button,'.tw-mapa-dica':hint
})[selector]||null;
sec.getAttribute=()=>null;
const slots = new Map();
function getCard(selector) {
  if (!slots.has(selector)) slots.set(selector, node(selector));
  return slots.get(selector);
}
const document = {
  readyState:'complete',hidden:false,
  createElement:()=>sec,addEventListener(event,handler){eventHandlers['document:'+event]=handler;},
  getElementById(id){return id==='hub'?hub:id==='hubMenu'?menu:id==='hubCards'?cards:id==='twMapa'&&sec.parentNode?sec:null;},
  querySelector(sel) {
    return ({
      '#twMapa .tw-mapa-txt b':title,
      '#twMapa .tw-mapa-txt small':subtitle,
      '#twMapa .tw-mapa-dica':hint
    })[sel] || (sel.startsWith('#hub')?getCard(sel):null);
  }
};
const state = {
 window:{
   TW_MAPA_HORA:20,matchMedia:()=>({matches:true}),
   history:historico,
   location:{href:'https://tsulipa.example/index.html',hash:''},
   addEventListener(event,handler){eventHandlers['window:'+event]=handler;}
 },
 document, Image:class {
   complete=true;naturalWidth=1600;
   set src(v) {drew.sources.push(v);this._src=v;}
   get src() {return this._src;}
 }, performance:{now:()=>6000},
 setTimeout(fn){fn();return 1;},requestAnimationFrame(fn){fn();},
 matchMedia:()=>({matches:true}),
 localStorage:{getItem:()=>null,setItem(){}},
 hubAv:()=>({expr:2}),perfChar:()=>({}),drawChar:()=>{drew.characters++;},
 perfCharContorno(_ctx,_x,_y,_size,cb){cb();},
 hubIdolsDados:{idols:[{avatar:{expr:2}},{av:{expr:2}}]},
 perfPetDoAvatar:()=>({k:'chu'}),
 perfDesenharPetEm:()=>{drew.pets++;},
 HUB_TRIO:[['a','',0,'chu',2],['b','',0,'chu',2],['c','',0,'chu',2]],
 HUB_TRIO_DRAW_CHARS:[{},{},{}],CH:{a:{out:'',outcol:''},b:{out:'',outcol:''},c:{out:'',outcol:''}},
 PET_SP:{chu:{}},
 state:'idle',pw:null,dpw:null,rankI:0,sash:false,accSel:'',frame:0,charPose:''
};
state.window.window=state.window;
vm.runInNewContext(js,state,{filename:'tw-mapa.js'});
assert.ok(drew.sources[0].includes('mapa-mundo.svg'));
assert.ok(drew.characters>=3,'trio desenhado no mundo');
assert.ok(drew.night>0,'iluminação noturna de Brasília');
const initialChars=drew.characters;
// O navegador só permite navegar quando o acordeão de Meu mundo está aberto.
eventHandlers['abrir:click']();
assert.equal(roll.hidden,false,'mapa aberto antes de visitar um bairro');
// Dois cards com alerta no mesmo bairro: mapa agrega um badge com o número.
const alerts=new Set(['#hubCards [data-ir="handshake"]','#hubCards [data-ir="karaoke"]']);
for(const sel of alerts)getCard(sel).classList.contains=(c)=>c==='tw-alert-pink';
eventHandlers['canvas:click']({clientX:800,clientY:420});
assert.equal(canvas.height,760,'entrou na rua do palco');
assert.equal(historico.state.twWorldRuaV1,'palco','rua registrada no histórico');
assert.equal(historico.state.tw,'hub','estado preexistente preservado');
assert.ok(drew.sources.some(s=>s.includes('mapa-rua-palco.svg')));
assert.ok(drew.characters>initialChars,'Idols passeiam pela rua');
assert.ok(drew.pets>0,'pets acompanham avatares reais');
eventHandlers['canvas:click']({clientX:300,clientY:440});
assert.equal(getCard('#hubCards [data-ir="handshake"]').clicks,1,'clique no card original');
eventHandlers['voltar:click']();
assert.equal(canvas.height,1000,'retornou ao mundo');
assert.equal(backs,1,'botão de voltar consome a entrada do mapa');
assert.equal(historico.state.tw,'hub','voltou ao estado anterior sem alterar outros módulos');
assert.ok(drew.text.includes('2'),'dois alertas foram agrupados no bairro');
eventHandlers['canvas:click']({clientX:1300,clientY:700});
assert.match(canvas['aria-label'],/Galeria do Brilho/);
assert.doesNotMatch(canvas['aria-label'],/Harajuku/);
assert.equal(pushes,2,'cada entrada em rua gera somente um pushState');
let prevented=false;
eventHandlers['document:keydown']({key:'Escape',defaultPrevented:false,preventDefault(){prevented=true;}});
assert.ok(prevented,'Esc consumido enquanto a rua está aberta');
assert.equal(canvas.height,1000,'Esc retorna ao mundo');
assert.equal(backs,2,'Esc consome o estado da rua');
eventHandlers['canvas:click']({clientX:1300,clientY:700});
historico.back();
assert.equal(canvas.height,1000,'Voltar nativo do celular retorna ao mundo');
historico.forward();
assert.equal(canvas.height,760,'Avançar nativo restaura a rua');
assert.equal(canvas['aria-label'],'Rua: Galeria do Brilho');
eventHandlers['canvas:click']({clientX:1450,clientY:40});
assert.equal(canvas.height,760,'o canto da arte não é mais botão: o ◀ Mapa é HTML');
eventHandlers['voltar:click']();
assert.equal(canvas.height,1000,'botão ◀ Mapa (HTML) retorna');
eventHandlers['canvas:click']({clientX:800,clientY:420});
const pushesAntesModal=pushes;
const jogo=node('jogo');
jogo.hidden=false;
const originalGetById=document.getElementById;
document.getElementById=function(id){return id==='twPreviewJogo'?jogo:originalGetById.call(this,id);};
let preventedInGame=false;
eventHandlers['document:keydown']({key:'Escape',defaultPrevented:false,preventDefault(){preventedInGame=true;}});
assert.equal(canvas.height,760,'Esc não interfere no jogo aberto');
assert.equal(preventedInGame,false,'Esc livre para o jogo aberto');
jogo.hidden=true;
hub.hidden=true;
let preventedHidden=false;
eventHandlers['document:keydown']({key:'Escape',defaultPrevented:false,preventDefault(){preventedHidden=true;}});
assert.equal(canvas.height,760,'Esc não fecha rua enquanto outro jogo oculta o Hub');
assert.equal(preventedHidden,false,'Esc permanece com o jogo quando Hub está oculto');
hub.hidden=false;
assert.equal(pushes,pushesAntesModal);
eventHandlers['abrir:click']();
assert.equal(canvas.height,1000,'fechar mapa na rua restaura o mundo');
assert.equal(roll.hidden,true,'acordeão fechado');
assert.equal(historico.state.twWorldRuaV1,undefined,'histórico de rua consumido ao fechar mapa');
eventHandlers['abrir:click']();
assert.equal(roll.hidden,false,'abrir novamente o mapa');
assert.equal(canvas.height,1000,'reabre no mundo, sem rua oculta');
// Os Idols da vitrine chegam com o visual em `avatar` (formato real de vitrine_idols).
assert.match(js,/p\.av\|\|p\.avatar/,'passeantes aceitam o formato real da vitrine');
console.log('OK: mundo/ruas, avatares, pets, alertas, horário BR, card original, Esc e history');
