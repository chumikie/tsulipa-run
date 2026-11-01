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

console.log('✓ Avatar: careca, chapéu de capitão, estrela e consistência do elenco');
