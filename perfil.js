/* Perfil — perfil público e pessoal, Estúdio de foto, Montar Idol, lojinha, nuvem e presente da conta.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 2), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (estado, listeners e inicialização continuam lá). Tabelas que o código lê já
   durante o carregamento (antes do ponto onde eram declaradas) ficaram no index.html. O modo admin é a Etapa 6. */
var PERF_VIS = [   // [chave (igual à do servidor), emoji, nome, preço ★, recorde para aparecer]
  ['',             '🙂', 'Normal',        0,     0],
  ['fever',        '🔥', 'Fever',       120,     0],
  ['ima',          '🧲', 'Ímã',         120,     0],
  ['mega',         '💗', 'Mega',        180,     0],
  ['alien',        '🛸', 'Abduzido',    250,     0],
  ['rank_center',  '🎀', 'Center',      300,  5000],
  ['rank_solo',    '💫', 'Solo Center', 400, 10000],
  ['rank_capitao', '🎖️', 'Capitão',     500, 15000],
  ['rank_ace',     '🏆', 'Eternal Ace', 650, 30000],
  ['rank_kami',    '😇', 'Kami-Oshi',   800, 50000]
];
var PERF_INS = [   // insígnias: [chave (calculada no servidor), emoji, nome, como conquistar]
  ['estreia',  '🎤', 'Estreia',          'Primeira corrida no ranking online'],
  ['maratona', '🏃', 'Maratona',         '100 corridas no ranking online'],
  ['presenca', '📅', 'Presença VIP',     'Correu em 7 dias diferentes'],
  ['center',   '👑', 'Center',           'Chegou a 5000 pontos'],
  ['ace',      '🏆', 'Eternal Ace',      'Chegou a 30000 pontos'],
  ['kami',     '😇', 'Kami-Oshi',        'Chegou a 50000 pontos'],
  ['familia',  '🐾', 'Família completa', 'Tem Chu, Koali, Pucchi e o Meu Pet'],
  ['petkami',  '🌟', 'Pet lendário',     'Um pet chegou ao estágio Kami-Oshi'],
  ['top1mini', '🥇', 'Top 1 do camarim', '1º lugar em um minijogo do camarim'],
  ['fashion',  '🛍️', 'Fashionista',      '5 compras no estúdio e na lojinha'],
  ['estilista','🎨', 'Estilista',        'Escolheu a própria foto do perfil'],
  ['amada',    '💖', 'Coração de ouro',  'Recebeu 10 corações'],
  ['quarteto', '🎤', 'Quarteto TsuLiPa', 'Com o Idol, pegou os 3 microfones na mesma corrida e salvou a foto do quarteto'],
  ['carteiro', '💌', 'Carteiro',         'Deixou 10 recados'],
  ['convite',  '🎉', 'Abre-alas',        'Trouxe uma pessoa nova para o TsuLiPa World'],
  ['look_semana', '📸', 'Look da semana', 'Venceu o Concurso de visual da semana'],
  ['trilha',   '🌱', 'Primeira semana',  'Completou os cinco passos da primeira semana'],
  ['amizade',  '🤝', 'Amizade',          'Deu 10 corações'],
  ['duo',      '🌙', 'Moon⭐Duo!',        'Fez 5 cenas no Moon⭐Duo!'],
  ['guarda',   '👗', 'Guarda-roupa completo', 'Comprou todas as roupas fixas da lojinha'],
  ['centersemana', '🏅', 'Center da semana', 'Ficou em 1º lugar no ranking de uma semana'],
  ['s2_ensaio', '🩰', 'Primeiro ensaio', 'Concluiu o cenário Sala de ensaio na Temporada 2'],
  ['s2_backstage', '💄', 'Dona/Dono do backstage', 'Concluiu o cenário Backstage do teatro na Temporada 2'],
  ['s2_estudio', '🎬', 'Estúdio no ar', 'Concluiu o cenário Estúdio de TV na Temporada 2'],
  ['s2_festival', '🏮', 'Noite de festival', 'Concluiu o cenário Festival de verão na Temporada 2'],
  ['s2_aeroporto', '✈️', 'Embarque VIP', 'Concluiu o cenário Aeroporto da turnê na Temporada 2'],
  ['s2_geral', '🏟️', 'Ensaio geral', 'Concluiu o cenário Ensaio geral na Temporada 2'],
  ['s2_dome', '🌈', 'Noite no Dome', 'Concluiu o cenário Dome do grande show na Temporada 2'],
  ['sora_500', '☁️', 'Pulo nas Nuvens', 'Alcançou 500 metros no Sora⭐Jump!'],
  ['sora_1500', '🌌', 'Voo Estrelado', 'Alcançou 1.500 metros no Sora⭐Jump!'],
  ['sora_3000', '🌙', 'Show na Lua', 'Alcançou 3.000 metros no Sora⭐Jump!'],
  // da temporada: ganha quem joga uma corrida no período do tema
  ['tema_halloween', '🎃', 'Halloween',   'Correu no Halloween'],
  ['tema_natal',     '🎄', 'Natal',       'Correu no Natal'],
  ['tema_anonovo',   '🥂', 'Ano Novo',    'Correu na virada do Ano Novo'],
  ['tema_verao',     '🌞', 'Verão',       'Correu no começo do verão'],
  ['tema_valentine', '💝', 'Valentine',   'Correu no Valentine ou no Dia dos Namorados'],
  ['tema_outono',    '🍁', 'Outono',      'Correu no começo do outono'],
  ['tema_sakura',    '🌸', 'Sakura',      'Correu na época das sakuras'],
  ['tema_inverno',   '❄️', 'Inverno',     'Correu no começo do inverno'],
  ['tema_tanabata',  '🎋', 'Tanabata',    'Correu no Tanabata'],
  ['tema_primavera', '🌼', 'Primavera',   'Correu no começo da primavera'],
  ['tema_criancas',  '🎈', 'Dia das Crianças', 'Correu na semana do Dia das Crianças'],
  ['tema_aniversario', '🎂', 'Aniversário do BRS48', 'Correu na semana do aniversário do BRS48'],
  // especiais: dadas à mão pela moderação (só aparecem em quem ganhou)
  ['esp_evento',     '🏆', 'Pódio do evento',    'Ganhou um evento do TsuLiPa World'],
  ['esp_destaque',   '🌟', 'Destaque da semana', 'Escolha da moderação como destaque da semana'],
  ['esp_fundador',   '💎', 'Fundadores',         'Jogou desde o lançamento do TsuLiPa World'],
  ['jogo_barista', '🧋', 'Barista perfeito', '12 pedidos perfeitos em um turno do Happy⭐Cafe!'],
  ['jogo_memoria', '🤝', 'Memória de fã', 'Combo de 10 acertos no Handshake⭐Event!'],
  ['jogo_caderno', '📒', 'Caderno completo', 'Todas as receitas do Caderno do Happy⭐Cafe!'],
  ['jogo_passatempo', '🧩', 'Passatempo em dia', 'Os 3 passatempos do dia no mesmo dia']
];
// Oshi: membros atuais do BRS48, com a cor e o emoji de cada um (lista do Blog de Membros do BRS48, out/2026).
// Para atualizar, é só mexer nesta lista: [apelido, emoji, cor].
var PERF_OSHI_TIMES = [
  ['TsuLiPa', [['Trio TsuLiPa', '🎤🐨👑', '#ff6fb5']]],
  ['Team S', [['Tsu', '🎤', '#9b30d9'], ['Lirika', '🐨', '#5cc72c'], ['Pati', '👑', '#4169e1'], ['Bloom', '💿', '#f8a99b'], ['Fuji', '🗻', '#b57edc'], ['Henri', '🐼', '#5ec8e5'],
              ['Hiruru', '✨', '#f2b632'], ['Meichan', '🍵', '#4ce02a'], ['Meru', '🥜', '#c99a5b'], ['Mimimila', '🐡', '#ffb347'], ['Miyachan', '🌈', '#4fa8ff'], ['Theo', '🌶️', '#e0218a'], ['Yami', '💉', '#f4b6c2']]],
  ['Team B', [['Acádia', '🌸', '#ffb38a'], ['Aki', '🦈', '#2a9d8f'], ['Corbeau', '🔥', '#2b2b33'], ['Gita', '🐳', '#00a8e8'], ['Lady Nanachi', '🌹', '#b784a7'], ['Macchan', '☀️', '#ff8c1a'], ['Maduppi', '🧸', '#8b5a2b'],
              ['Mahou', '🔮', '#6b2d8b'], ['Maruru', '🦢', '#e86fa0'], ['Natsurin', '🎐', '#1f4e9c'], ['Pudim', '🍮', '#b7a9c9'], ['Yoggy', '🦥', '#8fbc8f'], ['Yun', '🌼', '#5b4fcf'], ['Yuto', '🍒', '#d2042d']]],
  ['Team R', [['Apollo', '🌺', '#87ceeb'], ['Deki', '🌳', '#6b8e23'], ['Gararingo', '🦚', '#0a7e8c'], ['Guies', '😈', '#8c9eff'], ['Gusy', '🦕', '#30d5c8'], ['Kazuki', '🧃', '#ffb267'], ['Kurara', '🐇', '#ff4fa3'],
              ['Miihina', '💖', '#f4a6c0'], ['Nanamaru', '🐸', '#dc143c'], ['Sora', '🍷', '#dfe4ee'], ['Toji', '🍞', '#f6c90e'], ['Yukittan', '💮', '#ff8c69'], ['Z', '⚡', '#333333']]],
  ['Team Kenkyuusei', [['Decchan', '🍓', '#d8a7b1'], ['JJ', '🦑', '#b8e0a0'], ['Kagami', '👙', '#7b3f00'], ['Maimai', '🌻', '#2c3e7a'], ['Moerin', '🐈', '#e09540'], ['Naki', '👸🏻', '#522d80'],
              ['Ruo', '⏰', '#0abab5'], ['Shiro', '🌙', '#a7b8d6'], ['Stella', '💫', '#ffbf00'], ['Tata', '💎', '#ff69b4'], ['Thronato', '👹', '#8a0303'], ['Zoey', '🦁', '#c2185b']]]
];
function perfSlug(n){ return String(n).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '').slice(0, 20); }
function perfOshiKey(n){ return n === 'Trio TsuLiPa' ? 'tsulipa' : perfSlug(n); }
var PERF_OSHI = {};   // apelido sem acento → [emoji, nome, cor]
// V3: o Oshi é escolhido entre quem JOGA (apelido, emoji, cor e time de cada conta). A lista antiga dos 52 membros
// fica só para mostrar oshis já escolhidos antes. Times do BRS48: B azul, R amarelo, S verde, KKS ciano.
var PERF_TIMES = { B:['Team B', '#4169e1'], R:['Team R', '#f5c400'], S:['Team S', '#3cb043'], KKS:['Team KKS', '#4dd8ff'] };
// Identidade nacional independente do time: null/legado continua BRS48 sem migrar saves.
var PERF_GRUPOS = [
  { codigo:'BRS48', nome:'BRS48', pais:'BR', times:[{codigo:'B',nome:'Team B',cor:'#4169e1'},{codigo:'R',nome:'Team R',cor:'#f5c400'},{codigo:'S',nome:'Team S',cor:'#3cb043'},{codigo:'KKS',nome:'Team KKS',cor:'#4dd8ff'}] },
  { codigo:'SKU48', nome:'SKU48', pais:'TH', times:[] },
  { codigo:'SPR48', nome:'SPR48', pais:'ID', times:[] }
];
var PERF_GRUPOS_CARREGADOS = false;
//→perfEmojiOpcoes
//→perfEmojiSincronizar
//→perfPerfilOrganizar
//→perfGrupoCodigo
//→perfGrupo
function perfGrupoBandeira(g){ return g.pais==='TH'?'🇹🇭':g.pais==='ID'?'🇮🇩':g.pais==='BR'?'🇧🇷':'🌏'; }
function perfGruposCarregar(){
  if(PERF_GRUPOS_CARREGADOS)return Promise.resolve(PERF_GRUPOS);
  return contaRpc('grupos_disponiveis').then(function(lista){
    if(Array.isArray(lista)&&lista.length && lista.every(function(g){return /^[A-Z0-9]{2,16}$/.test(g.codigo)&&Array.isArray(g.times)&&/^[A-Z]{2}$/.test(g.pais);}))
      PERF_GRUPOS=lista.map(function(g){ return g.codigo==='SKU48' || g.codigo==='SPR48' ? Object.assign({},g,{times:[]}) : g; }); // SKU ainda não tem divisões, mesmo com RPC antiga em cache
    PERF_GRUPOS_CARREGADOS=true;return PERF_GRUPOS;
  }).catch(function(){return PERF_GRUPOS;});
}
var PERF_OSHI_JOG = null;   // [{nick, emoji, cor, time}] vindo do servidor
function perfOshiJogCarregar(){
  if(PERF_OSHI_JOG) return Promise.resolve(PERF_OSHI_JOG);
  return contaRpc('oshi_opcoes').then(function(L){
    PERF_OSHI_JOG = (Array.isArray(L) ? L : []).filter(function(p){ return p && p.nick; });
    PERF_OSHI_JOG.forEach(function(p){
      var k = perfSlug(p.nick), old = PERF_OSHI[k];
      PERF_OSHI[k] = [p.emoji || (old && old[0]) || '⭐', p.nick, /^#[0-9a-f]{6}$/i.test(p.cor || '') ? p.cor : (old && old[2]) || '#ff6fb5', p.time || ''];
    });
    return PERF_OSHI_JOG;
  }).catch(function(){ return null; });
}
//→perfEstiloChip
function perfCorTexto(hex){ var c = parseInt(String(hex).replace('#', ''), 16) || 0; return ((c >> 16) * .299 + ((c >> 8) & 255) * .587 + (c & 255) * .114) > 165 ? '#2c1a5e' : '#fff'; }   // texto legível sobre a cor do membro
var PERF_RANK_EMO = ['🎤', '📒', '👯', '🌟', '✨', '💎', '💖', '👑', '💫', '🎖️', '🏆', '😇'];
var PERF_KAO = ['(｡•̀ᴗ-)✧', '(≧◡≦) ♡', 'ヽ(・∀・)ﾉ', '(◕‿◕✿)', '٩(◕‿◕｡)۶', '(๑˃ᴗ˂)ﻭ', '(*˘︶˘*).｡*♡', '☆*:.｡.o(≧▽≦)o.｡.:*☆'];
var PERF_SYNC = 'brs48cr_sync';   // chave NOVA da V2.1.3 (nunca renomear)
var PERF_SYNC_STATE = 'brs48cr_sync_state';   // fila persistente de saves pendentes
function perfLer(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
function perfJSON(s){ try{ return JSON.parse(s || 'null'); }catch(e){ return null; } }
function perfData(iso){
  var loc = { pt:'pt-BR', en:'en-US', es:'es-ES', th:'th-TH', ja:'ja-JP' }[LANG] || 'pt-BR', d = new Date(iso);
  return isNaN(d) ? '' : d.toLocaleDateString(loc, { day:'2-digit', month:'2-digit', year:'numeric' });
}
function perfRot(o){ return o[1] + ' ' + tr(o[2]); }
//→perfLogo
function perfRgba(hex, a){ var c = parseInt(String(hex).replace('#', ''), 16) || 0; return 'rgba(' + (c >> 16) + ',' + ((c >> 8) & 255) + ',' + (c & 255) + ',' + a + ')'; }
// Signature 5.10: somente referências locais ao elenco oficial podem carregar sua assinatura.
 // WeakMap não viaja no JSON, não modifica avatares recebidos e não cria campos de save.
var PERF_IDENTIDADE_LOCAL = null; // só aloca no primeiro retrato oficial, nunca durante o carregamento do módulo
function perfMarcarIdentidadeLocal(c,n){
  if(!PERF_IDENTIDADE_LOCAL)PERF_IDENTIDADE_LOCAL=new WeakMap();
  PERF_IDENTIDADE_LOCAL.set(c,n);
}
function perfIdentidadeOficial(src){
  if(!src || typeof src!=='object')return '';
  var n=PERF_IDENTIDADE_LOCAL&&PERF_IDENTIDADE_LOCAL.get(src);
  if(n)return n;
  if(typeof CH!=='undefined'&&Array.isArray(CH)){
    var idx=CH.indexOf(src);if(idx>=0&&idx<3)return ['Tsu','Lirika','Pati'][idx];
  }
  if(typeof HUB_TRIO_DRAW_CHARS!=='undefined'&&typeof HUB_TRIO!=='undefined'){
    var i=HUB_TRIO_DRAW_CHARS.indexOf(src),m=HUB_TRIO[i];
    if(i>=0&&m&&m[0]>=0&&m[0]<3)return ['Tsu','Lirika','Pati'][m[0]];
  }
  return '';
}
function perfCopiarCharOficial(src){
  var c=JSON.parse(JSON.stringify(src||{})),n=perfIdentidadeOficial(src);
  if(n)perfMarcarIdentidadeLocal(c,n);
  return c;
}
function perfChar(av){
  var c = {}, src = (av && av.c && typeof av.c === 'object') ? av.c : {}, k;
  for(k in PERF_BASE) c[k] = PERF_BASE[k];
  PERF_CAMPOS.forEach(function(f){
    var v = src[f];
    if(f === 'streak') c.streak = !!v;
    else if(/^(hair|hair2|lado2|skin|eye|outcol|legcol)$/.test(f)){ if(typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)) c[f] = v; }
    else if(f === 'baixo'){ if(v === 'saia' || v === 'bermuda') c.baixo = v; }   // saia ou bermuda; vazio = padrão da roupa
    else if(typeof v === 'string' && v.length <= 16) c[f] = v;
  });
  var oficial=typeof perfIdentidadeOficial==='function'?perfIdentidadeOficial(src):'';
  if(oficial){c.n=oficial;perfMarcarIdentidadeLocal(c,oficial);}
  c.img = c.hair;
  return c;
}
function perfAvAtual(extra){   // o seu Idol de agora (personagem 3, com o Item escolhido)
  var c = {}; PERF_CAMPOS.forEach(function(f){ c[f] = CU[f]; });
  var av = { v:1, c:c, a:accSel || '', visual:'', pose:'v', expr:2, fundo:'basico', admin_visual_rev:+(perfLer('brs48cr_visual_rev')||0) };
  for(var k in (extra || {})) av[k] = extra[k];
  return av;
}
function perfLojaInfo(k){ if(!PERF_LOJA || !k) return null;   // o drawChar pode rodar antes deste módulo carregar
  for(var i = 0; i < PERF_LOJA.length; i++) if(PERF_LOJA[i][0] === k) return PERF_LOJA[i]; return null; }
// Chamada dentro do drawChar, na lista das roupas. Devolve true se a roupa é da lojinha (e desenha).
function perfRoupaLoja(roupa, c, x, y, cor, E, T){
  if(!perfLojaInfo(roupa)) return false;
  var branco = !cor || /^#?f{6}$/i.test(cor), i;
  if(roupa === 'brasil'){   // camisa canarinho, gola verde, short azul
    g.fillStyle = '#ffdf00'; g.fillRect(x + 4, y + 22, 22, 11);
    g.fillStyle = '#009c3b'; T([x + 10, y + 22, x + 20, y + 22, x + 15, y + 27]); g.fillRect(x + 4, y + 22, 3, 3); g.fillRect(x + 23, y + 22, 3, 3);
    g.fillStyle = '#ffdf00'; T([x + 12, y + 22, x + 18, y + 22, x + 15, y + 25]);
    g.fillStyle = '#002776'; E(x + 20, y + 26.5, 1.8, 1.8); g.fillStyle = '#fff'; g.fillRect(x + 19.6, y + 26, .9, .9);
    g.fillStyle = '#009c3b'; g.fillRect(x + 4, y + 31, 22, 1.4);
    g.fillStyle = '#002776'; g.fillRect(x + 6, y + 32, 18, 5.5); g.fillStyle = '#fff'; g.fillRect(x + 6, y + 32, 1.4, 5.5); g.fillRect(x + 22.6, y + 32, 1.4, 5.5);
  } else if(roupa === 'tailandia'){ // mesmo molde Brasil; faixas da bandeira tailandesa
    g.fillStyle='#a51931';g.fillRect(x+4,y+22,22,11);
    g.fillStyle='#f4f5f8';g.fillRect(x+4,y+24,22,2);
    g.fillStyle='#2d2a4a';g.fillRect(x+4,y+26,22,4);
    g.fillStyle='#f4f5f8';g.fillRect(x+4,y+30,22,2);
    g.fillStyle='#a51931';g.fillRect(x+4,y+32,22,1);
    g.fillStyle='#2d2a4a';T([x+10,y+22,x+20,y+22,x+15,y+27]);
    g.fillStyle='#fff';T([x+12,y+22,x+18,y+22,x+15,y+25]);
    g.fillStyle='#2d2a4a';g.fillRect(x+6,y+33,18,4.5);
    g.fillStyle='#f4f5f8';g.fillRect(x+6,y+33,1.4,4.5);g.fillRect(x+22.6,y+33,1.4,4.5);
  } else if(roupa === 'indonesia'){ // mesmo molde Brasil/Tailândia; bandeira da Indonésia (vermelho sobre branco)
    g.fillStyle='#ce1126';g.fillRect(x+4,y+22,22,5.5);
    g.fillStyle='#f4f5f8';g.fillRect(x+4,y+27.5,22,5.5);
    g.fillStyle='#ce1126';g.fillRect(x+4,y+31.6,22,1.4);
    g.fillStyle='#f4f5f8';T([x+10,y+22,x+20,y+22,x+15,y+27]);
    g.fillStyle='#ce1126';T([x+12,y+22,x+18,y+22,x+15,y+25]);
    g.fillStyle='#ce1126';E(x+20,y+30,1.6,1.6);g.fillStyle='#fff';g.fillRect(x+19.6,y+29.6,.8,.8);
    g.fillStyle='#ce1126';g.fillRect(x+6,y+33,18,4.5);
    g.fillStyle='#f4f5f8';g.fillRect(x+6,y+33,1.4,4.5);g.fillRect(x+22.6,y+33,1.4,4.5);
  } else if(roupa === 'hipster'){   // Hippie: camiseta tie-dye (na cor escolhida), colete de franjas, calça jeans com florzinha e faixa na testa
    var td = branco ? '#ff9ccd' : cor;
    g.fillStyle = '#4f74b8'; g.fillRect(x + 7, y + 32, 7.5, 9.5); g.fillRect(x + 15.5, y + 32, 7.5, 9.5); g.fillRect(x + 7, y + 32, 16, 3);
    g.fillStyle = '#86a6dd'; g.fillRect(x + 14.5, y + 34, 1, 7.5);
    g.fillStyle = '#ffe14d'; for(i = 0; i < 5; i++) E(x + 19 + Math.cos(i * 1.2566) * 1.2, y + 37.5 + Math.sin(i * 1.2566) * 1.2, .9, .9); g.fillStyle = '#ff6fb5'; E(x + 19, y + 37.5, .7, .7);
    g.fillStyle = td; g.fillRect(x + 7, y + 22, 16, 11);
    [['#ffe14d', 11, 25, 3], ['#4dd8ff', 18, 27, 2.6], ['#b6ff3b', 13, 30, 2.4], ['#fff', 16, 24, 1.4]].forEach(function(b2){ g.fillStyle = b2[0]; g.globalAlpha = .75; E(x + b2[1], y + b2[2], b2[3], b2[3] * .8); });
    g.globalAlpha = 1;
    g.fillStyle = '#a0673a'; g.fillRect(x + 4, y + 22, 6, 10); g.fillRect(x + 20, y + 22, 6, 10);
    g.fillStyle = '#c98b55'; for(i = 0; i < 4; i++){ g.fillRect(x + 4.3 + i * 1.5, y + 32, .7, 3); g.fillRect(x + 20.3 + i * 1.5, y + 32, .7, 3); }
    g.fillStyle = '#7a4a2a'; g.fillRect(x + 9.4, y + 22, .8, 10); g.fillRect(x + 19.8, y + 22, .8, 10);
    perfAntena = 'boho';
  } else if(roupa === 'rock'){   // camiseta com raio (na cor escolhida), jaqueta de couro com tachinhas e calça preta rasgada com corrente
    g.fillStyle = '#1b1a24'; g.fillRect(x + 7, y + 32, 7.5, 9.5); g.fillRect(x + 15.5, y + 32, 7.5, 9.5); g.fillRect(x + 7, y + 32, 16, 3);
    g.fillStyle = c.skin; g.fillRect(x + 9, y + 37, 3, 1); g.fillRect(x + 18, y + 38, 3, 1);
    g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(x + 9, y + 36.4, 3, .5); g.fillRect(x + 18, y + 37.4, 3, .5);
    g.fillStyle = branco ? '#ff3d7f' : cor; g.fillRect(x + 8, y + 22, 14, 10);
    g.fillStyle = '#ffe14d'; T([x + 16, y + 23, x + 12, y + 28, x + 15, y + 28, x + 13, y + 32, x + 18, y + 26, x + 15, y + 26]);
    g.fillStyle = '#1f1d2b'; g.fillRect(x + 4, y + 22, 6, 12); g.fillRect(x + 20, y + 22, 6, 12);
    g.fillStyle = '#3a3650'; T([x + 8, y + 22, x + 11, y + 22, x + 9, y + 27]); T([x + 22, y + 22, x + 19, y + 22, x + 21, y + 27]);
    g.fillStyle = '#d7dbe4'; [[5, 23], [7, 23], [23, 23], [25, 23], [5, 26], [25, 26]].forEach(function(s2){ g.fillRect(x + s2[0] - .5, y + s2[1] - .5, 1, 1); });
    g.strokeStyle = '#d7dbe4'; g.lineWidth = .7; g.beginPath(); g.moveTo(x + 9, y + 33); g.quadraticCurveTo(x + 13, y + 37, x + 20, y + 34); g.stroke();
  } else if(roupa === 'decora'){   // vestido-moletom (na cor escolhida), saia de camadas arco-íris e adesivos
    var cam = ['#4dd8ff', '#b6ff3b', '#ffe14d'];   // saia de camadas por baixo do vestido (de baixo para cima)
    cam.forEach(function(cc, j){ var k = 2 - j; g.fillStyle = cc; T([x + 5 - k, y + 31 + k * 2, x + 25 + k, y + 31 + k * 2, x + 26 + k, y + 34.5 + k * 2, x + 4 - k, y + 34.5 + k * 2]); });
    g.fillStyle = branco ? '#ff9ccd' : cor; g.fillRect(x + 4, y + 22, 22, 11);
    g.fillStyle = 'rgba(255,255,255,.55)'; g.fillRect(x + 4, y + 32.2, 22, .8);
    g.fillStyle = '#ff4f9a'; T([x + 15, y + 23.5, x + 11, y + 21.5, x + 11, y + 25.5]); T([x + 15, y + 23.5, x + 19, y + 21.5, x + 19, y + 25.5]); E(x + 15, y + 23.5, 1.2, 1.2);
    [['#ffe14d', 7, 27], ['#4dd8ff', 21, 28], ['#b6ff3b', 12, 30], ['#9b30d9', 18, 30], ['#fff', 23, 25]].forEach(function(s){ g.fillStyle = s[0]; g.fillRect(x + s[1], y + s[2], 2, 2); });
    g.fillStyle = '#fff'; g.fillRect(x + 7.5, y + 27.5, 1, 1);
  } else if(roupa === 'alienfan'){   // macacão verde com manchinhas, gola prateada e um disquinho na barriga
    g.fillStyle = '#86e04a'; g.fillRect(x + 4, y + 22, 22, 15);
    g.fillStyle = '#5fb534'; E(x + 7, y + 26, 1.6, 1.2); E(x + 23, y + 30, 1.8, 1.3); E(x + 9, y + 34, 1.4, 1); E(x + 21, y + 24.5, 1.2, 1);
    g.fillStyle = '#d7dbe4'; g.fillRect(x + 9, y + 22, 12, 1.6);
    g.fillStyle = '#7dd3fc'; E(x + 15, y + 28.4, 2.2, 1.6); g.fillStyle = '#9ca3af'; E(x + 15, y + 29.6, 4.4, 1.3);
    g.fillStyle = '#ffe14d'; g.fillRect(x + 12.4, y + 29.3, .8, .8); g.fillRect(x + 16.8, y + 29.3, .8, .8);
    perfAntena = 'alien';
  } else if(roupa === 'happi'){   // happi azul-índigo com gola branca, faixa (na cor escolhida) e ondinhas na barra
    g.fillStyle = '#1e3a8a'; g.fillRect(x + 4, y + 22, 22, 14);
    g.fillStyle = '#fff'; T([x + 8, y + 22, x + 11, y + 22, x + 15, y + 30, x + 13, y + 30]); T([x + 22, y + 22, x + 19, y + 22, x + 15, y + 30, x + 17, y + 30]);
    g.fillStyle = branco ? '#e0303a' : cor; g.fillRect(x + 4, y + 29.5, 22, 2.4);
    g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = .7;
    for(i = 0; i < 4; i++){ g.beginPath(); g.arc(x + 7 + i * 5.3, y + 35.5, 2.2, Math.PI, 0); g.stroke(); }
    g.fillStyle = '#f8fafc'; g.fillRect(x + 7, y + 36, 16, 2);
    perfAntena = 'hachi';
  } else if(roupa === 'gingham'){   // camisa xadrez vichy (na cor escolhida), gravatinha, suspensórios e bermuda
    var gc = branco ? '#e0303a' : cor;
    g.fillStyle = '#fff'; g.fillRect(x + 4, y + 22, 22, 11);
    g.fillStyle = perfRgba(gc, .45); for(i = 0; i < 6; i++){ g.fillRect(x + 4 + i * 4, y + 22, 2, 11); g.fillRect(x + 4, y + 22.5 + i * 2, 22, 1); }
    g.fillStyle = '#fff'; T([x + 10, y + 22, x + 15, y + 22, x + 12.5, y + 25]); T([x + 20, y + 22, x + 15, y + 22, x + 17.5, y + 25]);
    g.fillStyle = '#1b2a5e'; g.fillRect(x + 8, y + 22, 1.6, 11); g.fillRect(x + 20.4, y + 22, 1.6, 11);
    T([x + 15, y + 24, x + 12.5, y + 22.8, x + 12.5, y + 25.2]); T([x + 15, y + 24, x + 17.5, y + 22.8, x + 17.5, y + 25.2]);
    g.fillRect(x + 6, y + 32, 18, 5.5); g.fillStyle = '#2a3f8a'; g.fillRect(x + 6, y + 36.3, 18, 1.2);
  } else if(roupa === 'disco'){   // colete dourado de lantejoulas, golão branco e calça boca de sino (na cor escolhida)
    g.fillStyle = '#fff'; g.fillRect(x + 8, y + 22, 14, 10);
    g.fillStyle = '#f5b400'; g.fillRect(x + 4, y + 22, 6, 11); g.fillRect(x + 20, y + 22, 6, 11);
    g.fillStyle = '#fff3a8'; for(i = 0; i < 4; i++){ g.fillRect(x + 5 + (i % 2) * 2, y + 23.5 + i * 2.4, 1, 1); g.fillRect(x + 22 + (i % 2) * 2, y + 24.5 + i * 2.4, 1, 1); }
    g.fillStyle = '#fff'; T([x + 9, y + 22, x + 15, y + 23, x + 9, y + 27]); T([x + 21, y + 22, x + 15, y + 23, x + 21, y + 27]);
    g.fillStyle = '#ff6fb5'; E(x + 15, y + 26, 1.4, 1.4); g.fillStyle = '#4dd8ff'; E(x + 15, y + 29, 1.2, 1.2);
    g.fillStyle = branco ? '#ff6fb5' : cor;
    T([x + 6, y + 32, x + 15, y + 32, x + 14.5, y + 42, x + 3.5, y + 42]); T([x + 15, y + 32, x + 24, y + 32, x + 26.5, y + 42, x + 15.5, y + 42]);
    g.fillStyle = '#ffe14d'; g.fillRect(x + 6, y + 31.6, 18, 1.4);
  } else if(roupa === 'pijama'){   // Pajama Drive: pijama listrado (na cor escolhida), botões e touca de dormir
    var pj = branco ? '#a8d8ff' : cor;
    g.fillStyle = pj; g.fillRect(x + 7, y + 32, 7.5, 9.5); g.fillRect(x + 15.5, y + 32, 7.5, 9.5); g.fillRect(x + 7, y + 32, 16, 3); g.fillRect(x + 4, y + 22, 22, 11);
    g.fillStyle = 'rgba(255,255,255,.7)'; for(i = 0; i < 6; i++){ g.fillRect(x + 5 + i * 4, y + 22, 1.2, 11); }
    for(i = 0; i < 4; i++){ g.fillRect(x + 8.5 + i * 4, y + 33, 1.2, 8.5); }
    g.fillStyle = '#fff'; T([x + 10, y + 22, x + 15, y + 22, x + 12, y + 25.5]); T([x + 20, y + 22, x + 15, y + 22, x + 18, y + 25.5]);
    g.fillStyle = '#ffe14d'; [26, 28.5, 31].forEach(function(by){ E(x + 15, y + by, .8, .8); });
    g.fillStyle = perfRgba('#1b2a5e', .5); g.fillRect(x + 14.5, y + 25, 1, 8);
    perfAntena = 'touca';
  } else if(roupa === 'technopop'){   // jaqueta prateada com linhas de neon (na cor escolhida) e calça preta
    var nc = branco ? '#4dd8ff' : cor;
    g.drawImage(charDrawStaticAssets().technopop.canvas,x+4,y+22,22,11);
    g.fillStyle = '#1f2937'; T([x + 11, y + 22, x + 19, y + 22, x + 15, y + 29]);
    g.strokeStyle = nc; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 5, y + 31); g.lineTo(x + 11, y + 25); g.moveTo(x + 25, y + 31); g.lineTo(x + 19, y + 25); g.moveTo(x + 4, y + 33); g.lineTo(x + 26, y + 33); g.stroke();
    g.fillStyle = '#ff6fb5'; g.fillRect(x + 22, y + 23.5, 2, 2);
    g.fillStyle = '#111827'; g.fillRect(x + 7, y + 33, 16, 8);
    g.fillStyle = nc; g.fillRect(x + 7, y + 33.5, 1, 7.5); g.fillRect(x + 22, y + 33.5, 1, 7.5);
  } else if(typeof temaRoupa === 'function') temaRoupa(roupa, c, x, y, cor, E, T, branco);   // roupas da temporada (módulo de temas)
  return true;
}
function perfLojaDono(){   // roupas da lojinha que você comprou (guardadas também no visual do Idol para o menu)
  return (Array.isArray(CU.loja) ? CU.loja : []).filter(function(k){ return !!perfLojaInfo(k); });
}
function perfLojaOpcoes(){   // coloca as roupas compradas na lista "Roupa" do menu (vale para todas as personagens)
  var s = $('cout'); if(!s) return;
  [].slice.call(s.querySelectorAll('option[data-loja]')).forEach(function(o){ s.removeChild(o); });
  perfLojaDono().forEach(function(k){
    var it = perfLojaInfo(k), o = document.createElement('option');
    o.value = k; o.setAttribute('data-r', '0'); o.setAttribute('data-loja', '1'); o.textContent = '🛍️ ' + tr(it[2]); s.appendChild(o);
  });
  s.value = (sel === 3 ? CU.out : CH[sel].out) || '';
}
// Sombreamento das roupas (chamado pelo drawChar depois de todas as roupas): luz à esquerda, sombra à direita,
// sombrinha embaixo da gola e na cintura — a mesma lógica de degradê do cabelo, para nada ficar "chapado".
function roupaSombra(x, y){
  var assets=charDrawStaticAssets();
  g.drawImage(assets.clothHorizontal,x+5,y+22,20,11);
  g.fillStyle='rgba(40,10,70,.18)';g.fillRect(x+10,y+22,10,1.3);
  g.drawImage(assets.clothVertical,x+5,y+29,20,4);
}
function perfFundoGradiente(x, W2, H2, key, vertical, stops){
  var id = String(key) + '|' + W2 + 'x' + H2, cv = PERF_BG_TEXTURE_CACHE.get(id);
  if(!PERF_BG_TEXTURE_CACHE.has(id)){
    cv = null;
    try{
      if(typeof document !== 'undefined' && document.createElement){
        var tmp = document.createElement('canvas');
        tmp.width = Math.max(1, Math.ceil(W2)); tmp.height = Math.max(1, Math.ceil(H2));
        var ctx = tmp.getContext('2d');
        if(ctx){
          var grad = vertical ? ctx.createLinearGradient(0, 0, 0, tmp.height) : ctx.createLinearGradient(0, 0, tmp.width, 0);
          for(var si = 0; si < stops.length; si++) grad.addColorStop(stops[si][0], stops[si][1]);
          ctx.fillStyle = grad; ctx.fillRect(0, 0, tmp.width, tmp.height); cv = tmp;
        }
      }
    }catch(e){ cv = null; }
    if(PERF_BG_TEXTURE_CACHE.size >= 32) PERF_BG_TEXTURE_CACHE.delete(PERF_BG_TEXTURE_CACHE.keys().next().value);
    PERF_BG_TEXTURE_CACHE.set(id, cv);
  }
  if(cv){ x.drawImage(cv, 0, 0, W2, H2); return; }
  var fallback = vertical ? x.createLinearGradient(0, 0, 0, H2) : x.createLinearGradient(0, 0, W2, 0);
  for(var fi = 0; fi < stops.length; fi++) fallback.addColorStop(stops[fi][0], stops[fi][1]);
  x.fillStyle = fallback; x.fillRect(0, 0, W2, H2);
}
function perfBrilhos(x, W2, H2, cor, n, seed, t){
  x.save(); x.fillStyle = cor;
  for(var i = 0; i < n; i++){
    var sx = cenaHash(i * 7 + (seed || 0)) * W2, sy = cenaHash(i * 13 + 5 + (seed || 0)) * H2, r = (1 + cenaHash(i * 3) * 1.6) * W2 / 320;
    x.globalAlpha = Math.max(.1, .45 + cenaHash(i * 17) * .5 + (t ? Math.sin(t * .05 + i * 1.7) * .35 : 0)); x.beginPath(); x.arc(sx, sy, r, 0, 7); x.fill();
  }
  x.restore();
}
function perfEnfeites(x, W2, H2, cores, n, seed, t, alfa){   // ✦ e ♡ espalhados, piscando
  var u = W2 / 320;
  x.save(); x.textAlign = 'center'; x.textBaseline = 'middle';
  for(var i = 0; i < n; i++){
    var sx = (.06 + cenaHash(i * 5 + seed) * .88) * W2, sy = (.06 + cenaHash(i * 11 + seed + 3) * .62) * H2, s = (9 + cenaHash(i * 19 + seed) * 8) * u;
    x.globalAlpha = (alfa || .55) * (t ? .55 + .45 * Math.sin(t * .045 + i * 2.1) : 1);
    x.fillStyle = cores[i % cores.length]; x.font = '900 ' + Math.round(s) + 'px sans-serif';
    x.fillText(i % 3 === 1 ? '♡' : i % 3 === 2 ? '★' : '✦', sx, sy);
  }
  x.restore();
}
// tema escuro do site (botão de tema ou o do aparelho): usado pelos fundos desenhados que seguem o tema
function perfTemaEscuro(){
  try{ var th = document.documentElement.getAttribute('data-theme'); if(th) return th === 'dark';
    return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches); }catch(e){ return false; }
}
function perfFundo(x, W2, H2, f, cor, t){
  if(!f) return;
  if(f==='cafe'){ duoFundoDesenhar(x,W2,H2,'cafe',t||0,cor); return; } // reutiliza a arte do Moon⭐Duo!
  var u = W2 / 320, gr, i;
  t = t || 0;
  if(f === 'basico'){   // pastel nas cores do TsuLiPa (roxo → verde → azul), com bolinhas
    // 17/11: no modo escuro o fundo básico segue o tema (noite nas mesmas cores), em vez do pastel claro fixo
    var escuroB = perfTemaEscuro();
    if(escuroB) perfFundoGradiente(x, W2, H2, 'perfil:basico-escuro', false, [[0, '#2c1656'], [.5, '#1c3030'], [1, '#1a2556']]);
    else perfFundoGradiente(x, W2, H2, 'perfil:basico', false, [[0, '#f1e3ff'], [.5, '#e9fbe0'], [1, '#e1ecff']]);
    for(i = 0; i < 42; i++){
      var col = i % 7, lin = Math.floor(i / 7);
      x.fillStyle = perfRgba(PERF_TSL[(col + lin) % 3], escuroB ? .28 : .16);
      x.beginPath(); x.arc(col * W2 / 7 + (lin % 2) * W2 / 14 + W2 / 28, lin * H2 / 6 + H2 / 12, 6 * u, 0, 7); x.fill();
    }
    perfEnfeites(x, W2, H2, PERF_TSL.concat('#ff6fb5'), 7, 2, t, .5);
    var ch = x.createLinearGradient(0, H2 * .86, 0, H2); ch.addColorStop(0, 'rgba(155,48,217,.12)'); ch.addColorStop(1, 'rgba(65,105,225,.2)');
    x.fillStyle = ch; x.fillRect(0, H2 * .88, W2, H2 * .12);
    var fx0 = x.createLinearGradient(0, 0, W2, 0); fx0.addColorStop(0, '#9b30d9'); fx0.addColorStop(.5, '#5cc72c'); fx0.addColorStop(1, '#4169e1');
    x.fillStyle = fx0; x.globalAlpha = .55; x.fillRect(0, H2 * .88, W2, 2.5 * u); x.globalAlpha = 1;
  } else if(f === 'palco'){
    perfFundoGradiente(x, W2, H2, 'perfil:palco', true, [[0, '#1a0933'], [.62, '#4a1f8a'], [1, '#7b3ff0']]);
    perfBrilhos(x, W2, H2 * .55, '#fff', 18, 3, t);
    x.save(); x.globalCompositeOperation = 'lighter';
    [[.18, 'rgba(255,111,181,.26)'], [.5, 'rgba(255,255,255,.2)'], [.82, 'rgba(77,216,255,.24)']].forEach(function(h, j){
      var lg = x.createLinearGradient(0, 0, 0, H2 * .9); lg.addColorStop(0, h[1]); lg.addColorStop(1, 'rgba(0,0,0,0)');
      var bx = W2 * (.5 + (h[0] - .5) * .35) + Math.sin(t * .02 + j * 2) * 18 * u;
      x.fillStyle = lg; x.beginPath(); x.moveTo(W2 * h[0] - 8 * u, 0); x.lineTo(W2 * h[0] + 8 * u, 0); x.lineTo(bx + 52 * u, H2 * .9); x.lineTo(bx - 52 * u, H2 * .9); x.closePath(); x.fill();
    });
    x.restore();
    var conf = ['#9b30d9', '#b6ff3b', '#4169e1', '#ff6fb5', '#ffe14d'];   // confete caindo
    for(i = 0; i < 16; i++){
      var cy = ((cenaHash(i * 3 + 1) * H2 * .9) + t * (.6 + cenaHash(i) * .6) * u) % (H2 * .88);
      x.save(); x.translate(cenaHash(i * 7 + 2) * W2, cy); x.rotate(t * .03 + i); x.fillStyle = conf[i % 5]; x.globalAlpha = .8; x.fillRect(-2.5 * u, -1.2 * u, 5 * u, 2.4 * u); x.restore();
    }
    x.fillStyle = '#2c1a5e'; x.fillRect(0, H2 * .88, W2, H2 * .12);
    var fx = x.createLinearGradient(0, 0, W2, 0); fx.addColorStop(0, '#9b30d9'); fx.addColorStop(.5, '#4169e1'); fx.addColorStop(1, '#b6ff3b');
    x.fillStyle = fx; x.fillRect(0, H2 * .88, W2, 3 * u);
  } else if(f === 'oshi'){
    var oshiTop = petMix(cor, 1, .82), oshiBottom = petMix(cor, 1, .55);
    perfFundoGradiente(x, W2, H2, 'perfil:oshi:' + cor + ':' + oshiTop + ':' + oshiBottom, true, [[0, oshiTop], [1, oshiBottom]]);
    x.save(); x.globalAlpha = .12; x.strokeStyle = '#fff'; x.lineWidth = 14 * u;
    for(var d = -H2; d < W2; d += 40 * u){ x.beginPath(); x.moveTo(d, H2); x.lineTo(d + H2, 0); x.stroke(); }
    x.restore();
    for(i = 0; i < 9; i++){   // bolhas de luz (bokeh)
      var bxx = cenaHash(i * 13 + 4) * W2, byy = cenaHash(i * 17 + 1) * H2 * .8 + Math.sin(t * .02 + i) * 6 * u, br = (10 + cenaHash(i * 3) * 18) * u;
      x.fillStyle = 'rgba(255,255,255,' + (.18 + cenaHash(i) * .15) + ')'; x.beginPath(); x.arc(bxx, byy, br, 0, 7); x.fill();
    }
    perfEnfeites(x, W2, H2, ['#fff', petMix(cor, 0, .2)], 7, 5, t, .7);
    x.fillStyle = petMix(cor, 0, .15); x.globalAlpha = .25; x.fillRect(0, H2 * .9, W2, H2 * .1); x.globalAlpha = 1;
  } else if(f === 'ceu'){
    perfFundoGradiente(x, W2, H2, 'perfil:ceu', true, [[0, '#8fd0f5'], [1, '#e8f7ff']]);
    x.save(); x.globalAlpha = .4; x.lineWidth = 7 * u;   // arco-íris pastel
    ['#ff9ccd', '#ffe14d', '#b6ff3b', '#7dd3fc', '#c4a5ff'].forEach(function(cc, j){ x.strokeStyle = cc; x.beginPath(); x.arc(W2 * .5, H2 * .95, (150 - j * 7) * u, Math.PI * 1.05, Math.PI * 1.95); x.stroke(); });
    x.restore();
    x.fillStyle = 'rgba(255,255,255,.95)';
    [[.2, .22, 1], [.78, .14, .8], [.62, .42, .65]].forEach(function(n, j){
      var cx = ((W2 * n[0] + t * .25 * u * (j + 1)) % (W2 + 80 * u)) - 20 * u, cy = H2 * n[1], s = n[2] * u;
      [[-22, 4, 12], [-7, -4, 16], [12, -2, 14], [27, 5, 10], [2, 7, 13]].forEach(function(b){ x.beginPath(); x.arc(cx + b[0] * s, cy + b[1] * s, b[2] * s, 0, 7); x.fill(); });
    });
    perfEnfeites(x, W2, H2, ['#fff'], 5, 8, t, .8);
    x.fillStyle = '#9ed36a'; x.fillRect(0, H2 * .9, W2, H2 * .1);
    x.fillStyle = '#b8e986'; x.fillRect(0, H2 * .9, W2, 2.5 * u);
  } else if(f === 'noite'){
    perfFundoGradiente(x, W2, H2, 'perfil:noite', true, [[0, '#071327'], [1, '#2a3f78']]);
    var neb = x.createRadialGradient(W2 * .25, H2 * .35, 4 * u, W2 * .25, H2 * .35, 110 * u); neb.addColorStop(0, 'rgba(155,48,217,.32)'); neb.addColorStop(1, 'rgba(155,48,217,0)');
    x.fillStyle = neb; x.fillRect(0, 0, W2, H2);
    perfBrilhos(x, W2, H2 * .8, '#fff', 34, 9, t);
    var es = (t * 2.2) % 900;   // estrela cadente de vez em quando
    if(es < 90){ var ex0 = W2 * .1 + es * 2.2 * u, ey0 = H2 * .08 + es * .9 * u; var sg = x.createLinearGradient(ex0 - 30 * u, ey0 - 12 * u, ex0, ey0); sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(1, 'rgba(255,255,255,.9)'); x.strokeStyle = sg; x.lineWidth = 2 * u; x.beginPath(); x.moveTo(ex0 - 30 * u, ey0 - 12 * u); x.lineTo(ex0, ey0); x.stroke(); }
    x.fillStyle = '#fff4c2'; x.beginPath(); x.arc(W2 * .8, H2 * .18, 20 * u, 0, 7); x.fill();
    x.fillStyle = '#132552'; x.beginPath(); x.arc(W2 * .8 + 8 * u, H2 * .18 - 5 * u, 17 * u, 0, 7); x.fill();
    perfEnfeites(x, W2, H2, ['#ffe14d', '#c4a5ff', '#7dd3fc'], 5, 12, t, .6);
    x.fillStyle = '#1a2a55'; x.fillRect(0, H2 * .9, W2, H2 * .1);
  } else if(f === 'halloween'){
    perfFundoGradiente(x, W2, H2, 'perfil:halloween', true, [[0, '#2b0f45'], [.6, '#7a2f7a'], [1, '#ff8a3d']]);
    perfBrilhos(x, W2, H2 * .45, '#ffe9b0', 16, 21, t);
    var lu = x.createRadialGradient(W2 * .78, H2 * .2, 4 * u, W2 * .78, H2 * .2, 46 * u); lu.addColorStop(0, 'rgba(255,214,120,.55)'); lu.addColorStop(1, 'rgba(255,214,120,0)');
    x.fillStyle = lu; x.beginPath(); x.arc(W2 * .78, H2 * .2, 46 * u, 0, 7); x.fill();
    x.fillStyle = '#ffd27a'; x.beginPath(); x.arc(W2 * .78, H2 * .2, 22 * u, 0, 7); x.fill();
    petDrawMorcego(x, W2 * .7 + Math.sin(t * .03) * 10 * u, H2 * .22 + Math.cos(t * .04) * 5 * u, 1.7 * u, 1 + t * .3); petDrawMorcego(x, W2 * .2 + Math.cos(t * .025) * 8 * u, H2 * .14, 1.3 * u, 2.4 + t * .32); petDrawMorcego(x, W2 * .32, H2 * .3 + Math.sin(t * .03) * 6 * u, 1.1 * u, .4 + t * .35);
    x.save(); x.translate(W2 * .07, H2 * .22 + Math.sin(t * .05) * 5 * u); x.scale(u, u);   // fantasminha fofo (no alto, nunca atrás de quem está na foto)
    x.fillStyle = 'rgba(255,255,255,.88)'; x.beginPath(); x.arc(0, 0, 11, Math.PI, 0); x.lineTo(11, 12); for(i = 0; i < 4; i++) x.quadraticCurveTo(8.25 - i * 5.5, 16, 5.5 - i * 5.5, 12); x.lineTo(-11, 0); x.fill();
    x.fillStyle = '#2b0f45'; x.beginPath(); x.arc(-3.5, 0, 1.6, 0, 7); x.arc(3.5, 0, 1.6, 0, 7); x.fill(); x.fillStyle = '#ff9ccd'; x.beginPath(); x.arc(-6, 3, 1.6, 0, 7); x.arc(6, 3, 1.6, 0, 7); x.fill();
    x.restore();
    x.fillStyle = '#2a1238'; x.fillRect(0, H2 * .9, W2, H2 * .1);
    for(i = 0; i < 9; i++){ var px = i * W2 / 8; x.fillRect(px - 2 * u, H2 * .8, 4 * u, H2 * .1); x.beginPath(); x.moveTo(px - 3 * u, H2 * .8); x.lineTo(px, H2 * .77); x.lineTo(px + 3 * u, H2 * .8); x.fill(); }
    x.fillRect(0, H2 * .83, W2, 2.5 * u);
    petDrawAbobora(x, W2 * .1, H2 * .95, 2.1 * u, true); petDrawAbobora(x, W2 * .9, H2 * .95, 1.7 * u, true);
  } else if(f === 'temporada'){   // muda com o tema do momento; fora de temporada vira o Básico (no aniversário da pessoa, festa!)
    var tk = temaPerfil();
    if(tk === 'halloween') perfFundo(x, W2, H2, 'halloween', cor, t);
    else if(tk && typeof temaFundo === 'function') temaFundo(x, W2, H2, tk, t);
    else perfFundo(x, W2, H2, 'basico', cor, t);
  }
}
function perfCharContorno(x, tx, ty, sc, desenha){
  // k = escala que o canvas de destino já usa (zoom do aparelho, twNitido, petDpr). O boneco é desenhado no
  // auxiliar com essa resolução; antes saía na resolução lógica e era ampliado (borrado no computador). Sem escala, k = 1.
  var k = 1; try{ var mt = x.getTransform && x.getTransform(); if(mt) k = Math.min(4, Math.max(1, Math.hypot(mt.a, mt.b))); }catch(e){}
  var ux = -42, uy = -28, uw = 130, uh = 80, w = Math.ceil(uw * sc * k), h = Math.ceil(uh * sc * k);
  if(!perfCvC) perfCvC = document.createElement('canvas');
  var cv = perfCvC;
  if(cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; }
  var og = g, cx2 = cv.getContext('2d'), wasPortrait = perfCharPortrait;
  cx2.setTransform(1, 0, 0, 1, 0, 0); cx2.clearRect(0, 0, w, h);
  try{ perfCharPortrait = true; g = cx2; g.save(); g.scale(sc * k, sc * k); g.translate(-ux, -uy); desenha(); g.restore(); }
  finally{ perfCharPortrait = wasPortrait; g = og; charPose = ''; perfAntena = ''; }
  x.save();
  // shadowBlur não segue a escala do contexto: multiplicar por k mantém o mesmo contorno de sempre.
  // (canvas ajustado pelo tw-nitidez.js já corrige a sombra sozinho: aí não multiplica de novo)
  var ks = x.canvas && x.canvas.__twA ? 1 : k;
  x.shadowColor = 'rgba(64,24,120,.32)'; x.shadowBlur = 9 * sc / 3.5 * ks; x.drawImage(cv, 0, 0, w, h, tx + ux * sc, ty + uy * sc, uw * sc, uh * sc);
  x.shadowColor = 'rgba(64,24,120,.55)'; x.shadowBlur = 2.2 * sc / 3.5 * ks; x.drawImage(cv, 0, 0, w, h, tx + ux * sc, ty + uy * sc, uw * sc, uh * sc);
  x.restore();
}
function perfPetDoAvatar(av){   // pet guardado no avatar (só chaves conhecidas)
  var p = av && av.pet; if(!p || typeof p !== 'object' || !PET_SP[p.k]) return null;
  return { k:p.k, acc: typeof p.acc === 'string' ? p.acc : '', bochecha: !!p.bochecha, cfg: (p.cfg && typeof p.cfg === 'object') ? p.cfg : null };
}
function perfDesenharPetEm(x, p, px, py, s, t){   // desenha um pet com o acessório dele (sem mexer no save de verdade)
  if(!p)return;
  try{drawPet(x,p.k==='meu'?(p.cfg||PET_MK_DEF):p.k,px,py,s,t||0,'feliz',p);}catch(e){}
}
function perfHaloTextura(x, cx, cy, r, cor){
  var raio = Math.max(1, Math.ceil(r)), id = String(cor) + '|' + raio, cv = PERF_HALO_TEXTURE_CACHE.get(id);
  if(!PERF_HALO_TEXTURE_CACHE.has(id)){
    cv = null;
    try{
      if(typeof document !== 'undefined' && document.createElement){
        var tmp = document.createElement('canvas'), pad = 2, tam = raio * 2 + pad * 2;
        tmp.width = tam; tmp.height = tam;
        var ctx = tmp.getContext('2d');
        if(ctx){
          var grad = ctx.createRadialGradient(tam / 2, tam / 2, 2, tam / 2, tam / 2, raio);
          grad.addColorStop(0, cor); grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad; ctx.fillRect(0, 0, tam, tam); cv = tmp;
        }
      }
    }catch(e){ cv = null; }
    if(PERF_HALO_TEXTURE_CACHE.size >= 24) PERF_HALO_TEXTURE_CACHE.delete(PERF_HALO_TEXTURE_CACHE.keys().next().value);
    PERF_HALO_TEXTURE_CACHE.set(id, cv);
  }
  if(cv){ var half = raio + 2; x.drawImage(cv, cx - half, cy - half); return; }
  var fallback = x.createRadialGradient(cx, cy, 2, cx, cy, r);
  fallback.addColorStop(0, cor); fallback.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = fallback; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
}
// zoom = true: só o rostinho (foto redonda do perfil) · t = quadro da animação (0 = parado)
function perfDesenharIdol(x, W2, H2, av, comFundo, zoom, t, camera, comFlor){
  av = av || {}; t = t || 0;
  var vis = typeof av.visual === 'string' ? av.visual : '', rk = PERF_RANKVIS[vis] || 0, c = perfChar(av), pet = zoom ? null : perfPetDoAvatar(av);
  if(/^#[0-9a-f]{6}$/i.test(av.cor || '')) c.luz = av.cor;   // lightstick na cor do perfil
  if(comFundo !== false) perfFundo(x, W2, H2, typeof av.fundo === 'string' ? av.fundo : 'basico', c.hair, t);
  var big = vis === 'mega' && !zoom, sc, chao, tx, ty;
  if(zoom){ sc = H2 / 46; tx = W2 / 2 - 15 * sc; ty = H2 * .5 - 10 * sc; chao = ty + 44 * sc; }   // rostinho: da coroa até os ombros
  else { sc = H2 / (big ? 68 : 82); chao = H2 * (big ? .95 : .9); tx = W2 / 2 - 15 * sc - (pet ? 10 * sc : 0); ty = chao - 44 * sc; }
  if(camera){
    // Medido na tela (unidades a partir de tx/ty): cabelo y≈-5,5, boca ≈17, ombros ≈22, bermuda ≈33,
    // pés ≈42 e sombra ≈46; largura x≈0..30. Cada enquadramento mostra uma faixa desse mesmo desenho:
    // rosto = cabelo até o peito · meio = até o quadril · inteiro = dos pés à cabeça (com o Pet).
    var aceno = av.pose === 'tchau' || av.pose === 'v';
    // A mão baixa chega a y=33, e o punho do objeto continua até y≈34.
    // No retrato com objeto, reserve a mesma margem para flor, microfone e lightstick.
    var faixa = camera === 'rosto' ? [-7, comFlor ? (av.pose === 'coracao' ? 32 : 34) : 27] : camera === 'meio' ? [-7, 39] : [-7, 49];
    var largura = camera === 'rosto' ? (aceno ? 44 : comFlor ? 34 : 30) : camera === 'meio' ? (aceno ? 48 : 38) : (pet ? 76 : 44);
    if(camera !== 'inteiro') pet = null; // no close o Pet fica de fora, para o Idol não encolher
    sc = Math.min(H2 * .92 / (faixa[1] - faixa[0]), W2 * .96 / largura);
    tx = W2 / 2 - (pet ? 25 : aceno ? 18.5 : 15) * sc;
    ty = (H2 - (faixa[1] - faixa[0]) * sc) / 2 - faixa[0] * sc;   // faixa centralizada na foto
    // Em retratos estreitos a largura limita o zoom. Prenda o corte ao corpo:
    // o espaço extra fica acima do cabelo, sem revelar os pés no meio-corpo.
    if(camera !== 'inteiro') ty = H2 - (faixa[1] + 2) * sc;
    chao = ty + 44 * sc;
  }
  // A câmera não desloca o corpo para fora dos limites definidos pelo enquadramento.
  // Uma fotografia histórica usa a fase gravada, não a preferência atual de quem a visualiza.
  var reduz = !camera && typeof matchMedia==='function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bob = t && !reduz ? Math.sin(t * .06) * (camera ? .32 : .85) * sc : 0; // mesma fase de duoGeo e do retrato histórico
  var cx = tx + 15 * sc, cy = ty + 22 * sc + bob, i, gira = t * .012, pulso = t ? 1 + .05 * Math.sin(t * .08) : 1;
  // sombra no chão
  x.fillStyle = 'rgba(30,10,60,.25)'; x.beginPath(); x.ellipse(cx, chao, 15 * sc * (1 - bob / sc * .04), 2.6 * sc, 0, 0, 7); x.fill();
  // efeito do visual (atrás do personagem)
  function halo(r, cor){ r *= pulso; perfHaloTextura(x, cx, cy, r, cor); }
  function estrela(sx, sy, r, cor){ x.fillStyle = cor; x.beginPath(); for(var q = 0; q < 10; q++){ var rr = q % 2 ? r * .42 : r, an = q * Math.PI / 5 - Math.PI / 2 + gira; x[q ? 'lineTo' : 'moveTo'](sx + Math.cos(an) * rr, sy + Math.sin(an) * rr); } x.closePath(); x.fill(); }
  if(vis === 'fever'){
    halo(40 * sc, 'rgba(255,132,102,.55)');
    [-2.7, -2, -1.15, -.45, .35, 2.75].forEach(function(an, j){ an += Math.sin(t * .02) * .12; estrela(cx + Math.cos(an) * 27 * sc, cy + Math.sin(an) * 20 * sc, (2.2 + (j % 2)) * sc, j % 2 ? '#ffe14d' : '#ff8fb8'); });
  } else if(vis === 'ima'){
    halo(40 * sc, 'rgba(200,162,245,.55)');
    x.save(); x.strokeStyle = 'rgba(155,48,217,.45)'; x.lineWidth = 1.2 * sc;
    for(i = 1; i <= 3; i++){ x.beginPath(); x.arc(cx, cy, (12 + ((i * 7 + t * .15) % 21)) * sc, -2.6, -.55); x.stroke(); }
    x.restore();
    for(i = 0; i < 5; i++) estrela(cx + (i - 2) * 13 * sc, cy - (25 + (i % 2) * 6 + Math.sin(t * .07 + i) * 2) * sc, 2.4 * sc, '#ffe14d');
  } else if(vis === 'mega'){
    halo(36 * sc, 'rgba(255,111,181,.6)');
  } else if(vis === 'alien'){
    var bl = x.createLinearGradient(0, 0, 0, chao); bl.addColorStop(0, 'rgba(182,255,59,.7)'); bl.addColorStop(1, 'rgba(182,255,59,.05)');
    x.fillStyle = bl; x.beginPath(); x.moveTo(cx - 14 * sc, 8 * sc); x.lineTo(cx + 14 * sc, 8 * sc); x.lineTo(cx + 24 * sc, chao); x.lineTo(cx - 24 * sc, chao); x.closePath(); x.fill();
    x.fillStyle = '#b6ff3b'; for(i = 0; i < 7; i++) x.fillRect(cx + (cenaHash(i) - .5) * 30 * sc, chao - ((cenaHash(i + 9) * (chao - 14 * sc) + t * 1.5 * sc / 3) % (chao - 14 * sc)), 1.4 * sc, 1.4 * sc);
    if(!zoom){
      x.save(); x.translate(cx + Math.sin(t * .03) * 2 * sc, 6 * sc);   // disco voador
      x.fillStyle = '#7dd3fc'; x.beginPath(); x.ellipse(0, -2 * sc, 7 * sc, 5 * sc, 0, Math.PI, 0); x.fill();
      var dg = x.createLinearGradient(0, -2 * sc, 0, 4 * sc); dg.addColorStop(0, '#e5e7eb'); dg.addColorStop(1, '#6b7280');
      x.fillStyle = dg; x.beginPath(); x.ellipse(0, 1 * sc, 17 * sc, 4.2 * sc, 0, 0, 7); x.fill();
      ['#ff6fb5', '#ffe14d', '#b6ff3b', '#4dd8ff'].forEach(function(cc, j){ x.fillStyle = cc; x.globalAlpha = t ? (Math.floor(t / 12 + j) % 2 ? 1 : .45) : 1; x.beginPath(); x.arc((j - 1.5) * 8 * sc, 1.6 * sc, 1.2 * sc, 0, 7); x.fill(); });
      x.globalAlpha = 1; x.restore();
    }
  } else if(rk >= 10){
    halo(52 * sc, rk >= 11 ? 'rgba(255,170,230,.55)' : 'rgba(255,225,120,.6)');
    if(rk >= 11){ x.save(); x.globalAlpha = .35; ['#ff6fb5', '#ffe14d', '#b6ff3b', '#4dd8ff', '#9b30d9'].forEach(function(cc, j){ x.strokeStyle = cc; x.lineWidth = 2 * sc; x.beginPath(); x.arc(cx, cy, (30 + j * 3) * sc, Math.PI * 1.08, Math.PI * 1.92); x.stroke(); }); x.restore(); }
    for(i = 0; i < 4; i++) estrela(cx - 26 * sc + i * 17 * sc, cy + Math.sin(i * 2 + t * .05) * 14 * sc - 4 * sc, 1.8 * sc, '#ffe14d');
  } else if(rk >= 7){
    for(i = 0; i < 5; i++) estrela(cx + Math.cos(i * 1.26 - .4 + gira) * 26 * sc, cy + Math.sin(i * 1.26 - .4 + gira) * 22 * sc, 1.7 * sc, '#ffe14d');
  }
  // personagem: usa o mesmo drawChar da corrida, com o visual ligado só durante o desenho
  var oS = state, oPw = pw, oDpw = dpw, oR = rankI, oSa = sash, oA = accSel, oF = frame;
  try{
    state = 'play'; dpw = null; if(t) frame = t;
    pw = vis === 'mega' ? { k:'gigante', t:300 } : (vis === 'fever' || vis === 'ima' || vis === 'alien') ? { k:vis, t:300 } : null;
    rankI = rk; sash = rk >= 7; accSel = typeof av.a === 'string' ? av.a : '';
    var ex = [0, 1, 2, 3, 4, 5, 6].indexOf(+av.expr) >= 0 ? +av.expr : 2;
    if(t && !camera && ex !== 2 && (t % 200) < 7) ex = 2;   // piscadinha de vez em quando (na animação)
    var pose = perfPoseInfo(av.pose) ? av.pose : '';
    perfCharContorno(x, tx, ty + bob, sc, function(){ charPose = pose; drawChar(c, 0, 0, 0, ex, false); });
  } finally {
    state = oS; pw = oPw; dpw = oDpw; rankI = oR; sash = oSa; accSel = oA; frame = oF; charPose = ''; perfAntena = '';
  }
  if(pet){   // o pet ao lado, flutuando
    var ps = sc * .62, px = cx + 30 * sc, py = chao - 20 * sc;
    x.fillStyle = 'rgba(30,10,60,.2)'; x.beginPath(); x.ellipse(px, chao, 9 * sc, 1.8 * sc, 0, 0, 7); x.fill();
    perfDesenharPetEm(x, pet, px, py, ps, t);
  }
  return {x:tx, y:ty + bob, scale:sc, skin:c.skin};
}
function perfFotoRedonda(cv, av, zoom){   // foto do perfil: o avatar recortado em círculo (zoom = rostinho)
  // 17/11: o rascunho nasce na escala do destino (tw-nitidez.js), senão a foto sai ampliada e borrada
  var kn = window.TW_NITIDEZ ? TW_NITIDEZ.preparar(cv) : 1;
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height;
  if(window.TW_NITIDEZ) kn = TW_NITIDEZ.escala(cv) || kn;
  var tmp = document.createElement('canvas'); tmp.width = Math.round(W2 * kn); tmp.height = Math.round(H2 * kn);
  if(av && !av.fundo){ var oficial=perfIdentidadeOficial(av.c), origem=av.c; av = JSON.parse(JSON.stringify(av)); if(oficial)av.c=perfCopiarCharOficial(origem); av.fundo = 'basico'; }   // na foto redonda sempre tem fundo
  var tx2 = tmp.getContext('2d'); tx2.scale(kn, kn);
  perfDesenharIdol(tx2, W2, H2, av, true, zoom !== false);
  x.clearRect(0, 0, W2, H2);
  x.save(); x.beginPath(); x.arc(W2 / 2, H2 / 2, W2 / 2, 0, 7); x.clip(); x.drawImage(tmp, 0, 0, W2, H2); x.restore();
}
function perfPoseInfo(k){ for(var i = 0; i < PERF_POSES.length; i++) if(PERF_POSES[i][0] === k) return PERF_POSES[i]; return null; }
// Parte de trás (antes da cabeça): chamada no começo do petPoseArms. Devolve true se a pose é uma das novas.
function perfPoseAtras(c, x, y){
  var p = charPose; if(p !== 'mic' && p !== 'banzai' && p !== 'nyan' && p !== 'luz') return false;
  g.save(); g.lineCap = 'round'; g.strokeStyle = c.skin; g.fillStyle = c.skin; g.lineWidth = 4;
  if(p === 'mic' || p === 'luz') g.fillRect(x + 1, y + 24, 4, 9);   // braço esquerdo normal
  if(p === 'banzai'){
    [[3, -3.5], [27, 33.5]].forEach(function(b){
      g.strokeStyle = c.skin; g.lineWidth = 4; g.beginPath(); g.moveTo(x + b[0], y + 25.5); g.lineTo(x + b[1], y + 13.5); g.stroke();
      g.fillStyle = c.skin; g.beginPath(); g.arc(x + b[1], y + 12.5, 2.4, 0, 7); g.fill();
      g.strokeStyle = '#ffe14d'; g.lineWidth = .9; var d = b[1] < 15 ? -1 : 1;
      g.beginPath(); g.moveTo(x + b[1] + d * 3, y + 9); g.lineTo(x + b[1] + d * 5.5, y + 6.5); g.moveTo(x + b[1] + d * 4, y + 12); g.lineTo(x + b[1] + d * 7, y + 11.5); g.moveTo(x + b[1], y + 8.5); g.lineTo(x + b[1], y + 5.5); g.stroke();
    });
  } else if(p === 'luz'){
    var cor = c.luz || c.hair || '#ff6fb5';   // lightstick: cor do perfil, senão a do cabelo
    g.beginPath(); g.moveTo(x + 27, y + 25.5); g.lineTo(x + 33, y + 16.5); g.stroke();
    g.save(); g.shadowColor = cor; g.shadowBlur = 6; g.strokeStyle = cor; g.lineWidth = 2.8;
    g.beginPath(); g.moveTo(x + 34, y + 13.5); g.lineTo(x + 37, y + 2); g.stroke(); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 34.2, y + 12.5); g.lineTo(x + 36.8, y + 3); g.stroke();
    g.strokeStyle = '#2a2438'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x + 33, y + 18); g.lineTo(x + 34, y + 13.8); g.stroke();
    g.fillStyle = c.skin; g.beginPath(); g.arc(x + 33.4, y + 16, 2.3, 0, 7); g.fill();
  }
  g.restore();
  g.fillStyle = c.skin;
  return true;
}
// Parte da frente (depois do rosto): chamada no fim do drawChar (poses e anteninhas da fantasia de alien)
function perfTri(a, b, c2, d, e, f){ g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.lineTo(e, f); g.closePath(); g.fill(); }
function perfPoseFrente(c, x, y){
  var p = charPose, ant = perfAntena; perfAntena = false;
  if(p !== 'mic' && p !== 'nyan' && !ant) return;
  g.save(); g.translate(0, 4);   // o rosto do drawChar fica 4 px acima; aqui volta para a mesma régua dos braços
  if(ant === 'hachi'){   // hachimaki (faixa de festival) na testa
    g.fillStyle = '#fff'; g.fillRect(x + 3, y + 3, 24, 2.6);
    g.fillStyle = '#e0303a'; g.beginPath(); g.arc(x + 15, y + 4.3, 1.4, 0, 7); g.fill();
    g.fillStyle = '#fff'; perfTri(x + 27, y + 3.4, x + 31, y + 1.5, x + 30.5, y + 4.5); perfTri(x + 27, y + 4.6, x + 31, y + 6.5, x + 29.5, y + 3.8);
  }
  if(ant === 'boho'){   // faixa trançada com florzinha
    g.fillStyle = '#a0673a'; g.fillRect(x + 3, y + 3, 24, 2);
    g.fillStyle = '#c98b55'; for(var bi = 0; bi < 8; bi++) g.fillRect(x + 3.5 + bi * 3, y + 3.4, 1.5, 1.2);
    g.fillStyle = '#ff9ccd'; for(var fi = 0; fi < 5; fi++){ g.beginPath(); g.arc(x + 6 + Math.cos(fi * 1.2566) * 1.6, y + 3.5 + Math.sin(fi * 1.2566) * 1.6, 1.2, 0, 7); g.fill(); }
    g.fillStyle = '#ffe14d'; g.beginPath(); g.arc(x + 6, y + 3.5, .9, 0, 7); g.fill();
  }
  if(ant === 'touca'){   // touca de dormir caída para o lado, com pompom
    g.fillStyle = '#7dc4ff'; g.beginPath(); g.moveTo(x + 3, y + 4); g.quadraticCurveTo(x + 15, y - 12, x + 31, y - 4); g.lineTo(x + 27, y + 4); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(x + 9, y - 1); g.quadraticCurveTo(x + 16, y - 7, x + 24, y - 4); g.lineTo(x + 23, y - 2.5); g.quadraticCurveTo(x + 16, y - 5, x + 10, y + .5); g.closePath(); g.fill();
    g.fillStyle = '#fff'; g.fillRect(x + 2.5, y + 2.5, 25, 3); g.beginPath(); g.arc(x + 31.5, y - 3.5, 2.6, 0, 7); g.fill();
  }
  if(ant === 'alien'){   // tiara de anteninhas
    g.strokeStyle = '#3f6212'; g.lineWidth = 1.3; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x + 10, y - 2); g.lineTo(x + 7, y - 11); g.moveTo(x + 20, y - 2); g.lineTo(x + 23, y - 11); g.stroke();
    g.fillStyle = '#b6ff3b'; g.beginPath(); g.arc(x + 7, y - 12, 2.2, 0, 7); g.arc(x + 23, y - 12, 2.2, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(x + 6.2, y - 13, .9, .9); g.fillRect(x + 22.2, y - 13, .9, .9);
  }
  if(ant && typeof temaAntena === 'function') temaAntena(ant, c, x, y);   // gorro, chifres de rena, flores... (módulo de temas)
  g.lineCap = 'round'; g.strokeStyle = c.skin; g.lineWidth = 4;
  if(p === 'mic'){
    g.beginPath(); g.moveTo(x + 27, y + 26); g.lineTo(x + 22.5, y + 23.2); g.stroke();
    g.strokeStyle = '#2a2438'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 22.8, y + 24.8); g.lineTo(x + 19.6, y + 20.4); g.stroke();
    g.fillStyle = '#d7dbe4'; g.beginPath(); g.arc(x + 19, y + 19.4, 2.4, 0, 7); g.fill();
    g.strokeStyle = '#ff6fb5'; g.lineWidth = .8; g.beginPath(); g.arc(x + 19, y + 19.4, 2.4, 0, 7); g.stroke();
    g.fillStyle = c.skin; g.beginPath(); g.arc(x + 22.4, y + 23.3, 2.3, 0, 7); g.fill();
    g.fillStyle = '#ff6fb5'; g.font = '7px sans-serif'; g.textAlign = 'left'; g.fillText('♪', x + 25, y + 14); g.fillText('♫', x + 30, y + 9);
  } else if(p === 'nyan'){
    [[3, 6.5], [27, 23.5]].forEach(function(b){
      g.strokeStyle = c.skin; g.lineWidth = 4; g.beginPath(); g.moveTo(x + b[0], y + 26); g.lineTo(x + b[1], y + 21.5); g.stroke();
      g.fillStyle = c.skin; g.beginPath(); g.arc(x + b[1], y + 20, 2.8, 0, 7); g.fill();
      g.fillStyle = '#ff9ccd'; g.beginPath(); g.arc(x + b[1], y + 20.7, 1.05, 0, 7); g.fill();
      [-1.4, 0, 1.4].forEach(function(o){ g.beginPath(); g.arc(x + b[1] + o, y + 18.5, .6, 0, 7); g.fill(); });
    });
  }
  g.restore();
}
var perfProva = '', perfT = 0, perfAnimId = 0, perfInsSel = '', perfPedido = 0;
function perfAbrir(nick, manterAba){
  var pedido=++perfPedido;
  perfMeu = !nick; perfNickVis = nick || ''; perfAtual = null; perfProva = ''; perfInsSel = '';
  if(!manterAba){ perfAba = 'perfil'; perfZoom = true; }
  $('perfX').setAttribute('aria-label', tr('Fechar'));
  if(!manterAba) $('perfCorpo').innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>';
  if(perfOv.hidden){ perfOv.hidden = false; perfOv.scrollTop = 0; if(sfx.card) sfx.card(); }
  var pr = perfMeu ? contaRpc('meu_perfil') : contaRpc('perfil_publico', { p_nick: String(nick).slice(0, 24) });
  pr = Promise.all([pr, perfOshiJogCarregar(), perfGruposCarregar(), perfTelaCarregar()]).then(function(r){ return r[0]; });   // lista de Oshi e grupos; a tela do Perfil (perfil-tela.js) chega junto
  pr.then(function(d){
    if(perfOv.hidden||pedido!==perfPedido) return;
    if(!d){ $('perfCorpo').innerHTML = '<h2 class="perfnm">' + escHtml(nick || '') + '</h2><p class="perfcarr">' + escHtml(tr('Esse nome ainda não tem perfil (jogou sem conta).')) + '</p>'; return; }
    if(d.eu && !perfMeu){ perfAbrir(); return; }   // tocou no próprio nome: abre o perfil pessoal
    perfAtual = d; perfAniverVer = !!d.aniver_hoje; if(perfMeu) perfMeuAniverHoje = !!d.aniver_hoje; perfMontar();
  }).catch(function(){
    if(perfOv.hidden||pedido!==perfPedido)return;
    $('perfCorpo').innerHTML = '<p class="perfcarr">' + escHtml(tr('Não deu para falar com o servidor. Tente de novo.')) + '</p>';
  });
}
function temaPerfil(){ return perfAniverVer ? 'aniversario' : (typeof temaAtual === 'function' ? temaAtual() : ''); }
var PERF_MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
//→perfAniverHtml
function perfFechar(){
  perfPedido++;
  var topo=$('perfTopoMsg');if(topo&&topo._twTimeout){topo._twTimeout.cancel();topo._twTimeout=null;}
  if(perfMontou && contaJ && (!perfMeuAv || perfMeuAv.auto)) contaRpc('salvar_avatar', { p_avatar: perfAvAtual({ auto:true }) }).catch(function(){});   // a foto automática acompanha o Idol novo
  perfMontou = false; perfProva = '';
  perfOv.hidden = true; perfAtual = null; perfAniverVer = false; perfIconeConta();
  var voltaHub = perfVoltaHub; perfVoltaHub = false;
  if(!petLifeRetornar('trofeus') && voltaHub && typeof hubMostrar === 'function') hubMostrar();   // veio da vitrine/busca: volta à página principal, não ao Center⭐Run!
}
var perfVoltaHub = false;
//→perfMontar
function perfFotoAtual(){
  var d = perfAtual; if(!d || !$('perfFoto')) return;
  var av = d.avatar;
  if(perfMeu && (!av || av.auto)) av = perfAvAtual();   // sem foto escolhida: acompanha o Idol de agora
  perfFotoRedonda($('perfFoto'), av || { c:{}, pose:'v', expr:2, fundo:'basico' }, perfZoom);
}
function perfTopoMsg(t){ var m=$('perfTopoMsg');if(!m||perfOv.hidden)return;if(m._twTimeout){m._twTimeout.cancel();m._twTimeout=null;}m.textContent=t;m.hidden=!t;if(t)m._twTimeout=twTimeoutVisivel(m,function(){return !perfOv.hidden&&m.isConnected;},function(){m.hidden=true;m._twTimeout=null;},4000);}
//→perfAbaMostrar
// Sora⭐Jump!: 5 últimas e 5 melhores subidas da conta (servidor); enquanto carrega, mostra as deste aparelho
function perfSoraListas(ult, mel){
  function li(L){ return (L || []).slice(0, 5).map(function(x){ return '<li><span><small>' + escHtml(perfData(x.at || +x.t || x.d)) + '</small></span><strong>' + Math.max(0, Math.floor(+x.score || 0)) + ' m</strong></li>'; }).join(''); }
  if(!(ult || []).length) return '';
  return '<h4 class="perfsub">🕒 ' + escHtml(tr('Últimas 5 subidas')) + '</h4><ol class="lb perfult">' + li(ult) + '</ol>' +
         ((mel || []).length ? '<h4 class="perfsub">🏆 ' + escHtml(tr('5 melhores subidas')) + '</h4><ol class="lb perfult">' + li(mel) + '</ol>' : '');
}
//→perfSoraHist
//→perfSoraHistNuvem
function perfUltimas(L, adm){
  if(!L.length) return '<li style="justify-content:center"><em>' + escHtml(tr('Nenhuma corrida online ainda.')) + '</em></li>';
  return L.map(function(r){
    var ch = r.char === 'Você' ? 'Idol' : (r.char || 'Tsu');
    return '<li><span>' + escHtml(ch) + ' · <em>' + escHtml(tr(RANKS[rankOf(+r.score || 0)][1])) + '</em> · <small>' + escHtml(perfData(r.created_at)) + '</small></span><strong>' + (+r.score || 0) + '</strong>' + (adm && r.id ? '<button type="button" class="admcorr" data-corr="' + (+r.id) + '" title="Tirar do ranking">✕</button>' : '') + '</li>';
  }).join('');
}
// Insígnias que evoluem: [nível 1, nível 2, nível 3, o que conta]. A chave do servidor vira "presenca:2" no nível 2.
var PERF_TIERS = { duo:[5, 25, 100, 'cenas'], presenca:[7, 30, 100, 'dias diferentes'], maratona:[100, 500, 1000, 'corridas'], amada:[10, 50, 200, 'corações recebidos'], carteiro:[10, 50, 200, 'recados'], amizade:[10, 50, 200, 'corações dados'], fashion:[5, 15, 30, 'compras'] };
var perfInsTem = [];
//→perfInsNv
//→perfInsHtml
//→perfDarCoracao
function perfChuvaCoracoes(el){   // coraçõezinhos subindo do botão
  var r = el.getBoundingClientRect();
  for(var i = 0; i < 8; i++){
    var s = document.createElement('i'); s.className = 'perfsobe'; s.textContent = ['💖', '💜', '💚', '💙'][i % 4];
    s.style.left = (r.left + r.width / 2 + (Math.random() - .5) * 40) + 'px'; s.style.top = (r.top) + 'px'; s.style.animationDelay = (i * .07) + 's';
    document.body.appendChild(s); setTimeout(function(n){ return function(){ if(n.parentNode) n.parentNode.removeChild(n); }; }(s), 1600);
  }
}
var PERF_REC_ERRO = { palavras:'Essa mensagem tem palavras que não são permitidas.', hoje:'Você já deixou um recado hoje para essa pessoa.', fechado:'Essa pessoa não está recebendo recados.', limite:'Você chegou ao limite de recados de hoje.', login:'Entre com Google para dar coração e deixar recados.', sem_conta:'Entre com Google para dar coração e deixar recados.', tamanho:'Deixe um recado (até 60 letras)' };
//→perfRecadosHtml
//→perfBioHtml
var PERF_EMOJIS = ['🎤','🌸','⭐','💜','💚','💙','🐱','🐨','👑','🍓','🌙','🔥','🦋','🍀','🎀','🐰','🌈','💎','🍰','🐳'];
//→perfBioMontar
//→perfPets
//→perfMiniCarregar
//→perfMiniUI
function perfMontUI(){
  if(typeof acessoriosSync==='function') acessoriosSync(); // antes de copiar as opções para o montador do perfil
  var box = $('perfMont'), h = '';
  if(!box) return;   // Zipper⭐Shop! aberta sem o Montar Idol
  function rotulo(id){ var el = $(id), lb = el && el.closest('label'); if(!lb) return ''; var t = ''; [].forEach.call(lb.childNodes, function(n){ if(n.nodeType === 3) t += n.nodeValue; }); return t.trim(); }
  function opts(id, cur){ return [].map.call($(id).options, function(o){ return '<option value="' + escHtml(o.value) + '"' + (o.disabled ? ' disabled' : '') + (o.value === cur ? ' selected' : '') + '>' + escHtml(o.textContent) + '</option>'; }).join(''); }
  function sel(p){ h += '<label>' + escHtml(rotulo(p[0])) + ' <select data-m="' + p[1] + '">' + opts(p[0], CU[p[1]] || '') + '</select></label>'; }
  h += '<label>' + escHtml(tr('Cabelo')) + ' <input type="color" data-m="hair" value="' + escHtml(CU.hair) + '"></label>';   // no editor do menu o rótulo virou "Cor", dentro do bloco Penteado
  sel(['cback', 'back']);
  h += '<i class="cbr"></i>';
  h += '<label>' + escHtml(rotulo('cstk')) + ' <select data-m="mecha">' + opts('cstk', CU.mecha||(CU.streak?'uma':'')) + '</select> <input type="color" data-m="hair2" aria-label="' + escHtml(tr('Mecha')) + '" value="' + escHtml(CU.hair2) + '"></label>';
  h += '<i class="cbr"></i>';
  sel(['cfront', 'front']); sel(['cdet', 'det']);
  h += '<i class="cbr"></i>';
  h += '<span class="perfskins">' + SK.map(function(sk){ return '<button type="button" class="sw" data-m="skin" data-v="' + sk + '" style="background:' + sk + '" aria-label="' + escHtml(tr('Tom de pele')) + '" aria-pressed="' + (sk === CU.skin) + '"></button>'; }).join('') + '</span>';
  h += '<label>' + escHtml(rotulo('ceye')) + ' <select data-m="olho">' + opts('colho', CU.olho || '') + '</select> <input type="color" data-m="eye" aria-label="' + escHtml(tr('Cor dos olhos')) + '" value="' + escHtml(CU.eye) + '"></label>';
  sel(['csobr', 'sobrancelha']); sel(['cboca', 'boca']); sel(['cbochecha', 'bochecha']);   // rosto à escolha (tw-avatar-rosto.js)
  h += '<i class="cbr"></i>';
  h += '<label>' + escHtml(rotulo('cout')) + ' <select data-m="out">' + opts('cout', CU.out || '') + '</select> <input type="color" data-m="outcol" aria-label="' + escHtml(tr('Cor da roupa')) + '" value="' + escHtml(CU.outcol || '#ffffff') + '"></label>';
  h += '<label>' + escHtml(tr('Parte de baixo')) + ' <select data-m="baixo" title="' + escHtml(tr('Vale para Trainee, Cheeky, Seifuku e City Pop')) + '">' + [['', tr('Padrão da roupa')], ['saia', tr('Saia')], ['bermuda', tr('Bermuda')]].map(function(o){ return '<option value="' + o[0] + '"' + ((CU.baixo || '') === o[0] ? ' selected' : '') + '>' + escHtml(o[1]) + '</option>'; }).join('') + '</select></label>';
  h += '<label>' + escHtml(tr('Meias')) + ' <input type="color" data-m="legcol" value="' + escHtml(CU.legcol || '#1c1c30') + '" title="' + escHtml(tr('Cor das meias ou botas')) + '"></label>';
  [['chat', 'hat'], ['cgl', 'gl']].forEach(function(p){ h += '<label>' + escHtml(rotulo(p[0])) + ' <select data-m="' + p[1] + '">' + opts(p[0], p[1]==='hat'&&CU.det==='tulipa'?'tulipa':(CU[p[1]]||'')) + '</select></label>'; });
  h += '<label>' + escHtml(rotulo('acc')) + ' <select data-m="acc">' + opts('acc', CU.det==='torrada'?'torrada':accSel) + '</select></label>';
  box.innerHTML = h;
  // Estúdio do charmaker (prévia, expressões, abas e miniaturas) também aqui no Perfil e na Zipper⭐Shop!
  if(window.TW_CHARMAKER && typeof TW_CHARMAKER.montar === 'function') TW_CHARMAKER.montar(box, function(campo){
    perfMontou = true; perfProva = '';
    if(typeof perfFotoAtual === 'function') perfFotoAtual();
    if((campo === 'out' || campo === '*') && typeof perfLojaUI === 'function') perfLojaUI();
    if(campo === 'hat' || campo === 'det' || campo === '*') perfMontUI();
  });
}
function perfMontMudou(campo, v){
  if(campo === 'acc'){
    if(v==='torrada'){CU.det='torrada';accSel='';saveCu();}
    else {if(CU.det==='torrada'){CU.det='';saveCu();}accSel=v;}
    try{ localStorage.setItem('brs48cr_acc', accSel); }catch(e){}
    if($('acc')) $('acc').value = v;
  } else {
    if(campo==='hat'&&v==='tulipa'){CU.det='tulipa';CU.hat='';}
    else {CU[campo] = v;if(campo==='hat'&&CU.det==='tulipa')CU.det='';}
    if(campo === 'mecha')CU.streak = !!v;
    if(campo === 'hair'){ CU.img = v; cw.children[3].firstChild.style.background = v; }
    if(campo === 'skin') [].forEach.call($('skins').children, function(b, i){ b.setAttribute('aria-pressed', SK[i] === v); });
    saveCu();
    if(sel === 3) pick(3);   // o montador do menu mostra os mesmos valores
  }
  perfMontou = true; perfProva = '';
  perfFotoAtual();
  if(campo==='hat'||campo==='det'||campo==='acc')perfMontUI();
  if(campo === 'out') perfLojaUI();
}
function perfLojaSincronizar(){   // as compras do servidor valem também para a lista "Roupa" do menu
  var compradas = perfDono.filter(function(k){ return /^roupa_/.test(k); }).map(function(k){ return k.slice(6); }).filter(function(k){ return !!perfLojaInfo(k); });
  var antes = JSON.stringify(perfLojaDono());
  CU.loja = compradas;
  if(JSON.stringify(compradas) !== antes){ saveCu(); }
  perfLojaOpcoes();
  if(typeof acessoriosSync==='function') acessoriosSync(); // libera imediatamente no menu de vestir após sincronizar compras
}
var perfMiniaturaObservador;
function perfMiniaturaLoja(cv,desenhar){
  if(!cv.closest('#shopOv')||!window.IntersectionObserver){desenhar();return;}
  if(!perfMiniaturaObservador)perfMiniaturaObservador=new IntersectionObserver(function(entradas){
    entradas.forEach(function(e){
      if(!e.isIntersecting)return;
      var cv=e.target, pintar=cv.perfMiniatura;perfMiniaturaObservador.unobserve(cv);
      delete cv.perfMiniatura;
      if(cv.isConnected&&pintar)pintar();
    });
  });
  cv.perfMiniatura=desenhar;perfMiniaturaObservador.observe(cv);
}
function perfMiniaturasLiberar(box){
  if(perfMiniaturaObservador)box.querySelectorAll('canvas').forEach(function(cv){
    perfMiniaturaObservador.unobserve(cv);delete cv.perfMiniatura;
  });
}
function perfLojaUI(){
  var box = $('perfLoja'); if(!box) return;
  var ativo=typeof document!=='undefined'&&document.activeElement;
  var foco=null;
  if(ativo&&box.contains&&box.contains(ativo)&&ativo.tagName==='BUTTON'){
    ['data-provar','data-vestir','data-comprar'].some(function(a){if(ativo.hasAttribute(a)){foco={a:a,v:ativo.getAttribute(a)};return true;}return false;});
  }
  var tmL = perfMeuAniverHoje ? 'aniversario' : (typeof temaAtual === 'function' ? temaAtual() : '');
  var lojaL = PERF_LOJA.filter(function(it){ return !it[4] || it[4] === tmL || perfLojaDono().indexOf(it[0]) >= 0; });
  lojaL.sort(function(a, b){ return (b[4] === tmL && !!tmL) - (a[4] === tmL && !!tmL); });   // a da temporada vem primeiro
  perfMiniaturasLiberar(box);
  box.innerHTML = lojaL.map(function(it){
    var dono = perfLojaDono().indexOf(it[0]) >= 0, veste = CU.out === it[0], prov = perfProva === it[0];
    // 21/11/2026: promoção da semana (tw-estreia.js) e quanto falta, em estrelas e corridas
    var preco = typeof twPrecoLoja === 'function' ? twPrecoLoja(it[0], it[3]) : it[3], promo = preco < it[3];
    var falta = !dono && starT < preco && typeof twFaltaTxt === 'function' ? '<small class="perffalta">' + escHtml(twFaltaTxt(preco)) + '</small>' : '';
    var acao = veste ? '<em class="ok">✓ ' + escHtml(tr('Vestindo')) + '</em>' : dono ? '<button type="button" class="btn alt" data-vestir="' + it[0] + '">' + escHtml(tr('Vestir')) + '</button>'
      : '<button type="button" class="btn" data-comprar="roupa_' + it[0] + '"' + (starT < preco ? ' disabled' : '') + '>' + (promo ? '<s>★' + it[3] + '</s> ' : '') + '★' + preco + '</button>' + falta;
    if(promo && !dono) acao = '<small class="perfpromo">🏷️ −30%</small>' + acao;
    var tag = it[4] && !dono && typeof temaAteTxt === 'function' ? '<small class="perftemp">🗓️ ' + escHtml(tr('Só até')) + ' ' + temaAteTxt() + '</small>' : it[4] ? '<small class="perftemp">🗓️ ' + escHtml(tr('Da temporada')) + '</small>' : '';
    var provar=typeof shopOv!=='undefined' && !shopOv.hidden ?
      '<button type="button" class="btn alt" data-provar="'+it[0]+'" aria-pressed="'+prov+'">'+
      escHtml(shopProvaTexto(0)+' · '+tr(it[2]))+'</button>' : '';
    return '<div class="perfroupa' + (prov ? ' on' : '') + (it[4] ? ' temp' : '') + '" data-provar="' + it[0] + '"><canvas width="160" height="160" data-roupa="' + it[0] + '"></canvas><b>' + it[1] + ' ' + escHtml(tr(it[2])) + '</b>' + tag + (window.TW_RITMO ? '<details class="tw-ritmo-origem"><summary>'+escHtml(TW_RITMO.origemTexto(0))+'</summary><p>'+escHtml(TW_RITMO.origemTexto(it[4]?2:1))+'</p><p>'+escHtml(TW_RITMO.t(28))+'</p></details>' : '') + provar + acao + '</div>';
  }).join('');
  if(foco){
    [].some.call(box.querySelectorAll('button['+foco.a+']'),function(b){
      if(b.getAttribute(foco.a)!==foco.v||b.disabled)return false;
      b.focus({preventScroll:true});return true;
    });
  }
  [].forEach.call(box.querySelectorAll('canvas[data-roupa]'), function(cv){
    perfMiniaturaLoja(cv,function(){
      var av=perfAvAtual({pose:'v',fundo:'basico'});av.c.out=cv.dataset.roupa;
      perfDesenharIdol(cv.getContext('2d'),160,160,av,true,false,0);
    });
  });
}
function perfTem(tipo, k){
  if(tipo === 'visual') return !k || perfDono.indexOf(k) >= 0;
  if(tipo === 'fundo') return !k || k === 'basico' || k === 'temporada' || perfDono.indexOf(k === 'cafe' ? 'duo_cafe' : 'fundo_' + k) >= 0;
  if(tipo === 'pose'){ var p = perfPoseInfo(k); return !p || !p[3] || perfDono.indexOf('pose_' + k) >= 0; }
  if(tipo === 'expr') return typeof lojaTem === 'function' ? lojaTem('expr_' + k) : true;
  return true;
}
//→perfVisInfo
//→perfFundoInfo
//→perfFaltando
//→perfPetsDono
//→perfGenUI
//→perfAnimar
//→perfAnimLigar
var PERF_GEN_DRAW_CHAR={},PERF_GEN_PREVIEW_CHAR={},PERF_GEN_DRAW_AV={c:null,a:'',visual:'',pose:'v',expr:2,fundo:'basico'},PERF_GEN_COLOR_AV={c:null,a:'',visual:'',pose:'v',expr:2,fundo:'basico',pet:null,cor:null};
//→perfGenCharAtual
function perfLojaTem(k){
  var lista=Array.isArray(CU.loja)?CU.loja:[];
  for(var i=0;i<lista.length;i++)if(lista[i]===k&&perfLojaInfo(k))return true;
  return false;
}
//→perfGenTemFaltando
//→perfGenDesenhar
//→perfPng
//→perfComprar
//→perfUsarFoto
function perfIconeConta(){
  var cv = $('contaAv');
  if(cv) perfFotoRedonda(cv, perfMeuAv && !perfMeuAv.auto ? perfMeuAv : perfAvAtual(), true);
}
var perfEntrou = false, perfSyncOn = false, perfSnap = '', perfNuvemPre = null;
var perfSyncEstado = 'idle';
function perfCarimbo(){   // brs48cr_sync: hora da última mudança local + conta
  var s = perfJSON(perfLer(PERF_SYNC));
  if(typeof s === 'number') return { ms:s, u:'' };   // formato antigo da prévia de testes
  return (s && typeof s === 'object') ? { ms:+s.ms || 0, u:String(s.u || '') } : { ms:0, u:'' };
}
function perfMarcar(ms, nick){
  try{ localStorage.setItem(PERF_SYNC, JSON.stringify({ ms:ms, u:String(nick || '').toLowerCase() })); }catch(e){}
}
function perfVisualLocal(){
  return { cu2: perfJSON(perfLer('brs48cr_cu2')), ch2: perfJSON(perfLer('brs48cr_ch2')), acc: perfLer('brs48cr_acc') || '', char: perfLer('brs48cr_char') || '', admin_visual_rev:+(perfLer('brs48cr_visual_rev')||0) };
}
function perfSnapAgora(){return JSON.stringify(perfVisualLocal());}
var perfNuvemLidaMs=0;
function perfPetMudou(){
  if(!contaJ){try{localStorage.setItem('brs48cr_pet_guest_dirty','1');}catch(e){}return;}
  perfSync.markDirty();
}
function petSyncEstadoUI(){
  var el=$('petSyncAviso'),btn=$('petSyncResolver');if(!el||!btn)return;
  var pendente=!!(perfSync&&perfSync.hasPending(contaJ&&contaJ.nick)),st=perfSyncEstado;
  el.textContent=!contaJ?tr('Salvo neste aparelho'):
    st==='syncing'?'☁️ '+tr('Salvando...'):
    st==='confirmed'&&!pendente?'☁️ '+tr('Salvo na nuvem'):
    st==='error'?'⚠️ '+tr('Salvamento pendente'):
    pendente?'☁️ '+tr('Aguardando sincronização'):'☁️ '+tr('Sincronizado');
  var erro=perfSync&&perfSync.getState().lastError;
  btn.hidden=!(contaJ&&pendente&&(erro==='conflito_versao'||erro==='save_antigo'));
  btn.textContent=tr('Resolver conflito de saves');
}
function perfEnviar(){
  if(!contaJ || !perfSyncOn) return Promise.resolve({ ok:false, skipped:true });
  return perfSync.flush();
}
function perfSalvarRpc(nome,args){
  if(nome==='salvar_nuvem'){
    return contaRpc('carregar_nuvem').then(function(n){
      var ms=Math.max(0,Number(n&&n.ms)||0);
      if(ms>Math.max(perfNuvemLidaMs,perfConfirmadoMs()))return {ok:false,erro:'conflito_versao'};   // save de outra aba deste navegador não é conflito
      return contaRpc(nome,args).then(function(r){
        if(r&&r.ok===true)perfNuvemLidaMs=Math.max(perfNuvemLidaMs,Number(args&&args.p_ms)||0);
        if(r&&(r.pet_rebased||r.visual_rebased)&&contaJ)
          return contaRpc('carregar_nuvem').then(function(nn){if(nn)perfAplicarNuvem(nn,contaJ.nick);return r;});
        return r;
      });
    });
  }
  return contaRpc(nome, args).then(function(r){
    if(nome === 'salvar_nuvem' && r && (r.pet_rebased || r.visual_rebased) && contaJ){
      return contaRpc('carregar_nuvem').then(function(n){ if(n) perfAplicarNuvem(n, contaJ.nick); return r; });
    }
    return r;
  });
}
// último save confirmado neste navegador (vale para todas as abas, pois o estado fica no localStorage)
function perfConfirmadoMs(){ try{ var st=JSON.parse(localStorage.getItem(PERF_SYNC_STATE)||'null'); return Math.max(0,Number(st&&st.confirmedMs)||0); }catch(e){ return 0; } }
function perfConferir(){   // toda mudança local vira pendência persistente antes de tentar o envio
  if(!perfSyncOn || !contaJ) return false;
  var s = perfSnapAgora(); if(s === perfSnap) return false;
  perfSnap = s;
  perfSync.markDirty();
  return true;
}
// Decide o que fazer com os dois saves: 'aplicar' (a nuvem é mais nova), 'perguntar' (1º login neste
// aparelho e ele já tem save), 'enviar' (o deste aparelho é mais novo ou a nuvem está vazia) ou 'igual'
function perfDecidir(n, nick){
  var st = perfCarimbo(), mesma = !st.u || st.u === String(nick || '').toLowerCase(), loc = mesma ? st.ms : 0;
  var pendente=perfSync.hasPending(nick),guestDirty=false;
  try{guestDirty=localStorage.getItem('brs48cr_pet_guest_dirty')==='1';}catch(e){}
  var nuvem=n&&(n.pet||n.visual)&&+n.ms>0;
  // pendência deste navegador (inclusive de outra aba) e a nuvem não mudou desde o último save confirmado aqui: só enviar
  if(pendente&&!guestDirty&&nuvem&&mesma&&+n.ms<=perfConfirmadoMs())return 'enviar';
  if((guestDirty||pendente)&&nuvem)return 'perguntar';
  if(!nuvem) return 'enviar';
  if(+n.ms > loc){
    var temLocal = !!(perfLer('brs48cr_pet') || perfLer('brs48cr_cu2') || pendente);
    return (!loc && temLocal) || pendente ? 'perguntar' : 'aplicar';
  }
  return (loc > +n.ms || pendente) ? 'enviar' : 'igual';
}
// Chamado pelo contaSessao antes de carregar a conta (assim, se a pessoa cancelar, nada deste aparelho muda)
function perfAntesDeEntrar(j, token){
  token=token===undefined?contaSessaoToken:token;
  contaRpc('carregar_nuvem').then(function(n){
    if(token!==contaSessaoToken)return;
    perfNuvemLidaMs=Math.max(0,Number(n&&n.ms)||0);
    var dec=perfDecidir(n,j.nick);
    if(dec === 'aplicar' && perfAplicarNuvem(n, j.nick)) return;
    if(dec === 'perguntar'){ perfPerguntar(n,j,false,token); return; }
    perfNuvemPre = { n:n, dec:dec };
    contaAplicar(j,token);
  }).catch(function(){if(token===contaSessaoToken)contaAplicar(j,token);});
}
function perfPerguntar(n,j,conflito,token){
  token=token===undefined?contaSessaoToken:token;
  $('perfConfTit').textContent='☁️ '+tr('Esta conta já tem um save na nuvem');
  $('perfConfTxt').textContent=tr('Existem alterações diferentes neste aparelho e na nuvem. Escolha qual save manter.');
  $('perfConfSim').textContent=tr('USAR O SAVE DA NUVEM');
  $('perfConfLocal').textContent=tr('MANTER O DESTE APARELHO');
  $('perfConfNao').textContent=tr(conflito?'Voltar sem substituir':'Cancelar e sair da conta');
  $('perfConfSim').disabled=false;$('perfConfLocal').disabled=false;
  $('perfConfSim').onclick=function(){
    if(token!==contaSessaoToken){perfConf.hidden=true;return;}
    this.disabled=true;
    try{localStorage.removeItem('brs48cr_pet_guest_dirty');}catch(e){}
    if(!perfAplicarNuvem(n,j.nick)){perfConf.hidden=true;if(!contaJ)contaAplicar(j,token);}
  };
  $('perfConfLocal').onclick=function(){
    if(token!==contaSessaoToken){perfConf.hidden=true;return;}
    this.disabled=true;
    var ms=Math.max(0,Number(n&&n.ms)||0);
    perfNuvemLidaMs=ms;perfSync.clearFromCloud(ms,j.nick);perfSync.markDirty();
    try{localStorage.removeItem('brs48cr_pet_guest_dirty');}catch(e){}
    perfConf.hidden=true;
    if(!contaJ){perfNuvemPre={n:n,dec:'enviar'};contaAplicar(j,token);}
    else {perfSyncOn=true;perfEnviar();}
  };
  $('perfConfNao').onclick=function(){if(token!==contaSessaoToken){perfConf.hidden=true;return;}perfConf.hidden=true;if(!conflito)contaSair();};
  perfConf.hidden=false;
}
function perfAoEntrar(){   // chamado no fim do contaAplicar (uma vez por página)
  if(perfEntrou) return; perfEntrou = true;
  var avisou = null; try{ avisou = sessionStorage.getItem('tsl_nuvem_ok'); sessionStorage.removeItem('tsl_nuvem_ok'); }catch(e){}
  if(avisou) contaAviso('☁️ ' + tr('Seu save da nuvem foi carregado!'));
  var dono=contaJ&&contaJ.nick,token=contaSessaoToken,pre=perfNuvemPre;perfNuvemPre=null;
  (pre?Promise.resolve(pre):contaRpc('carregar_nuvem').then(function(n){return {n:n,dec:perfDecidir(n,dono)};})).then(function(r){
    if(!contaJ||contaJ.nick!==dono||token!==contaSessaoToken)return;
    perfNuvemLidaMs=Math.max(perfNuvemLidaMs,Number(r.n&&r.n.ms)||0);
    if(r.dec === 'aplicar' && perfAplicarNuvem(r.n, contaJ.nick)) return;
    if(r.dec === 'perguntar'){ perfEntrou = false; perfPerguntar(r.n, contaJ); return; }
    perfSyncOn = true; perfSnap = perfSnapAgora();
    if(r.dec === 'enviar' && !perfSync.hasPending(contaJ.nick)) perfSync.markDirty();
    if(r.dec === 'enviar' || perfSync.hasPending(contaJ.nick)) perfEnviar();
    perfAvatarAuto();
    perfPresente();
    if(typeof hubAoEntrar === 'function') hubAoEntrar();   // tela de início: missões e insígnias novas
  }).catch(function(){if(token!==contaSessaoToken||!contaJ||contaJ.nick!==dono)return;perfEntrou=false;perfSyncEstado='error';petSyncEstadoUI();});
}
function perfSair(){ perfSyncOn=false;perfEntrou=false;perfMeuAv=null;perfGenAv=null;perfSync.cancelTimers();if(typeof insCancelar==='function')insCancelar();if(!perfOv.hidden)perfFechar();}
function perfAplicarNuvem(n, nick){
  try{
    if(n.pet) localStorage.setItem('brs48cr_pet', JSON.stringify(n.pet));
    var v = n.visual || {};
    if(v.cu2) localStorage.setItem('brs48cr_cu2', JSON.stringify(v.cu2));
    if(v.ch2) localStorage.setItem('brs48cr_ch2', JSON.stringify(v.ch2));
    if(typeof v.acc === 'string') localStorage.setItem('brs48cr_acc', v.acc);
    if(v.char !== undefined && v.char !== null && v.char !== '') localStorage.setItem('brs48cr_char', String(v.char));
    localStorage.setItem('brs48cr_visual_rev', String(Math.max(0, +v.admin_visual_rev || 0)));
    perfSync.clearFromCloud(+n.ms,nick);
    perfNuvemLidaMs=Math.max(0,Number(n.ms)||0);
    try{localStorage.removeItem('brs48cr_pet_guest_dirty');}catch(e){}
    perfMarcar(+n.ms,nick);
    try{ sessionStorage.setItem('tsl_nuvem_ok', '1'); }catch(e){}
  }catch(e){ return false; }
  petData = null;   // assim o pagehide não regrava o pet antigo por cima do da nuvem
  location.reload();
  return true;
}
// Enquanto a pessoa não escolhe uma foto, a foto do perfil acompanha o Idol atual.
// Aproveita para trazer as roupas compradas na lojinha para a lista "Roupa" do menu.
function perfAvatarAuto(){
  var dono=contaJ&&contaJ.nick,token=contaSessaoToken;if(!dono)return;
  contaRpc('meu_perfil').then(function(d){
    if(!d||!contaJ||contaJ.nick!==dono) return;
    perfDono = Array.isArray(d.visuais) ? d.visuais.slice() : []; perfLojaSincronizar();
    perfMeuAv = d.avatar || null; perfIconeConta(); perfAdmin = !!d.admin; if(perfAdmin && typeof admCarregar === 'function') admCarregar();   // ferramentas de moderação (admin.js) só para admin perfGuardarCor(d.cor);
    if(d.aniver_hoje && typeof aniverFesta === 'function')twTimeoutVisivel(document.documentElement,function(){return !!contaJ&&contaJ.nick===dono;},aniverFesta,1500);   // 🎂 ★50 + card especial, 1 vez por ano
    if(typeof bestcNuvem === 'function') bestcNuvem(d.por_personagem);   // recorde de cada personagem (itens por personagem)
    if(d.avatar && !d.avatar.auto) return;
    var avatarAuto=perfAvAtual({ auto:true });
    return contaRpc('salvar_avatar', { p_avatar:avatarAuto }).then(function(r){
      // Primeira foto: só mostrar o Idol após o servidor confirmar, sem substituir uma foto escolhida enquanto aguardava.
      if(!d.avatar && r && r.ok && contaJ && contaJ.nick===dono && contaSessaoToken===token && !perfMeuAv){
        perfMeuAv=avatarAuto;perfIconeConta();
      }
    });
  }).catch(function(){});
}
function perfSortear(s1, s2){
  var roupas = (petData.roupas || {}), decor = (petData.decor || {});
  var comida = ['gyoza', 'gyoza', 'dango', 'dango', 'redvelvet', 'tiramisu', 'espuma'];
  var aces = PET_WARDROBE.filter(function(it){ return it[0] && it[3] > 0 && !it[4] && !roupas[it[0]]; });
  var quad = PET_DECOR.filter(function(it){ return it[2] > 0 && !(it[0] in decor); });
  var pega = function(L){ return L[Math.min(L.length - 1, Math.floor((+s2 || 0) * L.length))]; };
  // V2.1.3: roupinhas de pet não saem mais no presente diário (só comida, banho e, mais raro, quadros)
  if(s1 >= .8 && quad.length) return { t:'decor', it:pega(quad) };
  var k = pega(comida);
  return { t:'food', it: petFind(PET_FOOD, k) || petFind(PET_BATH, k) };
}
function perfPresente(){
  if(!petData) petLoad();
  if(!petData) return;   // sem pet ainda: o presente espera o dia em que tiver
  contaRpc('presente_diario').then(function(r){
    if(!r || !r.ok || !petData) return;
    var g2 = perfSortear(+r.sorteio || 0, +r.sorteio2 || 0), k = g2.it[0], nome;
    if(g2.t === 'acc'){ petData.roupas = petData.roupas || { '': 1 }; petData.roupas[k] = 1; nome = tr(g2.it[2]); }
    else if(g2.t === 'decor'){ petData.decor = petData.decor || {}; petData.decor[k] = 1; petBg = null; nome = tr(g2.it[1]); }
    else { petData.inv = petData.inv || {}; petData.inv[k] = (petData.inv[k] || 0) + 1; nome = tr(g2.it[1]); }
    petSave(true); perfConferir();
    if(petOpen) petUI();
    $('perfPresTit').textContent = '🎁 ' + tr('Presente do dia da conta');
    $('perfPresNome').textContent = nome;
    $('perfPresTxt').textContent = tr(g2.t === 'acc' ? 'Acessório novo para o seu pet!' : g2.t === 'decor' ? 'Quadro novo no mural do camarim!' : 'Guardado no camarim do seu pet!');
    $('perfPresOk').textContent = tr('OBA!');
    var arte = $('perfPresArte'); arte.innerHTML = '';
    if(g2.t === 'decor'){ var im = document.createElement('img'); im.src = PET_DECOR_IMG[k]; im.alt = ''; arte.appendChild(im); }
    else if(g2.t === 'acc'){ arte.innerHTML = '<span class="perfpres-emo">' + g2.it[1] + '</span>'; }
    else { var c = document.createElement('canvas'); c.width = 160; c.height = 140; arte.appendChild(c); petDrawItem(c.getContext('2d'), k, 80, 74, 3.6); }
    perfPres.hidden = false;
    if(sfx.rank) sfx.rank();
  }).catch(function(){});
}
//→perfDiarioHojeHtml
//→perfDiarioHtml

