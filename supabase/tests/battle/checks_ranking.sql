-- Top da Arena: verificações no PostgreSQL descartável (roda depois de checks.sql).
do $tests$
declare
 a uuid:='00000000-0000-0000-0000-00000000000a';
 b uuid:='00000000-0000-0000-0000-00000000000b';
 c uuid:='00000000-0000-0000-0000-00000000000c';
 d uuid:='00000000-0000-0000-0000-00000000000d';
 r jsonb; i integer;
begin
 if has_function_privilege('anon','public.battle_ranking()','execute') then
   raise exception 'anon não pode ler o ranking'; end if;
 if not has_function_privilege('authenticated','public.battle_ranking()','execute') then
   raise exception 'authenticated precisa ler o ranking'; end if;
 -- placar controlado: semana de domingo 08/11 a sábado 14/11
 delete from private.battle_partidas;
 for i in 1..3 loop  -- C: 3 vitórias em 3 partidas (quinta 12/11)
   insert into private.battle_partidas(player_id,dia,tentativa,requisicao,unit,resultado,vitoria,premio)
   values(c,'2026-11-12',i,gen_random_uuid(),'[]','{}',true,0); end loop;
 for i in 1..5 loop  -- D: 3 vitórias em 5 partidas (domingo 08/11, primeiro dia da semana)
   insert into private.battle_partidas(player_id,dia,tentativa,requisicao,unit,resultado,vitoria,premio)
   values(d,'2026-11-08',i,gen_random_uuid(),'[]','{}',i<=3,0); end loop;
 for i in 1..4 loop  -- B: 4 vitórias, mas no sábado ANTERIOR (07/11): fora da semana
   insert into private.battle_partidas(player_id,dia,tentativa,requisicao,unit,resultado,vitoria,premio)
   values(b,'2026-11-07',i,gen_random_uuid(),'[]','{}',true,0); end loop;
 insert into private.battle_partidas(player_id,dia,tentativa,requisicao,unit,resultado,vitoria,premio)
   values(a,'2026-11-13',1,gen_random_uuid(),'[]','{}',false,0);  -- A: só derrota

 update private.dia_teste set dia='2026-11-14';
 perform set_config('request.jwt.claim.sub',c::text,true);
 r:=public.battle_ranking();
 if r->>'inicio'<>'2026-11-08' then raise exception 'semana deve começar no domingo: %',r; end if;
 if jsonb_array_length(r->'top')<>2 then raise exception 'top deve ter C e D: %',r; end if;
 if r->'top'->0->>'nick'<>'Cecilia' or r->'top'->1->>'nick'<>'Duda' then
   raise exception 'desempate por menos partidas: %',r; end if;
 if (r->'top'->0->>'score')::int<>3 or (r->'top'->1->>'partidas')::int<>5 then raise exception 'contagem: %',r; end if;
 if (r->'eu'->>'pos')::int<>1 then raise exception 'minha posição: %',r; end if;
 if r::text like '%0000-0000%' then raise exception 'ranking não pode expor ids: %',r; end if;

 perform set_config('request.jwt.claim.sub',a::text,true);
 r:=public.battle_ranking();
 if r->'eu'<>'null'::jsonb and r->'eu' is not null then raise exception 'sem vitória não entra: %',r; end if;

 -- conta bloqueada some do ranking
 update public.players set bloqueado=true where id=c;
 r:=public.battle_ranking();
 if jsonb_array_length(r->'top')<>1 or r->'top'->0->>'nick'<>'Duda' or (r->'top'->0->>'pos')::int<>1 then
   raise exception 'bloqueada continua no ranking: %',r; end if;
 update public.players set bloqueado=false where id=c;

 -- domingo seguinte: semana nova, ranking vazio
 update private.dia_teste set dia='2026-11-15';
 r:=public.battle_ranking();
 if r->>'inicio'<>'2026-11-15' or jsonb_array_length(r->'top')<>0 then raise exception 'semana nova deve zerar: %',r; end if;
 raise notice 'OK Battle ranking: grants, semana de domingo, desempate, minha posição, bloqueio, sem ids';
end $tests$;
