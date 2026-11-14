/* TsuLiPa⭐World — MODO DEMONSTRAÇÃO (só em prévia/local, com ?demo=1 no endereço).
   Serve para testar SEM LOGIN, com uma conta de mentira ("Demo", ★500):
   Pedido de fã, Troca de cards, Festival de Unidades, Ensaio de trio, Álbum,
   Idol⭐Battle! (rival do dia, Top da Arena, Arena dos Idols, Torcida de flores),
   Pó de estrela do Gacha, Pedido de cena do Moon⭐Duo! (★5), Bloom⭐Garden!, Photo⭐Studio! (pauta, prêmio, mural), Happy⭐Cafe! (partida verificada, cliente VIP,
   bônus do dia) e Handshake⭐Event! (8 rodadas, cor do lightstick, prêmio do dia).
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
      fotoPremioDia: '', mural: null, proxId: 100,
      cafeRuns: {}, cafeSessoes: {}, cafeReceitas: {}, hsSessoes: {}, hsPremio: null, bonusDia: {}, tickets: 0,
      album: null, po: 0, gpoReq: {}, duoLog: []
    };
    // álbum de mentira: os 9 primeiros Idols da vitrine, com 1 a 3 cópias (os de 2+ podem virar pó)
    function album(){ if(!D.album || !Object.keys(D.album).length){ D.album = {}; idols().slice(0, 9).forEach(function(p, i){ D.album[p.nick] = i % 3 + 1; }); } return D.album; }
    function novoId(){ try{ return crypto.randomUUID(); }catch(e){ return 'demo-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10); } }
    function semanaJogo(){ return Math.floor((Math.floor(Date.parse(D.dia + 'T00:00:00Z') / 864e5) + 3) / 7) % 5; }   // mesma conta do servidor
    function sorteio(n){ return Math.floor(Math.random() * n); }
    function inteiro(v){ return typeof v === 'number' && isFinite(v) && Math.floor(v) === v; }
    // Igual a private.bonus_jogo_dia_dar: ★10 na 1ª partida verificada do dia com 600+ pontos (Café e Handshake).
    function bonusDoDia(jogo, pontos){
      if(pontos < 600 || D.bonusDia[jogo] === D.dia) return 0;
      D.bonusDia[jogo] = D.dia; mudaSaldo(10); return 10;
    }
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
      /* ---- Happy⭐Cafe! (pr71_recordes_online, 20261113_cafe_vip e 20261113_bonus_jogo_dia) ---- */
      if(n === 'cafe_run_iniciar'){
        if(Object.keys(D.cafeRuns).filter(function(k){ return D.cafeRuns[k].dia === D.dia; }).length >= 20) return { ok:false, erro:'limite' };
        r = novoId(); D.cafeRuns[r] = { dia:D.dia, rodadas:0, vidas:3, pontos:0, combo:0, comboMax:0, perfeitos:0, fim:false, ultimo:null };
        return { ok:true, run_id:r };
      }
      if(n === 'cafe_run_pedido'){
        var run = D.cafeRuns[a.p_run];
        if(!run) return { ok:false, erro:'run' };
        if(run.fim || run.rodadas >= 12 || run.vidas <= 0) return { ok:false, erro:'run_fechado' };
        var aberta = run.ultimo && D.cafeSessoes[run.ultimo];
        if(aberta && !aberta.concluido) return { ok:true, sessao:run.ultimo, pedido:aberta.pedido, rodada:aberta.etapa, limite_segundos:aberta.limite };
        var sem = semanaJogo(), baseSem = [3,2,1,4,0][sem], doceSem = [0,1,2,3,0][sem];
        var ped = { base:sorteio(5), cob:run.rodadas >= 2 || Math.random() < .4 ? sorteio(3) : -1, enf:sorteio(4),
          doce:run.rodadas >= 4 && Math.random() < .6 ? sorteio(4) : -1 };
        if(Math.random() < .5){ ped.base = baseSem; if(ped.doce >= 0) ped.doce = doceSem; }
        var sid = novoId();
        D.cafeSessoes[sid] = { run:a.p_run, pedido:ped, etapa:run.rodadas + 1, limite:Math.max(7, 15 - Math.ceil(run.rodadas * .75)), criado:Date.now(), concluido:false };
        run.ultimo = sid;
        return { ok:true, sessao:sid, pedido:ped, rodada:run.rodadas + 1, limite_segundos:D.cafeSessoes[sid].limite };
      }
      if(n === 'cafe_run_etapa'){
        var se = D.cafeSessoes[a.p_sessao], ru = se && D.cafeRuns[se.run], m = a.p_monta;
        if(!se || !ru) return { ok:false, erro:'sessao' };
        if(se.concluido) return { ok:true, confirmado:true, repetido:true, certo:se.certo, pontos_etapa:se.pontos, pontos:ru.pontos, rodadas:ru.rodadas, vidas:ru.vidas, combo:ru.combo };
        var seg = (Date.now() - se.criado) / 1000;
        if(ru.fim || ru.vidas <= 0 || seg < .5 || !m || typeof m !== 'object' || typeof a.p_saiu !== 'boolean') return { ok:false, erro:'sessao' };
        if(!inteiro(m.base) || !inteiro(m.cob) || !inteiro(m.enf) || !inteiro(m.doce) || m.base < -1 || m.base > 4 || m.cob < -1 || m.cob > 2 ||
          m.enf < -1 || m.enf > 3 || m.doce < -1 || m.doce > 3) return { ok:false, erro:'monta' };
        var resto = Math.max(0, Math.min(1, 1 - seg / se.limite)), pd = se.pedido;
        var certoC = !a.p_saiu && seg <= se.limite + 1.5 && m.base === pd.base && m.cob === pd.cob && m.enf === pd.enf && m.doce === pd.doce;
        var comboC = certoC ? ru.combo + 1 : 0, pts = 0;
        if(certoC){
          pts = Math.round((100 + Math.round(resto * 100) + (pd.cob >= 0 ? 30 : 0) + (pd.doce >= 0 ? 40 : 0)) * (1 + Math.min(comboC - 1, 5) * .1)) +
            (pd.base === [3,2,1,4,0][semanaJogo()] ? 50 : 0);
          if(se.etapa === 6 || se.etapa === 11) pts *= 2;   // cliente VIP paga em dobro
          D.cafeReceitas[pd.base + '-' + pd.enf] = 1;
        }
        se.concluido = true; se.certo = certoC; se.pontos = pts;
        ru.rodadas++; if(!certoC) ru.vidas--; ru.pontos += pts; ru.combo = comboC; ru.comboMax = Math.max(ru.comboMax, comboC); if(certoC) ru.perfeitos++;
        return { ok:true, confirmado:true, repetido:false, certo:certoC, pontos_etapa:pts, pontos:ru.pontos, rodadas:ru.rodadas, vidas:ru.vidas, combo:comboC, perfeitos:ru.perfeitos };
      }
      if(n === 'cafe_run_finalizar'){
        var rf = D.cafeRuns[a.p_run];
        if(!rf) return { ok:false, erro:'run' };
        var jaFim = rf.fim;
        if(!rf.fim){
          if(rf.vidas > 0 && rf.rodadas < 12) return { ok:false, erro:'incompleto' };
          if(rf.ultimo && D.cafeSessoes[rf.ultimo] && !D.cafeSessoes[rf.ultimo].concluido) return { ok:false, erro:'pedido_pendente' };
          rf.fim = true; bonusDoDia('cafe', rf.pontos);
        }
        return { ok:true, confirmado:true, repetido:jaFim, run_id:a.p_run, pontos_verificados:rf.pontos, rodadas:rf.rodadas, perfeitos:rf.perfeitos, combo_max:rf.comboMax };
      }
      if(n === 'cafe_caderno') return Object.keys(D.cafeReceitas).sort();
      /* ---- Handshake⭐Event! (20261103200000_handshake_premio, 20261113_handshake_hora_extra e _handshake_cor) ---- */
      if(n === 'handshake_estado') return D.hsPremio && D.hsPremio.dia === D.dia
        ? { ok:true, entregue:true, dia:D.hsPremio.dia, tipo:D.hsPremio.tipo, item:D.hsPremio.item, pontos:D.hsPremio.pontos } : { ok:true, entregue:false };
      if(n === 'handshake_iniciar'){
        if(Object.keys(D.hsSessoes).filter(function(k){ return D.hsSessoes[k].dia === D.dia; }).length >= 30) return { ok:false, erro:'limite' };
        var todos = [], cores = [];
        for(var rd = 1; rd <= 8; rd++){
          var qt = Math.min(3 + Math.floor((rd - 1) * .8), 6), fila = [], cf2 = [];
          for(i = 0; i < qt; i++){
            var pres = sorteio(14); while(fila.indexOf(pres) >= 0) pres = (pres + 1) % 14;
            fila.push(pres); if(rd >= 3) cf2.push(sorteio(6));   // cor do lightstick da 3ª rodada em diante
          }
          todos.push(fila); cores.push(cf2);
        }
        r = novoId(); D.hsSessoes[r] = { dia:D.dia, desafios:todos, cores:cores, criado:Date.now(), fim:null };
        return { ok:true, sessao:r, desafios:todos, cores:cores };
      }
      if(n === 'handshake_run_finish' || n === 'handshake_premio'){
        var hsS = D.hsSessoes[a.p_sessao], R = a.p_respostas;
        if(!hsS) return { ok:false, erro:'sessao' };
        if(hsS.fim){ r = Object.assign({}, hsS.fim, { repetido:true, premio_novo:false }); return r; }
        if(Date.now() - hsS.criado < 9000 || !Array.isArray(R)) return { ok:false, erro:'sessao' };
        if(R.length < 1 || R.length > 60) return { ok:false, erro:'respostas' };
        var presSem = [0,1,8,12,3][semanaJogo()], vistos = {}, ult = 0, cb = 0, cbMax = 0, pt = 0, ace = 0;
        for(i = 0; i < R.length; i++){
          var q = R[i];
          if(!q || typeof q !== 'object' || !inteiro(q.rodada) || !inteiro(q.origem) || !inteiro(q.indice) || !inteiro(q.resposta) || !inteiro(q.restante) ||
            typeof q.superfa !== 'boolean') return { ok:false, erro:'respostas' };
          if(q.rodada < 1 || q.rodada > 8 || q.rodada < ult || q.origem < 1 || q.origem > q.rodada || q.indice < 0 || q.resposta < -1 || q.resposta > 13 ||
            q.restante < 0 || q.restante > 1000 || q.superfa !== (q.origem < q.rodada) || q.indice >= hsS.desafios[q.origem - 1].length) return { ok:false, erro:'respostas' };
          var ch = q.rodada + ':' + q.origem + ':' + q.indice;
          if(vistos[ch]) return { ok:false, erro:'duplicado' };
          vistos[ch] = 1; ult = q.rodada;
          var verd = hsS.desafios[q.origem - 1][q.indice];
          if(q.resposta === verd){
            ace++; cb++; cbMax = Math.max(cbMax, cb);
            var bs = 100 + Math.floor(q.restante * .08 + .5) + q.rodada * 10 + (q.superfa ? 150 : 0);
            pt += Math.floor(bs * (1 + Math.min(cb - 1, 10) * .1) + .5);
            if(verd === presSem) pt += 50;
            var vcor = hsS.cores[q.origem - 1][q.indice];
            if(typeof vcor === 'number' && inteiro(q.cor) && q.cor === vcor) pt += 50;   // lightstick certo
          }else cb = 0;
        }
        bonusDoDia('hand', pt);
        var basico = { ok:true, confirmado:true, repetido:false, pontos_verificados:pt, acertos:ace, combo_max:cbMax, premio_novo:false };
        if(pt < 600){ basico.missao = ace > 0; hsS.fim = basico; return basico; }
        if(D.hsPremio && D.hsPremio.dia === D.dia){ basico.premio_entregue = true; hsS.fim = basico; return basico; }
        // No servidor o prêmio é ticket (40%) ou mimo do pet (60%). Aqui é sempre ticket, para não gravar nada no save do pet deste aparelho.
        D.tickets++; D.hsPremio = { dia:D.dia, tipo:'ticket', item:'', pontos:pt };
        hsS.fim = Object.assign({}, basico, { dia:D.dia, pontos:pt, tipo:'ticket', item:'' });
        return Object.assign({}, hsS.fim, { premio_novo:true, tickets:D.tickets });
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
      /* ---- Pó de estrela do Gacha (20261113_gacha_po_garantia.sql) ---- */
      if(n === 'gacha_po_status' || n === 'gacha_converter_repetido' || n === 'gacha_resgatar_card'){
        album();
        if(n === 'gacha_po_status') return { ok:true, po:D.po, custo_troca:5,
          repetidos:Object.keys(D.album).filter(function(k){ return D.album[k] >= 2; }).sort().map(function(k){ return { nick:k, vezes:D.album[k] }; }),
          faltando:idols().map(function(x){ return x.nick; }).filter(function(k){ return !(D.album[k] > 0); }).sort().slice(0, 80).map(function(k){ return { nick:k }; }) };
        if(!a.p_nick || !a.p_requisicao) return { ok:false, erro:'parametros' };
        var feito = D.gpoReq[a.p_requisicao];
        if(feito) return feito.rpc !== n || feito.nick !== a.p_nick ? { ok:false, erro:'requisicao_reutilizada' } : feito.r;
        var k = a.p_nick, res;
        if(n === 'gacha_converter_repetido'){
          if(!(D.album[k] >= 2)) return { ok:false, erro:'sem_repetido' };
          D.album[k]--; D.po++; res = { ok:true, po:D.po, convertido:k.toLowerCase() };
        } else {
          if(!idols().some(function(x){ return x.nick === k; })) return { ok:false, erro:'card_indisponivel' };
          if(D.album[k] > 0) return { ok:false, erro:'ja_possui' };
          if(D.po < 5) return { ok:false, erro:'po_insuficiente' };
          D.po -= 5; D.album[k] = 1; res = { ok:true, po:D.po, card:{ nick:k } };
        }
        D.gpoReq[a.p_requisicao] = { rpc:n, nick:k, r:{ ok:true, repetido:true, po:D.po, card:res.card, convertido:res.convertido } };
        return res;
      }
      if(n === 'album_cards'){
        album();
        return idols().filter(function(p){ return D.album[p.nick] > 0; }).map(function(p){ return { card:{ nick:p.nick, avatar:p.avatar, best:p.best }, tipo:'card', vezes:D.album[p.nick] }; });
      }
      /* ---- Moon⭐Duo!: registro e prêmio do Pedido de cena (20261113_duo_pedido_premio.sql) ---- */
      if(n === 'duo_sugestoes') return idols().slice(0, 6).map(function(p){ return { nick:p.nick, best:p.best || 0 }; });
      if(n === 'duo_avisos_pendentes') return [];
      if(n === 'duo_convidado'){
        var g = idols().filter(function(p){ return baixo(p.nick) === baixo(a && a.p_nick); })[0];
        if(baixo(a && a.p_nick) === 'demo') return { erro:'eu' };
        return g ? { nick:g.nick, avatar:g.avatar, best:g.best || 0, oshi:null, pet:null } : { erro:'sem_perfil' };
      }
      if(n === 'duo_registrar'){
        if(a && a.p_cena) D.duoLog.push({ dia:D.dia, cena:String(a.p_cena) });
        return { ok:true, contou:true };
      }
      if(n === 'duo_pedido_premio'){
        if(!/^[a-z0-9]{1,16}$/.test(String(a && a.p_cena || ''))) return { ok:false, erro:'cena' };
        if(!D.duoLog.some(function(x){ return x.dia === D.dia && x.cena === a.p_cena; })) return { ok:false, erro:'sem_duo' };
        if(D.bonusDia['duo:' + D.dia]) return { ok:true, estrelas:0, ja:true };
        D.bonusDia['duo:' + D.dia] = true;
        return { ok:true, estrelas:5, stars:mudaSaldo(5) };
      }
      return undefined;
    }
    window.TW_DEMO_ESTADO = D;   // para conferir pelo console

    var faixa = document.createElement('div');
    faixa.textContent = innerWidth < 380 ? '🧪 Demo · nada é salvo' : '🧪 Modo demonstração · nada é salvo';
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
      faixa.firstChild.nodeValue = (innerWidth < 380 ? '🧪 Dia ' : '🧪 Demonstração · dia ') + D.dia.slice(8) + '/' + D.dia.slice(5, 7) + ' · reabra o jogo';
    };
    faixa.appendChild(maisDia);
    document.body.appendChild(faixa);
    window.contaRpc = function(n, a){
      var novo;
      try{ novo = demoNovos(n, a); }catch(e){ return Promise.reject(e); }
      if(novo !== undefined) return Promise.resolve(novo);
      if(n === 'pedido_fa_hoje') return Promise.resolve({ ok:true, tipo:'corridas3', meta:3, progresso:ent ? 3 : 3, feito:true, resgatado:ent, cartas:cartas });
      if(n === 'entregar_pedido_fa'){ ent = true; cartas++; return Promise.resolve({ ok:true, cartas:cartas }); }
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
