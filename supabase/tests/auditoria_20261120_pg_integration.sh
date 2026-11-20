#!/usr/bin/env bash
set -euo pipefail
# Migração de auditoria de 20/11/2026 contra um PostgreSQL descartável.
# Uso no CI:  bash supabase/tests/auditoria_20261120_pg_integration.sh <ID do container postgres>
# Uso local:  PGHOST=/tmp/pg PGPORT=55432 bash supabase/tests/auditoria_20261120_pg_integration.sh local
alvo="${1:?container do PostgreSQL ou 'local'}"
repo_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
banco="auditoria_20261120_$$"

if [[ "$alvo" == local ]]; then
  psql -U postgres -d postgres -qc "create database $banco"
  db(){ psql -U postgres -d "$banco" -v ON_ERROR_STOP=1 -qAt "$@"; }
else
  docker exec -i "$alvo" psql -U postgres -d center_run_test -qc "create database $banco"
  db(){ docker exec -i "$alvo" psql -U postgres -d "$banco" -v ON_ERROR_STOP=1 -qAt "$@"; }
fi

{ cat "$repo_dir/supabase/tests/auditoria_20261120_pg_setup.sql"; cat "$repo_dir/supabase/migrations/20261120150000_auditoria_seguranca_20261120.sql"; } | db

falha(){ echo "FALHOU: $*" >&2; exit 1; }
a='00000000-0000-4000-8000-0000000000a1'
b='00000000-0000-4000-8000-0000000000b2'

# 1) ranking antigo fechado para leitura direta
[[ "$(db -c "select has_table_privilege('anon','public.leaderboard','select')")" == f ]] || falha 'anon ainda lê leaderboard'
[[ "$(db -c "select has_table_privilege('authenticated','public.leaderboard','select')")" == f ]] || falha 'authenticated ainda lê leaderboard'
# 2) sem escrita direta
[[ "$(db -c "select has_table_privilege('authenticated','public.players','update')")" == f ]] || falha 'authenticated ainda altera players'
[[ "$(db -c "select has_table_privilege('anon','public.star_log','insert')")" == f ]] || falha 'anon ainda insere em star_log'
# 3) RPCs só com login
[[ "$(db -c "select has_function_privilege('anon','public.encontro_hoje(integer)','execute')")" == f ]] || falha 'anon executa encontro_hoje'
[[ "$(db -c "select has_function_privilege('anon','public.camarim_coracao(text)','execute')")" == f ]] || falha 'anon executa camarim_coracao'
# 5) crédito antigo fechado; novo só com login
[[ "$(db -c "select has_function_privilege('authenticated','public.ganhar_minijogo(integer)','execute')")" == f ]] || falha 'ganhar_minijogo ainda aberto'
[[ "$(db -c "select has_function_privilege('anon','public.mini_run_start(text)','execute')")" == f ]] || falha 'anon inicia minijogo'

como(){ local uid="$1"; shift; db -c "set role authenticated; set request.jwt.claim.sub='$uid'; $*"; }

# partida curta demais não dá estrela
run="$(como "$a" "select (public.mini_run_start('ritmo')->>'run')")"
r="$(como "$a" "select public.mini_run_finish('$run'::uuid, 40)")"
[[ "$r" == *'"partida"'* ]] || falha "partida de 0 s foi aceita: $r"

# partida de 46 s: até ★40, uma vez só
run="$(como "$a" "select (public.mini_run_start('ritmo')->>'run')")"
db -c "update private.mini_runs set started_at = now() - interval '46 seconds' where id = '$run'"
r="$(como "$a" "select public.mini_run_finish('$run'::uuid, 999)")"
[[ "$r" == *'"dadas" : 40'* ]] || falha "esperava ★40: $r"
r="$(como "$a" "select public.mini_run_finish('$run'::uuid, 40)")"
[[ "$r" == *'"partida"'* ]] || falha "a mesma partida pagou duas vezes: $r"

# tempo limita: 20 s → no máximo ★20
run="$(como "$a" "select (public.mini_run_start('corda')->>'run')")"
db -c "update private.mini_runs set started_at = now() - interval '20 seconds' where id = '$run'"
r="$(como "$a" "select public.mini_run_finish('$run'::uuid, 25)")"
[[ "$r" == *'"dadas" : 10'* ]] || falha "teto diário de ★50 não respeitado (A já tinha ★40): $r"

# teto diário de B (★45 antes): só ★5
run="$(como "$b" "select (public.mini_run_start('corda')->>'run')")"
db -c "update private.mini_runs set started_at = now() - interval '40 seconds' where id = '$run'"
r="$(como "$b" "select public.mini_run_finish('$run'::uuid, 25)")"
[[ "$r" == *'"dadas" : 5'* ]] || falha "esperava ★5 para B: $r"

# partida de outra conta não paga
run="$(como "$a" "select (public.mini_run_start('corda')->>'run')")"
db -c "update private.mini_runs set started_at = now() - interval '40 seconds' where id = '$run'"
r="$(como "$b" "select public.mini_run_finish('$run'::uuid, 25)")"
[[ "$r" == *'"partida"'* ]] || falha "B usou a partida de A: $r"

# 6) recordes numa chamada só
r="$(como "$a" "select public.meus_recordes_jogos()")"
[[ "$r" == *'"hand"'* && "$r" == *'"cafe"'* ]] || falha "meus_recordes_jogos: $r"

# 7) sora_scores com chave primária e dado preservado
[[ "$(db -c "select count(*) from pg_constraint where conrelid='private.sora_scores'::regclass and contype='p'")" == 1 ]] || falha 'sora_scores sem PK'
[[ "$(db -c "select count(*) from private.sora_scores")" == 1 ]] || falha 'sora_scores perdeu linhas'

# saldo final: A 100+40+10, B 100+5
[[ "$(db -c "select stars from public.players where id='$a'")" == 150 ]] || falha 'saldo de A'
[[ "$(db -c "select stars from public.players where id='$b'")" == 105 ]] || falha 'saldo de B'

echo 'auditoria 20/11/2026: tudo certo'
