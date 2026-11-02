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
  { js: "centerrun.js", css: "centerrun.css", tem: ["drawChar", "saveCu", "cenaCartazes"], cssTem: [/\.cust \{/, /\.oshi-sel \{/] },
  { js: "pet.js", css: "pet.css", tem: ["petOpenUI", "petPay", "PET_FOOD"], cssTem: [/\.petacts\{/, /#petCam\{/] },
  { js: "perfil.js", css: "perfil.css", tem: ["perfAbrir", "perfDesenharIdol", "PERF_VIS"], cssTem: [/\.perfp\{/, /\.perfov\{/] },
  { js: "gacha.js", css: "gacha.css", tem: ["gachaAbrir", "gachaCardDesenhar", "cardsHtml", "GACHA_SORTE"], cssTem: [/#gachaCv\{/, /\.cardmini\{/] },
  { js: "duo.js", css: "duo.css", tem: ["duoAbrir", "duoRender", "duoComprar"], cssTem: [/#duoCv\{/, /\.duotabs\{/] },
  { js: "encontro.js", css: "encontro.css", tem: ["encMostrar", "encCena", "ENC_EMO"], cssTem: [/#encCv\{/, /\.enchero\{/] },
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
