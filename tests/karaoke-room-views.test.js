'use strict';
// Vistas da janela do Karaoke: rodízio semanal (domingo 0h de Brasília, junto com o ranking), dia/noite pelo horário de Brasília e desenho das 10 versões.
const assert=require('node:assert/strict');
const V=require('../karaoke-room-views.js');
const at=s=>Date.parse(s);
assert.deepEqual(V.VIEWS,['gigoia','liberdade','tailandia','harajuku','praia'],'cinco vistas na ordem combinada');
assert.equal(V.viewFor(at('2026-11-01T03:00:00Z')),'liberdade','domingo 01/11 0h BRT: Liberdade (vira junto com o ranking)');
assert.equal(V.viewFor(at('2026-11-08T02:59:59Z')),'liberdade','sábado 07/11 23h59 BRT ainda Liberdade');
assert.equal(V.viewFor(at('2026-11-08T03:00:00Z')),'tailandia','domingo 08/11 0h BRT: Tailândia');
assert.equal(V.viewFor(at('2026-11-15T03:00:00Z')),'harajuku','depois Harajuku');
assert.equal(V.viewFor(at('2026-11-22T03:00:00Z')),'praia','depois Praia');
assert.equal(V.viewFor(at('2026-11-29T03:00:00Z')),'gigoia','volta para Gigoia');
assert.equal(V.viewFor(at('2026-10-25T03:00:00Z')),'gigoia','semana anterior (antes da âncora) também funciona');
assert.equal(V.nextChange(at('2026-11-05T15:00:00Z')),at('2026-11-08T03:00:00Z'),'próxima troca no domingo 0h BRT');
assert.equal(V.isNight(at('2026-11-08T15:00:00Z')),false,'domingo 12h BRT (evento) é dia');
assert.equal(V.isNight(at('2026-11-08T08:59:00Z')),true,'5h59 BRT é noite');
assert.equal(V.isNight(at('2026-11-08T09:00:00Z')),false,'6h BRT é dia');
assert.equal(V.isNight(at('2026-11-08T21:00:00Z')),true,'18h BRT é noite');
// desenho: as 10 versões rodam num contexto falso sem erro e desenham alguma coisa
let ops=0;const grad={addColorStop(){}};
const ctx=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='createLinearGradient'||k==='createRadialGradient')?()=>grad:(k==='roundRect'?undefined:()=>{ops++;}),set:(t,k,v)=>{t[k]=v;return true;}});
for(const k of V.VIEWS)for(const n of [false,true]){ops=0;assert.equal(V.draw(ctx,42,52,206,148,120,k,n),k);assert(ops>40,k+(n?' noite':' dia')+' desenha');}
// Fotos usam exatamente os cenários do Karaoke, sem desenhar vidro ou moldura.
for(const k of V.VIEWS)for(const n of [false,true]){ops=0;assert.equal(V.drawScene(ctx,0,0,480,300,0,k,n),k);assert(ops>20,k+' paisagem pura desenha');}
// ligado na sala: a página carrega o arquivo e a janela usa as vistas novas (sem o sorteio antigo da quinta-feira)
const html=require('node:fs').readFileSync(require('node:path').join(__dirname,'..','karaoke-time.html'),'utf8');
assert(html.includes('<script src="./karaoke-room-views.js?v=1"></script>'),'sala carrega as vistas');
assert(html.includes('KaraokeRoomViews.draw(x,rx,ry,rw,rh,t,krSt.vista,')&&!html.includes('604800e3)%2'),'janela usa as vistas novas');
for(const k of V.VIEWS.concat(['dianoite']))assert(html.includes('data-sim="'+k+'"'),'botão de teste '+k);
console.log('✓ Karaoke: 5 vistas da janela, rodízio semanal no domingo 0h de Brasília e dia/noite');
