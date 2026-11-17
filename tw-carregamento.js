// Feedback das telas que dependem de uma consulta ou de um arquivo sob demanda.
var TW_CARGA = (function(){
  var textos = {
    pt:['Carregando…','Não foi possível carregar.','Tentar novamente','Fechar','Nenhuma publicação por enquanto.'],
    en:['Loading…','Could not load.','Try again','Close','No posts yet.'],
    es:['Cargando…','No se pudo cargar.','Reintentar','Cerrar','Todavía no hay publicaciones.'],
    id:['Memuat…','Gagal memuat.','Coba lagi','Tutup','Belum ada postingan.'],
    th:['กำลังโหลด…','โหลดไม่สำเร็จ','ลองอีกครั้ง','ปิด','ยังไม่มีโพสต์'],
    ja:['読み込み中…','読み込めませんでした。','もう一度試す','閉じる','まだ投稿はありません。']
  };
  function texto(i){ return (textos[typeof LANG === 'string' ? LANG : 'pt'] || textos.pt)[i]; }
  function erro(box, tentar){
    var aviso = document.createElement('p'), botao = document.createElement('button');
    aviso.setAttribute('role','status');
    aviso.textContent = texto(1);
    botao.type = 'button';
    botao.className = 'btn';
    botao.textContent = texto(2);
    botao.onclick = tentar;
    box.replaceChildren(aviso, botao);
  }
  var pendente;
  function abrir(nome, carregar, pronto){
    if(pendente) pendente.remove();
    var box = document.createElement('div');
    pendente = box;
    box.className = 'tw-carga-aviso';
    box.setAttribute('role','status');
    box.textContent = nome + ' · ' + texto(0);
    document.body.appendChild(box);
    carregar().then(function(){
      if(pendente !== box) return;
      pendente = null;
      box.remove();
      pronto();
    }, function(){
      if(pendente !== box) return;
      erro(box, function(){ abrir(nome, carregar, pronto); });
      box.prepend(nome);
      var fechar = document.createElement('button');
      fechar.className = 'btn alt';
      fechar.textContent = texto(3);
      fechar.onclick = function(){ box.remove(); pendente = null; };
      box.appendChild(fechar);
    });
  }
  return {texto:texto, erro:erro, abrir:abrir};
})();
