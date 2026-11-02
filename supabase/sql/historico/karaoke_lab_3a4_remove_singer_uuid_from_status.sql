-- TsuLiPa⭐World / 3A.4 — HISTÓRICO DE HARDENING DO KARAOKE (HOMOLOGAÇÃO)
-- APLICADO e verificado somente no Supabase de homologação 29/10/2026.
-- NUNCA executar na produção sem nova análise e aprovação explícita.
-- Mantém as 9 vagas, 3 na fila e 60s, substituindo singerId (UUID) por amISinging (bool).
-- Modelo de privilégio: RPC autorizada a authenticated, nenhuma permissão direta nas tabelas privadas.
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
    'amISinging', coalesce(v_room.singer_id = v_uid,false), 'turnNumber', v_room.turn_no,
    'turnStarts', v_room.started_at, 'turnEnds', v_room.ends_at,
    'revision', v_room.revision, 'seatToken', v_out_token,
    'verified', false, 'mode', 'homologation_only'
  );
end
$function$;
revoke all on function public.karaoke_ensaio(text,uuid) from public, anon, authenticated;
grant execute on function public.karaoke_ensaio(text,uuid) to authenticated;
