#!/usr/bin/env bash
set -euo pipefail
# Proposta "Mais shows na semana" e "Quem mais evoluiu" contra um PostgreSQL descartável (sobre a música da semana).
# CI: bash supabase/tests/karaoke_quadros_pg_integration.sh <id do container postgres:16>
# Local: PSQL="psql -h /tmp/pg -p 5499 -U postgres" bash supabase/tests/karaoke_quadros_pg_integration.sh
container="${1:-}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [[ -n "$container" ]]; then base=(docker exec -i "$container" psql -X -U postgres); else read -r -a base <<< "${PSQL:?PSQL ou container}"; base+=(-X); fi
"${base[@]}" -d postgres -v ON_ERROR_STOP=1 -qc 'drop database if exists kt_quadros_test;' -c 'create database kt_quadros_test;'
q(){ "${base[@]}" -d kt_quadros_test -v ON_ERROR_STOP=1 -At "$@"; }
q -q < "$repo_dir/supabase/tests/karaoke_musica_pg_setup.sql"
q -q < "$repo_dir/supabase/sql/aplicado/karaoke_musica_da_semana.sql"
q -q < "$repo_dir/supabase/sql/aplicado/karaoke_quadros_semana.sql"
id(){ printf '60000000-0000-4000-8000-%012d' "$1"; }
expect(){ local o f; o="$(printf '%s' "$1" | tr -d '[:space:]')"; f="$(printf '%s' "$2" | tr -d '[:space:]')"
  if [[ "$o" != *"$f"* ]]; then echo "FAIL $3: falta $2 em $1" >&2; exit 1; fi; echo "ok - $3"; }
show(){ local p="$1" score="$2" run
  run="$(q -c "insert into private.kt_runs(player_id,started_at) values('$(id "$p")', clock_timestamp()-interval '60 seconds') returning id;" | head -1)"
  q -c "set role authenticated; set request.jwt.claim.sub='$(id "$p")'; select public.kt_run_finish(p_run=>'$run',p_score=>$score,p_hits=>10,p_attempts=>10,p_combo=>10,p_notes=>10,p_song=>'duo')::text;" | tail -1; }
# semana passada (25/10): P1 fez 1300, P2 fez 700, P3 fez 900
q -c "insert into private.kt_scores(player_id,week_start,score,score_at) values ('$(id 1)','2026-10-25',1300,now()),('$(id 2)','2026-10-25',700,now()),('$(id 3)','2026-10-25',900,now());" >/dev/null
# esta semana: P1 joga 3x (melhor 1350: +50), P2 joga 1x (1200: +500), P3 joga 2x (950: +50 mas depois), P4 1x sem semana passada
expect "$(show 1 1300)" '"ranked":true' 'show aceito'; show 1 1350 >/dev/null; show 1 1100 >/dev/null
show 2 1200 >/dev/null; show 3 950 >/dev/null; show 3 800 >/dev/null; show 4 1400 >/dev/null
show 5 1100 >/dev/null; show 6 1200 >/dev/null; show 7 1250 >/dev/null
r="$(q -c "set role authenticated; set request.jwt.claim.sub='$(id 2)'; select public.kt_quadros_semana()::text;" | tail -1)"
expect "$r" '"shows":{"eu":{"pos":3,"valor":1}' 'posição em mais shows'
expect "$(q -c "set role authenticated; set request.jwt.claim.sub='$(id 1)'; select (public.kt_quadros_semana()->'shows'->'top'->0)::text;" | tail -1)" '"valor":3' 'quem jogou 3 vezes em 1º'
expect "$(q -c "set role authenticated; set request.jwt.claim.sub='$(id 2)'; select (public.kt_quadros_semana()->'evolucao')::text;" | tail -1)" '"eu":{"pos":1,"valor":500}' 'quem mais evoluiu (+500)'
expect "$(q -c "set role authenticated; set request.jwt.claim.sub='$(id 4)'; select (public.kt_quadros_semana()->'evolucao'->'eu')::text;" | tail -1)" 'null' 'sem semana passada não entra em evolução'
expect "$(q -c "select jsonb_array_length(public.kt_quadros_semana()->'evolucao'->'top');")" '3' 'só quem melhorou entra (3)'
expect "$(q -c "select count(*) from private.kt_song_scores;")" '7' 'música da semana continua funcionando'
expect "$(q -c "select count(*) from pg_proc where proname='kt_run_finish';")" '1' 'uma versão só do kt_run_finish'
expect "$(q -c "select has_function_privilege('anon','public.kt_quadros_semana()','execute');")" 'f' 'visitante sem acesso'
echo "✓ quadros da semana: mais shows e quem mais evoluiu"
