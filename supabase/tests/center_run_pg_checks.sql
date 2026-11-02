\set ON_ERROR_STOP on
do $verify$
declare
  sa integer; sb integer; sc integer; sd integer;
  a_total integer; b_today integer; b_yesterday integer; d_total integer;
  a_runs integer; d_runs integer; pet_events integer;
begin
  if has_function_privilege('anon','public.terminar_corrida(uuid,integer,integer,text,text)','EXECUTE')
     or not has_function_privilege('authenticated','public.terminar_corrida(uuid,integer,integer,text,text)','EXECUTE')
     or not has_function_privilege('service_role','public.terminar_corrida(uuid,integer,integer,text,text)','EXECUTE') then
    raise exception 'function ACL changed after CREATE OR REPLACE';
  end if;
  if not (select prosecdef from pg_proc where oid='public.terminar_corrida(uuid,integer,integer,text,text)'::regprocedure) then
    raise exception 'SECURITY DEFINER not preserved';
  end if;

  select stars into sa from public.players where nick='A';
  select stars into sb from public.players where nick='B';
  select stars into sc from public.players where nick='C';
  select stars into sd from public.players where nick='D';
  select coalesce(sum(delta),0) into a_total from public.star_log
    where user_id='00000000-0000-4000-8000-000000000001' and reason='corrida';
  select coalesce(sum(delta),0) into b_today from public.star_log
    where user_id='00000000-0000-4000-8000-000000000002' and reason='corrida'
      and (created_at at time zone 'America/Sao_Paulo')::date=(now() at time zone 'America/Sao_Paulo')::date;
  select coalesce(sum(delta),0) into b_yesterday from public.star_log
    where user_id='00000000-0000-4000-8000-000000000002' and reason='corrida'
      and (created_at at time zone 'America/Sao_Paulo')::date=(now() at time zone 'America/Sao_Paulo')::date-1;
  select coalesce(sum(delta),0) into d_total from public.star_log
    where user_id='00000000-0000-4000-8000-000000000004' and reason='corrida';
  select count(*) into a_runs from public.runs where user_id='00000000-0000-4000-8000-000000000001' and finished_at is not null;
  select count(*) into d_runs from public.runs where user_id='00000000-0000-4000-8000-000000000004' and finished_at is not null;
  select count(*) into pet_events from public.star_log where reason='minijogo';
  if (sa,sb,sc,sd) is distinct from (1100,110,200,335) then
    raise exception 'unexpected balances: %,%,%,%',sa,sb,sc,sd;
  end if;
  if (a_total,b_today,b_yesterday,d_total) is distinct from (100,100,80,35) then
    raise exception 'daily credits or previous-day ledger changed: %,%,%,%',a_total,b_today,b_yesterday,d_total;
  end if;
  if (a_runs,d_runs,pet_events) is distinct from (3,1,1) then
    raise exception 'run idempotency or Pet history changed';
  end if;
  if (select count(*) from public.star_log where user_id='00000000-0000-4000-8000-000000000003')<>0 then
    raise exception 'invalid or expired C runs earned stars';
  end if;
  -- PostgreSQL now() remains anchored to the transaction, even while waiting;
  -- fixed boundary checks below prove which civil day the transaction timestamp selects.
  if now() is distinct from transaction_timestamp() then
    raise exception 'now() is not transaction-scoped';
  end if;
  if ((timestamp with time zone '2026-11-02 02:59:59+00' at time zone 'America/Sao_Paulo')::date =
      (timestamp with time zone '2026-11-02 03:00:00+00' at time zone 'America/Sao_Paulo')::date) then
    raise exception 'Sao Paulo day boundary at 03:00 UTC failed';
  end if;
end $verify$;
select 'PASS: real PostgreSQL transactions, concurrent caps, duplicate UUID, invalid runs, ACL, midnight and balances' as result;
