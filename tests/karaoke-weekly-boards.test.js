'use strict';
// Quadros da semana: Pontuação, Mais shows na semana e Quem mais evoluiu (Acertos e Combo saíram da tela),
// e a medalha da Música da semana não repete o 1º da Pontuação.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'karaoke-time.html'),'utf8');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const online=fs.readFileSync(path.join(root,'karaoke-online.js'),'utf8');
const sql=fs.readFileSync(path.join(root,'supabase/sql/aplicado/karaoke_quadros_semana.sql'),'utf8');
const start=html.indexOf('var KaraokeShowRules=(function(){'),end=html.indexOf('/* Um conceito por dia de Brasília',start);
const KaraokeDaily={dayNumber(d){return Math.floor(Date.parse(d+'T00:00:00Z')/86400000);},nextDay(d,o){return new Date((this.dayNumber(d)+o)*86400000).toISOString().slice(0,10);}};
let value=null;const storage={getItem(){return value;},setItem(k,v){value=String(v);}};
const sb={KaraokeDaily,console};vm.createContext(sb);vm.runInContext(html.slice(start,end)+'\nthis.R=KaraokeShowRules;',sb,{timeout:1000});
const rules=sb.R.create(storage);
const show=(day,n,score)=>{const p={id:'idol-'+n,nick:'Idol '+n,avatar:{c:{hair:'#ff7eb6'}}},a=rules.begin(p,day,'normal',false);assert.equal(a.ok,true,'show começa');assert.equal(rules.finish(p.id,a.round.token,day,{score,hits:9,attempts:10,combo:5,totalNotes:10,completedAt:Date.parse(day+'T12:00:00Z'),song:'normal'}).ok,true,'show salvo');};
// semana passada (25/10): idol-1 900, idol-2 1000
show('2026-10-25',1,900);show('2026-10-25',2,1000);
// esta semana (01/11): idol-1 joga 3 vezes e melhora para 1100 (+200); idol-2 1 vez, 1050 (+50); idol-3 só esta semana
show('2026-11-01',1,800);show('2026-11-02',1,1100);show('2026-11-03',1,950);show('2026-11-01',2,1050);show('2026-11-01',3,1200);
const ex=rules.extraBoards('2026-11-03','idol-2');
assert.equal(ex.shows.top[0].id,'idol-1','quem jogou mais em 1º');assert.equal(ex.shows.top[0].valor,3,'3 shows');
assert.equal(JSON.stringify(ex.evolucao.top.map(r=>[r.id,r.valor])),JSON.stringify([['idol-1',200],['idol-2',50]]),'evolução: só quem jogou nas duas semanas e melhorou');
assert.deepEqual({...ex.evolucao.me},{pos:2,valor:50},'minha posição na evolução');
assert.equal(rules.extraBoards('2026-11-08','idol-1').shows.top.length,0,'contagem zera na semana seguinte');
// tela
assert(html.includes('data-kt-rank="shows"')&&html.includes('data-kt-rank="evolucao"')&&!html.includes('data-kt-rank="accuracy"')&&!html.includes('data-kt-rank="combo"'),'abas: Pontuação, Mais shows, Evoluiu');
assert(html.includes('id="ktBoard-shows"')&&html.includes('id="ktBoard-evolucao"')&&!html.includes('id="ktBoard-accuracy"'),'quadros novos no lugar de Acertos e Combo');
assert(html.includes("['shows','Mais shows na semana','🎤'],['evolucao','Quem mais evoluiu','📈']"),'placar da sala acompanha');
assert(html.includes("querySelectorAll('.kt-rank-card[data-metric]')"),'abas não escondem o quadro da música da semana');
assert(html.includes("isLead=!!lead&&(b.online?row.nick===lead.nick:row.id===lead.id)")&&html.includes("isLead?'👑':['🥇','🥈','🥉','4','5'][m++]"),'música da semana: o 1º da Pontuação ganha 👑 e o ouro vai para o próximo');
assert(index.includes("quadros:function(){return contaRpc('kt_quadros_semana');},")&&online.includes("if(a.quadros)a.quadros().then("),'online lê os quadros novos');
assert(/NÃO APLICAR SEM AUTORIZAÇÃO/.test(sql)&&sql.includes('Depende de supabase/sql/aplicado/karaoke_musica_da_semana.sql'),'SQL marcado como proposta e com dependência');
assert(!/var lead=b\.score&&b\.score\[0\],k=/.test(html),'contador da medalha não reaproveita a variável da música');
console.log('✓ Karaoke: quadros Pontuação, Mais shows na semana, Quem mais evoluiu e medalha da música da semana');
