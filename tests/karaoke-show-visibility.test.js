'use strict';
// Regressão (celular): o show pausava logo após começar porque o palco ficava fora da tela
// (a Vitrine sonora subia para cima da sala durante o show).
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const fn=html.slice(html.indexOf('function krRoomPodeAnimar(){'),html.indexOf('function krIrAoPalco(){'));
assert(html.includes('function krShowAtivo(){'),'existe o teste de show em andamento');
assert(fn.indexOf('if(document.hidden||!krRoomHostVisible')<fn.indexOf('if(krShowAtivo())return true;'),'página oculta continua pausando antes de qualquer exceção');
assert(fn.includes('if(krShowAtivo())return true;'),'show em andamento não pausa só porque o palco saiu da tela');
assert(html.includes("window.addEventListener('pagehide',function(){previewPlayer.stop(false);if(run){pause(true);checkpoint();}});")&&html.includes("document.addEventListener('visibilitychange',function(){if(document.hidden){previewPlayer.stop(false);if(run)pause(true);}});"),'prévia é liberada ao sair/ocultar a página e a pausa da partida continua preservada');
assert(html.includes('.kt-playing #ktAudioLibrary{order:7}'),'durante o show a vitrine fica depois da sala');
assert(html.includes('setTimeout(function(){if(!auto)krIrAoPalco();krRoomAtualizar();},160);'),'ao começar o show a tela vai até o palco e o loop da sala é religado');
// No site o iframe cresce até a altura da página: a janela "Confirmar show" ficava ~1000 px abaixo da tela no celular.
assert(html.includes("if(ktNoSite())(function(){var fe;try{fe=window.frameElement;}")&&html.includes("d.matches(':modal')")&&html.includes("attributeFilter:['open']"),'janelas modais do Karaoke abrem na parte visível do site');
console.log('✓ Karaoke: show não pausa sozinho no celular e o palco fica à vista; janelas modais na parte visível');
