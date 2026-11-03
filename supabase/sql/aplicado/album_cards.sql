-- TsuLiPa⭐World — Star⭐Gacha! / Registro de SQL APLICADO
-- Fonte revisada: supabase/sql/proposta/album_cards_REVIEW_ONLY.sql (PR #71)
-- Projeto Supabase: fsggtvgbyhchblyazgmt
-- Aplicado e confirmado: 03/11/2026, migration 20261103150626_create_album_cards_authenticated_readonly.
-- Este arquivo registra o estado aplicado; não executar novamente automaticamente.
-- RPC de leitura de histórico, só authenticated (não anon); sem alteração de saldos, estrelas, missões ou giros.

create or replace function public.album_cards()
returns json
language sql
stable
security definer
set search_path to ''
as $function$
  with aquisicoes as (
    select lower(btrim(g.valor)) as chave,
           btrim(g.valor) as nick,
           'card'::text as tipo,
           g.created_at as quando
    from public.gacha g
    where g.user_id = (select auth.uid())
      and g.tipo = 'card'
      and nullif(btrim(g.valor), '') is not null

    union all

    select lower(btrim(p.nick)) as chave,
           p.nick as nick,
           'aniver'::text as tipo,
           a.em as quando
    from public.aniver_presentes a
    join public.players p on p.id = a.user_id
    where a.user_id = (select auth.uid())
  ),
  ordenadas as (
    select a.*,
           count(*) over (partition by a.chave)::integer as vezes,
           min(a.quando) over (partition by a.chave) as primeira,
           row_number() over (
             partition by a.chave
             order by a.quando desc, case when a.tipo = 'aniver' then 0 else 1 end
           ) as ordem
    from aquisicoes a
  )
  select coalesce(
    json_agg(
      json_build_object(
        'card', public.gacha_card(p.nick),
        'tipo', o.tipo,
        'dia', o.quando::date,
        'vezes', o.vezes,
        'primeira', o.primeira
      )
      order by o.quando desc, p.nick
    ),
    '[]'::json
  )
  from ordenadas o
  join public.players p on lower(btrim(p.nick)) = o.chave
  where o.ordem = 1
    and (select auth.uid()) is not null
$function$;

revoke all on function public.album_cards() from public, anon;
grant execute on function public.album_cards() to authenticated;
