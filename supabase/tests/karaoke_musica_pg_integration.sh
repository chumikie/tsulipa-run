#!/usr/bin/env bash
set -euo pipefail
# Proposta "música da semana" contra um PostgreSQL descartável.
# CI: bash supabase/tests/karaoke_musica_pg_integration.sh <id do container postgres:16>
# Local: PSQL="psql -h /tmp/pg -p 5499 -U postgres" bash supabase/tests/karaoke_musica_pg_integration.sh
container="${1:-}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
if [[ -n "$container" ]]; then base=(docker exec -i "$container" psql -X -U postgres); else read -r -a base <<< "${PSQL:?PSQL ou container}"; base+=(-X); fi
"${base[@]}" -d postgres -v ON_ERROR_STOP=1 -qc 'drop database if exists kt_musica_test;' -c 'create database kt_musica_test;'
q(){ "${base[@]}" -d kt_musica_test -v ON_ERROR_STOP=1 -At "$@"; }
q -q < "$repo_dir/supabase/tests/karaoke_musica_pg_setup.sql"
q -q < "$repo_dir/supabase/sql/karaoke_musica_da_semana.sql"
id(){ printf '60000000-0000-4000-8000-%012d' "$1"; }
expect(){ local o f; o="$(printf '%s' "$1" | tr -d '[:space:]')"; f="$(printf '%s' "$2" | tr -d '[:space:]')"
  if [[ "$o" != *"$f"* ]]; then echo "FAIL $3: falta $2 em $1" >&2; exit 1; fi; echo "ok - $3"; }
# o rodízio do banco é o mesmo do site
for pair in "2026-11-01 duo" "2026-11-08 normal" "2026-11-15 fast" "2026-11-22 gacha" "2026-11-29 chill" "2026-12-06 duo" "2026-10-25 chill"; do
  set -- $pair; expect "$(q -c "select private.kt_musica_da_semana(date '$1');")" "$2" "semana $1 = $2"
done
# show de 60 s: cria a corrida um minuto no passado e termina
show(){ local p="$1" song="$2" score="$3" extra=""; [[ "$song" != "-" ]] && extra=",p_song=>'$song'"
  local run; run="$(q -c "insert into private.kt_runs(player_id,started_at) values('$(id "$p")', clock_timestamp()-interval '60 seconds') returning id;" | head -1)"
  q -c "set role authenticated; set request.jwt.claim.sub='$(id "$p")'; select public.kt_run_finish(p_run=>'$run',p_score=>$score,p_hits=>10,p_attempts=>10,p_combo=>10,p_notes=>10$extra)::text;" | tail -1; }
expect "$(show 1 duo 1200)" '"ranked":true' 'música da semana aceita'
expect "$(show 2 duo 1300)" '"ranked":true' 'outra conta'
expect "$(show 3 fast 1400)" '"ranked":true' 'outra música entra no ranking geral'
expect "$(show 4 - 1350)" '"ranked":true' 'site antigo sem p_song continua funcionando'
for p in 5 6 7; do show $p duo $((700+p*10)) >/dev/null; done
expect "$(q -c "select count(*) from private.kt_song_scores;")" '5' 'só os shows da música da semana entram no quadro'
expect "$(q -c "select count(*) from private.kt_scores;")" '7' 'ranking geral recebe todos'
r="$(q -c "set role authenticated; set request.jwt.claim.sub='$(id 7)'; select public.kt_musica_semana()::text;" | tail -1)"
expect "$r" '"musica":"duo"' 'quadro diz a música'
expect "$r" '"eu":{"pos":3,"valor":770}' 'posição de quem pergunta'
expect "$(q -c "set role authenticated; set request.jwt.claim.sub='$(id 1)'; select jsonb_array_length(public.kt_musica_semana()->'top');" | tail -1)" '5' 'top 5'
expect "$(q -c "select count(*) from pg_proc where proname='kt_run_finish';")" '1' 'sobra uma versão só do kt_run_finish'
expect "$(q -c "select has_function_privilege('anon','public.kt_musica_semana()','execute');")" 'f' 'visitante sem acesso'
echo "✓ música da semana: rodízio igual ao site, quadro próprio e kt_run_finish compatível"
