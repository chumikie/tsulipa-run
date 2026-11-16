'use strict';
// Piloto TsuBuddy⭐: estados locais e proporções móveis; backend sempre simulado.
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const hub=fs.readFileSync(path.join(root,'hub.js'),'utf8');
const css=fs.readFileSync(path.join(root,'hub.css'),'utf8');
const perf=fs.readFileSync(path.join(root,'perfil.js'),'utf8');
test('Hub não cria companion nem mantém animação ou atalhos flutuantes',()=>{
  assert.doesNotMatch(hub,/hubBuddy|HUB_BUDDY/);
  assert.doesNotMatch(css,/hubbuddy/);
  assert.doesNotMatch(perf,/hubBuddy/);
});

function primeiraFoto(avatarNoServidor=null){
  let confirmar,rejeitar;
  const salvamento=new Promise((ok,erro)=>{confirmar=ok;rejeitar=erro;}),chamadas=[];
  const ctx={contaJ:{nick:'Idol'},contaSessaoToken:7,perfMeuAv:null,perfDono:[],perfAdmin:false,
    perfLojaSincronizar(){},perfGuardarCor(){},perfIconeConta(){chamadas.push('atualizar_icone');},
    perfAvAtual(){return {c:{out:'seifuku',baixo:'saia'},auto:true,pose:'v'};},
    contaRpc(nome,argumentos){
      chamadas.push(nome);
      if(nome==='meu_perfil')return Promise.resolve({avatar:avatarNoServidor,visuais:[]});
      if(nome==='salvar_avatar'){chamadas.push(argumentos.p_avatar);return salvamento;}
      throw Error('RPC inesperada: '+nome);
    }};
  const trecho=perf.slice(perf.indexOf('function perfAvatarAuto(){'),perf.indexOf('function perfSortear(){'));
  vm.runInNewContext(trecho,ctx);
  return {ctx,chamadas,confirmar,rejeitar,completar:()=>new Promise(resolve=>setImmediate(resolve))};
}

test('TsuBuddy: primeira foto automática só aparece após confirmação positiva do servidor',async()=>{
  const s=primeiraFoto();s.ctx.perfAvatarAuto();await s.completar();
  assert.equal(s.ctx.perfMeuAv,null,'sem prévia de avatar ainda não salvo');
  assert.deepEqual(s.chamadas.filter(x=>x==='salvar_avatar'),['salvar_avatar']);
  const enviada=s.chamadas.find(x=>x&&typeof x==='object');
  s.confirmar({ok:true});await s.completar();
  assert.equal(s.ctx.perfMeuAv,enviada,'usa exatamente o visual enviado, sem save adicional');
  assert.equal(s.chamadas.filter(x=>x==='atualizar_icone').length,2,'desenha novamente ao confirmar');
});

test('TsuBuddy: falha, troca de sessão e escolha manual não substituem o visual',async()=>{
  const falha=primeiraFoto();falha.ctx.perfAvatarAuto();await falha.completar();
  falha.confirmar({ok:false,erro:'roupa_nao_comprada'});await falha.completar();
  assert.equal(falha.ctx.perfMeuAv,null);
  const sessao=primeiraFoto();sessao.ctx.perfAvatarAuto();await sessao.completar();
  sessao.ctx.contaSessaoToken=8;sessao.confirmar({ok:true});await sessao.completar();
  assert.equal(sessao.ctx.perfMeuAv,null,'resposta atrasada não aparece em outra sessão');
  const manual=primeiraFoto();manual.ctx.perfAvatarAuto();await manual.completar();
  const escolhida={c:{out:'sweet'},auto:false};manual.ctx.perfMeuAv=escolhida;
  manual.confirmar({ok:true});await manual.completar();
  assert.equal(manual.ctx.perfMeuAv,escolhida,'foto manual tem prioridade');
  const rede=primeiraFoto();rede.ctx.perfAvatarAuto();await rede.completar();
  rede.rejeitar(new Error('offline'));await rede.completar();
  assert.equal(rede.ctx.perfMeuAv,null,'erro de rede não cria um avatar falso');
});

test('TsuBuddy: fotografia escolhida previamente mantém-se sem novo salvamento',async()=>{
  const avatar={c:{out:'zipper'},pose:'coracao',auto:false};
  const s=primeiraFoto(avatar);s.ctx.perfAvatarAuto();await s.completar();
  assert.equal(s.ctx.perfMeuAv,avatar);
  assert.equal(s.chamadas.includes('salvar_avatar'),false);
});
