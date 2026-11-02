#!/usr/bin/env bash
set -euo pipefail
# CI: bash supabase/tests/grupos_nacionais_pg_integration.sh <postgres service container ID>
container="${1:?PostgreSQL CI service container ID required}"
db="grupos_nacionais_test"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
psql_service(){
  docker exec -i "$container" psql -X -U postgres -d "$1" -v ON_ERROR_STOP=1 "${@:2}"
}
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "drop database if exists ${db};"
docker exec "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c "create database ${db};"
psql_service "$db" < "$repo_dir/supabase/tests/grupos_nacionais_pg_setup.sql"
psql_service "$db" < "$repo_dir/supabase/migrations/20261102014635_grupos_nacionais.sql"
psql_service "$db" < "$repo_dir/supabase/tests/grupos_nacionais_pg_checks.sql"
echo "✓ grupos nacionais: migração real + RPCs autenticadas e perfil público"
