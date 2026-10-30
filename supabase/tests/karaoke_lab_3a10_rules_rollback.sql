-- ROLLBACK ONLY: date edges, rate limits, blocked eviction and off-hours RPC.
begin;
do $t$ declare tm timestamptz; uid uuid:='00000000-0000-0000-0000-000000003aa0';begin
 if karaoke_lab.is_sunday_window(make_timestamptz(2026,11,1,11,59,59,'America/Sao_Paulo')) then raise exception 'early';end if;
 if not karaoke_lab.is_sunday_window(make_timestamptz(2026,11,1,12,0,0,'America/Sao_Paulo')) then raise exception 'noon';end if;
 if not karaoke_lab.is_sunday_window(make_timestamptz(2026,11,1,13,9,59,'America/Sao_Paulo')) then raise exception 'end too soon';end if;
 if karaoke_lab.is_sunday_window(make_timestamptz(2026,11,1,13,10,0,'America/Sao_Paulo')) then raise exception 'end too late';end if;
 if karaoke_lab.is_sunday_window(make_timestamptz(2026,11,2,12,30,0,'America/Sao_Paulo')) then raise exception 'monday';end if;
 tm:=make_timestamptz(2026,11,1,12,20,0,'America/Sao_Paulo');
 if not karaoke_lab.allow_action(uid,'enter',tm) then raise exception 'first blocked';end if;
 if karaoke_lab.allow_action(uid,'enter',tm+interval '1 second') then raise exception 'spam allowed';end if;
 if not karaoke_lab.allow_action(uid,'enter',tm+interval '6 seconds') then raise exception 'cooldown not recovered';end if;
 if not karaoke_lab.allow_action(uid,'queue',tm) then raise exception 'queue blocked';end if;
 if karaoke_lab.allow_action(uid,'queue',tm+interval '1 second') then raise exception 'queue spam allowed';end if;
end $t$;
insert into karaoke_lab.seats(user_id,lease_expires) values('00000000-0000-0000-0000-000000003aa0',clock_timestamp()+interval '60 seconds');
insert into karaoke_lab.moderation_blocks(user_id,reason_code) values('00000000-0000-0000-0000-000000003aa0','spam');
do $t$ begin
 if (select count(*) from karaoke_lab.seats where user_id='00000000-0000-0000-0000-000000003aa0')<>0 then raise exception 'moderated not evicted';end if;
 if not karaoke_lab.is_blocked('00000000-0000-0000-0000-000000003aa0',clock_timestamp()) then raise exception 'moderation bypass';end if;
 if has_table_privilege('authenticated','karaoke_lab.moderation_blocks','SELECT') then raise exception 'mod table exposed';end if;
 if has_table_privilege('anon','karaoke_lab.action_limits','SELECT') then raise exception 'limits table exposed';end if;
end $t$;
do $t$ begin if not karaoke_lab.is_sunday_window(clock_timestamp()) then
 update karaoke_lab.room set joins_enabled=true where id=1;
end if;end $t$;
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000003aa1',true);
select set_config('request.jwt.claims','{"sub":"00000000-0000-0000-0000-000000003aa1","role":"authenticated","is_anonymous":true}',true);
do $t$ declare r jsonb;begin
 r:=public.karaoke_ensaio('enter');
 if r->>'scheduleOpen'='false' then
   if r->>'status'<>'lab_closed' or r->>'labOpen'<>'false' then raise exception 'off-hours entry: %',r;end if;
   r:=public.karaoke_ensaio_toque(null);
   if r->>'status'<>'lab_closed' then raise exception 'off-hours score: %',r;end if;
   r:=public.karaoke_ensaio_elenco();
   if r->>'status'<>'lab_closed' then raise exception 'off-hours roster: %',r;end if;
 end if;
end $t$;
reset role;
rollback;