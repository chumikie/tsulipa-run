'use strict';
// Backstage⭐Pet!: o Idol no quarto mostra o rosto montado no charmaker; "^^" fica para interação, descanso e um sorriso de vez em quando.
const assert=require('assert');
const pet=require('./pet-fonte.js')();
const linha=pet.slice(pet.indexOf('var sorrisoDaVez'),pet.indexOf('drawChar(CH[sel], 0, 0, 0, expr);'));
assert.ok(/var sorrisoDaVez = !petLifeMovimentoReduzido\(\) && \(petT % 300\) < 60;/.test(linha),'sorriso só de vez em quando e nunca com movimento reduzido');
assert.ok(/\(happy \|\| petLifePose === 'conviver'\) && sorrisoDaVez/.test(linha),'feliz não esconde mais o rosto o tempo todo');
assert.ok(/petLifePose === 'descansar' \? 2/.test(linha)&&/petSmile > 0 \|\| petCharT > 0 \|\| amizade \|\| idolBrincando/.test(linha),'interação e descanso continuam com ^^');
console.log('OK: rosto do charmaker no Backstage⭐Pet!');
