'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const storage=new Map(),calls=[];
const ctx={LANG:'pt',contaJ:{id:'A'},contaAuthUserId:'A',localStorage:{getItem:k=>storage.get(k),setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)},studioAbrir:o=>calls.push(o),TW_CELULAR:{visitar:a=>calls.push(a)}};ctx.window=ctx;
vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../tw-ritmo.js'),'utf8'),ctx);
const R=ctx.TW_RITMO;
for(const l of ['pt','en','es','id','th','ja']){ctx.LANG=l;for(let i=0;i<39;i++)assert.equal(typeof R.t(i),'string',l+' '+i);assert(!R.html().includes('undefined'));}
for(const l of R.idiomas){
  ctx.LANG=l;
  const guia=R.passeioHoje('handshake',k=>({handshake:'Handshake',cafe:'Café'})[k]);
  for(const i of [0,2,3]) assert(guia.includes(R.t(i)));
  assert(guia.includes('data-passeio="cafe"'));
}
assert.equal(R.passeioHoje('bloom',k=>k==='bloom'?'Bloom':''),'');
ctx.LANG='pt';assert.equal(R.html().split(R.t(29)).length-1,1,'uma orientação comum por página');assert(R.html().includes('data-ritmo="run"'));assert.equal((R.html().match(/data-ritmo="karaoke"/g)||[]).length,1);
R.agir('tempo-3');assert(R.html().includes('data-ritmo="karaoke"'));assert.equal(storage.size,0,'time choice does not mark progress');
R.agir('pular');assert(R.html().includes('data-ritmo="retomar"'));
ctx.contaJ={id:'B'};ctx.contaAuthUserId='B';assert(!R.html().includes('data-ritmo="retomar"'),'guidance is scoped to owner');
ctx.contaJ={id:'A'};ctx.contaAuthUserId='A';assert(R.html().includes('data-ritmo="retomar"'));R.agir('retomar');assert.equal(storage.size,0);
R.agir('run');assert.equal(calls.pop(),'run');R.agir('tema');assert.equal(calls.pop().temaCriativo,'luzes');
assert.equal(R.memoriaHtml({id:'old',url:'old'}),'','old photos receive no invented provenance');
assert(R.memoriaHtml({tipo:'studio',quando:Date.UTC(2026,10,20)}).includes('2026-11-20'));
assert.doesNotThrow(()=>R.memoriaHtml({quando:1e25}));
ctx.localStorage.getItem=()=>{throw Error('blocked')};assert.doesNotThrow(()=>R.html());
console.log('Ritmo: six languages, optional paths, account isolation and storage failure passed.');