// ---------- Tela do Perfil sob demanda (perfil-tela.js) ----------
// Na abertura fica a biblioteca de desenho dos Idols e o que o Hub, a loja, o login e a corrida usam.
// As abas do Perfil (perfil, diário, recados, insígnias, estúdio de foto) baixam ao abrir um Perfil, junto com os dados.
// Cada "//→nome" acima marca o lugar de uma função que mora em perfil-tela.js; tests/fonte-dividida.js remonta a ordem.
// Se mudar perfil-tela.js, suba a versão em PERF_TELA_ARQ.
var PERF_TELA_ARQ='./perfil-tela.js?v=9',PERF_TELA_PRONTA=false,perfTelaP=null;
function perfTelaCarregar(){
  if(PERF_TELA_PRONTA)return Promise.resolve();
  if(!perfTelaP)perfTelaP=new Promise(function(ok,er){var e=document.createElement('script');e.src=PERF_TELA_ARQ;e.async=false;
    e.onload=ok;e.onerror=function(){perfTelaP=null;er(new Error('perfil'));};document.head.appendChild(e);})
    .then(function(){PERF_TELA_PRONTA=true;});
  return perfTelaP;
}

/* Nitidez dos palcos em canvas (17/11/2026). Os jogos desenham num canvas de tamanho fixo (ex.: 640 × 420) com
   coordenadas fixas; no computador o canvas aparece maior que isso e com zoom do Windows (125–150%), então ficava
   ampliado e borrado. twNitido(cv) dá ao canvas mais pixels reais e uma escala por baixo, sem o jogo perceber:
   cv.width / cv.height continuam respondendo o tamanho lógico de antes (o jogo e os toques usam esse valor).
   Só para canvas com largura no CSS (width:100%) e que não são lidos de volta (getImageData/drawImage do próprio).
   Chamado no começo de cada desenho; só refaz quando o degrau de 0,25 muda. Teto de 3×. */
