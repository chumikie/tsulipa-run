-- 21/11/2026 · PR das melhorias (terceira parte): economia e começo do jogo
-- Diagnóstico (30 dias): 76% das estrelas vêm do Center⭐Run!; 12 de 20 contas não têm nenhum item; a conta nova
-- começa com ★0; só 8 de 20 seguem depois do 7º dia; no gacha cada conta tem em média 1,5 Idols diferentes.
--
-- 1) Kit de estreia (uma vez por conta, também para quem já joga): ★100 + 1 item grátis à escolha entre os baratos.
-- 2) Trilha da primeira semana (contas com até 14 dias): 5 passos de ★20 e ★40 ao completar, com a insígnia "trilha".
-- 3) Outros jogos pagando: o primeiro resultado do dia no Sora⭐Jump!, Happy⭐Cafe!, Handshake⭐Event! e Idol⭐Battle!
--    vale ★15 cada (até ★60/dia), pago por bonus_jogos_dia() conferindo os resultados que o servidor já guarda.
-- 4) Promoção da semana: uma roupa fora de temporada com 30% de desconto, em rodízio semanal (segunda a domingo).
-- 5) Gacha mais fácil: os 3 primeiros giros de cada conta são card; depois de 3 giros seguidos sem card, o próximo é
--    card; o card vem de um Idol que você ainda não tem enquanto faltarem 3 ou mais; 3 repetidos (pó) = 1 card.

-- ───────────── 1) Kit de estreia ─────────────
create table if not exists private.kit_estreia (
  user_id uuid primary key references public.players(id) on delete cascade,
  item text not null,
  em timestamptz not null default now()
);
alter table private.kit_estreia enable row level security;

create or replace function private.kit_opcoes()
 returns text[] language sql immutable set search_path to ''
as $$ select array['det_coelho','det_tulipa','det_torrada','hat_palha','expr_4','expr_5','expr_6','fundo_oshi','fundo_ceu','fundo_palco','fundo_noite','duo_selfie'] $$;

create or replace function public.kit_estreia_estado()
 returns json language plpgsql stable security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_vis text[];
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  select coalesce(visuais, '{}') into v_vis from public.players where id = v_uid and not coalesce(bloqueado, false);
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  return json_build_object('ok', true, 'estrelas', 100,
    'disponivel', not exists (select 1 from private.kit_estreia where user_id = v_uid),
    'opcoes', (select json_agg(k) from unnest(private.kit_opcoes()) k where not (k = any(v_vis))));
end $$;

create or replace function public.kit_estreia_resgatar(p_item text)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); p public.players; v_item text := btrim(coalesce(p_item, ''));
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if not (v_item = any(private.kit_opcoes())) then return json_build_object('ok', false, 'erro', 'item'); end if;
  select * into p from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  insert into private.kit_estreia (user_id, item) values (v_uid, v_item) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  update public.players set stars = stars + 100, updated_at = now(),
    visuais = case when v_item = any(coalesce(visuais, '{}')) then visuais else array_append(coalesce(visuais, '{}'), v_item) end
   where id = v_uid returning * into p;
  insert into public.star_log (user_id, delta, reason) values (v_uid, 100, 'kit_estreia');
  return json_build_object('ok', true, 'stars', p.stars, 'visuais', p.visuais, 'item', v_item, 'premio', 100);
end $$;

-- ───────────── 2) Trilha da primeira semana ─────────────
create table if not exists private.trilha_estreia (
  user_id uuid not null references public.players(id) on delete cascade,
  passo text not null,
  em timestamptz not null default now(),
  primary key (user_id, passo)
);
alter table private.trilha_estreia enable row level security;

create or replace function private.trilha_feitos(p_uid uuid)
 returns text[] language sql stable set search_path to ''
as $$
  select array_remove(array[
    case when coalesce((select corridas_total from public.players where id = p_uid), 0) > 0
           or exists (select 1 from public.leaderboard where user_id = p_uid)
           or exists (select 1 from public.star_log where user_id = p_uid and reason = 'corrida') then 'corrida' end,
    case when exists (select 1 from public.gacha where user_id = p_uid) then 'gacha' end,
    case when exists (select 1 from public.duo_log where de = p_uid) then 'duo' end,
    case when exists (select 1 from public.star_log where user_id = p_uid and reason like 'visual:%') then 'compra' end,
    case when exists (select 1 from public.star_log where user_id = p_uid and reason like 'missao%') then 'missao' end
  ], null)
