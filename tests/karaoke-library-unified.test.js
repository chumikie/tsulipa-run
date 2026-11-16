'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const css=fs.readFileSync(path.join(root,'karaoke-lista.css'),'utf8');
assert(html.includes('<script src="./karaoke-lista.js?v=6'), 'restaurar a grade visual aprovada');
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
