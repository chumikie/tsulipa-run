\set ON_ERROR_STOP on
-- PostgreSQL descartável. Contas, nicks e pontuações inventados.
create schema if not exists auth;
create schema if not exists private;
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
do $$ begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end $$;
grant usage on schema public, auth to authenticated;
create table public.players(id uuid primary key, nick text, bloqueado boolean default false);
create table private.kt_scores(
  player_id uuid not null references public.players(id), week_start date not null,
  score integer not null default 0, score_at timestamptz, combo integer not null default 0, combo_at timestamptz,
  acc numeric(5,2) not null default 0, acc_hits integer not null default 0, acc_at timestamptz, primary key(player_id, week_start));
create function private.kt_domingo() returns date language sql stable as $$ select date '2026-11-01' $$;
insert into public.players(id,nick,bloqueado)
select ('50000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid, 'P'||i, i=3 from generate_series(1,9) i;
-- P1..P9 com pontuações decrescentes; P3 bloqueado (não conta); P9 sem resultado nesta semana (só na semana anterior)
insert into private.kt_scores(player_id,week_start,score,score_at,combo,combo_at,acc,acc_hits,acc_at)
select ('50000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid, date '2026-11-01', 1000-i*50, now(), 40-i, now(), 99-i, 100, now()
from generate_series(1,8) i;
insert into private.kt_scores(player_id,week_start,score,score_at) values ('50000000-0000-4000-8000-000000000009', date '2026-10-25', 5000, now());