$$;

create or replace function public.trilha_estado()
 returns json language plpgsql stable security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_criada timestamptz; v_feitos text[];
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  select created_at into v_criada from public.players where id = v_uid and not coalesce(bloqueado, false);
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  v_feitos := private.trilha_feitos(v_uid);
  return json_build_object('ok', true,
    'ativa', coalesce(v_criada, '-infinity') >= now() - interval '14 days'
             and not exists (select 1 from private.trilha_estreia where user_id = v_uid and passo = 'fim'),
    'ate', (coalesce(v_criada, now()) + interval '14 days')::date, 'premio', 20, 'final', 40,
    'passos', (select json_agg(json_build_object('k', k, 'feito', k = any(v_feitos),
                 'resgatado', exists (select 1 from private.trilha_estreia t where t.user_id = v_uid and t.passo = k)) order by o)
                 from unnest(array['corrida','gacha','duo','compra','missao']) with ordinality as x(k, o)));
end $$;

create or replace function public.trilha_resgatar(p_passo text)
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_criada timestamptz; v_premio int; v_stars int; v_fim boolean := false;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  if p_passo not in ('corrida','gacha','duo','compra','missao') then return json_build_object('ok', false, 'erro', 'passo'); end if;
  select created_at into v_criada from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  if coalesce(v_criada, '-infinity') < now() - interval '14 days' then return json_build_object('ok', false, 'erro', 'prazo'); end if;
  if not (p_passo = any(private.trilha_feitos(v_uid))) then return json_build_object('ok', false, 'erro', 'falta'); end if;
  insert into private.trilha_estreia (user_id, passo) values (v_uid, p_passo) on conflict do nothing;
  if not found then return json_build_object('ok', false, 'erro', 'feito'); end if;
  v_premio := 20;
  if (select count(*) from private.trilha_estreia where user_id = v_uid and passo <> 'fim') = 5 then
    insert into private.trilha_estreia (user_id, passo) values (v_uid, 'fim') on conflict do nothing;
    if found then v_premio := v_premio + 40; v_fim := true; end if;
  end if;
  update public.players set stars = stars + v_premio, updated_at = now(),
    insignias_extra = case when v_fim then (select array_agg(distinct x) from unnest(coalesce(insignias_extra, '{}') || array['trilha']) x) else insignias_extra end
   where id = v_uid returning stars into v_stars;
  insert into public.star_log (user_id, delta, reason) values (v_uid, v_premio, 'trilha_estreia');
  return json_build_object('ok', true, 'premio', v_premio, 'fim', v_fim, 'stars', v_stars);
end $$;

-- ───────────── 3) Primeiro resultado do dia nos outros jogos ─────────────
create table if not exists private.bonus_jogo_dia (
  user_id uuid not null references public.players(id) on delete cascade,
  dia date not null,
  jogo text not null,
  primary key (user_id, dia, jogo)
);
alter table private.bonus_jogo_dia enable row level security;

create or replace function public.bonus_jogos_dia()
 returns json language plpgsql security definer set search_path to 'public'
as $$
declare v_uid uuid := auth.uid(); v_dia date := public.hoje_br(); v_pagos text[] := '{}'; j text; v_stars int; v_tem boolean;
begin
  if v_uid is null then return json_build_object('ok', false, 'erro', 'login'); end if;
  perform 1 from public.players where id = v_uid and not coalesce(bloqueado, false) for update;
  if not found then return json_build_object('ok', false, 'erro', 'sem_conta'); end if;
  foreach j in array array['sora','cafe','hand','battle'] loop
    v_tem := case j
         when 'sora' then exists (select 1 from private.sora_history where player_id = v_uid and score > 0 and (finished_at at time zone 'America/Sao_Paulo')::date = v_dia)
         when 'cafe' then exists (select 1 from private.cafe_resultados where user_id = v_uid and dia = v_dia)
         when 'hand' then exists (select 1 from private.handshake_resultados where user_id = v_uid and dia = v_dia)
         else exists (select 1 from private.battle_partidas where player_id = v_uid and dia = v_dia)
       end;
    if v_tem then
      insert into private.bonus_jogo_dia (user_id, dia, jogo) values (v_uid, v_dia, j) on conflict do nothing;
      if found then v_pagos := v_pagos || j; end if;
    end if;
  end loop;
  if cardinality(v_pagos) > 0 then
    update public.players set stars = stars + 15 * cardinality(v_pagos), updated_at = now() where id = v_uid returning stars into v_stars;
    insert into public.star_log (user_id, delta, reason) select v_uid, 15, 'primeiro_do_dia:' || x from unnest(v_pagos) x;
  end if;
  return json_build_object('ok', true, 'pagos', to_json(v_pagos), 'premio', 15, 'stars', v_stars);
