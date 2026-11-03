'use strict';
// Contratos offline: nenhum RPC real, nenhuma escrita em contas ou SQL de produção.
const assert=require('node:assert/strict');
const vm=require('node:vm');
const html=require('./site-source.js')();
const start=html.indexOf('function contaInicioCorrida(){');
const end=html.indexOf('function contaGasto(',start);
assert(start>=0&&end>start,'Center Run start, pending queue and finish functions found');
const code=html.slice(start,end);
const gate="if(_supabase&&(!contaAuthPronta||(contaAuthUserId&&!contaJ))&&$('tstw').hidden){contaAviso(tr('Aguarde a conta carregar e tente de novo.'));return;}";
assert(html.includes(gate),'authenticated start gate precedes race registration');
assert(html.includes("function contaSessao(sess){\n  contaAuthPronta=true;"),'INITIAL_SESSION releases pending auth gate');
assert(html.indexOf(gate,html.indexOf('function start(e){'))<html.indexOf('contaInicioCorrida();',html.indexOf('function start(e){')),'auth gate runs before server start');
assert(html.includes('id="cr-recompensa"'),'Center Run shows a replaceable server-confirmation field');
const allowed=new Function('_supabase','contaAuthPronta','contaAuthUserId','contaJ','$','contaAviso','tr',gate.replace('return;','return false;')+'return true;');
let warns=0;const args=[{},false,'',null,()=>({hidden:true}),()=>warns++,s=>s];
assert.equal(allowed(...args),false);assert.equal(warns,1);
assert.equal(allowed({},true,'',null,args[4],args[5],args[6]),true);
assert.equal(allowed({},true,'authenticated-user',null,args[4],args[5],args[6]),false);
assert.equal(allowed({},true,'authenticated-user',{id:'A'},args[4],args[5],args[6]),true);

