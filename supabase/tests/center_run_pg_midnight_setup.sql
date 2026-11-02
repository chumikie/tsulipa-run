\set ON_ERROR_STOP on
-- ONLY for ephemeral PostgreSQL CI. No production objects or real accounts.
-- Replaces time reads in the *test copy* of the reviewed RPC only.
create function public.center_test_now() returns timestamptz language sql stable
as $$ select current_setting('center_test.now', false)::timestamptz $$;

create table public.center_test_wall(ts timestamptz not null);
insert into public.center_test_wall values ('2026-11-02 02:59:59+00');

-- The inserted star_log timestamp must use the very same logical transaction time
-- that the test RPC uses; production's DEFAULT now() is unchanged.
alter table public.star_log alter column created_at set default public.center_test_now();

insert into public.players(id,nick,stars,best) values
 ('00000000-0000-4000-8000-000000000005','E',500,0);
insert into public.runs(id,user_id,started_at) values
 ('10000000-0000-4000-8000-000000000008','00000000-0000-4000-8000-000000000005','2026-11-02 02:59:19+00'),
 ('10000000-0000-4000-8000-000000000009','00000000-0000-4000-8000-000000000005','2026-11-02 02:59:21+00'),
 ('10000000-0000-4000-8000-000000000010','00000000-0000-4000-8000-000000000005','2026-11-02 02:59:21+00');
insert into public.star_log(user_id,delta,reason,created_at) values
 ('00000000-0000-4000-8000-000000000005',90,'corrida','2026-11-02 02:00:00+00'),
 ('00000000-0000-4000-8000-000000000005',50,'minijogo','2026-11-02 02:00:00+00');

-- Statically ensure the pre-midnight run started 40 seconds before the injected
-- transaction clock and the next run started 40 seconds before the next-day clock.
do $test$
begin
  if ('2026-11-02 02:59:59+00'::timestamptz at time zone 'America/Sao_Paulo')::date
       = ('2026-11-02 03:00:01+00'::timestamptz at time zone 'America/Sao_Paulo')::date
  then raise exception 'simulated Brasilia midnight did not cross'; end if;
end $test$;
