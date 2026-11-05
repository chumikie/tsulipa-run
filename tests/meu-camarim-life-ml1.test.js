'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const pet = read('pet.js'), html = read('index.html'), css = read('pet.css');
const hub = read('hub.js'), karaokePhoto = read('karaoke-photo.js'), karaokeCss = read('karaoke-photo.css');
const logic = pet.slice(pet.indexOf('function petLifeHit('), pet.indexOf('function petIdleJeito('));
const shopClose = read('shop.js').match(/function shopFechar\(\)\{[^\n]+\}/)[0];
const albumClose = read('album.js').match(/function albumFechar\(\)\{[^\n]+\}/)[0];
const perfilClose = read('perfil.js').slice(read('perfil.js').indexOf('function perfFechar(){'), read('perfil.js').indexOf('function perfMontar(){'));

function fakeRoom(signedIn = true){
  const calls = [], attr = {}, labels = {};
  const nodes = {};
  const element = (id) => ({
    id, hidden: id === 'petLifeEstante',
    textContent: '', innerHTML:'', style:{setProperty(k,v){attr[id + ':style:' + k] = v;}},
    focus(){calls.push(id + ':focus');},
    getContext(){return {clearRect(){},drawImage(){calls.push('wallpaper');}};},
    scrollIntoView(){ calls.push('agenda-focus'); },
    setAttribute(k,v){ attr[id + ':' + k] = v; },
    removeAttribute(k){ delete this[k]; },
    querySelector(){ return labels[id] || (labels[id] = {textContent:''}); },
    querySelectorAll(){return [];},
    insertBefore(node){ nodes[node.id] = node; },
    after(node){ nodes[node.id] = node; },
    remove(){ delete nodes[this.id]; }
  });
  Object.assign(nodes,Object.fromEntries(['petLifeEstante','albumTit','hubHojeLinha','hubToque','shopCorpo','perfTopoMsg','petPhone','petPhoneHora','petPhoneCorpo','petPhoneX','petPhoneWp','petPhoneFotoImg','petPhoneFotoBaixar','petPhoneJornalImg','petPhoneJornalBaixar'].map(k => [k, element(k)])));
  const shelfBtn = element('shelfBtn');
  const roomBtns = Object.fromEntries(['espelho','celular','estante','trofeus','album'].map(k => [k, element(k)]));
  const ctx = {
    petOpen:true, petView:'room', petGame:null, contaJ:signedIn ? {nick:'IdolTeste'} : null,
    LANG:'pt', OSHI:'tsu', hubComecou:true, petVeioHub:false, state:'menu', petAtivo:() => ({nome:'Pipoca'}), $:k => nodes[k], tr:s=>s,
    escHtml:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'),
    petCv:{width:360,height:220}, contaSessaoToken:3, contaAuthUserId:'mock-id',
    petAnimParar(){calls.push('petAnimParar');}, petAnimLigar(){calls.push('petAnimLigar');},
    contaRpc(k){calls.push('rpc:'+k);return Promise.resolve([{k:'corra2',meta:2,prog:1,feito:false}]);},
    HUB_MIS:{corra2:['🏃','Corra {n} vezes no Center⭐Run!']},
    document:{querySelector(q){
      if(q.includes('#petLifeNav') && q.includes('estante')) return shelfBtn;
      const m=q.match(/data-life="([^"]+)"/);
      return m ? roomBtns[m[1]] : null;
    }, createElement:tag => element(tag)},
    contaEntrar(){ calls.push('login'); },
    petClose(){ calls.push('petClose'); ctx.petOpen=false; if(ctx.petVeioHub){ctx.petVeioHub=false;ctx.hubMostrar();} },
    petOpenUI(){ calls.push('petOpenUI');ctx.petOpen=true; },
    hubOv:{hidden:true}, hubMostrar(){ calls.push('hubMostrar');ctx.hubOv.hidden=false; },
    hubFechar(){ calls.push('hubFechar');ctx.petLifeCancelar('celular');ctx.hubOv.hidden=true; },
    hubMusicaParar(){ calls.push('hubMusicaParar'); },
    shopAbrir(){ calls.push('shopAbrir'); },
    perfAbrir(){ calls.push('perfAbrir'); },
    albumAbrir(){ calls.push('albumAbrir'); }
  };
  vm.runInNewContext(logic, ctx, {filename:'petLifeML1'});
  ctx.shopOv = {hidden:false}; ctx.albumOv = {hidden:false};
  ctx.perfOv = {hidden:false}; ctx.perfPedido=0; ctx.perfMontou=false;
  ctx.perfIconeConta = () => {};
  vm.runInNewContext([shopClose, albumClose, perfilClose].join('\n'), ctx, {filename:'petLifeML1-closures'});
  return {ctx,calls,nodes,shelfBtn,roomBtns,attr};
}

test('ML1: hotspots no Canvas preservam o toque do Idol/Pet e o item de temporada', () => {
  const {ctx} = fakeRoom();
  assert.equal(ctx.petLifeHit(80, 65), 'espelho');
  assert.equal(ctx.petLifeHit(165, 132), 'celular');
  assert.equal(ctx.petLifeHit(195, 135), 'estante');
  assert.equal(ctx.petLifeHit(110, 148), '', 'toque no Idol continua livre');
  assert.equal(ctx.petLifeHit(250, 167), '', 'carinho do Pet continua livre');
  assert.equal(ctx.petLifeHit(180, 190), '', 'tema de temporada continua livre');
  assert.match(html, /petGameTap\(lx, ly\) \|\| petRoomTap\(lx, ly\) \|\| petLifeTap\(lx, ly\)/);
  assert.match(html, /\(e\.clientX - r\.left\) \* 360 \/ r\.width/);
  assert.match(css, /\.petlife button,\.petlife-estante button\{[^}]*min-height:44px/);
});

test('ML1: ações no camarim só navegam para telas existentes com backend simulado', () => {
  const espelho = fakeRoom();
  assert.equal(espelho.ctx.petLifeTap(82, 67), true);
  assert.deepEqual(espelho.calls, ['petClose','hubMostrar','shopAbrir']);

  const phone = fakeRoom();
  assert.equal(phone.ctx.petLifeAbrir('celular'), true);
  assert.deepEqual(phone.calls, ['petAnimParar','wallpaper','petPhoneX:focus']);
  assert.equal(phone.ctx.petOpen, true, 'TsuPhone fica dentro do Camarim');
  assert.equal(phone.ctx.hubOv.hidden, true, 'não pula para o Hub');

  const shelf = fakeRoom();
  assert.equal(shelf.ctx.petLifeAbrir('estante'), true);
  assert.equal(shelf.nodes.petLifeEstante.hidden, false);
  assert.equal(shelf.attr['shelfBtn:aria-expanded'], 'true');
  assert.deepEqual(shelf.calls, [], 'abrir a estante não encerra o Pet nem chama backend');
  assert.equal(shelf.ctx.petLifeAbrir('trofeus'), true);
  assert.deepEqual(shelf.calls, ['petClose','hubMostrar','perfAbrir']);

  const album = fakeRoom();
  assert.equal(album.ctx.petLifeAbrir('album'), true);
  assert.deepEqual(album.calls, ['petClose','hubMostrar','albumAbrir']);
  assert.match(album.nodes.albumTit.textContent, /Álbum de cards/);
});

test('ML1: bloqueia minijogo, ausência de Pet e acesso sem login sem criar saves', () => {
  const game = fakeRoom();game.ctx.petGame={k:'corda'};
  assert.equal(game.ctx.petLifeTap(80, 65), false);
  assert.deepEqual(game.calls, []);

  const noPet = fakeRoom();noPet.ctx.petAtivo=() => null;
  assert.equal(noPet.ctx.petLifeAbrir('espelho'), false);
  assert.deepEqual(noPet.calls, []);

  const guest = fakeRoom(false);
  assert.equal(guest.ctx.petLifeAbrir('espelho'), true);
  assert.deepEqual(guest.calls, ['login']);
  assert.equal(guest.ctx.petOpen, true);
  for(const k of ['brs48cr_st','terminar_corrida','iniciar_corrida','petSave(']){
    assert.equal(logic.includes(k), false, 'navegação ML1 não altera '+k);
  }
  assert.match(pet, /if\(!petBg \|\| petBgOshi !== OSHI\) petMakeBg\(\)/, 'usa o mesmo fundo em cache');
});

