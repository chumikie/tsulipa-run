'use strict';
// "Você · 7º": a posição aparece quando a pessoa está fora do Top 5 (ranking local e online).
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const start=html.indexOf('var KaraokeShowRules=(function(){'),end=html.indexOf('/* Um conceito por dia de Brasília',start);
const KaraokeDaily={dayNumber(d){return Math.floor(Date.parse(d+'T00:00:00Z')/86400000);},nextDay(d,o){return new Date((this.dayNumber(d)+o)*86400000).toISOString().slice(0,10);}};
let value=null;const storage={getItem(){return value;},setItem(k,v){value=String(v);}};
const sandbox={KaraokeDaily,console};vm.createContext(sandbox);
vm.runInContext(html.slice(start,end)+'\nthis.KaraokeShowRules=KaraokeShowRules;',sandbox,{timeout:1000});
const rules=sandbox.KaraokeShowRules.create(storage),DAY='2026-11-01';
for(let i=1;i<=7;i++){
 const p={id:'idol-'+i,nick:'Idol '+i,avatar:{c:{hair:'#ff7eb6'}}},a=rules.begin(p,DAY,'normal',false);
 assert.equal(a.ok,true,'show local começa');
 assert.equal(rules.finish(p.id,a.round.token,DAY,{score:1000-i*50,hits:9,attempts:10,combo:9-i,totalNotes:10,completedAt:Date.parse(DAY+'T12:00:00Z')}).ok,true,'show salvo');
}
assert.equal(rules.boards(DAY).score.length,5,'quadro continua mostrando o Top 5');
assert.deepEqual({...rules.mine(DAY,'idol-7').score},{pos:7,valor:650},'7º lugar em pontuação');
assert.equal(rules.mine(DAY,'idol-1').score.pos,1,'primeiro lugar');
assert.equal(rules.mine(DAY,'ninguem').score,undefined,'sem resultado, sem posição');
assert(html.includes("if(me&&+me.pos>5){")&&html.includes("ne.textContent=tr('Você');")&&html.includes("['Você','You','Tú','คุณ','あなた']"),'linha "Você" só fora do Top 5, traduzida');
assert(html.includes("if(a.posicao)a.posicao().then(")&&index.includes("posicao:function(){return contaRpc('kt_minha_posicao');},"),'online pede a posição ao servidor (função opcional)');
assert(!html.includes("tr('Todo domingo, 12h às 13h10')")&&!html.includes('🟢 Domingo · 12h00–13h10'),'textos do antigo evento de domingo saíram da sala');
console.log('✓ Karaoke: minha posição fora do Top 5 (local e online) e textos antigos corrigidos');
