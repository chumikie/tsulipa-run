-- Arena dos Idols (v2): verificações no PostgreSQL descartável (roda depois de checks_ranking.sql).
do $tests$
declare
 a uuid:='00000000-0000-0000-0000-00000000000a';
 b uuid:='00000000-0000-0000-0000-00000000000b';
 c uuid:='00000000-0000-0000-0000-00000000000c';
 d uuid:='00000000-0000-0000-0000-00000000000d';
 e uuid:='00000000-0000-0000-0000-00000000000e';
 r jsonb; r2 jsonb; n integer; estrelas bigint; logs bigint; fas integer;
begin
 insert into public.players(id,nick,stars,best,centers_total,dias_jogados,avatar)
   values(e,'Eva',10,900,1,1,'{"c":{}}');
 update private.dia_teste set dia='2026-11-16';
 select sum(stars) into estrelas from public.players;
 select count(*) into logs from public.star_log;

 if has_function_privilege('anon','public.battle_arena()','execute')
   or has_function_privilege('anon','public.battle_unit_salvar(jsonb)','execute')
   or has_function_privilege('anon','public.battle_desafiar(text,jsonb,uuid)','execute') then
   raise exception 'anon não pode usar a arena'; end if;
 if has_function_privilege('authenticated','private.battle_unit_resolver(uuid,jsonb)','execute') then
   raise exception 'resolver privado exposto'; end if;
 if not has_function_privilege('authenticated','public.battle_desafiar(text,jsonb,uuid)','execute') then
   raise exception 'authenticated precisa desafiar'; end if;
 perform set_config('request.jwt.claim.sub','',true);
 if public.battle_arena()->>'erro'<>'sem_conta' or public.battle_unit_salvar('["Tsu","Lirika","Pati"]')->>'erro'<>'sem_conta'
   then raise exception 'sem login'; end if;

 -- salvar: posse real, repetidos, inventados, formato
 perform set_config('request.jwt.claim.sub',a::text,true);
 if public.battle_unit_salvar('["Bia","Bia","Duda"]')->>'erro'<>'unit' then raise exception 'repetido aceito'; end if;
 if public.battle_unit_salvar('["Hacker","Cecilia","Duda"]')->>'erro'<>'unit' then raise exception 'inventado aceito'; end if;
 if public.battle_unit_salvar('[{"x":1},"Cecilia","Duda"]')->>'erro'<>'unit' then raise exception 'objeto aceito'; end if;
 if public.battle_unit_salvar('["Tsu","Lirika","Pati"]')->>'erro'<>'unit' then raise exception 'starter para quem tem cards'; end if;
 r:=public.battle_unit_salvar('["Duda","Bia","Cecilia"]');
 if r->>'ok'<>'true' or jsonb_array_length(r->'unit')<>3 then raise exception 'salvar A: %',r; end if;
 if (select unit from private.battle_units where player_id=a)<>'["Duda","Bia","Cecilia"]'::jsonb then
   raise exception 'ordem salva errada'; end if;
 -- quem não tem cards usa a unit inicial e não pode salvar cards que não possui
 perform set_config('request.jwt.claim.sub',b::text,true);
 if public.battle_unit_salvar('["Ana","Cecilia","Duda"]')->>'erro'<>'unit' then raise exception 'B sem cards salvou cards'; end if;
 if public.battle_unit_salvar('["tsu","LIRIKA","Pati"]')->>'ok'<>'true' then raise exception 'starter B'; end if;
 perform set_config('request.jwt.claim.sub',c::text,true);
 perform public.battle_unit_salvar('["Pati","Tsu","Lirika"]');
 perform set_config('request.jwt.claim.sub',d::text,true);
 perform public.battle_unit_salvar('["Lirika","Pati","Tsu"]');
 perform set_config('request.jwt.claim.sub',e::text,true);
 perform public.battle_unit_salvar('["Tsu","Pati","Lirika"]');

 -- lista: não mostra a própria unit, esconde a ordem (alfabética) e não expõe ids
 perform set_config('request.jwt.claim.sub',b::text,true);
 r:=public.battle_arena();
 if jsonb_array_length(r->'lista')<>4 or r->'lista' @> '[{"nick":"Bia"}]' then raise exception 'lista de B: %',r; end if;
 if not r->'lista' @> '[{"nick":"Ana","fas":0,"desafiado":false}]' then raise exception 'Ana na lista: %',r; end if;
 if (select string_agg(i->>'nick',',') from jsonb_array_elements(r->'lista') l, jsonb_array_elements(l->'idols') with ordinality t(i,o)
     where l->>'nick'='Ana')<>'Bia,Cecilia,Duda' then raise exception 'ordem da defesa revelada: %',r; end if;
 if r::text like '%0000-0000%' then raise exception 'arena expõe ids: %',r; end if;
 if (r->>'desafios')::int<>0 or (r->>'max_desafios')::int<>3 or r->'minha'->>'fas'<>'0' then raise exception 'estado de B: %',r; end if;

 -- defesa que perdeu um card fica indisponível e some da lista
 delete from public.gacha where user_id=a and valor='Duda';
 if public.battle_arena()->'lista' @> '[{"nick":"Ana"}]' then raise exception 'unit inválida listada'; end if;
 if public.battle_desafiar('Ana','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000201')->>'erro'<>'indisponivel'
   then raise exception 'unit inválida desafiada'; end if;
 insert into public.gacha(user_id,dia,tipo,valor) values(a,'2026-11-03','card','Duda');

 -- desafio: 3 rodadas, sem ★, idempotente, 1 por pessoa por dia
 if public.battle_desafiar('Bia','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000202')->>'erro'<>'alvo' then raise exception 'desafiou a si'; end if;
 if public.battle_desafiar('Ninguem','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000203')->>'erro'<>'alvo' then raise exception 'alvo inexistente'; end if;
 if public.battle_desafiar('Ana','["Ana","Lirika","Pati"]','00000000-0000-0000-0000-000000000204')->>'erro'<>'unit' then raise exception 'unit inválida do desafiante'; end if;
 r:=public.battle_desafiar('ana','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000205');
 if r->>'ok'<>'true' or jsonb_array_length(r->'rodadas')<>3 or (r->>'premio')::int<>0 or r->>'alvo'<>'Ana' then raise exception 'desafio: %',r; end if;
 -- a defesa joga na ordem que ela salvou: Duda (canto), Bia (dança), Cecilia (carisma)
 if r->'rodadas'->0->>'rival'<>'Duda' or r->'rodadas'->1->>'rival'<>'Bia' or r->'rodadas'->2->>'rival'<>'Cecilia' then
   raise exception 'ordem da defesa: %',r; end if;
 r2:=public.battle_desafiar('Ana','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000205');
 if r2<>r then raise exception 'retry não é idempotente'; end if;
 if public.battle_desafiar('Ana','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000206')->>'erro'<>'repetido' then raise exception '2x a mesma pessoa no dia'; end if;
 if (select count(*) from private.battle_desafios where desafiante=b)<>1 then raise exception 'linhas de desafio'; end if;
 select u.fas into fas from private.battle_units u where u.player_id=a;
 if fas<>(case when (r->>'vitoria')::boolean then 0 else 1 end) then raise exception 'fãs da defesa: % com %',fas,r; end if;
 if not public.battle_arena()->'lista' @> '[{"nick":"Ana","desafiado":true}]' then raise exception 'marca de desafiado'; end if;

 -- limite de 3 por dia
 if public.battle_desafiar('Cecilia','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000207')->>'ok'<>'true' then raise exception '2º desafio'; end if;
 if public.battle_desafiar('Duda','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000208')->>'ok'<>'true' then raise exception '3º desafio'; end if;
 if public.battle_desafiar('Eva','["Tsu","Lirika","Pati"]','00000000-0000-0000-0000-000000000209')->>'erro'<>'limite' then raise exception 'limite 3/dia'; end if;
 if (public.battle_arena()->>'desafios')::int<>3 then raise exception 'contagem do dia'; end if;

 -- conta bloqueada: some da lista, não pode ser desafiada nem desafiar
 update public.players set bloqueado=true where id=e;
 perform set_config('request.jwt.claim.sub',a::text,true);
 if public.battle_arena()->'lista' @> '[{"nick":"Eva"}]' then raise exception 'bloqueada listada'; end if;
 if public.battle_desafiar('Eva','["Duda","Bia","Cecilia"]','00000000-0000-0000-0000-000000000210')->>'erro'<>'alvo' then raise exception 'bloqueada desafiada'; end if;
 perform set_config('request.jwt.claim.sub',e::text,true);
 if public.battle_desafiar('Ana','["Tsu","Pati","Lirika"]','00000000-0000-0000-0000-000000000211')->>'erro'<>'sem_conta' then raise exception 'bloqueada desafiou'; end if;
 update public.players set bloqueado=false where id=e;

 -- trocar a unit mantém os fãs; novo dia zera os desafios
 perform set_config('request.jwt.claim.sub',a::text,true);
 r:=public.battle_unit_salvar('["Bia","Cecilia","Duda"]');
 if (r->>'fas')::int<>fas then raise exception 'fãs perdidos ao trocar a unit'; end if;
 update private.dia_teste set dia='2026-11-17';
 perform set_config('request.jwt.claim.sub',b::text,true);
 r:=public.battle_arena();
 if (r->>'desafios')::int<>0 or r->'lista' @> '[{"desafiado":true}]' then raise exception 'novo dia: %',r; end if;

 -- a arena nunca mexe em estrelas
 if (select sum(stars) from public.players)<>estrelas or (select count(*) from public.star_log)<>logs then
   raise exception 'arena alterou estrelas'; end if;
 raise notice 'OK Battle arena: grants, salvar, lista sem ordem/ids, desafio idempotente, limites, fãs, bloqueio, sem ★';
end $tests$;
