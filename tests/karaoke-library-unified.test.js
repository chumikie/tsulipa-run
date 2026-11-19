'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8')+'\n'+fs.readFileSync(path.join(root,'karaoke-biblioteca.js'),'utf8'); // biblioteca em arquivo próprio desde 17/11/2026
const css=fs.readFileSync(path.join(root,'karaoke-lista.css'),'utf8');
assert(html.includes('<script src="./karaoke-lista.js?v='), 'restaurar a grade visual aprovada');
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

// Monta a mesma lista que a sala usa, com um seletor de 14 músicas.
const vm=require('node:vm');
const keysDoJogo=keys.concat(require('../karaoke-musicas-modos.js').lista.map(m=>m.key));
const seletor={value:'normal',options:keysDoJogo.map(value=>({value,textContent:value})),addEventListener(){}};
const attrs={},box={querySelector(){return {focus(){}};},setAttribute(k,v){attrs[k]=v;},getAttribute(k){return attrs[k];},
  contains(){return true;},addEventListener(k,fn){this[k]=fn;}};
const palco={parentNode:{insertBefore(){}}};
const document={documentElement:{classList:{contains:()=>true,add(){}}},createElement:()=>box,
  getElementById:id=>({krPalco:palco,ktSong:seletor})[id],querySelector:()=>null};
const window={parent:{TW_CELULAR_LIGADO:true},KaraokeRoomViews:{songFor:()=> 'fast'}};
vm.runInNewContext(fs.readFileSync(path.join(root,'karaoke-lista.js'),'utf8'),{
  window,document,setTimeout:fn=>fn(),MutationObserver:class{observe(){}},URLSearchParams,
  location:{search:'?lang=pt'}
});
const capas=()=>[...box.innerHTML.matchAll(/data-ktl="([^"]+)"/g)].map(m=>m[1]);
assert.deepEqual(capas(),['fast','normal','chill']);
assert(box.innerHTML.includes('Todas (14)') && box.innerHTML.includes('Hitonatsu no Dekigoto'));
function filtrar(filtro){box.click({target:{closest:()=>({dataset:{ktlFiltro:filtro}})}});}
filtrar('todas');assert.deepEqual(capas(),keysDoJogo);
filtrar('destaques');assert.equal(seletor.value,'normal');
