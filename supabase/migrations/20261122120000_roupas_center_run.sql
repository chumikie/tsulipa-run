-- Looks do Center⭐Run! como roupa (22/11/2026): Fever, Ímã, Mega, Abdução e os 5 uniformes de rank (Center,
-- Solo Center, Capitão, Eternal Ace, Kami-Oshi) entram na lista "Roupa" com o valor 'cr_…', liberados pelo recorde
-- do Idol, como as roupas de rank que já existem (Debut, Nagareboshi…). Não custam estrelas, não mexem em saldo
-- nem em recompensa. O save do próprio jogador (salvar_avatar) já aceita roupa sem preço na loja; aqui só as duas
-- ferramentas do admin passam a reconhecer os valores novos (antes recusavam com 'roupa'). O admin_vestir também
-- passa a aceitar 'tailandia' e 'indonesia', que o admin_montar_idol já aceitava.
-- Recorde: Fever 450, Ímã 1000, Mega 1800, Abdução 2800, Center 5000, Solo Center 10000, Capitão 15000,
-- Eternal Ace 30000, Kami-Oshi 50000. Igual às versões atuais em todo o resto.
-- Aplicada em produção em 22/11/2026 (registro 20261122231832); conferida em 23/11: SECURITY DEFINER, anon sem execute, authenticated com execute.

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
    'brasil', 'tailandia', 'indonesia', 'pijama', 'happi', 'gingham', 'hipster', 'rock', 'disco',
    'technopop', 'decora', 'alienfan', 'vampiro', 'rena', 'reveillon',
    'floral', 'coracao', 'outono', 'sakura', 'puffer', 'yukata',
    'cardiga', 'jardineira', 'festa48',
    'cr_fever', 'cr_ima', 'cr_mega', 'cr_alien', 'cr_center', 'cr_solo', 'cr_capitao', 'cr_ace', 'cr_kami'
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
    WHEN 'cr_fever' THEN 450
    WHEN 'cr_ima' THEN 1000
    WHEN 'cr_mega' THEN 1800
    WHEN 'cr_alien' THEN 2800
    WHEN 'cr_center' THEN 5000
    WHEN 'cr_solo' THEN 10000
    WHEN 'cr_capitao' THEN 15000
    WHEN 'cr_ace' THEN 30000
    WHEN 'cr_kami' THEN 50000
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

