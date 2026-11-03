'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Isola somente a composição das fotos: sem Supabase, navegador ou desenho real.
const jornal = fs.readFileSync(path.join(__dirname, '..', 'jornal.js'), 'utf8');
const ini = jornal.indexOf('var JORNAL_CENAS =');
const fim = jornal.indexOf('function jornalFotoDesenhar(');
assert.ok(ini > 0 && fim > ini, 'rotinas de foto devem existir');
const composicao = jornal.slice(ini, fim);

function gerar({ dia = 20761, quantidade = 20, karaoke = false, pet = false } = {}) {
  const box = { innerHTML: '', querySelector: () => null };
  const idols = Array.from({ length: quantidade }, (_, i) => ({
    nick: 'Idol' + String(i).padStart(2, '0'),
    avatar: { c: { hair: '#ff6fb5' } }
  }));
  const ctx = {
    Date: class FixedDate extends Date { static now(){ return dia * 86400000 + 10800000; } },
    $: id => id === 'jornalFotosDia' ? box : null,
    hubIdolsDados: { idols },
    jornalSemanaDados: { karaoke: karaoke ? [{ nick: 'Idol00' }, { nick: 'Idol01' }] : [] },
    KaraokeNewsPhoto: {cast: () => karaoke ? {concept:{name:'Ocean Pop',set:'ocean',colors:['#093543','#17657b','#9df5e2']},members:idols.slice(0,6).map(p=>({nick:p.nick,avatar:p.avatar}))} : null},
    jornalAvatar: nick => idols.find(p => p.nick === nick)?.avatar || null,
    KaraokeRoomViews: {
      VIEWS: ['gigoia', 'liberdade', 'tailandia', 'harajuku', 'praia'],
      NAMES: { gigoia: 'Gigoia', liberdade: 'Liberdade', tailandia: 'Tailândia', harajuku: 'Harajuku', praia: 'Praia' }
    },
    tr: str => str,
    escHtml: str => String(str),
    contaJ: pet ? { nick: 'Jogador' } : null,
    petAtivo: () => pet ? { nome: 'Bolt', acc: '' } : null,
    petData: { ativo: 'dog' },
    PET_SP: { dog: { n: 'Cão' } },
    perfAvAtual: () => ({ c: { hair: '#ff6fb5' } })
  };
  vm.createContext(ctx);
  vm.runInContext(composicao, ctx, { timeout: 1000 });
  vm.runInContext('jornalFotosDia()', ctx, { timeout: 1000 });
  return { fotos: Array.from(ctx.jornalFotosHoje), html: box.innerHTML };
}

test('a foto especial tem oito membros distintos, usa uma vista oficial e é estável por dia', () => {
  const a = gerar(), b = gerar(), especial = a.fotos.find(f => f.tipo === 'janela');
  assert.equal(a.fotos.length, 4); // 3 cenas tradicionais + 1 paisagem; sem Karaoke nem pet
  assert.ok(especial);
  assert.equal(especial.grupo.length, 8);
  assert.equal(new Set(especial.grupo.map(p => p.nick)).size, 8);
  assert.ok(['gigoia', 'liberdade', 'tailandia', 'harajuku', 'praia'].includes(especial.local));
  assert.equal(especial.local, b.fotos.find(f => f.tipo === 'janela').local);
  assert.deepEqual(Array.from(especial.grupo, p => p.nick), Array.from(b.fotos.find(f => f.tipo === 'janela').grupo, p => p.nick));
});

test('a cena adicional preserva o telão e a foto privada do jogador com pet', () => {
  const resultado = gerar({ karaoke: true, pet: true });
  assert.equal(resultado.fotos.length, 6);
  assert.equal(resultado.fotos.filter(f => f.tipo === 'telao').length, 1);
  assert.equal(resultado.fotos.filter(f => f.tipo === 'pet').length, 1);
  assert.equal((resultado.html.match(/data-jfoto=/g) || []).length, 6);
  assert.equal(resultado.fotos[2].tipo, 'janela', 'oito Idols fecham a primeira fileira');
  assert.equal(resultado.fotos[3].grupo.length, 3, 'foto de trio abre a segunda fileira');
  assert.equal(resultado.fotos[4].tipo, 'pet', 'pet fica entre trio e telão');
  assert.equal(resultado.fotos[5].tipo, 'telao', 'telão fecha a segunda fileira');
});

test('as cinco vistas oficiais aparecem uma vez por ciclo de cinco dias', () => {
  const locais = Array.from({ length: 5 }, (_, i) => gerar({ dia: 20760 + i }).fotos.find(f => f.tipo === 'janela').local);
  assert.equal(new Set(locais).size, 5);
});

test('sem oito membros a foto especial não duplica Idols', () => {
  const r = gerar({ quantidade: 7 });
  assert.equal(r.fotos.some(f => f.tipo === 'janela'), false);
  assert.equal(r.fotos.length, 3);
});

