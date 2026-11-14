-- Torcida de flores (v3): verificações no PostgreSQL descartável (roda depois de checks_arena.sql).
do $tests$
declare
 a uuid:='00000000-0000-0000-0000-00000000000a';
 b uuid:='00000000-0000-0000-0000-00000000000b';
 e uuid:='00000000-0000-0000-0000-00000000000e';
 r jsonb; estrelas bigint; logs bigint; i integer; com integer:=0; sem integer:=0;
begin
 update private.dia_teste set dia='2026-11-18';
 select sum(stars) into estrelas from public.players;
 select count(*) into logs from public.star_log;
 if has_function_privilege('anon','public.battle_torcida()','execute')
   or has_function_privilege('anon','public.battle_torcida_levar(text)','execute')
   or has_function_privilege('authenticated','private.battle_torcida_bonus(text,integer)','execute') then
   raise exception 'grants da torcida'; end if;
 if has_function_privilege('anon','public.battle_jogar(jsonb,uuid)','execute')
   or not has_function_privilege('authenticated','public.battle_jogar(jsonb,uuid)','execute')
   or has_function_privilege('anon','public.battle_desafiar(text,jsonb,uuid)','execute') then
   raise exception 'grants das funções substituídas'; end if;
 -- tabela do bônus
 if private.battle_torcida_bonus('sakura',0)<>1 or private.battle_torcida_bonus('sakura',1)<>0
   or private.battle_torcida_bonus('tulipa',1)<>1 or private.battle_torcida_bonus('girassol',2)<>1
   or private.battle_torcida_bonus('girassol',0)<>0 or private.battle_torcida_bonus(null,0)<>0
   or private.battle_torcida_bonus('lunar',0)+private.battle_torcida_bonus('lunar',1)+private.battle_torcida_bonus('lunar',2)<>3
   or private.battle_torcida_bonus('rosa',0)<>0 then raise exception 'tabela do bônus'; end if;

 perform set_config('request.jwt.claim.sub','',true);
 if public.battle_torcida()->>'erro'<>'sem_conta' or public.battle_torcida_levar('sakura')->>'erro'<>'sem_conta' then raise exception 'sem login'; end if;
 perform set_config('request.jwt.claim.sub',a::text,true);
 r:=public.battle_torcida();
 if r->'hoje'<>'null'::jsonb or r->'flores'<>'{}'::jsonb then raise exception 'estado inicial: %',r; end if;
 if public.battle_torcida_levar('sakura')->>'erro'<>'sem_flor' then raise exception 'levou sem ter flor'; end if;
 if public.battle_torcida_levar('rosa')->>'erro'<>'parametros' then raise exception 'flor inventada'; end if;
 -- sem flor: nenhuma rodada tem bônus
 r:=public.battle_jogar('["Bia","Cecilia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000301');
 if r->>'ok'<>'true' or r->'torcida'<>'null'::jsonb or exists(select 1 from jsonb_array_elements(r->'rodadas') x where (x->>'bonus')::int<>0)
   then raise exception 'bônus sem flor: %',r; end if;

 insert into private.jardim_flores(user_id,flor,qtd) values(a,'sakura',2),(a,'lunar',1);
 r:=public.battle_torcida_levar('sakura');
 if r->>'ok'<>'true' or r->>'hoje'<>'sakura' or (r->>'qtd')::int<>1 then raise exception 'levar: %',r; end if;
 if public.battle_torcida_levar('lunar')->>'erro'<>'ja' then raise exception 'duas flores no mesmo dia'; end if;
 if (select qtd from private.jardim_flores where user_id=a and flor='lunar')<>1
   or (select qtd from private.jardim_flores where user_id=a and flor='sakura')<>1 then raise exception 'flor gasta errada'; end if;
 r:=public.battle_torcida();
 if r->>'hoje'<>'sakura' or (r->'flores'->>'sakura')::int<>1 then raise exception 'estado com flor: %',r; end if;

 -- com sakura: +1 só no Canto, no rival do dia e na arena; teto de 11 mantido
 r:=public.battle_jogar('["Bia","Cecilia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000302');
 if r->>'torcida'<>'sakura' or (r->'rodadas'->0->>'bonus')::int<>1 or (r->'rodadas'->1->>'bonus')::int<>0
   or (r->'rodadas'->2->>'bonus')::int<>0 then raise exception 'bônus no rival do dia: %',r; end if;
 if exists(select 1 from jsonb_array_elements(r->'rodadas') x where (x->>'eu')::int not between 1 and 11) then raise exception 'teto: %',r; end if;
 r:=public.battle_desafiar('Eva','["Bia","Cecilia","Duda"]','00000000-0000-0000-0000-000000000303');
 if r->>'ok'<>'true' or r->>'torcida'<>'sakura' or (r->'rodadas'->0->>'bonus')::int<>1 or (r->'rodadas'->2->>'bonus')::int<>0
   or (r->>'premio')::int<>0 then raise exception 'bônus na arena: %',r; end if;
 -- a torcida é de quem levou: B, sem flor, não ganha nada
 perform set_config('request.jwt.claim.sub',b::text,true);
 r:=public.battle_jogar('["Tsu","Lirika","Pati"]'::jsonb,'00000000-0000-0000-0000-000000000304');
 if r->'torcida'<>'null'::jsonb or (r->'rodadas'->0->>'bonus')::int<>0 then raise exception 'torcida vazou para outra conta: %',r; end if;

 -- conta bloqueada não leva flor
 insert into private.jardim_flores(user_id,flor,qtd) values(e,'tulipa',1);
 update public.players set bloqueado=true where id=e;
 perform set_config('request.jwt.claim.sub',e::text,true);
 if public.battle_torcida_levar('tulipa')->>'erro'<>'sem_conta' then raise exception 'bloqueada levou flor'; end if;
 update public.players set bloqueado=false where id=e;

 -- dia seguinte: a torcida acaba, as flores guardadas continuam; flor-lunar vale nas três rodadas
 update private.dia_teste set dia='2026-11-19';
 perform set_config('request.jwt.claim.sub',a::text,true);
 r:=public.battle_torcida();
 if r->'hoje'<>'null'::jsonb or (r->'flores'->>'lunar')::int<>1 then raise exception 'novo dia: %',r; end if;
 if public.battle_torcida_levar('lunar')->>'ok'<>'true' then raise exception 'lunar'; end if;
 r:=public.battle_jogar('["Bia","Cecilia","Duda"]'::jsonb,'00000000-0000-0000-0000-000000000305');
 if (select sum((x->>'bonus')::int) from jsonb_array_elements(r->'rodadas') x)<>3 then raise exception 'lunar nas três: %',r; end if;
 if public.battle_torcida()->'flores' ? 'lunar' then raise exception 'flor-lunar não foi gasta'; end if;

 -- levar flor nunca mexe em estrelas (a única ★ possível aqui é o prêmio normal do rival do dia)
 if (select count(*) from public.star_log where reason<>'battle_rival_dia')<>0 then raise exception 'motivo de ★ novo'; end if;
 if (select sum(stars) from public.players)-estrelas<>5*((select count(*) from public.star_log)-logs) then raise exception 'estrelas fora do prêmio normal'; end if;
 raise notice 'OK Battle torcida: grants, bônus por flor, uma por dia, gasta a flor, só para quem levou, teto, sem ★';
end $tests$;
