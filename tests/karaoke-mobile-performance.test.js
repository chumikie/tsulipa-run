'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const html=fs.readFileSync(require('node:path').join(__dirname,'..','karaoke-time.html'),'utf8');
const start=html.indexOf('var lista=krBots.concat(krEu.plateia?[]:');
const end=html.indexOf('for(i=krTrilha.length-1;i>=0;i--)',start);
assert(start>=0&&end>start,'Karaoke room tile rendering block must exist');
const block=html.slice(start,end);
assert(html.includes('var krTilesPisados=new Uint8Array(90);'),'The 15×6 typed buffer should be allocated once outside the animation loop');
assert(block.includes('krTilesPisados.fill(0);'),'The reusable occupancy buffer should be reset once per frame');
assert(block.includes('lista.forEach(function(j){var ix0='),'Occupancy should be calculated once per visible character');
assert(block.includes('krTilesPisados[ix*6+iy]=1'),'Character occupancy should mark logical tiles');
assert(block.includes('var tileIndex=0;for(var gx=100;gx<860;gx+=54)for(var gy=315;gy<515;gy+=36)'),'The existing 15×6 visual tile grid should remain intact');
assert(block.includes('pisou=krTilesPisados[tileIndex++]===1'),'Tile rendering should read precomputed occupancy');
assert(!block.includes('lista.some(function(j){return Math.abs(j.x-(gx+25))<38'),'Avoid scanning all characters for every tile');
assert(html.includes('if(krHandBusy(b))')&&html.includes('krAgendarLoop()'),'Keep the existing room animation and busy-hand flow');
// Static wall panels and shelf are cached instead of rebuilt on every room frame.
assert(html.includes('var krDecorWallCache=null;'),'Wall background cache should be persistent');
assert(html.includes('var wallCanvas=document.createElement(\'canvas\');wallCanvas.width=W;wallCanvas.height=330;'),'Wall cache should match the logical scene size');
assert(html.includes('x.drawImage(krDecorWallCache,0,0);'),'Cached wall should be composited into the scene');
assert(html.includes('var krEstanteCache=null,krEstanteCacheKey=\'\';'),'Shelf artwork should have a persistent cache');
assert(html.includes("var key=tr('Acessórios + snacks')+'|'+tr('Escolha abaixo para equipar');"),'Shelf cache should invalidate when language labels change');
assert(html.includes('function krDesenharEstanteItensDireto('),'The original shelf painter should remain available for cache creation');
assert(html.includes('x.drawImage(krEstanteCache,696,205);'),'Cached shelf should be composited at its original position');
assert(html.includes('function krDesenharWhimsical(x,t)')&&html.includes('function krDesenharPosterIdol(x,person,fx,fy,idx,t)'),'Animated curtains and dynamic player posters should remain live');

console.log('✓ Karaoke room tile occupancy uses a precomputed 15×6 grid');
