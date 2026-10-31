-- HISTORICO DA PROPOSTA REVISADA NA PR #52; APROVADO E APLICADO NO SUPABASE.
-- Migracao registrada em producao: 20261031151827_karaoke_tickets_extra_shows_inventory_gacha.
-- Nao executar novamente manualmente; este arquivo preserva o SQL aprovado.
-- Precondicoes: supabase/sql/karaoke_time_ranking.sql aplicado, tabelas public.players,
-- public.gacha, public.admins e public.admin_log e RPC public.eh_admin() existentes.
-- Todo saldo, sorteio, presente e gasto e transacional e pertence ao servidor.

begin;

create table if not exists private.kt_ticket_wallet (
  player_id uuid primary key references public.players(id) on delete cascade,
  balance integer not null default 0 check (balance between 0 and 99),
  updated_at timestamptz not null default now()
);
create table if not exists private.kt_ticket_events (
  id bigint generated always as identity primary key,
  player_id uuid not null references public.players(id) on delete cascade,
  actor_id uuid references public.players(id) on delete set null,
  other_player_id uuid references public.players(id) on delete set null,
  delta integer not null check (delta <> 0 and delta between -20 and 20),
  reason text not null check (reason in ('gacha','gift_sent','gift_received','moderation','show')),
  run_id uuid,
  created_at timestamptz not null default clock_timestamp()
);
create index if not exists kt_ticket_events_player_date on private.kt_ticket_events(player_id,created_at desc);
alter table private.kt_ticket_wallet enable row level security;
alter table private.kt_ticket_events enable row level security;
revoke all on table private.kt_ticket_wallet,private.kt_ticket_events from public,anon,authenticated;
revoke all on sequence private.kt_ticket_events_id_seq from public,anon,authenticated;

-- O contador das 5 gratuitas nunca inclui apresentações pagas com ticket.
alter table private.kt_runs add column if not exists payment_kind text not null default 'free'
  check (payment_kind in ('free','ticket'));
alter table private.kt_runs add column if not exists ticket_request uuid;
create unique index if not exists kt_runs_ticket_request_unique
  on private.kt_runs(player_id,ticket_request) where ticket_request is not null;
create index if not exists kt_runs_free_quota on private.kt_runs(player_id,dia,payment_kind);

-- Nao aceita client informando jogador ou quantidade de saldo.
create or replace function public.kt_ticket_wallet() returns jsonb
language plpgsql stable security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_balance integer;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false))
    then return pg_catalog.jsonb_build_object('ok',false,'reason','login'); end if;
  select w.balance into v_balance from private.kt_ticket_wallet w where w.player_id=v_uid;
  return pg_catalog.jsonb_build_object('ok',true,'tickets',coalesce(v_balance,0),'limit',99);
end $$;

-- Jogador presenteia outro Idol com 1 ticket por vez; bloqueados e auto-presente nao passam.
-- O par de carteiras e travado em ordem, impedindo duplicacao/deadlocks entre presentes.
create or replace function public.kt_ticket_gift(p_nick text) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_from uuid := auth.uid(); v_to uuid; v_nick text;
        v_from_balance integer; v_to_balance integer;
begin
  if v_from is null or coalesce(auth.jwt()->>'is_anonymous','false')='true'
    or not exists(select 1 from public.players where id=v_from and not coalesce(bloqueado,false))
    then return pg_catalog.jsonb_build_object('ok',false,'reason','login'); end if;
  if pg_catalog.length(pg_catalog.btrim(coalesce(p_nick,''))) not between 2 and 24
    then return pg_catalog.jsonb_build_object('ok',false,'reason','nick'); end if;
  select p.id,p.nick into v_to,v_nick from public.players p
    where pg_catalog.lower(p.nick)=pg_catalog.lower(pg_catalog.btrim(p_nick))
      and not coalesce(p.bloqueado,false) limit 1;
  if v_to is null or v_to=v_from then return pg_catalog.jsonb_build_object('ok',false,'reason','destino'); end if;
  insert into private.kt_ticket_wallet(player_id,balance) values(v_to,0) on conflict do nothing;
  -- Ordenar as linhas de bloqueio torna presentes cruzados seguros.
  perform w.player_id from private.kt_ticket_wallet w where w.player_id in(v_from,v_to)
    order by w.player_id for update;
  select balance into v_from_balance from private.kt_ticket_wallet where player_id=v_from;
  select balance into v_to_balance from private.kt_ticket_wallet where player_id=v_to;
  if coalesce(v_from_balance,0)<1 then return pg_catalog.jsonb_build_object('ok',false,'reason','saldo'); end if;
  if coalesce(v_to_balance,0)>=99 then return pg_catalog.jsonb_build_object('ok',false,'reason','teto'); end if;
  update private.kt_ticket_wallet set balance=balance-1,updated_at=clock_timestamp() where player_id=v_from;
  update private.kt_ticket_wallet set balance=balance+1,updated_at=clock_timestamp() where player_id=v_to;
  insert into private.kt_ticket_events(player_id,actor_id,other_player_id,delta,reason)
    values(v_from,v_from,v_to,-1,'gift_sent'),(v_to,v_from,v_from,1,'gift_received');
  return pg_catalog.jsonb_build_object('ok',true,'tickets',v_from_balance-1,'to',v_nick);
