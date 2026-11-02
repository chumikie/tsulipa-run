\set ON_ERROR_STOP on
-- Disposable GitHub Actions PostgreSQL database only.
create schema auth;
create schema private;
-- Roles are cluster-wide and already created by the Center Run CI fixture.
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create function auth.jwt() returns jsonb language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claims',true),'')::jsonb,
    '{"app_metadata":{"provider":"google"},"is_anonymous":false}'::jsonb)
$$;
create table public.players(
 id uuid primary key,nick text not null,bloqueado boolean not null default false,
 avatar jsonb,cor text,stars integer not null default 0,
 bonus_corrida text,updated_at timestamptz not null default now()
);
create table private.kt_runs(
 id uuid primary key default gen_random_uuid(),
 player_id uuid not null references public.players(id),
 dia date not null, started_at timestamptz not null default now(),
 finished_at timestamptz
);
create table private.kt_scores(
 player_id uuid,week_start date,score integer,combo integer,acc numeric,
 acc_hits integer,score_at timestamptz,combo_at timestamptz,acc_at timestamptz
);
create table public.gacha(
 user_id uuid not null,dia date not null,tipo text,valor text,
 primary key(user_id,dia)
);
create table public.admin_log(
 admin uuid,acao text,alvo text,valor text,motivo text
);
create table public.star_log(
 id bigint generated always as identity primary key,
 user_id uuid,delta integer,reason text,created_at timestamptz default now()
);
create function public.eh_admin() returns boolean language sql stable as $$
 select current_setting('test.admin',true)='yes'
$$;
create function public.hoje_br() returns date language sql stable as $$
 select (now() at time zone 'America/Sao_Paulo')::date
$$;
create function public.gacha_card(text) returns jsonb language sql stable as $$
 select '{}'::jsonb
$$;
create function private.kt_domingo() returns date language sql stable as $$
 select (now() at time zone 'America/Sao_Paulo')::date
$$;
-- The reviewed Gacha RPC is loaded unchanged except its randomness is
-- replaced by this deterministic test-only function in the ephemeral DB.
create function public.kt_test_random() returns double precision language sql stable as $$
 select 0.99::double precision
$$;

insert into public.players(id,nick,stars) values
 ('20000000-0000-4000-8000-000000000001','Aiko',100),
 ('20000000-0000-4000-8000-000000000002','Mod',100),
 ('20000000-0000-4000-8000-000000000003','Pati',100);
