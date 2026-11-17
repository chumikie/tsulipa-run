// Código-fonte da página inicial para testes de texto: index.html + módulos extraídos dele
// (refatoração da PR #62). Assim os testes continuam achando funções que mudaram de arquivo.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const MODULOS = ["centerrun.js", "centerrun-corrida.js", "pet.js", "perfil.js", "gacha.js", "duo-base.js", "duo.js", "duo-tela.js", "duo-pedido.js", "encontro.js", "hub.js", "recordes.js", "conta.js", "admin.js", "centerrun.css", "pet.css", "perfil.css", "gacha.css", "duo.css", "encontro.css", "hub.css", "admin.css"];   // na ordem em que o index.html carrega
module.exports = function siteSource(){
  const root = path.join(__dirname, "..");
  return [fs.readFileSync(path.join(root, "index.html"), "utf8")]
    .concat(MODULOS.map((f) => { const D = require("./fonte-dividida.js"); return D.DIVIDIDOS[f] ? D(f, D.DIVIDIDOS[f]) : fs.readFileSync(path.join(root, f), "utf8"); })).join("\n");   // arquivos divididos remontados na ordem original
};
module.exports.MODULOS = MODULOS;
