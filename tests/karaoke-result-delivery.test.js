/* Karaoke⭐Time! — confirmação online sem consumir duas tentativas ou tickets. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const html = fs.readFileSync(path.join(__dirname, '..', 'karaoke-time.html'), 'utf8');
const onlineSource = fs.readFileSync(path.join(__dirname, '..', 'karaoke-online.js'), 'utf8');
assert(onlineSource.includes('window.KaraokeOnlineFactory=function('), 'fábrica da ponte de ranking encontrada');
assert(html.includes('id="ktResultDelivery"') && html.includes('id="ktDeliveryRecovery"'), 'estados acessíveis no resultado e na sala');
const RUN = '77777777-7777-4777-8777-777777777777';
const SCORE = {score:56343,hits:88,attempts:100,combo:38,totalNotes:100,song:'duo'};
const key = 'kt_online_finish_v1:patiliri';
const flush = async () => { for (let i=0;i<12;i++) await Promise.resolve(); };
function harness(map, finish) {
  let currentOwner='patiliri';
  const calls=[], tickets=[], ui=new Map(), notices=[];
  const get=id => {
    if(!ui.has(id))ui.set(id,{hidden:true,textContent:'',onclick:null});
    return ui.get(id);
  };
  const account={
    ativo:()=>true,
    sessionKey:()=>currentOwner,
    iniciar:()=>Promise.resolve({ok:true,run:RUN,used:1,tickets:2}),
    terminar:(id,result)=>{calls.push({id,result});return finish(id,result);},
    ranking:()=>Promise.resolve({semana:'2026-11-01',fim:'2026-11-07',score:[],combo:[],acertos:[],usados:1,tickets:2})
  };
  const window={
    parent:{twKaraokeOnline:account,ktTickets:{completeRun:id=>tickets.push(id)}},
    ktShowAdmissionPending:false
  };
  const localStorage={
    getItem:k=>map.get(k)||null,
    setItem:(k,v)=>map.set(k,v),
    removeItem:k=>map.delete(k)
  };
  const context={window,localStorage,document:{documentElement:{classList:{contains:name=>name==='kt-no-site'}}},
    LANG:'pt',$:get,krAviso:s=>notices.push(s),CH:[{}],KaraokeAvatar:{draw:()=>{}}};
  vm.runInNewContext(onlineSource,context);
  window.ktOnline=window.KaraokeOnlineFactory(get,context.krAviso,[{}],{draw:()=>{}},null,'pt');
  return {online:window.ktOnline,get,calls,tickets,notices,setOwner:x=>currentOwner=x};
}
async function start(h) {
  let launched=0;
  h.online.gate(()=>launched++,false);
  await flush();
  assert.equal(launched,1,'apresentação autorizada uma vez');
}
(async()=>{
  // 1. A interface só confirma após o retorno positivo do Supabase.
  {
    const map=new Map();
    let resolve;
    const h=harness(map,()=>new Promise(r=>resolve=r));
    await start(h);h.online.finish(SCORE);h.online.showResult(true);
    assert.match(h.get('ktResultDelivery').textContent,/Aguardando confirmação/);
    assert.equal(JSON.parse(map.get(key)).length,1,'cópia recuperável antes da RPC');
    await flush();resolve({ok:true,ranked:true});
    await flush();
    assert.match(h.get('ktResultDelivery').textContent,/confirmada pelo Supabase/);
    assert.equal(map.has(key),false,'recibo removido após confirmação');
    assert.deepEqual(h.tickets,[RUN],'ticket conciliado uma única vez');
  }
  // 2. A perda de conexão preserva o mesmo UUID; uma nova tentativa não cria um show.
  {
    const map=new Map();let attempt=0;
    const h=harness(map,()=>++attempt===1?Promise.reject(Error('offline')):Promise.resolve({ok:true,ranked:true}));
    await start(h);h.online.finish(SCORE);h.online.showResult(true);await flush();
    assert.match(h.get('ktResultDelivery').textContent,/Aguardando confirmação/);
    assert.equal(JSON.parse(map.get(key))[0].id,RUN);
    h.get('ktResultRetry').onclick();await flush();
    assert.equal(h.calls.length,2);
    assert.equal(h.calls[0].id,h.calls[1].id,'reenvio da mesma partida');
    assert.equal(map.has(key),false);
    assert.deepEqual(h.tickets,[RUN]);
  }
  // 3. A confirmação pendente sobrevive a um reload e é recuperada uma vez.
  {
    const map=new Map(),broken=harness(map,()=>Promise.reject(Error('timeout')));
    await start(broken);broken.online.finish(SCORE);await flush();
    const restored=harness(map,()=>Promise.resolve({ok:true,ranked:true}));
    restored.online.load(true);await flush();
    assert.equal(restored.calls.length,1);
    assert.equal(restored.calls[0].id,RUN);
    assert.equal(map.has(key),false);
    restored.online.load(true);await flush();
    assert.equal(restored.calls.length,1,'nenhum reenvio após confirmação');
  }
  // 4. "run" significa estado desconhecido, NUNCA sucesso presumido.
  {
    const map=new Map(),h=harness(map,()=>Promise.resolve({ok:false,reason:'run'}));
    await start(h);h.online.finish(SCORE);h.online.showResult(true);await flush();
    assert.match(h.get('ktResultDelivery').textContent,/não confirmou/);
    assert.equal(JSON.parse(map.get(key))[0].state,'uncertain');
    h.online.load(true);await flush();
    assert.equal(h.calls.length,1,'recibo incerto não gera reenvio automático');
    assert.equal(h.tickets.length,0);
  }
  // 5. Resultado inválido não vira recorde nem é reenviado.
  {
    const map=new Map(),h=harness(map,()=>Promise.resolve({ok:false,reason:'invalid'}));
    await start(h);h.online.finish(SCORE);h.online.showResult(true);await flush();
    assert.match(h.get('ktResultDelivery').textContent,/rejeitou/);
    assert.equal(map.has(key),false);
    assert.deepEqual(h.tickets,[RUN],'mantém a conciliação de ticket existente');
  }
  // 6. Mudança de conta durante a RPC não exibe sucesso nem concilia o ticket da outra.
  {
    const map=new Map();let resolve;
    const h=harness(map,()=>new Promise(r=>resolve=r));
    await start(h);h.online.finish(SCORE);h.online.showResult(true);
    await flush();h.setOwner('outra-conta');resolve({ok:true,ranked:true});await flush();
    assert.equal(h.tickets.length,0);
    assert.doesNotMatch(h.get('ktResultDelivery').textContent,/confirmada pelo Supabase/);
    assert.equal(map.has(key),false,'a confirmação remota remove somente o recibo da conta original');
  }
  // 7. Cancelamento segue o fluxo antigo, sem pontuação e sem criar recibo.
  {
    const map=new Map(),h=harness(map,()=>Promise.resolve({ok:true,ranked:false}));
    await start(h);h.online.finish(null);await flush();
    assert.equal(map.has(key),false);
    assert.equal(h.calls[0].result,null);
    assert.equal(h.tickets.length,0);
  }
  console.log('karaoke-result-delivery: 7 casos OK');
})().catch(e=>{console.error(e);process.exitCode=1;});
