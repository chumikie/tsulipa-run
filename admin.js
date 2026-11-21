/* Modo admin (moderação) — painel, ferramentas, Montar o Idol, avisos, missões e "Liberar tudo".
   Extraído do index.html em 02/11/2026 (refatoração, Etapa 6), sem mudar nada: mesmo nome, mesmo código.
   Desde 17/11/2026 só baixa para quem é admin (admin-base.js chama); o que roda para todo mundo ficou no admin-base.js.
   Só DECLARA funções e tabelas fixas; o servidor confere eh_admin() em todas as RPCs de admin. */

function admBarraHtml(d){   // barra da moderação no perfil de outra pessoa
  var temPets = Array.isArray(d.pets) && d.pets.length > 0;
  return '<div class="admbarra"><b>🛡️ ' + escHtml(tr('Moderação')) + (d.bloqueado ? ' · ⛔ ' + escHtml(tr('Conta bloqueada')) : '') + '</b>' +
    '<button type="button" data-adm="limpar_frase">🧹 ' + escHtml(tr('Limpar frase')) + '</button>' +
    '<button type="button" data-adm="renomear">✏️ ' + escHtml(tr('Renomear')) + '</button>' +
    '<button type="button" data-adm="limpar_foto">🖼️ ' + escHtml(tr('Limpar foto')) + '</button>' +
    '<button type="button" data-adm="duo_on" data-v="' + (d.duo_on === false ? 'true' : 'false') + '">🌙 ' + escHtml(tr(d.duo_on === false ? 'Devolver ao Moon⭐Duo!/outdoors' : 'Tirar do Moon⭐Duo!/outdoors')) + '</button>' +
    '<button type="button" data-adm="bloquear" data-v="' + (d.bloqueado ? 'false' : 'true') + '">' + (d.bloqueado ? '✅ ' + escHtml(tr('Desbloquear')) : '⛔ ' + escHtml(tr('Bloquear'))) + '</button>' +
    '<button type="button" data-adm2="estrelas">⭐ Estrelas</button><button type="button" data-adm2="item">🎁 Item</button><button type="button" data-adm2="insignia">🏅 Insígnia</button><button type="button" data-adm2="extrato">📜 Extrato</button><button type="button" data-adm2="presente">🎁 Presente</button><button type="button" data-adm2="aviso">📣 Aviso</button>' +
    (temPets ? '<button type="button" data-adm2="pets">💗 ' + escHtml(tr('Restaurar todos os pets')) + '</button>' : '') +
    '<button type="button" data-adm2="visual">👗 ' + escHtml(tr('Montar o Idol')) + '</button>' +
    '<div class="admform" id="admForm" hidden></div></div>';
}
function admAcao(acao, alvo, valor){ return contaRpc('admin_acao', { p_acao:acao, p_alvo:String(alvo), p_valor: valor === undefined ? null : String(valor) }); }
function admOpts(L){ return L.map(function(o){ return '<option value="' + escHtml(o[0]) + '">' + escHtml(o[1]) + '</option>'; }).join(''); }
function admVisualRoupa(f, alvoVisual){   // reserva: só a roupa (funciona antes da função nova do banco)
  contaRpc('admin_visual_info', { p_nick: alvoVisual }).then(function(r){
    if(!perfAtual || perfAtual.nick!==alvoVisual) return;
    if(!r || !r.ok){ f.innerHTML='<p class="perfmsg">' + escHtml(tr('Não foi possível carregar o visual. A atualização de moderação do banco ainda precisa ser aplicada.')) + '</p>'; return; }
    f.innerHTML=admVisualFormHtml(r);
    var seletorRoupa=$('admRoupa'); if(seletorRoupa) seletorRoupa.value=r.out||'';
  }).catch(function(){
    if(perfAtual && perfAtual.nick===alvoVisual) f.innerHTML='<p class="perfmsg">' + escHtml(tr('Não foi possível carregar o visual. Tente novamente.')) + '</p>';
  });
}
function admIdolFormHtml(r){
  var c=r.c||{},best=+r.best_idol||0,owned=Array.isArray(r.visuais)?r.visuais:[],hex=function(v,d){return /^#[0-9a-f]{6}$/i.test(v||'')?v:d;};
  admIdol={nick:r.nick,c:{hair:hex(c.hair,'#ff7eb6'),hair2:hex(c.hair2,'#ffffff'),eye:hex(c.eye,'#5a3b2e'),skin:hex(c.skin,SK[1]),outcol:hex(c.outcol,'#ffffff'),back:c.back||'',front:c.front||'bagunca',mecha:c.mecha||(c.streak?'uma':''),det:c.det||'',gl:c.gl||'',hat:c.hat||'',out:c.out||'',baixo:c.baixo==='saia'||c.baixo==='bermuda'?c.baixo:'',legcol:hex(c.legcol,'#1c1c30'),lado2:/^#[0-9a-f]{6}$/i.test(c.lado2||'')?c.lado2.toLowerCase():''}};   // lado2: a outra metade do cabelo bicolor (vazio = preto)
  function lista(id,ok){return [].filter.call($(id).options,function(o){return o.value===admIdol.c[CF[id]||'mecha']||ok(o);}).map(function(o){return [o.value,o.textContent.replace(/^🔒\s*/,'')];});}
  function sel(id,campo,ok){return '<label>'+escHtml(tr(($(id).closest('label').firstChild.nodeValue||'').trim()))+' <select data-ai="'+campo+'">'+admOpts(lista(id,ok||function(){return true;}))+'</select></label>';}
  function cor(campo){return ' <input type="color" data-ai="'+campo+'" value="'+escHtml(admIdol.c[campo])+'">';}
  var roupas=admVisualFormHtml({best_idol:best,visuais:owned,out:admIdol.c.out,outcol:admIdol.c.outcol}).match(/<select id="admRoupa">([\s\S]*?)<\/select>/);
  return '<p>'+escHtml(tr('Monte o Idol que aparece no perfil e nos jogos. Roupas e acessórios: só os já liberados ou comprados.'))+(r.auto?' <b>'+escHtml(tr('Este membro ainda não montou o próprio Idol.'))+'</b>':'')+'</p>'+
    '<div style="position:relative;width:120px;margin:4px auto"><canvas id="admIdolCv" width="120" height="150" style="display:block;width:120px;height:150px"></canvas><button type="button" id="admIdolPng" title="'+escHtml(tr('Baixar PNG'))+'" aria-label="'+escHtml(tr('Baixar PNG'))+'" style="position:absolute;bottom:4px;right:-30px;width:34px;height:34px;border:0;border-radius:50%;background:var(--b1);color:#fff;font-size:16px;cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.25)">📷</button></div><div class="cust">'+
    '<label>'+escHtml(tr('Cabelo'))+cor('hair')+'</label>'+sel('cback','back')+'<i class="cbr"></i>'+
    sel('cstk','mecha')+cor('hair2')+'<i class="cbr"></i>'+'<label title="Só no corte bicolor (onduladom2)">Bicolor'+cor('lado2')+'</label><i class="cbr"></i>'+
    sel('cfront','front')+sel('cdet','det',function(o){return !/^(coelho|tulipa|torrada)$/.test(o.value)||owned.indexOf('det_'+o.value)>=0;})+'<i class="cbr"></i>'+
    '<span class="perfskins">'+SK.map(function(sk){return '<button type="button" class="sw" data-ai="skin" data-v="'+sk+'" style="background:'+sk+'" aria-pressed="'+(sk===admIdol.c.skin)+'"></button>';}).join('')+'</span>'+
    '<label>'+escHtml(tr('Olhos'))+cor('eye')+'</label><i class="cbr"></i>'+
    '<label>'+escHtml(tr('Roupa'))+' <select data-ai="out">'+(roupas?roupas[1]:'')+'</select>'+cor('outcol')+'</label>'+
    '<label>'+escHtml(tr('Parte de baixo'))+' <select data-ai="baixo">'+admOpts([['',tr('Padrão da roupa')],['saia',tr('Saia')],['bermuda',tr('Bermuda')]])+'</select></label>'+
    '<label>'+escHtml(tr('Meias'))+cor('legcol')+'</label><i class="cbr"></i>'+
    sel('chat','hat',function(o){return (+o.getAttribute('data-r')||0)<=best&&(o.value!=='palha'||owned.indexOf('hat_palha')>=0);})+sel('cgl','gl')+'</div>'+
    '<input id="admMotivo" maxlength="60" placeholder="'+escHtml(tr('Motivo (aparece no extrato)'))+'">'+
    '<button type="button" class="btn" id="admIdolSalvar">👗 '+escHtml(tr('Salvar Idol'))+'</button> <button type="button" class="sec" data-adm2="roupa">'+escHtml(tr('Só a roupa'))+'</button>'+
    '<p class="perfmsg" id="admMsg" hidden></p>';
}
function admIdolC(){ var c={};for(var k in PERF_BASE)c[k]=PERF_BASE[k];for(k in admIdol.c)c[k]=admIdol.c[k];c.streak=!!c.mecha;c.img=c.hair;return c; }
function admPng(nick,av){   // PNG transparente 1000×1000 do Idol (como o 📷 do menu)
  var cv=document.createElement('canvas');cv.width=cv.height=1000;
  try{perfDesenharIdol(cv.getContext('2d'),1000,1000,av,false,false,0);}catch(e){return;}
  var a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download='tsulipa-idol-'+(String(nick).replace(/[^a-z0-9]/gi,'').toLowerCase()||'membro')+'.png';a.click();
}
function admIdolPng(){ if(admIdol)admPng(admIdol.nick,{v:1,c:admIdolC(),a:'',pose:'v',expr:2}); }
function admRoupaPng(){   // ajuste só de roupa: o visual público do membro com a roupa escolhida
  if(!perfAtual)return;var av=JSON.parse(JSON.stringify(perfAtual.avatar&&typeof perfAtual.avatar==='object'?perfAtual.avatar:{}));
  av.c=av.c&&typeof av.c==='object'?av.c:{};av.pet=null;av.fundo='';
  if($('admRoupa'))av.c.out=$('admRoupa').value;if($('admRoupaCor'))av.c.outcol=$('admRoupaCor').value;
  admPng(perfAtual.nick,av);
}
function admIdolPrev(){
  var cv=$('admIdolCv');if(!cv||!admIdol)return;
  [].forEach.call($('admForm').querySelectorAll('select[data-ai]'),function(s){s.value=admIdol.c[s.dataset.ai];});
  var x=cv.getContext('2d');x.clearRect(0,0,cv.width,cv.height);
  try{perfDesenharIdol(x,cv.width,cv.height,{v:1,c:admIdolC(),a:'',pose:'v',expr:2},false,false,0);}catch(e){}
}
function admVisualFormHtml(r){
  var best=+r.best_idol||0, owned=Array.isArray(r.visuais)?r.visuais:[];
  var base=[
    ['','Trainee',0],
    ['seifuku','Debut (Team)',450],
    ['estrelado','Nagareboshi (Senbatsu)',1000],
    ['y2k','Cheeky (Quad Center)',1800],
    ['zipper','ZIPPER (tCenter)',2800],
    ['sweet','Valentine (wCenter)',3900],
    ['citypop','Mayonaka (Center)',5000]
  ];
  var choices=base.filter(function(o){return o[2]<=best || o[0]===r.out;}).map(function(o){return [o[0],o[1]];});
  PERF_LOJA.forEach(function(o){
    if(owned.indexOf('roupa_'+o[0])>=0 || o[0]===r.out) choices.push([o[0],'🛍️ '+perfRot(o)]);
  });
  var color=/^#[0-9a-f]{6}$/i.test(r.outcol||'')?r.outcol:'#ffffff';
  return '<p>' + escHtml(tr('Ajuste a roupa do Idol que aparece no perfil. Só aparecem roupas já desbloqueadas ou compradas.')) + '</p>' +
    '<label>' + escHtml(tr('Roupa do Idol')) + ' <select id="admRoupa">' + admOpts(choices) + '</select></label>' +
    '<label>' + escHtml(tr('Cor da roupa')) + ' <input type="color" id="admRoupaCor" value="' + escHtml(color) + '"></label>' +
    '<input id="admMotivo" maxlength="60" placeholder="' + escHtml(tr('Motivo (aparece no extrato)')) + '">' +
    '<button type="button" class="btn" id="admVestirSalvar">👗 ' + escHtml(tr('Salvar ajuste')) + '</button>' +
    ' <button type="button" class="btn" id="admRoupaPng" title="' + escHtml(tr('Baixar PNG')) + '" aria-label="' + escHtml(tr('Baixar PNG')) + '">📷</button>' +
    '<p class="perfmsg" id="admMsg" hidden></p>';
}
function admPainel(){   // aba 🛡️ Moderação do perfil da admin
  contaRpc('admin_painel').then(function(d){
    var box = $('perfAbaCorpo'); if(!box || perfAba !== 'moderacao') return;
    if(!d || !d.ok){ box.innerHTML = '<p class="perfcarr">—</p>'; return; }
    var h = '<div class="admnums"><span>👥 ' + escHtml(tr('Contas')) + ': <b>' + (+d.contas || 0) + '</b></span></div>';
    if(typeof temaAvisoAdmin === 'function') h += temaAvisoAdmin();
    h += '<div id="admResumo"></div><div id="admRecados"></div><div id="admUso"></div><div id="admCorrida"></div>';
    h += '<h3>👥 ' + escHtml(tr('Todas as contas')) + ' <span id="admContasN"></span></h3><input class="nick admbusca" id="admBusca" maxlength="24" autocomplete="off" placeholder="🔍 ' + escHtml(tr('Procurar Idol pelo nome')) + '"><div class="admcontas" id="admContas"><p class="perfcarr">…</p></div>';
    h += '<label class="perfrecon admon"><input type="checkbox" id="admRecOn"' + (d.recados_on ? ' checked' : '') + '> 💌 ' + escHtml(tr('Recados no jogo todo')) + '</label>';
    h += '<h3>💌 ' + escHtml(tr('Últimos recados')) + '</h3>' + (d.recados.length ? '<ul class="perfrecs">' + d.recados.map(function(r){
      return '<li><div><button type="button" class="lbn" data-nick="' + escHtml(r.de) + '">' + escHtml(r.de) + '</button> → <button type="button" class="lbn" data-nick="' + escHtml(r.para) + '">' + escHtml(r.para) + '</button> <small>' + escHtml(perfData(r.created_at)) + '</small></div><p>' + escHtml(r.texto) + '</p>' +
             '<button type="button" class="perfrecx" data-admrec="' + (+r.id) + '" aria-label="✕">✕</button></li>'; }).join('') + '</ul>' : '<p class="perfcarr">' + escHtml(tr('Nenhuma.')) + '</p>');
    h += '<h3>💬 ' + escHtml(tr('Frases dos perfis')) + '</h3>' + (d.frases.length ? '<ul class="perfrecs">' + d.frases.map(function(f){
      return '<li><div><button type="button" class="lbn" data-nick="' + escHtml(f.nick) + '">' + escHtml(f.nick) + '</button></div><p>' + escHtml(f.frase) + '</p><button type="button" class="perfrecx" data-admfrase="' + escHtml(f.nick) + '" aria-label="🧹">🧹</button></li>'; }).join('') + '</ul>' : '<p class="perfcarr">' + escHtml(tr('Nenhuma.')) + '</p>');
    h += '<h3>⛔ ' + escHtml(tr('Contas bloqueadas')) + '</h3>' + (d.bloqueados.length ? '<div class="perfchips">' + d.bloqueados.map(function(n){
      return '<span>' + escHtml(n) + ' <button type="button" class="admdesb" data-nick="' + escHtml(n) + '">✅</button></span>'; }).join('') + '</div>' : '<p class="perfcarr">' + escHtml(tr('Nenhuma.')) + '</p>');
    h += '<div id="admExtra"><p class="perfcarr">…</p></div>';
    h += '<h3>🧪 ' + escHtml(tr('Ferramentas de teste')) + '</h3><div class="admtools">' + (typeof temaAdminHtml === 'function' ? temaAdminHtml() : '') +
         '<button type="button" class="btn alt" id="admTeste">🧪 ' + escHtml(tr('Ativar modo teste')) + '</button></div>';
    box.innerHTML = h;
    admExtra(); admResumo(); admRecados(); admUso(); admCorrida(); admContas();
  }).catch(function(){});
}
function admResumo(){   // 📊 Hoje no jogo (Center Run, Star⭐Gacha!, Moon⭐Duo!, missões e aniversários)
  contaRpc('admin_resumo').then(function(d){
    var box = $('admResumo'); if(!box || !d || !d.ok) return;
    function n(e, t, v){ return '<span>' + e + ' ' + escHtml(tr(t)) + ': <b>' + (+v || 0) + '</b></span>'; }
    box.innerHTML = '<h3>📊 ' + escHtml(tr('Hoje no jogo')) + '</h3><div class="admnums">' + n('🏁', 'Corridas', d.corridas) + n('👥', 'Jogadores', d.jogadores) + n('🎰', 'Giros no Star⭐Gacha!', d.gacha) +
      n('🌙', 'Cenas no Moon⭐Duo!', d.duo) + n('🎁', 'Presentes do Moon⭐Duo!', d.duo_pres) + n('🎯', 'Missões feitas', d.missoes) + n('⭐', 'Estrelas ganhas', d.estrelas) + n('🙈', 'Fora do Moon⭐Duo!', d.fora_duo) + '</div>' +
      '<p class="perfdica">🎂 ' + escHtml(tr('Aniversariantes de hoje')) + ': ' + (d.aniver.length ? d.aniver.map(function(k){ return '<button type="button" class="lbn" data-nick="' + escHtml(k) + '">' + escHtml(k) + '</button>'; }).join(', ') : '—') + '</p>' +
      '<p class="perfdica">🌙 ' + escHtml(tr('Mais escolhidos no Moon⭐Duo! (7 dias)')) + ': ' + (d.duo_top.length ? d.duo_top.map(function(t){ return '<button type="button" class="lbn" data-nick="' + escHtml(t.nick) + '">' + escHtml(t.nick) + '</button> (' + t.n + ')'; }).join(', ') : '—') + '</p>';
  }).catch(function(){});
}
// 💌 Recados para o TsuLiPa (20/11/2026): só a moderação lê; "lido" tira da contagem de novos
function admRecados(marcar, botao){
  var box=$('admRecados'), conta=contaSessaoAtual();
  if(!box)return;
  var pedido={};box.admPedido=pedido;
  function atual(){return conta()&&box.isConnected&&box.admPedido===pedido;}
  contaRpc('admin_recados_tsulipa', {p_marcar_lido:marcar || null}).then(function(d){
    if(!atual())return;
    if(!d || !d.ok)throw Error('recados indisponíveis');
    var L = d.recados || [];
    box.innerHTML = '<h3>💌 ' + escHtml(tr('Recados para o TsuLiPa')) + (d.novos ? ' <span class="admnovo">' + d.novos + '</span>' : '') + '</h3>' +
      (L.length ? '<ul class="admrecados">' + L.map(function(r){
        return '<li class="' + (r.lido ? 'lido' : '') + '"><p>' + escHtml(r.texto) + '</p><small><button type="button" class="lbn" data-nick="' + escHtml(r.nick) + '">' + escHtml(r.nick) + '</button> · ' +
          escHtml(new Date(r.criado).toLocaleString()) + '</small>' + (r.lido ? '' : ' <button type="button" class="btn alt admlido" data-recado="' + r.id + '">✓ ' + escHtml(tr('Lido')) + '</button>') + '</li>'; }).join('') + '</ul>'
        : '<p class="perfcarr">' + escHtml(tr('Nenhum recado ainda.')) + '</p>');
    box.onclick = function(e){ var b = e.target.closest && e.target.closest('[data-recado]'); if(b&&!b.disabled&&conta()&&box.isConnected){ b.disabled = true; admRecados(+b.getAttribute('data-recado'),b); } };
  }).catch(function(){if(atual())perfTopoMsg(tr('Não deu para falar com o servidor. Tente de novo.'));})
    .finally(function(){if(botao)botao.disabled=false;});
}
// 🎮 Uso dos jogos (20/11/2026): quantas pessoas jogaram cada jogo nos últimos 7 dias e qual é o Jogo da semana
var ADM_JOGOS = {run:'Center⭐Run!', karaoke:'Karaoke⭐Time!', sora:'Sora⭐Jump!', cafe:'Happy⭐Cafe!', handshake:'Handshake⭐Event!', jardim:'Bloom⭐Garden!', battle:'Idol⭐Battle!', foto:'Photo⭐Studio!', duo:'Moon⭐Duo!', gacha:'Star⭐Gacha!', pet:'Backstage⭐Pet! (minijogos)'};
function admUso(){
  var box=$('admUso'), conta=contaSessaoAtual();
  if(!box)return;
  contaRpc('admin_uso_jogos', {p_dias:7}).then(function(d){
    if(!conta()||!box.isConnected||!d||!d.ok)return;
    var L = d.jogos || [], max = Math.max(1, d.contas_ativas || 0);
    var h = '<h3>🎮 ' + escHtml(tr('Quem jogou o quê (7 dias)')) + '</h3><p class="perfdica">👥 ' + escHtml(tr('Contas ativas')) + ': <b>' + (+d.contas_ativas || 0) + '</b>' +
      (d.jogo_da_semana && d.jogo_da_semana.k ? ' · 🌟 ' + escHtml(tr('Jogo da semana')) + ': <b translate="no">' + escHtml(ADM_JOGOS[d.jogo_da_semana.k] || d.jogo_da_semana.k) + '</b>' : '') + '</p>';
    h += '<ul class="admbarras">' + L.map(function(j){ var w = Math.max(3, Math.round(j.jogadores / max * 100));
      return '<li><span translate="no">' + escHtml(ADM_JOGOS[j.k] || j.k) + '</span><i style="--w:' + w + '%"></i><b>' + j.jogadores + '</b><small>' + j.partidas + ' ' + escHtml(tr('partidas')) + '</small></li>'; }).join('') + '</ul>';
    var poucos = L.filter(function(j){ return j.jogadores <= 1; }).map(function(j){ return ADM_JOGOS[j.k] || j.k; });
    if(poucos.length) h += '<p class="perfdica">💡 ' + escHtml(tr('Pouco jogados na semana')) + ': ' + escHtml(poucos.join(', ')) + '. ' + escHtml(tr('O Jogo da semana já dá +★5 na missão do dia para um deles.')) + '</p>';
    box.innerHTML = h;
  }).catch(function(){});
}
// 🏁 Center⭐Run: onde as corridas terminam e como vão as metas curtas (últimos 7 dias, de runs.causa/meta)
var ADM_OBST = {cable:'Cabo', case:'Case', cone:'Cone', mala:'Mala', escada:'Escada', alien:'Alien', fita:'Fita', balde:'Balde', arara:'Arara', carrinho:'Carrinho', esteira:'Esteira', lanterna:'Lanterna', colchonete:'Colchonete', garrafinha:'Garrafinha', caixaluz:'Caixa de luz', camtrilho:'Câmera no trilho', faplaca:'Fã com placa', x:'Outro'};
var ADM_META = {estrelas:'Pegar estrelas', pulos:'Pular', pontos:'Fazer pontos', carta:'Pegar carta'};
function admCorrida(){
  contaRpc('admin_corrida_telemetria', {p_dias:7}).then(function(d){
    var box = $('admCorrida'); if(!box || !d || !d.ok) return;
    function pc(a, b){ return b ? Math.round(a / b * 100) + '%' : '—'; }
    function barra(rot, n, tot, extra){ var w = tot ? Math.max(3, Math.round(n / tot * 100)) : 0;
      return '<li><span>' + escHtml(rot) + '</span><i style="--w:' + w + '%"></i><b>' + n + '</b>' + (extra ? '<small>' + escHtml(extra) + '</small>' : '') + '</li>'; }
    var h = '<h3>🏁 ' + escHtml(tr('Center⭐Run: por que as corridas acabam (7 dias)')) + '</h3>';
    if(!d.total){ box.innerHTML = h + '<p class="perfcarr">' + escHtml(tr('Ainda sem corridas registradas.')) + '</p>'; return; }
    h += '<div class="admnums"><span>🏁 ' + escHtml(tr('Corridas')) + ': <b>' + d.total + '</b></span><span>🦘 ' + escHtml(tr('Bateu no ar')) + ': <b>' + pc(d.no_ar, d.total) + '</b></span>' +
      '<span>🧩 ' + escHtml(tr('Em sequência')) + ': <b>' + pc(d.padrao, d.total) + '</b></span><span>💨 ' + escHtml(tr('Velocidade')) + ': <b>' + (d.vel_media || 0) + '</b></span></div>';
    h += '<ul class="admbarras">' + (d.obstaculos || []).map(function(o){ return barra(tr(ADM_OBST[o.k] || o.k || '?'), o.n, d.total, 'v' + (o.vel || 0)); }).join('') + '</ul>';
    if((d.metas || []).length) h += '<p class="perfdica">🎯 ' + escHtml(tr('Metas cumpridas')) + '</p><ul class="admbarras">' +
      d.metas.map(function(m){ return barra(tr(ADM_META[m.k] || m.k), m.ok, m.n, m.ok + '/' + m.n + ' · ' + pc(m.ok, m.n)); }).join('') + '</ul>';
    // o que ajustar, quando já há corridas suficientes (30+): obstáculo que derruba demais e meta fácil/difícil demais
    var dicas = [];
    if(d.total >= 30){
      (d.obstaculos || []).forEach(function(o){ if(o.n / d.total > .35) dicas.push(tr('Muita gente cai em') + ' ' + tr(ADM_OBST[o.k] || o.k) + ' (' + pc(o.n, d.total) + '): ' + tr('abrir mais espaço antes dele ou avisar mais cedo.')); });
      if(d.no_ar / d.total > .4) dicas.push(tr('Muitas batidas no ar') + ' (' + pc(d.no_ar, d.total) + '): ' + tr('os pulos estão terminando em cima de obstáculos; afastar os padrões.'));
      (d.metas || []).forEach(function(m){ if(m.n < 10) return; var r = m.ok / m.n, nome = tr(ADM_META[m.k] || m.k);
        if(r < .2) dicas.push(tr('Meta difícil demais') + ': ' + nome + ' (' + pc(m.ok, m.n) + '). ' + tr('Baixar o alvo.'));
        else if(r > .9) dicas.push(tr('Meta fácil demais') + ': ' + nome + ' (' + pc(m.ok, m.n) + '). ' + tr('Subir o alvo.')); });
    }
    h += '<p class="perfdica">💡 ' + (d.total < 30 ? escHtml(tr('Com 30 corridas ou mais, aparecem aqui as sugestões de ajuste.')) : dicas.length ? dicas.map(escHtml).join('<br>💡 ') : escHtml(tr('Tudo equilibrado por enquanto.'))) + '</p>';
    box.innerHTML = h;
  }).catch(function(){});
}
var admContasL = [];
function admContasUI(){   // lista de todas as contas (só a moderação vê), com busca
  var box = $('admContas'); if(!box) return;
  var q = ($('admBusca') && $('admBusca').value || '').trim().toLowerCase();
  var L = admContasL.filter(function(c){ return !q || c.nick.toLowerCase().indexOf(q) >= 0; });
  $('admContasN').textContent = '(' + admContasL.length + ')';
  box.innerHTML = L.length ? L.map(function(c){
    return '<button type="button" class="lbn admconta" data-nick="' + escHtml(c.nick) + '">' + (c.bloqueado ? '⛔ ' : '') + '<b>' + escHtml(c.nick) + '</b><small>🏆 ' + (+c.best || 0) + ' · ★' + (+c.stars || 0) + ' · ' + (+c.corridas || 0) + ' ' + escHtml(tr('corridas')) + ' · ' + escHtml(tr('desde')) + ' ' + escHtml(perfData(c.desde)) + '</small></button>';
  }).join('') : '<p class="perfcarr">' + escHtml(tr('Ninguém com esse nome.')) + '</p>';
}
function admContas(){ contaRpc('admin_contas').then(function(L){ admContasL = Array.isArray(L) ? L : []; admContasUI(); }).catch(function(){}); }
function admCamarimOpts(){   // itens do camarim para o presente: comida e banho, acessórios do pet e quadros do mural
  var L = [['', '— nada do camarim —']];
  (PET_FOOD || []).concat(PET_BATH || []).forEach(function(it){ L.push(['food:' + it[0], '🍰 ' + tr(it[1])]); });
  (PET_WARDROBE || []).forEach(function(it){ if(it[0]) L.push(['acc:' + it[0], it[1] + ' ' + tr(it[2])]); });
  (PET_DECOR || []).forEach(function(it){ L.push(['decor:' + it[0], '🖼️ ' + tr(it[1])]); });
  return L;
}
function admExtra(){   // presente para todos, aviso da tela de início e histórico da moderação
  Promise.all([contaRpc('admin_extra'),contaRpc('admin_avisos_grupo').catch(function(){return [];}),perfGruposCarregar()]).then(function(res){
    var d=res[0], avisosGrupo=Array.isArray(res[1])?res[1]:[];
    var box = $('admExtra'); if(!box || !d || !d.ok) return;
    var h = '<h3>🎁 Presente para todos</h3><div class="admform"><input type="number" id="presEst" min="0" max="2000" step="10" value="100"> ★ ' +
      '<select id="presItem"><option value="">— sem item da loja —</option>' + admOpts(admItens()) + '</select><select id="presCam">' + admOpts(admCamarimOpts()) + '</select>' +
      '<input id="presMsg" maxlength="80" placeholder="Mensagem (ex.: Feliz Halloween!)"><label>Dias <input type="number" id="presDias" min="1" max="30" value="7"></label><button type="button" class="btn" id="presCriar">Criar presente</button></div>';
    h += (d.presentes.length ? '<ul class="admlog">' + d.presentes.map(function(p){ return '<li>🎁 <b>' + escHtml(p.mensagem || '—') + '</b> · ★' + p.estrelas + (p.item ? ' · ' + escHtml(p.item) : '') + (p.camarim ? ' · ' + escHtml(p.camarim) : '') + ' · ' + p.resgates + ' resgates · até ' + escHtml(perfData(p.expira)) + ' <button type="button" class="admdesb" data-presfim="' + p.id + '">Encerrar</button></li>'; }).join('') + '</ul>' : '');
    h += '<section id="ktTicketAdminSlot"></section>';
    h += '<h3>📣 Aviso na tela de início</h3><div class="admform"><label>Destinatários <select id="avisoAlvo"><option value="">🌏 Todos os jogadores</option>' +
      PERF_GRUPOS.map(function(g){return '<option value="'+escHtml(g.codigo)+'">'+perfGrupoBandeira(g)+' '+escHtml(g.nome)+'</option>';}).join('') +
      '</select></label><input id="avisoTxt" maxlength="140" value="' + escHtml(d.aviso || '') + '" placeholder="Vazio = sem aviso"><button type="button" class="btn" id="avisoOk">Salvar aviso</button></div>';
    h += '<h3>📜 Histórico da moderação</h3><ul class="admlog">' + (d.log.length ? d.log.map(function(l){ return '<li><b>' + escHtml(l.acao) + '</b> ' + escHtml(l.alvo || '') + ' ' + escHtml(l.valor || '') + ' <i>' + escHtml(l.motivo || '') + '</i> <small>' + escHtml(perfData(l.created_at)) + '</small></li>'; }).join('') : '<li>' + escHtml(tr('Nenhuma.')) + '</li>') + '</ul>';
    box.innerHTML = h;
    var avisoAlvo=$('avisoAlvo'), avisoTxt=$('avisoTxt');
    if(avisoAlvo)avisoAlvo.onchange=function(){
      var alvo=avisoAlvo.value,info=avisosGrupo.find(function(a){return a.grupo===alvo;});
      avisoTxt.value=alvo?(info&&info.texto||''):(d.aviso||'');
    };
    if(window.ktTickets)window.ktTickets.renderAdmin();
  }).catch(function(){});
}
