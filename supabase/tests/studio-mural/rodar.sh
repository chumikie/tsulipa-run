#!/bin/sh
# Teste ISOLADO do Mural do Photo⭐Studio!. Nunca aponte para produção.
set -e
cd "$(dirname "$0")"
DB=mural_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P <<'SQL' >/dev/null
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.players(id uuid primary key, nick text, avatar jsonb, stars int not null default 0, bloqueado boolean default false, updated_at timestamptz);
create table public.star_log(user_id uuid, delta int, reason text);
create table private.dia_teste(d date); insert into private.dia_teste values ('2026-11-14');  -- sábado
create function public.hoje_br() returns date language sql stable as $$ select d from private.dia_teste $$;
create table private.bonus_jogo_dia(user_id uuid not null, jogo text not null, dia date not null, run_id uuid not null, em timestamptz default now(), primary key(user_id,jogo,dia), constraint bonus_jogo_dia_jogo_check check (jogo in ('cafe','hand','duo')));
create table private.jardim_flores(user_id uuid, flor text, qtd int, primary key(user_id,flor));
insert into public.players(id,nick,avatar) values ('00000000-0000-0000-0000-00000000000a','Ana','{"c":{}}'),('00000000-0000-0000-0000-00000000000b','Bia','{}'),('00000000-0000-0000-0000-00000000000c','Cai','{}'),('00000000-0000-0000-0000-00000000000d','Duda','{}');
update public.players set bloqueado=true where nick='Duda';
SQL
$P -f ../../sql/aplicado/20261114_photo_studio.sql >/dev/null
$P -f ../../sql/aplicado/20261114_studio_mural.sql >/dev/null
A=00000000-0000-0000-0000-00000000000a; B=00000000-0000-0000-0000-00000000000b; C=00000000-0000-0000-0000-00000000000c
r(){ $P -c "select set_config('request.jwt.claim.sub','$1',false);" -c "$2" | tail -1; }
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio '$1')"; exit 1; }; }
F='{"fundo":"rosa","pose":"v","luz":"suave","quadro":"meio","objeto":"nenhum","extra":"<script>"}'
ok "$(r '' "select public.studio_publicar('$F')->>'erro'")" sem_conta "sem conta não publica"
IDA=$(r $A "select public.studio_publicar('$F')->>'id'"); [ -n "$IDA" ] && echo "  ok: Ana publicou" || exit 1
ok "$(r $A "select public.studio_publicar('$F')->>'erro'")" ja_publicou "1 por dia"
ok "$($P -c "select escolhas ? 'extra' from private.studio_mural where id=$IDA")" f "só as 5 escolhas conhecidas são guardadas"
ok "$(r $B "select public.studio_publicar('{\"fundo\":\"praia\",\"pose\":\"v\",\"luz\":\"suave\",\"quadro\":\"meio\",\"objeto\":\"nenhum\"}')->>'erro'")" escolhas "escolha fora da lista"
IDB=$(r $B "select public.studio_publicar('$F')->>'id'")
ok "$(r $A "select public.studio_curtir($IDA)->>'erro'")" propria "não curte a própria"
ok "$(r $B "select public.studio_curtir($IDA)->>'coracoes'")" 1 "Bia curte a de Ana"
ok "$(r $B "select public.studio_curtir($IDA)->>'coracoes'")" 1 "curtir de novo não soma"
ok "$(r $C "select public.studio_curtir($IDA)->>'coracoes'")" 2 "Cai também curte"
ok "$(r $C "select public.studio_curtir(999999)->>'erro'")" post "post inexistente"
ok "$(r $B "select (public.studio_mural()->0->>'nick')||' '||(public.studio_mural()->0->>'coracoes')||' '||(public.studio_mural()->0->>'curti')")" "Ana 2 true" "mural: mais curtida primeiro, com 'curti'"
ok "$(r '' "select public.studio_mural()::text")" "[]" "mural sem conta: vazio"
$P -c "update public.players set bloqueado=true where nick='Ana'" >/dev/null
ok "$(r $B "select json_array_length(public.studio_mural())")" 1 "conta bloqueada some do mural"
$P -c "update public.players set bloqueado=false where nick='Ana'" >/dev/null
ok "$(r $B "select (public.studio_capa()->>'nick')||' '||(public.studio_capa()->>'fechada')")" "Ana false" "capa parcial da semana atual"
$P -c "update private.dia_teste set d='2026-11-17'" >/dev/null   # terça da semana seguinte
ok "$(r $B "select (public.studio_capa()->>'nick')||' '||(public.studio_capa()->>'fechada')")" "Ana true" "na semana seguinte vira a capa da semana passada"
ok "$(r $B "select json_array_length(public.studio_mural())")" 0 "mural novo a cada semana"
ok "$(r $C "select public.studio_curtir($IDA)->>'erro'")" post "não curte post de semana passada"
ok "$($P -c "select count(*) from public.star_log")" 0 "mural não mexe em ★"
ok "$($P -c "select has_function_privilege('anon','public.studio_mural()','execute')")" f "anon não lê o mural"
echo "OK: Mural do Photo⭐Studio! testado em PostgreSQL isolado"
