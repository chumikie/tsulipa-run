#!/usr/bin/env bash
set -euo pipefail
# SOMENTE PostgreSQL descartável do GitHub Actions; nunca produção.
container="${1:?ID do container PostgreSQL isolado}"
db="idol_battle_test"
root="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${db};"
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${db};"
q(){ docker exec -i "$container" psql -X -U postgres -d "$db" -v ON_ERROR_STOP=1; }
q < "$root/supabase/tests/battle/setup.sql"
q < "$root/supabase/sql/aplicado/20261114_idol_battle_v1.sql"
q < "$root/supabase/tests/battle/checks.sql"
# Top da Arena (ranking semanal), aplicado em 14/11/2026.
q < "$root/supabase/sql/aplicado/20261114_idol_battle_ranking.sql"
q < "$root/supabase/tests/battle/checks_ranking.sql"
# Arena dos Idols (v2): proposta, ainda não aplicada em produção.
q < "$root/supabase/sql/proposta/20261114_idol_battle_v2_arena_REVIEW_ONLY.sql"
q < "$root/supabase/tests/battle/checks_arena.sql"
echo "OK Idol⭐Battle! v1 em PostgreSQL isolado"
