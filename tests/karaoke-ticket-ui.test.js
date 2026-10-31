'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'karaoke-tickets.css'),'utf8');
const src=fs.readFileSync(path.join(root,'karaoke-tickets.js'),'utf8');
assert(html.includes('id="ktHeaderTickets"')&&html.includes('id="ktHeaderTicketNumber"'),'contador permanente ao lado das estrelas');
assert(html.includes('class="tw-karaoke-ticket-count"'),'card sempre tem contador independente da quota gratuita');
assert(html.includes('href="./karaoke-tickets.css?v=1"'),'CSS especial entra na página oficial');
assert(html.includes('window.ktTickets.acceptBalance(r)'),'prêmio do Gacha atualiza saldo imediatamente');
assert(html.includes('window.ktTickets.reset()'),'logout não deixa o saldo anterior visível');
assert(html.includes('if(window.ktTickets)window.ktTickets.refresh();'),'login atualiza saldo da conta');
assert(css.includes('tw-ticket-inventory-art')&&css.includes('tw-ticket-inventory-tags'),'cartão de inventário com identidade visual');
assert(css.includes('@media(max-width:420px)'),'contadores e inventário possuem versão celular');
assert(css.includes('prefers-reduced-motion'),'brilhos respeitam movimento reduzido');
assert(!/\.from\(|\.rpc\(/.test(src),'nenhum saldo é gravado diretamente pelo cliente');
for(const lang of ['pt','en','es','th','ja'])assert(src.includes(lang+':['),'textos traduzidos em '+lang);

const elements=new Map();
function element(id){if(!elements.has(id))elements.set(id,{
 id,value:'',textContent:'',disabled:false,attrs:{},classList:{toggle(){}},
 setAttribute(k,v){this.attrs[k]=v;},addEventListener(k,fn){this[k]=fn;},
 querySelector(s){return s==='#ktGiftNick'?elements.get('ktGiftNick')||null:null;},
 set innerHTML(markup){this.html=markup;for(const found of markup.matchAll(/id="([^"]+)"/g))element(found[1]);},
 get innerHTML(){return this.html||'';}
 });return elements.get(id);}
element('ktHeaderTickets');element('ktHeaderTicketNumber');element('ktTicketInventory');
const calls=[];
let wallet=()=>Promise.resolve({ok:true,tickets:3});
const win={
 LANG:'pt',contaJ:null,crypto:{randomUUID:()=> '11111111-1111-4111-8111-111111111111'},twRankData:{ktTickets:0},
 twKaraokeAtualizarCard:()=>calls.push('card'),
 contaRpc:(name,args)=>{calls.push(name);if(name==='kt_ticket_wallet')return wallet();
  if(name==='kt_ticket_gift')return Promise.resolve({ok:true,tickets:2});
  if(name==='kt_ticket_run_start')return Promise.resolve({ok:true,tickets:1,kind:'ticket',run:'test-run'});
  return Promise.resolve({ok:true});}
};
vm.runInNewContext(src,{window:win,_supabase:{},document:{getElementById:id=>elements.get(id)||null},Promise,Number});
const tick=()=>new Promise(resolve=>setImmediate(resolve));
(async()=>{
 assert.equal(element('ktHeaderTicketNumber').textContent,'—','visitante vê saldo indisponível sem ficção de tickets');
 win.contaJ={id:'idol-a'};await win.ktTickets.refresh();
 assert.equal(element('ktHeaderTicketNumber').textContent,'3','ticket junto das estrelas vem do servidor');
 assert.equal(win.twRankData.ktTickets,3,'card principal compartilha o mesmo saldo');
 assert(element('ktTicketInventory').innerHTML.includes('Cada ticket garante'),'item explica a utilidade');
 assert(element('ktTicketInventory').innerHTML.includes('ktGiftSend'),'botão de presentear no inventário');
 element('ktGiftNick').value='Patiliri';element('ktGiftSend').click();await tick();
 assert.equal(element('ktHeaderTicketNumber').textContent,'2','presente altera o contador na resposta da RPC');
 assert.equal(win.twRankData.ktTickets,2,'card muda após o presente');
 assert(element('ktTicketInventory').innerHTML.includes('Presente enviado!'),'feedback sobrevive à renderização do novo saldo');
 await win.ktTickets.acceptBalance({tickets:4});
 assert.equal(element('ktHeaderTicketNumber').textContent,'4','Gacha usa saldo da resposta sem aguardar outra consulta');
 const show=await win.ktTickets.startExtra();
 assert(show.ok&&show.kind==='ticket','show extra segue a autorização do servidor');
 assert.equal(element('ktHeaderTicketNumber').textContent,'1','show pago diminui o contador imediatamente');
 let resolveLate;wallet=()=>new Promise(resolve=>resolveLate=resolve);
 const stale=win.ktTickets.refresh();
 await win.ktTickets.acceptBalance({tickets:5});resolveLate({ok:true,tickets:0});await stale;
 assert.equal(win.ktTickets.get(),5,'consulta atrasada não reverte premiação mais nova');
 wallet=()=>Promise.resolve({ok:true,tickets:1});win.contaJ={id:'idol-b'};await win.ktTickets.refresh();
 assert.equal(win.ktTickets.get(),1,'trocar de Idol não mantém saldo da conta anterior');
 let resolveAfterExit;wallet=()=>new Promise(resolve=>resolveAfterExit=resolve);
 const whileLoggingOut=win.ktTickets.refresh();win.contaJ=null;win.ktTickets.reset();
 resolveAfterExit({ok:true,tickets:12});await whileLoggingOut;
 assert.equal(element('ktHeaderTicketNumber').textContent,'—','logout apaga contador mesmo após resposta atrasada');
 assert.equal(win.twRankData.ktTickets,0,'card limpa saldo ao sair');
 win.LANG='en';win.ktTickets.renderBadge();
 assert(element('ktHeaderTickets').attrs['aria-label'].includes('Sign in with Google'),'rótulo do contador segue o idioma');
 console.log('Karaoke ticket UI: cabeçalho, card, inventário, Gacha, presente, show, conta e corrida de RPC OK');
})().catch(e=>{console.error(e);process.exitCode=1;});
