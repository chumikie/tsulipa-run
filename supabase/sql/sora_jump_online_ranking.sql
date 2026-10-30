-- TsuLiPa⭐World · Sora⭐Jump! — ranking online
-- PROPOSTA PARA REVISÃO / PRODUÇÃO. NÃO FOI APLICADA AO BANCO.
--
-- Reaproveita public.players e Supabase Auth existentes.
-- Mantém o Sora totalmente separado de public.runs/public.leaderboard.
-- Não altera top_scores(), best, estrelas, Center⭐Run, saves ou histórico.
--
-- Armazenamento enxuto:
--   * sora_runs guarda apenas partidas ainda abertas (sem histórico infinito).
--   * sora_scores guarda somente recordes: 1 geral + 1 semanal por jogador.
--   * resultados semanais antigos são removidos quando começa nova semana;
--     recordes gerais permanecem.
--
-- Calendário Sora: domingo 00:00 a sábado 23:59:59, America/Sao_Paulo.
-- O calendário do Center⭐Run continua segunda a domingo.
--
-- Perfil:
--   * sora_my_profile() retorna apenas nickname e look/avatar atual.
--   * Usa look.c sobre avatar.c, como o Karaoke.
--   * Não retorna email, UUID, pet, estrelas, saves ou dados administrativos.
--
-- Integridade:
--   * Início e finalização ligados a auth.uid() da conta Google.
--   * Só uma partida aberta por jogador; UUID de partida, uma finalização.
--   * Score 0 fecha a partida sem ranking; run abandonado não pontua.
--   * Limites de tempo/velocidade reduzem abuso trivial, mas não comprovam
--     toda a física. Anti-cheat forte exigiria simulação/replay autoritativo.

begin;

create schema if not exists private;

create table if not exists private.sora_runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  started_at timestamptz not null default clock_timestamp()
);

create unique index if not exists sora_runs_one_open_per_player
  on private.sora_runs(player_id);
create index if not exists sora_runs_started_at
  on private.sora_runs(started_at);

create table if not exists private.sora_scores (
  player_id uuid not null references public.players(id) on delete cascade,
  period_type text not null check (period_type in ('all','week')),
  week_start date,
  score integer not null check (score > 0 and score <= 2000000),
  achieved_at timestamptz not null default clock_timestamp(),
  constraint sora_scores_period_check check (
    (period_type = 'all' and week_start is null)
    or (period_type = 'week' and week_start is not null)
  )
);

create unique index if not exists sora_scores_all_player
  on private.sora_scores(player_id) where period_type = 'all';
create unique index if not exists sora_scores_week_player
  on private.sora_scores(player_id,week_start) where period_type = 'week';
create index if not exists sora_scores_week_rank
  on private.sora_scores(week_start,score desc,achieved_at)
  where period_type = 'week';
create index if not exists sora_scores_all_rank
  on private.sora_scores(score desc,achieved_at)
  where period_type = 'all';

alter table private.sora_runs enable row level security;
alter table private.sora_scores enable row level security;
revoke all on private.sora_runs from public,anon,authenticated;
revoke all on private.sora_scores from public,anon,authenticated;

-- Conta só lê o próprio perfil visual. Resposta deliberadamente pequena.
create or replace function public.sora_my_profile()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select jsonb_build_object(
    'nick', p.nick,
    'character', coalesce(
      nullif(p.look->'c','null'::jsonb),
      nullif(p.avatar->'c','null'::jsonb),
      '{}'::jsonb
    )
  )
  from public.players p
  where p.id = auth.uid()
    and not coalesce(p.bloqueado,false)
    and coalesce(auth.jwt()->'app_metadata'->>'provider','') = 'google'
    and coalesce(auth.jwt()->>'is_anonymous','false') <> 'true';
$function$;
revoke all on function public.sora_my_profile() from public,anon;
grant execute on function public.sora_my_profile() to authenticated;

create or replace function public.sora_run_start()
returns uuid
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := clock_timestamp();
  v_run uuid;
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider','') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous','false') = 'true' then
    raise exception 'sora_google_login_required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.players p
    where p.id=v_uid and not coalesce(p.bloqueado,false)
  ) then
    raise exception 'sora_profile_unavailable' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_uid::text,0)
  );

  -- Desbloqueia partidas interrompidas há mais de 45 minutos.
  delete from private.sora_runs
   where player_id=v_uid and started_at <= v_now - interval '45 minutes';

  if exists (select 1 from private.sora_runs r where r.player_id=v_uid) then
    raise exception 'sora_run_already_open' using errcode = '55000';
  end if;

  insert into private.sora_runs(player_id,started_at)
  values(v_uid,v_now)
  returning id into v_run;

  return v_run;
