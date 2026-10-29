-- Ensaio isolado em transação: nenhum Idols real, nenhuma recompensa.
begin;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000003a90',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000003a90","role":"authenticated","is_anonymous":true}',true);
do $v$ declare r jsonb;begin
 r:=public.karaoke_ensaio_toque(null);
 if r->>'status'<>'lab_closed' then raise exception 'closed gate fail %',r;end if;
end $v$;
reset role;
update karaoke_lab.room set joins_enabled=true where id=1;
set local role authenticated;
do $v$ declare r jsonb; tok uuid;begin
 r:=public.karaoke_ensaio('enter');
 if r->>'status'<>'joined' then raise exception 'join failed %',r;end if;
 tok:=(r->>'seatToken')::uuid;
 perform set_config('test.practice_token',tok::text,true);
 r:=public.karaoke_ensaio_toque(tok);
 if r->>'status'<>'not_singer' then raise exception 'spectator scored %',r;end if;
 r:=public.karaoke_ensaio('queue',tok);
 if r->>'status'<>'microphone' then raise exception 'singer missing %',r;end if;
end $v$;
reset role;
update karaoke_lab.room set started_at=clock_timestamp()-interval '6.35 seconds',
 ends_at=clock_timestamp()+interval '53.65 seconds' where id=1;
set local role authenticated;
do $v$ declare r jsonb;v jsonb;tok uuid;begin
 tok:=current_setting('test.practice_token')::uuid;
 r:=public.karaoke_ensaio_toque(tok);
 if r->>'status'<>'PERFECT' or (r->>'score')::int<>1010
 then raise exception 'first note failed %',r;end if;
 v:=public.karaoke_ensaio_toque(tok);
 if v->>'status' not in ('cooldown','already_judged') then raise exception 'duplicated %',v;end if;
 v:=public.karaoke_ensaio('status');
 if (v->'practice'->>'score')::int<>1010 then raise exception 'shared score missing %',v;end if;
end $v$;
reset role;
update karaoke_lab.room set started_at=clock_timestamp()-interval '7.35 seconds',
 ends_at=clock_timestamp()+interval '52.65 seconds' where id=1;
set local role authenticated;
do $v$ declare r jsonb;begin
 r:=public.karaoke_ensaio_toque(current_setting('test.practice_token')::uuid);
 if r->>'status'<>'PERFECT' or (r->>'score')::int<>2030 or (r->>'combo')::int<>2
 then raise exception 'second note failed %',r;end if;
end $v$;
reset role;
update karaoke_lab.room set joins_enabled=false where id=1;
do $v$ begin
 if (select count(*) from karaoke_lab.practice)<>0 then raise exception 'practice remains';end if;
 if (select count(*) from karaoke_lab.seats)<>0 then raise exception 'seat remains';end if;
end $v$;
select (select count(*) from karaoke_lab.practice) practice_rows,
 (select joins_enabled from karaoke_lab.room where id=1) gate_closed;
rollback;