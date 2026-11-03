-- APLICADO NO SUPABASE (produção) em 2026-11-03, PR #71.
-- Migration MCP: pr71_20261103180000_troca_de_cards
-- TsuLiPa⭐World — Troca de cards entre jogadores (Star⭐Gacha!, ideia "Trading Post" do Neopets).
-- Versão aplicada após conferência de tabelas, funções e travas por pessoa.
-- Decisões (03/11/2026): troca com qualquer pessoa do site; 1 card por 1 card; os dois lados aceitam.
-- Regras:
--   * Só se oferece card REPETIDO (vezes >= 2), para ninguém perder o espaço no álbum.
--   * Quem recebe a proposta também precisa ter o card pedido repetido (>= 2) na hora de aceitar.
--   * No máximo 3 propostas pendentes enviadas por pessoa; propostas vencem em 3 dias.
--   * Não toca em public.gacha (histórico de giros e limite diário) nem em estrelas: as trocas ficam em
--     public.card_movimentos (+1 / -1) e o álbum soma giros + presentes + movimentos.
-- Segurança: funções SECURITY DEFINER com search_path vazio; tabelas com RLS e sem acesso direto; trava por pessoa
-- ao propor e ao aceitar; contas bloqueadas não trocam; o servidor reconfere as cópias na hora de aceitar.
-- Depende de public.album_cards() (proposta album_cards_REVIEW_ONLY.sql): este arquivo a substitui
-- pela versão que soma os movimentos. Conferir antes: public.gacha_card(nick), public.aniver_presentes(user_id, em).
BEGIN;

