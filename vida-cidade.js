/* Vida de Idol⭐ — Cidade que Reage, primeira sequência integrada.
   Somente fatos confirmados pelas telas existentes + fotos voluntárias do TsuPhone.
   Sem SQL, RPC, saves, moeda, recompensas, timers ou novos loops de Canvas.
*/
(function(){
'use strict';
var TIPOS={
 cafe:{icone:'☕',cap:1},handshake:{icone:'🤝',cap:1},reencontro:{icone:'💌',cap:1},
 bloom_plantar:{icone:'🌱',cap:0},bloom_regar:{icone:'💧',cap:0},bloom_colher:{icone:'🌷',cap:0},
 studio_clique:{icone:'📸',cap:2},studio_publicar:{icone:'📰',cap:2},
 foto:{icone:'🖼️',cap:2},battle:{icone:'🎤',cap:1}
};
var T={
 pt:{tit:'🌸 A cidade se lembra',sub:'Pequenos acontecimentos da sua visita',vazio:'Seu próximo encontro pode virar uma lembrança.',cam:'Cantinho de lembranças',vazioCam:'Seu Camarim vai ganhar detalhes das suas atividades.',foto:'Porta-retratos',vaso:'Vasinho do jardim',cards:'Estante de cards',cap:'Minha pequena história',etapas:['Cuidar do nosso cantinho','Encontrar alguém na cidade','Guardar o momento'],novo:'Uma lembrança chegou ao seu mundo!',agora:'Seu Pet acompanha a rotina do Idol.',manha:'A cidade desperta para mais um dia.',tarde:'A tarde trouxe movimento às ruas.',noite:'As luzes da cidade estão acesas.',diario:'Memórias desta visita',nota:'Lembranças temporárias, sem mudar seu Diário salvo.',
   cafe:'Seu Idol terminou um atendimento no Happy⭐Cafe!.',reencontro:'Você reencontrou {nome} no Happy⭐Cafe!.',handshake:'Seu Idol reencontrou fãs no Handshake⭐Event!.',bloom_plantar:'Uma sementinha ganhou lugar no Bloom⭐Garden!.',bloom_regar:'Seu Idol cuidou de um canteiro.',bloom_colher:'Uma flor foi colhida no jardim.',studio_clique:'Uma foto foi confirmada no Photo⭐Studio!.',studio_publicar:'Uma foto entrou no Mural do Photo⭐Studio!.',foto:'Uma foto foi guardada voluntariamente no TsuPhone.',battle:'Seu Idol concluiu uma batalha oficial.'},
 en:{tit:'🌸 The town remembers',sub:'Little moments from this visit',vazio:'Your next encounter may become a memory.',cam:'Memory corner',vazioCam:'Your dressing room will reflect what you do.',foto:'Photo frame',vaso:'Garden vase',cards:'Card shelf',cap:'My little story',etapas:['Care for our corner','Meet someone in town','Keep the moment'],novo:'A new memory has arrived!',agora:'Your pet accompanies your Idol.',manha:'The town is waking up.',tarde:'The streets are lively this afternoon.',noite:'The town lights are glowing.',diario:'Memories from this visit',nota:'Temporary memories; your saved Diary stays unchanged.',
   cafe:'Your Idol finished a shift at Happy⭐Cafe!.',reencontro:'You met {nome} again at Happy⭐Cafe!.',handshake:'Your Idol met fans at Handshake⭐Event!.',bloom_plantar:'A little seed was planted at Bloom⭐Garden!.',bloom_regar:'Your Idol watered a flowerbed.',bloom_colher:'A flower was picked in the garden.',studio_clique:'A photo was verified at Photo⭐Studio!.',studio_publicar:'A photo joined the Photo⭐Studio! wall.',foto:'A photo was saved voluntarily in TsuPhone.',battle:'Your Idol completed an official battle.'},
 es:{tit:'🌸 La ciudad recuerda',sub:'Pequeños momentos de esta visita',vazio:'Tu próximo encuentro puede ser un recuerdo.',cam:'Rincón de recuerdos',vazioCam:'Tu camerino mostrará tus actividades.',foto:'Portarretratos',vaso:'Florero del jardín',cards:'Estante de cards',cap:'Mi pequeña historia',etapas:['Cuidar nuestro rincón','Encontrar a alguien','Guardar el momento'],novo:'¡Llegó un recuerdo nuevo!',agora:'Tu mascota acompaña al Idol.',manha:'La ciudad despierta.',tarde:'La ciudad está llena de vida.',noite:'Las luces de la ciudad brillan.',diario:'Recuerdos de esta visita',nota:'Recuerdos temporales, sin cambiar el diario guardado.',
   cafe:'Tu Idol terminó una atención en Happy⭐Cafe!.',reencontro:'Te reencontraste con {nome} en Happy⭐Cafe!.',handshake:'Tu Idol encontró fans en Handshake⭐Event!.',bloom_plantar:'Una semilla llegó a Bloom⭐Garden!.',bloom_regar:'Tu Idol regó una planta.',bloom_colher:'Se recogió una flor del jardín.',studio_clique:'Una foto fue verificada en Photo⭐Studio!.',studio_publicar:'Una foto llegó al mural de Photo⭐Studio!.',foto:'Guardaste una foto en TsuPhone.',battle:'Tu Idol terminó una batalla oficial.'},
 id:{tit:'🌸 Kota mengingat',sub:'Kenangan kecil dari kunjungan ini',vazio:'Pertemuan berikutnya bisa jadi kenangan.',cam:'Sudut kenangan',vazioCam:'Ruang ganti akan menampilkan kegiatanmu.',foto:'Bingkai foto',vaso:'Vas taman',cards:'Rak kartu',cap:'Cerita kecilku',etapas:['Merawat tempat kita','Bertemu seseorang','Menyimpan momen'],novo:'Kenangan baru datang!',agora:'Pet menemani Idol-mu.',manha:'Kota mulai bangun.',tarde:'Jalanan ramai sore ini.',noite:'Lampu kota menyala.',diario:'Kenangan kunjungan ini',nota:'Kenangan sementara, tanpa mengubah buku harian.',
   cafe:'Idol selesai melayani di Happy⭐Cafe!.',reencontro:'Kamu bertemu lagi dengan {nome} di Happy⭐Cafe!.',handshake:'Idol bertemu penggemar di Handshake⭐Event!.',bloom_plantar:'Benih ditanam di Bloom⭐Garden!.',bloom_regar:'Idol menyiram tanaman.',bloom_colher:'Bunga dipetik dari taman.',studio_clique:'Foto diverifikasi di Photo⭐Studio!.',studio_publicar:'Foto masuk ke mural Photo⭐Studio!.',foto:'Foto disimpan di TsuPhone.',battle:'Idol menuntaskan Battle resmi.'},
 th:{tit:'🌸 เมืองจดจำ',sub:'ความทรงจำเล็ก ๆ ในครั้งนี้',vazio:'การพบกันครั้งหน้าอาจกลายเป็นความทรงจำ',cam:'มุมความทรงจำ',vazioCam:'ห้องแต่งตัวจะแสดงเรื่องราวของคุณ',foto:'กรอบรูป',vaso:'แจกันดอกไม้',cards:'ชั้นการ์ด',cap:'เรื่องราวเล็ก ๆ',etapas:['ดูแลพื้นที่ของเรา','พบใครบางคน','เก็บช่วงเวลาดี ๆ'],novo:'มีความทรงจำใหม่!',agora:'สัตว์เลี้ยงอยู่เป็นเพื่อนไอดอล',manha:'เมืองตื่นรับวันใหม่',tarde:'บ่ายนี้เมืองคึกคัก',noite:'ไฟเมืองส่องสว่าง',diario:'ความทรงจำครั้งนี้',nota:'ชั่วคราว ไม่แก้ไขไดอารีที่บันทึกไว้',
   cafe:'ไอดอลให้บริการที่ Happy⭐Cafe! สำเร็จ',reencontro:'คุณพบ {nome} อีกครั้งที่ Happy⭐Cafe!',handshake:'ไอดอลพบแฟน ๆ ที่ Handshake⭐Event!',bloom_plantar:'ปลูกเมล็ดใน Bloom⭐Garden! แล้ว',bloom_regar:'ไอดอลรดน้ำต้นไม้แล้ว',bloom_colher:'เก็บดอกไม้จากสวนแล้ว',studio_clique:'ยืนยันภาพที่ Photo⭐Studio! แล้ว',studio_publicar:'ลงรูปบนผนัง Photo⭐Studio! แล้ว',foto:'บันทึกรูปไว้ใน TsuPhone แล้ว',battle:'ไอดอลจบการแข่งขันอย่างเป็นทางการแล้ว'},
 ja:{tit:'🌸 街の思い出',sub:'今回の訪問で生まれた小さな出来事',vazio:'次の出会いが思い出になるかも。',cam:'思い出コーナー',vazioCam:'活動の思い出が楽屋に増えていきます。',foto:'フォトフレーム',vaso:'お花の花瓶',cards:'カード棚',cap:'私の小さな物語',etapas:['お部屋を大切に','街で誰かと出会う','瞬間を残す'],novo:'新しい思い出が届いた！',agora:'ペットがアイドルに寄り添っています。',manha:'街が目覚める朝。',tarde:'午後の街はにぎやか。',noite:'街の灯りがともる夜。',diario:'今回の訪問の思い出',nota:'一時的な記録です。保存済みの日記は変わりません。',
   cafe:'Happy⭐Cafe!で接客を終えました。',reencontro:'Happy⭐Cafe!で{name}にまた会えました。',handshake:'Handshake⭐Event!でファンに会いました。',bloom_plantar:'Bloom⭐Garden!に種をまきました。',bloom_regar:'アイドルが花壇に水をあげました。',bloom_colher:'お庭で花を摘みました。',studio_clique:'Photo⭐Studio!で写真を確認しました。',studio_publicar:'Photo⭐Studio!の掲示板に写真を投稿しました。',foto:'TsuPhoneに写真を保存しました。',battle:'公式バトルを終えました。'}
};
var entradas=[],dono='',visto={},versao=0;
function lingua(){return typeof LANG==='string'&&T[LANG]?LANG:'pt';}
function t(k){return T[lingua()][k]||T.pt[k]||k;}
function escapar(x){return String(x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
// As ruas redesenham em ciclos curtos: não criar Intl.DateTimeFormat a cada quadro.
var formatoDia=new Intl.DateTimeFormat('en-CA',
  {timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'});
var diaCache='',diaCacheQuando=0;
function diaBR(){
 var agora=Date.now();
 if(!diaCache||agora>=diaCacheQuando||agora<diaCacheQuando-15000){
   diaCache=formatoDia.format(new Date(agora));
   diaCacheQuando=agora+15000;
 }
 return diaCache;
}
function chave(){var c=typeof contaJ!=='undefined'?contaJ:null;
 return c&&String(c.id||c.nick||'').slice(0,128)||'';}
function conferir(){var atual=chave(),escopo=atual?atual+'@'+diaBR():'';
 if(escopo!==dono){dono=escopo;entradas=[];visto={};versao++;}return !!atual;}
function registrar(tipo,info){
 if(!TIPOS[tipo]||!conferir())return false;
 info=info&&typeof info==='object'?info:{};
 var codigo=String(info.id||'').slice(0,90),dedupe=tipo+'|'+codigo;
 if(codigo&&visto[dedupe])return false;
 // Validar novamente os fãs NPCs usando a memória já existente do Handshake.
 var fa=null,visual=null;
 if(tipo==='reencontro'){
  if(!codigo||typeof hsMemChave!=='function'||typeof hsMemLer!=='function'
      ||info.conta!==hsMemChave())return false;
  fa=hsMemLer().find(function(m){return m&&m.nome===info.nome&&m.pres===info.pres;});
  if(!fa)return false;
  visual={};
  ['hair','hair2','skin','outcol','legcol'].forEach(function(k){
    var valor=fa.c&&fa.c[k];
    if(typeof valor==='string'&&/^#[0-9a-f]{6}$/i.test(valor))visual[k]=valor;
  });
  ['back','front','det','out','gl','hat'].forEach(function(k){
    var valor=fa.c&&fa.c[k];
    if(typeof valor==='string'&&valor.length<=16)visual[k]=valor;
  });
 }
 if(codigo)visto[dedupe]=true;
 entradas.push({tipo:tipo,icone:TIPOS[tipo].icone,cap:TIPOS[tipo].cap,
   nome:fa?fa.nome:'',visual:visual,
   jeito:fa&&/^(timido|animado|fofo)$/.test(fa.jeito)?fa.jeito:(fa?'fofo':''),
   flor:/^(sakura|tulipa|girassol|lunar)$/.test(info.flor)?info.flor:''});
 if(entradas.length>8)entradas.shift();
 versao++;
 atualizar();
 return true;
}
function estado(){conferir();return entradas.map(function(e){return {tipo:e.tipo,icone:e.icone,cap:e.cap,flor:e.flor};});}
function capitulos(){conferir();return [0,1,2].map(function(n){return entradas.some(function(e){return e.cap===n;});});}
// A cena consulta um resumo sem nomes, fotos ou identificadores do jogador.
 // Nada acontece antes de uma ação confirmada por servidor ou foto voluntária.
var CENAS={
 harajuku:['cafe'],palco:['handshake'],praca:['reencontro'],fofo:['bloom_plantar','bloom_regar','bloom_colher'],
 ceu:['studio_clique','studio_publicar'],arena:['battle']
};
function sinalCena(bairro){
 if(!conferir()||!CENAS[bairro])return null;
 for(var i=entradas.length-1;i>=0;i--){
   var e=entradas[i];
   if(CENAS[bairro].indexOf(e.tipo)>=0)return {tipo:e.tipo,flor:e.flor,nome:e.nome,visual:e.visual,jeito:e.jeito};
 }
 return null;
}
function objetoCamarim(){
 if(!conferir())return null;
 // A flor ou fotografia já existente vira um adereço VISUAL na estante.
 for(var i=entradas.length-1;i>=0;i--){
   var e=entradas[i];
   if(e.tipo==='bloom_colher')return {tipo:'flor',flor:e.flor};
   if(e.tipo==='foto'||e.tipo==='studio_clique'||e.tipo==='studio_publicar')
     return {tipo:'foto'};
 }
 return null;
}

// A estante pode guardar até duas lembranças independentes, sem imagens duplicadas.
function objetosCamarim(){
 if(!conferir())return [];
 var flor=null,foto=false;
 for(var i=entradas.length-1;i>=0;i--){
   var e=entradas[i];
   if(!flor&&e.tipo==='bloom_colher')flor={tipo:'flor',flor:e.flor};
   if(e.tipo==='foto'||e.tipo==='studio_clique'||e.tipo==='studio_publicar')foto=true;
   if(flor&&foto)break;
 }
 var itens=[];
 if(flor)itens.push(flor);
 if(foto)itens.push({tipo:'foto'});
 return itens;
}
var HISTORIA={
 pt:['','','O dia já reúne dois pequenos momentos. Cada escolha deixa a cidade um pouco mais sua.',
   'Você cuidou de algo, encontrou pessoas e guardou uma lembrança. Hoje já tem uma pequena história!'],
 en:['','','Two little moments already belong to today. Each choice makes this town feel more like yours.',
   'You cared for something, met people and kept a memory. Today has a little story of its own!'],
 es:['','','Hoy ya reúne dos pequeños momentos. Cada elección hace que la ciudad sea más tuya.',
   'Cuidaste algo, encontraste personas y guardaste un recuerdo. ¡Hoy ya tiene su propia historia!'],
 id:['','','Dua momen kecil sudah terjadi hari ini. Setiap pilihan membuat kota ini terasa semakin milikmu.',
   'Kamu merawat sesuatu, bertemu orang, dan menyimpan kenangan. Hari ini punya kisah kecil sendiri!'],
 th:['','','วันนี้มีช่วงเวลาดี ๆ แล้วสองครั้ง ทุกการเลือกทำให้เมืองนี้เป็นของคุณมากขึ้น',
   'คุณได้ดูแลบางสิ่ง พบผู้คน และเก็บความทรงจำ วันนี้มีเรื่องราวเล็ก ๆ แล้ว!'],
 ja:['','','今日の小さな出来事が二つつながったよ。選ぶたびに、この街があなたの街になっていく。',
   '何かを大切にして、人に出会って、思い出を残した。今日は小さな物語ができたね！']
};
function historiaHtml(){
 var qtd=capitulos().filter(Boolean).length;
 if(qtd<2)return '';
 var frases=HISTORIA[lingua()]||HISTORIA.pt;
 return '<p class="tw-vida-elo">✦ '+escapar(frases[qtd])+'</p>';
}
function relato(e){return e.icone+' '+t(e.tipo).replace('{nome}',e.nome||'');}
function fase(){var agora=new Intl.DateTimeFormat('en-US',{timeZone:'America/Sao_Paulo',hour:'2-digit',hour12:false}).format(new Date());
 var h=Number(agora)%24;return h<12?'manha':h<18?'tarde':'noite';}
function capitulosHtml(){var feitos=capitulos(),copy=T[lingua()];
 return '<ol class="tw-vida-capitulos">'+copy.etapas.map(function(s,i){
  return '<li class="'+(feitos[i]?'feito':'')+'">'+(feitos[i]?'✓ ':'○ ')+escapar(s)+'</li>';}).join('')+'</ol>';
}
function diarioHtml(){
 if(!conferir()||!entradas.length)return '';
 return '<section class="tw-vida-diario"><b>🌸 '+escapar(t('diario'))+'</b><ol>'+
   entradas.slice(-3).reverse().map(function(e){return '<li>'+escapar(relato(e))+'</li>';}).join('')+
   '</ol>'+historiaHtml()+'<small>'+escapar(t('nota'))+'</small></section>';
}
function montar(){
 var rec=document.getElementById('hubRec'),el=document.getElementById('twVidaCidade');
 if(rec&&!el&&rec.parentNode){
  el=document.createElement('section');el.id='twVidaCidade';el.className='hubpainel tw-vida-cidade';
  el.setAttribute('aria-label',t('tit'));rec.parentNode.insertBefore(el,rec);
 }
 var room=document.getElementById('petRoom'),mem=document.getElementById('twVidaCamarim');
 if(room&&!mem){
  mem=document.createElement('section');mem.id='twVidaCamarim';mem.className='tw-vida-camarim';
  var info=document.getElementById('petNm');
  var target=info&&info.closest('.petinfo');
  if(target)room.insertBefore(mem,target);else room.appendChild(mem);
 }
}
function imagemMomento(){
 // A foto continua pertencendo ao TsuPhone: só exibe um link visual à imagem
 // que a pessoa já salvou voluntariamente na memória da sessão.
 if(typeof petPhoneMomentosConferir==='function')petPhoneMomentosConferir();
 var arr=typeof petPhoneMomentos!=='undefined'?petPhoneMomentos:[];
 if(!Array.isArray(arr)||!arr.length)return '';
 var p=arr[arr.length-1];
 if(!p||typeof petPhoneFotoChave!=='function'||p.dono!==petPhoneFotoChave())return '';
 var url=p.miniUrl||p.url;
 return typeof url==='string'&&(/^(blob:|data:image\/png;base64,)/.test(url))?url:'';
}
function render(){
 if(typeof document==='undefined'||!document.getElementById)return;
 conferir();montar();
 var city=document.getElementById('twVidaCidade'),mem=document.getElementById('twVidaCamarim');
 // Redesenhar o HTML apenas quando há uma ação nova, outra conta, idioma ou fase do dia.
 // Um rerender habitual do Hub não pode derrubar foco ou refazer miniaturas no iPhone.
 var assinatura=dono+'|'+versao+'|'+lingua()+'|'+fase();
 if(city){
  city.hidden=!dono;
  if(!dono){city.textContent='';city.dataset.twVidaAssinatura='';}
  else if(city.dataset.twVidaAssinatura!==assinatura){
   var atual=entradas[entradas.length-1],cl=capitulos();
   city.innerHTML='<h2>'+escapar(t('tit'))+'</h2><p class="tw-vida-sub">'+escapar(t('sub'))+'</p>'+
    '<div class="tw-vida-presenca" role="status"><span class="tw-vida-presenca-emoji" aria-hidden="true">'+
    (atual?atual.icone:'🐾')+'</span><span>'+escapar(atual?relato(atual):t('agora')+' '+t(fase()))+'</span></div>'+
    '<h3>📔 '+escapar(t('cap'))+' <small>'+cl.filter(Boolean).length+'/3</small></h3>'+
    capitulosHtml()+historiaHtml()+
    (entradas.length?'<p class="tw-vida-sub">'+escapar(t('nota'))+'</p>':'');
   city.dataset.twVidaAssinatura=assinatura;
  }
 }
 if(mem){
  mem.hidden=!dono;
  if(!dono){mem.textContent='';mem.dataset.twVidaAssinatura='';}
  else{
   if(mem.dataset.twVidaAssinatura!==assinatura){
    var lembrar=entradas.slice(-3).reverse();
    var colheita=objetosCamarim().find(function(e){return e.tipo==='flor';});
    var emojiFlor=colheita?({sakura:'🌸',tulipa:'🌷',girassol:'🌻',lunar:'🌙'}[colheita.flor]||'🌷'):'🌱';
    mem.innerHTML='<b class="tw-vida-mem-titulo">🌷 '+escapar(t('cam'))+'</b>'+
     '<div class="tw-vida-objetos" role="group">'+
     '<button type="button" data-vida-acao="jardim" title="'+escapar(t('vaso'))+'">'+emojiFlor+' <span>'+escapar(t('vaso'))+'</span></button>'+
     '<button type="button" data-vida-acao="foto" title="'+escapar(t('foto'))+'">🖼️ <span>'+escapar(t('foto'))+'</span></button>'+
     '<button type="button" data-vida-acao="cards" title="'+escapar(t('cards'))+'">🃏 <span>'+escapar(t('cards'))+'</span></button></div>'+
     (lembrar.length?'<p class="tw-vida-mem-itens">'+lembrar.map(function(e){return '<span>'+escapar(relato(e))+'</span>';}).join('')+'</p>':
       '<small class="tw-vida-sub">'+escapar(t('vazioCam'))+'</small>')+
     '<figure class="tw-vida-foto" hidden><img alt="'+escapar(t('foto'))+'" loading="lazy"></figure>';
    mem.dataset.twVidaAssinatura=assinatura;
   }
   // Se uma URL blob: foi revogada no TsuPhone, não manter a miniatura antiga.
   var url=imagemMomento(),fig=mem.querySelector('.tw-vida-foto');
   if(fig){
    var img=fig.querySelector('img');
    fig.hidden=!url;
    if(img&&url&&img.getAttribute('src')!==url)img.src=url;
    if(img&&!url&&img.hasAttribute('src'))img.removeAttribute('src');
   }
  }
 }
}
function atualizar(){if(typeof document!=='undefined'&&!document.hidden)render();}
function agir(acao){
 if(acao==='jardim'){
   if(typeof window.bloomAbrir!=='function')return;
   var fechar=document.getElementById('petX');if(fechar&&typeof fechar.click==='function')fechar.click();
   window.bloomAbrir();
 }else if(acao==='foto'){
   var foto=document.querySelector('#petLifeNav [data-life="celular"]');
   if(foto)foto.click();
 }else if(acao==='cards'){
   var cards=document.querySelector('#petLifeNav [data-life="estante"]');
   if(cards)cards.click();
 }
}
function iniciar(){
 montar();render();
 document.addEventListener('click',function(e){
   var b=e.target&&e.target.closest&&e.target.closest('[data-vida-acao]');
   if(b&&document.getElementById('twVidaCamarim')&&document.getElementById('twVidaCamarim').contains(b))
     agir(b.getAttribute('data-vida-acao'));
 });
 // Atualização quando o usuário entra na cidade; sem polling ou loops novos.
 ['hubMostrar','hubCardsUI'].forEach(function(nome){
   if(typeof window[nome]!=='function')return;
   var original=window[nome];
   window[nome]=function(){var res=original.apply(this,arguments);atualizar();return res;};
 });
 document.addEventListener('visibilitychange',function(){if(!document.hidden)atualizar();});
}
window.TWVidaCidade={registrar:registrar,estado:estado,capitulos:capitulos,diarioHtml:diarioHtml,atualizar:atualizar,
 sinalCena:sinalCena,objetoCamarim:objetoCamarim,objetosCamarim:objetosCamarim,historiaHtml:historiaHtml,
 idiomas:Object.keys(T),tipos:Object.keys(TIPOS)};
if(typeof document!=='undefined'){
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',iniciar);
 else iniciar();
}
})();