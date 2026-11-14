#!/bin/sh
# Teste ISOLADO do Photo⭐Studio! v1. Nunca aponte para produção.
set -e
cd "$(dirname "$0")"
DB=studio_$$; P="psql -X -q -tA -v ON_ERROR_STOP=1 -U postgres -d $DB"
createdb -U postgres "$DB"; trap 'dropdb -U postgres "$DB"' EXIT
$P <<'SQL' >/dev/null
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.players(id uuid primary key, stars int not null default 0, bloqueado boolean default false, updated_at timestamptz);
create table public.star_log(user_id uuid, delta int, reason text);
create table private.dia_teste(d date); insert into private.dia_teste values ('2026-11-14');
create function public.hoje_br() returns date language sql stable as $$ select d from private.dia_teste $$;
create table private.bonus_jogo_dia(user_id uuid not null references public.players(id), jogo text not null, dia date not null, run_id uuid not null,
  em timestamptz not null default clock_timestamp(), primary key(user_id,jogo,dia), constraint bonus_jogo_dia_jogo_check check (jogo in ('cafe','hand','duo')));
create table private.jardim_flores(user_id uuid, flor text, qtd int, primary key(user_id,flor));
insert into public.players(id,stars) values ('00000000-0000-0000-0000-00000000000a',10);
insert into private.jardim_flores values ('00000000-0000-0000-0000-00000000000a','tulipa',1);
SQL
$P -f ../../sql/aplicado/20261114_photo_studio.sql >/dev/null
A=00000000-0000-0000-0000-00000000000a
r(){ $P -c "select set_config('request.jwt.claim.sub','$1',false);" -c "$2" | tail -1; }
ok(){ [ "$1" = "$2" ] && echo "  ok: $3" || { echo "FALHOU: $3 (veio '$1')"; exit 1; }; }
PA=$(r $A "select public.studio_pauta()::text")
ok "$(echo "$PA" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['ok'],d['dia'],d['fundo'] in ['rosa','cortina','nuvens','neon'],d['pose'] in ['normal','v','coracao','tchau'],d['detalhe']['tipo'] in ['luz','quadro','objeto'])")" "True 2026-11-14 True True True" "pauta do dia válida"
ok "$(r $A "select public.studio_pauta()::text")" "$PA" "pauta igual o dia todo"
$P -c "update private.dia_teste set d='2026-11-15'" >/dev/null
OUTRA=$(r $A "select public.studio_pauta()::text"); $P -c "update private.dia_teste set d='2026-11-14'" >/dev/null
[ "$OUTRA" != "$PA" ] && echo "  ok: amanhã a pauta muda" || { echo "FALHOU: pauta não mudou"; exit 1; }
# monta a foto perfeita a partir da pauta
PERF=$(echo "$PA" | python3 -c "
import json,sys;d=json.load(sys.stdin);f={'fundo':d['fundo'],'pose':d['pose'],'luz':'suave','quadro':'inteiro','objeto':'nenhum'};f[d['detalhe']['tipo']]=d['detalhe']['valor'];print(json.dumps(f))")
RUIM=$(echo "$PA" | python3 -c "
import json,sys;d=json.load(sys.stdin);o=lambda L,x:[v for v in L if v!=x][0];f={'fundo':o(['rosa','cortina','nuvens','neon'],d['fundo']),'pose':o(['normal','v','coracao','tchau'],d['pose']),'luz':'suave','quadro':'inteiro','objeto':'nenhum'};t=d['detalhe']['tipo'];f[t]=o({'luz':['suave','neon','por'],'quadro':['rosto','meio','inteiro'],'objeto':['balao','microfone','lightstick']}[t],d['detalhe']['valor']);print(json.dumps(f))")
ok "$(r '' "select public.studio_clique('$PERF')->>'erro'")" sem_conta "sem conta"
ok "$(r $A "select public.studio_clique('$RUIM')->>'estrelas'")" 1 "nada da pauta: 1 estrela (mínimo)"
ok "$(r $A "select public.studio_clique('$PERF')->>'estrelas'")" 3 "foto perfeita: 3 estrelas"
ok "$($P -c "select stars from public.players")" 15 "1ª foto com 3 estrelas: +★5"
ok "$(r $A "select public.studio_clique('$PERF')->>'premio'")" 0 "2ª foto perfeita no dia: sem prêmio"
ok "$($P -c "select sum(delta) from public.star_log where reason='bonus_foto'")" 5 "uma vez só no star_log"
ok "$(r $A "select public.studio_clique('{\"fundo\":\"praia\",\"pose\":\"v\",\"luz\":\"suave\",\"quadro\":\"meio\",\"objeto\":\"nenhum\"}')->>'erro'")" escolhas "cenário fora da lista"
ok "$(r $A "select public.studio_clique('{\"fundo\":\"rosa\",\"pose\":\"v\",\"luz\":\"suave\",\"quadro\":\"meio\",\"objeto\":\"flor_lunar\"}')->>'erro'")" flor "flor que não colheu"
ok "$(r $A "select public.studio_clique('{\"fundo\":\"rosa\",\"pose\":\"v\",\"luz\":\"suave\",\"quadro\":\"meio\",\"objeto\":\"flor_tulipa\"}')->>'ok'")" true "flor que colheu entra (não gasta)"
ok "$($P -c "select qtd from private.jardim_flores")" 1 "a tulipa continua lá"
ok "$($P -c "select has_function_privilege('anon','public.studio_clique(jsonb)','execute')")" f "anon não clica"
echo "OK: Photo⭐Studio! v1 testado em PostgreSQL isolado"
