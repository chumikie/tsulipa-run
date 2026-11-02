\set ON_ERROR_STOP on
-- Contrato isolado dos recursos visuais. Os IDs e saldos são sintéticos.
-- salvar_avatar abaixo espelha a definição versionada em
-- supabase/sql/aplicado/admin_pet_visual_tools.sql (sem SQL remoto).
-- comprar_visual reproduz a definição lida da RPC ativa em 02/11/2026:
-- retorno idempotente de compras repetidas, checagem de temporada/rank/saldo
-- e débito com star_log. Dependências auxiliares são dublês locais da CI;
-- não há chamada SQL nem alteração no Supabase ativo.

alter table public.players
  add column visuais text[] not null default '{}'::text[],
  add column best integer not null default 0,
  add column aniver date,
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

-- Campos/serviços mínimos necessários ao contrato real de comprar_visual.
-- São apenas estruturas fictícias no PostgreSQL descartável do GitHub Actions.
create table public.star_log (
  id bigserial primary key,
  user_id uuid not null,
  delta integer not null,
  reason text not null
);
create or replace function public.visual_tema(p_key text) returns text
language sql stable as $ select null::text $;
create or replace function public.hoje_br() returns date
language sql stable as $ select current_date $;
create or replace function public.tema_do_dia(p_data date) returns text
language sql stable as $ select 'tema_ci'::text $;
create or replace function public.aniver_hoje(p_aniver date) returns boolean
language sql stable as $ select false $;

-- Definição de comprar_visual inspecionada em produção por leitura, sem
-- executar RPC nem migrações no projeto ativo.
CREATE OR REPLACE FUNCTION public.comprar_visual(p_key text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
declare pr record; p public.players; tm text;
begin
  select * into pr from public.visual_preco(p_key);
  if pr.preco is null then return json_build_object('ok', false, 'erro', 'visual'); end if;
  select * into p from public.players where id = auth.uid() for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  if p_key = any(p.visuais) then return json_build_object('ok', true, 'stars', p.stars, 'visuais', p.visuais); end if;
  tm := public.visual_tema(p_key);
  if tm is not null and tm is distinct from public.tema_do_dia(public.hoje_br()) and not public.eh_admin()
     and not (tm = 'aniversario' and public.aniver_hoje(p.aniver)) then
    return json_build_object('ok', false, 'erro', 'temporada', 'stars', p.stars);
  end if;
  if p.best < pr.pontos then return json_build_object('ok', false, 'erro', 'rank', 'stars', p.stars); end if;
  if p.stars < pr.preco then return json_build_object('ok', false, 'erro', 'saldo', 'stars', p.stars); end if;
  update public.players set stars = stars - pr.preco, visuais = array_append(visuais, p_key), updated_at = now()
   where id = auth.uid() returning * into p;
  insert into public.star_log (user_id, delta, reason) values (auth.uid(), -pr.preco, 'visual:' || p_key);
  return json_build_object('ok', true, 'stars', p.stars, 'visuais', p.visuais);
end; $function$;

revoke all on function public.salvar_avatar(jsonb), public.comprar_visual(text) from public, anon;
grant execute on function public.salvar_avatar(jsonb), public.comprar_visual(text) to authenticated;

-- Ranking sintético independente: nenhuma das três migrações deve tocá-lo.
create table public.ci_ranking_guard (
  id integer primary key,
  pontos integer not null
);
insert into public.ci_ranking_guard values(1,98765);
