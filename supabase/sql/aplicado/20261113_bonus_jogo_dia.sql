-- TsuLiPa⭐World — "Bônus do dia por jogo" (Café e Handshake)
-- APLICADO EM PRODUÇÃO em 13/11/2026 com o OK do dono. bonus_jogo_dia_dar sem EXECUTE para ninguém (só via jogo_registrar).
-- REVISÃO SOMENTE: NÃO APLICAR SEM O OK DO DONO DO PROJETO.
-- Análise: docs/ECONOMIA_ESTRELAS.md
--
-- ★10 na primeira partida VERIFICADA do dia (America/Sao_Paulo) com 600+ pontos, por jogo ('cafe', 'hand').
-- Máximo +★20/dia por conta. Não mexe no teto do Center, no pet nem em preços.
-- Ponto de entrada: private.jogo_registrar (já chamada só por cafe_run_finalizar e handshake_run_finish,
-- depois da validação completa). jogo_registrar ganha UMA linha; o resto dela fica igual à produção de 13/11.

begin;

create table private.bonus_jogo_dia (
  user_id uuid not null references public.players(id) on delete cascade,
  jogo text not null check (jogo in ('cafe','hand')),
  dia date not null,
  run_id uuid not null,
  em timestamptz not null default clock_timestamp(),
  primary key (user_id, jogo, dia)
);
alter table private.bonus_jogo_dia enable row level security;
revoke all on table private.bonus_jogo_dia from public, anon, authenticated;

create or replace function private.bonus_jogo_dia_dar(p_user uuid, p_jogo text, p_run uuid, p_pontos integer)
returns integer language plpgsql security definer set search_path to '' as $function$
declare v_dia date := (clock_timestamp() at time zone 'America/Sao_Paulo')::date;
begin
  if p_user is null or p_jogo not in ('cafe','hand') or coalesce(p_pontos,0) < 600 then return 0; end if;
  insert into private.bonus_jogo_dia(user_id, jogo, dia, run_id) values (p_user, p_jogo, v_dia, p_run)
  on conflict do nothing;
  if not found then return 0; end if;
  update public.players set stars = stars + 10, updated_at = now() where id = p_user;
  insert into public.star_log(user_id, delta, reason) values (p_user, 10, 'bonus_' || p_jogo);
  return 10;
end $function$;
revoke all on function private.bonus_jogo_dia_dar(uuid,text,uuid,integer) from public, anon, authenticated;

CREATE OR REPLACE FUNCTION private.jogo_registrar(p_user uuid, p_jogo text, p_run uuid, p_pontos integer, p_combo integer, p_perfeitos integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE v_semana date; v_agora timestamptz:=clock_timestamp();
BEGIN
 IF p_user IS NULL OR p_jogo NOT IN ('hand','cafe') OR p_pontos NOT BETWEEN 0 AND 10000000
 THEN RAISE EXCEPTION 'jogo_registrar: argumentos inválidos'; END IF;
 -- Bloqueio por conta serializa finalizações simultâneas.
 PERFORM 1 FROM public.players WHERE id=p_user FOR UPDATE;
 v_semana := (v_agora AT TIME ZONE 'America/Sao_Paulo')::date
   - (extract(dow FROM v_agora AT TIME ZONE 'America/Sao_Paulo')::integer);
 INSERT INTO private.jogo_partidas(jogo,run_id,user_id,pontos,combo_max,perfeitos,concluido_em)
 VALUES(p_jogo,p_run,p_user,p_pontos,coalesce(p_combo,0),coalesce(p_perfeitos,0),v_agora)
 ON CONFLICT(jogo,run_id) DO NOTHING;
 -- Bônus do dia (13/11): ★10 na 1ª partida verificada do dia com 600+ pontos, uma vez por jogo.
 IF FOUND THEN PERFORM private.bonus_jogo_dia_dar(p_user, p_jogo, p_run, p_pontos); END IF;
 INSERT INTO private.jogo_maximos(user_id,jogo,maior_geral,semana,melhor_semana)
 VALUES(p_user,p_jogo,p_pontos,v_semana,p_pontos)
 ON CONFLICT(user_id,jogo) DO UPDATE SET
 maior_geral=greatest(private.jogo_maximos.maior_geral,EXCLUDED.maior_geral),
 melhor_semana=CASE WHEN private.jogo_maximos.semana=EXCLUDED.semana
   THEN greatest(private.jogo_maximos.melhor_semana,EXCLUDED.melhor_semana)
   ELSE EXCLUDED.melhor_semana END,
 semana=EXCLUDED.semana;
 -- Retém a união dos 5 maiores + 5 mais recentes; os máximos sobrevivem em jogo_maximos.
 WITH colocacoes AS (
   SELECT run_id,
     row_number() OVER(ORDER BY pontos DESC,concluido_em DESC,run_id) AS pos_top,
     row_number() OVER(ORDER BY concluido_em DESC,run_id) AS pos_recente
   FROM private.jogo_partidas WHERE user_id=p_user AND jogo=p_jogo
 )
 DELETE FROM private.jogo_partidas p USING colocacoes c
 WHERE p.run_id=c.run_id AND p.jogo=p_jogo AND p.user_id=p_user
   AND c.pos_top>5 AND c.pos_recente>5;
END $function$;

commit;

-- Conferir depois de aplicar:
-- 1) Partida verificada < 600 pontos: nenhum bônus.
-- 2) 1ª partida ≥ 600 do dia: +★10 e star_log reason='bonus_cafe' ou 'bonus_hand'.
-- 3) 2ª partida no mesmo dia e mesma partida repetida (run_id): +★0.
-- 4) Dia seguinte (São Paulo): novo +★10.
