-- APLICADO EM PRODUÇÃO em 14/11/2026 com o OK do dono (migração 20261114_idol_battle_v3_torcida).
-- Idol⭐Battle! v3 — Torcida de flores (Bloom⭐Garden! → Battle).
-- Uma vez por dia você pode levar 1 flor colhida para a torcida. A flor é gasta e dá +1 à sua
-- unit em todas as partidas daquele dia (rival do dia e desafios da arena):
--   🌸 sakura → Canto   🌷 tulipa → Dança   🌻 girassol → Carisma   ⭐ flor-lunar → as três rodadas
-- O teto de 11 pontos por rodada continua; empate continua sendo do rival/da defesa.
-- Não dá ★: é mais um lugar de GASTAR flores (que custam ★ e dias de rega).
-- ATENÇÃO: substitui battle_jogar e battle_desafiar por cópias INTEIRAS das versões aplicadas em
-- 14/11/2026, com 4 mudanças cada: ler a flor do dia, somar o bônus, e devolver 'bonus'/'torcida'.
-- Requisitos (já em produção): private.jardim_flores, e tudo do Battle v1/v2.

create table if not exists private.battle_torcida (
  player_id uuid not null references public.players(id) on delete cascade,
  dia date not null,
  flor text not null check (flor in ('sakura','tulipa','girassol','lunar')),
  criado timestamptz not null default now(),
  primary key (player_id,dia)
);
alter table private.battle_torcida enable row level security;
revoke all on private.battle_torcida from public, anon, authenticated;

-- Bônus da flor na rodada p_i (0 Canto, 1 Dança, 2 Carisma). Sem flor: 0.
create or replace function private.battle_torcida_bonus(p_flor text, p_i integer) returns integer
language sql immutable set search_path to ''
as $fn$
  select case
    when p_flor='lunar' and p_i in (0,1,2) then 1
    when p_flor='sakura' and p_i=0 then 1
    when p_flor='tulipa' and p_i=1 then 1
    when p_flor='girassol' and p_i=2 then 1
    else 0 end
$fn$;

-- Estado da torcida: a flor de hoje (ou null) e as flores guardadas.
create or replace function public.battle_torcida() returns jsonb
language plpgsql stable security definer set search_path to ''
as $fn$
declare v_uid uuid:=auth.uid(); v_dia date:=public.hoje_br();
begin
 if v_uid is null or not exists(select 1 from public.players p
   where p.id=v_uid and not coalesce(p.bloqueado,false))
   then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 return jsonb_build_object('ok',true,'dia',v_dia,
   'hoje',(select t.flor from private.battle_torcida t where t.player_id=v_uid and t.dia=v_dia),
   'flores',coalesce((select jsonb_object_agg(f.flor,f.qtd) from private.jardim_flores f
      where f.user_id=v_uid and f.qtd>0),'{}'::jsonb));
end $fn$;

-- Leva 1 flor para a torcida de hoje. Gasta a flor; só uma por dia.
create or replace function public.battle_torcida_levar(p_flor text) returns jsonb
language plpgsql volatile security definer set search_path to ''
as $fn$
declare v_uid uuid:=auth.uid(); v_dia date:=public.hoje_br(); v_qtd integer;
begin
 if v_uid is null then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 if p_flor is null or p_flor not in ('sakura','tulipa','girassol','lunar') then
   return jsonb_build_object('ok',false,'erro','parametros'); end if;
 -- A linha da conta travada impede duas flores no mesmo dia por cliques simultâneos.
 perform 1 from public.players where id=v_uid and not coalesce(bloqueado,false) for update;
 if not found then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 if exists(select 1 from private.battle_torcida where player_id=v_uid and dia=v_dia) then
   return jsonb_build_object('ok',false,'erro','ja'); end if;
 update private.jardim_flores set qtd=qtd-1
   where user_id=v_uid and flor=p_flor and qtd>0 returning qtd into v_qtd;
 if not found then return jsonb_build_object('ok',false,'erro','sem_flor'); end if;
 insert into private.battle_torcida(player_id,dia,flor) values(v_uid,v_dia,p_flor);
 return jsonb_build_object('ok',true,'hoje',p_flor,'qtd',v_qtd);
end $fn$;

