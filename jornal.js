/* TsuLiPa⭐World — Idol⭐News! (o jornal semanal do site; só leitura do que já existe).
   Também é aqui que ficam as Novidades e o Top Idols da semana (pódios), que saíram do fim da página inicial.
   Pódios da semana (tw_podio_semana), Idols da vitrine (vitrine_idols), música e vista da semana,
   banner do dia e atendente da Zipper⭐Shop!. A semana vai de domingo 0h a sábado (Brasília).
   Este arquivo só declara funções e tabelas. */
var JORNAL_NOVIDADES = [
  ['🛍️', 'Zipper⭐Shop!: a lojinha agora tem casa própria em Harajuku, com Tsu, Lirika ou Pati no balcão.'],
  ['🎭', 'Banner da página inicial com rodízio: um dia o TsuLiPa, nos outros dois, trios de Idols do site.'],
  ['📰', 'Chegou o Idol⭐News!: os destaques da semana, as fotos do dia, o Top Idols e as novidades num lugar só.'],
  ['🎮', 'No Center⭐Run!, o personagem Idol agora aparece com o seu nome.']
];
function jornalData(iso, mais){ var d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + (mais || 0)); return ('0' + d.getUTCDate()).slice(-2) + '/' + ('0' + (d.getUTCMonth() + 1)).slice(-2); }
function jornalAvatar(nick){
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols : [];
  var p = L.find(function(i){ return i && i.nick === nick; }); return p && p.avatar ? p.avatar : null;
}
function jornalNum(n){ return (+n || 0).toLocaleString('pt-BR'); }
function jornalPodio(tit, lista, un){
  lista = Array.isArray(lista) ? lista.slice(0, 5) : [];
  return '<section class="jnpodio"><h4>' + tit + '</h4>' + (lista.length ? '<ol>' + lista.map(function(p, i){
    return '<li><span class="jnmed">' + (['🥇', '🥈', '🥉'][i] || '<b class="jnpos">' + (i + 1) + 'º</b>') + '</span><canvas class="jnfoto" width="64" height="64" data-jnick="' + escHtml(p.nick) + '" aria-hidden="true"></canvas><b>' + escHtml(p.nick) + '</b><small>' + jornalNum(p.score) + ' ' + un + '</small></li>';
  }).join('') + '</ol>' : '<p class="jnvazio">' + escHtml(tr('Ninguém ainda. Seja a primeira pessoa!')) + '</p>') + '</section>';
}
var jornalSemanaDados = {};
function jornalMontar(d){
  d = d || {}; jornalSemanaDados = d;
  var sem = typeof d.semana === 'string' ? d.semana : '', c1 = (d.center || [])[0], cast = typeof bannerElenco === 'function' ? bannerElenco() : null;
  var at = typeof shopAtendente === 'function' ? shopAtendente() : null, mus = typeof hubMusicaSemana === 'function' ? hubMusicaSemana() : null;
  var noBanner = cast && cast.length ? cast.map(function(p){return p.nick;}) : ['Tsu','Lirika','Pati'];
  var elencoBanner = noBanner.length > 1 ? tr('{a} e {b}').replace('{a}',noBanner.slice(0,-1).join(', ')).replace('{b}',noBanner[noBanner.length-1]) : (noBanner[0] || '');
  var vista = ''; try{ vista = tr(KaraokeRoomViews.NAMES[KaraokeRoomViews.viewFor(Date.now())]); }catch(e){}
  var total = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && +hubIdolsDados.total || 0;
  var combo = (d.karaoke_combo || [])[0], prec = (d.karaoke_acertos || [])[0];
  var h = '<header class="jntopo"><b class="jnnome" translate="no">📰 Idol<span class="tw-modal-star">⭐</span>News!</b><small lang="ja">アイドル・ニュース</small>' +
    '<p>' + (sem ? escHtml(tr('Semana de {a} a {b}').replace('{a}', jornalData(sem)).replace('{b}', jornalData(sem, 6))) + ' · ' : '') + escHtml(tr('placar parcial até domingo 0h')) + '</p></header>';
  if(c1) h += '<article class="jnmanchete"><button type="button" class="jnfotolink" data-jnperfil="' + escHtml(c1.nick) + '" aria-label="' + escHtml(tr('Ver perfil') + ': ' + c1.nick) + '"><canvas class="jnfoto jngrande" width="128" height="128" data-jnick="' + escHtml(c1.nick) + '" aria-hidden="true"></canvas></button><div><small>' + escHtml(tr('Manchete')) + '</small>' +
    '<h3><button type="button" class="jnnick jnnickg" data-jnperfil="' + escHtml(c1.nick) + '">' + escHtml(c1.nick) + '</button> ' + escHtml(tr('lidera o')) + ' <span translate="no">Center⭐Run!</span></h3><p>' + jornalNum(c1.score) + ' ' + escHtml(tr('pontos na melhor corrida da semana.')) + '</p></div></article>';
  if(typeof eventoAtual === 'function'){ var ev = eventoAtual();   // evento da semana (muda toda segunda)
    h += '<section class="jnbloco jnevento"><h4>' + ev.emo + ' ' + escHtml(tr(ev.nome)) + '</h4><ul>' +
      '<li>🧋 Happy⭐Cafe!: ' + escHtml(tr('pedidos de {b} valem +50!').replace('{b}', CF_BASES[ev.base][0] + ' ' + tr(CF_BASES[ev.base][1]))) + '</li>' +
      '<li>🤝 Handshake⭐Event!: ' + escHtml(tr('o presente {p} vale +50!').replace('{p}', ev.pres)) + '</li>' +
      '<li>🗓️ ' + escHtml(tr('Um tema novo toda segunda-feira.')) + '</li></ul></section>'; }
  h += '<section class="jnbloco jndiario"><h4>📖 ' + escHtml(tr('Diário de uma Idol')) + '</h4><p class="jndiariodica">' + escHtml(tr('Uma micro-história fictícia, inspirada em uma das fotos de hoje.')) + '</p><div id="jornalDiarioDia"></div></section>';
  h += jornalFeitosHtml(d);
  h += '<section class="jnbloco"><h4>📸 ' + escHtml(tr('Fotos do dia')) + '</h4><div class="jnfotos" id="jornalFotosDia"></div></section>';
  h += '<h4 class="jntopt">🏆 Top Idols ' + escHtml(tr('da semana')) + '</h4><div class="jnpodios">' + jornalPodio('🏁 <span translate="no">Center⭐Run!</span>', d.center, tr('pts')) + jornalPodio('☁️ <span translate="no">Sora⭐Jump!</span>', d.sora, 'm') + jornalPodio('🎤 <span translate="no">Karaoke⭐Time!</span>', d.karaoke, tr('pts')) + '</div>';
  if(combo || prec) h += '<section class="jnbloco"><h4>🌟 ' + escHtml(tr('Destaques do Karaoke')) + '</h4><ul>' +
    (combo ? '<li>' + escHtml(tr('Maior combo')) + ': <b>' + escHtml(combo.nick) + '</b> (' + jornalNum(combo.score) + ')</li>' : '') +
    (prec ? '<li>' + escHtml(tr('Melhor precisão')) + ': <b>' + escHtml(prec.nick) + '</b> (' + String(prec.score).replace('.', ',') + '%)</li>' : '') + '</ul></section>';
  h += '<section class="jnbloco"><h4>🏙️ ' + escHtml(tr('Na cidade')) + '</h4><ul>' +
    '<li>' + escHtml(tr('No banner de hoje')) + ': <b>' + escHtml(elencoBanner) + '</b></li>' +
    (at ? '<li>' + escHtml(tr('No balcão da Zipper⭐Shop!')) + ': <b>' + escHtml(at[0]) + '</b></li>' : '') +
    (mus ? '<li>' + escHtml(tr('Música da semana')) + ': <b translate="no">' + escHtml(mus[1]) + '</b></li>' : '') +
    (vista ? '<li>' + escHtml(tr('Vista da janela do Karaoke')) + ': <b>' + escHtml(vista) + '</b></li>' : '') +
    (total ? '<li>' + escHtml(tr('Idols na vitrine')) + ': <b>' + total + '</b></li>' : '') + '</ul></section>';
  if(mus) h += '<section class="jnbloco jnmusica"><h4>🎵 ' + escHtml(tr('Música da semana')) + '</h4><p><b translate="no">' + escHtml(mus[1]) + '</b>' + (vista ? ' · ' + escHtml(tr('Vista da janela do Karaoke')) + ': ' + escHtml(vista) : '') + '</p>' +
    '<div class="btns"><button type="button" class="btn" id="jnMusicaIr">🎤 ' + escHtml(tr('Cantar no Karaoke⭐Time!')) + '</button></div></section>';
  h += jornalTimesHtml() + jornalFestHtml() + jornalTrioHtml();
  h += jornalPostsHtml();
  return h;
}
function jornalFotos(){
  [].forEach.call(document.querySelectorAll('#jornalCorpo canvas[data-jnick]'), function(cv){
    var av = jornalAvatar(cv.dataset.jnick); if(!av) return;
    try{ perfFotoRedonda(cv, av, true); }catch(e){}
  });
}
// Fotos do dia: 3 ceninhas com 3 ou 4 Idols da vitrine, sorteadas pela data (todos veem as mesmas)
var JORNAL_CENAS = [   // [fundo, emoji, legenda, poses]
  ['palco', '🎤', '{n} ensaiando a coreografia nova no palco', ['mic', 'banzai', 'luz', 'v']],
  ['cafe', '☕', '{n} num lanchinho no café depois do show', ['coracao', 'v', 'tchau', '']],
  ['ceu', '☁️', '{n} pulando de nuvem em nuvem', ['banzai', 'v', 'nyan', 'tchau']],
  ['noite', '🌙', '{n} no ensaio da noite', ['luz', 'mic', 'coracao', 'v']],
  ['basico', '🌸', '{n} tirando foto de grupo', ['v', 'coracao', 'nyan', 'tchau']],
  ['oshi', '💖', '{n} com lightsticks para o Oshi', ['luz', 'luz', 'coracao', 'banzai']],
  ['basico', '🎀', '{n} preparando os figurinos no camarim', ['tchau', 'coracao', 'v', 'nyan'], 'figurinos'],
  ['cafe', '🎂', '{n} comemorando um aniversário no café', ['coracao', 'banzai', 'v', 'tchau'], 'aniversario'],
  ['oshi', '💌', '{n} lendo cartinhas dos fãs', ['coracao', 'v', 'nyan', 'tchau'], 'cartas'],
  ['palco', '🎬', '{n} nos bastidores antes do show', ['mic', 'v', 'tchau', 'coracao'], 'bastidores'],
  ['noite', '🎧', '{n} gravando música no estúdio', ['mic', 'mic', 'v', 'coracao'], 'estudio'],
  ['basico', '🌷', '{n} num piquenique no jardim', ['nyan', 'v', 'coracao', 'tchau'], 'jardim']
];
function jornalSorteio(L, s){ var a = L.slice(); s = (s * 2654435761) >>> 0 || 7; for(var i = a.length - 1; i > 0; i--){ s = (s * 1103515245 + 12345) >>> 0; var k = s % (i + 1), t = a[i]; a[i] = a[k]; a[k] = t; } return a; }
// A seleção pública varia por blocos de quatro dias: as 12 cenas aparecem antes de repetir.
// A passagem entre blocos também evita repetir a mesma situação de ontem.
function jornalCenasDoDia(dia){
  var bloco = Math.floor(dia / 4), parte = ((dia % 4) + 4) % 4;
  var cenas = jornalSorteio(JORNAL_CENAS, bloco + 7);
  var ultimas = jornalSorteio(JORNAL_CENAS, bloco - 1 + 7).slice(-3);
  // Troca só com o miolo, preservando as três últimas fotos de cada bloco.
  for(var i = 0; i < 3; i++){
    if(ultimas.indexOf(cenas[i]) < 0) continue;
    for(var j = 3; j < cenas.length - 3; j++){
      if(ultimas.indexOf(cenas[j]) < 0){
        var tmp = cenas[i]; cenas[i] = cenas[j]; cenas[j] = tmp;
        break;
      }
    }
  }
  return cenas.slice(parte * 3, parte * 3 + 3);
}
// Pequena crônica fictícia do mundo do jogo, derivada das mesmas cenas e elencos
// que o visitante vê acima. Não descreve atividades reais dos integrantes.
// Roteiros de três atos. Cada história segue a dupla da PRIMEIRA foto pública,
// sem atribuir o segundo ensaio/foto do dia a integrantes que não aparecem nela.
var JORNAL_DIARIO_ARCOS = {
  palco:[
    '{a} convidou {b} para ensaiar uma coreografia nova no palco.',
    ['Um passo saiu diferente, e a dupla começou a rir antes de tentar outra vez.', 'A música parou no meio, mas {b} marcou o ritmo para {a} continuar.'],
    'No fim, a dupla acertou os passos e guardou o ensaio nas fotos do Idol⭐News!'
  ],
  cafe:[
    '{a} encontrou {b} para um lanchinho no Happy⭐Cafe!',
    ['A dupla ficou indecisa diante dos doces e resolveu dividir a escolha.', '{b} contou uma história divertida enquanto {a} escolhia o pedido.'],
    'Entre conversas e risadas, o encontro virou uma foto para lembrar.'
  ],
  ceu:[
    '{a} chamou {b} para uma aventura pelas nuvens do TsuLiPa.',
    ['Uma nuvem parecia longe demais, então a dupla inventou um salto em conjunto.', '{b} encontrou um caminho de nuvens e mostrou o próximo pulo a {a}.'],
    'A dupla chegou ao outro lado e comemorou com uma pose para o Idol⭐News!'
  ],
  noite:[
    '{a} e {b} ficaram para um ensaio especial quando as luzes da cidade acenderam.',
    ['Uma nota difícil pediu mais uma tentativa, e a dupla não desistiu.', '{b} marcou a entrada da música para ajudar {a} a encontrar o tempo.'],
    'A última passagem saiu bonita, encerrando o ensaio com uma foto noturna.'
  ],
  basico:[
    '{a} chamou {b} para inventar poses de uma nova foto de grupo.',
    ['Cada pose ficou mais engraçada que a anterior até encontrarem a favorita.', '{b} sugeriu uma pose inesperada, e {a} resolveu acompanhar.'],
    'A escolha final entrou na coleção de fotos do Idol⭐News!'
  ],
  oshi:[
    '{a} encontrou {b} com lightsticks preparados para torcer pelo Oshi.',
    ['A dupla ensaiou uma sequência de luzes para animar a plateia.', '{b} inventou um movimento com a luz, e {a} respondeu com outro.'],
    'As cores iluminaram o encontro, que terminou numa fotografia especial.'
  ],
  figurinos:[
    '{a} convidou {b} para escolher detalhes dos figurinos no camarim.',
    ['Um laço combinava com tudo, mas faltava decidir onde colocá-lo.', '{b} encontrou um detalhe brilhante e mostrou a ideia para {a}.'],
    'A dupla terminou os ajustes e registrou os looks no Idol⭐News!'
  ],
  aniversario:[
    '{a} e {b} se encontraram para uma pequena comemoração no café.',
    ['Na hora da surpresa, quase esqueceram as velinhas do bolo!', '{b} escondeu o docinho até {a} terminar a contagem.'],
    'A surpresa terminou em sorrisos e numa foto de aniversário.'
  ],
  cartas:[
    '{a} chamou {b} para abrir as cartinhas recebidas dos fãs.',
    ['Uma mensagem carinhosa fez a dupla parar para agradecer.', '{b} encontrou um desenho entre as cartas e mostrou a {a}.'],
    'A dupla guardou as mensagens e tirou uma foto para o Idol⭐News!'
  ],
  bastidores:[
    '{a} encontrou {b} nos bastidores antes da apresentação.',
    ['Faltava revisar um gesto da coreografia, então a dupla ensaiou baixinho.', '{b} percebeu um detalhe no figurino de {a} e ajudou a arrumar.'],
    'Quando chegou a hora do show, a dupla estava pronta e registrou o momento.'
  ],
  estudio:[
    '{a} se reuniu com {b} para uma gravação no estúdio.',
    ['Na primeira tentativa, a dupla riu de uma entrada fora do tempo.', '{b} sugeriu experimentar outra maneira de cantar o refrão.'],
    'Depois de encontrar a versão favorita, a dupla celebrou com uma foto.'
  ],
  jardim:[
    '{a} chamou {b} para um piquenique tranquilo no jardim.',
    ['Uma brisa levou o guardanapo para longe, e a dupla saiu atrás dele.', '{b} preparou um lugar à sombra enquanto {a} organizava o lanchinho.'],
    'O passeio terminou com uma fotografia para guardar aquele dia.'
  ]
};
function jornalDiarioTexto(fotos){
  var momento = (fotos || []).find(function(f){ return f && !f.tipo && f.cena && f.grupo && f.grupo.length >= 2; });
  if(!momento) return [];
  var a = String(momento.grupo[0].nick), b = String(momento.grupo[1].nick);
  var tema = momento.cena[4] || momento.cena[0], roteiro = JORNAL_DIARIO_ARCOS[tema] || JORNAL_DIARIO_ARCOS.basico;
  var dia = Number.isInteger(momento.dia) ? momento.dia : Math.floor((Date.now() - 3 * 3600e3) / 864e5);
  var meio = roteiro[1][((dia % roteiro[1].length) + roteiro[1].length) % roteiro[1].length];
  function dizer(s){ return tr(s).replace(/\{a\}/g, a).replace(/\{b\}/g, b); }
  return ['🌱 ' + dizer(roteiro[0]), '✨ ' + dizer(meio), '📸 ' + dizer(roteiro[2])];
}
function jornalDiarioUI(fotos){
  var box = $('jornalDiarioDia'); if(!box) return;
  var linhas = jornalDiarioTexto(fotos);
  box.innerHTML = linhas.length ? '<ol class="jndiariolista">' + linhas.map(function(t, i){
    return '<li><small>' + escHtml(tr(['Começo','Reviravolta','Final'][i])) + '</small>' + escHtml(t) + '</li>';
  }).join('') + '</ol>' : '<p class="jnvazio">' + escHtml(tr('O diário aparece quando os Idols do dia carregarem.')) + '</p>';
}
// Somente feitos presentes nos placares públicos retornados pelo servidor.
// Não transforma ações privadas de Café/Handshake, prêmios ou pontuações locais em notícia.
function jornalFeitosPublicos(d){
  d = d || {};
  var modos = [
    ['center','🏁','Center⭐Run!','pontos'],
    ['sora','☁️','Sora⭐Jump!','m'],
    ['karaoke','🎤','Karaoke⭐Time!','pontos']
  ];
  return modos.map(function(m){
    var lista = Array.isArray(d[m[0]]) ? d[m[0]] : [], top = lista[0];
    if(!top || typeof top.nick !== 'string' || !top.nick.trim() || !Number.isFinite(Number(top.score)) || Number(top.score) <= 0) return null;
    return m[1] + ' ' + tr('{a} apareceu no placar semanal de {b} com {n} {u}.')
      .replace('{a}', top.nick).replace('{b}', m[2]).replace('{n}', jornalNum(top.score)).replace('{u}', tr(m[3]));
  }).filter(Boolean);
}
function jornalFeitosHtml(d){
  var itens = jornalFeitosPublicos(d);
  return '<section class="jnbloco jnfeitos"><h4>⭐ ' + escHtml(tr('Aconteceu no TsuLiPa de verdade!')) + '</h4>' +
    '<p class="jndiariodica">' + escHtml(tr('Destaques de pontuações públicas confirmadas no servidor — não são acontecimentos fictícios nem prêmios novos.')) + '</p>' +
    (itens.length ? '<ul>' + itens.map(function(t){ return '<li>' + escHtml(t) + '</li>'; }).join('') + '</ul>' :
    '<p class="jnvazio">' + escHtml(tr('Ainda não há destaques públicos confirmados.')) + '</p>') + '</section>';
}
function jornalFotosDia(){
  var box = $('jornalFotosDia'); if(!box) return;
  var L = typeof hubIdolsDados !== 'undefined' && hubIdolsDados && Array.isArray(hubIdolsDados.idols) ? hubIdolsDados.idols.filter(function(p){ return p && p.nick && p.avatar && p.avatar.c; }) : [];
  if(L.length < 3){ box.innerHTML = '<p class="jnvazio">' + escHtml(tr('As fotos aparecem quando a vitrine carregar.')) + '</p>'; jornalDiarioUI([]); return; }
  L.sort(function(a, b){ return String(a.nick).localeCompare(String(b.nick)); });
  var dia = Math.floor((Date.now() - 3 * 3600e3) / 864e5), gente = jornalSorteio(L, dia), cenas = jornalCenasDoDia(dia), pos = 0, h = '';
  var fotos = [0, 1, 2].map(function(i){
    var n = i === 2 ? 3 : ((dia + i) % 2 ? 4 : 3); if(L.length < n) n = L.length;
    var grupo = []; for(var k = 0; k < n; k++) grupo.push(gente[(pos + k) % gente.length]); pos += n;
    return { cena:cenas[i % cenas.length], grupo:grupo, dia:dia };
  });
  // Na primeira fileira, a paisagem dos 8 substitui a antiga terceira foto.
  // O ensaio fotográfico de trio fica no início da segunda fileira.
  var fotoTrio = fotos.pop();
  // Foto especial: 8 Idols diante de uma paisagem do Karaoke, sorteada por dia.
  // Reutiliza o Canvas 2D da janela da sala sem alterar os três sorteios anteriores.
  if(gente.length >= 8 && typeof KaraokeRoomViews !== 'undefined' && KaraokeRoomViews.VIEWS.length){
    var ciclo = KaraokeRoomViews.VIEWS.length, locais = jornalSorteio(KaraokeRoomViews.VIEWS, Math.floor(dia / ciclo) + 31);
    var local = locais[((dia % ciclo) + ciclo) % ciclo], oito = [];
    for(var j = 0; j < 8; j++) oito.push(gente[(pos + j) % gente.length]);
    fotos.push({ cena:['ceu', '📸', '{n} tirando foto de grupo', ['v','banzai','nyan','coracao','tchau','v','banzai','coracao']], grupo:oito, tipo:'janela', local:local, noturna:dia % 3 === 0, dia:dia });
  }
  fotos.push(fotoTrio);
  // O telão usa o elenco do clipe do dia — nunca os vencedores do ranking semanal.
  var fotoTelao = null;
  // O mesmo sorteio/tema do Karaoke é compartilhado e há elenco só com vitrine completa.
  if(typeof KaraokeNewsPhoto !== 'undefined'){
    var dataDoClipe = new Date(dia * 86400000).toISOString().slice(0, 10);
    var euNoClipe = contaJ && contaJ.nick ? contaJ.nick : 'Tsu';
    var clipe = KaraokeNewsPhoto.cast(dataDoClipe, L, euNoClipe);
    if(clipe && clipe.members.length === 6) fotoTelao = {
      cena:['palco', '📺', '{n} no telão do Karaoke⭐Time!', ['mic','banzai','mic','luz','mic','banzai']],
      grupo:clipe.members.map(function(m){ return { nick:m.nick, avatar:m.avatar }; }), tipo:'telao', clipe:clipe.concept, dia:dia
    };
  }
  // você e o seu pet (só para quem entrou e tem pet)
  var pa = typeof petAtivo === 'function' ? petAtivo() : null;
  if(contaJ && pa && petData && PET_SP[petData.ativo] && typeof perfAvAtual === 'function'){
    var meu = perfAvAtual({ pose:'coracao', expr:3, fundo:'basico' }); meu.pet = { k:petData.ativo, acc:typeof pa.acc === 'string' ? pa.acc : '' };
    var nomePet = pa.nome || PET_SP[petData.ativo].n;
    fotos.push({ cena:['oshi', '🐾', '{n} com ' + nomePet + ' no camarim', ['coracao']], grupo:[{ nick:contaJ.nick, avatar:meu }], tipo:'pet', dia:dia, legenda:tr('{a} com {b} no camarim').replace('{a}', contaJ.nick).replace('{b}', nomePet) });
  }
  // A foto do jogador com pet fica entre o trio e o telão quando há login/pet.
  if(fotoTelao) fotos.push(fotoTelao);
  jornalFotosHoje = fotos;
  jornalDiarioUI(fotos);
  box.innerHTML = fotos.map(function(f, i){
    return '<figure class="jnfoto3"><button type="button" class="jnfotobtn" data-jfoto="' + i + '" aria-label="' + escHtml(tr('Ampliar foto')) + '"><canvas width="480" height="300" aria-hidden="true"></canvas></button><figcaption>' + f.cena[1] + ' ' + escHtml(jornalLegenda(f)) + '</figcaption></figure>';
  }).join('');
  fotos.forEach(function(f, i){ var b = box.querySelector('[data-jfoto="' + i + '"]'), cv = b && b.querySelector('canvas'); if(cv) jornalFotoDesenhar(cv, f, false); });
}
var jornalFotosHoje = [];
function jornalLegenda(f){
  if(f.legenda) return f.legenda;
  if(f.tipo === 'janela') return tr('{n} tirando foto de grupo').replace('{n}', '8 Idols') + ' · ' + tr(KaraokeRoomViews.NAMES[f.local] || f.local);
  var nomes = f.grupo.map(function(p){ return p.nick; }), lista = tr('{a} e {b}').replace('{a}', nomes.slice(0, -1).join(', ')).replace('{b}', nomes[nomes.length - 1]);
  return tr(f.cena[2]).replace('{n}', lista);
}
// Adereços das novas histórias, no mesmo Canvas 2D das fotos originais.
// Coordenadas numa câmera fixa de 480×300: miniatura e imagem ampliada coincidem.
function jornalCenaDetalhes(x, tema, w, h){
  x.save(); x.scale(w / 480, h / 300);
  function bolha(px,py,raio,cor){
    x.fillStyle=cor; x.beginPath(); x.arc(px,py,raio,0,Math.PI*2); x.fill();
  }
  function flor(px,py,cor){
    for(var f=0;f<5;f++){var a=f*Math.PI*2/5;bolha(px+Math.cos(a)*8,py+Math.sin(a)*8,7,cor);}
    bolha(px,py,5,'#ffe58c');
  }
  if(tema==='figurinos'){
    // Espelho do camarim, luminárias e cabideiro com looks prontos.
    x.fillStyle='#a96fb2';x.fillRect(16,37,106,151);
    x.fillStyle='#ffe4f2';x.fillRect(23,44,92,137);
    x.fillStyle='#bedfee';x.fillRect(29,50,80,125);
    for(var i=0;i<6;i++){bolha(19,53+i*24,4,'#fff6c0');bolha(119,53+i*24,4,'#fff6c0');}
    x.strokeStyle='#e0b9f2';x.lineWidth=5;x.beginPath();x.moveTo(354,67);x.lineTo(456,67);x.moveTo(362,67);x.lineTo(362,210);x.moveTo(450,67);x.lineTo(450,210);x.stroke();
    ['#ff97bf','#91d4ff','#e6b5ff'].forEach(function(c,i){
      var cx=377+i*31;x.strokeStyle='#fff3e8';x.lineWidth=2;
      x.beginPath();x.moveTo(cx-6,80);x.lineTo(cx,74);x.lineTo(cx+6,80);x.stroke();
      x.fillStyle=c;x.beginPath();x.moveTo(cx-8,85);x.lineTo(cx+8,85);x.lineTo(cx+13,119);x.lineTo(cx-13,119);x.closePath();x.fill();
    });
  }else if(tema==='aniversario'){
    // Balões presos nas laterais e bolo de festa atrás dos Idols.
    [[45,62,'#ff78b7'],[83,38,'#ffe17c'],[415,55,'#8fddf8'],[450,84,'#d8abff']].forEach(function(a){
      x.strokeStyle='rgba(111,76,110,.65)';x.lineWidth=1.4;
      x.beginPath();x.moveTo(a[0],a[1]+18);x.lineTo(a[0]+4,177);x.stroke();
      x.save();x.translate(a[0],a[1]);x.scale(.86,1.16);bolha(0,0,18,a[2]);x.restore();
    });
    x.fillStyle='#fff4da';x.fillRect(380,197,76,28);
    x.fillStyle='#ff82ba';x.fillRect(380,191,76,12);
    x.fillStyle='#ffdb65';x.fillRect(395,177,3,14);x.fillRect(418,177,3,14);x.fillRect(441,177,3,14);
    ['#fff0a1','#fff0a1','#fff0a1'].forEach(function(c,i){bolha(396+i*23,173,4,c);});
  }else if(tema==='cartas'){
    // Cartinhas de fãs abertas, corações e pequenos selos.
    [[32,73,-.1],[385,56,.12],[390,181,-.08]].forEach(function(a,i){
      x.save();x.translate(a[0],a[1]);x.rotate(a[2]);
      x.fillStyle=i%2?'#ffdcf0':'#fff2cf';x.fillRect(0,0,65,43);
      x.strokeStyle='#dba4c5';x.lineWidth=2;x.beginPath();x.moveTo(0,0);x.lineTo(33,24);x.lineTo(65,0);x.stroke();
      x.fillStyle='#ff659e';x.fillRect(49,28,11,10);x.restore();
    });
    x.font='bold 24px sans-serif';x.fillStyle='#ff8cb5';x.fillText('♥',132,69);x.fillText('♥',345,107);
  }else if(tema==='bastidores'){
    // Treliça de palco, spots e caixas de equipamento.
    x.fillStyle='#624774';x.fillRect(0,25,480,12);
    for(var n=0;n<8;n++){x.fillStyle=n%2?'#fbeab2':'#bfe8ff';x.fillRect(24+n*60,27,23,7);}
    x.fillStyle='#3d3357';x.fillRect(16,174,80,88);x.fillRect(390,164,76,95);
    x.strokeStyle='#c3b6d8';x.lineWidth=3;x.strokeRect(23,182,67,68);x.strokeRect(397,172,62,74);
    x.fillStyle='#ffe1f4';x.font='bold 19px sans-serif';x.fillText('★ LIVE',370,93);
  }else if(tema==='estudio'){
    // Cabine de gravação: painéis acústicos, mesa de som e microfone.
    x.fillStyle='#302c58';x.fillRect(24,39,128,134);x.fillRect(339,37,110,129);
    for(var i=0;i<9;i++){
      x.fillStyle=i%2?'#564e84':'#645a97';x.fillRect(31+i*13,47,8,118);
      x.fillStyle=['#8ff0d0','#ffe284','#fc97bf'][i%3];x.fillRect(356+i*9,121-(i*17%60),5,46+(i*17%60));
    }
    x.strokeStyle='#e8d5ff';x.lineWidth=5;x.beginPath();x.moveTo(410,49);x.lineTo(310,79);x.lineTo(310,166);x.stroke();
    x.fillStyle='#cfc9eb';x.fillRect(299,119,22,35);
    bolha(310,119,14,'#dedcf0');
  }else if(tema==='jardim'){
    // O piquenique ganha canteiros, flores e uma toalha ao fundo.
    x.fillStyle='rgba(180,236,176,.67)';x.fillRect(0,207,480,93);
    x.fillStyle='#fff1e4';x.beginPath();x.moveTo(38,236);x.lineTo(435,235);x.lineTo(466,298);x.lineTo(16,298);x.closePath();x.fill();
    x.strokeStyle='#ffb9c8';x.lineWidth=7;
    for(var i=0;i<6;i++){x.beginPath();x.moveTo(52+i*64,237);x.lineTo(30+i*71,299);x.stroke();}
    [[30,99,'#ff9bc6'],[77,151,'#bba8ff'],[424,112,'#ffdc78'],[461,159,'#ff91bc']].forEach(function(a){
      x.strokeStyle='#6ca782';x.lineWidth=3;x.beginPath();x.moveTo(a[0],a[1]+8);x.lineTo(a[0],a[1]+43);x.stroke();
      flor(a[0],a[1],a[2]);
    });
  }
  x.restore();
}
// Atuação fotográfica estável por data: thumbnail e download recebem os mesmos gestos.
// Uma dupla responde à outra em cada cena, sem mudar posições, altura ou enquadramento.
function jornalFotoAtuacao(f, k, n){
  var dia = typeof f.dia === 'number' ? f.dia : 0;
  var tema = f.cena[4] || f.cena[0] || 'basico';
  var poses = f.cena[3] || ['v'];
  var s = (Math.imul(dia + tema.length * 17, 1103515245) ^ Math.imul(k + 1, 12345)) >>> 0;
  var gesto = poses[(k + ((s >>> 8) % poses.length)) % poses.length];
  var olhar = [2, 3, 6, 4, 0][(s >>> 4) % 5];
  var duplas = {
    palco:['mic','banzai'], cafe:['coracao','tchau'], ceu:['banzai','tchau'],
    noite:['mic','luz'], basico:['v','coracao'], oshi:['luz','luz'],
    figurinos:['v','tchau'], aniversario:['banzai','coracao'], cartas:['coracao','v'],
    bastidores:['tchau','mic'], estudio:['mic','v'], jardim:['coracao','v']
  };
  if(n >= 3 && f.tipo !== 'telao'){
    // Na panorâmica, a interação continua no centro e não tapa os extremos.
    var par = f.tipo === 'janela' ? 2 + (dia % 2) : ((dia + tema.length) % (n - 1));
    var gestos = duplas[tema] || ['v','coracao'];
    if(k === par){ gesto = gestos[0]; olhar = tema === 'aniversario' ? 4 : 6; }
    if(k === par + 1){ gesto = gestos[1]; olhar = 3; }
  }
  if(tema === 'aniversario' && n >= 3){
    // A pessoa aniversariante se surpreende e a vizinha comemora.
    var aniversariante = dia % n;
    if(k === aniversariante){ gesto = 'coracao'; olhar = 4; }
    if(k === (aniversariante + 1) % n){ gesto = 'banzai'; olhar = 3; }
  }
  if(tema === 'estudio' && f.tipo !== 'janela' && f.tipo !== 'telao'){
    // Os microfones continuam na mão de quem está gravando.
    if(k === 0 || k === 2){ gesto = 'mic'; olhar = k === 0 ? 2 : 3; }
  }
  if(f.tipo === 'telao') olhar = [2,3,6,2,3,6][(k + (dia % 6)) % 6];
  return { pose:gesto, expr:olhar, inclinar:((s % 3) - 1) * .012 };
}
function jornalFotoDesenhar(cv, f, assinatura){
  var x = cv.getContext('2d'); if(!x) return;
  var W2 = cv.width, H2 = cv.height, cor = (f.grupo[0].avatar.c && f.grupo[0].avatar.c.hair) || '#ff6fb5';
  x.clearRect(0, 0, W2, H2);
  try{
    if(f.tipo === 'janela' && typeof KaraokeRoomViews !== 'undefined'){
      // Enquadramento fotográfico: mostra os marcos do cenário, sem a moldura da janela.
      // No templo tailandês, o céu é recortado para preservar a torre acima do elenco.
      var pan = f.local === 'tailandia' ? .55 : .25;
      // A arte das cinco vistas mistura medidas relativas e pixels fixos (ex.: templo).
      // Desenha sempre numa câmera virtual de 480×300 e escala tudo junto no download.
      var fotoW = 480, fotoH = 300;
      x.save(); x.scale(W2 / fotoW, H2 / fotoH); x.translate(0, -fotoH * pan);
      KaraokeRoomViews.drawScene(x, 0, 0, fotoW, fotoH * (1 + pan), 0, f.local, !!f.noturna);
      x.restore();
    }
    else if(f.tipo === 'telao' && f.clipe && typeof KaraokeNewsPhoto !== 'undefined') KaraokeNewsPhoto.drawBackground(x, f.clipe, W2, H2);
    else if(f.cena[0] === 'cafe' && typeof duoFundoDesenhar === 'function') duoFundoDesenhar(x, W2, H2, 'cafe', 0, cor);
    else perfFundo(x, W2, H2, f.cena[0], cor, 0);
  }catch(e){}
  // Elementos de cena ficam atrás dos personagens; a foto continua legível.
  if(!f.tipo && f.cena[4]) jornalCenaDetalhes(x, f.cena[4], W2, H2);
  var n = f.grupo.length, slot = W2 / n;
  if(f.tipo === 'telao' && f.clipe){
    // Máscara do telão: as silhuetas não podem sair da área visível.
    x.save(); x.beginPath(); x.rect(W2*.014, H2*.022, W2*.972, H2*.956); x.clip();
    // Mesmo uniforme do videoclipe do dia (altera só a cópia usada na foto).
    var uniforme = typeof KaraokeClipUniforms !== 'undefined' ? KaraokeClipUniforms.UNIFORMES[f.clipe.set] : null;
    f.grupo.forEach(function(p, k){
      var av = JSON.parse(JSON.stringify(p.avatar));
      av.visual = ''; av.pet = null;
      av.pose = ['mic','banzai','mic','luz','mic','banzai'][k]; av.expr = jornalFotoAtuacao(f, k, 6).expr;
      if(uniforme){ av.c.out = uniforme[0]; av.c.outcol = uniforme[1]; }
      var largura = W2 / 6, altura = H2 * [ .59,.62,.65,.65,.62,.59 ][k];
      var cx = largura * (k + .5), base = H2 * (.935 - Math.abs(k - 2.5) * .006);
      x.save(); x.translate(cx, base); x.rotate([-.04,.035,-.02,.025,-.035,.04][k]);
      x.translate(-largura * .48, -altura * .90);
      try{ perfDesenharIdol(x, largura * .96, altura, av, false, false, 0); }catch(e){}
      x.restore();
    });
    x.save(); x.fillStyle = 'rgba(7,4,23,.73)'; x.fillRect(W2*.05,H2*.034,W2*.90,H2*.072);
    x.fillStyle = f.clipe.colors[2]; x.textAlign = 'center';
    x.font = '900 ' + Math.round(H2 * .045) + 'px "M PLUS Rounded 1c",sans-serif';
    x.fillText('♪ ' + f.clipe.name + ' · CLIPE DO DIA', W2*.5, H2*.085, W2*.84);
    x.restore();
    x.restore(); // encerra o recorte antes de desenhar a moldura na frente
    n = 0;
  }
  if(f.tipo === 'pet'){
    var av1 = JSON.parse(JSON.stringify(f.grupo[0].avatar)), pet = typeof perfPetDoAvatar === 'function' ? perfPetDoAvatar(av1) : null;
    av1.visual = ''; av1.pet = null; av1.pose = 'banzai'; av1.expr = 3;
    x.save(); x.translate(-W2 * .07, -H2 * .42); x.rotate(-.045);
    try{ perfDesenharIdol(x, W2 * .82, H2 * 1.55, av1, false, false, 0); }catch(e){}
    x.restore();
    if(pet && typeof perfDesenharPetEm === 'function'){
      x.save(); x.translate(W2 * .77, H2 * .69); x.rotate(-.12);
      perfDesenharPetEm(x, pet, 0, 0, H2 / 68, 0); x.restore();
    }
    x.save(); x.textAlign = 'center'; x.font = '900 ' + Math.round(H2 * .095) + 'px sans-serif';
    [['♥',.82,.23,'#ff6fb5'],['✦',.61,.13,'#ffe14d'],['✦',.93,.45,'#8ae8ff']].forEach(function(a){ x.fillStyle = a[3]; x.fillText(a[0], W2 * a[1], H2 * a[2]); });
    x.restore(); n = 0;
  }
  if(f.tipo === 'janela'){
    // Piso em primeiro plano nas cinco paisagens: os pés nunca ficam na água.
    // Tons da própria vista (madeira, areia ou pedra), sem esconder os monumentos.
    var pisos = { tailandia:['#b88966','#805036','#dbb18a'], praia:['#f5dab4','#d2a174','#fff1d5'],
      gigoia:['#c4926b','#825238','#e0b58f'], liberdade:['#d6c2b8','#90817d','#fff0e0'],
      harajuku:['#cabfda','#8880a1','#f0e7ff'] };
    var tons = pisos[f.local] || pisos.gigoia, inicio = H2*.825;
    x.save();
    var piso = x.createLinearGradient(0,inicio,0,H2);
    piso.addColorStop(0,tons[0]); piso.addColorStop(1,tons[1]);
    x.fillStyle = piso; x.beginPath(); x.moveTo(0,inicio+H2*.013);
    x.lineTo(W2*.5,inicio); x.lineTo(W2,inicio+H2*.013);
    x.lineTo(W2,H2); x.lineTo(0,H2); x.closePath(); x.fill();
    x.strokeStyle = tons[2]; x.lineWidth = Math.max(2,H2*.007);
    x.beginPath(); x.moveTo(0,inicio+H2*.015); x.lineTo(W2*.5,inicio+H2*.003); x.lineTo(W2,inicio+H2*.015); x.stroke();
    // Juntas do deck/calçamento em perspectiva, discretas sob os Idols.
    x.strokeStyle = 'rgba(45,31,50,.19)'; x.lineWidth = Math.max(1,H2*.003);
    [.89,.953].forEach(function(y){ x.beginPath(); x.moveTo(0,H2*y); x.lineTo(W2,H2*y); x.stroke(); });
    for(var tabua=0;tabua<=8;tabua++){
      var px=W2*tabua/8;
      x.beginPath(); x.moveTo(W2*.5+(px-W2*.5)*.55,inicio); x.lineTo(px,H2); x.stroke();
    }
    x.restore();
    f.grupo.forEach(function(p, k){
      var av8 = JSON.parse(JSON.stringify(p.avatar)), slot8 = W2 / 8;
      var balanco = [-.045,.025,-.035,.04,-.025,.04,-.03,.035][k];
      var varia = [1.04,.98,1.02,1.06,.97,1.03,.99,1.04][k];
      var altura = H2 * .40 * varia; // rosto visível, monumento ao fundo descoberto
      var chao = H2 * (.962 - Math.abs(k - 3.5) * .009);
      var centro = slot8 * (k + .5);
      var atuacao8 = jornalFotoAtuacao(f, k, 8);
      av8.pose = atuacao8.pose; av8.expr = atuacao8.expr; av8.visual = ''; av8.pet = null;
      // Panorâmica em arco: oito rostos visíveis, sem uma fila cobrir a outra.
      // Cada Idol gira ao redor dos próprios pés, que continuam na areia.
      x.save(); x.translate(centro, chao); x.rotate(balanco);
      x.translate(-slot8 * .52, -altura * .9);
      try{ perfDesenharIdol(x, slot8 * 1.04, altura, av8, false, false, 0); }catch(e){}
      x.restore();
    });
    // Um único fio de bandeirinhas atravessa a foto de borda a borda.
    // A curva e as bases dos triângulos compartilham a mesma equação.
    x.save();
    var coresFesta = ['#ff7eb6','#ffe47a','#8ae4ff','#94eec8'];
    var yFio = function(t){ return H2*(.032 + .405*t*(1-t)); };
    x.lineWidth = Math.max(1.5,H2*.006);
    x.strokeStyle = 'rgba(255,248,232,.94)';
    x.beginPath(); x.moveTo(0,yFio(0));
    x.bezierCurveTo(W2/3,H2*.167,W2*2/3,H2*.167,W2,yFio(1)); x.stroke();
    for(var bandeira=0;bandeira<18;bandeira++){
      var t=(bandeira+.5)/18, px=W2*t, py=yFio(t);
      var larguraB=W2*.011, alturaB=H2*.042;
      x.fillStyle=coresFesta[bandeira%coresFesta.length];
      x.beginPath(); x.moveTo(px-larguraB,py); x.lineTo(px+larguraB,py);
      x.lineTo(px,py+alturaB); x.closePath(); x.fill();
      x.strokeStyle='rgba(255,255,255,.63)'; x.lineWidth=Math.max(.7,H2*.002);
      x.stroke();
    }
    // Laços nos extremos prendem o fio à própria borda do retrato.
    [0,W2].forEach(function(px,i){
      x.save(); x.translate(px,yFio(i));
      x.fillStyle='#fff3d1';
      x.beginPath(); x.arc(0,0,H2*.011,0,Math.PI*2); x.fill();
      x.strokeStyle='#ff7eb6'; x.lineWidth=Math.max(1,H2*.004);
      x.beginPath(); x.moveTo(-W2*.016,-H2*.02); x.lineTo(0,0); x.lineTo((i?1:-1)*W2*.015,H2*.025); x.stroke();
      x.restore();
    });
    x.restore();
    n = 0;
  }
  if(n) f.grupo.forEach(function(p, k){
    var av = JSON.parse(JSON.stringify(p.avatar)), atuacao = jornalFotoAtuacao(f, k, n);
    av.pose = atuacao.pose; av.expr = atuacao.expr; av.visual = '';
    var inclinacao = [-.065,.06,-.045,.07][k % 4] + atuacao.inclinar, ampliacao = [1.045,.985,1.07,1.015][k % 4];
    var altura = H2 * .94 * ampliacao, chao = H2 * (.93 + [0,.008,-.007,.005][k % 4]);
    var centro = W2 / 2 + (k - (n - 1) / 2) * slot * .79;
    // Aproxima o trio, alterna pose e escala, mas conserva os pés na linha do chão.
    x.save(); x.translate(centro, chao); x.rotate(inclinacao);
    x.translate(-slot * .61, -altura * .9);
    try{ perfDesenharIdol(x, slot * 1.22, altura, av, false, false, 0); }catch(e){} x.restore();
  });
  if(f.tipo === 'telao'){   // aro do telão sobreposto aos cantores (até aos cabelos)
    x.save(); x.strokeStyle = '#ffd23f'; x.lineWidth = W2 / 60;
    x.strokeRect(x.lineWidth / 2, x.lineWidth / 2, W2 - x.lineWidth, H2 - x.lineWidth);
    for(var q = 0; q < 16; q++){
      x.fillStyle = q % 2 ? '#ff6fb5' : '#4dd8ff';
      x.beginPath(); x.arc(W2 * (q + .5) / 16, W2 / 120, W2 / 140, 0, Math.PI * 2); x.fill();
    }
    x.restore();
  }
  if(assinatura){
    var u = W2 / 480; x.font = '800 ' + Math.round(13 * u) + 'px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'right'; x.fillStyle = 'rgba(255,255,255,.9)';
    x.shadowColor = 'rgba(30,10,60,.6)'; x.shadowBlur = 5 * u; x.fillText('Idol⭐News! · TsuLiPa⭐World', W2 - 10 * u, H2 - 10 * u); x.shadowBlur = 0;
  }
}
function jornalFotoAmpliar(i){   // abre grande, com BAIXAR (a mesma tela de foto do jogo)
  var f = jornalFotosHoje[i]; if(!f) return;
  var cv = document.createElement('canvas'); cv.width = 1440; cv.height = 900; jornalFotoDesenhar(cv, f, true);
  var u = cv.toDataURL('image/png'), dia = new Date(Date.now() - 3 * 3600e3).toISOString().slice(0, 10);
  $('shimg').src = u; $('shimg').alt = jornalLegenda(f); $('shdl').href = u; $('shdl').download = 'idol-news-' + dia + '-' + (i + 1) + '.png';
  if(typeof petPhShow === 'function') petPhShow(false);
  $('shr').hidden = false; if(sfx && sfx.card) try{ sfx.card(); }catch(e){}
}
function jornalTop5(d){   // o pódio do servidor tem 3; Center, Sora e Karaoke têm listas maiores: completa até 5
  d = d || {};
  var cen = _supabase ? _supabase.rpc('top_scores', { periodo:'week' }).then(function(r){ return r.error ? null : (r.data || []).map(function(x){ return { nick:x.name, score:x.score }; }); }) : Promise.resolve(null);
  var sor = _supabase ? _supabase.rpc('sora_ranking', { p_period:'week' }).then(function(r){ return r.error ? null : (r.data || []).map(function(x){ return { nick:x.nick, score:x.score }; }); }) : Promise.resolve(null);
  var kar = contaJ ? contaRpc('kt_ranking').then(function(k){ return k && Array.isArray(k.score) ? k.score.map(function(x){ return { nick:x.nick, score:x.score }; }) : null; }) : Promise.resolve(null);
  return Promise.all([cen.catch(function(){ return null; }), sor.catch(function(){ return null; }), kar.catch(function(){ return null; })]).then(function(r){
    if(r[0] && r[0].length >= (d.center || []).length) d.center = r[0];
    if(r[1] && r[1].length >= (d.sora || []).length) d.sora = r[1];
    if(r[2] && r[2].length >= (d.karaoke || []).length) d.karaoke = r[2];
    return d;
  });
}
function jornalAbrir(){
  jornalOv.hidden = false; jornalOv.scrollTop = 0;
  $('jornalCorpo').innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  if(typeof hubIdolsCarregar === 'function' && !(typeof hubIdolsDados !== 'undefined' && hubIdolsDados)) hubIdolsCarregar();
  contaRpc('tw_podio_semana').then(function(d){ return jornalTop5(d); }).then(function(d){ if(jornalOv.hidden) return; $('jornalCorpo').innerHTML = jornalMontar(d); jornalFotos(); jornalFotosDia(); jornalPostsCarregar(); jornalTimesCarregar(); jornalFestCarregar(); jornalTrioCarregar(); })
    .catch(function(){ if(!jornalOv.hidden){ $('jornalCorpo').innerHTML = jornalMontar({}); jornalFotos(); jornalFotosDia(); jornalPostsCarregar(); jornalTimesCarregar(); jornalFestCarregar(); jornalTrioCarregar(); } });
}
function jornalFechar(){ jornalOv.hidden = true; }
// ---------- Novidades como blog: só a admin posta (imagem, título e legenda); ficam os 5 últimos ----------
// RPCs news_posts / admin_news_postar / admin_news_apagar: proposta em supabase/sql/proposta/20261103150000_idol_news_posts.sql
var jornalPosts = null, jornalPostImg = '';
function jornalPostsHtml(){
  var h = '<section class="jnbloco jnblog"><h4>✨ ' + escHtml(tr('Novidades')) + '</h4>';
  if(typeof perfAdmin !== 'undefined' && perfAdmin && contaJ) h += '<details class="jnpostar"><summary>✏️ ' + escHtml(tr('Novo post')) + '</summary>' +
    '<label>' + escHtml(tr('Título')) + ' <input type="text" id="jnPostTit" maxlength="80"></label>' +
    '<label>' + escHtml(tr('Legenda')) + ' <textarea id="jnPostLeg" maxlength="600" rows="3"></textarea></label>' +
    '<label>' + escHtml(tr('Imagem')) + ' <input type="file" id="jnPostImg" accept="image/*"></label><img id="jnPostPrev" alt="" hidden>' +
    '<div class="btns"><button type="button" class="btn" id="jnPostOk">' + escHtml(tr('Publicar')) + '</button></div><p class="perfmsg" id="jnPostMsg" hidden></p></details>';
  h += '<div id="jornalPosts"></div></section>';
  return h;
}
function jornalPostsUI(){
  var box = $('jornalPosts'); if(!box) return;
  if(jornalPosts === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  if(!jornalPosts.length){   // sem posts (ou o blog ainda não está no servidor): as novidades desta versão
    box.innerHTML = '<ul>' + JORNAL_NOVIDADES.map(function(n){ return '<li>' + n[0] + ' ' + escHtml(tr(n[1])) + '</li>'; }).join('') + '</ul>'; return;
  }
  var adm = typeof perfAdmin !== 'undefined' && perfAdmin;
  box.innerHTML = jornalPosts.map(function(p){
    var d = new Date(p.criado), dt = isNaN(d) ? '' : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2);
    return '<article class="jnpost">' + (/^data:image\/jpeg;base64,/.test(p.imagem || '') ? '<img src="' + p.imagem + '" alt="' + escHtml(p.titulo) + '" loading="lazy">' : '') +
      '<h5>' + escHtml(p.titulo) + (dt ? ' <small>' + dt + '</small>' : '') + '</h5>' + (p.legenda ? '<p>' + escHtml(p.legenda) + '</p>' : '') +
      (adm ? '<button type="button" class="btn alt jnpostdel" data-jnapagar="' + (+p.id) + '">🗑️ ' + escHtml(tr('Apagar')) + '</button>' : '') + '</article>';
  }).join('');
}
function jornalPostsCarregar(){
  jornalPosts = null; jornalPostsUI();
  contaRpc('news_posts').then(function(L){ jornalPosts = Array.isArray(L) ? L.slice(0, 5) : []; jornalPostsUI(); })
    .catch(function(){ jornalPosts = []; jornalPostsUI(); });
}
function jornalPostImagem(file){   // reduz para até 900 px e JPEG, antes de enviar
  jornalPostImg = ''; var pv = $('jnPostPrev'); if(!file) { if(pv) pv.hidden = true; return; }
  var r = new FileReader();
  r.onload = function(){ var im = new Image(); im.onload = function(){
    var k = Math.min(1, 900 / Math.max(im.width, im.height)), cv = document.createElement('canvas'); cv.width = Math.round(im.width * k); cv.height = Math.round(im.height * k);
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
    var q = .82, u = cv.toDataURL('image/jpeg', q); while(u.length > 340000 && q > .4){ q -= .1; u = cv.toDataURL('image/jpeg', q); }
    jornalPostImg = u; if(pv){ pv.src = u; pv.hidden = false; }
  }; im.src = r.result; };
  r.readAsDataURL(file);
}
function jornalPostar(btn){
  var m = $('jnPostMsg'), t = ($('jnPostTit').value || '').trim(), l = ($('jnPostLeg').value || '').trim();
  if(!t){ m.textContent = tr('Escreva um título.'); m.hidden = false; return; }
  btn.disabled = true;
  contaRpc('admin_news_postar', { p_titulo:t, p_legenda:l, p_imagem:jornalPostImg }).then(function(r){
    btn.disabled = false;
    if(!r || !r.ok){ m.textContent = tr('Não deu para publicar.'); m.hidden = false; return; }
    $('jnPostTit').value = ''; $('jnPostLeg').value = ''; jornalPostImagem(null); m.textContent = '✨ ' + tr('Publicado!'); m.hidden = false; jornalPostsCarregar();
  }).catch(function(){ btn.disabled = false; m.textContent = tr('Não deu para publicar.'); m.hidden = false; });
}
function jornalPostApagar(id){
  contaRpc('admin_news_apagar', { p_id:id }).then(function(){ jornalPostsCarregar(); }).catch(function(){});
}
// ---------- Meta semanal dos Teams do BRS48 (RPC times_semana: proposta 20261103160000_times_semana.sql) ----------
var jornalTimes = null;
function jornalTimesHtml(){ return '<section class="jnbloco jntimes"><h4>🤝 ' + escHtml(tr('Meta dos Teams')) + ' <small>BRS48</small></h4><div id="jornalTimes"></div></section>'; }
function jornalTimeInfo(cod){
  var g = typeof PERF_GRUPOS !== 'undefined' ? PERF_GRUPOS.find(function(x){ return x.codigo === 'BRS48'; }) : null;
  return (g && g.times || []).find(function(t){ return t.codigo === cod; }) || { codigo:cod, nome:'Team ' + cod, cor:'#7b3ff0' };
}
function jornalTimesUI(){
  var box = $('jornalTimes'); if(!box) return;
  if(jornalTimes === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  var L = jornalTimes && Array.isArray(jornalTimes.times) ? jornalTimes.times : [];
  if(!L.length){ box.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('A meta dos Teams começa em breve: escolha o seu Team no perfil e jogue Center⭐Run! e Karaoke⭐Time! para encher a barra.')) + '</p>'; return; }
  box.innerHTML = '<p class="jndica">' + escHtml(tr('Como funciona: cada Team tem uma meta de 300 pontos por membro que jogou nesta semana. Os pontos são as estrelas ganhas no Center⭐Run! + 10 por show do Karaoke⭐Time!. Bateu a meta, o Team ganha a coroa 👑.')) + '</p>' + L.map(function(t, i){
    var info = jornalTimeInfo(t.codigo), meta = Math.max(1, +t.meta || 1), pts = +t.pontos || 0, pc = Math.min(100, Math.round(pts / meta * 100)), ok = pts >= meta;
    return '<div class="jntime"><div class="jntimel"><b style="color:' + info.cor + '">' + (i + 1) + 'º ' + escHtml(info.nome) + (ok ? ' 👑' : '') + '</b><small>' + jornalNum(pts) + ' / ' + jornalNum(meta) + '</small></div>' +
      '<div class="albumbarra jntimeb"><i style="width:' + pc + '%;background:' + info.cor + '"></i></div>' +
      '<small class="jntimed">' + escHtml(tr('Pontos: ⭐ {e} + 🎤 {s} shows × 10 · Meta: 300 × {a} que jogaram')).replace('{e}', jornalNum(t.estrelas)).replace('{s}', jornalNum(t.shows)).replace('{a}', Math.max(1, +t.ativos || 0)) + '</small></div>';
  }).join('');
}
function jornalTimesCarregar(){
  jornalTimes = null; jornalTimesUI();
  contaRpc('times_semana').then(function(d){ jornalTimes = d || {}; jornalTimesUI(); }).catch(function(){ jornalTimes = {}; jornalTimesUI(); });
}
// ---------- Festival de Unidades (RPC festival_unidades: proposta 20261103190000_festival_e_ensaio_trio.sql) ----------
var jornalFest = null;
function jornalFestHtml(){ return '<section class="jnbloco jntimes"><h4>🎤 ' + escHtml(tr('Festival de Unidades')) + ' <small id="jornalFestMus"></small></h4><div id="jornalFest"></div></section>'; }
function jornalFestUI(){
  var box = $('jornalFest'); if(!box) return;
  var mus = typeof hubMusicaSemana === 'function' ? hubMusicaSemana() : null, m = $('jornalFestMus'); if(m && mus) m.textContent = mus[1];
  if(jornalFest === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  var L = jornalFest && Array.isArray(jornalFest.times) ? jornalFest.times : [];
  if(!L.length){ box.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('O Festival de Unidades começa em breve!')) + '</p>'; return; }
  var max = Math.max.apply(null, L.map(function(t){ return +t.total || 0; }).concat([1]));
  box.innerHTML = '<p class="jndica">' + escHtml(tr('Cada membro canta sozinho a música da semana no Karaoke⭐Time!; a melhor nota de cada um soma para o seu Team.')) + '</p>' + L.map(function(t, i){
    var info = jornalTimeInfo(t.codigo), tot = +t.total || 0;
    return '<div class="jntime"><div class="jntimel"><b style="color:' + info.cor + '">' + (['🥇', '🥈', '🥉'][i] || (i + 1) + 'º') + ' ' + escHtml(info.nome) + '</b><small>' + jornalNum(tot) + ' ' + escHtml(tr('pts')) + '</small></div>' +
      '<div class="albumbarra jntimeb"><i style="width:' + Math.round(tot / max * 100) + '%;background:' + info.cor + '"></i></div>' +
      '<small class="jntimed">🎤 ' + (+t.cantaram || 0) + ' ' + escHtml(tr('cantaram')) + (t.destaque ? ' · 🌟 ' + escHtml(tr('Destaque')) + ': ' + escHtml(t.destaque) + ' (' + jornalNum(t.destaque_nota) + ')' : '') + '</small></div>';
  }).join('');
}
function jornalFestCarregar(){ jornalFest = null; jornalFestUI(); contaRpc('festival_unidades').then(function(d){ jornalFest = d || {}; jornalFestUI(); }).catch(function(){ jornalFest = {}; jornalFestUI(); }); }
// ---------- Ensaio de trio (RPC meu_trio_semana) ----------
var jornalTrio = null;
function jornalTrioHtml(){ return '<section class="jnbloco"><h4>🎭 ' + escHtml(tr('Ensaio de trio')) + '</h4><div id="jornalTrio"></div></section>'; }
function jornalTrioUI(){
  var box = $('jornalTrio'); if(!box) return;
  if(!contaJ){ box.innerHTML = '<p class="jnvazio">' + escHtml(tr('Entre na sua conta para ensaiar em trio.')) + '</p>'; return; }
  var d = jornalTrio;
  if(d === null){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; return; }
  if(!d.ok){ box.innerHTML = '<p class="albumaviso">🛠️ ' + escHtml(tr('O Ensaio de trio começa em breve!')) + '</p>'; return; }
  if(!d.aberto){ box.innerHTML = '<p class="jndica">' + escHtml(tr('Toda sexta você ganha um trio com outros Idols. Cada um faz a sua parte até domingo e o trio libera uma cena especial!')) + '</p><p class="jnvazio">📅 ' + escHtml(tr('Os trios saem na sexta.')) + '</p>'; return; }
  if(d.fora || !Array.isArray(d.membros)){ box.innerHTML = '<p class="jnvazio">' + escHtml(tr('Jogue durante a semana para entrar no trio da próxima sexta!')) + '</p>'; return; }
  var todos = d.membros.every(function(m){ return m.feito; });
  box.innerHTML = '<p class="jndica">' + escHtml(tr('Sua parte: terminar 1 corrida no Center⭐Run! ou 1 show no Karaoke⭐Time! até domingo.')) + '</p>' +
    '<ul class="trlista">' + d.membros.map(function(m){ return '<li class="tritem">' + (m.feito ? '✅' : '⏳') + ' <span><b>' + escHtml(m.nick) + '</b>' + (m.eu ? ' (' + escHtml(tr('você')) + ')' : '') + '</span></li>'; }).join('') + '</ul>' +
    (todos ? '<p class="faok">🎉 ' + escHtml(tr('Ensaio completo! A cena do trio está liberada.')) + '</p><button type="button" class="jnfotobtn" id="jnTrioCena" aria-label="' + escHtml(tr('Ampliar foto')) + '"><canvas width="480" height="300" aria-hidden="true"></canvas></button>' : '');
  var b = $('jnTrioCena'); if(b) jornalTrioDesenhar(b.querySelector('canvas'), false);
}
function jornalTrioDesenhar(cv, assinatura){   // a cena especial: o trio no palco, cada um numa pose
  var d = jornalTrio; if(!cv || !d || !Array.isArray(d.membros)) return;
  var f = { cena:['palco', '🎭', '', ['mic', 'banzai', 'luz']], grupo:d.membros.map(function(m){ return { nick:m.nick, avatar:m.avatar || { c:{} } }; }) };
  jornalFotoDesenhar(cv, f, assinatura);
}
function jornalTrioAmpliar(){
  var cv = document.createElement('canvas'); cv.width = 1440; cv.height = 900; jornalTrioDesenhar(cv, true);
  var u = cv.toDataURL('image/png'); $('shimg').src = u; $('shimg').alt = tr('Ensaio de trio'); $('shdl').href = u; $('shdl').download = 'ensaio-de-trio.png';
  if(typeof petPhShow === 'function') petPhShow(false); $('shr').hidden = false;
}
function jornalTrioCarregar(){
  jornalTrio = null; jornalTrioUI(); if(!contaJ) return;
  contaRpc('meu_trio_semana').then(function(d){ jornalTrio = d || { ok:false }; jornalTrioUI(); }).catch(function(){ jornalTrio = { ok:false }; jornalTrioUI(); });
}
