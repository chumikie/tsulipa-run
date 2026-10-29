-- TsuLiPa⭐World 3A.6: SOMENTE HOMOLOGAÇÃO; JWT fictício simulado, transação revertida.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000003a60',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000003a60","role":"authenticated","is_anonymous":false}',true);
do $checks$
declare v jsonb;
begin
  begin
    v:=public.karaoke_ensaio('status');
    raise exception 'permanent identity unexpectedly allowed';
  exception when sqlstate '28000' then null;end;
end $checks$;
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000003a60","role":"authenticated","is_anonymous":true}',true);
do $checks$
declare v jsonb;
begin
  v:=public.karaoke_ensaio('enter');
  if v->>'status'<>'lab_closed' or v->>'labOpen'<>'false' or (v->>'occupied')::int<>0 or v->>'seatToken' is not null then raise exception 'closed gate failed: %',v;end if;
  v:=public.karaoke_ensaio('status');
  if v->>'status'<>'ok' or v->>'labOpen'<>'false' then raise exception 'status failed: %',v;end if;
  v:=public.karaoke_ensaio_elenco();
  if v->>'status'<>'not_inside' then raise exception 'roster leaked: %',v;end if;
end $checks$;
reset role;
update karaoke_lab.room set joins_enabled=true where id=1;
set local role authenticated;
do $checks$
declare v jsonb; tok uuid; d jsonb;
begin
  v:=public.karaoke_ensaio('enter');
  if v->>'status'<>'joined' or v->>'labOpen'<>'true' or (v->>'occupied')::int<>1 or v->>'seatToken' is null then raise exception 'join failed: %',v;end if;
  tok:=(v->>'seatToken')::uuid;
  d:=public.karaoke_ensaio('enter');
  if d->>'status'<>'already_inside' or d->>'seatToken' is not null then raise exception 'other tab saw secret: %',d;end if;
  d:=public.karaoke_ensaio_elenco();
  if d->>'status'<>'ok' or jsonb_array_length(d->'slots')<>1 then raise exception 'roster failed: %',d;end if;
  d:=public.karaoke_ensaio('queue',tok);
  if d->>'status' not in ('queued','microphone') then raise exception 'queue failed: %',d;end if;
  d:=public.karaoke_ensaio('leave',tok);
  if d->>'status'<>'left' or (d->>'occupied')::int<>0 then raise exception 'leave failed: %',d;end if;
end $checks$;
reset role;
select (select count(*) from karaoke_lab.seats) seats_after_test,(select joins_enabled from karaoke_lab.room where id=1) gate_test_only;
rollback;