-- ===== battle_jogar: cópia inteira da versão aplicada + torcida =====
create or replace function public.battle_jogar(p_unit jsonb, p_requisicao uuid)
returns jsonb language plpgsql volatile security definer set search_path to ''
as $fn$
declare
 v_uid uuid:=auth.uid(); v_p public.players; v_dia date:=public.hoje_br();
 v_ja jsonb; v_tentativas integer; v_starter boolean; v_qtd integer;
 v_i integer; v_nick text; v_card public.players; v_rival jsonb; v_op jsonb;
 v_a jsonb; v_c int; v_d int; v_ch int; v_boost int; v_eu int; v_eles int;
 v_sorte int; v_pos int; v_venceu boolean; v_vitorias int:=0;
 v_rodadas jsonb:='[]'::jsonb; v_premio smallint:=0; v_result jsonb;
 v_tor text; v_bonus int;
begin
 if v_uid is null then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 if p_requisicao is null or p_unit is null or jsonb_typeof(p_unit)<>'array'
   or jsonb_array_length(p_unit)<>3 then
   return jsonb_build_object('ok',false,'erro','unit'); end if;
 -- A mesma linha travada protege tentativas, prêmio e estrelas contra concorrência.
 select * into v_p from public.players
   where id=v_uid and not coalesce(bloqueado,false) for update;
 if not found then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
 select resultado into v_ja from private.battle_partidas
   where player_id=v_uid and requisicao=p_requisicao;
 if found then return v_ja; end if;
 select count(*) into v_tentativas from private.battle_partidas
   where player_id=v_uid and dia=v_dia;
 if v_tentativas>=5 then return jsonb_build_object('ok',false,'erro','limite'); end if;
 select count(*) into v_qtd from public.players p
   where p.avatar is not null and not coalesce(p.bloqueado,false)
     and private.cards_qtd(v_uid,lower(btrim(p.nick)))>0;
 v_starter:=v_qtd<3;
 if (select count(distinct lower(btrim(x.value))) from jsonb_array_elements_text(p_unit) x)<>3
    then return jsonb_build_object('ok',false,'erro','unit'); end if;
 v_rival:=private.battle_rival_dia(v_dia);
 -- v3: flor levada hoje para a torcida (uma por dia; vale para todas as partidas do dia).
 select t.flor into v_tor from private.battle_torcida t where t.player_id=v_uid and t.dia=v_dia;
 -- Ordem do rival sorteada por partida no servidor (random()), nunca derivada de
 -- dados públicos: assim ninguém calcula a ordem antes de jogar. O resultado fica
 -- gravado em battle_partidas, então a repetição da mesma requisição continua idempotente.
 v_pos:=floor(random()*3)::int;
 for v_i in 0..2 loop
   v_nick:=btrim(p_unit->>v_i);
   if v_nick is null or length(v_nick)>48 then return jsonb_build_object('ok',false,'erro','unit'); end if;
   if v_starter then
     if lower(v_nick) not in ('tsu','lirika','pati') then
       return jsonb_build_object('ok',false,'erro','unit'); end if;
     v_a:=jsonb_build_object('canto',5,'danca',5,'carisma',5);
   else
     select * into v_card from public.players
       where lower(btrim(nick))=lower(v_nick) and avatar is not null
       and not coalesce(bloqueado,false);
     if not found or private.cards_qtd(v_uid,lower(v_nick))<1 then
       return jsonb_build_object('ok',false,'erro','sem_card'); end if;
     v_a:=private.battle_atributos(v_card.id);
     v_boost:=least(2,greatest(0,private.cards_qtd(v_uid,lower(v_nick))-1));
     v_c:=(v_a->>'canto')::int;v_d:=(v_a->>'danca')::int;v_ch:=(v_a->>'carisma')::int;
     if v_c>=v_d and v_c>=v_ch then v_a:=jsonb_set(v_a,'{canto}',to_jsonb(least(10,v_c+v_boost)));
     elsif v_d>=v_ch then v_a:=jsonb_set(v_a,'{danca}',to_jsonb(least(10,v_d+v_boost)));
     else v_a:=jsonb_set(v_a,'{carisma}',to_jsonb(least(10,v_ch+v_boost))); end if;
   end if;
   v_op:=v_rival->mod(v_i+v_pos,3);
   v_eu:=(v_a->>(array['canto','danca','carisma'])[v_i+1])::int;
   v_eles:=(v_op->>(array['canto','danca','carisma'])[v_i+1])::int;
   -- "Dia bom/dia ruim": ±1 sorteado no servidor (random()), imprevisível para o cliente.
   v_sorte:=floor(random()*3)::int-1;
   v_bonus:=private.battle_torcida_bonus(v_tor,v_i);
   v_eu:=greatest(1,least(11,v_eu+v_sorte+v_bonus));
   v_venceu:=v_eu>v_eles;
   if v_venceu then v_vitorias:=v_vitorias+1; end if;
   v_rodadas:=v_rodadas || jsonb_build_array(jsonb_build_object(
     'tipo',(array['canto','danca','carisma'])[v_i+1],
     'meu',v_nick,'rival',v_op->>'nick','eu',v_eu,'eles',v_eles,'ganhou',v_venceu,'bonus',v_bonus));
 end loop;
 if v_vitorias>=2 and not exists(
   select 1 from private.battle_partidas
   where player_id=v_uid and dia=v_dia and premio=5) then
   update public.players set stars=stars+5,updated_at=now() where id=v_uid returning * into v_p;
   insert into public.star_log(user_id,delta,reason) values(v_uid,5,'battle_rival_dia');
   v_premio:=5;
 end if;
 v_result:=jsonb_build_object('ok',true,'dia',v_dia,'tentativas',v_tentativas+1,
   'rodadas',v_rodadas,'vitoria',v_vitorias>=2,'premio',v_premio,'stars',v_p.stars,'torcida',v_tor);
 insert into private.battle_partidas(player_id,dia,tentativa,requisicao,unit,resultado,vitoria,premio)
 values(v_uid,v_dia,v_tentativas+1,p_requisicao,p_unit,v_result,v_vitorias>=2,v_premio);
 return v_result;
