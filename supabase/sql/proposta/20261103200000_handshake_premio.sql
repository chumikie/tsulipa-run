-- TsuLiPa⭐World | PR #71 | Handshake⭐Event! | versão segura para revisão.
-- Não concede estrelas. Ticket (40%, limite 99) OU item do pet (60%); 1 por conta/dia em Brasília.
-- O servidor cria o desafio, recalcula a pontuação e registra a missão. Repetição não dá segundo crédito.
-- Limitação honesta: um navegador automatizado pode observar presentes exibidos e responder;
-- a validação por sessão/tempo/desafio impede pontuação arbitrária via RPC, mas não é anti-bot absoluto.
BEGIN;
ALTER TABLE private.kt_ticket_events DROP CONSTRAINT IF EXISTS kt_ticket_events_reason_check;
ALTER TABLE private.kt_ticket_events ADD CONSTRAINT kt_ticket_events_reason_check
  CHECK (reason IN ('gacha','gift_sent','gift_received','moderation','show','handshake'));
CREATE TABLE IF NOT EXISTS public.handshake_premios (
 user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
 dia date NOT NULL, pontos integer NOT NULL CHECK(pontos>=600),
 tipo text NOT NULL CHECK(tipo IN ('ticket','pet')), item text NOT NULL DEFAULT '',
 criado timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,dia)
);
ALTER TABLE public.handshake_premios ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.handshake_premios FROM PUBLIC,anon,authenticated;
CREATE TABLE IF NOT EXISTS private.handshake_sessoes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
 criado timestamptz NOT NULL DEFAULT clock_timestamp(),
 desafios jsonb NOT NULL,
 concluido boolean NOT NULL DEFAULT false
);
ALTER TABLE private.handshake_sessoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.handshake_sessoes FROM PUBLIC,anon,authenticated;
CREATE INDEX IF NOT EXISTS handshake_sessoes_por_conta ON private.handshake_sessoes(user_id,criado DESC);
CREATE TABLE IF NOT EXISTS private.handshake_resultados (
 user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
 dia date NOT NULL, acertos integer NOT NULL DEFAULT 0, pontos integer NOT NULL DEFAULT 0,
 PRIMARY KEY(user_id,dia)
);
ALTER TABLE private.handshake_resultados ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.handshake_resultados FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.handshake_estado()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_p public.handshake_premios%ROWTYPE;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT * INTO v_p FROM public.handshake_premios WHERE user_id=v_id AND dia=v_dia;
 IF NOT FOUND THEN RETURN json_build_object('ok',true,'entregue',false); END IF;
 RETURN json_build_object('ok',true,'entregue',true,'dia',v_p.dia,'tipo',v_p.tipo,'item',v_p.item,'pontos',v_p.pontos);
END $$;

CREATE OR REPLACE FUNCTION public.handshake_iniciar()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_bloqueado boolean; v_r integer; v_i integer; v_n integer; v_pres integer;
 v_usados integer[]; v_fila jsonb; v_todos jsonb:='[]'::jsonb; v_sessao uuid;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 IF EXISTS(SELECT 1 FROM public.handshake_premios WHERE user_id=v_id AND dia=v_dia)
 THEN RETURN json_build_object('ok',false,'erro','hoje'); END IF;
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

-- A antiga função aceita um p_pontos arbitrário: removê-la é condição de segurança.
DROP FUNCTION IF EXISTS public.handshake_premio(integer);
CREATE OR REPLACE FUNCTION public.handshake_premio(p_sessao uuid,p_respostas jsonb)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE
 v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_bloqueado boolean; v_s private.handshake_sessoes%ROWTYPE;
 v_ant public.handshake_premios%ROWTYPE; v_a jsonb;
 v_r integer; v_origem integer; v_idx integer; v_resp integer; v_rest integer; v_verd integer;
 v_super boolean; v_vistos text[]:=ARRAY[]::text[]; v_chave text;
 v_ultimo integer:=0; v_combo integer:=0; v_pontos integer:=0; v_acertos integer:=0; v_base integer;
 v_tipo text; v_item text:=''; v_saldo integer;
 v_itens text[]:=ARRAY['gyoza','dango','redvelvet','tiramisu','espuma'];
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT * INTO v_ant FROM public.handshake_premios WHERE user_id=v_id AND dia=v_dia;
 IF FOUND THEN RETURN json_build_object('ok',true,'repetido',true,'dia',v_ant.dia,
  'tipo',v_ant.tipo,'item',v_ant.item,'pontos',v_ant.pontos); END IF;
 SELECT * INTO v_s FROM private.handshake_sessoes WHERE id=p_sessao AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 IF v_s.concluido OR v_s.criado<clock_timestamp()-interval '25 minutes'
    OR v_s.criado>clock_timestamp()-interval '9 seconds'
    OR jsonb_typeof(p_respostas) IS DISTINCT FROM 'array'
    OR coalesce(pg_column_size(p_respostas),0)>12000
 THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 IF jsonb_array_length(p_respostas) NOT BETWEEN 1 AND 30
 THEN RETURN json_build_object('ok',false,'erro','respostas'); END IF;
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
     v_acertos:=v_acertos+1;v_combo:=v_combo+1;
     v_base:=100+floor(v_rest*.08+.5)::integer+v_r*10
       +CASE WHEN v_super THEN 150 ELSE 0 END;
     v_pontos:=v_pontos+floor(v_base*(1+least(v_combo-1,10)*.1)+.5)::integer;
   ELSE v_combo:=0; END IF;
 END LOOP;
 UPDATE private.handshake_sessoes SET concluido=true WHERE id=v_s.id;
 INSERT INTO private.handshake_resultados(user_id,dia,acertos,pontos)
 VALUES(v_id,v_dia,v_acertos,v_pontos)
 ON CONFLICT(user_id,dia) DO UPDATE SET
 acertos=greatest(private.handshake_resultados.acertos,EXCLUDED.acertos),
 pontos=greatest(private.handshake_resultados.pontos,EXCLUDED.pontos);
 IF v_pontos<600 THEN RETURN json_build_object('ok',false,'erro','pontos',
    'pontos_verificados',v_pontos,'missao',v_acertos>0); END IF;
 v_tipo:=CASE WHEN random()<.4 THEN 'ticket' ELSE 'pet' END;
 IF v_tipo='pet' THEN v_item:=v_itens[1+floor(random()*array_length(v_itens,1))::integer]; END IF;
 INSERT INTO public.handshake_premios(user_id,dia,pontos,tipo,item)
 VALUES(v_id,v_dia,v_pontos,v_tipo,v_item);
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
 RETURN json_build_object('ok',true,'repetido',false,'dia',v_dia,
  'pontos',v_pontos,'tipo',v_tipo,'item',v_item,'tickets',v_saldo);
END $$;
REVOKE ALL ON FUNCTION public.handshake_estado() FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.handshake_iniciar() FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.handshake_premio(uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.handshake_estado() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handshake_iniciar() TO authenticated;
GRANT EXECUTE ON FUNCTION public.handshake_premio(uuid,jsonb) TO authenticated;
COMMIT;
