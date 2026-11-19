'use strict';
// Karaoke⭐Time! — passo 3 do plano da #109 (17/11/2026): enfeites da sala em karaoke-palco-desenho.js,
// camadas lentas no krLoop e, no show do celular, a sala pinta só a faixa que aparece.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const palco=fs.readFileSync(path.join(root,'karaoke-palco-desenho.js'),'utf8');

// Carregado antes do script da sala e criado no começo dele, dentro do bloco principal.
assert(/<script src="\.\/karaoke-palco-desenho\.js\?v=\d+"><\/script>/.test(html),'karaoke-palco-desenho.js carregado');
const iniSala=html.indexOf('(function(){\nvar $=function(id){return document.getElementById(id);};');
assert(iniSala>0&&html.indexOf('karaoke-palco-desenho.js')<iniSala,'arquivo vem antes da sala');
assert(html.indexOf('var ktPalco=window.KaraokePalco.criar(')>iniSala,'apelidos dentro do bloco da sala');
// O desenho mora num lugar só.
for(const nome of ['ktMesaKaraoke','ktPlantasSala','ktDecorSala','ktSamambaia','ktCaixaSomViva','ktArmario','ktRR','ktCoracao']){
  assert(palco.includes('function '+nome+'('),nome+' no arquivo novo');
  assert(!html.includes('function '+nome+'('),nome+' não ficou duplicado no HTML');
}
// Quem lê o estado do jogo continua na sala.
for(const nome of ['meuChar','ktMicCor','ktCorMembro'])assert(html.includes('function '+nome+'('),nome+' fica na sala');