test('foto panorâmica mantém os cinco cenários visíveis, com câmera e Idols dimensionados', () => {
  const começo = jornal.indexOf('function jornalFotoDesenhar(');
  const fim = jornal.indexOf('function jornalFotoAmpliar(');
  assert.ok(começo >= 0 && fim > começo);
  const desenho = jornal.slice(começo, fim);
  for(const local of ['gigoia','liberdade','tailandia','harajuku','praia']){
    for(const [largura,altura] of [[480,300],[1440,900]]){
      const movimentos = [], escalas = [], cenas = [], idols = [];
      const pincel = new Proxy({translate:(a,b)=>movimentos.push([a,b]),scale:(a,b)=>escalas.push([a,b]),createLinearGradient:()=>({addColorStop(){}})},{
        get(obj,chave){ return chave in obj ? obj[chave] : ()=>{}; },
        set(obj,chave,valor){ obj[chave] = valor; return true; }
      });
      const atores = Array.from({length:8},(_,i)=>({avatar:{c:{hair:'#ff6fb5'}}}));
      const ambiente = vm.createContext({
        cv:{width:largura,height:altura,getContext:()=>pincel},
        foto:{tipo:'janela',local,noturna:false,grupo:atores,cena:['ceu','📸','foto',['v','banzai']]},
        KaraokeRoomViews:{drawScene:(ctx,x,y,w,h)=>cenas.push({x,y,w,h})},
        perfDesenharIdol:(ctx,w,h)=>idols.push({w,h}),
        perfFundo:()=>{}
      });
      vm.runInContext(jornal.slice(jornal.indexOf('function jornalFotoAtuacao('),jornal.indexOf('function jornalFotoDesenhar(')) + desenho + String.fromCharCode(10) + 'jornalFotoDesenhar(cv,foto,false);',ambiente,{timeout:1000});
      const deslocamento = local==='tailandia'?.55:.25;
      assert.equal(cenas.length,1,local+' usa a arte oficial');
      assert.equal(cenas[0].w,480,'a câmera virtual mantém o mesmo traço no download');
      assert.ok(Math.abs(cenas[0].h-300*(1+deslocamento))<.001);
      assert.ok(movimentos.some(([x,y])=>x===0&&Math.abs(y+300*deslocamento)<.001),'câmera valoriza a paisagem');
      assert.ok(escalas.some(([sx,sy])=>sx===largura/480&&sy===altura/300),'miniatura e download têm mesma proporção');
      assert.equal(idols.length,8,'nenhum Idol foi removido da cena');
      assert.ok(idols.every(p=>p.h<altura*.44&&p.h>altura*.37),'oito Idols abaixo dos monumentos');
    }
  }
});

test('telão escolhe o elenco do dia e não reaproveita o pódio semanal', () => {
  const fotos = gerar({ karaoke:true }).fotos;
  const palco = fotos.find(f => f.tipo === 'telao');
  assert.ok(palco);
  assert.equal(palco.grupo.length, 6);
  assert.equal(palco.clipe.set, 'ocean');
  assert.deepEqual(Array.from(palco.grupo, p => p.nick), ['Idol00','Idol01','Idol02','Idol03','Idol04','Idol05']);
});

test('paisagem dos oito tem piso próprio, bandeirinhas contínuas e telão com aro na frente', () => {
  const comeco = jornal.indexOf('function jornalFotoDesenhar(');
  const fim = jornal.indexOf('function jornalFotoAmpliar(');
  const desenho = jornal.slice(comeco, fim);
  assert.ok(desenho.includes("var pisos = { tailandia:"), 'piso funciona em todas as vistas');
  assert.ok(desenho.includes('x.moveTo(0,yFio(0))'), 'fio começa preso na borda esquerda');
  assert.ok(desenho.includes('W2,yFio(1)'), 'fio termina na borda direita');
  assert.ok(!desenho.includes('for(var lado = 0; lado < 2; lado++)'), 'não são dois fios curtos');
  const moldura = desenho.indexOf("if(f.tipo === 'telao'){   // aro");
  const cantores = desenho.indexOf("if(f.tipo === 'telao' && f.clipe){");
  const outros = desenho.indexOf('if(n) f.grupo.forEach');
  assert.ok(cantores >= 0 && moldura > outros, 'a moldura vai à frente dos Idols');
  assert.ok(desenho.includes('x.clip()'), 'recorte evita personagens fora do telão');
});

test('doze acontecimentos variados passam pelo jornal sem repetição no dia seguinte', () => {
  const temas = new Set();
  const ctx = { JORNAL_CENAS: null };
  vm.runInNewContext(composicao + '\nthis.acontecimentos = JORNAL_CENAS.map(c => c[2]);', ctx);
  assert.equal(ctx.acontecimentos.length, 12, 'catálogo ampliado sem retirar as seis cenas anteriores');
  assert.equal(new Set(ctx.acontecimentos).size, 12);
  let anterior = new Set();
  for(let dia=20760;dia<20784;dia++){
    const cenas = gerar({dia}).fotos.filter(f=>!f.tipo).map(f=>f.cena[2]);
    assert.equal(cenas.length,3);
    assert.equal(new Set(cenas).size,3,'três histórias diferentes no mesmo dia');
    for(const cena of cenas){
      assert.ok(!anterior.has(cena),'não repete a história de ontem: dia '+dia);
      temas.add(cena);
    }
    anterior=new Set(cenas);
  }
  assert.equal(temas.size,12,'todas as cenas aparecem no ciclo');
});

