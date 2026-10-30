-- TsuLiPa⭐World — Karaoke⭐Day! sala online (produção)
-- Mesma lógica testada na homologação (fila FIFO de 3, 9 vagas, 1 microfone,
-- turno de 60 s, lease de 45 s, Realtime só como sinal de revisão), agora
-- com as contas reais do jogo (login Google) em vez de contas anônimas.
-- Regras: só quem tem perfil (public.players) e não está bloqueado entra.
-- Pontos do ensaio NÃO viram estrelas, moedas, insígnias nem ranking.
-- Abre sozinha todo domingo 12h–13h10 (Brasília). A moderação (eh_admin)
-- pode abrir uma janela de teste curta, fechar a sala ou bloquear alguém.

create schema if not exists karaoke_lab;
revoke all on schema karaoke_lab from public, anon, authenticated;

create table if not exists karaoke_lab.room(
  id smallint primary key check (id = 1),
  singer_id uuid, started_at timestamptz, ends_at timestamptz,
  turn_no bigint not null default 0,
  revision bigint not null default 0,
  joins_enabled boolean not null default false,
  auto_open boolean not null default true,
  teste_ate timestamptz,
  check ((singer_id is null and started_at is null and ends_at is null)
      or (singer_id is not null and started_at is not null and ends_at is not null))
);
insert into karaoke_lab.room(id) values (1) on conflict do nothing;

create table if not exists karaoke_lab.seats(
  user_id uuid primary key,
  seat_token uuid not null unique default gen_random_uuid(),
  joined_at timestamptz not null default clock_timestamp(),
  lease_expires timestamptz not null,
  stage_x integer,
  stage_y integer,
  dance text not null default ''
);
alter table karaoke_lab.seats add column if not exists stage_x integer;
alter table karaoke_lab.seats add column if not exists stage_y integer;
alter table karaoke_lab.seats add column if not exists dance text not null default '';
create table if not exists karaoke_lab.queue(
  seq bigint generated always as identity primary key,
  user_id uuid not null unique references karaoke_lab.seats(user_id) on delete cascade,
  queued_at timestamptz not null default clock_timestamp()
);
create table if not exists karaoke_lab.practice(
  room_id integer primary key check (room_id = 1),
  turn_no bigint not null, singer_id uuid not null,
  hit_mask bigint not null default 0, last_idx integer not null default -1,
  score integer not null default 0, combo integer not null default 0,
  best_combo integer not null default 0, perfect_count integer not null default 0,
  good_count integer not null default 0, last_hit_at timestamptz
);
create table if not exists karaoke_lab.action_limits(
  user_id uuid not null,
  action text not null check (action in ('enter','queue','unqueue')),
  last_at timestamptz not null,
  primary key (user_id, action)
);
create table if not exists karaoke_lab.moderation_blocks(
  user_id uuid primary key,
  reason_code text not null check (reason_code in ('spam','abuse','disruption','safety','manual_review')),
  expires_at timestamptz,
  created_at timestamptz not null default clock_timestamp()
);
alter table karaoke_lab.room enable row level security;
alter table karaoke_lab.seats enable row level security;
alter table karaoke_lab.queue enable row level security;
alter table karaoke_lab.practice enable row level security;
alter table karaoke_lab.action_limits enable row level security;
alter table karaoke_lab.moderation_blocks enable row level security;
revoke all on all tables in schema karaoke_lab from public, anon, authenticated;

create table if not exists public.tsulipa_karaoke_lab_signal(
  room_key text primary key check (room_key = 'main'),
  revision bigint not null default 0
);
insert into public.tsulipa_karaoke_lab_signal(room_key) values ('main') on conflict do nothing;
alter table public.tsulipa_karaoke_lab_signal enable row level security;
revoke all on public.tsulipa_karaoke_lab_signal from public, anon, authenticated;
grant select on public.tsulipa_karaoke_lab_signal to authenticated;

