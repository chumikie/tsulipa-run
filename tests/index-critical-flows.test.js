'use strict';
// Offline behavior tests for account guards, store purchases and save formats.
// No credentials, network calls or production storage are used.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');

async function main(){
function between(start,end){
  const from=html.indexOf(start),to=html.indexOf(end,from+start.length);
  assert.ok(from>=0&&to>from,'Missing source boundaries: '+start+' -> '+end);
  return html.slice(from,to);
}

// Login is allowed only on the game website, and redirects back to this page.
{
  const source=between('function contaEntrar(){','function contaSair(){');
  const env=vm.createContext({
    location:{protocol:'http:',hostname:'localhost',origin:'http://localhost',pathname:'/index.html'},
    _supabase:{auth:{signInWithOAuth:async options=>{env.oauthCalls++;env.oauthOptions=options;}}},
    oauthCalls:0,
    contaAviso:message=>{env.notice=message;},
    tr:value=>value
  });
  vm.runInContext(between('function contaSiteOk(){','// ---------- Caixa de login'),env);
  vm.runInContext(source,env);
  assert.equal(env.contaSiteOk(),true,'HTTP localhost is an allowed development host');
  env.contaEntrar();
  assert.equal(env.oauthOptions.options.redirectTo,'http://localhost/index.html');
  env.location.hostname='usercontent.example';
  env.contaEntrar();
  assert.equal(env.oauthCalls,1,
    'blocked host does not start another OAuth flow');
  assert.match(env.notice,/site do jogo/);
}

// The server decides purchase outcome; local stars and ownership follow its response.
{
  const source=between('function lojaComprar(k, btn, depois){','perfOv.addEventListener(');
  async function purchase(response,storageUnavailable=false){
    const calls=[],writes=[],callbacks=[];
    const env=vm.createContext({
      starT:100,perfDono:[],
      btn:{disabled:false},
      contaRpc:(name,args)=>{calls.push([name,args,env.btn.disabled]);return response instanceof Error?
        Promise.reject(response):Promise.resolve(response);},
      localStorage:{setItem:(key,value)=>{
        if(storageUnavailable)throw new Error('storage blocked');
        writes.push([key,value]);
      }},
      setBest(){},sfx:{hit(){},rank(){}},tr:value=>value,
      depois:(ok,message)=>callbacks.push([ok,message])
    });
    vm.runInContext(source,env);
    await env.lojaComprar('pose_wave',env.btn,env.depois);
    return {env,calls,writes,callbacks};
  }
  const success=await purchase({ok:true,stars:75,visuais:['pose_wave']});
  assert.deepEqual(JSON.parse(JSON.stringify(success.calls)),[['comprar_visual',{p_key:'pose_wave'},true]]);
  assert.equal(success.env.starT,75);
  assert.deepEqual(success.writes,[['brs48cr_st',75]]);
  assert.deepEqual(JSON.parse(JSON.stringify(success.env.perfDono)),['pose_wave']);
  assert.equal(success.callbacks[0][0],true);
  assert.equal(success.env.btn.disabled,true,'successful purchase remains disabled until UI refresh');
  assert.equal(success.calls[0][2],true,'purchase button disables before the request starts');

  const rejected=await purchase({ok:false,erro:'saldo'});
  assert.equal(rejected.env.btn.disabled,false);
  assert.equal(rejected.callbacks[0][0],false);
  assert.match(rejected.callbacks[0][1],/Estrelas insuficientes/);
  assert.deepEqual(rejected.writes,[]);

  const offline=await purchase(new Error('offline'));
  assert.equal(offline.env.btn.disabled,false);
  assert.equal(offline.callbacks[0][0],false);
  assert.match(offline.callbacks[0][1],/Não deu para falar com o servidor/);
  assert.deepEqual(offline.writes,[]);

  const unavailableStorage=await purchase({ok:true,stars:50,visuais:['pose_wave']},true);
  assert.equal(unavailableStorage.env.starT,50,
    'storage failure does not roll back the server-confirmed purchase');
  assert.equal(unavailableStorage.callbacks[0][0],true);
}

// Save keys and the public outfit shape are stable; no account or cloud writes.
{
  const source=between('function saveCu(){','function pick(i){');
  const writes=[];
  const env=vm.createContext({
    CU:{out:'rosa',outcol:'#ff00aa',hat:'laço',gl:'redondo',hair:'#123456',streak:true},
    CH:[
      {out:'azul',outcol:'#0000ff',hat:'',gl:''},
      {out:'verde',outcol:'#00ff00',hat:'',gl:''}
    ],
    localStorage:{setItem:(key,value)=>writes.push([key,value])},
    JSON
  });
  vm.runInContext(source,env);
  env.saveCu();
  assert.deepEqual(writes.map(item=>item[0]),['brs48cr_cu2','brs48cr_ch2']);
  assert.equal(writes[0][1],JSON.stringify(env.CU));
  assert.deepEqual(JSON.parse(writes[1][1]),[
    {out:'azul',outcol:'#0000ff',hat:'',gl:''},
    {out:'verde',outcol:'#00ff00',hat:'',gl:''}
  ]);
  const unavailable=vm.createContext({
    CU:env.CU,CH:env.CH,localStorage:{setItem(){throw new Error('storage blocked');}},JSON
  });
  vm.runInContext(source,unavailable);
  assert.doesNotThrow(()=>unavailable.saveCu(),'unavailable local storage does not break gameplay');
}

console.log('✓ Critical account, purchase and save flows: offline behavior passed');
}

main().catch(error=>{console.error(error);process.exitCode=1;});
