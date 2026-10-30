-- TsuLiPa⭐World · Sora⭐Jump! — ranking online
-- PROPOSTA PARA REVISÃO / PRODUÇÃO. NÃO FOI APLICADA AO BANCO.
--
-- Reaproveita a identidade existente de public.players e Supabase Auth.
-- Usa uma única tabela privada para runs e scores do Sora.
-- NÃO toca em public.runs, public.leaderboard, top_scores(), Center Run,
-- estrelas, best, saves, histórico ou missões.
--
-- Calendário Sora: semana domingo 00:00 até sábado 23:59:59,
-- America/Sao_Paulo, conforme plano semanal Sora já documentado no projeto.
-- Center Run mantém seu calendário próprio de segunda-feira.
--
-- Segurança:
--   * Perfil: Google autenticado, player existente e desbloqueado.
--   * Publica apenas nick + appearance c para o próprio jogador.
--   * Runs pertencem a auth.uid(); não há escrita direta na tabela.
--   * Uma finalização por run; partida abandonada não pontua.
--   * Limites de duração/progressão reduzem abuso trivial, mas não comprovam
--     a simulação. Anti-cheat forte exige replay/simulação autoritativa.
--
-- Aplicar somente após aprovação explícita do responsável pela produção.

begin;

create table if not exists private.sora_runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  started_at timestamptz not null default clock_timestamp(),
  finished_at timestamptz,
  abandoned_at timestamptz,
  status text not null default 'started'
    check (status in ('started','finished','abandoned')),
  score integer,
  constraint sora_runs_state_check check (
    (status = 'started' and finished_at is null and abandoned_at is null and score is null)
    or
    (status = 'finished' and finished_at is not null and abandoned_at is null
      and score between 0 and 2000000)
    or
    (status = 'abandoned' and finished_at is null and abandoned_at is not null and score is null)
  )
);

create unique index if not exists sora_runs_one_open_per_player
  on private.sora_runs(player_id) where status = 'started';
create index if not exists sora_runs_player_started
  on private.sora_runs(player_id, started_at desc);
create index if not exists sora_runs_ranking
  on private.sora_runs(finished_at desc, score desc)
  where status = 'finished' and score > 0;

alter table private.sora_runs enable row level security;
-- Do NOT FORCE RLS here: controlled SECURITY DEFINER RPCs owned by postgres
-- need table-owner access. No Data API role receives table privileges.
revoke all on private.sora_runs from public, anon, authenticated;

-- Dados visuais exatos do perfil atual; nenhum email, UUID, pet, estrela ou save.
-- Prioriza look.c (aparência ativa), com fallback para avatar.c.
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
      nullif(p.look->'c', 'null'::jsonb),
      nullif(p.avatar->'c', 'null'::jsonb),
      '{}'::jsonb
    )
  )
  from public.players p
  where p.id = auth.uid()
    and not coalesce(p.bloqueado, false)
    and coalesce(auth.jwt()->'app_metadata'->>'provider', '') = 'google'
    and coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true';
$function$;

revoke all on function public.sora_my_profile() from public, anon;
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
  v_last_started timestamptz;
  v_run_id uuid;
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider', '') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous', 'false') = 'true' then
    raise exception 'sora_google_login_required' using errcode = '42501';
  end if;

  if not exists (
    select 1 from public.players p
    where p.id = v_uid and not coalesce(p.bloqueado, false)
  ) then
    raise exception 'sora_profile_unavailable' using errcode = '42501';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_uid::text, 0)
  );

  update private.sora_runs
     set status = 'abandoned', abandoned_at = v_now
   where player_id = v_uid
     and status = 'started'
     and started_at <= v_now - interval '45 minutes';

  if exists (
    select 1 from private.sora_runs r
    where r.player_id = v_uid and r.status = 'started'
  ) then
    raise exception 'sora_run_already_open' using errcode = '55000';
  end if;

  select max(r.started_at) into v_last_started
  from private.sora_runs r where r.player_id = v_uid;

  if v_last_started is not null
     and v_last_started > v_now - interval '5 seconds' then
    raise exception 'sora_start_rate_limited' using errcode = '55000';
  end if;

  insert into private.sora_runs(player_id, started_at)
  values (v_uid, v_now)
  returning id into v_run_id;

  return v_run_id;
end
$function$;

