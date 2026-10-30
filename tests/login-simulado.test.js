// Cards da página inicial com login simulado.
// Os outros testes rodam sem conta, e foi justamente logado que os cards
// passaram a abrir o Meu Perfil (o script do cadeado lia window.contaJ, que
// não existia). Este teste roda o script do cadeado de verdade, com e sem conta.
// Run: node tests/login-simulado.test.js   (sem pacotes, sem rede, sem banco)
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert");

const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");

// 1. O que vai para o ar: interruptor de teste desligado e login visível de fora do IIFE.
assert(/window\.TW_JOGOS_SEM_LOGIN\s*=\s*false\s*;/.test(html),
  "TW_JOGOS_SEM_LOGIN precisa estar false antes do merge (senão Sora e Karaoke abrem sem conta)");
assert(html.includes("Object.defineProperty(window, 'contaJ'"),
  "o script principal precisa expor o login real em window.contaJ");

// 2. O script do cadeado, exatamente como está na página.
const m = html.match(/<script id="tw-index2-ux-fixes">([\s\S]*?)<\/script>/);
assert(m, "script tw-index2-ux-fixes não encontrado");
const codigo = m[1];

function montar(conta, semLogin) {
  const ouvintes = [];
  const perf = { cliques: 0, click() { this.cliques++; }, classList: { contains: c => c === "hubperf" }, dataset: { ir: "perfil" }, id: "" };
  const window = { TW_JOGOS_SEM_LOGIN: semLogin };
  Object.defineProperty(window, "contaJ", { get: () => conta });
  const document = {
    addEventListener(tipo, fn) { if (tipo === "click") ouvintes.push(fn); },
    querySelector(sel) { return sel.includes("hubperf") || sel.includes("hubPerf") ? perf : null; },
    querySelectorAll() { return []; },
    createElement() { return { setAttribute() {}, appendChild() {}, classList: { add() {} }, style: {} }; }
  };
  const sandbox = { window, document, setInterval() { return 0; }, setTimeout() { return 0; }, console };
  vm.runInNewContext(codigo, sandbox, { filename: "tw-index2-ux-fixes.js" });
  function clicar(ir, classe) {
    const card = { dataset: { ir }, id: "", classList: { contains: c => c === classe } };
    let parado = false;
    const e = {
      target: { closest: sel => (sel.includes(".hubcard") ? card : null) },
      stopImmediatePropagation() { parado = true; }, preventDefault() {}
    };
    ouvintes.forEach(fn => fn(e));
    return { foiProPerfil: perf.cliques > 0, parado };
  }
  return { clicar, perf };
}

const CARDS = [["pet", "hubpet"], ["gacha", "hubgacha"], ["duo", "hubduo"], ["sora", "tw-hubgame"], ["karaoke", "tw-hubgame"]];

// 3. Logada: nenhum card pode ser desviado para o perfil.
for (const [ir, classe] of CARDS) {
  const t = montar({ nick: "Teste", id: "00000000-0000-0000-0000-000000000000" }, false);
  const r = t.clicar(ir, classe);
  assert(!r.foiProPerfil && !r.parado, "logada, o card " + ir + " não pode abrir o perfil");
}

// 4. Sem conta: os cards com cadeado levam ao login; Center Run e Perfil ficam livres.
for (const [ir, classe] of CARDS) {
  const t = montar(null, false);
  const r = t.clicar(ir, classe);
  assert(r.foiProPerfil && r.parado, "sem conta, o card " + ir + " deve levar ao login");
}
for (const [ir, classe] of [["run", "hubrun"], ["perfil", "hubperf"]]) {
  const t = montar(null, false);
  const r = t.clicar(ir, classe);
  assert(!r.foiProPerfil, "o card " + ir + " é livre mesmo sem conta");
}

console.log("✓ login simulado: cards abrem o próprio jogo logada, e pedem login sem conta");
