\set ON_ERROR_STOP on
-- Banco temporário exclusivo do GitHub Actions: identidades fictícias.
create schema auth;
create schema private;
-- Roles are global to this disposable PostgreSQL service and may exist
-- from other integration tests in a different test database.
do $roles$
begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname='service_role') then create role service_role nologin; end if;
end
$roles$;
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims',true),''),'{}')::jsonb
$$;
create table public.players (
  id uuid primary key,nick text not null,stars integer not null default 0,
  bloqueado boolean not null default false,
  updated_at timestamptz not null default now()
);
create table public.star_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.players(id),
  delta integer not null,reason text not null,
  created_at timestamptz not null default now()
);
create table private.sora_runs (
  id uuid primary key,player_id uuid not null references public.players(id),
  started_at timestamptz not null
);
create unique index sora_runs_one_open_per_player on private.sora_runs(player_id);
create table private.sora_scores (
  player_id uuid not null references public.players(id),
  period_type text not null,week_start date,score integer not null,
  achieved_at timestamptz not null
);
create unique index sora_scores_all_player on private.sora_scores(player_id) where period_type='all';
create unique index sora_scores_week_player on private.sora_scores(player_id,week_start) where period_type='week';
create table private.sora_history (
  id bigint generated always as identity primary key,
  player_id uuid not null,score integer not null,finished_at timestamptz not null
);
create function private.sora_history_add(p_uid uuid,p_score integer,p_at timestamptz)
returns void language sql security definer set search_path='' as $$
  insert into private.sora_history(player_id,score,finished_at) values(p_uid,p_score,p_at);
$$;
-- Preexisting RPC and grants modeled after production.
create function public.sora_run_finish(uuid,integer)
returns jsonb language sql security definer set search_path='' as $$select '{}'::jsonb$$;
revoke all on function public.sora_run_finish(uuid,integer) from public,anon;
grant execute on function public.sora_run_finish(uuid,integer) to authenticated;

insert into public.players(id,nick,stars) values
 ('00000000-0000-4000-8000-000000000001','Sora A',100),
 ('00000000-0000-4000-8000-000000000002','Sora B',100);
insert into private.sora_runs(id,player_id,started_at) values
 ('30000000-0000-4000-8000-000000000001','00000000-0000-4000-8000-000000000001',clock_timestamp()-interval '20 seconds'),
 ('30000000-0000-4000-8000-000000000002','00000000-0000-4000-8000-000000000002',clock_timestamp()-interval '7 seconds');