-- ---------- funções internas ----------
create or replace function karaoke_lab.player_ok(uid uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select uid is not null and exists(
    select 1 from public.players p where p.id = uid and not coalesce(p.bloqueado,false));
$$;

create or replace function karaoke_lab.is_sunday_window(at_time timestamptz) returns boolean
language sql stable set search_path = '' as $$
  select extract(dow from at_time at time zone 'America/Sao_Paulo') = 0
     and (at_time at time zone 'America/Sao_Paulo')::time >= time '12:00'
     and (at_time at time zone 'America/Sao_Paulo')::time <  time '13:10';
$$;

-- Janela válida = domingo 12h–13h10 OU teste aberto pela moderação.
create or replace function karaoke_lab.is_open_window(at_time timestamptz) returns boolean
language sql stable set search_path = '' as $$
  select karaoke_lab.is_sunday_window(at_time)
      or coalesce((select r.teste_ate > at_time from karaoke_lab.room r where r.id = 1), false);
$$;

create or replace function karaoke_lab.is_blocked(uid uuid, at_time timestamptz) returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from karaoke_lab.moderation_blocks b
                where b.user_id = uid and (b.expires_at is null or b.expires_at > at_time))
      or not karaoke_lab.player_ok(uid);
$$;

-- Abre sozinha na janela (se auto_open) e fecha fora dela.
create or replace function karaoke_lab.enforce_schedule(at_time timestamptz) returns void
language plpgsql set search_path = '' as $$
begin
  if karaoke_lab.is_open_window(at_time) then
    update karaoke_lab.room set joins_enabled = true
     where id = 1 and joins_enabled = false and auto_open;
  else
    update karaoke_lab.room set joins_enabled = false where id = 1 and joins_enabled = true;
  end if;
end $$;

create or replace function karaoke_lab.allow_action(uid uuid, act text, at_time timestamptz) returns boolean
language plpgsql set search_path = '' as $$
declare accepted boolean;
begin
  if uid is null or act not in ('enter','queue','unqueue') then return false; end if;
  insert into karaoke_lab.action_limits(user_id,action,last_at) values (uid,act,at_time)
  on conflict (user_id,action) do update set last_at = excluded.last_at
  where karaoke_lab.action_limits.last_at <= at_time -
        case when act = 'enter' then interval '6 seconds' else interval '2 seconds' end
  returning true into accepted;
  return coalesce(accepted,false);
end $$;

create or replace function karaoke_lab.advance(p_now timestamptz) returns void
language plpgsql set search_path = '' as $$
declare v_next uuid; v_rows integer;
begin
  delete from karaoke_lab.seats s
   where s.lease_expires + case when s.user_id = (select r.singer_id from karaoke_lab.room r where r.id = 1)
                                then interval '10 seconds' else interval '0 seconds' end <= p_now;
  get diagnostics v_rows = row_count;
  if v_rows > 0 then update karaoke_lab.room set revision = revision + 1 where id = 1; end if;

  update karaoke_lab.room r set singer_id = null, started_at = null, ends_at = null, revision = revision + 1
   where r.id = 1 and r.singer_id is not null
     and (r.ends_at <= p_now or not exists (select 1 from karaoke_lab.seats s where s.user_id = r.singer_id));

  if (select r.singer_id from karaoke_lab.room r where r.id = 1) is null then
    select q.user_id into v_next from karaoke_lab.queue q order by q.seq limit 1;
    if v_next is not null then
      delete from karaoke_lab.queue where user_id = v_next;
      update karaoke_lab.room set singer_id = v_next, started_at = p_now,
             ends_at = p_now + interval '60 seconds', turn_no = turn_no + 1, revision = revision + 1
       where id = 1;
    end if;
  end if;
end $$;

create or replace function karaoke_lab.reset_on_close() returns trigger
language plpgsql set search_path = '' as $$
begin
  if old.joins_enabled and not new.joins_enabled then
    delete from karaoke_lab.queue; delete from karaoke_lab.seats;
    delete from karaoke_lab.practice; delete from karaoke_lab.action_limits;
    new.singer_id := null; new.started_at := null; new.ends_at := null;
    new.revision := new.revision + 1;
  end if;
  return new;
