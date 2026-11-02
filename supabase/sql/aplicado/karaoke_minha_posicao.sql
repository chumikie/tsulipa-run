-- TsuLiPa⭐World / Karaoke⭐Time! — "minha posição" no ranking semanal (PR #58)
-- PROPOSTA PARA REVISÃO. NÃO APLICAR SEM AUTORIZAÇÃO EXPLÍCITA DA DONA DO PROJETO.
-- ATIVA no Supabase (confirmado pelo ChatGPT em 02/11/2026, com autorização da dona).
-- Função nova e só de leitura: não altera kt_ranking, tabelas, estrelas nem tickets.
-- Devolve a posição de quem está logado em cada quadro da semana atual (mesma ordem do Top 5 de kt_ranking),
-- para a sala mostrar "Você · 12º" quando a pessoa estiver fora do Top 5. Sem resultado na semana: quadro nulo.
create or replace function public.kt_minha_posicao() returns jsonb
language sql stable security definer set search_path = '' as $$
  with w as (select private.kt_domingo() as d),
  base as (
    select s.*
      from private.kt_scores s join public.players p on p.id = s.player_id, w
     where s.week_start = w.d and not coalesce(p.bloqueado, false)
  ),
  eu as (select * from base where player_id = auth.uid())
  select pg_catalog.jsonb_build_object(
    'score', (select case when e.score > 0 then pg_catalog.jsonb_build_object('pos',
        1 + (select count(*) from base b where b.score > 0 and (b.score > e.score or (b.score = e.score and b.score_at < e.score_at))),
        'valor', e.score) end from eu e),
    'combo', (select case when e.combo > 0 then pg_catalog.jsonb_build_object('pos',
        1 + (select count(*) from base b where b.combo > 0 and (b.combo > e.combo or (b.combo = e.combo and b.combo_at < e.combo_at))),
        'valor', e.combo) end from eu e),
    'acertos', (select case when e.acc > 0 then pg_catalog.jsonb_build_object('pos',
        1 + (select count(*) from base b where b.acc > 0 and (b.acc > e.acc or (b.acc = e.acc and (b.acc_hits > e.acc_hits
             or (b.acc_hits = e.acc_hits and b.acc_at < e.acc_at))))),
        'valor', e.acc) end from eu e)
  )
$$;

revoke all on function public.kt_minha_posicao() from public, anon, authenticated;
grant execute on function public.kt_minha_posicao() to authenticated;
