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

falha(){ echo "FALHOU: $*" >&2; exit 1; }
a='00000000-0000-4000-8000-0000000000a1'
b='00000000-0000-4000-8000-0000000000b2'

como(){ local uid="$1"; shift; db -c "set role authenticated; set request.jwt.claim.sub='$uid'; $*"; }

db < "$repo_dir/supabase/tests/auditoria_20261120_pg_setup.sql"
[[ "$(db -c "select to_regprocedure('public.mini_run_start(text)') is null")" == t ]] || falha 'backend antigo esperado'
[[ "$(como "$a" "select public.ganhar_minijogo(1)->>'fixture'")" == true ]] || falha 'contrato antigo antes da troca'
for arq in "$repo_dir"/supabase/migrations/20261120{15,16,17,20}0000_*.sql; do db < "$arq"; done
# colunas que a produção já tem e as migrações de 21/11 usam
db -c "alter table public.players add column if not exists created_at timestamptz not null default now(), add column if not exists insignias_extra text[], add column if not exists nuvem_visual jsonb, add column if not exists avatar jsonb"
db -c "alter table public.players add column if not exists corridas_total integer"
db < "$repo_dir/supabase/migrations/20261121120000_convite_e_concurso_visual.sql"
db -c "alter table public.duo_log add column if not exists para uuid"
db -c "create table public.t_album(user_id uuid primary key, n int)"
db -c "create or replace function public.album_cards() returns json language sql stable as \$\$ select coalesce(json_agg(json_build_object('vezes', 1)), '[]'::json) from generate_series(1, coalesce((select n from public.t_album where user_id = auth.uid()), 0)) \$\$"
db < "$repo_dir/supabase/migrations/20261121150000_duetos_metas_recorde_semana.sql"

# 1) ranking antigo fechado para leitura direta
[[ "$(db -c "select has_table_privilege('anon','public.leaderboard','select')")" == f ]] || falha 'anon ainda lê leaderboard'
[[ "$(db -c "select has_table_privilege('authenticated','public.leaderboard','select')")" == f ]] || falha 'authenticated ainda lê leaderboard'
# 2) sem escrita direta
[[ "$(db -c "select has_table_privilege('authenticated','public.players','update')")" == f ]] || falha 'authenticated ainda altera players'
[[ "$(db -c "select has_table_privilege('anon','public.star_log','insert')")" == f ]] || falha 'anon ainda insere em star_log'
# 3) RPCs só com login
[[ "$(db -c "select has_function_privilege('anon','public.encontro_hoje(integer)','execute')")" == f ]] || falha 'anon executa encontro_hoje'
[[ "$(db -c "select has_function_privilege('anon','public.camarim_coracao(text)','execute')")" == f ]] || falha 'anon executa camarim_coracao'
# 4) O site antigo funciona no banco expandido, inclusive em rollback antes do corte.
[[ "$(como "$a" "select public.ganhar_minijogo(1)->>'fixture'")" == true ]] || falha 'frontend antigo incompatível'
[[ "$(db -c "select has_function_privilege('anon','public.mini_run_start(text)','execute')")" == f ]] || falha 'anon inicia minijogo'
# 5) Crédito validado pela partida.

# partida curta demais não dá estrela
run="$(como "$a" "select (public.mini_run_start('ritmo')->>'run')")"
r="$(como "$a" "select public.mini_run_finish('$run'::uuid, 40)")"
[[ "$r" == *'"partida"'* ]] || falha "partida de 0 s foi aceita: $r"

# partida de 46 s: até ★40, uma vez só
run="$(como "$a" "select (public.mini_run_start('ritmo')->>'run')")"
db -c "update private.mini_runs set started_at = now() - interval '46 seconds' where id = '$run'"
r="$(como "$a" "select public.mini_run_finish('$run'::uuid, 999)")"
[[ "$r" == *'"dadas" : 40'* ]] || falha "esperava ★40: $r"
[[ "$(como "$a" "select public.mini_run_finish('$run'::uuid,1)->>'dadas'")" == 40 ]] || falha 'recibo da confirmação'
[[ "$(db -c "select count(*) from public.star_log where user_id='$a' and reason='minijogo'")" == 1 ]] || falha 'a mesma partida pagou duas vezes'

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

