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
psql_service "$db" < "$repo_dir/supabase/tests/grupos_nacionais_pg_visuais_setup.sql"
# A última versão aplicada no projeto ativo, confirmada por leitura em 02/11/2026,
# era 20261102044257. Estes três arquivos ainda não foram aplicados e, desde 02/11/2026,
# ficam em supabase/sql/proposta/ (fora de supabase/migrations/, para a publicação não aplicá-los sozinha).
# Ordem obrigatória: grupos -> avisos -> acessórios; falhar se timestamps regressarem.
previous_version="20261102044257"
migrations=(
  "20261102140310_grupos_nacionais.sql"
  "20261102140311_avisos_grupo_e_roupa_sku.sql"
  "20261102140312_acessorios_tulipa_laco_fundo_cafe.sql"
)
for migration in "${migrations[@]}"; do
  version="${migration%%_*}"
  if [[ ! "$version" =~ ^[0-9]{14}$ || "$version" < "$previous_version" || "$version" == "$previous_version" ]]; then
    echo "ERRO: migração fora da ordem segura: $migration (anterior: $previous_version)" >&2
    exit 1
  fi
  previous_version="$version"
  psql_service "$db" < "$repo_dir/supabase/sql/proposta/$migration"
done
psql_service "$db" < "$repo_dir/supabase/tests/grupos_nacionais_pg_checks.sql"
psql_service "$db" < "$repo_dir/supabase/tests/grupos_nacionais_pg_visuais_checks.sql"
echo "✓ 3 migrações nacionais: grupos, avisos legados, catálogo, compra real espelhada, avatar, acessórios e Café kawaii"
