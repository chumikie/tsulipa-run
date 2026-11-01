"use strict";
const fs = require("node:fs");
const assert = require("node:assert/strict");
const html = fs.readFileSync("index.html", "utf8");

const startAt = html.indexOf("function start(e){");
const gameStart = html.indexOf("contaInicioCorrida();", startAt);
const gateAt = html.indexOf("if(_supabase && !contaPronta", startAt);
assert(startAt >= 0 && gateAt > startAt && gateAt < gameStart,
  "Authenticated race must wait until the account has loaded");

const sessionAt = html.indexOf("function contaSessao(sess){");
const applyAt = html.indexOf("function contaAplicar(j){", sessionAt);
const sessionFn = html.slice(sessionAt, applyAt);
assert(sessionFn.includes("contaPronta = false;") &&
       sessionFn.includes("if(!sess){ contaPronta = true;"),
  "Session initialization must track loading and signed-out states");
assert(html.includes("function contaAplicar(j){\n  contaPronta = true;"),
  "Applying the cloud profile must release the start gate");

const finishAt = html.indexOf("function contaFimCorrida(");
const finishEnd = html.indexOf("function contaGasto(", finishAt);
const finish = html.slice(finishAt, finishEnd);
assert(finish.includes("contaRpc('jogador')") &&
       finish.includes("contaAplicar(j)"),
  "A lost response must reconcile from the official cloud profile");
assert(finish.includes("Esta corrida não foi registrada no servidor.") &&
       finish.includes("Pontuação não validada; saldo oficial atualizado."),
  "Missing or rejected races must not remain pending");
assert(!finish.slice(finish.indexOf(".catch(")).includes("contaRpc('terminar_corrida'"),
  "Recovery must not retry the finalization RPC and risk duplicate credit");

console.log("✓ Center Run account readiness and duplicate-safe star-credit recovery checks passed.");