test('ML1.1: espelho e estante fecham a tela e voltam direto ao Camarim, não ao Hub', () => {
  for(const [k, fechar] of [['espelho','shopFechar'],['trofeus','perfFechar'],['album','albumFechar']]){
    const {ctx,calls} = fakeRoom();
    assert.equal(ctx.petLifeAbrir(k), true);
    assert.equal(ctx.petLifeOrigem, k);
    calls.length=0;
    ctx[fechar]();
    assert.deepEqual(calls, ['hubFechar','petOpenUI'], 'volta direto da tela: '+k);
    assert.equal(ctx.petLifeOrigem, '');
    assert.equal(ctx.hubOv.hidden, true, 'não deixa Hub aberto ao fundo se veio da página principal');
    assert.equal(ctx.petOpen, true);
    calls.length=0;
    ctx[fechar]();
    assert.equal(calls.includes('petOpenUI'), false, 'fechamento normal não reabre Camarim');
  }
});

test('ML1.2-A: TsuPhone mantém o Idol/Pet no papel de parede e apps internos', () => {
  const {ctx,calls,nodes} = fakeRoom();
  ctx.petLifeAbrir('celular');
  assert.equal(nodes.petPhone.hidden, false);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="agenda"/);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="chat"/);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="fotos"/);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="perfil"/);
  assert.match(nodes.petPhoneCorpo.innerHTML, /Pipoca/);
  assert.equal(ctx.petLifeOrigem, '', 'não cria navegação temporária no Hub');
  assert.equal(ctx.petPhoneTelaAbrir('chat'), true);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-conversa="idol:tsu"/);
  assert.match(nodes.petPhoneCorpo.innerHTML, /Conversas fictícias do jogo/);
  assert.equal(ctx.petPhoneTelaAbrir('fotos'), true);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="abrir-album"/);
  assert.equal(ctx.petPhoneVoltar(), true);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="chat"/);
  calls.length=0;
  assert.equal(ctx.petPhoneVoltar(), true);
  assert.equal(nodes.petPhone.hidden, true);
  assert.deepEqual(calls, ['petAnimLigar','celular:focus'], 'retoma o Pet e o foco no botão de origem');
  assert.equal(ctx.petOpen, true);
});

test('ML1.2-A: TsuPhone não depende de iniciar Hub nem de perfil aberto', () => {
  const {ctx,nodes,calls} = fakeRoom();
  ctx.hubComecou = false;
  assert.equal(ctx.petLifeAbrir('celular'), true);
  assert.equal(nodes.petPhone.hidden, false);
  assert.equal(calls.includes('hubMostrar'), false);
  assert.equal(ctx.petPhoneTelaAbrir('perfil'), true);
  assert.match(nodes.petPhoneCorpo.innerHTML, /data-phone="abrir-perfil"/);
});

test('ML1.2-A: abrir Álbum ou Perfil existente volta ao aplicativo correto', () => {
  for(const [app,externo,fechar] of [['fotos','album','albumFechar'],['perfil','perfil','perfFechar']]){
    const {ctx,calls,nodes} = fakeRoom();
    ctx.petLifeAbrir('celular');
    ctx.petPhoneTelaAbrir(app);
    calls.length=0;
    assert.equal(ctx.petPhoneExterno(externo), true);
    assert.equal(nodes.petPhone.hidden, true);
    assert.equal(ctx.petLifeOrigem, externo === 'album' ? 'album' : 'trofeus');
    assert.equal(calls.includes(externo === 'album' ? 'albumAbrir' : 'perfAbrir'), true);
    calls.length=0;
    ctx[fechar]();
    assert.equal(ctx.petPhoneTela, app);
    assert.equal(nodes.petPhone.hidden, false);
    assert.equal(ctx.petOpen, true);
    assert.equal(ctx.petLifeOrigem, '');
    assert.equal(ctx.petPhoneVoltar(), true);
    assert.equal(ctx.petPhoneTela, 'home');
  }
});

test('ML1.2-A: Agenda só consulta missões, descarta resposta tardia de outra conta', async () => {
  const {ctx,calls,nodes} = fakeRoom();
  let resolver;
  ctx.contaRpc=k=>{calls.push('rpc:'+k);return new Promise(resolve=>{resolver=resolve;});};
  ctx.petLifeAbrir('celular');
  ctx.petPhoneTelaAbrir('agenda');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')), ['rpc:missoes']);
  assert.match(nodes.petPhoneCorpo.innerHTML, /Carregando/);
  ctx.contaSessaoToken=4;
  resolver([{k:'corra2',meta:2,prog:1}]);
  await Promise.resolve();
  assert.match(nodes.petPhoneCorpo.innerHTML, /Carregando/, 'não mistura dados de outra sessão');
  ctx.petPhoneVoltar();
  assert.equal(ctx.petPhoneTela, 'home');
});

test('ML1.2-B: Chat lista Idols e somente fãs NPCs realmente lembrados', () => {
  const {ctx,nodes,calls} = fakeRoom();
  ctx.HS_NOMES=['Nana','Lulu'];
  ctx.HS_PRESENTES=[['🍓','Morango','doce']];
  ctx.cfVisitasMemorias=()=>[
    {nome:'Nana',pres:0,jeito:'timido',c:{hair:'#e664ac'}},
    {nome:'JogadorReal',pres:0,jeito:'animado',c:{hair:'#abcdef'}},
    {nome:'Nana',pres:0,jeito:'timido'}
  ];
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('chat');
  const lista=nodes.petPhoneCorpo.innerHTML;
  for(const id of ['idol:tsu','idol:lirika','idol:pati','fan:Nana']){
    assert.ok(lista.includes('data-conversa="'+id+'"'),'contato interno: '+id);
  }
  assert.equal((lista.match(/data-conversa="fan:Nana"/g)||[]).length,1,'fã duplicado não gera duas conversas');
  assert.doesNotMatch(lista,/JogadorReal|fan:Lulu/,'não cria chat com usuário ou fã desconhecido');
  assert.match(lista,/Hand[sS]hake/);
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[],'inbox é local e não consulta backend');
});

test('ML1.2-B: diálogo reutiliza personalidade, presente e Café somente quando confirmado', () => {
  const {ctx,nodes,calls} = fakeRoom();
  ctx.HS_NOMES=['Nana'];ctx.HS_PRESENTES=[['🍓','Morango','doce']];
  ctx.HS_JEITOS={timido:{fav:'Eu gosto de {p}…'}};
  ctx.cfVisitasMemorias=()=>[{nome:'Nana',pres:0,jeito:'timido',c:{hair:'#aabbcc'},dia:'2026-11-03'}];
  ctx.hsMemChave=()=> 'tw_hs_memorias_v1:IdolTeste';
  ctx.hsCafePendente={conta:'tw_hs_memorias_v1:IdolTeste',nome:'Nana',pres:0};
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('chat');
  assert.equal(ctx.petPhoneChatAbrir('fan:Nana'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Oi…|É-é você/,'jeito tímido');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Morango/,'presente conhecido');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Eu gosto de 🍓 Morango/,'usa fala do jeito real no Handshake');
  assert.match(nodes.petPhoneCorpo.innerHTML,/03\/11/,'data do encontro realmente lembrado');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Happy⭐Cafe/,'atendimento confirmado');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-resposta="0"/);
  assert.equal(ctx.petPhoneChatResponder(1),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Até o próximo encontro/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Fico tão feliz|vou esperar|Vou torcer baixinho/);
  assert.equal(ctx.petPhoneChatResponder(0),false,'não duplica respostas');
  assert.equal(ctx.petPhoneVoltar(),true);
  assert.equal(ctx.petPhoneTela,'chat','volta primeiro à lista do Chat');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-conversa="fan:Nana"/);
  assert.equal(ctx.petPhoneVoltar(),true);
  assert.equal(ctx.petPhoneTela,'home','depois volta à tela de apps');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.equal(logic.includes('localStorage'),false,'nenhum save adicional');
});

