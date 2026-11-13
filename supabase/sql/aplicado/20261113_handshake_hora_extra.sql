-- TsuLiPa⭐World / Handshake⭐Event! — HORA EXTRA (rodadas 6 a 8)
-- APLICADO EM PRODUÇÃO em 13/11/2026 com o OK do dono (conferido com pg_get_functiondef antes; permissões só authenticated).
-- REVISÃO SOMENTE: NÃO APLICAR SEM O OK DO DONO DO PROJETO.
--
-- Base: as duas funções como estão em supabase/sql/aplicado/20261103231720_pr71_recordes_online_insignias_verificados.sql.
-- ANTES DE APLICAR: conferir com pg_get_functiondef se a produção ainda está igual a esse arquivo.
--
-- Mudanças (só duas linhas):
--   handshake_iniciar:     gera 8 filas em vez de 5 (as 3 últimas com 6 fãs).
--   handshake_run_finish:  aceita respostas das rodadas 1 a 8 (antes 1 a 5) e até 60 respostas (antes 30;
--                          8 rodadas somam 39 fãs + superfãs).
-- Conferido em 13/11 contra a produção (pg_get_functiondef): base igual ao arquivo aplicado.
-- Pontuação, prêmio do dia, limite de 30 sessões/dia e validação continuam iguais.
-- O site (handshake.js, hsMaxRodadas) só entra na hora extra quando o servidor manda mais de 5 filas,
-- então antes desta proposta tudo segue em 5 rodadas.
-- Observação: o servidor não sabe o Hype; quem zera o Hype na 5ª e manda respostas extras ganharia só os pontos delas.
-- Risco baixo (os pontos extras exigem acertar 18 presentes em 4 s cada), mas fica registrado.

begin;

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
 FOR v_r IN 1..8 LOOP
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
 IF jsonb_array_length(p_respostas) NOT BETWEEN 1 AND 60
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
   IF v_r NOT BETWEEN 1 AND 8 OR v_r<v_ultimo OR v_origem NOT BETWEEN 1 AND v_r
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



commit;
