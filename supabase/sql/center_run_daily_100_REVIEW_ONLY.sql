-- TsuLiPa⭐World / Center⭐Run! — PROPOSTA DE MIGRAÇÃO (REVIEW ONLY)
-- NÃO APLICAR SEM APROVAÇÃO EXPLÍCITA DO RESPONSÁVEL PELO PROJETO.
-- Reflete a assinatura e o corpo ativos consultados em 2026-11-01.
-- Mantém o histórico, saldos, ranking, ACL da função e o teto independente do Pet.
-- ALTERAÇÃO FUNCIONAL: somente o teto diário de créditos de reason='corrida' muda de 1500 para 100.
-- O resultado limite_diario distingue corrida válida sem crédito por teto já atingido.
-- IMPORTANTE: o arquivo é proposta revisável, NÃO registra migração aplicada no Supabase.

create or replace function public.terminar_corrida(
  p_run uuid, p_score integer, p_stars integer, p_char text, p_device text
)
returns json
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  r public.runs;
  p public.players;
  seg numeric;
  score_ok boolean;
  hoje date := (now() at time zone 'America/Sao_Paulo')::date;
  ganho_hoje integer;
  credito integer;
  limite_diario boolean := false;
begin
  select * into p from public.players where id = auth.uid() for update;
  if not found then
    return json_build_object('ok', false, 'erro', 'sem_conta');
  end if;

  select * into r from public.runs
    where id = p_run and user_id = auth.uid() and finished_at is null for update;
  if not found or r.started_at < now() - interval '2 hours' then
    return json_build_object('ok', false, 'erro', 'corrida_invalida', 'stars', p.stars, 'best', p.best);
  end if;

  seg := greatest(extract(epoch from now() - r.started_at), 0);
  score_ok := coalesce(p_score, -1) between 0 and least(floor(seg * 60) + 1000, 300000);
  update public.runs set finished_at = now(),
    score = case when score_ok then p_score end,
    "char" = left(coalesce(p_char, ''), 12)
    where id = r.id;

  select coalesce(sum(delta), 0) into ganho_hoje
    from public.star_log
    where user_id = auth.uid()
      and reason = 'corrida'
      and (created_at at time zone 'America/Sao_Paulo')::date = hoje;

  credito := greatest(0, least(coalesce(p_stars, 0), floor(seg * 3)::integer + 5, 400, 100 - ganho_hoje));
  if not score_ok then credito := 0; end if;
  limite_diario := score_ok and coalesce(p_stars, 0) > 0 and ganho_hoje >= 100;

  update public.players set stars = stars + credito,
    best = case when score_ok then greatest(best, p_score) else best end,
    updated_at = now()
    where id = auth.uid() returning * into p;

  if credito > 0 then
    insert into public.star_log (user_id, delta, reason)
      values (auth.uid(), credito, 'corrida');
  end if;

  if score_ok and p_score > 0 and not coalesce(p.bloqueado, false) then
    insert into public.leaderboard (name, score, stars, "char", device_id, user_id)
      values (p.nick, p_score, credito, left(coalesce(p_char, ''), 12),
        case when char_length(p_device) between 8 and 64 then p_device else null end,
        auth.uid());
  end if;

  return json_build_object(
    'ok', score_ok,
    'stars', p.stars,
    'best', p.best,
    'creditadas', credito,
    'limite_diario', limite_diario
  );
end
$function$;

-- PRÉ-APLICAÇÃO: confirmar a função ativa e seu ACL; executar testes em ambiente isolado.
-- APÓS APLICAÇÃO AUTORIZADA: conferir pg_get_functiondef, proacl e RPC autenticada.
-- Não executar inserts de teste nem atualizar saldos em produção.
