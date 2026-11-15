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
assert(read('tw-celular.css').includes('.twc-carrega{pointer-events:none;'),'abertura decorativa nunca captura toques');
const config=JSON.parse(read('vercel.json'));
assert(config.headers.some(r=>r.source.includes('js')&&r.headers.some(h=>h.value==='public, max-age=0, must-revalidate')));
console.log('✓ Abertura: mutações agrupadas, moldura estável, toques livres e scripts revalidados');
