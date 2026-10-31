// A página de privacidade guarda as traduções em strings JS: um apóstrofo sem escape quebra EN/ES/TH/JA.
const fs=require('fs'),path=require('path'),assert=require('assert');
const html=fs.readFileSync(path.join(__dirname,'..','privacidade.html'),'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
assert.ok(scripts.length,'privacidade.html tem script');
scripts.forEach(function(s){ assert.doesNotThrow(function(){ new Function(s); },'script da privacidade precisa compilar'); });
console.log('✓ privacidade.html: script de idiomas compila');
