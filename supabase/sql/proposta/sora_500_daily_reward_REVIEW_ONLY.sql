-- TsuLiPa⭐World / Sora⭐Jump! — REVISÃO SOMENTE, NÃO APLICAR AUTOMATICAMENTE.
-- Prêmio oficial: ★25 ao finalizar uma partida online válida com >=500 m,
-- apenas uma vez por conta Google e dia (America/Sao_Paulo).
-- Proposta SQL; NÃO mover para supabase/migrations/ antes de aprovação separada.
--
-- Segurança:
--   * Usa exclusivamente auth.uid() e o UUID de partida já persistido em private.sora_runs.
--   * Mantém a validação de duração, distância plausível, bloqueio e consumo de UUID.
--   * Exige ao menos 10 s de partida para a recompensa; não afeta o ranking existente.
--   * PK (player_id,reward_day) + transação única impedem dupla recompensa
--     (replay, concorrência, aba duplicada e troca de dia).
--   * private não é exposto no Data API; RLS ligado e permissões revogadas.
--   * Atualização de players.stars e star_log são atômicas.
--   * A altitude vem do navegador; limites temporais dificultam fraudes simples,
--     mas NÃO substituem replay/simulação autoritativa da física (risco residual).
--
-- Não mexe em Center⭐Run!, Pet, Karaoke, recompensas antigas ou missões_feitas.

begin;

create table private.sora_daily_500_rewards (
  player_id uuid not null references public.players(id) on delete cascade,
  reward_day date not null,
  run_id uuid not null unique,
  rewarded_at timestamptz not null default clock_timestamp(),
  primary key (player_id, reward_day)
);

alter table private.sora_daily_500_rewards enable row level security;
revoke all on table private.sora_daily_500_rewards from public, anon, authenticated;

CREATE OR REPLACE FUNCTION public.sora_run_finish(p_run_id uuid, p_score integer)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_uid uuid := auth.uid();
  v_started timestamptz;
  v_now timestamptz := clock_timestamp();
  v_elapsed numeric;
  v_today date := (v_now at time zone 'America/Sao_Paulo')::date;
  v_credit integer := 0;
  v_already boolean := false;
  v_sunday date := (
    (clock_timestamp() at time zone 'America/Sao_Paulo')::date
    - extract(dow from (clock_timestamp() at time zone 'America/Sao_Paulo')::date)::integer
  );
begin
  if v_uid is null
     or coalesce(auth.jwt()->'app_metadata'->>'provider','') <> 'google'
     or coalesce(auth.jwt()->>'is_anonymous','false') = 'true' then
    raise exception 'sora_google_login_required' using errcode = '42501';
  end if;
  if p_run_id is null then
    raise exception 'sora_run_id_required' using errcode = '22023';
  end if;
  select r.started_at into v_started from private.sora_runs r
   where r.id=p_run_id and r.player_id=v_uid for update;
  if not found then
    raise exception 'sora_run_not_found_or_finished' using errcode = '55000';
  end if;
  v_elapsed := extract(epoch from (v_now-v_started));
  if p_score is null or p_score < 0 or p_score > 2000000
     or v_elapsed < 1 or v_elapsed > 2700
     or p_score > floor(v_elapsed*85)+100
     or not exists (select 1 from public.players p where p.id=v_uid and not coalesce(p.bloqueado,false)) then
    delete from private.sora_runs where id=p_run_id and player_id=v_uid;
    return jsonb_build_object('ok',false,'reason','run_or_score_invalid');
  end if;
  delete from private.sora_runs where id=p_run_id and player_id=v_uid;
  if p_score > 0 then
    insert into private.sora_scores(player_id,period_type,week_start,score,achieved_at)
    values(v_uid,'all',null,p_score,v_now)
    on conflict (player_id) where period_type='all'
    do update set score=excluded.score,achieved_at=excluded.achieved_at
    where private.sora_scores.score < excluded.score;
    delete from private.sora_scores where period_type='week' and week_start < v_sunday;
    insert into private.sora_scores(player_id,period_type,week_start,score,achieved_at)
    values(v_uid,'week',v_sunday,p_score,v_now)
    on conflict (player_id,week_start) where period_type='week'
    do update set score=excluded.score,achieved_at=excluded.achieved_at
    where private.sora_scores.score < excluded.score;
    perform private.sora_history_add(v_uid, p_score, v_now);
  end if;
  -- O mesmo UUID foi consumido acima: não permite recompensar uma segunda finalização.
  -- 10 s é um piso adicional para a missão; altura ainda é informação do cliente.
  if p_score >= 500 and v_elapsed >= 10 then
    insert into private.sora_daily_500_rewards (player_id, reward_day, run_id, rewarded_at)
    values (v_uid, v_today, p_run_id, v_now)
    on conflict do nothing;
    if found then
      update public.players
         set stars = stars + 25, updated_at = v_now
       where id = v_uid;
      insert into public.star_log (user_id, delta, reason)
      values (v_uid, 25, 'sora_500');
      v_credit := 25;
    else
      v_already := true;
    end if;
  end if;

  return jsonb_build_object(
    'ok',true,'score',p_score,'ranked',p_score>0,'finished_at',v_now,
    'stars_credited',v_credit,'reward_claimed_today',v_already
  );
end
$function$;

-- Após replace, preservar explicitamente a superfície authenticated-only.
revoke all on function public.sora_run_finish(uuid, integer) from public, anon;
grant execute on function public.sora_run_finish(uuid, integer) to authenticated;

commit;

-- Conferir em homologação/PG isolado:
-- 1) Anon / conta errada / UUID inexistente: 0 crédito e 0 registros.
-- 2) Partida inválida ou >=500m em <10s: 0 crédito.
-- 3) Partida válida >=500m: exatamente +25 no saldo e um star_log(reason=sora_500).
-- 4) Repetição do UUID, segunda partida no dia e concorrência: +0.
-- 5) No dia seguinte São Paulo: novo +25, sem afetar tetos Center/Pet.
-- 6) Falha em UPDATE/INSERT: rollback integral, sem consumir a partida.