end $$;

-- Moderacao pode conceder tickets a uma pessoa (nao abre saque de moeda/estrelas).
create or replace function public.kt_ticket_admin_grant(p_nick text,p_count integer default 1,p_reason text default '') returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_to uuid; v_nick text; v_balance integer;
begin
  if auth.uid() is null or not coalesce(public.eh_admin(),false) then
    return pg_catalog.jsonb_build_object('ok',false,'reason','admin'); end if;
  if p_count is null or p_count not between 1 and 20 or pg_catalog.length(pg_catalog.btrim(coalesce(p_nick,''))) not between 2 and 24 then
    return pg_catalog.jsonb_build_object('ok',false,'reason','valor'); end if;
  select id,nick into v_to,v_nick from public.players
    where pg_catalog.lower(nick)=pg_catalog.lower(pg_catalog.btrim(p_nick)) and not coalesce(bloqueado,false) limit 1;
  if v_to is null then return pg_catalog.jsonb_build_object('ok',false,'reason','perfil'); end if;
  insert into private.kt_ticket_wallet(player_id,balance) values(v_to,p_count)
    on conflict(player_id) do update set balance=private.kt_ticket_wallet.balance+excluded.balance,
      updated_at=clock_timestamp() where private.kt_ticket_wallet.balance+excluded.balance<=99
    returning balance into v_balance;
  if not found then return pg_catalog.jsonb_build_object('ok',false,'reason','teto'); end if;
  insert into private.kt_ticket_events(player_id,actor_id,delta,reason)
    values(v_to,auth.uid(),p_count,'moderation');
  insert into public.admin_log(admin,acao,alvo,valor,motivo)
    values(auth.uid(),'karaoke_ticket',v_nick,p_count::text,pg_catalog.left(coalesce(p_reason,''),80));
  return pg_catalog.jsonb_build_object('ok',true,'tickets',v_balance,'to',v_nick,'granted',p_count);
end $$;

-- O metodo historico continua gratuito e nao gasta tickets (compatibilidade).
-- A retomada de qualquer show, inclusive um pago, nunca gasta outra tentativa.
create or replace function public.kt_run_start(p_resume uuid default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_now timestamptz := clock_timestamp();
        v_day date := (clock_timestamp() at time zone 'America/Sao_Paulo')::date;
        v_used integer; v_run uuid; v_kind text;
begin
  if v_uid is null or coalesce(auth.jwt()->'app_metadata'->>'provider','')<>'google'
     or coalesce(auth.jwt()->>'is_anonymous','false')='true'
     or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false))
    then return pg_catalog.jsonb_build_object('ok',false,'reason','login'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('kt:'||v_uid::text,0));
  delete from private.kt_runs where dia < v_day - 2;
  if p_resume is not null then
    select r.id,r.payment_kind into v_run,v_kind from private.kt_runs r
      where r.id=p_resume and r.player_id=v_uid and r.dia=v_day
        and r.finished_at is null and r.started_at>v_now-interval '3 hours';
  end if;
  select count(*) into v_used from private.kt_runs r
    where r.player_id=v_uid and r.dia=v_day and r.payment_kind='free';
  if v_run is not null then
    return pg_catalog.jsonb_build_object('ok',true,'run',v_run,'resume',true,
      'kind',v_kind,'used',v_used,'left',greatest(0,5-v_used)); end if;
  if v_used>=5 then return pg_catalog.jsonb_build_object('ok',false,'reason','limit','used',v_used,'left',0); end if;
  update private.kt_runs set finished_at=v_now where player_id=v_uid and finished_at is null;
  insert into private.kt_runs(player_id,dia,started_at,payment_kind)
    values(v_uid,v_day,v_now,'free') returning id into v_run;
  return pg_catalog.jsonb_build_object('ok',true,'run',v_run,'resume',false,'kind','free',
    'used',v_used+1,'left',4-v_used);
