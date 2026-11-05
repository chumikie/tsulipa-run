'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const pet = read('pet.js'), html = read('index.html'), css = read('pet.css');
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
    querySelector(){ return labels[id] || (labels[id] = {textContent:''}); },
    insertBefore(node){ nodes[node.id] = node; },
    after(node){ nodes[node.id] = node; },
    remove(){ delete nodes[this.id]; }
  });
  Object.assign(nodes,Object.fromEntries(['petLifeEstante','albumTit','hubHojeLinha','hubToque','shopCorpo','perfTopoMsg','petPhone','petPhoneHora','petPhoneCorpo','petPhoneX','petPhoneWp'].map(k => [k, element(k)])));
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

test('ML1.2-A.1: papel de parede recorta o Canvas sem deformar o Idol ou o Pet', () => {
  const {ctx,nodes} = fakeRoom();
  nodes.petPhoneWp.width=260;nodes.petPhoneWp.height=125;
  let args;
  nodes.petPhoneWp.getContext=()=>({clearRect(){},drawImage(...a){args=a;}});
  ctx.petPhonePapel();
  assert.ok(args, 'reaproveita a imagem já desenhada do camarim');
  assert.equal(args[3],360);
  assert.ok(args[2] > 0, 'posiciona recorte para incluir os personagens');
  assert.ok(Math.abs(args[3]/args[4]-260/125)<0.001, 'mantém a proporção original');
  assert.equal(args[7],260);assert.equal(args[8],125);
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
