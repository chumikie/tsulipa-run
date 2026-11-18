'use strict';
// Vida no bairro (tw-bairro.js, 17/11/2026): bico de 3 níveis por rua, bagunça da semana, guia dos primeiros dias
// e falas do trio no Chat. Roda o módulo num navegador falso (sem DOM de verdade).
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const SRC = fs.readFileSync('tw-bairro.js', 'utf8');

function carregar(opts){
  opts = opts || {};
  const store = Object.assign({}, opts.store || {});
  const agora = opts.agora || Date.UTC(2026, 10, 17, 15);   // terça 17/11/2026, 12h em Brasília
  class FD extends Date { constructor(...a){ if(a.length) super(...a); else super(agora); } static now(){ return agora; } }
  const ouvintesHumor = [];
  const el = () => ({ appendChild(){}, addEventListener(){}, querySelector(){ return null; }, querySelectorAll(){ return []; }, setAttribute(){}, classList:{ toggle(){} }, remove(){}, style:{} });
  const sb = {
    Date:FD, Math, JSON, String, Object, Array, Number, parseInt, setInterval(){ return 0; }, clearInterval(){}, setTimeout(){ return 0; },
    localStorage:{ getItem:k => (k in store ? store[k] : null), setItem:(k, v) => { store[k] = String(v); } },
    document:{ head:el(), body:el(), getElementById(){ return null; }, createElement:el, addEventListener(){}, querySelectorAll(){ return []; } },
    LANG:opts.lang || 'pt',
    TW_HUMOR:{ ouvir:f => ouvintesHumor.push(f) }
  };
  if(opts.conta) sb.contaJ = { nick:opts.conta };
  if(opts.best != null) sb.best = opts.best;
  sb.window = sb;
  vm.runInNewContext(SRC, sb);
  return { B:sb.TW_BAIRRO, store, humor:(ev, fraco) => ouvintesHumor.forEach(f => f('humor', ev, fraco)), sb };
}

test('liga no Humor e conta só jogos (não "fraco")', () => {
  const { B, humor } = carregar({ conta:'Sami', best:500 });
  humor('cafe'); humor('cafe', true); humor('abriu');
  assert.equal(B.bico('harajuku').pts, 1, 'só o evento forte do Café conta');
  humor('run'); humor('karaoke');
  assert.equal(B.bico('palco').pts, 2);
  assert.equal(B.bico('palco').nivel, 1, '2 pontos = nível 1');
});

test('no máximo 4 pontos por rua por dia; níveis em 2, 6 e 15', () => {
  const { B } = carregar({ conta:'Sami', best:500 });
  for(let i = 0; i < 10; i++) B.contar('sora');
  const k = B.bico('ceu');
  assert.equal(k.pts, 4); assert.equal(k.hoje, 4); assert.equal(k.nivel, 1); assert.equal(k.falta, 2);
  assert.deepEqual(Array.from(B.NIVEIS), [2, 6, 15]);
  assert.equal(B.POR_DIA, 4);
});

test('nada do bairro mexe em estrelas: só a chave brs48cr_bairro_v1 muda', () => {
  const { B, store } = carregar({ conta:'Sami', best:500, store:{ brs48cr_stars:'60' } });
  for(let i = 0; i < 4; i++) B.contar('battle');
  assert.deepEqual(Object.keys(store).sort(), ['brs48cr_bairro_v1', 'brs48cr_stars']);
  assert.equal(store.brs48cr_stars, '60');
  assert.doesNotMatch(SRC, /contaRpc|supabase|stars\s*[+-]=/, 'sem servidor e sem moeda');
});

test('estado separado por conta (e visitante)', () => {
  const store = {};
  const a = carregar({ conta:'Sami', best:1, store }); a.B.contar('cafe');
  const b = carregar({ conta:'Lu', best:1, store:a.store });
  assert.equal(b.B.bico('harajuku').pts, 0, 'a outra conta começa do zero');
  const salvo = JSON.parse(a.store.brs48cr_bairro_v1);
  assert.ok(salvo['c:sami']);
});

