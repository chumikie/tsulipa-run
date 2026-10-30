-- ROLLBACK ONLY: checks the staging-only temporary window boundaries.
begin;
update karaoke_lab.room
   set test_window_started_at = timestamptz '2026-10-30 10:00:00-03',
       test_window_until = timestamptz '2026-10-30 11:00:00-03'
 where id = 1;
do $t$
begin
  if not karaoke_lab.is_sunday_window(timestamptz '2026-10-30 10:30:00-03') then
    raise exception 'temporary window did not open';
  end if;
  if karaoke_lab.is_sunday_window(timestamptz '2026-10-30 11:00:00-03') then
    raise exception 'temporary window lasted past expiry';
  end if;
  update karaoke_lab.room
     set test_window_until = test_window_started_at + interval '3 hours'
   where id = 1;
  if karaoke_lab.is_sunday_window(timestamptz '2026-10-30 10:30:00-03') then
    raise exception 'window over two hours was accepted';
  end if;
end
$t$;
rollback;
