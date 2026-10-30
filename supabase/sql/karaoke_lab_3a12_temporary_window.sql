-- TsuLiPa World 3A.12: a manually opened, short rehearsal window.
-- HOMOLOGATION ONLY. Apply only to Supabase project hfzjoefnousiouiuchys.
-- No public RPC opens the window; only an operator with SQL-editor access can set it.
alter table karaoke_lab.room
  add column if not exists test_window_started_at timestamptz,
  add column if not exists test_window_until timestamptz;

create or replace function karaoke_lab.is_sunday_window(at_time timestamptz)
returns boolean
language sql
stable
set search_path = ''
as $function$
  select (
    extract(dow from at_time at time zone 'America/Sao_Paulo') = 0
    and (at_time at time zone 'America/Sao_Paulo')::time >= time '12:00'
    and (at_time at time zone 'America/Sao_Paulo')::time < time '13:10'
  ) or exists (
    select 1
      from karaoke_lab.room r
     where r.id = 1
       and r.test_window_started_at <= at_time
       and r.test_window_until > at_time
       and r.test_window_until <= r.test_window_started_at + interval '2 hours'
  );
$function$;

revoke all on function karaoke_lab.is_sunday_window(timestamptz)
  from public, anon, authenticated;

-- After expiry, the existing schedule enforcement closes and resets the room
-- the next time a client checks in. No browser-facing command can extend it.