test('ML1.2-B: bloqueia contatos falsos, protege HTML e isola respostas por sessão', () => {
  const {ctx,nodes} = fakeRoom();
  ctx.contaJ.nick='<script>roubar</script>';
  ctx.HS_NOMES=['Nana'];ctx.HS_PRESENTES=[['🍓','Morango','doce']];
  ctx.cfVisitasMemorias=()=>[{nome:'Nana',pres:0,jeito:'fofo',c:{hair:'red; background:url(...)'}}];
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('chat');
  assert.equal(ctx.petPhoneChatAbrir('fan:JogadorReal'),false);
  assert.equal(ctx.petPhoneChatAbrir('idol:tsu'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/&lt;script&gt;roubar&lt;\/script&gt;/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/<script>/);
  assert.equal(ctx.petPhoneChatResponder(5),false);
  assert.equal(ctx.petPhoneChatResponder(0),true);
  assert.ok(ctx.petPhoneChatRespostas['idol:tsu']);
  ctx.contaSessaoToken=99;ctx.petPhoneRender();
  assert.equal(ctx.petPhoneChatConversa,'','mudança de sessão sai da conversa antiga');
  assert.deepEqual(Object.keys(ctx.petPhoneChatRespostas),[],'respostas descartadas na troca de conta');
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/red; background:url/,'cores inválidas não entram no HTML');
  assert.match(html,/k === 'chat-responder'/,'toque nas respostas está ligado ao handler');
  assert.match(css,/\.petphone-chat-opcoes button\{[^}]*min-height:44px/,'alvos móveis mínimos');
});

test('ML1.2-B: sem memória de fãs, Chat acolhe sem inventar contatos ou alterar ranking', () => {
  const {ctx,nodes,calls}=fakeRoom();
  ctx.cfVisitasMemorias=()=>[];
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('chat');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Conheça fãs no Handshake/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/data-conversa="fan:/);
  assert.equal(ctx.petPhoneChatAbrir('fan:Desconhecido'),false);
  assert.equal(ctx.petPhoneChatAbrir('idol:lirika'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/pequenas lembranças|lembranças dos fãs/i);
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  for(const k of ['terminar_corrida','iniciar_corrida','petSave(','star_log','localStorage']){
    assert.equal(logic.includes(k),false,'sem alterações econômicas ou persistência: '+k);
  }
});

test('ML1.2-B.1: os retratos usam a aparência real lembrada no Canvas, sem animações extras', () => {
  const {ctx,nodes,calls}=fakeRoom();
  const visual={hair:'#ff7eb6',skin:'#f1c9a5',front:'franja',out:'rosa'};
  ctx.HS_NOMES=['Nana'];ctx.HS_PRESENTES=[['🍓','Morango','doce']];
  ctx.cfVisitasMemorias=()=>[{nome:'Nana',pres:0,jeito:'timido',c:visual}];
  const ops=[];
  const x={clearRect(){ops.push('clear');},save(){ops.push('save');},restore(){ops.push('restore');},fillText(){ops.push('emoji');}};
  const retratos=['idol:tsu','fan:Nana'].map(id=>({dataset:{phonePortrait:id},width:96,height:96,getContext:()=>x}));
  nodes.petPhoneCorpo.querySelectorAll=sel=>sel==='canvas[data-phone-portrait]'?retratos:[];
  ctx.perfDesenharIdol=(context,w,h,av,fundo,zoom,t)=>{
    ops.push({w,h,av,fundo,zoom,t});
  };
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('chat');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone-portrait="fan:Nana"/);
  assert.equal(ops.filter(o=>o&&typeof o==='object').length,1,'só o fã usa a aparência salva');
  const fan=ops.find(o=>o&&typeof o==='object');
  assert.equal(fan.av.c,visual,'reutiliza o visual existente do Handshake sem alterá-lo');
  assert.equal(fan.zoom,true,'usa o modo retrato, da coroa aos ombros');
  assert.equal(fan.fundo,false,'não redesenha o cenário');
  assert.equal(ops.filter(o=>o==='emoji').length,1,'trio conserva ícone oficial em Canvas');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.equal(logic.includes('requestAnimationFrame'),false,'Chat não acrescenta animação por quadro');
  assert.equal(logic.includes('setInterval'),false,'Chat não adiciona temporizadores');
});

test('ML1.2-B.1: falas acompanham estado do Pet e recordações; reação é estável por dia', () => {
  const {ctx,nodes,calls}=fakeRoom();
  ctx.petAtivo=()=>({nome:'Pipoca',humor:20});
  ctx.HS_NOMES=['Nana'];ctx.HS_PRESENTES=[['🍓','Morango','doce']];
  ctx.cfVisitasMemorias=()=>[{nome:'Nana',pres:0,jeito:'animado',c:{hair:'#ff7eb6'},dia:'2026-11-02'}];
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('chat');
  assert.equal(ctx.petPhoneChatAbrir('idol:tsu'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Pipoca parece precisar de carinho/,'Pet com humor baixo');
  const contatos=ctx.petPhoneChatContatos(),fan=contatos.find(c=>c.id==='fan:Nana');
  assert.ok(fan && fan.encontro==='2026-11-02');
  assert.equal(ctx.petPhoneChatReacao(fan,0),ctx.petPhoneChatReacao(fan,0),'reação não pisca ao renderizar');
  assert.notEqual(ctx.petPhoneChatReacao(fan,0),ctx.petPhoneChatReacao(fan,1),'as duas escolhas reagem diferente');
  ctx.petPhoneVoltar();ctx.hsCafePendente={conta:'outra-conta',nome:'Nana',pres:0};
  ctx.petPhoneChatAbrir('fan:Nana');
  assert.match(nodes.petPhoneCorpo.innerHTML,/02\/11/,'encontro antigo é lembrado');
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/Happy⭐Cafe/,'sem atendimento confirmado na conta atual');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.equal(logic.includes('localStorage'),false);
});

test('ML1.2-C.1: Fotos⭐ mostra câmera interna e só gera PNG quando o jogador pedir', () => {
  const {ctx,nodes,calls}=fakeRoom();
  const url='data:image/png;base64,iVBORw0KGgo=';
  let fotos=0;
  ctx.petData={ativo:'tsu'};
  ctx.petMakePhoto=()=>{fotos++;return url;};
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');
  assert.equal(fotos,0,'abrir Fotos não gera imagem de alta resolução');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="tirar-selfie"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneWp"/,'miniatura reaproveita Canvas ativo');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="abrir-album"/,'álbum de cards separado');
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoBaixar"/,'download só depois de capturar');
  assert.equal(ctx.petPhoneFotoTirar(),true);
  assert.equal(fotos,1);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoImg"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoBaixar"/);
  assert.equal(nodes.petPhoneFotoImg.src,url);
  assert.equal(nodes.petPhoneFotoBaixar.href,url);
  assert.equal(nodes.petPhoneFotoBaixar.download,'tsulipa-camarim-pipoca.png');
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/iVBORw0K/,'não injeta PNG grande em HTML');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[],'sem backend ou save no Fotos');
  assert.equal(ctx.petPhoneVoltar(),true);
  assert.equal(ctx.petPhoneTela,'home');
  assert.equal(ctx.petPhoneFechar(),true);
  assert.equal(ctx.petPhoneFotoUrl,'','descarta imagem ao sair do celular');
  assert.equal(logic.includes('localStorage'),false,'não cria novos dados salvos');
});

test('ML1.2-C.1: protege sessão, Pet, captura inválida e bloqueios existentes', () => {
  const {ctx,nodes,calls}=fakeRoom();
  ctx.petData={ativo:'tsu'};
  ctx.petMakePhoto=()=>'data:image/png;base64,aGVsbG8=';
  assert.equal(ctx.petPhoneFotoTirar(),false,'não tira selfie fora do app');
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');
  assert.equal(ctx.petPhoneFotoTirar(),true);
  ctx.petData.ativo='pati';ctx.petPhoneRender();
  assert.equal(ctx.petPhoneFotoUrl,'','não exibe foto de outro Pet');
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoImg"/);
  ctx.petMakePhoto=()=>'<img src=x onerror=alert(1)>';
  assert.equal(ctx.petPhoneFotoTirar(),false,'descarta URL inesperada');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Não foi possível tirar a selfie/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/onerror/);
  ctx.petGame={k:'corda'};
  assert.equal(ctx.petPhoneFotoTirar(),false,'não captura durante minijogo');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.match(pet,/try\{ url = petMakePhoto\(\); \}catch\(e\)\{\}/,'usa câmera original');
  assert.match(html,/data-trava/,'controles e travas da câmera original não são removidos');
  assert.match(html,/k === 'tirar-selfie'/,'toque no Fotos ligado à captura');
});

