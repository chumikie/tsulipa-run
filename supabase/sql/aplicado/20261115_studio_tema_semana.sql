-- Photo⭐Studio!: prêmio do tema da semana (15/11/2026, OK do dono: "faça tudo isso").
-- Publicar no mural uma foto que combina com o tema da semana dá ★3, uma vez por semana.
-- O tema muda todo domingo 0h de Brasília, na mesma régua do site (studio.js: temaSemana()):
--   semana = floor((agora - 2026-11-01 03:00 UTC) / 7 dias); tema = TEMAS[semana mod 7]
--   TEMAS = neon, ceu, sol, flores, palco, close, fofura (mesma ordem do site).
-- O controle de "uma vez por semana" usa private.bonus_jogo_dia com jogo 'foto_tema' e dia = início da semana.

alter table private.bonus_jogo_dia drop constraint if exists bonus_jogo_dia_jogo_check;
alter table private.bonus_jogo_dia add constraint bonus_jogo_dia_jogo_check
  check (jogo = any (array['cafe'::text, 'hand'::text, 'duo'::text, 'foto'::text, 'foto_tema'::text]));

create or replace function private.studio_tema_semana()
returns table(tema text, inicio date)
language sql stable
set search_path to ''
as $$
  with s as (select floor(extract(epoch from (now() - timestamptz '2026-11-01 03:00:00+00')) / 604800)::int as n)
  select (array['neon','ceu','sol','flores','palco','close','fofura'])[((s.n % 7) + 7) % 7 + 1],
         date '2026-11-01' + 7 * s.n
  from s;
$$;

create or replace function private.studio_no_tema(e jsonb, tema text)
returns boolean
language sql immutable
set search_path to ''
as $$
  select case tema
    when 'neon'   then e->>'fundo' = 'neon' or e->>'luz' = 'neon'
    when 'ceu'    then e->>'fundo' = 'nuvens'
    when 'sol'    then e->>'luz' = 'por'
    when 'flores' then coalesce(e->>'objeto','') like 'flor\_%'
    when 'palco'  then e->>'objeto' in ('microfone','lightstick')
    when 'close'  then e->>'quadro' = 'rosto'
    when 'fofura' then e->>'pose' = 'coracao'
    else false end;
$$;

revoke all on function private.studio_tema_semana() from public, anon, authenticated;
revoke all on function private.studio_no_tema(jsonb, text) from public, anon, authenticated;

create or replace function public.studio_publicar(p jsonb)
 returns json
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); pa jsonb; v_ac int := 0; v_id bigint;
  v_e jsonb; v_tema text; v_ini date; v_premio int := 0; v_stars int;
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
  v_e := pg_catalog.jsonb_build_object('fundo',p->>'fundo','pose',p->>'pose','luz',p->>'luz','quadro',p->>'quadro','objeto',p->>'objeto');
  pa := private.studio_pauta_de(v_dia);
  if v_e->>'fundo' = pa->>'fundo' then v_ac := v_ac + 1; end if;
  if v_e->>'pose' = pa->>'pose' then v_ac := v_ac + 1; end if;
  if v_e->>(pa->'detalhe'->>'tipo') = pa->'detalhe'->>'valor' then v_ac := v_ac + 1; end if;
  insert into private.studio_mural(user_id,dia,escolhas,estrelas) values(v_uid,v_dia,v_e,greatest(1,v_ac))
    on conflict (user_id,dia) do nothing returning id into v_id;
  if v_id is null then return pg_catalog.json_build_object('ok',false,'erro','ja_publicou'); end if;
  -- tema da semana: ★3 uma vez por semana para quem publica uma foto no tema
  select t.tema, t.inicio into v_tema, v_ini from private.studio_tema_semana() t;
  if private.studio_no_tema(v_e, v_tema) then
    insert into private.bonus_jogo_dia(user_id,jogo,dia,run_id) values(v_uid,'foto_tema',v_ini,pg_catalog.gen_random_uuid()) on conflict do nothing;
    if found then
      v_premio := 3;
      update public.players set stars=stars+3,updated_at=now() where id=v_uid returning stars into v_stars;
      insert into public.star_log(user_id,delta,reason) values(v_uid,3,'bonus_foto_tema');
    end if;
  end if;
  return pg_catalog.json_build_object('ok',true,'id',v_id,'estrelas',greatest(1,v_ac),'tema',v_tema,'premio_tema',v_premio,'stars',v_stars);
end $function$;
