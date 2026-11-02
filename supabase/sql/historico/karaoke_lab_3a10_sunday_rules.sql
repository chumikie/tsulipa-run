-- TsuLiPa⭐World 3A.10 / APENAS homologação.
-- Domingo 12:00-13:10 em America/Sao_Paulo; nunca abre o portão automaticamente.
create or replace function karaoke_lab.is_sunday_window(at_time timestamptz)
returns boolean language sql stable set search_path='' as $f$
 select extract(dow from at_time at time zone 'America/Sao_Paulo')=0
 and (at_time at time zone 'America/Sao_Paulo')::time>=time '12:00'
 and (at_time at time zone 'America/Sao_Paulo')::time<time '13:10';
$f$;
revoke all on function karaoke_lab.is_sunday_window(timestamptz) from public,anon,authenticated;
create table if not exists karaoke_lab.moderation_blocks(
 user_id uuid primary key,reason_code text not null
 check(reason_code in ('spam','abuse','disruption','safety','manual_review')),
 expires_at timestamptz,created_at timestamptz not null default clock_timestamp());
alter table karaoke_lab.moderation_blocks enable row level security;
revoke all on karaoke_lab.moderation_blocks from public,anon,authenticated;
create or replace function karaoke_lab.is_blocked(uid uuid,at_time timestamptz)
returns boolean language sql stable set search_path='' as $f$
 select exists(select 1 from karaoke_lab.moderation_blocks b
 where b.user_id=uid and (b.expires_at is null or b.expires_at>at_time));
$f$;
revoke all on function karaoke_lab.is_blocked(uuid,timestamptz) from public,anon,authenticated;
create table if not exists karaoke_lab.action_limits(
 user_id uuid not null,
 action text not null check(action in ('enter','queue','unqueue')),
 last_at timestamptz not null,
 primary key(user_id,action));
alter table karaoke_lab.action_limits enable row level security;
revoke all on karaoke_lab.action_limits from public,anon,authenticated;
create or replace function karaoke_lab.allow_action(uid uuid,act text,at_time timestamptz)
returns boolean language plpgsql set search_path='' as $f$
declare accepted boolean;
begin
 if uid is null or act not in ('enter','queue','unqueue') then return false;end if;
 insert into karaoke_lab.action_limits(user_id,action,last_at) values(uid,act,at_time)
 on conflict(user_id,action) do update set last_at=excluded.last_at
 where karaoke_lab.action_limits.last_at<=at_time-
 case when act='enter' then interval '6 seconds' else interval '2 seconds' end
 returning true into accepted;
 return coalesce(accepted,false);
end $f$;
revoke all on function karaoke_lab.allow_action(uuid,text,timestamptz) from public,anon,authenticated;
create or replace function karaoke_lab.enforce_schedule(at_time timestamptz)
returns void language plpgsql set search_path='' as $f$
begin
 if not karaoke_lab.is_sunday_window(at_time) then
  update karaoke_lab.room set joins_enabled=false where id=1 and joins_enabled=true;
 end if;
end $f$;
revoke all on function karaoke_lab.enforce_schedule(timestamptz) from public,anon,authenticated;
create or replace function karaoke_lab.evict_moderated()
returns trigger language plpgsql set search_path='' as $f$
begin
 if new.expires_at is not null and new.expires_at<=clock_timestamp() then return null;end if;
 perform 1 from karaoke_lab.room where id=1 for update;
 delete from karaoke_lab.queue where user_id=new.user_id;
 delete from karaoke_lab.seats where user_id=new.user_id;
 update karaoke_lab.room set singer_id=null,started_at=null,ends_at=null,revision=revision+1
 where id=1 and singer_id=new.user_id;
 update karaoke_lab.room set revision=revision+1 where id=1;
 if (select joins_enabled from karaoke_lab.room where id=1)
 and karaoke_lab.is_sunday_window(clock_timestamp()) then
  perform karaoke_lab.advance(clock_timestamp());
 end if;
 return null;