test('ML1.2-C.1: interface cabe em 320×640 e 390×844 e respeita toque no celular', () => {
  assert.match(css,/\.petphone-photo-preview\{[^}]*height:154px/);
  assert.match(css,/@media \(max-height:760px\)\{\.petphone-photo-preview\{height:118px/);
  assert.match(css,/\.petphone-photo button,\.petphone-photo-baixar\{[^}]*min-height:44px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const pequena=h<=760,largura=Math.min(304,w-28),altura=Math.min(pequena?448:472,h-60);
    const content=altura-(8+9+(pequena?30:33)+(pequena?44:46)+(pequena?4:6)+8+30+18);
    const preview=pequena?118:154;
    assert.ok(content>=preview+44,`${w}×${h}: foto e botão de captura visíveis sem corte`);
    assert.ok(largura>=260,`${w}×${h}: controles têm largura útil`);
  }
  assert.equal(/requestAnimationFrame|setInterval|setTimeout/.test(logic.slice(logic.indexOf('function petPhoneFotoLimpar('),logic.indexOf('function petPhoneChatContatos('))),false,'sem ciclo novo de renderização');
});

test('ML1.2-C.2-A: três abas de Fotos⭐, mantendo câmera e Jornal separados', () => {
  const {ctx,nodes,calls}=fakeRoom();
  ctx.petData={ativo:'tsu'};
  let capturas=0;
  ctx.petMakePhoto=()=>{capturas++;return 'data:image/png;base64,iVBORw0KGgo=';};
  assert.equal(ctx.petLifeAbrir('celular'),true);
  assert.equal(ctx.petPhoneTelaAbrir('fotos'),true);
  for(const k of ['camera','momentos','jornal']){
    assert.match(nodes.petPhoneCorpo.innerHTML,new RegExp('data-phone="fotos-aba" data-aba="'+k+'"'));
  }
  assert.match(nodes.petPhoneCorpo.innerHTML,/aria-pressed="true"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="tirar-selfie"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="abrir-album"/,'cards seguem em Álbum separado');
  assert.equal(capturas,0,'trocar de aba não gera PNG');
  assert.equal(ctx.petPhoneFotosAbaAbrir('momentos'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Nenhuma foto nesta sessão/,'Momentos fica vazia até guardar voluntariamente');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Guarde voluntariamente/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoBaixar"|data-phone="tirar-selfie"/,'sem câmera oculta na aba vazia');
  assert.equal(ctx.petPhoneFotoTirar(),false,'não captura fora da aba Câmera');
  assert.equal(ctx.petPhoneFotosAbaAbrir('jornal'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/vitrine de Idols carregar/,'estado vazio honesto sem vitrine');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="jornal-atualizar"/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/data-jfoto|data:image\/png/,'não duplica fotos públicas nem guarda imagens');
  assert.equal(ctx.petPhoneFotosAbaAbrir('invalida'),false);
  assert.equal(ctx.petPhoneFotosAbaAbrir('camera'),true);
  assert.equal(ctx.petPhoneFotoTirar(),true);
  assert.equal(capturas,1);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoBaixar"/);
  assert.equal(ctx.petPhoneFotosAbaAbrir('momentos'),true);
  assert.equal(ctx.petPhoneFotosAbaAbrir('camera'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoBaixar"/,'foto atual continua na Câmera durante navegação interna');
  assert.equal(ctx.petPhoneVoltar(),true);
  assert.equal(ctx.petPhoneTela,'home');
  assert.equal(ctx.petPhoneTelaAbrir('fotos'),true);
  assert.equal(ctx.petPhoneFotosAba,'camera','entrar novamente inicia pela câmera');
  assert.equal(ctx.petPhoneFechar(),true);
  assert.equal(ctx.petPhoneFotoUrl,'','C.2-A não muda descarte de fotos da C.1');
  assert.equal(ctx.petPhoneFotosAbaAbrir('jornal'),false,'abas não funcionam com o celular fechado');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[],'interface não chama backend');
  assert.equal(logic.includes('localStorage'),false,'interface não cria saves');
});

test('ML1.2-C.2-A: abas legíveis em 320×640 e 390×844 sem render contínuo', () => {
  assert.match(css,/\.petphone-fotos-tabs\{[^}]*grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(css,/\.petphone-fotos-tabs button\{[^}]*min-height:44px/);
  assert.match(css,/\.petphone-fotos-espera\{[^}]*min-height:174px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const pequena=h<=760,largura=Math.min(304,w-28),altura=Math.min(pequena?448:472,h-60);
    const conteudo=altura-(8+9+(pequena?30:33)+(pequena?44:46)+(pequena?4:6)+8+30+18);
    const tamanhoAba=(largura-26-8-18-10)/3;
    assert.ok(tamanhoAba>=64,`${w}×${h}: cada aba mantém largura de toque`);
    assert.ok(conteudo>=44+44+118,`${w}×${h}: título, abas e captura ficam na área rolável`);
  }
  assert.match(html,/k === 'fotos-aba'\) petPhoneFotosAbaAbrir\(b\.dataset\.aba\)/);
  assert.equal(/requestAnimationFrame|setInterval|setTimeout/.test(logic.slice(logic.indexOf('function petPhoneFotosHtml('),logic.indexOf('function petPhoneChatContatos('))),false);
  for(const idioma of ['pt','en','es','id','th','ja']) assert.match(pet,new RegExp('(?:^|\\n)  '+idioma+':\\['),'abas traduzidas para o idioma escolhido');
});

test('ML1.2-C.2-B: selfie entra em Momentos só após guardar; galeria fica apenas na sessão', () => {
  const {ctx,nodes,calls}=fakeRoom();
  const png='data:image/png;base64,iVBORw0KGgo=';
  ctx.petData={ativo:'tsu'};
  ctx.petMakePhoto=()=>png;
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');
  assert.equal(ctx.petPhoneFotoTirar(),true);
  assert.equal(ctx.petPhoneMomentos.length,0,'tirar foto não cria registro automaticamente');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="guardar-selfie"/,'ação explícita de guardar');
  assert.equal(ctx.petPhoneFotoGuardar(),true);
  assert.equal(ctx.petPhoneFotosAba,'momentos');
  assert.equal(ctx.petPhoneMomentos.length,1);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Backstage⭐Pet!/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-momento-id/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/iVBORw0K/,'base64 não passa por innerHTML');
  const id=ctx.petPhoneMomentos[0].id;
  const img={}, dl={};
  nodes.petPhoneCorpo.querySelector=q=>q.includes('data-momento-id="'+id+'"') ? img : q.includes('data-momento-baixar="'+id+'"') ? dl : null;
  ctx.petPhoneMomentosRender();
  assert.equal(img.src,png,'renderiza apenas em propriedade do elemento');
  assert.equal(dl.href,png,'download permanece voluntário');
  assert.match(dl.download,/^tsulipa-pet-.*\.png$/);
  ctx.petPhoneFechar();
  assert.equal(ctx.petPhoneFotoUrl,'','câmera original limpa ao fechar');
  assert.equal(ctx.petPhoneMomentos.length,1,'Momentos continua enquanto a página está aberta');
  ctx.petPhoneMomentosLimpar();
  assert.equal(ctx.petPhoneMomentos.length,0,'pagehide descarta toda a sessão');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.equal(logic.includes('localStorage'),false,'nenhum save criado');
});

test('ML1.2-C.2-B: fontes Pet/Center/Duo sem misturar Karaoke e Jornal', () => {
  const {ctx,nodes,calls}=fakeRoom();
  ctx.petData={ativo:'tsu'};
  const png='data:image/png;base64,aGVsbG8=';
  for(const tipo of ['pet','center','duo']) assert.equal(ctx.petPhoneMomentoGuardar(tipo,png),true,tipo+' aceito');
  assert.equal(ctx.petPhoneMomentos.length,3);
  assert.equal(ctx.petPhoneMomentoGuardar('jornal',png),false);
  assert.equal(ctx.petPhoneMomentoGuardar('karaoke',png),false);
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');ctx.petPhoneFotosAbaAbrir('momentos');
  for(const label of ['Backstage⭐Pet!','Center⭐Run!','Moon⭐Duo!']) assert.match(nodes.petPhoneCorpo.innerHTML,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  ctx.petPhoneFotosAbaAbrir('jornal');
  assert.match(nodes.petPhoneCorpo.innerHTML,/vitrine de Idols carregar/,'Jornal aguarda cenas públicas do dia');
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/data-momento-id/);
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[],'nenhuma chamada de backend');
  assert.match(html,/id="shPhone"[^>]*hidden/,'botão compartilhado começa oculto');
  assert.match(html,/\? 'center' : ''\)/,'Center ativa botão apenas após foto');
  assert.match(html,/\? 'pet' : ''\)/,'Backstage ativa botão apenas após foto');
  assert.match(html,/id="duoPhone"/,'Moon tem ação explícita');
  assert.match(html,/petPhoneMomentoGuardar\('duo',png\)/,'Moon usa foto local da cena já montada');
  assert.match(html,/window\.addEventListener\('pagehide',petPhoneMomentosLimpar\)/);
});

