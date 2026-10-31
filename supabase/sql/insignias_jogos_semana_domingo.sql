-- PR #49 · reúne insígnias locais no perfil e padroniza a semana em domingo.
-- Aplicar no projeto de produção somente após revisar/mesclar o PR.
begin;

create or replace function public.insignias_calc(p_id uuid)
returns text[]
language sql
stable
security definer
set search_path to 'public'
as $function$
  with p as (select * from public.players where id = p_id),
  l as (
    select count(*) n,
      count(distinct (created_at at time zone 'America/Sao_Paulo')::date) dias
    from public.leaderboard where user_id = p_id
  ),
  pets as (select coalesce(p.nuvem_pet->'pets', '{}'::jsonb) j from p),
  mini as (
    select public.mini_pts(p.nuvem_pet, 'ritmo') r,
           public.mini_pts(p.nuvem_pet, 'corda') c from p
  ),
  sem as (
    select user_id, rank() over (partition by w order by score desc) rk
    from (
      select user_id, score,
        date_trunc('week', (created_at at time zone 'America/Sao_Paulo') + interval '1 day') - interval '1 day' w
      from public.leaderboard where user_id is not null
    ) a
    where a.w < date_trunc('week', (now() at time zone 'America/Sao_Paulo') + interval '1 day') - interval '1 day'
  ),
  tem as (
    select coalesce(array_agg(distinct 'tema_' || t), '{}') a
    from (
      select public.tema_do_dia((created_at at time zone 'America/Sao_Paulo')::date) t
      from public.leaderboard where user_id = p_id
    ) x where t is not null
  ),
  sora as (
    select coalesce(max(score),0) score
    from private.sora_scores where player_id=p_id and period_type='all'
  )
  select array_remove(array[
    case when (select n from l) >= 1 then 'estreia' end,
    case when (select n from l) >= 100 then 'maratona' end,
    case when (select dias from l) >= 7 then 'presenca' end,
    case when (select best from p) >= 5000 then 'center' end,
    case when (select best from p) >= 30000 then 'ace' end,
    case when (select best from p) >= 50000 then 'kami' end,
    case when (select j ? 'tsu' and j ? 'lirika' and j ? 'pati' and j ? 'meu' from pets) then 'familia' end,
    case when exists (select 1 from pets, jsonb_each(pets.j) e(k,v)
      where coalesce(v->>'xp','') ~ '^\\d+(\\.\\d+)?$' and (v->>'xp')::numeric >= 800) then 'petkami' end,
    case when ((select r from mini) > 0 and not exists (
      select 1 from public.players o where o.id <> p_id and public.mini_pts(o.nuvem_pet,'ritmo') > (select r from mini)))
      or ((select c from mini) > 0 and not exists (
      select 1 from public.players o where o.id <> p_id and public.mini_pts(o.nuvem_pet,'corda') > (select c from mini)))
      then 'top1mini' end,
    case when coalesce(array_length((select visuais from p),1),0) >= 5 then 'fashion' end,
    case when (select avatar is not null and not coalesce((avatar->>'auto')::boolean,false) from p) then 'estilista' end,
    case when (select count(*) from public.coracoes where para=p_id) >= 10 then 'amada' end,
    case when (select quarteto_em is not null from p) then 'quarteto' end,
    case when (select count(*) from public.recados where de=p_id) >= 10 then 'carteiro' end,
    case when (select count(*) from public.coracoes where de=p_id) >= 10 then 'amizade' end,
    case when array['roupa_brasil','roupa_pijama','roupa_happi','roupa_gingham','roupa_hipster','roupa_rock','roupa_disco','roupa_technopop','roupa_decora','roupa_alienfan'] <@ coalesce((select visuais from p),'{}') then 'guarda' end,
    case when exists (select 1 from sem where sem.user_id=p_id and sem.rk=1) then 'centersemana' end,
    case when (select score from sora) >= 500 then 'sora_500' end,
    case when (select score from sora) >= 1500 then 'sora_1500' end,
    case when (select score from sora) >= 3000 then 'sora_3000' end
  ], null) || (select a from tem);
$function$;

create or replace function public.sincronizar_insignias_jogos(p_insignias text[])
returns text[]
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_uid uuid := auth.uid();
  v_validas text[];
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider','') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous','false') = 'true' then
    raise exception 'google_login_required' using errcode='42501';
  end if;

  v_validas := array(
    select distinct x
    from unnest(coalesce(p_insignias,'{}'::text[])) x
    where x = any(array[
      's2_ensaio','s2_backstage','s2_estudio','s2_festival',
      's2_aeroporto','s2_geral','s2_dome'
    ]::text[])
  );

  update public.players
     set ins_ganhas = (
       select array_agg(distinct badge)
       from unnest(coalesce(ins_ganhas,'{}'::text[]) || v_validas) badge
     )
   where id=v_uid;

  return public.insignias(v_uid);
end
$function$;

revoke all on function public.sincronizar_insignias_jogos(text[]) from public, anon;
grant execute on function public.sincronizar_insignias_jogos(text[]) to authenticated;

comment on function public.insignias_calc(uuid) is
  'Insígnias do perfil; Center semanal usa semana domingo-sábado em America/Sao_Paulo e inclui marcos do Sora Jump.';
comment on function public.sincronizar_insignias_jogos(text[]) is
  'Persiste no perfil as sete insígnias da Temporada 2 do Center Run sincronizadas pelo cliente autenticado Google.';

commit;