end $$;

create or replace function karaoke_lab.signal_revision() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.tsulipa_karaoke_lab_signal set revision = new.revision where room_key = 'main';
  return null;
end $$;

create or replace function karaoke_lab.begin_practice() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.singer_id is not null and new.started_at is not null then
    insert into karaoke_lab.practice(room_id,turn_no,singer_id) values (1,new.turn_no,new.singer_id)
    on conflict (room_id) do update set turn_no = excluded.turn_no, singer_id = excluded.singer_id,
      hit_mask = 0, last_idx = -1, score = 0, combo = 0, best_combo = 0,
      perfect_count = 0, good_count = 0, last_hit_at = null;
  end if;
  return null;
end $$;

create or replace function karaoke_lab.evict_moderated() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.expires_at is not null and new.expires_at <= clock_timestamp() then return null; end if;
  perform 1 from karaoke_lab.room where id = 1 for update;
  delete from karaoke_lab.queue where user_id = new.user_id;
  delete from karaoke_lab.seats where user_id = new.user_id;
  update karaoke_lab.room set singer_id = null, started_at = null, ends_at = null, revision = revision + 1
   where id = 1 and singer_id = new.user_id;
  update karaoke_lab.room set revision = revision + 1 where id = 1;
  if (select joins_enabled from karaoke_lab.room where id = 1) then
    perform karaoke_lab.advance(clock_timestamp());
  end if;
  return null;
end $$;

drop trigger if exists karaoke_lab_reset_on_close on karaoke_lab.room;
create trigger karaoke_lab_reset_on_close before update of joins_enabled on karaoke_lab.room
  for each row execute function karaoke_lab.reset_on_close();
drop trigger if exists karaoke_lab_sync_revision on karaoke_lab.room;
create trigger karaoke_lab_sync_revision after update of revision on karaoke_lab.room
  for each row when (new.revision is distinct from old.revision) execute function karaoke_lab.signal_revision();
drop trigger if exists karaoke_lab_practice_new_singer on karaoke_lab.room;
create trigger karaoke_lab_practice_new_singer after update of singer_id on karaoke_lab.room
  for each row when (new.singer_id is distinct from old.singer_id and new.singer_id is not null)
  execute function karaoke_lab.begin_practice();
drop trigger if exists karaoke_lab_mod_evict on karaoke_lab.moderation_blocks;
create trigger karaoke_lab_mod_evict after insert or update on karaoke_lab.moderation_blocks
  for each row execute function karaoke_lab.evict_moderated();

create or replace function karaoke_lab.can_view_signal() returns boolean
language sql stable security definer set search_path = '' as $$
  select auth.uid() is not null
     and not karaoke_lab.is_blocked(auth.uid(), clock_timestamp())
     and exists(select 1 from karaoke_lab.room r where r.id = 1 and r.joins_enabled)
     and exists(select 1 from karaoke_lab.seats s where s.user_id = auth.uid() and s.lease_expires > now());
$$;
grant usage on schema karaoke_lab to authenticated;
revoke all on function karaoke_lab.can_view_signal() from public, anon;
grant execute on function karaoke_lab.can_view_signal() to authenticated;

drop policy if exists tsulipa_karaoke_lab_signal_read on public.tsulipa_karaoke_lab_signal;
create policy tsulipa_karaoke_lab_signal_read on public.tsulipa_karaoke_lab_signal
  for select to authenticated using (room_key = 'main' and (select karaoke_lab.can_view_signal()));

do $$ begin
  if not exists (select 1 from pg_publication_tables
                 where pubname = 'supabase_realtime' and tablename = 'tsulipa_karaoke_lab_signal') then
    alter publication supabase_realtime add table public.tsulipa_karaoke_lab_signal;
  end if;
end $$;

-- ---------- RPCs públicas ----------
create or replace function public.karaoke_sala(p_action text, p_token uuid default null) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid(); v_now timestamptz; v_token uuid; v_out_token uuid;
  v_status text := 'ok'; v_occupied int; v_queued int; v_rows int;
  v_room karaoke_lab.room%rowtype; v_my_position bigint;
