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

test('Diário cria três atos com a mesma dupla, sem misturar fotos privadas', () => {
  const box = { innerHTML:'' };
  const ctx = {
    $:id=>id==='jornalDiarioDia'?box:null, tr:s=>s,
    escHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'),
    jornalLegenda:f=>f.cena[1]+' '+f.grupo.map(p=>p.nick).join(' e ')
  };
  vm.createContext(ctx);
  vm.runInContext(trecho(jornal,'var JORNAL_DIARIO_ARCOS =','function jornalFotosDia(){'),ctx);
  const fotos = [
    {cena:['palco','ensaiando'],grupo:[{nick:'Pati'},{nick:'Lirika'}]},
    {tipo:'pet',cena:['cafe','pet'],grupo:[{nick:'Jogador'}]},
    {cena:['cafe','no Happy⭐Cafe!'],grupo:[{nick:'Tsu'},{nick:'Momo'}]},
    {tipo:'telao',cena:['palco','telão'],grupo:[{nick:'Cantora'},{nick:'Outra'}]}
  ];
  ctx.jornalDiarioUI(fotos);
  assert.match(box.innerHTML,/Pati/);
  assert.match(box.innerHTML,/Lirika/);
  assert.doesNotMatch(box.innerHTML,/Tsu|Momo/,'personagens de outra foto não invadem a história');
  assert.doesNotMatch(box.innerHTML,/Jogador|Cantora/);
  assert.equal((box.innerHTML.match(/<li>/g)||[]).length,3);
  assert.match(box.innerHTML,/Começo/);
  assert.match(box.innerHTML,/Reviravolta/);
  assert.match(box.innerHTML,/Final/);
  ctx.jornalDiarioUI([]);
  assert.match(box.innerHTML,/O diário aparece/);
  assert.match(jornal,/jornalDiarioUI\(fotos\);/,'atualiza com o sorteio real de fotos');
});

test('12 cenários têm começo, meio e fim estáveis por dia',()=>{
  const ctx={tr:s=>s,Date};
  vm.createContext(ctx);
  vm.runInContext(trecho(jornal,'var JORNAL_DIARIO_ARCOS =','function jornalFotosDia(){'),ctx);
  for(const tema of ['palco','cafe','ceu','noite','basico','oshi','figurinos','aniversario','cartas','bastidores','estudio','jardim']){
    const f={dia:20761,cena:['basico','📝','',[],tema],grupo:[{nick:'Pati'},{nick:'Lirika'}]};
    const a=ctx.jornalDiarioTexto([f]),b=ctx.jornalDiarioTexto([f]);
    assert.equal(a.length,3);
    assert.match(a[0],/Pati/);
    assert.equal(JSON.stringify(a),JSON.stringify(b),'história estável para '+tema);
  }
});

test('novidades reais só citam placares públicos, sem inventar atividade privada',()=>{
  const ctx={tr:s=>s,jornalNum:n=>Number(n).toLocaleString('pt-BR'),
    escHtml:s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;')};
  vm.createContext(ctx);
  vm.runInContext(trecho(jornal,'function jornalFeitosPublicos(','function jornalFotosDia(){'),ctx);
  const feitos=ctx.jornalFeitosPublicos({
    center:[{nick:'Jogador A',score:12345}],
    sora:[{nick:'Jogadora B',score:567}],
    karaoke:[{nick:'<b>Teste</b>',score:23456}],
    cafe:[{nick:'Cliente privado',score:999}],
    handshake:[{nick:'Fã privado',score:999}]
  });
  assert.equal(feitos.length,3);
  assert.ok(feitos.some(x=>x.includes('Jogador A')&&x.includes('Center⭐Run!')));
  assert.ok(feitos.some(x=>x.includes('Jogadora B')&&x.includes('Sora⭐Jump!')));
  assert.ok(!feitos.some(x=>x.includes('Cliente privado')||x.includes('Fã privado')));
  const html=ctx.jornalFeitosHtml({karaoke:[{nick:'<b>Teste</b>',score:23456}]});
  assert.equal(html.includes('<b>Teste</b>'),false,'apelidos do ranking escapados no HTML');
  assert.match(html,/&lt;b>/);
  assert.equal(ctx.jornalFeitosPublicos({}).length,0,'sem placar, sem notícia inventada');
});
