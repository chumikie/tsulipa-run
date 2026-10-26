const { redis, weekKey } = require('../lib/common');

module.exports = async (req, res) => {
  try {
    const key = req.query && req.query.tab === 'all' ? 'lb:all' : 'lb:w:' + weekKey();
    const z = (await redis([['ZRANGE', key, '0', '9', 'REV', 'WITHSCORES']]))[0] || [];
    const ids = [], sc = [];
    for (let i = 0; i < z.length; i += 2) { ids.push(z[i]); sc.push(Number(z[i + 1])); }
    const info = ids.length ? await redis(ids.map((id) => ['HMGET', 'p:' + id, 'name', 'char'])) : [];
    res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=45');
    res.status(200).json({ rows: ids.map((id, i) => ({ name: (info[i] && info[i][0]) || 'Anônimo', char: (info[i] && info[i][1]) || '', score: sc[i] })) });
  } catch (e) {
    res.status(500).json({ error: 'erro' });
  }
};
