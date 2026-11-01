-- SNAPSHOT DE REVERSÃO / REVIEW ONLY — 2026-11-01
-- Função ativa capturada via pg_get_functiondef em leitura.
-- NÃO EXECUTAR SEM AUTORIZAÇÃO ESPECÍFICA DE REVERSÃO.
-- Antes de qualquer aplicação real, obter novo snapshot e verificar divergências.
-- Não altera saldos/histórico diretamente; repõe o limite anterior de 1500 por dia.

CREATE OR REPLACE FUNCTION public.terminar_corrida(p_run uuid, p_score integer, p_stars integer, p_char text, p_device text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare r public.runs; p public.players; seg numeric; score_ok boolean; hoje date := (now() at time zone 'America/Sao_Paulo')::date;
        ganho_hoje integer; credito integer;
begin
  select * into p from public.players where id = auth.uid() for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  select * into r from public.runs where id = p_run and user_id = auth.uid() and finished_at is null for update;
  if not found or r.started_at < now() - interval '2 hours' then
    return json_build_object('ok', false, 'erro', 'corrida_invalida', 'stars', p.stars, 'best', p.best);
  end if;
  seg := greatest(extract(epoch from now() - r.started_at), 0);
  score_ok := coalesce(p_score, -1) between 0 and least(floor(seg * 60) + 1000, 300000);
  update public.runs set finished_at = now(), score = case when score_ok then p_score end, "char" = left(coalesce(p_char, ''), 12) where id = r.id;
  select coalesce(sum(delta), 0) into ganho_hoje from public.star_log
    where user_id = auth.uid() and reason = 'corrida' and (created_at at time zone 'America/Sao_Paulo')::date = hoje;
  credito := greatest(0, least(coalesce(p_stars, 0), floor(seg * 3)::integer + 5, 400, 1500 - ganho_hoje));
  if not score_ok then credito := 0; end if;
  update public.players set stars = stars + credito, best = case when score_ok then greatest(best, p_score) else best end, updated_at = now()
    where id = auth.uid() returning * into p;
  if credito > 0 then insert into public.star_log (user_id, delta, reason) values (auth.uid(), credito, 'corrida'); end if;
  if score_ok and p_score > 0 and not coalesce(p.bloqueado, false) then
    insert into public.leaderboard (name, score, stars, "char", device_id, user_id)
      values (p.nick, p_score, credito, left(coalesce(p_char, ''), 12),
              case when char_length(p_device) between 8 and 64 then p_device else null end, auth.uid());
  end if;
  return json_build_object('ok', score_ok, 'stars', p.stars, 'best', p.best, 'creditadas', credito);
end $function$
