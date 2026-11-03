/* Evento da semana — um tema que muda toda segunda-feira (horário de Brasília) e liga os jogos novos:
   • Happy⭐Cafe!: metade dos pedidos usa a bebida/docinho da semana, que valem +50;
   • Handshake⭐Event!: o presente da semana aparece em toda fila e vale +50;
   • Pedido de fã: mostra o tema da semana quando não há tema de data (Natal, Halloween…);
   • Banner da tela de início: plaquinha "Semana do …".
   Também guarda as conquistas locais dos jogos novos (insígnias visuais) e o pet que passeia nos jogos. */
var EVENTOS = [   // [chave, emoji, nome, base do café, docinho do café, emoji do presente no Handshake, cor]
  ['morango',  '🍓', 'Semana do Morango',  3, 0, '🍓', '#ff6fb5'],
  ['chocolate','🍫', 'Semana do Chocolate', 2, 1, '🍰', '#8a5236'],
  ['matcha',   '🍵', 'Semana do Matcha',    1, 2, '🌸', '#5fb04a'],
  ['estrelas', '⭐', 'Semana das Estrelas', 4, 3, '⭐', '#7b3ff0'],
  ['cafe',     '☕', 'Semana do Café',      0, 0, '🧁', '#a0673a']
];
function eventoSemana(){   // índice da semana (segunda a domingo, Brasília)
  var d = Math.floor((Date.now() - 3 * 36e5) / 864e5) + 3;   // 01/01/1970 foi quinta: +3 alinha na segunda
  return Math.floor(d / 7);
}
function eventoAtual(){ var e = EVENTOS[eventoSemana() % EVENTOS.length]; return { k:e[0], emo:e[1], nome:e[2], base:e[3], doce:e[4], pres:e[5], cor:e[6] }; }
function eventoPresente(){   // índice do presente da semana na lista do Handshake
  var ev = eventoAtual(); for(var i = 0; i < HS_PRESENTES.length; i++) if(HS_PRESENTES[i][0] === ev.pres) return i; return 0;
}
function eventoBanner(x, W2, H2){   // plaquinha no canto do banner
  var ev = eventoAtual(), txt = ev.emo + ' ' + tr(ev.nome);
  x.save(); var fs = Math.max(11, Math.round(H2 * .055)); x.font = '900 ' + fs + 'px "M PLUS Rounded 1c",sans-serif';
  var w = x.measureText(txt).width + fs * 1.4, h = fs * 1.9, px = (W2 - w) / 2, py = 8;
  x.fillStyle = 'rgba(255,255,255,.92)'; x.beginPath(); if(x.roundRect) x.roundRect(px, py, w, h, h / 2); else x.rect(px, py, w, h); x.fill();
  x.fillStyle = ev.cor; x.fillRect(px + h / 2, py + h - 3, w - h, 3);
  x.fillStyle = '#3c2a8f'; x.textBaseline = 'middle'; x.fillText(txt, px + fs * .7, py + h / 2 + 1); x.restore();
}

/* Conquistas locais antigas permanecem preservadas. A conta só recebe as três novas
   insígnias com prova do servidor em players.insignias_jogos. */
var CONQ_KEY = 'tw_conquistas';
function conqLer(){ try{ return JSON.parse(localStorage.getItem(CONQ_KEY)) || {}; }catch(e){ return {}; } }
function conqTem(k){ return !!conqLer()[k]; }
function conqGanhar(k){   // devolve true se é nova somente no registro visual deste aparelho
  var c = conqLer(), nova = !c[k];
  if(nova){ c[k] = Date.now(); try{ localStorage.setItem(CONQ_KEY, JSON.stringify(c)); }catch(e){} }
  // Tentar sincronizar inclusive conquistas locais antigas; a RPC verifica provas, jamais confia na chave.
  if(typeof contaJ !== 'undefined' && contaJ) contaRpc('conquista_jogo', {p_k:k}).then(function(r){
    if(r && r.ok && typeof recCarregar === 'function') recCarregar();
  }).catch(function(){});
  return nova;
}
function conqLista(){ var c = conqLer(); return Object.keys(c).map(function(k){ return k + ':1'; }); }

