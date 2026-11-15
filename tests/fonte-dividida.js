// Arquivos divididos em base (abertura) + parte sob demanda (15/11/2026): pet.js + pet-sala.js, perfil.js + perfil-tela.js.
// Cada "//→nome" na base marca onde a função estava; na parte ela vem depois de "//←nome".
// fonteDividida('pet.js','pet-sala.js') remonta o arquivo na ordem original, para os testes que recortam por posição.
'use strict';
const fs=require('fs'),path=require('path');
module.exports=function fonteDividida(baseArq,parteArq){
  const raiz=path.join(__dirname,'..');
  const base=fs.readFileSync(path.join(raiz,baseArq),'utf8'),parte=fs.readFileSync(path.join(raiz,parteArq),'utf8');
  const pedacos={};
  parte.split(/^\/\/←/m).slice(1).forEach(p=>{const i=p.indexOf('\n');pedacos[p.slice(0,i).trim()]=p.slice(i);});
  return base.replace(/\n\/\/→([\w$]+)/g,(m,n)=>{if(!(n in pedacos))throw new Error(parteArq+' sem '+n);return pedacos[n];});
};
module.exports.DIVIDIDOS={'pet.js':'pet-sala.js','perfil.js':'perfil-tela.js'};
