-- APLICADO no Supabase de produção em 14/11/2026 (OK do dono na conversa).
-- Missões do dia passam a incluir os jogos novos:
--   jardim (nível 1): regar ou plantar um canteiro hoje no Bloom⭐Garden!
--   battle (nível 1): fazer uma partida do dia no Idol⭐Battle!
--   foto   (nível 2): tirar a foto perfeita do dia (3 estrelas) no Photo⭐Studio!
-- Tudo é conferido em tabelas privadas que só as funções do servidor escrevem.
CREATE OR REPLACE FUNCTION public.missoes_lista()
RETURNS TABLE(k text,nivel integer,meta integer,premio integer,fam text)
LANGUAGE sql IMMUTABLE SET search_path TO '' AS $$
  SELECT * FROM (VALUES
   ('corra2',1,2,10,'corrida'),('coracao',1,1,10,'coracao'),('recado',1,1,10,'recado'),
   ('mini',1,1,10,'mini'),('pet',1,1,10,'pet'),
   ('handshake',1,1,10,'evento'),('cafe',1,1,10,'evento'),
   ('jardim',1,1,10,'jardim'),('battle',1,1,10,'battle'),
   ('corra3',2,3,15,'corrida'),('estrelas50',2,50,15,'estrela'),
   ('pontos2000',2,2000,15,'ponto'),('tsulipa',2,3,15,'tsulipa'),
   ('foto',2,1,15,'foto'),
   ('corra5',3,5,20,'corrida'),('pontos5000',3,5000,20,'ponto'),
   ('estrelas100',3,100,20,'estrela')
  ) AS v(k,nivel,meta,premio,fam)
$$;

CREATE OR REPLACE FUNCTION public.missoes_progresso(p_id uuid,p_k text,p_dia date)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $$
  WITH l AS (
    SELECT * FROM public.leaderboard WHERE user_id=p_id
      AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date=p_dia
  )
  SELECT (CASE
    WHEN p_k LIKE 'corra%' THEN (SELECT count(*) FROM l)
    WHEN p_k LIKE 'estrelas%' THEN (SELECT coalesce(sum(stars),0) FROM l)
    WHEN p_k LIKE 'pontos%' THEN (SELECT coalesce(max(score),0) FROM l)
    WHEN p_k='tsulipa' THEN (SELECT count(DISTINCT "char") FROM l WHERE "char" IN('Tsu','Lirika','Pati'))
    WHEN p_k='coracao' THEN (SELECT count(*) FROM public.coracoes WHERE de=p_id AND dia=p_dia)
    WHEN p_k='recado' THEN (SELECT count(*) FROM public.recados WHERE de=p_id AND dia=p_dia)
    WHEN p_k='mini' THEN (SELECT count(*) FROM public.star_log WHERE user_id=p_id AND reason='minijogo'
      AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date=p_dia)
    WHEN p_k='pet' THEN (SELECT count(*) FROM public.star_log WHERE user_id=p_id AND reason='camarim' AND delta<0
      AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date=p_dia)
    WHEN p_k='collect' THEN (SELECT count(*) FROM public.visitas WHERE user_id=p_id AND dia=p_dia AND k='collect')
    WHEN p_k='duo' THEN (SELECT count(*) FROM public.duo_log WHERE de=p_id AND dia=p_dia)
    WHEN p_k='handshake' THEN (SELECT count(*) FROM private.handshake_resultados
       WHERE user_id=p_id AND dia=p_dia AND acertos>=1)
    WHEN p_k='cafe' THEN (SELECT count(*) FROM private.cafe_resultados WHERE user_id=p_id AND dia=p_dia)
    WHEN p_k='jardim' THEN (SELECT count(*) FROM private.jardim_canteiros WHERE user_id=p_id
       AND (ultima_rega=p_dia OR (plantado AT TIME ZONE 'America/Sao_Paulo')::date=p_dia))
    WHEN p_k='battle' THEN (SELECT count(*) FROM private.battle_partidas WHERE player_id=p_id AND dia=p_dia)
    WHEN p_k='foto' THEN (SELECT count(*) FROM private.bonus_jogo_dia WHERE user_id=p_id AND jogo='foto' AND dia=p_dia)
    ELSE 0 END)::integer
$$;
