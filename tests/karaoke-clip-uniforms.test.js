'use strict';
// Clipe do dia: o elenco aparece uniformizado (mesma roupa do jogo e mesma cor), conforme o tema do clipe.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const U=require('../karaoke-clip-uniforms.js');
const html=fs.readFileSync(path.join(__dirname,'..','karaoke-time.html'),'utf8');
const sets=[...html.matchAll(/\{name:'[^']+',set:'([a-z]+)',colors:/g)].map(m=>m[1]);
assert(sets.length>=8,'temas do clipe encontrados');
for(const s of sets)assert(U.UNIFORMES[s],'tema '+s+' tem uniforme');
const roupas=new Set(['seifuku','estrelado','y2k','zipper','sweet','citypop','brasil','pijama','happi','gingham','hipster','rock','disco','technopop','decora','alienfan','vampiro','rena','reveillon','floral','coracao','outono','sakura','puffer','yukata','cardiga','jardineira','festa48']);
for(const [s,[out,cor]] of Object.entries(U.UNIFORMES)){assert(roupas.has(out),s+': roupa existe no jogo');assert(/^#[0-9a-f]{6}$/.test(cor),s+': cor válida');}
const original={hair:'#ff7eb6',out:'zipper',outcol:'#dc143c'};
const p=U.apply({concept:{set:'ocean'},members:[{id:'a',nick:'A',char:original},{id:'b',nick:'B',char:{hair:'#000000',out:'',outcol:'#ffffff'}}]});
assert(p.members.every(m=>m.char.out==='seifuku'&&m.char.outcol==='#17657b'),'todos com a mesma roupa e cor');
assert.equal(p.members[0].char.hair,'#ff7eb6','cabelo e resto do visual continuam');
assert.equal(original.out,'zipper','o visual salvo da conta não muda');
assert.equal(U.apply({concept:{set:'novo'},members:[{char:original}]}).members[0].char.out,'zipper','tema sem uniforme fica como está');
assert(html.includes('<script src="./karaoke-clip-uniforms.js?v=1"></script>')&&html.includes('if(window.KaraokeClipUniforms)production=KaraokeClipUniforms.apply(production);'),'sala aplica o uniforme no clipe');
console.log('✓ Karaoke: clipe do dia com elenco uniformizado por tema');
