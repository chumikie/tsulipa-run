-- Aplicado em 31/10/2026 ~08h52 (Brasília): "ranking de abertura".
-- Os rankings de semana/dia (Center, Sora, Karaoke, Top Idols, TV e rádio) só contam o que foi feito
-- depois de config.ranking_inicio. Rankings gerais (de sempre) não mudaram. Nada foi apagado.
-- A partir da semana que começa em 01/11 o corte não tem mais efeito (é anterior ao domingo).
insert into public.config(chave, valor) values ('ranking_inicio', to_jsonb(now()::text))
on conflict (chave) do update set valor = excluded.valor;

create or replace function private.ranking_inicio() returns timestamptz language sql stable set search_path to '' as $$
  select coalesce((select (c.valor #>> '{}')::timestamptz from public.config c where c.chave = 'ranking_inicio'), '-infinity'::timestamptz);
$$;
revoke all on function private.ranking_inicio() from public, anon, authenticated;

-- top_scores (day/week): and l.created_at >= private.ranking_inicio()
-- sora_ranking (week):    and s.achieved_at >= private.ranking_inicio()
-- kt_ranking:             score_at / combo_at / acc_at >= private.ranking_inicio()
-- tw_podio_semana:        os mesmos filtros nas listas da semana
-- (aplicado com replace() sobre pg_get_functiondef, sem reescrever o resto das funções)
