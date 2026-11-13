'use strict';
const a=require('node:assert/strict');
const r=require('../tools/gacha/regras-proposta.js');
a.equal(r.PITY_LIMITE,7);
a.deepEqual(r.resultado('nada',0),{permitido:true,semPremio:1,garantiaAtivada:false});
for(let i=1;i<=7;i++)a.equal(r.resultado('nada',i-1).semPremio,i);
a.deepEqual(r.resultado('nada',7),{permitido:false,erro:'pity_deve_sortear_premio'});
for(const tipo of ['card','ticket','estrelas','bonus'])
 a.deepEqual(r.resultado(tipo,7),{permitido:true,semPremio:0,garantiaAtivada:true});
a.equal(r.duplicata(0,'card'),0);
a.equal(r.duplicata(1,'card'),1);
a.equal(r.duplicata(5,'card'),1);
a.equal(r.duplicata(1,'aniver'),0);
a.equal(r.duplicata(1,'nada'),0);
a.deepEqual(r.troca(4,5,['A'],'A'),{ok:false,erro:'po_insuficiente'});
a.deepEqual(r.troca(5,5,['A'],'A'),{ok:true,saldoDepois:0,card:'A'});
a.deepEqual(r.troca(7,5,['A'],'B'),{ok:false,erro:'card_nao_disponivel'});
a.deepEqual(r.troca(7,4,['A'],'A'),{ok:false,erro:'custo_invalido'});
for(const fn of [()=>r.resultado('nada',-1),()=>r.duplicata(-1,'card'),()=>r.troca(-1,5,['A'],'A')])
 a.throws(fn,/inválido/);
console.log('OK: protótipo Gacha — 7 nada, 8º garantido, duplicatas, troca, valores inválidos');
