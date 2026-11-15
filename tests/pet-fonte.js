// pet.js + pet-sala.js na ordem original (ver tests/fonte-dividida.js).
'use strict';
module.exports=function petFonte(){ return require('./fonte-dividida.js')('pet.js','pet-sala.js'); };