end $f$;
revoke all on function karaoke_lab.evict_moderated() from public,anon,authenticated;
drop trigger if exists karaoke_lab_mod_evict on karaoke_lab.moderation_blocks;
create trigger karaoke_lab_mod_evict
after insert or update on karaoke_lab.moderation_blocks
for each row execute function karaoke_lab.evict_moderated();
CREATE OR REPLACE FUNCTION public.karaoke_ensaio(p_action text, p_token uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz;
  v_token uuid;
  v_out_token uuid;
  v_status text := 'ok';
  v_occupied int;
  v_queued int;
  v_rows int;
  v_room karaoke_lab.room%rowtype;
  v_my_position bigint;
begin
  if v_uid is null then
    raise exception 'sign_in_required' using errcode = '28000';
  end if;
  if coalesce(auth.jwt()->>'is_anonymous','false') <> 'true' then
    raise exception 'homol_anonymous_only' using errcode = '28000';
  end if;
  if p_action is null or p_action not in
    ('status','enter','heartbeat','leave','queue','unqueue') then
    raise exception 'invalid_action' using errcode = '22023';
  end if;

  -- Serializa operações concorrentes de entrada, fila e microfone.
  perform 1 from karaoke_lab.room where id = 1 for update;
  v_now := clock_timestamp();
  perform karaoke_lab.enforce_schedule(v_now);
  if (select joins_enabled from karaoke_lab.room where id=1) then
    perform karaoke_lab.advance(v_now);
  else
    -- Recuperação defensiva: status nunca inicia outra cantora se fechado.
    delete from karaoke_lab.queue;
    get diagnostics v_rows = row_count;
    if v_rows>0 then update karaoke_lab.room set revision=revision+1 where id=1; end if;
    delete from karaoke_lab.seats;
    get diagnostics v_rows = row_count;
    if v_rows>0 then update karaoke_lab.room set revision=revision+1 where id=1; end if;
    update karaoke_lab.room set singer_id=null,started_at=null,ends_at=null,
      revision=revision+1
      where id=1 and (singer_id is not null or started_at is not null or ends_at is not null);
  end if;

  select s.seat_token into v_token from karaoke_lab.seats s where s.user_id = v_uid;

  if karaoke_lab.is_blocked(v_uid,v_now) then
    v_status:='moderated';
  elsif not (select joins_enabled from karaoke_lab.room where id = 1)
     and p_action in ('enter','queue','heartbeat') then
    v_status := 'lab_closed';
  elsif p_action in ('enter','queue','unqueue')
    and not karaoke_lab.allow_action(v_uid,p_action,v_now) then
    v_status:='rate_limited';
  elsif p_action = 'enter' then
    if v_token is not null then
      if p_token is not null and p_token = v_token then
        update karaoke_lab.seats
           set lease_expires = v_now + interval '45 seconds'
         where user_id = v_uid;
        v_status := 'resumed';
        v_out_token := v_token;
      else
        v_status := 'already_inside'; -- nunca revelar token da outra aba
      end if;
    else
      select count(*) into v_occupied from karaoke_lab.seats;
      if v_occupied >= 9 then
        v_status := 'full';
      else
        insert into karaoke_lab.seats(user_id, lease_expires)
        values(v_uid, v_now + interval '45 seconds')
        returning seat_token into v_out_token;
        v_status := 'joined';
        update karaoke_lab.room set revision = revision + 1 where id = 1;
      end if;
    end if;

  elsif p_action in ('heartbeat','leave','queue','unqueue') then
    if p_token is null or v_token is distinct from p_token then
      v_status := 'not_owner';

    elsif p_action = 'heartbeat' then
      update karaoke_lab.seats
         set lease_expires = v_now + interval '45 seconds'
       where user_id = v_uid;
      v_status := 'refreshed';

    elsif p_action = 'leave' then
      delete from karaoke_lab.seats where user_id = v_uid;
      update karaoke_lab.room
         set singer_id = null, started_at = null, ends_at = null,
             revision = revision + 1
       where id = 1 and singer_id = v_uid;
      update karaoke_lab.room set revision = revision + 1 where id = 1;
      perform karaoke_lab.advance(v_now);
      v_status := 'left';

    elsif p_action = 'queue' then
      if (select singer_id from karaoke_lab.room where id = 1) = v_uid then
        v_status := 'already_singing';
      elsif exists (select 1 from karaoke_lab.queue where user_id = v_uid) then
        v_status := 'already_queued';
      else
        select count(*) into v_queued from karaoke_lab.queue;
        if v_queued >= 3 then
          v_status := 'queue_full';
        else
          insert into karaoke_lab.queue(user_id) values(v_uid);
          update karaoke_lab.room set revision = revision + 1 where id = 1;
          perform karaoke_lab.advance(v_now);
          if (select singer_id from karaoke_lab.room where id = 1) = v_uid then
            v_status := 'microphone';
          else
            v_status := 'queued';
          end if;
        end if;
      end if;

    elsif p_action = 'unqueue' then
      delete from karaoke_lab.queue where user_id = v_uid;
      get diagnostics v_rows = row_count;
      if v_rows > 0 then
        update karaoke_lab.room set revision = revision + 1 where id = 1;
        v_status := 'removed';
      else
        v_status := 'not_queued';
      end if;
    end if;
  end if;

  select * into v_room from karaoke_lab.room where id = 1;
  select count(*) into v_occupied from karaoke_lab.seats;
  select count(*) into v_queued from karaoke_lab.queue;
  select count(*) into v_my_position
    from karaoke_lab.queue q
   where q.seq <= (select z.seq from karaoke_lab.queue z where z.user_id = v_uid);
  if v_my_position = 0 then v_my_position := null; end if;

  return jsonb_build_object(
    'status', v_status, 'serverNow', v_now, 'capacity', 9,
    'occupied', v_occupied, 'labOpen', (select joins_enabled from karaoke_lab.room where id = 1),
    'scheduleOpen', karaoke_lab.is_sunday_window(v_now),
    'scheduleZone', 'America/Sao_Paulo',
    'queueCapacity', 3, 'queueCount', v_queued,
    'queuePosition', v_my_position, 'mySeat',
      exists(select 1 from karaoke_lab.seats where user_id = v_uid),
    'amISinging', coalesce(v_room.singer_id = v_uid,false), 'turnNumber', v_room.turn_no,
    'turnStarts', v_room.started_at, 'turnEnds', v_room.ends_at,
    'revision', v_room.revision, 'seatToken', v_out_token,
    'practice',case when v_token is not null and v_room.joins_enabled then
    (select jsonb_build_object('turnNumber',pr.turn_no,'score',pr.score,
      'perfect',pr.perfect_count,'good',pr.good_count,'bestCombo',pr.best_combo,
      'totalNotes',40,'verified',false,'persisted',false)
     from karaoke_lab.practice pr where pr.room_id=1 and pr.turn_no=v_room.turn_no)
    else null::jsonb end,
    'verified', false, 'mode', 'homologation_only'
  );
end
$function$;
CREATE OR REPLACE FUNCTION public.karaoke_ensaio_elenco()
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_slots jsonb := '[]'::jsonb;
  v_queue jsonb := '[]'::jsonb;
  v_singer smallint;
  v_rev bigint;
begin
  if v_uid is null then
    raise exception 'sign_in_required' using errcode='28000';
  end if;
  if coalesce(auth.jwt()->>'is_anonymous','false') <> 'true' then
    raise exception 'homol_anonymous_only' using errcode = '28000';
  end if;
  if karaoke_lab.is_blocked(v_uid,clock_timestamp()) then
    return jsonb_build_object('status','moderated','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;
  if not karaoke_lab.is_sunday_window(clock_timestamp())
     or not (select joins_enabled from karaoke_lab.room where id=1) then
    return jsonb_build_object('status','lab_closed','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;
  if not exists(select 1 from karaoke_lab.seats where user_id=v_uid) then
    return jsonb_build_object('status','not_inside','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;
  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at,s.user_id)::smallint as slot
    from karaoke_lab.seats s
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'slot',o.slot,
    'label','Idol '||lpad(o.slot::text,2,'0'),
    'self',o.user_id=v_uid,
    'singing',o.user_id=r.singer_id
  ) order by o.slot),'[]'::jsonb)
  into v_slots
  from ordered o cross join karaoke_lab.room r
  where r.id=1;

  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at,s.user_id)::smallint as slot
    from karaoke_lab.seats s
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'slot',o.slot,'label','Idol '||lpad(o.slot::text,2,'0')
  ) order by q.seq),'[]'::jsonb)
  into v_queue from karaoke_lab.queue q join ordered o using(user_id);

  select r.revision into v_rev from karaoke_lab.room r where r.id=1;
  return jsonb_build_object('status','ok','slots',v_slots,'queue',v_queue,
                            'revision',v_rev,'verified',false);
