'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const js=fs.readFileSync(path.join(root,'karaoke-news-photo.js'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const jornal=fs.readFileSync(path.join(root,'jornal.js'),'utf8');
const foto=require('../karaoke-news-photo.js');

function intervalo(texto,comeco,fim){
 const a=texto.indexOf(comeco),b=texto.indexOf(fim,a);
 assert.ok(a>=0&&b>a,'trecho original do Karaoke disponível: '+comeco);
 return texto.slice(a,b);
}
const karaokeDaily=intervalo(html,'var KaraokeDaily=(function()','/* Renderizador vetorial');
const karaokeClip=intervalo(html,'var KaraokeClip=(function()','/* Clip captions');
const antigo=vm.runInNewContext(karaokeDaily+'\n'+karaokeClip+'\n({KaraokeDaily,KaraokeClip})');
function idDe(n){let h=5381;for(const c of n.toLowerCase())h=((h*33)^c.charCodeAt(0))>>>0;return 'site-'+h.toString(36);}
const nomes=Array.from({length:20},(_,i)=>'Idol'+String(i).padStart(2,'0'));
const vitrine=nomes.map(n=>({nick:n,avatar:{c:{hair:'#aabbcc',skin:'#f7ddcc',out:'zipper'}}}));
const catalogo=vitrine.map(p=>({...p,id:idDe(p.nick)}));

test('os oito cenários são os mesmos desenhados pelo telão original',()=>{
 const original=intervalo(html,'function star(x,a,b,r,color)','function draw(x,tx,ty,w,h,t){');
 const compartilhado=intervalo(js,'function star(x,a,b,r,color)','function drawBackground(x,concept,w,h)');
 assert.equal(compartilhado.trim(),original.trim());
 assert.equal(foto.themes.length,8);
 assert.ok(index.includes('karaoke-clip-uniforms.js')&&index.includes('karaoke-news-photo.js'));
});

test('as seis pessoas e o tema diário coincidem com o clipe real por 16 dias',()=>{
 for(let d=0;d<16;d++){
  const dia=new Date(Date.UTC(2026,10,3+d)).toISOString().slice(0,10);
  const roster=antigo.KaraokeDaily.select(catalogo,idDe('Tsu'),dia,[]).members;
  const producao=antigo.KaraokeClip.make(dia,roster.map(p=>({id:p.id,nick:p.nick,char:p.avatar.c})),idDe('Tsu'));
  const fotoDia=foto.cast(dia,vitrine,'Tsu');
  assert.ok(fotoDia,dia+' tem 6 Idols');
  assert.equal(fotoDia.concept.name,producao.concept.name);
  assert.deepEqual(Array.from(fotoDia.members,p=>p.nick),Array.from(producao.members,p=>p.nick),dia);
 }
});

test('sem elenco completo, a foto não substitui pessoas por vencedores da semana',()=>{
 assert.equal(foto.cast('2026-11-03',vitrine.slice(0,7),'Tsu'),null);
 assert.ok(!jornal.includes('o pódio da semana se apresentando juntos'));
 assert.ok(jornal.includes('KaraokeNewsPhoto.cast(dataDoClipe, L, euNoClipe)'));
});
