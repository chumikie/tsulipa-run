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

# Prior-day Center credits are excluded. Today's 90 leave only 10.
rpc "$user_b" '10000000-0000-4000-8000-000000000003' 100 30

# Wrong owner cannot consume D's run; its legitimate owner can.
rpc "$user_b" '10000000-0000-4000-8000-000000000006' 100 35
rpc "$user_d" '10000000-0000-4000-8000-000000000006' 100 35
rpc "$user_d" '10000000-0000-4000-8000-000000000006' 100 35

# Expired run and impossible score cannot grant stars.
rpc "$user_c" '10000000-0000-4000-8000-000000000004' 100 50
rpc "$user_c" '10000000-0000-4000-8000-000000000005' 300000 50

db_psql < "$repo_dir/supabase/tests/center_run_pg_checks.sql"
