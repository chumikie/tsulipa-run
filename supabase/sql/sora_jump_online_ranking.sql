-- TsuLiPa⭐World · Sora⭐Jump! — ranking online (PROPOSTA DE PRODUÇÃO)
-- Revisão: 30/10/2026
-- IMPORTANTE:
--   * Arquivo preparado e versionado; NÃO aplicado ao Supabase.
--   * Executar somente após aprovação explícita para alterar a produção.
--   * Não altera public.leaderboard, top_scores(), Center⭐Run, estrelas,
--     saves locais, histórico ou missões.
--
-- Identidade e personagem:
--   * Exige a sessão Google já usada pelo TsuLiPa (sem login/conta paralela).
--   * sora_my_profile() devolve apenas nick + aparência atual do perfil.
--   * A aparência usa players.look->'c' sobre players.avatar->'c', igual à
--     regra já usada por outdoor_jogadores / Karaoke.
--   * A RPC não devolve email, UUID, saves, estrelas, aniversário ou admin.
--
-- Ranking:
--   * Semanal: melhor pontuação por conta desde segunda-feira 00:00 em
--     America/Sao_Paulo.
--   * Geral: melhor pontuação histórica por conta.
--   * Desempate: quem alcançou o resultado primeiro; depois nick.
--   * Exibição limitada a 15 jogadores.
--
-- Validação:
--   * O servidor abre um run_id vinculado ao auth.uid().
--   * Só aceita finalização do run ainda aberto e pertencente à conta.
--   * Um run só pode finalizar uma vez; run abandonado não pontua.
--   * Duração até 45 min e limite de progressão de 85 m/s + margem inicial.
--   * Isso reduz replay/falsificação trivial; não prova a física inteira.
--     Para anti-cheat forte, seria necessário replay/simulação autoritativa.

begin;

create schema if not exists sora_private;
revoke all on schema sora_private from public, anon, authenticated;

create table if not exists sora_private.runs (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  started_at timestamptz not null default clock_timestamp(),
  finished_at timestamptz,
  abandoned_at timestamptz,
  status text not null default 'started'
    check (status in ('started','finished','abandoned')),
  score integer,
  constraint sora_runs_state_fields_check check (
    (status = 'started' and finished_at is null and abandoned_at is null and score is null)
    or
    (status = 'finished' and finished_at is not null and abandoned_at is null
      and score is not null and score between 0 and 2000000)
    or
    (status = 'abandoned' and finished_at is null and abandoned_at is not null and score is null)
  )
);

create unique index if not exists sora_runs_one_open_per_player
  on sora_private.runs(player_id)
  where status = 'started';

create index if not exists sora_runs_player_started
  on sora_private.runs(player_id, started_at desc);