/* Pet do jogador passeando pelos jogos novos (só se tiver pet no camarim). */
function eventoPet(){
  try{ if(!petData && typeof petLoad === 'function') petLoad(); }catch(e){}
  if(typeof petData === 'undefined' || !petData || !petData.ativo || !petData.pets || !petData.pets[petData.ativo]) return null;
  var p = petData.pets[petData.ativo];
  return { k:petData.ativo === 'meu' ? 'meu' : petData.ativo, acc:p.acc || '', cfg:petData.ativo === 'meu' ? p.cfg : null, nome:p.nome || '' };
}
/* Reações dos pets nos minijogos: reaproveitam o sprite e a voz do Backstage⭐Pet!,
   sem balões, timers extras ou som automático. Cada cena guarda só sua área de toque. */
var eventoPetCenas = Object.create(null);
function eventoPetResetar(modo){ delete eventoPetCenas[modo]; }
function eventoPetReagir(modo, t, comSom){
  var p = eventoPet(), cena = eventoPetCenas[modo];
  if(!p || !cena) return false;
  if(cena.reacao && t - cena.reacao.inicio < 16 &&
     (!comSom || (cena.ultimoSom != null && t - cena.ultimoSom < 16))) return true;
  cena.reacao = { inicio:t, emoji:p.k === 'tsu' ? '💜' : p.k === 'lirika' ? '💚' : p.k === 'pati' ? '⭐' : '💖' };
  if(comSom && typeof petVoice === 'function'){
    try{ petVoice(typeof petAtivo === 'function' ? petAtivo() : null, p.k); }catch(e){}
    cena.ultimoSom = t;
  }
  return true;
}
function eventoPetToque(modo, px, py, t){
  var cena = eventoPetCenas[modo];
  if(!cena || !eventoPet()) return false;
  if(Math.abs(px - cena.x) > Math.max(28, cena.escala * 23) ||
     Math.abs(py - cena.y) > Math.max(27, cena.escala * 25)) return false;
  return eventoPetReagir(modo, t, true);
}
function eventoPetDesenhar(x, W2, chao, t, s, alvoX, modo){   // passeia, reage ao carinho e brilha sem balões
  var p = eventoPet();
  if(!p || typeof perfDesenharPetEm !== 'function'){
    if(modo) eventoPetResetar(modo);
    return null;
  }
  var vai = alvoX != null ? alvoX : W2 * (.5 + .42 * Math.sin(t / 260));
  var cena = modo ? (eventoPetCenas[modo] || (eventoPetCenas[modo] = {})) : null;
  var idade = cena && cena.reacao ? t - cena.reacao.inicio : 999;
  if(cena){
    cena.x = vai; cena.y = chao; cena.escala = s;
    if(idade >= 76 || idade < 0){ cena.reacao = null; idade = 999; }
  }
  var pulo = Math.abs(Math.sin(t / 9)) * 3 + (idade < 76 ? Math.abs(Math.sin(idade / 5)) * 11 : 0);
  try{
    if(idade < 34 && typeof drawPet === 'function')
      drawPet(x, p.k === 'meu' ? (p.cfg || PET_MK_DEF) : p.k, vai, chao - pulo, s, t, 'amor', p);
    else perfDesenharPetEm(x, p, vai, chao - pulo, s, t);
  }catch(e){}
  if(cena){
    x.save();
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '900 ' + Math.round(9 + s * 2) + 'px sans-serif';
    x.fillStyle = '#fff6b2';
    x.globalAlpha = .35 + .25 * Math.sin(t / 12);
    x.fillText('✦', vai - s * 18, chao - s * 14 - Math.sin(t / 14) * 3);
    x.fillStyle = '#ff94ce';
    x.globalAlpha = .42 + .25 * Math.sin(t / 16 + 2);
    x.fillText('✧', vai + s * 17, chao - s * 8 + Math.cos(t / 13) * 3);
    if(idade < 76){
      var sobe = idade * .65, alfa = Math.max(0, 1 - idade / 76);
      x.globalAlpha = alfa;
      x.font = Math.round(16 + s * 5) + 'px sans-serif';
      x.fillText(cena.reacao.emoji, vai, chao - s * 23 - sobe);
      x.font = '900 ' + Math.round(13 + s * 2) + 'px sans-serif';
      x.fillStyle = '#fff3a2';
      x.fillText('✦', vai - s * 23 - idade * .12, chao - s * 13 - sobe * .65);
      x.fillStyle = '#ff8dcc';
      x.fillText('✦', vai + s * 22 + idade * .1, chao - s * 25 - sobe * .45);
    }
    x.restore();
  }
  return vai;
}
