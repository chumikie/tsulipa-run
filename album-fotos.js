/* A série fotográfica é privada e fica no IndexedDB deste navegador. */
(function(){
  'use strict';
  var TX = {
    pt:['Série de fotos','Guardar na série','Guardada na série.','Não foi possível guardar a foto.','Fotos do Studio, Duo e Camarim guardadas neste navegador. Até 24 fotos por conta.','Sua série ainda está vazia.','Baixar foto','Remover foto','Não foi possível abrir as fotos.','Carregando…','Camarim VIP'],
    en:['Photo series','Save to series','Saved to your series.','Could not save the photo.','Studio, Duo and Dressing Room photos in this browser. Up to 24 per account.','Your series is empty.','Download photo','Remove photo','Could not open your photos.','Loading…','VIP Dressing Room'],
    es:['Serie de fotos','Guardar en la serie','Guardada en la serie.','No se pudo guardar la foto.','Fotos de Studio, Duo y Camerino en este navegador. Hasta 24 por cuenta.','Tu serie está vacía.','Descargar foto','Quitar foto','No se pudieron abrir las fotos.','Cargando…','Camerino VIP'],
    id:['Seri foto','Simpan ke seri','Tersimpan di seri.','Foto gagal disimpan.','Foto Studio, Duo, dan ruang rias di peramban ini. Maksimal 24 per akun.','Seri fotomu masih kosong.','Unduh foto','Hapus foto','Foto gagal dibuka.','Memuat…','Ruang Rias VIP'],
    th:['ชุดภาพถ่าย','บันทึกลงในชุดภาพ','บันทึกภาพแล้ว','บันทึกภาพไม่ได้','เก็บภาพจาก Studio, Duo และห้องแต่งตัวในเบราว์เซอร์นี้ สูงสุด 24 ภาพต่อบัญชี','ยังไม่มีภาพ','ดาวน์โหลดภาพ','ลบภาพ','เปิดภาพไม่ได้','กำลังโหลด…','ห้องแต่งตัว VIP'],
    ja:['写真シリーズ','シリーズに保存','シリーズに保存しました。','写真を保存できませんでした。','Studio、Duo、楽屋の写真をこのブラウザーに保存します。1アカウント24枚まで。','まだ写真がありません。','写真をダウンロード','写真を削除','写真を開けませんでした。','読み込み中…','VIP楽屋']
  };
  var LEMBRANCA = {
    pt:['Usar como referência','Antes e depois','Selecionar para comparação','Antes','Depois','Baixar antes e depois','Escolha duas fotos na ordem.'],
    en:['Use as reference','Before and after','Select for comparison','Before','After','Download before and after','Choose two photos in order.'],
    es:['Usar como referencia','Antes y después','Seleccionar para comparar','Antes','Después','Descargar antes y después','Elige dos fotos en orden.'],
    id:['Gunakan sebagai referensi','Sebelum dan sesudah','Pilih untuk perbandingan','Sebelum','Sesudah','Unduh sebelum dan sesudah','Pilih dua foto berurutan.'],
    th:['ใช้เป็นภาพอ้างอิง','ก่อนและหลัง','เลือกเพื่อเปรียบเทียบ','ก่อน','หลัง','ดาวน์โหลดก่อนและหลัง','เลือกภาพสองภาพตามลำดับ'],
    ja:['参考写真にする','ビフォー・アフター','比較に選ぶ','ビフォー','アフター','比較画像をダウンロード','順番に写真を2枚選択。']
  };
  function lembrancaT(){ return LEMBRANCA[typeof LANG === 'string' && LANG] || LEMBRANCA.pt; }
  var dbPendente, LIMITE = 24, urls = new Map();
  function t(i){ return (TX[typeof LANG === 'undefined' ? 'pt' : LANG] || TX.pt)[i]; }
  function dono(){
    if(typeof contaJ === 'undefined' || !contaJ) return '';
    if(typeof contaAuthUserId === 'string' && contaAuthUserId) return 'auth:' + contaAuthUserId;
    if(contaJ.id) return 'id:' + contaJ.id;
    return contaJ.nick ? 'nick:' + String(contaJ.nick).toLowerCase() : '';
  }
  function banco(){
    if(!dbPendente) dbPendente = new Promise(function(ok, falha){
      var pedido = indexedDB.open('tsulipa-album-fotos', 1);
      pedido.onupgradeneeded = function(){
        pedido.result.createObjectStore('fotos',{keyPath:'id',autoIncrement:true}).createIndex('dono','dono');
      };
      pedido.onsuccess = function(){ ok(pedido.result); };
      pedido.onerror = function(){ falha(pedido.error); };
    }).catch(function(e){ dbPendente = null; throw e; });
    return dbPendente;
  }
  function transacao(modo, fn){
    return banco().then(function(db){ return new Promise(function(ok, falha){
      var tx = db.transaction('fotos', modo), resultado;
      tx.oncomplete = function(){ ok(resultado); };
      tx.onabort = function(){ falha(tx.error); };
      fn(tx.objectStore('fotos'), function(valor){ resultado = valor; });
    }); });
  }
  function imagem(cv){
    var max = 800, escala = Math.min(1,max/Math.max(cv.width,cv.height)), copia = document.createElement('canvas');
    copia.width = Math.max(1,Math.round(cv.width*escala)); copia.height = Math.max(1,Math.round(cv.height*escala));
    var x = copia.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0,0,copia.width,copia.height);
    x.drawImage(cv,0,0,copia.width,copia.height);
    return new Promise(function(ok, falha){ copia.toBlob(function(blob){ if(blob)ok(blob);else falha(Error('foto')); },'image/jpeg',.87); });
  }
  async function salvar(tipo, canvas, botao, composicao){
    var conta = dono();
    if(!conta || !canvas || ['studio','duo','vip','pet'].indexOf(tipo) < 0) return false;
    botao.disabled = true;
    try{
      var blob = await imagem(canvas);
      if(dono() !== conta) return false;
      await transacao('readwrite', function(s){
        var q = s.index('dono').getAllKeys(conta);
        q.onsuccess = function(){
          q.result.slice(0, Math.max(0,q.result.length-LIMITE+1)).forEach(function(id){ s.delete(id); });
          s.add({dono:conta,tipo:tipo,quando:Date.now(),blob:blob,composicao:tipo==='studio' ? composicao : undefined});
        };
      });
      if(dono() !== conta) return false;
      botao.textContent = t(2);
      return true;
    }catch(e){
      botao.disabled = false;
      botao.textContent = t(3);
      return false;
    }
  }
  function liberar(box){
    var lista = urls.get(box);
    if(lista) lista.forEach(function(url){ URL.revokeObjectURL(url); });
    urls.delete(box);
  }
  function conferir(){
    var conta = dono();
    urls.forEach(function(_,box){
      if(!box.isConnected || box.dataset.fotosDono !== conta || box.closest('[hidden]')){
        liberar(box); box.replaceChildren();
        var detalhe = box.closest('details');
        if(detalhe) detalhe.open = false;
      }
    });
  }
  function html(){
    return dono() ? '<details class="album-fotos"><summary>' + escHtml(t(0)) + '</summary><p>' + escHtml(t(4)) +
      '</p><div data-fotos-serie role="status"></div></details>' : '';
  }
  function botao(acao){
    return dono() ? '<button class="btn alt" type="button" ' + acao + '>' + escHtml(t(1)) + '</button>' : '';
  }
  function lista(conta){
    return transacao('readonly', function(s, set){
      var pedido = s.index('dono').getAll(conta);
      pedido.onsuccess = function(){ set(pedido.result.reverse()); };
    });
  }
  function remover(id, conta){
    return transacao('readwrite', function(s){
      var pedido = s.get(id);
      pedido.onsuccess = function(){ if(pedido.result && pedido.result.dono === conta) s.delete(id); };
    });
  }
  async function referencia(id, conta){
    if(!conta || conta !== dono() || !Number.isSafeInteger(id)) return null;
    var foto = await transacao('readonly',function(s,set){
      var pedido = s.get(id);
      pedido.onsuccess = function(){ set(pedido.result); };
    });
    return foto && foto.dono===conta && dono()===conta && foto.tipo==='studio' ? foto : null;
  }
  async function baixarComparacao(escolhidas, ativo){
    var tx = lembrancaT(), locais = escolhidas.map(function(f){return URL.createObjectURL(f.blob);});
    try{
      var imagens = await Promise.all(locais.map(function(url){
        return new Promise(function(ok,erro){var img=new Image();img.onload=function(){ok(img);};img.onerror=erro;img.src=url;});
      }));
      if(!ativo())return;
      var cv=document.createElement('canvas');cv.width=1240;cv.height=900;
      var x=cv.getContext('2d');x.fillStyle='#f8edfa';x.fillRect(0,0,1240,900);
      x.textAlign='center';x.fillStyle='#44245e';x.font='bold 40px system-ui';x.fillText(tx[1],620,59);
      imagens.forEach(function(img,i){
        var cx=320+i*600, escala=Math.min(550/img.naturalWidth,680/img.naturalHeight);
        var w=img.naturalWidth*escala,h=img.naturalHeight*escala;
        x.drawImage(img,cx-w/2,115+(680-h)/2,w,h);
        x.font='bold 27px system-ui';x.fillText(tx[3+i],cx,104);
        x.font='23px system-ui';x.fillText(new Date(escolhidas[i].quando).toLocaleDateString(),cx,841);
      });
      var a=document.createElement('a');a.download='tsulipa-antes-e-depois.png';a.href=cv.toDataURL('image/png');
      document.body.appendChild(a);a.click();a.remove();
    }finally{ locais.forEach(function(url){ URL.revokeObjectURL(url); }); }
  }
  async function mostrar(box){
    var conta = dono(), detalhe = box.closest('details');
    if(!conta || !detalhe.open) return;
    conferir(); liberar(box); box.dataset.fotosDono = conta; box.textContent = t(9);
    var pedido = {};
    box.albumPedido = pedido;
    function ativo(){ return box.isConnected && detalhe.open && dono() === conta && box.albumPedido === pedido; }
    try{
      var fotos = await lista(conta);
      if(!ativo()) return;
      box.replaceChildren();
      if(!fotos.length){ box.textContent = t(5); return; }
      var grade = document.createElement('div'); grade.className = 'album-fotos-grade';
      var objetos = []; urls.set(box,objetos);
      var tx=lembrancaT(), escolhas=[], seletores=[], acoes=document.createElement('div');
      var dica=document.createElement('p');dica.textContent=tx[6];
      var baixar=document.createElement('button');baixar.type='button';baixar.textContent=tx[5];baixar.disabled=true;
      baixar.addEventListener('click',async function(){
        if(!ativo() || escolhas.length!==2)return;
        baixar.disabled=true;
        try{ await baixarComparacao(escolhas.slice(),ativo); }
        catch(e){ dica.textContent=t(8); }
        finally{ if(ativo()) baixar.disabled=escolhas.length!==2; }
      });
      acoes.append(dica, baixar);
      fotos.forEach(function(f){
        var url = URL.createObjectURL(f.blob), cartao = document.createElement('figure'), img = new Image(), cap = document.createElement('figcaption');
        objetos.push(url);
        var nome = {studio:'Photo⭐Studio!',duo:'Moon⭐Duo!',vip:t(10),pet:'Backstage⭐Pet!'}[f.tipo];
        img.src = url; img.alt = nome; img.loading = 'lazy';
        cap.textContent = nome + ' · ' + new Date(f.quando).toLocaleDateString();
        var dl = document.createElement('a'); dl.href = url; dl.download = 'tsulipa-' + f.tipo + '-' + f.id + '.jpg'; dl.textContent = t(6);
        var apagar = document.createElement('button'); apagar.type = 'button'; apagar.textContent = t(7);
        apagar.addEventListener('click',async function(){
          if(!ativo())return;
          apagar.disabled = true;
          try{ await remover(f.id,conta); if(ativo()){ mostrar(box); detalhe.querySelector('summary').focus(); } }
          catch(e){ if(ativo()){ apagar.disabled = false; apagar.textContent = t(8); } }
        });
        cartao.append(img,cap,dl,apagar);
        if(f.tipo==='studio'){
          var abrir=document.createElement('button');abrir.type='button';abrir.textContent=tx[0];
          abrir.addEventListener('click',function(){
            if(ativo() && typeof window.studioAbrir==='function') window.studioAbrir({referencia:f.id,donoAlbum:conta});
          });
          cartao.appendChild(abrir);
        }
        var escolher=document.createElement('button');escolher.type='button';escolher.textContent=tx[2];
        escolher.setAttribute('aria-pressed','false');seletores.push({f:f,b:escolher});
        escolher.addEventListener('click',function(){
          if(!ativo())return;
          var i=escolhas.indexOf(f);
          if(i>=0)escolhas.splice(i,1);
          else if(escolhas.length<2) escolhas.push(f);
          seletores.forEach(function(s){
            var p=escolhas.indexOf(s.f);
            s.b.textContent=p<0?tx[2]:tx[3+p];
            s.b.setAttribute('aria-pressed',String(p>=0));
            s.b.disabled=p<0 && escolhas.length===2;
          });
          baixar.disabled=escolhas.length!==2;
        });
        cartao.appendChild(escolher);grade.appendChild(cartao);
      });
      box.append(acoes,grade);
    }catch(e){ if(ativo()) box.textContent = t(8); }
  }
  document.addEventListener('toggle',function(e){
    var detalhe = e.target;
    if(!detalhe.matches || !detalhe.matches('details.album-fotos')) return;
    var box = detalhe.querySelector('[data-fotos-serie]');
    if(detalhe.open) mostrar(box);
    else{ liberar(box); box.replaceChildren(); }
  },true);
  window.addEventListener('pagehide', function(){
    urls.forEach(function(_, box){
      liberar(box); box.replaceChildren();
      var detalhe = box.closest('details'); if(detalhe) detalhe.open = false;
    });
  });
  window.TW_ALBUM_FOTOS = {html:html, referencia:referencia, botao:botao, textoSalvar:function(){ return dono() ? t(1) : ''; }, salvar:salvar, conferir:conferir};
})();
