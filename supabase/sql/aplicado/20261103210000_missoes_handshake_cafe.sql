-- APLICADO no Supabase de produção em 03/11/2026.
-- Histórico: 20261103190704 missoes_handshake_cafe_validadas_20261103.
-- Fonte: supabase/sql/proposta/20261103210000_missoes_handshake_cafe.sql (PR #71).
CREATE TABLE IF NOT EXISTS private.cafe_sessoes (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
 criado timestamptz NOT NULL DEFAULT clock_timestamp(),
 pedido jsonb NOT NULL, concluido boolean NOT NULL DEFAULT false
);
ALTER TABLE private.cafe_sessoes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.cafe_sessoes FROM PUBLIC,anon,authenticated;
CREATE INDEX IF NOT EXISTS cafe_sessoes_por_conta ON private.cafe_sessoes(user_id,criado DESC);
CREATE TABLE IF NOT EXISTS private.cafe_resultados (
 user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
 dia date NOT NULL, criado timestamptz NOT NULL DEFAULT clock_timestamp(),
 PRIMARY KEY(user_id,dia)
);
ALTER TABLE private.cafe_resultados ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.cafe_resultados FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.cafe_iniciar()
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_bloqueado boolean; v_sessao uuid;
 v_pedido jsonb; v_base integer; v_cob integer; v_enf integer;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 IF (SELECT count(*) FROM private.cafe_sessoes WHERE user_id=v_id AND criado > now()-interval '1 day')>=30
 THEN RETURN json_build_object('ok',false,'erro','limite'); END IF;
 v_base:=floor(random()*5)::integer;
 v_cob:=CASE WHEN random()<.4 THEN floor(random()*3)::integer ELSE -1 END;
 v_enf:=floor(random()*4)::integer;
 v_pedido:=jsonb_build_object('base',v_base,'cob',v_cob,'enf',v_enf,'doce',-1);
 INSERT INTO private.cafe_sessoes(user_id,pedido) VALUES(v_id,v_pedido) RETURNING id INTO v_sessao;
 RETURN json_build_object('ok',true,'sessao',v_sessao,'pedido',v_pedido);
END $$;

CREATE OR REPLACE FUNCTION public.cafe_concluir(p_sessao uuid,p_monta jsonb)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_bloqueado boolean; v_s private.cafe_sessoes%ROWTYPE; v_correto boolean;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 SELECT * INTO v_s FROM private.cafe_sessoes WHERE id=p_sessao AND user_id=v_id FOR UPDATE;
 IF NOT FOUND THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 IF v_s.concluido THEN
   RETURN json_build_object('ok',true,'confirmado',
     EXISTS(SELECT 1 FROM private.cafe_resultados WHERE user_id=v_id AND dia=v_dia));
 END IF;
 IF v_s.criado<clock_timestamp()-interval '20 minutes'
    OR v_s.criado>clock_timestamp()-interval '3 seconds'
    OR jsonb_typeof(p_monta) IS DISTINCT FROM 'object'
 THEN RETURN json_build_object('ok',false,'erro','sessao'); END IF;
 v_correto:=(p_monta->>'base')=(v_s.pedido->>'base')
       AND (p_monta->>'cob')=(v_s.pedido->>'cob')
       AND (p_monta->>'enf')=(v_s.pedido->>'enf')
       AND (p_monta->>'doce')=(v_s.pedido->>'doce');
 UPDATE private.cafe_sessoes SET concluido=true WHERE id=v_s.id;
 IF v_correto THEN
   INSERT INTO private.cafe_resultados(user_id,dia) VALUES(v_id,v_dia)
     ON CONFLICT(user_id,dia) DO NOTHING;
 END IF;
 RETURN json_build_object('ok',true,'confirmado',coalesce(v_correto,false));
END $$;
REVOKE ALL ON FUNCTION public.cafe_iniciar() FROM PUBLIC,anon;
REVOKE ALL ON FUNCTION public.cafe_concluir(uuid,jsonb) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.cafe_iniciar() TO authenticated;
GRANT EXECUTE ON FUNCTION public.cafe_concluir(uuid,jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.missoes_lista()
RETURNS TABLE(k text,nivel integer,meta integer,premio integer,fam text)
LANGUAGE sql IMMUTABLE SET search_path TO '' AS $$
  SELECT * FROM (VALUES
   ('corra2',1,2,10,'corrida'),('coracao',1,1,10,'coracao'),('recado',1,1,10,'recado'),
   ('mini',1,1,10,'mini'),('pet',1,1,10,'pet'),
   ('handshake',1,1,10,'evento'),('cafe',1,1,10,'evento'),
   ('corra3',2,3,15,'corrida'),('estrelas50',2,50,15,'estrela'),
   ('pontos2000',2,2000,15,'ponto'),('tsulipa',2,3,15,'tsulipa'),
   ('corra5',3,5,20,'corrida'),('pontos5000',3,5000,20,'ponto'),
   ('estrelas100',3,100,20,'estrela')
  ) AS v(k,nivel,meta,premio,fam)
$$;

CREATE OR REPLACE FUNCTION public.missoes_progresso(p_id uuid,p_k text,p_dia date)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $$
  WITH l AS (
    SELECT * FROM public.leaderboard WHERE user_id=p_id
      AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date=p_dia
  )
  SELECT (CASE
    WHEN p_k LIKE 'corra%' THEN (SELECT count(*) FROM l)
    WHEN p_k LIKE 'estrelas%' THEN (SELECT coalesce(sum(stars),0) FROM l)
    WHEN p_k LIKE 'pontos%' THEN (SELECT coalesce(max(score),0) FROM l)
    WHEN p_k='tsulipa' THEN (SELECT count(DISTINCT "char") FROM l WHERE "char" IN('Tsu','Lirika','Pati'))
    WHEN p_k='coracao' THEN (SELECT count(*) FROM public.coracoes WHERE de=p_id AND dia=p_dia)
    WHEN p_k='recado' THEN (SELECT count(*) FROM public.recados WHERE de=p_id AND dia=p_dia)
    WHEN p_k='mini' THEN (SELECT count(*) FROM public.star_log WHERE user_id=p_id AND reason='minijogo'
      AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date=p_dia)
    WHEN p_k='pet' THEN (SELECT count(*) FROM public.star_log WHERE user_id=p_id AND reason='camarim' AND delta<0
      AND (created_at AT TIME ZONE 'America/Sao_Paulo')::date=p_dia)
    WHEN p_k='collect' THEN (SELECT count(*) FROM public.visitas WHERE user_id=p_id AND dia=p_dia AND k='collect')
    WHEN p_k='duo' THEN (SELECT count(*) FROM public.duo_log WHERE de=p_id AND dia=p_dia)
    WHEN p_k='handshake' THEN (SELECT count(*) FROM private.handshake_resultados
       WHERE user_id=p_id AND dia=p_dia AND acertos>=1)
    WHEN p_k='cafe' THEN (SELECT count(*) FROM private.cafe_resultados WHERE user_id=p_id AND dia=p_dia)
    ELSE 0 END)::integer
$$;
CREATE OR REPLACE FUNCTION public.marcar_visita(p_k text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
BEGIN
 IF v_id IS NULL OR p_k NOT IN ('collect','handshake','cafe')
 THEN RETURN json_build_object('ok',false,'erro','chave'); END IF;
 IF EXISTS(SELECT 1 FROM public.players WHERE id=v_id AND coalesce(bloqueado,false))
 THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 IF p_k='handshake' AND NOT EXISTS(
   SELECT 1 FROM private.handshake_resultados
    WHERE user_id=v_id AND dia=v_dia AND acertos>=1)
 THEN RETURN json_build_object('ok',false,'erro','prova'); END IF;
 IF p_k='cafe' AND NOT EXISTS(
   SELECT 1 FROM private.cafe_resultados WHERE user_id=v_id AND dia=v_dia)
 THEN RETURN json_build_object('ok',false,'erro','prova'); END IF;
 INSERT INTO public.visitas(user_id,dia,k) VALUES(v_id,v_dia,p_k) ON CONFLICT DO NOTHING;
 RETURN json_build_object('ok',true,'k',p_k);
END $function$;
-- As chaves novas só são marcadas após os resultados privados comprovados.
