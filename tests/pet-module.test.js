// Refatoração da PR #62, Etapa 1: o Backstage⭐Pet! saiu do index.html para pet.js e pet.css.
// Garante que a extração continua "mecânica":
//  1. pet.js só DECLARA funções e tabelas fixas (não executa nada ao carregar),
//     então carregar antes do script principal reproduz o hoisting de quando tudo morava no mesmo arquivo;
//  2. o index.html carrega pet.js antes do script principal e pet.css no lugar do antigo bloco do Pet;
//  3. nenhuma função existe nos dois lugares ao mesmo tempo (sem duplicar funcionalidade).
// Run: node tests/pet-module.test.js   (sem pacotes, sem rede)
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const pet = fs.readFileSync(path.join(root, "pet.js"), "utf8");
const css = fs.readFileSync(path.join(root, "pet.css"), "utf8");

// 1. Carregar pet.js num contexto que acusa qualquer acesso a nomes de fora.
const acessos = [];
const sandbox = new Proxy({}, {
  has: (t, k) => typeof k === "string" && !(k in t) ? (acessos.push(k), false) : k in t,
  get: (t, k) => t[k],
  set: (t, k, v) => { t[k] = v; return true; },
  defineProperty: (t, k, d) => Reflect.defineProperty(t, k, d)
});
const ctx = vm.createContext(sandbox);
vm.runInContext(pet, ctx, { filename: "pet.js" });
const fora = acessos.filter((k) => !["undefined", "NaN", "Infinity"].includes(k));
assert.deepEqual(fora, [], "pet.js não pode executar nada ao carregar (usou: " + fora.join(", ") + ")");
const declarados = Object.keys(sandbox);
assert(declarados.includes("petOpenUI") && declarados.includes("petPay") && declarados.includes("PET_FOOD"),
  "pet.js deve declarar as funções e tabelas do camarim");

// 2. Ordem de carregamento.
const iPet = html.indexOf('<script src="./pet.js?v=');
const iMain = html.indexOf("window.TW_JOGOS_SEM_LOGIN = false;");
assert(iPet > 0 && iMain > iPet, "pet.js carrega antes do script principal");
assert(html.indexOf('<script src="./pet-sync.js?v=') < iPet, "pet-sync.js continua antes (sincronização não foi duplicada)");
assert(/<link rel="stylesheet" href="\.\/pet\.css\?v=\d+">/.test(html), "index.html liga o pet.css");
assert(!/\.petacts\{|\.petmenu\{|#petCam\{/.test(html), "estilos do camarim não ficaram duplicados no index.html");
assert(/\.petacts\{/.test(css) && /#petCam\{/.test(css), "pet.css tem os estilos do camarim");

// 3. Nenhuma função declarada nos dois lugares.
const noIndex = new Set([...html.matchAll(/^function ([A-Za-z_$][\w$]*)\s*\(/gm)].map((m) => m[1]));
const duplicadas = declarados.filter((n) => noIndex.has(n));
assert.deepEqual(duplicadas, [], "funções do Pet duplicadas no index.html: " + duplicadas.join(", "));

console.log("✓ Backstage⭐Pet! em pet.js (" + declarados.length + " declarações, nada executa ao carregar) e pet.css");
