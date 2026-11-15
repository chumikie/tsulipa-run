'use strict';
// Handshake⭐Event! e Happy⭐Cafe! sob demanda: só a base (jogos-base.js) carrega na abertura.
const assert=require('assert'),fs=require('fs'),path=require('path'),vm=require('vm');
const raiz=path.join(__dirname,'..'),ler=f=>fs.readFileSync(path.join(raiz,f),'utf8');
const html=ler('index.html'),base=ler('jogos-base.js'),hs=ler('handshake.js'),cf=ler('cafe.js');
for(const f of ['handshake','cafe','cafe-gorjeta','cafe-vip','cafe-duplo','flores'])
  assert.ok(!new RegExp('<script src="\\./'+f+'\\.js').test(html),f+'.js não carrega na abertura');
assert.ok(/<script src="\.\/jogos-base\.js\?v=\d+"><\/script>/.test(html),'base carrega na abertura');
const ordem=(html.match(/ARQ=\[([^\]]+)\]/)||[])[1]||'';
assert.deepEqual([...ordem.matchAll(/\.\/([a-z-]+)\.js/g)].map(m=>m[1]),['handshake','cafe','cafe-gorjeta','cafe-vip','cafe-duplo','flores'],'ordem do pacote');
assert.ok(/window\.hsAbrir=atalho\('hsAbrir'\)/.test(html)&&/window\.cfAbrir=atalho\('cfAbrir'\)/.test(html),'atalhos de abrir');
assert.ok(!/hsOv\.addEventListener\('click', hsClique\)/.test(html)&&!/onclick = cfFechar;/.test(html),'nada liga direto em função do jogo na abertura');
// O que o resto do site lê fica só na base (sem cópia que zere o valor ao carregar o jogo).
for(const n of ['HS_NOMES','HS_NOMES_ANTIGOS','HS_PRESENTES','HS_JEITOS','HS_MEMORIA_CHAVE','hsCafePendente','CF_BASES']){
  assert.ok(new RegExp('^var '+n+'\\b','m').test(base),n+' na base');
  assert.ok(!new RegExp('^var '+n+'\\b','m').test(hs+cf),n+' não repetido no jogo');
}
for(const n of ['hsNomesLivres','hsMemChave','hsMemLer','hsHubHtml','cfVisitasMemorias','cfHubHtml'])
  assert.ok(new RegExp('^function '+n+'\\(','m').test(base)&&!new RegExp('^function '+n+'\\(','m').test(hs+cf),n+' só na base');
// A base roda sozinha e monta os cartões do Hub.
const ctx={localStorage:{getItem:()=>null},Date,JSON,contaJ:null,tr:s=>s,escHtml:s=>s};vm.createContext(ctx);
vm.runInContext(base,ctx);
assert.ok(/data-ir="handshake"/.test(ctx.hsHubHtml())&&/data-ir="cafe"/.test(ctx.cfHubHtml()),'cartões do Hub');
assert.deepEqual(ctx.hsMemLer(),[],'sem conta, sem lembranças');
console.log('OK: Handshake e Café sob demanda (base na abertura, jogo no primeiro toque)');
