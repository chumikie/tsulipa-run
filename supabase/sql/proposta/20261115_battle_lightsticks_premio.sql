-- PROPOSTA (não aplicada): prêmio de verdade para os lightsticks do Idol⭐Battle! (15/11/2026).
-- Só aplicar com OK explícito do dono.
--
-- Como funciona hoje: depois do resultado, o show tem 12 batidas e o jogador agita o lightstick no ritmo
-- (battle.js: ritmo.n acertos de batidas()). Isso acontece todo no aparelho; o servidor não vê as batidas.
--
-- Proposta: ★2 uma vez por dia para quem acertar 75% ou mais (9 de 12) no show de uma batalha REAL dele,
-- jogada nos últimos 10 minutos (battle_partidas ou battle_desafios com o mesmo p_requisicao).
-- Limite honesto: o número de acertos vem do aparelho, então dá para "inventar" a nota. Por isso o prêmio
-- é pequeno (★2), uma vez por dia e preso a uma batalha que o servidor registrou.
-- O controle de "uma vez por dia" usa private.bonus_jogo_dia com jogo 'ritmo'.
--
-- Depois de aplicar: no battle.js, ao terminar o show (quando o resumo do ritmo aparece), chamar
--   contaRpc('battle_ritmo_premio',{p_requisicao:requisicao,p_acertos:ritmo.n,p_total:batidas()})
-- e, se r.premio > 0, mostrar "+★2 pela torcida!" (6 idiomas) e atualizar starT com r.stars.
-- No demo.js, simular a mesma regra.

alter table private.bonus_jogo_dia drop constraint if exists bonus_jogo_dia_jogo_check;
alter table private.bonus_jogo_dia add constraint bonus_jogo_dia_jogo_check
  check (jogo = any (array['cafe'::text, 'hand'::text, 'duo'::text, 'foto'::text, 'foto_tema'::text, 'ritmo'::text]));

create or replace function public.battle_ritmo_premio(p_requisicao uuid, p_acertos int, p_total int)
 returns json
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); v_stars int; v_premio int := 0;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if p_requisicao is null or p_total is distinct from 12 or p_acertos is null or p_acertos < 0 or p_acertos > p_total then
    return pg_catalog.json_build_object('ok',false,'erro','dados'); end if;
  -- uma batalha de verdade deste jogador, de hoje, terminada há no máximo 10 minutos
  if not exists(select 1 from private.battle_partidas b where b.player_id=v_uid and b.requisicao=p_requisicao
                  and b.dia=v_dia and b.criado > now() - interval '10 minutes')
     and not exists(select 1 from private.battle_desafios d where d.desafiante=v_uid and d.requisicao=p_requisicao
                  and d.dia=v_dia and d.criado > now() - interval '10 minutes') then
    return pg_catalog.json_build_object('ok',false,'erro','batalha'); end if;
  if p_acertos * 4 >= p_total * 3 then
    insert into private.bonus_jogo_dia(user_id,jogo,dia,run_id) values(v_uid,'ritmo',v_dia,p_requisicao) on conflict do nothing;
    if found then
      v_premio := 2;
      update public.players set stars=stars+2,updated_at=now() where id=v_uid returning stars into v_stars;
      insert into public.star_log(user_id,delta,reason) values(v_uid,2,'bonus_battle_ritmo');
    end if;
  end if;
  return pg_catalog.json_build_object('ok',true,'premio',v_premio,'stars',v_stars);
end $function$;

revoke all on function public.battle_ritmo_premio(uuid,int,int) from public, anon;
grant execute on function public.battle_ritmo_premio(uuid,int,int) to authenticated;