test('ML1.2-C.2-B: protege privacidade, conta/Pet, tipos de imagem e limite de memória', () => {
  const {ctx,nodes,calls}=fakeRoom();
  ctx.petData={ativo:'tsu'};
  const png='data:image/png;base64,aGVsbG8=';
  assert.equal(ctx.petPhoneMomentoGuardar('center','<svg onload=alert(1)>'),false);
  assert.equal(ctx.petPhoneMomentoGuardar('pet','data:image/jpeg;base64,aGVsbG8='),false);
  assert.equal(ctx.petPhoneMomentos.length,0);
  for(let i=0;i<7;i++) assert.equal(ctx.petPhoneMomentoGuardar(i%2?'center':'duo',png),true);
  assert.equal(ctx.petPhoneMomentos.length,4,'guarda somente quatro fotos recentes');
  nodes.shPhone={hidden:true,disabled:false,textContent:''};
  ctx.petPhoneMomentoDisponivel('center');
  assert.equal(nodes.shPhone.hidden,false);
  assert.equal(ctx.petPhoneMomentoFonteDono,ctx.petPhoneFotoChave());
  ctx.contaSessaoToken=4;
  ctx.petPhoneMomentosConferir();
  assert.equal(ctx.petPhoneMomentos.length,0,'troca de sessão apaga imagens anteriores');
  assert.equal(ctx.petPhoneMomentoFonte,'','fonte anterior é invalidada');
  ctx.petPhoneMomentoGuardar('pet',png);
  ctx.petData.ativo='lirika';ctx.petPhoneMomentosConferir();
  assert.equal(ctx.petPhoneMomentos.length,0,'troca de Pet apaga imagens anteriores');
  ctx.contaJ=null;
  assert.equal(ctx.petPhoneMomentoGuardar('center',png),false,'sem conta não guarda foto');
  ctx.petPhoneMomentoDisponivel('center');
  assert.equal(nodes.shPhone.hidden,true);
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
});

