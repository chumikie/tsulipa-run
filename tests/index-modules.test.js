// Refatoração da PR #62: módulos extraídos do index.html (Etapa 1: pet; Etapa 2: perfil; Etapa 3: gacha; Etapa 4: duo; Etapa 5: encontro; Etapa 7: hub; Etapa 8: centerrun).
// Garante que a extração continua "mecânica":
//  1. pet.js só DECLARA funções e tabelas fixas (não executa nada ao carregar),
//     então carregar antes do script principal reproduz o hoisting de quando tudo morava no mesmo arquivo;
//  2. o index.html carrega pet.js antes do script principal e pet.css no lugar do antigo bloco do Pet;
//  3. nenhuma função existe nos dois lugares ao mesmo tempo (sem duplicar funcionalidade).
// Run: node tests/index-modules.test.js   (sem pacotes, sem rede)
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const noIndex = new Set([...html.matchAll(/^function ([A-Za-z_$][\w$]*)\s*\(/gm)].map((m) => m[1]));
const iMain = html.indexOf("window.TW_JOGOS_SEM_LOGIN = false;");
const MODULOS = [
  { js: "centerrun.js", css: "centerrun.css", tem: ["drawChar", "saveCu", "twCorridaCarregar", "twCorridaAoCarregar"], cssTem: [/\.cust \{/, /\.oshi-sel \{/] },
  { js: "pet.js", css: "pet.css", tem: ["petSalaCarregar", "petDrawCustom", "PET_FOOD"], cssTem: [/\.petacts\{/, /#petCam\{/] },
  { js: "perfil.js", css: "perfil.css", tem: ["perfAbrir", "perfDesenharIdol", "PERF_VIS"], cssTem: [/\.perfp\{/, /\.perfov\{/] },
  { js: "gacha.js", css: "gacha.css", tem: ["gachaAbrir", "gachaCardDesenhar", "cardsHtml", "GACHA_SORTE"], cssTem: [/#gachaCv\{/, /\.cardmini\{/] },
  { js: "duo-base.js", css: "duo.css", tem: ["duoAbrir", "duoFechar", "lojaItem", "perfLoja2UI", "DUO_FALAS", "duoFundoDesenhar"], cssTem: [/#duoCv\{/, /\.duotabs\{/] },
  { js: "encontro-base.js", css: "encontro.css", tem: ["encMostrar", "encAbrirNovo", "encBtnUI", "encHoje", "encLer"], cssTem: [/#encCv\{/, /\.enchero\{/] },
  { js: "hub.js", css: "hub.css", tem: ["hubMostrar", "hubCardsUI", "twRankRender"], cssTem: [/\.hubidols\{/, /\.hubcfg\{/] },
  { js: "conta.js", css: null, tem: ["contaEntrar", "contaUI"], cssTem: [] }
];
let anterior = html.indexOf('<script src="./pet-sync.js?v=');
const vistos = new Set();
for (const m of MODULOS) {
  const src = fs.readFileSync(path.join(root, m.js), "utf8");
  const css = m.css ? fs.readFileSync(path.join(root, m.css), "utf8") : "";
  // 1. Carregar o módulo num contexto que acusa qualquer acesso a nomes de fora.
  const acessos = [];
  const sandbox = new Proxy({}, {
    has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t,
    get: (t, k) => t[k],
    set: (t, k, v) => { t[k] = v; return true; },
    defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d)
  });
  vm.runInContext(src, vm.createContext(sandbox), { filename: m.js });
  const fora = acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k));
  assert.deepEqual(fora, [], m.js + " não pode executar nada ao carregar (usou: " + fora.join(", ") + ")");
  const declarados = Object.keys(sandbox);
  m.tem.forEach((n) => assert(declarados.includes(n), m.js + " deve declarar " + n));
  // 2. Ordem: depois do anterior e antes do script principal.
  const i = html.indexOf('<script src="./' + m.js + '?v=');
  assert(i > anterior && iMain > i, m.js + " carrega na ordem certa, antes do script principal");
  anterior = i;
  if (m.css) assert(new RegExp('<link rel="stylesheet" href="\\./' + m.css.replace(".", "\\.") + '\\?v=\\d+">').test(html), "index.html liga o " + m.css);
  m.cssTem.forEach((re) => { assert(re.test(css), m.css + " tem " + re); assert(!re.test(html), "estilo " + re + " duplicado no index.html"); });
  // 3. Nenhuma função declarada em dois lugares.
  const dup = declarados.filter((n) => noIndex.has(n) || vistos.has(n));
  assert.deepEqual(dup, [], "declarações duplicadas de " + m.js + ": " + dup.join(", "));
  declarados.forEach((n) => vistos.add(n));
  console.log("✓ " + m.js + " (" + declarados.length + " declarações, nada executa ao carregar)" + (m.css ? " e " + m.css : ""));
}
assert(html.indexOf('<script src="./pet-sync.js?v=') < html.indexOf('<script src="./pet.js?v='), "pet-sync.js continua antes (sincronização não foi duplicada)");
// Corrida sob demanda (15/11/2026): centerrun-corrida.js só declara, não repete nada e não carrega na abertura.
{
  const src = fs.readFileSync(path.join(root, "centerrun-corrida.js"), "utf8");
  const acessos = [], sandbox = new Proxy({}, {
    has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t,
    get: (t, k) => t[k], set: (t, k, v) => { t[k] = v; return true; }, defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d)
  });
  vm.runInContext(src, vm.createContext(sandbox), { filename: "centerrun-corrida.js" });
  assert.deepEqual(acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k)), [], "centerrun-corrida.js não executa nada ao carregar");
  const decl = Object.keys(sandbox);
  ["loop", "draw", "update", "spawn", "jump", "end", "makeCard", "cenaCartazes"].forEach((n) => assert(decl.includes(n), "centerrun-corrida.js deve declarar " + n));
  const dup = decl.filter((n) => noIndex.has(n) || vistos.has(n));
  assert.deepEqual(dup, [], "declarações duplicadas da corrida: " + dup.join(", "));
  assert(!/<script src="\.\/centerrun-corrida\.js/.test(html), "a corrida não carrega na abertura");
  const cr = fs.readFileSync(path.join(root, "centerrun.js"), "utf8");
  assert(/TW_CORRIDA_ARQ='\.\/centerrun-corrida\.js\?v=\d+'/.test(cr), "centerrun.js aponta a versão da corrida");
  console.log("✓ centerrun-corrida.js (" + decl.length + " declarações, sob demanda)");
}
// Sala do pet sob demanda (15/11/2026): pet-sala.js só declara, não repete nada e não carrega na abertura.
{
  const src = fs.readFileSync(path.join(root, "pet-sala.js"), "utf8");
  const acessos = [], sandbox = new Proxy({}, {
    has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t,
    get: (t, k) => t[k], set: (t, k, v) => { t[k] = v; return true; }, defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d)
  });
  vm.runInContext(src, vm.createContext(sandbox), { filename: "pet-sala.js" });
  assert.deepEqual(acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k)), [], "pet-sala.js não executa nada ao carregar");
  const decl = Object.keys(sandbox);
  ["petOpenUI", "petPay", "petPhoneAbrir", "petLifeAbrir", "petAdopt", "petClose"].forEach((n) => assert(decl.includes(n), "pet-sala.js deve declarar " + n));
  const dup = decl.filter((n) => noIndex.has(n) || vistos.has(n));
  assert.deepEqual(dup, [], "declarações duplicadas da sala do pet: " + dup.join(", "));
  assert(!/<script src="\.\/pet-sala\.js/.test(html), "a sala do pet não carrega na abertura");
  const base = fs.readFileSync(path.join(root, "pet.js"), "utf8");
  assert(/PET_SALA_ARQ='\.\/pet-sala\.js\?v=\d+'/.test(base), "pet.js aponta a versão da sala");
  decl.forEach((n) => assert(base.includes("\n//→" + n), "pet.js marca o lugar de " + n));
  console.log("✓ pet-sala.js (" + decl.length + " declarações, sob demanda)");
}
// Tela do Perfil sob demanda (15/11/2026): perfil-tela.js só declara, não repete nada e não carrega na abertura.
{
  const src = fs.readFileSync(path.join(root, "perfil-tela.js"), "utf8");
  const acessos = [], sandbox = new Proxy({}, {
    has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t,
    get: (t, k) => t[k], set: (t, k, v) => { t[k] = v; return true; }, defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d)
  });
  vm.runInContext(src, vm.createContext(sandbox), { filename: "perfil-tela.js" });
  assert.deepEqual(acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k)), [], "perfil-tela.js não executa nada ao carregar");
  const decl = Object.keys(sandbox);
  ["perfMontar", "perfAbaMostrar", "perfGenUI"].forEach((n) => assert(decl.includes(n), "perfil-tela.js deve declarar " + n));
  const dup = decl.filter((n) => noIndex.has(n) || vistos.has(n));
  assert.deepEqual(dup, [], "declarações duplicadas da tela do Perfil: " + dup.join(", "));
  assert(!/<script src="\.\/perfil-tela\.js/.test(html), "a tela do Perfil não carrega na abertura");
  const base = fs.readFileSync(path.join(root, "perfil.js"), "utf8");
  assert(/PERF_TELA_ARQ='\.\/perfil-tela\.js\?v=\d+'/.test(base) && /perfTelaCarregar\(\)\]\)/.test(base), "perfAbrir espera a tela chegar junto com os dados");
  decl.forEach((n) => assert(base.includes("\n//→" + n), "perfil.js marca o lugar de " + n));
  console.log("✓ perfil-tela.js (" + decl.length + " declarações, sob demanda)");
}
// Moon⭐Duo! sob demanda (17/11/2026): duo.js, duo-tela.js e duo-pedido.js baixam quando o Duo abre (duo-base.js chama).
{
  const base = fs.readFileSync(path.join(root, "duo-base.js"), "utf8"), jogo = fs.readFileSync(path.join(root, "duo.js"), "utf8");
  for (const f of ["duo.js", "duo-tela.js", "duo-pedido.js"]) assert(!html.includes('<script src="./' + f + '?v='), f + " não carrega na abertura");
  assert(/arqs = \['\.\/duo\.js\?v=\d+', '\.\/duo-tela\.js\?v=\d+', '\.\/duo-pedido\.js\?v=\d+'\]/.test(base), "duo-base.js baixa os três, nessa ordem");
  const acessos = [];
  const sandbox = new Proxy({}, { has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t, get: (t, k) => t[k], set: (t, k, v) => { t[k] = v; return true; }, defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d) });
  vm.runInContext(jogo, vm.createContext(sandbox), { filename: "duo.js" });
  assert.deepEqual(acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k)), [], "duo.js só declara");
  const substitutos = ["duoAbrir", "duoFechar", "duoLoop"];   // duo-base.js tem substitutos que o duo.js troca ao chegar
  const dup = Object.keys(sandbox).filter((n) => !substitutos.includes(n) && (noIndex.has(n) || vistos.has(n) || new RegExp("^(?:function " + n.replace(/\$/g, "\\$") + "\\b|var " + n.replace(/\$/g, "\\$") + "\\b)", "m").test(base)));
  assert.deepEqual(dup, [], "duo.js não repete nada: " + dup.join(", "));
  assert(base.includes("if(window.duoFechar !== embrulho){ duoFecharJogo = window.duoFechar; window.duoFechar = embrulho; }"), "o embrulho do duoFechar (música) sobrevive à chegada do duo.js");
  console.log("✓ Moon⭐Duo! sob demanda: duo.js (" + Object.keys(sandbox).length + " declarações), duo-tela.js e duo-pedido.js");
}
// Moderação só para admin (17/11/2026): admin-base.js na abertura; admin.js baixa quando o Perfil confirma a conta admin.
{
  const base = fs.readFileSync(path.join(root, "admin-base.js"), "utf8"), adm = fs.readFileSync(path.join(root, "admin.js"), "utf8"), perfil = fs.readFileSync(path.join(root, "perfil.js"), "utf8");
  assert(html.includes('<script src="./admin-base.js?v=') && !html.includes('<script src="./admin.js?v='), "admin.js fora da abertura");
  for (const n of ["perfAdmin", "contaAdmin", "admLivre", "admLivreBtn", "admItens", "hubIdolsDados", "ADM_LIVRE_KEY", "admIdol"]) assert(new RegExp("^(?:var|function) " + n + "\\b", "m").test(base) && !new RegExp("^(?:var|function) " + n + "\\b", "m").test(adm), n + " só no admin-base.js");
  assert(/s\.src = '\.\/admin\.js\?v=\d+'/.test(base) && perfil.includes("perfAdmin = !!d.admin; if(perfAdmin && typeof admCarregar === 'function') admCarregar();"), "admin.js baixa quando a conta é admin");
  for (const n of ["admPainel", "admExtra", "admContasUI", "admIdolPrev", "admIdolPng", "admRoupaPng", "admVisualRoupa", "admAcao", "admBarraHtml", "admOpts", "admIdolFormHtml", "admCamarimOpts"]) assert(base.includes(n) && new RegExp("^function " + n + "\\(", "m").test(adm), n + ": substituto na base e o de verdade no admin.js");
  assert(/^var hubIdolsDados = null, hubIdolsEm = 0;/m.test(base), "hubIdolsEm junto");
  console.log("✓ Moderação sob demanda: admin-base.js na abertura, admin.js só para admin");
}
// Encontro do dia sob demanda (17/11/2026): encontro.js (a cena) baixa quando o Encontro abre.
{
  const base = fs.readFileSync(path.join(root, "encontro-base.js"), "utf8"), cena = fs.readFileSync(path.join(root, "encontro.js"), "utf8");
  assert(!html.includes('<script src="./encontro.js?v=') && /s\.src = '\.\/encontro\.js\?v=\d+'/.test(base), "encontro.js fora da abertura, pedido pelo encontro-base.js");
  const acessos = [];
  const sandbox = new Proxy({}, { has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t, get: (t, k) => t[k], set: (t, k, v) => { t[k] = v; return true; }, defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d) });
  vm.runInContext(cena, vm.createContext(sandbox), { filename: "encontro.js" });
  assert.deepEqual(acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k)), [], "encontro.js só declara");
  const dup = Object.keys(sandbox).filter((n) => !["encMostrar", "encAbrirNovo", "encLoop"].includes(n) && (noIndex.has(n) || vistos.has(n)));
  assert.deepEqual(dup, [], "encontro.js não repete nada: " + dup.join(", "));
  for (const n of ["encMostrar", "encAbrirNovo", "encLoop"]) assert(new RegExp("^function " + n + "\\(", "m").test(base) && new RegExp("^function " + n + "\\(", "m").test(cena), n + ": substituto na base e o de verdade no encontro.js");
  console.log("✓ Encontro do dia sob demanda: encontro.js (" + Object.keys(sandbox).length + " declarações)");
}
