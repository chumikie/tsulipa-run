/* TsuLiPa⭐World · conquistas à vista (21/11/2026 · PR das melhorias, parte 5).
   Inspirado nas conquistas com nível do Habbo, mas em cima do que já existe: as insígnias de PERF_INS, os níveis 1–3
   de PERF_TIERS (calculados no servidor por public.insignias) e a estante do Perfil.
   - meu_progresso_conquistas: os mesmos contadores do servidor, para mostrar "faltam N" com barra.
   - Pontos de conquista: cada nível de insígnia vale 10 (sazonais 5, especiais 15).
   - Até 5 insígnias em destaque no topo do perfil (salvar_destaques / destaques_de).
   - Perfil completo: foto, emoji, cor, frase, oshi, aniversário e destaques.
   - Novidade no perfil (corações e recados recebidos desde a última visita) acende um pontinho no avatar do topo.
   API: window.TW_CONQ = {t, dados, pontos, proximos, completo, novidade, carregar, perfilMontar, abaPerfil, contaMudou}. */
(function(){
  'use strict';
  var TXT = {
    pontos:{pt:'{n} pontos de conquista',en:'{n} achievement points',es:'{n} puntos de logro',id:'{n} poin pencapaian',th:'{n} แต้มความสำเร็จ',ja:'実績ポイント {n}'},
    emblemas:{pt:'{n} insígnias',en:'{n} badges',es:'{n} insignias',id:'{n} lencana',th:'{n} เหรียญ',ja:'バッジ {n}個'},
    seu:{pt:'Seu perfil',en:'Your profile',es:'Tu perfil',id:'Profilmu',th:'โปรไฟล์ของคุณ',ja:'あなたのプロフィール'},
    prox:{pt:'Quase lá',en:'Almost there',es:'Casi',id:'Hampir',th:'ใกล้แล้ว',ja:'もう少し'},
    falta:{pt:'Faltam {n} {u}',en:'{n} {u} to go',es:'Faltan {n} {u}',id:'Kurang {n} {u}',th:'อีก {n} {u}',ja:'あと{n} {u}'},
    falta1:{pt:'Falta 1 {u}',en:'1 {u} to go',es:'Falta 1 {u}',id:'Kurang 1 {u}',th:'อีก 1 {u}',ja:'あと1 {u}'},
    nivel:{pt:'nível {n}',en:'level {n}',es:'nivel {n}',id:'level {n}',th:'เลเวล {n}',ja:'レベル{n}'},
    maximo:{pt:'Nível máximo!',en:'Max level!',es:'¡Nivel máximo!',id:'Level maksimal!',th:'เลเวลสูงสุด!',ja:'最高レベル！'},
    completo:{pt:'Perfil {p}% completo',en:'Profile {p}% complete',es:'Perfil {p}% completo',id:'Profil {p}% lengkap',th:'โปรไฟล์สมบูรณ์ {p}%',ja:'プロフィール {p}%'},
    faltaItem:{pt:'Falta: {i}',en:'Missing: {i}',es:'Falta: {i}',id:'Kurang: {i}',th:'ยังขาด: {i}',ja:'あと: {i}'},
    c_foto:{pt:'foto',en:'photo',es:'foto',id:'foto',th:'รูป',ja:'写真'},
    c_emoji:{pt:'emoji',en:'emoji',es:'emoji',id:'emoji',th:'อีโมจิ',ja:'絵文字'},
    c_cor:{pt:'cor',en:'color',es:'color',id:'warna',th:'สี',ja:'カラー'},
    c_frase:{pt:'frase',en:'quote',es:'frase',id:'kutipan',th:'คำพูด',ja:'ひとこと'},
    c_oshi:{pt:'oshi',en:'oshi',es:'oshi',id:'oshi',th:'โอชิ',ja:'推し'},
    c_aniver:{pt:'aniversário',en:'birthday',es:'cumpleaños',id:'ulang tahun',th:'วันเกิด',ja:'誕生日'},
    c_destaque:{pt:'destaques',en:'highlights',es:'destacadas',id:'sorotan',th:'ไฮไลต์',ja:'ピックアップ'},
    novo:{pt:'Novo: {txt}',en:'New: {txt}',es:'Nuevo: {txt}',id:'Baru: {txt}',th:'ใหม่: {txt}',ja:'新着: {txt}'},
    nCor:{pt:'{n} 💖',en:'{n} 💖',es:'{n} 💖',id:'{n} 💖',th:'{n} 💖',ja:'{n} 💖'},
    nRec:{pt:'{n} 💌',en:'{n} 💌',es:'{n} 💌',id:'{n} 💌',th:'{n} 💌',ja:'{n} 💌'},
    destTit:{pt:'Em destaque',en:'Highlights',es:'Destacadas',id:'Sorotan',th:'ไฮไลต์',ja:'ピックアップ'},
    destDica:{pt:'Toque numa insígnia da estante e escolha "Destacar" (até 5).',en:'Tap a badge on the shelf and choose "Highlight" (up to 5).',es:'Toca una insignia del estante y elige "Destacar" (hasta 5).',id:'Ketuk lencana di rak lalu pilih "Sorot" (maks. 5).',th:'แตะเหรียญบนชั้นแล้วเลือก "ไฮไลต์" (สูงสุด 5)',ja:'棚のバッジをタップして「ピックアップ」を選ぼう（5個まで）。'},
    destacar:{pt:'📌 Destacar no perfil',en:'📌 Highlight on profile',es:'📌 Destacar en el perfil',id:'📌 Sorot di profil',th:'📌 ไฮไลต์ในโปรไฟล์',ja:'📌 プロフィールにピックアップ'},
    tirar:{pt:'Tirar do destaque',en:'Remove highlight',es:'Quitar de destacadas',id:'Hapus sorotan',th:'เอาออกจากไฮไลต์',ja:'ピックアップから外す'},
    cheio:{pt:'Já são 5 em destaque: tire uma antes.',en:'You already have 5 highlights: remove one first.',es:'Ya hay 5 destacadas: quita una antes.',id:'Sudah 5 sorotan: hapus satu dulu.',th:'มีไฮไลต์ครบ 5 แล้ว: เอาออกก่อนหนึ่งอัน',ja:'もう5個あります。先にひとつ外してね。'},
    todas:{pt:'Ver todas ({n})',en:'See all ({n})',es:'Ver todas ({n})',id:'Lihat semua ({n})',th:'ดูทั้งหมด ({n})',ja:'すべて見る（{n}）'},
    menos:{pt:'Mostrar menos',en:'Show less',es:'Mostrar menos',id:'Tampilkan lebih sedikit',th:'แสดงน้อยลง',ja:'たたむ'},
    responder:{pt:'Responder',en:'Reply',es:'Responder',id:'Balas',th:'ตอบกลับ',ja:'返信'},
    erro:{pt:'Não deu para salvar. Tente de novo.',en:"Couldn't save. Try again.",es:'No se pudo guardar. Inténtalo de nuevo.',id:'Gagal menyimpan. Coba lagi.',th:'บันทึกไม่ได้ ลองอีกครั้ง',ja:'保存できませんでした。もう一度試してね。'},
    u_pontos:{pt:'pontos',en:'points',es:'puntos',id:'poin',th:'แต้ม',ja:'点'},
    u_metros:{pt:'m no Sora',en:'m in Sora',es:'m en Sora',id:'m di Sora',th:'ม. ใน Sora',ja:'m（Sora）'},
    u_corridas:{pt:'corridas',en:'runs',es:'carreras',id:'lari',th:'รอบวิ่ง',ja:'ラン'}
  };
  function L(){ var l = typeof LANG === 'string' ? LANG : 'pt'; return TXT.pontos[l] ? l : 'pt'; }
  function t(k, v){ var s = (TXT[k] && (TXT[k][L()] || TXT[k].pt)) || k; return s.replace(/\{(\w+)\}/g, function(_, n){ return v && v[n] != null ? v[n] : ''; }); }
  function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
  function tr2(s){ return typeof tr === 'function' ? tr(s) : s; }
  function logado(){ return typeof contaJ !== 'undefined' && !!contaJ; }
  function rpc(n, a){ return typeof contaRpc === 'function' ? contaRpc(n, a) : Promise.reject(new Error('sem conta')); }
  function lerLS(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function gravarLS(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }
  function conta(){ return logado() ? String(contaJ.id || contaJ.nick || '') : ''; }
  function avisar(){ try{ window.dispatchEvent(new Event('tw-semana')); }catch(e){} }   // o Início do celular redesenha
  function ins(k){ var L2 = typeof PERF_INS !== 'undefined' ? PERF_INS : []; for(var i = 0; i < L2.length; i++) if(L2[i][0] === k) return L2[i]; return null; }
  function nv(tem, k){ var n = 0; (tem || []).forEach(function(x){ var p = String(x).split(':'); if(p[0] === k) n = Math.max(n, +p[1] || 1); }); return n; }

  // Os mesmos limites do servidor (public.insignias / insignias_calc). Níveis 1–3 numa insígnia (PERF_TIERS) ou
  // uma sequência de insígnias que sobe junto (Center → Eternal Ace → Kami-Oshi; Sora 500 → 1500 → 3000 m).
  var CONT = {duo:'duos', presenca:'dias', maratona:'corridas', amada:'recebidos', carteiro:'recados', amizade:'dados', fashion:'compras'};
  var CADEIAS = [[['center', 'ace', 'kami'], 'best', [5000, 30000, 50000], 'u_pontos'], [['sora_500', 'sora_1500', 'sora_3000'], 'sora', [500, 1500, 3000], 'u_metros']];
  function limites(k){ return typeof PERF_TIERS !== 'undefined' && PERF_TIERS[k] ? PERF_TIERS[k] : null; }

  var prog = null, dono = '', carregando = false, destPublico = {};
  // 22/11: o último emoji conhecido do próprio perfil (meu_perfil ou o que acabou de ser salvo). O resumo de conquistas
  // é carregado uma vez por sessão e o cartão do Início continuava com "Falta: emoji" depois de salvar.
  var meuEmoji = null, meuEmojiDono = '';
  function dados(){ return prog && dono === conta() ? prog : null; }
  function carregar(forcar){
    if(!logado() || carregando) return Promise.resolve(dados());
    if(!forcar && dados()) return Promise.resolve(prog);
    var quem = conta(); carregando = true;
    return rpc('meu_progresso_conquistas').then(function(r){
      carregando = false;
      if(quem !== conta() || !r || typeof r !== 'object') return null;
      prog = r; dono = quem;
      if(!lerLS(chaveVisto())) marcarVisto();   // primeira vez: só guarda, sem pontinho falso
      avisar(); return prog;
    }).catch(function(){ carregando = false; return null; });
  }

  // ---------- pontos, próximos níveis e perfil completo ----------
  function pontos(tem){
    var m = {};
    (tem || []).forEach(function(x){ var p = String(x).split(':'); m[p[0]] = Math.max(m[p[0]] || 0, +p[1] || 1); });
    return Object.keys(m).reduce(function(s, k){ return s + m[k] * (/^tema_/.test(k) ? 5 : /^esp_/.test(k) ? 15 : 10); }, 0);
  }
  function proximos(p, tem, max){
    p = p || dados(); if(!p) return [];
    tem = tem || p.insignias || [];
    var L2 = [];
    Object.keys(CONT).forEach(function(k){
      var TI = limites(k), i = ins(k); if(!TI || !i) return;
      var n = nv(tem, k); if(n >= 3) return;
      var atual = +p[CONT[k]] || 0, alvo = TI[n]; if(atual >= alvo) return;   // já passou: o servidor confirma na próxima conferida
      L2.push({k:k, emo:i[1], nome:tr2(i[2]), nivel:n + 1, atual:atual, alvo:alvo, un:tr2(TI[3])});
    });
    CADEIAS.forEach(function(c){
      var j = 0; while(j < c[0].length && nv(tem, c[0][j])) j++;
      if(j >= c[0].length) return;
      var i = ins(c[0][j]), atual = +p[c[1]] || 0, alvo = c[2][j]; if(!i || atual >= alvo) return;
      L2.push({k:c[0][j], emo:i[1], nome:tr2(i[2]), nivel:0, atual:atual, alvo:alvo, un:t(c[3])});
    });
    if(!nv(tem, 'estreia') && ins('estreia')) L2.push({k:'estreia', emo:ins('estreia')[1], nome:tr2(ins('estreia')[2]), nivel:0, atual:+p.corridas || 0, alvo:1, un:t('u_corridas')});
    L2.sort(function(a, b){ return b.atual / b.alvo - a.atual / a.alvo; });
    return L2.slice(0, max || 3);
  }
  function progressoDe(k, p, tem){   // para a descrição de uma insígnia tocada na estante
    p = p || dados(); if(!p) return null;
    var r = proximos(p, tem || p.insignias, 99).filter(function(x){ return x.k === k; })[0];
    if(r) return r;
    var TI = limites(k); if(TI && nv(tem || p.insignias, k) >= 3) return {max:true};
    for(var c = 0; c < CADEIAS.length; c++){ var ix = CADEIAS[c][0].indexOf(k); if(ix >= 0 && nv(tem || p.insignias, k) && ix === CADEIAS[c][0].length - 1) return {max:true}; }
    return null;
  }
  var ITENS = ['foto', 'emoji', 'cor', 'frase', 'oshi', 'aniver', 'destaque'];
  function completo(p){
    p = p || dados(); if(!p || !p.completo) return null;
    var campos=Object.assign({},p.completo);
    // O perfil salvo é a referência para emoji livre; a lista de sugestões não valida identidade.
    if(typeof perfMeu!=='undefined'&&perfMeu&&typeof perfAtual!=='undefined'&&perfAtual&&typeof contaJ!=='undefined'&&contaJ&&perfAtual.nick===contaJ.nick&&typeof perfAtual.emoji==='string')campos.emoji=!!perfAtual.emoji.trim();
    else if(meuEmoji !== null && meuEmojiDono === conta()) campos.emoji = meuEmoji;   // mesmo com o perfil fechado (cartão do Início)
    var falta = ITENS.filter(function(k){ return !campos[k]; });
    return {pct:Math.round((ITENS.length - falta.length) / ITENS.length * 100), falta:falta.map(function(k){ return t('c_' + k); })};
  }
  function faltaTxt(n, u){ return n === 1 ? t('falta1', {u:u}) : t('falta', {n:n, u:u}); }
  function barra(a, b){ var pc = Math.max(4, Math.min(100, Math.round(a / b * 100))); return '<span class="twq-barra" role="progressbar" aria-valuemin="0" aria-valuemax="' + b + '" aria-valuenow="' + Math.min(a, b) + '"><i style="width:' + pc + '%"></i></span>'; }
  function linhaProx(x){
    return '<li><span class="twq-emo" aria-hidden="true">' + esc(x.emo) + '</span><span class="twq-txt"><b>' + esc(x.nome) + (x.nivel > 1 ? ' · ' + esc(t('nivel', {n:x.nivel})) : '') + '</b>' +
      barra(x.atual, x.alvo) + '<small>' + esc(x.atual) + '/' + esc(x.alvo) + ' · ' + esc(faltaTxt(x.alvo - x.atual, x.un)) + '</small></span></li>';
  }

  // ---------- novidades desde a última visita ao próprio perfil ----------
  function chaveVisto(){ return 'tw_perfil_visto:' + conta(); }
  function marcarVisto(){ var p = dados(); if(p) gravarLS(chaveVisto(), JSON.stringify({c:+p.recebidos || 0, r:+p.recados_rec || 0})); }
  function novidade(){
    var p = dados(); if(!p) return null;
    var v = null; try{ v = JSON.parse(lerLS(chaveVisto()) || 'null'); }catch(e){}
    if(!v) return null;
    var c = Math.max(0, (+p.recebidos || 0) - (+v.c || 0)), r = Math.max(0, (+p.recados_rec || 0) - (+v.r || 0));
    if(!c && !r) return null;
    return {coracoes:c, recados:r, txt:[c ? t('nCor', {n:c}) : '', r ? t('nRec', {n:r}) : ''].filter(Boolean).join(' · ')};
  }

  // ---------- cartão do Início (tw-celular.js) ----------
  function cartaoHtml(){
    var p = dados(); if(!p){ if(logado()) carregar(); return ''; }   // a conta pode entrar depois deste arquivo: carrega na primeira vez que o Início desenha
    var tem = p.insignias || [], px = proximos(p, tem, 1)[0], cp = completo(p), nov = novidade();
    var qtd = {}; tem.forEach(function(x){ qtd[String(x).split(':')[0]] = 1; });
    return '<button type="button" class="twq-cartao" data-ir="perfil"><span class="twq-c-ico" aria-hidden="true">✦</span>' +   // sem o avatar: ele já está no topo do Início (23/11)
      '<span class="twq-c-txt"><b>' + esc(t('seu')) + (nov ? ' <em class="twq-novo">' + esc(t('novo', {txt:nov.txt})) + '</em>' : '') + '</b>' +
      '<small>✦ ' + esc(t('pontos', {n:pontos(tem)})) + ' · ' + esc(t('emblemas', {n:Object.keys(qtd).length})) + '</small>' +
      (px ? '<small class="twq-c-prox">' + esc(px.emo + ' ' + px.nome) + ' ' + barra(px.atual, px.alvo) + ' ' + esc(px.atual + '/' + px.alvo) + '</small>' : '') +
      (cp && cp.pct < 100 ? '<small class="twq-c-comp">' + esc(t('completo', {p:cp.pct})) + ' · ' + esc(t('faltaItem', {i:cp.falta.slice(0, 2).join(', ')})) + '</small>' : '') +
      '</span></button>';
  }

  // ---------- Perfil (perfil-tela.js chama perfilMontar e abaPerfil) ----------
  function destaqueHtml(lista, meu){
    lista = (lista || []).filter(function(x){ return ins(String(x).split(':')[0]); });
    if(!lista.length) return meu ? '' : '';
    return '<span class="twq-dest" aria-label="' + esc(t('destTit')) + '">' + lista.map(function(x){
      var k = String(x).split(':')[0], i = ins(k), n = +String(x).split(':')[1] || 0;
      return '<i title="' + esc(tr2(i[2])) + '">' + esc(i[1]) + (n > 1 ? '<sup>' + n + '</sup>' : '') + '</i>';
    }).join('') + '</span>';
  }
  function poeDestaque(html){
    var id = document.querySelector('#perfCorpo .perfid'); if(!id) return;
    var v = id.querySelector('.twq-dest'); if(v) v.remove();
    if(html) id.querySelector('.perfrk') ? id.querySelector('.perfrk').insertAdjacentHTML('afterend', html) : id.insertAdjacentHTML('beforeend', html);
  }
  function destaquesMeus(){ var p = dados(), tem = p ? p.insignias || [] : []; return ((p && p.destaque) || []).map(function(k){ return tem.filter(function(x){ return String(x).split(':')[0] === k; })[0] || k; }); }
  // O perfil acabou de salvar (index.html): guarda o emoji, recarrega o resumo e o Início redesenha.
  function perfilSalvo(emoji){
    if(typeof emoji === 'string'){ meuEmoji = !!emoji.trim(); meuEmojiDono = conta(); }
    if(prog && prog.completo && meuEmoji !== null) prog.completo.emoji = meuEmoji;
    avisar(); return carregar(true);
  }
  function perfilMontar(d, meu){
    if(meu && d && typeof d.emoji === 'string'){ meuEmoji = !!d.emoji.trim(); meuEmojiDono = conta(); }
    if(meu){
      carregar(true).then(function(){ if(typeof perfMeu !== 'undefined' && perfMeu && typeof perfAtual!=='undefined' && perfAtual===d && logado() && d.nick===contaJ.nick){ var p=dados();if(p&&p.completo&&typeof d.emoji==='string')p.completo.emoji=!!d.emoji.trim();poeDestaque(destaqueHtml(destaquesMeus(), true)); marcarVisto(); abaPerfil(d, true); avisar(); } });
      return;
    }
    var nick = d && d.nick; if(!nick) return;
    var pronto = function(L2){ if(typeof perfAtual !== 'undefined' && perfAtual && perfAtual.nick === nick) poeDestaque(destaqueHtml(L2, false)); };
    if(destPublico[nick]) return pronto(destPublico[nick]);
    rpc('destaques_de', {p_nick:nick}).then(function(r){ if(Array.isArray(r)){ destPublico[nick] = r; pronto(r); } }).catch(function(){});
  }
  // Estante mais curta: as conquistadas e só as 5 próximas com cadeado; o resto em "Ver todas"
  function estanteCurta(){
    var est = document.getElementById('perfIns'); if(!est || est.getAttribute('data-twq-curta')) return;
    var fechadas = est.querySelectorAll('.perfin:not(.ok)'); if(fechadas.length <= 6) return;
    est.setAttribute('data-twq-curta', '1');
    for(var i = 5; i < fechadas.length; i++) fechadas[i].classList.add('twq-oculta');
    est.insertAdjacentHTML('afterend', '<button type="button" class="twq-todas" data-twq-todas aria-expanded="false">' + esc(t('todas', {n:fechadas.length - 5})) + '</button>');
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-twq-todas]'); if(!b) return;
    var est = document.getElementById('perfIns'); if(!est) return;
    var ab = est.classList.toggle('twq-aberta'), n = est.querySelectorAll('.twq-oculta').length;
    b.setAttribute('aria-expanded', ab); b.textContent = ab ? t('menos') : t('todas', {n:n});
  });
  function abaPerfil(d, meu){
    if(!meu) return;
    estanteCurta();
    var p = dados(), box = document.getElementById('perfAbaCorpo'); if(!p || !box) return;
    var v = document.getElementById('twqPerfil'); if(v) v.remove();
    var est = box.querySelector('.perfestconta') || box.querySelector('#perfIns'); if(!est) return;
    var h3 = est.previousElementSibling && est.previousElementSibling.tagName === 'H3' ? est.previousElementSibling : est;
    // compacto (o Perfil já é longo): pontos + a conquista mais perto numa linha; o resto só em "ver mais"
    var px = proximos(p, null, 3), cp = completo(p), um = px[0];
    h3.insertAdjacentHTML('afterend', '<div class="twq-perfil" id="twqPerfil">' +
      '<p class="twq-linha"><b class="twq-pts">✦ ' + esc(t('pontos', {n:pontos(p.insignias)})) + '</b>' +
      (um ? '<span class="twq-um">' + esc(um.emo + ' ' + um.nome) + ' ' + barra(um.atual, um.alvo) + ' <small>' + esc(um.atual + '/' + um.alvo) + '</small></span>' : '') + '</p>' +
      (px.length > 1 ? '<details class="twq-mais"><summary>' + esc(t('prox')) + ' (' + px.length + ')</summary><ul class="twq-lista">' + px.map(linhaProx).join('') + '</ul></details>' : '') +
      (!(p.destaque || []).length ? '<p class="twq-comp-l">📌 ' + esc(t('destDica')) + '</p>' : '') + '</div>');
  }

  // Ao tocar numa insígnia da estante, a descrição de sempre ganha a barra do próximo nível e, no próprio perfil,
  // o botão de destacar. Roda depois do clique do index.html (que escreve a descrição).
  // "Responder" num recado recebido: abre o perfil de quem escreveu e deixa o campo de recado pronto
  function responder(nick){
    if(typeof perfAbrir !== 'function') return;
    perfAbrir(nick);
    var n = 0, ir = setInterval(function(){
      var inp = document.getElementById('perfRecTxt'), ok = typeof perfAtual !== 'undefined' && perfAtual && perfAtual.nick === nick;
      if((ok && inp) || ++n > 40){ clearInterval(ir); if(ok && inp){ try{ inp.scrollIntoView({block:'center'}); inp.focus({preventScroll:true}); }catch(e){ inp.focus(); } } }
    }, 100);
  }
  document.addEventListener('click', function(e){
    var rsp = e.target.closest && e.target.closest('[data-perfresp]');
    if(rsp){ responder(rsp.getAttribute('data-perfresp')); return; }
    var pin = e.target.closest && e.target.closest('[data-twq-pin]');
    if(pin){ alternar(pin.getAttribute('data-twq-pin'), pin); return; }
    var b = e.target.closest && e.target.closest('#perfCorpo .perfin'); if(!b) return;
    setTimeout(function(){ descricao(b); }, 0);
  });
  function descricao(b){
    var dsc = document.getElementById('perfInsDesc'), k = b.getAttribute('data-ins'); if(!dsc || !k || dsc.hidden) return;
    var meu = typeof perfMeu !== 'undefined' && perfMeu, p = meu ? dados() : null, extra = '';
    if(p){
      var r = progressoDe(k, p, typeof perfInsTem !== 'undefined' ? perfInsTem : null);
      if(r && r.max) extra += '<span class="twq-d-prox">🌟 ' + esc(t('maximo')) + '</span>';
      else if(r) extra += '<span class="twq-d-prox">' + barra(r.atual, r.alvo) + '<small>' + esc(r.atual + '/' + r.alvo + ' · ' + faltaTxt(r.alvo - r.atual, r.un)) + '</small></span>';
      if(b.classList.contains('ok')){
        var on = (p.destaque || []).indexOf(k) >= 0;
        extra += '<button type="button" class="btn alt twq-pin" data-twq-pin="' + esc(k) + '" aria-pressed="' + on + '">' + esc(on ? t('tirar') : t('destacar')) + '</button>';
      }
    }
    if(extra) dsc.insertAdjacentHTML('beforeend', '<span class="twq-d">' + extra + '</span>');
  }
  function alternar(k, bt){
    var p = dados(); if(!p) return;
    var L2 = (p.destaque || []).slice(), i = L2.indexOf(k);
    if(i >= 0) L2.splice(i, 1);
    else{ if(L2.length >= 5){ msg(t('cheio')); return; } L2.push(k); }
    bt.disabled = true;
    rpc('salvar_destaques', {p_ins:L2}).then(function(r){
      bt.disabled = false;
      if(!r || r.ok === false){ msg(t('erro')); return; }
      p.destaque = r.destaque || L2; if(p.completo) p.completo.destaque = p.destaque.length > 0;
      var on = p.destaque.indexOf(k) >= 0; bt.setAttribute('aria-pressed', on); bt.textContent = on ? t('tirar') : t('destacar');
      poeDestaque(destaqueHtml(destaquesMeus(), true)); abaPerfil(null, true); avisar();
      if(typeof beep === 'function') beep(on ? 1175 : 784, .06, 'triangle', .04);
    }).catch(function(){ bt.disabled = false; msg(t('erro')); });
  }
  function msg(txt){ if(typeof perfTopoMsg === 'function') perfTopoMsg(txt); }

  function contaMudou(){ prog = null; dono = ''; destPublico = {}; if(logado()) carregar(true); else avisar(); }
  // de tempos em tempos (corridas, corações e recados mudam os números)
  if(typeof document !== 'undefined' && document.addEventListener) document.addEventListener('visibilitychange', function(){ if(!document.hidden && logado()) carregar(true); });
  if(window.addEventListener) window.addEventListener('tw-corrida-fim', function(){ setTimeout(function(){ if(logado()) carregar(true); }, 4000); });

  window.TW_CONQ = {t:t, dados:dados, pontos:pontos, proximos:proximos, completo:completo, novidade:novidade, carregar:carregar,
    cartaoHtml:cartaoHtml, perfilMontar:perfilMontar, perfilSalvo:perfilSalvo, abaPerfil:abaPerfil, contaMudou:contaMudou};
  if(logado()) carregar();
})();

