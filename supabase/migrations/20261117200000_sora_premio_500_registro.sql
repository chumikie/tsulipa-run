-- Sora⭐Jump!: prêmio diário dos 500 m (★25, uma vez por dia por conta Google, dia de São Paulo).
-- REGISTRO do que já roda em produção desde 13/11/2026 (aplicado direto no banco a partir da proposta do PR #74,
-- com o anti-trapaça endurecido): este arquivo só deixa o repositório igual ao banco. Reaplicar não muda nada.
-- Conferência no servidor: a partida nasce em sora_run_start (hora do servidor); o prêmio exige
-- pelo menos 20 s de partida e média de no máximo 25 m/s. O ranking segue a regra de antes (até 85 m/s).
-- 17/11: o jogo passou a mostrar o "+25 ★" só quando o servidor confirma (stars_credited).

create table if not exists private.sora_daily_500_rewards (
  player_id uuid not null references public.players(id) on delete cascade,
  reward_day date not null,
  run_id uuid not null unique,
  rewarded_at timestamptz not null default clock_timestamp(),
  primary key (player_id, reward_day)
);
alter table private.sora_daily_500_rewards enable row level security;
revoke all on table private.sora_daily_500_rewards from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.sora_run_finish(p_run_id uuid, p_score integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_started timestamptz;
  v_now timestamptz := clock_timestamp();
  v_elapsed numeric;
  v_today date := (v_now at time zone 'America/Sao_Paulo')::date;
  v_credit integer := 0;
  v_already boolean := false;
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
  select r.started_at into v_started from private.sora_runs r
   where r.id=p_run_id and r.player_id=v_uid for update;
  if not found then
    raise exception 'sora_run_not_found_or_finished' using errcode = '55000';
  end if;
  v_elapsed := extract(epoch from (v_now-v_started));
  if p_score is null or p_score < 0 or p_score > 2000000
     or v_elapsed < 1 or v_elapsed > 2700
     or p_score > floor(v_elapsed*85)+100
     or not exists (select 1 from public.players p where p.id=v_uid and not coalesce(p.bloqueado,false)) then
    delete from private.sora_runs where id=p_run_id and player_id=v_uid;
    return jsonb_build_object('ok',false,'reason','run_or_score_invalid');
  end if;
  delete from private.sora_runs where id=p_run_id and player_id=v_uid;
  if p_score > 0 then
    insert into private.sora_scores(player_id,period_type,week_start,score,achieved_at)
    values(v_uid,'all',null,p_score,v_now)
    on conflict (player_id) where period_type='all'
    do update set score=excluded.score,achieved_at=excluded.achieved_at
    where private.sora_scores.score < excluded.score;
    delete from private.sora_scores where period_type='week' and week_start < v_sunday;
    insert into private.sora_scores(player_id,period_type,week_start,score,achieved_at)
    values(v_uid,'week',v_sunday,p_score,v_now)
    on conflict (player_id,week_start) where period_type='week'
    do update set score=excluded.score,achieved_at=excluded.achieved_at
    where private.sora_scores.score < excluded.score;
    perform private.sora_history_add(v_uid, p_score, v_now);
  end if;
  -- Anti-cheat do prêmio (13/11): pelo menos 20 s de partida E média de no máximo 25 m/s. O ranking não muda.
  if p_score >= 500 and v_elapsed >= 20 and p_score <= floor(v_elapsed * 25) then
    insert into private.sora_daily_500_rewards (player_id, reward_day, run_id, rewarded_at)
    values (v_uid, v_today, p_run_id, v_now)
    on conflict do nothing;
    if found then
      update public.players
         set stars = stars + 25, updated_at = v_now
       where id = v_uid;
      insert into public.star_log (user_id, delta, reason)
      values (v_uid, 25, 'sora_500');
      v_credit := 25;
    else
      v_already := true;
    end if;
  end if;

  return jsonb_build_object(
    'ok',true,'score',p_score,'ranked',p_score>0,'finished_at',v_now,
    'stars_credited',v_credit,'reward_claimed_today',v_already
  );
end
$function$;

revoke all on function public.sora_run_finish(uuid, integer) from public, anon;
grant execute on function public.sora_run_finish(uuid, integer) to authenticated;
