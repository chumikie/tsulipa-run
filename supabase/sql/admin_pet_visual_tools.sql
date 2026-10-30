-- PROPOSTA: ferramentas de moderação de pets e visual do perfil.
-- NÃO APLICADO em produção. Homologar antes de executar este arquivo.
-- Os RPCs são restritos a authenticated e verificam public.eh_admin().
-- As revisões impedem que saves antigos de outra aba/aparelho desfaçam uma correção.
BEGIN;

CREATE OR REPLACE FUNCTION public.admin_cuidar_pets(
  p_nick text,
  p_motivo text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_uid uuid;
  v_nick text;
  v_pet jsonb;
  v_pets jsonb;
  v_key text;
  v_item jsonb;
  v_count integer := 0;
  v_now_ms bigint;
  v_rev bigint;
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;

  SELECT p.id, p.nick, p.nuvem_pet
    INTO v_uid, v_nick, v_pet
    FROM public.players p
   WHERE lower(p.nick) = lower(btrim(coalesce(p_nick, '')))
   FOR UPDATE;

  IF v_uid IS NULL THEN
    RETURN json_build_object('ok', false, 'erro', 'perfil');
  END IF;
  IF EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = v_uid) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;
  IF v_pet IS NULL OR jsonb_typeof(v_pet->'pets') IS DISTINCT FROM 'object' THEN
    RETURN json_build_object('ok', false, 'erro', 'sem_pets');
  END IF;

  v_now_ms := floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint;
  v_pets := v_pet->'pets';

  FOR v_key, v_item IN
    SELECT e.key, e.value FROM jsonb_each(v_pets) AS e(key, value)
  LOOP
    IF jsonb_typeof(v_item) = 'object' THEN
      v_item := v_item || jsonb_build_object(
        'fome', 100,
        'energia', 100,
        'humor', 100,
        'higiene', 100,
        'dorme', false,
        't', v_now_ms
      );
      v_pets := jsonb_set(v_pets, ARRAY[v_key], v_item, true);
      v_count := v_count + 1;
    END IF;
  END LOOP;

  IF v_count = 0 THEN
    RETURN json_build_object('ok', false, 'erro', 'sem_pets');
  END IF;

  v_rev := greatest(coalesce(nullif(v_pet->>'admin_pet_rev', '')::bigint, 0), 0) + 1;
  v_pet := jsonb_set(v_pet, '{pets}', v_pets, true);
  v_pet := jsonb_set(v_pet, '{admin_pet_rev}', to_jsonb(v_rev), true);

  UPDATE public.players
     SET nuvem_pet = v_pet,
         nuvem_ms = greatest(coalesce(nuvem_ms, 0), v_now_ms),
         updated_at = now()
   WHERE id = v_uid;

  INSERT INTO public.admin_log(admin, acao, alvo, valor, motivo)
  VALUES (
    auth.uid(),
    'pets_restaurar',
    v_nick,
    format('%s pets; fome/energia/humor/higiene=100', v_count),
    left(nullif(btrim(coalesce(p_motivo, '')), ''), 120)
  );

  RETURN json_build_object(
    'ok', true,
    'pets', v_count,
    'admin_pet_rev', v_rev,
    'atualizar_jogo', true
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_cuidar_pets(text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_cuidar_pets(text, text) TO authenticated;


CREATE OR REPLACE FUNCTION public.admin_visual_info(p_nick text)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_player public.players%ROWTYPE;
  v_best integer := 0;
  v_out text;
  v_outcol text;
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;

  SELECT * INTO v_player
    FROM public.players p
   WHERE lower(p.nick) = lower(btrim(coalesce(p_nick, '')));

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'erro', 'perfil');
  END IF;
  IF v_player.id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = v_player.id
  ) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;

  SELECT coalesce(max(l.score), 0)::integer
    INTO v_best
    FROM public.leaderboard l
   WHERE l.user_id = v_player.id
     AND l."char" = 'Idol';

  v_out := coalesce(
    nullif(v_player.nuvem_visual #>> '{cu2,out}', ''),
    nullif(v_player.avatar #>> '{c,out}', ''),
    ''
  );
  v_outcol := coalesce(
    nullif(v_player.nuvem_visual #>> '{cu2,outcol}', ''),
    nullif(v_player.avatar #>> '{c,outcol}', ''),
    '#ffffff'
  );

  RETURN json_build_object(
    'ok', true,
    'nick', v_player.nick,
    'out', v_out,
    'outcol', v_outcol,
    'best_idol', v_best,
    'visuais', to_json(coalesce(v_player.visuais, ARRAY[]::text[]))
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_visual_info(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_visual_info(text) TO authenticated;


CREATE OR REPLACE FUNCTION public.admin_vestir(
  p_nick text,
  p_roupa text,
  p_cor text,
  p_motivo text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_player public.players%ROWTYPE;
  v_roupa text;
  v_cor text;
  v_current_out text;
  v_required integer;
  v_best integer := 0;
  v_visual jsonb;
  v_cu2 jsonb;
  v_avatar jsonb;
  v_override jsonb;
  v_rev bigint;
  v_now_ms bigint;
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;

  SELECT * INTO v_player
    FROM public.players p
   WHERE lower(p.nick) = lower(btrim(coalesce(p_nick, '')))
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'erro', 'perfil');
  END IF;
  IF v_player.id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = v_player.id
  ) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;

  v_roupa := lower(btrim(coalesce(p_roupa, '')));
  v_cor := lower(btrim(coalesce(nullif(p_cor, ''), '#ffffff')));

  IF v_cor !~ '^#[0-9a-f]{6}$' THEN
    RETURN json_build_object('ok', false, 'erro', 'cor');
  END IF;

  IF v_roupa NOT IN (
    '', 'seifuku', 'estrelado', 'y2k', 'zipper', 'sweet', 'citypop',
    'brasil', 'pijama', 'happi', 'gingham', 'hipster', 'rock', 'disco',
    'technopop', 'decora', 'alienfan', 'vampiro', 'rena', 'reveillon',
    'floral', 'coracao', 'outono', 'sakura', 'puffer', 'yukata',
    'cardiga', 'jardineira', 'festa48'
  ) THEN
    RETURN json_build_object('ok', false, 'erro', 'roupa');
  END IF;

  v_current_out := coalesce(
    nullif(v_player.nuvem_visual #>> '{cu2,out}', ''),
    nullif(v_player.avatar #>> '{c,out}', ''),
    ''
  );

  v_required := CASE v_roupa
    WHEN 'seifuku' THEN 450
    WHEN 'estrelado' THEN 1000
    WHEN 'y2k' THEN 1800
    WHEN 'zipper' THEN 2800
    WHEN 'sweet' THEN 3900
    WHEN 'citypop' THEN 5000
    ELSE NULL
  END;

  IF v_roupa IS DISTINCT FROM v_current_out AND v_required IS NOT NULL THEN
    SELECT coalesce(max(l.score), 0)::integer
      INTO v_best
      FROM public.leaderboard l
     WHERE l.user_id = v_player.id
       AND l."char" = 'Idol';
    IF v_best < v_required THEN
      RETURN json_build_object('ok', false, 'erro', 'bloqueada', 'best_idol', v_best);
    END IF;
  ELSIF v_roupa IS DISTINCT FROM v_current_out AND v_roupa <> '' AND v_required IS NULL THEN
    IF NOT (('roupa_' || v_roupa) = ANY(coalesce(v_player.visuais, ARRAY[]::text[]))) THEN
      RETURN json_build_object('ok', false, 'erro', 'nao_comprada');
    END IF;
  END IF;

  v_visual := coalesce(v_player.nuvem_visual, '{}'::jsonb);
  IF jsonb_typeof(v_visual) IS DISTINCT FROM 'object' THEN
    v_visual := '{}'::jsonb;
  END IF;
  v_cu2 := coalesce(v_visual->'cu2', '{}'::jsonb);
  IF jsonb_typeof(v_cu2) IS DISTINCT FROM 'object' THEN
    v_cu2 := '{}'::jsonb;
  END IF;

  v_override := jsonb_build_object('out', v_roupa, 'outcol', v_cor);
  v_cu2 := v_cu2 || v_override;
  v_visual := jsonb_set(v_visual, '{cu2}', v_cu2, true);
  v_rev := greatest(coalesce(nullif(v_visual->>'admin_visual_rev', '')::bigint, 0), 0) + 1;
  v_visual := jsonb_set(v_visual, '{admin_visual_rev}', to_jsonb(v_rev), true);
  v_visual := jsonb_set(v_visual, '{admin_visual_override}', v_override, true);

  v_avatar := coalesce(v_player.avatar, '{}'::jsonb);
  IF jsonb_typeof(v_avatar) IS DISTINCT FROM 'object' THEN
    v_avatar := '{}'::jsonb;
  END IF;
  IF jsonb_typeof(v_avatar->'c') = 'object' THEN
    v_avatar := jsonb_set(
      v_avatar,
      '{c}',
      (v_avatar->'c') || v_override,
      true
    );
  ELSE
    v_avatar := jsonb_build_object(
      'v', 1,
      'c', v_cu2,
      'a', coalesce(v_visual->>'acc', ''),
      'visual', '',
      'pose', 'v',
      'expr', 2,
      'fundo', 'basico',
      'auto', true
    );
  END IF;
  v_avatar := jsonb_set(v_avatar, '{admin_visual_rev}', to_jsonb(v_rev), true);

  v_now_ms := floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint;

  UPDATE public.players
     SET nuvem_visual = v_visual,
         avatar = v_avatar,
         nuvem_ms = greatest(coalesce(nuvem_ms, 0), v_now_ms),
         updated_at = now()
   WHERE id = v_player.id;

  INSERT INTO public.admin_log(admin, acao, alvo, valor, motivo)
  VALUES (
    auth.uid(),
    'visual_vestir',
    v_player.nick,
    format('Idol roupa=%s cor=%s', coalesce(nullif(v_roupa, ''), 'Trainee'), v_cor),
    left(nullif(btrim(coalesce(p_motivo, '')), ''), 120)
  );

  RETURN json_build_object(
    'ok', true,
    'nick', v_player.nick,
    'out', v_roupa,
    'outcol', v_cor,
    'admin_visual_rev', v_rev,
    'atualizar_jogo', true
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_vestir(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_vestir(text, text, text, text) TO authenticated;


-- Os clientes mais antigos podem continuar enviando saves enquanto o membro está online.
-- Se a revisão do cliente for anterior à revisão administrativa, preservamos as correções
-- já gravadas na nuvem até que ele faça o próximo carregamento completo.
CREATE OR REPLACE FUNCTION public.salvar_nuvem(
  p_pet jsonb,
  p_visual jsonb,
  p_ms bigint
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_current_pet jsonb;
  v_current_visual jsonb;
  v_current_ms bigint;
  v_pet jsonb;
  v_visual jsonb;
  v_server_pet_rev bigint := 0;
  v_client_pet_rev bigint := 0;
  v_server_visual_rev bigint := 0;
  v_client_visual_rev bigint := 0;
  v_override jsonb;
  v_cu2 jsonb;
  v_key text;
  v_server_item jsonb;
  v_client_item jsonb;
  v_client_pets jsonb;
  v_pet_rebased boolean := false;
  v_visual_rebased boolean := false;
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN json_build_object('ok', false);
  END IF;
  IF coalesce(pg_column_size(p_pet), 0) > 400000 OR coalesce(pg_column_size(p_visual), 0) > 60000 THEN
    RETURN json_build_object('ok', false, 'erro', 'grande');
  END IF;

  SELECT p.nuvem_pet, p.nuvem_visual, p.nuvem_ms
    INTO v_current_pet, v_current_visual, v_current_ms
    FROM public.players p
   WHERE p.id = auth.uid()
   FOR UPDATE;

  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'erro', 'sem_conta');
  END IF;
  IF coalesce(p_ms, 0) < coalesce(v_current_ms, 0) THEN
    RETURN json_build_object('ok', false, 'erro', 'save_antigo');
  END IF;

  v_pet := coalesce(p_pet, v_current_pet);
  v_visual := coalesce(p_visual, v_current_visual);

  IF v_pet IS NOT NULL AND jsonb_typeof(v_pet) IS DISTINCT FROM 'object' THEN
    RETURN json_build_object('ok', false, 'erro', 'pet_invalido');
  END IF;
  IF v_visual IS NOT NULL AND jsonb_typeof(v_visual) IS DISTINCT FROM 'object' THEN
    RETURN json_build_object('ok', false, 'erro', 'visual_invalido');
  END IF;
  IF v_pet IS NULL THEN v_pet := '{}'::jsonb; END IF;
  IF v_visual IS NULL THEN v_visual := '{}'::jsonb; END IF;

  v_server_pet_rev := greatest(coalesce(nullif(v_current_pet->>'admin_pet_rev', '')::bigint, 0), 0);
  v_client_pet_rev := greatest(coalesce(nullif(v_pet->>'admin_pet_rev', '')::bigint, 0), 0);

  IF v_server_pet_rev > v_client_pet_rev THEN
    v_client_pets := coalesce(v_pet->'pets', '{}'::jsonb);
    IF jsonb_typeof(v_client_pets) IS DISTINCT FROM 'object' THEN
      v_client_pets := '{}'::jsonb;
    END IF;

    FOR v_key, v_server_item IN
      SELECT e.key, e.value
        FROM jsonb_each(coalesce(v_current_pet->'pets', '{}'::jsonb)) AS e(key, value)
    LOOP
      IF jsonb_typeof(v_server_item) = 'object' THEN
        v_client_item := coalesce(v_client_pets->v_key, v_server_item);
        IF jsonb_typeof(v_client_item) IS DISTINCT FROM 'object' THEN
          v_client_item := v_server_item;
        END IF;
        v_client_item := v_client_item || jsonb_build_object(
          'fome', coalesce(v_server_item->'fome', to_jsonb(100)),
          'energia', coalesce(v_server_item->'energia', to_jsonb(100)),
          'humor', coalesce(v_server_item->'humor', to_jsonb(100)),
          'higiene', coalesce(v_server_item->'higiene', to_jsonb(100)),
          'dorme', coalesce(v_server_item->'dorme', 'false'::jsonb),
          't', coalesce(v_server_item->'t', to_jsonb(floor(extract(epoch FROM clock_timestamp()) * 1000)::bigint))
        );
        v_client_pets := jsonb_set(v_client_pets, ARRAY[v_key], v_client_item, true);
      END IF;
    END LOOP;

    v_pet := jsonb_set(v_pet, '{pets}', v_client_pets, true);
    v_pet := jsonb_set(v_pet, '{admin_pet_rev}', to_jsonb(v_server_pet_rev), true);
    v_pet_rebased := true;
  ELSIF v_client_pet_rev > v_server_pet_rev THEN
    v_pet := jsonb_set(v_pet, '{admin_pet_rev}', to_jsonb(v_server_pet_rev), true);
  END IF;

  v_server_visual_rev := greatest(coalesce(nullif(v_current_visual->>'admin_visual_rev', '')::bigint, 0), 0);
  v_client_visual_rev := greatest(coalesce(nullif(v_visual->>'admin_visual_rev', '')::bigint, 0), 0);
  -- O marcador só é confiável quando veio do registro atual do servidor.
  v_visual := v_visual - 'admin_visual_override';

  IF v_server_visual_rev > v_client_visual_rev THEN
    v_override := v_current_visual->'admin_visual_override';
    IF jsonb_typeof(v_override) = 'object' THEN
      v_cu2 := coalesce(v_visual->'cu2', '{}'::jsonb);
      IF jsonb_typeof(v_cu2) IS DISTINCT FROM 'object' THEN
        v_cu2 := '{}'::jsonb;
      END IF;
      v_visual := jsonb_set(v_visual, '{cu2}', v_cu2 || v_override, true);
      v_visual := jsonb_set(v_visual, '{admin_visual_override}', v_override, true);
    END IF;
    v_visual := jsonb_set(v_visual, '{admin_visual_rev}', to_jsonb(v_server_visual_rev), true);
    v_visual_rebased := true;
  ELSIF v_client_visual_rev > v_server_visual_rev THEN
    v_visual := jsonb_set(v_visual, '{admin_visual_rev}', to_jsonb(v_server_visual_rev), true);
  ELSIF v_server_visual_rev > 0 THEN
    v_visual := jsonb_set(v_visual, '{admin_visual_rev}', to_jsonb(v_server_visual_rev), true);
  END IF;

  IF coalesce(pg_column_size(v_pet), 0) > 400000 OR coalesce(pg_column_size(v_visual), 0) > 60000 THEN
    RETURN json_build_object('ok', false, 'erro', 'grande');
  END IF;

  UPDATE public.players
     SET nuvem_pet = v_pet,
         nuvem_visual = v_visual,
         nuvem_ms = greatest(coalesce(v_current_ms, 0), coalesce(p_ms, 0)),
         updated_at = now()
   WHERE id = auth.uid();

  RETURN json_build_object(
    'ok', found,
    'pet_rebased', v_pet_rebased,
    'visual_rebased', v_visual_rebased
  );
END;
$function$;


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

NOTIFY pgrst, 'reload schema';
COMMIT;
