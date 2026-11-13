-- APLICADO EM PRODUÇÃO em 13/11/2026 com o OK do dono (migração 20261113_duo_pedido_premio).
-- Moon⭐Duo! — prêmio do "Pedido de cena do dia": ★5, uma vez por dia (horário de Brasília).
-- Conferido no servidor: só paga se hoje existe um duo registrado (public.duo_log, gravado por
-- duo_registrar) com a cena pedida. Reusa a trava diária private.bonus_jogo_dia (mesma do bônus do
-- Café/Handshake), agora aceitando também 'duo'. Teto: +★5/dia por pessoa.
alter table private.bonus_jogo_dia drop constraint if exists bonus_jogo_dia_jogo_check;
alter table private.bonus_jogo_dia add constraint bonus_jogo_dia_jogo_check check (jogo in ('cafe','hand','duo'));

create or replace function public.duo_pedido_premio(p_cena text)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); v_stars integer;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if coalesce(p_cena,'') !~ '^[a-z0-9]{1,16}$' then return pg_catalog.json_build_object('ok',false,'erro','cena'); end if;
  if not exists(select 1 from public.duo_log where de=v_uid and dia=v_dia and cena=p_cena) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_duo'); end if;
  insert into private.bonus_jogo_dia(user_id,jogo,dia,run_id) values(v_uid,'duo',v_dia,pg_catalog.gen_random_uuid())
    on conflict do nothing;
  if not found then return pg_catalog.json_build_object('ok',true,'estrelas',0,'ja',true); end if;
  update public.players set stars=stars+5,updated_at=now() where id=v_uid returning stars into v_stars;
  insert into public.star_log(user_id,delta,reason) values(v_uid,5,'bonus_duo');
  return pg_catalog.json_build_object('ok',true,'estrelas',5,'stars',v_stars);
end $f$;
revoke all on function public.duo_pedido_premio(text) from public, anon;
grant execute on function public.duo_pedido_premio(text) to authenticated, service_role;