# Resgates, isolamento de conta, moderação e cancelamento.
[[ "$(como "$b" "select public.show_sabado_marcar()->>'erro'")" == cantar ]] || falha 'show sem partida válida'
[[ "$(como "$a" "select public.show_sabado_marcar()->>'premio'")" == 20 ]] || falha 'show sem prêmio'
[[ "$(como "$a" "select public.show_sabado_marcar()->>'erro'")" == feito ]] || falha 'show duplicado'
[[ "$(como "$a" "select public.festa_resgatar()->>'item'")" == tema_natal ]] || falha 'item da festa'
[[ "$(como "$a" "select public.festa_resgatar()->>'erro'")" == feito ]] || falha 'festa duplicada'
[[ "$(db -c "select stars from public.players where id='$a'")" == 170 ]] || falha 'saldo após resgates'
[[ "$(como "$a" "select public.retro_mes('2026-11-01')->>'melhor'")" == 321 ]] || falha 'retrospectiva de A'
[[ "$(como "$b" "select public.retro_mes('2026-11-01')->>'melhor'")" == 123 ]] || falha 'retrospectiva de B'
[[ "$(db -c "select has_function_privilege('anon','public.retro_mes(date)','execute')")" == f ]] || falha 'visitante lê retrospectiva'
# corridas do mês também pelo extrato (o leaderboard é podado pela limpeza semanal)
db -c "insert into public.star_log(user_id, delta, reason, created_at) select '$a', 5, 'corrida', timestamptz '2026-11-05 15:00-03' from generate_series(1,7)"
[[ "$(como "$a" "select (public.retro_mes('2026-11-01')->>'corridas')::int >= 7")" == t ]] || falha 'retrospectiva ignora corridas do extrato'
[[ "$(como "$a" "select public.recado_tsulipa_enviar('Mensagem de teste')->>'ok'")" == true ]] || falha 'recado não salvo'
[[ "$(como "$a" "select public.admin_recados_tsulipa()->>'erro'")" == admin ]] || falha 'jogador acessa moderação'
recado="$(como "$b" "select public.admin_recados_tsulipa()->'recados'->0->>'id'")"
[[ "$(como "$b" "select public.admin_recados_tsulipa($recado)->>'novos'")" == 0 ]] || falha 'moderador não marcou como lido'
[[ "$(como "$a" "select public.email_mensal(true)->>'ligado'")" == true ]] || falha 'preferência de email'
[[ "$(db -c "set role service_role; select json_array_length(public.email_mensal_pacote('2026-11-01'))")" == 1 ]] || falha 'lista de inscrição'
[[ "$(como "$a" "select public.email_mensal(false)->>'ligado'")" == false ]] || falha 'cancelamento da inscrição'
[[ "$(db -c "set role service_role; select json_array_length(public.email_mensal_pacote('2026-11-01'))")" == 0 ]] || falha 'lista após cancelamento'

db < "$repo_dir/supabase/sql/proposta/encerrar_credito_legado_camarim.sql"
[[ "$(db -c "select has_function_privilege('authenticated','public.ganhar_minijogo(integer)','execute')")" == f ]] || falha 'contrato antigo disponível após corte'
run="$(como "$a" "select public.mini_run_start('ritmo')->>'run'")"
[[ -n "$run" ]] || falha 'início indisponível após corte'
db -c "update private.mini_runs set started_at = now() - interval '46 seconds' where id = '$run'"
[[ "$(como "$a" "select public.mini_run_finish('$run'::uuid, 40)->>'dadas'")" == 0 ]] || falha 'confirmação com teto atingido indisponível após corte'
echo 'auditoria 20/11/2026: três migrações e transição verificadas'

