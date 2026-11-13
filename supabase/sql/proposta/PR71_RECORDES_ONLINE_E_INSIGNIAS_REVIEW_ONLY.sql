-- TsuLiPa⭐World · PR #71 · revisão separada: recordes ONLINE e insígnias verificadas.
-- PROPOSTA. NÃO EXECUTAR SEM REVISÃO, TRANSAÇÃO DE TESTE REVERTIDA E APROVAÇÃO DO USUÁRIO.
-- Base verificada em 03/11/2026: handshake_premio, handshake_iniciar, cafe_iniciar e cafe_concluir.
-- Não alterar tabelas financeiras, prêmios diários, missões, ranking dos demais jogos ou dados existentes.
BEGIN;

CREATE TABLE IF NOT EXISTS private.jogo_partidas (
  jogo text NOT NULL CHECK (jogo IN ('hand','cafe')),
  run_id uuid NOT NULL,
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  pontos integer NOT NULL CHECK (pontos BETWEEN 0 AND 10000000),
  combo_max integer NOT NULL DEFAULT 0,
  perfeitos integer NOT NULL DEFAULT 0,
  concluido_em timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(jogo,run_id)
);
ALTER TABLE private.jogo_partidas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.jogo_partidas FROM PUBLIC,anon,authenticated;
CREATE INDEX IF NOT EXISTS jogo_partidas_top ON private.jogo_partidas(user_id,jogo,pontos DESC,concluido_em DESC);
CREATE INDEX IF NOT EXISTS jogo_partidas_recent ON private.jogo_partidas(user_id,jogo,concluido_em DESC);

CREATE TABLE IF NOT EXISTS private.jogo_maximos (
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  jogo text NOT NULL CHECK (jogo IN ('hand','cafe')),
  maior_geral integer NOT NULL DEFAULT 0,
  semana date NOT NULL,
  melhor_semana integer NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id,jogo)
);
ALTER TABLE private.jogo_maximos ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.jogo_maximos FROM PUBLIC,anon,authenticated;

CREATE TABLE IF NOT EXISTS private.cafe_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  criado timestamptz NOT NULL DEFAULT clock_timestamp(),
  rodadas integer NOT NULL DEFAULT 0 CHECK(rodadas BETWEEN 0 AND 12),
  vidas integer NOT NULL DEFAULT 3 CHECK(vidas BETWEEN 0 AND 3),
  pontos integer NOT NULL DEFAULT 0,
  combo integer NOT NULL DEFAULT 0,
  combo_max integer NOT NULL DEFAULT 0,
  perfeitos integer NOT NULL DEFAULT 0,
  finalizado timestamptz,
  ultimo_pedido uuid
);
ALTER TABLE private.cafe_runs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.cafe_runs FROM PUBLIC,anon,authenticated;
CREATE INDEX IF NOT EXISTS cafe_runs_usuario ON private.cafe_runs(user_id,criado DESC);

CREATE TABLE IF NOT EXISTS private.cafe_receitas_comprovadas (
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  base integer NOT NULL CHECK(base BETWEEN 0 AND 4),
  enf integer NOT NULL CHECK(enf BETWEEN 0 AND 3),
  primeiro_em timestamptz NOT NULL DEFAULT clock_timestamp(),
  PRIMARY KEY(user_id,base,enf)
);
ALTER TABLE private.cafe_receitas_comprovadas ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.cafe_receitas_comprovadas FROM PUBLIC,anon,authenticated;

ALTER TABLE private.cafe_sessoes
  ADD COLUMN IF NOT EXISTS run_id uuid REFERENCES private.cafe_runs(id),
  ADD COLUMN IF NOT EXISTS etapa integer,
  ADD COLUMN IF NOT EXISTS limite_segundos integer,
  ADD COLUMN IF NOT EXISTS pontos_verificados integer,
  ADD COLUMN IF NOT EXISTS correto_verificado boolean;
CREATE UNIQUE INDEX IF NOT EXISTS cafe_sessoes_por_run_etapa ON private.cafe_sessoes(run_id,etapa) WHERE run_id IS NOT NULL;
ALTER TABLE public.handshake_premios ADD COLUMN IF NOT EXISTS sessao_origem uuid;
ALTER TABLE private.handshake_sessoes
  ADD COLUMN IF NOT EXISTS pontos_verificados integer,
  ADD COLUMN IF NOT EXISTS acertos_verificados integer,
  ADD COLUMN IF NOT EXISTS combo_max_verificado integer;

