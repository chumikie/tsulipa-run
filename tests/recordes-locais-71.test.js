'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'recordes.js'), 'utf8');
const hs = fs.readFileSync(path.join(root, 'handshake.js'), 'utf8');
const cafe = fs.readFileSync(path.join(root, 'cafe.js'), 'utf8');

function jogo(){
  const memoria = new Map();
  const conta = {id:'idol-A'};
  const ctx = {
    contaJ:conta,
    localStorage:{
      getItem:k=>memoria.has(k)?memoria.get(k):null,
      setItem:(k,v)=>memoria.set(k,String(v)),
      removeItem:k=>memoria.delete(k)
    },
    tr:s=>s,
    escHtml:s=>String(s),
    conqTem:()=>false,
    Intl, Date
  };
  vm.createContext(ctx);
  vm.runInContext(src,ctx);
  return {ctx,memoria};
}
test('histórico local conserva somente a união de cinco melhores e cinco recentes',()=>{
  const {ctx,memoria}=jogo(), inicio=Date.UTC(2026,10,2,15);
  for(let i=0;i<5;i++) assert.equal(ctx.recRegistrarLocal('hand',9000-i,inicio+i*1000),true);
  for(let i=0;i<30;i++) assert.equal(ctx.recRegistrarLocal('hand',i,inicio+(i+5)*1000),true);
  const h=ctx.recHistoricoLocal('hand',inicio+36000);
  assert.equal(h.partidas.length,10);
  const pontos=h.partidas.map(p=>p.score);
  for(const top of [9000,8999,8998,8997,8996]) assert.ok(pontos.includes(top));
  for(const atual of [25,26,27,28,29]) assert.ok(pontos.includes(atual));
  assert.ok(memoria.get(ctx.recLocalChave('hand')).length<1800,'armazenamento pequeno e limitado');
});
test('melhor da semana persiste mesmo depois de sair das dez partidas conservadas',()=>{
  const {ctx}=jogo(), anterior=Date.UTC(2026,9,25,16), semana=Date.UTC(2026,10,2,15);
  for(let i=0;i<5;i++) ctx.recRegistrarLocal('cafe',9000-i,anterior+i*1000);
  ctx.recRegistrarLocal('cafe',500,semana);
  for(let i=0;i<9;i++) ctx.recRegistrarLocal('cafe',100+i,semana+(i+1)*1000);
  const h=ctx.recHistoricoLocal('cafe',semana+11000);
  assert.equal(h.melhorSemana,500);
  assert.ok(!h.partidas.some(p=>p.score===500),'o melhor semanal não precisa ocupar uma das dez vagas');
  assert.equal(ctx.recMaiorLocal('cafe'),9000,'recorde de sempre permanece');
});
test('virada semanal segue domingo 00h em America/Sao_Paulo',()=>{
  const {ctx}=jogo();
  assert.equal(ctx.recSemanaLocal(Date.UTC(2026,10,1,2,59)), '2026-10-25');
  assert.equal(ctx.recSemanaLocal(Date.UTC(2026,10,1,3,0)), '2026-11-01');
  ctx.recRegistrarLocal('hand',350,Date.UTC(2026,10,1,2,59));
  assert.equal(ctx.recHistoricoLocal('hand',Date.UTC(2026,10,1,3,0)).melhorSemana,0);
});
test('contas não herdam recordes de outras contas nem o recorde legado compartilhado',()=>{
  const {ctx,memoria}=jogo(), at=Date.UTC(2026,10,3,15);
  ctx.recRegistrarLocal('hand',777,at);
  memoria.set('tw_handshake_recorde','9999');
  assert.equal(ctx.recMaiorLocal('hand'),777);
  ctx.contaJ={id:'idol-B'};
  assert.equal(ctx.recMaiorLocal('hand'),0);
  ctx.recRegistrarLocal('hand',123,at+1000);
  assert.equal(ctx.recMaiorLocal('hand'),123);
  ctx.contaJ={id:'idol-A'};
  assert.equal(ctx.recMaiorLocal('hand'),777);
  ctx.contaJ=null;
  assert.equal(ctx.recMaiorLocal('hand'),9999,'legado continua disponível somente sem login');
});
test('aba pessoal mostra semana, cinco melhores e cinco recentes sem chamar servidor',()=>{
  const {ctx}=jogo();
  ctx.recRegistrarLocal('hand',120,Date.now());
  const tela=ctx.recCorpo('hand');
  assert.match(tela,/Melhor da semana/);
  assert.match(tela,/5 melhores pontuações/);
  assert.match(tela,/5 pontuações recentes/);
  assert.match(tela,/120/);
  assert.doesNotMatch(src.slice(src.indexOf('function recRegistrarLocal('),src.indexOf('function recMaiorLocal(')),/contaRpc|fetch\(/);
  assert.match(hs,/recRegistrarLocal\('hand',atual\.pontos\)/);
  assert.match(cafe,/recRegistrarLocal\('cafe',cf\.pontos\)/);
});