begin
  if v_uid is null then raise exception 'sign_in_required' using errcode = '28000'; end if;
  if p_action is null or p_action not in ('status','enter','heartbeat','leave','queue','unqueue') then
    raise exception 'invalid_action' using errcode = '22023';
  end if;

  perform 1 from karaoke_lab.room where id = 1 for update;
  v_now := clock_timestamp();
  perform karaoke_lab.enforce_schedule(v_now);
  if (select joins_enabled from karaoke_lab.room where id = 1) then
    perform karaoke_lab.advance(v_now);
  end if;

  select s.seat_token into v_token from karaoke_lab.seats s where s.user_id = v_uid;

  if not karaoke_lab.player_ok(v_uid) then
    v_status := 'no_profile';
  elsif karaoke_lab.is_blocked(v_uid, v_now) then
    v_status := 'moderated';
  elsif not (select joins_enabled from karaoke_lab.room where id = 1)
        and p_action in ('enter','queue','heartbeat') then
    v_status := 'lab_closed';
  elsif p_action in ('enter','queue','unqueue') and not karaoke_lab.allow_action(v_uid, p_action, v_now) then
    v_status := 'rate_limited';
  elsif p_action = 'enter' then
    if v_token is not null then
      if p_token is not null and p_token = v_token then
        update karaoke_lab.seats set lease_expires = v_now + interval '45 seconds' where user_id = v_uid;
        v_status := 'resumed'; v_out_token := v_token;
      else
        v_status := 'already_inside';
      end if;
    else
      select count(*) into v_occupied from karaoke_lab.seats;
      if v_occupied >= 9 then v_status := 'full';
      else
        insert into karaoke_lab.seats(user_id, lease_expires) values (v_uid, v_now + interval '45 seconds')
        returning seat_token into v_out_token;
        v_status := 'joined';
        update karaoke_lab.room set revision = revision + 1 where id = 1;
      end if;
    end if;
  elsif p_action in ('heartbeat','leave','queue','unqueue') then
    if p_token is null or v_token is distinct from p_token then
      v_status := 'not_owner';
    elsif p_action = 'heartbeat' then
      update karaoke_lab.seats set lease_expires = v_now + interval '45 seconds' where user_id = v_uid;
      v_status := 'refreshed';
    elsif p_action = 'leave' then
      delete from karaoke_lab.seats where user_id = v_uid;
      update karaoke_lab.room set singer_id = null, started_at = null, ends_at = null, revision = revision + 1
       where id = 1 and singer_id = v_uid;
      update karaoke_lab.room set revision = revision + 1 where id = 1;
      perform karaoke_lab.advance(v_now);
      v_status := 'left';
    elsif p_action = 'queue' then
      if (select singer_id from karaoke_lab.room where id = 1) = v_uid then v_status := 'already_singing';
      elsif exists (select 1 from karaoke_lab.queue where user_id = v_uid) then v_status := 'already_queued';
      else
        select count(*) into v_queued from karaoke_lab.queue;
        if v_queued >= 3 then v_status := 'queue_full';
        else
          insert into karaoke_lab.queue(user_id) values (v_uid);
          update karaoke_lab.room set revision = revision + 1 where id = 1;
          perform karaoke_lab.advance(v_now);
          v_status := case when (select singer_id from karaoke_lab.room where id = 1) = v_uid
                           then 'microphone' else 'queued' end;
        end if;
      end if;
    elsif p_action = 'unqueue' then
      delete from karaoke_lab.queue where user_id = v_uid;
      get diagnostics v_rows = row_count;
      if v_rows > 0 then
        update karaoke_lab.room set revision = revision + 1 where id = 1; v_status := 'removed';
      else v_status := 'not_queued'; end if;
    end if;
  end if;

  select * into v_room from karaoke_lab.room where id = 1;
  select count(*) into v_occupied from karaoke_lab.seats;
  select count(*) into v_queued from karaoke_lab.queue;
  select count(*) into v_my_position from karaoke_lab.queue q
   where q.seq <= (select z.seq from karaoke_lab.queue z where z.user_id = v_uid);
  if v_my_position = 0 then v_my_position := null; end if;

  return jsonb_build_object(
    'status', v_status, 'serverNow', v_now, 'capacity', 9, 'occupied', v_occupied,
    'labOpen', v_room.joins_enabled, 'scheduleOpen', karaoke_lab.is_open_window(v_now),
    'scheduleZone', 'America/Sao_Paulo', 'queueCapacity', 3, 'queueCount', v_queued,
    'queuePosition', v_my_position,
    'mySeat', exists(select 1 from karaoke_lab.seats where user_id = v_uid),
    'amISinging', coalesce(v_room.singer_id = v_uid, false), 'turnNumber', v_room.turn_no,
    'turnStarts', v_room.started_at, 'turnEnds', v_room.ends_at, 'revision', v_room.revision,
    'seatToken', v_out_token,
    'practice', case when v_token is not null and v_room.joins_enabled then
      (select jsonb_build_object('turnNumber',pr.turn_no,'score',pr.score,'perfect',pr.perfect_count,
        'good',pr.good_count,'bestCombo',pr.best_combo,'totalNotes',40,'verified',false,'persisted',false)
         from karaoke_lab.practice pr where pr.room_id = 1 and pr.turn_no = v_room.turn_no)
      else null::jsonb end,
    'verified', false, 'mode', 'live');
