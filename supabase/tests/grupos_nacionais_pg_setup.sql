\set ON_ERROR_STOP on
-- PostgreSQL efêmero de CI. UUIDs e perfis são inteiramente fictícios.
create schema auth;
create or replace function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

do $roles$
begin
  if not exists (select 1 from pg_roles where rolname='anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname='authenticated') then create role authenticated nologin; end if;
end
$roles$;
grant usage on schema public, auth to anon, authenticated;
grant execute on function auth.uid() to anon, authenticated;

create table public.players (
  id uuid primary key,
  nick text not null,
  emoji text not null default '',
  cor text not null default '',
  time text not null default '',
  stars integer not null default 0,
  updated_at timestamptz not null default now()
);

-- Assinaturas reduzidas, mas com as mesmas âncoras que a migração substitui
-- nas RPCs existentes em produção. O teste exige que o patch dinâmico ocorra.
create or replace function public.meu_perfil()
returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object(
    'nick', p.nick, 'emoji', p.emoji, 'cor', p.cor, 'time', p.time,
    'stars', p.stars
  ) from public.players p where p.id = auth.uid();
$$;

create or replace function public.perfil_publico(p_nick text)
returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object(
    'nick', p.nick, 'emoji', p.emoji, 'cor', p.cor, 'time', p.time,
    'stars', p.stars
  ) from public.players p where lower(p.nick) = lower(btrim(coalesce(p_nick,'')));
$$;

create or replace function public.oshi_opcoes()
returns json language sql stable security definer set search_path to 'public'
as $$
  select coalesce(json_agg(json_build_object('nick', nick, 'emoji', emoji, 'cor', cor, 'time', time) order by lower(nick)), '[]'::json)
  from public.players;
$$;

insert into public.players(id,nick,emoji,cor,time,stars) values
 ('50000000-0000-4000-8000-000000000001','Conta A','⭐','#111111','',123),
 ('50000000-0000-4000-8000-000000000002','Conta B','💙','#222222','',456);
