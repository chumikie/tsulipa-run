'use strict';
// Offline smoke test for static local page and stylesheet resources.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const pages=fs.readdirSync(root,{withFileTypes:true})
  .filter(entry=>entry.isFile()&&entry.name.endsWith('.html'))
  .map(entry=>entry.name);
const failures=[];
let checked=0;

function isExternal(reference){
  return !reference||/^(?:[a-z][a-z\d+.-]*:|\/\/|\/|#)/i.test(reference);
}

function checkReference(owner,reference){
  const value=reference.trim();
  if(isExternal(value)||/[<>{}]/.test(value))return;
  const pathname=decodeURIComponent(value.split(/[?#]/,1)[0]);
  if(!pathname)return;
  const target=path.resolve(root,path.dirname(owner),pathname);
  if(target!==root&&!target.startsWith(root+path.sep)){
    failures.push(owner+': local reference escapes repository: '+value);
    return;
  }
  checked++;
  if(!fs.existsSync(target))failures.push(owner+': missing local resource '+value);
}

for(const page of pages){
  const html=fs.readFileSync(path.join(root,page),'utf8')
    .replace(/<!--[\s\S]*?-->/g,'')
    .replace(/<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi,(script,attributes)=>
      /\bsrc\s*=/i.test(attributes)?'<script'+attributes+'></script>':'');
  for(const match of html.matchAll(/\b(?:src|href)\s*=\s*(["'])(.*?)\1/gi)){
    checkReference(page,match[2]);
  }
}

for(const entry of fs.readdirSync(root,{withFileTypes:true})){
  if(!entry.isFile()||!entry.name.endsWith('.css'))continue;
  const css=fs.readFileSync(path.join(root,entry.name),'utf8');
  for(const match of css.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gi)){
    checkReference(entry.name,match[2]);
  }
}

assert.deepEqual(failures,[],failures.join('\n'));
console.log('✓ Static resources:',checked,'local references checked across',pages.length,'pages');
