-- TsuLiPa⭐World — 3A.4 - regression security tests (HOMOLOGAÇÃO ONLY).
-- Simula JWTs de teste e faz ROLLBACK: NÃO cria contas reais nem saves.
-- Não executar no Supabase de produção.
BEGIN;
INSERT INTO karaoke_lab.seats (user_id, lease_expires)
VALUES ('00000000-0000-0000-0000-000000000001', clock_timestamp()+interval '3 minutes');
UPDATE karaoke_lab.room
SET singer_id='00000000-0000-0000-0000-000000000001'::uuid,
    started_at=clock_timestamp(), ends_at=clock_timestamp()+interval '60 seconds'
WHERE id=1;
SET LOCAL ROLE authenticated;
DO $$
DECLARE
  v jsonb;
  singer uuid:='00000000-0000-0000-0000-000000000001';
BEGIN
  PERFORM set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000002',true);
  v:=public.karaoke_ensaio('status');
  IF v ? 'singerId' OR v->>'amISinging'<>'false'
     OR strpos(v::text,singer::text)>0 OR v->>'seatToken' IS NOT NULL THEN
    RAISE EXCEPTION 'Outsider should not learn singer identity or token: %',v;
  END IF;
  PERFORM set_config('request.jwt.claim.sub',singer::text,true);
  v:=public.karaoke_ensaio('status');
  IF v ? 'singerId' OR v->>'amISinging'<>'true'
     OR strpos(v::text,singer::text)>0 THEN
    RAISE EXCEPTION 'Singer response should use self-only flag: %',v;
  END IF;
  RAISE NOTICE 'PASS: status keeps singer UUID and seat token private';
END $$;
ROLLBACK;
