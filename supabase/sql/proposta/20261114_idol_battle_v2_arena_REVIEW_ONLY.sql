-- Idol⭐Battle! v2 — Arena dos Idols (units salvas + desafio assíncrono). REVISÃO SOMENTE.
-- NÃO EXECUTAR NO SUPABASE SEM AUTORIZAÇÃO DO DONO.
-- Cada pessoa pode deixar UMA unit salva na arena; os outros desafiam essa unit sem ninguém
-- precisar estar online. Vale a glória: NÃO dá ★, não gasta cards e não mexe no rival do dia.
-- Quem defende ganha 1 "fã da arena" (❤️, só um contador) a cada defesa vencida.
-- Limites: 3 desafios por dia e 1 por pessoa por dia. Não altera nenhuma função já aplicada.
-- Requisitos (já em produção): public.players, private.cards_qtd(uuid,text),
-- private.battle_atributos(uuid), public.hoje_br().

create table if not exists private.battle_units (
  player_id uuid primary key references public.players(id) on delete cascade,
  unit jsonb not null,                       -- 3 nomes, na ordem Canto/Dança/Carisma
  fas integer not null default 0 check (fas>=0),
  atualizado timestamptz not null default now()
);
create table if not exists private.battle_desafios (
  id bigint generated always as identity primary key,
  desafiante uuid not null references public.players(id) on delete cascade,
  alvo uuid not null references public.players(id) on delete cascade,
  dia date not null,
  requisicao uuid not null,
  unit jsonb not null,
  resultado jsonb not null,
  vitoria boolean not null,
  criado timestamptz not null default now(),
  unique (desafiante,requisicao),
  unique (desafiante,alvo,dia),
  check (desafiante<>alvo)
);
create index if not exists battle_desafios_alvo_idx on private.battle_desafios(alvo);
alter table private.battle_units enable row level security;
alter table private.battle_desafios enable row level security;
revoke all on private.battle_units from public, anon, authenticated;
revoke all on private.battle_desafios from public, anon, authenticated;

-- Confere uma unit de p_dono e devolve os 3 Idols com atributos (mesma regra do v1:
-- posse do card, unit inicial para quem tem menos de 3 cards, bônus de repetidos).
-- Devolve NULL se a unit não for válida AGORA (ex.: o card foi trocado depois de salvar).
create or replace function private.battle_unit_resolver(p_dono uuid, p_unit jsonb) returns jsonb
language plpgsql stable security definer set search_path to ''
as $fn$
declare
 v_qtd integer; v_starter boolean; v_i integer; v_nick text; v_card public.players;
 v_a jsonb; v_c int; v_d int; v_ch int; v_n int; v_boost int; v_out jsonb:='[]'::jsonb;
begin
 if p_dono is null or p_unit is null or jsonb_typeof(p_unit)<>'array'
   or jsonb_array_length(p_unit)<>3 then return null; end if;
 for v_i in 0..2 loop
   if jsonb_typeof(p_unit->v_i)<>'string' then return null; end if;
 end loop;
 if (select count(distinct lower(btrim(x.value))) from jsonb_array_elements_text(p_unit) x)<>3
   then return null; end if;
 select count(*) into v_qtd from public.players p
   where p.avatar is not null and not coalesce(p.bloqueado,false)
     and private.cards_qtd(p_dono,lower(btrim(p.nick)))>0;
 v_starter:=v_qtd<3;
 for v_i in 0..2 loop
   v_nick:=btrim(p_unit->>v_i);
   if v_nick is null or v_nick='' or length(v_nick)>48 then return null; end if;
   if v_starter then
     if lower(v_nick) not in ('tsu','lirika','pati') then return null; end if;
     v_out:=v_out||jsonb_build_array(jsonb_build_object(
       'nick',initcap(lower(v_nick)),'canto',5,'danca',5,'carisma',5));
   else
     select * into v_card from public.players
       where lower(btrim(nick))=lower(v_nick) and avatar is not null
       and not coalesce(bloqueado,false);
     if not found then return null; end if;
     v_n:=private.cards_qtd(p_dono,lower(v_nick));
     if v_n<1 then return null; end if;
     v_a:=private.battle_atributos(v_card.id);
     v_boost:=least(2,greatest(0,v_n-1));
     v_c:=(v_a->>'canto')::int;v_d:=(v_a->>'danca')::int;v_ch:=(v_a->>'carisma')::int;
     if v_c>=v_d and v_c>=v_ch then v_a:=jsonb_set(v_a,'{canto}',to_jsonb(least(10,v_c+v_boost)));
     elsif v_d>=v_ch then v_a:=jsonb_set(v_a,'{danca}',to_jsonb(least(10,v_d+v_boost)));
     else v_a:=jsonb_set(v_a,'{carisma}',to_jsonb(least(10,v_ch+v_boost))); end if;
     v_out:=v_out||jsonb_build_array(jsonb_build_object('nick',v_card.nick)||v_a);
   end if;
 end loop;
 return v_out;
