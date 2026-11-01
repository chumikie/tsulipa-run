'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const karaoke=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const sora=fs.readFileSync(path.join(root,'sora-jump.html'),'utf8');
const original=fs.readFileSync(path.join(root,'tw-avatar-items.js'),'utf8');

for(const [name,html] of [['Center Run / Perfil',index],['Karaoke',karaoke]]){
 assert(html.includes('<script src="./tw-avatar-items.js?v=2"></script>'),name+': carregar os desenhos compartilhados');
 assert(html.includes("if(hacc==='capitao') TWAvatarItems.capitao(g,x,y)"),name+': desenhar chapéu somente quando selecionado');
 assert(html.includes("if(A==='estrela') TWAvatarItems.estrela(g,x,y)"),name+': desenhar estrela somente quando selecionada');
 for(const key of ['boina','presilhas','fones','coala','hibisco','sakura']){
  assert(html.includes("'"+key+"'"),name+': preservar '+key);
 }
}
assert(index.includes('value="capitao" data-r="15000"'),'chapéu liberado no rank Capitão (15.000)');
assert(index.includes("['estrela','Estrela',RANKS[8][0],8]"),'estrela liberada em Solo Center (10.000)');
assert(index.includes("accSel = typeof av.a === 'string' ? av.a : ''"),'Perfil usa acessório salvo do avatar');
assert(index.includes("'brs48cr_acc'"),'item do jogador persiste no save');
assert(karaoke.includes("a:read('brs48cr_acc')||''"),'elenco do Karaoke lê item salvo');
assert(karaoke.includes("krMeuCharSalaClone._avatarA=localStorage.getItem('brs48cr_acc')"),'Karaoke solo reutiliza o clone e atualiza item');
assert(karaoke.includes("accSel=c._avatarA||''"),'renderizador do Karaoke recebe o item');
assert(original.includes("capShade.addColorStop(.48,'#090b12')"),'preservar sombra original do chapéu');
assert(original.includes("var starGold=g.createRadialGradient(-.8,-1.1,.2,0,0,3.3*1.45)"),'estrela mantém o brilho dourado, maior');
assert(original.includes("g.translate(x+5.5,y+8)")&&original.includes("// grampo"),'estrela vira presilha ao lado da franja');
assert(original.includes("// pala")&&original.includes("// cordão")&&original.includes("quadraticCurveTo(x+15,y-11,x+29.5,y-4.5)"),'chapéu de Capitão em formato de quepe militar');

const sandbox={window:{}};
vm.runInNewContext(original,sandbox,{timeout:1000});
const calls=[];
const gradient={addColorStop(...args){calls.push(['stop',...args]);}};
const context=new Proxy({}, {set(target,key,val){target[key]=val;return true;},get(target,key){
 if(key==='createLinearGradient'||key==='createRadialGradient')return (...args)=>{calls.push([key,...args]);return gradient;};
 if(key==='save'||key==='restore'||key==='beginPath'||key==='closePath'||key==='fill'||key==='stroke'||key==='moveTo'||key==='lineTo'||key==='quadraticCurveTo'||key==='ellipse'||key==='fillRect'||key==='translate'||key==='rotate'||key==='arc')return (...args)=>calls.push([key,...args]);
 return target[key];
}});
sandbox.window.TWAvatarItems.capitao(context,0,0);
assert(calls.some(c=>c[0]==='ellipse'),'chapéu mantém aba 2D');
assert(calls.some(c=>c[0]==='fillRect'),'chapéu mantém faixa dourada');
calls.length=0;
sandbox.window.TWAvatarItems.estrela(context,0,0);
assert(calls.filter(c=>c[0]==='lineTo').length>=9,'estrela mantém dez pontas internas/externas');
assert(calls.some(c=>c[0]==='createRadialGradient'),'estrela mantém sombreado original');

 // Sora Jump's independent renderer must also display the shared Captain cap
 // and Star clip without replacing its existing accessories.
 assert(sora.includes('<script src="./tw-avatar-items.js?v=2"></script>'),'Sora Jump loads the shared avatar items');
 const soraDrawStart=sora.indexOf('function drawChar(c,x,y,run,expr,isPartner){');
 const soraDrawEnd=sora.indexOf('\nfunction ',soraDrawStart+20);
 assert(soraDrawStart>=0&&soraDrawEnd>soraDrawStart,'Sora Jump drawChar renderer exists for avatar items');
 const soraDraw=sora.slice(soraDrawStart,soraDrawEnd);
 assert(soraDraw.includes("if(hacc==='capitao') TWAvatarItems.capitao(g,x,y)"),'Sora Jump renders the Captain cap');
 assert(soraDraw.includes("if(A==='estrela') TWAvatarItems.estrela(g,x,y)"),'Sora Jump renders the Star hair clip');
 for(const key of ["hacc==='boina'","hacc==='presilhas'","hacc==='fones'","hacc==='coala'","A==='laco'","A==='hibisco'","A==='sakura'"])
  assert(soraDraw.includes(key),'Sora Jump preserves existing accessory '+key);

console.log('✓ Chapéu de Capitão e Estrela originais: desbloqueio, desenho 2D, Perfil e Karaoke solo');
