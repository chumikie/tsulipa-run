#!/bin/sh
# Teste ISOLADO: flores com uso (Handshake) e Caderno do Café na conta. Nunca aponte para produção.
set -e
cd "$(dirname "$0")"
DB=flores_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P <<'SQL' >/dev/null
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.players(id uuid primary key, stars int default 0, bloqueado boolean default false, updated_at timestamptz);
create table public.star_log(user_id uuid, delta int, reason text);
create function public.hoje_br() returns date language sql stable as $$ select current_date $$;
create table private.cafe_receitas_comprovadas(user_id uuid, base int, enf int, primeiro_em timestamptz default now(), primary key(user_id,base,enf));
insert into public.players(id) values ('00000000-0000-0000-0000-00000000000a'),('00000000-0000-0000-0000-00000000000b');
insert into private.cafe_receitas_comprovadas(user_id,base,enf) values ('00000000-0000-0000-0000-00000000000a',2,1),('00000000-0000-0000-0000-00000000000a',0,3),('00000000-0000-0000-0000-00000000000b',4,0);
SQL
$P -f ../../sql/aplicado/20261113_bloom_garden.sql >/dev/null
$P -f ../../sql/aplicado/20261113_flores_e_caderno.sql >/dev/null
A=00000000-0000-0000-0000-00000000000a
$P -c "insert into private.jardim_flores(user_id,flor,qtd) values('$A','tulipa',2)" >/dev/null
r(){ $P -c "select set_config('request.jwt.claim.sub','$1',false);" -c "$2" | tail -1; }
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio '$1')"; exit 1; }; }
ok "$(r '' "select public.jardim_usar_flor('tulipa','handshake')->>'erro'")" sem_conta "sem conta"
ok "$(r $A "select public.jardim_usar_flor('tulipa','handshake')->>'qtd'")" 1 "usar 1 tulipa (sobra 1)"
ok "$(r $A "select public.jardim_usar_flor('tulipa','handshake')->>'qtd'")" 0 "usar a última"
ok "$(r $A "select public.jardim_usar_flor('tulipa','handshake')->>'erro'")" sem_flor "sem flor não usa"
ok "$(r $A "select public.jardim_usar_flor('sakura','handshake')->>'erro'")" sem_flor "flor que nunca colheu"
ok "$(r $A "select public.jardim_usar_flor('rosa','handshake')->>'erro'")" parametros "flor inválida"
ok "$(r $A "select public.jardim_usar_flor('tulipa','gacha')->>'erro'")" parametros "uso inválido"
ok "$($P -c "select count(*) from private.jardim_usos")" 2 "2 usos registrados"
ok "$($P -c "select qtd from private.jardim_flores where flor='tulipa'")" 0 "estoque nunca negativo"
ok "$(r $A "select public.cafe_caderno()::text")" '["0-3", "2-1"]' "caderno: só as receitas comprovadas da própria conta"
ok "$(r '' "select public.cafe_caderno()::text")" '[]' "caderno sem conta: vazio"
ok "$($P -c "select count(*) from public.star_log")" 0 "nenhuma estrela mexida"
ok "$($P -c "select has_function_privilege('anon','public.jardim_usar_flor(text,text)','execute')")" f "anon não usa flor"
echo "OK: flores com uso e Caderno na conta testados em PostgreSQL isolado"
