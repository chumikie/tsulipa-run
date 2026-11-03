#!/usr/bin/env bash
set -euo pipefail
# Exclusivo do serviço PostgreSQL descartável do GitHub Actions, sem Supabase real.
db_container="${1:?PostgreSQL CI service container ID required}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
db="sora_reward_test"
docker exec "$db_container" createdb -U postgres "$db"
psql_ci(){
  docker exec -i "$db_container" psql -qAt -U postgres -d "$db" -v ON_ERROR_STOP=1 "$@"
}
psql_ci < "$repo_dir/supabase/tests/sora_reward_pg_setup.sql"
psql_ci < "$repo_dir/supabase/sql/proposta/sora_500_daily_reward_REVIEW_ONLY.sql"

a='00000000-0000-4000-8000-000000000001'
b='00000000-0000-4000-8000-000000000002'
claims='{"app_metadata":{"provider":"google"},"is_anonymous":false}'
rpc(){
  local uid="$1" run="$2" score="$3"
  psql_ci -c "set role authenticated; set request.jwt.claim.sub='$uid'; set request.jwt.claims='$claims'; select public.sora_run_finish('$run'::uuid,$score);"
}
check(){
  local expr="$1"
  [[ "$(psql_ci -c "select case when ($expr) then 'ok' else 'fail' end;")" == 'ok' ]]
}

# Uma corrida com 600m e duração plausível recebe +25 somente uma vez.
first="$(rpc "$a" '30000000-0000-4000-8000-000000000001' 600)"
[[ "$first" == *'"stars_credited": 25'* ]]
check "(select stars from public.players where id='$a')=125"
check "(select count(*) from public.star_log where user_id='$a' and reason='sora_500')=1"
check "(select count(*) from private.sora_daily_500_rewards where player_id='$a')=1"

# Mesmo UUID não volta a pontuar nem a creditar.
if rpc "$a" '30000000-0000-4000-8000-000000000001' 600 2>/dev/null; then
  echo 'Duplicate Sora finish unexpectedly accepted' >&2
  exit 1
fi
check "(select stars from public.players where id='$a')=125"

# Outra partida no mesmo dia entra no ranking, mas não credita novamente.
psql_ci -c "insert into private.sora_runs values
  ('30000000-0000-4000-8000-000000000003','$a',clock_timestamp()-interval '20 seconds');"
second="$(rpc "$a" '30000000-0000-4000-8000-000000000003' 750)"
[[ "$second" == *'"stars_credited": 0'* && "$second" == *'"reward_claimed_today": true'* ]]
check "(select stars from public.players where id='$a')=125"
check "(select count(*) from private.sora_daily_500_rewards where player_id='$a')=1"

# 500m alegados em <10 segundos podem ser recorde (limite antigo), não recompensa.
short="$(rpc "$b" '30000000-0000-4000-8000-000000000002' 500)"
[[ "$short" == *'"stars_credited": 0'* ]]
check "(select stars from public.players where id='$b')=100"
check "(select count(*) from public.star_log where user_id='$b' and reason='sora_500')=0"

# UUID de outra conta é recusado sem consumir a partida alheia.
psql_ci -c "insert into private.sora_runs values
  ('30000000-0000-4000-8000-000000000004','$b',clock_timestamp()-interval '20 seconds');"
if rpc "$a" '30000000-0000-4000-8000-000000000004' 600 2>/dev/null; then
  echo 'Wrong owner unexpectedly accepted' >&2
  exit 1
fi
third="$(rpc "$b" '30000000-0000-4000-8000-000000000004' 600)"
[[ "$third" == *'"stars_credited": 25'* ]]
check "(select stars from public.players where id='$b')=125"
check "(select coalesce(sum(delta),0) from public.star_log where reason='sora_500')=50"
check "(select count(*) from private.sora_daily_500_rewards)=2"
echo '✓ PostgreSQL Sora reward: account, validity, single credit/day, UUID, ledger'
