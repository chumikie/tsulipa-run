const SUPABASE_URL = "https://fsggtvgbyhchblyazgmt.supabase.co";
const SUPABASE_KEY = "sb_publishable_2Fh68LqCpGannoF--zq1Ng_13dF9YMT";

exports.handler = async (event, context) => {
  // Limpa o caminho para aceitar tanto /api/ quanto /.netlify/functions/api/
  const path = event.path.replace(/^\/\.netlify\/functions\/api/, '').replace(/^\/api/, '');
  const method = event.httpMethod;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // 1. Rota /start: gera um token para a sessão de jogo
    if (path === '/start' && method === 'GET') {
      const token = 'tok_' + Date.now() + '_' + Math.random().toString(36).substring(2);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ token })
      };
    }

    // 2. Rota /leaderboard: busca o ranking salvo no Supabase
    if (path === '/leaderboard' && method === 'GET') {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard?select=name,score,stars,char,created_at&order=score.desc&limit=10`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });

      if (!res.ok) {
        throw new Error('Erro ao buscar ranking no Supabase');
      }

      const rows = await res.json();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ rows })
      };
    }

    // 3. Rota /submit: salva a pontuação enviada pelo jogo
    if (path === '/submit' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const { name, score, stars, char } = body;

      if (!name || score === undefined) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: 'Dados incompletos' })
        };
      }

      const res = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: name.slice(0, 12),
          score: Math.floor(score),
          stars: stars || 0,
          char: char || 'Tsu'
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error('Erro ao salvar no Supabase: ' + errText);
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Rota não encontrada', path })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};