CREATE TABLE IF NOT EXISTS public.card_movimentos (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  chave text NOT NULL,              -- lower(btrim(nick)) do Idol do card
  delta smallint NOT NULL CHECK (delta IN (-1, 1)),
  troca_id bigint,
  quando timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS card_movimentos_user ON public.card_movimentos(user_id, chave);

CREATE TABLE IF NOT EXISTS public.card_trocas (
  id bigserial PRIMARY KEY,
  de uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  para uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  dou text NOT NULL,                 -- chave do card que quem propõe entrega
  quero text NOT NULL,               -- chave do card que quem propõe recebe
  status text NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceita', 'recusada', 'cancelada', 'vencida')),
  criado timestamptz NOT NULL DEFAULT now(),
  resolvido timestamptz,
  CHECK (de <> para)
);
CREATE INDEX IF NOT EXISTS card_trocas_para ON public.card_trocas(para, status);
CREATE INDEX IF NOT EXISTS card_trocas_de ON public.card_trocas(de, status);
ALTER TABLE public.card_movimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_trocas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.card_movimentos, public.card_trocas FROM PUBLIC, anon, authenticated;

-- Quantas cópias de um card a pessoa tem (giros + presentes + trocas)
CREATE OR REPLACE FUNCTION private.cards_qtd(p_user uuid, p_chave text) RETURNS integer
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $$
  SELECT (SELECT count(*) FROM public.gacha g WHERE g.user_id = p_user AND g.tipo = 'card' AND lower(btrim(g.valor)) = p_chave)::int
       + (SELECT count(*) FROM public.aniver_presentes a JOIN public.players p ON p.id = a.user_id WHERE a.user_id = p_user AND lower(btrim(p.nick)) = p_chave)::int
       + coalesce((SELECT sum(m.delta) FROM public.card_movimentos m WHERE m.user_id = p_user AND m.chave = p_chave), 0)::int;
$$;
REVOKE ALL ON FUNCTION private.cards_qtd(uuid, text) FROM PUBLIC, anon, authenticated;

-- Álbum somando as trocas (substitui a proposta anterior; mesmo formato)
CREATE OR REPLACE FUNCTION public.album_cards() RETURNS json
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $function$
  WITH aq AS (
    SELECT lower(btrim(g.valor)) AS chave, 'card'::text AS tipo, g.created_at AS quando, 1 AS d
      FROM public.gacha g WHERE g.user_id = (SELECT auth.uid()) AND g.tipo = 'card' AND nullif(btrim(g.valor), '') IS NOT NULL
    UNION ALL
    SELECT lower(btrim(p.nick)), 'aniver', a.em, 1
      FROM public.aniver_presentes a JOIN public.players p ON p.id = a.user_id WHERE a.user_id = (SELECT auth.uid())
    UNION ALL
    SELECT m.chave, 'card', m.quando, m.delta FROM public.card_movimentos m WHERE m.user_id = (SELECT auth.uid())
  ), soma AS (
    SELECT chave, sum(d)::int AS vezes, min(quando) FILTER (WHERE d > 0) AS primeira,
           (array_agg(tipo ORDER BY quando DESC) FILTER (WHERE d > 0))[1] AS tipo, max(quando) FILTER (WHERE d > 0) AS ultimo
    FROM aq GROUP BY chave
  )
  SELECT coalesce(json_agg(json_build_object('card', public.gacha_card(p.nick), 'tipo', s.tipo, 'dia', s.ultimo::date,
           'vezes', s.vezes, 'primeira', s.primeira) ORDER BY s.ultimo DESC, p.nick), '[]'::json)
  FROM soma s JOIN public.players p ON lower(btrim(p.nick)) = s.chave
  WHERE s.vezes > 0 AND (SELECT auth.uid()) IS NOT NULL;
$function$;
REVOKE ALL ON FUNCTION public.album_cards() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.album_cards() TO authenticated;

-- Propor: dou um card repetido meu, quero um card da outra pessoa
CREATE OR REPLACE FUNCTION public.propor_troca(p_para text, p_dou text, p_quero text) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_para uuid; v_dou text := lower(btrim(coalesce(p_dou, ''))); v_quero text := lower(btrim(coalesce(p_quero, ''))); v_id bigint;
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  SELECT id INTO v_para FROM public.players WHERE lower(btrim(nick)) = lower(btrim(coalesce(p_para, ''))) AND NOT coalesce(bloqueado, false);
  IF v_para IS NULL OR v_para = auth.uid() THEN RETURN json_build_object('ok', false, 'erro', 'pessoa'); END IF;
  IF v_dou = '' OR v_quero = '' OR v_dou = v_quero THEN RETURN json_build_object('ok', false, 'erro', 'cards'); END IF;
  IF NOT EXISTS (SELECT 1 FROM public.players p WHERE lower(btrim(p.nick)) = v_quero) THEN RETURN json_build_object('ok', false, 'erro', 'cards'); END IF;
  IF EXISTS (SELECT 1 FROM public.players p WHERE p.id = auth.uid() AND coalesce(p.bloqueado, false)) THEN RETURN json_build_object('ok', false, 'erro', 'pessoa'); END IF;
  PERFORM pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(auth.uid()::text));
  IF private.cards_qtd(auth.uid(), v_dou) < 2 THEN RETURN json_build_object('ok', false, 'erro', 'sem_repetido'); END IF;
  -- não deixa a mesma pessoa receber uma enxurrada: no máximo 10 propostas pendentes esperando por ela
  IF (SELECT count(*) FROM public.card_trocas WHERE para = v_para AND status = 'pendente' AND criado >= now() - interval '3 days') >= 10 THEN RETURN json_build_object('ok', false, 'erro', 'limite'); END IF;
  UPDATE public.card_trocas SET status = 'vencida', resolvido = now() WHERE status = 'pendente' AND criado < now() - interval '3 days';
  IF (SELECT count(*) FROM public.card_trocas WHERE de = auth.uid() AND status = 'pendente') >= 3 THEN RETURN json_build_object('ok', false, 'erro', 'limite'); END IF;
  INSERT INTO public.card_trocas(de, para, dou, quero) VALUES (auth.uid(), v_para, v_dou, v_quero) RETURNING id INTO v_id;
  RETURN json_build_object('ok', true, 'id', v_id);
END $$;