revoke all on function public.sora_run_start() from public, anon;
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
  v_started_at timestamptz;
  v_now timestamptz := clock_timestamp();
  v_elapsed numeric;
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider', '') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous', 'false') = 'true' then
    raise exception 'sora_google_login_required' using errcode = '42501';
  end if;

  if p_run_id is null then
    raise exception 'sora_run_id_required' using errcode = '22023';
  end if;

  select r.started_at into v_started_at
  from private.sora_runs r
  where r.id = p_run_id and r.player_id = v_uid and r.status = 'started'
  for update;

  if not found then
    raise exception 'sora_run_not_found_or_finished' using errcode = '55000';
  end if;

  if p_score is null or p_score < 0 or p_score > 2000000 then
    update private.sora_runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'invalid_score');
  end if;

  if not exists (
    select 1 from public.players p
    where p.id = v_uid and not coalesce(p.bloqueado, false)
  ) then
    update private.sora_runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'profile_unavailable');
  end if;

  v_elapsed := extract(epoch from (v_now - v_started_at));
  if v_elapsed < 1 or v_elapsed > 2700 then
    update private.sora_runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'invalid_duration');
  end if;

  if p_score > floor(v_elapsed * 85) + 100 then
    update private.sora_runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'score_rate_exceeded');
  end if;

  update private.sora_runs
     set status = 'finished', finished_at = v_now, score = p_score
   where id = p_run_id and player_id = v_uid and status = 'started';

  return jsonb_build_object(
    'ok', true, 'score', p_score, 'ranked', p_score > 0, 'finished_at', v_now
  );
end
$function$;

revoke all on function public.sora_run_finish(uuid, integer) from public, anon;
grant execute on function public.sora_run_finish(uuid, integer) to authenticated;

create or replace function public.sora_run_abort(p_run_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then return false; end if;

  update private.sora_runs
     set status = 'abandoned', abandoned_at = clock_timestamp()
   where id = p_run_id and player_id = v_uid and status = 'started';

  return found;
end
$function$;

revoke all on function public.sora_run_abort(uuid) from public, anon;
grant execute on function public.sora_run_abort(uuid) to authenticated;

create or replace function public.sora_ranking(p_period text default 'all')
returns table("position" bigint, nick text, score integer)
language sql
stable
security definer
set search_path = ''
as $function$
  with local_clock as (
    select (now() at time zone 'America/Sao_Paulo')::date as today
  ),
  week_window as (
    -- Domingo é o início da semana Sora (Center⭐Run usa segunda).
    select (today - extract(dow from today)::integer) as sunday
    from local_clock
  ),
  best_per_player as (
    select distinct on (r.player_id)
      r.player_id,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as display_nick,
      r.score as best_score,
      r.finished_at as achieved_at
    from private.sora_runs r
    join public.players p on p.id = r.player_id
    cross join week_window w
    where p_period in ('all','week')
      and r.status = 'finished'
      and r.score > 0
      and (p_period = 'all' or
           r.finished_at >= (w.sunday::timestamp at time zone 'America/Sao_Paulo'))
      and not coalesce(p.bloqueado, false)
    order by r.player_id, r.score desc, r.finished_at asc
  ),
  ranked as (
    select
      row_number() over (
        order by b.best_score desc, b.achieved_at asc,
                 lower(b.display_nick), b.player_id
      ) as rank_position,
      b.display_nick,
      b.best_score
    from best_per_player b
  )
  select r.rank_position, r.display_nick, r.best_score
  from ranked r
  where r.rank_position <= 15
  order by r.rank_position;
$function$;

revoke all on function public.sora_ranking(text) from public;
grant execute on function public.sora_ranking(text) to anon, authenticated;

commit;

-- CHECKLIST APÓS APROVAÇÃO/APLICAÇÃO:
-- 1. Advisors Security/Performance; rever grants e SECURITY DEFINER.
-- 2. Confirmar RLS habilitada e ausência de acesso direto a private.sora_runs.
-- 3. Testar Google login, logout, perfil bloqueado, visual look/avatar e nick.
-- 4. Testar iniciar/finalizar/abortar, replay, outra conta, score zero,
--    duração/velocidade inválidas e runs abandonados.
-- 5. Testar ranking domingo-sábado e geral, desempate e filtro de bloqueados.
-- 6. Comparar public.runs, public.leaderboard, top_scores(), players.best,
--    estrelas e logs antes/depois: nenhum deles deve mudar.
