'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
const marca=read('tw-marca.js').split('/* Compartilhar')[0];
for(const [w,h] of [[960,600],[360,504],[1080,1920],[320,180],[32,32]]){
  const ops=[];
  const ctx={drawImage(...a){ops.push(['image',...a]);},fillRect(...a){ops.push(['rect',...a]);},measureText(t){return {width:t.length*parseFloat(this.font.split(' ')[1])*.55};},beginPath(){},roundRect(...a){ops.push(['pill',...a]);},fill(){},stroke(){},save(){},restore(){},fillText(...a){ops.push(['text',...a]);}};
  const original={width:w,height:h,toDataURL(){return 'original';}};
  const sandbox={window:{},document:{createElement(){return {getContext(){return ctx;},toDataURL(){return 'marked';}};}}};
  vm.runInNewContext(marca,sandbox);
  const out=sandbox.window.twMarcaCanvas(original);
  assert.equal(out.width,w);assert.ok(out.height>h);
  assert.equal(original.height,h);
  assert.deepEqual(ops[0],['image',original,0,0,w,h]);
  for(const op of ops.filter(x=>x[0]==='rect'||x[0]==='pill')){
    assert.ok(op[2]>=h,'selo e fundo ficam abaixo de todos os pixels da foto');
    assert.ok(op[1]>=0 && op[1]+op[3]<=w,'selo cabe na largura');
  }
  assert.equal(sandbox.window.twMarcaPng(original),'marked');
}
const els={duoTabs:{},duoTabC:{}};
const env={window:{},lang:'pt',tr:s=>s,escHtml:s=>String(s),$:id=>els[id],lojaItem:k=>[k,'','',100],lojaTem:()=>false,PERF_FUNDOS:[],PET_PH_EXPRS:[],TEMA_INFO:{}};
vm.createContext(env);vm.runInContext(read('duo.js'),env);
env.duoTrava=(attr,o)=>o[7]||'';
env.duoCena='danca';env.duoTabUI();
assert.equal((els.duoTabC.innerHTML.split('<details')[0].match(/class="duocard/g)||[]).length,6);
assert.match(els.duoTabC.innerHTML,/<details class="duo-mais-cenas" open>/);
for(const c of env.DUO_CENAS)assert.ok(els.duoTabC.innerHTML.includes(c[7]?'data-dtrava="'+c[7]+'"':'data-dcena="'+c[0]+'"'));
for(const lang of ['pt','en','es','ja','th','id']){env.LANG=lang;for(let n=0;n<4;n++)assert.ok(env.duoRotulo(n));}
env.LANG='en';assert.equal(env.duoRotulo(0),'Save photo');
const html=read('index.html');
for(const id of ['duoPng','duoPngSem','duoPhone','duoSerie'])assert.equal((html.match(new RegExp('id="'+id+'"','g'))||[]).length,1);
assert.ok(html.indexOf('id="duoTabC"')<html.indexOf('id="duoSalvar"'));
assert.match(html,/<details class="duo-menu" id="duoSalvar">/);
assert.match(html,/<details class="duo-menu" id="duoExtra">/);
assert.match(read('duo-tela.js'),/t.id === 'duoPngSem' \? cv.toDataURL\('image\/png'\)/);
for(const match of html.replace(/<!--[\s\S]*?-->/g,'').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
  if(/\bsrc=|application\//.test(match[1]))continue;
  new vm.Script(match[2]);
}
console.log('OK: faixa fora da foto em 5 formatos, originais preservados, cenas acessíveis, 6 idiomas, PNG transparente e scripts da página.');

