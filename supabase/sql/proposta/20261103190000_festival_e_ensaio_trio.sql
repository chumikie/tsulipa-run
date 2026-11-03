-- TsuLiPa⭐World — Festival de Unidades + Ensaio de trio (2ª atualização, atividades em grupo sem estar online junto).
-- PROPOSTA (REVIEW ONLY). NÃO APLICAR SEM AUTORIZAÇÃO DA DONA. Quem aplica e confere é o responsável pelo banco (ChatGPT).
-- Tudo só leitura: não grava nada, não dá estrelas, não muda ranking, saldo nem limites. O Karaoke⭐Time! continua solo.
-- Semana = domingo 0h a sábado (Brasília), a mesma de private.kt_scores.week_start.

-- 1) Festival de Unidades: soma da MELHOR nota solo da semana (private.kt_scores.score, que já conta só a música da semana)
--    de cada membro dos Teams do BRS48. Mostra também quantos cantaram e quem foi o destaque de cada Team.
CREATE OR REPLACE FUNCTION public.festival_unidades()
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $$
WITH lim AS (
  SELECT ((now() AT TIME ZONE 'America/Sao_Paulo')::date
          - extract(dow FROM (now() AT TIME ZONE 'America/Sao_Paulo')::date)::int) AS ini
), notas AS (
  SELECT p.time, p.nick, s.score
  FROM private.kt_scores s JOIN public.players p ON p.id = s.player_id CROSS JOIN lim
  WHERE s.week_start = lim.ini AND s.score > 0
    AND p.time IN ('B', 'R', 'S', 'KKS') AND NOT coalesce(p.bloqueado, false)
)
SELECT json_build_object('semana', (SELECT ini FROM lim), 'times', coalesce((
  SELECT json_agg(x ORDER BY (x->>'total')::int DESC, x->>'codigo') FROM (
    SELECT json_build_object('codigo', t.codigo,
      'total', coalesce((SELECT sum(n.score) FROM notas n WHERE n.time = t.codigo), 0),
      'cantaram', (SELECT count(*) FROM notas n WHERE n.time = t.codigo),
      'destaque', (SELECT n.nick FROM notas n WHERE n.time = t.codigo ORDER BY n.score DESC, n.nick LIMIT 1),
      'destaque_nota', (SELECT max(n.score) FROM notas n WHERE n.time = t.codigo)) AS x
    FROM (VALUES ('B'), ('R'), ('S'), ('KKS')) t(codigo)) q), '[]'::json));
$$;
REVOKE ALL ON FUNCTION public.festival_unidades() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.festival_unidades() TO anon, authenticated;

-- 2) Ensaio de trio: toda sexta (0h de Brasília) os jogadores que jogaram na semana viram trios, sorteados pela semana.
--    Cada um faz a sua parte até domingo 0h: terminar 1 corrida válida no Center⭐Run! OU 1 show aceito no Karaoke⭐Time!
--    de sexta em diante. Quando os 3 fazem, o trio libera a cena especial (só visual, no site).
--    Quem fica sobrando (menos de 3) entra num trio com Tsu/Lirika/Patiliri do site, se precisar completar.
--    Fontes: public.runs(user_id, finished_at, score) e private.kt_week_shows(player_id, week_start, shows, last_at).
CREATE OR REPLACE FUNCTION public.meu_trio_semana()
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO '' AS $$
DECLARE
  v_hoje date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
  v_ini date := v_hoje - extract(dow FROM v_hoje)::int;      -- domingo
  v_sexta date := v_ini + 5;
  v_eu uuid := auth.uid(); v_pos int; v_trio uuid[]; v_lista uuid[];
BEGIN
  IF v_eu IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  IF v_hoje < v_sexta THEN RETURN json_build_object('ok', true, 'aberto', false, 'abre', v_sexta); END IF;
  -- quem jogou na semana até quinta, em ordem sorteada pela semana
  SELECT array_agg(id ORDER BY md5(id::text || v_ini::text)) INTO v_lista FROM (
    SELECT DISTINCT r.user_id AS id FROM public.runs r
      WHERE r.score IS NOT NULL AND (r.finished_at AT TIME ZONE 'America/Sao_Paulo')::date BETWEEN v_ini AND v_sexta - 1
    UNION
    SELECT k.player_id FROM private.kt_week_shows k WHERE k.week_start = v_ini AND k.shows > 0
  ) a JOIN public.players p ON p.id = a.id WHERE NOT coalesce(p.bloqueado, false);
  v_pos := array_position(v_lista, v_eu);
  IF v_pos IS NULL THEN RETURN json_build_object('ok', true, 'aberto', true, 'fora', true); END IF;
  v_pos := ((v_pos - 1) / 3) * 3 + 1;
  v_trio := v_lista[v_pos:v_pos + 2];
  IF array_length(v_trio, 1) < 3 AND array_length(v_lista, 1) >= 3 THEN v_trio := v_lista[array_length(v_lista, 1) - 2:array_length(v_lista, 1)]; END IF;
  RETURN json_build_object('ok', true, 'aberto', true, 'semana', v_ini, 'ate', v_ini + 7,
    'membros', (SELECT json_agg(json_build_object('nick', p.nick, 'avatar', p.avatar, 'eu', p.id = v_eu,
        'feito', EXISTS (SELECT 1 FROM public.runs r WHERE r.user_id = p.id AND r.score IS NOT NULL
                           AND (r.finished_at AT TIME ZONE 'America/Sao_Paulo')::date >= v_sexta)
              OR EXISTS (SELECT 1 FROM private.kt_week_shows k WHERE k.player_id = p.id AND k.week_start = v_ini AND k.shows > 0
                           AND (k.last_at AT TIME ZONE 'America/Sao_Paulo')::date >= v_sexta))
      ORDER BY array_position(v_trio, p.id)) FROM public.players p WHERE p.id = ANY (v_trio)));
END $$;
REVOKE ALL ON FUNCTION public.meu_trio_semana() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.meu_trio_semana() TO authenticated;