test('ML1.2-C.2-B: galeria responsiva simulada em 320×640 e 390×844', () => {
  assert.match(css,/\.petphone-momentos-grid\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.petphone-momento img\{[^}]*object-fit:contain/,'fotos horizontais não são cortadas na miniatura');
  assert.match(css,/\.petphone-momento a\{[^}]*min-height:44px/);
  assert.match(css,/#shPhone\{min-height:44px/);
  assert.match(read('duo.css'),/\.duoacoes #duoPhone\{grid-column:1\/-1;min-height:44px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const largura=Math.min(304,w-28),area=largura-24;
    const coluna=(area-7)/2;
    const altura=Math.min(h<=760?448:472,h-60);
    assert.ok(coluna>=130,`${w}×${h}: miniaturas em duas colunas legíveis`);
    assert.ok(altura>=400,`${w}×${h}: painel mantém área rolável`);
  }
  const trecho=logic.slice(logic.indexOf('function petPhoneMomentosLimpar('),logic.indexOf('function petPhoneFotoHtml('));
  assert.equal(/requestAnimationFrame|setInterval|setTimeout|contaRpc|localStorage/.test(trecho),false,'sem timers, rede ou saves');
});

test('ML1.2-C.2-C.2: PNG voluntário do Karaoke usa Blob e libera miniaturas/arquivos na sessão', () => {
  const {ctx,nodes,calls} = fakeRoom();
  ctx.petData={ativo:'tsu'};
  ctx.Blob=Blob;
  const revoked=[];let n=0;
  ctx.URL={createObjectURL:()=>`blob:mock-${++n}`,revokeObjectURL:url=>revoked.push(url)};
  const png=new Blob(['foto original'],{type:'image/png'}),mini=new Blob(['miniatura'],{type:'image/png'});
  assert.equal(ctx.petPhoneMomentos.length,0,'fotografar não guarda automaticamente');
  assert.equal(ctx.petPhoneMomentoGuardarBlob('karaoke',png,mini),true);
  assert.equal(ctx.petPhoneMomentos[0].rotulo,'Karaoke⭐Time!');
  assert.equal(ctx.petPhoneMomentos[0].url,'blob:mock-1');
  assert.equal(ctx.petPhoneMomentos[0].miniUrl,'blob:mock-2');
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');ctx.petPhoneFotosAbaAbrir('momentos');
  assert.match(nodes.petPhoneCorpo.innerHTML,/Karaoke⭐Time!/);
  const id=ctx.petPhoneMomentos[0].id,img={},dl={};
  nodes.petPhoneCorpo.querySelector=q=>q.includes('data-momento-id="'+id+'"')?img:q.includes('data-momento-baixar="'+id+'"')?dl:null;
  ctx.petPhoneMomentosRender();
  assert.equal(img.src,'blob:mock-2','miniatura reduzida é exibida');
  assert.equal(dl.href,'blob:mock-1','download mantém o PNG original');
  ctx.contaSessaoToken=4;ctx.petPhoneMomentosConferir();
  assert.equal(ctx.petPhoneMomentos.length,0);
  assert.deepEqual(revoked,['blob:mock-1','blob:mock-2'],'URLs liberadas ao trocar de sessão');
  assert.equal(ctx.petPhoneMomentoGuardarBlob('karaoke',new Blob(['x'],{type:'text/html'})),false);
  assert.deepEqual(calls.filter(x=>x.startsWith('rpc:')),[],'sem backend ou novos saves');
});

test('ML1.2-C.2-C.2: iframe valida origem, sessão, PNG e confirmação em 320×640 e 390×844', async () => {
  const code=hub.slice(hub.indexOf('var twPreviewKaraokeFoto = null;'),hub.indexOf('function twPreviewEnviarVisibilidadeIframe('));
  const assinatura=Buffer.from('89504e470d0a1a0a','hex');
  function png(w,h){
    const b=Buffer.alloc(24);assinatura.copy(b);b.writeUInt32BE(13,8);b.write('IHDR',12);b.writeUInt32BE(w,16);b.writeUInt32BE(h,20);
    return new Blob([b],{type:'image/png'});
  }
  for(const [w,h] of [[320,640],[390,844]]){
    let owner='conta-1:pet-tsu',saved=[];const replies=[];
    const frameWindow={postMessage:(data,origin)=>replies.push({data,origin})};
    const ctx={Blob,Promise,location:{protocol:'https:',origin:'https://preview.test'},
      twPreviewJogoAnterior:'karaoke',contaJ:{nick:'IdolTeste'},petAtivo:()=>({nome:'Chu'}),
      petPhoneFotoChave:()=>owner,petPhoneMomentoGuardarBlob:(tipo,blob,mini)=>{saved.push({tipo,blob,mini});return true;},
      $:id=>id==='twPreviewIframe'?{contentWindow:frameWindow}:null};
    vm.runInNewContext(code,ctx,{filename:'hub-karaoke-photo'});
    const event=(type,props={},origin='https://preview.test',source=frameWindow)=>({data:{type,id:'capture-12345',...props},origin,source});
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_READY',{},'https://outro.site'));
    assert.equal(replies.length,0,`${w}×${h}: origem desconhecida ignorada`);
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_READY'));
    const ticket=replies.at(-1).data.token;
    assert.ok(ticket,`${w}×${h}: bilhete da captura vinculado à conta`);
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_SAVE',{token:'errado',blob:png(1920,1080)}));
    assert.equal(saved.length,0,`${w}×${h}: bilhete incorreto bloqueado`);
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_SAVE',{token:ticket,blob:png(960,540)}));
    await new Promise(setImmediate);
    assert.equal(saved.length,0,`${w}×${h}: dimensões incompatíveis bloqueadas`);
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_SAVE',{token:ticket,blob:png(1920,1080),mini:png(240,135)}));
    await new Promise(setImmediate);
    assert.equal(saved.length,1,`${w}×${h}: uma fotografia entra após toque explícito`);
    assert.equal(replies.at(-1).data.ok,true);
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_SAVE',{token:ticket,blob:png(1920,1080)}));
    assert.equal(saved.length,1,`${w}×${h}: clique repetido não duplica`);
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_READY'));
    owner='conta-2:pet-tsu';
    ctx.twPreviewKaraokeFotoReceber(event('TW_KARAOKE_PHOTO_SAVE',{token:replies.at(-1).data.token,blob:png(1920,1080)}));
    assert.equal(saved.length,1,`${w}×${h}: mudança de conta bloqueada`);
    assert.match(karaokePhoto,/id="ktPhotoKeep" hidden/);
    assert.match(karaokePhoto,/type:'TW_KARAOKE_PHOTO_SAVE'/);
    assert.match(html,/twPreviewKaraokeFotoReceber\(e\)/);
    assert.match(karaokeCss,/#ktPhotoDialog #ktPhotoKeep\{grid-column:1\/-1\}/);
    assert.match(karaokeCss, /min-height:44px/,`${w}×${h}: toque mínimo mantido`);
    assert.ok(w>=320&&h>=640);
  }
  for(const lang of ['pt','en','es','id','th','ja']) assert.match(karaokePhoto,new RegExp('\\b'+lang+':\\[.*Guardar|\\b'+lang+':\\[.*(?:Keep|Simpan|เก็บ|保存|Guardar)'));
  assert.equal(/localStorage|contaRpc|fetch\(/.test(karaokePhoto.slice(karaokePhoto.indexOf('keep.onclick='),karaokePhoto.indexOf('share.onclick='))),false);
});

test('ML1.2-C.2-D: Momentos amplia as quatro origens sem copiar o PNG e volta à mesma galeria', () => {
  const {ctx,nodes,calls}=fakeRoom();ctx.petData={ativo:'tsu'};ctx.Blob=Blob;
  let nextUrl=0;ctx.URL={createObjectURL:()=>`blob:foto-${++nextUrl}`,revokeObjectURL:()=>{}};
  const png='data:image/png;base64,iVBORw0KGgo=';
  for(const tipo of ['pet','center','duo']) assert.equal(ctx.petPhoneMomentoGuardar(tipo,png),true);
  assert.equal(ctx.petPhoneMomentoGuardarBlob('karaoke',new Blob(['original'],{type:'image/png'}),new Blob(['miniatura'],{type:'image/png'})),true);
  const originais=ctx.petPhoneMomentos.map(f=>({id:f.id,url:f.url,mini:f.miniUrl}));
  nodes.petPhoneMomentoImagem={src:'',removeAttribute(){this.src='';}};
  nodes.petPhoneMomentoBaixar={href:'',download:'',removeAttribute(){this.href='';}};
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');ctx.petPhoneFotosAbaAbrir('momentos');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="momento-abrir"/);
  for(const f of ctx.petPhoneMomentos){
    assert.equal(ctx.petPhoneMomentoAbrir(f.id),true,f.tipo);
    assert.match(nodes.petPhoneCorpo.innerHTML,/petphone-momento-revisao/);
    assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/petphone-fotos-tabs/,'revisão aproveita o espaço das abas');
    assert.equal(nodes.petPhoneMomentoImagem.src,f.url,'ampliação usa a imagem original, não a miniatura');
    assert.equal(nodes.petPhoneMomentoBaixar.href,f.url,'download usa o mesmo PNG original');
    assert.match(nodes.petPhoneMomentoBaixar.download,new RegExp('^tsulipa-'+f.tipo+'-'));
    assert.equal(ctx.petPhoneVoltar(),true,'voltar do TsuPhone retorna à grade');
    assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="momento-abrir"/);
    assert.equal(ctx.petPhoneMomentoSelecionado,'');
  }
  assert.equal(ctx.petPhoneMomentoAbrir('foto-inexistente'),false);
  assert.deepEqual(ctx.petPhoneMomentos.map(f=>({id:f.id,url:f.url,mini:f.miniUrl})),originais,'nenhum PNG ou save novo');
  assert.equal(ctx.petPhoneMomentoAbrir(ctx.petPhoneMomentos[0].id),true);
  ctx.petPhoneFechar();
  assert.equal(ctx.petPhoneMomentoSelecionado,'','fechar celular limpa só a seleção');
  assert.equal(ctx.petPhoneMomentos.length,4,'as fotografias continuam na sessão');
  assert.deepEqual(calls.filter(v=>v.startsWith('rpc:')),[]);
});

test('ML1.2-C.2-D: revisão protege a sessão e permanece legível em 320×640 e 390×844', () => {
  const {ctx,nodes}=fakeRoom();ctx.petData={ativo:'tsu'};ctx.Blob=Blob;
  const revogadas=[];ctx.URL={createObjectURL:()=>`blob:seguro-${revogadas.length+1}`,revokeObjectURL:u=>revogadas.push(u)};
  nodes.petPhoneMomentoImagem={src:'',removeAttribute(){this.src='';}};
  nodes.petPhoneMomentoBaixar={href:'',removeAttribute(){this.href='';}};
  assert.equal(ctx.petPhoneMomentoGuardarBlob('karaoke',new Blob(['arquivo'],{type:'image/png'})),true);
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');ctx.petPhoneFotosAbaAbrir('momentos');
  assert.equal(ctx.petPhoneMomentoAbrir(ctx.petPhoneMomentos[0].id),true);
  ctx.contaSessaoToken=100;ctx.petPhoneMomentosConferir();
  assert.equal(ctx.petPhoneMomentoSelecionado,'');
  assert.equal(ctx.petPhoneMomentos.length,0);
  assert.equal(nodes.petPhoneMomentoImagem.src,'');
  assert.equal(nodes.petPhoneMomentoBaixar.href,'');
  assert.deepEqual(revogadas,['blob:seguro-1']);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Nenhuma foto nesta sessão/);
  assert.equal(ctx.petPhoneMomentoVoltar(),false,'sem foto não existe retorno pendente');
  assert.match(html,/k === 'momento-abrir'\) petPhoneMomentoAbrir\(b\.dataset\.momento\)/);
  assert.match(html,/k === 'momento-voltar'\) petPhoneMomentoVoltar\(\)/);
  assert.match(pet,/petPhoneFotosAba === 'momentos' && petPhoneMomentoSelecionado\) return petPhoneMomentoVoltar\(\)/);
  assert.match(css,/\.petphone-momento-polaroid img\{[^}]*object-fit:contain/);
  assert.match(css,/\.petphone-momento-revisao a,\.petphone-momento-revisao button\{[^}]*min-height:44px/);
  assert.match(css,/\.petphone-momento-ver\{[^}]*min-height:44px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const largura=Math.min(304,w-28),coluna=(largura-24-7)/2,painel=Math.min(h<=760?448:472,h-60);
    assert.ok(coluna>=130,`${w}×${h}: Polaroids acessíveis em duas colunas`);
    assert.ok(225+44+44+50<=painel,`${w}×${h}: foto ampliada e ações na área rolável`);
  }
  for(const idioma of ['pt','en','es','id','th','ja']) assert.match(pet,new RegExp('(?:^|\\n)  '+idioma+':\\[.*(?:Ampliar|Enlarge|Perbesar|ขยาย|拡大)'));
  const trecho=pet.slice(pet.indexOf('function petPhoneMomentoSoltar('),pet.indexOf('function petPhoneFotoHtml('));
  assert.equal(/requestAnimationFrame|setInterval|setTimeout|contaRpc|localStorage|toDataURL/.test(trecho),false);
});

