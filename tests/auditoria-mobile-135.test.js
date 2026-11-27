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

test('Handshake: pergunta de cor sem cronômetro no treino manual',()=>{
 const s=read('handshake.js'),a=s.indexOf("else if(hs.fase === 'quizcor'){",s.indexOf('function hsUI(){')),b=s.indexOf("else if(hs.fase === 'lembrar')",a);assert.ok(a>=0&&b>a);assert.match(s.slice(a,b),/hs\.leituraManual\?'':'<div class="hstempo">/);
});
test('Mural: nota de publicação antiga não interrompe o desenho da Polaroid',()=>{
 const s=read('studio.js'),a=s.indexOf('function polaroid('),b=s.indexOf('window.studioPolaroid',a);const textos=[];
 const x={fillRect(){},save(){},beginPath(){},rect(){},clip(){},translate(){},restore(){},fillText(t){textos.push(t);}};
 const ctx={cena(){}};vm.runInNewContext(s.slice(a,b),ctx);
 for(const est of [9,-2,2.5,NaN,3])ctx.polaroid({width:240,height:300,getContext:()=>x},{},{},est,'',1);
 assert.deepEqual(textos,['⭐⭐⭐','☆☆☆','⭐⭐☆','☆☆☆','⭐⭐⭐']);
});

test('Moon Duo: hitbox de cada Idol acompanha a escala e escolhe o centro mais próximo',()=>{
 const s=read('duo.js'),a=s.indexOf('function duoAlvoToque('),b=s.indexOf('function duoRender(',a),ctx={};vm.runInNewContext(s.slice(a,b),ctx);
 const q={eu:200,gu:400};assert.equal(ctx.duoAlvoToque(400,120,500,q,6,8),'gu');assert.equal(ctx.duoAlvoToque(200,120,500,q,6,8),'');assert.equal(ctx.duoAlvoToque(204,460,500,q,6,8),'eu');assert.equal(ctx.duoAlvoToque(390,530,500,q,6,8),'');
 assert.equal(ctx.duoAlvoToque(270,400,500,{eu:200,gu:280},6,6),'gu');
});
test('Mapa: passadas têm fase individual e respeitam movimento reduzido',()=>{
 const s=read('tw-mapa.js');assert.match(s,/frame=reduzMov\?0:tm\*60\+q.i\*13/);assert.match(s,/drawChar\(c,0,0,q.mov&&!reduzMov\?1:0,expressao,false\)/);
});

test('Studio: enquadramento de objeto inclui microfone e lightstick',()=>{
 const s=read('studio.js');assert.match(s,/comObjeto = !!e.objeto && e.objeto !== 'nenhum' && e.objeto !== 'balao'/);assert.match(s,/tm \* 60, quadro, comObjeto\)/);
});
test('Camarim: respiração e balanço das pernas respeitam movimento reduzido',()=>{
 const s=read('pet-sala.js');const pernas=s.slice(s.indexOf('var raiz = q.x'),s.indexOf('// Sapatos na ponta'));
 assert.ok(pernas.includes('var sola = PET_FLOOR - Math.max(0,-visual.rot)'));
 assert.doesNotMatch(pernas,/petT|Math\.sin|respira/);
 assert.ok(pernas.includes('x.transform(1,0,inclinacao,1,-inclinacao*sola,0)'));assert.match(s,/var bobIdol=petLifeMovimentoReduzido\(\)\|\|pose\?0/);assert.match(s,/var respira=petLifeMovimentoReduzido\(\)\?0/);
});

test('Polish: apoio visual do Sora não altera a coordenada da colisão',()=>{
 const s=read('sora-jump.html');assert.match(s,/x\.moveTo\(pl.x\+4,pl.y\);x\.lineTo\(pl.x\+pl.w-4,pl.y\)/);assert.match(s,/feetPrev <= pl.y \+ 10 && feetNow >= pl.y/);
});

test('Mapa: acessório acompanha o look e ignora identificadores inválidos',()=>{
 const s=read('tw-mapa.js'),a=s.indexOf('function acessorioPasseante('),b=s.indexOf('function andar(',a),ctx={ACC:[[''],['mic'],['laco']]};vm.runInNewContext(s.slice(a,b),ctx);assert.equal(ctx.acessorioPasseante({a:'mic'}),'mic');assert.equal(ctx.acessorioPasseante({a:'invalid'}),'');assert.equal(ctx.acessorioPasseante(null),'');assert.match(s,/accSel=acessorioPasseante\(p.av\)/);assert.match(s,/accSel=acessorioPasseante\(g.av\)/);
});

