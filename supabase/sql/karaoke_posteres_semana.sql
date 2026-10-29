-- TsuLiPa⭐World — Karaoke⭐Day! weekly avatar posters
-- Applied to the Supabase project on 2026-10-29. Kept here as a source-controlled reference.
-- No auth emails, account metadata, saves, or private JSON leaves this public RPC.
-- The cast is pinned at the first request each Sunday beginning 12:00 Sao Paulo time.
-- Once set, a participant cannot be replaced mid-week merely because they edit an avatar.
-- Blocked profiles are filtered from the response on every request.
-- Schema is private and is not exposed through the PostgREST Data API.

begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.karaoke_poster_elencos(
  inicio_semana date primary key,
  integrantes uuid[] not null,
  criado_em timestamptz not null default now()
);
revoke all on private.karaoke_poster_elencos from public, anon, authenticated;

create or replace function public.karaoke_posteres_semana()
returns jsonb
language plpgsql
volatile security definer
set search_path = ''
as $function$
declare
  momento_local timestamp without time zone := now() at time zone 'America/Sao_Paulo';
  domingo date;
  escolhidos uuid[];
  elenco jsonb;
begin
  domingo := momento_local::date - extract(dow from momento_local)::integer;
  if extract(dow from momento_local)::integer = 0
     and momento_local::time < time '12:00' then
     domingo := domingo - 7;
  end if;

  select c.integrantes into escolhidos
  from private.karaoke_poster_elencos c
  where c.inicio_semana = domingo;

  if escolhidos is null then
    insert into private.karaoke_poster_elencos(inicio_semana, integrantes)
    select domingo, array(
      select p.id from public.players p
      where p.avatar is not null and jsonb_typeof(p.avatar->'c')='object'
        and not coalesce(p.bloqueado,false)
      order by md5(domingo::text || '|' || p.id::text) limit 4
    )
    on conflict(inicio_semana) do nothing;

    select c.integrantes into escolhidos
    from private.karaoke_poster_elencos c
    where c.inicio_semana=domingo;
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'nick',p.nick,
    'avatar',jsonb_build_object(
      'c',p.avatar->'c',
      'pose',p.avatar->'pose',
      'expr',p.avatar->'expr')
  ) order by array_position(escolhidos,p.id)),'[]'::jsonb)
  into elenco
  from public.players p
  where p.id=any(escolhidos)
    and p.avatar is not null
    and not coalesce(p.bloqueado,false)
    and jsonb_typeof(p.avatar->'c')='object';

  return jsonb_build_object('week',domingo,'idols',elenco);
end;
$function$;

revoke all on function public.karaoke_posteres_semana() from public, anon, authenticated;
grant execute on function public.karaoke_posteres_semana() to anon, authenticated;

comment on function public.karaoke_posteres_semana() is
  'Four public vector idol posters fixed each week, with blocked players excluded.';

commit;
