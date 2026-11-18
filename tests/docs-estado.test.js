'use strict';
// Um documento de estado só (18/11/2026): docs/RETOMADA.md. O diário e os retratos antigos ficam em docs/historico/.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.join(__dirname,'..'),ler=f=>fs.readFileSync(path.join(root,f),'utf8');
const ret=ler('docs/RETOMADA.md');
assert(ret.length<20000,'RETOMADA curta (estado de hoje; relato vai para o diário): '+ret.length+' bytes');
for(const s of ['## Como atualizar','## Regras do projeto','## Onde está','### Jogos','## Pendências'])assert(ret.includes(s),'RETOMADA tem '+s);
assert(!fs.existsSync(path.join(root,'docs/STATUS.md'))&&!fs.existsSync(path.join(root,'docs/PR58_STATUS.md')),'estados antigos só no histórico');
assert(fs.existsSync(path.join(root,'docs/historico/diario/2026-11.md')),'diário de novembro');
// Fora do histórico, ninguém aponta para os documentos antigos como se fossem atuais.
const mds=[];(function andar(d){for(const e of fs.readdirSync(path.join(root,d),{withFileTypes:true})){if(['node_modules','.git','historico'].includes(e.name))continue;const r=path.join(d,e.name);if(e.isDirectory())andar(r);else if(e.name.endsWith('.md'))mds.push(r);}})('.');
for(const f of mds){const s=ler(f);assert(!/\]\((?:\.\/|docs\/)?(?:STATUS|PR58_STATUS)\.md\)/.test(s),f+' ainda aponta para STATUS/PR58_STATUS antigos');}
assert(ler('README.md').includes('docs/RETOMADA.md')&&ler('docs/README.md').includes('RETOMADA.md'),'README e docs/README apontam para a RETOMADA');
console.log('✓ Documentos: um estado só (docs/RETOMADA.md), diário e retratos antigos no histórico');
