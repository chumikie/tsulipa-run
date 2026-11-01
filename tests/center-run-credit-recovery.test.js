'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const start=html.indexOf('function contaFimCorrida('),end=html.indexOf('function contaGasto(',start);
assert(start>=0&&end>start,'Center Run reward function found');
const code=html.slice(start,end);
const gate="if(_supabase&&(!contaAuthPronta||(contaAuthUserId&&!contaJ))&&$('tstw').hidden){contaAviso(tr('Aguarde a conta carregar e tente de novo.'));return;}";
assert(html.includes(gate),'authenticated start gate precedes race registration');
assert(html.includes("function contaSessao(sess){\n  contaAuthPronta=true;"),'INITIAL_SESSION releases pending auth gate');
assert(html.indexOf(gate,html.indexOf('function start(e){'))<html.indexOf('contaInicioCorrida();',html.indexOf('function start(e){')),'gate runs before iniciar_corrida');
const allowed=new Function('_supabase','contaAuthPronta','contaAuthUserId','contaJ','$','contaAviso','tr',gate.replace('return;','return false;')+'return true;');
let warns=0;const args=[{},false,'',null,()=>({hidden:true}),()=>warns++,s=>s];
assert.equal(allowed(...args),false);assert.equal(warns,1);
assert.equal(allowed({},true,'',null,args[4],args[5],args[6]),true,'signed-out guest may play');
assert.equal(allowed({},true,'authenticated-user',null,args[4],args[5],args[6]),false,'signed-in profile must load');
assert.equal(allowed({},true,'authenticated-user',{id:'A'},args[4],args[5],args[6]),true);
async function scenario(response,delay){
 const calls=[],result={innerHTML:'Aguardando validação do servidor'},ctx={contaJ:{id:'A'},contaSessaoToken:3,contaRun:Promise.resolve('run1'),contaUltimaRun:null,starT:10,did:'d',localStorage:{setItem(){}},$:()=>result,tr:s=>s,setBest(){},quartetoTalvez(){},hubAposCorrida(){},contaAplicar(j,token){if(token===ctx.contaSessaoToken)ctx.starT=j.stars}};
 let pendingProfile=null;let refreshes=0;
 ctx.contaRpc=(name)=>{calls.push(name);if(name==='terminar_corrida')return response;return delay?new Promise(resolve=>{pendingProfile=resolve}):Promise.resolve({stars:17,best:12,nick:'A'});};
 new Function('c',`with(c){${code};contaFimCorrida(400,12,'Idol',()=>c.refreshes=(c.refreshes||0)+1);}`)(ctx);
 await new Promise(resolve=>setImmediate(resolve));
 return {calls,result,ctx,complete(j){if(pendingProfile)pendingProfile(j);},async flush(){await new Promise(resolve=>setImmediate(resolve));}};
}
(async()=>{
 const lost=await scenario(Promise.reject(Error('response_lost')),false);
 assert.deepEqual(lost.calls,['terminar_corrida','jogador']);assert.equal(lost.ctx.starT,17);
 assert(lost.result.innerHTML.includes('Saldo conferido na nuvem'),'late server credit is reconciled');
 assert.equal(lost.calls.filter(x=>x==='terminar_corrida').length,1,'finalization is never retried');
 const switched=await scenario(Promise.reject(Error('response_lost')),true);
 switched.ctx.contaSessaoToken++;switched.ctx.contaJ={id:'B'};switched.complete({stars:19,nick:'A'});await switched.flush();
 assert.equal(switched.ctx.starT,10,'response from previous account ignored');
 const missing=await scenario(Promise.resolve(null),false);
 assert(missing.result.innerHTML.includes('Saldo conferido na nuvem')||missing.result.innerHTML.includes('Recompensa não validada'));
 console.log('✓ Center Run: auth gate, lost response reconciliation, no duplicate finalization and account isolation');
})().catch(e=>{console.error(e);process.exitCode=1;});
