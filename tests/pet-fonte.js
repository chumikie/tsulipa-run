// pet.js foi dividido (15/11/2026): a sala do pet (quarto, celular, agenda, camarim, minijogo, adoção) mora em
// pet-sala.js e baixa ao abrir o pet. Cada "//→nome" no pet.js marca onde a função estava; em pet-sala.js ela vem
// depois de "//←nome". Este ajudante remonta o arquivo na ordem original, para os testes que recortam por posição.
'use strict';
const fs=require('fs'),path=require('path');
module.exports=function petFonte(){
  const raiz=path.join(__dirname,'..');
  const base=fs.readFileSync(path.join(raiz,'pet.js'),'utf8'),sala=fs.readFileSync(path.join(raiz,'pet-sala.js'),'utf8');
  const pedacos={};
  sala.split(/^\/\/←/m).slice(1).forEach(p=>{const i=p.indexOf('\n');pedacos[p.slice(0,i).trim()]=p.slice(i);});
  return base.replace(/\n\/\/→([\w$]+)/g,(m,n)=>{if(!(n in pedacos))throw new Error('pet-sala.js sem '+n);return pedacos[n];});
};
