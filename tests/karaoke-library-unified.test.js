'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8')+'\n'+fs.readFileSync(path.join(root,'karaoke-biblioteca.js'),'utf8'); // biblioteca em arquivo próprio desde 17/11/2026
const css=fs.readFileSync(path.join(root,'karaoke-lista.css'),'utf8');
assert(html.includes('<script src="./karaoke-lista.js?v=7'), 'restaurar a grade visual aprovada');
assert(css.includes('html.kt-lista.kt-no-site #ktAudioLibrary{display:none'), 'ocultar biblioteca antiga sem remover o motor de prévia');
assert(html.includes('id="ktAudioLibrary"')&&html.includes('id="ktPreviewPlayer"'), 'manter biblioteca e prévia originais');
assert(html.includes('id="ktSong"')&&html.includes('id="ktStart"'), 'manter motor do show e controles originais');
assert(html.includes('id="ktLibraryStart"')&&html.includes("originalStart.click()"), 'um botão de cantar na biblioteca chama o início existente');
assert(html.includes('new MutationObserver(syncLibraryStart)'), 'novo botão espelha bloqueio e texto do motor');
assert(html.includes('new MutationObserver(syncTracks)'), 'seleção não pode mudar durante um show');
const keys=['normal','fast','chill','tema','corrida','gacha','duo'];
for(const k of keys){
 assert(html.includes('data-kt-song-select="'+k+'"'),k+' segue selecionável');
 assert(html.includes('data-kt-song-preview="'+k+'"'),k+' segue audível');
}
assert(css.includes('html.kt-lista .kt-song-choice'), 'manter controles técnicos ocultos no modo visual aprovado');
assert(html.includes('document.documentElement.classList.add(\'kt-library-ready\')'), 'aprimoramento só oculta controles quando a biblioteca está pronta');
assert((html.match(/data-kt-voice-group="/g)||[]).length===3,'vozes continuam disponíveis fora do site integrado');
console.log('✓ Karaoke: lista visual restaurada, biblioteca antiga oculta no celular e motor preservado');
const lista=fs.readFileSync(path.join(root,'karaoke-lista.js'),'utf8');
const ouvir={dataset:{ktlOuvir:'duo'},setAttribute(k,v){this[k]=v;}};
const origem={getAttribute(){return this.pressionado;}};
const doc={querySelector:()=>origem};
const scope={box:{querySelector:()=>ouvir},document:doc};
require('node:vm').runInNewContext(lista.slice(lista.indexOf('  function sincronizarPrevia'),lista.indexOf('  function desenhar')),scope);
for(const [nome,pressionado,disabled] of [['Pausar','true',false],['Retomar','false',false],['Ouvir','false',true]]){
 Object.assign(origem,{textContent:nome,pressionado,disabled});
 scope.sincronizarPrevia();
 assert.deepEqual([ouvir.textContent,ouvir['aria-pressed'],ouvir.disabled],[nome,pressionado,disabled]);
}
