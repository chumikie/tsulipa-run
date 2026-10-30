-- TsuLiPa⭐World · integração do ranking Sora com Perfil e TsuLiPa TV
-- Complementa sora_jump_online_ranking.sql já aplicado na produção.
-- Não cria uma segunda tabela de pontuação: lê private.sora_scores.
-- Center continua sendo agregado de public.leaderboard na janela semanal da TV.
-- Karaoke permanece sem pontuação competitiva até seu backend próprio ser aprovado.

begin;

create or replace function public.tw_podio_semana()
returns jsonb
language sql
stable
security definer
set search_path = ''
as $function$
  with local_day as (
    select (pg_catalog.now() at time zone 'America/Sao_Paulo')::date as today
  ),
  week_window as (
    select
      today - pg_catalog.extract(dow from today)::integer as sunday
    from local_day
  ),
  bounds as (
    select
      sunday,
      sunday::timestamp at time zone 'America/Sao_Paulo' as starts_at,
      (sunday + 7)::timestamp at time zone 'America/Sao_Paulo' as ends_at
    from week_window
  ),
  center_rows as (
    select
      p.id,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick,
      max(l.score)::integer as score
    from public.leaderboard l
    join public.players p on p.id = l.user_id
    cross join bounds b
    where l.created_at >= b.starts_at
      and l.created_at < b.ends_at
      and not coalesce(p.bloqueado, false)
    group by p.id, p.nick
    order by max(l.score) desc, lower(coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol')), p.id
    limit 3
  ),
  sora_rows as (
    select
      p.id,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick,
      s.score,
      s.achieved_at
    from private.sora_scores s
    join public.players p on p.id = s.player_id
    cross join bounds b
    where s.period_type = 'week'
      and s.week_start = b.sunday
      and not coalesce(p.bloqueado, false)
    order by s.score desc, s.achieved_at asc,
             lower(coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol')), p.id
    limit 3
  )
  select pg_catalog.jsonb_build_object(
    'semana', pg_catalog.to_char(b.sunday, 'YYYY-MM-DD'),
    'center', coalesce((
      select pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object('nick', c.nick, 'score', c.score)
        order by c.score desc, lower(c.nick), c.id
      ) from center_rows c
    ), '[]'::jsonb),
    'sora', coalesce((
      select pg_catalog.jsonb_agg(
        pg_catalog.jsonb_build_object('nick', s.nick, 'score', s.score)
        order by s.score desc, s.achieved_at asc, lower(s.nick), s.id
      ) from sora_rows s
    ), '[]'::jsonb),
    'karaoke', '[]'::jsonb,
    'meu_sora', (
      select s.score
      from private.sora_scores s
      where s.player_id = auth.uid()
        and s.period_type = 'week'
        and s.week_start = b.sunday
      limit 1
    )
  )
  from bounds b;
$function$;

revoke all on function public.tw_podio_semana() from public, anon, authenticated;
grant execute on function public.tw_podio_semana() to anon, authenticated;

commit;