test('Loja: cena aberta desenha imediatamente e respeita movimento reduzido',()=>{
 const s=read('shop.js');assert.match(s,/if\(painel.open&&!shopOv.hidden\)shopDesenhar\(\)/);assert.match(s,/visualT=reduz\?0:t/);assert.match(s,/px = reduz\?alvo:/);assert.match(s,/charPose = oP; perfAntena = oAnt/);
});


test('Polish: sombra do passeante permanece no piso e suaviza no salto',()=>{
 const s=read('tw-mapa.js'),a=s.indexOf('function sombraPasseante('),b=s.indexOf('function andar(',a),elipses=[],cores=[];
 const ctx={Math,ctx:{save(){},restore(){},beginPath(){},ellipse(...a){elipses.push(a)},fill(){cores.push(this.fillStyle)}}};vm.runInNewContext(s.slice(a,b),ctx);
 ctx.sombraPasseante(50,730,1.75,0);ctx.sombraPasseante(50,730,1.75,-15);
 assert.ok(elipses.every(e=>e[1]===730));assert.equal(elipses.length,6);assert.ok(elipses[4][2]>elipses[1][2]);assert.notEqual(cores[2],cores[5]);
});
test('Polish: pernas e polainas acompanham o apoio nas três posturas',()=>{
 const fonte=read('pet-sala.js');
 const a=fonte.indexOf('function petLifeSofa('), b=fonte.indexOf('//←petLifeSofaBracos',a);
 const bases=[];
 const ctx={PET_FLOOR:196,CH:[{}],sel:0,OSHI:'tsu',petT:0,petLifeRoupaSaia:()=>'',
   petLifeQuadril:()=>({x:95,y:168}),petLifeMovimentoReduzido:()=>true,petLifeCorColo:'#abc',
   petLifeCanelaRoupa:(x,px,base)=>bases.push(base),petLifeSofaBracos(){}};
 vm.runInNewContext(fonte.slice(a,b),ctx);
 for(const [pose,rot] of [['sentar',0],['conviver',.12],['descansar',-.16]]){
   const pes=[];
   const x=new Proxy({globalAlpha:1,createLinearGradient(){return {addColorStop(){}}},fillRect(px,py,w,h){if(w===12)pes.push(py+h);}},
     {get(obj,k){return k in obj?obj[k]:()=>{};}});
   ctx.petLifePose=pose; bases.length=0;
   ctx.petLifeSofa(x,true,{sit:1,rot});
   assert.equal(pes.length,2);
   assert.deepEqual(bases,pes);
   if(pose==='descansar'){assert.ok(pes[0]<pes[1]);assert.equal(pes[1],196,'pé de apoio permanece no chão');}
   else assert.deepEqual(pes,[196,196]);
 }
});
test('Polish: pista de obstáculos suspensos preserva coordenadas e movimento reduzido',()=>{
 const s=read('centerrun-corrida.js');assert.match(s,/if\(o.high\)\{g.fillStyle='rgba\(37,19,66,.15\)'/);assert.match(s,/g.ellipse\(o.x\+o.w\/2,GY\+1,o.w\*\.52,2.5/);assert.match(s,/pulse = calmo \? .85/);assert.match(s,/Math.min\(6,o.w-fi\)/);
});

test('Praça mobile: enquadramento inicial mantém o Idol e reduz cortes dos letreiros',()=>{
 const s=read('tw-mapa.js'),a=s.indexOf('function enquadrarPraca('),b=s.indexOf('function centralizar(',a),ctx={};
 assert.ok(a>=0&&b>a);vm.runInNewContext(s.slice(a,b),ctx);
 const placas=[[52,505],[1100,1500]];
 const cortes=(inicio,w)=>placas.reduce((n,p)=>n+Number(inicio>p[0]&&inicio<p[1])+Number(inicio+w>p[0]&&inicio+w<p[1]),0);
 let melhorou=0;
 for(const w of [320,420,480,600,670,760,1000,1200,1600]){
   for(let px=60;px<=1540;px+=5){
     const inicio=ctx.enquadrarPraca(px,w),base=Math.max(0,Math.min(1600-w,px-w/2));
     assert.ok(inicio>=0&&inicio<=1600-w&&px>=inicio&&px<=inicio+w);
     assert.ok(cortes(inicio,w)<=cortes(base,w));
     if(cortes(inicio,w)<cortes(base,w))melhorou++;
   }
 }
 assert.ok(melhorou>0);
 assert.equal(cortes(ctx.enquadrarPraca(800,550),550),0);
 assert.match(s,/px=enquadrarPraca\(dono\.x,largura\)\+largura\/2/);
});
