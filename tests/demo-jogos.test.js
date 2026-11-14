// Modo demonstração (demo.js): testar sem login nas prévias, nunca no site oficial.
// Run: node tests/demo-jogos.test.js   (sem pacotes, sem rede, sem banco)
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert");
const test = require("node:test");
const raiz = path.join(__dirname, "..");
const demo = fs.readFileSync(path.join(raiz, "demo.js"), "utf8");
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");

function carregar(hostname, search){
  const win = { addEventListener(){}, location:{ hostname, search } };
  win.window = win;
  vm.runInNewContext(demo, win);
  return !!win.TW_DEMO;
}

test("demo: liga só em prévia/local com ?demo=1 e nunca no site oficial", () => {
  assert.equal(carregar("tsulipa-world.vercel.app", "?demo=1"), false, "site oficial");
  assert.equal(carregar("tsulipa-world-git-visual-layout-hud-tsu-li-pa.vercel.app", "?demo=1"), true, "prévia da Vercel");
  assert.equal(carregar("tsulipa-world-git-visual-layout-hud-tsu-li-pa.vercel.app", ""), false, "sem ?demo=1");
  assert.equal(carregar("localhost", "?demo=1"), true);
  assert.equal(carregar("deploy-preview-88--tsulipa.netlify.app", "?demo=1"), true);
  assert.equal(carregar("outro-site.vercel.app", "?demo=1"), false, "outros projetos da Vercel");
  assert.equal(carregar("tsulipa-world.vercel.app.exemplo.com", "?demo=1"), false);
  assert.match(html, /!\/tsulipa-world\\\.vercel\\\.app\$\/\.test\(location\.hostname\)/, "o index.html nem carrega o demo.js no site oficial");
});

test("demo: cobre as chamadas dos jogos novos e mantém a faixa de aviso", () => {
  for(const rpc of ["jardim_estado","jardim_plantar","jardim_regar","jardim_colher","jardim_usar_flor",
    "battle_status","battle_jogar","battle_ranking","battle_torcida","battle_torcida_levar","battle_unit_salvar","battle_arena","battle_desafiar",
    "studio_pauta","studio_clique","studio_publicar","studio_mural","studio_curtir","studio_capa"])
    assert.ok(demo.includes("'" + rpc + "'"), "falta simular " + rpc);
  assert.match(demo, /Modo demonstração/);
  assert.match(demo, /feitas >= 5[\s\S]*erro:'limite'/, "limite de 5 partidas por dia");
  assert.match(demo, /hoje\.length >= 3[\s\S]*erro:'limite'/, "limite de 3 desafios por dia");
  assert.doesNotMatch(demo, /localStorage|sessionStorage|_supabase/, "nada é gravado nem enviado pelo modo demonstração");
});
