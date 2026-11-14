-- Banco isolado: stub mínimo dos contratos reais lidos do Supabase.
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
create schema if not exists auth;
create schema if not exists private;
create function auth.uid() returns uuid language sql stable as $$
 select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
create table public.players(
 id uuid primary key, nick text unique, stars integer default 0, best integer default 0,
 centers_total integer default 0,dias_jogados integer default 0,
 avatar jsonb,bloqueado boolean default false,updated_at timestamptz default now()
);
create table public.gacha(user_id uuid,dia date,tipo text,valor text,primary key(user_id,dia));
create table private.kt_scores(player_id uuid,week_start date,score integer);
create table public.coracoes(de uuid,para uuid,dia date);
create table public.recados(id bigint,para uuid,de uuid);
create table public.star_log(user_id uuid,delta integer,reason text);
create table private.dia_teste(dia date);
insert into private.dia_teste values('2026-11-14');
create function public.hoje_br() returns date language sql stable as $$
 select dia from private.dia_teste limit 1
$$;
create or replace function private.cards_qtd(p_user uuid,p_chave text)
returns integer language sql stable security definer set search_path to ''
as $$
 select (select count(*)::int from public.gacha g
  where g.user_id=p_user and g.tipo='card' and lower(btrim(g.valor))=p_chave)
$$;
insert into public.players(id,nick,stars,best,centers_total,dias_jogados,avatar) values
('00000000-0000-0000-0000-00000000000a','Ana',50,1100,2,4,'{"c":{}}'),
('00000000-0000-0000-0000-00000000000b','Bia',20,4000,12,8,'{"c":{}}'),
('00000000-0000-0000-0000-00000000000c','Cecilia',20,1800,6,3,'{"c":{}}'),
('00000000-0000-0000-0000-00000000000d','Duda',20,500,0,2,'{"c":{}}');
insert into private.kt_scores(player_id,week_start,score) values
('00000000-0000-0000-0000-00000000000a','2026-11-09',100),
('00000000-0000-0000-0000-00000000000b','2026-11-09',4000),
('00000000-0000-0000-0000-00000000000c','2026-11-09',2000),
('00000000-0000-0000-0000-00000000000d','2026-11-09',800);
insert into public.gacha(user_id,dia,tipo,valor) values
('00000000-0000-0000-0000-00000000000a','2026-11-01','card','Bia'),
('00000000-0000-0000-0000-00000000000a','2026-11-02','card','Cecilia'),
('00000000-0000-0000-0000-00000000000a','2026-11-03','card','Duda'),
('00000000-0000-0000-0000-00000000000a','2026-11-04','card','Bia');
