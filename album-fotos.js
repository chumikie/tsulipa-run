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
  var PAGINA = {
    pt:['Montar página','Título da página','Data','Baixar página em PNG','{n} de 3 fotos selecionadas','Selecionar foto','Não foi possível montar a página.','Minha série de fotos'],
    en:['Make a page','Page title','Date','Download PNG page','{n} of 3 photos selected','Select photo','Could not create the page.','My photo series'],
    es:['Crear página','Título de la página','Fecha','Descargar página en PNG','{n} de 3 fotos seleccionadas','Seleccionar foto','No se pudo crear la página.','Mi serie de fotos'],
    id:['Buat halaman','Judul halaman','Tanggal','Unduh halaman PNG','{n} dari 3 foto dipilih','Pilih foto','Halaman tidak dapat dibuat.','Seri fotoku'],
    th:['จัดหน้าภาพ','ชื่อหน้า','วันที่','ดาวน์โหลดหน้า PNG','เลือกแล้ว {n} จาก 3 รูป','เลือกรูป','สร้างหน้าไม่ได้','ชุดภาพของฉัน'],
    ja:['ページを作成','ページのタイトル','日付','PNGで保存','3枚中{n}枚を選択','写真を選ぶ','ページを作成できませんでした。','私の写真シリーズ']
  };
  var dbPendente, LIMITE = 24, urls = new Map();
  var COPIA_TR={
    pt:['Baixar cópia da série','Restaurar cópia','Fotos adicionadas: {n}.','A série tem espaço para apenas {n} fotos novas.','Cópia inválida ou indisponível.','Lendo cópia…','Sua composição favorita atual foi mantida.','A composição favorita não pôde ser salva.'],
    en:['Download a series backup','Restore backup','Photos added: {n}.','This series has room for only {n} new photos.','Invalid or unavailable backup.','Reading backup…','Your current favorite composition was kept.','Could not save the favorite composition.'],
    es:['Descargar copia de la serie','Restaurar copia','Fotos añadidas: {n}.','En esta serie solo caben {n} fotos nuevas.','Copia inválida o no disponible.','Leyendo copia…','Se mantuvo tu composición favorita actual.','No se pudo guardar la composición favorita.'],
    id:['Unduh cadangan seri','Pulihkan cadangan','Foto ditambahkan: {n}.','Seri ini hanya muat {n} foto baru.','Cadangan tidak valid atau tidak tersedia.','Membaca cadangan…','Komposisi favorit saat ini dipertahankan.','Komposisi favorit gagal disimpan.'],
    th:['ดาวน์โหลดสำรองชุดภาพ','กู้คืนข้อมูลสำรอง','เพิ่มภาพแล้ว {n} ภาพ','ชุดภาพนี้เพิ่มได้อีก {n} ภาพเท่านั้น','ข้อมูลสำรองใช้ไม่ได้หรือไม่พร้อม','กำลังอ่านข้อมูลสำรอง…','เก็บองค์ประกอบโปรดเดิมไว้แล้ว','บันทึกองค์ประกอบโปรดไม่ได้'],
    ja:['シリーズのバックアップを保存','バックアップを復元','写真を{n}枚追加しました。','追加できる写真はあと{n}枚です。','バックアップが無効か利用できません。','バックアップを読み込み中…','現在のお気に入り構図を保持しました。','お気に入り構図を保存できませんでした。']
  };
  var TIPOS=['studio','duo','vip','pet'], MAX_COPIA=24*1024*1024, MAX_JPEG_B64=1400000;
  function copiaT(i,n){return (COPIA_TR[typeof LANG==='string'&&LANG]||COPIA_TR.pt)[i].replace('{n}',n);}
  function composicao(dados){
    var campos={fundo:['rosa','cortina','nuvens','neon'],pose:['normal','v','coracao','tchau'],
      luz:['suave','neon','por'],quadro:['rosto','meio','inteiro']};
    if(!dados || !Object.keys(campos).every(function(k){return campos[k].indexOf(dados[k])>=0;}))return undefined;
    var c={fundo:dados.fundo,pose:dados.pose,luz:dados.luz,quadro:dados.quadro}, item=dados.objeto;
    if(typeof item==='string' && (/^(nenhum|balao|microfone|lightstick|flor_(sakura|tulipa|girassol|lunar))$/.test(item) ||
        /^arranjo_(sakura|tulipa|girassol|lunar)(\+(sakura|tulipa|girassol|lunar)){1,2}$/.test(item)))c.objeto=item;
    return c;
  }
  function favoritaChave(){
    var id=contaJ && ((typeof contaAuthUserId==='string' && contaAuthUserId)||contaJ.id||contaJ.nick);
    return id?'tw_studio_composicao_v1:conta:'+encodeURIComponent(id):'';
  }
  function favoritaLer(chave){
    try{return chave?composicao(JSON.parse(localStorage.getItem(chave))):undefined;}catch(e){return undefined;}
  }
  function blobUrlDados(blob){
    return new Promise(function(ok,falha){
      var r=new FileReader();r.onload=function(){ok(r.result);};r.onerror=falha;r.readAsDataURL(blob);
    });
  }
  function fotoCopia(f,dados){
    return {tipo:f.tipo,quando:f.quando,imagem:dados,composicao:f.tipo==='studio'?composicao(f.composicao):undefined};
  }
  async function baixarCopia(conta,chave,ativo){
    var fotos=await lista(conta);
    var codificadas=await Promise.all(fotos.map(async function(f){return fotoCopia(f,await blobUrlDados(f.blob));}));
    if(!ativo())return;
    var arquivo=new Blob([JSON.stringify({formato:'tsulipa-album',versao:1,fotos:codificadas,favorita:favoritaLer(chave)})],{type:'application/json'});
    if(arquivo.size>MAX_COPIA)throw Error('tamanho');
    var url=URL.createObjectURL(arquivo), a=document.createElement('a');a.href=url;a.download='tsulipa-serie-fotos.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);
  }
  // Valida o tamanho no cabeçalho antes de enviar os dados ao decodificador JPEG.
  function jpegPequeno(bytes){
    if(bytes.length<5 || bytes[0]!==255 || bytes[1]!==216)return false;
    for(var i=2;i<bytes.length;){
      if(bytes[i++]!==255)return false;
      while(bytes[i]===255)i++;
      var m=bytes[i++], n=(bytes[i]<<8)|bytes[i+1];
      if(n<2 || i+n>bytes.length || m===218)return false;
      if((m>=192&&m<=195)||(m>=197&&m<=199)||(m>=201&&m<=203)||(m>=205&&m<=207)){
        if(n<8)return false;
        var h=(bytes[i+3]<<8)|bytes[i+4],w=(bytes[i+5]<<8)|bytes[i+6];
        return h>0&&w>0&&h<=800&&w<=800;
      }
      i+=n;
    }
    return false;
  }
  async function lerCopia(file){
    if(!file || file.size>MAX_COPIA)throw Error('copia');
    var d=JSON.parse(await file.text());
    if(!d || d.formato!=='tsulipa-album'||d.versao!==1||!Array.isArray(d.fotos)||d.fotos.length>LIMITE)throw Error('copia');
    for(var i=0;i<d.fotos.length;i++){
      var f=d.fotos[i];
      if(!f || TIPOS.indexOf(f.tipo)<0 || !Number.isSafeInteger(f.quando) || f.quando<=0 || f.quando>864e13 ||
        typeof f.imagem!=='string'||f.imagem.length>MAX_JPEG_B64||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(f.imagem))throw Error('foto');
      var bytes=Uint8Array.from(atob(f.imagem.slice(23)),function(c){return c.charCodeAt(0);});
      if(!jpegPequeno(bytes))throw Error('jpeg');
      f.blob=new Blob([bytes],{type:'image/jpeg'});
      if(typeof createImageBitmap==='function'){
        var bmp=await createImageBitmap(f.blob);bmp.close();
      }
      f.composicao=f.tipo==='studio'?composicao(f.composicao):undefined;
    }
    return d;
  }
  function assinaturaFoto(f,imagem){return f.tipo+'|'+f.quando+'|'+imagem;}
  async function restaurarCopia(file,conta,chave,ativo){
    var copia=await lerCopia(file), atuais=await lista(conta);
    var assinaturas=new Set(await Promise.all(atuais.map(async function(f){return assinaturaFoto(f,await blobUrlDados(f.blob));})));
    var novas=copia.fotos.filter(function(f){
      var k=assinaturaFoto(f,f.imagem);
      if(assinaturas.has(k))return false;
      assinaturas.add(k);return true;
    });
    if(novas.length>LIMITE-atuais.length)return {texto:copiaT(3,LIMITE-atuais.length),atualizar:false};
    if(!ativo())return null;
    await transacao('readwrite',function(s,_,tx){
      var q=s.index('dono').getAllKeys(conta);
      q.onsuccess=function(){
        if(!ativo() || q.result.length!==atuais.length || atuais.some(function(f,i){return f.id!==q.result[atuais.length-1-i];})){
          tx.abort();return;
        }
        novas.slice().sort(function(a,b){return a.quando-b.quando;}).forEach(function(f){s.add({dono:conta,tipo:f.tipo,quando:f.quando,blob:f.blob,composicao:f.composicao});});
      };
    });
    var texto=copiaT(2,novas.length), fav=composicao(copia.favorita);
    if(ativo() && fav && chave){
      if(favoritaLer(chave))texto+=' '+copiaT(6);
      else try{localStorage.setItem(chave,JSON.stringify(fav));}catch(e){texto+=' '+copiaT(7);}
    }
    return {texto:texto,atualizar:true};
  }
  function acoesCopia(box,conta,ativo,mensagem){
    var chave=favoritaChave(), area=document.createElement('div'), arquivo=document.createElement('input');
    var salvar=document.createElement('button'), restaurar=document.createElement('button'), status=document.createElement('p');
    area.className='btns';arquivo.type='file';arquivo.accept='.json,application/json';arquivo.hidden=true;
    salvar.type=restaurar.type='button';salvar.textContent=copiaT(0);restaurar.textContent=copiaT(1);
    status.setAttribute('role','status');status.textContent=mensagem||'';
    area.append(salvar,restaurar,arquivo);
    function ocupado(valor){salvar.disabled=restaurar.disabled=valor;}
    salvar.onclick=async function(){
      if(!ativo())return;
      ocupado(true);
      try{await baixarCopia(conta,chave,ativo);}catch(e){if(ativo())status.textContent=copiaT(4);}
      finally{if(ativo())ocupado(false);}
    };
    restaurar.onclick=function(){if(ativo())arquivo.click();};
    arquivo.onchange=async function(){
      var file=arquivo.files[0];arquivo.value='';
      if(!file||!ativo())return;
      ocupado(true);status.textContent=copiaT(5);
      try{
        var r=await restaurarCopia(file,conta,chave,ativo);
        if(!ativo()||!r)return;
        if(r.atualizar)mostrar(box,r.texto);else status.textContent=r.texto;
      }catch(e){if(ativo())status.textContent=copiaT(4);}
      finally{if(ativo())ocupado(false);}
    };
    box.append(area,status);
  }

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
      fn(tx.objectStore('fotos'), function(valor){ resultado = valor; },tx);
    }); });
  }
  function imagem(cv){
    var max = 800, escala = Math.min(1,max/Math.max(cv.width,cv.height)), copia = document.createElement('canvas');
    copia.width = Math.max(1,Math.round(cv.width*escala)); copia.height = Math.max(1,Math.round(cv.height*escala));
    var x = copia.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0,0,copia.width,copia.height);
    x.drawImage(cv,0,0,copia.width,copia.height);
    return new Promise(function(ok, falha){ copia.toBlob(function(blob){ if(blob)ok(blob);else falha(Error('foto')); },'image/jpeg',.87); });
  }
  async function salvar(tipo, canvas, botao, composicaoDaFoto){
    var validarComposicao=composicao(composicaoDaFoto);
    var conta = dono();
    if(!conta || !canvas || TIPOS.indexOf(tipo) < 0) return false;
    botao.disabled = true;
    try{
      var blob = await imagem(canvas);
      if(dono() !== conta) return false;
      await transacao('readwrite', function(s){
        var q = s.index('dono').getAll(conta);
        q.onsuccess = function(){
          var antigas=q.result.sort(function(a,b){return a.quando-b.quando||a.id-b.id;});
          antigas.slice(0,Math.max(0,antigas.length-LIMITE+1)).forEach(function(f){s.delete(f.id);});
          s.add({dono:conta,tipo:tipo,quando:Date.now(),blob:blob,composicao:tipo==='studio' ? validarComposicao : undefined});
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
  function imagemDaPagina(url){
    var img = new Image();
    img.src = url;
    return img.decode().then(function(){ return img; });
  }
  async function paginaPng(fotos, titulo, data, ativo){
    var imgs = await Promise.all(fotos.map(function(f){ return imagemDaPagina(f.url); }));
    if(!ativo()) return;
    var cv = document.createElement('canvas'); cv.width = 1440; cv.height = 980;
    var x = cv.getContext('2d');
    x.fillStyle = '#f5ecff'; x.fillRect(0,0,1440,980);
    x.fillStyle = '#fffaf9'; x.fillRect(34,34,1372,912);
    x.textAlign = 'center';
    x.font = 'bold 57px system-ui,sans-serif'; x.fillStyle = '#392364';
    x.fillText(titulo,720,142,1200);
    x.font = '26px system-ui,sans-serif'; x.fillStyle = '#635174'; x.fillText(data,720,200);
    imgs.forEach(function(img,i){
      var centro = 276 + i*444, y = 270, w = 402, h = 525;
      x.fillStyle = '#e9d9f9'; x.fillRect(centro-w/2+6,y+8,w,h+66);
      x.fillStyle = '#fff'; x.fillRect(centro-w/2,y,w,h+66);
      var escala = Math.min((w-24)/img.naturalWidth,(h-24)/img.naturalHeight);
      var iw = img.naturalWidth*escala, ih = img.naturalHeight*escala;
      x.drawImage(img,centro-iw/2,y+(h-ih)/2,iw,ih);
      x.font = 'bold 26px system-ui,sans-serif'; x.fillStyle = '#392364';
      x.fillText(fotos[i].nome,centro,y+h+35,w-20);
    });
    var png = await new Promise(function(ok, erro){ cv.toBlob(function(blob){ if(blob)ok(blob); else erro(Error('PNG')); },'image/png'); });
    if(!ativo()) return;
    var url = URL.createObjectURL(png), link = document.createElement('a');
    link.href = url; link.download = 'tsulipa-pagina-de-fotos.png';
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); },30000);
  }
  function montarPagina(box, ativo){
    var pt = PAGINA[typeof LANG === 'undefined' ? 'pt' : LANG] || PAGINA.pt;
    var editor = document.createElement('div'); editor.className = 'album-fotos-pagina';
    editor.innerHTML = '<fieldset><legend>' + escHtml(pt[0]) + '</legend><label>' + escHtml(pt[1]) +
      '<input data-album-pagina="titulo" maxlength="48"></label><label>' + escHtml(pt[2]) +
      '<input data-album-pagina="data" type="date"></label><p role="status"></p><button class="btn alt" type="button">' +
      escHtml(pt[3]) + '</button></fieldset>';
    var titulo = editor.querySelector('[data-album-pagina="titulo"]'), dia = editor.querySelector('[data-album-pagina="data"]');
    var status = editor.querySelector('[role="status"]'), baixar = editor.querySelector('button');
    titulo.value = pt[7]; dia.value = new Date(Date.now()-3*36e5).toISOString().slice(0,10);
    var escolhidas = [], escolhas = [], exportando = false;
    function atualizar(){
      status.textContent = pt[4].replace('{n}',escolhidas.length);
      baixar.disabled = escolhidas.length !== 3 || !dia.value || exportando;
      escolhas.forEach(function(f){
        var marcado = escolhidas.indexOf(f);
        f.botao.textContent = (marcado >= 0 ? (marcado+1)+' · ' : '') + pt[5];
        f.botao.setAttribute('aria-label',f.botao.textContent+' · '+f.rotulo);
        f.botao.setAttribute('aria-pressed',String(marcado >= 0));
        f.botao.setAttribute('aria-disabled',String(exportando || (escolhidas.length === 3 && marcado < 0)));
      });
    }
    dia.addEventListener('input',atualizar);
    baixar.addEventListener('click',async function(){
      if(!ativo() || baixar.disabled) return;
      var data = new Date(dia.value+'T12:00:00Z');
      exportando = true; atualizar();
      try{
        var rotulo = new Intl.DateTimeFormat(typeof LANG === 'string' && LANG === 'pt' ? 'pt-BR' : typeof LANG === 'string' ? LANG : 'pt-BR',
          {day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(data);
        await paginaPng(escolhidas.slice(),titulo.value.trim() || pt[7],rotulo,ativo);
        if(ativo()){ exportando = false; atualizar(); baixar.focus(); }
      }catch(e){ if(ativo()){ exportando = false; atualizar(); status.textContent = pt[6]; } }
    });
    box.appendChild(editor);
    atualizar();
    return function(foto){
      var botao = document.createElement('button'); botao.type = 'button'; botao.className = 'album-fotos-escolher';
      foto.botao = botao; escolhas.push(foto);
      botao.addEventListener('click',function(){
        if(!ativo() || botao.getAttribute('aria-disabled') === 'true') return;
        var idx = escolhidas.indexOf(foto);
        if(idx >= 0) escolhidas.splice(idx,1); else escolhidas.push(foto);
        atualizar();
      });
      atualizar();
      return botao;
    };
  }
  async function mostrar(box,mensagem){
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
      acoesCopia(box,conta,ativo,mensagem);
      if(!fotos.length){ box.append(t(5)); return; }
      var grade = document.createElement('div'); grade.className = 'album-fotos-grade';
      var selecionar = fotos.length >= 3 ? montarPagina(box,ativo) : null;
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
      fotos.sort(function(a,b){return b.quando-a.quando||b.id-a.id;}).forEach(function(f){
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
        cartao.appendChild(escolher);
        if(selecionar)cartao.appendChild(selecionar({url:url,nome:nome,rotulo:cap.textContent}));
grade.appendChild(cartao);
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
