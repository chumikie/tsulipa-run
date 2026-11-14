// Gera as traduções divididas por idioma a partir de tw-i18n.js (a fonte continua sendo tw-i18n.js).
// Uso: node tools/i18n/dividir.js            → grava tw-i18n-base.js e i18n/{en,es,th,ja}.js
//      node tools/i18n/dividir.js --conferir → só confere se os arquivos gerados estão em dia (CI/testes)
// O site carrega a base (tabelas vazias, rows e locale) e só o idioma escolhido.
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
const RAIZ = path.join(__dirname, '..', '..');
const LINGUAS = ['en', 'es', 'th', 'ja'];
// Motor (vai junto na base): enquanto um idioma não chegou, as mesclagens feitas pelo site em DICT[l]
// ficam anotadas, na ordem; quando o idioma chega, o dicionário é montado de novo na MESMA ordem.
const MOTOR = `(function(w){
 var L=w.TW_I18N.idiomasSeparados,T=w.TW_I18N.tables,log={},alvos={},tabsAlvo={},pronto={},baixando={};
 L.forEach(function(l){
  log[l]=[];alvos[l]={};
  w.TW_DICT[l]=new Proxy(alvos[l],{set:function(o,k,v){o[k]=v;log[l].push([0,k,v]);return true;}});
  tabsAlvo[l]={};
  Object.keys(T).forEach(function(t){var alvo=tabsAlvo[l][t]={};T[t][l]=new Proxy(alvo,{ownKeys:function(){log[l].push([1,t]);return [];}});});
 });
 w.TW_I18N_CARREGAR=function(l,dict,tabs){
  var o=alvos[l];Object.keys(o).forEach(function(k){delete o[k];});
  Object.keys(dict).forEach(function(k){o[k]=dict[k];});
  // ajustes que o site fez direto numa tabela antes de o idioma chegar (ex.: PERF_DICT2.th['Tailândia']) continuam valendo
  Object.keys(T).forEach(function(t){T[t][l]=Object.assign({},tabs[t]||{},tabsAlvo[l][t]);});
  w.TW_DICT[l]=o;pronto[l]=true;
  log[l].forEach(function(e){if(e[0])Object.keys(T[e[1]][l]).forEach(function(k){o[k]=T[e[1]][l][k];});else o[e[1]]=e[2];});
  log[l]=[];
 };
 w.TW_I18N_PRONTO=function(l){return L.indexOf(l)<0||!!pronto[l];};
 w.TW_I18N_BAIXAR=function(l){
  if(w.TW_I18N_PRONTO(l))return Promise.resolve();
  if(baixando[l])return baixando[l];
  baixando[l]=new Promise(function(ok,erro){var s=document.createElement('script');s.src='./i18n/'+l+'.js?v=1';
   s.onload=function(){pronto[l]?ok():erro(new Error('idioma '+l));};s.onerror=function(){baixando[l]=null;erro(new Error('idioma '+l));};document.head.appendChild(s);});
  return baixando[l];
 };
})(window);
`;
function gerar(){
  const w = {}; const ctx = { window: w }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(RAIZ, 'tw-i18n.js'), 'utf8'), ctx, { filename: 'tw-i18n.js' });
  const tabelas = Object.keys(w.TW_I18N.tables);
  const vazias = {}; tabelas.forEach(function(t){ vazias[t] = {}; });
  const aviso = '// GERADO por tools/i18n/dividir.js a partir de tw-i18n.js — não editar à mão.\n';
  const saida = {};
  saida['tw-i18n-base.js'] = aviso +
    '// Base das traduções: o português é a chave; os outros idiomas chegam em i18n/<idioma>.js.\n' +
    'window.TW_DICT=window.TW_DICT||{};\n' +
    'window.TW_I18N=window.TW_I18N||{};\n' +
    'window.TW_I18N.tables=' + JSON.stringify(vazias) + ';\n' +
    'window.TW_I18N.rows=' + JSON.stringify(w.TW_I18N.rows) + ';\n' +
    'window.TW_I18N.locale=' + JSON.stringify(w.TW_I18N.locale) + ';\n' +
    'window.TW_I18N.idiomasSeparados=' + JSON.stringify(LINGUAS) + ';\n' + MOTOR;
  LINGUAS.forEach(function(l){
    const tabs = {}; tabelas.forEach(function(t){ if(w.TW_I18N.tables[t][l]) tabs[t] = w.TW_I18N.tables[t][l]; });
    saida[path.join('i18n', l + '.js')] = aviso + 'window.TW_I18N_CARREGAR(' + JSON.stringify(l) + ',' + JSON.stringify(w.TW_DICT[l]) + ',' + JSON.stringify(tabs) + ');\n';
  });
  return saida;
}
const saida = gerar();
if(process.argv.includes('--conferir')){
  const fora = Object.keys(saida).filter(function(f){ const p = path.join(RAIZ, f); return !fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== saida[f]; });
  if(fora.length){ console.error('Traduções divididas desatualizadas: ' + fora.join(', ') + '\nRode: node tools/i18n/dividir.js'); process.exit(1); }
  console.log('OK traduções divididas em dia');
} else {
  Object.keys(saida).forEach(function(f){ fs.writeFileSync(path.join(RAIZ, f), saida[f]); console.log('gravado', f, (Buffer.byteLength(saida[f]) / 1024).toFixed(0) + ' KB'); });
}