end $$;

-- ───────────── 4) Promoção da semana ─────────────
-- Preços originais, iguais aos de antes (a tabela não muda; só a função pública aplica a promoção)
create or replace function private.visual_preco_base(p_key text, out preco integer, out pontos integer)
 returns record language sql immutable set search_path to ''
as $$
  select v.preco, v.pontos from (values
    ('fever', 120, 0), ('ima', 120, 0), ('mega', 180, 0), ('alien', 250, 0),
    ('rank_center', 300, 5000), ('rank_solo', 400, 10000), ('rank_capitao', 500, 15000),
    ('rank_ace', 650, 30000), ('rank_kami', 800, 50000),
    ('fundo_palco', 80, 0), ('fundo_oshi', 60, 0), ('fundo_ceu', 60, 0), ('fundo_noite', 80, 0), ('fundo_halloween', 150, 0),
    ('pose_mic', 120, 0), ('pose_banzai', 100, 0), ('pose_nyan', 150, 0), ('pose_luz', 150, 0),
    ('expr_4', 60, 0), ('expr_5', 60, 0), ('expr_6', 80, 0), ('det_coelho', 50, 0), ('det_tulipa', 50, 0), ('det_torrada', 50, 0), ('hat_palha', 70, 0),
    ('duo_selfie', 80, 0), ('duo_guarda', 100, 0), ('duo_seis', 120, 0), ('duo_neon', 150, 0), ('duo_cafe', 90, 0),
    ('roupa_brasil', 150, 0), ('roupa_tailandia', 150, 0), ('roupa_indonesia', 150, 0), ('roupa_pijama', 180, 0), ('roupa_happi', 200, 0), ('roupa_gingham', 250, 0), ('roupa_hipster', 280, 0),
    ('roupa_rock', 320, 0), ('roupa_disco', 360, 0), ('roupa_technopop', 400, 0), ('roupa_decora', 450, 0), ('roupa_alienfan', 500, 0),
    ('roupa_vampiro', 320, 0), ('roupa_rena', 300, 0), ('roupa_reveillon', 300, 0), ('roupa_floral', 280, 0), ('roupa_coracao', 300, 0),
    ('roupa_outono', 320, 0), ('roupa_sakura', 340, 0), ('roupa_puffer', 340, 0), ('roupa_yukata', 300, 0), ('roupa_cardiga', 280, 0),
    ('roupa_jardineira', 260, 0), ('roupa_festa48', 348, 0),
    ('tema_natal', 60, 0), ('tema_anonovo', 60, 0), ('tema_verao', 60, 0), ('tema_valentine', 60, 0), ('tema_outono', 60, 0),
    ('tema_sakura', 60, 0), ('tema_inverno', 60, 0), ('tema_tanabata', 60, 0), ('tema_primavera', 60, 0), ('tema_criancas', 60, 0),
    ('tema_aniversario', 60, 0)
  ) as v(k, preco, pontos) where v.k = p_key
$$;

-- Roupas fora de temporada, em rodízio: uma por semana (segunda a domingo, horário de Brasília)
create or replace function private.promo_item(p_dia date)
 returns text language sql immutable set search_path to ''
as $$
  select (array['roupa_rock','roupa_happi','roupa_disco','roupa_gingham','roupa_technopop','roupa_pijama','roupa_hipster',
                'roupa_decora','roupa_brasil','roupa_alienfan','roupa_tailandia','roupa_indonesia'])
         [1 + (((p_dia - (extract(isodow from p_dia)::int - 1)) - date '2026-11-16') / 7 % 12 + 12) % 12]
$$;

create or replace function public.visual_preco(p_key text, out preco integer, out pontos integer)
 returns record language sql stable set search_path to 'public'
as $$
  select case when p_key = private.promo_item(public.hoje_br()) then round(b.preco * 0.7)::int else b.preco end, b.pontos
    from private.visual_preco_base(p_key) b
$$;

create or replace function public.promo_semana()
 returns json language sql stable security definer set search_path to 'public'
