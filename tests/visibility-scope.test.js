'use strict';
// Regressão (758b8c3): scripts fora do bloco principal de index.html chamavam funções
// internas do jogo e falhavam com ReferenceError; as animações pausadas não voltavam.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const close="applyLang();\n";
const mainEnd=html.indexOf('</script>',html.lastIndexOf(close));
assert(mainEnd>0,'fim do script principal encontrado');
const main=html.slice(0,mainEnd),after=html.slice(mainEnd);
assert(!after.includes('id="twAnimationVisibilityLifecycle"'),'ciclo de visibilidade não fica em <script> separado');
assert(main.includes('(function twAnimationVisibilityLifecycle(){'),'ciclo de visibilidade roda dentro do escopo do jogo');
for(const name of ['twIntervaloVisivel(','twTimeoutVisivel(','twOverlayInvalidar(','twIndex2BaseFramesPaused(','twAnimacaoVisivel(','hubLoop','encLoop','petLoop']){
 assert(!after.includes(name),'código fora do escopo do jogo não usa '+name);
}
assert(main.includes('window.TWVisibilidade={intervalo:twIntervaloVisivel,timeout:twTimeoutVisivel};'),'temporizadores visíveis exportados de forma explícita');
assert(after.includes("var hubOv=document.querySelector('#hub'),TWV=window.TWVisibilidade;"),'script do hub usa o elemento #hub e a ponte exportada');
assert(main.includes("'.ov:not([hidden]),.hub:not([hidden]),"),'o hub conta como camada visível');
assert(main.includes("!/^(menu|over|pz)$/.test(topo.id||'')"),'menu, fim do show e pausa não congelam o próprio Center Run');
for(const id of ['hubAnim','gachaAnim','duoAnim','aniverAnim','encAnim','petRaf','perfAnimId'])assert(main.includes(id+'=sl('+id+','),'loop '+id+' religado pela sincronização');
console.log('✓ Visibilidade: ciclo central no escopo do jogo, sem chamadas a funções internas fora dele');