end $fn$;

-- ===== battle_desafiar: cópia inteira da versão aplicada + torcida =====
create or replace function public.battle_desafiar(p_alvo text, p_unit jsonb, p_requisicao uuid)
returns jsonb language plpgsql volatile security definer set search_path to ''
as $fn$
declare
 v_uid uuid:=auth.uid(); v_p public.players; v_dia date:=public.hoje_br();
 v_ja jsonb; v_feitos integer; v_alvo public.players; v_u private.battle_units;
 v_meu jsonb; v_deles jsonb; v_i integer; v_k text; v_eu int; v_eles int; v_sorte int;
 v_venceu boolean; v_vitorias int:=0; v_rodadas jsonb:='[]'::jsonb; v_result jsonb;
 v_tor text; v_bonus int;
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
 -- v3: a flor da torcida de hoje também vale nos desafios da arena (só para quem desafia).
 select t.flor into v_tor from private.battle_torcida t where t.player_id=v_uid and t.dia=v_dia;
 for v_i in 0..2 loop
   v_k:=(array['canto','danca','carisma'])[v_i+1];
   v_eles:=(v_deles->v_i->>v_k)::int;
   -- "Dia bom/dia ruim": ±1 sorteado no servidor, só para quem desafia; empate é da defesa.
   v_sorte:=floor(random()*3)::int-1;
   v_bonus:=private.battle_torcida_bonus(v_tor,v_i);
   v_eu:=greatest(1,least(11,(v_meu->v_i->>v_k)::int+v_sorte+v_bonus));
   v_venceu:=v_eu>v_eles;
   if v_venceu then v_vitorias:=v_vitorias+1; end if;
   v_rodadas:=v_rodadas||jsonb_build_array(jsonb_build_object('tipo',v_k,
     'meu',v_meu->v_i->>'nick','rival',v_deles->v_i->>'nick','eu',v_eu,'eles',v_eles,'ganhou',v_venceu,'bonus',v_bonus));
 end loop;
 if v_vitorias<2 then
   update private.battle_units set fas=fas+1 where player_id=v_alvo.id;
 end if;
 v_result:=jsonb_build_object('ok',true,'dia',v_dia,'alvo',v_alvo.nick,'desafios',v_feitos+1,
   'rodadas',v_rodadas,'vitoria',v_vitorias>=2,'premio',0,'torcida',v_tor);
 insert into private.battle_desafios(desafiante,alvo,dia,requisicao,unit,resultado,vitoria)
 values(v_uid,v_alvo.id,v_dia,p_requisicao,p_unit,v_result,v_vitorias>=2);
 return v_result;
end $fn$;

revoke all on function private.battle_torcida_bonus(text,integer) from public,anon,authenticated;
revoke all on function public.battle_torcida() from public,anon;
revoke all on function public.battle_torcida_levar(text) from public,anon;
grant execute on function public.battle_torcida() to authenticated;
grant execute on function public.battle_torcida_levar(text) to authenticated;
-- create or replace preserva os grants de battle_jogar/battle_desafiar; reafirmados por segurança.
revoke all on function public.battle_jogar(jsonb,uuid) from public,anon;
revoke all on function public.battle_desafiar(text,jsonb,uuid) from public,anon;
grant execute on function public.battle_jogar(jsonb,uuid) to authenticated;
grant execute on function public.battle_desafiar(text,jsonb,uuid) to authenticated;