# ── 21/11/2026: convite com prêmio ──
c='00000000-0000-4000-8000-0000000000c3'
db -c "insert into public.players(id, nick, stars, created_at) values ('$c', 'Nova', 0, now())"
cod="$(como "$a" "select public.convite_meu()->>'codigo'")"
[[ "$cod" =~ ^[A-Z2-9]{6}$ ]] || falha "código de convite: $cod"
[[ "$(como "$a" "select public.convite_meu()->>'codigo'")" == "$cod" ]] || falha 'código muda a cada chamada'
[[ "$(como "$a" "select public.convite_aceitar('$cod')->>'erro'")" == proprio ]] || falha 'aceitou o próprio convite'
[[ "$(db -c "set role anon; select has_function_privilege('anon','public.convite_meu()','execute')")" == f ]] || falha 'visitante pede código'
db -c "update public.players set created_at = now() - interval '30 days' where id = '$b'"
[[ "$(como "$b" "select public.convite_aceitar('$cod')->>'erro'")" == conta_antiga ]] || falha 'conta antiga aceitou convite'
[[ "$(como "$c" "select public.convite_aceitar(lower('$cod'))->>'ok'")" == true ]] || falha 'conta nova não aceitou'
[[ "$(como "$c" "select public.convite_aceitar('$cod')->>'erro'")" == ja_aceito ]] || falha 'aceitou duas vezes'
[[ "$(como "$c" "select public.convite_conferir()->>'falta'")" == corrida ]] || falha 'pagou sem corrida'
db -c "update public.players set corridas_total = 1 where id = '$c'"
sa="$(db -c "select stars from public.players where id='$a'")"
[[ "$(como "$c" "select public.convite_conferir()->>'premio'")" == 30 ]] || falha 'convidada sem prêmio'
[[ "$(db -c "select stars from public.players where id='$a'")" == "$((sa + 30))" ]] || falha 'madrinha sem prêmio'
[[ "$(db -c "select 'convite' = any(insignias_extra) from public.players where id='$a'")" == t ]] || falha 'insígnia do convite'
[[ "$(como "$c" "select public.convite_conferir()->>'agora'")" == "" ]] || falha 'pagou duas vezes'
[[ "$(db -c "select count(*) from public.star_log where reason='convite'")" == 2 ]] || falha 'extrato do convite'

# ── 21/11/2026: concurso de visual da semana ──
db -c "update public.players set nuvem_visual = '{\"cu2\":{\"hair\":\"#ff6fb5\",\"back\":\"onduladom2\",\"lado2\":\"#ffffff\",\"x\":\"<script>\",\"det\":\"$(printf 'a%.0s' {1..40})\"}}' where id in ('$a','$b','$c')"
[[ "$(como "$a" "select public.concurso_inscrever()->>'ok'")" == true ]] || falha 'inscrição'
[[ "$(db -c "select visual ? 'x' or visual ? 'det' from private.concurso_inscricoes where user_id='$a'")" == f ]] || falha 'visual sem limpeza'
[[ "$(db -c "select visual->>'lado2' from private.concurso_inscricoes where user_id='$a'")" == '#ffffff' ]] || falha 'lado2 do bicolor no concurso'
como "$b" "select public.concurso_inscrever()" >/dev/null
[[ "$(como "$a" "select public.concurso_votar('$(db -c "select nick from public.players where id='$a'")')->>'erro'")" == proprio ]] || falha 'votou em si'
nb="$(db -c "select nick from public.players where id='$b'")"
[[ "$(como "$c" "select public.concurso_votar('$nb')->>'votei'")" == true ]] || falha 'voto'
[[ "$(como "$c" "select public.concurso_votar('$nb')->>'votei'")" == false ]] || falha 'desfazer voto'
como "$c" "select public.concurso_votar('$nb')" >/dev/null
[[ "$(db -c "set role anon; select json_array_length(public.concurso_estado()->'inscritos')")" == 2 ]] || falha 'galeria do visitante'
[[ "$(db -c "set role anon; select has_function_privilege('anon','public.concurso_votar(text)','execute')")" == f ]] || falha 'visitante vota'
# a semana passa: as inscrições e votos vão para a semana anterior
db -c "update private.concurso_inscricoes set semana = semana - 7; update private.concurso_votos set semana = semana - 7"
[[ "$(como "$b" "select public.concurso_estado()->'anterior'->>'posso_resgatar'")" == true ]] || falha 'vencedor não pode resgatar'
[[ "$(como "$a" "select public.concurso_resgatar()->>'erro'")" == nao_venceu ]] || falha 'perdedor resgatou'
[[ "$(como "$b" "select public.concurso_resgatar()->>'premio'")" == 50 ]] || falha 'prêmio do concurso'
[[ "$(como "$b" "select public.concurso_resgatar()->>'erro'")" == feito ]] || falha 'resgatou duas vezes'
[[ "$(db -c "select 'look_semana' = any(insignias_extra) from public.players where id='$b'")" == t ]] || falha 'insígnia do concurso'
echo 'melhorias 21/11/2026: convite e concurso verificados'

