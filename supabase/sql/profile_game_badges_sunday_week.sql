-- PR #49 · insígnias dos jogos no perfil + semana de domingo a sábado.
-- A importação das 7 insígnias do Center Run é cosmética e limitada a uma allowlist.
-- As 3 insígnias do Sora são calculadas no servidor pelo recorde geral da conta.
-- Nenhum histórico de pontuação é apagado por esta migração.

begin;

alter table public.players
  add column if not exists insignias_jogos text[] not null default '{}';

create or replace function public.sincronizar_insignias_jogos(p_insignias text[])
returns text[]
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_validas constant text[] := array[
    's2_ensaio','s2_backstage','s2_estudio','s2_festival',
    's2_aeroporto','s2_geral','s2_dome'
  ];
  v_pedidas text[];
  v_resultado text[];
begin
  if v_uid is null then
    raise exception 'login_required' using errcode = '42501';
  end if;

  select coalesce(array_agg(distinct x), '{}'::text[])
    into v_pedidas
  from unnest(coalesce(p_insignias, '{}'::text[])) as x
  where x = any(v_validas);

  update public.players
     set insignias_jogos = array(
       select distinct unnest(coalesce(insignias_jogos, '{}'::text[]) || v_pedidas)
     )
   where id = v_uid
   returning insignias_jogos into v_resultado;

  if not found then
    raise exception 'player_profile_unavailable' using errcode = 'P0002';
  end if;

  return coalesce(v_resultado, '{}'::text[]);
end
$function$;

revoke all on function public.sincronizar_insignias_jogos(text[]) from public;
revoke all on function public.sincronizar_insignias_jogos(text[]) from anon;
grant execute on function public.sincronizar_insignias_jogos(text[]) to authenticated;

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
           public.mini_pts(p.nuvem_pet, 'corda') c
    from p
  ),
  sem as (
    select user_id, rank() over (partition by sunday order by score desc) rk
    from (
      select user_id, score,
        (created_at at time zone 'America/Sao_Paulo')::date
          - extract(dow from (created_at at time zone 'America/Sao_Paulo'))::integer as sunday
      from public.leaderboard
      where user_id is not null
    ) a
    where a.sunday <
      ((now() at time zone 'America/Sao_Paulo')::date
       - extract(dow from (now() at time zone 'America/Sao_Paulo')::date)::integer)
  ),
  sora as (
    select coalesce(max(score) filter (where period_type = 'all'), 0) as best
    from private.sora_scores where player_id = p_id
  ),
  tem as (
    select coalesce(array_agg(distinct 'tema_' || t), '{}') a
    from (
      select public.tema_do_dia((created_at at time zone 'America/Sao_Paulo')::date) t
      from public.leaderboard where user_id = p_id
    ) x where t is not null
  )
  select array_remove(array[
    case when (select n from l) >= 1 then 'estreia' end,
    case when (select n from l) >= 100 then 'maratona' end,
    case when (select dias from l) >= 7 then 'presenca' end,
    case when (select best from p) >= 5000 then 'center' end,
    case when (select best from p) >= 30000 then 'ace' end,
    case when (select best from p) >= 50000 then 'kami' end,
    case when (select best from sora) >= 500 then 'sora_500' end,
    case when (select best from sora) >= 1500 then 'sora_1500' end,
    case when (select best from sora) >= 3000 then 'sora_3000' end,
    case when (select j ? 'tsu' and j ? 'lirika' and j ? 'pati' and j ? 'meu' from pets) then 'familia' end,
    case when exists (
      select 1 from pets, jsonb_each(pets.j) e(k, v)
      where coalesce(v->>'xp', '') ~ '^\\d+(\\.\\d+)?$'
        and (v->>'xp')::numeric >= 800
    ) then 'petkami' end,
    case when (
      (select r from mini) > 0
      and not exists (
        select 1 from public.players o
        where o.id <> p_id and public.mini_pts(o.nuvem_pet, 'ritmo') > (select r from mini)
      )
    ) or (
      (select c from mini) > 0
      and not exists (
        select 1 from public.players o
        where o.id <> p_id and public.mini_pts(o.nuvem_pet, 'corda') > (select c from mini)
      )
    ) then 'top1mini' end,
    case when coalesce(array_length((select visuais from p), 1), 0) >= 5 then 'fashion' end,
    case when (select avatar is not null and not coalesce((avatar->>'auto')::boolean, false) from p) then 'estilista' end,
    case when (select count(*) from public.coracoes where para = p_id) >= 10 then 'amada' end,
    case when (select quarteto_em is not null from p) then 'quarteto' end,
    case when (select count(*) from public.recados where de = p_id) >= 10 then 'carteiro' end,
    case when (select count(*) from public.coracoes where de = p_id) >= 10 then 'amizade' end,
    case when array[
      'roupa_brasil','roupa_pijama','roupa_happi','roupa_gingham','roupa_hipster',
      'roupa_rock','roupa_disco','roupa_technopop','roupa_decora','roupa_alienfan'
    ] <@ coalesce((select visuais from p), '{}') then 'guarda' end,
    case when exists (select 1 from sem where sem.user_id = p_id and sem.rk = 1) then 'centersemana' end
  ], null) || (select a from tem);
