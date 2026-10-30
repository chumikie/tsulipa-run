-- TsuLiPa World 3A.11: synchronized movement and player-selected profiles.
-- HOMOLOGATION ONLY. Apply only to Supabase project hfzjoefnousiouiuchys.
-- Stores only the nickname and visual avatar each test participant chooses locally.
-- No production auth, profile, score, currency, or reward data is read or changed.

alter table karaoke_lab.seats
  add column if not exists stage_x integer,
  add column if not exists stage_y integer,
  add column if not exists dance text not null default '',
  add column if not exists player_nick text not null default 'Idol',
  add column if not exists player_avatar jsonb not null default '{}'::jsonb,
  add column if not exists stage_updated_at timestamptz;

create or replace function public.karaoke_ensaio_mover(
  p_token uuid,
  p_x integer,
  p_y integer,
  p_dance text,
  p_nick text,
  p_avatar jsonb
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_now timestamptz;
  v_seat karaoke_lab.seats%rowtype;
  v_dance text := coalesce(p_dance, '');
  v_nick text := btrim(coalesce(p_nick, ''));
  v_avatar jsonb;
begin
  if v_uid is null or coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true' then
    raise exception 'homol_anonymous_only' using errcode = '28000';
  end if;
  if p_token is null or v_nick = '' or length(v_nick) > 16 or v_nick ~ '[<>]'
     or v_dance not in ('', 'banzai', 'seis', 'neon', 'nyan', 'giro', 'pulo')
     or ((p_x is null) is distinct from (p_y is null))
     or (p_x is not null and (p_x not between 120 and 840 or p_y not between 315 and 500)) then
    raise exception 'invalid_stage_state' using errcode = '22023';
  end if;
  if jsonb_typeof(coalesce(p_avatar, '{}'::jsonb)) <> 'object' then
    raise exception 'invalid_avatar' using errcode = '22023';
  end if;
  select coalesce(jsonb_object_agg(a.key, a.value), '{}'::jsonb)
    into v_avatar
    from jsonb_each(coalesce(p_avatar, '{}'::jsonb)) a
   where (a.key in ('hair','hair2','skin','eye','back','front','det','out','outcol','hat','gl','img')
          and jsonb_typeof(a.value) = 'string'
          and length(a.value #>> '{}') <= 32)
      or (a.key = 'streak' and jsonb_typeof(a.value) = 'boolean');

  perform 1 from karaoke_lab.room where id = 1 for update;
  v_now := clock_timestamp();
  perform karaoke_lab.enforce_schedule(v_now);
  if karaoke_lab.is_blocked(v_uid, v_now) then
    return jsonb_build_object('status', 'moderated');
  end if;
  if not karaoke_lab.is_sunday_window(v_now)
     or not (select joins_enabled from karaoke_lab.room where id = 1) then
    return jsonb_build_object('status', 'lab_closed');
  end if;

  select * into v_seat
    from karaoke_lab.seats
   where user_id = v_uid and seat_token = p_token and lease_expires > v_now
   for update;
  if not found then
    return jsonb_build_object('status', 'not_owner');
  end if;
  if v_seat.stage_updated_at > v_now - interval '350 milliseconds'
     and v_seat.player_nick = v_nick
     and v_seat.player_avatar = v_avatar then
    return jsonb_build_object('status', 'rate_limited');
  end if;
  if v_seat.stage_x is not distinct from p_x
     and v_seat.stage_y is not distinct from p_y
     and v_seat.dance = v_dance
     and v_seat.player_nick = v_nick
     and v_seat.player_avatar = v_avatar then
    return jsonb_build_object('status', 'unchanged');
  end if;

  update karaoke_lab.seats
     set stage_x = p_x,
         stage_y = p_y,
         dance = v_dance,
         player_nick = v_nick,
         player_avatar = v_avatar,
         stage_updated_at = v_now
   where user_id = v_uid;
  update karaoke_lab.room set revision = revision + 1 where id = 1;
  return jsonb_build_object('status', 'updated');
end
$function$;

revoke all on function public.karaoke_ensaio_mover(uuid, integer, integer, text, text, jsonb)
  from public, anon, authenticated;
grant execute on function public.karaoke_ensaio_mover(uuid, integer, integer, text, text, jsonb)
  to authenticated;

create or replace function public.karaoke_ensaio_elenco()
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_slots jsonb := '[]'::jsonb;
  v_queue jsonb := '[]'::jsonb;
  v_rev bigint;
begin
  if v_uid is null then
    raise exception 'sign_in_required' using errcode = '28000';
  end if;
  if coalesce(auth.jwt()->>'is_anonymous', 'false') <> 'true' then
    raise exception 'homol_anonymous_only' using errcode = '28000';
  end if;
  if karaoke_lab.is_blocked(v_uid, clock_timestamp()) then
    return jsonb_build_object('status', 'moderated', 'slots', '[]'::jsonb, 'queue', '[]'::jsonb);
  end if;
  if not karaoke_lab.is_sunday_window(clock_timestamp())
     or not (select joins_enabled from karaoke_lab.room where id = 1) then
    return jsonb_build_object('status', 'lab_closed', 'slots', '[]'::jsonb, 'queue', '[]'::jsonb);
  end if;
  if not exists(select 1 from karaoke_lab.seats where user_id = v_uid) then
    return jsonb_build_object('status', 'not_inside', 'slots', '[]'::jsonb, 'queue', '[]'::jsonb);
  end if;

  with ordered as (
    select s.*, row_number() over (order by s.joined_at, s.user_id)::smallint as slot
      from karaoke_lab.seats s
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'slot', o.slot,
    'label', 'Idol ' || lpad(o.slot::text, 2, '0'),
    'self', o.user_id = v_uid,
    'singing', o.user_id = r.singer_id,
    'nick', o.player_nick,
    'avatar', o.player_avatar,
    'x', o.stage_x,
    'y', o.stage_y,
    'dance', o.dance
  ) order by o.slot), '[]'::jsonb)
    into v_slots
    from ordered o cross join karaoke_lab.room r
   where r.id = 1;

  with ordered as (
    select s.user_id, row_number() over (order by s.joined_at, s.user_id)::smallint as slot
      from karaoke_lab.seats s
  )
  select coalesce(jsonb_agg(jsonb_build_object(
    'slot', o.slot, 'label', 'Idol ' || lpad(o.slot::text, 2, '0'),
    'nick', o.player_nick
  ) order by q.seq), '[]'::jsonb)
    into v_queue
    from karaoke_lab.queue q join ordered o using (user_id);

  select revision into v_rev from karaoke_lab.room where id = 1;
  return jsonb_build_object('status', 'ok', 'slots', v_slots, 'queue', v_queue,
                            'revision', v_rev, 'verified', false);
end
$function$;

revoke all on function public.karaoke_ensaio_elenco() from public, anon, authenticated;
grant execute on function public.karaoke_ensaio_elenco() to authenticated;
