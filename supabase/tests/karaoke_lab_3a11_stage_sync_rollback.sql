-- ROLLBACK ONLY: run after 3A.11 on a Sunday rehearsal window.
begin;
do $t$
begin
  if has_table_privilege('authenticated', 'karaoke_lab.seats', 'UPDATE')
     or has_table_privilege('anon', 'karaoke_lab.seats', 'SELECT') then
    raise exception 'stage state table exposed';
  end if;
  if not has_function_privilege(
    'authenticated',
    'public.karaoke_ensaio_mover(uuid,integer,integer,text,text,jsonb)',
    'EXECUTE'
  ) then
    raise exception 'authenticated rehearsal RPC missing';
  end if;
  if has_function_privilege(
    'anon',
    'public.karaoke_ensaio_mover(uuid,integer,integer,text,text,jsonb)',
    'EXECUTE'
  ) then
    raise exception 'anonymous database role can call stage RPC';
  end if;
end
$t$;
rollback;
