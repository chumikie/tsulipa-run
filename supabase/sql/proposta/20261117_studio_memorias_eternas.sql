-- PROPOSTA NÃO APLICADA — Memórias⭐Eternas / PR #113.
-- Executar somente após aprovação do dono e testes em PostgreSQL isolado.
-- Não faz backfill: os registros anteriores permanecem NULL, sem inventar visuais.
-- Mantém assinaturas RPC, RLS, limites, corações, tema e prêmios originais.
begin;
alter table private.studio_mural add column if not exists retrato jsonb;
-- A mesma lista explícita de atributos visuais de studio.js. Não armazena PNG.
create or replace function private.studio_retrato_limpo(r jsonb)
returns jsonb language plpgsql immutable set search_path to ''
as $f$
declare a jsonb; c jsonb := '{}'::jsonb; vis jsonb := '{}'::jsonb; pet jsonb; pv jsonb; cfg jsonb; cv jsonb; k text;
  tempo numeric;
begin
  if pg_catalog.jsonb_typeof(r) is distinct from 'object' or pg_catalog.octet_length(r::text) > 8192
    or r->'v' is distinct from '1'::jsonb
    or pg_catalog.jsonb_typeof(r->'avatar') is distinct from 'object'
    or pg_catalog.jsonb_typeof(r->'avatar'->'c') is distinct from 'object'
    or pg_catalog.jsonb_typeof(r->'tempo') is distinct from 'number' then return null; end if;
  tempo := (r->>'tempo')::numeric;
  if tempo < 0 or tempo > 31536000 then return null; end if;
  a := r->'avatar';
  foreach k in array array['hair','hair2','skin','eye','outcol','legcol'] loop
    if pg_catalog.jsonb_typeof(a->'c'->k) = 'string' and (a->'c'->>k) ~* '^#[0-9a-f]{6}$' then
      c := c || pg_catalog.jsonb_build_object(k,a->'c'->k); end if;
  end loop;
  foreach k in array array['mecha','back','front','det','gl','out','baixo','hat','olho','boca','bochecha','sobrancelha'] loop
    if pg_catalog.jsonb_typeof(a->'c'->k) = 'string' and (a->'c'->>k) ~ '^[A-Za-z0-9_-]{0,32}$' then
      c := c || pg_catalog.jsonb_build_object(k,a->'c'->k); end if;
  end loop;
  if pg_catalog.jsonb_typeof(a->'c'->'streak') = 'boolean' then c := c || pg_catalog.jsonb_build_object('streak',a->'c'->'streak'); end if;
  vis := pg_catalog.jsonb_build_object('c',c);
  foreach k in array array['a','visual'] loop
    if pg_catalog.jsonb_typeof(a->k) = 'string' and (a->>k) ~ '^[A-Za-z0-9_-]{0,32}$' then
      vis := vis || pg_catalog.jsonb_build_object(k,a->k); end if;
  end loop;
  if pg_catalog.jsonb_typeof(a->'cor') = 'string' and (a->>'cor') ~* '^#[0-9a-f]{6}$' then vis := vis || pg_catalog.jsonb_build_object('cor',a->'cor'); end if;
  if pg_catalog.jsonb_typeof(a->'expr') = 'number' then
    if (a->>'expr')::numeric in (0,1,2,3,4,5,6) then vis := vis || pg_catalog.jsonb_build_object('expr',a->'expr'); end if;
  end if;
  pet := a->'pet';
  if pg_catalog.jsonb_typeof(pet) = 'object' and pet->>'k' in ('tsu','lirika','pati','meu') then
    pv := pg_catalog.jsonb_build_object('k',pet->'k');
    if pg_catalog.jsonb_typeof(pet->'acc') = 'string' and (pet->>'acc') ~ '^[A-Za-z0-9_-]{0,32}$' then pv := pv || pg_catalog.jsonb_build_object('acc',pet->'acc'); end if;
    if pg_catalog.jsonb_typeof(pet->'bochecha') = 'boolean' then pv := pv || pg_catalog.jsonb_build_object('bochecha',pet->'bochecha'); end if;
    cfg := pet->'cfg';
    if pet->>'k' = 'meu' and pg_catalog.jsonb_typeof(cfg) = 'object' then
      cv := '{}'::jsonb;
      foreach k in array array['orelha','olhos','acc'] loop
        if pg_catalog.jsonb_typeof(cfg->k) = 'string' and (cfg->>k) ~ '^[A-Za-z0-9_-]{0,32}$' then cv := cv || pg_catalog.jsonb_build_object(k,cfg->k); end if;
      end loop;
      if pg_catalog.jsonb_typeof(cfg->'cor') = 'string' and (cfg->>'cor') ~* '^#[0-9a-f]{6}$' then cv := cv || pg_catalog.jsonb_build_object('cor',cfg->'cor'); end if;
      if pg_catalog.jsonb_typeof(cfg->'bochecha') = 'boolean' then cv := cv || pg_catalog.jsonb_build_object('bochecha',cfg->'bochecha'); end if;
      pv := pv || pg_catalog.jsonb_build_object('cfg',cv);
    end if;
    vis := vis || pg_catalog.jsonb_build_object('pet',pv);
  end if;
  return pg_catalog.jsonb_build_object('v',1,'avatar',vis,'tempo',tempo);
end $f$;
revoke all on function private.studio_retrato_limpo(jsonb) from public, anon, authenticated;

