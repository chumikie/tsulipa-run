'use strict';
// Roda todas as verificações rápidas do site (sem navegador e sem banco): tests/validate-games.js e tests/*.test.js.
// Uso: node tests/run-all.js   (o CI chama só este arquivo; teste novo não precisa mexer no workflow)
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const dir=__dirname,root=path.join(dir,'..');
const files=['validate-games.js'].concat(fs.readdirSync(dir).filter(f=>f.endsWith('.test.js')).sort());
const falhas=[];
for(const f of files){
  const file=path.join(dir,f),usaNodeTest=/require\(['"]node:test['"]\)/.test(fs.readFileSync(file,'utf8'));
  const t0=Date.now(),r=spawnSync(process.execPath,usaNodeTest?['--test',file]:[file],{cwd:root,encoding:'utf8',timeout:120000});
  const ok=r.status===0,ms=Date.now()-t0;
  console.log((ok?'✓ ':'✗ ')+f+' ('+ms+' ms)');
  if(!ok){falhas.push(f);process.stdout.write(((r.stdout||'')+(r.stderr||'')).split('\n').slice(-25).map(l=>'    '+l).join('\n')+'\n');}
}
console.log('\n'+(files.length-falhas.length)+'/'+files.length+' verificações passaram'+(falhas.length?' · falharam: '+falhas.join(', '):''));
process.exit(falhas.length?1:0);
