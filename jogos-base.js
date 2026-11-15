/* TsuLiPa⭐World — base do Handshake⭐Event! e do Happy⭐Cafe! (carrega na abertura).
   Só o que o resto do site lê sem abrir os jogos: nomes e presentes dos fãs, lembranças do Handshake,
   bases do café (Idol⭐News!) e os cartões do Hub. O jogo em si (handshake.js, cafe.js, cafe-*.js e flores.js)
   baixa no primeiro toque pelo atalho do index.html (hsAbrir/cfAbrir). Este arquivo só declara. */
// ---------- Handshake⭐Event! ----------
// Nomes dos fãs/clientes em estilo mangá (sílabas misturadas, nomes inventados).
var HS_NOMES = ['Usamado', 'Homina', 'Sayami', 'Kyorin', 'Hanoka', 'Mayoka', 'Minarei', 'Makohan', 'Amimi', 'Chibiko', 'Usahana', 'Rinako', 'Lucimi', 'Kyomami', 'Sakuhime', 'Pichiru', 'Kururun', 'Purinne', 'Momorin', 'Kiraho', 'Nyamomo', 'Reiyu', 'Homika', 'Madomi', 'Hanorei', 'Mamiyu', 'Ritako', 'Minaka', 'Sayaren', 'Lunami'];
// Nomes antigos: continuam valendo para as lembranças que já estão salvas nos aparelhos.
var HS_NOMES_ANTIGOS = ['Nana', 'Kiko', 'Lulu', 'Momo', 'Rafi', 'Yumi', 'Toto', 'Pipo', 'Mel', 'Juju', 'Cacau', 'Lili', 'Koko', 'Duda', 'Nino', 'Mimi', 'Teté', 'Bubu', 'Fifi', 'Gigi', 'Zezé', 'Biba', 'Tuca', 'Dodô', 'Lalá', 'Chico', 'Pururu', 'Nunu', 'Kaká', 'Pepê'];
var HS_PRESENTES = [   // [emoji, nome, grupo]: as opções erradas vêm de preferência do mesmo grupo (fica mais difícil)
  ['🍓', 'Morango', 'doce'], ['🍰', 'Bolo', 'doce'], ['🍬', 'Bala', 'doce'], ['🧁', 'Cupcake', 'doce'], ['🍙', 'Onigiri', 'doce'],
  ['🎀', 'Laço', 'fofo'], ['🧸', 'Ursinho', 'fofo'], ['💌', 'Cartinha', 'fofo'], ['🌸', 'Flor', 'fofo'],
  ['🌙', 'Lua', 'brilho'], ['💎', 'Joia', 'brilho'], ['🎵', 'Música', 'brilho'], ['⭐', 'Estrelinha', 'brilho'], ['🌈', 'Arco-íris', 'brilho']];
// Jeitos dos fãs: muda como se apresentam e como reagem
var HS_JEITOS = {
  animado: { oi:['Aaah, é você! Eu sou {n}!', 'Oi oi! Sou {n}!'], fav:'Eu AMO {p}!', ok:['Você lembrou! 💖', 'Aaaah! Vou contar pra todo mundo!'], erro:['Ah… era {p}! 🥲'] },
  timido:  { oi:['É-é um prazer… sou {n}.', 'Oi… eu sou {n}.'], fav:'Eu gosto de {p}…', ok:['Você lembrou de mim… 🥹', 'O-obrigado!'], erro:['Tudo bem… era {p}.'] },
  fofo:    { oi:['Oiê! Me chamo {n}!', 'Olá! Sou {n}!'], fav:'Meu favorito: {p}!', ok:['Que fofo! 💕', 'Yay! Acertou!'], erro:['Hehe, era {p}!'] }
};
function hsNomesLivres(){   // nunca usa um nome igual ao de um jogador real
  var reais = {}; ((typeof hubIdolsDados !== 'undefined' && hubIdolsDados && hubIdolsDados.idols) || []).forEach(function(p){ reais[String(p.nick).toLowerCase()] = 1; });
  if(contaJ && contaJ.nick) reais[String(contaJ.nick).toLowerCase()] = 1;
  return HS_NOMES.filter(function(n){ return !reais[n.toLowerCase()]; });
}
// Pequenas lembranças de fãs NPCs (somente neste aparelho e nesta conta; nunca dão prêmios).
// Preserva o visual do fã para que o reencontro no Café seja reconhecível.
var HS_MEMORIA_CHAVE = 'tw_hs_memorias_v1:';
function hsMemChave(){
  var id = typeof contaJ !== 'undefined' && contaJ && (contaJ.id || contaJ.nick);
  return id ? HS_MEMORIA_CHAVE + String(id) : '';
}
function hsMemLer(){
  var chave = hsMemChave(); if(!chave) return [];
  try{
    var lista = JSON.parse(localStorage.getItem(chave) || '[]');
    return Array.isArray(lista) ? lista.filter(function(m){
      return m && (HS_NOMES.indexOf(m.nome) >= 0 || (typeof HS_NOMES_ANTIGOS !== 'undefined' && HS_NOMES_ANTIGOS.indexOf(m.nome) >= 0)) && Number.isInteger(m.pres) && m.pres >= 0 && m.pres < HS_PRESENTES.length;
    }).slice(0, 8) : [];
  }catch(e){ return []; }
}
// A visita bem atendida no Café abre um reencontro transitório, sem alterar memórias salvas.
var hsCafePendente = null;
function hsHubHtml(){
  var feito = false; try{ feito = localStorage.getItem('tw_hs_dia') === new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }catch(e){}
  return '<button type="button" class="hubcard hubhandshake' + (feito ? '' : ' tw-alert-pink') + '" data-ir="handshake">' + (feito ? '' : '<em class="hubalerta" aria-hidden="true">!</em>') + '<i>🤝</i><b translate="no">Handshake⭐Event!</b><small class="tw-hubgame-jp" lang="ja">握手会</small><small>' + escHtml(tr('Lembre o presente de cada fã!')) + '</small></button>';
}
// ---------- Happy⭐Cafe! ----------
var CF_BASES = [['☕', 'Café gelado', '#8a5a3b'], ['🍵', 'Matcha latte', '#9fd18b'], ['🍫', 'Chocolate', '#6b3b2a'], ['🍓', 'Frappé de morango', '#ff9cc4'], ['🫐', 'Shake de mirtilo', '#a99cff']];
// Só consulta as lembranças já existentes do Handshake; a visita escolhida não é salva.
function cfVisitasMemorias(){
  if(typeof hsMemLer !== 'function' || typeof hsNomesLivres !== 'function') return [];
  var livres = hsNomesLivres();
  return hsMemLer().filter(function(m){ return livres.indexOf(m.nome) >= 0; });
}
function cfHubHtml(){
  var feito = false; try{ feito = localStorage.getItem('tw_cf_dia') === new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }catch(e){}
  return '<button type="button" class="hubcard hubcafe' + (feito ? '' : ' tw-alert-pink') + '" data-ir="cafe">' + (feito ? '' : '<em class="hubalerta" aria-hidden="true">!</em>') + '<i>🧋</i><b translate="no">Happy⭐Cafe!</b><small class="tw-hubgame-jp" lang="ja">ハッピー・カフェ</small><small>' + escHtml(tr('Monte shakes e frappés para os fãs!')) + '</small></button>';
}
