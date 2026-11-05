'use strict';
// Trilhas dos outros modos (Center⭐Run!, Sora⭐Jump!, vitrine) como músicas do Karaoke⭐Time!.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const M=require('../karaoke-musicas-modos.js');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');

const chaves=M.lista.map(m=>m.key);
assert.deepEqual(chaves,['kawaii','tensa','dificil','alien','unit','sora','vitrine'],'sete trilhas novas, na ordem escolhida');
const originais=['normal','fast','chill','tema','corrida','gacha','duo'];
assert(chaves.every(k=>!originais.includes(k)),'nenhuma chave nova substitui uma música existente');

for(const m of M.lista){
  const s=m.song;
  assert.equal(s.mel.length,64,m.key+': 64 passos como as outras músicas');
  assert(s.mel.every(n=>n===-1||(Number.isInteger(n)&&n>=60&&n<=96)),m.key+': notas MIDI no alcance do lead ou pausa');
  assert(s.mel.filter(n=>n>=0).length>=30,m.key+': notas suficientes para o jogo de ritmo');
  assert(s.mel.slice(-3).every(n=>n===-1)||s.mel[63]===-1,m.key+': termina com respiro antes de repetir');
  assert(s.bpm>=100&&s.bpm<=140,m.key+': andamento jogável');
  assert(['pop','dance','run','ballad','box'].includes(s.style)&&['sine','square','triangle'].includes(s.lead),m.key+': estilo e timbre que o beat() já conhece');
  assert(s.cpb===1&&s.ch.length>=4&&s.ch.every(a=>a.length>=3),m.key+': um acorde a cada 8 passos');
  assert(/^★{1,3}$/.test(m.stars)&&m.name&&m.icon,m.key+': cartão com nome, ícone e estrelas');
}

// Montagem: junta ao catálogo sem sobrescrever e cria cartão e opção uma vez só.
const songs={normal:{mel:[]}};
const inserts=[],opcoes=[];
const grupo={appendChild:o=>opcoes.push(o)};
const doc={
  getElementById:id=>id==='ktSong'?{querySelector:()=>opcoes.length?{}:null,querySelectorAll:()=>[grupo]}:null,
  querySelector:sel=>sel==='.kt-library-tracks'?{querySelector:()=>inserts.length?{}:null,insertAdjacentHTML:(w,h)=>inserts.push(h)}:null,
  createElement:()=>({})
};
M.montar(songs,doc);M.montar(songs,doc);
assert(chaves.every(k=>songs[k]&&songs[k].mel.length===64)&&songs.normal.mel.length===0,'trilhas entram no catálogo sem trocar as existentes');
assert.equal(inserts.length,1,'cartões criados uma vez');
assert.equal(opcoes.length,7,'sete opções novas no seletor, uma vez');
assert(chaves.every(k=>inserts[0].includes('data-kt-song-select="'+k+'"')&&inserts[0].includes('data-kt-song-best="'+k+'"')),'cada cartão tem Ouvir, Selecionar e recorde');
assert.equal(M.nome('sora'),'Sora⭐Jump!');

// Ligação com a página: script carregado antes do catálogo e chamado antes do mapa de pistas.
assert(html.includes('<script src="./karaoke-musicas-modos.js?v=1"></script>'),'karaoke-time.html carrega o arquivo das trilhas');
const i=html.indexOf('ktMusicasModosMontar(songs,document)'),lanes=html.indexOf('Object.keys(songs).forEach(function(k){var c=songs[k],cnt={}');
assert(i>0&&lanes>i,'as trilhas entram antes das pistas serem calculadas');
assert(html.includes("ktMusicaModoNome(k)"),'o placar semanal mostra o nome das trilhas novas');
console.log('karaoke-musicas-modos: ok');
// Biblioteca no celular: nome inteiro e botões lado a lado; uma coluna só em telas de até 360 px.
const baseCss=fs.readFileSync(path.join(__dirname,'..','karaoke-time-base.css'),'utf8');
assert(/@media \(max-width:560px\)\{[^@]*\.kt-library-actions\{flex:1 1 100%;flex-direction:row/.test(baseCss),'no celular os botões ficam embaixo, lado a lado');
assert(baseCss.includes('@media (max-width:360px){ .kt-library-panel .kt-library-tracks{grid-template-columns:minmax(0,1fr)}'),'em 320 px a biblioteca vira uma coluna');
