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
# Arena dos Idols (v2), aplicada em 14/11/2026.
q < "$root/supabase/sql/aplicado/20261114_idol_battle_v2_arena.sql"
q < "$root/supabase/tests/battle/checks_arena.sql"
# Torcida de flores (v3), aplicada em 14/11/2026.
q < "$root/supabase/sql/aplicado/20261114_idol_battle_v3_torcida.sql"
q < "$root/supabase/tests/battle/checks_torcida.sql"
# Regressão: como a v3 substitui battle_jogar e battle_desafiar, todas as verificações
# anteriores rodam de novo num banco novo já com as funções substituídas.
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${db};"
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${db};"
q < "$root/supabase/tests/battle/setup.sql"
q < "$root/supabase/sql/aplicado/20261114_idol_battle_v1.sql"
q < "$root/supabase/sql/aplicado/20261114_idol_battle_ranking.sql"
q < "$root/supabase/sql/aplicado/20261114_idol_battle_v2_arena.sql"
q < "$root/supabase/sql/aplicado/20261114_idol_battle_v3_torcida.sql"
q < "$root/supabase/tests/battle/checks.sql"
q < "$root/supabase/tests/battle/checks_ranking.sql"
q < "$root/supabase/tests/battle/checks_arena.sql"
q < "$root/supabase/tests/battle/checks_torcida.sql"
echo "OK Idol⭐Battle! em PostgreSQL isolado (v1, ranking, arena, torcida + regressão)"
