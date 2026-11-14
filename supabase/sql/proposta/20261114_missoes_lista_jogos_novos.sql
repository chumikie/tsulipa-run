-- APLICAR LOGO DEPOIS DO MERGE DA #88 (OK do dono já dado em 14/11/2026).
-- Antes do merge o site oficial não tem Jardim, Battle e Studio, e a missão ficaria impossível.
-- Foi aplicado por alguns minutos em 14/11 e revertido pelo mesmo motivo.
-- A contagem (missoes_progresso) já está aplicada: supabase/sql/aplicado/20261114_missoes_jogos_novos.sql.
CREATE OR REPLACE FUNCTION public.missoes_lista()
RETURNS TABLE(k text,nivel integer,meta integer,premio integer,fam text)
LANGUAGE sql IMMUTABLE SET search_path TO '' AS $$
  SELECT * FROM (VALUES
   ('corra2',1,2,10,'corrida'),('coracao',1,1,10,'coracao'),('recado',1,1,10,'recado'),
   ('mini',1,1,10,'mini'),('pet',1,1,10,'pet'),
   ('handshake',1,1,10,'evento'),('cafe',1,1,10,'evento'),
   ('jardim',1,1,10,'jardim'),('battle',1,1,10,'battle'),
   ('corra3',2,3,15,'corrida'),('estrelas50',2,50,15,'estrela'),
   ('pontos2000',2,2000,15,'ponto'),('tsulipa',2,3,15,'tsulipa'),
   ('foto',2,1,15,'foto'),
   ('corra5',3,5,20,'corrida'),('pontos5000',3,5000,20,'ponto'),
   ('estrelas100',3,100,20,'estrela')
  ) AS v(k,nivel,meta,premio,fam)
$$;

