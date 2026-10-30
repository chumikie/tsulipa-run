-- TsuLiPa World Etapa 3A.8 — somente Supabase de HOMOLOGAÇÃO.
-- Sinal de atualização com um número de versão; zero dados pessoais.
create or replace function karaoke_lab.can_view_signal()
returns boolean language sql stable security definer set search_path='' as $fn$
 select coalesce(auth.jwt()->>'is_anonymous','false')='true'
 and auth.uid() is not null
 and exists(select 1 from karaoke_lab.room r where r.id=1 and r.joins_enabled)
 and exists(select 1 from karaoke_lab.seats s where s.user_id=auth.uid() and s.lease_expires>now());
$fn$;
revoke all on all functions in schema karaoke_lab from public,anon,authenticated;
grant usage on schema karaoke_lab to authenticated;
grant execute on function karaoke_lab.can_view_signal() to authenticated;
create table if not exists public.tsulipa_karaoke_lab_signal
(room_key text primary key check(room_key='main'),revision bigint not null default 0);
alter table public.tsulipa_karaoke_lab_signal enable row level security;
revoke all on public.tsulipa_karaoke_lab_signal from public,anon,authenticated;
grant select on public.tsulipa_karaoke_lab_signal to authenticated;
drop policy if exists tsulipa_karaoke_lab_signal_read on public.tsulipa_karaoke_lab_signal;
create policy tsulipa_karaoke_lab_signal_read on public.tsulipa_karaoke_lab_signal
for select to authenticated using(room_key='main' and (select karaoke_lab.can_view_signal()));
insert into public.tsulipa_karaoke_lab_signal(room_key,revision)
values('main',(select revision from karaoke_lab.room where id=1))
on conflict(room_key) do update set revision=excluded.revision;
create or replace function karaoke_lab.signal_revision()
returns trigger language plpgsql set search_path='' as $fn$
begin
 update public.tsulipa_karaoke_lab_signal set revision=new.revision where room_key='main';
 return null;
end
$fn$;
revoke all on function karaoke_lab.signal_revision() from public,anon,authenticated;
drop trigger if exists karaoke_lab_sync_revision on karaoke_lab.room;
create trigger karaoke_lab_sync_revision after update of revision on karaoke_lab.room
for each row when(new.revision is distinct from old.revision)
execute function karaoke_lab.signal_revision();
do $pub$ begin
if not exists(select 1 from pg_publication_tables where pubname='supabase_realtime'
and schemaname='public' and tablename='tsulipa_karaoke_lab_signal') then
alter publication supabase_realtime add table public.tsulipa_karaoke_lab_signal;
end if;
end $pub$;