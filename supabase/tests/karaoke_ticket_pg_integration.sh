#!/usr/bin/env bash
set -euo pipefail
# Invoked only by the disposable postgres:16 GitHub Actions service.
container="${1:?temporary postgres container ID required}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
psql_ticket(){ docker exec -i "$container" psql -X -U postgres -d karaoke_ticket_test -v ON_ERROR_STOP=1 -At "$@"; }
docker exec -i "$container" psql -X -U postgres -d postgres -v ON_ERROR_STOP=1 -c 'create database karaoke_ticket_test;'
psql_ticket < "$repo_dir/supabase/tests/karaoke_ticket_pg_setup.sql"
# The approved SQL is loaded verbatim except random() -> deterministic test RNG,
# which guarantees a ticket prize in the disposable Gacha scenario.
sed 's/random()/public.kt_test_random()/g' "$repo_dir/supabase/sql/karaoke_tickets_REVIEW_ONLY.sql" | psql_ticket
a='20000000-0000-4000-8000-000000000001'
admin='20000000-0000-4000-8000-000000000002'
c='20000000-0000-4000-8000-000000000003'
req='30000000-0000-4000-8000-000000000001'
req2='30000000-0000-4000-8000-000000000002'
rpc(){
  local owner="$1" expression="$2" is_admin="${3:-no}"
  psql_ticket -c "set role authenticated; set request.jwt.claim.sub='$owner'; set test.admin='$is_admin'; select ($expression)::text;"
}
expect(){
  local output="$1" fragment="$2" case_name="$3"
  if [[ "$output" != *"$fragment"* ]]; then
    echo "FAIL $case_name: missing $fragment in $output" >&2
    exit 1
  fi
}
result="$(rpc "$a" 'public.kt_ticket_wallet()')"
expect "$result" '"tickets": 0' 'wallet starts empty'
result="$(rpc "$a" 'public.kt_ticket_run_start('"'$req'"'::uuid)')"
expect "$result" '"reason": "free_available"' 'no early ticket debit'

result="$(rpc "$a" 'public.gacha_girar()')"
expect "$result" '"tipo": "ticket"' 'deterministic Gacha ticket'
result="$(rpc "$a" 'public.kt_ticket_wallet()')"
expect "$result" '"tickets": 1' 'Gacha credited wallet'

result="$(rpc "$c" "public.kt_ticket_admin_grant('Aiko',2,'unauthorized')")"
expect "$result" '"reason": "admin"' 'moderation ACL'
result="$(rpc "$admin" "public.kt_ticket_admin_grant('Aiko',2,'test')" yes)"
expect "$result" '"tickets": 3' 'moderator grant'
result="$(rpc "$a" "public.kt_ticket_gift('Pati')")"
expect "$result" '"tickets": 2' 'gift sender'
result="$(rpc "$c" 'public.kt_ticket_wallet()')"
expect "$result" '"tickets": 1' 'gift recipient'

for n in 1 2 3 4 5; do
  result="$(rpc "$a" 'public.kt_run_start(null)')"
  expect "$result" "\"used\": $n" "free show $n"
  expect "$result" '"kind": "free"' "free payment kind $n"
done
result="$(rpc "$a" 'public.kt_run_start(null)')"
expect "$result" '"reason": "limit"' 'sixth free rejected'
result="$(rpc "$a" "public.kt_ticket_run_start('$req'::uuid)")"
expect "$result" '"tickets": 1' 'sixth show ticket debit'
expect "$result" '"kind": "ticket"' 'sixth show kind'
result="$(rpc "$a" "public.kt_ticket_run_start('$req'::uuid)")"
expect "$result" '"resume": true' 'idempotent paid retry'
paid_run="$(psql_ticket -c "select id from private.kt_runs where player_id='$a' and ticket_request='$req';")"
result="$(rpc "$a" "public.kt_run_start('$paid_run'::uuid)")"
expect "$result" '"resume": true' 'paid resume via free RPC'

# Truly concurrent identical UUIDs, from separate PostgreSQL sessions.
rpc "$a" "public.kt_ticket_run_start('$req2'::uuid)" &
one=$!
rpc "$a" "public.kt_ticket_run_start('$req2'::uuid)" &
two=$!
wait "$one"
wait "$two"
result="$(rpc "$c" "public.kt_ticket_run_start('$req'::uuid)")"
expect "$result" '"reason": "free_available"' 'other account cannot spend before free quota'
psql_ticket < "$repo_dir/supabase/tests/karaoke_ticket_pg_checks.sql"
