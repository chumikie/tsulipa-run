/* TsuLiPa⭐World — MODO DEMONSTRAÇÃO (só em prévia/local, com ?demo=1 no endereço).
   Serve para testar SEM LOGIN, com uma conta de mentira ("Demo", ★500):
   Pedido de fã, Troca de cards, Festival de Unidades, Ensaio de trio, Álbum,
   Idol⭐Battle! (rival do dia, Top da Arena, Arena dos Idols, Torcida de flores),
   Bloom⭐Garden! e Photo⭐Studio! (pauta, prêmio, mural).
   As regras e os limites copiam as funções de supabase/sql/aplicado/ (5 partidas, 3 desafios,
   1 rega por dia, ★5 uma vez por dia...). O botão "+1 dia" da faixa avança o dia simulado.
   Nada é gravado: as respostas são inventadas no próprio navegador e somem ao recarregar.
   Liga em localhost, nas prévias da Netlify e nas prévias da Vercel (tsulipa-world-<algo>.vercel.app).
   Nunca carrega no site oficial (tsulipa-world.vercel.app). */
(function(){
  var h = location.hostname;
  if(h === 'tsulipa-world.vercel.app') return;   // site oficial: nunca
  if(!/^(localhost|127\.0\.0\.1)$|deploy-preview-\d+--|\.netlify\.app$|^tsulipa-world-[a-z0-9-]+\.vercel\.app$/.test(h) || !/[?&]demo=1\b/.test(location.search)) return;
  window.TW_DEMO = true;
  window.addEventListener('load', function(){
    var orig = window.contaRpc, ent = false, cartas = 3, trocas = null;
    function idols(){ return (window.hubIdolsDados && hubIdolsDados.idols) || []; }
    function nome(i){ var L = idols(); return L.length ? L[i % L.length].nick : 'Idol ' + i; }
    function av(i){ var L = idols(); return L.length ? L[i % L.length].avatar : { c:{} }; }
    // contaJ e starT são variáveis do script principal (window.contaJ é só leitura): atribuir pelo nome.
    var contaDemo = false;
    try{ if(!contaJ){ contaJ = { id:'demo', nick:'Demo', stars:500 }; starT = 500; contaDemo = true; } }
    catch(e){ try{ if(!window.contaJ){ window.contaJ = { id:'demo', nick:'Demo', stars:500 }; window.starT = 500; contaDemo = true; } }catch(e2){} }
    if(contaDemo){ try{ contaUI(); }catch(e){} try{ hubCardsUI(); }catch(e){} }

    /* ===== Jogos novos: estado simulado (some ao recarregar) ===== */
    var TIPOS = ['canto','danca','carisma'], FLORES = ['sakura','tulipa','girassol','lunar'];
    var SEMENTE = { sakura:[20,2], tulipa:[30,3], girassol:[40,4], lunar:[60,5] };
    var FUNDOS = ['rosa','cortina','nuvens','neon'], POSES = ['normal','v','coracao','tchau'], LUZES = ['suave','neon','por'],
        QUADROS = ['rosto','meio','inteiro'], OBJETOS = ['nenhum','balao','microfone','lightstick','flor_sakura','flor_tulipa','flor_girassol','flor_lunar'];
    // Elenco dos jogos novos: a vitrine real quando ela responde; senão, um elenco de exemplo (prévia sem banco).
    function elenco(){
      var L = idols().filter(function(p){ return p && p.nick; });
      return L.length >= 4 ? L : ['Tsu','Lirika','Pati','Demo Sakura','Demo Tulipa','Demo Girassol'].map(function(k){ return { nick:k, avatar:{ c:{} } }; });
    }
    function hojeBR(){ return new Date(Date.now() - 3 * 36e5).toISOString().slice(0, 10); }
    function somaDia(d, n){ var t = new Date(d + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + n); return t.toISOString().slice(0, 10); }
    function hash(t){ var x = 2166136261; t = String(t); for(var i = 0; i < t.length; i++){ x ^= t.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
    function baixo(t){ return String(t == null ? '' : t).trim().toLowerCase(); }
    function saldo(){ try{ return Number(starT) || 0; }catch(e){ return 0; } }
    function mudaSaldo(d){ var v = saldo() + d; try{ starT = v; }catch(e){} try{ if(contaDemo && contaJ) contaJ.stars = v; }catch(e){} return v; }
    function sorte(){ return Math.floor(Math.random() * 3) - 1; }
    function limita(v){ return Math.max(1, Math.min(11, v)); }
    var D = {
      dia: hojeBR(),
      canteiros: { 0:{ semente:'girassol', regas:4, ultima:'' }, 1:{ semente:'sakura', regas:1, ultima:'' } },
      flores: { sakura:2, tulipa:1 },
      partidas: [], premiadoDia: '', vitoriasSemana: 0, partidasSemana: 0, pedidos: {},
      minhaUnit: null, meusFas: 0, desafios: [], fasAlheios: {},
      torcidaDia: '', torcidaFlor: null,
      fotoPremioDia: '', mural: null, proxId: 100
    };
    function atributos(nick){ var o = {}; TIPOS.forEach(function(k){ o[k] = 1 + hash(baixo(nick) + k) % 10; }); return o; }
    function qtdCard(nick){ return 1 + hash(baixo(nick) + 'q') % 3; }
    function meusCards(){   // os cards da conta de mentira: até 8 Idols da vitrine
      return elenco().slice(0, 8).map(function(p){ return p.nick; });
    }
    function inicial(){ return meusCards().length < 3; }   // menos de 3 cards: trio inicial, como no servidor
    // Igual a private.battle_unit_resolver: 3 nomes diferentes, que a conta tem; repetidos dão até +2 no melhor atributo.
    function resolver(unit, dono){
      if(!Array.isArray(unit) || unit.length !== 3) return null;
      var vistos = {}, fora = [], cards = dono || meusCards(), ini = dono ? false : inicial();
      for(var i = 0; i < 3; i++){
        if(typeof unit[i] !== 'string') return null;
        var n = unit[i].trim(), b = baixo(n);
        if(!n || n.length > 48 || vistos[b]) return null;
        vistos[b] = 1;
        if(ini){
          if(['tsu','lirika','pati'].indexOf(b) < 0) return null;
          fora.push({ nick:b.charAt(0).toUpperCase() + b.slice(1), canto:5, danca:5, carisma:5 });
        }else{
          var real = cards.filter(function(c){ return baixo(c) === b; })[0];
          if(!real) return null;
          var a = atributos(real), bonus = Math.min(2, Math.max(0, qtdCard(real) - 1));
          if(a.canto >= a.danca && a.canto >= a.carisma) a.canto = Math.min(10, a.canto + bonus);
          else if(a.danca >= a.carisma) a.danca = Math.min(10, a.danca + bonus);
          else a.carisma = Math.min(10, a.carisma + bonus);
          a.nick = real; fora.push(a);
        }
      }
      return fora;
    }
    function rivalDoDia(){
      var L = elenco();
      if(L.length < 3) return [{ nick:'Tsu', canto:5, danca:5, carisma:5 }, { nick:'Lirika', canto:5, danca:5, carisma:5 }, { nick:'Pati', canto:5, danca:5, carisma:5 }];
      var k = hash(D.dia) % L.length;
      return [0, 1, 2].map(function(i){ var p = L[(k + i * 2 + i) % L.length], a = atributos(p.nick); a.nick = p.nick; return a; })
        .filter(function(a, i, T){ return T.findIndex(function(b){ return b.nick === a.nick; }) === i; }).concat(
          [{ nick:'Tsu', canto:5, danca:5, carisma:5 }, { nick:'Lirika', canto:5, danca:5, carisma:5 }, { nick:'Pati', canto:5, danca:5, carisma:5 }]).slice(0, 3);
    }
    function bonusTorcida(i){
      var f = D.torcidaDia === D.dia ? D.torcidaFlor : null;
      return f === 'lunar' || (f === 'sakura' && i === 0) || (f === 'tulipa' && i === 1) || (f === 'girassol' && i === 2) ? 1 : 0;
    }
    function torcidaHoje(){ return D.torcidaDia === D.dia ? D.torcidaFlor : null; }
    function floresObj(){ var o = {}; FLORES.forEach(function(f){ if(D.flores[f] > 0) o[f] = D.flores[f]; }); return o; }
    function donosArena(){   // outras contas que "deixaram" uma unit na arena
      var L = elenco().filter(function(p){ return baixo(p.nick) !== 'demo'; }).map(function(p){ return p.nick; });
      if(L.length < 4) return [];
      return L.slice(0, 6).map(function(dono, i){
        var unit = [L[(i + 1) % L.length], L[(i + 2) % L.length], L[(i + 3) % L.length]];
        return { nick:dono, unit:unit, res:resolver(unit, L) };
      }).filter(function(x){ return x.res; });
    }
    function pauta(){
      var d = D.dia, k = hash(d + 'k') % 3, tipo = ['luz','quadro','objeto'][k];
      var valor = (k === 0 ? LUZES : k === 1 ? QUADROS : ['balao','microfone','lightstick'])[hash(d + 'v') % 3];
      return { dia:d, fundo:FUNDOS[hash(d + 'f') % 4], pose:POSES[hash(d + 'p') % 4], detalhe:{ tipo:tipo, valor:valor } };
    }
    function escolhasOk(p){
      return p && typeof p === 'object' && FUNDOS.indexOf(p.fundo) >= 0 && POSES.indexOf(p.pose) >= 0 && LUZES.indexOf(p.luz) >= 0 &&
        QUADROS.indexOf(p.quadro) >= 0 && OBJETOS.indexOf(p.objeto) >= 0;
    }
    function acertos(p){ var pa = pauta(); return (p.fundo === pa.fundo ? 1 : 0) + (p.pose === pa.pose ? 1 : 0) + (p[pa.detalhe.tipo] === pa.detalhe.valor ? 1 : 0); }
    function mural(){
      if(!D.mural){
        var L = elenco().slice(0, 5);
        D.mural = L.map(function(p, i){
          return { id:i + 1, nick:p.nick, avatar:p.avatar, estrelas:1 + i % 3, dia:D.dia, criado:new Date(Date.now() - i * 36e5).toISOString(),
            escolhas:{ fundo:FUNDOS[i % 4], pose:POSES[(i + 1) % 4], luz:LUZES[i % 3], quadro:QUADROS[(i + 2) % 3], objeto:OBJETOS[i % 4] },
            coracoes:5 - i, curti:false, minha:false };
        });
      }
      return D.mural;
    }
    function demoNovos(n, a){
      a = a || {};
      var c, i, r, p, ac, est;
      /* ---- Bloom⭐Garden! (20261113_bloom_garden.sql e flores_e_caderno.sql) ---- */
      if(n === 'jardim_estado') return { ok:true, hoje:D.dia, stars:saldo(),
        canteiros:Object.keys(D.canteiros).sort().map(function(k){ var q = D.canteiros[k];
          return { canteiro:Number(k), semente:q.semente, regas:q.regas, precisa:SEMENTE[q.semente][1], regado_hoje:q.ultima === D.dia }; }),
        flores:floresObj(), sementes:SEMENTE };
      if(n === 'jardim_plantar'){
        i = Number(a.p_canteiro);
        if(!(i >= 0 && i <= 3) || i !== Math.floor(i)) return { ok:false, erro:'canteiro' };
        if(!SEMENTE[a.p_semente]) return { ok:false, erro:'semente' };
        if(D.canteiros[i]) return { ok:false, erro:'ocupado' };
        if(saldo() < SEMENTE[a.p_semente][0]) return { ok:false, erro:'estrelas' };
        D.canteiros[i] = { semente:a.p_semente, regas:0, ultima:'' };
        return { ok:true, stars:mudaSaldo(-SEMENTE[a.p_semente][0]), preco:SEMENTE[a.p_semente][0] };
      }
      if(n === 'jardim_regar'){
        c = D.canteiros[Number(a.p_canteiro)];
        if(!c) return { ok:false, erro:'vazio' };
        if(c.ultima === D.dia) return { ok:false, erro:'hoje' };
        if(c.regas >= SEMENTE[c.semente][1]) return { ok:false, erro:'florido' };
        c.regas++; c.ultima = D.dia;
        return { ok:true, regas:c.regas, precisa:SEMENTE[c.semente][1] };
      }
      if(n === 'jardim_colher'){
        c = D.canteiros[Number(a.p_canteiro)];
        if(!c) return { ok:false, erro:'vazio' };
        if(c.regas < SEMENTE[c.semente][1]) return { ok:false, erro:'cedo' };
        delete D.canteiros[Number(a.p_canteiro)];
        D.flores[c.semente] = (D.flores[c.semente] || 0) + 1;
        return { ok:true, flor:c.semente, qtd:D.flores[c.semente] };
      }
      if(n === 'jardim_usar_flor'){
        if(FLORES.indexOf(a.p_flor) < 0 || a.p_uso !== 'handshake') return { ok:false, erro:'parametros' };
        if(!(D.flores[a.p_flor] > 0)) return { ok:false, erro:'sem_flor' };
        D.flores[a.p_flor]--;
        return { ok:true, flor:a.p_flor, qtd:D.flores[a.p_flor] };
      }
      /* ---- Idol⭐Battle! (20261114_idol_battle_v1, _ranking, _v2_arena e _v3_torcida) ---- */
      if(n === 'battle_status'){
        var ini = inicial();
        return { ok:true, dia:D.dia, starter:ini, max_tentativas:5,
          tentativas:D.partidas.filter(function(x){ return x.dia === D.dia; }).length, premiado:D.premiadoDia === D.dia,
          cards:ini ? [{ nick:'Tsu', canto:5, danca:5, carisma:5, qtd:1 }, { nick:'Lirika', canto:5, danca:5, carisma:5, qtd:1 }, { nick:'Pati', canto:5, danca:5, carisma:5, qtd:1 }]
            : meusCards().map(function(k){ var o = atributos(k); o.nick = k; o.qtd = qtdCard(k); return o; }).sort(function(x, y){ return x.nick < y.nick ? -1 : 1; }),
          rival:rivalDoDia() };
      }
      if(n === 'battle_jogar'){
        if(!a.p_requisicao) return { ok:false, erro:'unit' };
        if(D.pedidos[a.p_requisicao]) return D.pedidos[a.p_requisicao];
        var feitas = D.partidas.filter(function(x){ return x.dia === D.dia; }).length;
        if(feitas >= 5) return { ok:false, erro:'limite' };
        var meu = resolver(a.p_unit);
        if(!meu) return { ok:false, erro:Array.isArray(a.p_unit) && a.p_unit.length === 3 && !inicial() ? 'sem_card' : 'unit' };
        var rival = rivalDoDia(), pos = Math.floor(Math.random() * 3), vit = 0, rodadas = [];
        for(i = 0; i < 3; i++){
          var op = rival[(i + pos) % 3], b = bonusTorcida(i), eu = limita(meu[i][TIPOS[i]] + sorte() + b), eles = op[TIPOS[i]];
          if(eu > eles) vit++;
          rodadas.push({ tipo:TIPOS[i], meu:meu[i].nick, rival:op.nick, eu:eu, eles:eles, ganhou:eu > eles, bonus:b });
        }
        var premio = 0;
        if(vit >= 2 && D.premiadoDia !== D.dia){ D.premiadoDia = D.dia; premio = 5; mudaSaldo(5); }
        D.partidasSemana++; if(vit >= 2) D.vitoriasSemana++;
        r = { ok:true, dia:D.dia, tentativas:feitas + 1, rodadas:rodadas, vitoria:vit >= 2, premio:premio, stars:saldo(), torcida:torcidaHoje() };
        D.partidas.push({ dia:D.dia }); D.pedidos[a.p_requisicao] = r;
        return r;
      }
      if(n === 'battle_ranking'){
        var top = elenco().slice(0, 6).map(function(q, k){ return { nick:q.nick, score:7 - k, partidas:9 + k }; });
        if(D.vitoriasSemana > 0) top.push({ nick:'Demo', score:D.vitoriasSemana, partidas:D.partidasSemana, eu:true });
        top.sort(function(x, y){ return y.score - x.score || x.partidas - y.partidas || (baixo(x.nick) < baixo(y.nick) ? -1 : 1); });
        top.forEach(function(x, k){ x.pos = k + 1; });
        var eu2 = top.filter(function(x){ return x.eu; })[0];
        return { ok:true, inicio:somaDia(D.dia, -new Date(D.dia + 'T12:00:00Z').getUTCDay()),
          top:top.slice(0, 10).map(function(x){ return { pos:x.pos, nick:x.nick, score:x.score, partidas:x.partidas }; }),
          eu:eu2 ? { pos:eu2.pos, score:eu2.score, partidas:eu2.partidas } : null };
      }
      if(n === 'battle_torcida') return { ok:true, dia:D.dia, hoje:torcidaHoje(), flores:floresObj() };
      if(n === 'battle_torcida_levar'){
        if(FLORES.indexOf(a.p_flor) < 0) return { ok:false, erro:'parametros' };
        if(torcidaHoje()) return { ok:false, erro:'ja' };
        if(!(D.flores[a.p_flor] > 0)) return { ok:false, erro:'sem_flor' };
        D.flores[a.p_flor]--; D.torcidaDia = D.dia; D.torcidaFlor = a.p_flor;
        return { ok:true, hoje:a.p_flor, qtd:D.flores[a.p_flor] };
      }
      if(n === 'battle_unit_salvar'){
        r = resolver(a.p_unit);
        if(!r) return { ok:false, erro:'unit' };
        D.minhaUnit = r.map(function(x){ return x.nick; });
        return { ok:true, unit:r, fas:D.meusFas };
      }
      if(n === 'battle_arena'){
        var feitos = D.desafios.filter(function(x){ return x.dia === D.dia; });
        return { ok:true, dia:D.dia, max_desafios:3, desafios:feitos.length,
          minha:D.minhaUnit ? { fas:D.meusFas, unit:resolver(D.minhaUnit) } : null,
          lista:donosArena().map(function(x){ return { nick:x.nick, fas:D.fasAlheios[x.nick] || 0,
            desafiado:feitos.some(function(f){ return f.alvo === x.nick; }),
            idols:x.res.slice().sort(function(u, v){ return baixo(u.nick) < baixo(v.nick) ? -1 : 1; }) }; }) };   // ordem da defesa fica secreta
      }
      if(n === 'battle_desafiar'){
        if(!a.p_requisicao || !a.p_alvo || String(a.p_alvo).length > 48) return { ok:false, erro:'alvo' };
        if(D.pedidos[a.p_requisicao]) return D.pedidos[a.p_requisicao];
        var hoje = D.desafios.filter(function(x){ return x.dia === D.dia; });
        if(hoje.length >= 3) return { ok:false, erro:'limite' };
        var alvo = donosArena().filter(function(x){ return baixo(x.nick) === baixo(a.p_alvo); })[0];
        if(!alvo) return { ok:false, erro:'alvo' };
        if(hoje.some(function(f){ return f.alvo === alvo.nick; })) return { ok:false, erro:'repetido' };
        var meu2 = resolver(a.p_unit);
        if(!meu2) return { ok:false, erro:'unit' };
        var v2 = 0, rod2 = [];
        for(i = 0; i < 3; i++){
          var b2 = bonusTorcida(i), eu3 = limita(meu2[i][TIPOS[i]] + sorte() + b2), el3 = alvo.res[i][TIPOS[i]];
          if(eu3 > el3) v2++;   // empate é da defesa
          rod2.push({ tipo:TIPOS[i], meu:meu2[i].nick, rival:alvo.res[i].nick, eu:eu3, eles:el3, ganhou:eu3 > el3, bonus:b2 });
        }
        if(v2 < 2) D.fasAlheios[alvo.nick] = (D.fasAlheios[alvo.nick] || 0) + 1;
        r = { ok:true, dia:D.dia, alvo:alvo.nick, desafios:hoje.length + 1, rodadas:rod2, vitoria:v2 >= 2, premio:0, torcida:torcidaHoje() };
        D.desafios.push({ dia:D.dia, alvo:alvo.nick }); D.pedidos[a.p_requisicao] = r;
        return r;
      }
      /* ---- Photo⭐Studio! (20261114_photo_studio.sql e _studio_mural.sql) ---- */
      if(n === 'studio_pauta'){ r = pauta(); r.ok = true; return r; }
      if(n === 'studio_clique' || n === 'studio_publicar'){
        p = a.p;
        if(!escolhasOk(p)) return { ok:false, erro:'escolhas' };
        if(p.objeto.indexOf('flor_') === 0 && !(D.flores[p.objeto.slice(5)] > 0)) return { ok:false, erro:'flor' };
        ac = acertos(p); est = Math.max(1, ac);
        if(n === 'studio_clique'){
          var pago = est === 3 && D.fotoPremioDia !== D.dia;
          if(pago){ D.fotoPremioDia = D.dia; mudaSaldo(5); }
          return { ok:true, estrelas:est, acertos:ac, premio:pago ? 5 : 0, stars:pago ? saldo() : null, pauta:pauta() };
        }
        if(mural().some(function(x){ return x.minha && x.dia === D.dia; })) return { ok:false, erro:'ja_publicou' };
        r = { id:D.proxId++, nick:'Demo', avatar:null, estrelas:est, dia:D.dia, criado:new Date().toISOString(),
          escolhas:{ fundo:p.fundo, pose:p.pose, luz:p.luz, quadro:p.quadro, objeto:p.objeto }, coracoes:0, curti:false, minha:true };
        try{ r.avatar = (contaJ && contaJ.avatar) || null; }catch(e){}
        D.mural.push(r);
        return { ok:true, id:r.id, estrelas:est };
      }
      if(n === 'studio_mural') return mural().slice().sort(function(x, y){ return y.coracoes - x.coracoes || (x.criado < y.criado ? 1 : -1); })
        .map(function(x){ return Object.assign({}, x); });
      if(n === 'studio_curtir'){
        c = mural().filter(function(x){ return x.id === Number(a.p_id); })[0];
        if(!c) return { ok:false, erro:'post' };
        if(c.minha) return { ok:false, erro:'propria' };
        if(!c.curti){ c.curti = true; c.coracoes++; }
        return { ok:true, coracoes:c.coracoes };
      }
      if(n === 'studio_capa'){
        c = mural().filter(function(x){ return x.coracoes > 0; }).sort(function(x, y){ return y.coracoes - x.coracoes; })[0];
        return c ? { id:c.id, nick:c.nick, avatar:c.avatar, escolhas:c.escolhas, estrelas:c.estrelas, dia:c.dia, coracoes:c.coracoes, fechada:false } : null;
      }
      return undefined;
    }
    window.TW_DEMO_ESTADO = D;   // para conferir pelo console

    var faixa = document.createElement('div');
    faixa.textContent = '🧪 Modo demonstração · nada é salvo';
    faixa.style.cssText = 'position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:99;background:#7b3ff0;color:#fff;font:800 12px "M PLUS Rounded 1c",sans-serif;padding:6px 8px 6px 14px;border-radius:999px;white-space:nowrap;max-width:96vw;box-shadow:0 4px 12px rgba(0,0,0,.25)';
    // "+1 dia": avança o dia simulado, para testar regas, limites diários e prêmios do dia seguinte.
    var maisDia = document.createElement('button');
    maisDia.type = 'button'; maisDia.textContent = '+1 dia';
    maisDia.setAttribute('aria-label', 'Modo demonstração: avançar um dia');
    maisDia.style.cssText = 'margin-left:8px;min-height:32px;padding:4px 12px;border:0;border-radius:999px;background:#b6ff3b;color:#3a1a7a;font:800 12px "M PLUS Rounded 1c",sans-serif;cursor:pointer';
    maisDia.onclick = function(){
      D.dia = somaDia(D.dia, 1);
      var sem = new Date(D.dia + 'T12:00:00Z').getUTCDay();
      if(sem === 0){ D.vitoriasSemana = 0; D.partidasSemana = 0; }   // Top da Arena: semana começa no domingo
      if(sem === 1) D.mural = null;                                  // mural do Studio: semana começa na segunda
      faixa.firstChild.nodeValue = '🧪 Demonstração · dia ' + D.dia.slice(8) + '/' + D.dia.slice(5, 7) + ' · reabra o jogo';
    };
    faixa.appendChild(maisDia);
    document.body.appendChild(faixa);
    window.contaRpc = function(n, a){
      var novo;
      try{ novo = demoNovos(n, a); }catch(e){ return Promise.reject(e); }
      if(novo !== undefined) return Promise.resolve(novo);
      if(n === 'pedido_fa_hoje') return Promise.resolve({ ok:true, tipo:'corridas3', meta:3, progresso:ent ? 3 : 3, feito:true, resgatado:ent, cartas:cartas });
      if(n === 'entregar_pedido_fa'){ ent = true; cartas++; return Promise.resolve({ ok:true, cartas:cartas }); }
      if(n === 'album_cards') return Promise.resolve(idols().slice(0, 9).map(function(p, i){ return { card:{ nick:p.nick, avatar:p.avatar, best:p.best }, tipo:'card', vezes:i % 3 + 1 }; }));
      if(n === 'meu_perfil') return Promise.resolve({ nick:'Demo', corridas:42, centers:3, best:10854, pos_geral:3, desde:'2026-05-02', coracoes:9, insignias:['estreia:1'], cards:[], avatar:{},
        por_personagem:{ Idol:10854, Tsu:3442 }, ultimas:[{ score:2362, char:'Idol', created_at:'2026-10-31T12:00:00Z' }, { score:3992, char:'Idol', created_at:'2026-10-30T12:00:00Z' }], melhores:[{ score:10854, char:'Idol', created_at:'2026-10-28T12:00:00Z' }] });
      if(n === 'sora_my_profile') return Promise.resolve({ ultimas:[{ score:76, at:'2026-11-02' }, { score:398, at:'2026-11-01' }], melhores:[{ score:1079, at:'2026-10-31' }] });
      if(n === 'minhas_trocas'){
        if(!trocas) trocas = [
          { id:1, eu_propus:false, outro:nome(1), dou:nome(2).toLowerCase(), quero:nome(4).toLowerCase(), status:'pendente' },
          { id:2, eu_propus:true, outro:nome(5), dou:nome(1).toLowerCase(), quero:nome(6).toLowerCase(), status:'pendente' },
          { id:3, eu_propus:true, outro:nome(7), dou:nome(4).toLowerCase(), quero:nome(8).toLowerCase(), status:'aceita' } ];
        return Promise.resolve(trocas.slice());
      }
      if(n === 'propor_troca'){ trocas.unshift({ id:Date.now(), eu_propus:true, outro:a.p_para, dou:String(a.p_dou).toLowerCase(), quero:String(a.p_quero).toLowerCase(), status:'pendente' }); return Promise.resolve({ ok:true }); }
      if(n === 'responder_troca' || n === 'cancelar_troca'){ trocas.forEach(function(t){ if(t.id === a.p_id) t.status = n === 'cancelar_troca' ? 'cancelada' : a.p_aceitar ? 'aceita' : 'recusada'; }); return Promise.resolve({ ok:true }); }
      if(n === 'festival_unidades') return Promise.resolve({ times:[
        { codigo:'R', total:42300, cantaram:3, destaque:nome(0), destaque_nota:20230 }, { codigo:'B', total:18119, cantaram:1, destaque:nome(2), destaque_nota:18119 },
        { codigo:'S', total:9505, cantaram:1, destaque:nome(3), destaque_nota:9505 }, { codigo:'KKS', total:0, cantaram:0 } ] });
      if(n === 'meu_trio_semana') return Promise.resolve({ ok:true, aberto:true, membros:[
        { nick:nome(0), avatar:av(0), feito:true }, { nick:contaJ.nick, avatar:av(3), eu:true, feito:true }, { nick:nome(5), avatar:av(5), feito:true } ] });
      if(n === 'news_posts') return orig.apply(this, arguments).then(function(L){ return L && L.length ? L : [
        { id:1, titulo:'Zipper⭐Shop! abriu!', legenda:'Exemplo de post do blog: só a admin publica, com imagem, título e legenda.', imagem:'', criado:new Date().toISOString() } ]; });
      return orig.apply(this, arguments);
    };
  });
})();
