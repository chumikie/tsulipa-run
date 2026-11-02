-- TsuLiPa⭐World / Karaoke⭐Time! — "Música da semana" (PR #58)
-- PROPOSTA PARA REVISÃO. NÃO APLICAR SEM AUTORIZAÇÃO EXPLÍCITA DA DONA DO PROJETO.
-- APLICADA no Supabase em 02/11/2026 com autorização da dona (relato do ChatGPT na PR58_STATUS).
-- Antes de aplicar: conferir que a função ativa public.kt_run_finish é a de supabase/sql/karaoke_time_ranking.sql
-- (mesmos parâmetros e mesmo corpo). Se for diferente, NÃO aplicar: ajustar esta proposta primeiro.
--
-- O que faz:
--   * private.kt_musica_da_semana(semana): a música da semana, igual à do site (karaoke-room-views.js):
--     semana de domingo 01/11/2026 = Liberdade → Moon⭐Duo!; depois Tailândia → Brilha Comigo; Harajuku → Love × Debut;
--     Praia → Star⭐Gacha!; Gigoia → Doce Melodia; e assim por diante, trocando todo domingo à 0h de Brasília.
--   * kt_run_finish ganha o parâmetro opcional p_song. O resto do corpo é o mesmo (mesmas conferências, mesmo ranking).
--     Se p_song for a música da semana e o resultado for aceito, guarda o melhor resultado da conta nessa música.
--     Sites antigos (sem p_song) continuam funcionando: o parâmetro tem valor padrão.
--   * public.kt_musica_semana(): Top 5 da música da semana + a posição de quem pergunta.
-- Não mexe em estrelas, tickets, no limite de 5 shows por dia nem nos três quadros atuais.
-- Limite conhecido: o servidor confia na música informada pelo site (como já confia na pontuação dentro das faixas
-- conferidas). A conferência de notas por show (1 a 200) continua valendo para todas as músicas.
begin;

create table if not exists private.kt_song_scores(
  player_id uuid not null references public.players(id) on delete cascade,
  week_start date not null,
  song text not null,
  score integer not null default 0,
  score_at timestamptz,
  primary key(player_id, week_start)
);
create index if not exists kt_song_scores_week on private.kt_song_scores(week_start);
alter table private.kt_song_scores enable row level security;
revoke all on table private.kt_song_scores from public, anon, authenticated;

create or replace function private.kt_musica_da_semana(p_week date) returns text
language sql immutable set search_path = '' as $$
  select (array['chill','duo','normal','fast','gacha'])[
    1 + (((((p_week - date '2026-11-01') / 7) + 1) % 5) + 5) % 5
  ]
$$;
revoke all on function private.kt_musica_da_semana(date) from public, anon, authenticated;

-- Troca de assinatura: a versão antiga (6 parâmetros) sai e entra a nova, com p_song opcional.
drop function if exists public.kt_run_finish(uuid, integer, integer, integer, integer, integer);
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

create or replace function public.kt_musica_semana() returns jsonb
language sql stable security definer set search_path = '' as $$
  with w as (select private.kt_domingo() as d),
  base as (
    select s.*, coalesce(nullif(pg_catalog.btrim(p.nick),''),'Idol') as nick, p.avatar, p.cor
      from private.kt_song_scores s join public.players p on p.id = s.player_id, w
     where s.week_start = w.d and s.score > 0 and not coalesce(p.bloqueado, false)
  ),
  eu as (select * from base where player_id = auth.uid())
  select pg_catalog.jsonb_build_object(
    'musica', private.kt_musica_da_semana(w.d),
    'semana', pg_catalog.to_char(w.d,'YYYY-MM-DD'),
    'fim', pg_catalog.to_char(w.d + 6,'YYYY-MM-DD'),
    'top', coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score) order by b.score desc, b.score_at, b.nick)
                       from (select * from base order by score desc, score_at, nick limit 5) b), '[]'::jsonb),
    'eu', (select pg_catalog.jsonb_build_object('pos',
             1 + (select count(*) from base b where b.score > e.score or (b.score = e.score and b.score_at < e.score_at)),
             'valor', e.score) from eu e)
  ) from w
$$;
revoke all on function public.kt_musica_semana() from public, anon, authenticated;
grant execute on function public.kt_musica_semana() to authenticated;

commit;