-- Responder (só quem recebeu). Aceitar troca os cards na hora, conferindo de novo os dois lados.
CREATE OR REPLACE FUNCTION public.responder_troca(p_id bigint, p_aceitar boolean) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE t public.card_trocas; v_a uuid; v_b uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  SELECT * INTO t FROM public.card_trocas WHERE id = p_id AND para = auth.uid() AND status = 'pendente' FOR UPDATE;
  IF NOT FOUND THEN RETURN json_build_object('ok', false, 'erro', 'troca'); END IF;
  IF t.criado < now() - interval '3 days' THEN UPDATE public.card_trocas SET status = 'vencida', resolvido = now() WHERE id = t.id; RETURN json_build_object('ok', false, 'erro', 'vencida'); END IF;
  IF NOT coalesce(p_aceitar, false) THEN UPDATE public.card_trocas SET status = 'recusada', resolvido = now() WHERE id = t.id; RETURN json_build_object('ok', true, 'status', 'recusada'); END IF;
  -- Trava POR PESSOA (sempre na mesma ordem, sem deadlock): duas trocas aceitas ao mesmo tempo com a mesma
  -- pessoa não conseguem gastar o mesmo card repetido duas vezes.
  v_a := least(t.de, t.para); v_b := greatest(t.de, t.para);
  PERFORM pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_a::text));
  PERFORM pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_b::text));
  IF EXISTS (SELECT 1 FROM public.players p WHERE p.id IN (t.de, t.para) AND coalesce(p.bloqueado, false)) THEN
    UPDATE public.card_trocas SET status = 'cancelada', resolvido = now() WHERE id = t.id; RETURN json_build_object('ok', false, 'erro', 'troca');
  END IF;
  IF private.cards_qtd(t.de, t.dou) < 2 THEN RETURN json_build_object('ok', false, 'erro', 'sem_repetido_outro'); END IF;
  IF private.cards_qtd(t.para, t.quero) < 2 THEN RETURN json_build_object('ok', false, 'erro', 'sem_repetido'); END IF;
  INSERT INTO public.card_movimentos(user_id, chave, delta, troca_id) VALUES
    (t.de, t.dou, -1, t.id), (t.para, t.dou, 1, t.id), (t.para, t.quero, -1, t.id), (t.de, t.quero, 1, t.id);
  UPDATE public.card_trocas SET status = 'aceita', resolvido = now() WHERE id = t.id;
  RETURN json_build_object('ok', true, 'status', 'aceita');
END $$;

-- Cancelar (só quem propôs, enquanto pendente)
CREATE OR REPLACE FUNCTION public.cancelar_troca(p_id bigint) RETURNS json
LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  UPDATE public.card_trocas SET status = 'cancelada', resolvido = now() WHERE id = p_id AND de = auth.uid() AND status = 'pendente';
  RETURN json_build_object('ok', FOUND);
END $$;

-- Minhas trocas: recebidas e enviadas pendentes + 5 últimas resolvidas
CREATE OR REPLACE FUNCTION public.minhas_trocas() RETURNS json
LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $$
  SELECT coalesce(json_agg(json_build_object('id', t.id, 'eu_propus', t.de = auth.uid(),
      'outro', CASE WHEN t.de = auth.uid() THEN pp.nick ELSE pd.nick END,
      'dou', t.dou, 'quero', t.quero, 'status', t.status, 'criado', t.criado) ORDER BY t.criado DESC), '[]'::json)
  FROM (SELECT * FROM public.card_trocas WHERE (de = auth.uid() OR para = auth.uid())
          AND (status = 'pendente' AND criado >= now() - interval '3 days' OR resolvido >= now() - interval '7 days')
        ORDER BY criado DESC LIMIT 20) t
  JOIN public.players pd ON pd.id = t.de JOIN public.players pp ON pp.id = t.para
  WHERE auth.uid() IS NOT NULL;
$$;

REVOKE ALL ON FUNCTION public.propor_troca(text, text, text), public.responder_troca(bigint, boolean), public.cancelar_troca(bigint), public.minhas_trocas() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.propor_troca(text, text, text), public.responder_troca(bigint, boolean), public.cancelar_troca(bigint), public.minhas_trocas() TO authenticated;

COMMIT;