test('bagunça da semana: roda as 6 ruas aos domingos e pede o gesto de outra rua', () => {
  const vistas = new Set();
  for(let w = 0; w < 6; w++){
    const { B } = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 18 + 7 * w, 15) });
    const b = B.bagunca();
    vistas.add(b.rua);
    assert.notEqual(b.rua, b.gesto, 'o gesto vem do bico de outra rua');
    assert.ok(b.quem && b.fez && b.fim);
  }
  assert.equal(vistas.size, 6);
  // troca no domingo 0h de Brasília (sábado 23h59 ainda é a semana anterior)
  const sab = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 22, 2, 59) }).B.bagunca();
  const dom = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 22, 3, 1) }).B.bagunca();
  assert.equal(sab.semana, '2026-11-15'); assert.equal(dom.semana, '2026-11-22');
});

test('resolver só com o gesto aprendido (2 partidas na rua do gesto, enquanto os bicos estão desligados)', () => {
  const { B, store } = carregar({ conta:'Sami', best:1 });
  const b = B.bagunca();
  assert.equal(B.resolver(), false, 'sem o gesto, não resolve');
  const s = JSON.parse(store.brs48cr_bairro_v1); s['c:sami'].pts[b.gesto] = 2; store.brs48cr_bairro_v1 = JSON.stringify(s);
  const c = carregar({ conta:'Sami', best:1, store });
  assert.equal(c.B.bagunca().sabe, true);
  assert.equal(c.B.resolver(), true);
  assert.equal(c.B.bagunca().ok, true);
  assert.equal(c.B.resolver(), false, 'uma vez por semana');
});

test('primeiros dias guiados: só conta nova; uma rua por dia; Pular mostra tudo', () => {
  const novo = carregar({ conta:'Nova' });
  const g1 = novo.B.guia();
  assert.equal(g1.ativo, true); assert.deepEqual(Array.from(g1.abertas), ['palco', 'praca']);
  assert.equal(novo.B.ruaAberta('arena'), false);
  // dia 3
  const d3 = carregar({ conta:'Nova', store:novo.store, agora:Date.UTC(2026, 10, 19, 15) }).B.guia();
  assert.deepEqual(Array.from(d3.abertas), ['palco', 'praca', 'harajuku', 'fofo']);
  // dia 6: acabou
  assert.equal(carregar({ conta:'Nova', store:novo.store, agora:Date.UTC(2026, 10, 22, 15) }).B.guia().ativo, false);
  // quem já tem recorde nunca vê o guia
  assert.equal(carregar({ conta:'Veterana', best:1200 }).B.guia().ativo, false);
  novo.B.pularGuia();
  assert.equal(novo.B.guia().ativo, false);
  assert.equal(novo.B.ruaAberta('arena'), true);
});

test('o Mapa pergunta antes (nunca tranca) e o celular recebe as falas do trio', () => {
  const mapa = fs.readFileSync('tw-mapa.js', 'utf8');
  assert.match(mapa, /function entrarRua\(destino,forcar\)/);
  assert.match(mapa, /window\.TW_BAIRRO\.guiaPergunta\(destino,function\(\)\{entrarRua\(destino,true\);\}\)/);
  assert.match(mapa, /window\.twMapaBicho=function/);
  const pet = fs.readFileSync('pet-sala.js', 'utf8');
  assert.match(pet, /window\.TW_BAIRRO\.falas\(c\.id\)/);
  assert.match(pet, /window\.TW_BAIRRO\.lida\(id\)/);
  const { B } = carregar({ conta:'Sami', best:1 });
  ['idol:tsu', 'idol:lirika', 'idol:pati'].forEach(id => assert.equal(B.falas(id).length, 1));
  assert.equal(B.novas(), 3);
  B.lida('idol:tsu');
  assert.equal(B.novas(), 2);
  assert.equal(B.falas('fan:Mimi').length, 0, 'fãs não recebem fala do bairro');
});

