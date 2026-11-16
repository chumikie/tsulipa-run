'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const css=fs.readFileSync(path.join(root,'karaoke-lista.css'),'utf8');
assert(!html.includes('<script src="./karaoke-lista.js'), 'não carregar a segunda grade de músicas');
assert(!html.includes('id="ktLista"'), 'sem segunda lista na tela');
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
assert(css.includes('html.kt-no-site.kt-library-ready .kt-song-choice')&&css.includes('.kt-library-voices{display:none'), 'ocultar controles repetidos somente no site integrado');
assert(html.includes('document.documentElement.classList.add(\'kt-library-ready\')'), 'aprimoramento só oculta controles quando a biblioteca está pronta');
assert((html.match(/data-kt-voice-group="/g)||[]).length===3,'vozes continuam disponíveis fora do site integrado');
console.log('✓ Karaoke: catálogo único no site, com seleção, prévia e início preservados');
