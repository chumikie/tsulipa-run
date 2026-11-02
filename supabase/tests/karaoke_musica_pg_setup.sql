\set ON_ERROR_STOP on
-- PostgreSQL descartável. Contas e pontuações inventadas.
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
create extension if not exists pgcrypto;
create table public.players(id uuid primary key, nick text, avatar jsonb, cor text, bloqueado boolean default false);
create table private.kt_runs(id uuid primary key default gen_random_uuid(), player_id uuid not null references public.players(id),
  dia date not null default current_date, started_at timestamptz not null default clock_timestamp(), finished_at timestamptz);
create table private.kt_scores(player_id uuid not null references public.players(id), week_start date not null,
  score integer not null default 0, score_at timestamptz, combo integer not null default 0, combo_at timestamptz,
  acc numeric(5,2) not null default 0, acc_hits integer not null default 0, acc_at timestamptz, primary key(player_id, week_start));
create function private.kt_domingo() returns date language sql stable as $$ select coalesce(nullif(current_setting('test.domingo',true),''),'2026-11-01')::date $$;
-- versão antiga (6 parâmetros), como em produção, para conferir a troca de assinatura
create function public.kt_run_finish(p_run uuid, p_score integer, p_hits integer, p_attempts integer, p_combo integer, p_notes integer)
returns jsonb language sql as $$ select '{"old":true}'::jsonb $$;
grant execute on function public.kt_run_finish(uuid,integer,integer,integer,integer,integer) to authenticated;
insert into public.players(id,nick) select ('60000000-0000-4000-8000-'||lpad(i::text,12,'0'))::uuid,'P'||i from generate_series(1,7) i;
