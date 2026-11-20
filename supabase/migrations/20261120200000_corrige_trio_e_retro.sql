-- 20/11/2026 · Correções encontradas nos logs da Supabase
-- 1) meu_trio_semana: "column reference id is ambiguous" — o Ensaio de trio dava erro 400 toda sexta e sábado
--    (quando abre). Só qualifica a coluna (a.id); a regra continua igual.
-- 2) retrospectiva: a contagem de corridas do mês vinha só do leaderboard, que a limpeza semanal reduz a ~14 dias.
--    Agora usa também o extrato de estrelas (120 dias) e fica com o maior dos dois.

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
  SELECT array_agg(a.id ORDER BY md5(a.id::text || v_ini::text)) INTO v_lista FROM (
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

create or replace function private.retro_de(v_uid uuid, p_mes date default null)
 returns json
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare
  v_hoje date := public.hoje_br();
  v_ini date := date_trunc('month', coalesce(p_mes, (date_trunc('month', public.hoje_br()) - interval '1 day')::date))::date;
  v_fim date;
  r json;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  -- só meses que já acabaram (o atual vale como "até agora") e no máximo um ano para trás
  if v_ini > date_trunc('month', v_hoje)::date or v_ini < (date_trunc('month', v_hoje) - interval '12 months')::date then
    return json_build_object('ok', false, 'erro', 'mes');
  end if;
  v_fim := least((v_ini + interval '1 month' - interval '1 day')::date, v_hoje);
  select json_build_object(
    'ok', true, 'mes', v_ini, 'ate', v_fim,
    'nick', (select nick from public.players where id = v_uid),
    'dias', (select count(distinct d) from (
        select (created_at at time zone 'America/Sao_Paulo')::date d from public.star_log where user_id = v_uid
        union select (created_at at time zone 'America/Sao_Paulo')::date from public.leaderboard where user_id = v_uid
        union select dia from private.kt_runs where player_id = v_uid and finished_at is not null
        union select (finished_at at time zone 'America/Sao_Paulo')::date from private.sora_history where player_id = v_uid
        union select dia from public.duo_log where de = v_uid) x where d between v_ini and v_fim),
    -- a limpeza semanal guarda só ~14 dias de corridas no leaderboard; o extrato (star_log) fica 120 dias
    'corridas', greatest(
      (select count(*) from public.leaderboard where user_id = v_uid and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
      (select count(*) from public.star_log where user_id = v_uid and reason = 'corrida' and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim)),
    'melhor', (select coalesce(max(score), 0) from public.leaderboard where user_id = v_uid and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'musicas', (select count(*) from private.kt_runs where player_id = v_uid and finished_at is not null and dia between v_ini and v_fim),
    'sora', (select coalesce(max(score), 0) from private.sora_history where player_id = v_uid and (finished_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'estrelas', (select coalesce(sum(delta), 0) from public.star_log where user_id = v_uid and delta > 0 and (created_at at time zone 'America/Sao_Paulo')::date between v_ini and v_fim),
    'cards', (select count(*) from public.gacha where user_id = v_uid and tipo = 'card' and dia between v_ini and v_fim),
    'fotos', (select count(*) from private.studio_mural where user_id = v_uid and dia between v_ini and v_fim),
    'duo', (select count(*) from public.duo_log where de = v_uid and dia between v_ini and v_fim),
    'battles', (select count(*) from private.battle_partidas where player_id = v_uid and dia between v_ini and v_fim),
    'idol', (select n from (select jsonb_array_elements_text(unit) n from private.battle_partidas
                             where player_id = v_uid and dia between v_ini and v_fim and jsonb_typeof(unit) = 'array') u
             group by n order by count(*) desc, n limit 1),
    'show', (select count(*) from private.show_sabado where user_id = v_uid and sabado between v_ini and v_fim)
  ) into r;
  return r;
end $function$;
revoke all on function private.retro_de(uuid, date) from public, anon, authenticated;
