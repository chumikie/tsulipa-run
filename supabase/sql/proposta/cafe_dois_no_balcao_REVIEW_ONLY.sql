-- TsuLiPa⭐World / Happy⭐Cafe! — "DOIS NO BALCÃO" (até 2 pedidos abertos ao mesmo tempo)
-- REVISÃO SOMENTE: NÃO APLICAR SEM O OK DO DONO DO PROJETO.
--
-- Base: funções em supabase/sql/aplicado/20261103231720_pr71_recordes_online_insignias_verificados.sql.
-- ANTES DE APLICAR: conferir com pg_get_functiondef se cafe_run_pedido/cafe_run_etapa/cafe_run_finalizar
-- em produção são iguais ao arquivo aplicado.
--
-- Estratégia ADITIVA: as funções atuais continuam iguais para o site de hoje.
--   public.cafe_run_pedidos(p_run)            NOVA: devolve os pedidos abertos (até 2), criando o que faltar.
--   public.cafe_run_etapa2(p_sessao, ...)     NOVA: serve QUALQUER pedido aberto da partida (não só o último).
--   public.cafe_run_finalizar(p_run)          ALTERADA: considera todos os pedidos abertos; sem vidas,
--                                             fecha os que sobraram como "foi embora" (sem tirar vida).
-- Regras que NÃO mudam: 12 pedidos por partida, 3 vidas, mesma pontuação, mesmo limite de tempo
-- por pedido (cada um com o seu relógio), 20 partidas por dia, 25 min por pedido, 0,5 s mínimo.
-- O jogo só usa o modo novo se cafe_run_pedidos existir; senão segue com um cliente por vez.

begin;