function twNitido(cv){
  if(!cv || !cv.getContext || (window.TW_NITIDEZ && TW_NITIDEZ.desligada)) return cv;   // freio: ?nitidez=0 desliga também esta
  var st = cv.__twN, P = window.HTMLCanvasElement && HTMLCanvasElement.prototype;
  if(!st){
    var dw = P && Object.getOwnPropertyDescriptor(P, 'width'), dh = P && Object.getOwnPropertyDescriptor(P, 'height');
    if(!dw || !dh || !dw.set || !dh.set) return cv;
    st = cv.__twN = { w:dw.get.call(cv), h:dh.get.call(cv), k:1, dw:dw, dh:dh };
    try{
      Object.defineProperty(cv, 'width', { configurable:true, get:function(){ return st.w; }, set:function(v){ st.w = Math.max(0, Math.floor(+v || 0)); st.k = 0; twNitido(cv); } });
      Object.defineProperty(cv, 'height', { configurable:true, get:function(){ return st.h; }, set:function(v){ st.h = Math.max(0, Math.floor(+v || 0)); st.k = 0; twNitido(cv); } });
    }catch(e){ cv.__twN = null; return cv; }
  }
  if(!st.w || !st.h) return cv;
  // Pixels reais pelo tamanho NA TELA × zoom. (Até 17/11 era "pelo menos o zoom": num celular 2,6× o Café/Gacha/Handshake,
  // que aparecem com ~390 px, eram pintados a 1760 px de largura — 2,5× mais pixels que a tela mostra, a cada quadro.)
  // Teto igual ao do tw-nitidez.js: 2× para palcos grandes (> 150 mil pixels lógicos), 3× para os pequenos.
  var z = window.devicePixelRatio || 1, vis = cv.clientWidth || st.w, teto = st.w * st.h > 150000 ? 2 : 3;
  // As duas vitrines animadas de 640 px precisam de mais um degrau em tablets
  // largos de alta densidade. Mantém o teto dos jogos e das demais cenas.
  if((cv.id==='shopCv'||cv.id==='gachaCv')&&st.w===640&&st.w*st.h<=270000){
    teto=2.25;
    var rect=cv.getBoundingClientRect&&cv.getBoundingClientRect();
    if(rect&&rect.width>0)vis=Math.max(vis,rect.width);
  }
  var k = Math.min(teto, Math.max(1, Math.ceil(z * vis / st.w * 4) / 4));
  if(k !== st.k){
    st.k = k; st.dw.set.call(cv, Math.round(st.w * k)); st.dh.set.call(cv, Math.round(st.h * k));
    try{ cv.getContext('2d').setTransform(k, 0, 0, k, 0, 0); }catch(e){}
  }
  return cv;
}