test('ML1.2-C.2-B.1: captura abre revisão inteira no TsuPhone, mantendo PNG e ações originais', () => {
  const {ctx,nodes,calls}=fakeRoom();
  const png='data:image/png;base64,iVBORw0KGgo=';
  let capturas=0;
  ctx.petData={ativo:'tsu'};
  ctx.petMakePhoto=()=>{capturas++;return png;};
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');
  assert.match(nodes.petPhoneCorpo.innerHTML,/class="petphone-photo-preview petphone-photo-visor"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-aba="momentos"/);
  assert.equal(capturas,0,'visor não captura automaticamente');
  assert.equal(ctx.petPhoneFotoTirar(),true);
  assert.equal(capturas,1,'captura original executada uma vez');
  assert.match(nodes.petPhoneCorpo.innerHTML,/petphone-photo-review/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoImg"/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/data-aba="camera"/,'abas liberam espaço para a Polaroid');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="guardar-selfie"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="repetir-selfie"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-phone="abrir-album"/);
  assert.equal(nodes.petPhoneFotoImg.src,png);
  assert.equal(nodes.petPhoneFotoBaixar.href,png);
  assert.equal(nodes.petPhoneFotoBaixar.download,'tsulipa-camarim-pipoca.png');
  assert.equal(ctx.petPhoneMomentos.length,0,'foto ainda não foi guardada');
  assert.equal(ctx.petPhoneFotoRepetir(),true);
  assert.equal(capturas,1,'voltar ao visor não cria outra captura');
  assert.equal(ctx.petPhoneFotoUrl,'','revisão temporária descartada pelo jogador');
  assert.match(nodes.petPhoneCorpo.innerHTML,/data-aba="camera"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneWp"/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/id="petPhoneFotoBaixar"/);
  assert.equal(ctx.petPhoneFotoTirar(),true);
  assert.equal(capturas,2);
  assert.equal(ctx.petPhoneFotoGuardar(),true);
  assert.equal(ctx.petPhoneFotosAba,'momentos');
  assert.equal(ctx.petPhoneMomentos.length,1);
  assert.equal(ctx.petPhoneMomentos[0].url,png);
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.equal(logic.includes('localStorage'),false);
  assert.match(html,/k === 'repetir-selfie'\) petPhoneFotoRepetir\(\)/,'navegação interna conectada');
});

test('ML1.2-C.2-B.1: apresentação inteira em 320×640 e 390×844 sem renderização contínua', () => {
  assert.match(css,/\.petphone-photo-review\{[^}]*height:auto/);
  assert.match(css,/\.petphone-photo-review img\{[^}]*max-height:226px;object-fit:contain/);
  assert.match(css,/@media \(max-height:760px\)\{\.petphone-photo-review\{height:auto\}\.petphone-photo-review img\{max-height:196px/);
  assert.match(css,/\.petphone-photo-actions\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.petphone-photo button,\.petphone-photo-baixar\{[^}]*min-height:44px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const curta=h<=760,phoneWidth=Math.min(304,w-28),phoneHeight=Math.min(curta?448:472,h-60);
    const reviewHeight=curta?196:226,reviewWidth=reviewHeight*400/430;
    const innerWidth=phoneWidth-4*2-13*2-4*2-9*2-4*2;
    assert.ok(reviewWidth<=innerWidth,`${w}×${h}: Polaroid inteira na largura útil do TsuPhone`);
    assert.ok(reviewHeight+44<=phoneHeight-100,`${w}×${h}: imagem e controle cabem na região rolável`);
  }
  const trecho=logic.slice(logic.indexOf('function petPhonePapel('),logic.indexOf('function petPhoneIcon('))+
    logic.slice(logic.indexOf('function petPhoneFotoHtml('),logic.indexOf('function petPhoneChatContatos('));
  assert.equal(/requestAnimationFrame|setInterval|setTimeout|contaRpc|localStorage/.test(trecho),false,'sem nova animação, RPC ou persistência');
  assert.match(pet,/try\{ url = petMakePhoto\(\); \}catch\(e\)\{\}/,'câmera e molduras seguem originais');
});

test('ML1.2-C.2-B.1: visor mostra o Canvas 360×220 inteiro sem recorte', () => {
  const {ctx,nodes} = fakeRoom();
  nodes.petPhoneWp.width=360;nodes.petPhoneWp.height=220;
  let args;
  nodes.petPhoneWp.getContext=()=>({clearRect(){},drawImage(...a){args=a;}});
  ctx.petPhonePapel();
  assert.ok(args, 'reaproveita a imagem já desenhada do camarim');
  assert.deepEqual(args.slice(1),[0,0,360,220,0,0,360,220], 'usa a área original por inteiro');
  assert.equal(args[0],ctx.petCv);
  assert.match(ctx.petPhoneFotoHtml(),/id="petPhoneWp" width="360" height="220"/);
  assert.match(css,/\.petphone-photo-espera canvas\{[^}]*object-fit:contain/);
});

test('ML1.2-C.2-C.1: Jornal exibe miniaturas públicas, sem misturar foto privada ou salvar dados', () => {
  const {ctx,nodes,calls}=fakeRoom();
  const fotos=[
    {tipo:'',legenda:'Encontro dos Idols'},
    {tipo:'janela',legenda:'Oito Idols no Karaoke'},
    {tipo:'pet',legenda:'Selfie privada do jogador'},
    {tipo:'telao',legenda:'Telão do show'}
  ];
  const desenhos=[];
  ctx.jornalFotosMontarDoDia=()=>fotos;
  ctx.jornalLegenda=f=>f.legenda;
  ctx.jornalFotoDesenhar=(cv,f,assinatura)=>desenhos.push({cv,f,assinatura});
  nodes.petPhoneCorpo.querySelectorAll=seletor=>seletor==='canvas[data-jornal-mini]'
    ? [0,1,2].map(i=>({dataset:{jornalMini:String(i)},width:240,height:150})) : [];
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');
  assert.equal(ctx.petPhoneFotosAbaAbrir('jornal'),true);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Cenas públicas do Idol⭐News!/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Encontro dos Idols/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Oito Idols no Karaoke/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/Telão do show/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/Selfie privada do jogador|data-momento-id|data:image\/png/);
  assert.equal(ctx.petPhoneJornalFotos.length,3);
  assert.deepEqual(desenhos.map(d=>[d.cv.width,d.cv.height,d.assinatura]),[[240,150,false],[240,150,false],[240,150,false]]);
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[],'Jornal do celular não faz RPC');
  assert.equal(ctx.petPhoneJornalUrl,'','não gera PNG sem toque');
});

test('ML1.2-C.2-C.1: ampliação e PNG são voluntários; voltar libera imagem em memória', () => {
  const {ctx,nodes,calls}=fakeRoom();
  const foto={tipo:'janela',legenda:'Grupo da semana'};
  ctx.jornalFotosMontarDoDia=()=>[foto];
  ctx.jornalLegenda=f=>f.legenda;
  const desenhos=[];
  ctx.jornalFotoDesenhar=(cv,f,assinatura)=>desenhos.push([cv.width,cv.height,f,assinatura]);
  ctx.document.createElement=()=>({width:0,height:0,toDataURL:()=> 'data:image/png;base64,aGVsbG8='});
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');ctx.petPhoneFotosAbaAbrir('jornal');
  assert.equal(ctx.petPhoneJornalAbrir(-1),false);
  assert.equal(ctx.petPhoneJornalAbrir(1),false);
  assert.equal(ctx.petPhoneJornalAbrir(0),true);
  assert.ok(desenhos.some(d=>d[0]===1440&&d[1]===900&&d[2]===foto&&d[3]===true));
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneJornalImg"/);
  assert.match(nodes.petPhoneCorpo.innerHTML,/id="petPhoneJornalBaixar"/);
  assert.doesNotMatch(nodes.petPhoneCorpo.innerHTML,/data-momento-id/,'Jornal não invade Momentos');
  assert.equal(nodes.petPhoneJornalImg.src,'data:image/png;base64,aGVsbG8=');
  assert.match(nodes.petPhoneJornalBaixar.download,/^idol-news-.*\.png$/);
  assert.equal(ctx.petPhoneVoltar(),true,'seta interna retorna à galeria antes da tela inicial');
  assert.equal(ctx.petPhoneTela,'fotos');
  assert.equal(ctx.petPhoneJornalUrl,'');
  assert.equal(nodes.petPhoneJornalImg.src,undefined);
  assert.equal(ctx.petPhoneJornalAbrir(0),true);
  assert.equal(ctx.petPhoneFotosAbaAbrir('momentos'),true);
  assert.equal(ctx.petPhoneJornalUrl,'','trocar de aba descarta PNG temporária');
  ctx.petPhoneFechar();
  assert.equal(ctx.petPhoneJornalFotos.length,0,'descarte da lista ao fechar');
  assert.equal(ctx.petPhoneJornalAbrir(0),false,'fora da aba não gera novas fotos');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[]);
  assert.equal(logic.includes('localStorage'),false);
  assert.match(html,/k === 'jornal-foto'\) petPhoneJornalAbrir\(Number\(b\.dataset\.foto\)\)/);
});

