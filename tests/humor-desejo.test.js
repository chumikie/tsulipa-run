// Humor do Idol + Desejo do dia + passe do Camarim VIP (tw-humor.js): só local, nunca mexe em estrelas/servidor.
const test = require('node:test'); const assert = require('node:assert'); const fs = require('fs'); const vm = require('vm');
const src = fs.readFileSync(__dirname + '/../tw-humor.js', 'utf8');
function carregar(logado, agora){
  const mem = {}; let rpcs = [];
  const sb = {window:{}, LANG:'pt', Date:class extends Date{ constructor(...a){ super(...(a.length ? a : [agora])); } static now(){ return agora; } }, Math, JSON,
    localStorage:{getItem:k => mem[k] || null, setItem:(k, v) => { mem[k] = String(v); }},
    document:{querySelector:() => ({})}, contaJ: logado ? {nick:'Teste'} : null, Promise};
  sb.window.contaRpc = (n, a) => { rpcs.push(n); return Promise.resolve({ok:true}); };
  sb.contaRpc = sb.window.contaRpc;
  vm.runInNewContext(src, sb);
  return {H:sb.window.TW_HUMOR, sb, mem, rpcs:() => rpcs};
}
const T0 = new Date(2026, 10, 15, 12).getTime();
test('desejo do dia é o mesmo o dia inteiro e cumprir libera o passe VIP de hoje', () => {
  const {H} = carregar(true, T0);
  const d = H.desejo(); assert.ok(d.texto && d.icone && !d.feito);
  assert.deepEqual(H.desejo().k, d.k, 'estável no mesmo dia');
  assert.equal(H.vipHoje(), false);
  H.evento(d.ev === 'run' ? 'karaoke' : 'run'); assert.equal(H.desejo().feito, false, 'outro jogo não cumpre');
  H.evento(d.ev); assert.equal(H.desejo().feito, true); assert.equal(H.vipHoje(), true); assert.equal(H.estado().serie, 1);
});
test('visitante só recebe desejos que dá para cumprir sem conta', () => {
  for(let dia = 0; dia < 40; dia++){ const {H} = carregar(false, T0 + dia * 864e5); assert.ok(['run', 'cafe', 'battle', 'studio', 'handshake', 'mapa', 'frase'].includes(H.desejo().ev), H.desejo().ev); }
});
test('barrinhas ficam entre 5 e 100 e o tempo descansa a energia', () => {
  const {H} = carregar(true, T0);
  for(let i = 0; i < 30; i++) H.evento('battle');
  const e = H.estado(); for(const b of H.barras){ assert.ok(e[b] >= 5 && e[b] <= 100, b); }
  assert.equal(e.energia, 5, 'muitos shows cansam');
  assert.ok(/^#/.test(H.cor()));
});
test('jogar de verdade (RPC de fim de partida) conta; o arquivo não chama nenhuma RPC sozinho', async () => {
  const c = carregar(true, T0); const antes = c.H.estado().diversao;
  await c.sb.window.contaRpc('kt_run_finish', {}); await new Promise(r => setTimeout(r, 5));
  assert.ok(c.H.estado().diversao > antes);
  assert.deepEqual(c.rpcs(), ['kt_run_finish']);
  assert.ok(!/contaRpc\(['"]/.test(src), 'sem chamadas próprias ao servidor');
  assert.ok(!/starT|gastar_estrelas|ganhar_minijogo/.test(src), 'não mexe em estrelas');
});