// Camadas lentas no krLoop: janela, mesa, enfeites e plantas.
const loop=html.slice(html.indexOf('function krLoop(){'),html.indexOf('var krMus=null;'));
for(const nome of ['janela','mesa','decor','plantas'])assert(new RegExp("KaraokePalco\\.camada\\('"+nome+"',x,\\d+,").test(loop),'camada '+nome);
assert(!/[;{]ktMesaKaraoke\(x,t\)/.test(loop)&&!/[;{]ktPlantasSala\(x,t\)/.test(loop),'mesa e plantas não são mais pintadas direto todo quadro');

// Camada: redesenha no intervalo ou quando a chave/transformação muda; nos outros quadros só copia.
function canvasFalso(){const c={width:960,height:540,ops:[]};c.ctx={canvas:c,_m:{a:1,b:0,c:0,d:1,e:0,f:0},
  getTransform(){return this._m;},setTransform(m){if(typeof m==='object')this._m=m;c.ops.push('setTransform');},clearRect(){c.ops.push('clear');},
  save(){c.ops.push('save');},restore(){c.ops.push('restore');},drawImage(src){c.ops.push('drawImage:'+(src.__camada?'camada':'?'));}};
  c.getContext=()=>c.ctx;return c;}
let agora=0;const sb={performance:{now:()=>agora},document:{createElement:()=>{const c=canvasFalso();c.__camada=true;return c;}},window:{}};
vm.createContext(sb);vm.runInContext(palco,sb);
const KP=sb.window.KaraokePalco;const sala=canvasFalso();let n=0;const desenha=()=>{n++;};
KP.camada('t',sala.ctx,100,desenha,'a');assert.equal(n,1,'primeiro quadro desenha');
agora=50;KP.camada('t',sala.ctx,100,desenha,'a');assert.equal(n,1,'antes do intervalo só copia');
assert(sala.ops.filter(o=>o==='drawImage:camada').length===2,'cada quadro copia a camada');
agora=101;KP.camada('t',sala.ctx,100,desenha,'a');assert.equal(n,2,'passou o intervalo: redesenha');
agora=110;KP.camada('t',sala.ctx,100,desenha,'b');assert.equal(n,3,'chave nova (paleta, VIP, vista): redesenha na hora');
sala.ctx._m={a:2,b:0,c:0,d:2,e:0,f:0};agora=115;KP.camada('t',sala.ctx,100,desenha,'b');assert.equal(n,4,'escala do canvas mudou: redesenha');
KP.camada.ms=0;agora=116;KP.camada('t',sala.ctx,100,desenha,'b');assert.equal(n,5,'KaraokePalco.camada.ms=0 força todo quadro (teste de pixel)');
KP.camada.ms=null;
// Aparelho lento: com quadros mais demorados que a camada, depois de 3 quadros ela desenha direto (sem cópia extra).
const lenta=canvasFalso();let nl=0;const dl=()=>{nl++;};
for(let k=0;k<6;k++){agora=1000+k*150;KP.camada('lenta',lenta.ctx,100,dl);}
assert.equal(nl,6,'lento: desenha todo quadro');const copias=lenta.ops.filter(o=>o==='drawImage:camada').length;
assert(copias<=3,'lento: para de copiar a camada ('+copias+' cópias)');
for(let k=0;k<8;k++){agora=2000+k*33;KP.camada('lenta',lenta.ctx,100,dl);}
assert(lenta.ops.filter(o=>o==='drawImage:camada').length>copias,'voltou a ficar rápido: camada volta');
const semCtx={canvas:{width:1,height:1}};sb.document.createElement=()=>({getContext:()=>null});KP.camada('sem',semCtx,100,desenha);assert.equal(n,6,'sem canvas guardado: desenha direto');

// Show no celular: só a faixa visível (object-fit:cover) é pintada; "Ver sala inteira" e a foto continuam com a sala toda.
assert(html.includes('function krCorteSala(cv){if(krFotoEspera)return null;')&&html.includes("b.classList.contains('kt-mobile-overview'))return null;")&&html.includes("if(cs.objectFit!=='cover')return null;"),'corte só no show em tela cheia com cover');
assert(loop.includes('var krCorte=krCorteSala(cv);if(krCorte){x.save();x.beginPath();x.rect(krCorte[0],krCorte[1],krCorte[2],krCorte[3]);x.clip();}'),'corte aplicado no começo do quadro');
assert(loop.includes('if(krCorte)x.restore();if(krFotoEspera&&!krCorte){'),'corte desfeito no fim do quadro e foto liberada depois de um quadro inteiro');
assert(html.includes('if(ja!==true&&krCorteSala(cv)){')&&html.includes('krFotoEspera=krFotoVai;')&&html.includes('if(krFotoEspera!==krFotoVai)return;\n    krFotoEspera=null;\n    krAviso('),'foto no meio do show espera um quadro inteiro e avisa se o prazo expirar');
// Idols totalmente fora da faixa não são pintados, mas o balão continua na fila.
assert(loop.includes('if(!krCorte||(j.x+90>=krCorte[0]&&j.x-90<=krCorte[0]+krCorte[2])){if(sentado)ktAlmofadaPijama(')&&loop.includes("x.fillText(j.nick,j.x,j.y+19);}var bl=activeBalloon;"),'idols fora da faixa pulados; balões preservados');
console.log('✓ Karaoke: enfeites em karaoke-palco-desenho.js, camadas lentas, corte do show no celular e foto inteira');

// Wall, carpet and floor reflections share the same baseline in room coordinates.
const encontroPiso=Number(html.match(/var KR_ROOM_PISO_Y=(\d+);/)[1]);
assert.equal(encontroPiso,330);
assert.match(html,/krParedeEstofada\(bg,W,KR_ROOM_PISO_Y\)/);
assert.match(html,/x\.drawImage\(krCarpeteCache,0,KR_ROOM_PISO_Y\)/);
assert.match(loop,/x\.fillRect\(150,KR_ROOM_PISO_Y,660,H2-KR_ROOM_PISO_Y\)/);
assert(loop.indexOf('krDesenharCarpete(x,W2,H2)')<loop.indexOf('krDesenharDecoracaoSala(x,t,W2,H2,paleta)'),
  'carpet is painted before the planters that stand along the wall');
