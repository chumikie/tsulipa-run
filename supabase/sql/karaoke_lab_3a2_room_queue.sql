-- ETAPA 3A.2 — TsuLiPa⭐World
-- SQL instalado e testado SOMENTE no Supabase de HOMOLOGAÇÃO em 29/10/2026.
-- NÃO APLICAR NO SUPABASE DE PRODUÇÃO.
-- 9 vagas, 3 na fila, 1 microfone, 60 segundos por turno.
-- Controle de identidade e token de assento; 45s de lease + 10s para reconectar cantora.
-- Nenhum score, prêmio, convite, broadcast, Presence ou jogador real.
create schema if not exists karaoke_lab;
revoke all on schema karaoke_lab from public, anon, authenticated;

create table if not exists karaoke_lab.room (
  id smallint primary key check (id=1),
  singer_id uuid,
  started_at timestamptz,
  ends_at timestamptz,
  turn_no bigint not null default 0,
  revision bigint not null default 0,
  constraint singer_clock_pair check (
    (singer_id is null and started_at is null and ends_at is null)
    or (singer_id is not null and started_at is not null and ends_at is not null)
  )
);
insert into karaoke_lab.room(id) values(1) on conflict(id) do nothing;

create table if not exists karaoke_lab.seats (
  user_id uuid primary key,
  seat_token uuid not null unique default gen_random_uuid(),
  joined_at timestamptz not null default clock_timestamp(),
  lease_expires timestamptz not null
);
create table if not exists karaoke_lab.queue (
  seq bigint generated always as identity primary key,
  user_id uuid not null unique references karaoke_lab.seats(user_id) on delete cascade,
  queued_at timestamptz not null default clock_timestamp()
);
alter table karaoke_lab.room enable row level security;
alter table karaoke_lab.seats enable row level security;
alter table karaoke_lab.queue enable row level security;
revoke all on all tables in schema karaoke_lab from public, anon, authenticated;
revoke all on all sequences in schema karaoke_lab from public, anon, authenticated;

-- Função interna; sempre executada sob lock da sala.
CREATE OR REPLACE FUNCTION karaoke_lab.advance(p_now timestamp with time zone)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
declare
  v_next uuid;
  v_rows integer;
begin
  delete from karaoke_lab.seats s
  where s.lease_expires
        + case when s.user_id = (select r.singer_id from karaoke_lab.room r where r.id = 1)
               then interval '10 seconds' else interval '0 seconds' end <= p_now;
  get diagnostics v_rows = row_count;
  if v_rows > 0 then
    update karaoke_lab.room set revision = revision + 1 where id = 1;
  end if;

  update karaoke_lab.room r
     set singer_id = null, started_at = null, ends_at = null, revision = revision + 1
   where r.id = 1 and r.singer_id is not null
     and (r.ends_at <= p_now
          or not exists (select 1 from karaoke_lab.seats s where s.user_id = r.singer_id));

  if (select r.singer_id from karaoke_lab.room r where r.id = 1) is null then
    select q.user_id into v_next from karaoke_lab.queue q order by q.seq limit 1;
    if v_next is not null then
      delete from karaoke_lab.queue where user_id = v_next;
      update karaoke_lab.room
         set singer_id = v_next,
             started_at = p_now,
             ends_at = p_now + interval '60 seconds',
             turn_no = turn_no + 1,
             revision = revision + 1
       where id = 1;
    end if;
  end if;
end
$function$;
revoke all on function karaoke_lab.advance(timestamptz) from public, anon, authenticated;

-- Única RPC pública de HOMOLOGAÇÃO; exige autenticação + token para ações.
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
  if p_action is null or p_action not in
    ('status','enter','heartbeat','leave','queue','unqueue') then
    raise exception 'invalid_action' using errcode = '22023';
  end if;

  -- Serializa operações concorrentes de entrada, fila e microfone.
  perform 1 from karaoke_lab.room where id = 1 for update;
  v_now := clock_timestamp();
  perform karaoke_lab.advance(v_now);

  select s.seat_token into v_token from karaoke_lab.seats s where s.user_id = v_uid;

  if p_action = 'enter' then
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
    'occupied', v_occupied, 'queueCapacity', 3, 'queueCount', v_queued,
    'queuePosition', v_my_position, 'mySeat',
      exists(select 1 from karaoke_lab.seats where user_id = v_uid),
    'singerId', v_room.singer_id, 'turnNumber', v_room.turn_no,
    'turnStarts', v_room.started_at, 'turnEnds', v_room.ends_at,
    'revision', v_room.revision, 'seatToken', v_out_token,
    'verified', false, 'mode', 'homologation_only'
  );
end
$function$;
revoke all on function public.karaoke_ensaio(text,uuid) from public, anon, authenticated;
grant execute on function public.karaoke_ensaio(text,uuid) to authenticated;
