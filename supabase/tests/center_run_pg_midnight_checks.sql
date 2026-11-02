\set ON_ERROR_STOP on
do $verify_midnight$
declare
  balance integer;
  before_credits integer;
  after_credits integer;
  pet_credits integer;
  valid_rankings integer;
  pre_day date := date '2026-11-01';
  post_day date := date '2026-11-02';
begin
  select stars into balance from public.players where nick='E';
  select coalesce(sum(delta),0) into before_credits from public.star_log
    where user_id='00000000-0000-4000-8000-000000000005'
      and reason='corrida'
      and (created_at at time zone 'America/Sao_Paulo')::date=pre_day;
  select coalesce(sum(delta),0) into after_credits from public.star_log
    where user_id='00000000-0000-4000-8000-000000000005'
      and reason='corrida'
      and (created_at at time zone 'America/Sao_Paulo')::date=post_day;
  select coalesce(sum(delta),0) into pet_credits from public.star_log
    where user_id='00000000-0000-4000-8000-000000000005' and reason='minijogo';
  select count(*) into valid_rankings from public.leaderboard
    where user_id='00000000-0000-4000-8000-000000000005';
  if (balance,before_credits,after_credits,pet_credits,valid_rankings)
       is distinct from (610,100,100,50,3) then
    raise exception 'midnight mismatch: balance %, yesterday %, today %, Pet %, rankings %',
      balance,before_credits,after_credits,pet_credits,valid_rankings;
  end if;
  if (select ts from public.center_test_wall) <> '2026-11-02 03:00:01+00'::timestamptz then
    raise exception 'simulated outside wall clock did not advance during lock wait';
  end if;
  if (select count(*) from public.runs
      where user_id='00000000-0000-4000-8000-000000000005'
        and finished_at is not null)<>3 then
    raise exception 'midnight runs not finalized exactly once';
  end if;
  if (select count(*) from public.star_log
      where user_id='00000000-0000-4000-8000-000000000005'
        and reason='corrida')<>4 then
    raise exception 'midnight credit events unexpectedly duplicated';
  end if;
  if has_function_privilege('anon','public.terminar_corrida(uuid,integer,integer,text,text)','EXECUTE') then
    raise exception 'midnight test unexpectedly granted anon permission';
  end if;
end $verify_midnight$;
select 'PASS: controlled clock + lock wait, Brasilia midnight, caps, idempotency, Pet and ranking' as result;
