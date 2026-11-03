/* TsuLiPa⭐World — MODO DEMONSTRAÇÃO (só em prévia/local, com ?demo=1 no endereço).
   Serve para ver funcionando o que ainda depende de SQL não aplicado no Supabase:
   Pedido de fã, Troca de cards, Festival de Unidades, Ensaio de trio e Álbum.
   Nada é gravado: as respostas são inventadas no próprio navegador. Nunca carrega no site oficial. */
(function(){
  var h = location.hostname;
  if(!/^(localhost|127\.0\.0\.1)$|deploy-preview-\d+--|\.netlify\.app$/.test(h) || !/[?&]demo=1\b/.test(location.search)) return;
  window.TW_DEMO = true;
  window.addEventListener('load', function(){
    var orig = window.contaRpc, ent = false, cartas = 3, trocas = null;
    function idols(){ return (window.hubIdolsDados && hubIdolsDados.idols) || []; }
    function nome(i){ var L = idols(); return L.length ? L[i % L.length].nick : 'Idol ' + i; }
    function av(i){ var L = idols(); return L.length ? L[i % L.length].avatar : { c:{} }; }
    if(!window.contaJ){ window.contaJ = { id:'demo', nick:'Demo', stars:500 }; window.starT = 500; try{ contaUI(); hubCardsUI(); }catch(e){} }
    var faixa = document.createElement('div');
    faixa.textContent = '🧪 Modo demonstração: dados de exemplo, nada é salvo';
    faixa.style.cssText = 'position:fixed;left:50%;bottom:10px;transform:translateX(-50%);z-index:99;background:#7b3ff0;color:#fff;font:800 12px "M PLUS Rounded 1c",sans-serif;padding:6px 14px;border-radius:999px;box-shadow:0 4px 12px rgba(0,0,0,.25)';
    document.body.appendChild(faixa);
    window.contaRpc = function(n, a){
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