end $$;

-- Apenas esta RPC gasta ticket: exige identificador idempotente para evitar
-- debito duplo em retries/reconexoes e so atua depois das 5 gratuitas.
create or replace function public.kt_ticket_run_start(p_request uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_now timestamptz := clock_timestamp();
        v_day date := (clock_timestamp() at time zone 'America/Sao_Paulo')::date;
        v_used integer; v_run uuid; v_finished timestamptz; v_balance integer;
        v_started timestamptz; v_run_day date;
begin
  if v_uid is null or p_request is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider','')<>'google'
     or coalesce(auth.jwt()->>'is_anonymous','false')='true'
     or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false))
    then return pg_catalog.jsonb_build_object('ok',false,'reason','login'); end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended('kt:'||v_uid::text,0));
  delete from private.kt_runs where dia < v_day - 2;
  select count(*) into v_used from private.kt_runs r
    where r.player_id=v_uid and r.dia=v_day and r.payment_kind='free';
  select r.id,r.finished_at,r.started_at,r.dia into v_run,v_finished,v_started,v_run_day from private.kt_runs r
    where r.player_id=v_uid and r.ticket_request=p_request limit 1;
  if v_run is not null then
    if v_finished is not null or v_run_day<>v_day or v_started<=v_now-interval '3 hours' then
      return pg_catalog.jsonb_build_object('ok',false,'reason','used_request'); end if;
    select balance into v_balance from private.kt_ticket_wallet where player_id=v_uid;
    return pg_catalog.jsonb_build_object('ok',true,'resume',true,'run',v_run,
      'kind','ticket','used',v_used,'left',greatest(0,5-v_used),'tickets',coalesce(v_balance,0));
  end if;
  if v_used<5 then return pg_catalog.jsonb_build_object('ok',false,'reason','free_available','used',v_used); end if;
  update private.kt_ticket_wallet set balance=balance-1,updated_at=v_now
    where player_id=v_uid and balance>0 returning balance into v_balance;
  if not found then return pg_catalog.jsonb_build_object('ok',false,'reason','no_ticket','used',v_used); end if;
  update private.kt_runs set finished_at=v_now where player_id=v_uid and finished_at is null;
  insert into private.kt_runs(player_id,dia,started_at,payment_kind,ticket_request)
    values(v_uid,v_day,v_now,'ticket',p_request) returning id into v_run;
  insert into private.kt_ticket_events(player_id,actor_id,delta,reason,run_id)
    values(v_uid,v_uid,-1,'show',v_run);
  return pg_catalog.jsonb_build_object('ok',true,'resume',false,'run',v_run,
    'kind','ticket','used',v_used,'left',0,'tickets',v_balance);
end $$;

