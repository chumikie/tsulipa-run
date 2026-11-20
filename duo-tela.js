/* Moon⭐Duo! — poses próprias e as telas da janela (busca, palco, abas). Saiu do index.html em 17/11/2026 e baixa só
   quando o Duo abre (depois do duo.js). Código igual; a janela (duoOv) continua sendo criada pelo index.html. */
// poses só do Moon⭐Duo! (pegam carona no "V" e trocam os braços aqui)
var DUO_POSE_FN = {
  dmao: function(c, x, y){ duoBraco(x + 3, y + 25.5, x + 1, y + 33); duoBraco(x + 27, y + 25.5, x + 36, y + 30); duoMao(x + 37, y + 30.5, c); },
  dhigh: function(c, x, y){ duoBraco(x + 3, y + 25.5, x + 1, y + 33); duoBraco(x + 27, y + 25.5, x + 34.5, y + 12); g.fillStyle = c.skin; g.beginPath(); g.arc(x + 35.5, y + 10.5, 3, 0, 7); g.fill(); },
  dguarda: function(c, x, y){ duoBraco(x + 3, y + 25.5, x + 1, y + 33); duoBraco(x + 27, y + 25.5, x + 33, y + 15.5); duoMao(x + 33.6, y + 14.8, c); },
  dsegura: function(c, x, y){ duoBraco(x + 3, y + 26, x + 11, y + 28.5); duoBraco(x + 27, y + 26, x + 19, y + 28.5); g.fillStyle = c.skin; g.fillRect(x + 1, y + 24, 4, 3); g.fillRect(x + 25, y + 24, 4, 3); },
  dselfie: function(c, x, y){
    duoBraco(x + 3, y + 25.5, x + 1, y + 33); duoBraco(x + 27, y + 25.5, x + 36, y + 13.5);
    g.fillStyle = '#ff6fb5'; g.fillRect(x + 34, y + 5, 6.5, 10.5); g.fillStyle = '#2a2438'; g.fillRect(x + 34.8, y + 5.8, 4.9, 8.9);
    g.fillStyle = 'rgba(255,255,255,.5)'; g.fillRect(x + 35.3, y + 6.3, 1.2, 4); duoMao(x + 36.5, y + 14, c);
  },
  dseis: function(c, x, y){   // "six seven": mãos para cima, uma sobe e a outra desce
    var d = Math.sin(frame * .22) * 3.2;
    [[3, -2.5, d], [27, 32.5, -d]].forEach(function(b){
      duoBraco(x + b[0], y + 25.5, x + b[1], y + 21 + b[2]);
      g.fillStyle = c.skin; g.beginPath(); g.ellipse(x + b[1], y + 19.6 + b[2], 3.6, 1.6, 0, 0, 7); g.fill();
    });
  },
  dneon: function(c, x, y){   // braço apontando para o alto, a outra mão na cintura
    duoBraco(x + 3, y + 25.5, x - 1, y + 29.5); duoBraco(x - 1, y + 29.5, x + 4, y + 32.5);
    duoBraco(x + 27, y + 25.5, x + 36, y + 13);
    g.save(); g.shadowColor = '#4dd8ff'; g.shadowBlur = 6; g.strokeStyle = c.skin; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x + 36.5, y + 12.5); g.lineTo(x + 39.5, y + 8.5); g.stroke(); g.restore();
    duoMao(x + 36.6, y + 12.6, c);
  }
};
var duoPoseAtrasOrig = perfPoseAtras;
perfPoseAtras = function(c, x, y){
  if(duoPoseForce && DUO_POSE_FN[duoPoseForce]){
    charPose = duoPoseForce;
    g.save(); g.fillStyle = c.skin; try{ DUO_POSE_FN[duoPoseForce](c, x, y); }catch(e){} g.restore();
    g.fillStyle = c.skin; return true;
  }
  return duoPoseAtrasOrig(c, x, y);
};

// ---------- desenho ----------

