-- PR #49 · Sora⭐Jump!: normaliza a pontuação semanal pessoal sem alterar a regra do ranking.
-- Proposta versionada para revisão; NÃO aplicada em produção.
-- Mantém o pódio semanal já usado pela INDEX 2 e o ranking competitivo próprio do Karaoke⭐Time!.
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
    select today - extract(dow from today)::integer as sunday
    from local_day
  ),
  bounds as (
    select sunday,
      sunday::timestamp at time zone 'America/Sao_Paulo' as starts_at,
      (sunday + 7)::timestamp at time zone 'America/Sao_Paulo' as ends_at
    from week_window
  ),
  center_rows as (
    select p.id,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick,
      max(l.score)::integer as score
    from public.leaderboard l
    join public.players p on p.id = l.user_id
    cross join bounds b
    where l.created_at >= b.starts_at and l.created_at < b.ends_at
      and not coalesce(p.bloqueado, false)
    group by p.id, p.nick
    order by max(l.score) desc,
      lower(coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol')), p.id
    limit 3
  ),
  sora_rows as (
    select p.id,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick,
      s.score, s.achieved_at
    from private.sora_scores s
    join public.players p on p.id = s.player_id
    cross join bounds b
    where s.period_type = 'week' and s.week_start = b.sunday
      and not coalesce(p.bloqueado, false)
    order by s.score desc, s.achieved_at asc,
      lower(coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol')), p.id
    limit 3
  ),
  kt as (
    select k.*,
      coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as nick
    from private.kt_scores k
    join public.players p on p.id = k.player_id
    cross join bounds b
    where k.week_start = b.sunday and not coalesce(p.bloqueado, false)
  )
  select pg_catalog.jsonb_build_object(
    'semana', pg_catalog.to_char(b.sunday, 'YYYY-MM-DD'),
    'center', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', c.nick, 'score', c.score)
        order by c.score desc, lower(c.nick), c.id)
      from center_rows c
    ), '[]'::jsonb),
    'sora', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', s.nick, 'score', s.score)
        order by s.score desc, s.achieved_at asc, lower(s.nick), s.id)
      from sora_rows s
    ), '[]'::jsonb),
    'karaoke', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', t.nick, 'score', t.score)
        order by t.score desc, t.score_at, t.nick)
      from (select * from kt where score > 0 order by score desc, score_at, nick limit 3) t
    ), '[]'::jsonb),
    'karaoke_combo', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', t.nick, 'score', t.combo)
        order by t.combo desc, t.combo_at, t.nick)
      from (select * from kt where combo > 0 order by combo desc, combo_at, nick limit 3) t
    ), '[]'::jsonb),
    'karaoke_acertos', coalesce((
      select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick', t.nick, 'score', t.acc)
        order by t.acc desc, t.acc_hits desc, t.acc_at, t.nick)
      from (select * from kt where acc > 0 order by acc desc, acc_hits desc, acc_at, nick limit 3) t
    ), '[]'::jsonb),
    'meu_sora', coalesce((
      select s.score
      from private.sora_scores s
      where s.player_id = auth.uid()
        and s.period_type = 'week'
        and s.week_start = b.sunday
      limit 1
    ), 0),
    'meu_kt_usados', case when auth.uid() is null then null else
      (select count(*)::integer from private.kt_runs r
        where r.player_id = auth.uid()
          and r.dia = (select today from local_day))
    end
  )
  from bounds b;
$function$;

revoke all on function public.tw_podio_semana() from public;
grant execute on function public.tw_podio_semana() to anon, authenticated;

comment on function public.tw_podio_semana() is
  'Pódio semanal público; usa domingo a sábado em America/Sao_Paulo e devolve meu_sora=0 quando a conta ainda não pontuou.';

commit;
