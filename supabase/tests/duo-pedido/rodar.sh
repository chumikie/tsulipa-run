#!/bin/sh
# Teste ISOLADO do prêmio do Pedido de cena do Moon⭐Duo!. Nunca aponte para produção.
set -e
cd "$(dirname "$0")"
DB=duo_pedido_teste_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P <<'SQL' >/dev/null
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.players(id uuid primary key, nick text, stars int not null default 0, bloqueado boolean default false, updated_at timestamptz);
create table public.star_log(user_id uuid, delta int, reason text);
create function public.hoje_br() returns date language sql stable set search_path to 'public' as $$ select (now() at time zone 'America/Sao_Paulo')::date $$;
create table public.duo_log(id bigserial primary key, de uuid references public.players(id), para uuid references public.players(id), cena text, dia date not null default public.hoje_br(), em timestamptz default now(), unique(de,para,cena,dia));
create table private.bonus_jogo_dia(user_id uuid not null references public.players(id), jogo text not null, dia date not null, run_id uuid not null, em timestamptz not null default clock_timestamp(), primary key(user_id,jogo,dia), constraint bonus_jogo_dia_jogo_check check (jogo in ('cafe','hand')));
insert into public.players(id,nick,stars) values ('00000000-0000-0000-0000-00000000000a','Ana',10),('00000000-0000-0000-0000-00000000000b','Bia',0),('00000000-0000-0000-0000-00000000000c','Cai',0);
update public.players set bloqueado=true where nick='Cai';
SQL
$P -f ../../sql/proposta/20261113_duo_pedido_premio.sql >/dev/null
r(){ $P -c "select set_config('request.jwt.claim.sub','$1',false);" -c "$2" | tail -1; }
A=00000000-0000-0000-0000-00000000000a; C=00000000-0000-0000-0000-00000000000c
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio $1)"; exit 1; }; }
ok "$(r '' "select public.duo_pedido_premio('praia')->>'erro'")" sem_conta "sem conta"
ok "$(r $A "select public.duo_pedido_premio('praia')->>'erro'")" sem_duo "sem duo hoje não paga"
ok "$(r $A "select public.duo_pedido_premio('Praia; drop')->>'erro'")" cena "cena inválida"
$P -c "insert into public.duo_log(de,para,cena) values('$A','00000000-0000-0000-0000-00000000000b','praia')" >/dev/null
ok "$(r $A "select public.duo_pedido_premio('lua')->>'erro'")" sem_duo "duo de outra cena não paga"
ok "$(r $A "select public.duo_pedido_premio('praia')->>'estrelas'")" 5 "cena pedida feita: ★5"
ok "$(r $A "select public.duo_pedido_premio('praia')->>'ja'")" true "segunda vez no dia: nada"
ok "$($P -c "select stars from public.players where id='$A'")" 15 "saldo +5 uma vez"
ok "$($P -c "select count(*)||'/'||sum(delta) from public.star_log where reason='bonus_duo'")" "1/5" "1 registro no star_log"
$P -c "insert into public.duo_log(de,para,cena) values('$C','$A','praia')" >/dev/null
ok "$(r $C "select public.duo_pedido_premio('praia')->>'erro'")" sem_conta "bloqueado não recebe"
ok "$($P -c "select has_function_privilege('anon','public.duo_pedido_premio(text)','execute')")" f "anon não executa"
ok "$($P -c "insert into private.bonus_jogo_dia(user_id,jogo,dia,run_id) values('$A','cafe',current_date,gen_random_uuid()) returning jogo")" cafe "bônus do Café continua aceito"
echo "OK: prêmio do Pedido de cena testado em PostgreSQL isolado"
