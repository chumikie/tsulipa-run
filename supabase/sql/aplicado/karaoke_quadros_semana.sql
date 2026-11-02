-- TsuLiPa⭐World / Karaoke⭐Time! — quadros "Mais shows na semana" e "Quem mais evoluiu" (PR #58)
-- PROPOSTA PARA REVISÃO. NÃO APLICAR SEM AUTORIZAÇÃO EXPLÍCITA DA DONA DO PROJETO.
-- APLICADA no Supabase em 02/11/2026 com autorização da dona (relato do ChatGPT na PR58_STATUS).
-- Depende de supabase/sql/aplicado/karaoke_musica_da_semana.sql JÁ APLICADO (kt_run_finish com p_song).
-- Antes de aplicar: conferir que o kt_run_finish ativo é o daquele arquivo. Se for diferente, NÃO aplicar.
--
-- Substituem, na tela, os quadros Acertos e Combo (que repetiam as mesmas pessoas da Pontuação).
--   * Mais shows na semana: quantos shows aceitos pelo servidor cada conta fez na semana (domingo a sábado, Brasília).
--   * Quem mais evoluiu: melhor pontuação desta semana menos a melhor da semana passada (só quem jogou nas duas
--     e melhorou). Usa private.kt_scores, que já guarda 4 semanas.
-- kt_ranking continua igual (os campos acertos/combo seguem existindo para versões antigas do site).
-- Não mexe em estrelas, tickets nem no limite de 5 shows por dia.
begin;

create table if not exists private.kt_week_shows(
  player_id uuid not null references public.players(id) on delete cascade,
  week_start date not null,
  shows integer not null default 0,
  last_at timestamptz,
  primary key(player_id, week_start)
);
create index if not exists kt_week_shows_week on private.kt_week_shows(week_start);
alter table private.kt_week_shows enable row level security;
revoke all on table private.kt_week_shows from public, anon, authenticated;

-- Mesmo kt_run_finish da música da semana, com o contador de shows.
create or replace function public.kt_run_finish(
  p_run uuid, p_score integer, p_hits integer, p_attempts integer, p_combo integer, p_notes integer,
  p_song text default null
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

  -- Mais shows na semana: conta cada show aceito (a tabela de corridas só guarda 2 dias, por isso o contador próprio).
  insert into private.kt_week_shows(player_id, week_start, shows, last_at)
  values (v_uid, v_week, 1, v_now)
  on conflict (player_id, week_start) do update set shows = private.kt_week_shows.shows + 1, last_at = excluded.last_at;
  delete from private.kt_week_shows where week_start < v_week - 28;

  -- Música da semana: só a música combinada desta semana entra no quadro extra.
  if p_song is not null and p_song = private.kt_musica_da_semana(v_week) then
    insert into private.kt_song_scores(player_id, week_start, song, score, score_at)
    values (v_uid, v_week, p_song, p_score, v_now)
    on conflict (player_id, week_start) do update set
      score    = greatest(private.kt_song_scores.score, excluded.score),
      score_at = case when excluded.score > private.kt_song_scores.score then excluded.score_at else private.kt_song_scores.score_at end;
    delete from private.kt_song_scores where week_start < v_week - 28;
  end if;
  return jsonb_build_object('ok',true,'ranked',true,'accuracy',v_acc);
end $$;
revoke all on function public.kt_run_finish(uuid, integer, integer, integer, integer, integer, text) from public, anon, authenticated;
grant execute on function public.kt_run_finish(uuid, integer, integer, integer, integer, integer, text) to authenticated;

create or replace function public.kt_quadros_semana() returns jsonb
language sql stable security definer set search_path = '' as $$
  with w as (select private.kt_domingo() as d),
  pl as (select id, coalesce(nullif(pg_catalog.btrim(nick),''),'Idol') as nick, avatar, cor from public.players where not coalesce(bloqueado, false)),
  sh as (
    select s.player_id, s.shows as valor, s.last_at as at, p.nick, p.avatar, p.cor
      from private.kt_week_shows s join pl p on p.id = s.player_id, w
     where s.week_start = w.d and s.shows > 0
  ),
  ev as (
    select a.player_id, a.score - b.score as valor, a.score_at as at, p.nick, p.avatar, p.cor
      from private.kt_scores a
      join private.kt_scores b on b.player_id = a.player_id and b.week_start = a.week_start - 7
      join pl p on p.id = a.player_id, w
     where a.week_start = w.d and a.score > 0 and b.score > 0 and a.score > b.score
  )
  select pg_catalog.jsonb_build_object(
    'shows', pg_catalog.jsonb_build_object(
      'top', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick',x.nick,'avatar',x.avatar,'cor',x.cor,'valor',x.valor) order by x.valor desc, x.at, x.nick)
                         from (select * from sh order by valor desc, at, nick limit 5) x), '[]'::jsonb),
      'eu', (select pg_catalog.jsonb_build_object('pos', 1 + (select count(*) from sh o where o.valor > e.valor or (o.valor = e.valor and o.at < e.at)), 'valor', e.valor)
               from sh e where e.player_id = auth.uid())),
    'evolucao', pg_catalog.jsonb_build_object(
      'top', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick',x.nick,'avatar',x.avatar,'cor',x.cor,'valor',x.valor) order by x.valor desc, x.at, x.nick)
                         from (select * from ev order by valor desc, at, nick limit 5) x), '[]'::jsonb),
      'eu', (select pg_catalog.jsonb_build_object('pos', 1 + (select count(*) from ev o where o.valor > e.valor or (o.valor = e.valor and o.at < e.at)), 'valor', e.valor)
               from ev e where e.player_id = auth.uid()))
  ) from w
$$;
revoke all on function public.kt_quadros_semana() from public, anon, authenticated;
grant execute on function public.kt_quadros_semana() to authenticated;

commit;
