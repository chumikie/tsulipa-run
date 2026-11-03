'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=require('./site-source.js')();
const skin=fs.readFileSync(path.join(root,'index2-skin.css'),'utf8');
const todayStart=html.indexOf('id="hubHoje"');
const menuStart=html.indexOf('<div id="hubMenu"');
const search=html.indexOf('<section class="hubpainel hubbusca"',menuStart);
const mission=html.indexOf('<section class="hubpainel hub-missoes-mundo" id="hubMisPainel"',search);
const novelties=html.indexOf('<details class="hubpainel hubnov"',mission);
const today=html.slice(todayStart,search);
assert(today.includes('id="hubHojeLinha"'),'Hoje keeps its meeting and weekly music shortcuts');
assert(!today.includes('id="hubMis"')&&!today.includes('id="hubMisT"'),'daily missions no longer appear in Hoje');
assert(search>menuStart&&mission>search&&novelties>mission,'daily missions render immediately after the Idol search bar');
assert.equal((html.match(/id="hubMisPainel"/g)||[]).length,1,'mission panel has one unique container');
assert.equal((html.match(/id="hubMisT"/g)||[]).length,1,'mission title ID stays unique');
assert.equal((html.match(/id="hubMis"/g)||[]).length,1,'mission body ID stays unique');
const gallery=(function(){const a=html.indexOf('function hubIdolsLugar(){'),b=html.indexOf('\nfunction ',a+10),c=html.indexOf('// ---- Palco animado da vitrine ----',a);return html.slice(a,b<0?c:c<0?b:Math.min(b,c));})();   // Etapa 7: a função mora em hub.js
assert(gallery.includes("missions = $('hubMisPainel')"),'the gallery placement knows about the mission panel');
assert(gallery.includes('var anchor = missions || busca;')&&gallery.includes('anchor.parentNode.insertBefore(box, anchor.nextSibling)'),'the Idol gallery follows missions on the started hub');
assert(require('fs').readFileSync(require('path').join(__dirname,'..','jornal.js'),'utf8').includes("Top Idols ' + escHtml(tr('da semana'))"),'Top Idols of the week lives inside Idol⭐News!');
assert(html.includes("function hubMisUI(){")&&html.includes("data-resg="),'mission progress and claim actions remain intact');
assert(html.includes('hubTemaUI(); hubCardsUI(); hubMisUI(); hubCfgUI(); twRankRender();'),'the original hub render still populates mission data');
assert(html.includes("function hubMisCarregar(){")&&html.includes("contaRpc('missoes')"),'daily missions still load from the existing account RPC');

const hubStart=html.indexOf('function hubCardsUI(){');
const hubEnd=html.indexOf('function hubMisUI(){',hubStart);
const hub=html.slice(hubStart,hubEnd);
const order=['class="hubblocot hubbt-mundo"','class="hubcard hubperf"','class="hubcard hubpet','class="hubblocot hubbt-jogos"','class="hubcard hubrun"','class="hubcard hubgacha','class="hubcard tw-hubgame tw-hubgame-sora','class="hubcard tw-hubgame tw-hubgame-karaoke"','class="hubcard hubduo"'];
let previous=-1;
for(const marker of order){const at=hub.indexOf(marker);assert(at>previous,'Meu Mundo must precede Jogos in accessible DOM order: '+marker);previous=at;}
assert(skin.includes('grid-template-areas:"tm tm" "profile profile" "pet loja" "tj tj" "run run" "karaoke sora" "gacha duo" "hand cafe"'),'mobile grid places Meu Mundo above Jogos');
assert(skin.includes('grid-template-areas:"tm tm tm" "profile pet loja" "tj tj tj" "run run run" "karaoke sora gacha" "duo hand cafe"'),'desktop grid places Meu Mundo above Jogos');
console.log('✓ Meu Mundo precedes Jogos; daily missions remain after Idol search and before the gallery.');