CREATE OR REPLACE FUNCTION public.cafe_run_pedidos(p_run uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_r private.cafe_runs%ROWTYPE;
 v_abertos integer; v_criados integer; v_sessao uuid; v_pedido jsonb;
 v_base integer; v_cob integer; v_enf integer; v_doce integer; v_limite integer;
 v_semana integer; v_base_semana integer; v_doce_semana integer; v_n integer;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(bloqueado,false) INTO v_bloqueado FROM public.players WHERE id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT * INTO v_r FROM private.cafe_runs WHERE id=p_run AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','run'); END IF;
 IF v_r.finalizado IS NOT NULL OR v_r.vidas<=0 OR v_r.criado<clock_timestamp()-interval '1 hour'
 THEN RETURN json_build_object('ok',false,'erro','run_fechado'); END IF;
 SELECT count(*) FILTER (WHERE NOT concluido), count(*) INTO v_abertos, v_criados
   FROM private.cafe_sessoes WHERE run_id=v_r.id;
 v_semana:=floor(((now() AT TIME ZONE 'America/Sao_Paulo')::date-DATE '1970-01-01'+3)::numeric/7)::integer % 5;
 v_base_semana:=(ARRAY[3,2,1,4,0])[v_semana+1];
 v_doce_semana:=(ARRAY[0,1,2,3,0])[v_semana+1];
 -- cria pedidos até ter 2 abertos, sem passar de 12 na partida
 WHILE v_abertos<2 AND v_criados<12 LOOP
   v_n:=v_criados;   -- a dificuldade segue a ordem de chegada, como no modo de um cliente
   v_base:=floor(random()*5)::integer;
   v_cob:=CASE WHEN v_n>=2 OR random()<.4 THEN floor(random()*3)::integer ELSE -1 END;
   v_enf:=floor(random()*4)::integer;
   v_doce:=CASE WHEN v_n>=4 AND random()<.6 THEN floor(random()*4)::integer ELSE -1 END;
   IF random()<.5 THEN v_base:=v_base_semana; IF v_doce>=0 THEN v_doce:=v_doce_semana; END IF; END IF;
   -- com dois no balcão, cada pedido ganha +4 s de paciência (o tempo corre para os dois)
   v_limite:=greatest(7,15-ceil(v_n*.75)::integer)+4;
   v_pedido:=jsonb_build_object('base',v_base,'cob',v_cob,'enf',v_enf,'doce',v_doce);
   INSERT INTO private.cafe_sessoes(user_id,pedido,run_id,etapa,limite_segundos)
   VALUES(v_id,v_pedido,v_r.id,v_n+1,v_limite) RETURNING id INTO v_sessao;
   UPDATE private.cafe_runs SET ultimo_pedido=v_sessao WHERE id=v_r.id;
   v_abertos:=v_abertos+1; v_criados:=v_criados+1;
 END LOOP;
 RETURN json_build_object('ok',true,'pedidos',coalesce((
   SELECT json_agg(json_build_object('sessao',s.id,'pedido',s.pedido,'rodada',s.etapa,
     'limite_segundos',s.limite_segundos,
     'segundos_passados',round(extract(epoch FROM clock_timestamp()-s.criado)::numeric,2)) ORDER BY s.etapa)
   FROM private.cafe_sessoes s WHERE s.run_id=v_r.id AND NOT s.concluido),'[]'::json),
   'criados',v_criados);
END $$;

CREATE OR REPLACE FUNCTION public.cafe_run_etapa2(p_sessao uuid,p_monta jsonb,p_saiu boolean)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_s private.cafe_sessoes%ROWTYPE;
 v_r private.cafe_runs%ROWTYPE; v_correto boolean; v_resto numeric; v_segundos numeric;
 v_semana integer; v_base_semana integer; v_combo integer; v_pontos integer:=0;
 v_total integer; v_vidas integer;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(bloqueado,false) INTO v_bloqueado FROM public.players WHERE id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT * INTO v_s FROM private.cafe_sessoes WHERE id=p_sessao AND user_id=v_id;
 IF NOT FOUND OR v_s.run_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 SELECT * INTO v_r FROM private.cafe_runs WHERE id=v_s.run_id AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','run'); END IF;
 SELECT * INTO v_s FROM private.cafe_sessoes WHERE id=p_sessao AND user_id=v_id FOR UPDATE;
 IF v_s.concluido THEN
   RETURN json_build_object('ok',true,'confirmado',true,'repetido',true,'certo',v_s.correto_verificado,
     'pontos_etapa',coalesce(v_s.pontos_verificados,0),'pontos',v_r.pontos,
     'rodadas',v_r.rodadas,'vidas',v_r.vidas,'combo',v_r.combo);
 END IF;
 -- diferença para cafe_run_etapa: aceita qualquer pedido ABERTO desta partida (não só o último)
 IF v_r.finalizado IS NOT NULL OR v_r.vidas<=0
    OR v_s.criado<clock_timestamp()-interval '25 minutes'
    OR v_s.criado>clock_timestamp()-interval '0.5 seconds'
    OR jsonb_typeof(p_monta) IS DISTINCT FROM 'object'
    OR p_saiu IS NULL
 THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 IF jsonb_typeof(p_monta->'base') IS DISTINCT FROM 'number'
    OR jsonb_typeof(p_monta->'cob') IS DISTINCT FROM 'number'
    OR jsonb_typeof(p_monta->'enf') IS DISTINCT FROM 'number'
    OR jsonb_typeof(p_monta->'doce') IS DISTINCT FROM 'number'
 THEN RETURN json_build_object('ok',false,'erro','monta'); END IF;
 IF (p_monta->>'base')::integer NOT BETWEEN -1 AND 4
    OR (p_monta->>'cob')::integer NOT BETWEEN -1 AND 2
    OR (p_monta->>'enf')::integer NOT BETWEEN -1 AND 3
    OR (p_monta->>'doce')::integer NOT BETWEEN -1 AND 3
 THEN RETURN json_build_object('ok',false,'erro','monta'); END IF;
 v_segundos:=extract(epoch FROM clock_timestamp()-v_s.criado);
 v_resto:=greatest(0::numeric,least(1::numeric,1-v_segundos/v_s.limite_segundos));
 v_correto:=NOT p_saiu AND v_segundos<=v_s.limite_segundos+1.5
    AND p_monta->>'base'=v_s.pedido->>'base'
    AND p_monta->>'cob'=v_s.pedido->>'cob'
    AND p_monta->>'enf'=v_s.pedido->>'enf'
    AND p_monta->>'doce'=v_s.pedido->>'doce';
 v_combo:=CASE WHEN v_correto THEN v_r.combo+1 ELSE 0 END;
 IF v_correto THEN
   v_semana:=floor(((now() AT TIME ZONE 'America/Sao_Paulo')::date-DATE '1970-01-01'+3)::numeric/7)::integer % 5;
   v_base_semana:=(ARRAY[3,2,1,4,0])[v_semana+1];
   v_pontos:=round((100+round(v_resto*100)
     +CASE WHEN (v_s.pedido->>'cob')::integer>=0 THEN 30 ELSE 0 END
     +CASE WHEN (v_s.pedido->>'doce')::integer>=0 THEN 40 ELSE 0 END)
       *(1+least(v_combo-1,5)*.1))::integer
     +CASE WHEN (v_s.pedido->>'base')::integer=v_base_semana THEN 50 ELSE 0 END;
   INSERT INTO private.cafe_resultados(user_id,dia)
   VALUES(v_id,(now() AT TIME ZONE 'America/Sao_Paulo')::date)
   ON CONFLICT(user_id,dia) DO NOTHING;
   INSERT INTO private.cafe_receitas_comprovadas(user_id,base,enf)
   VALUES(v_id,(v_s.pedido->>'base')::integer,(v_s.pedido->>'enf')::integer)
   ON CONFLICT(user_id,base,enf) DO NOTHING;
 END IF;
 UPDATE private.cafe_sessoes
 SET concluido=true,pontos_verificados=v_pontos,correto_verificado=v_correto WHERE id=v_s.id;
 UPDATE private.cafe_runs
 SET rodadas=rodadas+1,
     vidas=vidas-CASE WHEN v_correto THEN 0 ELSE 1 END,
     pontos=pontos+v_pontos,
     combo=v_combo,
     combo_max=greatest(combo_max,v_combo),
     perfeitos=perfeitos+CASE WHEN v_correto THEN 1 ELSE 0 END
 WHERE id=v_r.id RETURNING pontos,vidas INTO v_total,v_vidas;
 IF v_correto THEN PERFORM public.conquista_jogo('jogo_caderno'); END IF;
 RETURN json_build_object('ok',true,'confirmado',true,'repetido',false,'certo',v_correto,
   'pontos_etapa',v_pontos,'pontos',v_total,'rodadas',v_r.rodadas+1,
   'vidas',v_vidas,'combo',v_combo,'perfeitos',v_r.perfeitos+CASE WHEN v_correto THEN 1 ELSE 0 END);
END $$;

CREATE OR REPLACE FUNCTION public.cafe_run_finalizar(p_run uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_r private.cafe_runs%ROWTYPE;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(bloqueado,false) INTO v_bloqueado FROM public.players WHERE id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT * INTO v_r FROM private.cafe_runs WHERE id=p_run AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','run'); END IF;
 IF v_r.finalizado IS NULL THEN
   IF v_r.vidas>0 AND v_r.rodadas<12 THEN RETURN json_build_object('ok',false,'erro','incompleto'); END IF;
   IF v_r.vidas<=0 THEN
     -- sem vidas: o pedido que sobrou no balcão vai embora, sem pontos e sem tirar vida
     UPDATE private.cafe_sessoes SET concluido=true,pontos_verificados=0,correto_verificado=false
      WHERE run_id=v_r.id AND NOT concluido;
   ELSIF EXISTS(SELECT 1 FROM private.cafe_sessoes WHERE run_id=v_r.id AND NOT concluido) THEN
     RETURN json_build_object('ok',false,'erro','pedido_pendente');
   END IF;
   UPDATE private.cafe_runs SET finalizado=clock_timestamp() WHERE id=v_r.id;
   PERFORM private.jogo_registrar(v_id,'cafe',v_r.id,v_r.pontos,v_r.combo_max,v_r.perfeitos);
   IF v_r.perfeitos=12 THEN PERFORM public.conquista_jogo('jogo_barista'); END IF;
 END IF;
 RETURN json_build_object('ok',true,'confirmado',true,'repetido',v_r.finalizado IS NOT NULL,
   'run_id',v_r.id,'pontos_verificados',v_r.pontos,
   'rodadas',v_r.rodadas,'perfeitos',v_r.perfeitos,'combo_max',v_r.combo_max);
END $$;

REVOKE ALL ON FUNCTION public.cafe_run_pedidos(uuid) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.cafe_run_etapa2(uuid,jsonb,boolean) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.cafe_run_finalizar(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cafe_run_pedidos(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cafe_run_etapa2(uuid,jsonb,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cafe_run_finalizar(uuid) TO authenticated;

commit;

-- Conferir em banco de teste antes de produção:
-- 1) Partida antiga (cafe_run_pedido/cafe_run_etapa) continua funcionando igual.
-- 2) cafe_run_pedidos devolve 2 pedidos; servir o 2º antes do 1º é aceito por cafe_run_etapa2.
-- 3) Nunca passa de 12 pedidos criados nem de 2 abertos.
-- 4) Sem vidas, cafe_run_finalizar fecha o pedido que sobrou e registra o recorde.
-- 5) Com vidas e menos de 12, finalizar continua recusando ("incompleto").