test('textos nos 6 idiomas e concordância em português', () => {
  const STR = "(?:'(?:[^'\\\\]|\\\\.)*'|\"(?:[^\"\\\\]|\\\\.)*\")";
  const blocos = SRC.match(new RegExp('\\{pt:' + STR + '(?:,\\s*[a-z]{2}:' + STR + ')*\\s*\\}', 'g')) || [];
  assert.ok(blocos.length > 60);
  blocos.forEach(b => {
    if(/^\{pt:'Star (Stage|Arena)'\}$/.test(b)) return;   // nome próprio igual em todos
    ['en:', 'es:', 'id:', 'th:', 'ja:'].forEach(l => assert.ok(b.indexOf(l) >= 0, 'falta ' + l + ' em ' + b.slice(0, 60)));
  });
  const { B } = carregar({ conta:'Sami', best:1, agora:Date.UTC(2026, 10, 18, 15) });   // semana da Praça → gesto do Jardim das Nuvens
  assert.match(B.falas('idol:tsu')[0], /Aprenda jogando .*\(Jardim das Nuvens\)/, 'sem bicos: o gesto se aprende jogando os jogos da rua');
  assert.doesNotMatch(B.falas('idol:tsu')[0], /bico/i);
  const en = carregar({ conta:'Sami', best:1, lang:'en', agora:Date.UTC(2026, 10, 18, 15) }).B;
  assert.match(en.falas('idol:tsu')[0], /Learn it by playing .*\(Cloud Garden\)/);
});

test('bicos desligados (17/11): nada de bico na tela, no resumo do Início nem nas falas', () => {
  const { B } = carregar({ conta:'Sami', best:1 });
  assert.equal(B.resumo().bico, '', 'o Início não mostra a linha do bico');
  const src = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'tw-bairro.js'), 'utf8');
  assert.match(src, /var BICOS = false;/);
  assert.match(src, /if\(subiu && BICOS\) toast/);
});

test('tela do bairro em tw-bairro-tela.js: baixa só quando precisa; núcleo conta desde a abertura (17/11)', () => {
  const { B, sb, humor } = carregar({ conta:'Sami', best:500 });
  const scripts = [];
  sb.document.createElement = tag => { const e = { tag, appendChild(){}, addEventListener(){}, setAttribute(){}, classList:{ toggle(){} }, style:{}, remove(){} }; return e; };
  sb.document.head.appendChild = e => { scripts.push(e.src); };
  humor('cafe');
  assert.equal(B.bico('harajuku').pts, 1, 'conta sem a tela carregada');
  assert.equal(scripts.length, 0, 'abrir o site não baixa a tela');
  assert.equal(B.guiaPergunta('palco', () => {}), false, 'rua aberta: não pergunta (resposta na hora, como antes)');
  assert.equal(scripts.length, 0);
  const aberta = B.guia().abertas, fechada = B.ORDEM.find(r => aberta.indexOf(r) < 0);
  if(fechada){ assert.equal(B.guiaPergunta(fechada, () => {}), true, 'rua apagada: pergunta (e baixa a tela)'); assert.equal(scripts.length, 1); }
  B.abrir(); B.abrir();
  assert(scripts.length <= 1 && /tw-bairro-tela\.js\?v=\d+/.test(scripts[0] || (B.preparar(), scripts[0])), 'um pedido só do arquivo da tela');
  // a tela se apresenta e os pedidos que esperavam rodam
  const feito = [];
  B._tela({ abrir:() => feito.push('abrir'), fechar(){}, toast:m => feito.push('toast'), guiaPergunta:() => feito.push('perg'), guiaMarcar:() => feito.push('marcar') });
  assert(feito.filter(x => x === 'abrir').length === 2, 'os dois toques em abrir rodam quando a tela chega');
  B.guiaMarcar(); assert.equal(feito[feito.length - 1], 'marcar', 'com a tela pronta, chama direto');
  { const v = carregar({ conta:'Sami', best:500 }), pedidos = [];
    v.sb.document.head.appendChild = e => pedidos.push(e.src);
    if(!v.B.guia().ativo){ v.B.guiaMarcar(); assert.equal(pedidos.length, 0, 'conta fora dos dias guiados: o Mapa montando não baixa a tela'); } }
  // o arquivo da tela lê só o que o núcleo entrega
  const TELA = fs.readFileSync('tw-bairro-tela.js', 'utf8');
  assert(TELA.includes('B._tela({abrir:abrir, fechar:fechar, toast:toast, guiaPergunta:guiaPergunta, guiaMarcar:guiaMarcar});') && !SRC.includes('function desenharCena(') && TELA.includes('function desenharCena('), 'tela num lugar só');
  for(const k of ['resolver','pularGuia','ler','bico','bagunca','guia','ruaAberta','t','esc']) assert.equal(typeof B._k[k], 'function', '_k.' + k);
});

