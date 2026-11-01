'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const karaoke=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');

// Careca não faz parte do catálogo; o valor vazio continua representando cabelo curto.
assert(!index.includes('value="careca"')&&!index.includes("if(b!=='careca')"),'o catálogo não deve oferecer o corte Careca');
assert(!karaoke.includes("if(b!=='careca')"),'o renderizador do Karaoke não deve manter tratamento especial para Careca');

// Dois novos cortes ondulados curtos: masculino mais rente e feminino mais cheio que Pixie, sem chegar ao Chanel.
assert(index.includes('<option value="onduladom">Ondulado curto masculino</option><option value="onduladom2">Ondulado curto masculino bicolor</option><option value="onduladof">Ondulado curto feminino</option>'));
for(const source of [index,karaoke]){
  assert(source.includes("b==='onduladom'"),'ondulado curto masculino deve ter desenho próprio');
  assert(source.includes("b==='onduladom2'"),'ondulado masculino bicolor deve ter desenho próprio');
  assert(source.includes("var H2=c.hair2||'#ffffff'"),'a versão bicolor deve usar a segunda cor configurável');
  assert(source.includes("g.rect(x-3,y-4,18,34)"),'a versão bicolor deve dividir o cabelo em duas metades');
  assert(source.includes("b==='onduladof'?9"),'ondulado curto feminino deve ter um comprimento intermediário entre Pixie e Chanel');
  assert(source.includes('E(x+2,y+20,3.5,6,-.12)')&&source.includes('E(x+28,y+20,3.5,6,.12)'),'ondulado feminino deve ter volume lateral curto e equilibrado');
}
// Chapéu quase preto e estrela pequena no mesmo ponto lateral das flores existentes.
assert(index.includes("capShade.addColorStop(.48,'#090b12')")&&karaoke.includes("capShade.addColorStop(.48,'#090b12')"));
assert(index.includes("capShade.addColorStop(1,'#03040a')")&&karaoke.includes("capShade.addColorStop(1,'#03040a')"));
assert(index.includes('var goldBand=g.createLinearGradient')&&karaoke.includes('var goldBand=g.createLinearGradient'));
assert(index.includes("var starGold=g.createRadialGradient(-.8,-1.1,.2,0,0,3.3)")&&index.includes('var sr=si%2===0?3.2:1.45'));
assert(karaoke.includes("var starGold=g.createRadialGradient(-.8,-1.1,.2,0,0,3.3)")&&karaoke.includes('var sr=si%2===0?3.2:1.45'));
assert(index.includes("if(A==='hibisco')FL(x+6,y+3"));
assert(index.includes("if(A==='sakura')FL(x+6,y+3"));
assert(karaoke.includes("if(A==='hibisco')FL(x+6,y+3"));
assert(karaoke.includes("if(A==='sakura')FL(x+6,y+3"));

// Chapéu de capitão e estrela são desbloqueios independentes, sem substituir acessórios antigos.
assert(index.includes('value="capitao" data-r="15000"'),'chapéu liberado no rank Capitão');
assert(index.includes("if(hacc==='capitao')"),'chapéu desenhado no avatar principal');
assert(karaoke.includes("if(hacc==='capitao')"),'chapéu desenhado também no Karaoke');
assert(index.includes("['estrela','Estrela dourada',RANKS[8][0],8]"),'estrela liberada em Solo Center');
assert(index.includes("if(A==='estrela')"),'estrela desenhada no avatar principal');
assert(karaoke.includes("if(A==='estrela')"),'estrela desenhada também no Karaoke');

// Acessórios antigos continuam no renderizador em ambas as cópias.
for(const key of ['boina','presilhas','fones','coala']){
  assert(index.includes("hacc==='"+key+"'"),'preservar chapéu/acessório antigo: '+key);
  assert(karaoke.includes("hacc==='"+key+"'"),'preservar chapéu/acessório antigo no Karaoke: '+key);
}

// O acessório pessoal via campo avatar.a chega à sala e ao personagem local.
assert(karaoke.includes("accSel=c._avatarA||''"),'renderizador recebe o acessório pessoal');
assert(karaoke.includes("_avatarA:p.avatar.a||''"),'elenco diário preserva avatar.a');
assert(karaoke.includes("c._avatarA=localStorage.getItem('brs48cr_acc')||''"),'Idol local preserva acessório escolhido');
assert(karaoke.includes("a:read('brs48cr_acc')||''"),'perfil atual da conta leva o acessório à plateia');

// Perfil/retrato já usam o mesmo campo de corte e o mesmo item do avatar.
assert(index.includes("var PERF_CAMPOS = ['hair', 'hair2', 'streak', 'skin', 'eye', 'back', 'front', 'det', 'gl', 'out', 'outcol', 'hat']"));
assert(index.includes("accSel = typeof av.a === 'string' ? av.a : ''"));
assert(index.includes("[['cback', 'back'], ['cfront', 'front'], ['cdet', 'det']]"),'editor do perfil reutiliza as opções de corte');
assert(index.includes("[['chat', 'hat'], ['cgl', 'gl']]"),'editor do perfil reutiliza as opções de chapéu');

console.log('✓ Avatar: cabelos ondulados, chapéu de capitão, estrela e consistência do elenco');
