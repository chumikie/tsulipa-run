-- TsuLiPa⭐World · PR #33 · WEEKLY PODIUM DRAFT
-- STAGED ONLY: do not execute in production or on a user's account.
-- All scores must be verified by an authenticated server before invoking the
-- private registration helper. There is no public score-submission RPC.
create schema if not exists private;

create table if not exists private.tw_weekly_podium_scores (
  game text not null check (game in ('sora','karaoke')),
  week_start date not null,
  player_id uuid not null references public.players(id) on delete cascade,
  score integer not null check (score > 0 and score <= 2000000),
  updated_at timestamptz not null default now(),
  primary key (game,week_start,player_id)
);
create index if not exists tw_weekly_scores_top
  on private.tw_weekly_podium_scores (game,week_start,score desc,updated_at);
alter table private.tw_weekly_podium_scores enable row level security;
revoke all on private.tw_weekly_podium_scores from public,anon,authenticated;

create or replace function private.tw_podio_registrar_verificado (
  p_game text,p_player uuid,p_score integer
) returns void language plpgsql security definer set search_path to ''
as $body$
declare
  v_day date := (clock_timestamp() at time zone 'America/Sao_Paulo')::date;
  v_week date := v_day - extract(dow from v_day)::integer;
begin
  if p_game is null or p_game not in ('sora','karaoke')
    or p_score is null or p_score < 1 or p_score > 2000000 then
    raise exception 'invalid_weekly_score' using errcode='22023';
  end if;
  if not exists (select 1 from public.players p where p.id=p_player
                 and not coalesce(p.bloqueado,false)) then
    raise exception 'invalid_weekly_player' using errcode='22023';
  end if;
  -- No simultaneous request can produce a temporary 4th published Idol.
  perform pg_advisory_xact_lock(982026,33);
  delete from private.tw_weekly_podium_scores where week_start < v_week;

  insert into private.tw_weekly_podium_scores(game,week_start,player_id,score)
    values (p_game,v_week,p_player,p_score)
  on conflict (game,week_start,player_id) do update
    set score=excluded.score,updated_at=clock_timestamp()
    where private.tw_weekly_podium_scores.score < excluded.score;

  if p_game='karaoke' then
    with ranked as (
      select s.player_id,
             row_number() over (order by s.score desc,s.updated_at asc,s.player_id) as pos
      from private.tw_weekly_podium_scores s
      where s.game='karaoke' and s.week_start=v_week
    )
    delete from private.tw_weekly_podium_scores s
    where s.game='karaoke' and s.week_start=v_week
      and s.player_id in (select player_id from ranked where pos>3);
  end if;
end
$body$;
revoke all on function private.tw_podio_registrar_verificado(text,uuid,integer)
  from public,anon,authenticated;

-- Read-only RPC, returning names and scores only. Center uses the same
-- Sunday-to-Saturday window without changing the official top_scores RPC.
create or replace function public.tw_podio_semana()
 returns jsonb language plpgsql stable security definer set search_path to ''
as $body$
declare
  v_day date := (now() at time zone 'America/Sao_Paulo')::date;
  v_week date := v_day - extract(dow from v_day)::integer;
  v_start timestamptz;
  v_end timestamptz;
begin
  v_start := v_week::timestamp at time zone 'America/Sao_Paulo';
  v_end := (v_week+7)::timestamp at time zone 'America/Sao_Paulo';
  return jsonb_build_object(
    'semana',v_week::text,
    'center',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.score desc),'[]'::jsonb)
      from (
        select p.nick,max(l.score)::bigint as score
        from public.leaderboard l join public.players p on p.id=l.user_id
        where l.created_at>=v_start and l.created_at<v_end
          and not coalesce(p.bloqueado,false)
        group by p.id,p.nick
        order by score desc,p.nick limit 3
      ) t
    ),
    'sora',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.score desc),'[]'::jsonb)
      from (
        select p.nick,s.score
        from private.tw_weekly_podium_scores s
        join public.players p on p.id=s.player_id
        where s.game='sora' and s.week_start=v_week
          and not coalesce(p.bloqueado,false)
        order by s.score desc,s.updated_at,p.nick limit 3
      ) t
    ),
    'karaoke',(
      select coalesce(jsonb_agg(to_jsonb(t) order by t.score desc),'[]'::jsonb)
      from (
        select p.nick,s.score
        from private.tw_weekly_podium_scores s
        join public.players p on p.id=s.player_id
        where s.game='karaoke' and s.week_start=v_week
          and not coalesce(p.bloqueado,false)
        order by s.score desc,s.updated_at,p.nick limit 3
      ) t
    ),
    'meu_sora',(
      select s.score
      from private.tw_weekly_podium_scores s
      join public.players p on p.id=s.player_id
      where s.game='sora' and s.week_start=v_week
        and p.id=auth.uid() and not coalesce(p.bloqueado,false)
      limit 1
    )
  );
end
$body$;
revoke all on function public.tw_podio_semana() from public,anon,authenticated;
grant execute on function public.tw_podio_semana() to anon,authenticated;

create or replace function private.tw_podio_limpar_antigos()
 returns integer language plpgsql security definer set search_path to ''
as $body$
declare
  v_day date := (now() at time zone 'America/Sao_Paulo')::date;
  v_week date := v_day - extract(dow from v_day)::integer;
  v_count integer;
begin
  delete from private.tw_weekly_podium_scores where week_start < v_week;
  get diagnostics v_count = row_count;
  return v_count;
end
$body$;
revoke all on function private.tw_podio_limpar_antigos()
 from public,anon,authenticated;

-- Optional, separate approval after enabling and testing Supabase Cron:
-- At the current UTC-03 offset, Sunday 03:05 UTC is Sunday 00:05 in SP.
-- select cron.schedule('tsulipa-weekly-cleanup','5 3 * * 0',
--                      'select private.tw_podio_limpar_antigos()');
-- Even without a job, the read API never returns old weeks.
