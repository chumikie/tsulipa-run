const crypto = require('crypto');

const REDIS_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const SECRET = process.env.SCORE_SECRET || '';

// Envia comandos ao banco (Upstash Redis) e devolve os resultados.
async function redis(cmds) {
  if (!REDIS_URL || !REDIS_TOKEN) throw new Error('banco de dados nao configurado');
  const r = await fetch(REDIS_URL + '/pipeline', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + REDIS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  const j = await r.json();
  return j.map((x) => { if (x.error) throw new Error(x.error); return x.result; });
}

function sign(p) { return crypto.createHmac('sha256', SECRET).update(p).digest('base64url'); }

// "Ingresso" de partida: prova que a partida começou no servidor.
function makeToken() {
  const p = Date.now() + '.' + crypto.randomBytes(8).toString('hex');
  return p + '.' + sign(p);
}

function readToken(t) {
  if (typeof t !== 'string') return null;
  const i = t.lastIndexOf('.');
  if (i < 0) return null;
  const p = t.slice(0, i);
  const a = Buffer.from(sign(p));
  const b = Buffer.from(t.slice(i + 1));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  const [t0, nonce] = p.split('.');
  return { t0: Number(t0), nonce };
}

// Semana começa na segunda-feira, no horário de Brasília (UTC-3).
function weekKey() {
  const d = new Date(Date.now() - 3 * 3600e3);
  const back = (d.getUTCDay() + 6) % 7;
  return new Date(d.getTime() - back * 86400e3).toISOString().slice(0, 10);
}

module.exports = { redis, makeToken, readToken, weekKey, SECRET };
