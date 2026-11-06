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
const buddy=hub.slice(hub.indexOf('var HUB_BUDDY_TXT ='),hub.indexOf('var HUB_ROUPA_TEMA ='));

function simular(largura,altura,calmo=false){
  const chamadas=[],pecas={};
  const elemento=(nome)=>({nome,hidden:false,style:{},attrs:{},dataset:{buddy:nome},
    setAttribute(chave,valor){this.attrs[chave]=valor;},focus(){chamadas.push('foco');}});
  for(const nome of ['menu','mostrar','perfil','pet','missoes','recolher','painel'])pecas[nome]=elemento(nome);
  const contexto2d={clearRect(){},drawImage(){chamadas.push('quadro');}};
  const canvas={width:96,height:110,getContext:()=>contexto2d};
  pecas.menu.querySelector=(seletor)=>seletor==='canvas'?canvas:null;
  const seletores={'#hubBuddyMenu':pecas.painel,'[data-buddy="menu"]':pecas.menu,
    '[data-buddy="mostrar"]':pecas.mostrar,'[data-buddy="perfil"]':pecas.perfil,
    '[data-buddy="pet"]':pecas.pet,'[data-buddy="missoes"]':pecas.missoes,
    '[data-buddy="recolher"]':pecas.recolher};
  const el=elemento('buddy');el.hidden=true;el.listeners={};
  el.addEventListener=(nome,fn)=>el.listeners[nome]=fn;
  el.querySelector=(chave)=>seletores[chave]||null;
  const nodes={hubTut:{hidden:true},hubMisPainel:{scrollIntoView(op){chamadas.push('rolagem:'+op.behavior);}}};
  const cards={perfil:{click(){chamadas.push('abrir-perfil');}},pet:{click(){chamadas.push('abrir-pet');}}};
  const hubOv={hidden:false,scrollTop:0,contains:()=>false,appendChild(n){nodes[n.id]=n;},
    querySelector(sel){return sel.includes('data-ir="perfil"')?cards.perfil:sel.includes('data-ir="pet"')?cards.pet:null;}};
  const document={activeElement:{tagName:'BODY'},createElement(tipo){return tipo==='div'?el:{width:0,height:0,getContext:()=>contexto2d};}};
  const ctx={hubOv,hubComecou:true,hubT:0,LANG:'pt',contaJ:null,contaAuthUserId:'',perfMeuAv:null,
    window:{matchMedia:()=>({matches:calmo})},matchMedia:()=>({matches:calmo}),document,
    $(id){return nodes[id]||null;},
    perfDesenharIdol(_x,w,h,av,fundo,zoom){assert.equal(w,96);assert.equal(h,110);assert.equal(fundo,false);assert.equal(zoom,false);chamadas.push('desenhar:'+av.pose);},
    contaRpc(){throw Error('Não pode chamar backend');},localStorage:{setItem(){throw Error('Não pode salvar');}},
    setTimeout(){throw Error('Não pode criar timer');},requestAnimationFrame(){throw Error('Não pode criar loop');}};
  vm.runInNewContext(buddy,ctx);
  return {ctx,el,pecas,hubOv,document,chamadas,largura,altura,
    agir(acao){el.listeners.click({target:{closest(){return {dataset:{buddy:acao}};}}});}};
}

test('TsuBuddy só aparece após login, abertura do Hub e perfil salvo; sai sem deixar avatar',()=>{
  const s=simular(320,640),c=s.ctx;
  c.hubBuddyAtualizar();assert.equal(s.chamadas.length,0);
  c.contaJ={id:'A',nick:'Idol'};c.hubBuddyAtualizar();assert.equal(s.chamadas.length,0,'sem avatar salvo, nada de substituto local');
  c.perfMeuAv={c:[{hair:'rosa'}],pose:'',visual:'',expr:2};c.hubComecou=false;c.hubBuddyAtualizar();assert.equal(s.chamadas.length,0);
  c.hubComecou=true;c.hubBuddyAtualizar();assert.equal(s.el.hidden,false);
  assert.equal(s.chamadas.filter(x=>x.startsWith('desenhar:')).length,3,'os três quadros são cacheados');
  c.hubBuddyAtualizar();assert.equal(s.chamadas.filter(x=>x.startsWith('desenhar:')).length,3,'nenhuma renderização pesada repetida');
  s.hubOv.hidden=true;c.hubBuddyFrame(true);assert.equal(s.el.hidden,true,'o companion não aparece em outros jogos');
  s.hubOv.hidden=false;c.contaJ=null;c.perfMeuAv=null;c.hubBuddyLimpar();assert.equal(s.el.hidden,true);
  assert.equal(c.hubBuddyEstado.quadros,null,'frames descartados após logout');
});

