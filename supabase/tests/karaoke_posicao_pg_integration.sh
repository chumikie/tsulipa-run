#!/usr/bin/env bash
set -euo pipefail
# Proposta kt_minha_posicao contra um PostgreSQL descartável.
# CI: bash supabase/tests/karaoke_posicao_pg_integration.sh <id do container postgres:16>
# Local: PSQL="psql -h /tmp/pg -p 5499 -U postgres" bash supabase/tests/karaoke_posicao_pg_integration.sh
container="${1:-}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [[ -n "$container" ]]; then base=(docker exec -i "$container" psql -X -U postgres); else read -r -a base <<< "${PSQL:?PSQL ou container}"; base+=(-X); fi
"${base[@]}" -d postgres -v ON_ERROR_STOP=1 -qc 'drop database if exists kt_posicao_test;' -c 'create database kt_posicao_test;'
q(){ "${base[@]}" -d kt_posicao_test -v ON_ERROR_STOP=1 -At "$@"; }
q -q < "$repo_dir/supabase/tests/karaoke_posicao_pg_setup.sql"
q -q < "$repo_dir/supabase/sql/karaoke_minha_posicao.sql"
id(){ printf '50000000-0000-4000-8000-%012d' "$1"; }
rpc(){ q -c "set role authenticated; set request.jwt.claim.sub='$(id "$1")'; select public.kt_minha_posicao()::text;" | tail -1; }
expect(){ local o f; o="$(printf '%s' "$1" | tr -d '[:space:]')"; f="$(printf '%s' "$2" | tr -d '[:space:]')"
  if [[ "$o" != *"$f"* ]]; then echo "FAIL $3: falta $2 em $1" >&2; exit 1; fi; echo "ok - $3"; }
expect "$(rpc 1)" '"score":{"pos":1,"valor":950}' 'primeiro lugar'
expect "$(rpc 8)" '"score":{"pos":7,"valor":600}' 'oitavo da lista vira 7º (bloqueado não conta)'
expect "$(rpc 8)" '"combo":{"pos":7,"valor":32}' 'combo com a mesma posição'
expect "$(rpc 8)" '"acertos":{"pos":7' 'acertos com a mesma posição'
expect "$(rpc 9)" '"score":null' 'sem resultado na semana atual'
expect "$(q -c "select has_function_privilege('anon','public.kt_minha_posicao()','execute');")" 'f' 'visitante sem acesso'
echo "✓ kt_minha_posicao: posição na semana, bloqueados fora, só contas"
