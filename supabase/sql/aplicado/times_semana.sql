-- REGISTRO DE SQL JÁ APLICADO (não executar novamente automaticamente).
-- Projeto Supabase fsggtvgbyhchblyazgmt
-- Migration aplicada: 20261103152842_times_semana_brs48_accepted_shows
-- Fonte revisada: PR #71, supabase/sql/proposta/20261103160000_times_semana.sql
-- Este arquivo documenta o SQL realmente executado em 03/11/2026.
-- Registrar em supabase/sql/aplicado/ não cria migração pendente.

-- TsuLiPa⭐World — Meta semanal dos Teams BRS48 — SQL revisado em 03/11/2026.
-- Fonte: PR #71, proposta 20261103160000_times_semana.sql.
-- Somente leitura: sem estrelas, saldo, prêmios financeiros ou alteração de missão.
-- Semana: domingo 00h–sábado 23h59 (America/Sao_Paulo).
-- Pontos por Team: estrelas validadas do Center⭐Run! + 10 por show de Karaoke
-- aceito pelo servidor (private.kt_week_shows, não private.kt_runs, que inclui
-- tentativas inválidas/abandonadas e elimina registros após dois dias).
-- Membros ativos: união distinta dos que ganharam estrelas do Center e/ou
-- concluíram apresentações aceitas; meta 300 por ativo, mínimo 300.
-- Grupo BRS48 inclui perfis legados sem grupo atribuído (grupo NULL).
CREATE OR REPLACE FUNCTION public.times_semana()
RETURNS json
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
WITH lim AS (
  SELECT ((now() AT TIME ZONE 'America/Sao_Paulo')::date
          - extract(dow FROM (now() AT TIME ZONE 'America/Sao_Paulo')::date)::int) AS ini
), membros AS (
  SELECT p.id, p.time FROM public.players p
  WHERE p.time IN ('B', 'R', 'S', 'KKS')
    AND NOT coalesce(p.bloqueado, false)
    AND coalesce(p.grupo, 'BRS48') = 'BRS48'
), est AS (
  SELECT m.time, coalesce(sum(s.delta), 0)::int AS estrelas
  FROM membros m
  JOIN public.star_log s ON s.user_id = m.id AND s.reason = 'corrida'
  CROSS JOIN lim
  WHERE s.created_at >= (lim.ini::timestamp AT TIME ZONE 'America/Sao_Paulo')
    AND s.created_at < ((lim.ini + 7)::timestamp AT TIME ZONE 'America/Sao_Paulo')
  GROUP BY m.time
), sho AS (
  SELECT m.time, sum(w.shows)::int AS shows
  FROM membros m
  JOIN private.kt_week_shows w ON w.player_id = m.id
  CROSS JOIN lim
  WHERE w.week_start = lim.ini
  GROUP BY m.time
), participantes AS (
  SELECT m.id, m.time FROM membros m CROSS JOIN lim
  WHERE EXISTS (
    SELECT 1 FROM public.star_log s
    WHERE s.user_id = m.id AND s.reason = 'corrida' AND s.delta > 0
      AND s.created_at >= (lim.ini::timestamp AT TIME ZONE 'America/Sao_Paulo')
      AND s.created_at < ((lim.ini + 7)::timestamp AT TIME ZONE 'America/Sao_Paulo')
  ) OR EXISTS (
    SELECT 1 FROM private.kt_week_shows w
    WHERE w.player_id = m.id AND w.week_start = lim.ini AND w.shows > 0
  )
), ativos AS (
  SELECT time, count(*)::int AS ativos FROM participantes GROUP BY time
), tot AS (
  SELECT t.codigo,
    (SELECT count(*) FROM membros m WHERE m.time = t.codigo)::int AS membros,
    coalesce(e.estrelas, 0) AS estrelas,
    coalesce(s.shows, 0) AS shows,
    coalesce(a.ativos, 0) AS ativos
  FROM (VALUES ('B'), ('R'), ('S'), ('KKS')) t(codigo)
  LEFT JOIN est e ON e.time = t.codigo
  LEFT JOIN sho s ON s.time = t.codigo
  LEFT JOIN ativos a ON a.time = t.codigo
)
SELECT json_build_object(
  'semana', (SELECT ini FROM lim),
  'times', coalesce((SELECT json_agg(json_build_object(
    'codigo', codigo, 'membros', membros, 'ativos', ativos,
    'estrelas', estrelas, 'shows', shows,
    'pontos', estrelas + 10 * shows,
    'meta', 300 * greatest(ativos, 1)
  ) ORDER BY estrelas + 10 * shows DESC, codigo) FROM tot), '[]'::json)
);
$$;
REVOKE ALL ON FUNCTION public.times_semana() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.times_semana() TO anon, authenticated;
