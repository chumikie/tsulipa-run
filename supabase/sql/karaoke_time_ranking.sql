-- Karaoke⭐Time! · ranking online da semana (domingo a sábado, horário de Brasília).
-- Três quadros, uma linha por Idol: Pontuação, Maior combo e Acertos (%).
-- O servidor conta as 5 tentativas do dia e confere cada resultado antes de aceitar.
-- Só contas Google, não bloqueadas. Nada de visitante anônimo.

create table if not exists private.kt_runs(
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  dia date not null,
  started_at timestamptz not null default clock_timestamp(),
  finished_at timestamptz
);
create index if not exists kt_runs_player_dia on private.kt_runs(player_id, dia);
alter table private.kt_runs enable row level security;

create table if not exists private.kt_scores(
  player_id uuid not null references public.players(id) on delete cascade,
  week_start date not null,
  score integer not null default 0, score_at timestamptz,
  combo integer not null default 0, combo_at timestamptz,
  acc numeric(5,2) not null default 0, acc_hits integer not null default 0, acc_at timestamptz,
  primary key(player_id, week_start)
);
create index if not exists kt_scores_week on private.kt_scores(week_start);
alter table private.kt_scores enable row level security;
revoke all on table private.kt_runs, private.kt_scores from public, anon, authenticated;

-- Domingo da semana atual (Brasília).
create or replace function private.kt_domingo() returns date
language sql stable set search_path = '' as $$
  select (pg_catalog.now() at time zone 'America/Sao_Paulo')::date
       - extract(dow from (pg_catalog.now() at time zone 'America/Sao_Paulo')::date)::integer
$$;
revoke all on function private.kt_domingo() from public, anon, authenticated;

-- Começar um show: gasta 1 das 5 tentativas do dia.
-- p_resume: o show pausado que o próprio jogo guardou (não gasta outra tentativa).
create or replace function public.kt_run_start(p_resume uuid default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := clock_timestamp();
  v_dia date := (clock_timestamp() at time zone 'America/Sao_Paulo')::date;
  v_used integer;
  v_run uuid;
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider','') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous','false') = 'true' then
    return jsonb_build_object('ok',false,'reason','login');
  end if;
  if not exists (select 1 from public.players p where p.id = v_uid and not coalesce(p.bloqueado,false)) then
    return jsonb_build_object('ok',false,'reason','perfil');
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('kt:' || v_uid::text, 0));
  delete from private.kt_runs where dia < v_dia - 2;

  if p_resume is not null then
    select r.id into v_run from private.kt_runs r
     where r.id = p_resume and r.player_id = v_uid and r.dia = v_dia
       and r.finished_at is null and r.started_at > v_now - interval '3 hours';
  end if;
  select count(*) into v_used from private.kt_runs r where r.player_id = v_uid and r.dia = v_dia;
  if v_run is not null then
    return jsonb_build_object('ok',true,'run',v_run,'resume',true,'used',v_used,'left',greatest(0,5-v_used));
  end if;
  if v_used >= 5 then
    return jsonb_build_object('ok',false,'reason','limit','used',v_used,'left',0);
  end if;
  -- Um show novo encerra qualquer outro que tenha ficado aberto.
  update private.kt_runs set finished_at = v_now where player_id = v_uid and finished_at is null;
  insert into private.kt_runs(player_id, dia, started_at) values (v_uid, v_dia, v_now) returning id into v_run;
  return jsonb_build_object('ok',true,'run',v_run,'resume',false,'used',v_used+1,'left',4-v_used);
end $$;

