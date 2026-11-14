-- APLICADO EM PRODUÇÃO em 14/11/2026 com o OK do dono (migração 20261114_idol_battle_v1).
-- Idol⭐Battle! v1 (docs/IDOL_BATTLE_PROPOSTA.md). Aplicado como migração única, sem begin/commit.
-- Requisitos verificados por leitura em 13/11/2026: public.players, public.gacha,
-- public.card_movimentos, private.cards_qtd(uuid,text), private.kt_scores,
-- public.coracoes, public.recados, public.star_log, public.hoje_br().
-- Uma partida é somente um rival diário, 3 rodadas, 5 tentativas/dia e ★5 na 1ª vitória.

create table if not exists private.battle_partidas (
  player_id uuid not null references public.players(id) on delete cascade,
  dia date not null,
  tentativa smallint not null check (tentativa between 1 and 5),
  requisicao uuid not null,
  unit jsonb not null,
  resultado jsonb not null,
  vitoria boolean not null,
  premio smallint not null default 0 check (premio in (0,5)),
  criado timestamptz not null default now(),
  primary key (player_id,dia,tentativa),
  unique (player_id,requisicao)
);
alter table private.battle_partidas enable row level security;
revoke all on private.battle_partidas from public, anon, authenticated;

-- Percentis calculados sobre estatísticas reais; não recebe nenhum atributo do cliente.
create or replace function private.battle_atributos(p_id uuid) returns jsonb
language sql stable security definer set search_path to ''
as $fn$
  with dados as (
    select p.id,
      coalesce((select max(k.score) from private.kt_scores k where k.player_id=p.id),0)::numeric as canto_base,
      (coalesce(p.best,0)::numeric + coalesce(p.centers_total,0)::numeric * 300) as danca_base,
      ((select count(*) from public.coracoes c where c.para=p.id)::numeric * 24
       + (select count(*) from public.recados r where r.para=p.id)::numeric * 15
       + coalesce(p.dias_jogados,0)::numeric * 4) as carisma_base
    from public.players p
    where not coalesce(p.bloqueado,false) and p.avatar is not null
  ), notas as (
    select d.id,
      (1 + floor(9 * percent_rank() over(order by d.canto_base,d.id)))::int as canto,
      (1 + floor(9 * percent_rank() over(order by d.danca_base,d.id)))::int as danca,
      (1 + floor(9 * percent_rank() over(order by d.carisma_base,d.id)))::int as carisma
    from dados d
  )
  select jsonb_build_object('canto',canto,'danca',danca,'carisma',carisma)
  from notas where id=p_id
$fn$;

-- Mesmo rival do dia para todos: 3 Idols elegíveis, ordem estável por data.
-- Em jogos recém-instalados com menos de 3 Idols, usa a unit inicial do jogo.
create or replace function private.battle_rival_dia(p_dia date) returns jsonb
language plpgsql stable security definer set search_path to ''
as $fn$
declare v_rival jsonb;
begin
  select coalesce(jsonb_agg(
       jsonb_build_object('nick', p.nick) || private.battle_atributos(p.id)
       order by r.ordem), '[]'::jsonb)
    into v_rival
  from (
    select id,row_number() over(order by md5(id::text || p_dia::text),id) as ordem
    from public.players
    where avatar is not null and not coalesce(bloqueado,false)
    order by md5(id::text || p_dia::text),id limit 3
  ) r join public.players p on p.id=r.id;
  if jsonb_array_length(v_rival)=3 then return v_rival; end if;
  return jsonb_build_array(
    jsonb_build_object('nick','Tsu','canto',5,'danca',5,'carisma',5),
    jsonb_build_object('nick','Lirika','canto',5,'danca',5,'carisma',5),
    jsonb_build_object('nick','Pati','canto',5,'danca',5,'carisma',5)
  );
end $fn$;

