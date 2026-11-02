-- Sora⭐Jump!: 5 últimas e 5 melhores subidas por conta (aplicado em 31/10/2026).
-- Só o servidor grava (dentro do sora_run_finish já validado); o perfil lê pelo sora_my_profile.
create table if not exists private.sora_history(
  id bigserial primary key,
  player_id uuid not null references public.players(id) on delete cascade,
  score integer not null check (score > 0 and score <= 2000000),
  finished_at timestamptz not null default now()
);
create index if not exists sora_history_player_idx on private.sora_history(player_id, finished_at desc);
alter table private.sora_history enable row level security;
revoke all on private.sora_history from public, anon, authenticated;

-- o recorde que já existe vira a primeira "melhor subida" (é uma partida real)
insert into private.sora_history(player_id, score, finished_at)
select s.player_id, s.score, s.achieved_at from private.sora_scores s
where s.period_type = 'all'
  and not exists (select 1 from private.sora_history h where h.player_id = s.player_id);

create or replace function private.sora_history_add(p_uid uuid, p_score integer, p_at timestamptz)
returns void language sql security definer set search_path to '' as $$
  insert into private.sora_history(player_id, score, finished_at) values (p_uid, p_score, p_at);
  delete from private.sora_history h
   where h.player_id = p_uid
     and h.id not in (select id from private.sora_history where player_id = p_uid order by finished_at desc, id desc limit 5)
     and h.id not in (select id from private.sora_history where player_id = p_uid order by score desc, finished_at asc limit 5);
$$;
revoke all on function private.sora_history_add(uuid, integer, timestamptz) from public, anon, authenticated;

create or replace function public.sora_run_finish(p_run_id uuid, p_score integer)
 returns jsonb language plpgsql security definer set search_path to '' as $function$
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
  return jsonb_build_object('ok',true,'score',p_score,'ranked',p_score>0,'finished_at',v_now);
end
$function$;

create or replace function public.sora_my_profile()
 returns jsonb language sql stable security definer set search_path to '' as $function$
  select jsonb_build_object(
    'nick', p.nick,
    'character', coalesce(nullif(p.look->'c','null'::jsonb), nullif(p.avatar->'c','null'::jsonb), '{}'::jsonb),
    'best', coalesce((select s.score from private.sora_scores s where s.player_id = p.id and s.period_type = 'all' limit 1), 0),
    'best_semana', coalesce((select s.score from private.sora_scores s where s.player_id = p.id and s.period_type = 'week'
       and s.week_start = (now() at time zone 'America/Sao_Paulo')::date - extract(dow from (now() at time zone 'America/Sao_Paulo')::date)::integer limit 1), 0),
    'ultimas', coalesce((select jsonb_agg(jsonb_build_object('score',h.score,'at',h.finished_at) order by h.finished_at desc)
       from (select * from private.sora_history where player_id = p.id order by finished_at desc, id desc limit 5) h), '[]'::jsonb),
    'melhores', coalesce((select jsonb_agg(jsonb_build_object('score',h.score,'at',h.finished_at) order by h.score desc, h.finished_at)
       from (select * from private.sora_history where player_id = p.id order by score desc, finished_at asc limit 5) h), '[]'::jsonb)
  )
  from public.players p
  where p.id = auth.uid()
    and not coalesce(p.bloqueado,false)
    and coalesce(auth.jwt()->'app_metadata'->>'provider','') = 'google'
    and coalesce(auth.jwt()->>'is_anonymous','false') <> 'true';
$function$;
