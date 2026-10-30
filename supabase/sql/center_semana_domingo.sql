-- Center⭐Run!: a aba "Semana" passa a contar de domingo 00h (Brasília), igual ao Top Idols,
-- ao Sora⭐Jump! e ao Karaoke⭐Time!. Nada é apagado: só muda o dia em que a lista começa.
-- Antes: date_trunc('week') = segunda-feira.
create or replace function public.top_scores(periodo text)
 returns table(name text, score bigint, stars integer, "char" text)
 language sql stable security definer
 set search_path to 'public'
as $function$
  select * from (
    select distinct on (lower(trim(l.name))) l.name, l.score, l.stars, l."char"
    from public.leaderboard l
    where (case periodo
      when 'day'  then l.created_date::text = to_char(now() at time zone 'America/Sao_Paulo','YYYY-MM-DD')
      when 'week' then l.created_date::text >= to_char(
        (now() at time zone 'America/Sao_Paulo')::date
        - extract(dow from (now() at time zone 'America/Sao_Paulo')::date)::integer, 'YYYY-MM-DD')
      else true end)
      and not exists (select 1 from public.players b where b.id = l.user_id and b.bloqueado)
    order by lower(trim(l.name)), l.score desc
  ) t
  order by score desc
  limit 15;
$function$;
