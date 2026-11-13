-- Réplica mínima do esquema de produção (só o que o Gacha/Álbum/trocas usam), para testes ISOLADOS.
-- As funções album_cards, cards_qtd, propor_troca e responder_troca são cópias das de produção (13/11/2026).
do $$ begin create role anon; exception when duplicate_object then null; end $$;
do $$ begin create role authenticated; exception when duplicate_object then null; end $$;
do $$ begin create role service_role; exception when duplicate_object then null; end $$;
create schema auth; create schema private;
create table auth.users(id uuid primary key);
create function auth.uid() returns uuid language sql stable as
  $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
create table public.players(id uuid primary key references auth.users(id), nick text not null, avatar jsonb, oshi text, frase text,
  best int default 0, nuvem_pet jsonb, bloqueado boolean default false, stars int not null default 0, bonus_corrida text, updated_at timestamptz);
create unique index players_nick_unico on public.players(lower(nick));
create table public.gacha(user_id uuid not null references auth.users(id) on delete cascade, dia date not null, tipo text not null, valor text,
  created_at timestamptz not null default now(), primary key(user_id, dia));
create table public.aniver_presentes(user_id uuid not null references public.players(id), em timestamptz not null default now());
create table public.card_movimentos(id bigserial primary key, user_id uuid not null references public.players(id) on delete cascade,
  chave text not null, delta smallint not null check (delta = any(array[-1,1])), troca_id bigint, quando timestamptz not null default now());
create table public.card_trocas(id bigserial primary key, de uuid not null references public.players(id), para uuid not null references public.players(id),
  dou text not null, quero text not null, status text not null default 'pendente', criado timestamptz not null default now(), resolvido timestamptz, check (de<>para));
create table public.star_log(user_id uuid, delta int, reason text);
create table private.kt_ticket_wallet(player_id uuid primary key, balance int not null, updated_at timestamptz);
create table private.kt_ticket_events(player_id uuid, actor_id uuid, delta int, reason text);
create function public.hoje_br() returns date language sql stable set search_path to 'public' as
  $$ select coalesce(nullif(current_setting('teste.hoje', true), '')::date, (now() at time zone 'America/Sao_Paulo')::date) $$;
create function public.gacha_card(p_nick text) returns json language sql stable security definer set search_path to 'public' as
  $$ select json_build_object('nick', p.nick, 'avatar', p.avatar) from public.players p where lower(p.nick) = lower(coalesce(p_nick, '')) $$;
CREATE FUNCTION private.cards_qtd(p_user uuid, p_chave text) RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $function$
  SELECT (SELECT count(*) FROM public.gacha g WHERE g.user_id = p_user AND g.tipo = 'card' AND lower(btrim(g.valor)) = p_chave)::int
       + (SELECT count(*) FROM public.aniver_presentes a JOIN public.players p ON p.id = a.user_id WHERE a.user_id = p_user AND lower(btrim(p.nick)) = p_chave)::int
       + coalesce((SELECT sum(m.delta) FROM public.card_movimentos m WHERE m.user_id = p_user AND m.chave = p_chave), 0)::int;
$function$;
CREATE FUNCTION public.album_cards() RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO '' AS $function$
  WITH aq AS (
    SELECT lower(btrim(g.valor)) AS chave, 'card'::text AS tipo, g.created_at AS quando, 1 AS d
      FROM public.gacha g WHERE g.user_id = (SELECT auth.uid()) AND g.tipo = 'card' AND nullif(btrim(g.valor), '') IS NOT NULL
    UNION ALL
    SELECT lower(btrim(p.nick)), 'aniver', a.em, 1
      FROM public.aniver_presentes a JOIN public.players p ON p.id = a.user_id WHERE a.user_id = (SELECT auth.uid())
    UNION ALL
    SELECT m.chave, 'card', m.quando, m.delta FROM public.card_movimentos m WHERE m.user_id = (SELECT auth.uid())
  ), soma AS (
    SELECT chave, sum(d)::int AS vezes, min(quando) FILTER (WHERE d > 0) AS primeira,
           (array_agg(tipo ORDER BY quando DESC) FILTER (WHERE d > 0))[1] AS tipo, max(quando) FILTER (WHERE d > 0) AS ultimo
    FROM aq GROUP BY chave
  )
  SELECT coalesce(json_agg(json_build_object('card', public.gacha_card(p.nick), 'tipo', s.tipo, 'dia', s.ultimo::date,
           'vezes', s.vezes, 'primeira', s.primeira) ORDER BY s.ultimo DESC, p.nick), '[]'::json)
  FROM soma s JOIN public.players p ON lower(btrim(p.nick)) = s.chave
  WHERE s.vezes > 0 AND (SELECT auth.uid()) IS NOT NULL;
$function$;
CREATE FUNCTION public.responder_troca(p_id bigint, p_aceitar boolean) RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $function$
DECLARE t public.card_trocas; v_a uuid; v_b uuid;
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  SELECT * INTO t FROM public.card_trocas WHERE id = p_id AND para = auth.uid() AND status = 'pendente' FOR UPDATE;
  IF NOT FOUND THEN RETURN json_build_object('ok', false, 'erro', 'troca'); END IF;
  IF t.criado < now() - interval '3 days' THEN UPDATE public.card_trocas SET status = 'vencida', resolvido = now() WHERE id = t.id; RETURN json_build_object('ok', false, 'erro', 'vencida'); END IF;
  IF NOT coalesce(p_aceitar, false) THEN UPDATE public.card_trocas SET status = 'recusada', resolvido = now() WHERE id = t.id; RETURN json_build_object('ok', true, 'status', 'recusada'); END IF;
  v_a := least(t.de, t.para); v_b := greatest(t.de, t.para);
  PERFORM pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_a::text));
  PERFORM pg_catalog.pg_advisory_xact_lock(4801, pg_catalog.hashtext(v_b::text));
  IF EXISTS (SELECT 1 FROM public.players p WHERE p.id IN (t.de, t.para) AND coalesce(p.bloqueado, false)) THEN
    UPDATE public.card_trocas SET status = 'cancelada', resolvido = now() WHERE id = t.id; RETURN json_build_object('ok', false, 'erro', 'troca');
  END IF;
  IF private.cards_qtd(t.de, t.dou) < 2 THEN RETURN json_build_object('ok', false, 'erro', 'sem_repetido_outro'); END IF;
  IF private.cards_qtd(t.para, t.quero) < 2 THEN RETURN json_build_object('ok', false, 'erro', 'sem_repetido'); END IF;
  INSERT INTO public.card_movimentos(user_id, chave, delta, troca_id) VALUES
    (t.de, t.dou, -1, t.id), (t.para, t.dou, 1, t.id), (t.para, t.quero, -1, t.id), (t.de, t.quero, 1, t.id);
  UPDATE public.card_trocas SET status = 'aceita', resolvido = now() WHERE id = t.id;
  RETURN json_build_object('ok', true, 'status', 'aceita');
END $function$;
grant usage on schema public to anon, authenticated, service_role;
