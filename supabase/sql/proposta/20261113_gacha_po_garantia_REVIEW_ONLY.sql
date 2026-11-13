-- Star⭐Gacha! — PROPOSTA PARA REVISÃO, NÃO EXECUTAR SEM APROVAÇÃO EXPLÍCITA.
-- Auditada a partir de pg_get_functiondef(public.gacha_girar) em 13/11/2026.
-- Valores: uma cópia repetida -> 1 pó; 5 pós -> 1 card faltante;
-- sete dias de resultado 'nada' -> oitavo giro diário sem 'nada'.
-- NÃO muda ★, ticket, probabilidades existentes nem o limite de 1 giro/dia.
-- ATENÇÃO: funções públicas de SECURITY DEFINER só acessíveis a authenticated.
begin;

create table if not exists private.gacha_po_saldo (
  user_id uuid primary key references public.players(id) on delete cascade,
  saldo integer not null default 0 check (saldo >= 0),
  alterado timestamptz not null default now()
);
alter table private.gacha_po_saldo enable row level security;
revoke all on private.gacha_po_saldo from public, anon, authenticated;

create table if not exists private.gacha_po_log (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.players(id) on delete cascade,
  requisicao uuid not null,
  tipo text not null check (tipo in ('converter', 'resgatar')),
  nick text not null,
  delta integer not null check (
    (tipo = 'converter' and delta = 1) or (tipo = 'resgatar' and delta = -5)
  ),
  criado timestamptz not null default now(),
  unique (user_id, requisicao)
);
alter table private.gacha_po_log enable row level security;
revoke all on private.gacha_po_log from public, anon, authenticated;

create or replace function public.gacha_po_status()
returns json
language plpgsql stable security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_saldo int;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select saldo into v_saldo from private.gacha_po_saldo where user_id=v_uid;
  return pg_catalog.json_build_object('ok',true,'po',coalesce(v_saldo,0),'custo_troca',5);
end $f$;

-- A pessoa escolhe qual card repetido converte. Usa o MESMO lock do sistema
-- já existente de troca entre usuários (propor_troca/responder_troca).
create or replace function public.gacha_converter_repetido(p_nick text, p_requisicao uuid)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare
  v_uid uuid := auth.uid();
  v_chave text := lower(pg_catalog.btrim(coalesce(p_nick,'')));
  v_qtd integer;
  v_saldo integer;
  v_existente record;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if p_requisicao is null or v_chave='' or length(v_chave)>48 then
    return pg_catalog.json_build_object('ok',false,'erro','parametros'); end if;
  perform pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_uid::text));
  if not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select * into v_existente from private.gacha_po_log
    where user_id=v_uid and requisicao=p_requisicao;
  if found then
    if v_existente.tipo<>'converter' or v_existente.nick<>v_chave then
      return pg_catalog.json_build_object('ok',false,'erro','requisicao_reutilizada'); end if;
    select saldo into v_saldo from private.gacha_po_saldo where user_id=v_uid;
    return pg_catalog.json_build_object('ok',true,'repetido',true,'po',coalesce(v_saldo,0));
  end if;
  -- Só converte cards do Gacha; não usa aniversários para gerar pó.
  if not exists(select 1 from public.gacha g
      where g.user_id=v_uid and g.tipo='card' and lower(pg_catalog.btrim(g.valor))=v_chave)
     or private.cards_qtd(v_uid,v_chave)<2 then
    return pg_catalog.json_build_object('ok',false,'erro','sem_repetido'); end if;
  insert into public.card_movimentos(user_id,chave,delta)
    values(v_uid,v_chave,-1);
  insert into private.gacha_po_saldo(user_id,saldo) values(v_uid,1)
    on conflict(user_id) do update set saldo=private.gacha_po_saldo.saldo+1,alterado=now()
    returning saldo into v_saldo;
  insert into private.gacha_po_log(user_id,requisicao,tipo,nick,delta)
    values(v_uid,p_requisicao,'converter',v_chave,1);
  return pg_catalog.json_build_object('ok',true,'po',v_saldo,'convertido',v_chave);
end $f$;