const flush=()=>new Promise(resolve=>setImmediate(resolve));
function fixture(storage=new Map()){
 const calls=[],result={innerHTML:'Aguardando validação do servidor'},field={textContent:'Aguardando validação do servidor',isConnected:true};
 const ctx={
   contaJ:{id:'A'},contaSessaoToken:3,contaRun:null,contaUltimaRun:null,starT:10,best:100,did:'device12345',
   isTestGame:false,toast:'',toastT:0,localStorage:{getItem:k=>storage.has(k)?storage.get(k):null,setItem:(k,v)=>storage.set(k,v)},
   $:id=>id==='res'?result:id==='cr-recompensa'?field:null,tr:s=>s,
   setBest(){},quartetoTalvez(){},hubAposCorrida(){},gachaBonus(){},
   contaAplicar(j,t,skip){if(t===ctx.contaSessaoToken){ctx.starT=j.stars;ctx.best=Math.max(ctx.best,j.best||0);assert.equal(skip,true,'reconciliation does not trigger immediate retry');}},
   finish:()=>Promise.resolve({ok:true,stars:20,best:500,creditadas:10}),
   profile:()=>Promise.resolve({stars:10,best:100}),
   begin:()=>Promise.resolve('server-run')
 };
 ctx.contaRpc=(name,arg)=>{
   calls.push({name,arg});
   if(name==='iniciar_corrida')return ctx.begin();
   if(name==='terminar_corrida')return ctx.finish();
   if(name==='jogador')return ctx.profile();
   throw Error('unexpected RPC '+name);
 };
 vm.runInNewContext(code,ctx);
 return {ctx,calls,result,field,storage};
}
(async()=>{
 // Success updates both server balance and best; never doubles local stars.
 const ok=fixture();ok.ctx.contaRun=Promise.resolve('run-ok');
 ok.ctx.contaFimCorrida(500,15,'Pati',()=>{});await flush();
 assert.equal(ok.ctx.starT,20);assert.equal(ok.ctx.best,500);
 assert.equal(ok.field.textContent,'10 estrelas');
 assert.equal(ok.ctx.contaCorridasLer().length,0);
 assert.equal(ok.calls.filter(c=>c.name==='terminar_corrida').length,1);

 // A stale/unwritable localStorage must not prevent the freshly completed run
 // from reaching the server. The in-memory queue remains available as fallback.
 const staleStorage=new Map([['brs48cr_corridas_pendentes_v1','[]']]);
 const stale=fixture(staleStorage);
 stale.ctx.localStorage.setItem=()=>{throw Error('quota_exceeded');};
 stale.ctx.contaRun=Promise.resolve('new-run-not-in-storage');
 stale.ctx.contaFimCorrida(800,12,'Tsu',()=>{});await flush();
 assert.equal(stale.calls.filter(c=>c.name==='terminar_corrida').length,1,'new run must be submitted even with stale storage');
 assert.equal(stale.calls.find(c=>c.name==='terminar_corrida').arg.p_run,'new-run-not-in-storage');

 // Lost response: retry only after a later recovery signal, using exactly the same UUID.
 const lost=fixture();lost.ctx.finish=()=>Promise.reject(Error('network_offline'));
 lost.ctx.contaRun=Promise.resolve('same-run');
 lost.ctx.contaFimCorrida(56343,1545,'Pati',()=>{});await flush();
 assert.equal(lost.ctx.contaCorridasLer().length,1,'pending result is preserved');
 assert(lost.field.textContent.includes('pendente de sincronização'));
 assert.equal(lost.calls.filter(c=>c.name==='terminar_corrida').length,1,'no immediate retry loop');
 lost.ctx.finish=()=>Promise.resolve({ok:true,stars:100,best:56343,creditadas:90,limite_diario:true});
 lost.ctx.contaRecuperarCorridas();await flush();
 const finals=lost.calls.filter(c=>c.name==='terminar_corrida');
 assert.equal(finals.length,2);
 assert(finals.every(c=>c.arg.p_run==='same-run'),'recovery never starts a fresh race');
 assert.equal(lost.ctx.contaCorridasLer().length,0);
 assert.equal(lost.ctx.starT,100);assert.equal(lost.ctx.best,56343);
 assert(lost.field.textContent.includes('Limite diário'),'daily cap remains server-authoritative');
 lost.ctx.contaRecuperarCorridas();await flush();
 assert.equal(lost.calls.filter(c=>c.name==='terminar_corrida').length,2,'confirmed race is never resubmitted');

 // Pending race survives a page reload; a different signed-in account cannot replay it.
 const awaiting=fixture();awaiting.ctx.finish=()=>Promise.reject(Error('offline'));
 awaiting.ctx.contaRun=Promise.resolve('persisted-id');awaiting.ctx.contaFimCorrida(30000,55,'Tsu',()=>{});await flush();
 const restored=fixture(awaiting.storage);restored.ctx.contaJ={id:'B'};
 restored.ctx.contaRecuperarCorridas();await flush();
 assert.equal(restored.calls.filter(c=>c.name==='terminar_corrida').length,0,'another account cannot use pending race');
 restored.ctx.contaJ={id:'A'};
 restored.ctx.finish=()=>Promise.resolve({ok:true,stars:55,best:30000,creditadas:45});
 restored.ctx.contaRecuperarCorridas();await flush();
 assert.equal(restored.calls.filter(c=>c.name==='terminar_corrida')[0].arg.p_run,'persisted-id');
 assert.equal(restored.ctx.contaCorridasLer().length,0);

 // A definitive rejection (already finished or expired) is not retried or credited again.
 const repeated=fixture();repeated.ctx.contaRun=Promise.resolve('already-finished');
 repeated.ctx.finish=()=>Promise.resolve({ok:false,erro:'corrida_invalida'});
 repeated.ctx.contaFimCorrida(700,5,'Tsu',()=>{});await flush();
 assert.equal(repeated.ctx.contaCorridasLer().length,0);
 repeated.ctx.contaRecuperarCorridas();await flush();
 assert.equal(repeated.calls.filter(c=>c.name==='terminar_corrida').length,1);
 assert.equal(repeated.ctx.starT,10);

 // A failed server start is visible and never creates a recoverable token.
 const noStart=fixture();noStart.ctx.begin=()=>Promise.reject(Error('offline'));
 noStart.ctx.contaInicioCorrida();await flush();
 assert.equal(await noStart.ctx.contaRun,null);
 assert(noStart.ctx.toast.includes('sem autorização'));
 noStart.ctx.contaFimCorrida(100,10,'Tsu',()=>{});await flush();
 assert.equal(noStart.calls.filter(c=>c.name==='terminar_corrida').length,0);
 console.log('✓ Center Run: auth gate, finish recovery, reload, account isolation, daily cap and no duplicate credit');
})().catch(e=>{console.error(e);process.exitCode=1;});