test('desfecho da bagunça para o Idol⭐News! (capítulo de domingo, 18/11)', () => {
  // antes de 22/11 não há semana encerrada (a bagunça estreou na semana de 15/11)
  assert.equal(carregar({ conta:'Sami', best:500, agora:Date.UTC(2026, 10, 18, 15) }).B.desfecho(), null);
  // domingo 22/11: conta a semana de 15/11 (Praça, Passarinho), com o gesto do Jardim das Nuvens; é "novo" no domingo
  const { B } = carregar({ conta:'Sami', best:500, agora:Date.UTC(2026, 10, 22, 15) });
  const d = B.desfecho();
  assert.equal(d.semana, '2026-11-15'); assert.equal(d.rua, 'praca'); assert.equal(d.bicho, 'passaro'); assert.equal(d.gesto, 'ceu');
  assert.equal(d.ok, false, 'ninguém resolveu: os vizinhos'); assert.equal(d.novo, true); assert.equal(d.membro, 0);
  assert(d.quem && d.fez && d.fim && d.ruaNome && d.gestoNome && d.gestoEmoji, 'textos prontos');
  // na terça seguinte continua sendo o mesmo desfecho, sem o selo de novo; a prévia mostra a semana corrente
  const ter = carregar({ conta:'Sami', best:500, agora:Date.UTC(2026, 10, 24, 15) }).B;
  assert.equal(ter.desfecho().semana, '2026-11-15'); assert.equal(ter.desfecho().novo, false);
  assert.equal(ter.desfecho('atual').semana, '2026-11-22'); assert.equal(ter.desfecho('atual').membro, 1, 'o trio reveza a cada semana');
  // bagunca() continua igual (com sabe/domingo) e baguncaDe() é a mesma rotação
  assert.deepEqual(Object.keys(ter.bagunca()).sort(), ['bicho','dia','domingo','fez','fim','gesto','ok','quem','rua','sabe','semana']);
  assert.equal(ter.baguncaDe('2026-11-15').rua, 'praca');
});

