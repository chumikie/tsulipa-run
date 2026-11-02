-- Sora⭐Jump!: o perfil da conta passa a trazer o recorde (best) e o melhor da semana (best_semana),
-- para o menu do Sora mostrar o mesmo recorde em qualquer aparelho. Só leitura; aplicado em 30/10/2026.
create or replace function public.sora_my_profile() returns jsonb
language sql stable security definer set search_path to '' as $function$
  select jsonb_build_object(
    'nick', p.nick,
    'character', coalesce(nullif(p.look->'c','null'::jsonb), nullif(p.avatar->'c','null'::jsonb), '{}'::jsonb),
    'best', coalesce((select s.score from private.sora_scores s where s.player_id = p.id and s.period_type = 'all' limit 1), 0),
    'best_semana', coalesce((select s.score from private.sora_scores s where s.player_id = p.id and s.period_type = 'week'
       and s.week_start = (now() at time zone 'America/Sao_Paulo')::date - extract(dow from (now() at time zone 'America/Sao_Paulo')::date)::integer limit 1), 0)
  )
  from public.players p
  where p.id = auth.uid()
    and not coalesce(p.bloqueado,false)
    and coalesce(auth.jwt()->'app_metadata'->>'provider','') = 'google'
    and coalesce(auth.jwt()->>'is_anonymous','false') <> 'true';
$function$;
