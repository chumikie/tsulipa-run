// Banner: 3 dias de TsuLiPa e 1 dia com um trio alternando o estilo do visual (A·B·A / B·A·B).
const assert=require('node:assert/strict');const fs=require('fs');const path=require('path');const vm=require('vm');
const src=fs.readFileSync(path.join(__dirname,'..','banner.js'),'utf8');
const av=(back,baixo)=>({c:Object.assign({back},baixo?{baixo}:{})});
const idols=[['Ana','longo'],['Bia','marias'],['Caio',''],['Duda','rabo'],['Edu','pixie'],['Fê','chanel'],['Gui','',],['Hana','cacheado'],['Iri','onduladom'],['Juca','longo','bermuda'],['Tsu','longo']]
  .map(([n,b,x])=>({nick:n,avatar:av(b,x)}));
const scope={console,Set,hubIdolsDados:{idols}};vm.createContext(scope);vm.runInContext(src,scope);
for(const d of [0,1,2,4,5,6]){scope.bannerDia=()=>d;scope.bannerCache={chave:'',elenco:null};assert.equal(scope.bannerElenco(),null,'dia '+d+' é do TsuLiPa');}
const est=e=>e.map(p=>scope.bannerEstilo(p.av)).join('');
scope.bannerDia=()=>3;scope.bannerCache={chave:'',elenco:null};const t1=scope.bannerElenco();
assert.equal(t1.length,3);assert.equal(est(t1),'ABA');
scope.bannerDia=()=>7;scope.bannerCache={chave:'',elenco:null};const t2=scope.bannerElenco();
assert.equal(est(t2),'BAB');
assert.ok(!t1.concat(t2).some(p=>p.nick==='Tsu'),'TsuLiPa nunca entra no trio de jogadores');
assert.equal(scope.bannerEstilo(av('longo','bermuda')),'A','a parte de baixo vale mais que o corte');
// Faltando um estilo, completa com neutros e depois com qualquer um
scope.hubIdolsDados={idols:[['Ana','longo'],['Bia','marias'],['Hana','cacheado'],['Iri','onduladom']].map(([n,b])=>({nick:n,avatar:av(b)}))};
scope.bannerDia=()=>3;scope.bannerCache={chave:'',elenco:null};const t3=scope.bannerElenco();
assert.equal(t3.length,3);assert.equal(new Set(t3.map(p=>p.nick)).size,3);
console.log('OK banner: ciclo 3+1 e trio A·B·A / B·A·B');
