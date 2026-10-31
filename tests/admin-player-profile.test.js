'use strict';

const fs = require('fs');
const path = require('path');
const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase/sql/admin_player_profile_proposal.sql'), 'utf8');
const doc = fs.readFileSync(path.join(__dirname, '..', 'docs/backstage-admin/README.md'), 'utf8');

function has(pattern, message) {
  if (!pattern.test(sql)) throw new Error(message);
}

has(/auth\.uid\(\)\s+is\s+null\s+or\s+not\s+coalesce\(public\.eh_admin\(\),\s*false\)/i,
  'A ficha precisa exigir sessão e eh_admin() no servidor.');
has(/revoke all on function public\.admin_ficha_jogador\(text\) from public, anon/i,
  'A RPC não pode ficar executável por PUBLIC ou anon.');
has(/grant execute on function public\.admin_ficha_jogador\(text\) to authenticated/i,
  'A RPC deve ser acessível somente ao papel authenticated, com checagem eh_admin() interna.');
has(/where lower\(p\.nick\) = lower\(btrim\(p_nick\)\)/i,
  'A busca deve ser por nickname exato, normalizado.');
has(/'historico_admin'/i, 'A ficha precisa incluir histórico administrativo existente.');
has(/'sora_jump'/i, 'A ficha precisa reunir recordes do Sora.');
has(/'karaoke_time_semana'/i, 'A ficha precisa reunir dados semanais do Karaoke⭐Time!.');
if (/auth\.users|email|service_role/i.test(sql)) {
  throw new Error('A ficha não deve expor dados de autenticação ou credenciais.');
}
if (!/um único administrador/i.test(doc) || !/não foi aplicada ao Supabase/i.test(doc)) {
  throw new Error('A documentação deve registrar o modelo de administrador único e o estado não aplicado.');
}
console.log('Backstage Admin: guardas estáticas da proposta aprovadas.');
