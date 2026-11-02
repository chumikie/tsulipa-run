'use strict';
// Vistas da janela do Karaoke: rodízio semanal (segunda 0h de Brasília), dia/noite pelo horário de Brasília e desenho das 10 versões.
const assert=require('node:assert/strict');
const V=require('../karaoke-room-views.js');
const at=s=>Date.parse(s);
assert.deepEqual(V.VIEWS,['gigoia','liberdade','tailandia','harajuku','praia'],'cinco vistas na ordem combinada');
assert.equal(V.viewFor(at('2026-11-02T03:00:00Z')),'liberdade','segunda 02/11 0h BRT: Liberdade');
assert.equal(V.viewFor(at('2026-11-09T02:59:59Z')),'liberdade','domingo 08/11 23h59 BRT ainda Liberdade');
assert.equal(V.viewFor(at('2026-11-09T03:00:00Z')),'tailandia','segunda 09/11 0h BRT: Tailândia');
assert.equal(V.viewFor(at('2026-11-16T03:00:00Z')),'harajuku','depois Harajuku');
assert.equal(V.viewFor(at('2026-11-23T03:00:00Z')),'praia','depois Praia');
assert.equal(V.viewFor(at('2026-11-30T03:00:00Z')),'gigoia','volta para Gigoia');
assert.equal(V.viewFor(at('2026-10-26T03:00:00Z')),'gigoia','semana anterior (antes da âncora) também funciona');
assert.equal(V.nextChange(at('2026-11-05T15:00:00Z')),at('2026-11-09T03:00:00Z'),'próxima troca na segunda 0h BRT');
assert.equal(V.isNight(at('2026-11-08T15:00:00Z')),false,'domingo 12h BRT (evento) é dia');
assert.equal(V.isNight(at('2026-11-08T08:59:00Z')),true,'5h59 BRT é noite');
assert.equal(V.isNight(at('2026-11-08T09:00:00Z')),false,'6h BRT é dia');
assert.equal(V.isNight(at('2026-11-08T21:00:00Z')),true,'18h BRT é noite');
// desenho: as 10 versões rodam num contexto falso sem erro e desenham alguma coisa
let ops=0;const grad={addColorStop(){}};
const ctx=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='createLinearGradient'||k==='createRadialGradient')?()=>grad:(k==='roundRect'?undefined:()=>{ops++;}),set:(t,k,v)=>{t[k]=v;return true;}});
for(const k of V.VIEWS)for(const n of [false,true]){ops=0;assert.equal(V.draw(ctx,42,52,206,148,120,k,n),k);assert(ops>40,k+(n?' noite':' dia')+' desenha');}
console.log('✓ Karaoke: 5 vistas da janela, rodízio semanal na segunda 0h de Brasília e dia/noite');