// ---------- telas ----------
duoOv.addEventListener('input',function(e){
  if(e.target.id!=='duoBusca')return;
  duoBuscaCancelar();
  var inp=e.target,q=inp.value.trim(),seq=duoBuscaSeq;
  if(q.length<2){$('duoRes').innerHTML='';return;}
  duoBuscaT=setTimeout(function(){
    duoBuscaT=0;
    if(seq!==duoBuscaSeq||duoOv.hidden||!inp.isConnected||inp.value.trim()!==q)return;
    contaRpc('buscar_perfis',{p_q:q}).then(function(L){
      var box=$('duoRes');
      if(seq!==duoBuscaSeq||duoOv.hidden||!inp.isConnected||inp.value.trim()!==q||!box||!box.isConnected)return;
      box.innerHTML=Array.isArray(L)&&L.length?L.filter(function(p){return !contaJ||p.nick.toLowerCase()!==contaJ.nick.toLowerCase();}).map(duoNickBtn).join(''):'<p class="perfcarr">'+escHtml(tr('Ninguém com esse nome.'))+'</p>';
    }).catch(function(){});
  },280);
});
duoOv.addEventListener('keydown', function(e){ if(e.target.id === 'duoBusca') e.stopPropagation(); });
$('duoCv').addEventListener('click', function(e){
  if(!duoGu) return;
  var cv = this, r = cv.getBoundingClientRect(), px = (e.clientX - r.left) * cv.width / r.width, py = (e.clientY - r.top) * cv.height / r.height;
  var inf=duoInfo(),U=duoGeo(duoMeuAv(),duoT).sc,chao=cv.height*.9,q=duoQuadroGeo(cv.width,cv.height,U,inf),sxE=q.eu,sxG=q.gu;
  px=cv.width/2+(px-cv.width/2)/q.zoom;py=q.pivo+(py-q.pivo)/q.zoom;
  if(py < chao - 52 * U || py > chao + 10) return;
  if(Math.abs(px - sxG) < 20 * U){ duoBalao = { txt:duoFala(), t0:duoT }; duoPulo = { quem:'gu', t0:duoT }; [1319, 1568, 2093].forEach(function(f, i){ beep(f, .09, 'triangle', .035, i * .07); }); }
  else if(Math.abs(px - sxE) < 20 * U){ duoPulo = { quem:'eu', t0:duoT }; beep(988, .08, 'triangle', .04); }
});
// ---------- Painel organizado em abas: Cena · Cenário · Expressões · Presente ----------
duoOv.addEventListener('click', function(e){
  var t = e.target, b;
  if(t.id === 'duoX'){ duoFechar(); return; }
  if((b = t.closest('[data-dtrava]'))){ duoTravaUI(b.dataset.dtrava); return; }
  if((b = t.closest('[data-dcomprar]'))){ duoComprar(b.dataset.dcomprar, b); return; }
  if(t.id === 'duoEntrar'){ contaEntrar(); return; }
  if(t.id === 'duoTrocar'){ duoGu = null; duoEscolhaUI(); return; }
  if((b = t.closest('[data-dnick]'))){ duoCarregar(b.dataset.dnick); return; }
  if((b = t.closest('[data-dcena]'))){ duoCena = b.dataset.dcena; duoBalao = null; duoT = 0; duoPalcoUI(); duoRegistrar(); beep(1175, .05, 'triangle', .04); return; }
  if((b = t.closest('[data-dfundo]'))){ duoFundo = b.dataset.dfundo; $('duoPresBox').hidden = true; duoPalcoUI(); duoTemaGuardarUI(duoFundo); beep(988, .05, 'triangle', .04); return; }
  if((b = t.closest('[data-dexeu]'))){ duoExEu = b.dataset.dexeu; duoPalcoUI(); return; }
  if((b = t.closest('[data-dexgu]'))){ duoExGu = b.dataset.dexgu; duoPalcoUI(); return; }
  if((b = t.closest('[data-dtab]'))){ duoTab = b.dataset.dtab; $('duoPresBox').hidden = true; duoTabUI(); beep(880, .04, 'triangle', .04); return; }
  if((b = t.closest('[data-demo]'))){ duoPresEmo = b.dataset.demo; duoPresUI(); return; }
  if((b = t.closest('[data-dqt]'))){ duoPresQt = +b.dataset.dqt; duoPresUI(); return; }
  if(t.id === 'duoPresOk'){
    t.disabled = true;
    contaRpc('duo_presente', { p_nick: duoGu.nick, p_emoji: duoPresEmo, p_estrelas: duoPresQt }).then(function(r){
      t.disabled = false;
      if(r && r.ok){
        if(typeof r.stars === 'number'){ starT = r.stars; try{ localStorage.setItem('brs48cr_st', starT); }catch(er){} setBest(); }
        duoTab = 'cena'; duoTabUI(); duoMsg(duoPresEmo + ' ' + tr('Presente enviado! {nick} vai receber quando entrar no jogo.').replace('{nick}', duoGu.nick));
        duoBalao = { txt:tr('Obrigado pelo presente! {emo}').replace('{emo}', duoPresEmo), t0:duoT }; duoPulo = { quem:'gu', t0:duoT };
        [1047, 1319, 1568, 2093].forEach(function(f, i){ beep(f, .14, 'triangle', .04, i * .08); });
      } else duoMsg(tr(DUO_PRES_ERRO[r && r.erro] || 'Não deu para falar com o servidor. Tente de novo.'));
    }).catch(function(){ t.disabled = false; duoMsg(tr('Não deu para falar com o servidor. Tente de novo.')); });
    return;
  }
  if(t.id === 'duoPng' || t.id === 'duoPngSem'){   // PNG com o cenário ou transparente (sem fundo)
    var cv = document.createElement('canvas'); cv.width = 960; cv.height = 600;
    try{ duoRender(cv.getContext('2d'), 960, 600, t.id === 'duoPng', false); }catch(er){}
    t.href = cv.toDataURL('image/png'); t.download = 'moon-duo-' + String(duoGu.nick).replace(/[^\w-]+/g, '') + (t.id === 'duoPngSem' ? '-sem-fundo' : '') + '.png';
    if(sfx.card) sfx.card();
  }
  if(t.id==='duoRuaFofa' && duoPiloto && duoGu && window.TW_PILOTO_BAIRRO){
    var ruaFoto=document.createElement('canvas');ruaFoto.width=960;ruaFoto.height=600;
    var piloto=TW_PILOTO_BAIRRO;
    try{
      duoRender(ruaFoto.getContext('2d'),960,600,true,false);
      piloto.iniciar('duo',duoPiloto);
      if(piloto.concluir('duo',duoPiloto,ruaFoto)){
        duoPilotoFoto={cena:ruaFoto,dono:petPhoneContaChave()};t.disabled=true;
        var guardar=$('duoRuaGuardar');guardar.hidden=!window.TW_ALBUM_FOTOS;guardar.disabled=false;
        guardar.textContent='Guardar foto da Rua na série';
        $('duoRuaStatus').textContent='Sua foto em dupla está na vitrine da Rua Fofa.';
      }else $('duoRuaStatus').textContent='Esta edição da Rua Fofa já foi concluída ou terminou.';
    }catch(e){$('duoRuaStatus').textContent='Não foi possível tirar a foto. Tente novamente.';}
    return;
  }
  if(t.id==='duoRuaGuardar' && duoPilotoFoto && contaJ && duoPilotoFoto.dono===petPhoneContaChave() && window.TW_ALBUM_FOTOS){
    TW_ALBUM_FOTOS.salvar('duo',duoPilotoFoto.cena,t);
    return;
  }
  if(t.id === 'duoSerie' && duoGu && contaJ && window.TW_ALBUM_FOTOS){
    var serie = document.createElement('canvas'); serie.width = 960; serie.height = 600;
    try{ duoRender(serie.getContext('2d'), 960, 600, true, false); TW_ALBUM_FOTOS.salvar('duo',serie,t); }catch(e){}
  }
  if(t.id === 'duoPhone'){
    // Guarda apenas após toque explícito, usando a cena e os bloqueios já validados pelo Moon⭐Duo!.
    if(!duoGu || !contaJ || !petAtivo()){ duoMsg(petPhoneMomentoTexto(2));return; }
    var foto = document.createElement('canvas'); foto.width = 960;foto.height = 600;
    var png = '';
    try{duoRender(foto.getContext('2d'), 960, 600, true, false);png=foto.toDataURL('image/png');}catch(er){}
    duoMsg(petPhoneMomentoTexto(petPhoneMomentoGuardar('duo',png) ? 1 : 2));
  }
});

