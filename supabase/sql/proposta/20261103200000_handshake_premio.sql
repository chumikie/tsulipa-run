-- TsuLiPa⭐World — Handshake⭐Event! (minijogo de memória) — prêmio diário.
-- PROPOSTA (REVIEW ONLY). NÃO APLICAR SEM AUTORIZAÇÃO DA DONA. Quem aplica e confere é o responsável pelo banco (ChatGPT).
-- Decisão da dona (03/11/2026): os jogos novos NÃO dão estrelas e NÃO usam o teto de ★50 dos minijogos do Pet.
-- Prêmio: 1 vez por dia (0h de Brasília), ao fazer pelo menos 600 pontos no Handshake, a conta ganha
--   * 1 ticket do Karaoke⭐Time! (carteira private.kt_ticket_wallet, teto 99) — 40%
--   * ou 1 item de cuidado do pet (gyoza, dango, redvelvet, tiramisu ou banho de espuma) — 60%; o site guarda no camarim do pet.
-- O recorde do jogo fica no aparelho; só o prêmio diário passa pelo servidor.
-- Depende do sistema de tickets já aplicado (20261031151827_karaoke_tickets_...): acrescenta o motivo 'handshake'.
BEGIN;

ALTER TABLE private.kt_ticket_events DROP CONSTRAINT IF EXISTS kt_ticket_events_reason_check;
ALTER TABLE private.kt_ticket_events ADD CONSTRAINT kt_ticket_events_reason_check
  CHECK (reason IN ('gacha', 'gift_sent', 'gift_received', 'moderation', 'show', 'handshake'));

CREATE TABLE IF NOT EXISTS public.handshake_premios (
  user_id uuid NOT NULL REFERENCES public.players(id) ON DELETE CASCADE,
  dia date NOT NULL,
  pontos integer NOT NULL,
  tipo text NOT NULL CHECK (tipo IN ('ticket', 'pet')),
  item text NOT NULL DEFAULT '',
  criado timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, dia)
);
ALTER TABLE public.handshake_premios ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.handshake_premios FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.handshake_premio(p_pontos integer)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path TO '' AS $$
DECLARE
  v_dia date := (now() AT TIME ZONE 'America/Sao_Paulo')::date;
  v_r double precision := random();
  v_tipo text; v_item text := ''; v_saldo int;
  v_itens text[] := ARRAY['gyoza', 'dango', 'redvelvet', 'tiramisu', 'espuma'];
BEGIN
  IF auth.uid() IS NULL THEN RETURN json_build_object('ok', false, 'erro', 'sem_conta'); END IF;
  IF EXISTS (SELECT 1 FROM public.players p WHERE p.id = auth.uid() AND coalesce(p.bloqueado, false)) THEN RETURN json_build_object('ok', false, 'erro', 'conta'); END IF;
  IF coalesce(p_pontos, 0) < 600 OR p_pontos > 20000 THEN RETURN json_build_object('ok', false, 'erro', 'pontos'); END IF;
  IF EXISTS (SELECT 1 FROM public.handshake_premios WHERE user_id = auth.uid() AND dia = v_dia) THEN RETURN json_build_object('ok', false, 'erro', 'hoje'); END IF;
  v_tipo := CASE WHEN v_r < 0.4 THEN 'ticket' ELSE 'pet' END;
  IF v_tipo = 'ticket' THEN
    INSERT INTO private.kt_ticket_wallet(player_id, balance) VALUES (auth.uid(), 1)
      ON CONFLICT (player_id) DO UPDATE SET balance = private.kt_ticket_wallet.balance + 1, updated_at = clock_timestamp()
      WHERE private.kt_ticket_wallet.balance < 99
      RETURNING balance INTO v_saldo;
    IF NOT FOUND THEN v_tipo := 'pet'; ELSE
      INSERT INTO private.kt_ticket_events(player_id, actor_id, delta, reason) VALUES (auth.uid(), auth.uid(), 1, 'handshake');
    END IF;
  END IF;
  IF v_tipo = 'pet' THEN v_item := v_itens[1 + floor(random() * array_length(v_itens, 1))::int]; END IF;
  INSERT INTO public.handshake_premios(user_id, dia, pontos, tipo, item) VALUES (auth.uid(), v_dia, p_pontos, v_tipo, v_item);
  RETURN json_build_object('ok', true, 'tipo', v_tipo, 'item', v_item, 'tickets', v_saldo);
END $$;
REVOKE ALL ON FUNCTION public.handshake_premio(integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.handshake_premio(integer) TO authenticated;

COMMIT;
