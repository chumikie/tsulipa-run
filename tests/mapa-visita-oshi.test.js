'use strict';
// Visita surpresa (15/11/2026): Tsu, Lirika ou Pati passeiam pelas ruas do mapa de vez em quando,
// com o visual do palco, e nunca aparecem para a própria conta.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const js=fs.readFileSync(path.join(__dirname,'..','tw-mapa.js'),'utf8');
const ini=js.indexOf('  var visitaEtiquetas=[];'),fim=js.indexOf('  function passeantes(registro){');
assert.ok(ini>0&&fim>ini,'bloco da visita');
const bloco=js.slice(ini,fim);
function rodar(nick,agora){
  const c=[{nome:'tsu',out:'a'},{nome:'lirika',out:'b'},{nome:'pati',out:'c'}];
  const ctx={Math,Date:{now:()=>agora},String,contaJ:nick?{nick}:null,reduzMov:false,
    HUB_TRIO:[[0,'nyan',.2,'tsu',6],[1,'mic',.5,'lirika',3],[2,'v',.78,'pati',2]],HUB_TRIO_DRAW_CHARS:c,CH:[{out:'a'},{out:'b'},{out:'c'}],
    trajetoRua:()=>[0,0,0,0,0,0]};
  vm.createContext(ctx);vm.runInContext(bloco+';this.v=visitaOshi;this.f=VISITA_FALAS;',ctx);return ctx;
}
// procura, para cada membro, horários em que ele visitaria a Praça
const base=Date.UTC(2026,10,15,12),achados={};
for(let f=0;f<3000&&Object.keys(achados).length<3;f++){
  const t=base+f*8*60000,v=rodar('',t).v('praca');if(v&&!(v.oshi in achados))achados[v.oshi]=t;
}
assert.deepEqual(Object.keys(achados).sort(),['Lirika','Pati','Tsu'],'os três aparecem em algum momento');
for(const [quem,t] of Object.entries(achados)){
  for(const eu of [quem,quem.toUpperCase(),' '+quem.toLowerCase()+' ']){
    const v=rodar(eu,t).v('praca');
    assert.ok(v&&v.oshi!==quem,`${eu.trim()} logado não encontra a si mesmo (veio ${v&&v.oshi})`);
  }
  assert.equal(rodar('Fulana',t).v('praca').oshi,quem,'para os outros o sorteio é o mesmo');
}
assert.equal(rodar('',base).v('mundo'),null,'no mapa-múndi não há visita');
// nem sempre tem visita (≈45% das fatias de 8 minutos)
let com=0;for(let f=0;f<400;f++)if(rodar('',base+f*8*60000).v('arena'))com++;
assert.ok(com>120&&com<240,'visita de vez em quando: '+com+'/400');
const F=rodar('',base).f;['pt','en','es','id','th','ja'].forEach(l=>assert.equal(F[l].length,3,'falas em '+l));
assert.ok(/andar\(tm\);nomesDasPortas\(\);desenharEtiquetasVisita\(tm\);/.test(js),'etiqueta por cima das placas');
assert.ok(/if\(\(o\.dono\|\|o\.oshi\)&&Math\.abs/.test(js),'bichinhos reagem a quem visita');
console.log('OK: visita surpresa do Tsu, da Lirika e do Pati');