end
$function$;
CREATE OR REPLACE FUNCTION public.karaoke_ensaio_toque(p_token uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
 uid uuid:=auth.uid();now_at timestamptz:=clock_timestamp();
 r karaoke_lab.room%rowtype;pr karaoke_lab.practice%rowtype;
 notes int[]:=array[1350,2350,3475,4350,5475,6475,7350,8600,9600,10600,11725,12600,13725,14725,15600,16850,17850,18850,19975,20850,21975,22975,23850,25100,26100,27100,28225,29100,30225,31225,32100,33350,34350,35350,36475,37350,38475,39475,40350,41600];
 rel_ms double precision;delta double precision:=201;idx int:=0;i int;
 judgement text;add_points int;new_combo int;
begin
 if uid is null or coalesce(auth.jwt()->>'is_anonymous','false')<>'true'
 then raise exception 'homol_anonymous_only' using errcode='28000';end if;
 select * into r from karaoke_lab.room where id=1 for update;
 perform karaoke_lab.enforce_schedule(now_at);
 select * into r from karaoke_lab.room where id=1;
 if karaoke_lab.is_blocked(uid,now_at) then return jsonb_build_object('status','moderated');end if;
 if not r.joins_enabled then return jsonb_build_object('status','lab_closed');end if;
 if p_token is null or not exists(select 1 from karaoke_lab.seats s
  where s.user_id=uid and s.seat_token=p_token and s.lease_expires>now_at)
 then return jsonb_build_object('status','not_owner');end if;
 if r.singer_id is distinct from uid then return jsonb_build_object('status','not_singer');end if;
 if r.started_at is null or now_at<r.started_at+interval '5 seconds'
 or now_at>=r.started_at+interval '50 seconds' or now_at>=r.ends_at
 then return jsonb_build_object('status','outside_window');end if;
 select * into pr from karaoke_lab.practice where room_id=1 and turn_no=r.turn_no
  and singer_id=uid for update;
 if not found then return jsonb_build_object('status','not_ready');end if;
 if pr.last_hit_at is not null and now_at-pr.last_hit_at<interval '250 milliseconds'
 then return jsonb_build_object('status','cooldown');end if;
 rel_ms:=extract(epoch from (now_at-r.started_at))*1000-5000;
 for i in 1..array_length(notes,1) loop
  if abs(rel_ms-notes[i])<delta then delta:=abs(rel_ms-notes[i]);idx:=i;end if;
 end loop;
 if idx=0 or delta>200 then return jsonb_build_object('status','no_note');end if;
 if (pr.hit_mask & (1::bigint << (idx-1)))<>0 then
  return jsonb_build_object('status','already_judged');end if;
 judgement:=case when delta<=95 then 'PERFECT' else 'GOOD' end;
 new_combo:=case when pr.last_idx=idx-2 then pr.combo+1 else 1 end;
 add_points:=case when judgement='PERFECT' then 1000+least(200,new_combo*10) else 500 end;
 update karaoke_lab.practice set
  hit_mask=hit_mask | (1::bigint << (idx-1)),
  last_idx=idx-1,combo=new_combo,best_combo=greatest(best_combo,new_combo),
  score=score+add_points,
  perfect_count=perfect_count+case when judgement='PERFECT' then 1 else 0 end,
  good_count=good_count+case when judgement='GOOD' then 1 else 0 end,
  last_hit_at=now_at where room_id=1;
 update karaoke_lab.room set revision=revision+1 where id=1;
 return (select jsonb_build_object('status',judgement,'score',p.score,'combo',p.combo,
  'perfect',p.perfect_count,'good',p.good_count,'bestCombo',p.best_combo,
  'turnNumber',p.turn_no,'verified',false,'persisted',false)
  from karaoke_lab.practice p where room_id=1);
end $function$;
CREATE OR REPLACE FUNCTION karaoke_lab.reset_on_close()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  if old.joins_enabled and not new.joins_enabled then
    delete from karaoke_lab.queue;
    delete from karaoke_lab.seats;
    delete from karaoke_lab.practice;
    delete from karaoke_lab.action_limits;
    new.singer_id:=null;
    new.started_at:=null;
    new.ends_at:=null;
    new.revision:=new.revision+1;
  end if;
  return new;
end
$function$;
CREATE OR REPLACE FUNCTION karaoke_lab.can_view_signal()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO ''
AS $function$
 select coalesce(auth.jwt()->>'is_anonymous','false')='true'
 and auth.uid() is not null
 and karaoke_lab.is_sunday_window(clock_timestamp())
 and not karaoke_lab.is_blocked(auth.uid(),clock_timestamp())
 and exists(select 1 from karaoke_lab.room r where r.id=1 and r.joins_enabled)
 and exists(select 1 from karaoke_lab.seats s where s.user_id=auth.uid() and s.lease_expires>now());
$function$;
revoke all on function public.karaoke_ensaio(text,uuid) from public,anon,authenticated;
grant execute on function public.karaoke_ensaio(text,uuid) to authenticated;
revoke all on function public.karaoke_ensaio_elenco() from public,anon,authenticated;
grant execute on function public.karaoke_ensaio_elenco() to authenticated;
revoke all on function public.karaoke_ensaio_toque(uuid) from public,anon,authenticated;
grant execute on function public.karaoke_ensaio_toque(uuid) to authenticated;
revoke all on function karaoke_lab.reset_on_close() from public,anon,authenticated;
revoke all on function karaoke_lab.can_view_signal() from public,anon,authenticated;
grant execute on function karaoke_lab.can_view_signal() to authenticated;