end $$;

-- Elenco: apelido e aparência pública (a mesma da vitrine), nunca e-mail ou UUID.
create or replace function public.karaoke_sala_elenco() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_slots jsonb := '[]'::jsonb; v_queue jsonb := '[]'::jsonb; v_rev bigint;
begin
  if v_uid is null then raise exception 'sign_in_required' using errcode = '28000'; end if;
  if karaoke_lab.is_blocked(v_uid, clock_timestamp()) then
    return jsonb_build_object('status','moderated','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;
  if not (select joins_enabled from karaoke_lab.room where id = 1) then
    return jsonb_build_object('status','lab_closed','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;
  if not exists (select 1 from karaoke_lab.seats where user_id = v_uid) then
    return jsonb_build_object('status','not_inside','slots','[]'::jsonb,'queue','[]'::jsonb);
  end if;

  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at, s.user_id)::smallint as slot
      from karaoke_lab.seats s)
  select coalesce(jsonb_agg(jsonb_build_object(
      'slot', o.slot, 'nick', p.nick,
      'avatar', jsonb_build_object('c', coalesce(p.look->'c',p.avatar->'c')),
      'x', s.stage_x, 'y', s.stage_y, 'dance', s.dance,
      'self', o.user_id = v_uid, 'singing', o.user_id = r.singer_id) order by o.slot), '[]'::jsonb)
    into v_slots
    from ordered o join karaoke_lab.seats s using (user_id)
      join public.players p on p.id = o.user_id cross join karaoke_lab.room r
   where r.id = 1;

  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at, s.user_id)::smallint as slot
      from karaoke_lab.seats s)
  select coalesce(jsonb_agg(jsonb_build_object('slot', o.slot, 'nick', p.nick) order by q.seq), '[]'::jsonb)
    into v_queue
    from karaoke_lab.queue q join ordered o using (user_id) join public.players p on p.id = o.user_id;

  select r.revision into v_rev from karaoke_lab.room r where r.id = 1;
  return jsonb_build_object('status','ok','slots',v_slots,'queue',v_queue,'revision',v_rev,'verified',false);
end $$;

create or replace function public.karaoke_sala_mover(
  p_token uuid, p_x integer, p_y integer, p_dance text
) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz := clock_timestamp();
  v_seat karaoke_lab.seats%rowtype;
