-- Center⭐Run!: onde as pessoas perdem (17/11/2026).
-- A duração já sai de runs.started_at/finished_at; aqui entram o motivo da batida e a meta da corrida.
-- Função separada da terminar_corrida (que credita estrelas), para não mexer nela: só anota numa corrida
-- da própria pessoa, já terminada há no máximo 10 minutos, e uma vez só.
alter table public.runs add column if not exists causa text;
alter table public.runs add column if not exists meta text;

create or replace function public.corrida_telemetria(p_run uuid, p_causa text, p_meta text)
returns boolean
language sql
security definer
set search_path to ''
as $$
  with feito as (
    update public.runs
       set causa = left(regexp_replace(coalesce(p_causa, ''), '[^a-z0-9_:.-]', '', 'g'), 32),
           meta  = left(regexp_replace(coalesce(p_meta, ''), '[^a-z0-9_:.-]', '', 'g'), 32)
     where id = p_run and user_id = auth.uid()
       and finished_at is not null and finished_at > now() - interval '10 minutes'
       and causa is null
    returning 1)
  select exists(select 1 from feito);
$$;
revoke all on function public.corrida_telemetria(uuid, text, text) from public, anon;
grant execute on function public.corrida_telemetria(uuid, text, text) to authenticated;

-- Para consultar: onde se perde, por tipo de obstáculo e faixa de tempo
-- select causa, count(*), round(avg(extract(epoch from finished_at - started_at))) as seg_medio
--   from public.runs where causa is not null group by 1 order by 2 desc;
