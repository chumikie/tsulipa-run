// Humor do Idol + Desejo do dia + passe do Camarim VIP (tw-humor.js): só local, nunca mexe em estrelas/servidor.
const test = require('node:test'); const assert = require('node:assert'); const fs = require('fs'); const vm = require('vm');
const src = fs.readFileSync(__dirname + '/../tw-humor.js', 'utf8');
function carregar(logado, agora, responder){
  const mem = {}; let rpcs = [];
  const sb = {window:{}, LANG:'pt', Date:class extends Date{ constructor(...a){ super(...(a.length ? a : [agora])); } static now(){ return agora; } }, Math, JSON,
    localStorage:{getItem:k => mem[k] || null, setItem:(k, v) => { mem[k] = String(v); }},
    document:{querySelector:() => ({})}, contaJ: logado ? {nick:'Teste'} : null, Promise};
  sb.window.contaRpc = (n, a) => { rpcs.push(n); return responder ? responder(n,a) : Promise.resolve({ok:true}); };
  sb.contaRpc = sb.window.contaRpc;
  vm.runInNewContext(src, sb);
  return {H:sb.window.TW_HUMOR, sb, mem, rpcs:() => rpcs};
}
const T0 = new Date(2026, 10, 15, 12).getTime();
test('desejo do dia é o mesmo o dia inteiro e cumprir libera o passe VIP de hoje', () => {
  const {H} = carregar(true, T0);
  const d = H.desejo(); assert.ok(d.texto && d.icone && !d.feito);
  assert.deepEqual(H.desejo().k, d.k, 'estável no mesmo dia');
  assert.equal(H.vipHoje(), false);
  H.evento(d.ev === 'run' ? 'karaoke' : 'run'); assert.equal(H.desejo().feito, false, 'outro jogo não cumpre');
  H.evento(d.ev); assert.equal(H.desejo().feito, true); assert.equal(H.vipHoje(), true); assert.equal(H.estado().serie, 1);
});
test('visitante só recebe desejos que dá para cumprir sem conta', () => {
  for(let dia = 0; dia < 40; dia++){ const {H} = carregar(false, T0 + dia * 864e5); assert.ok(['run', 'cafe', 'battle', 'studio', 'handshake', 'mapa', 'frase'].includes(H.desejo().ev), H.desejo().ev); }
});
test('barrinhas ficam entre 5 e 100 e o tempo descansa a energia', () => {
  const {H} = carregar(true, T0);
  for(let i = 0; i < 30; i++) H.evento('battle');
  const e = H.estado(); for(const b of H.barras){ assert.ok(e[b] >= 5 && e[b] <= 100, b); }
  assert.equal(e.energia, 5, 'muitos shows cansam');
  assert.ok(/^#/.test(H.cor()));
});
test('jogar de verdade (RPC de fim de partida) conta; o arquivo não chama nenhuma RPC sozinho', async () => {
  const c = carregar(true, T0); const antes = c.H.estado().diversao;
  await c.sb.window.contaRpc('kt_run_finish', {}); await new Promise(r => setTimeout(r, 5));
  assert.ok(c.H.estado().diversao > antes);
  assert.deepEqual(c.rpcs(), ['kt_run_finish']);
  assert.ok(!/contaRpc\(['"]/.test(src), 'sem chamadas próprias ao servidor');
  assert.ok(!/starT|gastar_estrelas|ganhar_minijogo/.test(src), 'não mexe em estrelas');
});

function escolher(c,ev,logado=true){
  c.H.desejo();const chave='brs48cr_humor_v1:'+(logado?'nick:Teste':'visitante');const e=JSON.parse(c.mem[chave]);
  e.desejo.k=ev==='frase'?'oi':ev;e.desejo.ev=ev;e.desejo.feito=false;e.desejo.logado=logado;
  c.mem[chave]=JSON.stringify(e);
}
test('abrir qualquer destino não cumpre desejo nem altera humor, VIP ou recados',()=>{
  for(const logado of [true,false]) for(const ev of ['run','karaoke','sora','cafe','battle','studio','handshake','bloom','mapa','frase']){
    const c=carregar(logado,T0);escolher(c,ev,logado);const antes=c.H.estado();
    c.H.abriu(ev);assert.equal(c.H.desejo().feito,false,ev);assert.equal(c.H.vipHoje(),false);
    assert.equal(c.H.mensagensNovas(),0);assert.deepEqual(c.H.estado(),antes);
    c.H.evento(ev,true);assert.equal(c.H.desejo().feito,false,'efeito fraco não é conclusão');
  }
});
test('treino só conclui após ação local e não substitui validação de conta',()=>{
  for(const ev of ['run','cafe','battle','studio','handshake','frase']){
    const c=carregar(false,T0);escolher(c,ev,false);c.H.treino(ev);
    assert.equal(c.H.desejo().feito,true);assert.equal(c.H.vipHoje(),true);
    const conta=carregar(true,T0);escolher(conta,ev);conta.H.treino(ev);assert.equal(conta.H.desejo().feito,false);
  }
});
test('RPC vazia, rejeitada ou sem ok explícito não cumpre desejo',async()=>{
  for(const resposta of [null,{}, {ok:false}, {erro:'falhou'}]){
    const c=carregar(true,T0,()=>Promise.resolve(resposta));escolher(c,'studio');
    await c.sb.window.contaRpc('studio_clique',{});assert.equal(c.H.desejo().feito,false);assert.equal(c.H.vipHoje(),false);
  }
  const c=carregar(true,T0,()=>Promise.reject(Error('offline')));escolher(c,'studio');
  await c.sb.window.contaRpc('studio_clique',{}).catch(()=>{});assert.equal(c.H.desejo().feito,false);
});
test('Café exige shake correto confirmado; finalizar turno vazio não conta',async()=>{
  for(const nome of ['cafe_run_etapa','cafe_run_etapa2','cafe_concluir','cafe_run_finalizar'])for(const certo of [false,true]){
    const c=carregar(true,T0,()=>Promise.resolve({ok:true,confirmado:true,certo}));escolher(c,'cafe');
    await c.sb.window.contaRpc(nome,{});assert.equal(c.H.desejo().feito,nome!=='cafe_run_finalizar'&&certo);
  }
});
test('Battle aguarda show; dizer oi exige oi enviado; ping periódico não conta',async()=>{
  const c=carregar(true,T0);escolher(c,'battle');await c.sb.window.contaRpc('battle_jogar',{});
  assert.equal(c.H.desejo().feito,false);c.H.evento('battle');assert.equal(c.H.desejo().feito,true);
  for(const frase of [null,'lindo','oi']){
    const s=carregar(true,T0);escolher(s,'frase');await s.sb.window.contaRpc('presenca_ping',{p_frase:frase});
    assert.equal(s.H.desejo().feito,frase==='oi');
  }
});
test('resposta atrasada de outra sessão não libera VIP',async()=>{
  let concluir;const c=carregar(true,T0,()=>new Promise(r=>concluir=r));escolher(c,'studio');
  const p=c.sb.window.contaRpc('studio_clique',{});c.sb.contaJ={nick:'Outra'};concluir({ok:true});await p;
  assert.equal(c.H.desejo().feito,false);assert.equal(c.H.vipHoje(),false);
});
test('passeio conta só ao chegar após caminhar; reduzir movimento também funciona',()=>{
  const mapa=fs.readFileSync(__dirname+'/../tw-mapa.js','utf8');
  for(const ida of [1,.01]){
    const eventos=[],c={meuPasseio:{x0:100,x1:200,t0:0,ida},MEU_PARA:3.2,cena:'rua',window:{TW_HUMOR:{evento:e=>eventos.push(e)}}};
    vm.runInNewContext(mapa.slice(mapa.indexOf('  function passeioDoToque('),mapa.indexOf('  var ESCALA_RUA=')),c);
    c.passeioDoToque({},ida/2);assert.equal(eventos.length,0);
    c.passeioDoToque({},ida+.001);c.passeioDoToque({},ida+.002);assert.deepEqual(eventos,['mapa']);
    c.meuPasseio={x0:100,x1:105,t0:0,ida};c.passeioDoToque({},ida+.001);assert.equal(eventos.length,1);
  }
});

test('clique real do TsuPhone abre Humor, mostra ajuda em seis idiomas e volta',()=>{
  const index=fs.readFileSync(__dirname+'/../index.html','utf8'),sala=fs.readFileSync(__dirname+'/../pet-sala.js','utf8');
  for(const lang of ['pt','en','es','id','th','ja']){
    const c=carregar(true,T0),s=c.sb;let clique;
    const corpo={innerHTML:''},phone={addEventListener:(nome,fn)=>{clique=fn;}};
    s.$=id=>id==='petPhone'?phone:corpo;s.LANG=lang;s.petPhoneOpen=true;s.petPhoneTela='home';
    s.PET_PHONE_APPS={pt:[]};s.escHtml=x=>String(x);s.petPhoneSom=()=>{};
    s.document.getElementById=()=>null;s.document.createElement=()=>({});s.document.head={appendChild(){}};
    s.petPhoneVoltar=()=>{s.petPhoneTela='home';};
    vm.runInNewContext(sala.slice(sala.indexOf('function petPhoneRender(){'),sala.indexOf('//←petPhoneSom')),s);
    vm.runInNewContext(sala.slice(sala.indexOf('function petPhoneTelaAbrir(k){'),sala.indexOf('//←petPhoneAgendaCarregar')),s);
    const inicio=index.indexOf("$('petPhone').addEventListener('click'");
    vm.runInNewContext(index.slice(inicio,index.indexOf("document.addEventListener('visibilitychange'",inicio)),s);
    const click=k=>clique({target:{closest:()=>({dataset:{phone:k}})}});
    const antes=c.H.desejo();click('humor');
    assert.equal(s.petPhoneTela,'humor',lang);assert.match(corpo.innerHTML,/class="twh-app"/);
    assert.equal((corpo.innerHTML.match(/role="meter"/g)||[]).length,4);
    for(const key of ['intro','como','regra','efeitos','corGuia','energiaAjuda','diversaoAjuda','brilhoAjuda','amizadeAjuda']){
      assert.notEqual(c.H.t(key),key);assert.ok(corpo.innerHTML.includes(c.H.t(key)),lang+' '+key);
    }
    assert.equal(c.H.desejo().feito,antes.feito,'ler não cumpre desejo');assert.equal(c.H.vipHoje(),false);
    click('voltar');assert.equal(s.petPhoneTela,'home');
  }
});

test('atalho Bloom abre o jardim e só a ação confirmada cumpre o desejo',async()=>{
  const c=carregar(true,T0,()=>Promise.resolve({ok:true}));
  escolher(c,'bloom'); const a=[];
  c.sb.window.petPhoneOpen=true;
  c.sb.window.petClose=()=>a.push('fechou');
  c.sb.window.bloomAbrir=()=>a.push('jardim');
  assert.match(c.H.rotuloRota('bloom'),/Ir ao Bloom/);
  assert.equal(c.H.rotaDesejo(),true);
  assert.deepEqual(a,['fechou','jardim']);
  assert.equal(c.H.desejo().feito,false);
  await c.sb.window.contaRpc('jardim_colher',{});
  assert.equal(c.H.desejo().feito,true);
  assert.equal(c.H.rotaDesejo(),false);
});
