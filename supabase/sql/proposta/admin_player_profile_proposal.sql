-- PROPOSTA — Backstage Admin / ficha administrativa de jogador.
-- NÃO APLICAR DIRETAMENTE EM PRODUÇÃO. Revisar e homologar antes do merge.
-- Modelo: um único proprietário, validado exclusivamente por public.eh_admin().
-- Retorna somente dados de jogo/perfil necessários à administração; nunca expõe campos de autenticação ou identificadores internos.

create or replace function public.admin_ficha_jogador(p_nick text)
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $function$
declare
  v_player public.players%rowtype;
  v_week date;
  v_pet_count integer := 0;
  v_pet_keys jsonb := '[]'::jsonb;
  v_center_best bigint := 0;
  v_center_rank bigint;
  v_sora_all_best integer := 0;
  v_sora_all_rank bigint := 0;
  v_sora_week_best integer := 0;
  v_sora_week_rank bigint := 0;
  v_kt_score integer := 0;
  v_kt_combo integer := 0;
  v_kt_acc numeric(5,2) := 0;
  v_result jsonb;
begin
  if auth.uid() is null or not coalesce(public.eh_admin(), false) then
    return jsonb_build_object('ok', false, 'erro', 'admin');
  end if;

  if p_nick is null or length(btrim(p_nick)) < 1 or length(btrim(p_nick)) > 24 then
    return jsonb_build_object('ok', false, 'erro', 'nickname');
  end if;

  select p.*
    into v_player
    from public.players p
   where lower(p.nick) = lower(btrim(p_nick))
   limit 1;

  if not found then
    return jsonb_build_object('ok', false, 'erro', 'perfil');
  end if;

  v_week := (pg_catalog.now() at time zone 'America/Sao_Paulo')::date
    - extract(dow from (pg_catalog.now() at time zone 'America/Sao_Paulo')::date)::integer;

  select coalesce(max(l.score), 0)
    into v_center_best
    from public.leaderboard l
   where l.user_id = v_player.id
     and l."char" = 'Idol';

  with scores as (
    select l.user_id, max(l.score) as best
      from public.leaderboard l
     where l."char" = 'Idol'
     group by l.user_id
  ), ranked as (
    select s.user_id, dense_rank() over (order by s.best desc) as position
      from scores s
  )
  select coalesce(max(r.position), 0) into v_center_rank
    from ranked r
   where r.user_id = v_player.id;

  -- O ranking do Sora tem dois períodos independentes: recorde persistente e semana atual.
  select coalesce(max(s.score), 0)
    into v_sora_all_best
    from private.sora_scores s
   where s.player_id = v_player.id
     and s.period_type = 'all';

  with scores as (
    select s.player_id, max(s.score) as best,
           min(s.achieved_at) as achieved_at,
           coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as display_nick
      from private.sora_scores s
      join public.players p on p.id = s.player_id
     where s.period_type = 'all'
       and not coalesce(p.bloqueado, false)
     group by s.player_id, p.nick
  ), ranked as (
    select s.player_id,
           row_number() over (order by s.best desc, s.achieved_at asc,
                              lower(s.display_nick), s.player_id) as position
      from scores s
  )
  select coalesce(max(r.position), 0)
    into v_sora_all_rank
    from ranked r
   where r.player_id = v_player.id;

  select coalesce(max(s.score), 0)
    into v_sora_week_best
    from private.sora_scores s
   where s.player_id = v_player.id
     and s.period_type = 'week'
     and s.week_start = v_week;

  with scores as (
    select s.player_id, s.score, s.achieved_at,
           coalesce(nullif(pg_catalog.btrim(p.nick), ''), 'Idol') as display_nick
      from private.sora_scores s
      join public.players p on p.id = s.player_id
     where s.period_type = 'week'
       and s.week_start = v_week
       and not coalesce(p.bloqueado, false)
  ), ranked as (
    select s.player_id,
           row_number() over (order by s.score desc, s.achieved_at asc,
                              lower(s.display_nick), s.player_id) as position
      from scores s
  )
  select coalesce(max(r.position), 0)
    into v_sora_week_rank
    from ranked r
   where r.player_id = v_player.id;

  select coalesce(max(s.score), 0), coalesce(max(s.combo), 0), coalesce(max(s.acc), 0)
    into v_kt_score, v_kt_combo, v_kt_acc
    from private.kt_scores s
   where s.player_id = v_player.id
     and s.week_start = v_week;

  if jsonb_typeof(v_player.nuvem_pet->'pets') = 'object' then
    select count(*)::integer,
           coalesce(jsonb_agg(k.key order by k.key), '[]'::jsonb)
      into v_pet_count, v_pet_keys
      from jsonb_each(v_player.nuvem_pet->'pets') as k(key, value)
     where jsonb_typeof(k.value) = 'object';
  end if;

  v_result := jsonb_build_object(
    'ok', true,
    'perfil', jsonb_build_object(
      'nick', v_player.nick,
      'avatar', v_player.avatar,
      'visual', v_player.nuvem_visual,
      'oshi', v_player.oshi,
      'emoji', v_player.emoji,
      'cor', v_player.cor,
      'time', v_player.time,
      'frase', v_player.frase,
      'estrelas', v_player.stars,
      'bloqueado', coalesce(v_player.bloqueado, false),
      'recados_ativos', coalesce(v_player.recados_on, true),
      'moon_duo_ativo', coalesce(v_player.duo_on, true),
      'criado_em', v_player.created_at,
      'atualizado_em', v_player.updated_at
    ),
    'recordes', jsonb_build_object(
      'center_run', jsonb_build_object('recorde', v_center_best, 'posicao', v_center_rank),
      'sora_jump', jsonb_build_object(
        'geral', jsonb_build_object('recorde', v_sora_all_best, 'posicao', v_sora_all_rank),
        'semana', jsonb_build_object('recorde', v_sora_week_best, 'posicao', v_sora_week_rank,
                                     'semana_inicio', v_week)
      ),
      'karaoke_time_semana', jsonb_build_object(
        'pontuacao', v_kt_score,
        'combo', v_kt_combo,
        'acertos', v_kt_acc,
        'semana_inicio', v_week
      )
    ),
    'participacao', jsonb_build_object(
      'corridas_registradas', coalesce(v_player.corridas_total, 0),
      'centers_total', coalesce(v_player.centers_total, 0),
      'dias_jogados', coalesce(v_player.dias_jogados, 0),
      'sora_partidas', (select count(*) from private.sora_runs r where r.player_id = v_player.id),
      'karaoke_shows', (select count(*) from private.kt_runs r where r.player_id = v_player.id),
      'duo_interacoes', (select count(*) from public.duo_log d where d.de = v_player.id or d.para = v_player.id),
      'missoes_concluidas', (select count(*) from public.missoes_feitas m where m.user_id = v_player.id)
    ),
    'pets', jsonb_build_object(
      'quantidade', v_pet_count,
      'nomes', v_pet_keys
    ),
    'historico_admin', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'acao', a.acao,
        'valor', a.valor,
        'motivo', a.motivo,
        'quando', a.created_at
      ) order by a.id desc), '[]'::jsonb)
        from (
          select l.id, l.acao, l.valor, l.motivo, l.created_at
            from public.admin_log l
           where lower(coalesce(l.alvo, '')) = lower(v_player.nick)
           order by l.id desc
           limit 20
        ) a
    )
  );

  return v_result;
end;
$function$;

revoke all on function public.admin_ficha_jogador(text) from public, anon;
grant execute on function public.admin_ficha_jogador(text) to authenticated;

comment on function public.admin_ficha_jogador(text) is
  'Backstage Admin: ficha de jogo por nickname, restrita ao único administrador via eh_admin(). Proposta pendente de homologação.';
