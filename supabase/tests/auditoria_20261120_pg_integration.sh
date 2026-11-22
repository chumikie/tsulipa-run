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
# o que a produção já tem e a parte 3 (economia) usa
db <<'SQL'
alter table public.players add column if not exists visuais text[], add column if not exists bonus_corrida text;
alter table public.gacha add column if not exists valor text, add column if not exists created_at timestamptz default now();
create table if not exists public.card_movimentos(user_id uuid, chave text, delta int, quando timestamptz default now());
create table if not exists private.gacha_po_saldo(user_id uuid primary key, saldo int not null default 0, alterado timestamptz);
create table if not exists private.gacha_po_log(user_id uuid, requisicao uuid, tipo text, nick text, delta int);
create table if not exists private.kt_ticket_wallet(player_id uuid primary key, balance int, updated_at timestamptz);
create table if not exists private.kt_ticket_events(player_id uuid, actor_id uuid, delta int, reason text);
create or replace function private.cards_qtd(u uuid, k text) returns int language sql stable as $f$
  select (select count(*) from public.gacha where user_id = u and tipo = 'card' and lower(btrim(valor)) = k)::int
       + coalesce((select sum(delta) from public.card_movimentos where user_id = u and chave = k), 0)::int $f$;
create or replace function public.gacha_card(n text) returns json language sql stable as $f$ select json_build_object('nick', n) $f$;
-- o esboço do setup devolvia só o preço; a produção devolve (preco, pontos)
drop function if exists public.visual_preco(text);
SQL
db < "$repo_dir/supabase/migrations/20261121180000_economia_e_estreia.sql"
db < "$repo_dir/supabase/migrations/20261121200000_sequencia_missoes.sql"
# o que a produção já tem e a parte 5 (conquistas no Perfil) usa
db -c "alter table public.players add column if not exists dias_jogados int, add column if not exists avatar jsonb, add column if not exists emoji text, add column if not exists cor text, add column if not exists frase text, add column if not exists oshi int, add column if not exists aniver date"
db -c "alter table private.battle_partidas add column if not exists vitoria boolean"
db < "$repo_dir/supabase/migrations/20261121220000_conquistas_perfil.sql"

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

