// Traduções divididas por idioma: os arquivos gerados acompanham tw-i18n.js e o site baixa só o idioma escolhido.
const assert=require('node:assert/strict');const fs=require('fs');const path=require('path');const {execFileSync}=require('child_process');
const raiz=path.join(__dirname,'..');
execFileSync(process.execPath,[path.join(raiz,'tools','i18n','dividir.js'),'--conferir'],{stdio:'pipe'});
const index=fs.readFileSync(path.join(raiz,'index.html'),'utf8');
assert.ok(index.includes('src="./tw-i18n-base.js'),'a página carrega a base');
assert.ok(!/<script src="\.\/tw-i18n\.js/.test(index),'a página não baixa mais o catálogo inteiro');
assert.ok(index.indexOf('tw-i18n-base.js')<index.indexOf('var DICT=window.TW_DICT'),'traduções antes do DICT');
assert.ok(index.includes("TW_I18N_BAIXAR(novo)"),'trocar de idioma baixa o arquivo do idioma');
const base=fs.readFileSync(path.join(raiz,'tw-i18n-base.js'),'utf8');
for(const l of ['en','es','th','ja']){
  const f=fs.readFileSync(path.join(raiz,'i18n',l+'.js'),'utf8');
  assert.ok(f.startsWith('// GERADO')&&f.includes('window.TW_I18N_CARREGAR("'+l+'"'),l);
  assert.ok(!base.includes(f.slice(f.indexOf(',{')+2,f.indexOf(',{')+60)),'a base não traz o dicionário '+l);
}
console.log('OK traduções divididas: base + 4 idiomas sob demanda, em dia com tw-i18n.js');
