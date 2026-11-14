-- APLICADO EM PRODUÇÃO em 14/11/2026 com o OK do dono (migração 20261114_idol_battle_ranking).
-- Idol⭐Battle! — Top da Arena (ranking semanal de vitórias).
-- Só leitura: conta as vitórias da semana (domingo 00h de Brasília, igual ao Top Idols)
-- em private.battle_partidas. Não cria prêmio, não altera battle_status/battle_jogar.
-- Mostra apenas nick, vitórias e partidas; contas bloqueadas ficam fora.

create index if not exists battle_partidas_dia_idx on private.battle_partidas(dia);

create or replace function public.battle_ranking() returns jsonb
language sql stable security definer set search_path to ''
as $fn$
  with ini as (
    select public.hoje_br() - extract(dow from public.hoje_br())::int as d
  ), placar as (
    select p.id, p.nick,
      (count(*) filter (where b.vitoria))::int as vitorias,
      count(*)::int as partidas
    from private.battle_partidas b
    join public.players p on p.id=b.player_id
    cross join ini
    where b.dia>=ini.d and not coalesce(p.bloqueado,false) and p.nick is not null
    group by p.id,p.nick
    having count(*) filter (where b.vitoria)>0
  ), ordem as (
    -- desempate: quem precisou de menos partidas; depois ordem alfabética (estável)
    select pl.*, (row_number() over(order by pl.vitorias desc, pl.partidas, lower(pl.nick)))::int as pos
    from placar pl
  )
  select jsonb_build_object('ok',true,'inicio',(select d from ini),
    'top',coalesce((select jsonb_agg(jsonb_build_object(
        'pos',o.pos,'nick',o.nick,'score',o.vitorias,'partidas',o.partidas) order by o.pos)
      from ordem o where o.pos<=10),'[]'::jsonb),
    'eu',(select jsonb_build_object('pos',o.pos,'score',o.vitorias,'partidas',o.partidas)
      from ordem o where o.id=auth.uid()))
$fn$;

revoke all on function public.battle_ranking() from public,anon;
grant execute on function public.battle_ranking() to authenticated;
