\set ON_ERROR_STOP on
do $test$
declare
 a_balance integer; c_balance integer;
 free_runs integer; paid_runs integer; unique_requests integer;
 a_events integer; c_events integer; spent integer; ranked integer;
begin
 select balance into a_balance from private.kt_ticket_wallet where player_id='20000000-0000-4000-8000-000000000001';
 select balance into c_balance from private.kt_ticket_wallet where player_id='20000000-0000-4000-8000-000000000003';
 select count(*) into free_runs from private.kt_runs
   where player_id='20000000-0000-4000-8000-000000000001' and payment_kind='free';
 select count(*) into paid_runs from private.kt_runs
   where player_id='20000000-0000-4000-8000-000000000001' and payment_kind='ticket';
 select count(distinct ticket_request) into unique_requests from private.kt_runs
   where player_id='20000000-0000-4000-8000-000000000001' and payment_kind='ticket';
 select count(*) into a_events from private.kt_ticket_events where player_id='20000000-0000-4000-8000-000000000001';
 select count(*) into c_events from private.kt_ticket_events where player_id='20000000-0000-4000-8000-000000000003';
 select count(*) into spent from private.kt_ticket_events where reason='show';
 select count(*) into ranked from private.kt_scores;
 if (a_balance,c_balance,free_runs,paid_runs,unique_requests,a_events,c_events,spent,ranked)
    is distinct from (0,1,5,2,2,5,1,2,0) then
   raise exception 'ticket test mismatch: wallet %,%, free %, paid %, req %, events %,%, spent %, ranking %',
     a_balance,c_balance,free_runs,paid_runs,unique_requests,a_events,c_events,spent,ranked;
 end if;
 if (select count(*) from public.gacha where user_id='20000000-0000-4000-8000-000000000001' and tipo='ticket')<>1
   or (select count(*) from public.admin_log where acao='karaoke_ticket')<>1 then
   raise exception 'Gacha or moderation event missing';
 end if;
 if has_function_privilege('anon','public.kt_ticket_run_start(uuid)','EXECUTE')
   or not has_function_privilege('authenticated','public.kt_ticket_run_start(uuid)','EXECUTE') then
   raise exception 'ticket RPC grants not preserved';
 end if;
end $test$;
select 'PASS: isolated ticket Gacha, admin, gifts, 5 free, paid, resume, concurrency, wallet and ranking' as result;