begin
  if v_uid is null then raise exception 'sign_in_required' using errcode = '28000'; end if;
  if p_x is null or p_y is null or p_x not between 120 and 840 or p_y not between 315 and 500
     or coalesce(p_dance,'') not in ('','banzai','seis','neon','nyan','giro','pulo') then
    return jsonb_build_object('status','invalid_state');
  end if;
  perform 1 from karaoke_lab.room where id = 1 for update;
  if not (select joins_enabled from karaoke_lab.room where id = 1)
     or not karaoke_lab.is_open_window(v_now) then
    return jsonb_build_object('status','lab_closed');
  end if;
  if karaoke_lab.is_blocked(v_uid,v_now) then
    return jsonb_build_object('status','moderated');
  end if;
  select * into v_seat from karaoke_lab.seats
   where user_id = v_uid and seat_token = p_token and lease_expires > v_now
   for update;
  if not found then return jsonb_build_object('status','not_owner'); end if;

  update karaoke_lab.seats
     set stage_x = p_x, stage_y = p_y, dance = coalesce(p_dance,''),
         lease_expires = v_now + interval '45 seconds'
   where user_id = v_uid;
  if v_seat.stage_x is distinct from p_x or v_seat.stage_y is distinct from p_y
     or v_seat.dance is distinct from coalesce(p_dance,'') then
    update karaoke_lab.room set revision = revision + 1 where id = 1;
  end if;
  return jsonb_build_object('status','updated','x',p_x,'y',p_y,'dance',coalesce(p_dance,''));
end $$;

create or replace function public.karaoke_sala_toque(p_token uuid) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  uid uuid := auth.uid(); now_at timestamptz := clock_timestamp();
  r karaoke_lab.room%rowtype; pr karaoke_lab.practice%rowtype;
  notes int[] := array[1350,2350,3475,4350,5475,6475,7350,8600,9600,10600,11725,12600,13725,14725,15600,
    16850,17850,18850,19975,20850,21975,22975,23850,25100,26100,27100,28225,29100,30225,31225,32100,
    33350,34350,35350,36475,37350,38475,39475,40350,41600];
  rel_ms double precision; delta double precision := 201; idx int := 0; i int;
  judgement text; add_points int; new_combo int;
begin
  if uid is null then raise exception 'sign_in_required' using errcode = '28000'; end if;
  select * into r from karaoke_lab.room where id = 1 for update;
  perform karaoke_lab.enforce_schedule(now_at);
  select * into r from karaoke_lab.room where id = 1;
  if karaoke_lab.is_blocked(uid, now_at) then return jsonb_build_object('status','moderated'); end if;
  if not r.joins_enabled then return jsonb_build_object('status','lab_closed'); end if;
  if p_token is null or not exists (select 1 from karaoke_lab.seats s
     where s.user_id = uid and s.seat_token = p_token and s.lease_expires > now_at) then
    return jsonb_build_object('status','not_owner');
  end if;
  if r.singer_id is distinct from uid then return jsonb_build_object('status','not_singer'); end if;
  if r.started_at is null or now_at < r.started_at + interval '5 seconds'
     or now_at >= r.started_at + interval '50 seconds' or now_at >= r.ends_at then
    return jsonb_build_object('status','outside_window');
  end if;
  select * into pr from karaoke_lab.practice where room_id = 1 and turn_no = r.turn_no and singer_id = uid for update;
  if not found then return jsonb_build_object('status','not_ready'); end if;
  if pr.last_hit_at is not null and now_at - pr.last_hit_at < interval '250 milliseconds' then
    return jsonb_build_object('status','cooldown');
  end if;
  rel_ms := extract(epoch from (now_at - r.started_at)) * 1000 - 5000;
  for i in 1..array_length(notes,1) loop
    if abs(rel_ms - notes[i]) < delta then delta := abs(rel_ms - notes[i]); idx := i; end if;
  end loop;
  if idx = 0 or delta > 200 then return jsonb_build_object('status','no_note'); end if;
  if (pr.hit_mask & (1::bigint << (idx - 1))) <> 0 then return jsonb_build_object('status','already_judged'); end if;
  judgement := case when delta <= 95 then 'PERFECT' else 'GOOD' end;
  new_combo := case when pr.last_idx = idx - 2 then pr.combo + 1 else 1 end;
  add_points := case when judgement = 'PERFECT' then 1000 + least(200, new_combo * 10) else 500 end;
  update karaoke_lab.practice set hit_mask = hit_mask | (1::bigint << (idx - 1)), last_idx = idx - 1,
    combo = new_combo, best_combo = greatest(best_combo, new_combo), score = score + add_points,
    perfect_count = perfect_count + case when judgement = 'PERFECT' then 1 else 0 end,
    good_count = good_count + case when judgement = 'GOOD' then 1 else 0 end,
    last_hit_at = now_at where room_id = 1;
  update karaoke_lab.room set revision = revision + 1 where id = 1;
  return (select jsonb_build_object('status',judgement,'score',p.score,'combo',p.combo,'perfect',p.perfect_count,
    'good',p.good_count,'bestCombo',p.best_combo,'turnNumber',p.turn_no,'verified',false,'persisted',false)
    from karaoke_lab.practice p where room_id = 1);
