'use strict';
const assert = require('node:assert/strict');
const {collect,recoveryAccount} = require('../center-recovery.js');

const now = Date.UTC(2026, 10, 4, 15);
const owner = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const other = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
const runId = 'cccccccc-cccc-4ccc-cccc-cccccccccccc';
const row = {name:'Matheus', score:3120, char:'Idol', t:now-3600000};
const keys = {
  brs48cr_lb: JSON.stringify([row, {name:'Outra Idol',score:9000,t:now-1000}]),
  brs48cr_lw: JSON.stringify({w:'2026-11-01',rows:[row]}),
  brs48cr_ld: JSON.stringify({d:'2026-11-04',rows:[row]}),
  brs48cr_corridas_pendentes_v1: JSON.stringify([
    {owner, id:runId, score:3120, stars:30, char:'Idol', at:now-3*3600000, auth_token:'SENSITIVE'},
    {owner:other, id:other, score:15000, stars:200, char:'Outra', at:now-1000},
    {owner, id:'not-valid-uuid', score:1, stars:1, char:'Idol', at:now-1000}
  ]),
  'sb-token': 'SECRET'
};
let gets = [], writes = 0;
const storage = {
  getItem(key) {gets.push(key); return keys[key] || null;},
  setItem() {writes++; throw Error('read-only means no writes');},
  removeItem() {writes++; throw Error('read-only means no removes');},
  clear() {writes++; throw Error('read-only means no clear');}
};

assert.equal(collect(storage, null, now),null, 'guest cannot inspect a shared browser');
assert.deepEqual(gets,[], 'no read before confirming account');
// A sessão autenticada fornece o id que jogador() não retorna.
assert.equal(recoveryAccount({nick:'Matheus'},''),null, 'no account without a session owner');
const account = recoveryAccount({nick:'Matheus',stars:930,best:10854,importado:true}, owner);
assert.deepEqual(account,{id:owner,nick:'Matheus'},'do not copy stars or extra fields into the evidence collector');
const report = collect(storage, account, now);
assert.equal(report.local_scores.length,1, 'same score in 3 rankings deduplicated');
assert.deepEqual(report.local_scores[0].sources,['all','week','day']);
assert.equal(report.pending_runs.length,1, 'only owner pending runs');
assert.equal(report.pending_runs[0].run_id,runId);
assert.equal(report.pending_runs[0].older_than_2h,true, 'expired evidence remains visible');
assert.equal(report.pending_runs[0].stars_proposed,30);
assert.equal(report.id,undefined, 'do not export internal account ID');
const json=JSON.stringify(report);
for(const secret of ['SENSITIVE','SECRET',owner,other,'Outra Idol']){
  assert.equal(json.includes(secret),false,'no foreign/secret information: '+secret);
}
assert.equal(writes,0,'collector has no side effects');
assert.deepEqual(gets.sort(),Object.keys(keys).filter(k=>k.startsWith('brs48cr_')).sort(), 'fixed allowlist of local keys');

const separate=collect(storage, {id:other,nick:'Outra Idol'}, now);
assert.equal(separate.local_scores.length,1);
assert.equal(separate.pending_runs.length,1);
assert.equal(separate.local_scores[0].score,9000);

const malformed={getItem:k=> k==='brs48cr_lb'?'{broken':k==='brs48cr_corridas_pendentes_v1'?JSON.stringify([{owner,id:runId,score:'bad',stars:1,at:now}]):null};
const empty=collect(malformed,{id:owner,nick:'Matheus'},now);
assert.equal(empty.local_scores.length,0);
assert.equal(empty.pending_runs.length,0);
console.log('✓ Center Run: local-only evidence, account isolation, dedup, expired queue, no secrets or writes');
