-- Homologação somente: teste com rollback obrigatório; nenhum usuário real.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000003a80',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000003a80","role":"authenticated","is_anonymous":true}',true);
do $x$ declare n int;begin
 if karaoke_lab.can_view_signal() then raise exception 'closed listener';end if;
 select count(*) into n from public.tsulipa_karaoke_lab_signal;
 if n<>0 then raise exception 'closed signal visible';end if;
 if has_function_privilege('authenticated','karaoke_lab.advance(timestamptz)','execute') then raise exception 'advance exposed';end if;
end $x$;
reset role;
update karaoke_lab.room set joins_enabled=true where id=1;
set local role authenticated;
do $x$ declare n int;r jsonb;begin
 select count(*) into n from public.tsulipa_karaoke_lab_signal;
 if n<>0 then raise exception 'nonmember sees signal';end if;
 r:=public.karaoke_ensaio('enter');
 if r->>'status'<>'joined' then raise exception 'not joined %',r;end if;
 select count(*) into n from public.tsulipa_karaoke_lab_signal;
 if n<>1 then raise exception 'member cannot read signal';end if;
 r:=public.karaoke_ensaio('queue',(r->>'seatToken')::uuid);
 if r->>'status'<>'microphone' then raise exception 'no singer';end if;
end $x$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000003a80","role":"authenticated","is_anonymous":false}',true);
do $x$ declare n int;begin
 select count(*) into n from public.tsulipa_karaoke_lab_signal;
 if n<>0 then raise exception 'permanent account reads signal';end if;
end $x$;
reset role;
update karaoke_lab.room set joins_enabled=false where id=1;
select (select count(*) from karaoke_lab.seats) seats_after_close,
(select count(*) from karaoke_lab.queue) queue_after_close,
(select joins_enabled from karaoke_lab.room where id=1) closed_gate;
rollback;