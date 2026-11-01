#!/usr/bin/env bash
set -euo pipefail
# Proposta admin_montar_idol contra um PostgreSQL descartável.
# CI: bash supabase/tests/admin_idol_pg_integration.sh <id do container postgres:16>
# Local: PSQL="psql -h /tmp/pg -p 5499 -U postgres" bash supabase/tests/admin_idol_pg_integration.sh
container="${1:-}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [[ -n "$container" ]]; then base=(docker exec -i "$container" psql -X -U postgres); else read -r -a base <<< "${PSQL:?PSQL ou container}"; base+=(-X); fi
"${base[@]}" -d postgres -v ON_ERROR_STOP=1 -qc 'drop database if exists admin_idol_test;' -c 'create database admin_idol_test;'
q(){ "${base[@]}" -d admin_idol_test -v ON_ERROR_STOP=1 -At "$@"; }
q -q < "$repo_dir/supabase/tests/admin_idol_pg_setup.sql"
q -q < "$repo_dir/supabase/sql/admin_montar_idol.sql"
tsu='40000000-0000-4000-8000-000000000001'; nova='40000000-0000-4000-8000-000000000002'; outra='40000000-0000-4000-8000-000000000003'
rpc(){ q -c "set role authenticated; set request.jwt.claim.sub='$1'; select ($2)::text;" | tail -1; }
expect(){ local o f; o="$(printf '%s' "$1" | tr -d '[:space:]')"; f="$(printf '%s' "$2" | tr -d '[:space:]')"
  if [[ "$o" != *"$f"* ]]; then echo "FAIL $3: falta $2 em $1" >&2; exit 1; fi; echo "ok - $3"; }
look='{"hair":"#6a3fb5","hair2":"#ffffff","eye":"#29a1d9","skin":"#fbe5d8","outcol":"#ff9ccf","back":"onduladof","front":"repicada","mecha":"luzes","gl":"redonda","det":"coracao","hat":"boina","out":"rock"}'

expect "$(rpc "$outra" "public.admin_montar_idol('Novata','$look'::jsonb,'x')")" '"erro":"admin"' 'só admin'
expect "$(rpc "$tsu" "public.admin_montar_idol('Tsu','$look'::jsonb,'x')")" '"erro":"admin"' 'não edita a si mesma'
expect "$(rpc "$tsu" "public.admin_idol_info('Novata')")" '"auto":true' 'info mostra avatar automático'
expect "$(rpc "$tsu" "public.admin_montar_idol('Novata','${look/boina/capitao}'::jsonb,'x')")" '"campo":"hat"' 'acessório bloqueado pelo recorde'
expect "$(rpc "$tsu" "public.admin_montar_idol('Novata','${look/rock/disco}'::jsonb,'x')")" '"erro":"nao_comprada"' 'roupa da lojinha não comprada'
expect "$(rpc "$tsu" "public.admin_montar_idol('Novata','${look/coracao/coelho}'::jsonb,'x')")" '"campo":"det"' 'coelho só comprado'
expect "$(rpc "$tsu" "public.admin_montar_idol('Novata','${look/6a3fb5/zzz}'::jsonb,'x')")" '"erro":"cor"' 'cor inválida'
expect "$(rpc "$tsu" "public.admin_montar_idol('Novata','$look'::jsonb,'montar avatar')")" '"admin_visual_rev":4' 'salva e sobe a revisão'
r="$(q -c "select avatar::text||' '||nuvem_visual::text from public.players where nick='Novata';")"
expect "$r" '"auto":true' 'mantém o avatar automático'
expect "$r" '"a":"mic"' 'não mexe no item'
expect "$r" '"mecha":"luzes"' 'mecha gravada'
expect "$r" '"streak":true' 'streak acompanha a mecha'
expect "$r" '"back":"onduladof"' 'corte gravado no cu2 e no avatar'
expect "$(q -c "select count(*) from public.admin_log where acao='visual_montar' and alvo='Novata';")" '1' 'registro no admin_log'
expect "$(q -c "select has_function_privilege('anon','public.admin_montar_idol(text,jsonb,text)','execute');")" 'f' 'anon sem acesso'
echo "✓ admin_montar_idol: regras e gravação conferidas"
