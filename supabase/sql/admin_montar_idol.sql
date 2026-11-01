-- TsuLiPa⭐World — Moderação: montar o Idol de um membro (visual completo)
-- PROPOSTA PARA REVISÃO (PR #58). NÃO APLICAR SEM AUTORIZAÇÃO EXPLÍCITA DA DONA DO PROJETO.
-- Quem aplica e confere no Supabase é o responsável pelo banco (ChatGPT), não o GitHub.
--
-- Pedido da dona (01/11/2026): a admin (Tsu) monta o Idol de qualquer membro (menos o próprio e de outros admins),
-- principalmente de quem nunca montou o avatar. Pode mudar cabelo, corte, franja, mecha, detalhe, olhos, pele,
-- roupa e cor, acessório e óculos. Roupas, acessórios e o detalhe "coelho" só podem ser os já liberados/comprados
-- pelo membro (mesma regra do admin_vestir), ou o que ele já está usando. O item (mão) não muda aqui.
--
-- Reaproveita o mecanismo do admin_vestir (aplicado em 31/10/2026 pela PR #49): grava em nuvem_visual.cu2 e em
-- avatar.c, sobe admin_visual_rev (os saves antigos do membro não desfazem a correção) e registra no admin_log.
-- Não muda estrelas, compras, coleção, ranking nem pets.
BEGIN;

CREATE OR REPLACE FUNCTION public.admin_idol_info(p_nick text)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
  v_player public.players%ROWTYPE;
  v_best integer := 0;
  v_c jsonb;
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;
  SELECT * INTO v_player FROM public.players p WHERE lower(p.nick) = lower(btrim(coalesce(p_nick, '')));
  IF NOT FOUND THEN
    RETURN json_build_object('ok', false, 'erro', 'perfil');
  END IF;
  IF v_player.id = auth.uid() OR EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = v_player.id) THEN
    RETURN json_build_object('ok', false, 'erro', 'admin');
  END IF;
  SELECT coalesce(max(l.score), 0)::integer INTO v_best
    FROM public.leaderboard l WHERE l.user_id = v_player.id AND l."char" = 'Idol';
  v_c := CASE WHEN jsonb_typeof(v_player.avatar->'c') = 'object' THEN v_player.avatar->'c' ELSE '{}'::jsonb END;
  IF jsonb_typeof(v_player.nuvem_visual->'cu2') = 'object' THEN
    v_c := v_c || (v_player.nuvem_visual->'cu2');
  END IF;
  RETURN json_build_object(
    'ok', true,
    'nick', v_player.nick,
    'c', v_c,
    'auto', coalesce((v_player.avatar->>'auto')::boolean, false),
    'best_idol', v_best,
    'visuais', to_json(coalesce(v_player.visuais, ARRAY[]::text[]))
  );
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_idol_info(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_idol_info(text) TO authenticated;


CREATE OR REPLACE FUNCTION public.admin_montar_idol(
  p_nick text,
  p_c jsonb,
  p_motivo text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
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
  IF v_v NOT IN ('', 'uma', 'dupla', 'luzes', 'escondida') THEN
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
    'brasil', 'pijama', 'happi', 'gingham', 'hipster', 'rock', 'disco',
    'technopop', 'decora', 'alienfan', 'vampiro', 'rena', 'reveillon',
    'floral', 'coracao', 'outono', 'sakura', 'puffer', 'yukata',
    'cardiga', 'jardineira', 'festa48'
  ) THEN
    RETURN json_build_object('ok', false, 'erro', 'roupa');
  END IF;
  IF v_v IS DISTINCT FROM coalesce(v_atual->>'out', '') THEN
    v_req := CASE v_v WHEN 'seifuku' THEN 450 WHEN 'estrelado' THEN 1000 WHEN 'y2k' THEN 1800
      WHEN 'zipper' THEN 2800 WHEN 'sweet' THEN 3900 WHEN 'citypop' THEN 5000 ELSE NULL END;
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

REVOKE ALL ON FUNCTION public.admin_montar_idol(text, jsonb, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_montar_idol(text, jsonb, text) TO authenticated;

COMMIT;
