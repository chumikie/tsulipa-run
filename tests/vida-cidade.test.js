// Vida de Idol⭐: integração de acontecimentos confirmados, memória da sessão e seis idiomas.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const raiz=path.resolve(__dirname,'..');
const js=fs.readFileSync(path.join(raiz,'vida-cidade.js'),'utf8');
const ctx={console,Date,Intl,LANG:'pt',contaJ:{id:'A',nick:'IdolA'},document:{
  readyState:'loading',hidden:false,addEventListener(){},getElementById(){return null;}
}};
ctx.window=ctx;vm.createContext(ctx);vm.runInContext(js,ctx,{filename:'vida-cidade.js'});
const vida=ctx.TWVidaCidade;
assert.equal(typeof vida.registrar,'function');
assert.deepEqual(Array.from(vida.idiomas).sort(),['en','es','id','ja','pt','th']);
assert.equal(vida.diarioHtml(),'');
assert.equal(vida.registrar('cafe',{id:'run-1'}),true);
assert.equal(vida.registrar('cafe',{id:'run-1'}),false,'sem repetir finalização confirmada');
assert.equal(vida.registrar('jogo_inventado',{id:'x'}),false,'somente origens conhecidas');
assert.equal(vida.registrar('bloom_plantar',{id:'canteiro-1',flor:'<script>'}),true);
assert.equal(vida.registrar('foto',{id:'foto-1'}),true);
assert.deepEqual(Array.from(vida.capitulos()),[true,true,true],'história utiliza três atividades reais');
assert.match(vida.diarioHtml(),/Happy⭐Cafe!/);
assert.match(vida.diarioHtml(),/Bloom⭐Garden!/);
assert.match(vida.diarioHtml(),/TsuPhone/);
assert.doesNotMatch(vida.diarioHtml(),/<script>/);
assert.equal(vida.estado().length,3);
assert.equal(vida.registrar('bloom_colher',{id:'flor-1',flor:'sakura'}),true);
assert.equal(vida.estado()[3].flor,'sakura');
for(const l of vida.idiomas){ctx.LANG=l;assert.ok(vida.diarioHtml().includes('<section'));}
ctx.contaJ={id:'B',nick:'IdolB'};
assert.equal(vida.estado().length,0,'trocar de conta limpa lembranças privadas');
assert.deepEqual(Array.from(vida.capitulos()),[false,false,false]);
ctx.contaJ=null;
assert.equal(vida.registrar('cafe',{id:'run-1'}),false,'sem conta não registra ato confirmado');
assert.equal(vida.diarioHtml(),'');
const sources=['cafe.js','handshake.js','bloom.js','studio.js','battle.js','pet.js','perfil.js'].map(f=>fs.readFileSync(path.join(raiz,f),'utf8'));
for(const [i,patt] of [
 [0,/registrar\('cafe'/],[1,/registrar\('handshake'/],[2,/registrar\('bloom_'/],
 [3,/registrar\('studio_clique'/],[3,/registrar\('studio_publicar'/],
 [4,/registrar\('battle'/],[5,/registrar\('foto'/],[6,/TWVidaCidade\.diarioHtml\(\)/]
])assert.match(sources[i],patt);
for(const f of ['vida-cidade.js','vida-cidade.css']){
 const html=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
 assert.ok(html.includes('./'+f+'?v='),f+' carregado no site');
}
assert.ok(!/localStorage|sessionStorage|contaRpc|fetch\s*\(/.test(js),'não cria saves, RPCs ou requisições');
console.log('OK: Vida de Idol⭐ (3 capítulos, memória privada, seis idiomas, origens confirmadas e sem saves)');
