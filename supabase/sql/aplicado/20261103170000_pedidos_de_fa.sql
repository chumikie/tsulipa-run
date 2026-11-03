-- APLICADO NO SUPABASE (produção) em 2026-11-03, PR #71.
-- Migration MCP: pr71_20261103170000_pedidos_de_fa
-- TsuLiPa⭐World — Pedidos de fã (2ª atualização, ideia "quests" do Neopets).
-- Versão aplicada após conferência de public.runs, star_log e private.kt_week_shows.
-- Todo dia (0h de Brasília) cada conta recebe 1 pedido de um fã, sorteado pela data + conta (igual para a pessoa o dia todo).
-- O progresso é conferido no servidor com o que já é gravado hoje; nada é informado pelo site.
-- Prêmio só simbólico: 1 "carta de fã" 💌 (contador no perfil). NÃO dá estrelas, não mexe em saldo, missões nem tetos (★100 Center, ★50 Pet).
-- CONFERIR ANTES: nomes public.runs(user_id, finished_at, score), public.star_log(user_id, delta, reason, created_at),
--                 private.kt_week_shows(player_id, week_start, shows, last_at) — shows aceitos do Karaoke (mesma fonte da times_semana).
BEGIN;

CREATE TABLE IF NOT EXISTS public.fa_pedidos (
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  dia date NOT NULL,
  tipo text NOT NULL,
  resgatado_em timestamptz,
  PRIMARY KEY (user_id, dia)
);
ALTER TABLE public.fa_pedidos ENABLE ROW LEVEL SECURITY;   -- só pelas funções
REVOKE ALL ON public.fa_pedidos FROM PUBLIC, anon, authenticated;

-- Tipos: [chave, meta]
--  corridas3   → terminar 3 corridas válidas no Center⭐Run! hoje
--  estrelas30  → ganhar 30 estrelas no Center⭐Run! hoje
--  pontos1500  → fazer 1500 pontos numa corrida hoje
--  karaoke1    → terminar 1 show aceito no Karaoke⭐Time! hoje
CREATE OR REPLACE FUNCTION private.fa_tipo_do_dia(p_user uuid, p_dia date) RETURNS text
LANGUAGE sql IMMUTABLE SET search_path TO '' AS $$
  SELECT (ARRAY['corridas3', 'estrelas30', 'pontos1500', 'karaoke1'])[1 + abs(hashtext(p_user::text || p_dia::text)) % 4];
$$;
REVOKE ALL ON FUNCTION private.fa_tipo_do_dia(uuid, date) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.fa_progresso(p_user uuid, p_dia date, p_tipo text) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $$
  SELECT CASE p_tipo
    WHEN 'corridas3' THEN (SELECT count(*)::int FROM public.runs r WHERE r.user_id = p_user AND r.score IS NOT NULL
                            AND (r.finished_at AT TIME ZONE 'America/Sao_Paulo')::date = p_dia)
    WHEN 'estrelas30' THEN (SELECT coalesce(sum(s.delta), 0)::int FROM public.star_log s WHERE s.user_id = p_user AND s.reason = 'corrida'
                            AND (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date = p_dia)
    WHEN 'pontos1500' THEN (SELECT coalesce(max(r.score), 0)::int FROM public.runs r WHERE r.user_id = p_user
                            AND (r.finished_at AT TIME ZONE 'America/Sao_Paulo')::date = p_dia)
    -- kt_week_shows guarda o total da semana e a hora do último show aceito: houve show hoje se last_at caiu hoje
    WHEN 'karaoke1' THEN (SELECT CASE WHEN EXISTS (SELECT 1 FROM private.kt_week_shows k WHERE k.player_id = p_user AND k.shows > 0
                            AND (k.last_at AT TIME ZONE 'America/Sao_Paulo')::date = p_dia) THEN 1 ELSE 0 END)
    ELSE 0 END;
$$;
REVOKE ALL ON FUNCTION private.fa_progresso(uuid, date, text) FROM PUBLIC, anon, authenticated;

-- Pedido de hoje + progresso + total de cartas de fã
CREATE OR REPLACE FUNCTION public.pedido_fa_hoje() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_dia date := (now() AT TIME ZONE 'America/Sao_Paulo')::date; v_tipo text; v_meta int; v_prog int; v_res timestamptz; v_cartas int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  v_tipo := private.fa_tipo_do_dia(auth.uid(), v_dia);
  v_meta := CASE v_tipo WHEN 'corridas3' THEN 3 WHEN 'estrelas30' THEN 30 WHEN 'pontos1500' THEN 1500 ELSE 1 END;
  v_prog := private.fa_progresso(auth.uid(), v_dia, v_tipo);
  SELECT resgatado_em INTO v_res FROM public.fa_pedidos WHERE user_id = auth.uid() AND dia = v_dia;
  SELECT count(*)::int INTO v_cartas FROM public.fa_pedidos WHERE user_id = auth.uid() AND resgatado_em IS NOT NULL;
  RETURN json_build_object('ok', true, 'dia', v_dia, 'tipo', v_tipo, 'meta', v_meta, 'progresso', least(v_prog, v_meta),
    'feito', v_prog >= v_meta, 'resgatado', v_res IS NOT NULL, 'cartas', v_cartas);
END $$;
REVOKE ALL ON FUNCTION public.pedido_fa_hoje() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.pedido_fa_hoje() TO authenticated;

-- Entregar o pedido de hoje (só se o servidor confirmar o progresso); dá 1 carta de fã
CREATE OR REPLACE FUNCTION public.entregar_pedido_fa() RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_dia date := (now() AT TIME ZONE 'America/Sao_Paulo')::date; v_tipo text; v_meta int;
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  v_tipo := private.fa_tipo_do_dia(auth.uid(), v_dia);
  v_meta := CASE v_tipo WHEN 'corridas3' THEN 3 WHEN 'estrelas30' THEN 30 WHEN 'pontos1500' THEN 1500 ELSE 1 END;
  IF private.fa_progresso(auth.uid(), v_dia, v_tipo) < v_meta THEN RETURN json_build_object('ok', false, 'erro', 'incompleto'); END IF;
  INSERT INTO public.fa_pedidos(user_id, dia, tipo, resgatado_em) VALUES (auth.uid(), v_dia, v_tipo, now())
    ON CONFLICT (user_id, dia) DO NOTHING;
  IF NOT FOUND THEN RETURN json_build_object('ok', false, 'erro', 'ja_entregue'); END IF;
  RETURN json_build_object('ok', true, 'cartas', (SELECT count(*) FROM public.fa_pedidos WHERE user_id = auth.uid() AND resgatado_em IS NOT NULL));
END $$;
REVOKE ALL ON FUNCTION public.entregar_pedido_fa() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.entregar_pedido_fa() TO authenticated;

COMMIT;