test('as seis histórias novas têm decoração própria e legendas em cinco idiomas', () => {
  const i18n={window:{}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'..','tw-i18n.js'),'utf8'),i18n);
  const catalog=JSON.parse(fs.readFileSync(path.join(__dirname,'..','translations/id/preview-catalog.json'),'utf8'));
  const idjs=fs.readFileSync(path.join(__dirname,'..','translations/id/preview-data.js'),'utf8');
  const novos=[
    ['figurinos','{n} preparando os figurinos no camarim'],
    ['aniversario','{n} comemorando um aniversário no café'],
    ['cartas','{n} lendo cartinhas dos fãs'],
    ['bastidores','{n} nos bastidores antes do show'],
    ['estudio','{n} gravando música no estúdio'],
    ['jardim','{n} num piquenique no jardim']
  ];
  for(const [tema,frase] of novos){
    assert.ok(jornal.includes("'"+tema+"'"),'decoração '+tema);
    for(const idioma of ['en','es','th','ja'])assert.ok(i18n.window.TW_DICT[idioma][frase],'tradução '+idioma+' de '+tema);
    assert.ok(catalog.central.dict[frase],'tradução ID de '+tema);
    assert.ok(idjs.includes(JSON.stringify(frase)),'dicionário carregado sob demanda '+tema);
  }
  assert.match(jornal,/jornalCenaDetalhes\(x, f\.cena\[4\], W2, H2\)/,'desenho acima do fundo, atrás dos personagens');
});

test('expressões e gestos reagem em duplas sem alterar a geometria das fotos', () => {
  const inicio=jornal.indexOf('function jornalFotoAtuacao('), fim=jornal.indexOf('function jornalFotoDesenhar(',inicio);
  assert.ok(inicio>0&&fim>inicio,'atuação fotográfica definida');
  const act=(foto,k,n)=>vm.runInNewContext(jornal.slice(inicio,fim)+'\njornalFotoAtuacao(foto,k,n)',{foto,k,n});
  const temas={
    aniversario:['banzai','coracao'],cartas:['coracao','v'],bastidores:['tchau','mic'],
    estudio:['mic','v'],jardim:['coracao','v']
  };
  for(const [tema,gestos] of Object.entries(temas)){
    const cena=['basico','🎞️','teste',['v','coracao','tchau','banzai'],tema];
    const foto={cena,grupo:[{},{},{},{}],dia:20760};
    const poses=Array.from({length:4},(_,k)=>act(foto,k,4));
    assert.equal(JSON.stringify(poses),JSON.stringify(Array.from({length:4},(_,k)=>act(foto,k,4))),'mesma data mantém thumbnail e download');
    assert.ok(poses.every(p=>['v','coracao','tchau','banzai','mic','luz','nyan',''].includes(p.pose)),'gestos são suportados');
    assert.ok(poses.every(p=>[0,2,3,4,6].includes(p.expr)),'expressões alegres e surpreendidas são suportadas');
    assert.ok(poses.every(p=>Math.abs(p.inclinar)<=.012),'variação não desloca enquadramento');
    if(tema!=='aniversario' && tema!=='estudio'){
      const dupla=(foto.dia+tema.length)%3;
      assert.equal(poses[dupla].pose,gestos[0]);
      assert.equal(poses[dupla+1].pose,gestos[1]);
    }
  }
  const aniversario={cena:['cafe','🎂','teste',['v','coracao'],'aniversario'],grupo:[{},{},{},{}],dia:20760};
  assert.equal(act(aniversario,0,4).expr,4,'aniversariante surpresa');
  assert.equal(act(aniversario,1,4).pose,'banzai','vizinha comemora junto');
  const repeticoes=Array.from({length:8},(_,dia)=>Array.from({length:4},(_,k)=>act({...aniversario,dia:20760+dia},k,4).expr).join(','));
  assert.ok(new Set(repeticoes).size>1,'expressões variam entre dias');
});

test('panorama e telão preservam dimensões, posições e cantores',()=>{
  const s=jornal.slice(jornal.indexOf('function jornalFotoDesenhar('),jornal.indexOf('function jornalFotoAmpliar('));
  assert.match(s,/var altura = H2 \* \.40 \* varia/,'altura da panorâmica mantida');
  assert.match(s,/var centro = slot8 \* \(k \+ \.5\)/,'oito posições da panorâmica mantidas');
  assert.match(s,/var largura = W2 \/ 6, altura = H2 \* \[ \.59,\.62,\.65,\.65,\.62,\.59 \]\[k\]/,'tamanhos dos cantores mantidos');
  assert.match(s,/av\.pose = \['mic','banzai','mic','luz','mic','banzai'\]\[k\]/,'microfones do telão preservados');
  assert.match(s,/jornalFotoAtuacao\(f, k, 8\)/,'a panorâmica recebe rostos variados');
});
