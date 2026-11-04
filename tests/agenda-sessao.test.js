'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const faCode = fs.readFileSync(path.join(root, 'fa.js'), 'utf8');
const hubCode = fs.readFileSync(path.join(root, 'hub.js'), 'utf8');

test('Pedido de fã não recebe resultado antigo se trocar Google mantendo apelido', async () => {
  const requests = [];
  const scope = {
    contaJ:{nick:'MesmoNick'}, contaAuthUserId:'A', contaSessaoToken:1,
    contaRpc: () => new Promise(resolve => requests.push(resolve)),
    faOv:{hidden:true}, $:()=>null, sfx:null, hubAgendaUI:()=>{}
  };
  vm.runInNewContext(faCode, scope, {filename:'fa.js'});
  scope.faAbrir();
  assert.equal(requests.length, 1);
  scope.contaAuthUserId = 'B';
  scope.contaSessaoToken++;
  requests[0]({ok:true,tipo:'corridas3',meta:3,progresso:2});
  await Promise.resolve(); await Promise.resolve();
  assert.equal(scope.faDadosAtuais(), null, 'não mostrar pedido da conta A na conta B');
  assert.equal(scope.faDados, null, 'descartar resposta atrasada');

  scope.faAbrir();
  requests[1]({ok:true,tipo:'corridas3',meta:3,progresso:1});
  await Promise.resolve(); await Promise.resolve();
  assert.equal(scope.faDadosAtuais().progresso, 1);

  scope.faEntregar({disabled:false});
  scope.contaAuthUserId = 'A';
  scope.contaSessaoToken++;
  scope.faAbrir();
  requests[3]({ok:true,tipo:'corridas3',meta:3,progresso:0,resgatado:false});
  await Promise.resolve(); await Promise.resolve();
  requests[2]({ok:true,cartas:5}); // entrega iniciada pela conta B, já na conta A
  await Promise.resolve(); await Promise.resolve();
  assert.equal(scope.faDadosAtuais().resgatado, false, 'entrega da conta B não altera o cartão da conta A');
});

test('Agenda limpa o compromisso temporário ao trocar conta com o mesmo apelido', () => {
  const start = hubCode.indexOf('var hubAgendaFoco =');
  const end = hubCode.indexOf('// Pedido de fã é apenas uma opção', start);
  assert.ok(start >= 0 && end > start);
  const scope = {contaJ:{nick:'MesmoNick'},contaAuthUserId:'A'};
  vm.runInNewContext(hubCode.slice(start, end), scope);
  assert.equal(scope.hubAgendaFocoAtual(), '');
  scope.hubAgendaFoco = 'cafe';
  assert.equal(scope.hubAgendaFocoAtual(), 'cafe');
  scope.contaAuthUserId = 'B';
  assert.equal(scope.hubAgendaFocoAtual(), '');
  assert.equal(scope.hubAgendaFoco, '');
});
