/* TsuLiPa⭐World · service worker (21/11/2026 · PR das melhorias, itens 3 e 5).
   Deixa a volta ao site rápida e o site instalável como app, sem nunca servir código velho:
   - Arquivos com versão no endereço (algo.js?v=12, algo.css?v=4): guardados no aparelho e servidos direto, porque
     uma versão nova sempre tem outro endereço. Ao guardar a versão nova, a antiga do mesmo arquivo sai do cache.
   - Imagens, fontes e sons do próprio site: mostra o guardado na hora e atualiza em segundo plano.
   - Páginas (HTML), Supabase, APIs e qualquer outro domínio: sempre pela rede, como antes. Sem internet, a página
     inicial guardada abre no lugar.
   Para desligar numa emergência: trocar ATIVO para false e publicar — o worker apaga os caches e sai de cena. */
'use strict';
var ATIVO = true;
var VERSAO = 'tw-sw-1';
var CACHE_COD = VERSAO + '-codigo', CACHE_MIDIA = VERSAO + '-midia', CACHE_PAG = VERSAO + '-pagina';
var MIDIA = /\.(png|jpe?g|webp|gif|svg|woff2?|mp3|ogg|m4a|wav)$/i;

self.addEventListener('install', function(){ self.skipWaiting(); });
self.addEventListener('activate', function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return !ATIVO || k.indexOf(VERSAO) !== 0; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){
    if(!ATIVO) return self.registration.unregister();
    return self.clients.claim();
  }));
});

function guardarVersao(req, res){
  if(!res || !res.ok || res.type !== 'basic') return;
  var copia = res.clone(), cam = new URL(req.url).pathname;
  caches.open(CACHE_COD).then(function(c){
    return c.keys().then(function(ks){
      // tira as outras versões do mesmo arquivo
      return Promise.all(ks.filter(function(k){ var u = new URL(k.url); return u.pathname === cam && k.url !== req.url; }).map(function(k){ return c.delete(k); }));
    }).then(function(){ return c.put(req, copia); });
  }).catch(function(){});
}

self.addEventListener('fetch', function(e){
  if(!ATIVO) return;
  var req = e.request;
  if(req.method !== 'GET') return;
  var u = new URL(req.url);
  if(u.origin !== self.location.origin) return;                 // Supabase, Google, CDNs: sem mexer
  if(u.pathname === '/sw.js') return;

  if(req.mode === 'navigate'){                                   // páginas: rede; sem internet, a inicial guardada
    e.respondWith(fetch(req).then(function(res){
      if(res && res.ok && (u.pathname === '/' || u.pathname === '/index.html')){
        var c = res.clone(); caches.open(CACHE_PAG).then(function(k){ return k.put('/', c); }).catch(function(){});
      }
      return res;
    }).catch(function(){ return caches.open(CACHE_PAG).then(function(k){ return k.match('/'); }).then(function(r){ return r || Response.error(); }); }));
    return;
  }
  if(u.searchParams.has('v') && /\.(js|css|json)$/i.test(u.pathname)){   // código com versão: guardado
    e.respondWith(caches.open(CACHE_COD).then(function(c){
      return c.match(req).then(function(hit){
        return hit || fetch(req).then(function(res){ guardarVersao(req, res); return res; });
      });
    }));
    return;
  }
  if(MIDIA.test(u.pathname) && !req.headers.has('range')){       // mídia: guardado agora, atualiza depois
    e.respondWith(caches.open(CACHE_MIDIA).then(function(c){
      return c.match(req).then(function(hit){
        var rede = fetch(req).then(function(res){ if(res && res.ok && res.type === 'basic') c.put(req, res.clone()).catch(function(){}); return res; });
        if(hit){ e.waitUntil(rede.catch(function(){})); return hit; }
        return rede;
      });
    }));
  }
});
