// Pó de estrela no Álbum (gacha-po.js): fica escondido sem a RPC no servidor; usa só o que o servidor devolve;
// reenvia a MESMA requisição numa nova tentativa; seis idiomas completos. Sem rede, sem Supabase.
'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const raiz=path.join(__dirname,'..');
const els={};
function el(id){return els[id]||(els[id]={id,innerHTML:'',value:'',remove(){delete els[id];},querySelector(){return null;},insertBefore(n){els[n.id]=n;}});}
el('albumCorpo');
const chamadas=[];let resposta={};let ouvintes={};
const ctx={console,LANG:'pt',contaJ:{nick:'Ana'},albumPronto:true,albumDados:[],
  $:id=>els[id]||null,escHtml:x=>String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'),
  document:{createElement:()=>({id:'',innerHTML:''}),addEventListener:(t,f)=>{ouvintes[t]=f;}},
  crypto:{randomUUID:()=>'u-'+chamadas.length},sfx:null,
  contaRpc:(n,a)=>{chamadas.push([n,a]);const r=resposta[n];return r instanceof Error?Promise.reject(r):Promise.resolve(typeof r==='function'?r(a):r);}};
ctx.albumUI=function(){};ctx.albumAbrir=function(){};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(raiz,'gacha-po.js'),'utf8'),ctx,{filename:'gacha-po.js'});
const clicar=(dados,id)=>ouvintes.click({target:{closest:()=>({dataset:dados,id})}});
const tique=()=>new Promise(r=>setTimeout(r,5));
(async()=>{
  // 1. sem a função no banco: nada aparece
  resposta.gacha_po_status=new Error('Could not find the function public.gacha_po_status');
  ctx.albumAbrir();await tique();
  assert.equal(els.gpoBox,undefined,'sem RPC no servidor a seção fica escondida');
  // 2. com status: mostra saldo, repetidos e lista de faltando quando há 5 pós
  resposta.gacha_po_status={ok:true,po:5,custo_troca:5,repetidos:[{nick:'Bia',vezes:3}],faltando:[{nick:'Duda'},{nick:'<x>'}]};
  ctx.albumAbrir();await tique();
  const h=els.gpoBox.innerHTML;
  assert.match(h,/Pó de estrela: <b>5<\/b>/);assert.match(h,/Bia ×3/);assert.match(h,/<option selected>Duda<\/option>/);
  assert.ok(h.includes('&lt;x&gt;')&&!h.includes('<x>'),'nicks escapados');
  // 3. converter pede confirmação e só chama a RPC depois do "ok"
  const antes=chamadas.length;
  clicar({gpo:'c',gpon:'Bia'});
  assert.match(els.gpoBox.innerHTML,/Converter 1 cópia de Bia em 1 pó\? A primeira cópia fica no álbum\./);
  assert.equal(chamadas.length,antes,'nada enviado antes de confirmar');
  // falha de rede: mantém o pedido e reenvia a MESMA requisição
  resposta.gacha_converter_repetido=new Error('rede');
  clicar({gpo:'ok'});await tique();
  const req1=chamadas.find(c=>c[0]==='gacha_converter_repetido')[1];
  assert.deepEqual({...req1},{p_nick:'Bia',p_requisicao:req1.p_requisicao});
  assert.match(els.gpoBox.innerHTML,/Não deu certo/);
  resposta.gacha_converter_repetido={ok:true,po:6,convertido:'bia'};resposta.album_cards=[];
  clicar({gpo:'ok'});await tique();
  const convs=chamadas.filter(c=>c[0]==='gacha_converter_repetido');
  assert.equal(convs.length,2);assert.equal(convs[1][1].p_requisicao,req1.p_requisicao,'nova tentativa usa a mesma requisição');
  assert.ok(chamadas.some(c=>c[0]==='album_cards'),'recarrega o álbum depois de converter');
  // 4. resgate: pó insuficiente vira mensagem clara
  resposta.gacha_po_status={ok:true,po:2,custo_troca:5,repetidos:[],faltando:[{nick:'Duda'}]};
  ctx.albumAbrir();await tique();
  assert.match(els.gpoBox.innerHTML,/Faltam 3 pós para resgatar\./);assert.doesNotMatch(els.gpoBox.innerHTML,/data-gpo="r"/);
  // 5. seis idiomas completos e do mesmo tamanho
  const GPO=vm.runInContext('GPO_TR',ctx);
  assert.deepEqual(Object.keys(GPO).sort(),['en','es','id','ja','pt','th']);
  for(const l in GPO){assert.equal(GPO[l].length,GPO.pt.length,l);GPO[l].forEach((s,i)=>{assert.ok(s&&s.trim(),l+i);if(/\{n\}/.test(GPO.pt[i]))assert.ok(s.includes('{n}'),l+i+' sem {n}');});}
  // 6. não toca em chaves brs48cr_* nem em ★
  const src=fs.readFileSync(path.join(raiz,'gacha-po.js'),'utf8');
  assert.ok(!/brs48cr_|localStorage|stars/.test(src));
  assert.match(fs.readFileSync(path.join(raiz,'index.html'),'utf8'),/album\.js\?v=\d+"><\/script>\n<script src="\.\/gacha-po\.js\?v=\d+">/);
  console.log('OK: pó de estrela no Álbum — escondido sem servidor, confirmação, mesma requisição, seis idiomas');
})().catch(e=>{console.error(e);process.exit(1);});
