// Álbum do Gacha: conferência puramente local, sem Supabase ou economia.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const src=fs.readFileSync(path.join(__dirname,'../album.js'),'utf8');
const corpo={innerHTML:''};
const locais=new Map();
const ctx={
  console,
  ALBUM_POR_PAGINA:9,
  contaJ:{nick:'Teste'},
  hubIdolsDados:{idols:[{nick:'A'},{nick:'B'},{nick:'C'},{nick:'D'},{nick:'E'},{nick:'F'}]},
  $:id=>id==='albumCorpo'?corpo:null,
  tr:x=>x,
  escHtml:x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'),
  localStorage:{getItem:k=>locais.get(k)||null,setItem(k,v){locais.set(k,v);}},
  cardsMem:{},
  sfx:null
};
vm.createContext(ctx);
vm.runInContext(src,ctx,{filename:'album.js'});
ctx.albumDados=[
  {card:{nick:'A'},vezes:3},
  {card:{nick:'B'},vezes:1},
  {card:{nick:'C'},vezes:2}
];
ctx.albumPronto=true;
ctx.albumUI();
assert.match(corpo.innerHTML,/Cards repetidos[^<]*: <b>3<\/b>/);
assert.match(corpo.innerHTML,/Próxima meta[^<]*: 5 \(faltam 2\)/);
assert.ok(!/pó de estrela|Pó de estrela|resgatar|trocar por pó/.test(corpo.innerHTML));
assert.equal(locais.has('brs48cr_'),false);
ctx.albumDados=[{card:{nick:'A'},vezes:NaN},{card:{nick:'B'},vezes:-12}];
ctx.albumUI();
assert.match(corpo.innerHTML,/Cards repetidos[^<]*: <b>0<\/b>/);
ctx.albumPronto=false;
ctx.albumUI();
assert.doesNotMatch(corpo.innerHTML,/Cards repetidos/,'não estimar duplicatas sem RPC confirmada');
ctx.albumPronto=true;
ctx.LANG='en';
ctx.albumUI();
assert.match(corpo.innerHTML,/Duplicate cards/);
assert.match(corpo.innerHTML,/Next milestone/);
for(const lang of ['pt','en','es','id','th','ja']){
  ctx.LANG=lang;
  for(let i=0;i<3;i++)assert.ok(ctx.albumResumoTexto(i),'tradução ausente: '+lang+'/'+i);
}
console.log('OK: repetidos informativos, próxima meta, seis idiomas e falha RPC sem economia simulada');