end $fn$;

-- Salva (ou troca) a unit que fica na arena. Os fãs já conquistados continuam.
create or replace function public.battle_unit_salvar(p_unit jsonb) returns jsonb
language plpgsql volatile security definer set search_path to ''
as $fn$
declare v_uid uuid:=auth.uid(); v_res jsonb; v_fas integer;
begin
 if v_uid is null or not exists(select 1 from public.players p
   where p.id=v_uid and not coalesce(p.bloqueado,false) and p.nick is not null)
   then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 v_res:=private.battle_unit_resolver(v_uid,p_unit);
 if v_res is null then return jsonb_build_object('ok',false,'erro','unit'); end if;
 insert into private.battle_units(player_id,unit)
   values(v_uid,(select jsonb_agg(e->>'nick' order by o) from jsonb_array_elements(v_res) with ordinality t(e,o)))
 on conflict (player_id) do update set unit=excluded.unit,atualizado=now()
 returning fas into v_fas;
 return jsonb_build_object('ok',true,'unit',v_res,'fas',v_fas);
end $fn$;

-- Lista da arena: até 12 units de outras pessoas (mesma seleção do dia para quem olha),
-- com os 3 Idols em ordem alfabética para NÃO revelar em que rodada cada um entra.
create or replace function public.battle_arena() returns jsonb
language plpgsql stable security definer set search_path to ''
as $fn$
declare v_uid uuid:=auth.uid(); v_dia date:=public.hoje_br();
 v_lista jsonb; v_minha jsonb; v_feitos integer;
begin
 if v_uid is null or not exists(select 1 from public.players p
   where p.id=v_uid and not coalesce(p.bloqueado,false))
   then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 select coalesce(jsonb_agg(x.obj order by x.ordem),'[]'::jsonb) into v_lista from (
   select jsonb_build_object('nick',p.nick,'fas',u.fas,
       'desafiado',exists(select 1 from private.battle_desafios d
          where d.desafiante=v_uid and d.alvo=p.id and d.dia=v_dia),
       'idols',(select jsonb_agg(e order by lower(e->>'nick')) from jsonb_array_elements(r.res) e)) as obj,
     md5(p.id::text||v_dia::text) as ordem
   from private.battle_units u
   join public.players p on p.id=u.player_id
   cross join lateral (select private.battle_unit_resolver(u.player_id,u.unit) as res) r
   where p.id<>v_uid and not coalesce(p.bloqueado,false) and p.nick is not null
     and r.res is not null
   order by md5(p.id::text||v_dia::text) limit 12
 ) x;
 select jsonb_build_object('fas',u.fas,'unit',private.battle_unit_resolver(u.player_id,u.unit))
   into v_minha from private.battle_units u where u.player_id=v_uid;
 select count(*) into v_feitos from private.battle_desafios
   where desafiante=v_uid and dia=v_dia;
 return jsonb_build_object('ok',true,'dia',v_dia,'max_desafios',3,'desafios',v_feitos,
   'minha',v_minha,'lista',v_lista);
end $fn$;

-- Desafia a unit salva de p_alvo (nick). O cliente envia só o nick, a própria unit e o
-- UUID de idempotência; atributos, ordem da defesa e sorte são do servidor. Sem ★.
create or replace function public.battle_desafiar(p_alvo text, p_unit jsonb, p_requisicao uuid)
returns jsonb language plpgsql volatile security definer set search_path to ''
as $fn$
declare
 v_uid uuid:=auth.uid(); v_p public.players; v_dia date:=public.hoje_br();
 v_ja jsonb; v_feitos integer; v_alvo public.players; v_u private.battle_units;
 v_meu jsonb; v_deles jsonb; v_i integer; v_k text; v_eu int; v_eles int; v_sorte int;
 v_venceu boolean; v_vitorias int:=0; v_rodadas jsonb:='[]'::jsonb; v_result jsonb;
