#!/bin/sh
# Teste ISOLADO do Bloom⭐Garden! (PostgreSQL local). Nunca aponte para produção.
set -e
cd "$(dirname "$0")"
DB=bloom_teste_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P <<'SQL' >/dev/null
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.players(id uuid primary key, nick text, stars int not null default 0, bloqueado boolean default false, updated_at timestamptz);
create table public.star_log(user_id uuid, delta int, reason text);
create table private.dia_teste(d date);
insert into private.dia_teste values ('2026-11-13');
create function public.hoje_br() returns date language sql stable set search_path to 'public' as $$ select d from private.dia_teste $$;
insert into public.players(id,nick,stars) values ('00000000-0000-0000-0000-00000000000a','Ana',100),('00000000-0000-0000-0000-00000000000b','Bia',10);
SQL
$P -f ../../sql/proposta/20261113_bloom_garden.sql >/dev/null
A=00000000-0000-0000-0000-00000000000a; B=00000000-0000-0000-0000-00000000000b
r(){ $P -c "select set_config('request.jwt.claim.sub','$1',false);" -c "$2" | tail -1; }
dia(){ $P -c "update private.dia_teste set d='$1'" >/dev/null; }
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio '$1')"; exit 1; }; }
ok "$(r '' "select public.jardim_estado()->>'erro'")" sem_conta "sem conta"
ok "$(r $A "select json_array_length(public.jardim_estado()->'canteiros')")" 0 "começa vazio"
ok "$(r $A "select public.jardim_plantar(0,'sakura')->>'stars'")" 80 "plantar sakura custa ★20"
ok "$(r $A "select public.jardim_plantar(0,'tulipa')->>'erro'")" ocupado "canteiro ocupado"
ok "$(r $A "select public.jardim_plantar(4,'tulipa')->>'erro'")" canteiro "canteiro inválido"
ok "$(r $A "select public.jardim_plantar(1,'rosa')->>'erro'")" semente "semente inválida"
ok "$(r $B "select public.jardim_plantar(0,'tulipa')->>'erro'")" estrelas "sem ★ suficiente não planta"
ok "$($P -c "select stars from public.players where id='$B'")" 10 "saldo de quem não pôde intacto"
ok "$(r $A "select public.jardim_colher(0)->>'erro'")" cedo "não colhe antes de florir"
ok "$(r $A "select public.jardim_regar(0)->>'regas'")" 1 "1ª rega"
ok "$(r $A "select public.jardim_regar(0)->>'erro'")" hoje "só 1 rega por dia"
dia 2026-11-14
ok "$(r $A "select public.jardim_regar(0)->>'regas'")" 2 "rega no dia seguinte"
dia 2026-11-15
ok "$(r $A "select public.jardim_regar(0)->>'erro'")" florido "flor pronta não rega mais"
ok "$(r $A "select public.jardim_colher(0)->>'qtd'")" 1 "colhe 1 sakura"
ok "$(r $A "select public.jardim_estado()->'flores'->>'sakura'")" 1 "flor guardada na conta"
ok "$(r $A "select json_array_length(public.jardim_estado()->'canteiros')")" 0 "canteiro livre de novo"
ok "$(r $A "select public.jardim_regar(2)->>'erro'")" vazio "regar canteiro vazio"
ok "$($P -c "select sum(delta)||'/'||count(*) from public.star_log where reason='jardim_semente'")" "-20/1" "star_log só com o gasto"
ok "$($P -c "select count(*) from public.star_log where delta>0")" 0 "o jardim nunca dá ★"
ok "$($P -c "select has_function_privilege('anon','public.jardim_plantar(int,text)','execute')")" f "anon não planta"
ok "$($P -c "select has_table_privilege('authenticated','private.jardim_canteiros','select')")" f "tabelas fora da API"
# concorrência: dois plantios ao mesmo tempo com ★ para só um
$P -c "update public.players set stars=30 where id='$B'" >/dev/null
( $P -c "begin; select set_config('request.jwt.claim.sub','$B',false); select public.jardim_plantar(0,'tulipa')->>'ok'; select pg_sleep(1); commit;" > c1.out ) &
sleep .3
r $B "select coalesce(public.jardim_plantar(1,'tulipa')->>'erro','ok')" > c2.out
wait
ok "$(tail -1 c2.out)" estrelas "plantio simultâneo sem ★ para os dois: só um passa"
ok "$($P -c "select stars from public.players where id='$B'")" 0 "saldo nunca fica negativo"
rm -f c1.out c2.out
echo "OK: Bloom⭐Garden! testado em PostgreSQL isolado"