end
$function$;
revoke all on function public.sora_run_start() from public,anon;
grant execute on function public.sora_run_start() to authenticated;

create or replace function public.sora_run_finish(
  p_run_id uuid,
  p_score integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_started timestamptz;
  v_now timestamptz := clock_timestamp();
  v_elapsed numeric;
  v_sunday date := (
    (clock_timestamp() at time zone 'America/Sao_Paulo')::date
    - extract(dow from (clock_timestamp() at time zone 'America/Sao_Paulo')::date)::integer
  );
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider','') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous','false') = 'true' then
    raise exception 'sora_google_login_required' using errcode = '42501';
  end if;

  if p_run_id is null then
    raise exception 'sora_run_id_required' using errcode = '22023';
  end if;

  select r.started_at into v_started
  from private.sora_runs r
  where r.id=p_run_id and r.player_id=v_uid
  for update;

  if not found then
    raise exception 'sora_run_not_found_or_finished' using errcode = '55000';
  end if;

  v_elapsed := extract(epoch from (v_now-v_started));

  if p_score is null or p_score < 0 or p_score > 2000000
     or v_elapsed < 1 or v_elapsed > 2700
     or p_score > floor(v_elapsed*85)+100
     or not exists (
       select 1 from public.players p
       where p.id=v_uid and not coalesce(p.bloqueado,false)
     ) then
    delete from private.sora_runs where id=p_run_id and player_id=v_uid;
    return jsonb_build_object('ok',false,'reason','run_or_score_invalid');
  end if;

  delete from private.sora_runs where id=p_run_id and player_id=v_uid;

  -- Recorde geral: exatamente uma linha por jogador.
  if p_score > 0 then
    insert into private.sora_scores(player_id,period_type,week_start,score,achieved_at)
    values(v_uid,'all',null,p_score,v_now)
    on conflict (player_id) where period_type='all'
    do update set score=excluded.score,achieved_at=excluded.achieved_at
    where private.sora_scores.score < excluded.score;

    -- Semana do Sora: domingo a sábado, independente da semana do Center.
    delete from private.sora_scores
     where period_type='week' and week_start < v_sunday;

    insert into private.sora_scores(player_id,period_type,week_start,score,achieved_at)
    values(v_uid,'week',v_sunday,p_score,v_now)
    on conflict (player_id,week_start) where period_type='week'
    do update set score=excluded.score,achieved_at=excluded.achieved_at
    where private.sora_scores.score < excluded.score;
  end if;

  return jsonb_build_object('ok',true,'score',p_score,'ranked',p_score>0,'finished_at',v_now);
end
$function$;
revoke all on function public.sora_run_finish(uuid,integer) from public,anon;
grant execute on function public.sora_run_finish(uuid,integer) to authenticated;

create or replace function public.sora_run_abort(p_run_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then return false; end if;
  delete from private.sora_runs
   where id=p_run_id and player_id=v_uid;
  return found;
end
$function$;
revoke all on function public.sora_run_abort(uuid) from public,anon;
grant execute on function public.sora_run_abort(uuid) to authenticated;

create or replace function public.sora_ranking(p_period text default 'all')
returns table("position" bigint,nick text,score integer)
language sql
stable
security definer
set search_path = ''
as $function$
  with week_window as (
    select (
      (now() at time zone 'America/Sao_Paulo')::date
      - extract(dow from (now() at time zone 'America/Sao_Paulo')::date)::integer
    ) as sunday
  ),
  entries as (
    select s.player_id,
      coalesce(nullif(pg_catalog.btrim(p.nick),''),'Idol') as display_nick,
      s.score,s.achieved_at
    from private.sora_scores s
    join public.players p on p.id=s.player_id
    cross join week_window w
    where not coalesce(p.bloqueado,false)
      and (
        (p_period='all' and s.period_type='all')
        or (p_period='week' and s.period_type='week' and s.week_start=w.sunday)
      )
  ),
  ranked as (
    select row_number() over(
      order by e.score desc,e.achieved_at asc,lower(e.display_nick),e.player_id
    ) as pos,e.display_nick,e.score
    from entries e
  )
  select r.pos,r.display_nick,r.score
  from ranked r
  where p_period in ('all','week') and r.pos<=15
  order by r.pos;
$function$;
revoke all on function public.sora_ranking(text) from public;
grant execute on function public.sora_ranking(text) to anon,authenticated;

commit;

-- Pós-aprovação: Advisors, RLS/grants, Google auth, profile look/avatar,
-- runs replay/abort/timeout, weekly (domingo-sábado), all-time e fallback.
-- Conferir que Center/public.runs, leaderboard, top_scores, best e estrelas
-- permanecem byte-a-byte/comportamentalmente intactos.
