const { makeToken, SECRET } = require('../lib/common');

module.exports = (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!SECRET) return res.status(500).json({ error: 'SCORE_SECRET ausente' });
  res.status(200).json({ token: makeToken() });
};
