-- APLICADO EM PRODUÇÃO em 13/11/2026 com o OK do dono (migração 20261113_handshake_cor). A 1ª tentativa falhou sem mudar nada (comentário engolia o resto de uma linha); corrigido e reaplicado.
-- Handshake⭐Event! — fãs com dois detalhes: a partir da 3ª rodada cada fã também tem a cor do
-- lightstick (0–5). Lembrar o presente E a cor vale +50. Compatível com a versão antiga do site:
-- a cor é opcional na resposta; sem ela, a pontuação é exatamente a de hoje.
-- handshake_iniciar: reescrita (igual à de produção + sorteio das cores).
-- handshake_run_finish: 3 linhas inseridas na função de produção (lida na hora de aplicar);
-- se algum marcador não existir exatamente uma vez, a migração falha e nada muda.
alter table private.handshake_sessoes add column if not exists cores jsonb;

CREATE OR REPLACE FUNCTION public.handshake_iniciar()
 RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO ''
AS $function$
DECLARE v_id uuid:=auth.uid(); v_dia date:=(now() AT TIME ZONE 'America/Sao_Paulo')::date;
 v_bloqueado boolean; v_r integer; v_i integer; v_n integer; v_pres integer;
 v_usados integer[]; v_fila jsonb; v_todos jsonb:='[]'::jsonb; v_sessao uuid;
 v_cfila jsonb; v_cores jsonb:='[]'::jsonb;
BEGIN
 IF v_id IS NULL THEN RETURN json_build_object('ok',false,'erro','sem_conta'); END IF;
 SELECT coalesce(p.bloqueado,false) INTO v_bloqueado FROM public.players p WHERE p.id=v_id FOR UPDATE;
 IF NOT FOUND OR v_bloqueado THEN RETURN json_build_object('ok',false,'erro','conta'); END IF;
 IF (SELECT count(*) FROM private.handshake_sessoes WHERE user_id=v_id AND criado > now()-interval '1 day') >= 30
 THEN RETURN json_build_object('ok',false,'erro','limite'); END IF;
 FOR v_r IN 1..8 LOOP
   v_n:=least(3+floor((v_r-1)*.8)::integer,6);
   v_usados:=ARRAY[]::integer[]; v_fila:='[]'::jsonb; v_cfila:='[]'::jsonb;
   FOR v_i IN 1..v_n LOOP
     v_pres:=floor(random()*14)::integer;
     WHILE v_pres=ANY(v_usados) LOOP v_pres:=(v_pres+1)%14; END LOOP;
     v_usados:=array_append(v_usados,v_pres);
     v_fila:=v_fila||jsonb_build_array(v_pres);
     IF v_r>=3 THEN v_cfila:=v_cfila||jsonb_build_array(floor(random()*6)::integer); END IF;
   END LOOP;
   v_todos:=v_todos||jsonb_build_array(v_fila);
   v_cores:=v_cores||jsonb_build_array(v_cfila);
 END LOOP;
 INSERT INTO private.handshake_sessoes(user_id,desafios,cores) VALUES(v_id,v_todos,v_cores) RETURNING id INTO v_sessao;
 RETURN json_build_object('ok',true,'sessao',v_sessao,'desafios',v_todos,'cores',v_cores);
END $function$;

do $mig$
declare d text; m1 text; m2 text; m3 text;
  procedure_ text := 'public.handshake_run_finish(uuid,jsonb)';
begin
  d := pg_get_functiondef(procedure_::regprocedure);
  if position('lightstick' in d) > 0 then return; end if;   -- já aplicado
  m1 := ' v_tipo text;';
  m2 := E'   v_rest:=(v_a->>''restante'')::integer;v_super:=(v_a->>''superfa'')::boolean;\n';
  m3 := E'     IF v_verd=v_pres_semana THEN v_pontos:=v_pontos+50; END IF;\n';
  if (length(d)-length(replace(d,m1,'')))/length(m1)<>1 or (length(d)-length(replace(d,m2,'')))/length(m2)<>1
     or (length(d)-length(replace(d,m3,'')))/length(m3)<>1 then
    raise exception 'marcadores do handshake_run_finish mudaram'; end if;
  d := replace(d, m1, ' v_tipo text; v_cor integer; v_vcor integer;');   -- sem comentário: o resto da linha continua valendo
  d := replace(d, m2, m2 || E'   v_cor:=CASE WHEN jsonb_typeof(v_a->''cor'')=''number'' THEN (v_a->>''cor'')::integer END;   -- opcional\n');
  d := replace(d, m3, m3 || E'     v_vcor:=(v_s.cores #>> ARRAY[(v_origem-1)::text,v_idx::text])::integer;\n     IF v_vcor IS NOT NULL AND v_cor=v_vcor THEN v_pontos:=v_pontos+50; END IF;   -- lightstick certo\n');
  execute d;
end $mig$;
