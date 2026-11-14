-- APLICADO EM PRODUÇÃO em 13/11/2026 com o OK do dono (migração 20261113_bloom_garden).
-- Bloom⭐Garden! — versão 1 (Fase 4). PROPOSTA: aplicar só com o OK do dono.
-- Um lugar de GASTAR estrelas (docs/ECONOMIA_ESTRELAS.md): sementes custam ★, crescem com
-- 1 rega por dia (horário de Brasília) e viram flores guardadas na conta.
-- 4 canteiros por pessoa. Nada aqui dá ★. Tudo conferido no servidor.
create table if not exists private.jardim_canteiros (
  user_id uuid not null references public.players(id) on delete cascade,
  canteiro smallint not null check (canteiro between 0 and 3),
  semente text not null check (semente in ('sakura','tulipa','girassol','lunar')),
  plantado timestamptz not null default now(),
  regas smallint not null default 0 check (regas between 0 and 10),
  ultima_rega date,
  primary key (user_id, canteiro)
);
alter table private.jardim_canteiros enable row level security;
revoke all on private.jardim_canteiros from public, anon, authenticated;

create table if not exists private.jardim_flores (
  user_id uuid not null references public.players(id) on delete cascade,
  flor text not null check (flor in ('sakura','tulipa','girassol','lunar')),
  qtd integer not null default 0 check (qtd >= 0),
  primary key (user_id, flor)
);
alter table private.jardim_flores enable row level security;
revoke all on private.jardim_flores from public, anon, authenticated;

-- preço em ★ e regas (dias) para florir
create or replace function private.jardim_semente(p text, out preco int, out regas int)
language sql immutable set search_path to '' as $f$
  select case p when 'sakura' then 20 when 'tulipa' then 30 when 'girassol' then 40 when 'lunar' then 60 end,
         case p when 'sakura' then 2 when 'tulipa' then 3 when 'girassol' then 4 when 'lunar' then 5 end
$f$;

create or replace function public.jardim_estado()
returns json language plpgsql stable security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_hoje date := public.hoje_br();
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  return pg_catalog.json_build_object('ok',true,'hoje',v_hoje,
    'stars',(select stars from public.players where id=v_uid),
    'canteiros',coalesce((select pg_catalog.json_agg(pg_catalog.json_build_object('canteiro',c.canteiro,'semente',c.semente,
        'regas',c.regas,'precisa',(private.jardim_semente(c.semente)).regas,'regado_hoje',c.ultima_rega=v_hoje) order by c.canteiro)
      from private.jardim_canteiros c where c.user_id=v_uid),'[]'::json),
    'flores',coalesce((select pg_catalog.json_object_agg(f.flor,f.qtd) from private.jardim_flores f where f.user_id=v_uid and f.qtd>0),'{}'::json),
    'sementes',pg_catalog.json_build_object('sakura',pg_catalog.json_build_array(20,2),'tulipa',pg_catalog.json_build_array(30,3),
      'girassol',pg_catalog.json_build_array(40,4),'lunar',pg_catalog.json_build_array(60,5)));
end $f$;

create or replace function public.jardim_plantar(p_canteiro int, p_semente text)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_preco int; v_stars int;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if p_canteiro is null or p_canteiro not between 0 and 3 then return pg_catalog.json_build_object('ok',false,'erro','canteiro'); end if;
  v_preco := (private.jardim_semente(p_semente)).preco;
  if v_preco is null then return pg_catalog.json_build_object('ok',false,'erro','semente'); end if;
  -- trava a conta: o saldo de ★ e o canteiro mudam juntos
  perform 1 from public.players where id=v_uid and not coalesce(bloqueado,false) for update;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if exists(select 1 from private.jardim_canteiros where user_id=v_uid and canteiro=p_canteiro) then
    return pg_catalog.json_build_object('ok',false,'erro','ocupado'); end if;
  update public.players set stars=stars-v_preco,updated_at=now() where id=v_uid and stars>=v_preco returning stars into v_stars;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','estrelas'); end if;
  insert into public.star_log(user_id,delta,reason) values(v_uid,-v_preco,'jardim_semente');
  insert into private.jardim_canteiros(user_id,canteiro,semente) values(v_uid,p_canteiro,p_semente);
  return pg_catalog.json_build_object('ok',true,'stars',v_stars,'preco',v_preco);
end $f$;

create or replace function public.jardim_regar(p_canteiro int)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); v_hoje date := public.hoje_br(); c private.jardim_canteiros;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select * into c from private.jardim_canteiros where user_id=v_uid and canteiro=p_canteiro for update;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','vazio'); end if;
  if c.ultima_rega=v_hoje then return pg_catalog.json_build_object('ok',false,'erro','hoje'); end if;
  if c.regas>=(private.jardim_semente(c.semente)).regas then return pg_catalog.json_build_object('ok',false,'erro','florido'); end if;
  update private.jardim_canteiros set regas=regas+1,ultima_rega=v_hoje where user_id=v_uid and canteiro=p_canteiro;
  return pg_catalog.json_build_object('ok',true,'regas',c.regas+1,'precisa',(private.jardim_semente(c.semente)).regas);
end $f$;

create or replace function public.jardim_colher(p_canteiro int)
returns json language plpgsql volatile security definer set search_path to ''
as $f$
declare v_uid uuid := auth.uid(); c private.jardim_canteiros; v_qtd int;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select * into c from private.jardim_canteiros where user_id=v_uid and canteiro=p_canteiro for update;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','vazio'); end if;
  if c.regas<(private.jardim_semente(c.semente)).regas then return pg_catalog.json_build_object('ok',false,'erro','cedo'); end if;
  delete from private.jardim_canteiros where user_id=v_uid and canteiro=p_canteiro;
  insert into private.jardim_flores(user_id,flor,qtd) values(v_uid,c.semente,1)
    on conflict(user_id,flor) do update set qtd=private.jardim_flores.qtd+1 returning qtd into v_qtd;
  return pg_catalog.json_build_object('ok',true,'flor',c.semente,'qtd',v_qtd);
end $f$;

revoke all on function public.jardim_estado() from public, anon;
revoke all on function public.jardim_plantar(int,text) from public, anon;
revoke all on function public.jardim_regar(int) from public, anon;
revoke all on function public.jardim_colher(int) from public, anon;
revoke all on function private.jardim_semente(text) from public, anon, authenticated;
grant execute on function public.jardim_estado() to authenticated, service_role;
grant execute on function public.jardim_plantar(int,text) to authenticated, service_role;
grant execute on function public.jardim_regar(int) to authenticated, service_role;
grant execute on function public.jardim_colher(int) to authenticated, service_role;
