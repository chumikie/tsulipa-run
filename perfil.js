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
  ['jogo_caderno', '📒', 'Caderno completo', 'Todas as receitas do Caderno do Happy⭐Cafe!']
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
function perfGrupoCodigo(d){ return d && d.grupo || 'BRS48'; }
function perfGrupo(g){ return PERF_GRUPOS.find(function(x){return x.codigo===g;}) || PERF_GRUPOS[0]; }
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
function perfEstiloChip(d){   // emoji + time ao lado do nome
  var g=perfGrupo(perfGrupoCodigo(d)), t=d&&g.times.find(function(x){return x.codigo===d.time;}), h = '';
  if(d && d.emoji) h += '<span class="perfemo" aria-hidden="true">' + escHtml(d.emoji) + '</span>';
  if(d)h += '<span class="perftime" style="background:#efe4ff;color:#2c1a5e">' + perfGrupoBandeira(g) + ' ' + escHtml(g.nome) + '</span>';
  if(t) h += '<span class="perftime" style="background:' + t.cor + ';color:' + perfCorTexto(t.cor) + '">' + escHtml(t.nome) + '</span>';
  return h;
}
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
function perfLogo(){ return '<span class="perflogo" translate="no">TsuLiPa<i>⭐</i>World</span>'; }
function perfRgba(hex, a){ var c = parseInt(String(hex).replace('#', ''), 16) || 0; return 'rgba(' + (c >> 16) + ',' + ((c >> 8) & 255) + ',' + (c & 255) + ',' + a + ')'; }
function perfChar(av){
  var c = {}, src = (av && av.c && typeof av.c === 'object') ? av.c : {}, k;
  for(k in PERF_BASE) c[k] = PERF_BASE[k];
  PERF_CAMPOS.forEach(function(f){
    var v = src[f];
    if(f === 'streak') c.streak = !!v;
    else if(/^(hair|hair2|skin|eye|outcol)$/.test(f)){ if(typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v)) c[f] = v; }
    else if(typeof v === 'string' && v.length <= 16) c[f] = v;
  });
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
function perfFundo(x, W2, H2, f, cor, t){
  if(!f) return;
  if(f==='cafe'){ duoFundoDesenhar(x,W2,H2,'cafe',t||0,cor); return; } // reutiliza a arte do Moon⭐Duo!
  var u = W2 / 320, gr, i;
  t = t || 0;
  if(f === 'basico'){   // pastel nas cores do TsuLiPa (roxo → verde → azul), com bolinhas
    perfFundoGradiente(x, W2, H2, 'perfil:basico', false, [[0, '#f1e3ff'], [.5, '#e9fbe0'], [1, '#e1ecff']]);
    for(i = 0; i < 42; i++){
      var col = i % 7, lin = Math.floor(i / 7);
      x.fillStyle = perfRgba(PERF_TSL[(col + lin) % 3], .16);
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
  var ux = -42, uy = -28, uw = 130, uh = 80, w = Math.ceil(uw * sc), h = Math.ceil(uh * sc);
  if(!perfCvC) perfCvC = document.createElement('canvas');
  var cv = perfCvC;
  if(cv.width !== w || cv.height !== h){ cv.width = w; cv.height = h; }
  var og = g, cx2 = cv.getContext('2d'), wasPortrait = perfCharPortrait;
  cx2.setTransform(1, 0, 0, 1, 0, 0); cx2.clearRect(0, 0, w, h);
  try{ perfCharPortrait = true; g = cx2; g.save(); g.scale(sc, sc); g.translate(-ux, -uy); desenha(); g.restore(); }
  finally{ perfCharPortrait = wasPortrait; g = og; charPose = ''; perfAntena = ''; }
  x.save();
  x.shadowColor = 'rgba(64,24,120,.32)'; x.shadowBlur = 9 * sc / 3.5; x.drawImage(cv, tx + ux * sc, ty + uy * sc, uw * sc, uh * sc);
  x.shadowColor = 'rgba(64,24,120,.55)'; x.shadowBlur = 2.2 * sc / 3.5; x.drawImage(cv, tx + ux * sc, ty + uy * sc, uw * sc, uh * sc);
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
function perfDesenharIdol(x, W2, H2, av, comFundo, zoom, t){
  av = av || {}; t = t || 0;
  var vis = typeof av.visual === 'string' ? av.visual : '', rk = PERF_RANKVIS[vis] || 0, c = perfChar(av), pet = zoom ? null : perfPetDoAvatar(av);
  if(/^#[0-9a-f]{6}$/i.test(av.cor || '')) c.luz = av.cor;   // lightstick na cor do perfil
  if(comFundo !== false) perfFundo(x, W2, H2, typeof av.fundo === 'string' ? av.fundo : 'basico', c.hair, t);
  var big = vis === 'mega' && !zoom, sc, chao, tx, ty;
  if(zoom){ sc = H2 / 46; tx = W2 / 2 - 15 * sc; ty = H2 * .5 - 10 * sc; chao = ty + 44 * sc; }   // rostinho: da coroa até os ombros
  else { sc = H2 / (big ? 68 : 82); chao = H2 * (big ? .95 : .9); tx = W2 / 2 - 15 * sc - (pet ? 10 * sc : 0); ty = chao - 44 * sc; }
  var bob = t ? Math.sin(t * .06) * 1.1 * sc : 0;
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
    if(t && ex !== 2 && (t % 200) < 7) ex = 2;   // piscadinha de vez em quando (na animação)
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
}
function perfFotoRedonda(cv, av, zoom){   // foto do perfil: o avatar recortado em círculo (zoom = rostinho)
  var x = cv.getContext('2d'), W2 = cv.width, H2 = cv.height;
  var tmp = document.createElement('canvas'); tmp.width = W2; tmp.height = H2;
  if(av && !av.fundo){ av = JSON.parse(JSON.stringify(av)); av.fundo = 'basico'; }   // na foto redonda sempre tem fundo
  perfDesenharIdol(tmp.getContext('2d'), W2, H2, av, true, zoom !== false);
  x.clearRect(0, 0, W2, H2);
  x.save(); x.beginPath(); x.arc(W2 / 2, H2 / 2, W2 / 2, 0, 7); x.clip(); x.drawImage(tmp, 0, 0); x.restore();
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
  pr = Promise.all([pr, perfOshiJogCarregar(), perfGruposCarregar()]).then(function(r){ return r[0]; });   // lista de Oshi e grupos
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
function perfAniverHtml(d){
  var a = /^\d\d-\d\d$/.test(d.aniver || '') ? d.aniver.split('-') : ['', ''], trava = !!d.aniver_livre;
  var dias = '<option value="">' + escHtml(tr('Dia')) + '</option>', meses = '<option value="">' + escHtml(tr('Mês')) + '</option>';
  for(var i = 1; i <= 31; i++) dias += '<option value="' + i + '"' + (+a[1] === i ? ' selected' : '') + '>' + i + '</option>';
  PERF_MESES.forEach(function(m, i){ meses += '<option value="' + (i + 1) + '"' + (+a[0] === i + 1 ? ' selected' : '') + '>' + escHtml(tr(m)) + '</option>'; });
  return '<label>🎂 ' + escHtml(tr('Aniversário')) + ' <span class="perfaniv-sel"><select id="perfAnivDia"' + (trava ? ' disabled' : '') + '>' + dias + '</select><select id="perfAnivMes"' + (trava ? ' disabled' : '') + '>' + meses + '</select></span></label>' +
    '<small class="perfaniv-nota">' + escHtml(tr(trava ? 'Dá para trocar de novo em {data}.' : 'Só dia e mês, sem o ano. No seu dia, seu perfil vira festa! Dá para trocar 1 vez por ano.')).replace('{data}', escHtml(perfData(d.aniver_livre))) + '</small>';
}
function perfFechar(){
  perfPedido++;
  var topo=$('perfTopoMsg');if(topo&&topo._twTimeout){topo._twTimeout.cancel();topo._twTimeout=null;}
  if(perfMontou && contaJ && (!perfMeuAv || perfMeuAv.auto)) contaRpc('salvar_avatar', { p_avatar: perfAvAtual({ auto:true }) }).catch(function(){});   // a foto automática acompanha o Idol novo
  perfMontou = false; perfProva = '';
  perfOv.hidden = true; perfAtual = null; perfAniverVer = false; perfIconeConta();
}
function perfMontar(){
  var d = perfAtual, meu = perfMeu, h = '';
  perfBestConta = Math.max(+d.best || 0, meu ? best : 0);
  var ri = rankOf(perfBestConta), rk = RANKS[ri], os = PERF_OSHI[d.oshi];
  if(meu){
    perfDono = Array.isArray(d.visuais) ? d.visuais.slice() : [];
    perfLojaSincronizar();
    if(!perfGenAv){
      var a = d.avatar && !d.avatar.auto ? d.avatar : {};
      perfGenAv = perfAvAtual({ visual: typeof a.visual === 'string' ? a.visual : '', pose: typeof a.pose === 'string' ? a.pose : 'v', expr: a.expr === undefined ? 2 : +a.expr, fundo: typeof a.fundo === 'string' ? a.fundo : 'basico', pet: perfPetDoAvatar(a) });
    }
  }
  var desde = d.desde ? escHtml(tr('No {logo} desde {data}')).replace('{logo}', perfLogo()).replace('{data}', escHtml(perfData(d.desde))) : '';
  var cora = '<span class="perfcora" id="perfCora">💖 <b>' + (+d.coracoes || 0) + '</b></span>';
  if(!meu) cora = '<button type="button" class="perfcora" id="perfCora"' + (d.dei_coracao ? ' aria-pressed="true"' : '') + ' title="' + escHtml(tr(d.dei_coracao ? 'Você deu um coração hoje!' : 'Dar coração')) + '">' + (d.dei_coracao ? '💖' : '🤍') + ' <b>' + (+d.coracoes || 0) + '</b></button>';
  var heroBg = os ? ' style="background:linear-gradient(120deg,' + perfRgba(os[2], .26) + ',rgba(255,111,181,.14) 55%,' + perfRgba(os[2], .14) + ')"' : '';
  h += '<div class="perfhero"' + heroBg + '><i class="perfbr b1">✦</i><i class="perfbr b2">♡</i><i class="perfbr b3">✧</i><i class="perfbr b4">✦</i>' +
       '<div class="perffotocol"><button type="button" class="perffotow" id="perfFotoBtn" title="' + escHtml(tr('Toque na foto para ver inteira')) + '" aria-label="' + escHtml(tr('Toque na foto para ver inteira')) + '"><canvas id="perfFoto" width="240" height="240"></canvas><span class="perfselo">' + PERF_RANK_EMO[ri] + '</span></button>' + cora + '</div>' +
       '<div class="perfid"><b class="perfnm"' + (/^#[0-9a-f]{6}$/i.test(d.cor || '') ? ' style="color:' + d.cor + '"' : '') + '>' + escHtml(d.nick) + '</b>' + perfEstiloChip(d) + '<span class="perfrk">' + escHtml(tr(rk[1])) + '</span>' +
       (os ? '<span class="perfoshi" style="background:' + os[2] + ';color:' + perfCorTexto(os[2]) + '">推し ' + os[0] + ' ' + escHtml(tr(os[1])) + '</span>' : '') +
       '<small>' + escHtml(tr('Recorde')) + ': <b>' + (+d.best || 0) + '</b></small>' + (desde ? '<small>' + desde + '</small>' : '') +
       (d.frase ? '<q class="perffrase">' + escHtml(d.frase) + '</q>' : '<em class="perfkao">' + escHtml(PERF_KAO[Math.floor(Math.random() * PERF_KAO.length)]) + '</em>') + '</div></div>' +
       (d.aniver_hoje ? '<div class="perfaniv"><span class="perfaniv-c" aria-hidden="true">🎉</span><b>🎂 ' + escHtml(meu ? tr('Feliz aniversário! Hoje o seu perfil está em festa 🎉') : tr('Hoje é aniversário de {nick}! Deixe um recado 💌').replace('{nick}', d.nick)) + '</b>' + (meu ? '<small>' + escHtml(tr('Que o seu novo ciclo seja cheio de brilho, música e muitos Centers! ✨')) + '</small>' : '') + '<span class="perfaniv-c d" aria-hidden="true">🎊</span></div>' : '') +
       (!meu && contaJ && d.duo_on !== false ? '<div class="btns perfduo"><button type="button" class="btn duobtn" id="perfDuo">🌙 <span translate="no">Moon⭐Duo!</span></button></div>' : '');
  if(meu) h += '<div class="perftabs" role="tablist">' + [['perfil', '💖', 'Perfil'], ['montar', '✏️', 'Montar Idol'], ['estudio', '📸', 'Estúdio']].concat(d.admin ? [['moderacao', '🛡️', 'Moderação']] : []).map(function(t){
    return '<button type="button" role="tab" data-aba="' + t[0] + '" aria-pressed="' + (perfAba === t[0]) + '">' + t[1] + ' ' + escHtml(tr(t[2])) + '</button>'; }).join('') + '</div>';
  if(!meu && d.admin_ver) h += admBarraHtml(d);   // só a moderação vê
  if(meu && d.bloqueado) h += '<p class="perfmsg admaviso">⛔ ' + escHtml(tr('Sua conta está bloqueada pela moderação.')) + '</p>';
  h += '<p class="perfmsg" id="perfTopoMsg" hidden></p><div id="perfAbaCorpo"></div>';
  h += '<div class="btns" style="margin-top:14px"><button type="button" class="btn alt" id="perfVoltar">' + escHtml(tr('VOLTAR')) + '</button></div>';
  $('perfCorpo').innerHTML = h;
  $('perfVoltar').onclick = perfFechar;
  $('perfFotoBtn').onclick = function(){ perfZoom = !perfZoom; perfFotoAtual(); beep(perfZoom ? 784 : 988, .05, 'triangle', .04); };
  if(!meu) $('perfCora').onclick = perfDarCoracao;
  if($('perfDuo')) $('perfDuo').onclick = function(){ var n = perfAtual && perfAtual.nick; if(n && typeof duoAbrir === 'function') duoAbrir(n); };
  perfFotoAtual();
  perfAbaMostrar();
}
function perfFotoAtual(){
  var d = perfAtual; if(!d || !$('perfFoto')) return;
  var av = d.avatar;
  if(perfMeu && (!av || av.auto)) av = perfAvAtual();   // sem foto escolhida: acompanha o Idol de agora
  perfFotoRedonda($('perfFoto'), av || { c:{}, pose:'v', expr:2, fundo:'basico' }, perfZoom);
}
function perfTopoMsg(t){ var m=$('perfTopoMsg');if(!m||perfOv.hidden)return;if(m._twTimeout){m._twTimeout.cancel();m._twTimeout=null;}m.textContent=t;m.hidden=!t;if(t)m._twTimeout=twTimeoutVisivel(m,function(){return !perfOv.hidden&&m.isConnected;},function(){m.hidden=true;m._twTimeout=null;},4000);}
function perfAbaMostrar(){
  var box = $('perfAbaCorpo'), d = perfAtual, meu = perfMeu, h = '';
  [].forEach.call(document.querySelectorAll('#perfCorpo .perftabs button'), function(b){ b.setAttribute('aria-pressed', b.dataset.aba === perfAba); });
  if(meu && perfAba === 'moderacao'){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>'; admPainel(); return; }
  if(!meu || perfAba === 'perfil'){
    if(meu){
      h += '<div class="perfnums"><div class="n1"><b>★ ' + starT + '</b><small>' + escHtml(tr('Estrelas')) + '</small></div>' +
           '<div class="n2"><b>' + (+d.corridas || 0) + '</b><small>' + escHtml(tr('Corridas')) + '</small></div>' +
           '<div class="n3"><b>' + (+d.centers || 0) + '</b><small>' + escHtml(tr('Centers')) + '</small></div></div>';
      h += '<section id="ktTicketInventory" class="tw-rank-profile"><h3>🎟️ Karaoke⭐Time!</h3></section>';
      var perfilTemEmoji = !!String(d.emoji || '').trim();
      var perfilTemCor = /^#[0-9a-f]{6}$/i.test(d.cor || '');
      if(!perfilTemEmoji || !perfilTemCor){
        h += '<aside class="perfprofile-nudge" role="status"><strong>✨ ' + escHtml(tr('Seu perfil pode ficar ainda mais com a sua cara!')) + '</strong><p>' + escHtml(tr('Escolha um emoji e uma cor para personalizar sua identidade no TsuLiPa⭐World.')) + '</p><button type="button" class="btn" id="perfProfileStyleCta">🎨 ' + escHtml(tr('Preencher agora')) + '</button></aside>';
      }
    }
    h += '<h3>🏆 ' + escHtml(tr('Estante de troféus')) + '</h3>' + perfInsHtml(d.insignias || [], meu);
    h += '<h3>📔 ' + escHtml(tr('Diário de carreira')) + '</h3>' + perfDiarioHtml(d, meu);
    if(typeof cardsHtml === 'function') h += '<h3>🃏 ' + escHtml(tr('Últimos cards do Star⭐Gacha!')) + '</h3>' + cardsHtml(d.cards || [], 'perfCards', meu);
    // Center Run: posição geral, recorde por personagem e últimas corridas
    if(!meu){   // no próprio perfil, esses recordes ficam em 🏅 Meus recordes, na tela de início
    h += '<h3>🏁 ' + escHtml(tr('Center Run')) + '</h3>';
    if(d.pos_geral) h += '<p class="perfpos-geral"><span class="perfpos">#' + d.pos_geral + '</span> ' + escHtml(tr('no ranking geral')) + ' · ' + escHtml(tr('Recorde')) + ' <b>' + (+d.best || 0) + '</b></p>';
    if(meu){
      var pp = {}, ks;
      Object.keys(d.por_personagem || {}).forEach(function(k){ var n = k === 'Você' ? 'Idol' : k; pp[n] = Math.max(pp[n] || 0, +d.por_personagem[k] || 0); });   // "Você" = nome antigo do Idol
      ks = Object.keys(pp);
      if(ks.length) h += '<div class="perfchips">' + ks.map(function(k){ return '<span>' + escHtml(k) + ' · <b>' + pp[k] + '</b></span>'; }).join('') + '</div>';
    }
    h += '<h4 class="perfsub">🕒 ' + escHtml(tr('Últimas 5 corridas')) + '</h4><ol class="lb perfult">' + perfUltimas(d.ultimas || [], d.admin_ver) + '</ol>';
    if(d.melhores && d.melhores.length) h += '<h4 class="perfsub">🏆 ' + escHtml(tr('5 melhores corridas')) + '</h4><ol class="lb perfult">' + perfUltimas(d.melhores, d.admin_ver) + '</ol>';
    } else h += '<p class="perfrecaviso">🏅 ' + escHtml(tr('Seus recordes do Center⭐Run!, Sora⭐Jump! e dos outros jogos agora ficam em Meus recordes, na tela de início.')) + '</p>';
    h += '<h3>🎮 ' + escHtml(tr('Minijogos do camarim')) + '</h3><div class="perfmini" id="perfMini">' + (meu ? '<p class="perfcarr">' + escHtml(tr('Carregando...')) + '</p>' : '') + '</div>';
    h += '<h3>🐾 ' + escHtml(tr('Pets')) + '</h3><div class="perfpets" id="perfPets"></div>';
    h += '<h3>💌 ' + escHtml(tr('Recados')) + '</h3>' + perfRecadosHtml(d, meu);
    if(meu) h += perfBioHtml(d) + perfApagarHtml();
    box.innerHTML = h;
    var profileStyleCta = $('perfProfileStyleCta');
    if(profileStyleCta) profileStyleCta.onclick = function(){
      var target = $('perfBioEmoji') || $('perfBioCor');
      if(!target) return;
      var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      if(target.scrollIntoView) target.scrollIntoView({ behavior:reduce?'auto':'smooth', block:'center' });
      try{ target.focus({ preventScroll:true }); }catch(e){ target.focus(); }
    };
    if(meu){ twRankRenderProfile(); twRankLoad(); perfSoraHistNuvem(); if(window.ktTickets){window.ktTickets.renderProfile();window.ktTickets.refresh();} }
    if(typeof cardsDesenhar === 'function') cardsDesenhar(d.cards || [], 'perfCards');
    perfPets(d, meu);
    if(meu) perfMiniCarregar(); else perfMiniUI(null, d.mini || {});
  } else {
    h += '<canvas id="perfGenCv" width="560" height="560" aria-hidden="true"></canvas>';
    if(perfAba === 'montar') h += '<p class="perfdica">' + escHtml(tr('Tudo o que você muda aqui vale para o Idol do jogo.')) + '</p><div class="cust perfmont" id="perfMont"></div><div class="btns"><button type="button" class="btn alt" id="perfLook">💾 ' + escHtml(tr('Salvar look')) + '</button></div><p class="perfmsg" id="perfLookMsg" hidden></p>' +
      '<h3>🛍️ ' + escHtml(tr('Lojinha de roupas')) + '</h3><p class="perfdica">' + escHtml(tr('Roupas que só existem aqui. Depois de comprar, aparecem em Roupa no montador (para todas as personagens).')) + '</p><p class="perfmsg" id="perfLojaMsg" hidden></p><div class="perfloja" id="perfLoja"></div>' +
      '<h3>🎀 ' + escHtml(tr('Acessórios')) + '</h3><p class="perfdica">' + escHtml(tr('Use seus acessórios comprados no montador do Idol.')) + '</p><div class="perfloja" id="perfLojaAcessorios"></div>' +
      '<h3>🍞 ' + escHtml(tr('Itens')) + '</h3><div class="perfloja" id="perfLojaItens"></div>' +
      '<h3>🛍️ ' + escHtml(tr('Lojinha de poses e extras')) + '</h3><p class="perfdica">' + escHtml(tr('Poses e expressões valem para o Estúdio e para a câmera do jogo. Os extras do Moon⭐Duo! liberam cenas e cenários.')) + '</p><p class="perfmsg" id="perfLoja2Msg" hidden></p><div class="perfloja" id="perfLoja2"></div>';
    else h += '<p class="perfmsg" id="perfGenMsg" hidden></p><div class="btns perfbtns" id="perfGenBtns"></div><div class="petph perfopts" id="perfGenOpts"></div>';
    box.innerHTML = h;
    if(perfAba === 'montar'){ perfMontUI(); perfLojaUI(); if(typeof perfLoja2UI === 'function') perfLoja2UI(); } else perfGenUI();
    perfAnimLigar();
  }
}
// Sora⭐Jump!: 5 últimas e 5 melhores subidas da conta (servidor); enquanto carrega, mostra as deste aparelho
function perfSoraListas(ult, mel){
  function li(L){ return (L || []).slice(0, 5).map(function(x){ return '<li><span><small>' + escHtml(perfData(x.at || +x.t || x.d)) + '</small></span><strong>' + Math.max(0, Math.floor(+x.score || 0)) + ' m</strong></li>'; }).join(''); }
  if(!(ult || []).length) return '';
  return '<h4 class="perfsub">🕒 ' + escHtml(tr('Últimas 5 subidas')) + '</h4><ol class="lb perfult">' + li(ult) + '</ol>' +
         ((mel || []).length ? '<h4 class="perfsub">🏆 ' + escHtml(tr('5 melhores subidas')) + '</h4><ol class="lb perfult">' + li(mel) + '</ol>' : '');
}
function perfSoraHist(){
  var g = null;
  try{
    var ls = window.localStorage, r = ls.getItem('__tsulipa_sorajump_test_v1__::brs48cr_hist');
    if(!r || r === '__TW_TEST_DELETED__') r = ls.getItem('brs48cr_hist');
    var d = JSON.parse(r || 'null'); g = d && d.games && d.games.sora_jump;
  }catch(e){}
  return '<div id="perfSoraHist">' + (g ? perfSoraListas(g.last5, g.best5) : '') + '</div>';
}
function perfSoraHistNuvem(){
  if(!contaJ || typeof contaRpc !== 'function') return;
  contaRpc('sora_my_profile').then(function(d){
    var box = $('perfSoraHist');
    if(box && d && Array.isArray(d.ultimas) && d.ultimas.length) box.innerHTML = perfSoraListas(d.ultimas, d.melhores);
  }).catch(function(){});
}
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
function perfInsNv(tem, k){ var n = 0; (tem || []).forEach(function(x){ var p = String(x).split(':'); if(p[0] === k) n = Math.max(n, +p[1] || 1); }); return n; }
function perfInsHtml(tem, meu){
  if(meu && typeof conqLista === 'function') tem = (tem || []).concat(conqLista());   // conquistas dos jogos novos guardadas no aparelho
  perfInsTem = tem || [];
  var tmA = typeof temaAtual === 'function' ? temaAtual() : '';
  var lista = PERF_INS.filter(function(i){ return perfInsNv(tem, i[0]) > 0 || (meu && (!/^(tema_|esp_)/.test(i[0]) || i[0] === 'tema_' + tmA)); });
  // As insígnias sazonais ficam no fim da estante, inclusive quando conquistadas.
  var sazonais = lista.filter(function(i){ return i[0].indexOf('tema_') === 0; });
  lista = lista.filter(function(i){ return i[0].indexOf('tema_') !== 0; }).concat(sazonais);
  if(!lista.length) return '<p class="perfcarr">✧</p>';
  var ganhos = lista.filter(function(i){ return perfInsNv(tem, i[0]) > 0; }).length;
  return '<p class="perfestconta"><b>' + ganhos + '</b> / ' + lista.length + ' ' + escHtml(tr('troféus na estante')) + '</p>' +
    '<div class="perfins perfestante" id="perfIns">' + lista.map(function(i){
    var nv = perfInsNv(tem, i[0]), ok = nv > 0;
    return '<button type="button" class="perfin' + (ok ? ' ok' : '') + '" data-ins="' + i[0] + '" aria-pressed="' + (perfInsSel === i[0]) + '" title="' + escHtml(tr(i[2])) + '"><span>' + (ok ? i[1] : '🔒') + '</span>' + (nv > 1 ? '<i class="perfnv">' + '★★★'.slice(0, nv) + '</i>' : '') + '</button>';
  }).join('') + '</div><p class="perfinsdesc" id="perfInsDesc"' + (perfInsSel ? '' : ' hidden') + '></p>';
}
function perfDarCoracao(){
  var b = $('perfCora'), d = perfAtual;
  if(!contaJ){ perfTopoMsg(tr('Entre com Google para dar coração e deixar recados.')); return; }
  if(d.dei_coracao){ perfTopoMsg('💖 ' + tr('Você deu um coração hoje!')); return; }
  b.disabled = true;
  contaRpc('dar_coracao', { p_nick: d.nick }).then(function(r){
    b.disabled = false;
    if(r && r.ok === false && PERF_REC_ERRO[r.erro]){ perfTopoMsg(tr(PERF_REC_ERRO[r.erro])); return; }   // bloqueado pela moderação
    d.dei_coracao = true; if(r && typeof r.total === 'number') d.coracoes = r.total;
    b.innerHTML = '💖 <b>' + (+d.coracoes || 0) + '</b>'; b.setAttribute('aria-pressed', 'true');
    perfChuvaCoracoes(b);
    perfTopoMsg('💖 ' + tr('Você deu um coração hoje!'));
    if(typeof insConferir === 'function') insConferir();
    [1047, 1319, 1568].forEach(function(f, i){ beep(f, .12, 'sine', .04, i * .07); });
  }).catch(function(){ b.disabled = false; perfTopoMsg(tr('Não deu para falar com o servidor. Tente de novo.')); });
}
function perfChuvaCoracoes(el){   // coraçõezinhos subindo do botão
  var r = el.getBoundingClientRect();
  for(var i = 0; i < 8; i++){
    var s = document.createElement('i'); s.className = 'perfsobe'; s.textContent = ['💖', '💜', '💚', '💙'][i % 4];
    s.style.left = (r.left + r.width / 2 + (Math.random() - .5) * 40) + 'px'; s.style.top = (r.top) + 'px'; s.style.animationDelay = (i * .07) + 's';
    document.body.appendChild(s); setTimeout(function(n){ return function(){ if(n.parentNode) n.parentNode.removeChild(n); }; }(s), 1600);
  }
}
var PERF_REC_ERRO = { palavras:'Essa mensagem tem palavras que não são permitidas.', hoje:'Você já deixou um recado hoje para essa pessoa.', fechado:'Essa pessoa não está recebendo recados.', limite:'Você chegou ao limite de recados de hoje.', login:'Entre com Google para dar coração e deixar recados.', sem_conta:'Entre com Google para dar coração e deixar recados.', tamanho:'Deixe um recado (até 60 letras)' };
function perfRecadosHtml(d, meu){
  var L = Array.isArray(d.recados) ? d.recados : [], h = '';
  if(!meu){
    if(!d.recados_on) h += '<p class="perfcarr">' + escHtml(tr('Essa pessoa não está recebendo recados.')) + '</p>';
    else if(!contaJ) h += '<p class="perfcarr">' + escHtml(tr('Entre com Google para dar coração e deixar recados.')) + '</p>';
    else if(d.recado_hoje) h += '<p class="perfcarr">💌 ' + escHtml(tr('Você já deixou um recado hoje para essa pessoa.')) + '</p>';
    else h += '<div class="perfrecform"><input class="nick perfcampo" id="perfRecTxt" maxlength="60" autocomplete="off" placeholder="' + escHtml(tr('Deixe um recado (até 60 letras)')) + '"><button type="button" class="btn" id="perfRecOk">💌 ' + escHtml(tr('Enviar')) + '</button></div>';
  }
  h += '<p class="perfmsg" id="perfRecMsg" hidden></p>';
  h += L.length ? '<ul class="perfrecs">' + L.map(function(r){
    return '<li><div><button type="button" class="lbn" data-nick="' + escHtml(r.nick) + '">' + escHtml(r.nick) + '</button> <small>' + escHtml(perfData(r.created_at)) + '</small></div><p>' + escHtml(r.texto) + '</p>' +
           (r.pode_apagar || d.admin_ver ? '<button type="button" class="perfrecx" data-id="' + (+r.id) + '"' + (!r.pode_apagar ? ' data-adm="1"' : '') + ' aria-label="✕">✕</button>' : '') + '</li>';
  }).join('') + '</ul>' : '<p class="perfcarr">' + escHtml(tr('Nenhum recado ainda.')) + '</p>';
  if(meu) h += '<label class="perfrecon"><input type="checkbox" id="perfRecOn"' + (d.recados_on !== false ? ' checked' : '') + '> ' + escHtml(tr('Aceitar recados')) + '</label>' +
    '<label class="perfrecon"><input type="checkbox" id="perfDuoOn"' + (d.duo_on !== false ? ' checked' : '') + '> 🌙 ' + escHtml(tr('Aparecer no Moon⭐Duo! e nos outdoors do Center Run')) + '</label>';
  return h;
}
function perfBioHtml(d){
  var cur = d.oshi || '';
  if(PERF_OSHI_JOG && PERF_OSHI_JOG.length){   // só quem joga, agrupado pelo time
    var grupos = [];
    PERF_GRUPOS.forEach(function(g){g.times.forEach(function(t){grupos.push([g.codigo,t.codigo,perfGrupoBandeira(g)+' '+g.nome+' · '+t.nome]);});grupos.push([g.codigo,'',perfGrupoBandeira(g)+' '+g.nome+' · '+tr('Sem time')]);});
    var meuK = perfSlug(d.nick || '');
    var opts = '<option value=""' + (cur ? '' : ' selected') + '>' + escHtml(tr('Sem oshi')) + '</option>' +
      '<option value="tsulipa"' + (cur === 'tsulipa' ? ' selected' : '') + '>🎤🐨👑 ' + escHtml(tr('Trio TsuLiPa')) + '</option>';
    grupos.forEach(function(gp){
      var L = PERF_OSHI_JOG.filter(function(p){ return perfGrupoCodigo(p)===gp[0] && (p.time||'')===gp[1] && perfSlug(p.nick)!==meuK; });
      if(!L.length) return;
      opts += '<optgroup label="' + escHtml(gp[2]) + '">' + L.map(function(p){
        var k = perfSlug(p.nick), o = PERF_OSHI[k] || ['⭐'];
        return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + escHtml(o[0]) + ' ' + escHtml(p.nick) + '</option>'; }).join('') + '</optgroup>';
    });
    if(cur && cur !== 'tsulipa' && !PERF_OSHI_JOG.some(function(p){ return perfSlug(p.nick) === cur; }) && PERF_OSHI[cur])
      opts += '<option value="' + escHtml(cur) + '" selected>' + escHtml(PERF_OSHI[cur][0] + ' ' + PERF_OSHI[cur][1]) + '</option>';
    return perfBioMontar(d, opts);
  }
  var sel2 = '<option value=""' + (cur ? '' : ' selected') + '>' + escHtml(tr('Sem oshi')) + '</option>' + PERF_OSHI_TIMES.map(function(t){
    return '<optgroup label="' + escHtml(tr(t[0])) + '">' + t[1].map(function(m){
      var k = perfOshiKey(m[0]);
      return '<option value="' + k + '"' + (k === cur ? ' selected' : '') + '>' + m[1] + ' ' + escHtml(tr(m[0])) + '</option>'; }).join('') + '</optgroup>';
  }).join('');
  return perfBioMontar(d, sel2);
}
var PERF_EMOJIS = ['🎤','🌸','⭐','💜','💚','💙','🐱','🐨','👑','🍓','🌙','🔥','🦋','🍀','🎀','🐰','🌈','💎','🍰','🐳'];
function perfBioMontar(d, sel2){
  var tm = d.time || '', grupo=perfGrupoCodigo(d), cor = /^#[0-9a-f]{6}$/i.test(d.cor || '') ? d.cor : '#ff6fb5';
  return '<div class="perfbio"><h3>✏️ ' + escHtml(tr('Editar perfil')) + '</h3>' +
    '<label>' + escHtml(tr('Seu emoji')) + ' <input class="nick perfcampo perfemoin" id="perfBioEmoji" maxlength="8" autocomplete="off" value="' + escHtml(d.emoji || '') + '" placeholder="🎤"></label>' +
    '<div class="perfemolist" role="group" aria-label="' + escHtml(tr('Seu emoji')) + '">' + PERF_EMOJIS.map(function(e){ return '<button type="button" data-pemo="' + e + '">' + e + '</button>'; }).join('') + '</div>' +
    '<label>' + escHtml(tr('Sua cor')) + ' <input type="color" id="perfBioCor" value="' + cor + '"></label>' +
    '<label>🌏 ' + escHtml(tr('Grupo')) + ' <select id="perfBioGrupo">' + PERF_GRUPOS.map(function(g){return '<option value="'+escHtml(g.codigo)+'"'+(grupo===g.codigo?' selected':'')+'>'+perfGrupoBandeira(g)+' '+escHtml(g.nome)+'</option>';}).join('')+'</select></label>' +
    '<label>' + escHtml(tr('Seu time')) + ' <select id="perfBioTime"><option value="">' + escHtml(tr('Sem time')) + '</option>' +
      perfGrupo(grupo).times.map(function(t){return '<option value="'+escHtml(t.codigo)+'"'+(t.codigo===tm?' selected':'')+'>'+escHtml(t.nome)+'</option>';}).join('')+'</select></label>' +
    '<label>' + escHtml(tr('Oshi')) + ' <select id="perfBioOshi">' + sel2 + '</select></label>' +
    '<label>' + escHtml(tr('Frase do perfil')) + ' <input class="nick perfcampo" id="perfBioFrase" maxlength="60" autocomplete="off" placeholder="✨ ' + escHtml(tr('Escreva uma frase fofa (até 60 letras)')) + '" value="' + escHtml(d.frase || '') + '"></label>' +
    perfAniverHtml(d) + '<p class="perfmsg" id="perfBioMsg" hidden></p><div class="btns"><button type="button" class="btn" id="perfBioOk">' + escHtml(tr('Salvar')) + '</button></div></div>';
}
// Pets: os seus (do aparelho, os mais atuais) ou os da pessoa (resumo vindo do servidor)
function perfPets(d, meu){
  var box = $('perfPets'), lista = [], ativo = '';
  if(meu && petData && petData.pets){
    ativo = petData.ativo;
    (petData.donos || Object.keys(petData.pets)).forEach(function(k){ var p = petData.pets[k]; if(p) lista.push({ k:k, nome:p.nome, xp:p.xp, cfg:p.cfg, acc:p.acc, bochecha:p.bochecha }); });
  } else if(meu && d.pets && d.pets.pets){
    ativo = d.pets.ativo || '';
    Object.keys(d.pets.pets).forEach(function(k){ var p = d.pets.pets[k] || {}; lista.push({ k:k, nome:p.nome, xp:p.xp, acc:p.acc, cfg:p.cfg }); });
  } else if(!meu && Array.isArray(d.pets)){
    ativo = d.ativo || '';
    lista = d.pets.map(function(p){ return { k:p.k, nome:p.nome, xp:p.xp, acc:p.acc, cfg:p.cfg }; });
  }
  lista = lista.filter(function(p){ return PET_SP[p.k]; });
  if(!lista.length){ box.innerHTML = '<p class="perfcarr">' + escHtml(tr('Nenhum pet ainda.')) + '</p>'; return; }
  box.innerHTML = '';
  lista.forEach(function(p, i){
    var st = PET_STAGES[petStage({ xp: +p.xp || 0 })];
    var el = document.createElement('div'); el.className = 'perfpet' + (p.k === ativo ? ' on' : ''); el.style.animationDelay = (i * .35) + 's';
    var cv = document.createElement('canvas'); cv.width = 144; cv.height = 120; el.appendChild(cv);
    el.insertAdjacentHTML('beforeend', '<b>' + escHtml(p.nome || PET_SP[p.k].n) + '</b><small>' + st[2] + ' ' + escHtml(tr(st[1])) + (p.k === ativo ? ' · ⭐' : '') + '</small>');
    box.appendChild(el);
    perfDesenharPetEm(cv.getContext('2d'), perfPetDoAvatar({ pet:p }) || { k:p.k }, 72, 64, 2.6);
  });
}
function perfMiniCarregar(){
  var box = $('perfMini');
  perfConferir(); var envio = perfSync.hasPending(contaJ && contaJ.nick) ? perfEnviar() : Promise.resolve();   // aguarda a confirmação do save antes de perguntar o ranking
  envio.then(function(){ return contaRpc('ranking_minijogos'); }).then(function(r){ if(box.isConnected) perfMiniUI(r || {}, (perfAtual && perfAtual.mini) || {}); })
       .catch(function(){ if(box.isConnected) perfMiniUI({}, (perfAtual && perfAtual.mini) || {}); });
}
function perfMiniUI(r, resumo){   // r: ranking completo (seu perfil) · resumo: pontos e posição (perfil de outra pessoa)
  var loc = perfMeu ? ((petData && petData.mini && petData.mini.rec) || {}) : {};
  $('perfMini').innerHTML = [['ritmo', '🎵', 'Ritmo'], ['corda', '🪢', 'Pular corda']].map(function(j){
    var R = (r && r[j[0]]) || {}, S = (resumo && resumo[j[0]]) || {};
    var pts = Math.max(+loc[j[0]] || 0, +R.meu || 0, +S.pts || 0), posN = R.pos || S.pos, tot = R.total || S.total || 0, top = Array.isArray(R.top) ? R.top : [];
    var pos = posN ? '<span class="perfpos">#' + posN + ' <small>' + escHtml(tr('de')) + ' ' + tot + '</small></span>' : '';
    var lista = !r ? '' : top.length ? '<ol>' + top.map(function(t, i){
      var eu = contaJ && String(t.nick).toLowerCase() === String(contaJ.nick).toLowerCase();
      return '<li' + (eu ? ' class="eu"' : '') + '><span>' + (['🥇', '🥈', '🥉'][i] || (i + 1) + '.') + ' ' + escHtml(t.nick) + '</span><b>' + (+t.pts || 0) + '</b></li>'; }).join('') + '</ol>'
      : '<p class="perfcarr">' + escHtml(tr('Ninguém jogou ainda.')) + '</p>';
    return '<div class="perfjogo"><div class="perfjtop"><b>' + j[1] + ' ' + escHtml(tr(j[2])) + '</b>' + pos + '</div>' +
           '<small>' + escHtml(tr(perfMeu ? 'Seu recorde' : 'Recorde')) + ': <b>🏆 ' + pts + '</b></small>' + lista + '</div>';
  }).join('');
}
function perfMontUI(){
  if(typeof acessoriosSync==='function') acessoriosSync(); // antes de copiar as opções para o montador do perfil
  var box = $('perfMont'), h = '';
  if(!box) return;   // Zipper⭐Shop! aberta sem o Montar Idol
  function rotulo(id){ var el = $(id), lb = el && el.closest('label'); if(!lb) return ''; var t = ''; [].forEach.call(lb.childNodes, function(n){ if(n.nodeType === 3) t += n.nodeValue; }); return t.trim(); }
  function opts(id, cur){ return [].map.call($(id).options, function(o){ return '<option value="' + escHtml(o.value) + '"' + (o.disabled ? ' disabled' : '') + (o.value === cur ? ' selected' : '') + '>' + escHtml(o.textContent) + '</option>'; }).join(''); }
  function sel(p){ h += '<label>' + escHtml(rotulo(p[0])) + ' <select data-m="' + p[1] + '">' + opts(p[0], CU[p[1]] || '') + '</select></label>'; }
  h += '<label>' + escHtml(rotulo('chair')) + ' <input type="color" data-m="hair" value="' + escHtml(CU.hair) + '"></label>';
  sel(['cback', 'back']);
  h += '<i class="cbr"></i>';
  h += '<label>' + escHtml(rotulo('cstk')) + ' <select data-m="mecha">' + opts('cstk', CU.mecha||(CU.streak?'uma':'')) + '</select> <input type="color" data-m="hair2" value="' + escHtml(CU.hair2) + '"></label>';
  h += '<i class="cbr"></i>';
  sel(['cfront', 'front']); sel(['cdet', 'det']);
  h += '<i class="cbr"></i>';
  h += '<span class="perfskins">' + SK.map(function(sk){ return '<button type="button" class="sw" data-m="skin" data-v="' + sk + '" style="background:' + sk + '" aria-label="' + escHtml(tr('Tom de pele')) + '" aria-pressed="' + (sk === CU.skin) + '"></button>'; }).join('') + '</span>';
  h += '<label>' + escHtml(rotulo('ceye')) + ' <input type="color" data-m="eye" value="' + escHtml(CU.eye) + '"></label><i class="cbr"></i>';
  h += '<label>' + escHtml(rotulo('cout')) + ' <select data-m="out">' + opts('cout', CU.out || '') + '</select> <input type="color" data-m="outcol" value="' + escHtml(CU.outcol || '#ffffff') + '"></label>';
  [['chat', 'hat'], ['cgl', 'gl']].forEach(function(p){ h += '<label>' + escHtml(rotulo(p[0])) + ' <select data-m="' + p[1] + '">' + opts(p[0], p[1]==='hat'&&CU.det==='tulipa'?'tulipa':(CU[p[1]]||'')) + '</select></label>'; });
  h += '<label>' + escHtml(rotulo('acc')) + ' <select data-m="acc">' + opts('acc', CU.det==='torrada'?'torrada':accSel) + '</select></label>';
  box.innerHTML = h;
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
function perfLojaUI(){
  var box = $('perfLoja'); if(!box) return;
  var tmL = perfMeuAniverHoje ? 'aniversario' : (typeof temaAtual === 'function' ? temaAtual() : '');
  var lojaL = PERF_LOJA.filter(function(it){ return !it[4] || it[4] === tmL || perfLojaDono().indexOf(it[0]) >= 0; });
  lojaL.sort(function(a, b){ return (b[4] === tmL && !!tmL) - (a[4] === tmL && !!tmL); });   // a da temporada vem primeiro
  box.innerHTML = lojaL.map(function(it){
    var dono = perfLojaDono().indexOf(it[0]) >= 0, veste = CU.out === it[0], prov = perfProva === it[0];
    var acao = veste ? '<em class="ok">✓ ' + escHtml(tr('Vestindo')) + '</em>' : dono ? '<button type="button" class="btn alt" data-vestir="' + it[0] + '">' + escHtml(tr('Vestir')) + '</button>'
      : '<button type="button" class="btn" data-comprar="roupa_' + it[0] + '"' + (starT < it[3] ? ' disabled' : '') + '>★' + it[3] + '</button>';
    var tag = it[4] && !dono && typeof temaAteTxt === 'function' ? '<small class="perftemp">🗓️ ' + escHtml(tr('Só até')) + ' ' + temaAteTxt() + '</small>' : it[4] ? '<small class="perftemp">🗓️ ' + escHtml(tr('Da temporada')) + '</small>' : '';
    return '<div class="perfroupa' + (prov ? ' on' : '') + (it[4] ? ' temp' : '') + '" data-provar="' + it[0] + '"><canvas width="160" height="160" data-roupa="' + it[0] + '"></canvas><b>' + it[1] + ' ' + escHtml(tr(it[2])) + '</b>' + tag + acao + '</div>';
  }).join('');
  [].forEach.call(box.querySelectorAll('canvas[data-roupa]'), function(cv){
    var av = perfAvAtual({ pose:'v', fundo:'basico' }); av.c.out = cv.dataset.roupa;
    perfDesenharIdol(cv.getContext('2d'), 160, 160, av, true, false, 0);
  });
}
function perfTem(tipo, k){
  if(tipo === 'visual') return !k || perfDono.indexOf(k) >= 0;
  if(tipo === 'fundo') return !k || k === 'basico' || k === 'temporada' || perfDono.indexOf(k === 'cafe' ? 'duo_cafe' : 'fundo_' + k) >= 0;
  if(tipo === 'pose'){ var p = perfPoseInfo(k); return !p || !p[3] || perfDono.indexOf('pose_' + k) >= 0; }
  if(tipo === 'expr') return typeof lojaTem === 'function' ? lojaTem('expr_' + k) : true;
  return true;
}
function perfVisInfo(k){ for(var i = 0; i < PERF_VIS.length; i++) if(PERF_VIS[i][0] === k) return PERF_VIS[i]; return PERF_VIS[0]; }
function perfFundoInfo(k){ if(k==='cafe')return ['cafe','☕','Café kawaii',90]; for(var i = 0; i < PERF_FUNDOS.length; i++) if(PERF_FUNDOS[i][0] === k) return PERF_FUNDOS[i]; return PERF_FUNDOS[0]; }
function perfFaltando(){   // o que está escolhido e ainda não foi comprado: [chave no servidor, emoji + nome, preço]
  var av = perfGenAv, L = [];
  if(!perfTem('visual', av.visual)){ var v = perfVisInfo(av.visual); L.push([v[0], perfRot(v), v[3]]); }
  if(!perfTem('pose', av.pose)){ var p = perfPoseInfo(av.pose); L.push(['pose_' + p[0], perfRot(p), p[3]]); }
  if(!perfTem('fundo', av.fundo)){ var f = perfFundoInfo(av.fundo); L.push([f[0]==='cafe'?'duo_cafe':'fundo_' + f[0], perfRot(f), f[3]]); }
  if(!perfTem('expr', av.expr) && typeof lojaItem === 'function'){ var ei = lojaItem('expr_' + av.expr); if(ei) L.push([ei[0], ei[1] + ' ' + tr(ei[2]), ei[3]]); }
  return L;
}
function perfPetsDono(){   // pets que você tem (para aparecer na foto)
  if(!petData || !petData.pets) return [];
  return (petData.donos || Object.keys(petData.pets)).filter(function(k){ return petData.pets[k] && PET_SP[k]; });
}
function perfGenUI(){
  var av = perfGenAv;
  function grp(label, campo, lista, cur){
    return '<div><span>' + escHtml(tr(label)) + '</span>' + lista.map(function(o){
      var extra = '', preco = campo === 'visual' || campo === 'pose' || campo === 'fundo' ? o[3] : (campo === 'expr' && typeof lojaItem === 'function' && lojaItem('expr_' + o[0])) ? lojaItem('expr_' + o[0])[3] : 0;
      if(preco && !perfTem(campo, o[0])) extra = ' <em>★' + preco + '</em>';
      else if(preco) extra = ' ✓';
      return '<button type="button" data-f="' + campo + '" data-v="' + escHtml(o[0]) + '" aria-pressed="' + (String(cur) === String(o[0])) + '">' + escHtml(perfRot(o)) + extra + '</button>';
    }).join('') + '</div>';
  }
  var vis = PERF_VIS.filter(function(o){ return perfBestConta >= o[4]; });
  var exprs = PET_PH_EXPRS.filter(function(o){ return o[0] !== ''; });
  var pets = [['', '🚫', 'Sem pet']].concat(perfPetsDono().map(function(k){ var p = petData.pets[k]; return [k, PET_SP[k].emo, p.nome || PET_SP[k].n]; }));
  if(av.pet && perfPetsDono().indexOf(av.pet.k) < 0) av.pet = null;
  $('perfGenOpts').innerHTML = grp('Visual', 'visual', vis, av.visual) + grp('Pose', 'pose', PERF_POSES, av.pose) + grp('Expressão', 'expr', exprs, String(av.expr)) +
    grp('Fundo', 'fundo', PERF_FUNDOS.filter(function(o){ return o[0] !== 'temporada' || temaPerfil(); }).concat([['cafe','☕','Café kawaii',90]]), av.fundo) + (pets.length > 1 ? grp('Pet na foto', 'pet', pets, av.pet ? av.pet.k : '') : '');
  var b = $('perfGenBtns'), m = $('perfGenMsg'), falta = perfFaltando();
  if(!falta.length){
    b.innerHTML = '<a class="btn" id="perfPng" download="tsulipa-idol.png" href="#">⬇️ ' + escHtml(tr('Baixar PNG')) + '</a><button type="button" class="btn alt" id="perfUsar">🖼️ ' + escHtml(tr('Usar como foto do perfil')) + '</button>';
    m.hidden = true;
  } else {
    b.innerHTML = falta.map(function(f){
      if(/^(pose|expr)_/.test(f[0])) return '<button type="button" class="btn alt" data-irloja="1">🛍️ ' + escHtml(tr('Na lojinha')) + ': ' + escHtml(f[1]) + ' ★' + f[2] + '</button>';   // poses e expressões só se compram na lojinha
      return '<button type="button" class="btn perfcompra" data-k="' + escHtml(f[0]) + '"' + (starT < f[2] ? ' disabled' : '') + '>' + escHtml(tr('Comprar')) + ' ' + escHtml(f[1]) + ' ★' + f[2] + '</button>'; }).join('');
    var soma = falta.reduce(function(s, f){ return s + f[2]; }, 0);
    m.textContent = tr('Prévia: compre o que está marcado com ★ para baixar e usar.') + (starT < soma ? ' (★ ' + starT + ')' : '');
    m.hidden = false;
  }
  perfGenDesenhar();
  if(!falta.length){
    $('perfPng').onclick = function(){ this.href = perfPng(); this.download = 'tsulipa-idol-' + String(perfAtual.nick).replace(/[^\w-]+/g, '') + '.png'; };   // a foto só é gerada aqui
    $('perfUsar').onclick = perfUsarFoto;
  }
}
// O estúdio e o montador são uma cena animada (como o menu e o camarim), redesenhada a cada 2 quadros
function perfAnimar(ms){
  perfAnimId = 0;
  if(!perfMeu || (perfAba !== 'montar' && perfAba !== 'estudio') || !twAnimacaoVisivel($('perfGenCv'))) return;
  var mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30()),delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta($('perfGenCv'),ms):1,perfPrevT=perfT;perfT+=delta;
  if((mobile30&&TWMotionLifecycle.render30Due($('perfGenCv'),ms))||(!mobile30&&Math.floor((perfT+1e-6)/2)>Math.floor((perfPrevT+1e-6)/2))) perfGenDesenhar();
  perfAnimId = requestAnimationFrame(perfAnimar);
}
function perfAnimLigar(){ if(!perfAnimId) perfAnimId = requestAnimationFrame(perfAnimar); }
var PERF_GEN_DRAW_CHAR={},PERF_GEN_PREVIEW_CHAR={},PERF_GEN_DRAW_AV={c:null,a:'',visual:'',pose:'v',expr:2,fundo:'basico'},PERF_GEN_COLOR_AV={c:null,a:'',visual:'',pose:'v',expr:2,fundo:'basico',pet:null,cor:null};
function perfGenCharAtual(){
  var c=PERF_GEN_DRAW_CHAR;
  for(var i=0;i<PERF_CAMPOS.length;i++){var f=PERF_CAMPOS[i];c[f]=CU[f];}
  c.img=c.hair;
  return c;
}
function perfLojaTem(k){
  var lista=Array.isArray(CU.loja)?CU.loja:[];
  for(var i=0;i<lista.length;i++)if(lista[i]===k&&perfLojaInfo(k))return true;
  return false;
}
function perfGenTemFaltando(){
  var av=perfGenAv;
  if(!perfTem('visual',av.visual))return true;
  if(!perfTem('pose',av.pose))return true;
  if(!perfTem('fundo',av.fundo))return true;
  return !perfTem('expr',av.expr)&&typeof lojaItem==='function'&&!!lojaItem('expr_'+av.expr);
}
function perfGenDesenhar(){
  var cv=$('perfGenCv');if(!cv||!perfGenAv)return;
  var base=perfGenCharAtual(),av=perfGenAv,prev=false;
  av.c=base;av.a=accSel||'';
  if(perfAba==='montar'){
    av=PERF_GEN_DRAW_AV;av.c=base;av.a=accSel||'';av.visual='';av.pose='v';av.expr=2;av.fundo='basico';
    if(perfProva){
      var preview=PERF_GEN_PREVIEW_CHAR;
      for(var i=0;i<PERF_CAMPOS.length;i++){var f=PERF_CAMPOS[i];preview[f]=base[f];}
      preview.img=base.img;preview.out=perfProva;
      av.c=preview;prev=!perfLojaTem(perfProva);
    }
  }else prev=perfGenTemFaltando();
  var x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);
  if(perfMinhaCor){
    var colorAv=PERF_GEN_COLOR_AV;colorAv.c=av.c;colorAv.a=av.a;colorAv.visual=av.visual||'';colorAv.pose=av.pose||'v';colorAv.expr=av.expr;colorAv.fundo=av.fundo;colorAv.pet=av.pet||null;colorAv.cor=perfMinhaCor;av=colorAv;
  }
  perfDesenharIdol(x,cv.width,cv.height,av,true,false,perfT+1);
  if(prev){
    var u=cv.width/320;
    x.save();x.translate(14*u,14*u);
    x.fillStyle='rgba(123,63,240,.85)';x.beginPath();x.roundRect?x.roundRect(0,0,92*u,24*u,12*u):x.rect(0,0,92*u,24*u);x.fill();
    x.fillStyle='#fff';x.font='900 '+Math.round(12*u)+'px "M PLUS Rounded 1c",sans-serif';x.textBaseline='middle';x.textAlign='center';
    x.fillText('★ '+tr('PRÉVIA'),46*u,12.5*u);x.restore();
  }
}
function perfPng(){
  var cv = document.createElement('canvas'); cv.width = 1024; cv.height = 1024;
  var x = cv.getContext('2d');
  perfGenAv.c = perfAvAtual().c; perfGenAv.a = accSel || '';
  perfDesenharIdol(x, 1024, 1024, perfGenAv, true);
  if(perfGenAv.fundo){   // assinatura discreta (só com fundo)
    x.font = '800 26px "M PLUS Rounded 1c",sans-serif'; x.textAlign = 'right'; x.fillStyle = 'rgba(255,255,255,.85)';
    x.shadowColor = 'rgba(30,10,60,.6)'; x.shadowBlur = 6;
    x.fillText(perfAtual.nick + ' · TsuLiPa⭐World', 1000, 1004);
  }
  return cv.toDataURL('image/png');
}
function perfComprar(k, btn){
  var pedido=perfPedido;
  btn.disabled = true;
  contaRpc('comprar_visual', { p_key:k }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); }
    if(perfOv.hidden||pedido!==perfPedido)return;
    var m = $('perfGenMsg');
    if(!r || !r.ok){
      m.hidden = false;
      m.textContent = r && r.erro === 'rank' ? tr('Alcance esse rank para comprar.') : r && r.erro === 'saldo' ? tr('Estrelas insuficientes') : tr('Não deu para falar com o servidor. Tente de novo.');
      btn.disabled = false; if(sfx.hit) sfx.hit(); return;
    }
    perfDono = Array.isArray(r.visuais) ? r.visuais : perfDono.concat(k);
    if(sfx.rank) sfx.rank();
    perfGenUI();
    m = $('perfGenMsg'); m.textContent = '✨ ' + tr('Comprado!'); m.hidden = false;
  }).catch(function(){ if(perfOv.hidden||pedido!==perfPedido)return;btn.disabled = false; var m = $('perfGenMsg'); m.textContent = tr('Não deu para falar com o servidor. Tente de novo.'); m.hidden = false; });
}
function perfUsarFoto(){
  var pedido=perfPedido;
  var g2 = perfGenAv, av = perfAvAtual({ visual: g2.visual, pose: g2.pose, expr: g2.expr, fundo: g2.fundo || 'basico', pet: g2.pet || null });
  var btn = $('perfUsar'); btn.disabled = true;
  perfConferir();
  (av.pet ? perfEnviar() : Promise.resolve()).then(function(){ return contaRpc('salvar_avatar', { p_avatar: av }); }).then(function(r){   // com pet: a nuvem precisa saber que o pet é seu
    if(r&&r.ok){perfMeuAv=av;perfIconeConta();}
    if(perfOv.hidden||pedido!==perfPedido)return;
    btn.disabled = false;
    var m = $('perfGenMsg'); m.hidden = false;
    if(r && r.ok){ perfAtual.avatar = av; perfFotoAtual(); m.textContent = '🖼️ ' + tr('Foto do perfil atualizada!'); if(sfx.card) sfx.card(); }
    else m.textContent = tr({ visual_nao_comprado:'Esse visual ainda não foi comprado.', fundo_nao_comprado:'Esse fundo ainda não foi comprado.', pose_nao_comprada:'Essa pose ainda não foi comprada.', roupa_nao_comprada:'Essa roupa ainda não foi comprada.', pet:'Esse pet ainda não chegou na nuvem. Tente de novo em alguns segundos.' }[r && r.erro] || 'Não deu para falar com o servidor. Tente de novo.');
  }).catch(function(){ if(!perfOv.hidden&&pedido===perfPedido)btn.disabled = false; });
}
function perfIconeConta(){
  var cv = $('contaAv'); if(!cv) return;
  perfFotoRedonda(cv, perfMeuAv && !perfMeuAv.auto ? perfMeuAv : perfAvAtual(), true);
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
  var dono=contaJ&&contaJ.nick;if(!dono)return;
  contaRpc('meu_perfil').then(function(d){
    if(!d||!contaJ||contaJ.nick!==dono) return;
    perfDono = Array.isArray(d.visuais) ? d.visuais.slice() : []; perfLojaSincronizar();
    perfMeuAv = d.avatar || null; perfIconeConta(); perfAdmin = !!d.admin; perfGuardarCor(d.cor);
    if(d.aniver_hoje && typeof aniverFesta === 'function')twTimeoutVisivel(document.documentElement,function(){return !!contaJ&&contaJ.nick===dono;},aniverFesta,1500);   // 🎂 ★50 + card especial, 1 vez por ano
    if(typeof bestcNuvem === 'function') bestcNuvem(d.por_personagem);   // recorde de cada personagem (itens por personagem)
    if(d.avatar && !d.avatar.auto) return;
    return contaRpc('salvar_avatar', { p_avatar: perfAvAtual({ auto:true }) });
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

// Diário de carreira: linha do tempo de marcos, montada com o que o perfil já traz (e, no próprio perfil,
// com o que fica no aparelho: receitas do Happy⭐Cafe!, recorde do Handshake e conquistas dos jogos novos).
function perfDiarioHtml(d, meu){
  var itens = [], n = function(v){ return (+v || 0).toLocaleString('pt-BR'); };
  if(d.desde) itens.push(['🌱', tr('Estreia no TsuLiPa⭐World'), String(d.desde).slice(0, 10).split('-').reverse().join('/')]);
  var c = +d.corridas || 0;
  [1, 10, 50, 100, 500, 1000].forEach(function(m){ if(c >= m) itens.push(['🏃', m === 1 ? tr('Primeira corrida no Center⭐Run!') : tr('{n} corridas no Center⭐Run!').replace('{n}', n(m)), '']); });
  var ce = +d.centers || 0;
  if(ce >= 1) itens.push(['👑', tr('Primeiro Center!'), '']);
  [10, 50, 100].forEach(function(m){ if(ce >= m) itens.push(['👑', tr('{n} Centers').replace('{n}', n(m)), '']); });
  if(+d.best > 0) itens.push(['🏆', tr('Recorde no Center⭐Run!'), n(d.best) + ' ' + tr('pts')]);
  var ins = (d.insignias || []).concat(meu && typeof conqLista === 'function' ? conqLista() : []);
  var nomes = {}; PERF_INS.forEach(function(i){ nomes[i[0]] = i; });
  ins.forEach(function(x){ var k = String(x).split(':')[0], i = nomes[k]; if(i) itens.push([i[1], tr('Insígnia: {n}').replace('{n}', tr(i[2])), '']); });
  if(+d.coracoes > 0) itens.push(['💖', tr('Corações recebidos'), n(d.coracoes)]);
  if(meu){
    try{ var rec = JSON.parse(localStorage.getItem('tw_cafe_receitas')) || {}, nr = Object.keys(rec).length; if(nr) itens.push(['📒', tr('Receitas no Caderno do Happy⭐Cafe!'), nr + '/20']); }catch(e){}
    try{ var rc = +localStorage.getItem('tw_cafe_recorde') || 0; if(rc) itens.push(['🧋', tr('Recorde no Happy⭐Cafe!'), n(rc) + ' ' + tr('pts')]); }catch(e){}
    try{ var rh = +localStorage.getItem('tw_handshake_recorde') || 0; if(rh) itens.push(['🤝', tr('Recorde no Handshake⭐Event!'), n(rh) + ' ' + tr('pts')]); }catch(e){}
  }
  if(!itens.length) return '<p class="perfcarr">' + escHtml(tr('A sua história começa na primeira corrida!')) + '</p>';
  return '<ol class="perfdiario">' + itens.map(function(i){ return '<li><span class="pdemo">' + i[0] + '</span><b>' + escHtml(i[1]) + '</b>' + (i[2] ? '<small>' + escHtml(i[2]) + '</small>' : '') + '</li>'; }).join('') + '</ol>';
}