create table if not exists sora_private.scores (
  run_id uuid primary key references sora_private.runs(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  score integer not null check (score > 0 and score <= 2000000),
  created_at timestamptz not null default clock_timestamp()
);

create index if not exists sora_scores_player_created
  on sora_private.scores(player_id, created_at desc);

create index if not exists sora_scores_created_score
  on sora_private.scores(created_at desc, score desc);

alter table sora_private.runs enable row level security;
alter table sora_private.runs force row level security;
alter table sora_private.scores enable row level security;
alter table sora_private.scores force row level security;

revoke all on all tables in schema sora_private from public, anon, authenticated;
revoke all on all sequences in schema sora_private from public, anon, authenticated;

-- Perfil visual próprio: somente nickname e campos de aparência já utilizados
-- pelo renderer do jogo. SECURITY DEFINER é restrita por auth.uid() e Google.
create or replace function public.sora_my_profile()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  select jsonb_build_object(
    'nick', p.nick,
    'character',
      coalesce(
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

-- Inicia um run exclusivo por conta. Runs esquecidos por mais de 45 minutos
-- são marcados como abandonados antes de permitir uma nova partida.
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

  update sora_private.runs
     set status = 'abandoned',
         abandoned_at = v_now
   where player_id = v_uid
     and status = 'started'
     and started_at <= v_now - interval '45 minutes';

  if exists (
    select 1 from sora_private.runs r
    where r.player_id = v_uid and r.status = 'started'
  ) then
    raise exception 'sora_run_already_open' using errcode = '55000';
  end if;

  select max(r.started_at)
    into v_last_started
  from sora_private.runs r
  where r.player_id = v_uid;

  if v_last_started is not null
     and v_last_started > v_now - interval '5 seconds' then
    raise exception 'sora_start_rate_limited' using errcode = '55000';
  end if;

  insert into sora_private.runs(player_id, started_at)
  values (v_uid, v_now)
  returning id into v_run_id;

  return v_run_id;
end
$function$;

revoke all on function public.sora_run_start() from public, anon;
grant execute on function public.sora_run_start() to authenticated;

-- Finaliza o run do próprio jogador. Score 0 fecha o run sem entrar no ranking,
-- evitando que partidas muito curtas deixem uma sessão aberta por 45 minutos.
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

  select r.started_at
    into v_started_at
  from sora_private.runs r
  where r.id = p_run_id
    and r.player_id = v_uid
    and r.status = 'started'
  for update;

  if not found then
    raise exception 'sora_run_not_found_or_finished' using errcode = '55000';
  end if;

  if p_score is null or p_score < 0 or p_score > 2000000 then
    update sora_private.runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'invalid_score');
  end if;

  if not exists (
    select 1 from public.players p
    where p.id = v_uid and not coalesce(p.bloqueado, false)
  ) then
    update sora_private.runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'profile_unavailable');
  end if;

  v_elapsed := extract(epoch from (v_now - v_started_at));

  if v_elapsed < 1 or v_elapsed > 2700 then
    update sora_private.runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'invalid_duration');
  end if;

  if p_score > floor(v_elapsed * 85) + 100 then
    update sora_private.runs
       set status = 'abandoned', abandoned_at = v_now
     where id = p_run_id and player_id = v_uid and status = 'started';
    return jsonb_build_object('ok', false, 'reason', 'score_rate_exceeded');
  end if;

  update sora_private.runs
     set status = 'finished',
         finished_at = v_now,
         score = p_score
   where id = p_run_id
     and player_id = v_uid
     and status = 'started';

  if p_score > 0 then
    insert into sora_private.scores(run_id, player_id, score, created_at)
    values (p_run_id, v_uid, p_score, v_now);
  end if;

  return jsonb_build_object(
    'ok', true,
    'score', p_score,
    'ranked', p_score > 0,
    'finished_at', v_now
  );
end
$function$;

revoke all on function public.sora_run_finish(uuid, integer) from public, anon;
grant execute on function public.sora_run_finish(uuid, integer) to authenticated;

-- Abandono explícito ao sair do jogo antes de morrer; nunca conta pontuação.
create or replace function public.sora_run_abort(p_run_id uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider', '') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous', 'false') = 'true' then
    return false;
  end if;

  update sora_private.runs
     set status = 'abandoned',
         abandoned_at = clock_timestamp()
   where id = p_run_id
     and player_id = v_uid
     and status = 'started';

  return found;
end
$function$;

revoke all on function public.sora_run_abort(uuid) from public, anon;
grant execute on function public.sora_run_abort(uuid) to authenticated;

-- Ranking público mínimo: nickname e pontuação, sem UUID, email ou aparência.
create or replace function public.sora_ranking(p_period text default 'all')
returns table("position" bigint, nick text, score integer)
language sql
stable
security definer
set search_path = ''
as $function$
  with period_window as (
    select case
      when p_period = 'week' then
        date_trunc('week', now() at time zone 'America/Sao_Paulo')
          at time zone 'America/Sao_Paulo'
      else null::timestamptz
    end as starts_at
  ),
  best_per_player as (
    select distinct on (s.player_id)
      s.player_id,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as display_nick,
      s.score as best_score,
      s.created_at as achieved_at
    from sora_private.scores s
    join public.players p on p.id = s.player_id
    cross join period_window w
    where p_period in ('all','week')
      and (p_period = 'all' or s.created_at >= w.starts_at)
      and not coalesce(p.bloqueado, false)
    order by s.player_id, s.score desc, s.created_at asc
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

-- CHECKLIST DEPOIS DA APROVAÇÃO E APLICAÇÃO:
-- 1. Executar Supabase Security/Performance Advisors.
-- 2. Confirmar RLS + FORCE RLS, sem grants diretos em sora_private.
-- 3. Testar login Google real, sessão ausente/anônima e perfil bloqueado.
-- 4. Testar perfil: nickname + look/avatar atual refletidos no personagem do Sora.
-- 5. Testar run: iniciar, finalizar com score 0, score positivo, abortar,
--    replay, run de outra conta, duração inválida e progressão impossível.
-- 6. Testar ranking semanal e geral, desempate e filtro de bloqueados.
-- 7. Confirmar que public.leaderboard, top_scores(), Center⭐Run, estrelas,
--    saves e histórico permanecem inalterados.