create or replace function public.battle_status() returns jsonb
language plpgsql stable security definer set search_path to ''
as $fn$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br();
  v_cards jsonb; v_starter boolean; v_tentativas integer; v_premiado boolean;
begin
  if v_uid is null or not exists(select 1 from public.players p where p.id=v_uid and not coalesce(p.bloqueado,false))
  then return jsonb_build_object('ok',false,'erro','sem_conta'); end if;
  select coalesce(jsonb_agg(
    jsonb_build_object('nick',p.nick,'qtd',private.cards_qtd(v_uid,lower(btrim(p.nick))))
      || private.battle_atributos(p.id) order by p.nick),'[]'::jsonb)
  into v_cards from public.players p
  where p.avatar is not null and not coalesce(p.bloqueado,false)
    and private.cards_qtd(v_uid,lower(btrim(p.nick)))>0;
  v_starter := jsonb_array_length(v_cards)<3;
  if v_starter then
    v_cards := jsonb_build_array(
      jsonb_build_object('nick','Tsu','canto',5,'danca',5,'carisma',5,'qtd',1),
      jsonb_build_object('nick','Lirika','canto',5,'danca',5,'carisma',5,'qtd',1),
      jsonb_build_object('nick','Pati','canto',5,'danca',5,'carisma',5,'qtd',1));
  end if;
  select count(*),coalesce(bool_or(premio=5),false)
   into v_tentativas,v_premiado
   from private.battle_partidas where player_id=v_uid and dia=v_dia;
  return jsonb_build_object('ok',true,'dia',v_dia,'starter',v_starter,
    'max_tentativas',5,'tentativas',v_tentativas,'premiado',v_premiado,
    'cards',v_cards,'rival',private.battle_rival_dia(v_dia));
end $fn$;

-- p_unit: array JSON com EXATAMENTE 3 nomes, na ordem Canto/Dança/Carisma.
-- p_requisicao: UUID por clique, reaproveitado ao repetir a mesma requisição HTTP.
-- O cliente não envia atributos, rival, score, tentativas nem prêmio.
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
   v_eu:=greatest(1,least(11,v_eu+v_sorte));
   v_venceu:=v_eu>v_eles;
   if v_venceu then v_vitorias:=v_vitorias+1; end if;
   v_rodadas:=v_rodadas || jsonb_build_array(jsonb_build_object(
     'tipo',(array['canto','danca','carisma'])[v_i+1],
     'meu',v_nick,'rival',v_op->>'nick','eu',v_eu,'eles',v_eles,'ganhou',v_venceu));
 end loop;
 if v_vitorias>=2 and not exists(
   select 1 from private.battle_partidas
   where player_id=v_uid and dia=v_dia and premio=5) then
   update public.players set stars=stars+5,updated_at=now() where id=v_uid returning * into v_p;
   insert into public.star_log(user_id,delta,reason) values(v_uid,5,'battle_rival_dia');
   v_premio:=5;
 end if;
 v_result:=jsonb_build_object('ok',true,'dia',v_dia,'tentativas',v_tentativas+1,
   'rodadas',v_rodadas,'vitoria',v_vitorias>=2,'premio',v_premio,'stars',v_p.stars);
 insert into private.battle_partidas(player_id,dia,tentativa,requisicao,unit,resultado,vitoria,premio)
 values(v_uid,v_dia,v_tentativas+1,p_requisicao,p_unit,v_result,v_vitorias>=2,v_premio);
 return v_result;
end $fn$;

-- Nunca conceder EXECUTE a PUBLIC/anon. Tabelas privadas sem políticas diretas.
revoke all on function private.battle_atributos(uuid) from public,anon,authenticated;
revoke all on function private.battle_rival_dia(date) from public,anon,authenticated;
revoke all on function public.battle_status() from public,anon;
revoke all on function public.battle_jogar(jsonb,uuid) from public,anon;
grant execute on function public.battle_status() to authenticated;
grant execute on function public.battle_jogar(jsonb,uuid) to authenticated;