CREATE OR REPLACE FUNCTION public.admin_montar_idol(p_nick text, p_c jsonb, p_motivo text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  v_player public.players%ROWTYPE;
  v_atual jsonb;
  v_o jsonb := '{}'::jsonb;
  v_k text;
  v_v text;
  v_best integer := 0;
  v_req integer;
  v_visual jsonb;
  v_cu2 jsonb;
  v_avatar jsonb;
  v_rev bigint;
  v_now_ms bigint;
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;
  IF jsonb_typeof(p_c) IS DISTINCT FROM 'object' THEN
    RETURN json_build_object('ok', false, 'erro', 'dados');
  END IF;

  SELECT * INTO v_player FROM public.players p
   WHERE lower(p.nick) = lower(btrim(coalesce(p_nick, ''))) FOR UPDATE;
  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'erro', 'perfil');
  END IF;
  IF v_player.id = auth.uid() OR EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = v_player.id) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;

  -- visual atual (o que o membro já usa continua aceito, mesmo que a regra de liberação mude)
  v_atual := CASE WHEN jsonb_typeof(v_player.avatar->'c') = 'object' THEN v_player.avatar->'c' ELSE '{}'::jsonb END;
  IF jsonb_typeof(v_player.nuvem_visual->'cu2') = 'object' THEN
    v_atual := v_atual || (v_player.nuvem_visual->'cu2');
  END IF;
  SELECT coalesce(max(l.score), 0)::integer INTO v_best
    FROM public.leaderboard l WHERE l.user_id = v_player.id AND l."char" = 'Idol';

  -- cores
  FOREACH v_k IN ARRAY ARRAY['hair', 'hair2', 'eye', 'skin', 'outcol'] LOOP
    v_v := lower(btrim(coalesce(p_c->>v_k, '')));
    IF v_v !~ '^#[0-9a-f]{6}$' THEN
      RETURN json_build_object('ok', false, 'erro', 'cor', 'campo', v_k);
    END IF;
    v_o := v_o || jsonb_build_object(v_k, v_v);
  END LOOP;

  -- bicolor: a outra metade do cabelo
  IF p_c ? 'lado2' THEN
    v_v := lower(btrim(coalesce(p_c->>'lado2', '')));
    IF v_v <> '' AND v_v !~ '^#[0-9a-f]{6}$' THEN
      RETURN json_build_object('ok', false, 'erro', 'cor', 'campo', 'lado2');
    END IF;
    v_o := v_o || jsonb_build_object('lado2', v_v);
  ELSIF lower(coalesce(v_atual->>'lado2', '')) ~ '^#[0-9a-f]{6}$' THEN
    v_o := v_o || jsonb_build_object('lado2', lower(v_atual->>'lado2'));
  END IF;

  -- V3.1 (06/11/2026): parte de baixo e meias, só quando vierem (o resto do save fica como está)
  IF p_c ? 'baixo' THEN
    v_v := coalesce(p_c->>'baixo', '');
    IF v_v NOT IN ('', 'saia', 'bermuda') THEN
      RETURN json_build_object('ok', false, 'erro', 'baixo');
    END IF;
    v_o := v_o || jsonb_build_object('baixo', v_v);
  END IF;
  IF p_c ? 'legcol' THEN
    v_v := lower(btrim(coalesce(p_c->>'legcol', '')));
    IF v_v !~ '^#[0-9a-f]{6}$' THEN
      RETURN json_build_object('ok', false, 'erro', 'cor', 'campo', 'legcol');
    END IF;
    v_o := v_o || jsonb_build_object('legcol', v_v);
  END IF;

  -- formas grátis
  v_v := coalesce(p_c->>'back', '');
  IF v_v NOT IN ('', 'pixie', 'onduladom', 'onduladom2', 'onduladof', 'chanel', 'longo', 'marias', 'rabo', 'cacheado') THEN
    RETURN json_build_object('ok', false, 'erro', 'corte');
  END IF;
  v_o := v_o || jsonb_build_object('back', v_v);

  v_v := coalesce(p_c->>'front', 'bagunca');
  IF v_v NOT IN ('bagunca', 'reta', 'lateral', 'espetada', 'arcoiris', 'ondulada', 'risca', 'repicada') THEN
    RETURN json_build_object('ok', false, 'erro', 'franja');
  END IF;
  v_o := v_o || jsonb_build_object('front', v_v);

  v_v := coalesce(p_c->>'mecha', '');
  IF v_v NOT IN ('', 'uma', 'dupla', 'luzes', 'escondida', 'antena', 'coracao') THEN
    RETURN json_build_object('ok', false, 'erro', 'mecha');
  END IF;
  v_o := v_o || jsonb_build_object('mecha', v_v, 'streak', v_v <> '');

  v_v := coalesce(p_c->>'gl', '');
  IF v_v NOT IN ('', 'redonda', 'quadrada') THEN
    RETURN json_build_object('ok', false, 'erro', 'oculos');
  END IF;
  v_o := v_o || jsonb_build_object('gl', v_v);

  -- detalhe: "coelho" é da lojinha
  v_v := coalesce(p_c->>'det', '');
  IF v_v NOT IN ('', 'coques', 'gato', 'elfo', 'olheiras', 'chifres', 'antena', 'coracao', 'coelho') THEN
    RETURN json_build_object('ok', false, 'erro', 'detalhe');
  END IF;
  IF v_v = 'coelho' AND v_v IS DISTINCT FROM coalesce(v_atual->>'det', '')
     AND NOT ('det_coelho' = ANY(coalesce(v_player.visuais, ARRAY[]::text[]))) THEN
    RETURN json_build_object('ok', false, 'erro', 'nao_comprada', 'campo', 'det');
  END IF;
  v_o := v_o || jsonb_build_object('det', v_v);

  -- acessório: liberado pelo recorde do Idol
  v_v := coalesce(p_c->>'hat', '');
  v_req := CASE v_v WHEN '' THEN 0 WHEN 'presilhas' THEN 150 WHEN 'fones' THEN 450 WHEN 'boina' THEN 1000
    WHEN 'bandaid' THEN 2800 WHEN 'coala' THEN 3900 WHEN 'capitao' THEN 15000 ELSE NULL END;
  IF v_req IS NULL THEN
    RETURN json_build_object('ok', false, 'erro', 'acessorio');
  END IF;
  IF v_v IS DISTINCT FROM coalesce(v_atual->>'hat', '') AND v_best < v_req THEN
    RETURN json_build_object('ok', false, 'erro', 'bloqueada', 'campo', 'hat', 'best_idol', v_best);
  END IF;
  v_o := v_o || jsonb_build_object('hat', v_v);

  -- roupa: mesma regra do admin_vestir
  v_v := lower(btrim(coalesce(p_c->>'out', '')));
  IF v_v NOT IN (
    '', 'seifuku', 'estrelado', 'y2k', 'zipper', 'sweet', 'citypop',
    'brasil', 'tailandia', 'indonesia', 'pijama', 'happi', 'gingham', 'hipster', 'rock', 'disco',
    'technopop', 'decora', 'alienfan', 'vampiro', 'rena', 'reveillon',
    'floral', 'coracao', 'outono', 'sakura', 'puffer', 'yukata',
    'cardiga', 'jardineira', 'festa48',
    'cr_fever', 'cr_ima', 'cr_mega', 'cr_alien', 'cr_center', 'cr_solo', 'cr_capitao', 'cr_ace', 'cr_kami'
  ) THEN
    RETURN json_build_object('ok', false, 'erro', 'roupa');
  END IF;
  IF v_v IS DISTINCT FROM coalesce(v_atual->>'out', '') THEN
    v_req := CASE v_v WHEN 'seifuku' THEN 450 WHEN 'estrelado' THEN 1000 WHEN 'y2k' THEN 1800
      WHEN 'zipper' THEN 2800 WHEN 'sweet' THEN 3900 WHEN 'citypop' THEN 5000
      WHEN 'cr_fever' THEN 450 WHEN 'cr_ima' THEN 1000 WHEN 'cr_mega' THEN 1800 WHEN 'cr_alien' THEN 2800
      WHEN 'cr_center' THEN 5000 WHEN 'cr_solo' THEN 10000 WHEN 'cr_capitao' THEN 15000 WHEN 'cr_ace' THEN 30000 WHEN 'cr_kami' THEN 50000
      ELSE NULL END;
    IF v_req IS NOT NULL AND v_best < v_req THEN
      RETURN json_build_object('ok', false, 'erro', 'bloqueada', 'campo', 'out', 'best_idol', v_best);
    ELSIF v_req IS NULL AND v_v <> ''
      AND NOT (('roupa_' || v_v) = ANY(coalesce(v_player.visuais, ARRAY[]::text[]))) THEN
      RETURN json_build_object('ok', false, 'erro', 'nao_comprada', 'campo', 'out');
    END IF;
  END IF;
  v_o := v_o || jsonb_build_object('out', v_v, 'img', v_o->>'hair');

  -- gravação (igual ao admin_vestir)
  v_visual := coalesce(v_player.nuvem_visual, '{}'::jsonb);
  IF jsonb_typeof(v_visual) IS DISTINCT FROM 'object' THEN v_visual := '{}'::jsonb; END IF;
  v_cu2 := coalesce(v_visual->'cu2', '{}'::jsonb);
  IF jsonb_typeof(v_cu2) IS DISTINCT FROM 'object' THEN v_cu2 := '{}'::jsonb; END IF;
  v_cu2 := v_cu2 || v_o;
  v_visual := jsonb_set(v_visual, '{cu2}', v_cu2, true);
  v_rev := greatest(coalesce(nullif(v_visual->>'admin_visual_rev', '')::bigint, 0), 0) + 1;
  v_visual := jsonb_set(v_visual, '{admin_visual_rev}', to_jsonb(v_rev), true);
  v_visual := jsonb_set(v_visual, '{admin_visual_override}', v_o, true);

  v_avatar := coalesce(v_player.avatar, '{}'::jsonb);
  IF jsonb_typeof(v_avatar) IS DISTINCT FROM 'object' THEN v_avatar := '{}'::jsonb; END IF;
  IF jsonb_typeof(v_avatar->'c') = 'object' THEN
    v_avatar := jsonb_set(v_avatar, '{c}', (v_avatar->'c') || v_o, true);
  ELSE
    v_avatar := jsonb_build_object('v', 1, 'c', v_cu2, 'a', coalesce(v_visual->>'acc', ''), 'visual', '',
      'pose', 'v', 'expr', 2, 'fundo', 'basico', 'auto', true);
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
  VALUES (auth.uid(), 'visual_montar', v_player.nick, left(v_o::text, 300),
    left(nullif(btrim(coalesce(p_motivo, '')), ''), 120));

  RETURN json_build_object('ok', true, 'nick', v_player.nick, 'c', v_o,
    'admin_visual_rev', v_rev, 'atualizar_jogo', true);
END;
$function$;
