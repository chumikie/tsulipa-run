/* Comparação do código-base da PR e da revisão, sem servidor real, dados pessoais ou deploy. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
const [base,head,outArg]=process.argv.slice(2);
if(!base||!head||!outArg)throw Error('Uso: node tests/visual-comparativo.cjs BASE HEAD SAIDA');
const out=path.resolve(outArg);fs.mkdirSync(out,{recursive:true});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const estados={};
for(const [nome,root] of [['main',base],['pr',head]]){
  const pasta=path.join(out,nome);fs.mkdirSync(pasta,{recursive:true});
  const sha=spawnSync('git',['-C',path.resolve(root),'rev-parse','HEAD'],{encoding:'utf8'});
  const r=spawnSync(process.execPath,[path.join(__dirname,'telas.browser.cjs'),pasta],{env:{...process.env,TW_VISUAL_ONLY:'1',TW_VISUAL_ROOT:path.resolve(root)},encoding:'utf8',maxBuffer:4*1024*1024});
  fs.writeFileSync(path.join(pasta,'execucao.txt'),(r.stdout||'')+'\n'+(r.stderr||'')+(r.error?'\n'+r.error:''));
  estados[nome]={sha:(sha.stdout||'').trim(),codigo:r.status,resultado:fs.existsSync(path.join(pasta,'resultado.txt'))?fs.readFileSync(path.join(pasta,'resultado.txt'),'utf8'):'captura interrompida'};
}
const arquivos=[...new Set(['main','pr'].flatMap(n=>fs.readdirSync(path.join(out,n)).filter(f=>/^[a-z0-9-]+\.png$/.test(f))))].sort();
const imagem=(n,f)=>fs.existsSync(path.join(out,n,f))?'<a href="'+n+'/'+f+'"><img loading="lazy" src="'+n+'/'+f+'" alt="'+esc(n+' '+f)+'"></a>':'<p>Captura indisponível</p>';
const html='<!doctype html><html lang="pt-BR"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Polish &amp; Personality — comparação</title><style>body{font:16px system-ui;margin:24px;background:#f8f3ff;color:#33244c}section{margin:24px 0;background:white;padding:16px;border-radius:12px}h2{font-size:1.1rem}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}img{display:block;max-width:100%;height:auto;margin:auto}pre{white-space:pre-wrap;overflow-wrap:anywhere}a{color:#5f348e}</style><h1>Polish &amp; Personality</h1><p>Capturas reais do Chromium local, com dados fictícios e rede externa bloqueada. Main é a base Git da PR, não uma confirmação do deploy oficial. Não há pontuação visual automática.</p><p>Preferência de cor escura solicitada ao navegador; o tema aplicado depende da página.</p>'+['main','pr'].map(n=>'<p><b>'+n+'</b> · '+esc(estados[n].sha)+' · saída '+esc(estados[n].codigo)+'</p><pre>'+esc(estados[n].resultado)+'</pre><a href="'+n+'/execucao.txt">Log</a>').join('')+arquivos.map(f=>'<section><h2>'+esc(f)+'</h2><div class="grid"><div><b>Main</b>'+imagem('main',f)+'</div><div><b>PR</b>'+imagem('pr',f)+'</div></div></section>').join('')+'</html>';
fs.writeFileSync(path.join(out,'index.html'),html);fs.writeFileSync(path.join(out,'manifesto.json'),JSON.stringify(estados,null,2));
console.log('Comparação: '+arquivos.length+' pares de nomes; consulte manifesto.json e index.html.');
const faltam=arquivos.filter(f=>!['main','pr'].every(n=>fs.existsSync(path.join(out,n,f))));
if(faltam.length)console.error('Pares incompletos: '+faltam.join(', '));
if(!arquivos.length||faltam.length||estados.main.codigo!==0||estados.pr.codigo!==0)process.exitCode=1;
