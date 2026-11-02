/* Encontro do dia — um membro (ou dupla/trio) aparece dançando com uma mensagem, 1 vez por dia.
   Extraído do index.html em 02/11/2026 (refatoração da PR #62, Etapa 5), sem mudar nada: mesmo nome, mesmo código.
   Este arquivo só DECLARA funções e tabelas fixas; carrega antes do script principal do index.html, que executa
   tudo na mesma ordem de antes (janela, botão do Encontro, estado, listeners e inicialização continuam lá). */
var ENC_KEY = 'brs48cr_enc';   // chave nova (não renomeia nenhuma antiga): { dia, nick, avatar, fala }
var encDados = null, encAnim = 0, encT = 0, encRenderGrupo = [], encRenderOrdem = [];
var ENC_POSES = ['v','tchau','banzai','coracao','luz','mic'];
var ENC_POS_SOLO = [.5], ENC_POS_DUPLA = [.3,.7], ENC_POS_TRIO = [.5,.2,.8];
function encPrepararRender(d){
  encRenderGrupo.length=0;
  function adicionar(o){
    var a=JSON.parse(JSON.stringify(o.avatar||{}));
    a.pet=null;
    if(typeof a.visual==='string'&&PERF_RANKVIS[a.visual])a.visual='';
    encRenderGrupo.push(a);
  }
  adicionar(d);
  var extras=Array.isArray(d.extras)?d.extras:[];
  for(var i=0;i<extras.length;i++)adicionar(extras[i]);
  encRenderOrdem.length=0;
  for(var j=1;j<encRenderGrupo.length;j++)encRenderOrdem.push(j);
  if(encRenderGrupo.length)encRenderOrdem.push(0);
  encPos=encRenderGrupo.length===3?ENC_POS_TRIO:encRenderGrupo.length===2?ENC_POS_DUPLA:ENC_POS_SOLO;
}
function encHoje(){ return dk(); }   // dia de hoje no horário de Brasília (AAAA-MM-DD)
function encDono(){ return contaJ && contaJ.nick ? String(contaJ.nick).toLowerCase() : ''; }   // de quem é o encontro guardado ('' = sem login)
function encLer(){ try{ var j = JSON.parse(localStorage.getItem(ENC_KEY) || 'null'); return j && j.dia === encHoje() && (j.dono || '') === encDono() ? j : null; }catch(e){ return null; } }
function encOrdem(d){   // da esquerda para a direita, como aparecem no palco: trio = extra 1, principal, extra 2
  var ex = (Array.isArray(d.extras) ? d.extras : []).filter(function(o){ return o && o.nick; });
  return ex.length >= 2 ? [ex[0], d, ex[1]] : [d].concat(ex);
}
function encNomes(d){ return encOrdem(d).map(function(o){ return o.nick; }).join(' & '); }   // dupla/trio: todos os nomes, na ordem do palco
function encCorDe(o){   // cor do perfil (lightstick); sem ela, a do cabelo
  var a = (o && o.avatar) || {}, c = a.c || {};
  return [a.cor, c.luz, c.hair].filter(function(v){ return /^#[0-9a-f]{6}$/i.test(v || ''); })[0] || '#ff6fb5';
}
function encCoracao(h){   // mesmo coração colorido do Karaoke⭐Time!
  var n = parseInt(String(h).slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, dd = mx - mn;
  if(dd < .12) return l > .75 ? '🤍' : l < .25 ? '🖤' : '💜';
  var hue = mx === r ? ((g - b) / dd + (g < b ? 6 : 0)) * 60 : mx === g ? ((b - r) / dd + 2) * 60 : ((r - g) / dd + 4) * 60;
  return hue < 15 || hue >= 345 ? '❤️' : hue < 40 ? '🧡' : hue < 70 ? '💛' : hue < 165 ? '💚' : hue < 250 ? '💙' : hue < 290 ? '💜' : '💗';
}
function encBtnUI(){
  var feito = encLer();
  encBtn.innerHTML = feito
    ? '🌟 ' + escHtml(tr('Encontro de hoje')) + ': <b>' + escHtml(encNomes(feito)) + '</b><small class="tw-hubgame-jp" lang="ja">今日の出会い</small><small>' + escHtml(tr('ver de novo')) + '</small>'
    : '🌟 <b>' + escHtml(tr('Encontro do dia')) + '</b><small class="tw-hubgame-jp" lang="ja">今日の出会い</small><small>' + escHtml(tr('Quem vai aparecer hoje?')) + '</small>';
  encBtn.classList.toggle('feito', !!feito);
}
function encMostrar(d){
  encDados = d; encT = 0; encPrepararRender(d);
  var ex = Array.isArray(d.extras) ? d.extras : [];
  var encPainel = encOv.querySelector('.encp');
  if(encPainel) encPainel.classList.toggle('enc-grupo', ex.length > 0);
  $('encTopo').textContent = '🌟 ' + tr(ex.length === 2 ? 'Trio do dia!' : ex.length === 1 ? 'Dupla do dia!' : 'Encontro do dia');
  $('encNick').textContent = encNomes(d);
  $('encFala').textContent = tr(d.fala);
  var cc = $('encCoracoes'); cc.hidden = ex.length === 0; cc.innerHTML = ex.length ? encOrdem(d).map(function(o){ return '<span>' + encCoracao(encCorDe(o)) + '</span>'; }).join('') : '';
  var ri = rankOf(+d.best || 0), os = d.oshi && PERF_OSHI[d.oshi];
  $('encRk').textContent = tr(RANKS[ri][1]) + ' · 🏆 ' + (+d.best || 0); $('encSelo').textContent = PERF_RANK_EMO[ri] || '⭐';
  var oe = $('encOshi'); oe.hidden = ex.length > 0 || !os; if(os && ex.length === 0){ oe.textContent = '推し ' + os[0] + ' ' + tr(os[1]); oe.style.background = os[2]; oe.style.color = perfCorTexto(os[2]); }
  $('encFoto').textContent = '📸 ' + tr('Foto');
  $('encDuo').textContent = '🌙 Moon⭐Duo!'; $('encDuo').hidden = !contaJ;
  $('encPerfil').textContent = tr('Ver perfil');
  encOv.hidden = false; if(!encAnim) encAnim = requestAnimationFrame(encLoop);
  if(!muted){ try{ var ea = new Audio('./audio/encontro.mp3?v=1'); ea.volume = .5; var ep = ea.play(); if(ep && ep.catch) ep.catch(function(){ [784, 988, 1175, 1568].forEach(function(f, i){ beep(f, .12, 'triangle', .035, i * .09); }); }); }catch(e){} }   // 会いたかった!!
}
function encLoop(ms){
  encAnim = 0; if(!encDados||!twAnimacaoVisivel($('encCv'))) return; var mobile30=!!(window.TWMotionLifecycle&&TWMotionLifecycle.isMobileRender30()),delta=window.TWMotionLifecycle?TWMotionLifecycle.frameDelta($('encCv'),ms):1,encPrevT=encT;encT+=delta;
  if((mobile30&&TWMotionLifecycle.render30Due($('encCv'),ms))||(!mobile30&&Math.floor((encT+1e-6)/2)>Math.floor((encPrevT+1e-6)/2))){
    var cv = $('encCv'), x = cv.getContext('2d'), grupo = encRenderGrupo;
    try{ x.clearRect(0, 0, cv.width, cv.height); encCena(x, cv.width, cv.height, encT);
      var pulo = Math.abs(Math.sin(encT * .12)) * 10;
      encHalo(x, cv.width / 2, cv.height * .56 - pulo, encT);
      encEmojis(x, cv.width, cv.height, encT);   // atrás de todo mundo: os emojis não cobrem o rostinho
      var W2 = cv.width, H2 = cv.height, n = grupo.length, esc = n === 3 ? .58 : n === 2 ? .7 : 1, pos = encPos, fase = Math.floor(encT / 70);
      for(var oi=0;oi<encRenderOrdem.length;oi++){
        var i=encRenderOrdem[oi],a=grupo[i],pj=n>1?Math.abs(Math.sin(encT*.12+i*1.3))*8:pulo,tq=encT-(encToque[i]||-999);
        a.pose=ENC_POSES[(fase+i*2)%ENC_POSES.length];a.expr=(fase+i)%2?3:2;
        if(tq>=0&&tq<46){pj+=Math.sin(tq/46*Math.PI)*34;a.pose='banzai';a.expr=3;}
        x.save();x.translate(W2*pos[i]-W2*esc/2,H2*(1-esc)-pj);x.scale(esc,esc);perfDesenharIdol(x,W2,H2,a,false,false,encT+i*30);x.restore();
      }
      encToqueBolhas(x, encT);
    }catch(e){}
  }
  encAnim = requestAnimationFrame(encLoop);
}
var encToque = {}, encPos = [.5], encBolhas = [];
function encToqueBolhas(x, t){   // corações do toque, por cima, mas subindo acima da cabeça
  for(var i=encBolhas.length-1;i>=0;i--)if(t-encBolhas[i].t0>=50)encBolhas.splice(i,1);
  x.save();x.textAlign='center';x.textBaseline='middle';
  for(var j=0;j<encBolhas.length;j++){var b=encBolhas[j],k=(t-b.t0)/50;x.globalAlpha=1-k;x.font=(18+k*8)+'px sans-serif';x.fillText(b.e,b.x+Math.sin(k*7+b.x)*10,b.y-k*60);}
  x.restore();
}
function encAbrirNovo(d){   // mostra o encontro e entrega as ★3 (1 vez por dia, conferido no servidor)
  d.dono = encDono();
  try{ localStorage.setItem(ENC_KEY, JSON.stringify(d)); }catch(e){}
  encBtnUI(); encMostrar(d);
  $('encPremio').hidden = true;
  if(contaJ && !d.premiado) contaRpc('encontro_premio', { p_nick: d.nick }).then(function(r){
    if(r && typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(e){} setBest(); }
    if(r && r.ok){ var pm = $('encPremio'); pm.textContent = '⭐ +' + r.ganho + ' ' + tr('estrelinhas pelo encontro!'); pm.hidden = false; if(sfx.card) sfx.card(); }
  }).catch(function(){});
}
function encCena(x, W2, H2, t){
  var gr = x.createLinearGradient(0, 0, 0, H2); gr.addColorStop(0, '#2b1a6b'); gr.addColorStop(.55, '#7b3ff0'); gr.addColorStop(1, '#ff9ccd');
  x.fillStyle = gr; x.fillRect(0, 0, W2, H2);
  for(var i = 0; i < 30; i++){ x.globalAlpha = .35 + .35 * Math.sin(t * .05 + i * 1.7); x.fillStyle = '#fff'; x.fillRect(cenaHash(i) * W2, cenaHash(i + 50) * H2 * .5, 2, 2); } x.globalAlpha = 1;
  x.fillStyle = 'rgba(255,240,200,.9)'; x.beginPath(); x.arc(W2 * .82, H2 * .16, 18, 0, 7); x.fill();
  x.fillStyle = 'rgba(255,255,255,.35)'; [[.18, .2], [.6, .12]].forEach(function(n, j){ var nx = (n[0] * W2 + t * (.15 + j * .1)) % (W2 + 80) - 40, ny = n[1] * H2; x.beginPath(); x.arc(nx, ny, 14, 0, 7); x.arc(nx + 16, ny - 6, 17, 0, 7); x.arc(nx + 34, ny, 13, 0, 7); x.fill(); });
  var base = H2 * .8;
  for(i = 0; i < 11; i++){ var bw = 34 + cenaHash(i * 3) * 26, bh = 50 + cenaHash(i * 7) * 90, bx = i * 40 - 10; x.fillStyle = 'rgba(43,26,107,.55)'; x.fillRect(bx, base - bh, bw, bh);
    x.fillStyle = 'rgba(255,225,140,.45)'; for(var wy = base - bh + 8; wy < base - 8; wy += 14) for(var wx = bx + 6; wx < bx + bw - 6; wx += 10) if(cenaHash(wx * 3 + wy) > .55) x.fillRect(wx, wy, 4, 5); }
  x.fillStyle = 'rgba(70,40,120,.6)'; for(i = 0; i < 22; i++){ var px = i * 20 + 6, py = base - 6 - cenaHash(i * 11) * 4 - Math.abs(Math.sin(t * .1 + i)) * 2; x.beginPath(); x.arc(px, py - 10, 4, 0, 7); x.fill(); x.fillRect(px - 4, py - 6, 8, 10); }
  x.fillStyle = '#2f6b4f'; for(i = 0; i < 12; i++){ x.beginPath(); x.arc(i * 38 + 10, base + 4, 18, 0, 7); x.arc(i * 38 + 30, base + 2, 14, 0, 7); x.fill(); }
  x.fillStyle = '#3b2a6b'; x.fillRect(0, base + 12, W2, H2 - base);
  x.fillStyle = 'rgba(255,111,181,.6)'; x.fillRect(0, base + 12, W2, 2);
}
function encHalo(x, cx, cy, t){   // halo em degradê roxo, verde e azul (as cores do TsuLiPa) girando devagar
  var r = 128 + Math.sin(t * .06) * 6;
  x.save(); x.globalAlpha = .8;
  if(x.createConicGradient){ var cg = x.createConicGradient(t * .01, cx, cy); cg.addColorStop(0, '#b04fe6'); cg.addColorStop(.33, '#4ade80'); cg.addColorStop(.66, '#4a74ee'); cg.addColorStop(1, '#b04fe6'); x.fillStyle = cg; }
  else x.fillStyle = '#b04fe6';
  x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
  x.globalAlpha = 1; var rg = x.createRadialGradient(cx, cy, r * .2, cx, cy, r + 2); rg.addColorStop(0, 'rgba(255,255,255,.75)'); rg.addColorStop(.55, 'rgba(255,255,255,.25)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  x.globalCompositeOperation = 'destination-out'; x.globalAlpha = .9; x.fillStyle = rg; x.beginPath(); x.arc(cx, cy, r * .78, 0, 7); x.fill();
  x.restore();
  x.save(); var gl = x.createRadialGradient(cx, cy, 10, cx, cy, r * 1.2); gl.addColorStop(0, 'rgba(255,255,255,.35)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gl; x.beginPath(); x.arc(cx, cy, r * 1.2, 0, 7); x.fill(); x.restore();
}
var ENC_EMO = ['💜', '💚', '💙', '✨', '⭐', '💖', '🎀', '🌸', '🎤', '🌟', '💕', '🫶'];
function encEmojis(x, W2, H2, t){   // emojis fofos levitando
  x.save(); x.textAlign = 'center'; x.textBaseline = 'middle';
  for(var i = 0; i < 14; i++){
    var vel = .5 + cenaHash(i * 5) * .7, y = H2 + 20 - ((t * vel + i * 47) % (H2 + 40)), xx = cenaHash(i * 13) * (W2 - 40) + 20 + Math.sin(t * .04 + i) * 14;
    x.globalAlpha = Math.min(1, (H2 + 20 - y) / 60, y / 80) * .9; x.font = (20 + (i % 4) * 5) + 'px sans-serif';
    x.fillText(ENC_EMO[i % ENC_EMO.length], xx, y);
  }
  x.restore();
}
