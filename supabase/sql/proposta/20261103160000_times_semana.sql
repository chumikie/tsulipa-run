-- TsuLiPa⭐World — Meta semanal dos Teams do BRS48 (Idol⭐News!).
-- PROPOSTA (REVIEW ONLY). NÃO APLICAR SEM AUTORIZAÇÃO DA DONA. Quem aplica e confere é o responsável pelo banco (ChatGPT).
-- Decisões da dona (03/11/2026): Teams do BRS48 (B, R, S, KKS); a barra soma estrelas + shows; prêmio só enfeite (nada de estrelas).
-- Só leitura: não grava nada, não muda saldo, ranking nem limites.
-- Semana = domingo 0h a sábado (Brasília), igual aos outros rankings semanais.
-- Pontos do Team = estrelas ganhas no Center⭐Run! na semana (star_log, reason='corrida') + 10 por show do Karaoke⭐Time! terminado.
-- Meta da semana = 300 pontos por membro ativo do Team (mínimo 300). Ajustável aqui.
-- CONFERIR ANTES: se public.players já tem a coluna "grupo" (proposta 20261102140310); se não tiver, tirar o filtro de grupo.

CREATE OR REPLACE FUNCTION public.times_semana()
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public' AS $$
WITH lim AS (
  SELECT ((now() AT TIME ZONE 'America/Sao_Paulo')::date
          - extract(dow FROM (now() AT TIME ZONE 'America/Sao_Paulo')::date)::int) AS ini
), membros AS (
  SELECT p.id, p.time FROM public.players p
  WHERE p.time IN ('B', 'R', 'S', 'KKS') AND NOT coalesce(p.bloqueado, false)
    AND coalesce(p.grupo, 'BRS48') = 'BRS48'
), est AS (
  SELECT m.time, sum(s.delta)::int AS estrelas, count(DISTINCT s.user_id)::int AS ativos_e
  FROM membros m JOIN public.star_log s ON s.user_id = m.id AND s.reason = 'corrida'
  CROSS JOIN lim WHERE (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date >= lim.ini
  GROUP BY m.time
), sho AS (
  SELECT m.time, count(*)::int AS shows, count(DISTINCT k.player_id)::int AS ativos_s
  FROM membros m JOIN private.kt_runs k ON k.player_id = m.id AND k.finished_at IS NOT NULL
  CROSS JOIN lim WHERE k.dia >= lim.ini
  GROUP BY m.time
), tot AS (
  SELECT t.codigo,
    (SELECT count(*) FROM membros m WHERE m.time = t.codigo)::int AS membros,
    coalesce(e.estrelas, 0) AS estrelas, coalesce(s.shows, 0) AS shows,
    greatest(coalesce(e.ativos_e, 0), coalesce(s.ativos_s, 0)) AS ativos
  FROM (VALUES ('B'), ('R'), ('S'), ('KKS')) t(codigo)
  LEFT JOIN est e ON e.time = t.codigo LEFT JOIN sho s ON s.time = t.codigo
)
SELECT json_build_object(
  'semana', (SELECT ini FROM lim),
  'times', coalesce((SELECT json_agg(json_build_object(
      'codigo', codigo, 'membros', membros, 'ativos', ativos, 'estrelas', estrelas, 'shows', shows,
      'pontos', estrelas + 10 * shows, 'meta', 300 * greatest(ativos, 1)) ORDER BY estrelas + 10 * shows DESC, codigo) FROM tot), '[]'::json)
);
$$;
REVOKE ALL ON FUNCTION public.times_semana() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.times_semana() TO anon, authenticated;
-- Enfeite do prêmio: o site mostra 👑 no chip do Team que bateu a meta da semana (só visual, calculado por esta função).
