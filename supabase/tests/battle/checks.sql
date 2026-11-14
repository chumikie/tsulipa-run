-- Verificações feitas exclusivamente no PostgreSQL descartável.
do $tests$
declare
 a uuid:='00000000-0000-0000-0000-00000000000a';
 b uuid:='00000000-0000-0000-0000-00000000000b';
 st jsonb; r jsonb; r2 jsonb; n integer; i integer;
begin
 if (select has_function_privilege('anon','public.battle_jogar(jsonb,uuid)','execute')) then
   raise exception 'anon não pode jogar'; end if;
 if (select has_function_privilege('anon','public.battle_status()','execute')) then
   raise exception 'anon não pode consultar estado'; end if;
 if not has_function_privilege('authenticated','public.battle_jogar(jsonb,uuid)','execute') then
   raise exception 'authenticated precisa jogar'; end if;
 if has_function_privilege('authenticated','private.battle_atributos(uuid)','execute')
   or has_function_privilege('authenticated','private.battle_rival_dia(date)','execute') then
   raise exception 'funções privadas expostas'; end if;
 perform set_config('request.jwt.claim.sub','',true);
 if public.battle_status()->>'erro'<>'sem_conta' then raise exception 'sem login'; end if;
 perform set_config('request.jwt.claim.sub',b::text,true);
 st:=public.battle_status();
 if (st->>'starter')::boolean is not true then raise exception 'unit inicial não aparece'; end if;
 if jsonb_array_length(st->'cards')<>3 then raise exception 'unit inicial incompleta'; end if;
 perform set_config('request.jwt.claim.sub',a::text,true);
 st:=public.battle_status();
 if (st->>'starter')::boolean then raise exception 'cards reais não apareceram'; end if;
 if jsonb_array_length(st->'cards')<>3 then raise exception '3 cards em posse'; end if;
 if jsonb_array_length(st->'rival')<>3 then raise exception '3 rivais'; end if;
 if (select (private.battle_atributos(b)->>'canto')::integer) not between 1 and 10 then
   raise exception 'atributos fora da escala'; end if;
 r:=public.battle_jogar('["Bia","Bia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000010');
 if r->>'erro'<>'unit' then raise exception 'unit duplicada aceita'; end if;
 r:=public.battle_jogar('["Hacker","Cecilia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000011');
 if r->>'erro'<>'sem_card' then raise exception 'card não possuído aceito'; end if;
 r:=public.battle_jogar('["Bia","Cecilia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000012');
 if r->>'ok'<>'true' or jsonb_array_length(r->'rodadas')<>3 then
   raise exception 'partida válida não retorna 3 rodadas: %',r; end if;
 if (select count(distinct x->>'rival') from jsonb_array_elements(r->'rodadas') x)<>3 then
   raise exception 'cada rival deve entrar em exatamente uma rodada: %',r; end if;
 if exists(select 1 from jsonb_array_elements(r->'rodadas') x
   where (x->>'eu')::int not between 1 and 11 or (x->>'eles')::int not between 1 and 10) then
   raise exception 'pontuação fora da escala: %',r; end if;
 r2:=public.battle_jogar('["Bia","Cecilia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000012');
 if r2<>r then raise exception 'retry não é idempotente'; end if;
 if (select count(*) from private.battle_partidas where player_id=a)<>1 then
   raise exception 'retry criou segundo giro'; end if;
 for i in 2..5 loop
   r:=public.battle_jogar('["Duda","Bia","Cecilia"]'::jsonb,
     ('00000000-0000-0000-0000-'||lpad((20+i)::text,12,'0'))::uuid);
   if r->>'ok'<>'true' then raise exception 'partida % falhou: %',i,r; end if;
 end loop;
 if public.battle_jogar('["Bia","Cecilia","Duda"]'::jsonb,
   '00000000-0000-0000-0000-000000000099')->>'erro'<>'limite' then
   raise exception 'limite 5/dia'; end if;
 if (select count(*) from private.battle_partidas where player_id=a)<>5 then
   raise exception 'contagem de tentativas'; end if;
 if (select coalesce(sum(delta),0) from public.star_log where user_id=a) not in (0,5) then
   raise exception 'prêmio duplicado'; end if;
 if (select coalesce(sum(premio),0) from private.battle_partidas where player_id=a)>5 then
   raise exception 'mais de um prêmio por dia'; end if;
 perform set_config('request.jwt.claim.sub',b::text,true);
 r:=public.battle_jogar('["Tsu","Lirika","Pati"]'::jsonb,
  '00000000-0000-0000-0000-000000000111');
 if r->>'ok'<>'true' then raise exception 'starter falhou: %',r; end if;
 -- Conta bloqueada não joga, não consulta e não aparece como card nem rival.
 update public.players set bloqueado=true where id=b;
 if public.battle_status()->>'erro'<>'sem_conta' or
    public.battle_jogar('["Tsu","Lirika","Pati"]'::jsonb,'00000000-0000-0000-0000-000000000112')->>'erro'<>'sem_conta'
   then raise exception 'conta bloqueada jogou'; end if;
 if private.battle_rival_dia('2026-11-14')::text like '%Bia%' then raise exception 'bloqueada virou rival'; end if;
 update public.players set bloqueado=false where id=b;
 perform set_config('request.jwt.claim.sub',a::text,true);
 update private.dia_teste set dia='2026-11-15';
 if public.battle_status()->>'tentativas'<>'0' then raise exception 'limite não resetou'; end if;
 raise notice 'OK Battle: login, cartas reais, starter, rival diário, 5 tentativas, idempotência, grants, ★5';
end $tests$;
