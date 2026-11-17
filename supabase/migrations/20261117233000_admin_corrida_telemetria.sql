-- Telinha da admin: por que as corridas do Center⭐Run terminam e como vão as metas curtas (17/11/2026).
-- Lê runs.causa ("obstáculo:ar|chao:vNN[:pad]") e runs.meta ("meta:ok" ou "meta:feito-alvo"), gravadas por corrida_telemetria.
create or replace function public.admin_corrida_telemetria(p_dias int default 7)
returns json
language sql
stable
security definer
set search_path to ''
as $$
  with r as (
    select split_part(causa, ':', 1) as obst,
           split_part(causa, ':', 2) as onde,
           nullif(regexp_replace(split_part(causa, ':', 3), '[^0-9]', '', 'g'), '')::int as vel,
           causa like '%:pad' as pad,
           nullif(split_part(meta, ':', 1), '') as mk,
           split_part(meta, ':', 2) = 'ok' as mok
      from public.runs
     where causa is not null
       and finished_at > now() - make_interval(days => greatest(1, least(coalesce(p_dias, 7), 60)))
  )
  select case when not public.eh_admin() then json_build_object('ok', false) else json_build_object('ok', true,
    'dias', greatest(1, least(coalesce(p_dias, 7), 60)),
    'total', (select count(*) from r),
    'no_ar', (select count(*) from r where onde = 'ar'),
    'padrao', (select count(*) from r where pad),
    'vel_media', (select round(avg(vel)) from r),
    'obstaculos', coalesce((select json_agg(o order by o.n desc) from (select obst as k, count(*) as n, round(avg(vel)) as vel from r group by obst order by count(*) desc limit 8) o), '[]'::json),
    'metas', coalesce((select json_agg(m order by m.n desc) from (select mk as k, count(*) as n, count(*) filter (where mok) as ok from r where mk is not null group by mk) m), '[]'::json)
  ) end;
$$;
revoke all on function public.admin_corrida_telemetria(int) from public, anon;
grant execute on function public.admin_corrida_telemetria(int) to authenticated;
