'use strict';
// Center Run: JOGAR vem logo depois da escolha do personagem; o estúdio de visual fica recolhido em "✏️ Montar visual".
const assert=require('assert'),fs=require('fs'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const iChars=html.indexOf('id="chars"'),iPlay=html.indexOf('id="play"'),iTog=html.indexOf('id="custToggle"'),iBox=html.indexOf('id="custBox"'),iCust=html.indexOf('id="cust"'),iRoupa=html.indexOf('id="cust_roupa"');
assert.ok(iChars>0&&iChars<iPlay&&iPlay<iTog&&iTog<iBox&&iBox<iCust&&iCust<iRoupa,'ordem: personagens, JOGAR, Montar visual, estúdio');
assert.ok(/id="custBox" hidden/.test(html),'estúdio começa recolhido');
assert.ok(/aria-controls="custBox"/.test(html)&&/brs48cr_montar_aberto/.test(html),'botão acessível e a escolha fica no aparelho');
assert.ok(/"Montar visual":"Customize look"/.test(fs.readFileSync(path.join(__dirname,'..','tw-i18n.js'),'utf8')),'traduzido');
console.log('OK: JOGAR primeiro, visual recolhido');