# ── 21/11/2026 parte 3: economia e começo do jogo ──
n="00000000-0000-4000-8000-0000000000e1"
db -c "insert into public.players(id, nick, stars, created_at, visuais) values ('$n', 'Estreante', 0, now(), '{}')"
[[ "$(como "$n" "select public.kit_estreia_resgatar('roupa_rock')->>'erro'")" == item ]] || falha 'kit aceitou item caro'
[[ "$(como "$n" "select public.kit_estreia_resgatar('det_tulipa')->>'premio'")" == 100 ]] || falha 'kit de estreia'
[[ "$(db -c "select stars || ':' || ('det_tulipa' = any(visuais)) from public.players where id='$n'")" == '100:true' ]] || falha 'kit sem estrelas ou item'
[[ "$(como "$n" "select public.kit_estreia_resgatar('det_coelho')->>'erro'")" == feito ]] || falha 'kit duas vezes'
[[ "$(como "$n" "select public.trilha_estado()->>'ativa'")" == true ]] || falha 'trilha inativa para conta nova'
[[ "$(como "$n" "select public.trilha_resgatar('gacha')->>'erro'")" == falta ]] || falha 'trilha pagou passo não feito'
db -c "insert into public.gacha(user_id, dia, tipo, valor) values ('$n', public.hoje_br() - 1, 'estrelas', '5')"
[[ "$(como "$n" "select public.trilha_resgatar('gacha')->>'premio'")" == 20 ]] || falha 'passo do gacha'
db -c "insert into public.star_log(user_id, delta, reason) values ('$n', 50, 'corrida'), ('$n', 9, 'missao'), ('$n', -50, 'visual:fundo_oshi'); insert into public.duo_log(de, para, dia) values ('$n', '$a', current_date)"
for ps in corrida duo compra; do como "$n" "select public.trilha_resgatar('$ps')" >/dev/null; done
r="$(como "$n" "select public.trilha_resgatar('missao')")"
[[ "$(echo "$r" | grep -o '"fim" : true\|"fim":true')" != "" ]] || falha "trilha sem bônus final: $r"
[[ "$(db -c "select 'trilha' = any(insignias_extra) from public.players where id='$n'")" == t ]] || falha 'insígnia da trilha'
[[ "$(db -c "select sum(delta) from public.star_log where user_id='$n' and reason='trilha_estreia'")" == 140 ]] || falha 'total da trilha (5×20 + 40)'
[[ "$(como "$b" "select public.trilha_resgatar('corrida')->>'erro'")" == prazo ]] || falha 'trilha para conta antiga'
# primeiro resultado do dia nos outros jogos
# o setup fixa hoje_br() em 21/11/2026: as partidas entram nesse dia (com now() o teste quebrava a partir de 22/11)
db -c "insert into private.sora_history(player_id, score, finished_at) values ('$n', 120, (public.hoje_br() + time '12:00') at time zone 'America/Sao_Paulo'); insert into private.cafe_resultados(user_id, dia) values ('$n', public.hoje_br())"
[[ "$(como "$n" "select json_array_length(public.bonus_jogos_dia()->'pagos')")" == 2 ]] || falha 'bônus do dia (Sora e Café)'
[[ "$(como "$n" "select json_array_length(public.bonus_jogos_dia()->'pagos')")" == 0 ]] || falha 'bônus do dia pago duas vezes'
# promoção da semana: 30% só na roupa da semana; comprar_visual usa o mesmo preço
pk="$(db -c "select private.promo_item(public.hoje_br())")"
[[ "$(db -c "select (select preco from public.visual_preco('$pk')) * 10 = round((select preco from private.visual_preco_base('$pk')) * 7)")" == t ]] || falha "promoção de $pk"
[[ "$(db -c "select preco from public.visual_preco('fundo_oshi')")" == 60 ]] || falha 'preço normal mudou'
[[ "$(db -c "set role anon; select (public.promo_semana()->>'desconto')")" == 30 ]] || falha 'visitante não vê a promoção'
# gacha: começo garantido, card novo primeiro, garantia e pó 3
# datas pelo dia de Brasília (hoje_br), como o jogo: com current_date (UTC) o teste falhava das 21h à meia-noite (22/11)
db -c "update public.players set avatar = '{\"c\":{}}' where id <> '$n'"
g="00000000-0000-4000-8000-0000000000e2"
db -c "insert into public.players(id, nick, stars, created_at, avatar) values ('$g', 'Giradora', 0, now(), '{\"c\":{}}')"
for d in 3 2 1; do db -c "set request.jwt.claim.sub='$g'; select public.gacha_girar()" >/dev/null; db -c "update public.gacha set dia = dia - $d where user_id='$g' and dia = public.hoje_br()"; done
[[ "$(db -c "select count(*) filter (where tipo='card') || '/' || count(distinct lower(valor)) filter (where tipo='card') from public.gacha where user_id='$g'")" == 3/3 ]] || falha 'começo garantido com 3 Idols diferentes'
db -c "insert into public.gacha(user_id, dia, tipo, valor) values ('$g', public.hoje_br() - 30, 'estrelas', '5')"
db -c "update public.gacha g set dia = public.hoje_br() - 40 - x.n::int from (select ctid c, row_number() over () n from public.gacha where user_id='$g' and tipo='card') x where g.ctid = x.c"
db -c "insert into public.gacha(user_id, dia, tipo, valor) values ('$g', public.hoje_br() - 3, 'estrelas', '5'), ('$g', public.hoje_br() - 2, 'nada', '1'), ('$g', public.hoje_br() - 1, 'estrelas', '7')"
[[ "$(como "$g" "select public.gacha_girar()->>'tipo'")" == card ]] || falha 'garantia depois de 3 giros sem card'
db -c "insert into private.gacha_po_saldo(user_id, saldo) values ('$g', 3)"
faltando="$(como "$g" "select public.gacha_po_status()->'faltando'->0->>'nick'")"
[[ "$(como "$g" "select public.gacha_po_status()->>'custo_troca'")" == 3 ]] || falha 'custo do pó'
[[ "$(como "$g" "select public.gacha_resgatar_card('$faltando', gen_random_uuid())->>'po'")" == 0 ]] || falha 'troca de 3 pós'
echo 'melhorias 21/11/2026 (parte 3): economia, estreia e gacha verificados'
# ── 21/11/2026 parte 4: sequência das Missões ──
db -c "insert into public.missoes_feitas(user_id, k, dia) select '$c', 'm' || k, public.hoje_br() - d from generate_series(1,3) d, generate_series(1,3) k"
db -c "insert into public.missoes_feitas(user_id, k, dia) select '$c', 'm' || k, public.hoje_br() - 5 from generate_series(1,3) k"
r="$(como "$c" "select public.missoes_sequencia()")"
[[ "$(como "$c" "select (public.missoes_sequencia()->>'dias')")" == 3 ]] || falha "sequência de 3 dias (até ontem): $r"
[[ "$(db -c "select sum(delta) from public.star_log where user_id='$c' and reason='missao_sequencia'")" == 15 ]] || falha 'prêmio dos 3 dias pago uma vez'
db -c "insert into public.missoes_feitas(user_id, k, dia) select '$c', 'm' || k, public.hoje_br() - 4 from generate_series(1,2) k"
[[ "$(como "$c" "select (public.missoes_sequencia()->>'dias')")" == 3 ]] || falha 'dia com 2 missões quebrou a regra'
db -c "insert into public.missoes_feitas(user_id, k, dia) select '$c', 'm' || k, public.hoje_br() from generate_series(1,3) k"
[[ "$(como "$c" "select (public.missoes_sequencia()->>'hoje_ok')")" == true ]] || falha 'hoje conta'
[[ "$(como "$c" "select (public.missoes_sequencia()->>'dias')")" == 4 ]] || falha 'sequência com hoje'
echo 'melhorias 21/11/2026 (parte 4): sequência das Missões verificada'
# ── 21/11/2026 parte 5: conquistas e destaques do Perfil ──
db -c "create or replace function public.insignias(uuid) returns text[] language sql stable as \$\$ select case when \$1 = '$c' then array['estreia','maratona:2','amada'] else array[]::text[] end \$\$"
r="$(como "$c" "select public.salvar_destaques(array['amada','kami','maratona','amada'])")"
[[ "$(como "$c" "select public.salvar_destaques(array['amada','kami','maratona','amada'])->>'destaque'")" == '["amada","maratona"]' ]] || falha "destaques filtrados e sem repetir: $r"
[[ "$(como "$c" "select public.salvar_destaques(array['a','b','c','d','e','f'])->>'erro'")" == max ]] || falha 'no máximo 5 destaques'
nk="$(db -c "select nick from public.players where id='$c'")"
[[ "$(db -c "set role anon; select array_to_string(public.destaques_de(upper('$nk')), ',')")" == 'amada,maratona:2' ]] || falha 'destaques públicos com nível'
[[ "$(como "$c" "select (public.meu_progresso_conquistas()->'completo'->>'destaque')")" == true ]] || falha 'perfil completo conta destaque'
[[ "$(como "$c" "select (public.meu_progresso_conquistas()->>'corridas')::int >= 1")" == t ]] || falha 'contador de corridas'
[[ "$(db -c "select has_function_privilege('anon','public.meu_progresso_conquistas()','execute')")" == f ]] || falha 'progresso só para quem entrou'
[[ "$(como "$c" "select public.passatempo_feito('caca')->>'pago'")" == true ]] || falha 'passatempo pago'
[[ "$(como "$c" "select public.passatempo_feito('caca')->>'pago'")" == false ]] || falha 'passatempo pago só uma vez por dia'
[[ "$(como "$c" "select public.passatempo_feito('xadrez')->>'erro'")" == tipo ]] || falha 'tipo de passatempo validado'
[[ "$(db -c "select sum(delta) from public.star_log where user_id='$c' and reason='passatempo'")" == 5 ]] || falha 'passatempo ★5'
[[ "$(como "$c" "select public.passatempos_hoje()->>'feitos'")" == '["caca"]' ]] || falha 'passatempos de hoje'
echo 'melhorias 21/11/2026 (parte 5): conquistas, destaques e passatempos verificados'
# ── admin "Montar Idol" mantém o lado2 (bicolor) ──
db <<SQL
create table if not exists public.admins(user_id uuid primary key);
create table if not exists public.admin_log(admin uuid, acao text, alvo text, valor text, motivo text);
alter table public.players add column if not exists nuvem_ms bigint;
create or replace function public.eh_admin() returns boolean language sql stable as \$f\$ select auth.uid() = '$a'::uuid \$f\$;
update public.players set nuvem_visual = '{"cu2":{"back":"onduladom2","lado2":"#AA00FF"}}' where id = '$c';
SQL
base='"hair":"#ff7eb6","hair2":"#ffffff","eye":"#5a3b2e","skin":"#f5d0b5","outcol":"#ffffff","back":"onduladom2"'
r="$(como "$a" "select public.admin_montar_idol('$nk', '{$base}'::jsonb)")"
[[ "$(como "$a" "select public.admin_montar_idol('$nk', '{$base}'::jsonb)->'c'->>'lado2'")" == '#aa00ff' ]] || falha "lado2 mantido sem vir do formulário: $r"
[[ "$(como "$a" "select public.admin_montar_idol('$nk', '{$base,\"lado2\":\"#00ff88\"}'::jsonb)->'c'->>'lado2'")" == '#00ff88' ]] || falha 'lado2 do formulário'
[[ "$(db -c "select nuvem_visual->'admin_visual_override'->>'lado2' from public.players where id='$c'")" == '#00ff88' ]] || falha 'override com lado2'
[[ "$(como "$a" "select public.admin_montar_idol('$nk', '{$base,\"lado2\":\"azul\"}'::jsonb)->>'campo'")" == lado2 ]] || falha 'lado2 inválido recusado'
echo 'admin Montar Idol: bicolor (lado2) mantido'
db -c "insert into private.battle_partidas(player_id, dia, vitoria) values ('$c', public.hoje_br(), true), ('$c', public.hoje_br(), false), ('$c', public.hoje_br() - 30, true)"
[[ "$(como "$c" "select public.meu_recorde_semana()->>'battle'")" == 1 ]] || falha 'vitórias do Battle na semana'
echo 'melhor da semana: vitórias do Battle verificadas'

