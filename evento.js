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

/* Conquistas dos jogos novos (insígnias visuais na Estante de troféus). Ficam no aparelho e, quando o
   servidor tiver a função conquista_jogo (proposta SQL), também na conta. */
var CONQ_KEY = 'tw_conquistas';
function conqLer(){ try{ return JSON.parse(localStorage.getItem(CONQ_KEY)) || {}; }catch(e){ return {}; } }
function conqTem(k){ return !!conqLer()[k]; }
function conqGanhar(k){   // devolve true se é nova
  var c = conqLer(); if(c[k]) return false;
  c[k] = Date.now(); try{ localStorage.setItem(CONQ_KEY, JSON.stringify(c)); }catch(e){}
  if(typeof contaJ !== 'undefined' && contaJ) contaRpc('conquista_jogo', { p_k:k }).catch(function(){});
  return true;
}
function conqLista(){ var c = conqLer(); return Object.keys(c).map(function(k){ return k + ':1'; }); }

/* Pet do jogador passeando pelos jogos novos (só se tiver pet no camarim). */
function eventoPet(){
  try{ if(!petData && typeof petLoad === 'function') petLoad(); }catch(e){}
  if(typeof petData === 'undefined' || !petData || !petData.ativo || !petData.pets || !petData.pets[petData.ativo]) return null;
  var p = petData.pets[petData.ativo];
  return { k:petData.ativo === 'meu' ? 'meu' : petData.ativo, acc:p.acc || '', cfg:petData.ativo === 'meu' ? p.cfg : null, nome:p.nome || '' };
}
function eventoPetDesenhar(x, W2, chao, t, s, alvoX){   // anda de um lado pro outro (ou até alvoX), com pulinhos
  var p = eventoPet(); if(!p || typeof perfDesenharPetEm !== 'function') return null;
  var vai = alvoX != null ? alvoX : W2 * (.5 + .42 * Math.sin(t / 260)), pulo = Math.abs(Math.sin(t / 9)) * 3;
  try{ perfDesenharPetEm(x, p, vai, chao - pulo, s, t); }catch(e){}
  return vai;
}