as $$
  select json_build_object('ok', true, 'item', k, 'k', substr(k, 7), 'preco', (select preco from public.visual_preco(k)),
                           'original', (select preco from private.visual_preco_base(k)), 'desconto', 30,
                           'ate', private.segunda_da_semana(public.hoje_br()) + 6)
    from (select private.promo_item(public.hoje_br()) k) x
$$;

-- ───────────── 5) Gacha mais fácil ─────────────
create or replace function public.gacha_girar()
 returns json language plpgsql security definer set search_path to ''
as $function$
declare
  r numeric := random(); t text; v text; p public.players; v_balance integer;
  v_sete_nada boolean; v_giros int; v_seca boolean; v_faltam int;
begin
  select * into p from public.players where id=auth.uid() and not coalesce(bloqueado,false) for update;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if exists(select 1 from public.gacha where user_id=auth.uid() and dia=public.hoje_br())
    then return pg_catalog.json_build_object('ok',false,'erro','hoje'); end if;
  select count(*)=7 and count(*) filter (where h.tipo='nada')=7 into v_sete_nada
    from (select g.tipo from public.gacha g where g.user_id=auth.uid() order by g.dia desc limit 7) h;
  -- começo garantido (3 primeiros giros) e garantia depois de 3 giros seguidos sem card
  select count(*) into v_giros from public.gacha where user_id=auth.uid();
  select count(*)=3 and count(*) filter (where h.tipo='card')=0 into v_seca
    from (select g.tipo from public.gacha g where g.user_id=auth.uid() order by g.dia desc limit 3) h;
  if v_giros<3 or v_seca then r:=0; end if;
  if r<.40 then
    -- card novo primeiro: enquanto faltarem 3 ou mais Idols, sai um que você ainda não tem
    select count(*) into v_faltam from public.players
      where avatar is not null and not coalesce(bloqueado,false) and id<>auth.uid()
        and private.cards_qtd(auth.uid(),lower(pg_catalog.btrim(nick)))<=0;
    if v_faltam>=3 then
      select nick into v from public.players where avatar is not null and not coalesce(bloqueado,false)
        and id<>auth.uid() and private.cards_qtd(auth.uid(),lower(pg_catalog.btrim(nick)))<=0 order by random() limit 1;
    else
      select nick into v from public.players where avatar is not null and not coalesce(bloqueado,false)
        and id<>auth.uid() order by random() limit 1;
    end if;
    if v is not null then t:='card';
    elsif v_sete_nada then t:='bonus';v:=(array['ima','escudo','fever'])[1+floor(random()*3)::integer];
    else t:='nada';v:=(floor(random()*8))::integer::text;end if;
  elsif r<.80 then t:='estrelas';v:=(5+floor(random()*11))::integer::text;
  elsif r<.92 then t:='estrelas';v:=(20+floor(random()*21))::integer::text;
  elsif r<.95 then t:='bonus';v:=(array['ima','escudo','fever'])[1+floor(random()*3)::integer];
  else t:='ticket';v:='1';end if;
  if t='ticket' then
    insert into private.kt_ticket_wallet(player_id,balance) values(auth.uid(),1)
      on conflict(player_id) do update set balance=private.kt_ticket_wallet.balance+1,
        updated_at=clock_timestamp() where private.kt_ticket_wallet.balance<99
      returning balance into v_balance;
    if found then
      insert into private.kt_ticket_events(player_id,actor_id,delta,reason)
        values(auth.uid(),auth.uid(),1,'gacha');
    else
      -- Carteira cheia: o giro continua premiado com estrelas, sem estourar o limite.
      t:='estrelas';v:='5';
    end if;
  end if;
  insert into public.gacha(user_id,dia,tipo,valor) values(auth.uid(),public.hoje_br(),t,v);
  if t='estrelas' then
    update public.players set stars=stars+v::integer,updated_at=now() where id=auth.uid() returning * into p;
    insert into public.star_log(user_id,delta,reason) values(auth.uid(),v::integer,'gacha');
  elsif t='bonus' then
    update public.players set bonus_corrida=v where id=auth.uid();
  end if;
  return pg_catalog.json_build_object('ok',true,'tipo',t,'valor',v,'stars',p.stars,
    'tickets',v_balance,'card',case when t='card' then public.gacha_card(v) end);
end $function$;