test('TsuBuddy: menu, atalhos originais, recolher/mostrar e troca de conta',()=>{
  const s=simular(390,844),c=s.ctx;c.contaJ={id:'A',nick:'A'};c.perfMeuAv={c:[{}],pose:'coracao'};
  c.hubBuddyAtualizar();s.agir('menu');assert.equal(c.hubBuddyEstado.menu,true);
  s.agir('perfil');s.agir('menu');s.agir('pet');s.agir('menu');s.agir('missoes');
  assert.ok(s.chamadas.includes('abrir-perfil'));assert.ok(s.chamadas.includes('abrir-pet'));assert.ok(s.chamadas.includes('rolagem:smooth'));
  s.agir('menu');s.agir('recolher');assert.equal(s.pecas.menu.hidden,true);assert.equal(s.pecas.mostrar.hidden,false);
  s.agir('mostrar');assert.equal(s.pecas.menu.hidden,false);
  c.contaJ={id:'B',nick:'B'};c.perfMeuAv={c:[{hair:'azul'}],pose:'v'};c.hubBuddyAtualizar();
  assert.equal(c.hubBuddyEstado.dono,'B');assert.equal(c.hubBuddyEstado.recolhido,false);
  assert.equal(c.hubBuddyEstado.menu,false);
});

test('TsuBuddy: descanso, curiosidade, redução de movimento, tutorial e foco',()=>{
  const s=simular(320,640),c=s.ctx;c.contaJ={id:'A'};c.perfMeuAv={c:[{}],pose:''};c.hubBuddyAtualizar();
  c.hubT=30;c.hubBuddyFrame(true);assert.match(s.pecas.menu.style.transform,/translate/,'chegada discreta');
  c.hubT=370;c.hubBuddyFrame(true);assert.equal(c.hubBuddyEstado.ultimo.split(':')[0],'curioso');
  c.hubT=580;c.hubBuddyFrame(true);assert.match(s.pecas.menu.style.transform,/scaleY\(\.93\)/,'descansa sem re-renderizar avatar');
  s.hubOv.scrollTop=91;c.hubBuddyFrame(true);assert.equal(s.pecas.mostrar.hidden,false,'rolagem recolhe para pétala pequena');
  s.hubOv.scrollTop=0;s.document.activeElement={tagName:'INPUT'};s.hubOv.contains=()=>true;c.hubBuddyFrame(true);assert.equal(s.el.hidden,true,'não cobre digitação');
  s.document.activeElement={tagName:'BODY'};s.hubOv.contains=()=>false;s.ctx.$('hubTut').hidden=false;c.hubBuddyFrame(true);assert.equal(s.el.hidden,true,'não cobre o tutorial');
  const reduced=simular(390,844,true);reduced.ctx.contaJ={id:'A'};reduced.ctx.perfMeuAv={c:[{}]};reduced.ctx.hubBuddyAtualizar();
  reduced.ctx.hubT=370;reduced.ctx.hubBuddyFrame(true);assert.equal(reduced.pecas.menu.style.transform,'none');
  assert.equal(reduced.ctx.hubBuddyEstado.ultimo.split(':')[0],'parado');
});

test('TsuBuddy: seis idiomas, segurança, integração e proporções 320×640 / 390×844',()=>{
  const s=simular(320,640),c=s.ctx;c.contaJ={id:'A'};c.perfMeuAv={c:[{}]};
  for(const lang of ['pt','es','en','id','th','ja']){
    c.LANG=lang;c.hubBuddyAtualizar();assert.ok(s.pecas.perfil.textContent.length>0,lang);
    assert.ok(s.pecas.menu.attrs['aria-label'].includes('TsuBuddy'),lang);
  }
  for(const [w,h] of [[320,640],[390,844]]){
    const botao=w<=360?78:96,menu=w<=360?152:176;
    assert.ok(botao+8<w && menu+8<w && 110+176+12<h,'atalho e menu cabem no visor '+w+'×'+h);
  }
  assert.match(css,/\.hubbuddy\[hidden\],\.hubbuddy \[hidden\]\{display:none!important\}/);
  assert.match(css,/@media\(max-width:360px\)/);
  assert.match(css,/safe-area-inset-bottom/);
  assert.match(hub,/hubBuddyFrame\(false\);\s*hubAnim = requestAnimationFrame\(hubLoop\)/,'reusa o loop do Hub');
  assert.match(perf,/if\(typeof hubBuddyAtualizar==='function'\)hubBuddyAtualizar\(\)/,'foto salva atualiza o buddy');
  assert.doesNotMatch(buddy,/\b(?:contaRpc|localStorage|setInterval|setTimeout|requestAnimationFrame)\s*\(/);
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
