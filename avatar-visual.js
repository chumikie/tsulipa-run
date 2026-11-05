/* TsuLiPa⭐World — Visual 2.0 do avatar (compartilhado por site, Karaoke⭐Time! e Sora⭐Jump!).
   Usa o mesmo contexto global `g` do drawChar. Só formas do drawChar: retângulos e linhas, sem contorno.
   - Mangas curtas na cor da roupa, iguais com o braço parado ou levantado.
   - Luz vinda da esquerda: lado direito do tronco e do cabelo um tom mais escuro, em degradê suave.
   Páginas em que o `g` do drawChar fica dentro de um escopo próprio (Karaoke) registram window.twAvatarG. */
function charG(){ return typeof window !== 'undefined' && typeof window.twAvatarG === 'function' ? window.twAvatarG() : g; }
function charSombraTronco(x, y){
  var g = charG();
  var ls = g.createLinearGradient(x + 15, 0, x + 26, 0);
  ls.addColorStop(0, 'rgba(30,10,60,0)'); ls.addColorStop(1, 'rgba(30,10,60,.16)');
  g.fillStyle = ls; g.fillRect(x + 15, y + 22, 11, 12);          // tronco inteiro, até a borda do blazer
  g.fillStyle = 'rgba(255,255,255,.14)'; g.fillRect(x + 4.5, y + 23, 1.6, 9);
}
function charSombraCabelo(x, y, sl){
  var g = charG();   // dentro do topo redondo e da costeleta direita
  g.save(); g.beginPath(); g.arc(x + 15, y + 12, 12, Math.PI, 0); g.rect(x + 23, y + 11.5, 4, sl + .5); g.clip();
  var hs = g.createLinearGradient(x + 14, 0, x + 27, 0);
  hs.addColorStop(0, 'rgba(25,8,55,0)'); hs.addColorStop(1, 'rgba(25,8,55,.2)');
  g.fillStyle = hs; g.fillRect(x + 14, y - 1, 14, sl + 14); g.restore();
}
var charManga = '';
function charMangaCor(roupa, OF, PX, OUT, cor){
  if(roupa === 'sweet' || roupa === 'zipper') return '';                 // já têm manga bufante
  if(OF > 0) return PX ? OUT[0] : ['', '#2a3f8a', '#fff0f7', '#1b2a5e', '#1a1426', '#fffdf2'][OF];
  if(roupa === 'espacial') return '#e8f0ff';
  if(!roupa) return '#4a5170';                                            // Trainee: blazer
  return cor;
}
function charMangaReta(x0, y0){
  var g = charG();   // braço parado: 3 unidades de manga no ombro
  if(!charManga) return;
  g.fillStyle = charManga; g.fillRect(x0, y0, 4, 3.4);
  g.fillStyle = 'rgba(30,10,60,.18)'; g.fillRect(x0, y0 + 2.6, 4, .8);
}
function charMangaLinha(x0, y0, x1, y1){
  var g = charG();   // braço levantado: o primeiro terço do braço é manga
  if(!charManga) return;
  var k = .4; g.save(); g.lineCap = 'butt'; g.strokeStyle = charManga; g.lineWidth = 4.4;
  g.beginPath(); g.moveTo(x0 - (x1 - x0) * .08, y0 - (y1 - y0) * .08); g.lineTo(x0 + (x1 - x0) * k, y0 + (y1 - y0) * k); g.stroke(); g.restore();
}
