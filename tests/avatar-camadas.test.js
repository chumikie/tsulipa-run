'use strict';
// Motor de camadas do avatar (Identity Restoration, 27/11/2026): peças desenhadas à mão empilhadas sobre o molde.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const raiz=path.join(__dirname,'..'),read=p=>fs.readFileSync(path.join(raiz,p),'utf8');
const js=v=>JSON.parse(JSON.stringify(v));   // arrays do vm vêm de outro realm

function motor(){
  const scope={window:{},console};scope.window.window=scope.window;
  vm.runInNewContext(read('tw-avatar-camadas.js'),scope.window);
  return scope.window.TWCamadas;
}
function pacote(T,extra){
  const s={};vm.runInNewContext(read('arte/avatar/prototipo/pacote.js'),{TWCamadas:{registrar:p=>Object.assign(s,p)}});
  const pecas=Object.assign({},s.pecas,extra||{});
  T.registrar({nome:'teste',base:'./',pecas});T.ativar('teste');return pecas;
}
const TSU={n:'Tsu',hair:'#b04fe6',hair2:'#fff',streak:false,skin:'#b97a50',eye:'#a64bd9',back:'pixie',front:'bagunca',det:'gato',gl:'',out:'',outcol:'#ffffff',hat:'',baixo:'bermuda'};

test('sem pacote ativo o motor não desenha nada e o drawChar original segue valendo',()=>{
  const T=motor();
  assert.equal(T.ativo(),null);
  assert.equal(T.camadas(TSU,0),null);
  assert.equal(T.desenhar({},TSU,0,0,0,0),false);
  assert.equal(T.ativar('nao-existe'),false);
});

test('ordem das camadas de trás para a frente e tinta de cada peça',()=>{
  const T=motor();pacote(T);
  const l=js(T.camadas(TSU,0).map(c=>c.k+(c.tinta?':'+c.tinta:'')));
  assert.deepEqual(l,['cabeloTras/pixie:hair','corpo/padrao:skin','pernas/meias:legcol','pernas/sapatos','baixo/bermuda','roupa/uniforme:outcol',
    'rosto/olho/padrao:eye','rosto/bochecha/padrao','rosto/boca/padrao','rosto/sobrancelha/padrao:hair','detalhe/gato:hair','cabeloFrente/bagunca:hair']);
  const lirika=T.camadas({...TSU,n:'Lirika',back:'chanel',front:'reta',det:'coques',baixo:'saia'},0).map(c=>c.k);
  assert.equal(lirika[0],'detalhe/coques','coques atrás da cabeça');
  assert.ok(lirika.includes('baixo/saia'));
});

test('peça faltando, mecha bicolor, óculos ou expressão sem desenho: o avatar inteiro fica com o desenho atual',()=>{
  const T=motor();pacote(T);
  assert.equal(T.camadas({...TSU,front:'lateral'},0),null);
  assert.deepEqual(js(T.pecasFaltando({...TSU,front:'lateral'})),['cabeloFrente/lateral']);
  assert.equal(T.camadas({...TSU,streak:true},0),null);
  assert.equal(T.camadas({...TSU,gl:'redondo'},0),null);
  assert.equal(T.camadas({...TSU,hat:'boina'},0),null);
  assert.equal(T.camadas(TSU,5),null,'expressão 5 ainda sem peça');
  assert.ok(T.camadas(TSU,2),'sorriso (@2) tem peça no protótipo');
  assert.equal(T.camadas({...TSU,olho:'estrela'},0),null);
});

test('poses de foto e mãos segurando objetos continuam no desenho atual',()=>{
  const T=motor();pacote(T);
  const scope={window:{},console,charPose:'v'};scope.window.window=scope.window;scope.window.charPose='v';
  vm.runInNewContext(read('tw-avatar-camadas.js'),scope.window);
  const T2=scope.window.TWCamadas;pacote(T2);
  assert.equal(T2.desenhar({drawImage(){throw new Error('não deveria desenhar');}},TSU,0,0,0,0),false);
});

test('instalar envolve o drawChar sem mudar o texto dele e devolve ao original quando falta peça',()=>{
  const T=motor();pacote(T);
  const chamadas=[];const win={drawChar(){chamadas.push([...arguments]);},g:{}};
  assert.equal(T.instalar(win),true);
  assert.equal(T.instalar(win),false,'não envolve duas vezes');
  win.drawChar({...TSU,front:'lateral'},1,2,0,0);
  assert.equal(chamadas.length,1,'sem a franja lateral, quem desenha é o original');
  assert.equal(typeof win.drawChar.original,'function');
});

test('o motor só desenha: não toca em save, banco, saldo ou inventário, e só liga pela URL',()=>{
  const s=read('tw-avatar-camadas.js').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'');   // só o código
  assert.doesNotMatch(s,/localStorage|sessionStorage|contaRpc|supabase|starT|collectedPartners|indexedDB/);
  assert.match(read('tw-avatar-camadas.js'),/\[\?&\]arte=/);
  const html=read('index.html');
  assert.ok(html.indexOf('tw-avatar-camadas.js?v=')>html.indexOf('centerrun.js?v='),'motor carrega depois do drawChar');
});

test('todas as peças do pacote de exemplo existem, ocupam a folha do molde e o molde está no lugar',()=>{
  const T=motor();const pecas=pacote(T);
  for(const [k,p] of Object.entries(pecas))for(const f of ['cor','linha'])if(p[f]){
    const arq=path.join(raiz,'arte/avatar/prototipo',p[f]);assert.ok(fs.existsSync(arq),k+' '+f);
    assert.match(fs.readFileSync(arq,'utf8'),/width="768" height="1024" viewBox="0 0 48 64"/,arq);
  }
  assert.deepEqual(js(T.MOLDE),{w:48,h:64,ox:9,oy:14});
  assert.equal(T.U*T.MOLDE.w,768);
  assert.ok(fs.existsSync(path.join(raiz,'docs/arte/molde-avatar.svg')));
});