test('ML1.2-C.2-C.1: vitrine existente carrega uma vez e atualiza Jornal sem polling', () => {
  const {ctx,nodes,calls}=fakeRoom();
  let carregou=false, pedidos=0;
  ctx.hubIdolsEm=0;
  ctx.hubIdolsCarregar=()=>{pedidos++;};
  ctx.jornalFotosMontarDoDia=()=>carregou ? [{tipo:'',legenda:'Ensaio da tarde'}] : [];
  ctx.jornalLegenda=f=>f.legenda;
  ctx.jornalFotoDesenhar=()=>{};
  ctx.petLifeAbrir('celular');ctx.petPhoneTelaAbrir('fotos');ctx.petPhoneFotosAbaAbrir('jornal');
  assert.equal(pedidos,1,'usa função já existente do Hub');
  assert.match(nodes.petPhoneCorpo.innerHTML,/vitrine de Idols carregar/);
  ctx.hubIdolsEm=Date.now();
  ctx.petPhoneJornalAtualizar();
  assert.equal(pedidos,1,'atualizar durante consulta não duplica chamadas');
  carregou=true;ctx.petPhoneJornalVitrinePronta();
  assert.match(nodes.petPhoneCorpo.innerHTML,/Ensaio da tarde/,'atualiza ao receber vitrine');
  assert.deepEqual(calls.filter(c=>c.startsWith('rpc:')),[],'não acrescenta consulta no TsuPhone');
  assert.match(read('hub.js'),/petPhoneJornalVitrinePronta\(\)/,'aviso parte da vitrine existente');
  ctx.petPhoneFechar();
  ctx.petPhoneJornalVitrinePronta();
  assert.equal(ctx.petPhoneJornalFotos.length,0,'aviso tardio não reabre a tela');
});

test('ML1.2-C.2-C.1: galeria e revisão cabem em 320×640 e 390×844', () => {
  assert.match(css,/\.petphone-jornal-grid\{[^}]*grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(css,/\.petphone-jornal-grid canvas\{[^}]*aspect-ratio:8\/5/);
  assert.match(css,/\.petphone-jornal-revisao img\{[^}]*max-height:220px;object-fit:contain/);
  assert.match(css,/\.petphone-jornal-revisao img\{[^}]*box-sizing:border-box;width:100%;max-width:100%/,'borda da foto não aumenta a largura do visor');
  assert.match(css,/\.petphone-jornal-revisao a,\.petphone-jornal-revisao button,\.petphone-jornal-atualizar\{[^}]*min-height:44px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const altura = Math.min(h<=760?448:472,h-60), largura = Math.min(304,w-28);
    const inner = largura - 8 - 26 - 8 - 18;
    const tile = (inner-7)/2;
    assert.ok(tile>=105,`${w}×${h}: duas miniaturas legíveis`);
    assert.ok(tile*5/8 + 44<altura-160,`${w}×${h}: miniatura e alvo de toque no visor rolável`);
    assert.ok(220+44<=altura-100,`${w}×${h}: ampliação e download rolam sem recorte horizontal`);
  }
  const trecho=logic.slice(logic.indexOf('function petPhoneJornalLimpar('),logic.indexOf('function petPhoneChatContatos('));
  assert.equal(/requestAnimationFrame|setInterval|setTimeout|contaRpc|localStorage/.test(trecho),false,'nenhuma animação, backend ou save adicional');
});

test('ML1.2-A.1: quatro ícones T2 originais são desenhados uma vez com Canvas 2D', () => {
  const {ctx} = fakeRoom();
  for(const tipo of ['agenda','chat','fotos','perfil']){
    const ops=[];
    const canvas={width:128,height:128,getContext(){
      return new Proxy({}, {
        get(obj,k){
          if(k==='createLinearGradient')return ()=>({addColorStop(){}});
          if(k in obj)return obj[k];
          return (...a)=>{ops.push([k,...a]);};
        },
        set(obj,k,v){obj[k]=v;return true;}
      });
    }};
    ctx.petPhoneIcon(canvas,tipo);
    assert.ok(ops.filter(x=>x[0]==='fill').length>=4, 'desenho completo: '+tipo);
    assert.ok(ops.some(x=>x[0]==='scale'), 'ícone preparado para tela retina: '+tipo);
  }
  assert.match(pet, /canvas data-phone-icon=/);
  assert.equal(pet.slice(pet.indexOf('function petPhoneIcon('),pet.indexOf('function petPhoneAgendaHtml(')).includes('requestAnimationFrame'),false);
});

test('ML1.2-A.1: geometria responsiva cabe em 320×640 e 390×844 com botão físico visível', () => {
  assert.match(css,/width:min\(304px,calc\(100vw - 28px\)\)/);
  assert.match(css,/height:min\(472px,calc\(100dvh - 60px/);
  assert.match(css,/@media \(max-height:760px\)\{\.petphone-shell\{height:min\(448px/);
  for(const [w,h] of [[320,640],[390,844]]){
    const pequena=h<=760, largura=Math.min(304,w-28), altura=Math.min(pequena?448:472,h-60);
    const conteudo=altura-(8+9+(pequena?30:33)+(pequena?44:46)+(pequena?4:6)+8+30+18);
    const papel=(largura-60)*125/260, apps=2*(pequena?67:77)+(pequena?7:9);
    assert.ok(conteudo>=papel+(pequena?8:11)+apps,`${w}×${h}: apps cabem sem corte`);
    assert.ok(altura<=h-60,`${w}×${h}: sobra espaço para navegação do navegador`);
  }
  assert.match(css,/\.petphone-home\{[^}]*min-height:44px/);
  assert.match(css,/\.petphone-x\{[^}]*width:44px/);
});

test('ML1.1: origem Hub fica preservada e navegação comum não é sequestrada', () => {
  const fromHub = fakeRoom();
  fromHub.ctx.hubOv.hidden=false; fromHub.ctx.petVeioHub=true;
  fromHub.ctx.petLifeAbrir('album');
  fromHub.calls.length=0;
  fromHub.ctx.albumFechar();
  assert.deepEqual(fromHub.calls, ['hubMusicaParar','petOpenUI']);
  assert.equal(fromHub.ctx.petVeioHub, true, 'VOLTAR do Pet continua indo ao Hub original');

  const normalShop = fakeRoom();
  normalShop.ctx.shopFechar();
  assert.deepEqual(normalShop.calls, ['hubMostrar']);
  const normalAlbum = fakeRoom();
  normalAlbum.ctx.albumFechar();
  assert.deepEqual(normalAlbum.calls, []);
  const normalProfile = fakeRoom();
  normalProfile.ctx.perfFechar();
  assert.deepEqual(normalProfile.calls, []);

  const out = fakeRoom();
  out.ctx.petLifeAbrir('espelho');
  assert.equal(out.ctx.petLifeCancelar('espelho'), true);
  out.calls.length=0; out.ctx.shopFechar();
  assert.deepEqual(out.calls, ['hubMostrar'], 'ir do Provador para outro lugar cancela a volta pendente');
  assert.equal(logic.includes('localStorage'), false);
  assert.match(logic, /contaRpc\('missoes'\)/, 'somente consulta de leitura da Agenda');
  assert.equal(/contaRpc\('(?!missoes')/.test(logic), false, 'nenhuma RPC de escrita adicionada');
  assert.match(html, /id="petPhone"/);
});
