-- Exercícios transacionais reais contra postgres:16 descartável (não Supabase de produção).
DO $$
DECLARE
 p1 uuid:='71000000-0000-4000-8000-000000000001';
 p2 uuid:='71000000-0000-4000-8000-000000000002';
 started json; finished json; repeated json; answers jsonb;
 challenges jsonb; sid uuid; premio text; i integer; j integer;
 run_info json; run_id uuid; order_info json; stage json; done json;
 total integer;
BEGIN
 INSERT INTO public.players(id,insignias_jogos) VALUES(p1,ARRAY['veterano']), (p2,'{}');
 PERFORM set_config('request.jwt.claim.sub',p2::text,true);
 IF public.conquista_jogo('jogo_barista')->>'erro' <> 'prova' THEN
   RAISE EXCEPTION 'Barista sem prova foi autorizado';
 END IF;
 PERFORM set_config('request.jwt.claim.sub',p1::text,true);
 started:=public.handshake_iniciar();
 IF started->>'ok' <> 'true' THEN RAISE EXCEPTION 'Handshake não inicia %',started; END IF;
 sid:=(started->>'sessao')::uuid;
 UPDATE private.handshake_sessoes SET criado=clock_timestamp()-interval '12 seconds' WHERE id=sid;
 SELECT desafios INTO challenges FROM private.handshake_sessoes WHERE id=sid;
 answers:='[]'::jsonb;
 FOR i IN 0..2 LOOP
   answers:=answers||jsonb_build_array(jsonb_build_object('rodada',1,'origem',1,
     'indice',i,'resposta',(challenges->0->>i)::integer,'restante',1000,'superfa',false));
 END LOOP;
 finished:=public.handshake_run_finish(sid,answers);
 IF finished->>'ok'<>'true' OR (finished->>'pontos_verificados')::integer<600
 THEN RAISE EXCEPTION 'Premio/score handshake %',finished; END IF;
 premio:=finished->>'tipo';
 repeated:=public.handshake_run_finish(sid,answers);
 IF repeated->>'tipo' IS DISTINCT FROM premio OR repeated->>'repetido'<>'true'
 THEN RAISE EXCEPTION 'Recibo do presente repetido mudou %',repeated; END IF;
 started:=public.handshake_iniciar();
 IF started->>'ok'<>'true' THEN RAISE EXCEPTION 'Prêmio bloqueou nova partida %',started; END IF;
 sid:=(started->>'sessao')::uuid;
 UPDATE private.handshake_sessoes SET criado=clock_timestamp()-interval '12 seconds' WHERE id=sid;
 SELECT desafios INTO challenges FROM private.handshake_sessoes WHERE id=sid;
 answers:='[]'::jsonb;
 FOR i IN 1..4 LOOP
   FOR j IN 0..2 LOOP
     answers:=answers||jsonb_build_array(jsonb_build_object('rodada',i,'origem',i,
       'indice',j,'resposta',(challenges->(i-1)->>j)::integer,'restante',850,'superfa',false));
   END LOOP;
 END LOOP;
 finished:=public.handshake_run_finish(sid,answers);
 IF finished->>'ok'<>'true' OR (finished->>'combo_max')::integer<10
 THEN RAISE EXCEPTION 'Combo/score Handshake não confirmado %',finished; END IF;
 IF (SELECT count(*) FROM public.handshake_premios WHERE user_id=p1)<>1
 THEN RAISE EXCEPTION 'Presente duplicado após segunda partida'; END IF;
 IF (SELECT count(*) FROM private.jogo_partidas WHERE user_id=p1 AND jogo='hand')<>2
 THEN RAISE EXCEPTION 'Histórico Handshake não recebeu as duas partidas'; END IF;
 IF NOT (SELECT 'jogo_memoria'=ANY(insignias_jogos) FROM public.players WHERE id=p1)
 THEN RAISE EXCEPTION 'Insígnia memória não concedida'; END IF;
 IF (SELECT count(*) FROM private.kt_ticket_events WHERE player_id=p1)>1
 THEN RAISE EXCEPTION 'Ticket Handshake duplicado'; END IF;

 run_info:=public.cafe_run_iniciar();
 IF run_info->>'ok'<>'true' THEN RAISE EXCEPTION 'Café não inicia %',run_info; END IF;
 run_id:=(run_info->>'run_id')::uuid;
 FOR i IN 1..12 LOOP
   order_info:=public.cafe_run_pedido(run_id);
   IF order_info->>'ok'<>'true' THEN RAISE EXCEPTION 'Pedido % falhou %',i,order_info; END IF;
   sid:=(order_info->>'sessao')::uuid;
   UPDATE private.cafe_sessoes SET criado=clock_timestamp()-interval '1.5 seconds' WHERE id=sid;
   stage:=public.cafe_run_etapa(sid,(order_info->'pedido')::jsonb,false);
   IF stage->>'ok'<>'true' OR stage->>'certo'<>'true'
   THEN RAISE EXCEPTION 'Etapa % não verificada %',i,stage; END IF;
   IF (stage->>'rodadas')::integer<>i
   THEN RAISE EXCEPTION 'Contagem de rodadas incoerente %',stage; END IF;
 END LOOP;
 done:=public.cafe_run_finalizar(run_id);
 IF done->>'ok'<>'true' OR (done->>'perfeitos')::integer<>12
 THEN RAISE EXCEPTION 'Café não confirmou 12 rodadas %',done; END IF;
 total:=(done->>'pontos_verificados')::integer;
 IF total<1200 OR (done->>'combo_max')::integer<>12
 THEN RAISE EXCEPTION 'Pontuação de tempo/combo incoerente %',done; END IF;
 repeated:=public.cafe_run_finalizar(run_id);
 IF repeated->>'repetido'<>'true' OR (repeated->>'pontos_verificados')::integer<>total
 THEN RAISE EXCEPTION 'Café não idempotente %',repeated; END IF;
 IF (SELECT count(*) FROM private.jogo_partidas WHERE user_id=p1 AND jogo='cafe')<>1
 THEN RAISE EXCEPTION 'Café duplicou histórico'; END IF;
 IF NOT (SELECT 'jogo_barista'=ANY(insignias_jogos) FROM public.players WHERE id=p1)
 THEN RAISE EXCEPTION 'Insígnia Barista não concedida'; END IF;
 IF (SELECT count(*) FROM private.cafe_resultados WHERE user_id=p1)<>1
 THEN RAISE EXCEPTION 'Missão diária Café não registrada'; END IF;
 FOR i IN 0..4 LOOP
   FOR j IN 0..3 LOOP
     INSERT INTO private.cafe_receitas_comprovadas(user_id,base,enf)
     VALUES(p1,i,j) ON CONFLICT DO NOTHING;
   END LOOP;
 END LOOP;
 IF public.conquista_jogo('jogo_caderno')->>'ok'<>'true'
 THEN RAISE EXCEPTION 'Caderno com 20 provas não concedido'; END IF;
 IF NOT (SELECT insignias_jogos@>ARRAY['veterano','jogo_memoria','jogo_barista','jogo_caderno']
         FROM public.players WHERE id=p1)
 THEN RAISE EXCEPTION 'Insígnias anteriores foram alteradas ou conquistas faltam'; END IF;
 IF (SELECT stars FROM public.players WHERE id=p1)<>100
 THEN RAISE EXCEPTION 'Estrelas alteradas indevidamente'; END IF;
 FOR i IN 1..50 LOOP
   PERFORM private.jogo_registrar(p1,'hand',gen_random_uuid(),
     CASE WHEN i<=5 THEN 20000-i ELSE i END,0,0);
 END LOOP;
 IF (SELECT count(*) FROM private.jogo_partidas WHERE user_id=p1 AND jogo='hand')<>10
 THEN RAISE EXCEPTION 'Retenção não limitou a união top5+recent5 a 10'; END IF;
 IF (SELECT maior_geral FROM private.jogo_maximos WHERE user_id=p1 AND jogo='hand')<>19999
 THEN RAISE EXCEPTION 'Melhor pontuação de sempre perdida'; END IF;
 IF (SELECT count(*) FROM private.jogo_partidas WHERE user_id=p2)<>0
 THEN RAISE EXCEPTION 'Pontuação vazou para outra conta'; END IF;
 RAISE NOTICE 'PR71 PG OK: prêmio único, idempotência, 12 pedidos, tempo, combo, 3 insígnias, 50 partidas e retenção';
END $$;

DO $$
BEGIN
 IF has_function_privilege('anon','public.conquista_jogo(text)','EXECUTE')
 OR has_function_privilege('anon','public.meus_recordes_jogo(text)','EXECUTE')
 OR has_function_privilege('anon','public.cafe_run_finalizar(uuid)','EXECUTE')
 THEN RAISE EXCEPTION 'RPC privada exposta ao papel anon'; END IF;
 IF NOT has_function_privilege('authenticated','public.conquista_jogo(text)','EXECUTE')
 OR NOT has_function_privilege('authenticated','public.meus_recordes_jogo(text)','EXECUTE')
 THEN RAISE EXCEPTION 'RPC não acessível ao papel autenticado'; END IF;
END $$;
