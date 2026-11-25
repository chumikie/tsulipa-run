const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function tela(){
  const elementos = {}, eventos = {}, pedidos = [];
  let temporizador;
  const jogo = vm.createContext({
    duoOv: { hidden:false, addEventListener(tipo, fn){ eventos[tipo] = fn; } },
    $(id){ return elementos[id] ||= { isConnected:true, addEventListener(){} }; },
    contaJ:{ nick:'Tsu' }, petPhoneContaChave(){ return jogo.contaJ.nick; },
    duoGu:{ nick:'Pati' }, duoAnim:1, cancelAnimationFrame(){},
    tr:String, escHtml:String, perfPoseAtras(){},
    setTimeout(fn){ temporizador = fn; return 1; }, clearTimeout(){},
    contaRpc(){ return new Promise((resolve, reject) => pedidos.push({resolve, reject})); }
  });
  for(const arquivo of ['duo.js','duo-tela.js']) vm.runInContext(fs.readFileSync(arquivo,'utf8'), jogo);
  const campo = { id:'duoBusca', isConnected:true };
  return { jogo, pedidos, buscar(nome){
    campo.value = nome;
    eventos.input({ target:campo });
    temporizador();
  }};
}
const aguardar = () => new Promise(resolve => setImmediate(resolve));

test('a busca mantém a consulta mais recente e explica o resultado vazio e a falha', async () => {
  const {jogo, pedidos, buscar} = tela();
  const box = jogo.$('duoRes');
  box.innerHTML = 'resultado antigo';
  buscar('Pa');
  assert.match(box.innerHTML, /Carregando/);
  buscar('Ts');
  pedidos[1].resolve([{nick:'TSU'}]);
  await aguardar();
  assert.match(box.innerHTML, /Ninguém/);
  pedidos[0].resolve([{nick:'Pati'}]);
  await aguardar();
  assert.match(box.innerHTML, /Ninguém/);
  buscar('Li');
  pedidos[2].reject(Error('offline'));
  await aguardar();
  assert.match(box.innerHTML, /servidor/);
});

test('trocar de parceiro recolhe o palco e uma falha atrasada respeita a troca de conta', async () => {
  const {jogo, pedidos} = tela();
  jogo.$('duoEscolha').hidden = true;
  jogo.duoCarregar('Lirika');
  assert.equal(jogo.$('duoPalco').hidden, true);
  assert.equal(jogo.$('duoEscolha').hidden, false);
  assert.equal(jogo.duoGu, null);
  assert.equal(jogo.duoAnim, 0);
  jogo.contaJ = {nick:'Pati'};
  let avisos = 0;
  jogo.duoEscolhaUI = () => avisos++;
  pedidos[0].reject(Error('offline'));
  await aguardar();
  assert.equal(avisos, 0);
});