test('Idol⭐News! mostra o desfecho no topo dos capítulos, nos 6 idiomas', () => {
  const J = fs.readFileSync('jornal-capitulos.js', 'utf8');
  assert(J.includes('  try{ jnBagUI(box); }catch(e){}   // desfecho da bagunça: entra no topo da caixa\n  jnT1LeitorUI(box);\n}') && J.includes('box.insertBefore(sec, box.firstChild);'), 'jornalCapsUI chama o desfecho, no topo');
  assert(J.includes("if(cv.closest('.jnbag')){") && J.includes("jnBagDesenhar(hi,+cv.getAttribute('data-jnbag'));"), 'toque amplia o quadro redesenhado');
  const ini = J.indexOf('var JN_BAG_TX = {'), fim = J.indexOf('\n};', ini), bloco = J.slice(ini, fim);
  const chaves = bloco.match(/^\s{2}\w+:\{/gm).length;
  for(const l of ['pt','en','es','id','th','ja']) assert.equal((bloco.match(new RegExp('[{,]' + l + ':', 'g')) || []).length, chaves, 'JN_BAG_TX completo em ' + l);
  assert(/bagunca_previa=1\(&\|\$\)/.test(SRC) && SRC.includes("if(qual !== 'atual' && previaDesfecho()) qual = 'atual';"), 'prévia pela URL, decidida no núcleo');
  assert(fs.readFileSync('jornal.js', 'utf8').match(/jornal-capitulos\.js\?v=(\d+)/)[1] >= 13, 'versão do arquivo sob demanda subiu');
});

test('caderninho do bairro: selo por bicho, não expira e dá título ao completar (18/11)', () => {
  const dom = Date.UTC(2026, 10, 22, 15);   // domingo 22/11
  // sem nada resolvido: 6 bichos, nenhum selo
  const { B } = carregar({ conta:'Sami', best:500, agora:dom });
  const c0 = B.caderno();
  assert.equal(c0.itens.length, 6); assert.equal(c0.feitos, 0); assert.equal(c0.completo, false);
  assert.equal(c0.itens.map(i => i.rua).join(','), 'palco,harajuku,fofo,praca,arena,ceu');
  assert(c0.itens.every(i => i.bicho && i.quem && i.ruaNome && !i.ok), 'cada rua tem bicho e nome, nenhum marcado');
  // resolver a bagunça da semana marca o bicho daquela rua
  const chave = 'brs48cr_bairro_v1';
  const comGesto = carregar({ conta:'Sami', best:500, agora:dom,
    store:{ [chave]:JSON.stringify({ 'c:sami':{ v:1, pts:{ palco:20 }, dia:{}, visto:{}, bag:{}, lidas:{}, guia:{ ini:'2026-10-01', novo:false, pulou:true } } }) } });
  assert.equal(comGesto.B.bagunca().rua, 'arena');
  assert.equal(comGesto.B.bagunca().sabe, true, 'gesto do Star Stage aprendido');
  assert.equal(comGesto.B.resolver(), true);
  const c1 = comGesto.B.caderno();
  assert.equal(c1.feitos, 1); assert.equal(c1.itens.find(i => i.rua === 'arena').ok, true, 'o Gatinho da Arena virou amigo');
  assert.equal(c1.itens.find(i => i.rua === 'arena').dia, '2026-11-22');
  // o selo não some quando a semana sai de est.bag (só as 8 últimas ficam guardadas)
  const salvo = JSON.parse(comGesto.store[chave])['c:sami'];
  assert.equal(salvo.bichos.arena, '2026-11-22', 'guardado fora de est.bag');
  const depois = carregar({ conta:'Sami', best:500, agora:Date.UTC(2027, 1, 7, 15),
    store:{ [chave]:JSON.stringify({ 'c:sami':Object.assign({}, salvo, { bag:{} }) }) } });
  assert.equal(depois.B.caderno().feitos, 1, 'o caderninho não expira com as semanas');
  // quem resolveu antes do caderninho existir não perde o selo (migração a partir de est.bag)
  const antigo = carregar({ conta:'Sami', best:500, agora:dom,
    store:{ [chave]:JSON.stringify({ 'c:sami':{ v:1, pts:{}, dia:{}, visto:{}, lidas:{}, guia:{ ini:'2026-10-01', novo:false, pulou:true },
      bag:{ '2026-11-15':{ ok:true, dia:'2026-11-18' }, '2026-11-08':{ ok:true, dia:'2026-11-09' } } } }) } });
  const ca = antigo.B.caderno();
  assert.equal(ca.feitos, 2); assert.equal(ca.itens.find(i => i.rua === 'praca').dia, '2026-11-18');
  // completando os 6, vem o título
  const tudo = {}; ['palco','harajuku','fofo','praca','arena','ceu'].forEach(r => { tudo[r] = '2026-11-01'; });
  const full = carregar({ conta:'Sami', best:500, agora:dom,
    store:{ [chave]:JSON.stringify({ 'c:sami':{ v:1, pts:{}, dia:{}, visto:{}, bag:{}, lidas:{}, bichos:tudo, bichosOk:1, guia:{ ini:'2026-10-01', novo:false, pulou:true } } }) } });
  const cf = full.B.caderno();
  assert.equal(cf.feitos, 6); assert.equal(cf.completo, true); assert(cf.titulo && cf.titulo.length > 2, 'título do bairro');
});

test('o bicho da semana manda recado no Chat e o desfecho marca visto (18/11)', () => {
  const dom = Date.UTC(2026, 10, 22, 15);
  const { B, store } = carregar({ conta:'Sami', best:500, agora:dom });
  const d = B.desfecho();
  const falasMembro = B.falas(['idol:tsu','idol:lirika','idol:pati'][d.membro]);
  assert(falasMembro[0].indexOf(d.quem) === 0, 'o recado do bicho abre a conversa do membro da semana');
  assert(falasMembro[0].indexOf(d.fim) > 0, 'conta como terminou');
  const outro = B.falas(['idol:tsu','idol:lirika','idol:pati'][(d.membro + 1) % 3]);
  assert(outro.every(f => f.indexOf(d.quem) !== 0), 'os outros membros não repetem o recado');
  assert.equal(B.novaDe(['idol:tsu','idol:lirika','idol:pati'][d.membro]), true, 'badge de recado novo no Chat');
  // quem resolveu recebe um obrigado, não um pedido de desculpas
  const chave = 'brs48cr_bairro_v1';
  const meu = carregar({ conta:'Sami', best:500, agora:dom,
    store:{ [chave]:JSON.stringify({ 'c:sami':{ v:1, pts:{}, dia:{}, visto:{}, lidas:{}, bag:{ '2026-11-15':{ ok:true, dia:'2026-11-17' } }, guia:{ ini:'2026-10-01', novo:false, pulou:true } } }) } });
  const dm = meu.B.desfecho();
  assert.equal(dm.ok, true);
  assert.notEqual(meu.B.falas(['idol:tsu','idol:lirika','idol:pati'][dm.membro])[0], falasMembro[0], 'recado diferente de quem não resolveu');
  // visto: some do "Hoje" depois de ver no Idol⭐News!
  assert.equal(B.desfecho().visto, false);
  assert.equal(B.desfechoVisto(), true); assert.equal(B.desfecho().visto, true);
  assert.equal(B.desfechoVisto(), false, 'não grava de novo');
  assert.equal(JSON.parse(store[chave])['c:sami'].visto.desf, '2026-11-15');
});

test('o desfecho aparece no Hoje, no painel do bairro e dá foto em Momentos⭐ (18/11)', () => {
  const cel = fs.readFileSync('tw-celular.js', 'utf8'), tela = fs.readFileSync('tw-bairro-tela.js', 'utf8');
  const jn = fs.readFileSync('jornal-capitulos.js', 'utf8'), pet = fs.readFileSync('pet.js', 'utf8');
  // 1. linha no "Hoje" do Início, logo depois do capítulo de domingo
  assert(cel.includes("if(B4 && typeof B4.desfecho === 'function')") && cel.includes("data-a=\"news\""), 'linha do desfecho no Hoje');
  // ordem revista em 18/11: o que acaba hoje (desejo, missões, aniversários) antes do que fica a semana (capítulo, desfecho, bagunça)
  const ordem = ['// 1. desejo do dia', '// 2. missões do dia', '// 3. aniversários do dia', '// 4. leitura da semana', '// 5. desfecho da bagunça', '// 6. Vida no bairro'].map(m => cel.indexOf(m));
  assert(ordem.every(i => i > 0) && ordem.every((v, i) => !i || v > ordem[i - 1]), 'ordem do Hoje: acaba hoje primeiro, leitura da semana depois');
  for(const k of ['desf', 'desfSub']){
    const i = cel.indexOf('\n    ' + k + ':{'), bloco = cel.slice(i, cel.indexOf('},', i));
    assert(i > 0, k + ' existe');
    for(const l of ['pt','en','es','id','th','ja']) assert(new RegExp('[{,]' + l + ':').test(bloco), k + ' em ' + l);
  }
  // 2. botão no painel, que fecha o painel antes de abrir o Idol⭐News!
  assert(tela.includes("else if(a === 'news'){ fechar(); if(typeof window.jornalAbrir === 'function') window.jornalAbrir('vida'); }"), 'botão abre o News');
  assert(tela.includes("data-twb=\"news\"") && tela.includes("t('verFim')"), 'botão "Ver como terminou"');
  assert(tela.includes("B.caderno()") && tela.includes('twb-cads'), 'caderninho no painel');
  // 3. foto do último quadro em Momentos⭐ (só com conta e pet, como o Camarim e o Moon⭐Duo!)
  assert(jn.includes("petPhoneMomentoGuardar('bairro', png)") && jn.includes('hi.width = 960'), 'guarda o quadro em 960×640');
  assert(jn.includes('function jnBagPodeGuardar()') && jn.includes('jnBagPodeGuardar() ?'), 'botão só quando dá para guardar');
  assert(pet.includes("['pet','center','duo','look','studio','bairro'].indexOf(tipo)"), 'Momentos⭐ aceita a foto do bairro');
  // 4. movimento leve, parado com "reduzir movimento" e fora da tela
  assert(jn.includes("matchMedia('(prefers-reduced-motion: reduce)').matches") && jn.includes('jnBagRelogio') && jn.includes('M.isVisible(sec)'), 'animação leve e respeitosa');
  assert(!/var jnBagT\s*=/.test(jn), 'o relógio não pode se chamar jnBagT (é a função de texto)');
  // 5. ver o desfecho no News marca como visto (mas não na prévia)
  assert(jn.includes("if(!d.previa && window.TW_BAIRRO && typeof TW_BAIRRO.desfechoVisto === 'function')"), 'marca visto fora da prévia');
});

test('"Hoje": nada usa variável antes de existir (a data e o "Também hoje") — 18/11', () => {
  const cel = fs.readFileSync('tw-celular.js', 'utf8');
  const ini = cel.indexOf('function hojeHtml(){'), corpo = cel.slice(ini, cel.indexOf('\n  function ', ini + 10));
  // a data de hoje é calculada antes dos aniversários, que a usam (quebrou ao reordenar o Hoje)
  assert(corpo.indexOf("var hj = C ? C.hoje() : '';") < corpo.indexOf('C.marcas(hj)'), 'hj existe antes dos aniversários');
  assert(corpo.indexOf("var hj =") === corpo.lastIndexOf("var hj ="), 'uma declaração só de hj');
  // o "Também hoje" é montado antes de entrar na lista (antes vinha depois: a lista saía "undefined" com tudo cumprido)
  assert(corpo.indexOf('var al = pendencias(), extra =') < corpo.indexOf('var todos = extra ?'), 'extra pronto antes de ser usado');
  assert(corpo.indexOf('var al = pendencias(), extra =') < corpo.indexOf('lista = hojeAberto ? todos.join(\'\') : extra;'), 'extra pronto antes da lista recolhida');
});

test('entrar na conta depois de jogar não zera o bairro (18/11)', () => {
  const chave = 'brs48cr_bairro_v1';
  const visitante = { v:1, pts:{ palco:5, praca:2 }, dia:{}, visto:{}, lidas:{}, bichos:{ arena:'2026-11-10' }, bichosOk:1,
    bag:{ '2026-11-08':{ ok:true, dia:'2026-11-09' } }, guia:{ ini:'2026-10-01', novo:false, pulou:true } };
  // jogou sem conta (ou enquanto a conta ainda carregava) e depois entrou: o progresso vem junto
  const a = carregar({ conta:'Sami', best:500, store:{ [chave]:JSON.stringify({ visitante }) } });
  assert.equal(a.B.bico('palco').pts, 5, 'pontos do bico vieram');
  assert.equal(a.B.caderno().feitos, 1, 'caderninho veio');
  const salvo = JSON.parse(a.store[chave]);
  assert(!salvo.visitante, 'o balde de visitante some, para não repassar duas vezes');
  assert.equal(salvo['c:sami'].pts.palco, 5);
  // conta que já tem progresso não é sobrescrita
  const b = carregar({ conta:'Sami', best:500, store:{ [chave]:JSON.stringify({ visitante, 'c:sami':{ v:1, pts:{ ceu:9 }, dia:{}, visto:{}, bag:{}, lidas:{}, bichos:{}, bichosOk:1, guia:{ ini:'2026-10-01', novo:false, pulou:true } } }) } });
  assert.equal(b.B.bico('ceu').pts, 9); assert.equal(b.B.bico('palco').pts, 0, 'não mistura com o visitante');
  assert(JSON.parse(b.store[chave]).visitante, 'o visitante continua lá para quem jogar deslogado');
  // visitante vazio não apaga nada nem dispara a troca
  const c = carregar({ conta:'Sami', best:500, store:{ [chave]:JSON.stringify({ visitante:{ v:1, pts:{}, dia:{}, visto:{}, bag:{}, lidas:{}, bichos:{}, guia:{ ini:'2026-11-01', novo:true, pulou:false } } }) } });
  assert.equal(c.B.bico('palco').pts, 0);
  assert(JSON.parse(c.store[chave]).visitante, 'visitante sem progresso fica onde está');
});
