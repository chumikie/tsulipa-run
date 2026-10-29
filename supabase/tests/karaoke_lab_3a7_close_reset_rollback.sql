-- RODAR APENAS EM HOMOLOGAÇÃO; rollback obrigatório, 2 JWTs simulados.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000001","role":"authenticated","is_anonymous":true}',true);
do $c$ declare r jsonb;begin
r:=public.karaoke_ensaio('enter');
if r->>'status'<>'lab_closed' then raise exception 'closed accepted entry';end if;
r:=public.karaoke_ensaio_elenco();
if r->>'status'<>'lab_closed' then raise exception 'closed roster leaked';end if;
end $c$;
reset role;
update karaoke_lab.room set joins_enabled=true where id=1;
set local role authenticated;
do $c$ declare r jsonb;begin
r:=public.karaoke_ensaio('enter');
if r->>'status'<>'joined' then raise exception 'first join failed %',r;end if;
r:=public.karaoke_ensaio('queue',(r->>'seatToken')::uuid);
if r->>'status'<>'microphone' then raise exception 'first singer failed %',r;end if;
end $c$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000000002","role":"authenticated","is_anonymous":true}',true);
do $c$ declare r jsonb;begin
r:=public.karaoke_ensaio('enter');
if r->>'status'<>'joined' then raise exception 'second join failed %',r;end if;
r:=public.karaoke_ensaio('queue',(r->>'seatToken')::uuid);
if r->>'status'<>'queued' then raise exception 'second queue failed %',r;end if;
end $c$;
reset role;
do $c$ begin
if (select count(*) from karaoke_lab.seats)<>2 then raise exception 'missing two seats';end if;
if (select count(*) from karaoke_lab.queue)<>1 then raise exception 'missing queued Idol';end if;
if (select singer_id from karaoke_lab.room where id=1) is null then raise exception 'no singer';end if;
end $c$;
update karaoke_lab.room set joins_enabled=false where id=1;
do $c$ begin
if (select count(*) from karaoke_lab.seats)<>0 then raise exception 'closed seats not cleared';end if;
if (select count(*) from karaoke_lab.queue)<>0 then raise exception 'closed queue not cleared';end if;
if (select singer_id from karaoke_lab.room where id=1) is not null then raise exception 'mic continued';end if;
if (select ends_at from karaoke_lab.room where id=1) is not null then raise exception 'clock continued';end if;
end $c$;
set local role authenticated;
do $c$ declare r jsonb;begin
r:=public.karaoke_ensaio('status');
if r->>'labOpen'<>'false' or (r->>'occupied')::int<>0 then raise exception 'closed status wrong %',r;end if;
r:=public.karaoke_ensaio_elenco();
if r->>'status'<>'lab_closed' then raise exception 'closed roster visible';end if;
end $c$;
rollback;
