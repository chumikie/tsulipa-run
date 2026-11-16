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
  assert.match(cal,/jnT1Disponivel\(t1Indice\)/);
  assert.match(cal,/nomesT1/);
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
 assert.match(source,/jnT1DesenharSeguro\(canvas,p,0,indice\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
 assert.match(source,/function jnT1PilotoHtml\(\)/);
 assert.match(source,/<figcaption>/);
});

test('episodio 2 tem cinco quadros, seis traducoes e permanece oculto',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_T1_EP2.id,'ensaio-impossivel');
 assert.equal(ctx.JN_T1_EP2.panels.length,5);
 for(const lang of ['pt','en','es','id','th','ja']){
   const t=ctx.jnT1Ep2Texto(lang);
   assert.ok(t.titulo.length>3);
   assert.equal(t.quadros.length,5);
   for(const q of t.quadros){
     assert.ok(q.narracao.length>10);
     assert.ok(q.falas.length>=1);
     assert.ok(q.falas.every(f=>f.texto.length>5));
   }
 }
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.equal(ctx.JN_T1.episodios[1].pronto,false);
 assert.equal(ctx.jnT1Ep2Html(),'');
 assert.equal(ctx.jnT1Disponivel(1,new Date('2026-12-31T12:00:00Z')),false);
});
test('episodio 2 reutiliza Canvas e nao altera leitor historico',()=>{
 assert.match(source,/function jnT1Ep2Desenhar\(canvas,indice\)/);
 assert.match(source,/jnT1DesenharSeguro\(canvas,JN_T1_EP2\.panels\[indice\],1,indice\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
 assert.match(source,/function jnT1Ep2Html\(\)/);
 assert.match(source,/<figcaption>/);
});

test('episodio 3 possui cinco quadros, seis idiomas e bloqueio editorial',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_T1_EP3.id,'lembranca-lirika');
 assert.equal(ctx.JN_T1_EP3.panels.length,5);
 for(const lang of ['pt','en','es','id','th','ja']){
  const t=ctx.jnT1Ep3Texto(lang);
  assert.ok(t.titulo.length>3);
  assert.equal(t.quadros.length,5);
  for(const q of t.quadros){
   assert.ok(q.narracao.length>10);
   assert.ok(q.falas.length>=1);
   assert.ok(q.falas.every(f=>f.texto.length>5));
  }
 }
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.equal(ctx.JN_T1.episodios[2].pronto,false);
 assert.equal(ctx.jnT1Ep3Html(),'');
 assert.equal(ctx.jnT1Disponivel(2,new Date('2026-12-31T12:00:00Z')),false);
});
test('episodio 3 usa renderizador existente sem mudar leitor historico',()=>{
 assert.match(source,/function jnT1Ep3Desenhar\(canvas,indice\)/);
 assert.match(source,/jnT1DesenharSeguro\(canvas,JN_T1_EP3\.panels\[indice\],2,indice\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
 assert.match(source,/function jnT1Ep3Html\(\)/);
});

test('episodio 4 tem cinco quadros e textos completos em seis idiomas',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_T1_EP4.id,'plano-pati');
 assert.equal(ctx.JN_T1_EP4.panels.length,5);
 for(const lang of ['pt','en','es','id','th','ja']){
  const t=ctx.jnT1Ep4Texto(lang);
  assert.ok(t.titulo.length>3);
  assert.equal(t.quadros.length,5);
  for(const q of t.quadros){
   assert.ok(q.narracao.length>10);
   assert.ok(q.falas.length>=1);
   assert.ok(q.falas.every(f=>f.texto.length>5));
  }
 }
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.equal(ctx.JN_T1.episodios[3].pronto,false);
 assert.equal(ctx.jnT1Ep4Html(),'');
 assert.equal(ctx.jnT1Disponivel(3,new Date('2027-01-01T12:00:00Z')),false);
});
test('episodio 4 reutiliza Canvas historico e preserva leitor',()=>{
 assert.match(source,/function jnT1Ep4Desenhar\(canvas,indice\)/);
 assert.match(source,/jnT1DesenharSeguro\(canvas,JN_T1_EP4\.panels\[indice\],3,indice\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
 assert.match(source,/function jnT1Ep4Html\(\)/);
});

test('episodio 5 tem cinco quadros, seis idiomas e continua indisponivel',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_T1_EP5.id,'quando-luz-apaga');
 assert.equal(ctx.JN_T1_EP5.panels.length,5);
 for(const lang of ['pt','en','es','id','th','ja']){
  const t=ctx.jnT1Ep5Texto(lang);
  assert.ok(t.titulo.length>3);
  assert.equal(t.quadros.length,5);
  for(const q of t.quadros){
   assert.ok(q.narracao.length>10);
   assert.ok(q.falas.length>=1);
   assert.ok(q.falas.every(f=>f.texto.length>5));
  }
 }
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.equal(ctx.JN_T1.episodios[4].pronto,false);
 assert.equal(ctx.jnT1Ep5Html(),'');
 assert.equal(ctx.jnT1Disponivel(4,new Date('2027-01-01T12:00:00Z')),false);
});
test('episodio 5 reutiliza Canvas historico e preserva leitor',()=>{
 assert.match(source,/function jnT1Ep5Desenhar\(canvas,indice\)/);
 assert.match(source,/jnT1DesenharSeguro\(canvas,JN_T1_EP5\.panels\[indice\],4,indice\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
 assert.match(source,/function jnT1Ep5Html\(\)/);
});

test('episodio final tem cinco quadros e seis idiomas completos',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_T1_EP6.id,'palco-nosso');
 assert.equal(ctx.JN_T1_EP6.panels.length,5);
 for(const lang of ['pt','en','es','id','th','ja']){
  const t=ctx.jnT1Ep6Texto(lang);
  assert.ok(t.titulo.length>3);
  assert.equal(t.quadros.length,5);
  for(const q of t.quadros){
   assert.ok(q.narracao.length>10);
   assert.ok(q.falas.length>=1);
   assert.ok(q.falas.every(f=>f.texto.length>5));
  }
 }
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.equal(ctx.JN_T1.episodios[5].pronto,false);
 assert.equal(ctx.jnT1Ep6Html(),'');
 assert.equal(ctx.jnT1Disponivel(5,new Date('2027-01-01T12:00:00Z')),false);
});
test('seis episodios continuam privados e capitulos historicos intactos',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_CAPS.length,6);
 assert.equal(ctx.JN_T1.episodios.length,6);
 assert.ok(ctx.JN_T1.episodios.every(e=>e.pronto===false));
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.match(source,/jnT1DesenharSeguro\(canvas,JN_T1_EP6\.panels\[indice\],5,indice\)/);
 assert.match(source,/function jornalCapsUI\(\)/);
});

