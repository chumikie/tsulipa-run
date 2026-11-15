// Temporada 1: estrutura oculta e datas; não publica episódios incompletos.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'..','jornal-capitulos.js'),'utf8');
const cal=fs.readFileSync(path.join(__dirname,'..','tw-calendario.js'),'utf8');
test('temporada nova tem seis segundas e fica bloqueada sem arte/idiomas',()=>{
  const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
  assert.equal(ctx.JN_T1_PUBLICADA,false);
  assert.equal(ctx.JN_CAPS.length,6);
  assert.equal(ctx.JN_T1.episodios.length,6);
  const datas=['2026-11-16','2026-11-23','2026-11-30','2026-12-07','2026-12-14','2026-12-21'];
  assert.deepEqual(Array.from(ctx.JN_T1.episodios,e=>e.data),datas);
  assert.ok(ctx.JN_T1.episodios.every(e=>e.pronto===false));
  for(let i=0;i<6;i++)assert.equal(ctx.jnT1Disponivel(i,new Date('2027-01-01T12:00:00Z')),false);
});
test('fronteira da data usa horario de Brasilia',()=>{
  const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
  assert.equal(ctx.jnT1HojeBrasilia(new Date('2026-11-16T02:59:59Z')),'2026-11-15');
  assert.equal(ctx.jnT1HojeBrasilia(new Date('2026-11-16T03:00:00Z')),'2026-11-16');
});
test('calendario preserva seis terças e bloqueia marcas novas',()=>{
  assert.match(cal,/nc % 7 === 0 && nc \/ 7 < 6/);
  assert.match(cal,/JN_T1\.publicada/);
  assert.match(cal,/JN_T1\.episodios\[t1Indice\]\.pronto/);
  assert.match(source,/var JN_CAPS_INICIO = Date\.UTC\(2026, 9, 27\)/);
});

test('piloto possui cinco quadros e seis idiomas completos',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 const langs=['pt','en','es','id','th','ja'];
 assert.equal(ctx.JN_T1_PILOTO.panels.length,5);
 for(const lang of langs){
   const t=ctx.jnT1PilotoTexto(lang);
   assert.ok(t.titulo.length>3);
   assert.equal(t.quadros.length,5);
   for(const q of t.quadros){
     assert.ok(q.narracao.length>10);
     assert.ok(q.falas.length>=1);
     assert.ok(q.falas.every(f=>f.texto.length>5));
   }
 }
 assert.equal(ctx.jnT1PilotoHtml(),'','piloto permanece invisível');
 assert.equal(ctx.JN_T1.episodios[0].pronto,false);
 assert.equal(ctx.JN_T1_PUBLICADA,false);
});
test('piloto reutiliza renderer Canvas histórico sem alterar o leitor',()=>{
 assert.match(source,/jnCapDesenhar\(canvas,p\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
 assert.match(source,/function jnT1PilotoHtml\(\)/);
 assert.match(source,/<figcaption>/);
});
