'use strict';
// O logo e as imagens do mural do Pet saíram do index.html (eram base64) para a pasta img/, sem mudar os pixels.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!html.includes('data:image/webp;base64'),'index.html sem imagens base64');
const refs=[...html.matchAll(/'\.\/(img\/[a-z0-9-]+\.webp)'/g)].map(m=>m[1]);
for(const n of ['logo-tsl','mural-zipper','mural-brs48','mural-nebyura','mural-banner','mural-campo','mural-doces'])assert(refs.includes('img/'+n+'.webp'),n+' referenciada');
for(const r of refs){const b=fs.readFileSync(path.join(root,r));assert(b.slice(0,4).toString()==='RIFF'&&b.slice(8,12).toString()==='WEBP',r+' é WebP válido');}
console.log('✓ index.html: logo e mural do Pet em arquivos WebP ('+refs.length+')');
