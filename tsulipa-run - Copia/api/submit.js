const { redis, readToken, weekKey, SECRET } = require('../lib/common');

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo' });
  if (!SECRET) return res.status(500).json({ error: 'config' });
  try {
    const b = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const tk = readToken(b.token);
    if (!tk) return res.status(400).json({ error: 'token' });

    // A partida precisa ter durado um tempo plausível.
    const age = (Date.now() - tk.t0) / 1000;
    if (age < 5 || age > 6 * 3600) return res.status(400).json({ error: 'tempo' });

    // Limites generosos: ninguém faz mais que ~120 pontos por segundo.
    const score = Math.floor(Number(b.score));
    const stars = Math.max(0, Math.floor(Number(b.stars) || 0));
    if (!Number.isFinite(score) || score < 0 || score > Math.floor(age * 120) + 300)
      return res.status(400).json({ error: 'pontuacao' });
    if (stars > age * 4 + 10) return res.status(400).json({ error: 'estrelas' });

    const did = String(b.did || '');
    if (!/^[A-Za-z0-9_-]{8,64}$/.test(did)) return res.status(400).json({ error: 'id' });
    const name = String(b.name || '').replace(/[\u0000-\u001f\u007f<>&"]/g, '').trim().slice(0, 12) || 'Anônimo';
    const ch = String(b.char || '').replace(/[^\p{L}\p{N} ]/gu, '').slice(0, 12);

    // Cada ingresso vale uma única vez.
    const used = await redis([['SET', 'used:' + tk.nonce, '1', 'NX', 'EX', '21600']]);
    if (used[0] === null) return res.status(409).json({ error: 'repetido' });

    const wk = 'lb:w:' + weekKey();
    await redis([
      ['ZADD', 'lb:all', 'GT', String(score), did],
      ['ZADD', wk, 'GT', String(score), did],
      ['EXPIRE', wk, '3024000'],
      ['HSET', 'p:' + did, 'name', name, 'char', ch, 't', String(Date.now())],
      ['HINCRBY', 'p:' + did, 'stars', String(stars)],
    ]);
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'erro' });
  }
};
