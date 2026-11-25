'use strict';
const test=require('node:test'), assert=require('node:assert/strict'), fs=require('node:fs'), path=require('node:path'), vm=require('node:vm');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');
test('Sora: liberar um dedo conserva o outro e reset limpa todos',()=>{
  const s=read('sora-jump.html'), a=s.indexOf('var soraKeyL = false'), b=s.indexOf('function soraTouchReset(){',a);
  assert.ok(a>=0&&b>a);
  const end=s.indexOf('}',b)+1, ctx={};vm.runInNewContext(s.slice(a,end),ctx);
  ctx.soraPointers.set(1,-1);ctx.soraTouchUpdate();assert.equal(ctx.soraTouchDir,-1);
  ctx.soraPointers.set(2,1);ctx.soraTouchUpdate();assert.equal(ctx.soraTouchDir,1);
  ctx.soraTouchRelease(2);assert.equal(ctx.soraTouchDir,-1);
  ctx.soraTouchRelease(99);assert.equal(ctx.soraTouchDir,-1);
  ctx.soraTouchReset();assert.equal(ctx.soraTouchDir,0);assert.equal(ctx.soraPointers.size,0);
});
test('Handshake: resposta do treino manual espera confirmação',()=>{
  const s=read('handshake.js');
  assert.match(s,/!hs\.leituraManual && hs\.fase === 'resposta' && dt > 80/);
  assert.match(s,/hs\.leituraManual && hs\.fase === 'resposta'.*data-hs-avancar/);
  assert.match(s,/else if\(hs\.fase==='resposta'\)\{if\(hs\.hype<=0\)hsFim\(\);else hsProxima\(\);\}/);
});
test('Studio: as três fases preservam a proporção do canvas 480 × 680',()=>{
  const css=read('hub-polish.css');
  assert.match(css,/#studioVisor\[data-fase="monta"\] #studioCv[^{}]*\{width:min\(100%,[^}]*height:auto;aspect-ratio:12\/17/);
  assert.match(css,/#studioVisor\[data-fase="foto"\] #studioCv\{width:min\(100%,[^}]*height:auto;aspect-ratio:12\/17/);
});

test('Bloom: caminho e intervalos decorativos não acionam canteiros',()=>{
  const s=read('bloom.js'), a=s.indexOf('function canteiroNoToque('), b=s.indexOf('function montarOv()',a);
  const ctx={canteiro:()=>null};vm.runInNewContext(s.slice(a,b),ctx);
  assert.equal(ctx.canteiroNoToque(100,328,400),0);
  assert.equal(ctx.canteiroNoToque(273,266,400),1);
  assert.equal(ctx.canteiroNoToque(359,328,400),-1);
  assert.equal(ctx.canteiroNoToque(100,180,400),-1);
  assert.equal(ctx.canteiroNoToque(100,390,400),-1);
});
test('Café: cobertura opcional pode ser retirada e os ingredientes indicam seleção',()=>{
  const s=read('cafe.js'), a=s.indexOf('function cfEscolher('),b=s.indexOf('// O reencontro',a);
  const ctx={cf:{fase:'pedido',monta:{base:0,cob:1,enf:2,doce:-1}},cfUI(){},cfSom(){},$:()=>({querySelector:()=>null})};
  vm.runInNewContext(s.slice(a,b),ctx);ctx.cfEscolher('cob',1);assert.equal(ctx.cf.monta.cob,-1);
  ctx.cfEscolher('cob',1);assert.equal(ctx.cf.monta.cob,1);assert.match(s,/aria-pressed="' \+ \(m\[tipo\] === i\)/);
});
test('Battle: teclado ignora repetição automática e show reposiciona o palco',()=>{
  const s=read('battle.js');assert.match(s,/if\(!e.repeat\)agitar\(\)/);assert.match(s,/render\(\);mostrarPalco\(\);/);
});

test('Camarim: cancelar arrasto restaura a posição e não grava',()=>{
 const s=read('pet-sala.js'),a=s.indexOf('function petArrumoSoltar('),b=s.indexOf('//←petArrumoModo',a);
 const A={chao:{abajur:90}},ctx={petArrumoLer:()=>A,petArrastando:{tipo:'chao',k:'abajur',antes:70,dono:'a'},petArrumoDono:'a',petBg:{},petArrumoSalvar(){throw Error('cancelamento não grava');}};
 vm.runInNewContext(s.slice(a,b),ctx);ctx.petArrumoSoltar({type:'pointercancel'});assert.equal(A.chao.abajur,70);assert.equal(ctx.petArrastando,null);
});
test('Mapa e Center preservam o dono do gesto',()=>{
 const m=read('tw-mapa.js'),h=read('index.html');
 assert.match(m,/e.pointerId===toque.id/);assert.match(h,/e.pointerId===crPointerPulo/);
 assert.match(h,/e.pointerId!==petArrumoPointer/);
});
test('Karaoke preserva rolagem ao reconstruir catálogo',()=>{
 const s=read('karaoke-lista.js');assert.match(s,/gradeAnterior\?gradeAnterior.scrollTop:0/);assert.match(s,/gradeNova.scrollTop=rolagem/);
});

test('Camarim: sair da decoração com gesto ativo grava apenas o arranjo anterior',()=>{
 const s=read('pet-sala.js'),a=s.indexOf('function petArrumoSoltar('),b=s.indexOf('//←petArrumoPadrao',a);
 const A={chao:{abajur:90}},salvos=[],soltos=[],ctx={petArrumoLer:()=>A,petArrumando:true,petArrumoAnterior:null,petArrastando:{tipo:'chao',k:'abajur',antes:70,dono:'a'},petArrumoDono:'a',petArrumoPointer:8,petCv:{style:{},releasePointerCapture:id=>soltos.push(id)},petBg:{},petArrumoSalvar(){salvos.push(A.chao.abajur);}};
 vm.runInNewContext(s.slice(a,b),ctx);ctx.petArrumoModo(false);assert.deepEqual(salvos,[70]);assert.deepEqual(soltos,[8]);assert.equal(ctx.petArrumoPointer,null);assert.equal(ctx.petArrumando,false);
});
test('Battle: Enter repetido no botão de lightstick não gera cliques automáticos',()=>{
 const s=read('battle.js');assert.match(s,/if\(e.repeat&&alvo.matches\('\[data-battle="agitar"\]'\)\)e.preventDefault\(\)/);
});

test('Center: teclado, toque e pausa não duplicam nem cancelam o comando do outro',()=>{
 const s=read('index.html'),a=s.indexOf('var crPointerPulo=null,crTeclasPulo='),b=s.indexOf("document.addEventListener('keydown',crPuloTecla);",a);
 assert.ok(a>=0&&b>a);let saltos=0,prev=0;
 const ctx={state:'play',paused:false,held:false,crPuloGuardado:9,crPuloSegura:8,jump(){saltos++;ctx.held=true;}};
 vm.runInNewContext(s.slice(a,b),ctx);
 const key=(code,extra={})=>({code,target:{tagName:'BODY'},preventDefault(){prev++;},...extra});
 ctx.crPuloTecla(key('Space'));ctx.crPuloPointer({pointerId:3});assert.equal(saltos,1);
 ctx.crPuloSoltarTecla(key('Space'));assert.equal(ctx.held,true);
 ctx.crPuloSoltarPointer({pointerId:4});assert.equal(ctx.held,true);
 ctx.crPuloSoltarPointer({pointerId:3});assert.equal(ctx.held,false);
 ctx.crPuloPointer({pointerId:5});ctx.crPuloTecla(key('ArrowUp'));assert.equal(saltos,2);
 ctx.crPuloSoltarPointer({pointerId:5});assert.equal(ctx.held,true);
 ctx.crPuloTecla(key('ArrowUp',{repeat:true}));assert.equal(saltos,2);
 ctx.crPuloLimpar();assert.equal(ctx.held,false);assert.equal(ctx.crPuloGuardado,0);assert.equal(ctx.crPuloSegura,0);assert.equal(ctx.crPuloLivre(),true);
 const n=prev;ctx.crPuloTecla(key('Space',{target:{tagName:'TEXTAREA'},repeat:true}));assert.equal(prev,n);
 ctx.paused=true;ctx.crPuloPointer({pointerId:6});ctx.crPuloTecla(key('Space'));assert.equal(saltos,2);assert.equal(ctx.crPuloLivre(),true);
 ctx.paused=false;ctx.crPuloPointer({pointerId:7,button:2});assert.equal(saltos,2);
 assert.match(read('centerrun.js'),/if\(v&&!paused&&typeof crPuloLimpar==='function'\)crPuloLimpar\(\)/);
});

test('Duo: reset de cena não herda impulso de uma pose anterior',()=>{
 const s=read('duo.js'),t=read('duo-tela.js');assert.match(s,/if\(p < 0 \|\| p >= 1\) return 0/);assert.match(t,/duoBalao = duoPulo = null; duoT = 0/);
});
test('Handshake: resposta de recuperação não cruza sessão nem apaga partida mais recente',async()=>{
 const s=read('handshake.js'),a=s.indexOf('function hsRecuperar(){'),b=s.indexOf('function hsContaMudou(',a);let raw=JSON.stringify({nick:'A',sessao:'antiga',respostas:[]}),premios=0,resolveEstado,resolveFim;
 const ctx={contaJ:{nick:'A'},hs:{},contaSessaoToken:1,hsMemChave:()=> 'A',localStorage:{getItem:()=>raw,removeItem(){raw=null;}},contaRpc:()=>new Promise(r=>resolveEstado=r),hsFinalizarNoServidor:()=>new Promise(r=>resolveFim=r),hsReceberPremio(){premios++;}};
 vm.runInNewContext(s.slice(a,b),ctx);ctx.hsRecuperar();ctx.contaSessaoToken=2;resolveEstado({ok:true,entregue:true});resolveFim({ok:true});await Promise.resolve();assert.equal(premios,0);assert.ok(raw);
 ctx.hsRecuperar();raw=JSON.stringify({nick:'A',sessao:'nova',respostas:[]});resolveFim({ok:true});resolveEstado({ok:false});await Promise.resolve();assert.equal(premios,1);assert.match(raw,/nova/);
});

test('Center: reset inicial é seguro antes de inicializar o conjunto de teclas',()=>{
 const s=read('index.html'),a=s.indexOf('function crPuloLimpar(){'),b=s.indexOf('function crPuloTecla(',a);
 assert.ok(a>=0&&b>a);const ctx={crPointerPulo:undefined,crTeclasPulo:undefined,held:true};
 vm.runInNewContext(s.slice(a,b),ctx);ctx.crPuloLimpar();assert.equal(ctx.held,false);assert.equal(ctx.crPointerPulo,null);
});

test('Gacha: consulta anterior não substitui os cards da sessão atual',async()=>{
 const s=read('gacha.js'),a=s.indexOf('function gachaCardsCarregar(){'),b=s.indexOf('\n}',a)+2;
 let dono='A',reqs=[],desenhados=[];const box={innerHTML:'card A'},ctx={gachaCardsDono:'A',gachaCardsReq:0,cardsMem:{gachaCards:[1]},contaJ:{nick:'A'},$:id=>id==='gachaCards'?box:{},gachaContaAtual:()=>dono,tr:s=>s,escHtml:s=>s,contaRpc:()=>new Promise(r=>reqs.push(r)),cardsHtml:L=>L.join(','),cardsDesenhar:L=>desenhados.push(L)};
 vm.runInNewContext(s.slice(a,b),ctx);ctx.gachaCardsCarregar();dono='B';ctx.gachaCardsCarregar();assert.doesNotMatch(box.innerHTML,/card A/);reqs[0](['A']);reqs[1](['B']);await Promise.resolve();assert.equal(box.innerHTML,'B');assert.equal(desenhados.length,1);
});
test('Agenda: falha de conexão não equivale a lista vazia',()=>{
 const s=read('pet-sala.js'),a=s.indexOf('function petPhoneAgendaHtml(){'),b=s.indexOf('//←petPhoneFotoLimpar',a),ctx={contaJ:{nick:'A'},petPhoneAgendaDono:'A',petPhoneContaChave:()=> 'A',petPhoneAgendaDados:false,escHtml:s=>s,tr:s=>s};
 vm.runInNewContext(s.slice(a,b),ctx);assert.match(ctx.petPhoneAgendaHtml(),/servidor/);ctx.petPhoneAgendaDados=[];assert.match(ctx.petPhoneAgendaHtml(),/Nenhum compromisso/);
});