# ── 21/11/2026: álbum de duetos, metas do álbum e recorde da semana ──
for i in 1 2 3 4; do db -c "insert into public.players(id, nick, stars, created_at) values ('00000000-0000-4000-8000-00000000d00$i', 'Par$i', 0, now())"; done
db -c "insert into public.duo_log(de, para, dia) select '$a', ('00000000-0000-4000-8000-00000000d00' || i)::uuid, current_date from generate_series(1,2) i"
[[ "$(como "$a" "select public.duo_album()->>'parceiros'")" == 2 ]] || falha 'parceiros do Duo'
[[ "$(como "$a" "select public.duo_album_resgatar(3)->>'erro'")" == falta ]] || falha 'resgatou duetos sem a meta'
db -c "insert into public.duo_log(de, para, dia) values ('$a', '00000000-0000-4000-8000-00000000d003', current_date), ('$a', '00000000-0000-4000-8000-00000000d003', current_date - 1), ('$a', '$a', current_date)"
[[ "$(como "$a" "select public.duo_album()->>'parceiros'")" == 3 ]] || falha 'parceiro repetido ou a si mesmo contou'
[[ "$(como "$a" "select public.duo_album_resgatar(3)->>'premio'")" == 10 ]] || falha 'prêmio dos 3 duetos'
[[ "$(como "$a" "select public.duo_album_resgatar(3)->>'erro'")" == feito ]] || falha 'duetos pagos duas vezes'
[[ "$(como "$a" "select public.duo_album_resgatar(4)->>'erro'")" == meta ]] || falha 'meta inventada'
db -c "insert into public.t_album values ('$a', 16)"
[[ "$(como "$a" "select public.album_metas()->>'achados'")" == 16 ]] || falha 'Idols no álbum'
[[ "$(como "$a" "select public.album_meta_resgatar(15)->>'premio'")" == 25 ]] || falha 'prêmio da meta de 15'
[[ "$(como "$a" "select public.album_meta_resgatar(30)->>'erro'")" == falta ]] || falha 'meta de 30 sem os Idols'
[[ "$(como "$b" "select public.album_meta_resgatar(5)->>'erro'")" == falta ]] || falha 'álbum de outra conta'
db -c "insert into public.leaderboard(user_id, score, created_at) values ('$a', 900, now()), ('$a', 5000, now() - interval '30 days')" 2>/dev/null || db -c "insert into public.leaderboard(user_id, score, created_at, char) values ('$a', 900, now(), 0), ('$a', 5000, now() - interval '30 days', 0)"
db -c "insert into private.sora_history(player_id, score, finished_at) values ('$a', 321, now())"
[[ "$(como "$a" "select (public.meu_recorde_semana()->>'run') || '/' || (public.meu_recorde_semana()->>'sora')")" == 900/321 ]] || falha 'recorde da semana'
[[ "$(db -c "set role anon; select has_function_privilege('anon','public.meu_recorde_semana()','execute')")" == f ]] || falha 'visitante lê recorde'
echo 'melhorias 21/11/2026 (parte 2): duetos, metas e recorde da semana verificados'