-- Terminar um show. Sem resultado (p_score nulo) = show encerrado antes do fim: a tentativa fica gasta.
create or replace function public.kt_run_finish(
  p_run uuid, p_score integer, p_hits integer, p_attempts integer, p_combo integer, p_notes integer
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := clock_timestamp();
  v_started timestamptz;
  v_elapsed numeric;
  v_week date := private.kt_domingo();
  v_acc numeric(5,2);
begin
  if v_uid is null or p_run is null then return jsonb_build_object('ok',false,'reason','login'); end if;
  select r.started_at into v_started from private.kt_runs r
   where r.id = p_run and r.player_id = v_uid and r.finished_at is null
   for update;
  if not found then return jsonb_build_object('ok',false,'reason','run'); end if;
  update private.kt_runs set finished_at = v_now where id = p_run;
  if p_score is null then return jsonb_build_object('ok',true,'ranked',false); end if;

  v_elapsed := extract(epoch from (v_now - v_started));
  if v_elapsed < 50 or v_elapsed > 14400
     or p_notes is null or p_notes < 1 or p_notes > 200
     or p_hits is null or p_hits < 0 or p_hits > p_notes
     or p_attempts is null or p_attempts < p_notes or p_attempts > 2000
     or p_combo is null or p_combo < 0 or p_combo > p_hits
     or p_score < p_hits * 65 or p_score > p_hits * 140
     or not exists (select 1 from public.players p where p.id = v_uid and not coalesce(p.bloqueado,false)) then
    return jsonb_build_object('ok',false,'reason','invalid');
  end if;
  v_acc := round(p_hits * 100.0 / p_attempts, 2);

  insert into private.kt_scores(player_id, week_start, score, score_at, combo, combo_at, acc, acc_hits, acc_at)
  values (v_uid, v_week, p_score, v_now, p_combo, v_now, v_acc, p_hits, v_now)
  on conflict (player_id, week_start) do update set
    score    = greatest(private.kt_scores.score, excluded.score),
    score_at = case when excluded.score > private.kt_scores.score then excluded.score_at else private.kt_scores.score_at end,
    combo    = greatest(private.kt_scores.combo, excluded.combo),
    combo_at = case when excluded.combo > private.kt_scores.combo then excluded.combo_at else private.kt_scores.combo_at end,
    acc      = case when (excluded.acc, excluded.acc_hits) > (private.kt_scores.acc, private.kt_scores.acc_hits) then excluded.acc else private.kt_scores.acc end,
    acc_hits = case when (excluded.acc, excluded.acc_hits) > (private.kt_scores.acc, private.kt_scores.acc_hits) then excluded.acc_hits else private.kt_scores.acc_hits end,
    acc_at   = case when (excluded.acc, excluded.acc_hits) > (private.kt_scores.acc, private.kt_scores.acc_hits) then excluded.acc_at else private.kt_scores.acc_at end;
  delete from private.kt_scores where week_start < v_week - 28;
  return jsonb_build_object('ok',true,'ranked',true,'accuracy',v_acc);
end $$;

-- Os três quadros da semana (top 5 cada) + as marcas e tentativas de quem pergunta.
create or replace function public.kt_ranking() returns jsonb
language sql stable security definer set search_path = '' as $$
  with w as (select private.kt_domingo() as d),
  base as (
    select s.*, coalesce(nullif(pg_catalog.btrim(p.nick),''),'Idol') as nick, p.avatar, p.cor
    from private.kt_scores s join public.players p on p.id = s.player_id, w
    where s.week_start = w.d and not coalesce(p.bloqueado,false)
  )
  select jsonb_build_object(
    'semana', to_char(w.d,'YYYY-MM-DD'),
    'fim', to_char(w.d + 6,'YYYY-MM-DD'),
    'score', coalesce((select jsonb_agg(jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score,'combo',b.combo,'accuracy',b.acc,'hits',b.acc_hits) order by b.score desc, b.score_at, b.nick)
                       from (select * from base where score > 0 order by score desc, score_at, nick limit 5) b),'[]'::jsonb),
    'combo', coalesce((select jsonb_agg(jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score,'combo',b.combo,'accuracy',b.acc,'hits',b.acc_hits) order by b.combo desc, b.combo_at, b.nick)
                       from (select * from base where combo > 0 order by combo desc, combo_at, nick limit 5) b),'[]'::jsonb),
    'acertos', coalesce((select jsonb_agg(jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score,'combo',b.combo,'accuracy',b.acc,'hits',b.acc_hits) order by b.acc desc, b.acc_hits desc, b.acc_at, b.nick)
                       from (select * from base where acc > 0 order by acc desc, acc_hits desc, acc_at, nick limit 5) b),'[]'::jsonb),
    'usados', (select count(*) from private.kt_runs r where r.player_id = auth.uid()
               and r.dia = (pg_catalog.now() at time zone 'America/Sao_Paulo')::date)
  ) from w