CREATE OR REPLACE FUNCTION private.jogo_registrar(
 p_user uuid,p_jogo text,p_run uuid,p_pontos integer,p_combo integer,p_perfeitos integer
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_semana date; v_agora timestamptz:=clock_timestamp();
BEGIN
 IF p_user IS NULL OR p_jogo NOT IN ('hand','cafe') OR p_pontos NOT BETWEEN 0 AND 10000000
 THEN RAISE EXCEPTION 'jogo_registrar: argumentos inválidos'; END IF;
 -- Bloqueio por conta serializa finalizações simultâneas; nunca toca estrelas ou inventário.
 PERFORM 1 FROM public.players WHERE id=p_user FOR UPDATE;
 v_semana := (v_agora AT TIME ZONE 'America/Sao_Paulo')::date
   - (extract(dow FROM v_agora AT TIME ZONE 'America/Sao_Paulo')::integer);
 INSERT INTO private.jogo_partidas(jogo,run_id,user_id,pontos,combo_max,perfeitos,concluido_em)
 VALUES(p_jogo,p_run,p_user,p_pontos,coalesce(p_combo,0),coalesce(p_perfeitos,0),v_agora)
 ON CONFLICT(jogo,run_id) DO NOTHING;
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
END $$;
REVOKE ALL ON FUNCTION private.jogo_registrar(uuid,text,uuid,integer,integer,integer) FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.meus_recordes_jogo(p_jogo text)
RETURNS json LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_top json; v_rec json; v_maior integer:=0;
 v_semana date; v_melhor integer:=0;
BEGIN
 IF v_id IS NULL OR p_jogo NOT IN ('hand','cafe') THEN RETURN json_build_object('ok',false,'erro','acesso'); END IF;
 IF EXISTS(SELECT 1 FROM public.players WHERE id=v_id AND coalesce(bloqueado,false))
 THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT coalesce(json_agg(to_json(q)),'[]'::json) INTO v_top FROM (
   SELECT run_id::text AS id,pontos AS score,
      floor(extract(epoch FROM concluido_em)*1000)::bigint AS at
   FROM private.jogo_partidas WHERE user_id=v_id AND jogo=p_jogo
   ORDER BY pontos DESC,concluido_em DESC LIMIT 5
 ) q;
 SELECT coalesce(json_agg(to_json(q)),'[]'::json) INTO v_rec FROM (
   SELECT run_id::text AS id,pontos AS score,
      floor(extract(epoch FROM concluido_em)*1000)::bigint AS at
   FROM private.jogo_partidas WHERE user_id=v_id AND jogo=p_jogo
   ORDER BY concluido_em DESC LIMIT 5
 ) q;
 v_semana:=(now() AT TIME ZONE 'America/Sao_Paulo')::date
   - (extract(dow FROM now() AT TIME ZONE 'America/Sao_Paulo')::integer);
 SELECT maior_geral,CASE WHEN semana=v_semana THEN melhor_semana ELSE 0 END
 INTO v_maior,v_melhor FROM private.jogo_maximos WHERE user_id=v_id AND jogo=p_jogo;
 RETURN json_build_object('ok',true,'jogo',p_jogo,'melhores',v_top,'recentes',v_rec,
    'maior_geral',coalesce(v_maior,0),'melhor_semanal',coalesce(v_melhor,0),
    'semana',v_semana,'origem','servidor');
END $$;
REVOKE ALL ON FUNCTION public.meus_recordes_jogo(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.meus_recordes_jogo(text) TO authenticated;


-- Insígnias reais: só 3 chaves, apenas com prova autenticada; não lê localStorage.
CREATE OR REPLACE FUNCTION public.conquista_jogo(p_k text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_tem boolean; v_prova boolean:=false;
BEGIN
 IF v_id IS NULL THEN RETURN jsonb_build_object('ok',false,'erro','sem_conta'); END IF;
 IF p_k IS NULL OR p_k NOT IN ('jogo_barista','jogo_memoria','jogo_caderno')
 THEN RETURN jsonb_build_object('ok',false,'erro','chave'); END IF;
 SELECT coalesce(bloqueado,false),p_k=ANY(coalesce(insignias_jogos,'{}'::text[]))
 INTO v_bloqueado,v_tem FROM public.players WHERE id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN jsonb_build_object('ok',false,'erro','conta'); END IF;
 IF v_tem THEN RETURN jsonb_build_object('ok',true,'conquistada',true,'repetido',true); END IF;
 IF p_k='jogo_memoria' THEN
   SELECT EXISTS(SELECT 1 FROM private.jogo_partidas
     WHERE user_id=v_id AND jogo='hand' AND combo_max>=10) INTO v_prova;
 ELSIF p_k='jogo_barista' THEN
   SELECT EXISTS(SELECT 1 FROM private.cafe_runs
     WHERE user_id=v_id AND finalizado IS NOT NULL AND perfeitos=12) INTO v_prova;
 ELSE
   SELECT count(*)>=20 INTO v_prova FROM private.cafe_receitas_comprovadas WHERE user_id=v_id;
 END IF;
 IF NOT v_prova THEN RETURN jsonb_build_object('ok',false,'erro','prova'); END IF;
 UPDATE public.players SET insignias_jogos=array_append(coalesce(insignias_jogos,'{}'::text[]),p_k)
 WHERE id=v_id AND NOT p_k=ANY(coalesce(insignias_jogos,'{}'::text[]));
 RETURN jsonb_build_object('ok',true,'conquistada',true,'repetido',false,'chave',p_k);
END $$;
REVOKE ALL ON FUNCTION public.conquista_jogo(text) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.conquista_jogo(text) TO authenticated;


CREATE OR REPLACE FUNCTION public.handshake_iniciar()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_bloqueado boolean; v_r integer; v_i integer; v_n integer; v_pres integer;
 v_usados integer[]; v_fila jsonb; v_todos jsonb:='[]'::jsonb; v_sessao uuid;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 -- O prêmio do dia não bloqueia novas partidas; limite de sessões permanece.
 IF (SELECT count(*) FROM private.handshake_sessoes WHERE user_id=v_id AND criado > now()-interval '1 day') >= 30
 THEN RETURN json_build_object('ok',false,'erro','limite'); END IF;
 FOR v_r IN 1..5 LOOP
   v_n:=least(3+floor((v_r-1)*.8)::integer,6);
   v_usados:=ARRAY[]::integer[]; v_fila:='[]'::jsonb;
   FOR v_i IN 1..v_n LOOP
     v_pres:=floor(random()*14)::integer;
     WHILE v_pres=ANY(v_usados) LOOP v_pres:=(v_pres+1)%14; END LOOP;
     v_usados:=array_append(v_usados,v_pres);
     v_fila:=v_fila||jsonb_build_array(v_pres);
   END LOOP;
   v_todos:=v_todos||jsonb_build_array(v_fila);
 END LOOP;
 INSERT INTO private.handshake_sessoes(user_id,desafios) VALUES(v_id,v_todos) RETURNING id INTO v_sessao;
 RETURN json_build_object('ok',true,'sessao',v_sessao,'desafios',v_todos);
END $$;

CREATE OR REPLACE FUNCTION public.handshake_run_finish(p_sessao uuid,p_respostas jsonb)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE
 v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_bloqueado boolean; v_s private.handshake_sessoes%ROWTYPE;
 v_ant public.handshake_premios%ROWTYPE; v_a jsonb;
 v_r integer; v_origem integer; v_idx integer; v_resp integer; v_rest integer; v_verd integer;
 v_super boolean; v_vistos text[]:=ARRAY[]::text[]; v_chave text;
 v_ultimo integer:=0; v_combo integer:=0; v_pontos integer:=0; v_acertos integer:=0; v_base integer;
 v_combo_max integer:=0; v_semana integer; v_pres_semana integer;
 v_tipo text; v_item text:=''; v_saldo integer;
 v_itens text[]:=ARRAY['gyoza','dango','redvelvet','tiramisu','espuma'];
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 -- Uma recompensa anterior não impede verificar esta sessão nova.
 SELECT * INTO v_s FROM private.handshake_sessoes WHERE id=p_sessao AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 IF v_s.concluido THEN
   IF v_s.pontos_verificados IS NOT NULL THEN
     SELECT * INTO v_ant FROM public.handshake_premios
     WHERE user_id=v_id AND sessao_origem=v_s.id;
     IF FOUND THEN
       RETURN json_build_object('ok',true,'confirmado',true,'repetido',true,
         'pontos_verificados',v_s.pontos_verificados,'acertos',v_s.acertos_verificados,
         'combo_max',v_s.combo_max_verificado,'premio_novo',false,
         'dia',v_ant.dia,'tipo',v_ant.tipo,'item',v_ant.item);
     END IF;
     RETURN json_build_object('ok',true,'confirmado',true,'repetido',true,'pontos_verificados',
       v_s.pontos_verificados,'acertos',v_s.acertos_verificados,'combo_max',v_s.combo_max_verificado,
       'premio_novo',false);
   END IF;
   RETURN json_build_object('ok',false,'erro','sessao_antiga');
 END IF;
 IF v_s.criado<clock_timestamp()-interval '25 minutes'
    OR v_s.criado>clock_timestamp()-interval '9 seconds'
    OR jsonb_typeof(p_respostas) IS DISTINCT FROM 'array'
    OR coalesce(pg_column_size(p_respostas),0)>12000
 THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 IF jsonb_array_length(p_respostas) NOT BETWEEN 1 AND 30
 THEN RETURN json_build_object('ok',false,'erro','respostas'); END IF;
 -- Mesmo ciclo semanal do evento.js; presentes: 🍓, 🍰, 🌸, ⭐, 🧁.
 v_semana:=floor(((now() AT TIME ZONE 'America/Sao_Paulo')::date - DATE '1970-01-01' + 3)::numeric/7)::integer % 5;
 v_pres_semana:=(ARRAY[0,1,8,12,3])[v_semana+1];
 FOR v_a IN SELECT value FROM jsonb_array_elements(p_respostas) LOOP
   IF jsonb_typeof(v_a) IS DISTINCT FROM 'object'
    OR jsonb_typeof(v_a->'rodada') IS DISTINCT FROM 'number'
    OR jsonb_typeof(v_a->'origem') IS DISTINCT FROM 'number'
    OR jsonb_typeof(v_a->'indice') IS DISTINCT FROM 'number'
    OR jsonb_typeof(v_a->'resposta') IS DISTINCT FROM 'number'
    OR jsonb_typeof(v_a->'restante') IS DISTINCT FROM 'number'
    OR jsonb_typeof(v_a->'superfa') IS DISTINCT FROM 'boolean'
   THEN RETURN json_build_object('ok',false,'erro','respostas'); END IF;
   v_r:=(v_a->>'rodada')::integer;v_origem:=(v_a->>'origem')::integer;
   v_idx:=(v_a->>'indice')::integer;v_resp:=(v_a->>'resposta')::integer;
   v_rest:=(v_a->>'restante')::integer;v_super:=(v_a->>'superfa')::boolean;
   IF v_r NOT BETWEEN 1 AND 5 OR v_r<v_ultimo OR v_origem NOT BETWEEN 1 AND v_r
      OR v_idx<0 OR v_resp NOT BETWEEN -1 AND 13 OR v_rest NOT BETWEEN 0 AND 1000
      OR (v_super IS DISTINCT FROM (v_origem<v_r))
      OR v_idx >= jsonb_array_length(v_s.desafios->(v_origem-1))
   THEN RETURN json_build_object('ok',false,'erro','respostas'); END IF;
   v_chave:=v_r||':'||v_origem||':'||v_idx;
   IF v_chave=ANY(v_vistos) THEN RETURN json_build_object('ok',false,'erro','duplicado'); END IF;
   v_vistos:=array_append(v_vistos,v_chave);v_ultimo:=v_r;
   v_verd:=(v_s.desafios #>> ARRAY[(v_origem-1)::text,v_idx::text])::integer;
   IF v_resp=v_verd THEN
     v_acertos:=v_acertos+1;v_combo:=v_combo+1;v_combo_max:=greatest(v_combo_max,v_combo);
     v_base:=100+floor(v_rest*.08+.5)::integer+v_r*10
       +CASE WHEN v_super THEN 150 ELSE 0 END;
     v_pontos:=v_pontos+floor(v_base*(1+least(v_combo-1,10)*.1)+.5)::integer;
     IF v_verd=v_pres_semana THEN v_pontos:=v_pontos+50; END IF;
   ELSE v_combo:=0; END IF;
 END LOOP;
 UPDATE private.handshake_sessoes SET concluido=true,pontos_verificados=v_pontos,
   acertos_verificados=v_acertos,combo_max_verificado=v_combo_max WHERE id=v_s.id;
 INSERT INTO private.handshake_resultados(user_id,dia,acertos,pontos)
 VALUES(v_id,v_dia,v_acertos,v_pontos)
 ON CONFLICT(user_id,dia) DO UPDATE SET
 acertos=greatest(private.handshake_resultados.acertos,EXCLUDED.acertos),
 pontos=greatest(private.handshake_resultados.pontos,EXCLUDED.pontos);
 PERFORM private.jogo_registrar(v_id,'hand',v_s.id,v_pontos,v_combo_max,v_acertos);
 IF v_combo_max>=10 THEN PERFORM public.conquista_jogo('jogo_memoria'); END IF;
 IF v_pontos<600 THEN RETURN json_build_object('ok',true,'confirmado',true,'repetido',false,
    'pontos_verificados',v_pontos,'acertos',v_acertos,'combo_max',v_combo_max,
    'premio_novo',false,'missao',v_acertos>0); END IF;
 SELECT * INTO v_ant FROM public.handshake_premios WHERE user_id=v_id AND dia=v_dia;
 IF FOUND THEN RETURN json_build_object('ok',true,'confirmado',true,'repetido',false,
    'pontos_verificados',v_pontos,'acertos',v_acertos,'combo_max',v_combo_max,
    'premio_novo',false,'premio_entregue',true); END IF;
 v_tipo:=CASE WHEN random()<.4 THEN 'ticket' ELSE 'pet' END;
 IF v_tipo='pet' THEN v_item:=v_itens[1+floor(random()*array_length(v_itens,1))::integer]; END IF;
 INSERT INTO public.handshake_premios(user_id,dia,pontos,tipo,item,sessao_origem)
 VALUES(v_id,v_dia,v_pontos,v_tipo,v_item,v_s.id);
 IF v_tipo='ticket' THEN
   INSERT INTO private.kt_ticket_wallet(player_id,balance) VALUES(v_id,1)
   ON CONFLICT(player_id) DO UPDATE SET balance=private.kt_ticket_wallet.balance+1,
      updated_at=clock_timestamp() WHERE private.kt_ticket_wallet.balance<99
   RETURNING balance INTO v_saldo;
   IF NOT FOUND THEN
     v_tipo:='pet';v_item:=v_itens[1+floor(random()*array_length(v_itens,1))::integer];
     UPDATE public.handshake_premios SET tipo=v_tipo,item=v_item WHERE user_id=v_id AND dia=v_dia;
   ELSE
     INSERT INTO private.kt_ticket_events(player_id,actor_id,delta,reason)
       VALUES(v_id,v_id,1,'handshake');
   END IF;
 END IF;
 RETURN json_build_object('ok',true,'confirmado',true,'repetido',false,'dia',v_dia,
  'pontos',v_pontos,'pontos_verificados',v_pontos,'acertos',v_acertos,'combo_max',v_combo_max,
  'premio_novo',true,'tipo',v_tipo,'item',v_item,'tickets',v_saldo);
END $$;
REVOKE ALL ON FUNCTION public.handshake_run_finish(uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.handshake_run_finish(uuid,jsonb) TO authenticated;


-- Café: uma partida autenticada contém até 12 pedidos em ordem, com combo e relógio do servidor.
CREATE OR REPLACE FUNCTION public.cafe_run_iniciar()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_run uuid;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(bloqueado,false) INTO v_bloqueado FROM public.players WHERE id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 IF (SELECT count(*) FROM private.cafe_runs WHERE user_id=v_id AND criado>now()-interval '1 day')>=20
 THEN RETURN json_build_object('ok',false,'erro','limite'); END IF;
 INSERT INTO private.cafe_runs(user_id) VALUES(v_id) RETURNING id INTO v_run;
 RETURN json_build_object('ok',true,'run_id',v_run);
END $$;

CREATE OR REPLACE FUNCTION public.cafe_run_pedido(p_run uuid)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_r private.cafe_runs%ROWTYPE;
 v_s private.cafe_sessoes%ROWTYPE; v_sessao uuid; v_pedido jsonb;
 v_base integer; v_cob integer; v_enf integer; v_doce integer; v_limite integer;
 v_semana integer; v_base_semana integer; v_doce_semana integer;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(bloqueado,false) INTO v_bloqueado FROM public.players WHERE id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT * INTO v_r FROM private.cafe_runs WHERE id=p_run AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','run'); END IF;
 IF v_r.finalizado IS NOT NULL OR v_r.rodadas>=12 OR v_r.vidas<=0
    OR v_r.criado<clock_timestamp()-interval '1 hour'
 THEN RETURN json_build_object('ok',false,'erro','run_fechado'); END IF;
 IF v_r.ultimo_pedido IS NOT NULL THEN
   SELECT * INTO v_s FROM private.cafe_sessoes WHERE id=v_r.ultimo_pedido AND run_id=v_r.id;
   IF FOUND AND NOT v_s.concluido THEN
     RETURN json_build_object('ok',true,'sessao',v_s.id,'pedido',v_s.pedido,
       'rodada',v_s.etapa,'limite_segundos',v_s.limite_segundos);
   END IF;
 END IF;
 v_semana:=floor(((now() AT TIME ZONE 'America/Sao_Paulo')::date-DATE '1970-01-01'+3)::numeric/7)::integer % 5;
 v_base_semana:=(ARRAY[3,2,1,4,0])[v_semana+1];
 v_doce_semana:=(ARRAY[0,1,2,3,0])[v_semana+1];
 v_base:=floor(random()*5)::integer;
 v_cob:=CASE WHEN v_r.rodadas>=2 OR random()<.4 THEN floor(random()*3)::integer ELSE -1 END;
 v_enf:=floor(random()*4)::integer;
 v_doce:=CASE WHEN v_r.rodadas>=4 AND random()<.6 THEN floor(random()*4)::integer ELSE -1 END;
 IF random()<.5 THEN v_base:=v_base_semana;
   IF v_doce>=0 THEN v_doce:=v_doce_semana; END IF;
 END IF;
 v_limite:=greatest(7,15-ceil(v_r.rodadas*.75)::integer);
 v_pedido:=jsonb_build_object('base',v_base,'cob',v_cob,'enf',v_enf,'doce',v_doce);
 INSERT INTO private.cafe_sessoes(user_id,pedido,run_id,etapa,limite_segundos)
 VALUES(v_id,v_pedido,v_r.id,v_r.rodadas+1,v_limite) RETURNING id INTO v_sessao;
 UPDATE private.cafe_runs SET ultimo_pedido=v_sessao WHERE id=v_r.id;
 RETURN json_build_object('ok',true,'sessao',v_sessao,'pedido',v_pedido,
   'rodada',v_r.rodadas+1,'limite_segundos',v_limite);
END $$;

CREATE OR REPLACE FUNCTION public.cafe_run_etapa(p_sessao uuid,p_monta jsonb,p_saiu boolean)
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
 IF v_r.finalizado IS NOT NULL OR v_r.ultimo_pedido IS DISTINCT FROM p_sessao
    OR v_s.etapa IS DISTINCT FROM v_r.rodadas+1
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
   IF v_r.ultimo_pedido IS NOT NULL AND EXISTS(
     SELECT 1 FROM private.cafe_sessoes WHERE id=v_r.ultimo_pedido AND NOT concluido)
   THEN RETURN json_build_object('ok',false,'erro','pedido_pendente'); END IF;
   UPDATE private.cafe_runs SET finalizado=clock_timestamp() WHERE id=v_r.id;
   PERFORM private.jogo_registrar(v_id,'cafe',v_r.id,v_r.pontos,v_r.combo_max,v_r.perfeitos);
   IF v_r.perfeitos=12 THEN PERFORM public.conquista_jogo('jogo_barista'); END IF;
 END IF;
 RETURN json_build_object('ok',true,'confirmado',true,'repetido',v_r.finalizado IS NOT NULL,
   'run_id',v_r.id,'pontos_verificados',v_r.pontos,
   'rodadas',v_r.rodadas,'perfeitos',v_r.perfeitos,'combo_max',v_r.combo_max);
END $$;
REVOKE ALL ON FUNCTION public.cafe_run_iniciar() FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.cafe_run_pedido(uuid) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.cafe_run_etapa(uuid,jsonb,boolean) FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.cafe_run_finalizar(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cafe_run_iniciar() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cafe_run_pedido(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cafe_run_etapa(uuid,jsonb,boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.cafe_run_finalizar(uuid) TO authenticated;

COMMIT;
