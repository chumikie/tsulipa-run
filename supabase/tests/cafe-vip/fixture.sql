-- Réplica mínima para testar o VIP: tabelas usadas por cafe_run_etapa2 + cópia da função de produção (13/11/2026).
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;
create table public.players(id uuid primary key, bloqueado boolean default false);
create table public.star_log(user_id uuid, delta int, reason text);
create function public.conquista_jogo(text) returns void language sql as $$ select $$;
create table private.cafe_runs(id uuid primary key, user_id uuid, rodadas int default 0, vidas int default 3, pontos int default 0,
  combo int default 0, combo_max int default 0, perfeitos int default 0, finalizado timestamptz, ultimo_pedido uuid, criado timestamptz default now());
create table private.cafe_sessoes(id uuid primary key, user_id uuid, pedido jsonb, run_id uuid, etapa int, limite_segundos int,
  criado timestamptz, concluido boolean default false, pontos_verificados int, correto_verificado boolean);
create table private.cafe_resultados(user_id uuid, dia date, primary key(user_id,dia));
create table private.cafe_receitas_comprovadas(user_id uuid, base int, enf int, primary key(user_id,base,enf));
insert into public.players values ('00000000-0000-0000-0000-00000000000a');
insert into private.cafe_runs(id,user_id,rodadas) values ('00000000-0000-0000-0000-0000000000f5','00000000-0000-0000-0000-00000000000a',4);
insert into private.cafe_runs(id,user_id,rodadas) values ('00000000-0000-0000-0000-0000000000f6','00000000-0000-0000-0000-00000000000a',5);
insert into private.cafe_sessoes(id,user_id,pedido,run_id,etapa,limite_segundos,criado) values
 ('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-00000000000a','{"base":1,"cob":-1,"enf":2,"doce":-1}','00000000-0000-0000-0000-0000000000f5',5,20,now()-interval '21 seconds'),
 ('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-00000000000a','{"base":1,"cob":-1,"enf":2,"doce":-1}','00000000-0000-0000-0000-0000000000f6',6,20,now()-interval '21 seconds');
CREATE OR REPLACE FUNCTION public.cafe_run_etapa(p_sessao uuid, p_monta jsonb, p_saiu boolean) RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE v_pontos integer:=0;
BEGIN
 IF false THEN
   INSERT INTO private.cafe_resultados(user_id,dia)
   VALUES(null,null);
 END IF;
 RETURN json_build_object('ok',true);
END $function$;
CREATE OR REPLACE FUNCTION public.cafe_run_etapa2(p_sessao uuid, p_monta jsonb, p_saiu boolean)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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
END $function$;