begin
 if v_uid is null then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 if p_requisicao is null or p_alvo is null or length(p_alvo)>48 then
   return jsonb_build_object('ok',false,'erro','alvo'); end if;
 -- A linha do desafiante travada protege o limite diário contra cliques simultâneos.
 select * into v_p from public.players
   where id=v_uid and not coalesce(bloqueado,false) for update;
 if not found then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 select resultado into v_ja from private.battle_desafios
   where desafiante=v_uid and requisicao=p_requisicao;
 if found then return v_ja; end if;
 select count(*) into v_feitos from private.battle_desafios
   where desafiante=v_uid and dia=v_dia;
 if v_feitos>=3 then return jsonb_build_object('ok',false,'erro','limite'); end if;
 select * into v_alvo from public.players
   where lower(btrim(nick))=lower(btrim(p_alvo)) and not coalesce(bloqueado,false);
 if not found or v_alvo.id=v_uid then return jsonb_build_object('ok',false,'erro','alvo'); end if;
 -- Trava a unit da defesa: o contador de fãs não se perde com desafios simultâneos.
 select * into v_u from private.battle_units where player_id=v_alvo.id for update;
 if not found then return jsonb_build_object('ok',false,'erro','alvo'); end if;
 if exists(select 1 from private.battle_desafios
   where desafiante=v_uid and alvo=v_alvo.id and dia=v_dia) then
   return jsonb_build_object('ok',false,'erro','repetido'); end if;
 v_meu:=private.battle_unit_resolver(v_uid,p_unit);
 if v_meu is null then return jsonb_build_object('ok',false,'erro','unit'); end if;
 v_deles:=private.battle_unit_resolver(v_alvo.id,v_u.unit);
 if v_deles is null then return jsonb_build_object('ok',false,'erro','indisponivel'); end if;
 for v_i in 0..2 loop
   v_k:=(array['canto','danca','carisma'])[v_i+1];
   v_eles:=(v_deles->v_i->>v_k)::int;
   -- "Dia bom/dia ruim": ±1 sorteado no servidor, só para quem desafia; empate é da defesa.
   v_sorte:=floor(random()*3)::int-1;
   v_eu:=greatest(1,least(11,(v_meu->v_i->>v_k)::int+v_sorte));
   v_venceu:=v_eu>v_eles;
   if v_venceu then v_vitorias:=v_vitorias+1; end if;
   v_rodadas:=v_rodadas||jsonb_build_array(jsonb_build_object('tipo',v_k,
     'meu',v_meu->v_i->>'nick','rival',v_deles->v_i->>'nick','eu',v_eu,'eles',v_eles,'ganhou',v_venceu));
 end loop;
 if v_vitorias<2 then
   update private.battle_units set fas=fas+1 where player_id=v_alvo.id;
 end if;
 v_result:=jsonb_build_object('ok',true,'dia',v_dia,'alvo',v_alvo.nick,'desafios',v_feitos+1,
   'rodadas',v_rodadas,'vitoria',v_vitorias>=2,'premio',0);
 insert into private.battle_desafios(desafiante,alvo,dia,requisicao,unit,resultado,vitoria)
 values(v_uid,v_alvo.id,v_dia,p_requisicao,p_unit,v_result,v_vitorias>=2);
 return v_result;
end $fn$;

revoke all on function private.battle_unit_resolver(uuid,jsonb) from public,anon,authenticated;
revoke all on function public.battle_unit_salvar(jsonb) from public,anon;
revoke all on function public.battle_arena() from public,anon;
revoke all on function public.battle_desafiar(text,jsonb,uuid) from public,anon;
grant execute on function public.battle_unit_salvar(jsonb) to authenticated;
grant execute on function public.battle_arena() to authenticated;
grant execute on function public.battle_desafiar(text,jsonb,uuid) to authenticated;
