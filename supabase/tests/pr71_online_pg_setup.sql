-- Banco descartável do CI da PR #71: somente o esquema mínimo das RPCs novas.
DO $ BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon NOLOGIN; END IF;
 IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated NOLOGIN; END IF;
END $;
CREATE SCHEMA auth;
CREATE SCHEMA private;
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT nullif(current_setting('request.jwt.claim.sub',true),'')::uuid
$$;
GRANT USAGE ON SCHEMA public TO authenticated;
CREATE TABLE public.players(
 id uuid PRIMARY KEY,
 bloqueado boolean NOT NULL DEFAULT false,
 stars integer NOT NULL DEFAULT 100,
 insignias_jogos text[] NOT NULL DEFAULT '{}'::text[]
);
CREATE TABLE public.handshake_premios(
 user_id uuid NOT NULL REFERENCES public.players(id),
 dia date NOT NULL,
 pontos integer NOT NULL CHECK(pontos>=600),
 tipo text NOT NULL CHECK(tipo IN ('ticket','pet')),
 item text NOT NULL DEFAULT '',
 criado timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(user_id,dia)
);
CREATE TABLE private.handshake_sessoes(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.players(id),
 criado timestamptz NOT NULL DEFAULT clock_timestamp(),
 desafios jsonb NOT NULL,
 concluido boolean NOT NULL DEFAULT false
);
CREATE TABLE private.handshake_resultados(
 user_id uuid NOT NULL REFERENCES public.players(id),
 dia date NOT NULL,
 acertos integer NOT NULL DEFAULT 0,
 pontos integer NOT NULL DEFAULT 0,
 PRIMARY KEY(user_id,dia)
);
CREATE TABLE private.cafe_sessoes(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id uuid NOT NULL REFERENCES public.players(id),
 criado timestamptz NOT NULL DEFAULT clock_timestamp(),
 pedido jsonb NOT NULL,
 concluido boolean NOT NULL DEFAULT false
);
CREATE TABLE private.cafe_resultados(
 user_id uuid NOT NULL REFERENCES public.players(id),
 dia date NOT NULL,
 PRIMARY KEY(user_id,dia)
);
CREATE TABLE private.kt_ticket_wallet(
 player_id uuid PRIMARY KEY REFERENCES public.players(id),
 balance integer NOT NULL DEFAULT 0 CHECK(balance BETWEEN 0 AND 99),
 updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);
CREATE TABLE private.kt_ticket_events(
 id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
 player_id uuid NOT NULL REFERENCES public.players(id),
 actor_id uuid NOT NULL REFERENCES public.players(id),
 delta integer NOT NULL,
 reason text NOT NULL
);