create or replace function public.studio_publicar(p jsonb)
 returns json
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); pa jsonb; v_ac int := 0; v_id bigint;
  v_e jsonb; v_retrato jsonb; v_dono public.players; v_sku text; v_req integer; v_acc text; v_tema text; v_ini date; v_premio int := 0; v_stars int;
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
  -- Clientes antigos não enviam retrato: a publicação continua compatível.
  if p ? 'retrato' then
    v_retrato := private.studio_retrato_limpo(p->'retrato');
    if v_retrato is null then return pg_catalog.json_build_object('ok',false,'erro','retrato'); end if;
    -- Dados de desenho do cliente não são prova de posse. Consultar a conta autenticada,
    -- sem alterar seu avatar ou sincronizar inventário; mesma exceção admin de salvar_avatar.
    select * into v_dono from public.players where id=v_uid;
    if not coalesce(public.eh_admin(),false) then
      v_sku := coalesce(v_retrato#>>'{avatar,visual}','');
      if v_sku <> '' and not (v_sku = any(coalesce(v_dono.visuais,array[]::text[]))) then
        return pg_catalog.json_build_object('ok',false,'erro','visual_nao_comprado'); end if;
      foreach v_sku in array array[
        'roupa_' || coalesce(v_retrato#>>'{avatar,c,out}',''),
        'det_' || coalesce(v_retrato#>>'{avatar,c,det}',''),
        'hat_' || coalesce(v_retrato#>>'{avatar,c,hat}',''),
        'expr_' || coalesce(v_retrato#>>'{avatar,expr}','')
      ] loop
        if (select preco from public.visual_preco(v_sku)) is not null
          and not (v_sku = any(coalesce(v_dono.visuais,array[]::text[]))) then
          return pg_catalog.json_build_object('ok',false,'erro','visual_nao_comprado'); end if;
      end loop;
      -- Acessórios de rank ACC (centerrun.js); não comprovar rank por dados do navegador.
      v_acc := coalesce(v_retrato#>>'{avatar,a}','');
      v_req := case v_acc when '' then 0 when 'laco' then 450 when 'mic' then 1000
        when 'hibisco' then 1800 when 'sakura' then 2800 when 'tiaraS' then 3900
        when 'tiaraO' then 5000 when 'estrela' then 10000 else null end;
      if v_req is null or coalesce(v_dono.best,0) < v_req then
        return pg_catalog.json_build_object('ok',false,'erro','visual_nao_comprado'); end if;
    end if;
    if coalesce(v_retrato#>>'{avatar,pet,k}','') <> '' and
      not coalesce((v_dono.nuvem_pet->'pets') ? (v_retrato#>>'{avatar,pet,k}'),false) then
      return pg_catalog.json_build_object('ok',false,'erro','pet'); end if;
  end if;
  pa := private.studio_pauta_de(v_dia);
  if v_e->>'fundo' = pa->>'fundo' then v_ac := v_ac + 1; end if;
  if v_e->>'pose' = pa->>'pose' then v_ac := v_ac + 1; end if;
  if v_e->>(pa->'detalhe'->>'tipo') = pa->'detalhe'->>'valor' then v_ac := v_ac + 1; end if;
  insert into private.studio_mural(user_id,dia,escolhas,estrelas,retrato) values(v_uid,v_dia,v_e,greatest(1,v_ac),v_retrato)
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

create or replace function public.studio_mural()
returns json language sql stable security definer set search_path to '' as $f$
  select coalesce(pg_catalog.json_agg(x order by x.coracoes desc, x.criado desc), '[]'::json) from (
    select m.id, pl.nick, coalesce(m.retrato->'avatar',pl.avatar) as avatar, m.escolhas, m.estrelas, m.dia, m.criado,
      (select count(*) from private.studio_coracoes c where c.post_id=m.id)::int as coracoes,
      exists(select 1 from private.studio_coracoes c where c.post_id=m.id and c.user_id=(select auth.uid())) as curti,
      m.user_id = (select auth.uid()) as minha, m.retrato
    from private.studio_mural m join public.players pl on pl.id=m.user_id and not coalesce(pl.bloqueado,false)
    where m.dia >= private.studio_semana(public.hoje_br())
    order by 8 desc, m.criado desc limit 40) x
  where (select auth.uid()) is not null
$f$;

create or replace function public.studio_capa()
returns json language sql stable security definer set search_path to '' as $f$
  with s as (select private.studio_semana(public.hoje_br()) as atual),
  c as (
    select m.id, pl.nick, coalesce(m.retrato->'avatar',pl.avatar) as avatar, m.escolhas, m.estrelas, m.dia,
      (select count(*) from private.studio_coracoes h where h.post_id=m.id)::int as coracoes,
      (m.dia < (select atual from s)) as fechada, m.retrato
    from private.studio_mural m join public.players pl on pl.id=m.user_id and not coalesce(pl.bloqueado,false)
    where m.dia >= (select atual from s) - 7)
  select coalesce((select pg_catalog.row_to_json(c) from c where coracoes > 0
    order by fechada desc, coracoes desc, dia asc limit 1), 'null'::json)
$f$;

-- Assinaturas existentes são mantidas; grants explícitos também.
revoke all on function public.studio_publicar(jsonb) from public, anon;
revoke all on function public.studio_mural() from public, anon;
revoke all on function public.studio_capa() from public, anon;
grant execute on function public.studio_publicar(jsonb) to authenticated, service_role;
grant execute on function public.studio_mural() to authenticated, service_role;
grant execute on function public.studio_capa() to authenticated, service_role;
commit;