$function$;

create or replace function public.insignias(p_id uuid)
returns text[]
language sql
stable
security definer
set search_path to 'public'
as $function$
  with pl as (select * from public.players where id = p_id),
  c as (
    select
      greatest(
        (select count(distinct (created_at at time zone 'America/Sao_Paulo')::date)
         from public.leaderboard where user_id = p_id),
        (select dias_jogados from pl)
      ) dias,
      greatest(
        (select count(*) from public.leaderboard where user_id = p_id),
        (select corridas_total from pl)
      ) corr,
      (select count(*) from public.coracoes where para = p_id) recebidos,
      (select count(*) from public.recados where de = p_id) recados,
      (select count(*) from public.coracoes where de = p_id) dados,
      (select coalesce(array_length(visuais, 1), 0) from pl) compras,
      (select count(*) from public.duo_log where de = p_id) duos
  ),
  base as (
    select distinct unnest(
      public.insignias_calc(p_id)
      || coalesce((select insignias_extra from pl), '{}')
      || coalesce((select ins_ganhas from pl), '{}')
      || coalesce((select insignias_jogos from pl), '{}')
      || case when (select duos from c) >= 5 then array['duo'] else '{}'::text[] end
      || case when (select corr from c) >= 1 then array['estreia'] else '{}'::text[] end
      || case when (select corr from c) >= 100 then array['maratona'] else '{}'::text[] end
      || case when (select dias from c) >= 7 then array['presenca'] else '{}'::text[] end
    ) k
  )
  select coalesce(array_agg(case
    when k = 'presenca' then k || case when c.dias >= 100 then ':3' when c.dias >= 30 then ':2' else '' end
    when k = 'maratona' then k || case when c.corr >= 1000 then ':3' when c.corr >= 500 then ':2' else '' end
    when k = 'amada' then k || case when c.recebidos >= 200 then ':3' when c.recebidos >= 50 then ':2' else '' end
    when k = 'carteiro' then k || case when c.recados >= 200 then ':3' when c.recados >= 50 then ':2' else '' end
    when k = 'amizade' then k || case when c.dados >= 200 then ':3' when c.dados >= 50 then ':2' else '' end
    when k = 'fashion' then k || case when c.compras >= 30 then ':3' when c.compras >= 15 then ':2' else '' end
    when k = 'duo' then k || case when c.duos >= 100 then ':3' when c.duos >= 25 then ':2' else '' end
    else k end), '{}')
  from base, c
$function$;

comment on column public.players.insignias_jogos is
  'Insígnias locais do Center Run importadas do aparelho após autenticação; apenas chaves allowlisted.';
comment on function public.insignias_calc(uuid) is
  'Insígnias calculadas no servidor; semanas competitivas seguem domingo 00:00 a sábado 23:59 em America/Sao_Paulo.';
comment on function public.sincronizar_insignias_jogos(text[]) is
  'Importa insígnias locais allowlisted do Center Run para a coleção de perfil da conta autenticada.';

commit;