end $$;

-- Moderação: abrir teste curto, voltar ao automático, fechar, bloquear/desbloquear.
create or replace function public.karaoke_sala_admin(p_acao text, p_minutos integer default 30, p_nick text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v_alvo uuid;
begin
  if not public.eh_admin() then raise exception 'admin_only' using errcode = '42501'; end if;
  perform 1 from karaoke_lab.room where id = 1 for update;
  if p_acao = 'teste' then
    update karaoke_lab.room set auto_open = true,
           teste_ate = clock_timestamp() + make_interval(mins => least(greatest(coalesce(p_minutos,30),5),90))
     where id = 1;
    perform karaoke_lab.enforce_schedule(clock_timestamp());
  elsif p_acao = 'automatico' then
    update karaoke_lab.room set auto_open = true, teste_ate = null where id = 1;
    perform karaoke_lab.enforce_schedule(clock_timestamp());
  elsif p_acao = 'fechar' then
    update karaoke_lab.room set auto_open = false, teste_ate = null, joins_enabled = false where id = 1;
  elsif p_acao in ('bloquear','desbloquear') then
    select p.id into v_alvo from public.players p where lower(p.nick) = lower(trim(coalesce(p_nick,'')));
    if v_alvo is null then return jsonb_build_object('ok',false,'erro','nick_nao_encontrado'); end if;
    if p_acao = 'bloquear' then
      insert into karaoke_lab.moderation_blocks(user_id, reason_code, expires_at)
      values (v_alvo, 'manual_review', clock_timestamp() + interval '1 day')
      on conflict (user_id) do update set expires_at = excluded.expires_at, created_at = clock_timestamp();
    else
      delete from karaoke_lab.moderation_blocks where user_id = v_alvo;
    end if;
  else
    raise exception 'acao_invalida' using errcode = '22023';
  end if;
  return (select jsonb_build_object('ok',true,'aberta',r.joins_enabled,'auto',r.auto_open,'teste_ate',r.teste_ate,
          'pessoas',(select count(*) from karaoke_lab.seats)) from karaoke_lab.room r where r.id = 1);
end $$;

revoke all on function public.karaoke_sala(text,uuid) from public, anon;
revoke all on function public.karaoke_sala_elenco() from public, anon;
revoke all on function public.karaoke_sala_mover(uuid,integer,integer,text) from public, anon;
revoke all on function public.karaoke_sala_toque(uuid) from public, anon;
revoke all on function public.karaoke_sala_admin(text,integer,text) from public, anon;
grant execute on function public.karaoke_sala(text,uuid) to authenticated;
grant execute on function public.karaoke_sala_elenco() to authenticated;
grant execute on function public.karaoke_sala_mover(uuid,integer,integer,text) to authenticated;
grant execute on function public.karaoke_sala_toque(uuid) to authenticated;
grant execute on function public.karaoke_sala_admin(text,integer,text) to authenticated;