$$;

revoke all on function public.kt_run_start(uuid) from public, anon, authenticated;
revoke all on function public.kt_run_finish(uuid,integer,integer,integer,integer,integer) from public, anon, authenticated;
revoke all on function public.kt_ranking() from public, anon, authenticated;
grant execute on function public.kt_run_start(uuid) to authenticated;
grant execute on function public.kt_run_finish(uuid,integer,integer,integer,integer,integer) to authenticated;
grant execute on function public.kt_ranking() to authenticated;

-- Top Idols da página: o Karaoke passa a vir do Karaoke⭐Time! (top 3 de cada quadro).
create or replace function public.tw_podio_semana() returns jsonb
language sql stable security definer set search_path = '' as $function$
  with local_day as (
    select (pg_catalog.now() at time zone 'America/Sao_Paulo')::date as today
  ),
  week_window as (
    select today - extract(dow from today)::integer as sunday from local_day
  ),
  bounds as (
    select sunday,
      sunday::timestamp at time zone 'America/Sao_Paulo' as starts_at,
      (sunday + 7)::timestamp at time zone 'America/Sao_Paulo' as ends_at
    from week_window
  ),
  center_rows as (
    select p.id, coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick, max(l.score)::integer as score
    from public.leaderboard l
    join public.players p on p.id = l.user_id
    cross join bounds b
    where l.created_at >= b.starts_at and l.created_at < b.ends_at and not coalesce(p.bloqueado, false)
    group by p.id, p.nick
    order by max(l.score) desc, lower(coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol')), p.id
    limit 3
  ),
  sora_rows as (
    select p.id, coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick, s.score, s.achieved_at
    from private.sora_scores s
    join public.players p on p.id = s.player_id
    cross join bounds b
    where s.period_type = 'week' and s.week_start = b.sunday and not coalesce(p.bloqueado, false)
    order by s.score desc, s.achieved_at asc, lower(coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol')), p.id
    limit 3
  ),
  kt as (
    select k.*, coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick
    from private.kt_scores k
    join public.players p on p.id = k.player_id
    cross join bounds b
    where k.week_start = b.sunday and not coalesce(p.bloqueado, false)
  )
  select pg_catalog.jsonb_build_object(
    'semana', pg_catalog.to_char(b.sunday, 'YYYY-MM-DD'),
    'center', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', c.nick, 'score', c.score) order by c.score desc, lower(c.nick), c.id) from center_rows c), '[]'::jsonb),
    'sora', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', s.nick, 'score', s.score) order by s.score desc, s.achieved_at asc, lower(s.nick), s.id) from sora_rows s), '[]'::jsonb),
    'karaoke', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', t.nick, 'score', t.score) order by t.score desc, t.score_at, t.nick)
                         from (select * from kt where score > 0 order by score desc, score_at, nick limit 3) t), '[]'::jsonb),
    'karaoke_combo', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', t.nick, 'score', t.combo) order by t.combo desc, t.combo_at, t.nick)
                         from (select * from kt where combo > 0 order by combo desc, combo_at, nick limit 3) t), '[]'::jsonb),
    'karaoke_acertos', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', t.nick, 'score', t.acc) order by t.acc desc, t.acc_hits desc, t.acc_at, t.nick)
                         from (select * from kt where acc > 0 order by acc desc, acc_hits desc, acc_at, nick limit 3) t), '[]'::jsonb),
    'meu_sora', (select s.score from private.sora_scores s where s.player_id = auth.uid() and s.period_type = 'week' and s.week_start = b.sunday limit 1),
    -- Shows do Karaoke⭐Time! já usados hoje (o card fica rosa enquanto faltar algum).
    'meu_kt_usados', case when auth.uid() is null then null else
      (select count(*)::integer from private.kt_runs r where r.player_id = auth.uid() and r.dia = (select today from local_day)) end
  )
  from bounds b;
$function$;
