'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const karaoke=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');

// Careca é um corte explícito; o valor vazio continua representando cabelo curto.
assert(index.includes('<option value="">Curto</option><option value="careca">Careca</option>'));
assert(index.includes("if(b!=='careca')"),'o desenho principal omite as camadas de cabelo para careca');
assert(karaoke.includes("if(b!=='careca')"),'a sala de Karaoke usa a mesma distinção visual');

// Dois novos cortes ondulados curtos: masculino mais rente e feminino mais cheio que Pixie, sem chegar ao Chanel.
assert(index.includes('<option value="onduladom">Ondulado curto (masculino)</option><option value="onduladof">Ondulado curto (feminino)</option>'));
for(const source of [index,karaoke]){
  assert(source.includes("b==='onduladom'"),'ondulado curto masculino deve ter desenho próprio');
  assert(source.includes("b==='onduladof'"),'ondulado curto feminino deve ter desenho próprio');
  assert(source.includes("b==='onduladof'?9"),'ondulado feminino deve ter volume intermediário, abaixo do comprimento Chanel');
}
// Chapéu quase preto e estrela pequena no mesmo ponto lateral das flores existentes.
assert(index.includes("g.fillStyle='#111521'")&&karaoke.includes("g.fillStyle='#111521'"));
assert(index.includes("g.fillStyle='#070a12'")&&karaoke.includes("g.fillStyle='#070a12'"));
assert(index.includes("g.save();g.translate(x+6,y+3);g.fillStyle='#f5b400'"));
assert(karaoke.includes("g.save();g.translate(x+6,y+3);g.fillStyle='#f5b400'"));
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

console.log('✓ Avatar: careca, chapéu de capitão, estrela e consistência do elenco');
