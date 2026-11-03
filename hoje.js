/* TsuLiPa⭐World — hora, data e clima ao lado do título "Hoje".
   Hora e data vêm do aparelho (no idioma do site). O clima só aparece se a pessoa tocar em 📍 e permitir a localização:
   guardamos só a posição arredondada (cerca de 10 km) neste aparelho e consultamos a Open-Meteo (sem conta, sem chave).
   Nada vai para o servidor do jogo. Este arquivo só declara funções e tabelas. */
var HOJE_POS_KEY = 'tw_hoje_pos_v1', HOJE_CLIMA_KEY = 'tw_hoje_clima_v1';
var hojeTimer = 0, hojeClima = null, hojePedindo = false;
function hojeLocale(){ return { pt:'pt-BR', en:'en-US', es:'es', th:'th-TH', ja:'ja-JP', id:'id-ID' }[typeof LANG === 'string' ? LANG : 'pt'] || 'pt-BR'; }
function hojeEmoji(c, dia){   // códigos WMO da Open-Meteo
  c = +c;
  if(c === 0) return dia ? '☀️' : '🌙';
  if(c <= 2) return dia ? '🌤️' : '☁️';
  if(c === 3) return '☁️';
  if(c === 45 || c === 48) return '🌫️';
  if(c >= 51 && c <= 67) return '🌧️';
  if(c >= 71 && c <= 77) return '❄️';
  if(c >= 80 && c <= 82) return '🌦️';
  if(c >= 85 && c <= 86) return '🌨️';
  if(c >= 95) return '⛈️';
  return '🌡️';
}
function hojeLer(k){ try{ return JSON.parse(localStorage.getItem(k) || 'null'); }catch(e){ return null; } }
function hojeGuardar(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function hojeHtml(){ return '<span class="hojeinfo" id="hojeInfo" aria-live="off"></span>'; }
function hojeUI(){
  var el = $('hojeInfo'); if(!el) return;
  var d = new Date(), loc = hojeLocale(), h = '', dt = '';
  try{ h = d.toLocaleTimeString(loc, { hour:'2-digit', minute:'2-digit' }); dt = d.toLocaleDateString(loc, { weekday:'short', day:'2-digit', month:'2-digit' }); }catch(e){ h = d.toTimeString().slice(0, 5); }
  var clima = hojeClima ? '<span class="hojeclima" title="' + escHtml(tr('Clima onde você está')) + '">' + hojeEmoji(hojeClima.c, hojeClima.dia) + ' ' + Math.round(hojeClima.t) + '°</span>'
    : (hojeLer(HOJE_POS_KEY) ? '' : '<button type="button" class="hojeloc" id="hojeLoc" title="' + escHtml(tr('Mostrar o clima de onde você está')) + '" aria-label="' + escHtml(tr('Mostrar o clima de onde você está')) + '">📍</button>');
  el.innerHTML = '<span>🕐 ' + escHtml(h) + '</span><span>' + escHtml(dt) + '</span>' + clima;
}
function hojeClimaBuscar(){
  var pos = hojeLer(HOJE_POS_KEY); if(!pos || typeof fetch !== 'function') return;
  var c = hojeLer(HOJE_CLIMA_KEY);
  if(c && Date.now() - c.em < 30 * 60e3 && c.lat === pos.lat && c.lon === pos.lon){ hojeClima = c; hojeUI(); return; }
  fetch('https://api.open-meteo.com/v1/forecast?latitude=' + pos.lat + '&longitude=' + pos.lon + '&current=temperature_2m,weather_code,is_day')
    .then(function(r){ return r.ok ? r.json() : null; })
    .then(function(j){ var cu = j && j.current; if(!cu) return; hojeClima = { t:+cu.temperature_2m, c:+cu.weather_code, dia:!!cu.is_day, em:Date.now(), lat:pos.lat, lon:pos.lon }; hojeGuardar(HOJE_CLIMA_KEY, hojeClima); hojeUI(); })
    .catch(function(){});
}
function hojeLocalizar(){
  if(hojePedindo || !navigator.geolocation) return; hojePedindo = true;
  navigator.geolocation.getCurrentPosition(function(p){
    hojePedindo = false;
    hojeGuardar(HOJE_POS_KEY, { lat:Math.round(p.coords.latitude * 10) / 10, lon:Math.round(p.coords.longitude * 10) / 10 });
    hojeClimaBuscar();
  }, function(){ hojePedindo = false; }, { enableHighAccuracy:false, timeout:10000, maximumAge:36e5 });
}
function hojeIniciar(){   // chamado quando o bloco "Hoje" é montado
  hojeUI();
  if(!hojeClima) hojeClimaBuscar();
  if(!hojeTimer) hojeTimer = setInterval(function(){ if(!document.hidden && $('hojeInfo')) hojeUI(); }, 30000);
}
