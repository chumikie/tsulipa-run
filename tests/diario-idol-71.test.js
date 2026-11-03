'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const fonte = nome => fs.readFileSync(path.join(__dirname, '..', nome), 'utf8');
const handshake = fonte('handshake.js'), cafe = fonte('cafe.js'), jornal = fonte('jornal.js');
function trecho(src, inicio, fim){
  const a = src.indexOf(inicio), b = src.indexOf(fim, a + inicio.length);
  assert.ok(a >= 0 && b > a, 'trecho deve existir: ' + inicio);
  return src.slice(a, b);
}

test('Handshake guarda apenas lembrança local de fã fictício, limitada e isolada por conta', () => {
  const dados = new Map(), conta = { id:'jogador1', nick:'Jogador' };
  const ctx = {
    contaJ:conta, HS_NOMES:['Momo','Nana','Lulu','Yumi','Kiko','Rafi','Toto','Pipo','Mel'],
    HS_PRESENTES:[['🎀','Laço'],['💌','Carta']], Date, Number, Object, JSON,
    localStorage:{getItem:k=>dados.get(k)||null,setItem:(k,v)=>dados.set(k,v)}
  };
  vm.createContext(ctx);
  vm.runInContext(trecho(handshake, 'var HS_MEMORIA_CHAVE =', 'function hsRecorde()'), ctx);
  vm.runInContext("hsMemGuardar({nome:'Momo',pres:1,jeito:'fofo',c:{hair:'#ff88aa',out:'uniforme'}})", ctx);
  assert.equal(ctx.hsMemLer().length, 1);
  assert.equal(ctx.hsMemLer()[0].nome, 'Momo');
  assert.equal(ctx.hsMemLer()[0].c.hair, '#ff88aa');
  vm.runInContext("hsMemGuardar({nome:'Momo',pres:0,c:{hair:'#eeeeee'}})", ctx);
  assert.equal(ctx.hsMemLer().length, 1, 'reencontro não duplica nomes');
  assert.equal(ctx.hsMemLer()[0].pres, 0);
  vm.runInContext("hsMemGuardar({nome:'Um jogador real',pres:0,c:{}})", ctx);
  assert.equal(ctx.hsMemLer().length, 1, 'só fãs do catálogo NPC');
  for(const nome of ctx.HS_NOMES.slice(1)) ctx.hsMemGuardar({nome,pres:0,c:{}});
  assert.equal(ctx.hsMemLer().length, 8, 'limite máximo de lembranças');
  conta.id = 'jogador2';
  assert.equal(ctx.hsMemLer().length, 0, 'não mistura contas no mesmo aparelho');
  conta.id = '';
  conta.nick = '';
  assert.equal(ctx.hsMemLer().length, 0, 'visitante não herda lembranças');
});

test('Café reencontra fã conhecido sem alterar o pedido validado no servidor', () => {
  const pedidoServidor = {base:1,cob:0,enf:2,doce:-1};
  const ctx = {
    Date, cf:{atendidos:0,servidor:{pedido:pedidoServidor}},
    cfT:100, HS_JEITOS:{fofo:{},timido:{}},
    hsSorteio:()=>()=>0.5, hsNomesLivres:()=>['Momo','Nana'],
    hsFa:(r,nome)=>({nome,c:{hair:'#000',out:'#abc'},jeito:'fofo'}),
    hsMemLer:()=>[{nome:'Momo',pres:1,c:{hair:'#ff88aa'},jeito:'timido'}],
    cfPedido:()=>({base:0,cob:-1,enf:0,doce:-1}), cfUI:()=>{}
  };
  vm.createContext(ctx);
  vm.runInContext(trecho(cafe,'function cfNovoClienteLocal(){','function cfNovoCliente(){'),ctx);
  ctx.cfNovoClienteLocal();
  assert.equal(ctx.cf.cli.nome,'Momo');
  assert.equal(ctx.cf.cli.c.hair,'#ff88aa','visual do Handshake reaproveitado');
  assert.equal(ctx.cf.cli.hsLembranca.pres,1);
  assert.equal(ctx.cf.cli.pedido,pedidoServidor,'o reencontro não reescreve o desafio validado');
  ctx.cf.atendidos=1; ctx.cfNovoClienteLocal();
  assert.equal(ctx.cf.cli.hsLembranca,undefined,'reencontro especial só no primeiro cliente');
});

test('Diário narra as duas cenas públicas do dia e nunca usa fotos privadas ou especiais', () => {
  const box = { innerHTML:'' };
  const ctx = {
    $:id=>id==='jornalDiarioDia'?box:null, tr:s=>s,
    escHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'),
    jornalLegenda:f=>f.cena[1]+' '+f.grupo.map(p=>p.nick).join(' e ')
  };
  vm.createContext(ctx);
  vm.runInContext(trecho(jornal,'function jornalDiarioTexto(','function jornalFotosDia(){'),ctx);
  const fotos = [
    {cena:['palco','ensaiando'],grupo:[{nick:'Pati'},{nick:'Lirika'}]},
    {tipo:'pet',cena:['cafe','pet'],grupo:[{nick:'Jogador'}]},
    {cena:['cafe','no Happy⭐Cafe!'],grupo:[{nick:'Tsu'},{nick:'Momo'}]},
    {tipo:'telao',cena:['palco','telão'],grupo:[{nick:'Cantora'},{nick:'Outra'}]}
  ];
  ctx.jornalDiarioUI(fotos);
  assert.match(box.innerHTML,/Pati/);
  assert.match(box.innerHTML,/Lirika/);
  assert.match(box.innerHTML,/Tsu/);
  assert.doesNotMatch(box.innerHTML,/Jogador|Cantora/);
  assert.equal((box.innerHTML.match(/<li>/g)||[]).length,3);
  ctx.jornalDiarioUI([]);
  assert.match(box.innerHTML,/O diário aparece/);
  assert.match(jornal,/jornalDiarioUI\(fotos\);/,'atualiza com o sorteio real de fotos');
});
