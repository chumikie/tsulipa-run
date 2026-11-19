'use strict';
// Jogabilidade dos jogos novos: tudo local e visual; nada de RPC novo nem mudança de prêmio.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ler = f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
const bloom = ler('bloom.js'), cafe = ler('cafe.js'), duplo = ler('cafe-duplo.js'), battle = ler('battle.js'), studio = ler('studio.js');
// Jardim: a planta cresce da altura de antes até a nova depois da rega (sem animação com movimento reduzido).
assert.match(bloom, /function crescer\(i\)\{ if\(window\.matchMedia && matchMedia\('\(prefers-reduced-motion: reduce\)'\)\.matches\) return;/);
assert.match(bloom, /planta\(x, cx, by - 16, regasNaTela\(i, c\), tm, 1\.22\)/);
// Café: a mesma barra de paciência (mesmo tempo), agora com cor, rostinho e rótulo acessível — nos dois modos.
assert.match(cafe, /function cfPacienciaUI\(bar, pc, emo\)/);
assert.match(cafe, /role="progressbar" aria-label="' \+\s*escHtml\(tr\('Paciência do cliente'\) \+ \(nome \?/);
assert.match(duplo, /cfPacienciaUI\(bar, pc, \$\('cfPacEmo' \+ e\.lado\)\)/);
// Battle: lightsticks no ritmo só no show e só como contador local.
const ini = battle.indexOf('function agitar(){'), fim = battle.indexOf('function ritmoDesenhar(');
assert.ok(ini > 0 && fim > ini);
assert.doesNotMatch(battle.slice(ini, fim), /contaRpc|localStorage|rodadas\[/, 'agitar não mexe no placar nem salva');
assert.match(battle, /texto\+=ritmoResultado\(\);/);
for (const l of ['pt', 'en', 'es', 'id', 'th', 'ja']) assert.match(battle, new RegExp('\\n? ?' + l + ":\\['📣"));
// Studio: tema da semana muda aos domingos e só marca selo no mural.
assert.match(studio, /function temaSemana\(\)\{ var sem = Math\.floor\(\(Date\.now\(\) - Date\.UTC\(2026, 10, 1, 3\)\) \/ 6048e5\);/);
assert.match(studio, /noTema\(m\.escolhas\) \? '<em class="stselo">/);
for (const f of [bloom, battle, studio]) assert.doesNotMatch(f, /contaRpc\('(jardim_crescer|battle_ritmo|studio_tema)/);
console.log('jogos novos: jogabilidade ok');

// Usa os cliques delegados e as respostas da partida, sem conexão real.
(async()=>{
  const vm=require('node:vm');
  const pedidos=[{base:0,cob:-1,enf:0,doce:-1},{base:1,cob:0,enf:1,doce:0}];
  const entregas=[];
  const corpo={innerHTML:'',querySelector:()=>null};
  let clique;
  const ctx={
    LANG:'pt',contaJ:{id:'cafe-teste'},contaSessaoToken:4,
    document:{addEventListener:(nome,handler)=>{clique=handler;}},
    localStorage:{getItem:()=>null,setItem(){}},$:()=>corpo,tr:x=>x,escHtml:String,sfx:null,
    CF_BASES:[['🍓','Morango'],['🍫','Chocolate']],
    hsSorteio:()=>()=>0,hsNomesLivres:()=>['Ana','Bia'],hsFa:(_,nome)=>({nome,c:{}}),hsVisitaPreparar(){},
    hsMemChave:()=> 'cafe-teste',cfVisitasMemorias:()=>[{nome:'Ana',pres:0,jeito:'fofo',c:{}}],
    HS_JEITOS:{fofo:{}},HS_PRESENTES:[['🎁','presente']],hsCafeConfirmar(){},
    contaRpc(nome,args){
      if(nome==='cafe_run_iniciar')return Promise.resolve({ok:true,run_id:'turno'});
      if(nome==='cafe_run_pedidos')return Promise.resolve({ok:true,criados:2,pedidos:pedidos.map((pedido,i)=>({pedido,sessao:String(i),limite_segundos:120}))});
      if(nome==='cafe_run_etapa2')return new Promise(resolve=>entregas.push({args,resolve}));
      if(nome==='missoes')return Promise.resolve([{k:'cafe',meta:2,prog:entregas.length}]);
      assert.fail(nome);
    }
  };
  ctx.window=ctx;
  vm.runInNewContext(cafe+'\n'+duplo,ctx);
  const disparar=(chave,i)=>clique({target:{closest:sel=>sel.includes('data-cfd-aceitar') === (chave==='aceitar') ? {dataset:{[chave]:String(i)}} : null},stopPropagation(){}});
  const tick=()=>new Promise(setImmediate);
  ctx.cfIniciarSeguro();
  assert.equal(ctx.cf.fase,'saudacao');
  assert.equal(ctx.cf.runId,null);
  assert.match(corpo.innerHTML,/Você lembrou do meu presente/);
  disparar('aceitar');
  await tick();
  assert.match(corpo.innerHTML,/Escolha um fã/);
  for(const [i,pedido] of pedidos.entries()){
    if(i===1)ctx.cf.fila[1].t0 = ctx.cfT - ctx.cf.fila[1].limite * .85;
    disparar('cfdCliente',i);
    assert.match(corpo.innerHTML,new RegExp('data-cfd-cliente="'+i+'" aria-pressed="true"'));
    for(const [tipo,valor] of Object.entries(pedido))if(valor>=0)ctx.cfEscolher(tipo,valor);
    disparar('cfdServir',i);
    assert.match(corpo.innerHTML,/Confirmando com o servidor/);
    assert.match(corpo.innerHTML,i===0?/Pedido certo!/:/Pedido certo, por pouco!/);
    assert.equal(entregas[i].args.p_sessao,String(i));
    assert.deepEqual({...entregas[i].args.p_monta},pedido);
    entregas[i].resolve({ok:true,confirmado:true,certo:true,pontos:100*(i+1),vidas:3,perfeitos:i+1,combo:i+1});
    await tick();
    assert.match(corpo.innerHTML,i===0?/1 de 2 pedidos confirmados/:/Missão do Café concluída/);
  }
  ctx.cfIniciarSeguro();
  disparar('aceitar');
  await tick();
  disparar('cfdCliente',1);
  ctx.cfEscolher('base',pedidos[1].base);
  ctx.cfEscolher('enf',pedidos[1].enf);
  ctx.cfEscolher('doce',pedidos[1].doce);
  disparar('cfdServir',1);
  assert.match(corpo.innerHTML,/Era Chantilly!/i);
})().catch(e=>{console.error(e);process.exitCode=1;});
