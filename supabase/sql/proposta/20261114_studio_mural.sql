-- Photo⭐Studio! v2 — Mural da revista (aprovado pelo dono: público, com corações).
-- Guarda só as ESCOLHAS da foto (cenário, pose, luz, enquadramento, objeto); cada aparelho redesenha
-- com o visual atual da pessoa (players.avatar). Nenhuma imagem é enviada. 1 publicação por pessoa por dia;
-- 1 coração por pessoa por foto (não vale na própria; até 60 corações/dia). A mais curtida da semana
-- (segunda a domingo, Brasília) vira a Capa no Idol⭐News!. Contas bloqueadas não aparecem.
create table if not exists private.studio_mural (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.players(id) on delete cascade,
  dia date not null,
  escolhas jsonb not null,
  estrelas smallint not null check (estrelas between 1 and 3),
  criado timestamptz not null default now(),
  unique (user_id, dia)
);
create table if not exists private.studio_coracoes (
  post_id bigint not null references private.studio_mural(id) on delete cascade,
  user_id uuid not null references public.players(id) on delete cascade,
  em timestamptz not null default now(),
  primary key (post_id, user_id)
);
create index if not exists studio_mural_dia on private.studio_mural(dia);
alter table private.studio_mural enable row level security;
alter table private.studio_coracoes enable row level security;
revoke all on private.studio_mural, private.studio_coracoes from public, anon, authenticated;

create or replace function private.studio_semana(d date) returns date language sql immutable set search_path to '' as $f$
  select d - ((extract(isodow from d)::int) - 1)
$f$;

create or replace function public.studio_publicar(p jsonb)
returns json language plpgsql volatile security definer set search_path to '' as $f$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); pa jsonb; v_ac int := 0; v_id bigint;
  v_e jsonb;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if pg_catalog.jsonb_typeof(p) is distinct from 'object'
     or coalesce(p->>'fundo','') not in ('rosa','cortina','nuvens','neon')
     or coalesce(p->>'pose','') not in ('normal','v','coracao','tchau')
     or coalesce(p->>'luz','') not in ('suave','neon','por')
     or coalesce(p->>'quadro','') not in ('rosto','meio','inteiro')
     or coalesce(p->>'objeto','') not in ('nenhum','balao','microfone','lightstick','flor_sakura','flor_tulipa','flor_girassol','flor_lunar')
  then return pg_catalog.json_build_object('ok',false,'erro','escolhas'); end if;
  if (p->>'objeto') like 'flor_%' and not exists(select 1 from private.jardim_flores where user_id=v_uid and flor=substr(p->>'objeto',6) and qtd>0) then
    return pg_catalog.json_build_object('ok',false,'erro','flor'); end if;
  -- guarda só as 5 chaves conhecidas (nada além disso vai para o mural)
  v_e := pg_catalog.jsonb_build_object('fundo',p->>'fundo','pose',p->>'pose','luz',p->>'luz','quadro',p->>'quadro','objeto',p->>'objeto');
  pa := private.studio_pauta_de(v_dia);
  if v_e->>'fundo' = pa->>'fundo' then v_ac := v_ac + 1; end if;
  if v_e->>'pose' = pa->>'pose' then v_ac := v_ac + 1; end if;
  if v_e->>(pa->'detalhe'->>'tipo') = pa->'detalhe'->>'valor' then v_ac := v_ac + 1; end if;
  insert into private.studio_mural(user_id,dia,escolhas,estrelas) values(v_uid,v_dia,v_e,greatest(1,v_ac))
    on conflict (user_id,dia) do nothing returning id into v_id;
  if v_id is null then return pg_catalog.json_build_object('ok',false,'erro','ja_publicou'); end if;
  return pg_catalog.json_build_object('ok',true,'id',v_id,'estrelas',greatest(1,v_ac));
end $f$;

create or replace function public.studio_mural()
returns json language sql stable security definer set search_path to '' as $f$
  select coalesce(pg_catalog.json_agg(x order by x.coracoes desc, x.criado desc), '[]'::json) from (
    select m.id, pl.nick, pl.avatar, m.escolhas, m.estrelas, m.dia, m.criado,
      (select count(*) from private.studio_coracoes c where c.post_id=m.id)::int as coracoes,
      exists(select 1 from private.studio_coracoes c where c.post_id=m.id and c.user_id=(select auth.uid())) as curti,
      m.user_id = (select auth.uid()) as minha
    from private.studio_mural m join public.players pl on pl.id=m.user_id and not coalesce(pl.bloqueado,false)
    where m.dia >= private.studio_semana(public.hoje_br())
    order by 8 desc, m.criado desc limit 40) x
  where (select auth.uid()) is not null
$f$;

create or replace function public.studio_curtir(p_id bigint)
returns json language plpgsql volatile security definer set search_path to '' as $f$
declare v_uid uuid := auth.uid(); v_dono uuid; v_n int;
begin
  if v_uid is null or not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select user_id into v_dono from private.studio_mural where id=p_id and dia >= private.studio_semana(public.hoje_br());
  if v_dono is null then return pg_catalog.json_build_object('ok',false,'erro','post'); end if;
  if v_dono = v_uid then return pg_catalog.json_build_object('ok',false,'erro','propria'); end if;
  if (select count(*) from private.studio_coracoes where user_id=v_uid and em > now() - interval '1 day') >= 60 then
    return pg_catalog.json_build_object('ok',false,'erro','limite'); end if;
  insert into private.studio_coracoes(post_id,user_id) values(p_id,v_uid) on conflict do nothing;
  select count(*) into v_n from private.studio_coracoes where post_id=p_id;
  return pg_catalog.json_build_object('ok',true,'coracoes',v_n);
end $f$;

-- Capa: a foto mais curtida da semana passada; se ainda não houver, a líder da semana atual (parcial).
create or replace function public.studio_capa()
returns json language sql stable security definer set search_path to '' as $f$
  with s as (select private.studio_semana(public.hoje_br()) as atual),
  c as (
    select m.id, pl.nick, pl.avatar, m.escolhas, m.estrelas, m.dia,
      (select count(*) from private.studio_coracoes h where h.post_id=m.id)::int as coracoes,
      (m.dia < (select atual from s)) as fechada
    from private.studio_mural m join public.players pl on pl.id=m.user_id and not coalesce(pl.bloqueado,false)
    where m.dia >= (select atual from s) - 7)
  select coalesce((select pg_catalog.row_to_json(c) from c where coracoes > 0
    order by fechada desc, coracoes desc, dia asc limit 1), 'null'::json)
$f$;

revoke all on function private.studio_semana(date) from public, anon, authenticated;
revoke all on function public.studio_publicar(jsonb) from public, anon;
revoke all on function public.studio_mural() from public, anon;
revoke all on function public.studio_curtir(bigint) from public, anon;
revoke all on function public.studio_capa() from public, anon;
grant execute on function public.studio_publicar(jsonb) to authenticated, service_role;
grant execute on function public.studio_mural() to authenticated, service_role;
grant execute on function public.studio_curtir(bigint) to authenticated, service_role;
grant execute on function public.studio_capa() to authenticated, service_role;
