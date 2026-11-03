-- TsuLiPa⭐World — Idol⭐News! / Registro de SQL APLICADO
-- Fonte revisada: supabase/sql/proposta/20261103150000_idol_news_posts.sql (main)
-- Projeto Supabase: fsggtvgbyhchblyazgmt
-- Aplicado e confirmado: 03/11/2026, migration 20261103151323_idol_news_posts.
-- Este arquivo registra o estado aplicado; não executar novamente automaticamente.
-- Tabela com RLS sem acesso direto; leitura RPC pública; escrita/exclusão RPC apenas para admin autenticado.

CREATE TABLE IF NOT EXISTS public.news_posts (
  id bigserial PRIMARY KEY,
  titulo text NOT NULL CHECK (char_length(titulo) BETWEEN 1 AND 80),
  legenda text NOT NULL DEFAULT '' CHECK (char_length(legenda) <= 600),
  imagem text NOT NULL DEFAULT '' CHECK (imagem = '' OR (imagem LIKE 'data:image/jpeg;base64,%' AND octet_length(imagem) <= 350000)),
  autor uuid NOT NULL DEFAULT auth.uid(),
  criado timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.news_posts ENABLE ROW LEVEL SECURITY;   -- sem policies: acesso só pelas funções abaixo
REVOKE ALL ON public.news_posts FROM PUBLIC, anon, authenticated;

-- Leitura pública: os 5 últimos posts (mais novo primeiro)
CREATE OR REPLACE FUNCTION public.news_posts()
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
  SELECT coalesce(json_agg(json_build_object('id', p.id, 'titulo', p.titulo, 'legenda', p.legenda, 'imagem', p.imagem, 'criado', p.criado) ORDER BY p.criado DESC), '[]'::json)
  FROM (SELECT * FROM public.news_posts ORDER BY criado DESC LIMIT 5) p;
$$;
REVOKE ALL ON FUNCTION public.news_posts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.news_posts() TO anon, authenticated;

-- Postar (só admin). Depois de inserir, apaga o que passar dos 5 mais recentes.
CREATE OR REPLACE FUNCTION public.admin_news_postar(p_titulo text, p_legenda text, p_imagem text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
DECLARE v_id bigint;
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN RETURN json_build_object('ok', false, 'erro', 'admin'); END IF;
  IF nullif(btrim(coalesce(p_titulo, '')), '') IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'titulo'); END IF;
  INSERT INTO public.news_posts (titulo, legenda, imagem)
    VALUES (left(btrim(p_titulo), 80), left(coalesce(p_legenda, ''), 600), coalesce(p_imagem, ''))
    RETURNING id INTO v_id;
  DELETE FROM public.news_posts WHERE id NOT IN (SELECT id FROM public.news_posts ORDER BY criado DESC LIMIT 5);
  INSERT INTO public.admin_log(admin, acao, alvo, valor, motivo) VALUES (auth.uid(), 'news_postar', v_id::text, left(p_titulo, 80), NULL);
  RETURN json_build_object('ok', true, 'id', v_id);
END $$;
REVOKE ALL ON FUNCTION public.admin_news_postar(text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_news_postar(text, text, text) TO authenticated;

-- Apagar um post (só admin)
CREATE OR REPLACE FUNCTION public.admin_news_apagar(p_id bigint)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT coalesce(public.eh_admin(), false) THEN RETURN json_build_object('ok', false, 'erro', 'admin'); END IF;
  DELETE FROM public.news_posts WHERE id = p_id;
  INSERT INTO public.admin_log(admin, acao, alvo, valor, motivo) VALUES (auth.uid(), 'news_apagar', p_id::text, NULL, NULL);
  RETURN json_build_object('ok', true);
END $$;
REVOKE ALL ON FUNCTION public.admin_news_apagar(bigint) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_news_apagar(bigint) TO authenticated;
