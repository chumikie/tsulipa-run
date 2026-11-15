'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(require('node:path').join(__dirname,'..',p),'utf8');
// Executa o observador real com duas entregas na mesma frame: uma inspeção por alvo.
const motion=read('tw-motion-lifecycle.js'),queue=[],seen=[];
let observer,refreshes=0;
const context={Set,inspectCss:el=>seen.push(el),refreshAll:()=>refreshes++,scan:()=>{},cleanup:()=>{},
 disconnectFrame:()=>{},connectFrame:()=>{},w:{MutationObserver:true,requestAnimationFrame:f=>{queue.push(f);return queue.length;}},
 MutationObserver:function(f){observer=f;}};
vm.runInNewContext(motion.slice(motion.indexOf('var pendingMutations='),motion.indexOf('function startScan()')),context);
const target={tagName:'DIV'},record={type:'attributes',target,attributeName:'class'};
observer([record]);observer([record]);assert.equal(queue.length,1);assert.equal(refreshes,0);
queue.shift()();assert.equal(refreshes,1);assert.equal(seen.length,1);
observer([record]);assert.equal(queue.length,1);queue.shift()();assert.equal(refreshes,2);
// Atualizar moldura estável não pode emitir novas mutações de hidden a cada quadro.
const mobile=read('tw-celular.js');let writes=0,hidden=true,ctx='';
const mold={dataset:{},get hidden(){return hidden;},set hidden(v){writes++;hidden=v;}};
const scope={mold,moldRaf:1,cel:{},contexto:()=>ctx,document:{body:{classList:{toggle(){}}}},nick:()=>'',LANG:'pt',molduraDesenhar(){}};
vm.runInNewContext(mobile.slice(mobile.indexOf('  function molduraAtualizar(){'),mobile.indexOf('  function molduraClique(')),scope);
scope.molduraAtualizar();scope.molduraAtualizar();assert.equal(writes,0);
ctx='janela';scope.molduraAtualizar();scope.molduraAtualizar();assert.equal(writes,1);assert.equal(hidden,false);
ctx='';scope.molduraAtualizar();assert.equal(writes,2);assert.equal(hidden,true);
assert.equal((mobile.match(/ob\.observe\(document\.body/g)||[]).length,1,'uma inscrição preserva hidden + class + subtree');
assert(!/function carregamento\(|carregamento\(\);|ov\.className = 'twc-carrega'/.test(mobile),'início não cria nem espera splash decorativa');
for(const file of ['index.html','tw-celular.css']) assert(read(file).includes('.twc-carrega{display:none!important;pointer-events:none}'),file+': script antigo em cache não pode cobrir o início');
// Falha de inicialização do celular nunca deve ocultar o hub clássico nem apagar saves.
assert(mobile.includes("function falhaInicializacao(erro)"),'fallback de inicialização presente');
assert(mobile.includes("document.body.classList.remove('tw-cel', 'tw-cel-classico'"),'fallback libera hub clássico');
assert(mobile.includes("window.TW_CELULAR_LIGADO = false;"),'fallback desativa modo celular');
assert(mobile.includes("}catch(e){ falhaInicializacao(e); }"),'montagem protegida contra exceções');
assert(mobile.indexOf("desenhar();\n    document.body.classList.add('tw-cel');") > 0,'hub clássico só é ocultado após primeiro desenho');
// Executa o agendador de redraw isoladamente: sete eventos do hub em uma frame = um desenho.
const frameQueue=[];let draws=0, active=true;
const redrawScope={cel:{},redesenhoRaf:0,requestAnimationFrame:fn=>{frameQueue.push(fn);return frameQueue.length;},
 desenhar:()=>draws++,falhaInicializacao:e=>{throw e;}};
vm.runInNewContext(mobile.slice(mobile.indexOf('  function agendarRedesenho(){'),mobile.indexOf('  // Refaz junto com o hub')),redrawScope);
for(let i=0;i<7;i++)redrawScope.agendarRedesenho();
assert.equal(frameQueue.length,1,'eventos do hub agrupados numa frame');
frameQueue.shift()();assert.equal(draws,1,'uma reconstrução por frame');
redrawScope.agendarRedesenho();frameQueue.shift()();assert.equal(draws,2,'atualização seguinte não fica bloqueada');
redrawScope.cel=null;redrawScope.agendarRedesenho();assert.equal(frameQueue.length,0,'sem redraw após desmontagem');
// Abertura montada não pode reconstruir canvases e vitrine em cada atualização do Hub.
const guardStart=mobile.indexOf('    var comecou = typeof hubComecou');
const guardEnd=mobile.indexOf('    var rolagem',guardStart);
assert(guardStart>0 && guardEnd>guardStart,'guarda da abertura presente');
const openingGuard=new Function('hubComecou','topo','pilha','tela','$id','requestAnimationFrame','cel','vitrineTrazer',
  mobile.slice(guardStart,guardEnd)+";return 'continua';");
let openingLookups=0, openingFrames=[], idolMoves=0;
const openingTela={getAttribute:()=> 'abre'};
assert.equal(openingGuard(false,()=> 'inicio',['inicio'],openingTela,()=>{
  openingLookups++;return {};
},fn=>openingFrames.push(fn),{},()=>idolMoves++),undefined,'abertura já montada não redesenha');
assert.equal(openingLookups,1);
assert.equal(openingFrames.length,1,'vitrine reagendada sem recriar a abertura');
openingFrames.shift()();
assert.equal(idolMoves,1,'vitrine pode ser devolvida ao slot');
assert.equal(openingGuard(true,()=> 'inicio',['inicio'],{getAttribute:()=> 'inicio'},()=>null,
  fn=>openingFrames.push(fn),{},()=>idolMoves++),
  'continua','outras telas continuam atualizando');
assert(mobile.includes('try{ vitrineDevolver(); }catch(e){}'),'fallback devolve vitrine antes de remover celular');
assert(!mobile.includes("(part ? part.innerHTML : '')"),'partículas do hub não são clonadas');
assert(!mobile.includes("'hubTemaUI', 'hubIdolsUI'"),'vitrine não pode gerar redraw recursivo');
assert(mobile.includes('!box.twcLigada'),'vitrine não deve reiniciar listeners em cada refresh');
const config=JSON.parse(read('vercel.json'));
assert(config.headers.some(r=>r.source.includes('js')&&r.headers.some(h=>h.value==='public, max-age=0, must-revalidate')));
console.log('✓ Abertura: mutações agrupadas, moldura estável, toques livres e scripts revalidados');
