#!/usr/bin/env bash
set -euo pipefail
# A proposta SQL da PR #71 só roda no PostgreSQL descartável do Actions.
container="${1:?ID do container PostgreSQL de teste}"
db="pr71_online_test"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "DROP DATABASE IF EXISTS ${db};"
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "CREATE DATABASE ${db};"
q(){ docker exec -i "$container" psql -X -U postgres -d "$db" -v ON_ERROR_STOP=1; }
q < "$repo_dir/supabase/tests/pr71_online_pg_setup.sql"
q < "$repo_dir/supabase/sql/proposta/PR71_RECORDES_ONLINE_E_INSIGNIAS_REVIEW_ONLY.sql"
q < "$repo_dir/supabase/tests/pr71_online_pg_checks.sql"
echo "✓ PR #71: SQL compilou e passou no PostgreSQL isolado"