-- Contrato do ranking inalterado; apenas separa gratuitas do saldo extra.
create or replace function public.kt_ranking() returns jsonb
language sql stable security definer set search_path = '' as $$
  with w as (select private.kt_domingo() as d),
  base as (
    select s.*,coalesce(nullif(pg_catalog.btrim(p.nick),''),'Idol') as nick,p.avatar,p.cor
    from private.kt_scores s join public.players p on p.id=s.player_id,w
    where s.week_start=w.d and not coalesce(p.bloqueado,false)
  )
  select pg_catalog.jsonb_build_object(
    'semana',pg_catalog.to_char(w.d,'YYYY-MM-DD'),
    'fim',pg_catalog.to_char(w.d+6,'YYYY-MM-DD'),
    'score',coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score,'combo',b.combo,'accuracy',b.acc,'hits',b.acc_hits) order by b.score desc,b.score_at,b.nick)
                      from (select * from base where score>0 order by score desc,score_at,nick limit 5) b),'[]'::jsonb),
    'combo',coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score,'combo',b.combo,'accuracy',b.acc,'hits',b.acc_hits) order by b.combo desc,b.combo_at,b.nick)
                      from (select * from base where combo>0 order by combo desc,combo_at,nick limit 5) b),'[]'::jsonb),
    'acertos',coalesce((select pg_catalog.jsonb_agg(pg_catalog.jsonb_build_object('nick',b.nick,'avatar',b.avatar,'cor',b.cor,'score',b.score,'combo',b.combo,'accuracy',b.acc,'hits',b.acc_hits) order by b.acc desc,b.acc_hits desc,b.acc_at,b.nick)
                        from (select * from base where acc>0 order by acc desc,acc_hits desc,acc_at,nick limit 5) b),'[]'::jsonb),
    'usados',(select count(*) from private.kt_runs r where r.player_id=auth.uid()
              and r.dia=(pg_catalog.now() at time zone 'America/Sao_Paulo')::date and r.payment_kind='free'),
    'tickets',coalesce((select balance from private.kt_ticket_wallet where player_id=auth.uid()),0)
  ) from w
$$;

-- Premio raro de 5% por giro: reduz apenas a faixa de card (45% -> 40%).
-- Mantem os premios antigos: 40% card, 40% ★5-15, 12% ★20-40, 3% bonus, 5% ticket.
create or replace function public.gacha_girar() returns json
language plpgsql security definer set search_path = '' as $function$
declare r numeric := random(); t text; v text; p public.players; v_balance integer;
begin
  select * into p from public.players where id=auth.uid() and not coalesce(bloqueado,false) for update;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if exists(select 1 from public.gacha where user_id=auth.uid() and dia=public.hoje_br())
    then return pg_catalog.json_build_object('ok',false,'erro','hoje'); end if;
  if r<.40 then
    select nick into v from public.players where avatar is not null and not coalesce(bloqueado,false)
      and id<>auth.uid() order by random() limit 1;
    if v is not null then t:='card'; else t:='nada';v:=(floor(random()*8))::integer::text;end if;
  elsif r<.80 then t:='estrelas';v:=(5+floor(random()*11))::integer::text;
  elsif r<.92 then t:='estrelas';v:=(20+floor(random()*21))::integer::text;
  elsif r<.95 then t:='bonus';v:=(array['ima','escudo','fever'])[1+floor(random()*3)::integer];
  else t:='ticket';v:='1';end if;
  if t='ticket' then
    insert into private.kt_ticket_wallet(player_id,balance) values(auth.uid(),1)
      on conflict(player_id) do update set balance=private.kt_ticket_wallet.balance+1,
        updated_at=clock_timestamp() where private.kt_ticket_wallet.balance<99
      returning balance into v_balance;
    if found then
      insert into private.kt_ticket_events(player_id,actor_id,delta,reason)
        values(auth.uid(),auth.uid(),1,'gacha');
    else
      -- Carteira cheia: o giro continua premiado com estrelas, sem estourar o limite.
      t:='estrelas';v:='5';
    end if;
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
end $function$;

-- As RPCs acima sao a unica via de escrita. Sem grants para anon ou PUBLIC.
revoke all on function public.kt_ticket_wallet() from public,anon,authenticated;
revoke all on function public.kt_ticket_gift(text) from public,anon,authenticated;
revoke all on function public.kt_ticket_admin_grant(text,integer,text) from public,anon,authenticated;
revoke all on function public.kt_ticket_run_start(uuid) from public,anon,authenticated;
revoke all on function public.kt_run_start(uuid) from public,anon,authenticated;
revoke all on function public.kt_ranking() from public,anon,authenticated;
revoke all on function public.gacha_girar() from public,anon,authenticated;
grant execute on function public.kt_ticket_wallet() to authenticated;
grant execute on function public.kt_ticket_gift(text) to authenticated;
grant execute on function public.kt_ticket_admin_grant(text,integer,text) to authenticated;
grant execute on function public.kt_ticket_run_start(uuid) to authenticated;
grant execute on function public.kt_run_start(uuid) to authenticated;
grant execute on function public.kt_ranking() to authenticated;
grant execute on function public.gacha_girar() to authenticated;

commit;
