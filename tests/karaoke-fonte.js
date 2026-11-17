'use strict';
// Desde 17/11/2026 o show de ritmo mora em karaoke-show.js (passo 4 do plano da #109). Vários testes antigos extraem trechos
// do show de dentro do karaoke-time.html; este ajudante remonta o HTML como era antes da divisão: recoloca o bloco
// "var kt=(function(){...})();" no lugar de "var kt=window.KaraokeShow.criar({...});" e desfaz a troca mecânica D.nome() → nome.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
module.exports=function karaokeFonte(){
  const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8'),show=fs.readFileSync(path.join(root,'karaoke-show.js'),'utf8');
  const a=html.indexOf('var kt=window.KaraokeShow.criar({'),b=html.indexOf('});',a)+3;
  if(a<0)throw new Error('karaoke-time.html não cria o show com KaraokeShow.criar');
  const deps=[...html.slice(a,b).matchAll(/([\w$]+):function\(v?\)\{/g)].map(m=>m[1]);
  const grava=[...html.slice(a,b).matchAll(/([\w$]+):function\(v\)\{if\(arguments\.length\)\1=v;/g)].map(m=>m[1]);
  const i=show.indexOf('function criar(D){')+'function criar(D){'.length,j=show.lastIndexOf('}\nwindow.KaraokeShow={criar:criar};');
  let corpo=show.slice(i,j);
  corpo=corpo.replace(/\bD\.([A-Za-z_$][\w$]*)\(([^()]+)\)/g,(m,n,v)=>grava.includes(n)?n+'='+v:m); // o que o show grava na sala
  corpo=corpo.replace(/\bD\.([A-Za-z_$][\w$]*)\(\)/g,(m,n)=>{if(!deps.includes(n))throw new Error('karaoke-show.js usa D.'+n+'() que a sala não passa');return n;});
  return html.slice(0,a)+'var kt=(function(){'+corpo+'})();'+html.slice(b);
};