-- Pó de estrela: 3 repetidos = 1 card que falta (antes 5)
create or replace function public.gacha_resgatar_card(p_nick text, p_requisicao uuid)
 returns json language plpgsql security definer set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_chave text := lower(pg_catalog.btrim(coalesce(p_nick,'')));
  v_saldo integer;
  v_nome text;
  v_existente record;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  if p_requisicao is null or v_chave='' or pg_catalog.length(v_chave)>48 then
    return pg_catalog.json_build_object('ok',false,'erro','parametros'); end if;
  perform pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_uid::text));
  if not exists(select 1 from public.players where id=v_uid and not coalesce(bloqueado,false)) then
    return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select * into v_existente from private.gacha_po_log
    where user_id=v_uid and requisicao=p_requisicao;
  if found then
    if v_existente.tipo<>'resgatar' or v_existente.nick<>v_chave then
      return pg_catalog.json_build_object('ok',false,'erro','requisicao_reutilizada'); end if;
    select saldo into v_saldo from private.gacha_po_saldo where user_id=v_uid;
    return pg_catalog.json_build_object('ok',true,'repetido',true,'po',coalesce(v_saldo,0),'card',public.gacha_card(v_chave));
  end if;
  select nick into v_nome from public.players
    where lower(pg_catalog.btrim(nick))=v_chave and id<>v_uid
      and avatar is not null and not coalesce(bloqueado,false)
    order by id limit 1;
  if v_nome is null then return pg_catalog.json_build_object('ok',false,'erro','card_indisponivel'); end if;
  if private.cards_qtd(v_uid,v_chave)>0 then
    return pg_catalog.json_build_object('ok',false,'erro','ja_possui'); end if;
  update private.gacha_po_saldo set saldo=saldo-3,alterado=now()
    where user_id=v_uid and saldo>=3 returning saldo into v_saldo;
  if not found then return pg_catalog.json_build_object('ok',false,'erro','po_insuficiente'); end if;
  insert into public.card_movimentos(user_id,chave,delta) values(v_uid,v_chave,1);
  insert into private.gacha_po_log(user_id,requisicao,tipo,nick,delta)
    values(v_uid,p_requisicao,'resgatar',v_chave,-3);
  return pg_catalog.json_build_object('ok',true,'po',v_saldo,'card',public.gacha_card(v_nome));
end $function$;

create or replace function public.gacha_po_status()
 returns json language plpgsql stable security definer set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_saldo int;
  v_eu text;
  v_rep json;
  v_falta json;
begin
  if v_uid is null then return pg_catalog.json_build_object('ok',false,'erro','sem_conta'); end if;
  select lower(pg_catalog.btrim(nick)) into v_eu from public.players where id=v_uid;
  select saldo into v_saldo from private.gacha_po_saldo where user_id=v_uid;
  select coalesce(pg_catalog.json_agg(pg_catalog.json_build_object('nick',p.nick,'vezes',q.n) order by p.nick),'[]'::json)
    into v_rep
    from (select distinct lower(pg_catalog.btrim(g.valor)) as chave from public.gacha g
           where g.user_id=v_uid and g.tipo='card' and nullif(pg_catalog.btrim(g.valor),'') is not null) c
    cross join lateral (select private.cards_qtd(v_uid,c.chave) as n) q
    join public.players p on lower(pg_catalog.btrim(p.nick))=c.chave
   where q.n>=2 and c.chave is distinct from v_eu;
  select coalesce(pg_catalog.json_agg(pg_catalog.json_build_object('nick',x.nick) order by x.nick),'[]'::json)
    into v_falta
    from (select p.nick from public.players p
           where p.id<>v_uid and p.avatar is not null and not coalesce(p.bloqueado,false)
             and private.cards_qtd(v_uid,lower(pg_catalog.btrim(p.nick)))<=0
           order by p.nick limit 80) x;
  return pg_catalog.json_build_object('ok',true,'po',coalesce(v_saldo,0),'custo_troca',3,
    'repetidos',v_rep,'faltando',v_falta);
end $function$;

revoke all on function private.kit_opcoes(), private.trilha_feitos(uuid), private.visual_preco_base(text), private.promo_item(date) from public, anon, authenticated;
revoke all on function public.kit_estreia_estado(), public.kit_estreia_resgatar(text), public.trilha_estado(), public.trilha_resgatar(text), public.bonus_jogos_dia() from public, anon;
grant execute on function public.kit_estreia_estado(), public.kit_estreia_resgatar(text), public.trilha_estado(), public.trilha_resgatar(text), public.bonus_jogos_dia() to authenticated;
revoke all on function public.promo_semana() from public;
grant execute on function public.promo_semana() to anon, authenticated;   -- o visitante também vê a promoção
