'use strict';
// Música da semana: combina com a vista, troca no domingo 0h de Brasília, quadro próprio (local e online) e envio da música ao servidor.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const V=require('../karaoke-room-views.js');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/aplicado/karaoke_musica_da_semana.sql'),'utf8');
const at=s=>Date.parse(s);
assert.deepEqual({...V.SONGS},{gigoia:'chill',liberdade:'duo',tailandia:'normal',harajuku:'fast',praia:'gacha'},'pares aprovados pela dona');
for(const [iso,song] of [['2026-11-01T03:00:00Z','duo'],['2026-11-08T03:00:00Z','normal'],['2026-11-15T03:00:00Z','fast'],['2026-11-22T03:00:00Z','gacha'],['2026-11-29T03:00:00Z','chill'],['2026-11-08T02:59:59Z','duo']])
 assert.equal(V.songFor(at(iso)),song,'música da semana em '+iso);
assert(sql.includes("(array['chill','duo','normal','fast','gacha'])")&&sql.includes("date '2026-11-01'"),'banco usa a mesma regra do site');
// quadro local: só shows da música, zera com a semana
const start=html.indexOf('var KaraokeShowRules=(function(){'),end=html.indexOf('/* Um conceito por dia de Brasília',start);
const KaraokeDaily={dayNumber(d){return Math.floor(Date.parse(d+'T00:00:00Z')/86400000);},nextDay(d,o){return new Date((this.dayNumber(d)+o)*86400000).toISOString().slice(0,10);}};
let value=null;const storage={getItem(){return value;},setItem(k,v){value=String(v);}};
const sb={KaraokeDaily,console};vm.createContext(sb);vm.runInContext(html.slice(start,end)+'\nthis.R=KaraokeShowRules;',sb,{timeout:1000});
const rules=sb.R.create(storage),DAY='2026-11-01';
const show=(n,song,score)=>{const p={id:'idol-'+n,nick:'Idol '+n,avatar:{c:{hair:'#ff7eb6'}}},a=rules.begin(p,DAY,song,false);assert.equal(a.ok,true);assert.equal(rules.finish(p.id,a.round.token,DAY,{score,hits:9,attempts:10,combo:5,totalNotes:10,completedAt:Date.parse(DAY+'T12:00:00Z'),song}).ok,true);};
for(let i=1;i<=6;i++)show(i,'duo',1000-i*20);show(7,'fast',1200);
const sw=rules.songBoard(DAY,'duo','idol-6');
assert.equal(sw.top.length,5,'top 5 da música');assert.equal(sw.top[0].nick,'Idol 1','maior pontuação primeiro');
assert.deepEqual({...sw.me},{pos:6,valor:880},'posição fora do top 5');
assert.equal(rules.songBoard(DAY,'duo','idol-7').me,null,'quem tocou outra música não entra');
assert.equal(rules.songBoard('2026-11-08','duo','idol-1').top.length,0,'quadro zera na semana seguinte');
// sala e ponte com o servidor
assert(html.includes('id="ktSongWeek"')&&html.includes("function renderSongWeek(c,b)")&&html.includes("try{renderSongWeek(c,b);}catch(e){}"),'quadro na sala, sem derrubar o ranking se falhar');
assert(html.includes("completedAt:Date.now(),song:run.session.song}")&&html.includes("if(a.musicaSemana)a.musicaSemana().then("),'resultado leva a música; online lê o quadro');
assert(index.includes("musicaSemana:function(){return contaRpc('kt_musica_semana');},")&&index.includes("if(e&&e.code==='PGRST202')return contaRpc('kt_run_finish',base);"),'envia p_song e repete sem ele se o banco ainda não tiver');
assert(html.includes("['Música da semana','Song of the week','Canción de la semana','เพลงประจำสัปดาห์','今週の曲']"),'traduzido');
console.log('✓ Karaoke: música da semana (pares, rodízio, quadro local/online e envio ao servidor)');