create or replace function public.gacha_resgatar_card(p_nick text,p_requisicao uuid)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare
  v_uid uuid := auth.uid();
  v_chave text := lower(pg_catalog.btrim(coalesce(p_nick,'')));
  v_saldo integer;
  v_nome text;
  v_existente record;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if p_requisicao is null or v_chave='' or length(v_chave)>48 then
    return pg_catalog.json_build_object('ok',false,'erro','parametros'); end if;
  perform pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_uid::text));
  if not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select * into v_existente from private.gacha_po_log
    where user_id=v_uid and requisicao=p_requisicao;
  if found then
    if v_existente.tipo<>'resgatar' or v_existente.nick<>v_chave then
      return pg_catalog.json_build_object('ok',false,'erro','requisicao_reutilizada'); end if;
    select saldo into v_saldo from private.gacha_po_saldo where user_id=v_uid;
    return pg_catalog.json_build_object('ok',true,'repetido',true,'po',coalesce(v_saldo,0),'card',public.gacha_card(v_chave));
  end if;
  -- Somente Idol ativo, diferente do jogador; só se ainda faltar no álbum.
  select nick into v_nome from public.players
    where lower(pg_catalog.btrim(nick))=v_chave and id<>v_uid
      and avatar is not null and not coalesce(bloqueado,false);
  if v_nome is null then return pg_catalog.json_build_object('ok',false,'erro','card_indisponivel'); end if;
  if private.cards_qtd(v_uid,v_chave)>0 then
    return pg_catalog.json_build_object('ok',false,'erro','ja_possui'); end if;
  update private.gacha_po_saldo set saldo=saldo-5,alterado=now()
    where user_id=v_uid and saldo>=5 returning saldo into v_saldo;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','po_insuficiente'); end if;
  -- Integra imediatamente com album_cards(): ela já soma card_movimentos.
  insert into public.card_movimentos(user_id,chave,delta)
    values(v_uid,v_chave,1);
  insert into private.gacha_po_log(user_id,requisicao,tipo,nick,delta)
    values(v_uid,p_requisicao,'resgatar',v_chave,-5);
  return pg_catalog.json_build_object('ok',true,'po',v_saldo,'card',public.gacha_card(v_nome));
end $f$;

-- Mantém exatamente as distribuições e ações existentes; só impede "nada"
-- no giro após sete "nada" consecutivos. No estado atual, "nada" só aparece
-- quando não há Idol elegível no ramo de card.
create or replace function public.gacha_girar()
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare
  r numeric := pg_catalog.random();
  t text; v text; p public.players;
  v_balance integer; v_sete_nada boolean;
begin
  select * into p from public.players
    where id=auth.uid() and not coalesce(bloqueado,false) for update;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if exists(select 1 from public.gacha where user_id=auth.uid() and dia=public.hoje_br())
    then return pg_catalog.json_build_object('ok',false,'erro','hoje'); end if;
  select count(*)=7 and count(*) filter (where tipo='nada')=7 into v_sete_nada
    from (select tipo from public.gacha where user_id=auth.uid() order by dia desc limit 7) h;
  if r<.40 then
    select nick into v from public.players where avatar is not null and not coalesce(bloqueado,false)
      and id<>auth.uid() order by pg_catalog.random() limit 1;
    if v is not null then t:='card';
    elsif v_sete_nada then t:='estrelas';v:='5';
    else t:='nada';v:=(pg_catalog.floor(pg_catalog.random()*8))::integer::text;end if;
  elsif r<.80 then t:='estrelas';v:=(5+pg_catalog.floor(pg_catalog.random()*11))::integer::text;
  elsif r<.92 then t:='estrelas';v:=(20+pg_catalog.floor(pg_catalog.random()*21))::integer::text;
  elsif r<.95 then t:='bonus';v:=(array['ima','escudo','fever'])[1+pg_catalog.floor(pg_catalog.random()*3)::integer];
  else t:='ticket';v:='1';end if;
  if t='ticket' then
    insert into private.kt_ticket_wallet(player_id,balance) values(auth.uid(),1)
      on conflict(player_id) do update set balance=private.kt_ticket_wallet.balance+1,
        updated_at=clock_timestamp() where private.kt_ticket_wallet.balance<99
      returning balance into v_balance;
    if found then insert into private.kt_ticket_events(player_id,actor_id,delta,reason)
        values(auth.uid(),auth.uid(),1,'gacha');
    else t:='estrelas';v:='5'; end if;
  end if;
  insert into public.gacha(user_id,dia,tipo,valor) values(auth.uid(),public.hoje_br(),t,v);
  if t='estrelas' then
    update public.players set stars=stars+v::integer,updated_at=now() where id=auth.uid() returning * into p;
    insert into public.star_log(user_id,delta,reason) values(auth.uid(),v::integer,'gacha');
  elsif t='bonus' then
    update public.players set bonus_corrida=v where id=auth.uid();
  end if;
  return pg_catalog.json_build_object('ok',true,'tipo',t,'valor',v,'stars',p.stars,
    'tickets',v_balance,'card',case when t='card' then public.gacha_card(v) end);
end $f$;

-- Grants restritos para RPCs expostas. Não expor as tabelas privadas.
revoke all on function public.gacha_po_status() from public, anon;
revoke all on function public.gacha_converter_repetido(text,uuid) from public, anon;
revoke all on function public.gacha_resgatar_card(text,uuid) from public, anon;
grant execute on function public.gacha_po_status() to authenticated;
grant execute on function public.gacha_converter_repetido(text,uuid) to authenticated;
grant execute on function public.gacha_resgatar_card(text,uuid) to authenticated;
-- Preservar acesso já existente a gacha_girar; revisar privilégios antes de aplicar.
commit;