test('30 quadros em seis idiomas com atores e poses válidas',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 const eps=[ctx.JN_T1_PILOTO,ctx.JN_T1_EP2,ctx.JN_T1_EP3,ctx.JN_T1_EP4,ctx.JN_T1_EP5,ctx.JN_T1_EP6];
 assert.equal(eps.reduce((sum,e)=>sum+e.panels.length,0),30);
 for(const ep of eps){
  for(const p of ep.panels){
   assert.ok(p[1].length>=1&&p[1].length<=3);
   assert.ok(p[1].every(g=>Number.isInteger(g[0])&&g[0]>=0&&g[0]<=2));
   assert.ok(p[3].every(f=>p[1].some(g=>g[0]===f[0])),'fala de personagem visível');
   for(const lang of ['pt','en','es','id','th','ja']){
    assert.ok(p[2][lang]&&p[2][lang].trim().length>10);
    assert.ok(p[3].every(f=>f[1][lang]&&f[1][lang].trim().length>5));
   }
  }
 }
});
test('Canvas privado não altera função histórica e conserva texto completo no HTML',()=>{
 assert.match(source,/function jnT1DesenharSeguro\(canvas,p,episodio,quadro\)/);
 assert.match(source,/jnCapDesenhar\(canvas,\[p\[0\],p\[1\],nar,falas\]\)/);
 assert.match(source,/function jnCapDesenhar\(cv, p\)/);
 assert.match(source,/figcaption/);
});

test('gancho de pintura privado não toca Canvas com temporada bloqueada',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 let consultas=0;
 const root={querySelectorAll(){consultas++;return [];}};
 for(let i=0;i<6;i++)assert.equal(ctx.jnT1PintarQuadros(root,i),false);
 assert.equal(consultas,0);
});
test('calendario exige gate temporal e protege falas da temporada',()=>{
 assert.match(cal,/jnT1Disponivel\(t1Indice\)/);
 assert.match(cal,/F\[mk\[0\]\.k\] \|\| F\.cap/);
 assert.match(cal,/nomesT1/);
});

test('objetos narrativos são ilustrados em todos os 30 quadros sem ativar temporada',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.JN_T1_OBJETOS.length,6);
 for(const objetos of ctx.JN_T1_OBJETOS){
  assert.equal(objetos.length,5);
  assert.ok(objetos.every(o=>['carta','estrela','caixa','foto','gravador','fitas','lanterna','sino'].includes(o)));
 }
 assert.equal(ctx.JN_T1_PUBLICADA,false);
 assert.ok(ctx.JN_T1.episodios.every(e=>!e.pronto));
 assert.match(source,/jnT1ObjetoDesenhar\(canvas,episodio,quadro\)/);
 assert.doesNotMatch(source,/\.roundRect\(/);
});
test('objeto não desenha sem contexto e leitor continua privado',()=>{
 const ctx={Intl,Date};vm.createContext(ctx);vm.runInContext(source,ctx);
 assert.equal(ctx.jnT1ObjetoDesenhar(null,0,0),false);
 assert.equal(ctx.jnT1PintarQuadros({querySelectorAll(){throw Error('não deve consultar')}},0),false);
});
