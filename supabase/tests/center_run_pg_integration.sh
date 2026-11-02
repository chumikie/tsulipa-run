#!/usr/bin/env bash
set -euo pipefail
# Usage: bash supabase/tests/center_run_pg_integration.sh <GitHub-service-container-ID>
# Only the temporary postgres:16 service created by this workflow is used.
db_container="${1:?PostgreSQL CI service container ID required}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

db_psql(){
  docker exec -i "$db_container" psql -U postgres -d center_run_test -v ON_ERROR_STOP=1 "$@"
}
db_psql < "$repo_dir/supabase/tests/center_run_pg_setup.sql"
db_psql < "$repo_dir/supabase/sql/center_run_daily_100_REVIEW_ONLY.sql"

rpc(){
  local owner="$1" run_id="$2" score="$3" stars="$4"
  db_psql -c "set role authenticated; set request.jwt.claim.sub='$owner'; select public.terminar_corrida('$run_id'::uuid,$score,$stars,'Tsu','device-123456');"
}
user_a='00000000-0000-4000-8000-000000000001'
user_b='00000000-0000-4000-8000-000000000002'
user_c='00000000-0000-4000-8000-000000000003'
user_d='00000000-0000-4000-8000-000000000004'

# Two genuinely separate PostgreSQL sessions compete for the same account's lock.
rpc "$user_a" '10000000-0000-4000-8000-000000000001' 100 70 &
first=$!
rpc "$user_a" '10000000-0000-4000-8000-000000000002' 100 70 &
second=$!
wait "$first"
wait "$second"

# A valid third run after the cap is reached must signal the dedicated reason.
cap_result="$(rpc "$user_a" '10000000-0000-4000-8000-000000000007' 100 70)"
if [[ "$cap_result" != *'"creditadas" : 0'* || "$cap_result" != *'"limite_diario" : true'* ]]; then
  echo 'Expected zero-credit valid run with limite_diario=true' >&2
  exit 1
fi

# Prior-day Center credits are excluded. Today's 90 leave only 10,
# and a partial credit must announce the reached cap.
partial_result="$(rpc "$user_b" '10000000-0000-4000-8000-000000000003' 100 30)"
if [[ "$partial_result" != *'"creditadas" : 10'* || "$partial_result" != *'"limite_diario" : true'* ]]; then
  echo 'Expected partial +10 credit with limite_diario=true' >&2
  exit 1
fi

# Wrong owner cannot consume D's run; its legitimate owner can.
rpc "$user_b" '10000000-0000-4000-8000-000000000006' 100 35
rpc "$user_d" '10000000-0000-4000-8000-000000000006' 100 35
rpc "$user_d" '10000000-0000-4000-8000-000000000006' 100 35

# Expired run and impossible score cannot grant stars.
rpc "$user_c" '10000000-0000-4000-8000-000000000004' 100 50
rpc "$user_c" '10000000-0000-4000-8000-000000000005' 300000 50

db_psql < "$repo_dir/supabase/tests/center_run_pg_checks.sql"

# Second phase: instrument a TEST COPY of the exact review-only SQL function.
# Replace only clock reads in the disposable container; no production SQL differs.
db_psql < "$repo_dir/supabase/tests/center_run_pg_midnight_setup.sql"
sed 's/now()/public.center_test_now()/g' "$repo_dir/supabase/sql/center_run_daily_100_REVIEW_ONLY.sql" | db_psql

rpc_clock(){
  local owner="$1" run_id="$2" clock="$3" score="$4" stars="$5"
  db_psql -c "set role authenticated; set request.jwt.claim.sub='$owner'; set center_test.now='$clock'; select public.terminar_corrida('$run_id'::uuid,$score,$stars,'Tsu','device-123456');"
}
user_e='00000000-0000-4000-8000-000000000005'
before_midnight='2026-11-02 02:59:59+00'
after_midnight='2026-11-02 03:00:01+00'

# Hold the real players row lock while a separate RPC, with a fixed transaction
# clock before midnight, waits. An independent observer advances the simulated
# wall clock across midnight; the blocked transaction must retain its original day.
db_psql -c "begin; select id from public.players where id='$user_e' for update; select pg_sleep(2); commit;" >/dev/null &
lock_holder=$!
sleep 0.25
rpc_clock "$user_e" '10000000-0000-4000-8000-000000000008' "$before_midnight" 100 30 &
blocked_rpc=$!
sleep 0.25
db_psql -c "update public.center_test_wall set ts='$after_midnight';"
wait "$blocked_rpc"
wait "$lock_holder"

# These runs START before midnight but finish in the new Sao Paulo day.
# Their day-2 allowance is fresh; a partially credited run reaches 100.
rpc_clock "$user_e" '10000000-0000-4000-8000-000000000009' "$after_midnight" 100 70
partial_next_day="$(rpc_clock "$user_e" '10000000-0000-4000-8000-000000000010' "$after_midnight" 100 40)"
if [[ "$partial_next_day" != *'"creditadas" : 30'* || "$partial_next_day" != *'"limite_diario" : true'* ]]; then
  echo 'Expected next-day partial +30 with cap flag true' >&2
  exit 1
fi
# Duplicate finalized UUID cannot earn more nor append a second ranking entry.
rpc_clock "$user_e" '10000000-0000-4000-8000-000000000010' "$after_midnight" 100 40

db_psql < "$repo_dir/supabase/tests/center_run_pg_midnight_checks.sql"
