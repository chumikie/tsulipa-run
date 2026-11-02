\set ON_ERROR_STOP on
-- Contrato isolado dos recursos visuais. Os IDs e saldos são sintéticos.
-- salvar_avatar abaixo espelha a definição versionada em
-- supabase/sql/aplicado/admin_pet_visual_tools.sql (sem SQL remoto).
-- comprar_visual abaixo é um simulador transacional para validar que os
-- itens adicionados ao catálogo são adquiríveis; não substitui teste
-- ponta a ponta da RPC de compra presente na produção.

alter table public.players
  add column visuais text[] not null default '{}'::text[],
  add column avatar jsonb not null default '{}'::jsonb,
  add column nuvem_visual jsonb not null default '{}'::jsonb,
  add column nuvem_pet jsonb not null default '{}'::jsonb;

CREATE OR REPLACE FUNCTION public.salvar_avatar(p_avatar jsonb)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v text;
  f text;
  ps text;
  pk text;
  ro text;
  p public.players;
  livre boolean := public.eh_admin();
  v_avatar jsonb := p_avatar;
  v_visual jsonb;
  v_server_rev bigint := 0;
  v_client_rev bigint := 0;
  v_c jsonb;
BEGIN
  IF auth.uid() IS NULL OR p_avatar IS NULL OR jsonb_typeof(p_avatar) IS DISTINCT FROM 'object'
     OR pg_column_size(p_avatar) > 20000 THEN
    RETURN json_build_object('ok', false, 'erro', 'tamanho');
  END IF;

  SELECT * INTO p
    FROM public.players
   WHERE id = auth.uid()
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'erro', 'sem_conta');
  END IF;

  v_visual := coalesce(p.nuvem_visual, '{}'::jsonb);
  v_server_rev := greatest(coalesce(nullif(v_visual->>'admin_visual_rev', '')::bigint, 0), 0);
  v_client_rev := greatest(coalesce(nullif(v_avatar->>'admin_visual_rev', '')::bigint, 0), 0);

  IF v_server_rev > v_client_rev THEN
    v_c := coalesce(v_avatar->'c', '{}'::jsonb);
    IF jsonb_typeof(v_c) IS DISTINCT FROM 'object' THEN v_c := '{}'::jsonb; END IF;
    v_c := v_c || jsonb_build_object(
      'out', coalesce(v_visual #>> '{cu2,out}', ''),
      'outcol', coalesce(v_visual #>> '{cu2,outcol}', '#ffffff')
    );
    v_avatar := jsonb_set(v_avatar, '{c}', v_c, true);
  END IF;

  v_avatar := jsonb_set(v_avatar, '{admin_visual_rev}', to_jsonb(v_server_rev), true);

  v := coalesce(v_avatar->>'visual', '');
  f := coalesce(v_avatar->>'fundo', '');
  ps := coalesce(v_avatar->>'pose', '');
  pk := coalesce(v_avatar->'pet'->>'k', '');
  ro := coalesce(v_avatar->'c'->>'out', '');

  IF NOT livre THEN
    IF v <> '' AND NOT (v = ANY(p.visuais)) THEN
      RETURN json_build_object('ok', false, 'erro', 'visual_nao_comprado');
    END IF;
    IF f NOT IN ('', 'basico', 'temporada') AND NOT (('fundo_' || f) = ANY(p.visuais)) THEN
      RETURN json_build_object('ok', false, 'erro', 'fundo_nao_comprado');
    END IF;
    IF ps NOT IN ('', 'v', 'coracao', 'tchau') AND NOT (('pose_' || ps) = ANY(p.visuais)) THEN
      RETURN json_build_object('ok', false, 'erro', 'pose_nao_comprada');
    END IF;
    IF ro <> '' AND (SELECT preco FROM public.visual_preco('roupa_' || ro)) IS NOT NULL
       AND NOT (('roupa_' || ro) = ANY(p.visuais)) THEN
      RETURN json_build_object('ok', false, 'erro', 'roupa_nao_comprada');
    END IF;
  END IF;

  IF pk <> '' AND NOT coalesce((p.nuvem_pet->'pets') ? pk, false) THEN
    RETURN json_build_object('ok', false, 'erro', 'pet');
  END IF;

  UPDATE public.players
     SET avatar = v_avatar, updated_at = now()
   WHERE id = auth.uid();

  RETURN json_build_object('ok', true, 'admin_visual_rev', v_server_rev);
END;
$function$;

create or replace function public.comprar_visual(p_key text)
returns json language plpgsql security definer set search_path to ''
as $compra_teste$
declare
  p public.players;
  custo integer;
  pontos_necessarios integer;
begin
  if auth.uid() is null then
    return json_build_object('ok',false,'erro','login');
  end if;
  select * into p from public.players where id=auth.uid() for update;
  if not found then
    return json_build_object('ok',false,'erro','sem_conta');
  end if;
  select preco,pontos into custo,pontos_necessarios
    from public.visual_preco(p_key);
  if custo is null then
    return json_build_object('ok',false,'erro','visual');
  end if;
  if p_key = any(p.visuais) then
    return json_build_object('ok',false,'erro','ja_tem');
  end if;
  if p.stars < custo then
    return json_build_object('ok',false,'erro','estrelas');
  end if;
  update public.players
     set stars=stars-custo, visuais=array_append(visuais,p_key), updated_at=now()
   where id=auth.uid();
  return json_build_object('ok',true,'custo',custo);
end
$compra_teste$;

revoke all on function public.salvar_avatar(jsonb), public.comprar_visual(text) from public, anon;
grant execute on function public.salvar_avatar(jsonb), public.comprar_visual(text) to authenticated;

-- Ranking sintético independente: nenhuma das três migrações deve tocá-lo.
create table public.ci_ranking_guard (
  id integer primary key,
  pontos integer not null
);
insert into public.ci_ranking_guard values(1,98765);
