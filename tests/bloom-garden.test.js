// Bloom⭐Garden!: seis idiomas completos, só fala com as RPCs do jardim, fica "Em breve" sem servidor.
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const raiz=path.join(__dirname,'..'),src=fs.readFileSync(path.join(raiz,'bloom.js'),'utf8');
const chamadas=[];let resposta=null;
const ctx={console,Math,window:null,LANG:'pt',performance:{now:()=>0},
  document:{addEventListener(){},createElement:()=>({}),body:{appendChild(){}}},
  contaJ:null,contaRpc:(n,a)=>{chamadas.push(n);return resposta instanceof Error?Promise.reject(resposta):Promise.resolve(resposta);},
  hubCardsUI(){},contaUI(){}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(src,ctx,{filename:'bloom.js'});
const T=ctx.BLOOM_TR;
ctx.esc=String;
const estado=vm.runInContext(src.slice(src.indexOf('var ESTADO_CANTEIRO ='),src.indexOf('  function pendentes('))+'\nestadoCanteiro',ctx);
assert.match(estado({regas:0,precisa:3}),/Pode regar.*Faltam 3 regas/);
assert.match(estado({regas:2,precisa:3,regado_hoje:true}),/Volte amanhã.*Falta 1 rega/);
assert.match(estado({regas:3,precisa:3,regado_hoje:true}),/Pronta para colher/);
assert.equal(estado(null),'');
assert.deepEqual(Object.keys(T).sort(),['en','es','id','ja','pt','th']);
for(const l in T)for(const k in T.pt){assert.ok(T[l][k]&&T[l][k].trim(),l+'.'+k);for(const ph of ['{n}','{m}','{f}'])if(T.pt[k].includes(ph))assert.ok(T[l][k].includes(ph),l+'.'+k+' '+ph);}
async function conferirLote(respostas, esperado){
  const calls=[],sounds=[],events=[];
  const garden={ok:true,canteiros:[{canteiro:0,regado_hoje:true}]};
  const env={LANG:'pt',ocupado:false,stDono:'A',st:{antigo:true},msg:'',window:{},
    donoJardim:()=> 'A',ui(){},idolIr(){},crescer(){},laco(){},
    SEM:{tulipa:[]},t:k=>k,chuva:[],festa:[],performance:{now:()=>0},
    som:k=>sounds.push(k),rpc:async(n)=>{
      calls.push(n);
      if(n==='jardim_estado')return garden;
      const r=respostas.shift();
      if(r instanceof Error)throw r;
      return r;
    }};
  env.window.TWVidaCidade={registrar:e=>events.push(e)};
  const textos=src.slice(src.indexOf('  var LOTE_TR'),src.indexOf('  var ARRANJO_TR'));
  const batch=src.slice(src.indexOf('  function emSerie('),src.indexOf('  function canteiro('));
  vm.runInNewContext(textos+batch,env);
  await env.emSerie('jardim_regar',[0,1,2]);
  assert.equal(env.ocupado,false);
  assert.equal(env.st,garden,'reconsulta o estado mesmo após falha');
  assert.equal(events.length,esperado);
  assert.equal(sounds.length,esperado?1:0,'som exige ação confirmada');
  assert.equal(calls.at(-1),'jardim_estado');
  assert(env.msg.includes(esperado+'/3'));
  return {env,calls};
}
(async()=>{
  await conferirLote([{ok:false},{ok:false},{ok:false}],0);
  await conferirLote([{ok:true},{ok:false},{ok:true}],2);
  const interrompido=await conferirLote([{ok:true},new Error('rede'),{ok:true}],1);
  assert.equal(interrompido.calls.length,3,'interrompe mutações após queda de rede e consulta o estado');
  const completo=await conferirLote([{ok:true},{ok:true},{ok:true}],3);
  const anterior=completo.env.st;
  completo.env.rpc=async n=>n==='jardim_estado'?{ok:false}:{ok:true};
  await completo.env.emSerie('jardim_regar',[0]);
  assert.equal(completo.env.st,anterior,'falha de atualização preserva a última visualização');
  assert(completo.env.msg.includes('Feche e abra'));
  let owner='A';
  completo.env.donoJardim=()=>owner;
  completo.env.rpc=async()=>{owner='B';return {ok:true};};
  await completo.env.emSerie('jardim_regar',[0,1]);
  assert.equal(completo.env.st,anterior,'resposta de outra conta não substitui o jardim');

  ctx.hubCardsUI();await new Promise(r=>setTimeout(r,5));
  assert.equal(chamadas.length,0,'sem conta não consulta o servidor');
  ctx.contaJ={nick:'Ana'};resposta=new Error('Could not find the function public.jardim_estado');
  ctx.hubCardsUI();await new Promise(r=>setTimeout(r,5));
  assert.equal(ctx.TW_BLOOM_ON,false,'sem a função no banco o jardim fica desligado (Em breve)');
  ctx.contaJ={nick:'Bia'};resposta={ok:true,canteiros:[]};
  ctx.hubCardsUI();ctx.contaUI();await Promise.resolve();
  assert.equal(chamadas.length,2,'uma consulta por conta mesmo com dois redesenhos');
  assert.equal(ctx.bloomResumo().regar,0);
  ctx.contaJ=null;
  assert.equal(ctx.bloomResumo(),null,'ao sair, o Hub deixa de exibir o jardim da conta');
  const rpcs=[...src.matchAll(/rpc\('([a-z_]+)'/g)].map(m=>m[1]),acoes=[...src.matchAll(/acao\('([a-z_]+)'/g)].map(m=>m[1]);
  assert.deepEqual([...new Set([...rpcs,...acoes])].sort(),['jardim_colher','jardim_estado','jardim_plantar','jardim_regar']);
  assert.ok(!/brs48cr_(?!st)/.test(src),'não cria chaves brs48cr_ novas');
  const sql=fs.readFileSync(path.join(raiz,'supabase/sql/aplicado/20261113_bloom_garden.sql'),'utf8');
  assert.ok(!/stars\s*=\s*stars\s*\+/.test(sql),'o jardim nunca dá ★ no servidor');
  // Toque no desenho, sementes em botões e ações em lote continuam usando só as mesmas 4 RPCs.
  assert.match(src,/data-bloom="semente"/);assert.match(src,/emSerie\('jardim_regar', pendentes\(false\)\)/);
  assert.match(src,/emSerie\('jardim_colher', pendentes\(true\)\)/);assert.match(src,/function tocar\(/);
  console.log('OK: Bloom⭐Garden! — seis idiomas, só RPCs do jardim, desligado sem servidor');
})().catch(e=>{console.error(e);process.exit(1);});
